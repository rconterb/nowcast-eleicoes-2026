(function(){
  function draw(){
    if(document.getElementById('ultimas')) return;
    const host=document.querySelector('.wrap .grid');
    if(!host) return;
    const card=document.createElement('div');
    card.className='card s12';
    card.id='ultimas';
    card.innerHTML='<div class="k">Projeção com a urna de agora</div>'+
      '<div class="v" style="font-size:1.7rem;margin:8px 0"><span class="l">Lula 52,8%</span> <span class="muted">×</span> <span class="f">Flávio 45,0%</span></div>'+
      '<p class="help"><b>Mais perto de 2022, fora da banda.</b> Com 7,59% o Sul histórico pedia Flávio 72 (2018) ou 66 (2022). A TV deu 50,7 × 41,0. Distância: 15 pp de 2022, 21 pp de 2018. O slider vai para 2022, o ano mais próximo.</p>'+
      '<p class="help">Essa projeção usa o mapa 2022 no que falta e transfere 21% do desvio da TV (κ). Se a noite fosse 2018, o final seria 48,5 × 49,3. No meio, 50,6 × 47,1. Não fecha 1º turno: ainda há 8,3 pp em outros.</p>'+
      '<p class="tiny">7,59% é SC + 73% do PR. 73% do palpite ainda é mapa. Atualize a TV quando o % mudar.</p>';
    host.insertBefore(card, host.firstChild);
  }
  function seed(){
    if(typeof setPctApurado!=='function') return;
    window._telaTouched=true;
    const L=document.getElementById('telaL'), F=document.getElementById('telaF'), sw=document.getElementById('swing');
    if(L) L.value='40.98';
    if(F) F.value='50.70';
    if(sw) sw.value='1';
    if(typeof applySwing==='function') applySwing(1);
    setPctApurado(7.59);
  }
  draw();
  setTimeout(draw, 500);
  setTimeout(seed, 1200);
})();
