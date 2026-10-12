# Conversa de 12/out/2026: decisões e ideias para os desenhos

> **Status: VIGENTE.** Registro da conversa sobre como o motor funciona, o que
> o D4 faz (pelo que é público) e o que a V1 muda. Cada etapa 0 de desenho
> começa lendo a parte que lhe toca.

Documentos de referência (Claude Docs):

- "SisGov: como a simulação funciona e como melhorar": D4 x SisGov x métodos
  novos, com as perguntas do autor respondidas na seção 7.
- "SisGov: o motor por dentro": o motor explicado pelo código, com medições.

## Decisões do autor

1. **Etapa 0 de desenho** nos chamados V1-07, V1-08, V1-09, V1-10 e V1-12: sim.
2. **Eleição probabilística** (chance por perfil, abstenção, pesquisas com
   margem de erro, resultado sorteado com a semente): sim.
3. **População a partir do IBGE** (PNAD Contínua e Censo 2022, ajuste IPF): sim.

## Achados medidos no código (Brasil, turno 0)

- **Contexto fora de escala.** O nó `contexto:<bolha>` absorve o que as leis
  não explicam e chega a +192 (empresários) e −134 (progressistas) em
  domínio 0 a 100. "Aprendizagem" é 85% contexto. Sugestão barata: o
  verificador recusa `|contexto| > 50` em nó de domínio 0 a 100.
- **Desempenho.** `computeNetwork` ~10 ms por mês, `simularTrimestre` ~76 ms,
  turno ~150 ms (jogador + piloto automático). O custo é alocação e ordenação
  (`{...previous}`, `sort(localeCompare)` por alvo a cada mês, objetos de
  explicação), não a conta. Plano: grafo compilado para índices inteiros e
  `Float64Array`, explicação só quando a UI pede, índice `Map<sourceId, ids>`.
- **`apoio:<lei>` sem uso.** 123 nós sem aresta de entrada nem de saída.
- **Código morto.** `calculateAffineContribution` (só o próprio teste usa) e o
  xorshift de `randomState.ts` (sem uso desde a V1-04).
- **Primeiro ano sem história.** Atraso que pede mês anterior ao início recebe
  o turno 0 congelado (`readExecutionSnapshot`).

## Ideias do autor para os desenhos

| Ideia | Onde entra |
| --- | --- |
| Começar o país 1 ou 2 anos antes, rodar e deixar onde parou. Enche a história dos atrasos e serve de teste de calibragem (2026 simulado x real) | V1-07 |
| Começar a partida na campanha (eleição em outubro, posse em janeiro) | V1-12 |
| Estudar mais de um mecanismo de opinião antes de escolher | V1-08 |
| Pesos dos perfis mudando devagar com os índices (pobreza cai, perfil "pobre" encolhe) | V1-08 |
| Patrocínio: empresas, setores e países estrangeiros financiando atores, crescendo quando a lei ameaça o interesse de quem paga; "financiado por" com dúvida, revelado por investigação | V1-09 |
| Tela de carregamento no fim do turno; o cálculo vai para outra thread (Web Worker; Electron e Tauri também têm) ou cede a vez entre meses, senão a própria tela congela | V1-07 |

## Pontos de explicação que o jogo deve deixar claros

- Hoje os 11 grupos são fatias que somam 100%: ninguém é "pobre e
  conservador" ao mesmo tempo. Com perfis, a mesma pessoa sente a lei pelos
  vários lados.
- O jogador vê a conta, não só a seta: "1,9 ponto da aprendizagem veio do piso
  salarial, e só daqui a 12 meses".
- Na eleição, a chance aparece antes ("62% de chance de vencer") e o resultado
  sai da sorte em volta dela.
- Não usar rede neural treinada: ela tiraria a conta exata por causa.
