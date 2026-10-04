(function(){
  function draw(){
    var old=document.getElementById('ultimas');
    if(old) old.remove();
    var host=document.querySelector('.wrap .grid');
    if(!host) return;
    var card=document.createElement('div');
    card.className='card s12';
    card.id='ultimas';
    card.innerHTML='<div class="k">47,26% das seções · Flávio 50,20 × Lula 41,63</div>'+
      '<div class="v" style="font-size:1.5rem;margin:8px 0">Projeção: Flávio 46 × Lula 44. 2º turno.</div>'+
      '<p class="help">O 50,20 é o pedaço que já chegou (Sul e parte do Sudeste). No Paraná, com 19% das urnas, era 59 × 31. Datafolha de ontem, votos válidos: SP 45 × 39 para o Flávio, RJ 48 × 40, MG 44 × 44, PE 65 × 26 para o Lula, DF 49 × 37 para o Flávio.</p>'+
      '<p class="help">Junta o que já entrou (47%) com o Datafolha no resto: Flávio 46, Lula 44. Se o resto seguir só a queda de 2022, Flávio termina +1 a +2 pp, ainda abaixo de 50% dos válidos. Cury 3,0, Caiado 2,4 e Renan 2,3 impedem o 1º turno.</p>'+
      '<p class="tiny">Mapa do TSE por estado não abriu nesta leitura. Quando sair o % de cada UF, a conta troca o Datafolha pelo que já foi apurado naquele estado.</p>';
    host.insertBefore(card, host.firstChild);
  }
  draw();
  setTimeout(draw, 600);
})();
