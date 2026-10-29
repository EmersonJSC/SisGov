# Onde parei

Bilhete da última sessão, para a próxima conversa começar sabendo.
Status de mecânica é no [PLANO](PLANO.md); aqui fica só o estado do momento.

**Atualizado em 29/out/2026.**

## Por onde continuar

1. **Camada B dos Grupos — bolso e emprego**: cada perfil ganha salário,
   imposto, consumo e setor, repartindo os agregados que já estão calibrados
   (o agregado manda, o perfil divide). É o que faz a lei mexer no bolso de
   alguém com nome. Guardar **setor e salário no perfil desde já**: é isso que
   deixa barata a virada futura para "o perfil manda".
2. **Ponta solta do país em frases**: a Informalidade mostra "39 / 100" em vez
   de "38,6% dos ocupados" (`escalaReal` em `src/ui/mapa/formatos.ts` só
   converte quando `medida.convertida`). 15 minutos.
3. **Itens 4 e 5 do PLANO**, achados ontem: a seta
   `saude_populacao → taxa_mortalidade` (hoje a pandemia não mata ninguém) e
   a bolha órfã da Natalidade.

## Fora da mecânica, de propósito

As **faixas escritas** (Gini, HHI, PIB em índice) não entram aqui: o autor
decidiu em 28/out que texto se julga jogando, na revisão manual bolha por
bolha e lei por lei, que vem mais para o fim.

## O que fechou agora

**Censo da população** (Grupos, camada A), visto na tela: a aba População com
uma ficha por atributo — pizza até seis faixas, treemap acima disso (a
Ocupação tem nove). Cada faixa traz a frase do país em frases ("uma pessoa em
cada quatro") e a marca das que não têm grupo no mapa. Paleta validada por
script para daltonismo e contraste; treemap com teste de área antes do código.
Sem tendência de propósito: os perfis são fixos até a camada C, e seta de
"subiu" seria mentira.

**Decisão de gosto em aberto:** a cor se repete entre as fichas (azul é classe
média e também católicos). Sugeri uma cor por ficha em tons; o autor não
respondeu, então ficou como está.

Antes dele, **país em frases** fechou de ponta a ponta: a função, a visão, o
rótulo da bolha, o `aria-label` e o boletim. 55 das 192 bolhas falam.

## Ferramenta que ficou

`npx vite-node scripts/teste/frases-das-bolhas.ts` imprime a frase de cada
bolha da partida. Foi ele que achou os erros que os testes não achavam.
