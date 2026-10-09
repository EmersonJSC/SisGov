# A rede do mundo — bolha por bolha

**Gerado** por `npm run rede:documento` a partir dos JSONs em
`src/conteudo/mundo/`. Não edite este arquivo: edite os JSONs e gere de novo.

A rede é do **mundo** (vale para todos os países, D-39). As forças das
ligações são hipóteses escolhidas uma a uma; **não há calibragem
automática**: enquanto faltam leis, a rede fica desequilibrada de propósito.
O equilíbrio para o jogador é trabalho do balanceamento (M7), com
`npm run rede:simular`.

Leitura: "falta de X" é o quanto X está abaixo do máximo da escala. Não
existe valor-base escondido: cada bolha é só o que está listado (D-40).
**Bolhas lentas** acumulam ao longo do tempo; o país declara só o ponto de
partida delas.

### Escolaridade (bolha lenta) — Brasil no turno 0: 45

- **Positivo ←** Lei: Alimentação escolar (saturacao), Capacidade do Estado, Renda das famílias
- **Negativo ←** desgaste natural (por trimestre), Pobreza

### Desenvolvimento (bolha lenta) — Brasil no turno 0: 50

- **Positivo ←** Investimento
- **Negativo ←** desgaste natural (por trimestre)

### Infraestrutura (bolha lenta) — Brasil no turno 0: 45

- **Positivo ←** Investimento
- **Negativo ←** desgaste natural (por trimestre)

### PIB (índice) — Brasil no turno 0: 61.11

- **Positivo ←** Consumo das famílias, Infraestrutura, Investimento — 1 trimestre(s) de atraso, Produtividade
- **Negativo ←** —

### Cobertura da atenção básica (índice) — Brasil no turno 0: 72.15

- **Positivo ←** Lei: Atenção básica de saúde (retornos decrescentes)
- **Negativo ←** —

### Pressão hospitalar (índice) — Brasil no turno 0: 52.48

- **Positivo ←** falta de cobertura da atenção básica (limiar), Pobreza, Violência letal
- **Negativo ←** —

### Saúde da população (índice) — Brasil no turno 0: 61.82

- **Positivo ←** Cobertura da atenção básica, Escolaridade, Renda das famílias
- **Negativo ←** Crise no atendimento, Pobreza, Pressão hospitalar

### Participação no trabalho de quem cuida (índice) — Brasil no turno 0: 62.53

- **Positivo ←** Lei: Expansão de creches públicas (retornos decrescentes), falta de desemprego (limiar)
- **Negativo ←** —

### Oportunidades para jovens (índice) — Brasil no turno 0: 37.54

- **Positivo ←** Escolaridade, Participação no trabalho de quem cuida, PIB, Qualificação do trabalho
- **Negativo ←** —

### Qualificação do trabalho (índice) — Brasil no turno 0: 49.18

- **Positivo ←** Escolaridade, Oportunidades para jovens
- **Negativo ←** —

### Produtividade (índice) — Brasil no turno 0: 58.97

- **Positivo ←** Desenvolvimento, Infraestrutura, Qualificação do trabalho, Saúde da população
- **Negativo ←** Corrupção

### Investimento (índice) — Brasil no turno 0: 45.23

- **Positivo ←** Confiança empresarial, PIB
- **Negativo ←** Onda de violência

### Confiança empresarial (índice) — Brasil no turno 0: 53.8

- **Positivo ←** falta de corrupção (limiar), PIB, Sensação de segurança
- **Negativo ←** Recessão

### Desemprego (índice) — Brasil no turno 0: 7.72

- **Positivo ←** falta de pib (limiar), falta de qualificação do trabalho (limiar)
- **Negativo ←** —

### Renda das famílias (índice) — Brasil no turno 0: 53.17

- **Positivo ←** falta de desemprego (limiar), Participação no trabalho de quem cuida, Produtividade
- **Negativo ←** —

### Consumo das famílias (índice) — Brasil no turno 0: 52.71

- **Positivo ←** Confiança nas instituições, Renda das famílias
- **Negativo ←** Recessão

### Pobreza (índice) — Brasil no turno 0: 27.68

- **Positivo ←** Desemprego, falta de renda das famílias (limiar)
- **Negativo ←** —

### Desigualdade (índice) — Brasil no turno 0: 52.8

- **Positivo ←** falta de qualificação do trabalho (limiar), Pobreza
- **Negativo ←** —

### Violência letal (índice) — Brasil no turno 0: 20.45

- **Positivo ←** Crime organizado, Desigualdade, falta de oportunidades para jovens (limiar), Pobreza
- **Negativo ←** Lei: Prevenção e cooperação em segurança (saturacao) — 1 trimestre(s) de atraso

### Crime organizado (índice) — Brasil no turno 0: 41.36

- **Positivo ←** Corrupção, Desigualdade, falta de oportunidades para jovens (limiar)
- **Negativo ←** Lei: Prevenção e cooperação em segurança (saturacao) — 1 trimestre(s) de atraso

### Proteção efetiva às mulheres (índice) — Brasil no turno 0: 42.03

- **Positivo ←** Lei: Rede de proteção às mulheres (retornos decrescentes), Capacidade do Estado
- **Negativo ←** —

### Sensação de segurança (índice) — Brasil no turno 0: 40.54

- **Positivo ←** falta de violência letal (limiar) — 1 trimestre(s) de atraso, Proteção efetiva às mulheres
- **Negativo ←** Onda de violência

### Corrupção (índice) — Brasil no turno 0: 39.42

- **Positivo ←** Desigualdade, falta de capacidade do estado (limiar)
- **Negativo ←** —

### Capacidade do Estado (índice) — Brasil no turno 0: 49.88

- **Positivo ←** Confiança nas instituições, Qualificação do trabalho
- **Negativo ←** —

### Confiança nas instituições (índice) — Brasil no turno 0: 45.59

- **Positivo ←** falta de corrupção (limiar), Saúde da população, Sensação de segurança
- **Negativo ←** —

### Crise no atendimento (situação) — Brasil no turno 0: 0

- **Positivo ←** Pressão hospitalar
- **Negativo ←** —

### Onda de violência (situação) — Brasil no turno 0: 0

- **Positivo ←** Violência letal
- **Negativo ←** —

### Recessão (situação) — Brasil no turno 0: 0

- **Positivo ←** Desemprego
- **Negativo ←** —

### Eficácia — Alimentação escolar (lei) — Brasil no turno 0: 0.9

- **Positivo ←** Capacidade do Estado
- **Negativo ←** Corrupção

### Eficácia — Atenção básica de saúde (lei) — Brasil no turno 0: 0.9

- **Positivo ←** Capacidade do Estado
- **Negativo ←** Corrupção, Crise no atendimento

### Apoio — Atenção básica de saúde (lei) — Brasil no turno 0: 0

- **Positivo ←** Crise no atendimento
- **Negativo ←** —

### Eficácia — Expansão de creches públicas (lei) — Brasil no turno 0: 0.9

- **Positivo ←** Capacidade do Estado
- **Negativo ←** Corrupção

### Eficácia — Prevenção e cooperação em segurança (lei) — Brasil no turno 0: 0.9

- **Positivo ←** Capacidade do Estado
- **Negativo ←** Corrupção

### Apoio — Prevenção e cooperação em segurança (lei) — Brasil no turno 0: 0

- **Positivo ←** Onda de violência
- **Negativo ←** —

### Eficácia — Rede de proteção às mulheres (lei) — Brasil no turno 0: 0.9

- **Positivo ←** Capacidade do Estado
- **Negativo ←** Corrupção
