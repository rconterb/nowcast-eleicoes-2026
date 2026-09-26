const Y18={AC:[22.78,77.22],AL:[59.92,40.08],AP:[49.80,50.20],AM:[49.73,50.27],BA:[72.69,27.31],CE:[71.11,28.89],DF:[30.01,69.99],ES:[36.94,63.06],GO:[34.48,65.52],MA:[73.26,26.74],MT:[33.58,66.42],MS:[34.78,65.22],MG:[41.81,58.19],PA:[54.81,45.19],PB:[64.96,35.04],PR:[31.57,68.43],PE:[66.50,33.50],PI:[77.05,22.95],RJ:[32.05,67.95],RN:[63.41,36.59],RS:[36.76,63.24],RO:[27.82,72.18],RR:[28.45,71.55],SC:[24.08,75.92],SP:[32.03,67.97],SE:[67.54,32.46],TO:[51.02,48.98]};
const Y22={AC:[29.70,70.30],AL:[58.68,41.32],AP:[48.64,51.36],AM:[51.10,48.90],BA:[72.12,27.88],CE:[69.97,30.03],DF:[41.19,58.81],ES:[41.96,58.04],GO:[41.29,58.71],MA:[71.14,28.86],MT:[34.92,65.08],MS:[40.51,59.49],MG:[50.20,49.80],PA:[54.75,45.25],PB:[66.62,33.38],PR:[37.60,62.40],PE:[66.93,33.07],PI:[76.86,23.14],RJ:[43.47,56.53],RN:[65.10,34.90],RS:[43.65,56.35],RO:[29.34,70.66],RR:[23.92,76.08],SC:[30.73,69.27],SP:[44.76,55.24],SE:[67.21,32.79],TO:[51.36,48.64]};
const SIG_POLL=1.6;
window.SWING=0;
function lerp(a,b,t){return a+(b-a)*t;}
function mixState(uf,s){
  const a=Y18[uf],b=Y22[uf];
  if(!a||!b) return null;
  const t=(s+1)/2;
  return {l:lerp(a[0],b[0],t), f:lerp(a[1],b[1],t)};
}
function normCdf(z){
  const a1=0.254829592,a2=-0.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=0.3275911;
  const s=z<0?-1:1,x=Math.abs(z)/Math.SQRT2,t=1/(1+p*x);
  const y=1-((((a5*t+a4)*t+a3)*t+a2)*t+a1)*t*Math.exp(-x*x);
  return 0.5*(1+s*y);
}
function expectedAt(pct,s){
  const snap=DATA.map(d=>({l:d.l,f:d.f,pct:d.pct}));
  DATA.forEach(d=>{const m=mixState(d.uf,s); if(m){d.l=m.l;d.f=m.f;}});
  applyTypicalOrder(pct);
  const e=expectedNow();
  DATA.forEach((d,i)=>{d.l=snap[i].l;d.f=snap[i].f;d.pct=snap[i].pct;});
  return e;
}
function remainSigma(){
  let rest=0,num=0;
  DATA.forEach(d=>{
    const r=typeof remainShare==='function'?remainShare(d):d.e*(1-clamp(d.pct||0,0,100)/100);
    const a=Y18[d.uf],b=Y22[d.uf];
    if(!a||!b||r<=0) return;
    const dlt=b[0]-a[0];
    num+=r*dlt*dlt; rest+=r;
  });
  const struct=rest?Math.sqrt(num/rest)/2:3;
  return struct;
}
function setPctApurado(pct, fromSlider){
  pct=clamp(pct,0,100);
  const box=document.getElementById('pctBR');
  const night=document.getElementById('night');
  const nightVal=document.getElementById('nightVal');
  const s1=document.getElementById('slider1t');
  if(box && (!fromSlider || Math.abs((parseFloat(box.value)||0)-pct)>0.05)) box.value=fmt(pct);
  if(night && Math.abs((parseFloat(night.value)||0)-pct)>0.05) night.value=pct;
  if(nightVal) nightVal.textContent=fmt(pct)+'% do Brasil apurado';
  if(s1 && Math.abs((parseFloat(s1.value)||0)-pct)>0.05) s1.value=pct;
  if(typeof mode==='undefined' || mode==='ordem'){
    if(typeof applyTypicalOrder==='function') applyTypicalOrder(pct);
  }
  if(typeof syncTelaFromPolls==='function' && !window._telaTouched) syncTelaFromPolls();
  if(typeof paint==='function') paint(true);
  if(typeof updateFirstRound==='function') updateFirstRound();
  paintTrend();
}
function applySwing(s){
  window.SWING=s;
  DATA.forEach(d=>{
    const m=mixState(d.uf,s);
    if(!m) return;
    d.l=Math.round(m.l*10)/10;
    d.f=Math.round(m.f*10)/10;
    d.src='mapa '+(s<-0.33?'2018':s>0.33?'2022':'mistura 18/22')+' · 2º turno TSE';
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
  paintTrend();
}
function trendLine(){
  const telaL=clamp(parseFloat(document.getElementById('telaL').value)||0,0,100);
  const telaF=clamp(parseFloat(document.getElementById('telaF').value)||0,0,100);
  const exp=expectedNow();
  const w=clamp(exp.pct/100,0,1);
  const k=w/(w+0.28);
  const m=mosaic();
  const rest=typeof pollsRemaining==='function'?pollsRemaining():m;
  const finL=w*telaL+(1-w)*(rest.l+k*(telaL-exp.l));
  const finF=w*telaF+(1-w)*(rest.f+k*(telaF-exp.f));
  const sigMap=remainSigma();
  const sigUrna=SIG_POLL*Math.sqrt(Math.max(0.04,1-w));
  const sigNow=sigUrna+sigMap*0.35;
  const sigFin=Math.max(0.35,(1-w)*Math.sqrt(sigMap*sigMap+SIG_POLL*SIG_POLL));
  const pL=normCdf((finL-50)/Math.max(sigFin,0.2));
  return {exp,w,k,dL:telaL-exp.l,dF:telaF-exp.f,finL,finF,m,rest,sigNow,sigFin,sigMap,telaL,telaF,pL};
}
function pathSeries(){
  const s=window.SWING||0;
  const pts=[];
  const saved=snapshotPcts();
  for(let p=2;p<=100;p+=2){
    const mid=expectedAt(p,s), a=expectedAt(p,-1), b=expectedAt(p,1);
    const w=p/100, sig=SIG_POLL*Math.sqrt(Math.max(0.04,1-w))+1.1;
    pts.push({p,mL:mid.l,mF:mid.f,aL:a.l,aF:a.f,bL:b.l,bF:b.f,sig});
  }
  restorePcts(saved);
  window._bbPts=pts;
  return pts;
}
function drawBands(){
  const svg=document.getElementById('bbChart');
  if(!svg) return;
  const t=trendLine();
  const pts=pathSeries();
  const W=720,H=300,L=40,R=16,T=22,B=32,iw=W-L-R,ih=H-T-B;
  window._bbGeom={W,H,L,R,T,B,iw,ih};
  const x=p=>L+iw*p/100;
  const y=v=>T+ih*(1-(clamp(v,20,80)-20)/60);
  const poly=(arr,up)=>arr.map((pt,i)=>(i?'L':'M')+x(pt.p).toFixed(1)+','+y(up(pt)).toFixed(1)).join(' ');
  const band=(lo,hi,color)=>{
    const top=pts.map((pt,i)=>(i?'L':'M')+x(pt.p).toFixed(1)+','+y(hi(pt)).toFixed(1)).join(' ');
    const bot=pts.slice().reverse().map(pt=>'L'+x(pt.p).toFixed(1)+','+y(lo(pt)).toFixed(1)).join(' ');
    return '<path d="'+top+bot+' Z" fill="'+color+'" opacity=".18"/>';
  };
  const line=(fn,color,dash)=>'<path d="'+poly(pts,fn)+'" fill="none" stroke="'+color+'" stroke-width="2" '+(dash?'stroke-dasharray="5 4"':'')+'/>';
  const grid=[30,40,50,60,70].map(v=>'<line class="gridline" x1="'+L+'" x2="'+(W-R)+'" y1="'+y(v)+'" y2="'+y(v)+'"/><text x="4" y="'+(y(v)+3)+'">'+v+'</text>').join('');
  const axis=[0,25,50,75,100].map(p=>'<text x="'+x(p)+'" y="'+(H-8)+'" text-anchor="middle">'+p+'%</text>').join('');
  const now=x(t.w*100);
  svg.innerHTML=grid+axis+
    band(pt=>Math.min(pt.aL,pt.bL)-pt.sig, pt=>Math.max(pt.aL,pt.bL)+pt.sig, 'var(--lula)')+
    band(pt=>Math.min(pt.aF,pt.bF)-pt.sig, pt=>Math.max(pt.aF,pt.bF)+pt.sig, 'var(--flavio)')+
    band(pt=>pt.mL-2*pt.sig, pt=>pt.mL+2*pt.sig, 'var(--lula)')+
    band(pt=>pt.mF-2*pt.sig, pt=>pt.mF+2*pt.sig, 'var(--flavio)')+
    line(pt=>pt.mL,'var(--lula)')+line(pt=>pt.mF,'var(--flavio)')+
    line(pt=>pt.aL,'#b91c1c',true)+line(pt=>pt.bL,'#b91c1c',true)+
    '<line x1="'+L+'" x2="'+(W-R)+'" y1="'+y(50)+'" y2="'+y(50)+'" stroke="#1c1917" opacity=".25"/>'+
    '<line id="bbNow" x1="'+now+'" x2="'+now+'" y1="'+T+'" y2="'+(H-B)+'" stroke="#c4bbb0" stroke-dasharray="2 3"/>'+
    '<line id="bbHover" x1="'+now+'" x2="'+now+'" y1="'+T+'" y2="'+(H-B)+'" stroke="#1c1917" opacity="0"/>'+
    '<circle cx="'+now+'" cy="'+y(t.telaL)+'" r="5" fill="var(--lula)"/>'+
    '<circle cx="'+now+'" cy="'+y(t.telaF)+'" r="5" fill="var(--flavio)"/>'+
    '<text x="'+L+'" y="14">Lula</text><text x="'+(L+40)+'" y="14" fill="var(--flavio)">Flávio</text>'+
    '<text x="'+(W-R)+'" y="14" text-anchor="end">passe o mouse — faixa 2018–2022 + 2σ</text>';
  bindChartHover();
}
function bindChartHover(){
  const svg=document.getElementById('bbChart');
  const tip=document.getElementById('bbTip');
  if(!svg||!tip||svg._hoverBound) return;
  svg._hoverBound=true;
  function atEvent(ev){
    const pts=window._bbPts||[];
    const g=window._bbGeom; if(!g||!pts.length) return;
    const r=svg.getBoundingClientRect();
    const px=(ev.clientX-r.left)*(g.W/r.width);
    const p=clamp((px-g.L)/g.iw*100,2,100);
    let best=pts[0],bd=99;
    pts.forEach(pt=>{const d=Math.abs(pt.p-p); if(d<bd){bd=d;best=pt;}});
    return best;
  }
  svg.addEventListener('mousemove',ev=>{
    const pt=atEvent(ev); if(!pt) return;
    const hover=document.getElementById('bbHover');
    const g=window._bbGeom;
    const x=g.L+g.iw*pt.p/100;
    if(hover){ hover.setAttribute('x1',x); hover.setAttribute('x2',x); hover.setAttribute('opacity','0.55'); }
    const loL=Math.min(pt.aL,pt.bL)-pt.sig, hiL=Math.max(pt.aL,pt.bL)+pt.sig;
    const loF=Math.min(pt.aF,pt.bF)-pt.sig, hiF=Math.max(pt.aF,pt.bF)+pt.sig;
    tip.style.display='block';
    tip.innerHTML='<b>'+pt.p+'% apurado</b><br>'+
      '<span class="l">Lula '+fmt(pt.mL)+'%</span> · faixa '+fmt(loL)+'–'+fmt(hiL)+'%<br>'+
      '<span class="f">Flávio '+fmt(pt.mF)+'%</span> · faixa '+fmt(loF)+'–'+fmt(hiF)+'%<br>'+
      '<span class="tiny">2018: Lula '+fmt(pt.aL)+'% × Flávio '+fmt(pt.aF)+'%<br>2022: Lula '+fmt(pt.bL)+'% × Flávio '+fmt(pt.bF)+'%</span>';
  });
  svg.addEventListener('mouseleave',()=>{
    tip.style.display='none';
    const hover=document.getElementById('bbHover');
    if(hover) hover.setAttribute('opacity','0');
  });
}
function paintTrend(){
  const box=document.getElementById('swingTrend');
  if(!box) return;
  const t=trendLine();
  const lado=t.dF>1.2?'A TV está +'+fmt(t.dF)+' pp no Flávio vs o mapa. O residual entra no resto com κ='+fmt(t.k)+'.':
             t.dL>1.2?'A TV está +'+fmt(t.dL)+' pp no Lula vs o mapa. O residual entra no resto com κ='+fmt(t.k)+'.':
             'A TV está alinhada com o mapa neste pedaço.';
  const pL=Math.round(t.pL*100), pF=100-pL;
  box.innerHTML='<div class="k">Projeção estatística do 2º turno</div>'+
    '<div class="v"><span class="l">Lula '+fmt(t.finL)+'%</span> <span class="muted">×</span> <span class="f">Flávio '+fmt(t.finF)+'%</span></div>'+
    '<p class="help">Média = urna já saída + mapa do que falta + residual da TV encolhido. σ do final = (1−w)√(σ²mapa+σ²urna), σ mapa nos estados que faltam = '+fmt(t.sigMap)+' pp.</p>'+
    '<p class="help">Intervalo 68%: Lula '+fmt(t.finL-t.sigFin)+'–'+fmt(t.finL+t.sigFin)+'%. Intervalo 95%: '+fmt(t.finL-2*t.sigFin)+'–'+fmt(t.finL+2*t.sigFin)+'%.</p>'+
    '<p class="help"><b>P(Lula vence)</b> = '+pL+'% · <b>P(Flávio vence)</b> = '+pF+'% <span class="tiny">(normal, P(L>50) = Φ((μ−50)/σ))</span></p>'+
    '<p class="help">Neste pedaço o mapa manda <span class="l">Lula '+fmt(t.exp.l)+'%</span> × <span class="f">Flávio '+fmt(t.exp.f)+'%</span>. '+lado+'</p>';
  drawBands();
}
function ensureSwing(){
  if(document.getElementById('swingCard')) return;
  const host=document.querySelector('.wrap .grid');
  if(!host) return;
  const card=document.createElement('div');
  card.className='card s12';
  card.id='swingCard';
  card.innerHTML='<div class="k">Dois controles para acompanhar a noite</div>'+
    '<p class="help">Mapa 2018–2022 + % apurado. A projeção do 2º turno junta a urna, o mapa do resto e um intervalo. Passe o mouse no gráfico para ver o % de cada etapa.</p>'+
    '<div class="k" style="margin-top:14px">1. Que eleição 2026 parece?</div>'+
    '<div id="swingEra" class="pick" style="margin:10px 0"><button type="button" data-era="18">2018 · Flávio</button><button type="button" data-era="mid">meio</button><button type="button" data-era="22">2022 · Lula</button></div>'+
    '<input id="swing" type="range" min="-1" max="1" step="0.01" value="0" />'+
    '<div class="v" id="swingVal" style="font-size:1.15rem">meio-termo</div>'+
    '<p class="tiny" id="swingLab"></p>'+
    '<div class="k" style="margin-top:18px">2. Quanto do Brasil já foi apurado?</div>'+
    '<div id="nightBtns" class="pick" style="margin:10px 0">'+
      '<button type="button" data-p="5">5%</button><button type="button" data-p="15">15%</button>'+
      '<button type="button" data-p="30">30%</button><button type="button" data-p="50">50%</button>'+
      '<button type="button" data-p="75">75%</button><button type="button" data-p="100">100%</button>'+
    '</div>'+
    '<input id="night" type="range" min="1" max="100" step="1" value="15" />'+
    '<div class="v" id="nightVal" style="font-size:1.15rem">15% do Brasil apurado</div>'+
    '<div id="swingTrend" style="margin-top:12px"></div>'+
    '<div style="position:relative">'+
      '<svg id="bbChart" viewBox="0 0 720 300" width="100%" height="300" role="img"></svg>'+
      '<div id="bbTip" style="display:none;position:absolute;left:12px;top:8px;background:#fff;border:1px solid var(--line);border-radius:10px;padding:8px 10px;font-size:13px;line-height:1.35;box-shadow:0 8px 24px rgba(0,0,0,.08);pointer-events:none;max-width:260px"></div>'+
    '</div>'+
    '<p class="tiny">Passe o mouse: aparece o % daquele ponto, o mapa, o envelope 2018/2022 e a banda ±2σ. Bolinha = TV agora.</p>';
  const mos=document.getElementById('mosaicoBR');
  if(mos&&mos.nextSibling) host.insertBefore(card, mos.nextSibling);
  else {
    const pick=document.getElementById('pickTurno');
    if(pick&&pick.nextSibling) host.insertBefore(card, pick.nextSibling);
    else host.insertBefore(card, host.firstChild);
  }
  document.getElementById('swing').addEventListener('input',ev=>applySwing(parseFloat(ev.target.value)));
  document.getElementById('swingEra').addEventListener('click',ev=>{
    const b=ev.target.closest('button'); if(!b) return;
    const v=b.dataset.era==='18'?-1:b.dataset.era==='22'?1:0;
    document.getElementById('swing').value=v; applySwing(v);
  });
  document.getElementById('night').addEventListener('input',ev=>setPctApurado(parseFloat(ev.target.value), true));
  document.getElementById('nightBtns').addEventListener('click',ev=>{
    const b=ev.target.closest('button'); if(!b) return;
    setPctApurado(parseFloat(b.dataset.p), true);
  });
  const pct=document.getElementById('pctBR');
  if(pct) pct.addEventListener('input',()=>setPctApurado(parseFloat(pct.value)||0, false));
  ['telaL','telaF'].forEach(id=>{
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
setPctApurado(clamp(parseFloat(document.getElementById('pctBR').value)||15,0,100), true);
