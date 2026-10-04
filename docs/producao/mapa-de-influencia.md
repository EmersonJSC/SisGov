# Regra de experiência: mapa de influência

**Decisão aprovada pelo usuário em 3 de outubro de 2026.**

Este documento define a direção obrigatória da tela principal do SisGov. A
experiência em `mapa-leis.html`, também servida pela rota `/`, é a implementação
de referência; alterações futuras devem preservar esta experiência.

## Esferas dos ministérios

Cada ministério tem uma esfera de influência identificada pelo nome. Suas políticas públicas ficam dentro dela: leis e regras, tributos, serviços, programas e benefícios, conforme o conteúdo do cenário.

No futuro, a esfera também mostrará o rosto do ministro responsável. Nome do ministério e identidade do ministro devem continuar distinguíveis. A presença futura de retratos não implica que a simulação de ministros já esteja implementada.

## Indicadores e situações em torno das influências

Indicadores e situações ficam fora das esferas ministeriais. Representam resultados e condições do país; não pertencem a um ministério.

Eles orbitam visualmente as áreas e políticas que mais os influenciam. “Orbitar” significa disposição espacial por influência, sem exigir animação circular contínua. A distribuição deve ser orgânica, sem grade, tabela ou colunas fixas por tipo. Um elemento influenciado por vários ministérios pode ficar entre suas esferas.

A posição considera as relações e sua relevância, preserva a legibilidade e evita sobreposição. A distância é uma ajuda de leitura, não uma medida numérica exata do efeito. Ligações e detalhes ao selecionar uma bolinha permitem auditar suas causas. A composição deve permanecer estável durante a navegação e passagem de turnos, evitando deslocamentos desnecessários.

## Influência entre ministérios

Uma área de influência pode afetar outra. As relações atravessam as fronteiras das esferas: uma política pode influenciar resultados ligados a outro ministério e se relacionar com outras políticas conforme as regras do cenário.

No mapa, esferas próximas ou parcialmente sobrepostas comunicam que seus ministérios compartilham desafios e políticas. Isso não cria um efeito numérico por si só: as setas e relações declaradas continuam sendo a fonte da consequência. Uma área não é uma ilha nem um contêiner fechado; por exemplo, Educação pode se ligar a Saúde, Trabalho, Desenvolvimento Social e Segurança.

Ministérios organizam a experiência visual; não isolam os cálculos em simulações independentes. As ligações exibidas devem corresponder às relações do conteúdo, sem criar efeitos numéricos apenas por proximidade visual.

## Cor da esfera e aprovação do ministro

**Regra futura aprovada:** a cor da esfera representará a aprovação do ministro pela população.

Essa aprovação é distinta da aprovação geral do governo, da popularidade de uma política e da avaliação de um indicador ou situação. A escala de cores e o cálculo da aprovação ainda serão definidos. As cores temáticas atuais são provisórias e não representam aprovação já calculada.

A informação também deverá ser acessível por texto ou detalhes, sem depender somente da cor. A cor da esfera não substitui a classificação das bolinhas: políticas públicas, indicadores e situações; situações positivas e negativas são avaliações do mesmo tipo.

## Apresentação e interação

A tela é um espaço de jogo centrado no mapa. Manter fundo limpo, controles discretos de turno e um menu compacto. Detalhes aparecem ao selecionar elementos, sem painéis explicativos permanentes sobre o mapa.

Zoom no ponto do cursor e arraste do fundo permitem explorar as relações. Não exibir porcentagem de zoom, botão de enquadramento ou instruções permanentes como “selecione uma política”. Filtros poderão complementar o mapa no futuro; sua lista e comportamento ainda serão definidos.

A bancada técnica continua disponível como tela separada para explicações e inspeção do motor.

## Classes da população e aprovação por política

**Direção aprovada em 3 de outubro de 2026.** O mapa não usará, por enquanto, um painel textual de “país em movimento”, nem listas de percentuais de perfis. Esse painel foi removido por transformar uma leitura de jogo em informação técnica solta.

Quando o eleitorado for implementado, cada classe da população será uma entidade visual do jogo. Classes podem se sobrepor: por exemplo, uma pessoa pode pertencer simultaneamente a uma faixa de renda, região, ocupação e outro grupo social relevante. O modelo não deve pressupor que toda a população cabe em grupos mutuamente exclusivos.

Ao selecionar uma política, o jogo deverá mostrar de forma visual quais classes são afetadas, a aprovação daquela política em cada classe e o sentido ou a intensidade da influência. Assim, a pessoa entende a consequência política de uma decisão sem reduzir a tela a uma tabela de números. A representação exata — retratos, fichas, agrupamentos ou outra linguagem de jogo — será definida quando a mecânica de eleitorado existir.

## Linhas de relação sob demanda

**Regra aprovada em 3 de outubro de 2026:** o mapa não mostra permanentemente todas as linhas de consequência. Ao passar o cursor sobre uma política, indicador ou situação, ou ao dar foco pelo teclado, ele revela as relações diretas daquele elemento. Um clique ou seleção por teclado pode manter essas linhas visíveis enquanto a pessoa lê os detalhes; ao limpar a seleção, o mapa volta a ficar limpo.

Isso preserva o mapa como espaço de jogo e evita uma teia de linhas que esconda as bolinhas. Relações exibidas são sempre as declaradas no conteúdo: a tela não inventa uma ligação por dois elementos estarem próximos. A direção tem seta ou fluxo visual inequívoco da origem para o alvo. Relações de entrada e de saída devem ser distinguíveis nos detalhes por texto, mesmo quando a visualização mostra ambas.

### Sentido não é julgamento de valor

Cada relação declara o seu **sentido numérico**: ela aumenta ou reduz o valor do alvo. A linha usa verde com `↑` para aumento e vermelho com `↓` para redução. Essas cores não querem dizer “bom” e “ruim”. Elas respondem somente ao que acontece com o número do alvo.

O próprio indicador declara separadamente qual direção representa melhora no contexto do jogo. Esse texto aparece no foco ou nos detalhes, junto com unidade e explicação da relação:

| Relação                                             | Linha        | Leitura do alvo                  | Resultado que a pessoa entende                                            |
| --------------------------------------------------- | ------------ | -------------------------------- | ------------------------------------------------------------------------- |
| Prevenção da violência → violência letal            | vermelho `↓` | “menor violência letal é melhor” | A política reduz a taxa; o efeito é favorável apesar da linha vermelha.   |
| Cooperação em segurança → cobertura de policiamento | verde `↑`    | “maior cobertura é melhor”       | A política eleva a cobertura; o efeito é favorável.                       |
| Aumento de demanda → pressão hospitalar             | verde `↑`    | “menor pressão é melhor”         | A demanda eleva a pressão; o efeito é desfavorável apesar da linha verde. |

Portanto, a interface não deve tentar deduzir benefício por cor. Se uma variável não tiver direção de melhoria definida, ela mostra apenas “aumenta” ou “reduz”, sem selo de benefício ou prejuízo. A futura aprovação do ministro também permanece uma informação diferente.

### Força e animação do fluxo

A linha informa a **força de modificação** declarada para aquela relação, usando rótulo textual como `fraca`, `média` ou `forte` e, quando a pessoa abre o detalhe, o parâmetro e sua procedência. A espessura pode reforçar essa leitura dentro de limites de legibilidade.

Pequenos pulsos animados percorrem a seta da origem ao alvo. Quanto maior a influência efetiva no estado atual, maior a velocidade dos pulsos. Isso comunica intensidade visual, não tempo de implantação, velocidade real de execução nem certeza de que o efeito já chegou ao alvo. Uma relação ativa de intensidade zero fica sem pulsos; uma relação atrasada ou em implantação informa esse estado no detalhe, em vez de fingir influência instantânea.

Com `prefers-reduced-motion`, os pulsos são substituídos por seta, espessura e o rótulo de força estáticos. Hover não é a única forma de acesso: foco por teclado e detalhes textuais oferecem a mesma informação.

## Tempo das consequências

O nível desejado pelo jogador e o nível em funcionamento são estados diferentes. Implantar e degradar uma política podem ter ritmos próprios; consequências também podem ter atraso. Reduzir uma política não apaga instantaneamente suas estruturas ou efeitos acumulados.

Os prazos do protótipo são parâmetros demonstrativos. Não equivalem automaticamente a semanas ou meses, nem a estimativas empíricas de políticas reais.

## Tamanho como influência atual

**Regra aprovada em 3 de outubro de 2026:** no filtro padrão de influência, o tamanho das bolhas muda conforme a influência que está efetivamente ativa no turno. Não basta uma relação existir no conteúdo: a intensidade depende do nível em funcionamento da política ou variável de origem. Ao avançar um turno, a bolha da política e as bolhas alcançadas por suas consequências crescem ou encolhem com transição visual. A disposição também é recalculada: relações ativas aproximam visualmente os elementos e as esferas ministeriais se ajustam ao peso atual de suas políticas. A tela anima a passagem entre posição e tamanho anteriores e novos, sem mudar os valores calculados pelo motor.

Uma decisão apenas preparada continua sendo uma meta. Ela não infla a bolha antes da implantação gradual entrar em funcionamento. Ao adicionar, remover ou alterar uma política no conteúdo de um cenário, o mapa recalcula tamanhos e distribuição a partir das relações resultantes; essa alteração de conteúdo não modifica por si só os valores do motor.

## Estado do trabalho

- Protótipo disponível: esferas com nomes, políticas internas, resultados externos distribuídos pelas ligações de influência, zoom, arraste e interface mínima.
- Direção futura aprovada: rosto do ministro e cor da esfera por aprovação popular do ministro.
- Direção futura aprovada: linhas apenas sob foco/seleção, sinal numérico explícito, leitura de melhoria separada e fluxo animado por força efetiva.
- A detalhar: cálculo e escala visual da aprovação, filtros, evolução da representação dos ministros e os campos de conteúdo para direção de melhoria e força visual.

## Critérios para revisar mudanças na tela

1. Cada esfera identifica o ministério e reúne suas políticas.
2. Indicadores e situações permanecem fora das esferas e próximos das influências relevantes.
3. As relações podem atravessar áreas e continuam auditáveis.
4. A distribuição evita a aparência de tabela e mantém legibilidade.
5. A interface privilegia o mapa; informações adicionais aparecem sob demanda.
6. Retratos e aprovação ministerial são tratados como evolução futura até sua implementação e validação.
7. Linhas de relação aparecem sob hover, foco ou seleção, com origem e alvo claros.
8. Aumento/redução do alvo e benefício/prejuízo permanecem informações diferentes; cor sozinha não dá o veredito.
9. A animação de fluxo representa força atual e respeita redução de movimento.

## Fase 6.5 — mini motor visual implementado

O mapa passou a usar um contrato visual separado do conteúdo calculado pelo
motor. Esse contrato declara macroáreas, ministérios, abreviações, influência
visual mínima, cores e uma semente de organização. Nenhum desses dados muda
variáveis, consequências ou o estado de uma execução.

A hierarquia visual é **Governo → macroárea → ministério → política**. O Governo
é uma referência discreta no centro. Macroáreas criam grandes campos coloridos;
os ministérios se acomodam dentro deles, e suas políticas são atraídas pelo
responsável principal. Colisão evita a aparência de tabela. Relações declaradas
no cenário funcionam como molas leves: uma política ligada a um resultado
externo aproxima-se da borda relevante, e ministérios que alcançam resultados
comuns podem se aproximar sem perder seus agrupamentos.

### Espaço navegável e raio de exclusão

O mapa é um mundo navegável, não uma composição obrigada a caber no centro da
tela. O enquadramento inicial mostra o conjunto, mas cada área possui espaço
para ser explorada com zoom e deslocamento. A câmera pode continuar se movendo
sem transformar a borda da tela em limite para a física.

Toda política reserva seu raio visual mais uma margem de exclusão configurável.
A física pode aproximar duas políticas, mas uma projeção rígida final impede
qualquer sobreposição. Ministérios seguem a mesma regra: a distância mínima
entre seus centros considera o raio completo das duas esferas e uma margem. Se
uma política relacionada ocupa a região entre dois ministérios, o mapa aumenta
o espaço compartilhado; não comprime as três estruturas para caber numa área
fixa. Macroáreas podem se tocar visualmente, mas não anulam a área exclusiva de
suas políticas e ministérios.

Indicadores e situações não pertencem às regiões ministeriais. Eles ficam fora
delas e próximos das relações que os alimentam. As fronteiras são elásticas e
podem se sobrepor para comunicar competências compartilhadas. A mesma entrada e
a mesma semente geram a mesma fotografia do mapa; após o assentamento, uma
órbita mínima dá vida às políticas e é desativada quando o sistema solicita
redução de movimento.

O laboratório de referência aplica essa organização às políticas importadas em
quatro macroáreas e sete ministérios. Ele preserva a bancada técnica em
`motor-demo.html`. Popularidade ministerial, capacidade administrativa,
transferência de políticas e prioridades do Governo continuam adiadas: a
física atual explica relações existentes, mas não cria regras políticas.

## Ajuste de direção: tamanho por filtro e símbolos visuais

**Decisão do usuário registrada em 3 de outubro de 2026, antes do SG051.**

As bolhas não terão tamanho uniforme. O filtro ativo determina o significado do tamanho; na visualização padrão, o critério é influência. Essa regra abrange os nós e a leitura das esferas ministeriais: a esfera agrega a relevância de suas políticas, mantendo espaço suficiente para acomodá-las. A fórmula de agregação ainda precisa ser definida e evitar dupla contagem de efeitos indiretos.

Políticas serão reconhecidas por ícones ou referências visuais dentro das bolinhas, sem nome da lei permanentemente escrito nelas. O nome permanece disponível ao passar o cursor, focar com teclado ou abrir os detalhes, além do rótulo acessível. Um símbolo deve representar a ação ou serviço de forma reconhecível; políticas diferentes não devem se tornar indistinguíveis por usarem o mesmo desenho.

### Pesquisa de referência

A [página oficial do Democracy 4](https://positech.co.uk/democracy4/index.html), consultada nesta data, informa que os ícones mudam de tamanho para mostrar popularidade, finanças, influência ou valores. Não especifica ali a fórmula de dimensionamento ou de agregação; não assumir que influência seja somente quantidade de ligações.

A [documentação oficial de indicadores](https://www.positech.co.uk/democracy4/mod_simulation.html) descreve um ícone central em SVG e a aplicação separada do círculo azul pelo jogo. Essa separação entre símbolo e aparência do nó é adequada ao SisGov.

### Adaptação proposta, ainda a detalhar

- Influência (padrão): relevância das relações, considerando intensidade e alcance; normalizar escalas diferentes antes de comparar.
- Finanças: tamanho por despesa ou receita, com distinção explícita entre as duas. Não tratar indicador sem valor financeiro como despesa zero.
- Popularidade: usar a opinião medida para o objeto aplicável; aprovação do ministro e popularidade da política continuam distintas.
- Valores: usar escala declarada de cada indicador ou nível de implantação. Não comparar diretamente reais, percentuais e contagens.

Ausência de métrica não equivale a zero. Definir representação neutra para itens não aplicáveis, tamanhos mínimos legíveis e limites visuais máximos. Alterar o filtro não deve recalcular a simulação ou reorganizar desnecessariamente todo o mapa. A cor futura da esfera ministerial continua reservada à aprovação popular do ministro.

### Opção econômica de arte

Recomendação: reutilizar ícones SVG de uma biblioteca como Lucide, com símbolos adicionais simples quando necessário. A [licença oficial](https://lucide.dev/license) permite uso gratuito inclusive comercial, preservando os avisos aplicáveis (ISC e MIT nos ícones derivados). Usar arquivos locais ou importar somente os símbolos utilizados, sem serviço pago nem requisição externa para cada ícone.

Exemplos de linguagem visual: estetoscópio para atenção básica, escudo com pessoa para proteção, rede de escudos para cooperação em segurança e câmera para câmeras corporais. Esses exemplos são propostas de arte; não são arquivos já produzidos.

Este registro documenta a regra e a pesquisa. Seleção dos filtros definitivos, métrica de influência e substituição visual no código permanecem a implementar.

### Ícones implementados no protótipo

As cinco políticas de `brasil-basico` agora usam SVGs locais do Lucide, escolhidos pelo campo opcional `icone` no JSON. Nome no hover e foco, identificação acessível e detalhes no clique; o nível implantado permanece visível. Indicadores e situações preservam seus rótulos. A biblioteca local possui símbolo genérico de reserva e licença em `src/assets/svg/LICENSE-Lucide.txt`.

**Atualização de protótipo em 3 de outubro de 2026:** o tamanho padrão das bolhas passou a usar influência, e não o valor atual da política. A medida soma a força declarada das relações diretas que saem e chegam ao nó, normalizada para manter bolhas legíveis. Mudar uma verba não infla automaticamente sua bolha; ela muda a consequência, enquanto o filtro de influência comunica relevância estrutural no mapa. Outros filtros continuam pendentes.

### Decisões concretas, não percentuais genéricos

O protótipo `brasil-basico` não apresenta mais leis existentes como “50% implementadas”. Políticas de serviço ou programa usam valores monetários anuais do envelope do cenário: atenção básica, imunização, proteção às mulheres e prevenção em segurança. A legislação continua como referência e base institucional; o jogador muda a execução financiada.

Regulamentações podem usar escolhas discretas em vez de dinheiro. No exemplo de câmeras corporais, as opções são sem diretriz nacional, projetos-piloto, unidades prioritárias, ocorrências definidas e uso obrigatório. O JSON declara essas opções junto do controle, sem criar uma tela específica para cada política. A transição entre o alcance desejado e o alcance em funcionamento ainda pode ser gradual, pois regulamentar e pôr em prática são momentos diferentes.

### Acervo próprio de SVGs

A pasta `src/assets/svg/` é o acervo do projeto e aceita desenhos feitos pelo usuário, por IA ou por artistas. Lucide é somente a origem provisória dos primeiros símbolos, não uma dependência obrigatória do formato. Novos arquivos são descobertos automaticamente, inclusive em subpastas; `icone` referencia o caminho relativo sem `.svg`. Instruções em `src/assets/svg/README.md`.

## Proporção e filtros implementados — 3 de outubro de 2026

O mapa em `mapa-leis.html` usa dois filtros, selecionados por um componente
React: **Influência** e **Financeiro**. A métrica e a geometria ficam em módulos
independentes da execução da simulação. A tela principal antiga (`GameMap`) não
é mais a tela inicial; a experiência de mapa navegável descrita aqui foi
promovida para a rota principal.

- Diâmetro no mundo: `d = sqrt(44² + t × (112² − 44²))`, com
  `t = clamp(métrica / máximo, 0, 1)`. Assim, o acréscimo de área é proporcional
  ao valor e o diâmetro fica entre 44 e 112 pixels antes do zoom.
- Políticas compartilham uma escala; indicadores agregados compartilham outra.
  Isso evita que o orçamento total torne todas as políticas quase invisíveis.
  Dentro de cada conjunto, valores iguais recebem tamanhos iguais.
- Influência: soma dos módulos das contribuições afins diretas, divididas pela
  amplitude declarada do indicador de destino. Usa o nível em funcionamento,
  não decisões preparadas. Destinos sem amplitude finita ficam fora dessa
  medida; valores monetários não são somados diretamente a índices.
- Essa influência é uma estimativa no nível atual. Ainda não desconta atrasos
  de entrega nem mede os efeitos realizados do histórico. Eventos, dilemas e
  consequências condicionais de situações não entram nessa estimativa.
- Financeiro: volume bruto de receitas e despesas diretas na unidade monetária
  suportada pelo cenário, sem somar novamente a consequência de saldo.
  `financialTargets` declara os alvos de receita, despesa e saldo no contrato
  visual. Quando não há alvos fiscais declarados, controles de orçamento
  monetário oferecem a referência de valor. Indicadores sem métrica financeira
  ficam neutros, tracejados e identificados como indisponíveis; ausência não é zero.
- Setas `↑` e `↓` junto ao valor distinguem receita e despesa. Uma política com
  ambos considera a soma dos volumes, não o saldo líquido.
- A colisão reserva o maior raio necessário entre os dois filtros, usando a
  mesma conversão do desenho: 16 pixels por unidade do mapa. Trocar de filtro
  mantém posições e câmera. O próximo turno pode atualizar a distribuição.
- Esferas ministeriais acompanham a extensão ocupada pelas políticas, com
  margem de 2,4 unidades e mínimo configurado. Não recebem um segundo aumento
  arbitrário pela contagem ou influência. Resultados externos são separados
  também entre si depois de serem afastados das esferas.
- O zoom inicial preserva legibilidade com escala mínima de 0,65; mapas extensos
  podem ultrapassar a janela e são explorados com arraste e zoom.

O laboratório de cem políticas agora possui cinco faixas **fictícias** de verba
e força de efeito para exercitar os filtros. Os itens classificados como imposto
no laboratório alimentam a receita e contribuem positivamente para o saldo.
Isso é material de demonstração, não calibração econômica ou reprodução dos
coeficientes de Democracy 4. Pacotes de cenário reais não foram recalibrados.
