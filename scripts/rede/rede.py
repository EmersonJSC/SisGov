"""Rede do mundo (SG142): definição, calibragem pelo Brasil e geração de JSON.

Uso (na raiz do projeto):
  python3 scripts/rede/rede.py write .          # regenera os JSONs do mundo
  python3 scripts/rede/rede.py doc > docs/conteudo/rede.md
  python3 scripts/rede/check.py scripts/rede    # equilíbrio e cenários
"""
import json, math, os, sys

I = "indice_0_100"; P = "percentual_0_100"; V = "taxa_por_100_mil"; R = "indice_0_100_por_passo"

# ---- bolhas (id, tipo, nome, unidade, dominio, area, avaliacao, extra)
NODES = [
 ("capital_humano","estoque","Capital humano",I,(0,100),"Educação","maior_melhor",{}),
 ("capital_produtivo","estoque","Capital produtivo",I,(0,100),"Economia","maior_melhor",{}),
 ("cobertura_aps","calculado","Cobertura da atenção básica",P,(0,100),"Saúde","maior_melhor",{}),
 ("pressao_hospitalar","calculado","Pressão hospitalar",I,(0,100),"Saúde","maior_pior",{}),
 ("saude_populacao","calculado","Saúde da população",I,(0,100),"Saúde","maior_melhor",{}),
 ("frequencia_escolar","calculado","Frequência escolar",P,(0,100),"Educação","maior_melhor",{}),
 ("qualidade_educacao","calculado","Qualidade da educação",I,(0,100),"Educação","maior_melhor",{}),
 ("participacao_trabalho_cuidadoras","calculado","Participação no trabalho de quem cuida",P,(0,100),"Trabalho","maior_melhor",{}),
 ("oportunidades_juvenis","calculado","Oportunidades para jovens",I,(0,100),"Trabalho","maior_melhor",{}),
 ("qualificacao_trabalho","calculado","Qualificação do trabalho",I,(0,100),"Trabalho","maior_melhor",{}),
 ("produtividade","calculado","Produtividade",I,(0,100),"Economia","maior_melhor",{}),
 ("atividade_economica","calculado","Atividade econômica",I,(0,100),"Economia","maior_melhor",{}),
 ("investimento","calculado","Investimento",I,(0,100),"Economia","maior_melhor",{}),
 ("confianca_empresarial","calculado","Confiança empresarial",I,(0,100),"Economia","maior_melhor",{}),
 ("desemprego","calculado","Desemprego",P,(0,100),"Trabalho","maior_pior",{}),
 ("renda_familias","calculado","Renda das famílias",I,(0,100),"Economia","maior_melhor",{}),
 ("consumo","calculado","Consumo das famílias",I,(0,100),"Economia","maior_melhor",{}),
 ("pobreza","calculado","Pobreza",P,(0,100),"Desenvolvimento Social","maior_pior",{}),
 ("desigualdade","calculado","Desigualdade",I,(0,100),"Desenvolvimento Social","maior_pior",{}),
 ("violencia_letal","calculado","Violência letal",V,(0,60),"Segurança","maior_pior",{}),
 ("crime_organizado","calculado","Crime organizado",I,(0,100),"Segurança","maior_pior",{}),
 ("protecao_efetiva_mulheres","calculado","Proteção efetiva às mulheres",I,(0,100),"Mulheres","maior_melhor",{}),
 ("sensacao_seguranca","calculado","Sensação de segurança",I,(0,100),"Segurança","maior_melhor",{}),
 ("corrupcao","calculado","Corrupção",I,(0,100),"Governo","maior_pior",{}),
 ("capacidade_estatal","calculado","Capacidade do Estado",I,(0,100),"Governo","maior_melhor",{}),
 ("confianca_instituicoes","calculado","Confiança nas instituições",I,(0,100),"Governo","maior_melhor",{}),
 ("crise_atendimento","situacao","Crise no atendimento",I,(0,100),"Saúde","maior_pior",{"surgimento":62}),
 ("onda_violencia","situacao","Onda de violência",V,(0,60),"Segurança","maior_pior",{"surgimento":30}),
 ("recessao","situacao","Recessão",P,(0,100),"Economia","maior_pior",{"surgimento":12}),
 # carregador do evento de teste (eventos viram bolhas próprias no SG106)
 ("carga_evento_demanda","calculado","Carga do evento de demanda","quantidade",(1,1),"Saúde","neutra",{}),
]
LAWS = {  # controle -> (lei, nível do Brasil em R$ milhões/ano)
 "recursos_atencao_basica":("atencao-basica",4000),
 "recursos_protecao_mulheres":("protecao-mulheres",240),
 "recursos_prevencao_seguranca":("prevencao-seguranca",600),
 "recursos_alimentacao_escolar":("alimentacao-escolar",300),
 "recursos_creches_publicas":("creches-publicas",500),
}
EFF = lambda law: f"eficacia:{law}"
APO = lambda law: f"apoio:{law}"

def afim(c): return ("afim",{"coeficiente":c,"termoConstante":0})
def falta(c, teto=100): return ("limiar",{"limiar":teto,"coeficiente":c,"direcao":"abaixo"})
def acima(L, c): return ("limiar",{"limiar":L,"coeficiente":c,"direcao":"acima"})
def ret(c,s): return ("retornos_decrescentes",{"coeficiente":c,"escala":s})
def sat(m,s): return ("saturacao",{"maximo":m,"escala":s})

# ---- consequências: (id, origem, alvo, (mecanismo, parametros), atraso, descrição curta)
C = [
 # leis → rede
 ("verba-aps-amplia-cobertura","recursos_atencao_basica","cobertura_aps",ret(0.0283,3000),0,"verba na atenção básica amplia a cobertura, com retornos decrescentes"),
 ("verba-mulheres-amplia-protecao","recursos_protecao_mulheres","protecao_efetiva_mulheres",ret(0.18,240),0,"verba para a rede de proteção amplia a proteção efetiva"),
 ("verba-prevencao-reduz-violencia","recursos_prevencao_seguranca","violencia_letal",sat(-9,600),1,"prevenção reduz a violência letal, com teto"),
 ("verba-prevencao-reduz-crime","recursos_prevencao_seguranca","crime_organizado",sat(-10,600),1,"prevenção e cooperação reduzem o crime organizado"),
 ("merenda-eleva-frequencia","recursos_alimentacao_escolar","frequencia_escolar",sat(12,300),0,"alimentação escolar mantém crianças na escola, com teto"),
 ("capital-humano-eleva-frequencia","capital_humano","frequencia_escolar",afim(0.8),0,"famílias mais escolarizadas mantêm os filhos na escola"),
 ("creches-ampliam-participacao","recursos_creches_publicas","participacao_trabalho_cuidadoras",ret(0.0866,500),0,"creches liberam quem cuida para trabalhar"),
 # saúde
 ("cobertura-melhora-saude","cobertura_aps","saude_populacao",afim(0.4),0,""),
 ("falta-cobertura-pressiona","cobertura_aps","pressao_hospitalar",falta(1.0),0,"o que falta de cobertura vira pressão nos hospitais"),
 ("violencia-pressiona-hospitais","violencia_letal","pressao_hospitalar",afim(0.6),0,""),
 ("pobreza-pressiona-hospitais","pobreza","pressao_hospitalar",afim(0.45),0,""),
 ("pressao-prejudica-saude","pressao_hospitalar","saude_populacao",afim(-0.15),0,""),
 ("pressao-gera-crise","pressao_hospitalar","crise_atendimento",afim(1),0,"acima de 62 a crise no atendimento existe"),
 ("crise-piora-saude","crise_atendimento","saude_populacao",afim(-0.5),0,""),
 ("crise-reduz-eficacia-aps","crise_atendimento",EFF("atencao-basica"),("afim",{"coeficiente":-0.01,"termoConstante":0}),0,"hospital lotado faz a verba render menos"),
 ("crise-pede-verba-aps","crise_atendimento",APO("atencao-basica"),("afim",{"coeficiente":1.5,"termoConstante":0}),0,"a crise aumenta o apoio a mais verba"),
 ("renda-melhora-saude","renda_familias","saude_populacao",afim(0.3),0,""),
 ("pobreza-prejudica-saude","pobreza","saude_populacao",afim(-0.1),0,""),
 ("educacao-melhora-saude","capital_humano","saude_populacao",afim(0.35),0,"população mais educada cuida melhor da saúde"),
 # educação
 ("renda-eleva-frequencia","renda_familias","frequencia_escolar",afim(0.45),0,""),
 ("pobreza-reduz-frequencia","pobreza","frequencia_escolar",afim(-0.25),0,""),
 ("capital-humano-eleva-qualidade","capital_humano","qualidade_educacao",afim(0.5),0,""),
 ("frequencia-eleva-qualidade","frequencia_escolar","qualidade_educacao",afim(0.2),0,""),
 ("estado-eleva-qualidade","capacidade_estatal","qualidade_educacao",afim(0.05),0,""),
 ("frequencia-forma-capital-humano","frequencia_escolar","capital_humano",("afim",{"coeficiente":0.0067,"termoConstante":0}),0,"estoque: escola de hoje vira capital humano devagar"),
 ("qualidade-forma-capital-humano","qualidade_educacao","capital_humano",("afim",{"coeficiente":0.01,"termoConstante":0}),0,""),
 ("capital-humano-se-desgasta","capital_humano","capital_humano",("afim",{"coeficiente":-0.02,"termoConstante":0}),0,"estoque: perde 2% por trimestre sem reposição"),
 # trabalho
 ("emprego-eleva-participacao","desemprego","participacao_trabalho_cuidadoras",falta(0.35),0,"quanto mais emprego, mais quem cuida consegue trabalhar"),
 ("frequencia-abre-oportunidades","frequencia_escolar","oportunidades_juvenis",afim(0.3),0,""),
 ("qualificacao-abre-oportunidades","qualificacao_trabalho","oportunidades_juvenis",afim(0.2),0,""),
 ("atividade-abre-oportunidades","atividade_economica","oportunidades_juvenis",afim(0.15),0,""),
 ("participacao-abre-oportunidades","participacao_trabalho_cuidadoras","oportunidades_juvenis",afim(0.08),0,""),
 ("capital-humano-qualifica","capital_humano","qualificacao_trabalho",afim(1.0),0,""),
 ("oportunidades-qualificam","oportunidades_juvenis","qualificacao_trabalho",afim(0.11),0,""),
 ("falta-atividade-gera-desemprego","atividade_economica","desemprego",falta(0.12),0,""),
 ("falta-qualificacao-gera-desemprego","qualificacao_trabalho","desemprego",falta(0.06),0,""),
 # economia
 ("qualificacao-eleva-produtividade","qualificacao_trabalho","produtividade",afim(0.4),0,""),
 ("capital-produtivo-eleva-produtividade","capital_produtivo","produtividade",afim(0.4),0,""),
 ("saude-eleva-produtividade","saude_populacao","produtividade",afim(0.15),0,""),
 ("corrupcao-reduz-produtividade","corrupcao","produtividade",afim(-0.05),0,""),
 ("produtividade-move-atividade","produtividade","atividade_economica",afim(0.5),0,""),
 ("consumo-move-atividade","consumo","atividade_economica",afim(0.3),0,""),
 ("investimento-move-atividade","investimento","atividade_economica",afim(0.25),1,"investimento demora um trimestre para virar atividade"),
 ("emprego-gera-renda","desemprego","renda_familias",falta(0.35),0,""),
 ("produtividade-gera-renda","produtividade","renda_familias",afim(0.3),0,""),
 ("participacao-gera-renda","participacao_trabalho_cuidadoras","renda_familias",afim(0.05),0,""),
 ("renda-move-consumo","renda_familias","consumo",afim(0.8),0,""),
 ("confianca-move-consumo","confianca_instituicoes","consumo",afim(0.2),0,""),
 ("recessao-reduz-consumo","recessao","consumo",afim(-1),0,""),
 ("falta-renda-gera-pobreza","renda_familias","pobreza",falta(0.5),0,""),
 ("desemprego-gera-pobreza","desemprego","pobreza",afim(0.6),0,""),
 ("pobreza-gera-desigualdade","pobreza","desigualdade",afim(1.0),0,""),
 ("falta-qualificacao-gera-desigualdade","qualificacao_trabalho","desigualdade",falta(0.4),0,""),
 ("seguranca-anima-empresas","sensacao_seguranca","confianca_empresarial",afim(0.4),0,""),
 ("integridade-anima-empresas","corrupcao","confianca_empresarial",falta(0.3),0,"o que falta de corrupção é integridade"),
 ("atividade-anima-empresas","atividade_economica","confianca_empresarial",afim(0.3),0,""),
 ("recessao-desanima-empresas","recessao","confianca_empresarial",afim(-1),0,""),
 ("confianca-gera-investimento","confianca_empresarial","investimento",afim(0.5),0,""),
 ("atividade-gera-investimento","atividade_economica","investimento",afim(0.3),0,""),
 ("onda-violencia-afasta-investimento","onda_violencia","investimento",afim(-0.5),0,""),
 ("investimento-forma-capital","investimento","capital_produtivo",("afim",{"coeficiente":0.025,"termoConstante":0}),0,"estoque: investimento vira capital produtivo"),
 ("capital-produtivo-se-desgasta","capital_produtivo","capital_produtivo",("afim",{"coeficiente":-0.02,"termoConstante":0}),0,"estoque: depreciação de 2% por trimestre"),
 ("desemprego-gera-recessao","desemprego","recessao",afim(1),0,"acima de 12% de desemprego há recessão"),
 # segurança
 ("pobreza-gera-violencia","pobreza","violencia_letal",afim(0.25),0,""),
 ("desigualdade-gera-violencia","desigualdade","violencia_letal",afim(0.12),0,""),
 ("crime-gera-violencia","crime_organizado","violencia_letal",afim(0.15),0,""),
 ("falta-oportunidade-gera-violencia","oportunidades_juvenis","violencia_letal",falta(0.03),0,""),
 ("corrupcao-alimenta-crime","corrupcao","crime_organizado",afim(0.4),0,""),
 ("falta-oportunidade-alimenta-crime","oportunidades_juvenis","crime_organizado",falta(0.25),0,""),
 ("desigualdade-alimenta-crime","desigualdade","crime_organizado",afim(0.2),0,""),
 ("estado-amplia-protecao","capacidade_estatal","protecao_efetiva_mulheres",afim(0.24),0,""),
 ("paz-traz-seguranca","violencia_letal","sensacao_seguranca",falta(1.0,60),1,"a sensação de segurança reage com um trimestre de atraso"),
 ("protecao-traz-seguranca","protecao_efetiva_mulheres","sensacao_seguranca",afim(0.03),0,""),
 ("onda-violencia-assusta","onda_violencia","sensacao_seguranca",afim(-1.5),0,""),
 ("violencia-gera-onda","violencia_letal","onda_violencia",afim(1),0,"acima de 30 por 100 mil há onda de violência"),
 ("onda-pede-prevencao","onda_violencia",APO("prevencao-seguranca"),("afim",{"coeficiente":1.5,"termoConstante":0}),0,""),
 # governo
 ("falta-capacidade-gera-corrupcao","capacidade_estatal","corrupcao",falta(0.5),0,""),
 ("desigualdade-gera-corrupcao","desigualdade","corrupcao",afim(0.3),0,""),
 ("qualificacao-fortalece-estado","qualificacao_trabalho","capacidade_estatal",afim(0.5),0,""),
 ("confianca-fortalece-estado","confianca_instituicoes","capacidade_estatal",afim(0.5),0,""),
 ("integridade-gera-confianca","corrupcao","confianca_instituicoes",falta(0.5),0,""),
 ("seguranca-gera-confianca","sensacao_seguranca","confianca_instituicoes",afim(0.3),0,""),
 ("saude-gera-confianca","saude_populacao","confianca_instituicoes",afim(0.1),0,""),
]
# corrupção e capacidade do Estado mexem na eficácia de todas as leis
for ctrl,(law,_) in LAWS.items():
    C.append((f"corrupcao-reduz-eficacia-{law}","corrupcao",EFF(law),("afim",{"coeficiente":-0.005,"termoConstante":0}),0,"parte da verba se perde com a corrupção"))
    C.append((f"estado-eleva-eficacia-{law}","capacidade_estatal",EFF(law),("afim",{"coeficiente":0.002,"termoConstante":0}),0,"um Estado mais capaz executa melhor"))
C.append(("evento-eleva-pressao","carga_evento_demanda","pressao_hospitalar",afim(9),0,"usado só pelo evento de teste"))

UNIT = {n[0]:n[3] for n in NODES}
UNIT.update({c:"moeda_ano" for c in LAWS})
for _,(law,_) in LAWS.items(): UNIT[EFF(law)]="fator"; UNIT[APO(law)]="pontos"
KIND = {n[0]:n[1] for n in NODES}; DOM={n[0]:n[4] for n in NODES}
for _,(law,_) in LAWS.items(): KIND[EFF(law)]="lei"; KIND[APO(law)]="lei"; DOM[EFF(law)]=(0,2); DOM[APO(law)]=(-100,100)
for c in LAWS: KIND[c]="controle"

def unit_of(target):
    u = UNIT[target]
    return u + "_por_passo" if KIND.get(target)=="estoque" else u

def contrib(mech, p, x):
    if mech=="afim": return p["coeficiente"]*x
    if mech=="saturacao": return p["maximo"]*(1-math.exp(-x/p["escala"]))
    if mech=="retornos_decrescentes": return p["coeficiente"]*p["escala"]*math.log1p(x/p["escala"])
    if mech=="limiar":
        e = p["limiar"]-x if p["direcao"]=="abaixo" else x-p["limiar"]
        return p["coeficiente"]*e if e>0 else 0.0
def clamp(v,d):
    lo,hi=d; return max(lo,min(hi,v))

def simulate(levels, stocks, quarters=200, event=False, settle=True, frozen=False, start=None):
    lawctrl = {law:ctrl for ctrl,(law,_) in LAWS.items()}
    if start is not None: v=dict(start)
    else:
        v = {n[0]:0.0 for n in NODES}; v.update(stocks); v.update(levels)
        v["carga_evento_demanda"]=1
        for _,(law,_) in LAWS.items(): v[EFF(law)]=1.0; v[APO(law)]=0.0
    calc=[n[0] for n in NODES if n[1] in("calculado","situacao")]
    # turno 0: acomoda leis e bolhas sem acumular estoques (como o motor)
    if settle:
        for _ in range(200):
            w,_h = simulate(levels, {k:v[k] for k in stocks}, 1, event, settle=False, frozen=True, start=v)
            if all(abs(w[k]-v[k])<1e-9 for k in v): v=w; break
            v=w
    hist=[dict(v)]
    def delivered(vals,o):
        if o in LAWS: return vals[o]*vals[EFF(LAWS[o][0])]
        return vals[o]
    for q in range(quarters):
        prev=dict(v); nxt=dict(v)
        for law in [l for _,(l,_) in LAWS.items()]:
            for tgt,base in ((EFF(law),1.0),(APO(law),0.0)):
                s=base+sum(contrib(m,p,delivered(prev,o)) for (_,o,t,(m,p),d,_) in C if t==tgt)
                nxt[tgt]=clamp(s,DOM[tgt])
        done=set()
        # ordem: tenta resolver dependências delay-0; ciclo -> menor id
        pending=sorted(calc)
        while pending:
            ready=[x for x in pending if all((o not in calc) or (o in done) or o==x for (_,o,t,_,d,_) in C if t==x and d==0)]
            x = ready[0] if ready else pending[0]
            s=0.0
            for (cid,o,t,(m,p),d,_) in C:
                if t!=x: continue
                if o=="carga_evento_demanda" and not event: continue
                src = hist[-d] if d>0 and len(hist)>=d else (prev if (o in calc and o not in done) or KIND.get(o)=="estoque" else nxt)
                s+=contrib(m,p,delivered(src,o))
            if KIND[x]=="situacao": s=max(0,s-dict((n[0],n[7]) for n in NODES)[x]["surgimento"])
            nxt[x]=clamp(s,DOM[x]) if x!="carga_evento_demanda" else 1
            done.add(x); pending.remove(x)
        for st in [n[0] for n in NODES if n[1]=="estoque"]:
            r=sum(contrib(m,p,delivered(prev if (o in [n[0] for n in NODES if n[1]=="estoque"]) else nxt,o)) for (_,o,t,(m,p),d,_) in C if t==st)
            nxt[st]=prev[st] if frozen else clamp(prev[st]+r,DOM[st])
        v=nxt; hist.append(dict(v))
    return v, hist

# ---- calibragem: o Brasil de hoje (hipótese) é um ponto de equilíbrio
TARGET = {
 "capital_humano":45,"capital_produtivo":50,"cobertura_aps":72,"pressao_hospitalar":54,
 "saude_populacao":60,"frequencia_escolar":75,"qualidade_educacao":40,
 "participacao_trabalho_cuidadoras":62,"oportunidades_juvenis":45,"qualificacao_trabalho":50,
 "produtividade":50,"atividade_economica":50,"investimento":40,"confianca_empresarial":50,
 "desemprego":9,"renda_familias":50,"consumo":50,"pobreza":30,"desigualdade":55,
 "violencia_letal":21,"crime_organizado":40,"protecao_efetiva_mulheres":42,
 "sensacao_seguranca":40,"corrupcao":40,"capacidade_estatal":50,"confianca_instituicoes":45,
 "crise_atendimento":0,"onda_violencia":0,"recessao":0,"carga_evento_demanda":1,
}
def target_values():
    t=dict(TARGET)
    for c,(law,lvl) in LAWS.items():
        t[c]=lvl
        t[EFF(law)]=1-0.005*t["corrupcao"]+0.002*t["capacidade_estatal"]
        t[APO(law)]=0
    return t
def scale_param(m,p,k):
    p=dict(p)
    if m=="saturacao": p["maximo"]*=k
    else: p["coeficiente"]*=k
    return p
def calibrate():
    global C
    t=target_values()
    def deliv(o): return t[o]*t[EFF(LAWS[o][0])] if o in LAWS else t[o]
    out=[]
    groups={}
    for e in C: groups.setdefault(e[2],[]).append(e)
    for tgt,edges in groups.items():
        kind=KIND.get(tgt)
        if kind in("lei",) or tgt=="carga_evento_demanda" or kind=="situacao":
            out+=edges; continue
        fixed=[e for e in edges if e[1] in("crise_atendimento","onda_violencia","recessao","carga_evento_demanda") or (kind=="estoque" and e[1]==tgt)]
        free=[e for e in edges if e not in fixed]
        want = TARGET[tgt]
        if kind=="estoque":  # entradas = desgaste no equilíbrio
            want = -sum(contrib(m,p,deliv(o)) for (_,o,_,(m,p),_,_) in fixed)
        have=sum(contrib(m,p,deliv(o)) for (_,o,_,(m,p),_,_) in free)
        k = want/have if have else 1
        out += fixed + [(i,o,tg,(m,scale_param(m,p,k)),d,ds) for (i,o,tg,(m,p),d,ds) in free]
    C=out

def r6(x):
    return float(f"{x:.6g}") if isinstance(x,float) else x

def write(root):
    calibrate()
    W=os.path.join(root,"src/conteudo/mundo")
    save=lambda p,d:(open(p,"w").write(json.dumps(d,ensure_ascii=False,indent=2)+"\n"))
    # variáveis do mundo
    old=json.load(open(f"{W}/indicadores/variaveis.json"))
    ctrls=[x for x in old["variaveis"] if x["tipo"]=="controle"]
    nodes=[]
    for (i,t,n,u,(lo,hi),area,av,extra) in NODES:
        d={"id":i,"tipo":t,"nome":n,"unidade":u,"dominio":{"minimo":lo,"maximo":hi},"area":area,"avaliacao":av}
        d.update(extra); nodes.append(d)
    old["variaveis"]=ctrls+nodes
    save(f"{W}/indicadores/variaveis.json",old)
    # consequências: substitui todas
    for f in os.listdir(f"{W}/consequencias"): os.remove(f"{W}/consequencias/{f}")
    paths=[]
    for (cid,o,t,(m,p),d,_) in C:
        save(f"{W}/consequencias/{cid}.json",{"id":cid,"tipo":"consequencia","versaoEsquema":1,"origem":o,"alvo":t,
             "mecanismo":m,"parametros":{k:r6(v) for k,v in p.items()},"unidade":unit_of(t),"atrasoPassos":d,
             # o evento de teste pressiona por 3 trimestres; o resto da rede é contínuo
             "duracao":{"modo":"fixo","passos":3} if o=="carga_evento_demanda" else {"modo":"continuo"}})
        paths.append(f"mundo/consequencias/{cid}.json")
    w=json.load(open(f"{W}/mundo.json")); w["consequencias"]=sorted(paths); w["situacoes"]=[]
    save(f"{W}/mundo.json",w)
    for f in os.listdir(f"{W}/situacoes"): os.remove(f"{W}/situacoes/{f}")
    # leis: só o que sai do próprio controle
    for ctrl,(law,_) in LAWS.items():
        p=f"{W}/leis/{law}.json"; l=json.load(open(p))
        l["consequencias"]=sorted(cid for (cid,o,_,_,_,_) in C if o==ctrl)
        save(p,l)
    # países: só leis (controles) e estoques
    for path,stocks in [("src/conteudo/paises/brasil/estado-inicial.json",{"capital_humano":45,"capital_produtivo":50}),
                        ("src/conteudo/testes/pais-teste/estado-inicial.json",{"capital_humano":30,"capital_produtivo":35})]:
        p=os.path.join(root,path); e=json.load(open(p))
        e["valores"]={k:v for k,v in e["valores"].items() if k in LAWS}; e["valores"].update(stocks)
        save(p,e)

def doc():
    calibrate()
    names={n[0]:n[2] for n in NODES}
    for c,(law,_) in LAWS.items(): names[c]=f"Lei: {law}"; names[EFF(law)]=f"Eficácia da lei {law}"; names[APO(law)]=f"Apoio à lei {law}"
    lines=[]
    order=[n[0] for n in NODES if n[0]!="carga_evento_demanda"]+[EFF(l) for _,(l,_) in LAWS.items()]+[APO(l) for _,(l,_) in LAWS.items()]
    t=target_values()
    def sign(m,p):
        if m=="saturacao": return p["maximo"]>=0
        return p["coeficiente"]>=0
    def how(m,p,o,x=None):
        if o==x: return "desgaste natural (por trimestre)"
        if m=="limiar" and p["direcao"]=="abaixo": return f"falta de {names[o].lower()}"
        return names[o]
    for x in order:
        ins=[e for e in C if e[2]==x and e[1]!="carga_evento_demanda"]
        if not ins: continue
        pos=[how(e[3][0],e[3][1],e[1]) + (f" ({e[3][0].replace('_',' ')})" if e[3][0]!="afim" else "") + (" — 1 trimestre de atraso" if e[4] else "") for e in ins if (sign(*e[3]) != (e[3][0]=="limiar" and e[3][1]["direcao"]=="abaixo" and False))]
        posl=[]; negl=[]
        for e in ins:
            m,p=e[3]; label=how(m,p,e[1],x)
            if m!="afim": label+=f" ({m.replace('_',' ')})"
            if e[4]: label+=" — 1 trimestre de atraso"
            (posl if sign(m,p) else negl).append(label)
        val=t.get(x)
        lines.append(f"### {names[x]}" + (f" — Brasil hoje: {val:g}" if isinstance(val,(int,float)) and not x.startswith(("eficacia","apoio")) else ""))
        lines.append("")
        lines.append("- **Positivo ←** " + (", ".join(posl) if posl else "—"))
        lines.append("- **Negativo ←** " + (", ".join(negl) if negl else "—"))
        lines.append("")
    return "\n".join(lines)

if __name__=="__main__" and len(sys.argv)>1 and sys.argv[1]=="write":
    write(sys.argv[2]); print("ok")
if __name__=="__main__" and len(sys.argv)>1 and sys.argv[1]=="doc":
    print(doc())
