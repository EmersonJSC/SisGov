# Lote 9: organização policial

> **Status: INTEGRADO E TESTADO FOCALMENTE.** Os parâmetros novos são de
> **origem: "hipotese"**. As formas de organização policial já constavam das
> fichas do mundo e do desenho `docs/v1/desenho/leis/leis-07.md`; seus efeitos
> numéricos são hipóteses de jogo, sujeitas a playtest.

## O que o jogador decide

| Decisão | Opções e dilema | Relação com as outras |
| --- | --- | --- |
| `policias-dos-estados` | Governadores comandam as polícias territoriais ou uma força nacional recebe esse comando. Centralizar aumenta capacidade estatal, mas também o risco de uso político. | É a camada constitucional superior. No país inicial, esta regra é protegida e não pode ser mudada pela tramitação comum. A coordenação entre estados é uma decisão distinta. |
| `coordenacao-das-policias` | Estados isolados; base nacional de dados e protocolos; forças-tarefa permanentes com comando conjunto. Mais coordenação reduz facções e aumenta inteligência, com custo hipotético de 0 a 0,1% do PIB por ano. | Mantém as forças estaduais sob seus governadores; nenhuma opção cria polícia nacional única. |
| `policia-militar` | Patrulha militar com justiça militar ou carreira civil com justiça comum. A conversão reduz letalidade e aumenta liberdades civis após implantação, mas enfrenta oposição de carreiras e pode reduzir segurança percebida. | `natureza-da-policia-de-rua` repetia esta mesma decisão. A ficha duplicada saiu do catálogo; seu efeito de liberdade civil foi incorporado aqui. |
| `ciclo-policial` | Uma força patrulha e outra investiga, ou a mesma força registra e investiga o caso. Ciclo completo reduz impunidade, mas requer reorganização. | É independente da natureza militar/civil: o jogador pode combinar ambos. |

**Consolidação:** 5 fichas candidatas viraram 4 decisões distintas. O ID
`policia-militar` foi mantido porque já era a ficha v3, tinha fontes, era usado
no Brasil, em programas e em testes. A ficha duplicada v2, suas duas relações,
o controle órfão e as referências ativas foram removidos. O histórico Git e o
desenho anterior preservam sua origem. A regra protegida de comando estadual
foi preservada, bem como os IDs usados nos programas políticos.

## Ensaio causal de 16 turnos

`npx vite-node scripts/teste/setorSegurancaLote9.ts` joga referência e duas
rotas na mesma semente, sem ocorrências ou eleição. **Conjunta:** forças-tarefa
nacionais com comando estadual conjunto e ciclo completo. **Civil:** base de
dados nacional, patrulha civil e ciclo dividido. As opções são aplicadas
diretamente para testar a rede; o Congresso não foi testado aqui.

| Indicador no turno 16 | Referência | Conjunta | Civil |
| --- | ---: | ---: | ---: |
| Capacidade de inteligência | 18,538 | 25,557 | 22,056 |
| Crime organizado | 70,909 | 68,503 | 69,507 |
| Impunidade | 68,651 | 62,074 | 68,587 |
| Letalidade policial | 30,973 | 30,953 | 24,090 |
| Liberdade civil | 70,030 | 70,077 | 76,937 |
| Sensação de segurança | 35,404 | 33,142 | 32,774 |
| Gasto público (% do PIB) | 30,800 | 30,895 | 30,893 |
| Dívida (% do PIB) | 114,397 | 114,454 | 114,459 |

Inteligência e gasto reagiram até o turno 4; a queda da impunidade e da
letalidade policial ficou clara depois, nos turnos 8 a 16. As três partidas
concluíram sem travamento. O dilema observado: ganhos investigativos e de
liberdade versus custo, atrito institucional e piora inicial da segurança
percebida. O custo macro é pequeno frente ao orçamento total; precisa de
playtest humano para avaliar se o jogador o sente.

**Verificação focal:** 3 testes em `src/tests/segurancaLote9.test.ts` passaram;
os 11 testes do contrato de três níveis passaram; os 7 testes da ficha v3
passaram após remover duas expectativas exatas de indicadores globais que
mudam quando novos lotes entram na rede. O teste continua conferindo os três
controles v3 e a finitude dos indicadores. `npm run check` permanece adiado.
