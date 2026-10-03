# Carregamento distribuído

**Chamado:** SG022

**Data:** 2 de outubro de 2026

**Estado:** implementado

## Fluxo único

Os arquivos JSON distribuídos em `src/scenarios` são descobertos automaticamente no build. O carregador recebe o caminho do manifesto e usa o mesmo fluxo em todos os lugares: resolve arquivos, confere coerência e monta o grafo.

Adicionar uma política compatível exige criar seu JSON e listá-lo em `cenario.json`. Não exige importação TypeScript, condição pelo nome da política ou alteração no motor.

## Falha sem alterar a partida

O carregador não mantém uma partida nem modifica uma definição anterior. Ele devolve um pacote novo completo ou diagnósticos. A camada que estiver com uma partida aberta só troca sua definição quando o retorno for válido; uma tentativa inválida deixa a definição anterior intacta.

## Pacote artificial

O primeiro pacote chama-se `exemplo` e serve apenas como prova de integração. Ele usa uma política fictícia de material escolar, uma verba de educação e uma consequência para educação pública. Cenários reais entram depois da pesquisa e não reutilizam seus valores como se fossem dados de um país.
