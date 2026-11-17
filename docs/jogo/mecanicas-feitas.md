# Mecânicas feitas

Registro do que já está construído: o que é, como funciona, por que é assim.
Documento de consulta do autor: não precisa ser lido a cada rodada. Cada
mecânica nova fechada ganha uma seção aqui.

Formato de cada seção:
- **O que é**: a mecânica em uma frase.
- **Teoria**: a ideia de jogo por trás (por que existe, que escolha cria).
- **Lógica**: a regra, passo a passo, sem código.
- **Técnica**: onde mora no código e nos dados.

---

## 1. Saúde (fechada em 16/nov/2026)

### O que é
A primeira instituição revista lei por lei. São 11 índices e cerca de 35 leis,
que cobrem rede pública, planos, remédios, profissionais, vacinação e drogas.

### Teoria
- **Toda lei tem dente.** Alguém ganha, alguém perde, custa algo (dinheiro,
  outro índice ou um grupo irritado) e o efeito aparece num número em poucos
  turnos.
- **Os dois lados ganham.** Esquerda (gratuidade, carreira, verba) e direita
  (planos, gestão privada, coparticipação, conta de saúde) chegam a um
  atendimento bom por caminhos diferentes, com custos diferentes. A direita não
  é a "versão ruim": o plano tira gente da fila e não sai do orçamento.
- **O bolso pesa mais que a bússola.** O atendimento entra no padrão de vida de
  cada pop, então a Saúde chega à renda sentida, e não só à ideologia.
- **Resultado emerge.** Nenhuma lei diz "melhora a saúde em X". Ela mexe em
  vagas, profissionais e procura, e a fila sai da conta. A mesma lei rende
  diferente num país com ou sem médicos.

### Lógica
**A rede de atendimento (16 leis):**
1. Quem tem plano ou seguro é atendido primeiro. Paga mais e ocupa mais o
   profissional.
2. A rede pública atende o menor entre três números: quem sobrou, as vagas que a
   verba paga e os profissionais que restam. Hospital sem médico não atende.
3. Quem não é atendido está na fila. O índice Atendimento é essa conta.
4. Cada vaga nova custa mais que a anterior (retorno que cai). Verba a mais vira
   obra, que disputa a construção com casas e água.
5. Vaga paga sem profissional vira dinheiro parado e soma ao índice de desvio.
6. Cada lei mexe numa peça:
   - gratuidade sobe a procura;
   - coparticipação baixa a procura e cobra de quem pode;
   - seguro e conta de saúde pagam pela folha e empurram gente para o
     informal;
   - carreira e gestão esticam o profissional;
   - missões tiram médico do país em troca de dinheiro e reputação;
   - filantropia abre vaga sem verba, mas de modo desigual.
7. **Médico onde falta (17/nov):** só a parte dos profissionais que está onde a
   fila está atende a rede pública. No Brasil é 35%. A verba rende até faltar
   médico no lugar certo; dali em diante o dinheiro a mais vira desvio, e quem
   destrava é levar médico ao interior (médicos para onde falta, serviço
   obrigatório, carreira, telemedicina). A conta de profissionais usa 1 para 77
   pessoas, a média dos países ricos.
8. A Saúde (o quanto o país é saudável) recebe o Atendimento, a Vacinação e o
   Saneamento por deriva. A Expectativa de vida recebe a Saúde.

**As leis soltas (cerca de 19):**
- Mexem direto nos índices, com sinal, força por degrau e a frase do porquê:
  remédios, drogas, jogos, saúde mental e formação de médicos.

**A régua (regra para toda lei de opções):**
- Zero quer dizer que a lei não existe. Não há degrau "nada".
- Os degraus descrevem a política, não o país. O Brasil é só um ponto na régua,
  e nenhum nome de programa brasileiro aparece nos degraus.
- Teste de cada lei: algum país real cai entre dois degraus, depois do último ou
  fora do que o motor representa? Se cai, a régua muda.
- A força sobe em escada (fraca → média → forte), e cada degrau tem ganho e
  perda. Exemplo: aprovar remédio sem análise aumenta o acesso, mas derruba a
  saúde.

**No mapa:**
- O fio de efeito é verde quando ajuda e vermelho quando atrapalha, conforme a
  avaliação do índice (maior é melhor ou maior é pior).
- O fio de pertencer é cinza e fino.
- Os 12 índices que nada mexe ficam fora do mapa até a mecânica deles entrar.

### Técnica
- **Leis:** `src/conteudo/mundo/leis/*.json`. Ida e volta com a planilha por
  `scripts/leis/molde.ts`.
  - O campo `primeiro_degrau_conta` faz o primeiro degrau valer como lei ativa
    (`src/motor/leis/colisao.ts`). Sem ele, o primeiro degrau é "desligada".
  - Força e sinal ficam em `efeitos` de cada opção, e o valor sai por
    `src/motor/leis/valor.ts`.
- **Rede:** `src/motor/atendimento/index.ts`. A regra escrita está em
  `atendimento.md`, ao lado, e os números em
  `src/conteudo/mundo/atendimento/atendimento.json`.
  - O motor lê as leis pelas chaves `lei_*`, e cada opção traz o número em
    `valores` (parte, procura, cobrança, eficiência…).
  - O motor não conhece nome de lei.
- **Índices:** `src/conteudo/mundo/indicadores/variaveis.json`.
  - `avaliacao` dá a cor do fio.
  - `fora_do_mapa` esconde o índice no mapa, pelo filtro de
    `src/partida/visao.ts`.
- **Mapa:** os fios são montados em `src/tela/mapa/organico.ts`, onde o sinal
  vira "ajuda" ou "atrapalha", e desenhados em `src/tela/mapa/fundoDoMapa.ts`.
- **Ícones:** `scripts/icones-leis/leis/saude.ts` liga cada lei a um ícone da
  game-icons. `npm run icones saude` gera os SVG em `src/assets/svg/leis/`, e a
  folha de conferência sai em `docs/arte/folha-de-icones.html`.
- **Revisão detalhada:** índice por índice em `docs/jogo/revisao-indices-saude.md`
  (inclui o que falta ajustar em outras instituições). Os outros índices estão em
  `docs/jogo/revisao-indices.md`.

### Ficou para depois
- Efeito que cresce com o tamanho do problema (por exemplo, pelo número de
  viciados).
- Seta de direção nos fios de efeito.
- Índices de avaliação discutível (Estado na economia, impostos): cor neutra no
  fio, para o mapa não tomar lado.
- Ligações fora da Saúde: drogas → crime, epidemia → PIB, expectativa de vida →
  aposentadoria. A lista está em `revisao-indices-saude.md`.
