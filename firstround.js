const LIMIAR=50;
const XFER={'Sul':{'Sul':1,'Sudeste':0.55,'Centro-Oeste':0.7,'Norte':0.35,'Nordeste':0.22},'Sudeste':{'Sul':0.55,'Sudeste':1,'Centro-Oeste':0.55,'Norte':0.35,'Nordeste':0.25},'Centro-Oeste':{'Sul':0.7,'Sudeste':0.55,'Centro-Oeste':1,'Norte':0.45,'Nordeste':0.2},'Norte':{'Sul':0.35,'Sudeste':0.35,'Centro-Oeste':0.45,'Norte':1,'Nordeste':0.4},'Nordeste':{'Sul':0.22,'Sudeste':0.25,'Centro-Oeste':0.2,'Norte':0.4,'Nordeste':1}};
function xfer(from,to){return (XFER[from]&&XFER[from][to])||0.3;}
function mosaic(){let l=0,f=0;DATA.forEach(d=>{l+=d.e*d.l;f+=d.e*d.f;});return{l:l/TOTAL,f:f/TOTAL};}
function extrasFor(origin,nationalNeed){let den=0;DATA.forEach(d=>{den+=d.e*xfer(origin,d.reg);});const scale=nationalNeed*TOTAL/den;const map={};DATA.forEach(d=>{map[d.uf]=scale*xfer(origin,d.reg);});return map;}
function isT2(){return window.TURNO===2;}
function labTurno(){return isT2()?'2º turno':'1º turno';}
function firstRoundAt(pct){
  const saved=snapshotPcts();applyTypicalOrder(pct);
  const exp=expectedNow();const rest=pollsRemaining();const w=clamp(pct,0,100)/100;
  restorePcts(saved);
  const m=mosaic();const extraL=extrasFor('Nordeste',LIMIAR-m.l);const extraF=extrasFor('Sul',LIMIAR-m.f);
  let e=0,routeL=0,routeF=0,restE=0,restRouteL=0,restRouteF=0;
  applyTypicalOrder(pct);
  DATA.forEach(d=>{const c=usedShare(d),r=remainShare(d);e+=c;restE+=r;routeL+=c*(d.l+extraL[d.uf])/100;routeF+=c*(d.f+extraF[d.uf])/100;restRouteL+=r*(d.l+extraL[d.uf])/100;restRouteF+=r*(d.f+extraF[d.uf])/100;});
  restorePcts(saved);
  const telaL=clamp(parseFloat(document.getElementById('telaL').value)||0,0,100);
  const telaF=clamp(parseFloat(document.getElementById('telaF').value)||0,0,100);
  const rw=Math.min(Math.max(w,0.001),0.999);
  return {w,exp,rest,m,routeL:e?100*routeL/e:0,routeF:e?100*routeF/e:0,restRouteL:restE?100*restRouteL/restE:0,restRouteF:restE?100*restRouteF/restE:0,extraRestL:((LIMIAR-rw*telaL)/(1-rw))-rest.l,extraRestF:((LIMIAR-rw*telaF)/(1-rw))-rest.f,extraSC:extraF.SC,extraBA:extraF.BA,extraNEL:extraL.BA,extraSCL:extraL.SC};
}
function fill(prefix,route,expected,restRoute,restPoll,extraRest,originNote){
  document.getElementById(prefix+'Exp').textContent=fmt(expected)+'%';
  document.getElementById(prefix+'Need').textContent=fmt(route)+'%';
  document.getElementById(prefix+'Band').textContent=originNote+' O resto renderia '+fmt(restRoute)+'% (pesquisa crua do resto: '+fmt(restPoll)+'%).';
  document.getElementById(prefix+'Final').textContent=(extraRest>=0?'+':'')+fmt(extraRest)+' pp';
  const gap=expected-route;
  const st=gap>=-1?{cls:'ok',chip:'na rota',txt:'Neste pedaço as pesquisas já entregam a TV de quem vai a 50%.'}:gap>=-4?{cls:'warn',chip:'perto',txt:'Falta um pouco neste pedaço.'}:{cls:'bad',chip:'fora da rota',txt:'Só com este pedaço ele não fecha 50% + 1. Precisa do resto, sobretudo da base.'};
  const el=document.getElementById(prefix+'St');el.className='chip '+st.cls;el.textContent=st.chip;
  document.getElementById(prefix+'StTxt').textContent=st.txt;
}
function syncCopy(){
  const t=labTurno();
  const card=document.querySelector('#slider1t') && document.getElementById('slider1t').closest('.card');
  if(card){
    const k=card.querySelector('.k');
    const help=card.querySelector('.help');
    if(k) k.textContent='Rota para ganhar o '+t;
    if(help) help.textContent=isT2()?'No 2º turno só existem dois nomes e vence quem fizer mais de 50% dos válidos. A TV no começo da noite ainda é o Sul. O palpite do final junta o que já saiu com o que falta.':'No 1º turno vence quem passa de 50% dos válidos. A TV no começo é o Sul; o Nordeste chega depois.';
  }
}
function ensureHist(){
  let h=document.getElementById('hist1822');
  if(!h){ h=document.createElement('div'); h.id='hist1822'; h.style.marginTop='12px'; document.getElementById('t1tSum').after(h); }
  if(isT2()){
    h.innerHTML='<div class="k">O que 2018 e 2022 fizeram no 2º turno</div><table style="margin-top:8px"><tr><th class="lft">Região</th><th>Bolsonaro 2018 T2</th><th>Bolsonaro 2022 T2</th><th>Haddad 2018 T2</th><th>Lula 2022 T2</th></tr><tr><td class="lft">Sul</td><td>68%</td><td>63%</td><td>32%</td><td>35%</td></tr><tr><td class="lft">Sudeste</td><td>65%</td><td>53%</td><td>35%</td><td>45%</td></tr><tr><td class="lft">Centro-Oeste</td><td>67%</td><td>58%</td><td>33%</td><td>40%</td></tr><tr><td class="lft">Norte</td><td>52%</td><td>52%</td><td>48%</td><td>46%</td></tr><tr><td class="lft">Nordeste</td><td>30%</td><td>29%</td><td>70%</td><td>70%</td></tr><tr><td class="lft"><b>Brasil</b></td><td>55%</td><td>49%</td><td>45%</td><td>51%</td></tr></table><p class="tiny">Mesmo no 2º turno o Sul não puxa o Nordeste. A direita foi a 68% no Sul em 2018 e o Nordeste ficou em 30%. Em 2022 a direita caiu no Sudeste (65→53) e o país virou por 1 pp — o Nordeste continuou em 70% no PT.</p>';
  } else {
    h.innerHTML='<div class="k">O que 2018 e 2022 mostram no 1º turno</div><table style="margin-top:8px"><tr><th class="lft">Região</th><th>Bolsonaro 2018 T1</th><th>Bolsonaro 2022 T1</th><th>Haddad 2018 T1</th><th>Lula 2022 T1</th></tr><tr><td class="lft">Sul</td><td>57%</td><td>57%</td><td>20%</td><td>34%</td></tr><tr><td class="lft">Sudeste</td><td>53%</td><td>49%</td><td>19%</td><td>43%</td></tr><tr><td class="lft">Centro-Oeste</td><td>58%</td><td>55%</td><td>21%</td><td>39%</td></tr><tr><td class="lft">Norte</td><td>43%</td><td>50%</td><td>37%</td><td>45%</td></tr><tr><td class="lft">Nordeste</td><td>26%</td><td>28%</td><td>51%</td><td>67%</td></tr><tr><td class="lft"><b>Brasil</b></td><td>46%</td><td>43%</td><td>29%</td><td>48%</td></tr></table><p class="tiny">A direita saturada no Sul não vira Nordeste. Por isso o modelo só transfere ~22% de um avanço sulista para o NE.</p>';
  }
}
function ensureHow(){
  let box=document.getElementById('comoLer');
  if(!box){
    const host=document.querySelector('.wrap .grid');
    if(!host) return;
    box=document.createElement('div');
    box.className='card s12';
    box.id='comoLer';
    const pick=document.getElementById('pickTurno');
    if(pick&&pick.nextSibling) host.insertBefore(box, pick.nextSibling);
    else host.insertBefore(box, host.firstChild);
  }
  box.innerHTML=isT2()?(
    '<div class="k">Como ler o 2º turno</div>'+
    '<p class="help"><b>1. A TV agora</b> é o pedaço que já chegou — no começo, quase só o Sul. Não é o Brasil.</p>'+
    '<p class="help"><b>2. Pesquisas neste pedaço</b> é o que as pesquisas dariam se só esses estados votassem. Se a TV estiver parecida, as pesquisas acertaram o recorte. Se estiver muito diferente, ou a ordem mudou ou a pesquisa errou.</p>'+
    '<p class="help"><b>3. Palpite simples</b> = o que já saiu na TV + as pesquisas do que ainda não chegou. Com 1% apurado, 99% ainda é pesquisa. Por isso o final fica perto do mosaico nacional (~50 a 50), mesmo a TV mostrando 38 a 62.</p>'+
    '<p class="help"><b>4. Melhor palpite</b> faz a mesma conta, mas só leva uma parte do desvio da TV para o resto (no começo quase nada: com 1% apurado o site acredita em ~3% desse desvio).</p>'+
    '<p class="help"><b>5. Rota dos 50%</b> não é o placar de agora. É: se Fulano for ganhar o 2º turno, quanto a TV deveria mostrar neste pedaço, lembrando que o Sul não puxa o Nordeste no mesmo tamanho.</p>'
  ):(
    '<div class="k">Como ler o 1º turno</div>'+
    '<p class="help"><b>1. A TV agora</b> é só o pedaço apurado. Cedo, Sul e interior de São Paulo.</p>'+
    '<p class="help"><b>2. Pesquisas neste pedaço</b> é o gabarito daquele recorte, não o Brasil.</p>'+
    '<p class="help"><b>3 e 4. Palpites do final</b> misturam a TV (o que já saiu) com as pesquisas (o que falta). O estatístico desconfia do desvio cedo demais.</p>'+
    '<p class="help"><b>5. Rota dos 50%</b> pergunta o que cada um precisaria estar fazendo neste pedaço para fechar 50% + 1 no país, com avanço maior na própria base.</p>'
  );
}
function drawNeedChart(pct,r){
  const svg=document.getElementById('chart1t');if(!svg)return;
  const W=640,H=260,L=38,R=14,T=18,B=30,iw=W-L-R,ih=H-T-B;
  const x=p=>L+iw*p/100;const y=v=>T+ih*(1-(clamp(v,20,70)-20)/50);
  const extraL=extrasFor('Nordeste',50-r.m.l);const extraF=extrasFor('Sul',50-r.m.f);
  const saved=snapshotPcts();const pts=[];
  for(let p=2;p<=100;p+=2){applyTypicalOrder(p);const exp=expectedNow();let e=0,rl=0,rf=0;DATA.forEach(d=>{const c=usedShare(d);e+=c;rl+=c*(d.l+extraL[d.uf])/100;rf+=c*(d.f+extraF[d.uf])/100;});pts.push({p,eL:exp.l,eF:exp.f,rL:e?100*rl/e:0,rF:e?100*rf/e:0});}
  restorePcts(saved);
  const path=(key,color,dash)=>{const d=pts.map((pt,i)=>(i?'L':'M')+x(pt.p).toFixed(1)+','+y(pt[key]).toFixed(1)).join(' ');return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${dash?1.6:2}" ${dash?'stroke-dasharray="5 4"':''} opacity="${dash?0.9:0.55}"/>`;};
  const grid=[20,30,40,50,60,70].map(v=>`<line class="gridline" x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}"/><text x="4" y="${y(v)+3}">${v}</text>`).join('');
  const axis=[0,25,50,75,100].map(p=>`<text x="${x(p)}" y="${H-8}" text-anchor="middle">${p}%</text>`).join('');
  svg.innerHTML=grid+axis+`<line x1="${L}" x2="${W-R}" y1="${y(50)}" y2="${y(50)}" stroke="#1c1917" stroke-width="1" opacity=".35"/><text x="${W-R}" y="${y(50)-5}" text-anchor="end">50% + 1</text>${path('eL','var(--lula)')}${path('eF','var(--flavio)')}${path('rL','var(--lula)',true)}${path('rF','var(--flavio)',true)}<line x1="${x(pct)}" x2="${x(pct)}" y1="${T}" y2="${H-B}" stroke="#c4bbb0" stroke-dasharray="2 3"/><text x="${L}" y="12">sólido = pesquisa neste pedaço</text><text x="${L+190}" y="12">tracejado = TV se ele for ganhar o ${labTurno()}</text>`;
}
function updateFirstRound(){
  const pct=clamp(parseFloat(document.getElementById('pctBR').value)||0,0,100);
  const slider=document.getElementById('slider1t');
  if(slider&&Math.abs(parseFloat(slider.value)-pct)>0.05)slider.value=pct;
  document.getElementById('slider1tVal').textContent=fmt(pct)+'% do Brasil apurado';
  const r=firstRoundAt(pct);
  fill('l1t',r.routeL,r.exp.l,r.restRouteL,r.rest.l,r.extraRestL,'Base no Nordeste: para ganhar o '+labTurno()+' ele sobe mais na BA (+'+fmt(r.extraNEL)+' pp) do que em SC (+'+fmt(r.extraSCL)+' pp).');
  fill('f1t',r.routeF,r.exp.f,r.restRouteF,r.rest.f,r.extraRestF,'Base no Sul: para ganhar o '+labTurno()+' ele sobe mais em SC (+'+fmt(r.extraSC)+' pp) do que na BA (+'+fmt(r.extraBA)+' pp).');
  document.getElementById('t1tSum').textContent='Mosaico das pesquisas deste '+labTurno()+': Lula '+fmt(r.m.l)+'% × Flávio '+fmt(r.m.f)+'%. Com pouco apurado o palpite do final fica colado nisso — a TV ainda pesa pouco.';
  syncCopy(); ensureHow(); ensureHist(); drawNeedChart(pct,r);
}
function bindFirstRound(){const sl=document.getElementById('slider1t');if(!sl)return;sl.addEventListener('input',()=>{document.getElementById('pctBR').value=sl.value;document.getElementById('pctBR').dispatchEvent(new Event('input'));updateFirstRound();});['pctBR','telaL','telaF'].forEach(id=>document.getElementById(id).addEventListener('input',updateFirstRound));document.getElementById('modeTabs').addEventListener('click',()=>setTimeout(updateFirstRound,0));updateFirstRound();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bindFirstRound);else bindFirstRound();
