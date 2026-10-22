# Ícones das leis

> **Status: VIGENTE (pedido de arte, 22/out/2026).** Lista de todos os
> ícones que o jogo precisa e como cada um deve ser. Feito para quem
> desenha (pessoa ou IA). Regras de arquivo em
> [src/assets/svg/README.md](../../src/assets/svg/README.md).
> Leis: [docs/jogo/leis/](../jogo/leis/README.md). Tela:
> [área aberta](../jogo/interface/area-aberta.md).

## 1. Estilo (vale para todos)

**Ícone pintado, não desenho de traço.** Cada lei vira uma **medalha
pintada à mão** no estilo do jogo, "Dossiê Tropical" (guia em
[PROMPTS.md](PROMPTS.md)): guache e óleo, papel envelhecido, luz âmbar,
um acento tropical. A medalha **é** a bolha da lei no mapa; a interface só
desenha por fora o anel do tipo de lei, os selos e a cor da bússola.

- **Arquivo:** PNG com fundo transparente, **512 × 512**. O desenho fica
  dentro de um **círculo** de 480 px de diâmetro, centrado (a bolha corta
  o que passar disso).
- **Um objeto, grande e centrado**, reconhecível com 40 px na tela. No
  máximo 2 elementos (o objeto principal e um detalhe).
- **Fundo do círculo:** cor lisa e suave da família (seção 3), com textura
  de papel. Nada de cena atrás.
- **Sem texto, números ou letras**, salvo o símbolo `%` na moeda dos
  impostos.
- **Temas sensíveis** (aborto, suicídio assistido, pena de morte, drogas,
  prostituição): objeto simbólico e neutro, sem cena, sem corpo, sem
  sangue, sem tomar partido.
- **Nada de marca, bandeira, logotipo real ou pessoa real.**
- O prompt pronto, em inglês, está em [PROMPTS.md](PROMPTS.md), seção
  "Ícones das leis": troque só a linha `SUBJECT`.

## 2. Onde salvar

Todos os ícones vão em **`src/assets/svg/`**, um arquivo **`.png`** por ícone
(o nome da pasta é antigo; ela aceita PNG, WebP e SVG):

| Pasta | O que vai nela | Exemplo |
| --- | --- | --- |
| `src/assets/svg/ui/` | áreas, selos e peças da tela (seção 4) | `src/assets/svg/ui/selo-industria.png` |
| `src/assets/svg/setor/` | setores das leis de dono (seção 5) | `src/assets/svg/setor/petroleo.png` |
| `src/assets/svg/leis/economia/` | leis da economia | `src/assets/svg/leis/economia/imposto-sobre-veiculos.png` |
| `src/assets/svg/leis/empresas/` | leis de empresas, indústria e comércio | |
| `src/assets/svg/leis/trabalho/` | leis do trabalho | |
| `src/assets/svg/leis/previdencia/` | previdência, assistência, família e moradia | |
| `src/assets/svg/leis/saude/` | saúde | |
| `src/assets/svg/leis/educacao/` | educação, ciência e cultura | |
| `src/assets/svg/leis/infraestrutura/` | infraestrutura, energia e cidades | |
| `src/assets/svg/leis/ambiente/` | meio ambiente e campo | |
| `src/assets/svg/leis/seguranca/` | segurança, justiça, defesa e relações exteriores | |
| `src/assets/svg/leis/direitos/` | direitos e costumes | |
| `src/assets/svg/leis/governo/` | governo e instituições | |

Nome do arquivo: o nome da lei em minúsculas, sem acento e sem pontuação,
com hífen no lugar dos espaços ("Imposto sobre veículos" →
`imposto-sobre-veiculos.png`). A lei é ligada ao arquivo em
`src/assets/svg/manifest-leis.json` (id da lei → caminho); quem implementa
as leis atualiza o manifesto.

Artes maiores (fundos, faixas, cenas) não são ícones: ver
[artes-de-tela.md](artes-de-tela.md).

## 3. Famílias: base + detalhe

Para o conjunto ficar coerente e o jogador reconhecer de longe, cada
família tem um **elemento base** e cada lei acrescenta **um detalhe**.

| Família | Fundo do círculo | Base | Exemplo |
| --- | --- | --- | --- |
| Imposto | dourado suave `#e8c770` | moeda de latão com `%` gravado, pequena, no canto inferior direito | moeda + casa = imposto sobre imóveis |
| Verba | verde-oliva suave `#a9b47c` | saco de pano com moedas, pequeno, no canto inferior direito | saco + trilho = verba para ferrovias |
| Dono de setor | lilás acinzentado `#a99bb8` | chave de ferro antiga no canto | barril + chave = dono do petróleo |
| Regra | azul-acinzentado `#8fa7b3` | só o objeto do assunto | balança, porta, relógio |
| Programa | coral suave `#e3a08a` | só o objeto, com fita amarrada | prato com fita = comida garantida |
| Constitucional | papel `#efe4cc` com borda sépia | o objeto apoiado num livro grosso aberto | livro + banco = quem manda no banco central |

## 4. Peças de interface (fazer primeiro)

| Arquivo | Desenho |
| --- | --- |
| `src/assets/svg/ui/area-economia` | moeda com seta subindo |
| `src/assets/svg/ui/area-empresas` | fábrica com chaminé |
| `src/assets/svg/ui/area-trabalho` | capacete de obra |
| `src/assets/svg/ui/area-previdencia` | bengala ao lado de uma casa pequena |
| `src/assets/svg/ui/area-saude` | cruz dentro de um coração |
| `src/assets/svg/ui/area-educacao` | livro aberto com lápis |
| `src/assets/svg/ui/area-infraestrutura` | ponte de arco |
| `src/assets/svg/ui/area-ambiente` | folha com uma gota |
| `src/assets/svg/ui/area-seguranca` | escudo |
| `src/assets/svg/ui/area-direitos` | duas mãos dadas |
| `src/assets/svg/ui/area-governo` | prédio com colunas e cúpula |
| `src/assets/svg/ui/selo-atencao` | raio |
| `src/assets/svg/ui/selo-industria` | engrenagem pequena |
| `src/assets/svg/ui/selo-bloqueada` | cadeado fechado |
| `src/assets/svg/ui/selo-exclusiva` | duas setas opostas (⇄) |
| `src/assets/svg/ui/selo-andamento` | ampulheta |
| `src/assets/svg/ui/ministro-sugere` | balão de fala com uma seta |

## 5. Setores (leis de dono)

| Arquivo | Desenho |
| --- | --- |
| `src/assets/svg/setor/petroleo` | barril com gota |
| `src/assets/svg/setor/mineracao` | picareta sobre pedra |
| `src/assets/svg/setor/energia` | torre de transmissão com raio |
| `src/assets/svg/setor/siderurgia` | viga em I com faísca |
| `src/assets/svg/setor/bancos` | prédio de banco com colunas e moeda |
| `src/assets/svg/setor/telecom` | antena com ondas |
| `src/assets/svg/setor/correios` | caixa de encomenda com etiqueta |
| `src/assets/svg/setor/ferrovias-portos` | trem de frente com âncora pequena |
| `src/assets/svg/setor/aviacao` | avião de perfil |
| `src/assets/svg/setor/agua` | torneira com gota |
| `src/assets/svg/setor/estatizar` | chave passando de uma mão para um prédio público |

## 6. Leis, por área

Cada tabela vai na pasta da área (seção 2).

### Economia

| Lei | Desenho |
| --- | --- |
| Imposto sobre a renda das pessoas | moeda% + contracheque (folha com linhas) |
| Isenção do imposto de renda | moeda% riscada + pessoa |
| Quantas faixas tem o imposto de renda | três degraus de alturas diferentes |
| Imposto sobre o lucro das empresas | moeda% + fábrica |
| Imposto sobre dividendos | moeda% + pizza com uma fatia saindo |
| Contribuição sobre os salários | moeda% + carteira de trabalho |
| Imposto sobre o consumo | moeda% + carrinho de compras |
| Imposto sobre o que faz mal | moeda% + garrafa e cigarro |
| Imposto sobre imóveis e terras | moeda% + casa |
| Imposto sobre veículos | moeda% + carro |
| Imposto sobre grandes fortunas | moeda% + pilha alta de moedas |
| Imposto sobre heranças | moeda% + envelope com fita |
| Imposto sobre transações bancárias | moeda% + duas setas trocando entre cartões |
| Imposto do dinheiro guardado no exterior | moeda% + globo |
| Imposto único para pequenas empresas | moeda% + loja pequena com toldo |
| Isenções fiscais | etiqueta de preço com "−" |
| Regra das contas | balança de pratos com moedas |
| Meta de resultado das contas | alvo com moeda no centro |
| Conselho fiscal independente | lupa sobre uma planilha |
| Verbas carimbadas | moeda com carimbo |
| Fundo soberano | cofre com folha brotando |
| Dívida pública: pagar ou não | corrente com um elo aberto |
| Quem manda no banco central | livro + prédio de banco |
| Missão do banco central | prédio de banco + alvo |
| Juros básicos | seta curva para cima com % |
| Meta de inflação | termômetro com marca no meio |
| Imprimir dinheiro para pagar contas | impressora soltando cédulas |
| Correção automática pela inflação | etiqueta de preço com seta circular |
| Moeda e câmbio | duas moedas com setas trocando |
| Controle de capitais | moeda atrás de uma cerca |
| Regras para os bancos | prédio de banco com prancheta |
| Teto para os juros dos bancos | cartão com uma barra horizontal em cima |

### Empresas, indústria e comércio

| Lei | Desenho |
| --- | --- |
| Leis de dono, uma por setor | ícones da seção 5 |
| Como estatizar | prédio público com chave e moeda |
| Ritmo das privatizações | martelo de leilão |
| Preços das estatais | bomba de combustível com etiqueta |
| Política industrial | fábrica com estrela |
| Verba de incentivo à indústria | saco de dinheiro + engrenagem |
| Banco de desenvolvimento | prédio de banco com guindaste |
| Conteúdo nacional obrigatório | peça de engrenagem com alfinete de mapa |
| Zonas econômicas especiais | cerca formando um quadrado com fábrica dentro |
| Incentivo à exportação | navio de carga com seta saindo |
| Tarifas de importação | moeda% + contêiner |
| Defesa contra concorrência desleal | escudo com etiqueta de preço |
| Acordos de livre comércio | aperto de mãos sobre contêiner |
| Investimento estrangeiro | globo com seta entrando numa fábrica |
| Controle de preços | etiqueta de preço com cadeado |
| Defesa da concorrência | três prédios de tamanhos parecidos |
| Abrir uma empresa | porta de loja abrindo |
| Cooperativas e empresas dos trabalhadores | três pessoas segurando uma engrenagem |
| Planejamento da economia | prancheta com gráfico e lápis |

### Trabalho

| Lei | Desenho |
| --- | --- |
| Salário mínimo | contracheque com seta para baixo apontando um piso |
| Como o salário mínimo sobe | contracheque com seta para cima |
| Jornada máxima | relógio com marca de limite |
| Demissão | porta com seta saindo |
| Poupança obrigatória do trabalhador | cofrinho com capacete |
| Seguro-desemprego | guarda-chuva sobre pessoa |
| Como se negocia o salário | mesa com duas cadeiras |
| Dinheiro dos sindicatos | punho fechado com moeda |
| Direito de greve | placa de protesto |
| Terceirização | crachá com seta para outra empresa |
| Trabalho por aplicativo | celular com mochila de entrega |
| Trabalho em troca de benefício | pá com moeda |
| Trabalho de jovens e aprendizes | capacete pequeno com livro |
| Fiscalização do trabalho | prancheta com capacete |
| Quem paga o processo trabalhista | martelo de juiz com moeda |
| Agências de emprego e cursos | quadro de vagas com alfinete |
| Crise sem demissão | relógio partido ao meio com pessoa |

### Previdência, assistência, família e moradia

| Lei | Desenho |
| --- | --- |
| Como a aposentadoria é paga | livro + cofrinho |
| Idade mínima para se aposentar | bengala com marcador de régua |
| Valor da aposentadoria | contracheque com bengala |
| Reajuste das aposentadorias | bengala com seta para cima |
| Aposentadoria do trabalhador rural | chapéu de palha com bengala |
| Pensão para viúvos e órfãos | duas mãos segurando uma casa pequena |
| Aposentadoria dos servidores | crachá com bengala |
| Renda para famílias pobres | cartão com coração |
| Condições para receber a renda | cartão com marca de visto |
| Renda básica para todos | várias mãos recebendo moedas iguais |
| Renda para idosos e pessoas com deficiência pobres | cadeira de rodas e bengala lado a lado |
| Comida garantida | prato com talheres |
| Cuidado de idosos dependentes | mão segurando outra mão |
| Licença quando o bebê nasce | carrinho de bebê com relógio |
| Vagas de creche | blocos de montar |
| Política de filhos | família de três com sinais de + e − |
| Moradia como direito na Constituição | livro + casa |
| Verba para casas populares | saco de dinheiro + casa |
| Como o Estado entrega casa | chave de casa |
| Controle de aluguel | casa com cadeado na etiqueta |

### Saúde

| Lei | Desenho |
| --- | --- |
| Modelo do sistema de saúde | livro + cruz |
| Piso de gasto em saúde | cruz sobre uma barra (piso) |
| Verba da saúde | saco de dinheiro + cruz |
| Postos de bairro ou hospitais | posto pequeno ao lado de hospital grande |
| Quem administra os hospitais públicos | hospital com crachá |
| Fila única de cirurgias e exames | fila de três pessoas com número |
| Mutirão de cirurgias | bisturi com relógio rápido |
| Médicos no interior | estetoscópio com casa de campo |
| Formação de médicos | capelo com estetoscópio |
| Remédios de graça | caixa de remédio com coração |
| Patentes de remédios | cápsula com cadeado |
| Planos de saúde | cartão com cruz |
| Vacinação obrigatória | seringa com marca de visto |
| Vigilância de epidemias e campanhas | lupa sobre vírus |
| Saúde mental e dependência química | cabeça de perfil com folha |
| Cigarro e bebida | cigarro e garrafa |
| Esporte e atividade física | tênis de corrida |

### Educação, ciência e cultura

| Lei | Desenho |
| --- | --- |
| Escola obrigatória | mochila |
| Piso de gasto em educação | livro sobre uma barra (piso) |
| Verba da educação | saco de dinheiro + livro |
| Salário dos professores | quadro-negro com moeda |
| Quem administra a escola pública | escola com crachá |
| Vale para escola particular | bilhete com escola |
| Escola em casa e escola particular | casa com livro |
| Escola em tempo integral | escola com sol e lua |
| Alfabetização na idade certa | letras A B C |
| Bolsa para terminar o ensino médio | capelo com moeda |
| Prova e dinheiro por resultado | folha de prova com nota |
| Ensino técnico | chave inglesa com livro |
| Moral e sexo na escola | livro com coração |
| Religião na escola | livro com vela |
| Quem paga a universidade | livro + capelo |
| Vagas nas universidades públicas | capelo com cadeira |
| Crédito estudantil | capelo com cartão |
| Verba da ciência | saco de dinheiro + frasco de laboratório |
| Pesquisa nas empresas | frasco com engrenagem |
| Programa espacial e satélites | foguete |
| Dinheiro para a cultura | máscaras de teatro |

### Infraestrutura, energia e cidades

| Lei | Desenho |
| --- | --- |
| Verba para estradas | saco de dinheiro + estrada em perspectiva |
| Verba para ferrovias | saco de dinheiro + trilho |
| Verba para portos e hidrovias | saco de dinheiro + âncora |
| Como o governo faz obras | guindaste |
| Licença para obras e fábricas | carimbo sobre uma planta |
| Verba para novas usinas | saco de dinheiro + raio |
| De onde vem a energia nova | painel solar, gota e chama juntos |
| Energia nuclear | livro + átomo |
| Usinas a carvão | chaminé com fumaça |
| Tarifa de energia para a indústria | tomada com fábrica |
| Água e esgoto | cano com gota |
| Transporte público | ônibus de frente |
| Internet em todo o país | sinal de wi-fi sobre casa de campo |
| Fundo para regiões pobres | mapa com alfinete e moeda |
| Prédios e bairros | prédios de alturas diferentes |

### Meio ambiente e campo

| Lei | Desenho |
| --- | --- |
| Floresta nas propriedades rurais | cerca com árvore dentro |
| Fiscalização ambiental | lupa sobre árvore |
| Preço do carbono | moeda% + nuvem de fumaça |
| Metas do clima | termômetro com globo |
| Agrotóxicos | pulverizador sobre planta |
| Reforma agrária | livro + enxada |
| Terras indígenas | cocar simples sobre colina (sem rosto) |
| Garimpo e mineração em áreas protegidas | bateia com árvore |
| Crédito para o campo | saco de dinheiro + trator |
| Pesca | peixe com anzol |

### Segurança, justiça, defesa e relações exteriores

| Lei | Desenho |
| --- | --- |
| Polícias dos estados | escudo com mapa |
| Polícia de rua militar ou civil | quepe |
| Ciclo policial | distintivo com seta circular |
| Coordenação nacional das polícias | três distintivos ligados por linhas |
| Verba da segurança pública | saco de dinheiro + distintivo |
| Polícia Federal | distintivo com estrela |
| Como a polícia patrulha | viatura de frente |
| Câmeras corporais | câmera pequena presa num colete |
| Quando o policial pode atirar | coldre com ponto de interrogação |
| Garantias fundamentais | escudo com balança |
| Pena de morte | balança com um prato vazio (simbólico) |
| Penas e progressão | grade com seta para fora |
| Idade para responder como adulto | ampulheta com grade |
| Alternativas à prisão | tornozeleira |
| Delação premiada | balão de fala com cadeado aberto |
| Facções e crime organizado | máscara com corrente |
| Violência contra a mulher | escudo com símbolo feminino |
| Lei de drogas | folha com balança |
| Maconha legal | folha de sete pontas com etiqueta |
| Armas de fogo | revólver de perfil, simples |
| Vagas em presídios | saco de dinheiro + grade |
| Quem administra os presídios | grade com crachá |
| Câmeras e reconhecimento facial | câmera de rua com quadrado de foco |
| Escuta de comunicações | telefone com fone de ouvido |
| Agência de inteligência | olho dentro de uma pasta |
| Gasto militar | saco de dinheiro + capacete militar |
| Serviço militar | capacete militar com pessoa |
| Papel das Forças Armadas | livro + estrela militar |
| Comando civil das Forças Armadas | gravata sobre estrela militar |
| Benefícios dos militares | medalha |
| Indústria de defesa | fábrica com escudo |
| Exportação de armas | caixa de munição com seta saindo |
| Programa nuclear militar | livro + átomo com escudo |
| Defesa cibernética | escudo com cadeado digital |
| Fronteiras | cerca com marco de fronteira |
| Alinhamento do país no mundo | bússola sobre globo |
| Aliança militar | escudos entrelaçados |
| Integração com os vizinhos | duas peças de quebra-cabeça |
| Sanções contra outros países | globo com cadeado |
| Tribunais e tratados internacionais | livro + globo |
| Missões de paz | capacete com pomba |
| Ajuda a outros países | mão estendida com globo |
| Embaixadas | prédio com bandeira lisa (sem país) |

### Direitos e costumes

| Lei | Desenho |
| --- | --- |
| Vida desde a concepção na Constituição | livro + broto |
| Aborto | silhueta feminina com balança (simbólico) |
| Suicídio assistido e eutanásia | cama de hospital com uma vela |
| Casamento | duas alianças |
| Identidade de gênero | documento com silhueta e seta circular |
| Prostituição | luz de rua (poste) com balança |
| Cotas | cadeira reservada com etiqueta |
| Programas contra o racismo | duas mãos de tons diferentes |
| Salário igual para homens e mulheres | símbolo de igual entre duas silhuetas |
| Discriminação e crimes de ódio | balão de fala riscado |
| Estado laico | livro + templo pequeno separado por uma linha |
| Igrejas: imposto e dinheiro público | templo com moeda |
| Apostas e jogos de azar | dado |
| Imposto sobre apostas | moeda% + dado |
| Proteção de dados pessoais | impressão digital com cadeado |
| Crimes da ditadura | livro com lupa |
| Imigração | mala com seta entrando |
| Refúgio e asilo | barraca com coração |
| Acolhida de imigrantes | mala com casa |
| Sair do país | passaporte com seta saindo |

### Governo e instituições

| Lei | Desenho |
| --- | --- |
| Sistema de governo | livro + cadeira de presidente |
| Reeleição | urna com seta circular |
| Poderes de emergência | sirene |
| Federação | livro + mapa dividido |
| Governadores | prédio de governo pequeno com estrela |
| Repasse para estados e cidades | moeda com setas se dividindo |
| Tamanho do governo | prédio com setas para dentro |
| Partidos | três bandeirinhas lisas |
| Cláusula de desempenho | barra com marca de corte |
| Voto obrigatório | urna com marca de visto |
| Consultas populares | mão levantada |
| Financiamento de campanhas | megafone com moeda |
| Fundo eleitoral | saco de dinheiro + urna |
| Liberdade de imprensa | livro + jornal |
| Concessões de rádio e TV | antena com televisor |
| Redes sociais | balões de conversa ligados |
| Propaganda do governo | megafone |
| ONGs e dinheiro estrangeiro | mão com globo e moeda |
| Estabilidade dos servidores | crachá com cadeado |
| Salário e quantidade de servidores | crachá com moeda |
| Lei anticorrupção | mão com moeda riscada |
| Transparência pública | vidro com documento atrás |
| Órgãos de controle | lupa sobre prédio público |
| Foro privilegiado | cadeira alta de juiz |
| Independência do Judiciário | livro + martelo de juiz |
| Verba do Judiciário | saco de dinheiro + martelo de juiz |
| Tribunais superiores | prédio com cúpula e balança |

## 7. Ordem de produção

1. Peças de interface (seção 4): 17 ícones.
2. Setores (seção 5): 11 ícones.
3. Economia e empresas (as primeiras áreas implementadas): 51 ícones.
4. As outras áreas, na ordem em que forem implementadas.

Total: cerca de 270 ícones. **Fazer todos**, área por área. Ícone que faltar
usa o desenho antigo de reserva.

## 8. Como entregar

- Um PNG por arquivo, na pasta da seção 2.
- Uma folha de prova por área (todos os ícones da área lado a lado, em
  40 px e em 128 px) para conferir que a família está igual antes de seguir.
- Registrar a origem e a licença no README dos SVGs.
