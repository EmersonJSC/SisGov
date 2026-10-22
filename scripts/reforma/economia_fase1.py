#!/usr/bin/env python3
"""Reforma das leis, economia, fase 1 (docs/jogo/leis/economia.md).

Nomes, descrições e opções em linguagem simples; impostos sem teto e com
curva de arrecadação (equilibrio.md, seção 3). Ids e valores das opções não
mudam, para manter a rede e o estado do Brasil ligados.
Uso: python3 scripts/reforma/economia_fase1.py
"""
import json
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
LEIS = RAIZ / "src/conteudo/mundo/leis"
CONS = RAIZ / "src/conteudo/mundo/consequencias"
VARS = RAIZ / "src/conteudo/mundo/indicadores/variaveis.json"
BRASIL = RAIZ / "src/conteudo/paises/brasil/leis.json"

# id: (nome, descrição, pico da curva)
IMPOSTOS = {
    "imposto-renda-pessoas": ("Imposto sobre a renda das pessoas",
        "Quanto cada pessoa paga sobre o salário e outros ganhos, na faixa mais alta.", 65),
    "imposto-renda-empresas": ("Imposto sobre o lucro das empresas",
        "A parte do lucro que a empresa entrega ao governo.", 45),
    "tributacao-dividendos": ("Imposto sobre dividendos",
        "O que o sócio paga quando tira o lucro da empresa para o bolso.", 50),
    "imposto-sobre-consumo": ("Imposto sobre o consumo",
        "A porcentagem que vai no preço de tudo o que se compra.", 45),
    "imposto-propriedade-urbana-rural": ("Imposto sobre imóveis e terras",
        "Imposto anual sobre casas, prédios e terras, em porcentagem do valor.", 3),
    "imposto-grandes-fortunas": ("Imposto sobre grandes fortunas",
        "Imposto anual sobre o patrimônio de quem tem muito.", 4),
    "imposto-heranca": ("Imposto sobre heranças",
        "O que os herdeiros pagam para receber o que alguém deixou.", 40),
    "imposto-transacoes-financeiras": ("Imposto sobre transações bancárias",
        "Um pouco de cada transferência e pagamento vai para o governo.", 1.5),
}

# id: (nome, descrição, {opção: rótulo})
REGRAS = {
    "conselho-fiscal-independente": ("Conselho fiscal independente",
        "Um órgão técnico que confere as contas do governo e avisa quando elas não fecham.",
        {"nenhum": "Não existe", "no-legislativo-so-consultivo": "Só dá opinião",
         "com-poder-de-veto-as-projecoes-do-orcamento": "Pode travar o orçamento"}),
    "controle-de-capitais": ("Controle de capitais",
        "Se o dinheiro pode entrar e sair do país livremente.",
        {"conta-aberta": "Livre", "controles-prudenciais": "Imposto e regras na saída",
         "controles-amplos": "Limite para mandar dinheiro para fora", "conta-fechada": "Saída proibida"}),
    "destino-do-resultado-fiscal": ("Destino da sobra do orçamento",
        "O que fazer quando o governo arrecada mais do que gasta.",
        {"pagar-a-divida": "Pagar a dívida", "dividir": "Metade para a dívida, metade para o fundo",
         "guardar": "Guardar no fundo soberano"}),
    "fundo-soberano": ("Fundo soberano",
        "Onde o país aplica o dinheiro guardado para o futuro.",
        {"guardar": "Reservas seguras", "fundo-exterior": "Investir no exterior",
         "emprestar-empresas": "Emprestar a empresas do país", "investir-obras": "Investir em obras"}),
    "imposto-seletivo": ("Imposto sobre o que faz mal",
        "Imposto extra sobre produtos que causam doença ou poluição.",
        {"nenhum": "Nenhum", "vicios-tradicionais": "Cigarro e bebida",
         "saude-ampla": "Cigarro, bebida, açúcar e ultraprocessados",
         "saude-e-ambiente": "Também combustíveis que poluem"}),
    "imposto-sobre-a-propriedade": ("Valor dos imóveis para o imposto",
        "Se o valor de casas e terras usado no imposto acompanha o preço de mercado.",
        {"simbolico": "Valor simbólico, quase não se paga",
         "atual-planta-antiga-imposto-rural-quase-zero": "Valores antigos; terra rural quase não paga",
         "atualizado-e-progressivo": "Valor atualizado, mais caro para quem tem muitos imóveis",
         "imposto-sobre-o-valor-da-terra": "Pelo valor da terra, usada ou parada"}),
    "incentivos-fiscais-regionais": ("Zonas com imposto menor",
        "Regiões onde as empresas pagam menos imposto para atrair fábricas.",
        {"nenhum": "Nenhuma", "zonas-de-exportacao": "Zonas para fábricas exportadoras",
         "fundos-regionais": "Fundos para regiões pobres", "zona-franca-ampla": "Zona franca ampla numa região"}),
    "mandato-do-banco-central": ("Missão do banco central",
        "O que o banco central persegue.",
        {"sem-meta": "Crescimento e financiar o governo", "mandato-duplo": "Inflação e emprego",
         "meta-flexivel": "Inflação baixa, com prazo flexível", "meta-estrita": "Só inflação baixa"}),
    "meta-de-resultado-primario": ("Meta de resultado das contas",
        "Quanto o governo promete economizar por ano.",
        {"ponto-da-faixa": "Déficit permitido", "2-do-pib": "Zerar o déficit",
         "0-25-do-pib": "Economizar 1% do PIB", "3-do-pib": "Economizar 3% do PIB"}),
    "modelo-tributario": ("Modelo de impostos",
        "Onde o peso dos impostos cai mais: no consumo ou na renda.",
        {"quase-sem-impostos": "Impostos mínimos", "base-no-consumo": "Peso no consumo",
         "proporcional": "Alíquota única na renda, mais imposto sobre o consumo",
         "dual": "Trabalho com faixas, capital com alíquota única",
         "progressivo": "Muitas faixas: quem ganha mais paga proporcionalmente mais"}),
    "quem-controla-o-banco-central": ("Quem manda no banco central",
        "Se o governo decide os juros ou se um banco central independente decide.",
        {"banco-central-subordinado-ao-governo": "O governo decide os juros",
         "autonomia-parcial": "Diretoria com mandato fixo", "autonomia-plena": "Independente, com meta"}),
    "regime-cambial": ("Moeda e câmbio",
        "Como o valor da moeda frente ao dólar é decidido.",
        {"fixo": "Câmbio fixo pelo governo", "bandas": "O dólar só varia dentro de uma faixa",
         "flutuante-administrado": "Livre, com o banco central comprando e vendendo dólares",
         "flutuante": "Câmbio livre"}),
    "regime-simplificado-para-pequenas-empresas": ("Imposto único para pequenas empresas",
        "Pequenos negócios pagam um imposto só, simples, sobre o faturamento.",
        {"nenhum": "Não existe",
         "so-dispensa-do-iva-abaixo-de-um-faturamento": "Só dispensa do imposto sobre o consumo abaixo de um faturamento",
         "valor-fixo-mensal-para-o-microempreendedor": "Valor fixo por mês para o microempreendedor",
         "amplo-com-teto-alto-e-servicos-de-alta-renda": "Amplo, até empresas médias"}),
    "regra-fiscal": ("Regra das contas",
        "O que limita o gasto do governo.",
        {"sem-regra": "Sem regra", "meta-resultado": "Meta de resultado",
         "teto-gastos": "Teto de gasto", "arcabouco": "Gasto cresce menos que a receita"}),
    "regulacao-dos-bancos": ("Regras para os bancos",
        "Quanto o governo fiscaliza o que os bancos podem fazer.",
        {"minima": "Mínima", "padrao-internacional": "Padrão internacional",
         "padrao-reforcado": "Rígida, com limite de risco",
         "repressao-financeira": "O governo manda onde os bancos emprestam"}),
    "revisao-de-gastos-tributarios": ("Isenções fiscais",
        "Quanto o governo deixa de cobrar para ajudar setores, regiões e entidades.",
        {"nenhuma": "Mantém todas as isenções", "revisao-com-prazo-de-validade": "Isenções com prazo de validade",
         "corte-linear": "Corte geral das isenções"}),
    "tributacao-do-lucro-distribuido-e-da-renda-guardada-no-exter": ("Imposto do dinheiro guardado no exterior",
        "O que acontece com o lucro que fica em empresas e contas fora do país.",
        {"isento-e-renda-no-exterior-so-paga-quando-volta": "Não cobra; paga só quando o dinheiro volta",
         "retencao-minima-e-15-ao-ano-no-exterior-e-nos-fundos-exclusi": "Cobrança mínima todo ano",
         "aliquota-unica-de-15-a-25-no-dividendo-com-corte-no-imposto-": "Alíquota única sobre o lucro distribuído",
         "integrado-na-tabela-progressiva-e-renda-no-exterior-somada-t": "Tudo na tabela do imposto de renda, inclusive o exterior"}),
    "vinculacoes-orcamentarias": ("Verbas carimbadas",
        "Se a Constituição obriga a gastar uma parte fixa da receita em saúde e educação.",
        {"desligada-receita-sem-carimbo": "Nenhuma verba carimbada",
         "ligada-vinculacoes-permitidas": "Saúde e educação com verba carimbada"}),
    "taxa-basica-de-juros": ("Juros básicos",
        "A taxa que puxa todos os juros do país.",
        {"minimo-2": "2% ao ano", "referencia-13-75": "13,75% ao ano", "maximo-30": "30% ao ano"}),
    "valor-da-meta-de-inflacao": ("Meta de inflação",
        "Quanto de inflação por ano o banco central deve buscar.",
        {"minimo-2": "2% ao ano", "referencia-3": "3% ao ano",
         "proposta-desenvolvimentista-4-a-4-5": "4% a 4,5% ao ano", "maximo-6": "6% ao ano"}),
    "intervencao-cambial": ("Compra e venda de dólares",
        "Se o banco central usa as reservas para mexer no dólar.",
        {"minimo-vender-us-40-bi": "Vender reservas para segurar o dólar",
         "referencia-nenhuma-ou-pontual": "Só em emergência",
         "maximo-comprar-us-40-bi": "Comprar dólares para guardar reservas"}),
    "indexacao-de-contratos": ("Correção automática pela inflação",
        "Se aluguéis, salários e contratos sobem sozinhos com a inflação passada.",
        {"indexacao-livre": "Tudo corrigido pela inflação",
         "restrita": "Só salário mínimo e aposentadorias", "desindexacao-ampla": "Proibida"}),
}


def ler(p):
    return json.loads(p.read_text())


def gravar(p, d):
    p.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n")


def curva(pico):
    """Pontos de t·(1 − t/2·pico), de 0 até onde a arrecadação zera."""
    fim = min(100.0, 2 * pico)
    pts = [[round(fim * i / 20, 4), 0.0] for i in range(21)]
    for p in pts:
        t = p[0]
        p[1] = round(max(0.0, t * (1 - t / (2 * pico))), 6)
    if fim < 100:
        pts.append([100, 0.0])
    return pts


def main():
    brasil = {x["lei"]: x for x in ler(BRASIL)["emVigor"]}
    variaveis = ler(VARS)
    por_var = {v["id"]: v for v in variaveis["variaveis"]}

    for lid, (nome, desc, pico) in IMPOSTOS.items():
        p = LEIS / f"{lid}.json"
        lei = ler(p)
        lei["nome"], lei["descricao"] = nome, desc
        lei["tributo"]["limites"]["maximo"] = 100
        var = lei["controle"]["variavel"]
        por_var[var]["nome"] = f"Alíquota: {nome}"
        t0 = float(brasil[lid].get("nivel", 0))
        cid = next(c for c in lei["consequencias"] if c.endswith("--arrecadacao"))
        cp = CONS / f"{cid}.json"
        c = ler(cp)
        if c["mecanismo"] == "afim":  # só converte uma vez
            n = c.pop("normalizacao")
            m = n["multiplicador"] / (1 - t0 / (2 * pico))  # partida não muda
            c["mecanismo"] = "pontos"
            pts = curva(pico)
            if t0 > 0 and all(abs(x - t0) > 1e-9 for x, _ in pts):
                pts = sorted(pts + [[t0, round(t0 * (1 - t0 / (2 * pico)), 6)]])
            c["parametros"] = {"pontos": pts}  # a partida é um ponto exato
            # a escala multiplica depois da curva (a normalização entra antes)
            c["escala"] = {"fator": n["fator"], "referencia": round(1 / m, 6)}
            gravar(cp, c)
        gravar(p, lei)

    for lid, (nome, desc, rotulos) in REGRAS.items():
        p = LEIS / f"{lid}.json"
        lei = ler(p)
        lei["nome"], lei["descricao"] = nome, desc
        ops = {o["id"]: o for o in lei["controle"]["opcoes"]}
        assert set(ops) == set(rotulos), (lid, set(ops) ^ set(rotulos))
        for oid, r in rotulos.items():
            ops[oid]["rotulo"] = r
        gravar(p, lei)

    gravar(VARS, variaveis)
    print(f"{len(IMPOSTOS)} impostos e {len(REGRAS)} regras atualizados")


if __name__ == "__main__":
    main()
