# Plano de produção do SisGov

7 de outubro de 2026 • Decisões de jogabilidade consolidadas após revisão

## Direção vigente do projeto

O SisGov será planejado pelas coisas e regras que existem no jogo. Cenário é a
definição estável; partida é o estado mutável de uma execução; política definida,
proposta e política vigente são conceitos diferentes. A simulação calcula efeitos
numéricos, a aplicação coordena os casos de uso e a interface recebe intenções e
apresenta resultados.

```text
cenário → partida → proposta → autorização → política vigente
                                      ↓
                      implantação → simulação → novo estado
                                      ↓
                         ocorrências e eleições → interface
```

Os IDs SG001–SG096 permanecem estáveis. As fases 00–06 e seus aceites continuam
registrando o trabalho anterior. A partida integrada da Fase 07 ainda não está
concluída. A nova fundação de domínio recebe SG097–SG099; ela precisa ser aceita
antes de SG061 integrar o turno. As especificações de tempo, finanças e regras
políticas podem avançar em paralelo quando não dependerem desses contratos.

O estado atual do código e a sequência completa estão descritos em
[`plano-migracao-modelagem-dominio.md`](arquitetura/plano-migracao-modelagem-dominio.md).
Este plano de produção define escopo, dependências e aceites; o documento de
arquitetura detalha a migração técnica.

### Decisões vigentes da primeira versão — 7 de outubro

O SisGov é um jogo inspirado em _Democracy 4_. A economia e a arquitetura devem
sustentar decisões políticas interessantes, explicáveis e com contrapartidas.
Não é objetivo reproduzir integralmente a contabilidade ou a economia brasileira.

- **Presidência no cenário inicial proposto:** eleição nacional em turno único,
  vencendo o maior total de votos; segundo turno fica fora do primeiro pacote de
  conteúdo. A lei constitucional eleitoral vigente, referenciada pelo JSON do
  país, é a fonte dessa regra — não uma constante do motor. Vitória continua a
  partida; derrota a encerra no recorte da V1.
- **Organização política e conteúdo de cenário:** separar três fontes
  extensíveis por mods: catálogo geral de organizações possíveis; JSON de país,
  que declara identidade e quais leis do catálogo comum começam vigentes com seu
  estado herdado; e JSONs de leis ordinárias/constitucionais, que definem
  requisitos, conflitos, mecanismos e efeitos, inclusive alterações de
  instituições e eleições.
  A organização vigente é inferida do conjunto de instituições, leis e escolhas
  do jogador, não escolhida como um rótulo fixo. O Brasil inicial declara três
  cadeiras por UF, mandatos de oito anos e renovação alternada de duas/uma a cada
  quatro anos. O rascunho atual de configuração organizacional não é ainda o
  contrato definitivo dessa separação.
- **Constituição no mapa e nas regras:** fica dentro da esfera federal existente,
  como camada protetiva de leis e garantias constitucionais. Medidas como retirar
  o voto ou extinguir o Congresso exigem mudança constitucional, mais difícil
  que uma lei ordinária. Na V1, uma emenda exige pelo menos 60% de apoio em cada
  uma de duas votações gerais simplificadas do Congresso, sem separar Câmara e
  Senado na apuração. As duas ocorrem no mesmo fechamento trimestral; se qualquer
  uma falhar, a emenda é rejeitada. Indicadores e situações ficam fora de todas
  as esferas, orbitando pelo espaço livre em volta delas.
- **Votação de propostas:** afinidade partidária e opinião pública influenciam
  o apoio, com aleatoriedade controlada que permita dissidências. Estimativa não
  garante resultado; o estado dos sorteios integra o salvamento e a confirmação
  atômica do turno.
- **Tramitação:** normalmente votar no próximo fechamento de turno; admitir um
  adiamento excepcional com motivo visível, limitando a espera a dois turnos
  trimestrais. A política anterior continua enquanto a proposta estiver pendente.
- **Economia jogável:** receitas, despesas, caixa, dívida e juros. Financiar o
  déficit automaticamente; preservar o fluxo de juros herdado e cobrar juros
  simples sobre novas emissões a uma taxa fixa do cenário, a partir do mês seguinte.
  Endividar-se permite benefícios agora, mas eleva compromissos futuros; o peso
  crescente dos juros pode gerar desgaste político gradual, com causas visíveis.
- **Depois da primeira versão:** inflação, rating, crise fiscal, bancos, mercado
  financeiro, vencimentos, rolagem e amortização. Não são pré-requisitos de SG061.

Taxas, probabilidades, intensidade do desgaste e condições do adiamento serão
parâmetros de cenário ajustados por testes de jogabilidade. Gastar, investir,
economizar e tributar precisam oferecer vantagens e contrapartidas; o aceite
exige comparar estratégias, não apenas fechar contas. O contrato detalhado está
em [turnos e economia](producao/sg057-proxima-fase-e-economia.md).

Esta revisão atualiza planejamento e aceites; não declara essas mecânicas
implementadas. As evidências históricas permanecem identificadas como históricas.

### Frentes de produção

1. Revisar os contratos de proposta e implantação (SG098) e criar a partida com
   adaptador de cenário (SG099), aproveitando SG097 e o código já existente.
2. Fechar o contrato temporal (SG057-A); sobre ele, especificar e testar o núcleo
   fiscal mínimo (SG060-A/B) e o contrato político (SG057-B).
3. Implementar reação dos grupos, votação, eleição e validação de ações
   (SG058-A/B e SG059), usando implantação e limites já disponíveis. Capacidade
   avançada, governança e bancos (SG058-C/D e SG060-C) ficam para uma evolução.
4. Orquestrar o turno atomicamente (SG061–SG064) e conectá-lo à interface
   (SG065–SG072).
5. Revisar sociedade e equilíbrio, salvar e restaurar, validar qualidade e
   preparar distribuição (SG073–SG096).

As dependências, não a ordem numérica do chamado, determinam a sequência. Os
chamados SG097–SG099 estão posicionados antes da integração do turno porque são
pré-requisitos arquiteturais, embora seus IDs preservem o histórico SG001–SG096.

## Princípios e histórico de produção

As revisões de 3 e 6 de outubro foram consolidadas com as decisões de 7 de outubro
nas regras e fichas abaixo. SG001–SG096 preservam o catálogo original; SG097–SG099
complementam a fundação de domínio. Registros datados de execução são evidências
históricas, não prova de que as novas regras já estejam implementadas.

**IA que auxiliou nesta revisão do planejamento: Gitinho.**

Construir um jogo em que o jogador representa um partido e conduz o governo enquanto ocupa a Presidência. Políticas, eventos e consequências são definidos em JSON. O software carrega e valida esses arquivos, monta o grafo e executa os mecanismos declarados. Adicionar conteúdo que usa mecanismos existentes deve exigir apenas novos dados.

A Fase 00 está concluída, com registro em `docs/qualidade/verificacao-base-producao.md`. Os 96 IDs são mantidos para preservar o acompanhamento. As fichas futuras foram simplificadas e devem ser detalhadas quando forem iniciadas. As capacidades descritas ainda precisam ser implementadas.

## Progresso e próxima fase — revisão de 7 de outubro de 2026

As Fases 01–06 possuem contratos, implementações e verificações registrados abaixo:
carregamento, execução numérica, atrasos, ocorrências, restauração, bancada e
primeiro recorte em JSON. A partida integrada da Fase 07 ainda não está concluída.
O laboratório de mais de cem políticas é demonstrativo e não substitui o cenário
calibrado. O resumo antigo que apontava SG025 como próxima tarefa estava desatualizado.

**Fase 07 iniciada: SG057-A, primeiro chamado.** O fluxo de três passos mensais
com taxas equivalentes já tem testes comportamentais e verificação na interface
da bancada, registrados no chamado abaixo. SG057-A e FIX-V1-02/04 estão concluídos
no recorte temporal da bancada; a integração da
partida inteira pertence a SG061, não é pré-requisito desse aceite. Em paralelo,
concluir a revisão de SG098 e criar a partida de SG099, pré-requisitos
para SG061. SG060-A/B usa o contrato temporal para construir e testar receitas,
despesas, caixa, dívida e juros simples. SG057-B pode especificar política e
eleições em paralelo. A integração SG061 não aguarda bancos, inflação, rating,
crise fiscal ou capacidade avançada.

O [plano detalhado da próxima fase](producao/sg057-proxima-fase-e-economia.md) define
ordem, variáveis, identidades contábeis, limites legais/financeiros/operacionais,
retornos decrescentes, fiscalização e critérios de teste. É especificação de trabalho,
não declaração de que essas mecânicas já estejam prontas.

**SG043-R — Correção do laboratório e diário:** o avanço inicial foi reproduzido
com erro de domínio em Saúde; os parâmetros demonstrativos foram corrigidos sem
retirar a validação. O diário mostra decisões, avanços, causas e falhas; retenção
limitada à sessão. Isso não encerra SG061 nem substitui o diário integrado de SG069.

## Direção visual aprovada em 3 de outubro de 2026

A tela principal segue o [motor espacial](producao/motor-espacial.md): presidente e ministros são os centros de maior massa; Constituição e políticas orbitam seus representantes dentro das respectivas esferas. Indicadores e situações ficam fora de todas as esferas, ocupando o espaço livre em volta delas e se organizando pelas leis relacionadas. Relações podem atravessar ministérios. A experiência é centrada no mapa, com interface mínima. Rosto do ministro e cor da esfera pela aprovação popular do ministro são evoluções futuras aprovadas, ainda sem implementação dessa aprovação.

## Regra central do projeto

Cada política terá seu próprio arquivo JSON, com tipo, requisitos, custos e referências às consequências. Lei, imposto e programa são tipos de política: aprovar uma lei e ajustar o investimento de um programa não precisam ser apresentados como a mesma ação. Cada evento, dilema, situação e definição de consequência também terá seu arquivo JSON. O cenário reúne os arquivos e define o estado inicial da partida.

O JSON descreve regras e parâmetros. O código implementa um conjunto pequeno de mecanismos, como contribuição numérica, condição, atraso e duração. Uma nova lei que usa esses mecanismos exige apenas dados; uma operação matemática nova exige código, validação e testes próprios. Fórmulas não executam JavaScript nem usam `eval`.

O tipo da política orienta seus controles e o processo de autorização declarado nos dados. Uma consequência define um efeito direto; os efeitos indiretos surgem da propagação pelo grafo. Não registrar novamente cada efeito indireto como consequência direta, pois isso contaria o mesmo impacto duas vezes.

## Partido, população e organização política

Partido do jogador, governo em exercício, forma de governo e composição das
instituições são estados separados. O catálogo geral declara organizações e
mecanismos possíveis; o JSON do país define identidade e estado institucional
inicial; políticas podem modificar instituições e regras. A partida guarda as
mudanças aprovadas e o estado institucional resultante. O jogo infere a
organização vigente das instituições e regras ativas; ela não precisa ser
escolhida como um rótulo fixo.
A população elege os cargos previstos pela forma de governo, com resultados
separados. Representá-la por poucos perfis agregados com interesses combinados:
uma parcela pode reunir trabalhadores, idosos e motoristas. Cada parcela entra
uma única vez na apuração; somar grupos sobrepostos não pode multiplicar votos.

Uma política pode provocar reação eleitoral à própria medida e, em outro momento,
reação aos resultados que ela produziu nos indicadores nacionais. O estudo de
SG057-B1 deverá distinguir essas duas causas, acompanhar sua passagem pelo grafo
e impedir que a mesma pessoa ou o mesmo efeito seja contado duas vezes. Diferenças
entre estados podem decorrer da composição e exposição dos grupos locais às
mesmas ações federais; isso não exige simular indicadores econômicos estaduais.
Bem-estar do grupo, aprovação de uma política e intenção de voto são resultados
distintos. A avaliação pode considerar quem recebe benefícios, quem paga os custos
e como cada grupo percebe o desenho da medida; melhorar um indicador não determina
sozinho a aprovação política.

O apoio para aprovar leis vem do Senado, não de pontos de força política gastos pelo jogador. Cada proposta declara afinidade com correntes políticas em seu JSON. São valores independentes, não precisam somar 100% e não representam probabilidade ou garantia de voto. A opinião pública sobre a medida influencia apoio parlamentar e reação eleitoral; é distinta da aprovação geral do governo e não é veto automático. Uma proposta popular pode perder por falta de votos; uma impopular pode passar e gerar desgaste.

Antes da confirmação, mostrar estimativas separadas de reação popular, apoio
parlamentar e impacto financeiro. A votação parlamentar tem aleatoriedade
controlada, influenciada pelas condições políticas; não é uma moeda lançada
independentemente do apoio. Salvar o estado do gerador e processar propostas em
ordem estável. Falha técnica, consulta de estimativa ou restauração do mesmo save
não devem consumir sorteios extras nem produzir uma nova tentativa da mesma votação.

A configuração inicial do Brasil usa Presidência em turno único e Senado com
três cadeiras por estado/DF, renovação alternada de duas e uma a cada quatro anos
e mandatos de oito anos. O cenário identifica quais vagas serão disputadas na
próxima eleição. Outras organizações declaram suas próprias instituições e
calendários. A referência brasileira é a
[composição do Senado](https://www12.senado.leg.br/institucional/documentos/sobre-o-senado/atividade/composicao).
Partidos e cadeiras herdadas vêm do cenário. O motor suporta mecanismos
eleitorais declarados em leis constitucionais JSON; o país referencia as leis
vigentes inicialmente. Para a mesma eleição e alcance, regras incompatíveis
são exclusivas. Uma reforma constitucional substitui a lei anterior para
eleições futuras, sem sobreposição.
Presidência em turno único e apuração senatorial por UF são escolhas iniciais
brasileiras, não fórmulas universais. Fórmulas de preferência, maioria
parlamentar, empates e parâmetros de sorteio recebem contrato e exemplos em
SG057-B2; não inventar esses detalhes na UI.

Vencer a eleição presidencial inicia outro mandato com o mesmo país. Perder encerra a partida na primeira versão. Os cinco turnos anteriores à eleição oferecem ações de campanha ao partido, como comunicar políticas, participar de rádio, espalhar desinformação ou mobilizar militância; custos, efeitos, riscos e limites dessas ações ainda serão definidos em SG057-B. A V1 inclui escolha limitada de personagens para presidente, vice e ministros, definidos em JSON. Gestão detalhada do gabinete, negociação complexa de coalizões, disputas internas, candidatos senatoriais individuais e atuação na oposição ficam adiados.

## Aprovação implantação e país herdado

Separar proposta, resultado da autorização, nível desejado e nível implantado da política. A rejeição não inicia implantação. Depois da aprovação, a implantação pode avançar gradualmente; suas consequências ainda podem ter atraso, duração e dissipação próprios. Tempo de implantar um programa não é o mesmo que tempo de esperar seus resultados. Revogação segue a regra declarada e não apaga automaticamente consequências acumuladas.

A proposta parlamentar normalmente é votada no próximo fechamento trimestral,
com no máximo um adiamento excepcional e explicado. O prazo máximo de dois
turnos termina em votação, não em aprovação automática. Enquanto isso, a política
anterior continua em vigor. Ajustes dentro de uma autorização já existente
seguem a rota executiva de SG050, sem impor uma votação a todo movimento de verba.

Opções discretas da decisão e progresso de implantação têm contratos diferentes:
uma lei pode estar aprovada com execução parcial. Revogar juridicamente, reduzir
execução e dissipar consequências também não são o mesmo estado. SG098 precisa
representar essas diferenças antes da integração.

O Brasil começa com políticas vigentes, níveis já implantados ou em implantação, finanças, população, composição política e efeitos herdados. Nova partida carrega esse estado; novo mandato preserva o estado alcançado, incluindo dívida, crises e implantação em andamento.

Dinheiro público, apoio parlamentar e opinião pública não são um único recurso. Receitas, despesas, saldo, dívida e juros têm papéis próprios. Déficit é resultado válido e segue o financiamento definido no cenário, como dívida; não é erro do motor. Dados ausentes, referências inválidas e resultados não finitos continuam sendo falhas técnicas.

Na primeira versão, o déficit não coberto pelo caixa gera emissão automática;
superávit permanece em caixa. A taxa da dívida nova é fixa no cenário, mas a
despesa com juros cresce com as emissões acumuladas. O fluxo herdado permanece
separado. A relação entre peso dos juros, grupos e aprovação é explícita e
gradual, sem penalidade oculta ou derrota fiscal automática. Inflação, rating e
crise fiscal ficam no backlog; o jogo não exige gestão de títulos.

## Organização mínima

Usar um único projeto TypeScript, executado no navegador, com quatro responsabilidades:

- `src/scenarios`: arquivos JSON dos cenários e seu carregamento.
- `src/engine`: validação do modelo, grafo, cálculo, tempo e explicações.
- `src/game`: políticas, propostas, autorizações, implantação, finanças, população, Senado, turnos e eleições.
- `src/ui`: telas que exibem o conteúdo e enviam decisões à camada de jogo.

O carregador transforma o conteúdo validado em uma definição de simulação e um catálogo de regras de jogo. Pode começar como uma função; não precisa virar um serviço ou uma linguagem própria. O motor numérico e a camada de jogo funcionam sem React. Textos, nomes de leis e particularidades brasileiras ficam nos dados.

Fluxo: arquivos JSON → validação e resolução de referências → grafo e catálogo → proposta e autorização → implantação e simulação → novo estado e explicações → interface.

Estrutura inicial de um cenário:

```text
src/scenarios/exemplo/
  cenario.json
  variaveis.json
  politicas/
    lei-exemplo.json
  eventos/
    evento-exemplo.json
  dilemas/
    dilema-exemplo.json
  situacoes/
    situacao-exemplo.json
  consequencias/
    efeito-exemplo.json
```

`cenario.json` é o manifesto: lista arquivos, versões, valores iniciais, duração
do passo, regras da partida, perfis sociais e estado político herdado. O
catálogo geral de organização política descreve formas e mecanismos
reutilizáveis. O JSON do país identifica o país, declara leis constitucionais e
instituições iniciais e referencia políticas disponíveis/ativas. Cada política
tem JSON próprio e pode declarar se usa processo ordinário ou constitucional e
quais mudanças institucionais produz. Pastas sem conteúdo não são obrigatórias.
O carregamento inicial usa arquivos distribuídos com o jogo. Acrescentar
conteúdo pode exigir novo build, mas não editar código de regras, registros
manuais de importação ou telas específicas.

## Contratos necessários

- **Identidade:** cada definição tem ID estável, tipo e versão de esquema. Referências usam IDs; nomes e caminhos podem mudar sem mudar a identidade. IDs duplicados são erro.
- **Política:** tipo, nome, descrição, requisitos, conflitos, afinidades políticas, processo de autorização, custos, controle, domínio, implantação, vigência, revogação e consequências. Começar com liga/desliga ou intensidade numérica; uma lei não contém um catálogo paralelo de políticas.
- **Consequência:** ID, dependências, alvo, mecanismo, parâmetros, unidade, atraso, duração, dissipação e modo de aplicação. Distinguir efeito contínuo de ocorrência única. Cada uso recebe identidade própria, ligada à política, evento, dilema ou situação que o ativou.
- **Situação evento e dilema:** situação persiste enquanto suas condições sustentam o estado; evento é uma ocorrência automática; dilema exige uma escolha entre opções. Podem compartilhar condições e consequências, mas não o mesmo ciclo de vida. Seus gatilhos continuam determinísticos, com ocorrência única ou intervalo mínimo para repetição. A aleatoriedade aprovada inclui votação parlamentar e desempate eleitoral por d20, não autoriza sorteios em todos os mecanismos.
- **Cenário:** manifesto, variáveis, país herdado e regras de turno, autorização, finanças e eleições. O primeiro recorte terá 6–10 variáveis de domínio, três decisões, ao menos um evento e dois perfis com interesses combinados e efeitos distintos. Dilemas e situações têm exemplos artificiais de teste, sem obrigar a ampliar o cenário mínimo. Estados de controle da partida não são indicadores adicionais.
- **Procedência:** efeitos de domínio registram fonte ou hipótese de design e limitações. Coeficientes artificiais dos testes são identificados como artificiais.
- **Estado:** snapshot do motor guarda valores, passo, histórico e memórias dos efeitos; o salvamento da partida agrega partido, governo, cadeiras do Senado com UF e vencimento, população, propostas com prazo e adiamento, políticas vigentes, níveis desejados e implantados, finanças com dívida nova separada e juros herdados, calendário, turno, situações, eventos e dilemas pendentes. Inclui versão, semente e posição/estado do gerador de sorteios. Esses dados pertencem à partida, separados das definições JSON.

O grafo contém dependências numéricas; textos, escolhas e elegibilidade ficam no catálogo. Todos os nós e relações possíveis do cenário são montados antes de iniciar. Aprovação, implantação e ocorrências alteram comandos e ativação das contribuições, sem editar a estrutura do grafo durante a partida. Uma contribuição inativa vale zero, inclusive quando sua fórmula contém constante. Revogar encerra contribuições futuras conforme a regra declarada; não desfaz automaticamente valores já acumulados.

Começar com uma instância ativa por uso de consequência. Uma reativação enquanto ela estiver ativa é recusada com motivo; acúmulo e renovação automática ficam adiados. Usos distintos podem contribuir para o mesmo alvo e são somados com origem separada. Processar eventos em ordem estável de ID e avaliar seus gatilhos sobre o mesmo retrato.

Definir uma única ordem de turno: validar escolhas sobre o estado confirmado,
registrar propostas e autorizações executivas, executar três meses de implantação,
simulação, contas e ocorrências; no fechamento, resolver propostas elegíveis e
eleições quando devidas, e confirmar tudo junto com o diário. Aprovações no
fechamento passam a orientar a implantação no trimestre seguinte. Ocorrências
descobertas no fim de um mês só afetam os passos seguintes. Falhas técnicas
preservam também prazos e sorteios; rejeição parlamentar é resultado válido.
O motor calcula e explica; a camada de jogo decide continuidade e encerramento.
SG057 detalha dilemas e a precedência eleitoral sem permitir que uma coincidência
viole o prazo máximo de tramitação. Se uma votação de proposta coincidir com a
renovação do Senado, vota primeiro a composição que encerra o mandato; a renovação
ocorre depois, e a nova composição vale a partir do turno seguinte.

## Como manter o projeto simples

1. Provar o fluxo completo cedo. Até SG032, uma lei artificial em JSON deve alterar uma entrada e produzir uma consequência explicável por teste, com autorização simulada apenas na bancada. Senado e orçamento entram na Fase 07; o jogo não oferece esse atalho. Até SG040, incluir eventos e retomada da execução.
2. Usar o mesmo carregamento na aplicação e nos testes. Rejeitar arquivo inválido com arquivo, ID, campo e motivo. Nenhuma parte de um pacote inválido entra na execução.
3. Começar com Map, soma e transformação afim, sem restringir o jogo a somas. Produto de entradas, respostas limitadas, condições e resposta gradual entram quando um exemplo do cenário exigir, com contrato e teste. Receita como alíquota × base tributável precisa de produto, não de uma soma disfarçada. Não criar linguagem de fórmulas arbitrárias.
4. Carregar o cenário uma vez. Manter definição imutável e estado separado. Mudanças nos arquivos exigem nova execução; recarga durante a partida fica adiada.
5. Ter uma fonte para cada regra. A camada de jogo calcula disponibilidade, opinião, apoio, autorização e finanças; a interface apresenta resultados e envia escolhas, sem recalcular regras. O motor não conhece nomes de partidos ou leis.
6. Salvar a identidade exata do conteúdo. Usar versões de esquema e executor e identificação do pacote por conteúdo, além da versão declarada. Save incompatível é recusado com explicação; migração automática fica adiada.
7. Testar comportamento e explicar resultados. Registrar qual política, ocorrência e consequência originou cada contribuição. Cobrir arquivo inválido, rejeição, implantação, revogação, duplicidade, déficit, eleições, falha no turno e retomada.
8. Integrar o mapa já aprovado e controles comuns ao ciclo jogável. Não exigir
   novas visualizações, editor, plugins, servidor, banco de dados, contas ou nuvem
   para provar uma partida completa.

O critério central de arquitetura é verificável: cadastrar outra lei, evento ou consequência com mecanismos disponíveis, alterar apenas JSON e executar pelo mesmo fluxo. Se isso exigir uma condição pelo nome da lei no código ou uma tela exclusiva, revisar a separação de responsabilidades.

## Como acompanhar

O Markdown é o texto mestre; o Word é uma cópia de leitura atualizada a partir dele. O estado operacional fica no GitHub Project escolhido em SG002. Criar issues ao assumir o trabalho, conforme `docs/producao/quadro-de-chamados.md`.

Manter um chamado de implementação em andamento por pessoa. Estados: Planejado, Pronto, Em andamento, Em revisão, Bloqueado e Concluído. Registrar na issue branch, decisões, evidência do aceite e próximo passo. Seguir `docs/producao/fluxo-de-branches-e-revisao.md`.

Cada ficha define entrega e aceite. O marco de uma fase depende das entregas
do seu recorte vigente; subtarefas explicitamente adiadas não bloqueiam o marco.
Dependências adicionais aparecem nas fichas. Estimar ao iniciar e dividir tarefas
maiores que quatro horas em SGxxx-A e SGxxx-B. Não presumir que toda ficha cabe
em quatro horas.

A estimativa anterior de 167–334 horas não cobre os contratos e o ciclo político agora explicitados. Reestimar a Fase 01 e depois cada fase com base nas entregas reais. SG009 já tem decisão em `src/engine/semantica-do-passo.md`; conferir a evidência existente antes de repetir trabalho. Fichas dependentes de regras ainda abertas só ficam Prontas após a decisão correspondente.

Uma entrega termina quando seu aceite é demonstrado, as verificações pertinentes passam e a documentação acompanha a mudança. Mesmo com trabalho próprio aceito, um chamado dependente não recebe estado **Concluído** enquanto qualquer pré-requisito obrigatório estiver aberto; registrar **parcial** ou **em revisão** e citar a dependência. Uma fase só é concluída quando todos os chamados obrigatórios anteriores desse recorte estiverem concluídos. Defeitos recebem BUG001 em diante. Falta de fonte ou participante indica bloqueio e próximo passo. Publicação externa depende de decisão sobre a versão concreta.

### FIX-V1-10 Sincronizar regras e progresso a cada entrega — planejado

Origem: achado 10 da [revisão de consistência da V1](producao/revisao-consistencia-v1-2026-10-08.md).
Aplicar ao atualizar ou concluir qualquer chamado abaixo. O resumo vigente de
cada chamado neste plano é a referência de estado; documentos de apoio apontam
para ele. Evidências datadas permanecem históricas, sem virar status concorrente.

Entrega: conferir resumo, ficha detalhada, documento de escopo e instruções da
interface afetados pela mudança; atualizar as pendências resolvidas e registrar
as restantes. Diferenciar contrato aprovado, implementação e verificação em tela.
Aceite: não coexistem afirmações de que uma mesma entrega está feita e por fazer;
exceções como o d20 eleitoral aparecem onde a regra geral é descrita. Não reabrir
as Fases 00–06 por mudanças posteriores de escopo. Os resumos temporais antigos
são corrigidos nesta revisão; a conferência deve acompanhar as próximas entregas.

Os FIX-V1-01–10 são subtarefas locais dos chamados indicados, não uma nova fase
nem declarações de correção já implementada. O estado de cada subtarefa aparece
no seu título; nenhuma está concluída sem seu aceite. Seus números correspondem
aos achados do relatório. Antes de
implementar o trecho afetado, fechar seu contrato; antes de concluir o chamado
responsável, demonstrar o aceite do fix. Valores de balanceamento podem ser
provisórios e identificados, sem impedir o contrato do mecanismo.

## Fase 00 Preparação concluída

SG001–SG008 preservam o histórico. Evidência em `docs/qualidade/verificacao-base-producao.md`; detalhes nas issues e documentos de produção. A revisão de escopo em 1 de outubro não reabre a Fase 00; atualiza a referência para as entregas futuras.

### SG001 Definir a primeira versão

Entrega e aceite: público, plataforma, três critérios de sucesso e exclusões em `docs/producao/primeira-versao.md`. Inclui efeitos sociais distintos e eleição com vitória ou derrota.

### SG002 Criar o quadro

Depende de SG001. Entrega e aceite: estados, reserva, bloqueio e conclusão com evidência. A escolha registrada foi GitHub Project.

### SG003 Conferir o ambiente

Depende de SG001. Entrega e aceite: dependências, versões e comandos de execução, teste e build reproduzíveis.

### SG004 Padronizar verificações

Depende de SG003. Entrega e aceite: formatação, lint, tipos, build e testes em um fluxo local, preservando TypeScript estrito.

### SG005 Definir branches e revisão

Depende de SG002 e SG003. Entrega e aceite: branch por chamado, commits, revisão, integração e tratamento de sobreposição de arquivos.

### SG006 Verificar na integração

Depende de SG004 e SG005. Entrega e aceite: integração detecta teste quebrado e aprova versão válida, sem publicar o jogo.

### SG007 Criar o guia de entrada

Depende de SG002, SG003 e SG005. Entrega e aceite: README orienta execução, estrutura, documentação e escolha de chamado.

### SG008 Verificar a base

Marco da fase. Aceite: alteração documental percorreu o fluxo local e a integração com evidência. Pendências de dependências registradas no marco seguem para avaliação própria.

## Fase 01 Contratos do motor e do conteúdo

Objetivo: definir o mínimo para carregar e executar uma lei artificial. Entrada: SG008. Definir agora os estados e interfaces de conteúdo e partida; regras eleitorais detalhadas ficam em SG057 e sua execução na Fase 07.

### SG009 Escolher a semântica do passo — concluído

Entrega: conferir a decisão síncrona existente com uma cadeia de três nós. Aceite: leitura, propagação por passo e ciclos têm resultado inequívoco; preservar a decisão ou registrar sua alteração.

### SG010 Definir nós e estado inicial — concluído

Depende de SG009. Entrega: controle aplicado pela camada de jogo, valor calculado e estoque com unidade e domínio. Aceite: exemplos JSON válidos e inválidos; o jogador altera políticas e controles, não indicadores do país, e controles aplicados não recebem contribuições numéricas do grafo.

### SG011 Definir consequências e relações — concluído

Depende de SG010. Entrega: contrato de consequência, referências, transformação afim e soma por destino. Aceite: relações paralelas e usos da mesma consequência têm identidades distintas; mecanismo declara todas as dependências e produz uma contribuição por uso. Registrar como produto e respostas limitadas serão incluídos quando exigidos pelo cenário.

### SG012 Definir unidades e duração — concluído

Depende de SG010 e SG011. Entrega: catálogo mínimo, duração fixa positiva e tolerância numérica. Aceite: índice 0–1, percentual 0–100 e taxa por tempo são distintos; duração inválida falha.

### SG013 Definir validação e falhas — concluído

Depende de SG010 e SG012. Entrega: erros estruturados, domínios e rejeição atômica. Aceite: ausência, valor não finito, mecanismo desconhecido e versão incompatível são recusados; não existe saturação automática, resultado fora do domínio falha e estoque não perde saldo silenciosamente. Uma grandeza limitada usa mecanismo explícito que produza resposta válida. Saldo fiscal negativo em domínio permitido é resultado válido, não falha técnica.

### SG014 Escrever referências manuais — concluído

Depende de SG009 a SG013. Entrega: cadeia, convergência, estoque e feedback com resultados de dois passos. Aceite: valores independem do executor; incluir lei e consequência artificiais, sem alegação sobre o mundo real.

### SG015 Definir o pacote e as interfaces — concluído

Depende de SG009 a SG013. Entrega: contratos mínimos de manifesto, política tipada, consequências, situações, eventos, dilemas e estado; operações de carregar, validar, criar execução, propor e avançar. Aceite: pacote artificial separa afinidade, opinião e apoio, bem como autorização, implantação e efeito; distingue snapshot numérico de estado político. Regras senatoriais ainda abertas têm referência a SG057. Usar funções locais, Map e um único validador compatível com as dependências existentes.

### SG016 Revisar os contratos — concluído

Marco da fase. Aceite: exemplos, unidades, tempo, identidade e erros são consistentes. Está claro como adicionar conteúdo sem alterar código e quais mecanismos ainda não estão disponíveis.

## Fase 02 Carregamento e grafo

Objetivo: carregar pacotes completos e recusar conteúdo inválido antes da execução. Entrada: SG016.

### SG017 Separar motor e cenário — concluído

Entrega: entrada pública sem React ou conteúdo brasileiro. Aceite: testes importam o núcleo; o motor aceita N indicadores e N políticas definidos pelo pacote, sem quantidade específica para um país.

### SG018 Validar arquivos JSON — concluído

Depende de SG017. Entrega: leitura e validação dos formatos, incluindo sintaxe e campos inesperados. Aceite: erro informa arquivo e campo; operador ou mecanismo não suportado falha sem execução parcial.

### SG019 Resolver IDs e referências — concluído

Depende de SG018. Entrega: resolver manifesto, nós, políticas, situações, eventos, dilemas e consequências. Aceite: ID duplicado, arquivo ausente e referência quebrada são recusados; ordem dos arquivos não altera a definição nem sobrescreve elementos.

### SG020 Validar coerência — concluído

Depende de SG018 e SG019. Entrega: verificar unidades, parâmetros, domínios, duração, alvos e estado herdado. Aceite: grafo vazio e efeito incompatível falham; um único nó de entrada é válido. Afinidades independentes não são obrigadas a somar 100%. Aplicar limites documentados de tamanho e profundidade das condições.

### SG021 Montar grafo e catálogo — concluído

Depende de SG019 e SG020. Entrega: transformar o pacote em índices imutáveis de nós, relações e regras. Aceite: relações paralelas e autorrelações são preservadas; cada contribuição mantém referência ao arquivo e à definição de origem.

### SG022 Carregar sem registro manual em código — concluído

Depende de SG021. Entrega: conectar manifesto aos arquivos distribuídos e usar o mesmo carregador nos testes. Aceite: acrescentar lei e consequência exige só JSON e novo build; falha preserva a execução aberta. Editor e edição estrutural durante a partida ficam adiados.

### SG023 Diagnosticar o pacote — concluído

Depende de SG021. Entrega: listar ciclos, componentes desconectados e conteúdo não utilizado. Aceite: avisos diferem de erros; feedback temporal válido é permitido e arquivos órfãos não entram silenciosamente na partida.

### SG024 Validar dois pacotes — concluído

Marco da fase. Aceite: dois pacotes artificiais usam o mesmo carregador e núcleo; reordenar arquivos preserva a definição. Cobrir erro estrutural, referência quebrada e conteúdo válido adicional sem editar TypeScript.

## Fase 03 Execução mínima de ponta a ponta

Objetivo: executar por teste uma lei JSON e explicar sua consequência. Entrada: SG024. Custos e partida completa entram na Fase 07.

### SG025 Inicializar execuções independentes — concluído

Entrega: criar estado a partir do pacote. Aceite: duas execuções não compartilham objetos mutáveis nem alteram arquivos ou definição.

### SG026 Traduzir política em comando — concluído

Depende de SG025. Entrega: traduzir política autorizada em comandos de entradas controláveis e ativação das contribuições. Aceite: intensidade inválida ou duas mudanças para a mesma entrada rejeitam o lote; política inativa não aplica constantes; nenhuma condição usa nome de lei no código. A autorização artificial dos testes não substitui a futura votação do jogo.

### SG027 Calcular contribuições afins — concluído

Depende de SG025. Entrega: multiplicar origem por coeficiente e somar constante. Aceite: positivo, negativo e zero conferem com referência manual; resultado não finito falha.

### SG028 Combinar valores calculados — concluído

Depende de SG027. Entrega: somar contribuições em ordem estável ao valor de base. Aceite: base 10 com contribuições 3 e −2 produz 11 repetidamente, sem acumular resultado anterior.

### SG029 Atualizar estoques — concluído

Depende de SG027. Entrega: saldo de taxas vezes duração sobre estoque anterior. Aceite: 100 itens, taxas 8 e −3 por dia e dois dias produzem 110; unidade e domínio são respeitados.

### SG030 Confirmar um passo completo — concluído

Depende de SG026, SG028 e SG029. Entrega: calcular com um único retrato e confirmar tudo junto. Aceite: cadeia e feedback seguem SG014; falha preserva valores, memórias e número do passo.

### SG031 Explicar cada contribuição — concluído

Depende de SG030. Entrega: registrar origem, lei ou evento quando aplicável, consequência, valores lidos e resultado. Aceite: reconstruir resultado pelo registro; erro e resposta limitada têm causa identificável.

### SG032 Demonstrar lei executada por dados — concluído

Marco da fase. Aceite: lei artificial carrega, recebe comando e altera indicador com explicação. Adicionar outra lei compatível exige só JSON. Ordens de cadastro diferentes produzem a mesma trajetória na tolerância definida; falha tardia não deixa atualização parcial.

## Fase 04 Tempo eventos e restauração

Objetivo: executar implantação, efeitos temporais e ocorrências determinísticas, preservando continuidade. Entrada: SG032.

### SG033 Guardar histórico limitado — concluído

Entrega: manter retratos até o maior atraso necessário. Aceite: incluem comandos do início do passo; pré-histórico usa valores iniciais e memória de cálculo tem limite.

### SG034 Aplicar atrasos e duração — concluído

Depende de SG033. Entrega: selecionar retrato por atraso inteiro e controlar início e fim de efeitos. Aceite: atraso um lê o passo anterior; ocorrência única não se repete e efeito contínuo termina no instante declarado. Atraso do efeito é distinto de implantação, duração, dissipação e turno.

### SG035 Aplicar resposta gradual — concluído

Depende de SG032. Entrega: alvo, fração por passo e memória explícita, reutilizáveis para implantação ou dissipação com estados separados. Aceite: valor 0, alvo 10 e fração 0,5 geram 5 e 7,5; nível desejado não substitui imediatamente o implantado. Parâmetros inválidos falham e memória pertence à instância correspondente.

### SG036 Avaliar condições — concluído

Depende de SG032. Entrega: comparações e combinações lógicas restritas compartilhadas por situações e jogo. Aceite: avaliação recebe retrato explícito; referências inválidas falham antes da execução e arquivos nunca executam código.

### SG037 Executar situações eventos e dilemas JSON

Depende de SG034 e SG036. Entrega: situação persistente, evento automático e dilema com escolha obrigatória, usando condições comuns. Aceite: situação ativa acima de 0,7, desativa abaixo de 0,4 e preserva estado na faixa intermediária; evento único não se repete; dilema não aplica opções antes da escolha. Sem encadeamento na mesma avaliação; integração ao turno em SG057. Dividir em SG037-A para situações, SG037-B para eventos e SG037-C para dilemas antes de implementar.

**Execução serial:** SG037-A Situações persistentes → SG037-B Eventos automáticos → SG037-C Dilemas com escolha obrigatória.

#### SG037-A Situações persistentes — concluído

Entrada e saída usam condições separadas; a situação mantém seu estado enquanto estiver entre os limiares.

#### SG037-B Eventos automáticos — concluído

Evento dispara uma única vez quando sua condição for satisfeita.

#### SG037-C Dilemas com escolha obrigatória — concluído

Dilema cria uma pendência e não aplica opção antes da resposta.

### SG038 Exportar estado completo — concluído

Depende de SG034, SG035 e SG037. Entrega: snapshot numérico com identidade do pacote, versões, valores, passo, histórico e memórias das instâncias; estado separado de ocorrências na bancada. Aceite: implantação, atraso e dissipação retomam do ponto salvo. Estado político e salvamento completo serão integrados em SG081.

### SG039 Restaurar com compatibilidade verificada — concluído

Depende de SG038. Entrega: verificar integridade e identidade do conteúdo. Aceite: pacote modificado, estado incompleto ou versão incompatível são recusados sem afetar a execução atual.

### SG040 Comparar execução contínua e retomada — concluído

Marco da fase. Aceite: cenário artificial com política em implantação, evento, dilema, situação e efeito atrasado continua igual após restauração, incluindo explicações e pendências; ocorrência não dispara duas vezes e memória de cálculo é limitada.

## Fase 05 Bancada simples

Objetivo: inspecionar o fluxo demonstrado por testes. Entrada: SG040.

### SG041 Definir a bancada — concluído

Entrega: tabela de valores, controles de políticas, ocorrências e causas. Aceite: carregar, comandar, avançar e explicar resultado; identificar a bancada como teste técnico, sem aprovação parlamentar real. Começar sem biblioteca de diagrama.

### SG042 Carregar pacotes na bancada — concluído

Depende de SG041. Entrega: selecionar cenários pelo carregador comum. Aceite: arquivo inválido mostra diagnóstico; trocar cenário não mistura estados.

### SG043 Avançar e reiniciar — concluído

Depende de SG042. Entrega: avançar um passo e reiniciar. Aceite: duplo clique não avança acidentalmente; reinício confirma descarte de progresso.

### SG044 Inspecionar causas — concluído

Depende de SG043. Entrega: contribuição, origem JSON, atraso e efeito ativo. Aceite: conferir convergência na tela sem ler código.

### SG045 Comparar trajetórias — concluído

Depende de SG043. Entrega: comparar variável em duas execuções com decisões diferentes. Aceite: unidade e tempo visíveis; execuções independentes.

### SG046 Consultar dependências — concluído

Depende de SG044. Entrega: lista navegável de origens e destinos. Aceite: direção e relações paralelas claras, acessíveis por teclado; diagrama é opcional e posterior à lista funcional.

### SG047 Testar extremos — concluído

Depende de SG042 a SG046. Entrega: percorrer nó isolado, ciclo, atraso, evento e erro de domínio. Aceite: erros legíveis permitem recuperação e não aparecem como zero.

### SG048 Demonstrar inclusão de conteúdo — concluído

Marco da fase. Aceite: roteiro curto acrescenta lei e evento por JSON e demonstra resultado e causa sem modificar núcleo ou tela. Documentar como copiar um exemplo válido e validar conteúdo novo.

## Fase 06 Primeiro cenário de domínio

Objetivo: Brasil com estado herdado, efeitos sociais e base para eleições. Entrada: SG048.

### SG049 Escolher o recorte — concluído

Registro em 3 de outubro de 2026: [recorte de Saúde e Segurança](producao/sg049-recorte-do-cenario.md), com três políticas de recursos, dez variáveis de domínio, um evento e dois perfis populacionais. Conclusão documental; fontes, parâmetros e implementação continuam em SG050–SG056. O protótipo visual existente permanece disponível.

Entrega: recorte brasileiro com partido na Presidência, 6–10 variáveis de domínio, três políticas, um evento e dois perfis com interesses combinados. Aceite: permitir um mandato curto e continuidade após vitória; não simular individualmente cidadãos ou políticos.

### SG050 Mapear decisões e autorizações — concluído

Registro em 3 de outubro de 2026: [decisões e autorizações do recorte](producao/sg050-decisoes-e-autorizacoes.md). Fontes primárias, três políticas mapeadas, execução autorizada distinta de proposta orçamentária e Senado identificado como simplificação. P2 terá esfera de Mulheres no cenário futuro. Entrega documental; sem implementação de votação ou finanças.

Depende de SG049. Entrega: fontes primárias para ações do governo e dependências institucionais. Aceite: cada tipo de política declara o processo de autorização; distinguir regra brasileira observada e simplificação do jogo. O Senado simplificado não pretende reproduzir todo o Legislativo real.

### SG051 Definir variáveis e perfis — concluído

Registro em 3 de outubro de 2026: [variáveis e perfis do primeiro cenário](producao/sg051-variaveis-e-perfis.md). As dez variáveis receberam unidade, valor inicial e classe de origem; dados observados foram separados de hipóteses, e os dois perfis somam 100% sem duplicar população. Entrega documental; relações, atrasos e parâmetros continuam em SG052–SG053.

Depende de SG049. Entrega: unidade, fonte, data, valores iniciais, peso populacional e interesses dos perfis. Aceite: interesses combinados não duplicam população; opinião sobre medida, aprovação do governo e indicador econômico são distintos. Valores provisórios são identificados.

### SG052 Justificar consequências — concluído

Registro em 3 de outubro de 2026: [consequências do primeiro cenário](producao/sg052-consequencias-do-primeiro-cenario.md). Oito relações diretas foram justificadas com direção, atraso qualitativo, fonte ou hipótese e incerteza; efeitos sociais distintos dos dois perfis e exclusões para evitar dupla contagem foram registrados. Coeficientes e atrasos numéricos continuam em SG053.

Depende de SG050 e SG051. Entrega: cinco a oito relações com direção, atraso, fonte ou hipótese e incerteza. Aceite: uma decisão afeta os perfis de formas distintas; não duplica efeito indireto como direto.

### SG053 Definir parâmetros — concluído

Registro em 3 de outubro de 2026: [parâmetros do primeiro cenário](producao/sg053-parametros-do-primeiro-cenario.md). Foram definidas faixas de recursos, implantação e degradação, coeficientes e intervalos de incerteza, atrasos, duração do evento, limiares de sobrecarga e trajetórias esperadas. Todos usam mecanismos já existentes; valores são hipóteses de jogo separadas dos dados observados.

Depende de SG052. Entrega: faixas, afinidades políticas, justificativa e expectativa de trajetória. Aceite: distinguir hipótese de dado observado; identificar mecanismos necessários além de soma e só usá-los após contrato e testes. Reduzir recorte se faltar evidência.

### SG054 Escrever cenário em JSON — concluído

Registro em 3 de outubro de 2026: [primeiro cenário em JSON](producao/sg054-cenario-json.md). O pacote `brasil-primeiro-cenario` carrega sem regra brasileira no núcleo, inclui estado herdado, políticas vigentes, consequências, evento, situação e finanças derivadas. Um teste confirma que a base não se altera sem nova decisão.

Depende de SG051 a SG053. Entrega: manifesto, variáveis, três políticas tipadas, consequências, evento e estado herdado, incluindo políticas vigentes e implantação. Aceite: carregador e executor funcionam sem regra brasileira no núcleo; iniciar país não aplica novamente custos únicos nem reinicia efeitos já existentes. Estado político inicial é completado conforme SG057 antes da partida integrada.

### SG055 Comparar cenários de referência — concluído

Registro em 3 de outubro de 2026: [comparação de cenários](producao/sg055-comparacao-de-cenarios.md). Base, expansão e redução de atenção básica foram executadas por oito turnos; a cadeia de atrasos e a contrapartida financeira foram verificadas. Uma divergência de ativação das relações intermediárias foi encontrada, corrigida no pacote e documentada.

Depende de SG054. Entrega: executar base, aumento e redução de política. Aceite: comparar expectativas e explicar divergências sem ajustes ocultos.

### SG056 Revisar conteúdo — concluído

Registro em 3 de outubro de 2026: [revisão do primeiro cenário](producao/sg056-revisao-do-primeiro-cenario.md). O recorte foi aprovado como modelo jogável inicial, com fontes, unidades, hipóteses, perfis, estado herdado, limites e pendências visíveis. A Fase 6 está concluída; não há alegação de validade científica.

Marco da fase. Aceite: modelo pequeno, explicável e validado por arquivos; fontes, unidades, limitações e efeitos sociais visíveis. Testes de software não demonstram validade científica.

## Fundação do domínio da partida — SG097 e etapas especiais SG098–SG099

Referência curta e obrigatória para esta frente: [contrato do motor e dos JSONs](arquitetura/contrato-motor-json.md).

Esta frente prepara a integração da Fase 07. Pode avançar em paralelo às
especificações de produto SG057-A/B e SG060-A. SG061 não começa antes da
conclusão de SG097–SG099. As primeiras funções de `Proposal` e `PolicyState`
já existem em `src/domain/game`; os chamados abaixo fecham e integram esses
contratos, não recomeçam do zero.

Ordem de execução desta frente: SG097 e o contrato documental SG057-B2 já estão
concluídos; SG098 é a próxima etapa especial prioritária; SG099 vem após o aceite de
SG098. SG058-A pode evoluir isoladamente em paralelo depois de SG057-B2, mas
SG061 só integra a partida quando SG097–SG099 estiverem concluídos. A numeração
98/99 é posterior à numeração original da Fase 07 e não indica execução tardia.

Prioridade arquitetural da V1: terminar primeiro o motor de conteúdo e suas
relações, usando o Brasil como primeiro pacote de prova, sem codificar números
brasileiros no núcleo. O motor precisa ler definições de leis, estado inicial do
país, dependências, incompatibilidades, autorização, efeitos e parâmetros de
mecanismos; validar referências e executar as opções suportadas. Para a V1,
implementar somente os mecanismos exercitados pelo cenário brasileiro, mas
deixar a seleção, quantidades e limiares em JSON. Outros países reutilizarão
os mecanismos e poderão acrescentar conteúdo; mecanismos matemáticos novos
recebem implementação e teste próprios. Não exigir catálogo mundial de leis ou
governos antes da primeira partida.

### SG097 Mapear o domínio e seus limites — concluído

Entrega: glossário e mapa de contextos para Cenário, Partida, Simulação,
Política, Fiscal, Sociedade, Instituições, Aplicação e Interface; inventário das
dependências entre os módulos atuais. Aceite: cada termo tem significado único;
definições de cenário estão separadas de instâncias e estado de partida;
responsabilidades e dependências proibidas estão documentadas. Não mover pastas
nesta tarefa. Concluído em 6 de outubro de 2026, com o glossário e o inventário
de dependências em `docs/arquitetura/modelagem-do-dominio.md`.

## Etapa especial prioritária — SG098

Este é o próximo chamado de implementação da base do motor. Fica fora da Fase 07 numerada para não parecer uma etapa posterior
a SG058 ou SG061. Seu foco é contrato de proposta/lei vigente e validação
genérica das relações de leis; não é a partida completa.

### SG098 Fechar Proposta e Política Vigente — concluído

Há funções iniciais e testes, mas o chamado não está concluído. SG057-B1 e o
contrato documental SG057-B2 estão concluídos; o aceite final de SG098 ainda
exige resolver as lacunas abaixo. SG099 permanece planejado e dependente de SG098.
Há também um primeiro resolvedor isolado de definições de leis e estado inicial
do país em `src/engine/laws/resolveLawSetup.ts`, com entrada JSON e testes de
dependências e exclusões. Ele ainda não está integrado ao carregador do pacote
nem executa mudanças, votação ou efeitos; não constitui aceite de SG098.

Entrega inicial registrada em 6 de outubro de 2026. `src/domain/game` registra
ciclo e histórico de proposta, origem da política vigente (aprovada ou herdada), alteração de meta,
implantação em direção à meta, revogação gradual e conflitos de propostas abertas.
Os níveis são validados por domínio e opções permitidas da política. A conversão
do pacote resolvido para essas regras e a criação do agregado da partida ficam
para SG099. Verificação histórica: `npm run check` passou; 86 testes aprovados.

A revisão de 7 de outubro identifica lacunas antes do aceite final: separar
opções autorizáveis (`0/1`, por exemplo) dos valores intermediários de implantação;
distinguir vigência jurídica, execução e efeitos remanescentes; definir condição
de encerramento da redução gradual sem depender de atingir exatamente zero por
aproximação assintótica. Incorporar prazo de proposta e único adiamento ao
contrato; a decisão de adiar e a votação probabilística pertencem a SG058-B.
Aceite adicional: lei aprovada admite execução parcial quando declarada;
rejeição ou pendência não altera a política anterior; revogação respeita o
contrato próprio; nenhuma proposta ultrapassa dois turnos sem votação. Não
confundir funções básicas existentes com o ciclo político já integrado.

Incremento de SG098 em 8 de outubro: `validatePolicyLevel` continua exigindo
uma opção autorizável para propostas e metas; `validateImplementedPolicyLevel`
permite valores intermediários dentro do domínio durante a execução. O estado
herdado e as atualizações de implantação usam esta segunda validação, com teste
de opção binária e execução parcial. As demais lacunas acima seguem abertas;
SG098 não está concluído.

Novo incremento: `PolicyState` registra `legalStatus` independente de meta e
implantação. Ao iniciar revogação, a lei deixa de estar juridicamente vigente,
mas seu nível implantado pode permanecer positivo; herança de lei já em
revogação preserva isso. Efeitos remanescentes continuam na memória de relações
do executor e não são apagados pelo estado da lei. A coordenação entre essas
duas partes ainda depende de SG099/SG061; SG098 permanece parcial.

O encerramento da revogação assintótica agora aceita `revocationEpsilon`
declarado nas regras da lei: ao cair abaixo do limiar válido, a implantação
é registrada como zero e o ciclo de execução encerra. Sem esse parâmetro, o
comportamento anterior exige zero exato. A validação rejeita limiar inválido;
isso ainda não representa os efeitos remanescentes da partida integrada.

Para a V1, esse é o contrato próprio de revogação: a definição da lei informa
somente o limiar de término. A execução da partida escolhe os passos ou a taxa
de redução, desde que nunca aumente a implantação durante a revogação. Assim,
não se cria no JSON uma velocidade sem mecanismo integrado que a aplique.

Incremento seguinte: `Proposal` guarda turnos de apresentação, votação normal
e limite máximo derivados de `ProposalTimingRules` (a ser lido do conteúdo),
com um adiamento único e motivo no histórico. O domínio só abre e fecha a
votação no turno agendado; SG058-B/SG061 ainda devem decidir o adiamento e
obrigar o processamento das propostas vencidas ao confirmar o turno. A ponte
`src/game/preparePolicyExecution.ts` traduz `PolicyState` para o executor:
revogação com implantação positiva continua gerando relações, enquanto
implantação encerrada envia controle zero e não solicita relações contínuas.
Relações de duração fixa já iniciadas seguem na `relationMemory`; teste cobre
o efeito remanescente. A ponte ainda não está conectada ao `GameState` de
SG099 nem à confirmação atômica de SG061. SG098 continua parcial.

O limite temporal da V1 agora é imposto pelo domínio: `maximumWaitTurns` não
pode ultrapassar dois turnos, portanto uma regra de conteúdo não pode manter
uma proposta sem votação além desse prazo. A confirmação e o processamento no
turno de vencimento continuam responsabilidades da integração em SG061.

**Aceite de escopo concluído:** proposta, política vigente, implantação parcial,
vigência jurídica, revogação, prazo/adiamento e a ponte isolada ao executor têm
evidência nos testes de domínio e de preparação de execução. `GameState`,
conversão do pacote real e confirmação do turno pertencem a SG099/SG061; decisão
política de adiamento e votação pertence a SG058-B. Em 8 de outubro de 2026,
`npm run check` passou com 30 arquivos e 125 testes; o timeout anterior de
`influenceLayout.test.ts` não se repetiu nem foi atribuído a SG098.

## Etapa especial seguinte — SG099

Começa após SG098; cria a partida a partir do país escolhido e do catálogo
compartilhado. SG061 depende desta base integrada.

### SG099 Criar a Partida e adaptar o cenário — concluído

Depende de SG097 e SG098. Entrega: `GameState` com identidade da partida,
referência imutável ao cenário, turno, propostas, políticas vigentes e execução
necessária; fábrica `createGame` e conversão explícita do pacote resolvido atual
para os contratos de domínio, preservando os JSONs existentes e sem duplicar
regras. Extensões de conteúdo para Senado, finanças e sorteios pertencem aos
respectivos contratos SG057/SG060, com validação própria. Aceite: duas
partidas do mesmo cenário não compartilham estado; IDs duplicados e referências
inexistentes são recusados; a partida referencia a identidade exata do conteúdo;
erros indicam arquivo, ID e campo; criação funciona sem React e não avança a
simulação.

Na extensão eleitoral definida em SG057-B2, resolver referências do país para
leis constitucionais eleitorais iniciais e validar mecanismo, parâmetros,
exclusividade por eleição/alcance e compatibilidade com instituições da
organização política. Guardar as leis vigentes no estado da partida; a troca
constitucional é atômica e não reescreve apurações anteriores.
Separar os JSONs de definição das leis do JSON do país que declara vigência e
estado inicial; uma lei ausente no início continua no catálogo comum e pode ser
proposta se seus requisitos forem cumpridos. Migrar o rascunho atual que concentra essas decisões
em `organizacao-politica.json`, sem tratá-lo como esquema definitivo.

Na extensão política da partida, personagens são gerados para aquela partida
e época; chapas selecionadas por cada partido e ministros escolhidos após a
vitória são estado da partida, com referências a IDs e sem alterar os JSONs.
Essa extensão acompanha SG058-B/SG061 e não bloqueia a fábrica básica SG099.

## Fase 07 Partida completa

Objetivo: integrar partido, Senado, opinião, implantação, finanças e eleições, sem código específico por política. Entrada: SG056 e fundação do domínio SG097–SG099. As especificações de SG057 e SG060 podem avançar em paralelo; a integração do turno aguarda o agregado de Partida.

### SG057 Definir turno, votação, eleições e mudanças constitucionais

Entrega: formalizar as decisões vigentes de eleição, votação com acaso controlado,
tramitação curta e reformas constitucionais; especificar fórmulas ainda abertas,
maiorias, empates e precedência de pendências. Aceite: exemplos distinguem
afinidade, estimativa e voto; renovam somente as vagas senatoriais devidas;
mostram continuidade ou derrota presidencial; e demonstram que uma medida
constitucional não passa pela autorização ordinária. Regras e parâmetros ficam
nos dados de conteúdo; mecanismos novos recebem testes. SG057-A define tempo,
SG057-B1 fornece pesquisa e SG057-B2 fecha o contrato político. SG058-A/B e
SG059 aguardam esse contrato; SG060-A/B pode avançar isoladamente após o
contrato temporal.

<a id="sg057-a-contrato-temporal--em-andamento"></a>

#### SG057-A Contrato temporal — concluído

Aceite final em 8 de outubro de 2026: `npm run check` aprovado, com formatação,
lint, build e 114 testes em 28 arquivos. Preparação mensal ligada à bancada;
FIX-V1-02/04 concluídos. O rascunho arquitetural de SG057-B2 foi documentado,
mas o chamado segue parcial;
detalhes concretos ficam nos chamados de conteúdo e implementação.
Os registros de 93/101 testes abaixo são evidências históricas dos incrementos.

Decisões de 3 de outubro consolidadas em 7 de outubro: cada turno político dura
três meses e executa três passos técnicos mensais. Converter as taxas atuais de implantação e
degradação, definidas por turno, em frações mensais equivalentes, sem acelerar o
avanço total no trimestre. A interface mostra somente o número do turno; meses
decorridos desde o estado inicial permanecem como contador interno. Ajustes já
autorizados escolhidos no início valem desde o primeiro mês; propostas dependentes
do Senado aguardam votação no fechamento e, se aprovadas, orientam a implantação
do trimestre seguinte. Eventos e situações são avaliados mensalmente;
o diário mantém a sequência mensal e resume o turno.
Receitas e despesas recorrentes são apuradas mensalmente e somadas no resumo
trimestral; fórmulas e conversões ficam no SG060-A. Os três meses são confirmados
como um único turno, sem estado parcial em caso de falha. No calendário padrão
de quatro anos, cada mandato tem 16 turnos trimestrais. Os cinco turnos antes da
eleição oferecem ações de campanha; no turno 16, o tempo, as políticas e as
contas avançam normalmente, e então o jogo apresenta o resultado. Não recebe
novas decisões ordinárias de governo, mas a simulação e os prazos continuam.

Primeiro incremento implementado na bancada técnica: `advanceQuarterlyLaboratoryTurn`
encadeia três avanços mensais, aplica as decisões pendentes no primeiro mês e
converte implantação/degradação trimestral em frações mensais equivalentes.
O helper recusa começar fora de uma fronteira trimestral e identifica mês e
trimestre absolutos no resultado. Agora também avalia situações e eventos a cada
mês; evento dispara uma vez e suas relações começam a influenciar a partir do
mês seguinte. O retorno contém os registros mensais e um resumo do trimestre; o
diário consegue distinguir ambos.
Sete testes focados cobrem avanço trimestral, preservação das taxas de
implantação e degradação, ativação mensal de situações e eventos, limite de
fronteira e atomicidade diante de falha. O botão Avançar no mapa de referência
agora chama o helper trimestral: cada clique roda três meses, atualiza a
contagem de turnos e registra os passos mensais e o resumo trimestral no diário.
Formatação, lint e build passaram em `npm run check`; `npm test` passou com 93
testes em 26 arquivos.
Verificação manual em tela em 8 de outubro: o laboratório abriu localmente;
um clique em “Próximo turno” avançou de Turno 0 para Turno 1 e exibiu no diário
Mês 1, Mês 2, Mês 3 e o resumo trimestral. Isso verifica o fluxo da bancada,
não a integração com uma partida SG099.
A confirmação atual atualiza o estado do laboratório, não o agregado político
SG099. Integrar finanças, propostas, votações e eleições à partida real pertence
a SG061. O aceite de SG057-A foi concluído com a preparação mensal ligada à
bancada, conversão de fluxos e testes de propagação e acumulação. As cadeias sem
atraso explícito passam a propagar mensalmente: mudança de ritmo documentada,
não promessa de trajetórias idênticas ao motor trimestral anterior.
A renovação do Senado segue seu calendário próprio, preservando mandatos de
oito anos e alternando duas/uma vaga por UF. Após vitória presidencial, começa o
mandato seguinte preservando o país, a tramitação e os vencimentos senatoriais;
reiniciar o contador presidencial não reinicia esses prazos. Para cenários que
permitam alterar a duração do mandato por lei ou política, SG057 precisa definir
o efeito sobre eleições agendadas e mandatos em curso antes de habilitar essa ação. Ver
`docs/producao/sg057-proxima-fase-e-economia.md`.

##### FIX-V1-02 Migrar todas as unidades temporais do conteúdo — concluído

Origem: achado 2. Responsável: SG057-A, usando os conteúdos de SG053–SG054 como
entrada de migração, sem reabrir seus aceites históricos. Executar antes do aceite
temporal e da utilização desses conteúdos no turno mensal integrado.

Inventário registrado em [SG057-A — inventário e aceite temporal](producao/sg057-inventario-temporal.md).
Preparação mensal implementada em `src/game/prepareMonthlyContent.ts`, com
unidade declarada nos manifestos do Brasil e da bancada, conversão de atrasos e
durações e reconstrução do grafo sem alterar o conteúdo original. Há testes de
idempotência, taxas e efeitos únicos. Bases de fluxo, limites, condições e
coeficientes de origem foram convertidos; preparação ligada ao início da bancada.
Não há conversão de saves existentes. O inventário registra a semântica mensal
da propagação implícita e preserva as unidades anuais demonstrativas do mapa.

Validação incremental dos acumulados: seis testes em
`src/tests/monthlyAccumulation.test.ts` comparam 60 trimestres a 180 meses para
taxas constantes de entrada/saída, incluindo déficit e saldo zero; verificam
efeito único sem reaplicação, efeito fixo de nove meses, estoque inicial e
idempotência. Mais três testes verificam fluxos intermediários, origens variáveis
e propagação independente da ordem dos nós; não se exige igualdade com amostragem
trimestral quando os valores mudam dentro do trimestre.

Entrega: inventariar implantação, degradação, atrasos, durações, propagação entre
nós e contribuições recorrentes; declarar a unidade de cada campo e converter
ou recalibrar explicitamente o conteúdo. Distinguir níveis, fluxos e taxas; a
conversão contábil detalhada pertence a SG060-A. Registrar qualquer mudança
intencional de ritmo, sem apresentar recalibração como simples conversão.
Aceite: uma duração de três turnos trimestrais corresponde a nove meses;
atrasos e cadeias são comparados no mesmo tempo de calendário; a implantação
mantém a equivalência já testada. Exemplos de efeitos únicos e contínuos não
triplicam recompensas por executar três passos. Conteúdo sem unidade temporal
inequívoca não entra silenciosamente na partida.

##### FIX-V1-04 Separar o aceite temporal da integração — concluído

Origem: achado 4. Responsável: SG057-A; conferir ao fechar o chamado e ao iniciar
SG060-A/B. A fronteira documental é corrigida neste plano: SG057-A entrega tempo,
conversões e composição dos passos; SG061 entrega a transação da partida inteira.

Entrega: checklist de aceite temporal com passos mensais, fronteira trimestral,
contadores absolutos, ordem de execução, diário e preservação do estado em falha,
incluindo FIX-V1-02. Usar componentes sintéticos quando finanças ou política ainda
não existirem. Aceite: SG057-A pode ser verificado sem SG060 ou SG061 prontos;
SG060 usa o contrato temporal aceito e SG061 integra os componentes depois.
Não marcar SG057-A concluído apenas por retirar a dependência circular.

Checklist registrado no inventário temporal acima. Incremento de implementação:
proteção de precisão do contador, testes de continuidade entre trimestres e
falhas sintéticas no segundo/terceiro mês com nova tentativa sem perda de estado.
O checklist temporal e a migração FIX-V1-02 foram concluídos. Um teste do pacote
preparado usado pela interface percorre 16 trimestres/48 meses sem reiniciar o
contador e confirma que a implantação não é convertida duas vezes.

Verificação deste incremento em 8 de outubro: `npm run check` passou
(formatação, lint, build e 101 testes em 26 arquivos, sendo 15 testes do helper
trimestral). Sem alteração visual ou declaração de integração da partida.

#### SG057-B Regras políticas — planejado

Detalhar Senado, autorização e eleições conforme o escopo existente. O estudo
eleitoral informa o contrato, sem importar fórmulas de outro simulador como regras
do Brasil. Integração das ações exige esta entrega; contabilidade pode ser testada
isoladamente após SG057-A. Definir ações, custos, efeitos e limites da campanha
nos cinco turnos anteriores; ações de campanha podem ser combinadas no mesmo
turno quando forem compatíveis. Cada ação declarará seus próprios requisitos,
custos, efeitos e incompatibilidades. O orçamento de campanha recebe recursos do
Fundo Eleitoral (FEFC) e doações de pessoas físicas, registrando eventual
afiliação destas a grupos de interesse. Para a primeira versão, o cenário declara
uma verba eleitoral total por partido como simplificação da cota do FEFC; doações
individuais somam a esse caixa. O Fundo Partidário regular fica fora desse cálculo
inicial. Limites e regras de uso serão definidos. Empresas foram mencionadas como
fonte de influência ou recursos, mas doações empresariais são proibidas pela
regra brasileira vigente; SG057-B deve decidir se serão representadas como
financiamento irregular ou por regra alternativa. O turno eleitoral é exclusivo
e não recebe decisões ordinárias de governo; tempo, contas e tramitação anterior
continuam. O contrato de precedência eleitoral deve respeitar a espera máxima
de dois turnos, sem congelar propostas por causa da eleição.

##### SG057-B1 Estudar modelos de simulação eleitoral — concluído no recorte de pesquisa

Aceite documental em 8 de outubro de 2026: a ficha compara os modelos e fontes
previstos, separa impacto material, opinião e voto, registra limites de
calibração/validação e traz o exemplo manual de dois estados sem duplicar
eleitores. SG057-B2 define o contrato para leis eleitorais configuráveis;
as fórmulas suportadas e os parâmetros concretos pertencem ao conteúdo e aos
chamados de implementação, não a esta pesquisa.

Comparar os efeitos sobre grupos documentados para _Democracy 4_, o modelo de
dois turnos aplicado à eleição brasileira de 2010, a simulação probabilística
de populações distribuídas por território e o TriplePC, que combina impactos
materiais e preferências declaradas sobre políticas. Estudar o
[BRASMOD](https://labpub.fea.usp.br/brasmod/) como referência brasileira para
simular a distribuição dos efeitos de impostos e benefícios, e o estudo
[_Isentar os pobres, moderar com os ricos_](https://www.scielo.br/j/rsocp/a/47YbrsfLMZTBY9jJXtKYfmr/?format=html&lang=pt)
como evidência brasileira de preferências sobre propostas de Imposto de Renda.
Essas fontes cobrem partes diferentes do problema; coeficientes britânicos do
TriplePC só podem entrar como hipóteses provisórias, nunca como medidas da
reação brasileira. Registrar entradas, reação dos grupos, decisão de voto,
apuração, calibração, validação, limites e possível
adaptação ao SisGov. Entrega:
[ficha de pesquisa SG057-B1](producao/sg057-b1-estudo-simulacao-eleitoral.md),
com exemplo manual de uma política que afeta diretamente grupos, depois um
indicador nacional e, por composição local, produz reações diferentes em dois
estados sem duplicar eleitores. Distinguir números observados de hipóteses do
jogo. O estudo não escolhe fórmula, pesos nem treinamento.

##### SG057-B2 Definir o contrato político do SisGov — concluído no recorte documental

Aceite documental em 8 de outubro de 2026, registrado no
[contrato político da V1](producao/sg057-b2-contrato-politico.md#aceite-documental-do-contrato-genérico).
Entrega: contrato genérico de leis como decisões políticas,
incluindo vínculos entre leis, proteção constitucional, incompatibilidades,
pré-requisitos de alteração, autorização e transição de estado. O motor valida
e executa; JSONs de leis definem possibilidades e o JSON do país define o
estado inicial. SG098/099 definem esquemas e conteúdo; SG058/059 implementam
regras políticas; SG061 integra a partida. SG057-B1 está concluído e a
conferência com a pesquisa ficou registrada no aceite documental.
O B2 não depende de fechar números, fórmulas eleitorais concretas, tamanho de
listas, balanceamento ou histórias. Propostas opcionais nos documentos de apoio
não se tornam regras aprovadas nem bloqueiam este aceite. O código dessas
mecânicas continua planejado.

Nova direção confirmada: personagens gerados a partir de parâmetros JSON,
com histórias atribuídas depois da geração, a partir de catálogo JSON separado
com tags e restrições. A história não altera atributos e fica salva na partida.
Especificação técnica proposta de seleção, reutilização e falta de correspondência:
[histórias de personagens](arquitetura/selecao-historias-personagens.md), a executar
em SG098/099, SG071 e SG081/082 com os aceites ali descritos.
As opiniões são dinâmicas em resposta a leis e indicadores, com acaso condicionado
nas reações dos personagens. Filiação não é lealdade fixa; aceitar coligação continua determinístico
para o mesmo estado. Presidente, vice e ministros não acumulam esses cargos na V1.
O motor gera personagens para a partida e sua época. O jogador escolhe
presidente e vice de seu partido entre os disponíveis; os outros partidos
escolhem suas chapas e disputam. Ao vencer, o jogador escolhe ministros.
O motor valida autoridade, cargo e
elegibilidade definidos pelo conteúdo. Quando necessário, escolha de juízes usa
essa mesma ação genérica; sem sistema adicional de indicação. Parâmetros de
opinião e geração ficam nos JSONs e nos chamados que os implementam.
Modelo técnico proposto de reação por turno, fontes ativas e variação contextual:
[opiniões dos personagens](arquitetura/opinioes-personagens.md), com aceites para
SG058-A e persistência. O esquema e os parâmetros concretos permanecem pendentes.

Ampliação confirmada da V1: [escolha de presidente, vice e ministros](producao/sg057-b2-contrato-politico.md#personagens-e-escolha-de-governo--v1-confirmada).
Catálogo de personagens por JSON com história, preferências e apoios/rejeições;
chamados SG098/099, SG058/059, SG069/071 e SG081/082 recebem os aceites descritos
nesse recorte. Não confundir seleção limitada com gestão completa de gabinete.
Transferência integral de votos à chapa explicitamente apoiada também confirmada.
Confirmado também: escolher presidente/vice antes da eleição e permitir substituir
ministros durante o mandato. Consequências das trocas são declaradas nos JSONs,
sem custo ou punição universal implícita; aceites específicos em SG058/059 no B2.

Diretriz de implementação: [conteúdo configurável por JSON](arquitetura/conteudo-configuravel-json.md).
SG098/099 devem manter grupos, país, leis, Constituição, situações, índices e
eventos como entidades distintas e referenciáveis, com mecanismos genéricos.
Planejar manual de conteúdo/mods antes da disponibilização desse recurso aos
usuários; exemplos e aceites estão na diretriz. Usuário confirmou associações
a grupos sobrepostos com pesos de importância em JSON, distintas do peso eleitoral
único de cada parcela. Normalização especificada no contrato B2: média ponderada,
pesos explícitos, zeros sem contribuição e rejeição de dados inválidos. SG058-A
implementará os exemplos de aceite; valores finais ficam no conteúdo.

Contrato consolidado: [contrato político da V1](producao/sg057-b2-contrato-politico.md).
Pesquisa complementar: [Democracy 4 — efeitos e apoio](producao/pesquisa-democracy4-efeitos-apoio.md).
Usuário confirmou contribuição de apoio vinculada ao efeito, sem bônus mensal
repetido. JSONs declaram conteúdo e parâmetros; o motor resolve mecanismos
genéricos. Propostas de fórmula ou balanceamento nos textos de apoio continuam
como opções para os chamados de implementação; SG057-B2 está aceito no recorte
documental após a conclusão de SG057-B1.

Início autorizado após a ficha de pesquisa SG057-B1. Decisões já confirmadas:
Presidência em turno único, vencida pela maior votação nacional, com segundo
turno adiado; Senado com três vagas por UF, mandatos de oito anos e renovação
alternada de duas/uma vaga a cada quatro anos; acaso controlado na votação de
propostas, influenciado por afinidade política e opinião pública. O jogo simula
partidos como atores eleitorais e instituições, com força baseada nas ideias e
programas que representam e nas preferências dos grupos; não exige administrar
sua estrutura interna. Preferência política pode mudar com efeitos políticos e
não se confunde com aprovação do governo. Nas UFs com duas vagas senatoriais,
distribuir cadeiras pelas maiores médias dos votos agregados por partido,
permitindo que um partido leve as duas; não simular candidatos individuais.
Fonte aprovada: cada política declara no JSON os grupos afetados e a variação
em pontos percentuais, aplicada quando seus efeitos alcançam o grupo. O ciclo
de aplicação e os extremos de redistribuição serão fechados nos FIX-V1-01/06;
as magnitudes por política permanecem parâmetros de balanceamento. Empates
eleitorais são resolvidos com um d20 por partido empatado; o maior resultado
vence, e empate no dado é rolado novamente entre os empatados. Votação de proposta
exige a maioria ou o quórum aplicável; um empate não aprova a medida. Se votação
pendente e renovação do Senado coincidirem, a composição que
encerra o mandato vota primeiro; a renovação acontece depois e a nova composição
vale no turno seguinte.
Para a votação ordinária, as 81 cadeiras votam e são necessários 41 votos
favoráveis; o JSON expressa isso como maioria absoluta das cadeiras ativas, para
se adaptar quando o cenário alterar a quantidade. Efeitos simultâneos são
somados antes de aplicar a mudança; o apoio da coalizão fica entre 0% e 100%,
com proporções internas preservadas. SG057-A está concluído no recorte temporal.

Uma política ordinária não pode revogar diretamente uma garantia constitucional.
O jogador poderá seguir dois caminhos para mudar instituições protegidas: tentar
uma reforma constitucional, sujeita a um processo mais difícil; ou provocar uma
ruptura da ordem constitucional, suspendendo/descumprindo as regras vigentes sem
aprovar a emenda exigida. A ruptura é um golpe e não exige apoio parlamentar.
Para avançar, requer apoio dos comandantes das três Forças Armadas ou apoio do
Judiciário; obter ambos não é requisito. O apoio do Judiciário será, por
enquanto, uma posição institucional da corte, sem simular juízes individualmente.
No jogo, exemplos dessa ruptura são cancelar eleições ou dissolver o Congresso
enquanto a Constituição ainda os protege. Na referência brasileira, o ministro
da Defesa indica os três comandantes e o presidente os nomeia; para o jogo, a
indicação dependerá de o ministro da Defesa apoiar o presidente. Esse alinhamento
é uma regra de gameplay, não uma exigência legal brasileira. A forma de conquistar
o apoio dos comandantes ou do Judiciário e os riscos e efeitos próprios da ruptura
ainda serão definidos para balanceamento. A escolha de comandantes será oferecida
em eventos quando houver vaga: o ministro da Defesa consulta a preferência do
presidente sobre qual candidato indicar. Quanto maior o apoio do ministro ao
presidente, maior o peso dado a essa preferência; a escolha não é automaticamente
garantida. A Constituição vigente
e as políticas disponíveis pertencem ao conteúdo do país; o catálogo geral
define organizações possíveis e mecanismos reutilizáveis. A organização em
vigor deve ser inferida a partir das mudanças aprovadas, sem obrigar o jogador
a selecionar um rótulo como “ditadura”.

O exemplo brasileiro ainda precisa substituir o rascunho concentrado em
`organizacao-politica.json` pela separação entre catálogo de organizações, JSON
do país e JSONs de leis. O JSON da lei define requisitos, mecanismo,
incompatibilidades e efeitos; o país define quais leis começam vigentes e em
qual estado. Valores mencionados neste plano descrevem o conteúdo inicial
proposto, não regras imutáveis do motor. **Decisão do usuário:** a votação constitucional
será uma apuração geral simplificada do Congresso, representando Câmara e Senado
em conjunto; o jogo não detalhará separadamente cada Casa. O processo brasileiro
real exige três quintos em dois turnos em cada Casa ([Constituição Federal,
art. 60, § 2º](https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm));
a V1 do jogo abstrai essa estrutura: a emenda precisa de pelo menos 60% de apoio
em cada uma de duas votações gerais simplificadas realizadas no mesmo fechamento
trimestral. Se uma falhar, a tentativa é rejeitada. O
usuário confirmou os dois caminhos para transição de regime: reforma constitucional
e golpe fora da ordem constitucional. O golpe não depende de parlamentares; exige
apoio dos comandantes das três Forças Armadas ou do Judiciário. A representação do
Judiciário é institucional, sem simulação individual dos juízes. Na mecânica do
jogo, a indicação dos comandantes depende de o ministro da Defesa apoiar o
presidente; o presidente formaliza a nomeação. Esses caminhos são distintos;
custos, riscos e efeitos específicos do golpe permanecem para balanceamento posterior.

Depende de SG057-B1. Definir quais dados do grafo e do cenário alimentam o
eleitorado, como ações federais alcançam grupos em cada estado, e como estimar
separadamente o efeito sobre o bem-estar do grupo e a aprovação da medida, sem
exigir uma microssimulação de domicílios na primeira versão. Definir o que o motor
devolve e como explica suas causas. Definir separadamente regras brasileiras de
eleição, apuração e ligação com o Senado; o modelo territorial estudado não as
fornece. Aceite: exemplos manuais distinguem reação direta da reação aos
resultados, contam cada pessoa uma vez e preservam resultados separados para
Presidência e Senado. Para a Presidência, somar por partido a intenção de voto dos
grupos ponderados e declarar vencedor quem obtiver o maior total nacional;
segundo turno fica para uma etapa posterior.

Decisão do usuário: o cenário define a preferência política inicial de cada
grupo, expressa por apoio a partidos/forças eleitorais que representam ideias e
programas; efeitos políticos podem alterá-la. Partidos são atores da simulação
eleitoral, sem exigir gestão de sua estrutura interna. Preferência política não
se confunde com aprovação do governo. Efeitos políticos aumentam ou reduzem a parcela da coalizão
governante no grupo; a variação oposta é redistribuída proporcionalmente entre
os demais partidos. A distribuição permanece normalizada: somar efeitos
simultâneos antes da redistribuição, limitar o apoio da coalizão entre 0% e 100%
e preservar a proporção interna dos partidos de cada lado.

Para o Senado brasileiro, carregar cadeiras com partido, UF e vencimento do mandato; renovar
alternadamente duas e uma das três vagas por estado/DF a cada quatro anos, com
mandatos de oito anos. A próxima renovação deriva do cenário, não começa sempre
com duas vagas em toda nova partida. As demais cadeiras permanecem. A apuração
por UF usa os votos agregados a partir das preferências pelos partidos,
ideias e programas;
quando há duas vagas, atribuí-las pelas maiores médias partidárias, permitindo
que um partido conquiste ambas. Trata-se de conversão do resultado eleitoral em
cadeiras; não exige gestão de candidatos individuais. Não duplicar eleitores por
interesses sobrepostos. Em empate eleitoral, cada partido empatado recebe um
d20; vence o maior resultado e, se os dados empatarem, repete-se apenas entre
esses partidos. Se a votação coincidir com a renovação do Senado, vota a composição que encerra o
mandato; a renovação ocorre depois e a composição nova vale no turno seguinte.

A votação de propostas usa afinidade partidária e opinião pública para formar
apoio e probabilidades; elas não são o valor bruto da afinidade do JSON. Exige a
maioria ou o quórum aplicável; empate não aprova. O d20 desempata apenas eleição.
Definir incerteza limitada, quórum, maioria e explicação do resultado. A regra inicial
de tramitação é votar no próximo fechamento, com um único adiamento excepcional
e justificado e limite de dois turnos. Ao atingir o limite, votar, sem aprovação
automática. Definir a condição do adiamento no cenário; não acrescentar uma
roleta de atrasos sem contrato. Sorteios ficam na camada de jogo, com estado
persistido e testes reproduzíveis; fórmulas e pesos permanecem para balanceamento.

###### FIX-V1-09 Implementar o recorte institucional e de campanha da V1 — planejado

Origem: achado 9. O recorte arquitetural está em revisão em SG057-B2; detalhes de
conteúdo e implementação pertencem a SG058/SG059/SG061. Definir uma entrega mínima
verificável para Constituição, reforma, ruptura, apoios institucionais,
nomeações e campanha; mapear cada entrega para seu chamado e sua interface.

Preservar os caminhos aprovados de reforma e ruptura. Especificar quais estados
agregados bastam para ministro, três comandantes e Judiciário e quais eventos
serão necessários, sem inferir um sistema completo de gabinete. Para campanha,
fixar o conjunto mínimo de ações, seus recursos e efeitos. Explicitar o que fica
na V1 e o que é expansão; qualquer adiamento de uma mecânica aprovada requer
decisão de produto registrada, não exclusão silenciosa por implementação.
Aceite: cada mecânica incluída tem entrada, ação, resultado, estado persistido
e chamado responsável. Não é necessário fechar todos os coeficientes finais.

SG057-B2 estabelece os mecanismos e limites de escopo. Esquemas, fórmulas,
valores e testes dos FIX-V1-01/06, 05, 07, 08 e 03 são resolvidos nos chamados
responsáveis abaixo, no momento da implementação. Não voltar ao B2 para aprovar
cada quantidade ou parâmetro que o JSON poderá declarar.

### SG058 Completar contrato das ações

Depende de SG057. Entrega: aplicar SG015 às políticas reais com disponibilidade, estimativas de opinião e apoio, autorização, nível desejado, implantação, custo e revogação. Aceite: JSON usa comandos genéricos; proposta popular pode ser rejeitada e impopular aprovada com reação pública; rejeição não inicia implantação. SG058-A/B implementam a parte política definida em SG057-B2; dividir as demais ações conforme estimativa de esforço.

#### SG058-A Implementar a reação dos grupos — planejado

Direção autorizada: arquitetura de influências inspirada no Democracy 4,
configurada por JSONs. Seguir o [contrato de influências](producao/sg057-b2-contrato-politico.md#contrato-de-influências-para-sg058-a):
rotas política → grupo e indicador → grupo, contribuições identificadas sem
acumulação mensal indevida, grandezas distintas e explicações por origem.
Não importar automaticamente média móvel, complacência ou eleitores individuais.

Depende de SG057-B2. Calcular o impacto material e a reação à medida e aos seus
resultados com os dados e mecanismos aprovados no contrato, mantendo procedência
e peso eleitoral único por pessoa modelada. Aceite: uma política afeta grupos em
momentos distintos, com causas explicáveis; benefício material e aprovação podem
divergir sem contribuição duplicada. Incluir a contrapartida fiscal da v1:
benefícios presentes podem elevar apoio, enquanto o peso crescente dos juros no
orçamento pode gerar desgaste gradual e distinto entre grupos. Declarar a relação,
seu atraso e seus parâmetros; não deduzir apoio duas vezes pela mesma pressão.
Usar saídas de SG060-A/B na integração; exemplos sintéticos bastam no teste isolado.

##### FIX-V1-01 Impedir reaplicação indevida de efeitos políticos — planejado

Origem: achado 1. Responsável: SG058-A, com contrato em SG057-B2 e estado de
vigência em SG098–SG099. Antes de implementar a reação, registrar a decisão
aprovada: cada política declara no JSON os grupos e a variação em pontos
percentuais de apoio à coalizão, aplicada quando o efeito alcança o grupo.

Entrega: definir efeito único ou persistente, unidade temporal, intensidade,
atraso, duração, revogação e identidade da origem. Separar recompensa à medida
de recompensa aos resultados; decidir como efeitos herdados entram no apoio
inicial e como reativação é tratada. Guardar contribuições ou consumo de eventos
conforme o contrato, evitando reaplicação causada apenas pelo avanço mensal.
Aceite: um efeito único de +2 pontos transforma 40% em 42%, mesmo com três passos;
manter, revogar e reativar não produz bônus duplicado. Um efeito reversível que
leva 99% ao limite de 100% restaura 99% ao ser removido isoladamente. Um efeito
deliberadamente recorrente respeita a frequência declarada. Restaurar a partida
e repetir uma operação não duplica o efeito nem recompensa políticas herdadas
novamente. Persistência desses estados entra em SG081–SG082.

##### FIX-V1-06 Definir redistribuição nos extremos de apoio — planejado

Origem: achado 6. Responsável: SG058-A, junto da soma de efeitos de FIX-V1-01;
contrato definido em SG057-B2. Entrega: definir pesos de referência e elegibilidade
para redistribuir quando coalizão ou oposição somarem zero; tratar também a
ausência de partidos elegíveis e validar os dados do cenário.
Aceite: ganhos a partir de 0%, perdas a partir de 100% e efeitos simultâneos
produzem parcelas finitas, não negativas e total de 100%. Alterar a ordem dos
efeitos não altera o resultado. Um partido inelegível não recebe apoio por
fallback e nenhuma divisão por zero entra na partida.

#### SG058-B Integrar apuração e resposta institucional — planejado

Depende de SG058-A e SG057-B2. Integrar os resultados do eleitorado às eleições
e a reação popular às decisões do Senado, conforme as regras iniciais escolhidas
no JSON do país e o contrato de autorização definido em SG057-B2. A implementação
despacha para mecanismos eleitorais suportados pelo motor; não fixa Brasil no
núcleo. Aceite: apurações para Presidência
e Senado são separadas; afinidade, estimativa, voto parlamentar e resultado
eleitoral não se confundem. Cobrir renovação duas/uma vaga por UF, preservação de
mandatos, votação probabilística influenciada pelo apoio, espera normal e único
adiamento, prazo máximo e retentativa sem novo sorteio. As rotas executivas já
autorizadas continuam dispensando votação parlamentar.

##### FIX-V1-05 Ligar apoio partidário a candidaturas presidenciais — planejado

Origem: achado 5. Responsável: SG058-B, após definição em SG057-B2 e integração
dos dados em SG099. Entrega: declarar quais candidaturas presidenciais existem,
qual representa o jogador e se os aliados apoiam uma candidatura comum ou
concorrem separadamente. Não deduzir essa escolha apenas do total da coalizão.
Regra confirmada no B2: avaliação da chapa por compatibilidade de ideias,
apoio/rejeição aos personagens e interesse na vice-presidência; parâmetros e
limiar em JSON, sem sorteio na V1. Explicar aceitação/recusa e registrar apoio
separadamente da prévia. Apoio eleitoral não garante voto em leis nem adesão
automática à base de governo. Ver aceites no contrato B2.
Trocas da chapa são permitidas até um limite anterior à eleição definido no JSON.
Retirar candidato já anunciado causa desagrado ao seu partido e apoiadores,
com alvos e parâmetros no conteúdo, e exige reavaliar alianças. Prévia não gera
efeito; confirmação e consequências são atômicas e não se repetem no save.
Prazo confirmado para o primeiro cenário: três meses antes da eleição, configurável
no JSON. Eleição no mês 48 fecha a chapa no mês 45, após o turno 15; no limite
e depois dele, alterações ficam bloqueadas. Apoio pessoal confirmado: afinidades
do personagem por grupo em JSON, combinadas pelos pesos de interesse da parcela,
separadamente da preferência partidária. Retirada pública gera reação proporcional
ao apoio pessoal conforme parâmetros declarados, uma vez por parcela e ocorrência,
sem multiplicar eleitores ou penalidades por grupos sobrepostos. Escalas e valores
padrão das afinidades ainda devem ser explicitados no esquema.
Aceite: exemplo jogador 30%, aliado 25%, oposição 45% produz um vencedor segundo
a regra declarada e permite explicar o destino dos votos do aliado. A apuração
presidencial não duplica votos; partidos e cadeiras continuam separados na
apuração senatorial. SG071 deve exibir o resultado de acordo com esse vínculo.

##### FIX-V1-07 Definir colegiado e contagem constitucional — planejado

Origem: achado 7. Responsável: SG058-B, com contrato em SG057-B2 e validação em
SG059. Entrega: identificar o colegiado agregado que representa Câmara/Senado,
sua relação com as cadeiras já modeladas, denominador, arredondamento e eventual
quórum de presença. Preservar 60% em cada uma das duas votações no mesmo fechamento.
Definir a relação entre os sorteios das rodadas e usar o gerador da partida.
Aceite: quando a base for 81 cadeiras, maioria absoluta exige 41 votos e 60%
exige 49 em cada rodada. Outros tamanhos usam as mesmas regras; empate não
aprova. Colegiado ausente ou sem cadeiras segue a autorização institucional
definida no FIX-V1-03, nunca aprovação automática por limiar zero. Falha e
restauração preservam os resultados das rodadas e a estimativa explica a chance
de concluir ambas, sem tratá-la como a chance de uma rodada isolada.

##### FIX-V1-08 Formalizar maiores médias e pesos eleitorais por UF — planejado

Origem: achado 8. Responsável: SG058-B, com contrato em SG057-B2 e carregamento
em SG099. Entrega: fixar fórmula e divisores, eleição de uma vaga, elegibilidade,
comparação para empate e precisão. Acrescentar pesos eleitorais dos perfis por
UF e sua agregação nacional, admitindo hipóteses sintéticas identificadas na V1.
Aceite: exemplos 70/30 e 60/40 com duas vagas têm resultado manual reproduzível
pela fórmula escolhida; um partido pode conquistar as duas. Renovação preserva
as vagas fora da disputa. UFs com perfis diferentes podem reagir diferentemente;
Presidência pondera eleitores, sem dar automaticamente o mesmo peso a cada UF.
Empate real usa d20, empate apenas no valor arredondado da tela não. O sorteio
desempata também a disputa de uma cadeira quando as médias forem iguais.

#### SG058-C Limites e capacidade avançada — evolução posterior ao ciclo inicial

Não bloqueia SG059–SG064 na primeira versão. Os limites e requisitos existentes
continuam validados; este chamado amplia a modelagem. Separar limites legais,
financeiros, operacionais e de resultado. Implementar uma política de Saúde com
demanda, capacidade, retorno decrescente e expansão com atraso.
Mecanismos novos exigem contrato e testes antes de entrar no JSON. Dinheiro não
recebe teto universal de 100; controle e domínio dependem do significado da política.

#### SG058-D Governança e eficiência — evolução posterior ao ciclo inicial

Não bloqueia SG059–SG064. Distinguir desvio, superfaturamento e desperdício;
considerar fiscalização e capacidade administrativa. Gasto elevado não implica corrupção automática. Cobrir
contabilidade sem dupla perda e comparar gestão forte/fraca com mesmo orçamento.

### SG059 Validar escolhas e conflitos

Depende do contrato SG058, de SG058-A/B e de SG098–SG099; não depende das extensões
SG058-C/D. Entrega: requisitos de políticas e opções de dilemas no mesmo fluxo.
Aceite: impedimentos têm motivo; escolhas incompatíveis e escritas conflitantes
não chegam ao executor. Baixa popularidade não vira bloqueio automático;
rejeição parlamentar difere de comando inválido. Validar rotas executivas,
propostas pendentes, prazo máximo e autorizações antes de iniciar implantação.

### SG060 Contabilizar finanças públicas

O núcleo SG060-A/B depende do contrato temporal SG057-A e pode ser testado sem
Senado ou interface. Sua integração com as políticas usa os contratos de SG058,
SG059 e SG098–SG099 em SG061. Entrega: receitas, despesas, caixa, dívida, juros
herdados e juros da dívida nova, com custos únicos e recorrentes. Aceite: déficit
é financiado automaticamente; erro técnico não cobra e repetição não duplica
cobrança. Custos seguem implantação e vigência, com uma fonte contábil e sem novo
débito do mesmo custo pelo grafo. SG060-C não integra o aceite da primeira versão.

#### SG060-A Identidades e unidades — em especificação

Decisão de planejamento: cada cenário declara período inicial e referência própria
de preços; a v1 mantém preços reais constantes durante a partida, sem inflação
endógena. Normalizar fluxos recorrentes anuais por mês, distinguir estoques,
transações únicas e taxas, e adaptar a unidade hoje fixa em preços de 2024 para
uma base declarada pelo cenário. Carregar a despesa efetiva com juros observada
para cada recorte histórico; não aplicar uma taxa única ao estoque total da dívida.
O piloto parte da transição após Lula III: Lula IV se Lula vencer 2026, ou cenário
alternativo “Bolsoflavio I” se perder, sem presumir o resultado. Usar o último
período fiscal oficial consolidado disponível, registrando fontes e data de corte;
atualizar para o fechamento de 2026 quando os dados realizados forem publicados.
Especificar e verificar manualmente resultado primário/nominal, caixa, dívida,
juros herdados, juros da dívida nova e emissão antes da implementação fiscal. Ver
`docs/producao/sg057-proxima-fase-e-economia.md` e o inventário de fontes
`docs/producao/sg060-fontes-fiscais.md`. Já foram extraídos fluxos RTN de 2025
fechado e janeiro–agosto/2026; o acumulado parcial foi cruzado com o resultado
acima da linha do RREO até arredondamento de R$ 1 mil. O RMD de agosto/2026
fornece ficha separada para DPF, composição, perfil de vencimentos e custos
médios; esses números não se equiparam à dívida consolidada líquida ou à
disponibilidade do Anexo 6 do RREO. Ainda falta uma série de caixa livre do
Tesouro. Faltam reconciliar 2025 com as tabelas do RREO, escolher conceitos
compatíveis para juros/resultado nominal e fixar índice/mês-base de preços antes
de inserir dados no cenário. As consultas SICONFI testadas retornaram listas
vazias, então a rota federal permanece pendente de validação.

**Evidência histórica, não contrato da partida:** exemplo anual de 2025 e turno junho–agosto/2026
agregado da mesma vintagem RTN, com resultados “acima” e “abaixo da linha”
separados; a fonte não oferece saldos de caixa compatíveis para inferir
financiamento. **Decisão registrada para o relatório histórico:** resultado
primário acima da linha lidera o resumo; abaixo da linha e nominal aparecem como
reconciliação no diário, sem misturar conceitos. Os critérios de clareza agora
estão registrados no plano detalhado: período/unidade/fonte explícitos; déficit
não confundido com caixa; histórico não apresentado como previsão; no relatório
histórico, caixa e financiamento marcados como não modelados.
**Verificação documental mínima concluída:** soma de receita, despesa e resultado primário do turno fecha; as
reconciliações permanecem separadas; caixa e emissão não são inferidos das fontes.

**Próximo marco vigente:** demonstrar o ciclo jogável com caixa, dívida e juros
usando exemplos sintéticos identificados, antes da implementação SG060-B. O
relatório histórico serve à validação das fontes e não substitui esse ciclo.
Formalizar taxa mensal fixa para novas emissões, início dos juros no mês seguinte
e separação entre dívida herdada e dívida emitida durante a partida. A taxa fixa
é parâmetro do jogo; não é aplicada retroativamente à carteira herdada. Lacunas
nos dados históricos devem ser resolvidas ou explicitadas como hipóteses de
cenário, nunca preenchidas silenciosamente como se fossem observações.

#### SG060-B Financiamento e restrições — planejado

Depende de SG060-A. Implementar emissão automática apenas para cobrir insuficiência
de caixa após receitas, despesas e juros; manter superávit em caixa. Novas emissões
passam a gerar juros no mês seguinte à taxa fixa do cenário. Sem amortização,
vencimentos, rolagem, rating ou gestão de títulos nesta versão. Reconciliar cada
transação uma vez. A interface mostra benefício esperado, custo por turno,
necessidade de endividamento e compromisso adicional de juros. O custo crescente
alimenta a reação social de SG058-A, sem derrota fiscal automática. Aceite inclui
comparar estratégias de gasto, investimento, economia e tributação; dívida não
pode ser um recurso gratuito nem uma punição automática a qualquer investimento.

#### SG060-C Bancos e crédito agregados — backlog posterior à primeira versão

Não bloqueia SG061 nem o lançamento inicial. Após validar a jogabilidade de
SG060-A/B, separar Tesouro, bancos e autoridade monetária. Modelar condições de
crédito, inadimplência, risco e custo de novas emissões sem reprificar toda dívida
fixa instantaneamente. Conectar à atividade e arrecadação. Sem bancos individuais
ou rede interbancária nesta etapa. Critérios e extensões adiadas no plano detalhado.

### SG061 Confirmar turno inteiro

Depende de SG057-A/B, SG059, SG060-A/B e SG097–SG099. Entrega: coordenar escolhas,
implantação, três passos mensais, finanças, ocorrências, tramitação, votações e
eleições em estado provisório. Aceite: falha técnica preserva toda a partida,
inclusive prazos e estado dos sorteios; repetição não duplica votação, custo ou
evento. Vitória abre novo mandato sem reiniciar país, juros ou mandatos
senatoriais; derrota presidencial encerra o percurso. Extensões SG058-C/D e
SG060-C não são dependências deste marco.

#### FIX-V1-03 Completar o turno após mudanças institucionais — planejado

Origem: achado 3. Responsável pela integração: SG061. O contrato é definido em
SG057-B2, dentro do recorte FIX-V1-09, antes de implementar as transições; SG098
representa vigência, SG099 guarda o estado e SG059 valida autorização e conflitos.
Não transformar a conclusão de SG061 em pré-requisito desses contratos.

Entrega: estados institucionais válidos e transições de reforma/ruptura com
momento de vigência, nova autoridade, propostas pendentes, cadeiras reduzidas,
mandatos em curso e eleições agendadas. Definir continuidade e condição de
derrota quando não houver eleição presidencial. Prever compatibilidade do
catálogo de organizações, país e políticas, sem mudar rótulos como substituto
da mudança efetiva das regras.
Aceite: roteiros de extinção do Senado, redução de cadeiras e cancelamento de
eleição no fechamento eleitoral resultam em estado válido e explicável; nenhuma
votação usa órgão extinto e nenhuma eleição cancelada ocorre por ordem acidental.
Cada proposta pendente recebe tratamento definido. Apoios militar/judicial e
garantias constitucionais relevantes entram na mesma confirmação atômica; erro
preserva o estado inteiro. SG064 demonstra continuidade após uma transição;
SG071 apresenta o ciclo aplicável e SG081–SG082 preservam esses estados no save.

### SG062 Integrar lei e evento

Depende de SG061. Entrega: política, tramitação, votação, implantação, gasto,
consequência e evento; dilema quando presente. Aceite: roteiro distingue espera
pela votação, autorização, implantação e atraso dos resultados; cobre rejeição,
déficit, juros no mês seguinte e revogação sem apagar efeitos acumulados.
Resultados políticos e econômicos têm causas rastreáveis.

### SG063 Integrar demais decisões

Depende de SG062. Entrega: habilitar as demais decisões pelos arquivos e conferir
se o pequeno catálogo jogável permite atuar em despesas e receitas. O recorte
histórico SG049–SG056 concentra programas de despesa; para testar a estratégia de
tributação, adaptar a seleção mínima com uma decisão de receita em JSON, com
autorização, efeito financeiro e reação dos grupos explícitos, sem exigir
elasticidade tributária ou um sistema fiscal completo. Registrar essa adaptação
sem apagar a evidência do recorte anterior. Aceite: mesmo fluxo atende todas as
decisões; conteúdo compatível aparece sem alterar código e mantém origem dos efeitos.

### SG064 Validar partida sem interface final

Marco da fase. Aceite: iniciar com políticas herdadas; testar medida popular rejeitada e impopular aprovada, déficit válido, eleição sem dupla contagem e resultados separados. Vitória preserva país e implantação no mandato seguinte; derrota encerra. Executar por testes ou bancada, com efeitos sociais e evento rastreáveis.

## Fase 08 Interface da partida

Objetivo: apresentar o ciclo funcional usando dados e explicações existentes. Entrada: SG064.

### SG065 Desenhar fluxos essenciais

Entrega: início, painel do partido no governo, políticas, Senado, ocorrências, confirmação, resumo e eleições. Aceite: contemplar estimativa, resultado, erro, escolha pendente, novo mandato e encerramento, sem criar telas específicas por lei.

### SG066 Definir apresentação mínima

Depende de SG065. Entrega: tipografia, espaçamento e controles integrados ao mapa
aprovado. Aceite: contraste, foco e direção dos efeitos compreensíveis; painel
fiscal simples, sem transformar a navegação em gestão contábil detalhada.

### SG067 Construir início e painel

Depende de SG066. Entrega: partido, mandato, indicadores, finanças, perfis, Senado e turno a partir do estado do jogo. Aceite: nova partida carrega o país herdado sem misturar execução anterior; valores iguais aos da execução ativa.

### SG068 Mostrar escolhas do JSON

Depende de SG067. Entrega: controles comuns de políticas e dilemas com custos,
requisitos, reação popular, apoio previsto e prazo de tramitação. Mostrar o
benefício esperado, custo por turno, endividamento necessário e juros adicionais.
Aceite: conteúdo compatível dispensa tela específica; regras vêm da camada de jogo.
Afinidade, opinião, estimativa de votos e resultado confirmado são distintos;
estimativa não promete aprovação e não consome os sorteios da votação.

### SG069 Explicar o turno

Depende de SG068. Entrega: resultado das propostas, prazo e motivo de adiamento,
nível desejado e implantado, mudanças e efeitos sociais. Aceite: seguir decisão
até efeito e abrir contribuição matemática; distinguir estimativa, espera,
votação, implantação e atraso dos resultados. Separar juros herdados de novos
compromissos e explicar desgaste fiscal sem inventar certeza sobre o sorteio.

Complemento de 3 de outubro: manter um diário limitado, separado do histórico de
atrasos, com decisões, implantação, causas, finanças realizadas e erros com contexto.
O painel do laboratório é uma entrega preliminar; SG069 só termina com a partida
integrada e com previstos/realizados identificados. Salvamento em SG081–SG082.

### SG070 Escrever ajuda

Depende de SG069. Entrega: objetivo do partido, unidades, turnos, autorização, ocorrências e eleições. Aceite: primeira decisão possível com a ajuda; hipóteses e dados distinguíveis; explicar por que popularidade não garante aprovação e déficit não é erro técnico.

### SG071 Mostrar eleições e continuidade

Depende de SG069. Entrega: resultados separados para Presidência e Senado, explicação, continuar mandato ou iniciar nova partida. Aceite: vitória preserva país, propostas e efeitos; derrota não permite turno extra. Reinício confirmado descarta progresso e recarrega o cenário inicial, não zera suas políticas herdadas.

### SG072 Verificar percurso

Marco da fase. Aceite: iniciar, propor, consultar Senado e perfis, responder a dilema quando presente e atravessar eleições com teclado e no menor tamanho de tela suportado. Conferir continuidade após vitória e encerramento após derrota, sem bloqueio de foco ou conteúdo cortado.

## Fase 09 Revisão social e balanceamento

Objetivo: melhorar o recorte jogável, mantendo os efeitos sociais de SG001. Entrada: SG072.

### SG073 Revisar perfis existentes

Entrega: revisar os dois perfis de SG049–SG051 e decidir se um terceiro é necessário. Aceite: manter efeitos distintos, interesses combinados e peso eleitoral único por parcela, sem simular indivíduos. A fase aprofunda a representação, não decide se ela existe.

### SG074 Revisar sensibilidades sociais

Depende de SG073. Entrega: conferir relações e fontes ou hipóteses. Aceite: diferenças justificadas; perfis não são tratados como pessoas idênticas.

### SG075 Verificar agregação e eleição

Depende de SG074. Entrega: conferir impacto material, opinião sobre medidas, aprovação do governo, influência parlamentar e eleições separadas; comparar cenários simulados com mudanças de política e resultados em momentos diferentes. Aceite: interesse sobreposto não duplica votos; uma ação federal pode produzir reações estaduais diferentes por exposição dos grupos, com causas rastreáveis; benefício material não garante aprovação da medida, assim como popularidade não garante cadeiras ou aprovação de proposta. Mecanismos genéricos e parâmetros JSON, sem fórmulas duplicadas na tela. Identificar nesta revisão a tarefa futura de calibração com dados históricos e pesquisas de preferência, sem apresentar a simulação como previsão de eleições reais.

### SG076 Melhorar explicação social

Depende de SG075. Entrega: revisar textos e apresentação dos efeitos. Aceite: identificar benefício, custo e conflito de interesses sem rótulos de grupo bom ou ruim.

### SG077 Medir sensibilidade

Depende de SG076. Entrega: variar dois parâmetros nos intervalos documentados. Aceite: registrar mudança de sinal, extremos e dependência de hipóteses frágeis.

### SG078 Revisar escolhas dominantes

Depende de SG077. Entrega: comparar estratégias de gastar, investir, economizar
e tributar sob condições iniciais e sementes controladas. Variar sementes em
várias execuções para separar sorte de efeito da estratégia. Ajustar conteúdo
se uma opção superar outras sem contrapartida. Aceite: endividamento permite
benefício presente, mas o peso dos juros tem consequência política compreensível;
comparar também caminhos sem nova dívida e benefícios que compensam o custo.
Justificar ajustes de taxas, probabilidades e desgaste com testes de jogabilidade,
sem decretar vencedor obrigatório nem calibrar apenas para um resultado eleitoral.

### SG079 Revisar textos e recursos

Depende de SG076 e SG078. Entrega: linguagem, fontes e licenças. Aceite: autoria e procedência identificadas, sem texto copiado das referências de inspiração.

### SG080 Revisar equilíbrio

Marco da fase. Aceite: duas estratégias têm consequências compreensíveis; ajuste de parâmetro não esconde erro matemático nem quebra contrato de conteúdo.

## Fase 10 Salvamento e qualidade

Objetivo: preparar a partida para uso fora do desenvolvimento. Entrada: SG080.

### SG081 Definir arquivo de partida

Entrega: integrar snapshot de SG038 a partido, governo, Senado com UF e vencimento
das cadeiras, população, propostas com prazo e adiamento, níveis desejados e
implantados, caixa, dívida herdada/nova, juros, calendário, turno e ocorrências.
Incluir versão, semente e estado do gerador aleatório. Aceite: arquivo local
identifica conteúdo exato e preserva tudo necessário para continuar, inclusive
próxima renovação e próximos sorteios; incompatibilidade tem tratamento explícito.

O aceite inclui os estados introduzidos por FIX-V1-01/03/05/07/08: efeitos
políticos ativos ou já consumidos, instituições e garantias vigentes, apoios
necessários à ruptura, calendário alterado, candidaturas/alianças e sorteios
eleitorais ou parlamentares. Em SG082, comparar execução contínua e restaurada
também depois de uma mudança institucional; restaurar não recria uma instituição
extinta nem reaplica uma recompensa política já consumida.

### SG082 Salvar e recuperar

Depende de SG081. Entrega: exportar e importar pela interface. Aceite: recuperar
implantação, efeitos atrasados, tramitação, mandatos senatoriais e juros futuros
sem duplicar votação, custos ou ocorrências. Execução contínua e restaurada com
as mesmas escolhas preservam sorteios e resultados; arquivo inválido mantém a
partida atual e alterações no conteúdo são detectadas.

### SG083 Automatizar percurso essencial

Depende de SG082. Entrega: teste de interface com início herdado, proposta, ocorrência, save, recuperação e eleições. Aceite: comparar execução contínua e retomada antes e depois da eleição; detectar cobrança, votação ou evento duplicados e turno perdido. Validar todos os pacotes distribuídos na integração.

### SG084 Verificar acessibilidade

Depende de SG083. Entrega: teclado, foco, nomes acessíveis, contraste e movimento reduzido. Aceite: corrigir falhas e verificar manualmente além das verificações automáticas.

### SG085 Medir desempenho e memória

Depende de SG083. Entrega: medir carga e avanço com cenário e máquina registrados. Aceite: orçamento de resposta baseado em medição, memória de cálculo limitada e retenção definida para histórico de apresentação. Worker só se necessário.

### SG086 Observar sessão de uso

Depende de SG084 e SG085. Entrega: roteiro de 20 minutos com ao menos uma pessoa. Aceite: registrar dificuldades; gravação com consentimento e falta de participante como bloqueio.

### SG087 Corrigir principal bloqueio

Depende de SG086. Entrega: corrigir problema crítico e repetir tarefa. Aceite: tarefa funciona; se não houver bloqueio, registrar resultado. Demais defeitos recebem chamados próprios.

### SG088 Aprovar candidata

Marco da fase. Aceite: percurso completo, pacotes válidos e saves compatíveis; nenhum bloqueio crítico ou perda de partida conhecido. Pendências menores têm prioridade e responsável.

## Fase 11 Publicação e continuidade

Objetivo: distribuir versão verificada e escolher melhorias pelo uso. Entrada: SG088.

### SG089 Escolher distribuição

Entrega: destino da versão web estática e condições atuais. Aceite: custos, privacidade e responsável registrados; não assumir contratação paga.

### SG090 Preparar pacote

Depende de SG089. Entrega: versão do jogo e conteúdo com notas de mudança. Aceite: inicia fora do desenvolvimento e inclui todos os JSON referenciados.

### SG091 Ensaiar publicação

Depende de SG090. Entrega: testar em ambiente de teste. Aceite: recursos, JSON, save e recuperação funcionam no destino; publicação pública permanece separada.

### SG092 Ensaiar retorno de versão

Depende de SG091. Entrega: recuperar pacote anterior e tratar saves incompatíveis. Aceite: procedimento reproduzível sem prometer conversão automática de saves novos.

### SG093 Preparar orientações

Depende de SG090. Entrega: jogar, salvar, consultar limites e relatar problemas. Aceite: instruções correspondem à candidata e incluem canal existente.

### SG094 Autorizar e publicar

Depende de SG088, SG091, SG092 e SG093. Entrega: registrar aprovação da versão concreta e publicar. Aceite: conferir endereço ou pacote com nova partida e versão correta.

### SG095 Organizar feedback

Depende de SG094. Entrega: triagem de relatos. Aceite: versão do jogo e conteúdo, passos, esperado e ocorrido; incluir save quando disponível e pertinente.

### SG096 Planejar próximo ciclo

Marco da fase. Aceite: revisar feedback, horas reais e pendências; escolher até cinco melhorias com objetivo e orçamento. Expandir mecanismos ou conteúdo conforme necessidade concreta.

## Histórico das revisões

Em 7 de outubro de 2026, a revisão com o usuário confirmou prioridade à
jogabilidade: Senado com renovação alternada duas/uma vaga por UF, Presidência
em turno único, votação parlamentar com acaso controlado e tramitação de um
turno com no máximo um adiamento. A economia inicial inclui financiamento
automático, juros herdados separados dos juros simples da dívida nova e desgaste
político gradual pelo peso dos juros. Inflação, rating, crise fiscal, bancos e
gestão de títulos ficam para depois. Foram alinhados escopo, dependências,
salvamento e critérios de comparação entre estratégias. SG098 voltou à revisão
de contrato; sua entrega inicial e verificação de 6 de outubro foram preservadas.
Esta revisão é documental; não altera o código nem conclui mecânicas pendentes.

Em 8 de outubro de 2026, o usuário confirmou para a V1 que emendas constitucionais
exigem 60% de apoio em cada uma de duas votações gerais simplificadas do Congresso,
sem apuração separada por Casa. As duas votações acontecem no mesmo fechamento
trimestral; falhar em qualquer uma rejeita a emenda.
Também confirmou que, se uma votação de proposta coincidir com a renovação do
Senado, vota primeiro a composição que encerra o mandato; a renovação acontece
em seguida e a nova composição vale a partir do próximo turno.
Empate eleitoral é resolvido com um d20 por partido empatado; o maior resultado
vence e empate no dado é rolado novamente. Votação parlamentar empatada não atinge
a maioria necessária e não aprova a proposta.

Em 6 de outubro de 2026, o plano de produção foi reorganizado pela modelagem do
domínio. Cenário, partida, política definida, proposta, política vigente,
simulação, aplicação e interface passaram a ter responsabilidades explícitas.
SG097–SG099 foram acrescentados para criar a base da partida sem renumerar os
chamados anteriores. SG061 depende dessa fundação; os contratos de tempo,
finanças e regras políticas podem avançar em paralelo quando independentes.

Em 27 de setembro de 2026, o plano passou a exigir que leis e eventos chegassem à execução por arquivos, com contratos, carregamento comum e aceites verificáveis em SG024, SG032, SG040, SG048 e SG063.

As decisões mínimas sobre efeitos sociais e eleição foram antecipadas para atender à primeira versão já definida. A Fase 09 passa a revisar e balancear esses elementos. SG022 agora cobre carregamento de arquivos; edição estrutural e cascata ficam adiadas. Os IDs continuam estáveis, mas fichas futuras devem ser conferidas contra eventuais issues abertas antes de execução.

Em 1 de outubro de 2026, a revisão incorporou o jogador como partido, Senado eleito, influência da opinião pública, país herdado e continuidade entre mandatos. Cada medida passa a ser uma política tipada em JSON; lei é um tipo, não um contêiner de políticas. Aprovação, implantação e efeitos têm estados separados. Déficit é consequência válida; save preserva também o estado político. Os aceites de SG057–SG075 e SG081–SG083 verificam essas decisões.

O plano mantém SG001–SG096, acrescenta SG097–SG099 e preserva a Fase 00 concluída.
O escopo eleitoral está decidido; fórmulas, empates e regras operacionais ainda
recebem contrato em SG057-B2. As fichas resumidas são divididas ao iniciar, sem
prometer quatro horas para um sistema inteiro. Não há compromisso de implementar
todos os mecanismos possíveis nem criar editor de conteúdo.

Referências: `docs/producao/primeira-versao.md`, `docs/motor-do-jogo.md`, `src/engine/semantica-do-passo.md` e o estudo de Democracy 4 em `docs`. A proposta do motor continua como referência matemática; este plano revisado prevalece para organização do conteúdo, ciclo de jogo e ordem das entregas.
