# Teste de jogo — 15/nov/2026

Partida jogada pelo Claude no navegador: Brasil 2026, semente 42, chapa sugerida,
34 ministérios. Mais ou menos 3 anos de mandato.

## O que funciona
- A abertura em 6 passos (país, partido, chapa, governo, ministros, posse) é clara.
- A janela da lei é boa: régua, quanto arrecada, "a receita cai a partir daqui" e
  o efeito em cada grupo (+15 pontos). Dá vontade de mexer.
- O Congresso derrubou o Imposto de renda do rico a 46,5%, com os votos de 10
  partidos. Houve consequência, e o jornal do turno contou o fato.

## Onde o jogo morre (do pior para o menor)
1. **Não fazer nada é a melhor jogada.** Em 3 anos sem lei nenhuma, a
   popularidade subiu de 50% para 56%. O rombo cresceu de 228 para 368 bi e
   nada aconteceu: nenhuma crise, nenhum grupo reclamou.
2. **Os grupos não se mexem.** Os 16 grupos ficaram em 50 do começo ao fim. A
   lei promete +15 pontos, mas o placar nunca mostra o movimento.
3. **O Judiciário interrompe o tempo todo.** Uma vaga no STF a cada 3 ou 4
   turnos, com a Mesa abrindo por cima. Saiu da V1, mas está ligado.
4. **Mais de 150 índices no mapa.** Não dá para saber quais importam. O mapa é
   bonito, mas não diz o que fazer.
5. **O rombo aparece no primeiro turno** ("Governo estoura a regra: Arcabouço
   fiscal") sem o jogador ter feito nada, e depois não pesa em nada.
6. Pequenos: a lista "Leis não promulgadas" sobrepõe as colunas e o clique numa
   lei não abre nada; os botões Programas e Leis ficam por cima das janelas.

## Depois do conserto (15/nov, mesma semente)

- **Judiciário desligado:** 10 turnos sem nenhuma vaga de STF. Liga e desliga
  pelas Opções de teste da posse (Judiciário e Senado).
- **Os grupos se mexem na tela.** O motor já mexia; o mapa mostrava o número
  do turno 0 para sempre. Parado por 10 turnos: aposentados 65, operários 61,
  finanças 37.
- **O bolso chega ao grupo.** A satisfação agora lê o padrão de vida (renda
  menos o gasto com comida e remédios, sem a inflação, mais os serviços).
- **Lei no preço:** Agrotóxicos "livres" (comida −5%) passou na Câmara com 463
  votos. Em 2 turnos: operários 62 → 67, gente do campo 52 → 58, popularidade
  55% → 58%. A janela da lei mostra "No bolso: Comida −5% no preço".

## Limitações e o que melhorar

**O que não foi feito**
- Nada do plano ficou de fora.

**Limites do que foi feito**
- **Só 2 cestas** (comida e remédios). Energia, moradia e transporte ainda não
  pesam no bolso.
- **A diferença de preço não vai para ninguém.** Comida mais cara tira do pop,
  mas o dinheiro não aparece na empresa nem no Estado. Isso fere a regra
  "nenhum dinheiro some" (GDD 3.6) até ser resolvido.
- **As 6 leis ligadas são provisórias** e os números são chute de jogo:
  imposto sobre consumo, imposto sobre remédio, teto do preço dos remédios,
  troca pelo genérico, inspeção de alimentos e agrotóxicos. A etapa das leis
  decide se o fio fica.
- **A prévia de "Apoio dos grupos" na janela da lei só mostra a parte da
  bússola**, não o que o bolso vai fazer. O jogador vê "+2,6" e depois o grupo
  sobe 5.
- **O texto "Como chega a você: por enquanto só mexe nos índices"** continua
  nessas 6 leis, mas agora elas chegam ao bolso.
- **Duas coisas parecidas:** o índice "Preço da comida" (já existia, por
  efeito) e a tomada de preço da cesta (nova). Na etapa das leis, decidir se
  viram uma só.
- **Sem memória:** tirar e dar pesam igual (GDD 2.4 pede que tirar doa mais).
- **O Judiciário continua só na tela.**
- **"Teto do preço dos remédios" tem a bússola invertida** (teto livre aparece
  como esquerda).

**O que melhorar depois, por ordem de impacto na diversão**
1. **Ficar parado ainda dá lucro:** em 10 turnos sem lei, a popularidade foi
   de 50% para 54%. Os serviços sobem sozinhos (Atendimento de 30 para 40 em
   4 anos sem lei, já anotado) e o rombo de 228 para 313 bi não pesa em
   ninguém. É o próximo ponto morto.
2. A prévia dos grupos somar o bolso, para o jogador saber antes de assinar.
3. Memória: cortar dói mais do que dar agrada.
4. Mais cestas no bolso (energia e moradia primeiro).
5. Para onde vai o dinheiro do preço (3.6).

## Ficar parado (15/nov, segunda rodada)

**Causa:** a rede de saúde começava o jogo "fora do ponto". Três números do
turno 0 nasciam em zero e iam até o alvo das leis que o Brasil **já tem**, como
se essas leis tivessem acabado de ser aprovadas:
- `alcance` (Telemedicina e Serviço obrigatório) e `cobertura` (atenção
  básica): o Atendimento subia sozinho, 30 → 36 em 10 turnos;
- `fraqueza` (pontos da rede na saúde): a Saúde saltava 50 → 59 no turno 1.

Isso agradava operários, aposentados, educação e saúde e quem está sem
trabalho, e a popularidade subia sem o jogador fazer nada.

**Conserto:** o turno 0 já nasce no ponto das leis em vigor (`motor/atendimento`
› `atendimentoInicial`, `motor/turno/inicio.ts`). Teste novo:
`src/partida/parado.test.ts`.

**Resultado na tela (mesma semente):** parado por 10 turnos, a popularidade vai
de **50% para 48%** (antes ia para 54%). Saúde e Atendimento ficam parados.

**Limites:**
- A queda parado é pequena (−2 em 20 meses). Vem do desgaste e de Finanças
  cobrando a dívida. O rombo (228 → 313 bi) ainda não pesa no bolso de ninguém.
- Outros índices podem ter o mesmo defeito de "nascer fora do ponto". Só a
  rede de saúde foi medida e consertada.

## O rombo pesa no bolso (15/nov, terceira rodada)

**Como era:** a inflação ficava fixa em 4,8%, e preço e salário subiam juntos.
O rombo só subia os juros, e devagar.

**O que mudou (GDD 3.7):**
1. **Rombo vira inflação.** Cada 1% do PIB de rombo sem juros (primário)
   acima do turno 0 soma 0,5 ponto à inflação-alvo. A inflação anda 25% do
   caminho por turno. Os juros já reagiam à inflação e sobem juntos.
2. **O salário corre atrás.** A inflação acima da normal vira perda no poder
   de compra, que volta pela metade a cada ano. O pobre sente inteira, a classe
   média 70% e o rico 30%. A perda entra no padrão de vida e chega aos grupos.
3. **Na tela:** "Inflação" na barra do topo, com hoje, normal do país e
   salário comido.

Os números ficam em `src/conteudo/mundo/fisco/fisco.json › inflacao` e se
ajustam sem mexer no código.

**Medido (sem Congresso, mesma semente):**
- Parado: a inflação fica em 4,8% o mandato todo.
- Imposto sobre consumo de 17% para 7%: a popularidade sobe na hora (49,8% →
  52,7%); a inflação vai a 7% em um ano, o salário perde 3%, e em 4 anos a
  vantagem some (46,4% contra 46,8% de quem não cortou).
- Verba da saúde de 4% para 8,6%: rombo −4,25% do PIB, inflação 7%.

**Dois consertos no caminho:**
- Primeiro usei o rombo com juros, e virou espiral (inflação → juros → rombo →
  inflação: 9,6% e juros de 22% em 4 anos). Troquei pelo rombo sem juros, que
  é o que as leis do jogador mexem.
- O rombo do turno 0 era contado antes da rede de saúde entrar na conta, e a
  inflação lia isso como gasto novo. A base agora sai do turno 0 completo.

**Limites:**
- **Não consegui ver a inflação subir jogando na tela.** Mandei a verba da
  saúde maior, mas ela não entrou (provavelmente o Congresso barrou; não
  confirmei se a caixa "Sem Congresso" ficou marcada). A mecânica está provada
  pelos testes (`src/partida/rombo.test.ts`) e pela medição acima.
- **O rombo que cresce na barra do topo (228 → 313 bi parado) são os juros da
  dívida**, não o gasto; ele não sobe a inflação, de propósito.
- O "Caixa" do turno 0 mostra o rombo contado antes da rede de saúde (1,5% de
  sobra no turno 0, 0,4% no turno 1).
- Câmbio, crédito e expectativas (o resto do 3.7) continuam fora.
- Os números (0,5; 25%; metade por ano; 100/70/30) são chute de jogo.
