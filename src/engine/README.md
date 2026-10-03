# Motor do SisGov

## O que ele é hoje

O motor lê um pacote de país, confere suas regras e calcula consequências numéricas. Ele não sabe se o pacote representa Brasil, Estados Unidos ou outro país. Também não desenha tela, não recebe texto digitado pelo jogador, não autoriza leis e não encerra partidas.

O jogador escolhe políticas prontas na interface. A camada de jogo futura decide se a escolha foi autorizada e implantada. Só então ela envia ao motor controles aplicados e relações ativas.

## Fluxo atual

```text
arquivos JSON de um país
  → validar arquivo e campos
  → resolver manifesto, arquivos e IDs
  → conferir unidades, domínios e controles
  → montar grafo de variáveis e relações
  → criar execução independente
  → traduzir política autorizada em comando
  → calcular contribuições e confirmar um passo
```

Exemplo artificial disponível em `src/scenarios/exemplo`:

```text
Material escolar, verba 20
  → controle verba_educacao = 20
  → relação ativa usa coeficiente 0,02
  → contribuição para educação = 20 × 0,02 = 0,4
  → educação pública: base 40 + 0,4 = 40,4
```

Os números do exemplo não representam um país real. Eles existem para comprovar o fluxo técnico.

## Arquivos principais

| Arquivo                                     | Responsabilidade                                                |
| ------------------------------------------- | --------------------------------------------------------------- |
| `model/contentTypes.ts`                     | Formatos de cenário, variável, política e consequência.         |
| `model/validateContentFile.ts`              | Confere um JSON isolado: sintaxe, campos e mecanismo conhecido. |
| `model/resolvePackage.ts`                   | Lê manifesto, encontra arquivos e resolve IDs e referências.    |
| `model/validatePackageCoherence.ts`         | Confere unidade, domínio, estado inicial e controles.           |
| `graph/buildGraph.ts`                       | Cria nós e relações auditáveis, preservando paralelos e ciclos. |
| `runtime/createExecution.ts`                | Cria uma partida numérica independente no passo zero.           |
| `runtime/translatePolicyCommands.ts`        | Traduz política autorizada em controles e relações ativas.      |
| `mechanisms/calculateAffineContribution.ts` | Calcula `origem × coeficiente + constante`.                     |
| `mechanisms/combineCalculatedValue.ts`      | Soma causas ativas sobre a base de um indicador.                |
| `mechanisms/updateStock.ts`                 | Atualiza saldo acumulado por taxas e duração.                   |
| `runtime/advanceExecution.ts`               | Executa e confirma um passo de modo atômico.                    |
| `diagnostics/analyzePackage.ts`             | Produz avisos de ciclos, conteúdo sem uso e arquivos órfãos.    |

`index.ts` é a porta pública do motor: ele exporta as operações que outras partes do jogo podem usar.

## Regras já garantidas

- Pacote inválido não abre partida.
- Dois países usam o mesmo motor e têm dados próprios.
- Duas execuções do mesmo pacote não compartilham valores.
- O jogador não altera indicadores diretamente; políticas comandam controles.
- Consequências não podem alterar controles.
- Relações paralelas preservam origem própria para auditoria.
- Ciclos são permitidos e avançam passo a passo.
- Uma falha não altera a execução anterior.

## Limite atual

O motor já avança o exemplo artificial por teste, mas a interface ainda não usa o pacote JSON nem mostra o resultado. Também faltam explicações detalhadas por contribuição, atrasos, duração operacional, memória de efeitos, eventos e a camada de jogo de autorização e implantação.

## Documentação por decisão

Os arquivos `.md` ao lado do código registram o porquê das decisões. Para leitura inicial, consulte `semantica-do-passo.md`, `tipos-de-valor.md`, `pacote-e-interfaces.md`, `grafo-do-cenario.md` e `confirmacao-do-passo.md`.
