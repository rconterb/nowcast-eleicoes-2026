(function(){
  var P22=[[1,7.14],[4.9,6.74],[10,5.48],[14.64,4.70],[20.26,4.61],[24.16,4.38],[30.81,3.92],[100,-5.23]];
  var P18=[[53,23.0],[88,19.8],[92.3,19.0],[99,17.2],[100,16.75]];
  function lead(path,p){
    if(p<=path[0][0]) return path[0][1];
    for(var i=1;i<path.length;i++){
      if(p<=path[i][0]){
        var a=path[i-1], b=path[i], t=(p-a[0])/(b[0]-a[0]);
        return a[1]+t*(b[1]-a[1]);
      }
    }
    return path[path.length-1][1];
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
    var r22=lead(P22,pct);
    var queda=-5.23-r22;
    var proj=hoje+queda;
    var card=document.createElement('div');
    card.className='card s12';
    card.id='ultimas';
    card.innerHTML='<div class="k">Hoje contra 2018 e 2022</div>'+
      '<div class="v" style="font-size:1.45rem;margin:8px 0">Flávio +'+hoje.toFixed(1).replace('.',',')+' pp aos '+pct.toFixed(1).replace('.',',')+'%</div>'+
      '<p class="help"><b>2022, neste ponto:</b> Bolsonaro +'+r22.toFixed(1).replace('.',',')+'. Hoje está '+(hoje-r22).toFixed(1).replace('.',',')+' pp à frente daquele caminho. A queda de 2022 até o fim foi '+Math.abs(queda).toFixed(1).replace('.',',')+' pp. Repetida, dá Lula '+(-proj).toFixed(1).replace('.',',')+' pp no final.</p>'+
      '<p class="help"><b>2018 não tem a trilha do começo.</b> O que há: aos 53% Bolsonaro +23 (49×26), aos 88% +19,8, no fim +16,8 (46,0×29,3). Noite de 2018 abriu muito na frente e quase não devolveu, porque Haddad não era o Lula e o Ciro levou 12%. Hoje +9,7 no Sul já é menos da metade daquela vantagem do meio da noite.</p>'+
      '<p class="tiny">Mais perto de 2022 do que de 2018. 2018 fechou Bolsonaro +16,8. 2022 fechou Lula +5,2. Esta noite, se seguir 2022, fica Lula na frente por cerca de 1,6 pp. Não fecha no 1º turno.</p>';
    host.insertBefore(card, host.firstChild);
  }
  draw();
  setTimeout(draw, 800);
  setInterval(draw, 5000);
})();
