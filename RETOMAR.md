# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**01/nov/2026**

## Onde está

Versão 0.1 com tag e no GitHub. **Passo 5 (Contas) fechado.**

- `src/motor/contas`: receita, gasto, juros, cofre e dívida separados;
  sobra vai ao cofre, falta sai do cofre e depois vira dívida; invariante
  "contabilidade fecha" todo turno.
- `src/motor/calculos/juros.ts`: alvo = neutro + inflação + prêmio acima da
  tolerância de dívida do país; a taxa anda 20% do caminho por turno.
- País declara `receita_fora_das_leis` (teste: 25% do PIB), o imposto que
  ainda não virou lei.
- Inflação ainda fixa, mas já sobe preços e PIB nominal.
- `npm run contas` mostra tudo; calote, inflação que se move e regra fiscal
  foram para a seção 11 do escopo.

## Próximo

**Passo 6, Leis da V1**: propor ao autor a lista curta de leis (só JSON);
cada imposto tira a sua parte de `receita_fora_das_leis`.

## Pendências do autor

- Push do passo 5 (commit local).
- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (não mexer): adicionar arquivo por arquivo.
