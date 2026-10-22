# Estudo: como Victoria 3 e Democracy 4 fazem as contas

> **Status: ESTUDO (22/out/2026).** Não decide nada. Serve de base para a
> mecânica 4 (orçamento) e para as mecânicas 6 a 8 (índices, população,
> grupos). O que for aproveitado entra no documento da mecânica, com a
> aprovação do autor.
>
> **Regra (autor, 22/out; D-67):** Democracy 4 e Victoria 3 podem ser
> **lidos como referência**. Não usamos os cálculos nem o código deles: as
> fórmulas e os números do SisGov saem do nosso modelo
> (`scripts/equilibrio/simular.py`) e de dados reais. Os arquivos do
> Democracy 4 em `docs/Exemplos/` não entram no projeto; aqui há só ideias
> de funcionamento, com palavras nossas.

## Resumo em cinco linhas

1. **PIB:** no Democracy 4 é um índice de 0 a 1; no Victoria 3 é dinheiro
   (produção × preço). O SisGov copiou o jeito do Democracy 4 (índice 0–100)
   e ficou sem um PIB em dinheiro que cresça. Esse é o defeito número 1 do
   nosso orçamento.
2. **Receita:** os dois cobram imposto sobre uma base. No Democracy 4 o PIB
   multiplica a receita **só em parte**: um pedaço da arrecadação não
   depende da economia. No SisGov o índice multiplica tudo, e a receita despenca com ele.
3. **Dívida e juros:** no Democracy 4 um "mercado de títulos" dá nota ao país
   (dívida, déficit, estabilidade, inflação) e a nota define os juros. No
   Victoria 3 os juros são baixos e fixos, e o limite é um **teto de dívida**
   ligado à riqueza das empresas. O SisGov não tem nenhum dos dois canais.
4. **Tempo:** o Democracy 4 suaviza cada efeito com **inércia** (média dos
   últimos turnos); o Victoria 3 fecha as contas **toda semana** e deixa a
   riqueza das pessoas andar devagar. O SisGov já tem as duas ideias.
5. **Gente:** o Victoria 3 mede o **padrão de vida** de cada grupo e daí tira
   radicais, lealistas, natalidade e peso político. É o modelo da opção A das
   mecânicas 7 e 8.

---

## 1. PIB: índice ou dinheiro?

### Democracy 4
- Cada indicador (PIB, desemprego, saúde…) é um número de 0 a 1. O PIB é um
  deles: "quão boa está a economia", não quantos dólares o país produz.
- O dinheiro aparece em outro lugar: cada lei tem custo e receita em moeda,
  entre um mínimo e um máximo conforme o nível. O indicador entra como
  **multiplicador** desse valor (o imposto rende mais com o PIB alto, o
  seguro-desemprego custa mais com desemprego alto).
- Como a dívida vira "dívida/PIB" para a nota de crédito não está nas
  fontes lidas (não confirmado).

### Victoria 3
- O PIB é dinheiro: a soma, em todos os prédios do país, do que foi produzido
  vezes o preço do bem no mercado.
- O PIB cresce porque se constroem prédios, a produtividade sobe e os preços
  mudam. Não existe "índice de economia".
- A cunhagem de moeda (uma receita automática) é uma fração do PIB.

### SisGov hoje
- `pib` é um índice de 0 a 100 (começa em 44,7), alimentado por dezenas de
  setas, como no Democracy 4.
- `pib_nominal` (o PIB em reais) é um **controle constante**: não cresce, não
  cai.
- Receita, gasto e dívida estão em % do PIB, mas o PIB em reais não anda. Por
  isso crescimento e inflação nunca diluem a dívida.

### O que aproveitar
- **Ficar com os dois números, cada um no seu papel** (híbrido):
  - **PIB em reais** vira estoque: cresce todo mês pela taxa de crescimento
    real mais a inflação. É dele que saem a dívida em %, a receita em reais e
    o que a tela mostra.
  - **Ritmo da economia** (o índice de hoje, ou um nó novo de crescimento)
    diz quão rápido o PIB em reais cresce. Índice alto: crescimento acima da
    tendência; índice baixo: recessão.
- É o que o `scripts/equilibrio/simular.py` já faz: PIB começa em 100 e
  cresce `g` ao ano; a dívida divide por `(1+g)(1+π)`.

## 2. Receita e gasto

### Democracy 4
- Cada lei tem uma faixa de custo e uma de receita. O nível da lei escolhe o
  ponto da faixa.
- Multiplicadores ajustam o valor pelo estado do país: impostos reagem à
  economia e ao emprego; a previdência, à idade de aposentadoria e à
  expectativa de vida; os serviços públicos, aos salários.
- **O multiplicador do PIB não é cheio:** parte da receita não depende da
  economia. Uma queda grande do PIB tira só uma fração da arrecadação.

### Victoria 3
- Os impostos têm **níveis** (muito baixo a muito alto), não sliders. Subir o
  nível rende mais e custa legitimidade e radicais.
- Cada imposto tem uma base real: salário dos trabalhadores (renda), número
  de pessoas (por cabeça), terra (rural), consumo de bens escolhidos,
  dividendos, tarifas.
- Gastos: salários e bens de prédios do governo, do exército, subsídios,
  construção e juros. Cortar gasto do governo fecha empregos de verdade.

### SisGov hoje
- Cada imposto tem curva de arrecadação (Laffer) pela alíquota. **Bom, e mais
  completo que os dois jogos.**
- A curva é multiplicada pelo índice de atividade inteiro
  (`escala: pib`, `escala: consumo`). Como a receita já está em % do PIB, a
  queda da economia é contada duas vezes.
- Leis de gasto têm custo por opção (`custos.json`) e custos que reagem
  (seguro × desemprego, previdência × envelhecimento). **Igual ao Democracy 4.**

### O que aproveitar
- **Receita em % do PIB depende só da alíquota**, mais um termo pequeno de
  ciclo (o `simular.py` usa 0,15 ponto por 1% de PIB fora da tendência). Em
  reais, a receita já acompanha o PIB, porque o PIB em reais cai junto.
- Se preferir manter um multiplicador, a ideia de referência é a do
  Democracy 4 (só uma parte da receita acompanha a economia), com o tamanho
  dessa parte tirado do nosso modelo, nunca o índice cheio.
- Do Victoria 3: **cortar gasto do governo tira emprego e renda**, mas na
  medida do gasto cortado, não mais. É o multiplicador fiscal (0,3 a 0,8).

## 3. Dívida, juros e crise

### Democracy 4
- Déficit vira dívida, superávit paga dívida.
- A cada meio ano, um **mercado de títulos** dá uma nota de crédito ao país
  olhando quatro coisas: dívida/PIB, déficit/PIB, estabilidade e inflação.
- **A nota define a taxa de juros** paga sobre a dívida.
- Dívida muito alta abre a situação **crise da dívida**, que pune economia,
  confiança e apoio. O teto imaginado é ~250% do PIB.

### Victoria 3
- Toda semana: receita − gasto vai para a **reserva de ouro** (caixa) ou, se
  ela acabou, vira **dívida**.
- A reserva tem um teto "mole": acima dele, o superávit rende cada vez menos.
- A dívida tem um teto "duro" (**limite de crédito**), calculado pelo caixa
  das empresas do país. Bater no teto é **calote**: o país entra em default,
  e pode declarar falência, o que arrasa a indústria.
- **Os juros são baixos e não sobem perto do teto.** Os desenvolvedores
  testaram juros que sobem e tiraram, porque viravam espirais de morte sem
  graça.
- Não há inflação (a cunhagem é calibrada para não haver). *Segundo o diário
  de 2021, antes do lançamento.*

### SisGov hoje
- Déficit soma na dívida, superávit abate, e depois enche o **cofre** (fase 4).
  **Igual ao Victoria 3** (reserva + dívida), com a lei "Uso do cofre" a mais.
- Juros = 0,7 × Selic × dívida. A Selic **não reage** à dívida nem ao
  resultado (não há seta risco-país → Selic nem dívida → risco-país).
- Situação "Juros explosivos" quando os juros passam de 32% da receita. Faz o
  papel da crise da dívida do Democracy 4.

### O que aproveitar
- **A nota de crédito do Democracy 4**, em versão visível: risco-país sobe com
  dívida/PIB e déficit, cai com superávit e estabilidade; a Selic segue a
  inflação + prêmio do risco. É o canal que faz a austeridade funcionar.
- **A lição do Victoria 3:** juros que sobem sem freio viram espiral sem
  saída. Duas travas:
  - os juros **efetivos** andam devagar até a Selic (no `simular.py`, 30% do
    caminho por ano, porque a dívida é rolada aos poucos);
  - o prêmio de risco tem teto, e o resto da punição vai para situações
    (crise da dívida) que o jogador pode resolver com uma decisão.
- **Teto de dívida (calote):** guardar para depois da versão 1; as ocorrências
  "crise da dívida" (moratória, socorro externo, imprimir) já cobrem o fim
  da linha.

## 4. Tempo e suavização

### Democracy 4
- Cada efeito tem **inércia**: o valor usado é a média dos últimos N turnos.
  Uma lei nova chega devagar ao efeito cheio.
- Leis têm **tempo de implantação** e, enquanto não estão completas, rendem
  menos. O ministro competente acelera ou freia.

### Victoria 3
- Contas fechadas **toda semana**; nada é pago de uma vez (nem obras).
- A riqueza de cada grupo anda aos poucos: um déficit pequeno leva meses para
  baixar o padrão de vida. A riqueza é guardada em passos finos para não
  oscilar.

### SisGov hoje
- Bolhas andam metade do caminho por mês (D-54); efeitos têm atraso
  (`atrasoPassos`); a lei anda mês a mês até a meta e o custo anda junto.
  **Já cobre as duas ideias.**
- Motor mensal com turno trimestral (mecânica 1). Destino: tempo corrido com
  semanas, como o Victoria 3.

### O que aproveitar
- Nada novo para o motor. Para obras e indústria, usar a **rampa** do
  `simular.py` (efeito cheio no 3º ano), que imita o "obra leva tempo".

## 5. População e padrão de vida

### Victoria 3
- Cada grupo de pessoas (pop) tem **padrão de vida** de 1 a 99, com faixas
  (passando fome … opulento).
- A base é a **riqueza**: renda líquida comparada com o custo das
  necessidades daquele nível. Sobra dinheiro → riqueza sobe; falta → desce.
- Preço alto dos bens torna as necessidades mais caras → padrão de vida cai.
- Padrão de vida mexe em:
  - **natalidade e mortalidade** (as duas caem quando ele sobe, a mortalidade
    mais rápido; abaixo de um ponto a população encolhe: é a fome);
  - **lealdade**: subir faz lealistas, cair faz radicais;
  - **força política** do grupo (mais rico, mais peso).

### Democracy 4
- Os eleitores pertencem a vários grupos ao mesmo tempo (pobre, aposentado,
  motorista…). A felicidade de cada um é a soma dos efeitos sobre os grupos
  dele, e decide o voto.
- Renda das faixas (baixa, média, alta) é um indicador que as leis mexem.

### SisGov hoje
- Grupos de pressão e eleição existem; a renda das famílias e a pobreza são
  índices.
- Mecânicas 7 (população) e 8 (grupos com radicais e lealistas, opção A)
  ainda a escrever.

### O que aproveitar
- **Do Victoria 3, quase tudo para as mecânicas 7 e 8:**
  - padrão de vida por grupo, vindo de renda × custo de vida;
  - radicais e lealistas pela **variação** do padrão de vida, não pelo nível;
  - natalidade e mortalidade pelo padrão de vida.
- **Do Democracy 4:** a pessoa em vários grupos ao mesmo tempo, para o voto.

## 6. Leis e política

### Victoria 3
- Aprovar uma lei leva tempo: a cada etapa ela pode avançar, emperrar ou ser
  debatida, com chance que depende do apoio dos grupos de interesse.
- Grupos de interesse têm **peso** (clout, pela riqueza e pelo voto dos seus
  membros) e **aprovação**; quem tem peso alto e aprovação baixa vira
  oposição.
- Impostos altos tiram legitimidade e criam radicais.

### Democracy 4
- Cada lei custa **capital político** para criar, subir, baixar ou cancelar.
- Leis têm pré-requisitos e opostos.

### SisGov hoje
- Tramitação no Congresso existe (mecânica 3 a escrever); leis em três níveis;
  exclusões entre leis; grupos de pressão.

### O que aproveitar
- Do Victoria 3, para a mecânica 3: **avançar / emperrar / debater** como
  etapas da tramitação, com chance pelo apoio dos grupos.
- Do Victoria 3, para a mecânica 8: **peso × aprovação** dos grupos.

---

## 7. Tabela: o que já temos, o que falta, de onde tirar

| Peça | Democracy 4 | Victoria 3 | SisGov hoje | Tirar de |
| --- | --- | --- | --- | --- |
| PIB em dinheiro que cresce | não (índice) | sim (produção × preço) | **não** (constante) | Victoria 3, em versão simples |
| Ritmo da economia (índice) | sim | não | sim | já temos |
| Imposto com curva pela alíquota | não (reta) | não (níveis) | **sim** | já temos |
| Receita que reage ao PIB | em parte | em reais | em excesso | Democracy 4 (parte fixa) |
| Custo que reage ao país | sim | sim | sim | já temos |
| Cortar gasto tira emprego, na medida | não | sim | em excesso | Victoria 3 |
| Nota de crédito → juros | sim | não | **não** | Democracy 4 |
| Juros que não viram espiral | não | sim | sim, por ora | Victoria 3 |
| Caixa e dívida separados | não | sim | sim (cofre) | já temos |
| Teto de dívida / calote | não | sim | ocorrência | depois da v1 |
| Inércia dos efeitos | sim | sim (riqueza) | sim | já temos |
| Padrão de vida por grupo | não | sim | não | Victoria 3 (mec. 7–8) |
| Radicais e lealistas | não | sim | não | Victoria 3 (mec. 8) |
| Pessoa em vários grupos | sim | não | em parte | Democracy 4 (eleição) |
| Tramitação com etapas | não | sim | sim | Victoria 3 (mec. 3) |

## 8. Proposta para a mecânica 4 (orçamento), com base neste estudo

Na ordem, cada passo conferido com `scripts/teste/sonda-orcamento.ts`:

1. **PIB em reais vivo** (Victoria 3): estoque que cresce com crescimento
   real + inflação; a dívida passa a ser diluída. Alvo: "Nada muda" ≈ 94% no
   ano 4 e 119% no ano 8 (`equilibrio.md`, seção 6).
2. **Receita sem contar a queda duas vezes** (Democracy 4): tirar o índice
   cheio da curva; no máximo uma parte proporcional.
3. **Nota de crédito → Selic** (Democracy 4), com juros efetivos lentos
   (Victoria 3).
4. **Lei para todo gasto grande** (folha dos servidores, demais gastos),
   reforma da previdência que trava o envelhecimento, privatização com
   receita única.
5. **Gasto → crescimento na medida** (Victoria 3): obras e indústria puxam;
   folha e transferências quase não; a meta de primário perde a seta direta
   de −8,4 no PIB.
6. **Teste de aceitação:** as estratégias do `simular.py` rodadas no jogo,
   conferindo direção e ordem de grandeza.

## Fontes

- [Democracy 4: modding (efeitos, inércia, pré-requisitos)](https://www.positech.co.uk/democracy4/modding.html)
- [Cliff Harris: a economia do Japão no Democracy 4 (nota de crédito, juros, crise da dívida)](https://www.positech.co.uk/cliffsblog/2021/06/03/japans-economy-in-democracy-4-making-sense-of-irrational-economics/)
- [Victoria 3, diário 9: mercados nacionais (preços, lucro dos prédios)](https://admin-forum.paradoxplaza.com/forum/developer-diary/victoria-3-dev-diary-9-national-markets.1484917)
- [Victoria 3, diário 12: tesouro (impostos, reserva, dívida, calote, juros)](https://forum.paradoxplaza.com/forum/developer-diary/victoria-3-dev-diary-12-treasury.1488588/)
- [Victoria 3, diário 13: padrão de vida (riqueza, necessidades, natalidade, lealdade)](https://admin-forum.paradoxplaza.com/forum/developer-diary/victoria-3-dev-diary-13-standard-of-living.1489327)
- [Como aumentar o PIB no Victoria 3 (PIB = produção × preço)](https://ggrecon.com/guides/how-to-increase-gdp-in-victoria-3)
- Arquivos locais do Democracy 4 (`docs/Exemplos/simulation/`), só lidos
  como referência (D-67).
- **Atenção:** os diários do Victoria 3 são de 2021–22, antes do lançamento.
  Detalhes como "juros baixos que não sobem" e "não há inflação" podem ter
  mudado no jogo lançado e nas atualizações.
- Victoria 3, partes do conhecimento geral do jogo não confirmadas nas fontes
  acima: tramitação com etapas e peso × aprovação dos grupos de interesse.
