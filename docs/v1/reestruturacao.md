# Reestruturação do código

> **Status: VIGENTE.** Diz o que acontece com cada parte do código atual (commit
> `2442bdd`, cerca de 26 mil linhas fora os testes) até a versão 1. Decisão D-68.

## 1. Princípios

1. **O jogo roda o tempo todo.** Nenhum chamado deixa a `main` quebrada. Mudanças
   grandes entram atrás de um caminho novo e o antigo sai só quando o novo cobre o
   mesmo caso.
2. **Primeiro tirar, depois mexer.** Código sem uso sai antes de qualquer refatoração,
   para não refatorar o que vai ser apagado.
3. **Refatorar sem mudar comportamento** é um chamado; **mudar comportamento** é
   outro. Nunca os dois juntos.
4. **Nada se perde.** Antes de remover, o ponto atual recebe a etiqueta git
   `v0-antes-da-v1`. Qualquer arquivo pode ser recuperado dali.

## 2. Destino de cada parte

| Parte | Linhas (aprox.) | Destino | Chamado |
| --- | --- | --- | --- |
| `src/engine/` (motor) | 7.800 | **Fica e ajusta.** Ganha situações com entrada e saída e efeitos declarados dentro da ficha. Mantém os mecanismos próprios (afim, pontos, limiar, estoque, resposta gradual); não adota fórmulas do D4. | V1-07 |
| `src/engine/model/validateContentFile.ts` | 3.500 | **Divide** por tipo de arquivo (lei, índice, país, ocorrência) | V1-05 |
| `src/app/partida.ts` | 1.800 | **Divide** em `criar`, `leis`, `turno`, `visao`, `previsao`, `salvar`, sem mudar comportamento | V1-03 |
| `src/game/` partida, turno, ações sobre leis, implantação, ocorrências, ministérios, requisitos | 2.100 | **Fica e ajusta** | V1-03, V1-06 |
| `src/game/` propostas, votação, Senado, eleição antiga (`commitApprovedProposal`, `prepareProposalTramitation`, `resolveParliamentaryVote`, `sampleParliamentaryVotes`, `commitSenateElection`, `commitElection`, `elections` e o que o grafo de importações mostrar fora do caminho da partida) | 1.600 | **Saiu no V1-04**, junto com `prepareProposalTramitation` e o apoio social antigo (`socialSupport`). Mudança sem rota executiva agora é recusada com aviso, em vez de virar proposta que nunca era votada. O parlamento volta na versão 2 com desenho novo; a etiqueta guarda o código. Os campos de eleição e Senado do estado da partida (`elections`, `electoralLaws`, cadeiras) ficam até a eleição nova do V1-12. | V1-04 |
| `src/domain/game/` | 800 | **Feito no V1-04:** `policyState`, `result` e `policyRules` foram para `game/leis/`; propostas saíram com o parlamento | V1-04 |
| `src/scenarios/` | 700 | `loadScenarioPackage` foi para `game/pais/` no V1-04; `brazilMap`, `brazilPresidency` e `d4ReferenceSandbox` **saíram** no V1-02, junto com `engine/validateScenario` e `types/scenario`, que só serviam a eles | V1-02 |
| `src/motorDemo.ts`, `motor-demo.html`, `src/ui/GameMap.tsx`, `MapFilters.tsx`, `TurnLogPanel.tsx`, `src/influenceLayout.ts`, `src/mapPhysics.ts`, `src/mapMetrics.ts`, `src/relationPaths.ts`, laboratório (`advanceLaboratoryTurn`, `advanceQuarterlyLaboratoryTurn`, `turnJournal`) | 2.600 | **Saíram no V1-02.** A tela principal não usava nada disso. | V1-02 |
| `src/ui/mapa/` | 9.200 | **Fica e ajusta.** `MapaPolitico.tsx` (2.000) e `Documentos.tsx` (1.400) são divididos quando o mapa v1 e a janela v1 forem feitos. | V1-26, V1-27 |
| `src/conteudo/mundo/` | 3.200 arquivos | **Refaz** a partir das fichas v3, área por área. As 2.896 ligações em arquivos soltos viram efeitos dentro de cada ficha. | V1-05, V1-14 a V1-23 |
| `src/conteudo/paises/brasil/` | 4 arquivos | **Refaz** como configuração do país | V1-06 |
| `src/conteudo/testes/` | | Fica só o que os testes do motor usam | V1-04 |
| `docs/fichas/` (v1 e v2) | | **Desativado.** O formato novo fica em `docs/fichas/v3/`. | V1-05 |
| `scripts/fichas/` | | **Ajusta**: conversor e verificador do formato v3 | V1-05 |
| `src/tests/` (70 arquivos) | | Os do motor ficam. Os que testam o que sai, saem junto. Os de conteúdo são refeitos com o conteúdo. | cada chamado |
| `SisGov-backup-2026-09-25.bundle`, `dist/` | | O backup saiu do git no V1-02 e fica só no notebook (`*.bundle` no `.gitignore`); `dist/` já era ignorado | V1-02 |

## 3. Ordem

```text
V1-01 documentos  →  V1-02 código morto  →  V1-03 dividir a partida
       →  V1-04 tirar o parlamento e fixar camadas
       →  V1-05 ficha v3  →  V1-06 país  →  V1-07 índices e situações
       →  conteúdo e jogo (ver PLANO)
```

Os quatro primeiros chamados não mudam nada que o jogador veja. Eles deixam o
código menor e com fronteiras claras antes de o conteúdo novo entrar.

## 4. Riscos

| Risco | Como evitar |
| --- | --- |
| Remover algo que a tela usa sem perceber | Antes de apagar, `grep` de cada importação e `npm run check` verde |
| Conteúdo novo e antigo convivendo | Durante a fase de conteúdo, cada área usa o formato antigo até a sua vez; o carregador aceita os dois e o verificador mostra quantas leis faltam migrar |
| Refatoração sem fim | Cada chamado tem limite de arquivos no escopo; o que passar disso vira chamado novo |
| Perder números do Brasil já calibrados (orçamento, 108 índices) | V1-06 migra os valores sem mudar nenhum; um teste compara o turno 0 antes e depois |
