# Lote 14: piso salarial e rede de segurança

> **Status: INTEGRADO E TESTADO FOCALMENTE.** Os instrumentos têm baliza em
> políticas existentes; números e relações de jogo são hipóteses.

## Hierarquia jogável

```text
quem-decide-o-salario-minimo (Constituição)
  └─ formula-do-salario-minimo (regra de reajuste, quando há piso estatal)
       └─ salario-minimo (valor escolhido neste ano)

legislacao-trabalhista (Constituição; lote 13)
  └─ fundo-de-garantia (reserva e multa, opções travadas pela Constituição)

seguro-desemprego (proteção constitucional após demissão)
```

As cinco leis foram **mantidas**: autoridade, regra de reajuste e valor atual
do piso são decisões diferentes; reserva na demissão e seguro para desemprego
respondem a riscos diferentes. Todas receberam texto de ação e ganhos/perdas
mais claros. O fundo com multa agora exige direitos mínimos compatíveis na
Constituição. Os testes confirmaram também que o jogador não pode escolher
um piso alto quando a regra superior entrega a decisão somente aos sindicatos.

| Escolha | Consequência de jogo |
| --- | --- |
| Quem decide | Extinguir piso nacional, negociar por categoria, comissão técnica ou lei votada. Define quais decisões filhas estão disponíveis. |
| Fórmula | Votação anual, inflação, inflação mais crescimento, ou meta relativa ao salário típico. Ganho real melhora renda e reduz pobreza após quatro turnos, elevando custos e gasto. |
| Valor do piso | Sem piso nacional, piso baixo, intermediário ou alto. Mais renda versus maior custo, informalidade e benefícios vinculados. |
| Fundo de garantia | Nenhuma reserva, conta portátil, fundo com multa ou indenização por antiguidade. Segurança e poupança versus custo de contratação. |
| Seguro-desemprego | Sem benefício, poupança individual, benefício curto, moderado ou longo com busca de emprego. Consumo e pobreza versus despesa fiscal. |

## Ensaio de 16 turnos

`scripts/teste/setorTrabalhoLote14.ts` compara referência com duas rotas da
mesma semente, sem ocorrências ou eleição. **Contenção:** comissão técnica,
reajuste só pela inflação, piso baixo, conta portátil e seguro individual.
**Valorização:** lei nacional, crescimento no reajuste, piso alto, fundo com
multa e seguro longo. Aplicação direta testa a rede, não o Congresso.

| Indicador no turno 16 | Referência | Contenção | Valorização |
| --- | ---: | ---: | ---: |
| Piso implementado (nível) | 67,000 | 33,957 | 100,000 |
| Pobreza | 27,579 | 35,629 | 25,150 |
| Renda das famílias | 44,295 | 40,077 | 45,377 |
| Consumo | 49,621 | 42,386 | 52,436 |
| Desemprego | 6,235 | 5,639 | 9,455 |
| Informalidade | 38,612 | 36,129 | 46,257 |
| Inflação | 4,918 | 3,736 | 5,759 |
| Gasto público (% do PIB) | 30,873 | 28,284 | 33,016 |
| Déficit previdenciário | 3,003 | 1,881 | 4,193 |
| Dívida (% do PIB) | 114,847 | 118,297 | 117,296 |
| Satisfação média | 48,930 | 45,964 | 49,584 |

As três partidas terminaram sem travamento ou valor inválido. Renda e gasto
reagiram nos primeiros turnos ao valor do piso; o efeito novo da fórmula
apareceu após quatro turnos. A escolha traz perdas reais: contenção reduz
custo e desemprego, mas aumenta pobreza; valorização protege renda e consumo,
mas pressiona informalidade, desemprego e contas públicas.

**Limite observado:** a fórmula agora move renda, pobreza, custo e gasto na
rede, mas **não reajusta automaticamente o controle numérico do piso**. O
valor do piso continua uma decisão separada do jogador. A rota de contenção
também terminou com nível implementado 33,957 para alvo 33 por causa da
dinâmica de implantação. Implementar reajuste automático do controle, se
desejado no V1, requer mecanismo genérico de vínculo entre leis; não foi
afirmado como pronto aqui. O forte aumento de informalidade na rota de
valorização precisa de playtest para avaliar equilíbrio e diversão.

**Verificação focal:** 3 testes em `src/tests/trabalhoLote14.test.ts`
passaram. `npm run check` permanece adiado até a revisão geral.
