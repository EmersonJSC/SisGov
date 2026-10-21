# Documentos do SisGov

> **Status: VIGENTE.** Índice de todos os documentos, com o status de cada um.
> Atualizado em 12/out/2026 (chamado V1-01).

Todo documento tem um de três status:

- **VIGENTE**: é para seguir.
- **REFERÊNCIA TÉCNICA**: descreve o código como ele está hoje. Serve para entender
  o que existe, mas não define o que vamos fazer. Muda junto com o código.
- **DESATIVADO**: não é para seguir. Fica guardado como histórico.

## Vigentes

| Documento | Assunto |
| --- | --- |
| [`PLANO.md`](../PLANO.md) | Documento mestre e única fonte de status |
| [`AGENTS.md`](../AGENTS.md) | Regras para quem trabalha no código (pessoas e IA) |
| [`README.md`](../README.md) | Apresentação e como rodar |
| [`v1/chamados.md`](v1/chamados.md) | Os 32 chamados da versão 1 |
| [`v1/diferenciacao-d4.md`](v1/diferenciacao-d4.md) | Diferenciação do Democracy 4 e sala limpa |
| [`v1/arquitetura.md`](v1/arquitetura.md) | Camadas, módulos e dados |
| [`v1/reestruturacao.md`](v1/reestruturacao.md) | Destino de cada parte do código |
| [`v1/conteudo.md`](v1/conteudo.md) | Regras de conteúdo |
| [`conteudo/diretriz-geracao-leis-em-lotes.md`](conteudo/diretriz-geracao-leis-em-lotes.md) | Metodologia vigente para gerar e revisar leis em lotes |
| [`conteudo/auditoria-seguranca-mecanismos.md`](conteudo/auditoria-seguranca-mecanismos.md) | Auditoria V1-14: decisões, ciclo atual, lacunas e reformulação de Segurança |
| [`conteudo/revisao-propriedade-financas-publicas.md`](conteudo/revisao-propriedade-financas-publicas.md) | Execução de quatro leis sobre participação pública, empresas estatais e finanças |
| [`conteudo/simulacao-propriedade-32-turnos.jsonl`](conteudo/simulacao-propriedade-32-turnos.jsonl) | Séries de dez partidas, com contas em todos os turnos |
| [`conteudo/revisao-tributacao-e-extremos.md`](conteudo/revisao-tributacao-e-extremos.md) | Revisão de quatro leis tributárias e estresse nos limites legais |
| [`conteudo/simulacao-tributacao-16-turnos.jsonl`](conteudo/simulacao-tributacao-16-turnos.jsonl) | Séries fiscais de dez rotas tributárias |
| [`conteudo/plano-mestre-auditoria-leis.md`](conteudo/plano-mestre-auditoria-leis.md) | Plano de auditoria de game design para 100% do catálogo, com lotes, critérios e validação |
| [`v1/engenharia.md`](v1/engenharia.md) | Processo de trabalho |
| [`v1/ideias.md`](v1/ideias.md) | Ideias para depois |
| [`v1/desenho/`](v1/desenho/README.md) | Desenhos de cada sistema novo, aprovados antes do código |

## Referência técnica

| Documento | O que descreve | Até quando |
| --- | --- | --- |
| [`arquitetura/api-da-partida.md`](arquitetura/api-da-partida.md) | A fachada `src/app/partida.ts` | V1-03 divide a fachada |
| [`arquitetura/mecanismos-da-rede.md`](arquitetura/mecanismos-da-rede.md) | Mecanismos do motor | Continua |
| [`arquitetura/rede-viva.md`](arquitetura/rede-viva.md) | Leis, índices e situações no motor | V1-07 |
| [`arquitetura/orcamento-na-rede.md`](arquitetura/orcamento-na-rede.md) | Orçamento como parte da rede | Continua |
| [`arquitetura/ocorrencias.md`](arquitetura/ocorrencias.md) | Eventos, dilemas e situações | V1-24 |
| [`arquitetura/catalogo-de-leis-v2.md`](arquitetura/catalogo-de-leis-v2.md) | Formato atual dos JSONs de lei | V1-05 (ficha v3) |
| [`arquitetura/leis-em-tres-niveis.md`](arquitetura/leis-em-tres-niveis.md) | Níveis de lei do código atual (D-65) | V1-11 |
| [`conteudo/rede.md`](conteudo/rede.md) | A rede atual, gerada por `npm run rede:documento` | V1-14 a V1-23 |
| [`../src/engine/README.md`](../src/engine/README.md) e os demais `.md` de `src/engine/` | O motor por dentro | Continua |
| [`../src/conteudo/README.md`](../src/conteudo/README.md) | Organização atual do conteúdo JSON | V1-05 |

## Desativados

Tudo em [`desativado/`](desativado/LEIA-ME.md), com o motivo e o substituto de cada
arquivo. Também estão desativadas, mas continuam no lugar porque os scripts ainda
as leem, as fichas v1 e v2 em [`fichas/`](fichas/LEIA-ME.md). Saem quando a última
área migrar para a ficha v3 ([`fichas/v3/`](fichas/v3/README.md)).

## Fora do git

`docs/Exemplos/` guarda arquivos do Democracy 4 só na máquina do autor. O git
ignora essa pasta e nada dela entra no projeto (D-67).
