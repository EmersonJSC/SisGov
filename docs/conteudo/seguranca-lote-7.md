# Lote 7: policiamento, armas, penas e drogas

> **Status: INTEGRADO E TESTADO FOCALMENTE.** Modelagem numérica inicial:
> **origem: "hipotese"**. Os casos de policiamento, controle civil de armas,
> execução penal e tratamento do uso de drogas já constavam do desenho
> `docs/v1/desenho/leis/leis-07.md`; aqui as opções viram escolhas concretas.

## Decisões

| Lei | Ação do jogador e opções | Ganho e perda principal |
| --- | --- | --- |
| `policiamento-orientado` | Manter patrulha reativa; concentrar equipes em pontos críticos; cobrar metas; patrulha comunitária com dissuasão e serviços | Mais prevenção reduz crime, mas custa até 0,03% do PIB por ano e muda a distribuição do efetivo. Câmeras e natureza da polícia continuam leis separadas. |
| `armas-de-fogo` | Recomprar armas civis; posse doméstica controlada; posse rural com transporte autorizado; porte ampliado | Acesso eleva a sensação de autodefesa e agrada conservadores/interior; circulação, violência e desvio crescem com atraso. Recompra custa até 0,01% do PIB por ano. |
| `penas-e-progressao` | Alternativas com estudo/trabalho; progressão gradual; progressão endurecida; regime fechado integral | Punição dura eleva segurança percebida, mas lotação, gasto, reincidência e rebelião crescem. Custo hipotético: 0,4% a 1% do PIB. Gestão e vagas prisionais continuam leis separadas. |
| `lei-de-drogas` | Prender usuário; não prender e reprimir tráfico; critério objetivo com revisão judicial; encaminhar a saúde | Repressão agrada a grupos de ordem, mas eleva prisões e letalidade policial. Saúde reduz ambas com atraso e pode ser percebida como permissiva. Cannabis regulada continua lei filha independente. |

As quatro rotas políticas são **combinações do setor**. Conservadorismo pode
priorizar punição e autodefesa; progressismo pode combinar critérios objetivos,
tratamento e patrulha comunitária; esquerda econômica pode financiar serviços e
rede pública; direita econômica pode manter patrulha focada e limitar o gasto
sem ser obrigada a adotar toda escolha conservadora. Os quatro rótulos não foram
forçados em cada ficha.

## Ensaio causal de 16 turnos

Reproduzir com `npx vite-node scripts/teste/setorSegurancaLote7.ts`. Três
partidas com a mesma semente (7), sem ocorrências nem eleição. As escolhas
entram diretamente via `aplicarMeta` para isolar a rede; **a aprovação no
Congresso não foi avaliada neste ensaio**. Referência: opções iniciais do Brasil.

| Indicador no turno 16 | Referência | Ordem | Cuidado |
| --- | ---: | ---: | ---: |
| Crimes patrimoniais | 46,662 | 45,990 | 46,112 |
| Violência letal | 20,799 | 21,674 | 14,617 |
| Lotação prisional | 42,504 | 53,710 | 32,624 |
| Sensação de segurança | 35,404 | 40,210 | 36,209 |
| Gasto público (% do PIB) | 30,800 | 31,268 | 30,562 |
| Dívida (% do PIB) | 114,397 | 115,421 | 113,056 |
| Satisfação média dos grupos | 48,931 | 49,778 | 47,774 |

**Ordem:** patrulha em pontos críticos, porte ampliado, pena fechada e prisão
do usuário. **Cuidado:** patrulha comunitária, desarmamento, penas alternativas
e saúde para usuários. As mudanças de segurança percebida apareceram já no
primeiro turno; lotação, circulação de armas e violência tiveram atraso. Ambas
as partidas concluíram os 16 turnos sem erro ou valor não finito observado.

Os níveis desejados das quatro leis foram registrados. Nas opções de valor
zero, o nível implementado ainda estava em cerca de 1,407 no turno 16, por
causa da curva gradual do motor; os efeitos caminharam na direção prevista.
Isso não prova equilíbrio ou diversão. O dilema observado foi segurança
percebida e satisfação política versus violência, prisão e gasto. A rota de
cuidado apresentou melhores indicadores materiais com custo líquido menor;
isso merece playtest humano para conferir se as escolhas estão competitivas.

## Verificações focais

- `src/tests/segurancaLote7.test.ts`: 2 testes passaram. Confirma as novas
  opções, a dependência da cannabis e o sinal da queda de crime após quatro
  turnos de policiamento.
- O ensaio causal concluiu 3 partidas de 16 turnos. Os números são resultados
  do motor nesta árvore de trabalho, não estimativas inventadas para o relatório.
- A checagem geral (`npm run check`) continua adiada até a revisão das demais
  leis, conforme a decisão do autor.
