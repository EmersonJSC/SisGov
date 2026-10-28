# Onde parei

Bilhete da última sessão, para a próxima conversa começar sabendo.
Status de mecânica é no [PLANO](PLANO.md); aqui fica só o estado do momento.

**Atualizado em 28/out/2026.**

## Por onde continuar

1. **Lote de redação das faixas escritas** (país em frases, jeito 3): só
   índice e jargão — Gini, HHI, PIB em índice. É trabalho braçal: vai para o
   GPT com as regras de `gpt.md`.
2. **O boletim ainda mostra pontos do motor** no número grande ("39 / 100")
   em vez da medida real (38,6% dos ocupados). A regra 2.7 do documento pede
   a medida de verdade.
3. **Sujeitos que a heurística não cobre**: `scripts/teste/frases-das-bolhas.ts`
   lista as 137 bolhas sem frase. Várias são gente de verdade ("% que confia
   no Congresso", "comparecimento na eleição") e ganham frase com uma linha em
   `SUJEITOS`, dentro de `src/app/partida/frase.ts`.

## O que fechou agora

País em frases, fase 3, de ponta a ponta e visto na tela: a função, a visão,
o rótulo da bolha, o `aria-label` e o boletim. 55 das 192 bolhas falam; o
resto cai no número, de propósito.

## Ferramenta que ficou

`npx vite-node scripts/teste/frases-das-bolhas.ts` imprime a frase de cada
bolha da partida. Foi ele que achou os erros que os testes não achavam.
