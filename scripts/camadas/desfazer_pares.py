#!/usr/bin/env python3
"""Desfaz a troca de leis de quantidade (dinheiro por ano, sem opções): a lei
antiga volta com suas consequências; a nova sai (mv para o arquivo)."""
import json, shutil, subprocess, sys
from pathlib import Path
RAIZ = Path(__file__).resolve().parents[2]; CONT = RAIZ/"src"/"conteudo"; MUNDO = CONT/"mundo"; ARQ = CONT/"_arquivo-leis-antigas"
ler = lambda p: json.loads(Path(p).read_text(encoding="utf-8"))
def gravar(p, d): Path(p).write_text(json.dumps(d, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
def head(path): return json.loads(subprocess.check_output(["git","show",f"HEAD:{path}"], cwd=RAIZ))
pares = [p.split("=") for p in sys.argv[1:]]  # velho=novo
(ARQ/"novas-fora-da-troca").mkdir(exist_ok=True)
mu, cat, vs, pl, po, bu = (ler(MUNDO/"mundo.json"), ler(MUNDO/"catalogo-leis.json"), ler(MUNDO/"indicadores"/"variaveis.json"),
    ler(CONT/"paises/brasil/leis.json"), ler(CONT/"paises/brasil/politica.json"), ler(MUNDO/"bussola.json"))
bu0 = head("src/conteudo/mundo/bussola.json")["leis"]; vs0 = {x["id"]: x for x in head("src/conteudo/mundo/indicadores/variaveis.json")["variaveis"]}
pl0 = head("src/conteudo/paises/brasil/leis.json")
for v, n in pares:
    if not (ARQ/"leis"/f"{v}.json").exists() and not ((MUNDO/"leis"/f"{v}.json").exists() and (ARQ/"novas-fora-da-troca"/f"{n}.json").exists() and v != n):
        if (MUNDO/"leis"/f"{v}.json").exists() and ler(MUNDO/"leis"/f"{v}.json").get("mesa") and "implantacaoTurnos" not in ler(MUNDO/"leis"/f"{v}.json"):
            pass
        else:
            print("já desfeito ou nunca trocado:", v); continue
    feito = (ARQ/"leis"/f"{v}.json").exists() is False
    velho = ler(ARQ/"leis"/f"{v}.json") if not feito else ler(MUNDO/"leis"/f"{v}.json")
    nova = ler(MUNDO/"leis"/f"{n}.json") if (MUNDO/"leis"/f"{n}.json").exists() and not feito else ler(ARQ/"novas-fora-da-troca"/f"{n}.json")
    var_v, var_n = velho["controle"]["variavel"], nova["controle"]["variavel"]
    if not feito:
        shutil.move(str(MUNDO/"leis"/f"{n}.json"), str(ARQ/"novas-fora-da-troca"/f"{n}.json"))
        shutil.move(str(ARQ/"leis"/f"{v}.json"), str(MUNDO/"leis"/f"{v}.json"))
    for cid in velho.get("consequencias", []):
        f = MUNDO/"consequencias"/f"{cid}.json"
        if f.exists():
            c = ler(f)
            if c["origem"] == var_n: c["origem"] = var_v; gravar(f, c)
    for cid in nova["consequencias"]:
        if cid not in velho.get("consequencias", []):
            f = MUNDO/"consequencias"/f"{cid}.json"
            if f.exists(): shutil.move(str(f), str(ARQ/"hipoteses-substituidas"/f.name))
    cat["politicas"] = [f"mundo/leis/{v}.json" if Path(p).stem == n else p for p in cat["politicas"]]
    vs["variaveis"] = [x for x in vs["variaveis"] if x["id"] != var_n and x["id"] != var_v] + ([vs0[var_v]] if var_v in vs0 else [])
    pl["emVigor"] = [e for e in pl["emVigor"] if e["lei"] not in (v, n)] + [e for e in pl0["emVigor"] if e["lei"] == v]
    pl["controles"].pop(var_n, None)
    if var_v in pl0["controles"]: pl["controles"][var_v] = pl0["controles"][var_v]
    for m in po["ministerios"]["ministerios"]: m["leis"] = [v if l == n else l for l in m["leis"]]
    bu["leis"].pop(n, None)
    if v in bu0: bu["leis"][v] = bu0[v]
    # referências em outros arquivos: n -> v
    if n != v:
        for f in CONT.rglob("*.json"):
            if "_arquivo" in str(f): continue
            t = f.read_text(encoding="utf-8")
            if f'"{n}"' in t or f'"eficacia:{n}"' in t:
                gravar(f, json.loads(t.replace(f'"{n}"', f'"{v}"').replace(f'"eficacia:{n}"', f'"eficacia:{v}"')))
    if n != v:
        for f in list((RAIZ/"src").rglob("*.ts")) + list((RAIZ/"src").rglob("*.tsx")):
            t = f.read_text(encoding="utf-8")
            if f'"{n}"' in t:
                f.write_text(t.replace(f'"{n}"', f'"{v}"'), encoding="utf-8")
mu["consequencias"] = [c for c in dict.fromkeys(mu["consequencias"]) if (CONT/c).exists()]
for nome, d in (("mundo.json", mu),): gravar(MUNDO/nome, d)
gravar(MUNDO/"catalogo-leis.json", cat); gravar(MUNDO/"indicadores"/"variaveis.json", vs)
gravar(CONT/"paises/brasil/leis.json", pl); gravar(CONT/"paises/brasil/politica.json", po); gravar(MUNDO/"bussola.json", bu)
print("desfeito:", pares)
