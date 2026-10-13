# Bússola política (V1-10)

**Status:** APROVADO E FEITO (13/out). O autor aprovou os dois eixos, o fator
4 do rumo e as referências pelos dados, e pediu uma lista maior (China,
Rússia e outros). O resultado do Brasil está na seção 9. Em 13/out a prova
real (V1-34) trocou o fator 4 por um fator por eixo: 4 na economia e 1,5 nos
costumes (`leis-de-todos-os-lados.md`, seção 9).

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
média(leis) = Σ (importância × vetor da opção em vigor) ÷ Σ importância de todas as leis do catálogo
escala      = média ÷ média do país mais extremo possível naquele sentido × 10
ponto       = escala(turno 0) + 4 × (escala(agora) − escala(turno 0))
```

- Lei fora de vigor vale zero (ou o `foraDeVigor` dela, como a maconha legal,
  que fora de vigor quer dizer proibida).
- **Por que a escala:** a média simples de 129 leis fica perto de zero, porque
  muitas opções são moderadas. Dividir pelo país mais extremo possível (todas
  as leis na opção mais à esquerda, ou mais à direita, naquele eixo) diz que
  parte do caminho até a borda as leis percorreram. As referências usam a
  mesma ideia: 3 desvios-padrão dos partidos do mundo = borda.

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
- **Fonte única: V-Party** (V-Dem, pacote `vdemdata` 16.0, partidos de 1970 a
  2019). O CHES ficou de fora: o site não abre daqui, e o V-Party cobre o
  mundo todo com a mesma régua, inclusive China, Rússia e Cuba.
- **Economia:** média de `v2pariglef` (esquerda e direita econômica) e de
  `v2pawelf` com sinal trocado (apoio ao Estado de bem-estar), padronizados.
- **Costumes:** média de dois blocos padronizados: valores (`v2palgbt`,
  `v2parelig`, `v2pagender`, `v2paimmig`, `v2paculsup`, com sinal trocado) e
  antipluralismo (`v2xpa_antiplural`).
- **Escala:** padronizado sobre os 6.252 partidos-ano com os oito itens; 3
  desvios-padrão = borda.
- **Partidos (59):** 11 do Brasil (PT, PDT, PSB, MDB, PSDB, PSD, DEM, PP, PL,
  Republicanos e PSL, em 2018) e 48 de fora (EUA, Canadá, Reino Unido,
  Alemanha, França, Espanha, Itália, Suécia, Grécia, Hungria, Polônia,
  Turquia, Rússia, China, Cuba, Venezuela, Bolívia, Uruguai, Chile,
  Argentina, México, Colômbia, Índia, Israel, Japão e África do Sul).
- **Personalidades (66):** do Brejnev ao Salvini, passando por Mao, Deng, Xi,
  Putin, Gorbachev, Fidel, Che, Chávez, Maduro, Allende, Mujica, Lula, Dilma,
  Brizola, FHC, Bolsonaro, Obama, Trump, Reagan, Thatcher, Merkel, Orbán,
  Erdoğan, Modi, Khomeini, Mandela e outros. Cada uma é a média do partido
  dela nos anos de eleição em que governou ou liderou.
- **Sem medida (18):** Lênin, Stálin, Kruschev, Ho Chi Minh, Vargas,
  Roosevelt, Churchill, Hitler, Mussolini, De Gaulle, Salazar e Nasser (a base
  só mede de 1970 em diante), Milei (partido depois de 2019), Sanders (nunca
  liderou um partido), Duterte, PSOL, PCdoB e Novo (fora da base). Aparecem
  na tela como "sem medida", com o motivo.
- **Arquivos:** `src/conteudo/bussola/referencias.json`, gerado por
  `scripts/bussola/gerar.py` (a lista de pessoas e partidos fica em
  `pessoas.py` e `partidos.py`).
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

## 9. Resultado (13/out)

- **Brasil no turno 0:** economia −0,5 e costumes −2,6. As mais perto são
  Barack Obama (0,3), Indira Gandhi, Bill Clinton e Nelson Mandela; entre os
  partidos, o Democrata dos EUA (0,2) e o CNA da África do Sul. O PT de 2018
  está em −2,3 e −6,1; Lula (2002 e 2006) em −2,0 e −5,6.
- **Por que não caiu no PT:** as leis de hoje somam governos diferentes. O
  que mais puxa para o mercado são a autonomia do banco central, a meta de
  inflação, o trabalho por aplicativo sem regra e as concessões de
  saneamento; para o Estado, o sistema de saúde universal, a política
  industrial, a previdência e o crédito do banco de desenvolvimento. Não
  mexemos nos vetores para chegar ao PT.
- **Na tela:** botão "Bússola" na barra e um app no tablet, com camadas de
  personalidades e de partidos, os cinco mais perto, as leis que mais puxam o
  ponto e a fonte de cada número.
- **Ainda não:** a frase "O governo está cada vez mais perto de …" no jornal
  e a setinha na janela da lei (seção 4.5) ficam para o V1-13, junto com os
  dilemas com lados.
