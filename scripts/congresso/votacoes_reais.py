"""
Votações nominais reais da Câmara (dados abertos) para a prova do voto
(docs/v1/desenho/congresso.md, seção 5.4).

Uso:
  python3 scripts/congresso/votacoes_reais.py buscar PALAVRA [PALAVRA...]
      lista votações nominais cuja descrição ou proposição tem as palavras
  python3 scripts/congresso/votacoes_reais.py resumir ID [ID...]
      mostra, por grupo (esquerda, centro, direita), quantos votaram sim e não

Lê os CSV de dados/camara/ (votacoes-AAAA.csv e votacoesVotos-AAAA.csv),
baixados de https://dadosabertos.camara.leg.br/arquivos/.
"""
import csv
import glob
import json
import os
import sys
import unicodedata

PASTA = os.path.join(os.path.dirname(__file__), "..", "..", "dados", "camara")

# Mesmos grupos da prova das cadeiras (bussola/congresso.json).
GRUPOS = {
    "esquerda": ["PT", "PCDOB", "PV", "PSB", "PSOL", "REDE", "PDT"],
    "direita": ["PL", "NOVO", "MISSAO"],
}


def sem_acento(texto):
    return (
        unicodedata.normalize("NFKD", texto)
        .encode("ascii", "ignore")
        .decode()
        .upper()
    )


def grupo_do(partido):
    p = sem_acento(partido).replace(" ", "")
    for grupo, lista in GRUPOS.items():
        if p in lista:
            return grupo
    return "centro"


def linhas(padrao):
    for caminho in sorted(glob.glob(os.path.join(PASTA, padrao))):
        with open(caminho, encoding="utf-8-sig", newline="") as f:
            yield from csv.DictReader(f, delimiter=";")


def campo(linha, *nomes):
    for n in nomes:
        if n in linha and linha[n]:
            return linha[n]
    return ""


def buscar(palavras):
    alvo = [sem_acento(p) for p in palavras]
    for v in linhas("votacoes-*.csv"):
        texto = sem_acento(
            " ".join(
                campo(v, k)
                for k in v
                if "descricao" in k.lower() or "ementa" in k.lower()
            )
        )
        sim = campo(v, "votosSim")
        if all(a in texto for a in alvo) and sim not in ("", "0"):
            print(
                campo(v, "id"),
                campo(v, "data"),
                f"sim {sim} não {campo(v, 'votosNao')}",
                "|",
                campo(v, "descricao")[:160],
            )


def resumir(ids):
    quero = set(ids)
    placar = {i: {} for i in ids}
    for voto in linhas("votacoesVotos-*.csv"):
        i = campo(voto, "idVotacao")
        if i not in quero:
            continue
        g = grupo_do(campo(voto, "deputado_siglaPartido"))
        v = sem_acento(campo(voto, "voto"))
        conta = placar[i].setdefault(g, {"sim": 0, "nao": 0, "outros": 0})
        if v == "SIM":
            conta["sim"] += 1
        elif v == "NAO":
            conta["nao"] += 1
        else:
            conta["outros"] += 1
    print(json.dumps(placar, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    comando, *resto = sys.argv[1:] or ["ajuda"]
    if comando == "buscar":
        buscar(resto)
    elif comando == "resumir":
        resumir(resto)
    else:
        print(__doc__)
