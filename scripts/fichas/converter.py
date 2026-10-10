#!/usr/bin/env python3
"""Converte as fichas de lei (docs/fichas/areas) nos JSONs do mundo e do Brasil.

Uso:
  python3 scripts/fichas/converter.py            # ensaio: só mostra o resumo
  python3 scripts/fichas/converter.py --aplicar  # grava

O que faz:
- cria as leis v2, as variáveis de controle, as bolhas que as fichas usam e as
  consequências (efeitos e eficácia);
- remove as leis antigas que não estão nas fichas e as bolhas que nenhuma lei
  nem consequência usa;
- coloca no Brasil as leis vigentes (campo "brasil" de cada ficha).

Tradução das palavras da ficha em números (padrões; o balanceamento é do M7):
- força: fraca/média/forte = 3/7/12 pontos de 100 ao longo do eixo inteiro
  (bolha lenta: 0,05/0,12/0,25 por passo);
- atraso: imediato/meses/anos = 0/1/4 passos (trimestres);
- condição citando uma opção = limiar a partir do valor dessa opção.
Fichas marcadas como colidentes em PENDENTES ficam de fora.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
FICHAS = RAIZ / "docs" / "fichas"
CONTEUDO = RAIZ / "src" / "conteudo"
MUNDO = CONTEUDO / "mundo"
BRASIL = CONTEUDO / "paises" / "brasil" / "estado-inicial.json"

# Leis que colidem com outra e esperam decisão do autor.
PENDENTES = {
    "renda-basica-universal": "colide com transferencia-de-renda (a renda básica plena substitui as transferências)",
}

FORCA_INDICE = {"fraca": 3, "media": 7, "forte": 12}
FORCA_ESTOQUE = {"fraca": 0.05, "media": 0.12, "forte": 0.25}
ATRASO = {"imediato": 0, "meses": 1, "anos": 4}
CUSTO_OPCAO = {"baixo": 0.05, "medio": 0.2, "alto": 0.6}  # % do PIB na última opção
PIB = 12_000_000

UNIDADES_BOLHA = {"indice_0_100", "percentual_0_100", "percentual_pib", "taxa_por_100_mil"}
TAXA = {"indice_0_100": "indice_0_100_por_passo", "percentual_pib": "percentual_pib_por_passo"}

SUGERIDAS = {  # id: (tipo, avaliacao)
    "exportacoes": ("calculado", "maior_melhor"), "importacoes": ("calculado", "neutra"),
    "sonegacao": ("calculado", "maior_pior"), "informalidade": ("calculado", "maior_pior"),
    "custo_trabalhista": ("calculado", "neutra"), "inovacao": ("calculado", "maior_melhor"),
    "qualidade_ambiental": ("calculado", "maior_melhor"), "emissoes": ("calculado", "maior_pior"),
    "desmatamento": ("calculado", "maior_pior"), "oferta_energia": ("calculado", "maior_melhor"),
    "preco_energia": ("calculado", "maior_pior"), "preco_alimentos": ("calculado", "maior_pior"),
    "deficit_habitacional": ("calculado", "maior_pior"), "lotacao_prisional": ("calculado", "maior_pior"),
    "uso_drogas": ("calculado", "maior_pior"), "natalidade": ("calculado", "neutra"),
    "envelhecimento": ("estoque", "neutra"), "imigracao": ("calculado", "neutra"),
    "liberdade_civil": ("calculado", "maior_melhor"), "popularidade_governo": ("calculado", "maior_melhor"),
    "polarizacao": ("calculado", "maior_pior"), "reputacao_internacional": ("calculado", "maior_melhor"),
    "turismo": ("calculado", "maior_melhor"), "mobilidade_urbana": ("calculado", "maior_melhor"),
    "concentracao_mercado": ("calculado", "maior_pior"), "credito": ("calculado", "maior_melhor"),
    "endividamento_familias": ("calculado", "maior_pior"), "protestos": ("situacao", "maior_pior"),
    "greve_geral": ("situacao", "maior_pior"), "apagao": ("situacao", "maior_pior"),
    "golpe_risco": ("situacao", "maior_pior"),
}
PARTIDA_BRASIL = {"divida_publica": 77, "reservas_internacionais": 16, "envelhecimento": 40,
                  "escolaridade": 45, "desenvolvimento": 50, "infraestrutura": 45}
BASE_TRIBUTO = {"imposto-renda-pessoas": "renda_familias", "imposto-sobre-consumo": "consumo"}


def ler(p: Path):
    return json.loads(p.read_text(encoding="utf-8"))


def escrever(p: Path, dados) -> None:
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(dados, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def snake(lei_id: str) -> str:
    return lei_id.replace("-", "_")


def definicoes_pilares():
    sys.path.insert(0, str(RAIZ / "scripts" / "camadas"))
    try:
        import gerar  # type: ignore
    except ImportError:
        return {}
    defs = {}
    for camada in gerar.CAMADAS.values():
        for pilar in camada["pilares"]:
            for b in pilar["bolhas"]:
                if "json" in b:
                    defs[b["json"]["id"]] = b["json"]
    return defs


def bolha_nova(ficha: dict, area: str) -> dict:
    tipo = {"indice": "calculado", "bolha_lenta": "estoque", "situacao": "situacao"}.get(ficha.get("tipo"), "calculado")
    unidade = ficha.get("unidade", "indice_0_100")
    if unidade == "percentual":
        unidade = "percentual_0_100"
    if unidade not in UNIDADES_BOLHA or (tipo == "estoque" and unidade not in TAXA):
        unidade = "indice_0_100"
    if tipo == "situacao":
        unidade = "percentual_0_100"
    avaliacao = {"neutro": "neutra"}.get(ficha.get("avaliacao"), ficha.get("avaliacao") or "neutra")
    maximo = 1000 if unidade == "taxa_por_100_mil" else 100
    j = {"id": ficha["id"], "tipo": tipo, "nome": ficha.get("nome", ficha["id"]), "unidade": unidade,
         "dominio": {"minimo": 0, "maximo": maximo}, "area": area, "avaliacao": avaliacao}
    if tipo == "situacao":
        j["surgimento"] = 30
    return j


def bolha_sugerida(bid: str, nome: str) -> dict:
    tipo, avaliacao = SUGERIDAS.get(bid, ("calculado", "neutra"))
    unidade = "percentual_0_100" if tipo == "situacao" else "indice_0_100"
    j = {"id": bid, "tipo": tipo, "nome": nome.split(" (")[0], "unidade": unidade,
         "dominio": {"minimo": 0, "maximo": 100}, "area": "Geral", "avaliacao": avaliacao}
    if tipo == "situacao":
        j["surgimento"] = 30
    return j


def main(aplicar: bool) -> None:
    catalogo = ler(FICHAS / "catalogo.json")
    areas = [ler(p) for p in sorted((FICHAS / "areas").glob("*.json"))]
    fichas = [(a["area"], l) for a in areas for l in a["leis"] if l["id"] not in PENDENTES]
    novas = {}
    for a in areas:
        for b in a.get("novas_bolhas", []):
            novas.setdefault(b["id"], (b, a["area"]))

    variaveis_doc = ler(MUNDO / "indicadores" / "variaveis.json")
    antigas = {v["id"]: v for v in variaveis_doc["variaveis"]}
    leis_catalogo = ler(MUNDO / "catalogo-leis.json")
    estado = ler(BRASIL)
    pilares = definicoes_pilares()

    # ---------- leis, controles e consequências das leis ----------
    variaveis: dict[str, dict] = {}
    consequencias: dict[str, dict] = {}
    leis_json: dict[str, dict] = {}
    vigentes, valores_controle = [], {}
    usadas: set[str] = set()
    gasto_brasil = 0.0

    for area, f in fichas:
        lid, grupo = f["id"], f["grupo"]
        processo = {"institucional": "emenda-constitucional", "orcamentaria": "execucao-programa-autorizado"}.get(grupo, "lei-ordinaria")
        lei = {"id": lid, "tipo": "lei", "versaoEsquema": 2, "grupo": grupo, "nome": f["nome"],
               "descricao": f["descricao"], "area": area, "ministerio": f.get("ministerio") or "Presidência",
               "processoAutorizacao": processo}
        opcoes = f.get("opcoes") or []
        faixa = f.get("faixa") or {}
        if grupo in ("regulatoria", "institucional"):
            var = f"nivel_{snake(lid)}"
            n = len(opcoes)
            valores_op = {o["id"]: round(100 * i / (n - 1)) for i, o in enumerate(opcoes)}
            custo = f.get("custo") or {}
            ops = []
            for o in opcoes:
                op = {"id": o["id"], "rotulo": o["rotulo"], "valor": valores_op[o["id"]]}
                if custo.get("tipo") == "gasto":
                    op["custoAnualPercentualPib"] = round(CUSTO_OPCAO[custo.get("tamanho", "baixo")] * op["valor"] / 100, 4)
                ops.append(op)
            lei["controle"] = {"variavel": var, "unidade": "nivel_escopo", "opcoes": ops}
            variaveis[var] = {"id": var, "tipo": "controle", "nome": f["nome"], "unidade": "nivel_escopo",
                              "dominio": {"minimo": 0, "maximo": 100}, "valorInicial": ops[0]["valor"], "area": area}
            amplitude, inicio = 100, 0
            escolha = f.get("brasil") if f.get("brasil") in valores_op else opcoes[0]["id"]
            vigentes.append({"lei": lid, "opcao": escolha})
            valores_controle[var] = valores_op[escolha]
        elif grupo == "orcamentaria":
            var = f"recursos_{snake(lid)}"
            lei["controle"] = {"variavel": var, "unidade": "moeda_ano"}
            lei["orcamento"] = {"modo": "valor_fixo", "limites": {
                "minimoPercentualPib": faixa.get("minimo", 0), "maximoPercentualPib": faixa.get("maximo", 1)}}
            variaveis[var] = {"id": var, "tipo": "controle", "nome": f"Recursos: {f['nome']}", "unidade": "moeda_ano",
                              "dominio": {"minimo": 0}, "valorInicial": 0, "area": area}
            amplitude, inicio = faixa.get("maximo", 1) * PIB / 100, 0
            nivel = round(float(f.get("brasil") or 0) * PIB / 100)
            vigentes.append({"lei": lid, "nivel": nivel})
            valores_controle[var] = nivel
            gasto_brasil += nivel
            valores_op = {}
        else:  # tributaria
            var = f"aliquota_{snake(lid)}"
            lei["controle"] = {"variavel": var, "unidade": "percentual_0_100"}
            lei["tributo"] = {"base": BASE_TRIBUTO.get(lid, "pib"),
                              "limites": {"minimo": faixa.get("minimo", 0), "maximo": faixa.get("maximo", 100)}}
            variaveis[var] = {"id": var, "tipo": "controle", "nome": f"Alíquota: {f['nome']}", "unidade": "percentual_0_100",
                              "dominio": {"minimo": 0, "maximo": 100}, "valorInicial": faixa.get("minimo", 0), "area": area}
            amplitude, inicio = max(faixa.get("maximo", 100) - faixa.get("minimo", 0), 1e-9), faixa.get("minimo", 0)
            nivel = float(f.get("brasil") or 0)
            vigentes.append({"lei": lid, "nivel": nivel})
            valores_controle[var] = nivel
            valores_op = {}

        ids_lei = []
        for i, e in enumerate(f["efeitos"]):
            alvo = e["alvo"]
            usadas.add(alvo)
            cid = f"{lid}--{alvo}".replace("_", "-") + (f"-{i}" if any(x["alvo"] == alvo for x in f["efeitos"][:i]) else "")
            sinal = 1 if e["sinal"] == "+" else -1
            limiar = None
            cond = (e.get("condicao") or "").lower()
            if cond and valores_op:
                achados = [(cond.find(o), o) for o in valores_op if o in cond]
                if achados:
                    limiar = min(valores_op[o] for _, o in achados)
                    if limiar >= 100:
                        limiar = 99
            consequencias[cid] = {"_alvo": alvo, "_forca": e["forca"], "_sinal": sinal, "_amp": amplitude,
                                  "_inicio": inicio, "_limiar": limiar, "origem": var,
                                  "atrasoPassos": ATRASO.get(e["atraso"], 0)}
            ids_lei.append(cid)
        lei["consequencias"] = ids_lei
        lei["respostaTemporal"] = {"implantacao": 0.3, "degradacao": 0.2}
        leis_json[lid] = lei

        efic = f.get("eficacia") or {}
        for lado, s in (("aumenta", 1), ("reduz", -1)):
            for origem in efic.get(lado, []):
                usadas.add(origem)
                cid = f"{origem}--eficacia-{lid}".replace("_", "-")
                consequencias[cid] = {"_eficacia": s, "origem": origem, "alvo": f"eficacia:{lid}"}

    # ---------- bolhas ----------
    sugeridas = catalogo["bolhas_sugeridas"]
    novas_vars = {}
    # rede antiga: consequências entre bolhas que continuam valendo
    pasta_c = MUNDO / "consequencias"
    antigas_c = {p.stem: ler(p) for p in pasta_c.glob("*.json")}
    controles_antigos = {v for v, d in antigas.items() if d["tipo"] == "controle"}

    def bolha_valida(bid):
        return bid in antigas or bid in pilares or bid in novas or bid in sugeridas

    rede = {}
    for cid, c in antigas_c.items():
        o, a = c["origem"], c["alvo"]
        if o in controles_antigos or ":" in a or ":" in o:
            continue
        rede[cid] = c
    # bolhas mantidas = usadas pelas leis + ligadas na rede a alguma usada (fecho)
    mantidas = set(usadas)
    mudou = True
    while mudou:
        mudou = False
        for c in rede.values():
            if c["alvo"] in mantidas and c["origem"] not in mantidas and bolha_valida(c["origem"]):
                mantidas.add(c["origem"]); mudou = True
    rede = {k: c for k, c in rede.items() if c["origem"] in mantidas and c["alvo"] in mantidas}
    for bid in sorted(mantidas):
        if bid in antigas and antigas[bid]["tipo"] != "controle":
            novas_vars[bid] = antigas[bid]
        elif bid in pilares:
            novas_vars[bid] = pilares[bid]
        elif bid in novas:
            novas_vars[bid] = bolha_nova(*novas[bid])
        elif bid in sugeridas:
            novas_vars[bid] = bolha_sugerida(bid, sugeridas[bid])
        else:
            print(f"AVISO: bolha sem definição: {bid}")
    removidas = sorted(set(antigas) - set(novas_vars) - set(variaveis))

    # ---------- consequências em JSON ----------
    saida_c = {}
    for cid, c in consequencias.items():
        if "_eficacia" in c:
            saida_c[cid] = {"id": cid, "tipo": "consequencia", "versaoEsquema": 1, "origem": c["origem"],
                            "alvo": c["alvo"], "mecanismo": "afim",
                            "parametros": {"coeficiente": 0.002 * c["_eficacia"], "termoConstante": 0},
                            "unidade": "fator", "atrasoPassos": 0, "duracao": {"modo": "continuo"}}
            continue
        alvo = novas_vars[c["_alvo"]]
        estoque = alvo["tipo"] == "estoque"
        dom = alvo["dominio"]
        largura = (dom.get("maximo", 100) - dom.get("minimo", 0)) / 100
        d = (FORCA_ESTOQUE if estoque else FORCA_INDICE)[c["_forca"]] * largura * c["_sinal"]
        unidade = TAXA[alvo["unidade"]] if estoque else alvo["unidade"]
        if c["_limiar"] is not None:
            mec, par = "limiar", {"coeficiente": round(d / (100 - c["_limiar"]), 8), "limiar": c["_limiar"], "direcao": "acima"}
        else:
            mec, par = "afim", {"coeficiente": round(d / c["_amp"], 10), "termoConstante": round(-d * c["_inicio"] / c["_amp"], 8)}
        saida_c[cid] = {"id": cid, "tipo": "consequencia", "versaoEsquema": 1, "origem": c["origem"],
                        "alvo": c["_alvo"], "mecanismo": mec, "parametros": par, "unidade": unidade,
                        "atrasoPassos": c["atrasoPassos"], "duracao": {"modo": "continuo"}}
    saida_c.update(rede)
    # evento antigo continua se o alvo dele continua
    for cid, c in antigas_c.items():
        if c["origem"].startswith("carga_") and c["alvo"] in novas_vars:
            saida_c[cid] = c
            if c["origem"] in antigas:
                novas_vars[c["origem"]] = antigas[c["origem"]]

    # ---------- Brasil ----------
    despesas = estado["fiscal"]["agregados"]["despesas"]
    resto = gasto_brasil
    for alvo_ag in ("programas-nao-modelados", "rede-publica", "maquina-publica"):
        for ag in despesas:
            if ag["id"] == alvo_ag and resto > 0:
                corte = min(ag["valorAnual"], resto)
                ag["valorAnual"] -= corte
                resto -= corte

    print(f"leis: {len(leis_json)} (pendentes: {', '.join(PENDENTES)})")
    print(f"controles: {len(variaveis)} · bolhas: {len(novas_vars)} · consequências: {len(saida_c)} "
          f"(rede antiga mantida: {len(rede)})")
    print(f"variáveis antigas removidas: {', '.join(removidas) or 'nenhuma'}")
    print(f"gasto das leis orçamentárias no Brasil: {gasto_brasil:,.0f}/ano; sem cobertura nos agregados: {resto:,.0f}")
    if not aplicar:
        print("\nEnsaio: nada gravado. Use --aplicar.")
        return

    for p in (MUNDO / "leis").glob("*.json"):
        p.unlink()
    for lid, lei in leis_json.items():
        escrever(MUNDO / "leis" / f"{lid}.json", lei)
    leis_catalogo["politicas"] = [f"mundo/leis/{lid}.json" for lid in leis_json]
    escrever(MUNDO / "catalogo-leis.json", leis_catalogo)
    for p in pasta_c.glob("*.json"):
        p.unlink()
    for cid, c in saida_c.items():
        escrever(pasta_c / f"{cid}.json", c)
    mundo = ler(MUNDO / "mundo.json")
    mundo["consequencias"] = [f"mundo/consequencias/{cid}.json" for cid in sorted(saida_c)]
    escrever(MUNDO / "mundo.json", mundo)
    variaveis_doc["variaveis"] = list(variaveis.values()) + list(novas_vars.values())
    escrever(MUNDO / "indicadores" / "variaveis.json", variaveis_doc)

    estado["leisVigentes"] = vigentes
    estado["limitesProprios"] = [x for x in estado.get("limitesProprios") or [] if x.get("lei") in leis_json]
    politica = estado.get("politica") or {}
    politica["relacoes"] = [r for r in politica.get("relacoes", [])
                            if r["origem"]["tipo"] != "politica" or r["origem"]["id"] in leis_json]
    valores = dict(valores_controle)
    for bid, v in novas_vars.items():
        if v["tipo"] == "estoque":
            valores[bid] = PARTIDA_BRASIL.get(bid, estado["valores"].get(bid, 50))
    estado["valores"] = valores
    escrever(BRASIL, estado)
    print("Gravado.")


if __name__ == "__main__":
    main("--aplicar" in sys.argv)
