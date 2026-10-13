# Chamados da versão 1

> **Status: VIGENTE.** Detalhe de cada chamado. O status fica só no `PLANO.md`. Processo em `engenharia.md`.

## Marco A. Fundação (v0.1)

### V1-01: Documentos novos e antigos desativados

**Tamanho:** P · **Depende de:** nenhum

**Objetivo.** Deixar claro o que se segue e o que não se segue.

**Entra**

- PLANO novo, docs/v1, AGENTS e README reescritos
- Documentos antigos movidos para docs/desativado com o motivo

**Não entra**

- Mudar código

**Aceite**

- [ ] Todo documento vigente começa com o status
- [ ] docs/desativado/LEIA-ME.md lista cada arquivo antigo, o motivo e o substituto
- [ ] Nenhum link quebrado nos documentos vigentes (verificação por script)

**Você vê.** Nada no jogo.

**Divisão.** Claude: Escreve e move os documentos, faz o commit local. Autor: Lê o PLANO e a diferenciação e aprova.

### V1-02: Tirar código morto e restos do D4

**Tamanho:** P · **Depende de:** V1-01

**Objetivo.** Remover o que a tela não usa e todo vínculo com o D4 dentro do repositório.

**Entra**

- Etiqueta v0-antes-da-v1
- Remover laboratório, mapas antigos, cenários demo, d4ReferenceSandbox e os testes deles
- Tirar do git os documentos de estudo do D4 (ficam só na máquina do autor)
- Tirar do git o backup .bundle e a pasta dist, se estiverem versionados

**Não entra**

- Refatorar o que fica

**Aceite**

- [ ] Nenhum arquivo removido é importado por quem fica (grep)
- [ ] Busca por 'Democracy' e 'D4' no código e no conteúdo não encontra nada
- [ ] npm run check verde

**Você vê.** O mesmo jogo, com cerca de 3 mil linhas a menos.

**Divisão.** Claude: Faz o inventário de importações, remove e roda os testes afetados. Autor: Roda o check e abre o jogo uma vez.

### V1-03: Dividir a partida em módulos

**Tamanho:** M · **Depende de:** V1-02

**Objetivo.** Quebrar src/app/partida.ts (1.800 linhas) por assunto, sem mudar comportamento.

**Entra**

- Módulos criar, leis, turno, visao, previsao
- Mesma API pública exportada por um índice

**Não entra**

- Qualquer mudança de regra

**Aceite**

- [ ] Os testes atuais passam sem alteração
- [ ] Nenhum módulo novo passa de 500 linhas
- [ ] A tela não muda nenhuma importação

**Você vê.** Nada no jogo.

**Divisão.** Claude: Divide e prova com os testes existentes. Autor: Roda o check.

### V1-04: Tirar o parlamento da versão 1 e fixar as camadas

**Tamanho:** M · **Depende de:** V1-03

**Objetivo.** Remover propostas, votações, Senado e a eleição antiga do caminho da partida e garantir as camadas.

**Entra**

- Remover os módulos listados em reestruturacao.md
- Mover o que a partida usa de domain/ para game/leis/
- Teste de arquitetura que quebra se uma camada importar a de cima

**Não entra**

- Escrever a eleição nova (V1-12)

**Aceite**

- [ ] O teste de arquitetura passa e falha de propósito num caso de exemplo
- [ ] Turno do Brasil igual ao de antes (comparação do estado após 4 turnos)
- [ ] npm run check verde

**Você vê.** Nada no jogo.

**Divisão.** Claude: Remove, move e escreve o teste de camadas. Autor: Roda o check.

## Marco B. Formato e país (v0.2)

### V1-05: Ficha de lei v3, verificador e conversor

**Tamanho:** M · **Depende de:** V1-04

**Objetivo.** Ter o formato novo de lei funcionando de ponta a ponta com uma lei piloto.

**Entra**

- Formato descrito em conteudo.md 1.2
- Verificador (fonte obrigatória, índices existentes, níveis, dependências)
- Conversor para o JSON do motor, com os efeitos dentro da ficha
- Carregador aceitando o formato antigo e o novo durante a migração
- Uma lei piloto de cada nível migrada

**Não entra**

- Migrar as demais leis

**Aceite**

- [x] As três leis piloto se comportam como antes no turno (teste)
- [x] Ficha sem fonte é recusada com mensagem clara
- [x] Relatório mostra quantas leis faltam migrar

**Você vê.** Nada novo; as três leis piloto continuam iguais.

**Divisão.** Claude: Escreve formato, verificador, conversor e testes. Autor: Revisa a ficha piloto.

### V1-06: Configuração do país

**Tamanho:** M · **Depende de:** V1-05

**Objetivo.** Mover o Brasil para a pasta nova, com características e o campo requer.

**Entra**

- Arquivos pais, politica, economia, leis, valores, populacao, historia
- Características e filtro por requer em leis, eventos e dilemas
- Um país de teste mínimo que carrega

**Não entra**

- Mudar números do Brasil

**Aceite**

- [x] Turno 0 do Brasil idêntico ao de antes (teste de comparação)
- [x] Evento que pede litoral não sorteia no país de teste sem litoral

**Você vê.** O Brasil igual, carregado da pasta nova.

**Divisão.** Claude: Migra os dados e escreve os testes. Autor: Confere a história de abertura.

### V1-07: Índices e situações

**Tamanho:** M · **Depende de:** V1-06

**Objetivo.** Revisar os índices com unidade real e fonte, e criar situações com entrada e saída.

**Entra**

- Etapa 0, desenho: pesquisar métodos atuais e escrever `docs/v1/desenho/rede.md` (calibragem, sensibilidade e desempenho da rede); o código só começa com o desenho aprovado pelo autor
- Lista de cerca de 100 índices com fonte
- Situação com limite de entrada e de saída no motor
- Cerca de 20 situações iniciais
- Grafo compilado (turno abaixo de 20 ms, mesmos números)
- Cofre separado da dívida, com divisão do superávit por lei
- Partida que começa em jan/2025 e roda 4 trimestres antes do jogador
- Relatório de contexto e de ligações, com trava que só deixa a contagem cair

**Não entra**

- Todas as 60 situações (o resto entra com o conteúdo)
- Zerar o contexto e completar as ligações: vai área por área, nos chamados V1-14 a V1-23

**Aceite**

- [x] Desenho aprovado pelo autor antes do código (12/out, `docs/v1/desenho/rede.md`)
- [x] Situação entra acima do limite e só sai abaixo do limite menor (teste do motor; `situacoes.test.ts`)
- [x] Todo índice tem unidade e fonte (`medida` no `variaveis.json`, lista aprovada em `docs/v1/desenho/indices.md`; trava em 0)

**Você vê.** Situações aparecendo e sumindo no jornal.

**Divisão.** Claude: Escreve o mecanismo, revisa os índices e as situações. Autor: Revisa a lista de índices.

## Marco C. População (v0.3)

### V1-08: Segmentos do eleitorado e perfis sintéticos

**Tamanho:** M · **Depende de:** V1-07

**Objetivo.** Trocar os 11 grupos atuais pelos 20 segmentos e calcular a aprovação pelos perfis.

**Entra**

- Etapa 0, desenho: pesquisar métodos atuais e escrever `docs/v1/desenho/populacao.md` (população sintética a partir de dados do IBGE e opinião por perfil); o código só começa com o desenho aprovado pelo autor
- Os 20 segmentos de conteudo.md 3.1
- Perfis sintéticos com peso, gerados das distribuições do país
- Satisfação por segmento e aprovação geral
- Painel de grupos mostrando os 20

**Não entra**

- Grupos de pressão

**Aceite**

- [x] Desenho aprovado pelo autor antes do código (`docs/v1/desenho/populacao.md`)
- [x] Soma dos pesos dos perfis = 100%
- [x] Lei que agrada um segmento sobe a satisfação dele no turno certo
- [x] Aprovação inicial do Brasil perto da real (faixa definida no teste)

**Você vê.** Painel com os 20 segmentos.

**Divisão.** Claude: Escreve o modelo e a migração dos efeitos das leis atuais. Autor: Diz se os segmentos fazem sentido no jogo.

### V1-09: Grupos de pressão

**Tamanho:** M · **Depende de:** V1-08

**Objetivo.** Ter os 20 grupos de pressão com mobilização e repertório.

**Entra**

- Etapa 0, desenho: pesquisar métodos atuais e escrever `docs/v1/desenho/pressao.md` (atores com recursos, limiar de mobilização e repertório de ações); o código só começa com o desenho aprovado pelo autor
- Os 20 grupos de conteudo.md 3.2
- Mobilização por insatisfação da base
- Ações do repertório como ocorrências (greve, ocupação, campanha, ameaça)

**Não entra**

- Lobby no parlamento

**Aceite**

- [x] Desenho aprovado pelo autor antes do código (12/out, `docs/v1/desenho/pressao.md`)
- [x] Grupo se mobiliza quando a base passa do limite de insatisfação e desmobiliza quando é atendida
- [x] Cada ação tem efeito em índice ou capital

**Você vê.** Grupos aparecendo no jornal com as suas ações.

**Divisão.** Claude: Escreve o modelo, os grupos e as ações. Autor: Revisa os nomes e o repertório.

## Marco D. Congresso e mandato (v0.4)

> Replanejado em 13/out (pedido do autor): o parlamento volta para a versão 1 e
> o capital político sai. Você joga como o **partido**: as cadeiras do seu
> partido votam sempre com você, e o resto do Congresso precisa ser convencido.
> Eleição, escolha de candidatos, ministros, nome do partido e personagens
> aleatórios ficam para a versão 2 (`ideias.md`).

### V1-10: Bússola política

**Tamanho:** M · **Depende de:** V1-08

**Objetivo.** Mostrar para onde o seu governo leva o país no espectro
político, perto de quais personalidades e partidos.

**Entra**

- Etapa 0, desenho: pesquisar métodos atuais (escalas de posição política,
  dados de partidos e de governantes) e escrever `docs/v1/desenho/bussola.md`
  com os eixos, o peso de cada opção de lei em cada eixo e a posição das
  referências; o código só começa com o desenho aprovado pelo autor
- Sem questionário: o ponto inicial é a média das leis em vigor no país (o
  Brasil começa onde estão as políticas de hoje)
- Cada opção de lei tem um peso em cada eixo, com fonte; o ponto anda conforme
  as leis que você aprova, muda e revoga
- Referências na bússola: personalidades e partidos famosos da esquerda e da
  direita, em duas camadas separadas, cada posição com fonte
- O caminho do seu ponto ao longo do mandato

**Não entra**

- Escolha de candidato e nome do partido (versão 2)

**Aceite**

- [x] Desenho aprovado pelo autor antes do código (`docs/v1/desenho/bussola.md`)
- [x] O ponto inicial vem das leis em vigor (teste)
- [x] Toda opção de lei tem peso nos eixos (teste do verificador)
- [x] A posição de cada referência tem fonte

**Você vê.** A bússola com o seu ponto, o caminho que ele fez e as
personalidades e partidos em volta.

**Divisão.** Claude: Pesquisa, dá peso às leis e posiciona as referências.
Autor: Confere o ponto inicial do Brasil, as referências e o peso das leis.

### V1-11: Câmara e Senado

**Tamanho:** M · **Depende de:** V1-10

**Objetivo.** Ter um Congresso na rede, com 513 deputados e 81 senadores no
Brasil, montado por estatística a partir da população.

**Entra**

- Etapa 0, desenho: pesquisar métodos atuais (composição real das bancadas,
  modelos espaciais de voto, frentes parlamentares) e escrever
  `docs/v1/desenho/congresso.md`; o código só começa com o desenho aprovado
  pelo autor
- Casas, cadeiras e regras de votação na configuração do país (o Brasil é
  bicameral, 513 e 81; outro país pode ter outra forma)
- Bancadas como blocos com cadeiras e os grupos sociais que representam,
  calibradas pela composição real (sem os 513 nomes)
- O seu partido: as cadeiras dele votam sempre com você
- Disposição de cada bancada: sobe quando os segmentos que ela representa
  estão satisfeitos e cai quando estão insatisfeitos
- Painel do Congresso: bancadas, cadeiras e humor, sem um ponto por deputado

**Não entra**

- Eleição do Congresso (versão 2)
- Deputados com nome

**Aceite**

- [ ] Desenho aprovado pelo autor antes do código (`docs/v1/desenho/congresso.md`)
- [ ] As cadeiras somam 513 e 81 no Brasil (teste)
- [ ] A composição inicial bate com a real dentro da tolerância do desenho

**Você vê.** O Congresso no painel, com as bancadas e o seu partido.

**Divisão.** Claude: Pesquisa, monta as bancadas e o painel. Autor: Confere a
composição e as bancadas.

### V1-12: Tramitação e votação

**Tamanho:** M · **Depende de:** V1-11

**Objetivo.** Fazer a lei passar pelo Congresso: Constituição, lei e decreto
com caminhos diferentes.

**Entra**

- Pauta: um lugar no tablet com as leis em tramitação, a fase de cada uma e a
  previsão de votos
- Caminho por nível, com as regras reais do Brasil: decreto vale sem votação;
  lei ordinária precisa de maioria simples; lei complementar, de maioria
  absoluta; emenda constitucional, de 3/5 nas duas casas, em dois turnos;
  cláusula pétrea não muda
- Voto de cada bancada pelo que a lei faz aos segmentos que ela representa,
  pela disposição dela e pelos acordos feitos
- Um pouco de sorte no voto: nem toda cadeira de uma bancada vota igual,
  nem as do seu partido
- Resultado: passa, adia (volta à pauta no turno seguinte) ou cai
- Pedidos do Congresso como dilemas: uma bancada pede algo em troca de votos;
  aceitar ou recusar soma ou tira apoio
- Toda lei com a informação do caminho e do quórum

**Não entra**

- Negociação com parlamentar por nome
- Veto e derrubada de veto (versão 2)

**Aceite**

- [ ] Emenda sem 3/5 nas duas casas não passa (teste)
- [ ] Com maioria própria, lei ordinária passa sem acordo (teste)
- [ ] Mesma semente, mesma votação (teste)
- [ ] Pedido aceito muda o voto da bancada que pediu (teste)

**Você vê.** A pauta no tablet, a votação de cada lei e os pedidos das
bancadas.

**Divisão.** Claude: Escreve a regra, a pauta e os pedidos. Autor: Joga um
mandato e diz se passar lei está fácil ou difícil demais.

### V1-13: Dilemas com lados e notificações no tablet

**Tamanho:** M · **Depende de:** V1-12

**Objetivo.** Dilema é uma escolha entre lados, não entre bom, médio e ruim, e
chega como notificação.

**Entra**

- Regra nova: as opções de um dilema são contrárias entre si em algum eixo
  (mercado e Estado, punir e prevenir, liberdade e ordem…), cada uma com
  ganhadores e perdedores e com peso na bússola; o verificador recusa opção
  sem lado
- Exemplo: "Uma grande empresa quebrou" tem salvar com dinheiro público para
  manter os empregos, salvar em troca de participação nas ações, ou deixar
  quebrar e amparar os demitidos
- Revisão dos 91 dilemas atuais por essa regra (o V1-24 completa o conjunto)
- Dilemas e pedidos do Congresso chegam como notificação no tablet, sem janela
  piscando na tela; o turno espera as que pedem resposta
- Tablet com cara de tablet: tela inicial com apps (notícias, rede, pauta,
  notificações)

**Não entra**

- Personagens que pedem por nome (versão 2)

**Aceite**

- [ ] Todo dilema tem opções com posição diferente na bússola (teste do verificador)
- [ ] Nenhum dilema abre janela sozinho; a notificação fica no tablet até a resposta
- [ ] Checagem de diferenciacao-d4.md feita

**Você vê.** O tablet com notificações; dilemas com escolhas de lado.

**Divisão.** Claude: Reescreve os dilemas e o tablet. Autor: Lê uma amostra e
aprova o tablet.

## Marco E. Conteúdo (v0.5 a v0.7)

### V1-34: Leis de todos os lados e prova real da bússola

**Tamanho:** G · **Depende de:** V1-10 · **Vem antes de:** V1-14 a V1-23

**Objetivo.** Reestruturar o catálogo para que o jogador consiga governar
com as políticas de qualquer referência da bússola, do Che ao Bolsonaro
(o jogador continua sendo ele mesmo, não a pessoa), e provar isso: seguir
as políticas de uma referência leva o ponto para perto dela.

**Entra**

- Etapa 0, desenho: pesquisar o que os governos das referências da bússola
  aprovaram de fato (do Che e Fidel em Cuba ao Bolsonaro, passando por PT,
  PSDB, Thatcher, Xi, Putin e os outros) e escrever `docs/v1/desenho/leis-de-todos-os-lados.md`; o código
  só começa com o desenho aprovado pelo autor
- Regra para as áreas V1-14 a V1-23: cada área tem leis que só um lado
  aprovaria, em todos os cantos da bússola (estatização total, partido
  único, livre mercado radical, teocracia…), e boa parte delas fica fora de
  vigor no Brasil (hoje só 2 de 129 estão fora)
- Ligações entre leis que façam o jogador planejar o caminho: uma lei que
  exige outra, leis que se anulam, pacotes que só funcionam juntos
- Programas de governo como dados: a lista de leis e opções de cada
  referência da bússola, com fonte
- Prova real: partidas automáticas que aplicam cada programa e medem a
  distância até a referência do governo na bússola

**Não entra**

- As leis novas de cada área (ficam nos chamados V1-14 a V1-23, seguindo a
  regra deste)

**Aceite**

- [ ] Desenho aprovado pelo autor antes do código
- [ ] Jogar o programa de uma referência deixa o ponto mais perto dela do
      que das referências do lado oposto, para toda referência com programa
      (teste)
- [ ] Cada programa tem fonte para cada lei
- [ ] Checagem de diferenciacao-d4.md feita

**Você vê.** Um relatório da prova real: para cada programa, onde o ponto
terminou e a distância até o governo de verdade.

**Divisão.** Claude: Pesquisa os programas, escreve o desenho e roda a prova.
Autor: Aprova a estrutura e confere os programas que mais conhece.

### V1-35: Empresas do país e Estado empresário

**Tamanho:** G · **Depende de:** V1-34 e V1-12 (tramitação) · **Vem antes de:** V1-14 a V1-23

**Objetivo.** Dar à economia empresas de verdade: o país tem grupos de
empresas por setor, que faturam mais ou menos conforme as leis e os índices,
e pagam impostos (privadas) ou dividendos (estatais). Privatizar, estatizar e
investir passam a mexer no cofre.

**Entra**

- Etapa 0, desenho: `docs/v1/desenho/empresas-do-pais.md`, aprovado pelo
  autor antes do código
- Empresas do país na configuração do país: 4 grupos (estatais, grandes
  privadas nacionais, multinacionais, pequenos negócios) em 10 setores, com
  faturamento, dívida, lucro e capacidade física, números com fonte
- Faturamento puxado por leis e índices; imposto para as privadas e
  dividendo para as estatais
- Privatizar e estatizar com dinheiro de uma vez entrando ou saindo do cofre
- Três leis por setor (vender, estatizar comprando, expropriar), com a %
  escolhida pelo jogador, no mínimo 2 turnos de transição pagos ou recebidos
  em parcelas, e vender e estatizar o mesmo setor nunca em vigor juntos
- Energia como minijogo: a demanda cresce com o PIB e a população, o
  orçamento de investimento cresce com o PIB, e o jogador divide entre as
  fontes; se a capacidade não acompanha, a energia encarece e vem o apagão

**Não entra**

- As leis novas de cada área (ficam nos chamados V1-14 a V1-23)

**Aceite**

- [ ] Desenho aprovado pelo autor antes do código
- [ ] Privatizar e estatizar mudam o cofre no turno (teste)
- [ ] Um investimento só aumenta a capacidade depois do prazo (teste)
- [ ] Cada número da configuração tem fonte
- [ ] Checagem de diferenciacao-d4.md feita

**Você vê.** As empresas do país por grupo e setor, e o dinheiro de
impostos e dividendos entrando no cofre a cada turno.

**Divisão.** Claude: Pesquisa os números, escreve o desenho e o código.
Autor: Aprova os grupos, os setores e a mesa de energia.

### V1-14: Conteúdo: Segurança e justiça penal

**Tamanho:** M · **Depende de:** V1-05 a V1-11

**Objetivo.** Escrever as leis da área Segurança e justiça penal no formato v3, a partir de leis reais.

**Entra**

- De 30 a 45 leis com fonte, história e efeitos
- Leis antigas da área migradas ou substituídas
- Valor do Brasil em cada lei em vigor

**Não entra**

- Outras áreas

**Aceite**

- [ ] Verificador sem erro na área
- [ ] Índices da área com contexto zero e recebendo influência; leis da área com um índice que muda o efeito (trava do V1-07)
- [ ] Brasil parado por 16 turnos sem salto maior que o limite de realismo
- [ ] Checagem de diferenciacao-d4.md feita

**Você vê.** As leis novas da área no mapa e no catálogo.

**Divisão.** Claude: Escreve as fichas e gera uma revisão por área. Autor: Revisa a tabela da área e marca o que muda.

### V1-15: Conteúdo: Contas e tributos

**Tamanho:** M · **Depende de:** V1-14

**Objetivo.** Escrever as leis da área Contas e tributos no formato v3, a partir de leis reais.

**Entra**

- De 30 a 45 leis com fonte, história e efeitos
- Leis antigas da área migradas ou substituídas
- Valor do Brasil em cada lei em vigor

**Não entra**

- Outras áreas

**Aceite**

- [ ] Verificador sem erro na área
- [ ] Índices da área com contexto zero e recebendo influência; leis da área com um índice que muda o efeito (trava do V1-07)
- [ ] Brasil parado por 16 turnos sem salto maior que o limite de realismo
- [ ] Checagem de diferenciacao-d4.md feita

**Você vê.** As leis novas da área no mapa e no catálogo.

**Divisão.** Claude: Escreve as fichas e gera uma revisão por área. Autor: Revisa a tabela da área e marca o que muda.

### V1-16: Conteúdo: Poder e instituições

**Tamanho:** M · **Depende de:** V1-15

**Objetivo.** Escrever as leis da área Poder e instituições no formato v3, a partir de leis reais.

**Entra**

- De 30 a 45 leis com fonte, história e efeitos
- Leis antigas da área migradas ou substituídas
- Valor do Brasil em cada lei em vigor

**Não entra**

- Outras áreas

**Aceite**

- [ ] Verificador sem erro na área
- [ ] Índices da área com contexto zero e recebendo influência; leis da área com um índice que muda o efeito (trava do V1-07)
- [ ] Brasil parado por 16 turnos sem salto maior que o limite de realismo
- [ ] Checagem de diferenciacao-d4.md feita

**Você vê.** As leis novas da área no mapa e no catálogo.

**Divisão.** Claude: Escreve as fichas e gera uma revisão por área. Autor: Revisa a tabela da área e marca o que muda.

### V1-17: Conteúdo: Direitos e liberdades

**Tamanho:** M · **Depende de:** V1-16

**Objetivo.** Escrever as leis da área Direitos e liberdades no formato v3, a partir de leis reais.

**Entra**

- De 30 a 45 leis com fonte, história e efeitos
- Leis antigas da área migradas ou substituídas
- Valor do Brasil em cada lei em vigor

**Não entra**

- Outras áreas

**Aceite**

- [ ] Verificador sem erro na área
- [ ] Índices da área com contexto zero e recebendo influência; leis da área com um índice que muda o efeito (trava do V1-07)
- [ ] Brasil parado por 16 turnos sem salto maior que o limite de realismo
- [ ] Checagem de diferenciacao-d4.md feita

**Você vê.** As leis novas da área no mapa e no catálogo.

**Divisão.** Claude: Escreve as fichas e gera uma revisão por área. Autor: Revisa a tabela da área e marca o que muda.

### V1-18: Conteúdo: Defesa e mundo

**Tamanho:** M · **Depende de:** V1-17

**Objetivo.** Escrever as leis da área Defesa e mundo no formato v3, a partir de leis reais.

**Entra**

- De 30 a 45 leis com fonte, história e efeitos
- Leis antigas da área migradas ou substituídas
- Valor do Brasil em cada lei em vigor

**Não entra**

- Outras áreas

**Aceite**

- [ ] Verificador sem erro na área
- [ ] Índices da área com contexto zero e recebendo influência; leis da área com um índice que muda o efeito (trava do V1-07)
- [ ] Brasil parado por 16 turnos sem salto maior que o limite de realismo
- [ ] Checagem de diferenciacao-d4.md feita

**Você vê.** As leis novas da área no mapa e no catálogo.

**Divisão.** Claude: Escreve as fichas e gera uma revisão por área. Autor: Revisa a tabela da área e marca o que muda.

### V1-19: Conteúdo: Trabalho e mercado

**Tamanho:** M · **Depende de:** V1-18

**Objetivo.** Escrever as leis da área Trabalho e mercado no formato v3, a partir de leis reais.

**Entra**

- De 30 a 45 leis com fonte, história e efeitos
- Leis antigas da área migradas ou substituídas
- Valor do Brasil em cada lei em vigor

**Não entra**

- Outras áreas

**Aceite**

- [ ] Verificador sem erro na área
- [ ] Índices da área com contexto zero e recebendo influência; leis da área com um índice que muda o efeito (trava do V1-07)
- [ ] Brasil parado por 16 turnos sem salto maior que o limite de realismo
- [ ] Checagem de diferenciacao-d4.md feita

**Você vê.** As leis novas da área no mapa e no catálogo.

**Divisão.** Claude: Escreve as fichas e gera uma revisão por área. Autor: Revisa a tabela da área e marca o que muda.

### V1-20: Conteúdo: Proteção social

**Tamanho:** M · **Depende de:** V1-19

**Objetivo.** Escrever as leis da área Proteção social no formato v3, a partir de leis reais.

**Entra**

- De 30 a 45 leis com fonte, história e efeitos
- Leis antigas da área migradas ou substituídas
- Valor do Brasil em cada lei em vigor

**Não entra**

- Outras áreas

**Aceite**

- [ ] Verificador sem erro na área
- [ ] Índices da área com contexto zero e recebendo influência; leis da área com um índice que muda o efeito (trava do V1-07)
- [ ] Brasil parado por 16 turnos sem salto maior que o limite de realismo
- [ ] Checagem de diferenciacao-d4.md feita

**Você vê.** As leis novas da área no mapa e no catálogo.

**Divisão.** Claude: Escreve as fichas e gera uma revisão por área. Autor: Revisa a tabela da área e marca o que muda.

### V1-21: Conteúdo: Educação, ciência e cultura

**Tamanho:** M · **Depende de:** V1-20

**Objetivo.** Escrever as leis da área Educação, ciência e cultura no formato v3, a partir de leis reais.

**Entra**

- De 30 a 45 leis com fonte, história e efeitos
- Leis antigas da área migradas ou substituídas
- Valor do Brasil em cada lei em vigor

**Não entra**

- Outras áreas

**Aceite**

- [ ] Verificador sem erro na área
- [ ] Índices da área com contexto zero e recebendo influência; leis da área com um índice que muda o efeito (trava do V1-07)
- [ ] Brasil parado por 16 turnos sem salto maior que o limite de realismo
- [ ] Checagem de diferenciacao-d4.md feita

**Você vê.** As leis novas da área no mapa e no catálogo.

**Divisão.** Claude: Escreve as fichas e gera uma revisão por área. Autor: Revisa a tabela da área e marca o que muda.

### V1-22: Conteúdo: Meio ambiente, energia e campo

**Tamanho:** M · **Depende de:** V1-21

**Objetivo.** Escrever as leis da área Meio ambiente, energia e campo no formato v3, a partir de leis reais.

**Entra**

- De 30 a 45 leis com fonte, história e efeitos
- Leis antigas da área migradas ou substituídas
- Valor do Brasil em cada lei em vigor

**Não entra**

- Outras áreas

**Aceite**

- [ ] Verificador sem erro na área
- [ ] Índices da área com contexto zero e recebendo influência; leis da área com um índice que muda o efeito (trava do V1-07)
- [ ] Brasil parado por 16 turnos sem salto maior que o limite de realismo
- [ ] Checagem de diferenciacao-d4.md feita

**Você vê.** As leis novas da área no mapa e no catálogo.

**Divisão.** Claude: Escreve as fichas e gera uma revisão por área. Autor: Revisa a tabela da área e marca o que muda.

### V1-23: Conteúdo: Cidades e transporte

**Tamanho:** M · **Depende de:** V1-22

**Objetivo.** Escrever as leis da área Cidades e transporte no formato v3, a partir de leis reais.

**Entra**

- De 30 a 45 leis com fonte, história e efeitos
- Leis antigas da área migradas ou substituídas
- Valor do Brasil em cada lei em vigor

**Não entra**

- Outras áreas

**Aceite**

- [ ] Verificador sem erro na área
- [ ] Índices da área com contexto zero e recebendo influência; leis da área com um índice que muda o efeito (trava do V1-07)
- [ ] Brasil parado por 16 turnos sem salto maior que o limite de realismo
- [ ] Checagem de diferenciacao-d4.md feita

**Você vê.** As leis novas da área no mapa e no catálogo.

**Divisão.** Claude: Escreve as fichas e gera uma revisão por área. Autor: Revisa a tabela da área e marca o que muda.

### V1-24: Eventos e dilemas

**Tamanho:** M · **Depende de:** V1-23

**Objetivo.** Revisar os eventos e completar os eventos e dilemas (os dilemas
atuais já passam pela regra de lados no V1-13).

**Entra**

- Revisão dos 78 eventos e 91 dilemas atuais
- Novos até cerca de 120 eventos e 100 dilemas
- Ligação com segmentos, grupos de pressão e características

**Não entra**

- Personagens

**Aceite**

- [ ] Todo dilema segue a regra de lados do V1-13 (teste do verificador)
- [ ] Em 80 turnos, nenhuma ocorrência mais de 3 vezes (teste já existente, mantido)
- [ ] Todo texto escrito por nós

**Você vê.** Mais variedade no jornal e na mesa.

**Divisão.** Claude: Escreve e revisa. Autor: Lê uma amostra.

### V1-25: Brasil 2026 completo

**Tamanho:** M · **Depende de:** V1-24

**Objetivo.** Fechar o país com todos os valores de partida e a checagem de realismo.

**Entra**

- Todas as leis em vigor com valor
- Todos os índices com valor e fonte
- Relatório de realismo

**Não entra**

- Outros países

**Aceite**

- [ ] Turno 0 bate com os números oficiais dentro da tolerância
- [ ] 16 turnos parados sem explosão

**Você vê.** O Brasil inteiro com as leis novas.

**Divisão.** Claude: Preenche e roda a checagem. Autor: Confere os números que mais importam.

## Marco F. Interface (v0.8)

### V1-26: Mapa da versão 1

**Tamanho:** M · **Depende de:** V1-25

**Objetivo.** Mapa com o centro (bandeira, presidente, vice) e as 10 áreas com ministros e leis em vigor.

**Entra**

- Dividir MapaPolitico.tsx
- Leis por nível com forma própria
- Ligações só ao focar

**Não entra**

- Um ponto por deputado (o Congresso fica no painel do V1-11)

**Aceite**

- [ ] Teste de componente e captura de tela
- [ ] Todas as leis em vigor alcançáveis em até 2 cliques

**Você vê.** Mapa novo.

**Divisão.** Claude: Implementa e manda capturas. Autor: Joga e aprova o visual.

### V1-27: Janela da lei e catálogo

**Tamanho:** M · **Depende de:** V1-26

**Objetivo.** Janela da lei e catálogo no formato v3.

**Entra**

- Dividir Documentos.tsx
- Controle, caminho no Congresso e quórum, posição na bússola, dinheiro, efeitos com atraso, segmentos, história, fontes
- Catálogo com busca e filtros

**Aceite**

- [ ] Toda informação da ficha aparece
- [ ] Aprovar, ajustar e revogar funcionam pela fachada

**Você vê.** Janela e catálogo novos.

**Divisão.** Claude: Implementa e manda capturas. Autor: Aprova.

### V1-28: Por que mudou?

**Tamanho:** P · **Depende de:** V1-27

**Objetivo.** Mostrar as causas de cada mudança de índice e de aprovação.

**Entra**

- Painel de causas com o peso de cada uma

**Aceite**

- [ ] As causas somam a variação mostrada (teste)

**Você vê.** Clique num índice e veja as causas.

**Divisão.** Claude: Implementa. Autor: Aprova.

### V1-29: Metas e conquistas

**Tamanho:** P · **Depende de:** V1-28

**Objetivo.** Dar objetivos ao mandato.

**Entra**

- Metas da história do país
- Cerca de 30 conquistas
- Balanço do mandato no fim dos 16 turnos (a eleição é da versão 2)

**Aceite**

- [ ] Conquista dispara uma vez e fica salva

**Você vê.** Metas e conquistas na tela.

**Divisão.** Claude: Escreve. Autor: Aprova.

### V1-30: Ajuda e primeiro mandato guiado

**Tamanho:** M · **Depende de:** V1-29

**Objetivo.** Ensinar o jogo nos primeiros turnos.

**Entra**

- Dicas contextuais
- Primeiro turno guiado
- Glossário dos níveis legais

**Aceite**

- [ ] Pessoa nova consegue aprovar uma lei e encerrar o turno sem ajuda externa (teste com alguém)

**Você vê.** Ajuda no jogo.

**Divisão.** Claude: Escreve. Autor: Testa com alguém que não conhece o jogo.

## Marco G. Fechamento (v1.0)

### V1-31: Balanceamento e realismo

**Tamanho:** M · **Depende de:** V1-30

**Objetivo.** Calibrar o jogo com partidas automáticas.

**Entra**

- Partidas de estratégia (austeridade, gasto social, mão dura, liberal)
- Relatório por estratégia

**Aceite**

- [ ] Nenhuma estratégia vence sempre ou perde sempre
- [ ] Nenhum índice fora da faixa possível

**Você vê.** Jogo mais justo.

**Divisão.** Claude: Roda as partidas e ajusta. Autor: Joga e decide.

### V1-33: Salvar e carregar

**Tamanho:** P · **Depende de:** V1-31

**Objetivo.** Guardar e retomar a partida.

**Entra**

- Salvar no navegador e exportar arquivo
- Versão do esquema na partida salva

**Não entra**

- Nuvem

**Aceite**

- [ ] Partida salva e carregada produz o mesmo próximo turno
- [ ] Versão errada é recusada com mensagem

**Você vê.** Botões salvar e carregar.

**Divisão.** Claude: Escreve e testa. Autor: Testa no navegador.

### V1-32: Versão 1.0

**Tamanho:** P · **Depende de:** V1-33

**Objetivo.** Publicar a versão 1.

**Entra**

- README, notas da versão, etiqueta v1.0
- Build de produção

**Aceite**

- [ ] npm run check verde
- [ ] Partida completa de um mandato sem erro, com o balanço no fim

**Você vê.** Versão 1 pronta.

**Divisão.** Claude: Prepara. Autor: Faz o push e publica.
