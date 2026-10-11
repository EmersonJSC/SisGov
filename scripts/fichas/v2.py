"""Confere o dicionário v2 (docs/fichas/v2): leis das 9 áreas e índices.

Uso: python3 scripts/fichas/v2.py [pasta]  (padrão: docs/fichas/v2)
Imprime os problemas e sai com código 1 se houver algum.
"""

import json
import re
import sys
from pathlib import Path

AREAS = [
    "poder", "seguranca", "defesa", "direitos", "contas",
    "mercado", "protecao", "educacao", "territorio",
]
NIVEIS = {"macro", "meso", "micro"}
GRUPOS_LEI = {"orcamentaria", "regulatoria", "tributaria", "institucional"}
UNIDADES = {"reais_ano", "percentual", "horas"}
PROIBIDOS = re.compile(r"\b(SUS|INSS|CLT|Bolsa Família|Fies|ProUni|Maria da Penha|STF)\b")


def main(pasta: Path) -> int:
    erros: list[str] = []
    avisos: list[str] = []
    ind = json.loads((pasta / "indices.json").read_text())
    alvos = {x["id"] for k in ("indices", "estoques", "situacoes") for x in ind.get(k, [])}
    grupos = {x["id"] for x in ind.get("grupos", [])}
    for g in ind.get("grupos", []):
        for v in g.get("valoriza", []):
            if v.get("indice") not in alvos:
                erros.append(f"grupo {g['id']}: valoriza índice desconhecido {v.get('indice')}")

    leis: dict[str, dict] = {}
    for area in AREAS:
        arq = pasta / "areas" / f"{area}.json"
        if not arq.exists():
            erros.append(f"falta {arq}")
            continue
        for lei in json.loads(arq.read_text())["leis"]:
            if lei["id"] in leis:
                erros.append(f"id repetido: {lei['id']}")
            leis[lei["id"]] = lei

    for lid, lei in leis.items():
        p = f"{lei.get('area')}/{lid}"
        nivel = lei.get("nivel")
        if nivel not in NIVEIS:
            erros.append(f"{p}: nivel inválido {nivel}")
        if lei.get("area") not in AREAS:
            erros.append(f"{p}: área inválida")
        if lei.get("grupo") not in GRUPOS_LEI:
            erros.append(f"{p}: grupo inválido {lei.get('grupo')}")
        for campo in ("nome", "descricao", "dilema", "ministro", "brasil", "historia", "efeitos", "grupos", "fontes"):
            if lei.get(campo) in (None, "", [], {}):
                erros.append(f"{p}: falta {campo}")
        opcoes = lei.get("opcoes") or []
        faixa = lei.get("faixa")
        ids_op = [o.get("id") for o in opcoes]
        if nivel == "macro":
            if lei.get("pai"):
                erros.append(f"{p}: macro não tem pai")
            if not 2 <= len(opcoes) <= 5:
                erros.append(f"{p}: macro precisa de 2 a 5 opções")
            if lei.get("ministro") != "presidencia":
                erros.append(f"{p}: macro é da presidencia")
        else:
            pai = lei.get("pai") or {}
            mae = leis.get(pai.get("lei"))
            if not mae:
                erros.append(f"{p}: pai inexistente {pai.get('lei')}")
            else:
                esperado = "macro" if nivel == "meso" else "meso"
                if mae.get("nivel") != esperado:
                    erros.append(f"{p}: pai {mae['id']} é {mae.get('nivel')}, devia ser {esperado}")
                ops_mae = {o["id"] for o in mae.get("opcoes") or []}
                for o in pai.get("opcoes", []):
                    if o not in ops_mae:
                        erros.append(f"{p}: pai.opcoes '{o}' não é opção de {mae['id']}")
                if not pai.get("opcoes"):
                    erros.append(f"{p}: pai sem opções que liberam")
        if nivel == "meso" and not 2 <= len(opcoes) <= 4:
            erros.append(f"{p}: meso precisa de 2 a 4 opções")
        if nivel == "micro":
            if faixa:
                if faixa.get("unidade") not in UNIDADES:
                    erros.append(f"{p}: unidade da faixa inválida {faixa.get('unidade')}")
                b = lei.get("brasil")
                if not isinstance(b, (int, float)) or not faixa["minimo"] <= b <= faixa["maximo"]:
                    erros.append(f"{p}: valor do Brasil fora da faixa")
            elif len(opcoes) != 2:
                erros.append(f"{p}: micro é faixa ou chave de 2 opções")
        if opcoes:
            if lei.get("brasil") not in ids_op:
                erros.append(f"{p}: brasil '{lei.get('brasil')}' não é opção")
            for o in opcoes:
                if not o.get("no_jogo"):
                    erros.append(f"{p}/{o.get('id')}: falta no_jogo")
        efeitos = lei.get("efeitos") or []
        if not 3 <= len(efeitos) <= 6:
            avisos.append(f"{p}: {len(efeitos)} efeitos (o ideal é 3 a 6)")
        for e in efeitos:
            if e.get("alvo") not in alvos:
                erros.append(f"{p}: efeito em alvo desconhecido {e.get('alvo')}")
        for lado in ("ganham", "perdem"):
            for g in (lei.get("grupos") or {}).get(lado, []):
                if grupos and g not in grupos:
                    erros.append(f"{p}: grupo desconhecido {g}")
        for f in lei.get("fontes") or []:
            if not str(f.get("url", "")).startswith("http"):
                avisos.append(f"{p}: fonte sem URL ({f.get('titulo')})")
        texto = json.dumps({k: v for k, v in lei.items() if k not in ("historia", "fontes", "substitui", "opcoes", "faixa")}, ensure_ascii=False) + json.dumps([{k: v for k, v in o.items() if k != "exemplos"} for o in lei.get("opcoes") or []], ensure_ascii=False)
        achado = PROIBIDOS.search(texto)
        if achado:
            avisos.append(f"{p}: nome próprio do Brasil fora da história ({achado.group(0)})")
        if "—" in texto:
            avisos.append(f"{p}: travessão no texto")

    contagem = {n: sum(1 for l in leis.values() if l.get("nivel") == n) for n in sorted(NIVEIS)}
    print(f"{len(leis)} leis {contagem}; {len(alvos)} alvos; {len(grupos)} grupos")
    for a in avisos:
        print("aviso:", a)
    for e in erros:
        print("ERRO:", e)
    return 1 if erros else 0


if __name__ == "__main__":
    sys.exit(main(Path(sys.argv[1] if len(sys.argv) > 1 else "docs/fichas/v2")))
