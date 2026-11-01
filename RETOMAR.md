# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**01/nov/2026**

## Onde está

**Passo 8 (Congresso) fechado em 01/nov; versão 0.3 completa (passos 7 e 8),
tag `v0.3` publicada.**
Partidos são do país (`paises/<id>/congresso.json`): cadeiras, grupos que
defendem, governo e coligação. Toda mudança de lei vai a voto; mais de 1/3
da faixa num pedido é exorbitante e cai (`npm run congresso`). Scripts de
economia usam `criarPartida(pais, semente, { semCongresso: true })`.

## Próximo

**Passo 9, Eleição e desgaste:** proposta curta para o autor aprovar.

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `0.6 × 1/3` dá 0,1999… no computador: comparação de limite precisa de folga.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (não mexer): adicionar arquivo por arquivo.
