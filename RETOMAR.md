# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**02/nov/2026**

## Onde está

**Passo 11 (mundo) fechado** em 02/nov: `npm run check` verde (107 testes),
plano e escopo com ✅. Fez: 5 potências (sem nome real) com opinião pela
bússola, reputação = média pesada, poder defensivo, segurança externa =
poder defensivo − (100 − reputação), leis de segurança (blocos A a E),
losangos no mapa e chips "Reputação" e "Seg. externa" na barra do topo.
Comportamento: `src/motor/mundo/mundo.md` e `src/tela/mapa/mapa.md` (fatia 5).
Sem tag (o passo 11 não fecha versão).

**Controle das leis em % (02/nov, depois do passo 11):** as 14 leis em % vão
de 0 a 100% (o Congresso é quem barra: mais de 1/3 da faixa cai). A bússola
continua calibrada pelo máximo antigo (`bussola.ate` na lei). O slider é
novo: régua em %, pino com o valor, marca do valor em vigor, zonas (imposto:
amarelo perto do pico da receita e vermelho depois; verba: vermelho acima do
ponto em que o gasto passa da receita) e sem caixa de número. Comportamento em
`src/tela/mapa/mapa.md` (fatia 6).

## Próximo

O autor abriu **outro chat** para tratar da **economia das leis militares**
(como verba, serviço e idade do voluntário entram nas contas). Também em
aberto, decisão do autor: quais **eixos novos** entram na bússola (paz ×
militarismo está no escopo, seção 11; "depois de tudo pronto"). Depois:
**passo 12 Mercado** (proposta curta no chat, esperar o sim). Ideia do autor,
fora do passo: **empresas** em volta, perto do anel das potências.

## Pendências do autor

- Commits locais sem push (push só com a palavra do autor).
- Proteção de dados: lei única de 3 opções (sem regra / permissão prévia / permissão e apagar) foi criada sem confirmação explícita; ver se serve.

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
