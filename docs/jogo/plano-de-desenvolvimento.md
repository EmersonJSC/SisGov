# Plano de desenvolvimento

> **Status: PROPOSTA (31/out/2026), aguarda o autor.** O [escopo](escopo.md)
> diz **o quê** e em que ordem; este plano diz **como**: em que partes o
> código se divide, quem depende de quem, como cada passo é construído e
> conferido. Em conflito, vale o escopo.

## 1. Divisão em camadas

Quatro camadas, cada uma numa pasta de `src/`. A dependência só desce:
quem está em cima usa quem está embaixo, nunca o contrário.

```
tela/      React. Só mostra e envia pedidos. Não calcula nada.
  ↓
partida/   Aplicação. Monta a partida (mundo + país), recebe o pedido do
           jogador, chama o motor, guarda e carrega o jogo.
  ↓              ↘
motor/     Regras do Estado e cálculos.   conteudo/  Dados em JSON:
           TS puro, sem React, sem JSON.             mundo e países.
```

| Camada | Pode importar | Não pode importar |
|---|---|---|
| `motor/` | só o próprio `motor/` | `conteudo/`, `partida/`, `tela/`, React |
| `conteudo/` | nada (é dado) + os tipos do `motor/` para validar | código de regra |
| `partida/` | `motor/`, `conteudo/` | `tela/` |
| `tela/` | `partida/` (e tipos do `motor/`) | `conteudo/` direto |

A regra vira lint (`no-restricted-imports` por pasta), não só combinado:
um import errado quebra o `npm run check`.

Por que assim: o motor é testável sem tela e sem país (princípio 2 e 4 do
escopo); trocar a tela ou criar um país não mexe em regra; um script
consegue jogar um mandato inteiro só com `partida/` (critério do passo 4).

## 2. Módulos do motor

Cada módulo é uma pasta com um `index.ts` (o que ele expõe) e um `.md`
curto (o que faz, de onde vem o cálculo). Fora do `index.ts`, nada é
público.

| Módulo | Responsabilidade | Passo |
|---|---|---|
| `motor/estado` | Tipos do Estado: índices essenciais (população, ocupados, PIB real, preços, receita, gasto, dívida, juros…) e a estrutura do regime | 4 |
| `motor/calculos` | Biblioteca de cálculos estudados (Laffer, evasão, multiplicador, defasagem monetária, juros × dívida). Funções puras, cada uma com a fonte citada. Um **registro de bases** liga o nome usado no JSON (`"renda"`) à função | 3–5 |
| `motor/leis` | Intérprete: lê uma lei já validada e transforma em efeitos sobre o Estado, sempre através de uma base de `calculos` | 3–4 |
| `motor/efeitos` | Fila de efeitos com atraso: cada efeito declara em quantos turnos chega inteiro | 4 |
| `motor/contas` | Contabilidade: receita − gasto − juros → dívida; confere que fecha | 5 |
| `motor/populacao` | Pops e grupos de interesse (satisfação, radicais, lealistas) | 7 |
| `motor/politica` | Congresso (votação conforme o regime), desgaste, eleição | 8–9 |
| `motor/turno` | Orquestra a ordem do turno (seção 3). Único lugar que chama todos | 4 |
| `motor/acaso` | Gerador aleatório com semente: mesma semente, mesma partida | 4 |

O motor não conhece nomes de leis, partidos ou países. Ele conhece bases de
cálculo e índices essenciais; o resto chega como dado.

## 3. O turno

Função pura: `avancarTurno(estado, pedidos, acaso) → novoEstado`. Não altera
o estado anterior; o histórico da partida é a lista de estados.

Ordem proposta (fixa e documentada no `motor/turno`):

1. Pedidos do jogador passam pelo Congresso (a partir do passo 8; antes,
   entram direto).
2. Leis novas geram efeitos na fila, cada um com seu atraso.
3. Efeitos que vencem neste turno são aplicados.
4. Economia real: emprego e PIB real.
5. Preços e juros.
6. Contas: receita pelas bases, gasto, juros, dívida.
7. Índices de jogabilidade.
8. Pops e grupos.
9. Política: desgaste; eleição se o mandato (6N turnos) acabou.
10. Conferência das invariantes (seção 5). Falhou, o turno para com erro.

## 4. Conteúdo e contratos

```
src/conteudo/
  mundo/
    indicadores/variaveis.json   índices de jogabilidade (já existe)
    leis/<id>.json               uma lei por arquivo
    pops/ grupos/                passo 7
  paises/<id>/
    estado-inicial.json          números de partida
    leis-vigentes.json           leis essenciais e de jogabilidade em vigor
    rotulos.json                 nomes locais ("juros" → "Selic")
```

- **Contrato de dados:** cada formato de JSON tem um tipo TS no motor e um
  validador que roda ao carregar. JSON inválido falha com mensagem que diz
  arquivo, campo e motivo; nunca entra no turno.
- **Versão no arquivo:** todo JSON tem `"versao"`. Mudou o formato, sobe a
  versão e o carregador avisa o que está velho.
- **Unidades explícitas:** dinheiro em moeda do país, população em pessoas,
  alíquota como fração (0,275) e a tela mostra 27,5%. O nome do campo diz a
  unidade quando há dúvida.
- O formato da lei (contínua e de opções) é decidido no passo 3; este plano
  não antecipa.

## 5. Qualidade

**Invariantes** (conferidas todo turno, em código, não em teste):
- a contabilidade fecha: variação da dívida = gasto + juros − receita (± emissão);
- população, ocupados e PIB nunca negativos; ocupados ≤ população;
- toda lei vigente tem valor dentro da própria faixa ou entre as próprias opções.

**Testes**, só do que sobrevive ao redesenho:

| Tipo | O quê | Quando entra |
|---|---|---|
| Unidade | Cada cálculo de `motor/calculos` (são fórmulas estudadas, não mudam com o jogo) | junto com o cálculo |
| Contrato | Todo JSON de `conteudo/` passa no validador | passo 3 |
| Cenário | Script joga um mandato com semente fixa; confere a **direção** prometida (imposto sobe → receita sobe até o pico de Laffer), não o número exato | passo 4 em diante |
| Tela | Conferência visual no navegador | passo 10 |

Mecânica ainda instável não ganha teste de número (ver regras de trabalho).

**Ferramentas:** `npx tsc -b` durante o passo; `npm run check` (formato,
lint com as fronteiras, build, testes) ao fechar o passo; o CI do GitHub roda
o mesmo `check`.

## 6. Processo de cada passo

1. **Proposta curta no chat:** o que entra, que módulos mexe, critério de
   pronto do escopo.
2. Autor aprova.
3. **Comportamento esperado escrito antes** (uma frase por lei/cálculo:
   "subir X faz Y subir em Z turnos").
4. Implementa; `npx tsc -b` e testes do que mudou.
5. **Confere o critério de pronto** com script ou na tela; mostra ao autor.
6. `npm run check`, commit com assunto (`motor: …`, `mundo: …`), RETOMAR
   atualizado. `git push` só com a palavra do autor.

**Pronto** quer dizer: critério do escopo rodando, `check` verde, `.md` do
módulo atualizado, RETOMAR atualizado. Ideia nova no meio do passo vai para
a seção 11 do escopo.

Na terceira tentativa sem fechar um passo, para e revê com o autor.

## 7. Passo de fundação (novo, antes do passo 3)

O projeto recomeçou, mas a casa ainda tem resto do código antigo. Antes de
escrever a primeira lei:

| Item | Pronto quando |
|---|---|
| Esqueleto das pastas (`motor/`, `conteudo/`, `partida/`, `tela/`, `scripts/`) com `index.ts` vazios | `npx tsc -b` passa |
| Fronteiras no lint | import proibido de propósito quebra o lint |
| `package.json` sem os scripts do código antigo | só `dev`, `build`, `test`, `lint`, `format`, `check` |
| `npm run check` verde | roda local e no CI |
| `AGENTS.md` aponta para escopo e plano (hoje cita o `PLANO.md`, que não existe mais) | — |

Se aprovado, entra no escopo como passo 2b.

## 8. Versões

| Versão | Fecha com |
|---|---|
| 0.1 | Fundação + passos 3 e 4: um mandato jogado por script |
| 0.2 | Passos 5 e 6: contas e leis da V1 |
| 0.3 | Passos 7 e 8: grupos e Congresso |
| 0.4 | Passo 9: partida termina em vitória ou derrota |
| 1.0 | Passo 10: partida inteira na tela |

Cada versão vira uma tag no git (`v0.1` …).

## 9. Riscos

| Risco | Como segurar |
|---|---|
| Abrir frente nova no meio de um passo | Seção 11 do escopo; um passo por vez |
| Reescrever o que já funcionava | Peça antiga só volta lida e quando o passo pede |
| Calibrar número cedo demais | Cenários conferem direção; calibrar só no passo 6 |
| Motor amarrado a um país | Lint de fronteira; segundo país de teste no passo 6 |
| Tela puxar regra para dentro | Tela só fala com `partida/` |
