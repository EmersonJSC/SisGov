#!/usr/bin/env python3
"""Gera os JSONs das leis (esquema v2, camadas) a partir das fichas em markdown.

Fonte: docs/v1/desenho/leis/leis-01.md a leis-11.md (V1-34). As fichas são a
fonte; este script só lê.

EXCEÇÃO À R-11: o gerador antigo (gerar.py) nunca sobrescreve. Este, por
pedido do autor, gera as leis DO ZERO a cada rodada: apaga a pasta de saída
inteira antes de escrever. As leis antigas não são tocadas aqui; quem as move
(mv, nunca rm) é a troca de pasta, feita à parte.

Uso:
  python3 scripts/camadas/gerar_leis.py [--area N ...] [--saida PASTA]

Saída (por padrão scripts/camadas/saida/):
  leis/<id>.json        uma lei por arquivo
  lados.json            lado de cada opção na bússola ([economia, costumes],
                        −2 a +2: a ficha vai de −1 a +1, multiplica por 2)
  relatorio.md          o que entrou, o que ficou de fora

Fica de fora, por ser texto na ficha: efeitos em números (vão como texto em
`efeitos`), trava por opção (a mãe vai como texto e lista de leis em `mae`),
custos que não são "% do PIB" (vão em `custoTexto`), consequências no grafo.
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import unicodedata
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
FICHAS = RAIZ / "docs" / "v1" / "desenho" / "leis"
SAIDA = Path(__file__).resolve().parent / "saida"

PROCESSO = {
    "constituicao": "emenda-constitucional",
    "lei": "lei-ordinaria",
    "alavanca": "decreto",
}
NIVEL_LEGAL = {"constituicao": "constitucional", "lei": "derivada", "alavanca": "derivada"}
CAMADA = {"constituição": "constituicao", "lei": "lei", "alavanca": "alavanca"}
SINAIS = str.maketrans({"−": "-", "–": "-", "—": "-"})


def slug(texto: str) -> str:
    base = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode()
    base = re.sub(r"\([^)]*\)", "", base)
    return re.sub(r"[^a-z0-9]+", "-", base.lower()).strip("-")[:60]


def numero(texto: str) -> float:
    return float(texto.translate(SINAIS).replace(",", ".").replace(" ", ""))


def turnos(texto: str) -> dict:
    t = texto.lower()
    if "seguinte" in t:
        return {"minimo": 1, "maximo": 1}
    m = re.match(r"\s*(\d+)\s*a\s*(\d+)", t)
    if m:
        return {"minimo": int(m[1]), "maximo": int(m[2])}
    m = re.match(r"\s*(\d+)", t)
    n = int(m[1]) if m else 1
    return {"minimo": n, "maximo": n}


def lado(texto: str):
    m = re.search(r"([−+-]?\d+(?:,\d+)?)\s*/\s*([−+-]?\d+(?:,\d+)?)", texto)
    if not m:
        return None
    return [round(numero(m[1]) * 2, 2), round(numero(m[2]) * 2, 2)]


def grupos(texto: str) -> list[str]:
    texto = re.sub(r"\([^)]*\)", "", texto).strip()
    if texto in ("", "—", "-"):
        return []
    return [g.strip() for g in texto.split(",") if g.strip()]


def custo(texto: str):
    """(percentual do PIB ou None, texto ou None)."""
    t = texto.strip()
    if t in ("", "—", "-", "0", "~0", "0 (aprox.)", "igual", "base", "referência"):
        return None, None
    m = re.fullmatch(r"~?(\d+(?:,\d+)?)% do PIB", t)
    if m:
        return numero(m[1]), None
    return None, t


def faixa_linha(texto: str):
    """'faixa de valor: 2% a 6% ao ano (...)' → (min, max, unidade) ou None."""
    m = re.search(
        r"faixa de valor:\s*(?:de\s*)?(-?[\d.,]+)\s*([^\d\s]*)\s*a\s*(-?[\d.,]+)\s*([^(;.]*)",
        texto.translate(SINAIS),
    )
    if not m:
        return None
    try:
        lo = numero(m[1].replace(".", ""))
        hi = numero(m[3].replace(".", ""))
    except ValueError:
        return None
    unidade = (m[2] + " " + m[4]).strip() or "valor"
    return lo, hi, unidade


def valor_do_rotulo(rotulo: str):
    m = re.search(r"(-?\d+(?:[.,]\d+)?)", rotulo.translate(SINAIS))
    return numero(m[1]) if m else None


def ler_fichas(areas: list[int]):
    leis = []
    for n in areas:
        caminho = FICHAS / f"leis-{n:02d}.md"
        area = None
        mesa = None
        atual = None
        for linha in caminho.read_text(encoding="utf-8").splitlines():
            if linha.startswith("## "):
                area = linha[3:].strip()
            elif linha.startswith("### "):
                mesa = linha[4:].strip()
            elif linha.startswith("#### "):
                atual = {"nome": linha[5:].strip(), "area": area, "mesa": mesa,
                         "opcoes": [], "ficha": caminho.name}
                leis.append(atual)
            elif atual is None:
                continue
            elif linha.startswith("**Decisão:**"):
                atual["decisao"] = linha.split(":**", 1)[1].strip()
            elif linha.startswith("**Camada:**"):
                camada = re.match(r"\*\*Camada:\*\*\s*([^·]+)", linha)[1].strip()
                atual["camada"] = CAMADA[re.split(r"[ (]", camada.lower())[0]]
                atual["camadaNota"] = camada
                impl = re.search(r"Implantação:\*\*\s*([^·]+)", linha)
                atual["implantacao"] = impl[1].strip() if impl else ""
            elif linha.startswith("**Mãe:**"):
                atual["mae"] = linha.split(":**", 1)[1].strip()
            elif linha.startswith("**Controle:**"):
                atual["controle"] = linha.split(":**", 1)[1].strip()
            elif linha.startswith("**Leis relacionadas:**"):
                atual["relacionadas"] = linha.split(":**", 1)[1].strip()
            elif linha.startswith("|") and not linha.startswith("| Opção") and not linha.startswith("| ---"):
                col = [c.strip() for c in linha.strip().strip("|").split("|")]
                if len(col) >= 6:
                    atual["opcoes"].append(col[:6])
    return leis


def neutro(x):
    """O mundo é neutro (SG153): sem país nem moeda concreta nos textos."""
    if isinstance(x, str):
        x = re.sub(r"\(hoje no Brasil\)", "(referência)", x)
        x = x.replace("Referência hoje", "Referência").replace("hoje no Brasil", "hoje na referência")
        x = re.sub(r"\bno Brasil\b", "no país de referência", x)
        x = re.sub(r"(?i)brasileir[oa]s?", "do país de referência", x)
        x = re.sub(r"(?i)\bBrasil\b", "o país de referência", x)
        x = x.replace("R$", "").replace("US$", "").replace("Selic", "taxa básica")
        x = re.sub(r"\bSUS\b", "sistema público de saúde", x).replace("gov.br", "portal do governo")
        return x
    if isinstance(x, list):
        return [neutro(i) for i in x]
    if isinstance(x, dict):
        return {k: neutro(v) for k, v in x.items()}
    return x


def montar(lei: dict, ids_por_nome: dict[str, str], avisos: list[str]):
    id_lei = ids_por_nome[lei["nome"]]
    camada = lei["camada"]
    controle_txt = lei.get("controle", "")
    opcoes_txt = lei["opcoes"]
    if not opcoes_txt:
        avisos.append(f"{id_lei}: sem tabela de opções (controle: {controle_txt[:60]})")
        return None, {}
    faixa = faixa_linha(controle_txt) if controle_txt.startswith("faixa") else None
    brasil = None
    brasil_op: list = []
    opcoes, lados = [], {}
    usados = set()
    for i, (rotulo, ld, apoia, rejeita, c, efeitos) in enumerate(opcoes_txt):
        no_brasil = "hoje no brasil" in rotulo.lower() or rotulo.lower().startswith("brasil hoje")
        limpo = re.sub(r"\s*\(hoje no Brasil\)", "", rotulo)
        limpo = re.sub(r"^Referência hoje:\s*", "Referência: ", limpo)  # o mundo é neutro (SG153)
        id_op = slug(limpo) or f"opcao-{i + 1}"
        while id_op in usados:
            id_op += "-b"
        usados.add(id_op)
        n = len(opcoes_txt)
        if faixa:
            lo, hi, _ = faixa
            v = valor_do_rotulo(limpo)
            valor = round(100 * (v - lo) / (hi - lo), 2) if v is not None and hi > lo else round(100 * i / max(n - 1, 1), 2)
            if no_brasil and v is not None:
                brasil = v
        else:
            valor = round(100 * i / max(n - 1, 1), 2)
        pib, txt = custo(c)
        if id_lei == "tarifas-de-importacao" and faixa and valor_do_rotulo(limpo) is not None:
            valor = valor_do_rotulo(limpo)  # alíquota real (% de tarifa), como a lei antiga
        op = {"id": id_op, "rotulo": limpo, "valor": max(0, min(100, valor))}
        if pib is not None:
            op["custoAnualPercentualPib"] = pib
        if txt:
            op["custoTexto"] = txt
        if grupos(apoia):
            op["apoiam"] = grupos(apoia)
        if grupos(rejeita):
            op["rejeitam"] = grupos(rejeita)
        if efeitos and efeitos != "—":
            op["efeitos"] = efeitos
        opcoes.append(op)
        if no_brasil:
            brasil_op.append(id_op)
        v2 = lado(ld)
        if v2 is None:
            avisos.append(f"{id_lei}/{id_op}: lado sem número ('{ld}'); assumi 0/0 (hipótese)")
            lados[id_op] = [0, 0]
        else:
            lados[id_op] = v2
    ctrl = {"variavel": "nivel_" + id_lei.replace("-", "_"),
            "unidade": "nivel_escopo", "opcoes": opcoes}
    if faixa:
        lo, hi, unidade = faixa
        ctrl["faixa"] = {"minimo": lo, "maximo": hi, "unidade": unidade}
        if brasil is not None and lo <= brasil <= hi:
            ctrl["faixa"]["valorReferencia"] = brasil
        else:
            avisos.append(f"{id_lei}: faixa sem valor do Brasil identificado")
    elif controle_txt.startswith("fatias"):
        avisos.append(f"{id_lei}: controle em fatias (minijogo), não vira opções simples")
    if id_lei == "tarifas-de-importacao":
        ctrl["variavel"] = "aliquota_tarifas_de_importacao"
        ctrl["unidade"] = "percentual_0_100"
    json_lei = {
        "id": id_lei, "tipo": "lei", "versaoEsquema": 2,
        "grupo": "regulatoria", "nome": lei["nome"],
        "descricao": lei.get("decisao", lei["nome"]),
        "area": lei["area"],
        "mesa": {"id": slug(lei["mesa"]), "nome": lei["mesa"], "camada": camada},
        "processoAutorizacao": PROCESSO[camada],
        "nivelLegal": NIVEL_LEGAL[camada],
        "implantacaoTurnos": turnos(lei["implantacao"]),
        "controle": ctrl,
        "consequencias": [],
    }
    if id_lei == "tarifas-de-importacao":
        json_lei["grupo"] = "tributaria"
        json_lei["tributo"] = {"base": "pib", "limites": {"minimo": 0, "maximo": 40}}
    if "lei complementar" in lei["implantacao"].lower():
        json_lei["processoAutorizacao"] = "lei-complementar"
    mae = lei.get("mae", "")
    if mae and not mae.lower().startswith("nenhuma"):
        citadas = [ids_por_nome[n] for n in ids_por_nome
                   if n != lei["nome"] and len(n) > 3 and n.lower() in mae.lower()]
        json_lei["mae"] = {"texto": mae, "leis": citadas}
    json_lei["_opcaoBrasil"] = brasil_op[0] if brasil_op else None
    return json_lei, lados


# ---------------------------------------------------------------------------
# Efeitos em texto -> consequencias (V1-34)
# ---------------------------------------------------------------------------
# Escala (tirada das consequências lei -> índice que já existem, em
# src/conteudo/mundo/consequencias: coeficiente absoluto p10-p25 = 0,03,
# mediana = 0,07, p90 = 0,12 por ponto de nível 0..100, ou seja, quanto o
# índice anda, em fração do domínio, da primeira à última opção):
#   leve/pouco/fraco = 0,03 · sem qualificador = 0,07 · forte = 0,12
# Cada opção ganha o efeito com sinal; a inclinação (mínimos quadrados sobre o
# valor 0..100 das opções, opção que não cita o índice = 0) vira o coeficiente.
# Atraso em passos (1 passo = 1 mês): "em A a B anos" = média × 12; "com
# atraso"/"devagar" = 4 (o mais comum nas leis antigas); "curto prazo" = 1;
# sem menção = 1. "(tamanho: lacuna)" não vira número: vai para o relatório.
TAMANHO = {"leve": 0.03, "pouco": 0.03, "fraco": 0.03, "forte": 0.12}
TAMANHO_PADRAO = 0.07
# Contas do orçamento: a partida as calcula de receita, gasto e juros; efeito
# hipotético de lei aqui desmonta o estoque (ex.: cofre). Vão para o relatório.
CONTAS_PUBLICAS = {"cofre", "divida_publica", "juros_da_divida", "resultado_fiscal", "arrecadacao", "gasto_publico"}
ATRASO_PADRAO = 1
# Calibração (Economia, V1-34): as leis antigas nunca passam de 4 passos de atraso;
# atrasos de anos faziam a partida "sem ação" derivar do estado declarado.
ATRASO_MAXIMO = 4

# nome na ficha (minúsculo) -> id do índice existente. Só pares seguros.
ALIAS = {
    "investimento estrangeiro": "ied", "investimento estrangeiro direto": "ied",
    "inflação": "inflacao", "produtividade": "produtividade",
    "importações": "importacoes", "exportações": "exportacoes",
    "expectativas": "expectativas_inflacao",
    "expectativas de inflação": "expectativas_inflacao",
    "pib": "pib", "câmbio": "cambio", "investimento": "investimento",
    "investimento privado": "investimento", "investimento público": "investimento",
    "risco-país": "risco_pais", "inovação": "inovacao", "juros": "taxa_juros",
    "crédito": "credito", "crédito livre": "credito",
    "reservas": "reservas_internacionais", "fuga de capitais": "fuga_capitais",
    "dívida": "divida_publica", "concentração": "concentracao_mercado",
    "concentração de mercado": "concentracao_mercado",
    "confiança": "confianca_empresarial",
    "confiança empresarial": "confianca_empresarial",
    "informalidade": "informalidade", "emissões": "emissoes",
    "cofre": "cofre", "juros da dívida": "juros_da_divida",
    "consumo": "consumo", "endividamento das famílias": "endividamento_familias",
    # Equivalentes claros pedidos pelo autor (sinal invertido quando preciso).
    "emprego": ("desemprego", -1), "emprego formal": ("informalidade", -1),
    "liberdade civil": "liberdade_civil", "liberdades": "liberdade_civil",
    "popularidade": "popularidade_governo", "aprovação do governo": "popularidade_governo",
    "margem de manobra": "margem_manobra_governo",
    "margem de manobra futura": "margem_manobra_governo",
    "trabalho de quem cuida": "participacao_trabalho_cuidadoras",
    "participação de quem cuida": "participacao_trabalho_cuidadoras",
    "concentração de terra": "concentracao_fundiaria",
    "concentração de terras": "concentracao_fundiaria",
    "crimes contra o patrimônio": "crimes_patrimoniais",
    "crédito para habitação": "credito", "poupança": "poupanca_domestica",
    "confiança declarada": "confianca_instituicoes",
    "capacidade de investigação": "capacidade_inteligencia",
    "produção mineral": "producao_mineral",
}


def resolver_alias(nome: str, indices: dict):
    """(id do índice, sinal) pelo ALIAS ou pelo nome exato do índice; senão None."""
    nome = nome.strip().lower()
    alvo = ALIAS.get(nome)
    if alvo is None:
        for i, x in indices.items():
            if x["nome"].lower() == nome:
                return i, 1
        return None
    return alvo if isinstance(alvo, tuple) else (alvo, 1)


def carregar_indices() -> dict:
    v = json.loads((RAIZ / "src/conteudo/mundo/indicadores/variaveis.json").read_text(encoding="utf-8"))
    return {x["id"]: x for x in v["variaveis"] if x["tipo"] in ("calculado", "estoque")}


FRAG = re.compile(r"([^;,()]+?)\s*([↑↓]+)([^;,()]*)(\([^)]*\))?")


def atraso(texto: str) -> int:
    t = texto.lower()
    m = re.search(r"(\d+)\s*a\s*(\d+)\s*anos", t)
    if m:
        return round((int(m[1]) + int(m[2])) / 2 * 12)
    m = re.search(r"(\d+)\s*anos?", t)
    if m:
        return int(m[1]) * 12
    if "atraso" in t or "devagar" in t:
        return 4
    return ATRASO_PADRAO


def efeitos_da_lei(id_lei: str, json_lei: dict, indices: dict, relatorio: list, contagem: dict, csv: dict | None = None, fontes: dict | None = None):
    """Devolve a lista de consequências da lei e anota o que não deu."""
    opcoes = json_lei["controle"]["opcoes"]
    por_alvo: dict[str, list[float]] = {}
    atrasos: dict[str, int] = {}
    for k, op in enumerate(opcoes):
        texto = op.get("efeitos", "")
        achou = False
        for m in FRAG.finditer(texto):
            achou = True
            contagem["total"] += 1
            nome = m[1].strip().lower()
            qual = (m[3] or "") + " " + (m[4] or "")
            ref = f"{id_lei} / {op['rotulo']}: «{m[0].strip()}»"
            achado = resolver_alias(nome, indices)
            alvo = achado[0] if achado else None
            inverte = achado[1] if achado else 1
            if alvo in CONTAS_PUBLICAS:
                contagem["sem_indice"] += 1
                relatorio.append(f"- conta pública (vem do orçamento, não de efeito): {ref} → {alvo}")
                continue
            if alvo is None or alvo not in indices:
                contagem["sem_indice"] += 1
                relatorio.append(f"- sem índice: {ref}")
                continue
            if "lacuna" in qual.lower():
                # Tamanho em lacuna: usa o padrão como hipótese e avisa.
                contagem["lacuna_hipotese"] = contagem.get("lacuna_hipotese", 0) + 1
                relatorio.append(f"- tamanho em lacuna, entrou como hipótese média: {ref} → {alvo}")
                qual = ""
            mag = next((v for k2, v in TAMANHO.items() if k2 in qual.lower()), TAMANHO_PADRAO)
            if len(m[2]) > 1:
                mag = max(mag, 0.12)
            sinal = (1 if m[2][0] == "↑" else -1) * inverte
            por_alvo.setdefault(alvo, [0.0] * len(opcoes))[k] += sinal * mag
            atrasos[alvo] = min(ATRASO_MAXIMO, max(atrasos.get(alvo, 0), atraso(qual)))
            contagem["numero"] += 1
        if not achou and texto:
            contagem["sem_seta"] += 1
            relatorio.append(f"- sem seta (texto só qualitativo): {id_lei} / {op['rotulo']}: {texto[:110]}")
    # Números medidos (CSV) mandam sobre a hipótese da mesma lei/opção/índice.
    csv = csv or {}
    estudo_alvo: dict[str, int] = {}
    for k, op in enumerate(opcoes):
        for alvo in indices:
            linha = csv.get((id_lei, op["id"], alvo))
            if linha is None:
                continue
            dom = indices[alvo]["dominio"]
            amplitude = dom.get("maximo", 100) - dom.get("minimo", 0)
            y = pontos_da_medida(indices[alvo], linha["real"]) / amplitude
            ys = por_alvo.setdefault(alvo, [0.0] * len(opcoes))
            if ys[k] != 0:
                contagem["numero"] -= 1  # a hipótese desta opção cai
            ys[k] = y
            contagem["estudo"] += 1
            estudo_alvo[alvo] = estudo_alvo.get(alvo, 0) + 1
            if linha["atraso"] is not None:
                atrasos[alvo] = linha["atraso"]
            else:
                atrasos.setdefault(alvo, ATRASO_PADRAO)
    saida = []
    valores = [op["valor"] for op in opcoes]
    media_v = sum(valores) / len(valores)
    var = sum((v - media_v) ** 2 for v in valores)
    for alvo, ys in por_alvo.items():
        if var == 0:
            continue
        media_y = sum(ys) / len(ys)
        inclinacao = sum((v - media_v) * (y - media_y) for v, y in zip(valores, ys)) / var
        dom = indices[alvo]["dominio"]
        amplitude = (dom.get("maximo", 100) - dom.get("minimo", 0))
        coef = round(inclinacao * amplitude, 5)
        if coef == 0:
            relatorio.append(f"- inclinação zero (efeitos se anulam entre opções): {id_lei} → {alvo}")
            continue
        saida.append({
            "id": f"{id_lei}--{alvo.replace('_', '-')}"[:120], "tipo": "consequencia",
            "versaoEsquema": 1, "origem": json_lei["controle"]["variavel"],
            "alvo": alvo, "mecanismo": "afim",
            "parametros": {"coeficiente": coef, "termoConstante": 0},
            "unidade": indices[alvo]["unidade"] + ("_por_passo" if indices[alvo]["tipo"] == "estoque" else ""), "atrasoPassos": atrasos[alvo],
            "duracao": {"modo": "continuo"},
        })
        if fontes is not None:
            fontes[saida[-1]["id"]] = "estudo" if estudo_alvo.get(alvo) else "hipotese"
    return saida


# ---------------------------------------------------------------------------
# Efeitos medidos (efeitos-NN.csv) -> marcados "estudo"
# ---------------------------------------------------------------------------
# Colunas (separador ";"): lei;opcao;indice;sinal;tamanho;unidade;atraso_meses;
# fonte;trecho. `lei` e `opcao` podem ser o nome ou o id; `indice` é o id do
# índice (ou um nome do ALIAS); `sinal` aceita +, -, ↑, ↓, sobe, cai;
# `tamanho` é quanto o índice anda por causa desta opção, na UNIDADE REAL do
# índice (a de `medida.unidade` em variaveis.json, ex.: pontos percentuais da
# Selic). A conversão para a escala 0 a 100 usa a reta da `medida`:
#   pontos = 100 × real ÷ (cem − zero)   (zero = 0 e cem = 100 se não houver)
# O mesmo vale para o delta, que só depende da inclinação da reta.
# Sem tamanho numérico, a linha não vale e o efeito segue como hipótese.
# Sem nenhum efeitos-NN.csv, tudo segue como hipótese.
def carregar_efeitos_csv(areas: list[int], aviso: list) -> dict:
    import csv
    tabela: dict = {}
    for n in areas:
        caminho = FICHAS / f"efeitos-{n:02d}.csv"
        if not caminho.exists():
            continue
        with caminho.open(encoding="utf-8-sig", newline="") as f:
            for linha in csv.DictReader(f, delimiter=";"):
                try:
                    tam = abs(numero(linha["tamanho"]))
                except (ValueError, KeyError, AttributeError):
                    aviso.append(f"{caminho.name}: linha sem tamanho numérico ({linha.get('lei')} / {linha.get('opcao')} / {linha.get('indice')})")
                    continue
                sinal = (linha.get("sinal") or "").strip().lower()
                if sinal in ("+", "↑", "sobe", "aumenta", "alta"):
                    sg = 1
                elif sinal in ("-", "−", "↓", "cai", "reduz", "baixa", "queda"):
                    sg = -1
                else:
                    aviso.append(f"{caminho.name}: sinal ilegível '{sinal}' ({linha.get('lei')} / {linha.get('indice')})")
                    continue
                meses = (linha.get("atraso_meses") or "").strip()
                chave = (slug(linha["lei"]), slug(linha["opcao"]), slug(linha["indice"]).replace("-", "_"))
                tabela[chave] = {
                    "real": sg * tam, "unidade": linha.get("unidade", ""),
                    "atraso": int(numero(meses)) if meses else None,
                    "fonte": linha.get("fonte", ""), "arquivo": caminho.name,
                }
    return tabela


def pontos_da_medida(indice: dict, delta_real: float) -> float:
    medida = indice.get("medida", {})
    zero, cem = medida.get("zero", 0), medida.get("cem", 100)
    return 100 * delta_real / (cem - zero)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--area", type=int, nargs="*", default=list(range(1, 12)))
    ap.add_argument("--saida", type=Path, default=SAIDA)
    args = ap.parse_args()

    # Os nomes citados na "Mãe" podem ser de qualquer área: lê todas.
    todas = ler_fichas(list(range(1, 12)))
    ids, vistos = {}, {}
    for lei in todas:
        base = slug(lei["nome"])
        if base in vistos:
            base = f"{base}-{slug(lei['mesa'])}"
        vistos[base] = lei["nome"]
        ids[lei["nome"]] = base
    escolhidas = [l for l in todas if int(l["ficha"][5:7]) in args.area]

    if args.saida.exists():
        shutil.rmtree(args.saida)  # exceção R-11: do zero a cada rodada
    (args.saida / "leis").mkdir(parents=True)
    avisos, lados_todos, geradas = [], {}, 0
    indices = carregar_indices()
    brasil_hoje: dict = {}
    csv = carregar_efeitos_csv(args.area, avisos)
    fontes_por_id: dict = {}
    rel_ef, contagem = [], {"estudo": 0, "total": 0, "numero": 0, "sem_indice": 0, "sem_tamanho": 0, "lacuna_hipotese": 0, "sem_seta": 0}
    (args.saida / "consequencias").mkdir()
    for lei in escolhidas:
        j, lados = montar(lei, ids, avisos)
        if j is None:
            continue
        brasil_hoje[j["id"]] = j.pop("_opcaoBrasil", None)
        cons = efeitos_da_lei(j["id"], j, indices, rel_ef, contagem, csv, fontes_por_id)
        j["consequencias"] = [c["id"] for c in cons]
        for c in cons:
            (args.saida / "consequencias" / f"{c['id']}.json").write_text(
                json.dumps(c, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        j = neutro(j)
        (args.saida / "leis" / f"{j['id']}.json").write_text(
            json.dumps(j, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        lados_todos[j["id"]] = {"opcoes": lados, "fonte": lei["ficha"]}
        geradas += 1
    (args.saida / "brasil.json").write_text(
        json.dumps({k: v for k, v in brasil_hoje.items() if v}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (args.saida / "lados.json").write_text(
        json.dumps({"tipo": "lados-das-opcoes", "escala": "−2 a +2 (ficha ×2)",
                    "leis": lados_todos}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    rel = [f"# Relatório da geração\n\nLeis nas fichas lidas: {len(escolhidas)}; geradas: {geradas}.\n",
           f"\n## Avisos ({len(avisos)})\n"] + [f"- {a}\n" for a in avisos]
    rel += [f"\n## Efeitos em número\n\nEscala: leve 0,03 · médio 0,07 · forte 0,12 (fração do domínio, da primeira à última opção). Atraso padrão 1 passo.\n\nFragmentos com seta: {contagem['total']}; viraram número: {contagem['numero']}; sem índice: {contagem['sem_indice']}; tamanho em lacuna: {contagem['sem_tamanho']}; opções só com texto sem seta: {contagem['sem_seta']}.\n\n"]
    rel += [r + "\n" for r in rel_ef]
    fontes = {"escala": "hipotese = direção da ficha × tamanho da escala das leis atuais; "
              "estudo = número de efeitos-NN.csv (docs/v1/desenho/leis), convertido pela reta da medida; "
              "revisar = sem índice, tamanho em lacuna ou só texto: sem número gerado",
              "contagem": {"estudo": contagem["estudo"], "hipotese": contagem["numero"],
                           "revisar": contagem["sem_indice"] + contagem["sem_seta"]},
              "consequencias": fontes_por_id}
    (args.saida / "fontes.json").write_text(json.dumps(fontes, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (args.saida / "relatorio.md").write_text("".join(rel), encoding="utf-8")
    print(contagem)
    print(f"{geradas} leis geradas de {len(escolhidas)}; {len(avisos)} avisos → {args.saida}")


if __name__ == "__main__":
    main()
