# Depois da V1

> O GDD está congelado desde 15/nov/2026. Toda ideia nova, mudança de regra ou
> "e se…" entra aqui, numa linha, com data e a Parte do GDD. Nada daqui se
> constrói antes da V1 sair. Quando a V1 sair, o autor lê esta lista e decide.

| Data | Parte do GDD | Ideia |
|---|---|---|

## Desligado na V1

O que existe no código mas não roda na partida da V1. Liga pelas
**Opções de teste** na tela de posse.

| Data | O quê | Estado | Onde mora | Como ligar |
|---|---|---|---|---|
| 15/nov | Judiciário (vagas no STF, indicação, voto do Senado, presidente da corte) | **Não está pronto: existe só na tela.** A mecânica não pesa em nada além das vagas. | `src/motor/judiciario`, `src/motor/turno/etapas/judiciario.ts`, `src/conteudo/mundo/judiciario`, `src/conteudo/paises/*/judiciario.json`; commit `9a15eb7c` | caixa "Judiciário (liga e desliga)"; no código, `comJudiciario: true` |
| 15/nov | Senado (liga e desliga) | Ligado por padrão; a caixa desliga e só a Câmara vota (teste). | `semSenado` em `src/partida/index.ts` | caixa "Senado (liga e desliga)" |

## Do conserto do bolso (15/nov)

| Data | Parte do GDD | Ideia |
|---|---|---|
| 15/nov | 3.6 | Diferença de preço da cesta (tomada `preco_<cesta>`) não vai para ninguém; decidir se vai à empresa ou ao Estado. |
| 15/nov | 4 (leis) | 6 leis ligadas ao preço são provisórias: imposto-consumo, imposto-sobre-remedio, teto-do-preco-dos-remedios, troca-pelo-generico, inspecao-de-alimentos, agrotoxicos. |
| 15/nov | 4 (leis) | Índice "Preço da comida" e tomada `preco_comida` são parecidos; decidir se viram um só. |
| 15/nov | 4 (leis) | Teto do preço dos remédios: bússola invertida (teto livre como esquerda). |
| 15/nov | 4 (leis) | Texto "Como chega a você: só mexe nos índices" está velho nas 6 leis do preço. |
| 15/nov | 2.4 | Prévia de "Apoio dos grupos" não soma o bolso. |
| 15/nov | 2.4 | Parado, a popularidade cai pouco (50% → 48% em 10 turnos); o rombo ainda não pesa no bolso. Conferir outros índices que nascem fora do ponto. |
