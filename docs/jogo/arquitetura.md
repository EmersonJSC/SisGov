# Arquitetura

Mapa do jogo em uma página. Detalhe de cada módulo fica no `.md` dele.
`docs/arquitetura/` é do projeto antigo.

## 1. Camadas

```
conteudo  →  motor  →  partida  →  tela
(o mundo)   (regras)   (ponte)    (o que se vê)
```

| Camada     | Onde             | O que tem                                                          | Pode ver                  |
| ---------- | ---------------- | ------------------------------------------------------------------ | ------------------------- |
| Conteúdo   | `src/conteudo/`  | `mundo/` (leis, índices, pops, grupos, mercado, potências) e `paises/` (só o estado inicial) | nada: é JSON              |
| Motor      | `src/motor/`     | as regras; funções puras; **não conhece nomes** de lei, país ou partido | só a si mesmo             |
| Partida    | `src/partida/`   | monta as regras a partir do conteúdo, salva, carrega, prepara a visão | conteúdo e motor          |
| Tela       | `src/tela/`      | mapa, bolhas, mercado, pregão                                      | **só** `src/partida`      |

## 2. O turno

Turno = 2 meses. `avancarTurno(regras, estado, pedidos) → novo estado`; o
anterior não muda. Mesma semente e mesmos pedidos, mesma partida.

Ordem (`ETAPAS` em `src/motor/turno/index.ts`):

1. Congresso vota os pedidos
2. Leis novas mudam de valor; efeitos entram na fila
3. Efeitos andam um turno
4. Economia real (crescimento)
5. Preços e juros
6. Capacidades (mercado, construções)
7. Contas (cofre e dívida)
8. Índices de jogabilidade
9. Mundo (potências)
10. Preços do mundo
11. Pops e grupos
12. Política (coligação, eleição)
13. Invariantes

## 3. As peças do jogo

| Peça          | O que é                                                                 | Onde                                   |
| ------------- | ----------------------------------------------------------------------- | -------------------------------------- |
| **Índice**    | número que o jogador vê (0–100 ou %). Tipo `estoque`, `derivado` ou `calculado` | `mundo/indicadores/variaveis.json`     |
| **Lei**       | bolha no mapa. Um lado da bússola, de "nada" a "mais". Mexe só em índices | `mundo/leis/*.json`, `motor/leis`      |
| **Processo**  | estoque que anda sozinho pelos turnos, empurrado pelas leis em vigor. Sem meta nem ritmo. *(ainda sem código)* | —                                      |
| **Colisão**   | duas leis que não valem juntas (ex.: teto de aluguel × aluguel livre). Fora isso, toda combinação vale. *(ainda sem código)* | —                                      |
| **Área**      | tema que junta leis no mapa (ex.: "Terra e moradia"). Toda lei tem uma | `mundo/areas/areas.json`               |
| **Órgão**     | quem executa uma regra. A verba (lei contínua, % do PIB) dá a força; verba demais vira corrupção. O jogador nunca escolhe a fazenda ou a fábrica. *(ainda sem código)* | —                                      |
| **Destino**   | o que vira o bem que o Estado toma (comunidade, Estado, famílias). Uma lei por destino. *(a decidir, GDD §18)* | —                                      |
| **Pop**       | fatia da população: profissão num estrato                               | `mundo/pops`, `motor/populacao`        |
| **Grupo**     | junta pops; gosta ou não de uma lei pela distância na bússola           | `mundo/grupos`, `motor/grupos`         |

**Bússola:** `economico` (esquerda − ↔ direita +) e `social`
(verde/libertário − ↔ tradicional/autoritário +), de −1 a +1.

**Build:** o jogador combina leis de lados diferentes como quiser. O
extremo da bússola é um caminho: cada lei anda um pouco nele.

## 4. Módulos do motor

| Módulo                                         | Uma linha                                        |
| ---------------------------------------------- | ------------------------------------------------ |
| [acaso](../../src/motor/acaso/acaso.md)        | sorteio com semente                              |
| [calculos](../../src/motor/calculos/calculos.md) | bases de cálculo (renda, consumo, lucro, emissões, terra; Laffer) |
| [contas](../../src/motor/contas/contas.md)     | Tesouro: receita, gasto, juros, cofre, dívida    |
| [efeitos](../../src/motor/efeitos/efeitos.md)  | leis contribuem pontos para os índices, com atraso |
| [eleicao](../../src/motor/eleicao/eleicao.md)  | mandato, desgaste, apuração                      |
| [grupos](../../src/motor/grupos/grupos.md)     | satisfação e apoio pela bússola                  |
| [leis](../../src/motor/leis/leis.md)           | formato e validador da lei                       |
| [mercado](../../src/motor/mercado/mercado.md)  | setores, produtos, preço, emprego, construções   |
| [mundo](../../src/motor/mundo/mundo.md)        | potências e opinião sobre o país                 |
| [politica](../../src/motor/politica/politica.md) | Congresso e coligação                          |
| [populacao](../../src/motor/populacao/populacao.md) | pops: renda, estrato, setor                 |
| [turno](../../src/motor/turno/turno.md)        | a ordem das etapas                               |

Partida: [salvar](../../src/partida/salvar.md). Tela: [mapa](../../src/tela/mapa/mapa.md).

## 5. Regras fixas

- O motor não conhece nomes. Leis e índices são do mundo; o país declara
  só o estado inicial.
- Lei só mexe em índice de `variaveis.json`. Índice novo é pedido ao autor.
- Todo efeito declara atraso em turnos e força (`fraca`, `media`, `forte`).
- Lei é descrita pela bússola, nunca por grupo, e não cita país real.
- Toda decisão é uma bolha no mapa; nada de painel de gestão.
- Módulos funcionam sozinhos; as ligações vêm no JSON das leis.
