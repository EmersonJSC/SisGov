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
| 15/nov | 3.7 | Inflação pelo rombo usa só o primário; o rombo dos juros não pesa. Rever quando câmbio e expectativas entrarem. |
| 15/nov | 4.19 | Ministros: entender e estudar melhor o papel deles (o que fazem no jogo, o que dá para programar) antes de mexer. |
| 16/nov | 4.4 | Regras do plano (cobertura mínima, obrigação de ter plano) sem dente: pedem uma cesta "plano" no mercado para encarecer o plano de quem paga. |
| 16/nov | 2.4 | A bússola pesa mais que o bolso: tirar a farmácia popular (remédio +3%) derruba a aprovação de 48% para 38% quase só pela bússola. O GDD pede bússola com peso menor. |
| 16/nov | 4.18 | Obra da rede de saúde entrega tudo de uma vez depois de ~14 turnos (atendimento 30 → 39,5 no turno 14): dois anos sem sinal. Entregar aos poucos ou mostrar a obra andando. |
| 16/nov | 4.18 | Rede de saúde: `vagas_fora` nasce negativo no Brasil (−55 milhões). Conferir. |
| 16/nov | 4.3 | Verba da saúde abaixo de 4% é recusada (piso da saúde em vigor) sem o jogador saber por quê. |
| 16/nov | 4.18 | Drogas ficam divididas entre Saúde e Segurança (autor); a regra "a licença segue o produto, drogas na Saúde" do GDD 4.18 está desconsiderada. Dividido em 16/nov: liberação, lojas licenciadas e venda pelo Estado foram para Segurança. |
| 16/nov | 8.8 | SisGovpedia básica: tooltips com palavras destacadas que abrem texto dentro de texto (pedido do autor; 8.8 está fora da V1, aguardando ele mudar o escopo). |
| 16/nov | 4.16 | Sinais trocados nos efeitos (imposto sobre remédio, reposição de servidores): revisar índice por índice em cada instituição quando ela abrir, como a Saúde. |
| 16/nov | 2.4 | Imposto cortado quase não chega ao bolso: só o imposto de renda e o preço da cesta. Cortar o imposto sobre consumo de 17% para 14% devolve ~1,5% do PIB e o pobre sente só −1,2% na comida. Rever na instituição Impostos. |
| 16/nov | 8.7 | Ícones, imagens e bolhas próprios em SVG, no lugar da biblioteca game-icons.net (pedido do autor; 8.7 Arte final está fora da V1, aguardando ele mudar o escopo). |
| 17/nov | 4.18 | Médico longe de quem precisa: falta de médico por distância, não por número. Feito e desfeito em 17/nov (índice Médico onde falta sem peça do jogo por trás). Quando voltar, sair da população (a fila por pop, como o saneamento já faz com o campo), nunca de cidade ou estado. |
