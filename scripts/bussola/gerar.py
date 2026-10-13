"""Gera src/conteudo/bussola/referencias.json a partir do V-Party (vdemdata 16.0).
Uso: python3 gerar.py <vparty.RData> > referencias.json"""
import sys, json, rdata, pandas as pd
sys.path.insert(0, __import__('os').path.dirname(__file__))
from pessoas import PESSOAS
from partidos import PARTIDOS, PAISES

df = list(rdata.read_rda(sys.argv[1]).values())[0]
ECO = ['v2pariglef', 'v2pawelf']
CUL = ['v2palgbt', 'v2parelig', 'v2pagender', 'v2paimmig', 'v2paculsup']
d = df.dropna(subset=ECO + CUL + ['v2xpa_antiplural']).copy()
z = lambda s: (s - s.mean()) / s.std()
d['eco'] = z((z(d.v2pariglef) - z(d.v2pawelf)) / 2)
cul = -sum(z(d[c]) for c in CUL) / len(CUL)
d['cos'] = z((z(cul) + z(d.v2xpa_antiplural)) / 2)
ESCALA = 10 / 3  # 3 desvios-padrão = borda da bússola
ponto = lambda v: round(max(-10, min(10, float(v) * ESCALA)), 1)

def linhas(pais, partido, anos):
    return d[(d.country_name == pais) & (d.v2paenname == partido) & (d.year.isin(anos))]

pessoas, sem = [], []
for pid, nome, pais, partido, anos in PESSOAS:
    s = linhas(pais, partido, anos)
    if len(s) == 0:
        sem.append({"id": pid, "nome": nome, "pais": PAISES.get(pais, pais),
                    "motivo": "o V-Party não mede o partido dele nos anos em que governou ou liderou"})
        continue
    pessoas.append({"id": pid, "nome": nome, "pais": PAISES[pais], "partido": s.v2pashname.iloc[0] or partido,
                    "partidoNaFonte": partido, "anos": sorted(int(a) for a in s.year),
                    "economia": ponto(s.eco.mean()), "costumes": ponto(s.cos.mean())})
partidos = []
for pid, rot, pais, partido, ano in PARTIDOS:
    s = linhas(pais, partido, [ano])
    assert len(s) == 1, pid
    partidos.append({"id": pid, "nome": rot, "pais": PAISES[pais], "partidoNaFonte": partido,
                     "anos": [ano], "economia": ponto(s.eco.iloc[0]), "costumes": ponto(s.cos.iloc[0])})
for pid, nome, pais in [("sanders", "Bernie Sanders", "Estados Unidos"), ("milei", "Javier Milei", "Argentina"),
                         ("psol", "PSOL", "Brasil"), ("pcdob", "PCdoB", "Brasil"), ("novo", "Novo", "Brasil")]:
    sem.append({"id": pid, "nome": nome, "pais": pais, "motivo": {
        "sanders": "nunca liderou um partido; o V-Party mede partidos, não pessoas",
        "milei": "o partido dele surgiu depois de 2019, último ano da base",
    }.get(pid, "partido pequeno demais para entrar na base (menos de 5% das cadeiras)")})
print(json.dumps({
    "tipo": "referencias-bussola", "versaoEsquema": 1,
    "fonte": {
        "nome": "V-Party, Varieties of Party Identity and Organization (V-Dem Institute)",
        "versao": "pacote vdemdata 16.0 (github.com/vdeminstitute/vdemdata), dados de 1970 a 2019",
        "citacao": "Lührmann, A. et al. Varieties of Party Identity and Organization (V-Party) Dataset. V-Dem Institute.",
    },
    "metodo": {
        "economia": "média de v2pariglef (esquerda e direita econômica) e de v2pawelf com sinal trocado (apoio ao Estado de bem-estar), cada um padronizado; + é mercado",
        "costumes": "média de dois blocos padronizados: valores (v2palgbt, v2parelig, v2pagender, v2paimmig e v2paculsup, todos com sinal trocado) e antipluralismo (v2xpa_antiplural); + é autoridade",
        "escala": "padronizado sobre todos os partidos e anos da base com os oito itens; 3 desvios-padrão = borda (±10)",
        "personalidade": "média do partido dela nos anos de eleição em que governou ou liderou o partido",
    },
    "personalidades": sorted(pessoas, key=lambda p: p["economia"]),
    "partidos": partidos,
    "semMedida": sem,
}, ensure_ascii=False, indent=2))
