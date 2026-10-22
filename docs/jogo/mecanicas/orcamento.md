# Mecânica 4: Orçamento

> **Status: PROPOSTA (22/out/2026), para o autor revisar.** Escrita depois do
> molde das leis ([molde-das-leis.md](molde-das-leis.md)). Base: o diagnóstico
> de 22/out ([estudo](../estudos/victoria3-e-democracy4.md), seção 8), o
> modelo de referência `scripts/equilibrio/simular.py` e a tabela da seção 6 de
> [equilibrio.md](../leis/equilibrio.md). Técnica de hoje:
> [orcamento-na-rede.md](../../arquitetura/orcamento-na-rede.md).
> Índice: [mecânicas](README.md).

## 1. O que é

O dinheiro do governo: quanto entra (impostos), quanto sai (verbas,
programas, juros) e o que sobra ou falta, que vira dívida ou cofre. É a conta
que segura o jogador: toda lei mexe nela, e quebrar o caixa custa juros,
risco-país e crise.

**O que precisa mudar** (simulação de 22/out, 32 turnos, repetida depois do
molde com o mesmo resultado):

| Problema | O que se vê | Causa no motor |
| --- | --- | --- |
| A dívida explode mesmo sem fazer nada | 82% → 97% em 2 anos, 166% em 8 (o alvo é 119%) | O PIB em reais (`pib_nominal`) é uma constante: nem o crescimento nem a inflação diluem a dívida |
| Cortar gasto piora o déficit | gasto cai 1,7 ponto, receita cai 3,8; PIB 44,7 → 32,6 em 2 anos | A receita é multiplicada pelo índice de atividade inteiro; a meta de primário tem uma seta direta de −8,4 no PIB |
| O esforço fiscal não baixa os juros | a Selic fica em 12,3% com ou sem ajuste | Não há seta da dívida para o risco-país nem do risco-país para a Selic |
| A Selic não reage à inflação | — | Os juros só recebem as leis do banco central, a regra fiscal e duas situações |

## 2. Regras

### 2.1 Dois números para a economia

- **PIB em reais** (`pib_nominal`) passa de constante a **estoque**: cresce
  todo mês pelo crescimento real mais a inflação. É dele que saem receita,
  gasto e dívida em reais, e o que a barra de cima mostra.
- **Ritmo da economia** (o índice `pib` de hoje, de 0 a 100) passa a se
  chamar assim na tela e diz **quanto o PIB em reais cresce**: no ponto de
  partida do Brasil (44,7), cresce 2% ao ano, a tendência; acima, mais; abaixo,
  menos, até encolher. Proposta inicial: crescimento real = 2% + 0,3 ponto por
  ponto do índice acima ou abaixo de 44,7. _(número a calibrar)_
- **A dívida é diluída:** todo mês ela perde a parte que o PIB em reais
  cresceu. É a conta real: dívida × (1 + juros) ÷ ((1 + crescimento) ×
  (1 + inflação)), menos o resultado primário.

### 2.2 Receita

- Cada imposto continua com a sua curva pela alíquota (a arrecadação para de
  subir num pico e depois cai).
- **A receita em % do PIB não cai junto com a economia inteira.** Hoje cada
  imposto é multiplicado pelo índice de atividade (`escala`); como a receita
  já está em % do PIB, a queda conta duas vezes. Passa a ser: **70% da curva
  fixa e 30% acompanhando a base** (consumo, renda ou PIB). _(fração a
  calibrar; no Democracy 4, que serve de referência, uma parte também é fixa)_
- Em reais, a receita acompanha o PIB em reais, que já cai numa recessão.

### 2.3 Gasto

- Cada verba e programa custa o que diz (`dinheiro`), em % do PIB.
- **Cortar gasto tira atividade na medida certa.** O efeito de cada verba no
  ritmo da economia segue o modelo de referência: obras e indústria puxam
  (0,55 e 0,70 ponto de crescimento por ponto do PIB gasto, com rampa de 3
  anos); educação, devagar (0,10); folha, transferências e demais gastos quase
  nada direto, só pelo consumo das famílias. Alvo: cortar 1 ponto do PIB tira
  de 0,3 a 0,8 ponto de atividade, nunca mais que o corte.
- **Meta de resultado** perde a seta direta de −8,4 no PIB. Passa a obrigar
  um corte de gasto (contingenciamento) proporcional ao nível e a baixar o
  risco-país. O efeito no PIB vem do gasto que sai.

### 2.4 Juros e credibilidade

- **Risco-país** sobe com a dívida acima de 70% do PIB e com o déficit, e cai
  com superávit. Referência: +0,06 por ponto de dívida acima de 70; −1 por
  ponto de superávit primário.
- **Selic,** quando o banco central é independente ou tem mandato fixo:
  inflação + 4 + 0,8 × (risco − 3). Com o banco central subordinado, quem
  decide é a lei Juros básicos, como hoje.
- **Juros da dívida** não seguem a Selic na hora: andam 30% do caminho por
  ano, porque a dívida é rolada aos poucos. Isso evita a espiral sem saída
  que o Victoria 3 testou e tirou.
- A situação **Juros explosivos** continua como está.

### 2.5 Pendências que vêm do molde das leis

- **Destino da sobra do orçamento** junta-se ao **Fundo soberano**, que passa
  a dizer o que fazer com o superávit: pagar dívida, dividir ou guardar
  (as três opções de hoje), mais o uso do cofre (guardar, emprestar,
  obras). _(forma final: na fase 5)_
- **Contribuição sobre salários** sai de dentro da Previdência e vira um
  imposto próprio (dourado), sem contar duas vezes: a receita que hoje está
  na Previdência passa para ela.
- **Seguro-desemprego** e **Renda para idosos e pessoas com deficiência**
  ganham custo e viram **programa** (verde-água), com público.

## 3. Entradas e saídas

- **Lê:** todas as leis com `dinheiro` (impostos, verbas, programas); o ritmo
  da economia; a inflação; o risco-país; o estado inicial do Brasil.
- **Entrega:** receita, gasto, juros, resultado, dívida (ou cofre) e PIB em
  reais, para a barra de cima, o relatório de impacto, as situações de crise
  e os grupos que reagem a imposto e corte.

## 4. No código

Cada fase com teste, a sonda de 8 turnos (`scripts/teste/sonda-orcamento.ts`)
e, no fim da fase, o roteiro de 4 governos × 2 caminhos
(`scripts/teste/ideologias.ts`) rodado pelo GPT.

| Fase | O que muda | Aceite |
| --- | --- | --- |
| 1. PIB em reais | `pib_nominal` vira estoque; nó de crescimento real a partir do ritmo; diluição da dívida | "Nada muda" fica perto de 94% no ano 4 e 119% no ano 8 |
| 2. Credibilidade | setas dívida e resultado → risco-país; risco e inflação → Selic (só com banco central não subordinado); juros da dívida com atraso | Superávit sustentado baixa a Selic; dívida alta sobe |
| 3. Receita | `escala` dos impostos passa a 30% da curva (os outros 70% sem escala) | Corte de 1 ponto de gasto não derruba mais que 0,5 ponto de receita |
| 4. Corte na medida | meta de primário sem seta no PIB e com contingenciamento; efeitos das verbas no ritmo pelo modelo de referência | Corte de 1 ponto de gasto tira de 0,3 a 0,8 ponto de atividade |
| 5. Pendências | fundo soberano com o destino da sobra; contribuição sobre salários; programas com custo | Testes do cofre verdes; receita total igual à de antes no turno 0 |
| 6. Aceite | script que roda as estratégias do `simular.py` traduzidas em leis | Direção e ordem de grandeza da tabela 6 do `equilibrio.md`: austeridade e "cortar imposto e gasto" derrubam a dívida para perto de 64%; "social com superávit" segura perto de 85%; "gasto social sem imposto" quebra |

**Fase 1 feita em 22/out (só a diluição).** Nó `crescimento_real` = 2 + 0,3 ×
(ritmo − 44,7); a dívida perde (crescimento real + inflação) ÷ 4 % de si mesma
por trimestre. `pib_nominal` **continua constante** por enquanto: 15 verbas em
reais são divididas por ele, e se ele crescer elas encolhem uns 6,5% ao ano
(um corte escondido de ~40% em 8 anos). Vira estoque só junto com a correção
dessas verbas pela inflação. Resultado, "Nada muda": dívida 78,1 → 82,5 (ano 4)
→ 88,2 (ano 8), antes 82 → 166. A dívida do turno 0 passa de 82,4 para 78,1
(estoque inicial 77,2; a de 82 era efeito do aquecimento sem diluição; 78 é o
dado de 2025 e o ponto de partida do `simular.py`). Abaixo do alvo 94/119
porque no jogo os juros são 6,7% do PIB (≈ 0,7 × Selic × dívida; real ≈ 8%) e
o primário não piora com o envelhecimento: fases 2 e 3.

**O turno 0 não muda.** Todas as fases são feitas para dar zero no ponto de
partida do Brasil: o que muda é a dinâmica a partir dele. A foto do turno 0
(`paisV1.test.ts`) só muda se uma fase precisar, e com nota.

## 5. Em aberto

- Os números marcados _(a calibrar)_: 0,3 ponto de crescimento por ponto do
  ritmo; 30% da receita acompanhando a base. Saem das fases 1 e 3.
- Se o índice `pib` muda de nome no código ou só na tela ("Ritmo da
  economia"). Proposta: só na tela, para não mexer nas 34 setas que chegam
  nele.
- Forma final do Fundo soberano com o destino da sobra (fase 5).
