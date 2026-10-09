# A rede do mundo — bolha por bolha

**Estado:** SG142 (9/out/2026). Gerado por `scripts/rede/rede.py` a partir da
definição da rede; não edite à mão — edite o gerador e rode-o de novo.

A rede é do **mundo** (vale para todos os países, D-39). Os números das
ligações foram **calibrados** para que o Brasil de hoje (hipótese, coluna
"Brasil hoje") seja um ponto de equilíbrio: sem mudar nenhuma lei, o país
fica onde está; mudando, a mudança se propaga. Todos os valores são
hipóteses a refinar jogando.

Leitura: "falta de X" é o quanto X está abaixo do máximo da escala (ex.:
falta de cobertura = 100 − cobertura). Não existe valor-base escondido: cada
bolha é só o que está listado como positivo e negativo (D-40).

As **raízes** da rede são as leis (com nível) e dois **estoques** que o país
declara e que mudam devagar: capital humano (escolaridade acumulada) e
capital produtivo (máquinas e infraestrutura).

### Capital humano — Brasil hoje: 45

- **Positivo ←** Frequência escolar, Qualidade da educação
- **Negativo ←** desgaste natural (por trimestre)

### Capital produtivo — Brasil hoje: 50

- **Positivo ←** Investimento
- **Negativo ←** desgaste natural (por trimestre)

### Cobertura da atenção básica — Brasil hoje: 72

- **Positivo ←** Lei: atencao-basica (retornos decrescentes)
- **Negativo ←** —

### Pressão hospitalar — Brasil hoje: 54

- **Positivo ←** falta de cobertura da atenção básica (limiar), Violência letal, Pobreza
- **Negativo ←** —

### Saúde da população — Brasil hoje: 60

- **Positivo ←** Cobertura da atenção básica, Renda das famílias, Capital humano
- **Negativo ←** Crise no atendimento, Pressão hospitalar, Pobreza

### Frequência escolar — Brasil hoje: 75

- **Positivo ←** Lei: alimentacao-escolar (saturacao), Capital humano, Renda das famílias
- **Negativo ←** Pobreza

### Qualidade da educação — Brasil hoje: 40

- **Positivo ←** Capital humano, Frequência escolar, Capacidade do Estado
- **Negativo ←** —

### Participação no trabalho de quem cuida — Brasil hoje: 62

- **Positivo ←** Lei: creches-publicas (retornos decrescentes), falta de desemprego (limiar)
- **Negativo ←** —

### Oportunidades para jovens — Brasil hoje: 45

- **Positivo ←** Frequência escolar, Qualificação do trabalho, Atividade econômica, Participação no trabalho de quem cuida
- **Negativo ←** —

### Qualificação do trabalho — Brasil hoje: 50

- **Positivo ←** Capital humano, Oportunidades para jovens
- **Negativo ←** —

### Produtividade — Brasil hoje: 50

- **Positivo ←** Qualificação do trabalho, Capital produtivo, Saúde da população
- **Negativo ←** Corrupção

### Atividade econômica — Brasil hoje: 50

- **Positivo ←** Produtividade, Consumo das famílias, Investimento — 1 trimestre de atraso
- **Negativo ←** —

### Investimento — Brasil hoje: 40

- **Positivo ←** Confiança empresarial, Atividade econômica
- **Negativo ←** Onda de violência

### Confiança empresarial — Brasil hoje: 50

- **Positivo ←** Sensação de segurança, falta de corrupção (limiar), Atividade econômica
- **Negativo ←** Recessão

### Desemprego — Brasil hoje: 9

- **Positivo ←** falta de atividade econômica (limiar), falta de qualificação do trabalho (limiar)
- **Negativo ←** —

### Renda das famílias — Brasil hoje: 50

- **Positivo ←** falta de desemprego (limiar), Produtividade, Participação no trabalho de quem cuida
- **Negativo ←** —

### Consumo das famílias — Brasil hoje: 50

- **Positivo ←** Renda das famílias, Confiança nas instituições
- **Negativo ←** Recessão

### Pobreza — Brasil hoje: 30

- **Positivo ←** falta de renda das famílias (limiar), Desemprego
- **Negativo ←** —

### Desigualdade — Brasil hoje: 55

- **Positivo ←** Pobreza, falta de qualificação do trabalho (limiar)
- **Negativo ←** —

### Violência letal — Brasil hoje: 21

- **Positivo ←** Pobreza, Desigualdade, Crime organizado, falta de oportunidades para jovens (limiar)
- **Negativo ←** Lei: prevencao-seguranca (saturacao) — 1 trimestre de atraso

### Crime organizado — Brasil hoje: 40

- **Positivo ←** Corrupção, falta de oportunidades para jovens (limiar), Desigualdade
- **Negativo ←** Lei: prevencao-seguranca (saturacao) — 1 trimestre de atraso

### Proteção efetiva às mulheres — Brasil hoje: 42

- **Positivo ←** Lei: protecao-mulheres (retornos decrescentes), Capacidade do Estado
- **Negativo ←** —

### Sensação de segurança — Brasil hoje: 40

- **Positivo ←** falta de violência letal (limiar) — 1 trimestre de atraso, Proteção efetiva às mulheres
- **Negativo ←** Onda de violência

### Corrupção — Brasil hoje: 40

- **Positivo ←** falta de capacidade do estado (limiar), Desigualdade
- **Negativo ←** —

### Capacidade do Estado — Brasil hoje: 50

- **Positivo ←** Qualificação do trabalho, Confiança nas instituições
- **Negativo ←** —

### Confiança nas instituições — Brasil hoje: 45

- **Positivo ←** falta de corrupção (limiar), Sensação de segurança, Saúde da população
- **Negativo ←** —

### Crise no atendimento — Brasil hoje: 0

- **Positivo ←** Pressão hospitalar
- **Negativo ←** —

### Onda de violência — Brasil hoje: 0

- **Positivo ←** Violência letal
- **Negativo ←** —

### Recessão — Brasil hoje: 0

- **Positivo ←** Desemprego
- **Negativo ←** —

### Eficácia da lei atencao-basica

- **Positivo ←** Capacidade do Estado
- **Negativo ←** Crise no atendimento, Corrupção

### Eficácia da lei protecao-mulheres

- **Positivo ←** Capacidade do Estado
- **Negativo ←** Corrupção

### Eficácia da lei prevencao-seguranca

- **Positivo ←** Capacidade do Estado
- **Negativo ←** Corrupção

### Eficácia da lei alimentacao-escolar

- **Positivo ←** Capacidade do Estado
- **Negativo ←** Corrupção

### Eficácia da lei creches-publicas

- **Positivo ←** Capacidade do Estado
- **Negativo ←** Corrupção

### Apoio à lei atencao-basica

- **Positivo ←** Crise no atendimento
- **Negativo ←** —

### Apoio à lei prevencao-seguranca

- **Positivo ←** Onda de violência
- **Negativo ←** —

