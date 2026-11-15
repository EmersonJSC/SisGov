# População (pops)

Um **pop** é uma fatia da população: uma profissão num estrato (pobre,
médio, rico). Os tipos de pop são do mundo (`conteudo/mundo/pops/`); o
motor não conhece os nomes. O país declara, para cada tipo, a parte da
população (`parcela_pessoas`) e a parte da renda do país (`parcela_renda`).
As duas somam 1.

Por pessoa, ao ano, na moeda do país (passo 7a, 01/nov/2026):

- **Renda bruta** = `parcela_renda` × PIB nominal ÷ pessoas do pop.
- **Imposto**: o que a base `renda` arrecada, dividido pela `parcela_renda`
  (imposto plano; quem paga mais ou menos é a progressividade, seção 11).
- **Transferência**: lei de gasto com `para: { "estrato": … }` divide o
  valor igual entre as pessoas desse estrato.
- **Renda** (disponível) = bruta − imposto + transferência.

O tamanho de cada pop parte da parcela declarada e muda com a mobilidade
(abaixo).

**Subir e descer de estrato (R11.6).** O tipo de pop declara no mundo `sobe`
(`para` e `exige`, um índice) e `desce` (o pop de baixo). Todo turno, pelo
quanto a renda real do pop fugiu do esperado (±25% = força total):

- acima: um pouco de gente sobe, vezes `índice exigido ÷ 100` (ex.: instrução);
- abaixo: um pouco desce, sem exigir nada.

No máximo 1% do pop por turno; cada pop ganha ou perde no máximo 30% do que
declarou. Fica em `Estado.migracao` (fração da população que entrou ou saiu de
cada pop; soma zero). Quem muda passa a ganhar como o pop novo, e a renda
total continua sendo o PIB. Pobre não desce e rico não sobe. Os grupos
crescem e encolhem sozinhos, porque contam pessoas por pop.

São 25 tipos (8 pobres, 11 médios, 6 ricos). Cada um tem `bussola` (economico e
social, −1 a +1); por enquanto só descreve o pop, ainda não move nada.

Comportamento esperado (escrito antes), país de teste, `npm run pops`:

- turno 1: renda média por pessoa = PIB nominal ÷ população; empresário
  bem acima (5×), informal bem abaixo (¼);
- imposto de renda 20% → 30%: a renda de **todos** os pops cai na mesma
  proporção, a bruta não muda;
- transferência de renda 2% → 4% do PIB: a renda dos três pops pobres sobe,
  a dos médios e ricos não muda;
- num mandato sem mudar nada: todas as rendas sobem com o PIB nominal, e a
  ordem entre os pops não muda.

## Estudar e mudar de setor (R11.5)

O setor onde cada pop trabalha deixa de ser fixo: `Estado.setores` guarda a
mistura de hoje (sem isso vale o `setores` declarado em `pops.json`). Todo
turno, `migrarSetores` (`motor/mercado/emprego.ts`) tira um pouco do setor que
paga menos e põe no que paga mais, entre os que o pop já tem e os que ele
declara em `treina.para`. Pop sem `treina` não muda.

- Velocidade: `PASSO_SETOR` (0,5% do pop por turno) × índice de `treina.exige`
  (0 a 1, ex.: instrução). Instrução zero = ninguém muda.
- Só muda se o destino paga pelo menos 5% a mais. Quando a gente entra, o
  salário médio do setor cai, e isso freia a corrida.
- Universidade não é construção: o estudo é simulado pelo índice de instrução.
- Aparece na tela do Mercado (empregos e salário por setor).

## Renda por fonte (fase dos pops, passo B1, 15/nov)

- A renda bruta de cada pop vem de fontes, com a parte de cada uma medida no
  turno 0 (`fontesDaRenda` em `turno/etapas/populacao.ts`):
  - **salário de setor**: (1 − capital) × peso do setor; anda com a capacidade
    do setor e o nível geral de preços;
  - **lucro de setor**: capital × peso; é a receita menos os salários, e na
    receita só conta o preço do setor contra a média dos setores;
  - **Estado**: `publico` do pop (0 a 1); anda com o gasto com pessoal (leis de
    gasto sem `para`, mais o gasto fora das leis);
  - **pago por outros**: `pago_por` (peso de cada estrato); anda com a parte
    desse estrato na renda disponível;
  - **desvio** (B2): a corrupção dos órgãos (`desvioDosOrgaos`: verba ×
    corrupção × 0,3) sai do que pagaria o Estado e vira renda dos pops com
    `desvio` (peso), medida por unidade do PIB;
  - **fixa**: o que sobra de um pop sem setor nem `pago_por` (nenhum hoje).
- Quem não trabalha (B3) vive de família ou bico pelo `pago_por` (aposentados,
  estudantes, desempregados, cuidam da casa), e mais das transferências que o
  país tiver: a lei com `para: { pop }` paga só aquele pop, dividida pelas
  pessoas dele (aposentadoria aos aposentados, bolsa de pesquisa aos
  estudantes). O seguro-desemprego entra no passo C.
- No turno 0 toda fonte vale 1 e cada pop fica com a parte declarada. Depois a
  soma das rendas brutas continua sendo o PIB: a fonte que cresce tira das
  outras. A verba muda quem recebe, não o tamanho do PIB.
- Mesma conta para todas (conserto de 15/nov): salário e lucro de setor são
  nível (capacidade × preços); Estado, desvio e pago por outros são parte do
  PIB e por isso andam × o PIB nominal contra o do turno 0 (`neutro`), como a
  fonte que não tem índice e o pop sem fonte. Antes disso, quem vivia do Estado
  ou de outros perdia ~12% de renda real em 4 anos sem lei nenhuma.

## Pop sem estrato fixo (passo B4, 15/nov)

- O pop pode declarar `divisao`: parte das pessoas e da renda em cada estrato
  (cada uma soma 1). Hoje: aposentados e estudantes.
- Toda conta por estrato pega cada pedaço no seu: imposto de um estrato,
  transferência de um estrato e o vazamento dela, a parte da renda de cada
  estrato e quem paga o bico. O `estrato` do pop fica para subir e descer.
- A renda do pop continua uma média só; a cesta não separa o aposentado pobre
  do rico.

## Troca na mesma faixa (passo B5, 15/nov)

- O pop pode declarar `muda: { para, exige? }`: outro pop do mesmo estrato
  (ex.: ofícios → autônomos com negócio → pequenos empregadores; gerentes →
  grandes empresários).
- Compara quanto cada um melhorou desde o turno 0 (renda real ÷ a do turno 0),
  não quanto ganha: sem lei, ninguém muda. Com o destino 5% à frente, um
  pouco muda; com 30% à frente, até 0,5% do pop por turno, vezes o índice
  `exige` (se houver). Mesmo limite de 30% do declarado.

## Vagas e desemprego (passo C, 15/nov)

- O mundo declara em `pops.json › emprego` o pop dos desempregados, os pops
  fora da força de trabalho e as duas leis do seguro (valor e duração).
- Vagas de cada pop: a capacidade dos setores onde ele trabalha contra a do
  turno 0, dividida pelo crescimento normal do país; a parte paga pelo Estado
  não perde vaga. Falta vaga: 30% da diferença vai aos desempregados por turno;
  sobra vaga: 25% volta deles. Desempregados nunca abaixo de 30% do declarado;
  um pop não perde mais de 60% da gente.
- O índice Desemprego é o declarado mais o que a taxa (desempregados ÷ força
  de trabalho) andou; Ocupados acompanha.
- Seguro-desemprego: quem foi demitido nos últimos `duração ÷ 2` turnos
  recebe `valor` × o PIB por pessoa; sai do gasto público e chega aos
  desempregados no turno seguinte.

## Cesta pela renda e padrão de vida (passo D, 15/nov)

- A cesta (`mercado/produtos.json › cestas`) pode declarar `fatia`: a parte
  da renda que cada estrato gasta nela no turno 0. O consumo por pessoa do
  estrato é fatia × renda por pessoa dele, dividido para a média da população
  dar 1: o total do país não muda, muda quem consome quanto
  (`consumoDasCestas`).
- Padrão de vida do pop: `poder` = renda depois das cestas, descontada a
  inflação; `padrao` = 50 × poder ÷ poder do turno 0, de 1 a 99.
- Fome e carência olham a renda espalhada dentro do pop (±50%, a mesma do
  bolso): a ponta mais pobre do pop cai abaixo do corte antes da média.

## Crianças, família e ciclo da vida (passo E, 15/nov)

- Pop `dependente` (crianças, 0,5): sem renda do PIB. Em cada estrato, cada
  adulto vale 1 unidade de consumo e cada criança 0,5; o adulto dá às suas a
  parte da renda delas, no nível dele (`familia`, − no adulto, + na criança).
  A divisão das crianças por estrato sai dos adultos do país × `filhos`
  (pobre 1,3, médio 1, rico 0,7). Não pagam imposto de estrato.
- `casa` do adulto: ele e as crianças dele; a renda da casa é a renda dele
  dividida por todos. Conta da casa (bolso), seguro na folha, informal e campo
  contam a casa.
- Ciclo (`pops.json › demografia`): a criança cresce em 15 anos e vira
  estudante; o estudante se forma e vai para quem trabalha; o trabalhador se
  aposenta; o aposentado morre e nasce o mesmo tanto, no ritmo do turno 0.
  Sem lei, nada anda. A idade mínima de aposentadoria é a tomada: cada 10 anos
  a menos dobram quem se aposenta por turno.

## Estados (passo F, 15/nov)

- O país declara os estados em `paises/<país>/estados.json`: parte da
  população e parte dela no campo. Sem arquivo, o país é um estado só.
- `popsPorTerritorio`: os pops do campo (`moradia.pops_campo`) seguem a gente
  do campo de cada estado; os outros, a da cidade. A soma dá cada pop inteiro.
- Ninguém lê ainda: voto, energia e governadores por estado vêm depois.

## Saída (passo G, 15/nov)

Regras em `pops.json › saida`; cada saída tem a sua causa e a sua tomada (a
soma de `valores[chave]` das leis em vigor; na régua, × a posição na faixa).

- Informal: tomada `informal` (parte dos `formais` que o custo da folha tira da
  carteira). O encargo anda 5% do caminho por turno; quem sai vai ao pop
  informal e volta se o encargo cai. A verba de `lei_fiscal` contra a do turno
  0 multiplica o alvo (mais verba, até ½; menos, até 1,5×).
- Emigrar: com o padrão de vida abaixo de 50, sai até o teto do estrato
  (pobre 2%, médio 5%, rico 10%) ou o `emigra` do pop, × a piora; volta quando
  melhora. Tomada `trava_emigrar` (0 a 1). Quem sai deixa a população no
  turno seguinte; as partes dos outros pops sobem para eles não mudarem.
  Profissionais de saúde têm regra própria (motor/atendimento) e `emigra` 0.
- Dinheiro: com o padrão de vida médio dos ricos abaixo de 50, até 30% da renda
  deles vai para fora. Tomada `trava_dinheiro` (controle de saída: 0,6). O que
  está fora não paga as bases que `foge` (renda, patrimônio, aplicações,
  dividendos) e não vira investimento aqui (motor/turno/economia).
- Limite: quem emigra não encolhe o PIB; a mesma renda fica para menos gente.

## Serviço e direito (passo H, 15/nov)

- Serviço (`pops.json › servicos`, `servicos.ts`): cada serviço aponta um
  índice que diz quem é atendido (% da população) e um `valor`, a parte da
  renda por pessoa do estrato `de` no turno 0 que o serviço inteiro vale
  (saúde 8%, saneamento 3% da renda do pobre; para calibrar).
- Quem chega antes: peso por estrato (`acesso`) ou por pop (`pops`, ex.: o
  campo por último). `coberturaDosPops` enche a fila pelo peso até somar a
  parte do índice, sem passar de 1 por pop; o pop guarda `servicos`.
- O valor entra no `poder` do padrão de vida: parte atendida × valor (fixo do
  turno 0, no marco). Perder o serviço baixa o padrão, e o pobre sente mais.
  Serviço novo (educação, segurança) é uma linha a mais no bloco.
- Direito: `TipoPop.direitos` diz quanto o pop liga para cada chave (−1 a 1);
  as leis dão a chave pela tomada. O pop guarda `direito` (−1 a 1), fora do
  padrão de vida; quem lê é o passo I. Nenhuma lei nem pop declara chave
  ainda: entram na revisão das leis.
- O índice "Padrão de vida" segue com base, leis e saneamento por fora (9 leis
  apontam para ele); juntá-lo ao padrão dos pops fica para a revisão das leis.
