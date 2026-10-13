# Leis de todos os lados e prova real da bússola (V1-34)

**Status:** EM REVISÃO (13/out). O código só começa com a sua aprovação; as
perguntas estão na seção 8.

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

## 8. Perguntas para você

1. **Programas pelo que o governo aprovou** (opção A)? Recomendo.
2. **Quais referências entram na prova da versão 1?** Proponho 16, dos
   quatro cantos: Che e Fidel (Cuba), Mao, Xi, Putin, Chávez, Mujica, Lula,
   FHC, Bolsonaro, Thatcher, Reagan, Merkel, Palme, Orbán e Khomeini. Metade
   para treino, metade para teste.
3. **Limite de 3 de distância** para passar? Recomendo.
4. **Fator 4 do rumo:** com ele, 6 a 27 leis levam a qualquer ponto, e Cuba
   passa da borda. Proponho manter o 4 até a prova completa e decidir com os
   16 programas na mão.
