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

### Fatia 4: pops com emprego nos setores, salário e lucro (aprovado em 02/nov/2026)

- Cada tipo de pop do mundo (`mundo/pops/pops.json`) ganha `setores` (peso de
  cada setor; soma 1; vazio = sem emprego formal, caso dos informais) e
  `capital` (0 a 1: parte da renda bruta que é lucro; o resto é salário).
  O país não declara nada novo. O validador barra setor que não existe, peso
  negativo, soma diferente de 1 e capital fora de 0 a 1.
- Por setor, calculado do estado (nada novo no estado, partida salva serve):
  - **empregos** = Σ pessoas do pop × peso × (1 − capital), em % da população;
  - **massa salarial** = Σ pessoas × renda bruta por pessoa × (1 − capital) ×
    peso, em % do PIB;
  - **salário médio** = massa ÷ empregos, em vezes a renda média por pessoa;
  - **lucro** = Σ pessoas × renda bruta × capital × peso, em % do PIB.
- Fora dos setores: as pessoas sem emprego formal (% da população).
- Conferência: a soma de massa salarial e lucro dos setores mais a renda dos
  sem emprego formal dá o PIB nominal (nada se perde nem se cria). O PIB e os
  impostos não mudam (isso é a fatia 5).
- Aba "Do país": cada setor mostra empregos, salário médio e lucro.

### Fatia 5a: choques e ciclo sobre o preço do mundo (aprovado em 02/nov/2026)

- Só o **preço do mundo** muda; PIB, impostos e emprego ficam como estão.
- **Ciclo**: a demanda do mundo ondula devagar, igual para todos os produtos:
  fator = 1 + 8% × sen(2π × turno ÷ 24) (24 turnos = 4 anos). Multiplica o
  alvo do preço. No turno 0 o fator é 1.
- **Choque**: a cada turno, cada produto sem choque ativo tem 2% de chance de
  sofrer um (sorteio que depende só do turno e do produto, não gasta o acaso
  da partida). O choque é um fator sobre o alvo: de 1,3 a 1,8 (falta, preço
  sobe) ou o inverso (sobra, preço cai), meio a meio.
- O choque **some aos poucos**: a cada turno o desvio do fator em relação a 1
  cai 40%; abaixo de 2% o choque termina.
- Os choques ativos ficam no estado (`choques`: produto → fator). Partida
  salva antes disto começa sem choques.
- O preço continua andando 25% do caminho até o alvo, com piso 40 e teto 250,
  então o choque aparece em alguns turnos como seta de alta ou baixa na aba
  "Do mundo".
- Mesma semente e mesmos turnos dão os mesmos choques.

### Fatias seguintes (ainda não)

5b. PIB e bases dos impostos saem da produção e dos pops (países de teste
continuam dando o resultado de hoje). **Adiada** (02/nov): vem depois de
mais pops. O passo 12 foi fechado sem ela.
