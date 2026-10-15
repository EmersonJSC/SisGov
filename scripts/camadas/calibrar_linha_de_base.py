#!/usr/bin/env python3
"""Mantém a linha de base do Brasil depois da troca de Economia (V1-34).

Os índices do Brasil foram calibrados com as consequências antigas ligadas nos
níveis de partida das leis antigas (soma de coeficiente × nível + termo, por
alvo). Trocar as leis sem repor essa soma desloca todos os índices.

Para cada alvo, este script calcula:
  antes  = soma das consequências afins antigas (arquivadas) nos níveis antigos
  depois = soma das novas (saida/consequencias) nos níveis novos do Brasil
e soma (antes − depois) ao `termoConstante` de uma consequência nova do alvo;
sem consequência nova no alvo, cria `calibracao-economia--<alvo>` com
coeficiente 0, ligada a uma lei de Economia em vigor, só com o termo.
É hipótese de calibração (marcada no id), não efeito de lei. As consequências
antigas de mecanismo `limiar` e `pontos` não entram na conta (listadas).
Idempotente: parte sempre dos arquivos de saida/.
"""
import json, subprocess, shutil
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
CONT = RAIZ / "src" / "conteudo"
SAIDA = Path(__file__).resolve().parent / "saida"
ARQ = CONT / "_arquivo-leis-antigas"
CONS = CONT / "mundo" / "consequencias"


def main():
    antigos_f = ARQ / "controles-antigos.json"
    if not antigos_f.exists():
        antigos_f.write_text(subprocess.check_output(
            ["git", "show", "HEAD:src/conteudo/paises/brasil/leis.json"], cwd=RAIZ).decode(), encoding="utf-8")
    old_ctrl = json.loads(antigos_f.read_text(encoding="utf-8"))["controles"]
    novos_ctrl = json.loads((CONT / "paises/brasil/leis.json").read_text(encoding="utf-8"))["controles"]
    antes, ignoradas = {}, []
    for f in (ARQ / "consequencias").glob("*.json"):
        d = json.loads(f.read_text(encoding="utf-8"))
        if d["origem"] not in old_ctrl:
            continue
        if d["mecanismo"] != "afim":
            ignoradas.append(f.name)
            continue
        p = d["parametros"]
        antes[d["alvo"]] = antes.get(d["alvo"], 0) + p["coeficiente"] * old_ctrl[d["origem"]] + p.get("termoConstante", 0)
    # restaura as novas dos originais e remove calibrações anteriores
    for f in CONS.glob("calibracao-economia--*.json"):
        f.unlink()
    novas = {}
    for f in (SAIDA / "consequencias").glob("*.json"):
        if f.name.startswith("tarifas-de-importacao--"):
            continue  # fica a lei antiga (ver trocar_area.py)
        shutil.copy(f, CONS / f.name)
        d = json.loads(f.read_text(encoding="utf-8"))
        novas.setdefault(d["alvo"], []).append((f.name, d))
    depois = {a: sum(d["parametros"]["coeficiente"] * novos_ctrl.get(d["origem"], 0) for _, d in v) for a, v in novas.items()}
    ancora = "nivel_propriedade_dos_meios_de_producao"
    criadas = []
    for alvo in sorted(set(antes) | set(depois)):
        if alvo.startswith("grupo_"):
            continue  # grupos: o contexto do cenário absorve a linha de base; uma lei liga uma vez por grupo
        delta = antes.get(alvo, 0) - depois.get(alvo, 0)
        if abs(delta) < 1e-9:
            continue
        ativas = [x for x in novas.get(alvo, []) if x[1]["origem"] in novos_ctrl]  # lei em vigor
        if ativas:
            nome, d = ativas[0]
            d["parametros"]["termoConstante"] = round(d["parametros"].get("termoConstante", 0) + delta, 6)
            (CONS / nome).write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        else:
            unidade = "indice_0_100"
            v = {x["id"]: x for x in json.loads((CONT / "mundo/indicadores/variaveis.json").read_text(encoding="utf-8"))["variaveis"]}
            if alvo in v:
                unidade = v[alvo]["unidade"] + ("_por_passo" if v[alvo]["tipo"] == "estoque" else "")
            nid = f"calibracao-economia--{alvo.replace('_', '-')}"
            d = {"id": nid, "tipo": "consequencia", "versaoEsquema": 1, "origem": ancora, "alvo": alvo,
                 "mecanismo": "afim", "parametros": {"coeficiente": 0, "termoConstante": round(delta, 6)},
                 "unidade": unidade, "atrasoPassos": 0, "duracao": {"modo": "continuo"}}
            (CONS / f"{nid}.json").write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            criadas.append(nid)
    ancora_f = CONT / "mundo/leis/propriedade-dos-meios-de-producao.json"
    ancora_lei = json.loads(ancora_f.read_text(encoding="utf-8"))
    ancora_lei["consequencias"] = [c for c in ancora_lei["consequencias"] if not c.startswith("calibracao-economia--")] + criadas
    ancora_f.write_text(json.dumps(ancora_lei, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    mu = json.loads((CONT / "mundo/mundo.json").read_text(encoding="utf-8"))
    mu["consequencias"] = [c for c in mu["consequencias"] if "calibracao-economia--" not in c]
    mu["consequencias"] += [f"mundo/consequencias/{n}.json" for n in criadas]
    mu["consequencias"] = list(dict.fromkeys(mu["consequencias"]))
    (CONT / "mundo/mundo.json").write_text(json.dumps(mu, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"alvos: {len(set(antes)|set(depois))}; calibrações criadas: {len(criadas)}; antigas ignoradas (limiar/pontos): {len(ignoradas)}")


main()
