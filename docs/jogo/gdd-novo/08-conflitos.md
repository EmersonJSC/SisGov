# Fase 2: revisão dos rascunhos e conflitos

14/nov/2026. Os 7 rascunhos (`01` a `07`) somam cerca de 4.000 linhas e mais
de 2.300 citações.

**Conferência:**
- Todas as citações com linha apontam para uma linha que existe.
- Uma amostra de 18 citações foi lida na fonte, e todas batiam.
- Os agentes marcaram 52 ⚠ CONFLITO. Separei em três tipos:
  - **A. Estado:** um documento está atrasado em relação a outro ou ao código.
    Resolvo eu, conferindo no código.
  - **B. Já decidido:** a fonte mais nova revoga a velha, ou o autor decidiu na
    conversa de 14/nov. Vale a nova.
  - **C. Decisão do autor:** são as perguntas.

## A. Estado (conferido no código em 14/nov)

| Conflito | O que vale |
|---|---|
| R7.8 Revogar: ☐ no mapa × ✅ nos requisitos | ✅ feito (botão na folha; lei essencial não se revoga) |
| R7.11 Lei pela instituição: ☐ no mapa e no `governo.md` × ✅ nos requisitos | ✅ feito: efeito × rendimento da instituição, com teto 1 (`turno/etapas/jogabilidade.ts`). **Corrige o que eu disse hoje** ("pouca verba ainda não enfraquece a lei" estava errado) |
| R7.16 Tipos: ☐ nos requisitos × feito no motor | ◐: Lei com prazo e Ato feitos (`leis.md`); Posição por país e Operação faltam |
| R7.15: GDD lista "Dois controles" como forma | Feito como duas leis; a forma sai do GDD |
| 16 grupos e 25 pops no motor × 25 e 32 no GDD | O GDD é a meta; o motor está atrás |
| 511 × 512 leis | 511 hoje (o Imposto de renda virou 3, e outras se juntaram) |
| 73 × 74 programas | 73 no `programas.json` |
| "68 das 71 leis" na planilha de pops | Número velho (05/nov) |
| A bússola do pop "não move nada" (`populacao.md`) × move (`grupos.md`, 03/nov) | Move; o `populacao.md` está velho |
| Cesta: mesma quantia por pessoa (motor) × fatia da renda por estrato (GDD) | O GDD é a meta; o motor está atrás |
| Regra fiscal: Punição (GDD) × teto da carga (`fisco.md`) | As duas existem desde a onda 1 |
| Dívida com prazo e moeda de fora (GDD) × "não vence" (motor) | O GDD é a meta |
| Partido "nada feito" × criar partido e chapa feitos | Partido, chapa e lado feitos; o resto falta |
| Opinião entre países: 0 a 100 (motor) × −100 a +100 (GDD) | O GDD é a meta |
| Veto de toda lei (GDD) × só a lei emendada (código) | O GDD é a meta |
| Janelas: "nada as abre" × R17.23 | R17.23 (13/nov) é a mais detalhada; conferir na tela |
| Potências inventadas (`mundo.md`) × países reais | Países reais (08/nov revoga) |

## B. Já decidido (vale a mais nova)

| Conflito | O que vale e por quê |
|---|---|
| Pilares População/Economia/Governo × Gosto/Economia/Leis | Gosto (a população e como funciona), Economia, Leis. Decidido na conversa de 14/nov; o lugar do Estado fica em C |
| "A Bússola é a raiz" × bolso mais forte | Gosto = bolso (mais forte) + bússola (menor) + memória (14/nov, conversa) |
| Princípio 5 (só o Estado) × nenhum dinheiro some | Nenhum dinheiro some, nem o ilegal (14/nov, conversa); o princípio 5 é reescrito |
| Corrupção que "some de verdade" × vai a um bolso | Vai ao bolso de alguém e deixa rastro (14/nov, conversa) |
| Jeito Escolha × saiu | Saiu (14/nov, conversa); as 7 leis com Escolha viram Níveis na revisão |
| Degrau "nada" (skill, drogas) × nada = não legislada | Não legislada (GDD §7, 14/nov); só a lei essencial pode ter "nenhum" |
| "Um lado por lei" × régua sem limite | Não se contradizem: a régua vai ao extremo real, mas num lado só |
| Verba "dá a uma instituição" × canal verba ou transferência | O jeito Verba cobre os dois canais: a instituição ou o pop |
| Ficha por setor com projeto de lei (02/nov) × Operação sobre companhia (08/nov) | Operação (08/nov) |
| Quem fica sem luz: automático (02/nov) × o jogador escolhe (08/nov) | O jogador escolhe, num papel (08/nov; elogiado na skill lei-boa) |
| Aumentar a corte: lei (13/nov) × ação (14/nov) | Ação ("sai da lei", 14/nov) |
| Eleições ligada a Justiça e prisões (planilha) × ao Judiciário (GDD 13/nov) | Judiciário (o GDD diz "não com Justiça e prisões") |
| Mapa em três anéis por área (30/out) × hierarquia sem áreas (13/nov) | 13/nov; as artes e bolhas por área saem junto |
| Juízes "de mentira" × "de verdade" | De verdade (14/nov) |
| Preço por turno; divisão da verba não é fixa | Decididos na conversa de 14/nov; entram com essa data |

## C. Decididas pelo autor (14/nov)

1. **Estado:** já definido no GDD. A lei mora numa instituição, e a
   instituição fica com um ministro; por isso instituições, ministros, caixas
   e fronteira do governo entram em **Leis** ("quem executa a lei"). As
   contas do Estado (Tesouro, receita, gasto, dívida) entram em **Economia**,
   porque são dinheiro. Presidente, vice, sucessão, pessoas e governadores
   entram em **Política**. Assim a parte "Estado" deixa de existir.
2. **Ministros:** a memória de 30/out está velha; refazer com o que já existe
   e o que falta.
3. **Mídia:** age em cima dos fatos que já existem (é lente, não fonte nova).
   ESTUDAR como a mídia mexe em cada uma das 3 mecânicas.
4. **Radicais:** nascem da **piora** do padrão de vida, não do nível.
5. **Justiça:** não há conflito. A lei **Quem escolhe os juízes** (arquivo
   `indicacao-de-juizes`, escada de 3 degraus) decide quem escolhe; a
   **Independência da Justiça** é índice, que sobe com juízes técnicos e cai
   com juízes do partido; a lei **Independência dos investigadores** é
   separada. O autor lembra de "uma lei que define quanto a corte é
   independente": hoje não existe lei com esse papel além dessas; fica em
   aberto se precisa.
6. **Tipos de dono:** os 9 da planilha valem por enquanto; ESTUDAR se fazem
   sentido, se falta ou sobra algum.
7. **Energia:** os dois juntos. A usina dá capacidade, e a eletricidade é
   produto do mercado, com preço e importação (como no Victoria 3).
8. **Atraso zero:** o efeito vem no turno seguinte.
9. **Meta e prazo:** sai; vira duas leis ou uma Lei com prazo.
10. **Arte:** vale o `direcao-de-arte.md`; as artes de `public/arte/` foram
    apagadas de propósito.

Menores, em "Em aberto" na parte delas: blocos da bolsa; verba da estatal
por lei ou por setor; peso da reputação entre países; quando as narrativas
entram ("depois do motor e dos índices" e "depois da V1 jogável" contam como
a mesma coisa).
