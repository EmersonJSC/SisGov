---
name: sisgov-pais
description: Use when creating or editing a SisGov country folder (src/conteudo/paises/<id>/) — real countries like brasil-2026 or test countries — including starting indices, Congress parties, companies, energy and the laws in force.
---

# Montar um país

Pasta `src/conteudo/paises/<id>/`. Começar copiando um país de teste que
inicia (`teste-pobre`) e trocar os valores; o formato vale pelo código em
`src/partida/` e `src/conteudo/`, não por esta página.

## Arquivos

| Arquivo | O que tem |
|---|---|
| `estado-inicial.json` | moeda, população, ocupados, PIB, inflação, juros, dívida, cofre, índices de jogabilidade, parâmetros |
| `congresso.json` | partidos com nome, cor, cadeiras (somam o total da Câmara) e `defende`; governo e coligação |
| `empresas.json` | companhias fictícias |
| `producao.json` | capacidade de energia por fonte |
| `leis-vigentes.json` | valor de cada lei hoje no país |

## Regras

- **Nada real além de nome e cor de partido.** Pessoa e empresa reais ficam
  de fora (companhia inventada: "PNAC Petrolífera Nacional"). Marca e sigla
  de partido também não.
- Número na ordem de grandeza certa; conferir na internet, sem baixar banco
  inteiro (memória "dados rasos").
- O motor não conhece o país: rótulo local ("Selic") fica no país.
- Índice que o país não declara pega o `inicial` de `variaveis.json`.

## Leis vigentes

- Contínua: número na unidade da régua (`fracao` como fração: 0.275).
- Degraus: o id da opção.
- Lei que o país não tem: fica de fora (vale o mínimo / primeiro degrau).
- Conferir cada valor com `motivoValorInvalido` (`src/motor/leis/valor.ts`)
  e as colisões com `colisoesDe` (`src/motor/leis/colisao.ts`).

## Armadilhas da partida ao iniciar

- `gasto_publico` tem de bater com `gastoDasLeis` + `gasto_fora_das_leis`
  (conferido em `src/partida/index.ts`). Mudou lei de verba → recalcular
  `gasto_fora_das_leis`.
- `atendimento` não pode passar `profissionais_saude`.
- Lei com colisão ativa derruba o início.

## Conferir

Script temporário (fora do commit) que roda `criarPartida("<id>", 1)` e
joga 24 turnos sem erro; depois abrir no navegador e mostrar.
