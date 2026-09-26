# Motor de simulação do SisGov

Proposta técnica inicial para discussão e implementação incremental

26 de setembro de 2026

## Objetivo e recorte

Vamos construir um motor genérico de simulação numérica em grafos, com regras explícitas e resultados explicáveis. Ele deverá carregar um modelo, validar suas relações, avançar o tempo e mostrar como cada resultado foi produzido. Esta proposta define a base para iniciar esse trabalho; as escolhas aqui são recomendações de arquitetura, ainda sem implementação.

O estudo de Democracy 4 inspira três capacidades: dependências entre variáveis, consequências que aparecem ao longo do tempo e inspeção das causas de cada mudança. As políticas públicas e os grupos sociais daquele estudo ficam como conteúdo de referência para uma etapa posterior. Nesta etapa, “políticas do motor” são as decisões técnicas sobre execução, erros, tempo e integridade dos dados.

O primeiro resultado será uma simulação pequena, executável por testes, com exemplos artificiais calculáveis à mão. O motor deverá funcionar sem tela, país, eleições ou regras de governo. O passo técnico terá duração definida pelo modelo; ainda não vamos decidir quanto dura um turno do jogo.

## Por que usar grafos

Um grafo dirigido representa variáveis como nós e influências como conexões com direção. Uma relação de A para B significa que A participa do cálculo de B. A rede permite consultar tanto o que afeta um indicador quanto aquilo que ele afeta.

Usaremos um multigrafo dirigido: duas variáveis podem ter mais de uma relação entre si, desde que cada relação tenha identidade e significado próprios. Por exemplo, uma entrada pode produzir duas contribuições distintas, cada uma com seu atraso. Somente os IDs precisam ser únicos; a repetição acidental de relações deve gerar aviso.

O grafo registra dependências. O executor define quando ler cada valor e como combiná-los. A visualização é uma terceira responsabilidade: a posição de um círculo na tela nunca altera o resultado da simulação.

Não há necessidade inicial de banco de dados de grafos ou aprendizado de máquina. Uma estrutura em memória permite consultar e executar o pequeno modelo localmente. A eventual necessidade de armazenamento compartilhado será uma decisão separada.

## Tecnologias propostas

TypeScript em modo estrito será a linguagem do núcleo, aproveitando a base já presente no projeto. Os tipos ajudam a distinguir entradas, estoques e regras durante o desenvolvimento; a validação em execução continuará obrigatória para arquivos carregados.

Para o primeiro grafo, proponho Map para indexar nós e relações por ID, acompanhado de índices de conexões de entrada e saída. É uma escolha pequena e suficiente para consultas locais e execução síncrona. Graphology é a alternativa quando precisarmos de mais algoritmos ou operações estruturais: suporta grafos dirigidos e multigrafos. A interface do nosso núcleo deve permitir essa troca sem alterar os modelos. [S2]

Modelos serão descritos em JSON, com validação estrutural por Zod e validação semântica própria. Zod oferece esquemas com inferência de tipos; unidades, referências e coerência matemática exigirão regras adicionais do motor. Antes de instalar uma versão, conferir sua compatibilidade com o TypeScript do projeto. [S3]

Vitest, já declarado no projeto, será usado para exemplos de referência, invariantes e reprodução de execuções. React e Vite continuarão na interface de desenvolvimento. React Flow é uma opção para uma futura bancada de inspeção com nós e conexões; não executará a simulação. [S4]

Inicialmente não precisamos de servidor, banco de dados, Web Worker ou editor visual. Um Worker só passa a ser necessário se medições mostrarem que os cálculos bloqueiam a interface. Nenhuma nova dependência será instalada pela criação deste documento.

## Separação das responsabilidades

O modelo contém a definição imutável dos nós, relações, parâmetros, unidades e regras. O estado contém valores atuais, passo, memórias de atraso e estados de situações. Uma execução contém o modelo identificado por versão, o estado inicial e a sequência de comandos.

O grafo mantém os índices e responde a consultas de dependência. O executor aplica as regras e produz um novo estado. A camada de explicação registra entradas lidas, contribuições, condições avaliadas e resultado. A interface recebe esses registros e os apresenta ao usuário.

Essa separação evita que uma partida altere a definição usada por outra. Permite também testar o cálculo sem React e comparar execuções do mesmo modelo com comandos diferentes.

## Contrato dos nós e das relações

Todo nó terá ID estável, nome, descrição, tipo, unidade e domínio permitido. O valor inicial fará parte do estado inicial. Campos visuais e textos de domínio ficam fora da lógica matemática.

Entrada controlável representa um valor fornecido por comando ou por um cenário. Sem novo comando, mantém seu valor. Exemplos artificiais são intensidade de uma ação ou uma taxa externa constante.

Valor calculado representa uma grandeza obtida novamente em cada passo a partir de um valor de base e das contribuições recebidas. Não acumula seu resultado anterior. Um índice artificial com base 10 e contribuição 3 resulta em 13 a cada passo enquanto suas causas permanecerem iguais.

Estoque representa uma quantidade acumulada. Seu próximo valor é o valor anterior mais o saldo das taxas de entrada e saída multiplicado pela duração do passo. O saldo é expresso em unidade por unidade de tempo, como itens por dia.

Situação representa um estado ativado por uma condição. Será introduzida depois do núcleo numérico, com limiares distintos para ativar e desativar e memória do estado anterior. Essa diferença evita alternância a cada pequena oscilação.

Cada relação terá ID, origem, destino, mecanismo, parâmetros, unidade de saída e atraso explícito. A primeira versão usará apenas transformação afim de uma entrada: multiplicar o valor da origem por um coeficiente e somar um termo constante. O coeficiente deverá converter a unidade de origem para a unidade de contribuição.

Contribuições para um valor calculado terão a unidade desse valor. Contribuições para um estoque terão unidade de taxa. A agregação inicial será soma, em ordem estável de IDs. Produto, mínimo e máximo só serão acrescentados como mecanismos definidos e testados, com semântica própria.

Um peso positivo aumenta a contribuição quando a origem aumenta; não significa benefício. Um peso negativo não significa prejuízo. Para fórmulas futuras com várias entradas, o mecanismo declarará todas as dependências e produzirá uma única contribuição por regra, evitando contagem duplicada por aresta.

## Política de execução e tempo

A proposta inicial é uma atualização síncrona. Um passo lê um retrato imutável do estado inicial e produz outro estado. Todos os nós leem esse mesmo retrato; nenhum cálculo lê um resultado parcial produzido naquele passo.

Primeiro, o motor valida o lote de comandos. Os comandos aceitos alteram apenas entradas controláveis de uma cópia de trabalho. Essa cópia vira o retrato de leitura do passo. Dois comandos no mesmo lote para a mesma entrada serão rejeitados, evitando uma precedência implícita.

Depois, o executor consulta as entradas e memórias necessárias, calcula as contribuições, combina-as por destino e calcula os novos valores. Em seguida, valida os resultados e grava, de uma só vez, estado, histórico necessário e explicações. Se alguma etapa falhar, nenhuma parte do passo é confirmada.

Essa escolha permite A influenciar B e B influenciar A: ambos usam valores anteriores. Também permite autorrelações explícitas. Não exige ordenação topológica e não tenta resolver um equilíbrio de equações dentro de um único passo.

A consequência precisa ficar visível: em A para B para C, uma mudança de A chega a B ao final do primeiro passo e a C ao final do segundo. Até uma relação com atraso adicional zero tem essa semântica de leitura. É uma simplificação deliberada da primeira versão e exige escolher uma duração de passo adequada.

Se precisarmos que cadeias sem ciclos se propaguem dentro do mesmo passo, isso será uma extensão explícita com fases de cálculo e regras para ciclos instantâneos. Não misturaremos os dois comportamentos silenciosamente.

## Políticas de integridade do motor

Determinismo significa que modelo, versão do executor, estado inicial e comandos iguais produzem a mesma trajetória no mesmo ambiente suportado. A ordem de cadastro não deve mudar o resultado. Ordenar nós e relações por ID estabiliza inclusive a ordem das somas numéricas. Comparações entre ambientes usarão tolerância documentada; igualdade binária entre plataformas não é prometida.

Valores ausentes, NaN e infinitos serão erros. Um zero válido precisa ser distinguido de dado ausente. Não converteremos automaticamente um erro em zero, porque isso alteraria a simulação sem explicar a causa.

Cada nó pode declarar limites. O comportamento padrão será rejeitar o passo que ultrapasse o domínio. Saturação em limites, quando necessária, será uma opção explícita e aparecerá no registro com valor bruto, limite aplicado e valor final. Estoques conservados não podem usar corte silencioso: fluxos precisam ser limitados de forma coerente ou a operação deve falhar.

As unidades serão identificadores explícitos em um pequeno catálogo inicial. Um índice de 0 a 1 e um percentual de 0 a 100 são representações distintas e requerem conversão. Na primeira versão, aceitaremos apenas unidades e conversões registradas; uma álgebra geral de unidades fica adiada.

A duração do passo será positiva e fixa durante a execução. Um modelo pode usar dias artificiais, por exemplo. Alterar essa duração altera a interpretação de taxas e atrasos; por isso exige criar outra execução. Um cálculo de estoque por passos também pode ficar instável com passos grandes, o que será avaliado em testes de trajetória.

O grafo ficará imutável durante uma execução. Edições estruturais ocorrerão na definição, seguidas de nova validação e inicialização. Remover um nó com relações incidentes será recusado por padrão; remoção em cascata exigirá operação explícita. Componentes desconectados e relações paralelas equivalentes gerarão avisos, pois podem ser intencionais.

Fórmulas em JSON selecionarão mecanismos de um registro conhecido. Não executaremos JavaScript arbitrário de arquivos com eval. Novos mecanismos serão funções implementadas e testadas no núcleo, com parâmetros validados.

O motor não terá aleatoriedade na primeira versão. Quando ela for necessária, deverá usar gerador com semente e estado persistido. Relógio do computador, chamadas de rede e efeitos externos não participarão dos cálculos.

## Atrasos respostas graduais e condições

Atraso adicional de zero lê o retrato do passo atual. Atraso adicional de um lê o retrato do passo anterior, e assim sucessivamente. O histórico de leitura é identificado pelo índice do passo e inclui os comandos aplicados naquele início. Antes do primeiro passo, o preenchimento será o valor inicial declarado; essa convenção ficará registrada no modelo.

Essa memória será mantida apenas até o maior atraso necessário. O histórico completo para análise é um recurso separado, para que uma execução longa não acumule memória sem controle.

Resposta gradual será outro mecanismo: a saída percorre uma fração definida da distância até um alvo a cada passo. Ela precisa de estado próprio e parâmetros coerentes com a duração do passo. Não equivale a esperar alguns passos e então aplicar toda a mudança.

Condições poderão habilitar contribuições usando comparações e combinações lógicas declaradas. Serão avaliadas sobre o mesmo retrato imutável. Uma situação que se ativa ao final de um passo só poderá influenciar outros nós no próximo. Não haverá repetição automática de regras até estabilizar dentro do passo.

Implementaremos primeiro a execução sem atraso adicional, depois a memória de atraso, depois respostas graduais e situações. Isso permite testar cada comportamento isoladamente.

## Explicação e reprodução

Para cada alteração, a explicação conterá nó, passo, valor anterior, base usada, relações aplicadas, valores de origem realmente lidos, atrasos, contribuições, resultado bruto e eventual aplicação de limites. Erros informarão código, elemento e campo, além de mensagem legível.

O registro é uma decomposição do cálculo implementado. Ele não demonstra, por si só, causalidade no mundo real. A justificativa de domínio e a fonte de uma relação devem ficar nos metadados do modelo, independentes da explicação matemática.

Um snapshot deverá incluir valores, passo, duração, memórias de atraso, estados internos dos mecanismos e identificadores de versão do modelo e do executor. Comandos externos deverão ser registrados por passo. Restaurar uma execução exige esses dados; somente os valores visíveis dos nós seriam insuficientes.

A primeira versão exportará estruturas serializáveis, sem exigir banco de dados. Arquivos incompatíveis serão recusados com diagnóstico. Migração entre versões será uma capacidade posterior, nunca uma conversão silenciosa.

## Exemplos de referência e testes

Exemplo de cadeia: A é entrada igual a 4. B é calculado com base 0 e recebe duas vezes A. C é calculado com base 0 e recebe B mais 1. Com B e C inicialmente iguais a 0, o primeiro passo produz B igual a 8 e C igual a 1. O segundo produz B igual a 8 e C igual a 9. Esse caso comprova a semântica síncrona e o atraso de propagação entre nós.

Exemplo de convergência: um valor calculado tem base 10 e recebe contribuições 3 e menos 2. O resultado deve ser 11, independentemente da ordem de cadastro. Ele permanece 11 no passo seguinte se as causas não mudarem; não vira 12 por acumulação acidental.

Exemplo de estoque: uma reserva começa com 100 itens, recebe 8 itens por dia e perde 3 itens por dia. Um passo de dois dias produz 110 itens. O teste verifica unidade, duração e acumulação. Se uma saída consumir mais que o disponível, o passo falha no modo padrão e preserva o estado anterior.

Exemplo de feedback: A e B são calculados; inicialmente A vale 10 e B vale 0. A recebe metade de B e B recebe metade de A. Após um passo, A vale 0 e B vale 5; após dois, A vale 2,5 e B vale 0. Isso verifica leitura do mesmo retrato sem atualização em sequência.

Exemplo de atraso: uma entrada inicialmente em 0 recebe comando para 10 no primeiro passo. Uma relação com atraso adicional de um passo ainda lê 0 nessa execução; no passo seguinte lê 10. Recarregar um snapshot entre esses passos deve preservar o mesmo resultado.

Os testes também cobrirão IDs duplicados, referências quebradas, parâmetros inválidos, unidades incompatíveis, isolamento entre execuções e rejeição atômica de um lote de comandos. Para situações, ativar acima de 0,7 e desativar abaixo de 0,4 deve manter o estado quando a entrada estiver entre os limiares ou exatamente neles.

O teste de reprodução comparará uma execução contínua com outra interrompida, exportada e retomada. Testes de trajetórias maiores observarão divergência numérica e limites; aprovar um passo isolado não comprova estabilidade.

## Organização proposta no projeto

src/engine/model conterá contratos, esquemas e validação semântica. src/engine/graph conterá índices e consultas. src/engine/runtime conterá estado e executor. src/engine/mechanisms conterá transformações, agregação e mecanismos com memória. src/engine/diagnostics conterá erros e explicações.

src/engine/fixtures guardará modelos artificiais de referência. Os testes do motor poderão ficar junto ao núcleo ou na pasta de testes existente, mantendo o mesmo padrão em todo o trabalho. src/engine/index.ts exportará apenas as operações públicas necessárias: validar modelo, criar execução, avançar, explicar, exportar e restaurar estado.

Esses nomes representam responsabilidades propostas, não uma obrigação de abrir todos os diretórios antes de existir código suficiente. As assinaturas concretas serão definidas na primeira entrega.

O validador atual exige quatro indicadores nacionais e pertence ao cenário inicial. Ele não será reutilizado como contrato do motor genérico. Os valores null e pesos visuais do mapa atual também não serão tratados como dados válidos de simulação automaticamente.

## Entregas para construir o motor

Entrega 1 — Contratos e exemplos. Definir os tipos de entrada, calculado e estoque, a transformação afim, unidades e estados iniciais. Registrar os exemplos de cadeia, convergência, estoque e feedback como resultados esperados. Aceite: cada campo e cada valor esperado tem significado inequívoco.

Entrega 2 — Modelo validado e grafo. Carregar definições, verificar IDs, referências, unidades e parâmetros, construir índices e oferecer consultas de entrada e saída. Aceite: dados inválidos produzem diagnósticos específicos; grafo vazio é recusado e um único nó de entrada é válido.

Entrega 3 — Executor síncrono. Aplicar comandos, calcular contribuições e confirmar estados atomicamente. Aceite: os quatro exemplos numéricos passam e a ordem de cadastro não altera resultados.

Entrega 4 — Tempo e memória. Acrescentar atrasos, resposta gradual e situações, um mecanismo de cada vez. Aceite: histórico e estado interno são suficientes para continuar uma execução sem mudar sua trajetória.

Entrega 5 — Inspeção do motor. Exportar explicações e acrescentar uma bancada mínima para avançar, reiniciar e consultar um nó. Aceite: é possível reconstruir um resultado a partir do registro de contribuições. A bancada pode começar com listas e valores; o diagrama entra quando facilitar a inspeção.

O recorte termina com esse motor verificado. A escolha das políticas públicas, do modelo brasileiro e da experiência de jogo será discutida em outro momento. A primeira tarefa concreta é detalhar e implementar os contratos e exemplos da entrega 1 após a revisão desta proposta.

## Referências e decisões pendentes

[S1] Estudo Democracy 4 Políticas Grupos e Efeitos, documento local em docs. Usado como referência conceitual de relações, tempo e inspeção. As recomendações técnicas deste documento são decisões propostas para o SisGov, não descrições da implementação interna de Democracy 4. A listagem de grupos do estudo é preliminar e não será usada como catálogo fechado do motor.

[S2] Graphology — Instantiation. Documenta grafos dirigidos, multigrafos e opções de construção. https://graphology.github.io/instantiation.html

[S3] Zod — documentação oficial. Validação de esquemas e inferência de tipos. https://zod.dev/

[S4] React Flow — documentação oficial. Interface para diagramas interativos com nós e conexões. https://reactflow.dev/learn/concepts/terms-and-definitions

Fontes técnicas consultadas em 26 de setembro de 2026. Não foram escolhidas versões de dependências novas neste documento.

As decisões recomendadas para a primeira implementação são atualização síncrona, grafo em memória, agregação por soma, domínio validado e falha atômica. Permanecem para validação durante as entregas a duração dos exemplos, as unidades iniciais suportadas e a necessidade de Graphology. A duração do turno e o conteúdo do jogo ficam fora desta decisão.
