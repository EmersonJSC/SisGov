# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**03/nov/2026**

## Onde está

Frente atual: **pops e grupos** (o autor pediu fechar antes do Partido, porque
a chapa e o perfil de rede dependem deles). Feito em 03/nov: os **25 pops**
(8 pobres, 11 médios, 6 ricos) em `mundo/pops/pops.json`, cada um com bússola;
parcelas dos dois países refeitas somando o mesmo que os 6 antigos; grupos
reapontados; aparecem na tela do Mercado. Testes e `tsc -b` verdes.
Efeito visível: "sem emprego formal" subiu (35→38% no teste-pobre) por causa de
estudantes e aposentados, que não têm setor.

**16 grupos** no lugar dos 4 (`mundo/grupos/grupos.json`); os 25 pops têm casa;
os partidos dos países (`congresso.json`) defendem os novos ids; testes e `tsc -b`
verdes; aparecem no mapa.

O Partido (GDD §4, R4.5–R4.10, R6.11–R6.12) está escrito e commitado, sem código.

**R8.5 (vida) feito**: cada pop desliza na bússola (renda + satisfação), a do
grupo anda junto; interno, o jogador sente só apoio e votos. Falta a mídia.
Em 12 turnos parados o deslize é pequeno (~0,005); não equilibrado.

**R11.6 feito**: gente sobe e desce de estrato com a renda real e a instrução
(`Estado.migracao`, escadas `sobe`/`desce` em `pops.json`). Em 24 turnos
parados mexe ~1% e quase tudo é descida; não equilibrado. A tela ainda não mostra
"quem subiu" direto: só aparece nos grupos e no emprego.

**R11.5 feito**: pop estuda e muda para o setor que paga mais (`Estado.setores`,
`treina` em `pops.json`, velocidade pela instrução). Universidade NÃO é
construção (decisão do autor): é só o índice. Em 24 turnos tecnologia sobe
~50% de empregos no `teste`; não equilibrado.

## Próximo

Pops e grupos **fechados sem a mídia** (03/nov, check verde, 229 testes).
R8.5/R11.4 ◐ "falta mídia"; R16.7–R16.10 são das construções: não marcar.
Partido adiado pelo autor ("precisamos de algumas coisas antes").

**Frente atual: moradia (leis ↔ índices, por área).** Hoje moradia é produto
comerciável do mercado (`produtos.json`, `produtores.json`), sem demanda nem
índice. Decidido: vira estoque local, sai dos produtores do mundo; construída
por empresas, governo e pops privados (pobre autoconstrói precário, médio
financia, rico investe). Três índices em estudo (ids ainda não criados, o autor
aprova): déficit, preço e favela.
**Regras do autor (03/nov):** (1) processo = estoque que anda sozinho pelos
turnos, empurrado pelas leis em vigor; NÃO é painel com meta/ritmo; (2) cada lei
vai de "nada" a "mais" em UM lado da bússola, nunca de um extremo ao outro;
(3) leis em todos os lados. Proposta no chat: processo "urbanizar favelas" com
leis de esquerda, direita, libertário, autoritário e verde. **Molde aprovado
(03/nov):** jogador monta "builds"; só leis que se colidem não valem juntas
(como anti-armas × pró-armas). Próximo: propor as leis dos processos déficit e
preço, e a lista de colisões, antes de qualquer código. **Feito:** 3 índices em
`variaveis.json` (`deficit_habitacional`, `preco_moradia`, `favela`, calculados,
ainda sem cálculo no motor). Lista das 18 leis (3 índices × 6 lados) e 5
colisões enviada no chat; autor concordou em manter os 3 índices separados.
**04/nov:** criado `docs/jogo/arquitetura.md` (camadas, turno, peças: índice,
lei, processo, colisão, área). O autor quer "mudar algumas coisas antes de
continuar": esperar o que muda. Falta: criar as 18 leis, o cálculo, tirar
moradia dos produtores.

## Pendências do autor

- Jogar o Pregão (botão "Bolsa").
- Commits locais sem push (55eb0ff2, 5adddb3c, 46799fda, f8b8a705, 0d121456 e os de pops/grupos) (push só com a palavra do autor).
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
