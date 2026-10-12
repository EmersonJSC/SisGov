# Grupos de pressão (V1-09)

**Status:** APROVADO pelo autor em 12/out (versão 4; decisões na seção 8).

## 0. O que mudou da versão 1

- **Muito mais grupos:** 54 em vez de 20, incluindo os movimentos de direita,
  duas correntes evangélicas, quatro grupos de mídia nacionais e a mídia
  internacional, três grupos do crime e os separatistas por região.
- **"Visto como" separado da causa.** Um movimento que luta por um direito
  não é "de esquerda" por natureza; a polarização é que o enxerga assim. Cada
  grupo tem um campo `vistoComo`, que só mexe na polarização.
- **Todo grupo existe desde o começo, em níveis:** sem muitos adeptos,
  organizando, mobilizado e preocupação nacional. Cada grupo tem limites
  próprios por nível, calibrados para o turno 0 ficar como o Brasil em
  jan/2025. Só a partir de "mobilizado" ele age em público e aparece com
  destaque na tela.
- **Patrocínio completo:** patrocinadores com nomes satíricos (países,
  empresas, igrejas, fundações), um `K` por grupo e patrocinador,
  financiamento oculto, segurança e investigação para revelar.
- **Eventos sempre com causa.** Nada dispara só por sorte.
- **Efeitos provisórios.** Os efeitos finais das ações ficam para quando
  houver Senado e Supremo.

## 1. O que existe hoje (medido em 12/out)

- **Não há grupo de pressão no motor.** `politica.json` tem 4 "grupos"
  antigos que só servem à eleição antiga.
- **Ações soltas, sem ator:** greve dos servidores, ocupação de terras,
  panelaço, corrida contra a moeda, ataques de facção e milícia toma o
  bairro disparam por chance e por um índice. Ninguém "decide" a ação, e ela
  não para quando o governo atende.
- **11 dos 79 eventos não têm causa nenhuma** (nem condição, nem fator):
  aumento de demanda no atendimento, boom das matérias-primas, compatriota
  condenado no exterior, crise mundial do petróleo, descoberta de petróleo,
  espionagem revelada, golpe no vizinho, guerra comercial, sanções
  internacionais, seleção campeã e terremoto.
- **Situações com histerese** (V1-07) e **gatilho com fatores** (chance
  multiplicada numa faixa de um índice) já existem e servem a este desenho.
- **Senado e Supremo saíram da versão 1** (V1-04). O que depende deles fica
  anotado na seção 6.

## 2. Métodos atuais

- **Repertório de ação** (Tilly, 1978 e 2008): cada ator tem poucas ações
  que sabe fazer e escala dentro delas: campanha, ato, greve ou ocupação.
- **Mobilização de recursos** (McCarthy e Zald, 1977): insatisfação não
  basta; age mais quem tem dinheiro, gente organizada e mídia. Grupos
  pequenos e concentrados se organizam com mais facilidade que grupos
  grandes e difusos (Olson, 1965).
- **Limiar por ator** (Granovetter, 1978): cada grupo entra em ação num
  limite próprio. Isso responde à sua decisão 1.
- **Queixa menos risco** (Epstein, PNAS 2002): age quando a queixa menos o
  risco de punição passa do limiar. A repressão e a legitimidade do governo
  também mexem na mobilização.
- **Ciclos de protesto e contramovimento** (Tarrow, 1998; Meyer e
  Staggenborg, 1996): quando um lado vai à rua, o lado oposto também se
  mobiliza. Isso entra na seção 3.6.
- **Financiamento externo de movimentos** (estudos sobre "foreign agent
  laws" e financiamento de ONGs, Carothers e Brechenmacher, 2014;
  financiamento empresarial de "astroturfing", Walker, 2014): o dinheiro
  vem de quem tem interesse econômico na causa, e o grupo aceita ou não
  conforme a própria identidade. É a base do `K` da seção 4.

## 3. Proposta

### 3.1 Pressão e níveis

Todo grupo existe e tem pressão desde o turno 0. A pressão decide o
**nível** dele:

| Nível                   | O que significa                       | O que faz                                                                 | Na tela                                                       |
| ----------------------- | ------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 0. Sem muitos adeptos   | a causa existe, quase ninguém se mexe | nada                                                                      | só no painel, apagado                                         |
| 1. Organizando          | reuniões, redes, arrecadação          | nada em público; a pressão do contramovimento já sente                    | no painel, com "organizando"                                  |
| 2. Mobilizado           | vai à rua e à mídia                   | ações leves (campanha, ato, nota)                                         | no painel em destaque; ações no jornal, nas páginas de dentro |
| 3. Preocupação nacional | o país inteiro fala dele              | ações pesadas (greve, ocupação, bloqueio, corrida contra a moeda, ataque) | alerta na barra de cima, manchete do jornal                   |

- **Pressão** (0 a 100, nó `pressao_<grupo>`) = insatisfação da base
  (`Σ peso × (100 − satisfação)` dos segmentos que o grupo representa) +
  leis que tocam o interesse dele + índices + patrocínio (seção 4).
- **Limites por nível e por grupo:** cada passagem tem uma entrada (sobe de
  nível) e uma saída menor (desce), como nas situações do V1-07. Ex.:
  sindicatos de servidores sobem a "mobilizado" com pressão 55 e só descem
  com 45; a maior facção vive entre "mobilizado" e "preocupação nacional".
  Grupo com muita gente e pouca organização tem limites altos; grupo pequeno
  e organizado, baixos (Olson).
- **Nível** (nó `nivel_<grupo>`, de 0 a 3) sobe e desce um degrau por vez.
  Isso precisa de uma extensão pequena no motor: a situação ganha uma lista
  de níveis (`niveis: [{entrada, saida}, …]`) em vez de um par só. O resto
  (histerese, um degrau por mês) é o que a situação já faz.
- O país não declara valor para esses nós; o nível do turno 0 sai da conta.
  Os limites é que são calibrados (seção 3.5).

### 3.2 Recursos e "visto como"

- **Recursos**, de 1 a 3: **gente**, **dinheiro**, **mídia**, **força**.
  Multiplicam o efeito da ação que usa aquele recurso (greve usa gente,
  campanha usa dinheiro e mídia). O patrocínio soma no dinheiro.
- **Visto como:** esquerda, direita ou nenhum. Só decide para que lado a
  ação puxa a polarização e quem se mobiliza de volta (3.6). A causa do
  grupo continua sendo a base e os interesses dele.

### 3.3 Ações = eventos com causa

- **Condição:** nível 2 (mobilizado) para as ações leves; nível 3
  (preocupação nacional) para as pesadas.
- **Chance:** base por turno × quanto a pressão passa do limite do nível
  (fator de 1 a 3).
- **Toda ação nasce de uma causa** que o jogador consegue ver: a lei ou o
  índice que subiu a pressão do grupo aparece no texto ("contra a nova regra
  das câmeras corporais").
- **Eventos que já existem** são reaproveitados e **reescritos**: greve dos
  servidores, ocupação de terras, panelaço, corrida contra a moeda, ataques
  de facção, milícia toma o bairro. Ganham o grupo como ator e o texto com a
  causa.
- **Os 11 eventos sem causa** ganham uma (ex.: guerra comercial ←
  tensão internacional e tarifas; terremoto e seleção campeã ficam como
  únicos de pura sorte, se você concordar). A reescrita desses entra no
  V1-24 (eventos e dilemas); aqui fica só a regra.
- **Cadeias que você citou** viram ligações entre situações, como as do
  V1-07: meio ambiente em queda leva a queimadas, estiagem, enchente fora de
  época e protesto ambientalista; segurança baixa leva a tiroteio, domínio de
  tráfico e guerra entre facções.

### 3.4 Os 54 grupos

Base: pesos dos segmentos do V1-08. "Reage a": leis e índices que somam
pressão. Recursos: gente, dinheiro, mídia, força. Visto como: E (esquerda),
D (direita), N (nenhum).

**Trabalho**

| Grupo                                   | Base                                         | Reage a                                               | Recursos   | Visto | Ações                       |
| --------------------------------------- | -------------------------------------------- | ----------------------------------------------------- | ---------- | ----- | --------------------------- |
| Centrais sindicais                      | trabalhadores 0,6; informais 0,2; pobres 0,2 | legislação trabalhista, salário mínimo, terceirização | 3, 2, 1, 2 | E     | campanha, ato, greve geral  |
| Sindicatos de servidores                | servidores 1                                 | estabilidade, reajuste, regra fiscal                  | 2, 2, 1, 3 | E     | ato, greve de servidores    |
| Sindicatos de professores               | servidores 0,5; famílias com filhos 0,5      | piso dos professores, piso da educação                | 3, 1, 1, 2 | E     | ato, greve de professores   |
| Associações de aposentados              | aposentados 1                                | idade mínima, reajuste de benefícios                  | 2, 1, 1, 1 | N     | campanha, ato               |
| Entregadores e motoristas de aplicativo | informais 0,7; jovens 0,3                    | trabalho por aplicativo, preço dos combustíveis       | 2, 1, 2, 2 | N     | breque, ato                 |
| Caminhoneiros autônomos                 | informais 0,5; interior 0,5                  | preço dos combustíveis, pedágio, frete                | 2, 1, 1, 3 | D     | bloqueio de estradas, greve |
| Entidades médicas                       | classe média 0,5; ricos 0,5                  | médicos no interior, sistema de saúde                 | 1, 2, 2, 2 | D     | campanha, paralisação       |

**Empresas**

| Grupo                     | Base                                         | Reage a                                         | Recursos   | Visto | Ações                                     |
| ------------------------- | -------------------------------------------- | ----------------------------------------------- | ---------- | ----- | ----------------------------------------- |
| Confederação da indústria | empresários 0,8; trabalhadores 0,2           | tarifas, juros, imposto das empresas            | 1, 3, 3, 1 | N     | campanha, fuga de investimento            |
| Comércio e serviços       | pequenos empreendedores 0,6; empresários 0,4 | imposto sobre consumo, regime simplificado      | 1, 2, 2, 1 | N     | campanha, fechar portas                   |
| Entidades do agronegócio  | agronegócio 1                                | código florestal, agrotóxicos, terras indígenas | 2, 3, 2, 2 | D     | campanha, tratoraço, fuga de investimento |
| Mercado financeiro        | ricos 0,5; empresários 0,5                   | risco país, juros, regra fiscal                 | 1, 3, 3, 1 | D     | campanha, corrida contra a moeda          |
| Petróleo e mineração      | empresários 1                                | regime do petróleo, licenciamento               | 1, 3, 2, 1 | N     | campanha, suspender investimento          |
| Plataformas digitais      | ricos 1                                      | regulação das redes, proteção de dados          | 1, 3, 3, 1 | N     | campanha, mudar o algoritmo               |
| Indústria de armas        | empresários 1                                | armas de fogo                                   | 1, 2, 1, 1 | D     | campanha                                  |
| Casas de apostas          | empresários 1                                | apostas e jogos de azar                         | 1, 3, 2, 1 | N     | campanha                                  |

**Movimentos por direitos** (a polarização os vê como esquerda)

| Grupo                               | Base                                          | Reage a                                              | Recursos   | Visto | Ações                                 |
| ----------------------------------- | --------------------------------------------- | ---------------------------------------------------- | ---------- | ----- | ------------------------------------- |
| Movimentos por terra                | agricultura familiar 0,6; pobres 0,4          | reforma agrária, conflitos fundiários                | 3, 1, 1, 2 | E     | ato, bloqueio, ocupação de terras     |
| Movimentos por moradia              | periferias 0,6; pobres 0,4                    | habitação popular, déficit habitacional              | 3, 1, 1, 1 | E     | ato, ocupação urbana                  |
| Movimento estudantil                | jovens 0,7; progressistas 0,3                 | ensino superior, piso da educação                    | 3, 1, 2, 1 | E     | ato, ocupação de escolas              |
| Movimento negro                     | pobres 0,4; periferias 0,3; progressistas 0,3 | ações afirmativas, letalidade policial               | 2, 1, 2, 1 | E     | campanha, ato                         |
| Movimento feminista                 | progressistas 0,7; famílias com filhos 0,3    | aborto, igualdade salarial, violência doméstica      | 2, 1, 2, 1 | E     | campanha, ato                         |
| Movimento LGBT                      | progressistas 0,7; jovens 0,3                 | casamento e união civil, discriminação               | 2, 1, 2, 1 | E     | campanha, ato                         |
| Movimento ambientalista             | ambientalistas 1                              | desmatamento, licenciamento, emissões                | 2, 1, 2, 1 | E     | campanha, ato, bloqueio               |
| Povos originários                   | (nenhuma)                                     | terras indígenas, desmatamento, conflitos fundiários | 1, 1, 2, 2 | E     | ato, bloqueio, retomada de território |
| Comunidades quilombolas             | agricultura familiar 0,5; pobres 0,5          | titulação de terras, conflitos fundiários            | 1, 1, 1, 1 | E     | ato                                   |
| Atingidos por barragens e mineração | interior 0,6; pobres 0,4                      | rompimento de barragem, licenciamento                | 2, 1, 1, 1 | E     | ato, ocupação                         |
| Movimento pela saúde pública        | pobres 0,5; servidores 0,5                    | piso da saúde, sistema de saúde                      | 2, 1, 1, 1 | E     | campanha, ato                         |

**Movimentos políticos de esquerda**

| Grupo                         | Base                                      | Reage a                                       | Recursos   | Visto | Ações         |
| ----------------------------- | ----------------------------------------- | --------------------------------------------- | ---------- | ----- | ------------- |
| Frentes populares de esquerda | progressistas 0,6; pobres 0,2; jovens 0,2 | risco de golpe, anistia, aprovação do governo | 3, 1, 2, 1 | E     | campanha, ato |

**Movimentos de direita**

| Grupo                                        | Base                                            | Reage a                                               | Recursos   | Visto | Ações                                       |
| -------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------- | ---------- | ----- | ------------------------------------------- |
| Movimentos liberais de rua                   | classe média 0,5; conservadores 0,3; jovens 0,2 | corrupção, carga tributária, regra fiscal             | 3, 2, 3, 1 | D     | campanha, ato, pedido de impeachment        |
| Movimentos conservadores de costumes         | conservadores 0,6; evangélicos 0,4              | aborto, drogas, educação domiciliar, casamento        | 3, 2, 2, 1 | D     | campanha, ato                               |
| Movimento armamentista                       | conservadores 0,7; interior 0,3                 | armas de fogo, excludente de ilicitude                | 2, 2, 2, 2 | D     | campanha, ato                               |
| Ruralistas de base                           | agronegócio 0,6; interior 0,4                   | reforma agrária, ocupação de terras, terras indígenas | 2, 2, 1, 3 | D     | ato, tratoraço, autodefesa armada           |
| Militares da reserva e grupos de intervenção | conservadores 0,8; servidores 0,2               | confiança nas instituições, estabilidade política     | 2, 1, 2, 3 | D     | campanha, acampamento, pressão nos quartéis |
| Rede de influenciadores de direita           | conservadores 0,5; jovens 0,3; evangélicos 0,2  | regulação das redes, aprovação do governo             | 1, 2, 3, 1 | D     | campanha de desinformação, convocar atos    |

**Religião**

| Grupo                            | Base                                                | Reage a                                    | Recursos   | Visto | Ações                                                        |
| -------------------------------- | --------------------------------------------------- | ------------------------------------------ | ---------- | ----- | ------------------------------------------------------------ |
| Igrejas neopentecostais          | evangélicos 0,8; periferias 0,2                     | costumes, laicidade, imposto sobre igrejas | 3, 3, 3, 1 | D     | campanha, mobilização de fiéis, pauta no rádio e TV próprios |
| Igrejas evangélicas tradicionais | evangélicos 0,7; conservadores 0,3                  | costumes, educação domiciliar              | 2, 1, 1, 1 | D     | campanha                                                     |
| Hierarquia católica              | católicos 0,7; pobres 0,3                           | aborto, eutanásia, fome                    | 2, 1, 2, 1 | N     | campanha, mobilização de fiéis                               |
| Pastorais sociais católicas      | católicos 0,5; pobres 0,3; agricultura familiar 0,2 | fome, reforma agrária, moradia             | 2, 1, 1, 1 | E     | campanha, ato                                                |
| Religiões de matriz africana     | pobres 0,5; periferias 0,5                          | discriminação, laicidade                   | 1, 1, 1, 1 | E     | ato                                                          |

**Estado e força**

| Grupo                    | Base                              | Reage a                                        | Recursos   | Visto | Ações                            |
| ------------------------ | --------------------------------- | ---------------------------------------------- | ---------- | ----- | -------------------------------- |
| Associações de policiais | conservadores 0,6; servidores 0,4 | câmeras corporais, ciclo policial, previdência | 2, 1, 1, 3 | D     | operação padrão, greve branca    |
| Associações de militares | servidores 0,5; conservadores 0,5 | gasto com defesa, previdência, serviço militar | 1, 1, 1, 3 | D     | nota pública, pressão no comando |

**Mídia** (sem nomes reais; cada um tem dono, linha editorial e interesse)

| Grupo                          | Base                        | Reage a                                                | Recursos   | Visto | Ações                                                         |
| ------------------------------ | --------------------------- | ------------------------------------------------------ | ---------- | ----- | ------------------------------------------------------------- |
| A maior rede de TV aberta      | ricos 0,5; classe média 0,5 | regulação das redes, publicidade oficial               | 1, 3, 3, 1 | N     | pauta negativa, pauta positiva                                |
| Rede de TV ligada a uma igreja | evangélicos 1               | costumes, laicidade                                    | 1, 2, 3, 1 | D     | pauta negativa, campanha                                      |
| Grupo de jornais e portais     | ricos 0,5; empresários 0,5  | regra fiscal, liberdade de imprensa                    | 1, 2, 3, 1 | N     | pauta negativa, editorial                                     |
| Rede de rádio e TV popular     | pobres 0,5; interior 0,5    | segurança, preço dos alimentos                         | 1, 2, 3, 1 | D     | pauta policial, pauta negativa                                |
| Mídia internacional            | (nenhuma)                   | desmatamento, direitos, golpe, reputação internacional | 1, 1, 3, 1 | N     | reportagem no exterior, que derruba a reputação internacional |

**Crime**

| Grupo                     | Base      | Reage a                                                | Recursos   | Visto | Ações                                       |
| ------------------------- | --------- | ------------------------------------------------------ | ---------- | ----- | ------------------------------------------- |
| A maior facção prisional  | (nenhuma) | repressão (penas, presídios, isolamento), Estado fraco | 2, 3, 1, 3 | N     | ameaça, ataques, rebelião em presídio       |
| Facção rival regional     | (nenhuma) | disputa de território com a maior                      | 2, 2, 1, 3 | N     | guerra entre facções, tiroteio              |
| Milícias                  | (nenhuma) | polícia fraca nas periferias, corrupção                | 1, 2, 1, 3 | N     | domínio de bairro, cobrança de "taxa"       |
| Garimpo e madeira ilegais | (nenhuma) | fiscalização ambiental, terras indígenas               | 1, 3, 1, 3 | N     | invasão de terra indígena, ataque a fiscais |

**Separatistas** (um por região do país, tirado de `paises/<pais>`)

| Grupo                                                                    | Base                                 | Reage a                                                                   | Recursos   | Visto                                 | Ações                         |
| ------------------------------------------------------------------------ | ------------------------------------ | ------------------------------------------------------------------------- | ---------- | ------------------------------------- | ----------------------------- |
| Separatistas do Norte, do Nordeste, do Sul, do Sudeste e do Centro-Oeste | a insatisfação da região (seção 3.7) | federalismo (centralização), desigualdade regional, impostos para a União | 1, 1, 1, 1 | D no Sul, E no Nordeste, N nos outros | campanha, plebiscito informal |

Quase sempre parados: a pressão começa bem abaixo do limite e só cresce com
crise longa na região.

### 3.5 Turno 0 = Brasil em jan/2025

Todos os 54 começam existindo. Os limites de cada grupo são ajustados para
o turno 0 ficar assim (este é o modo "Brasil 2025"; outros modos podem
começar diferente):

| Nível no turno 0        | Grupos                                                                                                   | Por quê (jan/2025)                                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 3. Preocupação nacional | Mercado financeiro                                                                                       | Pânico fiscal de dez/2024, câmbio na máxima                                                              |
| 3. Preocupação nacional | A maior facção, milícias                                                                                 | Agem o tempo todo, em escala nacional                                                                    |
| 2. Mobilizado           | Rede de influenciadores de direita, movimentos conservadores de costumes                                 | Crise da norma do Pix (revogada em 15/jan), campanha pela anistia (ato em 16/mar)                        |
| 2. Mobilizado           | Igrejas neopentecostais                                                                                  | Oposição aberta ao governo                                                                               |
| 2. Mobilizado           | Sindicatos de professores                                                                                | Educação liderou as greves de 2025 (49% das greves no setor público, DIEESE)                             |
| 2. Mobilizado           | Povos originários; garimpo e madeira ilegais; facção rival                                               | Disputa do marco temporal; crime ambiental e disputa de território contínuos                             |
| 1. Organizando          | Entregadores de aplicativo, movimentos por terra, frentes populares de esquerda, movimento ambientalista | Breque de 31/mar; jornada de abril; atos contra a anistia em 30/mar; ano da conferência do clima no país |
| 0 ou 1                  | Todos os outros                                                                                          | Sem mobilização nacional em jan/2025 (os servidores federais fecharam acordo depois da greve de 2024)    |

### 3.6 Contramovimento

Quando um grupo visto como esquerda age, sobe a pressão dos grupos vistos
como direita que reagem ao mesmo tema, e vice-versa (ex.: ocupação de terra
sobe os ruralistas de base). Com isso, a polarização vira consequência do
jogo, não um número solto.

### 3.7 Regiões

O país ganha uma lista de regiões com parte da população e a aprovação de
cada uma (Quaest jan/2025: Nordeste 59%, Sudeste 42%, Sul 39%, Norte e
Centro-Oeste 48%). A insatisfação da região é a distância da aprovação dela
para a nacional, mais a desigualdade regional. Ela serve aos separatistas
agora e à eleição por estado depois (V1-12).

## 4. Patrocínio

### 4.1 Patrocinadores (sátira)

O mundo ganha um arquivo `mundo/patrocinadores.json` com patrocinadores de
nome satírico: dá para reconhecer quem é, mas nenhum nome real aparece. A
mídia nacional fica no arquivo do país, porque muda de país para país.

**Países**

| Id              | No jogo                                                            | Interesses                                         |
| --------------- | ------------------------------------------------------------------ | -------------------------------------------------- |
| `liberdolandia` | **Liberdolândia**, a grande potência militar                       | bases, tecnologia, petróleo, plataformas           |
| `dragao`        | **República Popular do Dragão**, a fábrica do mundo                | minério, soja, portos, ferrovias                   |
| `eurocracia`    | **União Eurocrática**, o bloco das regras e dos subsídios          | clima, florestas, regras de comércio               |
| `grande_urso`   | **Grande Urso Federado**, a potência do gás e das armas            | energia, fertilizantes, desinformação              |
| `iranio`        | **República Islâmica do Irânio**, a teocracia que enriquece urânio | religião, petróleo, rivalidade com a Liberdolândia |
| `petrabia`      | **Reino da Petrábia**, os petrodólares do deserto                  | petróleo, futebol, fundos soberanos                |
| `bilhindia`     | **União da Bilhíndia**, o gigante de um bilhão e meio              | remédios genéricos, tecnologia, grãos              |

**Empresas**

| Id              | No jogo                                        | Setor e interesse                                             |
| --------------- | ---------------------------------------------- | ------------------------------------------------------------- |
| `invidia`       | **Invídia Chips**                              | chips e IA; data centers, energia barata                      |
| `metade`        | **Metade Plataformas**                         | redes sociais; contra a regulação das redes                   |
| `gogol`         | **Gogol Busca**                                | busca e publicidade; contra a regulação e o imposto digital   |
| `ipsilon`       | **Ípsilon**, a rede do bilionário dos foguetes | rede social; contra a regulação, a favor da "liberdade total" |
| `tiquetaque`    | **TiqueTaque**                                 | vídeos curtos; dados dos jovens                               |
| `amozao`        | **Amozão Entregas**                            | comércio online; contra tributação e regras dos entregadores  |
| `janelas`       | **Janelas S.A.**                               | programas e nuvem; contratos com o governo                    |
| `ouro_sacos`    | **Ouro & Sacos**                               | banco de investimento; juros, regra fiscal                    |
| `pedra_negra`   | **PedraNegra Investimentos**                   | fundo gigante; privatizações, clima "verde" de fachada        |
| `exagero_mobil` | **Exagero Mobil**                              | petróleo; contra transição energética                         |
| `concha`        | **Concha Petróleo**                            | petróleo em águas profundas                                   |
| `monstanto`     | **Monstanto Sementes**                         | sementes e agrotóxicos                                        |
| `cargao`        | **Cargão Grãos**                               | comércio de soja; contra o código florestal                   |
| `lucro_martin`  | **Lucro Martin Defesa**                        | armas e aviões; gasto com defesa                              |
| `touro_armas`   | **Touro Armas**                                | armas leves; flexibilizar a posse e o porte                   |
| `bet366`        | **Bet366**                                     | apostas; contra restrição às apostas                          |
| `pfazer`        | **Pfaz-Tudo Farma**                            | remédios; patentes, contra genéricos                          |

**Igrejas e fundações**

| Id                      | No jogo                                                        | Interesse                                       |
| ----------------------- | -------------------------------------------------------------- | ----------------------------------------------- |
| `reino_dizimo`          | **Igreja Mundial do Reino do Dízimo**                          | costumes, isenção de impostos, concessões de TV |
| `assembleia_geral`      | **Assembleia Geral de Deus**                                   | costumes, cargos                                |
| `santa_sede_central`    | **A Santa Sede Central**                                       | aborto, eutanásia, fome                         |
| `cinturao_biblico`      | **Fundação Evangélica do Cinturão Bíblico** (da Liberdolândia) | costumes, aliados no exterior                   |
| `sociedade_escancarada` | **Fundação Sociedade Escancarada**                             | direitos civis, imprensa, drogas                |
| `portoes`               | **Fundação Portões**                                           | vacinas, saúde, agricultura                     |
| `floresta_eterna`       | **Fundo Floresta Eterna** (da União Eurocrática)               | florestas, povos originários                    |

**Mídia nacional do Brasil** (em `paises/brasil`)

| Id                 | No jogo                                                           |
| ------------------ | ----------------------------------------------------------------- |
| `rede_bolha`       | **Rede Bolha**, a maior rede de TV aberta                         |
| `rede_recorde`     | **Rede Recorde**, a TV ligada à Igreja Mundial do Reino do Dízimo |
| `folha_estadinho`  | **Folha do Estadinho**, os jornais e portais                      |
| `tv_aviaozinho`    | **TV Aviãozinho**, a rede popular de rádio e TV                   |
| `rede_mundial_24h` | **Rede Mundial 24h**, a mídia internacional (no mundo)            |

O Brasil não é patrocinador no modo Brasil, porque é o governo do jogador.
Num modo com outro país, entra como **República das Bananas Federativas**
(sugestão).

### 4.2 Quanto e para quem

- **Poder econômico** do patrocinador (1 a 5): o orçamento que ele pode pôr.
- **Interesse ameaçado:** quanto as leis e índices que ele quer estão longe
  do que ele quer. Lei que ameaça o interesse aumenta o dinheiro.
- **`K` (0 a 1) por grupo e patrocinador:** quanto o grupo aceita dinheiro
  daquele patrocinador. Ex.: os movimentos ambientalistas aceitam bem
  o Fundo Floresta Eterna e quase nada da Monstanto; a rede de
  influenciadores de direita aceita bem a Liberdolândia e a Ípsilon; as igrejas
  neopentecostais, a Igreja Mundial do Reino do Dízimo e o Cinturão Bíblico.
- **Dinheiro que chega** = `K × interesse ameaçado × poder econômico`. Ele
  soma nos recursos (dinheiro) e na pressão do grupo, mesmo com a base
  satisfeita.

### 4.3 Oculto até ser revelado

- Quase todo patrocínio começa oculto: a tela mostra "financiado por: ?".
- **Revelar exige:**
  - **Capacidade de investigação**, que vem de leis (as novas são da seção
    4.4);
  - **Investigação:** o jogador abre uma investigação sobre um grupo. A
    chance de sucesso por turno = `capacidade / (capacidade + c × poder
econômico do patrocinador)`. Patrocinador rico esconde melhor.
- **Revelado:** o grupo perde parte da legitimidade (pressão e mídia caem),
  o patrocinador perde acesso, e a relação com o país dele piora
  (reputação, tensão internacional).

### 4.4 Leis de inteligência e vigilância (novas)

A capacidade de investigação sai de um índice novo, `capacidade_inteligencia`,
que recebe destas leis. Cada uma também tem custo: liberdade civil,
privacidade, dinheiro, e a pressão dos grupos que reagem a ela.

| Lei                                                         | Opções (da mais fraca à mais forte)                                                               | Ajuda a investigar                                              | Custa                                                                                   |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Programa espacial e satélites** (recursos)                | verba por ano                                                                                     | imagem de desmatamento, garimpo, fronteira; comunicação própria | dinheiro                                                                                |
| **Agência de inteligência e contrainteligência** (recursos) | verba por ano                                                                                     | investigação de patrocínio, espionagem estrangeira              | dinheiro; risco de abuso                                                                |
| **Verba da Polícia Federal** (já existe)                    | verba por ano                                                                                     | crime organizado, lavagem, patrocínio                           | dinheiro                                                                                |
| **Interceptação telefônica e digital**                      | proibida; só com ordem judicial e prazo; com ordem e sem prazo; sem ordem em "segurança nacional" | muito                                                           | liberdade civil, confiança nas instituições; movimentos de direitos e a imprensa reagem |
| **Câmeras e reconhecimento facial**                         | proibido; só em locais públicos com regra; em toda a cidade; com cadastro nacional de rostos      | crimes de rua, foragidos                                        | privacidade; erro maior com negros (o movimento negro reage)                            |
| **Poderes da polícia na investigação**                      | só com ordem; infiltração e ação controlada; quebra de sigilo sem ordem                           | facções, milícias, patrocínio                                   | liberdade civil; associações de policiais apoiam                                        |
| **Posse e porte de armas** (já existe)                      | —                                                                                                 | (inverso) mais armas em circulação dificulta                    | —                                                                                       |
| **Proteção de dados pessoais** (já existe)                  | —                                                                                                 | (inverso) mais proteção dificulta                               | —                                                                                       |

As leis novas seguem a ficha v3 do V1-05 e entram no catálogo; o texto de
cada opção é escrito na implementação.

## 5. Tela

- **Jornal:** ação de grupo em "preocupação nacional" sai como manchete, com
  o grupo e a causa ("Caminhoneiros bloqueiam estradas contra o preço do
  diesel"); ação de grupo "mobilizado" sai nas páginas de dentro. Subir de
  nível também é notícia ("Entregadores começam a se organizar").
- **Painel:** uma aba "Pressão" ao lado do "Eleitorado". Todos os grupos,
  por tipo, com o nível escrito ("organizando", "mobilizado"…), a barra de
  pressão com os limites de cada nível, a última ação e "financiado por"
  (com "?" quando oculto). Níveis 0 e 1 aparecem apagados.
- **Barra de cima:** um alerta para cada grupo em "preocupação nacional".
- **Mapa:** sem bolha para os grupos de pressão; ficam no painel e no
  jornal. (Se preferir as bolhas, é só dizer.)

## 6. Fica para depois

- **Efeitos finais das ações:** combinamos de pensar quando houver Senado e
  Supremo. Nesta etapa, cada ação tem um efeito pequeno e provisório num
  índice (para o aceite) e na aprovação. O capital político (V1-10) também
  entra aqui.
- **Patrocinador que financia senadores e ministros do Supremo:** depende do
  parlamento e do Judiciário, que saíram da versão 1 (V1-04). Fica anotado
  para a versão 2. Se você quiser trazer de volta uma parte antes, precisa de
  um chamado novo.
- **Lobby no parlamento:** continua fora (versão 2).
- **Negociar com o grupo** (atender a pauta em troca de desmobilizar): usa o
  capital político, então entra no V1-10.

## 7. Aceite (do chamado, com o que o teste confere)

- Grupo sobe de nível quando passa da entrada do nível e desce quando cai à
  saída: baixar a satisfação dos servidores leva os sindicatos de servidores
  de "organizando" a "mobilizado"; subir até a saída volta a "organizando";
  entre os dois, continua como estava. Sobe e desce um degrau por vez.
- Cada ação tem efeito em índice ou capital: o teste percorre as ações e
  confere que toda ação tem ao menos uma ligação para um índice (ou para a
  aprovação, até o V1-10).
- Turno 0: cada grupo está no nível da tabela 3.5.
- Nenhum nome real de país, empresa ou igreja nos arquivos do jogo.
- Patrocínio oculto não aparece na tela; investigação com sucesso revela.

## 8. Decisões do autor (12/out)

1. Os quatro níveis: **sim**.
2. Os 54 grupos: **sim**, como estão.
3. Nomes dos países (seção 4.1): Liberdolândia, República Popular do
   Dragão, União Eurocrática, Grande Urso Federado, República Islâmica do
   Irânio, Reino da Petrábia e União da Bilhíndia. A sátira usa símbolos do
   país, sem julgamento político nem piada étnica. Empresas, igrejas e mídia
   ficaram como estavam.
4. Turno 0: **sim**.
5. Inteligência: **leis novas** (programa espacial e satélites, agência de
   inteligência, interceptação, câmeras e reconhecimento facial, poderes da
   polícia), mais as que já existem (verba da PF, armas, proteção de dados).
   Seção 4.4.
6. Efeitos provisórios das ações: **sim**. Até existirem Senado e Supremo,
   cada ação tem um efeito pequeno e direto num índice e na aprovação.

## 9. Como ficou (implementação, 12/out)

- **Motor:** a situação ganhou `niveis` (`[{entrada, saida}, …]`); o valor
  é o nível e anda um degrau por mês (`computeNetwork.ts`). Na largada
  (`createExecution.ts`) o nível é o que a soma sustenta, sem histerese:
  sem isso, os picos das passadas de acerto deixavam 22 grupos um nível
  acima.
- **Mundo:** `mundo/pressao.json` (49 grupos e o modelo dos separatistas,
  39 ações, 10 seções) e `mundo/patrocinadores.json` (31 patrocinadores,
  `escala` 0,05). **País:** `paises/brasil/pressao.json` (nomes da mídia,
  regiões com a aprovação da Quaest, turno 0 e limites). O país sem o
  arquivo não carrega; o país de teste tem um mínimo, sem regiões.
- **Carga:** `src/game/pais/pressao/expandirPressao.ts` vira tudo em nós,
  setas e eventos: `pressao_<grupo>`, `nivel_<grupo>`, `interesse_<quem>`,
  `acesso_<grupo>__<quem>`, `revelado_<grupo>` e um evento por ação. Os
  reaproveitados (greve dos servidores, ocupação de terras, panelaço,
  fuga de capitais, ataques de facção, milícia) ganharam o grupo, o nível
  e "O motivo: {causa}".
- **Limites:** `npm run pressao:calibrar` grava os limites para cada grupo
  ficar no nível do turno 0 no aquecimento inteiro: a entrada do nível de
  cima fica `2 + 1,5 × gente` acima da maior pressão (separatistas: 25), e
  nenhuma passa de 97. Os 54 batem.
- **Partida:** as ações têm cota própria, fora da dos eventos: uma pesada e
  duas leves por turno, uma por grupo. A causa é o termo que mais empurra a
  pressão naquele turno. O nível de cada grupo e as mudanças ficam em
  `GameState.pressure` (`src/game/pressao.ts`).
- **Investigação:** até 2 ao mesmo tempo, 4 turnos cada. A cada turno, cada
  patrocinador oculto do grupo é achado com `capacidade ÷ (capacidade + 20
× poder)`; achou um, ela acaba (dá para abrir outra). O revelado perde o
  acesso (o dinheiro para) e o grupo perde 6 pontos de pressão; país
  revelado dispara um evento de tensão internacional.
- **Leis novas (ficha v3):** programa espacial e satélites, agência de
  inteligência, interceptação, câmeras e reconhecimento facial, poderes da
  polícia. Somam no índice `capacidade_inteligencia` com a verba da PF;
  proteção de dados e armas em circulação tiram. O Brasil começa com
  capacidade 18. As verbas vigentes do programa espacial (R$ 250 mi) e da
  agência (R$ 900 mi) são ordem de grandeza, a conferir.
- **Escolhas minhas, para você revisar:**
  - O efeito na liberdade civil é zero na opção com ordem judicial (a
    vigente) e só pesa quando a salvaguarda cai. Sem isso o contexto da
    liberdade civil passava de 50 e a trava da rede (V1-07) acusava.
  - A verba da PF perdeu o efeito na polarização (0,8 ponto) para caber o
    da capacidade: a ficha tem no máximo 8 efeitos.
  - Movimento negro reage às câmeras, o grupo de jornais à interceptação, e
    as associações de policiais querem mais poderes na investigação.
  - O alerta de preocupação nacional ficou numa faixa no alto do mapa, não
    na barra: na barra ele espremia a dívida.
- **Ainda a olhar:** em 80 turnos no piloto automático, 23 grupos chegam
  a mobilizado ou mais. Os efeitos e a chance das ações são provisórios
  (decisão 6) e a série do `rede:calibrar` deve rever isso.

## Fontes

- Tilly, C. (1978). _From Mobilization to Revolution._ Addison-Wesley.
- Tilly, C. (2008). _Contentious Performances._ Cambridge University Press.
- McCarthy, J. D.; Zald, M. N. (1977). _Resource mobilization and social
  movements: a partial theory._ American Journal of Sociology 82(6).
- Olson, M. (1965). _The Logic of Collective Action._ Harvard University
  Press.
- Granovetter, M. (1978). _Threshold models of collective behavior._
  American Journal of Sociology 83(6).
- Epstein, J. M. (2002). _Modeling civil violence: an agent-based
  computational approach._ PNAS 99 (supl. 3).
- Tarrow, S. (1998). _Power in Movement._ Cambridge University Press.
- Meyer, D. S.; Staggenborg, S. (1996). _Movements, countermovements, and
  the structure of political opportunity._ American Journal of Sociology
  101(6).
- Carothers, T.; Brechenmacher, S. (2014). _Closing Space: Democracy and
  Human Rights Support Under Fire._ Carnegie Endowment.
- Walker, E. T. (2014). _Grassroots for Hire: Public Affairs Consultants in
  American Democracy._ Cambridge University Press.
- Genial/Quaest, jan/2025, aprovação por região:
  <https://www.folhape.com.br/politica/aprovacao-de-lula-cai-5-pp-de-52-para-47-aponta-pesquisa/387067/>
- DIEESE, greves no 1º semestre de 2025 (536 greves; educação, 49% das do
  setor público): <https://vermelho.org.br/2026/01/13/greves-crescem-16-no-brasil-no-primeiro-semestre-de-2025/>
- Atos pela anistia (16/mar/2025) e contra (30/mar/2025):
  <https://oimparcial.com.br/politica/2025/03/bolsonaro-volta-a-copacabana-tenta-focar-anistia-e-deixa-protestos-contra-lula-em-2o-plano/>,
  <https://ohoje.com/2025/03/30/protestos-contra-anistia-de-condenados-do-8-de-janeiro-mobilizam-capitais/>
