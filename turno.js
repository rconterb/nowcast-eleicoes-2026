const T2POLL={
  SC:{l:33.3,f:66.7,src:'1º turno renormalizado · válidos entre os dois'},
  PR:{l:34.3,f:65.7,src:'1º turno renormalizado · válidos entre os dois'},
  RS:{l:46.5,f:53.5,src:'1º turno renormalizado · válidos entre os dois'},
  SP:{l:46.2,f:53.8,src:'Quaest 23/09 · 2º turno (válidos)'},
  RJ:{l:45.0,f:55.0,src:'Quaest 23/09 · 2º turno (válidos)'},
  ES:{l:47.6,f:52.4,src:'1º turno renormalizado · válidos entre os dois'},
  MG:{l:50.0,f:50.0,src:'Quaest 23/09 · 2º turno (válidos)'},
  DF:{l:43.7,f:56.3,src:'Quaest 23/09 · 2º turno (válidos)'},
  GO:{l:39.1,f:60.9,src:'1º turno renormalizado · válidos entre os dois'},
  MS:{l:36.3,f:63.7,src:'1º turno renormalizado · válidos entre os dois'},
  MT:{l:30.0,f:70.0,src:'1º turno renormalizado · válidos entre os dois'},
  RO:{l:30.6,f:69.4,src:'1º turno renormalizado · válidos entre os dois'},
  AC:{l:35.4,f:64.6,src:'1º turno renormalizado · válidos entre os dois'},
  AM:{l:51.1,f:48.9,src:'1º turno renormalizado · válidos entre os dois'},
  AP:{l:46.5,f:53.5,src:'1º turno renormalizado · válidos entre os dois'},
  RR:{l:18.2,f:81.8,src:'1º turno renormalizado · válidos entre os dois'},
  TO:{l:51.4,f:48.6,src:'1º turno renormalizado · válidos entre os dois'},
  PA:{l:55.4,f:44.6,src:'1º turno renormalizado · válidos entre os dois'},
  SE:{l:69.0,f:31.0,src:'1º turno renormalizado · válidos entre os dois'},
  AL:{l:61.9,f:38.1,src:'1º turno renormalizado · válidos entre os dois'},
  PB:{l:58.8,f:41.2,src:'1º turno renormalizado · válidos entre os dois'},
  RN:{l:74.7,f:25.3,src:'1º turno renormalizado · válidos entre os dois'},
  PE:{l:69.9,f:30.1,src:'Quaest 23/09 · 2º turno (válidos)'},
  CE:{l:70.5,f:29.5,src:'1º turno renormalizado · válidos entre os dois'},
  BA:{l:56.3,f:43.7,src:'1º turno renormalizado · válidos entre os dois'},
  PI:{l:74.7,f:25.3,src:'1º turno renormalizado · válidos entre os dois'},
  MA:{l:50.6,f:49.4,src:'1º turno renormalizado · válidos entre os dois'}
};
DATA.forEach(d=>{ if(d.l1==null){ d.l1=d.l; d.f1=d.f; d.src1=d.src; } });
function applyTurno(n){
  window.TURNO = n;
  window.TURNO_LABEL = n===2 ? '2º turno' : '1º turno';
  DATA.forEach(d=>{
    if(n===2 && T2POLL[d.uf]){ d.l=T2POLL[d.uf].l; d.f=T2POLL[d.uf].f; d.src=T2POLL[d.uf].src; }
    else { d.l=d.l1; d.f=d.f1; d.src=d.src1; }
  });
  const eye=document.querySelector('.eyebrow');
  const h1=document.querySelector('header h1');
  const sub=document.querySelector('header .sub');
  if(eye) eye.textContent = n===2 ? 'Eleição presidencial · 2º turno · 2026' : 'Eleição presidencial · 1º turno · 2026';
  if(h1) h1.textContent = n===2 ? 'No segundo turno a TV também mente no começo da noite' : 'A TV está mostrando o Brasil — ou só o pedaço que já chegou?';
  if(sub) sub.textContent = n===2 ? 'Só restam dois. Números em votos válidos. A ordem continua Sul → Nordeste.' : 'A apuração começa no Sul e termina no Nordeste.';
  document.title = n===2 ? 'Como ler a apuração — 2º turno 2026' : 'Como ler a apuração — 2026';
  document.querySelectorAll('#pickTurno button').forEach(b=>b.classList.toggle('on', Number(b.dataset.t)===n));
  if(document.getElementById('telaL') && !window._telaTouched){
    document.getElementById('telaL').value = n===2 ? '38' : '28';
    document.getElementById('telaF').value = n===2 ? '62' : '46';
  }
  if(typeof applyTypicalOrder==='function'){
    const pct=clamp(parseFloat(document.getElementById('pctBR').value)||15,0,100);
    if(typeof mode==='undefined' || mode==='ordem') applyTypicalOrder(pct);
  }
  relabelCards();
  paintMosaic();
  if(typeof paint==='function') paint(true);
  if(typeof updateFirstRound==='function') updateFirstRound();
  if(typeof renderTargets==='function') renderTargets();
  if(window.redrawNav) window.redrawNav();
  try { history.replaceState(null,'', n===2 ? '?turno=2' : '?turno=1'); } catch(e){}
}
function paintMosaic(){
  let box=document.getElementById('mosaicoBR');
  const host=document.querySelector('.wrap .grid');
  if(!host) return;
  if(!box){
    box=document.createElement('div');
    box.className='card s12';
    box.id='mosaicoBR';
    const pick=document.getElementById('pickTurno');
    if(pick&&pick.nextSibling) host.insertBefore(box, pick.nextSibling);
    else host.insertBefore(box, host.firstChild);
  }
  const m=typeof mosaic==='function'?mosaic():{l:0,f:0};
  box.innerHTML='<div class="k">Palpite das pesquisas para o BRASIL inteiro — '+ (window.TURNO_LABEL||'') +'</div>'+
    '<div class="v"><span class="l">Lula '+fmt(m.l)+'%</span> <span class="muted">×</span> <span class="f">Flávio '+fmt(m.f)+'%</span></div>'+
    (window.TURNO===2
      ? '<p class="help">Este é o número que importa para o final, enquanto pouca urna saiu. Se você viu Flávio com 65%, isso é Santa Catarina / Paraná no começo da noite — não o país. O mosaico do 2º turno (pesquisas estaduais × eleitorado) está empatado.</p>'
      : '<p class="help">Média das pesquisas de cada estado ponderada pelo eleitorado. Não é a pesquisa nacional de um instituto só.</p>');
}
function relabelCards(){
  const t2=window.TURNO===2;
  document.querySelectorAll('.card .k').forEach(el=>{
    const t=el.textContent.trim();
    if(/01/.test(t)) el.innerHTML='<span class="num">01</span> Na TV agora — só o pedaço apurado';
    if(/02/.test(t)) el.innerHTML='<span class="num">02</span> Pesquisas só neste pedaço — ainda não é o Brasil';
    if(/03/.test(t)) el.innerHTML='<span class="num">03</span> Palpite para o BRASIL inteiro';
    if(/04/.test(t)) el.innerHTML='<span class="num">04</span> Palpite para o BRASIL (com o desvio da TV)';
    if(/Rota para ganhar/.test(t)) el.textContent=t2?'Rota para ganhar o 2º turno':'Rota para ganhar o 1º turno';
  });
}
function ensurePicker(){
  if(document.getElementById('pickTurno')) return;
  const wrap=document.querySelector('.wrap .grid');
  if(!wrap) return;
  const card=document.createElement('div');
  card.className='card s12';
  card.id='pickTurno';
  card.innerHTML='<div class="k">Qual análise você quer ver?</div><p class="help">Escolha primeiro. As pesquisas mudam.</p><div class="pick"><button type="button" data-t="1">1º turno</button><button type="button" data-t="2">2º turno</button></div>';
  wrap.insertBefore(card, wrap.firstChild);
  if(!document.getElementById('pickcss')){
    const s=document.createElement('style'); s.id='pickcss';
    s.textContent='#pickTurno .pick{display:flex;gap:10px;margin-top:12px;flex-wrap:wrap}#pickTurno button{min-width:160px;padding:12px 18px;border-radius:10px;font-size:1.05rem;font-weight:700}#pickTurno button.on{background:var(--ink);color:#fff;border-color:var(--ink)}';
    document.head.appendChild(s);
  }
  card.addEventListener('click',ev=>{ const b=ev.target.closest('button'); if(!b) return; applyTurno(Number(b.dataset.t)); });
}
['telaL','telaF'].forEach(id=>{ const el=document.getElementById(id); if(el) el.addEventListener('input',()=>{ window._telaTouched=true; }); });
ensurePicker();
(function(){
  const q=new URLSearchParams(location.search).get('turno');
  const file=/segundo\.html/i.test(location.pathname);
  applyTurno(file || q==='2' ? 2 : 1);
})();
