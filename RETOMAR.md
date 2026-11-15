# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**14/nov/2026**

## Onde está

**GDD refeito por mecânica (14/nov), NÃO commitado:** [docs/jogo/gdd.md](docs/jogo/gdd.md) junta o GDD
antigo, o mapa de mecânicas, as regras das leis, requisitos, `.md` do motor, planilhas, estudos e memórias.
3 mecânicas no meio (Sociedade, Economia, Máquina pública); em volta Política, Mídia, Mundo, Tela, Narrativas. Antes de
falar de uma mecânica, ler a parte dela. Substituídos foram para `docs/historico/`. Rascunhos, conflitos
decididos e fontes em `docs/jogo/gdd-novo/` (apagar depois que o autor ler o GDD; o `08-conflitos.md` tem
as decisões de 14/nov). Ordem decidida: Economia (dinheiro: bolsos e caminho) → Opinião (bolso vira
opinião) → revisão das leis por instituição (GDD 4.14, pelas regras de todas as mecânicas que a lei toca). Nomes das mecânicas e peças decididos em 14/nov (estudo em `docs/jogo/estudos/nomes-das-mecanicas-14nov.md`).
Judiciário commitado (9a15eb7c); base das leis commitada (f43df83a).
Judiciário commitado (9a15eb7c); base das leis commitada (f43df83a).

**Onda 1 quase pronta, NÃO commitada** (plano em `~/.claude/plans/tidy-spinning-blum.md`, aprovado 14/nov):
- Regras de classificação no GDD, Parte 4 (tipo, jeito, canal; nada = não legislada; juntar/separar).
- Validador cobra `jeito` nas leis triadas, níveis de 3 a 5, degrau "nada" (exceto essencial e canal regra).
- Motor: IR em 3 leis por estrato (`calculo.estrato`); 7 bases novas (patrimônio, aplicações, imóvel,
  capital, movimentação, folha, bancos); `encolhe`, `escala_gasto`, `para.pesos`, `arrecada`; módulo
  `src/motor/fisco` (cobertura da transferência, juros com BC, regra fiscal com punição e trava,
  pisos, conta da previdência); Lei com prazo (Anistia fiscal) e Ato (Renegociação/calote).
- Dados: 88 leis da onda reescritas; saíram imposto-renda, progressividade, faixa sem IR, monopólio,
  renda básica, fundo soberano (virou degrau do Superávit), gasto mínimo (virou Piso da saúde e da
  educação). Brasil recalibrado (`receita_fora_das_leis` 10,81; `scripts/receita-inicial.ts`).
- 1084+ testes verdes, `tsc -b` limpo. Folha da lei mostra "Tipo · Jeito".
- Conserto: partida salva de antes da onda quebrava o turno (leis apagadas e opções trocadas); o
  carregar (`src/partida/salvar.ts`) troca pelo valor de partida do país.

## Próximo

1. Tela: janela "Leis para propor" com frase e lado; Atos à parte; relógio da lei com prazo.
2. Coluna "Brasil tem?" na aba Leis; `npm run leis:planilha`.
3. Mostrar na tela (foto), `npm run check`, commit `mundo: onda 1 das leis …`.
4. Contar ao autor: preço/câmbio/crédito ficaram em "espera" (11 leis), poder-de-decreto tem 7 degraus quebrados (onda 4).

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
