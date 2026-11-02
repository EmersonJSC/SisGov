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

### Fatia 6: demanda dos pops, oferta, preço do país e fome (6a a 6d em código, 02/nov/2026)

Desenho completo: a cobertura deixa de ser número declarado e vira resultado.
Referência de como o Vic3 faz: `docs/jogo/mercado-vic3-referencia.md` (só a
ideia; nomes, textos e números são nossos). Entra em pedaços, a comida
primeiro; os outros produtos só depois de o autor confirmar a comida na tela.

**6a. Produtos novos e demanda por produto (só os de comida)**

- Dois produtos novos no setor Essenciais: **Grãos** e **Frutas** (o que o
  campo colhe). **Alimentos** segue como o processado. "Agro" não é produto:
  é um grupo de pop (etapa de pops e grupos). A ligação entre eles (o
  processado usa grão e fruta como insumo) é a "cadeia produtiva" da seção 11
  do escopo; aqui os três são produtos independentes e o pop troca entre eles.
- Unidade: tudo em **valor a preço base, em % do PIB** (igual ao resto do
  motor). Preço base = 100.
- **Demanda de comida** = população × **cesta**. A cesta é a mesma quantia por
  pessoa em qualquer pop (o mínimo para viver), em % da renda média por pessoa
  a preço base (ponto de partida: ajustar medindo). Quem é pobre gasta uma
  fatia maior da renda com a mesma cesta; é assim que o bolso pesa.
- Os três produtos atendem a mesma necessidade. A parte de cada um na cesta é
  proporcional a **peso ÷ preço do país**: se o grão encarece, o pop come mais
  fruta e processado (troca livre, soma fecha a cesta).
- **Oferta** do produto = produção do país + importação.
  - Produção inicial = cobertura declarada hoje × demanda inicial ÷ 100; o
    `producao.json` dos países serve como está (com Grãos e Frutas listados).
  - Importação = o que falta, limitada ao excedente que as potências têm do
    produto (`produtores.json`, com Grãos e Frutas listados).
- **Cobertura** passa a ser resultado: produção ÷ demanda, em %.
- **Preço do país** = base × faixa × mistura com o mundo:
  - faixa = 1 + 0,75 × limite((demanda − oferta) ÷ o menor dos dois, −1, +1),
    ou seja, 25% a 175% do base;
  - mistura = (1 − m) + m × preço do mundo ÷ 100, com m = importação ÷ oferta
    (o que vem de fora custa o preço do mundo).
- **Prédios na tela, sem simular um a um**: o produto declara uma `unidade`
  (nome, ex. "fazendas", e tamanho em % do PIB); a tela mostra "≈ N unidades"
  = produção ÷ tamanho. Investir para crescer a capacidade vem com a 5b.

**6a feita (02/nov/2026):** `demanda.ts` (`contaDoPais`), Grãos e Frutas no
mundo, `cestas` e `unidade` em `produtos.json`, `populacaoBase` no país. A
produção fica fixa (muda com a 5b). A parte de cada produto na cesta usa duas
passadas (preço do mundo, depois o do país); por isso a cobertura mostrada
pode diferir 1 ponto da declarada. Importação limitada pelo excedente soma das
potências (em % da demanda). Pesos 0,5 / 0,2 / 0,3 e cesta de 12% da renda são
pontos de partida.

**6b. Fome (segurança alimentar) por pop**

- Por tipo de pop: **gasto com comida** = cesta × preço ÷ renda por pessoa (em
  %); **falta** = (demanda − oferta) ÷ demanda, quando positiva, igual para
  todos.
- **Segurança alimentar** = 100 − gasto com comida − falta, entre 0 e 100.
  **Fome leve** abaixo de 40; **fome grave** abaixo de 20 (pontos de partida).
- A tela mostra a segurança de cada pop e quantos % da população estão em fome
  leve e grave. **Efeito** em nascimentos, mortes e apoio dos grupos **não
  entra aqui**: é proposta própria depois de medir (6c).

**6c. Reação à comida, para os dois lados (aprovada e em código, 02/nov/2026)**

- Novo índice do mundo, **abastecimento** (0 a 100): a segurança alimentar média
  da população, pesada por pessoas. Sobe com comida barata e abundante; cai com
  comida cara ou em falta.
- **Grupos** cobram o índice (sentido +1), como cobram os outros: medem a
  mudança desde o marco do turno 0. Comida mais farta e barata, os grupos
  gostam (mais os pobres); comida pior, perdem apoio. Quando volta ao normal,
  o apoio volta devagar: a reação é por mudança, não é um interruptor.
- **Fora do país:** o índice `reputacao_internacional` reage nos dois sentidos,
  com atraso. Abastecimento alto e exportando comida sobe a reputação (país
  estável, que ajuda os outros); fome grave a derruba (crise humanitária).
  Quanto à opinião de cada potência, só entra o que a reputação já move.
- **Saúde e pobreza** (índices que já existem): fome alta derruba a saúde e sobe
  a pobreza, com atraso de 1 a 2 turnos; abastecimento melhor faz o contrário,
  mais fraco.
- Forças por nível (`fraca`, `media`, `forte`), nunca número solto; a lei de
  como medir fica no JSON do mundo, não no motor.
- **Fora desta fatia:** nascimentos e mortes (a população hoje é fixa). Fica
  para uma etapa de demografia, pois mexe no PIB, nos impostos e nos pops.

**Como ficou (6c):** a cesta declara no JSON o índice que recebe a média
(`indice`) e a `reacao` (escala 30 pontos, ganho 0,5 quando melhora, efeitos em
saúde, pobreza e reputação, todos `media`). O desvio é o índice de hoje menos o
do turno 0, lido do turno anterior (1 turno de atraso). Grupos de trabalhadores
e classe média cobram o índice. Medido: a importação amortece a crise (as
potências têm sobra de grãos), então os números são pequenos; é ajuste do
"equilibramos". Reputação por exportar comida ainda não entrou.

**Conferência de 6c:** comida pior reduz o apoio dos grupos pobres e a
reputação; comida melhor sobe os dois; voltar ao normal devolve o apoio aos
poucos; mesma partida e mesma semente dão o mesmo resultado.

**6d. Remédios, a segunda cesta (em código, 02/nov/2026)**

- **Remédios** segue o mesmo molde da comida: cesta própria (`remedios`), o
  produto entra nela com peso 1. Tamanho de partida: 3% da renda média
  (a comida é 12%). O povo compra, a falta pesa na saúde.
- Índice novo do mundo, **acesso a remédios** (0 a 100): a mesma conta da
  segurança da comida (100 menos o gasto, menos a falta), média por pessoas.
  Abaixo de 40 é carência leve; abaixo de 20, grave.
- Reação nos dois lados, pelo mesmo desvio contra o turno 0: **saúde** (forte)
  e **pobreza** (fraca, doença custa renda). Remédio melhor faz o contrário,
  mais fraco (ganho 0,5). Reputação não entra aqui.
- O motor passa a aceitar **várias cestas com índice**: as reações somam. O
  texto de "fome" vira o `termo` que a cesta declara (comida: "fome";
  remédios: "carência").
- Fora desta fatia: grupos cobrando o acesso, Energia, Moradia, Infra e os
  demais (cada um com regra própria, seção 11 do escopo).
- **Conferência:** a falta de remédios derruba o acesso e a saúde; sobra
  melhora; a comida segue igual; mesma partida e semente dão o mesmo resultado.

**Como ficou (6d):** `cestas` com `termo` e `indice` no JSON; o turno soma as
reações de todas as cestas com índice. Remédios: tamanho 0,03; saúde `forte`,
pobreza `fraca`. Medido na tela: acesso 93 no país de teste. Como a comida, a
importação amortece a falta. Grupos ainda não cobram o acesso.

**Depois (ainda não):** os outros 18 produtos com a mesma regra; depois a 5b.

**Tela (6a e 6b)**: aba "Do país" da janela Mercado mostra, por produto,
demanda, produção, importação, preço do país contra o base e as unidades;
bloco "Comida na mesa" com a segurança alimentar por pop.

**Conferência (testes)**: mesma partida e mesma semente dão o mesmo resultado;
população maior sobe a demanda; produção menor sobe o preço até o teto de
175%; pop pobre cai em fome antes do rico quando a comida encarece; com a
cesta atendida e preço no base, ninguém fica em fome.

### Fatia 7: Energia, capacidade contra demanda (em código, 02/nov/2026)

Energia não é cesta: não se guarda e viaja longe pela rede de transmissão
(uma usina abastece regiões distantes). A regra é de **capacidade**.

- **Oferta (capacidade):** soma das fontes; cada fonte tem capacidade, que cresce
  quando o Estado investe e só chega depois do prazo de obra (em turnos).
  A rede de transmissão limita quanto da capacidade chega ao consumo.
- **Demanda:** das pessoas (fixa por pessoa) mais das empresas, que **pedem mais
  energia conforme evoluem** (indústria maior, mais demanda).
- **Se a demanda passa da capacidade (decidido: A):** a energia vai primeiro
  para os civis e o que sobra vai para as empresas. Falta pouca: só as empresas
  sentem, o crescimento é freado e o preço da energia sobe. Os civis só
  entram na falta se ela passar de toda a demanda das empresas (crise grave),
  com efeito fraco em saúde e apoio. Sem investir, o país fica para trás (a
  demanda cresce e a capacidade não).
- **Cinco fontes**, cada uma com custo, prazo, emissão e risco:
  - hidrelétrica: barata de operar, cara e lenta de construir; pesa no ambiente local.
  - térmica fóssil: rápida e barata de construir; polui; sofre com o preço do combustível lá fora.
  - nuclear: muita energia constante; muito cara e lenta; risco e exige segurança.
  - solar: cada vez mais barata; varia com o dia; pede rede e reserva.
  - eólica: parecida com a solar, em outro ritmo.

**Leis (pacote da Energia, leis pequenas; autor, 02/nov/2026):** pacote é um
tema dividido em várias leis, nunca uma lei com opções grandes. Terceirizar e
estatizar ao mesmo tempo é possível porque cada camada tem a sua lei.
- 5 verbas, uma por fonte (% do PIB ao ano; faixa de 0 a 3%).
- 3 leis de "quem": **quem constrói as usinas** (Estado / concessão / mercado
  livre), **quem opera a rede** (estatal / concessão) e **quem vende ao
  consumidor** (estatal / regulada / privada). Cada opção diz, no
  `produtos.json` (`camadas`), o que faz na rede: parte da obra paga por
  empresas (a mesma verba compra mais), ganho de capacidade da rede e margem
  no preço.
- Depois, uma de cada vez: tarifa social, subsídio à energia limpa, imposto
  sobre combustível fóssil, licenciamento de usinas, fiscalização nuclear.
- Todas na bolha própria "Infraestrutura e energia".
- Efeitos só em índices que já existem; força por nível; atraso em turnos.

**Como ficou (7):** `capacidades` no `produtos.json` (demanda em pontos, turno 0 =
100: civis 35, empresas 65 que crescem com o PIB real; cada fonte com `lei`,
`prazo` em turnos, `custo` em pontos por 1% do PIB num ano e `desgaste` ao
ano). O país declara a capacidade pronta em `producao.json` (105 pontos). O
estado guarda, por fonte, a capacidade pronta e a fila de obras: o que a lei
paga hoje só chega depois do prazo. Falta: o freio tira até 8 pontos de
crescimento ao ano (proporcional à falta das empresas); o preço acima do base
soma à inflação sentida (0,05 ponto por ponto de preço); crise grave nos civis
baixa a saúde (fraca). Sem falta, nada muda nos países de teste (o gasto das 5
leis saiu do `gasto_fora_das_leis`). As 5 leis estão na área Economia; o
meio ambiente vem dos efeitos delas, não da capacidade pronta.

**Ficou para depois (7):** as outras 5 leis do pacote (lista acima); o risco da
nuclear; a rede de transmissão como limite por região. O produto "Energia" saiu
da tabela de produtos (a energia é só o bloco de capacidade).

**Conferência (testes):** mesma partida e semente dão o mesmo resultado; demanda
maior que a capacidade freia o crescimento e sobe o preço; investir amplia a
capacidade só depois do prazo; fóssil piora o ambiente e limpas melhoram.

### Fatias seguintes (ainda não)

5b. PIB e bases dos impostos saem da produção e dos pops (países de teste
continuam dando o resultado de hoje). **Adiada** (02/nov): vem depois de
mais pops. O passo 12 foi fechado sem ela.
