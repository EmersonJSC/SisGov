# Plano de desenvolvimento do SisGov

Construir um motor de simulação em grafos, extensível por dados e capaz de
explicar seus resultados. Sobre essa base, desenvolver um jogo educativo
sobre a esfera federal brasileira.

Este plano organiza capacidades e dependências. Cada etapa será detalhada em
tarefas quando chegar sua vez. Estruturas TypeScript, bibliotecas e assinaturas
de funções serão escolhidas durante a implementação.

## 1. Delimitar o modelo de simulação

Estabelecer o significado das peças que o motor vai manipular.

- Definir o que representam nós, relações, parâmetros e estado da simulação.
- Distinguir valores externos, valores calculados e valores acumulados.
- Estabelecer unidades e separar índices de quantidades reais.
- Delimitar a primeira versão: um grafo numérico pequeno e determinístico.
- Escolher exemplos artificiais com resultados calculáveis à mão para orientar
  a construção e os testes.

**Entrega:** contrato conceitual do motor e exemplos de referência. Não é
necessário escolher os indicadores do país ou a duração de um turno ainda.

## 2. Construir a estrutura do grafo

Criar a base que armazena e permite manipular nós e conexões.

- Representar um grafo dirigido, com identificação estável de seus elementos.
- Permitir cadastrar e consultar nós e conectar nós entre si.
- Consultar entradas, saídas e dependências de um nó.
- Definir edição e remoção, incluindo o tratamento das conexões afetadas.
- Validar duplicidades, referências inexistentes e definições inválidas.
- Identificar ciclos e componentes desconectados. Ciclos podem representar
  feedback legítimo; sua execução será tratada adiante.

**Entrega:** grafo manipulável por código, com integridade verificada. A
validação cobre cadeias, ramificações, ciclos e operações que poderiam deixar
referências quebradas. Ainda não executa cálculos de simulação.

## 3. Tornar o grafo configurável por dados

Permitir montar diferentes modelos usando a mesma estrutura de motor.

- Definir o formato de um modelo e seu estado inicial.
- Carregar uma definição completa usando as operações do grafo.
- Validar conteúdo na entrada, apontando o elemento e a causa de cada erro.
- Separar a definição do modelo dos valores de uma execução.
- Montar dois exemplos pequenos para verificar a independência do motor em
  relação ao conteúdo.

**Entrega:** adicionar nós e relações existentes exige apenas dados. Um novo
mecanismo matemático pode exigir extensão do motor. Tipos TypeScript ajudam no
desenvolvimento; dados carregados também precisam de validação em execução.

## 4. Construir o cálculo das relações

Dar significado matemático às conexões, começando com casos sem ciclos.

- Definir como uma relação transforma entradas em uma contribuição.
- Implementar o primeiro mecanismo de efeito com parâmetros explícitos.
- Definir como múltiplas contribuições se combinam em um nó.
- Diferenciar resultado calculado de variação acumulada.
- Resolver dependências em grafos sem ciclos e informar explicitamente os
  casos ainda não suportados.
- Tratar unidades incompatíveis, valores inválidos e limites de domínio.
- Registrar entradas, contribuições e resultado de cada cálculo.

**Entrega:** avaliação de uma relação, de uma cadeia e de várias relações
convergentes, comparada aos exemplos calculados à mão. A ordem de cadastro
dos nós não altera o resultado.

## 5. Construir a evolução no tempo

Transformar o avaliador em uma simulação com memória e feedback.

- Definir o passo de simulação e a regra de atualização dos valores.
- Separar o estado lido durante um passo do estado produzido por ele.
- Estabelecer como os ciclos funcionam: feedback entre passos ou resolução
  no mesmo passo. Implementar a abordagem escolhida para a versão inicial.
- Introduzir estoques e fluxos, respeitando unidades e conservação quando
  aplicável.
- Adicionar atrasos e, depois, respostas graduais como mecanismos distintos.
- Preservar histórico suficiente para reprodução e explicação.
- Verificar estabilidade, acúmulo, oscilações e entradas extremas. Evitar
  esconder erros apenas limitando todos os valores.

**Entrega:** simulações temporais pequenas e reproduzíveis, incluindo um
ciclo de feedback. O passo técnico ainda não precisa ser o turno do jogo.

## 6. Criar ferramentas para inspecionar o motor

Construir uma bancada de desenvolvimento para observar o modelo.

- Exibir nós, conexões, valores e parâmetros em uma interface simples.
- Permitir avançar, reiniciar e comparar execuções.
- Inspecionar a evolução de um indicador e suas contribuições.
- Alterar parâmetros e comparar o comportamento resultante.
- Acrescentar a visualização gráfica das relações quando ajudar a inspeção.

**Entrega:** bancada React usando o mesmo motor validado nos testes. Um editor
visual completo pode ficar para uma versão futura.

## 7. Construir e validar o primeiro modelo federal

Aplicar o motor a um recorte pequeno do domínio educativo.

- Escolher uma pergunta que o modelo deve ajudar o jogador a compreender.
- Delimitar variáveis, relações e fatores externos necessários para respondê-la.
- Registrar mecanismos, fontes, incertezas e simplificações das relações.
- Traduzir essas relações em equações compatíveis com o motor.
- Calibrar parâmetros quando houver dados adequados e identificar valores
  provisórios explicitamente.
- Comparar cenários de referência e avaliar sensibilidade dos parâmetros.
- Confrontar resultados com evidências independentes quando disponíveis e
  registrar onde o modelo deixa de ser aplicável.

**Entrega:** primeiro modelo federal explicável, com limites documentados.
Testes corretos do software não demonstram, sozinhos, validade científica das
relações representadas.

## 8. Construir a camada de jogo

Introduzir a atuação do jogador sobre o motor e o modelo já validados.

- Escolher o primeiro cargo jogável e verificar suas competências.
- Modelar ações, condições, custos e efeitos sobre a simulação.
- Adicionar o fluxo institucional necessário às ações selecionadas.
- Definir a relação entre decisões, tempo simulado e turnos do jogador.
- Criar a interface de decisão e explicação das consequências.
- Validar um ciclo jogável completo, incluindo recusas, esperas e resultados.

**Entrega:** primeiro recorte jogável federal, sustentado pelo motor e pelas
hipóteses examinadas.

## Evoluções posteriores

Escolher as próximas versões conforme os limites encontrados:

- Relações não lineares, condições e incerteza reproduzível.
- Novos modelos de orçamento, economia, políticas públicas e grupos sociais.
- Mais instituições e cargos federais.
- Persistência de partidas e compatibilidade entre versões de modelos.
- Editor de conteúdo e ferramentas de calibração e comparação de cenários.
- Otimização e Web Workers, caso medições indiquem necessidade.

## Forma de execução

O motor permanece independente de React. Definições do modelo, estado atual e
execução dos cálculos ficam separados, permitindo testar cada parte isoladamente.

Trabalhar uma etapa por vez. Antes de implementá-la, dividir seu escopo em
entregas pequenas, cada uma com resultado observável e verificação pertinente.
Registrar decisões na seção correspondente, sem abrir documentos por padrão.

O desenvolvedor define as tarefas e autoriza quais trechos a IA deve escrever.
A aprovação deste plano não autoriza implementação automática. Conceitos
específicos de TypeScript serão discutidos conforme forem necessários.
