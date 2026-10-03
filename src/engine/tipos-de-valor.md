# Tipos de valor do motor

**Chamado:** SG010

**Data:** 1 de outubro de 2026

**Estado:** decisão definida

## Separação entre decisão e consequência

O jogador não altera diretamente indicadores do país. Ele decide sobre políticas, programas, impostos, verbas e outros controles disponíveis na camada de jogo. Autorização e implantação transformam essas decisões em valores efetivamente aplicados, que entram no motor para produzir consequências.

Por exemplo, o jogador não aumenta diretamente o nível da educação pública. Ele pode aumentar a verba de uma política educacional ou implantar um programa de distribuição de materiais. A verba implantada e a cobertura do programa alimentam consequências próprias, que contribuem para o indicador de educação.

```text
decisão do jogador
        ↓
autorização e implantação na camada de jogo
        ↓
verba implantada ou cobertura do programa
        ↓
consequências declaradas no conteúdo
        ↓
indicador de educação
```

Assim, uma entrada controlável é uma fronteira técnica pela qual a camada de jogo comanda o motor. Ela não é um indicador que o jogador possa editar diretamente. Os comandos enviados ao motor representam o estado implantado das políticas e de outros controles, não a vontade do jogador antes de autorização e implantação.

Políticas diferentes podem contribuir para o mesmo indicador sem modificar umas às outras. Cada contribuição mantém sua origem, e o indicador resulta da combinação das contribuições conforme os mecanismos definidos no conteúdo.

## Valores calculados e saldos acumuláveis

Todo valor representa a situação atual do passo. A diferença entre um valor calculado e um saldo acumulável está na regra usada para produzir o próximo estado.

- Um valor calculado é produzido novamente a cada passo pelas causas ativas. Ele não soma automaticamente seu resultado anterior ao próximo.
- Um saldo acumulável, chamado tecnicamente de estoque, parte do saldo anterior e recebe entradas e saídas. Na ausência de movimento, conserva o saldo.

Por exemplo, o déficit é um resultado do período, enquanto a dívida é um saldo acumulável. Um déficit de 10 aplicado sobre uma dívida de 100 produz dívida de 110. Se o déficit seguinte for zero e não houver outro movimento, a dívida continua em 110.

Um valor calculado ainda pode mudar gradualmente ou continuar sob influência depois que uma política for encerrada. Nesse caso, a memória pertence às instâncias das consequências, conforme seus mecanismos de duração e dissipação. Isso não faz o indicador somar automaticamente seu próprio valor anterior como faria um saldo acumulável.

## Unidade domínio e estado inicial

Cada valor declara sua própria unidade, seu domínio e seu estado inicial. Não existe uma escala universal para o cenário. Um índice pode usar o intervalo de 0 a 100, uma cobertura pode ser percentual, uma dívida pode usar unidade monetária sem máximo predeterminado e um saldo fiscal pode admitir valores negativos e positivos.

Espera-se que uma parte importante do jogo use valores monetários, pois políticas, implantação e consequências têm custos e efeitos econômicos. Isso não transforma decisões, estados políticos e indicadores sociais em dinheiro. Unidades monetárias também precisam distinguir saldos de valores por período quando essa diferença afetar o cálculo. O catálogo mínimo e as combinações permitidas de unidades serão detalhados no SG012.

O domínio declara os valores válidos, mas o comportamento diante de um resultado fora do domínio será definido no SG013. O motor não deve presumir que todo valor está limitado entre 0 e 100.

## Decisões fora do grafo numérico

Decisões, opções e estados de políticas pertencem à camada de jogo e ao catálogo de conteúdo. Aprovação, rejeição, implantação e vigência não são convertidas em índices numéricos artificiais.

Uma decisão pode conter valores, como escolher uma verba monetária ou um nível desejado. Depois de aplicar autorização e implantação, a camada de jogo envia ao motor somente os controles numéricos necessários. Custos, cobertura, intensidade e outras grandezas produzem consequências no grafo; textos, requisitos e a identidade da escolha permanecem no catálogo e no estado da partida.

## Estado inicial fornecido pelo cenário

O cenário fornece o retrato completo usado antes do primeiro passo. O motor não tenta deduzir a situação atual a partir das políticas vigentes, reconstruir a história do país nem procurar um equilíbrio inicial.

O retrato inclui os valores atuais dos indicadores, os saldos acumulados e os controles já implantados. O estado da partida acrescenta políticas herdadas, finanças, implantação em andamento e memórias de efeitos anteriores que ainda influenciem o futuro. Fatores históricos podem justificar os valores iniciais no conteúdo; somente os que continuarem produzindo efeitos precisam ter estado executável.

Essa separação evita reaplicar custos únicos ou consequências já ocorridas antes do início da partida.

## País e contexto político

O conteúdo inicial não fica limitado ao Brasil. O motor deve funcionar para qualquer país que possa ser representado pelo modelo institucional inicialmente suportado, sem conter nomes de países, partidos ou leis em suas regras numéricas.

O cenário pode informar partidos atuais, partidos históricos e outros fatos políticos do país. A composição atual, o partido do jogador, o governo em exercício e os estados que afetem a partida pertencem ao estado inicial executável. Partidos e fatos históricos que servem apenas para contexto permanecem no catálogo de conteúdo; os que ainda produzirem efeitos também declaram o estado necessário para continuar atuando.

O primeiro recorte pode usar regras compatíveis com o modelo brasileiro definido para o jogo. Outros sistemas democráticos, como o dos Estados Unidos, podem exigir novos mecanismos de autorização, representação e eleição. Esses mecanismos serão adicionados e validados posteriormente, sem introduzir condições pelo nome do país no núcleo.

## Tipos mínimos

O contrato usa três tipos mínimos:

- `controle`: valor aplicado pela camada de jogo ao motor, como verba efetivamente implantada; não recebe contribuições numéricas do grafo;
- `calculado`: valor produzido novamente a cada passo pelas contribuições ativas;
- `estoque`: saldo que parte do valor anterior e recebe entradas e saídas.

Os nomes apresentados ao leitor podem ser controle aplicado, valor calculado e saldo acumulável. Os identificadores técnicos acima permitem exemplos curtos e inequívocos.

## Exemplos JSON

Os exemplos são artificiais e antecipam somente os campos necessários ao SG010. O formato completo do pacote será definido no SG015.

Exemplo válido de controle aplicado:

```json
{
  "id": "verba_educacao_implantada",
  "tipo": "controle",
  "unidade": "moeda_por_passo",
  "dominio": { "minimo": 0 },
  "valorInicial": 20
}
```

Exemplo válido de valor calculado:

```json
{
  "id": "educacao",
  "tipo": "calculado",
  "unidade": "indice_0_100",
  "dominio": { "minimo": 0, "maximo": 100 },
  "valorInicial": 42
}
```

Exemplo válido de saldo acumulável:

```json
{
  "id": "divida_publica",
  "tipo": "estoque",
  "unidade": "moeda",
  "dominio": { "minimo": 0 },
  "valorInicial": 100
}
```

Exemplos inválidos:

- um valor inicial de 120 para um índice cujo máximo declarado é 100;
- um estoque sem valor inicial, pois o primeiro passo não teria saldo anterior;
- uma consequência numérica cujo alvo seja um `controle`, pois somente a camada de jogo comanda esse tipo;
- um tipo diferente de `controle`, `calculado` ou `estoque` enquanto o contrato não oferecer outro tipo.

## Resultado da revisão

O jogador altera políticas, verbas, programas e outros controles da camada de jogo, mas não edita diretamente os indicadores do país. O cenário fornece o estado inicial completo. Cada valor declara tipo, unidade, domínio e valor inicial; decisões não numéricas permanecem fora do grafo. Valores calculados representam as causas ativas, enquanto estoques preservam automaticamente o saldo anterior.
