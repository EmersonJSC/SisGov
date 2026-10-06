# Modelagem do domínio do SisGov

**Status:** proposta inicial de organização  
**Data:** 6 de outubro de 2026

## Ideia central

O SisGov será organizado por **modelagem de domínio**: primeiro descrevemos as
coisas que existem no jogo, sua identidade, seu estado e as regras que as
governam; depois definimos telas, arquivos e implementação. A referência de
arquitetura mais próxima é *Domain-Driven Design* (DDD).

O projeto separa três perguntas:

1. **O que pode existir no país?** — conteúdo do cenário.
2. **O que acontece agora nesta partida?** — estado mutável da partida.
3. **Como o estado muda com o tempo?** — motor de simulação.

```text
Conteúdo do cenário                 Estado da partida                 Motor de simulação
"o que pode existir"               "o que acontece agora"           "como os valores evoluem"

políticas definidas                 partido do jogador                variáveis e relações ativas
variáveis e consequências           governo e mandato                 atrasos e duração
perfis e regras eleitorais          Senado e propostas                estoques e indicadores
estado inicial                      orçamento e opinião               histórico e explicações
```

## Vocabulário

| Conceito | Significado no SisGov | Exemplo |
| --- | --- | --- |
| Entidade | Tem identidade própria e permanece sendo o mesmo item quando muda. | A política `atencao_basica` vigente em uma partida. |
| Valor | Não tem identidade; pode ser substituído. | 55% de implantação, R$ 10 milhões, turno 4. |
| Definição | Conteúdo estável que descreve um item e suas regras. | O JSON de Atenção Básica. |
| Estado | Retrato mutável da partida. | Dívida, Senado, implantação e situações ativas. |
| Evento | Fato ocorrido que não deve ser reescrito. | Proposta aprovada, eleição realizada. |

Uma entidade não precisa ser uma classe TypeScript. Primeiro definimos seus
limites e regras; a representação técnica vem depois.

## Cenário: conteúdo imutável

Um cenário descreve um país jogável e não muda estruturalmente durante uma
partida. Os JSONs atuais pertencem principalmente a esta camada.

```text
Cenário
├── País definido
├── PolíticaDefinida
├── VariávelDefinida
├── ConsequênciaDefinida
├── PerfilSocial
├── OcorrênciaDefinida
└── RegraEleitoral
```

Hoje já existem no conteúdo: cenário, variáveis (`controle`, `calculado` e
`estoque`), políticas, consequências e ocorrências (`evento`, `situacao` e
`dilema`).

## Partida: estado mutável

Cada partida usa um cenário, mas tem história própria. Duas pessoas podem jogar
o mesmo país sem compartilhar dívida, decisões, Senado ou implantação.

```text
Partida
├── Governo
│   ├── Partido do jogador
│   └── Mandato
├── Senado
├── Políticas vigentes
├── Propostas
├── Orçamento e finanças
├── Opinião pública e perfis sociais
├── Situações, eventos e dilemas em curso
└── Execução da simulação
```

A distinção mais importante é entre a definição e sua instância na partida:

| PolíticaDefinida | PolíticaVigente |
| --- | --- |
| O que a política é. | Como ela está nesta partida. |
| Nome, tipo, descrição, controle e limites. | Status, nível desejado e implantado. |
| Processo de autorização, efeitos, ministério e fonte. | Turno de aprovação, compromissos e efeitos em curso. |

`Proposta` é a tentativa de criar ou alterar uma política vigente:

```text
rascunho → apresentada → em votação → aprovada | rejeitada
                                           ↓
                              cria ou altera PolíticaVigente
                                           ↓
                                     implantação progride
```

## Simulação: cálculo genérico

O motor não deve conhecer o partido, decidir votos ou desenhar a interface. Ele
recebe decisões já autorizadas e o estado necessário para calcular o próximo
passo.

```text
Partida no turno N
  + políticas implantadas
  + ocorrências ativas
  + duração do turno
        ↓
motor de simulação
        ↓
Partida no turno N + 1
  + indicadores, caixa e dívida atualizados
  + situações ativadas ou encerradas
  + explicações das mudanças
```

O motor atual já cobre variáveis, consequências, atrasos, duração, estoques,
histórico e explicações. A camada de jogo decide se uma medida foi proposta,
autorizada, rejeitada e implantada antes de enviar um comando ao motor.

## Responsabilidades

| Ação | Responsável |
| --- | --- |
| Definir políticas e consequências | Autoria do cenário |
| Criar proposta | Jogador / camada de jogo |
| Aprovar ou rejeitar proposta | Senado / regra de votação |
| Alterar nível de implantação | Governo / regra de implantação |
| Calcular efeitos e estoques | Motor de simulação |
| Alterar composição política | Eleição |
| Exibir dados e receber intenções | Interface |

A interface não altera diretamente dívida, indicadores ou implantação: solicita
uma ação, a camada de jogo a valida e coordena, o motor calcula e a interface
apresenta o resultado.

## Organização-alvo do código

Esta é uma direção, não uma migração imediata:

```text
src/
├── domain/
│   ├── scenario/       # definições imutáveis do país
│   ├── game/           # regras da partida e propostas
│   ├── politics/       # partido, governo, Senado e eleição
│   ├── fiscal/         # orçamento, caixa e dívida
│   └── society/        # perfis e opinião pública
├── simulation/         # motor numérico genérico
├── application/        # casos de uso, como avançar turno
├── ui/                 # componentes visuais
└── scenarios/          # conteúdo JSON
```

Enquanto a migração não acontece, `src/engine` corresponde ao futuro
`simulation`, e `src/scenarios` guarda o conteúdo. A nova camada `game` deve
nascer sem cálculo numérico genérico ou componentes de interface.

## Próximos passos

1. Usar este documento como glossário e acrescentar novos termos ao surgirem.
2. Especificar os estados e transições de `Proposta` e `PolíticaVigente`.
3. Criar um estado de `Partida` que referencie o cenário sem duplicar definições.
4. Introduzir casos de uso: `proporPolitica`, `votarProposta`,
   `avancarImplantacao` e `avancarTurno`.
5. Migrar diretórios somente quando cada fronteira tiver responsabilidade e
   testes claros.

## Onde estudar

O tema aparece em Engenharia de Software, Análise e Projeto de Sistemas,
Projeto Orientado a Objetos, Arquitetura de Software e modelagem
Entidade-Relacionamento. Para aprofundar: modelagem de domínio, DDD, máquinas
de estado e casos de uso.
