const LIMIAR=50;
function mosaic(){let l=0,f=0;DATA.forEach(d=>{l+=d.e*d.l;f+=d.e*d.f;});return{l:l/TOTAL,f:f/TOTAL};}
function firstRoundAt(pct){
  const saved=snapshotPcts();
  applyTypicalOrder(pct);
  const exp=expectedNow();
  const rest=pollsRemaining();
  const w=clamp(pct,0,100)/100;
  restorePcts(saved);
  const m=mosaic();
  const swingL=LIMIAR-m.l, swingF=LIMIAR-m.f;
  const telaL=clamp(parseFloat(document.getElementById('telaL').value)||0,0,100);
  const telaF=clamp(parseFloat(document.getElementById('telaF').value)||0,0,100);
  const rw=Math.min(w,0.999);
  const restNeedL=w>=0.999?LIMIAR:(LIMIAR-w*telaL)/(1-rw);
  const restNeedF=w>=0.999?LIMIAR:(LIMIAR-w*telaF)/(1-rw);
  return {w,exp,rest,m,swingL,swingF,routeL:exp.l+swingL,routeF:exp.f+swingF,restRouteL:rest.l+swingL,restRouteF:rest.f+swingF,extraRestL:restNeedL-rest.l,extraRestF:restNeedF-rest.f};
}
function fill(prefix,route,expected,restRoute,restPoll,extraRest,swing){
  document.getElementById(prefix+'Exp').textContent=fmt(expected)+'%';
  document.getElementById(prefix+'Need').textContent=fmt(route)+'%';
  document.getElementById(prefix+'Band').textContent='Para chegar a 50% precisa de '+(swing>=0?'+':'')+fmt(swing)+' pp em todo o país, inclusive onde vai mal. O resto teria de render '+fmt(restRoute)+'% (pesquisa do resto: '+fmt(restPoll)+'%).';
  document.getElementById(prefix+'Final').textContent=(extraRest>=0?'+':'')+fmt(extraRest)+' pp';
  const gap=expected-route;
  const st=gap>=0?{cls:'ok',chip:'na rota',txt:'Neste pedaço as pesquisas já entregam o que ele precisaria na TV.'}:gap>=-2.4?{cls:'warn',chip:'perto',txt:'Falta pouco neste pedaço, dentro da margem das pesquisas.'}:{cls:'bad',chip:'fora da rota',txt:'As pesquisas deste pedaço não sustentam 50% + 1, mesmo espalhando o avanço nos estados fracos.'};
  const el=document.getElementById(prefix+'St');el.className='chip '+st.cls;el.textContent=st.chip;
  document.getElementById(prefix+'StTxt').textContent=st.txt;
}
function drawNeedChart(pct,r){
  const svg=document.getElementById('chart1t');if(!svg)return;
  const W=640,H=260,L=38,R=14,T=18,B=30,iw=W-L-R,ih=H-T-B;
  const x=p=>L+iw*p/100;const y=v=>T+ih*(1-(clamp(v,20,70)-20)/50);
  const saved=snapshotPcts();const pts=[];
  for(let p=2;p<=100;p+=2){applyTypicalOrder(p);const exp=expectedNow();pts.push({p,eL:exp.l,eF:exp.f,rL:exp.l+r.swingL,rF:exp.f+r.swingF});}
  restorePcts(saved);
  const path=(key,color,dash)=>{const d=pts.map((pt,i)=>(i?'L':'M')+x(pt.p).toFixed(1)+','+y(pt[key]).toFixed(1)).join(' ');return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${dash?1.6:2}" ${dash?'stroke-dasharray="5 4"':''} opacity="${dash?0.9:0.55}"/>`;};
  const grid=[20,30,40,50,60,70].map(v=>`<line class="gridline" x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}"/><text x="4" y="${y(v)+3}">${v}</text>`).join('');
  const axis=[0,25,50,75,100].map(p=>`<text x="${x(p)}" y="${H-8}" text-anchor="middle">${p}%</text>`).join('');
  svg.innerHTML=grid+axis+`<line x1="${L}" x2="${W-R}" y1="${y(50)}" y2="${y(50)}" stroke="#1c1917" stroke-width="1" opacity=".35"/><text x="${W-R}" y="${y(50)-5}" text-anchor="end">50% + 1</text>${path('eL','var(--lula)')}${path('eF','var(--flavio)')}${path('rL','var(--lula)',true)}${path('rF','var(--flavio)',true)}<line x1="${x(pct)}" x2="${x(pct)}" y1="${T}" y2="${H-B}" stroke="#c4bbb0" stroke-dasharray="2 3"/><text x="${L}" y="12">sólido = previsto nas pesquisas</text><text x="${L+168}" y="12">tracejado = TV com o avanço espalhado no país inteiro</text>`;
}
function updateFirstRound(){
  const pct=clamp(parseFloat(document.getElementById('pctBR').value)||0,0,100);
  const slider=document.getElementById('slider1t');
  if(slider&&Math.abs(parseFloat(slider.value)-pct)>0.05)slider.value=pct;
  document.getElementById('slider1tVal').textContent=fmt(pct)+'% do Brasil apurado';
  const r=firstRoundAt(pct);
  fill('l1t',r.routeL,r.exp.l,r.restRouteL,r.rest.l,r.extraRestL,r.swingL);
  fill('f1t',r.routeF,r.exp.f,r.restRouteF,r.rest.f,r.extraRestF,r.swingF);
  document.getElementById('t1tSum').textContent='Pesquisas nacionais: Lula '+fmt(r.m.l)+'% × Flávio '+fmt(r.m.f)+'%. Para um deles fechar 50% + 1, o país inteiro — inclusive Bahia, Pernambuco, Ceará — teria de render cerca de +'+fmt(Math.min(r.swingL,r.swingF))+' a +'+fmt(Math.max(r.swingL,r.swingF))+' pp acima da pesquisa. O 80%+ só aparece se o Nordeste ficar travado na pesquisa crua e toda a folga for jogada no pedaço que já saiu.';
  drawNeedChart(pct,r);
}
function bindFirstRound(){
  const sl=document.getElementById('slider1t');if(!sl)return;
  sl.addEventListener('input',()=>{document.getElementById('pctBR').value=sl.value;document.getElementById('pctBR').dispatchEvent(new Event('input'));updateFirstRound();});
  document.getElementById('pctBR').addEventListener('input',updateFirstRound);
  document.getElementById('telaL').addEventListener('input',updateFirstRound);
  document.getElementById('telaF').addEventListener('input',updateFirstRound);
  document.getElementById('modeTabs').addEventListener('click',()=>setTimeout(updateFirstRound,0));
  updateFirstRound();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bindFirstRound);else bindFirstRound();
