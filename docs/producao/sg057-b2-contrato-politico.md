# SG057-B2 — contrato político da V1

Estado: contrato genérico aceito no recorte documental em 8 de outubro de 2026,
após SG057-B1. Isso não conclui implementação, integração nem funcionamento
em tela. O motor
recebe entidades, relações e parâmetros dos JSONs e executa mecanismos genéricos.
Valores, listas concretas e balanceamento pertencem ao conteúdo dos países e
leis; os formatos finais de arquivo e a execução pertencem aos chamados
SG098/099, SG058/059 e SG061. As propostas antigas
abaixo são referências de design, não decisões automaticamente aprovadas.

**Limite do SG057-B2:** fechar somente o contrato genérico de lei como decisão
política, suas dependências, exclusões, pré-requisitos de mudança, autorização
e transição de estado. O motor valida e executa; a definição de cada lei e o
estado inicial do país ficam nos JSONs. Fórmulas, quóruns, listas de cargos,
efeitos e valores concretos descritos adiante são exemplos de conteúdo ou
decisões já tomadas para o cenário inicial, não uma lista de regras universais
a aprovar neste chamado. Propostas opcionais não bloqueiam seu aceite.

### Aceite documental do contrato genérico

- Um catálogo de definições de leis é compartilhado entre países; cada país
  declara separadamente quais começam vigentes e com que valores. Lei ausente
  inicialmente continua elegível para proposta se cumprir os requisitos.
- Lei pode exigir outra lei vigente, excluir lei incompatível e declarar
  mecanismo/efeitos. O motor resolve referências e rejeita dependência quebrada
  ou duas leis incompatíveis vigentes juntas.
- Lei ordinária não altera proteção constitucional por atalho. Reforma consulta
  o processo constitucional vigente; substituição de leis deve ser atômica e
  preservar o histórico. Ruptura é caminho distinto, com requisitos declarados.
- Índices e situações são entidades próprias; as relações de conteúdo ligam
  leis a seus efeitos e resultados, sem nomes especiais de país no motor.
- A pesquisa SG057-B1 sustenta a separação entre efeitos materiais, opinião e
  voto, e a arquitetura de influências por conteúdo. Ela não fornece fórmula
  eleitoral universal; fórmulas e coeficientes não foram importados como regra.

O contrato de referência é [motor, leis e países em JSON](../arquitetura/contrato-motor-json.md).
SG098/099 criam esquemas e estado; SG058/059 implementam mecanismos e
autorização; SG061 integra. Os exemplos detalhados abaixo continuam sendo
conteúdo inicial ou propostas de design, não pré-requisitos retroativos do B2.

Correção do usuário: o motor gera personagens para esta partida e esta época.
Cada partido escolhe, entre os personagens disponíveis, quem concorre a
presidente e vice. O jogador é o chefe do seu partido e faz essas duas escolhas
na interface. Os outros partidos fazem as próprias escolhas pelo motor e
concorrem. Quando o partido do jogador vence, ele escolhe os ministros entre
os personagens disponíveis e elegíveis. Não há etapa adicional de indicação
de listas. Quando uma instituição
exigir escolha de juízes, aplicar a mesma operação genérica de seleção por
autoridade e elegibilidade, sem um sistema paralelo de nomeações na V1.

## Regras já confirmadas

### Fórmulas eleitorais configuráveis — direção confirmada

Regra-mãe desta especificação: as escolhas políticas mutáveis são leis. O JSON
da lei define o que ela permite, exige, bloqueia e altera; o catálogo de leis
é comum e o JSON do país, separado, escolhe apenas seu estado inicial. A ausência
inicial de uma lei não impede que o jogador a proponha depois, sujeito aos
requisitos declarados. Índices e situações
são entidades próprias afetadas ou consultadas por leis, não leis disfarçadas.
Perguntas como “há segundo turno?” devem ser respondidas lendo a lei eleitoral
vigente e a configuração do país, não por uma constante do motor.

Assim como a organização política, a fórmula eleitoral não é uma constante
brasileira do motor. Ela é declarada por uma **lei constitucional**: a lei
indica a eleição afetada, o mecanismo de apuração suportado pelo motor e seus
parâmetros. O país escolhe quais leis constitucionais estão vigentes ao iniciar
a partida. Para cada eleição e alcance, só pode existir uma regra de apuração
vigente; leis incompatíveis não coexistem nem se sobrepõem. Uma reforma
constitucional substitui a lei anterior por outra de forma atômica, sujeita
ao processo constitucional, e passa a valer para eleições futuras. Os
resultados já apurados permanecem no histórico.

Para o primeiro cenário brasileiro, turno único presidencial, maior total
nacional e apuração senatorial por UF são configurações de partida propostas
nos documentos atuais. Só passam a ser regras executáveis quando estiverem nas
leis JSON vigentes referenciadas pelo país. Outro país, ou uma mudança
constitucional durante a partida, pode selecionar outra lei suportada. A forma
exata das leis, os nomes dos mecanismos e a validação de exclusividade e
compatibilidade ficam para SG098/099; SG058-B implementa e testa o despacho
da apuração. Um JSON pode selecionar e parametrizar mecanismo suportado, mas
não executar uma fórmula arbitrária nem tornar uma eleição ativa sem
instituição correspondente. Na interface, essas leis ficam na bolha da
Constituição, dentro da esfera federal, e não entre índices ou situações.

Arquitetura confirmada: [conteúdo configurável por JSON](../arquitetura/conteudo-configuravel-json.md).
Grupos de interesse são entidades extensíveis e podem se sobrepor; não confundir
grupo com parcela populacional, nem contar a mesma pessoa várias vezes na eleição.
Confirmado pelo usuário: cada parcela tem associações a vários grupos e pesos
de importância declarados em JSON; o motor combina suas influências sem duplicar
o peso eleitoral da parcela. Nenhum grupo determina sozinho sua preferência.
A normalização e os casos de pesos ausentes/zerados estão especificados abaixo
como definição técnica desta etapa; não são regras atribuídas ao Democracy 4.
As demais decisões pendentes desta minuta continuam separadas.

- Cenário fornece preferências iniciais por grupo; políticas declaram os grupos
  afetados e variações em pontos percentuais quando seus efeitos chegam.
- Preferência partidária, aprovação da medida e bem-estar são grandezas separadas.
  O mesmo benefício não recebe duas contribuições sem causas distintas declaradas.
- Efeitos simultâneos são somados; apoio da coalizão limitado a 0–100%; distribuição
  proporcional dentro de cada lado. Interesses sobrepostos não duplicam pessoas.
- Presidência em turno único por maior votação nacional; Senado por UF com três
  cadeiras, oito anos de mandato e renovação alternada de duas/uma vaga.
- D20 apenas em empate eleitoral; repetir entre os maiores empatados se necessário.
- Votação ordinária exige maioria absoluta das cadeiras; constitucional exige 60%
  em cada uma de duas votações gerais simplificadas no mesmo fechamento.
- Composição anterior vota antes da renovação; novos eleitos atuam no turno seguinte.
- Reforma constitucional e ruptura são caminhos distintos. Ruptura exige apoio dos
  três comandantes OU do Judiciário institucional, não de parlamentares.
- Ministro da Defesa alinhado consulta o presidente em eventos de nomeação; sua
  preferência influencia, mas não garante, a escolha.
- País, organizações reutilizáveis e políticas ficam separados no conteúdo;
  regime é inferido das instituições vigentes, não escolhido por rótulo.

## Combinação das influências dos grupos — contrato técnico

Definição de implementação para SG058-A: média ponderada normalizada, identificada
no conteúdo como mecanismo `media_ponderada`. Não é uma implementação existente
no carregador, nem significa que qualquer nome de mecanismo será aceito por JSON.

Para uma parcela p, cada associação a grupo g declara peso finito w ≥ 0. A soma W
inclui todos os seus pesos, não apenas grupos afetados pela política atual. Para
W > 0, a contribuição da relação e dirigida a g é `w / W × efeito_e`, em pontos
percentuais. Somar contribuições identificadas por origem antes de limitar o apoio.
Grupo não afetado tem reação zero, mas seu peso continua no denominador; do
contrário, uma política dirigida a um interesse secundário ganharia peso total.

A normalização ocorre entre interesses da mesma parcela, não entre políticas.
Adicionar uma relação de efeito não reduz artificialmente as outras. Efeitos
de relações distintas somam quando representam causas distintas; uma mesma
relação só pode produzir uma contribuição ativa por uso e alvo.

Exemplo sintético: uma parcela tem motoristas com peso 3 e jovens com peso 1.
Reação de +4 pp em motoristas e −2 pp em jovens produz `(3×4 + 1×−2)/4 = +2,5 pp`.
Base 40 passa a 42,5, sem novo acréscimo por manter o efeito no mês seguinte.
Se só motoristas reagirem, a contribuição é +3 pp, não +4. Pesos 30 e 10 dão o
mesmo resultado que 3 e 1. Uma parcela que representa 100 pessoas continua
representando 100 pessoas, independentemente dessas associações.

### Ausências, zeros e erros

- Associação presente sem peso: erro de conteúdo; não presumir peso 1.
- Grupo ausente da lista: nenhuma associação, sem influência automática.
- Peso zero: associação sem influência política nesse cálculo.
- Lista explicitamente vazia ou todos os pesos zero: contribuição dos grupos
  igual a zero, preservando preferência-base. Emitir aviso de configuração;
  isso não remove a parcela do eleitorado nem escolhe um partido por ela.
- Lista de associações ausente: erro de esquema, para distinguir omissão de vazio.
- Peso negativo, não finito, grupo inexistente ou ID repetido na lista: erro
  antes de iniciar a partida, com arquivo/campo/motivo.
- Calcular proporções com proteção contra estouro numérico; pesos finitos muito
  grandes não podem gerar NaN. Resultado deve ser independente da ordem dos IDs.

Usar uma única preferência-base partidária por parcela na execução. Preferências
de grupo do cenário são insumos de inicialização: combiná-las com os mesmos pesos,
partido por partido, e não somá-las novamente durante cada mês. Sem pesos positivos,
o cenário deve fornecer base explícita; se ambas as fontes forem fornecidas, o
contrato do cenário exige escolha explícita da origem, sem precedência silenciosa.
Vetores de preferência têm partidos válidos, parcelas não negativas e soma 100%.

Saturação em 0–100 ocorre após somar as contribuições, preservando base e parcelas
antes do limite para permitir retirada reversível. A redistribuição entre partidos
é etapa posterior, distinta da média de interesses; seus casos extremos continuam
no FIX-V1-06. Bem-estar e aprovação não entram nessa média como se fossem pp de
preferência: cada relação deve declarar sua grandeza e conversão suportada.

### Aceites para implementação e exemplos do manual

SG058-A deve demonstrar o exemplo 3/1, escala 30/10 equivalente, grupo não afetado
no denominador, pesos zerados, lista vazia, rejeição de dados inválidos, ordem
independente, soma de causas distintas e retirada de uma única contribuição.
SG099 valida e inicializa associações/base; SG081/082 preservam contribuições.
O manual de mods deverá usar esses mesmos exemplos. Este incremento apenas
especifica o contrato; não altera o motor nem conclui SG057-B2 inteiro.

## Decisão 1 — duração do apoio político

Direção autorizada após a pesquisa: continuar com a arquitetura de influências
do Democracy 4 como referência, adaptada ao motor orientado por JSON do SisGov.
Isso não aprova automaticamente as propostas eleitorais e institucionais das
decisões 2 e 3, nem inclui complacência ou eleitores individuais na V1.

### Contrato de influências para SG058-A

O conteúdo declara relações com identidade estável, origem, alvo, grandeza,
mecanismo, parâmetros e comportamento temporal. A origem pode ser política ou
indicador; o alvo político é um grupo. O motor não conhece nomes específicos
de países, partidos ou políticas para decidir a fórmula.

Separar duas rotas configuráveis:

- Política → grupo: reação à medida, calculada a partir da intensidade efetiva.
- Política → indicador → grupo: reação aos resultados observados; não recebe
  novamente o fator de implantação da política quando o indicador já o incorpora.

Cada relação declara se altera bem-estar, aprovação da medida ou preferência
política. Não existe conversão automática de toda melhora material em votos.
Para a regra já aprovada de apoio à coalizão, a saída usa pontos percentuais e
entra na composição de apoio; não é incremento mensal sobre o apoio anterior.

Exemplo sintético: base 40, contribuição direta +2 e contribuição por resultado
+3 produzem 45. Três meses com os mesmos efeitos mantêm 45, não 55. Se apenas
a contribuição direta desaparecer, permanece 43 enquanto o resultado persistir.
As duas parcelas só coexistem quando o conteúdo declara causas distintas.

Implantação, atraso e suavização são conceitos separados. A V1 reutiliza a
implantação mensal e o atraso explícito existentes. A média móvel descrita pelo
D4 não está implementada; não tratá-la como sinônimo do nosso atraso. Se for
adotada depois, será um mecanismo temporal próprio, com janela declarada em JSON.

O estado mantém contribuições por relação antes da saturação e registra a memória
necessária para restaurar a partida. O diário explica origem, valor, unidade e
momento do efeito. Para herança inicial, definir uma representação única no
esquema antes da implementação, evitando somar efeitos já incluídos no cenário.

Aceites de implementação: trocar IDs ou país sem alterar algoritmo; adicionar
uma relação por JSON; rejeitar referência/unidade/mecanismo desconhecido; conservar
apoio com efeitos estáveis; retirar só a contribuição encerrada; reproduzir o
resultado após salvar/restaurar. A validação do pacote ocorre antes de iniciar
a partida. JSON escolhe mecanismos suportados, não executa código arbitrário.

Este contrato é documentação para SG058-A. Não constitui implementação do cálculo
político nem aprovação dos detalhes pendentes de redistribuição abaixo.

Confirmação parcial do usuário: apoio acompanha o efeito efetivo, não acumula
o mesmo bônus todo mês e diminui quando esse efeito desaparece. A implementação
deve ser genérica e configurada por JSONs. Isso ainda é contrato documentado,
não cálculo político implementado. Ver [pesquisa sobre D4](pesquisa-democracy4-efeitos-apoio.md).
Os detalhes adicionais abaixo permanecem propostas onde não confirmados.

Proposta: uma contribuição persistente acompanha a intensidade efetiva da política,
com atraso declarado, sem acrescentar o mesmo bônus a cada mês. Revogação retira
essa contribuição conforme a política perde efeito. Ocorrências únicas registram
consumo por ID e não recebem recompensa novamente por recarregar ou reativar.

Guardar base e contribuições separadas antes do limite: base 99 + efeito 2 mostra
100; retirar o efeito mostra 99. Base 40 + efeito 2 mostra 42 nos três meses,
não 46. Na partida herdada, declarar se o apoio inicial já inclui cada efeito e
reconciliar a base uma vez, sem conceder bônus inicial duplicado.

Quando um lado soma zero, usar pesos de referência declarados pelo cenário entre
partidos elegíveis; sem pesos positivos, distribuição uniforme entre os elegíveis.
Sem destinatários elegíveis, bloquear a transferência com diagnóstico, nunca
dividir por zero ou conceder apoio a partido inelegível. Mudanças de coalizão
exigem rebaseamento preservando o apoio existente, não novos bônus de políticas.

## Decisão 2 — representação eleitoral e parlamentar simplificada

Confirmado: cada partido escolhe sua chapa com personagens gerados nesta partida.
O apoio eleitoral a uma candidatura fica registrado no estado da eleição; o JSON
declara regras de seleção e elegibilidade, não uma lista fixa de candidatos.
Aliados só
somam votos quando apoiam explicitamente a mesma candidatura. Apoios 30/25/45
produzem 55 contra 45 com candidatura conjunta, ou vitória de 45 com candidaturas
separadas. Senado continua apurado por partido, não por candidatura presidencial.
Na V1, a transferência à candidatura apoiada é integral; não simular fidelidade
parcial. Aliança de governo não implica apoio eleitoral automaticamente.

### Personagens e escolha de governo — V1 confirmada

O usuário incluiu na V1 a escolha de presidente, vice e ministros, aceitando
um recorte limitado. Esta decisão substitui a exclusão anterior de candidatos
presidenciais individuais e de qualquer escolha individual do gabinete. Não
altera a apuração do Senado por partido, sem personagens senatoriais obrigatórios.

Conteúdo: parâmetros de geração e catálogo separado de histórias em JSON.
O personagem é gerado com ID, nome, partido, preferências e referências de
apoio/rejeição; depois recebe uma história compatível. Partidos e cargos usam
IDs, não nomes codificados no motor. Ministério e critérios de elegibilidade
também pertencem ao conteúdo; não pressupor uma lista fixa exclusiva do Brasil.
Separar texto biográfico de parâmetros com efeito mecânico: o motor não interpreta
texto livre para inventar bônus. Distinguir apoios de grupos, personagens e partidos
com referências tipadas, sem confundi-los com votos já transferidos.

O jogador seleciona titular e vice entre personagens elegíveis do universo gerado
para a partida. Depois da vitória, escolhe ocupantes dos ministérios disponíveis.
Vice pode ser do próprio partido ou de partido
aliado; a escolha pode influenciar a aceitação de uma coligação, sem garanti-la.
Apoio eleitoral é registrado explicitamente antes de somar votos. A transferência
integral é aplicada uma única vez por partido à chapa, não uma vez ao presidente
e outra ao vice. Escolher ministro aliado não transfere votos automaticamente.

Limite: fichas e seleção, não simulação completa de carreira, primárias ou
negociação livre. Geração aleatória limitada segue a direção abaixo, sem exigir
geração de histórias por IA. O ministro da Defesa escolhido deve ser o mesmo
personagem cujo apoio entra nos eventos institucionais já previstos, sem criar
um segundo ministro abstrato com estado incompatível.

Confirmado pelo usuário após esclarecimento: antes de cada eleição, o jogador
escolhe a chapa de presidente e vice de seu partido; vencendo, escolhe ministros
e pode
substituí-los. Consequências de uma substituição existem apenas quando declaradas
nos JSONs. Não impor custo, punição, desgaste ou perda automática de aliado como
regra universal. Esta decisão não exige negociação complexa.

Confirmado: presidente, vice e cada ministro são pessoas distintas na V1, sem
acumulação desses cargos; restrições declaradas no JSON da organização política.
Critérios concretos de elegibilidade e opções disponíveis são dados do cenário
e serão validados ao implementar a ação genérica de escolha em SG058/059.
O prazo do primeiro cenário foi confirmado em três meses antes da eleição. Trocas seguem
o limite e as consequências públicas confirmados abaixo.
Aceitação de coligação segue a regra confirmada abaixo; escalas, pesos e limiares
específicos são parâmetros de conteúdo, não números aprovados implicitamente.

Chamados e aceites:

- SG098/099: definições de personagem/partido/cargo separadas da chapa e dos
  ocupantes atuais; validar referências e disponibilidade.
- SG058-B / FIX-V1-05: seleção da chapa e apoio partidário explícito, exemplo
  30+25 contra 45, sem duplicar votos por personagem ou cargo.
- SG058/059 / FIX-V1-09: nomeação e substituição de ministros durante o mandato,
  com requisitos e consequências declarados no conteúdo. Testar troca sem efeito
  configurado e troca com efeito explícito, aplicado uma única vez; ação inválida
  não altera ocupante nem aplica consequências.
- SG071: fichas de candidatos e seleção da chapa; SG069: escolha e explicação
  dos ministros, com nomes ligados às entidades exibidas no mapa.
- SG081/082: salvar chapa, ocupantes e apoios; restaurar sem renomear, trocar
  pessoas ou reaplicar efeitos de nomeação.

Aceite transversal: adicionar uma história por JSON e permitir sua seleção para
personagens compatíveis sem alterar código; personagens gerados podem ser
selecionados se elegíveis, com história e preferências visíveis antes da escolha.
Nenhuma dessas telas ou regras é declarada implementada por esta atualização.

### Aceitação de coligações — regra confirmada

Cada partido avalia a chapa completa de presidente e vice. A avaliação combina
compatibilidade de ideias, apoio/rejeição aos personagens e interesse em ocupar
a vice-presidência, com parâmetros e limiar definidos nos JSONs. Na V1 não há
sorteio nessa avaliação. Atingir ou superar o mínimo permite a aceitação;
ficar abaixo resulta em recusa. O motor deve explicar a contribuição de cada
fator, sem inferir preferências a partir de texto biográfico.

Um vice próximo de um partido pode compensar rejeição ao titular, mas não garante
aliança por si só. Os coeficientes determinam o resultado, sem bônus oculto ou
tratamento exclusivo de um personagem. A tela distingue avaliação/possibilidade
de apoio do vínculo eleitoral efetivamente confirmado. Simular uma combinação
de candidatos não registra apoio nem transfere votos.

Depois da aceitação confirmada, a transferência eleitoral é integral e única
para a chapa apoiada, conforme a regra anterior. Isso não concede votos certos
em propostas parlamentares nem torna o partido automaticamente membro da base
de governo. Senado continua com apuração partidária separada.

SG058-B / FIX-V1-05 implementa a avaliação e o vínculo; SG059 valida referências
e dados; SG071 apresenta fatores, limiar e resultado; SG081/082 preservam o apoio
confirmado. Aceites: abaixo/no/acima do limiar; troca de vice que muda o resultado
e outra que não basta; avaliação repetida sem sorteio ou mutação; votos somados
uma única vez; apoio eleitoral sem aprovação parlamentar automática.

### Prazo e consequências de trocar a chapa — confirmado

O jogador pode alterar presidente ou vice durante a campanha apenas até um
limite anterior à eleição, declarado no JSON do calendário. Depois desse limite,
a alteração ordinária fica bloqueada; não esperar o instante da apuração para
travar a chapa. Confirmado pelo usuário: no primeiro cenário, fechar a chapa
três meses (um turno político) antes da eleição. O valor pertence ao JSON do
calendário, não a uma constante universal do motor.

Fronteira operacional: `mesFechamento = mesEleicao - antecedenciaMeses`.
Alterações são permitidas enquanto o mês absoluto atual for menor que o mês de
fechamento; ao alcançá-lo, a chapa fica travada. No mandato padrão iniciado no
mês 0, eleição no mês 48 significa fechamento no mês 45: após concluir o turno
15, não se altera a chapa durante o último trimestre. Calcular sobre meses
absolutos também nos mandatos seguintes, sem reiniciar prazos por engano.

Trocar candidato já anunciado publicamente causa desagrado ao partido desse
candidato e aos eleitores que o apoiam. Alvos, intensidade e duração são definidos
no conteúdo, sem penalidade universal codificada. Não presumir que todos os
eleitores de um partido apoiam pessoalmente o candidato: o cenário deve declarar
como identificar esse público, conforme a regra de apoio pessoal abaixo,
preservando peso eleitoral único.

Separar rascunho/prévia, anúncio público e troca confirmada. Navegar entre opções
antes de confirmar não produz desagrado nem registra compromisso público.
Uma troca pública efetiva registra uma ocorrência identificada; suas consequências
não são aplicadas novamente só por avançar o mês, repetir uma requisição ou
restaurar o save. Novas trocas reais podem produzir novas ocorrências segundo
as regras de composição declaradas, sem permitir apagar desgaste voltando ao
candidato anterior. Limites e dissipação ainda são parâmetros a especificar.

Ao confirmar a nova composição, recalcular a aceitação dos partidos; apoio obtido
com a chapa anterior não permanece automaticamente. Explicar separadamente perda
de aliança e reação dos eleitores, evitando contar o mesmo efeito duas vezes.
A regra de transferência integral vale para os apoios válidos da chapa final.
Esta consequência específica de troca pública não cria punição obrigatória para
trocas de ministros, que seguem o contrato próprio já confirmado.

SG058-B/059 validam prazo e registram a troca com suas consequências de forma
atômica; SG058-A calcula as reações; SG071 mostra prazo, caráter público e
consequências antes da confirmação; SG081/082 preservam anúncios, ocorrências e
apoios atualizados. Aceites: prévia sem efeito, troca antes do limite, bloqueio
após fechamento (inclusive no mês 45 do calendário padrão), desagrado aos alvos corretos, reavaliação de alianças e ausência
de duplicidade em retentativa/restauração. Regra documentada, ainda não implementada.

Para duas vagas, usar votos/(cadeiras já conquistadas nessa eleição + 1): 70/30
produz 2/0; 60/40 produz 1/1. Uma vaga vai à maior votação. Empates nos quocientes
usam o d20; empates meramente visuais por arredondamento não são empate real.

Parcelas populacionais mutuamente exclusivas, associadas a vários grupos de
interesse configuráveis, têm peso dentro de cada UF; cada UF tem peso no
eleitorado nacional. Voto nacional soma peso da UF × peso do perfil × preferência.
Exemplo sintético: UFs com pesos 60%/40% e apoio de 70%/30% ao partido A produzem
54% nacional, não 50%. Interesses são atributos dos perfis, não novos eleitores.

Proposta de colegiado: reutilizar as cadeiras modeladas como representação agregada
do Legislativo para ambas as votações, sem criar uma segunda Câmara. Todos votam;
sem abstenção/quórum de presença separado na V1. Limiares: piso(N/2)+1 e teto(0,6N).
Com 81 cadeiras: 41 e 49. Zero cadeiras nunca autoriza automaticamente.

Sorteios parlamentares usam probabilidades limitadas por cadeira, calculadas por
função configurável de afinidade e opinião pública. Pesos são hipóteses de
balanceamento; não confundir afinidade bruta com probabilidade. Duas rodadas
constitucionais têm sorteios distintos condicionados ao mesmo estado político.
Estimativa informa a chance conjunta. Estado do gerador e resultado da proposta
são persistidos; nova tentativa técnica não oferece novo sorteio.

### Personagens gerados e opiniões dinâmicas — direção confirmada

#### História atribuída depois da geração — confirmado

O motor gera primeiro as características do personagem. Na criação ou primeira
aparição da figura política, seleciona uma história de um catálogo independente
em JSON. Não partir de biografias prontas para determinar os atributos da pessoa.
Parâmetros de geração também continuam configuráveis, mas são distintos das histórias.

Cada história tem ID estável, texto, tags de compatibilidade, requisitos e
restrições. Requisitos/restrições filtram histórias contraditórias; tags ajudam
a escolher entre as compatíveis, admitindo correspondência aproximada. Por exemplo,
tags de educação e serviço público favorecem uma narrativa nessa área, mas uma
carreira militar não pode ser afirmada sem a característica correspondente.

O motor sorteia entre histórias compatíveis e preenche apenas referências
permitidas, como nome e local já existentes no personagem. O texto não cria nem
altera atributos mecânicos, preferências, apoios ou elegibilidade silenciosamente.
Não exigir serviço de IA ou interpretação livre de texto para esse processo.

Salvar a história escolhida e os valores usados no preenchimento. Reabrir uma
ficha, avançar turno ou restaurar a partida não sorteia uma biografia diferente;
mudanças futuras de opinião não reescrevem o passado do personagem. Usar o gerador
com estado persistido, sem consumir sorteios em prévias de interface.

Contrato técnico proposto: [seleção de histórias](../arquitetura/selecao-historias-personagens.md).
Filtrar requisitos antes das tags, sortear por peso-base mais coincidências,
declarar reutilização por história e usar ficha factual mínima quando não houver
correspondência. Nunca aceitar uma história contraditória para preencher o campo.
A especificação inclui exemplos, limites e aceites; ainda não está implementada.

SG098/099 definem e validam o catálogo, a seleção e as referências; SG071 exibe
a ficha; SG081/082 preservam a atribuição. Aceites: história adicionada só por
JSON, filtro de requisito obrigatório, seleção reproduzível com mesma semente,
preenchimento válido, atributos inalterados e biografia estável após restauração.
Documentar exemplos no futuro manual de mods. Ainda não implementado.

O usuário autorizou personagens aleatórios e evolução de suas posições durante
o jogo. JSONs definem modelos, conjuntos de valores, preferências, critérios de
seleção e regras de reação; o motor gera instâncias com IDs próprios e mantém
seu estado na partida. A geração não exige escrever um arquivo de definição para
cada personagem criado, nem transforma o save em catálogo global de personagens.

Regra confirmada: o motor gera um conjunto de personagens contextualizado pela
partida e sua época. Cada partido escolhe dessa população gerada seu candidato
a presidente e seu vice. O jogador escolhe os dois nomes do partido que controla;
os outros partidos escolhem os seus por regras configuradas e disputam a eleição.
Após vencer, o jogador escolhe seus ministros entre os personagens disponíveis
e elegíveis. Não criar uma lista intermediária de nomes indicados antes dessa
escolha. A chapa segue o prazo de três meses e as consequências de troca já
definidos. O mesmo personagem não ocupa dois desses cargos ao mesmo tempo na V1.

O motor recebe uma ação genérica de seleção com autoridade, cargo, personagem
e momento. Valida elegibilidade, disponibilidade e regras institucionais do
cenário, então confirma a escolha e suas consequências declaradas. Se não houver
elegível, registra o motivo e mantém o cargo no estado permitido pelo cenário.
Usar a mesma base quando houver escolha de juízes, sem criar uma grande mecânica
separada para a V1. Regras concretas de elegibilidade ficam nos JSONs.

Aceites para SG058/059/071: jogador escolhe sua chapa; outros partidos escolhem
suas chapas e concorrem; ao vencer o jogador escolhe ministros; escolha inelegível é recusada;
prévia não altera cargo; confirmação aplica apenas efeitos declarados; ausência
de elegíveis não inventa pessoa. SG081/082 persistem escolhas e estado aleatório.

Separar preferências/traços iniciais de opinião atual sobre o governo e de
filiação partidária. Grupos sociais e personagens reagem às leis, seus efeitos
e aos indicadores/dados populacionais do país; não têm uma opinião permanentemente
fixa sobre o partido do jogador. Gostar inicialmente de um governo não garante
apoio futuro. Mudança de opinião não implica troca automática de partido.

Rodadas aleatórias podem modificar a reação dos personagens, condicionadas às
leis e aos dados, não como sorteio sem causa. Frequência, amplitude e relação
com os traços devem ser declaradas nos JSONs. A
[especificação técnica das opiniões](../arquitetura/opinioes-personagens.md)
propõe avaliação a cada fechamento trimestral, alvo calculado das contribuições
ativas e variação limitada condicionada ao contexto. Coeficientes ficam no
conteúdo e no balanceamento.
Usar semente/estado persistido e ordem estável; prévias não consomem sorteios e
retentativas/restauração não permitem sortear novamente a mesma atualização.
Isso autoriza acaso nas reações de personagens, não sorteio adicional de toda
opinião social ou de toda eleição.

A aceitação de coligação continua determinística para o estado atual: opiniões
dos personagens podem evoluir antes da avaliação, mas consultar a mesma chapa
no mesmo estado não dispara outra roleta. A transferência integral à chapa
permanece regra de apuração sobre as preferências partidárias atuais, não votos
congelados desde o início da partida.

SG098/099: modelos de geração e instâncias persistidas; SG058-A: reações causais
e memória; SG058-B/059: escolha e ocupação válida; SG071: causas da
mudança; SG081/082: continuidade das instâncias e sorteios. Aceites a implementar:
mesma semente reproduz geração; mudanças de leis/dados podem alterar opiniões;
filiação não determina apoio fixo; ninguém acumula os cargos restritos; nenhuma
prévia ou restauração rerrola a reação. Esta seção atualiza o escopo, não declara
o sistema implementado nem encerra suas escolhas de contrato.

### Apoio pessoal ao candidato — confirmado

O JSON do personagem declara afinidades com grupos por IDs. O motor combina
essas afinidades com os pesos de interesse de cada parcela populacional, usando
a média ponderada normalizada já especificada neste contrato. Esse resultado
representa apoio pessoal, distinto de preferência partidária, voto declarado
e aceitação de coligação por um partido.

Quanto maior o apoio pessoal ao candidato retirado de uma chapa pública, maior
a reação negativa dessa parcela, conforme magnitude e comportamento temporal
declarados no JSON. Não deduzir apoio pessoal a partir do partido do eleitor
nem aplicar uma penalidade inteira para cada grupo sobreposto. Primeiro combinar
os interesses; depois produzir uma contribuição por parcela e ocorrência de troca.
O apoio usado deve ser o anterior às consequências da própria retirada, evitando
que a penalidade diminua a sua própria base de cálculo.

Afinidade é parâmetro mecânico, não interpretação da história escrita do
personagem. Este aceite não define coeficientes finais, escala de afinidade ou
valor padrão para associações sem afinidade declarada; o esquema deve explicitar
esses detalhes e validar referências antes de carregar o cenário.

A reação do partido do candidato permanece separada da reação dos eleitores.
O apoio pessoal não transfere votos extras para uma chapa por conta própria:
qualquer efeito sobre preferência passa pelas relações declaradas, e a apuração
continua somando uma única vez os votos partidários à candidatura apoiada.

SG099 carrega as afinidades; SG058-A calcula apoio pessoal e reação à retirada;
SG058-B registra a ocorrência; SG071 explica os fatores e a consequência prevista;
SG081/082 preservam a ocorrência e as contribuições sem reaplicação. Aceites:
parcelas com interesses diferentes reagem diferentemente ao mesmo personagem;
alterar a ordem dos grupos não muda a conta; grupos sobrepostos não multiplicam
a penalidade; candidato popular fora de seu partido continua representável;
retentativa ou restauração não reaplica a consequência. Regra documentada,
não implementação concluída.

## Decisão 3 — continuidade institucional e campanha mínima

Proposta: sem eleição presidencial, a partida continua; isso não concede vitória
automática. O contador de tempo permanece absoluto. Cada transição declara nova
autoridade, eleições ativas e destino das propostas pendentes. Sem autoridade
válida, ação bloqueada. Propostas de órgão extinto são canceladas com explicação;
não são aprovadas nem transferidas silenciosamente ao presidente.

Mudanças entram após a decisão que as autorizou e antes dos próximos atos do
fechamento: eleição cancelada não ocorre; garantias e instituições mudam juntas.
Redução de cadeiras exige regra explícita no cenário para mandatos preservados,
encerrados e próxima renovação. Restaurar eleições exige calendário futuro válido.
Sem Constituição/legislativo ativos, vale a autoridade declarada na transição.

Recorte proposto: ministro, três comandantes e Judiciário têm apoio agregado
0–100. Eventos de negociação declarados no cenário alteram apoios com efeitos
visíveis e custo explícito; limiares são parâmetros de balanceamento. A consulta
em vaga oferece opções finitas; seleção usa afinidade do candidato e peso crescente
da preferência presidencial conforme apoio ministerial, com desempate determinístico.
Não adicionar outro sorteio institucional sem decisão específica. Ruptura com
requisitos satisfeitos aplica o pacote institucional e consequências declaradas;
sem requisitos, fica bloqueada, sem roleta oculta de sucesso. Consequências podem
reduzir apoio e criar situações; não simular gestão detalhada do gabinete ou guerra civil.

Campanha proposta: uma ação de comunicação por turno da janela de campanha,
direcionada a um grupo, ou abstenção. Usa uma oportunidade não acumulável por turno,
sem nova moeda ou retirada implícita do Tesouro. Efeito temporário identificado
por eleição, sem empilhamento ilimitado; após apuração é removido. Não criar
candidatos senatoriais individuais, marketing detalhado ou gestão interna de partido.
Presidente, vice e ministros seguem o recorte de personagens confirmado acima.

## Implementação e aceites após aprovação

- SG058-A / FIX-V1-01 e 06: contribuições, efeitos herdados, limites e redistribuição;
  exemplos 40→42 e 99→100→99, extremos 0/100 e ordem independente.
- SG058-B / FIX-V1-05, 07 e 08: candidaturas, votos, divisores, d20, composição
  anterior à renovação, 41/49 votos e rejeição quando qualquer rodada falha.
- SG058/059 / FIX-V1-09: implementar o recorte de campanha e apoio institucional;
  validar requisitos e autoridade conforme conteúdo do cenário.
- SG098/099: conteúdo separado e estado institucional, cadeiras, preferências,
  candidaturas, apoios, contribuições e calendário, sem misturar definições e estado.
- SG061 / FIX-V1-03: fechamento atômico após reforma/ruptura, inclusive eleição
  cancelada e Legislativo extinto; SG064 testa continuidade sem eleição.
- SG069/071: seleção, estimativas e explicações de efeitos, propostas, campanhas,
  eventos institucionais e resultados; Constituição permanece na esfera federal.
- SG081/082: restauração equivalente, sem repetir bônus, sorteios ou nomeações,
  sem ressuscitar instituições ou eleições removidas.

Coeficientes podem ser provisórios e identificados como sintéticos. As fórmulas
e opções apresentadas como propostas neste documento são referências para os
chamados responsáveis. Elas não têm aprovação implícita pelo encerramento do
contrato arquitetural e não bloqueiam o próximo chamado.
