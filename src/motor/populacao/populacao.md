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
