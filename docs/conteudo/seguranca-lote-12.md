# Lote 12: justiça e proteção

> **Status: INTEGRADO E TESTADO FOCALMENTE.** Os números são hipóteses de jogo;
> a existência dos instrumentos é balizada pelas fontes já registradas no
> catálogo.

## Decisões

```text
delação premiada: proibir → acordo com juiz → acordo como regra
excludente de ilicitude: reação necessária → incluir medo/surpresa
proteção doméstica: sem rito → crime comum → medida protetiva → rede de abrigo
verba da PF: orçamento anual dentro do teto legal
```

`delacao-premiada-e-acordos` repetia as mesmas três opções de
`delacao-premiada`, acrescentando somente um efeito de liberdade civil que a
lei antiga já possuía. **Juntamos** as decisões em `delacao-premiada`, que já
tinha nove efeitos. A ficha duplicada, seu controle, seu efeito e referências
ativas foram removidos; a descrição das opções e seus apoiadores foram
incorporados na lei canônica. As outras três leis foram **mantidas** como
alavancas diferentes. A verba da PF é ficha v3 e já tinha oito efeitos diretos.

| Lei | Ganho e perda do jogador |
| --- | --- |
| `delacao-premiada` | Acordos com juiz ajudam a expor corrupção e facções; acordos amplos reduzem impunidade, mas podem pressionar acusados e elevar polarização. |
| `excludente-de-ilicitude` | A regra ampla protege policiais em serviço e pode frear crimes patrimoniais, mas eleva letalidade e reduz confiança. |
| `protecao-contra-violencia-domestica` | Medidas rápidas e casas-abrigo protegem vítimas com atraso, exigindo equipes e orçamento. A ausência de rito próprio economiza serviço à custa de proteção. |
| `verba-policia-federal` | Mais investigadores elevam inteligência e, depois, reduzem corrupção e crime organizado; o gasto aparece cedo. |

## Ensaio de 16 turnos

`scripts/teste/setorSegurancaLote12.ts` compara referência e duas rotas com a
mesma semente, sem ocorrências ou eleição. **Linha dura:** acordos amplos,
excludente amplo, proteção doméstica apenas como crime comum e verba máxima da
PF. **Proteção:** acordo supervisionado, excludente restrito, rede completa de
abrigo e metade do teto da PF. Aplicação direta testa a rede, não o Congresso.

| Indicador no turno 16 | Referência | Linha dura | Proteção |
| --- | ---: | ---: | ---: |
| Impunidade | 68,651 | 65,410 | 65,678 |
| Corrupção | 68,674 | 60,971 | 66,519 |
| Crime organizado | 70,909 | 60,848 | 68,217 |
| Letalidade policial | 30,973 | 42,918 | 30,946 |
| Liberdade civil | 70,030 | 63,035 | 67,712 |
| Proteção efetiva às mulheres | 72,317 | 68,222 | 76,299 |
| Confiança institucional | 31,512 | 28,552 | 32,946 |
| Gasto público (% do PIB) | 30,800 | 31,001 | 30,952 |
| Dívida (% do PIB) | 114,397 | 115,495 | 114,565 |
| Satisfação média | 48,931 | 49,448 | 49,503 |

As três partidas acabaram sem travamento ou valor inválido. Inteligência e
gasto reagiram até o turno 4; crime e proteção doméstica ficaram claramente
diferentes nos turnos 8 a 16. O dilema apareceu: a linha dura desmonta mais
crime, mas aumenta a letalidade policial em 11,945 pontos e deixa menos
mulheres protegidas. A rota protetiva melhora confiança e proteção com ganho
criminal menor.

Todos os controles chegaram ao alvo no turno 16 **exceto** a opção de proteção
doméstica da linha dura: alvo 33, valor implementado 33,957. O desvio é pequeno,
mas registrado para investigar o comportamento de implantação/degradação
antes de dizer que a opção ficou exata. Os coeficientes ainda precisam de
playtest humano de diversão.

**Verificação focal:** 3 testes em `src/tests/segurancaLote12.test.ts`
passaram, incluindo criação de partida sem a ficha duplicada. A checagem
geral continua adiada até o fim da revisão.
