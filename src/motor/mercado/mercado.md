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

### Fatia 2: o país produz uma parte, o resto vem de fora (aprovado em 02/nov/2026)

- O país declara, por produto, a **cobertura**: quanto da demanda do país a
  produção dele atende, em % (0 a 200). 100 = se basta; abaixo disso, compra
  o que falta; acima, vende o excesso. Falta produto na lista = erro.
- O **mundo** declara quem fornece cada produto: as potências e a parte de
  cada uma (soma 1). Potência que não existe = erro.
- Conta: **importa** = o que falta para 100; **exporta** = o que passa de 100;
  cada **fornecedor** entrega sua parte do que o país importa.
- **Dependência** de uma potência = média, nos produtos, do que o país compra
  dela (em % da demanda). É só leitura: efeito nas contas vem na fatia 4.
- Tela: janela "Mercado" (botão no topo), como a do Vic3: produtos separados
  por setor, cada um com a barra de produção, o que importa (e de quem), o que
  exporta; no pé, a dependência de cada potência.

### Fatias seguintes (ainda não)

3. Pops com empregos nos setores; salário e lucro (as leis do passo 13 leem).
4. Preço mundial por produto, ciclos e choques que vêm de fora; PIB e bases
   dos impostos saem da produção e dos pops (países de teste continuam dando o
   resultado de hoje).
