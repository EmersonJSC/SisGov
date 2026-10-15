#!/usr/bin/env python3
"""Consertos que toda troca precisa (rodar depois de trocar_resto.py --aplicar):
programas com linha inválida voltam à do HEAD, ministérios sem duplicata, bússola
com exatamente as opções da lei."""
import glob, json, subprocess
from pathlib import Path
RAIZ = Path(__file__).resolve().parents[2]; C = RAIZ/"src"/"conteudo"; M = C/"mundo"
ler = lambda p: json.loads(Path(p).read_text(encoding="utf-8"))
def gr(p, d): Path(p).write_text(json.dumps(d, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
H = lambda p: json.loads(subprocess.check_output(["git","show","HEAD:"+p], cwd=RAIZ))
leis = {p.stem: ler(p) for p in (M/"leis").glob("*.json")}
opc = lambda l: {o["id"] for o in leis.get(l, {}).get("controle", {}).get("opcoes", [])}
pr = ler(C/"bussola/programas.json"); pr0 = H("src/conteudo/bussola/programas.json"); n = 0
for nome, prog in pr["programas"].items():
    for i, l in enumerate(prog["leis"]):
        if not (l["lei"] in leis and ("opcao" not in l or l["opcao"] in opc(l["lei"]))):
            c = [x for x in pr0["programas"][nome]["leis"] if x["lei"] == l["lei"]]
            if c: prog["leis"][i] = c[0]; n += 1
gr(C/"bussola/programas.json", pr)
po = ler(C/"paises/brasil/politica.json"); h_min = {l: m["id"] for m in H("src/conteudo/paises/brasil/politica.json")["ministerios"]["ministerios"] for l in m["leis"]}
vistos = {}
for m in po["ministerios"]["ministerios"]:
    novos = []
    for l in m["leis"]:
        if l not in leis: continue
        if l in vistos:
            if h_min.get(l) == m["id"]: vistos[l]["leis"].remove(l); vistos[l] = m; novos.append(l)
            continue
        vistos[l] = m; novos.append(l)
    m["leis"] = novos
gr(C/"paises/brasil/politica.json", po)
b = ler(M/"bussola.json"); lados = ler(Path(__file__).resolve().parent/"saida"/"lados.json")["leis"]
for lei in leis.values():
    e = b["leis"].get(lei["id"]); ids = [o["id"] for o in lei["controle"].get("opcoes", [])]
    if e and "opcoes" in e:
        for i in ids:
            e["opcoes"].setdefault(i, lados.get(lei["id"], {}).get("opcoes", {}).get(i, [0, 0]))
        for i in list(e["opcoes"]):
            if i not in ids: del e["opcoes"][i]
gr(M/"bussola.json", b)
print("programas corrigidos:", n)
