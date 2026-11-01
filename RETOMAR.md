# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**01/nov/2026**

## Onde está

Versão 1.0 enviada (`v1.0`). Frente nova, decidida com o autor: **a tela do
jogo é o mapa da tela antiga, reaproveitado** (`src/tela/mapa/`, lendo a
`VisaoPartida` de `src/partida/visao.ts`). Comportamento em
`src/tela/mapa/mapa.md`.
**Fatia 1 feita:** mapa com esferas, leis, bolhas e setas.
**Fatia 2 feita:** clicar numa lei abre a janela do antigo (`DocumentoLei.tsx`):
controle, efeitos diretos do motor (`partida/previa.ts`) e "Enviar ao
Congresso", que põe o pedido na fila do turno (a mesma do Painel).
**Fatia 3 feita:** barra do topo do antigo (`BarraDoTopo.tsx`: caixa, dívida,
apoio com dica) e "Passar o turno" no mapa, que abre o "Resultado do turno"
(`ResultadoDoTurno.tsx`: votações e eleição). O mapa já joga uma partida
inteira sem o Painel.

## Próximo

Decisão do autor: tirar o Painel de tabelas (salvar, carregar e recomeçar
iriam para a barra) ou mantê-lo como tela de conferência. Depois, frente A
(mais leis, revogar lei).

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.
- Mais leis e revogar lei (frente A) esperam o mapa ficar jogável.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `0.6 × 1/3` dá 0,1999… no computador: comparação de limite precisa de folga.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (agora é a referência da tela; ainda sem commit): adicionar arquivo por arquivo.
- Grupos medem renda contra o crescimento esperado (`esperado` em `calcularGrupos`); mexer na tendência do país muda a satisfação de todos.
- A tela só lê/chama `src/partida`; salvar guarda país+semente+estado, as regras voltam do conteúdo.
- Renomear arquivo que o `main.tsx` importa exige `touch src/main.tsx` com o Vite rodando (cache).
- A tag `projeto-antigo-2026-10-31` não tem mais as leis antigas: para ver ou rodar a tela antiga, usar o commit `f62c3fef` (`git show f62c3fef:src/ui/mapa/…`; numa worktree, ligar `node_modules` e abrir direto no jogo trocando o estado inicial de `TelaPrincipal`).
- O `mapa.css` antigo trava a rolagem do `body`: tela que precisa rolar usa contêiner próprio (`.painel-rolagem`); o `main` da tela simples é `main:not(.area-mapa)`.
- `tela.css` só vale dentro de `.painel-rolagem` (a regra `section` global pintava a janela da lei de branco).
- Lei sem valor no país (ex.: áreas protegidas no teste-pobre) vira `naoLegislada`, no mínimo da faixa; `undefined × 100` dava NaN no mapa.
- Para testar muitos turnos no navegador, clicar "Passar o turno" por JavaScript em laço (a eleição do teste-pobre sai no turno 24).
- No navegador do Claude, o primeiro clique numa esfera ou lei às vezes não pega (o hover redesenha o nó): passar o mouse antes de clicar.
- Retratos do antigo são SVG genéricos (ok); fotos e nomes da tela de fundação são de pessoas reais e não entram.
