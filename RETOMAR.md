# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**02/nov/2026**

## Onde está

Passos 11 (mundo) e 12 (mercado, sem a 5b) fechados; dinheiro na tela fechado.
Mercado tipo Vic3 em código até a fatia 7 (comida, Remédios, Energia).
**Fatia 8 (Propriedade) redesenhada e aprovada pelo autor em 02/nov:** o
protótipo v2 (barra de 50 blocos) foi descartado. **Regras gerais = leis
(bolhas)**; **decisão por setor = ficha do setor** (dono estatal/mista/privada,
importação, teto de capital estrangeiro, preço), e cada mudança é um projeto de
lei votado, que segue as leis gerais (indenização, método de venda, prazo,
triagem, Déficit e Superávit etc.). Tudo em `src/motor/mercado/mercado.md`,
fatia 8. Princípios 8 e 9 do escopo (bolha; dados antes da narrativa) escritos.
Skill nova `sisgov-gamedesign` (6 perguntas antes de desenhar).

## Próximo

**Plano de 8 passos para fechar a fatia 8 escrito em `mercado.md`; o autor
aprova e começa o passo 1 (estado do setor no motor, sem tela).**
**Feito em 02/nov:** Déficit e Superávit (leis de opções na área Economia,
`fecharTurno` lê `deficit_do_cofre` e `superavit_ao_cofre` das opções, 10 testes
em `contas.test.ts`, vistas no mapa). Os 9 setores foram aprovados como estão
(expandimos depois). Agora, nesta ordem: ficha do setor Alimentos com os avisos; leis de venda e estatização;
estrangeiros; energia (substitui as 3 leis "quem constrói/opera/vende").
Sem commit ainda: `docs/jogo/escopo.md`, `mercado.md`, `RETOMAR.md`, `src/motor/contas`, `src/motor/leis`, `src/motor/turno`, `src/conteudo` (leis e países),
`docs/historico/retomar.md` e `.claude/skills/sisgov-gamedesign/` (adicionar
arquivo por arquivo).

## Pendências do autor

- Confirmar Energia e Remédios na tela.
- Commits locais sem push (push só com a palavra do autor).
- Proteção de dados: lei única de 3 opções foi criada sem confirmação explícita; ver se serve.
- Antes de publicar o jogo: checar com advogado.
- Eixos novos da bússola (paz × militarismo, seção 11); outro chat trata da economia militar.
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
