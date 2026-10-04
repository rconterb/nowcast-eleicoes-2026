(function(){
  var PATH=[[1,7.14],[4.9,6.74],[10,5.48],[14.64,4.70],[20.26,4.61],[24.16,4.38],[30.81,3.92],[100,-5.23]];
  function lead22(p){
    if(p<=PATH[0][0]) return PATH[0][1];
    for(var i=1;i<PATH.length;i++){
      if(p<=PATH[i][0]){
        var a=PATH[i-1], b=PATH[i], t=(p-a[0])/(b[0]-a[0]);
        return a[1]+t*(b[1]-a[1]);
      }
    }
    return PATH[PATH.length-1][1];
  }
  function draw(){
    var old=document.getElementById('ultimas');
    if(old) old.remove();
    var host=document.querySelector('.wrap .grid');
    if(!host) return;
    var pct=7.59, tvF=50.70, tvL=40.98;
    var box=document.getElementById('pctBR'), L=document.getElementById('telaL'), F=document.getElementById('telaF');
    if(box && L && F){
      var p=parseFloat(box.value), l=parseFloat(L.value), f=parseFloat(F.value);
      if(p>0 && l>0 && f>0){ pct=p; tvL=l; tvF=f; }
    }
    var hoje=tvF-tvL;
    var ref=lead22(pct);
    var queda=-5.23-ref;
    var proj=hoje+queda;
    var meio=-5.23+0.5*(hoje-ref);
    var card=document.createElement('div');
    card.className='card s12';
    card.id='ultimas';
    card.innerHTML='<div class="k">Leitura da noite · caminho do 1º turno de 2022</div>'+
      '<div class="v" style="font-size:1.55rem;margin:8px 0">Agora Flávio '+hoje.toFixed(1).replace('.',',')+' pp. Em 2022, neste ponto, Bolsonaro era +'+ref.toFixed(1).replace('.',',')+'.</div>'+
      '<p class="help">De '+pct.toFixed(1).replace('.',',')+'% até o fim, a vantagem da direita em 2022 caiu '+Math.abs(queda).toFixed(1).replace('.',',')+' pp e Lula fechou +5,2. A mesma queda a partir de hoje dá <b>Lula '+(-proj).toFixed(1).replace('.',',')+' pp</b> no final (Flávio termina atrás). Se só metade do extra de hoje ficar, Lula fecha +'+(-meio).toFixed(1).replace('.',',')+' pp.</p>'+
      '<p class="help">2022, vantagem Bolsonaro na apuração: 1% +7,1 · 4,9% +6,7 · 10% +5,5 · 15% +4,7 · 20% +4,6 · 31% +3,9 · final Lula +5,2. Hoje, aos 7,59%, Flávio está 3,6 pp à frente desse caminho. Não fecha no 1º turno.</p>'+
      '<p class="tiny">O 72% saiu. Esta conta usa o 1º turno de 2022, não o 2º.</p>';
    host.insertBefore(card, host.firstChild);
  }
  function seed(){
    if(typeof setPctApurado!=='function') return;
    window._telaTouched=true;
    var L=document.getElementById('telaL'), F=document.getElementById('telaF'), sw=document.getElementById('swing');
    if(L) L.value='40.98';
    if(F) F.value='50.70';
    if(sw) sw.value='1';
    if(typeof applySwing==='function') applySwing(1);
    setPctApurado(7.59);
    draw();
  }
  draw();
  setTimeout(seed, 1200);
  setInterval(draw, 4000);
})();
