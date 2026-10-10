# API da partida

A interface fala com o jogo **só** por `src/app/partida.ts`. Ela não importa
nada de `src/engine/`, `src/game/`, `src/domain/` nem `src/conteudo/`.
Tudo o que a tela desenha sai de `verPartida`; tudo o que o jogador faz entra
por `mudarLei` e `encerrarTurno`.

## Funções

| Função                                          | Entrada                                                           | Devolve                             | Quando usar                           |
| ----------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------- | ------------------------------------- |
| `criarPartida(opcoes?)`                         | `{ pais?: "brasil", modo?: "teste" \| "real", semente?: number }` | `Resultado<Partida>`                | Novo governo                          |
| `mudarLei(partida, leiId, nivel)`               | id da lei e o nível (para leis com opções, o `valor` da opção)    | `Resultado<Partida>`                | Jogador escolheu uma opção ou valor   |
| `encerrarTurno(partida)`                        | —                                                                 | `Resultado<{ partida, relatorio }>` | Botão "Encerrar turno" (um trimestre) |
| `verPartida(partida)`                           | —                                                                 | `VisaoPartida`                      | Sempre que for desenhar               |
| `preverLei(partida, leiId, nivel, trimestres?)` | id da lei e o nível que o jogador está considerando               | `Resultado<PrevisaoLei>`            | Prévia antes de aplicar a mudança     |

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
  mês), `minimo`, `maximo`, `unidade`, `opcoes[]` (`id`, `rotulo`, `valor`, `saldoAnual`: quanto a lei arrecadaria ou custaria por ano naquela opção, com o país como está),
  `opcaoAtual`, `saldoAnual` (quanto a lei arrecada, +, ou custa, −, por ano,
  somando as setas dela para a receita e o gasto), `processo` (`emenda-constitucional`,
  `lei-ordinaria`, `execucao-programa-autorizado`…). A tela põe as leis de
  emenda constitucional também na área da Presidência.
- `bolhas[]`: `id`, `nome`, `tipo` (calculado = índice, estoque = bolha lenta,
  situacao, evento), `unidade`, `area`, `avaliacao` (maior_melhor,
  maior_pior, neutra), `valor`, `minimo` e `maximo` (escala do domínio) e,
  nas situações, `surgimento`; `contexto` (D-55): a parte do valor que as
  leis e a rede não explicam, fixa desde o turno 0.
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

`VisaoPartida` ainda não informa os ocupantes dos cargos nem aprovação do
partido. A interface usa um símbolo neutro para o ocupante e indica aprovação
como indisponível até esses dados entrarem no contrato.

O `relatorio` de `encerrarTurno` traz `turno`, `contasAntes` e `contas` (as
contas da rede antes e depois do trimestre) e `mudancas[]` (as 15 bolhas que
mais mudaram, com `antes` e `depois`).

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
