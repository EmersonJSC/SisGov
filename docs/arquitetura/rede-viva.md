# A rede viva — leis, índices e situações

**Estado:** modelo aprovado pelo autor em 9/out/2026 (decisões D-40 a D-43
do [PLANO](../../PLANO.md)). Implementação: SG154 (motor) e SG142 (conteúdo).

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

## Dois tipos de nó

| | **Lei** | **Bolha** (índice ou situação) |
|---|---|---|
| Valor próprio | Sim: nível ou opção (país no início, jogador depois) | **Não**: sem valor inicial e sem base |
| Recebe influência | Sim, na **eficácia** e no **apoio** | Sim, e é só disso que ela é feita |
| Influencia | Sim: efeito = nível × eficácia | Sim: devolve o resultado do cálculo |
| Papel | Entrada da rede | Processa o que recebe e repassa |

- **Índice:** medida que sempre existe (saúde, desemprego, corrupção).
- **Situação:** condição que pode não existir (crise no atendimento). Também é
  só cálculo; aparece quando passa de um ponto e então tem intensidade.

## Intensidade

Toda bolha tem intensidade, que define seu peso visual no mapa:

- **Lei:** pelo valor financeiro (leis de dinheiro) ou pela influência que
  exerce.
- **Índice:** pelo seu valor calculado.
- **Situação:** pisca e cresce conforme fica mais séria.

## Ordem de cálculo do mês (detalhe técnico)

Como lei e bolha se influenciam em círculo, o motor usa uma ordem fixa para
continuar determinístico:

1. cada **lei** lê as bolhas do mês anterior e calcula sua eficácia e apoio;
2. as **bolhas** são calculadas em cadeia a partir dos efeitos das leis e de
   outras bolhas; num ciclo só entre bolhas, um dos elos usa o mês anterior;
3. o resultado vira o estado do mês; a explicação registra cada elo.

Consequência: a influência de uma bolha sobre uma lei chega no mês seguinte.

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

## Futuro

Usar IA para animar a rede fica para depois (backlog B-16).
