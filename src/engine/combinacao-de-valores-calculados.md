# Combinação de valores calculados

**Chamado:** SG028

**Data:** 2 de outubro de 2026

**Estado:** implementado

Um valor calculado parte de sua base e soma as contribuições ativas destinadas a ele. As contribuições são ordenadas pelo ID da relação antes da soma, para que a ordem de cadastro não altere o resultado.

O resultado não se torna a próxima base automaticamente. No passo seguinte, o motor volta à base declarada e aplica as causas daquele novo passo. Estoques seguem regra diferente e só serão atualizados no SG029.
