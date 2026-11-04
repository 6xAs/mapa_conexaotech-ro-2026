import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
const project = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(project, 'dist');
const read = name => readFile(path.join(dist, name), 'utf8');
let [html, svg, json, css, js] = await Promise.all(['index.html', 'assets/map.svg', 'data/spaces.json', 'styles.css', 'app.js'].map(read));
const data = JSON.parse(json);
const agendaJSON=await read('data/programacao.json');
const agenda=JSON.parse(agendaJSON);
assert(/^\d{4}-\d{2}-\d{2}$/.test(agenda.date));
for(const event of agenda.events){
  assert(data.some(s=>s.id===event.spaceId),'Atividade sem espaço: '+event.spaceId);
  assert(/^([01]\d|2[0-3]):[0-5]\d$/.test(event.start),'Horário inválido');
  assert(event.title||event.status==='nao-informado-no-roteiro','Título ausente sem sinalização');
  assert(Array.isArray(event.speakers));
}
assert.equal(new Set(data.map(s => s.id)).size, data.length, 'IDs duplicados');
assert.deepEqual(data.filter(s => s.entry).map(s => s.id).sort(), ['credenciamento', 'informacoes']);
for (const s of data) {
  assert(s.x >= 400 && s.y >= 70 && s.x+s.width <= 1660 && s.y+s.height <= 1060, s.id);
}
assert(svg.includes('viewBox="400 70 1260 990"'));
assert(css.includes('prefers-reduced-motion'));
assert(html.includes('Desenvolvido e criado por 6xAs'));
assert(html.includes('https://my-user-profile.vercel.app'));
const template = /(<template id="map-template">)[\s\S]*?(<\/template>)/;
const records = /(<script type="application\/json" id="spaces-data">)[\s\S]*?(<\/script>)/;
assert(template.test(html) && records.test(html), 'Estrutura do HTML ausente');
const programRecords=/(<script type="application\/json" id="program-data">)[\s\S]*?(<\/script>)/;
assert(programRecords.test(html),'Programação incorporada ausente');
const synced = html.replace(template, (_, a, b) => a+svg+b).replace(records, (_, a, b) => a+json+b).replace(programRecords,(_,a,b)=>a+agendaJSON+b);
if (process.argv.includes('--check')) {
  assert.equal(html, synced, 'Execute npm run build para sincronizar SVG/dados no HTML');
  console.log(`Verificação OK: ${data.length} ambientes e 2 entradas principais.`);
} else {
  await writeFile(path.join(dist,'index.html'), synced);
  html = synced.replace('<link rel="stylesheet" href="styles.css">', () => `<style>${css}</style>`)
    .replace('<script src="app.js" defer></script>', () => `<script>${js}</script>`);
  for (const logo of ['evento-roxo.png','unisapiens.png']) {
    const base64 = (await readFile(path.join(dist,'assets/logos',logo))).toString('base64');
    html = html.replaceAll(`assets/logos/${logo}`, `data:image/png;base64,${base64}`);
  }
  await mkdir(path.join(project,'artifacts'), {recursive:true});
  await writeFile(path.join(project,'artifacts/mapa-conexaotech.html'), html);
  console.log('HTML sincronizado. Arquivo independente: artifacts/mapa-conexaotech.html');
}
