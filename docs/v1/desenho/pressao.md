# Grupos de pressão (V1-09)

**Status:** PARA APROVAÇÃO (versão 2, com as mudanças de 12/out à noite). O
código só começa depois do seu ok.

## 0. O que mudou da versão 1

- **Muito mais grupos:** 54 em vez de 20, incluindo os movimentos de direita,
  duas correntes evangélicas, quatro grupos de mídia nacionais e a mídia
  internacional, três grupos do crime e os separatistas por região.
- **"Visto como" separado da causa.** Um movimento que luta por um direito
  não é "de esquerda" por natureza; a polarização é que o enxerga assim. Cada
  grupo tem um campo `vistoComo`, que só mexe na polarização.
- **Limite próprio por grupo**, calibrado para o turno 0 ficar como o Brasil
  em jan/2025.
- **Patrocínio completo:** patrocinadores com interesse econômico, um `K`
  por grupo e patrocinador, financiamento oculto, segurança e investigação
  para revelar.
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

### 3.1 Mobilização = uma situação por grupo

Cada grupo vira um nó `pressao_<grupo>` do tipo **situação**, sem
mecanismo novo no motor:

- **Pressão** = insatisfação da base (`Σ peso × (100 − satisfação)` dos
  segmentos que o grupo representa) + leis que tocam o interesse dele +
  índices + patrocínio (seção 4).
- **Limites próprios:** cada grupo tem `entrada` (mobiliza) e `saida`
  (desmobiliza, quando é atendido). Entre os dois, fica como estava.
- **Intensidade** enquanto mobilizado = pressão − saída.
- O país não declara valor para esses nós; quem está mobilizado no turno 0
  sai da conta. Os limites é que são calibrados (seção 3.5).

### 3.2 Recursos e "visto como"

- **Recursos**, de 1 a 3: **gente**, **dinheiro**, **mídia**, **força**.
  Multiplicam o efeito da ação que usa aquele recurso (greve usa gente,
  campanha usa dinheiro e mídia). O patrocínio soma no dinheiro.
- **Visto como:** esquerda, direita ou nenhum. Só decide para que lado a
  ação puxa a polarização e quem se mobiliza de volta (3.6). A causa do
  grupo continua sendo a base e os interesses dele.

### 3.3 Ações = eventos com causa

- **Condição:** o grupo está mobilizado (`pressao_<grupo>` > 0).
- **Chance:** base por turno × intensidade (fator de 1 a 3 entre intensidade
  0 e 30).
- **Escala:** ações leves (campanha, ato) com qualquer intensidade; pesadas
  (greve, ocupação, bloqueio, fuga de investimento, ataque) com intensidade
  10 ou mais.
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

| Grupo | Base | Reage a | Recursos | Visto | Ações |
| --- | --- | --- | --- | --- | --- |
| Centrais sindicais | trabalhadores 0,6; informais 0,2; pobres 0,2 | legislação trabalhista, salário mínimo, terceirização | 3, 2, 1, 2 | E | campanha, ato, greve geral |
| Sindicatos de servidores | servidores 1 | estabilidade, reajuste, regra fiscal | 2, 2, 1, 3 | E | ato, greve de servidores |
| Sindicatos de professores | servidores 0,5; famílias com filhos 0,5 | piso dos professores, piso da educação | 3, 1, 1, 2 | E | ato, greve de professores |
| Associações de aposentados | aposentados 1 | idade mínima, reajuste de benefícios | 2, 1, 1, 1 | N | campanha, ato |
| Entregadores e motoristas de aplicativo | informais 0,7; jovens 0,3 | trabalho por aplicativo, preço dos combustíveis | 2, 1, 2, 2 | N | breque, ato |
| Caminhoneiros autônomos | informais 0,5; interior 0,5 | preço dos combustíveis, pedágio, frete | 2, 1, 1, 3 | D | bloqueio de estradas, greve |
| Entidades médicas | classe média 0,5; ricos 0,5 | médicos no interior, sistema de saúde | 1, 2, 2, 2 | D | campanha, paralisação |

**Empresas**

| Grupo | Base | Reage a | Recursos | Visto | Ações |
| --- | --- | --- | --- | --- | --- |
| Confederação da indústria | empresários 0,8; trabalhadores 0,2 | tarifas, juros, imposto das empresas | 1, 3, 3, 1 | N | campanha, fuga de investimento |
| Comércio e serviços | pequenos empreendedores 0,6; empresários 0,4 | imposto sobre consumo, regime simplificado | 1, 2, 2, 1 | N | campanha, fechar portas |
| Entidades do agronegócio | agronegócio 1 | código florestal, agrotóxicos, terras indígenas | 2, 3, 2, 2 | D | campanha, tratoraço, fuga de investimento |
| Mercado financeiro | ricos 0,5; empresários 0,5 | risco país, juros, regra fiscal | 1, 3, 3, 1 | D | campanha, corrida contra a moeda |
| Petróleo e mineração | empresários 1 | regime do petróleo, licenciamento | 1, 3, 2, 1 | N | campanha, suspender investimento |
| Plataformas digitais | ricos 1 | regulação das redes, proteção de dados | 1, 3, 3, 1 | N | campanha, mudar o algoritmo |
| Indústria de armas | empresários 1 | armas de fogo | 1, 2, 1, 1 | D | campanha |
| Casas de apostas | empresários 1 | apostas e jogos de azar | 1, 3, 2, 1 | N | campanha |

**Movimentos por direitos** (a polarização os vê como esquerda)

| Grupo | Base | Reage a | Recursos | Visto | Ações |
| --- | --- | --- | --- | --- | --- |
| Movimentos por terra | agricultura familiar 0,6; pobres 0,4 | reforma agrária, conflitos fundiários | 3, 1, 1, 2 | E | ato, bloqueio, ocupação de terras |
| Movimentos por moradia | periferias 0,6; pobres 0,4 | habitação popular, déficit habitacional | 3, 1, 1, 1 | E | ato, ocupação urbana |
| Movimento estudantil | jovens 0,7; progressistas 0,3 | ensino superior, piso da educação | 3, 1, 2, 1 | E | ato, ocupação de escolas |
| Movimento negro | pobres 0,4; periferias 0,3; progressistas 0,3 | ações afirmativas, letalidade policial | 2, 1, 2, 1 | E | campanha, ato |
| Movimento feminista | progressistas 0,7; famílias com filhos 0,3 | aborto, igualdade salarial, violência doméstica | 2, 1, 2, 1 | E | campanha, ato |
| Movimento LGBT | progressistas 0,7; jovens 0,3 | casamento e união civil, discriminação | 2, 1, 2, 1 | E | campanha, ato |
| Movimento ambientalista | ambientalistas 1 | desmatamento, licenciamento, emissões | 2, 1, 2, 1 | E | campanha, ato, bloqueio |
| Povos originários | (nenhuma) | terras indígenas, desmatamento, conflitos fundiários | 1, 1, 2, 2 | E | ato, bloqueio, retomada de território |
| Comunidades quilombolas | agricultura familiar 0,5; pobres 0,5 | titulação de terras, conflitos fundiários | 1, 1, 1, 1 | E | ato |
| Atingidos por barragens e mineração | interior 0,6; pobres 0,4 | rompimento de barragem, licenciamento | 2, 1, 1, 1 | E | ato, ocupação |
| Movimento pela saúde pública | pobres 0,5; servidores 0,5 | piso da saúde, sistema de saúde | 2, 1, 1, 1 | E | campanha, ato |

**Movimentos políticos de esquerda**

| Grupo | Base | Reage a | Recursos | Visto | Ações |
| --- | --- | --- | --- | --- | --- |
| Frentes populares de esquerda | progressistas 0,6; pobres 0,2; jovens 0,2 | risco de golpe, anistia, aprovação do governo | 3, 1, 2, 1 | E | campanha, ato |

**Movimentos de direita**

| Grupo | Base | Reage a | Recursos | Visto | Ações |
| --- | --- | --- | --- | --- | --- |
| Movimentos liberais de rua | classe média 0,5; conservadores 0,3; jovens 0,2 | corrupção, carga tributária, regra fiscal | 3, 2, 3, 1 | D | campanha, ato, pedido de impeachment |
| Movimentos conservadores de costumes | conservadores 0,6; evangélicos 0,4 | aborto, drogas, educação domiciliar, casamento | 3, 2, 2, 1 | D | campanha, ato |
| Movimento armamentista | conservadores 0,7; interior 0,3 | armas de fogo, excludente de ilicitude | 2, 2, 2, 2 | D | campanha, ato |
| Ruralistas de base | agronegócio 0,6; interior 0,4 | reforma agrária, ocupação de terras, terras indígenas | 2, 2, 1, 3 | D | ato, tratoraço, autodefesa armada |
| Militares da reserva e grupos de intervenção | conservadores 0,8; servidores 0,2 | confiança nas instituições, estabilidade política | 2, 1, 2, 3 | D | campanha, acampamento, pressão nos quartéis |
| Rede de influenciadores de direita | conservadores 0,5; jovens 0,3; evangélicos 0,2 | regulação das redes, aprovação do governo | 1, 2, 3, 1 | D | campanha de desinformação, convocar atos |

**Religião**

| Grupo | Base | Reage a | Recursos | Visto | Ações |
| --- | --- | --- | --- | --- | --- |
| Igrejas neopentecostais | evangélicos 0,8; periferias 0,2 | costumes, laicidade, imposto sobre igrejas | 3, 3, 3, 1 | D | campanha, mobilização de fiéis, pauta no rádio e TV próprios |
| Igrejas evangélicas tradicionais | evangélicos 0,7; conservadores 0,3 | costumes, educação domiciliar | 2, 1, 1, 1 | D | campanha |
| Hierarquia católica | católicos 0,7; pobres 0,3 | aborto, eutanásia, fome | 2, 1, 2, 1 | N | campanha, mobilização de fiéis |
| Pastorais sociais católicas | católicos 0,5; pobres 0,3; agricultura familiar 0,2 | fome, reforma agrária, moradia | 2, 1, 1, 1 | E | campanha, ato |
| Religiões de matriz africana | pobres 0,5; periferias 0,5 | discriminação, laicidade | 1, 1, 1, 1 | E | ato |

**Estado e força**

| Grupo | Base | Reage a | Recursos | Visto | Ações |
| --- | --- | --- | --- | --- | --- |
| Associações de policiais | conservadores 0,6; servidores 0,4 | câmeras corporais, ciclo policial, previdência | 2, 1, 1, 3 | D | operação padrão, greve branca |
| Associações de militares | servidores 0,5; conservadores 0,5 | gasto com defesa, previdência, serviço militar | 1, 1, 1, 3 | D | nota pública, pressão no comando |

**Mídia** (sem nomes reais; cada um tem dono, linha editorial e interesse)

| Grupo | Base | Reage a | Recursos | Visto | Ações |
| --- | --- | --- | --- | --- | --- |
| A maior rede de TV aberta | ricos 0,5; classe média 0,5 | regulação das redes, publicidade oficial | 1, 3, 3, 1 | N | pauta negativa, pauta positiva |
| Rede de TV ligada a uma igreja | evangélicos 1 | costumes, laicidade | 1, 2, 3, 1 | D | pauta negativa, campanha |
| Grupo de jornais e portais | ricos 0,5; empresários 0,5 | regra fiscal, liberdade de imprensa | 1, 2, 3, 1 | N | pauta negativa, editorial |
| Rede de rádio e TV popular | pobres 0,5; interior 0,5 | segurança, preço dos alimentos | 1, 2, 3, 1 | D | pauta policial, pauta negativa |
| Mídia internacional | (nenhuma) | desmatamento, direitos, golpe, reputação internacional | 1, 1, 3, 1 | N | reportagem no exterior, que derruba a reputação internacional |

**Crime**

| Grupo | Base | Reage a | Recursos | Visto | Ações |
| --- | --- | --- | --- | --- | --- |
| A maior facção prisional | (nenhuma) | repressão (penas, presídios, isolamento), Estado fraco | 2, 3, 1, 3 | N | ameaça, ataques, rebelião em presídio |
| Facção rival regional | (nenhuma) | disputa de território com a maior | 2, 2, 1, 3 | N | guerra entre facções, tiroteio |
| Milícias | (nenhuma) | polícia fraca nas periferias, corrupção | 1, 2, 1, 3 | N | domínio de bairro, cobrança de "taxa" |
| Garimpo e madeira ilegais | (nenhuma) | fiscalização ambiental, terras indígenas | 1, 3, 1, 3 | N | invasão de terra indígena, ataque a fiscais |

**Separatistas** (um por região do país, tirado de `paises/<pais>`)

| Grupo | Base | Reage a | Recursos | Visto | Ações |
| --- | --- | --- | --- | --- | --- |
| Separatistas do Norte, do Nordeste, do Sul, do Sudeste e do Centro-Oeste | a insatisfação da região (seção 3.7) | federalismo (centralização), desigualdade regional, impostos para a União | 1, 1, 1, 1 | D no Sul, E no Nordeste, N nos outros | campanha, plebiscito informal |

Quase sempre parados: a pressão começa bem abaixo do limite e só cresce com
crise longa na região.

### 3.5 Turno 0 = Brasil em jan/2025

Os limites de cada grupo são ajustados para o turno 0 ficar assim (este é
o modo "Brasil 2025"; outros modos podem começar diferente):

| Mobilizados | Por quê (jan/2025) |
| --- | --- |
| Mercado financeiro | Pânico fiscal de dez/2024, câmbio na máxima |
| Rede de influenciadores de direita, movimentos conservadores | Crise da norma do Pix (revogada em 15/jan), campanha pela anistia (ato em 16/mar) |
| Igrejas neopentecostais | Oposição aberta ao governo |
| Sindicatos de professores | Educação liderou as greves de 2025 (49% das greves no setor público, DIEESE) |
| Povos originários | Disputa do marco temporal |
| As facções, as milícias, garimpo e madeira ilegais | Agem o tempo todo |

| Perto do limite | Por quê |
| --- | --- |
| Entregadores e motoristas de aplicativo | Breque nacional em 31/mar e 1º/abr |
| Movimentos por terra | Jornada de abril |
| Frentes populares de esquerda | Atos contra a anistia em 30/mar |

O resto começa parado, inclusive os sindicatos de servidores federais, que
fecharam acordo depois da greve de 2024.

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

### 4.1 Patrocinadores

Sem citar nomes no jogo. No conteúdo, cada um tem um id e um nome de tela:

| Id | No jogo | Interesses |
| --- | --- | --- |
| `superpotencia_militar` | "a grande potência militar" | segurança, tecnologia, petróleo, mídia e plataformas |
| `superpotencia_industrial` | "a grande potência industrial" | minério, soja, infraestrutura, portos |
| `bloco_continental` | "o bloco de países do outro lado do oceano" | clima, florestas, acordos comerciais |
| `potencia_energetica` | "a potência do gás e das armas" | energia, fertilizantes, desinformação |
| `potencia_teocratica` | "a potência religiosa do Golfo" | religião, petróleo |
| `monarquias_do_petroleo` | "as monarquias do petróleo" | petróleo, esporte, imóveis |
| setores | "um grupo de empresas do setor X" | o interesse do setor (agro, mineração, bancos, apostas, plataformas, armas) |
| igrejas e fundações | "uma fundação estrangeira" | costumes, clima, direitos |

Qual país real é cada id fica só neste documento (EUA, China, União
Europeia, Rússia, Irã e monarquias do Golfo), nunca no jogo nem nos arquivos
do mundo. O Brasil não aparece como patrocinador no modo Brasil, porque é o
governo do jogador.

### 4.2 Quanto e para quem

- **Poder econômico** do patrocinador (1 a 5): o orçamento que ele pode pôr.
- **Interesse ameaçado:** quanto as leis e índices que ele quer estão longe
  do que ele quer. Lei que ameaça o interesse aumenta o dinheiro.
- **`K` (0 a 1) por grupo e patrocinador:** quanto o grupo aceita dinheiro
  daquele patrocinador. Ex.: os movimentos ambientalistas aceitam bem
  fundações e o bloco continental e quase nada de mineração; a rede de
  influenciadores de direita aceita bem a potência militar e as plataformas.
- **Dinheiro que chega** = `K × interesse ameaçado × poder econômico`. Ele
  soma nos recursos (dinheiro) e na pressão do grupo, mesmo com a base
  satisfeita.

### 4.3 Oculto até ser revelado

- Quase todo patrocínio começa oculto: a tela mostra "financiado por: ?".
- **Revelar exige:**
  - **Segurança e inteligência:** investimento em inteligência e
    contrainteligência (a verba da Polícia Federal hoje; uma lei nova de
    inteligência, se você quiser);
  - **Investigação:** o jogador abre uma investigação sobre um grupo. A
    chance de sucesso por turno = `investimento / (investimento + c × poder
    econômico do patrocinador)`. Patrocinador rico esconde melhor.
- **Revelado:** o grupo perde parte da legitimidade (pressão e mídia caem),
  o patrocinador perde acesso, e a relação com o país dele piora
  (reputação, tensão internacional).

## 5. Tela

- **Jornal:** a ação sai como manchete com o grupo e a causa ("Caminhoneiros
  bloqueiam estradas contra o preço do diesel").
- **Painel:** uma aba "Pressão" ao lado do "Eleitorado", com os grupos por
  tipo, a barra de pressão com os dois limites de cada um, a última ação e
  "financiado por" (com "?" quando oculto).
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

- Grupo se mobiliza quando passa do próprio limite de entrada e desmobiliza
  quando cai ao de saída: baixar a satisfação dos servidores leva os
  sindicatos de servidores a mobilizar; subir até a saída desmobiliza; entre
  os dois, continua como estava.
- Cada ação tem efeito em índice ou capital: o teste percorre as ações e
  confere que toda ação tem ao menos uma ligação para um índice (ou para a
  aprovação, até o V1-10).
- Turno 0: os grupos da tabela 3.5 estão mobilizados e os outros não.
- Patrocínio oculto não aparece na tela; investigação com sucesso revela.

## 8. Decisões para você

1. **54 grupos** na seção 3.4: algum a mais, a menos ou com a base errada?
2. **Nomes das potências** da seção 4.1: servem, ou prefere outros?
3. **Turno 0** da seção 3.5: confere com o que você lembra de jan/2025?
4. **Inteligência:** usar a verba da Polícia Federal que já existe, ou criar
   uma lei de inteligência e contrainteligência?
5. **Efeitos provisórios** das ações até o V1-10 (pequenos, num índice e na
   aprovação): pode ser?

## Fontes

- Tilly, C. (1978). *From Mobilization to Revolution.* Addison-Wesley.
- Tilly, C. (2008). *Contentious Performances.* Cambridge University Press.
- McCarthy, J. D.; Zald, M. N. (1977). *Resource mobilization and social
  movements: a partial theory.* American Journal of Sociology 82(6).
- Olson, M. (1965). *The Logic of Collective Action.* Harvard University
  Press.
- Granovetter, M. (1978). *Threshold models of collective behavior.*
  American Journal of Sociology 83(6).
- Epstein, J. M. (2002). *Modeling civil violence: an agent-based
  computational approach.* PNAS 99 (supl. 3).
- Tarrow, S. (1998). *Power in Movement.* Cambridge University Press.
- Meyer, D. S.; Staggenborg, S. (1996). *Movements, countermovements, and
  the structure of political opportunity.* American Journal of Sociology
  101(6).
- Carothers, T.; Brechenmacher, S. (2014). *Closing Space: Democracy and
  Human Rights Support Under Fire.* Carnegie Endowment.
- Walker, E. T. (2014). *Grassroots for Hire: Public Affairs Consultants in
  American Democracy.* Cambridge University Press.
- Genial/Quaest, jan/2025, aprovação por região:
  <https://www.folhape.com.br/politica/aprovacao-de-lula-cai-5-pp-de-52-para-47-aponta-pesquisa/387067/>
- DIEESE, greves no 1º semestre de 2025 (536 greves; educação, 49% das do
  setor público): <https://vermelho.org.br/2026/01/13/greves-crescem-16-no-brasil-no-primeiro-semestre-de-2025/>
- Atos pela anistia (16/mar/2025) e contra (30/mar/2025):
  <https://oimparcial.com.br/politica/2025/03/bolsonaro-volta-a-copacabana-tenta-focar-anistia-e-deixa-protestos-contra-lula-em-2o-plano/>,
  <https://ohoje.com/2025/03/30/protestos-contra-anistia-de-condenados-do-8-de-janeiro-mobilizam-capitais/>
