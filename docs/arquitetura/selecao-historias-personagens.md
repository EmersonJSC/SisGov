# Seleção de histórias para personagens

Especificação técnica proposta para o recorte autorizado da V1. Complementa
[SG057-B2](../producao/sg057-b2-contrato-politico.md). Apenas documentação:
nomes de campos abaixo orientam o esquema futuro, não são aceitos pelo carregador
atual. Valores dos exemplos são hipóteses de design, não parâmetros já implementados.

## Dados separados

O personagem já existe, com identidade, atributos e fatos de trajetória gerados.
A história tem ID, versão, texto, requisitos, impedimentos, pesos de tags e política
de reutilização. Dados de seleção não alteram os atributos do personagem.

Tags descrevem compatibilidade temática. Fatos concretos afirmados pelo texto
devem constar nos requisitos: mencionar carreira militar exige esse fato, não
apenas afinidade ideológica com militares. O motor valida requisitos declarados,
mas não interpreta prosa para descobrir contradições; revisar os textos faz parte
da validação editorial dos pacotes.

## Seleção

1. Validar IDs, tipos, referências, campos obrigatórios e números finitos.
2. Eliminar histórias cujos requisitos não sejam satisfeitos ou cujos impedimentos
   sejam verdadeiros. Verificar também disponibilidade dos campos usados no texto.
3. Aplicar a política de reutilização e o limite de usos, quando declarado.
4. Calcular `pontuacao = pesoBase + soma(pesos das tags coincidentes)`.
   Todos os pesos são explícitos, finitos e não negativos. Uma tag do personagem
   conta uma única vez; IDs de tags repetidos na história são erro.
5. Entre candidatas com pontuação positiva, sortear proporcionalmente à pontuação,
   em ordem estável de ID e usando o gerador persistido da partida. Normalizar
   com proteção contra estouro numérico. Mesmos dados, versão e estado do gerador
   devem produzir a mesma atribuição, independentemente da ordem dos arquivos.
6. Preencher campos permitidos e confirmar história, uso e avanço do gerador juntos.
   Falha não pode consumir um uso nem deixar um sorteio parcialmente confirmado.

Exemplo: personagem com tags `educacao` e `lideranca_local`. Duas histórias
compatíveis têm peso-base 1; uma soma 3 pela tag `educacao`, a outra soma 1 por
`lideranca_local`. Pontuações 4 e 2 produzem chances de 2/3 e 1/3. Uma história
militar incompatível continua excluída, mesmo que tenha peso muito maior.

Peso-base positivo permite correspondência aproximada entre histórias sem tags
coincidentes, desde que os requisitos sejam atendidos. Peso-base zero permite
exigir alguma coincidência positiva. Não confundir pontuação narrativa com
preferência política, popularidade ou força eleitoral.

## Reutilização e falta de correspondência

Definir explicitamente no conteúdo `reutilizavel` ou `unica_por_partida`.
Histórias genéricas podem ser reutilizadas; acontecimentos biográficos singulares
podem ser únicos. Não impor exclusividade universal que esgote um catálogo pequeno.
Usos confirmados pertencem ao save e não são liberados automaticamente quando
um personagem deixa um cargo.

Se não houver candidata com pontuação positiva, manter o personagem válido e
apresentar uma ficha factual mínima, sem inventar trajetória. Registrar diagnóstico
de conteúdo e estado `sem_historia_compativel`, sem sortear repetidamente ao abrir
a ficha. Uma história genérica de reserva pode ser fornecida pelo pacote, mas
também deve satisfazer requisitos e campos disponíveis. Nunca relaxar uma
restrição obrigatória para conseguir preencher a biografia.

Essas são decisões técnicas propostas para permitir catálogos pequenos. Não
incluem geração livre de texto, serviço de IA ou duplicação obrigatória de histórias.

## Preenchimento e persistência

Usar somente campos permitidos pelo esquema, sem scripts ou avaliação de código.
Campo obrigatório indisponível torna a história inelegível. Renderizar conteúdo
como texto seguro, sem interpretar HTML arbitrário de um mod.

Salvar ID e versão da história, valores preenchidos e texto resultante. Assim,
atualizar/remover um pacote não reescreve biografias de personagens existentes;
compatibilidade geral de saves continua sujeita à política de SG081/082.
Persistir também usos de histórias únicas e estado do gerador. Não selecionar
outra história porque a opinião atual do personagem mudou.

## Aceites e responsáveis

- SG098/099: esquema e seleção; um novo JSON participa sem alteração no motor.
- Testes: requisito obrigatório prevalece sobre tags; pesos 4/2 são calculados
  corretamente; seleção reproduzível; ordem de arquivos irrelevante; exclusividade
  respeitada; esgotamento e ausência de compatibilidade não criam contradição.
- SG071: ficha com texto preenchido ou informação factual mínima; consultar não
  consome sorteios. Explicação técnica registra por que uma história foi elegível.
- SG081/082: atribuição, uso e texto estáveis após restauração; falha na confirmação
  não altera personagem, contador de usos ou gerador.
- Manual de mods: exemplos de história genérica, história com requisito forte,
  reutilização, pesos, preenchimento e mensagens de validação.

Esta especificação não decide quem indica/escolhe candidatos nos partidos, nem
a frequência da mudança de opinião: são pendências políticas distintas do B2.
