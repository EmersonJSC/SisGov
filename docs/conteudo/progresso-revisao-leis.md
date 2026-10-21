# Ponto de retomada da revisão das leis

> **Status: EM ANDAMENTO.** Revisão retomada pelo índice completo em
> 19/out/2026. Parar e salvar este ponto se a cota semanal chegar a 5%
> (novo limite definido pelo autor).

## Mudança de fluxo

O [índice das leis](indice-leis.md) tornou-se a fonte completa das fichas. A
revisão edita o índice e gera os JSONs uma vez por lote. Não editar as leis
diretamente em `src/conteudo/mundo/leis/`. O lote 16 foi concluído por esse
fluxo; as duas consequências ausentes foram criadas e ensaiadas.

## Auditoria de game design por mecanismo (21/out)

O chamado V1-14 foi replanejado como auditoria de segurança e justiça penal,
anterior a qualquer expansão ou reescrita em massa. Os lotes de segurança 7–12
continuam registrados como integração/revisão de fichas; não equivalem a ciclo
jogável aprovado nem a playtest humano. O documento
[`ciclos-dos-programas.md`](../v1/desenho/ciclos-dos-programas.md) permanece em
revisão e serve como evidência prévia, não como especificação aprovada.

**Contagem reconciliada em 21/out:** registros históricos citam 246/253 leis;
o índice vigente consultado contém 242 IDs únicos, dos quais 27 estão no recorte
Segurança e justiça. Usar 242 e 27 como base reproduzida nesta data; preservar
as classificações dos lotes anteriores, deduplicando por ID, sem reabrir fichas
já analisadas por surgirem novas dependências.

**Atualização da execução (21/out):** o recorte atual de Segurança foi
reconciliado em 27/27 leis. A auditoria do ciclo, matriz 8/12, decisões e
recomendações está em
[`auditoria-seguranca-mecanismos.md`](auditoria-seguranca-mecanismos.md). Os
ensaios dos lotes 7–12 foram preservados; o lote 7 foi executado novamente com
retratos nos turnos 0, 1, 4, 8 e 16 para as rotas Ordem e Cuidado. Uma
reformulação concreta já foi aplicada pelo índice: `lei-de-drogas` não altera
mais diretamente `saude_populacao`; opção e teste agora deixam claro que acesso
e resultado clínico dependem de capacidade/continuidade do serviço. A geração
atualizou três arquivos e o teste focal do lote 11 passou (4/4). O mecanismo
integrado continua incompleto: capacidade de investigação, fluxo judicial,
vagas como estoque e saúde prisional ainda não existem como estados explícitos.
O desenho da Opção B (estoques agregados e fluxos) está em
[`ciclo-seguranca-justica.md`](../v1/desenho/ciclo-seguranca-justica.md), com
fontes oficiais, fórmulas estruturais e testes de aceite. Não iniciar código do
motor até o autor aprovar a opção, conforme `docs/v1/engenharia.md`.

## Concluído nesta execução

- Índice consultável: 242 leis, 73 com integração confirmada, 169 pendentes.
- Participação pública e finanças: quatro leis e 13 opções anteriores analisadas
  semanticamente; duas leis reformuladas, duas mantidas, nenhuma fundida/criada.
  A escala agregada 0/25/50/75/100 e a transferência de dividendos/custo
  recorrente para o controle de propriedade passaram no teste focal. A auditoria
  e as dez partidas de 32 turnos estão em
  [`revisao-propriedade-financas-publicas.md`](revisao-propriedade-financas-publicas.md).
  Esse lote não altera a contagem de integração confirmada (73/242).
- Tributação: quatro leis e oito opções discretas analisadas; IRPF/IRPJ testados
  nos tetos próprios de 60%/40%, IVA em 0%/26,5%/30% e seletivo em 0/100.
  Dez trajetórias de 16 turnos passaram sem recusa ou valor não finito. IRPJ
  segue pendente por usar PIB como proxy de lucro. Evidências em
  [`revisao-tributacao-e-extremos.md`](revisao-tributacao-e-extremos.md); a
  contagem de integração confirmada continua 73/242.
- Lote 7: quatro leis de policiamento, armas, penas e drogas integradas;
  [decisões e ensaio](seguranca-lote-7.md). Três partidas de 16 turnos e dois
  testes focais passaram.
- Lote 8: câmeras corporais, reconhecimento facial, vigilância de bairro e
  fundo estadual integrados; [decisões e ensaio](seguranca-lote-8.md). Três
  partidas de 16 turnos e dois testes focais passaram.
- Lote 9: organização policial integrada;
  [consolidação e ensaio](seguranca-lote-9.md). A duplicata
  `natureza-da-policia-de-rua` foi incorporada em `policia-militar`, com
  referências e efeito migrados. Três partidas de 16 turnos e três testes
  focais passaram; os contratos de níveis e ficha v3 também passaram.
- Lote 10: justiça e prisões integradas; [decisões e ensaio](seguranca-lote-10.md).
  Três partidas de 16 turnos e três testes focais passaram. A PPP tem efeito
  fiscal direto declarado, mas o gasto agregado isolado não confirmou aumento;
  a hipótese ficou explicitamente aberta no relatório.
- Lote 11: investigação, drogas e facções integradas;
  [decisões e ensaio](seguranca-lote-11.md). Três partidas de 16 turnos e
  três testes focais passaram. A agência v3 já tinha efeitos diretos.
- Lote 12: justiça e proteção integradas; [decisões e ensaio](seguranca-lote-12.md).
  Delação duplicada consolidada, três partidas de 16 turnos e três testes
  focais passaram. **Segurança concluída nesta etapa; outras áreas pendentes.**
- Lote 13: contratos de trabalho integrados;
  [decisões e ensaio](trabalho-lote-13.md). Três partidas de 16 turnos e três
  testes focais passaram, inclusive uma trava da lei constitucional.
- Lote 14: piso salarial e rede de segurança integrados;
  [decisões e ensaio](trabalho-lote-14.md). Três partidas de 16 turnos e
  três testes focais passaram. A fórmula ganhou efeitos retardados, mas ainda
  não reajusta automaticamente o controle do valor do piso.
- Lote 15: sindicatos e acesso a direitos integrados;
  [decisões e ensaio](trabalho-lote-15.md). Três partidas de 16 turnos e
  três testes focais passaram. Ganhos grandes de produtividade e PIB na rota
  empresarial foram sinalizados para balanceamento.
- Lote 16: recolocação, subsídio de jornada, aprendizagem e licença parental;
  [decisões e ensaio](trabalho-lote-16.md). Duas consequências ausentes foram
  geradas pelo índice. Referência e duas rotas de 16 turnos rodaram; três
  testes focais passaram. O desemprego que zerava foi corrigido; PIB e
  produtividade da rota de formação ainda pedem balanceamento geral.
- Previdência: [triagem de sobreposições](previdencia-sobreposicoes.md).
  `regra-de-reajuste-dos-beneficios` foi consolidada em
  `reajuste-de-beneficios` pelo índice, com efeito e trava migrados. A geração
  retirou a duplicata do catálogo e do ministério brasileiro. Referência e
  duas rotas de 16 turnos, mais três testes focais, passaram. A dupla de
  transferência de renda continua pendente de modelagem.
- Transferência de renda (em andamento, **não contar como revisada**): o índice
  agora separa o orçamento da elegibilidade e gerou sete efeitos de critérios
  escalados pela verba. Três rotas de 16 turnos terminaram sem travamento.
  O teste focal `previdenciaTransferenciaSeparada.test.ts` confirmou que as
  escolhas produzem resultados diferentes com verba, mas **falhou** ao exigir
  resultados materiais iguais com orçamento zerado (pobreza 29,588 vs 30,232
  após quatro turnos). Repetido após oito turnos de espera para a verba cair:
  a diferença persistiu (32,641 vs 32,749). Investigar o valor efetivamente
  implantado da verba e o caminho da escala no motor. Não registrar esse par
  como concluído antes de corrigir e repetir o teste.
- O `npm run check` continua reservado ao fim da revisão, por decisão do autor.
- Ciclo energia → indústria: primeira [revisão pelo índice](ciclo-industrializacao-energia.md).
  Onze leis foram mapeadas; a duplicata `fontes-de-energia-favorecidas` foi
  consolidada em `matriz-energetica` pelo índice, com referências das filhas
  migradas. O catálogo gerado tem 241 leis; os oito testes focais de carga do
  cenário passaram. Ainda faltam as decisões de investimento e capacidade
  elétrica; este ciclo **não está aprovado como jogabilidade completa**.
- Continuação do ciclo: nova lei `orcamento-de-expansao-eletrica` criada pelo
  índice e gerada, com variável própria; fonte de geração ganhou efeitos de
  capacidade escalados pela verba e prazos diferentes. O efeito elétrico foi
  retirado da infraestrutura geral. Validação focal de conteúdo passou; a lei
  aparece uma vez no Ministério das Cidades e a opção nuclear tem trava.
  As rotas de 16 turnos foram jogadas: gasto, emissões e capacidade reagiram;
  oferta, preço e investimento não. **Não contar como ciclo concluído.**

## Próxima sequência de lotes

Segurança e Trabalho estão sem fichas pendentes no índice. Consultar as **169 leis de outras
áreas** e seguir o mesmo ciclo de decisão manter/ampliar/juntar/separar,
formulação, integração, comparação com referência, duas rotas de 16 turnos e
teste focal. A próxima leitura prioritária é Previdência e assistência, onde
a sobreposição de reajuste foi resolvida e a dupla de transferência de renda
precisa de formulação para separar orçamento e critérios sem efeitos mágicos.
A fórmula salarial continua com a limitação de reajuste automático registrada
no lote 14. Antes de abrir
outro lote, escolher 4 a 6 leis
relacionadas pelas dependências e alavancas, não apenas pelo nome do ministério.

**Retomada imediata:** seguir a revisão por ciclos pelo comando `ciclo`,
começando por ligar capacidade elétrica a oferta, preço e produção industrial,
conforme o ensaio em `ciclo-industrializacao-energia.md`. A contagem confirmada é 73/242, com 169
pendentes. A dupla de transferência de renda continua pendente; preservar suas
alterações no índice ao retomar.

Consultar uma área ou lote com `scripts/conteudo/indice_leis.py`.
As quatro fichas em `semConfirmacaoDeIntegracao` no manifesto continuam entre
as pendentes até sua integração ser comprovada.

## Atenções para o próximo agente

- O índice agora é a fonte. `gerar` publica os JSONs a partir dele; as consultas
  leem diretamente a fonte e mostram só o recorte solicitado.
- Nas alavancas `moeda_ano`, `aplicarMeta` recebe valor monetário do domínio,
  não percentual do PIB. O ensaio do lote 8 usa
  `policyLevelRulesFromContent(...).rules.domain.maximum` para calcular o teto.
- Os ensaios usam `aplicarMeta` para isolar causalidade. Uma etapa posterior
  deve testar também a tramitação política real no Congresso e o playtest
  humano da diversão. Não chamar os coeficientes de calibrados.
- Preservar as alterações anteriores já presentes na árvore de trabalho.
