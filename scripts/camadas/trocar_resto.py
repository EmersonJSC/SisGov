#!/usr/bin/env python3
"""Troca as leis das outras áreas pelas leis geradas das fichas (V1-34).

Uso (depois de `gerar_leis.py` sem --area, que gera as 11 áreas):
  python3 scripts/camadas/trocar_resto.py [--aplicar]

Regras (decididas para não quebrar o jogo):
  * Lei antiga com par claro (mesmo id, parecido ou apontado à mão em PARES_A_MAO)
    é trocada pela nova: a antiga vai com mv para src/conteudo/_arquivo-leis-antigas/.
  * As consequências antigas da lei (entradas e saídas) FICAM, ligadas à variável
    nova; a nova só ganha as hipóteses de índices que a antiga não cobria, com o
    termo constante que as deixa neutras na partida de partida do Brasil.
  * Lei antiga SEM par, ou orçamentária/tributária (alíquota contínua), FICA como
    está; o par novo dessas é listado em pendencias-resto.md (não entra).
  * Lei nova sem lei antiga correspondente entra como lei nova.
  * Opções antigas -> novas pelo valor mais próximo (0 a 100).
Sem --aplicar só escreve o plano (saida/plano-resto.json).
"""

from __future__ import annotations

import argparse
import difflib
import json
import re
import shutil
import subprocess
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
CONT = RAIZ / "src" / "conteudo"
MUNDO = CONT / "mundo"
SAIDA = Path(__file__).resolve().parent / "saida"
ARQ = CONT / "_arquivo-leis-antigas"

PARES_A_MAO = {
    "policia-militar": "natureza-da-policia-de-rua",
    "beneficio-idosos-e-deficientes": "renda-para-idosos-e-pessoas-com-deficiencia-pobres",
    "cannabis-legal": "cannabis",
    "carvao": "usinas-a-carvao",
    "cuidados-de-longa-duracao": "quem-cuida-do-idoso-dependente",
    "discriminacao-por-orientacao-sexual": "discriminacao-e-crimes-de-odio",
    "precificacao-carbono": "preco-do-carbono",
    "programas-sociais-por-missao": "organizacao-dos-programas-sociais",
    "reajuste-de-beneficios": "regra-de-reajuste-dos-beneficios",
    "saneamento-basico": "agua-e-esgoto",
    "reforma-agraria": "redistribuicao-de-terras",
    "seguranca-alimentar": "garantia-de-comida",
    "sistema-de-saude": "modelo-do-sistema-de-saude",
    "direito-a-moradia": "direito-a-moradia-na-constituicao",
    "dinheiro-para-igrejas": "imunidade-e-dinheiro-para-igrejas",
    "agrotoxicos": "registro-de-agrotoxicos",
    "poderes-de-investigacao-policial": "poderes-de-investigacao",
    "protecao-violencia-domestica": "protecao-contra-violencia-domestica",
    "refugiados-e-asilo": "refugio-e-asilo",
    "programa-medicos-no-interior": "programa-de-medicos-no-interior",
    "pensao-por-morte": "pensao-para-viuvos-e-orfaos",
    "fundo-seguranca-publica": "fundo-de-seguranca-publica",
}
FISCAIS = {"orcamentaria", "tributaria"}
# Leis cujo comportamento o motor lê pelas opções (destino da sobra, cofre, regra fiscal)
MOTOR = {"destino-do-resultado-fiscal", "fundo-soberano", "regra-fiscal",
         # piloto da mesa do salário mínimo: camadas já ligadas entre si (V1-34)
         "formula-do-salario-minimo", "quem-decide-o-salario-minimo", "salario-minimo", "reajuste-de-beneficios"}


def ler(p):
    return json.loads(Path(p).read_text(encoding="utf-8"))


def gravar(p, d):
    Path(p).write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def mais_perto(valor, opcoes):
    return min(opcoes, key=lambda o: abs(o["valor"] - valor))["id"]


def planejar():
    novas = {p.stem: ler(p) for p in (SAIDA / "leis").glob("*.json")}
    atuais = {p.stem: ler(p) for p in (MUNDO / "leis").glob("*.json")}
    # leis já no formato novo (Economia): não entram de novo
    prontas = {k for k, d in atuais.items() if "implantacaoTurnos" in d}
    pendentes = {k: d for k, d in atuais.items() if k not in prontas}
    candidatas = [k for k in novas if k not in prontas]
    pares, ficam, fiscais = {}, [], []
    contrapartes = {}
    usadas = set()
    for k, d in sorted(pendentes.items()):
        if d.get("grupo") in FISCAIS or not d["controle"].get("opcoes"):  # alíquota/dinheiro contínuo
            fiscais.append(k)
            alvo = PARES_A_MAO.get(k) or (k if k in novas else None)
            continue
        if k in MOTOR:
            ficam.append(k)
            usadas.add(k)
            contrapartes[k] = k
            continue
        alvo = PARES_A_MAO.get(k)
        if alvo is None and k in novas:
            alvo = k
        if alvo is None:
            m = difflib.get_close_matches(k, [c for c in candidatas if c not in usadas], n=1, cutoff=0.8)
            alvo = m[0] if m else None
        if alvo and alvo in novas and alvo not in usadas and alvo not in prontas:
            pares[k] = alvo
            usadas.add(alvo)
        else:
            ficam.append(k)
    # contrapartes novas das leis fiscais que ficam
    for k in fiscais:
        alvo = PARES_A_MAO.get(k) or (k if k in novas else None)
        if not alvo:
            m = difflib.get_close_matches(k, candidatas, n=1, cutoff=0.8)
            alvo = m[0] if m else None
        if alvo:
            contrapartes[k] = alvo
            usadas.add(alvo)
    novas_puras = [k for k in candidatas if k not in usadas and k not in atuais and k + "-lei" not in atuais]
    return novas, atuais, pares, ficam, fiscais, contrapartes, novas_puras


def casar_opcoes(velho, novo):
    """Casa as opções antigas com as novas, em ordem, pelo texto e pela posição.

    Devolve (mapa id antigo -> id novo, valores novos por id novo). A opção
    nova que corresponde a uma antiga herda o valor (0 a 100) dela, para as
    consequências antigas darem o mesmo resultado; as sem par recebem valores
    entre os vizinhos."""
    oo = sorted(velho["controle"].get("opcoes", []), key=lambda o: o["valor"])
    no = novo["controle"]["opcoes"]
    n, m = len(oo), len(no)
    ordem = sorted(range(m), key=lambda j: no[j]["valor"])
    no_ord = [no[j] for j in ordem]
    if n == m:
        pares = list(range(m))
    else:
        sim = [[difflib.SequenceMatcher(None, oo[i]["rotulo"].lower(), no_ord[j]["rotulo"].lower()).ratio()
                - 0.3 * abs(i / max(n - 1, 1) - j / max(m - 1, 1)) for j in range(m)] for i in range(n)]
        # programação dinâmica: atribuição não decrescente que maximiza a semelhança
        melhor = [[(-1e9, -1)] * m for _ in range(n)]
        for j in range(m):
            melhor[0][j] = (sim[0][j], -1)
        for i in range(1, n):
            for j in range(m):
                cand = max(((melhor[i - 1][k][0], k) for k in range(j + 1)), key=lambda x: x[0])
                melhor[i][j] = (cand[0] + sim[i][j], cand[1])
        j = max(range(m), key=lambda j: melhor[n - 1][j][0])
        pares = [0] * n
        for i in range(n - 1, -1, -1):
            pares[i] = j
            j = melhor[i][j][1]
    mapa = {oo[i]["id"]: no_ord[pares[i]]["id"] for i in range(n)}
    # valores: a nova herda a antiga (a primeira, se várias caem nela)
    val = {}
    for i in range(n):
        val.setdefault(no_ord[pares[i]]["id"], oo[i]["valor"])
    ids = [o["id"] for o in no_ord]
    fixos = [(k, val[ids[k]]) for k in range(m) if ids[k] in val]
    out = {}
    for k in range(m):
        if ids[k] in val:
            out[ids[k]] = val[ids[k]]
            continue
        antes = [f for f in fixos if f[0] < k]
        depois = [f for f in fixos if f[0] > k]
        if antes and depois:
            (a, va), (b, vb) = antes[-1], depois[0]
            out[ids[k]] = round(va + (vb - va) * (k - a) / (b - a), 2)
        elif antes:
            out[ids[k]] = min(100, round(antes[-1][1] + 10 * (k - antes[-1][0]), 2))
        else:
            out[ids[k]] = max(0, round(depois[0][1] - 10 * (depois[0][0] - k), 2))
    return mapa, out


def mapa_de_opcoes(velho, novo):
    return casar_opcoes(velho, novo)[0]


def remapear(x, M):
    leis, opc, var = M["leis"], M["opcoes"], M["variaveis"]
    if isinstance(x, dict):
        velho = x.get("lei") if isinstance(x.get("lei"), str) else None
        if velho in leis:
            tab = opc.get(velho, {})
            x = dict(x)
            x["lei"] = leis[velho]
            for chave in ("opcao", "de", "para"):
                if isinstance(x.get(chave), str):
                    x[chave] = tab.get(x[chave], x[chave])
            if isinstance(x.get("opcoes"), list) and all(isinstance(o, str) for o in x["opcoes"]):
                x["opcoes"] = [tab.get(o, o) for o in x["opcoes"]]
        return {(var.get(k, leis.get(k, k)) if isinstance(k, str) else k): remapear(v, M) for k, v in x.items()}
    if isinstance(x, list):
        return [remapear(i, M) for i in x]
    if isinstance(x, str):
        if x in var:
            return var[x]
        for pre in ("eficacia:", "apoio:"):
            if x.startswith(pre) and x[len(pre):] in leis:
                return pre + leis[x[len(pre):]]
        return x
    return x


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--aplicar", action="store_true")
    a = ap.parse_args()
    novas, atuais, pares, ficam, fiscais, contrapartes, novas_puras = planejar()
    M = {"leis": {}, "opcoes": {}, "variaveis": {}}
    for v, n in pares.items():
        M["leis"][v] = n
        M["variaveis"][atuais[v]["controle"]["variavel"]] = novas[n]["controle"]["variavel"]
        M["opcoes"][v] = mapa_de_opcoes(atuais[v], novas[n])
    plano = {"pares": pares, "ficam_sem_par": ficam, "fiscais_ficam": fiscais,
             "contrapartes_fora": contrapartes, "novas_puras": novas_puras}
    gravar(SAIDA / "plano-resto.json", plano)
    print(f"pares: {len(pares)}; antigas que ficam sem par: {len(ficam)}; fiscais que ficam: {len(fiscais)}; novas puras: {len(novas_puras)}")
    if not a.aplicar:
        return

    (ARQ / "leis").mkdir(parents=True, exist_ok=True)
    (ARQ / "hipoteses-substituidas").mkdir(exist_ok=True)
    mu = ler(MUNDO / "mundo.json")
    cat = ler(MUNDO / "catalogo-leis.json")
    vs = ler(MUNDO / "indicadores" / "variaveis.json")
    pl = ler(CONT / "paises" / "brasil" / "leis.json")
    po = ler(CONT / "paises" / "brasil" / "politica.json")
    bu = ler(MUNDO / "bussola.json")
    bu_antigo = json.loads(subprocess.check_output(["git", "show", "HEAD:src/conteudo/mundo/bussola.json"], cwd=RAIZ))["leis"]
    brasil = ler(SAIDA / "brasil.json")
    variaveis = {x["id"]: x for x in vs["variaveis"]}
    cons_dir = MUNDO / "consequencias"
    ministerio_de = {l: m for m in po["ministerios"]["ministerios"] for l in m["leis"]}
    lados = ler(SAIDA / "lados.json")["leis"]

    def hipoteses_neutras(lei, ids_cobertos, nivel_brasil):
        """Ids das hipóteses da lei nova para alvos que a antiga não cobria."""
        ids = []
        for cid in lei["consequencias"]:
            f = SAIDA / "consequencias" / f"{cid}.json"
            if not f.exists():
                continue
            c = ler(f)
            if c["alvo"] in ids_cobertos:
                continue
            if nivel_brasil is not None and c["mecanismo"] == "afim":
                c["parametros"]["termoConstante"] = round(-c["parametros"]["coeficiente"] * nivel_brasil, 6)
            gravar(cons_dir / f"{cid}.json", c)
            if f"mundo/consequencias/{cid}.json" not in mu["consequencias"]:
                mu["consequencias"].append(f"mundo/consequencias/{cid}.json")
            ids.append(cid)
        return ids

    # --- pares -----------------------------------------------------------
    for v, n in pares.items():
        velho, nova = atuais[v], json.loads(json.dumps(novas[n]))
        _, vals = casar_opcoes(velho, nova)
        for o in nova["controle"]["opcoes"]:
            o["valor"] = vals[o["id"]]
        var_v, var_n = velho["controle"]["variavel"], nova["controle"]["variavel"]
        shutil.move(str(MUNDO / "leis" / f"{v}.json"), str(ARQ / "leis" / f"{v}.json"))
        # consequências antigas: ficam, ligadas à variável nova
        antigos = list(velho.get("consequencias", []))
        alvos_cobertos = set()
        for cid in antigos:
            f = cons_dir / f"{cid}.json"
            if not f.exists():
                continue
            c = ler(f)
            alvos_cobertos.add(c["alvo"])
            if c["origem"] == var_v:
                c["origem"] = var_n
                gravar(f, c)
        # curvas inline (ficha v3 antiga) viram consequências comuns
        for e in velho.get("efeitos", []):
            vv = variaveis.get(e["alvo"])
            un = e.get("unidade") or ((vv["unidade"] + ("_por_passo" if vv["tipo"] == "estoque" else "")) if vv else "")
            cid = f"{n}--{e['alvo'].replace('_', '-')}"
            gravar(cons_dir / f"{cid}.json", {
                "id": cid, "tipo": "consequencia", "versaoEsquema": 1, "origem": var_n, "alvo": e["alvo"],
                "mecanismo": e["mecanismo"], "parametros": e["parametros"], "unidade": un,
                "atrasoPassos": e["atraso"], "duracao": e.get("duracao", {"modo": "continuo"})})
            if f"mundo/consequencias/{cid}.json" not in mu["consequencias"]:
                mu["consequencias"].append(f"mundo/consequencias/{cid}.json")
            antigos.append(cid)
            alvos_cobertos.add(e["alvo"])
        # nível da partida do Brasil (opção antiga -> nova)
        op_velha = next((e.get("opcao") for e in pl["emVigor"] if e["lei"] == v), None)
        op_nova = M["opcoes"][v].get(op_velha) if op_velha else None
        nivel_n = {o["id"]: o["valor"] for o in nova["controle"]["opcoes"]}.get(op_nova) if op_nova else None
        extras = hipoteses_neutras(nova, alvos_cobertos, nivel_n)
        nova["consequencias"] = list(dict.fromkeys(antigos + extras))
        for k in ("respostaTemporal", "ministerio"):
            if k in velho:
                nova[k] = velho[k]
        nova.setdefault("respostaTemporal", {"implantacao": 0.3, "degradacao": 0.2})
        if "requer" in velho:
            itens = velho["requer"] if isinstance(velho["requer"], list) else [velho["requer"]]
            itens = remapear(itens, M)
            nova["requer"] = itens if isinstance(velho["requer"], list) else itens[0]
            if "nivelLegal" not in velho:
                nova.pop("nivelLegal", None)  # lei filha do formato antigo: cai para a base
        gravar(MUNDO / "leis" / f"{n}.json", nova)
        # catálogo, variáveis, partida, ministérios, bússola
        cat["politicas"] = [p for p in cat["politicas"] if Path(p).stem != v]
        if f"mundo/leis/{n}.json" not in cat["politicas"]:
            cat["politicas"].append(f"mundo/leis/{n}.json")
        vs["variaveis"] = [x for x in vs["variaveis"] if x["id"] != var_v]
        antiga_var = variaveis.get(var_v, {})
        vs["variaveis"].append({"id": var_n, "tipo": "controle", "nome": nova["nome"], "unidade": "nivel_escopo",
                                "dominio": {"minimo": 0, "maximo": 100}, "valorInicial": 0,
                                "area": antiga_var.get("area", nova["area"])})
        for e in pl["emVigor"]:
            if e["lei"] == v:
                e["lei"], e["opcao"] = n, op_nova
                pl["controles"].pop(var_v, None)
                pl["controles"][var_n] = nivel_n
        for m in po["ministerios"]["ministerios"]:
            m["leis"] = [n if l == v else l for l in m["leis"]]
        ent = bu_antigo.get(v)
        bu["leis"].pop(v, None)
        if ent and "opcoes" in ent:
            ent = json.loads(json.dumps(ent))
            ent["opcoes"] = {M["opcoes"][v].get(k, k): vec for k, vec in ent["opcoes"].items()}
            bu["leis"][n] = ent
        else:
            bu["leis"][n] = {"manifesto": [], "porque": "Lado da ficha da lei (hipótese do estudo, V1-34).",
                             "opcoes": lados[n]["opcoes"]}

    # --- leis novas sem antiga ------------------------------------------
    padrao = {}
    for v, n in pares.items():
        padrao.setdefault(novas[n]["area"], []).append(atuais[v].get("ministerio"))
    mins_por_nome = {m["nome"]: m for m in po["ministerios"]["ministerios"]}
    for n in novas_puras:
        nova = dict(novas[n])
        escolhidos = [x for x in padrao.get(nova["area"], []) if x in mins_por_nome]
        nome_min = max(set(escolhidos), key=escolhidos.count) if escolhidos else po["ministerios"]["ministerios"][0]["nome"]
        nova["ministerio"] = nome_min
        nova.setdefault("respostaTemporal", {"implantacao": 0.3, "degradacao": 0.2})
        op = brasil.get(n)
        nivel_n = {o["id"]: o["valor"] for o in nova["controle"]["opcoes"]}.get(op) if op else None
        nova["consequencias"] = hipoteses_neutras(nova, set(), nivel_n)
        gravar(MUNDO / "leis" / f"{n}.json", nova)
        if f"mundo/leis/{n}.json" not in cat["politicas"]:
            cat["politicas"].append(f"mundo/leis/{n}.json")
        vs["variaveis"].append({"id": nova["controle"]["variavel"], "tipo": "controle", "nome": nova["nome"],
                                "unidade": "nivel_escopo", "dominio": {"minimo": 0, "maximo": 100},
                                "valorInicial": 0, "area": nova["area"]})
        if op:
            pl["emVigor"].append({"lei": n, "opcao": op})
            pl["controles"][nova["controle"]["variavel"]] = nivel_n
        mins_por_nome[nome_min]["leis"].append(n)
        bu["leis"][n] = {"manifesto": [], "porque": "Lado da ficha da lei (hipótese do estudo, V1-34).",
                         "opcoes": lados[n]["opcoes"]}

    mu["consequencias"] = [c for c in dict.fromkeys(mu["consequencias"]) if (CONT / c).exists()]
    gravar(MUNDO / "mundo.json", mu)
    gravar(MUNDO / "catalogo-leis.json", cat)
    gravar(MUNDO / "indicadores" / "variaveis.json", vs)
    gravar(CONT / "paises" / "brasil" / "leis.json", pl)
    gravar(CONT / "paises" / "brasil" / "politica.json", po)
    gravar(MUNDO / "bussola.json", bu)

    # --- referências em todos os outros arquivos --------------------------
    velhos = set(M["leis"]) | set(M["variaveis"])
    mudou = 0
    arquivos = [p for p in CONT.rglob("*.json") if "_arquivo" not in str(p) and "/testes/" not in str(p) and p.name not in ("mundo.json",)]
    for f in arquivos:
        t = f.read_text(encoding="utf-8")
        if not any(f'"{x}"' in t or f'"eficacia:{x}"' in t or f'"apoio:{x}"' in t for x in velhos):
            continue
        d = remapear(json.loads(t), M)
        if d != json.loads(t):
            gravar(f, d)
            mudou += 1
    # ids de lei citados em .ts (busca, ícones, testes)
    trocas = {k: v for k, v in M["leis"].items() if k != v}
    for f in list((RAIZ / "src").rglob("*.ts")) + list((RAIZ / "src").rglob("*.tsx")):
        t = f.read_text(encoding="utf-8")
        novo = t
        for k, v in trocas.items():
            novo = novo.replace(f'"{k}"', f'"{v}"')
        if novo != t:
            f.write_text(novo, encoding="utf-8")
    pend = ["# Pendências da troca das outras áreas (V1-34)\n",
            "\n## Leis antigas que ficaram sem par nas fichas (continuam como estão)\n"] + [f"- {k}\n" for k in ficam]
    pend += ["\n## Leis orçamentárias/tributárias antigas mantidas (a ficha nova delas ainda não entrou)\n"]
    pend += [f"- {k} (ficha: {contrapartes.get(k, 'sem par')})\n" for k in fiscais]
    (SAIDA / "pendencias-resto.md").write_text("".join(pend), encoding="utf-8")
    print(f"trocadas: {len(pares)}; novas puras: {len(novas_puras)}; arquivos reescritos: {mudou}")


if __name__ == "__main__":
    main()
