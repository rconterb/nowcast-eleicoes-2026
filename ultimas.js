(function(){
  var P22=[[1,7.14],[4.9,6.74],[10,5.48],[14.64,4.70],[20.26,4.61],[24.16,4.38],[30.81,3.92],[100,-5.23]];
  function lead(p){
    if(p<=P22[0][0]) return P22[0][1];
    for(var i=1;i<P22.length;i++){
      if(p<=P22[i][0]){
        var a=P22[i-1], b=P22[i], t=(p-a[0])/(b[0]-a[0]);
        return a[1]+t*(b[1]-a[1]);
      }
    }
    return P22[P22.length-1][1];
  }
  function draw(){
    var old=document.getElementById('ultimas');
    if(old) old.remove();
    var host=document.querySelector('.wrap .grid');
    if(!host) return;
    var hoje=51.17-40.67, pct=14.24, ref=lead(pct);
    var queda=-5.23-ref, proj=hoje+queda, meio=-5.23+0.5*(hoje-ref);
    var card=document.createElement('div');
    card.className='card s12';
    card.id='ultimas';
    card.innerHTML='<div class="k">18h09 · 14,24% das seções · Flávio 51,17 × Lula 40,67</div>'+
      '<div class="v" style="font-size:1.5rem;margin:8px 0">Flávio +10,5 pp. Em 2022, neste ponto, Bolsonaro era +4,8.</div>'+
      '<p class="help">A vantagem <b>abriu</b> desde os 7,59% (+9,7). Em 2022 ela estava caindo (+6,1 → +4,7). O extra contra 2022 foi de 3,6 para 5,7 pp.</p>'+
      '<p class="help">Se a queda de 2022 se repetir daqui (10 pp até o fim), o final fica <b>Flávio +0,5</b> — empate, 46 × 46 no placar, 2º turno. Se só metade do extra ficar, Lula fecha +2,4 (47 × 45).</p>'+
      '<p class="tiny">51,17% é deste pedaço, não do Brasil. 71.074 de 499.248 seções. 2018 neste estágio não tem trilha; aos 53% daquela noite a vantagem era +23 e fechou +16,8. Hoje não é 2018.</p>';
    host.insertBefore(card, host.firstChild);
  }
  draw();
  setTimeout(draw, 700);
})();
