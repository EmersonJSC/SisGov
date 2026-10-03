# Comparação entre execução contínua e retomada

**Chamado:** SG040

**Estado:** implementado

O marco compara duas trajetórias: uma execução continua normalmente; a outra é exportada, serializada em JSON, restaurada e recebe os mesmos comandos. Valores, passo, explicações e histórico permanecem iguais.

O teste inclui efeito atrasado, memória gradual de implantação, situação ativa, evento já ocorrido e dilema pendente. O evento registrado não dispara novamente, e o histórico continua limitado ao maior atraso necessário.

Com isso, a Fase 04 está concluída. A integração com estado político e o salvamento completo da partida permanecem no SG081.
