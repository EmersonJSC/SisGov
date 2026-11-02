# Mercado: setores e produtos

Os setores e os produtos são do mundo (`conteudo/mundo/mercado/produtos.json`);
o motor não conhece os nomes. Produto não tem nome de empresa nem de país
real. Tempo: turno = 2 meses.

## Comportamento esperado (escrito antes; passo 12)

### Fatia 1: setores e produtos (aprovado em 02/nov/2026)

- Um **setor** é um grande grupo de produtos (como no Vic3): `id`
  (kebab-case), `nome` e `descricao`.
- Um **produto** tem `id` (kebab-case), `nome` e o `setor` a que pertence.
- Setores de partida: essenciais, infraestrutura, indústria, tecnologia e
  informação, militar, luxo e construção civil. Quem decide o que cada setor
  faz nas contas são as fatias seguintes; aqui só existem.
- O validador recusa: produto sem setor, produto de setor que não existe, id
  repetido (setor ou produto), setor sem nenhum produto, nome vazio.

### Fatias seguintes (ainda não)

2. O país declara o que produz; o que não produz, compra de quem produz.
3. Pops com empregos nos setores; salário e lucro (as leis do passo 13 leem).
4. Preço mundial por produto, ciclos e choques que vêm de fora; PIB e bases
   dos impostos saem da produção e dos pops (países de teste continuam dando o
   resultado de hoje).
