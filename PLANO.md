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
   - **Fase 1 feita** (28/out): 4 nós sem seta visível foram para `area: "Dados internos"`, a convenção que `nosForaDoMapa` já usava — sem código novo. Teste `paisEmFrases.test.ts` 7/7.
   - **Duas armadilhas registradas em teste.** `medida.tecnico` é "sem estatística real", **não** "esconder": filtrar por ela apagaria a aprovação do governo. E esconder um nó esconde as setas que passam por ele, porque a visão descarta ligação com uma ponta fora — comecei escondendo 11 e 7 eram explicação de bolha visível. O invariante `naoEsconderSeta` guarda a regra.
   - **Fase 2 (tom) aprovada** pelo autor em 28/out, com três frases refeitas. Decidido: comparação com o passado do próprio país; frase na frente e número ao abrir; o número entra na frase quando ele é a notícia (desmatamento em km²).
   - **O lote encolheu.** São três jeitos de ter frase e só um dá redação: função (porcentagem de gente, `emCada()` em `app/partida/frase.ts`), modelo com o número (quantidade que se entende sozinha) e faixa escrita (só índice e jargão: Gini, HHI, PIB em índice). A estimativa de ~440 frases redigidas cai para uma fração.
   - **Regra nova para os países:** `territorio.florestaMilKm2` em `paises/<pais>/pais.json`, com fonte (Brasil: 4.966 mil km², FAO 2020). Precisou entrar na lista de chaves previstas do cenário em `validateContentFile.ts`.
   - **Fase 3 feita** (28/out): `fraseDaBolha()` em `app/partida/frase.ts` escolhe o jeito, a visão entrega `frase` em cada bolha e a tela mostra — rótulo da bolha, `aria-label` e boletim. 55 das 192 bolhas ganham frase; o resto cai no número, de propósito. Teste `frase.test.ts` 14/14, `paisEmFrases.test.ts` 7/7.
   - **A fração tem teto de erro, e o sujeito tem de estar na unidade.** Sem o teto, 1% virava "um em cada doze" (o numerador nunca é zero); a folga é um décimo da distância até 0% ou 100%, e fora dela a bolha cai no número. E sem sujeito nomeado na unidade, "% da malha rodoviária em estado bom" virava "uma pessoa em cada três" — quem não casa a lista de `sujeitoDaUnidade()` não ganha frase. Quem conferiu foi o script `scripts/teste/frases-das-bolhas.ts`, não os testes: compilar não prova frase boa.
   - **O lote de redação saiu da mecânica** (decisão do autor, 28/out): as faixas escritas (Gini, HHI, PIB em índice) vão para a revisão manual jogando, bolha por bolha e lei por lei, junto com o resto do texto do jogo. Julgar frase sem ver na partida é o erro que custou a manhã de 28/out.
   - Falta só o número grande do boletim, que mostra pontos do motor ("39 / 100") em vez da medida real — regra 2.7. Não é conteúdo por bolha: a tela só converte quando `medida.convertida`, e a Informalidade já traz `medida.valor` 38,6 sem ser olhada (`escalaReal` em `ui/mapa/formatos.ts`). Uma função conserta todas.
3. [ ] **Grupos** (arquitetural, em desenho 28/out): apoio de cada grupo decide a eleição pesado pelo tamanho, e radicais/lealistas (polarização e antipartido).
   - **A camada pesada já existe:** `paises/brasil/perfis.json` traz 2.090 perfis de 8 atributos com peso, e eles já chegam na partida (o congresso percorre em `tramitacao.ts`). Os 19 grupos da tela são uma projeção deles por 7 eixos. O SisGov já começa mais fino que o Democracy 4, que tem ~20 grupos chapados.
   - **O nó:** os perfis são `content` (fixos), não `game` (estado). Ninguém perde emprego, enriquece ou muda de valores. Mover os perfis para o estado é o que destrava tudo.
   - **Camada A feita** (29/out): a aba População mostra o censo — uma ficha por atributo, pizza até seis faixas e treemap acima disso (a Ocupação tem nove, e pizza de nove fatias vira borda). Cada faixa traz a frase do país em frases e a marca das que não têm grupo no mapa. `censo.ts` lê os perfis em ~7 ms; nada novo no estado. Rótulos em `mundo/populacao.json`. Testes: `censo.test.ts` 7/7 e `treemap.test.ts` 6/6 (área proporcional, sem sobra, sem sobreposição, nada fora da caixa).
   - **Duas tentativas descartadas antes dessa**, as duas por não se lerem: lista de barras simples, e "se o país fosse 100 pessoas" com cem figuras (virava borrão; o autor recusou os bonecos). A terceira é a que ficou. Paleta categórica validada por script (daltonismo, contraste, banda de luminosidade); a nona faixa não ganha cor nova — a cor dobra, o nome não.
   - **Risco diagonal nas faixas sem grupo foi tentado e tirado:** elas são as maiores (62% sem filhos, 57% de 30-59), então a tela virava listrado e dava alarme onde metade das ausências é proposital.
   - **Sem tendência, de propósito:** os perfis são fixos até a camada C, então "subiu desde o turno passado" seria mentira do tipo que o país em frases tirou das bolhas.
   - **Camada B feita** (29/out, commits ac9e6e9b..3e809069): cada perfil tem renda (repartida da massa salarial por ocupação × renda, com os multiplicadores normalizados para a média de quem trabalha fechar com `salario_medio`), imposto pela alíquota efetiva, benefício declarado na tabela, e sobra. O censo mostra quanto sobra por faixa; a prévia da lei diz no bolso de quem ela bate. Spec em [populacao.md](docs/jogo/mecanicas/populacao.md), plano em [docs/superpowers/plans](docs/superpowers/plans/2026-10-29-populacao-camada-b.md). Testes `bolso.test.ts` 18/18 e `censo.test.ts` 9/9. `npm run check` verde em 29/out: 116 arquivos, 595 testes. **Mas a revisão achou 1 problema grave e 3 sérios de modelo, que teste verde não pega — ver RETOMAR.md antes de seguir.**
   - **A contribuição sobre a folha não sai do bolso de quem trabalha:** é encargo do empregador, que o jogo já mostra em "Custo de contratar". Cobrá-la do salário levava a conta a 61% do que se ganha. Quem achou foi o script `scripts/teste/bolso-dos-perfis.ts`, não o teste.
   - **Revisão da camada B** (29/out, `scripts/teste/conservacao-do-bolso.ts`; feita pelo mesmo contexto que escreveu, não é independente): divisão por zero está guardada em todos os caminhos; o imposto de renda não é contado duas vezes; a média de renda de quem trabalha fecha com `salario_medio` (razão 1,000). Três limites, que a camada C herda: (1) a parte que trabalha nos perfis é fixa (64,7%) e a do motor (`ocupados`) se mexe, então a soma dos perfis só fecha com a massa salarial no ponto de partida; (2) 36% do consumo das famílias vem de lucros e não cai em nenhum perfil que trabalha, então a soma do imposto sobre consumo dos perfis fica abaixo da arrecadação; (3) o benefício paga imposto sobre consumo no bolso, mas o `consumo_familias` do motor não inclui benefícios.
   - **Três camadas, nesta ordem** (decidido com o autor em 28/out): **A. Censo** — a tela mostra o país repartido, 7 ms, só leitura; **B. Bolso e emprego** — cada perfil com salário, imposto, consumo e setor, repartindo os agregados que já estão calibrados (o agregado manda, o perfil divide); **C. Movimento** — o perfil muda de faixa por causa da condição material. A C é o que passa do Democracy 4, onde a lei mexe na filiação direto; aqui a lei mexe na condição e a condição empurra a pessoa.
   - **Faixas sem grupo na tela**, que o censo achou: centro (30% do eleitorado), fora da força de trabalho (16%), metrópole (20%), religião "outra" (16%). Outras ausências são propositais (sem filhos, não ambientalista, 30-59 anos) — ninguém faz política em nome delas. Decidir uma a uma, jogando.
   - Futuro, não agora, e os dois dependem de a camada B guardar o bolso com a **fonte** do dinheiro em vez de um número solto: (a) **setores econômicos** — indústria, serviços, agro — que o autor confirmou em 29/out que vão existir, e hoje só são nome dentro de ocorrências de lobby; (b) migrar para "o perfil manda e o agregado é a soma" (o Vic3 inteiro). Mesma estrutura, direção invertida.

4. [ ] **Saúde mexe na população** (achado de 28/out, fora dos Grupos): `taxa_mortalidade` é `controle` e **nenhuma consequência aponta para ela**, então a pandemia derruba a expectativa de vida e não mata ninguém. Falta `saude_populacao → taxa_mortalidade`. Cuidado: fecha laço (saúde → mortalidade → população → tudo que divide por população → saúde), então pede atraso. A natalidade fica fora: muda ao longo de uma década e o efeito não cabe num mandato de 16 turnos.
5. [ ] **Bolha órfã: Natalidade** (achado de 28/out): a fecundidade não tem seta entrando nem saindo — é enfeite na tela. Ou ganha setas (os fatores reais já existem: renda das famílias, déficit habitacional, participação das cuidadoras, custo de contratar — todos já ligados na _eficácia_ da lei de natalidade), ou sai do mapa pela regra do país em frases.
6. [ ] **O jogo percebe padrões** (novo): ex.: várias verbas cortadas = corte de gastos; grupos e frases reagem; a bússola só mostra
7. [ ] Desgaste do partido
8. [ ] Eleição e fim de jogo (contra outro candidato)
9. [ ] Congresso (plenário fiel ao jogo: seu partido em dourado, bancadas por ideologia, disposição de cada uma; a amostra v2 simplificou demais)
10. [ ] Três meses na tela: o turno anima os 3 meses (calendário andando, bolhas crescendo e encolhendo); substitui o tempo corrido
11. [ ] Índices essenciais e população: só o que faltar depois da economia em reais
12. [ ] Calibragem de tudo, neutralidade das réguas e catálogo de ~250 leis
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
`npm run check` (GPT), commit.

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

**B. Orçamento (mecânica 4): fases 5 e 6**

- [x] B1. Auditar o gasto inicial por relação (`npx vite-node scripts/economia/auditar-gastos.ts`, 26/out): 31,08% do PIB no próximo mês, base 0; relações sem lei contribuem 0 no estado inicial. O problema é a falta de contas próprias: previdência 6,46%, educação 5,55%, saúde 4,34%, defesa 1,60%, transferência de renda 1,40%, seguro-desemprego 0,41% e pensões 0,50% saem de efeitos agregados das leis. Não há conta de quantidade × salário dos servidores; Estabilidade dos servidores acrescenta 0,40%, mas não representa a folha.
- [x] B2. Substituir os efeitos agregados pelas contas do documento aprovado: servidores (duas leis), aposentadorias, pensões, seguro-desemprego e renda de idosos; contribuição sobre salários já virou imposto próprio na fase 3. Taxas e tarifas também viraram lei. Auditoria inicial após a mudança: 32,19% do PIB no mês seguinte, soma das relações igual ao gasto calculado.
- [x] B3. Fundo soberano com o destino da sobra (comanda o cofre, 28/out): as
      duas leis ficam separadas (uma pergunta cada, decisão 1) e ambas comandam o
      cofre — "Destino da sobra" reparte sobra entre dívida e cofre, "Fundo
      soberano" aplica o cofre. Tirado o teto de 10% do PIB do cofre: o fundo
      cresce sem limite. Teste `cofre.test.ts` 9/9.
- [x] B4. PIB em reais (`pib_nominal`) e verbas nominais: índice de preços reduz seu poder de compra nos efeitos não fiscais, com comparação anual na janela da lei. A verba só muda nominalmente por ação do jogador.
- [x] B5. Custo do salário mínimo nos benefícios (28/out): coeficiente 0,029 →
      0,08 (R$ 400 mi por R$ 1) nas **duas** consequências gêmeas do mínimo —
      `gasto_publico` (custa de verdade) e `deficit_previdenciario` (indicador);
      mudar só uma faria o indicador mentir 2,8× sobre o orçamento.
      `termoConstante` → −5,28 para o efeito seguir zerando no mesmo ponto
      (mínimo relativo 66).
- [x] B6. Aceite (28/out): `scripts/economia/aceite-equilibrio.ts` roda as 13
      estratégias da seção 6 de `equilibrio.md` e imprime esperado × obtido (é
      relatório, não teste que falha). `contasSemFuros` "cofre passa de 100%"
      religado e verde, agora que o cofre não tem teto. `npm run check` verde em
      28/out (111 arquivos, 541 testes).
      **Medição de referência para o item 10** (cenário "Nada muda", 8 anos):
      dívida 138,4% contra 119 do desenho; PIB real 91,7 contra 114 — o PIB real
      **cai** 8% sem o jogador agir. É o mesmo achado de 22/out (atividade 44,7 →
      39,7) com número comparável ao documento, não um defeito novo.

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
