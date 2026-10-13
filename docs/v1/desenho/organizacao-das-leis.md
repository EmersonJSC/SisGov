# Organização das leis (V1-34)

**Status:** EM REVISÃO (13/out). É um estudo: nada muda no jogo antes da sua
aprovação. As perguntas estão na seção 5.

## 0. Resumo

Antes de criar leis novas, as 129 de hoje foram classificadas pela regra do
jogo (Constituição, lei e decreto) e pelo lugar onde cada assunto mora de
verdade no Brasil, com a base legal. Resultado: **39 leis estão no nível
errado**, o nível está escrito de **três jeitos diferentes** nos arquivos, e
só 5 leis têm mãe. A proposta organiza as leis em 18 troncos (uma lei mãe
por assunto), junta 3 leis de polícia em uma, transforma a pena de morte em
opção da lei de garantias penais e junta as duas leis sobre o que fazer com a
sobra do orçamento.

## 1. A regra do jogo

Vem de `docs/v1/conteudo.md` (seção 1.1) e do caminho no Congresso do V1-12.

| Natureza            | O que é                  | Controle                | Caminho no Brasil                                                     |
| ------------------- | ------------------------ | ----------------------- | --------------------------------------------------------------------- |
| **Regra do Estado** | Como o Estado funciona   | 2 a 5 opções com nome   | Emenda: 3/5 das duas casas, dois turnos. Pétrea: não muda por votação |
| **Lei**             | O modelo de um assunto   | 2 a 5 opções com nome   | Ordinária: maioria simples. Complementar: maioria absoluta            |
| **Alavanca**        | Valor, programa ou verba | Faixa ou liga e desliga | Decreto ou orçamento: sem votação, vale no turno seguinte             |

Duas ligações entre leis:

- **Tronco:** a lei mãe de um assunto. As outras leis do assunto ficam
  penduradas nela no mapa e no tablet (macro, meso e micro do formato antigo).
- **Exige:** a filha só vale com a mãe em certas opções (já existe no jogo;
  por exemplo, maconha legal exige que o usuário não seja preso).

## 2. O que existe hoje (medido em 13/out)

- **Três jeitos de dizer o nível:** 120 leis usam `processoAutorizacao`, 14
  usam `nivelLegal` (pétrea, constitucional, derivada) e 9 usam `nivel`
  (constituição, lei, decreto). Algumas têm dois.
- **39 leis no nível errado** comparado com o Brasil:
  - 12 estão como lei, mas no Brasil são da Constituição: voto obrigatório,
    estabilidade dos servidores, incentivos regionais (Zona Franca), ensino
    obrigatório, idade mínima da aposentadoria, salário mínimo, jornada,
    licença parental, trabalho infantil, serviço militar, energia nuclear e
    reforma agrária.
  - 16 estão como emenda, mas no Brasil são lei ou decreto: câmbio, meta de
    inflação, regra fiscal, autonomia do banco central, banco de
    desenvolvimento, defesa da concorrência, acordos comerciais,
    transparência, cultura, avaliação das escolas, saúde mental, segurança
    alimentar, cuidados de longa duração, seguro-desemprego, redução de
    jornada subsidiada e saneamento. Parece que o grupo "institucional"
    virou emenda de forma automática.
  - 3 estão como emenda, mas são pétreas: federalismo, independência do
    Judiciário e liberdade de imprensa.
  - 2 estão como verba, mas são vinculação da Constituição: piso da
    educação e piso da saúde.
  - 3 estão como lei, mas o governo muda por decreto: tarifa de importação,
    imposto sobre transações financeiras e câmeras com reconhecimento facial.
  - 1 está como lei e é programa com verba: escola em tempo integral.
  - Polícias dos estados está como pétrea, e o art. 144 não é pétreo; a pena
    de morte está como lei solta, e a proibição é pétrea.
- **Só 5 leis têm "exige":** câmbio e meta de inflação, previdência e
  pensão, previdência e regime rural, drogas e maconha, garantias penais e
  pena de morte.
- **6 leis não mexem na bússola** (todas as opções com seta zero): energia
  nuclear, ensino técnico, lei anticorrupção, regime simplificado, sistema de
  governo e imposto sobre consumo. Isso é permitido; nem toda lei precisa
  ser de esquerda ou de direita.

## 3. Proposta

### 3.1 O nível mora no país

O mesmo assunto tem nível diferente em cada país (o aborto é lei federal
aqui e lei estadual em outros lugares). Os arquivos do mundo não podem citar
o Brasil. Então:

- A lei do mundo diz só a **natureza**: regra do Estado, lei ou alavanca.
- O país diz o **caminho** de cada lei em `paises/brasil/leis.json`: pétrea,
  emenda, complementar, ordinária, decreto ou orçamento, com a base legal.
- Os três campos de hoje viram um só.

### 3.2 Troncos

18 mães, uma por assunto: sistema de governo, federalismo, liberdade de
imprensa, regra fiscal, autonomia do banco central, estatais, acordos
comerciais, modelo tributário, acesso ao ensino superior, sistema de saúde,
sistema previdenciário, benefício a idosos (assistência), legislação
trabalhista, garantias penais, lei de drogas, laicidade, imigração e
licenciamento ambiental. 29 leis ficam soltas (sem mãe), o que a regra
permite.

### 3.3 Juntar e virar opção

| Hoje                                                                        | Proposta                                                                                                                                                        |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Polícias dos estados, ciclo policial e polícia militar (3 leis de 2 opções) | Uma lei, **estrutura das polícias**, com 4 opções: estaduais militares e divididas (Brasil); estaduais de ciclo completo; polícia civil única; polícia nacional |
| Pena de morte (lei solta que exige garantias penais)                        | **Opção de garantias penais**: sem pena de morte; só em guerra declarada (Brasil, que hoje falta); crimes hediondos; também tráfico                             |
| Fundo soberano e destino do resultado fiscal                                | Uma lei: **o que fazer com a sobra** (pagar dívida, guardar, fundo no exterior, investir em obras)                                                              |
| Escola em tempo integral (lei de 3 opções)                                  | **Alavanca** com verba, como os outros programas                                                                                                                |

### 3.4 Impostos

Imposto é faixa (alíquota), mas no Brasil a alíquota precisa de lei. A regra
1.1 ganha uma exceção: **faixa votada em lei**. Tarifa de importação e
imposto sobre transações financeiras viram alavanca, porque a
Constituição deixa o governo mudar por decreto (art. 153 §1º).

## 4. As 129 leis por área

"Hoje" é o que está nos arquivos; "No Brasil" é onde a regra mora, com a
base legal. ⚠️ marca as 39 que mudam de nível.

### Direitos civis, costumes, imigração, mídia e defesa

| Lei                          | Controle | Hoje      | No Brasil | Base                                           | Tronco                 | O que fazer                                               |
| ---------------------------- | -------- | --------- | --------- | ---------------------------------------------- | ---------------------- | --------------------------------------------------------- |
| Laicidade do Estado          | 6 opções | Emenda    | Emenda    | CF art. 19 I                                   | **mãe**                | Mãe dos costumes                                          |
| Política de imigração        | 5 opções | Ordinária | Ordinária | Lei 13.445/2017                                | **mãe**                | Mãe da imigração                                          |
| Aborto                       | 6 opções | Ordinária | Ordinária | Código Penal, arts. 124 a 128                  | —                      | Manter                                                    |
| Ações afirmativas            | 5 opções | Ordinária | Ordinária | Lei 12.711/2012                                | —                      | Manter                                                    |
| Apostas e jogos de azar      | 5 opções | Ordinária | Ordinária | Lei 14.790/2023                                | —                      | Manter                                                    |
| Eutanásia e morte assistida  | 5 opções | Ordinária | Ordinária | Código Penal, art. 121                         | —                      | Manter                                                    |
| Casamento e união civil      | 4 opções | Ordinária | Ordinária | Código Civil; Resolução CNJ 175/2013           | Laicidade do Estado    | Manter                                                    |
| Igualdade salarial de gênero | 4 opções | Ordinária | Ordinária | Lei 14.611/2023                                | Legislação trabalhista | Manter                                                    |
| Proteção de dados pessoais   | 4 opções | Ordinária | Ordinária | Lei 13.709/2018; EC 115/2022                   | Liberdade de imprensa  | Manter                                                    |
| Regulação das redes sociais  | 5 opções | Ordinária | Ordinária | Lei 12.965/2014                                | Liberdade de imprensa  | Manter                                                    |
| Refugiados e asilo           | 5 opções | Ordinária | Ordinária | Lei 9.474/1997                                 | Política de imigração  | Manter                                                    |
| Política de natalidade       | 6 opções | Ordinária | Ordinária | Lei 9.263/1996; CF art. 226 §7º proíbe coerção | —                      | Manter. As opções coercitivas exigem mudar a Constituição |
| Gasto com defesa             | faixa    | Orçamento | Orçamento | Orçamento                                      | Serviço militar        | Alavanca (faixa)                                          |
| Serviço militar              | 5 opções | Ordinária | Emenda ⚠️ | CF art. 143                                    | —                      | Manter; mudar para emenda. Hoje está como lei             |

### Economia, finanças e comércio exterior

| Lei                              | Controle | Hoje      | No Brasil    | Base                                           | Tronco                           | O que fazer                                                            |
| -------------------------------- | -------- | --------- | ------------ | ---------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------- |
| Acordos comerciais               | 4 opções | Emenda    | Ordinária ⚠️ | Tratados aprovados por decreto legislativo     | **mãe**                          | Mãe do comércio exterior; hoje está como emenda                        |
| Empresas estatais e privatização | 4 opções | Emenda    | Emenda       | CF arts. 170 a 173; Lei 9.491/1997             | **mãe**                          | Mãe da ordem econômica                                                 |
| Tarifas de importação            | faixa    | Ordinária | Decreto ⚠️   | CF art. 153 §1º (Executivo muda por resolução) | Acordos comerciais               | Alavanca (faixa). Faixa que o governo muda sem votação                 |
| Regulação bancária               | 4 opções | Ordinária | Ordinária    | Lei 4.595/1964; resoluções do CMN              | Autonomia do banco central       | Manter                                                                 |
| Controle de preços               | 4 opções | Ordinária | Ordinária    | Lei Delegada 4/1962                            | Defesa da concorrência           | Manter                                                                 |
| Defesa da concorrência           | 4 opções | Emenda    | Ordinária ⚠️ | Lei 12.529/2011                                | —                                | Manter; mudar para ordinária. Hoje está como emenda                    |
| Banco de desenvolvimento         | 4 opções | Emenda    | Ordinária ⚠️ | Lei 5.662/1971                                 | Empresas estatais e privatização | Manter; mudar para ordinária. Hoje está como emenda                    |
| Investimento estrangeiro         | 5 opções | Ordinária | Ordinária    | Lei 4.131/1962; CF arts. 190, 199 e 222        | —                                | Manter                                                                 |
| Política industrial              | 4 opções | Ordinária | Ordinária    | Programas por decreto e medida provisória      | —                                | Manter                                                                 |
| Controle de capitais             | 4 opções | Ordinária | Ordinária    | Lei 4.131/1962; Lei 14.286/2021                | Regime cambial                   | Manter                                                                 |
| Meta de inflação                 | 4 opções | Emenda    | Decreto ⚠️   | Decreto 3.088/1999; resoluções do CMN          | Regime cambial                   | Manter; mudar para decreto. Hoje está como emenda; no Brasil é decreto |

### Educação, ciência e cultura

| Lei                                        | Controle | Hoje      | No Brasil    | Base                                          | Tronco                    | O que fazer                                                                             |
| ------------------------------------------ | -------- | --------- | ------------ | --------------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------- |
| Acesso ao ensino superior                  | 5 opções | Emenda    | Emenda       | CF art. 206 IV (gratuidade no ensino público) | **mãe**                   | Mãe da educação                                                                         |
| Ensino obrigatório                         | 4 opções | Ordinária | Emenda ⚠️    | CF art. 208 I; EC 59/2009                     | Acesso ao ensino superior | Manter; mudar para emenda. Hoje está como lei                                           |
| Piso de gasto em educação                  | faixa    | Orçamento | Emenda ⚠️    | CF art. 212                                   | Acesso ao ensino superior | Manter; mudar para emenda. Hoje está como verba; no Brasil é vinculação da Constituição |
| Vouchers escolares                         | 4 opções | Ordinária | Ordinária    | CF art. 213; LDB (Lei 9.394/1996)             | Acesso ao ensino superior | Manter                                                                                  |
| Avaliação das escolas                      | 4 opções | Emenda    | Decreto ⚠️   | Decreto e portarias do INEP (SAEB, IDEB)      | Ensino obrigatório        | Manter; mudar para decreto. Hoje está como emenda                                       |
| Educação domiciliar                        | 4 opções | Ordinária | Ordinária    | Sem lei (STF exige lei, RE 888.815)           | Ensino obrigatório        | Manter                                                                                  |
| Ensino técnico e profissional              | 4 opções | Ordinária | Ordinária    | Lei 13.415/2017                               | Ensino obrigatório        | Manter. Não mexe na bússola                                                             |
| Escola em tempo integral                   | 3 opções | Ordinária | Orçamento ⚠️ | Lei 14.640/2023 (programa com verba)          | Ensino obrigatório        | Alavanca (faixa). Hoje é lei de 3 opções; é programa com verba                          |
| Incentivo à cultura                        | 5 opções | Emenda    | Ordinária ⚠️ | Lei 8.313/1991                                | —                         | Manter; mudar para ordinária. Hoje está como emenda                                     |
| Investimento em pesquisa e desenvolvimento | faixa    | Orçamento | Orçamento    | Orçamento                                     | —                         | Alavanca (faixa)                                                                        |
| Piso salarial dos professores              | 4 opções | Ordinária | Ordinária    | Lei 11.738/2008                               | Piso de gasto em educação | Manter                                                                                  |
| Programa espacial e satélites              | faixa    | Decreto   | Orçamento    | Orçamento                                     | —                         | Alavanca (faixa)                                                                        |

### Instituições, Estado e sistema político

| Lei                                  | Controle | Hoje      | No Brasil       | Base                               | Tronco                      | O que fazer                                                                          |
| ------------------------------------ | -------- | --------- | --------------- | ---------------------------------- | --------------------------- | ------------------------------------------------------------------------------------ |
| Autonomia do banco central           | 3 opções | Emenda    | Complementar ⚠️ | LC 179/2021                        | **mãe**                     | Mãe da política monetária                                                            |
| Federalismo                          | 3 opções | Emenda    | Pétrea ⚠️       | CF arts. 1º e 18; art. 60 §4º I    | **mãe**                     | A forma federativa é pétrea no Brasil                                                |
| Liberdade de imprensa                | 4 opções | Emenda    | Pétrea ⚠️       | CF arts. 5º IX e 220               | **mãe**                     | Direito individual, pétrea                                                           |
| Regra fiscal                         | 4 opções | Emenda    | Complementar ⚠️ | LC 200/2023 (antes EC 95/2016)     | **mãe**                     | Mãe das finanças; teto era emenda, arcabouço é complementar                          |
| Sistema de governo                   | 4 opções | Emenda    | Emenda          | CF arts. 2º e 76                   | **mãe**                     | Mãe das instituições; muda o jogo inteiro                                            |
| Regime cambial                       | 4 opções | Emenda    | Ordinária ⚠️    | Lei 4.595/1964; Lei 14.286/2021    | Autonomia do banco central  | Manter; mudar para ordinária. Hoje está como emenda                                  |
| Estabilidade dos servidores públicos | 4 opções | Ordinária | Emenda ⚠️       | CF art. 41                         | —                           | Manter; mudar para emenda. Hoje está como lei ordinária; no Brasil é da Constituição |
| Foro privilegiado                    | 4 opções | Emenda    | Emenda          | CF arts. 102 e 105                 | Independência do Judiciário | Manter                                                                               |
| Lei anticorrupção                    | 3 opções | Ordinária | Ordinária       | Lei 12.846/2013                    | —                           | Manter. Não mexe na bússola                                                          |
| Transparência pública                | 4 opções | Emenda    | Ordinária ⚠️    | CF art. 5º XXXIII; Lei 12.527/2011 | Liberdade de imprensa       | Manter; mudar para ordinária                                                         |
| Financiamento de campanhas           | 4 opções | Ordinária | Ordinária       | Lei 9.504/1997; STF ADI 4650       | Sistema de governo          | Manter                                                                               |
| Independência do Judiciário          | 3 opções | Emenda    | Pétrea ⚠️       | CF art. 2º; art. 60 §4º III        | Sistema de governo          | Manter; mudar para pétrea. Separação dos poderes é pétrea                            |
| Reeleição do chefe do Executivo      | 4 opções | Emenda    | Emenda          | CF art. 14 §5º                     | Sistema de governo          | Manter                                                                               |
| Voto obrigatório                     | 3 opções | Ordinária | Emenda ⚠️       | CF art. 14 §1º                     | Sistema de governo          | Manter; mudar para emenda. Hoje está como lei ordinária; no Brasil é da Constituição |

### Meio ambiente, energia, agro e infraestrutura

| Lei                               | Controle | Hoje      | No Brasil    | Base                                | Tronco                           | O que fazer                                                        |
| --------------------------------- | -------- | --------- | ------------ | ----------------------------------- | -------------------------------- | ------------------------------------------------------------------ |
| Licenciamento ambiental           | 4 opções | Ordinária | Ordinária    | CF art. 225 §1º IV; Lei 15.190/2025 | **mãe**                          | Mãe do meio ambiente                                               |
| Agrotóxicos                       | 5 opções | Ordinária | Ordinária    | Lei 14.785/2023                     | —                                | Manter                                                             |
| Regime do petróleo e da mineração | 4 opções | Emenda    | Emenda       | CF arts. 176 e 177; Lei 12.351/2010 | Empresas estatais e privatização | Manter                                                             |
| Saneamento básico                 | 5 opções | Emenda    | Ordinária ⚠️ | Lei 14.026/2020                     | Empresas estatais e privatização | Manter; mudar para ordinária. Hoje está como emenda                |
| Investimento em infraestrutura    | faixa    | Orçamento | Orçamento    | Orçamento                           | —                                | Alavanca (faixa)                                                   |
| Código florestal                  | 4 opções | Ordinária | Ordinária    | Lei 12.651/2012                     | Licenciamento ambiental          | Manter                                                             |
| Energia nuclear                   | 4 opções | Ordinária | Emenda ⚠️    | CF arts. 21 XXIII, 177 V e 225 §6º  | Matriz energética                | Manter; mudar para emenda. Hoje está como lei; não mexe na bússola |
| Matriz energética                 | 4 opções | Ordinária | Ordinária    | Leis do setor elétrico e programas  | —                                | Manter                                                             |
| Precificação de carbono           | 4 opções | Ordinária | Ordinária    | Lei 15.042/2024                     | Matriz energética                | Manter                                                             |
| Reforma agrária                   | 4 opções | Ordinária | Emenda ⚠️    | CF arts. 184 a 186; Lei 8.629/1993  | —                                | Manter; mudar para emenda. Hoje está como lei                      |
| Terras indígenas                  | 4 opções | Emenda    | Emenda       | CF art. 231                         | —                                | Manter                                                             |
| Transporte público                | 4 opções | Ordinária | Ordinária    | Lei 12.587/2012                     | —                                | Manter                                                             |

### Previdência e assistência social

| Lei                                                 | Controle | Hoje      | No Brasil    | Base                                 | Tronco                                              | O que fazer                                         |
| --------------------------------------------------- | -------- | --------- | ------------ | ------------------------------------ | --------------------------------------------------- | --------------------------------------------------- |
| Pensão social para idosos e pessoas com deficiência | 4 opções | Emenda    | Emenda       | CF art. 203 V                        | **mãe**                                             | Mãe da assistência                                  |
| Sistema previdenciário                              | 4 opções | Emenda    | Emenda       | CF art. 201                          | **mãe**                                             | Mãe da previdência                                  |
| Cuidados de longa duração                           | 4 opções | Emenda    | Ordinária ⚠️ | Lei 15.069/2024                      | Pensão social para idosos e pessoas com deficiência | Manter; mudar para ordinária. Hoje está como emenda |
| Segurança alimentar                                 | 4 opções | Emenda    | Ordinária ⚠️ | Lei 11.346/2006                      | Pensão social para idosos e pessoas com deficiência | Manter; mudar para ordinária. Hoje está como emenda |
| Transferência de renda às famílias pobres           | faixa    | Orçamento | Orçamento    | Lei 14.601/2023 (programa com verba) | Pensão social para idosos e pessoas com deficiência | Alavanca (faixa)                                    |
| Programa de habitação popular                       | faixa    | Orçamento | Orçamento    | Lei 14.620/2023 (programa com verba) | —                                                   | Alavanca (faixa)                                    |
| Idade mínima de aposentadoria                       | 5 opções | Ordinária | Emenda ⚠️    | CF art. 201 §7º (EC 103/2019)        | Sistema previdenciário                              | Manter; mudar para emenda. Hoje está como lei       |
| Pensão por morte                                    | 4 opções | Ordinária | Ordinária    | Lei 8.213/1991; EC 103/2019 art. 23  | Sistema previdenciário                              | Manter                                              |
| Previdência rural                                   | 4 opções | Emenda    | Emenda       | CF arts. 195 §8º e 201 §7º II        | Sistema previdenciário                              | Manter                                              |
| Reajuste de aposentadorias e benefícios             | 5 opções | Emenda    | Emenda       | CF art. 201 §§2º e 4º                | Sistema previdenciário                              | Manter                                              |

### Saúde

| Lei                                  | Controle | Hoje      | No Brasil    | Base                           | Tronco           | O que fazer                                                                             |
| ------------------------------------ | -------- | --------- | ------------ | ------------------------------ | ---------------- | --------------------------------------------------------------------------------------- |
| Sistema de saúde                     | 5 opções | Emenda    | Emenda       | CF arts. 196 a 198             | **mãe**          | Mãe da saúde                                                                            |
| Genéricos e patentes de medicamentos | 5 opções | Ordinária | Ordinária    | Lei 9.279/1996; Lei 9.787/1999 | —                | Manter                                                                                  |
| Restrição ao tabaco e ao álcool      | 5 opções | Ordinária | Ordinária    | Lei 9.294/1996                 | —                | Manter                                                                                  |
| Farmácia popular                     | faixa    | Orçamento | Orçamento    | Orçamento                      | Sistema de saúde | Alavanca (faixa)                                                                        |
| Piso de gasto em saúde               | faixa    | Orçamento | Emenda ⚠️    | CF art. 198 §2º (EC 29/2000)   | Sistema de saúde | Manter; mudar para emenda. Hoje está como verba; no Brasil é vinculação da Constituição |
| Médicos no interior                  | 4 opções | Ordinária | Ordinária    | Lei 12.871/2013                | Sistema de saúde | Manter                                                                                  |
| Regulação dos planos de saúde        | 5 opções | Ordinária | Ordinária    | Lei 9.656/1998                 | Sistema de saúde | Manter                                                                                  |
| Política de saúde mental             | 4 opções | Emenda    | Ordinária ⚠️ | Lei 10.216/2001                | Sistema de saúde | Manter; mudar para ordinária. Hoje está como emenda                                     |
| Vacinação obrigatória                | 5 opções | Ordinária | Ordinária    | Lei 6.259/1975                 | Sistema de saúde | Manter                                                                                  |
| Vigilância epidemiológica            | faixa    | Orçamento | Orçamento    | Orçamento                      | Sistema de saúde | Alavanca (faixa)                                                                        |

### Segurança, justiça e drogas

| Lei                                          | Controle | Hoje      | No Brasil  | Base                                          | Tronco                             | O que fazer                                                                                                   |
| -------------------------------------------- | -------- | --------- | ---------- | --------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Garantias penais                             | 2 opções | Pétrea    | Pétrea     | CF art. 5º XLVII                              | **mãe**                            | Mãe da justiça penal                                                                                          |
| Lei de drogas                                | 3 opções | Ordinária | Ordinária  | Lei 11.343/2006                               | **mãe**                            | Mãe das drogas                                                                                                |
| Agência de inteligência e contrainteligência | faixa    | Decreto   | Orçamento  | Orçamento                                     | —                                  | Alavanca (faixa)                                                                                              |
| Posse e porte de armas                       | 3 opções | Ordinária | Ordinária  | Lei 10.826/2003; decretos                     | —                                  | Manter                                                                                                        |
| Câmeras corporais                            | faixa    | Decreto   | Orçamento  | Orçamento e portarias                         | —                                  | Alavanca (faixa)                                                                                              |
| Ciclo policial                               | 2 opções | Emenda    | Emenda     | CF art. 144 §§4º e 5º                         | —                                  | Juntar com Polícias dos estados, Polícia de rua militar ou civil                                              |
| Dinheiro para as polícias dos estados        | faixa    | Orçamento | Orçamento  | Lei 13.756/2018 (fundo com verba)             | —                                  | Alavanca (faixa)                                                                                              |
| Delação premiada                             | 3 opções | Ordinária | Ordinária  | Lei 12.850/2013                               | Garantias penais                   | Manter                                                                                                        |
| Excludente de ilicitude                      | 2 opções | Ordinária | Ordinária  | Código Penal, arts. 23 a 25                   | Garantias penais                   | Manter                                                                                                        |
| Interceptação telefônica e digital           | 4 opções | Ordinária | Ordinária  | CF art. 5º XII; Lei 9.296/1996                | Garantias penais                   | Manter                                                                                                        |
| Maioridade penal                             | 2 opções | Emenda    | Emenda     | CF art. 228                                   | Garantias penais                   | Manter                                                                                                        |
| Pena de morte                                | 2 opções | Ordinária | Pétrea ⚠️  | CF art. 5º XLVII a (só em guerra declarada)   | Garantias penais                   | Virar opção de Garantias penais. Vira opção da mãe; falta a opção do Brasil: só em guerra                     |
| Tempo de prisão                              | 3 opções | Ordinária | Ordinária  | Código Penal; Lei 7.210/1984; Lei 13.964/2019 | Garantias penais                   | Manter                                                                                                        |
| Poderes da polícia na investigação           | 3 opções | Ordinária | Ordinária  | Lei 12.850/2013                               | Garantias penais                   | Manter                                                                                                        |
| Câmeras e reconhecimento facial              | 4 opções | Ordinária | Decreto ⚠️ | Sem lei; portarias e contratos                | Interceptação telefônica e digital | Manter; mudar para decreto                                                                                    |
| Maconha legal e regulada                     | 3 opções | Ordinária | Ordinária  | Sem lei (proibida)                            | Lei de drogas                      | Manter. Já é filha                                                                                            |
| Vagas em presídios                           | faixa    | Orçamento | Orçamento  | Orçamento                                     | Tempo de prisão                    | Alavanca (faixa)                                                                                              |
| Polícia de rua militar ou civil              | 2 opções | Emenda    | Emenda     | CF art. 144 §6º                               | —                                  | Juntar com Polícias dos estados, Ciclo policial                                                               |
| Polícias dos estados                         | 2 opções | Pétrea    | Emenda ⚠️  | CF art. 144                                   | —                                  | Juntar com Ciclo policial, Polícia de rua militar ou civil. Hoje marcada como pétrea; o art. 144 não é pétreo |
| Lei contra a violência doméstica             | 4 opções | Ordinária | Ordinária  | Lei 11.340/2006                               | —                                  | Manter                                                                                                        |
| Verba da Polícia Federal                     | faixa    | Decreto   | Orçamento  | Orçamento                                     | —                                  | Alavanca (faixa)                                                                                              |

### Trabalho e emprego

| Lei                                          | Controle | Hoje      | No Brasil    | Base                                     | Tronco                 | O que fazer                                                                     |
| -------------------------------------------- | -------- | --------- | ------------ | ---------------------------------------- | ---------------------- | ------------------------------------------------------------------------------- |
| Legislação trabalhista                       | 4 opções | Ordinária | Ordinária    | CLT (Decreto-Lei 5.452/1943); CF art. 7º | **mãe**                | Mãe do trabalho                                                                 |
| Fundo de garantia e indenização por demissão | 4 opções | Ordinária | Ordinária    | CF art. 7º III; Lei 8.036/1990           | Legislação trabalhista | Manter                                                                          |
| Jornada de trabalho                          | 5 opções | Ordinária | Emenda ⚠️    | CF art. 7º XIII (44 horas)               | Legislação trabalhista | Manter; mudar para emenda. Hoje está como lei                                   |
| Licença parental                             | 4 opções | Ordinária | Emenda ⚠️    | CF art. 7º XVIII e XIX                   | Legislação trabalhista | Manter; mudar para emenda. Hoje está como lei                                   |
| Negociação coletiva e sindicatos             | 4 opções | Emenda    | Emenda       | CF art. 8º                               | Legislação trabalhista | Manter                                                                          |
| Salário mínimo                               | 4 opções | Ordinária | Emenda ⚠️    | CF art. 7º IV; valor por lei             | Legislação trabalhista | Manter; mudar para emenda. Hoje está como lei; o piso existir é da Constituição |
| Seguro-desemprego                            | 5 opções | Emenda    | Ordinária ⚠️ | CF art. 7º II; Lei 7.998/1990            | Legislação trabalhista | Manter; mudar para ordinária. Hoje está como emenda                             |
| Terceirização                                | 4 opções | Ordinária | Ordinária    | Lei 13.429/2017                          | Legislação trabalhista | Manter                                                                          |
| Trabalho infantil e aprendizagem             | 5 opções | Ordinária | Emenda ⚠️    | CF art. 7º XXXIII                        | Legislação trabalhista | Manter; mudar para emenda. Hoje está como lei                                   |
| Trabalho por aplicativo                      | 4 opções | Ordinária | Ordinária    | Sem lei (projeto em tramitação)          | Legislação trabalhista | Manter                                                                          |
| Redução de jornada subsidiada (lay-off)      | 3 opções | Emenda    | Ordinária ⚠️ | Lei 14.020/2020                          | Seguro-desemprego      | Manter; mudar para ordinária. Hoje está como emenda                             |

### Tributação

| Lei                                                   | Controle | Hoje      | No Brasil    | Base                                        | Tronco            | O que fazer                                                                     |
| ----------------------------------------------------- | -------- | --------- | ------------ | ------------------------------------------- | ----------------- | ------------------------------------------------------------------------------- |
| Modelo tributário                                     | 5 opções | Emenda    | Emenda       | CF arts. 145 a 162; EC 132/2023             | **mãe**           | Mãe da tributação                                                               |
| Imposto sobre grandes fortunas                        | faixa    | Ordinária | Complementar | CF art. 153 VII (nunca regulamentado)       | Modelo tributário | Faixa votada em lei                                                             |
| Imposto sobre herança e doações                       | faixa    | Ordinária | Ordinária    | CF art. 155 I; teto por resolução do Senado | Modelo tributário | Faixa votada em lei. Estadual no Brasil                                         |
| Imposto sobre imóveis urbanos e rurais                | faixa    | Ordinária | Ordinária    | CF arts. 153 VI e 156 I                     | Modelo tributário | Faixa votada em lei. Municipal e federal no Brasil                              |
| Imposto de renda das empresas                         | faixa    | Ordinária | Ordinária    | Lei 9.249/1995                              | Modelo tributário | Faixa votada em lei                                                             |
| Imposto de renda da pessoa física                     | faixa    | Ordinária | Ordinária    | Lei 7.713/1988                              | Modelo tributário | Faixa votada em lei                                                             |
| Imposto seletivo (tabaco, álcool, açúcar e poluentes) | 4 opções | Ordinária | Complementar | EC 132/2023; LC 214/2025                    | Modelo tributário | Manter                                                                          |
| Imposto sobre consumo (IVA)                           | faixa    | Ordinária | Complementar | EC 132/2023; LC 214/2025                    | Modelo tributário | Manter. Não mexe na bússola                                                     |
| Imposto sobre transações financeiras                  | faixa    | Ordinária | Decreto ⚠️   | CF art. 153 §1º (IOF por decreto)           | Modelo tributário | Alavanca (faixa). Hoje está como lei                                            |
| Incentivos fiscais regionais                          | 4 opções | Ordinária | Emenda ⚠️    | ADCT art. 40 (Zona Franca); leis dos fundos | Modelo tributário | Manter; mudar para emenda. Hoje está como lei                                   |
| Regime simplificado para pequenas empresas            | 4 opções | Ordinária | Complementar | LC 123/2006                                 | Modelo tributário | Manter. Não mexe na bússola                                                     |
| Tributação de dividendos                              | faixa    | Ordinária | Ordinária    | Lei 9.249/1995, art. 10                     | Modelo tributário | Faixa votada em lei                                                             |
| Destino do resultado fiscal                           | 3 opções | Ordinária | Ordinária    | LDO de cada ano                             | Regra fiscal      | Juntar com Uso do cofre (fundo soberano)                                        |
| Uso do cofre (fundo soberano)                         | 4 opções | Ordinária | Ordinária    | Lei 11.887/2008                             | Regra fiscal      | Juntar com Destino do resultado fiscal. As duas decidem o que fazer com a sobra |

## 5. Perguntas para você

1. **O nível mora no país** (seção 3.1), com o caminho real do Brasil e a
   base legal? Recomendo.
2. **Juntar as três polícias e transformar a pena de morte em opção**
   (seção 3.3)? Recomendo.
3. **Os 18 troncos** (seção 3.2) servem para o mapa e o tablet? Recomendo, e
   as leis novas da reestruturação entram penduradas neles.
