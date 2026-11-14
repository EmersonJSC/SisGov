# Judiciário

Fatia 1 (14/nov/2026): tribunais, juízes e a vaga. Fila de processos, caso em
etapas, suspender lei e aumentar a corte vêm depois (GDD, "Judiciário e Justiça
e prisões").

## O que vem de fora

- **País** (`paises/<id>/judiciario.json`): os tribunais, cada um com `rotulo`
  (STF, Corte Suprema…), `funcao` (constitucional, ultima-instancia, eleitoral,
  trabalho, militar), `cadeiras` e, se o presidente vem de outro tribunal,
  `presidido_por`; a idade da `aposentadoria`; e as faixas de idade
  `idade_no_comeco` e `idade_do_indicado` (`{ de, ate }`). O motor só lê
  a função. Sem este arquivo (ou sem `pessoas.json`, que dá os nomes), o país
  não tem Judiciário e a etapa não faz nada.
- **Mundo** (`mundo/judiciario/judiciario.json`): a lei que diz quem escolhe
  (`lei_escolha`), o modo de cada opção dela (`carreira`, `senado`, `livre`), o
  índice de independência e quantos pontos ele anda.

- **Juízes declarados** (opcional, por tribunal): `juizes` com nome, sexo,
  idade, `anos_na_corte`, `origem` (partido ou técnico), `bussola` (sem ela, a do
  partido) e `ja_presidiu`; `vagas` já abertas no começo (`saiu`); `presidente`
  (`juiz`, `ha_meses`). As cadeiras que sobram são sorteadas. Brasil: o STF de
  jan/2027 (começo do mandato), com nomes parecidos com os reais e nunca os
  reais (GDD §19): 10 juízes e a cadeira de quem saiu em out/2025 vaga (o
  Senado rejeitou o indicado em abr/2026); Fachini preside o STF desde set/2025
  e Nunes Marcos o TSE desde mai/2026.

## Regras

- **Começo:** toda cadeira tem juiz. Metade técnicos, o resto pelo peso dos
  partidos; idade em `idade_no_comeco` e o indicado em `idade_do_indicado`, as duas do país (Brasil: 45 a 71 e 50 a 64, para a vaga ser rara, perto de uma por mandato). A mesma semente dá os mesmos juízes.
- **Idade:** cada turno soma 2 meses. Quem chega à aposentadoria sai e a
  cadeira fica vaga (fato `juiz-aposentado`).
- **Carreira:** o próprio tribunal preenche a vaga no mesmo turno com um técnico;
  nada chega à mesa.
- **Senado ou livre:** a vaga vira papel importante na mesa, com três cartas:
  um aliado do partido do governo, um técnico respeitado (o mais competente de
  cinco sorteados) e um nome do partido mais perto do lado do Senado. As
  cartas saem da vaga (tribunal, cadeira, turno, vezes barrada): sempre as
  mesmas.
- **Senado vota:** a base do governo aprova; fora dela, só quem está a menos de
  `DISTANCIA_QUE_O_SENADO_ACEITA` na bússola. Maioria simples. Sem Senado,
  vota a Câmara. Barrado, a vaga continua, as cartas mudam e chega papel novo
  (fato `indicado-barrado`); aprovado, o juiz senta (`juiz-nomeado`).
- **A vaga não vence:** enquanto ninguém senta, o tribunal decide com menos gente.
- **Independência:** pontos = `pontos_independencia` × (técnicos − juízes do
  partido do governo) ÷ juízes. O que mudou no turno move a base do índice,
  como a moradia faz com o déficit.

- **Presidente** (como no Brasil, regra fixa): mandato de 2 anos (12 turnos).
  Assume o juiz mais antigo na corte (menor `posse`) que ainda não presidiu;
  todos já presidiram, a fila recomeça. Troca também quando o presidente sai da
  corte. Tribunal com `presidido_por` (o TSE) não tem cadeiras próprias
  (`cadeiras: 0`): o presidente sai da outra corte, depois dela, sem repetir o
  presidente dela (quem já presidiu a corte de origem pode presidir o TSE, como no Brasil). Cada troca é fato
  `corte-novo-presidente`.

## Pedido

`{ tipo: "indicar", tribunal, cadeira, pessoa }`, com `pessoa` o id de uma das
cartas. Cadeira que não está vaga ou pessoa fora das cartas dá erro.
