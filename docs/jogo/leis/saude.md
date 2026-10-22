# Saúde

> **Status: VIGENTE (em desenho).** Método e formato em [README](README.md).
> Cantos: **E·L** · **E·A** · **M·L** · **M·A** (ver README).

**Papel na partida:** filas, epidemias e hospitais lotados viram notícia
na hora; saúde da população e produtividade melhoram devagar. A indústria
ganha com trabalhador saudável (menos faltas, vida útil maior) e perde com
custo alto de plano de saúde pago pela empresa.

**Ganchos de jogo desta área:**
- **A fila é visível.** Tempo de espera para cirurgia e exames é um número
  que o jogador acompanha e que a população cobra.
- **Liberdade contra saúde coletiva.** Vacina obrigatória, internação
  forçada, proibir cigarro: o eixo de costumes aparece forte aqui.

---

### Modelo do sistema de saúde                  [regra · constitucional · geração]
Quem paga o atendimento médico da população.
- Cada um paga; o Estado atende só os pobres (M·L) · seguro obrigatório, com ajuda do governo para quem não pode pagar (neutra) · sistema público para todos, com rede privada ao lado (E·L) · só o sistema público; saúde privada proibida (E·A).
- Efeitos: gasto do bolso das famílias ↓ com sistema público · gasto público ↑ forte · fila ↑ se a verba não acompanhar.
- Programas: attlee-1945 (público universal), che-cuba-1959 (só público), reagan-1981 (cada um paga).
- Exclui: Planos de saúde (com "só o sistema público").
- Antes: modelo-do-sistema-de-saude.

### Piso de gasto em saúde                      [regra · constitucional · devagar]
Se a Constituição obriga a gastar uma parte mínima da receita em saúde.
- Sem piso (M·L) · piso atual (neutra) · piso maior para regiões pobres (E·L) · piso alto e garantido por vários anos (E·L).
- Trava: define o mínimo da Verba da saúde (já existe no código: `pisoPorLei`).
- Requer: Verbas carimbadas ≠ nenhuma (economia).
- Antes: piso-de-gasto-em-saude.

### Verba da saúde                              [verba · derivada · logo]
Quanto da receita do governo vai para a saúde.
- Faixa 0% a 100% da receita (mínimo dado pelo Piso).
- Efeitos: fila ↓ · saúde da população ↑ (devagar) · pressão hospitalar ↓.
- Antes: piso-saude, verba-da-saude-acima-do-piso.

### Postos de bairro ou hospitais               [verba · derivada · devagar]
Como a verba se divide entre prevenção nos bairros e hospitais.
- Faixa 0% a 100% para postos e agentes de saúde. Mais postos (E·L) · mais hospitais (neutra).
- Efeitos: com postos, doenças crônicas ↓ e pressão hospitalar ↓ (devagar); com hospitais, cirurgias ↑ e fila ↓ (logo).
- Antes: divisao-da-verba-atencao-basica-x-hospitais.

### Quem administra os hospitais públicos       [regra · derivada · devagar]
Quem toca o dia a dia de um hospital do governo.
- Servidores públicos (E·L) · organizações sem fins lucrativos, com metas (neutra) · empresas privadas contratadas (M·L).
- Efeitos: eficiência ↑ com metas · custo ↓ · reclamação de servidores ↑.
- Antes: forma-de-gestao-hospitalar.

### Fila única de cirurgias e exames            [regra · derivada · logo]
Como se decide quem é atendido primeiro.
- Cada hospital decide (M·L) · central regional, por gravidade (neutra) · fila nacional, pública e online (E·L).
- Efeitos: fila ↓ · transparência ↑ · fura-fila e corrupção ↓.
- Antes: regulacao-de-vagas.

### Mutirão de cirurgias                        [programa · derivada · já]
Força-tarefa para zerar a fila, pagando hospitais privados por cirurgia feita.
- Faixa 0% a 0,5% do PIB por ano.
- Efeitos: fila ↓ forte (já) · gasto ↑ · aprovação ↑ (já).
- Antes: mutirao-de-cirurgias.

### Médicos no interior                         [programa · derivada · logo]
Levar médicos para cidades pequenas e periferias.
- Nada (M·L) · bônus para quem for (neutra) · serviço obrigatório para recém-formados (E·A) · contratar médicos estrangeiros (E·L).
- Efeitos: falta de médicos ↓ · saúde do interior ↑ · conselhos médicos protestam (estrangeiros e serviço obrigatório).
- Antes: programa-de-medicos-no-interior.

### Formação de médicos                         [verba · derivada · geração]
Vagas de residência e faculdades de medicina.
- Faixa 0% a 0,5% do PIB.
- Efeitos: falta de médicos ↓ (geração) · fuga de cérebros ↑ se salário baixo.
- Antes: vagas-de-residencia-medica.

### Remédios de graça                           [regra · derivada · logo]
Que remédios a população recebe sem pagar.
- Nenhum (M·L) · lista básica nos postos (neutra) · lista ampla, também em farmácias privadas credenciadas (E·L).
- Efeitos: gasto do bolso ↓ · internações ↓ (doenças controladas) · gasto ↑.
- Antes: farmacia-popular, remedios-em-farmacias-credenciadas, lista-de-remedios-e-incorporacao.

### Patentes de remédios                        [regra · derivada · devagar]
O quanto o país respeita as patentes dos laboratórios.
- Patente plena e longa (M·L) · genéricos estimulados ao fim da patente (neutra) · quebra de patente em remédios caros (E·A).
- Efeitos: preço dos remédios ↓ com quebra · investimento estrangeiro ↓ · reputação internacional ↓ leve.
- Antes: genericos-e-patentes-de-medicamentos.

### Planos de saúde                             [regra · derivada · logo]
O quanto o governo controla os planos privados.
- Livre (M·L) · cobertura mínima obrigatória (neutra) · reajuste controlado e cobertura ampla (E·L).
- Efeitos: preço dos planos ↑ com mais regras · pessoas com plano ↓ · pressão no sistema público ↑.
- Exclui: Modelo do sistema = só público.
- Antes: regulacao-dos-planos-de-saude.

### Vacinação obrigatória                       [regra · derivada · logo]
Se a vacina é escolha ou obrigação.
- Livre (M·L) · exigida para escola e serviço público (neutra) · obrigatória com multa (E·A).
- Efeitos: cobertura vacinal ↑ · epidemias ↓ · liberdade civil ↓ · protestos ↑ com multa.
- Antes: vacinacao-obrigatoria.

### Vigilância de epidemias e campanhas         [verba · derivada · logo]
Laboratórios, alertas e campanhas de vacinação.
- Faixa 0% a 0,5% do PIB.
- Efeitos: epidemias ↓ (risco e duração) · cobertura vacinal ↑.
- Antes: vigilancia-epidemiologica, campanha-de-vacinacao-lei.

### Saúde mental e dependência química          [regra · derivada · devagar]
Como o país trata transtornos mentais e vício.
- Clínicas e terapia no bairro (E·L) · leitos em hospitais gerais e comunidades terapêuticas (neutra) · internação forçada de dependentes (M·A).
- Efeitos: sofrimento mental ↓ · população de rua ↓ com internação (já), ↑ depois sem tratamento · liberdade civil ↓ com internação forçada.
- Antes: saude-mental.

### Cigarro e bebida                            [regra · derivada · devagar]
Quanto o país restringe tabaco e álcool.
- Livre (M·L) · sem propaganda, com avisos (neutra) · venda só em lojas do governo, com horário (E·A) · proibido (E·A).
- Efeitos: consumo ↓ · saúde ↑ (devagar) · mercado paralelo ↑ com proibição.
- Antes: restricao-a-tabaco-e-alcool.

### Esporte e atividade física                  [verba · derivada · geração]
Praças, quadras, escolinhas e programas de exercício.
- Faixa 0% a 0,3% do PIB.
- Efeitos: saúde ↑ (geração) · oportunidades para jovens ↑ · crime ↓ leve.
- Novo (Ministério do Esporte).

---

**Cobertura da bússola:** E·L (sistema público, médicos estrangeiros,
remédios amplos) · E·A (só público, serviço obrigatório, quebra de patente,
vacina com multa, proibição) · M·L (cada um paga, empresas contratadas,
patente plena) · M·A (internação forçada).

**Vai para outra área:** aborto e eutanásia ficam em direitos; cannabis em
segurança.
