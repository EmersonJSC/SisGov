# SG055 — Comparação de cenários de referência

**Estado:** Concluído — execução de referência registrada.  
**Data:** 3 de outubro de 2026.  
**Dependência:** [SG054](sg054-cenario-json.md).

Foram executadas três trajetórias determinísticas de oito turnos com o pacote `brasil-primeiro-cenario`. Em todas, P2 e P3 permaneceram nos valores herdados. O teste aplica a resposta gradual de P1 em direção à meta indicada, aciona as consequências declaradas da política e preserva os atrasos do motor.

## Resultado no turno 8

| Cenário | Meta de P1 | Recursos efetivamente implantados | Cobertura APS | Saúde | Pressão hospitalar | Despesa anual do recorte | Saldo anual do recorte |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Base | R$ 4.000 mi | R$ 4.000 mi | 72,00 | 60,00 | 54,00 | R$ 4.840 mi | R$ 360 mi |
| Expansão | R$ 5.000 mi | R$ 4.942,35 mi | 75,67 | 60,46 | 53,00 | R$ 5.782,35 mi | −R$ 582,35 mi |
| Redução | R$ 3.000 mi | R$ 3.204,41 mi | 69,00 | 59,67 | 54,76 | R$ 4.044,41 mi | R$ 1.155,59 mi |

Violência letal e proteção efetiva às mulheres ficaram em 21,2 e 42 nos três testes, como esperado: P3 e P2 não receberam mudança. O saldo pode ficar negativo; é resultado financeiro do recorte, não falha do motor nem autorização automática de gasto.

## Ordem observada

No cenário de expansão, recursos começam a subir no turno 1, de R$ 4.000 para R$ 4.300 milhões. A cobertura só começa a responder no turno 2, por causa do atraso. A pressão só cai no turno 4 e saúde só se altera no turno 5. A sequência confirma a regra de jogo: **decisão → implantação → efeito de serviço → consequência social**.

A redução segue a mesma cadeia no sentido oposto. O saldo melhora imediatamente porque a despesa é contábil e não social; saúde piora apenas depois dos atrasos. Assim, o jogador vê a contrapartida financeira antes de ver parte do custo social.

## Divergência encontrada e corrigida

Na primeira execução, cobertura mudava, mas pressão e saúde permaneciam na base. As relações intermediárias já existiam no JSON, porém não estavam ativadas por uma política contínua. Isso revelou uma limitação da ativação atual do motor: uma consequência só participa do passo quando sua fonte de ativação está na lista ativa.

O pacote foi corrigido sem mudar o núcleo: as relações `cobertura → pressão`, `cobertura → saúde` e `pressão → saúde` são mantidas pela política de atenção básica; `violência → pressão` é mantida pela política de prevenção e cooperação. A **origem numérica** continua sendo o indicador correto — cobertura, pressão ou violência — e não a política. A política é apenas a fonte de ativação enquanto estiver vigente.

Essa solução serve ao recorte porque as três políticas começam vigentes e contínuas. Uma versão futura com relações sistêmicas independentes de qualquer política deverá receber um tipo explícito de ativação contínua, em vez de reutilizar esse vínculo.

## Verificação

`src/tests/firstScenarioComparison.test.ts` compara base, expansão e redução. Ele confirma que a base fica estável e que expansão e redução mudam cobertura, pressão, saúde e saldo nas direções esperadas. O teste não valida cientificamente os coeficientes: ele verifica que o motor executa o contrato documentado.

SG055 conclui que o recorte é executável e apresenta escolhas com custo e consequência observáveis. SG056 deve revisar fontes, unidades, ordem de grandeza e limites antes de avançar às regras de partida.
