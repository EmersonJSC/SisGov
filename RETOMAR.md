# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**01/nov/2026**

## Onde está

O mapa é a única tela do jogo (`src/tela/mapa/mapa.md`). A bússola política
está feita (`src/motor/grupos/grupos.md`). A ordem nova está no plano
(`docs/jogo/plano-de-desenvolvimento.md`, passos 11 a 13): **mundo**, depois
**mercado** (produtos do mundo em setores, um mercado só, preço fixo no
começo), depois **leis em pacotes** (lista na seção 11 do escopo).

## Próximo

Passo 11, mundo: o "Começa com" está escrito no plano como proposta. Espera o
sim do autor e a decisão sobre o índice "reputação internacional".

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.
- Commits locais sem push (push só com a palavra do autor).
## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `0.6 × 1/3` dá 0,1999… no computador: comparação de limite precisa de folga.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (agora é a referência da tela; ainda sem commit): adicionar arquivo por arquivo.
- Grupo de centro (perto da posição atual da lei) perde nos dois sentidos: é a bússola, não erro.
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
