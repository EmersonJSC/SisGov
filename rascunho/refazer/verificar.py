#!/usr/bin/env python3
"""Verificador do rascunho do mundo (rascunho/refazer/REGRAS.md).
Uso: python3 rascunho/refazer/verificar.py   (sai com código 1 se houver erro)"""
import json, os, re, sys, difflib, collections

BASE = os.path.dirname(os.path.abspath(__file__))
AREAS = ["contas-publicas", "economia-e-empresas", "trabalho", "protecao-social", "saude",
         "educacao-e-cultura", "infraestrutura-e-energia", "ambiente-e-campo",
         "seguranca-e-defesa", "direitos-e-costumes", "governo-e-instituicoes"]
UNID_IND = {"percentual_pib", "percentual_populacao", "percentual", "indice_0_100", "taxa_ano", "pessoas", "dinheiro"}
TIPOS_IND = {"estoque", "calculado", "situacao"}
ESSENCIAIS = {"pib", "industrializacao", "instrucao", "padrao_de_vida", "populacao", "radicais", "lealistas", "dinheiro_do_governo"}
MODELOS = {"planificado", "capitalismo_de_estado", "liberal", "social_democrata", "conservador_autoritario"}
FAMILIAS = {"imposto", "verba", "programa", "regra", "constitucional", "petrea"}
NIVEIS = {"petrea", "constituicao", "lei", "decreto"}
UNID_LEI = {"percentual_pib", "percentual", "indice_0_100", "taxa_ano", "percentual_populacao", "anos", "horas_semana", "meses"}
PAIS = re.compile(r"\bBrasil\b|brasileir|\bSUS\b|\bSelic\b|Petrobras|pré-sal|\bIBGE\b|\bBNDES\b|\bINSS\b|\bCLT\b|Bolsa Família|\bFGTS\b|Minha Casa|R\$|\breais\b|\bdólar(es)?\b|\beuros?\b|\byuan\b|Constituição de 19\d\d|\bLei n?º? ?\d|\bart\. ?\d|planalto\.gov|\bEUA\b|Estados Unidos|China|chines|União Europeia|\bIPTU\b|\bIPVA\b|\bICMS\b|\bIVA\b|\bPIS\b|\bCofins\b|\bCSLL\b|\bIRPJ\b|\bIOF\b|\bPEC\b|\bSTF\b|Banco Mundial|Lula|Bolsonaro|Trump", re.I)
JULGA = re.compile(r"\b(melhora|melhoram|melhorar|piora|pioram|piorar|bom|boa|bons|boas|ruim|ruins|justo|justa|injusto|injusta|moderniza|modernizar|atrasad[oa]s?|excessiv[oa]s?|abusiv[oa]s?|acertad[oa]|prejudica|prejudicam|beneficia|beneficiam|corrige|corrigir|avanço|retrocesso)\b", re.I)
ID_IND = re.compile(r"^[a-z0-9]+(_[a-z0-9]+)*$")
ID_LEI = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")

erros, avisos = [], []
def E(onde, msg): erros.append(f"ERRO  {onde}: {msg}")
def A(onde, msg): avisos.append(f"aviso {onde}: {msg}")

def ler(nome):
    p = os.path.join(BASE, nome)
    if not os.path.exists(p): return None
    try:
        with open(p, encoding="utf-8") as f: return json.load(f)
    except Exception as e:
        E(nome, f"JSON inválido: {e}"); return None

def textos(o, caminho=""):
    if isinstance(o, dict):
        for k, v in o.items(): yield from textos(v, f"{caminho}.{k}" if caminho else k)
    elif isinstance(o, list):
        for i, v in enumerate(o): yield from textos(v, f"{caminho}[{i}]")
    elif isinstance(o, str): yield caminho, o

def checar_texto(arquivo, obj):
    for c, t in textos(obj):
        m = PAIS.search(t)
        if m: E(arquivo, f"{c}: cita país ou sigla de país ({m.group(0)!r})")
        if "—" in t: E(arquivo, f"{c}: travessão (—) não pode")
        if not c.endswith(("id", "alvo", "indice", "lei", "unidade", "tipo", "familia", "nivel", "direcao", "forca", "atraso")) and ".antigo" not in c:
            m = JULGA.search(t)
            if m: E(arquivo, f"{c}: palavra que julga ({m.group(0)!r}); descreva o que acontece")

def repetidos(arquivo, rotulo, textos_, limite=0.88):
    """Frases iguais ou quase iguais no mesmo arquivo = preenchimento."""
    vistos = {}
    for t in textos_:
        k = re.sub(r"\W+", " ", str(t).lower()).strip()
        if not k: continue
        if k in vistos: E(arquivo, f"{rotulo} repetido: {t!r}"); continue
        vistos[k] = t
    ks = list(vistos)
    if len(ks) <= 400:
        for i in range(len(ks)):
            for j in range(i + 1, len(ks)):
                if difflib.SequenceMatcher(None, ks[i], ks[j]).ratio() > limite:
                    E(arquivo, f"{rotulo} quase igual a outro: {vistos[ks[i]]!r} ~ {vistos[ks[j]]!r}")

def bussola(onde, b):
    if not isinstance(b, dict) or set(b) != {"economia", "costumes"}: E(onde, "bussola precisa de economia e costumes"); return None
    for k, v in b.items():
        if not isinstance(v, int) or not -2 <= v <= 2: E(onde, f"bussola.{k} deve ser inteiro de -2 a 2")
    return b

# ---------- índices
ind = ler("indices.json"); IDS_IND = set()
if ind is not None:
    checar_texto("indices.json", ind)
    lista = ind.get("indices", [])
    for i, x in enumerate(lista):
        onde = f"indices.json/{x.get('id', i)}"
        for k in ("id", "nome", "mede", "unidade", "tipo", "essencial", "movidoPor", "antigo"):
            if k not in x: E(onde, f"falta {k}")
        if not ID_IND.match(str(x.get("id", ""))): E(onde, "id inválido (minúsculas e _)")
        if x.get("id") in IDS_IND: E(onde, "id repetido")
        IDS_IND.add(x.get("id"))
        if x.get("unidade") not in UNID_IND: E(onde, f"unidade deve ser uma de {sorted(UNID_IND)}")
        if x.get("tipo") not in TIPOS_IND: E(onde, f"tipo deve ser um de {sorted(TIPOS_IND)}")
        if x.get("essencial") is True and x.get("id") not in ESSENCIAIS: E(onde, "só os 8 da seção 3 são essenciais")
        if str(x.get("mede", "")).strip().endswith("?"): E(onde, "mede é afirmativo, não pergunta")
    pqs = []
    for x in lista:
        mv = x.get("movidoPor", [])
        if len(mv) > 6: E(f"indices.json/{x.get('id')}", "movidoPor: no máximo 6")
        for m in mv:
            if not isinstance(m, dict): E(f"indices.json/{x.get('id')}", "movidoPor: cada item é {indice, direcao, porque}"); continue
            if m.get("indice") not in IDS_IND: E(f"indices.json/{x.get('id')}", f"movidoPor cita índice inexistente {m.get('indice')!r}")
            if m.get("indice") == x.get("id"): E(f"indices.json/{x.get('id')}", "índice não se move sozinho")
            if m.get("direcao") not in ("sobe", "desce"): E(f"indices.json/{x.get('id')}", "movidoPor.direcao é sobe ou desce")
            if not m.get("porque"): E(f"indices.json/{x.get('id')}", "movidoPor precisa de porque")
            pqs.append(m.get("porque"))
        if not mv and x.get("tipo") != "estoque": A(f"indices.json/{x.get('id')}", "calculado sem movidoPor")
    repetidos("indices.json", "porque", pqs)
    repetidos("indices.json", "mede", [x.get("mede") for x in lista])
    for e in ESSENCIAIS - IDS_IND: E("indices.json", f"falta o essencial {e}")
    if not 80 <= len(lista) <= 140: A("indices.json", f"{len(lista)} índices; meta 80 a 140")
    # cobertura das variáveis antigas
    try:
        with open(os.path.join(BASE, "..", "..", "src/conteudo/mundo/indicadores/variaveis.json"), encoding="utf-8") as f:
            velhas = {v["id"] for v in json.load(f)["variaveis"] if v.get("tipo") in ("calculado", "estoque", "derivado", "situacao")}
        cobertas = [a for x in lista for a in x.get("antigo", [])] + [d.get("id") for d in ind.get("descartados", [])]
        for v in sorted(velhas - set(cobertas)): E("indices.json", f"variável antiga {v!r} não está em nenhum antigo nem em descartados")
        for v in {c for c in cobertas if cobertas.count(c) > 1}: E("indices.json", f"variável antiga {v!r} aparece mais de uma vez")
    except Exception as e:
        A("indices.json", f"não consegui ler variaveis.json para conferir 'antigo' ({e})")
else:
    A("indices.json", "ainda não existe")

# ---------- grupos
gr = ler("grupos.json"); IDS_GR = set()
if gr is not None:
    checar_texto("grupos.json", gr)
    lista = gr.get("grupos", [])
    for i, x in enumerate(lista):
        onde = f"grupos.json/{x.get('id', i)}"
        for k in ("id", "nome", "quem", "querem", "bussola", "antigo"):
            if k not in x: E(onde, f"falta {k}")
        if not ID_IND.match(str(x.get("id", ""))): E(onde, "id inválido (minúsculas e _)")
        if x.get("id") in IDS_GR: E(onde, "id repetido")
        IDS_GR.add(x.get("id"))
        q = x.get("querem", [])
        if not 2 <= len(q) <= 6: E(onde, "querem precisa de 2 a 6 itens")
        for w in q:
            if w.get("indice") not in IDS_IND: E(onde, f"querem cita índice inexistente {w.get('indice')!r}")
            if w.get("direcao") not in ("sobe", "desce"): E(onde, "direcao é sobe ou desce")
            if not w.get("porque"): E(onde, "querem precisa de porque")
        bussola(onde, x.get("bussola"))
    repetidos("grupos.json", "porque", [w.get("porque") for x in lista for w in x.get("querem", [])])
    repetidos("grupos.json", "quem", [x.get("quem") for x in lista])
    conj = collections.Counter(frozenset((w.get("indice"), w.get("direcao")) for w in x.get("querem", [])) for x in lista)
    for c_, n_ in conj.items():
        if n_ > 1: E("grupos.json", f"{n_} grupos querem exatamente a mesma coisa: {sorted(c_)}")
    usos = collections.Counter(w.get("indice") for x in lista for w in x.get("querem", []))
    for i_, n_ in usos.items():
        if n_ > len(lista) * 0.4: E("grupos.json", f"o índice {i_!r} está no querem de {n_} grupos; isso não separa um grupo do outro")
    if not 18 <= len(lista) <= 30: E("grupos.json", f"{len(lista)} grupos; precisa de 18 a 30")
    velhos = {f"grupo_{n}" for n in "agricultura_familiar agro ambientalistas aposentados catolicos classe_media conservadores empresarios evangelicos familias_com_filhos informais interior jovens pequenos_negocios periferias pobres progressistas ricos servidores trabalhadores".split()}
    cob = [a for x in lista for a in x.get("antigo", [])] + [d.get("id") for d in gr.get("descartados", [])]
    for v in sorted(velhos - set(cob)): E("grupos.json", f"grupo antigo {v!r} não está em nenhum antigo nem em descartados")
else:
    A("grupos.json", "ainda não existe")

# ---------- segmentos
sg = ler("segmentos.json")
if sg is not None:
    checar_texto("segmentos.json", sg)
    dims = {d.get("id"): d for d in sg.get("dimensoes", [])}
    if set(dims) != {"renda", "ocupacao"}: E("segmentos.json", "dimensoes: exatamente renda e ocupacao")
    faixas = {"renda": (4, 6), "ocupacao": (6, 12)}
    ids_sg = []
    for k, (lo, hi) in faixas.items():
        segs = dims.get(k, {}).get("segmentos", [])
        if not lo <= len(segs) <= hi: E(f"segmentos.json/{k}", f"de {lo} a {hi} segmentos")
        for x in segs:
            onde = f"segmentos.json/{k}/{x.get('id')}"
            for c_ in ("id", "nome", "quem", "gruposProximos"):
                if c_ not in x: E(onde, f"falta {c_}")
            if not ID_IND.match(str(x.get("id", ""))): E(onde, "id inválido")
            if x.get("id") in IDS_GR: E(onde, "id igual ao de um grupo")
            ids_sg.append(x.get("id"))
            if len(x.get("gruposProximos", [])) > 4: E(onde, "gruposProximos: no máximo 4")
            for g in x.get("gruposProximos", []):
                if g not in IDS_GR: E(onde, f"grupo inexistente {g!r}")
    for r in {i for i in ids_sg if ids_sg.count(i) > 1}: E("segmentos.json", f"id repetido {r!r}")
    repetidos("segmentos.json", "quem", [x.get("quem") for d in dims.values() for x in d.get("segmentos", [])])
else:
    A("segmentos.json", "ainda não existe")

# ---------- leis
LEIS = {}; POR_AREA = {}; QUEREM = {}
if gr is not None:
    for g in gr.get("grupos", []):
        for w in g.get("querem", []): QUEREM.setdefault((w.get("indice"), w.get("direcao")), set()).add(g.get("id"))
def tem_custo(ef, rj):
    if rj: return True
    oposto = {"sobe": "desce", "desce": "sobe"}
    return any(QUEREM.get((e.get("alvo"), oposto.get(e.get("direcao")))) for e in ef)
pasta = os.path.join(BASE, "leis")
arquivos = sorted(f for f in os.listdir(pasta) if f.endswith(".json")) if os.path.isdir(pasta) else []
for f in arquivos:
    nome = f"leis/{f}"; d = ler(nome)
    if d is None: continue
    checar_texto(nome, d)
    area = d.get("area")
    if area not in AREAS + ["centro"] or f != f"{area}.json": E(nome, "area do arquivo deve ser o nome do arquivo e uma das 11 áreas ou centro")
    POR_AREA[area] = d.get("leis", []); CONF = [0, 0]
    TXT = {"porque": [], "nota": [], "decide": [], "propoe": []}
    DIST = {"forca": collections.Counter(), "confianca": collections.Counter()}
    for i, L in enumerate(d.get("leis", [])):
        lid = L.get("id", f"#{i}"); onde = f"{nome}/{lid}"
        if not ID_LEI.match(str(lid)): E(onde, "id inválido (minúsculas e -)")
        if lid in LEIS: E(onde, f"id repetido (também em {LEIS[lid][0]})")
        LEIS[lid] = (nome, L)
        for k in ("nome", "decide", "familia", "nivel", "controle", "efeitos", "apoiam", "rejeitam", "requer", "exclui", "trava"):
            if k not in L: E(onde, f"falta {k}")
        fam = L.get("familia"); niv = L.get("nivel"); c = L.get("controle")
        ms = L.get("modelos")
        if area != "centro" and (not isinstance(ms, list) or not 1 <= len(ms) <= 2 or not set(ms) <= MODELOS): E(onde, f"modelos: 1 ou 2 de {sorted(MODELOS)}")
        TXT["decide"].append(L.get("decide"))
        if "como funciona" in str(L.get("decide", "")).lower(): E(onde, "decide genérico ('como funciona'); diga o que a lei decide de fato")
        if fam not in FAMILIAS: E(onde, f"familia deve ser uma de {sorted(FAMILIAS)}")
        if niv not in NIVEIS: E(onde, f"nivel deve ser um de {sorted(NIVEIS)}")
        if not str(L.get("decide", "")).startswith("Define") or str(L.get("decide", "")).strip().endswith("?"): E(onde, "decide começa com 'Define' e é afirmativo")
        if (area == "centro") != (fam == "petrea"): E(onde, "pétrea só em centro.json, e centro.json só pétrea")
        if fam == "petrea":
            if niv != "petrea": E(onde, "pétrea tem nivel petrea")
            if c is not None: E(onde, "pétrea tem controle null")
            if not L.get("principio"): E(onde, "pétrea precisa de principio")
        elif fam == "constitucional" and niv != "constituicao": E(onde, "constitucional tem nivel constituicao")
        elif fam not in ("petrea", "constitucional") and niv in ("petrea", "constituicao"): E(onde, "nível constituicao/petrea só para constitucional/pétrea")
        if fam == "imposto" and not L.get("cobraSobre"): E(onde, "imposto precisa de cobraSobre")
        if fam == "programa" and not L.get("quemRecebe"): E(onde, "programa precisa de quemRecebe")
        if fam in ("imposto", "verba", "programa"):
            if not isinstance(c, dict) or c.get("tipo") != "faixa": E(onde, f"{fam} usa controle faixa")
            else:
                u = "percentual" if fam == "imposto" else "percentual_pib"
                if c.get("unidade") != u: E(onde, f"{fam} usa unidade {u}")
        if fam == "constitucional" and (not isinstance(c, dict) or c.get("tipo") != "opcoes"): E(onde, "constitucional usa controle opcoes")
        if fam not in ("constitucional", "petrea") and L.get("trava"): E(onde, "só constitucional e pétrea travam")
        def efeitos(onde2, lst, minimo=2):
            if not minimo <= len(lst) <= 8: E(onde2, f"efeitos: de {minimo} a 8")
            alvos = [e.get("alvo") for e in lst]
            for r in {x for x in alvos if alvos.count(x) > 1}: E(onde2, f"o índice {r!r} aparece mais de uma vez; um efeito por índice")
            for e in lst:
                if e.get("alvo") not in IDS_IND: E(onde2, f"efeito com alvo inexistente {e.get('alvo')!r} (só índices)")
                if e.get("direcao") not in ("sobe", "desce"): E(onde2, "direcao é sobe ou desce")
                if e.get("forca") not in ("fraca", "media", "forte"): E(onde2, "forca é fraca, media ou forte")
                if e.get("atraso") not in ("imediato", "meses", "anos"): E(onde2, "atraso é imediato, meses ou anos")
                if not e.get("porque"): E(onde2, "efeito precisa de porque")
                cf = e.get("confianca")
                if cf not in ("consenso", "debatido", "jogo"): E(onde2, "confianca é consenso, debatido ou jogo")
                if cf == "debatido" and (not e.get("nota") or e.get("forca") == "forte"): E(onde2, "debatido precisa de nota e forca no máximo media")
                CONF[0] += 1; CONF[1] += cf == "jogo"
                TXT["porque"].append(e.get("porque")); TXT["nota"].append(e.get("nota")) if e.get("nota") else None
                DIST["forca"][e.get("forca")] += 1; DIST["confianca"][cf] += 1
            return lst
        def grupos(onde2, ap, rj):
            for g in list(ap) + list(rj):
                if g not in IDS_GR: E(onde2, f"grupo inexistente {g!r}")
            if len(ap) > 5 or len(rj) > 5: E(onde2, "apoiam/rejeitam: no máximo 5 cada")
            if set(ap) & set(rj): E(onde2, "o mesmo grupo não apoia e rejeita")
        if isinstance(c, dict) and c.get("tipo") == "faixa":
            if c.get("unidade") not in UNID_LEI: E(onde, f"unidade da faixa deve ser uma de {sorted(UNID_LEI)}")
            if not (isinstance(c.get("minimo"), (int, float)) and isinstance(c.get("maximo"), (int, float)) and c["minimo"] < c["maximo"]): E(onde, "faixa precisa de minimo < maximo")
            bussola(onde + ".bussolaNoMinimo", c.get("bussolaNoMinimo")); bussola(onde + ".bussolaNoMaximo", c.get("bussolaNoMaximo"))
            if "opcoes" in c: E(onde, "um controle só: faixa sem opcoes")
            ef = efeitos(onde, L.get("efeitos", [])); grupos(onde, L.get("apoiam", []), L.get("rejeitam", []))
            if not tem_custo(ef, L.get("rejeitam", [])): E(onde, "lei grátis: precisa de um grupo em rejeitam ou de um efeito que algum grupo não quer")
            alvo_d = [e for e in ef if e.get("alvo") == "dinheiro_do_governo"]
            if fam == "imposto" and not any(e.get("direcao") == "sobe" for e in alvo_d): E(onde, "imposto tem efeito dinheiro_do_governo sobe")
            if fam in ("verba", "programa") and not any(e.get("direcao") == "desce" for e in alvo_d): E(onde, f"{fam} tem efeito dinheiro_do_governo desce")
        elif isinstance(c, dict) and c.get("tipo") == "opcoes":
            ops = c.get("opcoes", [])
            if not 2 <= len(ops) <= 5: E(onde, "de 2 a 5 opções")
            if sum(1 for o in ops if o.get("referencia") is True) != 1: E(onde, "exatamente uma opção com referencia true")
            if L.get("efeitos") or L.get("apoiam") or L.get("rejeitam"): E(onde, "lei de opções: efeitos/apoiam/rejeitam ficam nas opções; na lei, []")
            vistos = set()
            for o in ops:
                oo = f"{onde}/{o.get('id')}"
                if not ID_LEI.match(str(o.get("id", ""))) or o.get("id") in vistos: E(oo, "id de opção inválido ou repetido")
                vistos.add(o.get("id"))
                TXT["propoe"].append(o.get("propoe"))
                for k in ("rotulo", "propoe", "bussola", "referencia", "efeitos", "apoiam", "rejeitam"):
                    if k not in o: E(oo, f"falta {k}")
                bussola(oo, o.get("bussola"))
                if o.get("referencia") is True:
                    if o.get("efeitos"): E(oo, "a opção referência tem efeitos []")
                else:
                    efeitos(oo, o.get("efeitos", []))
                    if not tem_custo(o.get("efeitos", []), o.get("rejeitam", [])): E(oo, "opção grátis: precisa de um grupo em rejeitam ou de um efeito que algum grupo não quer")
                grupos(oo, o.get("apoiam", []), o.get("rejeitam", []))
        elif fam != "petrea":
            E(onde, "controle deve ser {tipo: faixa} ou {tipo: opcoes}")
    if CONF[0] and CONF[1] * 4 > CONF[0]: E(nome, f"{CONF[1]} de {CONF[0]} efeitos são 'jogo'; no máximo 1 em 4")
    for k_, v_ in TXT.items(): repetidos(nome, k_, v_)
    if CONF[0] >= 10:
        for f_, n_ in DIST["forca"].items():
            if n_ > CONF[0] * 0.6: E(nome, f"{n_} de {CONF[0]} efeitos com forca {f_!r}; varie conforme os estudos")
        if DIST["confianca"]["consenso"] < CONF[0] * 0.25: E(nome, "menos de 1 em 4 efeitos é consenso; ponha primeiro o que é certo")
        if DIST["confianca"]["debatido"] > CONF[0] * 0.5: E(nome, "mais da metade dos efeitos é debatido")
    ev = os.path.join(BASE, "evidencias", f"{area}.md")
    if not os.path.exists(ev): E(nome, f"falta evidencias/{area}.md")
    else:
        txt = open(ev, encoding="utf-8").read()
        for L in d.get("leis", []):
            if f"## {L.get('id')}" not in txt: E(f"evidencias/{area}.md", f"falta a seção ## {L.get('id')}")
        if txt.count("Inspirado em:") < len(d.get("leis", [])): E(f"evidencias/{area}.md", "toda lei precisa de uma linha 'Inspirado em:'")
        linhas = [l.strip() for l in txt.splitlines() if l.strip().startswith("- ")]
        repetidos(f"evidencias/{area}.md", "linha de evidência", linhas, limite=0.92)
        bases = collections.Counter(l.split("Base:", 1)[1].strip() for l in linhas if "Base:" in l)
        for b_, n_ in bases.items():
            if n_ > 3: E(f"evidencias/{area}.md", f"a mesma base aparece {n_} vezes: {b_[:80]!r}")
        secoes = {m.group(1): m.group(2) for m in re.finditer(r"^## (\S+)\n(.*?)(?=^## |\Z)", txt, re.M | re.S)}
        for L in d.get("leis", []):
            c_ = L.get("controle") or {}
            n_ef = len(L.get("efeitos", [])) + sum(len(o.get("efeitos", [])) for o in c_.get("opcoes", []))
            n_ln = sum(1 for l in secoes.get(L.get("id"), "").splitlines() if l.strip().startswith("- "))
            if n_ln < n_ef: E(f"evidencias/{area}.md", f"{L.get('id')}: {n_ef} efeitos e só {n_ln} linhas de evidência")

def opcoes_de(lid):
    c = LEIS[lid][1].get("controle")
    return {o.get("id") for o in c.get("opcoes", [])} if isinstance(c, dict) and c.get("tipo") == "opcoes" else set()
for lid, (nome, L) in LEIS.items():
    onde = f"{nome}/{lid}"
    for r in L.get("requer", []):
        if r.get("lei") not in LEIS: E(onde, f"requer cita lei inexistente {r.get('lei')!r}")
        elif not set(r.get("opcoes", [])) <= opcoes_de(r["lei"]): E(onde, f"requer cita opção inexistente de {r['lei']}")
    for x in L.get("exclui", []):
        if x not in LEIS: E(onde, f"exclui cita lei inexistente {x!r}")
    for t in L.get("trava", []):
        if t.get("lei") not in LEIS: E(onde, f"trava cita lei inexistente {t.get('lei')!r}")
        if L.get("familia") == "constitucional" and t.get("opcao") not in opcoes_de(lid): E(onde, f"trava cita opção inexistente desta lei {t.get('opcao')!r}")

# quantidade e bússola por área
total = sum(len(v) for v in POR_AREA.values())
for a in AREAS:
    if a not in POR_AREA: A(f"leis/{a}.json", "ainda não existe"); continue
    n = len(POR_AREA[a])
    if not 12 <= n <= 35: (E if n > 35 else A)(f"leis/{a}.json", f"{n} leis; precisa de 12 a 35")
    cantos = set()
    for L in POR_AREA[a]:
        c = L.get("controle") or {}
        bs = [o.get("bussola") for o in c.get("opcoes", [])] if c.get("tipo") == "opcoes" else [c.get("bussolaNoMinimo"), c.get("bussolaNoMaximo")]
        for b in bs:
            if isinstance(b, dict) and b.get("economia") and b.get("costumes"):
                cantos.add(("estado" if b["economia"] < 0 else "mercado", "liberdade" if b["costumes"] < 0 else "autoridade"))
    mods = {m for L in POR_AREA[a] for m in (L.get("modelos") or [])}
    if MODELOS - mods: E(f"leis/{a}.json", f"modelos que faltam na área: {sorted(MODELOS - mods)}")
    if len(cantos) < 4: E(f"leis/{a}.json", f"bússola: só {len(cantos)} dos 4 cantos têm opção (faltam {sorted({('estado','liberdade'),('estado','autoridade'),('mercado','liberdade'),('mercado','autoridade')} - cantos)})")
if "centro" in POR_AREA and not 4 <= len(POR_AREA["centro"]) <= 10: E("leis/centro.json", "de 4 a 10 pétreas")
if len(POR_AREA) == 12 and not 240 <= total <= 260: E("leis", f"{total} leis no total; precisa de 240 a 260")

# de-para
dp = ler("de-para.json")
if dp is not None:
    for velho, novo in dp.items():
        if novo is not None and novo not in LEIS: E("de-para.json", f"{velho} → {novo!r}: lei nova inexistente")
    try:
        import glob
        velhas = {json.load(open(p, encoding="utf-8")).get("id") for p in glob.glob(os.path.join(BASE, "..", "..", "src/conteudo/mundo/leis/*.json"))}
        feitas = {a for a in POR_AREA}
        if len(feitas) == 12:
            for v in sorted(velhas - set(dp)): E("de-para.json", f"lei antiga {v!r} não está no de-para")
    except Exception as e:
        A("de-para.json", f"não consegui ler as leis antigas ({e})")

for a in avisos: print(a)
for e in erros: print(e)
print(f"\n{len(IDS_IND)} índices · {len(IDS_GR)} grupos · {total} leis em {len(POR_AREA)} arquivos · {len(erros)} erros · {len(avisos)} avisos")
sys.exit(1 if erros else 0)
