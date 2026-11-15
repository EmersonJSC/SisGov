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
