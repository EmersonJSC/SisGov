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

Orçamento na rede (SG157, D-47 a D-50): as contas são bolhas em % do PIB.
- lei orçamentária → gasto: elo contábil, recursos ÷ PIB nominal × 100;
- imposto → receita: alíquota × base × fator (produto entre nós, D-50);
- receita − gasto − juros = resultado; o resultado alimenta a dívida
  (déficit soma, superávit abate); juros = taxa × dívida (D-48);
- efeito de lei regulatória sobre gasto ou receita usa FORCA_FISCAL;
- toda conta de lei lê o nível aprovado, sem a eficácia ("leitura": "nivel");
- efeito de ficha sobre juros, ou sobre a conta de lei orçamentária ou de
  imposto, sai (a conta já entra pelos elos acima).
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
MINISTERIO_POR_AREA = {
    "Trabalho e emprego": "Ministério do Trabalho",
    "Tributação": "Ministério da Fazenda",
    "Economia, finanças e comércio exterior": "Ministério do Desenvolvimento",
    "Saúde": "Ministério da Saúde",
    "Educação, ciência e cultura": "Ministério da Educação",
    "Previdência e assistência social": "Ministério da Previdência",
    "Segurança, justiça e drogas": "Ministério da Justiça",
    "Direitos civis, costumes, imigração, mídia e defesa": "Ministério dos Direitos e da Defesa",
    "Instituições, Estado e sistema político": "Casa Civil",
    "Meio ambiente, energia, agro e infraestrutura": "Ministério do Meio Ambiente e Infraestrutura",
}
BASE_TRIBUTO = {"imposto-renda-pessoas": "renda_familias", "imposto-sobre-consumo": "consumo"}

# ---------- orçamento na rede (SG157) ----------
PIB_NOMINAL = "pib_nominal"
FISCAIS = {"arrecadacao", "gasto_publico", "resultado_fiscal", "juros_da_divida"}
# Lei regulatória no máximo: quanto do PIB ela custa ou arrecada (hipótese).
FORCA_FISCAL = {"fraca": 0.1, "media": 0.25, "forte": 0.45}
# Arrecadação de cada ponto de alíquota, em % do PIB, com a base no valor de
# referência (hipótese; calibração do Brasil na fase 3).
# Setor público inteiro (D-53): União, estados e municípios juntos.
ARRECADACAO_POR_PONTO = {
    "imposto-sobre-consumo": 0.53,          # 26,5% → 14% do PIB
    "imposto-renda-pessoas": 0.109,         # 27,5% → 3%
    "imposto-renda-empresas": 0.132,        # 34% → 4,5%
    "tributacao-dividendos": 0.04,          # 10% → 0,4%
    "imposto-heranca": 0.019,               # 8% → 0,15%
    "imposto-grandes-fortunas": 0.3,        # 3,5% → 1%
    "imposto-propriedade-urbana-rural": 2.0,  # 0,5 → 1%
    "imposto-transacoes-financeiras": 1.58,   # 0,38% → 0,6%
    "tarifas-de-importacao": 0.05,          # 12% → 0,6%
}
# Valor da base em que vale a tabela acima: o do Brasil 2026 no turno 0.
BASE_REFERENCIA = {"consumo": 50, "renda_familias": 45, "pib": 45}
# juros = taxa × dívida ÷ 100 × parcela (a dívida não paga toda a taxa básica)
PARCELA_DA_TAXA_BASICA = 0.7


# Custo de cada opção (SG157 fase 2, D-52): docs/fichas/custos.json.
CUSTOS = json.loads((FICHAS / "custos.json").read_text(encoding="utf-8"))["leis"]
LADOS_DO_CUSTO = (("gasto", "gasto_publico", "gasto-publico", "escalaGasto"),
                  ("receita", "arrecadacao", "arrecadacao", "escalaReceita"))


def elos_do_custo(lid: str, var: str, valores_op: dict[str, float]) -> dict[str, dict]:
    """Uma seta por lado (gasto, receita): custo de cada opção, ligado em retas."""
    custo = CUSTOS[lid]
    saida = {}
    for lado, alvo, sufixo, chave_escala in LADOS_DO_CUSTO:
        tabela = custo.get(lado)
        if not tabela:
            continue
        faltam = set(valores_op) ^ set(tabela)
        if faltam:
            raise SystemExit(f"custos.json: {lid}.{lado} não bate com as opções: {sorted(faltam)}")
        pontos = sorted([valores_op[o], v] for o, v in tabela.items())
        cid = f"{lid}--{sufixo}"
        c = {"id": cid, "tipo": "consequencia", "versaoEsquema": 1, "origem": var, "alvo": alvo,
             "mecanismo": "pontos", "parametros": {"pontos": pontos}, "leitura": "nivel"}
        if custo.get(chave_escala):
            c["escala"] = custo[chave_escala]
        c.update({"unidade": "percentual_pib", "atrasoPassos": 0, "duracao": {"modo": "continuo"}})
        saida[cid] = c
    return saida


def elo(cid: str, origem: str, alvo: str, coeficiente: float, unidade: str = "percentual_pib",
        normalizacao: dict | None = None, de_lei: bool = False) -> dict:
    c = {"id": cid, "tipo": "consequencia", "versaoEsquema": 1, "origem": origem, "alvo": alvo,
         "mecanismo": "afim", "parametros": {"coeficiente": coeficiente, "termoConstante": 0}}
    if normalizacao:
        c["normalizacao"] = normalizacao
    if de_lei:
        c["leitura"] = "nivel"  # a conta lê o nível aprovado, sem a eficácia
    c.update({"unidade": unidade, "atrasoPassos": 0, "duracao": {"modo": "continuo"}})
    return c


# Situação "Juros explosivos" (D-48): parte da receita que vai para os juros.
# Surge quando passa de 32% e pisca quando cresce (hipótese, fase 3).
JUROS_EXPLOSIVOS = {
    "id": "juros_explosivos", "tipo": "situacao", "nome": "Juros explosivos",
    "unidade": "percentual_0_100", "dominio": {"minimo": 0, "maximo": 100},
    "area": "Contas públicas", "avaliacao": "maior_pior", "surgimento": 32,
}
# Cofre (D-49, fase 4): o lado positivo da dívida líquida. A dívida pode ficar
# negativa; o cofre é o quanto ela está abaixo de zero. É uma situação boa:
# só aparece quando há dinheiro guardado.
COFRE = {
    "id": "cofre", "tipo": "situacao", "nome": "Cofre do Tesouro",
    "unidade": "percentual_pib", "dominio": {"minimo": 0, "maximo": 100},
    "area": "Contas públicas", "avaliacao": "maior_melhor", "surgimento": 0,
}
VARIAVEIS_FISCAIS = {JUROS_EXPLOSIVOS["id"]: JUROS_EXPLOSIVOS, COFRE["id"]: COFRE}

REDE_FISCAL = [
    elo("arrecadacao--resultado-fiscal", "arrecadacao", "resultado_fiscal", 1),
    elo("gasto-publico--resultado-fiscal", "gasto_publico", "resultado_fiscal", -1),
    elo("juros-da-divida--resultado-fiscal", "juros_da_divida", "resultado_fiscal", -1),
    # resultado anual em % do PIB; o passo é um trimestre
    elo("resultado-fiscal--divida-publica", "resultado_fiscal", "divida_publica", -0.25,
        "percentual_pib_por_passo"),
    elo("taxa-juros--juros-da-divida", "taxa_juros", "juros_da_divida", PARCELA_DA_TAXA_BASICA,
        normalizacao={"fator": "divida_publica", "multiplicador": 0.01}),
    # juros ÷ receita × 100 = % da receita que vai para os juros
    elo("juros-da-divida--juros-explosivos", "juros_da_divida", "juros_explosivos", 1, "percentual_0_100",
        normalizacao={"divisor": "arrecadacao", "multiplicador": 100}),
    # cofre = quanto a dívida líquida está abaixo de zero
    {"id": "divida-publica--cofre", "tipo": "consequencia", "versaoEsquema": 1,
     "origem": "divida_publica", "alvo": "cofre", "mecanismo": "limiar",
     "parametros": {"coeficiente": 1, "limiar": 0, "direcao": "abaixo"},
     "unidade": "percentual_pib", "atrasoPassos": 0, "duracao": {"modo": "continuo"}},
    # a crise alimenta a si mesma: risco sobe, juros sobem, empresas recuam
    elo("juros-explosivos--risco-pais", "juros_explosivos", "risco_pais", 0.8, "indice_0_100"),
    elo("juros-explosivos--taxa-juros", "juros_explosivos", "taxa_juros", 0.1, "percentual_0_100"),
    elo("juros-explosivos--confianca-empresarial", "juros_explosivos", "confianca_empresarial", -0.6,
        "indice_0_100"),
]


# ---------- grupos sociais (SG143) ----------
# Cada grupo é uma bolha de satisfação (0–100). Os ~30 grupos citados nas
# fichas são agrupados em 11 segmentos do eleitorado; cada pessoa conta em um
# só segmento (sem dupla contagem), e a aprovação do governo é a média dos
# segmentos pelo peso de cada um (hipótese do Brasil, soma 1).
GRUPOS = {
    "grupo_pobres": ("Pobres", 0.18, ["grupo_pobres", "grupo_informais"], [
        ("pobreza", -0.5), ("inflacao", -0.6), ("preco_alimentos", -0.2),
        ("inseguranca_alimentar", -0.3)]),
    "grupo_trabalhadores": ("Trabalhadores", 0.18, [
        "grupo_trabalhadores_formais", "grupo_sindicatos", "grupo_motoristas"], [
        ("desemprego", -0.8), ("renda_familias", 0.3), ("inflacao", -0.5)]),
    "grupo_classe_media": ("Classe média", 0.14, ["grupo_classe_media", "grupo_pais_familia"], [
        ("inflacao", -0.4), ("sensacao_seguranca", 0.2), ("saude_populacao", 0.15),
        ("arrecadacao", -0.3), ("taxa_juros", -0.2), ("juros_explosivos", -0.3)]),
    "grupo_jovens": ("Jovens", 0.10, ["grupo_jovens", "grupo_estudantes"], [
        ("oportunidades_juvenis", 0.3), ("desemprego", -0.5), ("liberdade_civil", 0.1)]),
    "grupo_aposentados": ("Aposentados", 0.10, ["grupo_aposentados"], [
        ("inflacao", -0.6), ("saude_populacao", 0.2), ("pressao_hospitalar", -0.15)]),
    "grupo_servidores": ("Servidores públicos", 0.06, [
        "grupo_servidores", "grupo_professores", "grupo_profissionais_saude",
        "grupo_policiais", "grupo_militares"], [
        ("gasto_publico", 0.3), ("capacidade_estatal", 0.1)]),
    "grupo_pequenos_negocios": ("Pequenos negócios", 0.06, ["grupo_pequenos_negocios"], [
        ("taxa_juros", -0.4), ("complexidade_tributaria", -0.15), ("consumo", 0.2),
        ("credito", 0.1), ("juros_explosivos", -0.4)]),
    "grupo_agro": ("Agro", 0.04, ["grupo_agronegocio", "grupo_agricultores_familiares"], [
        ("producao_agropecuaria", 0.2), ("cambio", 0.1), ("conflitos_fundiarios", -0.2)]),
    "grupo_empresarios": ("Empresários", 0.03, [
        "grupo_empresarios", "grupo_industria", "grupo_setor_financeiro", "grupo_ricos"], [
        ("confianca_empresarial", 0.3), ("taxa_juros", -0.4), ("arrecadacao", -0.4),
        ("custo_trabalhista", -0.2), ("juros_explosivos", -0.5)]),
    "grupo_progressistas": ("Progressistas", 0.06, [
        "grupo_progressistas", "grupo_ambientalistas", "grupo_lgbtqia",
        "grupo_minorias_etnicas", "grupo_mulheres", "grupo_imigrantes"], [
        ("desigualdade", -0.3), ("qualidade_ambiental", 0.2), ("discriminacao", -0.2),
        ("liberdade_civil", 0.2), ("letalidade_policial", -0.2)]),
    "grupo_conservadores": ("Conservadores", 0.05, ["grupo_conservadores", "grupo_religiosos"], [
        ("sensacao_seguranca", 0.3), ("uso_drogas", -0.2), ("crime_organizado", -0.15)]),
}
SEGMENTO_DA_FICHA = {ficha: g for g, (_, _, fichas, _) in GRUPOS.items() for ficha in fichas}
POPULARIDADE = "popularidade_governo"
# Uma lei que vai de um extremo ao outro mexe a satisfação de um grupo em
# até 10 pontos (hipótese; calibração com a jogabilidade).
SWING_LEI_GRUPO = 10


def variavel_grupo(gid: str) -> dict:
    nome = GRUPOS[gid][0]
    return {"id": gid, "tipo": "grupo", "nome": nome, "unidade": "indice_0_100",
            "dominio": {"minimo": 0, "maximo": 100}, "area": "Grupos sociais",
            "avaliacao": "maior_melhor"}


def elos_dos_grupos(lei: dict, f: dict, var: str) -> dict[str, dict]:
    """Lei → satisfação de cada segmento que ganha (+) ou perde (−) com ela."""
    saldo: dict[str, int] = {}
    for lado, s in (("ganham", 1), ("perdem", -1)):
        for ficha in (f.get("grupos") or {}).get(lado, []):
            g = SEGMENTO_DA_FICHA.get(ficha)
            if g:
                saldo[g] = saldo.get(g, 0) + s
    faixa = f.get("faixa") or {}
    saida = {}
    for g, n in sorted(saldo.items()):
        if n == 0:
            continue  # o segmento tem quem ganha e quem perde: se anula
        s = 1 if n > 0 else -1
        cid = f"{lei['id']}--{g}".replace("_", "-")
        if lei["grupo"] == "orcamentaria":  # lê o gasto em % do PIB
            coef = s * SWING_LEI_GRUPO / max(faixa.get("maximo", 1), 1e-9)
            saida[cid] = elo(cid, var, g, round(coef, 6), "indice_0_100",
                             normalizacao={"divisor": PIB_NOMINAL, "multiplicador": 100})
        elif lei["grupo"] == "tributaria":
            amplitude = max(faixa.get("maximo", 100) - faixa.get("minimo", 0), 1e-9)
            saida[cid] = elo(cid, var, g, round(s * SWING_LEI_GRUPO / amplitude, 6), "indice_0_100")
        else:
            saida[cid] = elo(cid, var, g, s * SWING_LEI_GRUPO / 100, "indice_0_100")
    return saida


def rede_dos_grupos() -> list[dict]:
    """Indicadores → grupos (o que cada um sente) e grupos → aprovação."""
    saida = []
    for g, (_, peso, _, interesses) in GRUPOS.items():
        for bolha, coef in interesses:
            saida.append(elo(f"{bolha}--{g}".replace("_", "-"), bolha, g, coef, "indice_0_100"))
        saida.append(elo(f"{g}--{POPULARIDADE}".replace("_", "-"), g, POPULARIDADE, peso,
                         "indice_0_100"))
    return saida


def efeitos_da_lei(f: dict, grupo: str) -> list[dict]:
    """Efeitos da ficha sem os que a conta do orçamento já cobre."""
    alvos = {e["alvo"] for e in f["efeitos"]}
    saida = []
    for e in f["efeitos"]:
        a = e["alvo"]
        if a == "juros_da_divida":
            continue  # D-48: juros = taxa × dívida
        if a == POPULARIDADE:
            continue  # SG143: a aprovação é a média dos grupos
        if f["id"] in CUSTOS and a in FISCAIS:
            continue  # custo de cada opção (custos.json)
        if grupo == "orcamentaria" and a in FISCAIS | {"divida_publica"}:
            continue  # elo contábil recursos → gasto
        if grupo == "tributaria" and a in FISCAIS:
            continue  # alíquota × base → receita
        if a == "resultado_fiscal":
            if alvos & {"gasto_publico", "arrecadacao"}:
                continue
            e = {**e, "alvo": "gasto_publico", "sinal": "-" if e["sinal"] == "+" else "+"}
        saida.append(e)
    return saida


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
    sem_ficha = set(CUSTOS) - {l["id"] for _, l in fichas}
    if sem_ficha:
        raise SystemExit(f"custos.json cita leis sem ficha: {sorted(sem_ficha)}")
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
    usadas: set[str] = (set(FISCAIS) | {"divida_publica", "taxa_juros", POPULARIDADE}
                        | set(VARIAVEIS_FISCAIS) | set(GRUPOS)
                        | {b for _, _, _, i in GRUPOS.values() for b, _ in i})
    contabeis: dict[str, dict] = {c["id"]: c for c in REDE_FISCAL + rede_dos_grupos()}
    gasto_brasil = 0.0
    variaveis[PIB_NOMINAL] = {"id": PIB_NOMINAL, "tipo": "controle", "nome": "PIB nominal",
                              "unidade": "moeda", "dominio": {"minimo": 1}, "valorInicial": 1_000_000,
                              "area": "Economia"}

    for area, f in fichas:
        lid, grupo = f["id"], f["grupo"]
        processo = {"institucional": "emenda-constitucional", "orcamentaria": "execucao-programa-autorizado"}.get(grupo, "lei-ordinaria")
        lei = {"id": lid, "tipo": "lei", "versaoEsquema": 2, "grupo": grupo, "nome": f["nome"],
               "descricao": f["descricao"], "area": area, "ministerio": MINISTERIO_POR_AREA.get(area, f.get("ministerio") or "Presidência"),
               "processoAutorizacao": processo}
        opcoes = f.get("opcoes") or []
        faixa = f.get("faixa") or {}
        if grupo in ("regulatoria", "institucional"):
            var = f"nivel_{snake(lid)}"
            n = len(opcoes)
            valores_op = {o["id"]: round(100 * i / (n - 1)) for i, o in enumerate(opcoes)}
            ops = []
            for o in opcoes:
                ops.append({"id": o["id"], "rotulo": o["rotulo"], "valor": valores_op[o["id"]]})
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
        efeitos = efeitos_da_lei(f, grupo)
        for i, e in enumerate(efeitos):
            alvo = e["alvo"]
            usadas.add(alvo)
            cid = f"{lid}--{alvo}".replace("_", "-") + (f"-{i}" if any(x["alvo"] == alvo for x in efeitos[:i]) else "")
            sinal = 1 if e["sinal"] == "+" else -1
            limiar = None
            cond = (e.get("condicao") or "").lower()
            if cond and valores_op:
                achados = [(cond.find(o), o) for o in valores_op if o in cond]
                if achados:
                    limiar = min(valores_op[o] for _, o in achados)
                    if limiar >= 100:
                        # só na última opção: o efeito começa no meio do
                        # caminho desde a penúltima (rampa, não degrau)
                        anterior = max(v for v in valores_op.values() if v < 100)
                        limiar = round((anterior + 100) / 2)
            pontos = None
            if e.get("pontos"):  # valor do efeito em cada opção (unidade do alvo)
                if set(e["pontos"]) != set(valores_op):
                    raise SystemExit(f"{lid}: pontos de {alvo} não batem com as opções")
                pontos = sorted([valores_op[o], v] for o, v in e["pontos"].items())
            consequencias[cid] = {"_alvo": alvo, "_forca": e["forca"], "_sinal": sinal, "_amp": amplitude,
                                  "_inicio": inicio, "_limiar": limiar, "origem": var,
                                  "_pontos": pontos, "_escala": e.get("escala"),
                                  "atrasoPassos": ATRASO.get(e["atraso"], 0)}
            if e.get("escala"):
                usadas.add(e["escala"]["fator"])
            ids_lei.append(cid)
        # elos contábeis do orçamento (SG157)
        if lid in CUSTOS:
            elos = elos_do_custo(lid, var, valores_op)
            contabeis.update(elos)
            ids_lei.extend(elos)
            usadas.update(c["alvo"] for c in elos.values())
            usadas.update(c["escala"]["fator"] for c in elos.values() if "escala" in c)
        elos_g = elos_dos_grupos(lei, f, var)
        contabeis.update(elos_g)
        ids_lei.extend(elos_g)
        if grupo == "orcamentaria":
            cid = f"{lid}--gasto-publico"
            contabeis[cid] = elo(cid, var, "gasto_publico", 1,
                                 normalizacao={"divisor": PIB_NOMINAL, "multiplicador": 100}, de_lei=True)
            ids_lei.append(cid)
            usadas.add("gasto_publico")
        elif grupo == "tributaria":
            base = lei["tributo"]["base"]
            cid = f"{lid}--arrecadacao"
            fator = ARRECADACAO_POR_PONTO.get(lid, 0.05) / BASE_REFERENCIA.get(base, 50)
            contabeis[cid] = elo(cid, var, "arrecadacao", 1,
                                 normalizacao={"fator": base, "multiplicador": round(fator, 8)}, de_lei=True)
            ids_lei.append(cid)
            usadas.update({"arrecadacao", base})
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
        if a == POPULARIDADE and o not in GRUPOS:
            continue  # SG143: só os grupos formam a aprovação
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
        if bid in GRUPOS:
            novas_vars[bid] = variavel_grupo(bid)
        elif bid in VARIAVEIS_FISCAIS:
            novas_vars[bid] = VARIAVEIS_FISCAIS[bid]
        elif bid in antigas and antigas[bid]["tipo"] != "controle":
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
        if c["_alvo"] in FISCAIS:
            d = FORCA_FISCAL[c["_forca"]] * c["_sinal"]
        unidade = TAXA[alvo["unidade"]] if estoque else alvo["unidade"]
        if c.get("_pontos"):
            mec, par = "pontos", {"pontos": c["_pontos"]}
        elif c["_limiar"] is not None:
            mec, par = "limiar", {"coeficiente": round(d / (100 - c["_limiar"]), 8), "limiar": c["_limiar"], "direcao": "acima"}
        else:
            mec, par = "afim", {"coeficiente": round(d / c["_amp"], 10), "termoConstante": round(-d * c["_inicio"] / c["_amp"], 8)}
        saida_c[cid] = {"id": cid, "tipo": "consequencia", "versaoEsquema": 1, "origem": c["origem"],
                        "alvo": c["_alvo"], "mecanismo": mec, "parametros": par,
                        **({"leitura": "nivel"} if c["_alvo"] in FISCAIS else {}),
                        **({"escala": c["_escala"]} if c.get("_escala") else {}),
                        "unidade": unidade, "atrasoPassos": c["atrasoPassos"], "duracao": {"modo": "continuo"}}
    saida_c.update(rede)
    saida_c.update(contabeis)
    # evento antigo continua se o alvo dele continua
    for cid, c in antigas_c.items():
        if c["origem"].startswith("carga_") and c["alvo"] in novas_vars:
            saida_c[cid] = c
            if c["origem"] in antigas:
                novas_vars[c["origem"]] = antigas[c["origem"]]

    # ---------- Brasil ----------
    valores_controle[PIB_NOMINAL] = estado["economia"]["pibAnual"]

    print(f"leis: {len(leis_json)} (pendentes: {', '.join(PENDENTES)})")
    print(f"controles: {len(variaveis)} · bolhas: {len(novas_vars)} · consequências: {len(saida_c)} "
          f"(rede antiga mantida: {len(rede)})")
    print(f"variáveis antigas removidas: {', '.join(removidas) or 'nenhuma'}")
    print(f"gasto das leis orçamentárias no Brasil: {gasto_brasil:,.0f}/ano "
          f"({100 * gasto_brasil / estado['economia']['pibAnual']:.1f}% do PIB)")
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
    # a receita divide os juros (situação de juros explosivos): nunca zero
    # SG159: as contas não têm teto nem amortecimento próprio. Domínio aberto
    # (nada some), resposta 1 (somas andam junto com as partes) e uma faixa
    # só para desenhar a bolha.
    CONTAS = {
        "arrecadacao": ({"minimo": 0.1}, {"minimo": 0, "maximo": 60}),
        "gasto_publico": ({"minimo": 0}, {"minimo": 0, "maximo": 60}),
        "juros_da_divida": ({}, {"minimo": -10, "maximo": 20}),
        "resultado_fiscal": ({}, {"minimo": -20, "maximo": 20}),
        # dívida líquida: abaixo de zero é cofre
        "divida_publica": ({}, {"minimo": -50, "maximo": 250}),
        "cofre": ({"minimo": 0}, {"minimo": 0, "maximo": 50}),
    }
    # SG143: a popularidade é a aprovação do governo (média dos grupos)
    novas_vars[POPULARIDADE]["nome"] = "Aprovação do governo"
    novas_vars[POPULARIDADE]["area"] = "Grupos sociais"
    for bid, (dominio, faixa) in CONTAS.items():
        novas_vars[bid]["dominio"] = dominio
        novas_vars[bid]["faixaVisual"] = faixa
        if novas_vars[bid]["tipo"] != "estoque":
            novas_vars[bid]["resposta"] = 1
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
