---
name: sisgov-instituicao
description: Use ao abrir ou revisar uma instituição do SisGov (Saúde, Educação, Segurança…), quando o autor pedir "usa a skill da Saúde" ou quiser achar nos índices e leis de uma instituição os problemas que a Saúde teve.
---

# Revisar uma instituição

Feita com a Saúde (16–17/nov/2026), a primeira instituição revista. A Saúde
levou dois dias; esta lista existe para a próxima levar menos. Relatório da
Saúde, como exemplo: fim de `docs/jogo/revisao-indices-saude.md`.

## Regras do autor (valem sempre)
- **Número real é referência.** IBGE, OCDE e média de países ricos põem no
  eixo e servem de comparação. Nunca viram régua de índice nem verdade do
  jogo.
- **Só as peças que o jogo tem:** pops, regiões, grupos, obras, verba, leis.
  O jogo não tem cidades nem detalhe de estado. Índice que não sai de uma
  peça do jogo não entra.
- **Sem mecânica nova.** Ideia nova vai para `docs/jogo/depois-da-v1.md`
  numa linha. Fecha-se com o que existe.
- **O autor decide.** Listar índices e leis, o que fazem e o que se propõe,
  e esperar a resposta. Medir no código antes de opinar.
- **Uma lista só.** Levantar tudo, propor tudo de uma vez, o autor aprova, e
  então fazer sem parar a cada item.
- **Texto para leigo**, sem emoji: o documento abre com quadradinho no lugar.
  Escrever "Sim", "Não", "Atenção".

## Passo 1. Levantar os índices
Para cada índice da instituição, numa tabela:
- **como é calculado** (lei soma pontos, deriva, conta de um módulo do motor);
- **de onde vem o número inicial** (o país declara? começa em 50?);
- **o que ele empurra fora da instituição** e quem lê isso (grupo, pop, PIB);
- **faz sentido?**

Fontes: `variaveis.json` (dono, avaliação, medida), `derivas.json`,
`paises/<pais>/estado-inicial.json` e o módulo do motor, se houver.

## Passo 2. Levantar as leis
Para cada lei: degraus, sinal de cada efeito, força em escada, o porquê,
quem ganha e quem perde, lado da bússola e o custo.

## Passo 3. Jogar
Brasil, semente 42, `semCongresso`, `semSenado`, `semEleicao`, 24 turnos.
Teste temporário em `src/partida/zz*.test.ts`, apagado depois.
- **Limite:** tudo que ajuda no máximo e tudo que atrapalha no máximo. O
  problema tem solução dos dois lados? Com qual custo?
- **Países de lados diferentes:** montar 3 a 5 perfis só com leis (ex.:
  na Saúde, sistema público, seguro pela folha, mercado de planos, público
  com missões). Cada perfil chega a algum lugar com um custo diferente? Algum
  ganha de todos sem custo?
- **Parado:** nenhum índice salta e nenhum anda sozinho sem motivo.

## Erros que a Saúde teve (procurar em cada instituição)
1. **Deriva sem fim.** A deriva soma a cada turno a distância do turno 0 e
   não para: o índice empurrado sobe até 100.
2. **Começo que não se explica.** O país declara valores que se empurram
   (favela e saúde, por exemplo). Hoje a deriva só mede a mudança, então não
   quebra, mas o começo não sai das peças.
3. **Índice que começa em 50 em todo país** porque o país não declara.
4. **Índice que nada empurra.** Toda política tem consequência fora da
   instituição: saúde pesa no trabalho, droga no crime, aposta no bolso.
5. **Índice sem peça do jogo**, com número escolhido à mão para a conta dar
   o que se queria (o Médico onde falta).
6. **Régua de fora** (a média dos países ricos como o 100 do índice).
7. **Política com a conta errada:** o seguro social contado como plano
   privado subiu a desigualdade.
8. **Sinal trocado:** o "+" queria dizer "lei boa", não "subir a lei sobe o
   índice".
9. **Degrau quebrado:** a vírgula dentro de um degrau virou degrau novo.
10. **Revogar lei revista** (`primeiro_degrau_conta`) é lido como ligar e
    colide.
11. **Corte recusado sem aviso** (o piso da saúde barra a verba menor).
12. **Fio que promete efeito** sem dizer de que depende (a verba que não
    rende por falta de outra coisa).
13. **Ligação sem sentido** entre índices de assuntos diferentes.

## Saída
- Relatório no fim de `docs/jogo/revisao-indices-<instituicao>.md`:
  índices, leis, jogo, erros achados e propostas.
- Resumo curto na conversa, com uma lista de decisões para o autor.
- Depois de feito: seção da instituição em `docs/jogo/mecanicas-feitas.md`
  e `RETOMAR.md`.
