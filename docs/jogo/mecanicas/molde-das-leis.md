# Molde das leis e áreas do mapa

> **Status: PROPOSTA (22/out/2026), para o autor revisar.** Completa a
> [mecânica 2 (leis)](leis.md) e a parte de áreas da mecânica 14 (ministérios
> e mapa). O que está aqui foi combinado com o autor na conversa de 22/out;
> vira VIGENTE quando ele aprovar este texto. Índice: [mecânicas](README.md).

## 1. O que é

Um **molde único** para toda lei do jogo e uma **divisão de áreas por
assunto**. O catálogo é refeito dentro do molde, área por área, mais enxuto
(umas 100 a 120 leis). As 242 leis de hoje viram matéria-prima: só entra no
jogo a lei que passa no molde.

**Por quê** (levantamento de 22/out nas 242 leis):

- 19 nomes de área diferentes para 11 esferas no mapa, com pares repetidos
  ("Tributação" e "Impostos e contas públicas");
- 24 nomes de ministério nas leis, com duplicatas ("Casa Civil" e "Casa Civil
  da Presidência");
- quatro formatos misturados: 40 leis sem nível, 10 sem família, só 10 no
  formato v3;
- 9 leis sem nenhum efeito na rede (exemplo: Regulação de vagas, cujo efeito
  só existe em texto);
- 131 descrições em forma de pergunta, que não dizem o que a lei faz;
- nomes de programa de um país ("Farmácia popular");
- a família da lei (cor no mapa) é **adivinhada** pelo código: só 9 leis caem
  em imposto e 13 em verba; o resto vira "regra", até lei que custa R$ 23,8 bi
  por ano (Banco de desenvolvimento).

## 2. Regras

### 2.1 Famílias e cores

A família é **campo obrigatório da lei**, nunca adivinhada. Ela decide a cor,
o controle, a faixa do mapa e o que a janela mostra.

| Família | Cor | O que é | Controle | Faixa no mapa |
| --- | --- | --- | --- | --- |
| **Imposto** | dourado | tira dinheiro de alguém para o governo | alíquota (%) | de fora |
| **Verba** | verde | o governo gasta com uma coisa (obra, órgão, serviço) | valor (R$/ano; guardado em % do PIB) | de fora |
| **Programa** | verde-água (perto do verde, mas outra cor) | o governo paga direto às pessoas: renda, remédio, bolsa | valor (R$/ano) | de fora |
| **Regra** | azul | muda como as coisas funcionam, sem ser principalmente dinheiro | até 3 opções, ou faixa | de fora |
| **Constitucional** | lilás | decide o que as outras leis podem fazer (piso, teto, permite, proíbe) | até 3 opções | de dentro (entre a esfera e o centro) |
| **Pétrea** | lilás escuro, com cadeado | não muda por votação comum (mecânica 2, seção 2.4) | nenhum | centro (Constituição Federal) |

- Cores de partida, a partir das que já estão no `mapa.css`: imposto
  `#c9a24a`, regra `#4b97bf`, constitucional `#9b86c4`. Verba fica num verde
  mais puro e programa num verde-água, para as duas não se confundirem com a
  regra (azul). Os tons finais saem da **amostra em HTML**, aprovada antes do
  código.
- A cor é a mesma em todo lugar: bolha do mapa, prateleira do painel,
  etiqueta da janela, catálogo.

### 2.2 O que toda lei tem

| Campo | Regra |
| --- | --- |
| **Nome** | geral, vale em qualquer país, sem sigla (mecânica 2, regra 5). "Remédios de graça na farmácia", não "Farmácia popular" |
| **O que decide** | uma frase **afirmativa**: "Define como os pacientes do sistema público entram na fila de consultas e cirurgias." Nunca uma pergunta solta |
| **Família e nível** | declarados (seção 2.1) |
| **Área** | uma das 11 (seção 2.4), pelo **assunto** da lei |
| **Efeitos** | só na rede, em setas. Lei sem nenhuma seta não entra no jogo. Nada de efeito escrito só em texto |
| **Exemplo no país** | opcional: "No Brasil: Farmácia Popular, desde 2004." É onde o nome do programa aparece |
| **Fontes** | opcional, como no formato v3 |

### 2.3 O que muda por família

- **Imposto:** sobre o que cobra (consumo, renda, lucro, patrimônio, folha,
  herança…); alíquota de partida; quanto rende na partida; a alíquota em que
  a arrecadação para de subir; quem paga (para os grupos). Na janela: a barra
  da alíquota e "arrecada R$ X por ano".
- **Verba:** o que paga; valor de partida; se o custo reage ao país; se puxa
  o crescimento (obra puxa, folha quase nada). Na janela: a barra do valor e
  "custa R$ X por ano".
- **Programa:** como verba, mais **quem recebe** e **quantas pessoas**. Na
  janela: "custa R$ X por ano · atende Y pessoas". O desenho do programa
  (quem tem direito), se valer a pena, é uma regra separada; cada lei tem um
  controle só.
- **Regra:** cada opção tem "o que propõe" em uma frase, quem apoia, quem
  rejeita e custo, se houver. Na janela: os degraus, cada um com a sua frase.
- **Constitucional:** cada opção diz **o que trava**, apontando para a lei
  travada: "o gasto com saúde não fica abaixo de 15% da receita", "imposto
  sobre fortunas proibido". Na janela: "esta lei trava…"; na lei travada:
  "travada por…".
- **Pétrea:** o princípio em uma frase e o que ela trava.

### 2.4 Áreas (as 11 esferas)

**As áreas são assuntos, não ministérios.** A lei fica na área do seu
assunto; o ministério vira só o rótulo de quem cuida dela naquele país.

| Área | O que tem dentro |
| --- | --- |
| Contas públicas | impostos, regra fiscal, dívida, cofre |
| Economia e empresas | juros e Banco Central, câmbio, comércio exterior, indústria, crédito, estatais |
| Trabalho | salário mínimo, jornada, sindicatos, contratos |
| Proteção social | previdência, programas de renda, moradia |
| Saúde | sistema de saúde, remédios, vacinas, fila |
| Educação e cultura | escola, universidade, ciência, cultura, esporte |
| Infraestrutura e energia | transporte, energia, cidades, saneamento |
| Meio ambiente e campo | clima, florestas, agro, terra, pesca |
| Segurança e defesa | polícia, penas, drogas, armas, Forças Armadas, diplomacia |
| Direitos e costumes | aborto, família, religião, imigração, povos indígenas, igualdade |
| Governo e instituições | Congresso, eleições, partidos, corrupção, imprensa, federalismo |

- **8 a 12 leis por esfera.** Passou disso, é sinal de lei repetida ou de
  assunto de outra área.
- Cada esfera tem as **duas faixas**: constitucionais na de dentro, voltada
  para o centro; impostos, verbas, programas e regras na de fora.
- **Pétreas** ficam no centro, na Constituição Federal, e não são de nenhuma
  área.
- O país declara, para cada área, **quais ministérios** cuidam dela (o Brasil
  tem 38). Isso muda só rótulos e retratos, nunca onde a lei fica.

### 2.5 Mudanças na mecânica 2

- **Regra 2.2 (leis de escolha):** continua "no máximo 3 opções", agora para
  regra e constitucional.
- **Tabela 2.4 (níveis):** a coluna "No mapa" passa a ser a da seção 2.1
  deste documento (faixa de dentro, faixa de fora, centro), em vez de
  "no ministério".
- O resto da mecânica 2 vale como está.

## 3. Entradas e saídas

- **Lê:** as 242 leis de hoje (matéria-prima), os desenhos em
  [docs/jogo/leis/](../leis/README.md), a rede de consequências.
- **Entrega:**
  - para o mapa: família, área e faixa de cada lei;
  - para a janela da lei: o que mostrar por família (seção 2.3);
  - para o orçamento (mecânica 4): toda verba, programa e imposto com valor
    de partida e custo explícitos, e toda lei com dinheiro na família certa;
  - para o país: a lista de ministérios por área.

## 4. No código

**Formato:** a ficha v3 (`versaoEsquema: 3`, efeitos dentro da lei, já usada
por 10 leis) ganha os campos `familia`, `decide`, `area` (um dos 11 ids),
`opcoes[].propoe`, `trava` e `exemplo` e vira o **formato v4**. Lei v4 é o
único formato aceito no fim.

**Passos (cada um com teste e commit):**

1. **Verificador do molde:** um teste que lê todas as leis e reprova a que
   não segue as seções 2.1 a 2.4 (família, área válida, frase afirmativa,
   pelo menos uma seta, até 3 opções, sem sigla, limite por esfera).
   Começa valendo só para as leis v4.
2. **Inventário:** um script lista, para cada uma das 242 leis, a área
   nova sugerida, a família sugerida, o que falta para passar no molde e se
   ela repete outra. Sai uma tabela em `docs/jogo/leis/` para o autor
   decidir **quais entram**, área por área.
3. **Áreas no país:** o Brasil passa a declarar ministérios por área nova;
   `familia.ts` passa a ler o campo, sem adivinhar.
4. **Catálogo novo, uma área por vez:** reescrever as leis escolhidas no
   formato v4. As que ficam de fora vão para
   `src/conteudo/_arquivo-leis-antigas/` (a pasta já existe), sem apagar.
   Cada área fecha com o verificador verde e a sonda de 8 turnos sem salto
   absurdo.
5. **Fim:** o verificador vale para todas as leis; o formato v2 sai do
   validador.

**Ordem das áreas:** Contas públicas primeiro (a mecânica 4, orçamento,
depende dela), depois Economia e empresas e Proteção social. As demais na
ordem que o autor escolher.

## 5. Partes seguintes (cada uma com amostra em HTML antes do código)

1. **Mapa em faixas e filtro:** as duas faixas de cada esfera e o centro; o
   filtro passa a ter **só duas escolhas**, "Leis populares" e "Influência",
   e as bolhas mudam de tamanho conforme a escolha. Nenhum outro parâmetro.
2. **Janela da lei enxuta:** menos coisas, letra maior, e cada parte diz o que
   é. Mostra o que a seção 2.3 manda para a família da lei, e só isso.
3. **Eleitorado em janela:** sai da aba lateral e vira uma janela que o
   jogador abre quando quiser.

## 6. Em aberto

- Tons finais das seis cores (pela amostra).
- Quais leis de hoje entram, por área (pelo inventário do passo 2).
- Se alguma área ficar com menos de 8 leis boas: juntar com a vizinha ou
  escrever leis novas.
