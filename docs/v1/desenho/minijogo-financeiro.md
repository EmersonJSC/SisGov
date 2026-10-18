# Minijogo financeiro: orçamento, caixa e dívida (V1-37/V1-38)

> **Status: RASCUNHO DE PESQUISA (17/out/2026).** Proposta de jogabilidade para orientar os desenhos e chamados financeiros. Não altera as regras aprovadas do cofre, não escolhe fórmulas finais e não inicia implementação. **Assinatura: gpto-revisar.**

## 1. Pergunta de design

Como transformar orçamento, tributos e dívida em decisões de governo recorrentes, sem reduzir o financeiro a “aumentar imposto”, “cortar gasto” ou observar um medidor de dívida?

**Hipótese:** o minijogo financeiro deve ser um planejamento em horizonte curto e médio sob recursos incertos: sustentar serviços agora, escolher investimento que pode elevar capacidade futura, financiar choques, administrar vencimentos e manter uma trajetória de dívida que não se torne explosiva. As leis definem regras e limites; o jogador escolhe composição, sequência e prioridades dentro deles.

O dinheiro deve atravessar as esferas: investir em energia, saúde ou transporte disputa espaço com outras prioridades; cada decisão financeira deve revelar o serviço, grupo, região, período e risco que recebe o custo ou o benefício.

## 2. O que as fontes dizem e o que ainda é hipótese

### Evidência institucional

- O Tesouro apresenta a estatística “acima da linha” como fluxos de receitas e despesas, permitindo analisar as causas do resultado primário; o Banco Central publica estatística “abaixo da linha”, que analisa como o déficit foi financiado. São perspectivas complementares e úteis para o jogo separar **decisão fiscal** de **financiamento**. [Tesouro Nacional, RTN e série histórica](https://www.tesourotransparente.gov.br/ckan/dataset/resultado-do-tesouro-nacional)
- O Banco Central decompõe mudanças da dívida em juros nominais, resultado primário, câmbio e crescimento nominal do PIB. Isso mostra por que a dívida não pode ser um simples acumulador de déficits: composição, juros e denominador também contam. [BCB, Estatísticas Fiscais](https://www.bcb.gov.br/estatisticas/estatisticasfiscais)
- A LRF exige metas fiscais, previsão e arrecadação de tributos e responsabilidade na gestão fiscal. A LC 200/2023 associa metas anuais de resultado primário à trajetória sustentável da dívida, com horizonte plurianual. [Lei de Responsabilidade Fiscal](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp101.htm), [LC 200/2023](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp200.htm)
- A Constituição distingue PPA, LDO e LOA e estabelece tramitação orçamentária no Legislativo. Créditos adicionais têm regras próprias na Lei 4.320/1964. São referências para tratar orçamento como plano, autorização e execução ao longo do tempo, e não uma única decisão abstrata por turno. [Constituição Federal, arts. 165–169](https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm), [Lei 4.320/1964](https://www.planalto.gov.br/ccivil_03/leis/l4320compilado.htm)
- O SisGov já prevê cofre separado da dívida, transbordo, destino do resultado fiscal e rendimento do cofre descontado dos juros. Este desenho deve encaixar essas regras, não apagá-las. [Rede, seção 8](rede.md#8-decisões-do-autor-12out)

### Hipóteses de design a testar

- Planejar dois a quatro trimestres adiante deve dar horizonte suficiente para antecipar pressões, sem exigir que o jogador monte um orçamento anual minucioso a cada turno.
- O jogador deve gerir **envelopes de decisão** e mudanças relevantes, enquanto despesas obrigatórias, contratos, folha, transferências e serviço da dívida aparecem como compromissos já existentes. Reabrir cada linha todo turno seria micromanagement.
- Mostrar cenários de arrecadação e juros em faixas (esperado, favorável, adverso) deve ensinar risco melhor que previsões pontuais com falsa precisão.
- A reserva de caixa deve servir a choques e transições, e não ser uma segunda pontuação abstrata.

Nenhum desses pontos está validado por playtest. São propostas do estudo.

## 3. Ciclo central de jogo

```text
leis, atividade econômica e eventos
       ↓
previsão de receita, gasto obrigatório e vencimentos
       ↓
decisão: priorizar gasto, tributar, investir, reservar ou financiar
       ↓
execução com atraso e risco de entrega
       ↓
serviços e economia mudam; apura-se resultado primário
       ↓
caixa absorve parte do choque; dívida e juros se ajustam
       ↓
novo espaço fiscal e novo conjunto de escolhas
```

O ciclo tem três relógios:

1. **Caixa, dentro do turno:** entradas e pagamentos, contingência, choque, rolagem imediata.
2. **Orçamento, 1–4 trimestres:** execução de programas, compromissos e revisão de prioridades.
3. **Dívida e capacidade, vários turnos:** juros, vencimentos, maturação de investimento, confiança e crescimento.

Não é necessário expor cada lançamento contábil. A interface deve expor aquilo que muda a decisão e permitir abrir a explicação detalhada.

## 4. A mesa financeira do jogador

### 4.1 Visão principal: painel de decisões

| Bloco | O que o jogador vê | Ação possível |
|---|---|---|
| Receita | arrecadação corrente, tendência e faixa de incerteza; composição por tributo | propor mudança tributária ou revisar benefício fiscal |
| Compromissos | gastos obrigatórios, contratos, transferências, juros e programas em andamento | manter, reestruturar quando a lei permitir, propor alteração legal |
| Espaço livre | recursos ainda não comprometidos, por período | dividir entre áreas e contingência |
| Investimento | projetos, custo presente, prazo, chance/risco de execução e retorno público esperado | iniciar, adiar, cancelar ou escalonar |
| Cofre | liquidez, reserva mínima/objetivo e usos já autorizados | guardar, usar em choque, amortizar dívida, emprestar ou investir conforme regras vigentes |
| Dívida | estoque, juros, vencimentos, indexação e trajetória em % do PIB | escolher emissão/gestão dentro da lei e aprovar regras por Congresso quando exigido |
| Cenários | resultado provável e faixa adversa/favorável nos próximos períodos | comparar pacotes e submeter escolha política |

**Princípio de interface:** primeiro mostrar os 2–4 alertas que pedem decisão, depois permitir navegar por todas as linhas e hipóteses. Não deixar o jogador com uma parede de gráficos sem prioridade.

### 4.2 Ações por turno

Proposta inicial, sujeita ao motor e às regras já existentes:

- Definir ou ajustar envelopes de gasto discricionário por esfera.
- Escolher a divisão entre serviço corrente, manutenção e investimento onde houver competência.
- Constituir contingência/reserva ou usar reserva existente, respeitando a regra do cofre.
- Propor mudança de receita, benefício fiscal, regra fiscal, vinculação ou mandato do Banco Central, sujeita ao nível legal e à tramitação.
- Escolher como financiar uma necessidade temporária: caixa, reprogramação, emissão/rolagem de dívida ou receita extraordinária legalmente permitida.
- Priorizar quais projetos começam agora quando a execução e a capacidade administrativa forem limitadas.

Não se propõe “decidir a taxa de juros” como alavanca sempre disponível: o V1-37 já distingue Banco Central independente e subordinado. Política monetária e fiscal interagem, mas são sistemas institucionais diferentes.

## 5. Escolhas com trade-offs

### A. Serviço imediato × investimento com retorno

- Mais gasto corrente pode aliviar uma necessidade já aberta e gerar resultado percebido neste mandato.
- Investimento compete pelo orçamento e pode ter atraso, risco de execução e benefício além do mandato.
- Cortar manutenção parece poupar hoje, mas pode reduzir capacidade e elevar custo de reparo ou crise depois.

**Minijogo:** escolher entre propostas concretas com custo por período, grupo beneficiado, prazo, gargalo e resultado estimado. Não dar “retorno econômico” automático a todo investimento; cada setor sustenta seu mecanismo com evidência.

### B. Arrecadação × resposta da economia

- Subir uma alíquota gera receita marginal, mas bases tributárias e comportamento reagem.
- Baixar uma alíquota pode aliviar grupos ou atividade, com custo imediato e resultado comportamental incerto.
- Rever renúncias pode ampliar receita, mas afeta contratos, setores e serviços.

O V1-37 prevê curvas não lineares para alíquotas. O financeiro deve consumir essas respostas e mostrar a receita incremental, não duplicar uma fórmula no painel.

### C. Liquidez × dívida

- Usar o cofre pode evitar emissão de dívida ou corte abrupto diante de um choque, mas reduz proteção para o próximo choque e o rendimento da reserva.
- Reter caixa enquanto toma dívida pode ser caro, dependendo do custo de carregamento, liquidez e regras do cofre.
- Amortizar dívida reduz exposição futura, mas dinheiro pago deixa de estar disponível para serviço ou contingência.

A comparação deve mostrar custo líquido, risco e prazo, sem rotular uma opção como sempre correta.

### D. Risco de juros, inflação e câmbio × perfil da dívida

- A composição por indexador, moeda e prazo afeta o custo e a velocidade de transmissão de choques.
- Dívida curta pode ter custo inicial menor e risco maior de refinanciamento; prazo longo pode ter prêmio maior e dar previsibilidade.
- Dívida em moeda estrangeira pode parecer mais barata, mas expõe o Tesouro a desvalorização.

São relações gerais que exigem dados brasileiros e parâmetros do Tesouro para virar números. Não misturar dívida bruta do governo geral com dívida líquida do setor público sem declarar qual estoque a mecânica usa.

### E. Regra fiscal × flexibilidade e confiança

- Uma regra previsível pode melhorar planejamento e reduzir incerteza, mas limites mal desenhados comprimem investimento ou dificultam resposta a choque.
- Metas anuais e limites de despesa criam incentivos para antecipar, adiar ou reclassificar decisões; o jogo deve representar essas consequências apenas quando houver base e chamadas de escopo.
- Regra não substitui escolha política: define como as escolhas são avaliadas e quais consequências institucionais seguem do descumprimento.

## 6. Protótipo de uma rodada

### Situação

No trimestre atual, a arrecadação esperada está abaixo da previsão. Há uma seca que aumenta despesas emergenciais e reduz a oferta elétrica no trimestre seguinte. Ao mesmo tempo, um projeto de transmissão está pronto para começar e levará vários trimestres.

### Decisões possíveis

1. **Responder ao choque:** usar contingência, reprogramar orçamento, emitir dívida ou combinar opções. A folha mostra quem perde recurso quando há remanejamento e o efeito sobre a dívida.
2. **Preservar serviço:** escolher quais despesas têm proteção jurídica, quais podem ser adiadas e quais aumentam a capacidade de resposta.
3. **Proteger o próximo período:** reservar liquidez, começar transmissão agora ou aceitar risco de escassez. Começar obra tem custo imediato e não resolve a falta já aberta.
4. **Definir financiamento:** escolher composição/prazo da emissão conforme as regras vigentes; a trajetória mostra exposição a juros e câmbio.
5. **Ler o resultado no turno seguinte:** decomposição de resultado primário, juros, dívida/PIB, caixa, serviço entregue e erro da previsão.

A rodada é interessante se as opções forem todas viáveis, cada uma aliviar um risco e criar outro, e o jogador entender isso antes de confirmar. Os valores concretos e efeitos devem vir de fontes e do motor, não deste exemplo.

## 7. Como calcular e explicar sem criar uma “planilha-jogo”

A identidade contábil precisa fechar, mesmo que o jogador não veja fórmulas extensas:

- **Resultado primário** = receitas primárias − despesas primárias.
- **Resultado nominal** = resultado primário − juros nominais líquidos (convenção visual escolhida e documentada).
- **Variação do estoque da dívida** também depende de ajustes patrimoniais e cambiais, emissões, reconhecimento e outros fatores definidos pela métrica adotada.
- **Dívida/PIB** varia tanto pelo numerador (estoque) quanto pelo PIB nominal no denominador.
- **Caixa** é um estoque separado; uso, rendimento e transbordo seguem a regra já definida no desenho da rede.

A tela “Por que mudou?” pode decompor a variação em: resultado primário, juros, crescimento do PIB nominal, câmbio/indexação, operação patrimonial e diferença entre previsão e realizado. A contribuição de cada elemento deve seguir a métrica oficial escolhida e a convenção de sinal.

**Previsão:** separar “valor estimado” de “faixa de risco”; mostrar quais variáveis mais explicam a variação. Quando possível, deixar o jogador comparar a mesma decisão em cenários sem consumir turnos. Isso é análise de sensibilidade, não certeza de resultado.

## 8. Como conectar leis sem transformar tudo em slider fiscal

| Lei/instrumento | Papel no minijogo financeiro | Tipo de conexão |
|---|---|---|
| Modelo tributário e alíquotas | definem receitas e resposta das bases | receita recorrente, comportamento e distribuição |
| Regra fiscal e meta primária | definem restrição/plano e consequência política | trava institucional, horizonte e avaliação |
| Vinculações constitucionais | reservam partes da receita e reduzem flexibilidade | compromisso/competição por espaço fiscal |
| Destino do resultado fiscal | reparte superávit/deficit entre dívida e cofre | fluxo entre estoques, regra existente |
| Emissão de moeda | altera financiamento e interação com inflação | mecanismo monetário; hipótese de chamada específica |
| Prazo e indexação da dívida | alteram exposição e custo de rolagem | carteira de passivos e risco |
| Venda de reservas/ativos/estatais | gera fluxo extraordinário e altera patrimônio/renda futura | operação única + efeito recorrente |
| Investimento setorial | transforma recurso em capacidade com atraso | alocação + minijogo de cada esfera |
| Banco Central | decide juros conforme autonomia e mandato | agente institucional separado; V1-37 |
| Congresso | aprova orçamento e mudanças legais conforme escopo da V1 | veto, emenda e sequência política |

Uma lei só deve entrar na mesa financeira quando alterar um fluxo, estoque, restrição ou risco identificável. A mesa pode encaminhar para a lei da esfera correspondente quando a decisão for substantivamente de saúde, energia ou transporte.

## 9. Falhas que o desenho deve evitar

- **Déficit como punição única:** déficit pode financiar resposta a choque ou investimento; avaliar composição, custo, capacidade de pagamento e trajetória.
- **Dívida como placar moral:** distinguir nível, custo, prazo, moeda, credor, liquidez, trajetória e capacidade de serviço.
- **Austeridade sempre dominante:** cortes podem reduzir serviço, emprego, atividade e arrecadação; tamanho e prazo dependem de evidência e cenário.
- **Gasto sempre dominante:** gastos podem ter eficácia, tempo de execução e retorno diferentes; não assumir multiplicadores universais.
- **Previsão perfeita:** receitas, juros e PIB são incertos. Dar intervalos e explicar erros reduz sensação de que o jogo trapaceou.
- **Punir jogador por obrigação que não controla:** explicitar competências federativas, vinculações, contratos e aprovação legislativa.
- **Desafio impossível por dívida herdada:** oferecer decisões de ajuste graduais e consequências recuperáveis, preservando tensões reais.
- **Contabilidade inconsistente:** nunca misturar fluxo e estoque ou somar duas estatísticas oficiais com escopos diferentes.
- **Microgestão de rubrica:** dar decisão onde há escolha substantiva; automatizar cálculo e mostrar compromissos estáveis.

## 10. Plano de protótipo e aceite de design

Antes de fórmulas finais, criar uma rodada em papel/planilha conceitual com dados oficiais e hipótese marcada:

1. Fixar escopo contábil: governo central ou setor público consolidado; dívida bruta ou líquida; período e convenções.
2. Escolher uma linha de base brasileira com séries do Tesouro e BCB e registrar a data de extração.
3. Identificar envelope discricionário, compromissos, dívida e caixa. Para cada linha, indicar fonte, unidade, frequência, possibilidade de decisão e executor.
4. Criar pelo menos três estratégias que sobrevivam ao cenário-base: proteger serviços, consolidar trajetória fiscal e investir em capacidade; nenhuma deve dominar em todos os indicadores.
5. Rodar cenário-base, choque de receita, choque de juros e choque de crescimento com sementes/cenários fixos.
6. Verificar identidade de fluxo/estoque e comparar os principais agregados com as séries oficiais.
7. Fazer teste de mesa com jogador: explicar previsão, escolher pacote, justificar a troca, observar resultado e propor recuperação.
8. Revisar para reduzir variáveis que não mudam decisões e acrescentar as que abrem trade-offs reais.

### Perguntas de validação

- O jogador identifica o que pode decidir neste turno e o que exige lei/congresso?
- Entende a diferença entre déficit, dívida e caixa?
- Consegue explicar por que a dívida/PIB mudou?
- Encontra pelo menos duas estratégias plausíveis sem conhecimento técnico externo?
- Vê o impacto distributivo e setorial de cortar, tributar ou investir?
- Tem escolhas relevantes antes e depois de um choque?
- Um erro de previsão cria uma decisão de resposta, em vez de um fim inevitável?
- A mesa não exige refazer decisões estáveis em todos os turnos?

Os limiares de aprovação de playtest e os testes numéricos pertencem ao desenho aprovado e aos critérios dos chamados, não a este rascunho.

## 11. Relação com V1-37 e V1-38

- **V1-37** continua responsável pelo deslizador, salto legislativo, emenda, curva de resposta das alíquotas, independência do Banco Central e consequências da política monetária.
- **V1-38** continua responsável por calibragem macrofiscal, juros/crescimento/resultado primário na dívida, efeitos de regras orçamentárias, inflação, desemprego e ligação com risco/crédito/câmbio.
- Este documento propõe a **experiência e o encadeamento das decisões**, sem fixar coeficientes ou substituir os critérios já escritos nesses chamados.
- A interação com V1-15 (conteúdo fiscal e tributário) deve respeitar a ordem registrada no plano.

## 12. Fontes

- Banco Central do Brasil. [Estatísticas Fiscais: resultado primário/nominal, DLSP, DBGG e componentes da variação](https://www.bcb.gov.br/estatisticas/estatisticasfiscais).
- Tesouro Nacional. [Resultado do Tesouro Nacional, série histórica e metodologia “acima da linha”](https://www.tesourotransparente.gov.br/ckan/dataset/resultado-do-tesouro-nacional).
- Tesouro Nacional. [Séries temporais: resultado fiscal, execução orçamentária e dívida pública federal](https://www.tesourotransparente.gov.br/visualizacao/series-temporais-do-tesouro-nacional).
- Brasil. [Lei Complementar 101/2000, Lei de Responsabilidade Fiscal](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp101.htm).
- Brasil. [Lei Complementar 200/2023](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp200.htm).
- Brasil. [Constituição Federal, arts. 165–169](https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm).
- Brasil. [Lei 4.320/1964, orçamento e créditos adicionais](https://www.planalto.gov.br/ccivil_03/leis/l4320compilado.htm).
- SisGov. `docs/v1/desenho/rede.md`, seção 8; `docs/v1/desenho/indices.md`; `docs/v1/chamados.md`, V1-37 e V1-38; `docs/v1/desenho/jogabilidade-e-minijogos.md`.

## 13. Assinatura e estado

**gpto-revisar** — texto de pesquisa e proposta gerado por GPT; conferir fatos, fontes, convenções contábeis, compatibilidade com decisões do autor e desenho antes de tratar como regra do jogo.
