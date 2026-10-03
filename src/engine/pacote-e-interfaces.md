# Pacote e interfaces do cenário

**Chamado:** SG015

**Data:** 2 de outubro de 2026

**Estado:** decisão definida

## Cenário organizado como pacote

Cada cenário é uma pasta com um manifesto principal chamado `cenario.json`. O manifesto identifica o país, a versão e os arquivos que formam o cenário. Políticas, consequências, eventos, dilemas, situações, variáveis e estado inicial podem ficar em arquivos separados.

Exemplo conceitual:

```text
brasil/
  cenario.json
  estado-inicial.json
  variaveis.json
  politicas/
    investimento-educacao.json
    programa-materiais.json
  consequencias/
    melhoria-cobertura-escolar.json
    aumento-despesa.json
  eventos/
    crise-sanitaria.json
```

O manifesto funciona como índice do pacote:

```json
{
  "id": "brasil-2026",
  "nome": "Brasil",
  "versaoEsquema": 1,
  "estadoInicial": "estado-inicial.json",
  "variaveis": "variaveis.json",
  "politicas": [
    "politicas/investimento-educacao.json",
    "politicas/programa-materiais.json"
  ],
  "eventos": ["eventos/crise-sanitaria.json"]
}
```

O carregador começa pelo manifesto, lê todos os arquivos listados, valida o conjunto completo e somente então cria uma definição executável. Acrescentar conteúdo compatível exige criar o arquivo correspondente e registrá-lo no manifesto, sem editar regras do motor ou criar importações manuais no código.

O formato definitivo será detalhado depois das demais decisões do SG015. Os nomes acima fixam a organização, não todos os campos finais.

## Identidade e versões

Cada definição possui ID estável, tipo e versão de esquema. Referências internas usam IDs; caminhos servem apenas para o manifesto localizar arquivos e podem mudar sem alterar a identidade do conteúdo. IDs duplicados em um pacote são inválidos.

O manifesto declara versão do pacote e versão dos esquemas usados. Depois da validação, o carregador calcula uma identificação pelo conteúdo completo do pacote. Essa identificação permite detectar alterações mesmo quando alguém esquece de mudar a versão declarada.

Arquivos salvos registrarão a identificação exata do pacote e a versão do executor. O contrato completo de salvamento será fechado posteriormente, mas a identidade necessária já nasce no carregamento.

## Independência entre países

Cada país possui propriedades, estado inicial e conteúdo próprios. Um pacote não referencia políticas, consequências, variáveis ou arquivos pertencentes ao pacote de outro país. Alterar um cenário não modifica silenciosamente os demais.

O motor, os esquemas e o catálogo de mecanismos são compartilhados. Isso permite que países diferentes usem as mesmas capacidades técnicas sem compartilhar os mesmos valores ou definições de conteúdo.

Ferramentas de autoria podem ajudar o desenvolvedor a criar estruturas parecidas, mas o resultado distribuído para cada país continua independente e contém a versão exata de tudo que utiliza.

## Definição e estado da partida

Depois de carregado e validado, o pacote forma uma definição imutável. A partida mantém separadamente os valores atuais, turno, partido, governo, composição política, políticas propostas ou vigentes, implantação, finanças e ocorrências.

As decisões do jogador alteram o estado da partida, não os arquivos JSON nem a definição carregada. Começar outra partida usa novamente o estado inicial declarado pelo pacote. Alterar o conteúdo exige carregar uma nova definição e não muda uma execução já iniciada.

## Políticas tipadas

Política é o contrato comum para as decisões públicas do jogo. Toda política declara identidade, nome, descrição, requisitos, conflitos, autorização, implantação, custos, consequências, vigência e revogação.

O tipo determina quais controles e campos especializados são permitidos. O catálogo inicial distingue pelo menos:

- `lei`: normalmente usa controle ligado ou desligado depois de aprovada;
- `imposto`: pode usar alíquota ou faixa permitida;
- `programa`: pode usar verba, cobertura ou intensidade;
- `regulamentacao`: pode usar nível ou opções discretas previstas pelo conteúdo.

Novos tipos podem ser acrescentados posteriormente com contrato e validação próprios. Uma lei não contém um catálogo paralelo de políticas, e todas as políticas não são reduzidas ao mesmo controle deslizante.

Exemplo conceitual:

```json
{
  "id": "programa_materiais",
  "tipo": "programa",
  "controle": {
    "modo": "verba",
    "unidade": "moeda_por_passo"
  }
}
```

A interface deriva o controle do tipo e dos dados validados. Ela não possui uma tela programada especificamente para cada política.

## Autorização declarada pelo cenário

Cada política referencia um processo de autorização existente no cenário. O tipo da política restringe seus controles e campos, mas não determina sozinho quem a autoriza.

Exemplo conceitual:

```json
{
  "id": "lei_exemplo",
  "tipo": "lei",
  "processoAutorizacao": "votacao_legislativa"
}
```

```json
{
  "id": "programa_exemplo",
  "tipo": "programa",
  "processoAutorizacao": "decisao_executiva"
}
```

O pacote do país define os processos disponíveis, e a camada de jogo resolve a autorização. O motor numérico não conhece Senado, Câmara, Presidência ou nomes de instituições. Ele recebe somente controles já autorizados e implantados.

O SG015 exige a identidade e a referência do processo, mas não fixa cadeiras, maiorias, calendário ou regras de votação. Esses detalhes serão definidos no SG057.

## Situações eventos e dilemas

Situação, evento e dilema podem compartilhar contratos de condição e consequência, mas possuem ciclos de vida distintos:

- `situacao`: estado persistente que entra e sai conforme suas condições e memória;
- `evento`: ocorrência automática aplicada quando seu gatilho é satisfeito;
- `dilema`: ocorrência que cria uma escolha pendente e não aplica consequências de opção antes da resposta.

Todos preservam identidade, origem, condições, consequências, atraso e duração quando aplicáveis. O estado da partida registra situações ativas, eventos já ocorridos ou em intervalo de repetição e dilemas pendentes ou respondidos.

Exemplos artificiais:

```text
situação: sobrecarga do sistema de saúde
evento: enchente de grande proporção
dilema: escolher a prioridade diante de falta de vacinas
```

As condições e consequências continuam sendo dados executados por mecanismos conhecidos. O ciclo de vida não é inferido pelo nome nem tratado como uma única categoria genérica de acontecimento.

## Afinidade opinião e apoio parlamentar

O contrato político mantém separadas as seguintes grandezas:

- afinidade de partidos ou correntes com a medida;
- opinião pública sobre a medida, calculada por perfil populacional;
- aprovação geral do governo;
- apoio parlamentar estimado;
- resultado confirmado do processo de autorização.

Afinidades são parâmetros independentes e não precisam somar 100%. Elas não representam probabilidade nem garantem voto. Opinião pública pode influenciar o apoio parlamentar conforme a regra do cenário, mas não funciona como veto automático.

Uma proposta popular pode ser rejeitada por falta de votos. Uma proposta impopular pode ser aprovada e produzir desgaste. Apoio parlamentar não é moeda, orçamento nem uma pontuação de força política gasta pelo jogador.

As regras detalhadas que transformam composição política, afinidade e opinião em votos serão definidas no SG057. O SG015 fixa apenas que as entradas, estimativas e resultados possuem identidades e estados distintos.

## Ciclo de uma política

O estado mantém separadas as seguintes etapas:

1. disponibilidade;
2. proposta;
3. resultado da autorização;
4. nível desejado;
5. nível implantado;
6. vigência;
7. instâncias e memórias das consequências.

Uma proposta rejeitada não inicia implantação. Aprovação não transforma imediatamente o nível desejado em nível implantado. Depois da implantação, cada consequência ainda pode ter atraso, duração e dissipação próprios.

Revogar ou reduzir uma política altera contribuições futuras conforme a regra declarada. Isso não apaga automaticamente custos já pagos, dívida, estoques ou efeitos acumulados.

## Estado numérico e estado da partida

O retrato do motor numérico contém valores, passo técnico, histórico necessário e memórias das instâncias de consequência. Ele não conhece partidos, instituições ou vitória e derrota.

O estado da partida agrega ao retrato numérico:

- partido do jogador e governo em exercício;
- composição política e população;
- propostas e resultados de autorização;
- políticas vigentes, níveis desejados e implantados;
- finanças, mandato e turno;
- situações, eventos e dilemas pendentes.

Essa separação permite testar o motor sem interface ou regras eleitorais. O salvamento completo reunirá os dois estados em contrato posterior.

## Operações públicas

As operações mínimas são conceitualmente:

```text
carregarPacote(origem) → pacote bruto ou erros de leitura
validarPacote(pacote bruto) → definição imutável ou erros estruturados
criarExecucao(definição numérica) → retrato inicial do motor
criarPartida(definição do cenário) → estado inicial completo
proporPolitica(estado, proposta) → estado provisório ou impedimentos
responderDilema(estado, escolha) → estado provisório ou impedimentos
avancarPasso(retrato, comandos) → novo retrato ou falha técnica
confirmarTurno(estado, comandos) → novo estado completo ou falha atômica
```

A interface apresenta o estado e envia decisões à camada de jogo. Ela não calcula disponibilidade, opinião, apoio, autorização, finanças ou consequências. A camada de jogo coordena essas regras e chama o motor numérico somente para os cálculos declarados.

As assinaturas TypeScript definitivas serão implementadas nas fases correspondentes. O SG015 fixa responsabilidades, entradas, saídas e fronteiras de estado.

## Resultado da revisão

O cenário é um pacote independente identificado por manifesto. Definições são imutáveis durante a partida, e o estado mutável fica separado. Políticas possuem tipos e controles próprios, referenciam processos de autorização do cenário e atravessam proposta, autorização e implantação antes de produzir consequências. Situações, eventos e dilemas têm ciclos de vida distintos. Afinidade, opinião e apoio parlamentar não são uma única pontuação. As operações mantêm interface, jogo e motor com responsabilidades separadas.
