# SG056 — Revisão do primeiro cenário

**Estado:** Concluído — marco de saída da Fase 6.  
**Data:** 3 de outubro de 2026.  
**Dependências:** SG049–SG055.

## Decisão de revisão

O primeiro recorte está aprovado como **modelo jogável inicial e auditável**. Ele não é aprovado como previsão científica, reprodução integral do Brasil ou modelo eleitoral. A pergunta do jogo continua clara: distribuir recursos entre atenção básica, proteção às mulheres e prevenção/cooperação em segurança, aceitando custos imediatos e consequências graduais.

## Coerência verificada

| Tema | Resultado | Evidência |
| --- | --- | --- |
| Escopo | Três políticas, dez variáveis de domínio, um evento, uma situação e dois perfis. | `brasil-primeiro-cenario/cenario.json` e SG049. |
| País fora do núcleo | O motor carrega o pacote por manifesto, sem regra específica de Brasil, SUS ou ministério no executor. | Carregador distribuído e teste `firstScenarioPackage`. |
| Unidades | Verbas e finanças usam R$ milhões de 2024/ano; cobertura mantém percentual; violência letal mantém taxa por 100 mil; índices de jogo são identificados. | SG051 e `variaveis.json`. |
| Estado herdado | As políticas começam vigentes; controles, despesa e saldo têm valores iniciais coerentes. Um turno sem decisão preserva a base. | Teste `firstScenarioPackage`. |
| Tempo | Implantação, degradação e atrasos produzem a sequência decisão → serviço → consequência. | SG053 e comparação SG055. |
| Finanças | Despesa e saldo são calculados uma vez por política; déficit é resultado válido. | Consequências financeiras e SG055. |
| Perfis | Pesos 0,55 e 0,45 agora vivem no manifesto e o validador exige soma igual a 1. | `cenario.json` e validação de coerência. |
| Auditabilidade | Cada consequência conserva origem, alvo, parâmetro, atraso e mecanismo; o mapa pode expor essas relações. | JSON de consequências e regra do mapa. |

## Fontes e hipóteses

O cenário preserva como dados observados a cobertura estimada da APS em 2024 e a taxa de homicídios de 2023. As referências institucionais para atenção básica, proteção às mulheres e Susp foram registradas em SG050–SG052. Os valores financeiros do envelope, índices compostos, pesos dos perfis, coeficientes, atrasos e limites são hipóteses explícitas de design.

Não usar os testes de software como evidência de impacto social real. Eles mostram que a regra declarada é calculada de forma repetível; não demonstram que R$ 1 milhão produz determinado resultado no país.

## Limites aceitos para a próxima fase

- O mapa visual ainda abre `brasil-basico`; `brasil-primeiro-cenario` é o pacote executável que deverá ser conectado à experiência quando a Fase 7 definir o turno.
- A ativação de relações sistêmicas é temporariamente vinculada a uma política contínua vigente. A origem numérica continua correta, mas um mecanismo futuro de ativação sistêmica independente será mais expressivo.
- O evento está declarado e seu efeito possui duração; o calendário que o dispara entra em SG057.
- Perfis estão no conteúdo, mas ainda não calculam opinião, aprovação ou voto. Isso é intenção da Fase 7, não ausência escondida.
- Autorizações, Senado, metas pendentes, receitas além do envelope e eleição ainda não foram implementados.
- O cenário não simula governos estaduais, municípios, unidades de serviço, indivíduos ou vítimas individualmente.

## Resultado da fase

A Fase 6 entrega um cenário pequeno que pode ser carregado, executado e comparado. A expansão de atenção básica mostra ganho gradual de cobertura, redução posterior de pressão e pequena melhora de saúde, com piora financeira; a redução faz o caminho inverso. Isso é suficiente para iniciar SG057, que definirá como uma partida apresenta propostas, turnos, autorização, opinião e eleição.
