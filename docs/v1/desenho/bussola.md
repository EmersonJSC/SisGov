# Bússola política (V1-10)

**Status:** EM REVISÃO (13/out). O código só começa com a sua aprovação; as
perguntas estão na seção 8.

## 0. Resumo

A bússola mostra para onde o seu governo leva o país. Ela tem dois eixos: na
economia, de Estado a mercado; nos costumes, de liberdade a autoridade. O seu
ponto começa onde estão as leis em vigor do país, sem questionário, e anda a
cada lei que você aprova, muda ou revoga. Em volta estão personalidades e
partidos famosos da esquerda e da direita, cada um num ponto tirado de bases
de dados de cientistas políticos, para você ver de quem está chegando perto.

## 1. O que existe hoje (medido em 13/out)

- **129 leis no Brasil:** 105 com opções nomeadas e 24 com faixa (um valor,
  como uma alíquota ou um gasto). Nenhuma tem posição política.
- **Dilemas:** 91, com opções que hoje tendem a ser boa, média e ruim (o
  V1-13 reescreve com lados).
- **Segmentos e grupos de pressão** já têm "visto como" esquerda ou direita
  (V1-09), mas isso só mexe na polarização.

## 2. Métodos atuais

- **Duas dimensões, não uma.** Esquerda e direita numa linha só não separa
  quem quer Estado na economia e liberdade nos costumes. O mapa em dois eixos
  vem de Eysenck (1954) e do diagrama de Nolan (1969); as pesquisas de hoje
  medem as duas coisas em separado.
- **Chapel Hill Expert Survey (CHES):** especialistas dão a cada partido uma
  nota de 0 a 10 na economia (`lrecon`, Estado a mercado) e nos valores
  (`galtan`, libertário e progressista a tradicional e autoritário). Há a
  versão da Europa e a da América Latina (CHES-LA, 2020), com os partidos
  brasileiros.
- **V-Party (V-Dem, 2020 em diante):** posição de partidos do mundo inteiro
  desde 1970, com uma escala econômica de esquerda e direita (`v2pariglef`) e
  medidas de valores (direitos de minorias, papel da religião). Serve para
  partidos fora da Europa e da América Latina e para partidos de outras
  épocas.
- **PREPPS Latam (2018 e 2019):** pesquisa com especialistas que posiciona os
  presidentes da América Latina, não só os partidos.
- **Manifesto Project:** codifica programas de governo por tema (mercado livre,
  regulação, Estado de bem-estar, lei e ordem). É a referência para dar peso
  a uma lei por tema, sem opinião nossa.

## 3. Opções

**Como o ponto anda:**

| Opção                                | Como funciona                                                                     | A favor                                        | Contra                                                                    |
| ------------------------------------ | --------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------- |
| A. Média das leis                    | O ponto é sempre a média das leis em vigor.                                       | Fiel ao país.                                  | Com 129 leis, mudar uma mexe quase nada; o jogador não vê o próprio rumo. |
| **B. Média com o seu rumo ampliado** | Começa na média das leis; o que você muda conta 4 vezes mais que o que já estava. | Começa no lugar certo e anda de forma visível. | O fator 4 é uma escolha de jogo, não um dado.                             |
| C. Só o seu rumo                     | Começa no centro e anda só com as suas mudanças.                                  | Simples.                                       | Contraria o pedido: o Brasil não começa no centro.                        |

**Escolha: B.**

**De onde vem o ponto das referências:**

| Opção              | Como funciona                                                                                                                                      | A favor                                    | Contra                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | --------------------------------------------------- |
| **A. Pelos dados** | Partido: CHES (ou V-Party onde o CHES não chega). Personalidade: o partido dela no tempo em que governou, ou o PREPPS quando o presidente está lá. | Cada ponto tem fonte; não é opinião nossa. | Personalidade e partido podem ficar no mesmo ponto. |
| B. Por nós         | Nós decidimos onde cada um fica.                                                                                                                   | Liberdade total.                           | Vira opinião, e com pessoas vivas isso é um risco.  |

**Escolha: A.**

## 4. A regra

### 4.1 Eixos

- **Economia:** de −10 (Estado) a +10 (mercado).
- **Costumes:** de −10 (liberdade) a +10 (autoridade).
- Na tela, a economia vai na horizontal e os costumes na vertical, com a
  autoridade em cima.

### 4.2 Peso de cada lei

Cada opção de lei ganha um vetor de −2 a +2 em cada eixo, com uma frase que
justifica e o tema do Manifesto Project que corresponde. Zero quer dizer que
a lei não fala daquele eixo. Exemplos:

| Lei                            | Opção                 | Economia | Costumes |
| ------------------------------ | --------------------- | -------- | -------- |
| Aborto                         | Proibição total       | 0        | +2       |
| Aborto                         | A pedido da mulher    | 0        | −2       |
| Imposto sobre grandes fortunas | Sem imposto           | +1       | 0        |
| Imposto sobre grandes fortunas | Alíquota alta         | −2       | 0        |
| Porte de armas                 | Liberado com registro | +1       | +1       |

- **Lei com faixa** (alíquota, gasto): o vetor vai de uma ponta à outra; o
  valor de hoje fica no meio do caminho.
- **Importância:** emenda constitucional pesa 3, lei pesa 2, decreto e
  programa pesam 1.
- Os vetores ficam em `src/conteudo/mundo/bussola.json`, um arquivo só para
  as leis de hoje; as fichas v3 novas trazem o campo `bussola`.

### 4.3 O ponto

```
média(leis) = Σ (importância × vetor da opção em vigor) ÷ Σ importância × 5
ponto       = média(leis do turno 0) + 4 × (média(leis de agora) − média(leis do turno 0))
```

- O ponto inicial é a média das leis em vigor no turno 0. No Brasil, a nossa
  expectativa é ficar perto do PT. **Não ajustamos os vetores para cair lá:**
  damos o peso de cada lei pelo que ela é e conferimos depois. Se cair longe,
  eu mostro onde e por quê, e você decide.
- Com cerca de 250 de importância somada no Brasil, reescrever uma lei de
  ponta a ponta move o ponto cerca de 0,6 no eixo dela. Dez mudanças grandes
  no mesmo sentido atravessam um quarto da bússola.
- Os dilemas (V1-13) também têm vetor e mexem no ponto do mesmo jeito, com
  importância 1.
- O ponto fica dentro de −10 e +10.

### 4.4 Referências

- **Partidos e personalidades em duas camadas**, que você liga e desliga na
  tela.
- **Partidos:** brasileiros (PT, PSOL, PCdoB, PSB, PDT, MDB, PSD, PSDB, União
  Brasil, PP, Republicanos, PL, Novo) e de fora (por exemplo, Democratas e
  Republicanos dos EUA, Trabalhistas e Conservadores do Reino Unido, Morena
  do México e A Liberdade Avança da Argentina).
- **Personalidades:** da esquerda à direita, de vários países e épocas. Por
  exemplo, Che Guevara, Fidel Castro, Hugo Chávez, Salvador Allende, José
  Mujica, Lula, Bernie Sanders, Barack Obama, Fernando Henrique Cardoso,
  Angela Merkel, Margaret Thatcher, Ronald Reagan, Donald Trump, Jair
  Bolsonaro, Javier Milei e Viktor Orbán.
- **Conversão:** CHES de 0 a 10 vira −10 a +10 (×2 − 10); as escalas do
  V-Party são padronizadas pelo conjunto e levadas à mesma faixa.
- **Na ficha de cada referência:** fonte, ano da medida e o partido usado. O
  texto não opina: só o nome, o país, a época e a fonte.
- A "personalidade mais próxima" do seu ponto aparece no painel e no jornal
  ("O governo está cada vez mais perto de …").

### 4.5 Na tela

- Um app "Bússola" no tablet: os dois eixos, as referências, o seu ponto e o
  caminho que ele fez desde a posse.
- Na janela da lei: para onde cada opção puxa o seu ponto (uma setinha na
  bússola pequena).

## 5. Diferenciação

Bússolas políticas em dois eixos são de domínio comum (Eysenck, Nolan e
vários sites de teste). Não usamos perguntas, textos nem posições de nenhum
teste ou jogo: o ponto vem das leis, e as referências vêm das bases de dados
da seção 2.

## 6. Fica para depois

- Bússola das bancadas e dos grupos de pressão: só se o V1-11 pedir.
- Escolher um alvo ("quero chegar perto de …") como meta do mandato: pode
  entrar no V1-29 (metas e conquistas).

## 7. Aceite e testes

- O ponto inicial vem das leis em vigor (teste: trocar uma lei antes do
  turno 0 muda o ponto inicial).
- Toda opção de lei tem vetor nos dois eixos (teste do verificador).
- O ponto segue a fórmula da seção 4.3 (teste com leis de vetor conhecido).
- Toda referência tem fonte, ano e escala de origem (teste do verificador).

## 8. Perguntas para você

1. **Ponto pela opção B** (média das leis, com o seu rumo valendo 4 vezes)?
   Recomendo.
2. **Referências pelos dados** (opção A), mesmo que algum nome fique num
   lugar que você não esperava? Recomendo.
3. **A lista de personalidades e partidos** da seção 4.4 está boa? Pode
   tirar ou pôr nomes.
4. **Eixos:** economia (Estado e mercado) e costumes (liberdade e
   autoridade). Recomendo esses dois.
