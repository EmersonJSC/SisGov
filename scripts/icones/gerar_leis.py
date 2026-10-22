#!/usr/bin/env python3
"""Gera os ícones SVG das leis (docs/arte/briefing-icones-gpt.md, estilo futurista).

Cada lei: uma peça principal e, se preciso, um detalhe num selo de canto.
Escreve src/assets/svg/leis/<área>/<id>.svg e src/assets/svg/manifest-leis.json.
Uso: python3 scripts/icones/gerar_leis.py
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from pecas import P  # noqa: E402

RAIZ = Path(__file__).resolve().parents[2]
SAIDA = RAIZ / "src/assets/svg/leis"
MANIFESTO = RAIZ / "src/assets/svg/manifest-leis.json"
POLITICA = RAIZ / "src/conteudo/paises/brasil/politica.json"
LEIS = RAIZ / "src/conteudo/mundo/leis"

ICONES = {
 # economia
 "apostas-e-jogos-de-azar": ("dado", None), "conselho-fiscal-independente": ("lupa", "grafico"),
 "controle-de-capitais": ("moedas", "cadeado"), "destino-do-resultado-fiscal": ("moedas", "seta_sai"),
 "fundo-soberano": ("cofre", "broto"), "imposto-grandes-fortunas": ("moedas", "pct"),
 "imposto-heranca": ("familia", "pct"), "imposto-propriedade-urbana-rural": ("casa", "pct"),
 "imposto-renda-empresas": ("fabrica", "pct"), "imposto-renda-pessoas": ("folha_doc", "pct"),
 "imposto-seletivo": ("cigarro", "pct"), "imposto-sobre-a-propriedade": ("casa", "lupa"),
 "imposto-sobre-consumo": ("carrinho", "pct"), "imposto-transacoes-financeiras": ("setas_troca", "pct"),
 "mandato-do-banco-central": ("banco", "alvo"), "meta-de-resultado-primario": ("alvo", "moedas"),
 "modelo-tributario": ("balanca", "pct"), "quem-controla-o-banco-central": ("banco", "livro"),
 "regime-cambial": ("globo", "setas_troca"), "regime-simplificado-para-pequenas-empresas": ("porta", "pct"),
 "regra-fiscal": ("balanca", "moedas"), "regulacao-dos-bancos": ("banco", "carimbo"),
 "revisao-de-gastos-tributarios": ("folha_doc", "menos"), "tributacao-dividendos": ("grafico", "moedas"),
 "tributacao-do-lucro-distribuido-e-da-renda-guardada-no-exter": ("globo", "pct"),
 "vinculacoes-orcamentarias": ("carimbo", "moedas"),
 # empresas
 "banco-de-desenvolvimento": ("banco", "guindaste"), "conteudo-local": ("engrenagem", "alfinete"),
 "controle-de-precos": ("carrinho", "cadeado"), "cooperativas-e-autogestao": ("grupo", "engrenagem"),
 "defesa-comercial": ("escudo", "navio"), "defesa-da-concorrencia": ("predios", "balanca"),
 "indexacao-de-contratos": ("folha_doc", "seta_circ"), "intervencao-cambial": ("moedas", "setas_troca"),
 "investimento-estrangeiro": ("globo", "seta_entra"), "licenca-para-abrir-negocio": ("porta", "check"),
 "nacionalizacao": ("fabrica", "chave"), "papel-do-estado-empresario": ("fabrica", "cupula"),
 "planejamento-da-economia": ("calendario", "grafico"), "politica-de-precos-das-estatais": ("chama", "moeda"),
 "politica-industrial": ("fabrica", "estrela"), "programa-de-privatizacao": ("martelo", "fabrica"),
 "propriedade-dos-meios-de-producao": ("engrenagem", "grupo"), "tarifas-de-importacao": ("navio", "pct"),
 "taxa-basica-de-juros": ("seta_sobe", "pct"), "valor-da-meta-de-inflacao": ("termometro", "alvo"),
 "volume-de-incentivo-a-industria": ("fabrica", "saco"),
 # trabalho
 "contribuicao-sindical": ("punho", "moeda"), "custo-de-processar-na-justica-do-trabalho": ("martelo", "moedas"),
 "direito-de-greve": ("placa", None), "fiscalizacao-do-trabalho": ("capacete", "lupa"),
 "formula-do-salario-minimo": ("folha_doc", "seta_sobe"), "fundo-de-garantia": ("cofre", "capacete"),
 "intermediacao-e-qualificacao": ("lupa", "pessoa"), "jornada-de-trabalho": ("relogio", "capacete"),
 "legislacao-trabalhista": ("livro", "capacete"), "licenca-parental": ("carrinho_bebe", "relogio"),
 "negociacao-coletiva-e-sindicatos": ("aperto", "grupo"), "quem-decide-o-salario-minimo": ("folha_doc", "martelo"),
 "reducao-de-jornada-subsidiada": ("relogio", "saco"), "salario-minimo": ("folha_doc", "moeda"),
 "seguro-desemprego": ("guarda_chuva", "pessoa"), "terceirizacao": ("cracha", "setas_troca"),
 "trabalho-infantil-e-aprendizagem": ("mochila", "capacete"), "trabalho-por-aplicativo": ("telefone", "caminhao"),
 # previdência, assistência, família, moradia
 "como-o-estado-entrega-casa": ("chave", "casa"), "direito-a-moradia-na-constituicao": ("casa", "livro"),
 "garantia-de-comida": ("prato", None), "idade-minima-aposentadoria": ("bengala", "calendario"),
 "licenca-para-cuidar-do-bebe": ("carrinho_bebe", None), "organizacao-dos-programas-sociais": ("folha_doc", "grupo"),
 "pensao-por-morte": ("guarda_chuva", "familia"), "previdencia-rural": ("bengala", "trator"),
 "quem-cuida-do-idoso-dependente": ("mao", "bengala"), "reajuste-de-beneficios": ("bengala", "seta_sobe"),
 "renda-para-idosos-e-pessoas-com-deficiencia-pobres": ("cadeira_rodas", "moeda"),
 "sistema-previdenciario": ("bengala", "livro"), "transferencia-de-renda": ("coracao", "moedas"),
 "transferencia-de-renda-as-familias-pobres": ("familia", "check"), "vagas-de-creche": ("carrinho_bebe", "escola"),
 "verba-do-programa-habitacional": ("casa", "saco"), "habitacao-publica": ("predios", "chave"),
 "programa-habitacao-popular": ("predios", "saco"),
 # saúde
 "campanha-de-vacinacao-lei": ("seringa", "megafone"), "divisao-da-verba-atencao-basica-x-hospitais": ("cruz", "setas_troca"),
 "farmacia-popular": ("capsula", "coracao"), "forma-de-gestao-hospitalar": ("cruz", "cracha"),
 "genericos-e-patentes-de-medicamentos": ("capsula", "cadeado"), "lista-de-remedios-e-incorporacao": ("capsula", "folha_doc"),
 "modelo-do-sistema-de-saude": ("cruz", "livro"), "mutirao-de-cirurgias": ("cruz", "relogio"),
 "piso-de-gasto-em-saude": ("cruz", "carimbo"), "piso-saude": ("cruz", "saco"),
 "programa-de-medicos-no-interior": ("estetoscopio", "casa"), "regulacao-de-vagas": ("cama", "lupa"),
 "regulacao-dos-planos-de-saude": ("folha_doc", "cruz"), "remedios-em-farmacias-credenciadas": ("capsula", "porta"),
 "restricao-a-tabaco-e-alcool": ("cigarro", "risco"), "saude-mental": ("cabeca", None),
 "vacinacao-obrigatoria": ("seringa", "check"), "vagas-de-residencia-medica": ("estetoscopio", "capelo"),
 "verba-da-saude-acima-do-piso": ("coracao", "saco"), "vigilancia-epidemiologica": ("virus", "lupa"),
 # educação, ciência, cultura
 "acesso-ao-ensino-superior": ("capelo", "livro"), "alfabetizacao-na-idade-certa": ("abc", None),
 "avaliacao-das-escolas": ("folha_doc", "check"), "bolsa-de-permanencia-no-ensino-medio": ("mochila", "moeda"),
 "bolsas-de-pos-graduacao": ("capelo", "frasco"), "concessoes-de-radio-e-tv": ("tv", "chave"),
 "conteudo-moral-e-sexual": ("livro", "coracao"), "credito-estudantil": ("capelo", "moedas"),
 "educacao-domiciliar": ("casa", "abc"), "ensino-obrigatorio": ("mochila", None),
 "ensino-religioso": ("livro", "vela"), "ensino-tecnico-e-profissional": ("chave_ingl", "livro"),
 "escola-em-tempo-integral": ("escola", "relogio"), "financiamento-com-resultado": ("escola", "grafico"),
 "gestao-da-escola-publica": ("escola", "cracha"), "incentivo-a-cultura": ("mascaras", None),
 "incentivo-fiscal-a-pesquisa-nas-empresas": ("frasco", "engrenagem"), "investimento-pesquisa": ("frasco", "saco"),
 "piso-de-gasto-em-educacao": ("livro", "carimbo"), "piso-educacao": ("escola", "saco"),
 "piso-salarial-professores": ("lapis", "moeda"), "programa-espacial-e-satelites": ("foguete", None),
 "vagas-publicas-no-ensino-superior": ("capelo", "cadeira"), "vouchers-escolares": ("escola", "setas_troca"),
 # segurança, justiça, defesa, exterior
 "acordos-comerciais": ("aperto", "navio"), "alianca-militar": ("escudo", "aperto"),
 "alinhamento-externo": ("globo", "estrela"), "alternativas-penais-e-audiencia-de-custodia": ("tornozeleira", None),
 "armas-de-fogo": ("arma", None), "cameras-corporais": ("camera", "distintivo"),
 "cameras-e-reconhecimento-facial": ("camera_rua", "olho"), "cannabis-legal": ("folha7", None),
 "ciberseguranca": ("escudo", "wifi"), "ciclo-policial": ("distintivo", "seta_circ"),
 "controle-civil-das-forcas-armadas": ("capacete", "cracha"), "cooperacao-internacional": ("mao", "globo"),
 "coordenacao-das-policias": ("distintivo", "grupo"), "delacao-premiada": ("baloes", "cadeado"),
 "excludente-de-ilicitude": ("arma", "interrog"), "exportacao-de-armas": ("arma", "navio"),
 "fundo-seguranca-publica": ("distintivo", "saco"), "gasto-com-defesa": ("capacete", "saco"),
 "gestao-dos-presidios": ("grade", "cracha"), "industria-de-defesa": ("fabrica", "escudo"),
 "integracao-regional": ("quebra", None), "interceptacao-de-comunicacoes": ("telefone", "olho"),
 "investimento-em-defesa": ("escudo", "saco"), "lei-de-drogas": ("balanca", "folha7"),
 "maioridade-penal": ("ampulheta", "grade"), "missoes-de-paz": ("pomba", "capacete"),
 "papel-das-forcas-armadas": ("capacete", "livro"), "pena-de-morte": ("balanca", "risco"),
 "penas-e-progressao": ("grade", "seta_sai"), "poderes-de-investigacao": ("lupa", "distintivo"),
 "policia-militar": ("distintivo", "estrela"), "policiamento-orientado": ("alfinete", "distintivo"),
 "politica-de-imigracao": ("mala", "seta_entra"), "politica-de-sancoes": ("globo", "cadeado"),
 "programa-nuclear-lei": ("atomo", "escudo"), "protecao-de-dados": ("digital", "cadeado"),
 "protecao-de-fronteiras": ("cerca", None), "protecao-social-dos-militares": ("medalha", None),
 "rede-diplomatica": ("cupula", "globo"), "regime-contra-faccoes": ("mascara", "corrente"),
 "saida-do-pais": ("passaporte", "seta_sai"), "servico-militar": ("capacete", "pessoa"),
 "tribunais-e-tratados-internacionais": ("martelo", "globo"), "vagas-em-presidios": ("grade", "saco"),
 "verba-policia-federal": ("distintivo", "moedas"), "vigilancia-de-bairro": ("olho", "casa"),
 # governo e instituições
 "agencia-de-inteligencia": ("olho", "folha_doc"), "clausula-de-desempenho": ("bandeiras", "risco"),
 "estabilidade-dos-servidores-publicos": ("cracha", "cadeado"), "federalismo": ("mapa", "livro"),
 "financiamento-de-campanhas": ("megafone", "moedas"), "foro-privilegiado": ("cadeira", "martelo"),
 "fundo-de-equalizacao": ("mapa", "moedas"), "garantias-penais": ("escudo", "balanca"),
 "governadores": ("cupula", "estrela"), "independencia-do-judiciario": ("martelo", "livro"),
 "lei-anticorrupcao": ("mao", "risco"), "liberdade-de-imprensa": ("camera", "livro"),
 "ongs-e-financiamento-estrangeiro": ("grupo", "globo"), "orcamento-do-judiciario": ("martelo", "saco"),
 "participacao-direta": ("urna", "mao"), "partidos": ("bandeiras", None),
 "policias-dos-estados": ("distintivo", "mapa"), "reeleicao": ("urna", "seta_circ"),
 "regra-de-repasse": ("mapa", "setas_troca"), "regulacao-das-redes-sociais": ("baloes", "carimbo"),
 "sistema-de-governo": ("cadeira", "livro"), "transparencia-publica": ("vidro", "folha_doc"),
 "tribunais-superiores": ("cupula", "balanca"), "valor-do-fundo-eleitoral": ("urna", "saco"),
 "verba-de-controle": ("lupa", "cupula"), "verba-de-publicidade-oficial-e-comunicacao-publica": ("megafone", "saco"),
 "voto-obrigatorio": ("urna", "check"),
 # infraestrutura e energia
 "agua-e-esgoto": ("torneira", None), "credito-rural-e-assistencia-tecnica": ("trator", "moedas"),
 "energia-nuclear": ("atomo", "raio"), "ferrovias-e-terminais-portuarios": ("trilho", "navio"),
 "fiscalizacao-ambiental": ("arvore", "lupa"), "incentivos-fiscais-regionais": ("mapa", "pct"),
 "investimento-em-geracao-por-fonte": ("raio", "sol"), "investimento-em-infraestrutura": ("guindaste", "saco"),
 "licenciamento-de-obras-e-empresas": ("guindaste", "carimbo"), "matriz-energetica": ("torre", "folha"),
 "orcamento-de-expansao-eletrica": ("torre", "saco"), "protecao-da-vegetacao-nativa-nas-propriedades-rurais": ("arvore", "cerca"),
 "regime-do-petroleo-e-mineracao": ("gota", "chave"), "transporte-publico": ("onibus", None),
 "usinas-a-carvao": ("chamine", None),
 # meio ambiente e campo
 "codigo-florestal": ("arvore", "livro"), "licenciamento-ambiental": ("folha", "carimbo"),
 "preco-do-carbono": ("fumaca", "pct"), "redistribuicao-de-terras": ("enxada", "mapa"),
 "registro-de-agrotoxicos": ("pulverizador", None), "terras-indigenas": ("arvore", "alfinete"),
 # direitos e costumes
 "aborto": ("balanca", "coracao"), "acoes-afirmativas": ("cadeira", "check"),
 "acolhida-e-interiorizacao-de-imigrantes": ("mala", "casa"), "bloqueio-de-pagamentos-a-casas-sem-licenca": ("dado", "cadeado"),
 "casamento-e-uniao-civil": ("aliancas", None), "crimes-da-ditadura": ("livro", "lupa"),
 "discriminacao-e-crimes-de-odio": ("baloes", "risco"), "eutanasia": ("cama", "vela"),
 "identidade-de-genero": ("cracha", "seta_circ"), "igualdade-racial": ("aperto", "igual"),
 "igualdade-salarial-de-genero": ("igual", "moeda"), "imunidade-e-dinheiro-para-igrejas": ("templo", "moedas"),
 "laicidade-do-estado": ("templo", "livro"), "politica-de-natalidade": ("familia", "mais"),
 "protecao-contra-violencia-domestica": ("escudo", "coracao"), "protecao-da-vida-desde-a-concepcao": ("broto", "livro"),
 "publicidade-de-apostas": ("dado", "megafone"), "refugio-e-asilo": ("barraca", "coracao"),
 "tributo-sobre-apostas": ("dado", "pct"), "verba-de-planejamento-familiar-e-de-aborto-legal": ("familia", "saco"),
 "verba-para-juventude-negra-e-saude-da-populacao-negra": ("grupo", "coracao"),
}

ABRE = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" '
        'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">')


def svg(principal, detalhe):
    corpo = P[principal]
    if detalhe:
        corpo = f'<g transform="translate(-1 -1) scale(.92)">{corpo}</g>'
        corpo += ('<circle cx="18.4" cy="18.4" r="5.3" style="fill:var(--fundo-lei,#0D1620)" stroke-width="1.1"/>'
                  f'<g transform="translate(14.2 14.2) scale(.35)" stroke-width="4">{P[detalhe]}</g>')
    return ABRE + corpo + "</svg>\n"


def main():
    ministerios = json.loads(POLITICA.read_text())["ministerios"]["ministerios"]
    area = {lei: m["area"] for m in ministerios for lei in m["leis"]}
    leis = {json.loads(p.read_text())["id"]: json.loads(p.read_text()) for p in LEIS.glob("*.json")}
    falta = sorted(set(leis) - set(ICONES))
    sobra = sorted(set(ICONES) - set(leis))
    if falta or sobra:
        sys.exit(f"sem ícone: {falta}\nícone sem lei: {sobra}")
    combos = {}
    for lid, c in ICONES.items():
        if c in combos:
            sys.exit(f"ícone repetido: {lid} e {combos[c]} usam {c}")
        combos[c] = lid
        for peca in c:
            if peca and peca not in P:
                sys.exit(f"{lid}: peça {peca} não existe")
    manifesto = {"version": 2, "base": "src/assets/svg", "icons": {}}
    for lid, (principal, detalhe) in sorted(ICONES.items()):
        a = area.get(lid, "outros")
        destino = SAIDA / a / f"{lid}.svg"
        destino.parent.mkdir(parents=True, exist_ok=True)
        destino.write_text(svg(principal, detalhe))
        manifesto["icons"][lid] = {"area": a, "name": leis[lid]["nome"], "path": f"leis/{a}/{lid}.svg"}
    MANIFESTO.write_text(json.dumps(manifesto, ensure_ascii=False, indent=2) + "\n")
    print(f"{len(ICONES)} ícones gerados")


if __name__ == "__main__":
    main()
