# Leis de todos os lados e prova real da bússola (V1-34)

**Status:** APROVADO (13/out). Programas e prova feitos; a reestruturação do
catálogo é o próximo passo (seção 9).

## 0. Resumo

O jogador tem que conseguir governar com as políticas de qualquer referência
da bússola, do Che ao Bolsonaro, e o jogo tem que provar isso. A prova real é
um teste: aplicar ao Brasil o programa de um governo de verdade, lei por lei,
com fonte, e ver se o ponto termina perto dele. Um piloto com 4 programas já
roda: Thatcher chega a 0,7 dela e Bolsonaro a 2,6 dele; Lula fica a 3,2 e
Cuba a 7,3, cada um pelo motivo da seção 5. O que falta no catálogo sai
desses erros.

## 1. O que existe hoje (medido em 13/out)

- **129 leis, 127 em vigor no Brasil.** Só a maconha legal e a pena de morte
  estão fora.
- **Os extremos já existem como opções** (censura, teocracia, conta de
  capital fechada, Estado empresário), mas quase todas dentro de leis que o
  Brasil já tem.
- **Alcance:** mudando de 6 a 27 leis, o jogador chega a qualquer uma das 66
  personalidades e aos quatro cantos da bússola (busca automática, medida em
  13/out). O alcance não é o problema; o problema é se as políticas reais de
  cada um levam até ele.

## 2. Métodos atuais

- **Três fontes independentes**, para a prova não ser circular:
  1. A seta de cada lei vem dos temas do Manifesto Project (`bussola.json`).
  2. O lugar de cada referência vem do V-Party (`referencias.json`).
  3. O programa de cada governo vem do que ele aprovou de fato: leis,
     decretos e constituições, com número e ano.
     Nenhuma das três é ajustada para bater com outra.
- **Treino e teste.** Como em estatística, metade dos programas guia o
  desenho do catálogo e a outra metade só é usada para testar. Se o catálogo
  acertar os programas que ele nunca viu, a prova vale.
- **Ligações entre leis** seguem o que já existe no jogo (lei mãe e lei
  filha, SG138) e ganham dois tipos novos (seção 4.3).

## 3. Opções

**De onde vem o programa de cada referência:**

| Opção                  | Como funciona                                                       | A favor                          | Contra                                         |
| ---------------------- | ------------------------------------------------------------------- | -------------------------------- | ---------------------------------------------- |
| **A. Do que aprovou**  | Lei por lei, o que o governo aprovou ou manteve, com número e ano.  | Fato verificável; não é opinião. | Trabalhoso; governos de fora pedem pesquisa.   |
| B. Do manifesto        | O que o partido prometeu na eleição (Manifesto Project).            | Base pronta e codificada.        | Promessa não é governo; o site não abre daqui. |
| C. Do ponto da bússola | Escolher, para cada lei, a opção mais perto do ponto da referência. | Automático.                      | Circular: passa sempre e não prova nada.       |

**Escolha: A**, com B como conferência quando a base abrir.

## 4. A regra

### 4.1 Programas como dados

- Arquivo `src/conteudo/bussola/programas.json`: para cada referência, a
  lista `lei → opção` (ou nível, nas leis com faixa), com a fonte de cada
  linha (nome da lei, número e ano).
- Lei que o governo não mexeu fica como o Brasil tem. O programa diz o que o
  governo fez, não o país inteiro dele.
- Um programa pode servir de **pacote** depois: campanha de país comunista,
  de país liberal (ideias.md).

### 4.2 O catálogo

- **Toda área (V1-14 a V1-23) tem leis que só um lado aprovaria, nos quatro
  cantos:** por exemplo, planejamento central e partido único; livre mercado
  radical; religião oficial e censura de costumes; liberdades amplas.
- **Boa parte fica fora de vigor no Brasil:** meta de pelo menos um terço do
  catálogo começando fora.
- **Lei nova entra quando um programa precisa dela** e o catálogo não tem
  como representar (seção 5 mostra as primeiras).

### 4.3 Ligações (o "minigame")

| Ligação       | O que faz                                                       | Exemplo                                                         |
| ------------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| Exige         | Uma lei só entra com outra numa certa opção (já existe, SG138). | Partilha do petróleo exige estatal de petróleo.                 |
| Anula (nova)  | Duas opções não convivem; aprovar uma derruba a outra.          | Conta de capital aberta e câmbio fixo com controle total.       |
| Pacote (nova) | Leis que juntas rendem mais do que separadas.                   | Bolsa às famílias + condicionalidade escolar + escola integral. |

Assim o jogador planeja um caminho: para chegar a um lugar, ele precisa
abrir uma lei, mudar outra e evitar uma terceira.

### 4.4 A prova

```
para cada programa: aplicar ao Brasil do turno 0 → ponto final
passa se: distância(ponto, referência) ≤ 3
       e  distância(ponto, referência) < distância(ponto, cada oposto)
```

- **Opostos:** as referências do outro lado nos dois eixos (Cuba contra
  Thatcher, Reagan, Bolsonaro e Trump; Lula contra Bolsonaro, Thatcher,
  Reagan e Trump; e assim por diante).
- **Quando falha, o conserto é no catálogo** (falta lei ou opção), nunca no
  ponto da referência. Mudar a seta de uma lei só com novo motivo do
  Manifesto Project.

## 5. Piloto (13/out)

Quatro programas aplicados ao Brasil de hoje, com as 129 leis atuais:

| Programa              | Leis | Ponto final | Referência  | Distância | Mais perto          | Opostos (menor) |
| --------------------- | ---- | ----------- | ----------- | --------- | ------------------- | --------------- |
| Thatcher (1979–1990)  | 26   | 4,7 · 0,7   | 4,9 · 0,0   | **0,7**   | Bush, Thatcher, Abe | Lula 9,2        |
| Bolsonaro (2019–2022) | 20   | 4,8 · 8,4   | 7,3 · 7,7   | **2,6**   | Khomeini, Bolsonaro | Fidel 13,7      |
| Lula (2003–2010)      | 22   | −3,1 · −2,6 | −2,0 · −5,6 | 3,2       | Brizola, Brandt     | Thatcher 8,4    |
| Cuba (Fidel, 1976–)   | 30   | −8,5 · 10,0 | −7,7 · 2,7  | 7,3       | Brejnev, Gorbachev  | Trump 15,3      |

- **Os quatro já ficam do lado certo:** todos terminam muito mais perto da
  própria referência do que dos opostos.
- **Lula fica pouco liberal nos costumes:** o catálogo não tem o que o
  governo fez nessa área (conferências participativas, Comissão da Verdade,
  direitos LGBT por política pública, saúde da população negra).
- **Bolsonaro fica pouco liberal na economia:** faltam abertura comercial
  (redução da tarifa externa, 2021–22), a lista de privatizações e a
  liberdade econômica (Lei 13.874/2019).
- **Cuba passa da conta na autoridade:** censura, Judiciário controlado e
  sigilo pesam 2 cada, e o fator 4 empurra para a borda. O V-Party põe o
  Partido Comunista de Cuba no meio dos costumes porque mede também gênero e
  LGBT, que no catálogo quase não aparecem (aborto legal desde 1965,
  igualdade de gênero no trabalho). É sinal de que faltam leis de costumes
  em que Cuba ia para a liberdade.

## 6. Diferenciação

Nada aqui vem do D4. Programas de governo são fatos históricos; a prova é
nossa e não existe em jogo nenhum que conhecemos.

## 7. Aceite e testes

- Todo programa tem fonte em cada linha (teste do verificador).
- Todo programa termina a 3 ou menos da referência e mais perto dela do que
  dos opostos (teste da prova real).
- O relatório da prova mostra, para cada programa, o ponto, a distância e as
  leis que mais puxaram.

## 8. Decisões (13/out)

1. **Programas pelo que o governo aprovou ou manteve** (opção A), com fonte em
   cada linha. Leis diferentes de cada país entram na lei do jogo que faz a
   mesma coisa.
2. **Referências pelos dados:** um extremo de cada canto, alguns do meio e um
   do centro. Ficaram 10: Brejnev, Mujica, Bolsonaro e Piñera nos cantos;
   Fidel, Lula, Thatcher, Putin e Chávez no meio; Merkel no centro.
3. **Passa quem termina a 3 ou menos** da referência e mais perto dela do que
   dos opostos.
4. **Fator por eixo:** a prova mostrou que o 4 exagera nos costumes, e o
   autor aprovou 4 na economia e 1,5 nos costumes (seção 9).

## 9. Prova com 10 programas (13/out)

`src/conteudo/bussola/programas.json`: 264 linhas, cada uma com a lei do jogo,
a opção, se o governo aprovou ou manteve, e a fonte (lei, número e ano).
Treino: Thatcher, Lula, Bolsonaro, Fidel e Putin. Teste: Brejnev, Mujica,
Piñera, Chávez e Merkel. Rodar: `npx vite-node scripts/bussola/prova.ts`.

| Programa  | Grupo  | Leis | Fator 4     | Distância | Fator do treino | Distância |
| --------- | ------ | ---- | ----------- | --------- | --------------- | --------- |
| Thatcher  | treino | 27   | 5,4 · 1,3   | **1,4**   | 5,6 · −1,2      | **1,4**   |
| Lula      | treino | 26   | −3,5 · 1,3  | 7,1       | −3,6 · −1,2     | 4,7       |
| Bolsonaro | treino | 12   | 1,5 · 2,3   | 7,9       | 1,6 · −0,8      | 10,3      |
| Fidel     | treino | 33   | −7,8 · 10,0 | 7,3       | −8,1 · 4,9      | **2,3**   |
| Putin     | treino | 28   | 0,5 · 9,9   | 6,6       | 0,6 · 1,9       | **1,4**   |
| Brejnev   | teste  | 34   | −7,7 · 10,0 | 6,1       | −7,9 · 5,4      | **2,1**   |
| Mujica    | teste  | 24   | 0,0 · −7,7  | 3,3       | 0,0 · −4,4      | 3,3       |
| Piñera    | teste  | 24   | 7,4 · −1,4  | **1,9**   | 7,7 · −2,2      | **2,2**   |
| Chávez    | teste  | 28   | −10 · 10    | 7,9       | −10 · 2,7       | 4,7       |
| Merkel    | teste  | 28   | −0,4 · −4,4 | **2,9**   | −0,4 · −3,3     | **2,1**   |

- **Direção certa em todos:** com o fator 4, os 10 terminam mais perto da
  própria referência do que dos opostos (teste
  `programasDaBussola.test.ts`).
- **Com o fator 4 passam 3 de 10.** Os quatro autoritários (Fidel, Putin,
  Brejnev, Chávez) batem na borda dos costumes: o 4 é demais nesse eixo.
- **O fator que melhor acerta o treino é 4,15 na economia e 1,43 nos
  costumes** (mínimos quadrados nos 5 programas de treino). Com ele passam 6
  de 10, e 3 dos 5 de teste, que o ajuste nunca viu. Isso confirma o 4 na
  economia e pede cerca de 1,5 nos costumes.
- **Lula fica conservador nos costumes:** o Brasil de 2003–2010 não tinha
  união homoafetiva, lei de acesso nem LGPD, e o catálogo não tem o que o
  governo fez de liberal (conferências, Comissão da Verdade, políticas LGBT e
  de igualdade racial na saúde e na escola).
- **Bolsonaro quase não sai do lugar:** só 12 linhas mudam algo, porque boa
  parte do que aprovou já está no Brasil do turno 0, e o que o distingue não
  existe no catálogo (escolas cívico-militares, privatizações por empresa,
  liberdade econômica, abertura comercial, costumes religiosos na educação).
- **Mujica e Chávez erram na economia:** o Uruguai de Mujica tem economia mais
  à esquerda do que o catálogo representa (estatais em monopólio, conselhos
  de salários), e o Chávez passa da borda da esquerda.
- **Achado no cálculo:** leis de verba (moeda por ano) não têm teto no
  domínio, então a bússola as põe sempre no meio. Os programas ainda não usam
  verbas; o conserto entra na reestruturação.

## 10. Próximo passo: reestruturar o catálogo

O que a prova pede, na ordem:

1. **Fator por eixo: feito** (4 na economia, 1,5 nos costumes; passam 6 de
   10, e o teste confere quais).
2. **Leis que faltam**, saídas das falhas acima e dos quatro cantos, com boa
   parte fora de vigor no Brasil (meta de um terço).
3. **Verbas com escala** (o dobro do que o país gasta no começo como teto).
4. **Ligações anula e pacote** (seção 4.3), para o caminho entre as leis.
5. Rodar a prova de novo a cada mudança; a meta é os 10 passarem.
