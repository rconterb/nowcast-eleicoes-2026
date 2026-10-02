(function(){
  function draw(){
    if(document.getElementById('ultimas')) return;
    const host=document.querySelector('.wrap .grid');
    if(!host) return;
    const card=document.createElement('div');
    card.className='card s12';
    card.id='ultimas';
    card.innerHTML='<div class="k">Últimas pesquisas nacionais · puxadas em 2/10</div>'+
      '<p class="help">O slider 2018/2022 continua sendo o mapa da noite. Estes números são o retrato nacional, não o pedaço da TV. PollingData ainda tem série de presidente até 1/10, mas a API de candidatos veio vazia nesta leitura.</p>'+
      '<table style="margin-top:8px"><tr><th class="lft">Instituto</th><th>Data</th><th>1º Lula</th><th>1º Flávio</th><th>2º Lula</th><th>2º Flávio</th></tr>'+
      '<tr><td class="lft">Datafolha</td><td>1/10</td><td>42</td><td>38</td><td class="l">48</td><td class="f">45</td></tr>'+
      '<tr><td class="lft">Meio/Ideia</td><td>30/9</td><td>39,4</td><td>38,4</td><td class="l">48,5</td><td class="f">48</td></tr>'+
      '<tr><td class="lft">Atlas/Bloomberg</td><td>29/9</td><td>45,3</td><td>42,2</td><td class="l">47,6</td><td class="f">47,7</td></tr>'+
      '<tr><td class="lft">Quaest</td><td>28/9</td><td>39</td><td>34</td><td class="l">42</td><td class="f">42</td></tr>'+
      '<tr><td class="lft">BTG/Nexus</td><td>28/9</td><td>42</td><td>37</td><td class="l">46</td><td class="f">44</td></tr>'+
      '</table>'+
      '<p class="tiny">2º turno: empate técnico em todos. Datafolha e Meio dão Lula na frente por 3 e 0,5 pp; Atlas empata 47,6×47,7; Quaest 42×42 (com mais branco/nulo). O painel antigo estava em pesquisas de ~23/9.</p>';
    const pick=document.getElementById('pickTurno');
    if(pick&&pick.nextSibling) host.insertBefore(card, pick.nextSibling);
    else host.insertBefore(card, host.firstChild);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', draw);
  else draw();
  setTimeout(draw, 400);
})();
