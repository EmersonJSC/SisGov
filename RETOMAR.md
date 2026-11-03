# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**03/nov/2026**

## Onde está

Mercado, pilar 1 (construções) fechado e commitado (1a, 1b, 1c). O autor mudou
de frente: agora é o **Partido** (começo da partida). Pilares 2 e 3 da 12b
(empresas, bolsa) ficam fora por enquanto.

**Decidido com o autor (03/nov) e escrito no GDD (§3 princípio 4, §4 Começo,
nova "A rede da pessoa", §5) e nos requisitos (R4.5–R4.10, R5.1, R6.11–R6.12):**
- O jogo é um teste: nunca fala de lado político, só de consequência; o
  jogador não escolhe lado. O lado sai da **chapa**.
- Início: país → cria partido (**só nome e sigla**) → chapa (presidente do
  partido, candidato, vice), cada vaga abre lista de pessoas de **todos** os
  partidos (aí nasce a coligação) → clicar na pessoa abre o **perfil de rede
  social** (posts, fotos, curtidas, lugares; sem rótulo de lado) → ministério
  (sorteado pela ideologia da chapa, ou escolhido) → iniciar.
- Hoje no código: `congresso.json` fixa `governo`/`coligacao`; a tela inicial
  só pede país e semente; não há fichas de pessoas.

## Próximo

Proposta curta no chat da **fatia 1 do Partido** com a tela nova: nome+sigla,
chapa com lista de pessoas e perfil. Decisão do autor: o que vem primeiro, a
ficha da pessoa (gerador + bússola) ou a tela de início. Sem código antes do sim.
`npm run check` ao fechar a mecânica; depois marcar R16.7–R16.10 como ✅.

## Pendências do autor

- Jogar o Pregão (botão "Bolsa").
- Commits locais sem push (55eb0ff2, 5adddb3c, 46799fda, f8b8a705, 0d121456) (push só com a palavra do autor).
- Proteção de dados: lei única de 3 opções foi criada sem confirmação explícita; ver se serve.
- Antes de publicar o jogo: checar com advogado.
- Eixos novos da bússola (talvez 3, GDD seção 18); outro chat trata da economia militar.
- Equilibrar com "Brasil" e "EUA" só no fim (regra de país real).

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
- Freio do juro nas obras mede contra o juro de equilíbrio do turno 0 (`taxaAlvo`), não o declarado: o teste-pobre declara 10 e anda a 13.
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
