# Plano de produção do SisGov

3 de outubro de 2026 • Revisão de turnos, finanças, capacidade e próximos passos

**IA que auxiliou nesta revisão do planejamento: Gitinho.**

Construir um jogo em que o jogador representa um partido e conduz o governo enquanto ocupa a Presidência. Políticas, eventos e consequências são definidos em JSON. O software carrega e valida esses arquivos, monta o grafo e executa os mecanismos declarados. Adicionar conteúdo que usa mecanismos existentes deve exigir apenas novos dados.

A Fase 00 está concluída, com registro em `docs/qualidade/verificacao-base-producao.md`. Os 96 IDs são mantidos para preservar o acompanhamento. As fichas futuras foram simplificadas e devem ser detalhadas quando forem iniciadas. As capacidades descritas ainda precisam ser implementadas.

## Progresso e próxima fase — revisão de 3 de outubro de 2026

As Fases 01–06 possuem contratos, implementações e verificações registrados abaixo:
carregamento, execução numérica, atrasos, ocorrências, restauração, bancada e
primeiro recorte em JSON. A partida integrada da Fase 07 ainda não está concluída.
O laboratório de mais de cem políticas é demonstrativo e não substitui o cenário
calibrado. O resumo antigo que apontava SG025 como próxima tarefa estava desatualizado.

**Próxima etapa:** SG057-A está especificado no plano; falta implementá-lo depois
do contrato fiscal. SG060-A está em especificação: fechar unidades, período-base
histórico e identidades contábeis antes de SG060-B (financiamento) e SG058-C/D
(capacidade e limites de políticas). Novas variáveis entram em ondas pequenas;
bancos e crédito ficam explícitos em SG060-C.

O [plano detalhado da próxima fase](producao/sg057-proxima-fase-e-economia.md) define
ordem, variáveis, identidades contábeis, limites legais/financeiros/operacionais,
retornos decrescentes, fiscalização e critérios de teste. É especificação de trabalho,
não declaração de que essas mecânicas já estejam prontas.

**SG043-R — Correção do laboratório e diário:** o avanço inicial foi reproduzido
com erro de domínio em Saúde; os parâmetros demonstrativos foram corrigidos sem
retirar a validação. O diário mostra decisões, avanços, causas e falhas; retenção
limitada à sessão. Isso não encerra SG061 nem substitui o diário integrado de SG069.

## Direção visual aprovada em 3 de outubro de 2026

A tela principal segue o [motor espacial](producao/motor-espacial.md): presidente e ministros são os centros de maior massa; leis orbitam seus representantes, e indicadores e situações se organizam em torno das leis relacionadas. A esfera federal envolve os resultados nacionais. Relações podem atravessar ministérios. A experiência é centrada no mapa, com interface mínima. Rosto do ministro e cor da esfera pela aprovação popular do ministro são evoluções futuras aprovadas, ainda sem implementação dessa aprovação.

## Regra central do projeto

Cada política terá seu próprio arquivo JSON, com tipo, requisitos, custos e referências às consequências. Lei, imposto e programa são tipos de política: aprovar uma lei e ajustar o investimento de um programa não precisam ser apresentados como a mesma ação. Cada evento, dilema, situação e definição de consequência também terá seu arquivo JSON. O cenário reúne os arquivos e define o estado inicial da partida.

O JSON descreve regras e parâmetros. O código implementa um conjunto pequeno de mecanismos, como contribuição numérica, condição, atraso e duração. Uma nova lei que usa esses mecanismos exige apenas dados; uma operação matemática nova exige código, validação e testes próprios. Fórmulas não executam JavaScript nem usam `eval`.

O tipo da política orienta seus controles e o processo de autorização declarado nos dados. Uma consequência define um efeito direto; os efeitos indiretos surgem da propagação pelo grafo. Não registrar novamente cada efeito indireto como consequência direta, pois isso contaria o mesmo impacto duas vezes.

## Partido população e Senado

Partido do jogador, governo em exercício e composição do Senado são estados separados. A população elege a Presidência e o Senado, com resultados separados. Representá-la por poucos perfis agregados com interesses combinados: uma parcela pode reunir trabalhadores, idosos e motoristas. Cada parcela entra uma única vez na apuração; somar grupos sobrepostos não pode multiplicar votos.

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

Antes da confirmação, mostrar estimativas separadas de reação popular, apoio parlamentar e impacto financeiro. Nas propostas sujeitas ao Senado, a decisão final vem das regras de votação. Quantidade de partidos e cadeiras, distribuição de vagas, maioria, calendário e regras eleitorais detalhadas permanecem pendentes em SG057; não inventar esses números ao implementar o restante.

Vencer a eleição presidencial inicia outro mandato com o mesmo país. Perder encerra a partida na primeira versão. Os cinco turnos anteriores à eleição oferecem ações de campanha ao partido, como comunicar políticas, participar de rádio, espalhar desinformação ou mobilizar militância; custos, efeitos, riscos e limites dessas ações ainda serão definidos em SG057-B. Gabinete individual, negociação de coalizões, disputas internas, candidatos individuais e atuação na oposição ficam adiados.

## Aprovação implantação e país herdado

Separar proposta, resultado da autorização, nível desejado e nível implantado da política. A rejeição não inicia implantação. Depois da aprovação, a implantação pode avançar gradualmente; suas consequências ainda podem ter atraso, duração e dissipação próprios. Tempo de implantar um programa não é o mesmo que tempo de esperar seus resultados. Revogação segue a regra declarada e não apaga automaticamente consequências acumuladas.

O Brasil começa com políticas vigentes, níveis já implantados ou em implantação, finanças, população, composição política e efeitos herdados. Nova partida carrega esse estado; novo mandato preserva o estado alcançado, incluindo dívida, crises e implantação em andamento.

Dinheiro público, apoio parlamentar e opinião pública não são um único recurso. Receitas, despesas, saldo, dívida e juros têm papéis próprios. Déficit é resultado válido e segue o financiamento definido no cenário, como dívida; não é erro do motor. Dados ausentes, referências inválidas e resultados não finitos continuam sendo falhas técnicas.

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

`cenario.json` é o manifesto: lista arquivos, versões, valores iniciais, duração do passo, regras da partida, perfis sociais e estado político herdado. Os perfis podem ficar nesse arquivo enquanto forem poucos. Pastas sem conteúdo não são obrigatórias. O carregamento inicial usa arquivos distribuídos com o jogo. Acrescentar conteúdo pode exigir novo build, mas não editar código de regras, registros manuais de importação ou telas específicas.

## Contratos necessários

- **Identidade:** cada definição tem ID estável, tipo e versão de esquema. Referências usam IDs; nomes e caminhos podem mudar sem mudar a identidade. IDs duplicados são erro.
- **Política:** tipo, nome, descrição, requisitos, conflitos, afinidades políticas, processo de autorização, custos, controle, domínio, implantação, vigência, revogação e consequências. Começar com liga/desliga ou intensidade numérica; uma lei não contém um catálogo paralelo de políticas.
- **Consequência:** ID, dependências, alvo, mecanismo, parâmetros, unidade, atraso, duração, dissipação e modo de aplicação. Distinguir efeito contínuo de ocorrência única. Cada uso recebe identidade própria, ligada à política, evento, dilema ou situação que o ativou.
- **Situação evento e dilema:** situação persiste enquanto suas condições sustentam o estado, como uma crise; evento é uma ocorrência automática; dilema exige uma escolha entre opções. Podem compartilhar condições e consequências, mas não o mesmo ciclo de vida. Gatilhos são determinísticos, com ocorrência única ou intervalo mínimo para repetição; sorteio fica adiado.
- **Cenário:** manifesto, variáveis, país herdado e regras de turno, autorização, finanças e eleições. O primeiro recorte terá 6–10 variáveis de domínio, três decisões, ao menos um evento e dois perfis com interesses combinados e efeitos distintos. Dilemas e situações têm exemplos artificiais de teste, sem obrigar a ampliar o cenário mínimo. Estados de controle da partida não são indicadores adicionais.
- **Procedência:** efeitos de domínio registram fonte ou hipótese de design e limitações. Coeficientes artificiais dos testes são identificados como artificiais.
- **Estado:** snapshot do motor guarda valores, passo, histórico e memórias dos efeitos; o salvamento da partida agrega partido, governo, Senado, população, propostas, políticas vigentes, níveis desejados e implantados, finanças, mandato, turno, situações, eventos e dilemas pendentes. Esses dados pertencem à partida, separados das definições JSON.

O grafo contém dependências numéricas; textos, escolhas e elegibilidade ficam no catálogo. Todos os nós e relações possíveis do cenário são montados antes de iniciar. Aprovação, implantação e ocorrências alteram comandos e ativação das contribuições, sem editar a estrutura do grafo durante a partida. Uma contribuição inativa vale zero, inclusive quando sua fórmula contém constante. Revogar encerra contribuições futuras conforme a regra declarada; não desfaz automaticamente valores já acumulados.

Começar com uma instância ativa por uso de consequência. Uma reativação enquanto ela estiver ativa é recusada com motivo; acúmulo e renovação automática ficam adiados. Usos distintos podem contribuir para o mesmo alvo e são somados com origem separada. Processar eventos em ordem estável de ID e avaliar seus gatilhos sobre o mesmo retrato.

Definir uma única ordem de turno: validar propostas e escolhas sobre o estado confirmado, resolver autorizações, preparar implantação e finanças, executar passos técnicos, avaliar ocorrências e eleições e confirmar tudo junto. Ocorrências descobertas ao final são aplicadas ou apresentadas na etapa seguinte prevista, sem cadeia infinita no mesmo turno. Falhas técnicas preservam toda a partida; rejeição parlamentar é resultado válido. O motor calcula e explica; somente a camada de jogo decide continuidade, vitória, derrota ou encerramento. Calendário, resolução de dilemas e precedência das eleições sobre pendências serão fixados em SG057.

## Como manter o projeto simples

1. Provar o fluxo completo cedo. Até SG032, uma lei artificial em JSON deve alterar uma entrada e produzir uma consequência explicável por teste, com autorização simulada apenas na bancada. Senado e orçamento entram na Fase 07; o jogo não oferece esse atalho. Até SG040, incluir eventos e retomada da execução.
2. Usar o mesmo carregamento na aplicação e nos testes. Rejeitar arquivo inválido com arquivo, ID, campo e motivo. Nenhuma parte de um pacote inválido entra na execução.
3. Começar com Map, soma e transformação afim, sem restringir o jogo a somas. Produto de entradas, respostas limitadas, condições e resposta gradual entram quando um exemplo do cenário exigir, com contrato e teste. Receita como alíquota × base tributável precisa de produto, não de uma soma disfarçada. Não criar linguagem de fórmulas arbitrárias.
4. Carregar o cenário uma vez. Manter definição imutável e estado separado. Mudanças nos arquivos exigem nova execução; recarga durante a partida fica adiada.
5. Ter uma fonte para cada regra. A camada de jogo calcula disponibilidade, opinião, apoio, autorização e finanças; a interface apresenta resultados e envia escolhas, sem recalcular regras. O motor não conhece nomes de partidos ou leis.
6. Salvar a identidade exata do conteúdo. Usar versões de esquema e executor e identificação do pacote por conteúdo, além da versão declarada. Save incompatível é recusado com explicação; migração automática fica adiada.
7. Testar comportamento e explicar resultados. Registrar qual política, ocorrência e consequência originou cada contribuição. Cobrir arquivo inválido, rejeição, implantação, revogação, duplicidade, déficit, eleições, falha no turno e retomada.
8. Começar com tabela e controles comuns. Diagrama, editor, plugins, servidor, banco de dados, contas e nuvem ficam para uma necessidade concreta.

O critério central de arquitetura é verificável: cadastrar outra lei, evento ou consequência com mecanismos disponíveis, alterar apenas JSON e executar pelo mesmo fluxo. Se isso exigir uma condição pelo nome da lei no código ou uma tela exclusiva, revisar a separação de responsabilidades.

## Como acompanhar

O Markdown é o texto mestre; o Word é uma cópia de leitura atualizada a partir dele. O estado operacional fica no GitHub Project escolhido em SG002. Criar issues ao assumir o trabalho, conforme `docs/producao/quadro-de-chamados.md`.

Manter um chamado de implementação em andamento por pessoa. Estados: Planejado, Pronto, Em andamento, Em revisão, Bloqueado e Concluído. Registrar na issue branch, decisões, evidência do aceite e próximo passo. Seguir `docs/producao/fluxo-de-branches-e-revisao.md`.

Cada ficha define entrega e aceite. O marco de uma fase depende das sete fichas anteriores daquela fase; a próxima fase começa depois dele. Dependências adicionais aparecem nas fichas. Estimar ao iniciar e dividir tarefas maiores que quatro horas em SGxxx-A e SGxxx-B. Não presumir que toda ficha cabe em quatro horas.

A estimativa anterior de 167–334 horas não cobre os contratos e o ciclo político agora explicitados. Reestimar a Fase 01 e depois cada fase com base nas entregas reais. SG009 já tem decisão em `src/engine/semantica-do-passo.md`; conferir a evidência existente antes de repetir trabalho. Fichas dependentes de regras ainda abertas só ficam Prontas após a decisão correspondente.

Uma entrega termina quando seu aceite é demonstrado, as verificações pertinentes passam e a documentação acompanha a mudança. Defeitos recebem BUG001 em diante. Falta de fonte ou participante indica bloqueio e próximo passo. Publicação externa depende de decisão sobre a versão concreta.

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

## Fase 07 Partida completa

Objetivo: integrar partido, Senado, opinião, implantação, finanças e eleições, sem código específico por política. Entrada: SG056.

### SG057 Definir turno votação e eleições

Entrega: registrar regras ainda abertas de partidos, cadeiras, distribuição, maioria, influência popular, votação, calendário e apuração separada para Presidência e Senado. Definir duração, passos por turno, empates e precedência de pendências. Aceite: exemplos manuais não duplicam votos, distinguem afinidade de apoio e mostram vitória com novo mandato ou derrota com encerramento. Regras simplificadas e parâmetros ficam no cenário; mecanismos novos recebem testes. Dividir em SG057-A para ciclo temporal e SG057-B para regras políticas; SG057-B1 estuda modelos eleitorais antes de SG057-B2 definir o contrato do SisGov. SG058 aguarda essas decisões.

#### SG057-A Contrato temporal — próxima tarefa

Decisões confirmadas em 3 de outubro de 2026: cada turno político dura três meses
e executa três passos técnicos mensais. Converter as taxas atuais de implantação e
degradação, definidas por turno, em frações mensais equivalentes, sem acelerar o
avanço total no trimestre. A interface mostra somente o número do turno; meses
decorridos desde o estado inicial permanecem como contador interno. Decisões
tomadas no encerramento valem a partir do trimestre seguinte. Eventos e situações
são avaliados mensalmente; o diário mantém a sequência mensal e resume o turno.
Receitas e despesas recorrentes são apuradas mensalmente e somadas no resumo
trimestral; fórmulas e conversões ficam no SG060-A. Os três meses são confirmados
como um único turno, sem estado parcial em caso de falha. No calendário padrão
de quatro anos, cada mandato tem 16 turnos trimestrais. Os cinco turnos antes da
eleição oferecem ações de campanha; no turno 16, o tempo, as políticas e as
contas avançam normalmente, e então o jogo apresenta o resultado. A data deriva
da lei ou política vigente que define a duração do mandato, inclusive decretos
parlamentares que a alterem. Após vitória, começa o dia 1 do mandato seguinte,
preservando o país. O ciclo é contado a partir desse novo mandato. Ainda definir
como uma alteração legal do calendário afeta uma eleição já agendada. Ver
`docs/producao/sg057-proxima-fase-e-economia.md`.

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
e não recebe decisões ordinárias de governo.

##### SG057-B1 Estudar modelos de simulação eleitoral — pesquisa inicial

Comparar os efeitos sobre grupos documentados para *Democracy 4*, o modelo de
dois turnos aplicado à eleição brasileira de 2010, a simulação probabilística
de populações distribuídas por território e o TriplePC, que combina impactos
materiais e preferências declaradas sobre políticas. Estudar o
[BRASMOD](https://labpub.fea.usp.br/brasmod/) como referência brasileira para
simular a distribuição dos efeitos de impostos e benefícios, e o estudo
[*Isentar os pobres, moderar com os ricos*](https://www.scielo.br/j/rsocp/a/47YbrsfLMZTBY9jJXtKYfmr/?format=html&lang=pt)
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

##### SG057-B2 Definir o contrato eleitoral do SisGov — planejado

Depende de SG057-B1. Definir quais dados do grafo e do cenário alimentam o
eleitorado, como ações federais alcançam grupos em cada estado, e como estimar
separadamente o efeito sobre o bem-estar do grupo e a aprovação da medida, sem
exigir uma microssimulação de domicílios na primeira versão. Definir o que o motor
devolve e como explica suas causas. Definir separadamente regras brasileiras de
eleição, apuração e ligação com o Senado; o modelo territorial estudado não as
fornece. Aceite: exemplos manuais distinguem reação direta da reação aos
resultados, contam cada pessoa uma vez e preservam resultados separados para
Presidência e Senado. Decisão inicial: carregar do cenário a composição
partidária do Senado e mantê-la fixa após a eleição. Para a Presidência, somar
por partido a intenção de voto dos grupos ponderados e declarar vencedor quem
obtiver o maior total nacional; segundo turno fica para uma etapa posterior.

### SG058 Completar contrato das ações

Depende de SG057. Entrega: aplicar SG015 às políticas reais com disponibilidade, estimativas de opinião e apoio, autorização, nível desejado, implantação, custo e revogação. Aceite: JSON usa comandos genéricos; proposta popular pode ser rejeitada e impopular aprovada com reação pública; rejeição não inicia implantação. SG058-A/B implementam a parte política definida em SG057-B2; dividir as demais ações conforme estimativa de esforço.

#### SG058-A Implementar a reação dos grupos — planejado

Depende de SG057-B2. Calcular o impacto material e a reação à medida e aos seus
resultados com os dados e mecanismos aprovados no contrato, mantendo procedência
e peso eleitoral único por pessoa modelada. Aceite: uma política afeta grupos em
momentos distintos, com causas explicáveis; benefício material e aprovação podem
divergir sem contribuição duplicada.

#### SG058-B Integrar apuração e resposta institucional — planejado

Depende de SG058-A e SG057-B2. Integrar os resultados do eleitorado às eleições
e a reação popular às decisões do Senado, conforme as regras brasileiras e o
contrato de autorização definidos em SG057-B2. Aceite: apurações para Presidência
e Senado são separadas; afinidade, estimativa, voto parlamentar e resultado
eleitoral não se confundem.

#### SG058-C Limites e capacidade — planejado

Separar limites legais, financeiros, operacionais e de resultado. Implementar uma
política de Saúde com demanda, capacidade, retorno decrescente e expansão com atraso.
Mecanismos novos exigem contrato e testes antes de entrar no JSON. Dinheiro não
recebe teto universal de 100; controle e domínio dependem do significado da política.

#### SG058-D Governança e eficiência — planejado

Distinguir desvio, superfaturamento e desperdício; considerar fiscalização e
capacidade administrativa. Gasto elevado não implica corrupção automática. Cobrir
contabilidade sem dupla perda e comparar gestão forte/fraca com mesmo orçamento.

### SG059 Validar escolhas e conflitos

Depende de SG058. Entrega: requisitos de políticas e opções de dilemas no mesmo fluxo. Aceite: impedimentos têm motivo; escolhas incompatíveis e escritas conflitantes não chegam ao executor. Baixa popularidade não vira bloqueio automático; rejeição parlamentar difere de comando inválido.

### SG060 Contabilizar finanças públicas

Depende de SG058. Entrega: receitas, despesas, saldo, dívida e juros conforme regra de financiamento do cenário, com custos únicos e recorrentes. Aceite: déficit permite continuar; erro técnico não cobra e repetição não duplica cobrança. Custos seguem implantação e vigência declaradas, com uma fonte contábil, sem novo débito do mesmo custo pelo grafo. Apoio parlamentar não é moeda do orçamento.

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
juros, emissão e amortização antes da implementação fiscal. Ver
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

**Passo manual concluído:** exemplo anual de 2025 e turno junho–agosto/2026
agregado da mesma vintagem RTN, com resultados “acima” e “abaixo da linha”
separados; a fonte não oferece saldos de caixa compatíveis para inferir
financiamento. **Decisão registrada:** resultado primário acima da linha lidera
o resumo; resultado abaixo da linha e resultado nominal aparecem como
reconciliação no diário, sem misturar conceitos. Os critérios de clareza agora
estão registrados no plano detalhado: período/unidade/fonte explícitos; déficit
não confundido com caixa; histórico não apresentado como previsão; caixa e
financiamento marcados como não modelados. **Verificação documental mínima
concluída:** soma de receita, despesa e resultado primário do turno fecha; as
reconciliações permanecem separadas; caixa e emissão não são inferidos. Próximo
marco possível: tarefa separada para implementar apenas o relatório informativo
do resultado primário, sem dívida, caixa ou taxas endógenas. Isso ainda não
iniciou; as demais regras e variáveis ficam em backlog.

#### SG060-B Financiamento e restrições — planejado

Implementar déficit financiado, superávit em caixa/amortização, vencimentos e rolagem.
Distinguir escassez econômica de falha técnica. Decisões mostram compromisso,
financiamento e capacidade de execução. Reconciliar toda transação uma única vez.

#### SG060-C Bancos e crédito agregados — planejado

Após SG060-A/B, separar Tesouro, bancos e autoridade monetária. Modelar condições de
crédito, inadimplência, risco e custo de novas emissões sem reprificar toda dívida
fixa instantaneamente. Conectar à atividade e arrecadação. Sem bancos individuais
ou rede interbancária nesta etapa. Critérios e extensões adiadas no plano detalhado.

### SG061 Confirmar turno inteiro

Depende de SG059 e SG060. Entrega: preparar autorizações, implantação, finanças, passos, ocorrências e eleições em estado provisório. Aceite: falha técnica preserva toda a partida; repetição não duplica votação, custo ou evento. Vitória abre novo mandato sem reiniciar o país; somente derrota encerra o percurso eleitoral e impede outro turno.

### SG062 Integrar lei e evento

Depende de SG061. Entrega: política, votação, implantação, gasto, consequência e evento; dilema quando presente. Aceite: roteiro distingue aprovação, implantação gradual e resultado atrasado; cobre recusa, déficit e revogação sem apagar efeitos acumulados. Resultados políticos e econômicos têm causas rastreáveis.

### SG063 Integrar demais decisões

Depende de SG062. Entrega: habilitar as outras duas decisões pelos arquivos. Aceite: mesmo fluxo atende todas; decisão compatível aparece sem alterar código e mantém origem dos efeitos.

### SG064 Validar partida sem interface final

Marco da fase. Aceite: iniciar com políticas herdadas; testar medida popular rejeitada e impopular aprovada, déficit válido, eleição sem dupla contagem e resultados separados. Vitória preserva país e implantação no mandato seguinte; derrota encerra. Executar por testes ou bancada, com efeitos sociais e evento rastreáveis.

## Fase 08 Interface da partida

Objetivo: apresentar o ciclo funcional usando dados e explicações existentes. Entrada: SG064.

### SG065 Desenhar fluxos essenciais

Entrega: início, painel do partido no governo, políticas, Senado, ocorrências, confirmação, resumo e eleições. Aceite: contemplar estimativa, resultado, erro, escolha pendente, novo mandato e encerramento, sem criar telas específicas por lei.

### SG066 Definir apresentação mínima

Depende de SG065. Entrega: tipografia, espaçamento e controles. Aceite: contraste, foco e direção dos efeitos compreensíveis; painel simples e mapa somente se ajudar.

### SG067 Construir início e painel

Depende de SG066. Entrega: partido, mandato, indicadores, finanças, perfis, Senado e turno a partir do estado do jogo. Aceite: nova partida carrega o país herdado sem misturar execução anterior; valores iguais aos da execução ativa.

### SG068 Mostrar escolhas do JSON

Depende de SG067. Entrega: controles comuns de políticas e dilemas com custos, requisitos, reação popular e apoio previsto. Aceite: conteúdo compatível dispensa tela específica; regras vêm da camada de jogo. Afinidade, opinião, estimativa de votos e resultado confirmado são identificados separadamente.

### SG069 Explicar o turno

Depende de SG068. Entrega: resultado das propostas, nível desejado e implantado, mudanças e efeitos sociais. Aceite: seguir decisão até efeito e abrir contribuição matemática; distinguir previsão, aprovação, implantação e atraso dos resultados, com unidades e limites visíveis nos gráficos.

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

Depende de SG077. Entrega: comparar estratégias e ajustar conteúdo se uma opção superar outras sem contrapartida. Aceite: justificar com comparação reproduzível; se não houver dominância, registrar estratégias verificadas.

### SG079 Revisar textos e recursos

Depende de SG076 e SG078. Entrega: linguagem, fontes e licenças. Aceite: autoria e procedência identificadas, sem texto copiado das referências de inspiração.

### SG080 Revisar equilíbrio

Marco da fase. Aceite: duas estratégias têm consequências compreensíveis; ajuste de parâmetro não esconde erro matemático nem quebra contrato de conteúdo.

## Fase 10 Salvamento e qualidade

Objetivo: preparar a partida para uso fora do desenvolvimento. Entrada: SG080.

### SG081 Definir arquivo de partida

Entrega: integrar snapshot de SG038 a partido, governo, composição do Senado, população, propostas, níveis desejados e implantados, finanças, mandato, turno e ocorrências. Aceite: arquivo local identifica conteúdo exato e preserva tudo necessário para continuar; incompatibilidade tem tratamento explícito.

### SG082 Salvar e recuperar

Depende de SG081. Entrega: exportar e importar pela interface. Aceite: recuperar implantação, efeitos atrasados, composição política e próximo mandato sem duplicar votação, custos ou ocorrências; arquivo inválido mantém partida atual e alterações no conteúdo são detectadas.

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

Em 27 de setembro de 2026, o plano passou a exigir que leis e eventos chegassem à execução por arquivos, com contratos, carregamento comum e aceites verificáveis em SG024, SG032, SG040, SG048 e SG063.

As decisões mínimas sobre efeitos sociais e eleição foram antecipadas para atender à primeira versão já definida. A Fase 09 passa a revisar e balancear esses elementos. SG022 agora cobre carregamento de arquivos; edição estrutural e cascata ficam adiadas. Os IDs continuam estáveis, mas fichas futuras devem ser conferidas contra eventuais issues abertas antes de execução.

Em 1 de outubro de 2026, a revisão incorporou o jogador como partido, Senado eleito, influência da opinião pública, país herdado e continuidade entre mandatos. Cada medida passa a ser uma política tipada em JSON; lei é um tipo, não um contêiner de políticas. Aprovação, implantação e efeitos têm estados separados. Déficit é consequência válida; save preserva também o estado político. Os aceites de SG057–SG075 e SG081–SG083 verificam essas decisões.

O plano mantém os 96 IDs, a Fase 00 concluída e as decisões senatoriais detalhadas pendentes. As fichas resumidas são divididas ao iniciar, sem prometer quatro horas para um sistema inteiro. Não há compromisso de implementar todos os mecanismos possíveis nem criar editor de conteúdo.

Referências: `docs/producao/primeira-versao.md`, `docs/motor-do-jogo.md`, `src/engine/semantica-do-passo.md` e o estudo de Democracy 4 em `docs`. A proposta do motor continua como referência matemática; este plano revisado prevalece para organização do conteúdo, ciclo de jogo e ordem das entregas.
