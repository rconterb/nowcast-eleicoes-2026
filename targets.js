const FLAG = {
  AC:'Bandeira_do_Acre.svg',AL:'Bandeira_de_Alagoas.svg',AP:'Bandeira_do_Amap%C3%A1.svg',
  AM:'Bandeira_do_Amazonas.svg',BA:'Bandeira_da_Bahia.svg',CE:'Bandeira_do_Cear%C3%A1.svg',
  DF:'Bandeira_do_Distrito_Federal_%28Brasil%29.svg',ES:'Bandeira_do_Esp%C3%ADrito_Santo.svg',
  GO:'Bandeira_de_Goi%C3%A1s.svg',MA:'Bandeira_do_Maranh%C3%A3o.svg',MT:'Bandeira_de_Mato_Grosso.svg',
  MS:'Bandeira_de_Mato_Grosso_do_Sul.svg',MG:'Bandeira_de_Minas_Gerais.svg',PA:'Bandeira_do_Par%C3%A1.svg',
  PB:'Bandeira_da_Para%C3%ADba.svg',PR:'Bandeira_do_Paran%C3%A1.svg',PE:'Bandeira_de_Pernambuco.svg',
  PI:'Bandeira_do_Piau%C3%AD.svg',RJ:'Bandeira_do_estado_do_Rio_de_Janeiro.svg',
  RN:'Bandeira_do_Rio_Grande_do_Norte.svg',RS:'Bandeira_do_Rio_Grande_do_Sul.svg',
  RO:'Bandeira_de_Rond%C3%B4nia.svg',RR:'Bandeira_de_Roraima.svg',SC:'Bandeira_de_Santa_Catarina.svg',
  SP:'Bandeira_do_estado_de_S%C3%A3o_Paulo.svg',SE:'Bandeira_de_Sergipe.svg',TO:'Bandeira_do_Tocantins.svg'
};
function flagUrl(uf){
  return 'https://commons.wikimedia.org/wiki/Special:FilePath/'+(FLAG[uf]||'')+'?width=72';
}
function clampPct(n){ return Math.max(0, Math.min(99.9, n)); }
function ensureTargets(){
  if(document.getElementById('alvos1t')) return document.getElementById('alvos1t');
  const host=document.querySelector('.wrap .grid');
  if(!host) return null;
  const card=document.createElement('div');
  card.className='card s12';
  card.id='alvos1t';
  host.insertBefore(card, document.getElementById('fundamento')||null);
  return card;
}
function renderTargets(){
  const card=ensureTargets();
  if(!card || typeof extrasFor!=='function') return;
  const m=mosaic();
  const extraL=extrasFor('Nordeste', 50-m.l);
  const extraF=extrasFor('Sul', 50-m.f);
  const rows=[...DATA].sort((a,b)=>a.ordem-b.ordem);
  const tiles=rows.map(d=>{
    const tL=clampPct(d.l+extraL[d.uf]);
    const tF=clampPct(d.f+extraF[d.uf]);
    return `<div class="st">
      <img src="${flagUrl(d.uf)}" alt="Bandeira ${d.nome}" width="52" height="36" loading="lazy"/>
      <div class="su"><b>${d.uf}</b> ${d.nome}<br><span class="muted">${d.reg} · ${(d.e/1e6).toFixed(1)} mi eleitores</span></div>
      <div class="sp"><span class="l">Lula</span><br>pesquisa ${fmt(d.l)}%<br><b class="l">rota ${fmt(tL)}%</b><br><span class="muted">${extraL[d.uf]>=0?'+':''}${fmt(extraL[d.uf])} pp</span></div>
      <div class="sp"><span class="f">Flávio</span><br>pesquisa ${fmt(d.f)}%<br><b class="f">rota ${fmt(tF)}%</b><br><span class="muted">${extraF[d.uf]>=0?'+':''}${fmt(extraF[d.uf])} pp</span></div>
    </div>`;
  }).join('');
  card.innerHTML=`<div class="k">O que cada estado teria de fazer para um deles fechar no 1º turno</div>
    <p class="help">São dois cenários separados, não um placar conjunto. Coluna Lula = se ele sobe até 50% + 1 no Brasil, com o avanço concentrado no Nordeste. Coluna Flávio = se ele sobe até 50% + 1, com o avanço concentrado no Sul e só ~1/5 disso no Nordeste. A soma ponderada de cada coluna dá 50% no país.</p>
    <div class="states">${tiles}</div>`;
  if(!document.getElementById('stcss')){
    const s=document.createElement('style'); s.id='stcss';
    s.textContent='.states{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px;margin-top:12px}.st{display:grid;grid-template-columns:56px 1fr 72px 72px;gap:8px;align-items:center;border:1px solid var(--line);border-radius:10px;padding:10px 12px;background:#fff}.st img{width:52px;height:36px;object-fit:cover;border-radius:3px;border:1px solid var(--line);background:#eee}.su{font-size:13px;line-height:1.35}.sp{font-size:12px;text-align:right;line-height:1.35}';
    document.head.appendChild(s);
  }
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', ()=>setTimeout(renderTargets,0));
else setTimeout(renderTargets,0);
