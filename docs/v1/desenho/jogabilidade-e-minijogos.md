# Jogabilidade sistêmica e minijogos do SisGov

> **Status: RASCUNHO DE PESQUISA (17/out/2026).** Estudo geral para orientar os desenhos dos mecanismos e a revisão das leis. Não aprova nem altera regras de jogo. O autor decide quais propostas viram desenhos aprovados e chamados.
> **Assinatura: gpto-revisar.**

## 1. Pergunta e resposta provisória

Como fazer o governo parecer um conjunto de decisões difíceis e compreensíveis, em vez de uma lista de leis binárias que empurram índices?

A hipótese deste estudo é que a unidade principal de jogo deve ser o **problema público com capacidade, recursos, prazo, atores e consequências**. Uma lei define quem pode agir, quais instrumentos existem e sob quais limites. O minijogo é a decisão recorrente sobre alocação, prioridade, sequência ou resposta dentro dessas regras. Índices medem resultados; não substituem a mecânica.

Portanto, “privatizar” ou “estatizar” não deve ser o jogo inteiro. Em cada esfera, o jogador precisa enfrentar uma tarefa concreta: manter oferta, expandir capacidade, atender demanda, distribuir custo, lidar com risco e escolher quando agir. A propriedade pode mudar incentivos e fluxos financeiros dentro desse sistema.

## 2. Referencial de game design

### 2.1 Decisões interessantes

Sid Meier descreve o jogo como uma sequência de decisões interessantes. Para o SisGov, isso sugere que uma escolha precisa apresentar alternativas viáveis com custos e consequências diferentes; uma opção obviamente superior, ou uma opção sem informação útil, produz clique em vez de decisão. A palestra original é uma referência de prática, não uma lei universal de design. [GDC, *Interesting Decisions*](https://www.gdcvault.com/play/1015756/interesting)

### 2.2 MDA: regras, dinâmica e experiência

O modelo MDA separa **mecânicas** (regras e ações), **dinâmicas** (comportamento que emerge durante a partida) e **experiência** (o que o jogador sente). O uso prático aqui: começar pela experiência pretendida — governar sob escassez, atraso e pressão — e verificar se as regras realmente criam ciclos de planejamento, resposta a crise e negociação. Não basta escrever uma ficha rica se o motor não produz dinâmica observável. [Hunicke, LeBlanc e Zubek, MDA](https://aaai.org/papers/ws04-04-001-mda-a-formal-approach-to-game-design-and-game-research/)

### 2.3 Ação significativa e feedback

Uma ação é legível quando o jogador consegue perceber o que mudou; é integrada quando essa mudança afeta decisões futuras e o contexto maior da partida. Isso converge com a exigência do SisGov de explicar “por que mudou?” e com a promessa de efeitos com atraso. [Salen e Zimmerman, conceito de meaningful play, resumido nos anais Meaningful Play](https://meaningfulplay.msu.edu/proceedings2014/abstract.php?paperid=28)

### 2.4 Jogos de simulação para políticas

Jogos de simulação para políticas devem ligar dilema, ação e feedback deliberadamente. Uma revisão metodológica sobre jogos para aconselhamento de políticas trata o jogo como exercício estruturado em que participantes agem sobre um dilema e vivenciam os efeitos através do feedback. Isso recomenda representar atores e restrições reais o suficiente para ensinar a estrutura da decisão, sem tentar simular cada detalhe do país. [RIFS, *Simulation and Gaming for Policy Advice*](https://www.rifs-potsdam.de/en/output/publications/2017/simulation-and-gaming-policy-advice)

### 2.5 Teoria dos jogos

Teoria dos jogos é útil quando há agentes com objetivos próprios, escolhas estratégicas e resultados interdependentes. No SisGov, aparece naturalmente em Congresso, grupos de pressão, empresas, governos estrangeiros e negociação federativa. Ela não exige transformar cada lei em duelo nem significa que exista uma solução matemática única. Para cada interação estratégica, o desenho deve declarar: jogadores/agentes, ações possíveis, informação conhecida, ordem das jogadas, incentivos, compromissos críveis e resultado observável.

**Aplicação:** não chamar uma mecânica de “teoria dos jogos” só porque há várias partes. Se um grupo apenas reage por uma fórmula fixa à aprovação, isso é modelo de ator/feedback. Há interação estratégica quando a resposta depende da antecipação das escolhas dos demais.

## 3. Diagnóstico do SisGov atual

Os documentos vigentes já identificam sintomas que sustentam a hipótese:

- Muitas leis afetam o cofre de modo recorrente, mas não há fluxos de venda, compra, dividendos ou empresas nacionais no estudo das leis.
- Há muitas leis sem grupo que reaja e poucas com patrocinador explícito.
- O preço da energia e a oferta aparecem em conteúdo, mas a cadeia de consequências não fecha; energia foi proposta como jogo de capacidade e prazo.
- A organização por esfera e hierarquia jurídica está em revisão, assim como os estudos de leis em camadas e catálogo.
- O plano já determina que mecanismos são a jogabilidade e que as áreas devem adotar o molde de necessidade crescente, capacidade com investimento e prazo e crise quando houver insuficiência, quando isso fizer sentido.

Conclusão: adicionar mais leis ou efeitos sem fechar ciclos jogáveis tende a aumentar volume e opacidade, não profundidade.

## 4. Princípios propostos para avaliar cada mecanismo

Cada mecanismo candidato deve responder “sim” à maioria destes critérios antes de virar conteúdo em massa:

1. **Problema legível:** qual necessidade ou risco o jogador está tentando administrar?
2. **Alavancas diferentes:** há pelo menos duas ações com vantagens e custos distintos, sem dominância óbvia?
3. **Restrição real:** dinheiro, capacidade, prazo, direito, informação ou apoio limitam o que pode ser feito?
4. **Ciclo fechado:** ação altera estado; estado afeta demanda, custo, atores ou risco; a próxima decisão muda por causa disso.
5. **Janela temporal:** algumas decisões precisam ser antecipadas, e ações têm implantação ou maturação identificável.
6. **Trade-off distribuído:** custos e benefícios recaem em grupos, regiões ou períodos diferentes.
7. **Feedback explicável:** antes da ação há previsão/riscos; depois, decomposição causal do resultado e indicação de incerteza.
8. **Interação com outras áreas:** pelo menos uma ligação significativa, sem fazer todas as leis mexerem em tudo.
9. **Falha recuperável:** crise cria pressão e escolhas de recuperação, não um colapso inevitável por erro inicial.
10. **Fonte e validade:** números e relações empíricas têm fontes; hipóteses são identificadas e testáveis.

Esses critérios são uma proposta de trabalho, não resultados empíricos já validados para o público do SisGov.

## 5. Taxonomia de minijogos

Minijogo aqui significa um ciclo de decisão reconhecível dentro do simulador; não requer uma tela arcade separada.

| Família | Decisão que dá ao jogador | Variáveis típicas | Exemplo de aplicação |
|---|---|---|---|
| Capacidade e demanda | Quanto, onde e quando expandir capacidade | demanda, estoque/capacidade, custo, prazo, qualidade | energia, leitos, escolas, vagas prisionais, transporte |
| Alocação de orçamento | Como dividir envelope limitado entre fins | orçamento, reserva, custo marginal, execução | investimento em fontes de energia ou manutenção de infraestrutura |
| Regulação e incentivos | Quais regras alinham comportamento privado e interesse público | tarifa, subsídio, imposto, fiscalização, investimento | concessão, saneamento, crédito |
| Portfólio e risco | Diversificar opções com riscos, retornos e prazos distintos | capacidade por tecnologia/setor, risco de choque, retorno | matriz energética, compras de defesa, carteira de projetos |
| Implementação e gargalos | Qual etapa destravar primeiro | equipe, compras, execução, corrupção, prazo | construir leitos quando faltam profissionais ou insumos |
| Direitos e devido processo | Como equilibrar proteção, garantias, evidência e capacidade institucional | investigação, julgamento, pena, reincidência, direitos | segurança e justiça penal |
| Coordenação federativa | Quem paga, executa e responde por lacunas | recursos e competências por nível de governo | saúde, educação, segurança, saneamento |
| Negociação estratégica | Que concessão fazer diante de atores com interesses e poder | apoio, agenda, compromisso, informação, reação | Congresso, grupos de pressão e coalizões (quando escopo do jogo permitir) |
| Gestão de crise | O que priorizar sob choque e tempo curto | severidade, estoques, dano, janela de resposta | seca, apagão, epidemia, desastre |
| Transição estrutural | Como mudar uma estrutura ao longo de etapas | ativos, contratos, indenização, capacidade, confiança | estatização, privatização, transição energética |

As famílias podem combinar-se, mas cada ficha de mecanismo deve declarar uma família principal para manter o foco. Uma lei pode habilitar, restringir ou alterar parâmetros de um minijogo; não precisa ser, sozinha, um minijogo.

## 6. Camadas: esfera, mecanismo, lei e índice

Proposta de vocabulário para separar as coisas:

- **Esfera:** domínio de política pública no mapa/catálogo (saúde, energia, justiça penal, transporte...). É organização e navegação, não uma mecânica por si.
- **Mecanismo:** ciclo jogável que transforma decisões em estados e resultados (capacidade, alocação, investigação e processo, coordenação federativa...). Pode atravessar mais de uma esfera.
- **Lei:** regra institucional real que habilita, limita, financia ou distribui autoridade dentro de um mecanismo.
- **Alavanca:** escolha operacional do governo, como orçamento, taxa, contratação, composição ou prioridade.
- **Índice:** medida de resultado ou condição; jamais deve ser o único conteúdo de uma esfera.
- **Situação:** estado persistente com gatilhos de entrada/saída que cria contexto e urgência.
- **Atores:** quem tem interesse, capacidade de ação e resposta conforme o escopo do jogo.

### 6.1 Regra de classificação de leis

Para cada lei, responder nesta ordem:

1. Qual problema público ela regula?
2. Qual mecanismo é o principal destinatário da regra?
3. A lei cria uma instituição/competência, define um direito/obrigação ou escolhe um instrumento?
4. Qual alavanca o Executivo pode alterar sob essa lei?
5. Que estado mensurável muda diretamente? Que efeito é indireto e por qual cadeia?
6. Qual órgão/nível federativo executa, e qual ator pode reagir?
7. A lei é pré-requisito, alternativa, complemento ou restrição de outra?
8. Que fonte sustenta o conteúdo legal e os parâmetros empíricos?

**Esfera principal** deve acompanhar o problema regulado e a competência que executa. **Esferas secundárias** servem para navegação cruzada e nunca duplicam a lei. **Mecanismo** não precisa coincidir com a esfera: a política penal, por exemplo, pode ligar investigação, julgamento, prisões, reintegração e segurança, sem virar cinco cópias da mesma lei.

### 6.2 Tipos de relação entre leis

- **Pré-requisito jurídico:** uma opção só é legal se outra regra permitir.
- **Dependência operacional:** a política não funciona sem equipe, infraestrutura ou financiamento.
- **Complementaridade:** duas medidas aumentam o resultado uma da outra.
- **Substituição/exclusão:** duas opções competem pelo mesmo objeto ou são incompatíveis.
- **Externalidade:** a decisão afeta outra esfera sem torná-la dependente.
- **Sequência temporal:** uma intervenção deve preceder outra ou tem maturação.

Esses tipos não devem ser confundidos numa dependência genérica; cada um implica regras e explicações diferentes.

## 7. Protótipos de ciclo

### 7.1 Energia: corrida da capacidade

**Ciclo:** atividade econômica e população elevam demanda → jogador divide investimento entre fontes e reforço de rede → obras entram após prazos e com perfis distintos → capacidade confiável e custo mudam → risco de escassez afeta inflação, produção e opinião → nova decisão.

**Escolhas reais:** barato/rápido/intermitente; firme/caro/lento; exposição a combustível/importação; custo fiscal versus tarifa; manutenção versus expansão. A fonte de energia não pode ser só uma barrinha de porcentagem: deve haver demanda de pico, confiabilidade e prazo demonstráveis pelas fontes do desenho específico.

### 7.2 Segurança e justiça penal: cadeia de resposta

**Ciclo candidato:** crimes e capacidade de investigação → prevenção/investigação → casos com evidência → capacidade judicial e prisional → pena e reintegração → vitimização, reincidência, confiança e custo fiscal.

A escolha não é “prender muito ou pouco”. Expandir vagas pode reduzir superlotação imediata, mas custa e não substitui investigação ou prevenção. Aumentar pena pode ter efeito limitado se a probabilidade de esclarecimento for baixa; isso exige evidência e calibração, não suposição moral. Garantias processuais são restrições do sistema e direitos, não meros bônus negativos. Este é um ciclo candidato, a validar com fontes jurídicas e empíricas no desenho V1-14.

### 7.3 Saúde: acesso e capacidade de atendimento

**Ciclo candidato:** população e risco epidemiológico elevam procura → orçamento é dividido entre atenção básica, profissionais, leitos, medicamentos e prevenção → contratação e formação maturam em prazos diferentes → filas e desfechos mudam → crises e pressão política mudam prioridades.

A regra de financiamento e o modelo de prestação definem quais alavancas existem. O jogador deve poder escolher uma combinação e ver gargalos: comprar leitos sem profissionais ou prevenção pode ter retorno baixo. Validar com dados e estrutura do SUS no desenho da área.

### 7.4 Orçamento e dívida: espaço fiscal

**Ciclo candidato:** receita, gasto, juros e crescimento alteram resultado primário e dívida → regra fiscal distribui restrições entre rubricas → investimento presente compete com serviço da dívida e gasto corrente → capacidade produtiva futura pode ampliar base tributária → risco/juros alteram espaço fiscal seguinte.

Não reduzir o jogo a “cortar versus gastar”. Decisões devem distinguir gasto corrente, investimento, receita, vinculações, juros, prazo e cenário macroeconômico. O desenho V1-37/V1-38 detém as fórmulas econômicas concretas.

## 8. O que evitar

- **Binário ideológico como mecânica:** “estado/mercado” pode ser uma dimensão legal, mas as decisões operacionais precisam mostrar quem investe, quem assume risco, quem paga e quem recebe.
- **Índice como botão:** subir uma escala sem produzir recursos, comportamento ou consequência não cria jogo.
- **Falsa profundidade por contagem:** mais leis, sliders ou índices não garantem opções interessantes.
- **Painel de avião:** mostrar dezenas de séries sem prioridades, alertas e causa explicada transfere todo o trabalho ao jogador.
- **Dominância e armadilha:** se uma opção vence sempre, ou uma falha torna a partida irrecuperável, o sistema deixa de oferecer planejamento.
- **Randomização sem causa:** choques aleatórios só são úteis quando a gestão de risco é parte da decisão e há explicação da incerteza.
- **Micromanagement repetitivo:** decisões triviais que precisam ser refeitas todo turno criam trabalho, não estratégia.
- **Sobreconexão:** fazer cada lei alterar todos os índices torna impossível aprender causalidade e balancear.
- **Atores decorativos:** grupos sem ação, recurso ou consequência são texto de ambientação, não agentes do sistema.
- **Copiar a superfície de outro jogo:** usar jogos existentes apenas para discutir gênero e experiência; especificações, dados, nomes, números, listas e arte do SisGov partem de fontes próprias, conforme D-67.

## 9. Método de pesquisa e validação por mecanismo

Antes de reescrever em massa uma esfera:

1. Delimitar o problema público e a competência jurídica.
2. Buscar fontes legais primárias, séries oficiais e estudos de causalidade relevantes.
3. Mapear atores, recursos, informação, capacidade e efeitos distributivos.
4. Desenhar um ciclo causal compacto e distinguir correlação, hipótese e relação apoiada em evidência.
5. Escolher uma família de minijogo e listar decisões por turno, limites, atrasos e falhas.
6. Fazer protótipo numérico pequeno e uma partida demonstrativa curta, com cenário-base e choques fixos.
7. Perguntar a jogadores: entendem o objetivo? conseguem explicar consequências? há mais de uma estratégia viável? existe recuperação? qual decisão foi interessante e por quê?
8. Calibrar com sensibilidade e cenários; não ajustar leis individualmente para mascarar erro sistêmico.
9. Registrar fontes, versão dos dados e incerteza por parâmetro.

### Métricas de protótipo

- Proporção de decisões em que jogadores escolhem entre duas ou mais opções viáveis.
- Capacidade de prever a direção e o prazo dos efeitos, mesmo sem prever o valor exato.
- Quantidade de escolhas dominadas após testes de estratégia.
- Número de turnos sem decisão relevante e de decisões repetidas sem mudança de estado.
- Frequência de colapso inevitável e tempo necessário para recuperação.
- Cobertura: quais leis afetam o ciclo por relação explícita e quais estão soltas.
- Clareza causal: jogador consegue identificar os principais contribuintes de uma mudança.

Os limiares numéricos destas métricas ficam para o plano de teste de cada chamado; não são fixados sem playtest.

## 10. Proposta de próximos passos

1. Tratar este estudo como índice de princípios e vocabulário, sujeito à revisão do autor.
2. Revisar `estudo-das-leis.md`, `leis-em-camadas.md` e `ciclos-dos-programas.md` contra a separação esfera/mecanismo/lei/alavanca/índice, preservando os arquivos existentes até decisão explícita.
3. Usar o protótipo de energia como primeira prova do padrão capacidade-demanda, com números e relações verificados no chamado próprio.
4. Especificar segurança e justiça penal e saúde como ciclos separados, sem assumir que todos os problemas cabem no molde de capacidade.
5. Para cada esfera do Marco E, aprovar primeiro um mecanismo mínimo e as leis que o habilitam; só então expandir o catálogo.
6. Executar partidas de teste e revisar escolhas dominadas, falta de feedback, picos de complexidade e estratégias de recuperação.

Este documento não escolhe por si a ordem dos chamados, não altera o plano e não substitui as fontes reais exigidas para leis e números.

## Referências consultadas

- Hunicke, Robin; LeBlanc, Marc; Zubek, Robert. “MDA: A Formal Approach to Game Design and Game Research” (2004). [AAAI](https://aaai.org/papers/ws04-04-001-mda-a-formal-approach-to-game-design-and-game-research/).
- Meier, Sid. “Interesting Decisions” (GDC 2012). [GDC Vault](https://www.gdcvault.com/play/1015756/interesting).
- Klabbers, Jan H. G. “Simulation and Gaming for Policy Advice” (RIFS, 2017). [RIFS](https://www.rifs-potsdam.de/en/output/publications/2017/simulation-and-gaming-policy-advice).
- Westera, Wim. “Serious games for higher education: a framework for reducing design complexity” (2008). [Journal of Computer Assisted Learning](https://onlinelibrary.wiley.com/doi/full/10.1111/j.1365-2729.2008.00279.x).
- O'Donnell, Casey. “Crafting Meaningful Play: Care and Meaning Making in/as/of/through Games” (Meaningful Play 2014 proceedings). [Michigan State University](https://meaningfulplay.msu.edu/proceedings2014/abstract.php?paperid=28).
- “Improving the decision-making qualities of gaming simulations” (2020). [Journal of Simulation / Taylor & Francis](https://www.tandfonline.com/doi/full/10.1080/17477778.2020.1726218).

## Relação com documentos vigentes

Este estudo foi feito a partir de `PLANO.md`, `docs/v1/chamados.md`, `docs/v1/engenharia.md`, `docs/v1/diferenciacao-d4.md`, `docs/v1/conteudo.md`, `docs/v1/desenho/estudo-das-leis.md`, `docs/v1/desenho/leis-em-camadas.md`, `docs/v1/desenho/ciclos-dos-programas.md` e `docs/v1/desenho/empresas-do-pais.md`. Não se consultaram exemplos locais do Democracy 4.


## Assinatura

**gpto-revisar** — texto de pesquisa e proposta gerado por GPT; conferir fatos, fontes e decisões antes de tratar como regra do jogo.
