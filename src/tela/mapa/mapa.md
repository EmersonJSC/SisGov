# Mapa em três anéis (primeira fatia, 01/nov/2026)

Só desenha. Sem clique, sem linhas: elas vêm no foco (próxima fatia).
Base: `docs/jogo/interface/mapa-em-tres-aneis.md`.

```
centro:  Presidência
anel 1:  as leis, em fatias, uma fatia por área
anel 2:  os índices de jogabilidade (o que muda)
anel 3:  os grupos (quem sente)
```

## Áreas

Poucas, para 15 leis: Economia, Social, Segurança e instituições, Meio
ambiente. Estão em `src/conteudo/mundo/areas/areas.json`: cada área lista os
ids das suas leis. Toda lei do mundo está em exatamente uma área; o erro de
quem esquece uma lei aparece ao montar o mapa.

## Comportamento esperado (escrito antes)

- Cada área é uma fatia do anel 1. Os ângulos das fatias somam 360° e não se
  sobrepõem. A fatia cresce com o número de leis, com um mínimo (área
  pequena não some).
- Toda lei fica dentro da fatia da sua área.
- Cada índice fica perto do ângulo médio das leis que o mexem (até 35°).
  Índice que nenhuma lei mexe vai para o maior vão do anel.
- Cada grupo fica perto do ângulo médio dos índices que ele cobra; sem índice
  no anel, vale o das leis que citam o grupo.
- Nada se sobrepõe: dois nós do mesmo anel ficam a pelo menos 24 unidades
  de arco um do outro.
- Funções puras: o motor não lê posição e a tela não calcula jogo.
