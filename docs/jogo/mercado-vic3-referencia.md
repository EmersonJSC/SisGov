# Como o mercado do Victoria 3 funciona (referência)

Pesquisa de 02/nov/2026, feita na wiki do jogo e nos diários dos
desenvolvedores. Serve de base para desenhar o mercado do SisGov. É referência
de **como a mecânica funciona**: nada daqui vira nome, número ou texto do
nosso jogo sem passar pelo autor. Versões citadas pela wiki: 1.8 a 1.13; o que
a wiki marca como desatualizado está dito abaixo.

## 1. A ideia em uma frase

Quem produz põe tudo à venda; quem consome põe tudo à compra; **o preço sobe
quando a compra passa da venda e desce quando a venda passa da compra**. O
dinheiro que as pessoas têm decide o que elas conseguem comprar; o que elas
conseguem comprar decide o padrão de vida; o padrão de vida decide se a
população cresce, passa fome ou fica zangada.

## 2. Mercado, oferta e demanda

- Cada país tem um **mercado nacional**. Países ligados (união aduaneira)
  dividem um mercado só.
- **Ordens de venda** vêm de quem produz (prédios). **Ordens de compra** vêm
  dos **pops** (população) e dos prédios (que compram insumos).
- Tudo é abstrato: o produtor vende tudo o que faz e o consumidor compra tudo
  o que precisa, mesmo quando as ordens não batem. A diferença entre compra e
  venda não "falta" fisicamente: ela vira **preço** (e, em falta grande,
  **perda de produção**, ver seção 5).
- Cada estado (região) entrega suas ordens ao mercado **multiplicadas pelo
  acesso ao mercado** (seção 4).

## 3. Preço

- Todo bem tem um **preço base** (o preço quando compra = venda). Exemplos:
  grãos 20, roupas 30, carne 30, ferro 40, carros 100.
- Fórmula do preço de mercado:

  `preço = base × [1 + 0,75 × clamp((COMPRA − VENDA) ÷ min(COMPRA, VENDA), −1, +1)]`

- O preço fica entre **25% e 175% do base**. Ex.: madeira (base 20), compra 100,
  venda 120 → 20 × (1 − 0,75 × 0,2) = 17.
- Tarifas são calculadas sobre o preço base, não sobre o de mercado.
- **Preço local** (do estado) = `MAPI × preço do mercado + (1 − MAPI) × preço
  do estado`; MAPI é o quanto o estado "enxerga" o mercado nacional (leis,
  tecnologia, acesso). Serviços, transporte e eletricidade só têm preço local.
- Bens têm categorias: **de consumo básico** (grão, peixe, roupa, móveis),
  **de luxo** (carne, vinho, carro, arte), **industriais** (ferro, carvão,
  aço, ferramentas, petróleo), **militares** (munição, tanques) e **locais**
  (serviços, transporte, eletricidade, que não viajam).

## 4. Acesso ao mercado e infraestrutura

- Acesso = `infraestrutura ÷ uso da infraestrutura`, no máximo 100%. Estado
  isolado tem 0%.
- Estado com pouco acesso entrega e recebe menos do mercado: o preço dele
  fica mais perto do preço local do que do nacional.
- Para falar com o **mercado mundial**, precisa de porto (ou direito de
  trânsito com vizinho que tenha). **Centros de comércio** movem bens
  automaticamente; **tarifas** e **subsídios** (0, 12,5, 25, 50%) e
  **embargos** mexem no comércio.

## 5. Falta e sobra

- **Falta** (compra ≥ 2 × venda): prédios que usam esse insumo perdem
  produção: −5% e piora 1% por dia até −50% (−75% se o bem sumiu).
- **Sobra**: o comprador fica mais rico, o produtor perde lucro; produtor sem
  lucro não aumenta salário e demite, o que gera radicais. Subsídio do
  governo cobre, com custo no caixa.
- Falta dá lucro e dividendo ao produtor; falta grande machuca produção e
  padrão de vida.

## 6. Pops: o que consomem e quanto podem pagar

- Cada pop tem **riqueza** (nível de 1 a 99). **Padrão de vida = nível de
  riqueza** (salvo modificadores). Faixas: 1–4 miserável, 5–9 em dificuldade,
  10–14 empobrecido, 15–19 médio, 20–24 seguro, 25–29 próspero, 30+ rico.
- Cada nível de riqueza traz uma lista de **necessidades** (roupa simples,
  aquecimento, comida básica, bebida; mais acima: móveis, serviços, comida
  de luxo…). Cada necessidade vale uma **quantia em dinheiro a preço base**,
  calculada para 10.000 pops trabalhadores.
- Uma necessidade pode ser atendida por **vários bens em qualquer mistura**,
  desde que a soma, a preço base, feche a quantia (grão, peixe, mercearia
  contam para comida básica). O pop tenta comprar pelo menos dois bens
  diferentes por necessidade, se existirem. Escolhe pelo que está disponível.
- Dependentes consomem **metade** de quem trabalha. Padrão: 25% da população
  trabalha, 75% é dependente (leis e profissões mudam isso).
- **Renda** = salário (ou dividendo, para dono), mais o que os dependentes
  recebem e a assistência social. **Despesa** = necessidades (aos preços
  correntes) + impostos.
- A riqueza **sobe** devagar (0,2 × a diferença) quando a renda passa de 102%
  do custo do nível seguinte, e **desce** (0,1 × a diferença) quando a renda
  cai abaixo de 98% da despesa. Ela se acomoda onde renda e despesa se
  igualam. **Comida cara empurra o pop pobre para baixo na escada; comida
  barata o empurra para cima.** Pops mais ricos sofrem menos com preço alto,
  porque gastam uma fatia menor da renda em comida.

## 7. Fome (a partir da 1.8)

- Antes: fome era só "padrão de vida abaixo de 5", mesmo que o problema fosse
  roupa cara, não comida.
- Agora cada pop tem **segurança alimentar** (0–100%):
  `100% − (parte da despesa gasta em comida básica) − (falta de comida básica)`.
  Exemplo dos desenvolvedores: gasta 70% do orçamento em comida e há 20% de
  falta → segurança de 10%.
- A "falta" de comida é a média da falta de cada bem, pesada pelo quanto o
  pop consome de cada um (se 90% do consumo é grão, falta de grão pesa muito
  mais que falta de peixe).
- **Fome leve** abaixo de 40%; **fome grave** abaixo de 20%. Efeitos escalam
  com a gravidade: leve corta até 35% dos nascimentos e sobe até 30% da
  mortalidade; grave corta até 90% dos nascimentos e dobra a mortalidade.
- **Fome coletiva (famine)** é só um rótulo político: mais de 35% do estado em
  fome leve e mais de 15% em fome grave.
- Alívio: socorro de emergência, hospitais de caridade, seguridade social,
  pensões somam pontos de segurança alimentar.
- Só a comida básica tem "falta" calculada; as outras necessidades não.

## 8. Padrão de vida → população e política

- **Mortalidade** sobe forte abaixo de padrão 5 (fome) e cai rápido entre 5 e
  15. **Natalidade** cai entre 10 e 25 (quem enriquece tem menos filhos).
  Piso: 0,60% nascimentos e 0,45% mortes ao ano. Poluição pode subir a
  mortalidade em até 50%; desemprego corta a natalidade em até 40%.
- **Padrão esperado** (pops baixos 5, médios 10, altos 15, mais letramento).
  Abaixo do esperado, a **radicalização** cresce (+0,2% por nível de
  diferença ao mês, até 15%). Padrão que cai dá radicais; que sobe dá
  legalistas.
- **Migração**: pop com padrão abaixo da média do mercado tem mais chance de
  migrar (1% por nível abaixo).

## 9. Prédios (a oferta)

- Cada prédio tem um **método de produção**: insumos, produtos e empregos por
  nível. Ex.: roupa artesanal +45 roupa, −40 tecido, empregos para lojistas e
  trabalhadores.
- **Produtividade** = (preço anual da saída − preço anual dos insumos) ÷
  nº de empregados. **Saldo semanal** = (produtividade − salário médio anual)
  × empregados ÷ 52.
- **Vazão** (throughput) multiplica insumos e produto sem aumentar a mão de
  obra (escala, tecnologia, empresas). Falta de insumo reduz a vazão.
- **Lucro** vai em parte para o caixa do prédio (25 a 50%) e o resto em
  **dividendos** aos donos (por cotas). Donos investem parte no **fundo de
  investimento**, que paga construção de prédios novos (ou o governo, se o
  prédio for estatal).
- A wiki **não explica** como o salário é fixado nem como prédios disputam
  mão de obra; não copiar o que não se sabe.

## 10. Ligações que fazem o jogo funcionar

1. População (quantas pessoas, que riqueza) → **demanda** por cada bem.
2. Prédios (quanto produzem, com que insumos) → **oferta** por cada bem.
3. Demanda ÷ oferta → **preço**.
4. Preço + renda → **o que o pop consegue comprar** → riqueza e fome.
5. Riqueza e fome → **natalidade, mortalidade, radicalismo, migração**.
6. Lucro dos prédios → **salário e dividendo** → renda do pop (volta ao 4).
7. Governo mexe por **leis** (impostos, tarifas, subsídios, assistência) e
   por **infraestrutura**.

## 11. O que a pesquisa não achou (lacunas)

- Quantidade exata de cada bem que um pop compra por pessoa.
- Fórmula de salário e disputa por mão de obra.
- Substituição entre bens além de "mistura livre desde que a soma feche".

## Fontes

- Wiki do Victoria 3: páginas Market, Pop, Goods, Standard of living, Buildings
  (vic3.paradoxwikis.com).
- Diário dos desenvolvedores 131 (fomes, fome e colheita) e 13 (padrão de
  vida), no fórum da Paradox.
