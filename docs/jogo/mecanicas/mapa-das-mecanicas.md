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
  - [ ] Gatilhos fiscais (arrocho e farra fiscal): pedem guardar resultado e dívida por turno
  - [x] M7.3: grupos e frases reagem aos gatilhos (29/out; mexe na satisfação e na popularidade, por área; eleição e Congresso ainda não leem)

## M8. Partido, candidato e governo

Acrescentada em 29/out a pedido do autor: faltava a cadeia inteira, do partido
ao candidato e aos ministros, e **como cada um mexe na população**. Os itens
com "a decidir" são ideias para o autor aprovar, não desenho fechado.

**M8.1 Partido**
- [ ] Identidade: o que o partido defende (ideologia, alas internas, disciplina da bancada)
- [ ] Jogador como partido, não presidente; partida começa com o partido recém-eleito

**M8.2 Candidato**
- [~] Hoje: escolhe-se o presidente entre personagens gerados com biografia, opiniões, carisma e experiência
- [ ] A conferir: o que o candidato escolhido muda de fato no jogo (carisma, experiência, opiniões)
- [ ] A decidir: o candidato dá ponto de partida na bússola? Pesa na popularidade inicial?

**M8.3 Chapa e ministros**
- [ ] Vice (não existe no código)
- [ ] Ministros com nome, perfil e ponto na bússola, ocupando os ministérios que já estão no mapa
- [ ] A decidir: competência do ministro mexe na eficácia das leis da pasta?
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
- [ ] Plenário fiel (bancadas, disposição)
- [ ] Reação do Senado e da população a mudança em pétrea

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
