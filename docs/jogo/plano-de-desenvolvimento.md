# Plano de desenvolvimento

> **Status: APROVADO em 31/out/2026.** O [GDD](gdd.md) descreve o jogo pronto
> (**o quê** e **por quê**); este plano diz **o que já está feito, em que
> ordem e como construir**. Em conflito, vale o GDD.

## 1. Onde estamos e por onde começar

- **Feito:** passo 1 (escopo), 2 (índices), 2b (fundação), 3 (modelo de lei),
  4 (turno mínimo; versão 0.1), 5 (contas), 6 (leis da V1; versão 0.2) e
  7 (população e grupos), 8 (Congresso; versão 0.3) e 9 (eleição e
  desgaste; versão 0.4), 10 (tela e salvar; versão 1.0) e 11 (mundo).
- **Depois da 1.0, feito:** o mapa como única tela e a bússola política
  (leis e grupos em dois eixos).
- **Próximo:** passo 12b (economia: construções → empresas → bolsa),
  começando pelo pilar 1 (construções), com as regras de lucro, salário e
  obra do GDD (seção 16).
- **Ordem do que falta** (um por vez; o próximo só abre quando o anterior
  fecha jogável):
  1. 12b pilar 1 — Construções.
  2. 12b pilar 2 — Empresas e dono.
  3. 12b pilar 3 — Bolsa.
  4. Passo 13 — Leis em pacotes, um por vez.
  5. O resto do GDD, na ordem que o autor escolher (partido, ministros,
     mídia, campanha, coligação…).
  6. No fim: equilibrar com dois países grandes e diferentes (inspirados,
     com nome inventado); checar com advogado antes de publicar.

## 2. Regra de expansão

Cada passo **começa pequeno** e deixa a porta aberta. Expandir é **somar**,
nunca reescrever:

- cálculo novo = uma entrada nova no registro de cálculos;
- lei nova = um JSON novo;
- regime novo = uma estrutura nova de Congresso, mesmo motor;
- índice, pop ou grupo novo = dado no JSON.

Se uma expansão exigir mexer no que já está pronto, o desenho do passo
estava errado: para e revê com o autor. As expansões listadas abaixo são
**opções**, não compromisso; ficam fora da V1 até o autor escolher.

## 3. Roteiro

### Passo 2b — Fundação ✅

Arrumar a casa antes da primeira lei.

| Começa com | Pronto quando |
|---|---|
| Esqueleto das pastas `motor/`, `conteudo/`, `partida/`, `tela/`, `scripts/`, com `index.ts` vazios | `npx tsc -b` passa |
| Fronteiras entre camadas no lint (seção 4) | um import proibido de propósito quebra o lint |
| `package.json` só com `dev`, `build`, `test`, `lint`, `format`, `check` | scripts antigos fora |
| `AGENTS.md` apontando para escopo e plano | — |
| `npm run check` verde | local e no CI |

**Expande depois:** nada; fundação não cresce, só se mantém.

### Passo 3 — Modelo de lei ✅

| Começa com | Pronto quando |
|---|---|
| `motor/estado`: tipos dos índices essenciais | — |
| `motor/calculos`: registro de bases com **uma** base, `renda` (Laffer + evasão), fonte citada | teste de unidade do cálculo |
| Formato da lei: imposto de renda (contínua) e pena de morte (opções) | autor aprova os dois JSON (31/out; pico de Laffer declarado por país) |
| Validador do JSON | lei inválida falha com arquivo, campo e motivo |

**Expande depois:** bases `consumo`, `folha`, `lucro`; lei contínua com
faixas (imposto progressivo); efeito condicional ("só se desemprego > X").

### Passo 4 — Turno mínimo ✅

| Começa com | Pronto quando |
|---|---|
| `motor/turno` com a ordem da seção 5 (etapas ainda vazias pulam) | — |
| `motor/efeitos`: fila com atraso por efeito | — |
| `motor/acaso`: semente fixa | mesma semente, mesma partida |
| `partida/`: criar partida (mundo + país de teste) e avançar turno | — |
| `scripts/mandato.ts` | joga 24 turnos; a lei em três valores dá três países diferentes, na direção prometida |

**Expande depois:** histórico completo para gráficos; desfazer turno;
vários países de teste.

### Passo 5 — Contas ✅

| Começa com | Pronto quando |
|---|---|
| `motor/contas`: receita, gasto, juros, cofre e dívida separados; sobra vai ao cofre, falta sai do cofre e depois vira dívida | invariante "contabilidade fecha" roda todo turno |
| Juros sobem com a dívida (cálculo estudado no registro) | dívida alta sobe juros no script |

**Expande depois:** emissão de moeda e inflação; banco central
independente ou não (lei essencial); dívida externa e câmbio.

### Passo 6 — Leis da V1 ✅

| Começa com | Pronto quando |
|---|---|
| Poucas leis (lista aprovada pelo autor antes), só JSON; cada imposto tira a sua parte de `receita_fora_das_leis` | cada lei tem o comportamento esperado escrito antes e conferido por script |
| Segundo país de teste | o motor roda os dois sem código de país |
| Calibração de ordem de grandeza | números plausíveis nos dois países |

**Expande depois:** mais leis, sempre por JSON.

### Passo 7 — População e grupos ✅

| Começa com | Pronto quando |
|---|---|
| `motor/populacao`: poucos pops (profissão × estrato), tamanho em pessoas, renda pelo motor | `npm run pops` |
| Poucos grupos que leem os pops; satisfação, radicais, lealistas | leis e índices movem os grupos no script (`npm run grupos`) |

**Expande depois:** até ~25 pops; migração entre pops (desemprego empurra
para baixo); grupos novos por JSON.

### Passo 8 — Congresso ✅

| Começa com | Pronto quando |
|---|---|
| `motor/politica`: presidencialismo (uma estrutura de votação) | lei só muda com voto (`npm run congresso`) |
| Exorbitante barrado | proposta absurda cai no script |
| Base e oposição reagem às leis | — |

**Expande depois:** parlamentarismo (V1, segundo regime); veto e
derrubada de veto; bicameral; partido único (outra versão ou DLC).

### Passo 9 — Eleição e desgaste ✅

| Começa com | Pronto quando |
|---|---|
| Desgaste fixo por período; eleição a cada 6N turnos pelo apoio pesado por tamanho | mandato termina em vitória ou derrota que o jogador entende |

**Expande depois:** perder o poder fora da eleição (impeachment, voto de
desconfiança); percepção do déficit pelo eleitor (GDD, seção 13).

### Passo 10 — Tela ✅

| Começa com | Pronto quando |
|---|---|
| Tela simples: índices, leis, propor lei, passar turno, resultado da eleição | jogar uma partida inteira na tela |
| Salvar e carregar em `partida/` | partida salva volta igual |

**Expande depois:** tela elaborada, gráficos, mapa, arte.

### Passo 11 — Mundo ✅ (02/nov)

O mercado vem depois do mundo: todo país disputa o mesmo mercado, então
antes é preciso existir quem está do outro lado (01/nov, autor).

| Começa com | Pronto quando |
|---|---|
| O mundo declara as **grandes potências**: representam blocos reais (um grande país do ocidente, um bloco europeu, uma potência asiática, uma potência do leste, os países árabes), mas **sem nome real**; cada uma tem posição na bússola, peso e relação com as outras | o validador recusa potência sem posição ou relação com potência que não existe |
| Cada potência tem a **sua própria opinião** sobre o seu país; o país declara a de partida | — |
| A opinião muda com as suas políticas, pela bússola: lei que aproxima o país da potência sobe a opinião, a que afasta desce. É separada da opinião dos pops | script (`npm run mundo`): uma lei mudada move a opinião de cada potência na direção certa |
| O índice **reputação internacional** passa a ser a média das opiniões, pesada pelo peso de cada potência; as leis que mexiam nele passam a mexer nas potências | o script mostra a média batendo com as opiniões |
| Índice novo **segurança externa** (0 a 100): cai quando potência forte tem opinião ruim do país. O país pode ser atacado, mas nunca começa guerra; o ataque em si fica para depois | o script mostra a segurança caindo com uma potência hostil |
| O mapa mostra as potências e a opinião de cada uma | conferido na tela |

**Fica de fora:** comércio e acordos (vêm com o mercado), potência que muda
de posição sozinha. As potências não fazem muita coisa (sanção é o máximo,
e fica para depois). **Guerra ativa não existe no jogo** (talvez numa DLC).

### Passo 12 — Mercado ✅ (02/nov, sem a 5b)

Como no Victoria 3: um **mercado global** e o **mercado do país**. O do país
do jogador é completo; o dos outros países é simulado, mais simples.

| Começa com | Pronto quando |
|---|---|
| Os **produtos** são do mundo, agrupados em setores | o validador recusa produto sem setor |
| O país declara **o que produz** e o que não produz; **o que não produz, compra de quem produz**: o país depende das potências que fazem aquele produto | script: um produto que o país não faz aparece como dependência de quem o faz |
| Os pops têm **empregos** nos setores e recebem salário; o lucro vai para os donos | `npm run pops`: a renda de cada pop vem dos empregos |
| **Ciclos econômicos** do mundo mexem nos preços (alta e baixa) | script: o preço sobe e desce com o ciclo |
| O PIB é a soma do que o país produz; a base dos impostos sai da produção e dos pops, não de uma fatia fixa declarada pelo país | as contas fecham como hoje |

**Feito em 02/nov:** setores e produtos, cobertura do país, dois mercados
(preço do mundo com ciclo e choques), pops com setores e capital (empregos,
salário e lucro por setor) e janela Mercado. **Ficou de fora (5b):** o PIB e as
bases dos impostos saírem da produção e dos pops; entrou no pilar 1 do 12b.

A fatia 8 (ficha do setor) foi desfeita em 02/nov: era painel de gestão, não
jogo. Ficaram 8 leis na área Propriedade, ainda sem efeito.

### Passo 12b — Economia: construções, empresas, bolsa ⬅ próximo

Uma mecânica em três pilares, da base para o topo (GDD, seção 16).
Um pilar fecha jogável na tela antes do próximo abrir. Nada mais
abre até o 12b fechar.

| Pilar | Começa com | Pronto quando |
|---|---|---|
| 1 Construções | construções por setor (só cálculo) que produzem, empregam e dão lucro; fila de obras escondida; tempo e custo pela construção civil e pela corrupção | script: PIB e bases saem das construções e os países de teste dão o mesmo resultado; obra mais rápida com construção civil forte, mais lenta com corrupção alta |
| 2 Empresas e dono | empresa = conjunto de construções; dono Estado, privado, estrangeiro ou cooperativa; estatizar, criar estatal, virar cooperativa, vender empresa ou construção; as 8 leis de propriedade agem | script: cada ato muda o dono e o cofre; cada lei de propriedade muda algo visível; o privado abre empresa quando o lucro compensa. Na tela: os atos do jogador |
| 3 Bolsa | Pregão em blocos de 2% sobre as empresas; preço = lucro × múltiplo; caixa dos compradores; dividendos no cofre | script: vender derruba o preço dos outros blocos; contas fecham com dividendos. Na tela: comprar e vender no mesmo turno |

**Fica de fora:** oferta e procura completa, fome, cadeia de insumos, comércio
automático, dinheiro na tela (GDD, seções 10 e 16).

### Passo 13 — Leis em pacotes

Cada tema vira um pacote de leis pequenas, cada uma com reação num grupo
diferente. Um pacote por vez, na ordem do autor. A lista está na seção 7
do GDD (Leis): imposto de renda, armas, corrupção, direitos,
drogas, ensino e as leis de economia, estas desenhadas com o mercado.

## 4. Camadas

A dependência só desce:

```
tela/      React. Mostra e envia pedidos. Não calcula.
  ↓
partida/   Monta a partida (mundo + país), chama o motor, salva e carrega.
  ↓              ↘
motor/     Regras e cálculos.        conteudo/  JSON do mundo e dos países.
           TS puro, sem React/JSON.
```

| Camada | Pode importar | Não pode |
|---|---|---|
| `motor/` | só `motor/` | `conteudo/`, `partida/`, `tela/`, React |
| `conteudo/` | é dado | código de regra |
| `partida/` | `motor/`, `conteudo/` | `tela/` |
| `tela/` | `partida/`, tipos do `motor/` | `conteudo/` direto |

Cada módulo do motor é uma pasta com `index.ts` (o que expõe) e um `.md`
curto (o que faz, fonte do cálculo). O motor não conhece nomes de leis,
partidos ou países.

## 5. Ordem do turno

`avancarTurno(estado, pedidos, acaso) → novoEstado`, sem alterar o anterior.

1. Pedidos passam pelo Congresso (a partir do passo 8).
2. Leis novas geram efeitos na fila.
3. Efeitos que vencem são aplicados.
4. Economia real: emprego, PIB.
5. Preços e juros.
6. Contas.
7. Índices de jogabilidade.
8. Pops e grupos.
9. Política: desgaste; eleição no fim do mandato.
10. Invariantes; falhou, para com erro.

## 6. Dados

```
src/conteudo/
  mundo/indicadores/variaveis.json
  mundo/leis/<id>.json
  mundo/pops/, mundo/grupos/          (passo 7)
  paises/<id>/estado-inicial.json
  paises/<id>/leis-vigentes.json
  paises/<id>/rotulos.json            ("juros" → "Selic")
```

Todo JSON tem `"versao"`, tipo no motor e validador ao carregar. Unidades
explícitas: dinheiro na moeda do país, população em pessoas, alíquota como
fração (0,275; a tela mostra 27,5%).

## 7. Qualidade

**Invariantes, todo turno:** contabilidade fecha; nada negativo que não
possa ser; ocupados ≤ população; lei dentro da própria faixa ou opções.

| Teste | O quê | Desde |
|---|---|---|
| Unidade | cada cálculo do registro | passo 3 |
| Contrato | todo JSON passa no validador | passo 3 |
| Cenário | script com semente fixa confere a **direção**, não o número | passo 4 |
| Tela | conferência no navegador | passo 10 |

Mecânica instável não ganha teste de número.

## 8. Como cada passo anda

1. Proposta curta no chat; autor aprova.
2. Comportamento esperado escrito antes.
3. Implementa; `npx tsc -b` e testes do que mudou.
4. Confere o "pronto quando" por script ou na tela; mostra ao autor.
5. `npm run check`, commit com assunto, RETOMAR atualizado. Push só com a
   palavra do autor.

Ideia nova no meio do passo vai para a seção 18 (Perguntas em aberto) do GDD. Terceira
tentativa sem fechar: para e revê com o autor.

## 9. Versões

| Versão | Fecha com |
|---|---|
| 0.1 | 2b, 3, 4: um mandato jogado por script |
| 0.2 | 5, 6: contas e leis da V1 |
| 0.3 | 7, 8: grupos e Congresso |
| 0.4 | 9: vitória ou derrota |
| 1.0 | 10: partida inteira na tela |

Tag no git ao fechar cada versão.
