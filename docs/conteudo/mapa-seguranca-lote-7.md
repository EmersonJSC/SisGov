# Segurança: mapa de sobreposições e primeiro lote pendente

> Inventário de desenho anterior à integração do primeiro lote. Base: os 29
> JSONs de leis cuja `area` começa por `Segurança,` no índice compacto inicial.
> Possível sobreposição pede leitura; não autoriza apagar uma ficha.

O primeiro lote foi integrado e testado em [seguranca-lote-7.md](seguranca-lote-7.md).
O lote de vigilância e verba foi integrado em
[seguranca-lote-8.md](seguranca-lote-8.md). A organização policial foi revista
em [seguranca-lote-9.md](seguranca-lote-9.md), incluindo a consolidação de
`natureza-da-policia-de-rua` em `policia-militar`. Justiça e prisões foram
integradas em [seguranca-lote-10.md](seguranca-lote-10.md). Investigação,
drogas e facções foram integradas em [seguranca-lote-11.md](seguranca-lote-11.md).
O último grupo foi integrado em [seguranca-lote-12.md](seguranca-lote-12.md),
com a duplicata de delação consolidada. Não há ficha pendente de Segurança.

## Decisões do catálogo

| Núcleo | Leis existentes | Decisão de revisão |
| --- | --- | --- |
| Organização policial | `natureza-da-policia-de-rua`, `policia-militar`, `ciclo-policial`, `coordenacao-das-policias`, `policias-dos-estados` | Natureza militar/civil e ciclo de investigação são controles diferentes. `policia-militar` repete a escolha de `natureza-da-policia-de-rua` e não declara consequências: candidata à consolidação. `policias-dos-estados` sobrepõe os extremos de `coordenacao-das-policias`; comparar referências e efeitos antes de escolher a canônica. |
| Tática e meios | `policiamento-orientado`, `cameras-corporais`, `cameras-e-reconhecimento-facial`, `vigilancia-de-bairro`, `fundo-seguranca-publica`, `verba-policia-federal` | Permanecem alavancas independentes: modo de patrulhar, câmeras, vigilância e verba. A semelhança textual entre `fundo-seguranca-publica` e `policias-dos-estados` é falso positivo do índice: financiamento não é comando das polícias. |
| Armas e força | `armas-de-fogo`, `excludente-de-ilicitude` | Porte/posse civil e regra de uso da força por agentes são decisões distintas. |
| Prisões e penas | `penas-e-progressao`, `gestao-dos-presidios`, `vagas-em-presidios`, `alternativas-penais-e-audiencia-de-custodia`, `maioridade-penal`, `garantias-penais`, `pena-de-morte` | Progressão, modo de gerir presídios e quantidade de vagas não devem ser uma opção única. `gestao-dos-presidios` não declara consequências diretas; não prometer efeito antes de ligar a rede. |
| Drogas e facções | `lei-de-drogas`, `cannabis-legal`, `regime-contra-faccoes`, `poderes-de-investigacao`, `interceptacao-de-comunicacoes` | Uso de drogas, mercado regulado e combate financeiro/operacional a facções são escolhas combináveis. `cannabis-legal` já depende de alternativas da `lei-de-drogas`. |
| Processo penal | `delacao-premiada`, `delacao-premiada-e-acordos` | Opções repetidas; `delacao-premiada` já tem nove consequências, enquanto a outra tem uma. Candidata à consolidação após mapear referências. |
| Outras decisões | `agencia-de-inteligencia`, `protecao-contra-violencia-domestica` | Mantê-las para lotes próprios; a agência não declara consequências diretas. |

## Primeiro lote para formulação

1. `policiamento-orientado`: patrulha reativa, pontos críticos, metas ostensivas e
   policiamento comunitário com dissuasão focada. Natureza da polícia e câmeras
   continuam em leis próprias.
2. `armas-de-fogo`: desarmamento civil estrito, posse residencial controlada,
   posse rural com transporte restrito e porte civil ampliado.
3. `penas-e-progressao`: alternativas e ressocialização, progressão com estudo e
   trabalho, progressão mais exigente e pena integral fechada. A gestão por PPP
   continua em `gestao-dos-presidios`.
4. `lei-de-drogas`: prisão do usuário, usuário não preso com repressão ao tráfico,
   critério objetivo para distinguir usuário de traficante e encaminhamento do
   uso à saúde. A regulação da cannabis permanece na lei separada
   `cannabis-legal`, cuja dependência deve ser preservada e testada.

As direções de crime, letalidade, sensação de segurança, grupos e gasto são
**hipóteses de jogo**. Cada opção precisa de vantagem, custo/risco e efeito
observável no motor antes de ser considerada integrada.

### Pontos a provar no primeiro lote

- `policiamento-orientado--crimes-patrimoniais` tem coeficiente positivo no
  arquivo atual, embora a opção prometa queda do crime. Corrigir ou reformular
  a promessa após comparar a partida de referência com as rotas.
- O custo descrito em `policiamento-orientado` não possui consequência fiscal
  direta. Antes de anunciar gasto ao jogador, ligar o custo ao orçamento ou
  remover a promessa numérica da opção.
- `cannabis-legal` depende de `usuario-nao-preso` ou `uso-e-saude`; se for
  introduzida uma opção intermediária de critério objetivo na lei mãe, conferir
  se ela também deve satisfazer essa dependência.
- Câmeras corporais, organização da polícia, vagas e gestão dos presídios,
  inteligência e combate às facções continuam controles separados. Seus efeitos
  podem compor as duas rotas jogadas, mas não serão embutidos artificialmente
  nas quatro leis deste lote.
