# Mapa das mecânicas

> **Status: PROPOSTA (29/out/2026), aguardando aprovação do autor.** Reorganiza o
> jogo em mecânicas e submecânicas, com o que está feito e o que falta.
> Não substitui o [PLANO](../../../PLANO.md) enquanto não for aprovado.

Legenda: `[x]` feito · `[~]` parcial · `[ ]` falta.

## Ordem de trabalho (decidida em 29/out)

1. **M7** Bússola e padrões, começando por ligar a aprovação do motor aos perfis vivos.
2. M8 Partido, candidato e governo, M9 Congresso, M10 Eleição e governo, M11, M12, M1, M3, M5: na ordem que o autor escolher, uma por vez.
3. **Motor da M2** (exclusão entre leis, opções em valor, teto de 4×, Segurança e defesa em duas): antes do último passo.
4. **Por último, juntos:** a revisão manual jogando e a Calibragem. É aqui que entram o **conteúdo da M2** (avaliar lei por lei: explicação, exclusões, bússola, catálogo de ~250) e a revisão de texto da M6 (frases das bolhas, neutralidade das réguas, `gosta`/`odeia`). O motor já tem de estar pronto.

A M6 fecha o núcleo agora; o que sobra dela é revisão de texto e vai para o passo 4.

## M1. Tempo

- [x] Turno trimestral e calendário
- [ ] Três meses na tela (animação do turno)

## M2. Leis

Conferido no código e no git em 29/out: M2 tem mais pronto do que a lista
antiga dizia. Por isso ela foi dividida em cinco submecânicas.

**M2 fica por último** (decisão do autor, 29/out). Duas metades: o **motor**
(A4, A5, teto de 4×, separar Segurança e defesa) vem antes; o **conteúdo**
(avaliar lei por lei, explicação, catálogo) vem no passo final, com a Calibragem.

**M2.1 Catálogo e molde**

- [x] Molde v4: 224 leis em 11 áreas e 2 pétreas, com verificador e inventário (`moldeDasLeis.test`, `inventarioDeLeis.test`)
- [x] Leis em três níveis, leis filhas, leis globais (testes próprios)
- [x] Busca de leis na tela
- [ ] Separar Segurança e defesa em duas esferas (hoje uma área com 45 leis)
- [ ] Uma lei fora do molde (área "Tributação", sem o formato das 11 áreas)
- [ ] Catálogo de ~250 leis, cada uma com lugar na bússola

**M2.2 Leis de valor e travas**

- [x] Travas individuais e tetos de 40% dos pisos tirados (A2)
- [x] Trava conjunta de 100% do PIB; acima da receita vira déficit (A3)
- [x] Controle de alíquota e de verba livre (0 a 100%, `faixaDaAliquota.test`)
- [x] Pisos vinculados e `pisoPorLei` (`pisosVinculados.test`)
- [~] Teto de 4× o valor atual em `faixaNumerica` ainda vale para unidades que não são moeda nem percentual
- [ ] Liberar opções travadas e converter em valor onde couber (A5)

**M2.3 Exclusão e dependência entre leis**

- [~] O mecanismo existe (`excludedActivePolicyIds` em `validatePolicyAction.ts`), mas nenhuma lei declara com quem não convive
- [ ] A lei declara a exclusão; aprovar pede revogar a outra (A4)

**M2.4 Explicação e janela da lei**

- [x] Prévia do efeito e no bolso de quem a lei bate
- [ ] Explicação por lei e opção, com teste que a exige (A6)
- [ ] Régua também nas leis de opções? (A7, decisão do autor)

**M2.5 Leis do mundo, estado do país**

- [x] Leis sem país; dados do Brasil em `paises/brasil/` (`leis-no-pais.json`, `leisNoPais.test`)
- [x] Estado e custo das leis (`estadoDasLeis.test`, `custosDasLeis.test`)
- [ ] Troca de nomes por país (ex.: "Selic")

## M3. Economia e orçamento

- [x] Reais e caixa, fases 1 a 6
- [~] Economia fase 2 (juntar leis, converter em faixa, leis novas)
- [ ] Destino da sobra no fundo soberano e contribuição sobre salários
- [ ] Setores econômicos (indústria, serviços, agro)
- [ ] Gasto fixo da rede (~30% do PIB)

## M4. Rede de consequências (o motor)

- [x] Estoques, calculados, setas, transbordo
- [ ] Coeficientes proporcionais ao PIB (hoje alguns são dinheiro fixo)

## M5. População

- [x] Censo (A), bolso (B) e movimento (C)
- [x] Saúde → mortalidade, natalidade, piso do salário mínimo
- [ ] Faixas sem grupo na tela (centro, fora da força de trabalho…)
- [ ] Desemprego: desalento, duração do seguro, ex-informal com renda zero
- [ ] Perfil manda e o agregado é a soma (futuro)

## M6. Opinião e Grupos

- [x] Satisfação por perfil (com bolso) e apoio pesado pelo tamanho
- [x] Radicais e lealistas
      Núcleo fechado. A aprovação do motor com perfis fixos passa para a M7.

Revisão de texto, vai para o passo final (junto com a M2):

- [~] País em frases (55 de 192 bolhas; as faixas escritas se julgam jogando)
- [ ] `gosta`/`odeia` dos desempregados
- [ ] Neutralidade das réguas e das cores

## M7. Bússola e padrões

- [x] Bússola mostra
- [x] Aprovação do motor lê os perfis vivos (29/out, `aprovacaoViva` em `game/congresso`; `aprovacaoViva.test.ts`)
- [~] O jogo percebe padrões, por **gatilhos** (item 6 do PLANO)
  - [x] M7.2: 11 gatilhos em `mundo/gatilhos.json`, lidos do histórico das leis e do caminho da bússola (`game/gatilhos`, `gatilhos.test.ts`); aparecem na Bússola
  - [x] Gatilhos fiscais (arrocho e farra, 29/out): regra `fiscal` lê o resultado guardado no `caminho` a cada turno
  - [x] M7.3: grupos e frases reagem aos gatilhos (29/out; mexe na satisfação e na popularidade, por área; eleição e Congresso passaram a ler, 29/out)

## M8. Partido, candidato e governo

Acrescentada em 29/out a pedido do autor: faltava a cadeia inteira, do partido
ao candidato e aos ministros, e **como cada um mexe na população**. Os itens
com "a decidir" são ideias para o autor aprovar, não desenho fechado.

**M8.1 Partido**

- [ ] Identidade: o que o partido defende (ideologia, alas internas, disciplina da bancada)
- [ ] Jogador como partido, não presidente; partida começa com o partido recém-eleito

**M8.2 Candidato**

- [~] Hoje: escolhe-se o presidente entre personagens gerados com biografia, opiniões, carisma e experiência
- [x] Gerador de pessoas (29/out): serve a candidato, vice e ministro; 4 atributos novos (integridade, articulação, comunicação, gestão) na ficha
- [x] A tela de escolha não mostra lado nem ideologia, só biografia, opiniões e atributos
- [ ] A conferir: o que o candidato escolhido muda de fato no jogo (carisma, experiência, opiniões)
- [x] Promessa contra ação (30/out, `game/promessa.ts`): governar ao contrário do lado que o presidente disse querer (o ponto dele em relação ao início do governo) tira satisfação de todos os grupos, com tolerância e teto; a frase aparece na Bússola
- [~] Carisma vivo (30/out, `game/carisma.ts`): o desvio do carisma do presidente (±1,5 sobre a ficha de 0 a 3) anda 20% por turno atrás da satisfação média do eleitorado e da promessa quebrada; entra no voto quando ele concorre e na ficha da tela. Falta: os ataques da mídia (M13)
- [ ] A decidir: o candidato dá ponto de partida na bússola? Pesa na popularidade inicial?

**M8.3 Chapa e ministros**

- [x] Tela de escolha completa: presidente, vice e ministros, com "Sortear ministros" a partir da chapa (fatia A, 29/out)
- [x] Vice
- [~] Em cada eleição o jogo pergunta se mantém ou troca a chapa (feito); passados 2 mandatos seguidos a troca é obrigatória, se a lei assim mandar (hoje vale o limite do país; a lei estender ou encurtar falta) (autor, 29/out)
- [x] Ministros são os das bolhas: um por área, com nome, atributos e opiniões (o ponto na bússola fica por dentro)
- [~] Popularidade do ministro (fatia B, 29/out): nasce dos grupos leais a ele (cada grupo de um só ministro, repartidos pelo lado ideológico com cota por ministro), pelo tamanho e pela satisfação de cada um (`game/gabinete.ts`); como a satisfação já sai do aquecimento e lê leis, índices e gatilhos, a nota anda com eles. A média, fora de 50, soma ou tira até ±4 pontos de todos os grupos (popularidade do governo e eleição). Lealdade exclusiva feita (D, passo 1, 30/out). Porta-voz feito (D, passo 2)
- O Senado não olha a popularidade do ministro, só a lei (autor, 29/out); a popularidade do ministro só pesa na do partido e do governo
- [x] Ministro porta-voz (D, passo 2, 30/out; `game/pedidos.ts`): de vez em quando um ministro, não todos, leva ao jogo as leis que ele e os grupos leais a ele querem (ex.: segurança, 3 grupos leais). Aceitar ou recusar mexe na satisfação desses grupos
- [ ] A decidir: competência do ministro (gestão) mexe na eficácia das leis da pasta?
- [ ] A decidir: troca de ministro, demissão, escândalo

**M8.4 Influência na população** (a cadeia que faltava)

- [ ] Afinidade de cada grupo com o partido (ideologia do partido × `gosta`/`odeia` do grupo)
- [ ] Efeito do candidato sobre a satisfação dos perfis (carisma, carisma × grupo)
- [ ] Efeito dos ministros: ponto na bússola do ministro contra o do eleitor; escândalo derruba a popularidade
- [ ] Como isso entra na eleição e no Congresso (hoje leem a satisfação por perfil)

**M8.5 Desgaste**

- [ ] Desgaste do partido: sobe sempre por baixo, opinião segura, queda em escândalo, crise ou eleição
- [ ] Antipartido (limite 16 do Grupos)

## M9. Congresso e tramitação

- [~] Tramitação e votação existem
- [~] Plenário fiel (30/out, fatia A): o seu partido em dourado (o centro virou lilás para não se confundir) e, em cada projeto da fila, "Como cada bancada deve votar": chance de sim e o que mais pesa (eleitor, bússola, humor com o governo ou frente). `motivoDoVoto` em `app/partida/tramitacao.ts`. Falta: mostrar por que votou assim nas votações já feitas e quem mudou de lado
- [~] Reação do Senado e da população a mudança em pétrea (humor das bancadas e satisfação dos grupos; falta ver na tela)

## M10. Eleição e governo

- [~] Eleição existe, falta o adversário
- [ ] Fim de jogo (perder encerra)
- A chapa e os ministros estão em M8.3.

## M11. Ocorrências e pressão

- [x] Ocorrências, crises, grupos de pressão, ministérios no mapa
- [ ] Ministros com nome nas ocorrências (`occurrences.ts` ainda usa o nome da pasta; depende da M8.3)

## M12. Partida e abertura

- [x] Salvar, carregar, exportar
- [ ] Tela de abertura à altura da promessa

## M13. Mídia

Ideia do autor (29/out), ainda sem desenho. Ataque na mídia fortalece atributos
do candidato e a visão do público, o que mexe na popularidade e pressiona o
Senado a passar as leis. Depende do carisma vivo (M8.2). Abre só depois da M8.

## Transversal, no fim: Calibragem

Lista única com os limites (1) a (17) do Grupos, os chutes do item 12 do PLANO
e C1–C2. Uma linha por chute, com o arquivo onde ele mora.

## Remanejamento proposto

1. A seção 4 do PLANO vira esta tabela, com o estado de cada submecânica.
2. Limites (1) a (17) e "chutes a conferir" vão para a seção Calibragem.
3. "Próximos passos 23/out", "Achados 22/out" e "Mudanças já decididas" vão
   para o `PLANO-feito.md`; o que ainda vale entra como submecânica.
4. O [README de mecânicas](README.md) adota esta numeração (hoje difere da do PLANO).
5. O `RETOMAR.md` passa a apontar a mecânica e a submecânica em curso.

## Em aberto

- A árvore está certa? Dúvida nas fusões de M6 (Opinião e Grupos) e M10 (Eleição e governo).
- Qual é a próxima: M7 (percepção de padrões) ou M8 (desgaste)?
