# Explicações do passo

**Chamado:** SG031

**Data:** 2 de outubro de 2026

**Estado:** implementado

Cada passo confirmado devolve explicações junto com a nova execução. Para cada indicador ou saldo alterado, a explicação guarda valor anterior, base, resultado e todas as contribuições ordenadas.

Uma contribuição informa a política ou evento que a ativou, consequência, origem, destino, valor lido, coeficiente, termo constante e valor produzido. Assim, `educacao_publica = 40,4` pode ser reconstruído como base 40 mais a contribuição 0,4 de `material-escolar`.

O formato é destinado à interface e a ferramentas de desenvolvimento. O jogador verá uma apresentação legível desses mesmos dados; a interface não recalcula nem inventa a causa.
