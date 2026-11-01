# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**31/out/2026**

## Onde está

Passos 2b, 3 e **4 fechados: versão 0.1** (um mandato jogado por script).

- `src/motor/turno`: `avancarTurno(regras, estado, pedidos)`, 10 etapas;
  as vazias pulam (`turno.md` diz o que cada uma faz hoje).
- `src/motor/efeitos`: força fraca/média/forte = 1/3/6 pontos, **tamanho
  inteiro** do efeito, que chega em linha reta ao longo do atraso.
- `src/motor/acaso`: semente no estado; mesma semente, mesma partida.
- `src/conteudo/paises/teste/`: país inventado (pico 0,5).
- `npm run mandato`: IR 10/30/50% → arrecadação sobe, padrão de vida cai.

## Próximo

Autor decide a **tag `v0.1`**. Depois, **passo 5, Contas**: proposta curta
(receita − gasto − juros → dívida; juros sobem com a dívida).

## Pendências do autor

- Tag `v0.1` e push (nada enviado ainda).
- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (não mexer): adicionar arquivo por arquivo.
