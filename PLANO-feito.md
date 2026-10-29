# PLANO — o que já foi feito

Histórico tirado do PLANO.md em 29/out para ele ficar leve. Não abrir sem precisar.

## País em frases (item 2): fases 1–3

   - **Fase 1 feita** (28/out): 4 nós sem seta visível foram para `area: "Dados internos"`, a convenção que `nosForaDoMapa` já usava — sem código novo. Teste `paisEmFrases.test.ts` 7/7.
   - **Duas armadilhas registradas em teste.** `medida.tecnico` é "sem estatística real", **não** "esconder": filtrar por ela apagaria a aprovação do governo. E esconder um nó esconde as setas que passam por ele, porque a visão descarta ligação com uma ponta fora — comecei escondendo 11 e 7 eram explicação de bolha visível. O invariante `naoEsconderSeta` guarda a regra.
   - **Fase 2 (tom) aprovada** pelo autor em 28/out, com três frases refeitas. Decidido: comparação com o passado do próprio país; frase na frente e número ao abrir; o número entra na frase quando ele é a notícia (desmatamento em km²).
   - **O lote encolheu.** São três jeitos de ter frase e só um dá redação: função (porcentagem de gente, `emCada()` em `app/partida/frase.ts`), modelo com o número (quantidade que se entende sozinha) e faixa escrita (só índice e jargão: Gini, HHI, PIB em índice). A estimativa de ~440 frases redigidas cai para uma fração.
   - **Regra nova para os países:** `territorio.florestaMilKm2` em `paises/<pais>/pais.json`, com fonte (Brasil: 4.966 mil km², FAO 2020). Precisou entrar na lista de chaves previstas do cenário em `validateContentFile.ts`.
   - **Fase 3 feita** (28/out): `fraseDaBolha()` em `app/partida/frase.ts` escolhe o jeito, a visão entrega `frase` em cada bolha e a tela mostra — rótulo da bolha, `aria-label` e boletim. 55 das 192 bolhas ganham frase; o resto cai no número, de propósito. Teste `frase.test.ts` 14/14, `paisEmFrases.test.ts` 7/7.
   - **A fração tem teto de erro, e o sujeito tem de estar na unidade.** Sem o teto, 1% virava "um em cada doze" (o numerador nunca é zero); a folga é um décimo da distância até 0% ou 100%, e fora dela a bolha cai no número. E sem sujeito nomeado na unidade, "% da malha rodoviária em estado bom" virava "uma pessoa em cada três" — quem não casa a lista de `sujeitoDaUnidade()` não ganha frase. Quem conferiu foi o script `scripts/teste/frases-das-bolhas.ts`, não os testes: compilar não prova frase boa.
   - **O lote de redação saiu da mecânica** (decisão do autor, 28/out): as faixas escritas (Gini, HHI, PIB em índice) vão para a revisão manual jogando, bolha por bolha e lei por lei, junto com o resto do texto do jogo. Julgar frase sem ver na partida é o erro que custou a manhã de 28/out.
   - Falta só o número grande do boletim, que mostra pontos do motor ("39 / 100") em vez da medida real — regra 2.7. Não é conteúdo por bolha: a tela só converte quando `medida.convertida`, e a Informalidade já traz `medida.valor` 38,6 sem ser olhada (`escalaReal` em `ui/mapa/formatos.ts`). Uma função conserta todas.

## Grupos (item 3): camadas A, B e C

   - **A camada pesada já existe:** `paises/brasil/perfis.json` traz 2.090 perfis de 8 atributos com peso, e eles já chegam na partida (o congresso percorre em `tramitacao.ts`). Os 19 grupos da tela são uma projeção deles por 7 eixos. O SisGov já começa mais fino que o Democracy 4, que tem ~20 grupos chapados.
   - **O nó:** os perfis são `content` (fixos), não `game` (estado). Ninguém perde emprego, enriquece ou muda de valores. Mover os perfis para o estado é o que destrava tudo.
   - **Camada A feita** (29/out): a aba População mostra o censo — uma ficha por atributo, pizza até seis faixas e treemap acima disso (a Ocupação tem nove, e pizza de nove fatias vira borda). Cada faixa traz a frase do país em frases e a marca das que não têm grupo no mapa. `censo.ts` lê os perfis em ~7 ms; nada novo no estado. Rótulos em `mundo/populacao.json`. Testes: `censo.test.ts` 7/7 e `treemap.test.ts` 6/6 (área proporcional, sem sobra, sem sobreposição, nada fora da caixa).
   - **Duas tentativas descartadas antes dessa**, as duas por não se lerem: lista de barras simples, e "se o país fosse 100 pessoas" com cem figuras (virava borrão; o autor recusou os bonecos). A terceira é a que ficou. Paleta categórica validada por script (daltonismo, contraste, banda de luminosidade); a nona faixa não ganha cor nova — a cor dobra, o nome não.
   - **Risco diagonal nas faixas sem grupo foi tentado e tirado:** elas são as maiores (62% sem filhos, 57% de 30-59), então a tela virava listrado e dava alarme onde metade das ausências é proposital.
   - **Sem tendência, de propósito:** os perfis são fixos até a camada C, então "subiu desde o turno passado" seria mentira do tipo que o país em frases tirou das bolhas.
   - **Camada B feita** (29/out, commits ac9e6e9b..3e809069): cada perfil tem renda (repartida da massa salarial por ocupação × renda, com os multiplicadores normalizados para a média de quem trabalha fechar com `salario_medio`), imposto pela alíquota efetiva, benefício declarado na tabela, e sobra. O censo mostra quanto sobra por faixa; a prévia da lei diz no bolso de quem ela bate. Spec em [populacao.md](docs/jogo/mecanicas/populacao.md), plano em [docs/superpowers/plans](docs/superpowers/plans/2026-10-29-populacao-camada-b.md). Testes `bolso.test.ts` 18/18 e `censo.test.ts` 9/9. `npm run check` verde em 29/out: 116 arquivos, 595 testes. **Mas a revisão achou 1 problema grave e 3 sérios de modelo, que teste verde não pega — ver RETOMAR.md antes de seguir.**
   - **A contribuição sobre a folha não sai do bolso de quem trabalha:** é encargo do empregador, que o jogo já mostra em "Custo de contratar". Cobrá-la do salário levava a conta a 61% do que se ganha. Quem achou foi o script `scripts/teste/bolso-dos-perfis.ts`, não o teste.
   - **Revisão da camada B** (29/out, `scripts/teste/conservacao-do-bolso.ts`; feita pelo mesmo contexto que escreveu, não é independente): divisão por zero está guardada em todos os caminhos; o imposto de renda não é contado duas vezes; a média de renda de quem trabalha fecha com `salario_medio` (razão 1,000). Três limites, que a camada C herda: (1) a parte que trabalha nos perfis é fixa (64,7%) e a do motor (`ocupados`) se mexe, então a soma dos perfis só fecha com a massa salarial no ponto de partida; (2) 36% do consumo das famílias vem de lucros e não cai em nenhum perfil que trabalha, então a soma do imposto sobre consumo dos perfis fica abaixo da arrecadação; (3) o benefício paga imposto sobre consumo no bolso, mas o `consumo_familias` do motor não inclui benefícios.
   - **Camada C, emprego, implementada** (29/out, commits d6b76fbd..7f748fa4; `npm run check` verde em 29/out: 118 arquivos, 631 testes, 17,7 min; o item 3 segue aberto porque os Grupos não acabaram). O desemprego e a informalidade do motor movem o peso dos perfis, sem estado novo: `congressoVivo` (`game/congresso/vivo.ts`) é função pura de `valores` e do conteúdo, e o arquivo salvo não muda. Quem perde o emprego sai por vulnerabilidade (ocupação × renda × idade, em `mundo/populacao.json`) e vira linha gêmea `desempregado`; a informalidade desloca peso carteira↔informal só entre gêmeos. Valor novo `grupo_desempregados` (peso na eleição e no Congresso via `pacoteVivo`); seguro-desemprego só para ex-carteira; o censo mostra a variação em pontos desde o início. Testes: `congressoVivo.test.ts` 19, bolso/censo/treemap 47, grupos/eleição/tramitação/população 66. Script: `scripts/teste/emprego-dos-perfis.ts`. Spec e plano em `docs/superpowers/`. Corrigiu junto os limites 1 a 3 da revisão da camada B (a soma dos perfis agora fecha com o motor).
   - **Revisão independente da camada C** (29/out, subagente): nada quebra, nada vira NaN, a conservação fecha e as linhas do eleitorado vivo estão alinhadas. Dois achados importantes, corrigidos: o seguro no bolso agora segue o nível da lei do seguro-desemprego (`4c76b242`; a curva fica duplicada na tabela de fontes, presa por teste), e o salário do perfil segue a régua do eleitorado do início, sem aumento fantasma quando a informalidade sobe (`e194a985`, decisão do autor). Custo aceito: com outra composição, o imposto de renda dos perfis sai até ~0,03% da arrecadação, porque o motor não baixa `salario_medio` com a informalidade.

## Orçamento (B1–B6)

- [x] B1. Auditar o gasto inicial por relação (`npx vite-node scripts/economia/auditar-gastos.ts`, 26/out): 31,08% do PIB no próximo mês, base 0; relações sem lei contribuem 0 no estado inicial. O problema é a falta de contas próprias: previdência 6,46%, educação 5,55%, saúde 4,34%, defesa 1,60%, transferência de renda 1,40%, seguro-desemprego 0,41% e pensões 0,50% saem de efeitos agregados das leis. Não há conta de quantidade × salário dos servidores; Estabilidade dos servidores acrescenta 0,40%, mas não representa a folha.
- [x] B2. Substituir os efeitos agregados pelas contas do documento aprovado: servidores (duas leis), aposentadorias, pensões, seguro-desemprego e renda de idosos; contribuição sobre salários já virou imposto próprio na fase 3. Taxas e tarifas também viraram lei. Auditoria inicial após a mudança: 32,19% do PIB no mês seguinte, soma das relações igual ao gasto calculado.
- [x] B3. Fundo soberano com o destino da sobra (comanda o cofre, 28/out): as
      duas leis ficam separadas (uma pergunta cada, decisão 1) e ambas comandam o
      cofre — "Destino da sobra" reparte sobra entre dívida e cofre, "Fundo
      soberano" aplica o cofre. Tirado o teto de 10% do PIB do cofre: o fundo
      cresce sem limite. Teste `cofre.test.ts` 9/9.
- [x] B4. PIB em reais (`pib_nominal`) e verbas nominais: índice de preços reduz seu poder de compra nos efeitos não fiscais, com comparação anual na janela da lei. A verba só muda nominalmente por ação do jogador.
- [x] B5. Custo do salário mínimo nos benefícios (28/out): coeficiente 0,029 →
      0,08 (R$ 400 mi por R$ 1) nas **duas** consequências gêmeas do mínimo —
      `gasto_publico` (custa de verdade) e `deficit_previdenciario` (indicador);
      mudar só uma faria o indicador mentir 2,8× sobre o orçamento.
      `termoConstante` → −5,28 para o efeito seguir zerando no mesmo ponto
      (mínimo relativo 66).
- [x] B6. Aceite (28/out): `scripts/economia/aceite-equilibrio.ts` roda as 13
      estratégias da seção 6 de `equilibrio.md` e imprime esperado × obtido (é
      relatório, não teste que falha). `contasSemFuros` "cofre passa de 100%"
      religado e verde, agora que o cofre não tem teto. `npm run check` verde em
      28/out (111 arquivos, 541 testes).
      **Medição de referência para o item 10** (cenário "Nada muda", 8 anos):
      dívida 138,4% contra 119 do desenho; PIB real 91,7 contra 114 — o PIB real
      **cai** 8% sem o jogador agir. É o mesmo achado de 22/out (atividade 44,7 →
      39,7) com número comparável ao documento, não um defeito novo.

