# Tramitação e votação (V1-12)

**Status:** APROVADO E FEITO (13/out). Respostas do autor na seção 8; o que
o código decidiu sozinho na seção 9.

## 0. Resumo

Você escolhe no tablet uma lei que não está em vigor (ou quer mudar a opção
de uma que está) e manda ao Congresso. Ela entra na **fila**, passa pela
Câmara e pelo Senado, um turno em cada casa, e cada bancada vota pela nota da
camada 2 do Congresso (`congresso.md`). Volta para você só o resultado:
**passou**, **adiou** ou **caiu**, com o placar. O caminho e o quórum
dependem do nível da lei (Constituição, lei ou decreto).

## 1. As regras de verdade (Constituição)

| Nível                 | Quórum                                         | Turnos de votação         | Base          |
| --------------------- | ---------------------------------------------- | ------------------------- | ------------- |
| Emenda à Constituição | 3/5 em cada casa (308 deputados, 49 senadores) | dois em cada casa         | art. 60, § 2º |
| Cláusula pétrea       | não muda por votação                           | —                         | art. 60, § 4º |
| Lei complementar      | maioria absoluta (257 e 41)                    | um em cada casa           | art. 69       |
| Lei ordinária         | maioria simples dos presentes                  | um em cada casa           | art. 47       |
| Medida provisória     | vale na hora; o Congresso tem 120 dias         | depois vira lei ordinária | art. 62       |
| Decreto e orçamento   | sem votação                                    | —                         | art. 84, IV   |

Dois fatos que viram regra:

- **Emenda rejeitada** não volta na mesma sessão legislativa (art. 60, § 5º):
  no jogo, só no ano seguinte.
- **Medida provisória caduca muito:** mais de 70% das MPs de 2023 perderam a
  validade sem votação (Correio Braziliense, jan/2024).

E a meta de calibragem: desde 1988, **77% dos projetos do presidente viram
lei** (Figueiredo e Limongi, já em `congresso.md`). Um governo médio, com a
disposição de partida, tem que aprovar perto disso.

## 2. O caminho no jogo

| Nível             | Turnos até valer                     | Pode pedir urgência?              |
| ----------------- | ------------------------------------ | --------------------------------- |
| Lei ordinária     | 2 (Câmara, depois Senado)            | sim: as duas casas no mesmo turno |
| Lei complementar  | 2                                    | sim                               |
| Emenda            | 4 (dois turnos em cada casa)         | não                               |
| Medida provisória | 0: vale já; cai se não passar em 2   | —                                 |
| Decreto           | 0: vale no turno seguinte, como hoje | —                                 |
| Pétrea            | não vai ao Congresso                 | —                                 |

- **Urgência** (art. 64, § 1º) encurta, mas custa: cada bancada perde um
  pouco de disposição (atropelar o Congresso irrita).
- **Modo emergência** (pedido do autor, 13/out): o Congresso vota mais
  rápido. Lei ordinária e complementar passam pelas duas casas no mesmo
  turno, e a emenda cai de 4 para 2 turnos (na vida real, a "quebra de
  interstício" e o calendário especial, como na emenda votada em poucos dias
  no fim de 2022). Custa mais disposição que a urgência, e só pode ser usado
  poucas vezes por ano.
- **Medida provisória** só para o que seria lei ordinária e não trata de
  direito penal, eleições, direitos políticos e nacionalidade (art. 62,
  § 1º). Ela vale enquanto tramita; se cair, a lei volta ao que era e o
  efeito desfaz. Usar muito irrita o Congresso.
- **A fila** (decisões do autor, 13/out): você pode mandar várias leis, mas
  o Congresso não vota tudo de uma vez.
  - **Quantas por turno** depende do seu apoio: a média da sua popularidade
    com a disposição das bancadas (pesada pelas cadeiras). Com apoio alto,
    até 4 votações por casa no turno; com apoio baixo, 1; sem apoio
    (abaixo de 20), o Congresso **ignora** a fila naquele turno.
  - **A ordem** vai pela opinião pública: a lei que o eleitorado mais quer
    (o efeito previsto dela no humor de todos os perfis) passa na frente.
    Urgência e modo emergência somam prioridade.
  - **Medida provisória** que passa de um turno sem votação **tranca a
    fila** (art. 62, § 6º): ela é votada antes de tudo naquela casa.

## 3. A votação

Em cada casa, cada bancada vota com a chance da camada 2:

1. o efeito previsto da lei no humor dos segmentos que elegeram a bancada;
2. quanto a lei aproxima o país do ponto dela na bússola;
3. a disposição dela com o governo;
4. as frentes (agro, evangélica, segurança…) a favor ou contra a lei.

Cada cadeira sorteia o voto com semente (mesma semente, mesma votação). As do
seu partido seguem você com 90% de chance (a base segue o líder em mais de
80% das votações). Passa se os votos sim chegam ao quórum.

- **Adia:** faltaram menos de 5% do quórum. A lei volta na fila no turno
  seguinte sem perder o lugar.
- **Cai:** faltou mais. Sai da fila; emenda só volta no ano seguinte.

A fila mostra a **previsão**: os votos esperados (soma das chances) contra
o quórum, por casa, antes de votar.

## 4. Pedidos do Congresso

Quando uma bancada decide a votação (a lei passa com ela e cai sem ela) e a
chance dela está perto de meio a meio, ela pede algo em troca, como um dilema
no tablet:

| Pedido               | Se aceitar                                            | Se recusar                   |
| -------------------- | ----------------------------------------------------- | ---------------------------- |
| Um ministério        | disposição da bancada sobe; o ministério muda de mãos | disposição dela cai um pouco |
| Emendas (verba)      | sai dinheiro do cofre; disposição sobe                | disposição dela cai um pouco |
| Apoio a uma lei dela | a lei dela entra na sua fila                          | disposição dela cai um pouco |

Aceitar muda o voto da bancada nesta votação (aceite do chamado).

## 5. Regras entre leis

- **Leis que se anulam** não ficam juntas: com uma em vigor ou na fila, a
  outra nem vai ao Congresso. Exemplo do V1-35: vender e estatizar o mesmo
  setor.
- **Lei que exige outra** (já existe no jogo): só pode ir à fila com a mãe
  em vigor na opção certa, ou junto com ela na fila.
- **Camadas** (`leis-em-camadas.md`): mudar a Constituição destrava ou trava
  as leis de baixo; a votação da emenda vem antes.

## 6. Onde está o nível de cada lei

Hoje o nível está escrito de três jeitos e 39 leis estão no nível errado
(`organizacao-das-leis.md`). Até o autor aprovar essa organização, o V1-12 lê
o `processoAutorizacao` como está: `lei-ordinaria` = lei ordinária,
`emenda-constitucional` = emenda, `clausula-petrea` = pétrea, `decreto` e
`execucao-programa-autorizado` = sem votação. Quando a organização for
aprovada, o nível passa a ser um campo só, no arquivo do país.

## 7. Como testar

- Emenda sem 3/5 nas duas casas não passa (teste).
- Com maioria própria, lei ordinária passa sem acordo (teste).
- Mesma semente, mesma votação (teste).
- Pedido aceito muda o voto da bancada que pediu (teste).
- Calibragem: partidas automáticas mandando leis ordinárias comuns aprovam
  perto de 77% (relatório, não teste).
- Medida provisória que cai desfaz o efeito (teste).

## 8. Perguntas para você

1. Medida provisória: **sim** (autor, 13/out).
2. Tempo de 2 e 4 turnos, com urgência: **sim**, e com modo emergência
   (autor, 13/out).
3. Fila: **sim**; quantas por turno depende da popularidade e do apoio, e
   a ordem vai pela opinião pública (autor, 13/out).
4. Pedidos (ministério, emendas, apoio a uma lei da bancada): **sim** (autor,
   13/out).

## 9. O que o código decidiu (13/out)

Pontos pequenos que o desenho não fixou, com o valor escolhido (todos em
`mundo/congresso.json`, fáceis de mudar):

- **Adiar só uma vez por votação:** se faltar pouco de novo, cai. Sem isso,
  uma lei podia ficar adiada para sempre.
- **Um pedido por projeto, e uma bancada com um pedido aberto por vez.**
  Enquanto você não responde, aquele projeto espera; os outros andam.
- **Quem pede o quê:** bancada com 15% da casa ou mais pede ministério; as
  menores pedem verba ou apoio a uma lei (meio a meio, por sorteio com
  semente). A lei pedida é a lei ordinária que mais puxa o país para o lado
  da bancada na bússola.
- **Ministério:** por enquanto só mexe na disposição (sobe a da bancada,
  desce um pouco a das outras). Trocar o ministro de verdade fica para
  depois.
- **Verba:** 0,05% do PIB sai do cofre; o que faltar vira dívida.
- **Previsão:** quatro turnos à frente, com e sem a lei, como a prévia.

Primeira rodada sem calibrar (8 leis mandadas no começo, Congresso de
partida): em 4 turnos, 4 passaram, 2 caíram (armas de fogo e autonomia do
Banco Central), 1 esperava a resposta a um pedido de ministério do Centro e
1 emenda seguia na segunda votação. A meta de 77% fica para quando você
jogar um mandato.

## Fontes

- Constituição Federal, arts. 47, 60, 62, 64, 69 e 84.
- Correio Braziliense, "Mais de 70% das medidas provisórias de Lula
  caducaram em 2023" (jan/2024).
- Revista Pesquisa FAPESP, "Desconstruindo mitos" (Figueiredo e Limongi):
  77,3% de sucesso do Executivo.
