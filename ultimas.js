(function(){
  function draw(){
    var old=document.getElementById('ultimas');
    if(old) old.remove();
    var host=document.querySelector('.wrap .grid');
    if(!host) return;
    var card=document.createElement('div');
    card.className='card s12';
    card.id='ultimas';
    card.innerHTML='<div class="k">Projeção · urna 7,59% · mais perto de 2022</div>'+
      '<div class="v" style="font-size:1.7rem;margin:8px 0"><span class="l">Lula 49,3%</span> <span class="muted">×</span> <span class="f">Flávio 42,4%</span></div>'+
      '<p class="help">Entre os dois, o final fica <b>Lula 53,8 × Flávio 46,2</b>. Os 8,3 pp de outros continuam no placar da TV.</p>'+
      '<p class="help">O 72% era Bolsonaro no 2º turno de 2018, com só dois nomes. Não é o número que a TV de hoje deveria mostrar. No 1º turno esse mesmo Sul, no mapa de 2022 e com 8% de outros, pedia cerca de <b>60 × 31</b>, não 72. A urna deu 50,7 × 41,0 — entre os dois, 55 × 45 contra 66 × 34 de 2022 e 72 × 28 de 2018.</p>'+
      '<p class="help">Mais perto de 2022 (10 pp fora) do que de 2018 (17 pp fora). κ=0,21: só um quinto do desvio passa para o resto. Não fecha no 1º turno.</p>';
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
  }
  draw();
  setTimeout(draw, 600);
  setTimeout(seed, 1200);
})();
