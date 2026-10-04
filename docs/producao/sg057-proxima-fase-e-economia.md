# Próxima fase: turnos, orçamento e capacidade de execução

Revisão de 3 de outubro de 2026, solicitada pelo usuário. Complementa SG057–SG064,
SG069 e SG077–SG080 sem renumerar os 96 chamados. Estado: plano de implementação;
as mecânicas econômicas abaixo ainda não foram implementadas.

**IA que auxiliou nesta revisão do planejamento: Gitinho.**

## Escopo imediato — manter pequeno

O trabalho atual não é modelar a economia inteira. Por enquanto, concluir apenas
um fechamento fiscal trimestral explicável: resultado primário acima da linha em
destaque, outras apurações identificadas separadamente no diário e aviso de que
caixa/financiamento não são calculados quando a fonte não permite. Valores
históricos servem para conferir conceitos e escala; não representam decisões ou
previsões do jogador.

Não entram neste passo: taxas endógenas, crédito privado, inflação, bancos,
reações de mercado, equilíbrio fiscal, curvas de retorno ou novos setores. As
seções adiante que tratam desses temas são um registro de ideias para etapas
futuras, não decisões aprovadas nem requisitos de implementação. Não pesquisar
novas séries ou definir coeficientes até existir uma pergunta concreta que
dependa deles.

## Recorte piloto do SG060-A

Decisão do usuário: preparar o piloto econômico para a transição ao governo
seguinte ao Lula III, sem fixar previamente o resultado eleitoral. Se Lula vencer
a eleição de 2026, o cenário será identificado como **Lula IV**; se perder, haverá
uma alternativa identificada provisoriamente como **Bolsoflavio I**, conforme o
nome indicado pelo usuário. Esses rótulos representam cenários condicionais do
jogo, não uma previsão nem um resultado eleitoral já confirmado.

O estado fiscal de partida usará os dados oficiais realizados mais recentes que
estiverem disponíveis quando o pacote histórico for preparado. Registrar para
cada série a fonte, período de referência, unidade, condição observado/estimado
e data de corte dos dados. Quando o fechamento oficial de 2026 estiver disponível,
atualizar o retrato de transição sem substituir observações por projeções
silenciosamente. Se o protótipo for montado antes desse fechamento, usar o último
período consolidado disponível e identificá-lo como tal; não o chamar de resultado
final de 2026.

O período inicial da partida e a referência de preços serão metadados do cenário.
A tela ainda mostrará apenas `Turno N`; períodos e datas permanecem nos dados e
nas explicações para auditoria.

O inventário inicial das fontes oficiais e suas limitações está em
[`sg060-fontes-fiscais.md`](sg060-fontes-fiscais.md). Foram identificadas fontes
do Tesouro Nacional (RREO, RMD e RARDP), a API SICONFI, Estatísticas Fiscais do
Banco Central e IPCA/IBGE. As fichas iniciais já registram os fluxos do RTN para
2025 fechado e janeiro–agosto/2026; a soma RTN de janeiro–agosto cruza com o
resultado acima da linha do RREO até arredondamento de R$ 1 mil. Estoques do
Anexo 6 foram capturados como posições contábeis. O RMD de agosto/2026 já fornece
ficha separada para DPF, composição, vencimentos e custo médio da carteira; isso
não reconcilia DPF com dívida consolidada líquida nem informa caixa livre.
Faltam validar a ficha anual contra as tabelas do RREO, escolher conceito
consistente para juros/resultado nominal e definir o índice e mês-base de preços.
Nenhum valor foi inserido no cenário executável.

## Onde estamos

O motor numérico, o carregamento, a bancada e o primeiro recorte em JSON existem.
As fases 03–06 possuem entregas e testes registrados. O mapa com mais de cem
políticas é um laboratório gerado para escala visual, não um país economicamente
calibrado nem a partida integrada da Fase 07. Sua conta de saldo é demonstrativa;
ainda não financia déficit, não mantém dívida e não representa bancos.

A próxima fase é a **Fase 07 — Partida completa**. O contrato temporal SG057-A
está especificado, mas ainda não implementado; SG060-A está em especificação para
fechar unidades, período-base histórico e identidades contábeis antes do
financiamento. A apresentação espacial fica mantida enquanto validamos escolhas
com consequências contábeis e sociais.

## Decisões já confirmadas para SG057-A

- Um turno político dura **três meses**.
- Cada turno executa **três passos técnicos mensais**. Isso preserva o passo
  mensal do cenário e permite que atrasos e cadeias se propaguem mês a mês,
  sem confundir a execução técnica com a decisão política trimestral.
- A interface apresenta somente o número do turno, sem data civil. A simulação
  mantém internamente os meses decorridos desde o estado inicial, avançando três
  a cada turno, para posicionar eventos e reconciliar períodos maiores.
- Decisões tomadas no encerramento do turno passam a valer no trimestre seguinte.
  Os três passos do trimestre que se encerra usam as políticas e metas que já
  estavam vigentes; uma decisão nova não altera meses já simulados.
- Eventos e situações são avaliados ao fim de cada passo mensal. Seus efeitos
  podem, portanto, influenciar os meses restantes do mesmo trimestre. O diário
  registra a sequência mensal e apresenta um resumo consolidado ao fim do turno.
- Receitas e despesas recorrentes serão apuradas mensalmente e somadas no resumo
  trimestral. As fórmulas, a conversão de valores anuais e as regras de juros e
  cobrança continuam sendo decisões do contrato fiscal SG060-A.
- Em cada mês, a ordem é: avançar a implantação em direção à meta vigente;
  executar um passo do motor com os controles resultantes; atualizar as contas
  daquele mês; e então avaliar situações e eventos. Eventos que se ativarem
  podem produzir efeitos nos meses seguintes, não retroativamente no passo que
  os detectou.
- Os três meses são preparados provisoriamente e confirmados como um único turno.
  Uma falha técnica em qualquer mês descarta o trimestre inteiro; a retentativa
  não pode duplicar cobranças, eventos ou efeitos.
- Ao fim do terceiro mês, a ordem é: fechar as contas do trimestre; consolidar e
  apresentar o diário; verificar se há eleição prevista; então, se a partida
  continuar, abrir a etapa de decisões do próximo turno. As novas decisões só
  entram em vigor nos três meses seguintes. As regras que determinam vitória,
  derrota, resultado eleitoral e continuidade do mandato são SG057-B, não parte
  deste contrato temporal.
- As taxas de implantação e degradação existentes representam a mudança total
  esperada em um trimestre. Para executá-las nos três passos mensais, usar a
  fração mensal equivalente:

  ```text
  fracao_mensal = 1 - (1 - fracao_trimestral)^(1/3)
  ```

  Por exemplo, uma fração trimestral de `0,30` equivale a aproximadamente
  `0,1121` ao mês. Com o mesmo alvo, três aplicações mensais produzem o mesmo
  avanço total que a aplicação trimestral atual, antes de efeitos de outras
  variáveis. Os dados existentes não devem ser reinterpretados como taxas
  mensais nem acelerados por aplicação repetida.
- A conversão de fluxos fiscais anuais para períodos mensais/trimestrais, juros,
  datas de cobrança e arredondamento permanece pendente do contrato fiscal
  SG060-A; não presumir conversão financeira nesta decisão temporal.

## Decisões ainda necessárias em SG057-A

O contrato temporal SG057-A está especificado. Sua implementação ainda depende
das fórmulas e conversões fiscais de SG060-A; as regras de resultado eleitoral
e continuidade dependem do SG057-B.

## SG060-A — identidades, unidades e períodos

### Decisão de período-base

Cada cenário histórico declara um período inicial e uma referência de preços
próprios (por exemplo, um governo ou mês/ano de partida). A interface continua a
mostrar `Turno N`, sem data civil. Valores monetários observados em outros períodos
só entram depois de convertidos para a referência de preços do cenário, usando
fonte e índice adequados documentados por série; não comparar valores nominais de
anos diferentes como se tivessem o mesmo poder de compra.

A primeira versão não simula inflação endógena: durante uma partida, os valores
monetários são reais e constantes na referência daquele cenário. Isso permite
inícios históricos distintos sem fixar todos em preços de 2024. Uma futura
simulação de inflação exigirá mecanismo, dados e contratos próprios; não é
autorizada implicitamente por esta decisão.

O contrato atual usa a unidade tipada `moeda_milhoes_2024_ano`. SG060-A deve
substituir o ano embutido por metadado explícito de referência de preços do
cenário, preservando validação de unidade e compatibilidade. Não basta trocar o
rótulo visual nem aceitar moedas sem base comparável.

### Conversão para cada passo mensal

- Fluxos recorrentes informados por ano são divididos por 12 para cada passo
  mensal; três passos compõem o fluxo do turno trimestral.
- Valores já declarados por mês não são divididos novamente.
- Estoques (caixa e dívida), taxas e índices não são divididos por 12.
- Transações únicas são lançadas uma vez no passo definido pela regra; não são
  repetidas nem rateadas automaticamente.
- Juros do cenário inicial vêm da despesa observada para aquele período e são
  representados como fluxo mensal compatível com o passo. Se a fonte disponível
  for anual, o total pode ser dividido por 12 somente como média mensal
  identificada; não aplicar essa média como taxa sobre todo o estoque da dívida.
- O custo de juros depende da composição e dos indexadores dos títulos. Não
  multiplicar a dívida inteira por Selic nem por uma taxa média sem contrato e
  evidência. Emissões novas e mudanças de custo da carteira existente exigem
  regra por instrumento ou agregado validado, a definir em SG060-B/C. A conversão
  de uma taxa anual efetiva para mensal só será usada quando uma regra desse tipo
  estiver definida; ela não substitui a série observada de juros do cenário-base.
- O diário e os exemplos manuais identificam período, unidade, base de preços e
  conversões. Arredondamento ocorre para apresentação; o estado conserva precisão
  suficiente para não acumular erro contábil por arredondamento visual.

### Conceitos econômicos para etapas futuras — não são regras aprovadas

Este quadro é apenas um mapa para evitar confusões quando o jogo chegar a essas
etapas. Não define fórmulas, indicadores de interface, ações do jogador ou
coeficientes. O trabalho imediato permanece na contabilidade básica do turno.

| Conceito | O que representa | O que pode influenciar | Efeito de jogo |
|---|---|---|---|
| Taxa básica de política monetária | Referência definida pela autoridade monetária para influenciar o custo do dinheiro de curto prazo | Pressões de inflação e expectativas, demanda em relação à capacidade produtiva, câmbio e credibilidade da política monetária; decisões têm atraso | Altera gradualmente condições de crédito e o custo de instrumentos públicos indexados ou refinanciados. Não reprecifica instantaneamente todos os títulos |
| Prêmio de risco soberano | Compensação pedida pelo mercado para emprestar ao governo, além da referência de mercado | Trajetória esperada da dívida e do déficit, capacidade de pagamento, previsibilidade das regras, estabilidade política e condições externas | Muda o custo das novas emissões e da dívida rolada; não muda de imediato o cupom dos títulos prefixados já emitidos |
| Custo médio da dívida existente | Custo efetivo do conjunto de contratos ainda em circulação | Indexador e taxa contratada de cada parcela, vencimentos, emissões/resgates e evolução das referências às quais a dívida está indexada | Determina a despesa de juros com defasagem. O jogador sente o custo ao longo de vários turnos, conforme a carteira vence ou é atualizada |
| Taxa de crédito a famílias e empresas | Custo de empréstimos fora do Tesouro | Taxa básica, custo de captação, risco de inadimplência, garantias, concorrência e saúde dos bancos | Afeta consumo, investimento, atividade, emprego, inadimplência e, com atraso, arrecadação. Pertence à extensão bancária SG060-C |
| Inflação | Variação geral do nível de preços, não uma taxa de juros | Demanda, capacidade de oferta, custos/choques, câmbio e expectativas; política monetária reage com atraso | Pode alterar poder de compra, custos e salários nominais. Fica fora da primeira versão, que mantém preços reais constantes, até haver contrato próprio |
| Alíquota tributária | Percentual legal aplicado a uma base tributável | Decisão legislativa do governo; a arrecadação também depende da base, regras, isenções, cumprimento e atividade | Mudar a alíquota não produz arrecadação igual a “alíquota × toda a economia”: a base e o comportamento podem responder. Modelar apenas quando houver base tributável e regras de incidência definidos |

**Possível cadeia causal futura, ainda não especificada:** decisões fiscais alteram
saldo primário e necessidade de financiamento; financiamento e previsibilidade
podem alterar a percepção de risco; novas emissões e rolagens passam a custo
compatível com essa percepção; juros pagos reduzem espaço para outras políticas.
Em paralelo, condições monetárias e de crédito afetam atividade e arrecadação.
Choques de oferta, câmbio ou confiança podem alterar os resultados, mas devem
ser eventos com causa e explicação, não penalidades aleatórias invisíveis.

**Instituições financeiras são duas decisões diferentes:**

**Decisão do usuário:** as duas dimensões poderão existir na campanha como
decisões separadas: (1) autonomia/mandato da autoridade monetária e (2)
propriedade estatal ou privada dos bancos comerciais. Seus efeitos e momento de
entrada continuam a ser especificados por etapas.

- **Autoridade monetária (Banco Central):** define a taxa básica e conduz a
  política monetária. Seu mandato, regras de decisão, nomeações e grau de
  autonomia determinam como o governo pode influenciá-la. Com autonomia, o
  Executivo não escolhe a taxa a cada turno; suas políticas ainda afetam a
  economia que a autoridade observa. Uma reforma que aumente a interferência
  direta pode permitir ao governo pressionar a taxa no curto prazo, mas deve
  trazer consequências no jogo — por exemplo, expectativas menos ancoradas,
  prêmio de risco ou inflação mais instáveis — sem presumir que a interferência
  sempre falhe ou sempre gere crise.
- **Bancos comerciais públicos ou privados:** propriedade estatal pode permitir
  crédito direcionado, financiamento de setores prioritários e instrumentos de
  desenvolvimento. Privatização pode reduzir o controle governamental sobre
  essas alocações e alterar competição, eficiência, cobertura ou acesso. Nenhum
  desses efeitos é automático: dependem de capitalização, governança, metas,
  risco de inadimplência e desenho regulatório. Um banco comercial estatal não
  define a taxa básica nacional; pode ofertar linhas específicas, mas continua
  sujeito a custo de captação, risco e limites de capital. Aportes, garantias e
  perdas precisam aparecer nas contas públicas uma única vez.

Assim, “estatizar/privatizar o banco” deve ser uma escolha de política
institucional sobre bancos comerciais, enquanto “mudar a autonomia ou o mandato
do Banco Central” é outra escolha, com cadeia causal própria. O jogo pode incluir
as duas ao longo da campanha. No primeiro circuito econômico, elas ficam fora:
usar a taxa básica e os juros herdados como condições externas já observadas;
depois incluir decisões institucionais com explicações, custos e efeitos
atrasados. A agência exata do jogador será definida antes de implementar cada
uma, não presumida nesta especificação.

#### Passo concluído e decisão imediata de apresentação

O exemplo manual anual de 2025 e a agregação de **um turno de três meses**
(junho–agosto/2026) estão registrados em
`docs/producao/sg060-fontes-fiscais.md`, usando a mesma vintagem RTN e sem
estimar parâmetros. O exemplo mostra os resultados “acima” e “abaixo da linha”
separados e identifica a falta de saldos de caixa compatíveis.

**Decisão do usuário:** no resumo do turno, o resultado primário acima da linha
fica em destaque; o resultado abaixo da linha e o nominal entram como
reconciliação no diário. Os rótulos devem preservar os métodos distintos. O
resultado nominal RTN é calculado a partir do resultado primário abaixo da linha
e dos juros nominais RTN — nunca somar os juros ao resultado acima da linha.

**Rascunho de apresentação do exemplo (não é tela nem partida executável):**

```text
FECHAMENTO FISCAL — JUNHO A AGOSTO/2026
Dados observados do RTN; não são previsão nem resultado de decisões do jogador.

Saldo primário                                  -R$ 50,693 bi
Receita líquida                                 R$ 609,572 bi
Despesa total                                   R$ 660,265 bi

Reconciliação no diário:
  Resultado primário — método abaixo da linha   -R$ 50,948 bi
  Juros nominais considerados pelo RTN          -R$ 296,150 bi
  Resultado nominal RTN                         -R$ 347,098 bi

Caixa final: não calculado
Financiamento do déficit: não modelado nesta etapa
```

O saldo primário acima da linha mostra, neste recorte, a diferença entre receita
líquida e despesa total segundo a apuração RTN. O valor negativo indica que a
despesa excedeu a receita naquele período; não diz, sozinho, quanto havia em
caixa nem como o déficit foi pago. O resultado abaixo da linha é uma apuração
distinta usada na reconciliação do RTN. O resultado nominal combina essa medida
abaixo da linha com os juros nominais considerados pelo RTN.

**Critérios de clareza para este resumo:**

- O número em destaque tem nome, período, unidade, sinal e fonte.
- “Déficit primário” não é chamado de “dinheiro que sobrou” nem de saldo de caixa.
- Os métodos acima e abaixo da linha nunca são somados nem apresentados como se
  fossem a mesma série; o diário explica a diferença sem esconder a divergência.
- O resultado nominal usa o resultado primário abaixo da linha e os juros RTN.
- O resumo identifica que os valores são observações históricas agregadas, não
  efeitos previstos das escolhas do jogador.
- Caixa e financiamento aparecem como “não calculados/não modelados”, não como
  zero e não como sucesso ou falha simulada.

Com esses critérios, o exemplo é legível como explicação contábil. A próxima
verificação mínima já pode ser feita sem decisões fictícias nem código econômico:

| Verificação do resumo junho–agosto/2026 | Resultado esperado | Observado |
|---|---|---|
| Somar receita líquida dos três meses da mesma vintagem RTN | R$ 609,5722 bi | Passa |
| Somar despesa total dos mesmos meses | R$ 660,2651 bi | Passa |
| Subtrair despesa de receita para o resultado acima da linha | -R$ 50,6930 bi | Passa |
| Mostrar abaixo da linha e nominal como reconciliação, sem trocar seus métodos | Conceitos identificados e identidades RTN preservadas | Passa |
| Deduzir saldo de caixa ou emissão necessária da série RTN | Não deduzir; informar que não está modelado | Passa |

Essa verificação encerra a etapa documental de legibilidade/aritmética do
exemplo, não valida ainda dados executáveis nem uma mecânica de financiamento.
O próximo marco pode ser a implementação mínima do fechamento primário como
relatório informativo, sem caixa, juros endógenos, dívida, taxas, novas fontes ou
alterações no cenário. Deve ser tratado como uma tarefa de código separada e só
começar quando o usuário decidir sair do planejamento.
Continuam fora deste recorte: previsão, balanceamento, regra de emissão,
reação do custo da dívida, controle da taxa básica, propriedade dos bancos,
crédito privado e inflação. As duas decisões institucionais confirmadas para a
campanha não entram nesse primeiro exemplo.

**Gamificação nesta etapa:** apresentar um resumo simples e rastreável do
fechamento do período, ligando decisão aprovada, custo contabilizado e resultado
fiscal. Não mostrar ainda painéis de previsão, faixa de incerteza, risco de
mercado ou efeitos macroeconômicos que o modelo não calcula.

### Identidades a demonstrar

  Para cada mês e na mesma base de preços: `R` é receita recorrente, `G` despesa
primária recorrente, `J` juros pagos, `C` caixa, `D` principal da dívida, `E`
emissões e `A` amortização de principal:

```text
resultado_primario = R - G
resultado_nominal = R - G - J
caixa_final = caixa_inicial + resultado_nominal + E - A
divida_final = divida_inicial + E - A
```

Essas identidades preservam déficit como resultado válido, não contam emissão
como receita nem amortização como despesa primária, e só reconhecem principal
emitido/amortizado uma vez no estoque. Pagamentos únicos, vencimentos, saldo
mínimo de caixa e política de uso de superávit precisam aparecer explicitamente
no teste; detalhes de financiamento executável e falta de caixa seguem em
SG060-B. No cenário histórico, `J` é a despesa efetiva observada ou uma hipótese
claramente identificada quando não houver série adequada; não é automaticamente
uma taxa multiplicada pelo estoque total. O exemplo manual continua sendo
requisito antes do código fiscal.

## O que o planejamento já cobria e o que faltava

| Tema | Cobertura anterior | Complemento desta revisão |
|---|---|---|
| Turnos e falhas atômicas | SG057 e SG061 | Diagnóstico visível, registro da partida e recuperação de erro |
| Receitas, despesas, déficit, dívida e juros | SG060 | Separar estoque/fluxo, resultado primário/nominal, caixa e refinanciamento |
| Taxas e transmissão econômica | Só custo histórico observado; sem causas no jogo | Distinguir taxa básica, prêmio soberano, custo médio da carteira, crédito e inflação; explicitar atrasos e agência institucional antes de calibrar |
| Disponibilidade de ações | SG058–SG059 | Separar autorização, liquidez, financiamento e capacidade operacional |
| Bancos, crédito e mercado de títulos | Sem recorte explícito | SG060-C: agentes agregados, solvência/liquidez e canais para a economia |
| Limites de políticas | Domínio numérico genérico | SG058-C: limite legal, execução física, saturação e retornos decrescentes |
| Corrupção e superfaturamento | Sem mecanismo explícito | SG058-D: governança, perda de eficiência e risco; sem associação automática entre gasto e corrupção |
| Ampliação das variáveis | Recorte inicial pequeno | Ondas com dependências, unidade, procedência e testes antes da expansão |

## Sequência de execução

1. **SG043-R — Reparar o laboratório e registrar o turno.** Corrigir os parâmetros
   demonstrativos que impedem o primeiro avanço, preservar decisões em erro,
   liberar o botão após falha e mostrar um diário. Não declarar a Fase 07 concluída.
2. **SG057-A — Fechar o contrato temporal.** As decisões iniciais confirmadas são
   trimestre por turno, três passos técnicos mensais e conversão equivalente das
   taxas de implantação/degradação existentes. Ainda falta fixar calendário,
   aplicação de decisões, cobranças, fatos descobertos ao final e ordem de
   confirmação. Taxas financeiras anuais precisam de regra explícita em SG060-A.
3. **SG060-A/B — Núcleo fiscal e financiamento mínimo.** Aplicar a referência de
   preços por cenário, normalização de fluxos e identidades mensais; primeiro
   demonstrar contas à mão, depois implementar a conta independente da interface,
   cenários com déficit e superávit e regras de financiamento. Expor restrições.
4. **SG058-C/D — Uma política completa de Saúde.** Validar demanda, capacidade,
   orçamento executado, entrega e saturação, incluindo desvios e fiscalização
   apenas após o modelo básico. Expandir outras políticas usando os mesmos mecanismos.
5. **SG060-C — Bancos e crédito agregados.** Acrescentar o canal financeiro quando
   a contabilidade fiscal estiver reconciliada. Essa extensão não bloqueia o
   teste inicial Tesouro–mercado de títulos, mas deve preceder a declaração de
   que o sistema econômico completo da versão está pronto.
6. **SG057-B e SG058-A/B — Autorização política.** Definir Senado e eleições;
   integrar aprovação, implantação e orçamento sem usar dinheiro como apoio político.
7. **SG061–SG064 — Confirmar a partida completa.** Um turno confirma todas as
   etapas ou nenhuma; testar continuidade, eleições e consequências adversas válidas.

O contrato fiscal pode ser desenvolvido e testado isoladamente após SG057-A.
A autorização final das ações aguarda SG057-B e SG058. Não usar o atalho de
aprovação da bancada como regra da partida.

## Quando entram novas variáveis

O quadro abaixo é um mapa de possibilidades futuras da Fase 07, não uma ordem
para adicionar tudo agora. A entrada de cada circuito depende de uma necessidade
demonstrada pelo jogo e da validação do circuito anterior. O escopo atual continua
restrito ao resumo contábil descrito no início deste documento.

| Onda | Variáveis/estados necessários | Condição para avançar |
|---|---|---|
| Fiscal mínima, SG060-A/B | Receita do período, despesa primária, juros, caixa, estoque de dívida, principal a vencer, emissão e amortização | Identidades reconciliadas por vários turnos; déficit não trava o motor |
| Indicadores fiscais derivados | Resultado primário e nominal, necessidade de financiamento; PIB do período e dívida/PIB quando o denominador estiver definido | Sem misturar PIB trimestral com anual; nenhuma duplicação de fluxos |
| Capacidade de Saúde, SG058-C | Demanda, capacidade instalada, pessoal/insumos agregados, capacidade administrativa, entrega e fila/cobertura | Mais gasto pode ajudar, mas o ganho marginal diminui e a capacidade demora a crescer |
| Governança, SG058-D | Fiscalização, exposição a contratações, perdas por desvio e preço contratado versus referência | Gasto alto sozinho não dispara corrupção; perdas explicáveis sem dupla contagem |
| Financeira ampliada, SG060-C | Taxa básica, prêmio de risco, custo de novas emissões, crédito, inadimplência e condição agregada dos bancos | Distinguir juros da dívida existente, juros de nova dívida e juros ao tomador |
| Macroeconômica seguinte | Base tributável, atividade/PIB, emprego, inflação e reação monetária simplificada | Cada elo tem unidade, atraso e hipótese; trajetórias estáveis antes de ampliar setores |

Quando um circuito futuro for aprovado, cada estado necessário receberá ID,
unidade, classe (estoque, fluxo, razão ou controle), domínio, valor inicial,
fonte ou hipótese, causas, destinos e testes de extremos. Fluxos e razões
derivados não precisam virar novos estados persistidos. Nem toda variável
contábil precisa ganhar uma bolinha no mapa.

## Backlog futuro — hipótese de contrato fiscal SG060-B (não aprovado)

O conteúdo abaixo preserva ideias para uma etapa posterior. Não implementá-lo
como contrato vigente: o escopo imediato é somente apresentar e verificar o
resultado primário do trimestre. As equações e exemplos abaixo não são aceites
de balanceamento nem decisões do usuário.

Todos os valores abaixo são do mesmo período e da mesma base de preços:

- R: receitas; G: despesas primárias; J: juros pagos;
- C: caixa; D: principal da dívida; E: emissões; A: amortização do principal.

Identidades da primeira versão, sem reavaliação cambial nem indexação:

```
resultado_primario = R − G
resultado_nominal = R − G − J
caixa_final = caixa_inicial + resultado_nominal + E − A
divida_final = divida_inicial + E − A
```

Déficit nominal é resultado_nominal negativo; superávit é positivo. Principal
amortizado não é despesa primária nem juros. Emissão não é receita tributária.
Superávit não reduz dívida automaticamente: definir quanto vai para caixa e
quanto financia amortização. Juros pagos com nova emissão entram uma única vez
no estoque, por E; não somar J novamente à dívida.

Necessidade de financiamento inclui vencimentos: mesmo com resultado nominal zero,
um vencimento de 20 exige caixa ou emissão de 20. Uma tabela simples por faixas de
vencimento distingue refinanciamento de dívida nova para cobrir gasto corrente.

Exemplos puramente sintéticos para discussão futura (não são dados históricos,
valores recomendados ou critérios de balanceamento), com caixa inicial zero e
dívida inicial 100:

| R | G | J | A | E | Caixa final | Dívida final | Leitura |
|---:|---:|---:|---:|---:|---:|---:|---|
| 100 | 100 | 5 | 0 | 5 | 0 | 105 | Déficit nominal de 5 financiado |
| 120 | 100 | 5 | 0 | 0 | 15 | 100 | Superávit mantido em caixa |
| 120 | 100 | 5 | 15 | 0 | 0 | 85 | Superávit usado para amortizar |
| 105 | 100 | 5 | 20 | 20 | 0 | 100 | Rolagem, sem aumento líquido da dívida |

Se emissão disponível e caixa não cobrirem os pagamentos, aplicar uma regra de
jogo explícita: limitar novas execuções, adiar despesas permitidas, registrar
atrasados ou produzir crise/inadimplência. Não criar dinheiro, permitir dívida
infinita silenciosamente nem tratar falta de financiamento como erro técnico.

O menu de uma política distingue: autorização, compromisso futuro, caixa disponível,
financiamento possível e custo recorrente. A interface exibe o motivo e estimativas;
a camada de jogo valida novamente ao confirmar o turno.

## Backlog futuro — bancos, Tesouro e autoridade monetária

Ideias conceituais ainda não detalhadas para o escopo inicial. A decisão do
usuário de incluir, em etapas futuras e separadas, autonomia/mandato do Banco
Central e propriedade pública/privada de bancos comerciais permanece registrada;
este backlog não define seus efeitos, calendário ou fórmulas.

Começar com três papéis agregados:

- Tesouro arrecada, paga e emite dívida.
- Bancos intermedeiam crédito, carregam ativos e têm restrições de liquidez/capital.
- Autoridade monetária define a regra de taxa básica e eventuais instrumentos
  explicitamente modelados; não é uma conta ilimitada do Tesouro.

Mercado de títulos e empréstimos privados não são o mesmo canal. Taxa básica,
prêmio de risco soberano, custo médio da dívida e taxa ao tomador são variáveis
separadas. Uma alta de taxa afeta novas emissões/rolagem conforme vencimentos,
não reprifica automaticamente toda a dívida de taxa fixa.

Primeiro validar relações simples: condição dos bancos → oferta/custo do crédito
→ atividade → base tributável; risco/rolagem → juros futuros → espaço orçamentário.
Definir atrasos e fontes/hipóteses. Não presumir que toda dívida seja detida por
bancos, que todo déficit provoque inflação, nem adotar crowding-out automático.
Balanços individuais, rede interbancária, câmbio e resgates detalhados ficam para
expansão posterior, salvo necessidade demonstrada pelo recorte.

## Backlog futuro — limites de políticas e capacidade

Ideias de planejamento; não são regras aprovadas nem entram no fechamento fiscal
atual.

### Uma lei tem limite? Separar quatro limites

1. **Jurídico:** opções admissíveis, vigência, competência e autorização. Uma lei
   que permite/proíbe algo não deve usar um controle de dinheiro sem significado.
2. **Orçamentário:** compromisso autorizado, execução financiável e recorrência.
   Não é um teto arbitrário de 100 para qualquer política monetária.
3. **Operacional:** pessoal, infraestrutura, insumos e capacidade de contratar e
   executar dentro do período. Ampliar capacidade pode ser outra decisão com atraso.
4. **De resultado:** cobertura tem população-alvo finita; uma entrega adicional
   pode ter retorno menor e atacar outra necessidade. Saúde não melhora sem limite
   por repetir a mesma relação linear.

Proposta de curva para testar, não coeficiente já validado:

```
q = capacidade_de_entrega(orçamento_executado, pessoal, infraestrutura, preços, gestão)
beneficio(q) = beneficio_maximo × (1 − exp(−q / escala_de_demanda))
```

O orçamento nominal pode aumentar; a entrega depende de q. Recursos excedentes
podem formar caixa autorizado, financiar capacidade futura ou ser mal utilizados
conforme regras explícitas. Não gerar melhora infinita e não confundir um limite
de demanda com uma proibição universal de investir mais.

Corrupção não decorre inevitavelmente de investir muito. Modelar oportunidades
de contratação, instituições, fiscalização e incentivos. Superfaturamento aumenta
preço por unidade; desvio reduz o que chega à entrega; ineficiência pode ocorrer
sem crime. O gasto pago continua contabilizado uma vez, mesmo quando entrega pouco.
Não subtrair o mesmo desvio duas vezes como gasto adicional e perda de caixa.

Cobrir: pouco gasto, expansão útil, saturação, capacidade ampliada com atraso,
fiscalização forte/fraca, preço elevado sem desvio, e teto legal. Antes de curvas
novas, criar mecanismos declarados com validação e testes; nunca esconder uma
limitação silenciosa no renderizador ou remover a validação de domínio do motor.

## Registro e explicações

O diário deve informar: início, decisão preparada, meta e nível efetivo, avanço,
resultados com causas/atrasos, mudança de situações e falhas com campo/ID/motivo.
Na integração fiscal, incluir receitas, despesas, juros, emissão, amortização,
caixa e dívida antes/depois; distinguir previsto de realizado.

Diário da interface não é o histórico técnico necessário para atrasos. A versão
atual guarda os últimos 100 registros em memória de sessão; recarregar os remove.
Persistência/exportação entram em SG081–SG082 junto do save. Falha técnica não
consome decisões ou avança turno; fatos negativos válidos devem avançar e ser explicados.

## Marco de aceite antes de ampliar o catálogo

- Avançar base, cortes e expansão por 60 turnos de teste sem falha numérica.
- Reconciliar caixa e dívida em cada turno, inclusive déficit, superávit e rolagem.
- Mostrar ao menos uma decisão autorizada mas com execução limitada por capacidade
  ou financiamento, com motivo; evitar dupla cobrança ao tentar novamente.
- Demonstrar retornos decrescentes, capacidade futura e perda de eficiência distintos.
- Demonstrar influências sociais/econômicas, sem transformar finanças no único objetivo.
- Só então adicionar novas políticas/variáveis que usem os contratos já verificados.
