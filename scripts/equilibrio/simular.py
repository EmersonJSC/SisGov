#!/usr/bin/env python3
"""Modelo fiscal de referência do desenho das leis (docs/jogo/leis/equilibrio.md).

Não é o motor do jogo: é a conta de bolso que diz se cada estratégia fecha.
Uso: python3 scripts/equilibrio/simular.py
"""
from dataclasses import dataclass, field

ANOS = 8

# ---------------- Laffer: arrecadação de um imposto conforme a alíquota ----
def laffer(t, t0, r0, pico):
    """Arrecadação (% PIB) na alíquota t. r0 na alíquota de partida t0;
    máximo em `pico`; zero em 2*pico."""
    if t0 <= 0:
        return 0.0
    f = lambda x: max(0.0, x * (1 - x / (2 * pico)))
    return r0 * f(t) / f(t0)

# alíquota de partida, arrecadação de partida (% PIB), pico da curva
IMPOSTOS = {
    "renda_pessoas":  (27.5, 2.8, 65),
    "lucro_empresas": (34.0, 3.3, 45),
    "dividendos":     (10.0, 0.4, 50),   # base ≈ 4% do PIB distribuído
    "consumo":        (26.5, 12.5, 45),
    "o_que_faz_mal":  (1.0, 0.5, 3),     # nível 0..3 da regra
    "imoveis":        (0.5, 0.6, 3),
    "veiculos":       (3.0, 0.6, 12),
    "fortunas":       (0.0, 0.0, 4),     # 1% rende ~0,35% do PIB antes da fuga
    "heranca":        (4.0, 0.15, 40),
    "transacoes":     (0.0, 0.0, 1.5),   # 0,38% rende ~1,3% do PIB
    "folha":          (20.0, 5.5, 45),   # contribuição sobre salários
}
FORTUNAS_POR_PONTO = 0.35
TRANSACOES_POR_PONTO = 3.4
RECEITA_FIXA = 6.6        # royalties, taxas, lucro das estatais, estados

GASTO_PARTIDA = {         # % do PIB
    "previdencia": 10.5, "servidores": 6.5, "saude": 4.3, "educacao": 5.0,
    "assistencia": 2.0, "investimento": 1.5, "seguranca_defesa": 2.2,
    "industria": 0.3, "outros": 1.0,
}

@dataclass
class Plano:
    nome: str
    impostos: dict = field(default_factory=dict)   # alíquotas novas
    gasto: dict = field(default_factory=dict)      # variação em pontos do PIB
    meta_inflacao: float = 3.0
    banco_independente: bool = True
    imprimir: float = 0.0          # % do PIB financiado pelo banco central/ano
    privatizacao: float = 0.0      # receita única total (% PIB) em 4 anos
    moratoria: bool = False
    reforma_previdencia: bool = False   # trava o crescimento automático

def receita(p):
    total = RECEITA_FIXA
    for k, (t0, r0, pico) in IMPOSTOS.items():
        t = p.impostos.get(k, t0)
        if k == "fortunas":
            total += FORTUNAS_POR_PONTO * t * max(0.2, 1 - 0.12 * t)  # fuga
        elif k == "transacoes":
            total += TRANSACOES_POR_PONTO * t * max(0.3, 1 - 0.3 * t)
        else:
            total += laffer(t, t0, r0, pico)
    return total

def carga_capital(p):
    """Pontos de alíquota a mais (ou a menos) sobre quem investe."""
    d = 0.0
    for k, peso in (("lucro_empresas", 1.0), ("dividendos", 0.5),
                    ("fortunas", 4.0), ("transacoes", 6.0)):
        t0 = IMPOSTOS[k][0]
        d += peso * (p.impostos.get(k, t0) - t0)
    return d

def simular(p):
    d, pib, preco = 78.0, 100.0, 100.0
    juros_efetivo = 10.0
    risco = 3.0
    linhas = []
    envelhecimento = 0.0
    for ano in range(1, ANOS + 1):
        envelhecimento += 0.0 if p.reforma_previdencia else 0.15
        g_ = dict(GASTO_PARTIDA)
        for k, v in p.gasto.items():
            g_[k] += v
        g_["previdencia"] += envelhecimento
        gasto = sum(g_.values())
        rec = receita(p)
        # crescer acima da tendência formaliza e amplia a base de impostos
        tendencia = 100 * 1.02 ** (ano - 1)
        rec += 0.15 * max(-10.0, (pib / tendencia - 1) * 100)
        primario = rec - gasto

        # crescimento real
        g = 2.0
        rampa = min(1.0, ano / 3)                            # obra leva tempo
        g += 0.55 * p.gasto.get("investimento", 0) * rampa   # obras
        g += 0.70 * p.gasto.get("industria", 0) * rampa      # incentivo à indústria
        g += 0.10 * p.gasto.get("educacao", 0) * min(1, ano / 4)  # devagar
        g -= 0.035 * carga_capital(p)
        g -= 0.04 * (p.impostos.get("consumo", 26.5) - 26.5)
        g -= 0.20 * max(0, risco - 3)                       # juros altos e medo
        if p.moratoria:
            g += -4.0 if ano <= 2 else 0.5
        # inflação
        pi = p.meta_inflacao + 0.4 * max(0, g - 2.5) + 1.5 * p.imprimir * ano  # expectativa acelera
        if not p.banco_independente:
            pi += 1.5
        if p.moratoria and ano <= 2:
            pi += 8
        # risco e juros
        risco = max(0.5, 3.0 + 0.06 * (d - 70) - 1.0 * primario
                    + (6 if p.moratoria and ano <= 3 else 0)
                    + 0.8 * p.imprimir)
        selic = pi + 4.0 + 0.5 * max(0, pi - p.meta_inflacao) + 0.8 * (risco - 3)
        if not p.banco_independente:
            selic -= 2.0
        juros_efetivo += 0.3 * (selic - juros_efetivo)       # dívida roda aos poucos
        priv = p.privatizacao / 4 if ano <= 4 else 0
        d = d * (1 + juros_efetivo / 100) / ((1 + g / 100) * (1 + pi / 100)) \
            - primario - p.imprimir - priv
        if p.moratoria and ano == 1:
            d *= 0.6
        pib *= 1 + g / 100
        linhas.append((ano, rec, gasto, primario, g, pi, selic, d, pib))
    return linhas

PLANOS = [
    Plano("Nada muda"),
    Plano("Austeridade (FHC, Milei)", gasto={"servidores": -1.5, "outros": -1.0},
          reforma_previdencia=True, privatizacao=6),
    Plano("Crescimento com indústria, financiado (JK, Park)",
          gasto={"investimento": 2.0, "industria": 1.0, "servidores": -1.5, "outros": -0.5},
          impostos={"consumo": 28.0, "dividendos": 15}, reforma_previdencia=True),
    Plano("Crescimento com indústria, no fiado",
          gasto={"investimento": 2.0, "industria": 1.0}),
    Plano("Taxar os ricos (Palme)",
          impostos={"renda_pessoas": 45, "dividendos": 30, "heranca": 20, "fortunas": 1.5}),
    Plano("Mais gasto social sem imposto",
          gasto={"assistencia": 2.0, "saude": 1.0, "educacao": 1.0}),
    Plano("Social focado com superávit (Lula 2003)",
          gasto={"assistencia": 0.5, "investimento": 0.5},
          impostos={"renda_pessoas": 35, "dividendos": 20, "heranca": 10, "consumo": 28.0,
                    "transacoes": 0.38},
          reforma_previdencia=True),
    Plano("Estado de bem-estar completo (Palme)",
          gasto={"assistencia": 1.0, "saude": 0.5, "educacao": 0.5, "investimento": 0.5},
          impostos={"renda_pessoas": 45, "dividendos": 30, "heranca": 20, "fortunas": 1.0,
                    "consumo": 30.0},
          reforma_previdencia=True),
    Plano("Desenvolvimentismo social (Estado forte que fecha a conta)",
          gasto={"assistencia": 0.5, "educacao": 0.5, "investimento": 1.5, "industria": 1.0},
          impostos={"renda_pessoas": 45, "dividendos": 30, "heranca": 20, "fortunas": 1.0,
                    "consumo": 30.0},
          reforma_previdencia=True),
    Plano("Mais gasto social com imposto, sem reforma",
          gasto={"assistencia": 1.0, "saude": 0.5, "educacao": 0.5, "investimento": 0.5},
          impostos={"renda_pessoas": 45, "dividendos": 30, "heranca": 20, "fortunas": 1.0}),
    Plano("Corte de impostos (Reagan, Trump)",
          impostos={"lucro_empresas": 21, "renda_pessoas": 20},
          gasto={"seguranca_defesa": 1.0}),
    Plano("Corte de impostos com corte de gasto (Milei)",
          impostos={"lucro_empresas": 25, "consumo": 24},
          gasto={"servidores": -2.0, "outros": -1.0, "industria": -0.3},
          reforma_previdencia=True, privatizacao=8),
    Plano("Imprimir dinheiro (Chávez)", banco_independente=False, imprimir=3.0,
          gasto={"assistencia": 3.0}),
    Plano("Moratória", moratoria=True),
]

if __name__ == "__main__":
    for p in PLANOS:
        l = simular(p)
        a1, a4, a8 = l[0], l[3], l[-1]
        print(f"\n{p.nome}")
        print(f"  receita {a1[1]:.1f}  gasto ano1 {a1[2]:.1f}  primário ano1 {a1[3]:+.1f}  ano8 {a8[3]:+.1f}")
        print(f"  crescimento médio {sum(x[4] for x in l)/len(l):.1f}%   inflação média {sum(x[5] for x in l)/len(l):.1f}%   juros ano8 {a8[6]:.1f}%")
        print(f"  dívida: ano4 {a4[7]:.0f}%  ano8 {a8[7]:.0f}%   PIB ano8 {a8[8]:.0f} (partida 100)")
