---
name: sisgov-icones
description: Escolher e trocar os ícones do SisGov (leis, índices, esferas) vindos do game-icons.net. Use ao criar ícone de lei ou índice novo, ou ao trocar um que não lê bem.
---

# Ícones do SisGov

Os ícones de **lei** e de **índice** são do [game-icons.net](https://game-icons.net)
(CC BY 3.0, o jogo precisa dar o crédito), lidos do pacote `@iconify-json/game-icons`
(dependência de desenvolvimento, só alimenta o gerador). As **esferas** continuam
desenhadas à mão em `scripts/icones-leis/esferas.ts` e não se mexe nelas sem o autor.

## Onde está cada coisa

| O quê | Arquivo |
|---|---|
| Leitor do game-icons (`jogo("nome")`) | `scripts/icones-leis/jogo.ts` |
| Composição do selo (lei = ícone + bolinha da esfera) | `scripts/icones-leis/estilo.ts` |
| Índices (id → nome do ícone) | `scripts/icones-leis/indices.ts` |
| Leis (id → nome do ícone), um arquivo por esfera | `scripts/icones-leis/leis/<esfera>.ts` |
| Gerador | `scripts/icones-leis/gerar.ts` |

## Escolher o ícone

1. Procurar pelo nome em inglês: `npm run icones:buscar -- coin tank hospital`
   (mostra todos os nomes que contêm a palavra). Nome inexistente derruba o gerador.
2. Preferir o objeto que o jogador reconhece (hospital, trator, tribunal), não o
   conceito abstrato. Evitar nome com `card-`, `abstract-`, `rune-` e ícones de fantasia
   que o leigo não lê.
3. Leis irmãs (mesma verba dividida em partes) usam ícones parentes, mas distintos.
4. Anotar `"id-da-lei": "nome-do-icone"` no arquivo da esfera.

## Gerar e conferir

```bash
npm run icones [esfera]     # grava os SVGs, os manifests e docs/arte/folha-de-icones.html
npm run icones:faltam <esfera>   # leis ainda sem ícone
npx tsc -b
```

O gerador recusa lei fora da lista, lei na esfera errada e índice sem ícone. Abrir a
folha e olhar a esfera mexida: o ícone tem que ler no tamanho do selo.
