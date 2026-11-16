# Revisão de todos os índices (16/nov)

Foram 135 índices, de 38 donos, com tudo o que mexe em cada um: leis (sinal e
força por degrau) e derivas. A Saúde está em detalhe em
[revisao-indices-saude.md](revisao-indices-saude.md).

## Por que havia tanto erro
As leis foram escritas em lote numa planilha, e dois defeitos se espalharam:
1. **Degrau quebrado:** a vírgula ou o "ou" dentro de um degrau virou degrau
   novo. Exemplo: "só o Estado, pelo Seguro-desemprego" virou dois degraus.
   **42 leis consertadas por script.** Cada degrau foi remontado a partir da
   própria descrição da lei, e a força voltou a subir em escada (fraca → média →
   forte). As partidas do Brasil que apontavam para um pedaço foram remapeadas
   (12 leis).
2. **Sinal trocado:** às vezes o "+" quis dizer "a lei é boa para o índice", e
   não "subir a régua sobe o índice". Consertados:

| Lei | Índice | Antes | Agora | Por quê |
|---|---|---|---|---|
| Imposto sobre remédio | Acesso a remédios | + | − | o imposto encarece |
| Reposição de servidores | Atendimento, folha, ensino | − | + | repor mais = mais gente trabalhando |
| Vistoria dos veículos | Mortes no trânsito | + | − | carro em ordem bate menos |
| Cargos de livre nomeação | Corrupção, folha | − | + | cargo sem concurso abre espaço para desvio |
| Cargos de livre nomeação | Aprovação | + | − fraca | o povo vê cabide de emprego |
| Reserva compensada em outra terra | Desmatamento | − | + | derruba aqui e compra mata lá |
| (índice) Gasto obrigatório | avaliação | maior é melhor | maior é pior | orçamento travado tira escolha do jogador |

O resto conferido faz sentido.

## Índices que nada mexe (12)
Nenhuma lei e nenhuma conta do motor mexem neles: o número fica parado a
partida toda.

| Índice | Dono | Da V1? |
|---|---|---|
| Saldo comercial, Dependência de importados | Comércio exterior | não (3.10) |
| Credibilidade da imprensa, Concentração da mídia, Violência contra a imprensa | Comunicação | não (6.2 a 6.5) |
| Prática de esporte | Esporte | — |
| Tensão com estados e municípios | Estados | não (2.9) |
| Estado na economia | Estatais | não (3.9) |
| Preço do combustível | Mineração e petróleo | não (3.11) |
| Confiança na aposentadoria, Envelhecimento | Previdência | não (2.2) |
| Turismo | Turismo | — |

**Proposta:** esconder do mapa na V1 os índices que nada mexe. Eles aparecem
de novo quando a mecânica deles entrar.

## Para o autor decidir (faz sentido, mas é discutível)
- **Energia gasta** está como "maior é melhor": a lei de eficiência, que gasta
  menos energia, aparece como piora.
- **Abertura à geração privada** sobe o preço da energia. O leilão pode baratear.
- **Jornada máxima:** permitir mais horas por semana sobe o padrão de vida.
- **Aposentadoria flexível** sobe a "Liberdade" (liberdade de escolher quando
  se aposentar).
- **Garantia contra acidentes** sobe a concentração de mercado (a empresa
  pequena não consegue depositar).

## Para quando chegarmos na instituição (16/nov)
- **Terra:** reserva compensada em outra terra é complexa e tem valores errados; rever (talvez nem precise existir).
- **Previdência:** o envelhecimento já existe nos pops; ligar o índice a eles em vez de criar outro.
- **Energia:** "energia gasta" está como maior é melhor; rever a avaliação.
- **Trabalho:** jornada máxima (mais horas sobe o padrão de vida); pensar com calma como a falta de tempo pesa.
