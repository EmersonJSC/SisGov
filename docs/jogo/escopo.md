# Escopo do SisGov

> **Status: APROVADO em 31/out/2026** (recomeço do projeto). Único documento
> vivo de regras e de ordem de construção. O escopo antigo, o PLANO e as
> mecânicas estão em `docs/historico/projeto-antigo/`; cada decisão trazida de
> lá diz a data de origem. Experiência do jogador: [experiencia.md](experiencia.md).

## 1. O jogo

Simulador de **governo**. O jogador é um partido recém-chegado ao poder e
governa **aprovando leis**; não constrói nada diretamente (21/out). Cada lei
tem consequência própria e sentida. Parecer um governo de direita ou de
esquerda é resultado das leis, nunca objetivo (31/out).

- **Vitória:** manter-se no poder. **Derrota:** perdê-lo. Na V1 o poder só se
  perde na eleição (24/out; generalizado em 31/out).
- **Sem meta pronta:** o jogador leva o país para onde quiser; quem joga bem
  tende a industrializar, mas o jogo não exige (24/out).
- Gênero: Democracy 4 com mercado do Victoria 3, sem copiar nada dos dois (21/out).

## 2. Princípios

1. **Leis são o núcleo.** Todo o resto lê as leis; mudar uma lei muda o jogo (31/out).
2. **Mundo sem país.** Leis e índices são genéricos. O país só declara o
   estado de partida e pode trocar nomes ("juros" → "Selic") (25/out).
3. **O Congresso é a trava, não o jogo.** O jogador pode propor qualquer
   coisa; o que é exorbitante o Congresso barra. Fora isso, o que segura é a
   consequência. A trava de gasto ≤ 100% do PIB sai do desenho; se ficar, é
   só proteção interna contra erro do motor (31/out).
4. **País é só dado.** Criar um país é declarar o estado de partida; o motor
   simula a situação dele em proporção, não com precisão real. Nada é
   inventado no código para um país (31/out). A contabilidade fecha sempre:
   gastar exige imposto, dívida ou emissão (24/out).
5. **Tempo dos efeitos.** Cada efeito declara quanto demora para chegar
   inteiro. O custo do que é popular vem pela contabilidade (dívida, juros,
   inflação), não por uma regra "popular custa caro" — os estudos não
   sustentam essa regra como universal (31/out).
6. **Jogabilidade primeiro, realidade como base, sem exagero.** Lei inventada
   vale se for plausível; número não precisa de precisão empírica, mas fica
   na ordem de grandeza certa (31/out).
7. **O motor conhece o Estado, não as leis.** O motor conhece os índices
   essenciais e os cálculos econômicos estudados (curva de Laffer, evasão,
   multiplicador, defasagem da política monetária…); o Estado pode ser
   complexo. Não conhece nomes de leis, partidos ou países (31/out).

## 3. Tempo

- Turno de **2 meses** (30/out); mandato de N anos = **6N turnos**
  (4 anos = 24, 5 anos = 30). N vem de uma lei essencial do país (31/out).
- O país declara o limite de reeleição do candidato; o partido continua no
  poder enquanto vencer (21/out).

## 4. Índices (31/out)

- **Essenciais**, sem os quais um Estado não funciona: população, ocupados,
  desemprego, PIB real, crescimento, nível de preços, inflação, PIB nominal,
  receita, gasto, resultado, dívida, juros. **São do motor:** tipos no código,
  com as contas entre eles. O país pode trocar o rótulo.
- **Jogabilidade**, o que o jogador sente e os grupos cobram: padrão de vida,
  instrução, industrialização, saúde, segurança, pobreza, desigualdade,
  corrupção, liberdades, polarização, meio ambiente, reputação
  internacional, aprovação. Ficam no JSON
  (`src/conteudo/mundo/indicadores/variaveis.json`).
- População é número real de pessoas (21/out).

## 5. Leis (31/out)

- **Duas camadas.** _Essenciais_: a estrutura do Estado (duração do mandato,
  regime, banco central e moeda, impostos básicos); mudam raramente e com
  quórum alto. _Jogabilidade_: as políticas.
- **Duas formas.** Lei com valor em % (alíquota, gasto) é contínua, na
  unidade real e com faixa própria. Lei sem valor em % (pena de morte, tipo
  de moeda) é de opções.
- **A lei declara tudo; o motor interpreta.** Efeitos, quem afeta, quem apoia
  e quem rejeita, e qual cálculo do motor usa (ex.: imposto de renda → base
  "renda", com Laffer e evasão do motor). A lei não traz fórmula própria.
- O texto da tela é gerado dos números da lei: texto e motor não discordam.
- **Poucas e eficientes na V1**; mais leis depois.
- **Gasto também é lei** (01/nov): saúde, educação, polícia… são leis
  contínuas em % do PIB. O que o país gasta e ainda não virou lei fica em
  `gasto_fora_das_leis`, como a receita.
- **Nenhuma lei é um controle só que faz coisas grandes** (01/nov). Cada
  tema se divide em leis menores, cada uma com uma escolha de verdade (ex.:
  proteção ambiental = polícia ambiental, licenciamento, áreas protegidas…).
  Uma lei grande só vale como primeira versão, já sabendo em quais leis ela
  se divide.
- **Referências do mundo do jogo** (01/nov): lei, opção e texto nunca se
  descrevem por país real ("como a Suécia"). Medem-se pelo próprio país da
  partida (ex.: faixa de imposto em múltiplos da renda média do país).

## 6. População e grupos

- Direção: **meio-termo entre Victoria 3 e Democracy 4**. Pops (profissão ×
  estrato, ~15 a 25) com tamanho em pessoas e renda calculada pelo motor;
  grupos de interesse leem os pops (21/out; direção em 31/out).
- Cada grupo tem satisfação e dois estoques, **radicais** e **lealistas**,
  que sobem e descem devagar (21/out).
- A eleição é decidida pelo **apoio pesado pelo tamanho**, contra o
  adversário (24/out).
- Desenho do passo 7: `src/motor/populacao/populacao.md` e `src/motor/grupos/grupos.md`.

## 7. Regime e Congresso (31/out)

- O regime vem das leis essenciais do país: quem aprova lei (câmaras,
  quórum, veto), quem escolhe o governo e como se perde o poder.
- **V1:** presidencialismo (Brasil, EUA) e parlamentarismo.
- **Partidos são do país** (01/nov): o mundo sabe que existem partidos; os
  nomes, as cadeiras e os grupos que cada um defende são declarados pelo
  país. O jogador é um partido; concorre e faz coligação com os outros.
  Desenho em `src/motor/politica/politica.md`.
- **Depois (outra versão ou DLC):** regime de partido único (China). Mesmo
  motor, outra estrutura de "parlamento"; o motor não pode fechar essa porta.

## 8. Eleição e desgaste (21/out)

- Eleição a cada fim de mandato; perder é fim de jogo.
- **Desgaste** sobe sempre, num valor fixo por período no poder (custo de
  governar, ~2,25 pontos por mandato). A opinião segura enquanto o partido
  governa e despenca de uma vez numa crise ou eleição (cruzeiro e queda).
  O jogador reduz o desgaste, nunca zera.

## 9. Fora da V1

Tela elaborada (vem por último), ministros, dilemas e eventos, bússola
ideológica, mídia e redes, mercado do Victoria 3, escolha de país, STF,
pesquisa e tecnologia, regime de partido único.

Depois da 1.0 (01/nov, autor): a bússola já entrou; o mundo e o mercado
viraram os passos 11 e 12 (seção 10).

## 10. Ordem de construção

Um passo por vez. Cada passo só fecha quando o critério de pronto roda.
Ideia nova durante um passo vai para a seção 11, não para o passo.

| # | Passo | Pronto quando |
|---|---|---|
| 1 | Escopo | ✅ aprovado em 31/out |
| 2 | Índices | ✅ arquivo novo com as duas camadas (essenciais ainda migram para o motor no passo 4) |
| 2b | Fundação | ✅ 31/out — pastas das camadas, fronteiras no lint, `npm run check` verde ([plano](plano-de-desenvolvimento.md)) |
| 3 | Modelo de lei | ✅ 31/out — imposto de renda (contínua, base `renda` com Laffer e evasão; pico declarado pelo país) e pena de morte (opções); validador |
| 4 | Turno mínimo | ✅ 31/out — `npm run mandato`: força do efeito fraca/média/forte = 1/3/6 pontos (2/5/10 desde 01/nov, 6d) (tamanho inteiro, chega ao longo do atraso). Script joga um mandato; a lei em três valores dá três países diferentes, na direção que a lei promete |
| 5 | Contas | ✅ 01/nov — `npm run contas`: receita, gasto, juros, cofre e dívida separados; sobra vai ao cofre (abater dívida é lei futura); dívida acima da tolerância do país sobe os juros |
| 6 | Leis da V1 | ✅ 01/nov — 14 leis, cada uma conferida por script (`npm run impostos`, `gasto`, `ambiente`); país declara só as leis que tem; segundo país `teste-pobre` só em JSON (`npm run paises`); força dos efeitos 2/5/10 |
| 7 | Grupos | ✅ 01/nov — 6 pops com renda pelo motor (`npm run pops`); 4 grupos (trabalhadores, classe média, empresários, ambientalistas) com satisfação medida contra o turno 0; cada lei declara o que cada grupo quer dela (`npm run grupos`) |
| 8 | Congresso | ✅ 01/nov — partidos do país votam cada mudança de lei pelos grupos que defendem; mais de 1/3 da faixa num pedido é exorbitante e cai; partido da base com os grupos abaixo de 35 sai da coligação (`npm run congresso`) |
| 9 | Eleição e desgaste | ✅ 01/nov — desgaste de 2,25 por mandato; eleição no fim do mandato (lei `duracao-mandato`, 4 ou 5 anos) pelo apoio = satisfação pesada por pessoas − desgaste; perder encerra a partida (`npm run eleicao`). Os grupos passaram a medir a renda contra o crescimento esperado do país, senão o governo parado vencia |
| 10 | Tela | ✅ 01/nov — tela simples em React (`npm run dev`): país e semente, grupos, índices, leis com controle para propor, fila de pedidos, votação do Congresso, resultado da eleição; salvar e carregar no navegador (`partida/salvar.ts`). Partida inteira jogada na tela até a eleição |
| 11 | Mundo | ✅ 02/nov — 5 potências com opinião pela bússola, reputação (média pesada), poder defensivo e segurança externa (`npm run mundo`); leis de segurança (blocos A a E); losangos no mapa e chips Reputação e Seg. externa. Pedido: grandes potências que representam blocos reais, sem nome real, com relação entre si e opinião própria sobre o seu país que anda pela bússola; reputação internacional vira a média delas |
| 12 | Mercado | mercado global e mercado do país (o dos outros países é simulado); produtos do mundo em setores; o país declara o que produz e depende de quem faz o resto; pops com empregos; ciclos econômicos mexem nos preços |
| 13 | Leis em pacotes | um pacote por vez (seção 11, "Leis em pacotes") |

Peças do código antigo voltam só quando um passo precisar delas, depois de
lidas (tag `projeto-antigo-2026-10-31`).

## 11. Ideias para depois

- Quanto o eleitor percebe o déficit como parâmetro do país: em democracias
  consolidadas déficit pré-eleição não ajuda a reeleger; em novas, ajuda
  (Brender & Drazen, 2008).
- **Calote** (01/nov): o jogador pode deixar de pagar a dívida; juros
  explodem, crédito some, reputação internacional cai, grupos reagem.
  Depende de grupos (passo 7) e Congresso (passo 8).
- **Inflação que se move** (01/nov): hoje é o número fixo do país. Vem com
  emissão de moeda: acabou o cofre, o governo escolhe dívida ou moeda.
- **Regra fiscal** (01/nov): lei que decide quanto da sobra do cofre abate
  a dívida.
- **Progressividade do imposto de renda** (01/nov): lei separada da
  alíquota. A lei do imposto de renda diz **quanto** (a % líquida, média do
  país); esta diz **de quem**, com faixas medidas pela renda do próprio país.
  Não muda a arrecadação, só divide o peso. Precisa dos pops (passo 7).
  Na tela é uma **tabela de faixas** em "salários médios do país" (ex.: até
  1 → 0%; 1 a 3 → 10%; 3 a 10 → 20%; 10 a 20 → 30%; acima de 20 → 35%); a
  última faixa vale para todo mundo acima dela. Em aberto para o passo 7: a
  tabela pode virar a própria lei do imposto de renda, com a % média como
  resultado. A tabela é livre: plana, progressiva ou regressiva; o jogo não
  força nenhuma forma.
- **Público e privado em esferas separadas** (01/nov): saúde e educação com
  duas leis cada, gasto público (hospital e escola do governo) e apoio ao
  privado (voucher, subsídio, dedução no imposto). Setor privado como índice
  próprio, que cresce com o apoio e demora; privatizar cortando o público
  antes do privado crescer derruba a saúde no meio da transição. Sem efeito
  moral embutido ("privado = desigualdade"). Precisa da peça "índice mexe em
  índice" no motor.
- **Bases dos impostos lidas do mercado** (01/nov): na V1 a base de cada
  imposto (renda, consumo, lucro) é uma fatia fixa do PIB declarada pelo
  país. Quando vier o mercado com fila de construção (estatal ou privada,
  seção 9), o motor passa a somar a base dos prédios e dos pops; a lei e o
  país não mudam. Leis que liberam ou travam construção entram junto.
  Imposto sobre **herança** e sobre **grandes fortunas** (bases novas:
  patrimônio e herança) entram junto com o mercado (01/nov, autor).
- **Grandes mídias do país** (01/nov): o país declara até 5 grandes mídias
  (nome, alcance, linha). O jogador pode limitar cada uma, dar benefício a
  outras (verba de publicidade, concessão), criar uma emissora estatal e até
  banir as outras. Substitui a lei única "liberdade de imprensa". É a
  mecânica "mídia" da seção 9 (fora da V1 hoje).
- **Terras indígenas completas** (01/nov): na V1 é uma lei contínua (% do
  território demarcado) que só mexe em índices. Depois: povos indígenas e
  fazendeiros como grupos (passo 7), invasão e conflito de terra, e país
  sem povos indígenas, onde a lei nem aparece.
- **Revogar lei e lei que não se aplica ao país** (01/nov): o país declara
  só as leis que tem; a que falta fica não legislada e o jogador pode
  propor. Tirar uma lei em vigor (revogar) e esconder lei que não faz
  sentido no país: ficaram fora do passo 8 para ele não crescer.
- **Grupos: o que fica para depois** (01/nov, passo 7b): satisfação inicial
  declarada pelo país (hoje todo grupo começa em 50); grupo que o país cria
  ou tira; conservadores (segurança, pena de morte) junto com leis de
  costumes; o imposto de renda pesar diferente em cada pop (progressividade).
- **Congresso: o que fica para depois** (01/nov, passo 8): partido da base
  que volta quando os grupos melhoram; coligação feita ou desfeita pelo
  jogador e cadeiras que mudam com a eleição (passo 9); exorbitante em lei
  de opções; negociação e troca de cargos.
- **Campanha eleitoral** (01/nov, ideia do autor no passo 9): durante a
  eleição, o jogador apela na televisão e faz comícios para mexer no voto.
  Lei de **financiamento de campanha** (privado / misto / só público,
  mexe em corrupção e polarização) entra junto com a campanha.
- **Eleição: o que fica para depois** (01/nov, passo 9): reduzir o desgaste;
  radicais e lealistas pesando no voto; limite de reeleição declarado pelo
  país; cadeiras e coligação mudando depois da eleição; mudar a duração do
  mandato no meio dele pode antecipar ou adiar a eleição (decidir a regra).
- **Bússola política e pops que mudam** (01/nov, ideia do autor): leis (e
  cada opção ou ponta da faixa), grupos e pops têm posição em dois eixos,
  econômico (esquerda ↔ direita) e social (autoritário ↔ libertário). A
  reação conta eixo por eixo, com peso por eixo em cada grupo; substitui a
  lista de grupos dentro de cada lei. O pop é **maleável e devagar**:
  - a posição desliza um pouco por turno conforme a vida dele, a partir de
    onde está agora, sem ponto fixo para onde voltar: piorar empurra num
    sentido (renda caindo para a esquerda, crise e insegurança para o
    autoritário), melhorar empurra noutro; a história da partida fica
    marcada nos pops;
  - gente muda de pop aos poucos (mobilidade): o pobre que sobe vira classe
    média, quem perde o emprego cai para os informais; quem muda passa a
    pensar como o pop novo;
  - o pop entra mais no grupo mais perto dele (membros calculados, não
    escritos à mão), e os grupos crescem ou encolhem sozinhos.
  O mercado (seção 9) não simula pequena empresa: só setores e insumos
  (ex.: fábrica de farmacêuticos), lucro e salário que pagam, concorrência
  de fora × proteção do mercado interno. A mobilidade lê o que ele der
  (emprego e salário por setor), não falência de pequeno negócio.
  Ordem combinada: 1) bússola nos grupos e nas leis; 2) pops com posição
  que desliza pela renda; 3) mobilidade entre pops, junto com o mercado.
  Grupo guarda posição própria, não a média dos pops (os ambientalistas
  pegam um pedaço de cada pop e cairiam no centro).
- **Leis em pacotes** (01/nov, autor): nenhuma lei faz tudo; cada tema vira
  um pacote de leis pequenas, e cada uma gera reação num grupo diferente.
  Parado para fazer o mercado antes; volta depois, um pacote por vez:
  - **Imposto de renda, "como é cobrado"** (proposta pronta, falta o sim):
    faixa de isenção (0 a 2 salários médios do país), alíquota comum (a lei
    de hoje, acima da isenção), adicional sobre altas rendas (até +20 pontos
    acima de 5 salários médios), deduções (nenhuma / saúde e educação /
    amplas) e desconto na fonte (só declaração / no salário). A % média do
    país sai das regras. O motor passa a cobrar cada pop pelas regras e
    somar; cada pop é uma média, então a faixa anda em degraus. Decisão em
    aberto: a lei de hoje vira a alíquota comum (recomendado).
  - **Armas** (modelo aprovado): posse em casa (proibida / com licença /
    livre para adulto), porte na rua (proibido / licença especial / licença
    comum / livre), exigências da licença (nenhuma / exame e curso / exame,
    curso e motivo), registro (nenhum / da arma / da arma e da munição).
  - **Corrupção como processos**, não um órgão; **cargos de indicação**
    ainda amplos, abrir mais.
  - **Direitos, drogas (uma lei por droga) e ensino** (cotas por nível de
    ensino, leis dos dois lados da bússola): abrir em mais leis, com um
    grupo de educação.
  - **Economia** (salário mínimo, tarifa de importação, regras de
    demissão): desenhar junto com o mercado.
  - Financiamento de campanha entra com a campanha eleitoral.
- **Mundo sem guerra ativa** (01/nov, autor): as potências não fazem muita
  coisa (sanção, no máximo). Guerra só talvez numa DLC. O país tem um
  **nível de segurança** que diz se ele pode ser atacado ou não. O país
  **pode ser atacado, mas nunca começa uma guerra** (01/nov, autor); o que
  acontece no ataque fica para depois do passo 11, que só traz o número.
- **Comércio automático** (01/nov, autor): produto em excesso o país exporta
  sozinho para o mercado mundial; o que falta, importa. Vem com o mercado
  (passo 12) ou logo depois.
- **Leis nas pontas da bússola** (01/nov): com as 15 leis de hoje, nenhuma
  potência chega a odiar o país (a pior opinião desejada fica em ~43). Faltam
  leis nas pontas, principalmente no lado autoritário (só a pena de morte
  passa de +0,3 no social). Quando entrarem os pacotes do passo 13, medir de
  novo e ver se a escala da opinião desejada precisa mudar.
- **Bússola, próximos ajustes** (01/nov, autor): a bússola é a base do jogo;
  resumo em `docs/jogo/bussola.md`. Em aberto: 3º ou 4º eixo (cálculo em laço
  sobre `EIXOS`, refatoração separada); peso por lei na média do país;
  opiniões de partida dos países de teste perto da desejada.
- **Segurança e defesa, ficam para depois** (02/nov, autor):
  - Pesquisa e tecnologia nunca por clique, só por lei: uma lei patrocina um
    programa (ex.: a bomba) e dá dinheiro à pesquisa ou à construção. Construir
    exige materiais comprados no mercado (passo 12).
  - Sem alianças por enquanto.
  - Objeção de consciência cortada (complexa demais).
  - Dois atrasos diferentes no mesmo índice na mesma lei: hoje o motor soma e
    usa o maior atraso (`efeitos/index.ts`, `alvos`). Mudar pede uma entrada
    por efeito na fila.
  - Índice `seguranca` aparece na tela como "Segurança pública".
- **Eixo novo: paz × militarismo** (02/nov, autor): hoje o eixo social mistura
  "autoritário" com "militarismo", e as leis militares (serviço de 18 meses:
  ambientalistas −15) irritam o grupo verde mais do que deveriam. Com um eixo
  próprio, quem é antimilitarista reage por ele e os outros grupos reagem por
  outros motivos. Autor deixou como está por enquanto; entra junto com a
  decisão de quais eixos novos a bússola ganha (`docs/jogo/bussola.md`).
- **Mercado: fila de construção e infraestrutura** (02/nov, autor):
  - Fila de obras **escondida** do jogador: calcula mais ou menos o custo de
    construir uma fábrica e se o país tem construção civil forte o bastante.
    Dá as leis de construção civil. Fica fora do passo 12.
  - Infraestrutura (rodovias, ferrovias, portos, aeroportos) é setor próprio e
    deve limitar ou ajudar os outros setores (pouca ferrovia encarece a
    indústria e a exportação). Vem junto com a fila.
  - Lucro e salário por setor ficam expostos para as leis do passo 13: quanto
    do lucro o governo pega, participação dos trabalhadores, salário mínimo.
  - Mundo vivo: preço mundial por produto, ciclos e choques que vêm de fora
    (um país inunda o mercado de carros baratos e as fábricas daqui quebram).
    Entra na fatia 4 em versão simples; oferta e procura completa fica depois.
  - Produtos da época, inclusive tecnologia (redes sociais, IA). O que a rede
    social faz com a opinião é a mecânica de mídia, não do setor.
