# Retomada: onde paramos (24/out/2026, 02h20)

> Leia isto primeiro numa conversa nova. Depois: [PLANO.md](../PLANO.md)
> (seção "Nova ordem (24/out)"), [AGENTS.md](../AGENTS.md) e
> [economia-e-caixa.md](jogo/mecanicas/economia-e-caixa.md).

## Agora

- **Jeito de trabalhar (24/out):** construir primeiro, calibrar no fim. Cada
  mecânica com testes de comportamento só; nada de consertar números da
  economia no meio do caminho.
- **Claude e GPT conversam por `canal/CANAL.md`** (fora do git). Claude escreve
  PEDIDO curto e fechado; GPT faz só aquilo e responde em até 5 linhas; Claude
  confere no código e escreve OK ou REFAZER. Regras no topo do arquivo.
- **Em andamento:** mecânica Economia em reais e caixa (aprovada), fase 1.
  PEDIDO 1 (PIB em reais cresce) está no canal, esperando o GPT.
- **Feito em 23–24/out:** régua nas 26 leis de valor; painel de efeitos por
  seção; salário mínimo em "pessoas acima da linha de pobreza" com a medida do
  país (`paises/brasil/referencias.json`); "Selic" virou "juros básicos";
  suíte verde (514 testes); amostra das telas da versão 2 em
  `docs/jogo/amostras/telas-v2.html` (topo em uma linha, política com
  plenário, orçamento, economia em cadeias).
- **Para depois:** plenário fiel ao jogo (seu partido começa com 5% das
  cadeiras; 6 bancadas por ideologia); régua nas leis de opções.

## Combinados com o autor (resumo)

- Amostra em HTML antes de mudar a tela. Nenhuma lei com dois controles.
- Nada de referência que não exista no jogo ou que só valha para um país.
- Toda lei citada na tela é um link para a lei.
- `git push` só com a palavra do autor. Travas do git: renomear, nunca apagar.

---

# Histórico (22–23/out)

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

## Feito em 22–23/out (noite) — economia e calibragem

Commits locais (sem push), de `075cfe7` a `1c5040f`. Detalhes em
[mecanicas/orcamento.md](jogo/mecanicas/orcamento.md) e
[leis/feedback-do-autor.md](jogo/leis/feedback-do-autor.md).

- **Mecânica 4 (orçamento), fases 1–4:**
  - crescimento = tendência (`crescimento_potencial`: investimento,
    escolaridade, infraestrutura, envelhecimento) + ciclo (quanto o índice
    `pib` andou em 4 trimestres); envelhecimento sobe sozinho;
  - a dívida é diluída pelo crescimento + inflação;
  - juro médio da dívida (`juros_implicito`) anda para a Selic (15%/trim.);
  - risco-país sobe com dívida, déficit e inflação; Selic reage à
    inflação e ao risco só com BC autônomo; risco encarece a dívida;
  - receita: só 30% acompanha a base (`escala.peso`);
  - meta de resultado em 5 opções (sem meta / déficit até 2% / zerar /
    sobrar 1,5% / sobrar 3%) com **contingenciamento** pela distância à
    meta (teto 3% do PIB/ano), que custa investimento, obras e apoio;
  - gasto público → PIB 0,3 (multiplicador).
  - "Nada muda": dívida 78 → ~92 (ano 4) → ~120% (ano 8).
- **Política monetária ligada:** expectativas puxam a inflação; a Selic
  real freia inflação, crédito, consumo, câmbio e PIB; inflação alta custa
  apoio e realimenta expectativas; "Taxa básica de juros" só existe com BC
  subordinado (o Brasil não começa com ela).
- **Calibragem por jogador-teste:** `scripts/teste/varredura-leis.ts`
  (cada opção de cada lei sozinha) e `scripts/teste/jogador-guloso.ts`
  (procura o melhor pacote). Achou alavancas grátis; corrigidas: 8 leis
  fortes demais, intervencionistas sem ganho, qualificação instantânea,
  12 estoques por trimestre rápidos demais, vagas no ensino superior 50×.
  Hoje o melhor pacote cobra preço (popularidade, PIB ou inflação).
- **Turno 0 ancorado:** `npm run pais:ancorar` grava `ajusteDoContexto` em
  `valores.json`; rodar depois de mudar leis do país (desvio 30 → 0,1).
- **Leis (feedback do autor jogando):**
  - opções globais: nada de "hoje na referência", Brasil, pré-sal em
    rótulos e textos; a informação fica no `exemplo`. Regra no molde +
    `src/tests/leisGlobais.test.ts`;
  - direito de greve com "greve livre, sem aviso";
  - "Onde o Estado pode ter empresas estatais" vira limite da
    participação pública, sem efeitos próprios;
  - imposto de imóveis dividido: urbanos, terras rurais e "Quem paga";
  - **salário mínimo novo:** estoque `salario_minimo_relativo` (% do
    salário típico = mediana; Brasil 66); lei "Aumento real do salário
    mínimo" (−30% a +20% acima da inflação, só com reajuste "votado a cada
    ano"); custo do governo só nos benefícios atrelados ao mínimo; corte
    em dinheiro custa apoio e traz greve; lei "Valor" arquivada.
- **Mapa:** clicar numa lei aproxima até zoom 1,2.

## Feito em 23/out (tarde): régua das leis

Commit `96e59f6` (sem push). As 26 leis com controle deslizante têm régua
na janela (faixas verde/amarela/vermelha, hoje × nova lei, frase do estado);
faixas em `conteudo/mundo/reguas.json`, números do país em
`conteudo/paises/brasil/referencias.json`. O relatório "Efeitos" ao lado
agora vem por seção (país, apoio dos grupos, pressão) com a mudança em
palavras, em todas as leis. Teste `reguas.test.ts`. Falta o `npm run check`
completo (GPT); `pressao.test` "turno 0" falhou e parece anterior à régua.
Pendente: régua para as leis de opções (degraus)? Custo do mínimo ~3× abaixo
do real (coeficiente 0,029 → 0,08).

## Próximo chat: lista de mecânicas e tarefas

1. **`npm run check` pelo GPT** (a suíte inteira não foi rodada; os testes
   afetados passaram: paisV1, orcamentoNaRede, cofre, brasil2026,
   mesaDoSalarioMinimo, partida, leisFilhas, inventario, busca, molde,
   mapa). Consertar o que falhar.
2. **Salário mínimo na tela:** amostra em HTML do controle com a régua
   (% acima da inflação, cestas básicas com faixas verde/amarela/
   vermelha, cestas básicas, valor em dinheiro, custo dos benefícios
   atrelados). Depois implementar. Avaliar uma opção constitucional
   "proibido reduzir o salário em dinheiro".
3. **Descrição clara das leis:** campo de explicação (2–4 frases) na lei e
   em cada opção (o que muda na prática, quem ganha e quem perde, efeitos
   em palavras). Amostra da janela primeiro; depois escrever todas, área
   por área; teste que exige explicação.
4. **Calibragem, continuar:** varredura completa de novo
   (`varredura-leis.ts`, ~6 chamadas em paralelo de 2) e jogador guloso do
   zero; marcar leis que mexem > 2–3 pontos de PIB em 3 anos sem custo.
   Pendentes vistos: leis de defesa e reservas (estoques), "Sem meta" de
   inflação ainda reduz muito a dívida (imposto inflacionário), corte da
   social-democrata tira PIB demais.
5. **PIB em reais (`pib_nominal`) como estoque:** só junto com corrigir
   pela inflação as 15 verbas em reais.
6. **Mecânica 4, fases 5–6:** fundo soberano com o destino da sobra;
   contribuição sobre salários como imposto próprio; seguro-desemprego e
   renda de idosos como programas; script de aceite com as estratégias do
   `simular.py`.
7. **Tela (com amostra antes):** Segurança e defesa em duas esferas; mapa
   em faixas e filtro (populares/influência); janela da lei enxuta;
   eleitorado em janela.
8. **Limpeza:** `.git` tem dezenas de `stale-*.lock` (renomeados, sem
   permissão de apagar); autorizar a exclusão e limpar.

## O que estamos fazendo agora (atualizado 22/out, 13h)

**Feito em 22/out (noite):** catálogo no molde v4 (223 de 224 leis), área
por área, com os mesmos números; destinos aprovados e aplicados (15 leis
saíram). Próximo: separar Segurança e defesa em duas esferas, mecânica 4.
Decisões do autor: até 5 opções por lei; sem teto de leis por área;
constitucional que não trava nada fica constitucional, com efeitos.

**Feito em 22/out (tarde):** molde das leis aprovado e implantado (plano
`docs/superpowers/plans/2026-10-22-molde-das-leis.md`, tarefas 1 a 5;
registro em `.superpowers/sdd/2026-10-22-molde-das-leis/progress.md`).
11 áreas por assunto no mapa; Contas públicas no molde v4. `npm run check`
(GPT): só falham "três leis piloto" (antiga) e, às vezes, o tempo de
`partida.test` com a suíte inteira. Próximo: as outras áreas no molde
(`scripts/leis/paraV4.ts` + um arquivo em `scripts/leis/molde/`), mecânica
4, e as amostras da janela da lei e do eleitorado em janela.

**Mudou o rumo:** antes do orçamento, o **molde das leis**. Proposta em
[mecanicas/molde-das-leis.md](jogo/mecanicas/molde-das-leis.md), esperando
o autor revisar: seis famílias com cor (imposto dourado, verba verde,
programa verde-água, regra azul, constitucional lilás, pétrea no centro),
11 áreas por assunto (não por ministério), 8 a 12 leis por área, catálogo
refeito área por área no formato v4. Depois, cada uma com amostra em HTML:
mapa em faixas e filtro (só "Leis populares" e "Influência"), janela da lei
enxuta, eleitorado em janela.

**Orçamento:** os quatro defeitos achados em 22/out (estudo
[victoria3-e-democracy4.md](jogo/estudos/victoria3-e-democracy4.md), seção 8;
sonda `scripts/teste/sonda-orcamento.ts`) esperam a área Contas públicas
ser refeita no molde.

### Antes (manhã de 22/out)

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
