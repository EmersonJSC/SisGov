# Revisão de consistência da V1 — 8 de outubro de 2026

Revisão do plano de produção, especificação SG057, escopo da primeira versão,
documentos de domínio e leituras pontuais do código e do cenário. Este relatório
registra achados e recomendações; não altera os contratos nem encerra chamados.
Não é uma auditoria de legislação, dados históricos ou de toda a implementação.

A revisão considera a última decisão do usuário: cada política poderá declarar
em JSON os grupos afetados e a variação, em pontos percentuais, do apoio à
coalizão. Essa variação entra quando o efeito chega ao grupo; efeitos simultâneos
são somados e a redistribuição respeita o intervalo de 0% a 100%. A fonte do efeito
está, portanto, decidida; ainda falta fechar seu comportamento ao longo do tempo.

P1 indica risco de travar a integração ou tornar a partida incoerente. P2 indica
uma lacuna que precisa de regra explícita antes da implementação correspondente.
Exemplos numéricos abaixo são sintéticos, não parâmetros de balanceamento.

## 1. P1 — O efeito político pode virar uma fonte repetida de apoio

O plano descreve aumento/redução do apoio, atraso e soma simultânea, mas ainda não
define se a variação é única, recorrente ou uma contribuição mantida enquanto a
política produz resultados. A proposta recém-aprovada também não fecha isso.

Exemplo: apoio de 40% e efeito de +2 pontos. Aplicar uma vez resulta em 42%; aplicar
em cada um dos três meses resulta em 46%. Repetir a mesma recompensa por meses,
sem melhora adicional, pode levar o apoio a 100%. Revogar e reativar a política
pode permitir ganhar o mesmo bônus novamente. Subtrair depois de limitar também
é problemático: 99 + 5 vira 100; retirar 5 deixa 95, em vez dos 99 originais.

Recomendação: declarar unidade temporal, condição de aplicação, intensidade,
duração e tratamento da revogação. Para contribuições persistentes, manter a
origem e recalcular o total sobre uma referência, aplicando o limite ao resultado;
para efeitos únicos, guardar que a ocorrência já foi consumida. Usar uma única
origem para o mesmo benefício, inclusive quando o indicador correspondente
também provoca reação política. Políticas herdadas não devem conceder novamente
um bônus já embutido no apoio inicial.

Evidências: [apoio e redistribuição](../plano-de-producao.md#sg057-b2-definir-o-contrato-político-do-sisgov--em-andamento),
[reações à medida e ao resultado](sg057-b1-estudo-simulacao-eleitoral.md#exemplo-manual-para-testar-o-contrato-futuro)
e a decisão mais recente da conversa.

## 2. P1 — A migração mensal cobre somente parte do tempo do conteúdo

SG057-A converte implantação e degradação de políticas. O helper trimestral faz
essa conversão, mas mantém os demais dados das consequências. O conteúdo antigo
declara atrasos em turnos e um evento com duração de três turnos; os JSONs usam
`atrasoPassos` e `duracao.passos` sem unidade temporal explícita.

Com o passo técnico mensal, três passos são três meses; três turnos políticos
são nove meses. A integração pode encurtar efeitos e antecipar reações sem que
as taxas de implantação estejam erradas. A própria propagação entre nós também
consome passos técnicos e deve entrar na verificação da cadeia.

Recomendação: inventariar atrasos, durações, taxas, fluxos e contribuições em
estoques; declarar a unidade de cada parâmetro e fazer uma migração explícita do
conteúdo. Comparar trajetórias em meses equivalentes. Não dividir tudo por três:
níveis, fluxos e taxas exigem tratamentos diferentes.

Evidências: [SG057-A](../plano-de-producao.md#sg057-a-contrato-temporal--em-andamento),
[parâmetros antigos](sg053-parametros-do-primeiro-cenario.md#parâmetros-das-relações),
[helper trimestral](../../src/game/advanceQuarterlyLaboratoryTurn.ts) e
[duração do evento](../../src/scenarios/brasil-primeiro-cenario/consequencias/evento-eleva-pressao.json).

## 3. P1 — Falta o ciclo de jogo depois de extinguir instituições ou eleições

Reforma e ruptura podem dissolver o Congresso ou cancelar eleições. Os aceites
da partida ainda descrevem votar no Senado, realizar eleições e continuar ou
encerrar conforme a eleição presidencial. Não há um contrato completo para a
transição e a vida posterior da partida.

Faltam regras para propostas pendentes, autoridade que passa a aprovar medidas,
eleições já agendadas, redução de cadeiras com mandatos em curso e condição de
continuidade/derrota sem eleição. Também falta explicitar no aceite de salvamento
as instituições e garantias alteradas, os apoios militares/judiciais e a situação
da ruptura. Uma reforma no fechamento eleitoral precisa ter momento de vigência
definido para não cancelar ou alterar uma eleição conforme a ordem de execução.

Recomendação: definir um conjunto pequeno de estados institucionais válidos e
suas transições, incluindo a autorização posterior e o fim de jogo. Os JSONs
continuam extensíveis por mecanismos suportados. A ausência de um órgão nunca
deve virar aprovação automática por uma conta sobre zero cadeiras. Uma decisão
de adiar alguma dessas mecânicas precisa ser explícita, pois os caminhos de
reforma e ruptura foram aprovados pelo usuário.

Evidências: [reformas e ruptura](sg057-proxima-fase-e-economia.md#eleições-e-estado-herdado),
[SG061](../plano-de-producao.md#sg061-confirmar-turno-inteiro),
[critério de ciclo completo](primeira-versao.md#critérios-de-sucesso) e
[SG081](../plano-de-producao.md#sg081-definir-arquivo-de-partida).

## 4. P1 — Os textos dão instruções incompatíveis para concluir SG057-A

O registro de SG057-A informa que faltam finanças, propostas, votações e eleições
integradas e mantém seu aceite aberto. SG060 depende de SG057-A, enquanto SG061
depende de SG057-A e SG060. Lido como exigência de aceite, isso cria um ciclo:
SG057-A aguarda a integração que depende dele. O plano detalhado afirma
expressamente que a implementação fiscal não é pré-requisito de SG057-A.

Recomendação: limitar o aceite de SG057-A ao contrato de tempo, conversões e
composição de passos, com testes isolados. A integração da partida inteira fica
no aceite de SG061. Isso não autoriza marcar SG057-A como concluído sem conferir
os demais itens temporais, inclusive o achado 2.

Evidências: [registro de SG057-A](../plano-de-producao.md#sg057-a-contrato-temporal--em-andamento),
[dependência de SG060](../plano-de-producao.md#sg060-contabilizar-finanças-públicas) e
[sequência detalhada](sg057-proxima-fase-e-economia.md#sequência-de-execução-sem-dependências-circulares).

## 5. P2 — Apoio à coalizão não define sozinho quem vence a Presidência

Os efeitos distribuem apoio entre partidos da coalizão, preservando proporções
internas. A apuração presidencial escolhe o maior total por partido. Não está
definido se aliados apresentam candidaturas separadas ou transferem seus votos
para uma candidatura presidencial comum.

Exemplo: partido do jogador com 30%, aliado com 25% e oposição com 45%. A coalizão
tem 55%, mas a oposição vence se os aliados concorrem separadamente; uma
candidatura comum teria outro resultado. Ambas as regras são possíveis, mas o
jogo precisa escolher uma e mostrá-la ao jogador.

Recomendação: declarar quais candidaturas presidenciais existem e como os partidos
as apoiam. Uma candidatura agregada por coalizão não exige personagens ou gestão
individual de candidatos. Preservar os partidos separados na apuração senatorial.

Evidência: [apuração presidencial e redistribuição de apoio](../plano-de-producao.md#sg057-b2-definir-o-contrato-político-do-sisgov--em-andamento).

## 6. P2 — A redistribuição proporcional não está definida nos extremos

O plano permite apoio de 0% e 100%, mas manda preservar as proporções internas.
Se todos os partidos da coalizão têm zero, não existe proporção para distribuir
um ganho. Se a oposição inteira tem zero, não existe proporção para receber a
perda da coalizão. Calcular a razão diretamente produz divisão por zero.

Recomendação: declarar pesos de referência para esses casos e validar quais
partidos são elegíveis. Também tratar cenário sem oposição ou sem partido
elegível. Verificar que as parcelas permanecem finitas, não negativas e somam
100%, independentemente da ordem dos efeitos.

Evidência: [redistribuição e limites](sg057-proxima-fase-e-economia.md#eleições-e-estado-herdado).

## 7. P2 — A votação constitucional precisa de uma base de contagem

As leis ordinárias usam as 81 cadeiras senatoriais do cenário inicial. A emenda
usa uma votação agregada de Câmara e Senado, mas não está definida uma composição
agregada nem está explícito que as mesmas 81 cadeiras representam esse conjunto.
Portanto, 60% está decidido, mas ainda falta dizer 60% de qual total e como
arredondar quando o número de cadeiras mudar.

Recomendação: reutilizar um único colegiado de jogo se essa for a simplificação
pretendida, com identidade e denominador explícitos. Se a base for 81 cadeiras,
60% exige 49 votos; a maioria absoluta exige 41. Diferenciar presença mínima de
votos necessários para aprovação. Definir também a relação entre os sorteios das
duas rodadas: se forem independentes, 80% de chance de passar em cada uma vira
64% de chance de passar nas duas. Isso é uma consequência de balanceamento, não
um erro na decisão de exigir duas votações.

Evidências: [votação ordinária e constitucional](../plano-de-producao.md#sg057-b2-definir-o-contrato-político-do-sisgov--em-andamento)
e [rascunho institucional](../../src/scenarios/brasil-primeiro-cenario/organizacao-politica.json).

## 8. P2 — “Maiores médias” ainda não determina a apuração

É preciso fixar os divisores, a regra para uma vaga, os partidos elegíveis e o
critério de igualdade antes de usar o d20. Com votos 70/30 e duas vagas, divisores
1 e 2 entregam ambas ao primeiro partido; divisores 1 e 3 entregam uma a cada.
Ambos usam maiores médias, mas produzem resultados diferentes.

Também faltam os pesos eleitorais por UF: os perfis atuais têm pesos nacionais
0,55 e 0,45, sem distribuição territorial. Repetir esses pesos em todas as UFs
produz estados eleitoralmente idênticos. Dar peso igual a cada UF na Presidência
pode distorcer a apuração nacional. Essas entradas podem ser hipóteses sintéticas
identificadas para testar a V1.

Recomendação: escrever uma fórmula única, dois exemplos de resultado e o formato
dos pesos dos perfis por UF. Somar eleitores na Presidência e distribuir cadeiras
por UF no Senado. Comparar os valores internos, com precisão definida, antes de
arredondar a apresentação; empate visual não deve acionar um d20 indevido.

Evidências: [regra e pendência das maiores médias](sg057-proxima-fase-e-economia.md#eleições-e-estado-herdado)
e [perfis atuais](../../src/scenarios/brasil-primeiro-cenario/cenario.json).

## 9. P2 — O limite da V1 ficou ambíguo com as novas instituições

O escopo adia gabinete individual, negociação de coalizões e candidatos
individuais. SG057-B2 agora inclui apoio do ministro, escolha entre comandantes,
vagas e apoio do Judiciário. Essas direções podem coexistir com uma V1 pequena,
mas falta delimitar qual representação mínima será implementada e em qual chamado.
Campanha também exige recursos, ações e efeitos sem um recorte mínimo fechado.

Recomendação: listar o mínimo necessário de cada sistema aprovado, por exemplo
apoios agregados e eventos simples quando couberem. Não assumir que os três
comandantes exigem um sistema completo de gabinete. Distinguir decisões de regra
de valores ajustáveis por balanceamento; SG057-B2 não deve esperar todos os
coeficientes finais para terminar.

Evidências: [exclusões da V1](primeira-versao.md#fora-do-escopo),
[apoios e nomeações](sg057-proxima-fase-e-economia.md#eleições-e-estado-herdado) e
[campanha em SG057-B](../plano-de-producao.md#sg057-b-regras-políticas--planejado).

## 10. P2 — Os resumos de progresso e regras ficaram desatualizados

O plano mestre ainda diz, no resumo inicial, que faltam testes comportamentais
de SG057-A; o registro do mesmo chamado informa sete testes focados e verificação
manual em tela. O plano detalhado menciona quatro testes e integração pendente
sem distinguir a bancada da partida completa. Há também um trecho dizendo que
a aleatoriedade aprovada é parlamentar, sem mencionar a exceção eleitoral do
d20, que aparece no mesmo documento.

Essas divergências aumentam o risco de repetir trabalho e de anunciar uma etapa
concluída ou pendente com base no parágrafo errado. Parte dessa divergência veio
das atualizações parciais feitas nesta conversa.

Recomendação: manter um resumo atual único por chamado, separar evidência
histórica de estado vigente e referenciar a regra detalhada em vez de repeti-la
em vários lugares. A Fase 6 continua concluída; os novos contratos não apagam
seu aceite histórico. A última aprovação sobre efeitos políticos deve entrar
na consolidação, sem continuar listada como decisão totalmente aberta.

Evidências: [resumo do progresso](../plano-de-producao.md#progresso-e-próxima-fase--revisão-de-7-de-outubro-de-2026),
[registro de SG057-A](../plano-de-producao.md#sg057-a-contrato-temporal--em-andamento),
[resumo detalhado](sg057-proxima-fase-e-economia.md#estado-atual-e-próxima-entrega) e
[texto sobre acaso](sg057-proxima-fase-e-economia.md#acaso-na-votação-parlamentar).

## O que está coerente e deve ser preservado

- Proposta, autorização, implantação e efeitos têm estados separados.
- As contas mensais distinguem caixa, dívida, emissão e juros; o modelo explicita
  que financiar juros gera dívida nova, sem cobrar o mesmo valor duas vezes.
- Vencer preserva a partida e os vencimentos das cadeiras fora da renovação.
- Votação anterior à renovação, maioria parlamentar e d20 eleitoral são regras
  distintas e compatíveis, uma vez definido o colegiado.
- Estado aleatório e confirmação atômica já têm direção clara no plano.

## Próxima ação recomendada

Consolidar esses contratos antes de ampliar a implementação: comportamento
temporal dos efeitos, conversão do conteúdo, transições institucionais, fronteira
de aceite de SG057-A e contas eleitorais mínimas. Depois registrar exemplos
executáveis para apoio repetido/revogado/herdado, redistribuição em 0% e 100%,
mudança institucional em turno eleitoral, apuração por UF e restauração do mesmo
estado aleatório. Os achados não exigem recomeçar o motor nem desfazer a Fase 6.

## Encaminhamento ao plano de implementação — 8 de outubro de 2026

Os achados foram convertidos em subtarefas locais no
[plano de produção](../plano-de-producao.md), com entrega, dependências e critérios
de aceite próximos dos chamados afetados. Este relatório preserva o diagnóstico
da revisão; encaminhar não significa corrigir a mecânica no código.

| Achado / fix | Chamado responsável         | Correção planejada                                     |
| ------------ | --------------------------- | ------------------------------------------------------ |
| FIX-V1-01    | SG058-A                     | Ciclo dos efeitos políticos, revogação e reaplicação   |
| FIX-V1-02    | SG057-A                     | Migração de todas as unidades temporais                |
| FIX-V1-03    | SG061; contrato em SG057-B2 | Continuidade após mudanças institucionais              |
| FIX-V1-04    | SG057-A                     | Aceite temporal separado da integração completa        |
| FIX-V1-05    | SG058-B                     | Vínculo entre partidos, aliados e candidaturas         |
| FIX-V1-06    | SG058-A                     | Redistribuição com apoio em 0% ou 100%                 |
| FIX-V1-07    | SG058-B                     | Colegiado, denominador e duas votações constitucionais |
| FIX-V1-08    | SG058-B                     | Fórmula eleitoral e pesos por UF                       |
| FIX-V1-09    | SG057-B2                    | Recorte mínimo institucional e de campanha             |
| FIX-V1-10    | Acompanhamento das entregas | Sincronização de regras e progresso                    |

Todos permanecem planejados até seus aceites. Os resumos desatualizados e a
fronteira documental de SG057-A foram alinhados nesta revisão; isso não encerra
SG057-A nem os testes de implementação previstos. SG081–SG082 também receberam
o aceite de persistência dos novos estados, inclusive após mudança institucional.
