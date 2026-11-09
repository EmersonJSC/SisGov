# SisGov — Requisitos

> Lista do que o jogo pronto precisa ter, tirada do [GDD](gdd.md) (03/nov/2026).
> Cada requisito aponta a seção do GDD. O GDD diz **o quê**; o
> [plano](plano-de-desenvolvimento.md) diz **em que ordem**.
>
> **Status:** ✅ feito · ◐ parcial · ☐ falta. Medido no código em 03/nov; base do jogo em 05/nov.
> Requisito novo só entra depois de decidido no GDD (seção 18).

## Resumo

| Sistema (GDD) | ✅ | ◐ | ☐ | Pronto |
|---|---|---|---|---|
| 4. Partida e turno | 2 | 2 | 6 | ~30% |
| 5. Partido | 0 | 0 | 5 | 0% |
| 6. Presidente, sucessão, ministros | 0 | 1 | 12 | ~4% |
| 7. Leis | 5 | 5 | 3 | ~58% |
| 8. Bússola | 4 | 0 | 2 | ~65% |
| 9. Índices | 2 | 2 | 3 | ~43% |
| 10. Contas | 3 | 1 | 2 | ~60% |
| 11. População e grupos | 5 | 2 | 11 | ~33% |
| 12. Congresso e coligação | 2 | 1 | 7 | ~25% |
| 13. Eleição, campanha, mandatos | 2 | 1 | 5 | ~25% |
| 14. Mídia | 0 | 0 | 7 | 0% |
| 15. Mundo | 2 | 1 | 3 | ~40% |
| 16. Economia | 4 | 4 | 31 | ~15% |
| 17. Tela: mapa e mesa | 3 | 2 | 6 | ~35% |
| **Total** | **34** | **22** | **103** | **~28%** |

---

## 4. Partida e turno

- ✅ **R4.1** Turno de 2 meses; mandato de 4 anos = 24 turnos.
- ✅ **R4.2** Passar o turno: efeitos chegam com atraso declarado.
- ◐ **R4.3** Escolher o país no começo (há `teste` e `teste-pobre`; falta país de verdade).
- ◐ **R4.4** Partida termina quando o partido deixa o poder (hoje: perder a eleição).
- ☐ **R4.5** Criar o partido: o jogador dá nome e sigla; não escolhe lado.
- ☐ **R4.6** Montar a chapa: presidente do partido, candidato e vice, escolhidos entre pessoas de todos os partidos do país (nasce a coligação).
- ☐ **R4.7** Placar final: tempo no poder e país deixado.
- ☐ **R4.8** O lado do partido (bússola e base) sai da chapa; o jogo nunca fala de lado ao jogador nem pede que ele escolha um.
- ☐ **R4.9** Montar o ministério: escolher ministérios e ministros, ou sortear os ministros pela ideologia da chapa.
- ☐ **R4.10** Tela de início de jogo em sequência: país → partido → chapa → ministério → iniciar.

## 5. O partido

- ☐ **R5.1** Ficha do partido: bússola (vem da chapa), base, cadeiras, caixa, desgaste, coesão.
- ☐ **R5.2** Governar longe da base derruba coesão; o partido muda de lugar devagar.
- ☐ **R5.3** Presidente do partido (ficha) pesa na negociação e na campanha; troca custa coesão.
- ☐ **R5.4** Caixa do partido: entra por financiamento (lei), sai na campanha; doação privada traz interesse.
- ☐ **R5.5** Coesão: deputados do partido votam contra quando ela cai.

## 6. Presidente, sucessão, ministros, pessoas

- ◐ **R6.1** Retratos genéricos (feito); ficha com atributos (falta).
- ☐ **R6.2** Presidente pesa por carisma, honestidade e habilidade política.
- ☐ **R6.3** Sucessão: morte, assassinato, renúncia, impeachment; vice e linha do país.
- ☐ **R6.4** Sucessor de outro partido: desvantagem até a eleição.
- ☐ **R6.5** Impeachment: oposição abre, Congresso aceita, Senado julga (se houver).
- ☐ **R6.6** Gerador de personagens; pessoas envelhecem, se aposentam e morrem.
- ☐ **R6.7** Ministros com ficha (competência, habilidade, carisma, honestidade, lealdade, bússola, origem).
- ☐ **R6.8** Ficha do ministro mexe na força e no atraso das leis da área.
- ☐ **R6.9** Fatos do ministro (escândalo, crise, demissão, candidato) e custo de troca.
- ☐ **R6.10** Criar, fundir e extinguir ministérios por lei; cada ministério é um conjunto de esferas.
- ☐ **R6.11** Perfil de rede social da pessoa (posts, fotos, curtidas, lugares, opiniões), gerado da ficha; sem rótulo de lado.
- ☐ **R6.12** Lista de pessoas por vaga (chapa, ministério) com o perfil abrindo ao clicar.

## 7. Leis

- ✅ **R7.1** Duas camadas (essencial, jogabilidade) e duas formas (contínua, opções).
- ✅ **R7.2** A lei declara efeito, força, atraso, bússola e base; o motor calcula.
- ✅ **R7.3** Validador do JSON com arquivo, campo e motivo.
- ✅ **R7.4** País declara as leis que tem; o resto fica "não legislada".
- ✅ **R7.5** Texto da tela sai dos números da lei.
- ◐ **R7.6** Temas em pacotes de leis pequenas (41 leis; faltam trabalho, armas, drogas, mídia, campanha, comércio…).
- ◐ **R7.7** Todo dinheiro passa por lei (8 leis de propriedade ainda sem efeito).
- ☐ **R7.8** Revogar = propor de volta a "não legislada", com voto.
- ☐ **R7.9** Colisão: leis que colidem não valem juntas; fora isso, toda combinação vale (build).
- ◐ **R7.10** Processo: estoque que anda sozinho pelos turnos, empurrado pelas leis em vigor (deriva feita em 04/nov; falta o estoque de casas).
- ☐ **R7.11** Órgão responsável: o jogador não escolhe fazenda ou fábrica; a regra funciona na medida da verba do órgão; verba demais vira corrupção.
- ◐ **R7.12** Toda lei chega ao pop por renda, emprego, preço, serviço ou direito (hoje 2 das 71 mudam a renda direto).
- ◐ **R7.13** Toda lei e todo índice pertencem a uma esfera (feito na planilha; falta no jogo).

## 8. Bússola

- ✅ **R8.1** Eixos `economico` e `social`, de −1 a +1.
- ✅ **R8.2** Leis, partidos, grupos e potências têm posição.
- ✅ **R8.3** Posição do país = média das leis com peso.
- ✅ **R8.4** Quem gosta sai da distância.
- ◐ **R8.5** Pops deslizam com a vida e com a mídia. Vida feita (03/nov): renda e satisfação empurram cada pop na bússola; a do grupo anda junto. Falta a mídia (não existe no código).
- ☐ **R8.6** Jogo percebe padrões ("corte de gastos").

## 9. Índices

- ✅ **R9.1** Índices essenciais do motor.
- ✅ **R9.2** Índices de jogabilidade do mundo.
- ◐ **R9.3** Inflação que se move (hoje parada; ver R10.4).
- ◐ **R9.4** Todo índice tem efeito além da cobrança dos grupos (14 ainda não têm).
- ☐ **R9.5** Desemprego e ocupados se movem com a economia.
- ☐ **R9.6** Índice da bolsa mostra o valor médio das empresas.
- ☐ **R9.7** Confiança do mercado sai de regras, corrupção, dívida, violência e ameaças de estatizar.

## 10. Contas do Estado

- ✅ **R10.1** Receita, gasto, juros, cofre e dívida separados.
- ✅ **R10.2** Juros sobem com dívida e inflação.
- ✅ **R10.3** Regra fiscal por lei (déficit, superávit).
- ◐ **R10.4** Dinheiro na moeda do país, por ano.
- ☐ **R10.5** Emissão de moeda (cobre falta, paga em inflação).
- ☐ **R10.6** Calote (apaga dívida, derruba reputação e juros por anos).

## 11. População e grupos

- ◐ **R11.1** Pops (profissão × estrato) com renda vinda da economia: 25 tipos no mundo, cada país declara as parcelas; a renda ainda é parte fixa do PIB (ver R16.26).
- ✅ **R11.7** Cada pop tem bússola (economico e social); desliza com a vida (R8.5).
- ✅ **R11.2** Grupos com bússola, tamanho e satisfação; 16 grupos no mundo, os 25 pops têm casa; país declara os fortes.
- ✅ **R11.3** Radicais e lealistas.
- ◐ **R11.4** Satisfação lê renda e leis (falta a mídia).
- ✅ **R11.5** Pops mudam de setor estudando (03/nov/2026): um pouco da gente de cada pop vai, todo turno, para o setor que paga mais, na velocidade da instrução. Universidade não é construção própria: a simulação é pelo índice (decisão do autor).
- ✅ **R11.6** Pops sobem e descem de estrato (03/nov/2026): renda real acima do esperado faz gente subir, na medida da instrução; abaixo, descer. Estudar (R11.5) fica à parte.
- ☐ **R11.8** Cada pop guarda faixas de idade, cidade ou campo, vínculo, escolaridade e patrimônio.
- ☐ **R11.9** Gente nasce, envelhece e morre; estudantes e aposentados mudam de tamanho.
- ☐ **R11.10** Quem está insatisfeito pode sair: informalidade, fuga de dinheiro ou emigração.
- ☐ **R11.11** Grupo forte torna mais populares as leis perto dele, sem escolher lei.
- ☐ **R11.12** 32 pops em 4 blocos, com crianças; números dos países de teste refeitos.
- ☐ **R11.13** 25 grupos atravessam os pops: cada pop se divide entre vários grupos.
- ☐ **R11.14** Organizações políticas nascem de radicais de vários grupos e têm nome, líder e ação.
- ☐ **R11.15** Crime organizado nasce do mercado ilegal, de presídios e da falta de Estado.
- ☐ **R11.16** Gerador de organizações: sem lista fixa, com nome, gente, dinheiro, armas, poder e nível de ameaça.
- ☐ **R11.17** País pode ter regiões, sem ser obrigatório.
- ☐ **R11.18** Organizações podem ter financiadores; rastro leva a investigação, escândalo e sanção.

## 12. Congresso e coligação

- ✅ **R12.1** Toda mudança de lei é votada; exorbitante (> 1/3 da faixa) cai.
- ✅ **R12.2** Partidos do país com cadeiras, bússola e grupos.
- ◐ **R12.3** Coligação de governo (fixa no país; falta convidar, cobrar, sair, voltar).
- ☐ **R12.4** Negociação: ceder proposta ou ministério para ganhar votos.
- ☐ **R12.5** Oposição age: vota, aprova leis dela, entrevistas, protestos.
- ☐ **R12.6** Veto do presidente e derrubada do veto.
- ☐ **R12.7** Uma ou duas casas, declarado pelo país.
- ☐ **R12.8** Parlamentarismo (perder a base derruba o governo).
- ☐ **R12.9** Cadeiras mudam a cada eleição pelo voto.
- ☐ **R12.10** Lei popular passa mais fácil, e o Congresso pode propô-la por conta própria.

## 13. Eleição, campanha, mandatos

- ✅ **R13.1** Mandato e eleição pela lei do país.
- ✅ **R13.2** Desgaste sobe sempre.
- ◐ **R13.3** Voto por grupo (satisfação feita; falta bússola dos candidatos, campanha e mídia).
- ☐ **R13.4** Limite de reeleição: o partido troca de candidato.
- ☐ **R13.5** Chapa: candidato e vice entre fichas.
- ☐ **R13.6** Coligação eleitoral (TV, caixa, eleitores; cobra lugar).
- ☐ **R13.7** Campanha nos últimos turnos: comício, TV, redes, debate, promessa.
- ☐ **R13.8** Jogador reduz o desgaste (nunca zera).

## 14. Mídia

- ☐ **R14.1** Mídias declaradas pelo país (dono, bússola, audiência por grupo, credibilidade).
- ☐ **R14.2** Enquadramento: o efeito da lei na opinião passa pela mídia.
- ☐ **R14.3** Pauta e escândalos (amiga demora, inimiga corre).
- ☐ **R14.4** Manchetes do turno saem dos dados.
- ☐ **R14.5** Leis de mídia (publicidade, emissora estatal, regulação, concessão, censura).
- ☐ **R14.6** Redes: rápidas, polarizam, boato com instrução baixa.
- ☐ **R14.7** Mídia é empresa na bolsa.

## 15. Mundo

- ✅ **R15.1** Potências inventadas com bússola, peso e relações.
- ✅ **R15.2** Reputação = média das opiniões pesada; segurança externa.
- ◐ **R15.3** Potência reage (opinião anda; falta acordo, investimento, crédito, tarifa, fuga de capital).
- ☐ **R15.4** Sanção pelo mercado (produto sancionado fica caro).
- ☐ **R15.5** Ataque externo (sem revide); defesa pelas leis militares.
- ☐ **R15.6** Potências mudam de posição ao longo das décadas.

## 16. Economia

**Mercado**
- ✅ **R16.1** Produtos em setores, mercado do país e do mundo.
- ✅ **R16.2** Demanda dos pops; falta de comida vira fome.
- ✅ **R16.3** Energia como capacidade (usinas contra demanda).
- ◐ **R16.4** Comércio por tarifa, subsídio e acordo.
- ◐ **R16.5** Cadeia entre setores (aço → máquinas → veículos).
- ☐ **R16.6** Setores com regra própria (moradia, remédios, militar).

**Terra e moradia (campo × cidade)**
- ☐ **R16.17** Moradia é estoque local (formal e precária) e sai do mercado do mundo.
- ☐ **R16.18** Quem constrói: empresas, governo (lei) e pops (pobre autoconstrói, médio financia, rico investe).
- ✅ **R16.19** Índices déficit, preço e favela (deriva em `derivas.json`, 04/nov; não equilibrado).
- ☐ **R16.20** Leis da cidade em 4 alavancas × 6 lados, com colisões.
- ☐ **R16.21** Terra rural de donos grandes, pequenos ou parada; concentração muda quanta gente vive do campo.
- ☐ **R16.22** Êxodo: gente do campo vai à cidade quando a renda esperada lá passa a do campo.
- ☐ **R16.23** Quem chega à cidade pede casa; sem oferta, sobe déficit e favela.
- ☐ **R16.24** Leis do campo nos 6 lados, ligadas à cidade só pelo êxodo.
- ☐ **R16.25** Bem tomado pelo Estado (terra ou empresa) ganha destino por lei: comunidade, Estado ou famílias com título; uma lei por destino (GDD §18, a decidir).

**Construções** (pilar 1)
- ☐ **R16.7** Construções produzem, empregam e dão lucro; o PIB é a soma delas.
- ☐ **R16.8** Obra com custo e prazo por tipo, em fila; construção civil decide quantas andam.
- ☐ **R16.9** Lucro = receita − salários − insumos − impostos; prejuízo seguido fecha.
- ☐ **R16.10** Corrupção atrasa e encarece obras.

**Empresas e dono** (pilar 2)
- ◐ **R16.11** Empresas declaradas pelo país (feito `empresas.json`; falta ligar às construções).
- ☐ **R16.12** Lucro vai ao dono (investidores e reserva, exterior, cofre, trabalhadores).
- ☐ **R16.13** Reserva privada abre obras; verba estatal por lei; patrocínio do Estado.
- ☐ **R16.14** Atos do Estado por lei (estatizar, criar, vender, cooperativa) com leis de propriedade.

**Bolsa** (pilar 3)
- ◐ **R16.15** Pregão: blocos de 2%, dividendo sem mando (protótipo na tela).
- ☐ **R16.16** Preço = lucro × múltiplo; compradores com caixa; cofre real; ficha da empresa.
- ☐ **R16.28** Ações fazem parte do patrimônio dos pops; dividendo vira renda.
- ☐ **R16.29** Bolsa funciona sem o governo: empresas, investidores e preços andam sozinhos.
- ☐ **R16.34** Preço da ação sai de lucro, juros, risco, crescimento esperado e humor.
- ☐ **R16.35** Investidores com caixa e comportamento próprio geram alta, euforia, pânico e quebra.
- ☐ **R16.30** Base do mercado e leis para regulamentar ou entrar, com caminhos liberal, coordenado e Estado dono.
- ☐ **R16.31** Serviços do Estado são prédios fora do mercado: pagos pelo orçamento, com emprego e sem lucro.
- ☐ **R16.32** Terceirizar serviços do Estado por lei, como segurança, presídios, hospitais e escolas.

**Ligação entre pops e economia** (base do jogo)
- ☐ **R16.26** A renda do pop sai de salário, lucro, aluguel e transferência.
- ☐ **R16.27** Falta de trabalhador freia a produção; o desemprego sai daí.
- ☐ **R16.36** Consumo: pops, pequenos mercados, mercados, prédios, Estado e exterior compram.
- ☐ **R16.37** Prédio contrata por qualificação; salário sai de qualificação, lucro e disputa por gente.
- ☐ **R16.38** Crédito de bancos a pops, prédios e Estado.
- ☐ **R16.39** Câmbio, regime e reservas ligam comércio, inflação, dívida e investidores.
- ☐ **R16.33** Caminho do lucro completo: valor adicionado, salário, encargos, desgaste, juros, imposto, reinvestimento e dividendo.

## 17. Tela: mapa e mesa

- ✅ **R17.1** Mapa: leis como bolhas em áreas; índices, grupos e potências no mapa.
- ✅ **R17.2** Votação, passar o turno, resultado do turno.
- ✅ **R17.3** Salvar e carregar.
- ◐ **R17.4** Fichas por cima do mapa (retrato feito; atributos faltam).
- ◐ **R17.5** Prévia de quem ganha e quem perde antes de propor.
- ☐ **R17.6** Mesa do presidente: carimbos assinar, vetar, recusar, encaminhar, pilha.
- ☐ **R17.7** Papéis: lei do Congresso (prazo, silêncio = sanção ou veto), situação, pedido.
- ☐ **R17.8** Tempo do presidente por turno; encaminhar ao ministro pela ficha.
- ☐ **R17.9** Ignorar tem consequência; a mídia lê a mesa.
- ☐ **R17.10** Mesa do partido (doador, filiação, expulsão, coligação).
- ☐ **R17.11** Momentos do partido como telas curtas (ministério, chapa, coligação, campanha).

## Fora do jogo pronto

Guerra iniciada pelo país, alianças militares, partido único jogável,
tribunal superior, pesquisa como árvore (GDD, seção 18).
