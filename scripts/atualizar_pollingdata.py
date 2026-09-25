#!/usr/bin/env python3
"""Baixa o 1o turno presidencial por UF no acervo publico do PollingData
e escolhe a pesquisa mais recente com Lula e Flavio no mesmo cenario.

Uso:
  python3 atualizar_pollingdata.py

Gera pollingdata_ufs.json ao lado deste script.
A API /api/* alimenta o site; nao e documentada e o agregado estadual
costuma vir locked (produto Pro). Usamos a tabela tabPesquisas.
"""
from __future__ import annotations

import json
import time
import urllib.parse
import urllib.request
from collections import defaultdict
from pathlib import Path

UFS = [
    "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT",
    "PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO",
]
UA = {"User-Agent": "Mozilla/5.0 nowcast-eleitoral/2026"}


def get_json(url: str) -> dict:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.loads(r.read())


def who(nome: str) -> str | None:
    n = (nome or "").lower()
    if "lula" in n:
        return "Lula"
    if "flavio" in n or "flavio" in n:
        return "Flavio"
    return None


def fetch_uf(uf: str) -> dict:
    page = f"https://www.pollingdata.com.br/2026/presidente/{uf.lower()}/t1"
    api = (
        "https://flex.pollingdata.com.br/api/polls/candidates?url="
        + page.replace("https://", "https:%2F%2F")
    )
    data = get_json(api)
    tab = data.get("tabPesquisas") or []
    grouped: dict[tuple, dict] = defaultdict(dict)
    meta: dict[tuple, dict] = {}
    for rec in tab:
        cand = who(rec.get("candidato") or "")
        if not cand:
            continue
        key = (rec.get("data"), rec.get("registro"), rec.get("instituto"), rec.get("cenarioId"))
        grouped[key][cand] = rec.get("voto")
        meta[key] = rec

    complete = [k for k, v in grouped.items() if "Lula" in v and "Flavio" in v]
    complete.sort(reverse=True)
    chosen = None
    for key in complete:
        lula = grouped[key]["Lula"]
        flav = grouped[key]["Flavio"]
        if lula is None or flav is None:
            continue
        if lula + flav > 105 or lula > 80 or flav > 80:
            continue
        chosen = key
        break
    if chosen is None and complete:
        chosen = complete[0]
    pred = {
        c["name"]: c.get("votePrediction")
        for c in data.get("candidates") or []
        if c.get("votePrediction") is not None
    }
    out = {
        "uf": uf,
        "locked_agregador": bool(data.get("locked")),
        "agregador": pred,
        "n_cenarios_tabela": len(grouped),
    }
    if chosen:
        rec = meta[chosen]
        out.update(
            {
                "data": chosen[0],
                "registro": chosen[1],
                "instituto": chosen[2],
                "lula": grouped[chosen]["Lula"],
                "flavio": grouped[chosen]["Flavio"],
                "modo": rec.get("modo"),
                "entrevistas": rec.get("entrevistas"),
                "cenario": rec.get("cenarioNome"),
            }
        )
    return out


def fetch_nacional() -> dict:
    api = (
        "https://flex.pollingdata.com.br/api/polls/candidates?url="
        "https:%2F%2Fwww.pollingdata.com.br%2F2026%2Fpresidente%2Fbr%2Ft1_lula-flavio"
    )
    data = get_json(api)
    cands = data.get("candidates") or []
    return {
        "fonte": "PollingData agregador nacional T1",
        "url": "https://flex.pollingdata.com.br/pdvoto/2026/presidente/br/t1_lula-flavio",
        "candidatos": [
            {
                "nome": c.get("name"),
                "partido": c.get("party"),
                "previsao": c.get("votePrediction"),
                "ultima": c.get("lastPoll"),
            }
            for c in cands
            if c.get("isInDispute") and c.get("votePrediction") is not None
        ],
    }


def main() -> None:
    nacional = fetch_nacional()
    ufs = []
    for uf in UFS:
        try:
            row = fetch_uf(uf)
            ufs.append(row)
            print(
                f"{uf} {row.get('data')} L={row.get('lula')} F={row.get('flavio')} "
                f"{(row.get('instituto') or '')[:40]}"
            )
        except Exception as e:
            print(uf, "ERRO", e)
            ufs.append({"uf": uf, "erro": str(e)})
        time.sleep(0.12)
    payload = {
        "atualizado_em": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "fonte": "flex.pollingdata.com.br API publica do front",
        "nacional": nacional,
        "ufs": ufs,
    }
    dest = Path(__file__).resolve().parent / "pollingdata_ufs.json"
    dest.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print("gravou", dest)


if __name__ == "__main__":
    main()
