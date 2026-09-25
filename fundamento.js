function ensureFundamento(){
  if(document.getElementById('fundamento'))return;
  const host=document.querySelector('.wrap .grid');
  if(!host)return;
  const card=document.createElement('div');
  card.className='card s12';
  card.id='fundamento';
  card.innerHTML=`<div class="k">De onde vêm as contas</div>
<p class="help">Tudo abaixo é reproduzível. e_i é o eleitorado da UF i (TSE). p^L_i e p^F_i são as últimas pesquisas Lula e Flávio naquela UF (PollingData). w_i é a fração já apurada da UF. T é o eleitorado nacional.</p>

<p class="tiny"><b>1. Mosaico nacional das pesquisas.</b> Não é a pesquisa nacional do instituto. É a média das pesquisas estaduais ponderada pelo eleitorado:</p>
<p class="tiny" style="font-family:ui-monospace,monospace">M_L = Σ (e_i · p^L_i) / T &nbsp;&nbsp;|&nbsp;&nbsp; M_F = Σ (e_i · p^F_i) / T</p>
<p class="tiny">Hoje isso dá cerca de Lula 40,6% × Flávio 40,3%. O resto até 100% são outros + brancos tácitos da pesquisa.</p>

<p class="tiny"><b>2. Esperado neste pedaço.</b> Com a ordem típica Sul → Nordeste, o site preenche as UFs até somar o % apurado. O placar que as pesquisas dariam nesse recorte é:</p>
<p class="tiny" style="font-family:ui-monospace,monospace">E_L = Σ (e_i w_i p^L_i) / Σ (e_i w_i)</p>
<p class="tiny">Por isso, com 15–28% apurado, Flávio aparece alto: o recorte ainda é Sul e interior de São Paulo. Não é o Brasil.</p>

<p class="tiny"><b>3. Palpite simples (aritmético).</b> O que já saiu fica com o número da TV (T_L, T_F). O que falta fica com a pesquisa da UF:</p>
<p class="tiny" style="font-family:ui-monospace,monospace">F^{arit}_L = w · T_L + (1-w) · R_L</p>
<p class="tiny">onde R_L é o mosaico das pesquisas só nas fatias ainda não apuradas. Isso não espalha o desvio da TV para o resto.</p>

<p class="tiny"><b>4. Palpite estatístico (encolhimento do viés).</b> O desvio da TV em relação ao esperado é r_L = T_L − E_L. No começo da noite esse r pode ser só composição (Sul chegando) ou ruído. O site trata uma fração κ como viés de pesquisa e aplica ao que falta:</p>
<p class="tiny" style="font-family:ui-monospace,monospace">κ = w / (w + 0,28) &nbsp;&nbsp;|&nbsp;&nbsp; R'_L = R_L + κ · r_L &nbsp;&nbsp;|&nbsp;&nbsp; F^{est}_L = w · T_L + (1-w) · R'_L</p>
<p class="tiny">O 0,28 é um prior: com 15% apurado, κ ≈ 35%; com 50%, κ ≈ 64%; com 80%, κ ≈ 74%. É um encolhimento no estilo Empirical Bayes — o mesmo espírito do nowcast de eleição (não copiar o residuo cedo demais). Não é amostragem oficial do TSE.</p>

<p class="tiny"><b>5. 50% + 1 dos válidos.</b> No 1º turno brasileiro vence quem tem mais da metade dos votos válidos. Usamos o limiar 50%. A folga nacional é Δ_L = 50 − M_L. Se essa folga fosse somada em todo estado (swing uniforme de Butler), a TV neste pedaço deveria ser E_L + Δ_L. Isso é o que gerava números irreais quando se forçava o resto a ficar parado na pesquisa crua: T ≥ (50 − (1-w)R) / w.</p>

<p class="tiny"><b>6. Swing amortecido por região (o que 2018 e 2022 ensinam).</b> O acréscimo não é uniforme. Definimos uma matriz de transferência φ(origem, destino) calibrada no mapa das duas eleições: a direita fez 57% no Sul nas duas e 26–28% no Nordeste nas duas. Logo φ(Sul, Nordeste) = 0,22. A base do Lula é o Nordeste; a do Flávio é o Sul. O extra da UF i é:</p>
<p class="tiny" style="font-family:ui-monospace,monospace">x_i = Δ · φ(base, região_i) · T / Σ_j e_j φ(base, região_j)</p>
<p class="tiny">A constante no denominador garante Σ e_i x_i / T = Δ: o país inteiro sobe exatamente até 50%, mas Santa Catarina sobe muito mais que a Bahia no cenário do Flávio, e o contrário no do Lula. Matriz usada: Sul→NE 0,22; Sul→SE 0,55; Sul→CO 0,70; Sul→Norte 0,35; mesma região 1,00.</p>

<p class="tiny"><b>7. O que a TV de agora implica para o resto.</b> Se você cola o placar da TV, o resto precisaria render S = (50 − w·T) / (1-w) para o candidato ainda fechar 50%. A diferença S − R é o extra exigido dos estados que faltam — inclusive os fracos. Se esse extra for maior do que o x_i amortecido daqueles estados, a rota do 1º turno quebrou.</p>

<p class="tiny"><b>Limites.</b> Pesquisas estaduais têm qualidade desigual (IVR ≠ presencial). RN no PollingData veio corrompido e foi trocado por Quaest. Eleitorado TSE ≠ votos válidos no dia (abstenção e nulos mudam o peso). A matriz φ tem só dois ciclos (2018, 2022) e não é uma lei da física. κ = 0,28 é um prior, não uma estimativa de máxima verossimilhança. Não é resultado oficial.</p>`;
  host.appendChild(card);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureFundamento);
else ensureFundamento();
