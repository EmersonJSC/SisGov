# Inventário das leis

Gerado por `npm run inventario` (país brasil-2026). Não editar à mão: rodar de novo.
As marcas só apontam o que o número mostra; cortar, juntar ou manter é decisão do autor.

- **sem ligação**: a lei não mexe em nenhum índice nem grupo.
- **só grupos**: mexe em grupos, mas em nenhum índice.
- **N opções**: lei de opções com 2 ou menos, ou mais de 6.
- **nome parecido**: mesma esfera e metade ou mais das palavras do nome em comum (sem contar palavras que aparecem em mais de 6 leis, como "verba").
- **mesmo efeito**: mesma esfera e mexe exatamente nos mesmos índices (2 ou mais).
- **país não declara**: o país não tem valor para ela (fica fora do mapa).

## Resumo por esfera

| Esfera | Leis | Sem ligação | Só grupos | Nome parecido | Mesmo efeito | Não declaradas |
| ------ | ---- | ----------- | --------- | ------------- | ------------ | -------------- |
| agricultura-e-pesca | 16 | 3 | 2 | 9 | 2 | 2 |
| assistencia-social | 18 | 1 | 1 | 8 | 0 | 3 |
| ciencia-e-pesquisa | 18 | 11 | 1 | 5 | 0 | 0 |
| comercio-exterior-e-capital | 10 | 3 | 2 | 0 | 0 | 1 |
| comunicacao-e-tecnologia | 15 | 2 | 1 | 6 | 0 | 4 |
| cultura-e-esporte | 14 | 9 | 1 | 6 | 0 | 0 |
| defesa | 9 | 0 | 0 | 6 | 0 | 1 |
| defesa-civil | 8 | 4 | 1 | 4 | 0 | 1 |
| direitos-e-liberdades | 13 | 1 | 0 | 3 | 4 | 3 |
| educacao | 23 | 0 | 1 | 10 | 8 | 3 |
| empresas-e-estatais | 16 | 7 | 0 | 2 | 0 | 3 |
| energia | 14 | 0 | 1 | 6 | 2 | 1 |
| estado-e-eleicoes | 24 | 3 | 0 | 5 | 2 | 2 |
| imigracao | 14 | 1 | 1 | 2 | 0 | 3 |
| impostos | 22 | 0 | 0 | 8 | 6 | 5 |
| infraestrutura-e-transporte | 34 | 10 | 4 | 12 | 5 | 7 |
| justica-e-prisoes | 18 | 1 | 0 | 8 | 3 | 2 |
| meio-ambiente | 17 | 0 | 0 | 11 | 2 | 3 |
| mineracao-e-petroleo | 15 | 3 | 5 | 7 | 0 | 1 |
| moeda-e-bancos | 14 | 1 | 0 | 4 | 2 | 5 |
| moradia | 15 | 0 | 0 | 3 | 3 | 4 |
| orcamento-e-divida | 18 | 4 | 1 | 7 | 0 | 4 |
| previdencia | 12 | 0 | 0 | 6 | 2 | 1 |
| relacoes-exteriores | 5 | 2 | 0 | 0 | 0 | 1 |
| saneamento | 4 | 0 | 0 | 0 | 2 | 1 |
| saude | 28 | 0 | 0 | 14 | 12 | 8 |
| seguranca-publica | 29 | 1 | 1 | 15 | 5 | 0 |
| terra | 16 | 3 | 3 | 9 | 0 | 2 |
| trabalho | 37 | 8 | 5 | 14 | 2 | 5 |
| vicios | 16 | 0 | 0 | 8 | 5 | 1 |
| **Total** | **512** | **78** | **31** | **198** | **67** | **77** |

## agricultura-e-pesca

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Agrotóxicos `agrotoxicos` | Quais venenos de lavoura são permitidos: livres, proíbe os mais tóxicos, reavalia todos, quase nenhum. | 4 opções |  | Meio ambiente, Preço da comida |  |
| Assistência técnica ao produtor `assistencia-tecnica-ao-produtor` | Verba do órgão que ensina o pequeno produtor a plantar e criar melhor. | régua | gasta | Produtividade |  |
| Como se divide a pesca `como-se-divide-a-pesca` | Quem pode pescar: reservada ao pequeno, livre, por barco, cota vendável. | 4 opções |  | Estoque de peixe | nome parecido: Teto de pesca |
| Compra pública de comida: parte da sobra comprada `compra-publica-de-comida-parte-da-sobra-comprada` | Dois controles: quanto da sobra de grãos o Estado compra e quanto disso vem do pequeno. | régua |  | Abastecimento, Preço da comida | nome parecido: Compra pública de comida: parte vinda do pequeno · mesmo efeito: Compra pública de comida: parte vinda do pequeno |
| Compra pública de comida: parte vinda do pequeno `compra-publica-de-comida-parte-vinda-do-pequeno` | Dois controles: quanto da sobra de grãos o Estado compra e quanto disso vem do pequeno. | régua |  | Abastecimento, Preço da comida | nome parecido: Compra pública de comida: parte da sobra comprada · mesmo efeito: Compra pública de comida: parte da sobra comprada |
| Crédito rural barato: desconto nos juros `credito-rural-barato-desconto-nos-juros` | Dois controles: o desconto nos juros e o teto de dinheiro por produtor. | régua |  |  | só grupos · nome parecido: Crédito rural barato: teto por produtor; Exigência para o crédito rural |
| Crédito rural barato: teto por produtor `credito-rural-barato-teto-por-produtor` | Dois controles: o desconto nos juros e o teto de dinheiro por produtor. | régua |  |  | só grupos · nome parecido: Crédito rural barato: desconto nos juros; Exigência para o crédito rural |
| Exigência para o crédito rural `exigencia-para-o-credito-rural` | O que o produtor precisa provar para pegar crédito do Estado: nada, não ter multa aberta, reserva em dia, ou conferência por satélite. | 4 opções |  | Desmatamento | nome parecido: Crédito rural barato: desconto nos juros; Crédito rural barato: teto por produtor |
| Inspeção de alimentos `inspecao-de-alimentos` | Como o Estado confere a comida: nenhuma, por amostra, permanente, padrão de exportação para todos. | 4 opções |  |  | sem ligação |
| Seguro de safra `seguro-de-safra` | Quanto do seguro da colheita o Estado paga. | régua |  | Abastecimento |  |
| Sementes transgênicas `sementes-transgenicas` | O que pode ser plantado: proibidas, só ração e fibras, com rótulo, liberadas. | 4 opções |  | Produtividade |  |
| Subsídio a barcos `subsidio-a-barcos` | Quanto o Estado paga por barco de pesca. | régua |  | Estoque de peixe | país não declara · nome parecido: Subsídio aos insumos |
| Subsídio aos insumos `subsidio-aos-insumos` | Por insumo, quanto o Estado paga de fertilizante, máquinas e sementes. Por ora, uma régua só para todos os setores. | régua |  | Concentração de terra, Preço da comida | nome parecido: Subsídio a barcos |
| Teto de pesca `teto-de-pesca` | % do peixe que pode ser tirado por ano. | régua |  | Estoque de peixe | país não declara · nome parecido: Como se divide a pesca |
| Venda direta do produtor `venda-direta-do-produtor` | Até onde o pequeno pode vender sem registro: proibida, feira da cidade, dentro do estado, livre. | 4 opções |  |  | sem ligação |
| Verba de irrigação `verba-de-irrigacao` | % do PIB para levar água ao campo. | régua | gasta |  | sem ligação |

## assistencia-social

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Abrigos para quem vive na rua `abrigos-para-quem-vive-na-rua` | Verba para abrigos e acolhimento. | régua | gasta | Moradores de rua |  |
| Benefício com contrapartida `beneficio-com-contrapartida` | O que quem recebe ajuda do governo precisa fazer em troca. Escada: nada, a ajuda é livre; filhos na escola e vacina em dia; curso ou trabalho comunitário para os adultos; emprego ou curso obrigatório para quem pode trabalhar. | 7 opções |  |  | sem ligação · 7 opções · nome parecido: Benefício por filho; Parte do benefício em comida; Prazo máximo no benefício |
| Benefício por filho `beneficio-por-filho` | Quanto da transferência de renda é dividido por criança. Régua: de 0% a 50% da transferência paga por filho. | régua |  | Natalidade, Pobreza | nome parecido: Benefício com contrapartida; Parte do benefício em comida; Prazo máximo no benefício |
| Bolsa Família `transferencia-renda` | Dinheiro pago direto às famílias mais pobres. | régua | gasta | Pobreza |  |
| BPC da pessoa com deficiência `auxilio-para-pessoas-com-deficiencia` | Renda para quem não consegue trabalhar por deficiência. | régua | gasta | Pobreza |  |
| Comida do Estado `comida-do-estado` | Verba para cesta básica e restaurante barato. | régua | gasta | Fome | nome parecido: Parte do benefício em comida |
| Crédito para quem trabalha `credito-para-quem-trabalha` | Quanto da Transferência de renda vai só para quem trabalha e ganha pouco. Escada: nada, o benefício é igual para todos; um extra pequeno para quem trabalha; metade do benefício só para quem trabalha; todo o benefício só para quem trabalha. | 5 opções |  | Pobreza | país não declara |
| Doação com dedução `doacao-com-deducao` | Quanto do valor doado a entidades pode ser descontado do imposto de quem doa. Régua: de 0% a 50% da doação descontada do imposto. | régua |  | Pobreza |  |
| Microcrédito `microcredito` | Empréstimo pequeno para abrir negócio. | régua | gasta | Emprego informal, Pobreza |  |
| Parte do benefício em comida `parte-do-beneficio-em-comida` | Quanto da Transferência de renda só pode ser gasto em comida, de 0% a 100%. | régua |  | Fome | país não declara · nome parecido: Benefício com contrapartida; Benefício por filho; Comida do Estado; Prazo máximo no benefício |
| Pente-fino nos benefícios `pente-fino-nos-beneficios` | Quanto o governo confere quem recebe benefício para cortar fraudes. Escada: nenhuma conferência; conferência uma vez por ano em um cadastro; cruzamento constante de vários cadastros; recadastro obrigatório com corte automático de quem não responde. | 4 opções |  | Fraude em benefícios, Pobreza |  |
| Prazo máximo no benefício `prazo-maximo-no-beneficio` | Por quanto tempo uma família pode receber a Transferência de renda. | régua |  |  | só grupos · país não declara · nome parecido: Benefício com contrapartida; Benefício por filho; Parte do benefício em comida |
| Quem recebe a Transferência `quem-recebe-a-transferencia` | Quantas famílias entram na Transferência de renda, das 5% mais pobres até a metade do país. | régua |  | Fome, Fraude em benefícios, Pobreza |  |
| Renda básica para todos `renda-basica-para-todos` | Quem recebe a Transferência de renda sem nenhuma condição. Escada: ninguém, só quem comprova necessidade; todos os idosos e crianças; todos os adultos que ganham pouco, sem exigir nada; todos os moradores, sem exigir nada. | 7 opções |  | Fraude em benefícios, Liberdades, Pobreza | 7 opções |
| Repasse a entidades religiosas `repasse-a-entidades-religiosas` | O Estado paga igrejas e entidades para atender. | régua | gasta | Fome, Moradores de rua, Polarização |  |
| Tarifa social de água `tarifa-social-de-agua` | Quanto de desconto as famílias pobres têm na conta de água e esgoto. Régua: de 0% a 50% de desconto na conta. | régua |  | Pobreza | nome parecido: Tarifa social de gás; Tarifa social de luz |
| Tarifa social de gás `tarifa-social-de-gas` | Quanto de desconto as famílias pobres do cadastro têm no botijão de gás. Régua: de 0% a 50% de desconto no preço do botijão. | régua |  | Pobreza | nome parecido: Tarifa social de água; Tarifa social de luz |
| Tarifa social de luz `tarifa-social-de-luz` | Quanto de desconto as famílias pobres têm na conta de luz. Escada: nenhum desconto; desconto pequeno só para famílias muito pobres; desconto grande para pobres e quase pobres; luz grátis até o consumo básico para todos os pobres. | 4 opções |  | Pobreza | nome parecido: Tarifa social de água; Tarifa social de gás |

## ciencia-e-pesquisa

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Bolsas de pesquisa `bolsas-de-pesquisa` | Quantas bolsas de mestrado e doutorado o Estado paga. | régua | gasta |  | só grupos · nome parecido: Desconto de imposto para quem pesquisa; Pesquisa com vírus perigosos |
| De quem é a invenção paga pelo Estado `de-quem-e-a-invencao-paga-pelo-estado` | O que acontece com o que sai da pesquisa pública: aberta a todos, fica com o Estado, com a universidade ou com a empresa parceira. | 4 opções |  |  | sem ligação |
| Desconto de imposto para quem pesquisa `desconto-de-imposto-para-quem-pesquisa` | Quanto do que a companhia gasta em pesquisa volta como desconto no imposto. | régua |  | Produtividade, Tecnologia do país | nome parecido: Bolsas de pesquisa; Pesquisa com vírus perigosos |
| Divisão da verba de ciência: Agro `divisao-da-verba-de-ciencia-agro` | Reparte 100% da verba em 7 fatias: Ciência básica, Saúde e remédios, Indústria e chips, Energia e baterias, Agro, Defesa e Espaço. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação |
| Divisão da verba de ciência: Ciência básica `divisao-da-verba-de-ciencia-ciencia-basica` | Reparte 100% da verba em 7 fatias: Ciência básica, Saúde e remédios, Indústria e chips, Energia e baterias, Agro, Defesa e Espaço. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação |
| Divisão da verba de ciência: Defesa `divisao-da-verba-de-ciencia-defesa` | Reparte 100% da verba em 7 fatias: Ciência básica, Saúde e remédios, Indústria e chips, Energia e baterias, Agro, Defesa e Espaço. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação |
| Divisão da verba de ciência: Energia e baterias `divisao-da-verba-de-ciencia-energia-e-baterias` | Reparte 100% da verba em 7 fatias: Ciência básica, Saúde e remédios, Indústria e chips, Energia e baterias, Agro, Defesa e Espaço. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação |
| Divisão da verba de ciência: Espaço `divisao-da-verba-de-ciencia-espaco` | Reparte 100% da verba em 7 fatias: Ciência básica, Saúde e remédios, Indústria e chips, Energia e baterias, Agro, Defesa e Espaço. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação |
| Divisão da verba de ciência: Indústria e chips `divisao-da-verba-de-ciencia-industria-e-chips` | Reparte 100% da verba em 7 fatias: Ciência básica, Saúde e remédios, Indústria e chips, Energia e baterias, Agro, Defesa e Espaço. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação |
| Divisão da verba de ciência: Saúde e remédios `divisao-da-verba-de-ciencia-saude-e-remedios` | Reparte 100% da verba em 7 fatias: Ciência básica, Saúde e remédios, Indústria e chips, Energia e baterias, Agro, Defesa e Espaço. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação |
| Duração da patente `duracao-da-patente` | Por quantos anos quem inventa é o único a vender, de 0 a 30. | régua |  | Produtividade | nome parecido: Quebra de patente |
| Edição de genes em pessoas `edicao-de-genes-em-pessoas` | Até onde a ciência pode mexer nos genes: proibida, só em laboratório, tratar adultos, embrião sem nascer, bebês editados. | 5 opções |  | Reputação internacional |  |
| Pesquisa com vírus perigosos `pesquisa-com-virus-perigosos` | Quem pode estudar vírus perigosos: proibida, só em laboratório de segurança máxima, liberada. | 3 opções |  |  | sem ligação · nome parecido: Bolsas de pesquisa; Desconto de imposto para quem pesquisa |
| Programa espacial `programa-espacial` | Escolhe o alvo do país: satélite, foguete, astronauta, estação ou chegar à Lua na corrida com os outros países. | 5 opções |  |  | sem ligação |
| Quebra de patente `quebra-de-patente` | Até onde o presidente pode ir para deixar fabricar sem pagar ao dono: nunca, em emergência de saúde, remédios, setores estratégicos. | 4 opções |  | Reputação internacional | nome parecido: Duração da patente |
| Testes em animais `testes-em-animais` | Quanto se pode testar em animais: livres, regulados, proibidos em cosméticos, proibidos em quase tudo. | 4 opções |  |  | sem ligação |
| Trazer cientistas de volta `trazer-cientistas-de-volta` | Quanto o Estado paga por pesquisador que volta ao país. | régua | gasta | Fuga de cientistas |  |
| Verba de ciência e tecnologia `verba-de-ciencia-e-tecnologia` | Quanto do PIB o Estado põe em ciência e tecnologia. Mais verba sobe tudo. | régua | gasta | Tecnologia do país |  |

## comercio-exterior-e-capital

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Defesa comercial `defesa-comercial` | Vai de nenhuma, passa por antidumping, até salvaguardas amplas contra importação barata. | 3 opções |  | Abertura comercial |  |
| Fábrica estrangeira no país `fabrica-de-fora` | O que o país pede de quem abre fábrica aqui. | 3 opções |  |  | sem ligação |
| Facilitação aduaneira `facilitacao-aduaneira` | Quanto a burocracia nos portos e fronteiras atrasa e encarece o comércio: de muito lenta até rápida. | régua |  | Abertura comercial, Corrupção |  |
| Imposto sobre exportação `imposto-sobre-exportacao` | Imposto sobre o que sai do país. A lei tem uma aba por setor, cada uma com a sua taxa. Por ora, uma régua só para todos os setores. | régua |  |  | só grupos · país não declara |
| Remessa de lucro ao exterior `remessa-de-lucro` | Imposto sobre o lucro que sai do país. | 3 opções |  |  | sem ligação |
| Subsídio às exportações `subsidio-as-exportacoes` | Dinheiro do Estado para exportadores. A lei tem uma aba por setor, cada uma com a sua régua de % do PIB. Por ora, uma régua só para todos os setores. | régua | gasta |  | só grupos |
| Tarifa de importação `tarifa-de-importacao` | Imposto sobre o que entra no país. A lei tem uma aba por setor, cada uma com a sua tarifa de 0 a 50%, e uma aba "Todos" que mexe todas juntas. Por ora, uma régua só para todos os setores. | régua |  | Abertura comercial |  |
| Triagem de compra estrangeira `triagem-estrangeira` | Como o país olha quem de fora quer comprar empresas. | 3 opções |  |  | sem ligação |
| Venda de armas ao exterior `venda-de-armas-ao-exterior` | Para quem o país pode vender armas. Escada: proibida; só para países aliados, com licença caso a caso; para qualquer país sem embargo; livre, com licença simples. | 6 opções |  | Reputação internacional |  |
| Zonas francas `zonas-francas` | Escada: nenhuma; só em áreas pobres; algumas áreas; muitas áreas com imposto menor e regras próprias para fábricas. | 4 opções |  | Industrialização, Investimento estrangeiro |  |

## comunicacao-e-tecnologia

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Abertura das telecomunicações `abertura-das-telecomunicacoes` | Quantas empresas podem vender internet e telefone. Escada: só a empresa do Estado; Estado mais uma empresa privada; poucas empresas com licença; qualquer empresa que cumpra as regras. | 4 opções |  | Acesso à internet |  |
| Bloqueio de internet `bloqueio-de-internet` | Escada: nenhum, bloquear um site por ordem do juiz, bloquear redes em crise declarada, ou apagão local onde há conflito. O apagão nacional só existe no Estado de exceção no nível sítio. | 4 opções |  | Liberdade de imprensa | nome parecido: Internet pública |
| Concessão de rádio e TV `concessao-de-radio-e-tv` | Quanto o governo manda nas licenças de rádio e TV. Escada: licença por prazo fixo e só a Justiça pode cassar; o governo cassa só com processo e defesa; o governo renova ou cassa como achar melhor; o governo escolhe quem tem licença e cassa quando quiser. | 5 opções |  | Liberdade de imprensa, Reputação internacional |  |
| Criptografia livre `criptografia-livre` | Até onde o governo pode exigir acesso às mensagens. Escada: livre; acesso com ordem do juiz; o governo guarda a chave; proibida. | 4 opções |  | Liberdades | país não declara |
| Emissora estatal `emissora-estatal` | Verba para uma TV e rádio do Estado. | régua | gasta | Desinformação | nome parecido: Independência da emissora estatal |
| Identificação dos usuários `identificacao-dos-usuarios` | Escada: anonimato livre, cadastro nas redes, ou documento obrigatório para postar. | 3 opções |  | Desinformação, Liberdades | país não declara |
| Independência da emissora estatal `independencia-da-emissora-estatal` | Quem escolhe o diretor da emissora: o governo, um conselho, ou mandato fixo. | 3 opções |  |  | sem ligação · nome parecido: Emissora estatal |
| Internet pública `internet-publica` | Verba para levar banda larga a quem não tem. | régua | gasta | Acesso à internet | nome parecido: Bloqueio de internet |
| Lei contra notícias falsas `lei-contra-noticias-falsas` | Como se pune quem espalha notícia falsa. Escada: nenhuma; a plataforma precisa pôr aviso na notícia provada falsa; remoção da notícia provada falsa; multa para quem espalha de propósito; prisão para quem espalha de propósito. | 5 opções |  | Desinformação, Liberdade de imprensa | país não declara |
| Limite a dono estrangeiro `limite-a-dono-estrangeiro` | Quanto da mídia um estrangeiro pode ter. | régua |  |  | só grupos · nome parecido: Limite de dono de mídia |
| Limite de dono de mídia `limite-de-dono-de-midia` | Quantas emissoras de rádio e TV um mesmo dono pode ter; menos é limite mais duro. Régua: de 10 a 1 emissoras por dono (sem a lei, sem limite). | régua |  | Liberdade de imprensa | nome parecido: Limite a dono estrangeiro |
| Neutralidade da rede `neutralidade-da-rede` | O que a operadora não pode fazer para favorecer um site. Escada, cada degrau incluindo o anterior: nada; não pode bloquear site; não pode deixar site lento; não pode dar aplicativo de graça no plano. | 4 opções |  |  | sem ligação |
| Publicidade do governo `publicidade-do-governo` | Verba de anúncios do governo na mídia. | régua | gasta | Liberdade de imprensa |  |
| Regras de inteligência artificial `regras-de-inteligencia-artificial` | Escada: sem regra, avisar quando é IA, testes em crédito, emprego, saúde e polícia, proibir usos perigosos, ou licença para modelos grandes. | 5 opções |  | Desinformação, Industrialização | país não declara |
| Remoção de conteúdo `remocao-de-conteudo` | Escada: só com ordem do juiz, conteúdo ilegal em 24 horas, ou também desinformação. | 3 opções |  | Desinformação |  |

## cultura-e-esporte

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Conteúdo nacional `conteudo-nacional` | Parte da programação que precisa ser feita no país. Escada: nada; cinema; rádio e TV aberta; TV paga; streaming. | 5 opções |  |  | sem ligação |
| Direito do dono `direito-do-dono` | O que o dono do bem pode exigir quando o protegem. Escada: nada; ser ouvido; ser indenizado; só protege com aceite. | 4 opções |  | Bens em risco |  |
| Divisão da verba de cultura e esporte: Artistas e festas `divisao-da-verba-de-cultura-e-esporte-artistas-e-festas` | Reparte 100% da verba entre Patrimônio, Artistas e festas, Esporte no bairro, Atletas e Propaganda do turismo. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação · nome parecido: Divisão da verba de cultura e esporte: Atletas; Divisão da verba de cultura e esporte: Esporte no bairro; Divisão da verba de cultura e esporte: Patrimônio; Verba de cultura e esporte |
| Divisão da verba de cultura e esporte: Atletas `divisao-da-verba-de-cultura-e-esporte-atletas` | Reparte 100% da verba entre Patrimônio, Artistas e festas, Esporte no bairro, Atletas e Propaganda do turismo. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação · nome parecido: Divisão da verba de cultura e esporte: Artistas e festas; Divisão da verba de cultura e esporte: Esporte no bairro; Divisão da verba de cultura e esporte: Patrimônio; Divisão da verba de cultura e esporte: Propaganda do turismo; Verba de cultura e esporte |
| Divisão da verba de cultura e esporte: Esporte no bairro `divisao-da-verba-de-cultura-e-esporte-esporte-no-bairro` | Reparte 100% da verba entre Patrimônio, Artistas e festas, Esporte no bairro, Atletas e Propaganda do turismo. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação · nome parecido: Divisão da verba de cultura e esporte: Artistas e festas; Divisão da verba de cultura e esporte: Atletas; Divisão da verba de cultura e esporte: Patrimônio; Divisão da verba de cultura e esporte: Propaganda do turismo; Verba de cultura e esporte |
| Divisão da verba de cultura e esporte: Patrimônio `divisao-da-verba-de-cultura-e-esporte-patrimonio` | Reparte 100% da verba entre Patrimônio, Artistas e festas, Esporte no bairro, Atletas e Propaganda do turismo. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação · nome parecido: Divisão da verba de cultura e esporte: Artistas e festas; Divisão da verba de cultura e esporte: Atletas; Divisão da verba de cultura e esporte: Esporte no bairro; Divisão da verba de cultura e esporte: Propaganda do turismo; Verba de cultura e esporte |
| Divisão da verba de cultura e esporte: Propaganda do turismo `divisao-da-verba-de-cultura-e-esporte-propaganda-do-turismo` | Reparte 100% da verba entre Patrimônio, Artistas e festas, Esporte no bairro, Atletas e Propaganda do turismo. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação · nome parecido: Divisão da verba de cultura e esporte: Atletas; Divisão da verba de cultura e esporte: Esporte no bairro; Divisão da verba de cultura e esporte: Patrimônio; Verba de cultura e esporte |
| Empresa banca cultura e desconta do imposto `empresa-banca-cultura-e-desconta-do-imposto` | Quanto do patrocínio a cultura e esporte a empresa desconta do imposto, de 0 a 100%. | régua |  |  | só grupos |
| Idade para filme e TV `idade-para-filme-e-tv` | Quem decide o que a criança vê. Sem aviso; aviso que recomenda; aviso obrigatório; só com responsável; proibido para a idade. | 5 opções |  |  | sem ligação |
| Meia-entrada `meia-entrada` | Quem paga metade em cinema, show e jogo. Escada, somando: ninguém; estudantes; idosos e deficientes; professores; família pobre. | 5 opções |  |  | sem ligação |
| O que pode ser protegido `o-que-pode-ser-protegido` | O que entra na fila, cada degrau incluindo o anterior: prédios e monumentos do governo; centros históricos; terreiros e quilombos; festas e saberes. | 4 opções |  | Bens em risco |  |
| Pedido de tombamento `quem-pode-pedir` | Quem pode pôr um pedido na fila do patrimônio. Escada: só o governo; prefeitura e estado; associações; qualquer cidadão. | 4 opções |  |  | sem ligação |
| Preço de museu e parque federal `preco-de-museu-e-parque-federal` | Quanto o visitante paga, de grátis a preço cheio. O dinheiro vai para a conservação. | régua |  | Bens em risco |  |
| Verba de cultura e esporte `verba-de-cultura-e-esporte` | Quanto do PIB vai para cultura e esporte. Escola de samba e escolinha de futebol disputam o mesmo dinheiro. | régua | gasta | Bens em risco | nome parecido: Divisão da verba de cultura e esporte: Artistas e festas; Divisão da verba de cultura e esporte: Atletas; Divisão da verba de cultura e esporte: Esporte no bairro; Divisão da verba de cultura e esporte: Patrimônio; Divisão da verba de cultura e esporte: Propaganda do turismo |

## defesa

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Autonomia das Forças Armadas `autonomia-das-forcas-armadas` | Escada de 5 níveis: ministro civil com Congresso aprovando, ministro civil, ministro militar, militares escolhem comando e orçamento, militares acima do governo. | 5 opções |  | Liberdades, Risco de golpe |  |
| Idade mínima do voluntário `idade-voluntario` | A partir de que idade alguém pode se alistar como voluntário nas forças armadas. | régua |  | Poder defensivo |  |
| Militares na segurança pública `militares-na-seguranca-publica` | Onde o exército patrulha as ruas. Escada: em lugar nenhum; só em fronteiras e presídios; em bairros violentos por tempo limitado; permanente nas grandes cidades. | 4 opções |  | Certeza de punição, Homicídios, Mortes pela polícia | nome parecido: Salário dos militares |
| Missões de paz `missoes-de-paz` | Tropas em missões internacionais. Versão futura. | régua | gasta | Reputação internacional |  |
| Projeto nuclear militar `projeto-nuclear-militar` | Construir a bomba: nenhum, público ou secreto. | 3 opções |  | Reputação internacional | país não declara · nome parecido: Verba militar |
| Salário dos militares `salario-dos-militares` | Quanto um militar ganha. A régua marca "igual a um civil do mesmo nível". | régua |  | Poder defensivo, Risco de golpe | nome parecido: Militares na segurança pública; Transparência dos contratos militares |
| Serviço militar obrigatório `servico-militar` | Quantos meses todo jovem é obrigado a servir nas forças armadas. Zero é sem serviço obrigatório. | régua |  | Liberdades, Padrão de vida, Poder defensivo | nome parecido: Verba militar |
| Transparência dos contratos militares `transparencia-militar` | Quanto das compras e contratos das forças armadas o público pode ver. | 3 opções |  | Corrupção, Poder defensivo | nome parecido: Salário dos militares |
| Verba militar `gasto-militar` | Dinheiro do governo para as forças armadas: soldo, equipamento e manutenção. | régua | gasta | Poder defensivo | nome parecido: Projeto nuclear militar; Serviço militar obrigatório |

## defesa-civil

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Ajuda a quem perdeu a casa `ajuda-a-quem-perdeu-a-casa` | O que a família atingida por desastre recebe, cada degrau incluindo o anterior: abrigo e cesta; aluguel por meses; casa nova. | 3 opções |  |  | sem ligação |
| Alerta de desastre `alerta-de-desastre` | Como o país avisa antes do desastre, cada degrau incluindo o anterior: nenhum; aviso por celular; sirenes em áreas de risco; rede nacional de monitoramento. | 4 opções |  | Preparo contra desastres |  |
| Divisão da verba da defesa civil: Prevenção `divisao-da-verba-da-defesa-civil-prevencao` | Reparte 100% da verba entre Prevenção, Resposta e Reconstrução. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação · nome parecido: Divisão da verba da defesa civil: Reconstrução; Divisão da verba da defesa civil: Resposta; Verba da defesa civil |
| Divisão da verba da defesa civil: Reconstrução `divisao-da-verba-da-defesa-civil-reconstrucao` | Reparte 100% da verba entre Prevenção, Resposta e Reconstrução. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação · nome parecido: Divisão da verba da defesa civil: Prevenção; Divisão da verba da defesa civil: Resposta; Verba da defesa civil |
| Divisão da verba da defesa civil: Resposta `divisao-da-verba-da-defesa-civil-resposta` | Reparte 100% da verba entre Prevenção, Resposta e Reconstrução. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação · nome parecido: Divisão da verba da defesa civil: Prevenção; Divisão da verba da defesa civil: Reconstrução; Verba da defesa civil |
| Reserva de emergência `reserva-de-emergencia` | Quanto do PIB fica guardado só para desastre. | régua | gasta |  | só grupos |
| Verba da defesa civil `verba-da-defesa-civil` | Quanto do PIB vai para prevenir, socorrer e reconstruir depois de desastres. | régua | gasta | Preparo contra desastres | nome parecido: Divisão da verba da defesa civil: Prevenção; Divisão da verba da defesa civil: Reconstrução; Divisão da verba da defesa civil: Resposta |
| Verba só com regra de área de risco `verba-so-com-regra-de-area-de-risco` | O que a cidade precisa cumprir para receber repasse federal, cada degrau incluindo o anterior: sem exigência; cidade mapeia o risco; cidade barra casa nova em área de risco. | 3 opções |  | Preparo contra desastres | país não declara |

## direitos-e-liberdades

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Acesso ao aborto `acesso-ao-aborto` | Escada: proibido, só com risco de vida, também em estupro, até 12 semanas, ou livre. | 5 opções |  | Natalidade, Polarização |  |
| Casamento entre pessoas do mesmo sexo `casamento-entre-pessoas-do-mesmo-sexo` | Que reconhecimento a lei dá a casais do mesmo sexo. Escada: nenhum; contrato particular entre os dois; união civil com direitos básicos; casamento igual ao de qualquer casal. | 4 opções |  | Discriminação, Liberdades, Polarização |  |
| Censura política `censura-politica` | Como o governo pune quem o critica. Escada: nenhuma; multa por ofender autoridades; prisão por criticar o governo; jornais e redes só publicam com aprovação prévia. | 4 opções |  |  | sem ligação · país não declara |
| Cotas em empresas e concursos `cotas-em-empresas-e-concursos` | Quantas vagas são reservadas a grupos com menos acesso. Escada: sem cotas; cotas só em concursos públicos; também vagas reservadas nos conselhos de grandes empresas; também cotas de contratação em empresas médias e grandes. | 4 opções |  | Desigualdade, Discriminação | mesmo efeito: Lei contra discriminação |
| Discurso de ódio `discurso-de-odio` | Como é punido quem ataca pessoas por cor, religião, origem ou orientação. Escada: sem punição; multa e retirada do conteúdo; indenização à vítima e serviço comunitário; crime com prisão. | 4 opções |  | Discriminação, Tensão religiosa |  |
| Lei contra discriminação `lei-contra-discriminacao` | Proíbe tratar pior alguém por cor, sexo, religião, origem ou orientação. Escada: no emprego, também nos serviços, também na moradia e no crédito. | 3 opções |  | Desigualdade, Discriminação | mesmo efeito: Cotas em empresas e concursos |
| LGPD `protecao-digital` | O que empresas e governo podem fazer com os dados das pessoas. | 3 opções |  | Liberdades |  |
| Liberdade de recusa das empresas `liberdade-de-recusa-das-empresas` | Se a empresa pode escolher a quem atende e a quem contrata. Escada: proibido recusar cliente ou candidato; recusa só por convicção religiosa do dono; escolhe livremente quem contrata; escolhe livremente quem contrata e quem atende. | 5 opções |  | Discriminação |  |
| Morte assistida `morte-assistida` | Escada: proibida, só para doença terminal, ou também para sofrimento sem cura. | 3 opções |  | Liberdades, Polarização | país não declara |
| Ofensa à religião `ofensa-a-religiao` | Como é punido quem ofende uma religião ou fé. Escada: nenhuma punição específica; multa para quem ofende pessoas por causa da fé; prisão para quem ofende uma religião; prisão para quem ofende ou critica a religião da maioria. | 5 opções |  | Liberdades, Tensão religiosa | nome parecido: Ofensa a símbolos e autoridades; Religião do Estado · mesmo efeito: Religião do Estado |
| Ofensa a símbolos e autoridades `ofensa-a-simbolos-e-autoridades` | Se ofender bandeira, hino, policiais ou juízes é crime. Escada: livre; punido só se houver ameaça ou violência; multa por ofender bandeira e hino; multa também por ofender policiais e juízes; prisão por ofender símbolos e autoridades. | 6 opções |  | Liberdades | nome parecido: Ofensa à religião |
| Religião do Estado `religiao-do-estado` | Escada: Estado laico, apoio a religiões, ou religião oficial. | 3 opções |  | Liberdades, Tensão religiosa | país não declara · nome parecido: Ofensa à religião · mesmo efeito: Ofensa à religião |
| Restrição a protestos `restricao-a-protestos` | Exige aviso, define locais e penas para protestos. Um dos degraus: bloquear rua ou estrada é crime, e a polícia libera sem ordem do juiz. | 4 opções |  | Liberdades |  |

## educacao

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Bolsa por frequência `bolsa-por-frequencia` | Paga a família se o filho for à escola. | régua | gasta | Instrução, Pobreza |  |
| Carreira do professor `carreira-do-professor` | Piso e plano de carreira dos professores. Escada: nada, cada escola paga o que quiser; piso de salário igual para todos; piso mais aumento a cada tempo de casa; piso, carreira e emprego fixo com dedicação a uma escola só. | 6 opções |  | Instrução |  |
| Cobrança na universidade pública `cobranca-na-universidade-publica` | Quanto do custo do curso o aluno paga na universidade pública. Régua: de 0% a 50% do custo do curso pago pelo aluno. | régua |  | Desigualdade, Instrução | mesmo efeito: ProUni |
| Complemento ao estado pobre `complemento-ao-estado-pobre` | Até onde a União completa o gasto por aluno do estado que gasta menos, de 0% a 100% da média do país. | régua |  | Evasão escolar, Qualidade do ensino, Vagas na escola | mesmo efeito: Escola em tempo integral |
| Creche e pré-escola `creche-e-pre-escola` | Verba para atender os menores e liberar os pais para trabalhar. | régua | gasta | Instrução | nome parecido: Escola em tempo integral; Escola militarizada; Escola obrigatória; Vale-escola |
| Educação sexual `educacao-sexual` | O que se ensina sobre o tema na escola. Escada: nada; só como funciona o corpo; corpo, prevenção de doenças e gravidez; tudo isso mais respeito, consentimento e identidade. | 6 opções |  | Polarização | nome parecido: Verba da educação |
| Ensino em casa `ensino-em-casa` | Se os pais podem ensinar o filho em casa. Escada: proibido; com registro e prova todo ano; só registro, sem prova; livre. | 5 opções |  | Instrução, Trabalho infantil | país não declara · nome parecido: Ensino religioso; Ensino técnico |
| Ensino religioso `ensino-religioso` | Se há religião na escola pública e de que jeito. Escada: nenhuma religião na escola; aula opcional sobre a história de todas as religiões; aula opcional da religião escolhida pela família; aula obrigatória da religião da maioria. | 4 opções |  | Polarização | nome parecido: Ensino em casa; Ensino técnico |
| Ensino técnico `ensino-tecnico` | Verba para formar em ofícios e indústria. | régua | gasta | Industrialização, Instrução | nome parecido: Ensino em casa; Ensino religioso |
| Escola em tempo integral `escola-em-tempo-integral` | Quanto das escolas públicas tem aula de manhã e de tarde, de 0% a 100%. | régua |  | Evasão escolar, Qualidade do ensino, Vagas na escola | nome parecido: Creche e pré-escola; Escola militarizada; Escola obrigatória; Vale-escola · mesmo efeito: Complemento ao estado pobre |
| Escola militarizada `escola-militarizada` | Quantas escolas públicas têm disciplina militar. Escada: nenhuma; só algumas escolas de bairros violentos; as escolas que a comunidade pedir; todas as escolas públicas. | 4 opções |  | Liberdades, Polarização | nome parecido: Creche e pré-escola; Escola em tempo integral; Escola obrigatória; Vale-escola |
| Escola obrigatória `escola-obrigatoria` | Até que idade o jovem é obrigado a estudar. Régua: de 10 a 18 anos. | régua |  | Instrução, Vagas na escola | nome parecido: Creche e pré-escola; Escola em tempo integral; Escola militarizada; Vale-escola · mesmo efeito: Vale-escola |
| Faculdades privadas `faculdades-privadas` | Quanto o ensino superior privado pode formar profissionais. Escada: nenhuma faculdade privada; poucas, com prova de qualidade antes de abrir; abertura livre com prova de qualidade no fim do curso; abertura livre sem nenhum controle. | 5 opções |  | Instrução, Profissionais de saúde |  |
| Fies `credito-estudantil` | Empréstimo do governo para pagar a faculdade. | régua | gasta | Instrução |  |
| Gestão privada de escolas `gestao-privada-de-escolas` | Quanto da rede de escolas é tocada por empresas contratadas. Régua: de 0% a 50% das escolas da rede. | régua |  |  | só grupos |
| Lei de Cotas `cotas-na-universidade` | Quem tem vaga reservada na universidade pública. Escada: sem cotas; vagas para quem veio de escola pública; vagas para escola pública e família de baixa renda; vagas para escola pública, baixa renda e cor da pele. | 5 opções |  | Desigualdade |  |
| Pagamento por resultado `pagamento-por-resultado` | Quanto o professor ganha a mais pela nota dos alunos. Escada: nenhum bônus; bônus pequeno para a escola inteira que melhora; bônus por nota da turma; bônus alto por professor conforme a nota dos alunos. | 4 opções |  | Instrução | país não declara |
| ProUni `bolsa-em-faculdade-privada` | O Estado paga vagas em faculdades privadas para renda baixa. | régua | gasta | Desigualdade, Instrução | mesmo efeito: Cobrança na universidade pública |
| Repasse só com meta `repasse-so-com-meta` | O que o estado precisa cumprir para receber dinheiro federal da escola. Escada: sem exigência; plano de melhora; nota mínima; troca da direção da escola ruim. | 4 opções |  | Desigualdade, Greves, Qualidade do ensino |  |
| Vagas públicas em medicina `vagas-publicas-em-medicina` | Quantas vagas novas por ano o Estado abre nos cursos de medicina, enfermagem e outros de saúde. Régua: de 0 a 20 mil vagas novas por ano. | régua |  | Atendimento, Profissionais de saúde | mesmo efeito: Validação de diploma estrangeiro |
| Vale-escola `vale-escola` | A família usa verba pública na escola privada. | régua | gasta | Instrução, Vagas na escola | país não declara · nome parecido: Creche e pré-escola; Escola em tempo integral; Escola militarizada; Escola obrigatória · mesmo efeito: Escola obrigatória |
| Validação de diploma estrangeiro `validacao-de-diploma-estrangeiro` | Se quem se formou fora pode atender aqui e com que prova. Escada: não aceita; aceita só depois de curso e prova completos; aceita com prova curta; aceita direto, com registro no conselho. | 5 opções |  | Atendimento, Profissionais de saúde | mesmo efeito: Vagas públicas em medicina |
| Verba da educação `gasto-educacao` | Dinheiro do governo para escolas e universidades. | régua | gasta | Instrução | nome parecido: Educação sexual |

## empresas-e-estatais

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Abertura de empresa `abertura-de-empresa` | Régua do tempo e custo para abrir uma empresa, de muito burocrática até simples. Marca na régua: atividade de baixo risco não precisa de alvará. | régua |  | Emprego informal, Tempo para abrir empresa | nome parecido: Política da empresa estatal |
| Ação de ouro `acao-de-ouro` | Vai de nenhuma, passa por veto na venda a estrangeiro, até veto amplo. O Estado vende mas mantém voz nas decisões estratégicas. | 3 opções |  |  | sem ligação · país não declara |
| Apoio a cooperativas `apoio-a-cooperativas` | Crédito e imposto menor para empresas dos trabalhadores. | régua | gasta | Trabalhadores em cooperativas |  |
| Autorização para estatizar e vender `autorizacao-para-estatizar-e-vender` | Quem precisa aprovar quando o Estado estatiza ou vende uma companhia: só o presidente, o Congresso, ou plebiscito. | 3 opções |  |  | sem ligação |
| Concorrência (antitruste) `concorrencia` | O que o governo faz contra empresas grandes demais. | 3 opções |  |  | sem ligação |
| Indenização na estatização `indenizacao` | Quanto o Estado paga ao dono quando toma uma empresa ou uma terra. | 3 opções |  |  | sem ligação |
| Independência das agências `independencia-das-agencias` | Quem manda em quem fiscaliza luz, telefone, combustível e transporte. Escada: o ministro manda; chefe com mandato fixo; órgão independente com verba própria. | 3 opções |  | Confiança do mercado, Investimento estrangeiro |  |
| Indicação dos dirigentes das estatais `indicacao-dos-dirigentes-das-estatais` | Vai de política (amigos do partido), passa por mista, até técnica (concurso ou lista). | 4 opções |  | Corrupção, Eficiência das estatais |  |
| Limite de aviso ao mercado `limite-de-aviso-ao-mercado` | Quanto do capital de uma empresa pode ser comprado antes de avisar o público: de 1% a 20%, ou nunca. | régua |  | Confiança do mercado |  |
| Participação dos trabalhadores `participacao-dos-trabalhadores` | Vai de nenhuma, passa por participação nos lucros, até vaga no conselho. | 3 opções |  | Desigualdade |  |
| Política da empresa estatal `politica-estatal` | Como a empresa do Estado fixa preço e lucro. | 3 opções |  |  | sem ligação · nome parecido: Abertura de empresa |
| Prazo de pagamento `prazo-pagamento` | Quando o Estado paga a indenização. | 3 opções |  |  | sem ligação |
| Preço máximo ao governo `preco-maximo-ao-governo` | Quanto o fornecedor pode cobrar do governo acima do menor preço que dá a outro cliente, de livre a zero. | régua |  | Corrupção | país não declara |
| Preferência a empresas nacionais `preferencia-a-empresas-nacionais` | Vai de nenhuma até forte, nas compras do governo e das estatais. | 4 opções |  | Industrialização |  |
| Regra depois da venda `regra-pos-venda` | O que vale para a empresa vendida. | 3 opções |  |  | sem ligação |
| Validade das regras `validade-das-regras` | Toda regra do governo sobre empresas ganha data de validade: se ninguém revisar e renovar, ela caduca sozinha. Régua: de nunca caduca até caduca em 2 anos. | régua |  | Corrupção, Produtividade | país não declara |

## energia

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Abertura à geração privada `abertura-a-geracao-privada` | Quanto as companhias podem construir e vender energia nova: de fechada até leilões e contratos longos. | 3 opções |  | Energia gerada, Preço da energia | nome parecido: Incentivo à geração limpa privada |
| Concessão da rede de transmissão `concessao-da-rede-de-transmissao` | Quem opera as grandes linhas de energia entre os estados: de só o Estado até concessão total a companhias. | 3 opções |  | Preço da energia | nome parecido: Investimento na rede de transmissão |
| Eletrificação rural `eletrificacao-rural` | Dinheiro para levar luz a quem ainda não tem, sobretudo no campo. | régua | gasta | Acesso à energia |  |
| Enriquecimento de urânio `enriquecimento-de-uranio` | Escada: nenhum, combustível de usina, pesquisa e medicina, nível de bomba. | 4 opções |  | Reputação internacional, Tensão internacional |  |
| Incentivo à geração limpa privada `incentivo-a-geracao-limpa-privada` | Subsídio para companhias construírem usinas solares e eólicas. | régua | gasta | Matriz limpa | nome parecido: Abertura à geração privada |
| Investimento em energia eólica `energia-eolica` | Dinheiro do governo para torres de vento. Cada 1% do PIB por ano compra energia para cerca de 4,5% da demanda do país, pronta em 1,5 ano. Parecida com a solar, em outro ritmo. | régua | gasta | Meio ambiente | nome parecido: Investimento em energia solar |
| Investimento em energia solar `energia-solar` | Dinheiro do governo para usinas solares. Cada 1% do PIB por ano compra energia para cerca de 5% da demanda do país, pronta em 1 ano. Cada vez mais barata, mas varia com o dia. | régua | gasta | Meio ambiente, Reputação internacional | nome parecido: Investimento em energia eólica · mesmo efeito: Investimento em térmicas fósseis |
| Investimento em hidrelétricas `energia-hidreletrica` | Dinheiro do governo para represas e usinas de água. Cada 1% do PIB por ano compra energia para cerca de 3% da demanda do país, pronta em 4 anos. Obra cara e demorada, energia barata depois. | régua | gasta | Meio ambiente |  |
| Investimento em térmicas fósseis `energia-termica` | Dinheiro do governo para usinas que queimam combustível. Cada 1% do PIB por ano compra energia para cerca de 6% da demanda do país, pronta em 1 ano. Obra rápida e barata, mas polui. | régua | gasta | Meio ambiente, Reputação internacional | mesmo efeito: Investimento em energia solar |
| Investimento em usinas nucleares `energia-nuclear` | Dinheiro do governo para usinas nucleares. Cada 1% do PIB por ano compra energia para cerca de 2% da demanda do país, pronta em 6 anos. Muita energia constante, obra muito cara e muito demorada. | régua | gasta | Meio ambiente |  |
| Investimento na rede de transmissão `investimento-na-rede-de-transmissao` | Dinheiro do Estado para construir linhas entre os estados, em % do PIB. | régua | gasta |  | só grupos · nome parecido: Concessão da rede de transmissão |
| Padrões de eficiência energética `padroes-de-eficiencia-energetica` | Quanto aparelhos, prédios e fábricas precisam economizar energia: de nenhum até aparelhos, prédios e indústria. | 5 opções |  | Energia gasta, Produtividade |  |
| Reserva de capacidade `reserva-de-capacidade` | Quanto de usina fica de prontidão para quando faltar sol, vento ou chuva: de nenhuma até reserva obrigatória. | régua |  | Preço da energia |  |
| Segurar a conta de luz `segurar-a-conta-de-luz` | Quanto da alta de custo da energia o governo não deixa chegar à conta. | régua |  | Aprovação, Preço da energia | país não declara |

## estado-e-eleicoes

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Cargos de livre nomeação `cargos-de-livre-nomeacao` | Quantos cargos o presidente nomeia sem concurso, por mil servidores, de 1 a 50. | régua |  | Corrupção, Folha do funcionalismo, Aprovação |  |
| Cláusula de barreira `clausula-de-barreira` | Voto mínimo que o partido precisa no país para ter cadeira, de 0% a 5%. | régua |  | Participação eleitoral, Polarização | mesmo efeito: Sistema eleitoral |
| Declaração de bens `declaracao-de-bens` | Quanto o candidato precisa mostrar do que tem e do que deve. Escada: não precisa; só os bens, uma vez, na candidatura; bens e dívidas todo ano; bens e dívidas do candidato e da família, conferidos pela Receita. | 7 opções |  | Corrupção | 7 opções |
| Doação de empresas `doacao-de-empresas` | Quanto do dinheiro das campanhas pode vir de empresas. Régua: de 0% a 100% do gasto da campanha. | régua |  | Corrupção | país não declara |
| Duração do mandato `duracao-mandato` | Quantos anos o governo fica até a próxima eleição. | 2 opções |  |  | sem ligação · 2 opções |
| Foro privilegiado `foro-especial` | Quais políticos só podem ser julgados por tribunal superior. Escada: ninguém, políticos são julgados como qualquer cidadão; só por crimes cometidos no exercício do cargo; todos os crimes de ministros e parlamentares; todos os crimes, e vale até depois que deixam o cargo. | 6 opções |  | Confiança na Justiça, Corrupção |  |
| Fundo Eleitoral `fundo-publico-de-campanha` | O Estado paga as campanhas. | régua | gasta | Corrupção | nome parecido: Horário eleitoral gratuito; Sistema eleitoral |
| Horário eleitoral gratuito `horario-eleitoral-gratuito` | Horas por dia de TV e rádio, de graça, para os partidos na campanha. De nenhuma (só quem paga aparece) até muitas, divididas entre os partidos. | régua |  |  | sem ligação · nome parecido: Fundo Eleitoral; Sistema eleitoral |
| Idade para votar `idade-para-votar` | A partir de que idade se pode votar: 16, 17 ou 18. | régua |  | Participação eleitoral |  |
| Independência dos investigadores `independencia-dos-investigadores` | Quem escolhe o chefe dos investigadores e procuradores: o governo livre, de uma lista do órgão, ou chefe com mandato fixo. | 3 opções |  | Corrupção |  |
| Indicação de juízes `indicacao-de-juizes` | Escada: o Congresso aprova, o presidente indica livre, ou o presidente aumenta a corte. | 3 opções |  | Confiança na democracia, Independência da Justiça |  |
| Iniciativa popular `iniciativa-popular` | Quanto poder o povo tem para propor e decidir leis. Escada: nenhum, só os políticos propõem; o povo propõe lei com assinaturas e o Congresso decide; lei com muitas assinaturas vai a plebiscito; o povo também revoga leis por voto. | 5 opções |  | Polarização |  |
| Intervalo para voltar `intervalo-para-voltar` | Quantos mandatos o presidente espera fora antes de poder voltar: 0 é voltar em seguida. | régua |  | Confiança na democracia |  |
| Lei da Ficha Limpa `ficha-limpa` | Quais condenados ficam impedidos de ser candidatos. Escada: sem regra, qualquer um pode concorrer; só condenado em definitivo, sem mais recurso; também condenado em segunda instância, ainda com recurso; também réu em processo de corrupção aceito pela Justiça. | 7 opções |  | Confiança na democracia, Corrupção | 7 opções |
| Lei de Acesso à Informação `acesso-a-informacao` | Quanto o governo é obrigado a mostrar e responder. Escada: nada obrigatório; gastos publicados no site; qualquer pessoa pede dados e o governo responde em até 20 dias; todos os contratos no site em tempo real e punição para quem esconde. | 4 opções |  | Corrupção |  |
| Limite total de mandatos `limite-total-de-mandatos` | Quantos mandatos uma pessoa pode ter na vida: de 1 a 4, ou ilimitado. | régua |  | Confiança na democracia | país não declara · nome parecido: Mandatos seguidos |
| Mandatos seguidos `mandatos-seguidos` | Quantos mandatos seguidos o presidente pode cumprir antes de parar: de 1 a 4, ou ilimitado. | régua |  | Confiança na democracia | nome parecido: Limite total de mandatos |
| Medida provisória `poder-de-decreto` | Escada do que o presidente pode mudar sozinho: 1) sem decreto; 2) só verba e preço, com prazo; 3) tudo menos impostos, regras do poder e mandato, com prazo (como a medida provisória); 4) decreto amplo: tudo, sem o Congresso confirmar. Com prazo, a lei vale já e o Congresso tem 2 turnos para confirmar, ou cai. | 7 opções |  | Confiança na democracia | 7 opções |
| Pena para corrupção `pena-para-corrupcao` | Quanto custa ser pego roubando dinheiro público. Escada: devolve o dinheiro e paga multa; perde o cargo e não pode ser candidato; prisão em regime fechado; prisão e perda dos bens sem origem. | 4 opções |  | Confiança na democracia, Corrupção, Obras paradas, Polarização |  |
| Propaganda paga na campanha `propaganda-paga-na-campanha` | Se campanha pode comprar anúncio: de proibida até liberada. Quem tem mais dinheiro aparece mais. | 3 opções |  |  | sem ligação |
| Quórum das votações `quorum-das-votacoes` | Quantos votos o Congresso precisa em cada tipo de votação. Uma aba por tipo, cada uma com a sua escada. Constituição (regras do poder): maioria absoluta; 3/5; 2/3; 3/4. Derrubar veto: maioria simples; absoluta; 3/5; 2/3. Imposto e dívida: maioria simples; absoluta; 3/5. Por ora, uma régua só para todos os setores. | régua |  | Confiança do mercado, Confiança na democracia |  |
| Sigilo aberto para candidatos `sigilo-aberto-para-candidatos` | O que o candidato precisa abrir para concorrer. Escada: nada; lista de bens; sigilo fiscal (imposto de renda); sigilo fiscal e bancário. | 4 opções |  | Corrupção |  |
| Sistema eleitoral `sistema-eleitoral` | Como o voto vira cadeira no Congresso. Escada: proporcional (cadeiras na proporção dos votos); misto (metade proporcional, metade por distrito); distrital (cada distrito elege o mais votado). Vale na eleição seguinte. | 4 opções |  | Participação eleitoral, Polarização | nome parecido: Fundo Eleitoral; Horário eleitoral gratuito · mesmo efeito: Cláusula de barreira |
| Voto obrigatório `voto-obrigatorio` | Se todos precisam votar e o que acontece com quem falta. Escada: voto livre; obrigatório com multa pequena; obrigatório com multa maior; obrigatório, e quem não vota não tira passaporte nem presta concurso. | 5 opções |  | Participação eleitoral |  |

## imigracao

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Cidadania por nascimento `cidadania-por-nascimento` | Vai de só por sangue, passa por filhos de residentes, até todo nascido aqui. | 3 opções |  | Imigrantes na população, Integração |  |
| Cota de entrada `cota-de-entrada` | Quantos imigrantes entram por ano, em % da população: de fechada até aberta. | régua |  | Imigrantes na população, Tensão com imigrantes |  |
| Deportação `deportacao` | Vai de nenhuma até em massa. | 4 opções |  | Liberdades, Pessoas sem documento |  |
| Exigência de idioma e cultura `exigencia-de-idioma-e-cultura` | Vai de nenhuma até prova de idioma e de valores. | 3 opções |  |  | sem ligação |
| Integração dos imigrantes `integracao-dos-imigrantes` | Curso de idioma e orientação para quem chega. | régua | gasta | Integração |  |
| Multa a quem contrata sem documento `multa-a-quem-contrata-sem-documento` | Vai de nenhuma até multa pesada. | 3 opções |  | Pessoas sem documento |  |
| Prazo para naturalização `prazo-para-naturalizacao` | Anos de residência para virar cidadão: de 20 até 1. | régua |  |  | só grupos |
| Refúgio e asilo `refugio-e-asilo` | Vai de nenhum, passa por abrigo, até acolhimento pleno com direitos. | 3 opções |  | Refugiados no país, Reputação internacional | nome parecido: Trabalho de quem pede refúgio |
| Regularização `regularizacao` | Vai de nenhuma, passa por regularizar quem trabalha, até regularizar todos. | 3 opções |  | Emprego informal, Pessoas sem documento | país não declara |
| Seleção por qualificação `selecao-por-qualificacao` | Quem pode entrar: de qualquer um, passa por ter oferta de emprego, até sistema de pontos (qualificação, idade, idioma). | 3 opções |  | Imigrantes na população | país não declara |
| Serviços para imigrante sem documento `servicos-para-imigrante-sem-documento` | Escola e saúde: de nenhum acesso até acesso pleno. | 3 opções |  | Integração |  |
| Taxa de saída para formados `taxa-de-saida-para-formados` | O que quem estudou com dinheiro público precisa fazer antes de ir morar fora. Escada: sai livre; devolve parte do custo do estudo; devolve o custo todo; precisa ficar alguns anos no país antes de sair. | 4 opções |  | Emigração de formados, Liberdades | país não declara |
| Trabalho de quem pede refúgio `trabalho-de-quem-pede-refugio` | Espera até poder trabalhar: de proibido até imediato. | régua |  | Integração | nome parecido: Refúgio e asilo |
| Verba da fronteira `verba-da-fronteira` | Guardas, tecnologia e controle nos portos, aeroportos e fronteiras terrestres. | régua | gasta | Pessoas sem documento |  |

## impostos

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Desconto por filho `desconto-por-filho` | Quanto cada filho reduz o Imposto de renda. Régua: de 0% a 20% da renda por filho. | régua |  | Natalidade |  |
| Faixa sem Imposto de renda `faixa-sem-imposto-de-renda` | Até quanto se ganha sem pagar Imposto de renda, de 0 a 5 salários mínimos. | régua |  | Desigualdade, Pobreza | nome parecido: Imposto de renda |
| Fiscalização da Receita `fiscalizacao-da-receita` | Verba para auditores que cobram quem sonega. | régua | gasta | Sonegação |  |
| IBS e CBS `imposto-consumo` | Imposto embutido no preço de tudo o que se compra. | régua | arrecada | Padrão de vida, Pobreza |  |
| Imposto de renda `imposto-renda` | Quanto as pessoas pagam sobre o que ganham. | régua | arrecada | Padrão de vida | nome parecido: Faixa sem Imposto de renda |
| Imposto de saída `imposto-de-saida` | Quanto paga quem muda de país levando fortuna, sobre o que ganhou aqui, de 0% a 30%. | régua |  | Investimento estrangeiro, Saída de ricos | país não declara |
| Imposto sobre aplicações grandes: a partir de quanto cobra `imposto-sobre-aplicacoes-grandes-a-partir-de-quanto-cobra` | Imposto por ano sobre dinheiro aplicado e ações, só acima de um valor. Dois controles: a partir de quanto cobra (em salários mínimos) e quanto cobra, de 0% a 3% ao ano. | régua |  | Desigualdade, Índice da bolsa, Saída de ricos | país não declara · nome parecido: Imposto sobre aplicações grandes: quanto cobra; IPTU: a partir de quanto cobra; IPTU: quanto cobra · mesmo efeito: Imposto sobre aplicações grandes: quanto cobra |
| Imposto sobre aplicações grandes: quanto cobra `imposto-sobre-aplicacoes-grandes-quanto-cobra` | Imposto por ano sobre dinheiro aplicado e ações, só acima de um valor. Dois controles: a partir de quanto cobra (em salários mínimos) e quanto cobra, de 0% a 3% ao ano. | régua |  | Desigualdade, Índice da bolsa, Saída de ricos | país não declara · nome parecido: Imposto sobre aplicações grandes: a partir de quanto cobra; IPTU: a partir de quanto cobra; IPTU: quanto cobra · mesmo efeito: Imposto sobre aplicações grandes: a partir de quanto cobra |
| Imposto sobre bancos `imposto-sobre-bancos` | Imposto extra sobre o lucro dos bancos, de 0% a 30% acima do que as outras empresas pagam. | régua |  | Crédito ao setor privado |  |
| Imposto sobre bens de luxo `imposto-sobre-bens-de-luxo` | Imposto por ano sobre jato, iate, helicóptero e carro caro, de 0% a 5% do valor. | régua |  | Desigualdade, Sonegação | mesmo efeito: Progressividade |
| Imposto sobre dividendos `imposto-sobre-dividendos` | Cobrança sobre o lucro que a empresa paga ao dono. | régua |  | Índice da bolsa |  |
| Imposto sobre movimentação financeira `imposto-sobre-movimentacao-financeira` | Quanto se paga em cada transferência ou pagamento feito pelo banco, de 0% a 1%. | régua |  | Crédito ao setor privado, Sonegação | país não declara |
| Incentivo a setores `incentivo-a-setores` | Desconto de imposto para os setores que o jogador marca na lei. | régua |  | Industrialização | nome parecido: Incentivo ao investimento |
| Incentivo ao investimento `incentivo-ao-investimento` | Quanto do gasto da empresa em máquinas e prédios ela abate na hora do imposto. Régua: de 0% a 100% do gasto abatido no mesmo ano. | régua |  | Industrialização | nome parecido: Incentivo a setores |
| IPTU: a partir de quanto cobra `imposto-sobre-imovel-caro-a-partir-de-quanto-cobra` | Imposto por ano sobre o imóvel em que se mora ou que se aluga, só acima de um valor. Dois controles: a partir de quanto cobra (em salários mínimos) e quanto cobra, de 0% a 2% ao ano. | régua |  | Desigualdade, Preço da moradia, Saída de ricos | nome parecido: Imposto sobre aplicações grandes: a partir de quanto cobra; Imposto sobre aplicações grandes: quanto cobra; IPTU: quanto cobra · mesmo efeito: IPTU: quanto cobra |
| IPTU: quanto cobra `imposto-sobre-imovel-caro-quanto-cobra` | Imposto por ano sobre o imóvel em que se mora ou que se aluga, só acima de um valor. Dois controles: a partir de quanto cobra (em salários mínimos) e quanto cobra, de 0% a 2% ao ano. | régua |  | Desigualdade, Preço da moradia, Saída de ricos | nome parecido: Imposto sobre aplicações grandes: a partir de quanto cobra; Imposto sobre aplicações grandes: quanto cobra; IPTU: a partir de quanto cobra · mesmo efeito: IPTU: a partir de quanto cobra |
| IRPJ e CSLL `imposto-empresas` | Quanto as empresas pagam sobre o lucro. | régua | arrecada | Industrialização |  |
| Isenção para igrejas `isencao-para-igrejas` | Quanto das igrejas e entidades religiosas fica livre de imposto. Escada: nenhuma isenção; só o prédio do templo; templo e doações recebidas; templo, doações e negócios ligados à igreja. | 5 opções |  | Pobreza |  |
| ITCMD `imposto-sobre-heranca` | Cobrança sobre o que se herda. | régua |  | Desigualdade |  |
| Progressividade `progressividade` | Quanto a alíquota do Imposto de renda sobe para quem ganha mais. Escada: todos pagam a mesma alíquota (imposto único); sobe pouco; sobe médio; sobe muito. | 4 opções |  | Desigualdade, Sonegação | mesmo efeito: Imposto sobre bens de luxo |
| Sigilo bancário `sigilo-bancario` | O quanto o Estado pode ver das contas das pessoas. Escada: Estado vê todas as contas sem pedir; vê só movimentos de valor alto; só com ordem de juiz; só com ordem de juiz e em crime grave. | 4 opções |  | Liberdades, Sonegação |  |
| Teto da carga de impostos `teto-da-carga-de-impostos` | Quanto o país inteiro pode pagar de imposto, somando todos, em % do PIB: de sem teto até um teto apertado. Batido o teto, subir um imposto obriga a baixar outro. | régua | gasta | Confiança do mercado | país não declara |

## infraestrutura-e-transporte

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Caminhão parado aos domingos `caminhao-parado-aos-domingos` | Quando o caminhão não pode rodar: feriado religioso, domingo, fim de semana. | 3 opções |  | Custo do frete | país não declara |
| Carregadores nas estradas federais `carregadores-nas-estradas-federais` | Distância máxima entre carregadores: sem exigência, 400, 200, 100, 50 km. | 5 opções |  | Energia gasta | país não declara · nome parecido: Estradas com pedágio; Velocidade máxima nas estradas federais |
| Concorrência entre táxi e aplicativo `concorrencia-entre-taxi-e-aplicativo` | Até onde a cidade pode ir: pode proibir aplicativo, só pode limitar os carros, não pode limitar, e licença de táxi não se vende nem se herda. | 4 opções |  | Congestionamento |  |
| Desconto no carro de quem vive de dirigir `desconto-no-carro-de-quem-vive-de-dirigir` | Quem não paga imposto ao comprar o carro de trabalho: ninguém, taxista paga metade, taxista não paga, motorista de aplicativo paga metade, os dois não pagam. | 5 opções |  |  | sem ligação |
| Direitos de quem viaja `direitos-de-quem-viaja` | O que a empresa deve ao passageiro de voo ou ônibus entre estados: comida, hotel, dinheiro de volta ou outra viagem, indenização. | 5 opções |  |  | sem ligação |
| Divisão da verba de construção: delegacias `divisao-da-verba-de-construcao-delegacias` | Reparte 100% da verba entre hospitais, escolas, universidades, delegacias, presídios, estatais e transportes. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação |
| Divisão da verba de construção: escolas `divisao-da-verba-de-construcao-escolas` | Reparte 100% da verba entre hospitais, escolas, universidades, delegacias, presídios, estatais e transportes. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação |
| Divisão da verba de construção: estatais `divisao-da-verba-de-construcao-estatais` | Reparte 100% da verba entre hospitais, escolas, universidades, delegacias, presídios, estatais e transportes. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação |
| Divisão da verba de construção: hospitais `divisao-da-verba-de-construcao-hospitais` | Reparte 100% da verba entre hospitais, escolas, universidades, delegacias, presídios, estatais e transportes. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação |
| Divisão da verba de construção: presídios `divisao-da-verba-de-construcao-presidios` | Reparte 100% da verba entre hospitais, escolas, universidades, delegacias, presídios, estatais e transportes. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação |
| Divisão da verba de construção: transportes `divisao-da-verba-de-construcao-transportes` | Reparte 100% da verba entre hospitais, escolas, universidades, delegacias, presídios, estatais e transportes. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação · nome parecido: Verba de conservação dos transportes |
| Divisão da verba de construção: universidades `divisao-da-verba-de-construcao-universidades` | Reparte 100% da verba entre hospitais, escolas, universidades, delegacias, presídios, estatais e transportes. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação |
| Elétrico paga a estrada `eletrico-paga-a-estrada` | Taxa anual do carro elétrico, de 0 a 100% do que o carro a gasolina paga na bomba. | régua |  |  | só grupos · país não declara |
| Empreiteira condenada fora das obras `empreiteira-condenada-fora-das-obras` | Quem é condenado por corrupção deixa de contratar com o Estado. Escada: nada; só a condenada; também as do mesmo grupo; volta com acordo e multa. | 4 opções |  | Corrupção, Custo das obras, Obras paradas | nome parecido: Prioridade das obras · mesmo efeito: Lei de Licitações; Teto do aditivo |
| Estradas com pedágio `estradas-com-pedagio` | Quanto das estradas federais fica com empresas que consertam e cobram pedágio, de 0% a 100%. O jogo escolhe os trechos sozinho. | régua |  | Custo do frete, Mortes no trânsito | nome parecido: Carregadores nas estradas federais; Velocidade máxima nas estradas federais · mesmo efeito: Peso máximo do caminhão |
| Exigência técnica das construções `exigencia-tecnica-das-construcoes` | O que todo prédio tem que cumprir. Escada: mínima; padrão; rigorosa (incêndio, enchente, terremoto). | 5 opções |  | Custo das obras, Preço da moradia, Preparo contra desastres |  |
| Exigências para tirar carteira `exigencias-para-tirar-carteira` | O que se exige para dirigir: autoescola obrigatória com curso e 20 horas de aula; curso grátis na internet e 2 horas de aula com instrutor à escolha, mais a prova; aprender com alguém habilitado, com licença provisória, e fazer a prova; sem exame. | 4 opções |  | Mortes no trânsito |  |
| Fim dos carros a combustão `fim-dos-carros-a-combustao` | Até que ano ainda se pode vender carro a combustão. | régua |  | Emissões de carbono | país não declara · nome parecido: Subsídio a carros elétricos |
| Lei de Licitações `regra-da-licitacao` | Como o governo escolhe a empreiteira da obra. Escada: menor preço; preço e qualidade; obra pronta (a empreiteira projeta e faz); contratação direta em emergência. | 4 opções |  | Corrupção, Custo das obras, Obras paradas | mesmo efeito: Empreiteira condenada fora das obras; Teto do aditivo |
| Ônibus grátis `onibus-gratis` | Quem não paga ônibus: cada degrau engloba mais gente. | 7 opções |  |  | sem ligação · 7 opções |
| Peso da multa: base de cálculo `peso-da-multa-base-de-calculo` | Dois controles: quanto a multa pesa, de 1 a 5 vezes, e como se calcula: igual para todos, pelo preço do carro ou pelo salário. | 3 opções |  | Mortes no trânsito | nome parecido: Peso da multa: peso da multa |
| Peso da multa: peso da multa `peso-da-multa-peso-da-multa` | Dois controles: quanto a multa pesa, de 1 a 5 vezes, e como se calcula: igual para todos, pelo preço do carro ou pelo salário. | régua |  | Mortes no trânsito | nome parecido: Peso da multa: base de cálculo; Peso máximo do caminhão |
| Peso máximo do caminhão `peso-maximo-do-caminhao` | Quantas toneladas um caminhão pode levar, de 30 a 90. | régua |  | Custo do frete, Mortes no trânsito | nome parecido: Peso da multa: peso da multa · mesmo efeito: Estradas com pedágio |
| Piso do frete `piso-do-frete` | Quem contrata não pode pagar menos do que uma % do custo da viagem do caminhoneiro. | régua |  | Custo do frete, Preço da comida |  |
| Prioridade das obras `prioridade-das-obras` | De 0 a 100%, qual fila vem primeiro na construção civil: a pública ou a privada. | régua |  |  | só grupos · país não declara · nome parecido: Empreiteira condenada fora das obras |
| Quem pode vender recarga `quem-pode-vender-recarga` | Quem pode cobrar para carregar carro elétrico: só a distribuidora, postos, comércio, condomínios, qualquer casa. | 5 opções |  | Energia gasta |  |
| Regularização dos aplicativos `regularizacao-dos-aplicativos` | Regra geral para aplicativos de transporte: nada exigido, carteira e ficha criminal conferidas, seguro do passageiro, carro de até 10 anos, curso de direção. | 5 opções |  | Mortes no trânsito |  |
| Subsídio a carros elétricos `subsidio-a-carros-eletricos` | Quanto o Estado paga de desconto em cada carro elétrico. | régua |  | Energia gasta | país não declara · nome parecido: Fim dos carros a combustão |
| Teto do aditivo `teto-do-aditivo` | Quanto a obra pode encarecer depois de assinada, de 0 a 50% do preço. | régua |  | Corrupção, Custo das obras, Obras paradas | mesmo efeito: Empreiteira condenada fora das obras; Lei de Licitações |
| Transporte interno por empresa de fora `transporte-interno-por-empresa-de-fora` | Se navio e avião de fora podem levar carga e gente entre cidades do país. Uma aba para navio e outra para avião, cada uma com: só empresa do país; de fora quando falta; de fora com metade da tripulação daqui; livre. Por ora, uma régua só para todos os setores. | régua |  | Congestionamento, Custo do frete, Industrialização | país não declara |
| Velocidade máxima nas estradas federais `velocidade-maxima-nas-estradas-federais` | Quanto se pode correr nas estradas federais, de 80 km/h até sem limite. | régua |  | Mortes no trânsito | nome parecido: Carregadores nas estradas federais; Estradas com pedágio |
| Verba de conservação dos transportes `verba-de-conservacao-dos-transportes` | % do PIB para manter estradas, ferrovias, portos e aeroportos federais. | régua | gasta |  | só grupos · nome parecido: Divisão da verba de construção: transportes |
| Verba de construção `verba-de-construcao` | Quanto do PIB o Estado põe em obras novas. Mais verba sobe tudo. | régua | gasta |  | só grupos |
| Vistoria dos veículos `vistoria-dos-veiculos` | Quais veículos passam por vistoria: caminhão e ônibus, carro velho, moto velha, todo veículo todo ano. | 4 opções |  | Mortes no trânsito, Qualidade do ar |  |

## justica-e-prisoes

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Defensoria pública `defensoria-publica` | Advogado de graça para quem não pode pagar. | régua | gasta | Confiança na Justiça, Presos sem julgamento |  |
| Delação premiada `delacao-premiada` | Quanto de pena a menos ganha quem entrega a organização. Escada: não existe; redução pequena da pena; redução grande da pena e proteção ao delator; perdão total para quem entrega os chefes. | 4 opções |  | Certeza de punição |  |
| Educação na prisão `educacao-na-prisao` | Verba para aulas e cursos dentro dos presídios. | régua | gasta | Volta ao crime | nome parecido: Prisão antes do julgamento |
| Isolamento de chefes `isolamento-de-chefes` | Como os líderes de organizações criminosas ficam presos. Escada: sem tratamento especial; cela separada no mesmo presídio; presídio de segurança máxima só para chefes, visita atrás do vidro; segurança máxima com isolamento total e sem visitas. | 5 opções |  |  | sem ligação |
| Maioridade penal `maioridade-penal` | A idade a partir da qual um jovem responde como adulto na justiça criminal. | régua |  | Liberdades, Lotação dos presídios, Segurança pública |  |
| Parte da pena cumprida presa `parte-da-pena-cumprida-presa` | Quanto da pena o preso cumpre de fato antes de sair, de 15% a 100%. | régua |  | Crimes contra o patrimônio, Lotação dos presídios, Sensação de insegurança | nome parecido: Pena de morte; Remição de pena |
| Pena de morte `pena-de-morte` | Se o Estado pode executar condenados por crimes graves. | 2 opções |  | Liberdades, Segurança pública | 2 opções · país não declara · nome parecido: Parte da pena cumprida presa; Pena maior para quem repete o crime; Remição de pena |
| Pena maior para quem repete o crime `pena-maior-para-quem-repete-o-crime` | Quanto pesa cometer crime de novo. Escada: igual para todos; pena dobra na segunda vez; prisão perpétua no terceiro crime violento; prisão perpétua no terceiro crime de qualquer tipo. | 4 opções |  | Liberdades, Lotação dos presídios, Volta ao crime | nome parecido: Pena de morte; Remição de pena |
| Penas alternativas `penas-alternativas` | Quais crimes podem ter tornozeleira ou serviço comunitário no lugar da prisão. Escada: prisão para qualquer crime; serviço comunitário só para infrações mínimas; tornozeleira ou serviço também para crimes leves; tornozeleira ou serviço também para crimes médios sem violência. | 6 opções |  | Lotação dos presídios, Volta ao crime | nome parecido: Tamanho das penas · mesmo efeito: Remição de pena; Tribunal de drogas |
| Prazo para ver o juiz `prazo-para-ver-o-juiz` | Em quanto tempo o preso vê um juiz: de 24 horas a 30 dias, ou sem prazo. | régua |  | Presos sem julgamento |  |
| Presídio terceirizado `presidio-terceirizado` | Quanto do sistema de presídios é operado por empresas. Escada: todos os presídios públicos; empresas cuidam só de comida, limpeza e saúde; empresas operam alguns presídios inteiros; empresas operam a maioria dos presídios. | 5 opções |  | Lotação dos presídios |  |
| Prisão antes do julgamento `prisao-antes-do-julgamento` | Quem espera o julgamento preso. Escada: ninguém, só casos raros; só quem cometeu crime violento; também quem cometeu crime com pena alta; a maioria dos acusados de crime. | 5 opções |  | Lotação dos presídios, Presos sem julgamento | nome parecido: Educação na prisão |
| Remição de pena `remicao-de-pena` | Pena menor para quem faz algo de útil na prisão. Escada, cada degrau incluindo o anterior: nenhuma; quem trabalha; quem conclui curso; quem lê livros. | 4 opções |  | Lotação dos presídios, Volta ao crime | nome parecido: Parte da pena cumprida presa; Pena de morte; Pena maior para quem repete o crime · mesmo efeito: Penas alternativas; Tribunal de drogas |
| Separação de presos `separacao-de-presos` | Como os presos são separados na cadeia. Escada: todos juntos; separa quem cometeu crime violento; separa quem está preso pela primeira vez dos reincidentes; presídio próprio para quem está preso pela primeira vez, com estudo e trabalho. | 5 opções |  | Volta ao crime |  |
| Tamanho das penas `tamanho-das-penas` | O quanto as penas são duras. | régua |  | Lotação dos presídios, Peso das penas | nome parecido: Penas alternativas |
| Tribunal de drogas `tribunal-de-drogas` | Quem o juiz manda para tratamento em vez de prisão. Escada: ninguém, usuário vai preso; só quem nunca foi preso; todo usuário sem outro crime; todo usuário, sem ficha criminal. | 6 opções |  | Lotação dos presídios, Volta ao crime | país não declara · mesmo efeito: Penas alternativas; Remição de pena |
| Verba da Justiça `verba-da-justica` | Dinheiro para juízes, servidores e tribunais. | régua | gasta | Certeza de punição, Tempo da Justiça |  |
| Verba dos presídios `verba-dos-presidios` | Dinheiro para guardas e condições dos presídios. | régua | gasta | Volta ao crime |  |

## meio-ambiente

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Compromisso climático: corte `compromisso-climatico-corte` | O país promete cortar uma % das emissões até um ano escolhido. | régua |  | Reputação internacional | nome parecido: Compromisso climático: prazo |
| Compromisso climático: prazo `compromisso-climatico-prazo` | O país promete cortar uma % das emissões até um ano escolhido. | régua |  | Reputação internacional | nome parecido: Compromisso climático: corte |
| Direito de processar quem polui `direito-de-processar-quem-polui` | Até quanto o vizinho prejudicado pode cobrar na Justiça de quem poluiu. | régua |  | Qualidade do ar |  |
| Fiscalização do Ibama `policia-ambiental` | Dinheiro para fiscais que combatem desmatamento e poluição. | régua | gasta | Corrupção, Meio ambiente |  |
| Forças Armadas na floresta `forcas-armadas-na-floresta` | Papel dos militares contra o desmatamento: nenhum, apoio de transporte, patrulha junto com o órgão ou comando militar da região. | 4 opções |  | Desmatamento, Liberdades | nome parecido: Pagamento por floresta em pé |
| Imposto sobre poluição `imposto-poluicao` | Quem polui paga por tonelada emitida. | régua | arrecada | Industrialização, Meio ambiente | país não declara · nome parecido: Limite de poluição do ar · mesmo efeito: Terras indígenas |
| Independência do órgão ambiental `independencia-do-orgao-ambiental` | Quem manda no órgão que dá as licenças: o presidente, um chefe com mandato ou um órgão independente. | 3 opções |  | Corrupção | nome parecido: Licenciamento ambiental; Prazo para licença ambiental |
| Licenciamento ambiental `licenciamento-ambiental` | Como uma obra ou empresa prova que não vai destruir o ambiente antes de começar. | 3 opções |  | Corrupção, Industrialização, Meio ambiente | nome parecido: Independência do órgão ambiental; Prazo para licença ambiental |
| Limite de poluição do ar `limite-de-poluicao-do-ar` | Por setor, quanto cada companhia pode soltar de poluição no ar. Por ora, uma régua só para todos os setores. | régua |  | Qualidade do ar | nome parecido: Imposto sobre poluição |
| Mercado de carbono: cotas de graça `mercado-de-carbono-cotas-de-graca` | Dois controles: o teto de quanto o país pode emitir e quanto as companhias recebem de graça. | régua |  | Emissões de carbono | país não declara · nome parecido: Mercado de carbono: teto de emissões |
| Mercado de carbono: teto de emissões `mercado-de-carbono-teto-de-emissoes` | Dois controles: o teto de quanto o país pode emitir e quanto as companhias recebem de graça. | régua |  | Emissões de carbono | país não declara · nome parecido: Mercado de carbono: cotas de graça |
| O que acontece com quem é pego `o-que-acontece-com-quem-e-pego` | Punição de quem desmata ou polui fora da lei: multa, embargo da área, corte de crédito público ou perda da terra. | 4 opções |  | Desmatamento |  |
| Pagamento por floresta em pé `pagamento-por-floresta-em-pe` | Quanto o Estado paga por hectare de mata que o dono mantém de pé. | régua |  | Desmatamento | nome parecido: Forças Armadas na floresta |
| Prazo para licença ambiental `prazo-para-licenca-ambiental` | Em quantos meses o órgão precisa responder. Passou do prazo, a licença está aprovada. | régua |  | Desmatamento | nome parecido: Independência do órgão ambiental; Licenciamento ambiental |
| Quem paga pelo descarte `quem-paga-pelo-descarte` | Quem arca com plástico e lixo: a prefeitura, o fabricante por taxa, o fabricante recolhendo ou a proibição de descartáveis. | 4 opções |  | Meio ambiente |  |
| Terras indígenas `terras-indigenas` | Parte do território reconhecida como terra dos povos indígenas. | régua |  | Industrialização, Meio ambiente | mesmo efeito: Imposto sobre poluição |
| Unidades de conservação `areas-protegidas` | Parte do território guardada como parque ou reserva. | régua |  | Industrialização, Meio ambiente, Padrão de vida, Preço da moradia |  |

## mineracao-e-petroleo

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Áreas abertas à mineração `areas-abertas-a-mineracao` | Onde mina nova pode abrir. Escada: nenhuma área nova; só onde já tem mina; terras do governo; todo o país, fora das áreas protegidas. | 5 opções |  |  | sem ligação · nome parecido: Áreas abertas ao petróleo e gás |
| Áreas abertas ao petróleo e gás `areas-abertas-ao-petroleo-e-gas` | Escada do que se pode explorar: nenhuma área nova, terra, mar raso, águas profundas. | 4 opções |  | Meio ambiente | nome parecido: Áreas abertas à mineração; Parte do Estado no petróleo; Royalties do petróleo |
| De onde veio o ouro `de-onde-veio-o-ouro` | O que quem vende ouro precisa provar. Escada: nada; o vendedor declara; nota com a origem; rastreio do garimpo à loja. | 4 opções |  | Corrupção |  |
| Destino dos royalties `destino-dos-royalties` | Para onde vai o dinheiro dos royalties. Uma aba por área: educação, saúde, Fundo soberano, estados produtores, cidades da mina e caixa geral. Por ora, uma régua só para todos os setores. | régua |  |  | só grupos · nome parecido: Royalties do petróleo |
| Exploração em floresta e áreas protegidas `exploracao-em-floresta-e-areas-protegidas` | Se pode explorar petróleo, gás e minério em floresta e área protegida: proibida, com exceções ou permitida. | 3 opções |  | Meio ambiente, Reputação internacional |  |
| Garantia contra acidentes `garantia-contra-acidentes` | Quanto a companhia deposita antes de explorar, para pagar vazamentos e acidentes. Vale também para rompimento de barragem de minério. | régua |  | Concentração de mercado, Meio ambiente |  |
| Garimpo `garimpo` | O que o garimpeiro pode fazer. Escada: proibido; só cooperativa registrada; livre com taxa e seguro de saúde; livre sem controle. | 4 opções |  | Emprego informal |  |
| Imposto sobre combustíveis `imposto-sobre-combustiveis` | Imposto cobrado na bomba de combustível. | régua |  | Meio ambiente | nome parecido: Subsídio a combustíveis |
| Imposto sobre o minério `imposto-sobre-o-minerio` | Imposto sobre o minério extraído, de 0 a 15% do valor. | régua |  |  | só grupos |
| O que a mina deixa quando fecha `o-que-a-mina-deixa-quando-fecha` | O que a mineradora precisa fazer ao fechar, cada degrau incluindo o anterior: nada; tapar e cercar; recuperar terra e rio; dinheiro para a cidade recomeçar. | 4 opções |  |  | sem ligação |
| Parte do dono da terra `parte-do-dono-da-terra` | Quanto do imposto da mina vai para o dono da terra onde ela fica, de 0 a 50%. | régua |  |  | só grupos |
| Parte do Estado no petróleo `parte-do-estado-no-petroleo` | Quanto do que é extraído fica com o Estado, de 0% a 80%. | régua |  |  | só grupos · nome parecido: Áreas abertas ao petróleo e gás; Royalties do petróleo |
| Prazo para acabar com barragem velha `prazo-para-acabar-com-barragem-velha` | Em quanto tempo as barragens antigas precisam acabar. Sem prazo; 10, 5 ou 3 anos. | 4 opções |  |  | sem ligação |
| Royalties do petróleo `royalties-do-petroleo` | Imposto sobre o petróleo e o gás extraídos. | régua |  |  | só grupos · nome parecido: Áreas abertas ao petróleo e gás; Destino dos royalties; Parte do Estado no petróleo |
| Subsídio a combustíveis `subsidio-a-combustiveis` | Quanto o Estado paga para o combustível sair mais barato na bomba. | régua | gasta | Meio ambiente | país não declara · nome parecido: Imposto sobre combustíveis |

## moeda-e-bancos

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Autonomia do Banco Central `autonomia-do-banco-central` | Quem manda no Banco Central: de o governo manda, passa por mandato com indicação do presidente, até mandato fixo independente. | 3 opções |  | Confiança do mercado |  |
| Congelamento de preços `congelamento-de-precos` | Vai de nenhum, passa por essenciais, até geral. | 3 opções |  | Emprego informal | país não declara |
| Controle de capital `controle-de-capital` | Vai de livre, passa por taxa sobre entrada especulativa, até controle de saída. | 3 opções |  | Confiança do mercado | país não declara · nome parecido: Exigência de capital dos bancos |
| Criptomoedas `criptomoedas` | Vai de proibidas, passa por reguladas, até livres. | 3 opções |  | Dinheiro em cripto |  |
| Exigência de capital dos bancos `exigencia-de-capital-dos-bancos` | Quanto dinheiro próprio o banco precisa ter, de baixo a alto. | régua |  | Crédito ao setor privado, Solidez dos bancos | nome parecido: Controle de capital |
| Faixa do câmbio: largura da faixa `faixa-do-cambio-largura-da-faixa` | Dois controles: o preço-alvo da moeda de fora (de −20% a +40% sobre o preço de início) e a largura da faixa em volta dele (de 0%, travado, até 30%, quase solto). | régua |  | Câmbio, Dívida em moeda estrangeira, Reservas internacionais | país não declara · nome parecido: Faixa do câmbio: preço-alvo · mesmo efeito: Faixa do câmbio: preço-alvo |
| Faixa do câmbio: preço-alvo `faixa-do-cambio-preco-alvo` | Dois controles: o preço-alvo da moeda de fora (de −20% a +40% sobre o preço de início) e a largura da faixa em volta dele (de 0%, travado, até 30%, quase solto). | régua |  | Câmbio, Dívida em moeda estrangeira, Reservas internacionais | país não declara · nome parecido: Faixa do câmbio: largura da faixa · mesmo efeito: Faixa do câmbio: largura da faixa |
| FGC `seguro-deposito` | Vai de nenhum, passa por até um limite, até total. | 3 opções |  |  | sem ligação |
| Licença para banco novo `licenca-para-banco-novo` | Quem pode abrir banco e em quanto tempo. Escada: nenhum banco novo; análise de anos; bancos digitais e cooperativas com análise curta; licença em meses para qualquer tipo. | 4 opções |  | Concentração de mercado, Crédito ao setor privado, Solidez dos bancos |  |
| Meta de inflação `meta-de-inflacao` | A inflação que o Banco Central persegue, de 0 a 10% ao ano. | régua |  | Expectativa de inflação |  |
| Moeda de fora nos contratos `moeda-de-fora-nos-contratos` | Se a moeda de outro país pode ser usada aqui. Escada: proibida; em contratos grandes e aluguel; circula junto com a nossa; substitui a nossa. | 4 opções |  | Confiança do mercado, Reservas internacionais, Soberania |  |
| Proteção ao cliente de banco `protecao-ao-cliente-de-banco` | O que o banco deve ao cliente. Escada: nada; custo total claro no contrato; 7 dias para desistir e fim da tarifa escondida; órgão que recebe reclamação e manda devolver. | 4 opções |  | Crédito ao setor privado, Pobreza |  |
| Selic `taxa-basica-de-juros` | Os juros básicos da economia. Você manda só se o Banco Central não for independente; se for, a régua só mostra a decisão dele. | régua |  | Crédito ao setor privado |  |
| Teto de juros `teto-de-juros` | Juro máximo que o banco pode cobrar. Uma aba por tipo de crédito (cartão, cheque especial, empréstimo pessoal, consignado), cada uma de sem teto até teto baixo, e uma aba "Todos". Por ora, uma régua só para todos os setores. | régua |  | Crédito ao setor privado, Emprego informal | país não declara |

## moradia

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Aluguel por temporada livre `aluguel-por-temporada-livre` | Quantos dias por ano uma casa pode ser alugada por dia, por aplicativo. Régua: de 0 a 365 dias por ano. | régua |  | Preço da moradia | nome parecido: Aluguel social; Teto de aluguel |
| Aluguel social `aluguel-social` | O Estado paga parte do aluguel das famílias pobres. | régua | gasta | Favela, Moradores de rua | nome parecido: Aluguel por temporada livre; Teto de aluguel |
| Cooperativas habitacionais `cooperativas-habitacionais` | Apoio a grupos de famílias que constroem juntas. | régua | gasta | Déficit habitacional |  |
| Crédito da casa perdoado por filho `credito-da-casa-perdoado-por-filho` | Quanto o casal jovem pode pegar emprestado para a casa, de 0 a 40 salários mínimos. A cada filho, um terço da dívida é perdoado. | régua |  | Déficit habitacional, Natalidade | país não declara |
| Crédito imobiliário `credito-imobiliario` | Dinheiro do governo para baixar os juros de quem financia a casa própria. | régua | gasta | Déficit habitacional, Preço da moradia | mesmo efeito: Liberação para construir; Teto de aluguel |
| Despejo rápido `despejo-rapido` | Em quanto tempo o dono pode tirar quem não paga o aluguel. | 4 opções |  | Favela, Preço da moradia |  |
| Indenização da família removida por obra `indenizacao-da-familia-removida-por-obra` | O que recebe quem precisa sair por causa de uma obra: só quem tem escritura recebe; o valor da casa mesmo sem escritura; também o aluguel até a nova casa; casa nova antes de sair. | 4 opções |  | Custo das obras |  |
| Liberação para construir `liberacao-para-construir` | Até onde a cidade pode limitar andares e casas por terreno. Escada: a cidade decide tudo; regra federal perto de transporte; a cidade não pode barrar prédio onde há água e esgoto; vale a regra federal em todo o país. | 4 opções |  | Déficit habitacional, Preço da moradia | mesmo efeito: Crédito imobiliário; Teto de aluguel |
| Limite a compradores estrangeiros `limite-a-compradores-estrangeiros` | Se quem é de fora pode comprar casa no país. Escada: livre; imposto extra na compra; no máximo uma casa por pessoa e nada de terra rural; proibido comprar. | 4 opções |  | Confiança do mercado, Preço da moradia | país não declara |
| Minha Casa, Minha Vida `verba-habitacao` | Dinheiro do governo para construir casas e entregar a quem não tem. | régua | gasta | Déficit habitacional, Favela |  |
| Remoção de área de risco `remocao-area-risco` | De onde o governo pode tirar quem mora em casa precária. | 4 opções |  | Déficit habitacional, Favela, Liberdades | país não declara |
| Teto de aluguel `teto-aluguel` | Quanto o aluguel pode subir por ano, além da inflação. | 4 opções |  | Déficit habitacional, Preço da moradia | país não declara · nome parecido: Aluguel por temporada livre; Aluguel social · mesmo efeito: Crédito imobiliário; Liberação para construir |
| Título de posse `titulo-posse` | Em quantos anos quem ocupa e usa uma terra ou casa sem dono vira dono dela. | 4 opções |  | Concentração de terra, Favela |  |
| Urbanização de favelas `urbanizacao-de-favelas` | Verba para levar água, esgoto, rua e luz à favela. | régua | gasta | Saneamento, Saúde |  |
| Venda de casas públicas `venda-de-casas-publicas` | Se o morador pode comprar a casa do Estado e com que desconto. Escada: nenhuma venda; venda ao morador com pequeno desconto; venda ao morador com grande desconto; venda ao morador com grande desconto e das casas vazias a qualquer comprador. | 4 opções |  | Déficit habitacional |  |

## orcamento-e-divida

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Arcabouço fiscal `teto-de-gasto` | O gasto só pode crescer até X% por ano (de livre até congelado). Aparece como um velocímetro com limite. | régua |  | Credibilidade fiscal | nome parecido: Conselho fiscal independente; Meta fiscal |
| Conselho fiscal independente `conselho-fiscal-independente` | Vai de nenhum, passa por consultivo, até com poder de veto. Dá confiança às projeções e dificulta a contabilidade criativa. | 3 opções |  | Credibilidade fiscal | nome parecido: Arcabouço fiscal; Meta fiscal |
| Déficit `deficit` | De onde sai o dinheiro quando o governo gasta mais do que arrecada. | 3 opções |  |  | sem ligação |
| Dívida em moeda estrangeira `divida-em-moeda-estrangeira` | Quanto da dívida é em moeda de fora (0 a 100%). Aparece como a parte de outra cor na caixa d'água. | régua |  |  | sem ligação · nome parecido: Limite da dívida; Prazo da dívida; Renegociação da dívida |
| Emendas dos parlamentares `emendas-dos-parlamentares` | Vai de nenhuma, passa por emendas transparentes, até emendas obrigatórias e secretas. | 3 opções |  |  | sem ligação |
| Estabilidade do servidor `estabilidade-do-servidor` | Quando o funcionário público pode ser mandado embora. Escada: emprego para a vida toda; sai por falta grave; avaliação todo ano, duas notas ruins e sai; contrato igual ao do trabalhador comum (fora juiz, policial, diplomata e auditor). | 7 opções |  | Atendimento, Corrupção, Folha do funcionalismo | 7 opções |
| Fundo soberano `fundo-soberano` | Guarda parte do superávit para crises ou para as próximas gerações: de nenhum até fundo geracional. Aparece como uma barra de reserva. | 3 opções |  | Credibilidade fiscal | país não declara |
| Gasto mínimo obrigatório `gasto-minimo-obrigatorio` | Você marca a área (saúde, educação, outras) e fixa um piso em % da receita. Aparece como envelopes com cadeado. | 3 opções |  | Gasto obrigatório |  |
| Limite da dívida `limite-da-divida` | A dívida nunca passa de X% do PIB (de sem limite até 40%). Aparece como uma caixa d'água com linha máxima. | régua |  | Credibilidade fiscal | país não declara · nome parecido: Dívida em moeda estrangeira; Prazo da dívida; Renegociação da dívida |
| Limite da folha do funcionalismo `limite-da-folha-do-funcionalismo` | Teto do que o Estado gasta com salários, em % da receita. | régua |  | Folha do funcionalismo |  |
| Meta fiscal `meta-de-resultado` | O governo promete fechar o ano com sobra de X% do PIB (de déficit permitido até superávit exigido). Aparece como um cofrinho com linha-alvo. | régua |  | Credibilidade fiscal | nome parecido: Arcabouço fiscal; Conselho fiscal independente |
| Prazo da dívida `prazo-da-divida` | Vai de curto (mais barato, arriscado) até longo (mais caro, seguro). Aparece como uma escada de vencimentos. | régua |  | Prazo médio da dívida | nome parecido: Dívida em moeda estrangeira; Limite da dívida; Renegociação da dívida |
| Punição se descumprir `punicao-se-descumprir` | O que acontece quando uma regra é quebrada: nenhuma, corte automático, proibir aumento de salário e contratação, ou crime de responsabilidade. Aparece como luzes de painel (amarelo e vermelho). | 4 opções |  | Credibilidade fiscal |  |
| Renegociação da dívida `renegociacao-da-divida` | Vai de pagar tudo, passa por renegociar prazo e juros, até calote parcial e total. | 4 opções |  | Credibilidade fiscal, Reputação internacional | país não declara · nome parecido: Dívida em moeda estrangeira; Limite da dívida; Prazo da dívida |
| Reposição de servidores `reposicao-de-servidores` | Para cada servidor que se aposenta ou sai, quantos entram no lugar, de 0 a 1,5. Marca em 1 = repõe todos. | régua |  | Atendimento, Folha do funcionalismo, Qualidade do ensino |  |
| Revisão periódica de gastos `revisao-periodica-de-gastos` | Vai de nenhuma, passa por revisar as maiores áreas a cada 4 anos, até base zero. Aparece como um pente fino: lista de programas em verde, amarelo e vermelho, com quanto vai liberar antes de aplicar. | 3 opções |  | Corrupção, Greves | país não declara |
| Superávit `superavit` | Para onde vai o dinheiro quando o governo arrecada mais do que gasta. | 3 opções |  |  | sem ligação |
| Venda de imóveis parados `venda-de-imoveis-parados` | Quanto dos prédios e terrenos sem uso do governo é vendido por ano, de 0% a 30%. Quando acabam, a régua para de render. | régua |  |  | só grupos |

## previdencia

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Aposentadoria dos servidores `aposentadoria-dos-servidores` | Como se aposenta quem trabalha para o Estado. Escada: salário integral; o aposentado também contribui; mesmo teto do trabalhador comum. | 3 opções |  | Déficit da previdência, Gasto obrigatório, Greves | nome parecido: Aposentadoria especial; Aposentadoria flexível; Idade mínima de aposentadoria |
| Aposentadoria especial `aposentadoria-especial` | Quem pode se aposentar antes por ter trabalho pesado. Escada: ninguém, todos seguem a mesma regra; só quem trabalha com risco de vida, como mineiro; também quem faz trabalho pesado ou insalubre; também professores e trabalhadores rurais. | 7 opções |  | Déficit da previdência | 7 opções · nome parecido: Aposentadoria dos servidores; Aposentadoria flexível; Idade mínima de aposentadoria |
| Aposentadoria flexível `aposentadoria-flexivel` | Se a pessoa escolhe quando se aposentar e como o valor muda. Escada: uma idade única para todos; duas idades possíveis, com valor menor na mais cedo; qualquer idade dentro de uma faixa, com valor que cresce a cada ano adiado; qualquer idade a partir de um mínimo baixo, com valor pelo que cada um contribuiu. | 7 opções |  | Liberdades | 7 opções · nome parecido: Aposentadoria dos servidores; Aposentadoria especial; Idade mínima de aposentadoria |
| BPC do idoso `pensao-para-idosos-pobres` | Pagamento a idosos pobres que nunca contribuíram. | régua | gasta | Cobertura da previdência, Pobreza | mesmo efeito: Tempo mínimo de contribuição |
| Contas individuais `contas-individuais` | Quanto da contribuição de aposentadoria vai para a conta de cada um, investida por fundos. Régua: de 0% a 50% da contribuição. | régua |  | Índice da bolsa | país não declara |
| Contribuição ao INSS `contribuicao-previdenciaria` | Quanto do salário vai para a previdência. | régua |  | Déficit da previdência, Emprego informal | nome parecido: Tempo mínimo de contribuição |
| Idade mínima de aposentadoria `idade-minima-de-aposentadoria` | Idade a partir da qual se pode aposentar. | régua |  | Déficit da previdência | nome parecido: Aposentadoria dos servidores; Aposentadoria especial; Aposentadoria flexível |
| Pensão por morte `pensao-por-morte` | Quanto a família recebe da aposentadoria de quem morreu. Escada: valor inteiro e para a vida toda; valor inteiro, por tempo que depende da idade de quem fica; 60% do valor, por tempo limitado; só para filhos menores e dependentes. | 6 opções |  | Pobreza |  |
| Previdência privada com dedução `previdencia-privada-com-deducao` | Quanto do salário guardado em plano de previdência privada pode ser descontado do imposto. Régua: de 0% a 20% da renda. | régua |  | Desigualdade, Índice da bolsa |  |
| Regime dos militares `regime-dos-militares` | Como os militares se aposentam em comparação com os demais trabalhadores. Escada: mesmas regras de todo mundo; idade mínima menor que a dos civis; idade menor e salário cheio na aposentadoria; idade menor, salário cheio e pensão vitalícia para a família. | 5 opções |  | Déficit da previdência |  |
| Tempo mínimo de contribuição `tempo-minimo-de-contribuicao` | Quantos anos de contribuição são exigidos. | régua |  | Cobertura da previdência, Pobreza | nome parecido: Contribuição ao INSS · mesmo efeito: BPC do idoso |
| Verba das aposentadorias `verba-das-aposentadorias` | Quanto do dinheiro do país (% do PIB) vai para os aposentados. Cada um recebe a verba dividida pelo número de aposentados. | régua | gasta | Déficit da previdência, Pobreza |  |

## relacoes-exteriores

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Alcance das sanções `alcance-das-sancoes` | Até onde o presidente pode ir com sanções: só simbólicas, até setoriais, ou até embargo total. | 3 opções |  |  | sem ligação · país não declara |
| Aprovação de tratados `aprovacao-de-tratados` | Quem aprova os tratados com outros países: só o presidente, o Congresso, ou referendo. | 3 opções |  |  | sem ligação |
| Inspeções nucleares internacionais `inspecoes-nucleares-internacionais` | Deixar inspetores de fora olharem as instalações nucleares: de nenhuma até inspeção total. | 3 opções |  | Reputação internacional |  |
| Tribunal internacional `tribunal-internacional` | Aceitar que o país seja julgado por um tribunal de fora: de não aceitar até aceitar por completo. | 3 opções |  | Liberdades, Reputação internacional, Soberania |  |
| Verba da diplomacia `verba-da-diplomacia` | Dinheiro de embaixadas, negociadores e missões no exterior. | régua | gasta | Reputação internacional |  |

## saneamento

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Concessão da rede `concessao-rede` | Quantas cidades têm a rede de água e esgoto entregue a empresas, que fazem as obras e cobram tarifa. | 4 opções |  | Padrão de vida, Saneamento | mesmo efeito: Teto da tarifa de água |
| Teto da tarifa de água `teto-tarifa` | Quanto a conta de água e esgoto pode subir por ano, além da inflação. | 4 opções |  | Padrão de vida, Saneamento | país não declara · mesmo efeito: Concessão da rede |
| Tratamento de esgoto `tratamento-esgoto` | Quanto do esgoto coletado precisa ser tratado antes de voltar ao rio. | 4 opções |  | Meio ambiente, Saneamento |  |
| Verba de saneamento `saneamento-basico` | Dinheiro do governo para levar água tratada e esgoto às famílias. | régua | gasta | Saneamento |  |

## saude

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Abertura de planos `abertura-planos` | Quanto o mercado de planos de saúde pode vender e crescer. Só compra quem tem renda. | 4 opções |  | Atendimento, Desigualdade, Profissionais de saúde | nome parecido: Limite aos planos · mesmo efeito: Dedução do plano |
| Ajuda para comprar plano `ajuda-para-comprar-plano` | Quanto da mensalidade do plano o governo paga para quem ganha pouco e não tem carteira assinada, de 0% a 100%. | régua |  | Atendimento | país não declara · nome parecido: Dedução do plano; Obrigação de ter plano |
| Aprovação de remédio feito fora `aprovacao-de-remedio-feito-fora` | Se o remédio aprovado lá fora pode ser vendido aqui. Escada: análise completa aqui; prazo máximo, passou e está aprovado; vale a aprovação de agência forte de fora; vale a de qualquer agência reconhecida, sem análise. | 6 opções |  | Acesso a remédios, Industrialização, Saúde | nome parecido: Imposto sobre remédio |
| Atenção preventiva `atencao-preventiva` | Dinheiro para agentes da comunidade e cuidado simples, perto de casa. Alcança quem está na fila sem hospital nem médico. | régua | gasta | Atendimento |  |
| Carreira exclusiva `carreira-exclusiva` | Quanto o profissional da rede pública fica só nela, com salário de carreira. Rende mais, a verba vai mais longe e o plano não o leva; mas custa salário, e parte larga a profissão por não poder ter consultório. | 4 opções |  | Atendimento, Profissionais de saúde | país não declara |
| Cobertura gratuita `cobertura-gratuita` | Até onde a rede pública atende sem cobrar. De graça, o pobre se trata cedo e a fila separa menos; mas todo mundo usa mais a rede, e parte de quem tem plano volta para ela. | 4 opções |  | Atendimento, Desigualdade, Saúde | nome parecido: Cobertura mínima do plano · mesmo efeito: Coparticipação |
| Cobertura mínima do plano `cobertura-minima-do-plano` | O que todo plano de saúde tem que cobrir. Escada: o plano vende o que quiser; tem que cobrir urgência; não pode recusar quem já tem doença; pacote completo (consulta, internação, parto e remédio). | 6 opções |  | Atendimento, Saúde | nome parecido: Cobertura gratuita; Dedução do plano; Obrigação de ter plano · mesmo efeito: Telemedicina livre |
| Conta de saúde `conta-saude` | Parte do salário vai para uma poupança que só paga saúde. Custa pouco ao governo; mas quem ganha pouco junta pouco e continua na fila, e a obrigação empurra gente para fora da carteira. | 4 opções |  | Atendimento, Desigualdade, Emprego informal | país não declara · nome parecido: Saúde ambiental; Saúde mental; Verba da saúde |
| Coparticipação `coparticipacao` | Quanto quem usa a rede pública paga por consulta. Corta o uso à toa e traz dinheiro para a rede; mas quem não tem bolso deixa de ir, e quem deixa de ir adoece. | 4 opções |  | Atendimento, Desigualdade, Saúde | país não declara · mesmo efeito: Cobertura gratuita |
| Dedução do plano `deducao-plano` | Quanto do plano de saúde se abate do imposto. Mais gente compra plano e sai da fila; o governo deixa de arrecadar, e quem ganha mais é quem mais usa. | 4 opções |  | Atendimento, Desigualdade, Profissionais de saúde | nome parecido: Ajuda para comprar plano; Cobertura mínima do plano; Obrigação de ter plano · mesmo efeito: Abertura de planos |
| Direito de recusar `direito-recusar` | Quem pode dizer não à vacina. Soma às liberdades; mas quem recusa fica sem proteção, e a saúde de todos sente. | 4 opções |  | Liberdades, Vacinação | país não declara · mesmo efeito: Programa Nacional de Imunizações |
| Farmácia Popular `remedio-pago-pelo-governo-na-farmacia` | A pessoa pega o remédio na farmácia comum e o governo paga. Escada: nada; desconto na lista básica; lista básica grátis; doença crônica grátis (pressão, diabetes, asma). | 6 opções |  | Acesso a remédios, Pobreza, Saúde |  |
| Filantrópicos `filantropicos` | Quanto o Estado apoia hospitais de entidades religiosas e beneficentes, com isenção de imposto. Abre vagas por pouco dinheiro; mas elas atendem onde estão, não onde falta. | 4 opções |  | Atendimento, Desigualdade | mesmo efeito: Limite aos planos |
| Gestão privada `gestao-privada` | Quanto da rede pública é tocada por empresas contratadas. O serviço anda e a verba rende mais; mas elas pagam mais e disputam os profissionais com o resto do país. | 4 opções |  | Atendimento |  |
| Imposto sobre remédio `imposto-sobre-remedio` | Quanto de imposto entra no preço do remédio, de 0 a 30%. | régua |  | Acesso a remédios | nome parecido: Aprovação de remédio feito fora; Onde se vende remédio |
| Limite aos planos `limite-planos` | Até onde o governo restringe os planos de saúde, de cobrir só o que a rede pública não faz até proibir. | 4 opções |  | Atendimento, Desigualdade | nome parecido: Abertura de planos · mesmo efeito: Filantrópicos |
| Mais Médicos `missoes-medicas` | Quantos profissionais o Estado manda atender em outros países. Traz dinheiro e reputação; mas quem vai não atende aqui, e com gente demais fora a fila cresce em casa. | 4 opções |  | Atendimento, Profissionais de saúde, Reputação internacional |  |
| Obrigação de ter plano `obrigacao-de-ter-plano` | Quem é obrigado a ter plano de saúde. Escada: ninguém; multa leve; multa pesada; desconto direto no salário. | 4 opções |  | Atendimento, Aprovação | país não declara · nome parecido: Ajuda para comprar plano; Cobertura mínima do plano; Dedução do plano |
| Onde se vende remédio `onde-se-vende-remedio` | Quem pode vender remédio. Escada: só farmácia; remédio sem receita também no mercado; venda pela internet; receita só para remédio controlado. | 4 opções |  | Acesso a remédios, Saúde | nome parecido: Imposto sobre remédio · mesmo efeito: Teto do preço dos remédios |
| Programa Nacional de Imunizações `programa-vacinacao` | Até onde o Estado leva a vacina e cobra quem não toma. Só alcança quem a rede atende; custa verba, e a obrigação pesa nas liberdades. | 4 opções |  | Liberdades, Vacinação | mesmo efeito: Direito de recusar |
| Saúde ambiental `saude-ambiental` | Até onde o Estado fiscaliza água, ar e lixo para evitar doença. Rende mais onde o ambiente está pior; mas custa verba e pesa nas fábricas. | 4 opções |  | Industrialização, Saúde | nome parecido: Conta de saúde; Saúde mental; Verba da saúde |
| Saúde mental `saude-mental` | O que a rede pública oferece para a mente. Escada: nada; consulta na rede; centro de atendimento perto de casa; internação e cuidado contínuo. | 4 opções |  | Moradores de rua, Produtividade, Saúde mental | nome parecido: Conta de saúde; Saúde ambiental; Verba da saúde |
| Seguro na folha `seguro-folha` | Parte do salário, paga por patrão e empregado, compra atendimento para quem tem emprego formal. Não sai do orçamento, mas encarece o emprego. | 4 opções |  | Atendimento, Desigualdade, Emprego informal, Profissionais de saúde | país não declara |
| Serviço obrigatório `servico-obrigatorio` | Quem se forma em saúde trabalha um tempo na rede pública antes de seguir carreira. | 5 opções |  | Atendimento, Liberdades, Profissionais de saúde, Saúde | país não declara |
| Telemedicina livre `telemedicina-livre` | Até onde o profissional da rede pública pode atender à distância. Atende mais gente, com menos cuidado. | 4 opções |  | Atendimento, Saúde | mesmo efeito: Cobertura mínima do plano |
| Teto do preço dos remédios `teto-do-preco-dos-remedios` | Quanto a farmácia pode subir o preço do remédio por ano. Régua: livre; inflação mais folga; só a inflação; abaixo da inflação. | régua |  | Acesso a remédios, Saúde | mesmo efeito: Onde se vende remédio |
| Troca pelo genérico `troca-pelo-generico` | Se o farmacêutico pode trocar o remédio de marca pela cópia barata. Escada: proibida; permitida; obrigatória se o médico não vetar. | 3 opções |  | Acesso a remédios, Investimento estrangeiro |  |
| Verba da saúde `gasto-saude` | Dinheiro do governo para hospitais, postos e remédios. | régua | gasta | Atendimento, Corrupção | nome parecido: Conta de saúde; Saúde ambiental; Saúde mental |

## seguranca-publica

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Ações nos bairros `acoes-nos-bairros` | Serviço e emprego onde o crime manda, e ajuda e proteção para quem quer sair das organizações. | régua | gasta | Homicídios, Pobreza |  |
| Alvos da agência `alvos-da-agencia` | Quem a agência pode vigiar: crime e terrorismo, organizações radicais, movimentos e imprensa, ou opositores do governo. | 4 opções |  | Liberdades, Polarização | nome parecido: Controle da agência; Poderes da agência |
| Bloqueio de bens `bloqueio-de-bens` | Quando os bens de um suspeito podem ser congelados. Escada: só depois da condenação; depois que a acusação é aceita; durante a investigação, com ordem do juiz; automático ao abrir a investigação. | 5 opções |  | Liberdades | nome parecido: Destino dos bens |
| Ciclo completo `ciclo-completo` | Até onde a mesma polícia patrulha e investiga. Escada: separado; só em flagrante; crimes leves; todos os crimes. | 4 opções |  | Crimes contra o patrimônio, Homicídios |  |
| Confisco alargado `confisco-alargado` | Que bens o Estado pode tomar de quem é ligado ao crime. Escada: só bens provados do crime após condenação; também bens ligados ao crime antes da condenação; também patrimônio que não bate com a renda de condenados; patrimônio que não bate com a renda de qualquer investigado, que precisa provar que é legal. | 5 opções |  |  | sem ligação |
| Controle da agência `controle-da-agencia` | Quem fiscaliza a agência: ninguém, o governo, o Congresso, ou o Congresso e um juiz. | 4 opções |  | Corrupção, Liberdades | nome parecido: Alvos da agência; Controle de armas; Controle externo da polícia; Poderes da agência |
| Controle de armas `controle-de-armas` | Que regras existem para comprar arma. Escada: venda livre; checagem de antecedentes; checagem mais curso e exame de tiro; licença só com motivo comprovado e limite de armas por pessoa; proibido para civis. | 5 opções |  | Homicídios | nome parecido: Controle da agência; Controle externo da polícia; Liberação de armas |
| Controle externo da polícia `controle-externo-da-policia` | Quem investiga a polícia: ela mesma, outra polícia ou um órgão independente. | 3 opções |  | Confiança na polícia, Corrupção policial, Mortes pela polícia | nome parecido: Controle da agência; Controle de armas; Polícia comunitária; Verba da polícia |
| Destino dos bens `destino-dos-bens` | Para onde vão os bens confiscados: leilão ou reuso social. | 4 opções |  | Confiança na polícia | nome parecido: Bloqueio de bens |
| Emprego para jovens `emprego-para-jovens` | Trabalho pago e um mentor para jovens de áreas violentas. | régua | gasta | Homicídios |  |
| Espionagem no exterior `espionagem-no-exterior` | O que a agência de espionagem pode fazer em outros países. Escada: nada; só ler notícias e relatórios das embaixadas; também escutar comunicações; também infiltrar agentes. | 4 opções |  | Reputação internacional |  |
| Fazer parte de facção é crime `fazer-parte-de-faccao-e-crime` | Quem pode ser preso por ligação com facção. Escada: só quem comete o crime; ser membro é crime; também quem ajuda a facção (guarda dinheiro, paga, leva recado); também quem tem sinais de pertencer (tatuagem, mensagem, morar com o chefe). | 8 opções |  | Homicídios, Liberdades, Lotação dos presídios, Reputação internacional | 8 opções |
| Força letal liberada `forca-letal-liberada` | Em que casos a polícia pode atirar para matar. Escada: só em legítima defesa; também para salvar refém ou outra pessoa em risco imediato; também contra quem foge armado depois de um crime; também contra qualquer suspeito armado em área de crime. | 5 opções |  | Confiança na polícia, Homicídios, Mortes pela polícia |  |
| Formação policial `formacao-policial` | Verba para treinar a polícia a usar menos força e respeitar direitos. | régua | gasta | Confiança na polícia, Mortes pela polícia | mesmo efeito: Polícia sem formato militar; Regra das câmeras policiais |
| Integração das polícias `integracao-das-policias` | Como as polícias federal, estadual e municipal trabalham: independentes, cooperando ou sob comando único. | 3 opções |  | Homicídios, Liberdades |  |
| Legítima defesa `legitima-defesa` | Quando quem se defende não responde pelo que fez. Escada: tem que provar que foi na medida; em casa a defesa já é presumida; também no comércio e no carro; em qualquer lugar, sem dever de fugir. | 5 opções |  | Crimes contra o patrimônio, Homicídios, Sensação de insegurança |  |
| Lei Maria da Penha `violencia-domestica` | O que o Estado faz contra a violência em casa. Escada: nada; crime próprio com pena; afastar o agressor na hora; juizado próprio e abrigo. | 4 opções |  | Lotação dos presídios, Tempo da Justiça, Violência contra a mulher |  |
| Liberação de armas `liberacao-de-armas` | Quem pode ter e andar com arma. Escada: arma proibida para civis; só caçadores, atiradores e vigilantes; cidadão sem antecedentes pode ter arma em casa; também pode andar armado na rua. | 5 opções |  | Homicídios | nome parecido: Controle de armas |
| Obrigação dos bancos `obrigacao-dos-bancos` | Quanto os bancos precisam avisar o governo sobre movimentações suspeitas. Escada: nenhuma; avisar só valores muito altos; avisar valores médios e guardar os dados por cinco anos; avisar qualquer movimento fora do padrão do cliente, com multa para o banco que não avisar. | 5 opções |  | Liberdades |  |
| Poderes da agência `poderes-da-agencia` | O que a agência pode fazer: só analisar informação, escutar com ordem do juiz, escutar sem juiz e infiltrar, ou fazer operações secretas. | 4 opções |  | Liberdades | nome parecido: Alvos da agência; Controle da agência |
| Polícia comunitária `policia-comunitaria` | Policiais fixos num bairro, que conhecem os moradores e resolvem problemas com eles. | régua | gasta | Confiança na polícia | nome parecido: Controle externo da polícia; Polícia sem formato militar; Verba da polícia |
| Polícia sem formato militar `policia-sem-formato-militar` | A polícia deixa o modelo militar: hierarquia, treino e justiça próprios. | 4 opções |  | Confiança na polícia, Mortes pela polícia | nome parecido: Polícia comunitária; Verba da polícia · mesmo efeito: Formação policial; Regra das câmeras policiais |
| Regra das câmeras policiais `regra-das-cameras-policiais` | Se o policial usa câmera no uniforme e quem decide ligar. Escada: sem câmera; câmera que o policial liga quando quiser; câmera sempre ligada durante o turno; câmera sempre ligada e imagens revistas por órgão independente. | 4 opções |  | Confiança na polícia, Mortes pela polícia | nome parecido: Regra de uso das imagens; Verba das câmeras; Verba das câmeras policiais · mesmo efeito: Formação policial; Polícia sem formato militar |
| Regra de uso das imagens `regra-cameras` | Quem pode ver e usar as imagens das câmeras públicas. | 3 opções |  | Liberdades, Segurança pública | nome parecido: Regra das câmeras policiais · mesmo efeito: Verba das câmeras |
| Segurança terceirizada `seguranca-terceirizada` | Quanto da segurança é feito por empresas: prédios, ruas, bairros ou toda a polícia. | 4 opções |  | Crimes contra o patrimônio |  |
| Verba da polícia `gasto-policia` | Dinheiro do governo para policiamento e investigação. | régua | gasta | Segurança pública | nome parecido: Controle externo da polícia; Polícia comunitária; Polícia sem formato militar |
| Verba das câmeras `gasto-cameras` | Dinheiro do governo para instalar e manter câmeras de vigilância nas ruas e nos prédios públicos. | régua | gasta | Liberdades, Segurança pública | nome parecido: Regra das câmeras policiais; Verba das câmeras policiais · mesmo efeito: Regra de uso das imagens |
| Verba das câmeras policiais `verba-das-cameras-policiais` | Quantos policiais usam câmera no uniforme. | régua | gasta |  | só grupos · nome parecido: Regra das câmeras policiais; Verba das câmeras |
| Verba de inteligência `verba-de-inteligencia` | Dinheiro da inteligência: agência, espiões, escutas, infiltração e o órgão que segue o rastro do dinheiro do crime. | régua | gasta | Chefes presos, Dinheiro do crime apreendido, Homicídios |  |

## terra

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Apoio ao assentado `apoio-ao-assentado` | Verba por família para se instalar na terra: ferramenta e semente. | régua | gasta |  | só grupos · nome parecido: O que o assentado recebe |
| Cadastro de terras `cadastro-de-terras` | Como o país sabe quem é dono: cartórios locais, cadastro nacional, por satélite, público para qualquer um ver. | 4 opções |  |  | sem ligação · nome parecido: Verba do órgão de terras |
| Como o órgão consegue a terra `como-o-orgao-consegue-a-terra` | De 0 a 100%, quanto da terra o órgão compra e quanto desapropria. | régua |  | Conflito no campo | nome parecido: Verba do órgão de terras |
| Crédito para comprar terra `credito-compra-terra` | Empréstimo barato do governo para o pequeno agricultor comprar terra de quem quer vender, pelo preço de mercado. | régua | gasta | Concentração de terra, Desigualdade |  |
| Direito de quem planta em terra alheia `direito-de-quem-planta-em-terra-alheia` | % mínimo da colheita que fica com o meeiro, e o direito de continuar na terra. | régua |  | Conflito no campo, Produtividade |  |
| Imposto sobre terra e imóvel parado `imposto-terra-parada` | Imposto por ano sobre terra sem uso e imóvel vazio. A terra grande e a parada há mais tempo pagam mais. | régua | arrecada | Concentração de terra, Preço da moradia |  |
| Limite a estrangeiro na terra `limite-a-estrangeiro-na-terra` | Até onde quem é de fora pode ter terra: livre, teto por município, só arrendar, proibido. | 4 opções |  |  | sem ligação |
| O que conta como terra parada `o-que-conta-como-terra-parada` | Quais fazendas podem entrar na fila da reforma: só a abandonada, a que quase nada produz, ou a que produz abaixo da média da região. | 3 opções |  |  | sem ligação |
| O que o assentado recebe `o-que-o-assentado-recebe` | O que a família ganha: uso coletivo da comunidade, uso sem poder vender, título com prazo para vender, título pleno. | 4 opções |  | Concentração de terra | nome parecido: Apoio ao assentado |
| Prazo de defesa do dono `prazo-de-defesa-do-dono` | Quantos meses o dono tem na Justiça antes de a fazenda ser desapropriada. | régua |  |  | só grupos |
| Reserva compensada em outra terra `reserva-compensada-em-outra-terra` | Quanto da Reserva da fazenda o dono pode cumprir comprando mata em outra região, de 0% a 100%. | régua |  | Desmatamento, Risco de falta d'água | nome parecido: Reserva legal |
| Reserva legal `reserva-da-fazenda` | % de cada fazenda que precisa ficar com a mata nativa, de 0 a 100%. | régua |  | Desmatamento, Preço da comida | nome parecido: Reserva compensada em outra terra |
| Terra ocupada anda na frente `terra-ocupada-anda-na-frente` | Quantas posições a fazenda ocupada sobe na fila. | régua |  |  | só grupos · país não declara · nome parecido: Terra ocupada sai da fila |
| Terra ocupada sai da fila `terra-ocupada-sai-da-fila` | Quantos anos a fazenda ocupada fica sem poder ser desapropriada. | régua |  | Conflito no campo | nome parecido: Terra ocupada anda na frente |
| Teto de tamanho da terra `teto-tamanho-terra` | Maior fazenda que uma pessoa ou empresa pode ter, contada em vezes a fazenda média do país. O que passa do teto o dono vende ou o órgão de terras desapropria. | 4 opções |  | Abastecimento, Concentração de terra | país não declara |
| Verba do órgão de terras `verba-orgao-terras` | Dinheiro do governo para o órgão que vistoria a terra parada, desapropria e monta os assentamentos. | régua | gasta | Concentração de terra, Pobreza | nome parecido: Cadastro de terras; Como o órgão consegue a terra |

## trabalho

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Aviso antes da multa `aviso-antes-da-multa` | O fiscal primeiro avisa e dá prazo para a empresa pequena corrigir; a multa só vem se ela não corrigir. Escada: multa direta para todos; aviso para o pequeno; aviso para todas as empresas; multa só com dano provado. | 4 opções |  | Corrupção, Emprego informal |  |
| Comércio aberto no domingo `comercio-aberto-no-domingo` | Se lojas e serviços podem abrir no domingo e no feriado. Escada: fechado; abre com acordo do sindicato; livre, com folga em outro dia; livre, sem folga a mais. | 6 opções |  | Tensão trabalhista |  |
| Contratos flexíveis `contratos-flexiveis` | Que tipos de contrato de trabalho a empresa pode usar além do fixo. Escada: só contrato fixo; também contrato temporário com prazo; também pagamento por hora; também trabalho intermitente, em que a pessoa é chamada só quando há serviço. | 5 opções |  | Emprego informal |  |
| Contribuição sindical livre `contribuicao-sindical-livre` | Quem é obrigado a pagar sindicato. Escada: todos pagam, descontado direto do salário; só paga quem a assembleia do sindicato aprovar; só paga quem autorizar por escrito; ninguém paga sem filiação, o sindicato vive só dos sócios. | 6 opções |  | Desigualdade |  |
| Desoneração da folha `desoneracao-da-folha` | Reduz o encargo cobrado sobre o salário. | régua |  | Emprego informal |  |
| Direito de greve `direito-de-greve` | Até onde o trabalhador pode parar de trabalhar para negociar. Um dos degraus: greve só vale com votação secreta da maioria, antes de proibir. | 5 opções |  | Liberdades, Padrão de vida |  |
| Feriados nacionais: dias de feriado `feriados-nacionais-dias-de-feriado` | Quantos dias de feriado o país tem, de 5 a 20, e a divisão em 100% entre religiosos, cívicos, datas de negros e indígenas, e do trabalho. | régua |  |  | só grupos · nome parecido: Feriados nacionais: divisão: cívicos; Feriados nacionais: divisão: datas de negros e indígenas; Feriados nacionais: divisão: do trabalho; Feriados nacionais: divisão: religiosos |
| Feriados nacionais: divisão: cívicos `feriados-nacionais-divisao-civicos` | Quantos dias de feriado o país tem, de 5 a 20, e a divisão em 100% entre religiosos, cívicos, datas de negros e indígenas, e do trabalho. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação · nome parecido: Feriados nacionais: dias de feriado; Feriados nacionais: divisão: datas de negros e indígenas; Feriados nacionais: divisão: do trabalho; Feriados nacionais: divisão: religiosos |
| Feriados nacionais: divisão: datas de negros e indígenas `feriados-nacionais-divisao-datas-de-negros-e-indigenas` | Quantos dias de feriado o país tem, de 5 a 20, e a divisão em 100% entre religiosos, cívicos, datas de negros e indígenas, e do trabalho. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação · nome parecido: Feriados nacionais: dias de feriado; Feriados nacionais: divisão: cívicos; Feriados nacionais: divisão: do trabalho; Feriados nacionais: divisão: religiosos |
| Feriados nacionais: divisão: do trabalho `feriados-nacionais-divisao-do-trabalho` | Quantos dias de feriado o país tem, de 5 a 20, e a divisão em 100% entre religiosos, cívicos, datas de negros e indígenas, e do trabalho. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação · nome parecido: Feriados nacionais: dias de feriado; Feriados nacionais: divisão: cívicos; Feriados nacionais: divisão: datas de negros e indígenas; Feriados nacionais: divisão: religiosos |
| Feriados nacionais: divisão: religiosos `feriados-nacionais-divisao-religiosos` | Quantos dias de feriado o país tem, de 5 a 20, e a divisão em 100% entre religiosos, cívicos, datas de negros e indígenas, e do trabalho. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação · nome parecido: Feriados nacionais: dias de feriado; Feriados nacionais: divisão: cívicos; Feriados nacionais: divisão: datas de negros e indígenas; Feriados nacionais: divisão: do trabalho |
| Férias subsidiadas `ferias-subsidiadas` | Quanto o governo paga do pacote de viagem na baixa temporada, de 0 a 80%. | régua |  |  | só grupos · país não declara |
| FGTS `conta-de-demissao` | Quem paga quem fica sem emprego. Escada: só o Estado, pelo Seguro-desemprego; parte numa conta do trabalhador; tudo na conta, com fundo do Estado para quem junta pouco; só a conta. | 6 opções |  | Emprego informal, Pobreza |  |
| Fiscalização do trabalho `fiscalizacao-do-trabalho` | Verba para fiscais do trabalho. | régua | gasta | Emprego informal |  |
| Frentes de trabalho `frentes-de-trabalho` | O Estado emprega quem está sem trabalho. | régua | gasta |  | só grupos · país não declara |
| Idade mínima para trabalhar `idade-minima-para-trabalhar` | A idade a partir da qual se pode trabalhar. | régua |  | Instrução, Pobreza |  |
| Jornada máxima `jornada-maxima` | Máximo de horas de trabalho por semana. | régua |  | Padrão de vida |  |
| Livre negociação `livre-negociacao` | O que o acordo entre empresa e empregado pode mudar em relação à lei. Escada: nada, a lei vale sempre; só horário e jornada; também férias e intervalos; quase tudo, menos salário mínimo e segurança. | 6 opções |  | Desigualdade | nome parecido: Negociação coletiva |
| Negociação coletiva `negociacao-coletiva` | Até onde vale o acordo feito pelo sindicato. Escada: não vale nada além da lei; vale só para os sócios do sindicato; vale para todos da empresa; vale para o setor inteiro. | 4 opções |  | Desigualdade, Padrão de vida | nome parecido: Livre negociação · mesmo efeito: Trabalho remoto livre |
| Policiamento de greves `policiamento-de-greves` | Quanto a polícia acompanha e age nas greves: de só acompanhar até dispersar com força. | 4 opções |  | Liberdades, Polarização |  |
| Preferência ao trabalhador nacional `preferencia-ao-trabalhador-nacional` | Quanto as empresas precisam dar prioridade a quem é do país. Escada: nenhuma; vaga anunciada primeiro para quem é do país; limite de estrangeiros nas empresas grandes; contratar de fora só se não houver nacional qualificado. | 4 opções |  | Industrialização | nome parecido: Simples Nacional; Trabalhador de aplicativo |
| Profissões com registro `profissoes-com-registro` | Quem precisa de diploma e carteira do conselho para trabalhar. Escada: toda profissão com conselho; só saúde, direito e engenharia; só saúde e engenharia (o que põe vida em risco); só médico, enfermeiro e farmacêutico. | 6 opções |  | Emprego informal |  |
| Proteção contra demissão `protecao-contra-demissao` | Quanto custa e o que é preciso para o patrão demitir. Escada: demissão livre, sem aviso; aviso de um mês e multa pequena; aviso longo e multa de vários meses de salário; demissão só com falta grave do empregado. | 5 opções |  | Emprego informal |  |
| Quem paga a ida ao trabalho: o empregado `quem-paga-a-ida-ao-trabalho-o-empregado` | A passagem do empregado registrado sai dele, do patrão ou do governo. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação |
| Quem paga a ida ao trabalho: o governo `quem-paga-a-ida-ao-trabalho-o-governo` | A passagem do empregado registrado sai dele, do patrão ou do governo. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação |
| Quem paga a ida ao trabalho: o patrão `quem-paga-a-ida-ao-trabalho-o-patrao` | A passagem do empregado registrado sai dele, do patrão ou do governo. Peso desta fatia: a parte dela é o peso sobre a soma. | régua |  |  | sem ligação |
| Quem perde a ação trabalhista paga `quem-perde-a-acao-trabalhista-paga` | Quem paga a conta quando o trabalhador perde a ação contra o patrão. Escada: nunca paga; paga se mentiu; paga as custas; paga as custas e o advogado do patrão. | 4 opções |  | Força dos sindicatos, Tempo da Justiça, Tensão trabalhista |  |
| Salário de entrada do jovem `salario-de-entrada-do-jovem` | Quanto do Salário mínimo recebe quem tem menos de 21 anos no primeiro emprego, de 50% a 100%. | régua |  |  | só grupos · país não declara · nome parecido: Salário mínimo |
| Salário mínimo `salario-minimo` | Piso do salário formal, medido pela renda média do país. | régua |  | Desigualdade, Emprego informal, Padrão de vida | nome parecido: Salário de entrada do jovem |
| Segurança do operário na obra `seguranca-do-operario-na-obra` | O que a obra deve ao operário: nada, equipamento e fiscal, seguro por morte, meses de salário ao acabar. | 4 opções |  | Custo das obras |  |
| Seguro-desemprego: duração `seguro-desemprego-duracao` | Quanto o desempregado recebe e por quanto tempo. | régua |  | Pobreza | nome parecido: Seguro-desemprego: valor |
| Seguro-desemprego: valor `seguro-desemprego-valor` | Quanto o desempregado recebe e por quanto tempo. | régua |  | Pobreza | nome parecido: Seguro-desemprego: duração |
| Simples Nacional `empresa-simples` | Quanto o governo facilita registro e imposto de quem trabalha por conta própria. Escada: nenhum regime especial; registro grátis e rápido; registro rápido e imposto único simples; imposto único baixo e sem papelada para quem fatura pouco. | 4 opções |  | Emprego informal | nome parecido: Preferência ao trabalhador nacional |
| Subsídio à contratação `subsidio-a-contratacao` | O Estado paga parte do salário de quem é contratado no privado. | régua |  |  | só grupos · país não declara |
| Trabalhador de aplicativo `trabalhador-de-aplicativo` | Se quem trabalha por aplicativo é empregado ou autônomo. Escada: autônomo sem regra; autônomo com seguro de acidente e ganho mínimo por hora; autônomo com férias e aposentadoria pagas em parte pelo aplicativo; empregado com carteira assinada. | 4 opções |  | Emprego informal | país não declara · nome parecido: Preferência ao trabalhador nacional |
| Trabalho de presos `trabalho-de-presos` | Se o preso trabalha durante a pena e para quem. Escada: não trabalha; trabalho voluntário dentro do presídio (cozinha, limpeza); trabalho obrigatório dentro do presídio; trabalho obrigatório também para empresas de fora. | 5 opções |  |  | sem ligação |
| Trabalho remoto livre `trabalho-remoto-livre` | Quanto o empregado pode trabalhar de casa. Escada: só presencial; um dia por semana de casa; até três dias por semana de casa; todos os dias de casa se patrão e empregado combinarem. | 4 opções |  | Desigualdade, Padrão de vida | mesmo efeito: Negociação coletiva |

## vicios

| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |
| --- | --------- | ----- | -------- | ---------------- | ------ |
| Álcool ao volante `alcool-ao-volante` | Quanto de bebida o motorista pode ter no sangue. Escada: sem limite; limite alto com multa; limite baixo com multa e suspensão da carteira; tolerância zero com prisão. | 4 opções |  | Mortes no trânsito |  |
| Cuidado com o usuário `cuidado-com-o-usuario` | Escada: tratamento; troca de seringas e salas de uso; usuário não é preso. | 3 opções |  | Atendimento, Dependência de drogas, Lotação dos presídios |  |
| Fiscalização e repressão: drogas `fiscalizacao-e-repressao-drogas` | Verba para apreender, prender e bloquear sites e pagamentos. Dois controles na mesma lei: drogas e jogos. | régua | gasta | Liberdades, Lotação dos presídios, Mercado ilegal | nome parecido: Fiscalização e repressão: jogos; Imposto das drogas; Liberação das drogas · mesmo efeito: Fiscalização e repressão: jogos |
| Fiscalização e repressão: jogos `fiscalizacao-e-repressao-jogos` | Verba para apreender, prender e bloquear sites e pagamentos. Dois controles na mesma lei: drogas e jogos. | régua | gasta | Liberdades, Lotação dos presídios, Mercado ilegal | nome parecido: Fiscalização e repressão: drogas; Imposto dos jogos; Liberação dos jogos · mesmo efeito: Fiscalização e repressão: drogas |
| Idade mínima para comprar: drogas `idade-minima-para-comprar-drogas` | Idade para comprar bebida, cigarro e apostar. Dois controles na mesma lei: drogas e jogos. | régua |  | Mortes no trânsito | nome parecido: Idade mínima para comprar: jogos; Imposto das drogas; Liberação das drogas |
| Idade mínima para comprar: jogos `idade-minima-para-comprar-jogos` | Idade para comprar bebida, cigarro e apostar. Dois controles na mesma lei: drogas e jogos. | régua |  | Mortes no trânsito | nome parecido: Idade mínima para comprar: drogas; Imposto dos jogos; Liberação dos jogos |
| Imposto das drogas `imposto-das-drogas` | Imposto sobre o que é legal: bebida, cigarro e o que mais for liberado. | régua |  | Dependência de drogas, Mercado ilegal | nome parecido: Fiscalização e repressão: drogas; Idade mínima para comprar: drogas; Liberação das drogas · mesmo efeito: Lojas licenciadas; Venda pelo Estado |
| Imposto dos jogos `imposto-dos-jogos` | Imposto sobre o que é legal nos jogos. | régua |  | Mercado ilegal | nome parecido: Fiscalização e repressão: jogos; Idade mínima para comprar: jogos; Liberação dos jogos |
| Liberação das drogas `liberacao-das-drogas` | Escada do que é permitido: nada, bebida, cigarro, cannabis, cocaína e sintéticas, crack e opioides. | 6 opções |  | Dependência de drogas, Liberdades, Mercado ilegal | nome parecido: Fiscalização e repressão: drogas; Idade mínima para comprar: drogas; Imposto das drogas; Liberação dos jogos |
| Liberação dos jogos `liberacao-dos-jogos` | Escada do que é permitido: nada, loteria, bingo e corrida, cassino presencial, apostas pela internet, cassino pela internet. | 6 opções |  | Dependência de jogos, Liberdades, Mercado ilegal | nome parecido: Fiscalização e repressão: jogos; Idade mínima para comprar: jogos; Imposto dos jogos; Liberação das drogas |
| Licenças de apostas `licencas-de-apostas` | Como as empresas podem explorar os jogos de aposta. Escada: apostas proibidas; poucas licenças caras; licença aberta com imposto moderado; licença barata e aberta a qualquer empresa. | 4 opções |  | Dependência de jogos, Mercado ilegal |  |
| Lojas licenciadas `lojas-licenciadas` | O que pode ser vendido legalmente em loja com licença. Escada: nenhuma venda legal de droga; só bebida alcoólica; bebida e cigarro; bebida, cigarro e cannabis. | 5 opções |  | Dependência de drogas, Mercado ilegal | mesmo efeito: Imposto das drogas; Venda pelo Estado |
| Monopólio do Estado `monopolio-do-estado` | Quais jogos só o Estado pode explorar. Escada: nenhum; loteria; loteria e bingo; todos os jogos. | 4 opções |  | Mercado ilegal |  |
| Propaganda e embalagem `propaganda-e-embalagem` | Limita anúncio e marca. Dois controles na mesma lei: drogas e jogos. | 4 opções |  | Dependência de drogas |  |
| Proteção do apostador `protecao-do-apostador` | Que freios a lei põe para quem aposta. Escada: sem regra; aviso de risco e autoexclusão voluntária; limite de depósito e proibição de pagar com cartão de crédito; limite de depósito, autoexclusão em todas as casas e propaganda proibida. | 5 opções |  | Dependência de jogos, Pobreza |  |
| Venda pelo Estado `venda-pelo-estado` | O que as lojas e farmácias do Estado podem vender de legal. Escada: nada; só remédio controlado na farmácia do Estado; remédio e bebida em lojas do Estado; remédio, bebida e cigarro em lojas do Estado. | 5 opções |  | Dependência de drogas, Mercado ilegal | país não declara · mesmo efeito: Imposto das drogas; Lojas licenciadas |
