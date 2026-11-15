# Prompt: plano dos requisitos a partir do GDD

> Colar numa sessão nova do Claude Code (Opus). Refeito em 14/nov/2026.
> O Opus coordena e entende o todo; Haiku e Sonnet fazem o trabalho por seção.

---

## Antes de tudo: o motor não está pronto

O `src/motor/` tem 26 pastas e cerca de 13.300 linhas, fora os testes. Foi
escrito e reescrito em várias rodadas, uma por cima da outra. Por isso:

- **Nenhum status é confiável.** O "No motor hoje" do GDD, os ✅ do
  `requisitos.md`, os comentários no código e os testes que passam mostram o que
  alguém achou em algum dia. Não provam que o código está certo.
- **Existir não é estar pronto.** Código que existe é ponto de partida, não
  resposta. Cada mecânica confere de novo o que existe e se aquilo faz o que o
  GDD de hoje pede.
- **O código pode ter camadas mortas:** dois jeitos de calcular a mesma coisa,
  função que ninguém chama, campo de estado que ninguém lê, regra de uma versão
  antiga do GDD, teste que confere o comportamento antigo.
- **O GDD manda.** Se o código e o GDD discordam, o código está errado ou a
  divergência vira pergunta ao autor. Nunca se reescreve o requisito para caber
  no código.
- **Auditar não é consertar.** Esta rodada só diz o que existe e o que está
  certo ou errado. Refatorar e mudar comportamento são pedidos separados,
  depois.

O status de cada requisito sai **só** da auditoria desta rodada (Fase 3).

### As leis serão reconstruídas e reorganizadas

As 511 leis em `src/conteudo/mundo/leis/*.json`, o `leis.xlsx` e o `gdd.xlsx`
**não são a base dos requisitos**. Elas foram escritas em moldes diferentes, em
rodadas diferentes, e vão ser refeitas e reorganizadas depois desta rodada.
Por isso:

- **Os requisitos descrevem o molde da lei, não as leis.** A Parte 4 define o
  que toda lei precisa ter: tipo, jeito, canal, ponto doce, força e atraso,
  colisão, revogação e a instituição que a executa. As outras Partes dizem o
  que uma lei pode mexer naquela mecânica (que estado, por qual canal).
  Nenhum requisito cita uma lei pelo nome nem conta quantas leis existem.
- **A lei atual não prova o requisito.** Se uma lei JSON faz algo que o GDD
  não pede, isso não vira requisito. Se o GDD pede algo que nenhuma lei usa, o
  requisito fica do mesmo jeito.
- **Na auditoria, as leis só entram como amostra.** O Haiku pega até 5 leis
  que tocam a seção, para mostrar como o motor lê o JSON hoje. O veredito vale
  para o **leitor do motor** (o código), não para o conteúdo da lei. Lei com
  campo que o motor ignora, ou campo que o motor espera e nenhuma lei tem, vai
  para a lista de camadas.
- **Ao fechar a Parte 4, sai a lista do que a reconstrução das leis precisa:**
  campos do molde novo, campos antigos que saem, como elas se agrupam por
  mecânica e instituição, e de onde cada campo vem na planilha. Essa lista vai
  para o "Em aberto" da 4.1 do GDD, com data. Ela é a entrada do trabalho de
  reconstruir as leis, que é um pedido separado e vem depois.
- **Nenhuma lei é editada, apagada ou movida nesta rodada.**

---

## O pedido

Reconstruir `docs/jogo/requisitos.md` a partir do `docs/jogo/gdd.md` (4.666
linhas, 95 seções, Partes 1 a 9) e auditar o motor contra ele, uma mecânica
por vez. Os números R existentes ficam como referência: requisito novo ganha
número novo, e R que sumiu fica marcado como "saiu em 14/nov".

Leia antes: `CLAUDE.md`, `RETOMAR.md`, `docs/jogo/arquitetura.md`, as Partes 1
e 4 do GDD inteiras e a skill `sisgov-mecanica`. Use a skill `sisgov-lote` para
dividir o trabalho entre os agentes.

Fluxo de cada Parte:
**autor leu a Parte no GDD → Sonnet extrai e escreve requisitos (Fases 1+2
juntas, por lote) → Haiku mapeia o código → Sonnet confere o código → Opus
cruza → autor responde → Opus fecha.**

### Ajustes aprovados em 14/nov

1. **Nomes:** Parte 2 é Sociedade, Parte 4 é Máquina pública.
2. **Leitura antes:** cada Parte começa com o autor lendo a Parte no GDD (a
   Parte 1 já foi lida).
3. **Onda 1 antes da auditoria:** antes da Fase 3 da Parte 1, `npm run check`
   e commit da onda 1 das leis, com a palavra do autor. As Fases 0 a 2 não leem
   código e podem andar antes.
4. **Lotes, não seções:** as Fases 1 e 2 viram um Sonnet só, que devolve as 5
   tabelas e os requisitos. As seções vizinhas da mesma Parte vão juntas, em
   lotes de ~200 linhas do GDD (seção grande vai sozinha). O Opus confere 5
   itens ao acaso de cada lote. São ~75 agentes, em vez de 380.
5. **Commit:** `requisitos: Parte N (nome)` só com a palavra do autor, sem
   push. `docs/jogo/requisitos-rascunho/` fica fora dos commits e é apagada no
   fim.
6. **Economia (14/nov, depois da Parte 1):** a Parte A vira só a lista de
   buracos (as tabelas repetiam o GDD); as Fases 3a e 3b viram um Sonnet só por
   lote, que acha o código e dá o veredito. Saídas em
   `docs/jogo/requisitos-rascunho/saidas/`.

A próxima Parte só começa depois que o autor responder as perguntas da
anterior.

---

## Fase 0 — Opus monta a ficha de contexto (uma vez)

Escreva `docs/jogo/requisitos-rascunho/00-ficha.md`, com no máximo 150 linhas.
A ficha vai junto com cada agente:

- os princípios da 1.3, copiados como estão;
- as etapas do turno (1.5), na ordem;
- as regras do projeto:
  - o motor não conhece nomes de leis, partidos ou países;
  - toda lei chega ao pop por um canal (4.4);
  - nenhum dinheiro some (3.6);
  - lei não tem condição escrita, o efeito vem do estado do país;
  - não há pontos de ação: o limite vem do mundo e só atrasa;
- o glossário do Anexo B;
- a lista das pastas de `src/motor/`, cada uma com uma linha: *o que o nome
  sugere*. Não diga o que ela faz; isso a Fase 3 descobre.

Depois corte o GDD por seção (`###` e `####`) com um **script**, não com um
agente: um arquivo por seção em `docs/jogo/requisitos-rascunho/secoes/`, cada
um com as linhas de origem. **Tire do recorte o bloco "No motor hoje"**, para
nenhum agente herdar o status antigo.

---

## Fase 1 — Haiku extrai o GDD (um agente por seção)

Modelo `haiku`, em paralelo, uma Parte de cada vez.

```
Você lê UMA seção do GDD do SisGov (simulador de governo). Não escreva
requisitos e não dê opinião. Só extraia o que está escrito.

Ficha: [00-ficha.md]
Seção: [arquivo]

Devolva 5 tabelas, cada item com a linha do GDD:
1. ENTIDADES: nome | o que guarda | linha
2. REGRAS: quando acontece | o que muda | quanto (número ou "não diz") | linha
3. NÚMEROS: valor | a que se refere | linha
4. LIGAÇÕES: o que esta seção lê ou altera em outra seção | linha
5. BURACOS: o que um programador precisaria saber e a seção não diz
   (valor, ordem, caso com 0 ou no máximo, revogar no meio, duas leis no
   mesmo alvo)

Proibido: prosa, opinião, inventar número.
```

O Opus confere 5 itens ao acaso de cada extração contra o GDD. Se a linha
citada não bater, roda o agente de novo.

---

## Fase 2 — Sonnet escreve os requisitos (um agente por seção)

Modelo `sonnet`. Recebe a ficha, a seção e a extração. **Não olha o código.**
O requisito diz o que o GDD pede, não o que o motor faz hoje.

```
Escreva os requisitos da seção [n] do GDD do SisGov, usando SÓ a seção, a
extração e a ficha. Não abra src/. O que faltar fica [ABERTO].

Formato:

### [PARTE-SEÇÃO-nº] Título curto      (ex.: ECO-3.7-02)
- R antigo: R__ ou "novo"
- GDD: L____–L____
- Regra: uma frase com sujeito, gatilho e efeito.
  Bom: "Ao fim do turno, o pop que gasta mais do que ganha usa a poupança;
  quando ela zera, corta o gasto de luxo antes do de comida."
  Ruim: "O sistema deve simular o consumo de forma realista."
- Entra: o dado que a regra lê
- Sai: o que ela grava ou o fato do turno que avisa
- Aceite: um caso com números, de preferência do Brasil-2026
- Extremos: com 0, no máximo e com revogação no meio do turno
- Depende de: IDs de outros requisitos

Regras:
- Um requisito, uma regra. Se a frase tem "e também", divida em dois.
- Palavras proibidas: intuitivo, realista, equilibrado, dinâmico, robusto,
  imersivo, adequado, eficiente, "de forma a".
- Todo requisito cita um nome concreto do jogo: pop, índice, lei,
  instituição, canal ou fato do turno.
- Número que o GDD não dá vira [ABERTO: valor de X].
- Fora da Parte 8, não descreva tela; diga só que dado a tela recebe.

No fim, PERGUNTAS AO AUTOR: até 5, cada uma com duas opções concretas.
```

---

## Fase 3 — Auditoria do motor, mecânica por mecânica

O que existe no código é examinado agora, do zero, contra os requisitos da
Fase 2.

### 3a — Haiku mapeia o código (um agente por seção)

```
Ache no src/ do SisGov o código que trata desta seção do GDD. Não julgue se
está certo. Só aponte onde está.

Requisitos da seção: [n-requisitos.md]

Para cada requisito, liste:
- arquivo:linha de cada função, tipo ou campo de estado ligado a ele
- quem chama a função (grep) e se o resultado é lido por alguém
- o teste que cobre (arquivo:linha) ou "nenhum"
- o leitor do motor que lê o JSON das leis e dos países para esta regra
- até 5 leis de amostra que tocam a seção (só para mostrar o formato lido
  hoje; as leis serão reconstruídas, não as avalie)
Depois liste, à parte:
- CÓDIGO SEM DONO: funções e campos nas pastas desta seção que não batem com
  nenhum requisito
- DUPLICADOS: dois lugares que parecem calcular a mesma coisa
```

### 3b — Sonnet confere o código contra o requisito (um agente por seção)

```
Para cada requisito, leia o código apontado no mapa e dê UM veredito:

- CERTO: faz o que a regra e o aceite pedem. Mostre o trecho que prova.
- ERRADO: existe, mas faz outra coisa. Diga a diferença com números
  ("o código usa a renda do turno passado; o GDD L1402 manda usar a atual").
- PELA METADE: faz parte. Diga o que falta.
- VELHO: segue uma regra que o GDD de hoje não tem mais. Cite o trecho.
- DUPLICADO: há mais de uma implementação. Diga qual delas está em uso de
  fato (quem chama) e qual está morta.
- FALTA: não existe.

Para CÓDIGO SEM DONO, diga: está morto (ninguém chama) / está vivo mas sem
regra no GDD / é de uma versão antiga.

Leis de amostra: diga só se o leitor do motor usa cada campo que elas têm,
e que campo o leitor espera que elas não têm. Não julgue a lei em si.

Para cada teste encontrado: confere a regra de hoje ou a antiga?

Proibido: dar CERTO porque existe ou porque o teste passa. Sem trecho que
prove, não é CERTO. Não proponha conserto.
```

Saída: `secoes/<n>-auditoria.md`.

---

## Fase 4 — Opus cruza a Parte inteira

1. **Prova do CERTO:** abra 3 vereditos CERTO ao acaso e leia o código você
   mesmo. Se um deles não estiver certo, a seção inteira volta ao Sonnet.
2. **Camadas:** junte os DUPLICADOS e o CÓDIGO SEM DONO da Parte. Monte um
   mapa: o que está em uso de fato, o que está morto, o que é de uma versão
   antiga.
3. **Conflito entre requisitos:** dois requisitos mexendo no mesmo estado com
   regras diferentes.
4. **Dinheiro que some:** todo fluxo tem origem e destino (3.6).
5. **Fatos do turno:** todo fato avisado tem quem leia, e vice-versa.
6. **Ordem do turno:** quem lê um dado roda depois de quem o grava.
7. **Nome no motor:** nenhum requisito nem código do motor cita lei, partido
   ou país pelo nome.
8. **R antigo:** cada R de 13/nov aparece num requisito novo ou está como
   "saiu". Onde o ✅ antigo virou ERRADO, VELHO ou FALTA, registre.
9. **Genérico:** grep pelas palavras proibidas. O que aparecer volta.
10. **Teste do programador novo:** para 3 requisitos ao acaso, dá para
    escrever o teste automatizado só com eles? Se não dá, volta.

Devolva ao autor **no chat**:
- a contagem por veredito (CERTO, ERRADO, PELA METADE, VELHO, DUPLICADO, FALTA);
- os ✅ antigos que caíram;
- o mapa das camadas: o que parece morto e o que está duplicado;
- os conflitos, cada um com uma proposta;
- as perguntas, sem repetição, no máximo 10.

---

## Fase 5 — Autor responde, Opus fecha a Parte

- Aplique as respostas. Decisão nova também vai para o GDD, na seção da
  mecânica, com data.
- Substitua o "No motor hoje" de cada seção do GDD pelo veredito da auditoria,
  com a data de 14/nov.
- Junte a Parte no `requisitos.md`, no lugar do bloco antigo. Cada requisito
  traz o veredito e o arquivo:linha.
- Guarde a lista do código morto e duplicado em
  `docs/jogo/codigo-a-conferir.md`, que já existe. **Não apague código nesta
  rodada.**
- Na Parte 4, escreva no "Em aberto" da 4.1 a lista do molde novo das leis
  (campos que entram, campos que saem, agrupamento por mecânica e
  instituição). As leis em si não mudam nesta rodada.
- Atualize o `RETOMAR.md`: Parte fechada, próxima Parte, perguntas que ficaram.
- Commit: `requisitos: Parte N (nome)`.

---

## Ordem das Partes

1 (O jogo) → 4 (Máquina pública) → 3 (Economia) → 2 (Sociedade) →
5 (Política) → 6 (Mídia) → 7 (Mundo) → 9 (Narrativas) → 8 (Tela).

Máquina pública vem antes porque Economia, Sociedade e Política se ligam
pelo JSON das leis.
Tela vem por último porque só mostra o que as outras Partes produzem.

## Custo e limites

- Haiku: 95 seções na Fase 1, mais 95 na Fase 3a. Barato e em paralelo.
- Sonnet: 95 na Fase 2, mais 95 na Fase 3b, mais os retornos.
- Opus: Fase 0, as conferências ao acaso, a Fase 4 e a Fase 5. Depois da Fase
  0, o Opus nunca lê o GDD inteiro nem o motor inteiro de uma vez.
- Se uma Parte passar de 2 rodadas de retorno ao Sonnet, pare e reveja com o
  autor.
