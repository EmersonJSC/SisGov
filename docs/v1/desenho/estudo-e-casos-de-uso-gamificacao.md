# Estudo de game design e casos de uso de gamificação no SisGov

> **Status: RASCUNHO DE PESQUISA (17/out/2026).** Consolidação dos estudos e exemplos produzidos nesta conversa. Não aprova regras, números nem implementação. **Assinatura: gpto-revisar.**

## 1. Objetivo

Este documento reúne uma proposta geral de game design para o SisGov, o estudo do minijogo financeiro e exemplos de uso contínuo em segurança, educação, saúde e economia, além de um caso comparativo sobre privatização e estatização.

A pergunta central é: como transformar leis e índices em decisões de governo difíceis, compreensíveis e interessantes, sem reduzir o jogo a controles binários como “privatizar tudo”, “estatizar tudo” ou “prender todo mundo”?

**Hipótese central:** a unidade de jogabilidade é o problema público com demanda, capacidade, recursos, prazo, atores e consequências. As leis definem quem pode agir e dentro de quais limites; o jogador administra prioridades e combinações; índices mostram resultados, mas não são a mecânica inteira.

## 2. Referenciais de game design

### 2.1 Decisões interessantes

A palestra de Sid Meier sobre decisões interessantes inspira um teste prático: uma escolha precisa oferecer alternativas viáveis, com custos e consequências diferentes. Se uma opção é sempre superior ou não há informação útil para comparar, a decisão vira um clique sem estratégia. Isso é uma referência de prática, não uma lei universal do design. [GDC, *Interesting Decisions*](https://www.gdcvault.com/play/1015756/interesting)

### 2.2 MDA: regras, dinâmica e experiência

O modelo MDA organiza o design em mecânicas (regras e ações), dinâmicas (comportamentos que emergem durante a partida) e experiência do jogador. Para o SisGov, a intenção é produzir a experiência de governar sob escassez, atrasos, pressão e incerteza. O desenho deve então provar que as regras produzem ciclos de planejamento, resposta e aprendizagem. Uma ficha detalhada que não gere decisões ou mudanças observáveis não basta. [Hunicke, LeBlanc e Zubek, MDA](https://aaai.org/papers/ws04-04-001-mda-a-formal-approach-to-game-design-and-game-research/)

### 2.3 Ação significativa e feedback

A ação do jogador deve ter consequência perceptível e fazer diferença em momentos futuros. Isso combina com a exigência do SisGov de explicar “por que mudou?” e mostrar efeitos com atraso. [Salen e Zimmerman, conceito de meaningful play, resumido nos anais Meaningful Play](https://meaningfulplay.msu.edu/proceedings2014/abstract.php?paperid=28)

### 2.4 Jogos de simulação para políticas

Jogos de simulação para políticas ligam dilema, ação e feedback de forma deliberada: os participantes agem sobre um problema e vivenciam os efeitos pelas regras do jogo. Para o SisGov, isso significa representar as restrições e atores que fazem diferença na decisão, sem simular cada detalhe administrativo do país. [RIFS, *Simulation and Gaming for Policy Advice*](https://www.rifs-potsdam.de/en/output/publications/2017/simulation-and-gaming-policy-advice)

### 2.5 Teoria dos jogos

A teoria dos jogos é útil quando agentes com objetivos próprios tomam decisões interdependentes e antecipam as escolhas uns dos outros. No SisGov isso pode ocorrer com Congresso, grupos de pressão, empresas, governos estrangeiros e entes federativos. Uma reação fixa a uma barra de popularidade é um modelo de resposta, mas não necessariamente uma interação estratégica. Para usar teoria dos jogos, o desenho deve declarar agentes, ações, informação, ordem de decisões, incentivos e resultados observáveis.

## 3. Princípios para desenhar minijogos

Um mecanismo candidato deve responder com clareza à maioria destas perguntas:

1. Qual problema público o jogador administra?
2. Há pelo menos duas estratégias viáveis com custos diferentes?
3. Que recurso, capacidade, prazo, direito ou apoio limita a ação?
4. A ação altera um estado que afeta decisões posteriores?
5. Os efeitos têm prazo identificável?
6. Custos e benefícios recaem sobre grupos, áreas ou períodos diferentes?
7. O jogador recebe previsão antes e explicação causal depois?
8. Há ligação significativa com outra área sem fazer tudo afetar tudo?
9. Um erro gera possibilidade de recuperação?
10. Fontes sustentam leis e números, com hipóteses identificadas?

Minijogo significa aqui um ciclo de decisão reconhecível, não necessariamente uma tela arcade separada.

### Famílias de minijogos

| Família | Decisão do jogador | Exemplos |
|---|---|---|
| Capacidade e demanda | quanto, onde e quando expandir capacidade | energia, saúde, educação, prisões e transporte |
| Alocação de orçamento | como dividir recursos limitados | investimento em fontes de energia ou manutenção |
| Regulação e incentivos | como alinhar comportamento privado e interesse público | concessão, tarifa, subsídio e fiscalização |
| Portfólio e risco | como combinar alternativas com riscos e prazos distintos | matriz energética, projetos e dívida |
| Implementação e gargalos | qual etapa destravar primeiro | leitos sem profissionais, obras sem manutenção |
| Direitos e devido processo | como equilibrar garantias, evidência e capacidade | investigação, julgamento e pena |
| Coordenação federativa | quem paga, executa e responde | saúde, educação, segurança e saneamento |
| Negociação estratégica | que concessões fazer diante de atores com interesses | Congresso, grupos e coalizões, conforme o escopo |
| Gestão de crise | o que priorizar diante de choque e prazo curto | seca, apagão, epidemia e desastre |
| Transição estrutural | como mudar uma estrutura em etapas | privatização, estatização e transição energética |

## 4. Como separar as leis e os mecanismos

- **Esfera:** domínio de política pública usado para organizar e navegar, como saúde, energia ou justiça penal. É categoria, não mecânica.
- **Mecanismo:** ciclo de decisões que transforma ações em estados e resultados. Pode atravessar mais de uma esfera.
- **Lei:** regra jurídica real que habilita, limita, financia ou distribui autoridade dentro de um mecanismo.
- **Alavanca:** ação operacional disponível ao governo, como orçamento, taxa, contratação ou prioridade.
- **Índice:** medida de condição ou resultado; não deve ser o único conteúdo de uma esfera.
- **Situação:** estado persistente que cria contexto e urgência por gatilhos de entrada e saída.
- **Ator:** agente com interesse, capacidade e possibilidade de ação ou reação.

### Classificação de uma lei

Para posicionar cada lei, responder:

1. Qual problema público ela regula?
2. Qual mecanismo usa ou limita?
3. Ela define instituição/competência, direito/obrigação ou instrumento?
4. Que alavanca o Executivo controla sob essa lei?
5. Que estado muda diretamente e por qual cadeia ocorrem efeitos indiretos?
6. Qual órgão ou nível federativo executa?
7. A relação com outras leis é pré-requisito jurídico, dependência operacional, complemento, exclusão, externalidade ou sequência temporal?
8. Quais fontes sustentam o conteúdo legal e os parâmetros?

Cada lei deve ter uma esfera principal. Esferas secundárias servem para navegação cruzada, sem duplicar o item. Relações entre leis precisam especificar o tipo: regra jurídica, capacidade necessária, complementaridade, substituição, externalidade ou ordem temporal.

## 5. Caso de uso contínuo: segurança e justiça penal

### Situação

A população e a atividade econômica crescem. O governo precisa manter segurança e capacidade institucional sem tratar “mais prisão” como resposta única. Há procura por prevenção, investigação, perícia, julgamento, vagas prisionais e reintegração.

### Decisão

A cada período, o jogador divide recursos entre essas etapas. Se aumentar prisões sem perícia e tribunais, os processos podem se acumular e a prisão provisória pressionar o sistema. Construir vagas pode reduzir superlotação, mas custa dinheiro e não garante que crimes sejam esclarecidos nem que a reincidência caia.

O jogador identifica o gargalo: reforçar investigação, aumentar capacidade dos tribunais, ampliar vagas ou investir em prevenção e reintegração. Cada ação tem custo, prazo e efeito diferente. O painel acompanha crimes, casos esclarecidos, processos pendentes, superlotação, reincidência e custo fiscal.

### Por que funciona como jogo

A decisão é equilibrar resposta de curto prazo, chance de esclarecer crimes e prevenção futura. Leis definem garantias e poderes; o minijogo administra capacidade dentro delas. Direitos processuais são restrições legais e direitos, não simples penalidades numéricas. As relações empíricas e os parâmetros precisam ser pesquisados no desenho específico de Segurança.

## 6. Caso de uso contínuo: educação

### Situação

A população escolar muda e as escolas precisam manter vagas, professores, transporte, alimentação e materiais. O orçamento não permite expandir tudo ao mesmo tempo.

### Decisão

O jogador escolhe entre abrir vagas, contratar e formar professores, melhorar escolas existentes ou reduzir abandono. Abrir turmas sem docentes pode aumentar matrículas sem melhorar aprendizagem. Formação demora, mas pode elevar a qualidade do ensino em várias escolas. Transporte pode ampliar acesso em áreas afastadas; reforço pedagógico pode apoiar alunos que já estão matriculados.

O painel mostra vagas e profissionais disponíveis, custos, prazos, regiões atendidas e indicadores de presença, abandono e aprendizagem. O jogador percebe o custo de oportunidade: priorizar novas construções pode adiar manutenção ou formação.

### Por que funciona como jogo

A decisão é equilibrar acesso, qualidade e desigualdade territorial. O ciclo mostra gargalos e efeitos atrasados, sem assumir que gasto maior por si só aumenta aprendizagem. Fontes e dados educacionais devem sustentar os números no desenho da área.

## 7. Caso de uso contínuo: saúde

### Situação

A procura muda com tamanho e idade da população, doenças e cobertura da atenção básica. O sistema precisa de equipes, medicamentos, exames, prevenção e leitos.

### Decisão

O jogador distribui recursos entre postos, equipes, medicamentos, prevenção, diagnóstico e hospitais. Construir leitos pode ajudar pacientes graves, mas não resolve o gargalo se faltam profissionais ou se muitos casos poderiam ser tratados antes na atenção básica. Prevenção pode reduzir procura futura, mas demora a produzir efeito.

O painel mostra filas por atendimento, equipes, ocupação, custo, prazo e grupos atendidos. Depois da decisão, o jogador observa se a fila caiu ou se a pressão foi deslocada para outra etapa.

### Por que funciona como jogo

A escolha é aliviar o gargalo atual e investir no que pode evitar demanda futura. As regras de financiamento e prestação definem as alavancas disponíveis; o minijogo mostra onde a capacidade adicional terá efeito. Validar com dados e estrutura do SUS no desenho da área.

## 8. Caso de uso contínuo: economia e orçamento

### Situação

Sem uma crise específica, o governo arrecada impostos e precisa pagar compromissos, manter serviços, investir em infraestrutura e administrar a dívida. A arrecadação responde à atividade econômica; os investimentos levam tempo; os juros alteram o custo da dívida.

### Decisão

O jogador vê a receita esperada e sua margem de incerteza, os compromissos, o espaço disponível para decisões e a trajetória projetada de caixa e dívida. Pode preservar serviços e adiar obras, alterar receitas ou investir em capacidade produtiva e aceitar menos espaço fiscal no curto prazo.

Cortar investimento pode melhorar a conta atual, mas atrasar capacidade futura. Aumentar impostos pode elevar a receita esperada, mas alterar o comportamento de famílias e empresas. Financiar obras com dívida mantém recursos livres hoje, mas pode aumentar o custo futuro.

### Por que funciona como jogo

A decisão equilibra serviços presentes, capacidade futura e risco fiscal. O jogador escolhe prioridades, não precisa controlar todo lançamento contábil. O feedback deve separar déficit, dívida e caixa e explicar mudanças por resultado primário, juros, crescimento nominal, câmbio/indexação e operações patrimoniais, conforme a métrica escolhida.

### Base financeira pesquisada

O Tesouro apresenta receitas e despesas “acima da linha” para analisar as causas do resultado primário; o Banco Central publica dados “abaixo da linha” sobre financiamento do déficit. O Banco Central decompõe a variação da dívida em juros, resultado primário, câmbio e crescimento nominal. A legislação brasileira estabelece instrumentos orçamentários, metas fiscais e regras para créditos adicionais. [Tesouro, RTN](https://www.tesourotransparente.gov.br/ckan/dataset/resultado-do-tesouro-nacional), [BCB, Estatísticas Fiscais](https://www.bcb.gov.br/estatisticas/estatisticasfiscais), [LRF](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp101.htm), [LC 200/2023](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp200.htm), [Constituição Federal, arts. 165–169](https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm), [Lei 4.320/1964](https://www.planalto.gov.br/ccivil_03/leis/l4320compilado.htm).

## 9. Caso de uso: privatizar e estatizar

Este caso se apoia na proposta existente para empresas nacionais por setor, participação estatal e privada, valor patrimonial, transição em etapas, efeitos no caixa e receitas recorrentes. O exemplo abaixo é ilustrativo; números e efeitos devem vir de fontes para o setor e país escolhidos. [Desenho de empresas do país](empresas-do-pais.md#8-os-dois-minijogos-pedido-do-autor-13out)

### Situação comum

O país tem uma empresa estatal de energia que opera geração e rede. A demanda cresce e parte dos ativos precisa de modernização. A empresa gera dividendos ao Tesouro, mas também pode precisar de aportes. O governo pode manter e reformar, vender participação, comprar participação privada ou conceder a operação com metas públicas.

Ambos os governos abaixo começam com as mesmas condições: empresa, dívida, orçamento, demanda, estado dos ativos e capacidade de regulação. Isso permite comparar prioridades, sem atribuir resultados automáticos a rótulos ideológicos.

### Opções disponíveis

- **Manter e reformar:** investimento público agora; controle permanece estatal; dividendos futuros dependem de lucro e gestão.
- **Privatizar/vender participação:** o caixa recebe o valor da venda em parcelas; o Tesouro perde a parcela dos dividendos e pode receber impostos/royalties; investimento depende de regras, tarifa, contrato e fiscalização.
- **Estatizar comprando:** o Tesouro paga em parcelas, com caixa ou dívida; recebe parcela maior de dividendos e assume mais risco e necessidade de capital.
- **Conceder operação com metas:** a propriedade pode continuar pública, mas operação e investimento seguem contrato; há outorga, subsídio, metas, fiscalização e risco de renegociação conforme o arranjo.

Vender e estatizar o mesmo setor são caminhos incompatíveis enquanto houver uma transição em curso. Compra e expropriação são juridicamente distintas: expropriação não deve aparecer como sinônimo de estatização por compra e exige tratamento legal próprio.

### Governo comunista/socialista

Este governo prioriza propriedade pública, controle de setores estratégicos e capacidade de direcionar investimento. Sua proposta pode ser comprar participação privada em etapas e manter a geração sob comando estatal. Isso exige despesa de aquisição e financiamento, além de capital para modernização. O ganho esperado é maior controle sobre prioridades e sobre a parcela dos lucros que pode retornar ao Tesouro. O custo é comprometer caixa ou elevar dívida, assumir risco de gestão e talvez reduzir recursos para outras áreas.

O resultado depende da execução, não do rótulo: a empresa tem gestão e capacidade de investir? O preço da compra reflete o ativo e seus riscos? O aporte vai para expansão, manutenção ou cobertura de prejuízo? Se a gestão e o investimento forem eficazes, capacidade e dividendos podem crescer depois do prazo. Se houver perdas, atrasos ou dívida cara, o Tesouro arca com o custo.

Esse governo também pode usar concessões com metas sem transferir propriedade, ou manter empresas privadas em setores que não considera estratégicos. O programa político orienta as prioridades, mas não precisa obrigar a estatizar tudo.

### Governo liberal

Este governo prioriza reduzir a participação direta do Estado, atrair capital privado e concentrar o orçamento público em funções que considera essenciais. Sua proposta pode ser vender uma parte da participação estatal ou conceder a operação com metas de investimento e qualidade. A venda pode reforçar o caixa no período de transição e reduzir aportes futuros. Em contrapartida, o Estado perde parte dos dividendos e passa a depender de regulação, contrato, concorrência possível e tributos/royalties.

O resultado também não é automático: concorrência fraca, contratos incompletos ou baixa capacidade regulatória podem elevar tarifas, reduzir qualidade ou levar a renegociações. Venda em momento ruim pode gerar pouco caixa. A receita da venda é extraordinária; usá-la em despesas permanentes cria uma lacuna quando o ativo já tiver sido vendido.

Esse governo pode manter uma estatal rentável ou estratégica, e pode usar concessões sem vender o ativo. O programa político orienta prioridades, mas não precisa privatizar tudo.

### Comparação no minijogo financeiro

| Item | Manter/reformar | Privatizar ou conceder | Estatizar comprando |
|---|---|---|---|
| Caixa no curto prazo | custo de aporte/investimento | entrada de venda ou outorga; custo contratual conforme arranjo | custo de aquisição e possível aporte |
| Receita pública recorrente | dividendos conforme participação e lucro | impostos/royalties e receitas contratuais; menos dividendos | maior parcela de dividendos conforme lucro |
| Obrigações futuras | investimento, operação e passivos mantidos pelo Estado | fiscalização, garantias e riscos contratuais que permanecem | operação, investimento e risco empresarial maiores |
| Serviço público | depende de execução e regime tarifário | depende de concorrência, contrato e regulação | depende de execução e regime tarifário |
| Capacidade | cresce após investimento e prazo | cresce se obrigações e incentivos gerarem investimento realizado | cresce se o Tesouro financiar e a empresa comexecutar |
| Riscos principais | gestão, aporte, governança e contingências | regulação, concentração, contrato e renegociação | preço de compra, gestão, aporte e passivos assumidos |

O painel compara os mesmos períodos e mostra custo de oportunidade. Comprar a empresa pode adiar investimento em saúde ou educação; vender pode gerar caixa agora, mas retirar dividendos futuros; manter sem reformar preserva propriedade e ainda pode deixar a infraestrutura envelhecer.

### Exemplo de feedback

Se um governo comprar participação em dois turnos e iniciar uma expansão, o painel registra as parcelas de aquisição e investimento. A compra não aumenta a oferta imediatamente. Depois do prazo, a capacidade só cresce se a obra foi executada. A explicação separa custo de aquisição, financiamento, atraso e oferta adicional.

Se outro governo vender participação em dois turnos e direcionar parte da receita à redução de dívida e parte a investimento em outra área, o painel mostra a entrada extraordinária, a perda proporcional de dividendos e a estimativa de tributos futuros. Se a receita for usada em despesa recorrente, sinaliza que essa fonte termina junto com a venda.

Caso empresas, sindicatos, consumidores, grupos de pressão ou Congresso ajam estrategicamente, o desenho deve especificar informação, ações e incentivos de cada agente. Reações fixas a uma barra de “ideologia” não constituem, por si, teoria dos jogos.

## 10. O que evitar

- Tratar Estado versus mercado como a mecânica completa.
- Fazer índices funcionarem como botões sem recursos, comportamentos ou consequências.
- Confundir volume de leis e sliders com profundidade estratégica.
- Sobrecarregar o jogador com dezenas de gráficos sem alertas ou prioridades.
- Criar opções dominadas ou falhas irrecuperáveis.
- Inserir choques aleatórios sem explicar sua função e incerteza.
- Repetir microdecisões triviais a cada turno.
- Fazer todas as leis alterarem todos os índices, apagando causalidade.
- Tratar grupos sem ação ou capacidade como atores mecânicos.
- Copiar especificações, números, listas, nomes, textos ou arte de outros jogos; o conteúdo do SisGov deve partir de fontes próprias conforme D-67.

## 11. Método de protótipo e validação

Para cada esfera ou mecanismo:

1. Delimitar o problema e a competência jurídica.
2. Pesquisar fontes legais, séries oficiais e estudos empíricos.
3. Mapear atores, recursos, informação, capacidade e efeitos distributivos.
4. Desenhar um ciclo causal compacto, separando evidência, correlação e hipótese.
5. Listar decisões por turno, limites, atrasos e falhas.
6. Montar protótipo numérico pequeno e uma partida demonstrativa com cenários fixos.
7. Verificar se jogadores entendem o objetivo, preveem direção/prazo, reconhecem trade-offs e identificam recuperação.
8. Rever escolhas dominadas, turnos vazios, decisões repetitivas e complexidade excessiva.
9. Registrar fonte, unidade, data e incerteza de cada parâmetro.

Métricas úteis: escolhas viáveis, capacidade de explicar resultados, frequência de escolhas dominadas, turnos sem decisão, recuperação de crises, cobertura das leis no mecanismo e clareza causal. Limiares numéricos precisam ser definidos após playtest.

## 12. Próximos passos sugeridos

1. Revisar este vocabulário de esfera, mecanismo, lei, alavanca, índice, situação e ator.
2. Comparar os desenhos existentes com essa separação, sem sobrescrever documentos vigentes sem decisão do autor.
3. Usar energia como primeira prova do padrão demanda/capacidade, e elaborar ciclos próprios para segurança, educação e saúde.
4. No financeiro, conectar orçamento, cofre, receita, empresas e dívida sem duplicar regras dos chamados V1-37 e V1-38.
5. Usar o caso de privatização/estatização para testar a ligação entre decisão patrimonial, caixa, receita recorrente, capacidade produtiva e outras áreas.

## 13. Relação com os desenhos e chamados do SisGov

- O plano coloca mecanismos como a jogabilidade e propõe o padrão de necessidade, capacidade e crise quando adequado.
- `docs/v1/desenho/estudo-das-leis.md` já propõe ligações entre leis, dinheiro e minijogos.
- `docs/v1/desenho/empresas-do-pais.md` já detalha os conceitos de gangorra de propriedade e corrida da capacidade na energia.
- V1-37 trata de faixa contínua, aprovação política, curvas e Banco Central.
- V1-38 trata de dívida e política fiscal no motor.
- Este documento é pesquisa e exemplo de uso; não substitui nem altera o escopo desses documentos.

## 14. Referências

- Hunicke, Robin; LeBlanc, Marc; Zubek, Robert. “MDA: A Formal Approach to Game Design and Game Research” (2004). [AAAI](https://aaai.org/papers/ws04-04-001-mda-a-formal-approach-to-game-design-and-game-research/).
- Meier, Sid. “Interesting Decisions” (GDC 2012). [GDC Vault](https://www.gdcvault.com/play/1015756/interesting).
- Klabbers, Jan H. G. “Simulation and Gaming for Policy Advice” (RIFS, 2017). [RIFS](https://www.rifs-potsdam.de/en/output/publications/2017/simulation-and-gaming-policy-advice).
- Westera, Wim. “Serious games for higher education: a framework for reducing design complexity” (2008). [Journal of Computer Assisted Learning](https://onlinelibrary.wiley.com/doi/full/10.1111/j.1365-2729.2008.00279.x).
- O'Donnell, Casey. “Crafting Meaningful Play: Care and Meaning Making in/as/of/through Games” (Meaningful Play 2014 proceedings). [Michigan State University](https://meaningfulplay.msu.edu/proceedings2014/abstract.php?paperid=28).
- “Improving the decision-making qualities of gaming simulations” (2020). [Journal of Simulation / Taylor & Francis](https://www.tandfonline.com/doi/full/10.1080/17477778.2020.1726218).
- Banco Central do Brasil. [Estatísticas Fiscais](https://www.bcb.gov.br/estatisticas/estatisticasfiscais).
- Tesouro Nacional. [Resultado do Tesouro Nacional, série histórica](https://www.tesourotransparente.gov.br/ckan/dataset/resultado-do-tesouro-nacional).
- Tesouro Nacional. [Séries temporais de resultado fiscal, execução orçamentária e dívida](https://www.tesourotransparente.gov.br/visualizacao/series-temporais-do-tesouro-nacional).
- Brasil. [Lei Complementar 101/2000, Lei de Responsabilidade Fiscal](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp101.htm).
- Brasil. [Lei Complementar 200/2023](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp200.htm).
- Brasil. [Constituição Federal](https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm).
- Brasil. [Lei 4.320/1964](https://www.planalto.gov.br/ccivil_03/leis/l4320compilado.htm).
- Brasil. [Lei 8.987/1995, concessões e permissões de serviços públicos](https://www.planalto.gov.br/ccivil_03/leis/l8987cons.htm).
- SisGov. `PLANO.md`, `docs/v1/chamados.md`, `docs/v1/engenharia.md`, `docs/v1/diferenciacao-d4.md`, `docs/v1/conteudo.md`, `docs/v1/desenho/rede.md`, `docs/v1/desenho/indices.md`, `docs/v1/desenho/estudo-das-leis.md`, `docs/v1/desenho/leis-em-camadas.md`, `docs/v1/desenho/ciclos-dos-programas.md`, `docs/v1/desenho/empresas-do-pais.md`, `docs/v1/desenho/minijogo-financeiro.md`.

## Assinatura

**gpto-revisar** — texto de pesquisa e exemplos gerado por GPT; conferir fatos, fontes, parâmetros, convenções contábeis e compatibilidade com decisões do autor antes de tratar como regra do jogo.
