const Y18={AC:[22.78,77.22],AL:[59.92,40.08],AP:[49.80,50.20],AM:[49.73,50.27],BA:[72.69,27.31],CE:[71.11,28.89],DF:[30.01,69.99],ES:[36.94,63.06],GO:[34.48,65.52],MA:[73.26,26.74],MT:[33.58,66.42],MS:[34.78,65.22],MG:[41.81,58.19],PA:[54.81,45.19],PB:[64.96,35.04],PR:[31.57,68.43],PE:[66.50,33.50],PI:[77.05,22.95],RJ:[32.05,67.95],RN:[63.41,36.59],RS:[36.76,63.24],RO:[27.82,72.18],RR:[28.45,71.55],SC:[24.08,75.92],SP:[32.03,67.97],SE:[67.54,32.46],TO:[51.02,48.98]};
const Y22={AC:[29.70,70.30],AL:[58.68,41.32],AP:[48.64,51.36],AM:[51.10,48.90],BA:[72.12,27.88],CE:[69.97,30.03],DF:[41.19,58.81],ES:[41.96,58.04],GO:[41.29,58.71],MA:[71.14,28.86],MT:[34.92,65.08],MS:[40.51,59.49],MG:[50.20,49.80],PA:[54.75,45.25],PB:[66.62,33.38],PR:[37.60,62.40],PE:[66.93,33.07],PI:[76.86,23.14],RJ:[43.47,56.53],RN:[65.10,34.90],RS:[43.65,56.35],RO:[29.34,70.66],RR:[23.92,76.08],SC:[30.73,69.27],SP:[44.76,55.24],SE:[67.21,32.79],TO:[51.36,48.64]};
window.SWING=0;
function lerp(a,b,t){return a+(b-a)*t;}
function mixState(uf,s){
  const a=Y18[uf],b=Y22[uf];
  if(!a||!b) return null;
  const t=(s+1)/2;
  return {l:lerp(a[0],b[0],t), f:lerp(a[1],b[1],t)};
}
function applySwing(s){
  window.SWING=s;
  DATA.forEach(d=>{
    const m=mixState(d.uf,s);
    if(!m) return;
    d.l=Math.round(m.l*10)/10;
    d.f=Math.round(m.f*10)/10;
    d.src='mapa '+(s< -0.33?'2018':s>0.33?'2022':'mistura 18/22')+' · 2º turno TSE';
  });
  const sl=document.getElementById('swingVal');
  const lab=document.getElementById('swingLab');
  if(sl) sl.textContent=(s<0?Math.round(-s*100)+'% 2018':s>0?Math.round(s*100)+'% 2022':'meio-termo');
  if(lab){
    if(s<=-0.7) lab.textContent='Mapa 2018 — Bolsonaro 55% × Haddad 45%. Flávio herda esse país.';
    else if(s>=0.7) lab.textContent='Mapa 2022 — Lula 51% × Bolsonaro 49%. Lula herda esse país.';
    else lab.textContent='Cada estado é a média ponderada dos 2º turnos de 2018 e 2022.';
  }
  document.querySelectorAll('#swingEra button').forEach(b=>b.classList.toggle('on', b.dataset.era===(s<=-0.5?'18':s>=0.5?'22':'mid')));
  if(typeof syncTelaFromPolls==='function' && !window._telaTouched) syncTelaFromPolls();
  if(typeof paintMosaic==='function') paintMosaic();
  if(typeof paint==='function') paint(true);
  if(typeof updateFirstRound==='function') updateFirstRound();
  if(typeof renderTargets==='function') renderTargets();
}
function trendLine(){
  const telaL=clamp(parseFloat(document.getElementById('telaL').value)||0,0,100);
  const telaF=clamp(parseFloat(document.getElementById('telaF').value)||0,0,100);
  const exp=expectedNow();
  const w=clamp(exp.pct/100,0,1);
  const k=w/(w+0.28);
  const m=mosaic();
  const finL=w*telaL+(1-w)*(m.l + k*(telaL-exp.l));
  const finF=w*telaF+(1-w)*(m.f + k*(telaF-exp.f));
  return {exp,w,k,dL:telaL-exp.l,dF:telaF-exp.f,finL,finF,m};
}
function paintTrend(){
  const box=document.getElementById('swingTrend');
  if(!box) return;
  const t=trendLine();
  const lado=t.dF>1.2?'A TV está melhor para o Flávio do que o mapa neste pedaço ('+fmtPP(t.dF)+'). A tendência empurra o final um pouco para ele.':
             t.dL>1.2?'A TV está melhor para o Lula do que o mapa neste pedaço ('+fmtPP(t.dL)+'). A tendência empurra o final um pouco para ele.':
             'A TV está alinhada com o mapa neste pedaço. Sem tendência extra.';
  box.innerHTML='<div class="k">Com '+fmt(t.w*100)+'% apurado neste mapa</div>'+
    '<div class="v"><span class="l">Lula '+fmt(t.exp.l)+'%</span> <span class="muted">×</span> <span class="f">Flávio '+fmt(t.exp.f)+'%</span></div>'+
    '<p class="help">Isso é o que o mapa 2018/2022 manda a TV mostrar agora. '+lado+'</p>'+
    '<p class="help">Tendência para o final (mapa do resto + desvio da TV encolhido): <b class="l">Lula '+fmt(t.finL)+'%</b> × <b class="f">Flávio '+fmt(t.finF)+'%</b>.</p>';
}
function ensureSwing(){
  if(document.getElementById('swingCard')) return;
  const host=document.querySelector('.wrap .grid');
  if(!host) return;
  const card=document.createElement('div');
  card.className='card s12';
  card.id='swingCard';
  card.innerHTML='<div class="k">E se 2026 parecer 2018 ou 2022?</div>'+
    '<p class="help">Arraste. Esquerda = mapa do 2º turno de 2018 (ganhou Bolsonaro, 55%). Direita = mapa de 2022 (ganhou Lula, 51%). Cada estado muda no mesmo ritmo. O % apurado usa esse mapa para dizer o que a TV deveria mostrar.</p>'+
    '<div id="swingEra" class="pick" style="margin:10px 0"><button type="button" data-era="18">2018 · Flávio</button><button type="button" data-era="mid">meio</button><button type="button" data-era="22">2022 · Lula</button></div>'+
    '<input id="swing" type="range" min="-1" max="1" step="0.01" value="0" />'+
    '<div class="v" id="swingVal" style="font-size:1.15rem">meio-termo</div>'+
    '<p class="tiny" id="swingLab"></p>'+
    '<div id="swingTrend" style="margin-top:12px"></div>';
  const mos=document.getElementById('mosaicoBR');
  if(mos&&mos.nextSibling) host.insertBefore(card, mos.nextSibling);
  else {
    const pick=document.getElementById('pickTurno');
    if(pick&&pick.nextSibling) host.insertBefore(card, pick.nextSibling);
    else host.insertBefore(card, host.firstChild);
  }
  const sl=document.getElementById('swing');
  sl.addEventListener('input',()=>applySwing(parseFloat(sl.value)));
  document.getElementById('swingEra').addEventListener('click',ev=>{
    const b=ev.target.closest('button'); if(!b) return;
    const v=b.dataset.era==='18'?-1:b.dataset.era==='22'?1:0;
    sl.value=v; applySwing(v);
  });
  ['pctBR','telaL','telaF'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.addEventListener('input',paintTrend);
  });
  const old=window.paint;
  if(typeof old==='function' && !old._swingWrapped){
    window.paint=function(r){ old(r); paintTrend(); };
    window.paint._swingWrapped=true;
  }
}
ensureSwing();
applySwing(0);
