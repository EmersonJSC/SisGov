# Capital político (V1-10)

**Status:** EM REVISÃO (13/out). O código só começa com a sua aprovação; as
perguntas estão na seção 8.

## 0. Resumo

O capital político é a margem que o governo tem para mudar as coisas. Ele
entra a cada turno, conforme a aprovação, a base no Congresso e a lua de mel
do começo do mandato, e sai a cada decisão: decreto custa pouco, lei custa
médio, emenda à Constituição custa muito. Grupos de pressão mobilizados contra
a mudança encarecem a conta. Sem capital suficiente, a mudança é recusada com
o motivo.

## 1. O que existe hoje (medido em 13/out)

- **Nenhum custo político.** `mudarLei` e `revogarLei` aceitam qualquer
  número de mudanças por turno; o único limite é o dinheiro.
- **129 leis no Brasil, por processo de mudança:** 75 por lei ordinária, 37
  por emenda constitucional, 14 por execução de programa autorizado, 1 por
  decreto e 2 cláusulas pétreas (que não mudam).
- **A ficha v3 já prevê `custoPolitico`** (aprovar, revogar, subir e baixar),
  mas nenhuma ficha preenche o campo.
- **Turno 0:** aprovação do governo 48, base de apoio no Congresso 55,
  estabilidade política 43, polarização 75 (todos de 0 a 100).
- **Investigar um grupo de pressão** (V1-09) hoje é de graça, e "negociar com
  o grupo" ficou esperando este chamado (`pressao.md`, seção 6).
- **A partida começa na posse** ("Você assume a presidência", `historia.json`),
  com mandato de 48 meses (16 turnos).

## 2. Métodos atuais

- **Capital como reserva que se gasta** (Light, _The President's Agenda_,
  1982; 3ª ed. 1999): o capital do presidente vem da base no Congresso, da
  popularidade e da margem eleitoral. Ele é maior no começo e tende a cair
  ao longo do mandato ("ciclo de influência decrescente"), enquanto o governo
  aprende a usar melhor o que tem.
- **Lua de mel** (Beckmann, _Pushing the Agenda_, 2010): o primeiro ano é a
  janela em que o presidente consegue mais do Congresso; a vantagem se
  desfaz com o tempo.
- **Aprovação ajuda, mas não decide tudo** (Canes-Wrone e de Marchi,
  _Journal of Politics_, 2002): a popularidade aumenta o sucesso do
  presidente sobretudo nos temas visíveis e complexos.
- **Presidencialismo de coalizão** (Abranches, 1988; Raile, Pereira e Power,
  _Political Research Quarterly_, 2011): no Brasil, o apoio no Congresso é
  comprado com cargos e emendas; a base é uma moeda que o governo administra.
  Como o parlamento saiu da versão 1 (V1-04), a base entra aqui só como fonte
  de capital.
- **Recurso escasso por turno** é uma ideia comum em jogos de estratégia
  (pontos de ação, autoridade, influência): obriga a escolher o que fazer
  primeiro. As fórmulas e os números abaixo são nossos.

## 3. Opções

| Opção                   | Como funciona                                                                                              | A favor                                                                           | Contra                                                                                                                      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **A. Reserva no jogo**  | Um número de 0 a 100 no estado da partida. Entra no fim de cada turno, sai quando você assina uma mudança. | Simples de entender e de testar; recusa na hora, com o motivo; não mexe no motor. | A explicação do ganho é escrita pelo jogo, não vem do "por que mudou?" da rede.                                             |
| B. Nó da rede (estoque) | O capital vira um índice-estoque da rede, com entradas pela aprovação e saídas pelas mudanças.             | O "por que mudou?" já explica; o capital poderia mexer em outros índices.         | A rede anda mês a mês, mas a mudança é assinada antes do turno: a recusa teria de prever o estoque. Mais difícil de testar. |
| C. Chance de passar     | Sem moeda: cada mudança tem uma chance de ser aceita, maior com aprovação e base altas.                    | Parece com a vida real.                                                           | Sem parlamento, a recusa por sorte frustra e não ensina; o chamado pede recusa "com motivo".                                |

**Escolha: A.** Ela atende o aceite do chamado (recusa com motivo, fórmula
testável) e deixa a porta aberta: se no futuro o capital precisar mexer na
rede (por exemplo, capital baixo derrubando a base no Congresso), um nó lê a
reserva sem mudar a regra.

## 4. A regra

Os números ficam em `src/conteudo/mundo/capital.json` (um país pode trocar
algum no seu `politica.json`). Os valores abaixo são o ponto de partida para
você jogar e ajustar.

### 4.1 Reserva

- Escala de 0 a **100**. O que passa de 100 se perde.
- Começa em **50** na posse.

### 4.2 Ganho no fim de cada turno

```
ganho = máximo(0, 3
               + 0,2 × (aprovação − 45)
               + 0,1 × (base no Congresso − 50)
               + lua de mel do turno)
```

- **3** é a máquina do governo: mesmo sem nada a favor, o presidente nomeia,
  edita decretos e negocia.
- **Aprovação** (`popularidade_governo`, 0 a 100): cada ponto acima de 45
  rende 0,2; abaixo de 45 tira.
- **Base no Congresso** (`base_congresso`, 0 a 100): cada ponto acima de 50
  rende 0,1. O peso é a metade do da aprovação porque, sem parlamento na
  versão 1, a base ainda não decide votação nenhuma.
- **Lua de mel:** +8, +6, +4 e +2 nos quatro primeiros turnos do mandato
  (o primeiro ano), e 0 depois. Num segundo mandato, a metade.
- **Nunca negativo.** Governo impopular para de ganhar, mas não perde o que
  guardou. O que cai com o tempo é o ganho, como no ciclo de Light.

Conta no turno 0 do Brasil: 3 + 0,2 × 3 + 0,1 × 5 + 8 = **12,1**. Sem lua
de mel e com o país igual, **4,1** por turno.

### 4.3 Custo de cada mudança

```
custo = base do processo × tamanho × resistência
```

- **Base do processo** (o V1-11 ajusta os prazos e pode refinar estes
  números):

  | Processo                                  | Base     |
  | ----------------------------------------- | -------- |
  | Decreto e execução de programa autorizado | 4        |
  | Lei ordinária                             | 12       |
  | Emenda constitucional                     | 30       |
  | Cláusula pétrea                           | não muda |

- **Tamanho:** `0,5 + 0,5 × (quanto a lei anda ÷ quanto ela pode andar)`.
  Mexer um degrau custa a metade de virar a lei de ponta a ponta. Aprovar uma
  lei do catálogo conta como tamanho 1; revogar, 0,75.
- **Resistência:** `1 + 0,15 × grupos contra`, no máximo 2. "Grupos contra"
  são os grupos de pressão mobilizados (nível 2 ou mais) que reagem a essa
  lei (`reage` em `pressao.json`) e cuja pressão sobe com a mudança.
- **Ficha manda:** se a ficha v3 tem `custoPolitico`, ele substitui a base do
  processo para aquela ação (aprovar, revogar, subir ou baixar).
- O custo sai na hora em que você marca a mudança. **Desfazer** devolve.
  Responder a um dilema não custa: o país já cobra a resposta.

Exemplos com os valores acima: mexer um degrau de uma lei ordinária sem
oposição custa 6 a 9; reescrever uma lei ordinária inteira custa 12; uma
emenda constitucional com dois grupos mobilizados contra custa 30 × 1 × 1,3
= 39.

### 4.4 Outras ações com custo

- **Investigar um grupo de pressão:** 8.
- **Negociar com um grupo de pressão** (pendente do V1-09): custa
  `5 × nível do grupo` e baixa a pressão dele em 10 pontos por 4 turnos. Ele
  não muda de ideia: se a causa continuar, a pressão volta.

### 4.5 Ritmo esperado

Em 16 turnos, com o país parado, entram cerca de 50 (inicial) + 20 (lua de
mel) + 16 × 4 = **134** pontos. Isso dá de 10 a 15 mudanças em lei
ordinária, ou 3 ou 4 emendas, por mandato, e mais no primeiro ano. Quem
governa bem (aprovação 65 e base 70) ganha cerca de 9 por turno e dobra
esse ritmo.

## 5. Na tela

- **Barra de capital** na barra de cima, ao lado do turno: "Capital 37 de
  100", com "+6 no próximo turno" e, ao passar o mouse, a conta do ganho
  (máquina, aprovação, base e lua de mel).
- **Custo em cada decisão:** no botão de assinar da janela da lei, "Custa 12
  · você tem 37". O custo muda na hora em que você escolhe a nova redação.
- **Recusa com motivo:** sem capital, o botão fica travado com "Faltam 5
  pontos de capital: a mudança custa 12 e você tem 7". A resistência aparece
  quando existe: "+30% porque 2 grupos estão mobilizados contra".
- **Fim do turno:** o relatório mostra quanto entrou e quanto saiu.

## 6. Fica para depois

- **Capital mexendo na rede** (capital baixo derrubando a base no Congresso,
  ou o contrário): só se o jogo pedir, depois de jogar.
- **Gastar capital com o parlamento** (votação, coalizão, cargos): versão 2.
- **Ministros com custo próprio:** fica para quando houver personagens com
  mecânica.

## 7. Aceite e testes

- Mudança com custo maior que o capital é recusada, com o motivo (teste em
  `src/tests/capital.test.ts`).
- O ganho segue a fórmula da seção 4.2: teste com aprovação e base fixas, nos
  turnos com e sem lua de mel, e com ganho que seria negativo.
- O custo segue a seção 4.3: processo, tamanho, resistência e `custoPolitico`
  da ficha, um teste para cada.
- Desfazer devolve o capital.
- O piloto automático continua igual (sem capital, sem decisões).
- Checagem da `diferenciacao-d4.md`: fórmulas, números e textos são nossos, a
  partir das fontes da seção 2.

## 8. Perguntas para você

1. **Opção A (reserva no jogo)?** Recomendo.
2. **Ganho nunca negativo?** Recomendo sim: o governo impopular para de
   ganhar, mas não perde o que guardou.
3. **Negociar com grupo de pressão entra agora** (4.4) ou fica para depois?
   Recomendo entrar agora, porque o V1-09 deixou o espaço pronto.
4. **Os números** (50 inicial, 4 por turno, 12 por lei ordinária, 30 por
   emenda) estão bons para começar? Você ajusta depois de jogar dois mandatos.
