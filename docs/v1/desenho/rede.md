# Rede: índices, situações, calibragem, sensibilidade e desempenho

> **Status: APROVADO** pelo autor em 12/out. Etapa 0 do V1-07; decisões na
> seção 8.

## 1. O que existe hoje (medido em 12/out, commit `0c613a2`)

| Tipo de variável | Quantas | Observação |
| --- | --- | --- |
| controle | 480 | um por opção de lei; fora deste desenho |
| calculado | 101 | 49 em `indice_0_100`, 44 em `percentual_0_100`, 6 em `percentual_pib` |
| estoque | 14 | dívida, reservas, escolaridade, infraestruturas etc. |
| situação | 17 | um só limite, `surgimento` |
| grupo | 11 | sai no V1-08 (perfis) |

- **Nenhum índice tem fonte.** O campo não existe em `variaveis.json`.
- **Unidade quase sempre abstrata.** 95 dos 101 calculados têm domínio 0 a
  100. Só `violencia_letal` (por 100 mil) e os 6 em % do PIB têm unidade real.
- **Áreas sem padrão.** Os índices usam 25 nomes de área diferentes
  ("Segurança" e "Segurança, justiça e drogas", "Trabalho" e "Trabalho e emprego"...), para 10
  áreas do plano.
- **Situação com um limite.** Na rede, o valor da situação é o quanto passou
  do limite: `max(0, bruto − surgimento)` (`computeNetwork.ts:342`). A situação
  some assim que a pressão cai um pouco, e volta no mês seguinte se subir.
- **Defeito encontrado.** `occurrences.ts:508` compara esse valor, que já é
  o excesso, com o limite de novo (`valor > surgimento`). No registro de ocorrências da partida, a
  situação só começa com a pressão no dobro do limite. Exemplo: juros
  explosivos aparecem na rede no turno 16 (`brasil2026.test.ts:99`), mas o
  registro só marca o início com o excesso acima de 32.
- **`evaluateSituation` com entrada e saída já existe** no motor
  (`engine/runtime/evaluateSituation.ts`), mas nada o usa. A pasta
  `mundo/situacoes/` está vazia.
- **Turno: ~91 ms** (média de 4 turnos depois do turno 8, sem ocorrências).
  O custo é alocação e ordenação, não a conta (achado de `conversa-12-out.md`).
- **Contexto fora de escala** e **primeiro ano sem história**: ver
  `conversa-12-out.md`.

## 2. Índices com unidade real e fonte

**Problema.** "Aprendizagem 62" não diz nada a quem joga nem permite conferir
com o mundo. Mas os ~1000 coeficientes da rede foram escritos na escala 0 a
100. Passar o motor para unidades reais obriga a reescrever todos.

**Proposta: escala interna 0 a 100, medida real por cima.** Cada índice ganha
um bloco `medida`, e o motor continua igual:

```json
"medida": {
  "unidade": "homicídios por 100 mil habitantes",
  "balizas": { "zero": 0, "cem": 60 },
  "fonte": { "nome": "SIM/DATASUS", "serie": "Óbitos por agressão", "url": "...", "ano": 2024 }
}
```

- `real = zero + valor/100 × (cem − zero)`. As **balizas** são fixas e
  escritas uma vez, como no IDH: o mínimo e o máximo plausíveis em qualquer
  país. Esse é o método "min-max com balizas" do manual de indicadores
  compostos do JRC/OCDE (seção 5, normalização).
- A tela mostra o número real ("31,2 por 100 mil"), e a calibragem compara em
  unidade real.
- **Índice sem medida real** (por exemplo, sensação de segurança, confiança
  nas instituições) vira `"tipo": "composto"`: ele diz de quais pesquisas ou
  índices sai e com que peso. A fonte continua obrigatória.
- **Verificador:** índice sem `medida.fonte.url` não carrega. É a mesma regra
  das fichas v3.

**Fontes públicas por API** (para o script da seção 4, sem copiar nada de
jogo):

- IBGE SIDRA (`apisidra.ibge.gov.br`): PNAD Contínua, PIB, IPCA, Censo.
- Banco Central SGS (`api.bcb.gov.br/dados/serie/bcdata.sgs.N`): Selic,
  câmbio, dívida bruta, reservas.
- Ipeadata (`ipeadata.gov.br/api`): séries longas compiladas.
- DATASUS/TabNet: mortalidade, vacinação, internações.
- INEP: SAEB e Censo Escolar. INPE PRODES: desmatamento. Tesouro (RTN):
  receita, despesa, resultado. TSE: comparecimento.

**Lista de cerca de 100.** Partir dos 115 atuais (101 calculados + 14
estoques) e:

1. juntar repetidos (`infraestrutura` e as 3 infraestruturas filhas; `saude_populacao` e `qualidade_de_vida`);
2. passar o que é soma de outros para `composto`;
3. pôr cada um em uma das 10 áreas;
4. dar medida e fonte.

O autor revisa a lista em uma tabela (`docs/v1/desenho/indices.md`) antes de
ela entrar no JSON.

## 3. Situações com entrada e saída

**Mecanismo (histerese, como um termostato).** A situação tem uma pressão,
que é o valor bruto que a rede já calcula, e dois limites: `entrada` e
`saida`, com `saida < entrada`.

```text
inativa  --pressão >= entrada-->  ativa
ativa    --pressão <= saida---->  inativa
entre os dois: fica como está
```

- **Intensidade** enquanto ativa: `(pressão − saida) / (entrada − saida)`,
  limitada a 0..1. É isso que alimenta as arestas que saem da situação.
  Inativa, a intensidade é 0.
- **No motor.** O estado da execução ganha `situacoesAtivas: Set<id>`, e a
  passada de cada mês avalia as situações depois das bolhas. O motor fica
  puro, e salvar e carregar levam o conjunto junto.
- `surgimento` sai. O jornal lê `situacoesAtivas`, e o defeito da seção 1
  some junto.
- `cofre` deixa de ser situação: é um estoque (dinheiro guardado), e hoje usa
  `surgimento: 0` só para não ficar negativo.
- **Cerca de 20 iniciais.** São as 16 de hoje (sem o cofre) e mais umas 4
  que usam as características do V1-06, por exemplo: estiagem (`seca`),
  queimadas (`floresta-tropical`), crise cambial (`moeda-propria`) e enchente
  (sem requisito). Cada uma tem entrada, saída, as arestas que dela saem e a
  fonte de onde vem a ideia do limite.

**Teste do motor (aceite):** a pressão sobe acima de `entrada` e a situação
ativa. Ela cai entre os limites e a situação continua ativa. Ela cai abaixo de
`saida` e a situação desativa. Em seguida, sobe até um valor entre os limites
e a situação continua inativa.

## 4. Calibragem

Três camadas, da mais barata à mais cara.

**4.1 Turno 0 com dados reais.** Os valores de partida vêm das fontes da
seção 2. O nó `contexto:<índice>` cobre a diferença entre o que a rede dá e
o real. Regra nova do verificador: `|contexto| ≤ 25` na escala 0 a 100. Acima
disso, a rede não explica o índice: é falta de estrutura, e o relatório
aponta.

**4.2 Começar dois anos antes (ideia do autor).** O Brasil ganha
`valores-2024` com dados reais de jan/2024. A carga roda 8 trimestres sem
decisão do jogador e começa a partida onde a simulação parou. Isso dá três
coisas:

- **História dos atrasos.** O efeito com atraso de 12 meses no turno 1 já
  tem os meses anteriores de verdade, e o "primeiro ano sem história" acaba.
- **Teste de calibragem.** Compara-se 2026 simulado com 2026 real, índice por
  índice, com o erro quadrático médio dividido pela estatística de Theil
  (Sterman 1984):
  - **U^M (viés):** a rede erra o nível. Ajusta-se o contexto ou o valor de partida.
  - **U^S (variância):** a rede oscila mais ou menos que o real. Ajusta-se o amortecimento (`resposta`).
  - **U^C (covariância):** é ruído que não se explica, e pode ficar.
- **Custo:** 8 trimestres × ~90 ms ≈ 0,7 s na abertura (ou ~0,15 s depois da
  seção 6). Por isso a tela de carregamento.

Limite: as leis de 2024 a 2026 ficam como as de 2026. Mudança real de lei
nesse período (por exemplo, a reforma tributária) aparece como erro de
calibragem, não como decisão.

**4.3 History matching (depois, em script).** É o método atual para modelos
caros com muitos parâmetros incertos (Vernon, Goldstein e Bower 2010; pacote
`hmer`, 2022). Cada coeficiente ganha uma faixa plausível. O script sorteia
conjuntos e corta os que dão implausibilidade
`I = |real − simulado| / √(variância do real + variância do modelo) > 3` em
algum índice. O que sobra é a faixa em que a rede concorda com 2024 a 2026.

Com o turno a ~20 ms, 2000 conjuntos × 8 trimestres levam cerca de 5 minutos
e dispensam emulador. Fica como script (`npm run rede:calibrar`), fora do
`npm test`. **O V1-07 só define a medida I e o relatório; rodar o history
matching completo é chamado futuro.**

## 5. Sensibilidade

**Objetivo:** descobrir quais leis mexem em cada índice e quais não mexem em
nada. Também acha o "nó que manda em tudo".

**Método:** triagem de Morris (efeitos elementares). Ela é barata e serve
para muitos parâmetros. Para cada lei, o script mede a média do efeito
absoluto μ* e o desvio σ do efeito, que diz se é não linear ou se depende de
outra lei. Com as 123 leis como fatores e 10 trajetórias, são 1240 partidas de
8 turnos. Isso leva ~15 min hoje, ~3 min depois da seção 6.

- **Sobol** (variância explicada, efeitos de interação) só nos ~20 fatores
  que a triagem apontar.
- **Saída:** `docs/testes/sensibilidade-AAAA-MM-DD.md` com três listas: leis
  inertes (μ* ≈ 0 em todo índice), índices dominados por uma só lei e pares
  com σ alto.
- **No `npm test`** entram só testes de sinal baratos: "subir alíquota do
  IVA não reduz a arrecadação no mesmo turno". Vários já existem.

## 6. Desempenho

**Meta:** turno abaixo de 20 ms no Node. Isso libera as seções 4.2 a 5.

| Mudança | Onde | Por quê |
| --- | --- | --- |
| Grafo compilado: id → índice inteiro, valores em `Float64Array` | `engine/runtime` | Acaba com `{...previous}` e a busca por string a cada mês |
| Ordem das arestas por alvo calculada uma vez em `buildGraph` | `engine/graph` | Hoje há um `sort(localeCompare)` por alvo a cada mês |
| Explicação (contribuições) só quando a tela pede | `computeNetwork` | Hoje se criam objetos de explicação para 990 nós em todo mês |
| `Map<origem, arestas>` | `engine/graph` | Busca por origem em O(1) |

**Garantia:** o teste de 4 turnos (`partida.test.ts`, `fichaV3.test.ts`) e o
turno 0 (`paisV1.test.ts`) devem dar os mesmos números com tolerância 1e-9.
É refatoração, não mudança de modelo.

**Tela de carregamento e Web Worker (ideia do autor).** O motor é puro: recebe
o conteúdo e o estado, devolve o estado. Por isso ele vai para um Worker sem
mudar, e a tela só faz `postMessage` e mostra o carregamento. Electron e
Tauri rodam a mesma página com Workers, então isso não prende ao navegador.
Entra se, depois da otimização, abertura com 4.2 ou fim de turno passar de
100 ms. Se não passar, fica anotado.

## 7. Fora do V1-07

- Todas as 60 situações (o resto vem com o conteúdo).
- History matching completo e Sobol (scripts em chamado próprio).
- Mudar coeficientes por causa da calibragem: o V1-07 mede e relata; ajustar
  é trabalho de conteúdo.

## 8. Decisões do autor (12/out)

1. **Unidade:** fichas escritas em unidade real, motor em pontos 0 a 100. O
   conversor da ficha v3 faz a passagem na carga, e a tela mostra a unidade
   real. As fichas antigas ficam em pontos até serem migradas.
2. **Começar antes:** um ano (jan/2025), 4 trimestres de aquecimento.
3. **Contexto: nenhum número sem explicação.** O contexto não é aceito como
   limite; a meta é zero. Ver seção 9.
4. **Cofre separado da dívida** (ideia do autor): dois estoques. O superávit
   paga dívida e enche o cofre (divisão por lei, padrão 50/50); o déficit sai
   do cofre ou aumenta a dívida (a mesma lei decide a ordem); o cofre tem teto
   (padrão 10% do PIB) e o que passa vai para a dívida. Os usos de hoje
   (juros, empréstimo, obras) continuam.
5. **Ordem:** desempenho, situações, índices, calibragem, sensibilidade.

## 9. Rede sem números soltos (pedido do autor)

**Regra.** Todo índice recebe influência de algo e influencia algo. Toda lei
recebe pelo menos um índice que muda o efeito dela (por exemplo, a eficácia
de um programa depende da capacidade do Estado) e mexe em outros. O
contexto é zero.

**Medido no Brasil, turno 0:**

| Regra | Hoje |
| --- | --- |
| Índice sem saída (só recebe) | 56 de 132, entre eles 12 situações sem efeito nenhum |
| Índice sem entrada | 2 (`carga_evento_demanda`, `transparencia_fiscal_internacional`) |
| Lei com algum índice mudando o efeito | 0 de 123 |
| Contexto acima de 5 pontos | 110 de 121; acima de 25: 67; acima de 50: 28 |

**Como o contexto chega a zero.** Para cada índice, a diferença entre o real
e o que a rede dá tem três saídas, nesta ordem:

1. falta uma ligação (um índice ou lei que deveria influenciar e não
   influencia);
2. um coeficiente está fora da faixa que a fonte dá;
3. as leis vigentes não estão todas no Brasil de 2025/2026.

O relatório (`npm run rede:contexto`) lista, por índice, o valor real, o que
a rede dá, a diferença e as entradas atuais. O verificador ganha as regras
acima com uma trava: o número de violações só pode cair (teste que guarda a
contagem). Quando chegar a zero, vira erro de carga.

**Tamanho (decisão de 12/out): por área.** O V1-07 entrega o relatório e a
trava. A limpeza de cada área entra no aceite do chamado de conteúdo dela
(V1-14 a V1-23).

## Fontes

- Sterman, J. D. (1984). *Appropriate summary statistics for evaluating the
  historical fit of system dynamics models.* Dynamica 10(2).
  <https://archives.albany.edu/concern/daos/nk322z25d>
- Vernon, I., Goldstein, M., Bower, R. (2010). *Galaxy formation: a Bayesian
  uncertainty analysis.* Bayesian Analysis 5(4). Método de history matching.
- Iskauskas, A. et al. (2022). *Emulation and history matching using the hmer
  package.* <https://arxiv.org/abs/2209.05265>
- Morris, M. D. (1991). *Factorial sampling plans for preliminary
  computational experiments.* Technometrics 33(2). Implementação de
  referência: SALib, <https://pypi.org/project/SALib/>
- Nardo, M. et al. (2008). *Handbook on constructing composite indicators.*
  OCDE/JRC. <https://publications.jrc.ec.europa.eu/repository/handle/JRC47008>
