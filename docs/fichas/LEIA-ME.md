# Fichas v1 e v2

> **Status: DESATIVADO.** Não escreva leis neste formato. O formato da versão 1 é
> a ficha v3, descrita em [`v3/README.md`](v3/README.md). Desde a V1-05,
> `scripts/fichas/converter.py` se recusa a rodar quando o catálogo tem ficha v3.

Os arquivos desta pasta continuam aqui só porque os scripts de `scripts/fichas/`
ainda os leem para gerar o conteúdo atual do jogo:

| Arquivo | Lido por |
| --- | --- |
| `areas/`, `areas.json`, `catalogo.json`, `custos.json` | `scripts/fichas/converter.py` e `fichas.py` |
| `ocorrencias/` | `scripts/fichas/ocorrencias.py` |
| `v2/` | `scripts/fichas/v2.py` |
| `LEIS.md` | Gerado por `scripts/fichas/fichas.py documento` |
| `METODO.md` | Ninguém; método antigo, substituído por `docs/v1/conteudo.md` |

No chamado V1-05 o conversor passa a ler a ficha v3 e esta pasta vai para
`docs/desativado/`.
