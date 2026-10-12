# Referências obrigatórias do SisGov

> **Status: VIGENTE.** Regras para quem trabalha no código, pessoas ou IA.
> Atualizado em 12/out/2026 (V1-01).

O documento mestre é o [PLANO.md](PLANO.md), única fonte de status. Antes de
qualquer trabalho, leia:

1. O chamado em [docs/v1/chamados.md](docs/v1/chamados.md) e a linha dele no PLANO.
2. [docs/v1/engenharia.md](docs/v1/engenharia.md): como um chamado é feito e
   quando está pronto.
3. [docs/v1/diferenciacao-d4.md](docs/v1/diferenciacao-d4.md): **nada do
   Democracy 4 entra no projeto.** Não abra `docs/Exemplos/` nem
   `docs/desativado/restrito-d4/` para escrever conteúdo.
4. Conforme o assunto: [arquitetura](docs/v1/arquitetura.md),
   [reestruturação](docs/v1/reestruturacao.md) ou [conteúdo](docs/v1/conteudo.md).

Documentos em `docs/desativado/` **não são para seguir**. O índice completo, com o
status de cada documento, está em [docs/README.md](docs/README.md).

## Regras

- Um chamado por vez. Ideia nova vai para [docs/v1/ideias.md](docs/v1/ideias.md).
- Aceite = itens do chamado, cada um com teste, e `npm run check` verde na máquina
  do autor. Trabalho direto na `main` (D-22).
- Refatorar e mudar comportamento são chamados separados.
- Commit com `V1-NN: o que mudou`. `git push` só com a palavra do autor.
- Na terceira tentativa sem fechar um chamado, pare e reveja com o autor.
- O motor não conhece nomes de leis, partidos ou países (D-03). Leis e índices são
  do mundo; o país declara só o estado inicial (D-04, D-38).
- Toda lei, índice e grupo tem fonte real. Número sem fonte é hipótese marcada.

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
