#!/usr/bin/env python3
"""Gerador único da rede do SisGov, separado por camadas (regra R-11).

Os JSONs em src/conteudo são a única fonte de verdade. Este gerador só
ACRESCENTA o que ainda não existe: nunca sobrescreve uma bolha, uma lei ou
um valor que já esteja nos JSONs. Depois de gerado, quem manda é o JSON.

Uso:
  python3 scripts/camadas/gerar.py listar [--camada N]
  python3 scripts/camadas/gerar.py gerar --camada N [--pais brasil] [--aplicar]
  python3 scripts/camadas/gerar.py documento --camada N

Sem --aplicar, "gerar" só mostra o que faria (ensaio).
As ligações (consequências) NÃO estão aqui ainda: serão aprovadas à parte.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
CONTEUDO = RAIZ / "src" / "conteudo"
MUNDO = CONTEUDO / "mundo"
VARIAVEIS = MUNDO / "indicadores" / "variaveis.json"
CATALOGO = MUNDO / "catalogo-leis.json"
PASTA_LEIS = MUNDO / "leis"
PAISES = CONTEUDO / "paises"
DOCS = RAIZ / "docs" / "conteudo"


# ---------------------------------------------------------------------------
# Construtores
# ---------------------------------------------------------------------------

def indice(id, nome, unidade, minimo, maximo, area, avaliacao, explicacao):
    return {
        "json": {
            "id": id, "tipo": "calculado", "nome": nome, "unidade": unidade,
            "dominio": {"minimo": minimo, "maximo": maximo},
            "area": area, "avaliacao": avaliacao,
        },
        "explicacao": explicacao,
    }


def lenta(id, nome, unidade, minimo, maximo, area, avaliacao, explicacao):
    item = indice(id, nome, unidade, minimo, maximo, area, avaliacao, explicacao)
    item["json"]["tipo"] = "estoque"
    return item


def situacao(id, nome, area, surgimento, explicacao):
    item = indice(id, nome, "percentual_0_100", 0, 100, area, "maior_pior", explicacao)
    item["json"]["tipo"] = "situacao"
    item["json"]["surgimento"] = surgimento
    return item


def existente(id, explicacao):
    """Bolha que já está nos JSONs: entra no documento, nunca é recriada."""
    return {"existente": id, "explicacao": explicacao}


def lei_institucional(id, nome, descricao, area, ministerio, processo, opcoes, explicacao):
    variavel = "nivel_" + id.replace("-", "_")
    return {
        "id": id,
        "variavel": variavel,
        "opcoes": [{"id": o, "rotulo": r, "valor": v} for o, r, v in opcoes],
        "explicacao": explicacao,
        "json": {
            "id": id, "tipo": "lei", "versaoEsquema": 2, "grupo": "institucional",
            "nome": nome, "descricao": descricao, "area": area,
            "ministerio": ministerio, "processoAutorizacao": processo,
            "controle": {
                "variavel": variavel, "unidade": "nivel_escopo",
                "opcoes": [{"id": o, "rotulo": r, "valor": v} for o, r, v in opcoes],
            },
            "consequencias": [],
        },
        "variavelJson": {
            "id": variavel, "tipo": "controle", "nome": nome,
            "unidade": "nivel_escopo", "dominio": {"minimo": 0, "maximo": 100},
            "valorInicial": opcoes[0][2], "area": area,
        },
    }


# ---------------------------------------------------------------------------
# CAMADAS — aprovadas pelo autor
# ---------------------------------------------------------------------------

CAMADAS = {
    1: {
        "titulo": "Os pilares do país",
        "pilares": [
            {
                "nome": "Economia",
                "bolhas": [
                    existente("pib", "Tamanho e força da economia. Já existe."),
                    existente("desemprego", "Parte da força de trabalho sem emprego. Já existe."),
                    existente("renda_familias", "Quanto as famílias ganham. Já existe."),
                    indice("inflacao", "Inflação", "percentual_0_100", 0, 100,
                           "Economia", "maior_pior",
                           "Ritmo de alta dos preços. Corrói a renda e pressiona os juros."),
                ],
                "leis": [],
                "depois": "Consumo, investimento e produtividade descem para a camada 2.",
            },
            {
                "nome": "Contas públicas",
                "bolhas": [
                    indice("arrecadacao", "Arrecadação", "percentual_pib", 0, 100,
                           "Contas públicas", "maior_melhor",
                           "Quanto o Estado recolhe, em % do PIB."),
                    indice("gasto_publico", "Gasto público", "percentual_pib", 0, 100,
                           "Contas públicas", "neutra",
                           "Quanto o Estado gasta, em % do PIB."),
                    indice("resultado_fiscal", "Resultado fiscal", "percentual_pib", -30, 30,
                           "Contas públicas", "maior_melhor",
                           "Arrecadação menos gasto. Negativo é déficit."),
                    lenta("divida_publica", "Dívida pública", "percentual_pib", 0, 300,
                          "Contas públicas", "maior_pior",
                          "Bolha lenta: acumula os déficits e os juros ao longo dos anos."),
                    indice("juros_da_divida", "Juros da dívida", "percentual_pib", 0, 30,
                           "Contas públicas", "maior_pior",
                           "Quanto a dívida custa por ano, em % do PIB."),
                ],
                "leis": [],
            },
            {
                "nome": "Estabilidade financeira",
                "bolhas": [
                    indice("taxa_juros", "Taxa de juros", "percentual_0_100", 0, 100,
                           "Finanças", "neutra",
                           "Juro básico da economia. Segura a inflação e freia o crescimento."),
                    indice("cambio", "Câmbio", "indice_0_100", 0, 100,
                           "Finanças", "neutra",
                           "Valor da moeda nacional. Alto = moeda desvalorizada (exporta mais, importa inflação)."),
                    indice("risco_pais", "Risco país", "indice_0_100", 0, 100,
                           "Finanças", "maior_pior",
                           "Desconfiança dos credores. Encarece a dívida e afasta investimento."),
                    lenta("reservas_internacionais", "Reservas internacionais", "percentual_pib", 0, 100,
                          "Finanças", "maior_melhor",
                          "Bolha lenta: colchão em moeda forte contra choques externos."),
                    situacao("crise_financeira", "Crise financeira", "Finanças", 25,
                             "Surge quando risco país, dívida e câmbio saem do controle. Pisca e cresce."),
                ],
                "leis": [],
            },
            {
                "nome": "Instituições",
                "bolhas": [
                    indice("forca_instituicoes", "Força das instituições", "indice_0_100", 0, 100,
                           "Instituições", "maior_melhor",
                           "Quanto as regras do jogo são respeitadas. Resume as leis institucionais."),
                ],
                "leis": [
                    lei_institucional(
                        "regra-fiscal", "Regra fiscal",
                        "Define o limite que o governo impõe aos próprios gastos.",
                        "Contas públicas", "Ministério da Fazenda", "lei-complementar",
                        [("sem-regra", "Sem regra", 0), ("meta-resultado", "Meta de resultado", 33),
                         ("teto-gastos", "Teto de gastos", 67), ("arcabouco", "Arcabouço fiscal", 100)],
                        "Quanto mais rígida, mais confiança dos credores e menos espaço para gastar."),
                    lei_institucional(
                        "autonomia-banco-central", "Autonomia do Banco Central",
                        "Define quanto o Banco Central decide os juros sem o governo.",
                        "Finanças", "Ministério da Fazenda", "lei-complementar",
                        [("subordinado", "Subordinado ao governo", 0),
                         ("autonomia-parcial", "Autonomia parcial", 50),
                         ("autonomia-plena", "Autonomia plena", 100)],
                        "Mais autonomia segura a inflação, mas tira do governo a mão nos juros."),
                    lei_institucional(
                        "regime-cambial", "Regime cambial",
                        "Define como o valor da moeda é formado.",
                        "Finanças", "Ministério da Fazenda", "lei-ordinaria",
                        [("fixo", "Câmbio fixo", 0), ("bandas", "Bandas cambiais", 33),
                         ("flutuante-administrado", "Flutuante administrado", 67),
                         ("flutuante", "Flutuante", 100)],
                        "Câmbio fixo dá previsibilidade e gasta reservas; flutuante absorve choques."),
                    lei_institucional(
                        "independencia-judiciario", "Independência do Judiciário",
                        "Define quanto os tribunais decidem sem interferência do governo.",
                        "Instituições", "Ministério da Justiça", "emenda-constitucional",
                        [("controlado", "Controlado pelo governo", 0),
                         ("parcial", "Independência parcial", 50),
                         ("plena", "Independência plena", 100)],
                        "Fortalece as instituições e limita o próprio governo."),
                    lei_institucional(
                        "liberdade-imprensa", "Liberdade de imprensa",
                        "Define o que a imprensa pode publicar.",
                        "Instituições", "Ministério das Comunicações", "emenda-constitucional",
                        [("censura", "Censura", 0), ("restrita", "Restrita", 33),
                         ("regulada", "Regulada", 67), ("plena", "Plena", 100)],
                        "Mais liberdade expõe a corrupção e também os erros do governo."),
                    lei_institucional(
                        "transparencia-publica", "Transparência pública",
                        "Define o acesso do cidadão aos dados do governo.",
                        "Instituições", "Controladoria-Geral da União", "lei-ordinaria",
                        [("sigilo-amplo", "Sigilo amplo", 0), ("acesso-limitado", "Acesso limitado", 33),
                         ("acesso-informacao", "Acesso à informação", 67),
                         ("dados-abertos", "Dados abertos", 100)],
                        "Reduz a corrupção e aumenta a confiança, com custo administrativo."),
                    lei_institucional(
                        "federalismo", "Federalismo",
                        "Define quanto poder e dinheiro ficam com estados e municípios.",
                        "Instituições", "Ministério da Integração", "emenda-constitucional",
                        [("centralizado", "Centralizado", 0), ("cooperativo", "Cooperativo", 50),
                         ("descentralizado", "Descentralizado", 100)],
                        "Descentralizar aproxima o serviço do cidadão e dilui o controle federal."),
                ],
                "nota": "O sistema eleitoral já existe como lei eleitoral e não é recriado.",
            },
        ],
        "a_derivar": ["Legitimidade", "População", "Bem-estar", "Ordem e segurança",
                      "Território e natureza"],
        # Pontos de partida por país (só leis vigentes e bolhas lentas; o resto é calculado).
        "paises": {
            "brasil": {
                "leis": {
                    "regra-fiscal": "arcabouco",
                    "autonomia-banco-central": "autonomia-plena",
                    "regime-cambial": "flutuante",
                    "independencia-judiciario": "plena",
                    "liberdade-imprensa": "plena",
                    "transparencia-publica": "acesso-informacao",
                    "federalismo": "cooperativo",
                },
                "valores": {"divida_publica": 77, "reservas_internacionais": 16},
            },
        },
    },
}


# ---------------------------------------------------------------------------
# Leitura e escrita
# ---------------------------------------------------------------------------

def ler(caminho: Path):
    return json.loads(caminho.read_text(encoding="utf-8"))


def escrever(caminho: Path, dados) -> None:
    caminho.parent.mkdir(parents=True, exist_ok=True)
    caminho.write_text(json.dumps(dados, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def camada(n: int):
    if n not in CAMADAS:
        sys.exit(f"Camada {n} ainda não existe no gerador. Camadas: {sorted(CAMADAS)}")
    return CAMADAS[n]


def ids_existentes():
    return {v["id"] for v in ler(VARIAVEIS)["variaveis"]}


# ---------------------------------------------------------------------------
# Comandos
# ---------------------------------------------------------------------------

def cmd_listar(args) -> None:
    existentes = ids_existentes()
    for n in ([args.camada] if args.camada else sorted(CAMADAS)):
        c = camada(n)
        print(f"Camada {n} — {c['titulo']}")
        for p in c["pilares"]:
            print(f"  {p['nome']}")
            for b in p["bolhas"]:
                bid = b.get("existente") or b["json"]["id"]
                tipo = "existente" if "existente" in b else b["json"]["tipo"]
                marca = "já existe" if bid in existentes else "novo"
                print(f"    [{marca:9}] bolha {bid} ({tipo})")
            for lei in p["leis"]:
                marca = "já existe" if (PASTA_LEIS / f"{lei['id']}.json").exists() else "novo"
                print(f"    [{marca:9}] lei   {lei['id']} ({len(lei['opcoes'])} opções)")
        if c.get("a_derivar"):
            print(f"  A derivar: {', '.join(c['a_derivar'])}")


def cmd_gerar(args) -> None:
    c = camada(args.camada)
    aplicar = args.aplicar
    variaveis = ler(VARIAVEIS)
    catalogo = ler(CATALOGO)
    existentes = {v["id"] for v in variaveis["variaveis"]}
    acoes = []

    for p in c["pilares"]:
        for b in p["bolhas"]:
            if "existente" in b:
                if b["existente"] not in existentes:
                    acoes.append(f"AVISO: {b['existente']} deveria existir e não existe")
                continue
            if b["json"]["id"] not in existentes:
                variaveis["variaveis"].append(b["json"])
                existentes.add(b["json"]["id"])
                acoes.append(f"+ bolha {b['json']['id']}")
        for lei in p["leis"]:
            if lei["variavel"] not in existentes:
                variaveis["variaveis"].append(lei["variavelJson"])
                existentes.add(lei["variavel"])
                acoes.append(f"+ controle {lei['variavel']}")
            arquivo = PASTA_LEIS / f"{lei['id']}.json"
            caminho = f"mundo/leis/{lei['id']}.json"
            if not arquivo.exists():
                acoes.append(f"+ lei {caminho}")
                if aplicar:
                    escrever(arquivo, lei["json"])
            if caminho not in catalogo["politicas"]:
                catalogo["politicas"].append(caminho)
                acoes.append(f"+ catálogo {caminho}")

    pais = c.get("paises", {}).get(args.pais) if args.pais else None
    estado_path = PAISES / (args.pais or "") / "estado-inicial.json"
    estado = ler(estado_path) if pais else None
    if pais:
        vigentes = {l["lei"] for l in estado["leisVigentes"]}
        for lei, opcao in pais["leis"].items():
            if lei not in vigentes:
                estado["leisVigentes"].append({"lei": lei, "opcao": opcao})
                acoes.append(f"+ {args.pais}: lei vigente {lei} = {opcao}")
        for bid, valor in pais["valores"].items():
            if bid not in estado["valores"]:
                estado["valores"][bid] = valor
                acoes.append(f"+ {args.pais}: {bid} = {valor}")

    if not acoes:
        print("Nada a acrescentar: tudo já está nos JSONs.")
        return
    print("\n".join(acoes))
    if aplicar:
        escrever(VARIAVEIS, variaveis)
        escrever(CATALOGO, catalogo)
        if pais:
            escrever(estado_path, estado)
        print("\nGerado. Rode `npm run rede:documento` e `npm run check`.")
    else:
        print("\nEnsaio: nada foi gravado. Use --aplicar para gerar.")


def cmd_documento(args) -> None:
    c = camada(args.camada)
    linhas = [f"# Camada {args.camada} — {c['titulo']}", "",
              "_Gerado por `scripts/camadas/gerar.py documento`. Não edite à mão._", ""]
    tipos = {"calculado": "índice", "estoque": "bolha lenta", "situacao": "situação"}
    for p in c["pilares"]:
        linhas += [f"## {p['nome']}", "", "| Bolha | Tipo | Unidade | O que é |", "|---|---|---|---|"]
        for b in p["bolhas"]:
            if "existente" in b:
                linhas.append(f"| `{b['existente']}` | já existe | — | {b['explicacao']} |")
            else:
                j = b["json"]
                linhas.append(f"| {j['nome']} | {tipos[j['tipo']]} | {j['unidade']} | {b['explicacao']} |")
        if p["leis"]:
            linhas += ["", "| Lei (institucional) | Opções | Efeito esperado |", "|---|---|---|"]
            for lei in p["leis"]:
                ops = " / ".join(o["rotulo"] for o in lei["opcoes"])
                linhas.append(f"| {lei['json']['nome']} | {ops} | {lei['explicacao']} |")
        for chave in ("depois", "nota"):
            if p.get(chave):
                linhas += ["", f"> {p[chave]}"]
        linhas.append("")
    if c.get("a_derivar"):
        linhas += ["## A derivar", "", ", ".join(c["a_derivar"]) + ".", ""]
    destino = DOCS / f"camada-{args.camada}.md"
    escrever_texto = "\n".join(linhas)
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(escrever_texto, encoding="utf-8")
    print(f"Documento gravado em {destino.relative_to(RAIZ)}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="comando", required=True)
    p = sub.add_parser("listar"); p.add_argument("--camada", type=int); p.set_defaults(f=cmd_listar)
    p = sub.add_parser("gerar"); p.add_argument("--camada", type=int, required=True)
    p.add_argument("--pais"); p.add_argument("--aplicar", action="store_true"); p.set_defaults(f=cmd_gerar)
    p = sub.add_parser("documento"); p.add_argument("--camada", type=int, required=True); p.set_defaults(f=cmd_documento)
    args = parser.parse_args()
    args.f(args)


if __name__ == "__main__":
    main()
