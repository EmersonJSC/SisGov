#!/usr/bin/env python3
"""Para cada par antigo->novo com o mesmo número de opções, a lei nova passa a
usar os valores (0 a 100) das opções antigas, na mesma posição. Assim as
consequências antigas, que dependem do valor, continuam dando o mesmo resultado.
Refaz o nível de partida do Brasil e o termo neutro das hipóteses novas."""
import json
from pathlib import Path
RAIZ = Path(__file__).resolve().parents[2]; CONT = RAIZ/"src"/"conteudo"; MUNDO = CONT/"mundo"; ARQ = CONT/"_arquivo-leis-antigas"
ler = lambda p: json.loads(Path(p).read_text(encoding="utf-8"))
def gravar(p, d): Path(p).write_text(json.dumps(d, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
plano = ler(Path(__file__).resolve().parent/"saida"/"plano-resto.json")
pl = ler(CONT/"paises/brasil/leis.json")
n_alinhadas = 0
for v, n in plano["pares"].items():
    if not (ARQ/"leis"/f"{v}.json").exists():
        continue  # par desfeito (lei de quantidade)
    velho = ler(ARQ/"leis"/f"{v}.json"); f = MUNDO/"leis"/f"{n}.json"; nova = ler(f)
    oo = sorted(velho["controle"].get("opcoes", []), key=lambda o: o["valor"]); no = nova["controle"]["opcoes"]
    if len(oo) != len(no) or not oo:
        continue
    ordem = sorted(range(len(no)), key=lambda i: no[i]["valor"])
    for pos, i in enumerate(ordem):
        no[i]["valor"] = oo[pos]["valor"]
    gravar(f, nova); n_alinhadas += 1
    # partida do Brasil: o nível volta a ser o da lei antiga
    var = nova["controle"]["variavel"]
    ent = next((e for e in pl["emVigor"] if e["lei"] == n), None)
    if ent and ent.get("opcao"):
        pl["controles"][var] = {o["id"]: o["valor"] for o in no}[ent["opcao"]]
    # hipóteses novas: termo neutro no nível de partida
    ids_velhos = set(velho.get("consequencias", []))
    for cid in nova["consequencias"]:
        if cid in ids_velhos:
            continue
        cf = MUNDO/"consequencias"/f"{cid}.json"
        if cf.exists() and var in pl["controles"]:
            c = ler(cf)
            if c["origem"] == var and c["mecanismo"] == "afim" and cid.startswith(n + "--") and c["parametros"].get("termoConstante", 0) != 0:
                c["parametros"]["termoConstante"] = round(-c["parametros"]["coeficiente"] * pl["controles"][var], 6)
                gravar(cf, c)
gravar(CONT/"paises/brasil/leis.json", pl)
print("pares com valores alinhados:", n_alinhadas)
