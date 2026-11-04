'use strict';
const viewport = document.querySelector('#viewport');
const root = document.querySelector('#map-root');
const value = document.querySelector('#zoom-value');
const MIN = 1, MAX = 5;
let svg, zoom = 1, pan = {x:0,y:0}, data = [], pointers = new Map(), previous, pendingMarker, cameraAnimation=0;
function render() {
  if (!svg) return;
  const w = 1260 / zoom, h = 990 / zoom;
  pan.x = Math.max(400-w*.65, Math.min(1660-w*.35, pan.x));
  pan.y = Math.max(70-h*.65, Math.min(1060-h*.35, pan.y));
  svg.setAttribute('viewBox', `${pan.x} ${pan.y} ${w} ${h}`);
  value.textContent = `${Math.round(zoom * 100)}%`;
  document.querySelector('#zoom-out').disabled = zoom <= MIN;
  document.querySelector('#zoom-in').disabled = zoom >= MAX;
  updateMarkers();
}
const reducedMotion=matchMedia('(prefers-reduced-motion:reduce)');
function stopCamera(){cancelAnimationFrame(cameraAnimation);cameraAnimation=0;}
function flyTo(targetZoom,center){
  stopCamera();
  if(reducedMotion.matches||svg.classList.contains('motion-paused')){
    zoom=targetZoom;pan={x:center.x-630/zoom,y:center.y-495/zoom};render();return;
  }
  const initial={zoom,x:pan.x+630/zoom,y:pan.y+495/zoom};
  const started=performance.now();
  function frame(now){
    const progress=Math.min(1,(now-started)/260),ease=1-Math.pow(1-progress,3);
    zoom=initial.zoom+(targetZoom-initial.zoom)*ease;
    const cx=initial.x+(center.x-initial.x)*ease,cy=initial.y+(center.y-initial.y)*ease;
    pan={x:cx-630/zoom,y:cy-495/zoom};render();
    cameraAnimation=progress<1?requestAnimationFrame(frame):0;
  }
  updateMarkers();cameraAnimation=requestAnimationFrame(frame);
}
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)stopCamera();});
function changeZoom(next, anchor) {
  stopCamera();
  if (!svg) return;
  const before = anchor ? point(anchor.x,anchor.y) : {x:pan.x+630/zoom,y:pan.y+495/zoom};
  const old = zoom; zoom = Math.max(MIN,Math.min(MAX,next));
  const factor = old / zoom;
  pan.x = before.x - (before.x-pan.x)*factor;
  pan.y = before.y - (before.y-pan.y)*factor;
  render();
}
function reset() {
  stopCamera();
  zoom=1;pan={x:400,y:70};render();
  document.querySelectorAll('[data-location]').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.foot-trail,.space').forEach(g=>g.classList.remove('active','is-selected'));
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
  const marker=e.target.closest?.('[data-marker]');
  pendingMarker=pointers.size?null:marker?{id:marker.dataset.marker,x:e.clientX,y:e.clientY}:null;
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  viewport.setPointerCapture(e.pointerId);previous=gesture();viewport.classList.add('dragging');
});
viewport.addEventListener('pointermove',e=>{
  if(!pointers.has(e.pointerId)||!svg)return;
  if(pendingMarker&&Math.hypot(e.clientX-pendingMarker.x,e.clientY-pendingMarker.y)>6)pendingMarker=null;
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});const next=gesture();
  if(previous.distance>0 && next.distance>0)changeZoom(zoom*next.distance/previous.distance,{x:previous.x,y:previous.y});
  const a=point(previous.x,previous.y),b=point(next.x,next.y);
  pan.x-=b.x-a.x;pan.y-=b.y-a.y;render();previous=next;
});
function release(e){const chosen=e.type==='pointerup'?pendingMarker:null;pendingMarker=null;pointers.delete(e.pointerId);previous=pointers.size?gesture():null;if(!pointers.size){viewport.classList.remove('dragging');if(chosen)selectSpace(chosen.id);}}
viewport.addEventListener('pointerup',release);viewport.addEventListener('pointercancel',release);viewport.addEventListener('lostpointercapture',release);
viewport.addEventListener('wheel',e=>{if(!svg)return;e.preventDefault();changeZoom(zoom*Math.exp(-e.deltaY*.0015),{x:e.clientX,y:e.clientY});},{passive:false});
viewport.addEventListener('keydown',e=>{
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','0','Home'].includes(e.key))stopCamera();
  const step=70/zoom;
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','0','Home'].includes(e.key))e.preventDefault();
  if(e.key==='ArrowLeft')pan.x-=step;if(e.key==='ArrowRight')pan.x+=step;
  if(e.key==='ArrowUp')pan.y-=step;if(e.key==='ArrowDown')pan.y+=step;
  if(e.key==='+'||e.key==='=')changeZoom(zoom*1.25);else if(e.key==='-')changeZoom(zoom/1.25);else if(e.key==='0'||e.key==='Home')reset();else render();
});
document.querySelector('#zoom-in').onclick=()=>changeZoom(zoom*1.25);
document.querySelector('#zoom-out').onclick=()=>changeZoom(zoom/1.25);
document.querySelector('#reset').onclick=reset;
function selectSpace(id){
  const s=data.find(s=>s.id===id);if(!s||!svg)return;
  document.querySelectorAll('.foot-trail').forEach(g=>g.classList.toggle('active',Boolean(s.entry)&&(g.id === (s.id==='informacoes'?'trail-acces-informations':'trail-acces-credenciamento') || g.id==='trail-liaison-principale')));
  document.querySelectorAll('.space').forEach(g=>g.classList.toggle('is-selected',g.dataset.space===s.id));
  flyTo(s.entry?2.4:2.8,{x:s.x+s.width/2,y:s.y+s.height/2});
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
    root.replaceChildren(document.importNode(doc.documentElement,true));svg=root.querySelector('svg');svg.setAttribute('role','group');data=spaces;reset();
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
  if(open)sidebarClose.focus({preventScroll:true});
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
    const items=[...sidebar.querySelectorAll('button,a[href]')].filter(el=>!el.disabled);
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
    const group=svgElement('g',{class:`map-marker theme-${record.visualTheme}`,'data-marker':record.id,role:'button',tabindex:'-1','aria-label':`Localizar ${record.name}${record.floor?', '+record.floor:''}`,'aria-pressed':'false'});
    const title=svgElement('title');title.textContent=`Localizar ${record.name}`;group.append(title);
    const bg=svgElement('rect',{class:'marker-surface',rx:'7'});group.append(bg);
    const icon=svgElement('g',{class:'marker-symbol'});icon.append(svgElement('path',{d:symbols[record.visualTheme]||symbols.neutral}));group.append(icon);
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
    const visible=fits&&onScreen;
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
new ResizeObserver(()=>requestAnimationFrame(updateMarkers)).observe(viewport);
document.querySelector('#retry').onclick=load;
load();
