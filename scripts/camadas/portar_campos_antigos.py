#!/usr/bin/env python3
"""Leva das leis antigas (arquivadas) para as novas os campos que o motor usa e
que a ficha não traz (V1-34, troca de Economia): `respostaTemporal`, `requer`
(com as opções remapeadas) e `efeitos` (curvas já escritas na lei antiga).
Só para os pares do mapa; idempotente."""
import json
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
CONT = RAIZ / "src" / "conteudo"
ARQ = CONT / "_arquivo-leis-antigas" / "leis"
mapa = json.loads((Path(__file__).resolve().parent / "saida" / "mapa-01.json").read_text(encoding="utf-8"))
n = 0
for velho, novo in mapa["leis"].items():
    antiga = json.loads((ARQ / f"{velho}.json").read_text(encoding="utf-8"))
    f = CONT / "mundo" / "leis" / f"{novo}.json"
    lei = json.loads(f.read_text(encoding="utf-8"))
    for campo in ("respostaTemporal", "requer"):
        if campo in antiga and campo not in lei:
            valor = antiga[campo]
            if campo == "requer":
                itens = valor if isinstance(valor, list) else [valor]
                for it in itens:
                    tab = mapa["opcoes"].get(it["lei"], {})
                    it["opcoes"] = [tab.get(o, o) for o in it["opcoes"]]
                    it["lei"] = mapa["leis"].get(it["lei"], it["lei"])
            lei[campo] = valor
            n += 1
    f.write_text(json.dumps(lei, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("campos portados:", n)

# Consequências antigas de mecanismo limiar/pontos (gatilhos e curvas): voltam
# para o mundo ligadas à variável nova da mesma lei (as opções mantêm a ordem).
import shutil
mu = json.loads((CONT / "mundo" / "mundo.json").read_text(encoding="utf-8"))
voltaram = 0
for f in sorted((CONT / "_arquivo-leis-antigas" / "consequencias").glob("*.json")):
    d = json.loads(f.read_text(encoding="utf-8"))
    if d["mecanismo"] == "afim" or d["origem"] not in mapa["variaveis"]:
        continue
    d["origem"] = mapa["variaveis"][d["origem"]]
    (CONT / "mundo" / "consequencias" / f.name).write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    # a lei nova passa a listar a consequência (o custo da lei lê essa lista)
    dono = next(p for p in (CONT / "mundo" / "leis").glob("*.json")
                if json.loads(p.read_text(encoding="utf-8"))["controle"]["variavel"] == d["origem"])
    lei_dono = json.loads(dono.read_text(encoding="utf-8"))
    if d["id"] not in lei_dono["consequencias"]:
        lei_dono["consequencias"].append(d["id"])
        dono.write_text(json.dumps(lei_dono, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    caminho = f"mundo/consequencias/{f.name}"
    if caminho not in mu["consequencias"]:
        mu["consequencias"].append(caminho)
    voltaram += 1
(CONT / "mundo" / "mundo.json").write_text(json.dumps(mu, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("consequências limiar/pontos religadas:", voltaram)

# Fichas v3 antigas com `efeitos` (curvas por opção já pesquisadas): viram
# consequências comuns da lei nova e substituem a hipótese gerada para o mesmo
# alvo (a hipótese vai para _arquivo-leis-antigas/hipoteses-substituidas/).
variaveis = {x["id"]: x for x in json.loads((CONT / "mundo" / "indicadores" / "variaveis.json").read_text(encoding="utf-8"))["variaveis"]}
mu = json.loads((CONT / "mundo" / "mundo.json").read_text(encoding="utf-8"))
(CONT / "_arquivo-leis-antigas" / "hipoteses-substituidas").mkdir(exist_ok=True)
criadas = 0
for velho, novo in mapa["leis"].items():
    antiga = json.loads((ARQ / f"{velho}.json").read_text(encoding="utf-8"))
    if "efeitos" not in antiga:
        continue
    f = CONT / "mundo" / "leis" / f"{novo}.json"
    lei = json.loads(f.read_text(encoding="utf-8"))
    alvos_curados = {e["alvo"] for e in antiga["efeitos"]}
    mantidas = []
    for cid in lei["consequencias"]:
        cf = CONT / "mundo" / "consequencias" / f"{cid}.json"
        if cf.exists() and json.loads(cf.read_text(encoding="utf-8"))["alvo"] in alvos_curados and cid.startswith(novo + "--"):
            shutil.move(str(cf), str(CONT / "_arquivo-leis-antigas" / "hipoteses-substituidas" / cf.name))
            mu["consequencias"] = [c for c in mu["consequencias"] if not c.endswith("/" + cf.name)]
        else:
            mantidas.append(cid)
    for e in antiga["efeitos"]:
        v = variaveis.get(e["alvo"])
        unidade = e.get("unidade") or (v["unidade"] + ("_por_passo" if v and v["tipo"] == "estoque" else "") if v else "")
        cid = f"{novo}--{e['alvo'].replace('_', '-')}"
        c = {"id": cid, "tipo": "consequencia", "versaoEsquema": 1, "origem": lei["controle"]["variavel"],
             "alvo": e["alvo"], "mecanismo": e["mecanismo"], "parametros": e["parametros"], "unidade": unidade,
             "atrasoPassos": e["atraso"], "duracao": e.get("duracao", {"modo": "continuo"})}
        (CONT / "mundo" / "consequencias" / f"{cid}.json").write_text(json.dumps(c, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        caminho = f"mundo/consequencias/{cid}.json"
        if caminho not in mu["consequencias"]:
            mu["consequencias"].append(caminho)
        if cid not in mantidas:
            mantidas.append(cid)
        criadas += 1
    lei["consequencias"] = mantidas
    f.write_text(json.dumps(lei, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
(CONT / "mundo" / "mundo.json").write_text(json.dumps(mu, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("consequências curadas das fichas v3 antigas:", criadas)
