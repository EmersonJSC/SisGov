# Índice das leis: fonte de edição

> **Status: VIGENTE.** Decisão do autor em 19/out/2026. O índice é a fonte das
> leis. Os JSONs individuais do jogo são saídas geradas.

## Como funciona

`indice-leis.jsonl` tem uma linha por lei. Cada linha guarda a definição
completa (`lei`), as consequências (`efeitos`) e, quando existirem, o ponto na
bússola (`bussola`) e o estado inicial do Brasil (`brasil`). A consulta mostra
somente um resumo, para economizar contexto. O estado `revisadaNoLote` vem de
`leis-revisadas.json`; não é um campo a editar na definição da lei.
O campo opcional `jogo` guarda a revisão por ciclos: `ciclos`, `papel`,
`projetos` (rotas potenciais) e `decisao`. Ele permanece no índice e não entra
no JSON executado pelo motor. Sua presença **não** significa que a lei ou o
ciclo tenha sido aprovado; o relatório do ciclo registra as lacunas abertas.
Para uma lei nova que precise de controle próprio, o campo opcional `variavel`
guarda sua definição completa. O gerador publica a variável, protege edições
externas e coloca a lei no ministério indicado; se houver mais de um ministério
com o mesmo nome, use `ministerioId` no registro do índice.

Os 243 JSONs de leis foram importados sem alterar os arquivos do jogo. Também
foram importadas 1.641 consequências ligadas a elas. Duas consequências da lei
`intermediacao-e-qualificacao` já eram referidas, mas ainda não tinham arquivo;
esse estado incompleto foi preservado. A primeira geração alterou **zero**
arquivos do jogo.

## Fluxo de edição

```sh
python3 scripts/conteudo/indice_leis.py listar --area trabalho
python3 scripts/conteudo/indice_leis.py listar --id licenca-parental --incluir-revisadas --fonte > /tmp/lei-editada.json
# Edite /tmp/lei-editada.json: lei, efeitos, bussola ou brasil.
python3 scripts/conteudo/indice_leis.py salvar --arquivo /tmp/lei-editada.json
python3 scripts/conteudo/indice_leis.py gerar
```

Para criar uma lei, prepare um registro com `id`, `lei` e `efeitos` e use
`salvar`. Para retirar uma lei, use `excluir --id ID` e depois `gerar`. Se outra
lei ou outro conteúdo ainda depender dela, a geração recusa a remoção até a
referência ser resolvida. Dependências entre leis são corrigidas **no índice**.
As listas do catálogo, consequências do mundo, bússola
e estado inicial do Brasil são atualizadas pela geração.

`leis-geradas.json` guarda os arquivos que pertencem ao gerador e seus hashes.
Se algum deles for alterado diretamente, a geração para antes de sobrescrevê-lo.
Assim, uma edição fora do índice não desaparece em silêncio. Arquivos que não
pertencem a leis, como efeitos de eventos, continuam fora desse gerador.

## Consultas curtas

Para navegar sem abrir o índice inteiro:

```sh
python3 scripts/conteudo/indice_leis.py mapa
python3 scripts/conteudo/indice_leis.py pendentes --setor trabalho
python3 scripts/conteudo/indice_leis.py buscar --termo ferrovias
python3 scripts/conteudo/indice_leis.py candidatos --setor trabalho
python3 scripts/conteudo/indice_leis.py vizinhas --id intermediacao-e-qualificacao
python3 scripts/conteudo/indice_leis.py ficha --id intermediacao-e-qualificacao
python3 scripts/conteudo/indice_leis.py ciclo --ciclo industrializacao-energia
```

`mapa` reúne as áreas antigas em 11 setores para mostrar a fila. `buscar`
encontra leis revisadas e pendentes pelo nome, descrição, opções ou alvos; use
`--somente-pendentes` para restringir. `vizinhas` revela dependências, controles
iguais e indicadores afetados em comum. `ficha` mostra opções, efeitos e
referências de uma lei, sem despejar sua definição inteira.

Listagens e relações mostram **12 resultados por página**. Use `--pagina 2` ou
`--limite 6` para controlar a saída; `--setor` ou `--area` restringem o recorte.
`listar` e `pendentes` excluem as revisadas por padrão. `candidatos` mostra
pares que ainda tenham uma lei pendente; `--incluir-revisadas` inclui também
pares já revisados. A definição completa só aparece com
`listar --id ID --fonte`. Alertas de duplicação e opções provisórias são triagem;
nenhuma lei é fundida ou excluída automaticamente.
