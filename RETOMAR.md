# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**01/nov/2026**

## Onde está

Passo 5 (Contas) fechado e no GitHub. **Passo 6 (Leis da V1) aberto**: 6a,
6b, 6c-0 e 6c feitos.

- Lista do passo 6 (14 leis): impostos de renda, consumo e empresas; gasto em
  saúde, educação, polícia e transferência de renda; pena de morte; e 6
  ambientais: polícia ambiental, licenciamento, áreas protegidas, terras
  indígenas, imposto sobre poluição (base `emissoes`) e saneamento.
- Regra nova: nenhuma lei é um controle só que faz coisas grandes; tema se
  divide em leis (escopo, seção 5).
- Imprensa saiu do passo 6: vem com as grandes mídias do país (seção 11).
- 6c-0: o país declara só as leis que tem; a que falta fica não legislada e
  pode ser proposta (o país de teste não tem imposto sobre poluição).

## Próximo

**Proposta do 6d** (segundo país e calibração; efeitos ainda pequenos:
`npm run impostos`, `npm run gasto`, `npm run ambiente`). Antes do
`npm run check` de fechamento: consertar o lint de
`src/motor/leis/validar.test.ts:27` (`_` sem uso, já estava assim). Tag v0.2
ao fechar o passo 6.

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
