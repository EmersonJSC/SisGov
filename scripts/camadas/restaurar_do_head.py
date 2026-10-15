#!/usr/bin/env python3
"""Restaura do HEAD (git) leis que já existiam antes da troca e foram tiradas
sem querer ao desfazer um par: arquivo da lei, variável, partida do Brasil,
ministérios, bússola, catálogo e as consequências que ela lista."""
import json, subprocess, sys
from pathlib import Path
RAIZ = Path(__file__).resolve().parents[2]; CONT = RAIZ/"src"/"conteudo"; MUNDO = CONT/"mundo"
ler = lambda p: json.loads(Path(p).read_text(encoding="utf-8"))
def gravar(p, d): Path(p).write_text(json.dumps(d, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
def head(path): return json.loads(subprocess.check_output(["git","show",f"HEAD:{path}"], cwd=RAIZ))
def existe_head(path): return subprocess.run(["git","cat-file","-e",f"HEAD:{path}"], cwd=RAIZ, capture_output=True).returncode == 0
ids = sys.argv[1:]
cat, vs, pl, po, bu, mu = (ler(MUNDO/"catalogo-leis.json"), ler(MUNDO/"indicadores"/"variaveis.json"), ler(CONT/"paises/brasil/leis.json"),
    ler(CONT/"paises/brasil/politica.json"), ler(MUNDO/"bussola.json"), ler(MUNDO/"mundo.json"))
h_vs = {x["id"]: x for x in head("src/conteudo/mundo/indicadores/variaveis.json")["variaveis"]}
h_pl, h_po, h_bu = head("src/conteudo/paises/brasil/leis.json"), head("src/conteudo/paises/brasil/politica.json"), head("src/conteudo/mundo/bussola.json")["leis"]
h_min = {l: m["id"] for m in h_po["ministerios"]["ministerios"] for l in m["leis"]}
n = 0
for x in ids:
    hp = f"src/conteudo/mundo/leis/{x}.json"
    if not existe_head(hp): continue
    lei = head(hp); n += 1; gravar(MUNDO/"leis"/f"{x}.json", lei)
    var = lei["controle"]["variavel"]
    if f"mundo/leis/{x}.json" not in cat["politicas"]: cat["politicas"].append(f"mundo/leis/{x}.json")
    vs["variaveis"] = [v for v in vs["variaveis"] if v["id"] != var] + ([h_vs[var]] if var in h_vs else [])
    pl["emVigor"] = [e for e in pl["emVigor"] if e["lei"] != x] + [e for e in h_pl["emVigor"] if e["lei"] == x]
    if var in h_pl["controles"]: pl["controles"][var] = h_pl["controles"][var]
    for m in po["ministerios"]["ministerios"]:
        m["leis"] = [l for l in m["leis"] if l != x]
        if h_min.get(x) == m["id"]: m["leis"].append(x)
    if x in h_bu: bu["leis"][x] = h_bu[x]
    for cid in lei.get("consequencias", []):
        cp = f"src/conteudo/mundo/consequencias/{cid}.json"
        if existe_head(cp) and not (MUNDO/"consequencias"/f"{cid}.json").exists():
            gravar(MUNDO/"consequencias"/f"{cid}.json", head(cp))
        if (MUNDO/"consequencias"/f"{cid}.json").exists() and f"mundo/consequencias/{cid}.json" not in mu["consequencias"]:
            mu["consequencias"].append(f"mundo/consequencias/{cid}.json")
        # origem: variável desta lei
        f = MUNDO/"consequencias"/f"{cid}.json"
        if f.exists():
            c = ler(f)
            if c["origem"].startswith("nivel_") and cid.startswith(x + "--") and c["origem"] != var and existe_head(cp) and head(cp)["origem"] == var:
                c["origem"] = var; gravar(f, c)
gravar(MUNDO/"catalogo-leis.json", cat); gravar(MUNDO/"indicadores"/"variaveis.json", vs); gravar(CONT/"paises/brasil/leis.json", pl)
gravar(CONT/"paises/brasil/politica.json", po); gravar(MUNDO/"bussola.json", bu); gravar(MUNDO/"mundo.json", mu)
print("restauradas do HEAD:", n)
