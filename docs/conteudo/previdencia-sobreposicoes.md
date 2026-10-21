# Sobreposições em Previdência e Assistência

> **Status: REFERÊNCIA TÉCNICA.** Triagem pelo índice e simulação em
> 19/out/2026. A revisão do setor continua aberta.

| Par encontrado | Decisão | Motivo |
| --- | --- | --- |
| `reajuste-de-beneficios` / `regra-de-reajuste-dos-beneficios` | Consolidado na primeira | Tinham exatamente as mesmas cinco opções e dois controles para o mesmo reajuste. O efeito de desigualdade foi migrado para a lei mantida; a duplicata saiu do catálogo. |
| `transferencia-de-renda` / `transferencia-de-renda-as-familias-pobres` | Pendente de formulação | Uma controla o orçamento em moeda; a outra mistura elegibilidade e valor. Há sobreposição de pobreza e insegurança alimentar. A separação entre **quanto pagar** e **quem recebe** pode criar duas decisões jogáveis, mas ainda precisa de uma trava para impedir efeitos sem verba. Não remover nem juntar antes dessa modelagem. |

A lei canônica do reajuste passou a depender do sistema previdenciário; as
opções ligadas ao salário mínimo e à trava tripla exigem pilar público (`misto`
ou `reparticao`). O índice gerou também a retirada da duplicata da lista de
leis do ministério brasileiro. Os coeficientes são hipóteses de jogo.

## Ensaio do reajuste: 16 turnos

Aplicação direta da opção, semente 7, sem ocorrências e eleição. Referência:
Brasil inicial. Rotas: correção pela inflação e trava tripla.

| Turno 16 | Pobreza | Desigualdade | Gasto (% PIB) | Inflação (%) | Déficit previdenciário | Dívida (% PIB) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Referência | 27,580 | 62,743 | 30,873 | 4,918 | 3,002 | 114,848 |
| Inflação | 33,179 | 70,858 | 29,815 | 2,828 | 0,000 | 117,840 |
| Trava tripla | 24,813 | 58,663 | 31,491 | 5,921 | 5,833 | 113,750 |

As três partidas terminaram sem falha matemática. Três testes focais passaram:
catálogo sem duplicata, gasto/desigualdade em sentidos opostos e bloqueio da
trava tripla sob capitalização. O contraste é jogável, mas os saltos de pobreza
e déficit pedem balanceamento geral. A dívida da referência segue crescendo.
