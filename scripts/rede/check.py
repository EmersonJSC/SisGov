import sys; sys.path.insert(0, sys.argv[1])
import rede
rede.calibrate()
levels={c:l for c,(_,l) in rede.LAWS.items()}
stocks={"capital_humano":45,"capital_produtivo":50}
v,_=rede.simulate(levels,stocks,200)
bad={k:(round(v[k],2),rede.TARGET[k]) for k in rede.TARGET if abs(v[k]-rede.TARGET[k])>0.5}
print("desvios do equilíbrio após 200 trimestres:", bad or "nenhum")
base40,_=rede.simulate(levels,stocks,40)
t0,_=rede.simulate(levels,stocks,0)
print("turno 0 longe do alvo:", {k:round(t0[k],2) for k in rede.TARGET if abs(t0[k]-rede.TARGET[k])>0.01} or "nada")
def run(change, q=40):
    l=dict(levels); l.update(change); w,_=rede.simulate(l,stocks,q); return w
for name,change in [("APS 4000→6000",{"recursos_atencao_basica":6000}),("APS 4000→2400",{"recursos_atencao_basica":2400}),
                    ("merenda 300→0",{"recursos_alimentacao_escolar":0}),("merenda 300→1000",{"recursos_alimentacao_escolar":1000}),
                    ("prevenção 600→1400",{"recursos_prevencao_seguranca":1400}),("creches 500→1600",{"recursos_creches_publicas":1600})]:
    w=run(change)
    keys=["cobertura_aps","saude_populacao","pressao_hospitalar","frequencia_escolar","capital_humano","qualificacao_trabalho","produtividade","atividade_economica","desemprego","renda_familias","pobreza","violencia_letal","corrupcao","crise_atendimento"]
    print(f"\n{name} (10 anos):", ", ".join(f"{k}={w[k]-base40[k]:+.2f}" for k in keys if abs(w[k]-base40[k])>0.05))
