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

| Tipo                     | Quem escreve | Tamanho | sobre / quem / lado                             |
| ------------------------ | ------------ | ------- | ----------------------------------------------- |
| `lei-aprovada`           | Congresso    | médio   | lei / partidos que votaram não / posição da lei |
| `lei-rejeitada`          | Congresso    | pequeno | lei / partidos que votaram não / —              |
| `partido-saiu-da-base`   | Política     | grande  | — / partido / —                                 |
| `partido-entrou-na-base` | Política     | médio   | — / partido / —                                 |
| `eleicao-vencida`        | Política     | grande  | — / — / —                                       |
| `eleicao-perdida`        | Política     | grande  | — / — / —                                       |

Tipo novo: acrescentar em `TIPOS_DE_FATO` e nesta tabela.
