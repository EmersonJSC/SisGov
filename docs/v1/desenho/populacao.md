# Segmentos do eleitorado e perfis sintéticos (V1-08)

**Status:** APROVADO pelo autor em 12/out (decisões na seção 8).

## 1. O que existe hoje (medido em 12/out)

- **11 grupos** (`grupo_*`, tipo `grupo`, 0 a 100 = satisfação): pobres,
  classe média, trabalhadores, servidores, empresários, pequenos negócios,
  agro, aposentados, jovens, progressistas, conservadores.
- **799 ligações chegam neles:** 458 de leis, 299 de ocorrências e 42 de
  índices. A lista com mais ligações é a dos progressistas (111); a com menos,
  aposentados (37).
- **Aprovação = média fixa dos grupos.** São 11 ligações `afim` para
  `popularidade_governo`, com pesos que somam 1 (pobres 0,18, trabalhadores
  0,18, classe média 0,14 … empresários 0,03). Os pesos foram escritos à mão,
  sem fonte. No turno 0, 51,4.
- **4 perfis eleitorais** em `politica.json` ("Trabalho e cuidado" etc.),
  com preferência por 3 partidos fictícios. Servem à eleição (V1-12), não à
  aprovação.

Problema: uma pessoa real é pobre **e** evangélica **e** da periferia ao
mesmo tempo. Hoje cada grupo conta separado, e o peso de cada um não vem de
dado nenhum.

## 2. Métodos atuais

**População sintética por ajuste proporcional iterativo (IPF, ou raking).**
É o método padrão para montar uma população a partir de totais conhecidos
(Deming e Stephan 1940; usado em microssimulação urbana e de transporte,
por exemplo no PopulationSim). Parte de uma tabela cruzada inicial e ajusta
os pesos, um eixo por vez, até cada total bater com a fonte (renda pela PNAD,
religião pelo Censo 2022 etc.). Converge em poucas dezenas de voltas. Quando
há uma tabela cruzada real (por exemplo, religião × renda do Censo), ela
entra como restrição e o IPF respeita a correlação.

**Opinião por perfil (MRP, regressão multinível com pós-estratificação).**
Gelman e Little (1997); Wang et al. (2015) previram a eleição americana a
partir de uma amostra enviesada do Xbox. A ideia que importa aqui: estimar a
opinião de cada célula (perfil) e somar pelos pesos da população. No jogo, a
"regressão" é a própria rede: a satisfação do perfil sai dos segmentos dele,
e a aprovação é a soma pelos pesos.

**Aprovação como proporção que aprova.** Pesquisa de aprovação mede a
**porcentagem que aprova**, não uma média de notas. Um perfil com
satisfação 55 não "aprova 55%": a maioria dele aprova. A forma usual é uma
curva logística por perfil (modelos de escolha binária; também a base do
voto econômico, Lewis-Beck e Stegmaier 2000). Isso dá um efeito real: um
governo que agrada pouco a muitos tem aprovação diferente de um que agrada
muito a poucos.

## 3. Proposta

### 3.1 Os 20 segmentos

Os de `conteudo.md` 3.1, como variáveis do tipo `grupo` (satisfação 0 a 100,
exatamente como hoje). Os 11 atuais viram 11 dos 20, com o mesmo id e as
mesmas ligações:

| Hoje | Vira |
| --- | --- |
| pobres, classe média | Pobres, Classe média |
| trabalhadores | Trabalhadores com carteira |
| servidores, empresários | Servidores públicos, Empresários |
| pequenos negócios | Pequenos empreendedores |
| agro | Agronegócio |
| aposentados, jovens | Aposentados, Jovens |
| progressistas, conservadores | Progressistas, Conservadores |

**Novos (9):** Ricos; Informais e de aplicativo; Agricultura familiar;
Famílias com filhos; Evangélicos; Católicos; Ambientalistas; Periferias das
metrópoles; Interior. As ligações deles estão na seção 4.

### 3.2 Perfis sintéticos

Cada perfil é uma combinação de **atributos** com um **peso** (fração do
eleitorado). Atributos e de onde vem cada total:

| Atributo | Valores | Fonte dos totais |
| --- | --- | --- |
| Renda | pobre, média, rica | PNAD Contínua (renda domiciliar per capita) |
| Ocupação | carteira, informal, servidor, empresário, pequeno empreendedor, agro patronal, agricultura familiar, aposentado, fora da força de trabalho | PNAD Contínua; Censo Agropecuário |
| Idade | 16–29, 30–59, 60+ | TSE (eleitorado por idade) |
| Filhos | com filhos menores, sem | PNAD Contínua |
| Religião | evangélica, católica, outra ou nenhuma | Censo 2022 |
| Valores | progressista, centro, conservador | pesquisas de opinião (Datafolha, Quaest), com fonte e data |
| Ambientalista | sim, não | pesquisas de opinião (prioridade ao meio ambiente) |
| Território | periferia metropolitana, resto da metrópole, interior | Censo 2022 |

O produto completo passa de 40 mil células. A geração faz assim:

1. Começa da tabela cruzada uniforme, mais as cruzadas reais que existirem
   (renda × ocupação × idade da PNAD; religião × renda do Censo).
2. Ajusta por IPF até cada total bater (erro abaixo de 0,1 ponto).
3. Corta os perfis com peso abaixo de 0,05% e renormaliza. Sobram algumas
   centenas.
4. Grava o resultado em `paises/<pais>/perfis.json`, gerado por script
   (`npm run populacao:gerar`), com a fonte de cada total. O jogo só lê o
   arquivo; o IPF não roda na carga.

**Pertencimento:** cada atributo põe o perfil em segmentos. "Pobre,
informal, evangélica, periferia, com filhos, 30–59" está em Pobres,
Informais, Evangélicos, Periferias e Famílias com filhos. Um perfil pode não
estar em nenhum segmento de um eixo (religião "outra", valores "centro").

### 3.3 Satisfação do perfil e aprovação

**Satisfação do perfil** = média dos segmentos dele, ponderada pelo peso do
eixo (quanto aquele recorte pesa no voto):

| Eixo | Peso proposto |
| --- | --- |
| Renda | 3 |
| Ocupação | 3 |
| Valores | 2 |
| Religião | 1,5 |
| Território | 1 |
| Idade e família | 1 |
| Ambientalista | 1 |

Os pesos ficam no `mundo` (iguais para todo país) e entram na sensibilidade
do V1-07 como fatores.

**Aprovação** = soma, pelos pesos dos perfis, da chance de aprovar:
`aprova(perfil) = 1 / (1 + e^(−(satisfação − 50) / k))`, com `k` calibrado
para que o Brasil de jan/2025 dê a aprovação real (seção 5). Com `k` grande,
a curva vira uma reta, que é o modelo de hoje (média).

**No motor:** um mecanismo novo, `perfis`, no nó `popularidade_governo`. Ele
lê os 20 segmentos, aplica a fórmula acima com os perfis do país e entrega
um número. Ele substitui as 11 ligações `afim` de hoje. Custo: algumas
centenas de perfis × 20 segmentos por mês, o que é desprezível perto do
turno (~25 ms).

## 4. Migração das ligações

- **Os 11 que ficam:** mesmas 799 ligações, mesmo id. Só o nome muda.
- **Os 9 novos começam com regras escritas, uma por linha, para você
  revisar:**

| Segmento | Recebe de |
| --- | --- |
| Ricos | as leis de imposto progressivo (fortunas, herança, dividendos, IR) com o sinal das ligações dos empresários; risco país, juros |
| Informais e de aplicativo | trabalho por aplicativo, legislação trabalhista, transferência de renda; desemprego, informalidade, renda |
| Agricultura familiar | reforma agrária, previdência rural, segurança alimentar, agrotóxicos; produção agro, estiagem |
| Famílias com filhos | escola em tempo integral, licença parental, transferência de renda, política de natalidade; aprendizagem, preço dos alimentos |
| Evangélicos | as leis de costumes (aborto, drogas, casamento, educação domiciliar, laicidade) com o sinal dos conservadores |
| Católicos | as mesmas leis de costumes com metade do peso; pobreza |
| Ambientalistas | as leis ambientais e de energia com o sinal dos progressistas; desmatamento, emissões, queimadas |
| Periferias das metrópoles | polícia, câmeras, transporte público, habitação; violência letal, mobilidade, saneamento |
| Interior | infraestrutura de transportes, incentivos regionais, médicos no interior; produção agro, desigualdade regional |

  Cada regra vira um arquivo de consequência gerado por script, com o
  coeficiente copiado do segmento de origem. Nas leis de costumes, por
  exemplo, a ligação dos Evangélicos copia a dos Conservadores. As
  ocorrências (eventos e dilemas) entram na revisão de conteúdo do V1-14 em
  diante.
- **Os 4 perfis eleitorais antigos ficam** até a eleição nova (V1-12). A
  preferência por partido continua vindo deles nesse meio tempo.

## 5. Calibragem

- **Aprovação inicial.** Alvo de jan/2025: a pergunta "aprova ou desaprova"
  (Quaest, jan/2025: cerca de 47% aprova). O teste aceita de 44 a 50. A
  alternativa é "ótimo ou bom" (Datafolha, dez/2024: 35%), que é outra
  pergunta. Recomendo a primeira, porque o índice já se chama "aprovação".
- **Por segmento.** As pesquisas publicam a aprovação por renda, religião,
  idade e região. Esses números viram a satisfação inicial de cada segmento
  (pelo contexto, como hoje) e a série de comparação do `rede:calibrar`.
- **`k`** é ajustado por busca simples até a aprovação de jan/2025 bater.

## 6. Tela

O painel de grupos passa a ter os 20, agrupados pelos 6 eixos. Ao abrir um
segmento, aparecem quanto do eleitorado ele é (a soma dos perfis em que
entra) e as leis que mais o movem. A primeira página do jornal continua com
o humor dos segmentos, agora os 20.

## 7. Aceite (do chamado, com o que o teste confere)

- Soma dos pesos dos perfis = 100% (erro < 0,01%).
- Lei que agrada um segmento sobe a satisfação dele no turno certo: por
  exemplo, subir a escola em tempo integral sobe Famílias
com filhos no atraso da ligação.
- Aprovação inicial do Brasil entre 44 e 50.

## 8. Decisões para você

1. **Aprovação por curva (logística) ou média (como hoje)?** Recomendo a
   curva: ela dá a porcentagem que aprova, como a pesquisa mede.
   *(A curva mesmo, media e simples de mais)*
2. **Pesos dos eixos** da seção 3.3: servem como ponto de partida? *(Isso, pode ser esse o ponto de partida)*
3. **Alvo de aprovação:** "aprova" (47%) ou "ótimo/bom" (35%)? Recomendo
   "aprova". *(CCERTO)*
4. **Regras dos 9 segmentos novos** (seção 4): alguma linha errada ou
   faltando? *(Nenhuma)*

## Fontes

- Deming, W. E.; Stephan, F. F. (1940). *On a least squares adjustment of a
  sampled frequency table when the expected marginal totals are known.*
  Annals of Mathematical Statistics 11(4).
- PopulationSim (RSG/ActivitySim): síntese de população por IPF com
  restrições em vários níveis. <https://activitysim.github.io/populationsim/>
- Gelman, A.; Little, T. C. (1997). *Poststratification into many categories
  using hierarchical logistic regression.* Survey Methodology 23(2).
- Wang, W.; Rothschild, D.; Goel, S.; Gelman, A. (2015). *Forecasting
  elections with non-representative polls.* International Journal of
  Forecasting 31(3).
- Lewis-Beck, M. S.; Stegmaier, M. (2000). *Economic determinants of
  electoral outcomes.* Annual Review of Political Science 3.
- IBGE: PNAD Contínua; Censo Demográfico 2022 (religião, território). TSE:
  estatísticas do eleitorado.
