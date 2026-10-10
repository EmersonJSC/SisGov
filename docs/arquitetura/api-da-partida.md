# API da partida

A interface fala com o jogo **só** por `src/app/partida.ts`. Ela não importa
nada de `src/engine/`, `src/game/`, `src/domain/` nem `src/conteudo/`.
Tudo o que a tela desenha sai de `verPartida`; tudo o que o jogador faz entra
por `mudarLei` e `encerrarTurno`.

## Funções

| Função                            | Entrada                                                           | Devolve                             | Quando usar                           |
| --------------------------------- | ----------------------------------------------------------------- | ----------------------------------- | ------------------------------------- |
| `criarPartida(opcoes?)`           | `{ pais?: "brasil", modo?: "teste" \| "real", semente?: number }` | `Resultado<Partida>`                | Novo governo                          |
| `mudarLei(partida, leiId, nivel)` | id da lei e o nível (para leis com opções, o `valor` da opção)    | `Resultado<Partida>`                | Jogador escolheu uma opção ou valor   |
| `encerrarTurno(partida)`          | —                                                                 | `Resultado<{ partida, relatorio }>` | Botão "Encerrar turno" (um trimestre) |
| `verPartida(partida)`             | —                                                                 | `VisaoPartida`                      | Sempre que for desenhar               |

`Resultado<T>` é `{ ok: true, value }` ou `{ ok: false, erros: string[] }`.
Erros são frases prontas para mostrar ao jogador.

A `Partida` é imutável: cada função devolve uma partida nova. Guarde a última
e descarte a anterior (ou guarde para "desfazer").

## O que a tela recebe (`VisaoPartida`)

- `turno`, `caixa`, `divida`, `pib` (moeda do país, em milhões).
- `leis[]`: `id`, `nome`, `descricao`, `grupo` (orcamentaria, regulatoria,
  tributaria, institucional), `area`, `ministerios[]`, `ministerio`, `nivel` (o que já
  funciona), `meta` (o que o jogador escolheu; o nível anda até ela mês a
  mês), `minimo`, `maximo`, `unidade`, `opcoes[]` (`id`, `rotulo`, `valor`),
  `opcaoAtual`, `gastoAnual`.
- `bolhas[]`: `id`, `nome`, `tipo` (calculado = índice, estoque = bolha lenta,
  situacao, evento), `unidade`, `area`, `avaliacao` (maior_melhor,
  maior_pior, neutra), `valor`.
- `ligacoes[]`: `origem` (id de lei ou de bolha), `alvo` (id de bolha, ou
  `eficacia:<lei>`), `sinal` (1 sobe, −1 cai), `atrasoMeses` (atraso declarado
  convertido para meses).

`ministerios[]` é a lista de áreas ministeriais relacionadas à lei; no conteúdo
atual, cada lei informa uma. A interface mantém um único nó mesmo quando a
lista tiver mais de um ministério. O campo `ministerio` continua como rótulo
principal.

`VisaoPartida` ainda não informa os ocupantes dos cargos nem aprovação do
partido. A interface usa um símbolo neutro para o ocupante e indica aprovação
como indisponível até esses dados entrarem no contrato.

O `relatorio` de `encerrarTurno` traz `turno`, `receita`, `gastoPrimario`,
`juros`, `resultado` e `mudancas[]` (as 15 bolhas que mais mudaram, com
`antes` e `depois`).

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

`src/lawMapDemo.ts` já cria a partida, muda leis e passa o turno por esta
API, mas ainda lê alguns tipos do motor para desenhar (herança do
laboratório). Ao refazer a tela, use só `verPartida`.
