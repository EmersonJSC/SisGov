# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**01/nov/2026**

## Onde está

Passo 5 (Contas) fechado e no GitHub. **Passo 6 (Leis da V1) aberto**, lista
aprovada, nada implementado ainda.

- Lista aprovada (10 leis): impostos de renda, consumo e empresas; gasto em
  saúde, educação, polícia e transferência de renda; pena de morte, proteção
  ambiental e liberdade de imprensa.
- Gasto também é lei (contínua, % do PIB); o resto fica em
  `gasto_fora_das_leis` do país, como a receita.
- Nenhuma lei se descreve por país real: a régua é o próprio país da partida
  (skill `sisgov-lei`).
- Progressividade do IR e saúde/educação pública × privada foram para a
  seção 11 do escopo: dependem dos pops (passo 7).

## Próximo

**6a: gasto vira lei** (proposta curta ao autor antes de codar). Depois 6b
(bases consumo e lucro), 6c (leis de opções), 6d (segundo país de teste e
calibração). Tag v0.2 ao fechar o passo 6.

## Pendências do autor

- Push dos commits de docs das leis (locais).
- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (não mexer): adicionar arquivo por arquivo.
