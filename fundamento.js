(function(){
  function drawNav(){
    const inner=document.querySelector('header .inner');
    if(!inner) return;
    let n=document.querySelector('header .nav');
    if(!n){ n=document.createElement('div'); n.className='nav'; inner.insertBefore(n, inner.firstChild); }
    const t2=/segundo\.html/i.test(location.pathname);
    n.innerHTML='<a class="'+(t2?'':'on')+'" href="./index.html">1º turno</a><a class="'+(t2?'on':'')+'" href="./segundo.html">2º turno</a>';
    if(!document.getElementById('navcss')){
      const s=document.createElement('style'); s.id='navcss';
      s.textContent='.nav{display:flex;gap:8px;margin:0 0 14px}.nav a{font-size:13px;text-decoration:none;color:var(--ink);border:1px solid var(--line);border-radius:999px;padding:5px 12px;background:#fff}.nav a.on{background:var(--ink);color:#fff;border-color:var(--ink)}';
      document.head.appendChild(s);
    }
  }
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
  card.innerHTML=`<div class="k">De onde vêm as contas</div>
<p class="help">Tudo abaixo é reproduzível. e_i é o eleitorado da UF i (TSE). p^L_i e p^F_i são as últimas pesquisas Lula e Flávio naquela UF. w_i é a fração já apurada da UF. T é o eleitorado nacional.</p>
<p class="tiny"><b>1. Mosaico.</b> M_L = Σ (e_i · p^L_i) / T</p>
<p class="tiny"><b>2. Esperado neste pedaço.</b> E_L = Σ (e_i w_i p^L_i) / Σ (e_i w_i)</p>
<p class="tiny"><b>3. Palpite aritmético.</b> F = w · T_L + (1-w) · R_L</p>
<p class="tiny"><b>4. Palpite estatístico.</b> κ = w / (w + 0,28); o desvio da TV só entra no resto depois de encolher.</p>
<p class="tiny"><b>5. 50% + 1.</b> No 1º e no 2º turno vence quem passa da metade dos válidos.</p>
<p class="tiny"><b>6. Swing amortecido.</b> x_i = Δ · φ(base, região_i) · T / Σ e_j φ(base, região_j), com φ(Sul, Nordeste) = 0,22.</p>
<p class="tiny"><b>Limites.</b> Qualidade desigual das pesquisas, eleitorado ≠ válidos do dia, matriz com só dois ciclos. Não é resultado oficial.</p>`;
  host.appendChild(card);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureFundamento);
else ensureFundamento();
