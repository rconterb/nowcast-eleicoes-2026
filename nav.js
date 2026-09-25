(function(){
  function draw(){
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
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', draw);
  else draw();
})();
