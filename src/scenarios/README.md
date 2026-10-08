# Adicionar conteúdo ao SisGov

A bancada descobre automaticamente todo manifesto salvo como `src/scenarios/<pasta>/cenario.json`. Não existe uma lista de países ou cenários no motor nem na interface.

## Roteiro curto

1. Copie a pasta `inclusao` com outro nome.
2. Troque todos os IDs por identificadores únicos.
3. Edite `variaveis.json` e `estado-inicial.json`.
4. Crie uma política em `politicas/` e declare seu controle e suas consequências.
5. Crie um evento em `eventos/` e declare suas consequências.
6. Se o cenário tiver instituições e regras políticas, crie um
   `organizacao-politica.json` e declare o caminho em `organizacaoPolitica` no
   manifesto.
7. Liste os demais arquivos no `cenario.json` da pasta.
8. Execute `npm test` para validar todos os manifestos distribuídos.
9. Abra `motor-demo.html`: o cenário novo deve aparecer automaticamente no seletor.

O pacote `inclusao` demonstra uma lei contínua e um evento único. Na bancada técnica, eventos podem ser preparados manualmente para inspecionar resultado e causa. O disparo por condições do jogo será conectado pela integração geral do turno; o arquivo do evento não executa código.

Conteúdo novo pode usar somente mecanismos reconhecidos pelo motor. Fórmulas livres e código dentro de JSON são recusados.

## Organização política do cenário

`organizacao-politica.json` configura, por cenário, a forma inicial de governo,
as formas alternativas, as instituições ativas, sua composição e mandatos, os
processos constitucionais e as mudanças que podem ser propostas. Assim, a
quantidade de cadeiras, unidades territoriais, ciclos de renovação e regras de
votação não ficam fixos no motor. A configuração atual do Brasil é um primeiro
exemplo; a execução dessas transições durante a partida ainda precisa ser
integrada à camada de jogo.

## Referência visual de uma política

O campo opcional `icone` seleciona um SVG local do projeto. Por exemplo, `"icone": "saude/atendimento"` usa `src/assets/svg/saude/atendimento.svg`. O desenho pode ser criado pelo usuário ou por IA, sem alteração de código. Consulte [o guia do acervo de SVGs](../assets/svg/README.md).
