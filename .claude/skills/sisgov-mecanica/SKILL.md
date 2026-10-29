---
name: sisgov-mecanica
description: Use when working on any SisGov mechanic, law, indicator, budget line or economy number — before grepping the repo to find where something lives or how the engine reads it.
---

# Mecânica do SisGov

Mapa do repositório e fatos do motor que custam caro para redescobrir.
Ler isto antes de sair procurando: evita varrer `src/` e `docs/` de novo.

## Onde fica cada coisa

| O que                                           | Onde                                                                                              |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Status e ordem do trabalho                      | `PLANO.md` (única fonte de status)                                                                |
| Desenho da mecânica em curso                    | `docs/jogo/mecanicas/<nome>.md`                                                                   |
| Alvo de calibragem da economia                  | `docs/jogo/leis/equilibrio.md` + `scripts/equilibrio/simular.py` (modelo de bolso, não é o motor) |
| Variáveis (estoque, calculado, grupo, situação) | `src/conteudo/mundo/indicadores/variaveis.json`                                                   |
| Uma lei                                         | `src/conteudo/mundo/leis/<id>.json`                                                               |
| Seta entre duas variáveis                       | `src/conteudo/mundo/consequencias/<origem>--<alvo>.json`                                          |
| Números de partida do Brasil                    | `src/conteudo/paises/brasil/`                                                                     |
| Contas do orçamento                             | `src/app/partida/contas.ts`                                                                       |
| Tipos do conteúdo (campos e o que fazem)        | `src/engine/model/contentTypes.ts`                                                                |
| Scripts de diagnóstico                          | `scripts/teste/`, `scripts/economia/`                                                             |

`src/conteudo/_arquivo-leis-antigas/` e `src/conteudo/testes/legado/` são
histórico: um grep acerta lá e engana. Confira o caminho antes de concluir.

## Não abrir sem o autor pedir

`docs/v1/desenho/`, `docs/referencia/`, `docs/arte/PROMPTS.md`,
`docs/conteudo/rede.md`, `docs/Exemplos/`. São pesados.

## Fatos do motor que enganam

**Coeficiente 0,25 em `percentual_pib_por_passo` é conversão de tempo, não
rateio.** O passo é o trimestre e as contas são anuais, então 0,25 × valor
anual é o fluxo do passo. Ver uma lei mandar "0,25" para a dívida não quer
dizer que ela manda 25% da sobra.

**Lei que parece duplicar uma seta pode estar cancelando a linha de base.**
`resultado-fiscal--divida-publica` já abate dívida com coeficiente −0,25
sempre. A lei "Destino da sobra" soma +0,25 no mesmo alvo para _anular_ essa
linha quando o jogador manda guardar. Antes de chamar de bug, procure a
consequência de base com o sinal contrário.

**`transbordo` liga dois estoques.** `sentido: "oposto"` = um é bem e o outro
é dívida (cofre negativo vira dívida). `teto` opcional: acima dele o excesso
vai para o outro estoque, e só passa o que o outro consegue receber.

**`saldoDasLeis` tem casos especiais por id de lei** (servidores,
aposentadoria, reajuste de benefícios) antes do caminho genérico pelas setas.
Mexer no custo dessas leis exige mexer lá, não só no JSON.

**Mudar coeficiente `afim` pede mexer no `termoConstante`.** A conta é
`coef × x + termo`. Para manter o ponto onde o efeito é zero, recalcule
`termo = −coef × zero_antigo` (o zero antigo é `−termo/coef`). A `escala`
multiplica o resultado inteiro, então não desloca o zero.

**Uma mesma origem costuma ter consequências gêmeas, com o coeficiente
idêntico em alvos diferentes.** O salário mínimo tem duas: uma em
`gasto_publico` (custa dinheiro de verdade) e uma em `deficit_previdenciario`
(indicador que o jogador vê). Mudar só uma faz o indicador mentir sobre o
orçamento. Antes de mexer num coeficiente, liste todas as setas da mesma
origem (`grep -rln '"origem": "<id>"' src/conteudo/mundo/consequencias/`) e
veja se a gêmea tem seta de saída: sem saída é indicador terminal, e aí mover
as duas não conta duas vezes.

**`npx tsc --noEmit` não checa nada neste projeto.** Ele sai 0 com erro na
cara, porque o projeto usa project references: o comando certo é `npx tsc -b`
(é o que `npm run build` roda). Conferir tipo com `--noEmit` dá falso verde.

## O ciclo de um item do PLANO

1. Ler o item no `PLANO.md` e a seção dele no documento da mecânica.
2. Implementar só o que o item pede. Ideia nova vai para o PLANO, não para o código.
3. Teste de **comportamento**, não de número exato: até a calibragem final,
   os testes de números da economia ficam desligados (ordem de 24/out).
4. Rodar os testes nomeados do que mudou (`npx vitest run src/tests/<arquivo>`),
   não a suíte toda: ela passa de 10 minutos.
5. `npm run check` uma vez por mecânica terminada.
6. Commit com o ID do chamado e `[x]` no PLANO com data, commit e teste.

## Testes: o que esperar

A suíte inteira leva mais de 10 minutos e cada teste de partida leva ~6 s
(cada `encerrarTurno` roda a rede inteira). Rode por arquivo, e por nome
(`-t "pedaço do nome"`) quando quiser um só.

Teste pulado com `it.skip` costuma ter o motivo em comentário logo acima,
com a data e a mecânica que o religa. Ler esse comentário antes de religar.

## Ruído conhecido do hook

O plugin `typescript-patterns-enforcer` acusa dezenas de violações
(`no-magic-numbers`, `no-loop-statements`) nos arquivos de teste do projeto.
São pré-existentes e o `npm run check` do projeto passa com elas. Conferir se
a violação é de uma linha sua antes de mexer; reescrever o arquivo inteiro
para calar o hook é fora de escopo.

## Delegar

O autor usa um GPT como executor júnior para poupar cota, com as regras em
`gpt.md` na raiz. Entrega braçal (edição repetitiva, rodar teste) vai para
ele ou para um subagente de modelo simples; o desenho e a conferência do
diff ficam com o sênior. Nada do júnior vale sem conferir o diff.
