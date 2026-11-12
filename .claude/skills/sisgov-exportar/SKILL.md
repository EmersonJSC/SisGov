---
name: sisgov-exportar
description: Use when a SisGov law, index or area changes in docs/jogo/leis.xlsx, when the author asks to "exportar", or when touching scripts/exportar-planilha.ts or scripts/xlsx.ts — the sheet is the source and the JSON in src/conteudo/mundo/ is generated.
---

# Exportar a planilha

`npm run exportar` lê `docs/jogo/leis.xlsx` e escreve:

- índices em `src/conteudo/mundo/indicadores/variaveis.json` (novo com `inicial: 50`);
- leis em `src/conteudo/mundo/leis/*.json`;
- áreas do mapa em `areas.json` (esfera → uma das 8 áreas, `AREA_DA_ESFERA`).

## Regras

- **A planilha manda.** Mudar a lei na planilha e exportar; não editar o JSON
  gerado à mão.
- Todo arquivo gerado leva `"origem": "planilha"`. Lei escrita à mão (sem
  esse campo) nunca é tocada nem apagada pelo exportador.
- Lei que saiu da planilha e ainda está no jogo: apagar só com o autor, e
  limpar onde ela aparece (países de teste, `produtos.json`, testes).
- Toda lei passa por `validarLei` antes de escrever; erro para tudo.
- Leitor do xlsx é próprio (`scripts/xlsx.ts`, zip + XML, sem dependência).

## Formas e unidades (`faixaDe`, `pedacosDe`)

- Régua (`continua`): `fracao`, `meses`, `anos`, ou `livre` com
  `rotulo_unidade` (km/h, dias, "x o salário"). Acima de 100% ou negativo →
  `livre`.
- Degraus (`opcoes`): coluna Degraus.
- Dois controles / faixa dupla → duas leis com `parte_de`, força um nível
  abaixo.
- Divisão de 100% → uma lei de peso por fatia ("0 a 10 pontos"), sem lado
  nem efeito. Fatias separadas só por ";".
- Régua por setor → régua geral, por enquanto.
- Escolha em lista (`FORMA_DE_LISTA`) fica de fora.

## Depois de exportar

`npx tsc -b`, testes de `src/motor/leis` e `src/partida`, e conferir que os
países de teste ainda iniciam. Planilha aberta no LibreOffice não é salva
pelo script: avisar o autor para fechar antes de editar por Python.
