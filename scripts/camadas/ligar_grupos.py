#!/usr/bin/env python3
"""Liga o "quem apoia / quem rejeita" das fichas (V1-34) aos grupos do jogo.

Para cada lei no formato novo (tem `implantacaoTurnos`) e cada grupo citado
nas opções dela (`apoiam` / `rejeitam`), SÓ nas leis que o país ainda não tem em
vigor (as que já valem no turno 0 mexeriam na calibração do início):
  * grupo de pressão (pressao.json): ganha um `reage` da lei quando o grupo
    rejeita os níveis altos (a pressão sobe quando a lei sobe);
  * segmento do eleitorado (grupo_*): ganha uma consequência afim de 0,07
    (hipótese, escala média das leis atuais); uma lei liga no máximo uma vez
    a cada segmento.
Nunca mexe no que já existe: lei que já tem reação ou consequência para o grupo
fica como está. Nomes de grupo sem par vão para saida/grupos-sem-par.md.
Idempotente (as consequências novas têm o prefixo `grupos--`)."""

import json
import os
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
CONT = RAIZ / "src" / "conteudo"
MUNDO = CONT / "mundo"
SAIDA = Path(__file__).resolve().parent / "saida"

PRESSAO_ALIAS = {
    "indústria": ["industria"], "confederação da indústria": ["industria"],
    "sindicatos de servidores": ["sindicatos_servidores"],
    "igrejas evangélicas": ["neopentecostais", "evangelicas_tradicionais"],
    "movimento pela saúde pública": ["saude_publica"], "entidades de saúde pública": ["saude_publica"],
    "entidades do agronegócio": ["agronegocio"], "ruralistas": ["ruralistas"],
    "associações de militares": ["militares"], "militares": ["militares"],
    "militares da reserva": ["militares_reserva"],
    "pastorais católicas": ["pastorais"], "hierarquia católica e pastorais": ["hierarquia_catolica", "pastorais"],
    "pastorais sociais católicas": ["pastorais"],
    "movimentos por moradia": ["moradia"], "plataformas": ["plataformas"],
    "lgbt": ["lgbt"], "feminista": ["feminista"], "jornais e portais": ["jornais_portais"],
    "maior rede de tv aberta": ["tv_aberta"], "estudantes": ["estudantes"],
    "atiradores e donos de armas pelo porte": ["armamentista"],
    "movimento ambientalista": ["ambientalista"], "grupo de jornais e portais": ["jornais_portais"],
}
SEGMENTO_ALIAS = {
    "pequenos negócios": "grupo_pequenos_negocios", "pequenos empreendedores": "grupo_pequenos_negocios",
    "agronegócio": "grupo_agro", "agro": "grupo_agro", "periferias": "grupo_periferias",
    "informais": "grupo_informais", "servidores": "grupo_servidores", "trabalhadores": "grupo_trabalhadores",
    "ambientalistas": "grupo_ambientalistas",
}


# grupos cujo nível do turno 0 não aguenta a rampa negativa de "alto" ancorado
SEM_ALTO_AO_VIVO = {"industria"}


def ler(p):
    return json.loads(Path(p).read_text(encoding="utf-8"))


def gravar(p, d):
    Path(p).write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def norm(s):
    return s.strip().lower()


def main():
    pressao = ler(MUNDO / "pressao.json")
    variaveis = ler(MUNDO / "indicadores" / "variaveis.json")["variaveis"]
    pl = ler(CONT / "paises" / "brasil" / "leis.json")
    mu = ler(MUNDO / "mundo.json")
    por_nome = {norm(g["nome"]): [g["id"]] for g in pressao["grupos"]}
    por_nome.update(PRESSAO_ALIAS)
    grupos_pressao = {g["id"]: g for g in pressao["grupos"]}
    seg_nome = {norm(v["nome"]): v["id"] for v in variaveis if v["id"].startswith("grupo_")}
    seg_nome.update(SEGMENTO_ALIAS)
    em_vigor = {e["lei"] for e in pl["emVigor"]}
    sem_par, n_reage, n_cons = {}, 0, 0
    # limpa o que este script criou antes
    for cf in list((MUNDO / "consequencias").glob("grupos--*.json")):
        cf.unlink()
    mu["consequencias"] = [c for c in mu["consequencias"] if "/grupos--" not in c]
    meu = SAIDA / "grupos-reage.json"
    antes = {tuple(x) for x in (ler(meu) if meu.exists() else [])}
    for g in pressao["grupos"]:
        g["reage"] = [r for r in g["reage"] if (g["id"], r.get("lei")) not in antes]
    criados = []
    for f in sorted((MUNDO / "leis").glob("*.json")):
        lei = ler(f)
        if "implantacaoTurnos" not in lei:
            continue
        limpa = [c for c in lei.get("consequencias", []) if not c.startswith("grupos--")]
        mudou_lista = limpa != lei.get("consequencias", [])
        lei["consequencias"] = limpa
        var = lei["controle"]["variavel"]
        ops = lei["controle"]["opcoes"]
        nivel = pl["controles"].get(var)
        vigor = lei["id"] in em_vigor and nivel is not None
        # quem apoia / rejeita, por valor de opção
        apoio, rejeito = {}, {}
        for o in ops:
            for nome in o.get("apoiam", []):
                apoio.setdefault(norm(nome), []).append(o["valor"])
            for nome in o.get("rejeitam", []):
                rejeito.setdefault(norm(nome), []).append(o["valor"])
        existentes_seg = set()
        for cid in lei.get("consequencias", []):
            cf = MUNDO / "consequencias" / f"{cid}.json"
            if cf.exists() and ler(cf)["alvo"].startswith("grupo_"):
                existentes_seg.add(ler(cf)["alvo"])
        novas_cons = []
        for nome in sorted(set(apoio) | set(rejeito)):
            if nome.startswith(("quem ", "quase", "nenhum", "lacuna", "parte dos")):
                continue
            a = sum(apoio.get(nome, [])) / len(apoio[nome]) if nome in apoio else None
            r = sum(rejeito.get(nome, [])) / len(rejeito[nome]) if nome in rejeito else None
            # o grupo gosta de níveis mais altos (+1) ou mais baixos (-1)?
            if a is not None and r is not None:
                lado = 1 if a > r else -1 if a < r else 0
            elif a is not None:
                lado = 1 if a > 50 else -1
            else:
                lado = -1 if r > 50 else 1
            if lado == 0:
                continue
            achou = False
            for gid in ([] if os.environ.get("SEM_PRESSAO") else por_nome.get(nome, [])):
                g = grupos_pressao.get(gid)
                if not g:
                    continue
                achou = True
                if any(x.get("lei") == lei["id"] and (g["id"], lei["id"]) not in {tuple(c) for c in criados} for x in g["reage"]):
                    continue
                sobe = "baixo" if lado == 1 else "alto"  # gosta de alto => pressão sobe quando o nível cai
                if os.environ.get("SO_DIRECAO") and os.environ["SO_DIRECAO"] != sobe:
                    continue
                if os.environ.get("SO_VIGOR") == "1" and not vigor:
                    continue
                if os.environ.get("SO_VIGOR") == "0" and vigor:
                    continue
                if vigor:
                    # Lei já em vigor: ancorar no nível de partida mexe no turno 0 (a pressão
                    # é um estoque e a lei sobe de 0 no aquecimento): medido, desvia até 14
                    # pontos. Fica para a calibração dos grupos (pendências).
                    continue
                else:
                    if sobe == "baixo":
                        continue  # lei fora de vigor vale 0: "baixo" mexeria na pressão do turno 0
                    faixa = [0, 100]
                g["reage"].append({"lei": lei["id"], "sobe": sobe, "peso": 10, "faixa": faixa})
                criados.append([gid, lei["id"]])
                n_reage += 1
            sid = None if os.environ.get("SEM_SEGMENTOS") else seg_nome.get(nome)
            if sid:
                achou = True
                if sid not in existentes_seg and not (vigor and os.environ.get("SEGMENTOS_EM_VIGOR") != "1"):
                    existentes_seg.add(sid)
                    coef = 0.07 * lado
                    cid = f"grupos--{lei['id']}--{sid.replace('_', '-')}"
                    c = {"id": cid, "tipo": "consequencia", "versaoEsquema": 1, "origem": var, "alvo": sid,
                         "mecanismo": "afim",
                         "parametros": {"coeficiente": coef, "termoConstante": round(-coef * nivel, 6) if vigor else 0},
                         "unidade": "indice_0_100", "atrasoPassos": 1, "duracao": {"modo": "continuo"}}
                    gravar(MUNDO / "consequencias" / f"{cid}.json", c)
                    mu["consequencias"].append(f"mundo/consequencias/{cid}.json")
                    novas_cons.append(cid)
                    n_cons += 1
            if not achou:
                sem_par.setdefault(nome, 0)
                sem_par[nome] += 1
        if novas_cons or mudou_lista:
            lei["consequencias"] = list(dict.fromkeys(lei.get("consequencias", []) + novas_cons))
            gravar(f, lei)
    gravar(meu, criados)
    gravar(MUNDO / "pressao.json", pressao)
    gravar(MUNDO / "mundo.json", mu)
    linhas = ["# Nomes de grupo das fichas sem par no jogo (V1-34)\n\n"]
    linhas += [f"- {n} ({c} vezes)\n" for n, c in sorted(sem_par.items(), key=lambda x: -x[1])]
    (SAIDA / "grupos-sem-par.md").write_text("".join(linhas), encoding="utf-8")
    print(f"reações de pressão novas: {n_reage}; consequências em segmentos: {n_cons}; nomes sem par: {len(sem_par)}")


if __name__ == "__main__":
    main()
