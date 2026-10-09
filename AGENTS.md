# Referências obrigatórias do SisGov

O documento mestre é o [PLANO.md](PLANO.md). Antes de qualquer trabalho, leia a
seção 10 (status), o chamado em questão e as **regras anti-ciclo da seção 7**,
que são obrigatórias. Antes de alterar motor político, leis, países ou eleições,
leia também [docs/arquitetura/contrato-motor-json.md](docs/arquitetura/contrato-motor-json.md).
`docs/plano-de-producao.md` é apenas histórico.

- Um chamado por sessão; ao fim, atualize a seção 10 do PLANO (data, commit,
  teste). Status só existe lá.
- Aceite = critério do chamado + `npm run check` verde. Trabalho direto na
  `main` (D-22).
- Não escreva aceites do tipo "conclui quando X integrar" (R-03). Na 3ª
  iteração sem fechar, reavalie o chamado (R-05). Se repetir a mesma correção
  duas vezes, pare e registre o bloqueio (R-10).
- Não trate parâmetros do JSON inicial do Brasil como constantes universais do
  motor. Definições de leis pertencem ao catálogo compartilhado; o JSON de cada
  país declara apenas seu estado inicial. Lei ausente inicialmente não é proibida.
- Valor numérico ausente vira hipótese marcada (`origem: "hipotese"`); só
  mecanismo novo exige decisão (R-09).

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
