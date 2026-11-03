---
name: sisgov-gamedesign
description: Use before designing or changing ANY SisGov mechanic, law, screen or market feature — think as a game designer first (what the player does, feels and chooses), then as an engineer. Triggers on "mecânica", "lei nova", "minigame", "tela", "fatia", "como o jogador".
---

# Pensar como game designer

O autor já me corrigiu por desenhar "site de manipulação de dados" (02/nov:
protótipo da fatia 8 virou painel de gestão). Antes de qualquer número ou
código, responder estas perguntas **por escrito, em 5 linhas**, no chat.

## As 6 perguntas (nesta ordem)

1. **Verbo:** o que o jogador FAZ? Uma frase com verbo ("propõe uma lei",
   "escolhe o preço mínimo do leilão"). Se o verbo é "ajusta um valor", é
   slider: refazer.
2. **Apresentação:** como aparece? No SisGov **toda lei é uma bolha no mapa**
   (GDD, princípio 2). Painel de leitura pode existir; a decisão fica na lei.
3. **Escolha com dente:** quais as 2–3 opções que têm ganho E custo, sem
   opção certa? (Escopo: "nada é bom ou ruim".) Se uma opção domina, não é
   escolha.
4. **Tensão:** o que puxa contra? Tempo (efeito demora), dinheiro (cobra
   depois), grupos (agrada um, irrita outro), mundo (potência reage).
5. **Sentir:** o que o jogador VÊ mudar, e quando? Efeito invisível não conta
   (memória: "jogo não se sente"). Dados primeiro, narrativa depois.
6. **Criatividade:** há mais de um jeito de chegar ao mesmo objetivo? Lei de
   botão único não dá espaço; combinar leis e caminhos dá.

Só depois: números, motor, tela. Se não passa nas 6, voltar ao autor.

## Referências para pensar (ideias, nunca cópia)

Mecânicas de jogo, para inspirar o *tipo* de decisão. **Nada do Democracy 4**
entra no projeto; nada de nome, número ou ligação de outro jogo.

- **Victoria 3:** mercado de oferta e procura, comércio, interesse dos grupos,
  nada se resolve com um botão. Resumo em `docs/jogo/mercado-vic3-referencia.md`.
- **Leilão e lance (teoria dos leilões, Vickrey, Milgrom):** preço mínimo alto
  esvazia, baixo vende barato; quem aparece depende do lucro esperado e do
  risco do país.
- **Pontuação de risco / confiança (jogos de gestão econômica):** o jogador
  gasta confiança para agir rápido; recupera devagar.
- **Jogos de dilema de curto × longo prazo (4X, city-builders):** ganho hoje,
  custo depois; o jogador *sente* a conta chegar.

## Estudos para escolher direção dos efeitos

- Privatização: métodos (bolsa, leilão, concessão, ação de ouro); resultado
  melhor com concorrência e regulação do que só com a venda.
- Expropriação: indenização "pronta, adequada e efetiva"; confisco derruba
  investimento e reputação; arbitragem internacional (ICSID).
- Capital estrangeiro: triagem em setores estratégicos, gatilho típico de
  ~10%; teto duro é raro.
- Pesquisar de novo (WebSearch standard) quando o tema for novo; citar a fonte
  ao autor.

## Armadilhas já cometidas

- Painel de gestão no lugar de lei (fatia 8).
- Lei "quem constrói / opera / vende" como botão de opções que troca tudo de
  uma vez: sem meio-termo, sem criatividade (autor, 02/nov).
- Narrativa antes dos dados.
- Opinar sem medir no código ou no GDD.

## Resposta ao autor

Simples, curta, português, uma frente, **uma decisão** no fim com
recomendação. Autor tem TDAH.
