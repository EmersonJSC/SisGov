# API da partida

A interface fala com o jogo **só** por `src/app/partida.ts`. Ela não importa
nada de `src/engine/`, `src/game/`, `src/domain/` nem `src/conteudo/`.
Tudo o que a tela desenha sai de `verPartida`; tudo o que o jogador faz entra
por `mudarLei`, `responderDilema` e `encerrarTurno`.

## Funções

| Função                                                  | Entrada                                                                                  | Devolve                                 | Quando usar                                   |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------- | --------------------------------------------- |
| `criarPartida(opcoes?)`                                 | `{ pais?: "brasil", modo?: "teste" \| "real", semente?: number, ocorrencias?: boolean }` | `Resultado<Partida>`                    | Novo governo                                  |
| `mudarLei(partida, leiId, nivel)`                       | id da lei e o nível (para leis com opções, o `valor` da opção)                           | `Resultado<Partida>`                    | Jogador escolheu uma opção ou valor           |
| `revogarLei(partida, leiId)`                            | id de uma lei em vigor e revogável                                                       | `Resultado<Partida>`                    | Tirar a lei do mapa (volta ao catálogo, D-65) |
| `encerrarTurno(partida)`                                | —                                                                                        | `Resultado<{ partida, relatorio }>`     | Botão "Encerrar turno" (um trimestre)         |
| `verPartida(partida)`                                   | —                                                                                        | `VisaoPartida`                          | Sempre que for desenhar                       |
| `preverLei(partida, leiId, nivel, trimestres?)`         | id da lei e o nível que o jogador está considerando                                      | `Resultado<PrevisaoLei>`                | Prévia antes de aplicar a mudança             |
| `leisQueCaem(partida, leiId, nivel)`                    | id da lei e o nível que o jogador está considerando                                      | `VisaoQueda[]`                          | Avisar que leis filhas cairiam                |
| `responderDilema(partida, dilemaId, opcaoId)`           | dilema da mesa e a opção escolhida                                                       | `Resultado<Partida>`                    | Jogador assinou a decisão (SG106)             |
| `preverDilema(partida, dilemaId, opcaoId, trimestres?)` | dilema da mesa e a opção considerada (padrão: 4 trimestres)                              | `Resultado<{ efeitos, interrompida? }>` | Prévia da opção, contra não responder         |
| `chanceDaOcorrencia(partida, id)`                       | id do evento ou dilema                                                                   | chance, base e fatores, ou `undefined`  | Explicar por que algo é provável              |

`Resultado<T>` é `{ ok: true, value }` ou `{ ok: false, erros: string[] }`.
Erros são frases prontas para mostrar ao jogador.

A `Partida` é imutável: cada função devolve uma partida nova. Guarde a última
e descarte a anterior (ou guarde para "desfazer").

## O que a tela recebe (`VisaoPartida`)

- `turno` e `cenario` (ex.: "Brasil 2026").
- `contas` (SG157): `receita`, `gasto`, `juros` e `resultado` por ano e
  `divida`, na moeda do país (milhões), mais `pib` e `percentualPib` (os
  mesmos números em % do PIB, como estão na rede). Saem das bolhas do
  orçamento (`BOLHAS_DO_ORCAMENTO`): resultado = receita − gasto − juros;
  positivo é superávit. `cofre` (D-57): quando a dívida líquida fica abaixo
  de zero, `divida` é 0, `cofre` é o dinheiro guardado e `juros` fica
  negativo (rendimento do cofre).
- `leis[]`: `id`, `nome`, `descricao`, `grupo` (orcamentaria, regulatoria,
  tributaria, institucional), `area`, `ministerios[]`, `ministerio`, `nivel` (o que já
  funciona), `meta` (o que o jogador escolheu; o nível anda até ela mês a
  mês), `minimo`, `maximo`, `unidade` (`moeda_ano` nas leis de valor fixo,
  `percentual_receita` nos pisos vinculados do SG137, `percentual_0_100` nos
  impostos, `nivel_escopo` nas leis de opções), `opcoes[]` (`id`, `rotulo`, `valor`, `saldoAnual`: quanto a lei arrecadaria ou custaria por ano naquela opção, com o país como está),
  `opcaoAtual`, `saldoAnual` (quanto a lei arrecada, +, ou custa, −, por ano,
  somando as setas dela para a receita e o gasto), `processo` (`emenda-constitucional`,
  `lei-ordinaria`, `execucao-programa-autorizado`…). A tela põe as leis de
  emenda constitucional também na área da Presidência.
- `bolhas[]`: `id`, `nome`, `tipo` (calculado = índice, estoque = bolha lenta,
  situacao, evento, grupo = satisfação de um grupo social, SG143), `unidade`, `area`, `avaliacao` (maior_melhor,
  maior_pior, neutra), `valor`, `minimo` e `maximo` (escala do domínio) e,
  nas situações, `surgimento`; `contexto` (D-55): a parte do valor que as
  leis e a rede não explicam, fixa desde o turno 0.
- `leis[].exige` (SG138, só nas leis filhas): `lei` e `nome` da mãe,
  `opcoes` (rótulos das opções da mãe que liberam a filha), `base` (opção
  para onde a filha cai), `atendida` e `motivo`. `leis[].filhas[]`: `id`,
  `nome`, `valores` (valores desta lei que mantêm a filha) e `ativa` (a filha
  está fora da base). Regra: fora da base, `mudarLei` e `preverLei` recusam a
  filha se a mãe não está numa opção exigida; quando a mãe sai delas, a
  filha cai para a base na mesma ação, em cascata, e a prévia da mãe já
  inclui a queda. Voltar a mãe não religa a filha.
- Três níveis e catálogo (SG160, D-65): `leis[].nivelLegal` (`petrea`,
  `constitucional` ou `derivada`; ausente nas áreas ainda não migradas),
  `emVigor` (a lei está no mapa; fora dele, está no catálogo),
  `revogavel` (pode sair do mapa agora), `bloqueio` (por que não pode
  entrar em vigor ou mudar agora) e `exigencias[]` (todas as exigências;
  `exige` é a primeira). Pétrea: `mudarLei` e `revogarLei` recusam.
  Derivada: `mudarLei` numa lei fora de vigor a aprova (entra no mapa);
  quando uma exigência falha, ela sai de vigor em cascata (`VisaoQueda`
  com `revogada: true`) em vez de cair para a base.
- `grupos[]` (SG143): a lista lateral dos grupos sociais, do mais ao menos
  satisfeito: `id`, `nome`, `satisfacao` (0–100), `peso` (parte do
  eleitorado, 0–1; a aprovação é a média pelos pesos), `gosta[]` e `odeia[]`
  (até 5 cada, do maior para o menor: `id` da lei ou da bolha, `nome`,
  `tipo` lei/bolha e `pontos` de satisfação que aquilo dá ou tira agora,
  sem o contexto do cenário). Muitas leis batem no teto de ±10 pontos; em
  meio ponto de diferença, a lei mudada pelo jogador vem antes (D-58).
- `ligacoes[]`: `origem` (id de lei ou de bolha), `alvo` (id de bolha, ou
  `eficacia:<lei>`), `sinal` (1 sobe, −1 cai), `atrasoMeses` (atraso declarado
  convertido para meses; o conteúdo da partida já é mensal, então é o próprio
  `atrasoPassos` — até 10/out saía multiplicado por 3 por engano), `mecanismo`
  (`afim`, `limiar`, `pontos` — um valor por opção — ou `produto`: seta extra
  do fator de um produto ou de um custo que reage, como consumo → receita,
  dívida → juros e desemprego → gasto).

`ministerios[]` é a lista de áreas ministeriais relacionadas à lei; no conteúdo
atual, cada lei informa uma. A interface mantém um único nó mesmo quando a
lista tiver mais de um ministério. O campo `ministerio` continua como rótulo
principal.

- `ocorrencias` (SG106, desenho em `ocorrencias.md`): `mesa[]` (dilemas
  esperando resposta — o turno não passa enquanto houver; cada um com
  `manchete`, `descricao`, `nivel` 1–4, `origem`, `area`, `causa?` e
  `opcoes[]` com `rotulo`, `descricao`, `disponivel`/`motivo`,
  `duracaoMeses`, `efeitos[]`, `leis[]` que a opção muda e `padrao`, a do
  piloto), `emCurso[]` (eventos e respostas valendo, com `mesesRestantes`
  e `efeitos[]`) e `historico[]` (os 40 mais recentes). Os textos já vêm
  com as variáveis trocadas (`{cidade}`, `{ministro}`…).
- `ligacoes[].ocorrencia` (SG106): `{ id, nome }` quando a seta sai de uma
  ocorrência em curso (o nó do evento ou da opção escolhida). Setas de
  ocorrências paradas não aparecem.

`VisaoPartida` ainda não informa os ocupantes dos cargos nem aprovação do
partido. A interface usa um símbolo neutro para o ocupante e indica aprovação
como indisponível até esses dados entrarem no contrato.

O `relatorio` de `encerrarTurno` traz `turno`, `contasAntes` e `contas` (as
contas da rede antes e depois do trimestre), `contasSemVoce` (as contas do
país no piloto automático), `leisAlteradas`, `dilemasDiferentes` (respostas
em curso diferentes da opção padrão), `ocorrencias` (o jornal do turno:
`eventos`, `dilemas` que chegaram à mesa, situações que `surgiram` e
`acabaram`) e `mudancas[]` (todas as bolhas
que mudaram, da maior mudança para a menor, com `antes`, `depois`, `porVoce`
— a parte que veio das decisões do jogador — e `sozinho`).

**Prévia (SG159).** `preverLei` aceita de 1 a `MAXIMO_TRIMESTRES_PREVIA` (20)
trimestres inteiros. Se a simulação parar no meio, devolve os meses
calculados e diz por quê em `interrompida`. `VisaoLei.minimo`/`maximo` são os
limites efetivos (os mesmos que `mudarLei` aceita). Pedir a meta que já vale
devolve a mesma partida, sem nova ação. `VisaoBolha.minimo`/`maximo` são a
escala de desenho (`faixaVisual`, ou o domínio).

**Ocorrências e piloto (SG106).** O sorteio é por hash da semente, do turno
e da ocorrência; sem `semente`, `criarPartida` usa 1; a tela sorteia
uma semente por partida nova (cada partida é diferente), e a mesma semente
repete a história. O piloto recebe os mesmos
números e responde todo dilema com a opção `padrao`. `ocorrencias: false`
desliga eventos e dilemas (testes antigos).

**Marca do jogador (D-58).** A `Partida` leva `piloto`: o mesmo país sem
nenhuma decisão do jogador, que anda junto a cada turno (só é simulado à
parte depois da primeira mudança de lei). Na visão, `VisaoLei.alteradaPorVoce`
diz se o jogador mudou a meta da lei e `VisaoBolha.semVoce` traz o valor que a
bolha teria sem ele.

A `PrevisaoLei` de `preverLei` simula `trimestres` turnos (padrão 1; a tela
usa 4 = um ano) e traz `implantacao` (o nível em funcionamento ao fim de
cada mês) e `efeitos[]`: para cada bolha que muda,
`atual`, `semMudanca[]` e `comMudanca[]` (um valor por mês). A diferença entre os dois é o
efeito da lei; os atrasos aparecem como meses sem diferença. Nada é gravado
na partida. A prévia supõe que a mudança vale na hora, como no modo `teste`.

## Exemplo

```ts
import {
  criarPartida,
  mudarLei,
  encerrarTurno,
  verPartida,
} from "./app/partida";

let partida = criarPartida().value; // checar .ok antes
const lei = verPartida(partida).leis.find((l) => l.id === "salario-minimo")!;
partida = mudarLei(partida, lei.id, lei.opcoes!.at(-1)!.valor).value;
const passou = encerrarTurno(partida);
if (passou.ok) {
  partida = passou.value.partida;
  console.log(passou.value.relatorio.mudancas);
}
```

## Modo

- `teste` (padrão): toda mudança vale na hora; o Congresso ainda não vota.
- `real`: leis que exigem o Congresso viram proposta. A votação ainda não está
  ligada ao turno, então a proposta fica parada (chamados SG104–SG108).

## Regras para quem mexe na interface

1. Não importar `engine/`, `game/`, `domain/` nem os JSONs de `conteudo/`.
2. Posição, cor e tamanho das bolhas são só da tela; nunca mudam o jogo.
3. Se faltar algum dado na `VisaoPartida`, peça para acrescentar aqui, em vez
   de ler o motor direto.

## Estado atual

A tela principal (`src/ui/mapa/`, ver o README da pasta) usa só esta API.
`src/lawMapDemo.ts` foi removido em 10/out.
