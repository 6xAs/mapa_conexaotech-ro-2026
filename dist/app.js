'use strict';
const viewport = document.querySelector('#viewport');
const root = document.querySelector('#map-root');
const value = document.querySelector('#zoom-value');
const MIN = 1, MAX = 5;
let svg, zoom = 1, pan = {x:0,y:0}, data = [], pointers = new Map(), previous;
function render() {
  if (!svg) return;
  const w = 1260 / zoom, h = 990 / zoom;
  pan.x = Math.max(400-w*.65, Math.min(1660-w*.35, pan.x));
  pan.y = Math.max(70-h*.65, Math.min(1060-h*.35, pan.y));
  svg.setAttribute('viewBox', `${pan.x} ${pan.y} ${w} ${h}`);
  value.textContent = `${Math.round(zoom * 100)}%`;
  document.querySelector('#zoom-out').disabled = zoom <= MIN;
  document.querySelector('#zoom-in').disabled = zoom >= MAX;
}
function changeZoom(next, anchor) {
  if (!svg) return;
  const before = anchor ? point(anchor.x,anchor.y) : {x:pan.x+630/zoom,y:pan.y+495/zoom};
  const old = zoom; zoom = Math.max(MIN,Math.min(MAX,next));
  const factor = old / zoom;
  pan.x = before.x - (before.x-pan.x)*factor;
  pan.y = before.y - (before.y-pan.y)*factor;
  render();
}
function reset() {
  zoom=1;pan={x:400,y:70};render();
  document.querySelectorAll('[data-location]').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.foot-trail,.space').forEach(g=>g.classList.remove('active','is-selected'));
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
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  viewport.setPointerCapture(e.pointerId);previous=gesture();viewport.classList.add('dragging');
});
viewport.addEventListener('pointermove',e=>{
  if(!pointers.has(e.pointerId)||!svg)return;
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});const next=gesture();
  if(previous.distance>0 && next.distance>0)changeZoom(zoom*next.distance/previous.distance,{x:previous.x,y:previous.y});
  const a=point(previous.x,previous.y),b=point(next.x,next.y);
  pan.x-=b.x-a.x;pan.y-=b.y-a.y;render();previous=next;
});
function release(e){pointers.delete(e.pointerId);previous=pointers.size?gesture():null;if(!pointers.size)viewport.classList.remove('dragging');}
viewport.addEventListener('pointerup',release);viewport.addEventListener('pointercancel',release);viewport.addEventListener('lostpointercapture',release);
viewport.addEventListener('wheel',e=>{if(!svg)return;e.preventDefault();changeZoom(zoom*Math.exp(-e.deltaY*.0015),{x:e.clientX,y:e.clientY});},{passive:false});
viewport.addEventListener('keydown',e=>{
  const step=70/zoom;
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','0','Home'].includes(e.key))e.preventDefault();
  if(e.key==='ArrowLeft')pan.x-=step;if(e.key==='ArrowRight')pan.x+=step;
  if(e.key==='ArrowUp')pan.y-=step;if(e.key==='ArrowDown')pan.y+=step;
  if(e.key==='+'||e.key==='=')changeZoom(zoom*1.25);else if(e.key==='-')changeZoom(zoom/1.25);else if(e.key==='0'||e.key==='Home')reset();else render();
});
document.querySelector('#zoom-in').onclick=()=>changeZoom(zoom*1.25);
document.querySelector('#zoom-out').onclick=()=>changeZoom(zoom/1.25);
document.querySelector('#reset').onclick=reset;
document.querySelectorAll('[data-location]').forEach(button=>button.onclick=()=>{
  const s=data.find(s=>s.id===button.dataset.location);if(!s||!svg)return;
  document.querySelectorAll('.foot-trail').forEach(g=>g.classList.toggle('active',Boolean(s.entry)&&(g.id === (s.id==='informacoes'?'trail-acces-informations':'trail-acces-credenciamento') || g.id==='trail-liaison-principale')));
  document.querySelectorAll('.space').forEach(g=>g.classList.toggle('is-selected',g.dataset.space===s.id));
  zoom=s.entry?2.4:2.8;pan={x:s.x+s.width/2-630/zoom,y:s.y+s.height/2-495/zoom};render();
  document.querySelectorAll('[data-location]').forEach(b=>b.classList.toggle('active',b===button));
  if(mobileSidebar.matches){setSidebar(false);viewport.focus({preventScroll:true});}
});
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
    root.replaceChildren(document.importNode(doc.documentElement,true));svg=root.querySelector('svg');data=spaces;reset();
    requestAnimationFrame(fitLabels);
    if(document.fonts)document.fonts.ready.then(fitLabels);
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
document.querySelector('#retry').onclick=load;
load();
