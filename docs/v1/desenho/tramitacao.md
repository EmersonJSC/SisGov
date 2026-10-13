# Tramitação e votação (V1-12)

**Status:** EM REVISÃO (13/out). Desenho da etapa 0; o código só começa com
a aprovação do autor. As perguntas estão na seção 8.

## 0. Resumo

Você escolhe no tablet uma lei que não está em vigor (ou quer mudar a opção
de uma que está) e manda ao Congresso. Ela entra na **pauta**, passa pela
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
- **Medida provisória** só para o que seria lei ordinária e não trata de
  direito penal, eleições, direitos políticos e nacionalidade (art. 62,
  § 1º). Ela vale enquanto tramita; se cair, a lei volta ao que era e o
  efeito desfaz. Usar muito irrita o Congresso.
- **A pauta** tem lugar para até 4 projetos seus ao mesmo tempo (valor
  inferido, a calibrar jogando). Isso força escolher prioridades.

## 3. A votação

Em cada casa, cada bancada vota com a chance da camada 2:

1. o efeito previsto da lei no humor dos segmentos que elegeram a bancada;
2. quanto a lei aproxima o país do ponto dela na bússola;
3. a disposição dela com o governo;
4. as frentes (agro, evangélica, segurança…) a favor ou contra a lei.

Cada cadeira sorteia o voto com semente (mesma semente, mesma votação). As do
seu partido seguem você com 90% de chance (a base segue o líder em mais de
80% das votações). Passa se os votos sim chegam ao quórum.

- **Adia:** faltaram menos de 5% do quórum. A lei volta na pauta no turno
  seguinte sem perder o lugar.
- **Cai:** faltou mais. Sai da pauta; emenda só volta no ano seguinte.

A pauta mostra a **previsão**: os votos esperados (soma das chances) contra
o quórum, por casa, antes de votar.

## 4. Pedidos do Congresso

Quando uma bancada decide a votação (a lei passa com ela e cai sem ela) e a
chance dela está perto de meio a meio, ela pede algo em troca, como um dilema
no tablet:

| Pedido               | Se aceitar                                            | Se recusar                   |
| -------------------- | ----------------------------------------------------- | ---------------------------- |
| Um ministério        | disposição da bancada sobe; o ministério muda de mãos | disposição dela cai um pouco |
| Emendas (verba)      | sai dinheiro do cofre; disposição sobe                | disposição dela cai um pouco |
| Apoio a uma lei dela | a lei dela entra na sua pauta                         | disposição dela cai um pouco |

Aceitar muda o voto da bancada nesta votação (aceite do chamado).

## 5. Regras entre leis

- **Leis que se anulam** não ficam juntas: com uma em vigor ou na pauta, a
  outra nem vai ao Congresso. Exemplo do V1-35: vender e estatizar o mesmo
  setor.
- **Lei que exige outra** (já existe no jogo): só pode ir à pauta com a mãe
  em vigor na opção certa, ou junto com ela na pauta.
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

1. **Medida provisória** entra (vale já, cai em 2 turnos se não passar)?
   Recomendo.
2. **Tempo:** lei ordinária em 2 turnos e emenda em 4, com urgência que
   encurta e irrita? Recomendo.
3. **Pauta com até 4 projetos** ao mesmo tempo? Recomendo, a calibrar.
4. **Pedidos** (ministério, emendas, apoio a uma lei da bancada)? Recomendo.

## Fontes

- Constituição Federal, arts. 47, 60, 62, 64, 69 e 84.
- Correio Braziliense, "Mais de 70% das medidas provisórias de Lula
  caducaram em 2023" (jan/2024).
- Revista Pesquisa FAPESP, "Desconstruindo mitos" (Figueiredo e Limongi):
  77,3% de sucesso do Executivo.
