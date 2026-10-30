# Mecânica 1: Tempo

> **Status: VIGENTE.** Descreve a regra e o código de 21/out/2026.
> Índice: [mecânicas](README.md).

## 1. O que é

Desde 30/out o tempo anda em **turnos bimestrais**, passados pelo jogador. Cada
turno roda **dois meses** do motor (`MESES_POR_TURNO` em `calendario.ts`), seis
turnos por ano. O conteúdo (leis, eventos, pressão) segue escrito em turnos de
3 meses: `turnosDoConteudo` e `chanceNoTurno` convertem para o prazo corrido.
A eleição cai no turno 24 (4 anos). O texto abaixo ainda diz "três meses" em
vários pontos: leia como "os meses do turno".

## 2. Regras

- **Passo do motor:** 1 mês. Atrasos e durações das consequências contam
  em meses.
- **Turno do jogador:** 1 trimestre (3 passos). O jogador muda leis durante
  o turno e clica em **encerrar turno**.
- **Mandato:** 16 turnos (4 anos). A eleição acontece no turno 16.
- **Aquecimento:** antes do primeiro turno, o motor roda alguns meses
  sozinho para a rede assentar (`aquecimentoMeses` no estado inicial).
- **O turno não passa** se:
  - houver dilema na mesa sem resposta;
  - a partida tiver acabado ou a eleição estiver sem candidato.
- **Piloto automático:** em paralelo, o jogo roda o mesmo país **sem as
  mudanças do jogador** (dilemas respondidos com a opção padrão). O
  relatório do turno mostra quanto de cada mudança foi **"por você"** e
  quanto aconteceria **"sozinho"**.

### 2.1 Ordem do fim do turno

1. Confere se o turno pode passar.
2. Simula os 3 meses (leis, ocorrências em curso, pressão).
3. Sorteia o turno: grupos de pressão, eventos, dilemas e situações.
4. Anota o ponto da bússola.
5. Congresso: influência dos grupos e, uma vez por ano, troca de partido
   dos parlamentares.
6. Congresso vota a fila de projetos.
7. Pesquisas e, no turno 16, a eleição.
8. Roda o piloto automático e monta o relatório do turno.

## 3. Entradas e saídas

- **Lê:** leis (metas do jogador), ocorrências, grupos de pressão,
  bússola, Congresso, eleição.
- **Entrega:** o novo estado da partida e o **relatório do turno** (contas
  antes e depois, mudanças por você e sozinho, jornal, pressão, votações,
  eleição).

## 4. No código

| O quê | Onde |
| --- | --- |
| Fim do turno (a ordem acima) | `src/app/partida/turno.ts` (`encerrarTurno`) |
| Calendário (turno, mês, ano; fonte única das conversões) | `src/game/calendario.ts` |
| Um mês do motor (`prepareGameMonth`) | `src/game/prepareGameQuarter.ts` |
| Os 3 meses do trimestre | `src/game/prepareGameQuarter.ts`, `commitGameQuarter.ts` |
| Simulação e prévia | `src/app/partida/previsao.ts` |
| Aquecimento | `src/game/createGame.ts` |
| Turno da eleição | `src/conteudo/paises/brasil/eleicao.json` (`turnoDaEleicao: 16`) |
| Passo e unidades do motor | `src/engine/unidades-e-duracao.md` |

## 5. Os três meses na tela (decidido em 25/out)

Substitui o tempo corrido decidido em 21/out (semanas, pausa e velocidades).

- O turno continua de **três meses**, passado pelo jogador.
- Ao apertar o turno, a tela **não salta** para o resultado: ela mostra os
  três meses passando. O calendário anda e as bolhas crescem e encolhem até
  o valor novo. O jogador sente o tempo passar e vê o que mudou.
- O motor não muda: calcula mês a mês, e a tela anima entre os resultados.
- Eventos e dilemas que caem no meio do trimestre aparecem no mês deles
  durante a animação.

## 6. Implementação

- **Fatia 1 (21/out, sem mudar comportamento):**
  - `calendario.ts` concentra as contas de turno, mês e ano (antes havia
    `0,25` solto na eleição e `3` solto no trimestre);
  - `prepareGameMonth` separa um mês do motor; o trimestre virou três
    chamadas dele.
- **Fica para outras mecânicas:**
  - sessões do Congresso em datas (mecânica 3);
  - data da eleição pelo calendário, no lugar de "turno 16" (mecânica 11);
  - pausa automática por dilema e crise (mecânica 13);
  - animação dos três meses na tela.

## 7. Em aberto

- Quanto tempo real dura a animação de um turno, e se dá para pular.
- Se um dilema no meio do trimestre pausa a animação.
