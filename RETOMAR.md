# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**01/nov/2026**

## Onde está

**Passo 7 (População e grupos) fechado em 01/nov.** 6 pops com renda pelo
motor (`npm run pops`); 4 grupos (trabalhadores, classe média, empresários,
ambientalistas) com satisfação, radicais e lealistas (`npm run grupos`).
Cada lei declara no JSON o que cada grupo quer dela. Versão 0.3 fecha com o
passo 8.

## Próximo

**Passo 8, Congresso:** proposta curta (o que entra, o que fica de fora, uma
decisão) para o autor aprovar.

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (não mexer): adicionar arquivo por arquivo.
