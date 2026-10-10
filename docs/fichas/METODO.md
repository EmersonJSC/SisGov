# Método das fichas de lei

Este é o conjunto de regras que qualquer IA (ou pessoa) segue para criar
leis do SisGov. A ideia é que a **estrutura lembre por você**: cada ficha
responde sempre às mesmas perguntas, e todo nome novo que aparece numa
resposta vira uma ficha aberta.

O SisGov é um **jogo**. A lei não é um verbete jurídico: é uma carta que o
jogador vai querer jogar, com um dilema claro, opções que dão vontade de
testar e consequências que contam uma história.

---

## 1. Princípios (não negociáveis)

1. **Leis do mundo, não de um país.** A ficha descreve a lei universal. O
   Brasil (ou EUA, Dinamarca…) só escolhe uma opção ou um nível.
2. **Consequências universais e determinísticas.** A mesma opção causa o
   mesmo efeito em qualquer país; o que muda é o estado do país.
3. **Tudo é bolha.** Nada de número escondido. Se algo pesa, é uma bolha.
4. **Não existe lei de sim ou não.** Regulatória: mínimo 3 opções.
   Institucional: mínimo 2 (preferir 3+). Orçamentária e tributária: faixa
   de valor.
5. **Sem ideologia certa.** Toda opção tem quem ganha e quem perde. Nenhuma
   opção é estritamente melhor que outra.
6. **Explicável.** Todo efeito tem um "porque" de uma linha que o jogador
   entenderia.
7. **Sem números finais.** Força em palavras (fraca, média, forte) e atraso
   em palavras (imediato, meses, anos). O balanceamento vem depois.
8. **Use o catálogo.** Bolhas e grupos usam os ids de `catalogo.json`. Bolha
   nova só se nenhuma servir, e vai em `novas_bolhas`.

---

## 2. As perguntas da ficha de lei

| #   | Pergunta                                                           | Campo                           |
| --- | ------------------------------------------------------------------ | ------------------------------- |
| 1   | O que ela decide, em uma frase?                                    | `descricao`                     |
| 2   | Qual é o dilema do jogador?                                        | `dilema`                        |
| 3   | De que grupo ela é?                                                | `grupo`                         |
| 4   | Que opções (ou faixa) ela tem, em que eixo, e onde está cada país? | `eixo`, `opcoes` ou `faixa`     |
| 5   | Quanto custa ou arrecada?                                          | `custo`                         |
| 6   | O que ela faz subir e cair, com que força e em quanto tempo?       | `efeitos`                       |
| 7   | Quem ganha e quem perde?                                           | `grupos`                        |
| 8   | O que a deixa mais ou menos eficaz?                                | `eficacia`                      |
| 9   | Ela depende de outra lei, ou de uma opção dela?                    | `mae`                           |
| 10  | Que leis só existem (ou só fazem sentido) por causa dela?          | `filhas`                        |
| 11  | Onde isso foi visto no mundo?                                      | `exemplos` nas opções, `fontes` |

---

## 3. Formato (JSON)

```json
{
  "id": "salario-minimo",
  "nome": "Salário mínimo",
  "area": "Trabalho e emprego",
  "ministerio": "Ministério do Trabalho",
  "grupo": "regulatoria",
  "descricao": "Define o piso que qualquer empregador deve pagar.",
  "dilema": "Mais renda no bolso de quem ganha menos, ou mais vagas para quem não tem nenhuma?",
  "eixo": "do mais livre ao mais alto",
  "opcoes": [
    {
      "id": "sem-piso",
      "rotulo": "Sem salário mínimo",
      "manchete": "Fim do piso: empresas comemoram, centrais sindicais vão às ruas",
      "exemplos": ["Singapura (sem piso geral)"]
    },
    {
      "id": "piso-baixo",
      "rotulo": "Piso baixo",
      "manchete": "...",
      "exemplos": ["EUA (federal)"]
    },
    {
      "id": "piso-moderado",
      "rotulo": "Piso moderado",
      "manchete": "...",
      "exemplos": ["Brasil", "Reino Unido"]
    },
    {
      "id": "piso-alto",
      "rotulo": "Piso alto",
      "manchete": "...",
      "exemplos": ["Austrália"]
    }
  ],
  "faixa": null,
  "brasil": "piso-moderado",
  "custo": {
    "tipo": "neutro",
    "tamanho": "baixo",
    "porque": "Não sai do orçamento; pesa sobre os empregadores."
  },
  "efeitos": [
    {
      "alvo": "renda_familias",
      "sinal": "+",
      "forca": "media",
      "atraso": "imediato",
      "porque": "Quem ganha o piso passa a ganhar mais."
    },
    {
      "alvo": "custo_trabalhista",
      "sinal": "+",
      "forca": "media",
      "atraso": "imediato",
      "porque": "Contratar fica mais caro."
    },
    {
      "alvo": "informalidade",
      "sinal": "+",
      "forca": "fraca",
      "atraso": "meses",
      "condicao": "a partir de piso-alto",
      "porque": "Parte das vagas vai para a informalidade."
    }
  ],
  "grupos": {
    "ganham": ["grupo_trabalhadores_formais", "grupo_sindicatos"],
    "perdem": ["grupo_pequenos_negocios", "grupo_empresarios"]
  },
  "eficacia": {
    "aumenta": ["capacidade_estatal"],
    "reduz": ["informalidade"],
    "porque": "Piso só vale onde há fiscalização e emprego formal."
  },
  "mae": {
    "lei": "legislacao-trabalhista",
    "opcoes": ["minima", "clt", "protetiva"]
  },
  "filhas": ["politica-valorizacao-salario-minimo"],
  "fontes": [
    { "titulo": "ILO – Minimum wage policy guide", "url": "https://..." }
  ]
}
```

### Regras de cada campo

- `id`: kebab-case, sem acento, sem nome de país.
- `grupo`: `orcamentaria` | `regulatoria` | `tributaria` | `institucional`.
- `eixo`: o que significa ir da primeira à última opção (ou do mínimo ao
  máximo da faixa). Os `efeitos` descrevem o que acontece **ao avançar no
  eixo**. Se um efeito só vale em parte do eixo, use `condicao`.
- `opcoes` (regulatória e institucional): ordenadas no eixo; cada uma com
  `id`, `rotulo`, `manchete` (a notícia que sai no jogo quando ela é
  adotada; curta, com sabor de jornal) e `exemplos` (países reais que
  usam ou usaram).
- `faixa` (orçamentária e tributária): `{"unidade": "percentual_pib" |
"aliquota_percentual", "minimo", "maximo", "exemplos": [{"pais", "valor"}]}`.
  Nesse caso `opcoes` é `null` e `brasil` é um número.
- `brasil`: a opção ou o valor do Brasil hoje. Se o Brasil não tem a lei,
  use a opção "nenhuma" do eixo (toda lei deve ter uma opção ou valor que
  represente não ter a lei).
- `custo.tipo`: `gasto` | `arrecadacao` | `neutro`; `tamanho`: `baixo` |
  `medio` | `alto`.
- `efeitos[].alvo`: id de bolha (catálogo ou `novas_bolhas`). Não aponte
  efeitos para outras leis; lei influencia lei pela `eficacia` ou pelo
  apoio dos grupos.
- `efeitos[].sinal`: `+` (sobe) ou `-` (cai). `forca`: `fraca` | `media` |
  `forte`. `atraso`: `imediato` (até 3 meses) | `meses` | `anos`.
- Entre 3 e 8 efeitos por lei. Pelo menos um efeito tem de ser ruim para
  alguém (não existe lei grátis).
- `grupos`: só ids `grupo_*` do catálogo. Pelo menos 1 que ganha e 1 que perde.
- `mae`: `null` se a lei é raiz. Se depende só de uma parte das opções da
  mãe, liste essas opções.
- `filhas`: ids de leis (desta área ou de outra). Toda filha citada que
  ainda não tem ficha vira ficha aberta.
- `fontes`: 1 a 3 fontes reais e verificáveis (URL que você abriu). Nada de
  URL inventada.

---

## 4. Ficha de bolha nova

Quando nenhuma bolha do catálogo serve:

```json
{
  "id": "evasao_escolar",
  "nome": "Evasão escolar",
  "tipo": "indice",
  "unidade": "percentual_0_100",
  "avaliacao": "maior_pior",
  "porque": "Leis de educação e de trabalho infantil mexem nela."
}
```

`tipo`: `indice` | `bolha_lenta` | `situacao`. Situação precisa de
`surge_quando` (frase).

---

## 5. Checagem automática (o script recusa a ficha)

1. Campo faltando ou valor fora da lista permitida.
2. Regulatória com menos de 3 opções; institucional com menos de 2.
3. `brasil` não é uma das opções (ou fora da faixa).
4. Alvo de efeito ou grupo que não está no catálogo nem em `novas_bolhas`.
5. Lei repetida (mesmo id ou nome muito parecido).
6. Bolha nova que é sinônimo de bolha existente.
7. Contradição: duas leis com a mesma mãe e opções iguais dizendo o oposto
   sobre o mesmo alvo sem `condicao` que explique.
8. `mae` aponta para lei inexistente, ou para opção que a mãe não tem.
9. Lei sem nenhum efeito ruim, ou sem grupo que perde.

## 6. Revisão independente

Outra IA, que não viu o raciocínio de quem preencheu, recebe só a ficha e
julga cada efeito: **concorda**, **discorda** ou **dúvida**, com uma linha.
Só as discordâncias e dúvidas vão para o autor do jogo.

## 7. Freios

- Rodadas de tamanho fixo (por exemplo, 10 fichas por área).
- Lista de "fora do jogo": detalhe demais (lei municipal, norma técnica,
  regra de um único setor pequeno) não vira lei; vira, no máximo, opção de
  outra lei.
- Preferir **uma lei com boas opções** a várias leis de sim ou não.
