# Inicialização da execução

**Chamado:** SG025

**Data:** 2 de outubro de 2026

**Estado:** implementado

Um pacote é uma definição imutável do país. Uma execução é o estado numérico de uma partida específica. Ao iniciar, ela recebe passo zero e uma cópia dos valores declarados em `estado-inicial.json`.

Duas execuções criadas do mesmo pacote não compartilham valores. Alterar uma execução no futuro não pode mudar a outra, os arquivos JSON, a definição carregada ou o grafo. Os próximos passos acrescentarão comandos, relações ativas, memória e confirmação atômica.
