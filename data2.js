window.TURNO_LABEL='2º turno';
const T2={
  SC:{l:33.3,f:66.7,src:'1º turno renormalizado · válidos entre os dois'},
  PR:{l:34.3,f:65.7,src:'1º turno renormalizado · válidos entre os dois'},
  RS:{l:46.5,f:53.5,src:'1º turno renormalizado · válidos entre os dois'},
  SP:{l:46.2,f:53.8,src:'Quaest 23/09 · 2º turno (válidos)'},
  RJ:{l:45.0,f:55.0,src:'Quaest 23/09 · 2º turno (válidos)'},
  ES:{l:47.6,f:52.4,src:'1º turno renormalizado · válidos entre os dois'},
  MG:{l:50.0,f:50.0,src:'Quaest 23/09 · 2º turno (válidos)'},
  DF:{l:43.7,f:56.3,src:'Quaest 23/09 · 2º turno (válidos)'},
  GO:{l:39.1,f:60.9,src:'1º turno renormalizado · válidos entre os dois'},
  MS:{l:36.3,f:63.7,src:'1º turno renormalizado · válidos entre os dois'},
  MT:{l:30.0,f:70.0,src:'1º turno renormalizado · válidos entre os dois'},
  RO:{l:30.6,f:69.4,src:'1º turno renormalizado · válidos entre os dois'},
  AC:{l:35.4,f:64.6,src:'1º turno renormalizado · válidos entre os dois'},
  AM:{l:51.1,f:48.9,src:'1º turno renormalizado · válidos entre os dois'},
  AP:{l:46.5,f:53.5,src:'1º turno renormalizado · válidos entre os dois'},
  RR:{l:18.2,f:81.8,src:'1º turno renormalizado · válidos entre os dois'},
  TO:{l:51.4,f:48.6,src:'1º turno renormalizado · válidos entre os dois'},
  PA:{l:55.4,f:44.6,src:'1º turno renormalizado · válidos entre os dois'},
  SE:{l:69.0,f:31.0,src:'1º turno renormalizado · válidos entre os dois'},
  AL:{l:61.9,f:38.1,src:'1º turno renormalizado · válidos entre os dois'},
  PB:{l:58.8,f:41.2,src:'1º turno renormalizado · válidos entre os dois'},
  RN:{l:74.7,f:25.3,src:'1º turno renormalizado · válidos entre os dois'},
  PE:{l:69.9,f:30.1,src:'Quaest 23/09 · 2º turno (válidos)'},
  CE:{l:70.5,f:29.5,src:'1º turno renormalizado · válidos entre os dois'},
  BA:{l:56.3,f:43.7,src:'1º turno renormalizado · válidos entre os dois'},
  PI:{l:74.7,f:25.3,src:'1º turno renormalizado · válidos entre os dois'},
  MA:{l:50.6,f:49.4,src:'1º turno renormalizado · válidos entre os dois'}
};
DATA.forEach(d=>{const t=T2[d.uf];if(!t)return;d.l=t.l;d.f=t.f;d.src=t.src;});
window.PD_NACIONAL={l:51.1,f:48.9,data:'Datafolha 24/09 · válidos aprox. 47–45'};
if(typeof applyTypicalOrder==='function'){
  applyTypicalOrder(clamp(parseFloat(document.getElementById('pctBR').value)||15,0,100));
  if(typeof paint==='function')paint(true);
  if(typeof updateFirstRound==='function')updateFirstRound();
  if(typeof renderTargets==='function')renderTargets();
}
