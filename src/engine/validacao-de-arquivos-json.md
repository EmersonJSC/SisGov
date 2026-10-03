# Validação dos arquivos JSON

**Chamado:** SG018

**Data:** 2 de outubro de 2026

**Estado:** implementado

## Ideia

O validador é a porta de entrada de um pacote de cenário. Ele recebe o texto de um arquivo de autoria do desenvolvedor e devolve uma definição estrutural ou diagnósticos. Nenhuma etapa de cálculo começa quando houver diagnósticos. O jogador não escreve JSON, nem edita esses arquivos durante uma partida.

O diagnóstico informa código, caminho do arquivo, campo e uma mensagem legível. Por exemplo, um mecanismo ainda inexistente retorna `MECANISMO_NAO_SUPORTADO` em `consequencias/melhora-educacao.json`, campo `mecanismo`.

## Formatos iniciais

O contrato estrutural de versão 1 aceita:

- manifesto `cenario`;
- lista `variaveis`;
- `estado-inicial`;
- políticas `lei`, `imposto`, `programa` e `regulamentacao`;
- `consequencia` com o mecanismo `afim`.

Os campos são fechados em cada formato. Fórmulas livres, código e campos não declarados não passam pela validação. Nesta etapa, um texto pode conter IDs que ainda não existem; conferir arquivos ausentes, IDs duplicados e referências entre arquivos pertence ao SG019.

## Catálogo de mecanismos

O catálogo começa intencionalmente pequeno: `afim`. A consequência declara origem, alvo, unidade, atraso e os parâmetros numéricos `coeficiente` e `termoConstante`.

Adicionar `produto`, resposta limitada ou outro mecanismo exige implementação no motor, inclusão explícita no catálogo e testes. Colocar o nome em JSON antes disso falha com diagnóstico, sem iniciar uma execução parcial.

## Verificação

Os testes cobrem JSON com sintaxe inválida, campo inesperado, mecanismo desconhecido e uma consequência válida. A resolução do manifesto e dos IDs será feita na próxima tarefa.
