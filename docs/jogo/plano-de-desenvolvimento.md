# Plano de desenvolvimento

> **Status: APROVADO em 31/out/2026.** O [escopo](escopo.md) diz **o quê**;
> este plano diz **como e em que ordem**. Em conflito, vale o escopo. Os
> números dos passos são os mesmos do escopo.

## 1. Onde estamos e por onde começar

- **Feito:** passo 1 (escopo), 2 (índices), 2b (fundação), 3 (modelo de lei),
  4 (turno mínimo; versão 0.1) e 5 (contas).
- **Próximo:** passo **6, Leis da V1**.
- **Depois, em ordem:** 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10. Um passo por vez;
  o próximo só abre quando o anterior está pronto.

## 2. Regra de expansão

Cada passo **começa pequeno** e deixa a porta aberta. Expandir é **somar**,
nunca reescrever:

- cálculo novo = uma entrada nova no registro de cálculos;
- lei nova = um JSON novo;
- regime novo = uma estrutura nova de Congresso, mesmo motor;
- índice, pop ou grupo novo = dado no JSON.

Se uma expansão exigir mexer no que já está pronto, o desenho do passo
estava errado: para e revê com o autor. As expansões listadas abaixo são
**opções**, não compromisso; ficam fora da V1 até o autor escolher.

## 3. Roteiro

### Passo 2b — Fundação ✅

Arrumar a casa antes da primeira lei.

| Começa com | Pronto quando |
|---|---|
| Esqueleto das pastas `motor/`, `conteudo/`, `partida/`, `tela/`, `scripts/`, com `index.ts` vazios | `npx tsc -b` passa |
| Fronteiras entre camadas no lint (seção 4) | um import proibido de propósito quebra o lint |
| `package.json` só com `dev`, `build`, `test`, `lint`, `format`, `check` | scripts antigos fora |
| `AGENTS.md` apontando para escopo e plano | — |
| `npm run check` verde | local e no CI |

**Expande depois:** nada; fundação não cresce, só se mantém.

### Passo 3 — Modelo de lei ✅

| Começa com | Pronto quando |
|---|---|
| `motor/estado`: tipos dos índices essenciais | — |
| `motor/calculos`: registro de bases com **uma** base, `renda` (Laffer + evasão), fonte citada | teste de unidade do cálculo |
| Formato da lei: imposto de renda (contínua) e pena de morte (opções) | autor aprova os dois JSON (31/out; pico de Laffer declarado por país) |
| Validador do JSON | lei inválida falha com arquivo, campo e motivo |

**Expande depois:** bases `consumo`, `folha`, `lucro`; lei contínua com
faixas (imposto progressivo); efeito condicional ("só se desemprego > X").

### Passo 4 — Turno mínimo ✅

| Começa com | Pronto quando |
|---|---|
| `motor/turno` com a ordem da seção 5 (etapas ainda vazias pulam) | — |
| `motor/efeitos`: fila com atraso por efeito | — |
| `motor/acaso`: semente fixa | mesma semente, mesma partida |
| `partida/`: criar partida (mundo + país de teste) e avançar turno | — |
| `scripts/mandato.ts` | joga 24 turnos; a lei em três valores dá três países diferentes, na direção prometida |

**Expande depois:** histórico completo para gráficos; desfazer turno;
vários países de teste.

### Passo 5 — Contas ✅

| Começa com | Pronto quando |
|---|---|
| `motor/contas`: receita, gasto, juros, cofre e dívida separados; sobra vai ao cofre, falta sai do cofre e depois vira dívida | invariante "contabilidade fecha" roda todo turno |
| Juros sobem com a dívida (cálculo estudado no registro) | dívida alta sobe juros no script |

**Expande depois:** emissão de moeda e inflação; banco central
independente ou não (lei essencial); dívida externa e câmbio.

### Passo 6 — Leis da V1 ⬅ próximo

| Começa com | Pronto quando |
|---|---|
| Poucas leis (lista aprovada pelo autor antes), só JSON; cada imposto tira a sua parte de `receita_fora_das_leis` | cada lei tem o comportamento esperado escrito antes e conferido por script |
| Segundo país de teste | o motor roda os dois sem código de país |
| Calibração de ordem de grandeza | números plausíveis nos dois países |

**Expande depois:** mais leis, sempre por JSON.

### Passo 7 — População e grupos

| Começa com | Pronto quando |
|---|---|
| `motor/populacao`: poucos pops (profissão × estrato), tamanho em pessoas, renda pelo motor | — |
| Poucos grupos que leem os pops; satisfação, radicais, lealistas | leis e índices movem os grupos no script |

**Expande depois:** até ~25 pops; migração entre pops (desemprego empurra
para baixo); grupos novos por JSON.

### Passo 8 — Congresso

| Começa com | Pronto quando |
|---|---|
| `motor/politica`: presidencialismo (uma estrutura de votação) | lei só muda com voto |
| Exorbitante barrado | proposta absurda cai no script |
| Base e oposição reagem às leis | — |

**Expande depois:** parlamentarismo (V1, segundo regime); veto e
derrubada de veto; bicameral; partido único (outra versão ou DLC).

### Passo 9 — Eleição e desgaste

| Começa com | Pronto quando |
|---|---|
| Desgaste fixo por período; eleição a cada 6N turnos pelo apoio pesado por tamanho | mandato termina em vitória ou derrota que o jogador entende |

**Expande depois:** perder o poder fora da eleição (impeachment, voto de
desconfiança); percepção do déficit pelo eleitor (escopo, seção 11).

### Passo 10 — Tela

| Começa com | Pronto quando |
|---|---|
| Tela simples: índices, leis, propor lei, passar turno, resultado da eleição | jogar uma partida inteira na tela |
| Salvar e carregar em `partida/` | partida salva volta igual |

**Expande depois:** tela elaborada, gráficos, mapa, arte.

## 4. Camadas

A dependência só desce:

```
tela/      React. Mostra e envia pedidos. Não calcula.
  ↓
partida/   Monta a partida (mundo + país), chama o motor, salva e carrega.
  ↓              ↘
motor/     Regras e cálculos.        conteudo/  JSON do mundo e dos países.
           TS puro, sem React/JSON.
```

| Camada | Pode importar | Não pode |
|---|---|---|
| `motor/` | só `motor/` | `conteudo/`, `partida/`, `tela/`, React |
| `conteudo/` | é dado | código de regra |
| `partida/` | `motor/`, `conteudo/` | `tela/` |
| `tela/` | `partida/`, tipos do `motor/` | `conteudo/` direto |

Cada módulo do motor é uma pasta com `index.ts` (o que expõe) e um `.md`
curto (o que faz, fonte do cálculo). O motor não conhece nomes de leis,
partidos ou países.

## 5. Ordem do turno

`avancarTurno(estado, pedidos, acaso) → novoEstado`, sem alterar o anterior.

1. Pedidos passam pelo Congresso (a partir do passo 8).
2. Leis novas geram efeitos na fila.
3. Efeitos que vencem são aplicados.
4. Economia real: emprego, PIB.
5. Preços e juros.
6. Contas.
7. Índices de jogabilidade.
8. Pops e grupos.
9. Política: desgaste; eleição no fim do mandato.
10. Invariantes; falhou, para com erro.

## 6. Dados

```
src/conteudo/
  mundo/indicadores/variaveis.json
  mundo/leis/<id>.json
  mundo/pops/, mundo/grupos/          (passo 7)
  paises/<id>/estado-inicial.json
  paises/<id>/leis-vigentes.json
  paises/<id>/rotulos.json            ("juros" → "Selic")
```

Todo JSON tem `"versao"`, tipo no motor e validador ao carregar. Unidades
explícitas: dinheiro na moeda do país, população em pessoas, alíquota como
fração (0,275; a tela mostra 27,5%).

## 7. Qualidade

**Invariantes, todo turno:** contabilidade fecha; nada negativo que não
possa ser; ocupados ≤ população; lei dentro da própria faixa ou opções.

| Teste | O quê | Desde |
|---|---|---|
| Unidade | cada cálculo do registro | passo 3 |
| Contrato | todo JSON passa no validador | passo 3 |
| Cenário | script com semente fixa confere a **direção**, não o número | passo 4 |
| Tela | conferência no navegador | passo 10 |

Mecânica instável não ganha teste de número.

## 8. Como cada passo anda

1. Proposta curta no chat; autor aprova.
2. Comportamento esperado escrito antes.
3. Implementa; `npx tsc -b` e testes do que mudou.
4. Confere o "pronto quando" por script ou na tela; mostra ao autor.
5. `npm run check`, commit com assunto, RETOMAR atualizado. Push só com a
   palavra do autor.

Ideia nova no meio do passo vai para a seção 11 do escopo. Terceira
tentativa sem fechar: para e revê com o autor.

## 9. Versões

| Versão | Fecha com |
|---|---|
| 0.1 | 2b, 3, 4: um mandato jogado por script |
| 0.2 | 5, 6: contas e leis da V1 |
| 0.3 | 7, 8: grupos e Congresso |
| 0.4 | 9: vitória ou derrota |
| 1.0 | 10: partida inteira na tela |

Tag no git ao fechar cada versão.
