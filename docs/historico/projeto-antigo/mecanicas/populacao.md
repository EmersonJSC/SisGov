# População

> **Status: PROPOSTA (29/out/2026).** Aguardando aprovação do autor.
> Item 3 do [PLANO](../../../PLANO.md), camadas A (feita) e B (esta).

## 1. O que é

O país é gente com nome, bolso e ocupação — e a lei do jogador mexe em gente
específica, não num número médio.

## 2. Regras

### 2.1 Os 2.090 perfis já são a população

O eleitorado do Brasil está em `paises/brasil/perfis.json`: 2.090 combinações
de oito atributos (renda, ocupação, idade, filhos, religião, valores,
ambientalista, território), cada uma com o seu peso no eleitorado, geradas de
dado do IBGE. Os 19 grupos da tela são uma **projeção** desses perfis, pelos
eixos de `mundo/populacao.json`.

Isso já é mais fino que o Democracy 4, que tem ~20 grupos chapados. O que
falta não é separar mais gente: é essa gente fazer alguma coisa.

### 2.2 Três camadas, nesta ordem

|                         | O que entrega                                | Estado             |
| ----------------------- | -------------------------------------------- | ------------------ |
| **A. Censo**            | a tela mostra o país repartido               | **feita** (29/out) |
| **B. Bolso e ocupação** | cada perfil com renda, imposto e benefício   | esta proposta      |
| **C. Movimento**        | o perfil muda de faixa por causa da condição | depois             |

A ordem não é gosto. A C é o que passa do Democracy 4 — lá a lei mexe na
filiação do grupo direto, aqui a lei mexe na condição material e a condição
empurra a pessoa — e é também a que produz país absurdo nas primeiras
tentativas. Ela chega com o censo pronto para flagrar o absurdo.

### 2.3 O agregado manda, o perfil divide

**Decidido pelo autor (29/out).** A economia continua calculando o bolo como
hoje; os perfis repartem.

```
massa salarial  = ocupados × salário médio        (motor, como hoje)
lucros          = PIB − massa salarial − imposto sobre consumo
consumo         = propensão × (massa salarial + parte dos lucros)
```

A alternativa — o perfil manda e o PIB é a soma dele — é o Victoria 3 inteiro
e joga fora a calibragem do item 1 do PLANO. Fica para depois, e fica barata
**se** o perfil guardar de onde vem o dinheiro dele: são os dois lados da
mesma conta, e virar o sentido é trocar quem calcula, não refazer o que
existe.

### 2.4 Os setores econômicos vêm depois; a ocupação segura o lugar

**Os setores vão existir** (decidido pelo autor, 29/out) — indústria,
serviços, agro. Hoje eles só aparecem como nome dentro de ocorrências de
lobby: não há emprego por setor nem produção por setor. Criá-los agora seria
mecânica nova no meio desta, então a camada B não os inventa; ela é escrita
para recebê-los.

A **ocupação** do perfil já diz de onde vem o dinheiro: carteira, informal,
servidor, empresário, pequeno-empreendedor, agro-patronal, agricultura
familiar, aposentado, fora da força de trabalho. É nela que a lei bate hoje —
o reajuste de servidor, a reforma da previdência, o salário mínimo.

**O que isso exige da camada B**, para o setor não custar uma reescrita:

> O bolso do perfil guarda **de onde vem o dinheiro**, como uma fonte com
> nome — não um número solto. Hoje a fonte é a ocupação; amanhã é o par
> ocupação + setor. Quem lê o bolso pergunta pela fonte, nunca pela ocupação
> direto.

Com isso, o setor entra como mais um atributo do perfil e mais uma dimensão
da tabela de 2.5, sem mexer em quem já lê o bolso. É a mesma economia de
esforço do 2.3: a estrutura aguenta a virada, só muda quem preenche.

### 2.5 A renda sai de uma tabela de ocupação × renda

**Decidido pelo autor (29/out).** O conteúdo do país traz um multiplicador por
combinação: servidor de classe média ganha tanto do salário médio, informal
pobre ganha tanto. A massa salarial do motor é repartida nessas proporções, e
os multiplicadores são normalizados para que a soma feche exatamente a massa
salarial — nenhum dinheiro nasce nem some na repartição.

Vai errar na primeira calibragem, e é para errar: o número aparece no censo e
se conserta vendo. A tabela é conteúdo, não código.

Quem não trabalha não entra na massa salarial: aposentado recebe pela
previdência, quem está fora recebe benefício ou nada.

### 2.6 O bolso tem três partes

| Parte     | De onde vem                                                         |
| --------- | ------------------------------------------------------------------- |
| **Ganha** | massa salarial repartida (2.5), aposentadoria, benefício            |
| **Paga**  | imposto sobre consumo, imposto de renda, contribuição sobre salário |
| **Sobra** | o que resta, que é o número que o jogador entende                   |

A sobra é o que a lei mexe, e é o que a tela mostra.

### 2.7 Por ora o bolso só aparece; não muda a satisfação

**Decidido pelo autor (29/out).** A satisfação continua vindo do `gosta`/
`odeia` que já existe. O bolso entra na tela e no boletim da lei, não na
conta da satisfação.

Razão: ligar o bolso na satisfação mexe no que já está calibrado, e o primeiro
resultado de uma ligação assim é um país que se revolta por centavos. Com o
bolso visível primeiro, os números absurdos aparecem antes de estragarem o
jogo. A ligação é o passo seguinte, e tem desenho próprio.

### 2.8 A tela responde "quem pagou a conta"

O censo ganha, por faixa, quanto se ganha, quanto se paga e quanto sobra. E a
lei, ao ser aberta, diz em quem ela bate:

> A reforma tira R$ 71 por mês dos informais pobres — 12% do eleitorado.

Sem tendência enquanto os perfis forem fixos (camada C): "subiu desde o turno
passado" só pode aparecer quando alguém puder mudar de faixa.

## 3. Entradas e saídas

**Lê:** `massa_salarial`, `lucros`, `consumo_familias`, `ocupados`,
`salario_medio` e as arrecadações, todos do motor; os perfis e os eixos do
conteúdo.

**Entrega:** o bolso de cada perfil na visão, para o censo e para o boletim
da lei. Não entrega nada para a rede de consequências — é leitura (2.7).

## 4. No código

| O que                | Onde                                                      |
| -------------------- | --------------------------------------------------------- |
| Censo (camada A)     | `src/app/partida/censo.ts`, `src/ui/mapa/Censo.tsx`       |
| Treemap do censo     | `src/ui/mapa/treemap.ts`                                  |
| Perfis crus          | `content.manifest.congresso` (atributos, valores, perfis) |
| Rótulos das faixas   | `src/conteudo/mundo/populacao.json`                       |
| Agregados a repartir | `src/conteudo/mundo/indicadores/variaveis.json`           |

Os perfis moram no manifesto do congresso porque foi ele quem precisou deles
primeiro (eleger as bancadas). A camada B é o segundo dono; com o terceiro,
vale promovê-los a um manifesto próprio.

## 5. Em aberto

- **Quando os setores entrarem** (2.4): de onde sai a produção de cada setor,
  como o perfil é alocado a um, e se o setor vira bolha no mapa. É mecânica
  própria, com desenho próprio — aqui só fica a porta aberta.
- A tabela de multiplicadores (2.5) precisa de fonte. A PNAD tem rendimento
  por posição na ocupação; cruzar com faixa de renda é aproximação.
- Onde o bolso aparece no boletim da lei: antes ou depois das setas.
- A cor das fichas do censo se repete entre atributos (azul é classe média e
  também católicos). Sugerida uma cor por ficha em tons; sem decisão.
