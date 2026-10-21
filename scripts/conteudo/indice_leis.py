#!/usr/bin/env python3
"""Fonte única das leis. Edite indice-leis.jsonl; gere os JSONs do jogo daqui.

Uso: indice_leis.py mapa | buscar --termo ferrovias | ficha --id armas-de-fogo
     indice_leis.py vizinhas --id armas-de-fogo | pendentes --area trabalho
     indice_leis.py migrar | gerar | listar | candidatos
     indice_leis.py listar --id armas-de-fogo --fonte
     indice_leis.py salvar --arquivo /tmp/lei-editada.json
     indice_leis.py excluir --id id-da-lei

`migrar` é uma operação única: copia, sem alterar, o catálogo atual para o
índice completo. `gerar` publica as alterações do índice. Os comandos de
consulta imprimem apenas as leis pedidas.
"""

from __future__ import annotations

import argparse
from collections import Counter
import difflib
import hashlib
import json
import re
import unicodedata
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
MUNDO = RAIZ / "src/conteudo/mundo"
LEIS = MUNDO / "leis"
EFEITOS = MUNDO / "consequencias"
CATALOGO = MUNDO / "catalogo-leis.json"
MUNDO_JSON = MUNDO / "mundo.json"
BUSSOLA = MUNDO / "bussola.json"
VARIAVEIS = MUNDO / "indicadores/variaveis.json"
BRASIL = RAIZ / "src/conteudo/paises/brasil/leis.json"
POLITICA_BRASIL = RAIZ / "src/conteudo/paises/brasil/politica.json"
REVISAO = RAIZ / "docs/conteudo/leis-revisadas.json"
INDICE = RAIZ / "docs/conteudo/indice-leis.jsonl"
MANIFESTO = RAIZ / "docs/conteudo/leis-geradas.json"
SETOR_POR_AREA = {
    "Cidades e transporte": "Cidades e transporte",
    "Defesa e relações exteriores": "Defesa e mundo",
    "Direitos civis, costumes, imigração, mídia e defesa": "Direitos e liberdades",
    "Direitos, costumes, religião e imigração": "Direitos e liberdades",
    "Economia, moeda e comércio": "Economia e Fazenda",
    "Educação, ciência e cultura": "Educação e ciência",
    "Impostos e contas públicas": "Economia e Fazenda",
    "Instituições, Estado e sistema político": "Poder e instituições",
    "Instituições, sistema político e informação": "Poder e instituições",
    "Meio ambiente, energia, agro e infraestrutura": "Meio ambiente e energia",
    "Meio ambiente, energia, terra e cidades": "Meio ambiente e energia",
    "Previdência e assistência social": "Previdência e assistência",
    "Previdência, assistência, moradia e demografia": "Previdência e assistência",
    "Saúde": "Saúde",
    "Segurança, justiça e drogas": "Segurança e justiça",
    "Segurança, penas, drogas e armas": "Segurança e justiça",
    "Trabalho e emprego": "Trabalho e emprego",
    "Trabalho, salário e sindicatos": "Trabalho e emprego",
    "Tributação": "Economia e Fazenda",
}
TERMOS_COMUNS = {"a", "as", "de", "da", "das", "do", "dos", "e", "em", "na", "no", "para"}


def ler(caminho: Path):
    return json.loads(caminho.read_text(encoding="utf-8"))


def serializar(objeto) -> str:
    return json.dumps(objeto, ensure_ascii=False, indent=2) + "\n"


def hash_bytes(dados: bytes) -> str:
    return hashlib.sha256(dados).hexdigest()


def hash_arquivo(caminho: Path) -> str | None:
    return hash_bytes(caminho.read_bytes()) if caminho.exists() else None


def hash_objeto(objeto) -> str:
    return hash_bytes(json.dumps(objeto, ensure_ascii=False, sort_keys=True).encode("utf-8"))


def secoes(catalogo: dict, mundo: dict, bussola: dict, brasil: dict,
           ids: set[str], efeitos: set[str]) -> dict[str, str]:
    caminhos_leis = {f"mundo/leis/{id_}.json" for id_ in ids}
    caminhos_efeitos = {f"mundo/consequencias/{id_}.json" for id_ in efeitos}
    partes = {
        "catalogo": [x for x in catalogo["politicas"] if x in caminhos_leis],
        "mundo": [x for x in mundo["consequencias"] if x in caminhos_efeitos],
        "bussola": {id_: x for id_, x in bussola["leis"].items() if id_ in ids},
        "brasil": [x for x in brasil["emVigor"] if x["lei"] in ids],
    }
    return {nome: hash_objeto(valor) for nome, valor in partes.items()}


def secao_variaveis(variaveis: dict, ids: set[str]) -> str:
    return hash_objeto([item for item in variaveis["variaveis"] if item["id"] in ids])


def relativo(caminho: Path) -> str:
    return caminho.relative_to(RAIZ).as_posix()


def normalizar(texto: str) -> str:
    base = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", base.lower()).strip("-")


def revisadas() -> dict[str, str]:
    dados = ler(REVISAO)
    saida = {}
    for lote, ids in dados["lotes"].items():
        for id_lei in ids:
            if id_lei in saida:
                raise ValueError(f"{id_lei}: repetida no registro de revisão")
            saida[id_lei] = lote
    return saida


def linhas() -> list[dict]:
    if not INDICE.exists():
        raise ValueError("Fonte ausente. Execute `migrar` uma vez.")
    saida = [json.loads(linha) for linha in INDICE.read_text(encoding="utf-8").splitlines() if linha.strip()]
    ids = [linha["id"] for linha in saida]
    if len(ids) != len(set(ids)):
        raise ValueError("Há IDs de lei duplicados no índice")
    for linha in saida:
        if linha["id"] != linha["lei"]["id"]:
            raise ValueError(f"{linha['id']}: ID diferente na definição")
        if not isinstance(linha.get("efeitos"), dict):
            raise ValueError(f"{linha['id']}: efeitos deve ser um objeto")
        if "variavel" in linha:
            variavel = linha["variavel"]
            obrigatorios = ("id", "tipo", "nome", "unidade", "dominio")
            if (not isinstance(variavel, dict)
                    or any(chave not in variavel for chave in obrigatorios)
                    or not isinstance(variavel.get("id"), str)
                    or variavel.get("tipo") != "controle"
                    or not isinstance(variavel.get("dominio"), dict)):
                raise ValueError(f"{linha['id']}: variavel deve ser uma definição completa de controle")
        for id_efeito, efeito in linha["efeitos"].items():
            if efeito["id"] != id_efeito:
                raise ValueError(f"{linha['id']}: ID do efeito {id_efeito} não confere")
    return saida


def gravar_fonte(registros: list[dict]) -> None:
    INDICE.write_text("".join(json.dumps(item, ensure_ascii=False, separators=(",", ":")) + "\n"
                              for item in registros), encoding="utf-8")


def efeitos_faltantes(registros: list[dict]) -> list[str]:
    return sorted(f"{item['id']}:{id_}" for item in registros
                  for id_ in item["lei"].get("consequencias", [])
                  if id_ not in item["efeitos"])


def salvar(arquivo: Path) -> None:
    novo = ler(arquivo)
    if novo["id"] != novo["lei"]["id"]:
        raise ValueError("ID da linha difere do ID da lei")
    if not isinstance(novo.get("efeitos"), dict):
        raise ValueError("A linha precisa do objeto `efeitos`")
    registros = linhas()
    for indice, atual in enumerate(registros):
        if atual["id"] == novo["id"]:
            registros[indice] = novo
            break
    else:
        registros.append(novo)
    gravar_fonte(registros)
    print(f"{novo['id']} salva no índice. Execute `gerar` para publicar.")


def excluir(id_lei: str) -> None:
    registros = linhas()
    novos = [item for item in registros if item["id"] != id_lei]
    if len(novos) == len(registros):
        raise ValueError(f"Lei inexistente: {id_lei}")
    gravar_fonte(novos)
    print(f"{id_lei} removida do índice. Execute `gerar` para publicar.")


def migrar() -> None:
    if MANIFESTO.exists():
        raise ValueError("A fonte já foi migrada; edite o índice e use `gerar`.")
    catalogo = ler(CATALOGO)
    mundo = ler(MUNDO_JSON)
    bussola = ler(BUSSOLA)
    brasil = ler(BRASIL)
    arquivos = sorted(LEIS.glob("*.json"))
    registros = []
    caminhos = [CATALOGO, MUNDO_JSON, BUSSOLA, BRASIL]
    for arquivo in arquivos:
        lei = ler(arquivo)
        id_lei = lei["id"]
        if arquivo.stem != id_lei:
            raise ValueError(f"{arquivo}: nome e ID diferentes")
        efeitos = {}
        for id_efeito in lei.get("consequencias", []):
            caminho = EFEITOS / f"{id_efeito}.json"
            if caminho.exists():
                efeitos[id_efeito] = ler(caminho)
                caminhos.append(caminho)
        registro = {"id": id_lei, "lei": lei, "efeitos": efeitos}
        if id_lei in bussola.get("leis", {}):
            registro["bussola"] = bussola["leis"][id_lei]
        inicial = [item for item in brasil["emVigor"] if item["lei"] == id_lei]
        if inicial:
            registro["brasil"] = inicial
        registros.append(registro)
        caminhos.append(arquivo)
    conhecidos = {item["id"] for item in registros}
    catalogados = {Path(item).stem for item in catalogo["politicas"]}
    if conhecidos != catalogados:
        raise ValueError("Catálogo e pasta de leis divergem; resolva antes de migrar")
    gravar_fonte(registros)
    MANIFESTO.write_text(serializar({"versao": 1, "leis": sorted(conhecidos),
                                     "efeitos": sorted({id_ for item in registros for id_ in item["efeitos"]}),
                                     "variaveis": [],
                                     "secaoVariaveis": hash_objeto([]),
                                     "faltantesHerdados": efeitos_faltantes(registros),
                                     "secoes": secoes(catalogo, mundo, bussola, brasil, conhecidos,
                                                       {id_ for item in registros for id_ in item["efeitos"]}),
                                     "hashes": {relativo(p): hash_arquivo(p) for p in caminhos}}), encoding="utf-8")
    faltantes = sum(len(set(r["lei"].get("consequencias", [])) - set(r["efeitos"])) for r in registros)
    print(f"{len(registros)} leis importadas; {faltantes} efeitos referidos sem arquivo (estado preservado).")


def atualizar_lista(atual: list[str], antigos: set[str], novos: list[str]) -> list[str]:
    permitidos = set(novos)
    saida = [item for item in atual if item not in antigos or item in permitidos]
    saida.extend(item for item in novos if item not in saida)
    return saida


def menciona_id(valor, ids: set[str]) -> bool:
    if isinstance(valor, str):
        return valor in ids
    if isinstance(valor, list):
        return any(menciona_id(item, ids) for item in valor)
    if isinstance(valor, dict):
        return any(chave in ids or menciona_id(item, ids) for chave, item in valor.items())
    return False


def retirar_lei_de_ministerios(valor, excluidos: set[str]):
    if isinstance(valor, list):
        return [retirar_lei_de_ministerios(item, excluidos) for item in valor]
    if isinstance(valor, dict):
        return {chave: ([id_ for id_ in item if id_ not in excluidos]
                        if chave == "leis" and isinstance(item, list)
                        else retirar_lei_de_ministerios(item, excluidos))
                for chave, item in valor.items()}
    return valor


def inserir_leis_nos_ministerios(politica: dict, registros: list[dict]) -> None:
    ministerios = politica["ministerios"]["ministerios"]
    alocadas = {id_ for ministerio in ministerios for id_ in ministerio.get("leis", [])}
    for item in registros:
        if item["id"] in alocadas:
            continue
        id_explicito = item.get("ministerioId")
        if id_explicito:
            candidatos = [m for m in ministerios if m.get("id") == id_explicito]
            referencia = f"ID {id_explicito}"
        else:
            nome = item["lei"].get("ministerio")
            candidatos = [m for m in ministerios if m.get("nome") == nome]
            referencia = f"nome {nome!r}"
        if len(candidatos) != 1:
            motivo = "ausente" if not candidatos else "ambíguo"
            raise ValueError(f"{item['id']}: ministério {motivo} para {referencia}")
        candidatos[0].setdefault("leis", []).append(item["id"])
        alocadas.add(item["id"])


def gerar() -> None:
    registros = linhas()
    if not MANIFESTO.exists():
        raise ValueError("Manifesto ausente; execute `migrar` antes de gerar")
    manifesto = ler(MANIFESTO)
    faltantes_novos = set(efeitos_faltantes(registros)) - set(manifesto.get("faltantesHerdados", []))
    if faltantes_novos:
        raise ValueError(f"Consequências sem definição no índice: {sorted(faltantes_novos)}")
    atuais = {item["id"]: item for item in registros}
    efeitos = {}
    variaveis = {}
    for item in registros:
        for id_efeito, efeito in item["efeitos"].items():
            if id_efeito in efeitos:
                raise ValueError(f"Efeito compartilhado duplicado: {id_efeito}")
            efeitos[id_efeito] = efeito
        if "variavel" in item:
            variavel = item["variavel"]
            id_variavel = variavel["id"]
            if id_variavel in variaveis:
                raise ValueError(f"Variável duplicada no índice: {id_variavel}")
            variaveis[id_variavel] = variavel
    antigos = set(manifesto["leis"])
    efeitos_antigos = set(manifesto["efeitos"])
    variaveis_antigas = set(manifesto.get("variaveis", []))
    catalogo, mundo, bussola, brasil = map(ler, (CATALOGO, MUNDO_JSON, BUSSOLA, BRASIL))
    arquivo_variaveis = ler(VARIAVEIS)
    politica = ler(POLITICA_BRASIL)
    ids_arquivo_variaveis = [item["id"] for item in arquivo_variaveis["variaveis"]]
    compartilhados = {CATALOGO, MUNDO_JSON, BUSSOLA, BRASIL, POLITICA_BRASIL, VARIAVEIS}
    if "secoes" not in manifesto:
        for caminho in compartilhados:
            if manifesto["hashes"].get(relativo(caminho)) != hash_arquivo(caminho):
                raise ValueError(f"Arquivo compartilhado alterado antes da migração: {caminho}")
        manifesto["secoes"] = secoes(catalogo, mundo, bussola, brasil, antigos, efeitos_antigos)
    registradas = {Path(x).stem for x in catalogo["politicas"]}
    if registradas - (antigos | set(atuais)):
        raise ValueError(f"Leis adicionadas diretamente ao catálogo: {sorted(registradas - (antigos | set(atuais)))}")
    if manifesto.get("secoes") != secoes(catalogo, mundo, bussola, brasil, antigos, efeitos_antigos):
        raise ValueError("Referências de leis foram alteradas fora do índice")
    esperado_variaveis = manifesto.get("secaoVariaveis", hash_objeto([]))
    if esperado_variaveis != secao_variaveis(arquivo_variaveis, variaveis_antigas):
        raise ValueError("Variável gerada foi alterada fora do índice")
    colisoes = set(variaveis) & (set(ids_arquivo_variaveis) - variaveis_antigas)
    if colisoes:
        raise ValueError(f"IDs de variável já existem fora do índice: {sorted(colisoes)}")
    catalogo["politicas"] = atualizar_lista(
        catalogo["politicas"], {f"mundo/leis/{id_}.json" for id_ in antigos},
        [f"mundo/leis/{id_}.json" for id_ in atuais])
    mundo["consequencias"] = atualizar_lista(
        mundo["consequencias"], {f"mundo/consequencias/{id_}.json" for id_ in efeitos_antigos},
        [f"mundo/consequencias/{id_}.json" for id_ in efeitos])
    mapa = {id_: valor for id_, valor in bussola["leis"].items()
            if id_ not in antigos or (id_ in atuais and "bussola" in atuais[id_])}
    mapa.update({id_: item["bussola"] for id_, item in atuais.items() if "bussola" in item})
    bussola["leis"] = mapa
    iniciais = {id_: item.get("brasil", []) for id_, item in atuais.items()}
    ja_inseridos = set()
    vigentes = []
    for entrada in brasil["emVigor"]:
        id_ = entrada["lei"]
        if id_ not in antigos:
            vigentes.append(entrada)
        elif id_ not in ja_inseridos:
            vigentes.extend(iniciais.get(id_, []))
            ja_inseridos.add(id_)
    for id_, entradas in iniciais.items():
        if id_ not in ja_inseridos:
            vigentes.extend(entradas)
    brasil["emVigor"] = vigentes
    arquivo_variaveis["variaveis"] = [item for item in arquivo_variaveis["variaveis"]
                                      if item["id"] not in variaveis_antigas]
    arquivo_variaveis["variaveis"].extend(variaveis.values())
    inserir_leis_nos_ministerios(politica, registros)
    desejados = {CATALOGO: catalogo, MUNDO_JSON: mundo, BUSSOLA: bussola, BRASIL: brasil,
                 VARIAVEIS: arquivo_variaveis, POLITICA_BRASIL: politica}
    desejados.update({LEIS / f"{id_}.json": item["lei"] for id_, item in atuais.items()})
    desejados.update({EFEITOS / f"{id_}.json": efeito for id_, efeito in efeitos.items()})
    removidos = ([LEIS / f"{id_}.json" for id_ in antigos - set(atuais)]
                + [EFEITOS / f"{id_}.json" for id_ in efeitos_antigos - set(efeitos)])
    # Falhe antes de qualquer escrita se um arquivo gerado mudou por fora.
    for caminho in (set(desejados) | set(removidos)) - compartilhados:
        esperado = manifesto["hashes"].get(relativo(caminho))
        presente = hash_arquivo(caminho)
        if esperado is None and presente is not None:
            raise ValueError(f"Arquivo novo já existe fora do índice: {caminho}")
        if esperado is not None and presente != esperado:
            raise ValueError(f"Arquivo alterado fora do índice: {caminho}. Migre essa edição antes de gerar.")
    # Outras leis não podem depender de uma lei excluída.
    excluidos = antigos - set(atuais)
    for item in registros:
        lei = item["lei"]
        refs = set(lei.get("mae", {}).get("leis", []))
        refs.update(r.get("lei") for r in lei.get("requer", []) if isinstance(r, dict))
        if refs & excluidos:
            raise ValueError(f"{item['id']} ainda referencia lei removida: {sorted(refs & excluidos)}")
    if excluidos:
        politica = retirar_lei_de_ministerios(politica, excluidos)
        desejados[POLITICA_BRASIL] = politica
        for caminho in (RAIZ / "src/conteudo").rglob("*.json"):
            if (caminho in compartilhados or caminho.parent in (LEIS, EFEITOS)
                    or "_arquivo-leis-antigas" in caminho.parts):
                continue
            if menciona_id(ler(caminho), excluidos):
                raise ValueError(f"Lei removida ainda é referida em {caminho}")
    alterados = 0
    for caminho, objeto in desejados.items():
        if caminho.exists() and ler(caminho) == objeto:
            continue
        caminho.write_text(serializar(objeto), encoding="utf-8")
        alterados += 1
    for caminho in removidos:
        if caminho.exists():
            caminho.unlink()
            alterados += 1
    MANIFESTO.write_text(serializar({"versao": 1, "leis": sorted(atuais),
                                     "efeitos": sorted(efeitos),
                                     "variaveis": sorted(variaveis),
                                     "secaoVariaveis": secao_variaveis(arquivo_variaveis,
                                                                        set(variaveis)),
                                     "faltantesHerdados": sorted(set(efeitos_faltantes(registros))
                                                                & set(manifesto.get("faltantesHerdados", []))),
                                     "secoes": secoes(catalogo, mundo, bussola, brasil,
                                                       set(atuais), set(efeitos)),
                                     "hashes": {relativo(p): hash_arquivo(p) for p in desejados}}), encoding="utf-8")
    print(f"{len(atuais)} leis; {alterados} arquivos atualizados; fonte: {INDICE}")


def resumir(item: dict, lote: str | None) -> dict:
    lei = item["lei"]
    opcoes = lei.get("controle", {}).get("opcoes", [])
    alertas = []
    if any("ponto-da-faixa" in normalizar(str(o.get("id", ""))) for o in opcoes):
        alertas.append("opcao-provisoria")
    if not lei.get("consequencias") and not lei.get("efeitos"):
        alertas.append("sem-consequencias-diretas")
    if set(lei.get("consequencias", [])) - set(item["efeitos"]):
        alertas.append("efeito-sem-definicao")
    if any(termo in normalizar(lei["nome"]) for termo in
           ("papel-do-estado", "propriedade-dos-meios", "planejamento-da-economia")):
        alertas.append("possivelmente-abstrata")
    area = lei.get("area", "")
    return {"id": item["id"], "nome": lei["nome"], "area": area,
            "setor": SETOR_POR_AREA.get(area, area),
            "camada": lei.get("mesa", {}).get("camada", ""),
            "controle": {k: lei.get("controle", {}).get(k, "") for k in ("variavel", "unidade")},
            "opcoes": [[o.get("id"), o.get("rotulo"), o.get("valor")] for o in opcoes],
            "consequencias": lei.get("consequencias", []),
            "alvos": sorted({efeito.get("alvo", "") for efeito in item["efeitos"].values()
                             if efeito.get("alvo")}),
            "requer": lei.get("requer", []), "mae": lei.get("mae", {}).get("leis", []),
            "revisadaNoLote": lote, "alertas": alertas}


def candidatos(leis: list[dict]) -> list[tuple[str, str, str]]:
    saida = []
    for i, a in enumerate(leis):
        for b in leis[i + 1:]:
            var_igual = a["controle"]["variavel"] and a["controle"]["variavel"] == b["controle"]["variavel"]
            nome_a, nome_b = normalizar(a["nome"]), normalizar(b["nome"])
            parecido = difflib.SequenceMatcher(None, nome_a, nome_b).ratio() >= 0.78
            op_a, op_b = {o[0] for o in a["opcoes"]}, {o[0] for o in b["opcoes"]}
            termos_a = set(nome_a.split("-")) - TERMOS_COMUNS
            termos_b = set(nome_b.split("-")) - TERMOS_COMUNS
            termos_comuns = len(termos_a & termos_b) >= 2
            opcoes_parecidas = (a["setor"] == b["setor"] and termos_comuns
                                and len(op_a & op_b) >= 2)
            if var_igual or parecido or opcoes_parecidas:
                saida.append((a["id"], b["id"], "mesmo-controle" if var_igual else
                              "opcoes-repetidas" if opcoes_parecidas else "nome-parecido"))
    return saida


def mostrar_pagina(itens: list, limite: int, pagina: int, formatar) -> None:
    inicio = (pagina - 1) * limite
    fim = inicio + limite
    print(f"{len(itens)} resultado(s); página {pagina}; mostrando {inicio + 1 if itens[inicio:fim] else 0}-{min(fim, len(itens))}")
    for item in itens[inicio:fim]:
        print(formatar(item))


def mapa(leis: list[dict], area: str | None, setor: str | None) -> None:
    grupos: dict[str, list[dict]] = {}
    for lei in leis:
        if area and normalizar(area) not in normalizar(lei["area"]):
            continue
        if setor and normalizar(setor) not in normalizar(lei["setor"]):
            continue
        grupos.setdefault(lei["setor"], []).append(lei)
    for nome, grupo in sorted(grupos.items()):
        pendentes = sum(not lei["revisadaNoLote"] for lei in grupo)
        alertas = Counter(alerta for lei in grupo for alerta in lei["alertas"])
        print(f"{nome} | {len(grupo)} {'lei' if len(grupo) == 1 else 'leis'} | {pendentes} pendentes | "
              f"alertas: {', '.join(f'{k}={v}' for k, v in sorted(alertas.items())) or '-'}")
    print(f"TOTAL | {sum(map(len, grupos.values()))} leis | "
          f"{sum(not lei['revisadaNoLote'] for grupo in grupos.values() for lei in grupo)} pendentes")


def buscar(itens: list[dict], leis: list[dict], termo: str) -> list[tuple[dict, str]]:
    chave = normalizar(termo)
    saida = []
    for item, lei in zip(itens, leis):
        campos = {"id": lei["id"], "nome": lei["nome"], "descrição": item["lei"].get("descricao", ""),
                  "opções": " ".join(str(op["rotulo"]) for op in item["lei"].get("controle", {}).get("opcoes", [])),
                  "alvos": " ".join(lei["alvos"])}
        achados = [nome for nome, valor in campos.items() if chave in normalizar(valor)]
        if achados:
            saida.append((lei, ",".join(achados)))
    return saida


def ficha(item: dict, resumo: dict, limite: int, pagina: int) -> None:
    lei = item["lei"]
    controle = lei.get("controle", {})
    print(f"{resumo['id']} | {resumo['nome']} | {resumo['area']}")
    print(f"Camada: {resumo['camada'] or '-'} | Controle: {controle.get('variavel', '-')} "
          f"({controle.get('unidade', '-')}) | Revisão: {resumo['revisadaNoLote'] or 'pendente'}")
    print(f"Dilema/descrição: {lei.get('descricao', '-')}")
    print("Opções:")
    for opcao in controle.get("opcoes", []):
        custo = opcao.get("custoAnualPercentualPib")
        print(f"  {opcao['id']} | {opcao.get('valor', '-')} | {opcao.get('rotulo', '-')}"
              + (f" | custo {custo}% PIB/ano" if custo is not None else ""))
    print("Relações:")
    print(f"  requer={resumo['requer'] or '-'} | mães={resumo['mae'] or '-'} | "
          f"Brasil={item.get('brasil', '-')}")
    efeitos = list(item["efeitos"].values())
    print(f"Consequências: {len(efeitos)} definidas, "
          f"{len(set(resumo['consequencias']) - set(item['efeitos']))} sem definição")
    mostrar_pagina(efeitos, limite, pagina,
                  lambda e: f"  {e['id']} → {e.get('alvo', '-')} | {e.get('mecanismo', '-')} "
                            f"| atraso {e.get('atrasoPassos', 0)}")


def vizinhas(alvo: dict, leis: list[dict]) -> list[tuple[dict, str]]:
    id_alvo = alvo["id"]
    refs = {r.get("lei") for r in alvo["requer"] if isinstance(r, dict)} | set(alvo["mae"])
    frequencia = Counter(nome for lei in leis for nome in lei["alvos"])
    pontuadas = []
    for lei in leis:
        if lei["id"] == id_alvo:
            continue
        razoes = []
        if lei["id"] in refs:
            razoes.append("dependência")
        refs_lei = {r.get("lei") for r in lei["requer"] if isinstance(r, dict)} | set(lei["mae"])
        if id_alvo in refs_lei:
            razoes.append("lei filha")
        if alvo["controle"]["variavel"] and alvo["controle"]["variavel"] == lei["controle"]["variavel"]:
            razoes.append("mesmo controle")
        comuns = sorted(nome for nome in set(alvo["alvos"]) & set(lei["alvos"])
                        if frequencia[nome] <= 20)
        if comuns:
            razoes.append(f"{len(comuns)} alvo(s) em comum: {','.join(comuns[:3])}")
        if not razoes:
            continue
        prioridade = (100 if "dependência" in razoes or "lei filha" in razoes else 0)
        prioridade += (40 if "mesmo controle" in razoes else 0) + len(comuns)
        prioridade += 5 if alvo["area"] == lei["area"] else 0
        pontuadas.append((prioridade, lei, "; ".join(razoes)))
    pontuadas.sort(key=lambda x: (-x[0], x[1]["id"]))
    return [(lei, razao) for _, lei, razao in pontuadas]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("acao", choices=["migrar", "gerar", "salvar", "excluir", "mapa", "buscar", "ficha", "vizinhas", "listar", "pendentes", "candidatos", "ciclo"])
    parser.add_argument("--area")
    parser.add_argument("--setor", help="Agrupa nomes de áreas equivalentes")
    parser.add_argument("--id")
    parser.add_argument("--arquivo", type=Path, help="Definição completa da lei em JSON")
    parser.add_argument("--ids", help="IDs separados por vírgula")
    parser.add_argument("--termo", help="Texto a buscar em nome, descrição, opções e alvos")
    parser.add_argument("--ciclo", help="ID do ciclo de jogo registrado no índice")
    parser.add_argument("--limite", type=int, default=12, help="Máximo por página (padrão: 12)")
    parser.add_argument("--pagina", type=int, default=1, help="Página começando em 1")
    parser.add_argument("--detalhes", action="store_true")
    parser.add_argument("--fonte", action="store_true", help="Mostra a definição completa da lei no índice")
    parser.add_argument("--incluir-revisadas", action="store_true")
    parser.add_argument("--somente-pendentes", action="store_true", help="Restringe a busca às leis pendentes")
    args = parser.parse_args()
    if args.limite < 1 or args.pagina < 1:
        parser.error("--limite e --pagina devem ser positivos")
    if args.acao == "migrar":
        migrar()
        return
    if args.acao == "gerar":
        gerar()
        return
    if args.acao == "salvar":
        if args.arquivo is None:
            parser.error("salvar exige --arquivo")
        salvar(args.arquivo)
        return
    if args.acao == "excluir":
        if args.id is None:
            parser.error("excluir exige --id")
        excluir(args.id)
        return
    itens = linhas()
    rev = revisadas()
    ids = set(args.ids.split(",")) if args.ids else set()
    leis = [resumir(item, rev.get(item["id"])) for item in itens]
    if args.acao == "ciclo":
        if not args.ciclo:
            parser.error("ciclo exige --ciclo")
        selecionadas = [(item, lei) for item, lei in zip(itens, leis)
                       if args.ciclo in item.get("jogo", {}).get("ciclos", [])]
        for item, lei in selecionadas:
            jogo = item["jogo"]
            alvos = sorted(set(lei["alvos"]) | {e["alvo"] for e in item["lei"].get("efeitos", [])
                                             if isinstance(e, dict) and "alvo" in e})
            print(f"{lei['id']} | {lei['nome']} | {jogo.get('papel', '-')} | "
                  f"{','.join(jogo.get('projetos', [])) or '-'} | "
                  f"{jogo.get('decisao', '-')} | {','.join(alvos) or '-'}")
        print(f"TOTAL | {len(selecionadas)} leis no ciclo")
        return
    if args.acao == "mapa":
        mapa(leis, args.area, args.setor)
        return
    if args.acao in ("ficha", "vizinhas"):
        if not args.id:
            parser.error(f"{args.acao} exige --id")
        posicoes = {lei["id"]: indice for indice, lei in enumerate(leis)}
        if args.id not in posicoes:
            parser.error(f"Lei inexistente: {args.id}")
        posicao = posicoes[args.id]
        if args.acao == "ficha":
            ficha(itens[posicao], leis[posicao], args.limite, args.pagina)
        else:
            relacionadas = vizinhas(leis[posicao], [lei for lei in leis
                                                   if (not args.area or normalizar(args.area) in normalizar(lei["area"]))
                                                   and (not args.setor or normalizar(args.setor) in normalizar(lei["setor"]))])
            mostrar_pagina(relacionadas, args.limite, args.pagina,
                          lambda item: f"{item[0]['id']} | {item[0]['nome']} | {item[1]}")
        return
    if args.acao == "buscar":
        if not args.termo:
            parser.error("buscar exige --termo")
        achados = buscar(itens, leis, args.termo)
        achados = [(lei, motivo) for lei, motivo in achados
                   if (not args.somente_pendentes or not lei["revisadaNoLote"])
                   and (not args.area or normalizar(args.area) in normalizar(lei["area"]))
                   and (not args.setor or normalizar(args.setor) in normalizar(lei["setor"]))]
        mostrar_pagina(achados, args.limite, args.pagina,
                      lambda item: f"{item[0]['id']} | {item[0]['nome']} | {item[0]['setor']} | "
                                   f"{item[0]['revisadaNoLote'] or 'pendente'} | {item[1]}")
        return
    if ids - {lei["id"] for lei in leis}:
        raise ValueError(f"IDs inexistentes: {sorted(ids - {lei['id'] for lei in leis})}")
    filtradas = [lei for lei in leis if (args.incluir_revisadas or not lei["revisadaNoLote"])
                and (not args.area or normalizar(args.area) in normalizar(lei["area"]))
                and (not args.setor or normalizar(args.setor) in normalizar(lei["setor"]))
                and (not args.id or lei["id"] == args.id)
                and (not ids or lei["id"] in ids)]
    if args.acao == "candidatos":
        pool = [lei for lei in leis if (not args.area or normalizar(args.area) in normalizar(lei["area"]))
                and (not args.setor or normalizar(args.setor) in normalizar(lei["setor"]))
                and (not ids or lei["id"] in ids)]
        revisao = {lei["id"]: lei["revisadaNoLote"] for lei in pool}
        pares = [par for par in candidatos(pool)
                 if (not args.id or args.id in par[:2])
                 and (args.incluir_revisadas or not (revisao[par[0]] and revisao[par[1]]))]
        mostrar_pagina(pares, args.limite, args.pagina,
                      lambda par: f"{par[0]} | {par[1]} | {par[2]}")
        return
    if args.fonte and len(filtradas) != 1:
        parser.error("--fonte exige uma única lei: use --id e --incluir-revisadas se necessário")
    originais = {item["id"]: item for item in itens}
    if args.fonte:
        print(serializar(originais[filtradas[0]["id"]]), end="")
        return
    pagina = filtradas[(args.pagina - 1) * args.limite:args.pagina * args.limite]
    print(f"{len(filtradas)} resultado(s); página {args.pagina}; "
          f"mostrando {((args.pagina - 1) * args.limite + 1) if pagina else 0}-"
          f"{min(args.pagina * args.limite, len(filtradas))}")
    for lei in pagina:
        if args.acao == "pendentes":
            print(f"{lei['id']} | {lei['area']}")
        elif args.detalhes:
            print(json.dumps(lei, ensure_ascii=False, separators=(",", ":")))
        else:
            print(f"{lei['id']} | {lei['nome']} | {len(lei['opcoes'])} opções | "
                  f"{len(lei['consequencias'])} efeitos | {','.join(lei['alertas']) or '-'}")


if __name__ == "__main__":
    main()
