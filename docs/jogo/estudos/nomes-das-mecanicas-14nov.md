# Estudo: como nomear as 3 mecânicas (14/nov/2026)

Pedido do autor: "Gosto" é palavra dele, não nome profissional (GDD 1.2, Em aberto).
Pesquisa rasa: ciência política e o Victoria 3. Proposta aprovada pelo autor em 14/nov: Sociedade, Economia e Máquina pública.

## O que a ciência política usa

**Estado, mercado e sociedade civil.** É a divisão mais usada no Brasil (Bresser-Pereira).
Estado e mercado são as duas instituições centrais; a sociedade civil é a parte da
sociedade fora do aparelho do Estado.
- https://www.bresserpereira.org.br/papers/1998/93SociedadeCivil.pdf
- https://bresserpereira.centrodeeconomiapolitica.org/papers/2009/09.09.Nação_Sociedade_Civil_Estado_28abril.pdf

**O sistema político de David Easton (1953, 1965).** É quase o ciclo do SisGov:
- **Entradas:** a sociedade manda demandas e apoio. Existe apoio de curto prazo, pelo
  resultado, e apoio difuso, que segura o governo mesmo quando ele falha.
- **Conversão:** quem decide transforma as entradas em leis, regras e serviços.
- **Saídas:** as políticas públicas voltam para a sociedade.
- **Retorno:** a reação às saídas vira nova entrada, e o ciclo não para.
- **Ambiente:** tudo fica dentro de um ambiente. O de dentro é a economia e a sociedade;
  o de fora são os outros países e os organismos internacionais.
- **Crítica conhecida:** o governo vira "caixa-preta"; o modelo não mostra como se decide.
- https://en.wikipedia.org/wiki/Systems_theory_in_political_science
- https://courses.worldcampus.psu.edu/welcome/padm507/001/content/02_lesson/03_page.html

## O que o Victoria 3 usa

- Política, economia e diplomacia são as três partes mais importantes do jogo.
- "Tudo começa e termina nos pops."
- Pilar "Tudo é político": toda mecânica volta aos pops e aos grupos de interesse.
- https://admin-forum.paradoxplaza.com/forum/developer-diary/victoria-3-dev-diary-0.1475078

## Como o SisGov encaixa

| Hoje | Easton | Estado/mercado/sociedade | Proposta |
|---|---|---|---|
| Gosto | entradas (demandas e apoio) e retorno | sociedade civil | **Sociedade** |
| Economia | ambiente de dentro | mercado | **Economia** |
| Leis (e quem executa) | conversão e saídas | Estado (aparelho) | **Máquina pública** |
| Mundo | ambiente de fora | — | **Mundo** (ambiente externo) |
| Política (Congresso, eleição, partido) | caminho das entradas até a decisão | — | **Política** |
| Mídia | filtro entre a demanda e quem decide | — | **Mídia** |

**Por quê:**
- **Sociedade:** cobre pops, grupos e organizações, e não só "gosto". O gosto vira a
  peça **Opinião** dentro dela.
- **Economia** em vez de "Mercado": a parte inclui as contas do Estado, e Mercado ficaria
  menor que ela.
- **Máquina pública** em vez de "Estado": bate com a frase do jogo ("simulador da máquina
  pública"). Também não confunde com a parte "Estado" dissolvida em 14/nov (decisão C1).
  As leis ficam dentro dela, como a peça principal.
- **Mundo** como ambiente de fora explica a frase "o Mundo pressiona as três".
- O SisGov abre a caixa-preta de Easton: instituições, ministros e Congresso mostram
  como se decide. Essa crítica ao modelo vira o diferencial do jogo.

## Falta estudar

- Os nomes das **peças** dentro de cada parte (pedido do autor).
- Se a mídia como "filtro" está no Easton original; conferir em *A Systems Analysis of
  Political Life* (1965) antes de citar.

---

# Parte 2: nomes das peças (14/nov/2026)

Pesquisa rasa. A maioria das peças já tem nome bom. A pesquisa trouxe sobretudo **referências**
para ideias que estavam como ESTUDAR. Aprovada pelo autor em 14/nov, com duas mudanças: Pregão sai da lista de nomes do jogo (é consequência de ignorar a dívida) e Informação não é canal novo (é programa ou verba de publicidade, pela mídia).

## Referências achadas

| Ideia do SisGov | Nome na literatura | Fonte |
|---|---|---|
| Tirar dói mais que dar | **Aversão à perda** (teoria da perspectiva, Kahneman e Tversky); aprovação que cai mais na piora do que sobe na melhora | https://www.lancaster.ac.uk/fass/events/epop2013/docs/Kappe_2013_EPOP.pdf |
| O benefício vira costume | **Retroalimentação de políticas** e **efeito catraca**: o programa cria quem o defende; cortar vira "fugir da culpa" (Pierson; Huber e Stephens) | https://www.independent.org/tir/1997-98-winter/dismantling-the-welfare-state/ |
| O eleitor julga a melhora | **Voto retrospectivo** (Fiorina, 1981): olha o passado recente da economia do país, não só o próprio bolso | https://www.acsu.buffalo.edu/~jcampbel/documents/JOPConditionalRetro2010.pdf |
| Informal, emigrar, tirar dinheiro | **Saída, voz e lealdade** (Hirschman, 1970): quem está insatisfeito sai, reclama ou fica por apego | https://en.wikipedia.org/wiki/Exit,_Voice,_and_Loyalty |
| Nenhum dinheiro some | **Modelo estoque-fluxo consistente** (Godley e Lavoie): toda linha e coluna da tabela de fluxos soma zero, "não há buracos negros" | https://www.exploring-economics.org/en/discover/stock-flow-consistent-macroeconomics/ |
| Canais (como a lei chega ao pop) | **Instrumentos de governo NATO** (Hood): Informação, Autoridade, Tesouro e Organização | https://www.ippapublicpolicy.org/teaching-ressource/the-policy-instrument-approaches/4 |
| Apoio que segura o governo na crise | **Apoio difuso** contra **apoio específico** (Easton) | ver acima |

**Achado dos canais.** Pela divisão de Hood:
- **Autoridade:** os canais regra e direito.
- **Tesouro:** imposto, transferência e preço e custo.
- **Organização:** verba à instituição.
- **Informação:** não tem canal. Exemplos: campanha de vacina, propaganda do governo, rótulo no
  cigarro. Hoje isso só aparece na mídia.

## Nomes propostos

Só onde muda; o resto fica como está.

| Hoje | Proposta |
|---|---|
| 2.1 Pops e o bolso de cada um | Pops e renda |
| 2.4 Opinião (bolso + bússola + memória) | Opinião (interesse, ideologia e memória) |
| 2.8 Saída (informal, emigrar, tirar dinheiro) | Saída e voz (Hirschman) |
| 2.9 Lugar (estados) | Território (estados) |
| 3.3 Trabalho e salário | Mercado de trabalho |
| 3.4 Lucro e donos | Propriedade e lucro |
| 3.6 Nenhum dinheiro some e o caminho do dinheiro | Fluxo do dinheiro (nenhum dinheiro some) |
| 3.7 Moeda, bancos, inflação e câmbio | Sistema monetário e financeiro |
| 3.8 Bolsa (minigame Pregão) | Mercado de capitais (minigame Pregão) |
| 3.10 Comércio exterior e capital | Setor externo |
| 3.12 Contas do Estado | Finanças públicas |
| 4.4 Canais | Instrumentos (canais) |
| 4.13 Força e atraso | Implementação (força e atraso) |

Nomes do jogo ficam: Bússola, Régua, Verba, Níveis e Pops são marcas do SisGov.
Na peça Opinião, "bolso" continua como a palavra da tela; "interesse" é o nome no GDD.
