# Documentos desativados

> **Status: DESATIVADO.** Nada nesta pasta é para seguir. Os arquivos ficam
> guardados como histórico das decisões antigas. O que vale está no
> [`PLANO.md`](../../PLANO.md) e em [`docs/v1/`](../v1/chamados.md).
> Desativados em 12/out/2026, no chamado V1-01.

Os links dentro destes arquivos podem estar quebrados, porque eles foram movidos
de lugar. O conteúdo não foi alterado; cada arquivo `.md` ganhou só um aviso no
topo.

## Estudos do Democracy 4

Os dois estudos diretos do D4 (um `.docx` e `pesquisa-democracy4-efeitos-apoio.md`)
saíram do git no chamado V1-02. Ficam só na máquina do autor, em
`docs/Exemplos/estudos-antigos/`, que o git ignora. Pela regra de sala limpa
([`diferenciacao-d4.md`](../v1/diferenciacao-d4.md), D-67), ninguém que escreve
conteúdo deve abri-los.

## Planos e processo

| Arquivo | Motivo | Substituto |
| --- | --- | --- |
| `PLANO-antigo.md` | Plano do MVP com os chamados SG100 a SG162, marcos M0 a M5 e regras anti-ciclo. Misturava escopo de várias versões | [`PLANO.md`](../../PLANO.md), [`engenharia.md`](../v1/engenharia.md) |
| `plano-de-producao.md` | Plano de produção original, já histórico no plano antigo | [`PLANO.md`](../../PLANO.md) |
| `motor-do-jogo.md` | Proposta técnica do motor, anterior ao motor real | [`arquitetura.md`](../v1/arquitetura.md) e `src/engine/README.md` |
| `Motor de simulacao do SisGov.docx` | Versão em Word da proposta do motor | Idem |
| `historico/` | Plano de produção em Word | [`PLANO.md`](../../PLANO.md) |
| `qualidade/` | Verificação do SG008 | [`engenharia.md`](../v1/engenharia.md) |
| `producao/` | Chamados SG001 a SG060: escopo da primeira versão, quadro de chamados, fluxo de branches, cenário inicial, contrato político, estudos de eleição e fiscal, menu e mapa | [`PLANO.md`](../../PLANO.md) e [`docs/v1/`](../v1/chamados.md) |

## Arquitetura antiga

| Arquivo | Motivo | Substituto |
| --- | --- | --- |
| `arquitetura/contrato-motor-json.md` | Contrato de 8/out; aponta o plano de produção como fonte de status e inclui parlamento | [`arquitetura.md`](../v1/arquitetura.md) |
| `arquitetura/conteudo-configuravel-json.md` | Diretriz de conteúdo anterior ao mundo e país | [`arquitetura.md`](../v1/arquitetura.md), [`conteudo.md`](../v1/conteudo.md) |
| `arquitetura/modelagem-do-dominio.md` | Modelo de domínio com propostas e votação | [`arquitetura.md`](../v1/arquitetura.md) |
| `arquitetura/plano-migracao-modelagem-dominio.md` | Plano de migração para o domínio antigo | [`reestruturacao.md`](../v1/reestruturacao.md) |
| `arquitetura/opinioes-personagens.md` | Personagens ficam para a versão 2 | Seção 6 do [`PLANO.md`](../../PLANO.md) |
| `arquitetura/selecao-historias-personagens.md` | Idem | Idem |
| `conteudo/camadas.md` | Mapa da rede por camadas (SG155, regra R-11) | [`conteudo.md`](../v1/conteudo.md) |

## Também desativados, mas ainda fora desta pasta

| Onde | Por que ainda está lá | Quando sai |
| --- | --- | --- |
| `docs/fichas/` (fichas v1 e v2, `METODO.md`, `LEIS.md`) | Os scripts de `scripts/fichas/` ainda leem esses arquivos | V1-05 |
| Documento de revisão geral de 11/out e plano do catálogo (Claude Docs, fora do repositório) | Propunham partir da estrutura e das políticas do D4 | Já substituídos por `docs/v1/` |

## Arquivos que não estão no git

`docs/testes/` (relatórios de 10/out) e quatro imagens em
`producao/referencias/` (mapas das 116 leis) estavam sem commit antes do V1-01 e
continuam assim. O autor decide se entram.
