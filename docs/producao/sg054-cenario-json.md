# SG054 — Primeiro cenário em JSON

**Estado:** Concluído — pacote carregável pelo motor.  
**Data:** 3 de outubro de 2026.  
**Dependências:** [SG051](sg051-variaveis-e-perfis.md), [SG052](sg052-consequencias-do-primeiro-cenario.md) e [SG053](sg053-parametros-do-primeiro-cenario.md).

O pacote está em `src/scenarios/brasil-primeiro-cenario/`. Ele não substitui o protótipo visual `brasil-basico`: é o primeiro conteúdo de domínio que usa os contratos e parâmetros documentados nas tarefas anteriores.

## Conteúdo entregue

- Manifesto `cenario.json`, com variáveis, estado herdado, três políticas, quatorze consequências, um evento e uma situação.
- Três decisões de orçamento anual: atenção básica, rede de proteção às mulheres e prevenção/cooperação em segurança.
- Oito relações sociais de SG052, com atrasos, duração e parâmetros de SG053.
- Duas variáveis financeiras derivadas: despesa recorrente e saldo do envelope do recorte. Cada uma recebe uma contribuição por política, evitando dupla cobrança pelo grafo social.
- Evento de aumento temporário da demanda com efeito fixo de três turnos sobre pressão hospitalar.
- Situação de sobrecarga que entra em pressão `≥ 62` e sai abaixo de `56`.

## Estado herdado

O cenário começa com P1=R$ 4.000 milhões/ano, P2=R$ 240 milhões/ano e P3=R$ 600 milhões/ano. Essas políticas já estão vigentes e seus controles representam o nível que está em funcionamento. Sem nova decisão, a meta inicial é igual a esse nível; portanto, a primeira execução preserva cobertura de APS `72`, saúde `60`, pressão `54`, violência letal `21,2`, proteção `42`, despesa `4.840` e saldo `360`.

Meta futura de uma política, autorização e cobrança no momento da proposta pertencem à camada de jogo da Fase 7. O JSON não atribui ao motor poder para aprovar orçamento, escolher governo ou conhecer instituições brasileiras.

## Decisão técnica pequena

A unidade `taxa_por_100_mil` foi adicionada à lista de unidades aceitas pelo validador. Ela permite manter a violência letal como taxa, sem escondê-la dentro de um índice `0–100`. Nenhum cálculo novo foi colocado em JSON; o pacote usa somente o mecanismo afim, atraso, duração contínua/fixa e resposta gradual já existentes.

## Verificação

O teste `src/tests/firstScenarioPackage.test.ts` carrega o pacote, avança um turno sem decisão nova e confirma que o estado herdado se conserva. A suite inteira e o build passaram.

## Pendências de integração

- O evento está declarado e pode ser ativado pelo executor; o calendário que decide quando apresentá-lo entra na Fase 7.
- A situação é avaliada pelo mecanismo existente; sua apresentação e efeitos adicionais ainda dependem do fluxo de jogo.
- Perfis sociais, aprovação, Senado, proposta orçamentária e metas pendentes não fazem parte do motor numérico neste estágio.

SG055 deve comparar base, aumento e redução de recursos e registrar as trajetórias reais do pacote.
