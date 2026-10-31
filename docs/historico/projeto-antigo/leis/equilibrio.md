# Equilíbrio financeiro das leis

> **Status: VIGENTE (em desenho).** Conta de referência para calibrar as
> leis de [economia](economia.md) e das outras áreas. A conta roda em
> `scripts/equilibrio/simular.py` (modelo de bolso, não é o motor do jogo).
> Números de partida do Brasil são aproximados (jogabilidade primeiro).

## 1. A regra do jogo

O jogador fecha as contas por **quatro portas verdadeiras** e tem **duas
portas falsas**:

| Porta | Leis | O que custa |
| --- | --- | --- |
| **Cortar gasto** | aposentadoria, servidores, verbas | votos agora (aposentados, servidores) |
| **Cobrar mais** | impostos (cada um com a sua curva) | crescimento, fuga de capitais, votos de quem paga |
| **Crescer** | obras, indústria, ensino técnico, juros baixos | dinheiro antes, resultado depois (1 a 4 anos) |
| **Juros menores** | banco central crível, contas no azul | nada; é o prêmio por fazer as outras |
| *Imprimir dinheiro* | banco subordinado, imprimir | inflação que acelera todo ano |
| *Calote* | moratória | dívida cai na hora; crédito, câmbio e PIB desabam |

**A bomba-relógio:** a aposentadoria cresce sozinha **0,15% do PIB por ano**
com o envelhecimento. Quem não reforma carrega essa conta em qualquer plano.

**A bola de neve:** os juros da dívida (cerca de 10% ao ano) passam do que a
economia cresce somando inflação (cerca de 5%). Por isso o Brasil precisa de
superávit de **~1,5% do PIB** só para a dívida ficar parada. Plano crível
derruba o risco-país e os juros, e o alívio vem em 2 a 3 anos (círculo
virtuoso).

**Nenhuma lei resolve sozinha.** Os caminhos que funcionam combinam três ou
quatro leis. É isso que torna a economia um quebra-cabeça e não um botão.

## 2. Conta de partida (Brasil)

| Item | % do PIB |
| --- | --- |
| Receita | 33,0 |
| Gasto primário | 33,4 |
| Resultado primário | −0,5 |
| Juros da dívida | ~7 |
| Dívida bruta | 78 |

Gasto por bloco, cada um com a lei que o controla:

| Bloco | % PIB | Lei que mexe |
| --- | --- | --- |
| Aposentadorias | 10,5 (+0,15/ano) | Idade mínima, Valor, Reajuste, Como é paga, Servidores |
| Servidores | 6,5 | **Salário e quantidade de servidores** (nova) |
| Educação | 5,0 | Verba da educação (com piso) |
| Saúde | 4,3 | Verba da saúde (com piso) |
| Segurança e defesa | 2,2 | Verba da segurança, Gasto militar |
| Assistência | 2,0 | Renda para famílias pobres, Renda para idosos |
| Investimento | 1,5 | Estradas, ferrovias, portos, usinas |
| Indústria | 0,3 | Incentivo à indústria, Banco de desenvolvimento |
| Outros | 1,0 | demais verbas |

**Regra:** todo bloco de gasto tem uma lei que o controla. Nada de gasto fixo
escondido na rede (era o que travava o teste `contasSemFuros`).

## 3. Impostos: quanto rende cada ponto

Cada imposto segue uma curva: rende mais quando sobe, até um **pico**; depois
do pico, rende menos (as pessoas sonegam, saem ou param de produzir).

| Imposto | Alíquota de partida | Rende (% PIB) | Pico da curva | Freia o crescimento? |
| --- | --- | --- | --- | --- |
| Consumo | 26,5% | 12,5 | 45% | pouco (−0,04 por ponto) |
| Contribuição sobre os salários | 20% | 5,5 | 45% | pouco; aumenta a informalidade |
| Lucro das empresas | 34% | 3,3 | 45% | **sim** (−0,035 por ponto) |
| Renda das pessoas (faixa mais alta) | 27,5% | 2,8 | 65% | pouco |
| Imóveis e terras | 0,5% | 0,6 | 3% | não |
| Veículos | 3% | 0,6 | 12% | pouco (frete) |
| O que faz mal | nível 1 | 0,5 | nível 3 | não |
| Dividendos | 10% | 0,4 | 50% | sim, metade do lucro |
| Heranças | 4% | 0,15 | 40% | não |
| Grandes fortunas | 0% | 0,35 por ponto, menos a fuga | ~4% | **sim**, forte |
| Transações bancárias | 0% | 3,4 por ponto (0,38% ≈ 1,3) | ~1,5% | **sim**, forte |
| Outras receitas (royalties, estatais, taxas) | — | 6,6 | — | depende das leis de dono |

**Crescer arrecada:** cada 1% de PIB acima da tendência rende **+0,15% do
PIB** de receita (mais gente com carteira, mais empresas no regime normal).

## 4. Crescimento: o que move o PIB

Partida: **2% ao ano**. Alavancas (por ponto de PIB a mais na verba):

| Alavanca | Efeito no crescimento | Ritmo |
| --- | --- | --- |
| Obras (estradas, ferrovias, portos, energia) | +0,55 | rampa de 3 anos |
| Incentivo à indústria e banco de desenvolvimento | +0,70 | rampa de 3 anos |
| Educação | +0,10 | rampa de 4 anos, cresce depois |
| Imposto sobre quem investe | −0,035 por ponto | logo |
| Imposto sobre o consumo | −0,04 por ponto | já |
| Risco-país acima do normal | −0,20 por ponto | logo |
| Moratória | −4 nos dois primeiros anos | já |

## 5. Juros, risco e inflação

- **Risco-país** sobe com a dívida (+0,06 por ponto acima de 70%) e cai com o
  superávit (−1,0 por ponto de PIB de resultado primário).
- **Juros básicos** = inflação + 4 + reação à inflação acima da meta +
  0,8 × risco acima do normal. Banco subordinado baixa 2 pontos e soma 1,5
  de inflação.
- A dívida troca de juros aos poucos: 30% por ano chega ao juro novo.
- **Imprimir dinheiro:** cada ponto de PIB impresso soma 1,5 ponto de
  inflação **por ano acumulado** (a expectativa acelera).

## 6. Os caminhos, simulados em 8 anos

Partida: dívida 78%, PIB 100.

| Estratégia | Canto | Dívida ano 4 | Dívida ano 8 | PIB ano 8 | Inflação média | Veredito |
| --- | --- | --- | --- | --- | --- | --- |
| Nada muda | — | 94% | 119% | 114 | 3% | a bomba-relógio |
| **Austeridade** (reforma, servidores, privatizar) | M·L | 71% | **64%** | 117 | 3% | resolve a dívida |
| **Cortar imposto e gasto juntos** (Milei) | M·L | 70% | **64%** | **119** | 3% | resolve e cresce |
| Cortar imposto sem cortar gasto (Reagan, Trump) | M·A | 108% | 160% | 113 | 3% | a dívida explode |
| **Indústria financiada** (obras, indústria, reforma, imposto) | E·A | 89% | 95% | **129** | 3% | cresce mais, segura a dívida |
| Indústria no fiado | E·A | 108% | 151% | 123 | 3% | cresce e afunda |
| **Taxar os ricos** (Palme) | E·L | 82% | 88% | 112 | 3% | segura a dívida, cresce menos |
| **Social focado com superávit** (Lula 2003) | E·L | 83% | **85%** | 116 | 3% | gasta mais e segura a dívida |
| Estado de bem-estar completo | E·L | 90% | 103% | 113 | 3% | segura, mas pesa |
| Gasto social com imposto, sem reforma | E·L | 97% | 128% | 111 | 3% | a reforma faz falta |
| Gasto social sem imposto | — | 121% | 207% | 106 | 3% | quebra |
| Imprimir dinheiro (Chávez) | E·A | 89% | 126% | 105 | **25%** | inflação dispara (juros 70%) |
| Moratória | E·A | 72% | 104% | 104 | 5% | alívio curto, cicatriz longa |

**O que a tabela garante:**
- **Resolver a dívida:** pelo menos dois caminhos derrubam a dívida para perto
  de 64% (lado do mercado) e dois a seguram abaixo da partida mais o
  envelhecimento (lado do Estado).
- **Aumentar o PIB:** o caminho mais rápido (indústria financiada) dá +29% em
  8 anos contra +14% sem fazer nada. Crescer no fiado também cresce, mas
  quebra o caixa.
- **Aumentar gasto é viável** quando a receita nova passa do gasto novo e a
  aposentadoria é reformada (Lula 2003). **Diminuir gasto** resolve a dívida
  mais rápido, com custo em votos.
- **Todo canto da bússola tem um caminho que funciona**, e cada um tem a sua
  versão que dá errado.

## 7. Regras para a implementação

1. Os números das seções 2 a 5 são o alvo da calibragem da rede para o Brasil.
2. A tabela da seção 6 vira teste: rodar cada estratégia no jogo e conferir
   a direção (a dívida cai, sobe ou explode) e a ordem de grandeza.
3. Leis novas de imposto ou de gasto entram com: alíquota ou verba de
   partida, quanto rendem ou custam, pico da curva e efeito no crescimento.
4. Mexer em qualquer coeficiente pede rodar `scripts/equilibrio/simular.py`
   de novo e atualizar a tabela.
