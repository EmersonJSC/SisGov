> **Substituído em 14/nov/2026** pelo [GDD por mecânica](../jogo/gdd.md). Guardado só como histórico.

# O que é uma lei

Rascunho de 14/nov/2026, revisado com o autor no mesmo dia. Vai entrar no GDD
(seção 7) quando estiver fechado.

Este documento diz o que uma lei representa, de que peças ela é feita e como
saber se ela é jogável. Ele vem antes da revisão lei por lei: cada lei é
conferida contra estas regras, e não contra o gosto de quem revisa.

As regras de classificação (tipo, jeito, canal) e a lista de casos bons e ruins
continuam no GDD (seção 7) e na skill `sisgov-lei-boa`. Aqui fica o porquê
delas e o processo de conferir.

---

## 1. O que uma lei representa

Uma lei é **uma pergunta que o presidente responde e que fica valendo.**

- "Quanto o rico paga de imposto de renda?" → 27,5%
- "Até onde vai a liberação das drogas?" → até a cannabis
- "Quem recebe a transferência de renda?" → só os pobres

A resposta muda uma regra do mundo, todo turno, até alguém mudar de novo. Por
isso ela tem dono (a instituição que executa), tem quem ganha e quem paga, e
tem preço político para mudar.

O que **não** é lei, mesmo que pareça:

| Parece lei, mas é | Como reconhecer | Vai para |
|---|---|---|
| Processo | Tem etapas e anda sozinho pelos turnos | Processo, empurrado por leis |
| Consequência | É o resultado de outras escolhas | Índice |
| Caso a caso | A resposta muda para cada banco, obra, empresa | Papel na mesa ou evento |
| Opção de menu | Age sobre um país ou companhia escolhidos | Posição por país ou Operação |
| Acontece uma vez | Não fica valendo depois | Ato |
| Informação | Só mostra um número | Marca na régua de outra lei |

---

## 2. De que peças a lei é feita

1. **A pergunta.** Uma só. Se a lei responde duas perguntas, são duas leis.
2. **As respostas possíveis** (o jeito: Régua, Verba ou Níveis).
3. **O dono:** a instituição que executa.
4. **A entrada no motor** (canal): imposto, verba, transferência, preço, regra
   ou direito. É o primeiro número que a lei mexe.
5. **Quem ganha e quem paga:** quais grupos, estratos, setores.
6. **O lado:** para onde ela puxa na bússola.
7. **O tempo:** quanto demora para o efeito aparecer.

Se faltar a peça 4 ou a 5, a lei não está pronta: ou não chega ao motor, ou não
tem gente do outro lado.

---

## 3. Como escolher o jeito

Toda lei é um slider. Há três jeitos, e só três (decidido em 14/nov: a
Escolha saiu; opções sem ordem viram degraus de Níveis).

```
As respostas são um número com unidade real (%, anos, R$)
e um valor no meio faz sentido?
├─ sim → sai do orçamento como gasto? ── sim → VERBA
│                                      └─ não → RÉGUA
└─ não → NÍVEIS: as respostas viram degraus em ordem (3 a 5),
         do mais fraco ao mais forte no lado da lei
```

- **Régua:** qualquer valor entre o mínimo e o máximo faz sentido (IR do rico
  pode ser 27,5% ou 31%). Não gasta direto.
- **Verba:** também é número, mas tira dinheiro do orçamento e dá a uma
  instituição; disputa o caixa com as outras verbas e entra no déficit.
- **Níveis:** poucos degraus fixos, cada um uma coisa diferente, sem meio
  entre eles (não existe "meia cannabis").

Como pôr em ordem respostas que parecem "jeitos diferentes": ordenar pelo
quanto o Estado entra (ou sai), ou por quantas pessoas a lei alcança. Se não
há ordem possível, são leis diferentes, ou não é lei (seção 1).

Sinais de jeito errado:

- **Níveis que são números disfarçados** ("pouco, médio, muito") → é Régua.
- **Régua cujo meio não existe** (metade de um monopólio) → é Níveis.
- **Duas respostas só** → é um slider faltando resposta: achar os degraus do
  meio, ligar com outra lei (vira degrau dela) ou apagar, se não faz falta.
- **Dois números na mesma lei** → separar.
- **Cada estrato ou setor pede o seu número** → uma lei por estrato ou setor,
  ligadas pelo "Parte de".

### A régua não limita o jogador

Toda régua e toda verba vão até o extremo que algum país real já usou (o IR
dos EUA chegou a 91% nos anos 1950). O fim da régua nunca é onde o valor
"faz sentido": quem para o exagero são as consequências do mundo (seção 5).
O jogador não pode se sentir travado pela régua.

### Juntar antes de criar

Instituição inflada (muitas leis) se reduz: leis que respondem à mesma
pergunta viram degraus de uma só, e leis vizinhas viram uma régua. O alvo é
o menor número de leis que ainda cobre todas as decisões do presidente
(seção 6).

### Nome da lei

- O nome diz o que a lei controla, em palavras de todo dia, no mesmo molde
  para todas: **o que + de quem/sobre o quê** ("Imposto sobre consumo",
  "Imposto de renda do rico", "Piso da saúde").
- Sigla e nome técnico nunca no nome. O nome real do país (IBS, CBS, Selic)
  pode aparecer embaixo, menor, como rótulo do país.
- Ao passar o mouse, uma frase de leigo diz o que muda na vida de alguém,
  com exemplo.

## 4. Como saber se as respostas são escolhas de verdade

Cada resposta (cada degrau, ou ponta e meio da régua) passa por seis testes.

1. **Alguém defende.** Existe um partido, grupo ou país real que quer essa
   resposta. Se ninguém defenderia, o degrau sai.
2. **Muda um número.** O motor dá um resultado diferente do degrau vizinho.
   Se dois degraus dão o mesmo número, viram um só.
3. **Ninguém ganha sempre.** Nenhuma resposta é a melhor em qualquer país e
   em qualquer momento. Se uma ganha sempre, a lei não é escolha: falta custo
   a ela ou ganho às outras.
4. **O jogador vê.** Aparece algo na tela (índice, conta, grupo, jornal) que
   mudou por causa dela. Se o efeito demora, o jogador sente antes no jornal
   ou na população, que reagem já.
5. **Não vira botão.** Botão é a régua em que só uma ponta serve: o jogador
   sempre arrasta até lá, e ela funciona como interruptor (ligado ou
   desligado). Nenhuma lei pode ser assim. As duas pontas servem a alguém e
   existe caso em que o meio é o melhor valor.
6. **Tem regulador.** A lei diz qual número do mundo muda o valor certo dela
   (seção 5). Lei sem regulador é cenário: o jogador acerta uma vez e nunca
   mais volta.

O teste 3 é o mais importante. É ele que faz o resultado emergir: a mesma lei
é boa num país rico e ruim num país endividado. Sem o motor rodando, a
revisão escreve o caso em que cada resposta ganha; se não houver caso, a lei
falha.

---

## 5. Ponto doce e regulador

A lei não tem um valor certo fixo. Ela tem um **ponto doce**: o valor em que
o ganho ainda compensa o custo. Perto do extremo, o ganho cai e o custo
sobe. O ponto doce vem do mundo, não do fim da régua (que vai longe, seção 3).

O **regulador** é o número do mundo que move o ponto doce durante a
partida, e obriga o jogador a voltar à lei:

- Transferência de renda → quantos pobres existem. País que enriquece e
  mantém a verba alta passa a pagar a classe média (no motor: a parte que
  passa dos pobres vaza para o estrato de cima).
- Verba da saúde → idade da população (o país envelhece, a saúde pede mais).
- Imposto de renda do rico → dívida e economia (em crise falta caixa e subir
  compensa; perto da eleição, baixar agrada).

O regulador é algo que muda sozinho: idade da população, inflação, preço do
petróleo, ciclo da economia, eleição. Se o ponto doce muda só com a
estratégia do jogador, vira receita pronta (aconteceu com o imposto do
Victoria 2: os fãs acharam a receita uma vez e repetem sempre).

**O que o motor já faz, por canal** (o detalhe fica em `mecanicas.md`, 6.8):

| Canal | O que puxa o ponto doce | No motor |
|---|---|---|
| Imposto | Laffer: subir demais encolhe a base; o país declara onde começa (no Brasil, o mais alto é 45%) | Feito. Falta a sonegação crescer com o imposto (hoje é fixa) |
| Verba | Verba acima do que a instituição precisa vira corrupção | Sobra → corrupção: feito. Falta pouca verba enfraquecer a lei |
| Transferência | Vaza para quem não precisa quando cobre mais que os pobres | Feito para a transferência principal |
| Regra e direito | Nada ainda | A pensar (proposta abaixo) |

**Proposta para regra e direito: fuga da regra.** Quanto mais forte a regra,
mais gente foge dela: salário mínimo alto demais empurra para o trabalho
informal; proibir demais cria mercado ilegal; licença difícil demais vira
obra sem licença. Quanto foge depende da verba de quem fiscaliza. É a
"Laffer" das regras: a regra forte demais alcança menos gente. Ainda não
decidido.

---

## 6. O que torna uma lei jogável

A lei é jogável quando escolher o valor dela é uma decisão difícil e com
consequência. Isso pede:

- **Ganho e custo em lugares diferentes.** Ganha um grupo, paga outro; ou
  ganha agora, paga depois (lei pegadinha); ou ganha no índice, paga no caixa.
- **Depende do estado do país.** O melhor valor muda com a renda, a dívida, o
  desemprego. Sem isso, o jogador descobre o valor certo uma vez e nunca mais
  pensa.
- **Mexe em algo que existe.** Mercado, setor, verba de instituição, índice
  com dono. Lei que só mexe num número que ninguém lê não é jogo.
- **Custa mudar.** Usa pelo menos uma das três escassezes, e o jogador vê o
  custo:
  - **dinheiro:** a verba disputa o orçamento;
  - **Congresso:** a lei gasta apoio e tempo na fila;
  - **gente:** um grupo perde e cobra na eleição.
  Podem se misturar, e é o normal (IR do rico custa gente e Congresso). Lei
  que não usa nenhuma é a lei que todo mundo liga.
- **Espalha.** O efeito anda pela cadeia (comida → carne; máquina → aço) e
  esbarra em outras leis.

---

## 7. O que torna um conjunto de leis jogável

Uma instituição é jogável quando o **conjunto** dá ao jogador caminhos
diferentes, não só leis boas soltas.

- **Os lados legislam.** Esquerda e direita (e os outros lados que o tema
  tiver) têm leis próprias. Zerar a lei de um lado não é a política do outro.
- **Cada índice da instituição tem alavanca para os dois sentidos.** Se só dá
  para piorar ou só para melhorar, falta lei.
- **Barato e caro, rápido e lento.** Há lei que dá efeito já e custa pouco, e
  lei que demora e transforma.
- **Uma tensão dentro.** Pelo menos duas leis puxam em sentidos contrários e o
  jogador precisa escolher o equilíbrio.
- **Sem repetição.** Duas leis não mexem no mesmo número do mesmo jeito.
- **Sem buraco.** Toda decisão real que um presidente toma nessa instituição
  tem uma lei.
- **Obriga a abrir mão.** Se dá para ligar tudo de bom, nada é escolha (a
  crítica mais repetida ao Frostpunk). O conjunto faz o jogador renunciar:
  verbas que disputam o mesmo caixa, leis de lados opostos que se anulam, o
  custo no Congresso.
- **Do problema até a lei.** Quando o jogador vê um problema (desemprego
  subindo), acha em um ou dois cliques as leis que mexem nele. Na revisão:
  cada índice da instituição com a lista das leis que o sobem e das que o
  descem. Índice sem lei para algum lado é **buraco**; lei que não mexe em
  nenhum índice está **solta**.

---

## 8. A mecânica do jogo das leis

Em resumo, o laço que o jogador vive:

1. Vê um problema no país (índice, grupo bravo, jornal).
2. Procura as leis que mexem nele, em uma ou várias instituições.
3. Escolhe quanto mover, sabendo quem vai perder.
4. Paga o preço no Congresso e nos grupos.
5. Espera o atraso e vê o efeito, inclusive o que não queria.
6. O efeito cria o próximo problema.

Cada lei só precisa servir a esse laço. Se ela não ajuda o jogador em nenhum
desses passos, ela não é do jogo.

---

## 9. O processo de conferir, por instituição

Uma instituição de cada vez, começando por Impostos (já está no motor, então
os testes se conferem contra números de verdade). Os passos 1 a 3 vão a um
modelo simples (sonnet) com este documento na mão, do jeito mais econômico
sem perder qualidade. O passo 4 é meu; o 5 é do autor.

1. **O que a instituição liga.** Que índices, mercados, grupos e contas ela
   mexe hoje no motor, e com que outras instituições divide tema.
2. **As perguntas do presidente.** Que decisões reais um presidente toma
   nessa área (sem olhar as leis que já temos).
3. **Cruzar.** Para cada lei atual: qual pergunta ela responde, os testes das
   seções 1, 3 e 4, o regulador, as escassezes que usa, o extremo real da
   régua, e o veredito:
   - fica · muda o jeito · junta com · divide em · sai · vira outra coisa
     (índice, ato, processo, papel, operação) · troca o nome.
   Para cada pergunta sem lei: buraco.
   Depois, a seção 7 sobre o conjunto.
4. **Revisão.** Eu confiro a saída do modelo simples antes de mostrar.
5. **Decisão.** O autor lê a tabela e decide; só depois se mexe nos JSON.

A saída de cada instituição é uma tabela na planilha `gdd.xlsx`, não um
documento novo.

---

## 10. Decidido em 14/nov

- Escolha saiu: toda lei é Régua, Verba ou Níveis.
- Duas respostas é slider faltando resposta (completar, ligar ou apagar).
- Régua sem limite: vai ao extremo real; quem para são as consequências.
- Nenhuma lei vira botão.
- Toda lei tem regulador; o ponto doce vem do mundo.
- Toda lei usa ao menos uma escassez (dinheiro, Congresso, gente).
- O conjunto obriga a abrir mão e liga cada problema às leis.
- Teste 3 sem motor: escrever o caso em que cada resposta ganha.
- Começar por Impostos; instituição inflada se reduz juntando leis.
- Nome simples e padrão; nome real do país só como rótulo.
