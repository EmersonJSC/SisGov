# A rede viva — leis, índices e situações

**Estado:** modelo aprovado pelo autor em 9/out/2026 (decisões D-40 a D-43
do [PLANO](../../PLANO.md)). **Motor implementado no SG154**
(`src/engine/runtime/computeNetwork.ts`); conteúdo do Brasil no SG142.

## Princípio

**Não existe número escondido.** Tudo que afeta um valor é um nó visível da
rede (lei, evento, situação ou índice), e cada nó é explicado pelos nós que o
afetam — recursivamente. Para qualquer nó dá para perguntar:

```text
Nó X
  negativo ← Lei B, Evento C, Situação H, Índice J
  positivo ← Lei I, Evento K, Situação G, Índice L
```

e repetir a pergunta em cada um deles.

## Tipos de bolha

**Tudo na rede é bolha.** O que muda é o tipo, e a diferença real é se a
bolha tem **valor próprio**:

| Tipo de bolha | Valor próprio? | De onde vem o valor | Exemplo |
|---|---|---|---|
| **Lei** | Sim | Nível ou opção (país no início, jogador depois); recebe influência na **eficácia** e no **apoio**; entrega nível × eficácia | Verba para saúde, Lei de drogas |
| **Índice** | Não | Do que recebe, inclusive do **contexto do cenário** (D-55) | Saúde, Desemprego, Corrupção |
| **Situação** | Não | Do que recebe; existe acima de um ponto; pisca e cresce | Crise no atendimento |
| **Contexto do cenário** (D-55) | Sim, fixo | O cenário declara o valor de cada índice no turno 0 (ex.: Brasil 2026); a parte que as leis e a rede não explicam vira este nó, visível na explicação | Contexto do Brasil 2026 |
| **Bolha lenta** (estoque) | Sim (o país declara o ponto de partida) | Acumula o que recebe ao longo de anos; se desgasta devagar | Escolaridade, Desenvolvimento, Infraestrutura, Dívida |
| **Evento** | — | Acontece num momento e dispara efeitos | Epidemia |
| **Grupo social** (SG143) | Não | Satisfação, só do que recebe | Trabalhadores |

Toda bolha influencia e é influenciada. Ministério não é bolha: é a esfera
que agrupa as leis no mapa.

## Intensidade

Toda bolha tem intensidade, que define seu peso visual no mapa:

- **Lei:** pelo valor financeiro (leis de dinheiro) ou pela influência que
  exerce.
- **Índice:** pelo seu valor calculado.
- **Situação:** pisca e cresce conforme fica mais séria.

## Ordem de cálculo do mês (detalhe técnico)

Como leis e bolhas calculadas se influenciam em círculo, o motor usa uma ordem fixa para
continuar determinístico:

1. cada **lei** lê as outras bolhas no estado do mês anterior e calcula sua eficácia e apoio;
2. as **bolhas calculadas** (índices e situações) vêm em cadeia a partir dos
   efeitos das leis e de outras bolhas; num ciclo só entre elas, um dos
   elos usa o mês anterior;
3. o resultado vira o estado do mês; a explicação registra cada elo.

Consequência: a influência de um índice ou situação sobre uma lei chega no
mês seguinte — ainda dentro do mesmo turno de 3 meses.

**Resposta das bolhas (D-54).** Uma bolha calculada não salta de uma vez para
o valor que recebe: anda uma fração do caminho por passo (`respostaDasBolhas`
do mundo: 0,875 por trimestre, metade do caminho por mês). Isso amortece os
ciclos da rede, que sem isso oscilavam de um turno para o outro. A explicação
mostra para onde a bolha vai (`targetValue`) e onde ela está (`result`).

**Turno 0.** O motor repete o mês sem acumular estoques até a rede se
acomodar; nessas passadas, o contexto de cada índice declarado se ajusta até
o índice bater com o valor do cenário. O turno 0 é, assim, um ponto de
equilíbrio: sem ação, o país muda devagar (estoques e dívida).

**Teto do efeito (D-56).** A eficácia acima de 1 reforça a lei, mas o que a
lei entrega não passa da opção mais forte (o teto do controle).

## O que o país declara

Só as leis vigentes e seus níveis, e o que se acumula com o tempo (ex.:
dívida). **Índices e situações não têm valor declarado**: no turno 0 eles são
calculados pela rede. Os agregados do orçamento (previdência, impostos não
modelados…) são provisórios e somem conforme viram leis.

## Exemplo

```text
 LEI Verba atenção básica (35 bi)
   ├─ eficácia ◄── negativo: Corrupção (índice)
   ├─ apoio    ◄── positivo: Crise no atendimento (situação)
   └──► + Cobertura (índice) ──► − Pressão hospitalar (índice) ◄── + Uso de drogas ◄── LEI de drogas
                                          │
                                          ▼
                        Crise no atendimento (situação, acima de 70)
                          ├──► − Saúde da população (índice)
                          ├──► + apoio da Verba (volta para a lei)
                          └──► − eficácia da Verba (hospital lotado rende menos)
```

Mudar a lei de drogas para "cannabis recreativa" sobe o uso de drogas, a
pressão passa de 70 e a crise nasce; ela pede mais verba (apoio) mas faz a
verba render menos (eficácia). Aumentar a verba baixa a pressão e a crise
desaparece sozinha.

## Como escrever no conteúdo (SG154)

- **Nós** (`indicadores/variaveis.json`): `controle` (valor de lei),
  `estoque` (acumula; o país declara o valor), `calculado` (índice) e
  `situacao` (com `surgimento`). Índice e situação **não** aceitam
  `valorInicial`.
- **Eficácia e apoio da lei** são nós automáticos: `eficacia:<id-da-lei>`
  (unidade `fator`, neutro 1, de 0 a 2) e `apoio:<id-da-lei>` (unidade
  `pontos`, neutro 0, de −100 a 100). Qualquer consequência pode mirar neles.
- **Quem é dono de cada ligação:**
  - a lei lista só consequências que **saem do seu controle**;
  - uma consequência que sai de uma bolha (índice, situação ou estoque) e
    não é listada por ninguém é uma **ligação da rede**: vale sempre;
  - eventos continuam listando as suas.
- **Limites:** se a soma passa do domínio do nó, o valor para no limite e a
  explicação marca `limited`.
- **Turno 0:** o país declara leis vigentes e estoques; o motor calcula as
  bolhas calculadas com as leis vigentes ativas e eficácia/apoio no neutro.

## Futuro

Usar IA para animar a rede fica para depois (backlog B-16).
