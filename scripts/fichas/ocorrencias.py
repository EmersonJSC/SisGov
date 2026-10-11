"""Ocorrências (SG106): fichas em docs/fichas/ocorrencias/*.json → mundo.

Gera, para cada evento e dilema:
- o nó de intensidade (controle de 0 a 1): `ocorrencia_<id>` no evento e
  `ocorrencia_<dilema>__<opcao>` em cada opção do dilema;
- uma consequência por efeito (afim, coeficiente = pontos na unidade do
  alvo; em estoque, pontos por mês);
- o arquivo da ocorrência (mundo/eventos ou mundo/dilemas) com gatilho,
  desdobramentos e opções no formato do motor.

Formato compacto das fichas (ver docs/arquitetura/ocorrencias.md):

    "se": [["corrupcao", ">", 60], ["lei:regime-cambial", "em", ["fixo"]]]
    "fatores": [["desmatamento", 30, 80, 3]]
    "reacao": {"lei": "empresas-estatais-e-privatizacao", "para": ["sem-estatais"], "janela": 2}
    "desdobra": [["reconstrucao", 1, 1, 1]]          # id, chance, de, até (turnos)
    "leis": {"regra-fiscal": "teto-gastos"}           # na opção do dilema
"""
from __future__ import annotations

import json
from pathlib import Path

OPERADORES = {">": "maior_que", ">=": "maior_ou_igual", "<": "menor_que",
              "<=": "menor_ou_igual", "=": "igual"}
TAXA = {"indice_0_100": "indice_0_100_por_passo", "percentual_pib": "percentual_pib_por_passo",
        "percentual_0_100": "indice_0_100_por_passo"}
ORIGENS_EVENTO = {"mundo", "natureza", "pais", "reacao", "desdobramento"}
ORIGENS_DILEMA = {"crise", "reacao", "desdobramento", "cotidiano"}


def snake(texto: str) -> str:
    return texto.replace("-", "_")


class Erro(SystemExit):
    pass


def _lei(leis: dict, lid: str, onde: str) -> dict:
    if lid not in leis:
        raise Erro(f"{onde}: lei inexistente: {lid}")
    return leis[lid]


def _valor_da_lei(lei: dict, valor, onde: str) -> float:
    """Opção (id) → valor do controle; número fica como está."""
    if isinstance(valor, (int, float)):
        return float(valor)
    for o in lei["controle"].get("opcoes") or []:
        if o["id"] == valor:
            return float(o["valor"])
    raise Erro(f"{onde}: a lei {lei['id']} não tem a opção {valor}")


def _variavel(lado: str, leis: dict, variaveis: dict, onde: str) -> tuple[str, dict | None]:
    if lado.startswith("lei:"):
        lei = _lei(leis, lado[4:], onde)
        return lei["controle"]["variavel"], lei
    if lado not in variaveis:
        raise Erro(f"{onde}: variável inexistente: {lado}")
    return lado, None


def condicao(lista, leis: dict, variaveis: dict, onde: str) -> dict | None:
    """[[lado, op, valor], …] (todas valem) → condição do motor."""
    if not lista:
        return None
    partes = []
    for lado, op, valor in lista:
        var, lei = _variavel(lado, leis, variaveis, onde)
        if op == "em":
            valores = [_valor_da_lei(lei, v, onde) if lei else float(v) for v in valor]
            alternativas = [{"tipo": "comparacao", "variavel": var, "operador": "igual", "valor": v}
                            for v in valores]
            partes.append(alternativas[0] if len(alternativas) == 1
                          else {"tipo": "ou", "condicoes": alternativas})
        elif op == "fora":
            valores = [_valor_da_lei(lei, v, onde) if lei else float(v) for v in valor]
            alternativas = [{"tipo": "comparacao", "variavel": var, "operador": "igual", "valor": v}
                            for v in valores]
            dentro = alternativas[0] if len(alternativas) == 1 else {"tipo": "ou", "condicoes": alternativas}
            partes.append({"tipo": "nao", "condicao": dentro})
        else:
            if op not in OPERADORES:
                raise Erro(f"{onde}: operador {op}")
            v = _valor_da_lei(lei, valor, onde) if lei else float(valor)
            partes.append({"tipo": "comparacao", "variavel": var, "operador": OPERADORES[op], "valor": v})
    return partes[0] if len(partes) == 1 else {"tipo": "e", "condicoes": partes}


def _desdobra(lista) -> list[dict]:
    return [{"ocorrencia": oid, "chance": float(chance), "emTurnos": [int(de), int(ate)]}
            for oid, chance, de, ate in lista or []]


def _gatilho(f: dict, leis: dict, variaveis: dict, onde: str) -> dict:
    g: dict = {"chance": float(f.get("chance", 0))}
    if f.get("fatores"):
        g["fatores"] = []
        for var, de, ate, mult in f["fatores"]:
            nome, _ = _variavel(var, leis, variaveis, onde)
            g["fatores"].append({"variavel": nome, "de": de, "ate": ate, "multiplica": mult})
    c = condicao(f.get("se"), leis, variaveis, onde)
    if c:
        g["condicao"] = c
    if f.get("porTurnos"):
        g["porTurnos"] = int(f["porTurnos"])
    r = f.get("reacao")
    if r:
        lei = _lei(leis, r["lei"], onde)
        reac = {"controle": lei["controle"]["variavel"], "janelaTurnos": int(r.get("janela", 2))}
        if "para" in r:
            reac["para"] = [_valor_da_lei(lei, v, onde) for v in r["para"]]
        elif "sobe" in r:
            reac["sobe"] = float(r["sobe"])
        else:
            reac["desce"] = float(r["desce"])
        g["reacao"] = reac
    return g


def _efeitos(dono: str, controle: str, efeitos: dict, variaveis: dict, onde: str,
             consequencias: dict) -> list[str]:
    ids = []
    for alvo, pontos in (efeitos or {}).items():
        if alvo not in variaveis:
            raise Erro(f"{onde}: alvo inexistente: {alvo}")
        v = variaveis[alvo]
        if v["tipo"] == "controle":
            raise Erro(f"{onde}: o alvo {alvo} é um controle")
        unidade = TAXA[v["unidade"]] if v["tipo"] == "estoque" else v["unidade"]
        cid = f"{dono}--{alvo}".replace("_", "-")
        consequencias[cid] = {
            "id": cid, "tipo": "consequencia", "versaoEsquema": 1, "origem": controle,
            "alvo": alvo, "mecanismo": "afim",
            "parametros": {"coeficiente": float(pontos), "termoConstante": 0},
            "unidade": unidade, "atrasoPassos": 0, "duracao": {"modo": "continuo"}}
        ids.append(cid)
    return ids


def _no(cid: str, nome: str, area: str) -> dict:
    return {"id": cid, "tipo": "controle", "nome": nome, "unidade": "indice_0_1",
            "dominio": {"minimo": 0, "maximo": 1}, "valorInicial": 0, "area": area}


def _comum(f: dict, tipo: str, area: str) -> dict:
    j = {"id": f["id"], "tipo": tipo, "versaoEsquema": 1, "nome": f["nome"],
         "descricao": f["descricao"], "area": f.get("area", area),
         "manchete": f.get("manchete", f["nome"]), "origem": f["origem"],
         "nivel": int(f.get("nivel", 2))}
    if f.get("avaliacao"):
        j["avaliacao"] = f["avaliacao"]
    if f.get("unica"):
        j["unica"] = True
    if "intervalo" in f:
        j["intervaloMinimoTurnos"] = int(f["intervalo"])
    return j


CAMPOS_DA_VARIANTE = {"efeitos", "se", "fatores", "chance", "reacao", "opcoes", "nivel", "area",
                      "desdobra", "duracao", "intervalo", "porTurnos", "avaliacao", "origem", "unica",
                      "padrao"}


def _troca(valor, textos: dict):
    """Troca {chave} pelos textos da variante, em qualquer string do valor."""
    if isinstance(valor, str):
        for k, v in textos.items():
            valor = valor.replace("{" + k + "}", v)
        return valor
    if isinstance(valor, list):
        return [_troca(x, textos) for x in valor]
    if isinstance(valor, dict):
        return {k: _troca(v, textos) for k, v in valor.items()}
    return valor


def expandir(fichas: list[dict]) -> list[dict]:
    """Uma ficha com `variantes` vira uma ocorrência por variante: as chaves
    de texto da variante preenchem {chave} no id e nos textos; as chaves
    estruturais (efeitos, se, opcoes…) substituem as da ficha."""
    saida = []
    for f in fichas:
        variantes = f.get("variantes")
        if not variantes:
            saida.append(f)
            continue
        base = {k: v for k, v in f.items() if k != "variantes"}
        for var in variantes:
            textos = {k: v for k, v in var.items() if isinstance(v, str) and k not in CAMPOS_DA_VARIANTE}
            nova = _troca(base, textos)
            for k in CAMPOS_DA_VARIANTE & set(var):
                nova[k] = _troca(var[k], textos)
            saida.append(nova)
    return saida


def gerar(pasta: Path, leis: dict, variaveis: dict) -> dict:
    """leis: id → lei (JSON do motor); variaveis: id → definição (todas)."""
    eventos: dict[str, dict] = {}
    dilemas: dict[str, dict] = {}
    nos: dict[str, dict] = {}
    consequencias: dict[str, dict] = {}
    alvos: set[str] = set()
    fichas = []
    for p in sorted(pasta.glob("*.json")):
        doc = json.loads(p.read_text(encoding="utf-8"))
        fichas.append((p.name, doc))
    vistos = set()
    for arquivo, doc in fichas:
        area = doc["area"]
        for f in expandir(doc.get("eventos", [])):
            onde = f"{arquivo}:{f['id']}"
            if f["id"] in vistos:
                raise Erro(f"{onde}: id repetido")
            vistos.add(f["id"])
            if f["origem"] not in ORIGENS_EVENTO:
                raise Erro(f"{onde}: origem {f['origem']}")
            j = _comum(f, "evento", area)
            j["gatilho"] = _gatilho(f, leis, variaveis, onde)
            j["consequencias"] = []
            if f.get("efeitos"):
                no = f"ocorrencia_{snake(f['id'])}"
                nos[no] = _no(no, f"Evento: {f['nome']}", j["area"])
                j["controle"] = no
                j["duracaoMeses"] = int(f.get("duracao", 3))
                j["consequencias"] = _efeitos(f["id"], no, f["efeitos"], variaveis, onde, consequencias)
                alvos.update(f["efeitos"])
            if f.get("desdobra"):
                j["desdobramentos"] = _desdobra(f["desdobra"])
            eventos[f["id"]] = j
        for f in expandir(doc.get("dilemas", [])):
            onde = f"{arquivo}:{f['id']}"
            if f["id"] in vistos:
                raise Erro(f"{onde}: id repetido")
            vistos.add(f["id"])
            if f["origem"] not in ORIGENS_DILEMA:
                raise Erro(f"{onde}: origem {f['origem']}")
            j = _comum(f, "dilema", area)
            j["gatilho"] = _gatilho(f, leis, variaveis, onde)
            if f.get("desdobra"):
                j["desdobramentos"] = _desdobra(f["desdobra"])
            j["padrao"] = f["padrao"]
            todas: list[str] = []
            opcoes = []
            for o in f["opcoes"]:
                ond = f"{onde}.{o['id']}"
                no = f"ocorrencia_{snake(f['id'])}__{snake(o['id'])}"
                nos[no] = _no(no, f"{f['nome']}: {o['rotulo']}", j["area"])
                ids = _efeitos(f"{f['id']}--{o['id']}", no, o.get("efeitos"), variaveis, ond,
                               consequencias)
                alvos.update(o.get("efeitos") or {})
                todas.extend(ids)
                op = {"id": o["id"], "rotulo": o["rotulo"], "descricao": o["descricao"],
                      "controle": no, "duracaoMeses": int(o.get("duracao", 3)), "consequencias": ids}
                if o.get("leis"):
                    op["leis"] = [{"lei": lid, "nivel": _valor_da_lei(_lei(leis, lid, ond), v, ond)}
                                  for lid, v in o["leis"].items()]
                req = condicao(o.get("requer"), leis, variaveis, ond)
                if req:
                    op["requer"] = req
                    op["motivoRequer"] = o.get("motivo", "Indisponível agora.")
                if o.get("desdobra"):
                    op["desdobramentos"] = _desdobra(o["desdobra"])
                opcoes.append(op)
            if f["padrao"] not in {o["id"] for o in opcoes}:
                raise Erro(f"{onde}: padrao {f['padrao']} não é opção")
            j["opcoes"] = opcoes
            j["consequencias"] = todas
            dilemas[f["id"]] = j
    # desdobramentos apontam para ocorrências que existem
    todas_ids = set(eventos) | set(dilemas)
    for j in [*eventos.values(), *dilemas.values()]:
        for d in j.get("desdobramentos", []) + [d for o in j.get("opcoes", [])
                                                 for d in o.get("desdobramentos", [])]:
            if d["ocorrencia"] not in todas_ids:
                raise Erro(f"{j['id']}: desdobramento para ocorrência inexistente {d['ocorrencia']}")
    return {"eventos": eventos, "dilemas": dilemas, "nos": nos,
            "consequencias": consequencias, "alvos": alvos}


def referencias(pasta: Path) -> set[str]:
    """Bolhas citadas pelas fichas (efeitos, condições, fatores), para o
    conversor mantê-las na rede antes de gerar as ocorrências."""
    usadas: set[str] = set()

    def lado(x: str) -> None:
        if not x.startswith("lei:"):
            usadas.add(x)

    for p in sorted(pasta.glob("*.json")):
        doc = json.loads(p.read_text(encoding="utf-8"))
        for f in expandir(doc.get("eventos", [])) + expandir(doc.get("dilemas", [])):
            usadas.update(f.get("efeitos") or {})
            for var, *_ in f.get("fatores") or []:
                lado(var)
            for c in f.get("se") or []:
                lado(c[0])
            for o in f.get("opcoes") or []:
                usadas.update(o.get("efeitos") or {})
                for c in o.get("requer") or []:
                    lado(c[0])
    return usadas
