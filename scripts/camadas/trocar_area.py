#!/usr/bin/env python3
"""Troca as leis de Economia (área 1) pelas leis geradas em saida/ (V1-34).

Antes: python3 scripts/camadas/gerar_leis.py --area 1
Uso:   python3 scripts/camadas/trocar_area.py [--aplicar]

Sem --aplicar só escreve scripts/camadas/saida/mapa-01.json e mostra o plano.
Nada é apagado: as leis e consequências antigas vão com mv para
src/conteudo/_arquivo-leis-antigas/. Os demais arquivos são reescritos pelo mapa
lei/opção antiga -> nova (posição a posição: as listas de opções têm o mesmo
tamanho nas 18 leis com opções; as tarifas viram a opção mais próxima).
"""

from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
CONT = RAIZ / "src" / "conteudo"
MUNDO = CONT / "mundo"
SAIDA = Path(__file__).resolve().parent / "saida"
ARQ = CONT / "_arquivo-leis-antigas"
# Fica a lei antiga: tributária de alíquota contínua; o motor não aceita opções nela.
FORA = set()

PARES = {
    "acordos-comerciais": "acordos-comerciais",
    "banco-de-desenvolvimento": "banco-de-desenvolvimento",
    "controle-de-capitais": "controle-de-capitais",
    "controle-de-precos": "controle-de-precos",
    "cooperativas-e-autogestao": "cooperativas-e-autogestao",
    "defesa-da-concorrencia": "defesa-da-concorrencia",
    "empresas-estatais-e-privatizacao": "papel-do-estado-empresario",
    "investimento-estrangeiro": "investimento-estrangeiro",
    "liberdade-economica": "licenca-para-abrir-negocio",
    "meta-de-inflacao": "mandato-do-banco-central",
    "nacionalizacao": "nacionalizacao",
    "planejamento-da-economia": "planejamento-da-economia",
    "politica-industrial": "politica-industrial",
    "programa-de-privatizacao": "programa-de-privatizacao",
    "propriedade-dos-meios-de-producao": "propriedade-dos-meios-de-producao",
    "regulacao-bancaria": "regulacao-dos-bancos",
    "autonomia-banco-central": "quem-controla-o-banco-central",
    "regime-cambial": "regime-cambial",
    "tarifas-de-importacao": "tarifas-de-importacao",
    "regime-do-petroleo-e-mineracao": "regime-do-petroleo-e-mineracao",
}


def ler(p):
    return json.loads(Path(p).read_text(encoding="utf-8"))


def gravar(p, d):
    Path(p).write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def variavel(lei_json):
    return lei_json["controle"]["variavel"]


def montar_mapa():
    novas = {p.stem: ler(p) for p in (SAIDA / "leis").glob("*.json") if p.stem not in FORA}
    mapa = {"leis": {}, "opcoes": {}, "variaveis": {}}
    for velho, novo in PARES.items():
        ov = ler(ARQ / "leis" / f"{velho}.json") if (ARQ / "leis" / f"{velho}.json").exists() else ler(MUNDO / "leis" / f"{velho}.json")
        nv = novas[novo]
        mapa["leis"][velho] = novo
        mapa["variaveis"][variavel(ov)] = variavel(nv)
        oo = [o["id"] for o in ov["controle"].get("opcoes", [])]
        no = [o["id"] for o in nv["controle"]["opcoes"]]
        if oo:
            assert len(oo) == len(no), (velho, oo, no)
            mapa["opcoes"][velho] = dict(zip(oo, no))
        else:  # tarifas: o nível antigo é a alíquota; vira a opção mais perto
            mapa["opcoes"][velho] = {"_por_faixa": no}
    return mapa, novas


def opcao_da_aliquota(nivel: float, nova: dict) -> str:
    ops = nova["controle"]["opcoes"]
    f = nova["controle"]["faixa"]
    return min(ops, key=lambda o: abs(o["valor"] - nivel))["id"]


def remapear(x, mapa, novas):
    """Reescreve referências a leis/opções/variáveis antigas, em qualquer JSON."""
    leis, opc, var = mapa["leis"], mapa["opcoes"], mapa["variaveis"]
    if isinstance(x, dict):
        velho = x.get("lei") if isinstance(x.get("lei"), str) else None
        if velho in leis:
            novo = leis[velho]
            tab = opc.get(velho, {})
            x = dict(x)
            x["lei"] = novo
            for chave in ("opcao", "de", "para"):
                if isinstance(x.get(chave), str):
                    x[chave] = tab.get(x[chave], x[chave])
            if isinstance(x.get("opcoes"), list) and all(isinstance(o, str) for o in x["opcoes"]):
                x["opcoes"] = [tab.get(o, o) for o in x["opcoes"]]
            if "nivel" in x and "_por_faixa" in tab:
                x["opcao"] = opcao_da_aliquota(x.pop("nivel"), novas[novo])
        return {(var.get(k, leis.get(k, k)) if isinstance(k, str) else k): remapear(v, mapa, novas) for k, v in x.items()}
    if isinstance(x, list):
        return [remapear(i, mapa, novas) for i in x]
    if isinstance(x, str):
        return var.get(x, x)
    return x


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--aplicar", action="store_true")
    a = ap.parse_args()
    mapa, novas = montar_mapa()
    gravar(SAIDA / "mapa-01.json", mapa)
    velhas = set(PARES)
    vars_velhas = set(mapa["variaveis"])
    cons_velhas = []
    for f in (MUNDO / "consequencias").glob("*.json"):
        d = ler(f)
        eficacia = d["alvo"].startswith("eficacia:") and d["alvo"].split(":", 1)[1] in velhas and PARES.get(d["alvo"].split(":", 1)[1]) != d["alvo"].split(":", 1)[1]
        if d["origem"] in vars_velhas or eficacia:
            cons_velhas.append(f)
    print(f"leis antigas: {len(velhas)}; consequências antigas a arquivar: {len(cons_velhas)}")
    if not a.aplicar:
        return

    (ARQ / "leis").mkdir(parents=True, exist_ok=True)
    (ARQ / "consequencias").mkdir(parents=True, exist_ok=True)
    # 1. arquivar com mv
    for v in velhas:
        shutil.move(str(MUNDO / "leis" / f"{v}.json"), str(ARQ / "leis" / f"{v}.json"))
    for f in cons_velhas:
        shutil.move(str(f), str(ARQ / "consequencias" / f.name))
    # 2. novas
    for p in (SAIDA / "leis").glob("*.json"):
        if p.stem in FORA:
            continue
        shutil.copy(p, MUNDO / "leis" / p.name)
    ids_cons = []
    for p in (SAIDA / "consequencias").glob("*.json"):
        if p.name.startswith(tuple(f + "--" for f in FORA)):
            continue
        shutil.copy(p, MUNDO / "consequencias" / p.name)
        ids_cons.append(p.name)
    # 3. listas (catálogo e mundo)
    cat = ler(MUNDO / "catalogo-leis.json")
    pol = [p for p in cat["politicas"] if Path(p).stem not in velhas]
    pol += [f"mundo/leis/{p.name}" for p in sorted((SAIDA / "leis").glob("*.json")) if f"mundo/leis/{p.name}" not in pol]
    cat["politicas"] = pol
    gravar(MUNDO / "catalogo-leis.json", cat)
    mu = ler(MUNDO / "mundo.json")
    arq_nomes = {f.name for f in cons_velhas}
    lista = [c for c in mu["consequencias"] if Path(c).name not in arq_nomes]
    lista += [f"mundo/consequencias/{n}" for n in sorted(ids_cons) if f"mundo/consequencias/{n}" not in lista]
    mu["consequencias"] = lista
    gravar(MUNDO / "mundo.json", mu)
    # 4. variáveis
    vs = ler(MUNDO / "indicadores" / "variaveis.json")
    vs["variaveis"] = [x for x in vs["variaveis"] if x["id"] not in vars_velhas]
    for lei in novas.values():
        vs["variaveis"].append({
            "id": variavel(lei), "tipo": "controle", "nome": lei["nome"],
            "unidade": lei["controle"]["unidade"], "dominio": {"minimo": 0, "maximo": 100},
            "valorInicial": 0, "area": "Economia, finanças e comércio exterior",
        })
    gravar(MUNDO / "indicadores" / "variaveis.json", vs)
    # 5. país: leis em vigor e controles
    brasil = ler(SAIDA / "brasil.json")
    pl = ler(CONT / "paises" / "brasil" / "leis.json")
    novo_vigor = []
    for e in pl["emVigor"]:
        novo_vigor.append(remapear(e, mapa, novas))
    ja = {e["lei"] for e in novo_vigor}
    for lei, op in brasil.items():
        if lei not in ja:
            novo_vigor.append({"lei": lei, "opcao": op})
    pl["emVigor"] = novo_vigor
    ctrl = {}
    for k, v in pl["controles"].items():
        if k in vars_velhas:
            continue
        ctrl[k] = v
    for e in novo_vigor:
        if e["lei"] in novas and "opcao" in e:
            ops = {o["id"]: o["valor"] for o in novas[e["lei"]]["controle"]["opcoes"]}
            ctrl[variavel(novas[e["lei"]])] = ops[e["opcao"]]
    pl["controles"] = ctrl
    gravar(CONT / "paises" / "brasil" / "leis.json", pl)
    # 6. bússola do mundo: lado de cada opção a partir da ficha
    bu = ler(MUNDO / "bussola.json")
    lados = ler(SAIDA / "lados.json")["leis"]
    for velho in velhas:
        bu["leis"].pop(velho, None)
    for lei, d in lados.items():
        bu["leis"][lei] = {"manifesto": [], "porque": "Lado da ficha da lei (hipótese do estudo, V1-34).",
                           "opcoes": d["opcoes"]}
    gravar(MUNDO / "bussola.json", bu)
    # 6b. ministérios: cada lei nova entra no ministério da antiga (ou no da
    # política industrial, no caso das leis sem par).
    po = ler(CONT / "paises" / "brasil" / "politica.json")
    mins = po["ministerios"]["ministerios"]
    for m in mins:
        m["leis"] = [mapa["leis"].get(l, l) for l in m["leis"]]
    ja = {l for m in mins for l in m["leis"]}
    padrao = next(m for m in mins if "politica-industrial" in m["leis"])
    for lei in novas:
        if lei not in ja:
            padrao["leis"].append(lei)
    gravar(CONT / "paises" / "brasil" / "politica.json", po)
    # 7. demais arquivos que citam leis antigas
    alvos = [CONT / "bussola" / "programas.json", MUNDO / "patrocinadores.json", MUNDO / "pressao.json"]
    alvos += [f for f in (MUNDO / "dilemas").glob("*.json")] + [f for f in (MUNDO / "eventos").glob("*.json")]
    alvos += [MUNDO / "consequencias" / n for n in ()]
    mudou = []
    for f in alvos:
        antes = f.read_text(encoding="utf-8")
        if not any(v in antes for v in list(velhas) + list(vars_velhas)):
            continue
        novo = remapear(json.loads(antes), mapa, novas)
        gravar(f, novo)
        mudou.append(f.name)
    print("reescritos:", mudou)
    print("OK")


if __name__ == "__main__":
    main()
