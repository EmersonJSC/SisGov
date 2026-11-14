# Mesa de fatos

Memória curta da partida, como uma RAM: cada módulo escreve o que aconteceu
e lê o que precisa. Nenhum módulo chama outro; eles só se encontram aqui
(requisito R4.12, 12/nov).

## Regras

1. **Escrever.** Cada etapa do turno põe na mesa o que fez (`novoFato`).
   Ficha: tipo, turno, tamanho, do que se trata (`sobre`), quem está
   envolvido (`quem`) e para onde puxa na bússola (`lado`).
2. **Ler.** O módulo pergunta só o que interessa (`consultar`): por tipo,
   assunto, envolvido, tamanho mínimo ou turno. Ninguém percorre a lista
   para decidir por conta própria.
3. **Fato gera fato.** Um módulo pode ler um fato e escrever outro no mesmo
   turno; quem vem depois na ordem das etapas já lê o novo.
4. **Some aos poucos.** O fato fica na mesa por turnos conforme o tamanho:
   pequeno 1, médio 2, grande 3. A força (`forcaDoFato`) cai a cada turno.
5. **RAM e disco.** A mesa é curto prazo. O que deve durar mais (rancor de um
   grupo, promessa quebrada) o módulo guarda no próprio estado.

## Tipos

| Tipo                     | Quem escreve | Tamanho                   | sobre / quem / lado                             |
| ------------------------ | ------------ | ------------------------- | ----------------------------------------------- |
| `lei-aprovada`           | Congresso    | médio                     | lei / partidos que votaram não / posição da lei |
| `lei-rejeitada`          | Congresso    | pequeno                   | lei / partidos que votaram não / —              |
| `partido-saiu-da-base`   | Política     | grande                    | — / partido / —                                 |
| `partido-entrou-na-base` | Política     | médio                     | — / partido / —                                 |
| `eleicao-vencida`        | Política     | grande                    | — / — / —                                       |
| `eleicao-perdida`        | Política     | grande                    | — / — / —                                       |
| `emenda`                 | Congresso    | médio                     | lei / — / —                                     |
| `papel-assinado`         | Mesa         | pequeno                   | lei / — / —                                     |
| `papel-vetado`           | Mesa         | médio                     | lei / — / —                                     |
| `papel-ignorado`         | Mesa         | pequeno                   | lei / — / —                                     |
| `veto-derrubado`         | Congresso    | grande                    | lei / partidos contra / —                       |
| `decreto`                | Congresso    | médio                     | lei / — / posição da lei                        |
| `decreto-derrubado`      | Congresso    | grande                    | lei / partidos contra / —                       |
| `promessa-cumprida`      | Congresso    | pequeno                   | lei / partido / —                               |
| `promessa-descumprida`   | Congresso    | grande                    | lei / partido / —                               |
| `partido-ameaca-sair`    | Política     | médio                     | — / partido / —                                 |
| `programa-formado`       | Programas    | grande (médio se refeito) | programa / — / —                                |
| `programa-desfeito`      | Programas    | médio                     | programa / — / —                                |
| `meta-cumprida`          | Eleição      | médio                     | índice ou programa / — / —                      |
| `meta-quebrada`          | Eleição      | grande                    | índice ou programa / — / —                      |
| `segundo-turno`          | Eleição      | grande                    | — / — / —                                       |
| `juiz-aposentado`        | Judiciário   | médio                     | tribunal / — / —                                |
| `juiz-nomeado`           | Judiciário   | médio                     | tribunal / — / lado do juiz                     |
| `indicado-barrado`       | Judiciário   | grande                    | tribunal / — / —                                |
| `corte-novo-presidente`  | Judiciário   | médio                     | tribunal / — / —                                |
| `escandalo`              | (mídia)      | —                         | só lido pelo Congresso por ora                  |
| `manchete-contra`        | (mídia)      | —                         | só lido pelo Congresso por ora                  |
| `grupo-com-raiva`        | (grupos)     | —                         | ninguém escreve nem lê ainda                    |

Tipo novo: acrescentar em `TIPOS_DE_FATO` e nesta tabela.
