# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**14/nov/2026**

## Onde está

10a (mapa) terminado; o item 5 (janelas: menu no brasão, salvar sozinho, Governo na trindade, Eleição e
Mercado nos medidores, Mesa e Programas em botões) está **feito e NÃO commitado**.

Agora o **nível 3 do grafo: índices e leis** (plano em `~/.claude/plans/tidy-spinning-blum.md`).
Medida: `npx vite-node scripts/grafo-nivel3.ts`.

- Passo A (índices cobrem o país): **feito, NÃO commitado.**
  - Todo índice tem `dono` (instituição, poder ou `pais`) no lugar de `area`; nenhuma instituição sem índice.
  - O mapa põe o índice pelo dono: os 6 do país em volta da trindade; Independência da Justiça junto do
    Judiciário.
  - Fome juntou em Abastecimento, que agora se chama "Comida na mesa"; as 4 leis da fome perderam o fio.
  - Casas vazias contadas pela moradia.
  - 5 índices novos: envelhecimento, expectativa de vida, turismo, esporte, tensão federativa.

## Próximo

**Judiciário de verdade, fatia 1** (o autor quis abrir já): proposta pelas 6 perguntas da
`sisgov-gamedesign` está no chat, esperando o sim do autor. Depois: passo B (fios dos índices: 127 sem
saída) e passo C (100 leis sem nada).

## Pendências do autor

- Commit do item 5 e do passo A (só com a palavra dele).
- Opinião central: estruturar direito, mecânica própria (não copiar outro jogo), antes do 10b.
- A mídia não pesa em nada (GDD §18): corrigir quando fizermos mídia e polêmica.
- Conferir [docs/jogo/codigo-a-conferir.md](docs/jogo/codigo-a-conferir.md).

## Armadilhas

- Não abrir docs/v1/desenho, docs/referencia, docs/arte/PROMPTS.md, docs/conteudo/rede.md, docs/Exemplos.
- Nada é commitado sem a palavra do autor; nunca `git push`. `arquivo/`, `public/arte`, `public/demos`,
  `docs/arte/*` e `docs/jogo/interface/*` ficam fora dos commits.
- `npm run icones` está quebrado: 90 leis mudaram de esfera e o mapa de ícones não acompanhou. Ícone de
  índice novo foi gravado à parte; consertar é pedido à parte.
- "Lei sem nada" conta só efeito, dinheiro e módulo do motor: lei que só está num programa conta como sem nada.
- `npm run format:check` falha em 16 arquivos antigos (scripts de ícones, JSONs do Brasil): não são da
  rodada; formatar é pedido à parte.
- Vite às vezes serve módulo vazio ("does not provide an export"): `touch` no arquivo e recarregar.
- Pacote novo deixa o `npm run dev` em branco ("Outdated Optimize Dep"): reiniciar o servidor.
- `tsx` não roda scripts com `import.meta.glob`; usar `vite-node`.
- Classes CSS da tela inicial levam `ini-`, as da barra `topo-`; não usar `<main>` fora do mapa.
- `manifest-leis.json` tem 220 ids de leis que não existem mais; limpar é pedido à parte.
- O scratchpad de /tmp some sem aviso: script de medida fica em `scripts/`.
