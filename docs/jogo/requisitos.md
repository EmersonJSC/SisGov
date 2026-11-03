# SisGov — Requisitos

> Lista do que o jogo pronto precisa ter, tirada do [GDD](gdd.md) (03/nov/2026).
> Cada requisito aponta a seção do GDD. O GDD diz **o quê**; o
> [plano](plano-de-desenvolvimento.md) diz **em que ordem**.
>
> **Status:** ✅ feito · ◐ parcial · ☐ falta. Medido no código em 03/nov.
> Requisito novo só entra depois de decidido no GDD (seção 18).

## Resumo

| Sistema (GDD) | ✅ | ◐ | ☐ | Pronto |
|---|---|---|---|---|
| 4. Partida e turno | 2 | 2 | 6 | ~30% |
| 5. Partido | 0 | 0 | 5 | 0% |
| 6. Presidente, sucessão, ministros | 0 | 1 | 12 | ~4% |
| 7. Leis | 5 | 2 | 1 | ~75% |
| 8. Bússola | 4 | 0 | 2 | ~65% |
| 9. Índices | 2 | 1 | 0 | ~85% |
| 10. Contas | 3 | 1 | 2 | ~60% |
| 11. População e grupos | 4 | 1 | 2 | ~60% |
| 12. Congresso e coligação | 2 | 1 | 6 | ~25% |
| 13. Eleição, campanha, mandatos | 2 | 1 | 5 | ~25% |
| 14. Mídia | 0 | 0 | 7 | 0% |
| 15. Mundo | 2 | 1 | 3 | ~40% |
| 16. Economia | 3 | 4 | 9 | ~30% |
| 17. Tela: mapa e mesa | 3 | 2 | 6 | ~35% |
| **Total** | **32** | **17** | **66** | **~28%** |

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
- ☐ **R6.10** Criar, fundir e extinguir ministérios por lei.
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

## 10. Contas do Estado

- ✅ **R10.1** Receita, gasto, juros, cofre e dívida separados.
- ✅ **R10.2** Juros sobem com dívida e inflação.
- ✅ **R10.3** Regra fiscal por lei (déficit, superávit).
- ◐ **R10.4** Dinheiro na moeda do país, por ano.
- ☐ **R10.5** Emissão de moeda (cobre falta, paga em inflação).
- ☐ **R10.6** Calote (apaga dívida, derruba reputação e juros por anos).

## 11. População e grupos

- ✅ **R11.1** Pops (profissão × estrato) com renda vinda da economia: 25 tipos no mundo, cada país declara as parcelas.
- ✅ **R11.7** Cada pop tem bússola (economico e social); desliza com a vida (R8.5).
- ✅ **R11.2** Grupos com bússola, tamanho e satisfação; 16 grupos no mundo, os 25 pops têm casa; país declara os fortes.
- ✅ **R11.3** Radicais e lealistas.
- ◐ **R11.4** Satisfação lê renda e leis (falta a mídia).
- ☐ **R11.5** Pops mudam de setor estudando (universidade é construção).
- ☐ **R11.6** Pops sobem e descem de estrato.

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
