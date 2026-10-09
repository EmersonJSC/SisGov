# Catálogo de leis v2 — formato e organização

**Estado:** especificação aprovada em 9/out/2026 (decisões D-23 a D-29 do
[PLANO](../../PLANO.md)). Executada pelos chamados SG135–SG140.
Complementa o [contrato do motor e dos JSONs](contrato-motor-json.md).

## Regra central

**O JSON da lei diz o que a lei é e quais são seus limites. Não diz quanto.**
A quantidade (o nível) vem do país, quando a lei já está vigente no início, ou
do jogador, quando ele a implanta ou altera. O mesmo catálogo serve para
qualquer país.

Por isso, limites e custos em dinheiro escritos na lei são **relativos**
(% do PIB ou % do orçamento). Um país pode declarar limites próprios, mais
apertados, em valor absoluto.

**O gasto (ou a receita) de cada lei está sempre visível:** por ano e por mês,
na ficha da lei, no painel do turno e no diário.

## Os quatro grupos

| Grupo | O que é | O nível é | Gasto/receita |
|---|---|---|---|
| `orcamentaria` | Destina dinheiro a algo | valor fixo (R$/ano) **ou** % do orçamento | gasto = o próprio nível |
| `regulatoria` | Define uma regra | uma opção de uma lista (mínimo 3; não existe sim/não) | custo por opção (pode ser zero) |
| `tributaria` | Cobra um tributo | alíquota (%) dentro de limites | receita = alíquota × base do país |
| `institucional` | Muda regras do próprio Estado (eleições, processo legislativo, futuramente Constituição) | opção de mecanismo e parâmetros | normalmente nenhum |

### Campos comuns

```json
{
  "id": "atencao-basica",
  "tipo": "lei",
  "versaoEsquema": 2,
  "grupo": "orcamentaria",
  "nome": "Atenção básica",
  "descricao": "…",
  "area": "Saúde",
  "processoAutorizacao": "execucao-programa-autorizado",
  "respostaTemporal": { "implantacao": 0.3, "degradacao": 0.18 },
  "consequencias": ["…"],
  "requisitos": [],
  "exclusoes": []
}
```

### Orçamentária

```json
"orcamento": {
  "modo": "valor_fixo",
  "limites": { "minimoPercentualPib": 0, "maximoPercentualPib": 1 }
}
```

```json
"orcamento": {
  "modo": "percentual_orcamento",
  "base": "receita_total",
  "limites": { "minimo": 0, "maximo": 30 }
}
```

- `valor_fixo`: nível em moeda por ano. Gasto mensal = nível ÷ 12.
- `percentual_orcamento`: nível em %. Gasto mensal = nível × receita total do
  mês (hipótese de base; o piso real brasileiro usa receita corrente líquida).

### Regulatória

```json
"opcoes": [
  { "id": "nao-liberar", "rotulo": "Não liberar", "custoAnualPercentualPib": 0 },
  { "id": "cannabis-medicinal", "rotulo": "Só cannabis medicinal", "custoAnualPercentualPib": 0 },
  { "id": "cannabis-recreativa", "rotulo": "Cannabis recreativa", "custoAnualPercentualPib": 0 },
  { "id": "todas", "rotulo": "Todas", "custoAnualPercentualPib": 0 }
]
```

- Mínimo de **3 opções**, em ordem (da mais restritiva/menor para a maior).
- No grafo do motor, a opção vira um número (posição na lista); o motor
  continua sem conhecer nomes de leis.

### Tributária

```json
"tributo": {
  "base": "renda_tributavel",
  "limites": { "minimo": 0, "maximo": 40 }
}
```

- `base` aponta para uma variável do país. Receita mensal = alíquota × base ÷ 12.
- Elasticidade (base que encolhe com alíquota alta) fica para depois.

### Institucional

As leis eleitorais já existentes (`leisEleitorais` do catálogo) passam a ser
deste grupo, sem mudar o mecanismo. Processo legislativo e Constituição entram
aqui (M8).

## O que o país declara

```json
"economia": { "pibAnual": 12000, "unidadeMonetaria": "moeda_bilhoes_2024" },
"leisVigentes": [
  { "lei": "atencao-basica", "nivel": 35 },
  { "lei": "piso-saude", "nivel": 15 },
  { "lei": "drogas", "opcao": "cannabis-medicinal" },
  { "lei": "imposto-renda", "nivel": 10 }
],
"limitesProprios": [
  { "lei": "atencao-basica", "minimo": 20 }
],
"fiscal": {
  "…": "caixa, dívida, juros herdados, taxa da dívida nova",
  "agregados": {
    "receitas": [ { "id": "impostos-nao-modelados", "valorAnual": 950 } ],
    "despesas": [ { "id": "previdencia", "valorAnual": 950 } ]
  }
}
```

Agregados são o orçamento que **ainda não** é lei. Quando uma lei passa a
cobrir parte dele, o agregado diminui no mesmo valor: nada é contado duas vezes.

## Orçamento do Brasil na partida (hipótese)

R$ bilhões por ano, valores redondos que seguem as proporções aproximadas do
Brasil. Não são dados oficiais (reconciliação: backlog B-07).

| Item | Valor/ano | Proporção |
|---|---:|---|
| PIB | 12.000 | — |
| Dívida | 9.200 | ~77% do PIB |
| Caixa | 900 | — |
| Juros herdados | 900 | ~7,5% do PIB |
| **Receitas** | **2.200** | ~18% do PIB |
| · Imposto de renda (lei, 10% × base 6.000) | 600 | |
| · Imposto sobre consumo (lei, 6,5% × base 7.600) | ~500 | |
| · Impostos não modelados (agregado) | ~950 | |
| · Exportações e royalties (agregado) | 150 | |
| **Despesas primárias** | **~2.250** | ~19% do PIB |
| · Leis orçamentárias e custos regulatórios (tabela abaixo) | ~555 | |
| · Previdência (agregado) | 950 | |
| · Máquina pública: pessoal e burocracia (agregado) | 400 | |
| · Rede pública: custeio e outros (agregado) | ~345 | |

Resultado primário ≈ −50 (−0,4% do PIB); resultado nominal ≈ −950 (~8% do PIB).

## Leis iniciais

**Orçamentárias**

| Lei | Modo | Nível inicial | Gasto/ano |
|---|---|---:|---:|
| Piso da saúde (saúde geral, fora dos programas abaixo) | % do orçamento | 15% | ~330 |
| Bolsa Família | valor fixo | 170 | 170 |
| Atenção básica | valor fixo | 35 | 35 |
| Alimentação escolar | valor fixo | 5 | 5 |
| Construção de universidades | valor fixo | 2 | 2 |
| Creches públicas | valor fixo | 2 | 2 |
| Prevenção à violência | valor fixo | 1 | 1 |
| Fiscalização ambiental | valor fixo | 0,5 | 0,5 |
| Proteção às mulheres | valor fixo | 0,3 | 0,3 |
| Distribuição de preservativos | valor fixo | 0,1 | 0,1 |

**Regulatórias**

| Lei | Opções | Inicial | Gasto/ano |
|---|---|---|---:|
| Drogas | não liberar / só cannabis medicinal / cannabis recreativa / todas | só cannabis medicinal | 0 |
| Porte de armas | proibido / restrito a categorias / com requisitos / amplo | com requisitos | 0 |
| Salário mínimo | congelado / só inflação / inflação + PIB / ganho real fixo | inflação + PIB | indireto |
| Câmeras corporais | nenhuma / só forças especiais / parcial / total | parcial | 0,4 (até 0,6) |
| Escola em tempo integral | parcial / ampliada / integral | ampliada | 6 (até 10) |

**Tributárias**

| Lei | Base | Inicial | Receita/ano |
|---|---|---:|---:|
| Imposto de renda | renda tributável (6.000) | 10% | 600 |
| Imposto sobre consumo | consumo das famílias (7.600) | 6,5% | ~500 |

**Institucionais:** eleição presidencial por pluralidade nacional; eleição do
Senado por maiores quocientes (já existem).
