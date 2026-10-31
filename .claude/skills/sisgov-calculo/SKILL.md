---
name: sisgov-calculo
description: Use when adding or changing an economic calculation in the SisGov engine (src/motor/calculos — Laffer, evasão, juros, multiplicador, defasagem…) or a new tax base.
---

# Cálculo estudado no motor

O motor conhece cálculos econômicos estudados; as leis só apontam para eles.
Cálculo novo é **uma entrada nova no registro**, nunca um `if` por lei ou
por país.

## Checklist

1. **Fonte:** autor e ano do estudo ou manual (ex.: Saez, Slemrod & Giertz,
   2012, elasticidade da renda tributável). Escrever no `.md` do módulo o que
   o cálculo faz, a fonte e o que foi simplificado. Sem fonte, dizer ao
   autor antes de implementar.
2. **Parâmetros vêm de fora:** o que muda por país (pico da curva, evasão de
   base) vem do estado inicial do país com padrão no motor; nunca constante
   com nome de país.
3. **Função pura** em TS, sem React, JSON nem import de fora do `motor/`
   (o lint barra). Entradas e saídas com unidade explícita no nome ou no
   tipo (fração, pessoas, moeda do país).
4. **Teste de unidade** no mesmo módulo, conferindo **forma**, não número
   calibrado: zero na alíquota 0, cresce antes do pico, cai depois, nunca
   negativo, contínuo. Número exato só em identidade contábil.
5. **Ordem de grandeza:** rodar com valores de um país plausível e mostrar
   ao autor; jogabilidade primeiro, sem exagero.
6. `npx tsc -b` e `npx vitest run src/motor/calculos`.
