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
- Desenho fechado no passo 7.

## 7. Regime e Congresso (31/out)

- O regime vem das leis essenciais do país: quem aprova lei (câmaras,
  quórum, veto), quem escolhe o governo e como se perde o poder.
- **V1:** presidencialismo (Brasil, EUA) e parlamentarismo.
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
| 6 | Leis da V1 | Cada lei com comportamento esperado escrito antes e conferido por script |
| 7 | Grupos | Leis e índices movem satisfação, radicais e lealistas de cada grupo |
| 8 | Congresso | Lei só muda com voto; o exorbitante é barrado; base e oposição reagem |
| 9 | Eleição e desgaste | Partida de um mandato termina em vitória ou derrota que o jogador entende |
| 10 | Tela | Jogar uma partida inteira na tela |

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
  sentido no país vêm com o Congresso (passo 8).
