# Onde parei

Bilhete da última sessão, para a próxima conversa começar sabendo.
Status de mecânica é no [PLANO](PLANO.md); aqui fica só o estado do momento.

**Atualizado em 29/out/2026.**

## A revisão voltou: 1 grave, 3 sérios

Uma revisão independente da camada B foi feita em 29/out e achou o seguinte.
Nenhum foi corrigido — tudo está como ela encontrou.

**GRAVE — o benefício do aposentado ignora o reajuste**
(`src/app/partida/bolso.ts`, a leitura de `beneficio_anual_aposentadoria`).
O motor paga `aposentados × beneficio_anual_aposentadoria ×
nivel_reajuste_de_beneficios/100`, e o reajuste começa em 75. Eu leio a
variável crua. Duas consequências, as duas visíveis:

- o censo mostra aposentado com R$ 4.167/mês quando o orçamento implica
  R$ 3.125 — e na tela o aposentado sobra mais que servidor e que
  trabalhador com carteira, o que é absurdo;
- a lei `reajuste-de-beneficios` mexe no fator, não na variável que eu leio,
  então o boletim diz que a única lei que atinge aposentados não bate em
  ninguém. Conferido: `grep base_aposentadorias` em
  `mundo/indicadores/variaveis.json`.

**SÉRIO — o imposto sobre consumo é cobrado de base que o motor não tributa.**
A alíquota está certa, o multiplicando não: aplico sobre `ganha`, que inclui
a aposentadoria, mas `consumo_familias` só soma massa salarial e uma fração
mínima dos lucros. Somando os 2.090 perfis, o eleitorado "paga" mais imposto
sobre consumo do que o orçamento arrecada ao lado.

**SÉRIO — `lucros` nunca é lido; empresário é pago pela massa salarial.**
Empresário, agro-patronal e pequeno empreendedor tiram do bolo do trabalho.
Lei que corta imposto sobre lucro não mostra ganho nenhum para eles; lei que
sobe o salário médio dá aumento a empresário na mesma proporção de um
assalariado.

**SÉRIO — `quemPagouAConta` agrega só por ocupação, mas o campo se chama
`faixa` e o spec pede ocupação × renda.** A frase que vende a mecânica — "os
informais pobres" — não pode ser escrita, e a perda concentrada nos pobres
aparece diluída na média de todos os informais.

**Menores, anotados e não corrigidos:** salário médio negativo passa sem
guarda; o campo `beneficio` não existe nos tipos (um `as` esconde a lacuna, e
renomear a chave no JSON cala o aposentado sem erro); o teste de conservação
filtra pelo resultado em vez de ler `trabalha` da tabela; a prévia compara só
o último mês do horizonte (1 trimestre por padrão), então mostra fração do
efeito; `censoDoPais(content)` sem valores devolve bolso zerado em vez de
ausente; `MESES = 12` declarado em três lugares; a parte do eleitorado
arredonda para "0%" nas ocupações pequenas.

**Nota de processo:** a tabela de multiplicadores entrou no commit da camada
A (`ed40d6fc`), não no da camada B — quem revisar só `ac9e6e9b..HEAD` não vê
os multiplicadores.

## Antes de tudo

**Corrigir os quatro achados acima** antes de abrir a camada C. O grave é de
uma linha; os três sérios pedem decisão de desenho (de onde sai a renda do
empresário, que base consome a aposentadoria, agregar por ocupação × renda).

`npm run check` passou em 29/out sobre tudo que está commitado: **116
arquivos, 595 testes, saída 0**. Os quatro achados não quebram teste nenhum —
são erros de modelo, não de código quebrado. É por isso que o check verde não
os pegou, e o script sim.

**Sessão de 29/out (tarde):** `npm run check` rodando em segundo plano (log em
`/tmp/claude-1000/.../scratchpad/check.log`; format, lint e tsc já passaram, falta
vite build e a suíte). A revisão da camada B foi feita pelo mesmo contexto que a
escreveu: três limites anotados no PLANO (item 3, "Revisão da camada B"). Script
novo: `npx vite-node scripts/teste/conservacao-do-bolso.ts`.

## Por onde continuar

0. **Os quatro achados da revisão.** São a frente aberta; a camada C espera.
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
