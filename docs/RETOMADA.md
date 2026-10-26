# Retomada: onde paramos (26/out/2026, de madrugada — autor de férias até quarta)

> Leia isto primeiro numa conversa nova. Depois: [PLANO.md](../PLANO.md)
> (seção "Nova ordem (24/out)"), [AGENTS.md](../AGENTS.md) e
> [economia-e-caixa.md](jogo/mecanicas/economia-e-caixa.md).

## Atualização de 26/out: fase 4 de gastos

O autor pediu a implementação completa da fase 4. O código agora tem as leis
Quantidade de servidores, Salário dos servidores e Taxas e tarifas públicas.
A folha é quantidade de servidores × salário médio; aposentadorias, pensões,
militares inativos, seguro-desemprego e renda de idosos/pessoas com deficiência
usam beneficiários × benefício. As verbas perderam os tetos individuais; a
ação de lei reserva a soma das metas de gasto e rejeita mais de 100% do PIB.
Os pisos constitucionais permanecem. A arrecadação das taxas ganhou conta
própria. O orçamento expõe linhas com conta e leis clicáveis.

As verbas em reais mantêm o valor nominal; o índice de preços reduz seu poder
de compra nos efeitos sociais, com comparação anual na janela. Juros básicos
ficam visíveis e bloqueados sob banco central autônomo, com taxa e relação da
inflação com a meta. A auditoria de gastos foi executada após as mudanças e
fechou a soma das relações no mês seguinte. Foram acrescentados testes de
comportamento em `src/tests/gastosFase4.test.ts`. **`npm run check` passou em
26/out: 111 arquivos de teste, 540 testes aprovados e 1 ignorado.** A fase 4
está concluída no commit desta entrega; o `PLANO.md` registra o status mestre.

Preserve as mudanças sem commit que já existiam no topo e no mapa; os arquivos
de interface também receberam edições pontuais da fase 4. No commit entraram
apenas os trechos que mantêm Juros básicos visíveis; o restante do topbar e a
tela experimental do orçamento continuam sem commit. A aba completa de
Orçamento está prevista para a fase 6. A fase 5 é a próxima implementação.

## Entrega para retomar na quarta (trabalho de 26/out)

**Pedido do autor:** verificar se a fase 3 da economia terminou e começar a
fase 4. A implementação dos impostos da fase 3 está no commit `a25db88f` e
nos anteriores; nesta sessão acrescentei um teste de comportamento em
`src/tests/arrecadacaoPorImposto.test.ts` para confirmar a cadeia desemprego
→ ocupados → massa salarial → contribuição sobre salários formais. Os 6
testes desse arquivo e os 2 de `arrecadacaoAncorada.test.ts` passaram.

**Aceite da fase 3 ainda não fechado:** `npm run lint` e `npm run build`
passaram. `npm run check` parou antes dos testes porque `format:check` acusou
13 arquivos fora do padrão; formatei apenas o teste acrescentado nesta sessão,
restando 12 arquivos, incluindo `src/app/partida/contas.ts` e
`src/conteudo/mundo/indicadores/variaveis.json`. A suíte `npm test` mostrou
uma falha antiga de precisão em `src/tests/fichaV3.test.ts`: após quatro
turnos com três leis piloto no cenário Brasil, `letalidade_policial` foi
30,99934994827179; o teste esperava 30,99935161184314 com tolerância de
0,000000005. Isso é um índice da simulação, não um valor de lei nem uma
quantia em reais. Não alterei a expectativa do teste. Interrompi a suíte
completa após essa falha e vários outros arquivos aprovados, pois ela é longa;
portanto **não há resultado final da suíte completa**. Depois das edições,
`npm run lint`, `npm run build` e a checagem de formatação dos dois arquivos
novos passaram.

**Primeiro passo da fase 4 (B1):** adicionei
`scripts/economia/auditar-gastos.ts`; execute com
`npx vite-node scripts/economia/auditar-gastos.ts`. O gasto no turno inicial
é 31,07% do PIB e no mês seguinte 31,08%; a base sem relação é zero e as
relações sem lei contribuem zero nesse estado. A hipótese antiga de que
~30% do PIB são gastos sem lei não se confirmou. O defeito é a falta de
**contas próprias**: a previdência responde por 6,46 pontos do PIB, pensão
por morte por 0,50, seguro-desemprego por 0,41 e a lei de estabilidade dos
servidores acrescenta 0,40 sem representar a folha. Próximo: começar a
substituir efeitos agregados por quantidade × salário dos servidores, em
duas leis, conforme o documento aprovado; depois separar aposentadorias e
pensões e calcular os benefícios pela população atendida. `PLANO.md` foi
atualizado como fonte mestre de status.

**Arquivos desta sessão, sem commit:** `PLANO.md`, este arquivo,
`src/tests/arrecadacaoPorImposto.test.ts` e
`scripts/economia/auditar-gastos.ts`. Preserve as mudanças de interface
sem commit em `TelaPrincipal.tsx` e `mapa.css`, que já estavam no diretório.

#### Agora (26/out, madrugada)

- **Criado `gpt.md`** na raiz: roteiro de como o GPT deve pensar (respostas
  curtas, não adivinhar, não reivindicar sucesso sem rodar teste), complemento
  do `canal/CANAL.md`. Leia os dois antes de orquestrar o GPT.
- **PEDIDO 18 fechado (commit `a25db88f`):** contribuição sobre salários virou
  lei própria (`aliquota_contribuicao_salarios`), saiu da curva antiga da
  previdência. **Próximo da economia:** fase 4 (gastos), pela nova ordem do
  PLANO.
- **Mudanças sem commit:** `src/ui/mapa/TelaPrincipal.tsx` e
  `src/ui/mapa/mapa.css` (grandes, +1020/−190 linhas juntos) — trabalho de
  tela em andamento de uma sessão anterior, não documentado aqui ainda.
  **Confira o que é antes de descartar ou commitar**; não é do GPT mexer
  (regra 7 do canal: tela/desenho é do Claude).
- Há um stash (`ui do laboratorio antes de integrar main`, branch
  `emersonjsc-ajustar-laboratorio`) — não mexer sem saber a origem.

#### Antes (25/out, 18h)

- **Refazer o mundo: desistido pelo autor (25/out, 18h).** As leis, índices
  e grupos atuais ficam; mexemos muito nelas e refazer seria trabalho
  jogado fora. O rascunho do GPT fica guardado em `rascunho/refazer/`
  (não usar). Backup do mundo atual em `arquivo/mundo-antigo-2026-10-25/`
  e na tag `mundo-antigo-2026-10-25`.
- **Mundo sem país:** pedidos 10, 11 e 12 feitos e com commit (`f81f8e2`,
  `6745744`, `8cfd9f0`).
- **Pendente para a V2 (escolha de país):** parte dos efeitos das leis usa
  coeficiente fixo sobre dinheiro (escala do Brasil) em vez de dividir pelo
  PIB; corrigir antes de criar outro país.
- **Próximo:** fase 3 da economia (impostos), pela nova ordem do PLANO.

 Agora (25/out, 03h15): conferir a noite do GPT

- **Mundo sem país:** pedidos 10 (`f81f8e2`) e 11 (`6745744`) com OK e
  commit. Pedido 12 feito pelo GPT de noite, sem OK: conferir.
- **Refazer o mundo (noite de 25/out):** o GPT escreve índices, grupos e
  ~250 leis do zero em `rascunho/refazer/`, seguindo
  `rascunho/refazer/REGRAS.md` e o `verificar.py`. Sem números do motor
  (força em palavras), com `confianca` (consenso/debatido/jogo), evidências
  por área, os cinco modelos de país em cada área, nada de lei grátis.
  Ver `PROGRESSO.md` e `DECISOES.md` lá dentro.
- **Próximo:** rodar o verificador; conferir o sentido por amostragem
  (primeiro `debatido` e `jogo`); desenhar a conversão para o formato do
  jogo (força → coeficiente proporcional); pacote do Brasil (leis em vigor);
  religar eventos, dilemas e consequências pelo `de-para.json`; antigas
  para o arquivo.

## Antes (25/out, 00h40)

- **Página da experiência escrita e revisada com o autor:**
  [docs/jogo/experiencia.md](jogo/experiencia.md). Decisões: sem meta
  pronta (só ganhar ou perder a eleição); industrializar é o rumo natural
  de quem joga bem (V1); coisas novas e pesquisa na V5; leis sem limite
  por turno, ~250 no catálogo; nada é bom ou ruim (jogo neutro); nada
  aparece do nada; o jogo percebe padrões (ex.: corte de gastos) e a
  bússola só mostra; radicais/lealistas = polarização e antipartido, a
  eleição sai do apoio dos grupos contra o adversário; turno continua de
  3 meses, mas a tela anima os 3 meses (substitui o tempo corrido).
- **Plano revisto:** nova ordem no [PLANO](../PLANO.md) (seção "Nova
  ordem"). Próximo: fase 3 da economia (impostos), sem ampliar.
- Mudanças em `experiencia.md`, `escopo.md`, `tempo.md`, `PLANO.md` e aqui
  sem commit.

## Antes (24/out, 23h40)

- **Parada para pensar no jogo.** O autor sentiu que ficamos só em
  estatística e esquecemos que é um jogo. A página já existe:
  [experiencia.md](jogo/experiencia.md) (rascunho de 24/out). Próximo: o autor
  revisa e responde as 3 perguntas "Em aberto"; depois conferimos o PLANO
  contra ela (o que serve à experiência vem primeiro). Não repetir perguntas
  já respondidas nem criar documento novo sobre o mesmo assunto.
- **Economia em reais e caixa:** fases 1 e 2 construídas (PIB em reais,
  população, ocupados, mortes no ano, tipo `derivado` no motor, salário
  médio, massa salarial, lucros, consumo, três patrimônios). Fase 3
  (impostos) **em espera** até a página da experiência.
- **Defeito visto pelo autor:** os números em reais (PIB nominal, salário
  médio, patrimônios) viraram bolhas gigantes no mapa, com ícone genérico e
  número cru. São contas internas: sair do mapa; no futuro aparecem em frases
  e comparações ("cada brasileiro ganha em média R$ 3.500").
- **Divisão do trabalho:** Claude faz desenho, decisões, peças centrais do
  motor e confere **rodando os testes e lendo o diff inteiro**; GPT só faz
  conteúdo repetitivo. Canal em `canal/CANAL.md` (regras 9–17 no topo); o
  autor leva o pedido ao GPT e faz o commit (o `.git` é só leitura para o
  GPT). Vigia desligado.
- **Economia de uso:** uma conversa por assunto; respostas curtas; perguntas
  paralelas em conversa separada.
- **Pendente de calibragem:** `fichaV3` e `gruposSociais` falham por pouco
  (GPT diz que é anterior; não verificado); timeouts da suíte inteira.

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
