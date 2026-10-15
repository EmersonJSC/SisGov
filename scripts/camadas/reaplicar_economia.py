#!/usr/bin/env python3
"""Reaplica a saída do gerador sobre a Economia já trocada (V1-34).

Depois de `gerar_leis.py --area 1`: copia as 28 leis e as consequências novas,
funde nas leis que já existiam (petróleo, tarifas) as consequências antigas,
refaz a partida do Brasil a partir de brasil.json e a bússola a partir de
lados.json, porta os campos antigos e recalibra a linha de base.
Pressupõe que `trocar_area.py --aplicar` já rodou uma vez."""
import json, shutil, subprocess, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
CONT = RAIZ / "src" / "conteudo"
SAIDA = Path(__file__).resolve().parent / "saida"
ARQ = CONT / "_arquivo-leis-antigas"
FUNDIR = ("regime-do-petroleo-e-mineracao", "tarifas-de-importacao")  # já tinham consequências ligadas


def ler(p): return json.loads(Path(p).read_text(encoding="utf-8"))
def gravar(p, d): Path(p).write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def antiga(lei):
    f = ARQ / "leis" / f"{lei}.json"
    if f.exists():
        return ler(f)
    return json.loads(subprocess.check_output(["git", "show", f"HEAD:src/conteudo/mundo/leis/{lei}.json"], cwd=RAIZ))


for lei in FUNDIR:  # guarda a antiga no arquivo (cópia, nunca apaga)
    f = ARQ / "leis" / f"{lei}.json"
    if not f.exists():
        gravar(f, antiga(lei))
atuais = {l: ler(CONT / "mundo" / "leis" / f"{l}.json") for l in FUNDIR}
# 0. hipóteses antigas que a nova geração não faz mais: vão para o arquivo (mv)
(ARQ / "hipoteses-substituidas").mkdir(exist_ok=True)
novas_ids = {p.stem for p in (SAIDA / "leis").glob("*.json")}
vindas_agora = {p.name for p in (SAIDA / "consequencias").glob("*.json")}
for cf in list((CONT / "mundo" / "consequencias").glob("*.json")):
    lei = cf.name.split("--")[0]
    if lei in novas_ids and lei not in FUNDIR and cf.name not in vindas_agora:
        shutil.move(str(cf), str(ARQ / "hipoteses-substituidas" / cf.name))
# 1. leis e consequências novas
for p in (SAIDA / "leis").glob("*.json"):
    shutil.copy(p, CONT / "mundo" / "leis" / p.name)
for p in (SAIDA / "consequencias").glob("*.json"):
    if p.name.split("--")[0] in FUNDIR:
        continue  # as dessas duas entram abaixo, só nos alvos que a antiga não cobre
    shutil.copy(p, CONT / "mundo" / "consequencias" / p.name)
mu = ler(CONT / "mundo" / "mundo.json")
for lei in FUNDIR:
    velha, nova = antiga(lei), ler(CONT / "mundo" / "leis" / f"{lei}.json")
    def alvo(i):
        for d in (CONT / "mundo" / "consequencias", SAIDA / "consequencias"):
            if (d / f"{i}.json").exists():
                return ler(d / f"{i}.json")["alvo"]
    alvos_velhos = {alvo(i) for i in velha.get("consequencias", [])}
    lista = list(velha.get("consequencias", []))
    for i in nova["consequencias"]:
        if i not in lista and alvo(i) not in alvos_velhos:
            shutil.copy(SAIDA / "consequencias" / f"{i}.json", CONT / "mundo" / "consequencias" / f"{i}.json")
            caminho = f"mundo/consequencias/{i}.json"
            if caminho not in mu["consequencias"]:
                mu["consequencias"].append(caminho)
            lista.append(i)
    nova["consequencias"] = lista
    for k in ("respostaTemporal", "requer"):
        if k in velha and k not in nova:
            nova[k] = velha[k]
    gravar(CONT / "mundo" / "leis" / f"{lei}.json", nova)
mu["consequencias"] = [c for c in dict.fromkeys(mu["consequencias"]) if (CONT / c).exists()]
gravar(CONT / "mundo" / "mundo.json", mu)
# 2. partida do Brasil
brasil = ler(SAIDA / "brasil.json")
pl = ler(CONT / "paises" / "brasil" / "leis.json")
vig = {e["lei"]: e for e in pl["emVigor"]}
for lei, op in brasil.items():
    vig[lei] = {"lei": lei, "opcao": op}
    nl = ler(CONT / "mundo" / "leis" / f"{lei}.json")
    pl["controles"][nl["controle"]["variavel"]] = {o["id"]: o["valor"] for o in nl["controle"]["opcoes"]}[op]
pl["emVigor"] = list(vig.values())
gravar(CONT / "paises" / "brasil" / "leis.json", pl)
# 3. bússola: pares antigo -> novo mantêm o vetor curado da lei antiga (com as
# opções renomeadas pelo mapa); as leis novas usam o lado da ficha.
bu = ler(CONT / "mundo" / "bussola.json")
mapa = ler(SAIDA / "mapa-01.json")
bu_antigo = json.loads(subprocess.check_output(["git", "show", "HEAD:src/conteudo/mundo/bussola.json"], cwd=RAIZ))["leis"]
for lei, d in ler(SAIDA / "lados.json")["leis"].items():
    bu["leis"][lei] = {"manifesto": [], "porque": "Lado da ficha da lei (hipótese do estudo, V1-34).", "opcoes": d["opcoes"]}
for velho, novo in mapa["leis"].items():
    e = bu_antigo.get(velho)
    if not e:
        continue
    e = json.loads(json.dumps(e))
    tab = mapa["opcoes"].get(velho, {})
    if "opcoes" in e and "_por_faixa" not in tab:
        e["opcoes"] = {tab.get(k, k): v for k, v in e["opcoes"].items()}
        bu["leis"][novo] = e
    elif "faixa" in e and novo != "tarifas-de-importacao":
        bu["leis"][novo] = e
    if velho != novo:
        bu["leis"].pop(velho, None)
gravar(CONT / "mundo" / "bussola.json", bu)
# lei filha no formato antigo (cai para a base): mantém o comportamento testado
f = CONT / "mundo" / "leis" / "mandato-do-banco-central.json"
d = ler(f); d.pop("nivelLegal", None); gravar(f, d)
# ministério de cada lei nova (o mapa lê o campo `ministerio` da lei)
po = ler(CONT / "paises" / "brasil" / "politica.json")
for m in po["ministerios"]["ministerios"]:
    for lei in m["leis"]:
        f = CONT / "mundo" / "leis" / f"{lei}.json"
        if f.exists():
            d = ler(f)
            if "ministerio" not in d:
                d["ministerio"] = m["nome"]
                gravar(f, d)
print("reaplicado")
