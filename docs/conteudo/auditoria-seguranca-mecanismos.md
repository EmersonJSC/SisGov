# Auditoria de game design: segurança e justiça penal

> **Status: REFERÊNCIA TÉCNICA.** Auditoria do catálogo e do mecanismo atual,
> registrada em 21/out/2026. As recomendações ainda não aprovam o ciclo completo.
> Fonte do catálogo: `docs/conteudo/indice-leis.jsonl`, lida nesta data. Os
> registros abaixo classificam as leis e especificam mudanças; os coeficientes
> dos lotes existentes continuam hipóteses e não são tratados como calibrados.

## Resultado do inventário

O comando `python3 scripts/conteudo/indice_leis.py mapa` reporta **242 leis** no
catálogo: **27 Segurança e justiça**, sem fichas pendentes de integração, e 169
pendentes em outras áreas. O índice consultado descreve 243 JSONs importados na
primeira migração, outro sinal de que contagens de versões diferentes não devem
ser misturadas. Para esta auditoria, 27 é o recorte reproduzido pelo filtro da
área no índice atual; ele não é a antiga tabela de 246/253 leis.

O inventário automático localizou 27 IDs. IDs, controles e relações são
reproduzíveis consultando `indice-leis.py listar --area 'Segurança, justiça e
drogas' --incluir-revisadas --limite 80` e a área irmã `Segurança, penas, drogas
e armas`. Os lotes 7–12 já cobrem decisões concretas; aqui as leis são
classificadas por função sistêmica, não reabertas como 27 revisões isoladas.

**Checagens automáticas neste recorte:** 27 IDs únicos; 0 controles duplicados;
66 opções; 208 efeitos após a remoção documentada abaixo; 0 leis sem efeito;
0 referências de efeito ausentes; 0 candidatas pendentes no comando de
duplicações. As leis compartilham indicadores como lotação e confiança, mas
compartilhar um alvo não as torna duplicadas. O comando de vizinhança de
`gestao-dos-presidios` apontou sobreposições para inspeção, não uma fusão
automática.

## Decisões que o jogador consegue tomar

| Mecanismo | Leis e controles envolvidos | Decisão concreta |
| --- | --- | --- |
| Prevenir e patrulhar | `policiamento-orientado`, `armas-de-fogo`, `cameras-corporais`, `cameras-e-reconhecimento-facial`, `vigilancia-de-bairro`, `policia-militar` | Reagir a chamados, concentrar patrulha ou combinar dissuasão e serviços; definir acesso civil a armas; financiar câmeras e decidir limites de vigilância; escolher organização da patrulha. |
| Comando e coordenação | `policias-dos-estados`, `coordenacao-das-policias`, `ciclo-policial`, `fundo-seguranca-publica` | Preservar comando estadual ou concentrar; compartilhar dados e operações; dividir ou completar o ciclo de investigação; transferir recursos para as forças estaduais. |
| Investigar e produzir provas | `verba-policia-federal`, `agencia-de-inteligencia`, `poderes-de-investigacao`, `interceptacao-de-comunicacoes`, `delacao-premiada`, `regime-contra-faccoes` | Escolher capacidade e foco da investigação, meios de vigilância e infiltração, controle judicial, acordos probatórios e confisco/isolamento de lideranças. |
| Definir infração e resposta | `lei-de-drogas`, `cannabis-legal`, `maioridade-penal`, `garantias-penais`, `pena-de-morte`, `penas-e-progressao`, `alternativas-penais-e-audiencia-de-custodia` | Distinguir uso e tráfico, regular mercado, idade e garantias constitucionais, duração e progressão da pena e quem aguarda julgamento fora da prisão. |
| Custódia e reintegração | `vagas-em-presidios`, `gestao-dos-presidios` | Financiar expansão física e escolher administração estatal, cogestão ou PPP. |
| Proteção e responsabilização | `excludente-de-ilicitude`, `protecao-contra-violencia-domestica` | Definir o alcance da proteção jurídica ao uso de força e a rede de proteção, medidas e abrigos para vítimas. |

**Contagem por grupo, IDs únicos:** prevenção/patrulha 6; comando/coordenação
4; investigação/provas 6; infração/resposta 7; custódia/reintegração 2;
proteção/responsabilização 2. Total: 27. Algumas decisões atravessam mais de um
grupo, mas cada lei foi contada uma só vez.

### Registro persistente por lei

| ID | Papel no mecanismo | Decisão de auditoria |
| --- | --- | --- |
| `agencia-de-inteligencia` | Capacidade investigativa federal | Manter; contabilizar com a verba da PF sem duplicar produtividade por real gasto. |
| `alternativas-penais-e-audiencia-de-custodia` | Entrada pré-julgamento e alternativas elegíveis | Reformular critérios de elegibilidade; não duplicar o efeito de saída de `penas-e-progressao`. |
| `armas-de-fogo` | Regulação de armas civis | Manter; manter circulação, autodefesa e risco como resultados distintos e testáveis. |
| `cameras-corporais` | Evidência e responsabilização policial | Manter; tratar cobertura, armazenamento e fiscalização como a decisão de verba. |
| `cameras-e-reconhecimento-facial` | Vigilância biométrica | Manter; especificar auditoria, erro e correção de falsos positivos. |
| `cannabis-legal` | Regulação de mercado sob lei de drogas | Manter como filha; restringir a opções parentais compatíveis. |
| `ciclo-policial` | Divisão ou integração entre patrulha e investigação | Manter separada da natureza militar/civil da força. |
| `coordenacao-das-policias` | Cooperação entre governos estaduais | Manter separada do comando constitucional das polícias. |
| `delacao-premiada` | Prova negociada com salvaguardas | Manter; preservar opção intermediária com homologação e prova externa. |
| `excludente-de-ilicitude` | Limite jurídico ao uso da força | Manter como restrição institucional; revisar qualquer efeito automático sobre crime. |
| `fundo-seguranca-publica` | Transferência e capacidade das polícias estaduais | Manter; identificar destinação e evitar contar o mesmo ganho de inteligência da PF. |
| `garantias-penais` | Limite constitucional de penas | Manter como lei habilitadora/restritiva, não como minijogo autônomo. |
| `gestao-dos-presidios` | Operação e condições de custódia | Reformular; separar qualidade operacional da criação física de vagas. |
| `interceptacao-de-comunicacoes` | Escutas e duração/supervisão | Manter separada de acesso a dados e inteligência geral. |
| `lei-de-drogas` | Resposta a uso e tráfico | Reformulada nesta execução: removido efeito direto em expectativa de vida; cuidado depende da oferta real. |
| `maioridade-penal` | Limite constitucional de entrada no sistema adulto | Manter como regra habilitadora, com efeitos de entrada e duração separados. |
| `pena-de-morte` | Pena extrema condicionada à Constituição | Manter como lei derivada; preservar a trava da lei constitucional mãe. |
| `penas-e-progressao` | Duração da custódia após condenação | Reformular interação com alternativas e saídas para não duplicar população prisional. |
| `poderes-de-investigacao` | Meios de investigação e acesso a dados | Manter; separar capacidade de investigação do poder legal e dos resultados. |
| `policia-militar` | Natureza institucional da patrulha | Manter como regra constitucional; avaliar como limite que transforma outras decisões. |
| `policiamento-orientado` | Prioridade e método de patrulhamento | Reformular saturação e deslocamento; não prometer redução indefinida. |
| `policias-dos-estados` | Quem comanda as forças territoriais | Manter como decisão federativa constitucional, distinta de coordenação. |
| `protecao-contra-violencia-domestica` | Proteção imediata e saída segura | Reformular por componentes de serviço; efeito clínico/social depende de capacidade. |
| `regime-contra-faccoes` | Instrumentos especiais contra redes criminosas | Reformular garantias, entradas prisionais e investigação como efeitos distintos. |
| `vagas-em-presidios` | Investimento em capacidade física | Reformular para estoque com construção e depreciação; índice atual é proxy inadequada. |
| `verba-policia-federal` | Orçamento e capacidade investigativa federal | Reformular com produtividade marginal compartilhada com agência/inteligência. |
| `vigilancia-de-bairro` | Participação comunitária e poder de abordagem | Manter; diferenciar denúncia comunitária de autoridade coercitiva. |

## Ciclo operacional especificado

O mecanismo deve ser quatro etapas conectadas, com decisões que o jogador
retoma quando a situação muda:

1. **Prevenir e responder:** escolher concentração, método e limites da
   presença policial. Restringem a escolha o orçamento anual, a distribuição
   territorial e as liberdades civis. A resposta altera ocorrências, violência,
   confiança e demanda de investigação.
2. **Investigar e esclarecer:** alocar orçamento entre investigação federal,
   inteligência e capacidade estadual; selecionar ferramentas e supervisão
   judicial. Mais recursos e poderes podem aumentar esclarecimentos, mas têm
   custo e risco a direitos. Casos esclarecidos geram carga para julgamento.
3. **Julgar e custodiar:** escolher alternativas pré-julgamento, penas e
   progressão, enquanto vagas e gestão limitam a capacidade real. Entradas,
   duração da pena e saídas determinam população custodiada; lotação afeta
   segurança e condições internas. A resposta cria uma nova decisão de gasto,
   alternativas ou capacidade.
4. **Reduzir dano e reincidência:** financiar condições, saúde e reintegração,
   além de proteção a vítimas. A reincidência e a confiança alteram a demanda
   futura por policiamento, investigação e justiça.

Fluxo causal esperado:

```text
prevenção e policiamento → ocorrências → investigações e casos esclarecidos
casos esclarecidos → processos → entradas em custódia
penas e alternativas → duração da custódia e saídas
entradas − saídas → população custodiada ÷ vagas operacionais → lotação
lotação + gestão + saúde prisional → condições e reintegração → reincidência
reincidência → ocorrências futuras
orçamento policial + justiça + vagas + saúde → gasto e espaço fiscal
direitos, confiança e segurança percebida → apoio político para a próxima rodada
```

**Limite atual:** as leis influenciam indicadores de forma direta, mas o
catálogo e a rede não representam explicitamente fluxo de casos, capacidade
judicial, admissões/saídas prisionais, estoque de vagas ou equipes de saúde
prisional. `lotacao_prisional` é um índice, não um estoque físico. Portanto, a
versão atual oferece decisões e atrasos, mas ainda não simula integralmente o
ciclo acima. Não mascarar essas ausências com setas adicionais entre índices.

## Matriz de jogabilidade atual (triagem)

| Critério | Nota (0–2) | Evidência e lacuna |
| --- | ---: | --- |
| Decisão | 2 | Há várias rotas combináveis, incluindo policiamento, garantias e custódia. |
| Restrição | 1 | Há gastos, prazos e limites jurídicos; capacidade de investigação, justiça e custódia não limita escolhas de forma explícita. |
| Causalidade | 1 | As escolhas mudam indicadores, mas alguns efeitos usam índices como substitutos de fluxos e estoques ausentes. |
| Tempo | 2 | Ensaios registram efeitos em turnos 1, 4, 8 e 16, com atrasos distintos. |
| Continuidade | 1 | A situação muda, mas faltam estoques que façam o resultado criar uma escolha operacional nova. |
| Feedback | 1 | Indicadores e explicação causal existem; ainda não há painel do ciclo que mostre casos, capacidade e gargalo porque esses estados não são simulados. |
| **Total** | **8/12** | Triagem de design, não certificado de equilíbrio ou diversão. O sistema não demonstra ainda um ciclo operacional completo. |

Leis constitucionais e de garantia não precisam ter minijogo individual. `garantias-penais`, `maioridade-penal`, `pena-de-morte`, `policias-dos-estados`, `policia-militar` e `ciclo-policial` definem o que outros mecanismos podem fazer; devem ser avaliadas por habilitar, restringir ou transformar esses mecanismos.

## Recomendações para reformular o catálogo

### Manter como decisões distintas

- **Comando vs coordenação:** manter `policias-dos-estados` (quem comanda) e
  `coordenacao-das-policias` (compartilhamento operacional) separadas. Uma
  escolha não deve ativar automaticamente a outra.
- **Organização vs procedimento:** manter `policia-militar` e `ciclo-policial`
  separadas. Natureza da força e quem investiga cada ocorrência são decisões
  diferentes.
- **Financiamento vs controle:** manter `fundo-seguranca-publica`,
  `verba-policia-federal`, `agencia-de-inteligencia` e `cameras-corporais`
  como verbas/órgãos distintos; explicitar no orçamento total como competem
   entre si e com custeio, sem fundi-los por afetarem indicadores comuns.
- **Pré-julgamento vs pena:** manter `alternativas-penais-e-audiencia-de-custodia`
  (prisão provisória e medidas alternativas) separada de `penas-e-progressao`
  (duração e saída após condenação). Modelar efeitos sem contar duas vezes a
  mesma redução de entradas ou permanência.
- **Vagas vs gestão:** manter `vagas-em-presidios` (capacidade física e custo de
  construção/operação) separada de `gestao-dos-presidios` (qualidade, prestação
  de contas e condições). Remover da gestão qualquer promessa de abrir vagas.
- **Investigação especializada:** manter `poderes-de-investigacao`,
  `interceptacao-de-comunicacoes` e `delacao-premiada` separadas, com limites,
  supervisão e efeitos próprios; não converter toda ampliação de poder em queda
  automática de crime.
- **Drogas:** manter `cannabis-legal` subordinada a opções compatíveis de
  `lei-de-drogas`; separar política de uso/tratamento da regulação comercial.

### Reformular antes de aprovar o ciclo

1. `vagas-em-presidios`: substituir o efeito direto de gasto → menor índice de
   lotação por decisão de investimento que aumente um estoque de vagas com
   custo, prazo de construção e depreciação. A lotação resulta da população
   custodiada dividida pela capacidade operacional. O estoque e seus parâmetros
   exigem fontes da Senappen e etapa de motor; não inventar coeficientes agora.
2. `gestao-dos-presidios`: retirar qualquer efeito que simule criação de vagas.
   Ligar as opções a manutenção, condições, incidentes e prestação de contas.
   Tratar efeito sobre reincidência como hipótese separada, condicionada a
   programas de educação, trabalho e saúde realmente disponíveis.
3. `alternativas-penais-e-audiencia-de-custodia` e `penas-e-progressao`:
   explicitar no contrato que a primeira regula entrada antes da condenação e
   medidas para casos elegíveis; a segunda regula duração/saída após sentença.
   Testar combinações para evitar dupla redução de lotação e reincidência.
4. `verba-policia-federal`, `agencia-de-inteligencia` e
   `fundo-seguranca-publica`: não acumular coeficientes como se cada real
   produzisse o mesmo ganho pleno de inteligência. Separar gasto, capacidade
   investigativa, casos esclarecidos e resultados; expor rendimento marginal
   decrescente como hipótese calibrável.
5. `policiamento-orientado`: manter as quatro estratégias, mas modelar
   deslocamento territorial e saturação antes de prometer queda permanente de
   crimes. A rota comunitária deve competir em efetivo e orçamento com a
   concentração em pontos quentes.
6. `protecao-contra-violencia-domestica`: separar proteção imediata,
   fiscalização, abrigo e autonomia econômica no modelo; reduzir violência
   letal apenas pela cadeia causal de risco/proteção, não como bônus uniforme.
7. `lei-de-drogas`/`cannabis-legal`: separar prisões por posse, repressão ao
   tráfico, acesso a tratamento e mercado regulado. Não usar `saude_populacao`
   (expectativa de vida nacional) como substituto de acesso ou desfecho de
   tratamento de uso de substâncias.

### Não criar nem fundir nesta auditoria

Não há evidência para apagar controles só porque chegam ao mesmo índice. Não
foi identificada duplicata remanescente clara após as consolidações de
`natureza-da-policia-de-rua` e `delacao-premiada-e-acordos`. Também não se deve
criar uma lei para cada lacuna: capacidade judicial, fluxo prisional e saúde
prisional podem ser variáveis/ações compartilhadas e precisam primeiro de
desenho de motor, fonte e teste.

## Partida demonstrativa existente: ordem vs cuidado

Ensaio reproduzível: `./node_modules/.bin/vite-node
scripts/teste/setorSegurancaLote7.ts`, semente 7, sem ocorrências nem eleição.
As ações são aplicadas diretamente para isolar a rede; não testam Congresso.
Os valores são a saída observada do motor nesta árvore, não dados empíricos.

| Turno | Rota | Violência letal | Lotação prisional | Sensação de segurança | Crime organizado | Gasto público (% PIB) |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 1 | Ordem | 21,145 | 42,498 | 36,145 | 71,936 | 31,308 |
| 1 | Cuidado | 21,146 | 42,498 | 34,098 | 71,937 | 31,124 |
| 4 | Ordem | 20,201 | 45,435 | 39,820 | 73,885 | 31,446 |
| 4 | Cuidado | 17,058 | 38,489 | 34,868 | 70,177 | 30,939 |
| 8 | Ordem | 21,464 | 51,133 | 40,245 | 74,522 | 31,463 |
| 8 | Cuidado | 15,749 | 34,408 | 35,336 | 68,655 | 30,801 |
| 16 | Ordem | 21,665 | 53,711 | 40,219 | 74,134 | 31,342 |
| 16 | Cuidado | 14,607 | 32,624 | 36,218 | 67,136 | 30,636 |

**Escolhas:** Ordem = pontos quentes, porte civil ampliado, progressão
endurecida e prisão de usuários. Cuidado = dissuasão focada com serviços,
desarmamento, penas alternativas e encaminhamento de usuários à saúde. No turno
16, ordem preserva vantagem de 4,001 pontos em segurança percebida
(40,219 vs 36,218), enquanto cuidado tem menos violência, lotação, crime
organizado e gasto. É uma tensão de estratégia observável. O ensaio antigo do
lote 7 registra também satisfação média de 49,778 na rota Ordem e 47,774 em
Cuidado, mostrando o custo político que pode fazer a opção de cuidado difícil.

O exemplo valida alternativas com efeitos distintos e atrasos. **Não** valida
um ciclo operacional: lotação sobe na rota de ordem sem população presa e vagas
explícitas, e não há decisão entre turnos condicionada por um gargalo modelado.

## Plano de teste da reformulação

Antes de publicar leis reformuladas, os testes devem cobrir:

1. Investir em vagas aumenta o estoque só após o prazo e aumenta custo de
   operação; lotação não cai se admissões crescerem mais que vagas.
2. Alternativas reduzem admissões pré-julgamento elegíveis; progressão reduz
   permanência após sentença. Cada alavanca isolada e combinada deve ter efeito
   distinguível.
3. Investigações aumentam casos esclarecidos com atraso e custo; poder sem
   supervisão pode degradar direitos, sem produzir automaticamente a mesma
   redução de violência que capacidade investigativa.
4. Resposta comunitária e pontos quentes têm resultados territoriais distintos;
   benefício não cresce sem limite quando a capacidade já está saturada.
5. Sob choque de crime, o jogador consegue mudar prioridade, abrir capacidade,
   proteger direitos e recuperar indicadores sem um colapso inevitável.
6. Referência de 16 turnos permanece finita e plausível; duas rotas mistas
   (não só extremos) preservam trade-offs e não têm uma estratégia dominante
   em todos os indicadores.
7. Verificação humana: o jogador entende o gargalo, consegue prever direção e
   prazo e explica por que a próxima ação mudou.

## Cobertura e estado

- Leis do recorte Segurança e justiça classificadas: **27/27**.
- Leis desse recorte com integração de ficha nos lotes anteriores: **27/27**.
- Ciclos operacionais completos demonstrados pelo motor: **0/4**; o ciclo acima
  é especificado, mas depende de estados de capacidade ainda inexistentes.
- Fusões/divisões/criações aplicadas nesta auditoria: **0**. A recomendação é
  preservar os 27 IDs atuais; as duas duplicações claras já foram consolidadas
  anteriormente.
- Próxima implementação necessária: desenho aprovado de estoques e fluxos de
  investigação, processos, custódia/vagas e saúde prisional; depois, reformular
  os efeitos das leis ligadas a cada variável e executar testes focais e
  partidas integradas.
- Reformulação aplicada nesta execução: removido de `lei-de-drogas` o efeito
  direto para `saude_populacao` (expectativa de vida nacional). A opção de
  encaminhamento agora declara que resultados dependem de capacidade e
  continuidade do atendimento. O índice foi regenerado; verificação focal
  adicionada a `segurancaLote11.test.ts`.
