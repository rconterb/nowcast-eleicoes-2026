const LIMIAR=50;
const XFER={'Sul':{'Sul':1,'Sudeste':0.55,'Centro-Oeste':0.7,'Norte':0.35,'Nordeste':0.22},'Sudeste':{'Sul':0.55,'Sudeste':1,'Centro-Oeste':0.55,'Norte':0.35,'Nordeste':0.25},'Centro-Oeste':{'Sul':0.7,'Sudeste':0.55,'Centro-Oeste':1,'Norte':0.45,'Nordeste':0.2},'Norte':{'Sul':0.35,'Sudeste':0.35,'Centro-Oeste':0.45,'Norte':1,'Nordeste':0.4},'Nordeste':{'Sul':0.22,'Sudeste':0.25,'Centro-Oeste':0.2,'Norte':0.4,'Nordeste':1}};
function xfer(from,to){return (XFER[from]&&XFER[from][to])||0.3;}
function mosaic(){let l=0,f=0;DATA.forEach(d=>{l+=d.e*d.l;f+=d.e*d.f;});return{l:l/TOTAL,f:f/TOTAL};}
function extrasFor(origin,nationalNeed){let den=0;DATA.forEach(d=>{den+=d.e*xfer(origin,d.reg);});const scale=nationalNeed*TOTAL/den;const map={};DATA.forEach(d=>{map[d.uf]=scale*xfer(origin,d.reg);});return map;}
function firstRoundAt(pct){
  const saved=snapshotPcts();applyTypicalOrder(pct);
  const exp=expectedNow();const rest=pollsRemaining();const w=clamp(pct,0,100)/100;
  restorePcts(saved);
  const m=mosaic();const needL=LIMIAR-m.l,needF=LIMIAR-m.f;
  const extraL=extrasFor('Nordeste',needL);const extraF=extrasFor('Sul',needF);
  let e=0,routeL=0,routeF=0,restE=0,restRouteL=0,restRouteF=0;
  applyTypicalOrder(pct);
  DATA.forEach(d=>{const c=usedShare(d),r=remainShare(d);e+=c;restE+=r;routeL+=c*(d.l+extraL[d.uf])/100;routeF+=c*(d.f+extraF[d.uf])/100;restRouteL+=r*(d.l+extraL[d.uf])/100;restRouteF+=r*(d.f+extraF[d.uf])/100;});
  restorePcts(saved);
  const telaL=clamp(parseFloat(document.getElementById('telaL').value)||0,0,100);
  const telaF=clamp(parseFloat(document.getElementById('telaF').value)||0,0,100);
  const rw=Math.min(Math.max(w,0.001),0.999);
  return {w,exp,rest,m,needL,needF,routeL:e?100*routeL/e:0,routeF:e?100*routeF/e:0,restRouteL:restE?100*restRouteL/restE:0,restRouteF:restE?100*restRouteF/restE:0,extraRestL:((LIMIAR-rw*telaL)/(1-rw))-rest.l,extraRestF:((LIMIAR-rw*telaF)/(1-rw))-rest.f,extraSC:extraF.SC,extraBA:extraF.BA,extraNEL:extraL.BA,extraSCL:extraL.SC};
}
function fill(prefix,route,expected,restRoute,restPoll,extraRest,originNote){
  document.getElementById(prefix+'Exp').textContent=fmt(expected)+'%';
  document.getElementById(prefix+'Need').textContent=fmt(route)+'%';
  document.getElementById(prefix+'Band').textContent=originNote+' O resto, com avanço amortecido, renderia '+fmt(restRoute)+'% (pesquisa crua do resto: '+fmt(restPoll)+'%).';
  document.getElementById(prefix+'Final').textContent=(extraRest>=0?'+':'')+fmt(extraRest)+' pp';
  const gap=expected-route;
  const st=gap>=-1?{cls:'ok',chip:'na rota',txt:'Neste pedaço as pesquisas já entregam a TV da rota.'}:gap>=-4?{cls:'warn',chip:'perto',txt:'Falta um pouco neste pedaço.'}:{cls:'bad',chip:'fora da rota',txt:'As pesquisas deste pedaço não sustentam 50% + 1, mesmo com avanço maior na base e menor no outro polo.'};
  const el=document.getElementById(prefix+'St');el.className='chip '+st.cls;el.textContent=st.chip;
  document.getElementById(prefix+'StTxt').textContent=st.txt;
}
function ensureHist(){
  if(document.getElementById('hist1822'))return;
  const h=document.createElement('div');
  h.id='hist1822';
  h.style.marginTop='12px';
  h.innerHTML='<div class="k">O que 2018 e 2022 mostram</div><table style="margin-top:8px"><tr><th class="lft">Região</th><th>Bolsonaro 2018 T1</th><th>Bolsonaro 2022 T1</th><th>Haddad 2018 T1</th><th>Lula 2022 T1</th></tr><tr><td class="lft">Sul</td><td>57%</td><td>57%</td><td>20%</td><td>34%</td></tr><tr><td class="lft">Sudeste</td><td>53%</td><td>49%</td><td>19%</td><td>43%</td></tr><tr><td class="lft">Centro-Oeste</td><td>58%</td><td>55%</td><td>21%</td><td>39%</td></tr><tr><td class="lft">Norte</td><td>43%</td><td>50%</td><td>37%</td><td>45%</td></tr><tr><td class="lft">Nordeste</td><td>26%</td><td>28%</td><td>51%</td><td>67%</td></tr><tr><td class="lft"><b>Brasil</b></td><td>46%</td><td>43%</td><td>29%</td><td>48%</td></tr></table><p class="tiny">A direita saturada no Sul em 2018 (57%) não virou Nordeste: lá ficou em 26%. Em 2022 o Sul da direita continuou em 57% e o Nordeste em 28%. O PT subiu em todo lugar, mas muito mais no Sudeste (+24 pp) do que seria um recorte do Sul. Erro de pesquisa em 2022 (+6 a +7 pp de Bolsonaro vs Datafolha) concentrou-se no Sudeste/Sul, não no Nordeste. Por isso o modelo só transfere ~22% de um avanço sulista para o NE.</p>';
  document.getElementById('t1tSum').after(h);
}
function drawNeedChart(pct,r){
  const svg=document.getElementById('chart1t');if(!svg)return;
  const W=640,H=260,L=38,R=14,T=18,B=30,iw=W-L-R,ih=H-T-B;
  const x=p=>L+iw*p/100;const y=v=>T+ih*(1-(clamp(v,20,70)-20)/50);
  const extraL=extrasFor('Nordeste',r.needL);const extraF=extrasFor('Sul',r.needF);
  const saved=snapshotPcts();const pts=[];
  for(let p=2;p<=100;p+=2){applyTypicalOrder(p);const exp=expectedNow();let e=0,rl=0,rf=0;DATA.forEach(d=>{const c=usedShare(d);e+=c;rl+=c*(d.l+extraL[d.uf])/100;rf+=c*(d.f+extraF[d.uf])/100;});pts.push({p,eL:exp.l,eF:exp.f,rL:e?100*rl/e:0,rF:e?100*rf/e:0});}
  restorePcts(saved);
  const path=(key,color,dash)=>{const d=pts.map((pt,i)=>(i?'L':'M')+x(pt.p).toFixed(1)+','+y(pt[key]).toFixed(1)).join(' ');return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${dash?1.6:2}" ${dash?'stroke-dasharray="5 4"':''} opacity="${dash?0.9:0.55}"/>`;};
  const grid=[20,30,40,50,60,70].map(v=>`<line class="gridline" x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}"/><text x="4" y="${y(v)+3}">${v}</text>`).join('');
  const axis=[0,25,50,75,100].map(p=>`<text x="${x(p)}" y="${H-8}" text-anchor="middle">${p}%</text>`).join('');
  svg.innerHTML=grid+axis+`<line x1="${L}" x2="${W-R}" y1="${y(50)}" y2="${y(50)}" stroke="#1c1917" stroke-width="1" opacity=".35"/><text x="${W-R}" y="${y(50)-5}" text-anchor="end">50% + 1</text>${path('eL','var(--lula)')}${path('eF','var(--flavio)')}${path('rL','var(--lula)',true)}${path('rF','var(--flavio)',true)}<line x1="${x(pct)}" x2="${x(pct)}" y1="${T}" y2="${H-B}" stroke="#c4bbb0" stroke-dasharray="2 3"/><text x="${L}" y="12">sólido = pesquisa</text><text x="${L+110}" y="12">tracejado = rota 50% com avanço amortecido</text>`;
}
function updateFirstRound(){
  const pct=clamp(parseFloat(document.getElementById('pctBR').value)||0,0,100);
  const slider=document.getElementById('slider1t');
  if(slider&&Math.abs(parseFloat(slider.value)-pct)>0.05)slider.value=pct;
  document.getElementById('slider1tVal').textContent=fmt(pct)+'% do Brasil apurado';
  const r=firstRoundAt(pct);
  fill('l1t',r.routeL,r.exp.l,r.restRouteL,r.rest.l,r.extraRestL,'A base dele é o Nordeste: o avanço até 50% pesa mais lá e menos em Santa Catarina (+'+fmt(r.extraNEL)+' pp na BA, +'+fmt(r.extraSCL)+' pp em SC).');
  fill('f1t',r.routeF,r.exp.f,r.restRouteF,r.rest.f,r.extraRestF,'A base dele é o Sul: o avanço até 50% pesa mais lá e quase não se copia no Nordeste (+'+fmt(r.extraSC)+' pp em SC, só +'+fmt(r.extraBA)+' pp na BA).');
  document.getElementById('t1tSum').textContent='Pesquisas nacionais: Lula '+fmt(r.m.l)+'% × Flávio '+fmt(r.m.f)+'%. Em 2018 e 2022 a direita fez 57% no Sul e 26–28% no Nordeste. Por isso um acréscimo no Sul não se propaga linearmente ao NE — o modelo transfere só cerca de 1/5.';
  ensureHist(); drawNeedChart(pct,r);
}
function bindFirstRound(){const sl=document.getElementById('slider1t');if(!sl)return;sl.addEventListener('input',()=>{document.getElementById('pctBR').value=sl.value;document.getElementById('pctBR').dispatchEvent(new Event('input'));updateFirstRound();});['pctBR','telaL','telaF'].forEach(id=>document.getElementById(id).addEventListener('input',updateFirstRound));document.getElementById('modeTabs').addEventListener('click',()=>setTimeout(updateFirstRound,0));updateFirstRound();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bindFirstRound);else bindFirstRound();
