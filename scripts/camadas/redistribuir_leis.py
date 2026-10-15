#!/usr/bin/env python3
"""Põe cada lei na esfera do assunto dela (V1-36, 15/out).

As leis novas sem lei antiga correspondente tinham caído no primeiro ministério
(Fazenda): Economia chegou a 62 leis, com defesa, segurança, direitos e
previdência dentro. Aqui cada lei vai para a esfera da área da ficha dela.
Mexe só em `paises/brasil/politica.json` (lista de leis do ministério) e no
campo `ministerio` da lei. Idempotente."""
import collections, glob, json, subprocess
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
CONT = RAIZ / "src" / "conteudo"
ALVO = {
    "Defesa e relações exteriores": "seguranca",
    "Segurança, penas, drogas e armas": "seguranca",
    "Direitos, costumes, religião e imigração": "direitos",
    "Instituições, sistema político e informação": "governo",
    "Previdência, assistência, moradia e demografia": "previdencia",
    "Trabalho, salário e sindicatos": "trabalho",
    "Educação, ciência e cultura": "educacao",
    "Impostos e contas públicas": "economia",
    "Saúde": "saude",
}
# leis que já estavam no catálogo antes da troca pelas fichas (5a01a6d) têm o
# ministério escolhido a dedo: não mexe
antigas = set(
    Path(x).stem
    for x in subprocess.check_output(
        ["git", "ls-tree", "--name-only", "5a01a6d", "src/conteudo/mundo/leis/"], cwd=RAIZ
    ).decode().split()
)
po = json.loads((CONT / "paises/brasil/politica.json").read_text(encoding="utf-8"))
mins = po["ministerios"]["ministerios"]
# leis citadas nas regras de extinção de um ministério também ficam onde estão
antigas |= {l for m in mins for l in (m.get("extincao") or {}).get("leis", {})}
por_id = {m["id"]: m for m in mins}
onde = {l: m["id"] for m in mins for l in m["leis"]}
leis = {}
for f in glob.glob(str(CONT / "mundo/leis/*.json")):
    d = json.loads(Path(f).read_text(encoding="utf-8"))
    leis[d["id"]] = (Path(f), d)
# ministério mais usado por cada área da ficha dentro da esfera alvo
uso = collections.defaultdict(collections.Counter)
for i, (_, d) in leis.items():
    mid = onde.get(i)
    if mid and por_id[mid]["area"] == ALVO.get(d.get("area")):
        uso[d["area"]][mid] += 1
movidas = []
for i, (f, d) in sorted(leis.items()):
    alvo = ALVO.get(d.get("area"))
    mid = onde.get(i)
    if i in antigas or not alvo or not mid or por_id[mid]["area"] == alvo:
        continue
    candidatos = [m for m in mins if m["area"] == alvo]
    escolhido = (uso[d["area"]].most_common(1) or [(candidatos[0]["id"], 0)])[0][0]
    por_id[mid]["leis"].remove(i)
    por_id[escolhido]["leis"].append(i)
    d["ministerio"] = por_id[escolhido]["nome"]
    f.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    movidas.append((i, por_id[mid]["area"], alvo))
(CONT / "paises/brasil/politica.json").write_text(json.dumps(po, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
c = collections.Counter((a, b) for _, a, b in movidas)
print(len(movidas), "leis movidas:", dict(c))
