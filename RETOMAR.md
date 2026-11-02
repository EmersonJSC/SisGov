# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**02/nov/2026**

## Onde está

Passos 11 (mundo) e 12 (mercado, sem a 5b) fechados; dinheiro na tela fechado
(`npm run check` verde, 137 testes). **Nova frente: mercado de verdade, bem
parecido com o do Vic3** (autor): a comida do país depende de pessoas, produção,
preço e de quem consegue pagar. Pesquisa salva em
`docs/jogo/mercado-vic3-referencia.md`. Desenho na
**fatia 6** de `src/motor/mercado/mercado.md`; **6a a 6d em código** (comida e Remédios como cestas; falta o autor confirmar Remédios na tela): demanda dos pops, oferta, preço
do país (faixa de 25% a 175%) e segurança alimentar. Autor decidiu: Agro é
grupo de pop, não produto; produtos novos **Grãos** e **Frutas**; todos os
produtos, mas a comida primeiro e só depois de confirmada na tela os outros.

## Próximo

Autor olha a **Energia** (bolha "Infra", 8 leis: 5 verbas por fonte e 3 de
"quem constrói / opera / vende") e o bloco "Energia: capacidade contra demanda"
na janela Mercado, e confirma, junto com Remédios. Em aberto: as outras 5 leis do
pacote (tarifa social, subsídio à limpa, imposto sobre fóssil, licenciamento,
fiscalização nuclear), uma por vez; risco da nuclear. Depois, **uma regra
própria por vez**: Moradia, Infraestrutura (estradas, obras), Militar.
Industriais, informação e luxo ficam para depois. Equilibrar com "Brasil" e
"EUA" só no fim (ver a regra de país real). Demografia é etapa própria.

Outro chat trata da **economia das leis militares**. Em aberto: **eixos novos**
da bússola (paz × militarismo, seção 11).

## Pendências do autor

- Commits locais sem push (push só com a palavra do autor).
- Proteção de dados: lei única de 3 opções foi criada sem confirmação explícita; ver se serve.
- Antes de publicar o jogo: checar com advogado (mecânicas não são protegidas, expressão é; ver pesquisa no chat de 02/nov).

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
