# Onde parei

Bilhete da última sessão, para a próxima conversa começar sabendo.
Status de mecânica é no [PLANO](PLANO.md); aqui fica só o estado do momento.

**Atualizado em 28/out/2026.**

## Por onde continuar

1. **O número grande do boletim** ainda mostra pontos do motor ("39 / 100")
   em vez da medida real (38,6% dos ocupados). É `escalaReal` em
   `src/ui/mapa/formatos.ts`, que só converte quando `medida.convertida`:
   uma função, e todas as bolhas com medida melhoram de uma vez. É o último
   passo para fechar país em frases.
2. **Sujeitos que a heurística não cobre**: `scripts/teste/frases-das-bolhas.ts`
   lista as 137 bolhas sem frase. Várias são gente de verdade ("% que confia
   no Congresso", "comparecimento na eleição") e ganham frase com uma linha em
   `SUJEITOS`, dentro de `src/app/partida/frase.ts`.

## Fora da mecânica, de propósito

As **faixas escritas** (Gini, HHI, PIB em índice) não entram aqui: o autor
decidiu em 28/out que texto se julga jogando, na revisão manual bolha por
bolha e lei por lei, que vem mais para o fim.

## O que fechou agora

País em frases, fase 3, de ponta a ponta e visto na tela: a função, a visão,
o rótulo da bolha, o `aria-label` e o boletim. 55 das 192 bolhas falam; o
resto cai no número, de propósito.

## Ferramenta que ficou

`npx vite-node scripts/teste/frases-das-bolhas.ts` imprime a frase de cada
bolha da partida. Foi ele que achou os erros que os testes não achavam.
