# Estudo unificado: game design, bolhas, empresas e Tesouro no SisGov

> **Status: RASCUNHO DE PESQUISA E MECÂNICA (17/out/2026).** Consolida as pesquisas e exemplos feitos sobre gamificação, bolhas de leis, finanças públicas, empresas e infraestrutura. Não aprova regras nem implementação. **Assinatura: gpto-revisar.**

## 1. O que este estudo tenta resolver

O problema não é falta de leis, índices ou motor. A questão é como transformar decisões do governo em ciclos calculáveis, conectados e compreensíveis: as leis definem condições; as ações mudam recursos ou capacidade; empresas e serviços respondem; o Tesouro registra fluxos diferentes; os resultados afetam as próximas escolhas.

A unidade útil para o desenho é o **mecanismo causal**. Uma esfera ou bolha organiza a navegação. Uma lei habilita, restringe ou financia uma ação. Um índice registra um estado ou resultado. O que torna a decisão jogável é a cadeia calculável que liga ação, estado, resposta e consequência.

Este documento reúne cinco estudos anteriores. Os arquivos originais continuam disponíveis como material de detalhe, mas este é o ponto de entrada consolidado:

- `jogabilidade-e-minijogos.md` — teoria de game design, tipos de decisão e critérios de minijogo;
- `minijogo-financeiro.md` — orçamento, caixa, dívida e escolhas fiscais;
- `estudo-e-casos-de-uso-gamificacao.md` — casos contínuos de segurança, educação, saúde, economia, privatização e estatização;
- `bolhas-leis-e-tesouro.md` — regras para bolhas e classificação de fluxos públicos;
- `mecanismo-economico-empresas.md` — proposta de cálculo de produção, lucro, tributos, dividendos e ligação com infraestrutura.

## 2. Referencial de design, aplicado ao SisGov

O modelo MDA distingue mecânicas, dinâmicas e experiência. O objetivo de design do SisGov é que as regras criem decisões com escassez, atraso, conflito de prioridades e feedback explicável. Uma lei rica em texto que não muda decisões ou resultados não cria, sozinha, jogabilidade. [Hunicke, LeBlanc e Zubek, MDA](https://aaai.org/papers/ws04-04-001-mda-a-formal-approach-to-game-design-and-game-research/)

A noção de decisões interessantes sugere avaliar se existem alternativas viáveis com custos diferentes e se o jogador tem informação suficiente para antecipar as consequências principais. [Sid Meier, GDC](https://www.gdcvault.com/play/1015756/interesting)

A teoria dos jogos entra quando agentes com objetivos próprios escolhem estrategicamente e antecipam decisões uns dos outros. Uma reação fixa a um índice é um modelo de resposta, não necessariamente um jogo estratégico. Para modelar Congresso, empresas ou grupos estrategicamente, é preciso especificar agentes, ações, informações, sequência e incentivos.

## 3. Vocabulário: bolha, mecanismo, lei, alavanca, índice

- **Bolha:** grupo de leis, ações e estados em torno de uma pergunta pública; organiza uma área de decisão.
- **Mecanismo:** cálculo que converte estados e decisões em novos estados e fluxos.
- **Lei:** regra jurídica que define competência, permissão, obrigação, limite ou incentivo.
- **Alavanca:** valor/ação que o governo pode decidir dentro das leis.
- **Índice:** medida de estado ou resultado; não substitui o cálculo causal.
- **Estoque:** quantidade acumulada ao longo do tempo, como dívida, caixa ou infraestrutura.
- **Fluxo:** entrada/saída por período, como imposto, dividendo, gasto ou juros.
- **Ator:** grupo ou instituição que executa, recebe, paga ou reage.

### Regras para uma bolha consistente

1. Uma pergunta central por bolha.
2. Um mecanismo principal que possa ser descrito como cálculo.
3. Leis associadas por função causal ou jurídica, não por semelhança do nome.
4. Separar regra legal de ação operacional.
5. Distinguir demanda, capacidade, custo, produção e resultado.
6. Identificar o gargalo atual e o recurso que limita a decisão.
7. Dar a cada conexão entre bolhas uma direção, condição e atraso.
8. Não duplicar lei nem dinheiro: uma lei tem uma ficha; outras bolhas referenciam seus efeitos.
9. Todo índice conectado deve ter papel definido no cálculo.
10. Cada parâmetro quantitativo precisa de fonte ou marca de hipótese.

A ficha mínima de uma bolha contém: problema, mecanismo, leis, alavancas, demanda, capacidade/estoques, atores, fluxos fiscais, resultados, relações cruzadas e parâmetros/fontes.

## 4. O mecanismo de empresas em uma fórmula

A proposta é simular grupos agregados por **setor × propriedade**, sem modelar cada CNPJ. Os grupos possíveis são estatais, grandes privadas nacionais, multinacionais e pequenos negócios. O piloto deve começar com poucos setores que tenham dados e relações claras.

Para cada setor `s` e grupo empresarial `g`, a conta mensal candidata é:

```text
capacidade_efetiva[s,g]
  = capacidade_instalada[s,g]
  × disponibilidade[s,g]
  × acesso_infraestrutura[s,g]

producao[s,g]
  = min(demanda_alocada[s,g], capacidade_efetiva[s,g])
  × eficiencia_operacional[s,g]

faturamento[s,g]
  = producao[s,g] × preco[s]

lucro_antes_imposto[s,g]
  = faturamento[s,g]
  − custo_fixo[s,g]
  − producao[s,g] × custo_unitario[s,g]
  − custo_financeiro[s,g]

imposto[s,g]
  = max(0, base_tributavel[s,g])
  × aliquota_efetiva[s,g]
  × conformidade[s,g]

lucro_liquido[s,g]
  = lucro_antes_imposto[s,g] − imposto[s,g]

dividendo_Tesouro[s]
  = participacao_publica[s]
  × percentual_distribuido[s]
  × max(0, lucro_distribuivel_estatal[s])
```

A base tributável depende da lei. Para imposto sobre lucro, não se deve usar o PIB como substituto sem justificativa. Dividendos incidem sobre lucro distribuído e participação pública; não são faturamento. A estatal pode pagar tributos legalmente aplicáveis e, separadamente, dividendos ao seu acionista público.

A produção é limitada pela menor entre demanda e capacidade efetiva. Portanto, infraestrutura maior só eleva vendas quando a capacidade era o gargalo e existe demanda. Se a demanda for menor que a capacidade, o efeito pode aparecer como redução de custos sem aumento de produção.

### Exemplo matemático pequeno — valores fictícios

Antes da mudança no estoque agregado de transporte:

```text
Demanda = 100; capacidade efetiva = 80
Produção = min(100, 80) = 80
Preço = 10; faturamento = 80 × 10 = 800
Custo unitário = 7; custos = 80 × 7 = 560
Lucro antes de imposto = 800 − 560 = 240
Alíquota efetiva = 20%; imposto = 240 × 0,20 = 48
Lucro após imposto = 240 − 48 = 192
```

Depois, suponha que o estoque agregado de transporte, após aumentar gradualmente, reduza o custo unitário para 6 e eleve a capacidade efetiva para 100:

```text
Produção = min(100, 100) = 100
Faturamento = 100 × 10 = 1.000
Custos = 100 × 6 = 600
Lucro antes de imposto = 1.000 − 600 = 400
Imposto = 400 × 0,20 = 80
Lucro após imposto = 400 − 80 = 320
```

- Empresa privada: imposto mensal vai de 48 para 80, aumento de 32.
- Estatal 100% pública distribuindo metade do lucro: dividendo vai de `192 × 0,50 = 96` para `320 × 0,50 = 160`, aumento de 64, além dos tributos aplicáveis.
- Participação pública de 40%, com a mesma regra de distribuição: dividendo vai de `192 × 0,50 × 0,40 = 38,4` para `320 × 0,50 × 0,40 = 64`, aumento de 25,6.

Os números acima são didáticos, sem fonte empírica, e não devem entrar como parâmetros do jogo. Se a demanda fosse 70, a capacidade maior não elevaria produção acima de 70.

## 5. Infraestrutura: decisão importante sobre escopo

O motor/conteúdo já contém investimento agregado e estoques de infraestrutura, como `infraestrutura_transportes` e `infraestrutura_energia`. A consequência atual de investimento eleva esses estoques com atraso. **A proposta-base usa esses estados agregados e não assume projetos ou obras individuais.**

A cadeia proposta é:

```text
investimento agregado do governo
→ aumento gradual do estoque de infraestrutura (com atraso já definido)
→ mudança em custo, disponibilidade ou capacidade dos setores expostos
→ produção/custos/lucro empresarial
→ impostos e/ou dividendos, calculados sobre as bases corretas
→ Tesouro e novos limites de gasto/investimento
```

A conexão não precisa dizer qual estrada ou empresa foi beneficiada. Para a primeira versão, cada setor tem um coeficiente de exposição a cada estoque agregado. Por exemplo, transporte pode afetar custos logísticos de agro/mineração; energia pode afetar disponibilidade/custo de indústria. Os coeficientes são hipóteses até serem pesquisados e calibrados.

Não há retorno fiscal imediato quando o investimento é aumentado. Primeiro sobe o estoque com o atraso já modelado; só depois a camada empresarial recalcula custo/capacidade, produção, lucro e tributo/dividendo. Projetos individualizados, localização regional, fila de execução e estouro de custo são uma possível extensão futura, ainda não decidida.

## 6. Como separar as empresas e calibrar produtividade

Começar com poucos grupos e setores agregados. Cada célula setor × propriedade pode guardar: capacidade, utilização, produtividade, preço, custo unitário, faturamento, lucro e participação pública. Não é necessário simular cada empresa real.

Empresas estatais e privadas no mesmo setor devem compartilhar parâmetros técnicos de base, salvo diferença sustentada por dados ou regra explícita. A propriedade, por si só, não deve aplicar bônus automático de eficiência. Ela muda participação nos lucros, responsabilidade por investimento, risco e governança conforme as leis.

Produtividade deve ter definição operacional (por exemplo, produção por unidade de trabalho/capital) e ser calibrada por setor. Na primeira versão, talvez seja mais robusto fazer infraestrutura alterar custo unitário ou disponibilidade do que acrescentar um índice multifatorial com várias causas sobrepostas. Evitar contar uma infraestrutura simultaneamente como mais capacidade, mais produtividade e aumento direto do PIB sem identidade contábil.

## 7. O Tesouro: tipos de fluxo sem confusão

| Fluxo | Como calcular/registrar | Natureza |
|---|---|---|
| Tributo empresarial | base tributável definida em lei × alíquota efetiva × conformidade | recorrente e ligado à atividade/base |
| Dividendo estatal | participação pública × distribuição × lucro distribuível | variável; só há com lucro e distribuição |
| Venda de participação/ativo | preço da parcela vendida | entrada extraordinária e redução de ativo |
| Compra/estatização | preço da parcela comprada | saída, com aumento de participação/ativo |
| Aporte/subsídio | recurso efetivamente transferido | saída do Tesouro; distinguir capital de custeio |
| Outorga | pagamento previsto no contrato de concessão | receita contratual, possivelmente concentrada |
| Tarifa | pagamento do usuário pelo serviço | vai ao operador conforme contrato; não presumir que seja receita do Tesouro |
| Royalties | produção/preço × regra de partilha | receita ligada a recurso e preço, potencialmente volátil |
| Emissão de dívida | valor financiado | financiamento, não receita; cria passivo e juros |

Venda de estatal não é imposto recorrente. Dividendo não é faturamento. Aporte não deve desaparecer no mesmo agregado que gasto de serviço. Caixa, dívida e ativos precisam fechar com a contabilidade escolhida para o V1-38.

## 8. Privatização e estatização no cálculo

Usar uma participação pública `q[s]` entre 0 e 1. Venda reduz `q` e gera receita patrimonial uma vez; compra aumenta `q` e custa ao Tesouro ou gera dívida. Em períodos seguintes, `q` determina a parcela de dividendos potenciais do Estado. O segmento privado paga tributos conforme a lei.

Nenhuma mudança de propriedade deve, sozinha, mudar produtividade ou lucro. Para isso é necessário outro mecanismo verificável: investimento, governança, preço, competição, custos de capital ou qualidade da gestão. Expropriação é juridicamente distinta da compra e deve permanecer separada.

Um governo comunista/socialista pode priorizar aumentar propriedade pública; um governo liberal pode priorizar vender participação ou conceder operação. Ambos enfrentam custos, restrições e resultados dependentes de preço, lucro, investimento, gestão e regulação. O rótulo ideológico não dá multiplicador automático nem determina que todas as empresas sejam estatais/privadas.

## 9. Onde o mecanismo encaixa no motor existente

O motor tem rede determinística, estoques acumulados por taxas, atrasos e transbordo entre cofre e dívida. O que falta é o estado/balanço agregado das empresas e o cálculo endógeno de produção, custos, lucros, tributos e dividendos.

Achado de conteúdo a tratar antes de integrar: a lei de imposto de renda empresarial declara `tributo.base: "pib"`; uma consequência direta altera `arrecadacao`; a lei do papel do Estado também afeta arrecadação diretamente; investimento em infraestrutura altera produtividade diretamente. Se a nova camada gerar tributos/dividendos e efeitos de infraestrutura, essas vias genéricas devem ser revistas no piloto para evitar dupla contagem.

A camada econômica proposta receberia controles, leis, índices e estoques mensais; calcularia os grupos empresariais; devolveria fluxos de receita/despesa e resultados para a rede atualizar as bolhas fiscais. A ordem exata deve respeitar o orquestrador e a semântica mensal existentes. Não é necessário desenhar interface para definir esta mecânica.

## 10. Casos de uso reunidos

### Segurança e justiça penal

Recursos se distribuem entre prevenção, investigação, perícia, tribunais, vagas e reintegração. Mais prisões sem investigação/perícia pode aumentar processos pendentes; vagas aliviam superlotação, mas não resolvem esclarecimento nem reincidência. O jogador precisa escolher o gargalo e acompanhar custos, prazos, crimes, processos, capacidade e reincidência. Relações empíricas e direitos são especificados no desenho de Segurança.

### Educação

O sistema acompanha necessidade de vagas, professores, transporte e apoio pedagógico. Construir vagas sem docentes aumenta matrícula sem necessariamente melhorar aprendizagem; formação leva tempo; transporte pode ampliar acesso. O jogador equilibra cobertura, qualidade, abandono e distribuição territorial.

### Saúde

O sistema acompanha demanda, equipes, atenção básica, medicamentos, exames e leitos. Leito sem profissional não resolve o gargalo; prevenção pode reduzir demanda futura com atraso. A escolha é equilibrar atendimento atual e capacidade/prevenção futura, com efeitos em filas e desfechos.

### Economia e orçamento

Receita, compromissos, gasto discricionário, investimento, caixa, juros e dívida competem no tempo. O jogador escolhe prioridades e financiamento; investimento pode aumentar capacidade depois; receita depende da atividade e das leis. Déficit, dívida e caixa são conceitos distintos e devem aparecer separados.

### Empresas e infraestrutura

O investimento agregado aumenta estoques existentes de infraestrutura com atraso. Os estoques alteram custo/capacidade de setores expostos; a empresa só produz mais se houver demanda e capacidade complementar. Depois se recalcula lucro; então podem mudar tributos e dividendos. Não existe receita fiscal garantida nem projeto individual presumido.

## 11. Regras contra erros de cálculo

1. Venda de ativo não é tributo.
2. Emissão de dívida não é receita.
3. Dividendo incide sobre lucro distribuído, não sobre faturamento.
4. Imposto incide sobre base definida na lei, não automaticamente sobre PIB.
5. Empresa estatal pode pagar tributo e dividendo, em cálculos separados.
6. Investimento agregado não vira capacidade no mesmo instante; respeitar o atraso do estoque existente.
7. Infraestrutura só afeta setores com exposição definida.
8. Atividade maior não vira arrecadação automaticamente: custos, lucro, informalidade, conformidade e alíquotas importam.
9. Aumento de atividade não vira dividendo automaticamente: dependem participação, lucro distribuível e política de distribuição.
10. Comparar com cenário contrafactual para não atribuir à infraestrutura efeitos de câmbio, demanda, preço internacional ou outras leis.
11. Separar retorno fiscal (tributo/dividendo) de retorno social (serviço, tempo, acesso, saúde, segurança e produtividade).
12. Não duplicar as consequências atuais de arrecadação/produtividade ao integrar a camada nova.

## 12. Pesquisa e protótipo mínimos

1. Escolher um setor piloto com dados (por exemplo, energia ou transporte/logística).
2. Definir grupo empresarial e escopo estatístico, linha-base, período e fonte.
3. Medir ou estimar demanda, capacidade, produção, preço, custos, margem e propriedade.
4. Definir qual estoque agregado de infraestrutura o setor usa e que canal ele altera: custo unitário, disponibilidade ou capacidade.
5. Calibrar esse canal com dados/estudos; se não houver evidência suficiente, marcar faixa como hipótese.
6. Calcular imposto/dividendo para empresa privada, estatal e participação mista.
7. Comparar cenários com e sem aumento do estoque e fechar o fluxo fiscal.
8. Revisar efeitos diretos atuais de `arrecadacao` e produtividade para evitar dupla contagem.
9. Só então expandir para outro setor.

Não definir valores reais para as equações demonstrativas deste documento sem completar essa pesquisa. A pergunta “precisamos de projetos individuais de infraestrutura?” fica aberta; o protótipo inicial usa estoques agregados existentes.

## 13. Fontes principais

- Hunicke, LeBlanc e Zubek. [MDA: A Formal Approach to Game Design and Game Research](https://aaai.org/papers/ws04-04-001-mda-a-formal-approach-to-game-design-and-game-research/).
- Meier, Sid. [Interesting Decisions (GDC)](https://www.gdcvault.com/play/1015756/interesting).
- Klabbers. [Simulation and Gaming for Policy Advice](https://www.rifs-potsdam.de/en/output/publications/2017/simulation-and-gaming-policy-advice).
- Banco Central. [Estatísticas Fiscais](https://www.bcb.gov.br/estatisticas/estatisticasfiscais).
- Tesouro Nacional. [Resultado do Tesouro Nacional](https://www.tesourotransparente.gov.br/ckan/dataset/resultado-do-tesouro-nacional).
- Tesouro Nacional. [Empresas Estatais e participações](https://www.gov.br/tesouronacional/pt-br/ativos-da-uniao/empresas-estatais).
- Tesouro Transparente. [Boletim de Participações Societárias da União](https://www.tesourotransparente.gov.br/visualizacao/boletim-dinamico-participacoes-societarias-da-uniao).
- World Bank. [Infrastructure Foundations](https://www.worldbank.org/en/topic/infrastructure/publication/infrastructure-foundations-from-current-assets-to-future-growth).
- Ipea. [O investimento em infraestrutura no Brasil](https://repositorio.ipea.gov.br/handle/11058/5192).
- ANEEL. [Leilões de energia](https://www.gov.br/aneel/pt-br/assuntos/leiloes).
- Brasil. [Lei de Responsabilidade Fiscal](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp101.htm), [LC 200/2023](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp200.htm), [Constituição Federal](https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm), [Lei 4.320/1964](https://www.planalto.gov.br/ccivil_03/leis/l4320compilado.htm), [Lei 8.987/1995](https://www.planalto.gov.br/ccivil_03/leis/l8987cons.htm).
- SisGov: `PLANO.md`, `docs/v1/chamados.md` (V1-35, V1-37, V1-38), `docs/v1/engenharia.md`, `docs/v1/conteudo.md`, `docs/v1/desenho/empresas-do-pais.md`, `rede.md`, `minijogo-financeiro.md`, `jogabilidade-e-minijogos.md`, `bolhas-leis-e-tesouro.md`, `mecanismo-economico-empresas.md`; `src/engine/mechanisms/updateStock.ts`, `src/engine/runtime/computeNetwork.ts` e conteúdo das leis/consequências citadas em `mecanismo-economico-empresas.md`.

## Assinatura

**gpto-revisar** — consolidação de pesquisa e proposta de mecanismo gerada por GPT; revisar fontes, dados, fórmulas, contabilidade e compatibilidade com decisões do autor antes de tratar como regra.
