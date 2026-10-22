# Escopo do SisGov

> **Status: VIGENTE (em escrita).** Define o que o jogo é. O status de cada parte fica no [PLANO](../../PLANO.md).
> Escrito com o autor em 21/out/2026.

## 1. O jogo em uma frase

Um Victoria 3 reduzido com um Democracy 4 mais avançado: o mapa de leis do
Democracy 4, com mais leis e regras próximas às de cada país real, somado
à mecânica de mercado do Victoria 3, com menos gráficos.

Nada é copiado dos dois jogos: eles são referência de gênero, não de conteúdo.

## 2. Quem joga e qual é o objetivo

- O jogador é um **partido**, não o presidente. Na prática ele é o líder
  do partido: escolhe a chapa que disputa e ocupa o governo.
- **Depois:** os candidatos do partido terão aceitação própria e poderão
  mudar de posição por conta própria.
- O objetivo é **industrializar o país**, se ele ainda não for
  industrializado, ou **manter a industrialização e os índices** de um
  país que já é.
- O jogador não constrói nada diretamente. Ele aprova **leis**, inclusive
  de infraestrutura, e são elas que melhoram o mercado e a economia.

## 3. Liberdade e consequência

- O jogo **não limita o jogador aos padrões do país**. Qualquer valor de
  lei pode ir de 0% a 100%, ou ao valor que ele quiser.
  Exemplo: dá para pôr 100% do PIB na educação.
- O que segura o jogador são as **consequências**, nunca uma trava na tela.
- As regras de cada país (como uma lei muda, quem vota) seguem o país real.
  O primeiro país é o **Brasil**.

## 4. Índices essenciais

**Regra:** cada índice essencial é **um número só**, que junta tudo o que
o melhora e o piora (como o padrão de vida do Victoria 3). Os nós da rede
continuam existindo por baixo; o índice é o resumo que o jogador lê.

| Índice | O que junta | Base na rede hoje |
| --- | --- | --- |
| **PIB** | Tamanho da economia | `pib` |
| **Industrialização** | Peso da indústria na economia, produtividade, infraestrutura _(composição a definir)_ | Não existe; peças soltas em `produtividade`, `desenvolvimento`, `infraestrutura` |
| **Instrução** | Escolaridade e aprendizagem | `escolaridade`, `aprendizagem` |
| **Padrão de vida** | Tudo o que melhora e piora a vida: renda, preços, saúde, segurança, moradia… | `qualidade_de_vida`, `renda_familias` |
| **População** | Quantas pessoas há no país | Não existe como número |
| **Radicais** | Pessoas ativamente contra o governo | Não existe |
| **Lealistas** | Pessoas ativamente a favor do governo | Não existe |
| **Dinheiro** | Caixa do governo e dívida | `cofre`, `divida_publica` |

### 4.1 População

- É um **número real** de habitantes (Brasil: cerca de 213 milhões).
- Cresce, cai e migra conforme o contexto.
- Movida por três taxas: **natalidade**, **mortalidade** e **saúde**.
  Migração entra e sai conforme a situação do país.

### 4.2 Radicais e lealistas

- São **dois números separados**, contados em pessoas da população.
- Não somam 100%: com 500 de população, 200 lealistas não querem dizer
  300 radicais. O resto pode **não ter opinião**.
- Eles **acumulam e diminuem** com o tempo, conforme o governo agrada ou
  desagrada cada **grupo de interesse**.
- Exemplo: os motoristas querem gasolina mais barata. O jogador consegue
  reduzir o preço, e parte dos motoristas vira lealista aos poucos.

### 4.3 Grupos (decidido em 21/out)

- **Versão atual (opção A):** os grupos sociais que já existem viram os
  **grupos de interesse**. Grupos novos (como motoristas) podem entrar.
  - Cada grupo tem um **tamanho em pessoas**, tirado dos totais da
    população (renda e ocupação, `populacao.json`).
  - Cada grupo tem dois estoques: **radicais** e **lealistas**. A
    satisfação do grupo com leis e índices move os dois aos poucos.
  - Radicais e lealistas do país são a soma dos grupos, sem contar duas
    vezes quem está em mais de um.
  - Não exige reescrever as consequências que já citam os grupos.
- **Depois (opção B, junto com o mercado):** população em blocos (camada ×
  região × ocupação), cada bloco com renda, opinião e participação em
  vários grupos, como no Victoria 3.

## 5. Como é uma partida

- A partida **começa com o partido do jogador recém-eleito**.
- A cada fim de mandato há eleição. **Perder a eleição é fim de jogo.**
- A tela mostra uma bolha com o **tempo de presidência** e a **quantidade
  de mandatos** do partido.
- No Brasil o mandato dura **4 anos** e o candidato pode ser reeleito
  uma vez (no máximo 8 anos seguidos). Depois disso o partido troca de
  candidato, mas continua no poder enquanto vencer eleições.

- **Hoje:** turno trimestral (3 meses do motor), passado pelo jogador.
  Detalhes em [mecânicas/tempo.md](mecanicas/tempo.md).
- **Decidido (21/out):** tempo corrido com calendário em semanas, pausa e
  velocidades. O motor continua calculando por mês; as semanas são
  apresentação.

## 6. Sistemas do jogo

Cada sistema é uma mecânica com documento próprio: [índice das mecânicas](mecanicas/README.md).

### 6.1 Leis
Regras completas em [leis.md](mecanicas/leis.md).

### 6.2 Bússola ideológica
- A bússola mostra a **ideologia em que o país está**, não a do jogador.
  Exemplo: os EUA de hoje estariam perto de Trump; o Brasil, perto do
  governo Lula III.
- Ela mostra para onde o jogador está levando o país, e assim o jogador
  descobre o que talvez ele mesmo defenda.
- O jogador pode propor leis de **qualquer lado político**, dentro do que
  a bússola permitir. _(o que a bússola permite e bloqueia: a definir)_

### 6.3 Congresso
- No lugar dos pontos de força política do Democracy 4, a lei precisa
  dos **votos do Legislativo**.
- Cada país tem o próprio caminho legislativo. No Brasil, votam a Câmara
  e o Senado (detalhes em [leis.md](mecanicas/leis.md#27-como-uma-lei-muda)).

### 6.4 Economia e mercado
- **Versão atual:** o jogador controla a economia como no Democracy 4,
  por leis e orçamento.
- **Depois:** o mercado é expandido no estilo do Victoria 3.

### 6.5 Orçamento
### 6.6 População e opinião
### 6.7 Eleição e desgaste do partido

- Cada país define a duração do mandato e o limite de reeleição do
  candidato. O partido pode seguir no poder enquanto vencer eleições.
- **Desgaste:** quanto mais tempo o mesmo partido fica no poder, mais
  escândalos de corrupção aparecem. O partido enfraquece e cresce um
  **sentimento antipartido** e mais **fake news** contra ele, o que aumenta
  a **polarização**.
- O desgaste é um número que **sobe sempre**, num valor fixo por período
  no poder. Um partido com 20 anos no poder sofre bem mais que um com 8.
- O jogador **reduz** o desgaste com eventos e outras ações, mas nunca
  consegue zerá-lo nem impedir que ele continue subindo.
  _(valor da subida, ações que reduzem e quanto reduzem: a definir)_
- **Base real (pesquisa de 21/out):**
  - *Custo de governar* (Nannestad e Paldam): o governo perde em média
    **cerca de 2,25 pontos de votos por mandato**; a faixa citada é de 2 a 3.
  - *Cruzeiro e queda* (Cuzán e Heggen): o voto fica **quase estável**
    enquanto o partido governa e despenca de uma vez quando ele perde. A
    perda total é parecida, seja o governo curto ou longo.
- **Regra do jogo (decidida em 21/out):** o desgaste junta os dois modelos.
  - Por baixo, o desgaste **sobe sempre**, num valor fixo por período no
    poder (curva do custo de governar).
  - Por cima, a opinião sobre o partido **segura** enquanto ele governa
    (cruzeiro).
  - Um escândalo, uma crise ou uma eleição faz o desgaste acumulado
    **aparecer de uma vez** (queda).
  - A regra é **global**: vale igual para todos os países, como as
    consequências do mundo. O país só muda o estado inicial (por exemplo,
    há quanto tempo o partido já está no poder).
### 6.8 Ocorrências e eventos

## 7. Fora do escopo por enquanto

- Supremo Tribunal Federal (STF). Sem ele, quem reage a mudanças em leis
  pétreas é o Senado e a população (ver [leis.md](mecanicas/leis.md)).
- Mercado no estilo do Victoria 3 (fica para depois da versão atual).

## 8. Glossário
