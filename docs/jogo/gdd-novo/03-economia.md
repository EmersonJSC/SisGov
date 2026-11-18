# III. Economia (rascunho do GDD novo)

Rascunho de 14/nov/2026. Só junta o que já está decidido e espalhado. Nada
inventado: o que faltou está marcado **ESTUDAR** ou "Em aberto". Cada frase
traz a fonte entre colchetes, com a linha. Conflito entre fontes aparece como
**⚠ CONFLITO**, com as duas versões e as datas, sem escolher.

Abreviações das fontes: `gdd.md` = docs/jogo/gdd.md; `mecanicas.md` =
docs/jogo/mecanicas.md; `requisitos.md` = docs/jogo/requisitos.md;
`mercado.md`, `calculos.md`, `contas.md`, `fisco.md`, `moradia.md`,
`saneamento.md` = src/motor/<pasta>/<nome>.md; os `.tsv` estão em
docs/jogo/gdd-novo/fontes/; `vic3-ref` = docs/jogo/mercado-vic3-referencia.md;
`estudo-vic3-d4` = docs/jogo/estudos/victoria3-e-democracy4.md;
`pesquisa` = docs/jogo/estudos/pesquisa-jogadores-14nov.md.

---

## III.0 A Economia em poucas linhas

- **O que o jogador faz:** cria as condições (imposto, juro, regra, verba,
  propriedade) e, como Estado, compra, vende e patrocina. Quem produz e constrói
  é a economia. [gdd.md:1275-1277]
- **Um dos três pilares:** a Economia é tão importante quanto População e
  Governo. Ela paga os pops e o Estado, e é controlada pelos dois. [gdd.md:1279-1280]
- **O ciclo:** População, Economia e Governo controlam uns aos outros, com a
  População no centro. [gdd.md:66-69] A população trabalha, consome e investe; a
  economia paga salário, dá emprego e define preços; a economia gera o dinheiro
  dos impostos; o governo cobra, gasta e regula por lei. [gdd.md:71-78]
- **A bolsa é onde o ciclo vira preço:** lei muda lucro, lucro muda a ação, a
  ação muda o patrimônio dos pops, e os pops reagem no voto e no investimento. [gdd.md:83-84]
- **Mundo não é pilar:** outros países, comércio e preços de fora pressionam os
  três. [gdd.md:82]
- **A lei não diz quem gosta dela (14/nov):** diz onde mexe no dinheiro e na vida
  (quem paga, quem recebe, que preço sobe, que emprego abre). O motor calcula o
  efeito em cada pop. [mecanicas.md:47-49]
- **Toda lei chega ao pop** por renda, emprego, preço, serviço ou direito.
  [gdd.md:131-132]
- **Modelo de base (14/nov):** o do Victoria 3 (prédios, bens, mercados, pops com
  emprego, salário e padrão de vida), atualizado para hoje (serviços, informal,
  crédito, banco central). [mecanicas.md:261-264]
- **Levar do Victoria 3:** pop no centro (prédio sem gente não produz);
  necessidades atendidas por vários bens, com preferência; padrão de vida; padrão
  caindo ou desemprego radicaliza; riqueza dá peso político; dono recebe o lucro e
  investe parte; impostos por tipo de base; déficit vira dívida. [mecanicas.md:266-270]
- **Mudar em relação ao Victoria 3:** o dinheiro se conserva (lá os bens surgem
  do nada e a sobra é vendida "ao vazio"); ciclo econômico e crise (lá não há); o
  jogador não constrói prédio (lá virou "jogo de construção"). [mecanicas.md:271-274]
- **Atualizar para hoje** (lá não existe, nada a copiar): serviços como setor
  maior, trabalho informal, crédito e bancos, banco central e inflação, economia
  digital, capital entrando e saindo do país. [mecanicas.md:275-277]
- **Ordem decidida (14/nov):** primeiro o dinheiro (caminho e conservação), depois
  o gosto pelo bolso, depois a revisão das leis instituição por instituição.
  [mecanicas.md:62-64]
- **Hoje no motor (conferido em 14/nov):** a satisfação do grupo lê renda,
  índices cobrados e bússola das leis; o bolso só se mexe por imposto de renda e
  transferência; a verba gasta não chega a ninguém, exceto a transferência.
  [mecanicas.md:56-60]

**Glossário curto da Economia (08/nov):** Companhia é a dona, com ações, reserva
de investimento e várias empresas. [gdd.md:1294] Empresa é a parte de uma
companhia em um setor, um conjunto de prédios. [gdd.md:1295] Prédio é a unidade
que produz ou presta serviço. [gdd.md:1296] Obra é o ato de construir um prédio
novo, na fila da construção civil. [gdd.md:1297-1298] Órgão é o mesmo que
instituição: recebe a verba por lei e executa; o jogador dá a verba, não escolhe
fábrica nem fazenda. [gdd.md:1299] Ação (cota) dá dividendo, não dá mando. [gdd.md:1300]
Estatal é empresa cujo dono é o Estado. [gdd.md:1301] Serviço do Estado é prédio
do Estado fora do mercado. [gdd.md:1302] (O glossário completo vai ao Anexo.)

---

## III.1 Mercado e produtos

**1. O que é**
O mercado é onde setores e produtos do mundo têm oferta, demanda e preço, no
país e no mundo. [gdd.md:1304-1313]

**2. O que o jogador faz e sente**
- Não existe lei que dê lucro à carne ou ao aço. As leis mexem em todas as
  empresas, na demanda ou no custo, e a cadeia espalha o efeito. Subsídio para
  comprar máquinas aquece máquinas e, junto, o aço; o Bolsa Família faz as
  famílias comprarem alimento. [gdd.md:1314-1318; memória feedback_mercado_indireto]
- Sente o preço e a falta: o que chega a cada pop depende de quanto há, de quanto
  custa e de quem pode pagar; falta de comida vira fome. [gdd.md:1319-1320]
- Vê o mercado na janela "Mercado": produtos por setor, o que o país produz,
  importa (e de quem) e exporta; a aba Mundo mostra preço, seta de alta ou baixa e
  quem vende mais barato. [mercado.md:31-33, 53-56]

**3. Peças**
- **Setores:** 15, aprovados em 05/nov. Setor separa atividade, nunca tipo de bem:
  quem compra luxo é um pop, não um setor. [gdd.md:1306-1307] Lista dos 15 com a
  seção da ONU, prédios e pops que trabalham ali. [leis - Economia - setores.tsv:2-16]
- **Produtos** agrupados em setores, com cadeia entre eles (aço, máquinas,
  veículos). A cadeia liga uma empresa à outra na bolsa: lei que encarece o aço
  derruba o lucro da montadora. [gdd.md:1308-1311]
- **Dois mercados:** o do país e o do mundo, com ciclos e choques. O país produz
  uma parte e compra o resto. [gdd.md:1312-1313]
- **Cobertura:** quanto da demanda do país a produção atende. Passa a ser
  resultado (produção ÷ demanda), não número declarado. [mercado.md:22-27, 125]
- **Preço do mundo** (base 100, entre 40 e 250): anda 25% do caminho até o alvo
  por turno, mais ruído pequeno. [mercado.md:46-52]
- **Preço do país:** faixa de 25% a 175% do preço base, misturada com o preço do
  mundo conforme a importação. [mercado.md:126-130]
- **Ciclo e choque:** a demanda do mundo ondula (24 turnos = 4 anos); choques de
  preço somem aos poucos. [mercado.md:81-95]
- **Cestas e fome:** comida e remédios são as duas cestas em código; a segurança
  alimentar sai do gasto com comida e da falta. [mercado.md:113-119, 143-152, 187-197]
- **Prédios à vista, sem simular um a um:** o produto declara uma unidade (ex.:
  "fazendas") e a tela mostra "≈ N unidades". [mercado.md:131-133]

**4. Regras decididas**
- 02/nov: setores e produtos são do mundo; o motor não conhece nomes. [mercado.md:3-5, 9-18]
- 02/nov: o país declara cobertura por produto; o mundo declara quem fornece;
  importa = o que falta para 100, exporta = o que passa de 100. [mercado.md:20-30, 35-45]
- 02/nov: dois mercados, preço do mundo por oferta e demanda, choque com 2% de
  chance por produto e por turno. [mercado.md:46-52, 78-95]
- 02/nov: demanda de comida = população × cesta; Grãos, Frutas e Alimentos
  atendem a mesma necessidade e o pop troca pelo preço. [mercado.md:104-119]
- 02/nov: segurança alimentar = 100 − gasto com comida − falta; fome leve abaixo
  de 40 e grave abaixo de 20 (pontos de partida). [mercado.md:143-152]
- 02/nov: o índice abastecimento (0 a 100) é cobrado pelos grupos; fome grave
  derruba saúde e reputação, abastecimento melhor faz o contrário. [mercado.md:154-169]
- 08/nov: o mercado se move por demanda e custo, nunca por lei de produto.
  [gdd.md:1314]
- 14/nov: produto que falta vem do mercado do mundo (de quem tem sobra) ou fica
  faltando (preço sobe, fome, fila); nunca aparece do nada. A sobra é vendida a
  alguém ou fica parada; nunca vai "ao vazio". [mecanicas.md:301-303]
- 14/nov: pop compra o que precisa e paga imposto; cada necessidade é atendida por
  vários produtos com preferência e regras próprias (energia de casa:
  eletricidade, gás ou lenha; lenha quando a luz falta ou encarece). [mecanicas.md:304-307]
- 14/nov: o preço é calculado uma vez por turno (2 meses). [pedido do autor nesta
  rodada, sem linha em arquivo; o que está escrito é o preço andar 25% do caminho
  por turno, mercado.md:49-50]
- Sem data: setores com regra própria são moradia, remédios e militar (demanda
  pelo tamanho das forças). [gdd.md:1325-1326]

**5. Ligações**
- Gosto/população: demanda dos pops; fome e carência mexem em saúde, pobreza e
  apoio dos grupos pobres. [mercado.md:154-169, 189-197]
- Leis: tarifa, subsídio, custo e demanda (nunca preço ou lucro direto). [gdd.md:1314-1318]
- Mundo: potências com sobra fornecem o que falta; preço do mundo vem delas; o
  Mundo pressiona preço, comércio e sanção. [mercado.md:22-28, 46-52; gdd.md:82]

**6. Referências**
- Victoria 3: preço sobe quando a compra passa da venda; fórmula
  `base × [1 + 0,75 × clamp(...)]`, entre 25% e 175%. [vic3-ref:11-15, 34-39]
- Victoria 3: falta e sobra (perda de produção na falta grande). [vic3-ref:60-68]
- Pesquisa de jogadores: preço por oferta e procura sem estoque. [pesquisa:62-63]
- Estudo da ONU (ISIC) para os setores. [leis - Economia - estudos.tsv:2]
- Crítica ao Victoria 3: bens criados para cobrir falta e sobra vendida "ao vazio".
  [pesquisa:73-75]

**7. No motor hoje**
- Feito: produtos em setores, mercado do país e do mundo (R16.1 ✅) e demanda dos
  pops com fome (R16.2 ✅). [requisitos.md:353-354]
- Feito: ciclo de 4 anos e choques no preço do mundo (fatia 5a). [mecanicas.md:298-300]
- Feito: preço do país e do mundo "funciona"; 23 produtos em 7 setores. [leis -
  Economia - como funciona.tsv:15-16]
- Pela metade: cadeia entre setores (R16.5 ◐). [requisitos.md:357]
- Pela metade: demanda só da cesta de comida e de remédio, sem demanda por setor.
  [leis - Economia - como funciona.tsv:17]
- Falta: setores com regra própria (R16.6 ☐). [requisitos.md:358]
- Falta: os outros 18 produtos com a mesma regra da comida. [mercado.md:211]

**8. Em aberto**
- Os 15 setores aprovados contra os 7 do motor (essenciais, infraestrutura,
  indústria, tecnologia, militar, luxo, construção civil): o estudo diz que Luxo e
  Essenciais são tipo de bem, não atividade. [mercado.md:14-16; leis - Economia -
  estudos.tsv:2; gdd.md:1306-1307]
- Ciclo e crise "de verdade" só quando o mundo tiver países funcionando.
  [mecanicas.md:307-308]
- Pesos 0,5 / 0,2 / 0,3 e cesta de 12% da renda são pontos de partida a ajustar
  medindo. [mercado.md:140-141]
- "Marcas na régua" e outros números de calibração seguem a regra de ordem de
  grandeza, sem precisão empírica. [gdd.md:119-120]

---

## III.2 Empresas, prédios e obras

**1. O que é**
Prédio é a unidade que produz, emprega e dá lucro; empresa é um conjunto de
prédios de um setor; obra é o ato de construir prédio novo. [gdd.md:1294-1297,
1380-1385, 1450-1451]

**2. O que o jogador faz e sente**
- O jogador não constrói prédio: a lei dá condição e a economia constrói.
  [mecanicas.md:273-274] Ele vê os prédios em conjunto ("≈ N fazendas"). [gdd.md:1380-1382]
- Dá a verba e escolhe as leis; o órgão age sozinho. [gdd.md:1299; memória feedback_orgaos_e_verba]
- Sente o PIB subir quando uma obra termina e cair quando um prédio fecha.
  [gdd.md:1383-1384] Sente corrupção que atrasa e encarece obra. [gdd.md:1390]

**3. Peças**
- **Prédio:** produz, emprega e dá lucro; o PIB é a soma do que os prédios
  produzem; as bases dos impostos saem dos prédios e dos pops. [gdd.md:1380-1385]
- **Método de produção** (insumos, produto, empregos). [leis - Economia - como funciona.tsv:3]
- **Insumos e cadeia:** um prédio compra do outro (aço vira máquina). [leis -
  Economia - como funciona.tsv:4] Lista de prédios por setor, o que produzem e
  usam, quem emprega e se pode ser terceirizado. [leis - Economia - prédios.tsv:1]
- **Empresa e companhia:** o país declara as de partida. [gdd.md:1450-1451]
- **Obra e fila:** cada tipo tem custo e prazo; obra difícil pesa mais; a
  construção civil decide quantas andam ao mesmo tempo. [gdd.md:1386-1389]
- **Verba de obra separada (07/nov):** a verba de cada área mantém o que existe
  (salários e insumos); construir é a Verba de construção, dividida em 100% entre
  as áreas, na instituição Infraestrutura e transporte. Prédio pronto sem verba da
  área fica vazio. [gdd.md:1391-1395]
- **Desgaste e fechamento:** prejuízo por vários turnos fecha o prédio e demite.
  [gdd.md:1446; leis - Economia - como funciona.tsv:14]
- **Prédio precisa de gente;** o desemprego sai daí. [gdd.md:1401-1403]
- **Terceirizar** por lei o que aceita terceirização (segurança, presídios,
  hospitais, escolas). [gdd.md:1399-1400]

**4. Regras decididas**
- 03/nov (construções, pilar 1): capacidade por setor; desgaste de 4% ao ano;
  investimento privado abre obras; juro acima do equilíbrio tira 8% por ponto;
  imposto sobre lucro acima do turno 0 tira 3% por ponto; construção civil limita
  o volume (1,5× o ritmo do turno 0). [mercado.md:380-395]
- 03/nov: corrupção alonga o prazo (até 2×) e encarece a obra (até +50%).
  [mercado.md:394-395]
- 03/nov: o investimento vai para onde a margem melhorou; 3 turnos seguidos de
  prejuízo tiram 5% da capacidade por turno; setor do Estado nunca fecha.
  [mercado.md:397-407]
- 07/nov: verba de obra separada da verba de manutenção. [gdd.md:1391-1395]
- 14/nov: o investimento sai do lucro do dono; é ele que abre as obras (hoje sai
  de uma conta, sem dono). [mecanicas.md:337-339]

**5. Ligações**
- Gosto/população: sem trabalhadores com a formação certa o prédio produz menos;
  quem não acha vaga vai para Desempregados. [gdd.md:1401-1403]
- Leis: corrupção, juros, imposto sobre lucro e a lei Prioridade das obras.
  [mercado.md:389-395; gdd.md:1780-1782]
- Mundo: insumo vem do país ou de fora, conforme a oferta nacional. [leis -
  Economia - como funciona.tsv:23]

**6. Referências**
- Victoria 3: prédio com método de produção; produtividade e saldo; vazão; lucro
  vai ao caixa e a dividendos. [vic3-ref:127-142]
- Pesquisa de jogadores: prédio sem pop não faz nada; métodos de produção definem
  insumo, produto e emprego. [pesquisa:58-62]
- Crítica: o Victoria 3 virou "jogo de construção" e barra de progresso.
  [pesquisa:76-78]
- Estudo "Prédios e lucro", Victoria 3: vira prédio, dono e reserva, sem copiar
  nomes ou números. [leis - Economia - estudos.tsv:3]

**7. No motor hoje**
- Pela metade: capacidade por setor, desgaste, investimento que abre obras, fila,
  corrupção que atrasa, lucro por setor e fechamento. É por setor, não por prédio.
  [mecanicas.md:314-318; leis - Economia - como funciona.tsv:2, 12-14]
- Falta: prédios produzem, empregam e dão lucro, PIB é a soma (R16.7 ☐); obra com
  custo e prazo por tipo (R16.8 ☐); corrupção atrasa e encarece (R16.10 ☐).
  [requisitos.md:374-377; mecanicas.md:319-322]
- Pela metade: empresas declaradas pelo país (R16.11 ◐), sem prédios; 5 empresas
  de teste. [requisitos.md:381; leis - Economia - como funciona.tsv:20]
- Falta: ligar ao pop. A renda do pop ainda é parte fixa do PIB; demissão, salário
  e lucro do setor não chegam a ele (fatia 5b, adiada). [mecanicas.md:319-320]
- ⚠ Nota de estado: a mesma obra aparece "já tem" por setor em mecanicas.md:314-318
  e ☐ em requisitos.md:375,377 (por prédio). É granularidade, não regra.

**8. Em aberto**
- Custo e prazo de cada tipo de obra (números). [gdd.md:2139]
- Duas filas (pública e privada) na mesma capacidade, lei Prioridade das obras.
  [mecanicas.md:323-324]
- Como o jogo divide a verba de um órgão em pessoal, compras e obras: a divisão
  não é fixa e falta definir como calculá-la. [pedido do autor nesta rodada, sem
  linha em arquivo; ligado a mecanicas.md:526-531]

---

## III.3 Trabalho e salário

**1. O que é**
Cada prédio pede pops com um nível de qualificação (elementar, operacional,
técnico, superior) e paga um salário que nasce do piso do pop, da disputa por
gente, do lucro e das leis. [gdd.md:1417-1422; leis - Economia - trabalho.tsv:2-3]

**2. O que o jogador faz e sente**
- Mexe nas leis de trabalho (salário mínimo, participação nos lucros). [gdd.md:1436-1437]
- Piso legal e negociação coletiva seguram quedas e aproximam salários. [gdd.md:1420-1421]
- Sente desemprego e informalidade: sem vaga, a pessoa vai para Desempregados,
  Informais ou Autônomos. [gdd.md:1425]

**3. Peças** (modelo de 7 passos) [leis - Economia - trabalho.tsv:15-21]
1. **Piso do pop:** a qualificação define o salário base e quem ocupa a vaga.
2. **Disputa por gente:** falta de qualificados sobe o salário; sobra segura.
3. **Teto pelo lucro:** o lucro limita a alta; prédio muito lucrativo paga bônus
   pequeno.
4. **Lei e negociação:** piso legal e sindicato seguram quedas.
5. **Queda lenta:** o salário cai devagar; antes de cair muito, o prédio demite.
6. **Formação:** salário alto atrai estudo e, depois de anos, mais gente qualificada.
7. **Estado disputa:** salário público é por lei, mas salário baixo perde gente
   para o privado.

Peças da planilha: vaga por pop e por nível; piso (salário mínimo só vale para o
emprego formal, alto demais empurra para o informal); desemprego; informal;
falta de gente (vaga aberta reduz produção); formação; salário público;
gente disponível (entra quem se forma e quem vem de fora; sai quem se aposenta,
emigra ou muda de setor; vagas são por pop, não por profissão). [leis -
Economia - trabalho.tsv:2-14, 22] Tabela de qualificação por pop (nível, anos de
formação, salário base × piso, força para negociar, vínculo). [leis - Economia -
qualificação.tsv:1-19]

**4. Regras decididas**
- Sem data na fonte: o salário cai devagar. [gdd.md:1422]
- Sem data na fonte: vagas são por pop, não por profissão (decisão do autor).
  [leis - Economia - trabalho.tsv:22]
- Sem data na fonte: desemprego e falta de gente são "conserto aprovado". [leis -
  Economia - trabalho.tsv:10, 12]
- Salário público é por lei, mas se ficar baixo o Estado perde gente. [gdd.md:1423-1424]

**5. Ligações**
- Gosto/população: a renda do pop vem de salário, lucro, aluguel e transferência
  (R16.26). [requisitos.md:400]
- Leis: salário mínimo, jornada, sindicatos; encargo alto empurra para o informal.
  [leis - Economia - lucro.tsv:5; leis - Economia - trabalho.tsv:11]
- Mundo: vem gente de fora e sai gente por emigração. [leis - Economia - trabalho.tsv:22]

**6. Referências**
- Victoria 3: prédio com vaga aumenta salário até o lucro acabar; com prejuízo
  reduz. [leis - Economia - estudos.tsv:18; leis - Economia - trabalho.tsv:6-7]
- O Victoria 3 não explica como o salário é fixado; não copiar o que não se sabe.
  [vic3-ref:141-142, 157-158]
- OIT: quatro níveis de habilidade; renda do trabalho em cerca de 52% do PIB
  mundial. [leis - Economia - trabalho.tsv:3; leis - Economia - estudos.tsv:10]
- Lucro maior aumenta salário, efeito pequeno (Blanchflower e outros); acordo
  coletivo reduz a diferença (Mannheim). [leis - Economia - estudos.tsv:19-20]
- Salário mínimo mexe pouco no emprego total em países em desenvolvimento (Fang e
  Ha). [leis - Economia - estudos.tsv:34]

**7. No motor hoje**
- Falta quase tudo: falta de trabalhador freia a produção e o desemprego sai daí
  (R16.27 ☐); contratação por qualificação (R16.37 ☐). [requisitos.md:401, 403;
  mecanicas.md:326-329]
- Pela metade: informal (parte com Seguro na folha) e formação (mudar de setor
  existe). [leis - Economia - trabalho.tsv:11, 13]
- Hoje o emprego é medido a partir da renda dos pops; nada contrata. [leis -
  Economia - como funciona.tsv:5; mercado.md:59-76]

**8. Em aberto**
- Quanto falta de trabalhador freia a produção. [gdd.md:2128]
- Quanto o salário cai devagar antes de o prédio demitir. [mecanicas.md:330-331]
- Como a renda do pop sai de salário e lucro sem o turno 0 mudar de valor.
  [gdd.md:2127; mecanicas.md:210]
- Quando alguém sai: o que leva à informalidade, à fuga de dinheiro e à emigração.
  [gdd.md:2130]

---

## III.4 Lucro e donos

**1. O que é**
O lucro é o que sobra da receita do prédio depois de insumos, salários, encargos,
desgaste, juros e imposto; ele vai para o dono, que gasta uma parte e investe
outra. [gdd.md:1429-1432; mecanicas.md:337-339]

**2. O que o jogador faz e sente**
- Mexe no lucro só por leis gerais (imposto sobre lucro, remessa, salário mínimo,
  dividendos), nunca num produto. [leis - Economia - lucro.tsv:2-14]
- O Estado patrocina: lei de incentivo, crédito barato ou obra pública puxa o
  investimento privado para um setor sem o Estado ser dono. [gdd.md:1462-1463]
- Sente lucro concentrado nos donos, lucro que sai do país, estatal que devolve ao
  cofre. [leis - Economia - donos.tsv:2-5]

**3. Peças**
- **Caminho do lucro, 14 passos** (exemplo com receita de 100): vender (100);
  comprar insumos (−40); valor adicionado (a soma de todos é o PIB); pagar salários
  (−30); encargos (−5); guardar para o desgaste (−6); pagar juros (−3); lucro antes
  do imposto; imposto sobre lucro (−4); lucro líquido (12); reinvestir (−7,8);
  pagar dividendo (−4,2); virar renda do pop; abrir nova obra. [leis - Economia -
  lucro.tsv:2-15]
- **Dono:** Estado, privado nacional, estrangeiro, cooperativa ou entidade sem
  lucro (igrejas e beneficentes); a fé vive nos grupos, o jogo não tem religiões com
  nome. [gdd.md:1452-1455]
- **Para onde vai o lucro:** privado nacional (investidores e reserva);
  estrangeiro (sai do país, pela lei de remessa); estatal (cofre); cooperativa
  (trabalhadores); mista (por cotas); conta própria (renda mista). [gdd.md:1438-1445]
- **Quadro de donos** (reinvestimento, lucro, ganho e custo de cada tipo, com
  empresa na bolsa, serviço do Estado e entidade sem lucro). [leis - Economia -
  donos.tsv:1-10]
- **Reserva de investimento:** o lucro do privado enche a reserva, que abre obras
  nas empresas que dão mais lucro; juro alto encarece o crédito. [gdd.md:1457-1459]
- **Estatal:** cresce quando o jogador põe verba por lei; paga do cofre, e sem cofre
  da dívida. [gdd.md:1460-1461]
- **Leis de propriedade:** indenização, prazo, regra pós-venda, política estatal,
  triagem estrangeira, remessa de lucro, fábrica de fora, concorrência. [gdd.md:1471-1473]

**4. Regras decididas**
- Sem data na fonte (seção 16 do GDD): prejuízo por vários turnos fecha o prédio.
  [gdd.md:1446]
- 03/nov: imposto sobre lucro só incide se há lucro; margem relativa divide o
  investimento entre setores. [mercado.md:399-406]
- 14/nov: o lucro vai ao bolso do dono (pop rico, Estado, fundo, estrangeiro); o dono
  gasta uma parte e investe outra, e o investimento abre as obras. [mecanicas.md:337-339]
- Ponto de partida do estudo: 35% do lucro em dividendo (a conta de exemplo usa 65%
  reinvestido). [leis - Economia - estudos.tsv:11; leis - Economia - ações.tsv:5-6]

**5. Ligações**
- Gosto/população: dividendo vira renda dos pops donos, paga imposto e vira consumo
  ou poupança. [leis - Economia - lucro.tsv:14]
- Leis: imposto sobre empresas, imposto sobre dividendos, remessa de lucro,
  incentivos. [leis - Economia - lucro.tsv:10-13]
- Mundo: o lucro do estrangeiro sai do país. [gdd.md:1441]

**6. Referências**
- Victoria 3: lucro em parte para o caixa do prédio e o resto em dividendos aos
  donos; donos investem parte no fundo de investimento. [vic3-ref:137-140; pesquisa:66-69]
- Contas nacionais (ONU e Eurostat): produção menos insumos dá valor adicionado;
  em negócio familiar salário e lucro se misturam (renda mista). [leis - Economia -
  estudos.tsv:9]
- Reinvestimento: 83% de 2.886 empresas britânicas usam reservas para investir.
  [leis - Economia - estudos.tsv:12]
- Dividendos em torno de 30% a 50% do lucro (MSCI, FactSet). [leis - Economia -
  estudos.tsv:11]

**7. No motor hoje**
- Funciona: imposto sobre lucro; obra e fila. [leis - Economia - como funciona.tsv:8, 12]
- Pela metade: receita (capacidade × preço médio do setor), salário (não chega ao
  pop), reserva de investimento (taxa, sem dinheiro real). [leis - Economia - como
  funciona.tsv:6-7, 11]
- Falta: dono, dividendo. [leis - Economia - como funciona.tsv:9-10]
- Falta: caminho do lucro (R16.9, R16.33), lucro vai ao dono (R16.12), reserva
  privada abre obras (R16.13). [requisitos.md:376, 382-383, 406; mecanicas.md:335-336]

**8. Em aberto**
- Quanto do lucro privado vai aos investidores e quanto à reserva. [gdd.md:2138;
  mecanicas.md:340]
- ⚠ CONFLITO (lista de tipos de dono): o GDD diz 5 tipos (Estado, privado nacional,
  estrangeiro, cooperativa, entidade sem lucro) [gdd.md:1452-1455]; o mesmo GDD, na
  divisão do lucro, lista 6 destinos (privado, estrangeiro, estatal, cooperativa,
  mista, conta própria) [gdd.md:1438-1445]; a planilha traz 9 linhas (privado
  nacional, empresa na bolsa, estrangeiro, estatal, mista, cooperativa, conta
  própria, serviço do Estado, entidade sem lucro) [leis - Economia - donos.tsv:2-10];
  o mapa das mecânicas fala em "os 5 tipos". [mecanicas.md:341] Sem data para
  decidir qual vale.

---

## III.5 Consumo e necessidades

**1. O que é**
Todo produto tem comprador (pops, pequenos mercados, mercados, outros prédios,
Estado, exterior); o pop compra pela cesta da sua renda. [gdd.md:1405-1411]

**2. O que o jogador faz e sente**
- Mexe na renda e no preço; o consumo muda. Quem ganha mais gasta parte menor com
  comida e poupa mais. [gdd.md:1410-1411]
- Sente falta de comida (fome), conta de luz e preço de moradia. [gdd.md:1319-1320;
  leis - Economia - cesta.tsv:2-4]

**3. Peças**
- **Quem compra:** pops, pequenos mercados, mercados, outros prédios, Estado e
  exterior. [gdd.md:1407-1408]
- **Cesta por estrato** (pobre, médio, rico, em % da renda): comida 45/22/8, roupas
  6/5/4, moradia e contas 22/22/15, casa 3/5/6, saúde 5/8/7, infraestrutura e
  transporte 8/11/9, comunicação 4/5/4, lazer e luxo 1/5/10, educação 1/4/4,
  restaurantes e turismo 1/4/8, seguros e finanças 0/3/6, serviços pessoais 4/3/4,
  poupança 0/3/15. [leis - Economia - cesta.tsv:2-14]
- **Mapa produto a produto:** categoria do pop, quais pops compram, como chega ao
  pop, quais prédios compram, se o Estado compra e o que vai ao exterior. [leis -
  Economia - consumo.tsv:1-76]
- **Comércio é ponte:** produto vai ao atacado, aos pequenos mercados ou aos
  mercados, e daí ao pop; serviços chegam direto. [gdd.md:1412-1413]
- **Necessidade atendida por vários produtos** com preferência. [mecanicas.md:304-307]

**4. Regras decididas**
- Sem data na fonte (seção 16): pop compra pela cesta. [gdd.md:1409-1411]
- 14/nov: necessidade atendida por vários produtos; energia de casa tem regra
  própria (eletricidade, gás, lenha). [mecanicas.md:304-307]
- Dado de partida: riqueza vira consumo em cerca de 3% do ganho. [leis - Economia -
  ações.tsv:20; leis - Economia - estudos.tsv:15]

**5. Ligações**
- Gosto/população: o bolso (renda, preço do que compra, emprego, serviço) é a parte
  mais forte do gosto. [mecanicas.md:176-178]
- Leis: imposto sobre consumo, tarifas. [leis - Economia - lucro.tsv:3]
- Mundo: cada produto indica se exporta, importa ou não viaja. [leis - Economia -
  consumo.tsv:2-76]

**6. Referências**
- Victoria 3: necessidades por nível de riqueza, atendidas por vários bens em
  qualquer mistura; padrão de vida sobe e desce. [vic3-ref:70-93; pesquisa:64-65]
- Lei de Engel (maior renda, menor parte em comida) e COICOP 2018 (consumo por
  finalidade) para a cesta. [leis - Economia - estudos.tsv:21-22]
- Federal Reserve: riqueza vira consumo em 2 a 5 centavos por dólar. [leis -
  Economia - estudos.tsv:15]

**7. No motor hoje**
- Pela metade: só a cesta de comida e remédios; não há demanda por setor. [leis -
  Economia - como funciona.tsv:17]
- Falta: quem compra (R16.36 ☐); cesta por estrato. [requisitos.md:402;
  mecanicas.md:345-346]

**8. Em aberto**
- ⚠ CONFLITO (modelo da cesta): em código (02/nov) a cesta é a mesma quantia por
  pessoa em qualquer pop (mínimo para viver, 12% da renda média), e o pobre gasta
  fatia maior da mesma cesta [mercado.md:113-116]; a planilha e o GDD (sem data de
  decisão) dividem a renda de cada estrato em fatias fixas por categoria [leis -
  Economia - cesta.tsv:2-14; gdd.md:1409-1411]. Não escolhi.
- Quem compra de verdade (pequenos mercados, mercados, prédios, exterior) ainda é
  planilha. [leis - Economia - consumo.tsv:1]
- Nota do redator: a linha "Total" da cesta está vazia na planilha. [leis - Economia
  - cesta.tsv:15]

---

## III.6 Nenhum dinheiro some e o caminho do dinheiro

**1. O que é**
Todo real cobrado ou gasto tem caminho: circula na economia, fica guardado ou sai
do país, mesmo o ilegal. [mecanicas.md:281-284]

**2. O que o jogador faz e sente**
- Sente o custo em gente, não num número: a verba da saúde mexe em emprego, setor e
  serviço. [mecanicas.md:530-531]
- Passa o mouse e vê de onde veio o número (preço, salário, gosto). [mecanicas.md:54-55]

**3. Peças**
- **Três destinos do dinheiro:** circula (salário, compra, lucro, aluguel); fica
  guardado (poupança, banco, cofre); sai do país (importação, remessa, fuga, conta
  lá fora). [mecanicas.md:281-284]
- **O ilegal também:** a corrupção não apaga dinheiro; vai para o bolso de alguém
  (pop rico, ministro, organização), é gasto, lavado ou mandado para fora, e deixa
  rastro. [mecanicas.md:285-287]
- **Conferência:** como o Tesouro (cofre − dívida = resultado), a economia inteira
  fecha a conta todo turno. [mecanicas.md:288-290]
- **Caminho da verba (reformulado em 14/nov):** a verba vira salário de quem
  trabalha na instituição (médico, professor, policial, que são pops), compra de
  bens e serviços (de companhias daqui ou de fora) e serviço entregue a um pop; o
  desvio vira bolso de alguém. [mecanicas.md:526-531]
- **Filtro da verba:** a corrupção desvia parte; perda = índice Corrupção × 0,5
  (índice 40 = 20% de perda), valor de partida; o desvio vai a alguém e deixa rastro.
  [leis - Economia - como funciona.tsv:22]
- **Destino da verba:** o que chega ao prédio vira salário e insumos; exemplo: 100
  de verba, 20 desviados, 50 salários, 20 insumos do país, 10 importados. [leis -
  Economia - como funciona.tsv:23]
- **Os bolsos do jogo** (pops, companhias, Estado, bancos, exterior, o ilegal) ainda
  são "a pensar". [mecanicas.md:293-294]

**4. Regras decididas**
- 14/nov: nenhum dinheiro some. [mecanicas.md:52-53, 279-290]
- 14/nov: o desvio vira bolso de alguém e deixa rastro. [mecanicas.md:285-287, 530-531]
- 14/nov: a verba precisa virar salário, compras e serviço, não parar na
  "população". [mecanicas.md:526-531]
- 13/nov: o caminho antigo (impostos, Tesouro, verba por lei, instituição que rende
  verba ÷ trabalho; verba demais vira pontos de corrupção) já dizia "nenhum dinheiro
  some". [gdd.md:2102-2104]
- 13/nov: Ordem do autor: terminar ministros, mapa, padronizar leis e só então o
  caminho do dinheiro. [gdd.md:2110-2112]

**5. Ligações**
- Gosto/população: salário público vira renda de pops. [leis - Economia - donos.tsv:9]
- Leis: toda lei de verba. [mecanicas.md:526-528]
- Mundo: importação, remessa e fuga são saídas. [mecanicas.md:283-284]

**6. Referências**
- Crítica ao Victoria 3: "a lousa é apagada" a cada tick; bens criados para cobrir
  falta e excedente vendido "ao vazio". [pesquisa:73-75; vic3-ref:23-26]
- Pesquisa de estudos: gasto público rende pouco em países mal governados (filtro
  da corrupção); contratação atrasada deixa verba sem gastar. [leis - Economia -
  estudos.tsv:30-32]
- Gasto em saúde público tirou gasto privado em Taiwan. [leis - Economia -
  estudos.tsv:33]

**7. No motor hoje**
- Falta: **✗**. A verba gasta some (só a transferência chega a um estrato); a renda
  do pop é parte fixa do PIB. [mecanicas.md:291-292]
- Falta: caminho do dinheiro completo (R10.7 ☐). [requisitos.md:211; mecanicas.md:524-525]
- Falta: corrupção não reduz a verba hoje. [leis - Economia - como funciona.tsv:22]
- Falta: verba não passa pelos prédios. [leis - Economia - como funciona.tsv:23]

**8. Em aberto**
- ⚠ CONFLITO (a corrupção apaga ou não o dinheiro): a proposta do GDD (13/nov)
  diz "parte do dinheiro some de verdade" no filtro da corrupção [gdd.md:2105-2108]
  e o requisito R10.7 repete "dinheiro some de verdade" [requisitos.md:211]; o mapa
  das mecânicas (14/nov) diz que a corrupção não apaga dinheiro e vai para o bolso
  de alguém [mecanicas.md:285-287, 530-531]. O próprio mapa ainda lista "quanto a
  corrupção some de verdade" como "a pensar". [mecanicas.md:533-534] A frase
  "nenhum dinheiro some" do GDD de 13/nov convive com "some de verdade" na mesma
  seção. [gdd.md:2104, 2107] Não escolhi.
- ⚠ CONFLITO (princípio 5 × decisão de 14/nov): o princípio 5 diz "a conta sempre
  fecha" e define isso só para o dinheiro do Estado (entra por lei ou bem do Estado,
  sai por lei ou obrigação) [gdd.md:107-112]; a decisão de 14/nov estende a
  conservação a toda a economia (nenhum dinheiro some) [mecanicas.md:52-53,
  279-290]. O mapa de 14/nov é mais novo, mas não cita o princípio 5 para revogá-lo.
- Custo fixo por ministério e por cargo (sem ele o governo Inchado não tem
  desvantagem), quanto a corrupção some de verdade e o dinheiro "fora das leis" de
  hoje. [mecanicas.md:532-534; gdd.md:2109]
- Os bolsos do jogo e o que é contado um por um ou aproximado. [mecanicas.md:293-294]
- Como o jogo divide a verba entre pessoal, compras e obras: a divisão não é fixa
  e falta definir como. [pedido do autor nesta rodada, sem linha em arquivo]

---

## III.7 Moeda, bancos, inflação e câmbio

**1. O que é**
O Banco Central, os bancos, a inflação e o câmbio ligam juros, crédito, preço da
moeda e o exterior. [gdd.md:1475-1485; leis - Economia - dinheiro.tsv:2-17]

**2. O que o jogador faz e sente**
- Dá autonomia ao Banco Central por lei; com autonomia, a régua da Taxa básica só
  mostra a decisão do banco. [gdd.md:1477-1478, 1561-1562]
- Define a Faixa do câmbio (preço-alvo do dólar de −20% a +40% sobre o início, e
  largura de 0% travado a 30% quase solto); ao bater na parede decide no turno:
  gastar reservas, subir juros, fechar a saída de dinheiro (só com Controle de
  capital) ou deixar o corredor quebrar. [gdd.md:1546-1553]
- Resgate de bancos é evento: deixar quebrar, ficar com o banco (vira estatal),
  emprestar com condições ou salvar sem condições. [gdd.md:1554-1558]
- Cripto: quando a moeda vai mal, parte do povo compra; a lei decide mercado
  paralelo, imposto ou livre. [gdd.md:1559-1560]

**3. Peças**
- **Juros:** o Banco Central reage à inflação e à economia (regra de Taylor); juros
  de mercado somam o risco do país. [gdd.md:1477-1478; leis - Economia -
  dinheiro.tsv:2-3]
- **Crédito:** bancos emprestam depósitos e reservas a pops, prédios e Estado;
  confiança e lucro ampliam; juros e calote reduzem; crédito farto infla a bolsa.
  [gdd.md:1479-1480; leis - Economia - dinheiro.tsv:4-7]
- **Inflação:** vem de demanda, custo, expectativas e moeda emitida. [gdd.md:1481;
  leis - Economia - dinheiro.tsv:8-11]
- **Câmbio:** taxa, moeda fraca (exporta mais, encarece importados e dívida
  externa), moeda forte (importa barato, indústria sofre), regime e reservas.
  [gdd.md:1482-1485; leis - Economia - dinheiro.tsv:12-16]
- **Regime:** o país escolhe dois de três (câmbio estável, capital livre, juros
  próprios); reservas seguram o câmbio até acabar. [gdd.md:1484-1485]
- **Reservas** são um índice, não uma lei. [gdd.md:1552-1553]
- **Exterior:** comércio, investimento e sanções passam pelo câmbio. [leis -
  Economia - dinheiro.tsv:17]
- **Juros do motor:** `alvo = neutro + inflação + 0,05 × max(0, dívida −
  tolerância)`; a taxa anda 20% do caminho até o alvo por turno. [calculos.md:42-54]
- **Banco Central no motor:** o alvo soma `peso_da_meta × (inflação − meta)`; a
  Autonomia (0 a 1) pesa o alvo do BC contra a Taxa básica do governo. [fisco.md:15-21]

**4. Regras decididas**
- 08/nov: câmbio como corredor; resgate de bancos é evento; cripto; autonomia do
  Banco Central destrava a Taxa básica. [gdd.md:1544-1562]
- 14/nov: o modelo do Victoria 3 é atualizado com crédito, banco central, inflação
  e capital entrando e saindo. [mecanicas.md:275-277]
- Sem data: crises do dinheiro (corrida ao banco, resgate banco a banco, ataque à
  moeda) são eventos de decisão; as leis de Moeda e bancos só montam o cardápio.
  [gdd.md:2159-2160]

**5. Ligações**
- Gosto/população: crédito popular (casa, carro, ação) e parcela. [leis - Economia
  - dinheiro.tsv:7]
- Leis: Autonomia, Meta de inflação, Faixa do câmbio, Seguro-depósito, Exigência de
  capital, Controle de capital. [gdd.md:1546-1562; fisco.md:15-21]
- Mundo: a moeda do extremo é a de um país da lista do Mundo. [gdd.md:1552]

**6. Referências**
- Regra de Taylor; trindade impossível; repasse do câmbio (BIS, mais forte em
  emergentes); canal do crédito (Bernanke e Gertler); inflação por demanda, custo e
  expectativas (Banco da Austrália). [leis - Economia - estudos.tsv:23-27]
- Calibração dos juros: Reinhart, Rogoff e Savastano (2003); Laubach (2009); Clarida,
  Galí e Gertler (2000). [calculos.md:46-54]
- Democracy 4: nota de crédito que define juros; Victoria 3: juros baixos que não
  viram espiral. Estudo de 22/out, antes do recomeço, só como ideia. [estudo-vic3-d4:122-169]
- Victoria 3 não tem inflação nem crédito moderno (o jogo vai até 1936). [pesquisa:80-81;
  estudo-vic3-d4:144-145]

**7. No motor hoje**
- Pela metade: inflação que se move (R9.3 ◐). [requisitos.md:202; mecanicas.md:358]
- Feito: juros por dívida e inflação, com Banco Central e autonomia pelo papel.
  [calculos.md:42-54; fisco.md:15-21]
- Falta: crédito dos bancos (R16.38 ☐); câmbio, regime e reservas (R16.39 ☐).
  [requisitos.md:404-405; mecanicas.md:359-360]
- Falta: tudo da planilha de inflação por demanda, custo, expectativa e moeda. [leis -
  Economia - dinheiro.tsv:8-11]
- Simplificado hoje: uma taxa só; sem prazo da dívida; prêmio linear, sem crise de
  confiança. [calculos.md:56-57]

**8. Em aberto**
- Banco Central com autonomia por lei; câmbio como corredor; crises do dinheiro como
  eventos. [mecanicas.md:361-363]
- Como crédito, câmbio e reservas ligam comércio, inflação, dívida e investidores.
  [requisitos.md:405]
- Peso da meta de inflação, números de alvo e do prêmio de risco: **ESTUDAR**
  (a fonte só dá o ponto de partida dos juros, calculos.md:44-54).

---

## III.8 Bolsa (minigame Pregão)

**1. O que é**
A bolsa é onde empresas abrem capital e investidores negociam ações; o preço anda
pelo lucro e pela confiança, e a bolsa funciona sem o governo. [gdd.md:1489-1491]

**2. O que o jogador faz e sente**
- Regulamenta ou entra: o Estado compra e vende de verdade, o dinheiro entra e sai
  do cofre, e grupos, mídia e outros países reagem. [gdd.md:1489-1490, 1514-1515]
- Cada país escolhe o caminho (liberal, coordenado ou Estado dono); cada um exige
  estrutura e cobra um preço, sem lado certo. [gdd.md:1494-1497]
- Ação dá dividendo, não dá mando. [gdd.md:1498-1499]
- Sente alta e quebra: a quebra reduz patrimônio, consumo, investimento e emprego.
  [gdd.md:1508-1509]

**3. Peças**
- **Preço:** lucro × múltiplo × humor; múltiplo cai com juros e risco e sobe com
  crescimento esperado; humor volta ao valor justo aos poucos. [gdd.md:1500-1505]
- **Conta de valor justo (exemplo):** lucro 12; retorno exigido = juros 8% + risco 5%
  = 13%; crescimento esperado = 65% × 12% = 7,8%; múltiplo = 35% ÷ (13% − 7,8%) ≈ 6,7;
  valor justo ≈ 81; humor entre 0,6 e 1,6. [leis - Economia - ações.tsv:2-9]
- **Prêmio de risco:** sobe com corrupção, dívida, regra fraca, ameaça de estatizar
  e violência; cai com proteção e transparência. [gdd.md:1502-1503; leis -
  Economia - ações.tsv:4]
- **Ciclo:** novidade, euforia, aperto, pânico, consequência. [leis - Economia -
  ações.tsv:13-17]
- **Investidores:** pequenos, pops ricos, fundos nacionais, bancos e corretoras,
  multinacionais, estrangeiros de curto prazo, potências e o Estado, cada um com
  origem do dinheiro, quando compra e quando vende. [leis - Economia -
  investidores.tsv:1-9; gdd.md:1510-1513]
- **Base do mercado:** propriedade, contratos, regras claras, moeda estável e apoio
  da população; sem isso a bolsa encolhe ou quebra. [gdd.md:1492-1493; leis -
  Economia - bolsa.tsv:8-11]
- **Regras que o país pode criar** (ideias de lei): transparência, proteção do
  pequeno acionista, informação privilegiada, órgão da bolsa, limite de risco dos
  bancos, imposto sobre ganhos, pausa do pregão, fundo do Estado, socorro. [leis -
  Economia - bolsa.tsv:12-21, 25]
- **Índice da bolsa** e **confiança do mercado.** [gdd.md:1506-1507]
- **Patrimônio dos pops:** ação sobe ou cai e muda a riqueza; dividendo vira renda;
  queda vira reação no voto e no investimento. [gdd.md:1517-1519]
- **Captação:** preço alto ajuda empresa a vender ação e pagar obras. [leis -
  Economia - ações.tsv:18]
- **Compra da propriedade** pelo valor na bolsa. [gdd.md:1516]

**4. Regras decididas**
- Sem data na fonte (seção 16): a bolsa funciona sem o governo; mercado precisa de
  base; ação dá dividendo, não dá mando. [gdd.md:1489-1499]
- Sem data: humor nasce de alta recente, crédito barato, confiança e notícias, sem
  sorteio. [gdd.md:1504-1505]
- Sem data: vender muito de uma vez derruba o preço. [gdd.md:1512-1513]
- 02/nov (memória do autor): jogável não é demorado; nenhuma opção com efeito neutro
  (revisão do Pregão). [memória feedback_jogavel_nao_demorado]
- Pontos de partida: 3% do ganho vira gasto (estudo do Federal Reserve). [leis -
  Economia - ações.tsv:20]

**5. Ligações**
- Gosto/população: queda reduz a satisfação de Finanças, Indústria e dos pequenos
  investidores (pressão por socorro). [leis - Economia - ações.tsv:21]
- Leis: imposto sobre ganhos, remessa, regras da bolsa. [leis - Economia - bolsa.tsv:12-17]
- Mundo: estrangeiros saem rápido e derrubam preço e moeda; potências compram. [leis
  - Economia - investidores.tsv:7-8]

**6. Referências**
- Modelo de Gordon (valor justo); Minsky e Kindleberger (bolhas); Rodrik (base do
  mercado); IOSCO (regras mínimas); La Porta e outros (proteção do investidor);
  Levine e Zervos (liquidez); Hall e Soskice (tipos de capitalismo); Wolff e Axios
  (quem tem ações); estudo da Índia (fuga de estrangeiro). [leis - Economia -
  estudos.tsv:4-8, 13-14, 16-17]

**7. No motor hoje**
- Pela metade: protótipo na tela com blocos de 2% e dividendo sem mando (R16.15 ◐);
  empresas, preço e compradores de protótipo, que só mudam a tela. [requisitos.md:388;
  leis - Economia - bolsa.tsv:2-4, 18]
- Falta: preço = lucro × múltiplo × humor (R16.16, R16.34 ☐); investidores e quebra
  (R16.35 ☐); bolsa sem o governo (R16.29 ☐); ações no patrimônio dos pops (R16.28 ☐);
  base e caminhos (R16.30 ☐); índice da bolsa (R9.6 ☐). [requisitos.md:204-205,
  389-394; mecanicas.md:367-370]

**8. Em aberto**
- ⚠ CONFLITO (blocos): o requisito descreve o protótipo com "blocos de 2%" [requisitos.md:388]
  e o GDD diz que as ações são negociadas no turno, "sem blocos fixos" [gdd.md:1498],
  mas na mesma seção fala em "preço do bloco" [gdd.md:1500]. É protótipo × desenho;
  sem data de revogação.
- A ordem e o tamanho de cada regra de bolsa (as "ideias de lei" ainda não viraram
  leis). [leis - Economia - bolsa.tsv:12-17]

---

## III.9 Companhias e estatais (operações do Estado)

**1. O que é**
Camadas: ação (fatia que dá dividendo, sem mando), empresa (conjunto de prédios de
um setor, com dono que manda) e prédio; trocar o dono não mexe no prédio. [gdd.md:1566-1568]

**2. O que o jogador faz e sente**
- Abre a lista de companhias (filtro por setor ou dono; colunas de lucro, valor na
  bolsa, empregos, parte do Estado, dividendo, risco político) e escolhe: comprar
  cotas, estatizar, privatizar, transformar em cooperativa, criar estatal. Cada uma é
  Operação, não lei. [gdd.md:1569-1575]
- Comprar cotas (jogo A): define meta, prazo e discrição; o jogo divide a meta pelos
  turnos; passar do Limite de aviso ao mercado sobe preço e risco. [gdd.md:1582-1587]
- Estatizar ou privatizar (jogo B): decide só querer ou não; o resto chega como
  papéis para assinar na mesa; no leilão vê os compradores e define o preço mínimo.
  [gdd.md:1588-1595]
- Só mexe em companhias, nunca em fábrica solta. [gdd.md:1574-1575]

**3. Peças**
- **Leis que controlam as operações:** Indenização, Prazo de pagamento, Regra
  depois da venda, Política da empresa estatal, Limite de aviso ao mercado, Ação de
  ouro, Autorização para estatizar e vender (presidente, Congresso ou plebiscito).
  [gdd.md:1576-1578]
- **Verbas:** Verba das estatais (por setor, % do PIB) mantém e opera o que existe;
  Construção de estatais paga obras novas na fila. [gdd.md:1579-1581]
- **Papéis na mesa (11/nov):** Autorização, Proposta do órgão e Resposta; cada um com
  prazo; a mídia lê cada passo; papel duvidoso pode surgir. Comprar cotas, Encomendar
  usina e Megaobra não têm papel. [gdd.md:1601-1614]
- **Pedidos na mesa:** empresas e compradores mandam pedidos para comprar estatais.
  [gdd.md:1596-1597]
- **O partido não compra nem vende:** quem faz é o Estado, por lei ou decreto; doação
  de companhia é conflito de interesse. [gdd.md:1598-1600]
- **Ficha da empresa na bolsa:** mostra prédios, da extração ao refino. [gdd.md:1468-1470]
- **Operações do Estado** (estatizar, criar estatal, cooperativa, vender companhia ou
  prédio); empresas de energia podem ser vendidas; transporte fica no fundo do
  cálculo. [gdd.md:1464-1467]

**4. Regras decididas**
- 08/nov: Operação e Ato não são lei; só lei é regra permanente com bolha. [gdd.md:90-98,
  1290-1292; memória feedback_leis_x_decisoes]
- 08/nov: só mexemos em companhias. [gdd.md:1574-1575]
- 11/nov: o mesmo molde de 3 papéis em Estatização, Privatização e Cooperativa.
  [gdd.md:1601-1603]
- 08/nov: o Estado compra e vende de verdade; o dinheiro entra e sai do cofre. [gdd.md:1514]

**5. Ligações**
- Gosto/população: acionistas reagem de um jeito por tipo; grupos e mídia reagem. [gdd.md:1590-1592,
  1514-1515]
- Leis: as sete acima. [gdd.md:1576-1578]
- Mundo: o país do dono reage na Justiça; multinacional compra controle. [gdd.md:1610-1612;
  leis - Economia - investidores.tsv:6]

**6. Referências**
- Victoria 3: companhias (1.8), dono por nível e investimento estrangeiro. [pesquisa:66-69]
- Estatais e Mehr (Irã): Estado constrói e tira obra do privado. [leis - Economia -
  estudos.tsv:74]
- Demais jogos de compra e venda de estatal: **ESTUDAR** (as fontes só trazem o
  desenho próprio).

**7. No motor hoje**
- Pela metade: empresas declaradas pelo país (R16.11 ◐). [requisitos.md:381; mecanicas.md:350]
- Falta: estatizar, privatizar, criar estatal, cooperativa e comprar cotas como Operação
  com 3 papéis (R16.14 ☐); lista de companhias. [requisitos.md:384; mecanicas.md:351-352]
- Falta: estatais e ações rendendo ao cofre e podendo ser vendidas. [mecanicas.md:542-543]

**8. Em aberto**
- Leilão (preço mínimo, compradores); oferta pública × obrigar a vender; quem reage
  (acionistas, país do dono). [mecanicas.md:353-354]
- Se a verba da estatal é uma lei por estatal ou por setor. [gdd.md:2140]
- ⚠ CONFLITO (verba da estatal): o GDD descreve a Verba das estatais "por setor"
  [gdd.md:1579-1580] e mantém a mesma pergunta em aberto. [gdd.md:2140]
- ⚠ CONFLITO (decisão por setor × por companhia): a Fatia 8 de 02/nov desenha uma
  **ficha por setor** (9 setores) em que cada mudança de dono, importação, capital
  estrangeiro e preço é um **projeto de lei**, e diz que substitui as 3 leis de energia
  [mercado.md:281-286, 296-313, 337-338]; o GDD de 08/nov diz que a decisão é
  **Operação sobre companhia**, "não uma lei". [gdd.md:1573-1575] A Fatia 8 está
  marcada "redesenho, sem código", "aguarda aprovação". [mercado.md:281, 343] O GDD
  de 08/nov é mais novo, mas não cita a Fatia 8 para revogá-la. Não escolhi.

---

## III.10 Comércio exterior e capital

**1. O que é**
O país importa o que falta e exporta o que sobra, pelas tarifas, subsídios e acordos
(leis). [gdd.md:1321-1322]

**2. O que o jogador faz e sente**
- Mexe na régua de tarifa, imposto de exportação e subsídio, por setor (aba por
  setor e aba "Todos"). Nenhuma lei dá lucro a um produto. [gdd.md:1618-1620]
- Sente dependência de uma potência (média do que o país compra dela) e preço do
  que vem de fora. [mercado.md:29-33]

**3. Peças**
- **Leis (08/nov):** Tarifa de importação, Facilitação aduaneira, Zonas francas,
  Imposto sobre exportação, Subsídio às exportações, Defesa comercial, Controle de
  exportação de produtos estratégicos, Venda de armas ao exterior, Triagem de compra
  estrangeira, Remessa de lucro ao exterior, Fábrica estrangeira no país. [gdd.md:1621-1624]
- **Leis gerais de estrangeiros (02/nov, Fatia 8):** triagem, remessa, fábrica
  estrangeira, fábrica nossa no exterior, concorrência e acordo com potência. [mercado.md:325-331, 335]
- **Cobertura, fornecedores e dependência.** [mercado.md:20-33]
- **Sanção pelo mercado** (com o Mundo); terras raras: quem produz pode sancionar pelo
  mercado. [mecanicas.md:392; gdd.md:1696-1698]
- **Câmbio** como ligação com o exterior. [leis - Economia - dinheiro.tsv:17]

**4. Regras decididas**
- 08/nov: régua por setor; nenhuma lei dá lucro a um produto. [gdd.md:1618-1620]
- 02/nov: produto que o país não declara conta cobertura 0 (compra tudo do mundo).
  [mercado.md:40-42]
- Evidência apontada no GDD: a tarifa recai quase toda sobre quem compra; abrir o
  comércio sobe a produtividade com ganhadores e perdedores; menos burocracia nos
  portos corta o custo (10 a 20% em simulações); zonas francas dependem da
  governança. [gdd.md:1625-1627]

**5. Ligações**
- Gosto/população: tarifa mexe no preço do que o pop compra. [gdd.md:1625]
- Leis: as 11 acima. [gdd.md:1621-1624]
- Mundo: preço do mundo, fornecedores, sanções, acordos. [mercado.md:46-52; mecanicas.md:392]

**6. Referências**
- Victoria 3: acesso ao mercado mundial por porto; tarifas e subsídios (0, 12,5, 25,
  50%); embargos. [vic3-ref:55-58]
- A evidência do GDD não traz fonte nomeada: **ESTUDAR** (achar as fontes).
  [gdd.md:1625-1627]

**7. No motor hoje**
- Pela metade: tarifa, subsídio e acordo (R16.4 ◐); falta tarifa e subsídio na
  conta. [requisitos.md:356; leis - Economia - como funciona.tsv:19; mecanicas.md:391]

**8. Em aberto**
- Régua por setor; sanção que passa pelo mercado (com o Mundo). [mecanicas.md:392]

---

## III.11 Setores com regra própria

Cada um precisa de plano quando for a vez; todos já estão desenhados no GDD.
[mecanicas.md:394-400] Não há estudo nem jogo de referência nas fontes lidas para
Energia, Agricultura, Ciência, Meio ambiente, Construção civil, Transporte, Cultura,
Defesa civil e Minério: em cada um, a referência fica **ESTUDAR**. Para todos, no
motor ainda não há mecânica própria nem R. [mecanicas.md:394-400]

### III.11.1 Energia (08/nov)

**1. O que é**
Energia é capacidade, não estoque: usinas, rede e linhas contra a demanda; faltar
encarece e trava a indústria. [gdd.md:1323-1324]

**2. O que o jogador faz e sente**
- Encomenda uma usina num estado e numa fonte (Operação, paga com os Investimentos por
  fonte); escolhe quem fica sem luz quando falta; segura a conta de luz (lei pegadinha);
  estatiza ou vende a companhia. As linhas são automáticas. [gdd.md:1647-1651]
- Sente a falta chegando num gráfico do futuro (gasto contra geração, contando obras
  em andamento) e o apagão como evento. [gdd.md:1654-1655, 1637-1639]

**3. Peças**
- Energia nunca vem do nada: gerada = gasto das companhias + gasto da população +
  perdas na rede; índices Energia gerada, Energia gasta, Preço da energia, Matriz
  limpa e Acesso à energia. [gdd.md:1631-1635]
- Por estado: usinas e linhas ligadas aos vizinhos; apagão por estado. [gdd.md:1636-1639]
- Produtividade é conta por companhia. [gdd.md:1640-1642]
- Quem constrói: as companhias com a própria reserva; o Estado pelos Investimentos
  por fonte. [gdd.md:1643-1644]
- Mapa elétrico. [gdd.md:1645-1646]
- Cada fonte é uma aposta (hidrelétrica, solar, eólica, térmica, nuclear). [gdd.md:1656-1658]
- Comércio de energia como Posição por país, em degraus. [gdd.md:1659-1661]
- Urânio: escada de enriquecimento; vender urânio em segredo é Ato. [gdd.md:1662-1666]
- No motor (02/nov): demanda civil 35 e das empresas 65 (pontos); a falta freia até 8
  pontos de crescimento ao ano e sobe o preço; civis primeiro. [mercado.md:227-237, 261-271]

**4. Regras decididas**
- 02/nov: se a demanda passa da capacidade, a energia vai primeiro para os civis
  (decidido: A). [mercado.md:232-237]
- 02/nov: o produto "Energia" saiu da tabela de produtos; a energia é só o bloco de
  capacidade. [mercado.md:274-275]
- 08/nov: as linhas são automáticas: o presidente só define o dinheiro, porque o jogo
  não é de construção. [gdd.md:1650-1651]
- 08/nov: ao estatizar, a companhia federal é criada sozinha. [gdd.md:1652-1653]

**5. Ligações**
- Gosto/população: Acesso à energia; conta de luz; energia de casa tem regra própria
  (eletricidade, gás, lenha). [gdd.md:1634-1635; mecanicas.md:304-307]
- Leis: Investimentos por fonte; Enriquecimento de urânio; comércio de energia.
  [gdd.md:1644, 1659-1663]
- Mundo: urânio e comércio de energia com vizinhos mudam a desconfiança e a
  dependência. [gdd.md:1659-1666]

**6. Referências** **ESTUDAR** (nenhuma nas fontes).

**7. No motor hoje**
- Feito: energia como capacidade contra demanda (R16.3 ✅), com 5 fontes e leis de
  verba; falta o resto do pacote (tarifa social, subsídio à energia limpa, imposto
  sobre combustível fóssil, licenciamento, fiscalização nuclear), o risco da nuclear
  e a rede por região. [requisitos.md:355; mercado.md:222-279]
- Falta: energia por estado e apagão como evento; encomendar usina (Operação); comércio
  de energia; urânio. [mecanicas.md:385-387]

**8. Em aberto**
- ⚠ CONFLITO (quem fica sem luz): no motor, a escolha é automática, civis primeiro
  (02/nov) [mercado.md:232-237]; no GDD o jogador "escolhe quem fica sem luz quando
  falta" (08/nov) [gdd.md:1648-1649]. O GDD é mais novo, mas não revoga a regra A
  explicitamente.
- ⚠ CONFLITO (energia como produto): "saiu da tabela de produtos" (02/nov)
  [mercado.md:274-275] × energia como produto que quase todo prédio usa, em
  consumo e prédios (planilha, sem data) [leis - Economia - consumo.tsv:30-31; leis -
  Economia - prédios.tsv:1] e como índice Energia gerada. [gdd.md:1634-1635]
- ⚠ CONFLITO (3 leis de "quem"): a Fatia 7 cria 3 leis (quem constrói, quem opera a
  rede, quem vende) [mercado.md:250-255]; a Fatia 8, no mesmo dia, as substitui por
  ficha de setor [mercado.md:337-338]; o GDD de 08/nov não cita nenhuma das duas.
- Energia por estado e apagão como evento: "a pensar". [mecanicas.md:385]

### III.11.2 Moradia e terra (campo × cidade)

**1. O que é**
Moradia é estoque local (formal e precária), não produto do mundo; a terra rural é de
donos grandes, pequenos ou de ninguém; as duas pontas se ligam pela gente que se
muda. [gdd.md:1330-1334, 1353-1359]

**2. O que o jogador faz e sente**
- Escolhe leis de terra no campo e de moradia na cidade. [gdd.md:1330-1331]
- Leis da cidade em 4 alavancas (Construir, Terra urbana, Aluguel, Ocupação), cada uma
  com leis nos 6 lados. [gdd.md:1350-1352]
- Reforma agrária é processo (terra parada, desapropriada ou comprada, assentamento,
  título); cada lei empurra uma etapa; o partido não escolhe fazenda. [gdd.md:1360-1361,
  1761-1763]
- Sente déficit, preço, favela e casas vazias. [gdd.md:1347-1349]

**3. Peças**
- **Estoque em 3 faixas (07/nov):** pobres, classe média, ricos, mais a favela, com
  casas ocupadas e vazias; o aluguel de cada faixa reage às vazias. [gdd.md:1337-1339]
- **Quem constrói:** empresa pelo lucro, governo pela lei e pop (pobre autoconstrói
  precário, classe média financia, rico investe para alugar). [gdd.md:1335-1343]
- **Casas descem de faixa** cerca de 2% ao ano. [gdd.md:1344-1346]
- **Êxodo:** a gente do campo vai para a cidade quando a renda esperada lá passa a do
  campo. [gdd.md:1355-1359]
- **Fazendas em 3 tamanhos;** imposto sobre terra e imóvel parado (curva de Laffer);
  desapropriar pela fila do órgão de terras. [gdd.md:1364-1371]
- **Terra (09/nov):** fila visível (vistoria, prazo de defesa, terra obtida,
  assentamento, título); duas contas por estado (Preço da terra e Segurança da terra);
  comprar ou desapropriar; movimentos sem-terra nascem sozinhos; papéis na mesa.
  [gdd.md:1759-1776]
- **No motor (04/nov, moradia):** família = pessoas ÷ tamanho; déficit, favela e casas
  vazias saem da contagem; desgaste de 4% ao ano; governo constrói pela lei de verba;
  empresas constroem conforme setor, preço, juro, imposto e corrupção; sem casa, a
  precária cresce; bolso: o preço pede uma renda; casa vazia (14/nov); êxodo pela
  concentração. [moradia.md:6-12, 13-20, 22-41]

**4. Regras decididas**
- 07/nov: estoque em 3 faixas; casa sem morador não some. [gdd.md:1337-1339]
- 04/nov: o país começa parado: as obras do turno 0 só repõem o desgaste. [moradia.md:42]
- 14/nov: casa de quem é despejado fica vazia; as vazias desgastam como as formais; o
  índice de casas vazias anda pela contagem. [moradia.md:30-35]
- 04/nov: "antes de toda lei: um presidente real assinaria e pronto, ou é um processo?"
  [gdd.md:1362-1363; memória feedback_lei_ou_processo]
- 04/nov (memória): nenhuma lei sabe de pobreza; o resultado sai da renda contra a conta.
  [memória feedback_resultado_emerge; moradia.md:22-29]
- 09/nov: o preço da terra sobe com compra em massa; a segurança da terra cai com
  desapropriação e ocupação. [gdd.md:1764-1767]

**5. Ligações**
- Gosto/população: renda do pop diz quem paga a casa; movimento sem-terra; êxodo.
  [moradia.md:22-29; gdd.md:1772]
- Leis: 4 alavancas da cidade, leis do campo nos 6 lados; "lei nenhuma fala das duas:
  a ligação é a gente". [gdd.md:1350-1352, 1372-1374]
- Mundo: não se importa casa. [gdd.md:1333]

**6. Referências**
- Rosenthal (casas descem de faixa ~1,9% ao ano); Hansen e Rambaldi; Mast e outros;
  Turner e Wessel; programa Mehr; estudos de autoconstrução; Greenaway-McGrevy e So;
  Diamond e outros; VATT; IFS. [leis - Economia - estudos.tsv:63-75]

**7. No motor hoje**
- Feito: déficit, preço e favela; casas vazias (R16.19 ✅, 14/nov). [requisitos.md:364;
  mecanicas.md:374-375]
- Falta: estoque local em faixas (R16.17 ☐); quem constrói (R16.18 ☐); 4 alavancas
  (R16.20 ☐); terra rural e êxodo (R16.21 a R16.24 ☐); bem tomado pelo Estado ganha
  destino por lei (R16.25 ☐); fila de terras. [requisitos.md:362-370; mecanicas.md:376-378]
- Hoje o motor tem estoque agregado e êxodo pela concentração, não as 3 faixas.
  [moradia.md:3-12, 36-41; gdd.md:1337-1339]

**8. Em aberto**
- Velocidade do êxodo, custo da casa e ritmo da autoconstrução; se o êxodo é índice ou
  só gente mudando de pop. [gdd.md:2141-2142; mecanicas.md:379-380]
- Destino do bem tomado pelo Estado (comunidade, Estado ou famílias com título): uma
  lei por destino, a decidir. [requisitos.md:370]
- A fila genérica (serve Terra, Patrimônio e Judiciário) deve nascer uma vez só.
  [mecanicas.md:402-403]

### III.11.3 Água e saneamento

**1. O que é**
Rede de água e esgoto do país; o índice é a parte das famílias atendidas. [saneamento.md:3-6]

**2. O que o jogador faz e sente**
- Paga obras com a lei de verba, escolhe concessão, teto da tarifa e tratamento;
  sente a conta pedir uma renda e quem não paga ser cortado. [saneamento.md:11, 15-26]

**3. Peças**
- Desgaste; governo faz obras; operadoras locais fazem o resto; bolso (renda mínima);
  concessão só onde dá lucro; teto da tarifa; tratamento melhora o meio ambiente; setor
  cheio (casas e rede disputam as mesmas vagas). [saneamento.md:9-28]

**4. Regras decididas**
- 04/nov: aprovado como regra do motor; o país começa parado. [saneamento.md:3-4, 9-10]
- Nenhuma lei sabe de renda: o mesmo aumento quase não pesa onde sobra renda e corta
  muita gente onde falta. [saneamento.md:15-19]

**5. Ligações**
- Gosto/população: tarifa tira padrão de vida; religa famílias quando a renda sobe.
  [saneamento.md:15-19, 20-22]
- Leis: verba, concessão, teto da tarifa, tratamento. [saneamento.md:11, 20-26]
- Mundo: —

**6. Referências**
- Urbanização de favelas, revisão Cochrane (efeito na saúde, fraco na renda). [leis -
  Economia - estudos.tsv:69]

**7. No motor hoje**
- Feito (aprovado em 04/nov): índice, desgaste, obras, bolso, concessão, teto,
  tratamento e setas para saúde e meio ambiente; "não equilibrado, só dá direção".
  [saneamento.md:3-4, 31-32]

**8. Em aberto**
- Água e saneamento é um dos 15 setores, mas a ligação dele aos prédios (estação de
  água, de esgoto, coleta de lixo) ainda é só planilha. [leis - Economia - setores.tsv:8;
  leis - Economia - prédios.tsv:1]

### III.11.4 Agricultura e pesca (09/nov)

**1. O que é**
A produção do campo por estado, em fazendas pequenas, médias e grandes, mais o peixe
de mar compartilhado. [gdd.md:1741, 1753-1755]

**2. O que o jogador faz e sente**
- Vive a briga central: o produtor quer preço alto e a cidade quer comida barata;
  quando a comida dispara, chega o papel "comida cara" (soltar o estoque, travar a
  exportação por Ato, importar ou não fazer nada). [gdd.md:1735-1739]

**3. Peças**
- Nenhuma lei dá lucro a produto; a cadeia espalha. [gdd.md:1740-1741]
- O dinheiro depende de quem recebe: subsídio sem teto valoriza a terra do grande e
  expulsa o pequeno. [gdd.md:1742-1744]
- O campo fala com o resto: máquina empurra gente para a cidade, irrigação disputa
  água com a hidrelétrica, grão disputa com a ração. [gdd.md:1745-1748]
- Compra pública da sobra de grãos; estoque é conta e estraga. [gdd.md:1749-1750]
- Pesca por mar compartilhado; Acordo de pesca é Posição por país. [gdd.md:1753-1755]
- Eventos: seca, colapso da pesca, carne contaminada. [gdd.md:1756-1757]

**4. Regras decididas**
- 09/nov: o Estado compra só uma parte da sobra, nunca do que falta. [gdd.md:1749]
- 09/nov: o mar fica com a Fiscalização ambiental. [gdd.md:1754-1755]

**5. Ligações**
- Gosto/população: o preço da comida e o êxodo; protesto e queda de aprovação.
  [gdd.md:1739, 1745]
- Leis: Controle de exportação, crédito, subsídio, Sementes transgênicas.
  [gdd.md:1738, 1746-1748]
- Mundo: importar gasta dólares; Acordo de pesca. [gdd.md:1738-1739, 1754]

**6. Referências** **ESTUDAR**

**7. No motor hoje** Falta; só a cesta de comida existe. [mecanicas.md:394-400;
mercado.md:104-141]

**8. Em aberto** — (sem pergunta aberta na fonte)

### III.11.5 Ciência e pesquisa (09/nov)

**1. O que é**
Um nível de tecnologia por produto, sem árvore: fábrica acima do nível produz caro e
pouco, e o mundo avança. [gdd.md:1702-1704]

**2. O que o jogador faz e sente**
- Dá a verba de ciência e tecnologia e a divide em 7 fatias (Ciência básica, Saúde e
  remédios, Indústria e chips, Energia e baterias, Agro, Defesa, Espaço). [gdd.md:1711-1714]
- Investir é apostar que o partido segue no poder; cortar dói na hora. [gdd.md:1715-1718]
- Escolhe o alvo do programa espacial; a Lua é uma corrida entre países. [gdd.md:1726-1731]

**3. Peças**
- Nível próprio (lento, ninguém tira) e emprestado (rápido, cai se cortam o acesso).
  [gdd.md:1704-1707]
- Companhias com gasto de pesquisa que sobe a Produtividade. [gdd.md:1708-1710]
- Polos de pesquisa, papéis do governador e do deputado. [gdd.md:1719-1722]
- Três limites: Edição de genes, Testes em animais, Pesquisa com vírus perigosos.
  [gdd.md:1723-1725]

**4. Regras decididas**
- 09/nov: Marte está fora (autor). [gdd.md:1728-1729]
- Decidido: tecnologia como árvore fica fora do jogo pronto. [gdd.md:2195-2196]

**5. Ligações**
- Gosto/população: bancada racha com Edição de genes (Bússola). [gdd.md:1721-1722]
- Leis: as 7 fatias, os 3 limites, Cooperação científica. [gdd.md:1711-1731]
- Mundo: a Lua é corrida; nível emprestado vem de cooperação e fábrica estrangeira.
  [gdd.md:1706-1707, 1729-1731]

**6. Referências** **ESTUDAR**

**7. No motor hoje** Falta. [mecanicas.md:394-400]

**8. Em aberto** — (sem pergunta aberta na fonte)

### III.11.6 Meio ambiente (09/nov)

**1. O que é**
O órgão ambiental recebe a verba da Fiscalização ambiental, escolhe onde agir, multa e
licencia; não existe botão de pressionar. [gdd.md:1672-1675]

**2. O que o jogador faz e sente**
- Assina as leis e responde aos papéis; lei dura racha os deputados; governador pede
  alívio; companhia poluidora oferece dinheiro por voto. [gdd.md:1679-1684]
- Com o presidente mandando, a licença nunca é negada e o órgão fica mais corrupto;
  meio independente, chega o papel; independente, não assina. [gdd.md:1685-1688]

**3. Peças**
- Desmatamento nasce do lucro do agro contra o risco de punição; a Reserva da fazenda
  define o ilegal. [gdd.md:1676-1678]
- Licença sem exame sobe na hora Desmatamento ou Emissões. [gdd.md:1689-1691]
- Emissões são conta por companhia; índices Emissões de carbono, Desmatamento,
  Qualidade do ar. [gdd.md:1692-1695]
- Produtos novos: Terras raras, Baterias, Veículos elétricos. [gdd.md:1696-1698]

**4. Regras decididas**
- 09/nov: pressão só como resposta a um papel e fica no registro. [gdd.md:1674-1675]
- 09/nov: obra do Estado sempre passa pelo órgão; certificadora privada vale só para
  obras privadas. [gdd.md:1690-1691]

**5. Ligações**
- Gosto/população: Saúde ambiental lê o índice Meio ambiente. [gdd.md:1693-1694]
- Leis: Fiscalização ambiental, Reserva da fazenda. [gdd.md:1673, 1677-1678]
- Mundo: os países compram menos do agro quando a licença passa sem exame.
  [gdd.md:1689-1691]

**6. Referências** **ESTUDAR**

**7. No motor hoje** Falta; o meio ambiente hoje vem só dos efeitos das leis de energia.
[mercado.md:270-271; mecanicas.md:394-400]

**8. Em aberto** — (sem pergunta aberta na fonte)

### III.11.7 Construção civil (09/nov)

**1. O que é**
Duas filas, um setor: a pública e a privada usam a mesma capacidade de construir.
[gdd.md:1780-1782]

**2. O que o jogador faz e sente**
- Só vê a fila e mexe só pelas leis (Prioridade das obras, Divisão de 100% da verba de
  construção). [gdd.md:1783-1785, 1790-1791]
- Sente o preço: muita obra sobe cimento e salário. [gdd.md:1792]
- Papéis: obra cara, cartel, companhia que quebrou, emenda de deputado. [gdd.md:1798-1801]
- Inaugurar dá voto; obra inacabada vira ataque. [gdd.md:1802]

**3. Peças**
- Público: constrói o que o país precisa e o governo pagou, sem olhar lucro. [gdd.md:1786-1787]
- Privado: constrói onde dá lucro. [gdd.md:1788-1789]
- Construtora nacional é companhia do Estado; cartel só nasce entre as privadas.
  [gdd.md:1793-1796]
- Cartão da obra: motivo do atraso e quem resolve. [gdd.md:1797]

**4. Regras decididas**
- 09/nov: o jogador não mexe na obra; só dá dinheiro ao setor. [gdd.md:1783-1785]
- 07/nov: a verba de construção é separada da de manutenção. [gdd.md:1391-1395]

**5. Ligações**
- Gosto/população: voto por inauguração. [gdd.md:1802]
- Leis: Prioridade das obras; incentivos ao setor. [gdd.md:1781-1782, 1794-1795]
- Mundo: importar cimento, trazer operários de fora (papel). [gdd.md:1798-1799]

**6. Referências** **ESTUDAR** (o Mehr, Irã, trata só de obra de casa pelo Estado:
leis - Economia - estudos.tsv:74)

**7. No motor hoje**
- Pela metade: fila da construção civil, capacidade e corrupção que atrasa (por setor).
  [mecanicas.md:314-318]

**8. Em aberto**
- Duas filas na mesma capacidade, lei Prioridade das obras. [mecanicas.md:323-324]

### III.11.8 Transporte (09/nov)

**1. O que é**
O presidente só assina o que é federal; ônibus, passagem, rodízio e estacionamento são
municipais. [gdd.md:1806-1808]

**2. O que o jogador faz e sente**
- Dá a Verba de conservação e a fatia Transportes da Verba de construção; o órgão
  reparte, linhas e rotas são automáticas. [gdd.md:1811-1812]
- Megaobra e Encomendar usina são escolha direta, com papéis. [gdd.md:1820-1821]

**3. Peças**
- Cada lei diz quem é atendido e quem paga. [gdd.md:1809-1810]
- Táxi e aplicativo; carro elétrico; Peso da multa. [gdd.md:1813-1819]

**4. Regras decididas**
- 09/nov: o federal age por regra geral ou programa, como o passe livre onde a cidade
  aderir. [gdd.md:1807-1808]

**5. Ligações**
- Gosto/população: direito de quem trabalha vai para Trabalho; família removida por
  obra vai para Moradia. [gdd.md:1809-1810]
- Leis: as acima. [gdd.md:1811-1819]
- Mundo: —

**6. Referências** **ESTUDAR**

**7. No motor hoje** Falta. [mecanicas.md:394-400]

**8. Em aberto** — (sem pergunta aberta na fonte)

### III.11.9 Cultura e patrimônio (09/nov)

**1. O que é**
Uma fila no órgão de Patrimônio, com a forma da fila de Terra: Pedido, Estudo, Decisão,
Conservação. [gdd.md:1825-1828]

**2. O que o jogador faz e sente**
- Empurra uma etapa por lei; o partido não escolhe o casarão. [gdd.md:1826-1828]
- Cada sim é conta para sempre; cada não é definitivo. [gdd.md:1837-1839]
- Efeito: quem pediu aprova, quem perdeu reclama, e o que é protegido leva turista a
  Hotel e restaurante. [gdd.md:1842-1843]

**3. Peças**
- Dois tipos de pedido: proteger e retirar. [gdd.md:1829-1830]
- Símbolo de fé segue a Religião do Estado. [gdd.md:1832-1834]
- Estátua vira disputa entre grupos. [gdd.md:1835-1836]
- Fora da fila: Verba de cultura e esporte, Conteúdo nacional, Meia-entrada, Sediar
  grande evento. [gdd.md:1847-1849]
- Fora do jogo: clube, torcida, estádio e categoria feminina. [gdd.md:1850-1851]

**4. Regras decididas**
- 09/nov: o órgão resolve os casos calmos; o disputado vira papel. [gdd.md:1831]
- 09/nov: a fila deve nascer genérica (serve a Terra e ao Patrimônio). [gdd.md:1852]

**5. Ligações**
- Gosto/população: os grupos pedem sozinhos, conforme tamanho e insatisfação. [gdd.md:1825-1826]
- Leis: Quem pode pedir, O que pode ser protegido, Direito do dono, Preço de museu e
  parque federal. [gdd.md:1827-1828]
- Mundo: turismo. [gdd.md:1842-1843]

**6. Referências** **ESTUDAR**

**7. No motor hoje** Falta. [mecanicas.md:394-400]

**8. Em aberto**
- A fila genérica nasce uma vez só. [mecanicas.md:402-403; gdd.md:1852]

### III.11.10 Defesa civil (09/nov)

**1. O que é**
O desastre chega sozinho; o estrago é a gravidade menos o índice Preparo contra
desastres, que sobe devagar com verba e cai sozinho a cada turno. [gdd.md:1856-1858]

**2. O que o jogador faz e sente**
- Dá verba e escolhe a resposta nos papéis (enchente, encosta, barragem, prefeito pede
  ajuda, incêndio, reconstrução). [gdd.md:1869-1875]
- Cortar a verba sobra dinheiro agora e a conta vem no desastre seguinte. [gdd.md:1857-1858]
- Sente gente com nome e voz no papel. [gdd.md:1866-1868]

**3. Peças**
- O partido não opera: bombeiros são dos estados; o federal dá dinheiro e regra. [gdd.md:1859-1861]
- Governador aliado faz a verba render mais. [gdd.md:1862-1863]
- Leis: Verba da defesa civil (Prevenção, Resposta, Reconstrução), Alerta de desastre,
  Reserva de emergência, Ajuda a quem perdeu a casa, Verba só com regra de área de
  risco. [gdd.md:1876-1878]

**4. Regras decididas**
- 09/nov: o jogador não escolhe a região socorrida; a ajuda segue a gravidade. [gdd.md:1860-1861]

**5. Ligações**
- Gosto/população: o papel tem povo; a mesma notícia sai na mídia. [gdd.md:1866-1868]
- Leis: as acima. [gdd.md:1876-1878]
- Mundo: o clima define a gravidade. [gdd.md:1856]

**6. Referências** **ESTUDAR**

**7. No motor hoje** Falta. [mecanicas.md:394-400]

**8. Em aberto** — (sem pergunta aberta na fonte)

### III.11.11 Minério e petróleo (09/nov)

**1. O que é**
Instituição própria de petróleo, gás, combustíveis e minério. [gdd.md:1667-1668]

**2. O que o jogador faz e sente**
- Não escolhe mina: a lei decide quem fica com o dinheiro e quem paga a conta; a
  companhia abre onde dá lucro. [gdd.md:1882-1883]
- Sente quem aparece (garimpeiro, cidade da mina, aldeia, vila abaixo da barragem) e o
  Preço do combustível. [gdd.md:1885-1891]

**3. Peças**
- Leis: Imposto sobre o minério, Garimpo, Áreas abertas à mineração, Parte do dono da
  terra, Prazo para acabar com barragem velha, O que a mina deixa quando fecha, De
  onde veio o ouro. [gdd.md:1892-1894]
- Reaproveita Destino dos royalties, Garantia contra acidentes, Imposto e Controle de
  exportação (com minério e terras raras como setores). [gdd.md:1895-1898]
- Papéis: barragem, garimpeiros, mina que fecha, mineradora que ameaça demitir.
  [gdd.md:1899-1902]

**4. Regras decididas**
- 09/nov: sem índice próprio para o minério. [gdd.md:1884-1885]
- 11/nov: o índice Preço do combustível existe para o Subsídio e o Imposto sobre
  combustíveis; dele saem o frete, o preço da comida e o papel do caminhoneiro. [gdd.md:1885-1888]

**5. Ligações**
- Gosto/população: mina fechando aparece no Desemprego. [gdd.md:1884-1885]
- Leis: as acima. [gdd.md:1892-1898]
- Mundo: Controle de exportação. [gdd.md:1896-1897]

**6. Referências** **ESTUDAR**

**7. No motor hoje** Falta. [mecanicas.md:394-400]

**8. Em aberto** — (sem pergunta aberta na fonte)

### III.11.12 Serviços do Estado

**1. O que é**
Prédios do Estado fora do mercado (hospital, escola, delegacia, tribunal, presídio,
quartel, repartição), pagos pelo orçamento, que dão emprego e salário sem lucro.
[gdd.md:1396-1398]

**2. O que o jogador faz e sente**
- Cortar verba fecha prédio, demite pop e reduz o serviço. [gdd.md:1398]
- Pode terceirizar por lei o que aceita terceirização. [gdd.md:1399-1400]

**3. Peças** Serviço do Estado como "dono": verba por lei, sem lucro. [leis - Economia -
donos.tsv:9]

**4. Regras decididas** — (sem data na fonte)

**5. Ligações**
- Gosto/população: salário público vira renda. [leis - Economia - donos.tsv:9]
- Leis: terceirização; verba por instituição. [gdd.md:1399-1400]
- Mundo: —

**6. Referências**
- Preso barato tira vaga do livre (Poyker); presídio terceirizado prende mais tempo
  (Mukherjee). [leis - Economia - estudos.tsv:42, 105]

**7. No motor hoje**
- Falta: hospital, escola, delegacia como prédios fora do mercado (R16.31 ☐);
  terceirizar por lei (R16.32 ☐). [requisitos.md:395-396; mecanicas.md:407-408]

**8. Em aberto**
- Quais serviços do Estado aceitam terceirização além dos já listados na planilha.
  [gdd.md:2132]

---

## III.12 Contas do Estado

> **Lugar em aberto: Economia ou Estado.** Esta subseção fica aqui até o autor
> decidir se as contas do Estado moram na Economia ou na Parte V (Estado). O esqueleto
> do GDD novo já traz "Estado (lugar em aberto)". [docs/jogo/gdd-novo/00-inventario.md,
> seção "Esqueleto do GDD novo"]

**1. O que é**
O Tesouro em cinco contas separadas: receita, gasto, juros, cofre e dívida. Juros não
descontam da receita: são uma linha própria. [contas.md:1-4, 6-12]

**2. O que o jogador faz e sente**
- Escolhe impostos, verbas, regra fiscal e a política de déficit e superávit; vê o
  dinheiro na moeda do país, por ano, além de % do PIB. [gdd.md:745; contas.md:14-23]
- Cada regra fiscal abre a sua figura (envelopes com cadeado, cofrinho, velocímetro,
  caixa d'água, luzes de painel, pente fino, escada de vencimentos, barra de reserva).
  [gdd.md:1525-1531]
- Sente o cadeado: a verba trava na marca e diz "travado por lei"; em crise, "só X%
  livre para cortar". [gdd.md:1532-1536]
- Em crise pode suspender a regra fiscal por ato; se a crise é real a Credibilidade
  fiscal cai pouco, se não, cai muito. [gdd.md:1523-1524]

**3. Peças**
- **Receita:** leis com cálculo mais `receita_fora_das_leis` (o imposto que ainda não
  virou lei). **Gasto:** leis de gasto mais `gasto_fora_das_leis`. **Juros:** taxa
  × dívida. **Cofre** e **Dívida** são estoques. [contas.md:6-12, 33-37]
- **Primário e nominal:** primário = receita − gasto; nominal = primário − juros.
  [contas.md:14-15]
- **Falta (lei Déficit):** fração paga pelo cofre; o resto vira dívida; sem cofre,
  tudo vira dívida. **Sobra (lei Superávit):** fração que vai ao cofre; o resto abate
  a dívida. Sem as leis, a falta sai do cofre e a sobra vai ao cofre. [contas.md:17-23;
  gdd.md:736-737]
- **Juros** sobem com dívida acima da tolerância e com inflação. [gdd.md:738;
  calculos.md:42-54]
- **Impostos por base:** curva de Laffer com evasão (`t × R × (1 − t)^e × (1 − evasão)`),
  pico declarado pelo país; consumo, lucro e emissões usam a mesma curva; a onda 1
  traz patrimônio, aplicações, imóvel, capital, movimentação, folha e bancos, com
  `incide` por estrato. [calculos.md:6-40]
- **Regra fiscal em 4 leis (08/nov):** Meta de resultado, Teto de gasto, Limite da
  dívida e Punição se descumprir. [gdd.md:1522-1523] No motor: quatro regras checadas
  pelo papel (teto de gasto, meta de resultado, limite da dívida, teto da carga);
  a punição vale enquanto houver regra estourada (corte, trava, crime); o piso da verba
  não desce abaixo de `piso × arrecadação`. [fisco.md:23-37]
- **Gasto mínimo obrigatório,** **Revisão de gastos** (recupera parte do que cada área
  perde no caminho, cerca de 1/4 na média, 1/2 na base zero, valores de partida),
  **Prazo da dívida,** **Fundo soberano.** [gdd.md:1529-1539]
- **Dívida em moeda de fora:** juros menores, mas sobe junto quando a moeda cai (dívida
  de 80% do PIB, 30% em moeda de fora, moeda cai 20%: vai a 84,8%). [gdd.md:1540-1542]
- **Transferência** com cobertura: o excesso vai ao estrato de cima. [fisco.md:7-13]
- **Conta da previdência:** déficit = benefícios − contribuição da folha. [fisco.md:39-45]
- **Emissão de moeda** cobre falta sem dívida e paga em inflação; **Calote** apaga dívida
  e derruba reputação, juros e investimento por anos. [gdd.md:739-740]
- **Bens do Estado:** estatais e ações rendem lucro e dividendo ao cofre e podem ser
  vendidos. [gdd.md:743-744]
- **Estatal** paga obra do cofre; sem cofre, da dívida. [gdd.md:1460-1461]

**4. Regras decididas**
- Princípio 5 (sem data): a conta sempre fecha para o dinheiro do Estado: entra por lei
  ou bem do Estado, sai por lei ou obrigação; gastar exige imposto, dívida ou emissão.
  [gdd.md:107-112]
- 08/nov: regra fiscal em 4 leis; cada lei abre a sua figura; gasto mínimo mostrado com
  cadeado; revisão de gastos; dívida em moeda de fora. [gdd.md:1520-1542]
- Passo 5 (sem data): a dívida não vence; o governo paga os juros e rola o principal.
  [contas.md:25]
- Invariante: a variação de cofre − dívida é igual ao resultado nominal do turno.
  [contas.md:30-31]
- 02/nov: Déficit e Superávit entram em `contas`. [mercado.md:341]

**5. Ligações**
- Gosto/população: imposto de renda e transferência são hoje o único bolso que se mexe;
  a lei de cobertura muda quem recebe. [mecanicas.md:56-60; fisco.md:7-13]
- Leis: imposto (curva), verba, regra fiscal, Déficit, Superávit. [calculos.md:6-40;
  fisco.md:23-37]
- Mundo: dívida em moeda de fora depende do câmbio; juros somam o risco do país.
  [gdd.md:1540-1542; leis - Economia - dinheiro.tsv:3]

**6. Referências**
- Estudo de 22/out (antes do recomeço de 31/out, só ideia): Democracy 4 e Victoria 3
  para PIB, receita e gasto, dívida, juros e crise, tempo e suavização. As partes
  "SisGov hoje" desse estudo estão velhas (cita Selic e turno trimestral).
  [estudo-vic3-d4:3-13, 15-33, 37-198; CLAUDE.md do projeto, recomeço de 31/out]
- Victoria 3: imposto por 5 níveis (por pessoa, terra, consumo, renda, dividendos);
  gastos são salários e insumos dos prédios do governo; déficit vira dívida.
  [pesquisa:71-72]
- Saez, Slemrod e Giertz (Laffer); Reinhart, Rogoff e Savastano; Laubach; Clarida, Galí
  e Gertler. [calculos.md:12-13, 46-54]
- Estudos de impostos: fortunas arrecadam pouco e afastam ricos; fiscalizar os mais
  ricos devolve mais de 6 dólares por dólar; anistias repetidas aumentam a sonegação.
  [leis - Economia - estudos.tsv:76, 80, 79]
- Pesquisa de jogadores: orçamento como número único sem sentir o custo (Suzerain);
  "é a economia e me sinto burro" (Democracy 4). [pesquisa:49-54]

**7. No motor hoje**
- Feito: receita, gasto, juros, cofre e dívida separados (R10.1 ✅); juros sobem com
  dívida e inflação (R10.2 ✅); regra fiscal por lei (R10.3 ✅). [requisitos.md:210, 212-213;
  mecanicas.md:517-518]
- Pela metade: dinheiro na moeda do país (R10.4 ◐). [requisitos.md:214; mecanicas.md:547]
- Falta: caminho do dinheiro (R10.7 ☐); emissão de moeda (R10.5 ☐); calote (R10.6 ☐).
  [requisitos.md:211, 215-216; mecanicas.md:524-525, 538]
- Falta: dívida externa e prazo da dívida (fora do passo 5); simplificado hoje: uma taxa
  só e prêmio linear. [contas.md:46; calculos.md:56-57]
- Falta: estoque de dívidas de quem sonega e Anistia fiscal. [leis - Economia - como
  funciona.tsv:29]

**8. Em aberto**
- Calibrar: os juros comem 16% do PIB e a dívida vai de 78% a 107% em 24 turnos
  (R4.3). [mecanicas.md:519-520; requisitos.md:62]
- Custo fixo por ministério e por cargo; quanto a corrupção some de verdade; o
  dinheiro "fora das leis" de hoje. [mecanicas.md:532-534]
- Estatais e ações rendendo ao cofre (ligado à seção III.9). [mecanicas.md:542-543]
- ⚠ CONFLITO (o que a regra fiscal verifica): o GDD descreve 4 leis (Meta de resultado,
  Teto de gasto, Limite da dívida e Punição) [gdd.md:1522-1523]; o motor checa 4 regras
  (teto de gasto, meta de resultado, limite da dívida e **teto da carga**), com a
  punição à parte [fisco.md:23-37]. Sem data de decisão; não escolhi.
- ⚠ CONFLITO (dívida): o GDD de 08/nov traz Prazo da dívida (escada de vencimentos) e
  dívida em moeda de fora [gdd.md:1530-1542]; o motor diz que a dívida não vence e que
  dívida externa e prazo ficam fora [contas.md:25, 46; calculos.md:56]. É desenho ×
  motor de hoje, não revogação.
- Princípio 5 × 14/nov: ver o conflito na seção III.6. [gdd.md:107-112; mecanicas.md:52-53]
- Quanto o Estado paga em salários, compras e obras de cada instituição: a divisão não
  é fixa. [pedido do autor nesta rodada, sem linha em arquivo; ver III.6]

---

## Para o revisor

### (a) Todos os ⚠ CONFLITO

1. **Princípio 5 × 14/nov** (III.6, III.12): "a conta sempre fecha" só para o
   dinheiro do Estado [gdd.md:107-112] × "nenhum dinheiro some", toda a economia
   [mecanicas.md:52-53, 279-290].
2. **Corrupção apaga ou não o dinheiro** (III.6): "parte do dinheiro some de verdade"
   [gdd.md:2105-2108; requisitos.md:211] × a corrupção "não apaga dinheiro"
   [mecanicas.md:285-287, 530-531] (e o mesmo mapa ainda lista "quanto a corrupção
   some de verdade" como a pensar, mecanicas.md:533-534).
3. **Tipos de dono** (III.4): 5 [gdd.md:1452-1455; mecanicas.md:341] × 6
   [gdd.md:1438-1445] × 9 [leis - Economia - donos.tsv:2-10].
4. **Modelo da cesta** (III.5): mesma quantia por pessoa [mercado.md:113-116] × fatia da
   renda por estrato [leis - Economia - cesta.tsv:2-14; gdd.md:1409-1411].
5. **Blocos da bolsa** (III.8): "blocos de 2%" [requisitos.md:388] × "sem blocos fixos"
   [gdd.md:1498] × "preço do bloco" [gdd.md:1500].
6. **Verba da estatal por lei ou por setor** (III.9): [gdd.md:1579-1580] × pergunta
   ainda aberta [gdd.md:2140].
7. **Ficha por setor com projeto de lei (Fatia 8, 02/nov) × Operação sobre companhia
   (GDD 08/nov)** (III.9): [mercado.md:281-286, 296-313, 337-338] × [gdd.md:1573-1575].
8. **Quem fica sem luz** (III.11.1): civis primeiro, automático (02/nov)
   [mercado.md:232-237] × o jogador escolhe quem fica sem luz (08/nov) [gdd.md:1648-1649].
9. **Energia como produto** (III.11.1): "saiu da tabela de produtos" (02/nov)
   [mercado.md:274-275] × energia como produto nas planilhas e como índices [leis -
   Economia - consumo.tsv:30-31; gdd.md:1634-1635].
10. **3 leis de "quem" da energia** (III.11.1): criadas na Fatia 7 [mercado.md:250-255] e
    substituídas pela ficha de setor na Fatia 8, mesmo dia [mercado.md:337-338]; o GDD
    de 08/nov não cita nenhuma das duas.
11. **O que a regra fiscal verifica** (III.12): 4 leis com Punição [gdd.md:1522-1523] ×
    4 regras com teto da carga [fisco.md:23-37].
12. **Dívida** (III.12): prazo e moeda de fora no GDD [gdd.md:1530-1542] × "a dívida não
    vence" e dívida externa fora do passo [contas.md:25, 46]. (Desenho × motor de hoje.)

Divergências que anotei como "estado", não como conflito de regra: setores 15 (GDD)
× 7 no motor [gdd.md:1306; mercado.md:14-16]; moradia em 3 faixas (07/nov) × estoque
agregado no motor [gdd.md:1337-1339; moradia.md:3-12]; obra "já tem" por setor ×
☐ por prédio [mecanicas.md:314-318; requisitos.md:375, 377].

### (b) O que ficou ESTUDAR

- Referência (jogo ou estudo) de: Energia, Agricultura e pesca, Ciência e pesquisa,
  Meio ambiente, Construção civil, Transporte, Cultura e patrimônio, Defesa civil,
  Minério e petróleo.
- Fontes da "evidência" do Comércio exterior (tarifa, portos, zonas francas) [gdd.md:1625-1627].
- Peso da meta de inflação, números de alvo e do prêmio de risco do Banco Central.
- Referência de jogo para compra e venda de estatal (III.9).
- Números ainda sem decisão: custo e prazo de cada tipo de obra; quanto do lucro vai
  aos investidores; velocidade do êxodo; calibragem dos juros (R4.3).

### (c) Fontes não lidas ou lidas só em parte

- Pedido do autor sem linha em arquivo (marcado no texto): preço calculado uma vez por
  turno (14/nov); a divisão da verba (pessoal, compras, obras) não é fixa. Não achei
  essas duas frases em nenhum arquivo lido.
- `leis - Economia - estudos.tsv`: li só as linhas de economia e moradia; Justiça,
  Segurança pública, Direitos, Estado e eleições, Comunicação, Vícios e Defesa foram
  passadas (fora desta parte).
- `leis - Economia - prédios.tsv`: li as quatro primeiras colunas (setor, prédio,
  produz, usa); não li "quem emprega", "dono privado comum", "hoje" e "pode ser
  terceirizado" da planilha inteira.
- `leis - Economia - como funciona.tsv`: as linhas de Justiça e Mídia (30-47) são de
  outras partes e não entraram.
- `leis - Leis - roteiro.tsv` (roteiro de 8 passos da lei): só o cabeçalho; é da Parte IV.
- `leis - Pops - como funciona.tsv`, `Pops - dados` e `Grupos`: não lidos; a renda do
  pop (salário, lucro, aluguel, transferência) é ligação com a Parte II.
- `docs/jogo/gdd.md`: li as seções 2, 3, 9, 10, 16 e trechos da 18; não li 4 a 8, 11 a 15,
  17, 19, 20.
- `docs/jogo/mecanicas.md`: li o índice, a base, 3.5, 4.1-4.2, 5, 6.8 e 8; não li o resto.
- `docs/jogo/requisitos.md`: li R4.3, R9, R10 e R16.
- `docs/jogo/estudos/victoria3-e-democracy4.md`: li inteiro, mas é de 22/out (antes do
  recomeço de 31/out).
- Código `src/motor/mercado/*.ts` e `src/motor/contas`, `fisco`: não abertos, só os `.md`.
- Não lidos por serem de outras partes ou fora do pedido: `o-que-e-uma-lei.md`,
  `plano-de-desenvolvimento.md`, `indices-avaliacao.md`, `leis.xlsx`, `gdd.xlsx`,
  `RETOMAR.md` (só grep).
- Memórias lidas: as de mercado indireto, órgãos e verba, base em ciclo, dados rasos,
  leis x decisões, resultado emerge, lei ou processo, países reais, jogável não é
  demorado; as demais ("como trabalhar") foram ignoradas como pedido.
- Nota do redator: a coluna "Total" da cesta está vazia na planilha; as três colunas
  (pobre, médio, rico) somam 100 na conta que fiz. [leis - Economia - cesta.tsv:2-15]
