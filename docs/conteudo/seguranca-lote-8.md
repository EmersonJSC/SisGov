# Lote 8: vigilância e financiamento policial

> **Status: INTEGRADO E TESTADO FOCALMENTE.** Custos e efeitos numéricos
> adicionados ou mantidos têm **origem: "hipotese"** de jogo. O caso de mundo
> vem das fichas já existentes no catálogo e no desenho de Segurança.

| Lei | Decisão do jogador | Ganho e perda |
| --- | --- | --- |
| `cameras-corporais` | Financiar de zero ao teto de 0,01% do PIB por ano câmeras, armazenamento e fiscalização dos uniformes policiais | Menos letalidade policial e mais confiança, com custo orçamentário. É verba, não regra de reconhecimento facial. |
| `cameras-e-reconhecimento-facial` | Proibir; permitir em locais delimitados com auditoria; cobrir a cidade; ou criar cadastro nacional | A investigação e a sensação de segurança melhoram; privacidade, equidade e orçamento pagam o preço. Custo hipotético de 0 a 0,05% do PIB. |
| `vigilancia-de-bairro` | Não credenciar patrulhas; ter conselhos que informam a polícia; ou dar poder de abordagem a comitês | Mais presença reduz furtos; poderes de abordagem prejudicam liberdade e confiança. Custo hipotético de 0 a 0,02% do PIB. |
| `fundo-seguranca-publica` | Escolher de zero a 0,15% do PIB em repasses para equipes, viaturas e inteligência estaduais | Pode reduzir crime, mas pressiona contas. Comando federativo da polícia permanece outra lei. |

**Decisão de estrutura:** manter as quatro leis separadas. Financiar câmera no
uniforme, autorizar biometria, credenciar moradores e transferir recursos aos
estados são poderes diferentes e podem ser combinados pelo jogador.

## Ensaio de 16 turnos

`npx vite-node scripts/teste/setorSegurancaLote8.ts` cria três partidas com a
mesma semente, sem ocorrências ou eleição. A rota **auditada** financia câmeras
corporais até o teto, reconhecimento restrito, conselhos sem abordagem e 2/3
do teto do fundo. A rota **expansiva** não financia câmeras corporais, aplica
cadastro facial nacional, dá poder de abordagem e usa todo o fundo. As leis
foram aplicadas diretamente para isolar efeitos; o Congresso não foi medido.

| Indicador no turno 16 | Referência | Auditada | Expansiva |
| --- | ---: | ---: | ---: |
| Crimes patrimoniais | 46,662 | 43,927 | 39,271 |
| Letalidade policial | 30,973 | 19,151 | 32,224 |
| Sensação de segurança | 35,404 | 38,531 | 46,904 |
| Confiança nas instituições | 31,512 | 36,831 | 31,477 |
| Liberdade civil | 70,030 | 68,993 | 54,181 |
| Discriminação | 44,977 | 44,956 | 46,902 |
| Gasto público (% do PIB) | 30,800 | 31,035 | 31,056 |
| Dívida (% do PIB) | 114,397 | 113,996 | 114,840 |

A segurança percebida mudou logo no turno 1. Crime, letalidade e confiança
mostraram diferença visível no turno 4; os efeitos continuaram até o 16.
O ensaio concluiu sem erro. O nível desejado das verbas foi aplicado como
**valor monetário**, calculado do teto legal e do PIB inicial: 1.200 para
câmeras e 18.000 para o fundo no máximo. Um primeiro ensaio passou percentuais
como se fossem valores monetários; foi descartado, corrigido e repetido.

Na rota expansiva, a câmera corporal com meta zero ainda tinha nível
implementado de 3,378 ao fim do turno 16 por causa da redução gradual.
O dilema observado é queda maior do crime e segurança percebida contra perda
de liberdade, mais discriminação e maior letalidade policial. O custo líquido
no orçamento é pequeno frente às outras despesas do país; requer playtest
para saber se o jogador sente esse preço.

`src/tests/segurancaLote8.test.ts`: 2 testes focais passaram, verificando os
tetos monetários e o sentido dos efeitos no turno 4. A checagem geral segue
adiada para o fim da revisão.
