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
- [ ] Todo índice tem unidade e fonte (lista em `docs/v1/desenho/indices.md`, esperando a revisão do autor; a trava conta os que faltam)

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

- [x] Desenho aprovado pelo autor antes do código (12/out, `docs/v1/desenho/rede.md`)
- [ ] Soma dos pesos dos perfis = 100%
- [ ] Lei que agrada um segmento sobe a satisfação dele no turno certo
- [ ] Aprovação inicial do Brasil perto da real (faixa definida no teste)

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

- [x] Desenho aprovado pelo autor antes do código (12/out, `docs/v1/desenho/rede.md`)
- [ ] Grupo se mobiliza quando a base passa do limite de insatisfação e desmobiliza quando é atendida
- [ ] Cada ação tem efeito em índice ou capital

**Você vê.** Grupos aparecendo no jornal com as suas ações.

**Divisão.** Claude: Escreve o modelo, os grupos e as ações. Autor: Revisa os nomes e o repertório.


## Marco D. Ciclo do mandato (v0.4)

### V1-10: Capital político

**Tamanho:** M · **Depende de:** V1-09

**Objetivo.** Dar custo político às decisões.

**Entra**

- Etapa 0, desenho: pesquisar métodos atuais e escrever `docs/v1/desenho/capital.md` (de onde vem o capital político e quanto custa cada ação); o código só começa com o desenho aprovado pelo autor
- Ganho por turno (aprovação, lua de mel no começo do mandato)
- Custo por ação definido na ficha da lei
- Barra de capital na tela

**Não entra**

- Parlamento

**Aceite**

- [x] Desenho aprovado pelo autor antes do código (12/out, `docs/v1/desenho/rede.md`)
- [ ] Ação sem capital suficiente é recusada com motivo
- [ ] Ganho por turno segue a fórmula documentada (teste)

**Você vê.** Barra de capital e custo em cada decisão.

**Divisão.** Claude: Escreve a regra, a API e a barra. Autor: Joga dois mandatos e diz se o ritmo está bom.

### V1-11: Níveis legais na jogabilidade

**Tamanho:** P · **Depende de:** V1-10

**Objetivo.** Fazer Constituição, lei e decreto se comportarem de forma diferente.

**Entra**

- Custo e prazo por nível
- Constituição exige aprovação mínima (no lugar do parlamento, até a versão 2)

**Não entra**

- Votação

**Aceite**

- [ ] Mudança constitucional com aprovação abaixo do mínimo é recusada
- [ ] Prazo de cada nível respeitado no turno

**Você vê.** Etiqueta do nível e o caminho de cada mudança.

**Divisão.** Claude: Escreve as regras e os testes. Autor: Confere os números de custo e prazo.

### V1-12: Eleição do fim do mandato

**Tamanho:** M · **Depende de:** V1-08

**Objetivo.** Fechar o mandato com eleição pelo voto dos perfis.

**Entra**

- Etapa 0, desenho: pesquisar métodos atuais e escrever `docs/v1/desenho/eleicao.md` (escolha probabilística do voto, abstenção e pesquisas com margem de erro); o código só começa com o desenho aprovado pelo autor
- Calendário do país
- Voto por perfil (governo ou oposição, comparecimento)
- Tela de resultado, novo mandato ou fim de jogo

**Não entra**

- Senado, partidos, segundo turno detalhado

**Aceite**

- [x] Desenho aprovado pelo autor antes do código (12/out, `docs/v1/desenho/rede.md`)
- [ ] Mesma semente, mesmo resultado
- [ ] Governo com aprovação muito alta vence e muito baixa perde (teste)

**Você vê.** A eleição no fim de 16 turnos.

**Divisão.** Claude: Escreve a eleição e a tela. Autor: Joga até a eleição.

### V1-13: Salvar e carregar

**Tamanho:** P · **Depende de:** V1-12

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


## Marco E. Conteúdo (v0.5 a v0.7)

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

**Objetivo.** Revisar os eventos e dilemas e completar o conjunto.

**Entra**

- Revisão dos 78 eventos e 91 dilemas atuais
- Novos até cerca de 120 eventos e 100 dilemas
- Ligação com segmentos, grupos de pressão e características

**Não entra**

- Personagens

**Aceite**

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

- Parlamento no centro (versão 2)

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
- Controle, custo político, dinheiro, efeitos com atraso, segmentos, história, fontes
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

### V1-32: Versão 1.0

**Tamanho:** P · **Depende de:** V1-31

**Objetivo.** Publicar a versão 1.

**Entra**

- README, notas da versão, etiqueta v1.0
- Build de produção

**Aceite**

- [ ] npm run check verde
- [ ] Partida completa de dois mandatos sem erro

**Você vê.** Versão 1 pronta.

**Divisão.** Claude: Prepara. Autor: Faz o push e publica.

