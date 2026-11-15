# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**14/nov/2026**

## Onde está

**Requisitos a partir do GDD (14/nov, frente atual):** plano aprovado em `docs/jogo/prompt-requisitos.md`
(com os 5 ajustes de 14/nov: nomes novos, autor lê a Parte antes, onda 1 commitada antes da auditoria,
lotes de ~200 linhas com Fases 1+2 juntas, commit só com a palavra do autor). Rascunhos em
`docs/jogo/requisitos-rascunho/` (fora dos commits, apagar no fim): `00-ficha.md`, `cortar.py` (corta o GDD
por seção sem o "No motor hoje"; rodar de novo se o GDD mudar), `lotes.json` (26 lotes), `instrucoes-fase12.md`.
**Parte 1 fechada (14/nov):** 105 requisitos (35 certos, 51 pela metade, 3 errados, 12 faltam, 4 não se aplicam) no `requisitos.md` (no lugar do antigo bloco 4), texto completo e prova em `docs/jogo/auditoria/`, "No motor hoje" da Parte 1 do GDD trocado, duplicados em `codigo-a-conferir.md`. Próxima: Parte 4 (Máquina pública), 5 lotes, só quando o autor chamar e depois de ele ler a Parte 4. **Custo real:** ~95 mil tokens por lote nos requisitos e ~240 mil na auditoria; a Parte 1 gastou ~17% da cota. O autor pediu para ir aos poucos: uma Parte por vez, só quando ele chamar. Ordem: 1 → 4 → 3 → 2 → 5 → 6 → 7 → 9 → 8.

**GDD por mecânica commitado (8bbe87da).** Autor leu só a Parte 1. `docs/jogo/gdd-novo/` fica até ele ler tudo.

**Onda 1 das leis commitada (30b0ae69).** Ficaram para depois: janela "Leis para propor" (frase, lado, Atos à parte, relógio da lei com prazo) e coluna "Brasil tem?" na aba Leis. Avisar: preço/câmbio/crédito em "espera" (11 leis), poder-de-decreto com 7 degraus quebrados (onda 4).

## Pendências do autor

- A base do governo tem 60 de 81 senadores: o Senado aprova quase todo aliado. Ver se o voto deve pesar mais a distância.
- Opinião central: estruturar direito, mecânica própria (não copiar outro jogo), antes do 10b.
- A mídia não pesa em nada: é lente sobre os fatos (GDD 6.1); estudar como mexe em cada mecânica.
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
