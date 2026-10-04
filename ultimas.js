(function(){
  function draw(){
    if(document.getElementById('ultimas')) return;
    const host=document.querySelector('.wrap .grid');
    if(!host) return;
    const card=document.createElement('div');
    card.className='card s12';
    card.id='ultimas';
    card.innerHTML='<div class="k">Urna agora · 7,59% apurado · Flávio 50,70 × Lula 40,98</div>'+
      '<p class="help"><b>% apurado</b> é o peso da TV no Brasil, não o placar. 7,59% é só Santa Catarina inteira e cerca de 73% do Paraná. O resto (92,41%) ainda não entrou.</p>'+
      '<p class="help"><b>50,70 × 40,98</b> é o pedaço, não o país. Os outros 8,32 pp são Cury, Renan, Caiado, branco e nulo. Em votos válidos entre os dois, isso vira 55,3 × 44,7 — Flávio não está em 50% do Brasil.</p>'+
      '<p class="help"><b>Mapa</b> diz o que o Sul deveria dar. Em 2018 esse pedaço era 72 × 28 para a direita; em 2022, 66 × 34. A TV em 50,7 × 41 está 15 a 21 pp pior para o Flávio do que o Sul histórico.</p>'+
      '<p class="help"><b>κ</b> = w/(w+0,28) = 0,213. Só 21% desse desvio passa para o que falta. O resto continua o mapa.</p>'+
      '<p class="help"><b>Palpite do final</b> com essa urna: mapa 2022 → Lula 52,8 × Flávio 45,0. Meio → 50,6 × 47,1. Mapa 2018 → 48,5 × 49,3. Não é vitória no 1º turno: 50% dos válidos exige que os outros candidatos encolham.</p>'+
      '<p class="tiny">P(vitória) do painel é P(passar de 50) no modelo de dois. No 1º turno real ainda há terceiro. Com 7,59% a urna pesa 27% do palpite (w + (1−w)κ); 73% ainda é mapa.</p>';
    host.insertBefore(card, host.firstChild);
  }
  function seed(){
    if(typeof setPctApurado!=='function') return;
    window._telaTouched=true;
    const L=document.getElementById('telaL'), F=document.getElementById('telaF');
    if(L) L.value='40.98';
    if(F) F.value='50.70';
    setPctApurado(7.59);
  }
  draw();
  setTimeout(draw, 500);
  setTimeout(seed, 900);
})();
