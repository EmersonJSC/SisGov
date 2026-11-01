# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**01/nov/2026**

## Onde está

**Passo 9 (Eleição e desgaste) fechado em 01/nov; versão 0.4 completa, tag
`v0.4` criada (sem push).**
Desgaste de 2,25 por mandato; a lei `duracao-mandato` (4 ou 5 anos, campo
`mandato_anos` nas opções) define o mandato; no fim dele o apoio (satisfação
pesada por pessoas − desgaste) decide, e perder encerra a partida
(`npm run eleicao`). Os grupos agora medem a renda contra o crescimento
esperado do país: parado, o governo perde por pouco; a transferência de
renda vence.

## Próximo

**Passo 10, Tela:** proposta curta para o autor aprovar. O push do
commit e da tag `v0.4` espera a palavra do autor.

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
- Grupos medem renda contra o crescimento esperado (`esperado` em `calcularGrupos`); mexer na tendência do país muda a satisfação de todos.
