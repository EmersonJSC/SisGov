# Modelagem do domínio do SisGov

**Status:** direção arquitetural; migração e contratos em andamento

**Data:** consolidado em 7 de outubro de 2026

## Ideia central

Diretriz complementar confirmada: [conteúdo configurável por JSON](conteudo-configuravel-json.md).
Entidades e parâmetros são conteúdo; mecanismos genéricos pertencem ao motor.

O SisGov será organizado por **modelagem de domínio**: primeiro descrevemos as
coisas que existem no jogo, sua identidade, seu estado e as regras que as
governam; depois definimos telas, arquivos e implementação. A referência de
arquitetura mais próxima é _Domain-Driven Design_ (DDD).

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

| Conceito  | Significado no SisGov                                              | Exemplo                                             |
| --------- | ------------------------------------------------------------------ | --------------------------------------------------- |
| Entidade  | Tem identidade própria e permanece sendo o mesmo item quando muda. | A política `atencao_basica` vigente em uma partida. |
| Valor     | Não tem identidade; pode ser substituído.                          | 55% de implantação, R$ 10 milhões, turno 4.         |
| Definição | Conteúdo estável que descreve um item e suas regras.               | O JSON de Atenção Básica.                           |
| Estado    | Retrato mutável da partida.                                        | Dívida, Senado, implantação e situações ativas.     |
| Evento    | Fato ocorrido que não deve ser reescrito.                          | Proposta aprovada, eleição realizada.               |

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
│   └── Mandato presidencial
├── Senado (cadeiras, UF e vencimento de cada mandato)
├── Políticas vigentes
├── Propostas (prazo e único adiamento)
├── Orçamento e finanças (dívida herdada/nova e juros)
├── Opinião pública e perfis sociais
├── Situações, eventos e dilemas em curso
├── Calendário absoluto e estado do gerador aleatório
└── Execução da simulação
```

A distinção mais importante é entre a definição e sua instância na partida:

| PolíticaDefinida                                      | PolíticaVigente                                      |
| ----------------------------------------------------- | ---------------------------------------------------- |
| O que a política é.                                   | Como ela está nesta partida.                         |
| Nome, tipo, descrição, controle e limites.            | Status, nível desejado e implantado.                 |
| Processo de autorização, efeitos, ministério e fonte. | Turno de aprovação, compromissos e efeitos em curso. |

`Proposta` é a tentativa de criar ou alterar uma política vigente:

```text
rascunho → apresentada → em votação → aprovada | rejeitada
                                           ↓
                              cria ou altera PolíticaVigente
                                           ↓
                                     implantação progride
```

Na primeira versão, proposta parlamentar é normalmente votada no próximo
fechamento, com um único adiamento excepcional e limite de dois turnos. Ajustes
executivos já autorizados não precisam percorrer a votação do Senado.

A decisão discreta de uma lei e o progresso de sua execução não compartilham
necessariamente as mesmas opções. Aprovar uma opção ligada/desligada pode iniciar
uma implantação contínua. SG098 já separa `legalStatus` (vigente/revogada) do
estado e nível de implantação em `PolicyState`: iniciar revogação retira a
vigência jurídica, mas não zera a execução no mesmo instante. Efeitos com atraso
ou duração própria continuam sob a memória de relações do executor numérico,
fora de `PolicyState`; a integração entre ambos permanece pendente em SG099/SG061.
Um limiar opcional de revogação (`revocationEpsilon`) nas regras da lei permite
encerrar redução assintótica sem exigir zero exato. A ligação com JSONs do
pacote e a memória de efeitos da partida ainda não está integrada.

SG098 agora tem uma ponte isolada entre `PolicyState` e o executor: ela envia o
nível implantado ao controle e deixa de solicitar relações quando a implantação
termina; a memória de relações fixas já iniciadas permanece no executor. O
contrato de proposta registra prazo normal/máximo e adiamento único. Integrar
essas partes ao `GameState`, ao conteúdo JSON definitivo e ao fechamento do
turno continua pendente em SG099/SG058-B/SG061.

## Simulação: cálculo genérico

O motor não deve conhecer o partido, decidir votos ou desenhar a interface. Ele
recebe decisões já autorizadas e o estado necessário para calcular o próximo
passo.

```text
Estado técnico da simulação
  + controles derivados de políticas autorizadas e implantadas
  + contribuições de ocorrências já ativadas
  + duração do passo mensal
        ↓
motor de simulação
        ↓
Estado técnico do mês seguinte
  + indicadores e estoques genéricos
  + explicações das mudanças
```

A camada de aplicação coordena implantação, motor, contabilidade mensal,
ocorrências, tramitação e eleições. A regra fiscal decide emissão e juros;
o motor não deve atualizar outra cópia independente de caixa ou dívida. A
aplicação publica os valores necessários ao grafo e confirma a partida inteira.

O motor atual já cobre variáveis, consequências, atrasos, duração, estoques,
histórico e explicações. A camada de jogo decide se uma medida foi proposta,
autorizada, rejeitada e implantada antes de enviar um comando ao motor.

## Responsabilidades

| Ação                                            | Responsável                                             |
| ----------------------------------------------- | ------------------------------------------------------- |
| Definir políticas e consequências               | Autoria do cenário                                      |
| Criar proposta                                  | Jogador / camada de jogo                                |
| Aprovar ou rejeitar proposta parlamentar        | Regra de votação, com apoio político e acaso controlado |
| Autorizar ajuste dentro de permissão vigente    | Regra de autorização executiva                          |
| Alterar nível de implantação                    | Governo / regra de implantação                          |
| Calcular efeitos e estoques                     | Motor de simulação                                      |
| Calcular financiamento e juros                  | Domínio fiscal, com uma única fonte contábil            |
| Alterar composição política                     | Eleição; Senado preserva mandatos fora da renovação     |
| Coordenar tempo, sorteios e confirmação atômica | Aplicação / estado da partida                           |
| Exibir dados e receber intenções                | Interface                                               |

A interface não altera diretamente dívida, indicadores ou implantação: solicita
uma ação, a camada de jogo a valida e coordena, o motor calcula e a interface
apresenta o resultado.

O estado aleatório pertence à partida e acompanha o save: versão do gerador,
semente e posição/estado. A estimativa não consome sorteios de votação; uma falha
descarta também o avanço provisório do gerador. Mesmas escolhas e mesmo estado
restaurado reproduzem a continuidade. Isso não torna o voto determinístico pelo
apoio: sementes diferentes podem produzir dissidências diferentes.

Na v1 fiscal, o domínio mantém caixa, dívida total, dívida emitida durante a
partida e fluxo herdado de juros. A taxa fixa do cenário incide apenas sobre a
dívida nova já existente no início do mês. Emissão atual gera juros no mês
seguinte. O peso desses compromissos pode afetar os grupos por regras sociais
explícitas. Inflação, rating, bancos e crise fiscal ficam fora dessa integração.

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
2. Revisar os estados de `Proposta` e `PolíticaVigente` em SG098: prazo,
   adiamento, escolha discreta, implantação parcial e revogação.
3. Criar um estado de `Partida` que referencie o cenário sem duplicar definições.
4. Fechar tempo e contratos fiscal/político, implementar regras e então integrar
   `proporPolitica`, `votarProposta`, `avancarImplantacao` e `avancarTurno` conforme
   as dependências SG057–SG061. Não usar nomes de pastas para ampliar o escopo.
5. Migrar diretórios somente quando cada fronteira tiver responsabilidade e
   testes claros.

## Onde estudar

O tema aparece em Engenharia de Software, Análise e Projeto de Sistemas,
Projeto Orientado a Objetos, Arquitetura de Software e modelagem
Entidade-Relacionamento. Para aprofundar: modelagem de domínio, DDD, máquinas
de estado e casos de uso.

## Mapa das dependências atuais

O inventário do código confirma estes caminhos principais:

```text
main → cenário demonstrativo → tipo ScenarioDefinition
main → UI do mapa → tipos de apresentação
UI → diário de turno (somente o painel de registro)
laboratório de jogo → motor numérico
carregador de cenários → validação/resolução do motor
motor → tipo compartilhado de apresentação (validação antiga)
mapa e métricas → pacote e grafo do motor
testes → motor, carregador, laboratório e dados de demonstração
```

Fronteiras a corrigir gradualmente:

- `src/engine/validateScenario.ts` depende de `src/types/scenario.ts`, que também
  é usado pela UI. A validação do motor deve depender do contrato de cenário,
  não de um tipo de apresentação.
- `src/scenarios/loadScenarioPackage.ts` usa o motor para validar e resolver o
  formato JSON. Isso é uma dependência de carregamento esperada; a camada de
  domínio do cenário deverá receber o pacote validado por um adaptador explícito.
- `src/game/advanceLaboratoryTurn.ts` coordena respostas e execução do motor;
  serve como fluxo de laboratório, ainda não como caso de uso de uma partida.
- `src/ui/GameMap.tsx` apresenta tipos e mapas; `main.tsx` compõe cenário e UI.
  O fluxo futuro deve passar pela camada de aplicação.
- `src/domain/game` ainda não é consumido pela aplicação ou pela UI. Essa
  independência é desejável enquanto os contratos amadurecem.

O grafo de dependências desejado é: `ui → application → domain`, com
`application → simulation` e um adaptador entre conteúdo resolvido e domínio.
`domain` e `simulation` não devem depender de React; `simulation` não deve
depender das regras institucionais de `domain/game`.
