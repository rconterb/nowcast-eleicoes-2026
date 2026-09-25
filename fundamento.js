(function(){
  function drawNav(){
    const inner=document.querySelector('header .inner');
    if(!inner) return;
    let n=document.querySelector('header .nav');
    if(!n){ n=document.createElement('div'); n.className='nav'; inner.insertBefore(n, inner.firstChild); }
    const t2=(window.TURNO===2)||/segundo\.html/i.test(location.pathname)||/turno=2/.test(location.search);
    n.innerHTML='<a class="'+(t2?'':'on')+'" href="./index.html?turno=1">1º turno</a><a class="'+(t2?'on':'')+'" href="./index.html?turno=2">2º turno</a>';
    if(!document.getElementById('navcss')){
      const s=document.createElement('style'); s.id='navcss';
      s.textContent='.nav{display:flex;gap:8px;margin:0 0 14px}.nav a{font-size:13px;text-decoration:none;color:var(--ink);border:1px solid var(--line);border-radius:999px;padding:5px 12px;background:#fff}.nav a.on{background:var(--ink);color:#fff;border-color:var(--ink)}';
      document.head.appendChild(s);
    }
  }
  window.redrawNav=drawNav;
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', drawNav);
  else drawNav();
})();
function ensureFundamento(){
  if(document.getElementById('fundamento'))return;
  const host=document.querySelector('.wrap .grid');
  if(!host)return;
  const card=document.createElement('div');
  card.className='card s12';
  card.id='fundamento';
  card.innerHTML='<div class="k">De onde vêm as contas</div><p class="help">Mapas TSE 2018 e 2022 interpolados por estado. Esperado no pedaço = mapa × ordem da apuração. Tendência = desvio da TV encolhido com κ = w/(w+0,28).</p>';
  host.appendChild(card);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureFundamento);
else ensureFundamento();
(function(){
  const a=document.createElement('script');
  a.src='turno.js';
  a.onload=function(){ const b=document.createElement('script'); b.src='swing.js'; document.body.appendChild(b); };
  document.body.appendChild(a);
})();
