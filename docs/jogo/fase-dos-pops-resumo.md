# Fase dos pops: resumo (15/nov/2026)

Pedido do autor: fechar o motor dos pops antes de revisar as leis, com ele pronto para receber ou
abrir as tomadas que as leis vão ligar. São 15 commits, de 95261171 a ad944dbf. Cada passo tem as
regras no `src/motor/populacao/populacao.md` (e nos `.md` de grupos e organizações) e no GDD
(2.1, 2.3, 2.6, 2.7, 2.8 e 2.9).

---

## Em palavras simples

Antes desta fase, o povo do jogo era uma planilha parada: cada tipo de pessoa ficava com uma fatia
fixa do PIB, e quase nenhuma lei chegava à vida de alguém. Agora:

- **Cada um ganha de onde ganha de verdade.** O operário ganha do salário da fábrica, o
  empresário do lucro, o policial do Estado, a doméstica das famílias que a contratam, o
  aposentado da aposentadoria e o desempregado do seguro e da família. Se a fábrica cresce, o
  operário ganha mais. Se o governo corta a verba, o servidor perde.
- **A corrupção vira dinheiro no bolso de alguém** (altos funcionários e quem tem contrato com o
  Estado), e não some.
- **Quem estuda ou muda de ofício vai para onde paga mais.** O eletricista que abre a oficina
  vira dono de negócio.
- **Desemprego de verdade.** Quando a economia encolhe, falta vaga e a pessoa vai para os
  desempregados devagar. Se existir seguro-desemprego, ela vive dele por um tempo.
- **O padrão de vida de cada um.** O motor conta o que sobra depois de comida e remédio, desconta
  a inflação e soma o valor da saúde e do saneamento que a pessoa recebe. Ele começa em 50 para
  todo mundo; abaixo de 50 é vida pior que no começo do mandato.
- **Crianças e família.** As crianças vivem dos pais, o pobre tem mais filhos, as pessoas
  envelhecem e se aposentam.
- **Os 27 estados.** Cada estado tem a sua gente, mais rural ou mais urbana.
- **Quando a vida aperta, as pessoas reagem:**
  - saem da carteira assinada e vão para o informal quando a lei encarece a folha;
  - emigram quando o padrão cai (o rico e o estudado saem primeiro);
  - os ricos tiram o dinheiro do país, que deixa de pagar imposto e de virar investimento aqui.
- **Radicais.** Nascem quando a vida piora, não quando ela é ruim. Quem sempre viveu mal não
  vira radical por isso; quem viu a vida cair, sim. Se a vida fica ruim muito tempo, a pessoa se
  acostuma e esfria devagar. Perder um direito também radicaliza.
- **Organizações.** Quando há radicais demais por alguns meses seguidos, nasce uma organização com
  nome inventado: uma marcha, um grupo armado de esquerda, uma milícia ou um grupo ambiental
  radical. Ela nasce no estado onde esses radicais pesam mais, cresce, racha quando a polícia pega
  os chefes e acaba quando perde gente. Ela aparece no jornal e piora segurança e polarização.
- **O país começa parado.** Sem lei nenhuma, ninguém perde, ninguém se radicaliza e nenhuma
  organização nasce. Tudo o que muda é culpa (ou mérito) do jogador.

O que ainda não acontece: quase nenhuma lei liga essas tomadas. O motor está pronto para receber;
a revisão das leis é que vai dizer, lei por lei, onde ela liga.

---

## Técnico

### Os passos

| Passo | Commit | O que entrou |
|---|---|---|
| A | 95261171 | 31 tipos de pop no conteúdo (`pops.json`); Crianças vieram no E |
| B1 | 8e7bcabb | Renda por fonte (`fontesDaRenda`): salário e lucro de setor, salário do Estado (`publico`), pago por outros (`pago_por`); a soma continua o PIB |
| B2 | 9aa66e4c | Desvio: verba × corrupção × 0,3 vira renda dos pops com `desvio` |
| B3 | 4aa87186 | Transferência a um pop só (`para: { pop }`): aposentadoria, bolsa; família e bico; Brasil com 12% de aposentados |
| B4 | 6a67aeb9 | `divisao`: aposentados e estudantes com pobre, médio e rico por dentro; imposto e transferência pegam cada pedaço |
| B5 | 2641cb6f | `muda`: troca na mesma faixa quando o destino melhorou 5% a mais |
| C | a162a0a2 | Vagas pela capacidade dos setores, desemprego que anda devagar, seguro pelas leis de valor e duração |
| D | c1fc4b16 | `fatia` da cesta por estrato; `poder` e `padrao` (1 a 99, 50 = turno 0); fome pela renda espalhada ±50% |
| E | 4d9061ad | Crianças dependentes, `filhos` por estrato, a casa (`comFamilia`), ciclo da vida |
| F | 583b4baf | `Territorio` e `popsPorTerritorio`; 27 UFs em `estados.json`; campo segue a parte rural |
| G | 77e431c7 | `saida.ts`: informal, emigrar, dinheiro para fora; `tomada()` genérica; bases com `foge` |
| H | e5a2fd8b | `servicos.ts`: cobertura por pop e valor no `poder`; `direito` por pop |
| I1 | bd59c9c6 | Radicais pela piora contra o costume (`pioraDosPops`, `Estado.costume`) |
| I2 | b9bd36d6 | `motor/organizacoes`: moldes, nascer, crescer, rachar, acabar, ameaça, fatos |
| Conserto | ad944dbf | Fontes em parte do PIB × PIB nominal (`FontesDaRenda.neutro`) |

### As tomadas (o que as leis podem ligar)

A tomada é a soma de `valores[chave]` das leis em vigor (`leis/valor.ts › tomada`). Na lei de
opções vale o número da opção; na régua (contínua), o número × a posição na faixa. O motor só
conhece a chave.

| Tomada | Onde age | Quem liga hoje |
|---|---|---|
| `informal` | parte dos formais que o custo da folha tira da carteira | Seguro na folha |
| `trava_emigrar` | segura a emigração (0 a 1) | ninguém (Imposto de saída e Taxa para formados, na revisão) |
| `trava_dinheiro` | segura o dinheiro que sai (0 a 1) | Controle de capital (0,6) |
| `calma` | baixa o alvo dos radicais (0 a 1) | ninguém |
| `repressao` | corta a gente das organizações e cria radicais em quem as alimenta | ninguém |
| `inteligencia` | chance de pegar os chefes, e a organização racha | ninguém |
| chaves de direito | `TipoPop.direitos` × a tomada → `Pop.direito` (−1 a 1) | ninguém |

Além das tomadas, já chegam ao pop: o imposto de renda e o imposto por estrato, a transferência
por estrato e por pop, a verba que paga salário do Estado, o seguro-desemprego, a verba de saúde e
saneamento (pelo índice que ela move) e os preços (pela cesta).

### As contas principais

- **Renda:** pop = Σ parte da fonte × índice da fonte, normalizado para a soma dar o PIB.
  - Salário e lucro de setor são nível (capacidade × preços).
  - Estado, desvio, pago por outros e quem não tem fonte são parte do PIB × PIB nominal ÷ o do
    turno 0.
- **Padrão de vida:** `poder` = renda × (1 − parte gasta nas cestas) ÷ preços + Σ cobertura ×
  valor do serviço; `padrao` = 50 × poder ÷ poder do turno 0.
- **Piora:**
  - para o pop: (costume − padrão) ÷ costume, mais 0,25 × o direito perdido;
  - o costume anda 2% do caminho por turno até a vida de hoje;
  - para o grupo: a média dos membros, pesada pela gente de cada pop.
- **Radicais:** o alvo é 5 + piora em pontos × (1 − calma), e a parte anda no máximo 1 ponto por
  turno. Os lealistas seguem pela satisfação.
- **Emigrar:**
  - o alvo é o teto (pobre 2%, médio 5%, rico 10%, ou o `emigra` do pop) × piora contra 50 × (1 −
    trava);
  - a parte fora anda 5% do caminho por turno;
  - a população do turno seguinte é multiplicada pelo `fator`.
- **Organizações:**
  - quem entra: os radicais acima de 5%, atraídos pela parecença na bússola (e só grupos com
    `armas` nos moldes armados), × a adesão;
  - nascer: 4 turnos seguidos acima de 0,5% da população;
  - onde: o estado de maior proporção desses radicais;
  - ameaça: gente ÷ população × 1 (armado) ou 0,05 (sem armas), em quatro níveis.

### Medido no Brasil, sem lei, em 4 anos

- Padrão de vida de todos os pops entre 52 e 57; o PIB real por pessoa cresce 6%.
- Radicais em 5% (a base) em 15 dos 16 grupos; Donos de terra em 6,3%.
- Nenhuma organização; população estável.
- 1127 testes; o `npm run check` passou, menos 10 arquivos de `scripts/icones-leis` que já
  estavam fora do formato antes.

---

## O pops está pronto?

**Para receber as leis, sim.** Toda chegada que o GDD pede ao pop tem lugar no motor: renda,
emprego, preço, serviço, direito, saída, radicais e organização. O país começa parado.

**Para o jogo, ainda não.** O que falta, por ordem de peso:

1. **As leis ligarem as tomadas.** Quase nenhuma liga ainda. É o próximo passo combinado, a
   revisão lei por lei.
2. **A opinião pelo bolso (GDD 2.4).** A satisfação dos grupos ainda lê renda, índices e o ponto
   da lei na bússola. Ela não lê o padrão de vida do pop, nem o serviço, nem o direito. O GDD diz
   que o bolso é o mais forte; hoje ele só entra pela renda.
3. **Ninguém lê os radicais nem as organizações**, além dos índices que elas mexem. O voto, o
   Congresso e os eventos ainda ignoram esses números.
4. **A tela não mostra nada disso.** Nenhuma ficha mostra o padrão de vida, a gente fora do país,
   os radicais ou as organizações. Só o jornal anuncia as organizações.
5. **O conteúdo está atrás do GDD:** 16 grupos contra 25, e falta os dados dentro do pop
   (escolaridade, vínculo; R11.8). Sem os grupos religiosos e regionalistas, os moldes
   Extremistas religiosos e Separatistas não entram.
6. **Calibração do fim:**
   - a fome do Brasil no começo está em 1,7%, contra cerca de 9% na vida real;
   - o imposto do rico quase não mexe no padrão de vida dele;
   - o índice Atendimento sobe de 30 a 40 sem lei;
   - dobrar a verba da saúde custa mais do que rende;
   - o espalho de ±50% da renda dentro do pop é estreito;
   - os pesos dos serviços (8% e 3%) são chutados.
7. **Fora desta fase, de propósito:**
   - o crime organizado (espera Segurança e Vícios);
   - igrejas e sindicatos como atores;
   - financiamento e rastro;
   - virar partido e presos com nome;
   - os estados com economia própria (hoje toda organização urbana nasce no estado mais urbano);
   - a inteligência ainda usa sorte, e a troca por pistas que se acumulam está no "Em aberto" do
     GDD 2.7.
