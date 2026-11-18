# Fase 0: inventário e destino dos documentos

14/nov/2026. Para o autor aprovar antes da extração (plano: juntar tudo num
GDD só). Pasta temporária: `docs/jogo/gdd-novo/` some no fim.

Destinos:
- **Fundir**: o conteúdo de design vai para o GDD novo; o arquivo vai para
  `docs/historico/` com um aviso de onde está a versão nova.
- **Manter**: continua onde está; o GDD aponta para ele.
- **Gerado**: sai de um script; continua, não se edita à mão.
- **Histórico**: já está velho; vai para `docs/historico/` sem fundir (o
  agente só olha se há algo que nenhuma fonte nova diz).

## Design do jogo (`docs/jogo/`)

| Documento | Data | O que é | Destino |
|---|---|---|---|
| `gdd.md` | 14/nov | O jogo pronto, 20 seções | **Fundir**: é a base do GDD novo |
| `mecanicas.md` | 14/nov | Mapa das 19 mecânicas, feito/falta/a pensar | **Fundir** ("No motor hoje" e "Em aberto") |
| `o-que-e-uma-lei.md` | 14/nov | Regras das leis (hoje) | **Fundir** (Parte IV, Leis) |
| `planos/leis.md` | 14/nov | Plano da onda 1 das leis e decisões | **Fundir** as decisões; o resto histórico |
| `fase-1-redes.md` | 05–12/nov | Serviços do Estado como "redes" | **Fundir** o que ainda vale (conferir contra `motor/atendimento`) |
| `leis-situacao.md` | 05/nov | "Só lei ligada a uma rede é real" | **Histórico** (a revisão por instituição substitui) |
| `resumo-para-outro-chat.md` | 08/nov | Resumo para leigo | **Histórico** (vira a Parte I do GDD) |
| `interface/area-aberta.md` | 21–22/out | Tela ao abrir uma área | **Histórico** (antes do recomeço de 31/out); o agente da Tela confere |
| `interface/mapa-em-tres-aneis.md` | 30/out | Mapa em três anéis | **Fundir** na Parte IX (Tela) |
| `indices-avaliacao.md` | 14/nov | Registro dos índices avaliados | **Manter** (registro de trabalho; o GDD aponta) |
| `requisitos.md` | 14/nov | R1…R19: o que o jogo precisa e como se constrói | **Manter**; cada R passa a apontar a seção do GDD |
| `plano-de-desenvolvimento.md` | 12/nov | Ordem de construir | **Manter** |
| `arquitetura.md` | 13/nov | Como o código está montado | **Manter** |
| `codigo-a-conferir.md` | 12/nov | Lista de conferência do código | **Manter** |
| `mercado-vic3-referencia.md` | 02/nov | Como o Vic3 faz o mercado | **Manter**, movido para `estudos/` |
| `leis-do-brasil.md`, `leis-inventario.md`, `leis-sentir.md` | 13/nov | Relatórios de script | **Gerado** |
| `estudos/` (3 arquivos) | 22/out–14/nov | Pesquisas | **Manter** (são as referências) |
| `amostras/telas-v2.html` | — | Amostra visual | **Manter** |
| `gdd.xlsx` | 14/nov | Instituições, leis por instituição, degraus, efeitos | **Manter** (o que se constrói) |
| `leis.xlsx` | — | Acervo: leis, índices, pops, grupos, organizações, economia (16 abas), países, programas | **Manter** (acervo); as abas "como funciona" e "estudos" entram como fonte |
| `molde-brasil.xlsx` | — | Molde do Brasil | **Manter** |

## Fora de `docs/jogo/`

| Documento | Data | O que é | Destino |
|---|---|---|---|
| `docs/arquitetura/` (7) | 12/out | Projeto antigo (aponta para `PLANO.md`, que não existe mais) | **Histórico** (`historico/projeto-antigo/`) |
| `docs/RETOMADA.md` | 26/out | Retomada antiga | **Histórico** |
| `docs/README.md` | 12/out | Índice velho dos documentos | **Reescrever** como índice dos documentos novos |
| `docs/superpowers/` (4) | 22–29/out | Planos e especificação antigos | **Histórico** |
| `docs/arte/` (7) | 22/out–12/nov | Direção de arte, estilos, ícones, prompts | **Manter**; a Parte IX aponta para a direção de arte |
| `src/motor/*/*.md` (24) | — | Como cada módulo do motor funciona | **Manter**; fonte de "No motor hoje" |
| `README.md`, `RETOMAR.md`, `CLAUDE.md` | — | Entrada do projeto | **Atualizar** os ponteiros (fase 5) |
| Skills `.claude/skills/` (11) | — | Como trabalhar | **Manter**; as que dizem onde as coisas estão passam a ler o GDD |
| Memórias (45) | 28/out–14/nov | Regras de trabalho e decisões | Decisões de design entram no GDD como fonte; a memória passa a apontar a seção |

## Esqueleto do GDD novo (do plano)

I O jogo · II Gosto (a população) · III Economia · IV Leis · V Estado (lugar
em aberto) · VI Política · VII Mídia · VIII Mundo · IX Tela · X Narrativas e
eventos · Anexos (perguntas em aberto, registro de decisões, glossário,
referências, regras de conteúdo).

Molde de cada mecânica: O que é · O que o jogador faz e sente · Peças ·
Regras decididas (com data) · Ligações · Referências (ou ESTUDAR) · No motor
hoje · Em aberto.

## Lotes da extração (fase 1)

| Agente | Partes | Fontes principais |
|---|---|---|
| 1 | I O jogo + Anexos (regras de conteúdo, glossário) | `gdd.md` §1–4, 19–20; `resumo-para-outro-chat.md`; memórias de visão |
| 2 | II Gosto | `gdd.md` §8, 11; `mecanicas.md` §2–4 e "A base"; `motor/grupos`, `populacao`; abas Pops/Grupos/Organizações; memórias |
| 3 | III Economia | `gdd.md` §10, 16; `mecanicas.md` §5, 8; `motor/mercado`, `calculos`, `contas`, `fisco`, `moradia`; `estudos/`; abas Economia |
| 4 | IV Leis | `gdd.md` §7, 9; `o-que-e-uma-lei.md`; `planos/leis.md`; `mecanicas.md` §6–7; `motor/leis`, `programas`; skill `sisgov-lei-boa`; `fase-1-redes.md` |
| 5 | V Estado + VI Política | `gdd.md` §5, 6, 12, 13; `mecanicas.md` §9–14; `motor/governo`, `judiciario`, `politica`, `eleicao` |
| 6 | VII Mídia + VIII Mundo + X Narrativas | `gdd.md` §14, 15, 18; `mecanicas.md` §15, 16, 19; `motor/midia`, `mundo`, `fatos` |
| 7 | IX Tela | `gdd.md` §17; `mecanicas.md` §17–18; `interface/`; `docs/arte/direcao-de-arte.md` |

A seção 18 do GDD (perguntas em aberto) é lida por todos: cada agente leva
para a sua parte o que é dela.
