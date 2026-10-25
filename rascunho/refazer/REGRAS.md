# Refazer o mundo: regras (índices, grupos, leis)

> Escrito por Claude em 25/out/2026, 3h, a pedido do autor. O GPT segue isto à
> letra durante a noite. Tudo é escrito **só** em `rascunho/refazer/`. Nada em
> `src/` muda. O jogo atual continua funcionando; a troca é feita depois, com
> conferência.

## ⚠ Primeira tentativa descartada (25/out, 3h40)

A primeira rodada foi gerada por script: 427 efeitos com 10 frases repetidas,
todos com força `media`, a mesma fonte copiada em todas as leis, salário
mínimo com um efeito só. Foi para `_descartado-1/` e **não pode ser usada
nem como base**. Proibido:

- **gerar fichas com script, laço, molde ou preenchimento automático.** Cada
  índice, grupo e lei é pensado e escrito um a um. Script só para conferir;
- copiar a mesma frase, nota ou fonte de uma ficha para outra;
- marcar efeito, modelo ou confiança "para passar no verificador".

O padrão de qualidade está em **`EXEMPLOS.md`**: leia antes de começar e
escreva no mesmo nível.

## 0. O que é e o que NÃO é

- É o **desenho** do mundo do jogo: que índices existem, que grupos existem, que
  leis existem, o que cada uma faz e para que lado empurra cada coisa.
- **Não tem números do motor.** Nenhum coeficiente, nenhum valor de partida,
  nenhum número de país. A força de um efeito é uma palavra (`fraca`, `media`,
  `forte`). Os números saem depois, na conversão e na calibragem.
- **Não tem país.** Com estes arquivos tem que dar para montar o Brasil, a
  China, os EUA ou a União Europeia. O que é de um país (quem está no poder,
  quanto custa, quantas pessoas, nome local de uma lei) fica para depois, na
  pasta do país.
- **O catálogo não é o Brasil.** Uma lei existe no mundo por ser uma lei que
  algum país tem ou poderia ter, não porque o Brasil tem. Não escreva lei
  pensando "como é no Brasil", nem escolha opções, faixas ou a opção
  `referencia` pelo que o Brasil faz. Quais leis estão em vigor em cada país,
  e com que valor, é do pacote do país, feito depois.

## 1. Princípios (valem para todo texto e toda escolha)

1. **Mundo sem país.** Nenhum nome de país, programa, órgão, lei real, moeda,
   partido ou pessoa. Nada de "Brasil", "SUS", "Selic", "reais", "Bolsa
   Família", "IBGE", número de lei. Organismos internacionais podem, com o nome
   por extenso na primeira vez: "ONU (Organização das Nações Unidas)".
2. **Neutro.** Nada é bom ou ruim. Proibido julgar: "melhora", "piora",
   "bom", "ruim", "justo", "injusto", "moderniza", "atrasado", "excessivo",
   "abusivo", "acertado", "prejudica", "beneficia", "corrige", "avanço",
   "retrocesso". Descreva o que acontece: "a arrecadação sobe", "mais pessoas
   recebem", "as empresas pagam mais". Quem ganha e quem perde vai em
   `apoiam`/`rejeitam`, não em adjetivo.
3. **Nada aparece do nada.** Todo índice diz o que o move. Toda lei gasta,
   arrecada ou muda alguma coisa com causa clara.
4. **Sem sigla.** "Imposto sobre o consumo", não "IVA". PIB e TV podem.
5. **Bate o olho e entende.** Português simples, sem jargão jurídico ou de
   economista. Frases curtas. Sem travessão (—). Sem ponto e vírgula em
   rótulos.
6. **Todos os lados da bússola.** Bússola com dois eixos: `economia` (−2 Estado,
   +2 mercado) e `costumes` (−2 liberdade, +2 autoridade). Em cada área tem
   que existir opção ou lei para os quatro cantos (Estado+liberdade,
   Estado+autoridade, mercado+liberdade, mercado+autoridade).
7. **Proporcional, nunca absoluto.** Toda quantidade é relativa: % do PIB,
   % da população, % (alíquota), índice 0–100, taxa ao ano. Nunca dinheiro
   em valor absoluto, nunca "milhões de pessoas".
8. **Separar pelo que se sente.** Um assunto amplo vira várias leis, uma por
   alvo (imposto sobre consumo, sobre renda, sobre lucro… e não "Tributação").
9. **Escolha que o jogador vê acontecer.** Opção concreta, não abstrata. Não
   "privada · mista · estatal"; sim "quais setores o Estado controla".
10. **Nenhum tema é proibido.** O critério é jogabilidade.
11. **Um controle por lei.** Faixa **ou** opções, nunca os dois.

## 1.1 Correto por baixo, jogo por cima

O jogo tem que **fazer sentido**: ninguém que entende do assunto pode olhar uma
ligação e dizer "isso é falso". Mas o jogador nunca vê o estudo; ele vê o
efeito.

1. **A direção tem que estar certa.** Se o conhecimento disponível (economia,
   saúde pública, criminologia, educação, ciência política…) diz que X faz
   Y subir, o efeito é `sobe`. Nunca inventar direção. Exemplo do que é
   proibido: "imposto sobre propriedade deixa os pobres mais ricos".
2. **A força pode ser de jogo.** `fraca`, `media` e `forte` podem ser um pouco
   exageradas para o jogador sentir a escolha. A direção não.
3. **Cada efeito diz quão firme ele é**, no campo `confianca`:
   - `consenso`: quase todo especialista concorda (imposto sobre o consumo
     sobe preço; vacina reduz doença);
   - `debatido`: os estudos não têm certeza (salário mínimo e desemprego).
     O efeito entra assim mesmo, se fizer sentido, com a `forca` do tamanho
     da concordância: poucos estudos acham → `fraca`; boa parte acha →
     `media` (nunca `forte`). Escreva em `nota` o que os outros estudos
     dizem;
   - `jogo`: ligação simplificada para o jogo funcionar, que não contradiz o
     que se sabe (ex.: "programa de moradia" mexe em `padrao_de_vida`).
     No máximo 1 em cada 4 efeitos de um arquivo.
4. **Ponha todos os efeitos que fazem sentido.** Uma lei costuma causar
   várias coisas ao mesmo tempo, para lados diferentes. Exemplo: subir o
   salário mínimo → `renda_familias` sobe (`media`, `consenso`) **e**
   `desemprego` sobe (`fraca`, `debatido`) **e** `informalidade` sobe
   (`fraca`, `debatido`). Cada um com a força que os estudos sustentam.
   Um mesmo índice só aparece uma vez por lei (ou por opção): se os estudos
   discordam sobre a direção, fique com a da maioria, `debatido`.
5. **Pesquise antes de escrever.** Para cada efeito, procure (busca na
   internet, se você tiver; se não tiver, o que você sabe de estudos e
   manuais) se a ligação existe e para que lado vai. Escreva a base em
   `evidencias/<area>.md` (seção 5.3). Se não achar base, não ponha o efeito.
6. **Nada de lei grátis.** Toda lei de faixa e toda opção que não é a
   referência tem **pelo menos um grupo em `rejeitam`** ou **pelo menos um
   efeito que algum grupo não quer** (um índice que está no `querem` de um
   grupo na direção contrária). É isso que faz a escolha ser difícil.
7. **Ligações diretas.** O efeito é o que a lei causa **diretamente**. O que
   vem depois (ex.: menos doença → mais gente trabalhando → PIB) já está em
   `movidoPor` dos índices. Não repita a cadeia dentro da lei.

## 1.2 Leis de qualquer país, em qualquer país

O jogador tem que poder pegar o que a China, a União Europeia, a antiga União
Soviética, os Estados Unidos ou qualquer outro país fez e aplicar no país
dele. Por isso:

1. **Cada lei tem `modelos`**: a lista dos modelos de país que ela (ou uma das
   opções dela) permite reproduzir. Valores possíveis:
   - `planificado`: economia planejada pelo Estado (antiga União Soviética,
     Cuba);
   - `capitalismo_de_estado`: mercado com Estado forte dirigindo empresas e
     crédito (China, Singapura);
   - `liberal`: mercado com pouco Estado (Estados Unidos, Hong Kong antigo);
   - `social_democrata`: mercado com Estado de bem-estar grande (países
     nórdicos, boa parte da União Europeia);
   - `conservador_autoritario`: Estado forte nos costumes e na ordem
     (regimes militares, monarquias do Golfo, governos nacionalistas).
   Os nomes de país acima são só para você entender; **nunca aparecem nas
   fichas**.
2. **Em cada área, os cinco modelos aparecem** em pelo menos uma lei. Quando
   faltar um, crie a lei ou a opção que permite reproduzi-lo (ex.: em
   Trabalho, "fazendas e fábricas coletivas" para `planificado`; em Saúde,
   "seguro de saúde privado obrigatório" para `liberal`).
3. A lei é escrita **de forma genérica**, como regra que qualquer país pode
   adotar. O país de onde veio a ideia vai só em `evidencias/<area>.md`,
   na linha `Inspirado em: …` da seção da lei.

## 2. Arquivos

```
rascunho/refazer/
  REGRAS.md            este arquivo (não editar)
  verificar.py         verificador (não editar)
  indices.json         etapa 1
  grupos.json          etapa 2
  segmentos.json       etapa 2b
  leis/<area>.json     etapa 3, um arquivo por área (11) e centro.json
  evidencias/<area>.md etapa 3, a base de cada efeito (não vai para o jogo)
  de-para.json         etapa 3, lei antiga → nova
  DECISOES.md          o GPT anota cada escolha que fez sozinho
  PROGRESSO.md         o GPT anota o que terminou
```

Áreas (ids, nesta ordem): `contas-publicas`, `economia-e-empresas`,
`trabalho`, `protecao-social`, `saude`, `educacao-e-cultura`,
`infraestrutura-e-energia`, `ambiente-e-campo`, `seguranca-e-defesa`,
`direitos-e-costumes`, `governo-e-instituicoes`.

ids: minúsculas, sem acento, palavras separadas por `_` (índices e grupos) ou
`-` (leis e opções). Únicos no arquivo todo.

## 3. Etapa 1: `indices.json`

Os índices são o que as leis movem e o que o jogador lê (em frases). Matéria-
prima: as variáveis de tipo `calculado`, `estoque`, `derivado` e `situacao` de
`src/conteudo/mundo/indicadores/variaveis.json` (só ler).

```json
{
  "indices": [
    {
      "id": "inflacao",
      "nome": "Inflação",
      "mede": "Quanto os preços sobem em um ano.",
      "unidade": "taxa_ano",
      "tipo": "calculado",
      "essencial": false,
      "movidoPor": [
        { "indice": "expectativas_inflacao", "direcao": "sobe", "porque": "Quem espera preço mais alto reajusta antes." },
        { "indice": "taxa_juros", "direcao": "desce", "porque": "Juro alto encarece o crédito e freia as compras." }
      ],
      "antigo": ["inflacao"]
    }
  ]
}
```

- `unidade`: uma de `percentual_pib`, `percentual_populacao`, `percentual`,
  `indice_0_100`, `taxa_ano`, `pessoas`, `dinheiro`. `pessoas` e `dinheiro`
  só para os poucos estoques que contam o país inteiro (população, PIB,
  patrimônios, salário médio, dívida, caixa); o resto é relativo.
- `tipo`: `estoque` (acumula de um turno para outro: dívida, escolaridade,
  infraestrutura, população), `calculado` (sai de outros a cada turno) ou
  `situacao` (crise que liga e desliga: greve geral, apagão, epidemia).
- `essencial: true` só para os 8 do escopo: `pib`, `industrializacao`,
  `instrucao`, `padrao_de_vida`, `populacao`, `radicais`, `lealistas`,
  `dinheiro_do_governo`. Esses 8 têm que existir.
- `movidoPor`: os índices que movem este, cada um com `direcao` (quando o
  outro sobe, este `sobe` ou `desce`) e `porque` (uma frase, o mecanismo,
  única no arquivo). Só ligações diretas e com base (seção 1.1). De 1 a 6
  itens; vazio só em estoque movido apenas por leis.
- `antigo`: ids antigos que viram este (pode ser `[]` para índice novo).
  Cada variável antiga dos quatro tipos aparece em exatamente um `antigo`,
  **ou** em `"descartados"` (lista no fim do arquivo, com `{ "id", "motivo" }`).
- Reaproveite o id antigo quando o sentido for o mesmo. Troque quando o id
  citar país, programa ou nome confuso.
- Meta: entre 80 e 140 índices. Junte os que medem a mesma coisa.

## 4. Etapa 2: `grupos.json`

Grupos de interesse: quem a lei agrada ou irrita. O tamanho de cada grupo é do
país (não entra aqui). Matéria-prima: as 20 variáveis `grupo_*` (só ler,
para ideias). Os grupos são de qualquer país, não do Brasil.

```json
{
  "grupos": [
    {
      "id": "aposentados",
      "nome": "Aposentados",
      "quem": "Pessoas que já pararam de trabalhar e vivem de aposentadoria ou pensão.",
      "querem": [
        { "indice": "inflacao", "direcao": "desce", "porque": "A aposentadoria perde valor quando os preços sobem." },
        { "indice": "saude_populacao", "direcao": "sobe", "porque": "Usam mais o sistema de saúde que os mais jovens." }
      ],
      "bussola": { "economia": -1, "costumes": 1 },
      "antigo": ["grupo_aposentados"]
    }
  ]
}
```

- Entre 18 e 30 grupos. Cada um com 2 a 6 `querem`, cada um com `porque`
  (frase única no arquivo). Só o que o grupo quer **de verdade** e que o
  separa dos outros (ambientalistas não "querem população subindo").
- Grupos genéricos de qualquer país. Religião pode entrar como grupo genérico
  ("religiosos tradicionais", "sem religião"), nunca uma igreja ou religião
  de um país só.
- `bussola`: onde o grupo costuma ficar (inteiros de −2 a 2).
- Os 20 grupos antigos aparecem em `antigo` de algum grupo ou em
  `"descartados"`.

## 4.1 Etapa 2b: `segmentos.json`

Segmentos são **quem as pessoas são**, em qualquer país: pobres, ricos,
empresários, trabalhadores… Grupos de interesse (seção 4) são **o que elas
defendem**. Uma pessoa está em **um** segmento de renda e **um** de ocupação;
pode estar em vários grupos de interesse. O tamanho de cada segmento é do
país (não entra aqui).

```json
{
  "dimensoes": [
    { "id": "renda", "nome": "Renda", "segmentos": [
      { "id": "pobres", "nome": "Pobres", "quem": "Famílias que não cobrem o básico só com a própria renda.", "gruposProximos": ["…"] }
    ] },
    { "id": "ocupacao", "nome": "Ocupação", "segmentos": [
      { "id": "empresarios", "nome": "Empresários", "quem": "Donos de empresas que empregam outras pessoas.", "gruposProximos": ["…"] }
    ] }
  ]
}
```

- Duas dimensões, exatamente: `renda` (4 a 6 segmentos, do mais pobre ao
  mais rico, sem sobrar ninguém) e `ocupacao` (6 a 12: com contrato, sem
  contrato, por conta própria, empresários, servidores, aposentados,
  desempregados, estudantes, trabalhadores do campo…).
- Os segmentos de uma dimensão não se sobrepõem e somados cobrem a
  população inteira.
- `quem`: definição que vale em qualquer país, sem valor em dinheiro.
- `gruposProximos`: ids de `grupos.json` onde gente desse segmento costuma
  estar (0 a 4).
- Os ids de segmento não repetem ids de grupo.

## 5. Etapa 3: `leis/<area>.json`

Matéria-prima: as leis de `src/conteudo/mundo/leis/*.json` daquela área
(campo `area`) e os desenhos em `docs/jogo/leis/*.md` (só ler). As antigas
foram feitas olhando o Brasil: aproveite só a ideia, reescreva tudo nas regras
daqui, e acrescente as leis de outros países e modelos que faltarem.

```json
{
  "area": "saude",
  "leis": [
    {
      "id": "remedios-de-graca",
      "nome": "Remédios de graça na farmácia",
      "decide": "Define quanto do PIB o governo gasta para dar remédios de uso contínuo nas farmácias.",
      "familia": "programa",
      "nivel": "decreto",
      "controle": {
        "tipo": "faixa",
        "unidade": "percentual_pib",
        "minimo": 0,
        "maximo": 1.5,
        "bussolaNoMinimo": { "economia": 1, "costumes": 0 },
        "bussolaNoMaximo": { "economia": -1, "costumes": 0 }
      },
      "quemRecebe": "pessoas com doenças crônicas",
      "efeitos": [
        { "alvo": "gasto_bolso_saude", "direcao": "desce", "forca": "media", "atraso": "imediato", "porque": "Quem toma remédio todo mês deixa de pagar por ele." }
      ],
      "modelos": ["social_democrata"],
      "apoiam": ["aposentados", "pobres"],
      "rejeitam": ["contribuintes_de_alta_renda"],
      "requer": [],
      "exclui": [],
      "trava": []
    }
  ]
}
```

### 5.1 Campos

- `familia`: `imposto`, `verba`, `programa`, `regra`, `constitucional`,
  `petrea`.
  - imposto: tira dinheiro de alguém; controle `faixa` em `percentual`
    (alíquota). Tem `cobraSobre`: uma frase ("o lucro das empresas").
  - verba: o governo gasta com uma coisa; `faixa` em `percentual_pib`.
  - programa: o governo paga direto às pessoas; `faixa` em
    `percentual_pib`; tem `quemRecebe`.
  - regra: muda como as coisas funcionam; `opcoes` (2 a 5) ou `faixa`.
  - constitucional: decide o que outras leis podem; `opcoes` (2 a 5).
  - petrea: princípio que não muda por votação comum; **sem controle**
    (`"controle": null`); tem `principio` (uma frase). As pétreas ficam
    só no arquivo `leis/centro.json` (`"area": "centro"`), de 4 a 10 leis.
- `nivel`: `petrea`, `constituicao`, `lei`, `decreto`. Constitucional usa
  `constituicao`; pétrea usa `petrea`.
- `decide`: frase afirmativa começando com "Define". Nunca pergunta.
- `controle` com opções:
  ```json
  "controle": {
    "tipo": "opcoes",
    "opcoes": [
      { "id": "so-publico", "rotulo": "Só o sistema público", "propoe": "Todo atendimento é feito pelo Estado.", "bussola": { "economia": -2, "costumes": 0 }, "referencia": false,
        "efeitos": [ … ], "apoiam": [ … ], "rejeitam": [ … ] },
      …
    ]
  }
  ```
  - Exatamente **uma** opção com `"referencia": true`: a do meio da
    bússola. Ela tem `"efeitos": []`. Os efeitos das outras dizem o que
    muda **comparado com a referência**.
  - Em leis de opções, `efeitos`, `apoiam` e `rejeitam` ficam **nas
    opções**; no nível da lei ficam `[]`.
- `controle` com faixa: os `efeitos` da lei dizem o que acontece indo do
  `minimo` ao `maximo`.
- `efeitos`: de 2 a 8 por lei (ou por opção não referência). Toda lei de
  verdade causa mais de uma coisa (seção 1.1, item 4).
  - `alvo`: id de `indices.json` (nunca de grupo; grupo vai em
    `apoiam`/`rejeitam`).
  - `direcao`: `sobe` ou `desce`. `forca`: `fraca`, `media`, `forte`.
  - `atraso`: `imediato` (até 3 meses), `meses` (3 a 12), `anos` (mais
    de 1 ano).
  - `porque`: uma frase neutra, o mecanismo.
  - `confianca`: `consenso`, `debatido` ou `jogo` (seção 1.1). Com
    `debatido`, `nota` é obrigatória (o outro lado, em uma frase) e
    `forca` não pode ser `forte`.
  - Todo imposto tem um efeito em `dinheiro_do_governo` subindo. Toda
    verba e programa tem um efeito em `dinheiro_do_governo` descendo.
- `modelos`: de 1 a 2. Marque só os modelos que a lei reproduz de fato.
- `apoiam` / `rejeitam`: ids de `grupos.json`, 0 a 5 cada, sem repetir o
  mesmo grupo nos dois.
- `requer`: `[{ "lei": "<id>", "opcoes": ["<id-opcao>"] }]`, a lei só existe
  com essa outra numa dessas opções.
- `exclui`: ids de leis que não podem estar em vigor junto.
- `trava` (só constitucional e pétrea): `[{ "opcao": "<id da opção desta
  lei ou null na pétrea>", "lei": "<id>", "proibe": true }]` ou
  `{ …, "minimo": n }` / `{ …, "maximo": n }` (na unidade da lei travada).
- Todo id citado em `requer`, `exclui`, `trava` existe em algum
  `leis/*.json`. Se a lei citada é de uma área que ainda não foi feita,
  escreva a lei citada **agora** no arquivo da área dela (crie o arquivo
  com `{"area": "...", "leis": [...]}`) e continue.

### 5.3 Evidências: `evidencias/<area>.md`

Um arquivo por área (e `centro.md`). Uma seção por lei, uma linha por efeito:

```
## remedios-de-graca
- gasto_bolso_saude desce (consenso): programas de remédio gratuito reduzem o
  gasto das famílias com remédios. Base: avaliações de programas de
  distribuição de remédios em vários países; OMS (Organização Mundial da
  Saúde), relatórios sobre acesso a medicamentos.
```

- Base pode ser: tipo de estudo, organismo internacional, manual da área,
  autor conhecido. Pode citar estudos de qualquer país (aqui é referência,
  não vai para o jogo).
- Toda lei do arquivo da área tem a sua seção `## <id>`, com uma linha
  `Inspirado em: <países ou épocas>` (pode ser "ideia geral, sem país").

### 5.2 Quantidade

- Total no fim: entre 240 e 260 leis (com as pétreas).
- Cada área: pelo menos 12 leis. Nenhuma área com mais de 35.
- `seguranca-e-defesa` hoje tem 45 antigas: junte e corte até caber.
  `ambiente-e-campo` tem 7: crie leis novas até 12 ou mais.
- Toda lei antiga aparece em `de-para.json`:
  `{ "<id-antigo>": "<id-novo>" }` ou `{ "<id-antigo>": null }` (saiu; a
  razão vai em `DECISOES.md`). Várias antigas podem apontar para a mesma nova.

## 6. Como trabalhar (o GPT)

1. Leia este arquivo e `EXEMPLOS.md` inteiros antes de começar.
2. **Faça todas as etapas em sequência, sem parar** (decisão do autor,
   25/out, 4h): etapa 1 `indices.json`; etapa 2 `grupos.json` e
   `segmentos.json`; etapa 3 as 11 áreas na ordem da seção 2 (lei +
   evidências), `centro.json` por último, e `de-para.json`. O Claude
   confere tudo de manhã. Qualidade igual do começo ao fim: a última área
   no mesmo nível da primeira e de `EXEMPLOS.md`.
3. Escreva cada ficha **à mão**, uma a uma, pesquisando o assunto dela. Nada
   de script que gera ficha.
4. Depois de cada arquivo, rode `python3 rascunho/refazer/verificar.py` e
   conserte até não ter erro do arquivo que você fez.
5. Quando algo não estiver claro, escolha o que for mais simples e respeite a
   seção 1, anote em `DECISOES.md` (`- <arquivo>/<id>: escolhi X porque Y`)
   e siga dentro da etapa.
6. Se precisar de um índice que não existe, acrescente em `indices.json`
   (com `antigo: []`) e anote em `DECISOES.md`.
7. Não edite `REGRAS.md`, `EXEMPLOS.md`, `verificar.py`, nada em `src/`,
   `docs/`, `scripts/`, `_descartado-1/`. Não faça commit.
8. No fim de cada arquivo, uma linha em `PROGRESSO.md`
   (`- <hora> · <arquivo> · <n> itens · verificador ok`). No fim de tudo,
   `## FIM` em `PROGRESSO.md` e a resposta no canal.
9. Só pare se o disco der erro ou o próprio `verificar.py` quebrar (erro do
   script). Anote em `PROGRESSO.md`.
