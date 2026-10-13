# Diferenciação em relação ao Democracy 4

> **Status: VIGENTE.** Vale para todo chamado da versão 1. Decisão D-67.

O Democracy 4 (D4) é um produto comercial da Positech Games. O SisGov é do mesmo
gênero (simulador de governo), mas **não copia nada do D4**. O D4 serve apenas como
exemplo de gênero: mostra que existe um tipo de jogo em que leis mexem em
indicadores e indicadores mexem na opinião das pessoas. Ideias de gênero são de
todos; a forma concreta como o D4 as escreveu é dele.

Este documento não é parecer jurídico. É a regra de trabalho do projeto, escrita
para ficar longe de qualquer dúvida.

## 1. O que nunca entra no SisGov

| Do D4                                                                                                                                        | Por quê                                                                                                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Arquivos de dados (`policies.csv`, `simulation.csv`, `votertypes.csv`, `pressuregroups.csv`, `situations.csv`, dilemas, eventos, conquistas) | São a obra deles. Nenhum valor, linha ou estrutura de arquivo é transcrito ou traduzido.                                                                        |
| Números e fórmulas                                                                                                                           | Custos, faixas, coeficientes, atrasos e curvas do D4 não são usados nem como "ponto de partida".                                                                |
| Listas fechadas                                                                                                                              | A lista de políticas, de grupos de eleitores, de grupos de pressão, de situações e de conquistas do D4 não é reproduzida, nem traduzida, nem renomeada um a um. |
| Textos                                                                                                                                       | Nomes, descrições, manchetes, dilemas, eventos e piadas.                                                                                                        |
| Arte e interface                                                                                                                             | Ícones, retratos, cores, o leiaute de círculos ligados por setas e a tela de orçamento.                                                                         |
| Nomes próprios                                                                                                                               | Nomes de organizações fictícias do D4 e de seus atentados.                                                                                                      |

## 2. O que pode ser usado como exemplo

- **Ideias de gênero**, que existem em vários jogos e na ciência política: leis que
  custam dinheiro e mudam indicadores; grupos sociais que gostam ou não de uma
  decisão; crises que aparecem quando um indicador passa de um limite; eventos
  aleatórios; eleição no fim do mandato.
- **Quantidades como meta de tamanho.** "O D4 tem cerca de 270 políticas" é um
  dado público que serve para dimensionar o nosso catálogo; não diz quais leis
  teremos.
- **Lições de jogabilidade**: o que deixa um jogo do gênero claro ou confuso, dito
  com palavras nossas.

## 3. Processo de sala limpa

1. A partir de 12/out, os arquivos do D4 ficam **só na máquina do autor**, em `docs/Exemplos/`, que o
   git ignora. Eles não são versionados, não vão para a nuvem e não são anexados a
   conversas com IA.
2. **Quem escreve conteúdo não abre os arquivos do D4.** Leis, grupos, índices,
   eventos e dilemas são escritos a partir do mundo real: legislação de países,
   dados oficiais e estudos, sempre com fonte.
3. **Toda lei, índice e grupo tem fonte real.** O verificador de conteúdo recusa
   ficha sem fonte (chamado V1-05).
4. **Nenhum campo de conteúdo diz "origem: D4".** A origem registrada é a lei real
   ou o estudo.
5. Os documentos antigos que estudaram o D4 saíram do git no V1-02 e ficam só
   em `docs/Exemplos/estudos-antigos/`, na máquina do autor. Arquivos que eu (Claude) gerei a partir deles nesta fase, como a comparação de 11/out, foram apagados. O código de
   referência ao D4 (`src/scenarios/d4ReferenceSandbox.ts`) sai no chamado V1-02.
6. **Correção do meu documento de revisão de 11/out.** Ele propunha copiar a
   estrutura de grupos do D4 (11 organizações e 9 versões radicais), a amostra de
   eleitores do D4 e partir das 270 políticas do D4. Isso fica substituído pelas
   regras deste documento: os 20 grupos de pressão e os 20 segmentos do eleitorado
   são uma taxonomia nossa (ver `conteudo.md`), e o catálogo nasce da legislação
   real.

## 4. O que faz o SisGov ser outro jogo

| Tema               | Como o gênero costuma fazer                   | Como o SisGov faz                                                                                                                                                                                                     |
| ------------------ | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lei                | Um controle de 0 a 100 por política           | Hierarquia jurídica real: Constituição, lei e decreto, com leis que dependem de outras e caem em cascata                                                                                                              |
| Mudar uma lei      | Arrastar o controle e gastar capital político | Cada nível tem um caminho real: decreto é imediato, lei passa por votação na Câmara e no Senado, emenda constitucional exige 3/5 das duas casas. Sem capital político: quem decide é o Congresso                      |
| Dinheiro           | Unidade abstrata                              | Orçamento real em reais e em % do PIB: receita, gasto, juros, déficit, dívida e vinculações                                                                                                                           |
| Tempo              | Turno único                                   | Trimestre com três meses calculados; leis têm prazo de implantação real                                                                                                                                               |
| Indicadores        | Escala abstrata                               | Unidades reais (taxa de homicídios, desemprego em %, Gini) com valor inicial de fonte oficial                                                                                                                         |
| Explicação         | Setas no mapa                                 | "Por que mudou?": cada número mostra as causas, com o peso de cada uma                                                                                                                                                |
| Governo            | Um departamento por tema                      | Ministérios reais do país, agrupados em áreas de influência em volta da Presidência                                                                                                                                   |
| População          | Lista de grupos de eleitores                  | Segmentos de interesse baseados em pesquisas reais (renda, ocupação, religião, território, valores) e perfis sintéticos com peso                                                                                      |
| Pressão            | Organizações que protestam e se radicalizam   | Atores reais da política (sindicatos, entidades patronais, movimentos sociais, igrejas, corporações do Estado, mercado financeiro, crime organizado) com repertório próprio: greve, ocupação, campanha, lobby, ameaça |
| País               | Mundo genérico                                | Configuração do país com dados reais, ministérios, história de abertura e características que ligam leis, eventos e dilemas                                                                                           |
| Conteúdo           | Ficção ou sátira                              | Leis reais de vários países, com a história de onde cada opção existe                                                                                                                                                 |
| Língua e foco      | Inglês, países ricos                          | Português, Brasil primeiro, mas com leis universais                                                                                                                                                                   |
| Congresso          | Sem parlamento, ou parlamento abstrato        | Câmara e Senado montados da população por estatística; você é o partido, e as bancadas votam pela posição na bússola política e pelos acordos (V1-11 e V1-12)                                                         |
| Depois da versão 1 |                                               | Eleição, escolha de candidatos, ministros, nome do partido e personagens com mecânica                                                                                                                                 |

## 5. Checagem em cada chamado

O aceite de todo chamado de conteúdo ou de interface inclui a pergunta:
"Algum nome, texto, número, lista ou elemento visual veio do D4?" Se a resposta
for sim ou "não sei", o item volta para ser reescrito a partir de fonte real.
