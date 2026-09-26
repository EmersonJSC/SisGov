# Plano de produção do SisGov

96 chamados em 12 fases para uma equipe de uma pessoa

26 de setembro de 2026 • Versão inicial de planejamento

## Como usar este plano

Este documento transforma a proposta do motor e o estudo de Democracy 4 em um roteiro de trabalho até uma primeira versão pequena e publicável do jogo. As áreas representam responsabilidades que uma pessoa pode alternar. Quando outra pessoa entrar, ela poderá reservar um chamado com dependências concluídas e entrega clara.

Os 96 chamados começam em Planejado, sem responsável e sem evidência de conclusão. “Chamado” aqui é uma ficha de trabalho no projeto, não uma issue já criada em serviço externo. SG001 é o ponto de partida. A existência de uma ficha não significa que sua implementação ou uma publicação externa já foi autorizada.

Fluxo: Planejado → Pronto → Em andamento → Em revisão → Concluído. Bloqueado deve informar motivo, o que falta e quem pode resolver. Um chamado vira Pronto quando suas dependências estão concluídas, suas decisões anteriores estão registradas e sua entrega continua cabendo no tamanho previsto.

Manter uma implementação em andamento por pessoa. Uma sessão diária pode ter de uma a três horas: reservar a ficha, conferir dependências, realizar uma parte verificável, registrar evidência e deixar o próximo passo. Não é necessário concluir uma ficha a cada dia.

Estimativa de esforço: 167–334 horas de trabalho concentrado, antes de 25% de reserva para integração, retrabalho e defeitos. Com nove horas produtivas por semana, isso representa aproximadamente 23–46 semanas. São estimativas de planejamento, não prazo garantido; espera por fontes, participantes e decisões não está incluída.

Se uma ficha ultrapassar quatro horas previstas, dividir antes de continuar em SGxxx-A e SGxxx-B, preservando a referência e especificando novos aceites. Pesquisa inconclusiva deve terminar com achados, lacunas e próximo experimento, sem ocupar dias indefinidamente.

## Como entregar e passar trabalho

Ao reservar: registrar responsável, data, branch, estado e arquivos que pretende alterar. Ao pausar: registrar o que foi feito, comando de verificação, resultado, pendência e próximo passo exato. Ao concluir: anexar commit ou alteração, evidência do aceite e nota sobre decisões tomadas.

Ficha de acompanhamento a preencher no quadro: ID; responsável; estado; início; horas reais; branch ou commit; decisão vinculada; evidência; bloqueio; próximo passo. O Word é uma referência de leitura; manter o Markdown como texto mestre e atualizar o quadro operacional escolhido em SG002. Alterar o escopo aqui requer atualizar também sua cópia Word.

Uma entrega concluída deve atender ao aceite, preservar contratos usados por outras áreas, passar as verificações pertinentes e atualizar documentação afetada. Revisão individual é válida: reler o diff e executar o roteiro como usuário. Quando houver colega, pedir revisão sem exigir que a mesma pessoa aprove seu próprio código.

Cada decisão registra problema, alternativas, escolha, motivo, consequências, data e chamados afetados. SGxxx identifica sua origem. As recomendações nas fichas são pontos de partida; mudar uma delas exige ajustar os dependentes antes de torná-los Prontos.

Para colaboração, uma pessoa assume cada ficha; outra pode trabalhar em ficha independente. Exemplos: SG027 e SG026 após SG025; SG050 e SG051 após SG049; SG092 e SG093 após seus pré-requisitos. As pessoas combinam antes de alterar o mesmo arquivo. Integrações preservam o trabalho já existente e passam por verificações.

Chamados SG074–SG076 são condicionais à decisão sobre grupos sociais em SG073. Se forem adiados, registrar Não aplicável e a justificativa em cada um; isso satisfaz somente essa dependência opcional. Nenhum outro chamado pode ser pulado silenciosamente. Novos defeitos recebem BUG001 em diante e, se impedirem um aceite, bloqueiam o marco correspondente.

## Áreas de produção

PRO — Produção e produto. Prioridade, escopo, decisões, quadro e marcos. Local de referência: docs/producao e quadro de chamados.

MOT — Engenharia do motor. Contratos, grafo, executor, tempo e estado. Local de referência: src/engine.

JOG — Design e regras do jogo. Ações, recursos, turnos, perfis e balanceamento. Local de referência: src/game e definições de cenário.

PES — Pesquisa e conteúdo. Fontes, competências, variáveis e hipóteses. Local de referência: docs/pesquisa e src/scenarios.

UX — Interface e experiência. Fluxos, componentes, acessibilidade e linguagem visual. Local de referência: src/ui e src/index.css.

QA — Qualidade e validação. Referências, testes, marcos e relatos de defeitos. Local de referência: src/tests e docs/qualidade.

DEV — Ferramentas e operação. Ambiente, integração, persistência e distribuição. Local de referência: package.json e configuração de ferramentas.

DOC — Documentação e comunicação. Entrada no projeto, ajuda e instruções de uso. Local de referência: README.md e docs.

Os caminhos são destinos propostos, não pastas a criar antecipadamente. A ficha define uma área responsável, mas uma entrega pode precisar de revisão de outra. Testes pertencem à própria entrega; QA também verifica comportamentos entre componentes e riscos do modelo.

## Fases e marcos

Fase 00 — Preparação da produção. SG001 a SG008. Organizar o trabalho e estabelecer uma base verificável.

Fase 01 — Contratos do motor. SG009 a SG016. Fixar significados e decisões antes da execução matemática.

Fase 02 — Modelo e estrutura do grafo. SG017 a SG024. Carregar modelos válidos e consultar suas dependências.

Fase 03 — Cálculo e execução. SG025 a SG032. Produzir estados determinísticos com confirmação atômica.

Fase 04 — Tempo memória e restauração. SG033 a SG040. Adicionar efeitos temporais sem perder reprodutibilidade.

Fase 05 — Bancada de desenvolvimento. SG041 a SG048. Inspecionar o motor antes de construir a experiência de jogo.

Fase 06 — Pesquisa e primeiro modelo de domínio. SG049 a SG056. Escolher um recorte brasileiro pequeno e rastreável.

Fase 07 — Regras da primeira experiência jogável. SG057 a SG064. Conectar decisões do jogador ao modelo validado.

Fase 08 — Interface e comunicação com o jogador. SG065 a SG072. Transformar o ciclo validado em uma experiência compreensível.

Fase 09 — Conteúdo social e balanceamento. SG073 a SG080. Expandir apenas o que a pergunta do jogo exige.

Fase 10 — Qualidade persistência e testes com pessoas. SG081 a SG088. Preparar a primeira versão para uso fora do desenvolvimento.

Fase 11 — Publicação e continuidade. SG089 a SG096. Publicar uma primeira versão pequena e manter o trabalho sustentável.

A última ficha de cada fase é seu marco de saída e reúne os pré-requisitos. A fase seguinte depende desse marco, como indicado nos chamados. Ao fechar uma fase, detalhar e reestimar as próximas oito fichas com o conhecimento adquirido. Os marcos futuros definem um recorte inicial revisável, não uma especificação congelada por meses.

As fases 00–05 produzem um motor inspecionável. As fases 06–08 produzem um pequeno ciclo jogável. As fases 09–11 tratam aprofundamento, qualidade e distribuição. Editor completo, multiplayer, contas, nuvem, inteligência artificial e reprodução integral de Democracy 4 ficam fora desta primeira versão.

Começo sugerido: primeira sessão em SG001; segunda em SG002; terceira e quarta em SG003; depois SG004 e SG005 conforme a disponibilidade. Use o esforço real dessa primeira semana para ajustar capacidade, sem transformar a sugestão em cobrança diária.

## Base e escolhas já propostas

A proposta do motor recomenda TypeScript, grafo dirigido em memória, validação de modelos, execução síncrona, explicações e snapshots. As fichas de decisão confirmam essas escolhas antes da implementação. O protótipo atual de quatro indicadores é uma interface inicial, não um motor pronto.

O estudo de Democracy 4 inspira dependências e consequências; não fornece um catálogo brasileiro validado. A lista de grupos nele é preliminar e apresenta diferença entre a contagem anunciada e os itens listados. SG073 deve escolher perfis adequados à pergunta do SisGov, sem copiar essa lista como contrato.

Referências internas: docs/motor-do-jogo.md; docs/Motor de simulacao do SisGov.docx; docs/Estudo Democracy 4 Politicas Grupos e Efeitos.docx. Fontes de tecnologias e mecânicas estão nesses documentos. SG050–SG053 exigem pesquisa específica quando o recorte real for escolhido; não há dados brasileiros inventados neste plano.

## Catálogo de chamados


# Fase 00 Preparação da produção

Organizar o trabalho e estabelecer uma base verificável. Marco de saída: SG008.

## SG001 Definir a primeira versão

Área: PRO • Tipo: Decisão • Esforço: 1–2 h

Depende de: Nenhuma. Onde: docs/producao e quadro de chamados.

Entrega: Escrever uma página com público, plataforma inicial, experiência pretendida e exclusões.

Aceite: Há um objetivo observável, três critérios de sucesso e uma lista explícita do que fica de fora.

Escolha: Escolher navegador desktop ou outra plataforma; recomendar navegador pelo protótipo existente.

## SG002 Criar o quadro de chamados

Área: PRO • Tipo: Organização • Esforço: 1–2 h

Depende de: SG001. Onde: docs/producao e quadro de chamados.

Entrega: Adotar estados Planejado, Pronto, Em andamento, Em revisão, Bloqueado e Concluído; registrar IDs deste documento.

Aceite: Um chamado pode ser reservado, bloqueado com motivo e concluído com evidência.

Escolha: Escolher Markdown local ou ferramenta de issues; começar local é suficiente.

## SG003 Conferir o ambiente de desenvolvimento

Área: DEV • Tipo: Preparação • Esforço: 2–4 h

Depende de: SG001. Onde: package.json e configuração de ferramentas.

Entrega: Instalar as dependências existentes e registrar versões de runtime e comandos de execução, teste e build.

Aceite: Outra pessoa consegue iniciar o projeto seguindo as instruções; falhas encontradas viram chamados vinculados.

## SG004 Padronizar verificações locais

Área: DEV • Tipo: Preparação • Esforço: 2–4 h

Depende de: SG003. Onde: package.json e configuração de ferramentas.

Entrega: Escolher configuração mínima de formatação e lint, preservando TypeScript estrito.

Aceite: Existe um comando de verificação e os arquivos existentes passam ou têm exceções justificadas.

Escolha: Escolher ferramentas compatíveis com as versões existentes; evitar atualização ampla neste chamado.

## SG005 Definir trabalho em branches e revisão

Área: PRO • Tipo: Organização • Esforço: 1–2 h

Depende de: SG002, SG003. Onde: docs/producao e quadro de chamados.

Entrega: Documentar branch por chamado, identificação nos commits, integração e registro de revisão individual.

Aceite: O fluxo cobre duas pessoas trabalhando e determina como resolver sobreposição de arquivos.

## SG006 Executar verificações na integração

Área: DEV • Tipo: Automação • Esforço: 2–4 h

Depende de: SG004, SG005. Onde: package.json e configuração de ferramentas.

Entrega: Configurar testes, tipos e build no serviço de integração escolhido, sem publicar o jogo.

Aceite: Uma alteração com teste quebrado é detectada e uma versão válida passa.

Escolha: Escolher serviço conforme a hospedagem real do repositório; manter execução local reproduzível.

## SG007 Criar o guia de entrada no projeto

Área: DOC • Tipo: Documentação • Esforço: 1–2 h

Depende de: SG002, SG003, SG005. Onde: README.md e docs.

Entrega: Documentar estrutura, execução e como escolher, reservar e entregar um chamado.

Aceite: Um leitor novo encontra o documento do motor, o estudo e o quadro sem depender do histórico da conversa.

## SG008 Verificar a base de produção

Área: QA • Tipo: Marco • Esforço: 2–4 h

Depende de: SG001, SG002, SG003, SG004, SG005, SG006, SG007. Onde: src/tests e docs/qualidade.

Entrega: Executar o fluxo completo com uma alteração documental pequena e registrar o resultado.

Aceite: Ambiente, verificações, revisão e passagem de trabalho estão documentados e reproduzíveis.


# Fase 01 Contratos do motor

Fixar significados e decisões antes da execução matemática. Marco de saída: SG016.

## SG009 Escolher a semântica do passo

Área: MOT • Tipo: Decisão • Esforço: 1–2 h

Depende de: SG008. Onde: src/engine.

Entrega: Comparar atualização síncrona com propagação imediata usando uma cadeia de três nós.

Aceite: Uma decisão registrada explica quando cada valor muda e como ciclos funcionam.

Escolha: Recomendar atualização síncrona da proposta; registrar o atraso de uma conexão por passo.

## SG010 Definir tipos de nós

Área: MOT • Tipo: Contrato • Esforço: 1–2 h

Depende de: SG009. Onde: src/engine.

Entrega: Descrever entrada controlável, valor calculado e estoque com campos obrigatórios e estados iniciais.

Aceite: Cada tipo tem um exemplo válido e um inválido; entradas não aceitam contribuições de atualização.

## SG011 Definir relações e agregação

Área: MOT • Tipo: Contrato • Esforço: 1–2 h

Depende de: SG010. Onde: src/engine.

Entrega: Especificar ID, origem, destino, transformação afim, parâmetros e soma por destino.

Aceite: Duas relações entre o mesmo par são distinguíveis; a unidade da contribuição é declarada.

## SG012 Definir unidades e duração técnica

Área: MOT • Tipo: Decisão • Esforço: 1–2 h

Depende de: SG010, SG011. Onde: src/engine.

Entrega: Selecionar catálogo mínimo para exemplos artificiais e regras de conversão e duração.

Aceite: Índice 0–1, percentual 0–100 e taxa por tempo não se confundem; duração inválida é recusada.

Escolha: Escolher unidade de tempo técnica e tolerância numérica; não escolher o turno do jogo ainda.

## SG013 Definir falhas e limites

Área: MOT • Tipo: Decisão • Esforço: 1–2 h

Depende de: SG010, SG012. Onde: src/engine.

Entrega: Especificar erro estruturado, ausência de dados, valores não finitos e estouro de domínio.

Aceite: Há exemplos de rejeição e saturação explícita; estoque conservado não perde saldo silenciosamente.

Escolha: Recomendar rejeição do passo por padrão e saturação somente declarada.

## SG014 Escrever resultados calculáveis à mão

Área: QA • Tipo: Referência • Esforço: 1–2 h

Depende de: SG009, SG010, SG011, SG012, SG013. Onde: src/tests e docs/qualidade.

Entrega: Formalizar cadeia, convergência, estoque e feedback do documento do motor com estados esperados.

Aceite: Os resultados de pelo menos dois passos estão calculados sem usar o executor a implementar.

## SG015 Fixar dependências e interfaces públicas

Área: MOT • Tipo: Decisão • Esforço: 1–2 h

Depende de: SG009, SG010, SG011, SG012, SG013. Onde: src/engine.

Entrega: Registrar escolha do armazenamento do grafo, validação de entrada e operações públicas do motor.

Aceite: As operações têm entradas, saídas e erros definidos, sem importar React.

Escolha: Comparar Map e Graphology; conferir versão de Zod compatível antes de adotá-la.

## SG016 Revisar os contratos do motor

Área: QA • Tipo: Marco • Esforço: 2–4 h

Depende de: SG009, SG010, SG011, SG012, SG013, SG014, SG015. Onde: src/tests e docs/qualidade.

Entrega: Ler os contratos como se fossem implementados por outra pessoa e resolver ambiguidades.

Aceite: Semântica de tempo, unidades, erros e exemplos são consistentes; decisões têm registro.


# Fase 02 Modelo e estrutura do grafo

Carregar modelos válidos e consultar suas dependências. Marco de saída: SG024.

## SG017 Separar o núcleo do cenário atual

Área: MOT • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG016. Onde: src/engine.

Entrega: Criar a entrada pública do motor e manter a validação dos quatro indicadores na camada de cenário.

Aceite: O núcleo é importável em teste sem React nem conteúdo brasileiro.

## SG018 Validar a estrutura do modelo

Área: MOT • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG017. Onde: src/engine.

Entrega: Implementar o esquema escolhido para nós, relações, versões e valores iniciais.

Aceite: Arquivo válido carrega; campo ausente, tipo incorreto e versão desconhecida geram caminho e código de erro.

## SG019 Validar referências e identidades

Área: MOT • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG018. Onde: src/engine.

Entrega: Detectar IDs duplicados, origens ou destinos inexistentes e grafo vazio.

Aceite: Casos inválidos são recusados; um único nó de entrada é válido.

## SG020 Validar coerência matemática

Área: MOT • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG018, SG019. Onde: src/engine.

Entrega: Verificar parâmetros, unidades, duração e compatibilidade entre relações e tipos de destino.

Aceite: Relação incompatível não entra no modelo; erros identificam o elemento responsável.

## SG021 Construir índices de dependências

Área: MOT • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG019, SG020. Onde: src/engine.

Entrega: Indexar nós e relações por ID, incluindo conexões de entrada e saída em ordem estável.

Aceite: Consultas retornam relações paralelas e autorrelações sem perda ou duplicação.

## SG022 Proteger a edição da definição

Área: MOT • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG021. Onde: src/engine.

Entrega: Implementar remoção recusada quando há vínculos, cascata explícita e bloqueio de edição da execução.

Aceite: Uma edição inválida não altera a definição; cascata remove apenas relações incidentes esperadas.

## SG023 Identificar componentes e ciclos

Área: QA • Tipo: Diagnóstico • Esforço: 2–4 h

Depende de: SG021. Onde: src/engine/graph e src/tests.

Entrega: Disponibilizar diagnóstico de ciclos e componentes desconectados, sem proibir feedback temporal.

Aceite: Cadeia, ciclo, autorrelação e ilha são identificados; avisos não rejeitam modelo válido.

## SG024 Validar dois modelos independentes

Área: QA • Tipo: Marco • Esforço: 2–4 h

Depende de: SG017, SG018, SG019, SG020, SG021, SG022, SG023. Onde: src/tests e docs/qualidade.

Entrega: Montar dois pequenos modelos artificiais e carregá-los pelo mesmo contrato.

Aceite: Ambos funcionam sem alterar o núcleo; suíte cobre relações paralelas e referências quebradas.


# Fase 03 Cálculo e execução

Produzir estados determinísticos com confirmação atômica. Marco de saída: SG032.

## SG025 Inicializar estados independentes

Área: MOT • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG024. Onde: src/engine.

Entrega: Criar execução a partir de modelo validado e valores iniciais.

Aceite: Duas execuções não compartilham objetos mutáveis nem alteram a definição.

## SG026 Receber comandos de entrada

Área: MOT • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG025. Onde: src/engine.

Entrega: Validar lote de mudanças apenas em entradas controláveis antes de iniciar o passo.

Aceite: Comando fora do domínio ou duplicado para a mesma entrada rejeita o lote inteiro.

## SG027 Calcular contribuições afins

Área: MOT • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG025. Onde: src/engine.

Entrega: Implementar mecanismo de multiplicação por coeficiente e soma de constante.

Aceite: Casos positivo, negativo e zero conferem com cálculos manuais; resultado não finito é erro.

## SG028 Combinar valores calculados

Área: MOT • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG027. Onde: src/engine.

Entrega: Somar contribuições ordenadas por ID ao valor de base do nó.

Aceite: Convergência retorna 11 repetidamente no exemplo; não acumula o resultado anterior.

## SG029 Atualizar estoques por taxas

Área: MOT • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG027. Onde: src/engine.

Entrega: Aplicar saldo de taxas multiplicado pela duração sobre o estoque anterior.

Aceite: 100 itens com taxas 8 e menos 3 por dia em dois dias resulta em 110; domínio é respeitado.

## SG030 Confirmar um passo completo

Área: MOT • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG026, SG028, SG029. Onde: src/engine.

Entrega: Ler um único retrato, calcular novos valores e confirmar tudo apenas se válido.

Aceite: Cadeia e feedback seguem os exemplos; falha em um nó preserva todos os valores e o passo anterior.

## SG031 Registrar explicações do cálculo

Área: MOT • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG030. Onde: src/engine.

Entrega: Emitir valor lido, base, relação, contribuição, valor bruto e final por nó e passo.

Aceite: É possível reconstruir um resultado com o registro; saturação e erro têm causa identificável.

## SG032 Verificar determinismo e atomicidade

Área: QA • Tipo: Marco • Esforço: 2–4 h

Depende de: SG025, SG026, SG027, SG028, SG029, SG030, SG031. Onde: src/tests e docs/qualidade.

Entrega: Comparar modelos cadastrados em ordens diferentes e provocar uma falha tardia no passo.

Aceite: Trajetórias coincidem na tolerância definida e nenhuma falha deixa atualização parcial.


# Fase 04 Tempo memória e restauração

Adicionar efeitos temporais sem perder reprodutibilidade. Marco de saída: SG040.

## SG033 Manter histórico para atrasos

Área: MOT • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG032. Onde: src/engine.

Entrega: Guardar retratos de leitura em memória limitada ao atraso máximo configurado.

Aceite: A leitura anterior inclui comandos daquele início; pré-histórico usa valor inicial e memória é limitada.

## SG034 Aplicar atrasos às relações

Área: MOT • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG033. Onde: src/engine.

Entrega: Selecionar o retrato correto por atraso adicional inteiro não negativo.

Aceite: Mudança de 0 para 10 com atraso um aparece no passo seguinte; atrasos inválidos são recusados.

## SG035 Adicionar resposta gradual

Área: MOT • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG032. Onde: src/engine.

Entrega: Criar mecanismo com alvo, fração por passo, unidade e estado interno explícitos.

Aceite: Com valor 0, alvo 10 e fração 0,5, saídas são 5 e 7,5; não é confundido com atraso puro.

Escolha: Documentar a fração para a duração fixa e recusar parâmetros fora do domínio.

## SG036 Avaliar condições declarativas

Área: MOT • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG032. Onde: src/engine.

Entrega: Implementar comparações e combinações lógicas de um conjunto restrito.

Aceite: Condições usam o retrato do início; referências inválidas falham na validação e não executam código arbitrário.

## SG037 Criar situações com dois limiares

Área: MOT • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG036. Onde: src/engine.

Entrega: Persistir estado ativo e avaliar limiares diferentes de entrada e saída.

Aceite: Acima de 0,7 ativa; abaixo de 0,4 desativa; igualdade e faixa intermediária preservam estado.

## SG038 Exportar snapshot completo

Área: MOT • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG034, SG035, SG037. Onde: src/engine.

Entrega: Serializar versões, valores, passo, histórico mínimo e estados internos dos mecanismos.

Aceite: Nenhum estado necessário para continuar a execução fica apenas na memória do processo.

## SG039 Restaurar snapshot validado

Área: MOT • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG038. Onde: src/engine.

Entrega: Verificar integridade e compatibilidade antes de criar execução a partir do snapshot.

Aceite: Arquivo incompleto ou incompatível é recusado sem afetar a execução aberta.

## SG040 Comparar execução contínua e retomada

Área: QA • Tipo: Marco • Esforço: 2–4 h

Depende de: SG033, SG034, SG035, SG036, SG037, SG038, SG039. Onde: src/tests e docs/qualidade.

Entrega: Rodar um cenário temporal, interrompê-lo e retomar o snapshot; comparar com trajetória contínua.

Aceite: Valores, memórias, situações e explicações seguintes coincidem; teste longo não cresce memória sem limite.


# Fase 05 Bancada de desenvolvimento

Inspecionar o motor antes de construir a experiência de jogo. Marco de saída: SG048.

## SG041 Escolher o formato da bancada

Área: UX • Tipo: Decisão • Esforço: 1–2 h

Depende de: SG040. Onde: src/ui e src/index.css.

Entrega: Desenhar uma tela com modelo, passo, comandos, valores e causas.

Aceite: O fluxo permite carregar, avançar e explicar um resultado com dados artificiais.

Escolha: Escolher tabela inicial ou diagrama; recomendar tabela e adicionar React Flow apenas se ajudar.

## SG042 Carregar modelos na bancada

Área: UX • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG041. Onde: src/ui e src/index.css.

Entrega: Conectar seleção dos modelos de referência à criação de execução.

Aceite: Modelo inválido mostra diagnóstico; carregar outro não reaproveita estado indevido.

## SG043 Avançar e reiniciar simulações

Área: UX • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG042. Onde: src/ui e src/index.css.

Entrega: Adicionar comandos de avançar um passo e reiniciar com o estado inicial.

Aceite: Duplo clique não gera passos acidentais e reinício pede confirmação quando descarta progresso.

## SG044 Inspecionar causas de um nó

Área: UX • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG043. Onde: src/ui e src/index.css.

Entrega: Mostrar valores anteriores, contribuições, atrasos e erros do nó selecionado.

Aceite: Usuário consegue conferir o exemplo de convergência pela tela sem ler código.

## SG045 Comparar duas trajetórias

Área: UX • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG043. Onde: src/ui e src/index.css.

Entrega: Exibir uma variável em duas execuções do mesmo modelo com comandos diferentes.

Aceite: As séries têm unidade e eixo temporal; nenhuma execução altera a outra.

## SG046 Exibir dependências do nó

Área: UX • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG044. Onde: src/ui e src/index.css.

Entrega: Apresentar origens e destinos selecionáveis; implementar diagrama somente se decidido em SG041.

Aceite: Relações paralelas e direção ficam claras; existe acesso textual por teclado.

## SG047 Testar bancada com modelos extremos

Área: QA • Tipo: Verificação • Esforço: 2–4 h

Depende de: SG042, SG043, SG044, SG045, SG046. Onde: src/tests e docs/qualidade.

Entrega: Cobrir nó isolado, ciclo, atraso e erro de domínio nos fluxos visíveis.

Aceite: Erros são legíveis, a tela permite reiniciar e nenhum resultado é ocultado como zero.

## SG048 Demonstrar o motor inspecionável

Área: QA • Tipo: Marco • Esforço: 2–4 h

Depende de: SG041, SG042, SG043, SG044, SG045, SG046, SG047. Onde: src/tests e docs/qualidade.

Entrega: Gravar roteiro reproduzível de três minutos com comando, efeito atrasado e causa.

Aceite: Outra pessoa repete o roteiro e explica o resultado; núcleo segue independente da interface.


# Fase 06 Pesquisa e primeiro modelo de domínio

Escolher um recorte brasileiro pequeno e rastreável. Marco de saída: SG056.

## SG049 Escolher a pergunta do primeiro jogo

Área: PRO • Tipo: Decisão • Esforço: 1–2 h

Depende de: SG048. Onde: docs/producao e quadro de chamados.

Entrega: Comparar dois recortes educativos e escolher uma pergunta que a partida ajude a compreender.

Aceite: O recorte cabe inicialmente em 6–10 variáveis e 3 ações, com objetivo e limites explícitos.

Escolha: Escolher tema, cargo e público; não tentar simular todo o governo.

## SG050 Mapear competências do cargo

Área: PES • Tipo: Pesquisa • Esforço: 2–4 h

Depende de: SG049. Onde: docs/pesquisa e src/scenarios.

Entrega: Pesquisar fontes primárias para as três ações candidatas e seus atores institucionais.

Aceite: Cada ação distingue decisão própria, dependência de outro poder e simplificação adotada.

## SG051 Criar dicionário de variáveis

Área: PES • Tipo: Pesquisa • Esforço: 2–4 h

Depende de: SG049. Onde: docs/pesquisa e src/scenarios.

Entrega: Listar até dez variáveis com definição, unidade, fonte, data e valor provisório quando necessário.

Aceite: Indicadores não confundem índice com quantidade real; nenhum valor sem fonte parece dado observado.

## SG052 Registrar hipóteses de relações

Área: PES • Tipo: Pesquisa • Esforço: 2–4 h

Depende de: SG050, SG051. Onde: docs/pesquisa e src/scenarios.

Entrega: Selecionar de cinco a oito relações, indicando direção, atraso, evidência e incerteza.

Aceite: Cada ligação distingue hipótese de design de resultado empírico e tem referência verificável.

## SG053 Definir parâmetros iniciais

Área: PES • Tipo: Decisão • Esforço: 1–2 h

Depende de: SG052. Onde: docs/pesquisa e src/scenarios.

Entrega: Estimar faixas dos parâmetros e registrar mecanismo matemático e cenário de referência.

Aceite: Cada parâmetro tem origem, intervalo plausível e justificativa de uso.

Escolha: Escolher calibração por dados ou hipótese explícita por relação; reduzir recorte se faltar evidência.

## SG054 Carregar o primeiro modelo de domínio

Área: MOT • Tipo: Conteúdo • Esforço: 1–2 h

Depende de: SG051, SG052, SG053. Onde: src/scenarios e src/tests.

Entrega: Codificar o pequeno modelo e estado inicial usando apenas mecanismos disponíveis.

Aceite: O mesmo executor carrega o modelo sem condições específicas de Brasil dentro do núcleo.

## SG055 Comparar três cenários de referência

Área: QA • Tipo: Análise • Esforço: 2–4 h

Depende de: SG054. Onde: src/tests e docs/qualidade.

Entrega: Executar base, aumento e redução de uma entrada; registrar trajetórias e resultados inesperados.

Aceite: Há comparação com expectativas documentadas; divergências viram questões de modelo, não ajustes ocultos.

## SG056 Revisar a coerência do recorte

Área: QA • Tipo: Marco • Esforço: 2–4 h

Depende de: SG049, SG050, SG051, SG052, SG053, SG054, SG055. Onde: src/tests e docs/qualidade.

Entrega: Revisar fontes, unidades, ordem de grandeza e limitações com a pergunta escolhida.

Aceite: Existe um modelo pequeno explicável e as limitações são visíveis; não se afirma validade científica só por testes.


# Fase 07 Regras da primeira experiência jogável

Conectar decisões do jogador ao modelo validado. Marco de saída: SG064.

## SG057 Definir ciclo e duração da partida

Área: JOG • Tipo: Decisão • Esforço: 1–2 h

Depende de: SG056. Onde: src/game e definições de cenário.

Entrega: Descrever observar, escolher ação, confirmar, avançar e avaliar; ligar turno a passos técnicos.

Aceite: Um roteiro finito tem começo, decisões e encerramento, sem ambiguidade temporal.

Escolha: Escolher duração, quantidade de turnos e objetivo; eleições ficam fora salvo decisão justificada.

## SG058 Definir ficha de ação de jogo

Área: JOG • Tipo: Contrato • Esforço: 1–2 h

Depende de: SG057. Onde: src/game e definições de cenário.

Entrega: Descrever ID, intensidade, custo, pré-requisitos, comando gerado e prazo das três ações.

Aceite: Cada ação se traduz em entradas do motor e explica impedimentos sem alterar o núcleo.

## SG059 Validar disponibilidade de ações

Área: JOG • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG058. Onde: src/game e definições de cenário.

Entrega: Avaliar pré-requisitos e conflitos na camada de jogo.

Aceite: Ação bloqueada informa motivo; combinações incompatíveis não chegam ao executor.

## SG060 Registrar custos e recursos

Área: JOG • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG058. Onde: src/game e definições de cenário.

Entrega: Implementar o recurso escolhido e contabilizar custo uma vez por confirmação.

Aceite: Saldo antes e depois é rastreável; falha no comando não cobra e repetição não cobra em dobro.

Escolha: Escolher apenas orçamento ou outro recurso no primeiro recorte; evitar dois sistemas sem necessidade.

## SG061 Controlar a transição de turno

Área: JOG • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG059, SG060. Onde: src/game e definições de cenário.

Entrega: Orquestrar confirmação, custos, comandos e avanço dos passos; aplicar a condição de encerramento definida em SG057.

Aceite: Falha preserva recursos e estado; fase de turno impede dupla confirmação e avanço após o fim da partida.

## SG062 Implementar a primeira ação completa

Área: JOG • Tipo: Conteúdo • Esforço: 1–2 h

Depende de: SG061. Onde: src/game e definições de cenário.

Entrega: Conectar uma das ações a disponibilidade, custo, intensidade e efeito temporal.

Aceite: Roteiro mostra decisão, gasto, efeito e explicação, incluindo caminho de recusa.

## SG063 Adicionar as duas ações restantes

Área: JOG • Tipo: Conteúdo • Esforço: 1–2 h

Depende de: SG062. Onde: src/game e definições de cenário.

Entrega: Aplicar a mesma ficha às outras duas ações, sem criar mecanismos exclusivos desnecessários.

Aceite: As três têm efeito observável e custos coerentes; ações semelhantes reutilizam o mesmo fluxo.

## SG064 Validar o ciclo jogável sem interface final

Área: QA • Tipo: Marco • Esforço: 2–4 h

Depende de: SG057, SG058, SG059, SG060, SG061, SG062, SG063. Onde: src/tests e docs/qualidade.

Entrega: Executar partida curta por testes ou bancada, incluindo encerramento pelo objetivo escolhido.

Aceite: Uma sequência completa chega ao fim e recusa ações inválidas; regra de término é verificável.


# Fase 08 Interface e comunicação com o jogador

Transformar o ciclo validado em uma experiência compreensível. Marco de saída: SG072.

## SG065 Desenhar os fluxos principais

Área: UX • Tipo: Design • Esforço: 2–4 h

Depende de: SG064. Onde: src/ui e src/index.css.

Entrega: Criar wireframes de início, painel, escolha, confirmação e resumo do turno.

Aceite: Há caminho claro de uma tela à seguinte e representação de carregamento, erro e fim de partida.

## SG066 Definir linguagem visual mínima

Área: UX • Tipo: Design • Esforço: 2–4 h

Depende de: SG065. Onde: src/ui e src/index.css.

Entrega: Escolher tipografia, cores, espaçamento e estados de controles para as telas existentes.

Aceite: A direção dos efeitos não depende só de cor; foco e contraste são verificáveis.

Escolha: Escolher reaproveitamento do mapa atual ou painel; privilegiar legibilidade do recorte.

## SG067 Construir início e painel da partida

Área: UX • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG066. Onde: src/ui e src/index.css.

Entrega: Conectar início, indicadores, unidades e passo ao estado da camada de jogo.

Aceite: Nova partida começa limpa e o painel reflete exatamente a execução ativa.

## SG068 Construir escolha e confirmação de ações

Área: UX • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG067. Onde: src/ui e src/index.css.

Entrega: Exibir ações, intensidade, custo e motivos de bloqueio usando as regras já implementadas.

Aceite: Jogador confirma uma ação válida e entende por que outra está bloqueada.

## SG069 Construir resumo e explicação do turno

Área: UX • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG068. Onde: src/ui e src/index.css.

Entrega: Apresentar o que mudou, contribuições relevantes e efeitos ainda em implantação.

Aceite: Roteiro permite seguir uma decisão até um resultado e abrir os detalhes do cálculo.

## SG070 Escrever introdução e ajuda contextual

Área: DOC • Tipo: Conteúdo • Esforço: 1–2 h

Depende de: SG069. Onde: README.md e docs.

Entrega: Explicar objetivo, unidade dos indicadores, turnos e diferença entre hipótese e dado.

Aceite: Uma pessoa nova consegue realizar a primeira decisão com a ajuda; termos vagos são definidos.

## SG071 Mostrar encerramento e reinício

Área: UX • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG069. Onde: src/ui e src/index.css.

Entrega: Exibir motivo do fim, resultado e ação para começar novamente.

Aceite: Não há turno extra depois do encerramento; reinício não herda comandos nem recursos.

## SG072 Verificar partida completa pela interface

Área: QA • Tipo: Marco • Esforço: 2–4 h

Depende de: SG065, SG066, SG067, SG068, SG069, SG070, SG071. Onde: src/tests e docs/qualidade.

Entrega: Percorrer o roteiro com teclado e no menor tamanho de tela suportado.

Aceite: É possível iniciar, decidir, entender e terminar sem bloqueio de foco ou conteúdo cortado.


# Fase 09 Conteúdo social e balanceamento

Expandir apenas o que a pergunta do jogo exige. Marco de saída: SG080.

## SG073 Escolher como representar grupos sociais

Área: JOG • Tipo: Decisão • Esforço: 1–2 h

Depende de: SG072. Onde: src/game e definições de cenário.

Entrega: Avaliar se o recorte precisa de grupos; se sim, definir até três perfis sobrepostos.

Aceite: A decisão explica impacto na pergunta do jogo; é válido adiar grupos com justificativa.

Escolha: Comparar perfis agregados e eleitores individuais; recomendar agregados para esta versão.

## SG074 Definir sensibilidades dos perfis

Área: PES • Tipo: Pesquisa • Esforço: 2–4 h • Condicional a SG073

Depende de: SG073. Onde: docs/pesquisa e src/scenarios.

Entrega: Se grupos aprovados, registrar atributos e três a cinco relações com evidência ou hipótese identificada.

Aceite: Perfis não são descritos como pessoas idênticas; incerteza e sobreposição ficam documentadas.

Escolha: Se adiados, encerrar como Não aplicável com referência a SG073.

## SG075 Calcular efeitos nos perfis

Área: JOG • Tipo: Implementação • Esforço: 2–4 h • Condicional a SG073

Depende de: SG074. Onde: src/game e definições de cenário.

Entrega: Se aplicável, calcular satisfação ou exposição conforme o contrato decidido, fora do motor genérico.

Aceite: Pessoa em dois perfis não vira dois votos; nenhum sistema eleitoral é inferido automaticamente.

## SG076 Explicar efeitos sociais na tela

Área: UX • Tipo: Implementação • Esforço: 2–4 h • Condicional a SG073

Depende de: SG075. Onde: src/ui e src/index.css.

Entrega: Se aplicável, mostrar benefício, custo e origem dos efeitos para cada perfil.

Aceite: Jogador consegue identificar um conflito entre interesses sem rótulo simplista de grupo bom ou ruim.

## SG077 Medir sensibilidade dos parâmetros

Área: QA • Tipo: Análise • Esforço: 2–4 h

Depende de: SG072, SG076. Onde: src/tests e docs/qualidade.

Entrega: Variar dois parâmetros centrais nos intervalos documentados e comparar trajetórias.

Aceite: Relatório identifica mudanças de sinal, resultados extremos e dependência de hipóteses frágeis.

## SG078 Ajustar uma escolha dominante

Área: JOG • Tipo: Balanceamento • Esforço: 2–4 h

Depende de: SG077. Onde: src/game e definições de cenário.

Entrega: Identificar ação que supera as outras sem contrapartida e propor um ajuste justificado.

Aceite: Comparação mostra a contrapartida introduzida; se nenhuma escolha dominante for encontrada, registrar as estratégias verificadas sem forçar ajuste.

## SG079 Revisar textos e procedência de recursos

Área: DOC • Tipo: Conteúdo • Esforço: 1–2 h

Depende de: SG076, SG078. Onde: README.md e docs.

Entrega: Revisar nomes, explicações e origem de imagens, ícones e sons efetivamente utilizados.

Aceite: Não há texto copiado de Democracy 4; recursos têm licença ou autoria identificada e pendências registradas.

## SG080 Revisar o equilíbrio da primeira versão

Área: QA • Tipo: Marco • Esforço: 2–4 h

Depende de: SG073, SG074, SG075, SG076, SG077, SG078, SG079. Onde: src/tests e docs/qualidade.

Entrega: Executar duas estratégias e conferir consequências, compreensão e coerência do modelo.

Aceite: Nenhum ajuste esconde erro matemático; mecanismos sociais adiados estão explicitamente marcados.


# Fase 10 Qualidade persistência e testes com pessoas

Preparar a primeira versão para uso fora do desenvolvimento. Marco de saída: SG088.

## SG081 Definir armazenamento da partida

Área: DEV • Tipo: Decisão • Esforço: 1–2 h

Depende de: SG080. Onde: docs/producao e contrato de persistência em src/game.

Entrega: Escolher exportação em arquivo ou armazenamento no navegador e política de versão.

Aceite: O desenho inclui estado do jogo, recursos, turno, snapshot do motor e tratamento de incompatibilidade.

Escolha: Recomendar arquivo local primeiro; conta e nuvem exigem outro escopo.

## SG082 Salvar e recuperar uma partida

Área: DEV • Tipo: Implementação • Esforço: 2–4 h

Depende de: SG081. Onde: src/game/persistence, src/ui e src/tests.

Entrega: Implementar o caminho de persistência escolhido e restauração validada.

Aceite: Partida retomada preserva custo, fase e histórico; arquivo inválido mantém partida atual intacta.

## SG083 Automatizar o percurso essencial

Área: QA • Tipo: Teste • Esforço: 2–4 h

Depende de: SG082. Onde: src/tests e docs/qualidade.

Entrega: Cobrir iniciar, decidir, avançar, salvar, recuperar e encerrar em teste de interface.

Aceite: O teste detecta cobrança duplicada e turno perdido; roda no ambiente de integração.

## SG084 Auditar acessibilidade do percurso

Área: UX • Tipo: Correção • Esforço: 2–4 h

Depende de: SG083. Onde: src/ui e src/index.css.

Entrega: Verificar teclado, foco, nomes acessíveis, contraste e movimento reduzido.

Aceite: As falhas do percurso essencial são corrigidas e verificadas manualmente, além das verificações automáticas.

## SG085 Medir desempenho e memória

Área: DEV • Tipo: Análise • Esforço: 2–4 h

Depende de: SG083. Onde: package.json e configuração de ferramentas.

Entrega: Medir carga inicial e avanço na máquina de referência, com modelo e duração registrados.

Aceite: Há medições reproduzíveis e gargalo identificado; nenhuma otimização é adicionada sem necessidade.

Escolha: Fixar orçamento de resposta conforme dispositivo; Worker só se a medição justificar.

## SG086 Preparar e realizar sessão de uso

Área: PRO • Tipo: Teste com pessoas • Esforço: 2–4 h

Depende de: SG084, SG085. Onde: docs/producao e quadro de chamados.

Entrega: Criar roteiro de 20 minutos e observar ao menos uma pessoa tentando jogar sem orientação contínua.

Aceite: Registrar consentimento para qualquer gravação, dificuldades e conclusões; falta de participante vira bloqueio visível.

## SG087 Corrigir o principal bloqueio de uso

Área: QA • Tipo: Correção • Esforço: 2–4 h

Depende de: SG086. Onde: src/tests e docs/qualidade.

Entrega: Selecionar um problema crítico da sessão, corrigir e repetir a tarefa afetada.

Aceite: A tarefa antes impedida funciona; se não houver bloqueio, registrar o resultado da sessão. Outros defeitos recebem chamados separados.

## SG088 Aprovar a candidata a lançamento

Área: QA • Tipo: Marco • Esforço: 2–4 h

Depende de: SG081, SG082, SG083, SG084, SG085, SG086, SG087. Onde: src/tests e docs/qualidade.

Entrega: Executar checklist do percurso, dados, compatibilidade e problemas conhecidos.

Aceite: Não há perda de partida ou bloqueio crítico conhecido; pendências menores têm responsável e prioridade.


# Fase 11 Publicação e continuidade

Publicar uma primeira versão pequena e manter o trabalho sustentável. Marco de saída: SG096.

## SG089 Escolher canal de distribuição

Área: PRO • Tipo: Decisão • Esforço: 1–2 h

Depende de: SG088. Onde: docs/producao e quadro de chamados.

Entrega: Comparar distribuição web estática com pacote local dentro da plataforma escolhida.

Aceite: Custos, privacidade, requisitos e responsável pela publicação estão registrados.

Escolha: Selecionar provedor apenas após verificar condições atuais; não assumir gasto ou serviço pago.

## SG090 Preparar versão e pacote de lançamento

Área: DEV • Tipo: Preparação • Esforço: 2–4 h

Depende de: SG089. Onde: package.json e configuração de ferramentas.

Entrega: Gerar pacote identificável com versão do jogo, modelo e notas de mudança.

Aceite: O pacote inicia fora do ambiente de desenvolvimento e registra limitações conhecidas.

## SG091 Ensaiar publicação em ambiente de teste

Área: DEV • Tipo: Verificação • Esforço: 2–4 h

Depende de: SG090. Onde: package.json e configuração de ferramentas.

Entrega: Configurar o destino escolhido e testar o pacote com configuração de produção.

Aceite: Rotas e recursos carregam; salvar e recuperar funcionam no destino; publicação pública ainda é decisão separada.

## SG092 Definir retorno à versão anterior

Área: DEV • Tipo: Operação • Esforço: 2–4 h

Depende de: SG091. Onde: package.json e configuração de ferramentas.

Entrega: Documentar e ensaiar recuperação do pacote anterior e tratamento de partidas incompatíveis.

Aceite: É possível restaurar versão anterior sem prometer converter saves novos automaticamente.

## SG093 Preparar orientações ao jogador

Área: DOC • Tipo: Documentação • Esforço: 1–2 h

Depende de: SG090. Onde: README.md e docs.

Entrega: Escrever como jogar, salvar, relatar problemas e consultar limites do modelo.

Aceite: Instruções correspondem à versão candidata e incluem canal de contato efetivamente disponível.

## SG094 Autorizar e publicar a primeira versão

Área: PRO • Tipo: Lançamento • Esforço: 2–4 h

Depende de: SG088, SG091, SG092, SG093. Onde: docs/producao e quadro de chamados.

Entrega: Revisar a candidata concreta, registrar decisão do responsável e publicar no destino aprovado.

Aceite: Endereço ou pacote final é verificado com uma nova partida e versão correta.

Escolha: Publicação externa e eventuais custos dependem de autorização explícita do responsável.

## SG095 Organizar o primeiro ciclo de feedback

Área: PRO • Tipo: Triagem • Esforço: 2–4 h

Depende de: SG094. Onde: docs/producao e quadro de chamados.

Entrega: Definir rotina de leitura de relatos, registrar defeitos reproduzíveis e classificar impacto.

Aceite: Cada relato acionável tem versão, passos, resultado esperado e prioridade; não prometer monitoramento automático.

## SG096 Planejar o próximo ciclo de produção

Área: PRO • Tipo: Marco • Esforço: 2–4 h

Depende de: SG095. Onde: docs/producao e quadro de chamados.

Entrega: Revisar métricas disponíveis, trabalho pendente e até cinco candidatos para a próxima versão.

Aceite: Novo ciclo tem objetivo, orçamento de esforço e chamados pequenos; não reabrir todo o escopo de uma vez.
