# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**01/nov/2026**

## Onde está

Passo 5 (Contas) fechado e no GitHub. **Passo 6 (Leis da V1)**: 6a, 6b,
6c-0, 6c e 6d feitos; `npm run check` verde.

- 14 leis (impostos, gasto, pena de morte, 6 ambientais); o país declara só
  as leis que tem.
- 6d: força dos efeitos 2/5/10 pontos (era 1/3/6); segundo país
  `teste-pobre` só em JSON; `npm run paises` joga os dois.

## Próximo

Autor confere `npm run paises` e aprova **fechar o passo 6** (plano e escopo
com ✅, tag v0.2). Depois, abrir o passo 7 (Grupos) com proposta curta.

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
