# População, camada C (movimento): emprego

> **Status: IMPLEMENTADA (29/out/2026), aguardando revisão independente e `npm run check`.** Ver as emendas no fim. Item 3 do [PLANO](../../../PLANO.md). Mecânica-mãe:
> [populacao.md](../../jogo/mecanicas/populacao.md).

## 1. Objetivo

Os pesos dos perfis deixam de ser fixos. A primeira coisa que se move é o
**emprego**: quem perde o trabalho vira desempregado, e a informalidade empurra
gente entre carteira e informal. O desempregado é uma ocupação nova e também um
grupo político com peso na eleição.

Sucesso: o censo mostra o país mudando de forma plausível ao longo dos 16
turnos de um mandato, a soma dos pesos continua 1, e a parte que trabalha nos
perfis acompanha `ocupados` do motor (fecha o limite 1 da revisão da camada B).

Fora de escopo (vai para o PLANO se aparecer): movimento de renda pela sobra,
de valores e religião, ligar o bolso na satisfação, setores econômicos,
`gosta`/`odeia` fino do grupo de desempregados.

## 2. Regras

### 2.1 Estado

`perfis.json` não muda. Cada perfil de quem trabalha ganha uma **fração
desempregada** viva, de 0 a 1. O censo, o bolso e a projeção em grupos leem
isso como a ocupação `desempregado`. O desempregado herda renda, idade, valores
e território do perfil de onde saiu. A soma dos pesos continua 1.

Só tem fração quem tem `trabalha: true` na tabela de fontes: carteira,
informal, servidor e agricultura familiar. Aposentado, fora e quem vive de
capital (empresário, agro patronal, pequeno empreendedor) têm fração 0. O
pequeno empreendedor que quebra é real, mas o motor não o trata como
trabalhador (ele vive de `lucros` desde a camada B); fica como limitação.

### 2.2 O agregado manda

Cada turno a camada lê `desemprego` e `informalidade` do motor e ajusta as
frações até a soma bater com eles. Os perfis seguem o agregado; não o puxam
(2.3 do doc da mecânica). Sem atraso próprio: `desemprego` já é calculado pelo
motor com a dinâmica dele.

### 2.3 Quem perde o emprego primeiro

A demissão é repartida por vulnerabilidade, não por igual. Tabela em
`mundo/populacao.json`, por ocupação, faixa de renda e **idade**:

- **Carteira é quem perde o emprego primeiro** numa recessão: na de 2015–17 o
  país destruiu uns três milhões de vagas formais. O informal é o amortecedor,
  não o primeiro demitido; quem perde a carteira tende a virar informal antes
  de virar desempregado (isso é o movimento de 2.4).
- Pobre perde antes de rico; **jovem (16 a 29) tem desemprego perto do dobro
  da média**, então idade entra na tabela.
- Servidor tem estabilidade constitucional e quase não perde; agricultura
  familiar oscila pouco (produz a própria renda).

Quando o desemprego cai, volta na mesma ordem inversa.

### 2.4 Informalidade: carteira ↔ informal

- O alvo é `informalidade` × `ocupados`. Só carteira e informal trocam peso.
- O peso se move entre **gêmeos**: o mesmo perfil nos outros sete atributos
  com a ocupação trocada. 354 dos 500 perfis de carteira têm gêmeo informal
  (82% do peso de carteira; 97% do de informal).
- Carteira sem gêmeo **não se move**. Limitação declarada. O ajuste se
  concentra nos perfis com gêmeo.
- Teto de movimento por turno, para nenhum perfil esvaziar de uma vez.

### 2.5 Bolso do desempregado

Entra `desempregado` na tabela de fontes de `populacao.json` com
`trabalha: false`. Sem renda do trabalho.

O seguro-desemprego no Brasil só chega a quem tinha **carteira assinada**, por
três a cinco parcelas. O informal desempregado não recebe, e o desempregado
de longa duração deixa de receber. Como a fração viva vive no perfil de
origem, o bolso sabe se veio de carteira (benefício, limitado pela cobertura
da lei) ou de informal (nada). A duração das parcelas não entra nesta rodada:
a cobertura fica como fração fixa dos ex-carteira, anotada como simplificação.
A massa salarial repartida considera só a parte empregada de cada perfil.

### 2.6 Força política

Entra `grupo_desempregados` (tipo `grupo`, "Grupos sociais"), mapeado no eixo
Ocupação de `populacao.json`. O peso vem da fração viva. Mínimo nesta
rodada: seta `desemprego → grupo_desempregados` e seta do seguro-desemprego.
O `gosta`/`odeia` fino fica no PLANO.

### 2.7 Censo

A ficha de Ocupação ganha a faixa Desempregados. Cada faixa mostra a variação
**desde o início da partida**, em pontos de eleitorado (não desde o turno
passado: em 16 turnos a diferença de um turno some no ruído).

## 3. Entradas e saídas

**Lê:** `desemprego`, `informalidade`, `ocupados` (motor); perfis e tabelas do
conteúdo.
**Entrega:** frações vivas na visão, para censo, bolso e peso do grupo.
**Não entrega:** nada novo para a rede de consequências além do grupo (2.6).

## 4. Testes

Comportamento, não número exato:

- a soma dos pesos continua 1;
- desemprego sobe: a fração sobe, concentrada em pobres e informais;
- desemprego zero esvazia a faixa; desemprego cai e a ordem inverte;
- informalidade sobe: peso passa de carteira para informal, só entre gêmeos;
- perfil sem gêmeo não se move e nada quebra;
- a parte que trabalha acompanha `ocupados`;
- desempregado não recebe renda do trabalho e recebe o seguro-desemprego.

Script de absurdo (`scripts/teste/`): 16 turnos com crise forte e com boom,
imprimindo as faixas por turno. É ele que flagra "80% informal em dois turnos".

Na tela, antes de dizer que está pronto: censo com a faixa nova e a variação,
e o bolso dos desempregados.

## 5. Em aberto

- Valores da tabela de vulnerabilidade (2.3) e do teto por turno (2.4): saem
  da primeira rodada do script de absurdo.
- Seguro-desemprego: qual variável paga o benefício e como a lei dele limita
  quem recebe (a regra real é só ex-carteira, 3 a 5 parcelas).
- Desalento: quem desiste de procurar sai do desemprego e vai para "fora da
  força de trabalho" no Brasil real (a taxa de desocupação cai sem emprego
  novo). Não modelado; sem ele, o desemprego prolongado fica mais alto na
  tela do que seria nas estatísticas.
- Conferir os valores iniciais e a tabela de vulnerabilidade com PNAD e Caged
  quando forem preenchidos; hoje a direção está certa e os números são chute.
- Estado vivo e salvamento: onde guardar as frações para sobreviver a salvar
  e carregar a partida.

## 6. Emendas (o que mudou na implementação, 29/out)

- **2.1 Estado:** não há fração guardada. O eleitorado vivo é função pura de `valores` e do conteúdo (`congressoVivo`), o que resolve o "estado vivo e salvamento" do item 5: o arquivo salvo não muda.
- **2.1 Desempregado:** vira linha gêmea `desempregado` por perfil, com `vivo.origem` guardando de que ocupação saiu.
- **2.4 Teto por turno:** não existe. A informalidade desloca peso por diferença da inicial (38,6), então nada se move no turno 0; o limite é o peso disponível em carteira com gêmeo.
- **2.5 Seguro:** só para ex-carteira (`origemComBeneficio`); ex-informal desempregado tem renda 0.
- **Vulnerabilidade (5):** valores em `mundo/populacao.json`, sem conferência com PNAD/Caged.
- **Fora desta rodada, no PLANO:** `ProfileApproval` com perfis fixos, desalento, duração do seguro, `gosta`/`odeia` do grupo.
