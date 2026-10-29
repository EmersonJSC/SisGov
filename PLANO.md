# PLANO do SisGov

> **Status: VIGENTE.** Documento mestre e única fonte de status.
> Reescrito do zero em 21/out/2026. O plano antigo está na branch `gpt/estrutura-docs`.

## 1. Visão

_(a escrever com o autor)_

## 2. Escopo

O escopo completo do jogo está em [docs/jogo/escopo.md](docs/jogo/escopo.md).
Aqui fica só o resumo do que entra e do que não entra na versão atual.

## 3. Onde está cada coisa

| Assunto                | Documento                                                  |
| ---------------------- | ---------------------------------------------------------- |
| O que é o jogo         | [docs/jogo/escopo.md](docs/jogo/escopo.md)                 |
| Regras das leis        | [docs/jogo/mecanicas/leis.md](docs/jogo/mecanicas/leis.md) |
| Como trabalhamos       | [docs/engenharia.md](docs/engenharia.md)                   |
| Como o código funciona | [docs/arquitetura/](docs/arquitetura/) e `src/engine/*.md` |

## 4. Marcos

**Como trabalhamos (21/out):** uma mecânica por vez. Para cada uma:
documentar, o autor aprovar, implementar o máximo possível com testes,
`npm run check` verde e commit. O que depende de outra mecânica fica para
ela. **Primeiro o motor e o jogo (`src/engine`, `src/game`, `src/app`);
a tela (`src/ui`) fica mais para o final.**

| #    | Mecânica                                                    | Documento                                                                         | Implementação |
| ---- | ----------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------- |
| 1    | Tempo                                                       | pronto                                                                            | em andamento  |
| —    | **Índice de conteúdo** (fonte única em YAML; gera os JSONs) | formato aprovado                                                                  | a fazer       |
| —    | **Reforma das leis** (auditoria e reescrita em lotes)       | desenho das 11 áreas em `docs/jogo/leis/` (21/out), aguardando aprovação do autor | a fazer       |
| 2    | Leis                                                        | pronto                                                                            | a fazer       |
| 3–15 | demais                                                      | a escrever                                                                        | a fazer       |

### Nova ordem (24/out): construir primeiro, calibrar no fim

Até o jogo ter o ciclo inteiro (governar, desgastar, perder a eleição), cada
mecânica ganha só testes de comportamento; os testes de números exatos da
economia ficam desligados até a calibragem final. `npm run check` completo
uma vez por mecânica terminada.

Ordem revista em 25/out a partir da [experiência de jogo](docs/jogo/experiencia.md):

1. [x] **Economia em reais e caixa** ([documento](docs/jogo/mecanicas/economia-e-caixa.md), aprovado 24/out): fases 1–5 implementadas (28/out); a fase 6 (aba Orçamento) está na tela. `npm run check` verde em 28/out (111 arquivos, 541 testes). Os números ficam fora do alvo de `equilibrio.md` de propósito: calibragem é o item 10, e a medição está no B6.
2. [ ] **País em frases** ([documento](docs/jogo/mecanicas/pais-em-frases.md), proposta de 28/out): números internos saem do mapa e viram frases e comparações neutras.
   - Histórico das fases 1–3 em `PLANO-feito.md`.
   - Falta só o número grande do boletim, que mostra pontos do motor ("39 / 100") em vez da medida real — regra 2.7. Não é conteúdo por bolha: a tela só converte quando `medida.convertida`, e a Informalidade já traz `medida.valor` 38,6 sem ser olhada (`escalaReal` em `ui/mapa/formatos.ts`). Uma função conserta todas.
3. [x] **Grupos** (30/out): apoio de cada grupo decide a eleição pesado pelo tamanho, e radicais/lealistas (polarização e antipartido). Camadas A, B e C, bolso na satisfação, eleitorado vivo na eleição e no Congresso, radicais e lealistas na tela. Limites (13) a (17) abaixo; `npm run check` rodado ao fechar.
   - Histórico das camadas A, B e C (com revisões) em `PLANO-feito.md`.
   - **Menores da revisão, para depois:** `pontoDoPerfil` sem `desempregado` (vale 0 na economia, ficaria perto de carteira/informal); o grupo desempregados pesa um pouco contra o governo desde o turno 0 no troca-troca; `congressoVivo` roda 4× por render (~55–75 ms, sem memoização); `scripts/teste/conservacao-do-bolso.ts` usa pesos fixos com bolsos vivos; doc de `bolsosDosPerfis` desatualizada; "quem pagou" ordena por reais e o empresário (R$ 95 mil/mês) esconde o desempregado; a perda de quem migra carteira→informal não aparece em "quem pagou".
   - **Limites da C, para a calibragem e para a próxima rodada:** (1) a tabela de vulnerabilidade e os coeficientes das setas são chute de direção, sem PNAD/Caged; (2) informalidade de 80% leva só a ~62% dos ocupados, porque só há movimento entre gêmeos; (3) o ex-informal desempregado fica com renda R$ 0; (4) `ProfileApproval` do motor segue com perfis fixos; (5) desalento e duração do seguro não são modelados; (6) `gosta`/`odeia` do grupo de desempregados não foi escrito; (7) empresário sobra R$ 95 mil/mês (calibragem); (8) `pacoteVivo` percorre ~2.100 perfis por chamada, desempenho a medir; (9) a renda pela sobra (30/out) é só leitura: não mexe em grupos nem eleição, e a partida salva antes não tem `valoresIniciais`, então fica sem movimento; (11) valores e religião (30/out) se movem só no censo, por `app/partida/faixasVivas.ts`: fluxos entre faixas em `mundo/populacao.json` `mudancas`, pressão = Σ peso × variação/100 desde o turno 0. Valores: segurança −1, escolaridade −0,5, desigualdade −0,5, `forca` 1 (segurança −30 move ~9 pontos). Religião: fluxos diretos entre as três (ninguém passa por católico): católico e sem religião → evangélico (desigualdade +0,5, segurança −0,5); católico e evangélico → sem religião (escolaridade +0,5), `forca` 0,5. Chutes de direção, soltos de propósito, a calibrar; a polarização esvaziando o centro não entrou; não há fluxo evangélico→católico nem sem religião→católico; (12) o rótulo "sobra por mês" do censo é renda depois do imposto, sem custo de vida: pode enganar (pobre "sobra" R$ 1,3 mil); (10) `desempregado` em tabelas que assumem ocupações fixas (bússola, comparecimento) não foi auditado.
   - **Fechamento do Grupos (30/out), limites para a calibragem:** (13) o bolso entra na satisfação do perfil por `game/congresso/bolsoNaSatisfacao.ts`: 50 pontos por salário médio anual de diferença na sobra desde o turno 0, teto ±10 (chutes); só a eleição e o Congresso leem (`satisfacaoDoPerfil`); a aprovação do motor (`aprovacaoPorPerfis`, perfis fixos) **não** lê o bolso; (14) `pacoteVivo` agora usa emprego + renda + valores + religião (as faixas vivas saíram do `app` para `game/congresso`), então a eleição e o Congresso enxergam o país que mudou; o turno 0 não muda nada; o início do bolso fica num registro por pacote (`registrarInicioDoBolso`, chamado em `criarPartida` e `carregarPartida`): sem ele o ajuste vale 0; (15) radicais e lealistas (`game/congresso/polarizacao.ts`) são função pura da satisfação (radical: metade do grupo em 30, lealista em 70, abertura 8, chutes), sem estoque que acumule; o país soma por perfil, sem contar duas vezes; (16) antipartido e o desgaste de quem está há muito no poder (docs/jogo/escopo.md 6.7) **não** foram modelados; (17) o desempregado ganhou ponto de economia −0,4 na bússola (chute).
   - **Três camadas, nesta ordem** (decidido com o autor em 28/out): **A. Censo** — a tela mostra o país repartido, 7 ms, só leitura; **B. Bolso e emprego** — cada perfil com salário, imposto, consumo e setor, repartindo os agregados que já estão calibrados (o agregado manda, o perfil divide); **C. Movimento** — o perfil muda de faixa por causa da condição material. A C é o que passa do Democracy 4, onde a lei mexe na filiação direto; aqui a lei mexe na condição e a condição empurra a pessoa.
   - **Faixas sem grupo na tela**, que o censo achou: centro (30% do eleitorado), fora da força de trabalho (16%), metrópole (20%), religião "outra" (16%). Outras ausências são propositais (sem filhos, não ambientalista, 30-59 anos) — ninguém faz política em nome delas. Decidir uma a uma, jogando.
   - Futuro, não agora, e os dois dependem de a camada B guardar o bolso com a **fonte** do dinheiro em vez de um número solto: (a) **setores econômicos** — indústria, serviços, agro — que o autor confirmou em 29/out que vão existir, e hoje só são nome dentro de ocorrências de lobby; (b) migrar para "o perfil manda e o agregado é a soma" (o Vic3 inteiro). Mesma estrutura, direção invertida.

4. [x] **Saúde mexe na população** (30/out, `saude-populacao--taxa-mortalidade`, teste `saudeMortalidade.test.ts`): `taxa_mortalidade` virou `calculado` (consequência não aponta para `controle`) e ganhou a seta de `saude_populacao` (−0,3 por ponto, atraso de 1 passo, neutra no início: 7‰). Pandemia (−10 pontos) = +3‰ de mortes. Script: `scripts/teste/mortalidade.ts`. Limite: a calibragem do coeficiente é chute. A natalidade segue fora (item 5).
5. [x] **Bolha órfã: Natalidade** (30/out, `natalidade--taxa-natalidade`, teste `natalidadeNatalidade.test.ts`): `taxa_natalidade` virou `calculado` e ganhou seta da fecundidade (`natalidade`, coef 0,2446 por ponto, termo 6,115, atraso 1; neutra no início: 12‰). As leis de natalidade já mexiam na fecundidade; agora ela chega à população. Script: `scripts/teste/natalidade.ts`. Limite: coeficiente proporcional (12‰ ↔ 1,57 filhos/mulher), a calibrar; os fatores reais (renda, habitação…) seguem só na eficácia da lei.
6. [ ] **O jogo percebe padrões** (novo): ex.: várias verbas cortadas = corte de gastos; grupos e frases reagem; a bússola só mostra
7. [ ] Desgaste do partido
8. [ ] Eleição e fim de jogo (contra outro candidato)
9. [ ] Congresso (plenário fiel ao jogo: seu partido em dourado, bancadas por ideologia, disposição de cada uma; a amostra v2 simplificou demais)
10. [ ] Três meses na tela: o turno anima os 3 meses (calendário andando, bolhas crescendo e encolhendo); substitui o tempo corrido
11. [ ] Índices essenciais e população: só o que faltar depois da economia em reais
12. [ ] Calibragem de tudo, neutralidade das réguas e catálogo de ~250 leis
    - **Chutes da população para conferir na calibragem** (lista única, 30/out; cada um também tem o aviso no próprio arquivo). Todos são de direção, sem dado:
      - Multiplicadores de renda por ocupação × faixa (`mundo/populacao.json`, `bolso`): ancorados a olho na PNAD. Hoje o pobre com carteira ganha R$ 1.862/mês e paga 35% disso.
      - **Piso** (feito 30/out): carteira e servidor (`seguePiso`) não ganham menos que o salário mínimo (`salario_minimo_efetivo` × mediana/média 0,71, chute em `populacao.json`). Só sobe: cortar o mínimo não baixa o bolso; quando pega, a soma dos perfis deixa de fechar com a massa do motor. Neutro no início (66%). Script: `scripts/teste/piso-minimo.ts`.
      - Imposto proporcional: o real é regressivo no consumo e progressivo na renda.
      - Rótulo "sobra por mês": é renda depois do imposto, sem custo de vida; pode enganar.
      - Empresário R$ 95 mil/mês de sobra: `lucros` repartido por 6,7% do eleitorado.
      - Vulnerabilidade ao desemprego (`emprego.vulnerabilidade`) e os coeficientes das setas do desemprego.
      - Renda pela sobra: a distância entre faixas é a das médias do início; o rico quase não se move.
      - Valores e religião (`mudancas`): pesos e `forca` de cada fluxo; polarização e o caminho evangélico→sem religião não entraram.
13. [ ] **O partido é uma coisa** (novo, 28/out): hoje o partido é só nome e sigla, embora a tela prometa "você não é o presidente, você é o partido". Falta o que ele defende (ideologia, alas internas), a disciplina da bancada e como isso aperta o jogador. O desgaste (item 5) é propriedade dele, não um número solto.
14. [ ] **Montar o governo** (novo, 28/out): escolher vice e ministros. Hoje escolhe-se só o presidente, entre personagens gerados com biografia, opiniões, carisma e experiência. Não há chapa (vice não existe no código) e `occurrences.ts` ainda monta o texto do ministro a partir do nome da pasta — o comentário lá diz "até existirem ministros com nome". Os ministérios já existem no mapa; falta quem os ocupa.

**Os itens 11 e 12 decidem a primeira impressão do jogo** (28/out): são o que a
tela de abertura oferece. Hoje ela pede um nome, mostra cinco rostos e manda
tomar posse — raso para a promessa que faz. Onde entram na ordem é decisão do
autor; estão no fim da lista por serem novos, não por serem menos urgentes.

**Pendências da [experiência de jogo](docs/jogo/experiencia.md) (25/out):**

- [ ] Neutralidade: tirar o "bom/ruim" das faixas verde/amarela/vermelha das réguas (`conteudo/mundo/reguas.json`) e revisar textos, frases e cores que julgam leis, ideologias ou caminhos.
- [ ] O jogo perceber padrões das escolhas (ex.: várias verbas cortadas = corte de gastos) e os grupos e frases reagirem; a bússola só mostra.
- [ ] Catálogo de ~250 leis (hoje 224); toda lei e toda opção com lugar na bússola.
- [x] **Mundo sem país** (25/out): leis, índices e textos sem país; dados do Brasil em `paises/brasil/` (`f81f8e2`, `6745744`, `8cfd9f0`). Falta: troca de nomes por país (ex.: "Selic"); coeficientes em dinheiro fixo → proporcionais ao PIB (antes da V2).

**Versão 2 (ideia, amostra em [docs/jogo/amostras/telas-v2.html](docs/jogo/amostras/telas-v2.html)):** topo em uma linha com detalhes ao passar o mouse; abas Leis, Política, Orçamento e Economia; tela de política com plenário; economia em cadeias produtivas com produtividade por setor e o porquê. Sem azul: couro e papel.

### Próximos passos (23/out): fechar as mecânicas 1, 2 e 4

Ordem por dependência. Cada item: olhar (script ou lista do que falta),
amostra ou documento quando há decisão do autor, implementar com teste,
`npm run check`, commit.

**0. Base verde**

- [ ] `npm run check` completo sem falha (hoje: `pressao` "turno 0", "três leis piloto" e testes lentos que passam do tempo)

**A. Leis (mecânica 2): acabamento**

- [x] A1. Olhar (23/out): país sem limite próprio; impostos já de 0 a 100%; 16 verbas com teto em % do PIB (`dinheiro.limites`, de 0,01% a 10%) e a Polícia Federal com piso de 0,02%; pisos de saúde e educação com teto de 40% da receita; o 3× da tela não vale para nenhuma lei (todas têm teto); a soma ≤ 100% do PIB não existe; o piso vindo da lei constitucional (`pisoPorLei`) fica
- [x] A2. Tirar as travas individuais das verbas e os tetos de 40% dos pisos; manter o piso constitucional
- [x] A3. Trava conjunta de 100% do PIB nas ações de leis, incluindo metas de gastos ainda em implantação; acima da receita vira déficit. Conferir cenários com várias leis interdependentes no aceite.
- [ ] A4. Exclusão entre leis (a lei declara com quem não convive; aprovar pede revogar a outra)
- [ ] A5. Liberar as opções travadas e converter em valor onde couber (lista para o autor aprovar)
- [ ] A6. Explicação de cada lei e opção: amostra da janela, depois área por área, teste que exige
- [ ] A7. Régua também nas leis de opções? (decisão do autor)

- B1–B6 feitos (histórico em `PLANO-feito.md`).

**C. Calibragem (rede, mecânica 5)**: depois de B

- [ ] C1. Varredura completa (`varredura-leis.ts`) e jogador guloso do zero
- [ ] C2. Pendentes: defesa e reservas, "Sem meta" de inflação, corte que tira PIB demais, leis que mexem mais de 2–3 pontos de PIB em 3 anos sem custo; pressão dos sindicatos de servidores recua mas não cruza a saída do nível 2 com a satisfação máxima no cenário atual.

**D. Tempo (mecânica 1): três meses na tela** (25/out, substitui o tempo corrido): depois de C

- [ ] D1. Documento da fatia 2 (animação dos 3 meses; eventos no mês deles); motor segue mensal
- [ ] D2. Implementar no `app` com teste; tela com amostra antes

### Reforma das leis (21/out)

1. **Índice de conteúdo:** converter tudo para o índice e provar que gerar
   de volta dá zero diferença.
2. **Auditoria:** cada uma das 242 leis recebe nota nos critérios de
   [leis.md 2.3](docs/jogo/mecanicas/leis.md#23-como-uma-lei-deve-ser) e um
   destino: manter, reescrever, dividir, juntar ou remover.
3. **Reescrita em lotes, uma área por vez** (molde de 22/out, abaixo): primeiro a lista de leis
   do ministério (o autor aprova), depois o detalhe de cada uma (opções,
   efeitos, bússola, programas reais), gerar, testes.

### Economia: fase 2 (a fazer)

- Juntar: imposto-sobre-a-propriedade em Imposto sobre imóveis; destino-do-resultado-fiscal no Fundo soberano; incentivos-fiscais-regionais nas Zonas econômicas especiais (empresas)
- Converter em faixa: Meta de resultado das contas, Isenções fiscais, Meta de inflação, Juros básicos (com a regra "só o governo mexe se o banco central for subordinado")
- Leis novas que pedem recalibrar a arrecadação: Imposto sobre veículos, Contribuição sobre os salários, Isenção do imposto de renda (e Salário e quantidade de servidores, em governo)
- Leis novas com mecânica nova: Dívida pública (moratória), Imprimir dinheiro, Teto para os juros dos bancos
- Exclusões da economia (regra 11) no código

### Achados da simulação de 22/out (`scripts/teste/ideologias.ts`)

- **Nada muda, 32 turnos:** dívida 82% → 166% do PIB; resultado nominal −6,6% → −17,6%; índice de atividade 44,7 → 39,7. A dívida explode rápido demais (o desenho em `equilibrio.md` prevê ~119% em 8 anos).
- **Social-democrata cortando gastos:** dívida 82% → 232%; atividade 44,7 → 19,2 (−57%); desemprego 6,2% → 10,2%. Cortar gasto derruba a economia muito mais do que deveria, e a dívida piora em vez de melhorar.
- Conclusão: a calibragem fiscal da rede está fora do alvo de `docs/jogo/leis/equilibrio.md`; entra na mecânica 4 (orçamento), antes de qualquer conteúdo novo de economia.
- **22/out (noite), de novo depois do molde:** mesmo quadro. Com corte de gastos, PIB termina entre 18,5 e 24,8 e a dívida vai de 82,4% a 225–254%; com "Social + PIB", PIB entre 43 e 52,2 e dívida 178–193%. O molde não mudou nenhum número, então o resultado era esperado.
- **Dois problemas a resolver na mecânica 4:** (1) cortar gasto derruba a atividade e a arrecadação demais (receita multiplicada pelo índice de atividade inteiro; seta direta da meta de primário no PIB); (2) a dívida cresce até nos cenários de crescimento (PIB em reais parado, sem diluição; juros sem canal de credibilidade). Diagnóstico e proposta: [estudo](docs/jogo/estudos/victoria3-e-democracy4.md), seção 8.
- O roteiro `scripts/teste/ideologias.ts` usava `volume-de-incentivo-a-industria`, que saiu no molde; trocado por Política industrial setorial (66,67).

### Molde das leis (22/out, proposta)

- Desenho: [molde-das-leis.md](docs/jogo/mecanicas/molde-das-leis.md), aprovado em 22/out. Plano: [2026-10-22-molde-das-leis.md](docs/superpowers/plans/2026-10-22-molde-das-leis.md).
- Limite de 8 a 12 leis por área: só aviso até o autor decidir Contas públicas.
- [x] Verificador do molde (teste)
- [x] Inventário das leis por área nova (`npm run leis:inventario` → docs/jogo/leis/inventario.md)
- [x] Áreas por assunto no país; família lida da lei, não adivinhada
- [x] Catálogo no formato v4: **221 de 239 leis** nas 11 áreas e as 2 pétreas (22/out), sem mudar nenhum número (foto de todos os valores a cada área). Dados de cada área em `scripts/leis/molde/`.
- [x] Destinos aprovados e aplicados (22/out): 15 leis saíram; 224 leis no jogo, 223 no molde v4 (falta só Destino da sobra, mecânica 4)
- [ ] Separar Segurança e defesa em duas esferas (Segurança e justiça; Defesa e exterior): aprovado pelo autor
- [ ] Mecânica 4: juntar "Destino da sobra" ao fundo soberano (comanda o cofre) e tirar a contribuição sobre salários de dentro da previdência para uma lei própria
- [ ] Depois, com amostra em HTML: mapa em faixas e filtro; janela da lei; eleitorado em janela

### Mudanças de código já decididas no escopo

- [ ] Tirar os limites por lei e por país das leis de valor (controle livre de 0 a 100%), inclusive o teto de 3×/4× o valor atual em `faixaNumerica` (`src/ui/mapa/Documentos.tsx`)
- [ ] Trava única: soma dos gastos ≤ 100% do PIB; gasto acima da arrecadação vira déficit e dívida
- [ ] Rever as leis de escolha: liberar todas as opções e converter em valor onde couber
- [ ] Jogador como partido (não presidente); partida começa com o partido recém-eleito
- [ ] Desgaste do partido: sobe sempre por baixo, opinião segura, queda em escândalo, crise ou eleição
- [ ] Índices essenciais como número único: criar industrialização, padrão de vida composto, população real (natalidade, mortalidade, saúde, migração), radicais e lealistas
- [ ] Três meses na tela: animação do turno com calendário e bolhas (decidido 25/out; substitui o tempo corrido)
- [ ] Mecânica 4: gasto fixo da rede (~30% do PIB) que nenhuma lei controla; reativar o teste `contasSemFuros` "cofre passa de 100%"
- [ ] Mecânica 2: pisos de saúde e educação ainda têm teto de 40% (trava a tirar)
- [ ] Exclusão entre leis: lei declara quais não podem estar em vigor junto; aprovar pede revogar a outra
- [ ] Retirar o STF: mudança em pétrea gera reação do Senado e da população

## 5. Chamados (status)

_(a definir)_

## 6. Decisões

- **Jogabilidade acima de empirismo (21/out).** Dados reais são base, não
  amarra. A regra antiga "número sem fonte é hipótese marcada" deixa de valer.
  Lei inventada entra se tiver ligação com o mundo real. Ver [leis.md](docs/jogo/mecanicas/leis.md#29-como-escrever-uma-lei-nova).
  _(as decisões antigas D-NN serão revistas; só entram aqui as que continuam valendo)_

## 7. Pendências da limpeza de 21/out

- [ ] `npm install` e `npm run dev` no terminal do autor
- [ ] Decidir sobre `arte-originais/` (53 MB) e `dados/` (155 MB)
- [ ] Opcional: `git gc`
- [ ] Corrigir links para `docs/fichas/` (não existe mais) em 3 documentos
