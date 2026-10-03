# Revisão dos contratos da Fase 01

**Chamado:** SG016

**Data:** 2 de outubro de 2026

**Estado:** revisão concluída

## Escopo revisado

A revisão cruzou as decisões de SG009 a SG015:

| Chamado | Contrato revisado                             | Resultado   |
| ------- | --------------------------------------------- | ----------- |
| SG009   | retrato de leitura, propagação e ciclos       | consistente |
| SG010   | controles, valores calculados e estoques      | consistente |
| SG011   | consequências, identidades e soma por destino | consistente |
| SG012   | tempo, modos temporais, unidades e tolerância | consistente |
| SG013   | validação, domínios e falha atômica           | consistente |
| SG014   | contas manuais independentes do executor      | consistente |
| SG015   | pacote, estado político e interfaces          | consistente |

## Coerência entre tempo e estado

Todos os cálculos de um passo leem o mesmo retrato. Controles autorizados e implantados entram antes da fixação desse retrato. Valores calculados são produzidos pelas causas ativas, e estoques conservam o saldo anterior. Cadeias e ciclos evoluem ao longo de passos; o motor não resolve equilíbrio instantâneo.

A duração do passo é única por cenário. Ocorrência única, duração fixa e efeito contínuo não são codificados com números artificiais. Implantação, atraso, duração e dissipação permanecem estados distintos.

## Coerência entre conteúdo e cálculo

O jogador altera políticas e controles da camada de jogo, não indicadores do país. A camada de jogo resolve autorização e implantação antes de enviar controles ao motor.

Cada uso de consequência tem identidade e origem próprias. Contribuições paralelas são somadas no destino e permanecem auditáveis. O JSON seleciona mecanismos implementados pelo motor e fornece parâmetros; não contém fórmulas livres nem código executável.

As equações de SG014 são notação manual para resultados esperados e não fazem parte do formato JSON.

## Coerência entre unidades domínios e falhas

Cada valor declara unidade, domínio e estado inicial. Índice, percentual, moeda, moeda por passo e taxa por passo são distintos. Conversões dependem de mecanismos com parâmetros compatíveis.

O motor não corta nem satura resultados. Grandezas naturalmente limitadas usam mecanismos que produzam respostas válidas. Resultado impossível, valor não finito, unidade incompatível ou referência quebrada causam falha técnica.

Conteúdo inválido é rejeitado por inteiro. Uma falha durante o passo não confirma valores, memórias, histórico ou avanço temporal. Resultados desfavoráveis dentro do contrato são confirmados; somente a camada de jogo decide continuidade ou encerramento.

## Coerência entre país definição e partida

Cada país possui pacote independente e não depende de arquivos de outro cenário. O motor e o catálogo de mecanismos são compartilhados, mas nomes, propriedades, políticas e estado inicial pertencem ao país.

O manifesto localiza arquivos; referências executáveis usam IDs estáveis. A definição validada é imutável, enquanto o estado da partida reúne o retrato numérico e o estado político mutável.

Política, evento, situação e dilema possuem contratos e ciclos de vida próprios. Afinidade, opinião pública, aprovação do governo, apoio parlamentar e autorização são grandezas separadas. Regras eleitorais e parlamentares detalhadas continuam reservadas ao SG057.

## Mecanismos disponíveis e extensões

O primeiro recorte contrata contribuição fixa, proporcional, transformação afim e soma por destino. Produto, condições, respostas graduais e respostas limitadas entram quando um cenário concreto exigir, com implementação, validação e testes próprios.

A lista de mecanismos não pretende prever toda política futura. Conteúdo novo que use mecanismos existentes altera apenas arquivos do pacote. Uma operação matemática nova exige ampliar o motor.

## Pendências que não bloqueiam a fase

- parâmetros e fontes das políticas reais pertencem ao primeiro cenário de domínio;
- regras de Senado, votação, calendário e eleições pertencem ao SG057;
- assinaturas TypeScript concretas serão implementadas nas fases de carregamento, motor e jogo;
- salvamento completo será integrado depois que o estado político estiver implementado;
- mecanismos adicionais só entram quando um exemplo verificável os exigir.

## Resultado

Os contratos são consistentes entre si e deixam claro como conteúdo compatível será adicionado sem alterar código. Também deixam explícito o que ainda não está disponível. SG016 libera o início da Fase 02, que implementará o carregamento e a validação dos pacotes definidos nesta fase.
