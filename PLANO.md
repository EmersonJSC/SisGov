# PLANO do SisGov

> **Status: VIGENTE.** Documento mestre e única fonte de status.
> Reescrito do zero em 21/out/2026. O plano antigo está na branch `gpt/estrutura-docs`.

## 1. Visão
_(a escrever com o autor)_

## 2. Escopo
O escopo completo do jogo está em [docs/jogo/escopo.md](docs/jogo/escopo.md).
Aqui fica só o resumo do que entra e do que não entra na versão atual.

## 3. Onde está cada coisa
| Assunto | Documento |
| --- | --- |
| O que é o jogo | [docs/jogo/escopo.md](docs/jogo/escopo.md) |
| Regras das leis | [docs/jogo/mecanicas/leis.md](docs/jogo/mecanicas/leis.md) |
| Como trabalhamos | [docs/engenharia.md](docs/engenharia.md) |
| Como o código funciona | [docs/arquitetura/](docs/arquitetura/) e `src/engine/*.md` |

## 4. Marcos

**Como trabalhamos (21/out):** uma mecânica por vez. Para cada uma:
documentar, o autor aprovar, implementar o máximo possível com testes,
`npm run check` verde e commit. O que depende de outra mecânica fica para
ela. **Primeiro o motor e o jogo (`src/engine`, `src/game`, `src/app`);
a tela (`src/ui`) fica mais para o final.**

| # | Mecânica | Documento | Implementação |
| --- | --- | --- | --- |
| 1 | Tempo | pronto | em andamento |
| — | **Índice de conteúdo** (fonte única em YAML; gera os JSONs) | formato aprovado | a fazer |
| — | **Reforma das leis** (auditoria e reescrita em lotes) | desenho das 11 áreas em `docs/jogo/leis/` (21/out), aguardando aprovação do autor | a fazer |
| 2 | Leis | pronto | a fazer |
| 3–15 | demais | a escrever | a fazer |

### Reforma das leis (21/out)

1. **Índice de conteúdo:** converter tudo para o índice e provar que gerar
   de volta dá zero diferença.
2. **Auditoria:** cada uma das 242 leis recebe nota nos critérios de
   [leis.md 2.3](docs/jogo/mecanicas/leis.md#23-como-uma-lei-deve-ser) e um
   destino: manter, reescrever, dividir, juntar ou remover.
3. **Reescrita em lotes, uma área por vez** (molde de 22/out, abaixo): primeiro a lista de leis
   do ministério (o autor aprova), depois o detalhe de cada uma (opções,
   efeitos, bússola, programas reais), gerar, testes.

### Economia: fase 2 (a fazer)
- Juntar: imposto-sobre-a-propriedade em Imposto sobre imóveis; destino-do-resultado-fiscal no Fundo soberano; incentivos-fiscais-regionais nas Zonas econômicas especiais (empresas)
- Converter em faixa: Meta de resultado das contas, Isenções fiscais, Meta de inflação, Juros básicos (com a regra "só o governo mexe se o banco central for subordinado")
- Leis novas que pedem recalibrar a arrecadação: Imposto sobre veículos, Contribuição sobre os salários, Isenção do imposto de renda (e Salário e quantidade de servidores, em governo)
- Leis novas com mecânica nova: Dívida pública (moratória), Imprimir dinheiro, Teto para os juros dos bancos
- Exclusões da economia (regra 11) no código

### Achados da simulação de 22/out (`scripts/teste/ideologias.ts`)
- **Nada muda, 32 turnos:** dívida 82% → 166% do PIB; resultado nominal −6,6% → −17,6%; índice de atividade 44,7 → 39,7. A dívida explode rápido demais (o desenho em `equilibrio.md` prevê ~119% em 8 anos).
- **Social-democrata cortando gastos:** dívida 82% → 232%; atividade 44,7 → 19,2 (−57%); desemprego 6,2% → 10,2%. Cortar gasto derruba a economia muito mais do que deveria, e a dívida piora em vez de melhorar.
- Conclusão: a calibragem fiscal da rede está fora do alvo de `docs/jogo/leis/equilibrio.md`; entra na mecânica 4 (orçamento), antes de qualquer conteúdo novo de economia.

### Molde das leis (22/out, proposta)
- Desenho: [molde-das-leis.md](docs/jogo/mecanicas/molde-das-leis.md), aprovado em 22/out. Plano: [2026-10-22-molde-das-leis.md](docs/superpowers/plans/2026-10-22-molde-das-leis.md).
- Limite de 8 a 12 leis por área: só aviso até o autor decidir Contas públicas.
- [x] Verificador do molde (teste)
- [x] Inventário das leis por área nova (`npm run leis:inventario` → docs/jogo/leis/inventario.md)
- [x] Áreas por assunto no país; família lida da lei, não adivinhada
- [x] Catálogo no formato v4: **221 de 239 leis** nas 11 áreas e as 2 pétreas (22/out), sem mudar nenhum número (foto de todos os valores a cada área). Dados de cada área em `scripts/leis/molde/`.
- [x] Destinos aprovados e aplicados (22/out): 15 leis saíram; 224 leis no jogo, 223 no molde v4 (falta só Destino da sobra, mecânica 4)
- [ ] Separar Segurança e defesa em duas esferas (Segurança e justiça; Defesa e exterior): aprovado pelo autor
- [ ] Mecânica 4: juntar "Destino da sobra" ao fundo soberano (comanda o cofre) e tirar a contribuição sobre salários de dentro da previdência para uma lei própria
- [ ] Depois, com amostra em HTML: mapa em faixas e filtro; janela da lei; eleitorado em janela

### Mudanças de código já decididas no escopo
- [ ] Tirar os limites por lei e por país das leis de valor (controle livre de 0 a 100%), inclusive o teto de 3×/4× o valor atual em `faixaNumerica` (`src/ui/mapa/Documentos.tsx`)
- [ ] Trava única: soma dos gastos ≤ 100% do PIB; gasto acima da arrecadação vira déficit e dívida
- [ ] Rever as leis de escolha: liberar todas as opções e converter em valor onde couber
- [ ] Jogador como partido (não presidente); partida começa com o partido recém-eleito
- [ ] Desgaste do partido: sobe sempre por baixo, opinião segura, queda em escândalo, crise ou eleição
- [ ] Índices essenciais como número único: criar industrialização, padrão de vida composto, população real (natalidade, mortalidade, saúde, migração), radicais e lealistas
- [ ] Tempo corrido: calendário em semanas, pausa, velocidades, números deslizando, acontecimentos datados e pausa automática (motor segue mensal)
- [ ] Mecânica 4: gasto fixo da rede (~30% do PIB) que nenhuma lei controla; reativar o teste `contasSemFuros` "cofre passa de 100%"
- [ ] Mecânica 2: pisos de saúde e educação ainda têm teto de 40% (trava a tirar)
- [ ] Exclusão entre leis: lei declara quais não podem estar em vigor junto; aprovar pede revogar a outra
- [ ] Retirar o STF: mudança em pétrea gera reação do Senado e da população

## 5. Chamados (status)
_(a definir)_

## 6. Decisões

- **Jogabilidade acima de empirismo (21/out).** Dados reais são base, não
  amarra. A regra antiga "número sem fonte é hipótese marcada" deixa de valer.
  Lei inventada entra se tiver ligação com o mundo real. Ver [leis.md](docs/jogo/mecanicas/leis.md#29-como-escrever-uma-lei-nova).
_(as decisões antigas D-NN serão revistas; só entram aqui as que continuam valendo)_

## 7. Pendências da limpeza de 21/out
- [ ] `npm install` e `npm run dev` no terminal do autor
- [ ] Decidir sobre `arte-originais/` (53 MB) e `dados/` (155 MB)
- [ ] Opcional: `git gc`
- [ ] Corrigir links para `docs/fichas/` (não existe mais) em 3 documentos
