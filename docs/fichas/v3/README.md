# Ficha de lei, formato v3

> **Status: VIGENTE.** Formato da lei na versão 1 (V1-05). Regras de conteúdo
> em `docs/v1/conteudo.md` 1.1 e 1.2. Os formatos v1 e v2 estão desativados.

A ficha é um arquivo só por lei, em `src/conteudo/mundo/leis/<id>.json`, com
os efeitos dentro dela. Não há mais um arquivo de consequência por efeito.

## Como o jogo lê a ficha

O carregador (`src/game/pais/loadScenarioPackage.ts`) chama
`expandirFichasV3` antes do motor:

1. o **verificador** confere a ficha (regras abaixo) e recusa com mensagem que
   aponta o arquivo e o campo;
2. o **conversor** gera a lei no formato que o motor lê (v2) e uma consequência
   por efeito, no caminho `<ficha>#<id do efeito>`;
3. o mundo que lista a lei passa a listar essas consequências.

O motor não sabe que a ficha existe. Durante a migração, leis v2 e fichas v3
convivem no mesmo catálogo. `npm run fichas:migracao` mostra quantas faltam.

## Campos

| Campo | Obrigatório | O que é |
| --- | --- | --- |
| `id`, `tipo: "lei"`, `versaoEsquema: 3` | sim | |
| `nome`, `descricao` | sim | Neutros, sem nome de programa ou órgão de um país, sem travessão |
| `area`, `ministerio` | sim | |
| `nivel` | sim | `constituicao`, `lei` ou `decreto` |
| `petrea` | não | Só em constituição: não muda por votação |
| `revogavel` | não | Padrão do motor: só lei e decreto saem do mapa |
| `grupo` | não | Padrão deduzido (tabela abaixo); só quando o padrão não serve |
| `controle` | sim | `variavel` (controle existente), `unidade`, `opcoes` |
| `custoPolitico` | não | `aprovar`, `revogar`, `subir`, `baixar` (usado a partir da V1-10) |
| `dinheiro` | não | `{tipo: "gasto", modo, base?, limites?}` ou `{tipo: "receita", base, limites?}` |
| `implantacao` | não | `entrada` e `saida`: fração do caminho por turno. Sem o campo, a mudança é imediata |
| `dependeDe` | não | Leis exigidas: `{lei, opcoes, motivo?}` |
| `excludentes` | não | Leis que não convivem com esta (conferidas; regra no jogo depois) |
| `requer` | não | Características do país, `exige` e `proibe` (usado a partir da V1-06) |
| `efeitos` | sim | De 3 a 8 (abaixo) |
| `populacao` | não | Segmentos que gostam e não gostam (usado a partir da V1-08) |
| `historia` | não | `opcoes`: países por opção; `brasil`: o caso brasileiro |
| `fontes` | sim | Pelo menos uma: `{titulo, url, usadoPara?}` |

### Efeito

| Campo | Obrigatório | Padrão |
| --- | --- | --- |
| `alvo` | sim | Índice existente (não controle) |
| `mecanismo`, `parametros` | sim | Os mecanismos do motor (`docs/arquitetura/mecanismos-da-rede.md`) |
| `atraso` | sim | Inteiro, em turnos |
| `duracao` | não | Contínuo |
| `origem` | não | O controle da lei |
| `normalizacao`, `leitura`, `escala` | não | Como no motor |
| `unidade` | não | A do alvo; taxa por passo quando o alvo é estoque |
| `id` | não | `<lei>--<alvo com hífens>`; só quando dois efeitos têm o mesmo alvo |

### O que o conversor deduz

| Ficha | Processo | Nível legal | Grupo |
| --- | --- | --- | --- |
| constituição | `emenda-constitucional` | `constitucional` | institucional |
| constituição pétrea | `clausula-petrea` | `petrea` | institucional |
| lei | `lei-ordinaria` | `derivada` | regulatória |
| decreto com `dinheiro` de gasto | `execucao-programa-autorizado` | `derivada` | orçamentária |
| decreto sem gasto | `decreto` | `derivada` | regulatória (tributária com receita) |

Toda ficha v3 usa os três níveis de lei (D-65). Na prática, uma lei em vigor
vale em qualquer opção, inclusive a de valor zero.

## O que o verificador recusa

- ficha sem fonte, ou fonte sem título ou sem link http(s);
- efeito em índice que não existe, origem que não existe, atraso que não é
  inteiro, dois efeitos com o mesmo id;
- menos de 3 ou mais de 8 efeitos;
- constituição ou lei fora de 2 a 5 opções; decreto com opções que não sejam
  zero (faixa) ou duas (liga e desliga);
- `petrea` fora da constituição; controle que não existe;
- `dependeDe` ou `excludentes` apontando para lei ou opção inexistente;
- travessão no texto, ou nome de programa ou órgão de um país no nome, na
  descrição ou nas opções (lista em `src/game/pais/fichaV3/verificar.ts`).

A área ainda não é conferida contra as 10 áreas da versão 1: as leis atuais
usam os nomes antigos, que mudam na migração de cada área.

## Leis piloto

`piso-salarial-professores` (lei), `policia-militar` (constituição) e
`verba-policia-federal` (decreto de orçamento). O teste
`src/tests/fichaV3.test.ts` prova que as três se comportam como antes no
turno. Os coeficientes dos efeitos vieram do formato antigo e ainda não têm
fonte de dados (D-44); as fontes da ficha cobrem a existência da lei e os
países. A calibragem entra na V1-07.
