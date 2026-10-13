# Arquitetura da versão 1

> **Status: VIGENTE.** Descreve onde o código precisa chegar. O caminho até lá está em
> `reestruturacao.md`. Decisão D-68.

## 1. Camadas

```text
┌──────────────────────────────────────────────────────────┐
│ ui/        React: mapa, janelas, painéis. Só mostra e    │
│            envia intenções.                              │
├──────────────────────────────────────────────────────────┤
│ app/       Fachada da partida: criarPartida, mudarLei,   │
│            encerrarTurno, verPartida, salvar, carregar.  │
├──────────────────────────────────────────────────────────┤
│ jogo/      Regras do jogo: leis e níveis, capital        │
│ (game/)    político, turno, população, pressão,          │
│            ocorrências, eleição.                         │
├──────────────────────────────────────────────────────────┤
│ motor/     Simulação genérica: variáveis, ligações,      │
│ (engine/)  mecanismos, atrasos, situações, explicação.   │
│            Não conhece leis, países nem pessoas.         │
└──────────────────────────────────────────────────────────┘
        ▲ lê                        ▲ lê
┌──────────────────────┐   ┌──────────────────────────────┐
│ conteudo/ (JSON)     │◀──│ ferramentas/ (scripts)       │
│ mundo e países       │   │ fichas → JSON, verificador,  │
│                      │   │ checagem de realismo         │
└──────────────────────┘   └──────────────────────────────┘
```

**Regra de dependência:** nenhuma camada importa uma de cima. `ui` só fala com
`app`; `app` usa `jogo` e, por enquanto, tipos e explicações do `motor`; `jogo` usa
`motor`; `motor` não usa nada do projeto. Só `app` e `jogo` leem os JSONs de
`conteudo/`. O teste `src/tests/camadas.test.ts` (V1-04) quebra se alguém importar
no sentido errado.

Os nomes das pastas continuam `engine/` e `game/` para não mexer em centenas de
importações sem ganho. `domain/` e `scenarios/` deixam de existir: o que serve vai
para `game/` e `app/`.

## 2. Módulos da versão 1

| Camada | Módulo         | Responsabilidade                                                                      |
| ------ | -------------- | ------------------------------------------------------------------------------------- |
| motor  | `model/`       | Tipos e validação do pacote resolvido                                                 |
| motor  | `mechanisms/`  | Afim, pontos, limiar, estoque, resposta gradual                                       |
| motor  | `runtime/`     | Avançar o passo, atrasos, situações com entrada e saída, explicação                   |
| jogo   | `leis/`        | Catálogo, níveis (Constituição, lei, decreto), dependências, cascata, implantação     |
| jogo   | `bussola/`     | Bússola política: ponto do país pelas leis em vigor, peso das leis, referências       |
| jogo   | `congresso/`   | Câmara e Senado: bancadas, pauta, tramitação e votação                                |
| jogo   | `turno/`       | Ordem do trimestre: ações, três meses de motor, ocorrências, população, fechamento    |
| jogo   | `populacao/`   | Segmentos, perfis sintéticos, satisfação, aprovação                                   |
| jogo   | `pressao/`     | Grupos de pressão: mobilização e ações                                                |
| jogo   | `ocorrencias/` | Situações, eventos e dilemas                                                          |
| jogo   | `eleicao/`     | Eleição do fim do mandato                                                             |
| jogo   | `pais/`        | Leitura da configuração do país e das características                                 |
| app    | `partida/`     | Fachada dividida por assunto: `criar`, `leis`, `turno`, `visao`, `previsao`, `salvar` |
| ui     | `mapa/`        | Mapa de influência, janelas, catálogo, jornal, painéis                                |

## 3. Dados

```text
src/conteudo/
  mundo/
    leis/            uma ficha por lei (formato v3, gerado das fichas)
    indicadores/     índices e situações
    populacao/       segmentos e grupos de pressão
    ocorrencias/     eventos e dilemas do mundo
  paises/
    brasil/
      pais.json        identidade, cenário e características (versaoEsquema 2)
      politica.json    ministérios, organização política, estado político, leis eleitorais
      economia.json    população, PIB, orçamento de partida, limites próprios
      leis.json        leis em vigor (lei + opção) e valor de cada controle
      valores.json     valor inicial dos índices e dos estoques
      populacao.json   perfis da população
      historia.json    abertura, metas do mandato e lugares do mapa
  testes/
    pais-minimo/       país de teste sem litoral; prova que a configuração funciona
```

**Carga.** `game/pais/configuracao/expandirPais.ts` lê os sete arquivos, recusa
característica desconhecida, arquivo ausente e lei em vigor que o país não
comporta, tira do pacote as leis, eventos, situações e dilemas cujo `requer` o país
não atende e monta o manifesto e o estado inicial que o motor já conhecia. O motor
não muda e não vê `requer`. Ocorrências só de um país ficam para quando houver o
segundo país.

**Fonte única.** As fichas em `docs/fichas/v3/` são a fonte das leis; o JSON em
`src/conteudo/mundo/leis/` é gerado e não se edita à mão. O verificador roda no
`npm test`.

## 4. Estado da partida

A partida é um valor imutável: cada ação devolve uma partida nova. O estado guarda
o turno, as leis e seus níveis, o capital político, a execução do motor, as
ocorrências, a população e o diário. Salvar é serializar esse valor com a versão
do esquema; carregar valida a versão.

## 5. Qualidade

- **Testes por camada:** motor com exemplos calculáveis à mão; jogo com partidas
  curtas determinísticas (semente fixa); conteúdo pelo verificador; interface com
  testes de componente e uma captura de tela por marco.
- **Determinismo:** todo sorteio usa o gerador com semente da partida.
- **Desempenho:** um turno do Brasil completo em menos de 200 ms no notebook.
