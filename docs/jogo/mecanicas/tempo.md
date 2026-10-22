# Mecânica 1: Tempo

> **Status: VIGENTE.** Descreve a regra e o código de 21/out/2026.
> Índice: [mecânicas](README.md).

## 1. O que é

Hoje o tempo anda em **turnos trimestrais**, passados pelo jogador. Cada
turno roda **três meses** do motor. O destino é o **tempo corrido com
sensação de semanas** (seção 5).

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

## 5. Tempo corrido (decidido em 21/out, entra na versão 1)

O turno trimestral será trocado por **tempo corrido com sensação de
semanas**. É um truque de apresentação: o motor não muda.

- **Calendário em semanas:** a tela mostra a semana do mês ("2ª semana de
  março de 2027"). O tempo corre sozinho, com **pausa** e **velocidades**.
- **Motor mensal:** o cálculo continua acontecendo só no **fim de cada
  mês**. Rede, atrasos e calibragem ficam como estão.
- **Números deslizam:** entre um mês e outro, os valores da tela vão do
  valor antigo ao novo aos poucos, semana a semana (o resultado do mês já
  é conhecido).
- **Tudo tem uma semana:** eventos, dilemas, sessões do Congresso e notícias
  caem numa semana do mês, para coisas acontecerem no meio do caminho.
- **Pausa automática** quando há decisão: dilema na mesa, votação
  importante, crise, eleição. Substitui a regra "o turno não passa com
  dilema".
- **Lei mudada no meio do mês** entra no cálculo do fim daquele mês. Como
  as leis já têm atraso de meses, isso não aparece para o jogador.
- **Relatório trimestral continua** como resumo periódico, com "por você"
  e "sozinho" do piloto automático.
- A ordem do fim do turno (seção 2.1) vira acontecimentos datados no
  calendário. O mandato continua com 4 anos e a eleição na data do país.

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
  - calendário em semanas, pausa e velocidades na tela (fim do projeto).

## 7. Em aberto

- Quantas velocidades e quanto tempo real dura uma semana em cada uma.
- Quais acontecimentos pausam sozinhos e quais só avisam.
