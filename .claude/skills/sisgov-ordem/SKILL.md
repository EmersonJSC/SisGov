---
name: sisgov-ordem
description: Use whenever the SisGov author says "pode seguir", "faça X", asks what comes next, or when you are tempted to propose something "antes" of the chosen step — follow the build order in docs/jogo/requisitos.md without detours.
---

# Seguir a ordem de construir

A ordem está em `docs/jogo/requisitos.md`, seção "Ordem de construir"
(17 passos, V1 no passo 10). Cada sistema tem um bloco **Construção**
(dados, estado, módulo, turno, fatos, tela, teste).

## Regra

O autor reclamou em 12/nov: "sempre que puxo se fez algo, vc acha algo pra
fazer antes do brasil 2026". Depois que ele escolhe o passo:

1. Ler só a linha do passo e o bloco Construção do sistema.
2. Fazer o passo. Nada de "faço antes X?".
3. Achado no caminho:
   - impede o passo → resolver dentro do passo e avisar em uma linha;
   - não impede → vai como dívida no próprio passo (requisitos.md) ou para a
     seção 18 do GDD, e o autor fica sabendo no fim.
4. Ao terminar, marcar o requisito (feito / em parte) em requisitos.md e
   apontar o próximo passo da ordem, sem propor outro.

## Fechar o passo

- Testes do que mudou e `npx tsc -b` (nunca `--noEmit`).
- Mostrar na tela ou na saída do script antes de dizer pronto.
- `RETOMAR.md` com a skill `sisgov-rodada`.
- Commit só com a palavra do autor; `git push` também.
