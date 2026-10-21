# Lote 10: justiça e prisões

> **Status: INTEGRADO E TESTADO FOCALMENTE.** Números novos são hipóteses de
> jogo. As medidas são instrumentos políticos já presentes no catálogo; os
> coeficientes não representam estimativas empíricas.

## Hierarquia e decisões

```text
garantias-penais (Constituição; protegida no Brasil)
  └─ pena-de-morte (lei derivada; exige autorização acima)

maioridade-penal (Constituição; idade de entrada no sistema comum)
  ├─ alternativas-penais-e-audiencia-de-custodia (quem fica preso)
  └─ vagas-em-presidios (capacidade, por verba)

gestao-dos-presidios (lei ordinária; quem opera as unidades)
```

| Lei | Escolha jogável | Relação e custo |
| --- | --- | --- |
| `gestao-dos-presidios` | Administração direta, cogestão de serviços ou PPP que constrói e opera. | Gestão é separada da verba para vagas. A PPP reduz rebeliões com atraso, desloca servidores e traz contrato fiscal hipotético. |
| `vagas-em-presidios` | Regular a verba de expansão de vagas até 0,1% do PIB. | Capacidade material separada de regras penais e gestão. Mais vagas custam e podem aliviar lotação. |
| `alternativas-penais-e-audiencia-de-custodia` | Prisão provisória como regra; audiência rápida e tornozeleira para crimes sem violência; ou ampliar reparação, penas comunitárias e monitoramento. | Liberação criteriosa diminui lotação, reincidência e despesa direta, mas reduz segurança percebida. |
| `maioridade-penal` | Manter prisão comum a partir dos 18 anos ou antecipar para 16. | Mais punição visível aumenta lotação, reincidência e exposição a facções. A mudança é constitucional. |
| `garantias-penais` | Proibir ou permitir pena capital na Constituição. | Regra superior protegida no país inicial; não pode ser contornada com lei ordinária. |
| `pena-de-morte` | Aplicar somente a crimes extremos ou estender a grandes organizações de tráfico. | Filha da autorização constitucional; indisponível na partida inicial brasileira. Sua camada foi corrigida para lei derivada. |

As seis decisões foram **mantidas separadas**: comando da unidade, capacidade,
entrada e saída do sistema, idade penal e permissão constitucional atuam em
alavancas diferentes. A gestão e as alternativas receberam consequências
diretas antes ausentes ou insuficientes. As opções agora mostram apoiadores,
opositores e perdas além dos ganhos.

## Ensaio de 16 turnos

`scripts/teste/setorSegurancaLote10.ts` compara a referência com duas rotas na
mesma semente, sem ocorrências ou eleição. **Punitiva:** PPP, teto de vagas,
prisão provisória ampla e maioridade aos 16. **Restaurativa:** cogestão, um
terço do teto de vagas, alternativas amplas e maioridade aos 18. As mudanças
são aplicadas diretamente para isolar efeitos da rede; isto não testa votação
no Congresso.

| Indicador no turno 16 | Referência | Punitiva | Restaurativa |
| --- | ---: | ---: | ---: |
| Lotação prisional | 42,504 | 40,281 | 37,653 |
| Rebeliões | 11,998 | 3,657 | 9,117 |
| Reincidência | 48,337 | 57,278 | 46,334 |
| Crime organizado | 70,909 | 70,837 | 70,430 |
| Segurança percebida | 35,404 | 46,070 | 31,881 |
| Gasto público (% do PIB) | 30,800 | 31,070 | 30,727 |
| Dívida (% do PIB) | 114,397 | 114,517 | 114,663 |
| Satisfação média | 48,931 | 50,173 | 48,870 |

Os controles das duas rotas estavam implementados no turno 16. Segurança
percebida e rebeliões reagiram nos primeiros turnos; lotação e reincidência
mostraram diferenças mais claras nos turnos 4 a 8. As três partidas acabaram
sem travamento ou valor inválido. A dívida cresce em todas as rotas, como já
acontece na referência; este lote não resolve a dinâmica fiscal do país.

**Limite fiscal observado:** na rota punitiva completa o gasto subiu 0,270
ponto do PIB contra a referência. Porém, com apenas a PPP, um teste focal
encontrou gasto agregado *ligeiramente menor* no turno 16, apesar do efeito
direto de contrato positivo (+0,03 ponto). A rede compensa o custo por outras
relações. Portanto, a frase “PPP aumenta o gasto total” ainda **não foi
validada**; o custo direto é hipótese, e o resultado agregado depende do
conjunto de decisões. A alternativa pode precisar de ajuste no playtest.

**Verificação focal:** 3 testes em `src/tests/segurancaLote10.test.ts`
passaram. Eles cobrem rebeliões, lotação, reincidência, sensação de segurança
e a dependência constitucional da pena capital. `npm run check` fica para o
fim da revisão geral.
