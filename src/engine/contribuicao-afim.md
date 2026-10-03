# Contribuição afim

**Chamado:** SG027

**Data:** 2 de outubro de 2026

**Estado:** implementado

Para cada relação ativa de mecanismo `afim`, o motor calcula `origem × coeficiente + termoConstante`. A relação informa a origem, o coeficiente e o termo; a execução fornece o valor atual da origem.

O cálculo aceita resultados positivos, negativos ou zero quando forem finitos. A ativação da relação continua sendo decidida pela política autorizada; uma política inativa não chama este mecanismo e, portanto, não aplica termo constante.
