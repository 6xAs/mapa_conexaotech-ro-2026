'use strict';
const viewport = document.querySelector('#viewport');
const root = document.querySelector('#map-root');
const value = document.querySelector('#zoom-value');
const MIN = 1, MAX = 8;
let svg, zoom = 1, pan = {x:0,y:0}, center={x:1030,y:565}, data = [], pointers = new Map(), previous, pendingMarker, cameraAnimation=0;
function render() {
  if (!svg) return;
  const {w,h}=viewSize();
  center.x=Math.max(400+Math.min(w*.15,630),Math.min(1660-Math.min(w*.15,630),center.x));
  center.y=Math.max(70+Math.min(h*.15,495),Math.min(1060-Math.min(h*.15,495),center.y));
  pan={x:center.x-w/2,y:center.y-h/2};
  svg.setAttribute('viewBox', `${pan.x} ${pan.y} ${w} ${h}`);
  value.textContent = `${Math.round(zoom * 100)}%`;
  document.querySelector('#zoom-out').disabled = zoom <= MIN;
  document.querySelector('#zoom-in').disabled = zoom >= MAX;
  updateMarkers();
}
function viewSize(z=zoom){
  const ratio=viewport.clientWidth/Math.max(1,viewport.clientHeight);
  return {w:Math.max(1260,990*ratio)/z,h:Math.max(990,1260/ratio)/z};
}
const reducedMotion=matchMedia('(prefers-reduced-motion:reduce)');
function stopCamera(){cancelAnimationFrame(cameraAnimation);cameraAnimation=0;}
function flyTo(targetZoom,destination){
  stopCamera();
  if(reducedMotion.matches||svg.classList.contains('motion-paused')){
    zoom=targetZoom;center={...destination};render();return;
  }
  const initial={zoom,x:center.x,y:center.y};
  const started=performance.now();
  function frame(now){
    const progress=Math.min(1,(now-started)/260),ease=1-Math.pow(1-progress,3);
    zoom=initial.zoom+(targetZoom-initial.zoom)*ease;
    center={x:initial.x+(destination.x-initial.x)*ease,y:initial.y+(destination.y-initial.y)*ease};render();
    cameraAnimation=progress<1?requestAnimationFrame(frame):0;
  }
  updateMarkers();cameraAnimation=requestAnimationFrame(frame);
}
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)stopCamera();});
function changeZoom(next, anchor) {
  stopCamera();
  if (!svg) return;
  const before = anchor ? point(anchor.x,anchor.y) : {...center};
  const old = zoom; zoom = Math.max(MIN,Math.min(MAX,next));
  const factor = old / zoom;
  center.x = before.x - (before.x-center.x)*factor;
  center.y = before.y - (before.y-center.y)*factor;
  render();
}
function reset() {
  stopCamera();
  closeDetails(false);selectedId=null;zoom=1;center={x:1030,y:565};render();
  document.querySelectorAll('[data-location]').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.foot-trail,.space').forEach(g=>g.classList.remove('active','is-selected'));
  document.querySelectorAll('.space').forEach(g=>g.setAttribute('aria-pressed','false'));
  updateMarkers();
}
function point(x,y) {
  return new DOMPoint(x,y).matrixTransform(svg.getScreenCTM().inverse());
}
function gesture() {
  const p = [...pointers.values()];
  return {x:p.reduce((a,v)=>a+v.x,0)/p.length,y:p.reduce((a,v)=>a+v.y,0)/p.length,
    distance:p.length>1?Math.hypot(p[1].x-p[0].x,p[1].y-p[0].y):0};
}
viewport.addEventListener('pointerdown',e=>{
  if (!svg || (e.pointerType==='mouse' && e.button!==0)) return;
  stopCamera();
  const marker=e.target.closest?.('[data-marker],[data-space]');
  pendingMarker=pointers.size?null:marker?{id:marker.dataset.marker||marker.dataset.space,x:e.clientX,y:e.clientY}:null;
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  viewport.setPointerCapture(e.pointerId);previous=gesture();viewport.classList.add('dragging');
});
viewport.addEventListener('pointermove',e=>{
  if(!pointers.has(e.pointerId)||!svg)return;
  if(pendingMarker&&Math.hypot(e.clientX-pendingMarker.x,e.clientY-pendingMarker.y)>6)pendingMarker=null;
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});const next=gesture();
  if(previous.distance>0 && next.distance>0)changeZoom(zoom*next.distance/previous.distance,{x:previous.x,y:previous.y});
  const a=point(previous.x,previous.y),b=point(next.x,next.y);
  center.x-=b.x-a.x;center.y-=b.y-a.y;render();previous=next;
});
function release(e){const chosen=e.type==='pointerup'?pendingMarker:null;pendingMarker=null;pointers.delete(e.pointerId);previous=pointers.size?gesture():null;if(!pointers.size){viewport.classList.remove('dragging');if(chosen)selectSpace(chosen.id);}}
viewport.addEventListener('pointerup',release);viewport.addEventListener('pointercancel',release);viewport.addEventListener('lostpointercapture',release);
viewport.addEventListener('wheel',e=>{if(!svg)return;e.preventDefault();changeZoom(zoom*Math.exp(-e.deltaY*.0015),{x:e.clientX,y:e.clientY});},{passive:false});
viewport.addEventListener('keydown',e=>{
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','0','Home'].includes(e.key))stopCamera();
  const step=70/zoom;
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','0','Home'].includes(e.key))e.preventDefault();
  if(e.key==='ArrowLeft')center.x-=step;if(e.key==='ArrowRight')center.x+=step;
  if(e.key==='ArrowUp')center.y-=step;if(e.key==='ArrowDown')center.y+=step;
  if(e.key==='+'||e.key==='=')changeZoom(zoom*1.25);else if(e.key==='-')changeZoom(zoom/1.25);else if(e.key==='0'||e.key==='Home')reset();else render();
});
document.querySelector('#zoom-in').onclick=()=>changeZoom(zoom*1.25);
document.querySelector('#zoom-out').onclick=()=>changeZoom(zoom/1.25);
document.querySelector('#reset').onclick=reset;
function selectSpace(id){
  const s=data.find(s=>s.id===id);if(!s||!svg)return;
  document.querySelectorAll('.foot-trail').forEach(g=>g.classList.toggle('active',Boolean(s.entry)&&(g.id === (s.id==='informacoes'?'trail-acces-informations':'trail-acces-credenciamento') || g.id==='trail-liaison-principale')));
  document.querySelectorAll('.space').forEach(g=>{const chosen=g.dataset.space===s.id;g.classList.toggle('is-selected',chosen);g.setAttribute('aria-pressed',String(chosen));});
  selectedId=id;
  if(!matches(s))clearSearch(false);
  if(sidebarOpen)setSidebar(false);
  showDetails(s);
  requestAnimationFrame(()=>locateSelected());
  document.querySelectorAll('[data-location]').forEach(b=>b.classList.toggle('active',b.dataset.location===id));
  if(mobileSidebar.matches&&sidebarOpen){setSidebar(false);viewport.focus({preventScroll:true});}
  document.querySelector('#map-status').textContent=`${s.name}${s.floor?', '+s.floor:''} localizado no mapa.`;
}
document.querySelectorAll('[data-location]').forEach(button=>button.onclick=()=>selectSpace(button.dataset.location));
const help=document.querySelector('#help');
help.onclick=()=>{const open=help.getAttribute('aria-expanded')!=='true';help.setAttribute('aria-expanded',String(open));document.querySelector('#map-help').hidden=!open;};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){help.setAttribute('aria-expanded','false');document.querySelector('#map-help').hidden=true;}});
async function load(){
  document.querySelector('.load-error').hidden=true;
  try {
    const markup=document.querySelector('#map-template').innerHTML;
    const spaces=JSON.parse(document.querySelector('#spaces-data').textContent);
    const doc=new DOMParser().parseFromString(markup,'image/svg+xml');
    if(doc.querySelector('parsererror'))throw new Error('Planta inválida');
    root.replaceChildren(document.importNode(doc.documentElement,true));svg=root.querySelector('svg');svg.setAttribute('role','group');data=spaces;initializeSearch();attachSpaceInteractions();reset();
    svg.classList.toggle('document-idle',document.hidden);
    svg.classList.toggle('motion-paused',document.body.classList.contains('animations-paused'));
    requestAnimationFrame(()=>{fitLabels();createMarkers();});
    if(document.fonts)document.fonts.ready.then(()=>{fitLabels();markers.forEach(m=>m.wordWidth=null);updateMarkers();});
  }catch(error){document.querySelector('.load-error').hidden=false;console.error('Falha ao carregar mapa:',error);}
}
// Contrôle de largeur basé sur les métriques réelles SVG, après insertion au DOM.
function fitLabels(){
  if(!svg)return;
  svg.querySelectorAll('.room-label').forEach(text=>{
    const max=Number(text.dataset.maxWidth);
    const measured=text.getComputedTextLength();
    if(measured>max && max>0){
      const size=parseFloat(getComputedStyle(text).fontSize);
      text.style.fontSize=`${size*max/measured*.97}px`;
    }
  });
}
const motionButton=document.querySelector('#toggle-motion');
motionButton.onclick=()=>{
  if(!svg)return;
  const paused=svg.classList.toggle('motion-paused');
  document.body.classList.toggle('animations-paused',paused);
  if(paused)stopCamera();
  const label=paused?'Retomar animações':'Pausar animações';
  motionButton.setAttribute('aria-pressed',String(paused));
  motionButton.setAttribute('aria-label',label);motionButton.title=label;
  document.querySelector('#motion-glyph').setAttribute('d',paused?'M8 5l11 7-11 7Z':'M9 5v14M15 5v14');
};
// A navegação começa recolhida em toda visita; não depende de armazenamento local.
const sidebar=document.querySelector('#explore-sidebar');
const sidebarToggle=document.querySelector('#sidebar-toggle');
const sidebarClose=document.querySelector('#sidebar-close');
const sidebarBackdrop=document.querySelector('#sidebar-backdrop');
const layout=document.querySelector('#map-layout');
const mobileSidebar=matchMedia('(max-width:700px)');
let sidebarOpen=false;
function applySidebarMode(){
  const modal=sidebarOpen&&mobileSidebar.matches;
  sidebarBackdrop.hidden=!modal;
  document.querySelector('.map-area').inert=modal;
  document.querySelector('#site-header').inert=modal;
  document.querySelector('#quick-nav').inert=modal;
  document.querySelector('footer').inert=modal;
  if(modal){sidebar.setAttribute('role','dialog');sidebar.setAttribute('aria-modal','true');}
  else{sidebar.removeAttribute('role');sidebar.removeAttribute('aria-modal');}
}
function setSidebar(open){
  sidebarOpen=open;
  sidebar.hidden=!open;sidebar.inert=!open;
  sidebarToggle.setAttribute('aria-expanded',String(open));
  layout.classList.toggle('sidebar-open',open);
  applySidebarMode();
  if(open){closeDetails(false);searchInput.focus({preventScroll:true});}
  else sidebarToggle.focus({preventScroll:true});
}
sidebarToggle.onclick=()=>setSidebar(!sidebarOpen);
sidebarClose.onclick=()=>setSidebar(false);
sidebarBackdrop.onclick=()=>setSidebar(false);
mobileSidebar.addEventListener('change',()=>{applySidebarMode();if(sidebarOpen&&mobileSidebar.matches)sidebarClose.focus({preventScroll:true});});
document.addEventListener('keydown',e=>{
  if(!sidebarOpen)return;
  if(e.key==='Escape'){e.preventDefault();setSidebar(false);return;}
  if(e.key==='Tab'&&mobileSidebar.matches){
    const items=[...sidebar.querySelectorAll('button,a[href],input,select')].filter(el=>!el.disabled&&el.getClientRects().length);
    const first=items[0],last=items[items.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
});
// Etiquetas na mesma camada vetorial, com tamanho legível conforme o zoom.
const markerNS='http://www.w3.org/2000/svg';
let markers=[];
function svgElement(tag,attributes={}){
  const element=document.createElementNS(markerNS,tag);
  Object.entries(attributes).forEach(([key,value])=>element.setAttribute(key,value));return element;
}
function createMarkers(){
  svg.querySelector('#map-markers')?.remove();markers=[];
  const layer=svgElement('g',{id:'map-markers','aria-label':'Identificações dos ambientes'});
  svg.querySelector('#camera').append(layer);
  const symbols={purple:'M4 16V8l8-4 8 4v8l-8 4Z M12 4v16M4 8l8 4 8-4',blue:'M3 4h18v13H3ZM8 21h8M12 17v4',green:'M13 4h7v16h-7M3 12h12M9 7l5 5-5 5',orange:'M3 11h18M4 9c1-8 15-8 16 0ZM4 15h16v5H4Z',cyan:'M2 16q3-4 6 0t6 0 6 0M2 21q3-4 6 0t6 0 6 0M6 4h12',neutral:'M5 4h14v16H5ZM9 8h6M9 12h6M9 16h6'};
  for(const record of data){
    const region=svg.querySelector(`#space-${record.id}`);
    if(!region)continue;
    const labels=[...region.querySelectorAll('.room-label')];if(!labels.length)continue;
    const names=record.id==='maker'?labels.slice(0,2):record.entry?labels:record.floor?labels:labels.slice(0,1);
    // Anchor follows the existing label, so no geographic point is guessed.
    const first=labels[0];const rotated=Boolean(record.vertical);
    const transform=first.transform.baseVal.consolidate()?.matrix;
    const anchor=rotated?{x:transform.e,y:transform.f}:{x:Number(first.getAttribute('x')),y:record.entry?Number(first.getAttribute('y')):(Number(names[0].getAttribute('y'))+Number(names.at(-1).getAttribute('y')))/2};
    let lines=record.id==='maker'?['Espaço','Maker']:record.entry?[record.name,'Entrada principal']:record.floor?[record.name.replace('Sala ','Sala '),record.floor]:[record.name];
    if(record.id==='sala-whashington')lines=['Sala Whashington',record.floor];
    const group=svgElement('g',{class:`map-marker theme-${record.visualTheme}`,'data-marker':record.id,role:'button',tabindex:'-1','aria-label':`Localizar ${record.name}${record.floor?', '+record.floor:''}${record.locationHint?', '+record.locationHint:''}`,'aria-pressed':'false'});
    const title=svgElement('title');title.textContent=`Localizar ${record.name}`;group.append(title);
    const bg=svgElement('rect',{class:'marker-surface',rx:'7'});group.append(bg);
    const icon=svgElement('g',{class:'marker-symbol'});icon.append(svgElement('path',{d:record.category==='Bebedouros'?'M12 3C9 8 5 11 5 15a7 7 0 0 0 14 0c0-4-4-7-7-12Z':record.category==='Banheiros'?symbols.neutral:symbols[record.visualTheme]||symbols.neutral}));group.append(icon);
    const words=svgElement('g',{class:'marker-words'});
    lines.forEach((line,i)=>{const text=svgElement('text',{x:'0',y:String(i*14),'dominant-baseline':'middle',class:i&&record.id!=='maker'?'marker-caption':'marker-name'});text.textContent=line;words.append(text);});group.append(words);
    group.addEventListener('click',e=>{if(e.detail===0){e.stopPropagation();selectSpace(record.id);}});
    group.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();selectSpace(record.id);}});

    layer.append(group);
    markers.push({record,region,group,bg,icon,words,names,anchor,rotated});
  }
  updateMarkers();
}
function updateMarkers(){
  if(!svg||!markers.length)return;
  const matrix=svg.getScreenCTM();if(!matrix)return;
  const scale=Math.hypot(matrix.a,matrix.b);if(!scale)return;
  const bounds=viewport.getBoundingClientRect();
  for(const m of markers){
    m.group.style.display='';
    const wordWidth=m.wordWidth??(m.wordWidth=Math.max(...[...m.words.children].map(e=>e.getComputedTextLength())));
    const width=wordWidth+40,height=m.words.children.length>1?40:30;
    const roomSpan=m.rotated?m.record.height:m.record.width;
    const selected=m.region.classList.contains('is-selected');
    const fits=(width+6<=roomSpan*scale)&&(height+4<=(m.rotated?m.record.width:m.record.height)*scale);
    // Show a full label only when it fits its room; otherwise retain the original text.
    const point=new DOMPoint(m.anchor.x,m.anchor.y).matrixTransform(matrix);
    const halfWidth=(m.rotated?height:width)/2,halfHeight=(m.rotated?width:height)/2;
    const onScreen=point.x-halfWidth>=bounds.left+2&&point.x+halfWidth<=bounds.right-2&&point.y-halfHeight>=bounds.top+2&&point.y+halfHeight<=bounds.bottom-2;
    const visible=fits&&onScreen&&matches(m.record);
    m.group.style.display=visible?'':'none';
    m.group.setAttribute('tabindex',visible?'0':'-1');m.group.setAttribute('aria-hidden',String(!visible));
    m.group.setAttribute('aria-pressed',String(selected));
    m.names.forEach(e=>e.style.visibility=visible?'hidden':'');
    if(!visible)continue;
    const x=m.anchor.x,y=m.anchor.y;
    m.group.setAttribute('transform',`translate(${x} ${y}) rotate(${m.rotated?-90:0}) scale(${1/scale})`);
    m.bg.setAttribute('x',-width/2);m.bg.setAttribute('y',-height/2);m.bg.setAttribute('width',width);m.bg.setAttribute('height',height);
    m.icon.setAttribute('transform',`translate(${-width/2+9} -8) scale(.65)`);
    m.words.setAttribute('transform',`translate(${-width/2+31} ${m.words.children.length>1?-7:0})`);
    m.group.classList.toggle('marker-selected',selected);
  }
}
document.addEventListener('visibilitychange',()=>{svg?.classList.toggle('document-idle',document.hidden);if(document.hidden)stopCamera();});
new ResizeObserver(()=>requestAnimationFrame(render)).observe(viewport);
// Busca e informações usam somente os registros da planta.
const searchInput=document.querySelector('#space-search');
const categoryFilter=document.querySelector('#category-filter');
const resultList=document.querySelector('#search-results');
const detailPanel=document.querySelector('#space-details');
let selectedId=null,selectionOrigin=null;
function normalize(value){return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/([a-z -])0+(\d)/g,'$1$2').replace(/[^a-z0-9]+/g,' ').trim().replace(/\b0+(\d)/g,'$1');}
function matches(record){
  const category=categoryFilter.value;
  if(category&&record.category!==category)return false;
  const query=normalize(searchInput.value);if(!query)return true;
  const aliases=record.id.startsWith('lab-')?`laboratorio ${parseInt(record.id.slice(4),10)}`:'';
  const text=normalize(`${record.name} ${record.id} ${record.locationHint||''} ${(record.searchTerms||[]).join(' ')} ${aliases}`);
  return query.split(' ').every(part=>text.includes(part))||text.replaceAll(' ','').includes(query.replaceAll(' ',''));
}
function initializeSearch(){
  categoryFilter.replaceChildren(new Option('Todas as categorias',''));
  [...new Set(data.map(s=>s.category))].sort((a,b)=>a.localeCompare(b,'pt-BR')).forEach(c=>categoryFilter.add(new Option(c,c)));
  document.querySelectorAll('[data-count]').forEach(el=>el.textContent=String(data.filter(s=>s.category===el.dataset.count).length));
  renderResults();
}
function renderResults(){
  const list=data.filter(matches).sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
  resultList.replaceChildren();
  for(const s of list){
    const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.className='result-button';button.dataset.result=s.id;
    const dot=document.createElement('i');dot.className=`dot ${s.visualTheme==='neutral'?'neutral':s.visualTheme}`;dot.setAttribute('aria-hidden','true');
    const text=document.createElement('span'),name=document.createElement('strong'),sub=document.createElement('small');name.textContent=s.name;sub.textContent=[s.floor,s.locationHint||s.category].filter(Boolean).join(' · ');text.append(name,sub);button.append(dot,text);button.onclick=()=>selectSpace(s.id);li.append(button);resultList.append(li);
  }
  document.querySelector('#results-count').textContent=`${list.length} ${list.length===1?'local':'locais'}`;
  document.querySelector('#no-results').hidden=list.length>0;
  document.querySelector('#clear-search').hidden=!searchInput.value&&!categoryFilter.value;
  document.querySelectorAll('[data-category]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.category===categoryFilter.value)));
  if(svg){
    data.forEach(s=>svg.querySelector(`#space-${s.id}`)?.classList.toggle('is-filtered',!matches(s)));
    updateMarkers();
  }
}
function clearSearch(focus=true){searchInput.value='';categoryFilter.value='';renderResults();if(focus)searchInput.focus();}
searchInput.addEventListener('input',renderResults);categoryFilter.addEventListener('change',renderResults);
document.querySelector('#clear-search').onclick=()=>clearSearch();
document.querySelectorAll('[data-category]').forEach(button=>button.onclick=()=>{searchInput.value='';categoryFilter.value=button.dataset.category;renderResults();setSidebar(true);});
document.querySelector('#search-form').onsubmit=e=>{e.preventDefault();const first=resultList.querySelector('button');if(first)first.click();};
function attachSpaceInteractions(){
  for(const s of data){
    const region=svg.querySelector(`#space-${s.id}`);if(!region)continue;
    region.setAttribute('role','button');region.setAttribute('aria-pressed','false');region.setAttribute('tabindex','0');region.setAttribute('aria-label',`${s.name}${s.locationHint?', '+s.locationHint:''}`);
    region.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();selectSpace(s.id);}});
    region.addEventListener('click',e=>{if(e.detail===0)selectSpace(s.id);});
    region.addEventListener('focus',()=>{
      const bounds=region.getBoundingClientRect(),v=viewport.getBoundingClientRect();
      if(bounds.right<v.left||bounds.left>v.right||bounds.bottom<v.top||bounds.top>v.bottom){stopCamera();center={x:s.x+s.width/2,y:s.y+s.height/2};render();}
    });
  }
}
function showDetails(record){
  selectionOrigin=document.activeElement;
  detailPanel.hidden=false;document.querySelector('.map-area').classList.add('has-details');
  detailPanel.dataset.theme=record.visualTheme;
  document.querySelector('#detail-title').textContent=record.name;
  document.querySelector('#detail-category').textContent=record.category;
  const location=document.querySelector('#detail-location');location.textContent=record.locationHint||'';location.hidden=!record.locationHint;
  const facts=document.querySelector('#detail-facts');facts.replaceChildren();
  function fact(label,value){const term=document.createElement('dt'),definition=document.createElement('dd');term.textContent=label;definition.textContent=value;facts.append(term,definition);}
  if(record.floor)fact('Pavimento',record.floor);
  if(record.category==='Bebedouros')fact('Serviço','Água para beber');
  if(record.entry)fact('Acesso','Entrada principal confirmada');
  if(record.name.startsWith('Lab ')||record.name.startsWith('APG')||record.name.startsWith('Anfiteatro'))fact('Identificação na planta',record.name);
  if(!record.floor&&!record.entry)fact('Referência','Planta fornecida do evento');
  document.querySelector('#detail-note').textContent=record.validation==='grafia-a-validar'?'Nome transcrito da planta; grafia ainda em validação.':record.category==='Bebedouros'?'Ponto de água indicado pelo símbolo na planta fornecida.':record.validation==='pavimento-confirmado-pelo-usuario'?'Pavimento confirmado: mesmo plano do Auditório e da Sala Whashington.':record.category==='Estacionamento'?'Posição indicada pela inscrição na planta; não há setores oficiais informados.':record.id==='escadas'||record.id==='elevador'?'Acesso vertical indicado na planta. Percurso acessível não confirmado.':'Programação e informações complementares não foram fornecidas.';
  document.querySelector('#detail-title').focus({preventScroll:true});
}
function closeDetails(returnFocus=true){
  const open=!detailPanel.hidden;detailPanel.hidden=true;document.querySelector('.map-area').classList.remove('has-details');
  if(open&&returnFocus){if(selectionOrigin?.isConnected&&selectionOrigin.getClientRects().length&&!selectionOrigin.closest('[hidden],[inert]'))selectionOrigin.focus({preventScroll:true});else viewport.focus({preventScroll:true});}
}
function locateSelected(){
  const s=data.find(s=>s.id===selectedId);if(!s||!svg)return;
  const base=viewSize(1),scale=viewport.clientWidth/base.w;
  const desired=Math.min(Math.min(260,viewport.clientWidth*.58)/s.width,Math.min(300,viewport.clientHeight*.65)/s.height);
  const target=Math.max(1.8,Math.min(MAX,desired/scale));
  flyTo(target,{x:s.x+s.width/2,y:s.y+s.height/2});
}
document.querySelector('#detail-close').onclick=()=>closeDetails();
document.querySelector('#detail-locate').onclick=locateSelected;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!detailPanel.hidden){e.preventDefault();closeDetails();}});
new ResizeObserver(()=>{
  if(!detailPanel.hidden)document.querySelector('.map-area').style.setProperty('--detail-height',`${Math.ceil(detailPanel.getBoundingClientRect().height)}px`);
}).observe(detailPanel);
document.querySelector('#retry').onclick=load;
load();
