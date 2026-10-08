# Conteúdo configurável por JSON

Leia primeiro o [contrato de referência do motor e dos JSONs](contrato-motor-json.md).
Em caso de dúvida sobre a separação entre lei, país e mecanismo, ele prevalece
sobre exemplos antigos deste documento.

Diretriz confirmada pelo usuário em 8 de outubro de 2026. Contrato arquitetural,
não declaração de que todos os carregadores e mecanismos já estão implementados.

## Responsabilidades

O motor implementa mecanismos genéricos e valida seus contratos. O conteúdo
declara entidades, parâmetros e relações em JSON. A interface apresenta esse
conteúdo e envia comandos; não guarda coeficientes ocultos por país ou política.
Novas entidades que usem mecanismos existentes não exigem edição do motor.
Mecanismos inéditos exigem implementação, documentação e testes antes de serem
expostos aos mods. JSON não executa código arbitrário.

**Lei é a unidade central das decisões modificáveis pelo jogador.** O JSON de
cada lei contém sua identidade, âmbito (ordinário ou constitucional), requisitos,
incompatibilidades, mecanismo e efeitos possíveis. O catálogo de leis é comum
aos países. O JSON do país é separado: declara quais leis desse catálogo começam
vigentes, seus valores e
estado herdado. O motor resolve essas referências e executa a lei vigente; não
embute como regra universal o número de turnos presidenciais, o desenho do
Senado ou um quórum brasileiro. Esses valores pertencem às leis e à configuração
inicial do país.

Índices, situações, eventos, grupos e personagens continuam entidades JSON
distintas, não tipos de lei. Eles são alvos, condições, causas ou consequências
das leis e interagem entre si por relações declaradas. “Tudo gira em torno de
leis” descreve o centro das decisões políticas, não transforma cada índice ou
situação em lei.

## Vínculos entre leis e limite do motor

Uma lei pode depender de outra, exigir que determinada lei constitucional
continue vigente, excluir uma lei incompatível ou substituir uma lei anterior.
Os requisitos para mudar uma lei também vêm de leis/processos constitucionais
vigentes: o motor consulta esse conteúdo, verifica autoridade e condições,
executa a transição e registra o resultado. Uma lei ordinária não contorna uma
proteção constitucional só por declarar um efeito parecido.

Responsabilidade do motor: carregar o catálogo comum, selecionar o país,
resolver IDs, validar dependências e conflitos,
consultar o processo de mudança vigente, executar mecanismos suportados e
preservar estado/histórico. Responsabilidade dos JSONs: dizer quais leis existem,
o que protegem ou alteram, quais começam vigentes no país e os parâmetros de
cada processo. Uma lei do catálogo que não começa vigente num país não fica
proibida ali: o jogador pode propô-la se atender seus requisitos. Não precisamos
inventar agora todas as leis, fórmulas, quóruns
ou organizações futuras para definir esse contrato.

## Entidades distintas

- Grupos de interesse: identidade, descrição, critérios de associação e relações
  políticas. Ricos, motoristas, classe média, homens, mulheres e jovens são
  conteúdo, não enumerações fechadas no código.
- População: parcelas ou indivíduos representados com peso eleitoral próprio e
  associações a grupos. A V1 pode usar parcelas agregadas; não exige biografias.
- Países/cenários: referências ao conteúdo disponível e configuração inicial,
  composição populacional, instituições e leis vigentes.
- Organizações políticas: catálogo reutilizável de instituições e mecanismos,
  independente do país que o utiliza.
- Leis/políticas ordinárias e leis constitucionais: tipos com contratos distintos
  de autorização, requisitos e efeitos. Uma garantia constitucional pode proteger
  instituições ou restringir ações ordinárias. A regra de eleição é uma lei
  constitucional: declara o mecanismo de apuração e seus parâmetros.
- Índices: grandezas com unidade, domínio e relações de cálculo.
- Situações: condições persistentes de entrada/saída e efeitos enquanto ativas.
- Eventos: definições de ocorrência, gatilhos e consequências; o registro de um
  evento ocorrido pertence à partida, não altera sua definição JSON.
- Relações/consequências: origem, alvo, mecanismo, parâmetros, unidade e tempo.
- Histórias de personagens: catálogo textual independente, com tags, requisitos
  e restrições. O motor gera o personagem primeiro e atribui uma história
  compatível depois; texto não cria atributos mecânicos. A atribuição e os
  valores preenchidos são preservados no save.

Referências usam IDs estáveis e validam tipos compatíveis. Não é necessário que
cada tipo tenha um diretório exclusivo, mas sua identidade e contrato não podem
se confundir. Esquemas concretos e organização dos arquivos são entregas de SG098/099.

Uma organização política descreve formas e instituições suportadas, mas as
instituições e processos ativos da partida decorrem das leis constitucionais
vigentes e do estado inicial do país. Cada
eleição ativa tem sua forma de apuração estabelecida por uma lei constitucional
vigente; o JSON do país aponta para as leis constitucionais iniciais. Essas leis
podem ser reutilizadas por países diferentes. Para uma mesma eleição e alcance,
duas regras incompatíveis são mutuamente exclusivas: não coexistem nem se
sobrepõem. Mudar a apuração exige aprovar uma alteração constitucional que
substitua a lei vigente de forma atômica. A partida guarda as leis vigentes e o
histórico conserva resultados anteriores à mudança. O motor valida exclusividade,
instituição/eleição existente, mecanismo suportado e parâmetros obrigatórios.
O JSON escolhe e parametriza mecanismos implementados; um cálculo ainda não
suportado requer extensão do motor antes de poder ser escolhido.

## Exemplo de encadeamento

Uma lei ordinária referencia uma garantia constitucional como requisito;
seus efeitos alteram um índice; uma situação consulta esse índice e permanece
ativa enquanto suas condições se sustentam; um evento pode consultar a situação
e produzir novas consequências. Cada ligação é declarada no conteúdo e executada
por mecanismos suportados, não por verificações de nomes especiais no código.

Proteção constitucional é requisito de autorização, não uma aresta numérica
de influência. A estrutura distingue relações institucionais de relações de
cálculo, ainda que todas usem IDs e sejam apresentadas no mesmo jogo.

## Grupos sobrepostos sem votos duplicados

Grupos podem se sobrepor. Uma parcela pode representar jovens, mulheres e
motoristas simultaneamente. Seu peso populacional entra uma única vez na eleição;
suas associações participam do cálculo de preferências conforme regras declaradas.
Somar tamanhos dos grupos como se fossem eleitorados separados é inválido.

Os perfis agregados atuais são uma representação inicial, não um catálogo fechado
de grupos. Regra confirmada pelo usuário: cada parcela pode associar-se a vários
grupos com pesos de importância definidos nos JSONs. O motor combina as influências
conforme esses pesos; nenhuma identidade determina sozinha a preferência política.
Peso de interesse não é peso eleitoral: associar outro grupo não cria eleitores.

A especificação de [combinação dos grupos no B2](../producao/sg057-b2-contrato-politico.md#combinação-das-influências-dos-grupos--contrato-técnico)
adota média ponderada normalizada como definição técnica, com pesos explícitos,
validação e comportamento para zeros. Peso de interesse é distinto da magnitude
dos efeitos e do peso populacional. Implementação ainda prevista em SG058-A.

## Validação e manual futuro

SG098/099 devem prever esquema versionado, IDs únicos, referências resolvidas,
unidades e tempos explícitos, campos obrigatórios e diagnóstico por arquivo/campo.
Estados dinâmicos ficam no save: intensidade vigente, situação ativa, eventos
ocorridos, efeitos consumidos, instituições e calendário.

Antes de disponibilizar criação de conteúdo a usuários, entregar um manual com:

- catálogo de entidades, campos, mecanismos suportados e valores permitidos;
- exemplos mínimos de grupo, lei, garantia constitucional, índice, situação e evento;
- exemplo completo do encadeamento acima, sem editar código;
- instruções para validar, instalar e testar um pacote, com mensagens de erro;
- regras de versão, compatibilidade de saves e conflitos entre pacotes.

Aceite: adicionar um grupo e uma lei com relações usando somente arquivos de
conteúdo; o motor valida e executa e a interface identifica as novas entidades.
Catálogo semelhante ao D4 é uma direção de conteúdo, não alegação de que todos
os seus grupos já foram criados ou de que seus dados serão copiados.
