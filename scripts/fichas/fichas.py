#!/usr/bin/env python3
"""Fichas de lei do SisGov: checagem por regras e documento.

Uso:
  python3 scripts/fichas/fichas.py checar      # aplica as regras do METODO
  python3 scripts/fichas/fichas.py documento   # gera docs/fichas/LEIS.md

As fichas ficam em docs/fichas/areas/*.json. Nada aqui usa IA.
"""

from __future__ import annotations

import json
import sys
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path

PASTA = Path(__file__).resolve().parents[2] / "docs" / "fichas"
if not (PASTA / "catalogo.json").exists():  # rodando fora do repositório
    PASTA = Path(__file__).resolve().parent

GRUPOS_LEI = {"orcamentaria", "regulatoria", "tributaria", "institucional"}
SINAIS = {"+", "-"}
FORCAS = {"fraca", "media", "forte"}
ATRASOS = {"imediato", "meses", "anos"}
MIN_OPCOES = {"regulatoria": 3, "institucional": 2}


def carregar():
    catalogo = json.loads((PASTA / "catalogo.json").read_text(encoding="utf-8"))
    areas = {}
    for arq in sorted((PASTA / "areas").glob("*.json")):
        areas[arq.stem] = json.loads(arq.read_text(encoding="utf-8"))
    return catalogo, areas


def normal(texto: str) -> str:
    t = unicodedata.normalize("NFD", texto.lower())
    return "".join(c for c in t if c.isalnum())


def indexar(catalogo, areas):
    bolhas = {}
    for chave in ("bolhas_existentes", "bolhas_pilares_aprovadas", "bolhas_sugeridas"):
        bolhas.update(catalogo[chave])
    novas = {}
    for area in areas.values():
        for b in area.get("novas_bolhas", []):
            novas.setdefault(b["id"], b)
    leis = {}
    for nome_area, area in areas.items():
        for lei in area["leis"]:
            leis.setdefault(lei["id"], []).append((nome_area, lei))
    existentes = set(catalogo["leis_que_ja_existem"])
    return bolhas, novas, leis, existentes


def checar_lei(lei, bolhas, novas, todas_leis, existentes, grupos):
    erros, avisos = [], []
    for campo in ("id", "nome", "grupo", "descricao", "dilema", "eixo", "efeitos", "grupos"):
        if not lei.get(campo):
            erros.append(f"campo ausente: {campo}")
    grupo = lei.get("grupo")
    if grupo not in GRUPOS_LEI:
        erros.append(f"grupo inválido: {grupo}")
    opcoes = lei.get("opcoes") or []
    faixa = lei.get("faixa")
    if grupo in MIN_OPCOES:
        if len(opcoes) < MIN_OPCOES[grupo]:
            erros.append(f"{grupo} com {len(opcoes)} opções (mínimo {MIN_OPCOES[grupo]})")
        ids_op = [o.get("id") for o in opcoes]
        if lei.get("brasil") not in ids_op:
            erros.append(f"brasil={lei.get('brasil')!r} não é opção")
        for o in opcoes:
            if not o.get("manchete"):
                avisos.append(f"opção {o.get('id')} sem manchete")
    else:
        if not isinstance(faixa, dict):
            erros.append("orçamentária/tributária sem faixa")
        else:
            b = lei.get("brasil")
            if not isinstance(b, (int, float)) or not (faixa.get("minimo", -1e9) <= b <= faixa.get("maximo", 1e9)):
                erros.append(f"brasil={b!r} fora da faixa")
    efeitos = lei.get("efeitos") or []
    if not 3 <= len(efeitos) <= 8:
        avisos.append(f"{len(efeitos)} efeitos (esperado 3 a 8)")
    for e in efeitos:
        if e.get("alvo") not in bolhas and e.get("alvo") not in novas:
            erros.append(f"alvo desconhecido: {e.get('alvo')}")
        if e.get("sinal") not in SINAIS or e.get("forca") not in FORCAS or e.get("atraso") not in ATRASOS:
            erros.append(f"efeito mal formado em {e.get('alvo')}")
        if not e.get("porque"):
            avisos.append(f"efeito sem porque: {e.get('alvo')}")
    g = lei.get("grupos") or {}
    for lado in ("ganham", "perdem"):
        if not g.get(lado):
            erros.append(f"nenhum grupo que {lado[:-1]}")
        for gid in g.get(lado, []):
            if gid not in grupos:
                erros.append(f"grupo desconhecido: {gid}")
    mae = lei.get("mae")
    if mae:
        mid = mae.get("lei")
        if mid in todas_leis:
            mae_lei = todas_leis[mid][0][1]
            ops_mae = {o.get("id") for o in (mae_lei.get("opcoes") or [])}
            for op in mae.get("opcoes") or []:
                if ops_mae and op not in ops_mae:
                    erros.append(f"mãe {mid} não tem a opção {op}")
        elif mid not in existentes:
            avisos.append(f"mãe ainda sem ficha: {mid}")
    return erros, avisos


def contradicoes(leis):
    """Leis que dizem o oposto sobre o mesmo alvo dentro da mesma lei, sem condição."""
    achados = []
    for lid, ocorr in leis.items():
        lei = ocorr[0][1]
        por_alvo = defaultdict(set)
        for e in lei.get("efeitos", []):
            if not e.get("condicao"):
                por_alvo[e.get("alvo")].add(e.get("sinal"))
        for alvo, sinais in por_alvo.items():
            if len(sinais) > 1:
                achados.append(f"{lid}: sobe e cai {alvo} sem condição")
    return achados


def cmd_checar() -> int:
    catalogo, areas = carregar()
    bolhas, novas, leis, existentes = indexar(catalogo, areas)
    grupos = set(catalogo["grupos_sociais"])
    total_erros = 0
    for lid, ocorr in sorted(leis.items()):
        if len(ocorr) > 1:
            print(f"✗ {lid}: repetida em {[a for a, _ in ocorr]}")
            total_erros += 1
        erros, avisos = checar_lei(ocorr[0][1], bolhas, novas, leis, existentes, grupos)
        for e in erros:
            print(f"✗ {lid}: {e}")
        total_erros += len(erros)
        for a in avisos:
            print(f"· {lid}: {a}")
    nomes = Counter(normal(l[0][1].get("nome", "")) for l in leis.values())
    for n, c in nomes.items():
        if c > 1:
            print(f"✗ nome repetido: {n}")
            total_erros += 1
    for b in novas:
        if b in bolhas:
            print(f"· bolha nova {b} já está no catálogo")
    for c in contradicoes(leis):
        print(f"? {c}")
    citadas = set()
    for ocorr in leis.values():
        citadas.update(ocorr[0][1].get("filhas") or [])
        if ocorr[0][1].get("mae"):
            citadas.add(ocorr[0][1]["mae"]["lei"])
    abertas = sorted(citadas - set(leis) - existentes)
    print(f"\n{len(leis)} leis · {len(novas)} bolhas novas · {len(abertas)} fichas abertas · {total_erros} erros")
    return 1 if total_erros else 0


ROTULO_GRUPO = {"orcamentaria": "Orçamentária", "regulatoria": "Regulatória",
                "tributaria": "Tributária", "institucional": "Institucional"}
SETA = {"+": "↑", "-": "↓"}


def cmd_documento() -> int:
    catalogo, areas = carregar()
    bolhas, novas, leis, existentes = indexar(catalogo, areas)
    nome_bolha = {**bolhas, **{k: v.get("nome", k) for k, v in novas.items()}}
    nome_grupo = catalogo["grupos_sociais"]
    filhos = defaultdict(list)
    for lid, ocorr in leis.items():
        if ocorr[0][1].get("mae"):
            filhos[ocorr[0][1]["mae"]["lei"]].append(lid)
    out = ["# Leis do SisGov", "",
           "_Gerado por `scripts/fichas/fichas.py documento` a partir de `docs/fichas/areas/*.json`. "
           "Não edite à mão: edite a ficha e gere de novo._", "",
           f"**{len(leis)} leis** em {len(areas)} áreas · **{len(novas)} bolhas novas** propostas.", "",
           "Legenda: ↑ sobe · ↓ cai · força fraca/média/forte · atraso imediato/meses/anos.", ""]
    out.append("## Índice")
    out.append("")
    for nome_area, area in areas.items():
        ids = ", ".join(f"[{l['nome']}](#{l['id']})" for l in area["leis"])
        out.append(f"- **{area['area']}:** {ids}")
    out.append("")
    for nome_area, area in areas.items():
        out += [f"## {area['area']}", ""]
        for lei in area["leis"]:
            out.append(f'<a id="{lei["id"]}"></a>')
            out += [f"### {lei['nome']}", "",
                    f"*{ROTULO_GRUPO.get(lei['grupo'], lei['grupo'])}* · {lei.get('ministerio', '')}", "",
                    lei["descricao"], "", f"> **Dilema:** {lei['dilema']}", ""]
            if lei.get("opcoes"):
                out += [f"**Opções** ({lei.get('eixo', '')}):", "",
                        "| Opção | Manchete | No mundo |", "|---|---|---|"]
                for o in lei["opcoes"]:
                    marca = " **(Brasil)**" if o["id"] == lei.get("brasil") else ""
                    ex = "; ".join(o.get("exemplos", []))
                    out.append(f"| {o['rotulo']}{marca} | {o.get('manchete', '')} | {ex} |")
            elif lei.get("faixa"):
                f = lei["faixa"]
                ex = "; ".join(f"{e.get('pais')} {e.get('valor')}" for e in f.get("exemplos", []))
                out.append(f"**Faixa:** {f.get('minimo')} a {f.get('maximo')} ({f.get('unidade')}) · "
                           f"**Brasil:** {lei.get('brasil')} · No mundo: {ex}")
            out.append("")
            out += ["**Efeitos** (ao avançar no eixo):", ""]
            for e in lei["efeitos"]:
                cond = f" _(só {e['condicao']})_" if e.get("condicao") else ""
                out.append(f"- {SETA.get(e['sinal'], e['sinal'])} **{nome_bolha.get(e['alvo'], e['alvo'])}**"
                           f" · {e['forca']} · {e['atraso']}{cond}: {e.get('porque', '')}")
            g = lei["grupos"]
            out += ["", "**Ganham:** " + ", ".join(nome_grupo.get(x, x) for x in g.get("ganham", [])) +
                    " · **Perdem:** " + ", ".join(nome_grupo.get(x, x) for x in g.get("perdem", []))]
            rel = []
            if lei.get("mae"):
                ops = lei["mae"].get("opcoes")
                rel.append(f"**Mãe:** {lei['mae']['lei']}" + (f" (só em {', '.join(ops)})" if ops else ""))
            fl = sorted(set((lei.get("filhas") or []) + filhos.get(lei["id"], [])))
            if fl:
                rel.append("**Filhas:** " + ", ".join(fl))
            if rel:
                out += ["", " · ".join(rel)]
            if lei.get("fontes"):
                out += ["", "Fontes: " + " · ".join(f"[{s['titulo']}]({s['url']})" for s in lei["fontes"])]
            out.append("")
    out += ["## Bolhas novas propostas", "", "| Bolha | Tipo | Por quê |", "|---|---|---|"]
    for bid, b in sorted(novas.items()):
        out.append(f"| {b.get('nome', bid)} (`{bid}`) | {b.get('tipo', '')} | {b.get('porque', '')} |")
    citadas = set()
    for ocorr in leis.values():
        citadas.update(ocorr[0][1].get("filhas") or [])
    abertas = sorted(citadas - set(leis) - existentes)
    out += ["", "## Fichas abertas (citadas, ainda sem ficha)", "", ", ".join(abertas) + ".", ""]
    destino = PASTA / "LEIS.md"
    destino.write_text("\n".join(out), encoding="utf-8")
    print(f"gravado {destino}")
    return 0


if __name__ == "__main__":
    comando = sys.argv[1] if len(sys.argv) > 1 else "checar"
    sys.exit({"checar": cmd_checar, "documento": cmd_documento}[comando]())
