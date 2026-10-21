# Lote 13: contratos de trabalho

> **Status: INTEGRADO E TESTADO FOCALMENTE.** As formas de contrato existem
> como instrumentos do catálogo; custos e resultados são hipóteses de jogo.

## Hierarquia e opções

```text
legislacao-trabalhista (Constituição: direitos mínimos do contrato)
  ├─ terceirizacao (quem pode contratar outra empresa)
  ├─ jornada-de-trabalho (teto de horas por semana)
  └─ trabalho-por-aplicativo (vínculo dos motoristas e entregadores)

fiscalizacao-do-trabalho (quantas inspeções fazem cumprir as regras)
```

As cinco decisões foram **mantidas separadas**. O texto de cada uma agora
descreve ação concreta. Opções extremas de terceirização, jornada e trabalho
por aplicativo ganharam travas que dependem da regra constitucional; um teste
confirmou que terceirização sem responsabilidade é recusada quando a
Constituição exige estabilidade. A opção provisória `ponto-da-faixa` saiu da
fiscalização, substituída por suspensão de inspeções de rotina. A fiscalização
recebeu custo direto, hipótese de 0 a 0,06% do PIB ao ano.

| Lei | Dilema jogável |
| --- | --- |
| `legislacao-trabalhista` | Código uniforme e estabilidade protegem empregados, mas elevam custo e podem reduzir vagas formais; contrato livre faz o inverso. |
| `terceirizacao` | Terceirizar toda a produção ou restringir a serviços de apoio; custo e agilidade versus renda e proteção. |
| `jornada-de-trabalho` | Teto de 48, 44, 40 ou 35 horas, ou nenhum teto; saúde e tempo livre versus custo por hora e produção. |
| `trabalho-por-aplicativo` | Autonomia sem piso, categoria própria com previdência ou vínculo de emprego; cobertura e renda versus preço e vagas. |
| `fiscalizacao-do-trabalho` | Suspender inspeções, manter equipes reduzidas ou cobrir obras, fazendas e fábricas; proteção e formalização versus gasto e custo de conformidade. |

## Ensaio de 16 turnos

`scripts/teste/setorTrabalhoLote13.ts` compara referência com duas rotas na
mesma semente, sem ocorrências ou eleição. A **flexível** usa contrato mínimo,
terceirização livre, 48 horas, aplicativo sem piso e inspeção reduzida. A
**protetiva** combina estabilidade, terceirização restrita, 35 horas, vínculo
obrigatório no aplicativo e fiscalização máxima. Aplicação direta testa rede e
travas; a aprovação no Congresso não foi simulada.

| Indicador no turno 16 | Referência | Flexível | Protetiva |
| --- | ---: | ---: | ---: |
| Informalidade | 38,612 | 43,431 | 35,060 |
| Trabalho infantil | 4,137 | 7,034 | 1,281 |
| Custo trabalhista | 60,151 | 51,475 | 78,407 |
| Desemprego | 6,235 | 6,055 | 11,354 |
| Renda das famílias | 44,295 | 44,252 | 45,916 |
| Saúde da população | 76,457 | 73,160 | 84,141 |
| PIB (índice da rede) | 43,461 | 44,007 | 39,631 |
| Gasto público (% do PIB) | 30,830 | 30,808 | 31,316 |
| Dívida (% do PIB) | 114,584 | 114,363 | 113,824 |
| Satisfação média | 48,930 | 48,258 | 50,285 |

As três partidas acabaram sem travamento ou valor inválido. Custo trabalhista
e gasto reagiram cedo; informalidade, saúde e emprego mostraram a diferença
entre os turnos 4 e 16. Há escolha real: a rota protetiva reduz trabalho
infantil em 2,856 pontos frente à referência e melhora a saúde, mas leva o
desemprego a 11,354 e o PIB a 39,631. Esse preço pode estar alto demais e
precisa de playtest humano; os coeficientes não foram calibrados.

**Desvio de implantação:** na rota flexível, a regra constitucional tinha
alvo 22,33 e valor implementado 23,587 no turno 16. As outras quatro leis
chegaram ao alvo. Registrar esse pequeno desvio para investigar a dinâmica de
implantação/degradação; não chamar a meta constitucional de plenamente
atingida.

**Verificação focal:** 3 testes em `src/tests/trabalhoLote13.test.ts`
passaram. A checagem geral segue adiada até o fim da revisão.
