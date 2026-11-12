# Mídia (só o começo: jornal mínimo)

Passo 7 da ordem de construir (12/nov/2026). Entram só R14.1 (as mídias do
país) e R14.4 (o jornal do turno). Pauta, enquadramento, fato e versão, raiva,
leis de mídia e atos do presidente ficam para o passo 12.

O motor não conhece nome nem texto. As **mídias** são do país
(`paises/<id>/midias.json`, geradas por `npm run midias -- <id>`; nomes
inventados); o **texto das manchetes** é do mundo
(`mundo/jornal/manchetes.json`) e só vira frase na camada `partida`
(`partida/jornal.ts`).

Código: `tipos.ts`, `jornal.ts` (impacto e jornal), `index.ts` (porta e validação).

## Mídias do país (R14.1)

Cada uma tem `dono` (privado, estatal, estrangeiro ou rede), `bussola`,
`audiencia` (fração de cada grupo que assiste, de 0 a 1) e `credibilidade`
(0 a 100). O estado guarda a credibilidade de cada uma (`estado.midia`).
Hoje **ninguém lê** a audiência nem a credibilidade: elas esperam o passo 12.
O gerador calcula a audiência pela distância entre a bússola do grupo e a da
mídia (perto, mais; longe, quase nada), vezes o alcance da mídia.

## Jornal do turno (R14.4)

Etapa 9b, depois de todos os módulos que escrevem fatos. Só entram fatos
**deste turno**; cada um recebe um impacto:

`impacto = peso do tamanho (1, 2, 3) × força do fato × apelo do tipo`

O apelo do tipo está numa tabela (eleição 3, escândalo 2,5, programa formado
1,5…; o que não está vale 1; papel assinado ou ignorado 0,5). O jornal guarda
as 3 maiores, da maior para a menor; empate fica na ordem em que os fatos
foram escritos. A primeira abre o jornal.

## Manchetes

`mundo/jornal/manchetes.json` tem um molde por tipo de fato, com `{lei}`,
`{quem}`, `{caixa}`, `{area}` e `{programa}`; `comQuem` é o molde usado quando
o fato diz quem está envolvido. Mais de 3 envolvidos viram "N partidos". Tipo
de fato novo precisa de molde (um teste confere).

## Dívidas

- Ninguém lê audiência nem credibilidade (passo 12: pauta e enquadramento).
- O jornal é um só e neutro; o mesmo fato não sai a favor numa mídia e contra
  noutra ainda.
- O jornal não é uma janela própria: aparece no topo do Resultado do turno.
- Perfil da mídia e das redes na tela.
- Só o Brasil tem `midias.json`; os países de teste ficam sem mídias.
