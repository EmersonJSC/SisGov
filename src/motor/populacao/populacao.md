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

Na V1 o tamanho de cada pop fica na parcela declarada (sem migração).

Comportamento esperado (escrito antes), país de teste, `npm run pops`:

- turno 1: renda média por pessoa = PIB nominal ÷ população; empresário
  bem acima (5×), informal bem abaixo (¼);
- imposto de renda 20% → 30%: a renda de **todos** os pops cai na mesma
  proporção, a bruta não muda;
- transferência de renda 2% → 4% do PIB: a renda dos três pops pobres sobe,
  a dos médios e ricos não muda;
- num mandato sem mudar nada: todas as rendas sobem com o PIB nominal, e a
  ordem entre os pops não muda.
