# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**02/nov/2026**

## Onde está

Passo 11 (mundo) em andamento; comportamento esperado em
`src/motor/mundo/mundo.md`. Pedaços 1 a 4 feitos: potências, opinião (curva),
reputação e **segurança externa** = poder defensivo − (100 − reputação), sem
corte (autor aprovou; só pesa de verdade com leis nas pontas da bússola).
Índices novos: `poder_defensivo`, `seguranca_externa`, `lotacao_presidios`
(maior é pior); `seguranca` mostra "Segurança pública". Leis contínuas aceitam
`unidade: "meses" | "anos"` (usadas pelo serviço militar e pela idade do voluntário).

## Próximo

Pedaço 5 feito (`npm run mundo`: a lei move cada opinião, a média e a
segurança). Depois pedaço 6 (mapa mostra as potências). Leis de segurança, **bloco A (Exército) feito**: `gasto-militar` (0–4% do
PIB), `servico-militar` (0–18 meses) e `idade-voluntario` (16–21 anos), com
efeito pesquisado (custo do serviço em padrão de vida; NBER, OCDE, GAO).
Falta o autor: discutir como isso funciona na economia (ele pediu), e aprovar
os próximos blocos, um por vez: B proteção digital (UMA lei de 3 opções),
C câmeras (2 leis), D maioridade penal, E contrapeso. Nenhum arquivo de lei
antes do okay. Falta dizer quais eixos novos entram na bússola.

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.
- Commits locais sem push (push só com a palavra do autor).
- Proteção de dados: confirmar a lei única de 3 opções.

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
