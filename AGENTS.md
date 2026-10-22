# Referências obrigatórias do SisGov

> **Status: VIGENTE.** Regras para quem trabalha no código, pessoas ou IA.
> Atualizado em 22/out/2026 (depois da limpeza dos documentos).

O documento mestre é o [PLANO.md](PLANO.md), única fonte de status. Antes de
qualquer trabalho, leia:

1. [PLANO.md](PLANO.md): como trabalhamos (uma mecânica por vez), marcos,
   decisões e o que falta.
2. [docs/jogo/escopo.md](docs/jogo/escopo.md): o que o jogo é.
3. A mecânica do assunto em [docs/jogo/mecanicas/](docs/jogo/mecanicas/README.md)
   e, se for lei, o desenho em [docs/jogo/leis/](docs/jogo/leis/README.md).
4. Referência técnica: os `.md` de `src/engine/` e [docs/arquitetura/](docs/arquitetura/).

Os documentos antigos (`docs/v1/`, `docs/desativado/`) foram tirados da `main`
em 21/out; estão na branch `gpt/estrutura-docs` e **não são para seguir**.
Nada do Democracy 4 entra no projeto; não abra `docs/Exemplos/` para escrever
conteúdo.

## Regras

- Uma mecânica por vez (ver os marcos do PLANO). Ideia nova vai para o PLANO, seção de pendências.
- Aceite = itens do chamado, cada um com teste, e `npm run check` verde na máquina
  do autor. Trabalho direto na `main` (D-22).
- Refatorar e mudar comportamento são chamados separados.
- Commit com o assunto na frente (`tempo: …`, `reforma: …`, `conserto: …`). `git push` só com a palavra do autor.
- Na terceira tentativa sem fechar uma tarefa, pare e reveja com o autor.
- O motor não conhece nomes de leis, partidos ou países (D-03). Leis e índices são
  do mundo; o país declara só o estado inicial (D-04, D-38).
- Jogabilidade primeiro, realidade como base: toda lei tem ligação com o mundo real, mas lei inventada é permitida e número não precisa de precisão empírica ([regras](docs/jogo/mecanicas/leis.md#29-como-escrever-uma-lei-nova)).

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
