# Ocorrências: eventos, dilemas e situações

> **Status: REFERÊNCIA TÉCNICA.** Descreve o código como está hoje; não define o que vamos fazer. O que vale está no [PLANO](../../PLANO.md) e no [índice dos documentos](../README.md).

**Estado:** implementado no SG106 (D-62), decidido com o autor em
10–11/out/2026. Decidido:

- chance que a rede mexe, com sorteio; cada partida é diferente;
- o turno não passa com dilema sem resposta;
- **nem todo turno tem ocorrência**: dilemas e eventos saem por sorteio,
  com a chance que o momento do país dá; no máximo dois dilemas na mesa e
  dois eventos (um grande e um local) por turno;
- eventos têm **níveis** (um tiroteio num bairro não é uma bomba nuclear):
  quanto maior, mais raro e mais difícil de acontecer;
- eventos **se adaptam ao contexto dos nós**: nascem do mundo, da
  natureza, do estado do país ou como reação às decisões do governo;
- eventos geram dilemas, e dilemas armam eventos;
- **conteúdo para 5 mandatos** (80 turnos) sem faltar nem repetir demais;
- pode criar indicadores novos para os gatilhos (qualidade de vida, base
  no Congresso, tensão internacional…).

## Os três tipos

| Tipo         | O jogador…            | O que faz                                                     | Exemplo                                   |
| ------------ | --------------------- | ------------------------------------------------------------- | ----------------------------------------- |
| **Evento**   | sofre                 | Muda o tabuleiro por um tempo: PIB, preços, aprovação…        | Crise mundial do petróleo, Seca histórica |
| **Dilema**   | decide (o jogo pausa) | 2 a 4 opções, cada uma com bônus e ônus                       | Escândalo do ministro, Resgate bancário   |
| **Situação** | vê crescer            | Bolha da rede que surge acima de um ponto e pisca (já existe) | Greve geral, Juros explosivos, Epidemia   |

Nada disso é número escondido (D-40). Cada evento e cada opção de dilema
é um **nó da rede** (um controle de 0 a 1) com setas para as bolhas que
mexe. Enquanto dura, o nó vale 1; quando acaba, volta a 0. O boletim de
qualquer indicador mostra "Seca histórica (evento)" entre as causas, como
mostra uma lei.

## Divisões: de onde vem cada ocorrência

Toda ocorrência tem uma **origem**, um **nível** e uma **área**. A origem diz
o que a dispara e a quais nós ela presta atenção; o nível diz o tamanho; a
área serve para variar (o jogo evita duas da mesma área seguidas) e para a
tela.

| Origem                   | O que dispara                                                | Lê quais nós                                                     | Exemplos                                                                                                                   |
| ------------------------ | ------------------------------------------------------------ | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Mundo**                | o que acontece lá fora, aleatório                            | quase nenhum; no máximo a exposição do país (comércio, reservas) | Guerra explode no mundo, crise do petróleo, pandemia, crash das bolsas                                                     |
| **Natureza**             | clima e geologia, aleatório                                  | os que tornam o país frágil (desmatamento, saneamento, matriz)   | Seca histórica, enchente, ondas de calor, deslizamentos                                                                    |
| **Estado do país**       | o acúmulo de uma condição na rede                            | indicadores e situações, mantidos por um tempo                   | Fuga de cérebros, bolha de crédito estoura, onda de crimes, greve geral                                                    |
| **Reação a uma decisão** | uma lei mudada pelo jogador ou uma escolha num dilema        | a lei (para onde foi), e o contexto que amplia a reação          | Vender estatais → greves e protestos; arma nuclear → sanções estrangeiras; cortar verba da educação → greve de professores |
| **Desdobramento**        | outra ocorrência (evento → dilema, escolha → evento)         | a ocorrência de origem                                           | Enchente → "Como financiar a reconstrução?"                                                                                |
| **Cotidiano** (dilemas)  | a rotina da Presidência, sorteada entre as que fazem sentido | o momento do país (pesos pela rede)                              | Aliado pede ministério, ministros brigam por verba                                                                         |

A mesma origem se subdivide por **alcance**: uma reação pode ser **local**
(a estatal vendida fica numa cidade: greve dos funcionários dela),
**nacional** (a privatização em massa vira protesto nas capitais) ou
**estrangeira** (o programa nuclear gera sanções). O contexto escolhe qual
acontece: privatizar com desemprego alto e sindicatos fortes leva a greve
nacional; com economia aquecida, só a greve local.

### Gatilhos por origem

- **Mundo e natureza:** chance por turno com fatores (multiplicam).
- **Estado do país:** condições que precisam valer juntas por `porTurnos`
  turnos seguidos; depois disso, a chance passa a valer (ou é certa).
- **Reação:** a partida guarda o que o jogador mudou em cada turno. Uma
  reação declara a lei e o sentido (`para` certas opções, `sobe` ou
  `desce` além de um tanto) e uma janela (de 1 a N turnos depois); a chance
  é lida do contexto naquela janela.
- **Desdobramento:** a ocorrência de origem declara o que vem depois, com
  chance e prazo.

## Eventos

### Níveis

| Nível | Nome       | Alcance               | Frequência típica (por turno) | Na tela                      | Exemplo                                   |
| ----: | ---------- | --------------------- | ----------------------------- | ---------------------------- | ----------------------------------------- |
|     1 | Local      | uma cidade, um bairro | 30–60% (quase todo turno)     | nota de rodapé no jornal     | Tiroteio no bairro, desabamento, surto    |
|     2 | Regional   | um estado, um setor   | 5–15%                         | manchete                     | Enchente, greve de uma categoria          |
|     3 | Nacional   | o país inteiro        | 1–5%                          | capa do jornal               | Seca histórica, escândalo, apagão         |
|     4 | Catástrofe | o país e o mundo      | 0,1–0,5%                      | tela inteira, a partida para | Pandemia, crise mundial, guerra na região |

O nível dá a **escala**: o efeito de um evento local é pequeno e passa
rápido (um tiroteio mexe na sensação de segurança da região e na
aprovação um pouco); uma catástrofe mexe em tudo por anos. O nível também
dá a **raridade**: o validador recusa uma ocorrência de nível 4 que sai ao
acaso (sem condição nem reação) com chance acima de 0,5% por turno. Uma
catástrofe que nasce de uma condição do país — a crise da dívida com a
dívida explodindo — pode ser provável enquanto a condição vale. Eventos locais são o "ruído" que mantém o
país vivo e mostram a rede funcionando em pequena escala.

### Três jeitos de acontecer

1. **Aleatório (com chance que a rede mexe).** Chance base por turno e
   fatores: com corrupção alta, mais escândalos; com vacinação baixa, mais
   epidemias; com infraestrutura ruim, mais apagões. Ex.: crise mundial do
   petróleo (nível 4, só sorte), seca histórica (nível 3, mais provável com
   desmatamento).

   ```json
   "chance": 0.02,
   "fatores": [["desmatamento", 30, 80, 3]]
   ```

2. **Engatilhado (condição mantida).** Acontece quando uma condição do país
   se mantém por um tempo. Ex.: **Fuga de cérebros** — imposto de renda do
   topo acima de 55% **e** qualidade de vida abaixo de 40 **por 4 turnos
   seguidos**. A partida conta os turnos em que a condição vale; ao chegar
   no prazo, o evento acontece (ou passa a ter chance alta).

   ```json
   "se": [["lei:imposto-renda-pessoas", ">", 55], ["qualidade_de_vida", "<", 40]],
   "porTurnos": 4
   ```

3. **Encadeado.** Acontece por causa de outra ocorrência: um evento abre um
   dilema no turno seguinte; uma escolha num dilema arma um evento para
   depois (ver "Encadeamento").

### Dificuldade de execução

Para eventos que dependem de alguém executar (atentado, golpe, sabotagem,
ataque hacker), a chance soma **motivação** e **capacidade**: um atentado
nuclear exige grupo radical forte **e** acesso a material **e**
fiscalização fraca. Como os fatores multiplicam, se um deles está baixo, a
chance desaba. Isso mantém os eventos extremos raríssimos num país estável
e possíveis num país em colapso.

## Dilemas: a cadeira do presidente

### A mesa

Um turno pode começar com **nenhum, um ou dois dilemas** na mesa — o
segundo só quando um evento gera o seu. Não há dilema garantido: cada um
é sorteado com a chance que o país dá naquele momento. Com dilema na mesa,
o jogo pausa: o turno não passa sem resposta. A mesa escolhe assim, nesta
ordem:

1. **Desdobramento** de um evento ou de uma escolha anterior (ex.: a
   enchente do turno 3 gera "Como financiar a reconstrução?" no turno 4);
2. **Crise** ligada a uma situação que surgiu (greve geral nas ruas, juros
   explosivos);
3. **Reação** a uma decisão recente do jogador (sindicatos ameaçam greve
   depois da privatização: negociar ou enfrentar?);
4. **Cotidiano do governo**, sorteado entre os que fazem sentido para o
   país naquele momento (pesos pela rede): pedidos de aliados, conflitos
   entre ministérios, escolhas morais, política externa.

### Para não repetir em 5 mandatos

Uma partida de 5 mandatos tem 80 turnos: perto de 100 dilemas e 150
eventos. Regras de variedade:

- cada ocorrência tem `intervaloMinimoTurnos`; as marcadas `unica` só
  acontecem uma vez por partida;
- depois de vista, a chance de sair de novo cai (×0,3 na segunda, ×0,1 na
  terceira);
- a mesa evita a mesma área duas vezes seguidas (a chance da área do
  último dilema pesa a metade);
- eventos locais usam lugares do pacote do país (cidades, regiões,
  bairros, nomes de empresas fictícias), então "Tiroteio no bairro" vira
  um fato diferente a cada vez;
- muitas ocorrências têm variantes pelo contexto (a mesma greve é local ou
  nacional; a mesma seca afeta ou não a energia, conforme a matriz).

**Medido (out/2026):** em 80 turnos com o piloto, cada partida tem perto
de 65 eventos e 45 dilemas, entre 80 e 95 ocorrências diferentes, nenhuma
mais de 3 vezes, e uns 15 turnos calmos (sem evento nem dilema). O teste
`ocorrenciasVariedade` trava esses números.

### Textos com variáveis e variantes

Um texto serve para muitos casos:

- **Variáveis do país**, trocadas quando a ocorrência acontece: `{cidade}`,
  `{bairro}`, `{estado}`, `{regiao}`, `{empresa}`, `{banco}`, `{vizinho}`,
  `{faccao}`, `{partido_aliado}`, `{potencia}`. Vêm de `lugares` no
  estado inicial do país; sem a lista, um termo genérico ("uma cidade").
  A escolha é sorteada e guardada na ocorrência, então o jornal, a mesa e
  o histórico contam o mesmo fato.
- **`{ministro}` e `{pasta}`** saem da área da ocorrência ("o ministro da
  Saúde"). Quando houver escolha de ministros, passam a ser o nome dele.
- **Variantes** (no conversor): uma ficha com `variantes` vira uma
  ocorrência por variante. As chaves de texto (`{tema}`, `{categoria}`…)
  preenchem o id e os textos — o id precisa de um marcador, como
  `greve-de-{categoria_id}` —, e as estruturais (`efeitos`, `se`,
  `fatores`, `opcoes`…) substituem as da ficha. Assim, "Greve de
  {categoria}" vira greves de professores, metroviários, petroleiros e
  residentes, cada uma com o seu gatilho e as suas opções.

### O governo sempre pode resolver

Toda opção pode ter **requisitos** (ex.: "usar dinheiro público" exige que
o caixa ou o crédito aguentem; "usar a maioria no Congresso" exige base),
mas **todo dilema tem pelo menos uma opção sempre disponível**. O
validador recusa um dilema sem opção livre (a opção `padrao` não pode ter
requisito). Opção indisponível aparece
riscada, com o motivo.

### O que uma opção pode fazer

- mexer em bolhas por um tempo (PIB, preços, criminalidade, grupos
  sociais…);
- custar ou render dinheiro (uma vez ou por meses), visível nas contas;
- mudar leis (o socorro externo impõe teto de gastos);
- mexer no apoio político: base no Congresso, partido aliado que sai da
  base (quando o Congresso existir, M3; até lá, uma bolha de "Base de
  apoio no Congresso");
- **armar consequências para depois**: deixar uma marca que muda chances
  futuras (proteger o ministro corrupto deixa 30% de chance de um novo
  escândalo, maior, em 4 a 8 turnos);
- abrir outro dilema ou disparar um evento.

Toda escolha mostra, antes de assinar, os bônus e ônus previstos, como a
prévia de uma lei.

### Exemplos

**O escândalo do ministro.** Um ministro-chave foi pego desviando verbas.

- _Proteger_: mantém o partido dele na base, mas a aprovação despenca e a
  percepção de corrupção sobe; arma um "escândalo maior" para depois.
- _Demitir e investigar_: a classe média aprova, o partido dele sai da base
  (passar leis fica mais difícil).
- _Demitir em silêncio_: meio-termo, perde menos dos dois lados, mas
  ninguém fica satisfeito.

**Resgate bancário.** Um banco gigante está para quebrar.

- _Salvar com dinheiro público_: a dívida sobe, irrita a esquerda e os
  liberais, mas segura o PIB e o crédito.
- _Deixar quebrar_: desemprego e crise de crédito fortes, agrada os
  liberais radicais.
- _Fusão forçada com bancos públicos_: custa menos, mas a concentração
  bancária sobe e o mercado reclama.

## Encadeamento: eventos geram dilemas

A mecânica que mais dá vida ao jogo. Um evento declara seus
**desdobramentos**:

```json
"desdobramentos": [{ "dilema": "reconstrucao", "emTurnos": 1, "chance": 1 }]
```

Exemplo: **Enchente devastadora** (nível 3) no turno 3. No turno 4, a mesa
traz **"Como financiar a reconstrução?"**:

- _Imprimir dinheiro_: reconstrói rápido, a inflação sobe;
- _Cortar da saúde_: as contas fecham, a mortalidade sobe;
- _Aumentar impostos_: reconstrói sem dívida, a classe média se revolta;
- _Pedir ajuda internacional_: reconstrói devagar, rende dívida externa.

O caminho inverso também vale: a escolha "Reprimir os protestos" pode
armar o evento "Mártir nas ruas" (nível 2) com 25% de chance em 1 a 3
turnos.

## Sorteio e piloto automático

A partida guarda um gerador com semente: toda partida nova ganha uma
semente aleatória, então cada partida é diferente; salvar e carregar
continua do mesmo ponto. Por turno a partida tira números numa ordem fixa
(um por ocorrência do catálogo). O piloto automático (D-58) recebe os
mesmos números e responde todo dilema com a opção `padrao`. Assim, a
diferença entre os dois mostra o que o jogador mudou: com corrupção menor,
o escândalo que o piloto sofreu não aconteceu no seu governo. A prévia de
lei não sorteia: supõe que nada novo acontece.

## Situações no estado da partida

As situações continuam sendo bolhas. A partida passa a registrar quando
cada uma surge e quando some, e uma situação que surge pode trazer um
dilema de crise (passo 2 da mesa).

## Estado da partida (`GameState.occurrences`)

- `active`: eventos e escolhas em curso (nó, meses que faltam, início);
- `pending`: dilemas na mesa;
- `armed`: consequências armadas para depois (o que, quando, chance);
- `triggers`: há quantos turnos cada gatilho de condição vale;
- `history`: tudo o que aconteceu, com o turno e a escolha;
- `lastStarted`: último início de cada ocorrência (intervalo mínimo).

## Catálogo (primeiro pacote)

As fichas ficam em `docs/fichas/ocorrencias/<área>.json`, no formato
compacto descrito em `scripts/fichas/ocorrencias.py`; o conversor gera
`mundo/eventos`, `mundo/dilemas`, o nó de cada evento e de cada opção e
uma consequência por efeito. Com as variantes, o pacote tem 78 eventos e
91 dilemas:

| Ficha                     | Exemplos de eventos                                                        | Exemplos de dilemas                                                                                                                       |
| ------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `economia`                | crise do petróleo, crise financeira, boom, fuga de cérebros, fábrica fecha | crise da dívida, resgate bancário, lobby pede isenção (3 setores), protesto contra imposto                                                |
| `seguranca`               | tiroteio no bairro, ataques de facção, rebelião, atentado                  | resposta aos ataques, policial mata inocente, indulto de Natal                                                                            |
| `saude`                   | pandemia, surtos (variantes por doença), hospital fecha                    | lockdown ou economia, quebrar patente, médicos em greve                                                                                   |
| `ambiente-infraestrutura` | seca, enchente, barragem rompe, apagão, terremoto                          | reconstrução, racionamento, obra parada (variantes), mineração em terra indígena                                                          |
| `politica`                | escândalo, CPI, impeachment, tentativa de golpe, notícia falsa (variantes) | escândalo do ministro, aliado pede ministério (variantes), emendas secretas                                                               |
| `exterior`                | guerra entre potências, guerra no vizinho, sanções, ataque hacker          | a bomba (programa nuclear → sanções), crise na fronteira, sediar Copa/Olimpíadas                                                          |
| `social`                  | protestos de massa, ocupação de terras, saques, ataque a escola            | greve dos caminhoneiros, greve geral, greve de categoria (variantes), reações a privatização, idade mínima, reforma agrária e aplicativos |

## Fases do SG106 (feitas)

1. **Motor e partida:** níveis, os três jeitos de acontecer, mesa de
   dilemas sorteada, requisitos com opção livre, consequências armadas,
   desdobramentos, turno travado com dilema aberto, piloto automático.
2. **Conteúdo:** o catálogo acima em `docs/fichas/ocorrencias/`, gerado
   pelo conversor.
3. **Tela:** jornal do turno (rodapé, manchete, capa, pelo nível), mesa do
   presidente com prévia das opções, faixa "acontecendo agora", e a
   ocorrência em curso entre as causas no boletim de cada bolha.

**Base no Congresso (até o M3):** o Congresso com partidos e votos chega
no M3. Até lá, um indicador **"Base de apoio no Congresso"** recebe os
efeitos políticos dos dilemas (o partido do ministro saiu da base: a base
cai). Quando a votação de leis existir (SG112), a chance de uma lei passar
lê esse indicador.

**Indicadores novos** (autorizados): qualidade de vida (média de saúde,
renda, segurança, saneamento e educação), base de apoio no Congresso,
tensão internacional (sobe com programa nuclear, sanções, conflitos) e os
que o conteúdo pedir.
