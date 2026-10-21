# Plano mestre para auditoria de game design das leis

> **Status: VIGENTE.** Plano de trabalho solicitado pelo autor em 21/out/2026.
> Este documento organiza uma auditoria; não aprova mudanças no catálogo, no
> motor ou em contratos técnicos. Cada implementação continua dependendo do
> chamado e das aprovações previstos em `docs/v1/engenharia.md`.

## 1. Objetivo e regra central

Auditar **100% das leis existentes** começando pelas decisões que o jogador
pode tomar e pelos mecanismos que essas decisões formam. O objeto de trabalho é
o sistema jogável: problema → decisões → restrições → estados e fluxos →
consequências → novo problema e oportunidade de recuperação.

A unidade de cobertura é o **ID único da lei no índice vigente**. Cada lei é
classificada uma vez; uma dependência descoberta depois acrescenta uma ligação
ao mapa, não uma nova lei analisada. A unidade de design é o **mecanismo** ou
ciclo, que pode atravessar áreas e leis. Uma lei pode participar de mais de um
mecanismo sem ser contada mais de uma vez na cobertura legal.

O trabalho tem quatro saídas distintas:

1. **Diagnóstico:** evidência do que existe e do que falta.
2. **Proposta:** manter, reformular, fundir, dividir, criar mecanismo/ação ou
   deixar pendente, com vínculos e consequências preservados.
3. **Decisão:** aprovação/rejeição do autor para escolhas de design e escopo.
4. **Implementação:** chamado separado, com testes próprios. Nenhuma proposta
   de auditoria modifica leis ou motor por si só.

## 2. Retrato inicial e contagens reproduzíveis

Fonte vigente: [`indice-leis.jsonl`](indice-leis.jsonl), conforme
[`indice-leis.md`](indice-leis.md). Contagens abaixo foram obtidas da fonte no
workspace em 21/out/2026. Reproduzir com `python3 scripts/conteudo/indice_leis.py
mapa` para IDs e setores; uma rotina de auditoria proposta na etapa 1 deverá
reproduzir também opções e relações.

| Medida | Contagem atual | Regra de contagem |
| --- | ---: | --- |
| Leis | **242** | IDs únicos do JSONL; hoje há 242 linhas e 242 IDs únicos. |
| Opções discretas declaradas | **833** | Soma de `lei.controle.opcoes`; não conta rótulos de estratégias em texto livre, nem degraus futuros de controles contínuos. |
| Leis com opções discretas | **219** | Leis cujo controle contém ao menos uma opção discreta. |
| Leis com efeitos cadastrados | **222** | Ao menos um efeito em `efeitos` ou consequência declarada; existência não atesta qualidade causal. |
| Leis ligadas a ciclo no campo `jogo.ciclos` | **11** | Há um ID de ciclo formal no índice: `industrializacao-energia`. |
| Ciclos formais no índice | **1** | IDs distintos em `jogo.ciclos`; não é o total de ciclos que podem vir a existir. |
| Segurança e justiça já classificadas | **27/27** | Auditoria V1-14 existente; reaproveitar registros, não reabrir fichas integralmente. |
| Trabalho já integrado em lotes | **19 leis na área corrente** | Integração de fichas não equivale a diagnóstico de ciclo ou a aprovação de jogabilidade. |

O catálogo tem **232 fichas v2 e 10 v3**. O índice de geração não deve ser
confundido com uma decisão de migrar todas para v3 nesta auditoria. As 242 leis
estão hoje distribuídas em **19 valores de `lei.area`**; `mapa` agrega esses
valores em 11 setores. A tabela de lotes abaixo é hipótese de organização por
mecanismo, não contagem fechada por área.

### Divergências que não se resolvem por suposição

- Registros e planilhas anteriores citam **246 ou 253 leis**. O índice vigente
  tem 242 IDs únicos. No marco zero, preservar a origem e a diferença de cada
  contagem. Não criar quatro leis para alcançar 246.
- A referência a **21 ciclos** não corresponde a 21 IDs no índice atual. O
  documento `docs/v1/desenho/ciclos-dos-programas.md` é estudo preliminar, e não
  um inventário aprovado. Tratar os 21 como hipótese/universo histórico a
  reconciliar com autor e planilha, sem declarar 1/21 como cobertura definitiva
  nem inventar 20 ciclos.
- Os **833** representam opções discretas enumeradas. Cinco controles têm faixa
  ou domínio contínuo; seus valores permitidos, se aplicável, serão contados
  separadamente após validação de esquema, sem expandir cada degrau em milhares
  de “opções”.
- `leis-revisadas.json` mede integração anterior. Seus 73 itens não significam
  73 diagnósticos de game design concluídos. O ponto de partida reaproveita 27 leis de segurança já classificadas e 11 leis
  ligadas ao ciclo de energia; esses números usam status distintos e não são
  somados como cobertura completa de game design.

## 3. Reuso e estado conhecido

### Segurança e justiça

Reutilizar `auditoria-seguranca-mecanismos.md`, `ciclo-seguranca-justica.md` e
os ensaios dos lotes 7–12. Cobertura: 27/27 leis do recorte, classificação por
lei, matriz atual 8/12 e duas rotas demonstrativas de 16 turnos. A auditoria já
separa prevenção, policiamento, investigação, justiça, custódia, proteção e
reintegração. Não repetir a leitura completa das fichas. No lote de integração
comum, consultar apenas relações externas necessárias e resolver as lacunas de
capacidade judicial, fluxo de casos, vagas como estoque e saúde prisional.

A matriz 8/12 é triagem, não prova de equilíbrio. Os ensaios usam ações diretas
para isolar a rede e não verificam tramitação política. O ciclo recomendado de
estoques e fluxos está proposto, mas aguarda aprovação antes de virar trabalho
de motor. Não contar esse desenho como implementação pronta.

### Trabalho, previdência, saúde, educação e energia

Os lotes anteriores, ensaios e pendências ficam como evidência reutilizável nos
relatórios listados em `progresso-revisao-leis.md`. Reaproveitar fichas e números
de teste; reabrir somente as relações necessárias ao mecanismo em análise.
Em especial:

- Transferência de renda segue pendente de investigação: há teste focal falhando
  quando a verba é zero; não marcar o par como concluído.
- O ciclo industrialização–energia tem 11 leis mapeadas, mas não fecha ainda
  oferta, preço e investimento. É diagnóstico parcial, não ciclo aprovado.
- Coeficientes e valores de simulação são saídas do motor ou hipóteses de jogo,
  não evidência empírica sem fonte própria.

## 4. Pipeline de execução

### Etapa 0 — Congelar e reconciliar o inventário

**Pergunta:** qual é o conjunto exato de IDs e qual fonte manda?

- Guardar data, hash do índice e versão do esquema na ficha de execução.
- Verificar IDs repetidos, ausentes e exclusões; comparar índice, manifesto de
  geração, catálogo compilado e contagens históricas.
- Congelar total e regras de contagem de opções discretas, controles contínuos,
  efeitos, custos, dependências e ciclos.
- Resolver ou registrar como `não verificado` a divergência 242/246/253 e a
  origem do número 21. O autor decide apenas se houver mais de uma fonte
  vigente possível; não se bloqueia a auditoria enquanto isso.

**Entrega:** snapshot do inventário e nota de reconciliação reproduzíveis.

### Etapa 1 — Auditoria automática antes da leitura de design

Rodar os validadores existentes e preparar uma consulta/relatório determinístico
para o que ainda não estiver coberto. Planejar uma ferramenta somente de leitura
em `scripts/conteudo/` com saída legível e arquivo estruturado versionável.

Verificações mínimas:

- unicidade e validade de IDs, leis, controles e opções;
- controles iguais e quase iguais, com candidatos e evidência, sem fusão
  automática;
- leis sem efeito, efeito sem opção/controle, alvo/origem órfãos e referências
  entre leis não resolvidas;
- sobreposição fiscal e de capacidade, com unidade e período, sem equiparar
  destino de índice a duplicação;
- implantação, atrasos, custos recorrentes/de implantação e travas jurídicas;
- leis sem fonte, fonte sem afirmação correspondente, hipótese sem rótulo e
  divergências entre índice, gerados, documentos e motor;
- ligações que atravessam áreas e dependências em aberto.

Cada alerta recebe `confirmado`, `falso positivo`, `não verificado` ou
`decisão necessária`, com referência ao ID/campo e à regra que o encontrou.

**Entrega:** relatório completo, inclusive falsos positivos conhecidos, antes
que qualquer lei seja reescrita.

### Etapa 2 — Consolidar o catálogo de decisões

Para cada lei, extrair uma ficha compacta de auditoria: ID/nome, autoridade e
nível, controle, número e nomes das opções, o que o jogador escolhe, recursos e
limites, efeitos diretos/atrasos, dependências, áreas tocadas, fontes, status e
lote. Essa ficha serve como índice estável: os lotes seguintes consultam o
registro e as leis vizinhas, não redescobrem tudo.

Classificar leis em duas trilhas:

- **Operacional:** pode mudar diretamente uma alocação, capacidade, regra,
  benefício ou resposta em turno.
- **Constitucional/institucional/garantia:** habilita, restringe ou transforma
  opções operacionais. Avaliar autoridade, elegibilidade, proteção e limites;
  não exigir minijogo individual.

**Entrega:** registro persistente de todas as 242 leis com estado explícito,
mesmo que alguns campos permaneçam `não verificado`.

### Etapa 3 — Organizar por mecanismos e relações

Agrupar por pergunta de decisão e cadeia causal, não apenas por ministério. Para
cada mecanismo, desenhar:

```text
problema → escolhas viáveis → restrição → mudança de estado/fluxo
         → resultado próximo e tardio → novo problema/escolha → recuperação
```

Cada ciclo tem dono, IDs principais, IDs de suporte, índices/estados, fontes,
incertezas, custos compartilhados, consequências políticas e dependências
externas. Um ID pode ser principal em um mecanismo e dependência em outro, mas
cobertura legal segue única. A lista de ciclos é descoberta e versionada; o
número 21 não é imposto ao desenho.

**Entrega:** mapa de mecanismos, dependências internas/externas e lacunas.

### Etapa 4 — Diagnosticar a jogabilidade

Para mecanismo operacional, preencher 0–2 com uma evidência curta por critério:

| Critério | 0 | 1 | 2 |
| --- | --- | --- | --- |
| Decisão | sem escolha do jogador | escolha existe, mas estratégias pouco distintas | ao menos duas rotas viáveis e diferentes |
| Restrição | nada limita | limite indireto ou pouco visível | orçamento, capacidade, tempo, apoio ou limite jurídico pesa |
| Causalidade | escolha não muda estado útil | efeito parcial ou substituto | muda estado/fluxo que altera outras escolhas |
| Tempo | sem horizonte legível | só imediato ou só tardio | imediato e posterior têm consequência distinta |
| Continuidade | resultado encerra a decisão | há reação, mas sem escolha nova | efeito abre uma decisão relevante no turno seguinte |
| Feedback | causa opaca | resultado visível, causa incompleta | causa, atraso e reação são compreensíveis |

**Limiar de triagem:** 9/12 para “ciclo demonstrado”; 6–8 “parcial”; 0–5
“não demonstrado”. Qualquer 0 em decisão, causalidade ou feedback impede o rótulo
de demonstrado, mesmo se a soma atingir 9. A escala não prova diversão,
equilíbrio ou validade empírica.

Para leis habilitadoras, usar ficha própria: autoridade e nível coerentes,
quais ações habilita/restringe, quais direitos protege, qual mecanismo altera e
se há conflito ou sobreposição com outra autoridade. Pontos da trilha
institucional não entram no total 0–12 dos ciclos.

**Entrega:** matriz justificada, lacunas e reprovação explícita; diagnóstico
não vira recomendação de fusão automaticamente.

### Etapa 5 — Propor destinos sem alterar o catálogo

Cada ID recebe uma recomendação e uma justificativa rastreável:

| Diagnóstico | Recomendação possível |
| --- | --- |
| Duas leis comandam o mesmo controle e a mesma autoridade | Candidatar à fusão, preservando efeitos, limites e fontes; autor decide. |
| Uma lei mistura matérias ou autoridades independentes | Candidatar à divisão, mantendo referências e transição; autor decide. |
| Falta uma decisão concreta no ciclo | Desenhar ação/mecanismo; criar lei só se a autoridade jurídica exigir. |
| Lei coerente, efeitos/ciclo superficiais | Reformular o mecanismo, custo, capacidade, atraso ou feedback; lei pode permanecer. |
| Lei constitucional ou de garantia | Manter/reformular seus limites; não exigir opções de minijogo. |
| Fonte, dependência ou causalidade insuficiente | Pendente com pergunta precisa e status `não verificado`. |

Afetar o mesmo indicador, compartilhar nome, ou parecer ideologicamente próximo
não basta para juntar. Manter níveis jurídicos e autoridades separados quando
as decisões forem diferentes. Divergências de documentos técnicos são
registradas para decisão; não se resolvem silenciosamente.

**Entrega:** tabela proposta de manter/reformular/fundir/dividir/criar/pendente,
com IDs, efeitos a preservar, riscos e decisão do autor marcada separadamente.

### Etapa 6 — Validar mecanismos e estratégia no motor

A validação ocorre após especificação e aprovação de cada mecanismo. Usar leis e
estado real dos JSONs vigentes, em semente fixa; gravar versão dos dados, regras,
configuração e escolhas. Separar resultados observados no jogo de metas
normativas e dados reais.

**Cobertura técnica por mecanismo:**

- testes unitários de fórmula, limites, unidades, custo, implantação e atraso;
- integração das leis relacionadas e das dependências entre setores;
- referência sem ação por 32 turnos, verificando estabilidade e valores válidos;
- rotas contrastantes viáveis, por exemplo: provisão pública, mercado/eficiência,
  proteção/prevenção e contenção fiscal, adaptadas ao mecanismo (não forçar
  eixos sem sentido);
- choque controlado em turnos fixos e pelo menos duas respostas de recuperação;
- extremos e combinações para encontrar dominância, colapso, exploit e custo
  duplicado;
- diário “por que mudou?” com causa, atraso e recurso que limita.

**Relato da partida:** estado inicial, escolhas em cada turno, leis/controles
alterados, custos, restrições, resultados nos turnos 0, 1, 4, 8, 16, 24 e 32,
critérios de falha e interpretação. Uma simulação automática não substitui
playtest humano; sem playtest, o estado é “validado tecnicamente, diversão não
verificada”.

## 5. Plano dos lotes

Planejamento por mecanismo, com aproximadamente 10–20 IDs principais por lote.
Dependências adicionais são consultadas pelo ID e marcadas como vínculo; não
inflam o denominador nem obrigam reanálise completa. Como `lei.area` tem 19
valores e os setores do comando `mapa` são agregações, as quantidades abaixo são
**estimativas de capacidade**, não distribuição confirmada. Na Etapa 0, gerar a
lista de IDs por mecanismo e garantir que cada um dos 242 IDs tenha exatamente
um lote principal. Ajustar lotes antes de começar se algum ultrapassar 20 IDs ou
misturar perguntas sem uma decisão comum.

| Ordem | Lote de trabalho | Base principal inicial | Meta de tamanho | Tratamento |
| ---: | --- | --- | ---: | --- |
| 1 | Fechamento do piloto de Segurança: prevenção, patrulha, investigação, justiça e custódia | Segurança e justiça | 27 (já classificados) | Reusar auditoria V1-14 e lotes 7–12; fechar lacunas/decisões, sem recontar nem reabrir fichas. |
| 2 | Contas, tributos e receitas | Impostos, Tributação e leis econômicas fiscais | 15–20 | V1-15; reconciliar bases tributárias, distribuição e arrecadação. |
| 3 | Orçamento, dívida e regras fiscais | recorte fiscal de Economia + instituições | 10–18 | Depende dos contratos V1-37/V1-38; separar custo legal, orçamento e dívida. |
| 4 | Moeda, crédito, comércio e produção | Economia, moeda e comércio | 15–20 | Incluir o ciclo industrialização–energia já mapeado como dependência. |
| 5 | Energia, clima e oferta física | Meio ambiente, energia, agro e infraestrutura | 15–20 | Ligar geração, oferta, preço, investimento e prazo; dividir se necessário. |
| 6 | Cidades, moradia e infraestrutura territorial | Cidades + leis territoriais relacionadas | 10–18 | A lei única de Cidades e transporte entra aqui; completar relações por dependência. |
| 7 | Saúde: acesso, capacidade e atendimento | Saúde | 15–20 | Reusar lote 6; separar financiamento, profissionais, serviços e resultados. |
| 8 | Educação: acesso e capacidade escolar | recorte escolar | 10–15 | Reusar auditoria do lote 5; vagas, profissionais e custeio. |
| 9 | Educação: superior, ciência e cultura | recorte superior/científico/cultural | 10–15 | Completar os IDs restantes sem duplicar os do lote 9. |
| 10 | Trabalho: regras, remuneração e negociação | Trabalho e emprego | 10–15 | Reusar lotes 13–16; custos, produtividade e proteção social. |
| 11 | Trabalho: emprego, qualificação e transições | Trabalho e emprego | 8–12 | Reusar lotes e manter falha de transferência/renda como dependência aberta. |
| 12 | Previdência, assistência e transferências | Previdência e assistência | 15–20 | Reusar fichas e sobreposições; fechar transferência de renda e sustentabilidade. |
| 13 | Instituições: autoridade, integridade e serviço público | Poder e instituições | 10–15 | Avaliar como habilitadoras e vínculos com execução/orçamento. |
| 14 | Instituições: eleições, informação e direitos políticos | Poder e instituições | 10–15 | Avaliar contratos e limites; não exige minijogo por lei. |
| 15 | Direitos civis, liberdades, costumes e imigração | Direitos e liberdades | 15–20 | Partir por mecanismo se exceder a faixa ou misturar autoridades. |
| 16 | Defesa, relações exteriores e soberania | Defesa e mundo | 15–20 | Distinguir prontidão, diplomacia, fronteira e direitos. |

A previsão inicial é **16 lotes de expansão**, além do piloto de Segurança já
reutilizado (17 pacotes no total), mais divisões locais se a lista real de IDs ou
a pergunta de design exigir. A tabela não soma áreas porque as classificações
de `lei.area` ainda não são uma taxonomia de mecanismos e há dependências
transversais. Na Etapa 0, publicar o manifesto exato de 242 IDs, um lote principal
por ID e contagens por lote. Ajustar o total de lotes com base nesse manifesto;
nunca completar uma meta com leis inexistentes.

A auditoria de segurança cobre 27 IDs, e o ciclo formal de energia menciona 11.
No manifesto, confirmar a interseção por ID. Um ID já classificado mantém sua
cobertura e recebe ligações para outros mecanismos; só reabre a ficha quando a
fonte ou o próprio conteúdo mudou. A contagem de leis cobertas é por ID único.

## 6. Entrega obrigatória por lote

Nenhum lote termina com “as leis parecem coerentes”. O pacote contém:

1. Pergunta de design e mecanismo definido em uma frase.
2. IDs principais e dependências externas, em listas separadas.
3. Registro das opções/decisões e restrições reais no jogo.
4. Diagrama causal e matriz 0–12 (ou ficha habilitadora).
5. Auditoria de duplicações e sobreposições com falsos positivos resolvidos.
6. Fichas por lei atualizadas só no registro de auditoria; evidências e fontes.
7. Recomendação por ID, alternativas consideradas e riscos de cada mudança.
8. Cenários de teste, exemplo de turnos, estratégia contrastante e recuperação.
9. Resultado dos testes que já existem e lista concreta de testes/código futuros.
10. Perguntas ao autor, decisões pendentes e estado de cobertura no painel.

### Portões de aprovação

- **G0 — Inventário:** total, IDs e denominadores reproduzidos.
- **G1 — Diagnóstico:** todas as leis do lote classificadas e relações externas
  marcadas; nenhuma alteração aplicada.
- **G2 — Design:** escolhas, restrições, causalidade, horizonte e recuperação
  especificados; nota e limitações publicadas.
- **G3 — Decisão:** autor aprova/rejeita propostas de design com pendências
  explícitas.
- **G4 — Implementação:** chamado próprio, contrato e testes de aceite; usar
  índice e gerador vigentes. Mudança de comportamento separada de refatoração.
- **G5 — Validação:** testes focais, partidas de 32 turnos e, para afirmar
  clareza/diversão, playtest humano. `npm run check` no fechamento definido
  pelo chamado e pelas regras do projeto.

Não avançar G3 para G4 sem aprovação quando houver criação de estado/mecânica,
consolidação de autoridade, fusão/divisão de leis, números empíricos ou
mudança de regra. Pendências não bloqueantes ficam `não verificado` e não
contam como aprovadas.

## 7. Economia de contexto e prevenção de retrabalho

1. **Uma fonte lida por inteiro uma vez:** inventário completo é extraído para
   registro estruturado; lotes trabalham com fichas curtas e consultas por ID.
2. **Automação antes de interpretação:** validar formato, IDs, referências,
   controles e alvos antes de pedir análise de design.
3. **Recorte por mecanismo:** ler integralmente apenas leis principais do lote,
   vizinhas apontadas pelas consultas e dependências externas relevantes.
4. **Uma lei, uma classificação:** registrar ID, estado, versão, evidência,
   confiança, links e decisão. Relação nova acrescenta uma aresta; não zera o
   trabalho já contado.
5. **Falta de evidência vira fila explícita:** `não verificado`, pergunta,
   responsável e fonte a consultar; não abrir investigações laterais sem limite.
6. **Limite por lote:** 10–20 IDs principais; congelar a pergunta e a lista ao
   abrir. Dependência fora do recorte vai para uma fila transversal.
7. **Entrega incremental:** salvar diagnóstico a cada lote antes do próximo.
   Não acumular uma análise gigante para só então produzir conclusão.
8. **Propostas isoladas:** auditoria e documentos de proposta separados de
   `indice-leis.jsonl`, JSONs publicados e motor. Alterações reais só em chamado
   aprovado.
9. **Reuso de simulações:** registrar comando, semente, hash do catálogo,
   escolhas e saída compacta; rodar de novo só se mudou entrada ou regra.
10. **Parar a exploração:** cada lote tem teto de uma rodada de busca por fonte
    e uma rodada de esclarecimento de relações; o que faltar permanece
    `não verificado`, salvo se o autor aprovar investigação adicional.

## 8. Scripts e testes: plano, não execução nesta etapa

### Ferramentas existentes a reaproveitar

- `scripts/conteudo/indice_leis.py`: `mapa`, `listar`, `pendentes`, `buscar`,
  `candidatos`, `vizinhas`, `ficha`, `ciclo`, `gerar` e operações de edição.
  Durante a auditoria de diagnóstico usar consultas de leitura; não usar `salvar`,
  `excluir` ou `gerar` para aplicar propostas.
- `scripts/camadas/auditoria_efeitos.ts`: auditoria de efeitos já presente.
- Testes focais em `src/tests/` e ensaios em `scripts/teste/`, referenciados nos
  relatórios de cada lote.
- `npm test` para testes e `npm run check` conforme o aceite do chamado; a
  política atual do autor reserva a checagem integral para o fechamento da
  revisão.

### Ferramenta proposta para etapa futura

Criar um relatório reproduzível sem escrita no catálogo, por exemplo
`scripts/conteudo/auditar_catalogo.py`, que produza JSON/Markdown com snapshot,
contagens e achados. Cobrir por testes unitários: IDs duplicados, controles
iguais, alvo órfão, lei sem efeito, custo conflitante, referência externa e
classificação manual preservada após nova aresta. Teste de regressão garante que
uma execução idêntica não muda o registro e que sugestão de duplicação nunca
executa fusão.

A ferramenta só entra em implementação por chamado. Este plano não adiciona
script, teste nem alteração de jogo.

## 9. Simulação de 32 turnos

Para cada mecanismo aprovado para protótipo:

- **T0:** estado inicial e valores de referência congelados.
- **T1–8:** mostrar reação imediata, atraso e primeiro gargalo.
- **T9–16:** decisões sob restrição e efeitos cruzados.
- **T17–24:** inserir choque determinístico (queda de receita, aumento de
  demanda ou outro evento plausível do mecanismo) e testar reação.
- **T25–32:** testar recuperação, persistência do custo e efeitos tardios.

Executar no mínimo uma referência parada e três estratégias que sejam viáveis
para o mecanismo; quando uma estratégia não se aplica, justificar. Usar semente
fixa e choques explícitos. Em cada turno, registrar escolhas e recursos; salvar
retrato quantitativo em T0, 1, 4, 8, 16, 24 e 32 e log de “por que mudou?”.

**Critérios de reprovação:** valor inválido ou explosão sem explicação; decisão
que não muda nenhum resultado; rota dominante em todos os objetivos sem custo;
nenhuma rota de recuperação; orçamento ou capacidade ignorados; duas leis
cobrando/beneficiando o mesmo fluxo duas vezes; jogador não consegue identificar
o gargalo e uma reação após ler o feedback. Resultado passa a “hipótese precisa
revisão”, não a coeficiente calibrado automaticamente.

Usar o ensaio existente de Segurança como referência de relatório, estendendo a
32 turnos e acrescentando choque/recuperação após o mecanismo ser aprovado. Não
alegar que o ensaio de 16 turnos atual já satisfaz este protocolo.

## 10. Registro persistente e retomada

Manter o painel como arquivo separado do catálogo, proposto como
`docs/conteudo/progresso-auditoria-game-design.json`, mais um resumo legível
`docs/conteudo/progresso-auditoria-game-design.md`. Campos mínimos:

- snapshot/data/hash; totais e regra de contagem;
- cada ID exatamente uma vez, lote principal, status, versão, evidências,
  recomendações e links;
- vínculos externos sem alterar a contagem principal;
- cada mecanismo com IDs, pergunta, estado 0–12/ficha habilitadora, teste,
  simulação, pendências e aprovação;
- decisões do autor com data e escopo;
- próximos passos e ponto de retomada de uma sessão para outra.

**Status por lei:** `não iniciada`, `inventariada`, `classificada`, `diagnóstico
revisado`, `decisão pendente`, `aprovada para implementação`, `implementada e
validada`. Uma mudança no catálogo cria nova versão de evidência, não apaga o
histórico nem duplica a lei. `leis-revisadas.json` continua medindo integração de
conteúdo e não é reaproveitado como contador desta auditoria.

Ao retomar em nova sessão: ler este plano e o ponto de retomada; verificar hash
atual; buscar o primeiro lote não fechado; carregar somente suas fichas e
relações; confirmar uma vez as pendências externas prioritárias; produzir a
entrega e atualizar cobertura. Se o hash mudou, identificar os IDs tocados e
reabrir somente esses registros.

## 11. Estimativa e riscos

### Esforço de planejamento

- Etapa 0–2 e ferramenta de auditoria: **2–4 sessões de agente**.
- 16 lotes de expansão, com média de **1–2 sessões por lote** para diagnóstico e pacote:
  **16–32 sessões**. O piloto de Segurança é reaproveitado; pendências dele entram
  no primeiro pacote, sem reabrir 27 fichas. Lotes com motor novo ou fontes insuficientes podem exceder.
- Aprovação de desenho, chamados de implementação e validações de 32 turnos:
  **fora da estimativa de auditoria**; dependem das decisões e do escopo dos
  mecanismos aprovados.
- Revisão humana: 15–30 minutos por pacote de lote e sessões de jogo para os
  mecanismos prioritários. Estimar em blocos, não prometer duração total.

A estimativa é esforço de agente, não tempo corrido ou garantia. Reuso de
Segurança e lotes prévios reduz a leitura, mas não elimina validação integrada.

### Riscos e resposta

| Risco | Resposta no processo |
| --- | --- |
| 242/246/253 ou “21 ciclos” usados com denominadores diferentes | Congelar definição e guardar fonte de cada contagem antes de medir cobertura. |
| Auditoria vira reescrita sem fim | Fechar uma pergunta e entrega por lote; registrar incerteza em vez de expandir busca. |
| Falsa duplicidade por alvo comum | Comparar controle, autoridade, nível e efeito; exigir decisão humana. |
| Muitos minijogos isolados | Agrupar por estados e decisões partilhados; leis institucionais podem só habilitar/restringir. |
| Coeficientes passam por fatos | Rotular fato, hipótese e teste em toda entrega; exigir fonte empírica para afirmações reais. |
| Mais estados tornam o motor caro ou quebram conteúdo | Protótipo por mecanismo, contrato genérico, testes focais e chamado separado. |
| Teste automático parece provar diversão | Reportar validação técnica separada de playtest humano. |
| Leis ou referências mudam durante a auditoria | Detectar por hash e revisar apenas IDs afetados. |

## 12. Decisões e aprovações reservadas ao autor

O plano deixa decisões de design visíveis. Precisam de decisão do autor antes de
implementação correspondente:

1. Qual fonte define o universo final se o índice mudar ou divergir de planilha
   vigente; confirmação final do denominador 242.
2. De onde vêm os “21 ciclos” e se são alvos, estudos ou apenas uma lista
   preliminar; não precisa resolver para iniciar a auditoria de IDs.
3. Aprovar/rejeitar cada recomendação de fusão, divisão, criação ou mudança de
   autoridade/contrato.
4. Aprovar estados, fluxos, fórmulas estruturais e custo de novos mecanismos;
   parâmetros empíricos devem ter fontes, demais números seguem como hipóteses.
5. Avaliar clareza, escolhas interessantes, estratégias viáveis e recuperação
   no playtest; algoritmo não decide diversão.
6. Aprovar a ordem final dos lotes se o mapa revelar dependências que mudem a
   sequência. A ordem recomendada começa pela segurança já auditada e passa a
   orçamento, para reutilizar a prova mais madura e resolver restrições comuns
   antes de conteúdo dependente.

## 13. Ordem recomendada de execução

1. Registrar snapshot e reconciliar denominadores; não tocar no catálogo.
2. Rodar auditoria automática e publicar as regras/falsos positivos.
3. Fechar o registro único por lei, preservando Segurança 27/27 e evidência
   prévia dos lotes.
4. Reutilizar o piloto de Segurança (27/27) e encerrar apenas pendências de
   diagnóstico/decisão; qualquer estado novo do motor exige aprovação e chamado
   próprios. A expansão para auditar outras áreas como mecanismo é proposta de
   escopo, pois V1-14 cobre Segurança e não autoriza por si só os demais lotes.
5. Auditar contas, tributos, orçamento e dívida (lotes 3–4), pois são restrições
   transversais para quase todos os mecanismos e dependem dos trabalhos V1-37 e
   V1-38 previstos no PLANO.
6. Completar economia/indústria/energia, reutilizando o mapa de 11 leis e
   mantendo suas pendências de oferta/preço/capacidade explícitas.
7. Executar a expansão pelos lotes 2–16: contas/tributos, orçamento/dívida,
   economia/produção, energia, cidades/infraestrutura, saúde, educação, trabalho,
   proteção social, instituições, direitos e defesa. Rever a fila após cada pacote.
8. Só depois das auditorias e das decisões abrir chamados de reescrita ou
   mecânica. Validar cada mecanismo com testes e partidas de 32 turnos antes de
   declarar pronto; playtest humano é necessário para afirmação de diversão.

Esta sequência não altera o escopo, a ordem oficial, as dependências ou o status
do V1-14 e V1-15 a V1-23. Para transformar a auditoria integral e os lotes de
expansão em trabalho oficial, atualizar primeiro o PLANO e os chamados com a
decisão do autor. Até lá, este documento orienta a proposta, mas não inicia a
expansão nem autoriza editar leis ou motor.
