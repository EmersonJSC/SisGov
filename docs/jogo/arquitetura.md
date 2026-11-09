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
8. Índices de jogabilidade (a deriva anda antes)
9. Mundo (potências)
10. Preços do mundo
11. Pops e grupos
12. Política (coligação, eleição)
13. Invariantes

## 3. As peças do jogo

| Peça          | O que é                                                                 | Onde                                   |
| ------------- | ----------------------------------------------------------------------- | -------------------------------------- |
| **Índice**    | número que o jogador vê (0–100 ou %). Tipo `estoque`, `derivado` ou `calculado` | `mundo/indicadores/variaveis.json`     |
| **Lei**       | bolha no mapa. Um lado da bússola, de "nada" a "mais". Age por um processo ou uma rede, não direto no índice (seção 5) | `mundo/leis/*.json`, `motor/leis`      |
| **Processo**  | índice que anda sozinho pelos turnos (**deriva**): outro índice empurra a base, medindo contra o turno 0. Sem meta nem ritmo | `mundo/indicadores/derivas.json`, `motor/deriva` |
| **Colisão**   | duas leis que não valem juntas (ex.: teto de aluguel × aluguel livre). Fora isso, toda combinação vale. Pares em `mundo/colisoes/colisoes.json`; é um "ou": o jogador põe uma ou outra, nunca as duas. Para trocar, revoga uma e propõe a outra no turno seguinte (`motor/leis/colisao.ts`). | —                                      |
| **Área**      | tema que junta leis no mapa (ex.: "Terra e moradia"). Toda lei tem uma. A esfera (`docs/jogo/leis.xlsx`) é a peça menor; ministério é um conjunto de esferas | `mundo/areas/areas.json`               |
| **Órgão**     | quem executa uma regra. A verba (lei contínua, % do PIB) dá a força; verba demais vira corrupção. O jogador nunca escolhe a fazenda ou a fábrica. *(ainda sem código)* | —                                      |
| **Destino**   | o que vira o bem que o Estado toma (comunidade, Estado, famílias). Uma lei por destino. *(a decidir, GDD §18)* | —                                      |
| **Pop**       | fatia da população: profissão num estrato                               | `mundo/pops`, `motor/populacao`        |
| **Grupo**     | interesse organizado que atravessa os pops; gosta ou não de uma lei pela distância na bússola           | `mundo/grupos`, `motor/grupos`         |
| **Organização** | nasce na partida, com nome, líder e ação própria: política, de radicais de vários grupos; ou crime, do lucro ilegal *(a construir)* | `docs/jogo/leis.xlsx` |

**Bússola:** `economico` (esquerda − ↔ direita +) e `social`
(verde/libertário − ↔ tradicional/autoritário +), de −1 a +1.

**Build:** o jogador combina leis de lados diferentes como quiser. O
extremo da bússola é um caminho: cada lei anda um pouco nele.

## 4. Módulos do motor

| Módulo                                         | Uma linha                                        |
| ---------------------------------------------- | ------------------------------------------------ |
| [acaso](../../src/motor/acaso/acaso.md)        | sorteio com semente                              |
| [atendimento](../../src/motor/atendimento/atendimento.md) | rede da saúde: vagas, profissionais, planos, fila |
| [calculos](../../src/motor/calculos/calculos.md) | bases de cálculo (renda, consumo, lucro, emissões, terra; Laffer) |
| [contas](../../src/motor/contas/contas.md)     | Tesouro: receita, gasto, juros, cofre, dívida    |
| [deriva](../../src/motor/deriva/deriva.md)     | índice anda sozinho, empurrado por outro         |
| [moradia](../../src/motor/moradia/moradia.md)  | estoque de casas: déficit e favela saem da conta |
| [efeitos](../../src/motor/efeitos/efeitos.md)  | leis contribuem pontos para os índices, com atraso |
| [eleicao](../../src/motor/eleicao/eleicao.md)  | mandato, desgaste, apuração                      |
| [grupos](../../src/motor/grupos/grupos.md)     | satisfação e apoio pela bússola                  |
| [leis](../../src/motor/leis/leis.md)           | formato e validador da lei                       |
| [mercado](../../src/motor/mercado/mercado.md)  | setores, produtos, preço, emprego, construções   |
| [mundo](../../src/motor/mundo/mundo.md)        | potências e opinião sobre o país                 |
| [politica](../../src/motor/politica/politica.md) | Congresso e coligação                          |
| [populacao](../../src/motor/populacao/populacao.md) | pops: renda, estrato, setor                 |
| [saneamento](../../src/motor/saneamento/saneamento.md) | rede de água e esgoto: ligações, conta, concessão |
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

## 6. Regras da lei

Decididas pelo autor. Antes de toda lei, quatro perguntas: quanto? partes ou todo?
processo ou lei? um presidente real assinaria e pronto?

- A lei vai de "nada" a "mais" em um lado da bússola, aos poucos, sem cruzar. Exceção
  pedida pelo autor: as escadas de liberação dos vícios.
- Tema grande vira várias leis, em vários lados, para o jogador montar país misto.
- Leis que se chocam são um "ou"; nenhuma lei manda em outra.
- Lei não move índice direto: age por um processo ou uma rede.
- Nenhuma lei é só ganho ou só perda.
- Lei não traz condição escrita: a mesma lei muda de sentido pelo estado do país.
- Lei dá verba ao órgão; verba demais vira corrupção. O jogador nunca escolhe a fazenda
  ou a fábrica.
- Antes de pedir decisão, listar as leis: o que fazem e como funcionam.

## 7. Regras da rede

Uma rede é um serviço que o Estado presta. Hoje são duas: atendimento e saneamento. O
desenho para as outras está em [fase-1-redes.md](fase-1-redes.md), à espera do autor.

- O índice sai da contagem de quem é atendido; lei nenhuma mexe nele direto.
- Capacidade leva tempo e custa; sem verba, se desgasta.
- A renda das pessoas diz quem consegue pagar.
- O país começa parado: no turno 0, nada anda sozinho.
- Toda lei da rede tem ganho e custo, e o jogador vê o efeito na ficha e no mapa.
