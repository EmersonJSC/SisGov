# Onde parei

Bilhete da última sessão, para a próxima conversa começar sabendo.
Status de mecânica é no [PLANO](PLANO.md); aqui fica só o estado do momento.

**Atualizado em 29/out/2026.**

## Antes de tudo: duas coisas ficaram no ar

1. **`npm run check` não terminou de rodar** sobre a camada B. Os testes dos
   arquivos mexidos passam (`bolso.test.ts` 18/18, `censo.test.ts` 9/9, `tsc -b`
   e `eslint` limpos), mas a suíte inteira — que leva ~20 min — ficou pela
   metade. **Rodar `npm run check` antes de seguir.**
2. **Uma revisão independente da camada B foi pedida e não voltou.** Ela olhava
   conservação de dinheiro na repartição, divisão por zero e dupla contagem de
   imposto. Se quiser o mesmo olhar, pedir de novo — o contexto dela se perdeu.

## Por onde continuar

1. **Camada C dos Grupos — movimento**: o perfil muda de faixa por causa da
   condição material (perde emprego, migra, muda de valores). É o que passa do
   Democracy 4. Vai produzir país absurdo nas primeiras tentativas — 80%
   informal em dois turnos — e o censo já está pronto para flagrar.
2. **Ligar o bolso na satisfação** (hoje ele só aparece na tela, decisão de
   29/out). Tem desenho próprio; mexe no que já está calibrado.
3. **Ponta solta do país em frases**: a Informalidade mostra "39 / 100" em vez
   de "38,6% dos ocupados" (`escalaReal` em `src/ui/mapa/formatos.ts` só
   converte quando `medida.convertida`). 15 minutos.
4. **Itens 4 e 5 do PLANO**: a seta `saude_populacao → taxa_mortalidade` (hoje
   a pandemia não mata ninguém) e a bolha órfã da Natalidade.

## O que fechou nesta rodada

**País em frases** (fase 3): a bolha diz como está em vez de mostrar pontos do
motor. 55 das 192 falam; o resto cai no número, de propósito.

**Censo da população** (Grupos, camada A): a aba População, uma ficha por
atributo — pizza até seis faixas, treemap acima disso. Duas telas foram
descartadas antes por não se lerem (lista de barras, cem bonecos).

**Bolso e ocupação** (Grupos, camada B): cada perfil tem renda, imposto,
benefício e sobra, repartidos dos agregados que o motor já calcula. O censo
mostra quanto sobra por faixa, e a lei diz no bolso de quem ela bate.

## Decisões desta rodada, para não refazer a conversa

- **O agregado manda, o perfil divide.** A economia continua calculando o bolo;
  os 2.090 perfis repartem. A virada para "o perfil manda e o PIB é a soma" (o
  Victoria 3 inteiro) fica para depois e continua barata, porque o bolso guarda
  a **fonte** do dinheiro com nome.
- **Os setores econômicos vão existir** (indústria, serviços, agro). Hoje são só
  nome dentro de ocorrências de lobby; a ocupação segura o lugar deles, e eles
  entram pela fonte sem reescrever a camada B.
- **O bolso só mostra, não mexe na satisfação** — por ora.
- **Faixa escrita se julga jogando**: as frases de Gini, HHI e PIB em índice vão
  para a revisão manual bolha por bolha, lá na frente, não agora.

## Limitação conhecida, que não é bug

O imposto é proporcional: todos pagam a mesma fração do que ganham. O sistema
brasileiro é regressivo no consumo e progressivo na renda. Entra na calibragem
(item 12 do PLANO).

## Ferramentas que ficaram

- `npx vite-node scripts/teste/frases-das-bolhas.ts` — a frase de cada bolha
- `npx vite-node scripts/teste/bolso-dos-perfis.ts` — ganha/paga/sobra por faixa

Foram esses dois scripts que acharam o que os testes não achavam: a fração que
mentia em valores pequenos, e o imposto em 61% da renda.

## Armadilhas do projeto, aprendidas na marra

- **`npx tsc --noEmit` não checa nada aqui** — sai 0 com erro na cara. O projeto
  usa project references: o comando é `npx tsc -b`.
- **Reescrever um arquivo grande com o dev server ligado** pode fazer o Vite
  cachear um módulo vazio e dar tela branca. `Ctrl+Shift+R` resolve.
