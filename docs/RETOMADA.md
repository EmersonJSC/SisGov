# Retomada: onde paramos (22/out/2026, 03h40)

> Leia isto primeiro numa conversa nova. Depois: [PLANO.md](../PLANO.md),
> [AGENTS.md](../AGENTS.md) e o documento do assunto.

## O jogo em uma frase

Victoria 3 reduzido + Democracy 4 avançado: o jogador é um **partido** que
governa um país (começa pelo Brasil), muda **leis** e tenta industrializar
o país sem quebrar as contas, até perder uma eleição. Jogabilidade primeiro,
realidade como base. Escopo: [docs/jogo/escopo.md](jogo/escopo.md).

## Mecânicas (versão 1)

| # | Mecânica | Estado |
| --- | --- | --- |
| 1 | **Tempo:** motor mensal; turno trimestral hoje; destino: tempo corrido com semanas, pausa e velocidades | documento pronto; fatia 1 feita (`calendario.ts`, `prepareGameMonth`) |
| 2 | **Leis:** 3 níveis (pétrea, constitucional, derivada); valor 0–100% sem trava (só soma dos gastos ≤ 100% do PIB e piso/teto vindo de outra lei); escolhas liberadas; exclusões; nome sem sigla | documento pronto ([mecanicas/leis.md](jogo/mecanicas/leis.md)) |
| 3 | Tramitação e Congresso (Câmara e Senado; emenda, complementar, ordinária, decreto, MP) | a escrever |
| 4 | **Orçamento** | a escrever; **prioridade** (ver abaixo) |
| 5 | Rede de consequências (motor) | existe |
| 6 | Índices essenciais (PIB, industrialização, instrução, padrão de vida, população, radicais/lealistas, dinheiro) | a escrever |
| 7 | População (número real, natalidade, mortalidade, migração) | a escrever |
| 8 | Grupos de interesse com radicais e lealistas (opção A) | a escrever |
| 9 | Grupos de pressão | existe |
| 10 | Bússola ideológica (onde o país está; leis dos dois lados) | existe; regras a definir |
| 11 | Eleição e chapa (partido escolhe candidato; perder = fim) | existe em parte |
| 12 | Desgaste do partido (sobe sempre; opinião segura; queda de uma vez) | a escrever |
| 13 | Ocorrências e crises | existe |
| 14 | Ministérios e mapa | existe; tela em reforma |
| 15 | Partida (salvar, carregar, exportar) | existe |

Fora da versão 1: STF, mercado do Victoria 3, Congresso propondo leis e veto.

## O que foi feito em 21–22/out

- **Documentos:** PLANO novo, escopo, mecânicas 1 e 2, desenho de ~250 leis
  novas nas 11 áreas ([docs/jogo/leis/](jogo/leis/README.md)), 25 programas
  reais, equilíbrio financeiro com simulador de referência
  ([equilibrio.md](jogo/leis/equilibrio.md), `scripts/equilibrio/simular.py`).
- **Economia, fase 1:** nomes claros nas 30 leis; 8 impostos sem teto e com
  curva de arrecadação (`scripts/reforma/economia_fase1.py`).
- **Conserto da main:** bússola, conteúdo, formatação, fotografias de teste.
- **Arte:** faixas das áreas, fundo do mapa, cena de crise (GPT);
  briefing de ícones ([docs/arte/](arte/)).
- **Tela:** 242 ícones SVG das leis (`scripts/icones/gerar_leis.py`);
  bolha da lei "gêmea do índice" com um anel só e cor por família
  (imposto âmbar, verba verde, regra azul, Constituição lilás); nomes das
  leis visíveis de perto, sem encavalar; **painel da área** à direita com
  prateleiras, estado em palavras e ★ principais; a aba do painel acende o
  grupo no mapa.

## O que estamos fazendo agora

1. **Simulação de 4 ideologias × 2 caminhos fiscais** (32 turnos):
   `npx vite-node scripts/teste/ideologias.ts 0 1 2 3 4 5 6 7 8`, para o GPT
   rodar. Duas partidas já mostram que **o jogo hoje não deixa resolver a
   dívida**: sem fazer nada ela vai de 82% a 166% do PIB em 8 anos; cortando
   gastos a atividade cai 57% e a dívida vai a 232%. Achados no PLANO.
2. **Próximo passo:** mecânica 4 (orçamento): calibrar a rede fiscal até as
   estratégias baterem com a tabela de `equilibrio.md` (seção 6), e dar lei
   a todo gasto grande (servidores, contribuição sobre salários).
3. **Esperando o autor:** prints da tela nova (painel e nomes); cor da
   Constituição nos quadrados aprovada como lilás; GPT recuperar os PNGs de
   leis que foram apagados por engano (se ainda tiver).

## Combinados com o autor

- Uma mecânica por vez: documentar, aprovar, implementar com testes, commit.
  Motor e jogo antes da tela.
- **Amostra antes de implementar** mudança visual (página HTML para aprovar).
- Tarefas pesadas de rodar (simulações, testes longos): o GPT roda; Claude
  desenha, escreve e confere. Modelos mais leves para tarefas simples.
- Nunca apagar arquivo que não seja seu sem listar e confirmar antes.
- `git push` só com a palavra do autor. Commits da sessão ainda não enviados.
- Sem permissão de apagar, o git deixa travas em `.git`: renomear
  (`mv .git/HEAD.lock .git/stale-…`), nunca apagar.
