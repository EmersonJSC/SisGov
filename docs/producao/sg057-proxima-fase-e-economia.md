# Próxima fase: turnos, política e economia jogável

Revisão consolidada em 8 de outubro de 2026, após decisões do usuário.
Complementa SG057–SG064, SG069, SG077–SG082 e SG097–SG099.
Estado: SG057-A concluído no recorte temporal e conectado à interface da bancada; SG057-B1
concluído no recorte de pesquisa; SG057-B2 concluído no contrato documental. A partida integrada
e as demais mecânicas ainda precisam de implementação.

A revisão anterior de 3 de outubro teve auxílio de Gitinho. O presente texto
substitui suas instruções de execução divergentes; o inventário de fontes e as
evidências históricas permanecem em [fontes fiscais](sg060-fontes-fiscais.md).
O [plano de produção](../plano-de-producao.md) é o catálogo mestre de tarefas.

## Objetivo da primeira versão

O SisGov é um jogo inspirado em _Democracy 4_. O jogador escolhe políticas,
busca apoio, acompanha a implantação, sente consequências e disputa eleições.
A economia serve a escolhas como investir agora, aceitar dívida, economizar ou
tributar, com ganhos e perdas compreensíveis para grupos diferentes.

A v1 precisa de uma partida pequena e completa. Não exige uma reprodução
integral das contas públicas, pesquisas adicionais sem pergunta de jogo,
gestão de títulos ou um modelo macroeconômico completo.

Decisões vigentes:

- Presidência em turno único; maior total nacional vence. Segundo turno fica
  para depois. Vitória continua a partida, derrota a encerra.
- Senado com três cadeiras por estado e Distrito Federal, mandato de oito anos
  e renovação alternada de duas e uma cadeira por UF a cada quatro anos.
- Votação parlamentar com acaso controlado, influenciado por afinidade partidária
  e opinião pública. Mostrar estimativas, sem garantir aprovação.
- Propostas normalmente votadas no próximo fechamento trimestral; permitir um
  adiamento excepcional e explicado, com limite de dois turnos até a votação.
- Receitas, despesas, caixa, dívida, emissão automática e juros simples da dívida
  nova, mantendo o fluxo de juros herdado separado.
- Benefícios presentes podem render apoio; o peso crescente dos juros pode gerar
  desgaste político gradual. Toda relação tem causa, atraso e parâmetro visíveis.

Inflação, rating, crise fiscal, bancos, mercado financeiro, vencimentos, rolagem
e amortização ficam para depois da primeira versão. Capacidade avançada e
governança também não bloqueiam a primeira integração. Limites e implantação
já disponíveis continuam sendo utilizados e validados.

## Estado atual e próxima entrega

O motor, o carregamento, a bancada e o primeiro recorte em JSON existem. O mapa
com mais de cem políticas é um laboratório de escala visual, não a partida
integrada. Seu saldo demonstrativo não constitui financiamento ou dívida.

Frente ativa: revisar o aceite de SG057-B2. SG057-A está concluído no recorte
temporal e SG057-B1 no recorte de pesquisa. SG057-A tem três passos mensais na bancada,
testes comportamentais e fluxo verificado em tela; o registro vigente de progresso
fica no [chamado do plano principal](../plano-de-producao.md#sg057-a-contrato-temporal--concluído).
Aceite temporal e migração FIX-V1-02/04 concluídos; ver o
[inventário e testes](sg057-inventario-temporal.md). Em paralelo,
após SG057-B2, revisar SG098 e criar a partida SG099 antes da integração de SG061. A implementação
fiscal e a integração completa não são pré-requisitos para fechar SG057-A;
SG060-A/B usa esse contrato e SG061 reúne os componentes.

## Tempo e ordem do turno — SG057-A

- Cada turno político dura três meses e executa três passos técnicos mensais.
  A interface mostra Turno N; um contador absoluto interno mantém meses,
  vencimentos e prazos mesmo quando começa outro mandato.
- O turno começa com o resumo anterior. Ajustes que já cabem na autorização
  vigente podem valer desde o primeiro mês após validação. Propostas que precisam
  do Senado aguardam a votação; não mudam a meta implantada enquanto pendentes.
- Em cada mês: atualizar implantação segundo a meta autorizada; executar o motor;
  atualizar as contas; avaliar situações e eventos. Fatos descobertos ao final
  só afetam passos seguintes, inclusive meses restantes do mesmo trimestre.
- No fechamento: resolver a tramitação e votar propostas elegíveis; realizar
  eleições quando devidas; produzir o diário e confirmar a partida inteira.
  Uma aprovação nesse fechamento orienta a implantação do trimestre seguinte.
- Se uma votação coincidir com a renovação do Senado, vota a composição que
  encerra o mandato; a renovação ocorre em seguida, e a composição nova vale no
  turno seguinte. A coincidência não pode estender a tramitação além de dois
  turnos. Dilemas também precisam de regra explícita de resolução, sem
  encadeamento infinito no mesmo passo.
- Os três meses, votações, eleições, diário e estado dos sorteios são preparados
  provisoriamente. Falha em qualquer etapa preserva a partida anterior inteira;
  a retentativa não duplica cobrança nem refaz sorteios com outro resultado.

O calendário padrão presidencial tem 16 turnos por mandato. Os cinco anteriores
à eleição oferecem as ações de campanha já previstas em SG057-B. O turno
eleitoral não recebe novas decisões ordinárias de governo, mas avança os três
meses, políticas vigentes, contas e prazos normalmente. Após vitória, iniciar
novo mandato sem reiniciar país, juros, propostas ou mandatos senatoriais.

O cenário informa qual eleição senatorial vem a seguir; iniciar outra partida
não significa sempre começar pela renovação de duas vagas. Cenários que permitam
alterar legalmente a duração de mandato precisarão de regra explícita para
eleições já agendadas e mandatos em curso antes de habilitar essa ação.

As taxas de implantação e degradação existentes representam o avanço trimestral.
Converter para frações mensais equivalentes, sem triplicar o efeito:

```text
fracao_mensal = 1 - (1 - fracao_trimestral)^(1/3)
```

Com alvo constante, três aplicações mensais devem equivaler à trimestral.
Uma fração trimestral de 0,30 corresponde a aproximadamente 0,1121 por mês.
Conversão de dinheiro, taxa financeira e porcentagem de implantação são
operações diferentes.

## Senado, eleições e propostas — SG057-B e SG058-A/B

### Eleições e estado herdado

O cenário declara partidos reais, composição inicial, período e fonte.
O Senado tem 81 cadeiras: três por estado e DF, mandatos de oito anos, com
renovação alternada de duas e uma vaga por UF a cada quatro anos. Preservar
as vagas não disputadas. A referência institucional é a
[composição do Senado](https://www12.senado.leg.br/institucional/documentos/sobre-o-senado/atividade/composicao).

A apuração presidencial soma a intenção política dos grupos, ponderada pela
população, e vence o maior total nacional; segundo turno fica para depois.
Partidos são atores da simulação eleitoral; sua força reflete as ideias e os
programas que representam e o apoio dos grupos, sem exigir gestão de sua estrutura
interna. A preferência eleitoral representa o alinhamento dos grupos com ideias
e programas e pode mudar por efeitos políticos. A apuração
senatorial é separada por UF. Com duas vagas, atribuí-las pelas maiores médias
dos votos agregados aos partidos, permitindo que um partido conquiste ambas.
Esse cálculo converte votos partidários em cadeiras, sem exigir candidatos
individuais. Interesses sobrepostos não criam eleitores extras.

Em qualquer empate eleitoral entre partidos, cada partido empatado recebe um
resultado de d20; vence o maior. Se houver empate no dado, rolar novamente apenas
para os partidos ainda empatados. Essa regra substitui, no jogo, critérios ligados
à idade de candidatos não modelados. O resultado e os dados ficam explicados no
diário. O d20 não se aplica à votação parlamentar: sem a maioria ou o quórum
exigido, a proposta não é aprovada.

O cenário define a preferência política inicial de cada grupo, expressa pelo
alinhamento a ideias/programas e às forças eleitorais que os representam; efeitos
políticos podem alterá-la, sem tratá-la como sinônimo de aprovação do governo.
Efeitos políticos aumentam ou reduzem a parcela da coalizão governante no grupo;
a variação oposta é redistribuída proporcionalmente entre os demais partidos,
mantendo o total normalizado. Somar efeitos simultâneos antes da redistribuição,
limitar o apoio da coalizão entre 0% e 100% e preservar as proporções internas
dos partidos da coalizão e da oposição evita dependência da ordem de cálculo.
Cada política declara no JSON os grupos afetados e a variação em pontos
percentuais; o efeito político chega quando os efeitos da política alcançam
o grupo. Essa fonte já está aprovada. O ciclo de aplicação, revogação e
reativação, além da redistribuição nos extremos de 0%/100%, será especificado
nos FIX-V1-01/06 antes da implementação em SG058-A.

**Regra de jogo adicionada em 7 de outubro de 2026:** leis constitucionais são
distintas de políticas/leis ordinárias e ficam na Constituição dentro da esfera
federal. Uma proposta ordinária não pode retirar garantias constitucionais,
extinguir instituições protegidas ou contornar essas garantias. Isso exige uma
proposta de reforma constitucional, com processo e dificuldade próprios,
configuráveis pelo cenário e mais exigentes que a tramitação ordinária. A
interface representa a Constituição como proteção institucional, não como algo
imutável. Os detalhes visuais estão em `mapa-de-influencia.md`; indicadores e
situações permanecem fora de todas as esferas.

No conteúdo, o país declara Constituição e leis vigentes; o catálogo geral
reutilizável declara organizações/mecanismos possíveis; e políticas podem
alterar instituições e regras por seus processos próprios. O estado de governo
é inferido das instituições, leis e escolhas aprovadas, em vez de ser apenas um
rótulo selecionado. A atual configuração brasileira em `organizacao-politica.json`
é rascunho a reorganizar conforme essa separação.

**Decisões do usuário para a V1:** a emenda terá votação geral simplificada do
Congresso, representando Câmara e Senado em conjunto, sem apuração ou interface
separada para cada Casa. O Brasil real exige três quintos em dois turnos em cada
Casa do Congresso ([art. 60, § 2º](https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm));
a votação agregada é uma abstração de jogo, não uma reprodução do rito. Exigir
pelo menos 60% de apoio em cada uma de duas votações gerais simplificadas; esta
regra fica confirmada para a V1. As duas votações ocorrem no mesmo fechamento
trimestral; se qualquer uma falhar, a emenda é rejeitada.

O usuário também confirmou dois caminhos para mudar o regime: reforma
constitucional, seguindo o processo mais difícil; ou golpe fora da ordem
constitucional, suspendendo ou descumprindo regras vigentes sem aprovar a emenda
exigida. O golpe não depende de apoio parlamentar: requer apoio dos comandantes
das três Forças Armadas ou do Judiciário; não é necessário obter ambos.
**Decisões do usuário:** por enquanto, o apoio do Judiciário é tratado como
posição institucional da corte, sem simular juízes individualmente. Na referência
brasileira, o ministro da Defesa indica os comandantes e o presidente os nomeia;
para o jogo, a indicação depende de o ministro da Defesa apoiar o presidente,
e o presidente formaliza a nomeação. A dependência do alinhamento ministerial é
uma regra de gameplay, não uma exigência legal. **Direção aprovada pelo usuário:**
quando surgir vaga de comandante, a escolha aparece como evento. Antes de indicar
um candidato, o ministro consulta a preferência do presidente. O apoio do ministro
ao presidente determina quanto peso será dado a essa opinião; ela influencia a
indicação, mas não garante automaticamente o resultado. O calendário das vagas,
o conjunto de candidatos e a fórmula desse peso ainda serão definidos. Exemplos
de golpe são cancelar eleições ou dissolver o Congresso enquanto a Constituição
ainda os protege. Formas concretas de conquistar esses apoios, riscos e efeitos
políticos específicos ficam para conteúdo e balanceamento nos chamados de
implementação. O jogo infere o regime
das instituições e regras efetivamente vigentes, sem exigir que o jogador escolha
o rótulo “ditadura”.

Permanecem pendentes os parâmetros de implementação das maiores médias para duas
vagas. Não exigir biografias, personalidades ou gestão de
candidatos nem converter apoio nacional do governo diretamente em cadeiras.

Partido, governo, aprovação de uma medida, bem-estar dos grupos e intenção de
voto permanecem diferentes. SG058-A calcula reações diretas e aos resultados,
com origem rastreável e sem registrar duas vezes o mesmo benefício percebido.

### Acaso na votação parlamentar

Afinidade partidária e opinião pública formam tendências de apoio. O contrato
transforma essas tendências em votos com incerteza limitada: surpresa é possível,
mas as escolhas do jogador precisam continuar influenciando os resultados.
Afinidade bruta do JSON não é diretamente probabilidade de voto.

Definir quórum, maioria, probabilidades e o modo de representar dissidências
antes da implementação. Esses parâmetros serão ajustados por testes, não
escolhidos para forçar uma eleição ou decisão específica. Cada cadeira conserva
um voto formal; dinheiro público não compra pontos de aprovação.

O gerador aleatório pertence à partida. Salvar sua versão, semente e estado;
ordenar propostas e consumo de sorteios de forma estável. Consultar uma estimativa
não consome o sorteio da votação. A mesma partida restaurada, com as mesmas
escolhas, preserva a continuidade dos sorteios. Testes com sementes controladas
cobrem aprovação, rejeição e falha atômica.

A aleatoriedade aprovada inclui votação parlamentar e desempate eleitoral
por d20. Não transforma automaticamente economia, eventos ou a apuração
eleitoral inteira em sorteios. Os gatilhos de ocorrências existentes continuam
determinísticos.

### Tramitação curta

A regra inicial de balanceamento é:

1. Apresentar uma proposta cria pendência, preservando a política anterior.
2. Normalmente votar no próximo fechamento de turno.
3. Permitir um adiamento excepcional, com motivo e prazo restante visíveis.
4. No segundo fechamento, votar obrigatoriamente: aprovar ou rejeitar, sem
   aprovação automática pelo decurso de prazo.

Os prazos de um/dois turnos são a regra inicial aprovada, parametrizável para
testes; correspondem a até seis meses no jogo. SG057-B2 define quais condições
justificam o único adiamento. Não introduzir atraso aleatório sem regra própria.
Mudança de mandato e turno eleitoral não reiniciam a espera.

Ajustes dentro de uma autorização existente usam a rota executiva de SG050;
não precisam passar pelo Senado a cada alteração de verba. Após aprovação,
implantação e efeitos ainda seguem seus próprios tempos. Revogar a autorização,
reduzir execução e dissipar efeitos são processos diferentes.

## Economia para decisões de jogo — SG060-A/B

### Regras visíveis para o jogador

- Receitas e despesas são apuradas por mês e somadas no trimestre.
- O déficit não coberto pelo caixa é financiado automaticamente. Não há menu
  de compra de títulos, vencimentos ou negociação de empréstimos na v1.
- Superávit permanece em caixa. Não reduz automaticamente a dívida; amortização
  fica para uma evolução, não aparece nos exemplos nem é cobrada no aceite atual.
- A despesa de juros herdada vem do cenário como fluxo explícito. Não recalculá-la
  aplicando uma taxa nova sobre todo o estoque inicial.
- A dívida emitida durante a partida gera juros simples a uma taxa mensal fixa
  declarada no cenário. Cada emissão passa a gerar esse custo no mês seguinte.
  Taxa fixa não significa despesa de juros constante.
- Cada política declara seu impacto financeiro e como ele acompanha a execução.
  Para o recorte inicial, usar valores mensais de referência proporcionais à
  implantação. Declarar a escala: intensidade em dinheiro não é automaticamente
  porcentagem. Custos únicos têm momento explícito e são cobrados uma só vez.
- O jogador vê benefício esperado, custo por turno, necessidade de endividamento
  e compromisso adicional de juros antes de decidir. Estimativas usam o mesmo
  contrato da execução e não mudam o estado da partida.

O mapa mostra poucos estados causais, inicialmente caixa e dívida em
Tesouro/Economia. O painel fiscal detalha receita, despesa, juros e emissão,
com resumo trimestral e meses disponíveis no diário. Não expor controles
contábeis que não correspondam a uma decisão de jogo.

### Contrapartida política

Endividamento permite melhorar serviços agora e pode render apoio. O peso
crescente dos juros no orçamento também pode gerar desgaste gradual e diferente
entre grupos. Essa ligação é uma hipótese de design declarada no cenário:
SG058-A especifica a medida de comprometimento, atraso, limites e reação dos
perfis, incluindo os casos de receita nula ou muito baixa.

Não descontar aprovação apenas por repetir o número absoluto da dívida em
vários caminhos do grafo. Benefícios, custos e reação aos resultados precisam de
origem distinta; evitar punir duas vezes o mesmo efeito. A dívida não é derrota
automática, e o jogo não corta políticas silenciosamente.

Financiamento automático sem qualquer contrapartida tornaria a dívida ignorável.
O aceite de jogabilidade precisa demonstrar que compromissos e reação política
afetam decisões, sem transformar todo investimento financiado em erro.
Taxas, probabilidades e intensidade do desgaste serão balanceadas por comparação
de estratégias e testes com jogadores, não por exigência de realismo contábil.

### Períodos, unidades e fontes

Cada cenário declara período inicial, referência de preços e unidade. A v1 usa
valores reais na mesma base, sem inflação simulada. Substituir a unidade hoje
fixa em preços de 2024 por metadados validados; não trocar apenas o rótulo.

- Fluxos anuais recorrentes são divididos por 12; mensais não são divididos novamente.
- Caixa, dívida, índices e taxas não são divididos por 12.
- Taxa da dívida nova é declarada por mês. Se houver entrada anual, SG060-A deve
  definir se é taxa efetiva e sua conversão; não confundi-la com um fluxo de juros.
- Despesa anual observada com juros pode ser rateada em média mensal identificada
  para o fluxo herdado, nunca usada silenciosamente como taxa sobre toda a dívida.
- Custos únicos entram no mês declarado. Arredondamento é de apresentação;
  preservar precisão de estado e tolerância explícita nos testes.

### Identidades mensais e juros futuros

Todos os valores usam a mesma referência de preços. Antes do mês m:

- R e G: receitas e despesas primárias do mês, incluindo lançamentos únicos devidos.
- C e D: caixa e dívida total iniciais.
- N: estoque de dívida emitida durante a partida, inicialmente zero; faz parte
  de D e não é somado outra vez à dívida total.
- H: fluxo mensal de juros herdados declarado no cenário.
- i: taxa mensal fixa sobre N; J: juros pagos; E: emissão do mês.

```text
J = H + i × N
resultado_primario = R - G
resultado_nominal = R - G - J
caixa_provisorio = C + resultado_nominal
E = max(0, -caixa_provisorio)
caixa_final = caixa_provisorio + E
divida_final = D + E
divida_nova_final = N + E
```

O cálculo de J usa N do início do mês; portanto E só gera juros a partir do mês
seguinte. Juros financiados entram no estoque uma vez, através de E; não adicionar
J de novo à dívida. Não há capitalização contratual adicional além do custo
de financiar um déficit. Emissão não é receita, juros não são despesa primária,
e um déficit pode consumir caixa antes de exigir nova dívida.

Exemplos sintéticos, exclusivamente para testar as regras. Os valores e a taxa
não são dados brasileiros nem decisões de balanceamento:

| Caso                         |   R |   G |   H | i mensal | Caixa inicial | Dívida inicial | N inicial |    J |    E | Caixa final | Dívida final | N final |
| ---------------------------- | --: | --: | --: | -------: | ------------: | -------------: | --------: | ---: | ---: | ----------: | -----------: | ------: |
| Primeiro mês com déficit     | 100 | 100 |   5 |     0,01 |             0 |            100 |         0 |    5 |    5 |           0 |          105 |       5 |
| Mês seguinte do mesmo caso   | 100 | 100 |   5 |     0,01 |             0 |            105 |         5 | 5,05 | 5,05 |           0 |       110,05 |   10,05 |
| Superávit, caso independente | 120 | 100 |   5 |     0,01 |             0 |            100 |         0 |    5 |    0 |          15 |          100 |       0 |
| Déficit coberto por caixa    | 100 | 100 |   5 |     0,01 |            10 |            100 |         0 |    5 |    0 |           5 |          100 |       0 |

Sem amortização, superávit estabiliza a dívida e acumula caixa, mas não reduz seu
estoque ou os juros já contratados. Uma melhora de capacidade fiscal pode decorrer
de receita maior e ausência de novas emissões. Não prometer no painel uma
redução de principal que o modelo ainda não faz.

## Cenário histórico e evidências preservadas

### Recorte piloto

Permanece a decisão do usuário de preparar a transição após Lula III: cenário
condicional Lula IV, se Lula vencer 2026, ou alternativa provisória Bolsoflavio I,
se perder. Os nomes são rótulos escolhidos para cenários condicionais; não são
previsões nem resultados eleitorais afirmados nesta revisão.

Usar dados oficiais realizados, com fonte, período, unidade, observado/estimado
e data de corte. Atualizar o retrato quando o fechamento de 2026 estiver disponível;
até lá, identificar o período consolidado usado, sem apresentá-lo como 2026 fechado.

O inventário existente registra RTN de 2025 e janeiro–agosto/2026, cruzamento do
acumulado com o RREO e ficha separada de DPF/RMD de agosto/2026. Não equiparar
DPF a dívida consolidada líquida nem inferir caixa livre a partir desses totais.
Continuam pendentes a compatibilização de séries, conceitos e base de preços.
A revisão de planejamento não faz nova auditoria das fontes nem insere valores
históricos nos JSONs. Para testar mecanismos, usar exemplos sintéticos declarados;
hipóteses em um cenário jogável também precisam ser identificadas como tais.

### Relatório histórico não é a partida

O exemplo de junho–agosto/2026 permanece no inventário fiscal. Seus valores
arredondados registrados são:

| Apuração histórica RTN               | Valor registrado |
| ------------------------------------ | ---------------: |
| Receita líquida                      |    R$ 609,572 bi |
| Despesa total                        |    R$ 660,265 bi |
| Primário acima da linha              |    -R$ 50,693 bi |
| Primário abaixo da linha             |    -R$ 50,948 bi |
| Juros nominais considerados pelo RTN |   -R$ 296,150 bi |
| Resultado nominal RTN                |   -R$ 347,098 bi |

Nesse relatório, caixa e financiamento continuam não calculados pela falta de
saldos compatíveis. O nominal histórico combina o primário abaixo da linha com
os juros RTN, preservando a convenção de sinal da fonte; não misturar métodos.
Os números não são efeitos de decisões do jogador nem parâmetros já calibrados.

A verificação documental daquele exemplo foi concluída. Ela não substitui as
identidades da partida, que terá caixa, emissão e juros calculados pelo contrato
simplificado acima. Implementar somente um relatório estático deixou de ser o
próximo marco do jogo.

## Sequência de execução sem dependências circulares

1. SG097 permanece como inventário; revisar SG098 e criar a partida em SG099.
2. Completar e validar SG057-A: três passos mensais, prazos, conversão de conteúdo
   e confirmação atômica da composição dos passos na bancada (FIX-V1-02/04).
   O fluxo técnico já existe; não exigir primeiro economia ou partida integrada.
   A transação completa do estado político e econômico pertence a SG061.
3. A partir desse contrato, desenvolver SG060-A/B isoladamente com exemplos
   sintéticos. SG057-B2 tem contrato genérico aceito após SG057-B1; detalhar
   conteúdo e fórmulas ao implementar SG098/099 e SG058/059.
4. Implementar SG058-A/B e SG059: reações dos grupos, votação, renovação eleitoral,
   tramitação e validação de ações, integradas à fundação de domínio.
5. SG061 integra os módulos; SG062–SG064 provam uma partida completa com as poucas
   políticas do recorte. SG063 confere opções de receita e despesa, adaptando a
   seleção mínima em JSON para que tributar seja uma ação testável, não apenas
   uma estratégia citada no aceite. Não aguardar bancos, crise fiscal ou capacidade avançada.
6. SG065–SG072 conectam a partida à interface aprovada; SG073–SG080 refinam
   explicações e balanceamento; SG081–SG082 entregam salvamento completo.

Um contrato pode ser especificado antes de seu módulo estar pronto. Um chamado
só é concluído quando seu aceite for demonstrado; os 86 testes registrados em
6 de outubro são evidência daquela base, não da conclusão das mecânicas acima.

Os dez achados da [revisão de consistência](revisao-consistencia-v1-2026-10-08.md)
têm subtarefas FIX-V1-01–10 no [plano principal](../plano-de-producao.md), junto
dos chamados responsáveis. Esse é o catálogo de execução e aceite dos fixes;
não constituem uma nova fase nem correções já implementadas. SG057-B2 fechou
o contrato genérico antes da implementação correspondente, sem depender
da conclusão futura de SG061.

## Diário, salvamento e aceites

O diário separa decisão, estimativa, espera, adiamento, voto, implantação e efeito.
Mostra causas, sequência mensal, resumo trimestral e erros com ID/campo/motivo.
O diário visual não substitui a memória técnica dos atrasos.

Salvar também prazos absolutos de propostas, mandatos/vagas do Senado, dívida
emitida durante a partida, compromissos de juros e estado do gerador aleatório.
O diário atual de sessão ainda tem retenção limitada; persistência e exportação
entram em SG081–SG082.

Antes de ampliar o catálogo:

- Reconciliar caixa e dívida por 60 turnos técnicos de teste, com déficit,
  superávit e uso de caixa. Isso testa o motor; não autoriza continuar uma
  partida que perdeu a eleição presidencial.
- Demonstrar juros somente no mês seguinte à emissão, sem dupla cobrança.
- Demonstrar uma política pendente sem nova implantação, uma votação normal e
  um único adiamento; cobrir o limite de dois turnos e a passagem de mandato.
- Demonstrar decisão discreta com implantação parcial e encerramento gradual
  com critério explícito, em vez de exigir zero exato por aproximação.
- Renovar duas/uma vaga por UF e preservar mandatos não vencidos, incluindo a
  possibilidade de um partido conquistar as duas vagas em disputa.
- Repetir falha e restaurar save sem alterar sorteios, prazos ou custos.
- Comparar estratégias de gasto, investimento, economia e tributação, usando
  condições iniciais e sementes controladas e várias sementes nas comparações.
- Demonstrar benefícios do endividamento e custos posteriores compreensíveis,
  sem tornar dívida gratuita nem toda expansão ruim. Explicar diferenças entre
  grupos sem duplicar efeitos.
- Testar com pessoas se o benefício, o custo, o prazo e a incerteza podem ser
  entendidos antes de decidir; ajustar parâmetros a partir dessa experiência.

## Backlog preservado — não bloqueia a primeira versão

- Inflação, poder de compra, rating e custo variável de novas emissões: exigem
  contratos próprios e não reprecificam automaticamente toda a dívida herdada.
- Crise fiscal recuperável, aviso por projeção de até cinco turnos e emergência
  parlamentar: ficam como direção futura. Limiar, entrada/saída, medida de
  capacidade de pagamento e quais propostas podem receber tramitação especial
  precisam de regras antes da implementação; não aplicar bônus a qualquer medida.
- Empréstimos condicionados e venda de ativos a agentes externos ficam nesse
  recorte futuro, sem simular diplomacia complexa na v1.
- Vencimentos, rolagem, amortização e limites de financiamento exigem novas
  identidades e exemplos. Não recuperar os exemplos antigos como aceite atual.
- SG060-C distingue Tesouro, bancos e autoridade monetária. Permanecem previstas
  como decisões futuras separadas a autonomia/mandato do Banco Central e a
  propriedade pública/privada dos bancos comerciais, com efeitos e agência
  definidos antes da implementação.
- SG058-C amplia demanda, capacidade, retornos decrescentes e limites de entrega;
  SG058-D acrescenta governança, fiscalização, desperdício, desvio e superfaturamento.
  Gasto elevado não implica corrupção. Perdas não podem ser debitadas duas vezes.
- Segundo turno presidencial, influência econômica organizada, gabinete,
  negociação de coalizões e candidatos como personagens seguem adiados.

Esses itens preservam possibilidades de evolução. Não devem voltar às dependências
da partida inicial por estarem mencionados em pesquisa ou em um exemplo histórico.
