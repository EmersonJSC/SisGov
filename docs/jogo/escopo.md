# Escopo do SisGov

> **Status: RASCUNHO para o autor aprovar.** Recomeço do projeto em 31/out/2026.
> Único documento vivo de regras e de ordem de construção. O escopo antigo, o
> PLANO e as mecânicas estão em `docs/historico/projeto-antigo/`; cada decisão
> trazida de lá diz a data de origem. Experiência do jogador:
> [experiencia.md](experiencia.md).

## 1. O jogo

Simulador de **governo**. O jogador é um partido recém-eleito e governa
**aprovando leis**; não constrói nada diretamente (21/out). Cada lei tem
consequência própria e sentida. Parecer um governo de direita ou de esquerda
é resultado das leis, nunca objetivo (31/out).

- **Única vitória:** ganhar a eleição. **Única derrota:** perdê-la (24/out).
- **Sem meta pronta:** o jogador leva o país para onde quiser; quem joga bem
  tende a industrializar, mas o jogo não exige (24/out).
- Gênero: Democracy 4 com mercado do Victoria 3, sem copiar nada dos dois (21/out).

## 2. Princípios

1. **Leis são o núcleo.** Todo o resto lê as leis; mudar uma lei muda o jogo (31/out).
2. **Mundo sem país.** Leis e índices são genéricos. O país só declara o
   estado de partida e pode trocar nomes ("juros" → "Selic") (25/out).
3. **Liberdade com consequência.** Toda lei vai de 0% a 100%. O que segura o
   jogador é a consequência, nunca uma trava; a única trava dura é a soma dos
   gastos ≤ 100% do PIB (21/out e 30/out).
4. **Nada aparece do nada.** Gastar exige imposto, dívida ou inflação, e cada
   um cobra depois (24/out).
5. **O que dá resultado demora; o que é popular custa caro** (24/out).
6. **Jogabilidade primeiro, realidade como base.** Lei inventada vale;
   número não precisa de precisão empírica.
7. **O motor não conhece nomes** de leis, partidos ou países. O que é de lei
   ou de país mora no JSON; no código só a física (identidades contábeis).

## 3. Tempo

- Turno de **2 meses**; mandato de 4 anos = **24 turnos** (30/out).
- O país declara a duração do mandato e o limite de reeleição do candidato;
  o partido continua no poder enquanto vencer (21/out).

## 4. Índices (31/out)

Arquivo: `src/conteudo/mundo/indicadores/variaveis.json`.

- **Essenciais**, a física de qualquer país: população, ocupados, desemprego,
  PIB real, crescimento, nível de preços, inflação, PIB nominal, receita,
  gasto, resultado, dívida, juros.
- **Jogabilidade**, o que o jogador sente e os grupos cobram: padrão de vida,
  instrução, industrialização, saúde, segurança, pobreza, desigualdade,
  corrupção, liberdades, polarização, meio ambiente, reputação
  internacional, aprovação.
- População é número real de pessoas (21/out).

## 5. Leis

_(modelo proposto em 31/out, falta aprovar)_

- Cada lei declara seus efeitos **em unidade de gente**: o efeito com a lei
  em 100%, na unidade do índice (ex.: receita +6% do PIB). Em 50%, metade.
  O motor converte para o turno.
- Cada efeito tem **tempo** para chegar inteiro (imediato, 1 ano, 4 anos).
- Cada lei declara **quem apoia e quem rejeita**, em número. O texto da tela
  é gerado disso: texto e motor não podem discordar.
- 3 a 6 efeitos por lei, cada um justificável numa frase.
- Gasto em % do PIB, somado na trava de 100%.

_A decidir:_ quantas leis a V1 terá (o escopo antigo dizia ~250).

## 6. População e grupos

- Grupos de interesse com **tamanho em pessoas** (21/out).
- Cada grupo tem satisfação e dois estoques, **radicais** e **lealistas**,
  que sobem e descem devagar; não somam 100% (21/out).
- A eleição é decidida pelo **apoio de cada grupo pesado pelo tamanho**,
  contra o adversário. Radicais e lealistas medem polarização, não decidem
  sozinhos (24/out).

_A decidir:_ a lista de grupos genéricos.

## 7. Congresso

A lei precisa dos votos do Legislativo; o caminho (câmaras, quórum) é
declarado pelo país (21/out).

## 8. Eleição e desgaste (21/out)

- Eleição a cada fim de mandato; perder é fim de jogo.
- **Desgaste** sobe sempre, num valor fixo por período no poder (custo de
  governar, ~2,25 pontos por mandato). A opinião segura enquanto o partido
  governa e despenca de uma vez numa crise ou eleição (cruzeiro e queda).
  O jogador reduz o desgaste, nunca zera.

## 9. Fora da V1

Tela elaborada (vem por último), ministros, dilemas e eventos, bússola
ideológica, mídia e redes, mercado do Victoria 3, população em blocos,
escolha de país, STF, pesquisa e tecnologia.

## 10. Ordem de construção

Um passo por vez. Cada passo só fecha quando o critério de pronto roda.
Ideia nova durante um passo vai para a seção 11, não para o passo.

| # | Passo | Pronto quando |
|---|---|---|
| 1 | Escopo | O autor aprova este documento |
| 2 | Índices | ✅ arquivo novo com as duas camadas |
| 3 | Modelo de lei | Uma lei escrita no formato novo e o autor aprova |
| 4 | Turno mínimo | Script joga 24 turnos; a lei a 0%, 50% e 100% dá três países diferentes, na direção que a lei promete |
| 5 | Contas | Receita − gasto − juros move a dívida; dívida alta sobe juros; trava de 100% do PIB |
| 6 | Leis da V1 | Cada lei com comportamento esperado escrito antes e conferido por script |
| 7 | Grupos | Leis e índices movem satisfação, radicais e lealistas de cada grupo |
| 8 | Congresso | Lei só muda com voto; base e oposição reagem às leis |
| 9 | Eleição e desgaste | Partida de 24 turnos termina em vitória ou derrota que o jogador entende |
| 10 | Tela | Jogar uma partida inteira na tela |

Peças do código antigo voltam só quando um passo precisar delas, depois de
lidas (tag `projeto-antigo-2026-10-31`).

## 11. Ideias para depois

_(vazio)_
