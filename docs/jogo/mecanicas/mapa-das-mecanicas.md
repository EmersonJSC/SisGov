# Mapa das mecânicas

> Reescrito em 31/out/2026, com base só no escopo (`docs/jogo/escopo.md`) e em
> números medidos no código nesse dia. As versões anteriores (fases, J1–J14,
> M1–M13) estão no git.

## Fluxo de um turno (2 meses)

```
TURNO (2 meses)
│
├─ LEIS (nível 0–100%, sem teto por lei)
│    │ efeitos declarados no JSON da lei
│    ▼
├─ ECONOMIA (lê só o nível das leis)
│    gasto e receita em % do PIB → resultado → dívida
│    dívida alta → risco-país → juros → resultado        ← freio por consequência
│    PIB nominal = real + inflação → dilui a dívida
│    TRAVA ÚNICA: soma dos gastos ≤ 100% do PIB
│    saída: índices (PIB, desemprego, inflação, industrialização,
│           instrução, padrão de vida, dinheiro)
│    ▼
├─ POPULAÇÃO (lê só os índices e o nível das leis)
│    satisfação por grupo → radicais / lealistas
│    ▼
├─ VOTO = bússola + economia (votoEconomico) + carisma − DESGASTE
│    ├─ Congresso: aprova ou derruba lei → volta para LEIS
│    └─ turno 24: ELEIÇÃO → perdeu = fim | venceu = novo mandato
│
└─ DESGASTE: sobe todo turno (cruzeiro → queda)
```

**Regra que impede o jogo de quebrar:** cada módulo lê só a saída do anterior
(nível da lei → índices → satisfação → voto). Nenhum mexe no interior do outro.
O único limite duro é a trava de 100% do PIB; o resto é segurado por
consequência (dívida → juros).

## Estado (medido em 31/out)

| Peça | Estado |
|---|---|
| Leis → economia | Funciona; PIB nominal consertado (+28% em 24 turnos) |
| Economia diferencia caminhos | Sim: nada muda → dívida 110%; corte → 91% e pobreza 27→39; social → 118% e aprovação 54 |
| Economia → população → voto | Funciona, mas governos opostos terminam iguais (Mujica e Bolsonaro: satisfação 45,3 × 45,2) |
| Congresso, eleição, derrota | Existem; eleição de 24 turnos ainda não jogada |
| Desgaste | [ ] falta |
| Controle livre 0–100% e trava única de 100% do PIB | [ ] falta (escopo) |
| Liberar todas as opções das leis de escolha | [ ] falta (escopo) |
| Jogador como partido | [ ] falta (escopo) |

## Ordem para a V1 (uma frente por vez)

1. **Governos opostos terminam diferentes.** Termômetro: `scripts/teste/mandato.ts`
   (24 turnos, Mujica × Bolsonaro até a eleição). PIB nominal consertado; próximo suspeito: programa da direita fraco na bússola.
2. Controle livre 0–100% e trava única de 100% do PIB.
3. Desgaste.
4. Jogador como partido.
5. Calibragem jogando na tela.
6. Ministros, por último.

## Fora da V1 (pelo escopo)

Feed das redes, mídia, industrialização por setores, estado dos grupos
(máquina de estados), mercado no estilo Victoria 3, escolha de país, STF.
Ideia nova vai para o fim do `PLANO.md`, não para este mapa.
