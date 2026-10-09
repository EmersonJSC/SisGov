# Conteúdo do SisGov

Todo o conteúdo do jogo é JSON e fica aqui, em três partes (decisões D-38 e
D-39 do [PLANO](../../PLANO.md)):

```text
conteudo/
  mundo/          ← vale para todos os países
    mundo.json    (lista o que compõe o mundo)
    leis/         (o que cada lei é e seus limites; nunca quantidades)
    catalogo-leis.json
    indicadores/  (os nós da rede)
    consequencias/(como um nó afeta outro: mesma força em todo país)
    eventos/, situacoes/
  paises/
    brasil/       ← só o pacote inicial do país
      pais.json            (aponta para o mundo; perfis da população)
      estado-inicial.json  (leis vigentes e níveis, limites próprios,
                            valores iniciais dos nós, fiscal, política)
      organizacao-politica.json
  testes/         ← pacotes pequenos usados pelos testes e pela bancada
```

## Regras

- **Não existe "lei do Brasil".** Existe a lei; o país começa com um pacote
  delas, cada uma num nível.
- **A consequência é universal e determinística.** Diferenças entre países
  vêm do estado inicial dos nós. Ex.: fentanil é um nó do mundo, alto em um
  país e zero em outro. Tudo que tem peso está na rede.
- **Nada no mundo cita país, moeda concreta ou fonte nacional.** Dinheiro no
  mundo usa `moeda_ano`; a moeda concreta está na ficha fiscal do país. Um
  teste (`worldAndCountry.test.ts`) garante isso.
- **Limites:** o nó do mundo tem um domínio genérico; a lei pode apertá-lo
  (em %); o país pode apertá-lo de novo em `limitesProprios`. Vale o mais
  restritivo.

## Criar um país novo

1. Copie `paises/brasil/` com outro nome e troque os IDs.
2. Em `estado-inicial.json`, declare as leis vigentes e seus níveis, os
   limites próprios e o valor inicial de **todos** os nós do mundo.
3. `npm test` valida todos os pacotes; a bancada (`motor-demo.html`) lista
   o país automaticamente (`pais.json` ou `cenario.json`).

O formato das leis está em
[`docs/arquitetura/catalogo-de-leis-v2.md`](../../docs/arquitetura/catalogo-de-leis-v2.md).
Conteúdo novo só pode usar mecanismos reconhecidos pelo motor; fórmulas
livres e código dentro de JSON são recusados.
