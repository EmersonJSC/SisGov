# Referências obrigatórias do SisGov

Antes de planejar ou alterar motor político, leis, países, eleições ou estados de
chamados, leia [docs/arquitetura/contrato-motor-json.md](docs/arquitetura/contrato-motor-json.md)
e o trecho pertinente de [docs/plano-de-producao.md](docs/plano-de-producao.md).

Não trate parâmetros do JSON inicial do Brasil como constantes universais do
motor. Definições de leis pertencem ao catálogo compartilhado; o JSON de cada
país declara apenas seu estado inicial. Lei ausente inicialmente não é proibida.
Não marque um chamado como concluído enquanto algum pré-requisito obrigatório
estiver aberto. Diferencie contrato documentado, código isolado, integração na
partida e funcionamento em tela.

## Coordenação com subagentes

Use subagentes somente quando houver subtarefas independentes e verificáveis,
como pesquisa, inventário, revisão de contratos ou diagnóstico em módulos
distintos. Mantenha no agente coordenador tarefas curtas, etapas dependentes,
decisões de escopo e a síntese final.

Antes de delegar, defina a pergunta, os arquivos ou área de investigação, o
resultado esperado e se o trabalho é somente leitura ou pode editar. Por padrão,
subagentes investigam e devolvem evidências: arquivos consultados, achados,
testes executados e incertezas.

Não permita edição concorrente do mesmo arquivo ou módulo. Quando a edição
paralela for necessária, separe os limites de arquivo explicitamente e deixe a
integração, a atualização do plano/chamados e a decisão de conclusão para o
agente coordenador. Use no máximo dois subagentes simultâneos salvo pedido
explícito que justifique mais paralelismo.
