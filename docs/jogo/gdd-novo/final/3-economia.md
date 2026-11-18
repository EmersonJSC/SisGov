## Parte 3. Economia

A Economia é um dos três pilares do jogo (Gosto, Economia, Leis). Ela paga os pops
e o Estado, e é controlada pelos dois. O Mundo não é pilar: outros países, comércio
e preços de fora pressionam os três.

**O que o jogador faz:** cria as condições (imposto, juro, regra, verba,
propriedade) e, como Estado, compra, vende e patrocina. Quem produz e constrói é a
economia.

**O ciclo.** População, Economia e Governo controlam uns aos outros, com a
População no centro. A população trabalha, consome e investe. A economia paga
salário, dá emprego e define preços. A economia gera o dinheiro dos impostos. O
governo cobra, gasta e regula por lei. A bolsa é onde o ciclo vira preço: lei muda
lucro, lucro muda a ação, a ação muda o patrimônio dos pops, e os pops reagem no
voto e no investimento.

**A lei não diz quem gosta dela (14/nov).** Ela diz onde mexe no dinheiro e na vida
(quem paga, quem recebe, que preço sobe, que emprego abre). O motor calcula o efeito
em cada pop. Toda lei chega ao pop por renda, emprego, preço, serviço ou direito.

**Nenhum dinheiro some (14/nov).** Todo real cobrado ou gasto tem caminho: circula,
fica guardado ou sai do país, mesmo o ilegal. O caminho do dinheiro é a 3.6.

**Modelo de base (14/nov):** o do Victoria 3 (prédios, bens, mercados, pops com
emprego, salário e padrão de vida), atualizado para hoje.
- Levar do Victoria 3: pop no centro (prédio sem gente não produz); necessidades
  atendidas por vários bens, com preferência; padrão de vida; padrão caindo ou
  desemprego radicaliza; riqueza dá peso político; dono recebe o lucro e investe
  parte; impostos por tipo de base; déficit vira dívida.
- Mudar em relação ao Victoria 3: o dinheiro se conserva (lá os bens surgem do nada
  e a sobra é vendida "ao vazio"); ciclo econômico e crise (lá não há); o jogador
  não constrói prédio (lá virou "jogo de construção").
- Atualizar para hoje (lá não existe, nada a copiar): serviços como setor maior,
  trabalho informal, crédito e bancos, banco central e inflação, economia digital,
  capital entrando e saindo do país.

**Ordem decidida (14/nov):** primeiro o dinheiro (caminho e conservação), depois o
gosto pelo bolso, depois a revisão das leis instituição por instituição.

**Hoje no motor (conferido em 14/nov):** a satisfação do grupo lê renda, índices
cobrados e bússola das leis; o bolso só se mexe por imposto de renda e
transferência; a verba gasta não chega a ninguém, exceto a transferência.

**Glossário curto da Economia (08/nov).** Companhia é a dona, com ações, reserva de
investimento e várias empresas. Empresa é a parte de uma companhia em um setor, um
conjunto de prédios. Prédio é a unidade que produz ou presta serviço. Obra é o ato
de construir um prédio novo, na fila da construção civil. Órgão é o mesmo que
instituição: recebe a verba por lei e executa; o jogador dá a verba, não escolhe
fábrica nem fazenda. Ação (cota) dá dividendo, não dá mando. Estatal é empresa cujo
dono é o Estado. Serviço do Estado é prédio do Estado fora do mercado. (O glossário
completo vai ao Anexo.)

---

### 3.1 Mercado e produtos

**O que é**
O mercado é onde setores e produtos do mundo têm oferta, demanda e preço, no país e
no mundo.

**O jogador**
- Não existe lei que dê lucro à carne ou ao aço. As leis mexem em todas as
  empresas, na demanda ou no custo, e a cadeia espalha o efeito. Subsídio para
  comprar máquinas aquece máquinas e, junto, o aço; o Bolsa Família faz as famílias
  comprarem alimento.
- Sente o preço e a falta: o que chega a cada pop depende de quanto há, de quanto
  custa e de quem pode pagar; falta de comida vira fome.
- Vê o mercado na janela "Mercado": produtos por setor, o que o país produz,
  importa (e de quem) e exporta; a aba Mundo mostra preço, seta de alta ou baixa e
  quem vende mais barato.

**Peças**
- **Setores:** 15, aprovados em 05/nov. Setor separa atividade, nunca tipo de bem:
  quem compra luxo é um pop, não um setor. A planilha lista os 15 com a seção da
  ONU, os prédios e os pops que trabalham ali.
- **Produtos** agrupados em setores, com cadeia entre eles (aço, máquinas,
  veículos). A cadeia liga uma empresa à outra na bolsa: lei que encarece o aço
  derruba o lucro da montadora.
- **Dois mercados:** o do país e o do mundo, com ciclos e choques. O país produz uma
  parte e compra o resto.
- **Cobertura:** quanto da demanda do país a produção atende. Passa a ser resultado
  (produção ÷ demanda), não número declarado.
- **Preço do mundo** (base 100, entre 40 e 250): anda 25% do caminho até o alvo por
  turno, mais ruído pequeno.
- **Preço do país:** faixa de 25% a 175% do preço base, misturada com o preço do
  mundo conforme a importação.
- **Ciclo e choque:** a demanda do mundo ondula (24 turnos = 4 anos); choques de
  preço somem aos poucos.
- **Cestas e fome:** comida e remédios são as duas cestas em código; a segurança
  alimentar sai do gasto com comida e da falta.
- **Prédios à vista, sem simular um a um:** o produto declara uma unidade (ex.:
  "fazendas") e a tela mostra "≈ N unidades".

**Regras**
- 02/nov: setores e produtos são do mundo; o motor não conhece nomes.
- 02/nov: o país declara cobertura por produto; o mundo declara quem fornece;
  importa = o que falta para 100, exporta = o que passa de 100.
- 02/nov: dois mercados, preço do mundo por oferta e demanda, choque com 2% de
  chance por produto e por turno.
- 02/nov: demanda de comida = população × cesta; Grãos, Frutas e Alimentos atendem a
  mesma necessidade e o pop troca pelo preço.
- 02/nov: segurança alimentar = 100 − gasto com comida − falta; fome leve abaixo de
  40 e grave abaixo de 20 (pontos de partida).
- 02/nov: o índice abastecimento (0 a 100) é cobrado pelos grupos; fome grave
  derruba saúde e reputação, abastecimento melhor faz o contrário.
- 08/nov: o mercado se move por demanda e custo, nunca por lei de produto.
- 14/nov: produto que falta vem do mercado do mundo (de quem tem sobra) ou fica
  faltando (preço sobe, fome, fila); nunca aparece do nada. A sobra é vendida a
  alguém ou fica parada; nunca vai "ao vazio".
- 14/nov: pop compra o que precisa e paga imposto; cada necessidade é atendida por
  vários produtos com preferência e regras próprias (energia de casa: eletricidade,
  gás ou lenha; lenha quando a luz falta ou encarece).
- 14/nov: o preço é calculado uma vez por turno (2 meses).
- Sem data: setores com regra própria são moradia, remédios e militar (demanda pelo
  tamanho das forças).

**Ligações**
- Gosto: demanda dos pops; fome e carência mexem em saúde, pobreza e apoio dos
  grupos pobres.
- Leis: tarifa, subsídio, custo e demanda (nunca preço ou lucro direto).
- Mundo: potências com sobra fornecem o que falta; o preço do mundo vem delas; o
  Mundo pressiona preço, comércio e sanção.

**Referências**
- Victoria 3: preço sobe quando a compra passa da venda; fórmula
  `base × [1 + 0,75 × clamp(...)]`, entre 25% e 175%; falta e sobra (perda de
  produção na falta grande). ([referência do mercado do Victoria 3](../../mercado-vic3-referencia.md))
- Pesquisa de jogadores: preço por oferta e procura sem estoque; crítica ao Victoria
  3 por criar bens para cobrir falta e vender a sobra "ao vazio".
  ([pesquisa](../../estudos/pesquisa-jogadores-14nov.md))
- Estudo da ONU (ISIC) para os setores.

**No motor hoje**
- ✅ Produtos em setores, mercado do país e do mundo (R16.1) e demanda dos pops com
  fome (R16.2).
- ✅ Ciclo de 4 anos e choques no preço do mundo (fatia 5a).
- ✅ Preço do país e do mundo "funciona"; 23 produtos em 7 setores (os 15 setores
  aprovados são a meta).
- ◐ Cadeia entre setores (R16.5).
- ◐ Demanda só da cesta de comida e de remédio, sem demanda por setor.
- ☐ Setores com regra própria (R16.6).
- ☐ Os outros 18 produtos com a mesma regra da comida.

**Em aberto**
- Os 15 setores aprovados contra os 7 do motor (essenciais, infraestrutura,
  indústria, tecnologia, militar, luxo, construção civil): o estudo diz que Luxo e
  Essenciais são tipo de bem, não atividade.
- Ciclo e crise "de verdade" só quando o mundo tiver países funcionando.
- Pesos 0,5 / 0,2 / 0,3 e cesta de 12% da renda são pontos de partida a ajustar
  medindo.
- "Marcas na régua" e outros números de calibração seguem a regra de ordem de
  grandeza, sem precisão empírica.

---

### 3.2 Empresas, prédios e obras

**O que é**
Prédio é a unidade que produz, emprega e dá lucro; empresa é um conjunto de prédios
de um setor; obra é o ato de construir prédio novo.

**O jogador**
- Não constrói prédio: a lei dá condição e a economia constrói. Vê os prédios em
  conjunto ("≈ N fazendas").
- Dá a verba e escolhe as leis; o órgão age sozinho.
- Sente o PIB subir quando uma obra termina e cair quando um prédio fecha. Sente a
  corrupção que atrasa e encarece obra.

**Peças**
- **Prédio:** produz, emprega e dá lucro; o PIB é a soma do que os prédios
  produzem; as bases dos impostos saem dos prédios e dos pops.
- **Método de produção** (insumos, produto, empregos).
- **Insumos e cadeia:** um prédio compra do outro (aço vira máquina). A planilha
  lista os prédios por setor, o que produzem e usam, quem emprega e se pode ser
  terceirizado.
- **Empresa e companhia:** o país declara as de partida.
- **Obra e fila:** cada tipo tem custo e prazo; obra difícil pesa mais; a construção
  civil decide quantas andam ao mesmo tempo.
- **Verba de obra separada (07/nov):** a verba de cada área mantém o que existe
  (salários e insumos); construir é a Verba de construção, dividida em 100% entre as
  áreas, na instituição Infraestrutura e transporte. Prédio pronto sem verba da área
  fica vazio.
- **Desgaste e fechamento:** prejuízo por vários turnos fecha o prédio e demite.
- **Prédio precisa de gente;** o desemprego sai daí.
- **Terceirizar** por lei o que aceita terceirização (segurança, presídios,
  hospitais, escolas).

**Regras**
- 03/nov (construções, pilar 1): capacidade por setor; desgaste de 4% ao ano;
  investimento privado abre obras; juro acima do equilíbrio tira 8% por ponto;
  imposto sobre lucro acima do turno 0 tira 3% por ponto; construção civil limita o
  volume (1,5× o ritmo do turno 0).
- 03/nov: corrupção alonga o prazo (até 2×) e encarece a obra (até +50%).
- 03/nov: o investimento vai para onde a margem melhorou; 3 turnos seguidos de
  prejuízo tiram 5% da capacidade por turno; setor do Estado nunca fecha.
- 07/nov: verba de obra separada da verba de manutenção.
- 14/nov: o investimento sai do lucro do dono; é ele que abre as obras (hoje sai de
  uma conta, sem dono).
- 14/nov: a divisão da verba de um órgão entre pessoal, compras e obras não é fixa.

**Ligações**
- Gosto: sem trabalhadores com a formação certa o prédio produz menos; quem não
  acha vaga vai para Desempregados.
- Leis: corrupção, juros, imposto sobre lucro e a lei Prioridade das obras.
- Mundo: insumo vem do país ou de fora, conforme a oferta nacional.

**Referências**
- Victoria 3: prédio com método de produção; produtividade e saldo; vazão; lucro vai
  ao caixa e a dividendos. ([referência](../../mercado-vic3-referencia.md))
- Pesquisa de jogadores: prédio sem pop não faz nada; métodos de produção definem
  insumo, produto e emprego; crítica de que o Victoria 3 virou "jogo de construção"
  e barra de progresso. ([pesquisa](../../estudos/pesquisa-jogadores-14nov.md))
- Estudo "Prédios e lucro", Victoria 3: vira prédio, dono e reserva, sem copiar
  nomes ou números.

**No motor hoje**
- ◐ Capacidade por setor, desgaste, investimento que abre obras, fila, corrupção
  que atrasa, lucro por setor e fechamento. É por setor, não por prédio (por isso
  as obras por prédio aparecem como ☐ abaixo).
- ☐ Prédios produzem, empregam e dão lucro, PIB é a soma (R16.7).
- ☐ Obra com custo e prazo por tipo (R16.8).
- ☐ Corrupção atrasa e encarece (R16.10).
- ◐ Empresas declaradas pelo país (R16.11), sem prédios; 5 empresas de teste.
- ☐ Ligar ao pop: a renda do pop ainda é parte fixa do PIB; demissão, salário e
  lucro do setor não chegam a ele (fatia 5b, adiada).

**Em aberto**
- Custo e prazo de cada tipo de obra (números).
- Duas filas (pública e privada) na mesma capacidade, lei Prioridade das obras.
- Como definir a divisão da verba de um órgão em pessoal, compras e obras (14/nov:
  ela não é fixa; falta decidir como o jogo a calcula).

---

### 3.3 Trabalho e salário

**O que é**
Cada prédio pede pops com um nível de qualificação (elementar, operacional, técnico,
superior) e paga um salário que nasce do piso do pop, da disputa por gente, do
lucro e das leis.

**O jogador**
- Mexe nas leis de trabalho (salário mínimo, participação nos lucros).
- Piso legal e negociação coletiva seguram quedas e aproximam salários.
- Sente desemprego e informalidade: sem vaga, a pessoa vai para Desempregados,
  Informais ou Autônomos.

**Peças** (modelo de 7 passos)
1. **Piso do pop:** a qualificação define o salário base e quem ocupa a vaga.
2. **Disputa por gente:** falta de qualificados sobe o salário; sobra segura.
3. **Teto pelo lucro:** o lucro limita a alta; prédio muito lucrativo paga bônus
   pequeno.
4. **Lei e negociação:** piso legal e sindicato seguram quedas.
5. **Queda lenta:** o salário cai devagar; antes de cair muito, o prédio demite.
6. **Formação:** salário alto atrai estudo e, depois de anos, mais gente qualificada.
7. **Estado disputa:** salário público é por lei, mas salário baixo perde gente para
   o privado.

Peças da planilha: vaga por pop e por nível; piso (salário mínimo só vale para o
emprego formal, alto demais empurra para o informal); desemprego; informal; falta de
gente (vaga aberta reduz produção); formação; salário público; gente disponível
(entra quem se forma e quem vem de fora; sai quem se aposenta, emigra ou muda de
setor; vagas são por pop, não por profissão). Tabela de qualificação por pop (nível,
anos de formação, salário base × piso, força para negociar, vínculo).

**Regras**
- Sem data: o salário cai devagar.
- Sem data: vagas são por pop, não por profissão (decisão do autor).
- Sem data: desemprego e falta de gente são "conserto aprovado".
- Salário público é por lei, mas se ficar baixo o Estado perde gente.

**Ligações**
- Gosto: a renda do pop vem de salário, lucro, aluguel e transferência (R16.26).
- Leis: salário mínimo, jornada, sindicatos; encargo alto empurra para o informal.
- Mundo: vem gente de fora e sai gente por emigração.

**Referências**
- Victoria 3: prédio com vaga aumenta salário até o lucro acabar; com prejuízo
  reduz. O Victoria 3 não explica como o salário é fixado; não copiar o que não se
  sabe. ([referência](../../mercado-vic3-referencia.md))
- OIT: quatro níveis de habilidade; renda do trabalho em cerca de 52% do PIB
  mundial.
- Lucro maior aumenta salário, efeito pequeno (Blanchflower e outros); acordo
  coletivo reduz a diferença (Mannheim).
- Salário mínimo mexe pouco no emprego total em países em desenvolvimento (Fang e
  Ha).

**No motor hoje**
- ☐ Falta de trabalhador freia a produção e o desemprego sai daí (R16.27);
  contratação por qualificação (R16.37).
- ◐ Informal (parte com Seguro na folha) e formação (mudar de setor existe).
- Hoje o emprego é medido a partir da renda dos pops; nada contrata.

**Em aberto**
- Quanto falta de trabalhador freia a produção.
- Quanto o salário cai devagar antes de o prédio demitir.
- Como a renda do pop sai de salário e lucro sem o turno 0 mudar de valor.
- Quando alguém sai: o que leva à informalidade, à fuga de dinheiro e à emigração.

---

### 3.4 Lucro e donos

**O que é**
O lucro é o que sobra da receita do prédio depois de insumos, salários, encargos,
desgaste, juros e imposto. Ele vai para o dono, que gasta uma parte e investe outra.

**O jogador**
- Mexe no lucro só por leis gerais (imposto sobre lucro, remessa, salário mínimo,
  dividendos), nunca num produto.
- O Estado patrocina: lei de incentivo, crédito barato ou obra pública puxa o
  investimento privado para um setor sem o Estado ser dono.
- Sente lucro concentrado nos donos, lucro que sai do país, estatal que devolve ao
  cofre.

**Peças**
- **Caminho do lucro, 14 passos** (exemplo com receita de 100): vender (100);
  comprar insumos (−40); valor adicionado (a soma de todos é o PIB); pagar salários
  (−30); encargos (−5); guardar para o desgaste (−6); pagar juros (−3); lucro antes
  do imposto; imposto sobre lucro (−4); lucro líquido (12); reinvestir (−7,8); pagar
  dividendo (−4,2); virar renda do pop; abrir nova obra.
- **Tipos de dono (os 9 da planilha, valem por enquanto):** privado nacional,
  empresa na bolsa, estrangeiro, estatal, mista, cooperativa, conta própria, serviço
  do Estado e entidade sem lucro (igrejas e beneficentes; a fé vive nos grupos, o
  jogo não tem religiões com nome). O quadro de donos traz, para cada tipo,
  reinvestimento, lucro, ganho e custo.
- **Para onde vai o lucro:** privado nacional (investidores e reserva); estrangeiro
  (sai do país, pela lei de remessa); estatal (cofre); cooperativa (trabalhadores);
  mista (por cotas); conta própria (renda mista).
- **Reserva de investimento:** o lucro do privado enche a reserva, que abre obras
  nas empresas que dão mais lucro; juro alto encarece o crédito.
- **Estatal:** cresce quando o jogador põe verba por lei; paga do cofre, e sem cofre
  da dívida.
- **Leis de propriedade:** indenização, prazo, regra pós-venda, política estatal,
  triagem estrangeira, remessa de lucro, fábrica de fora, concorrência.

**Regras**
- Sem data (seção 16 do GDD): prejuízo por vários turnos fecha o prédio.
- 03/nov: imposto sobre lucro só incide se há lucro; margem relativa divide o
  investimento entre setores.
- 14/nov: o lucro vai ao bolso do dono (pop rico, Estado, fundo, estrangeiro); o
  dono gasta uma parte e investe outra, e o investimento abre as obras.
- 14/nov: os 9 tipos de dono da planilha valem por enquanto.
- Ponto de partida do estudo: 35% do lucro em dividendo (a conta de exemplo usa 65%
  reinvestido).

**Ligações**
- Gosto: dividendo vira renda dos pops donos, paga imposto e vira consumo ou
  poupança.
- Leis: imposto sobre empresas, imposto sobre dividendos, remessa de lucro,
  incentivos.
- Mundo: o lucro do estrangeiro sai do país.

**Referências**
- Victoria 3: lucro em parte para o caixa do prédio e o resto em dividendos aos
  donos; donos investem parte no fundo de investimento.
  ([referência](../../mercado-vic3-referencia.md); [pesquisa](../../estudos/pesquisa-jogadores-14nov.md))
- Contas nacionais (ONU e Eurostat): produção menos insumos dá valor adicionado; em
  negócio familiar salário e lucro se misturam (renda mista).
- Reinvestimento: 83% de 2.886 empresas britânicas usam reservas para investir.
- Dividendos em torno de 30% a 50% do lucro (MSCI, FactSet).
- Tipos de dono: **ESTUDAR** se os 9 fazem sentido, se falta ou sobra algum.

**No motor hoje**
- ✅ Imposto sobre lucro; obra e fila.
- ◐ Receita (capacidade × preço médio do setor), salário (não chega ao pop), reserva
  de investimento (taxa, sem dinheiro real).
- ☐ Dono e dividendo.
- ☐ Caminho do lucro (R16.9, R16.33), lucro vai ao dono (R16.12), reserva privada
  abre obras (R16.13).

**Em aberto**
- Quanto do lucro privado vai aos investidores e quanto à reserva.
- ESTUDAR os tipos de dono (14/nov): o GDD também fala em 5 tipos (Estado, privado
  nacional, estrangeiro, cooperativa, entidade sem lucro) e em 6 destinos do lucro;
  valem os 9 da planilha até o estudo.

---

### 3.5 Consumo e necessidades

**O que é**
Todo produto tem comprador (pops, pequenos mercados, mercados, outros prédios,
Estado, exterior). O pop compra pela cesta da sua renda.

**O jogador**
- Mexe na renda e no preço; o consumo muda. Quem ganha mais gasta parte menor com
  comida e poupa mais.
- Sente falta de comida (fome), conta de luz e preço de moradia.

**Peças**
- **Quem compra:** pops, pequenos mercados, mercados, outros prédios, Estado e
  exterior.
- **Cesta por estrato** (pobre, médio, rico, em % da renda; as três colunas somam
  100): comida 45/22/8, roupas 6/5/4, moradia e contas 22/22/15, casa 3/5/6, saúde
  5/8/7, infraestrutura e transporte 8/11/9, comunicação 4/5/4, lazer e luxo 1/5/10,
  educação 1/4/4, restaurantes e turismo 1/4/8, seguros e finanças 0/3/6, serviços
  pessoais 4/3/4, poupança 0/3/15.
- **Mapa produto a produto:** categoria do pop, quais pops compram, como chega ao
  pop, quais prédios compram, se o Estado compra e o que vai ao exterior.
- **Comércio é ponte:** produto vai ao atacado, aos pequenos mercados ou aos
  mercados, e daí ao pop; serviços chegam direto.
- **Necessidade atendida por vários produtos** com preferência.

**Regras**
- Sem data (seção 16): o pop compra pela cesta, com a renda de cada estrato dividida
  em fatias por categoria. O motor, que dá a mesma quantia por pessoa (mínimo para
  viver, 12% da renda média, com o pobre gastando fatia maior), está atrás dessa
  meta.
- 14/nov: necessidade atendida por vários produtos; energia de casa tem regra
  própria (eletricidade, gás, lenha).
- Dado de partida: riqueza vira consumo em cerca de 3% do ganho.

**Ligações**
- Gosto: o bolso (renda, preço do que compra, emprego, serviço) é a parte mais forte
  do gosto.
- Leis: imposto sobre consumo, tarifas.
- Mundo: cada produto indica se exporta, importa ou não viaja.

**Referências**
- Victoria 3: necessidades por nível de riqueza, atendidas por vários bens em
  qualquer mistura; padrão de vida sobe e desce.
  ([referência](../../mercado-vic3-referencia.md); [pesquisa](../../estudos/pesquisa-jogadores-14nov.md))
- Lei de Engel (maior renda, menor parte em comida) e COICOP 2018 (consumo por
  finalidade) para a cesta.
- Federal Reserve: riqueza vira consumo em 2 a 5 centavos por dólar.

**No motor hoje**
- ◐ Só a cesta de comida e remédios, com a mesma quantia por pessoa; não há demanda
  por setor.
- ☐ Quem compra (R16.36); cesta por estrato.

**Em aberto**
- Quem compra de verdade (pequenos mercados, mercados, prédios, exterior) ainda é
  planilha.
- A linha "Total" da cesta está vazia na planilha.

---

### 3.6 Nenhum dinheiro some e o caminho do dinheiro

**O que é**
Todo real cobrado ou gasto tem caminho: circula na economia, fica guardado ou sai do
país, mesmo o ilegal. Esta regra substitui o antigo princípio de que só o dinheiro do
Estado fecha a conta: agora a conta fecha para a economia inteira (14/nov).

**O jogador**
- Sente o custo em gente, não num número: a verba da saúde mexe em emprego, setor e
  serviço.
- Passa o mouse e vê de onde veio o número (preço, salário, gosto).

**Peças**
- **Três destinos do dinheiro:** circula (salário, compra, lucro, aluguel); fica
  guardado (poupança, banco, cofre); sai do país (importação, remessa, fuga, conta
  lá fora).
- **O ilegal também:** a corrupção não apaga dinheiro; vai para o bolso de alguém
  (pop rico, ministro, organização), é gasto, lavado ou mandado para fora, e deixa
  rastro.
- **Conferência:** como o Tesouro (cofre − dívida = resultado), a economia inteira
  fecha a conta todo turno.
- **Caminho da verba (reformulado em 14/nov):** a verba vira salário de quem
  trabalha na instituição (médico, professor, policial, que são pops), compra de
  bens e serviços (de companhias daqui ou de fora) e serviço entregue a um pop; o
  desvio vira bolso de alguém.
- **Filtro da verba:** a corrupção desvia parte; desvio = índice Corrupção × 0,5
  (índice 40 = 20% desviado), valor de partida; o desvio vai a alguém e deixa rastro.
- **Destino da verba:** o que chega ao prédio vira salário e insumos; exemplo: 100 de
  verba, 20 desviados, 50 salários, 20 insumos do país, 10 importados.
- **Os bolsos do jogo** (pops, companhias, Estado, bancos, exterior, o ilegal) ainda
  são "a pensar".

**Regras**
- 14/nov: nenhum dinheiro some, nem o ilegal.
- 14/nov: o desvio da corrupção vai ao bolso de alguém e deixa rastro.
- 14/nov: a verba precisa virar salário, compras e serviço, não parar na
  "população".
- 14/nov: a divisão da verba entre pessoal, compras e obras não é fixa.
- 13/nov: o caminho antigo (impostos, Tesouro, verba por lei, instituição que rende
  verba ÷ trabalho; verba demais vira pontos de corrupção) já dizia "nenhum dinheiro
  some".

**Ligações**
- Gosto: salário público vira renda de pops.
- Leis: toda lei de verba.
- Mundo: importação, remessa e fuga são saídas.

**Referências**
- Crítica ao Victoria 3: "a lousa é apagada" a cada tick; bens criados para cobrir
  falta e excedente vendido "ao vazio".
  ([pesquisa](../../estudos/pesquisa-jogadores-14nov.md); [referência](../../mercado-vic3-referencia.md))
- Estudos: gasto público rende pouco em países mal governados (filtro da
  corrupção); contratação atrasada deixa verba sem gastar.
- Gasto em saúde público tirou gasto privado em Taiwan.

**No motor hoje**
- ☐ A verba gasta some (só a transferência chega a um estrato); a renda do pop é
  parte fixa do PIB.
- ☐ Caminho do dinheiro completo (R10.7).
- ☐ A corrupção não reduz a verba hoje.
- ☐ A verba não passa pelos prédios.

**Em aberto**
- Custo fixo por ministério e por cargo (sem ele o governo Inchado não tem
  desvantagem), quanto a corrupção desvia e o dinheiro "fora das leis" de hoje.
- Os bolsos do jogo e o que é contado um por um ou aproximado.
- Como o jogo divide a verba entre pessoal, compras e obras: a divisão não é fixa
  (14/nov) e falta definir como calculá-la.

---

### 3.7 Moeda, bancos, inflação e câmbio

**O que é**
O Banco Central, os bancos, a inflação e o câmbio ligam juros, crédito, preço da
moeda e o exterior.

**O jogador**
- Dá autonomia ao Banco Central por lei; com autonomia, a régua da Taxa básica só
  mostra a decisão do banco.
- Define a Faixa do câmbio (preço-alvo do dólar de −20% a +40% sobre o início, e
  largura de 0% travado a 30% quase solto); ao bater na parede decide no turno:
  gastar reservas, subir juros, fechar a saída de dinheiro (só com Controle de
  capital) ou deixar o corredor quebrar.
- Resgate de bancos é evento: deixar quebrar, ficar com o banco (vira estatal),
  emprestar com condições ou salvar sem condições.
- Cripto: quando a moeda vai mal, parte do povo compra; a lei decide mercado
  paralelo, imposto ou livre.

**Peças**
- **Juros:** o Banco Central reage à inflação e à economia (regra de Taylor); juros
  de mercado somam o risco do país.
- **Crédito:** bancos emprestam depósitos e reservas a pops, prédios e Estado;
  confiança e lucro ampliam; juros e calote reduzem; crédito farto infla a bolsa.
- **Inflação:** vem de demanda, custo, expectativas e moeda emitida.
- **Câmbio:** taxa, moeda fraca (exporta mais, encarece importados e dívida
  externa), moeda forte (importa barato, indústria sofre), regime e reservas.
- **Regime:** o país escolhe dois de três (câmbio estável, capital livre, juros
  próprios); reservas seguram o câmbio até acabar.
- **Reservas** são um índice, não uma lei.
- **Exterior:** comércio, investimento e sanções passam pelo câmbio.
- **Juros do motor:** `alvo = neutro + inflação + 0,05 × max(0, dívida −
  tolerância)`; a taxa anda 20% do caminho até o alvo por turno.
- **Banco Central no motor:** o alvo soma `peso_da_meta × (inflação − meta)`; a
  Autonomia (0 a 1) pesa o alvo do BC contra a Taxa básica do governo.

**Regras**
- 08/nov: câmbio como corredor; resgate de bancos é evento; cripto; autonomia do
  Banco Central destrava a Taxa básica.
- 14/nov: o modelo do Victoria 3 é atualizado com crédito, banco central, inflação
  e capital entrando e saindo.
- Sem data: crises do dinheiro (corrida ao banco, resgate banco a banco, ataque à
  moeda) são eventos de decisão; as leis de Moeda e bancos só montam o cardápio.

**Ligações**
- Gosto: crédito popular (casa, carro, ação) e parcela.
- Leis: Autonomia, Meta de inflação, Faixa do câmbio, Seguro-depósito, Exigência de
  capital, Controle de capital.
- Mundo: a moeda do extremo é a de um país da lista do Mundo.

**Referências**
- Regra de Taylor; trindade impossível; repasse do câmbio (BIS, mais forte em
  emergentes); canal do crédito (Bernanke e Gertler); inflação por demanda, custo e
  expectativas (Banco da Austrália).
- Calibração dos juros: Reinhart, Rogoff e Savastano (2003); Laubach (2009); Clarida,
  Galí e Gertler (2000).
- Democracy 4: nota de crédito que define juros; Victoria 3: juros baixos que não
  viram espiral. Estudo de 22/out, antes do recomeço, só como ideia.
  ([estudo](../../estudos/victoria3-e-democracy4.md))
- Victoria 3 não tem inflação nem crédito moderno (o jogo vai até 1936).
  ([pesquisa](../../estudos/pesquisa-jogadores-14nov.md))

**No motor hoje**
- ◐ Inflação que se move (R9.3).
- ✅ Juros por dívida e inflação, com Banco Central e autonomia pelo papel.
- ☐ Crédito dos bancos (R16.38); câmbio, regime e reservas (R16.39).
- ☐ Tudo da planilha de inflação por demanda, custo, expectativa e moeda.
- Simplificado hoje: uma taxa só; sem prazo da dívida; prêmio linear, sem crise de
  confiança.

**Em aberto**
- Como crédito, câmbio e reservas ligam comércio, inflação, dívida e investidores.
- Peso da meta de inflação, números de alvo e do prêmio de risco: **ESTUDAR** (só
  existe o ponto de partida dos juros).

---

### 3.8 Bolsa (minigame Pregão)

**O que é**
A bolsa é onde empresas abrem capital e investidores negociam ações; o preço anda
pelo lucro e pela confiança, e a bolsa funciona sem o governo.

**O jogador**
- Regulamenta ou entra: o Estado compra e vende de verdade, o dinheiro entra e sai
  do cofre, e grupos, mídia e outros países reagem.
- Cada país escolhe o caminho (liberal, coordenado ou Estado dono); cada um exige
  estrutura e cobra um preço, sem lado certo.
- Ação dá dividendo, não dá mando.
- Sente alta e quebra: a quebra reduz patrimônio, consumo, investimento e emprego.

**Peças**
- **Preço:** lucro × múltiplo × humor; múltiplo cai com juros e risco e sobe com
  crescimento esperado; humor volta ao valor justo aos poucos.
- **Conta de valor justo (exemplo):** lucro 12; retorno exigido = juros 8% + risco 5%
  = 13%; crescimento esperado = 65% × 12% = 7,8%; múltiplo = 35% ÷ (13% − 7,8%) ≈ 6,7;
  valor justo ≈ 81; humor entre 0,6 e 1,6.
- **Prêmio de risco:** sobe com corrupção, dívida, regra fraca, ameaça de estatizar e
  violência; cai com proteção e transparência.
- **Ciclo:** novidade, euforia, aperto, pânico, consequência.
- **Investidores:** pequenos, pops ricos, fundos nacionais, bancos e corretoras,
  multinacionais, estrangeiros de curto prazo, potências e o Estado, cada um com
  origem do dinheiro, quando compra e quando vende.
- **Base do mercado:** propriedade, contratos, regras claras, moeda estável e apoio
  da população; sem isso a bolsa encolhe ou quebra.
- **Regras que o país pode criar** (ideias de lei): transparência, proteção do
  pequeno acionista, informação privilegiada, órgão da bolsa, limite de risco dos
  bancos, imposto sobre ganhos, pausa do pregão, fundo do Estado, socorro.
- **Índice da bolsa** e **confiança do mercado.**
- **Patrimônio dos pops:** ação sobe ou cai e muda a riqueza; dividendo vira renda;
  queda vira reação no voto e no investimento.
- **Captação:** preço alto ajuda empresa a vender ação e pagar obras.
- **Compra da propriedade** pelo valor na bolsa.

**Regras**
- Sem data (seção 16): a bolsa funciona sem o governo; mercado precisa de base; ação
  dá dividendo, não dá mando.
- Sem data: humor nasce de alta recente, crédito barato, confiança e notícias, sem
  sorteio.
- Sem data: vender muito de uma vez derruba o preço.
- 02/nov: jogável não é demorado; nenhuma opção com efeito neutro (revisão do
  Pregão).
- Ponto de partida: 3% do ganho vira gasto (estudo do Federal Reserve).

**Ligações**
- Gosto: queda reduz a satisfação de Finanças, Indústria e dos pequenos investidores
  (pressão por socorro).
- Leis: imposto sobre ganhos, remessa, regras da bolsa.
- Mundo: estrangeiros saem rápido e derrubam preço e moeda; potências compram.

**Referências**
- Modelo de Gordon (valor justo); Minsky e Kindleberger (bolhas); Rodrik (base do
  mercado); IOSCO (regras mínimas); La Porta e outros (proteção do investidor);
  Levine e Zervos (liquidez); Hall e Soskice (tipos de capitalismo); Wolff e Axios
  (quem tem ações); estudo da Índia (fuga de estrangeiro).

**No motor hoje**
- ◐ Protótipo na tela com blocos de 2% e dividendo sem mando (R16.15); empresas,
  preço e compradores de protótipo, que só mudam a tela.
- ☐ Preço = lucro × múltiplo × humor (R16.16, R16.34); investidores e quebra
  (R16.35); bolsa sem o governo (R16.29); ações no patrimônio dos pops (R16.28); base
  e caminhos (R16.30); índice da bolsa (R9.6).

**Em aberto**
- Blocos: o protótipo usa "blocos de 2%"; o desenho diz que as ações são negociadas
  no turno, "sem blocos fixos", e fala também em "preço do bloco". Decidir o que
  vale quando o Pregão sair do protótipo.
- A ordem e o tamanho de cada regra de bolsa (as "ideias de lei" ainda não viraram
  leis).

---

### 3.9 Companhias e estatais (operações do Estado)

**O que é**
Camadas: ação (fatia que dá dividendo, sem mando), empresa (conjunto de prédios de um
setor, com dono que manda) e prédio. Trocar o dono não mexe no prédio. Companhias e
estatais mudam de dono por Operação, nunca por lei.

**O jogador**
- Abre a lista de companhias (filtro por setor ou dono; colunas de lucro, valor na
  bolsa, empregos, parte do Estado, dividendo, risco político) e escolhe: comprar
  cotas, estatizar, privatizar, transformar em cooperativa, criar estatal. Cada uma
  é Operação, não lei.
- Comprar cotas (jogo A): define meta, prazo e discrição; o jogo divide a meta pelos
  turnos; passar do Limite de aviso ao mercado sobe preço e risco.
- Estatizar ou privatizar (jogo B): decide só querer ou não; o resto chega como
  papéis para assinar na mesa; no leilão vê os compradores e define o preço mínimo.
- Só mexe em companhias, nunca em fábrica solta.

**Peças**
- **Leis que controlam as operações:** Indenização, Prazo de pagamento, Regra depois
  da venda, Política da empresa estatal, Limite de aviso ao mercado, Ação de ouro,
  Autorização para estatizar e vender (presidente, Congresso ou plebiscito).
- **Verbas:** Verba das estatais (por setor, % do PIB) mantém e opera o que existe;
  Construção de estatais paga obras novas na fila.
- **Papéis na mesa (11/nov):** Autorização, Proposta do órgão e Resposta; cada um com
  prazo; a mídia lê cada passo; papel duvidoso pode surgir. Comprar cotas, Encomendar
  usina e Megaobra não têm papel.
- **Pedidos na mesa:** empresas e compradores mandam pedidos para comprar estatais.
- **O partido não compra nem vende:** quem faz é o Estado, por lei ou decreto;
  doação de companhia é conflito de interesse.
- **Ficha da empresa na bolsa:** mostra prédios, da extração ao refino.
- **Operações do Estado** (estatizar, criar estatal, cooperativa, vender companhia ou
  prédio); empresas de energia podem ser vendidas; transporte fica no fundo do
  cálculo.

**Regras**
- 08/nov: Operação e Ato não são lei; só lei é regra permanente com bolha.
- 08/nov: só mexemos em companhias. A decisão sobre uma empresa é Operação sobre a
  companhia, não ficha por setor com projeto de lei.
- 11/nov: o mesmo molde de 3 papéis em Estatização, Privatização e Cooperativa.
- 08/nov: o Estado compra e vende de verdade; o dinheiro entra e sai do cofre.

**Ligações**
- Gosto: acionistas reagem de um jeito por tipo; grupos e mídia reagem.
- Leis: as sete acima.
- Mundo: o país do dono reage na Justiça; multinacional compra controle.

**Referências**
- Victoria 3: companhias (1.8), dono por nível e investimento estrangeiro.
  ([pesquisa](../../estudos/pesquisa-jogadores-14nov.md))
- Estatais e Mehr (Irã): Estado constrói e tira obra do privado.
- Demais jogos de compra e venda de estatal: **ESTUDAR** (só existe o desenho
  próprio).

**No motor hoje**
- ◐ Empresas declaradas pelo país (R16.11).
- ☐ Estatizar, privatizar, criar estatal, cooperativa e comprar cotas como Operação
  com 3 papéis (R16.14); lista de companhias.
- ☐ Estatais e ações rendendo ao cofre e podendo ser vendidas.

**Em aberto**
- Leilão (preço mínimo, compradores); oferta pública × obrigar a vender; quem reage
  (acionistas, país do dono).
- A Verba das estatais é uma lei por estatal ou uma por setor? O GDD descreve "por
  setor" e mantém a pergunta aberta.

---

### 3.10 Comércio exterior e capital

**O que é**
O país importa o que falta e exporta o que sobra, pelas tarifas, subsídios e acordos
(leis).

**O jogador**
- Mexe na régua de tarifa, imposto de exportação e subsídio, por setor (aba por setor
  e aba "Todos"). Nenhuma lei dá lucro a um produto.
- Sente dependência de uma potência (média do que o país compra dela) e preço do que
  vem de fora.

**Peças**
- **Leis (08/nov):** Tarifa de importação, Facilitação aduaneira, Zonas francas,
  Imposto sobre exportação, Subsídio às exportações, Defesa comercial, Controle de
  exportação de produtos estratégicos, Venda de armas ao exterior, Triagem de compra
  estrangeira, Remessa de lucro ao exterior, Fábrica estrangeira no país.
- **Leis gerais de estrangeiros (02/nov, Fatia 8):** triagem, remessa, fábrica
  estrangeira, fábrica nossa no exterior, concorrência e acordo com potência.
- **Cobertura, fornecedores e dependência.**
- **Sanção pelo mercado** (com o Mundo); terras raras: quem produz pode sancionar
  pelo mercado.
- **Câmbio** como ligação com o exterior.

**Regras**
- 08/nov: régua por setor; nenhuma lei dá lucro a um produto.
- 02/nov: produto que o país não declara conta cobertura 0 (compra tudo do mundo).
- Evidência apontada no GDD: a tarifa recai quase toda sobre quem compra; abrir o
  comércio sobe a produtividade com ganhadores e perdedores; menos burocracia nos
  portos corta o custo (10 a 20% em simulações); zonas francas dependem da
  governança.

**Ligações**
- Gosto: a tarifa mexe no preço do que o pop compra.
- Leis: as 11 acima.
- Mundo: preço do mundo, fornecedores, sanções, acordos.

**Referências**
- Victoria 3: acesso ao mercado mundial por porto; tarifas e subsídios (0, 12,5, 25,
  50%); embargos. ([referência](../../mercado-vic3-referencia.md))
- A evidência do GDD não traz fonte nomeada: **ESTUDAR** (achar as fontes).

**No motor hoje**
- ◐ Tarifa, subsídio e acordo (R16.4); falta tarifa e subsídio na conta.

**Em aberto**
- Régua por setor; sanção que passa pelo mercado (com o Mundo).

---

### 3.11 Setores com regra própria

Cada um precisa de plano quando for a vez; todos já estão desenhados no GDD. Não há
estudo nem jogo de referência para Energia, Agricultura, Ciência, Meio ambiente,
Construção civil, Transporte, Cultura, Defesa civil e Minério: em cada um, a
referência fica **ESTUDAR**. Para todos, no motor ainda não há mecânica própria nem
R.

#### 3.11.1 Energia (08/nov)

**O que é**
A usina dá capacidade; a eletricidade é produto do mercado, com preço e importação
(como no Victoria 3; decidido em 14/nov). Faltar energia encarece e trava a
indústria.

**O jogador**
- Encomenda uma usina num estado e numa fonte (Operação, paga com os Investimentos
  por fonte); escolhe quem fica sem luz quando falta, num papel; segura a conta de
  luz (lei pegadinha); estatiza ou vende a companhia. As linhas são automáticas.
- Sente a falta chegando num gráfico do futuro (gasto contra geração, contando obras
  em andamento) e o apagão como evento.

**Peças**
- Energia nunca vem do nada: gerada = gasto das companhias + gasto da população +
  perdas na rede; índices Energia gerada, Energia gasta, Preço da energia, Matriz
  limpa e Acesso à energia.
- A usina dá a capacidade; a eletricidade é um produto que quase todo prédio usa,
  com preço no mercado e importação quando falta.
- Por estado: usinas e linhas ligadas aos vizinhos; apagão por estado.
- Produtividade é conta por companhia.
- Quem constrói: as companhias com a própria reserva; o Estado pelos Investimentos
  por fonte.
- Mapa elétrico.
- Cada fonte é uma aposta (hidrelétrica, solar, eólica, térmica, nuclear).
- Comércio de energia como Posição por país, em degraus.
- Urânio: escada de enriquecimento; vender urânio em segredo é Ato.
- No motor (02/nov): demanda civil 35 e das empresas 65 (pontos); a falta freia até 8
  pontos de crescimento ao ano e sobe o preço.

**Regras**
- 08/nov: as linhas são automáticas: o presidente só define o dinheiro, porque o jogo
  não é de construção.
- 08/nov: ao estatizar, a companhia federal é criada sozinha.
- 08/nov: quem fica sem luz quando a energia falta é escolha do jogador, num papel.
- 14/nov: a usina dá capacidade e a eletricidade é produto do mercado, com preço e
  importação.

**Ligações**
- Gosto: Acesso à energia; conta de luz; energia de casa tem regra própria
  (eletricidade, gás, lenha).
- Leis: Investimentos por fonte; Enriquecimento de urânio; comércio de energia.
- Mundo: urânio e comércio de energia com vizinhos mudam a desconfiança e a
  dependência.

**Referências** **ESTUDAR** (Victoria 3 como ponto de partida para a eletricidade
como produto).

**No motor hoje**
- ✅ Energia como capacidade contra demanda (R16.3), com 5 fontes e leis de verba.
- ☐ Resto do pacote: tarifa social, subsídio à energia limpa, imposto sobre
  combustível fóssil, licenciamento, fiscalização nuclear; risco da nuclear; rede por
  região.
- ☐ Eletricidade como produto do mercado, com preço e importação; energia por estado
  e apagão como evento; escolha de quem fica sem luz num papel; encomendar usina
  (Operação); comércio de energia; urânio.

**Em aberto**
- Energia por estado e apagão como evento: "a pensar".

#### 3.11.2 Moradia e terra (campo × cidade)

**O que é**
Moradia é estoque local (formal e precária), não produto do mundo; a terra rural é de
donos grandes, pequenos ou de ninguém; as duas pontas se ligam pela gente que se
muda.

**O jogador**
- Escolhe leis de terra no campo e de moradia na cidade.
- Leis da cidade em 4 alavancas (Construir, Terra urbana, Aluguel, Ocupação), cada
  uma com leis nos 6 lados.
- Reforma agrária é processo (terra parada, desapropriada ou comprada, assentamento,
  título); cada lei empurra uma etapa; o partido não escolhe fazenda.
- Sente déficit, preço, favela e casas vazias.

**Peças**
- **Estoque em 3 faixas (07/nov):** pobres, classe média, ricos, mais a favela, com
  casas ocupadas e vazias; o aluguel de cada faixa reage às vazias.
- **Quem constrói:** empresa pelo lucro, governo pela lei e pop (pobre autoconstrói
  precário, classe média financia, rico investe para alugar).
- **Casas descem de faixa** cerca de 2% ao ano.
- **Êxodo:** a gente do campo vai para a cidade quando a renda esperada lá passa a do
  campo.
- **Fazendas em 3 tamanhos;** imposto sobre terra e imóvel parado (curva de Laffer);
  desapropriar pela fila do órgão de terras.
- **Terra (09/nov):** fila visível (vistoria, prazo de defesa, terra obtida,
  assentamento, título); duas contas por estado (Preço da terra e Segurança da
  terra); comprar ou desapropriar; movimentos sem-terra nascem sozinhos; papéis na
  mesa.
- **No motor (04/nov, moradia):** família = pessoas ÷ tamanho; déficit, favela e
  casas vazias saem da contagem; desgaste de 4% ao ano; governo constrói pela lei de
  verba; empresas constroem conforme setor, preço, juro, imposto e corrupção; sem
  casa, a precária cresce; bolso: o preço pede uma renda; casa vazia (14/nov); êxodo
  pela concentração.

**Regras**
- 07/nov: estoque em 3 faixas; casa sem morador não some.
- 04/nov: o país começa parado: as obras do turno 0 só repõem o desgaste.
- 14/nov: casa de quem é despejado fica vazia; as vazias desgastam como as formais;
  o índice de casas vazias anda pela contagem.
- 04/nov: antes de toda lei: "um presidente real assinaria e pronto, ou é um
  processo?"
- 04/nov: nenhuma lei sabe de pobreza; o resultado sai da renda contra a conta.
- 09/nov: o preço da terra sobe com compra em massa; a segurança da terra cai com
  desapropriação e ocupação.

**Ligações**
- Gosto: renda do pop diz quem paga a casa; movimento sem-terra; êxodo.
- Leis: 4 alavancas da cidade, leis do campo nos 6 lados; "lei nenhuma fala das duas:
  a ligação é a gente".
- Mundo: não se importa casa.

**Referências**
- Rosenthal (casas descem de faixa ~1,9% ao ano); Hansen e Rambaldi; Mast e outros;
  Turner e Wessel; programa Mehr; estudos de autoconstrução; Greenaway-McGrevy e So;
  Diamond e outros; VATT; IFS.

**No motor hoje**
- ✅ Déficit, preço e favela; casas vazias (R16.19, 14/nov).
- ☐ Estoque local em faixas (R16.17); quem constrói (R16.18); 4 alavancas (R16.20);
  terra rural e êxodo (R16.21 a R16.24); bem tomado pelo Estado ganha destino por lei
  (R16.25); fila de terras.
- Hoje o motor tem estoque agregado e êxodo pela concentração, não as 3 faixas.

**Em aberto**
- Velocidade do êxodo, custo da casa e ritmo da autoconstrução; se o êxodo é índice
  ou só gente mudando de pop.
- Destino do bem tomado pelo Estado (comunidade, Estado ou famílias com título): uma
  lei por destino, a decidir.
- A fila genérica (serve Terra, Patrimônio e Judiciário) deve nascer uma vez só.

#### 3.11.3 Água e saneamento

**O que é**
Rede de água e esgoto do país; o índice é a parte das famílias atendidas.

**O jogador**
- Paga obras com a lei de verba, escolhe concessão, teto da tarifa e tratamento;
  sente a conta pedir uma renda e quem não paga ser cortado.

**Peças**
- Desgaste; governo faz obras; operadoras locais fazem o resto; bolso (renda mínima);
  concessão só onde dá lucro; teto da tarifa; tratamento melhora o meio ambiente;
  setor cheio (casas e rede disputam as mesmas vagas).

**Regras**
- 04/nov: aprovado como regra do motor; o país começa parado.
- 04/nov: nenhuma lei sabe de renda: o mesmo aumento quase não pesa onde sobra renda
  e corta muita gente onde falta.

**Ligações**
- Gosto: tarifa tira padrão de vida; religa famílias quando a renda sobe.
- Leis: verba, concessão, teto da tarifa, tratamento.

**Referências**
- Urbanização de favelas, revisão Cochrane (efeito na saúde, fraco na renda).

**No motor hoje**
- ✅ Índice, desgaste, obras, bolso, concessão, teto, tratamento e setas para saúde e
  meio ambiente (aprovado em 04/nov); "não equilibrado, só dá direção".

**Em aberto**
- Água e saneamento é um dos 15 setores, mas a ligação dele aos prédios (estação de
  água, de esgoto, coleta de lixo) ainda é só planilha.

#### 3.11.4 Agricultura e pesca (09/nov)

**O que é**
A produção do campo por estado, em fazendas pequenas, médias e grandes, mais o peixe
de mar compartilhado.

**O jogador**
- Vive a briga central: o produtor quer preço alto e a cidade quer comida barata;
  quando a comida dispara, chega o papel "comida cara" (soltar o estoque, travar a
  exportação por Ato, importar ou não fazer nada).

**Peças**
- Nenhuma lei dá lucro a produto; a cadeia espalha.
- O dinheiro depende de quem recebe: subsídio sem teto valoriza a terra do grande e
  expulsa o pequeno.
- O campo fala com o resto: máquina empurra gente para a cidade, irrigação disputa
  água com a hidrelétrica, grão disputa com a ração.
- Compra pública da sobra de grãos; estoque é conta e estraga.
- Pesca por mar compartilhado; Acordo de pesca é Posição por país.
- Eventos: seca, colapso da pesca, carne contaminada.

**Regras**
- 09/nov: o Estado compra só uma parte da sobra, nunca do que falta.
- 09/nov: o mar fica com a Fiscalização ambiental.

**Ligações**
- Gosto: o preço da comida e o êxodo; protesto e queda de aprovação.
- Leis: Controle de exportação, crédito, subsídio, Sementes transgênicas.
- Mundo: importar gasta dólares; Acordo de pesca.

**Referências** **ESTUDAR**

**No motor hoje** ☐ Falta; só a cesta de comida existe.

#### 3.11.5 Ciência e pesquisa (09/nov)

**O que é**
Um nível de tecnologia por produto, sem árvore: fábrica acima do nível produz caro e
pouco, e o mundo avança.

**O jogador**
- Dá a verba de ciência e tecnologia e a divide em 7 fatias (Ciência básica, Saúde e
  remédios, Indústria e chips, Energia e baterias, Agro, Defesa, Espaço).
- Investir é apostar que o partido segue no poder; cortar dói na hora.
- Escolhe o alvo do programa espacial; a Lua é uma corrida entre países.

**Peças**
- Nível próprio (lento, ninguém tira) e emprestado (rápido, cai se cortam o acesso).
- Companhias com gasto de pesquisa que sobe a Produtividade.
- Polos de pesquisa, papéis do governador e do deputado.
- Três limites: Edição de genes, Testes em animais, Pesquisa com vírus perigosos.

**Regras**
- 09/nov: Marte está fora (autor).
- Decidido: tecnologia como árvore fica fora do jogo pronto.

**Ligações**
- Gosto: bancada racha com Edição de genes (Bússola).
- Leis: as 7 fatias, os 3 limites, Cooperação científica.
- Mundo: a Lua é corrida; nível emprestado vem de cooperação e fábrica estrangeira.

**Referências** **ESTUDAR**

**No motor hoje** ☐ Falta.

#### 3.11.6 Meio ambiente (09/nov)

**O que é**
O órgão ambiental recebe a verba da Fiscalização ambiental, escolhe onde agir, multa
e licencia; não existe botão de pressionar.

**O jogador**
- Assina as leis e responde aos papéis; lei dura racha os deputados; governador pede
  alívio; companhia poluidora oferece dinheiro por voto.
- Com o presidente mandando, a licença nunca é negada e o órgão fica mais corrupto;
  meio independente, chega o papel; independente, não assina.

**Peças**
- Desmatamento nasce do lucro do agro contra o risco de punição; a Reserva da fazenda
  define o ilegal.
- Licença sem exame sobe na hora Desmatamento ou Emissões.
- Emissões são conta por companhia; índices Emissões de carbono, Desmatamento,
  Qualidade do ar.
- Produtos novos: Terras raras, Baterias, Veículos elétricos.

**Regras**
- 09/nov: pressão só como resposta a um papel e fica no registro.
- 09/nov: obra do Estado sempre passa pelo órgão; certificadora privada vale só para
  obras privadas.

**Ligações**
- Gosto: Saúde ambiental lê o índice Meio ambiente.
- Leis: Fiscalização ambiental, Reserva da fazenda.
- Mundo: os países compram menos do agro quando a licença passa sem exame.

**Referências** **ESTUDAR**

**No motor hoje** ☐ Falta; o meio ambiente hoje vem só dos efeitos das leis de
energia.

#### 3.11.7 Construção civil (09/nov)

**O que é**
Duas filas, um setor: a pública e a privada usam a mesma capacidade de construir.

**O jogador**
- Só vê a fila e mexe só pelas leis (Prioridade das obras, Divisão de 100% da verba
  de construção).
- Sente o preço: muita obra sobe cimento e salário.
- Papéis: obra cara, cartel, companhia que quebrou, emenda de deputado.
- Inaugurar dá voto; obra inacabada vira ataque.

**Peças**
- Público: constrói o que o país precisa e o governo pagou, sem olhar lucro.
- Privado: constrói onde dá lucro.
- Construtora nacional é companhia do Estado; cartel só nasce entre as privadas.
- Cartão da obra: motivo do atraso e quem resolve.

**Regras**
- 09/nov: o jogador não mexe na obra; só dá dinheiro ao setor.
- 07/nov: a verba de construção é separada da de manutenção.

**Ligações**
- Gosto: voto por inauguração.
- Leis: Prioridade das obras; incentivos ao setor.
- Mundo: importar cimento, trazer operários de fora (papel).

**Referências** **ESTUDAR** (o Mehr, Irã, trata só de obra de casa pelo Estado).

**No motor hoje** ◐ Fila da construção civil, capacidade e corrupção que atrasa (por
setor).

**Em aberto**
- Duas filas na mesma capacidade, lei Prioridade das obras.

#### 3.11.8 Transporte (09/nov)

**O que é**
O presidente só assina o que é federal; ônibus, passagem, rodízio e estacionamento
são municipais.

**O jogador**
- Dá a Verba de conservação e a fatia Transportes da Verba de construção; o órgão
  reparte, linhas e rotas são automáticas.
- Megaobra e Encomendar usina são escolha direta, com papéis.

**Peças**
- Cada lei diz quem é atendido e quem paga.
- Táxi e aplicativo; carro elétrico; Peso da multa.

**Regras**
- 09/nov: o federal age por regra geral ou programa, como o passe livre onde a
  cidade aderir.

**Ligações**
- Gosto: direito de quem trabalha vai para Trabalho; família removida por obra vai
  para Moradia.
- Leis: as acima.

**Referências** **ESTUDAR**

**No motor hoje** ☐ Falta.

#### 3.11.9 Cultura e patrimônio (09/nov)

**O que é**
Uma fila no órgão de Patrimônio, com a forma da fila de Terra: Pedido, Estudo,
Decisão, Conservação.

**O jogador**
- Empurra uma etapa por lei; o partido não escolhe o casarão.
- Cada sim é conta para sempre; cada não é definitivo.
- Efeito: quem pediu aprova, quem perdeu reclama, e o que é protegido leva turista a
  Hotel e restaurante.

**Peças**
- Dois tipos de pedido: proteger e retirar.
- Símbolo de fé segue a Religião do Estado.
- Estátua vira disputa entre grupos.
- Fora da fila: Verba de cultura e esporte, Conteúdo nacional, Meia-entrada, Sediar
  grande evento.
- Fora do jogo: clube, torcida, estádio e categoria feminina.

**Regras**
- 09/nov: o órgão resolve os casos calmos; o disputado vira papel.
- 09/nov: a fila deve nascer genérica (serve a Terra e ao Patrimônio).

**Ligações**
- Gosto: os grupos pedem sozinhos, conforme tamanho e insatisfação.
- Leis: Quem pode pedir, O que pode ser protegido, Direito do dono, Preço de museu e
  parque federal.
- Mundo: turismo.

**Referências** **ESTUDAR**

**No motor hoje** ☐ Falta.

**Em aberto**
- A fila genérica nasce uma vez só.

#### 3.11.10 Defesa civil (09/nov)

**O que é**
O desastre chega sozinho; o estrago é a gravidade menos o índice Preparo contra
desastres, que sobe devagar com verba e cai sozinho a cada turno.

**O jogador**
- Dá verba e escolhe a resposta nos papéis (enchente, encosta, barragem, prefeito
  pede ajuda, incêndio, reconstrução).
- Cortar a verba sobra dinheiro agora e a conta vem no desastre seguinte.
- Sente gente com nome e voz no papel.

**Peças**
- O partido não opera: bombeiros são dos estados; o federal dá dinheiro e regra.
- Governador aliado faz a verba render mais.
- Leis: Verba da defesa civil (Prevenção, Resposta, Reconstrução), Alerta de
  desastre, Reserva de emergência, Ajuda a quem perdeu a casa, Verba só com regra de
  área de risco.

**Regras**
- 09/nov: o jogador não escolhe a região socorrida; a ajuda segue a gravidade.

**Ligações**
- Gosto: o papel tem povo; a mesma notícia sai na mídia.
- Leis: as acima.
- Mundo: o clima define a gravidade.

**Referências** **ESTUDAR**

**No motor hoje** ☐ Falta.

#### 3.11.11 Minério e petróleo (09/nov)

**O que é**
Instituição própria de petróleo, gás, combustíveis e minério.

**O jogador**
- Não escolhe mina: a lei decide quem fica com o dinheiro e quem paga a conta; a
  companhia abre onde dá lucro.
- Sente quem aparece (garimpeiro, cidade da mina, aldeia, vila abaixo da barragem) e
  o Preço do combustível.

**Peças**
- Leis: Imposto sobre o minério, Garimpo, Áreas abertas à mineração, Parte do dono da
  terra, Prazo para acabar com barragem velha, O que a mina deixa quando fecha, De
  onde veio o ouro.
- Reaproveita Destino dos royalties, Garantia contra acidentes, Imposto e Controle
  de exportação (com minério e terras raras como setores).
- Papéis: barragem, garimpeiros, mina que fecha, mineradora que ameaça demitir.

**Regras**
- 09/nov: sem índice próprio para o minério.
- 11/nov: o índice Preço do combustível existe para o Subsídio e o Imposto sobre
  combustíveis; dele saem o frete, o preço da comida e o papel do caminhoneiro.

**Ligações**
- Gosto: mina fechando aparece no Desemprego.
- Leis: as acima.
- Mundo: Controle de exportação.

**Referências** **ESTUDAR**

**No motor hoje** ☐ Falta.

#### 3.11.12 Serviços do Estado

**O que é**
Prédios do Estado fora do mercado (hospital, escola, delegacia, tribunal, presídio,
quartel, repartição), pagos pelo orçamento, que dão emprego e salário sem lucro.

**O jogador**
- Cortar verba fecha prédio, demite pop e reduz o serviço.
- Pode terceirizar por lei o que aceita terceirização.

**Peças**
- Serviço do Estado como "dono": verba por lei, sem lucro.

**Ligações**
- Gosto: salário público vira renda.
- Leis: terceirização; verba por instituição.

**Referências**
- Preso barato tira vaga do livre (Poyker); presídio terceirizado prende mais tempo
  (Mukherjee).

**No motor hoje**
- ☐ Hospital, escola, delegacia como prédios fora do mercado (R16.31); terceirizar
  por lei (R16.32).

**Em aberto**
- Quais serviços do Estado aceitam terceirização além dos já listados na planilha.

---

### 3.12 Contas do Estado

**O que é**
O Tesouro em cinco contas separadas: receita, gasto, juros, cofre e dívida. Juros não
descontam da receita: são uma linha própria. As contas do Estado moram na Economia,
porque são dinheiro; quem executa a lei (instituições, ministros, caixas) está na
parte das Leis.

**O jogador**
- Escolhe impostos, verbas, regra fiscal e a política de déficit e superávit; vê o
  dinheiro na moeda do país, por ano, além de % do PIB.
- Cada regra fiscal abre a sua figura (envelopes com cadeado, cofrinho, velocímetro,
  caixa d'água, luzes de painel, pente fino, escada de vencimentos, barra de
  reserva).
- Sente o cadeado: a verba trava na marca e diz "travado por lei"; em crise, "só X%
  livre para cortar".
- Em crise pode suspender a regra fiscal por ato; se a crise é real a Credibilidade
  fiscal cai pouco, se não, cai muito.

**Peças**
- **Receita:** leis com cálculo mais `receita_fora_das_leis` (o imposto que ainda não
  virou lei). **Gasto:** leis de gasto mais `gasto_fora_das_leis`. **Juros:** taxa ×
  dívida. **Cofre** e **Dívida** são estoques.
- **Primário e nominal:** primário = receita − gasto; nominal = primário − juros.
- **Falta (lei Déficit):** fração paga pelo cofre; o resto vira dívida; sem cofre,
  tudo vira dívida. **Sobra (lei Superávit):** fração que vai ao cofre; o resto abate
  a dívida. Sem as leis, a falta sai do cofre e a sobra vai ao cofre.
- **Juros** sobem com dívida acima da tolerância e com inflação.
- **Impostos por base:** curva de Laffer com evasão
  (`t × R × (1 − t)^e × (1 − evasão)`), pico declarado pelo país; consumo, lucro e
  emissões usam a mesma curva; a onda 1 traz patrimônio, aplicações, imóvel, capital,
  movimentação, folha e bancos, com `incide` por estrato.
- **Regra fiscal (08/nov):** Meta de resultado, Teto de gasto, Limite da dívida e
  Punição se descumprir. No motor, as quatro regras checadas pelo papel são teto de
  gasto, meta de resultado, limite da dívida e teto da carga; as duas listas existem
  desde a onda 1. A punição vale enquanto houver regra estourada (corte, trava,
  crime); o piso da verba não desce abaixo de `piso × arrecadação`.
- **Gasto mínimo obrigatório,** **Revisão de gastos** (recupera parte do que cada
  área perde no caminho, cerca de 1/4 na média, 1/2 na base zero, valores de
  partida), **Prazo da dívida** (escada de vencimentos), **Fundo soberano.**
- **Dívida em moeda de fora:** juros menores, mas sobe junto quando a moeda cai
  (dívida de 80% do PIB, 30% em moeda de fora, moeda cai 20%: vai a 84,8%).
- **Transferência** com cobertura: o excesso vai ao estrato de cima.
- **Conta da previdência:** déficit = benefícios − contribuição da folha.
- **Emissão de moeda** cobre falta sem dívida e paga em inflação; **Calote** apaga
  dívida e derruba reputação, juros e investimento por anos.
- **Bens do Estado:** estatais e ações rendem lucro e dividendo ao cofre e podem ser
  vendidos.
- **Estatal** paga obra do cofre; sem cofre, da dívida.

**Regras**
- 14/nov: nenhum dinheiro some. Para o Estado, isso vale assim: o dinheiro entra por
  lei ou bem do Estado e sai por lei ou obrigação; gastar exige imposto, dívida ou
  emissão. A conta sempre fecha, e fecha também para o resto da economia (princípio 5
  reescrito).
- 08/nov: regra fiscal em 4 leis; cada lei abre a sua figura; gasto mínimo mostrado
  com cadeado; revisão de gastos; dívida em moeda de fora.
- Invariante: a variação de cofre − dívida é igual ao resultado nominal do turno.
- 02/nov: Déficit e Superávit entram em `contas`.
- 14/nov: a divisão do gasto de cada instituição entre pessoal, compras e obras não é
  fixa.

**Ligações**
- Gosto: imposto de renda e transferência são hoje o único bolso que se mexe; a lei
  de cobertura muda quem recebe.
- Leis: imposto (curva), verba, regra fiscal, Déficit, Superávit.
- Mundo: dívida em moeda de fora depende do câmbio; juros somam o risco do país.

**Referências**
- Estudo de 22/out (antes do recomeço de 31/out, só ideia): Democracy 4 e Victoria 3
  para PIB, receita e gasto, dívida, juros e crise, tempo e suavização. As partes
  "SisGov hoje" desse estudo estão velhas (cita Selic e turno trimestral).
  ([estudo](../../estudos/victoria3-e-democracy4.md))
- Victoria 3: imposto por 5 níveis (por pessoa, terra, consumo, renda, dividendos);
  gastos são salários e insumos dos prédios do governo; déficit vira dívida.
  ([pesquisa](../../estudos/pesquisa-jogadores-14nov.md))
- Saez, Slemrod e Giertz (Laffer); Reinhart, Rogoff e Savastano; Laubach; Clarida,
  Galí e Gertler.
- Estudos de impostos: fortunas arrecadam pouco e afastam ricos; fiscalizar os mais
  ricos devolve mais de 6 dólares por dólar; anistias repetidas aumentam a sonegação.
- Pesquisa de jogadores: orçamento como número único sem sentir o custo (Suzerain);
  "é a economia e me sinto burro" (Democracy 4).

**No motor hoje**
- ✅ Receita, gasto, juros, cofre e dívida separados (R10.1); juros sobem com dívida
  e inflação (R10.2); regra fiscal por lei (R10.3).
- ◐ Dinheiro na moeda do país (R10.4).
- ☐ Caminho do dinheiro (R10.7); emissão de moeda (R10.5); calote (R10.6).
- ☐ Dívida com prazo e em moeda de fora: hoje a dívida não vence (o governo paga os
  juros e rola o principal), uma taxa só, prêmio linear; o desenho do GDD é a meta.
- ☐ Estoque de dívidas de quem sonega e Anistia fiscal.

**Em aberto**
- Calibrar: os juros comem 16% do PIB e a dívida vai de 78% a 107% em 24 turnos
  (R4.3).
- Custo fixo por ministério e por cargo; quanto a corrupção desvia; o dinheiro "fora
  das leis" de hoje.
- Estatais e ações rendendo ao cofre (ligado à 3.9).
- Quanto o Estado paga em salários, compras e obras de cada instituição: a divisão
  não é fixa (14/nov); falta definir como calculá-la (ver 3.6).

<!-- revisor: Tirei (superado por 08-conflitos.md): "civis primeiro, automático" (02/nov) na energia (agora o jogador escolhe num papel); "o produto Energia saiu da tabela de produtos" (agora eletricidade é produto do mercado, C7); as 3 leis de "quem" da Fatia 7/8 e a ficha por setor com projeto de lei (substituídas por Operação sobre companhia, B); "dinheiro some de verdade" no filtro da corrupção e em R10.7 (agora vai ao bolso de alguém); princípio 5 como só-Estado (reescrito, nenhum dinheiro some); a ordem de 13/nov "terminar ministros, mapa e só então o caminho do dinheiro" (a ordem de 14/nov, dinheiro primeiro, vale); "lugar em aberto: Economia ou Estado" (C1: fica na Economia); "Mundo/População/Governo" como pilares (agora Gosto, Economia, Leis); os conflitos 5 vs 6 vs 9 tipos de dono (valem 9, ESTUDAR); modelo da cesta (GDD é a meta, motor atrás); regra fiscal e dívida (GDD é a meta, motor atrás). Mandei para Em aberto: blocos da bolsa (duas versões numa frase); verba da estatal por lei ou por setor; os 15 setores contra os 7 do motor (Luxo e Essenciais são tipo de bem?); como definir a divisão da verba entre pessoal, compras e obras (14/nov, não fixa); custo fixo por ministério; ESTUDAR tipos de dono. Preço calculado uma vez por turno ficou como regra de 14/nov. A abertura (antigo III.0) foi encurtada, mas todas as regras foram mantidas. -->
