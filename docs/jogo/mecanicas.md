# Mecânicas do SisGov

> **Para que serve:** o jogo inteiro dividido em mecânicas e submecânicas, com
> o que cada uma já tem e tudo o que ainda precisa ser pensado. A gente
> trabalha uma mecânica por vez: o autor escolhe, o plano dela sai daqui, o
> autor aprova de uma vez e a mecânica é construída até o fim.
>
> **De onde saiu (14/nov/2026):** GDD (`gdd.md`), requisitos (`requisitos.md`),
> as planilhas `gdd.xlsx` e `leis.xlsx`, e o código em `src/motor/`.
>
> **Legenda:** ✅ feito · ◐ pela metade · ☐ falta. **R** = requisito em
> `requisitos.md`. **A pensar** = decisão ou detalhe que ainda não tem resposta.

## Índice

| #   | Mecânica             | Submecânicas | Situação                                           |
| --- | -------------------- | ------------ | -------------------------------------------------- |
| 1   | Partida e turno      | 5            | quase pronta                                       |
| 2   | Bússola              | 3            | pronta no básico                                   |
| 3   | Opinião              | 4            | não existe; cada peça faz do seu jeito             |
| 4   | População            | 6            | base existe; falta demografia, saída, organizações |
| 5   | Economia             | 12           | o maior buraco                                     |
| 6   | Leis                 | 7            | 512 leis no jogo, sem padrão                       |
| 7   | Índices              | 5            | 147 índices, 127 sem saída                         |
| 8   | Contas do Estado     | 5            | básico feito; falta o caminho do dinheiro          |
| 9   | Governo (Executivo)  | 6            | meio caminho                                       |
| 10  | Judiciário           | 7            | tribunais, vaga e presidente feitos                |
| 11  | Congresso            | 8            | a mais pronta                                      |
| 12  | Perder o poder       | 6            | só a eleição funciona                              |
| 13  | Partido              | 5            | nada                                               |
| 14  | Eleição e campanha   | 7            | voto e dois turnos feitos                          |
| 15  | Mídia                | 10           | só o jornal                                        |
| 16  | Mundo                | 8            | potências inventadas                               |
| 17  | Mesa                 | 7            | papéis de lei e vaga                               |
| 18  | Tela                 | 6            | mapa feito                                         |
| 19  | Narrativas e eventos | 3            | depois de tudo                                     |

---

## 1. Partida e turno

O esqueleto: escolher o país, montar o começo, passar turnos, acabar.

### 1.1 Começo da partida

- **Já tem:** país → partido → chapa → governo → ministros → iniciar (R4.5,
  R4.6, R4.8, R4.10). Partido novo com 6% das cadeiras; o antigo governo vai
  para a oposição ou para a coligação (R4.9 ◐).
- **A pensar:**
  - A Aprovação começa alta ("presidente popular"): de quanto e quanto tempo
    dura a lua de mel?
  - A história de entrada ("você surge no meio da polarização") aparece como
    texto, tela ou só nos números?
  - Escolher outros países: só o Brasil 2026 existe; o que um país precisa
    declarar para ser jogável (lista de arquivos obrigatórios)?

### 1.2 Turno

- **Já tem:** 2 meses, mandato de 24 turnos, efeitos com atraso (R4.1, R4.2).
  Ordem das etapas em `motor/turno`.
- **A pensar:**
  - A ordem das etapas fica certa quando entrarem mídia, organizações e
    mundo? (quem lê o fato de quem no mesmo turno)

### 1.3 Fatos do turno

- **Já tem:** mesa de fatos que somem em 1 a 3 turnos (R4.12). Escrevem
  Congresso, política, judiciário.
- **A pensar:**
  - Quais mecânicas ainda não escrevem fato (ministro, instituição, economia,
    mundo) e quais fatos cada uma precisa.
  - Fato gera fato: regras de encadeamento (escândalo → CPI → queda).

### 1.4 Fim e placar

- **Já tem:** acaba pela eleição (R4.4 ◐).
- **Falta:** os outros caminhos (mecânica 12) e o placar final (R4.7 ☐).
- **A pensar:** o que o placar mostra (tempo no poder, país deixado: quais
  números, comparados com o começo?).

### 1.5 Salvar e carregar

- **Já tem:** salva sozinho, menu no brasão (R17.3, R17.23).
- **A pensar:** partida salva antiga quando o formato muda (hoje se perde ou
  se remenda no código).

---

## 2. Bússola

A régua comum de tudo: dois eixos de −1 a +1.

### 2.1 Eixos

- **Já tem:** econômico e social (R8.1).
- **A pensar:** entra um terceiro eixo (paz × militarismo)? Precisa de estudo
  (GDD §18).

### 2.2 Posição de cada ator

- **Já tem:** leis, partidos, grupos, pops, potências, ministros, juízes
  (R8.2). País = média das leis com peso (R8.3). Quem gosta sai da distância
  (R8.4).
- **Falta:** mídias e organizações com posição usada no motor.

### 2.3 Padrões

- **Falta:** o jogo percebe "corte de gastos" sem lei com esse nome (R8.6 ☐).
- **A pensar:** quais padrões existem, quem lê (mídia, grupos) e o que causam.

---

## 3. Opinião

Ideia do autor (13/nov): hoje gostar e não gostar está espalhado (satisfação
dos grupos, termômetro dos partidos, lealdade que nada lê; juízes, mídia e
ministros sem nada). Uma régua só para todo ator. **Desenhar antes das leis
padronizadas**, porque a lei vai dizer em que mexe nessa régua.

### 3.1 A régua comum

- **A pensar:**
  - Quem tem: grupo, partido, ministro, juiz, mídia, potência, governador,
    organização.
  - De que partes é feita: ideologia (bússola), interesse (renda, ganho do
    grupo), memória dos fatos.
  - Escala (0 a 100? −100 a +100?) e se substitui satisfação, termômetro e
    opinião das potências ou fica por cima.

### 3.2 Memória

- **A pensar:** o que fica lembrado (traição, promessa, programa, escândalo),
  com que força e em quanto tempo some.

### 3.3 Faixas que destravam ação

- **A pensar:** em cada faixa o ator apoia, cobra, protesta ou trai. Quais
  ações cada tipo de ator tem em cada faixa.

### 3.4 Na tela

- **A pensar:** como o jogador vê a opinião de cada ator sem virar painel.

---

## 4. População

Os pops no centro do jogo; grupos e organizações em cima deles.

### 4.1 Pops

- **Já tem:** pops com bússola, mudam de setor estudando e de estrato (R11.5,
  R11.6, R11.7).
- **Falta:** os 32 tipos em 4 blocos com crianças (R11.12 ☐); dados dentro do
  pop (idade, campo/cidade, vínculo, escolaridade, patrimônio, nascido fora)
  (R11.8 ☐).
- **A pensar:** quantos tipos rodam de verdade no motor sem pesar; como a lei
  mira "idosos do campo" sem multiplicar pops.

### 4.2 Renda do pop

- **Já tem:** renda ainda é parte fixa do PIB (R11.1 ◐).
- **Falta:** renda de salário, lucro, aluguel e transferência (R16.26 ☐).
- **A pensar:** como sair da parte fixa sem o turno 0 mudar de valor (GDD §18).

### 4.3 Vida (demografia)

- **Falta:** nascer, envelhecer, morrer (R11.9 ☐).
- **A pensar:** números de natalidade e mortalidade; como mexem em
  Previdência, escola e saúde; faixas de idade dentro do pop.

### 4.4 Grupos de interesse

- **Já tem:** bússola, tamanho, satisfação, radicais e lealistas (R11.2,
  R11.3). Satisfação lê renda, índices e leis (R11.4 ◐). Raiva separada da
  satisfação (R11.19 ◐).
- **Falta:** 25 grupos atravessando os pops (R11.13 ☐); grupo forte torna
  populares as leis perto dele (R11.11 ☐).
- **A pensar:** como medir a força de um grupo (gente e dinheiro) e quanto
  ela muda a popularidade de uma lei.

### 4.5 Saída

- **Falta:** o insatisfeito vai para a informalidade, tira o dinheiro do país
  ou emigra (R11.10 ☐).
- **A pensar:** o que leva a cada caminho e com que números.

### 4.6 Organizações

- **Falta:** tudo (R11.14 a R11.18 ☐).
- **Submecânicas a desenhar:**
  - **Gerador:** nascem de radicais de vários grupos próximos; nome, líder,
    alvo, objetivo.
  - **Organização política:** gente, dinheiro, armas, poder; ameaça pequena a
    crítica; limite de cada grupo (pacifista no máximo vai à rua).
  - **Crime organizado:** nasce do mercado ilegal, presídio lotado, favela,
    falta de Estado.
  - **Organizações legais:** igrejas (vertente e engajamento), sindicatos,
    associações.
  - **Financiamento e rastro:** países, empresas, doadores; investigação.
  - **Presos com nome:** líder preso vira preso político; Anistia e Graça.
- **A pensar:** regras e números de nascer e crescer; ações de cada tipo;
  como o jogador enfrenta (polícia, inteligência, negociação).

### 4.7 Lugar (estados)

- **Falta:** pops por estado (R11.17 ☐; medido possível em 12/nov).
- **A pensar:** se entra na V1 ou depois; o que depende disso (voto por
  estado, energia, governadores).

---

## 5. Economia

Um dos três pilares. O jogador cria condições; quem produz é a economia.

### 5.1 Mercado e produtos

- **Já tem:** produtos em setores, mercado do país e do mundo (R16.1);
  demanda dos pops e fome (R16.2).
- **Falta:** cadeia entre setores completa (R16.5 ◐); setores com regra
  própria: remédios, militar (R16.6 ☐).

### 5.2 Prédios e obras

- **Falta:** prédios produzem, empregam e dão lucro, PIB é a soma (R16.7 ☐);
  obra com custo e prazo em fila (R16.8 ☐); corrupção atrasa obra (R16.10 ☐).
- **A pensar:** custo e prazo de cada tipo de obra; duas filas (pública e
  privada) na mesma capacidade; lei Prioridade das obras.

### 5.3 Trabalho e salário

- **Falta:** falta de trabalhador freia a produção e o desemprego sai daí
  (R16.27 ☐); contratação por qualificação (R16.37 ☐).
- **A pensar:** quanto a falta de gente freia; salário que cai devagar
  (prédio demite antes).

### 5.4 Lucro e donos

- **Falta:** caminho do lucro (R16.9, R16.12, R16.33 ☐); reserva privada abre
  obras (R16.13 ☐).
- **A pensar:** quanto do lucro vai aos investidores e quanto à reserva; os 5
  tipos de dono (Estado, privado, estrangeiro, cooperativa, sem lucro).

### 5.5 Consumo

- **Falta:** quem compra (pops, mercados, prédios, Estado, exterior)
  (R16.36 ☐); cesta por estrato.

### 5.6 Companhias e estatais (operações)

- **Já tem:** empresas declaradas pelo país (R16.11 ◐).
- **Falta:** estatizar, privatizar, criar estatal, cooperativa, comprar cotas,
  como Operação com 3 papéis na mesa (R16.14 ☐); lista de companhias.
- **A pensar:** leilão (preço mínimo, compradores); oferta pública × obrigar a
  vender; quem reage (acionistas, país do dono).

### 5.7 Dinheiro

- **Já tem:** inflação que se move (R9.3 ◐).
- **Falta:** crédito dos bancos (R16.38 ☐); câmbio, regime e reservas
  (R16.39 ☐).
- **A pensar:** Banco Central com autonomia por lei; câmbio como corredor
  (quando bate na parede, o jogador decide); crises do dinheiro como eventos
  (corrida ao banco, ataque à moeda).

### 5.8 Bolsa (Pregão)

- **Já tem:** protótipo na tela (R16.15 ◐).
- **Falta:** preço = lucro × múltiplo × humor (R16.16, R16.34 ☐); investidores
  e quebra (R16.35 ☐); bolsa sem o governo (R16.29 ☐); ações no patrimônio
  dos pops (R16.28 ☐).

### 5.9 Moradia e terra

- **Já tem:** déficit, preço e favela; casas vazias calculadas pela moradia
  (R16.19, 14/nov).
- **Falta:** estoque local em faixas (R16.17 ☐); quem constrói (R16.18 ☐);
  4 alavancas da cidade (R16.20 ☐); terra rural e êxodo (R16.21 a R16.24 ☐);
  fila de terras (vistoria → assentamento → título).
- **A pensar:** velocidade do êxodo, custo da casa, ritmo da autoconstrução;
  se o êxodo é índice ou só gente mudando de pop.

### 5.10 Energia

- **Já tem:** capacidade contra demanda (R16.3).
- **A pensar:** energia por estado e apagão como evento; encomendar usina
  (Operação); cada fonte como aposta; comércio de energia com vizinhos;
  urânio.

### 5.11 Comércio exterior

- **Já tem:** tarifa, subsídio e acordo pela metade (R16.4 ◐).
- **A pensar:** régua por setor; sanção que passa pelo mercado (com o Mundo).

### 5.12 Setores com mecânica própria (GDD §16)

Cada um precisa de plano quando for a vez, já desenhados no GDD:
Agricultura e pesca (comida cara), Ciência (nível de tecnologia próprio e
emprestado, programa espacial), Meio ambiente (órgão e licença), Construção
civil (duas filas), Transporte, Cultura e patrimônio (fila), Defesa civil
(desastre × preparo), Minério e petróleo.

- **A pensar:** a **fila genérica** (serve a Terra, Patrimônio e processos do
  Judiciário) deve nascer uma vez só.

### 5.13 Serviços do Estado

- **Falta:** hospital, escola, delegacia como prédios fora do mercado
  (R16.31 ☐); terceirizar por lei (R16.32 ☐).

---

## 6. Leis

O núcleo do governo. 512 leis no jogo, mas sem padrão.

### 6.1 Formato e padronização

- **Já tem:** duas camadas, régua e degraus, efeito/força/atraso/bússola
  (R7.1, R7.2); validador (R7.3); formas especiais (R7.15).
- **Falta:** leis refeitas instituição por instituição a partir da
  `gdd.xlsx` (R7.22 ☐); exportador novo da planilha (R4.11 ☐).
- **A pensar:** o molde único de uma lei (quais campos); a ordem das
  instituições; o que fazer com as 100 leis que não mexem em nada.

### 6.2 Roteiro da lei (8 passos)

- **A pensar:** entrada → filtro → prédio → pop → economia → índices →
  política → conta. Toda lei chega ao pop (R7.12 ◐): hoje quase todas só
  mexem em índice.

### 6.3 Lei age pelo órgão

- **Falta:** a regra funciona na medida da verba da instituição (R7.11 ☐).

### 6.4 Tipos

- **Falta:** Lei com prazo, Ato, Posição por país, Operação (R7.16 ☐).
- **A pensar:** como cada tipo aparece (bolha com relógio, botão, menu do
  país, lista de companhias).

### 6.5 Colisão e revogar

- **Já tem:** colisão (R7.9).
- **Falta:** revogar com voto (R7.8 ☐).

### 6.6 Programas

- **Já tem:** 73 programas formam-se pelas leis (R7.18); passo do ministro
  mais fraco (R7.21).
- **Falta:** lembrança e nostalgia pesando no voto (R7.19 ◐); nome pelo
  gerador e rebatizar (R7.20 ◐).

### 6.7 Processos

- **Já tem:** índice que anda sozinho (R7.10).
- **A pensar:** quais temas são processo (reforma agrária, moradia, terras) e
  quais leis empurram cada etapa.

---

## 7. Índices

147 índices de jogabilidade; todo índice tem dono desde 14/nov.

### 7.1 Dono

- **Já tem:** instituição, poder ou país (passo A, 14/nov).

### 7.2 Efeito de cada índice (passo B)

- **Falta:** 127 índices não levam a nada (R9.4 ◐).
- **A pensar:** para cada índice, o que ele muda no país (além da cobrança
  dos grupos). Planilha `leis.xlsx`, aba Índices, coluna Efeito proposto.

### 7.3 Visível e invisível

- **A pensar:** quais o jogador vê e quais só sente pelo que acontece.

### 7.4 Principais

- **Já tem:** 6 principais marcados (R9.8).
- **A pensar:** os subíndices embaixo de cada principal e como somam.

### 7.5 Gatilhos

- **A pensar:** limites que disparam narrativas; só depois do motor pronto.

---

## 8. Contas do Estado

### 8.1 Receita, gasto, cofre e dívida

- **Já tem:** separados (R10.1); juros sobem com dívida e inflação (R10.2);
  regra fiscal (R10.3).
- **A pensar:** calibrar (juros comem 16% do PIB e a dívida vai de 78% a 107%
  em 24 turnos, R4.3).

### 8.2 Caminho do dinheiro

- **Falta:** impostos → Tesouro → verba por lei → máquina do ministério →
  filtro da corrupção → instituição → população (R10.7 ☐).
- **A pensar:** custo fixo por ministério e por cargo (sem ele, governo
  Inchado não tem desvantagem); quanto a corrupção some de verdade; o
  dinheiro "fora das leis" de hoje.

### 8.3 Emissão e calote

- **Falta:** emissão de moeda (R10.5 ☐); calote (R10.6 ☐).

### 8.4 Bens do Estado

- **A pensar:** estatais e ações rendendo ao cofre e podendo ser vendidas
  (ligado a 5.6).

### 8.5 Moeda do país

- **Já tem:** em parte (R10.4 ◐).

---

## 9. Governo (Executivo)

### 9.1 Presidente e vice

- **Falta:** a ficha do presidente pesar (carisma na aprovação, honestidade no
  escândalo, habilidade no Congresso) (R6.2 ☐).

### 9.2 Pessoas

- **Já tem:** gerador; nomes do país (R6.6 ◐); perfil de rede social (R6.11 ◐).
- **Falta:** envelhecer, aposentar e morrer para todos (hoje só juízes).
- **A pensar:** fichas declaradas pelo país, com nomes parecidos com os reais
  (como os juízes, 14/nov), também para políticos?

### 9.3 Ministros

- **Já tem:** ficha (R6.7); sorteio e troca (R6.26, R6.24 ◐); a ficha muda
  força, atraso e rendimento (R6.8 ◐).
- **Falta:** fatos do ministro: escândalo, crise, demissão barulhenta, vira
  candidato (R6.9 ☐).

### 9.4 Ministérios (caixas)

- **Já tem:** régua de tamanho e caixas no começo (R6.25, R6.14 ◐).
- **Falta:** lei Organização dos ministérios (escada de 4 degraus); toda caixa
  custa estrutura e agrada quem é parecido com o ministro (R6.15 ◐).

### 9.5 Instituições

- **Já tem:** 36, verba, necessidade, rendimento, corrupção (R6.10, R6.16,
  R6.17); ficha só de leitura (R6.18 ◐).
- **Falta:** instituições sem lei (Estados e municípios, Religião, Turismo,
  Indústria; Funcionalismo com uma).
- **A pensar:** Estatística (parar de medir, esconder, mentir nos números).

### 9.6 Governadores

- **Falta:** tudo (R6.23 ☐): partido, bússola, termômetro; verba rende mais
  com aliado; pedidos na mesa; campanha no estado.

---

## 10. Judiciário

Um dos Três Poderes, no miolo, sem ministro.

### 10.1 Tribunais e juízes ✅ (14/nov)

- O país declara os tribunais (função genérica; o rótulo é do país). Brasil:
  STF (11) e TSE (só presidente). STF declarado com nomes parecidos com os
  reais, idade, tempo de casa e partido de origem.

### 10.2 Vaga e indicação ✅ (14/nov)

- Aposentadoria abre vaga; lei "Quem escolhe os juízes" (carreira, Senado,
  livre); papel importante com 3 cartas; o Senado vota.
- **A pensar:** a base do governo tem 60 de 81 senadores e aprova quase todo
  aliado; o voto deve pesar mais a distância?

### 10.3 Presidente da corte ✅ (14/nov)

- Mandato de 2 anos, o mais antigo que ainda não presidiu; o TSE vem do STF.
- **A pensar:** o presidente da corte faz alguma coisa no jogo (pauta da
  fila, 10.4)?

### 10.4 Fila de processos

- **Falta:** tudo (R6.20 ◐). Pouca verba, fila lenta e o caso prescreve.
- **A pensar:** a fila genérica (5.12); de onde vêm os processos; quem os
  julga; o que o jogador vê ("320 processos · 2 seus").

### 10.5 Caso em etapas

- **Falta:** rastro → investigação → processo → sentença; foro especial;
  delação.
- **A pensar:** condena se a prova existe, conforme a independência; vale
  para papel duvidoso, líder de organização e escândalo de ministro.

### 10.6 Suspender lei

- **Falta:** a corte suspende lei que bate em direito (R6.22 ◐).
- **A pensar:** quais leis "batem em direito" (marca na lei?); chance pela
  distância entre a corte e a lei; o presidente aceita, aumenta a corte,
  pressiona ou ignora (crise institucional).

### 10.7 Corrupção em cadeia

- **Falta:** o rastro nunca some; a chance de achar usa a independência de
  hoje (R6.21 ☐).

---

## 11. Congresso

A mecânica mais pronta. O jogador junta votos.

### 11.1 Voto e placar ✅

- Placar previsto = real, sem sorteio; nota por partido; fiéis e livres;
  quórum por classe; duas casas (R12.1, R12.11 a R12.14, R12.7).

### 11.2 Coligação ✅

- Convidar, sair, voltar pelo termômetro (R12.3, R12.16).

### 11.3 Moedas

- **Já tem:** em parte (R12.4 ◐).
- **A pensar:** quais das 6 cobram depois de verdade (ceder, ministério,
  cargos, emenda, promessa, decreto); preço que sobe a cada compra.

### 11.4 Paciência, termômetro e carga ✅

- (R12.16, R12.17, R12.18)

### 11.5 Decreto

- **Já tem:** em parte (R12.19 ◐).
- **A pensar:** fato consumado (derrubar custa a quem derruba); alcance em 4
  degraus pela lei Poder de decreto.

### 11.6 O Congresso age sozinho

- **Falta:** rejeitar, emendar, propor lei popular, travar a pauta, CPI
  (R12.5, R12.10 ☐).

### 11.7 Bancadas e lobby

- **Falta:** bancadas temáticas e lobby das companhias (R12.15 ☐).

### 11.8 Sistemas de governo

- **Falta:** parlamentarismo, semipresidencialismo, partido único (R12.8 ☐);
  cadeiras mudam com a eleição (R12.9 ☐).

---

## 12. Perder o poder

Hoje só a eleição acaba a partida (R4.4 ◐, R6.13 ☐).

### 12.1 Sucessão

- **Falta:** morte, assassinato, renúncia; o vice assume (R6.3 ☐).
- **A pensar:** chance de cada um pelo país (idade, radicais, segurança).

### 12.2 Impeachment

- **Falta:** fato grave, aprovação abaixo de 30%, 2/3; o Senado julga (R6.5 ☐).

### 12.3 Moção de desconfiança

- **Falta:** só no parlamentarismo (depende de 11.8).

### 12.4 Golpe

- **A pensar:** Risco de golpe, Forças Armadas pouco leais.

### 12.5 Caminho autoritário e guerra civil

- **Falta:** cada passo autoritário sobe a raiva; sem armas leais, sobe o
  Risco de golpe; guerra civil racha por estados (R6.19 ☐).

### 12.6 Ala rival (partido único)

- **Falta:** congresso do partido, expurgo (depende de 11.8).

---

## 13. Partido

O jogador é o partido. Nada feito (R5.1 a R5.5 ☐).

### 13.1 Ficha do partido

- Bússola (da chapa), base, cadeiras, caixa, desgaste, coesão.

### 13.2 Coesão e identidade

- Governar longe da base derruba a coesão; deputados do próprio partido
  votam contra.
- **A pensar:** quanto longe é longe; quanto o partido pode andar na bússola
  por mandato.

### 13.3 Presidente do partido

- Pesa na negociação e na campanha; troca custa coesão.

### 13.4 Caixa

- Entra por financiamento (lei), sai na campanha; doação privada traz
  interesse.

### 13.5 Mesa do partido

- Doador, filiação, expulsar ou perdoar, coligação (R17.10 ☐).

---

## 14. Eleição e campanha

### 14.1 Mandatos ✅

- Duração e reeleição pela lei do país (R13.1).
- **Falta:** limite de reeleição troca o candidato (R13.4 ☐).

### 14.2 Chapa da reeleição

- **Falta:** candidato e vice entre fichas do partido e aliados (R13.5 ☐).

### 14.3 Coligação eleitoral

- **Falta:** soma TV, caixa e eleitores; cobra lugar (R13.6 ☐).

### 14.4 Campanha

- **Falta:** ações com alvo pagas pelo caixa (comício, TV, redes, debate,
  promessa); rendimento cai ao repetir (R13.7 ☐).

### 14.5 Voto

- **Já tem:** voto por satisfação (R13.3 ◐); adversários; dois turnos (R13.9,
  R13.10).
- **Falta:** bússola dos candidatos, campanha e mídia no voto.

### 14.6 Promessa

- **Já tem:** em parte (R13.11 ◐).

### 14.7 Desgaste

- **Já tem:** sobe sempre (R13.2).
- **Falta:** reduzir o desgaste (R13.8 ☐).

---

## 15. Mídia

Hoje só existe o jornal do turno (R14.4) e as mídias declaradas (R14.1 ◐).
Nenhuma notícia mexe em nada (GDD §18).

### 15.1 Emissoras

- **O que é:** as 8 maiores do país, com dono (privado, estatal,
  estrangeiro), bússola, audiência por grupo e credibilidade.
- **Já tem:** declaradas (R14.1 ◐).
- **A pensar:**
  - Dono que muda de lado: a posição anda para a do novo dono; redação forte
    freia.
  - Emissora estatal (audiência própria, credibilidade baixa).
  - Mídia é empresa: lucro, dono, comprada na bolsa (liga a 5.6 e 5.8).
  - Nomes parecidos com os reais, como os juízes?

### 15.2 Noticiário (jornal)

- **Já tem:** as 3 maiores manchetes do turno (R14.4).
- **Falta:** pauta (cada mídia escolhe uns 3 fatos pelo tamanho, lado, dono e
  medo) (R14.3 ☐); enquadramento (o efeito da lei na opinião passa pela
  mídia) (R14.2 ☐).
- **A pensar:** como o jornal mostra a mesma notícia por mídias diferentes.

### 15.3 Rede social das emissoras

- **O que é:** o perfil da emissora e dos jornalistas dela, com o que andam
  postando sobre o país.
- **A pensar:** de onde saem os posts (dos fatos e da pauta); se é a mesma
  rede do perfil das pessoas (9.2).

### 15.4 Redes sociais (sem dono)

- **Falta:** rápidas, polarizam, boato com instrução baixa (R14.6 ☐).

### 15.5 Fato e versão

- **Falta:** versão fiel, enviesada ou falsa; mentira descoberta derruba a
  credibilidade (R14.10 ☐).
- **A pensar:** a regra da descoberta (serve também ao rastro de corrupção e
  ao Espiar).

### 15.6 Escândalo e vazamento

- **A pensar:** escândalo em ciclo (semente, investigação, publicação,
  repercussão, desgaste, esquecimento); vazamento (fonte, jornalista,
  publicação).

### 15.7 Jornalistas

- **A pensar:** perfis, redação forte ou fraca, investigativo; ameaçado,
  preso, agredido.

### 15.8 Mídia muda o lado do pop

- **Falta:** devagar, em anos; bolha; freio da instrução (R14.8 ☐).

### 15.9 Mídia mobiliza a raiva

- **Falta:** repetir um fato contra o grupo sobe a raiva (R14.9 ☐).

### 15.10 Atos do presidente e leis de mídia

- **Falta:** entrevista, pronunciamento, coletiva, pressionar o dono, plantar
  notícia (R14.11 ☐); publicidade, emissora estatal, regulação, censura
  (R14.5 ☐).
- **A pensar:** custo e duração de cada ato (GDD §18, para as narrativas).

---

## 16. Mundo

Hoje: potências inventadas com bússola e opinião (R15.1, R15.2, R15.3 ◐).

### 16.1 Países reais

- **Falta:** os 30 maiores, vizinhos e resto do mundo (R15.7 ☐).

### 16.2 Ficha leve

- **Falta:** economia resumida, governo, regime, poder militar, jeito
  (R15.8 ☐).

### 16.3 IA dos países

- **Falta:** 3 passos por turno com o cardápio (comércio, dinheiro,
  segurança, palavra); linhas vermelhas; um degrau por vez (R15.9 ☐).

### 16.4 Governos que já existiram

- **Falta:** a cada eleição o novo governo cai perto de um ponto da história
  (R15.10 ☐).

### 16.5 Posições por país

- **Falta:** menu do país (acordo, aliança, sanção, base, ajuda…) (R15.11 ☐).

### 16.6 Sanção pelo mercado

- **Falta:** R15.4 ☐ (liga a 5.11).

### 16.7 Ataque externo

- **Falta:** o país pode ser atacado e não revida (R15.5 ☐).
- **A pensar:** como um ataque acontece e como termina.

### 16.8 Tela do Mundo

- **Falta:** ranking com a relação e a ficha do país (R15.12 ☐).

---

## 17. Mesa

O que os outros põem na frente do jogador.

### 17.1 Carimbos

- **Já tem:** assinar, vetar com observação, recusar, pilha (R17.6 ◐).
- **Falta:** encaminhar ao ministro, que decide pela ficha (R17.8 ☐).

### 17.2 Famílias de papel

- **Já tem:** leis e vaga de juiz (R17.7 ◐).
- **Falta:** crises, pedidos, ofertas, instituições, partido.

### 17.3 Prazos

- **Já tem:** papel de lei vale 1 turno (R17.13 ◐).
- **Falta:** crise que piora, aliado que se afasta.

### 17.4 Situações (crises)

- **A pensar:** saem dos dados (enchente, greve, banco quebrando, apagão);
  2 ou 3 respostas com ganho e custo. Cada setor da 5.12 já tem os seus
  papéis desenhados no GDD.

### 17.5 Papéis duvidosos

- **Falta:** a porta da corrupção; rastro (R17.14 ☐).

### 17.6 A mídia lê a mesa

- **Falta:** vetar lei popular vira manchete (R17.9 ☐).

### 17.7 Papel importante ✅ (14/nov)

- Abre a mesa sozinho e o botão pulsa (vaga de juiz).

---

## 18. Tela

### 18.1 Mapa ✅

- Mapa orgânico; prioridade visual; alertas; navegação (R17.1, R17.12,
  R17.17 a R17.22). Miolo: trindade, STF e TSE, Congresso; índices do país num
  anel por fora (14/nov).

### 18.2 Fichas

- **Falta:** atributos nas fichas (R17.4 ◐, R6.1 ◐).

### 18.3 Causa e efeito

- **Já tem:** em parte (R17.15 ◐).
- **Falta:** "a conta que vem" na lei; prévia de quem ganha e perde (R17.5 ◐).

### 18.4 Momentos do partido

- **Falta:** telas curtas de chapa, coligação, campanha (R17.11 ☐).

### 18.5 Listas

- **A pensar:** lista de companhias, tela do Mundo, mapa elétrico; como cabem
  sem virar painel.

### 18.6 Retratos

- **A pensar:** o autor não gostou dos retratos genéricos (R6.1 ◐).

---

## 19. Narrativas e eventos

Só depois do motor e dos índices prontos (decisão do autor).

### 19.1 Gatilhos

- Índice que passa de um limite dispara narrativa.

### 19.2 Eventos

- Desastres, crises do dinheiro, apagão, massacre no campo.

### 19.3 Atos com custo e duração

- Atos com mídia e com países.

---

## Fora do jogo pronto

Guerra iniciada pelo país; pesquisa como árvore (GDD §18).
