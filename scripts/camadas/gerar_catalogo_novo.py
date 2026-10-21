#!/usr/bin/env python3
"""Gera docs/v1/desenho/catalogo-novo.md (V1-36): o catálogo como proposta,
por área, com o que muda em relação ao jogo de hoje. Lê os JSONs das leis e
a distribuição por esfera de `paises/brasil/politica.json`."""
import glob, json, re
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
CONT = RAIZ / "src" / "conteudo"
ESFERA = {"economia": "Economia", "empresas": "Empresas e comércio", "trabalho": "Trabalho e emprego",
          "previdencia": "Previdência e assistência", "saude": "Saúde e esporte", "educacao": "Educação e cultura",
          "infraestrutura": "Infraestrutura", "ambiente": "Meio ambiente", "seguranca": "Segurança e justiça",
          "direitos": "Direitos e cidadania", "governo": "Governo e instituições", "defesa": "Defesa e relações exteriores (nova)"}
ORDEM = list(ESFERA)

# --- mudanças propostas -----------------------------------------------------
DEFESA = """acordos-comerciais alianca-militar alinhamento-externo controle-civil-das-forcas-armadas cooperacao-internacional
exportacao-de-armas gasto-com-defesa industria-de-defesa integracao-regional investimento-em-defesa missoes-de-paz
papel-das-forcas-armadas politica-de-imigracao politica-de-sancoes programa-nuclear-lei protecao-de-fronteiras
protecao-social-dos-militares rede-diplomatica saida-do-pais servico-militar tribunais-e-tratados-internacionais""".split()
PARA_ECONOMIA = "taxa-basica-de-juros valor-da-meta-de-inflacao intervencao-cambial tarifas-de-importacao banco-de-desenvolvimento".split()
PARA_SAUDE = ["imposto-seletivo"]
PARA_AMBIENTE = "credito-rural-e-assistencia-tecnica fiscalizacao-ambiental protecao-da-vegetacao-nativa-nas-propriedades-rurais".split()
PARA_DIREITOS = ["apostas-e-jogos-de-azar"]
JUNTAS = {
    "regra-de-reajuste-dos-beneficios": ("reajuste-de-beneficios", "a mesma regra"),
    "transferencia-de-renda-as-familias-pobres": ("transferencia-de-renda", "lei (regra) + alavanca (verba)"),
    "piso-de-gasto-em-educacao": ("piso-educacao", "lei (regra) + alavanca (valor)"),
    "verba-da-saude-acima-do-piso": ("piso-saude", "lei (regra) + alavanca (valor)"),
    "verba-do-programa-habitacional": ("programa-habitacao-popular", "a verba é a alavanca do programa"),
    "como-o-estado-entrega-casa": ("habitacao-publica", "mesma mesa"),
    "imposto-sobre-a-propriedade": ("imposto-propriedade-urbana-rural", "mesma regra"),
    "tributacao-do-lucro-distribuido-e-da-renda-guardada-no-exter": ("tributacao-dividendos", "mesma regra"),
}
SAI = {"nacionalizacao": "vira o processo de cada setor (seção 2)",
       "programa-de-privatizacao": "vira o processo de cada setor (seção 2)",
       "propriedade-dos-meios-de-producao": "ideologia: sai; o termômetro do rumo substitui (seção 2)",
       "planejamento-da-economia": "ideologia: sai; o termômetro do rumo substitui (seção 2)"}

leis = {}
for f in glob.glob(str(CONT / "mundo/leis/*.json")):
    d = json.loads(Path(f).read_text(encoding="utf-8"))
    leis[d["id"]] = d
po = json.loads((CONT / "paises/brasil/politica.json").read_text(encoding="utf-8"))
esfera_de = {l: m["area"] for m in po["ministerios"]["ministerios"] for l in m["leis"]}
proposta = dict(esfera_de)
tag = {}
for i in DEFESA:
    proposta[i] = "defesa"; tag[i] = "MOVE → nova esfera Defesa"
for i in PARA_ECONOMIA:
    proposta[i] = "economia"; tag[i] = "MOVE → Economia (política macro)"
for i in PARA_SAUDE:
    proposta[i] = "saude"; tag[i] = "MOVE → Saúde (imposto de saúde pública)"
for i in PARA_AMBIENTE:
    proposta[i] = "ambiente"; tag[i] = "MOVE → Meio ambiente"
for i in PARA_DIREITOS:
    proposta[i] = "direitos"; tag[i] = "MOVE → Direitos (mesa das apostas)"
for novo, (velho, motivo) in JUNTAS.items():
    tag[novo] = f"JUNTA com `{velho}`: {motivo}"
    tag[velho] = f"JUNTA em `{novo}`"
for i, motivo in SAI.items():
    tag[i] = f"SAI: {motivo}"

def controle(d):
    n = len(d["controle"].get("opcoes", []))
    if n >= 3: return f"deslizador, {n} degraus"
    if n == 2: return "2 botões"
    return "valor (faixa)"

def frase(d):
    t = re.sub(r"\s+", " ", d.get("descricao", "")).strip()
    m = re.search(r"[.?!](\s|$)", t)
    t = t[: m.end()] if m else t
    return (t[:137] + "…") if len(t) > 140 else t

CAMADA = {"constituicao": "Constituição", "lei": "Lei", "alavanca": "Alavanca"}
out = []
w = out.append
w("# Catálogo novo: proposta para revisão (V1-36)\n")
w("**Status:** PROPOSTA (15/out/2026). Nada disto está no jogo. Gerado por `scripts/camadas/gerar_catalogo_novo.py` a partir das leis atuais, com as mudanças marcadas.\n")
w("## 1. Regras\n")
w("""- **Leis do mundo.** Nenhuma lei, nome ou texto é do Brasil. O país só declara o estado inicial (D-03, D-04, D-38). Cada lei diz o que faz para qualquer país.
- **Cada lei de uma área vive na esfera da área.** A economia de saúde fica em Saúde, a de previdência em Previdência; **Economia só com o geral**: moeda, juros, câmbio, dívida e as regras fiscais e tributárias gerais.
- **Equilíbrio.** Nenhuma esfera com mais que o dobro da média nem com menos que a metade (média de hoje: 22). Hoje Segurança tem 48 e Ambiente 6.
- **Controle.** Toda lei com valores ordenados é um **deslizador com degraus** (o jogador sente aumentar e diminuir). Botões só para 2 opções ou escolhas sem ordem.
- **Processos, não botões nem ideologias.** Estatizar, privatizar, reformar: o jogo acompanha o processo (estoque que se move por etapas, com custo e reações). Ninguém escolhe "ser socialista" ou "liberal": isso é só um termômetro calculado (seção 2).
- **Marcas:** JUNTA (duas viram uma), SEPARA (uma vira várias), MOVE (muda de esfera), NOVO, SAI.
""")
w("## 2. Estatização e privatização: um processo, não uma lei nem uma ideologia\n")
w("""**Correção (autor, 15/out).** Socialismo e liberalismo não são botões nem leis que o jogador escolhe: são **resultados** de um processo que o jogo acompanha. Ninguém "escolhe ser socialista". O jogador age sobre setores, e o país vai ficando mais estatal ou mais privado. Portanto saem do jogo as escolhas com nome de ideologia (hoje `propriedade-dos-meios-de-producao`: privada, mista, socialista; `planejamento-da-economia`) e a lei única de privatizar ou estatizar.

**Como fica o processo (por setor).**

1. **Participação do Estado em cada setor é um estoque (0% a 100%)**, que mora na esfera do setor (energia elétrica, petróleo e gás, saneamento, bancos públicos, correios, telecomunicações, transporte). Não é uma opção: é um número que muda aos poucos.
2. **O jogador abre um processo, escolhe a meta e o ritmo.** Privatizar: avaliação dos ativos → edital → venda em lotes, um por vez (4 a 8 turnos) → transferência. Estatizar: decreto → indenização (ou disputa na Justiça) → assunção da gestão (4 turnos). A participação do Estado se move lote a lote, não de uma vez.
3. **O processo tem custos e reações no caminho**: greve dos trabalhadores do setor, queda de braço no tribunal, fuga de capital, ágio dos compradores, tarifa que sobe ou cai, investimento que entra ou sai, corrupção e captura política. Cada etapa pode dar um dilema (aceitar o preço do lote? ceder à greve?).
4. **O que o jogo mostra é o andamento**: "Energia elétrica: Estado com 70%, em privatização (lote 2 de 5)". Ele não mostra "o país é liberal".
5. **A ideologia do país é só um termômetro** calculado (um índice): média da participação do Estado nos setores, mais controle de preços e planejamento, e mostrada como uma faixa (de "Estado mínimo" a "Estado dono"). Serve para o jogador ver o rumo, e não é um comando. A bússola política já faz isso para os costumes e a economia.

**O que a lei diz.** Não existe "lei da estatização". Existem regras concretas e neutras que limitam o processo, em camadas:

- Constituição, *Propriedade e indenização*: o que o Estado pode possuir e como indeniza (indenização prévia e justa; indenização só em títulos; sem indenização em setores estratégicos). Essa regra muda o custo e a facilidade do processo.
- Lei, *Concessões e parcerias*: por quanto tempo e em que condições o privado opera um serviço público.
- Alavancas: o **ritmo** e o **teto de preço (tarifa)** de cada setor, além da meta.

| Setor | Esfera | Por que ali |
| --- | --- | --- |
| Energia elétrica | Infraestrutura | geração, transmissão e distribuição |
| Petróleo e gás | Infraestrutura | energia fóssil e royalties |
| Saneamento | Infraestrutura | água e esgoto |
| Bancos públicos | Economia | crédito e fomento |
| Correios e logística postal | Educação e cultura (Comunicações) | serviço universal |
| Telecomunicações | Educação e cultura (Comunicações) | redes e espectro |
| Transporte (ferrovias, portos, aeroportos) | Infraestrutura | carga e passageiros |

**Mudanças no catálogo.** `propriedade-dos-meios-de-producao` e `planejamento-da-economia` saem (o termômetro substitui); `programa-de-privatizacao` e `nacionalizacao` viram o processo de cada setor; `papel-do-estado-empresario` vira *Propriedade e indenização* (Constituição). É preciso um tipo novo no motor: o **processo em etapas** (estoque que se move por lotes, com custo por turno e dilemas), que também serve para reforma agrária, reforma da previdência e outros.
""")
w("## 3. Distribuição por área\n")
w("| Esfera | Hoje | Proposta | Observação |\n| --- | ---: | ---: | --- |")
hoje = {}
prop = {}
for i in leis:
    hoje[esfera_de.get(i, "?")] = hoje.get(esfera_de.get(i, "?"), 0) + 1
    prop[proposta.get(i, "?")] = prop.get(proposta.get(i, "?"), 0) + 1
obs = {"defesa": "esfera nova: tira 21 leis de Segurança", "economia": "ganha juros, meta de inflação, câmbio, tarifas e banco de desenvolvimento",
       "ambiente": "ganha 3 leis do campo; ainda a menor: precisa de leis novas (água, resíduos, clima)",
       "empresas": "perde as 5 leis de macro; ganha as de propriedade por setor só na esfera do setor"}
for k in ORDEM:
    w(f"| {ESFERA[k]} | {hoje.get(k, 0)} | {prop.get(k, 0)} | {obs.get(k, '')} |")
w("")
w("## 4. Mudanças em relação ao jogo atual\n")
w("### Junta (duplicatas: uma lei antiga e uma da ficha tratam do mesmo)\n")
for novo, (velho, motivo) in JUNTAS.items():
    w(f"- `{velho}` + `{novo}`: {motivo}.")
w("\n### Separa\n- `programa-de-privatizacao` e `nacionalizacao` → o processo de cada um dos 7 setores (seção 2); `papel-do-estado-empresario` vira *Propriedade e indenização*.\n- `banco-de-desenvolvimento` → o banco público vira um dos 7 setores.")
w("\n### Move\n")
for i, t in sorted(tag.items()):
    if t.startswith("MOVE"): w(f"- `{i}`: {t[5:]}")
w("\n### Novo (leis do mundo que faltam; a pesquisar, com fonte)\n")
for t in ["**Renda básica universal** (Previdência): de piloto (Finlândia, Quênia) a programa nacional; degraus por valor.",
          "**Controle de aluguéis** (Previdência/moradia): livre, teto de reajuste, congelamento (Berlim, Espanha).",
          "**Poupança compulsória individual** (Previdência): fundo de aposentadoria de conta própria (Singapura).",
          "**Controle da internet e censura** (Governo): livre, moderação regulada, filtro de Estado (China, UE).",
          "**Cotas de gênero no parlamento** (Governo): sem cota, lista com cota, cadeiras reservadas (Ruanda, França).",
          "**Tarifa zero no transporte público** (Infraestrutura): pago, subsidiado, gratuito (Luxemburgo).",
          "**Água: preço e acesso** (Meio ambiente/Infraestrutura) e **Resíduos** (Meio ambiente): para equilibrar Ambiente."]:
    w(f"- {t}")
w("\n### Sai\n- `nacionalizacao`, `programa-de-privatizacao`, `propriedade-dos-meios-de-producao`, `planejamento-da-economia` (seção 2).")
w("\n## 5. Lista por área (como ficaria)\n")
w("Colunas: lei · camada · controle · o que faz (uma linha, vale para qualquer país) · mudança.\n")
for k in ORDEM:
    ids = sorted([i for i in leis if proposta.get(i) == k], key=lambda x: leis[x]["nome"])
    w(f"### {ESFERA[k]} ({len(ids)})\n")
    w("| Lei | Camada | Controle | O que faz | Mudança |\n| --- | --- | --- | --- | --- |")
    for i in ids:
        d = leis[i]
        c = CAMADA.get(d.get("mesa", {}).get("camada", ""), "Lei")
        w(f"| {d['nome']} | {c} | {controle(d)} | {frase(d).replace('|', '/')} | {tag.get(i, '')} |")
    w("")
w("## 6. Perguntas para você\n")
w("""1. A esfera nova **Defesa e relações exteriores** (12ª) é boa, ou prefere manter 11 esferas e dividir Segurança de outro jeito?
2. Os **7 setores** estão certos? Falta algum (mineração, ferrovias separadas de portos)?
3. Confirma o **processo em etapas** (lotes, custos por turno, dilemas) como tipo novo do motor, no lugar de leis com opções?
4. Quer que eu pesquise as **leis novas do mundo** da seção 4 com fonte antes de escrever as fichas?
""")
Path(RAIZ / "docs/v1/desenho/catalogo-novo.md").write_text("\n".join(out) + "\n", encoding="utf-8")
print(len(out), "linhas;", {k: (hoje.get(k, 0), prop.get(k, 0)) for k in ORDEM})
