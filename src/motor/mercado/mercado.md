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

### Fatia 3: dois mercados, o do país e o do mundo (aprovado em 02/nov/2026)

- Cada **potência** declara a sua cobertura de cada produto (0 a 200), igual
  ao país. Sai a tabela de partes fixas; `mundo/mercado/produtores.json`
  passa a ser `{produção: {potência: {produto: cobertura}}}`.
- O país **não precisa listar todos**: produto que ele não declara conta
  cobertura 0 (compra tudo do mundo). Sem arquivo `producao.json`, o país
  compra tudo; a janela abre sempre.
- **Fornecedores** do que o país importa: cada potência entra com o seu
  excedente (cobertura acima de 100). Se nenhuma tem excedente, entram todas
  pela cobertura. A conta é a mesma da fatia 2, só muda de onde vem a parte.
- **Preço do mundo** por produto, base 100, no estado (o país não mexe nele):
  alvo = 100 × (demanda ÷ oferta)^1,5, com demanda = 100 × nº de potências e
  oferta = soma das coberturas; limitado a 40–250. Começa no alvo (variação 0).
  A cada turno anda 25% do caminho até o alvo, mais um ruído pequeno (±2%)
  que depende só do turno e do produto (não gasta o acaso da partida).
  **Variação** = % contra o turno anterior.
- **Mais barato**: a potência com maior cobertura do produto.
- Tela: a janela "Mercado" ganha duas abas. **País** (como hoje: produz,
  importa de quem, exporta, dependência). **Mundo**: por setor, o preço, a
  variação (seta de em alta ou em baixa) e quem vende mais barato; no topo,
  os 3 **em alta** e os 3 **mais em conta**.
- Partida salva antes disto: preços recomeçam do alvo.

### Fatias seguintes (ainda não)

4. Pops com empregos nos setores; salário e lucro (as leis do passo 13 leem).
5. Choques e ciclos que vêm de fora sobre o preço; PIB e bases dos impostos
   saem da produção e dos pops (países de teste continuam dando o resultado
   de hoje).
