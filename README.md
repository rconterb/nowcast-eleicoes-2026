# Nowcast eleições 2026

Compara **o que a tela do TSE mostra**, **o que as pesquisas preveriam naquele pedaço do eleitorado** e **a projeção final ponderada por estado**.

A apuração brasileira costuma divulgar primeiro o Sul e o Sudeste. Como o mapa é polarizado, o parcial das primeiras horas não é o Brasil — é um recorte. Este nowcast existe para não confundir os dois.

## Usar

Abra [`index.html`](index.html) no navegador (não precisa de servidor).

1. Digite o **% do Brasil já apurado** e o placar da TV (Lula / Flávio).
2. O modo **ordem típica** preenche os estados na sequência histórica de transmissão (SC → PR → RS → SP … → MA).
3. No domingo, o modo melhor é **informo o % por estado**: cole o percentual totalizado de cada UF. Se a UF já tiver resultado quase fechado, preencha Lula real / Flávio real.

Três colunas:

| Coluna | Significado |
| --- | --- |
| Tela agora | O que você digitou da TV / TSE |
| Esperado neste % | Pesquisas só no pedaço que o modelo acha que já chegou |
| Projeção final | Média ponderada pelo eleitorado das 27 UFs |

Julgue a tela contra o **esperado deste %, não contra o final**.

## Dados

- Eleitorado: TSE, jul/2026 (27 UFs; exterior fora).
- Pesquisas: última linha Lula × Flávio de cada UF no acervo do [PollingData](https://flex.pollingdata.com.br/home) (`/api/polls/candidates`).
- Agregador nacional do PD (24/09/2026): Lula 40,1% × Flávio 37,5%.
- O agregado **estadual** do PollingData costuma vir `locked` (produto Pro). O nowcast usa a pesquisa individual mais recente, não a curva suavizada.
- IVR é mais ruidoso que presencial. O instituto aparece na tabela.

Atualizar o JSON bruto:

```bash
python3 scripts/atualizar_pollingdata.py
```

A API do front do PollingData **não é oficial**. Pode mudar. Atribua a fonte; isto não é parceria.

## Publicar a página

No GitHub: **Settings → Pages → Deploy from a branch → `main` / root**.
A URL fica `https://rconterb.github.io/nowcast-eleicoes-2026/`.

## Limites

Isto não é resultado oficial, não endossa candidato e não substitui urna. Pesquisa tem margem, efeito-casa e abstenção desigual. RN no extrator do PD veio corrompido numa extração; o HTML usa fallback.

## Licença

MIT. Pesquisas e marcas pertencem aos institutos e ao PollingData.
