# Ciclos entre programas: segurança, prisões e saúde

**Status:** EM REVISÃO (17/out/2026). Estudo de desenho; não altera o jogo nem
fecha o V1-14. A fonte do inventário é `tabela-leis.xlsx`, fornecida pelo autor
em `/home/emerson_costa/Downloads/` (aba `Leis`). Para as fichas mais recentes
da área, conferir também `docs/v1/desenho/leis/leis-07.md` (15/out).

## Escopo do levantamento

A tabela tem 253 leis, 179 nomes distintos de programas e 563 associações
lei–programa. São 97 programas com leis de mais de uma área. O nome de um
programa descreve um **pacote de escolhas**, não uma nova lei nem, por si só,
um minijogo. Uma lei pode estar em vários pacotes e pedir valores opostos.

Para cada programa, a revisão precisa seguir esta sequência:

1. Conferir o significado de cada opção da lei e se `pede alto/baixo` aponta
   para a opção pretendida. Comparar a tabela com a ficha recente.
2. Separar efeitos diretos da lei dos efeitos transmitidos por índices e de
   relações ainda hipotéticas. Registrar sinal, atraso, custo e fonte.
3. Encontrar os estoques e fluxos compartilhados com outros programas.
4. Só chamar de ciclo jogável quando houver necessidade que evolui no tempo,
   escolhas com efeitos distintos, retorno e consequência legível ao jogador.

## Primeiro conjunto de programas que se cruzam

| Programa da tabela | Escolhas que ligam o conjunto | Principal tensão a estudar |
| --- | --- | --- |
| Gestão por resultados na segurança | coordenação policial, policiamento por dados, verba, transparência | Menos crime depende de capacidade e destino da verba; patrulha direcionada não equivale a prender indiscriminadamente. |
| Polícia de proximidade | câmeras corporais, modelo da polícia de rua, policiamento por dados, verba | Crime, letalidade policial e confiança podem andar em ritmos diferentes. |
| Prevenção social da violência | escola integral, jovens em risco, penas alternativas, policiamento, verba | Custo imediato e redução de violência com atraso; os efeitos exigem escola e serviços funcionando. |
| Tolerância zero / Prisão longa para reincidentes / Mão firme contra facções | penas, poderes policiais, regimes especiais, vagas | Mais entradas ou maior permanência nas prisões podem superar a construção de vagas. |
| Guerra às drogas / Drogas como questão de saúde / Redução de danos | lei de drogas, tratamento, penas alternativas, saúde mental | Esses programas pedem configurações diferentes da lei de drogas; a escolha penal altera demanda prisional, e a escolha sanitária requer capacidade de atendimento. |
| Presídio que ressocializa | penas alternativas, ensino técnico, gestão prisional | Lotação e oferta real de educação/trabalho condicionam a reintegração. |

Esses pacotes partilham leis e indicadores; não devem ser balanceados de modo
isolado. Por exemplo, `Penas e progressão de regime` aparece em oito programas
da tabela, alguns pedindo alto e `Presídio que ressocializa` pedindo baixo.

## Ciclo proposto: segurança, custódia e saúde

```text
prevenção + investigação + policiamento → crimes e prisões por período
penas + lei de drogas + alternativas → entradas e tempo de permanência
entradas − saídas → pessoas presas
investimento com prazo → vagas disponíveis
pessoas presas ÷ vagas → lotação
lotação → condições de custódia, reintegração e demanda de saúde prisional
reintegração → reincidência → crimes e novas entradas, com atraso
pessoas presas + vagas + equipes de saúde → gasto público → espaço fiscal
```

É um **desenho causal**, não uma fórmula validada. `Pessoas presas`, `vagas`
e `demanda de saúde prisional` precisariam existir como quantidades separadas;
hoje a planilha só tem `lotacao_prisional` como índice (`Índices`, linha 106)
e as ligações do jogo não incluem saída dela para saúde.
Portanto, aumentar vagas pode reduzir lotação, mas não apaga o custo de cuidar
de mais pessoas presas. A demanda de saúde depende do número de pessoas e das
condições de custódia, não apenas da razão presos/vaga.

As relações com saúde devem ser específicas: atendimento prisional,
doenças transmissíveis, saúde mental e continuidade do cuidado após a saída.
Não ligar automaticamente lotação a `saude_populacao` (expectativa de vida do
país), pois a escala do indicador esconde o mecanismo. A [Senappen descreve a
assistência no SUS para pessoas privadas de liberdade](https://www.gov.br/senappen/pt-br/acesso-a-informacao/politicas-acoes-e-programas/politicas-penais/saude/saude-no-sistema-prisional).
A [OMS relaciona superlotação e infraestrutura prisional ao risco de transmissão
de tuberculose](https://www.who.int/teams/global-programme-on-tuberculosis-and-lung-health/tb-reports/global-tuberculosis-report-2023/featured-topics/tb-in-prisons).

O retorno entre encarceramento e crime também não deve ser uma seta fixa: a
[revisão das Academias Nacionais dos EUA](https://www.nationalacademies.org/read/18613/chapter/15)
encontra efeito marginal menor de encarceramento sobre crime quando a população
presa cresce. Para patrulhamento em locais de alta incidência, a
[revisão Campbell](https://www.campbellcollaboration.org/review/effects-of-hot-spots-policing-on-crime/)
encontra redução pequena de crime, sem autorizar atribuir o mesmo efeito a toda
forma de policiamento.

## Divergências que impedem usar o pacote como está

| Linha da aba `Leis` | Divergência | Consequência para o estudo |
| --- | --- | --- |
| 229, `Repressão às drogas` | `Guerra às drogas` pede **alto**, mas a opção 0 prende o usuário e a 100 trata o uso como saúde. `leis-07.md` descreve também opções intermediárias. | Conciliar cada programa com a opção exata antes de calcular efeitos; alto/baixo não bastam para representar todas as escolhas. |
| 211, `Garantias do acusado` | Pacotes punitivos pedem **baixo**, mas a opção 0 proíbe pena de morte e a 100 a permite. O estudo recente propõe juntar garantias e pena de morte numa lei com outras opções. | Há divergência de configuração entre a tabela e a ficha recente; conferir a intenção do pacote antes de calcular. |
| 224, `Presídio que ressocializa` | O controle 0–100 escolhe **quem administra a prisão**, não quanto ela ressocializa. A tabela atribui efeito à educação e ao trabalho; `leis-07.md` diz que falta efeito medido da **gestão** sobre reincidência. | Separar gestão, oferta de educação/trabalho e resultado de reintegração. |
| 222, `Polícia de rua militarizada` | `Forças Armadas contra o crime` pede **alto**, mas 0 é polícia militar e 100 é polícia civil. | Conferir direção antes de associar militarização ao pacote. |

Há ainda uma diferença entre os documentos: a planilha chama a alavanca de
`Verba da segurança pública`; a ficha recente descreve `Fundo de segurança
pública`, cuja destinação pode ser investigação, presídios ou tropa e está em
aberto. A mesma verba não deve produzir todos esses efeitos ao mesmo tempo.

## Próximo dado necessário para simular

Antes de atribuir pesos, medir em fontes reais: entradas e saídas do sistema
prisional, pessoas custodiadas, vagas e prazo de abertura, custo de custódia,
equipes e atendimentos de saúde prisional. O [levantamento da Senappen](https://www.gov.br/senappen/pt-br/assuntos/noticias/senappen-divulga-levantamento-de-informacoes-penitenciarias-referente-ao-segundo-semestre-de-2024)
é uma fonte para essas séries; cada unidade, ano e cobertura terá de ser
registrado na ficha. Nenhum coeficiente novo foi atribuído neste estudo.
