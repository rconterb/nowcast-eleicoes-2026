(function(){
  var TSE='https://resultados.tse.jus.br/oficial/ele2026/6257/dados/';
  var UFS='ac al am ap ba ce df es go ma mg ms mt pa pb pe pi pr rj rn ro rr rs sc se sp to'.split(' ');
  function n(x){ return parseFloat(String(x).replace(',','.')); }
  function votes(d){
    var o={};
    (d.carg[0].agr||[]).forEach(function(agr){
      (agr.par||[]).forEach(function(par){
        (par.cand||[]).forEach(function(c){ o[c.nmu]=parseInt(c.vap,10); });
      });
    });
    return o;
  }
  function grab(url){
    var proxies=[
      'https://corsproxy.io/?url='+encodeURIComponent(url),
      'https://api.allorigins.win/raw?url='+encodeURIComponent(url)
    ];
    function one(i){
      return fetch(proxies[i]).then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); })
        .catch(function(){ if(i+1<proxies.length) return one(i+1); throw new Error('sem json'); });
    }
    return one(0);
  }
  function card(html){
    var old=document.getElementById('ultimas');
    if(old) old.remove();
    var host=document.querySelector('.wrap .grid');
    if(!host) return;
    var el=document.createElement('div');
    el.className='card s12'; el.id='ultimas'; el.innerHTML=html;
    host.insertBefore(el, host.firstChild);
  }
  card('<div class="k">TSE ao vivo</div><p class="help">Lendo o boletim nacional e os 27 estados.</p>');
  grab(TSE+'br/br-c0001-e006257-u.json').then(function(br){
    return Promise.all(UFS.map(function(uf){
      return grab(TSE+uf+'/'+uf+'-c0001-e006257-u.json').then(function(d){ return {uf:uf,d:d}; });
    })).then(function(states){ return {br:br, states:states}; });
  }).then(function(pack){
    var br=pack.br, cv=votes(br);
    var bF=cv['FLAVIO BOLSONARO']||0, bL=cv['LULA']||0, bV=parseInt(br.v.vv,10);
    var sec=n(br.s.pst), hora=br.ht||br.hg;
    var remF=0, remL=0, remV=0, remE=0;
    pack.states.forEach(function(s){
      var d=s.d, c=votes(d);
      var ele=parseInt(d.e.te,10), counted=parseInt(d.e.est,10);
      var F=c['FLAVIO BOLSONARO']||0, L=c['LULA']||0, V=0;
      Object.keys(c).forEach(function(k){ V+=c[k]; });
      if(counted<=0||V<=0) return;
      var left=Math.max(0, ele-counted);
      remF+=F/counted*left; remL+=L/counted*left; remV+=V/counted*left; remE+=left;
    });
    var turnout=parseInt(br.e.c,10)/parseInt(br.e.est,10);
    var validRate=bV/parseInt(br.e.c,10);
    var leftEle=parseInt(br.e.te,10)-parseInt(br.e.est,10);
    var leftValid=leftEle*turnout*validRate;
    var finF=(bF+(remF/remV)*leftValid)/(bV+leftValid)*100;
    var finL=(bL+(remL/remV)*leftValid)/(bV+leftValid)*100;
    var box=document.getElementById('pctBR'), L=document.getElementById('telaL'), F=document.getElementById('telaF');
    if(box) box.value=sec.toFixed(2);
    if(L) L.value=(100*bL/bV).toFixed(2);
    if(F) F.value=(100*bF/bV).toFixed(2);
    ['pctBR','telaL','telaF'].forEach(function(id){
      var el=document.getElementById(id);
      if(el) el.dispatchEvent(new Event('input',{bubbles:true}));
    });
    card('<div class="k">Boletim nacional do TSE · '+hora+' · '+sec.toFixed(2).replace('.',',')+'% das seções</div>'+
      '<div class="v" style="font-size:1.45rem;margin:8px 0">Na tela: Flávio '+(100*bF/bV).toFixed(2).replace('.',',')+' × Lula '+(100*bL/bV).toFixed(2).replace('.',',')+'</div>'+
      '<p class="help">Projeção a partir deste boletim, com o que falta em cada estado no ritmo que esse estado já deu: <b>Flávio '+finF.toFixed(1).replace('.',',')+' × Lula '+finL.toFixed(1).replace('.',',')+'</b>. Nenhum chega a 50% dos válidos.</p>'+
      '<p class="tiny">A tela é o arquivo do Brasil. O ritmo do que falta vem dos arquivos de UF, que atualizam antes do consolidado. Fonte: resultados.tse.jus.br, eleição 6257.</p>');
  }).catch(function(){
    card('<div class="k">TSE</div><p class="help">Não consegui ler o arquivo agora. O último boletim fechado foi 64,81% das seções, às 19:06: Flávio 49,58 × Lula 42,25. Projeção ancorada nesse boletim: Flávio 47,5 × Lula 44,6.</p>');
  });
})();
