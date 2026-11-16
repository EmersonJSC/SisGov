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
- ~~Não consegui ver a inflação subir na tela.~~ Resolvido abaixo.
- **O rombo que cresce na barra do topo (228 → 313 bi parado) são os juros da
  dívida**, não o gasto; ele não sobe a inflação, de propósito.
- Câmbio, crédito e expectativas (o resto do 3.7) continuam fora.
- Os números (0,5; 25%; metade por ano; 100/70/30) são chute de jogo.

## Defeito achado: o arcabouço travava toda verba (15/nov)

**Por que a inflação não subia na tela:** o Brasil começa com o arcabouço fiscal
em vigor, e a punição dele **trava qualquer aumento de verba** quando o teto de
gasto estoura. O teto estourava **no turno 1, parado**, porque as contas do
turno 0 eram feitas antes de a rede de saúde entrar na conta: o gasto parecia
pular 1,1% do PIB de um turno para o outro. **Na prática, no Brasil o jogador
nunca conseguia aumentar verba nenhuma.**

**Conserto:** as contas do turno 0 são refeitas com o estado completo
(`motor/turno/inicio.ts`). Agora turno 0 e turno 1 batem (gasto 27,1%, rombo
das leis +0,41%), o arcabouço não estoura parado, e o "Caixa" do turno 0 fica
certo.

**Na tela, sem Congresso:** Verba da saúde de 4% para 8,6%. A popularidade
subiu na hora (50% → 56%); a inflação foi de 4,8% a 6,9% em ano e meio, o
salário perdeu 1,5%, e a popularidade voltou a 50%. O painel da inflação mostra
os três números. A piora no bolso também fez surgir uma organização radical
no Rio (jornal do turno).

**Erro meu no teste:** na primeira tentativa marquei a caixa "Sem Congresso"
de um jeito que só mudava o desenho, e o jogo continuou com Congresso.

## Índices que nasciam fora do ponto (15/nov, quarta rodada)

Varri os 151 índices com o governo parado: o salto do turno 0 para o turno 1 e
a deriva até o turno 12. Três nasciam fora do ponto, todos pelo mesmo motivo
dos anteriores: o turno 0 era montado em uma ordem diferente da do turno.

| Índice | Salto antes | Causa | Conserto |
|---|---|---|---|
| Déficit da previdência | 50 → 33 | O motor calcula a cada turno (benefício − contribuição, % do PIB × 10), mas o turno 0 usava o valor declarado pelo país | Turno 0 calcula também |
| Desigualdade | −1,2 | A parte da rede de saúde no turno 0 não contava a cobertura e o alcance | Conta os dois |
| Reputação internacional e segurança externa | +1,1 | A reputação do turno 0 era contada antes da rede de saúde (missão médica) | Recontada depois |

**Depois:** nenhum índice do jogo salta mais de 0,3 ponto. Só andam sozinhos o
PIB, os preços, a dívida, os juros e a população, por motivo real. Teste novo
em `src/partida/parado.test.ts`, para não voltar.

**Limites:**
- O Brasil declara `deficit_da_previdencia: 50` em `estado-inicial.json`, mas
  agora o valor declarado é ignorado (vale a conta: 33, ou seja, 3,3% do PIB,
  perto do INSS real). O arquivo do país ficou com um número que não vale.
- Varri só o Brasil, com a semente 42. Outros países podem ter os seus.

## Saúde revista (16/nov, primeira instituição da trilha)

**O que mudou nas leis (aprovado de A a F):**
- **Lei de opções agora pode custar** (tomada `custo`, em % do PIB, somada ao
  gasto). Antes só a régua de verba gastava; 14 leis da Saúde eram de graça.
- **Farmácia popular:** os degraus "diabetes" e "asma" eram um erro da planilha
  (a vírgula de "pressão, diabetes, asma" virou degrau). Agora: nada, desconto,
  lista básica grátis, crônicos grátis (o Brasil), todo remédio grátis. Cada um
  custa e baixa o preço do remédio.
- **Saúde mental e ajuda para comprar plano** custam verba.
- **Idade mínima para drogas** mexe na dependência, não mais no trânsito.
- **Fuga de profissionais:** a carreira segura; o serviço obrigatório empurra.
- **Risco de epidemia** cai com vacinação e saneamento; **expectativa de vida**
  segue a saúde.
- Drogas continuam na Saúde (GDD 4.18: a licença segue o produto).
- Regras do plano ficaram sem dente (pedem uma cesta "plano"): depois-da-v1.

**Medido (sem Congresso, 2 anos):**

| | Aprovação | Gasto | Rombo sem juros | Inflação | Saúde | Operários | Finanças |
|---|---|---|---|---|---|---|---|
| Parado | 50 → 47,6 | 27,2% | +0,35% | 4,8 | 50 | 49 | 35 |
| Esquerda (cobertura total, verba 7%, todo remédio grátis) | 50 → 54 | 30,5% | −3,0% | 6,4 | 57 | 73 | 11 |
| Direita (gestão privada, planos livres, sem farmácia popular) | 50 → 15 | 27,2% | +0,3% | 4,8 | 44 | 2 | 71 |

**Há dente:** as três terminam diferentes, e a esquerda paga em rombo e inflação.

**O que não está bom:**
1. **A direita só perde.** Gestão privada e planos livres não melhoram nada que se
   veja; só a bússola pesa, e muito. A bússola pesa mais que o bolso (GDD 2.4 pede
   o contrário).
2. **A verba demora a aparecer:** atendimento parado em 30 por 14 turnos e depois
   salta para 39,5 de uma vez, quando a obra fica pronta.
3. **Cortar verba abaixo de 4% é recusado** pelo piso da saúde, sem aviso.
