# Pendências da troca das leis pelas fichas (V1-34, 15/out)

Atualizado ao fim da rodada de 15/out. Nada foi commitado nem enviado.

## 1. Leis antigas que continuam como estão (a ficha nova delas ainda não entrou)

Sem par claro nas fichas ou usadas por testes de cenário pelo nome. Decisão do Emerson: ligar à ficha parecida ou manter.

- `codigo-florestal`
- `delacao-premiada`
- `destino-do-resultado-fiscal`
- `formula-do-salario-minimo`
- `fundo-soberano`
- `garantias-penais`
- `habitacao-publica`
- `idade-minima-aposentadoria`
- `licenca-parental`
- `licenciamento-ambiental`
- `matriz-energetica`
- `policia-militar`
- `policias-dos-estados`
- `previdencia-rural`
- `quem-decide-o-salario-minimo`
- `reajuste-de-beneficios`
- `regra-fiscal`
- `salario-minimo`
- `sistema-previdenciario`

## 2. Leis de dinheiro e alíquota (23)

A ficha descreve o REGIME (a estrutura: progressivo, IVA dual, piso por receita), enquanto o jogo tem o VALOR (alíquota, verba). São camadas diferentes. Proposta: manter a alíquota antiga como alavanca e entrar a ficha como lei de cima (mãe), sem substituir. Ficha de cada uma:

- `agencia-de-inteligencia` ← ficha `agencia-de-inteligencia`
- `cameras-corporais` ← ficha `cameras-corporais`
- `fundo-seguranca-publica` ← ficha `fundo-de-seguranca-publica`
- `gasto-com-defesa` ← ficha `gasto-com-defesa`
- `imposto-grandes-fortunas` ← ficha `imposto-sobre-grandes-fortunas`
- `imposto-heranca` ← ficha `imposto-sobre-heranca`
- `imposto-renda-empresas` ← ficha `imposto-de-renda-das-empresas`
- `imposto-renda-pessoas` ← ficha `imposto-de-renda-das-pessoas`
- `imposto-sobre-consumo` ← ficha `imposto-sobre-consumo`
- `imposto-transacoes-financeiras` ← ficha `imposto-sobre-transacoes-financeiras`
- `investimento-em-infraestrutura` ← ficha `investimento-em-infraestrutura`
- `investimento-pesquisa` ← ficha `investimento-em-pesquisa`
- `piso-saude` ← ficha `piso-da-saude`
- `programa-espacial-e-satelites` ← ficha `programa-espacial-e-satelites`
- `vagas-em-presidios` ← ficha `vagas-em-presidios`
- `verba-policia-federal` ← ficha `verba-da-policia-federal`
- `vigilancia-epidemiologica` ← ficha `vigilancia-epidemiologica`

## 3. Grupos de pressão e segmentos

- Ligados: só nas leis ainda fora de vigor (21 reações, 37 efeitos em segmentos). Nas leis em vigor a ligação deslocou a pressão do turno 0 em até 14 pontos (a pressão é um estoque e a lei sobe de 0 no aquecimento); precisa de calibração própria.
- Ainda no jogo e a fusionar conforme as fichas: `frentes_esquerda`, `liberais_rua`, `conservadores_costumes`, `influenciadores_direita` (saem), `ruralistas` (entra em `agronegocio`), `neopentecostais` + `evangelicas_tradicionais` (viram "Igrejas evangélicas").
- Nomes de grupo das fichas sem par no jogo: `saida/grupos-sem-par.md` (os mais comuns abaixo).

- as 5 mídias (7 vezes)
- bancadas do congresso (5 vezes)
- universidades e cientistas (4 vezes)
- os dois polos (3 vezes)
- governadores e prefeitos (3 vezes)
- governadores (3 vezes)
- bancadas do governo (3 vezes)
- parte das casas de apostas (2 vezes)
- bancadas de partidos grandes (2 vezes)
- saúde pública (2 vezes)
- faculdades privadas (2 vezes)
- mídia internacional (2 vezes)

## 4. Motor

- Feito: `implantacaoTurnos` vira a velocidade de implantação (fração por mês que fecha 95% do caminho nos turnos da camada) nas leis sem `respostaTemporal` própria.
- Falta: faixa de valor como valor contínuo (hoje degraus), custo por opção na conta do orçamento (só alguns têm número em % do PIB), travas por opção (a ficha só traz texto: o campo `mae` guarda o texto e as leis citadas).

## 5. Efeitos e prova real

- Efeitos em número: todos hipótese (escala 0,03 / 0,07 / 0,12); ~76 efeitos de Economia e muitos nas outras áreas sem índice ou sem seta. Vão para `efeitos-NN.csv` quando a pesquisa chegar.
- Prova das votações reais: erro 0,167 (teto temporário 0,17, meta 0,13). A causa é global, não uma lei só (ver PLANO).
- Leis sem efeito em índice (leisSemModulacao): 94.

## 6. Mapa

- Feito: sem etiquetas fixas (nome grande no mouse), todas as leis entram (espiral de reserva), aba Filtros (popularidade no país/segmento e valor), bolhas de índice maiores e mais perto dos ministérios com as esferas fechadas, leis com tamanhos de 8 a 46 e cor por assunto.
- Falta: reposicionar as leis que se tocam; popularidade da lei só existe onde a ficha tem apoiam/rejeitam.
