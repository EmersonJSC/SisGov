# Gerador, teste e evolução

> **Status: RASCUNHO DE DESENHO (18/out/2026).** Protótipo isolado em branch;
> não é decisão vigente do jogo nem autorização para integrar à `main`.

## Objetivo

Construir um ciclo reproduzível para gerar uma versão experimental da Ilha
Teste, simular diferentes decisões, diagnosticar o que falhou e comparar a
rodada seguinte com a anterior. O objeto de evolução é o gerador, suas regras e
parâmetros declarados; uma rodada não se promove sozinha ao conteúdo usado pelo
jogo.

O Brasil continua sendo o primeiro país da versão 1. A ilha é um ambiente de
ensaio do mesmo motor e dos mesmos mecanismos. Ela deve poder representar os
contextos relevantes do Brasil e de outros países por configuração explícita,
sem codificar exceções brasileiras no motor ou transformar uma hipótese da ilha
em dado real.

## Ciclo do protótipo

```text
definição + semente + configuração
  → pacote candidato isolado
  → validação estrutural e contábil
  → trajetórias de referência, intervenção e extremos
  → diagnóstico com evidências por turno
  → proposta de alteração no gerador
  → nova rodada comparada com a mesma entrada
  → revisão humana e decisão de promoção
```

Cada rodada guarda a definição e parâmetros exatos, semente, comandos de
decisão, versão do motor, resultado da validação, trajetórias e diagnóstico.
Repetir a mesma entrada deve produzir o mesmo pacote e resultados. Alterar uma
coisa por vez facilita atribuir diferenças; mudanças estruturais ficam
identificadas separadamente de ajustes numéricos.

## Escopo implementado: educação, acesso e permanência (C1)

O protótipo percorre dez rodadas do mesmo ciclo C1, orientado pela planilha `tabela-leis-piloto-educacao.xlsx` e pelo catálogo pesquisado em `scripts/gerador/programasEducacao.ts`. A primeira rodada acrescenta quatro leis e simula 17 trajetórias; as rodadas 2–5 acrescentam duas leis por lote e simulam 11 trajetórias de 16 turnos. As rodadas 6–10 combinam opções de leis existentes em cinco pacotes programáticos; cada pacote é validado e simulado na base, na intervenção integrada e na recuperação. Não há opção genérica de “manter situação atual”; zero significa lei ausente/revogada. Os relatórios guardam programas de origem, grupos cobertos, camadas jurídicas, cobertura política e comparação evolutiva. Novas leis só entram com novas fontes pesquisadas. Os registros completos ficam em `rodada-1` a `rodada-10`.

| Rodada | Lote acumulado                                                                                  | Foco                                |
| ------ | ----------------------------------------------------------------------------------------------- | ----------------------------------- |
| 1      | Ensino obrigatório; financiamento; escolha escolar; provisão pública exclusiva (posição pendente) | Demanda, vagas, acesso e perfis     |
| 2      | Bolsa de permanência; jornada integral                                                          | Permanência e frequência            |
| 3      | Piso do magistério; alfabetização                                                               | Capacidade docente e aprendizagem   |
| 4      | Transporte escolar; alimentação escolar                                                         | Barreiras territoriais e frequência |
| 5      | Avaliação escolar; financiamento por resultados                                                 | Informação e decisão seguinte       |

As fichas apontam para fontes legais oficiais. Os coeficientes, estoques iniciais, perfis e escalas do simulador são hipóteses de protótipo, não estimativas empíricas nem parâmetros calibrados. Os pacotes intermediários permanecem em relatórios separados; a saída da quinta rodada é gravada na Ilha Teste da branch para playtest manual, sem alterar o pacote do Brasil.

Pares excludentes exigem regras incompatíveis para o mesmo objeto. O protótipo
anterior tratava Fundeb e escolha escolar como excludentes, embora possam
coexistir. A pesquisa substituiu essa relação por uma candidata entre provisão
estatal exclusiva e autorização de escolas independentes. As duas leis são
geradas; a primeira começa no catálogo e a segunda vigente. O campo `exclui`
bloqueia aprovação simultânea nos dois sentidos. Posição na bússola depende de
justificativa própria. Custos permanecem índices hipotéticos: incorporação de
ativos e indenização ainda não alteram o caixa da partida.

### Regra patrimonial a implementar

Na aprovação da lei, uma transferência deve ocorrer **uma única vez**. Seja
`V` o valor avaliado dos imóveis, equipamentos e contratos incorporados,
`f` a fração incorporada, `i` a fração indenizada e `D` a despesa de avaliação
e transição. O lançamento proposto é `ativos_publicos += V × f`,
`ativos_privados -= V × f` e `caixa_publico -= V × f × i + D`. A despesa
recorrente de operação escolar é um fluxo separado; revogar a lei não desfaz
automaticamente a aquisição. As três opções diferem em `f`, `i`, exceções e
prazo, mas estes parâmetros carecem de base quantitativa. Até haver valores
justificados e suporte a lançamentos únicos, o jogo apresenta somente o índice
de custo comparativo hipotético 3, 2,5 ou 2, respectivamente.

## Contrato de uma rodada

### Entradas

- Semente e configuração do país fictício, incluindo características,
  instituições, estrutura produtiva e condições iniciais.
- Definição global de leis, índices, relações e fontes; valores sem evidência
  empírica são explicitamente marcados como hipóteses.
- Programas de decisão: nenhuma mudança, intervenções isoladas, combinações,
  extremos e recuperação de crise.
- Horizonte de ao menos um mandato, com possibilidade de trajetórias longas.

### Saídas

- Pacote candidato e relatório guardados em `docs/v1/desenho/rodadas-gerador-educacao/rodada-N`.
- Validação que aponta arquivo, nó, regra e evidência que falhou.
- Para cada trajetória: ações, estados por turno, fluxos, resultados e caminhos
  causais que explicam as mudanças.
- Diagnóstico separado em falha estrutural, comportamento inesperado, violação
  contábil, ausência de dado e hipótese ainda não calibrada.
- Comparação entre rodadas com mesmas entradas, incluindo mudanças no gerador,
  nos arquivos produzidos e nos resultados.

## Critérios de evolução

1. A mesma semente e configuração reproduzem pacote e trajetórias.
2. Configurações diferentes representam países diferentes sem alterar a
   definição global de uma lei; indisponibilidade por requisito é explicada.
3. Cada intervenção tem um caminho causal observável até uma consequência e,
   quando o ciclo pede, uma decisão posterior.
4. Nenhuma identidade fiscal viola conservação de caixa, ativos e dívida ou
   conta um fluxo duas vezes.
5. O diagnóstico identifica o primeiro turno e o percurso causal do problema,
   sem afirmar que estabilidade equivale a realismo.
6. A IA pode sugerir mudanças no gerador, mas não inventa fontes, altera
   requisitos jurídicos nem promove conteúdo sem revisão do autor.
7. O autor consegue carregar e jogar a camada candidata na ilha antes de
   decidir se ela evolui, é ajustada ou descartada.

## Etapas de construção

1. **Isolar a rodada:** cada candidato intermediário e relatório ficam no diretório de rodada; só o pacote cumulativo da quinta rodada vai para `src/conteudo` da Ilha Teste.
2. **Reproduzir:** fixar contrato de semente/configuração e salvar ações e
   estados por turno.
3. **Cobrir trajetórias:** adicionar casos-base, intervenções individuais,
   combinações, extremos e recuperação; comparar sempre com contrafactual.
4. **Diagnosticar:** produzir relatório estruturado e comparação legível com a
   rodada anterior; registrar falhas sem editar o gerador automaticamente.
5. **Evoluir:** permitir alteração explícita apenas dos parâmetros marcados
   ajustáveis e dentro de faixas justificadas; alterações causais ou legais
   exigem revisão humana.
6. **Playtest:** carregar manualmente o pacote acumulado da quinta rodada na Ilha Teste e avaliar clareza, estratégias viáveis, custos hipotéticos, prazos e consequências. O pacote permanece nesta branch até revisão do autor.

## Estado desta implementação

### Auditoria geométrica do módulo de leis

`scripts/gerador/relatorioPolitico.ts` classifica os vetores declarados de cada
opção em quatro quadrantes, eixo, centro, ausência ou invalidade. Os valores
podem ser decimais entre −2 e +2; zero é exato, sem limiar de 0,1. A auditoria
não valida a evidência política dos vetores, que continuam experimentais.

A cobertura é apresentada por objeto principal de política, com contagem
separada de opções e leis. O par já declarado compartilha seu objeto; as demais
leis usam o próprio ID provisoriamente, sem inferir novos agrupamentos.
Repetir uma combinação de lei e opção é erro, inclusive entre objetos, para
impedir divergência entre o total e as classificações.

O C1 completo contém 33 opções: 29 sobre eixos, uma no centro e três sem vetor;
nenhum dos quatro quadrantes está coberto. Os casos controlados ficam em
`src/tests/coberturaPoliticaGerador.test.ts`; a integração com C1 permanece em
`src/tests/geradorEducacao.test.ts`. Esses testes verificam classificação e
contagem, não diversidade ou validade política do conteúdo.

### Pesquisa do primeiro par de provisão escolar

O par atual `piso-educacao` × `escolha-escolar-financiada` não demonstra
exclusão. O Fundeb financia a educação pública; a norma sueca permite escolas
municipais e independentes com financiamento público. As duas regras tratam
aspectos diferentes e podem coexistir. O módulo de leis precisa comparar o
**mesmo objeto e a mesma decisão** antes de declarar exclusão.

Há uma contraparte documental melhor para a escolha sueca: a
[Lei de Nacionalização Geral e Gratuita do Ensino de Cuba (1961)](https://siteal.iiep.unesco.org/sites/default/files/sit_accion_files/ley_de_nacionalizacion_de_la_educacion.pdf),
artigos 1º a 5º. A lei atribui o ensino ao Estado, nacionaliza centros privados
existentes e prevê exceções e indenizações conforme decisão ministerial. A
[autoridade escolar sueca](https://www.skolverket.se/styrning-och-ansvar/regler-och-ansvar/ansvar-i-skolfragor/valja-forskoleklass-och-grundskola-eller-anpassad-grundskola)
documenta a alternativa de provedores independentes. A oposição pesquisável é
**exclusividade da provisão estatal × autorização de provedores independentes**;
não é `Fundeb × escolha escolar`. Requisitos jurídicos, ativos, indenizações e
efeitos monetários ainda precisam ser modelados para concluir a contabilidade.

Essas fontes sustentam a direção econômica da comparação. Elas não bastam,
sozinhas, para atribuir coordenadas no eixo de costumes. O gerador deve registrar
essa falta de evidência sem fabricar quadrantes.

### Regeneração

O comando `npm run gerador:rodadas-educacao` é a única entrada para criar ou alterar as leis e conteúdo deste piloto. É proibido corrigir diretamente JSON gerado: inclua ou ajuste a lei na definição do gerador, rode o comando e valide novamente o pacote gerado. Cada execução lê `manifesto-gerador.json`, incrementa o contador persistente, remove somente arquivos que o gerador declara possuir e os caminhos conhecidos de suas saídas, então reconstrói as dez rodadas, a memória acumulada de aprendizados e o pacote final. Pastas inteiras não são apagadas, e o pacote do Brasil não é listado nem alterado. O manifesto registra o contador, a semente, arquivos de saída, aprendizados por rodada e a regra de regeneração; cada relatório registra o mesmo número de geração.

O gerador escreve conteúdo derivado em `src/conteudo`; a regra `exclui` foi acrescentada ao contrato e à decisão da partida para bloquear leis incompatíveis nos dois sentidos. Cada relatório preserva semente, configuração, decisões, trajetórias, fontes, hipóteses, diagnóstico e comparação. A lei de provisão pública exclusiva entra no catálogo com três formas de incorporação, enquanto a lei de escolha começa vigente. Os custos comparativos são índices hipotéticos, sem lançamento no caixa ou avaliação patrimonial; esse fluxo monetário ainda precisa ser definido. O teste da partida passou; `npm run check` continua bloqueado na compilação por seis arquivos Brasil/conteúdo ausentes no estado preexistente da branch. O playtest humano ainda deve avaliar clareza e interesse das decisões.

## Fora deste protótipo

- Substituir o Brasil como primeiro país jogável da versão 1.
- Criar conteúdo brasileiro ou declarar dados hipotéticos da ilha como fatos.
- Gerar o catálogo completo de leis, países, eventos ou grupos.
- Ajustar automaticamente relações causais, fontes, regras jurídicas ou
  conteúdo promovido.
- Integrar à `main` ou ao fluxo de produção sem revisão e decisão do autor.

## Direção de evolução: ecossistema procedural de programas

O gerador cresce a partir de **sementes de programas pesquisados**, não de
leis arbitrárias: problema público, descrição do que o programa tenta resolver,
fonte primária, leis/instrumentos relacionados e grupos sociais afetados. Ele
combina essas sementes em pacotes e deriva cenários das relações declaradas.

```text
problema documentado → programa e fonte → leis/camadas → grupos afetados
                    → mecanismos e efeitos → cenários → diagnóstico
```

O C1 usa Fundeb, Pé-de-Meia, Escola em Tempo Integral, Compromisso Nacional
Criança Alfabetizada, PNATE, PNAE e Saeb, além do direito constitucional à
educação. Uma semente pode alimentar mais de uma lei, e uma lei pode participar
de mais de um pacote. A origem pesquisada fica na memória e nos relatórios do
gerador; o conteúdo do jogo mantém nomes neutros.

O caráter híbrido combina composição procedural com modelagem experimental:
fontes sustentam a existência e o propósito dos programas; parâmetros sem
evidência empírica continuam identificados como hipóteses. Seleção,
agrupamento e ordem de exploração podem variar se a execução registrar fontes
e relações usadas. Consistência significa referências válidas e cadeias
explicáveis, mesmo quando duas gerações não são idênticas.

Os relatórios medem quais camadas jurídicas e quadrantes políticos estão
cobertos. Uma lacuna vira pauta de pesquisa de novos programas; não se desloca
uma lei para preencher quadrante sem sustentação.
