"""Corta o gdd.md por seção (### e ####), tira o bloco "No motor hoje"
e agrupa as seções em lotes de ~200 linhas por Parte. Rodar da raiz:
python3 docs/jogo/requisitos-rascunho/cortar.py"""
import json, re, pathlib, unicodedata

GDD = pathlib.Path('docs/jogo/gdd.md')
DEST = pathlib.Path('docs/jogo/requisitos-rascunho')
SEC = DEST / 'secoes'
LIMITE = 200

linhas = GDD.read_text().split('\n')
secoes, parte, atual = [], None, None

def fechar(fim):
    if atual:
        atual['fim'] = fim
        secoes.append(atual)

for i, l in enumerate(linhas, 1):
    m = re.match(r'## Parte (\d)\.', l)
    if m or l.startswith('## '):
        fechar(i - 1)
        parte = int(m.group(1)) if m else None
        atual = {'parte': parte, 'titulo': l[3:], 'inicio': i, 'nivel': 2} if parte else None
    elif parte and (l.startswith('### ') or l.startswith('#### ')):
        fechar(i - 1)
        nivel = 3 if l.startswith('### ') else 4
        atual = {'parte': parte, 'titulo': l.lstrip('# '), 'inicio': i, 'nivel': nivel}
fechar(len(linhas))

def sem_motor(ini, fim):
    """Linhas (nº, texto) da seção, sem o bloco "No motor hoje"."""
    out, cortando = [], False
    for n in range(ini, fim + 1):
        t = linhas[n - 1]
        if t.strip().startswith('**No motor hoje') or t.startswith('Legenda do motor'):
            cortando = True
            continue
        if cortando and (t.startswith('**') or t.startswith('#') or t.strip() == '---'):
            cortando = False
        if not cortando:
            out.append((n, re.sub(r' ?[✅◐☐]', '', t)))
    return out

# só apaga os recortes (começam com número); as saídas dos agentes ficam em saidas/
for f in SEC.glob('[0-9]*.md'):
    f.unlink()

nomes, ignoradas, mae, sub = [], 0, '0', 0
for s in secoes:
    corpo = sem_motor(s['inicio'], s['fim'])
    if s['nivel'] == 2 and not any(t.strip() and t.strip() != '---' for _, t in corpo[1:]):
        ignoradas += 1
        s['arquivo'] = None
        continue
    num = re.match(r'(\d+(?:\.\d+)*)', s['titulo'])
    if num:
        chave = num.group(1)
        mae, sub = chave, 0
    elif s['nivel'] == 4:
        sub += 1
        chave = f"{mae}{'abcdefghij'[sub - 1]}"
    else:
        chave = f"{s['parte']}.0"
    resto = s['titulo'][len(num.group(1)):] if num else s['titulo']
    ascii_ = unicodedata.normalize('NFKD', resto).encode('ascii', 'ignore').decode().lower()
    slug = re.sub(r'[^a-z0-9]+', '-', ascii_).strip('-')[:40].strip('-')
    nome = f"{chave}-{slug}.md"
    s['arquivo'] = nome
    s['linhas'] = len(corpo)
    cab = f"<!-- GDD L{s['inicio']}–L{s['fim']} · cada linha traz o número dela no gdd.md · sem o bloco do motor -->\n"
    (SEC / nome).write_text(cab + '\n'.join(f'L{n}: {t}' for n, t in corpo) + '\n')
    nomes.append(nome)

# lotes: #### sem número fica com a seção de cima; somar até ~LIMITE
blocos = []
for s in secoes:
    if not s.get('arquivo'):
        continue
    if s['nivel'] == 4 and not re.match(r'\d', s['titulo']) and blocos and blocos[-1]['parte'] == s['parte']:
        blocos[-1]['arquivos'].append(s['arquivo']); blocos[-1]['linhas'] += s['linhas']
    else:
        blocos.append({'parte': s['parte'], 'arquivos': [s['arquivo']], 'linhas': s['linhas']})
lotes = []
for b in blocos:
    u = lotes[-1] if lotes else None
    if u and u['parte'] == b['parte'] and u['linhas'] + b['linhas'] <= LIMITE:
        u['arquivos'] += b['arquivos']; u['linhas'] += b['linhas']
    else:
        lotes.append(dict(b))
for k, l in enumerate(lotes, 1):
    l['id'] = f"P{l['parte']}-L{k:02d}"
(DEST / 'lotes.json').write_text(json.dumps(lotes, ensure_ascii=False, indent=1))

n3 = sum(1 for s in secoes if s['nivel'] in (3, 4))
print(f"seções ###/####: {n3} · arquivos: {len(nomes)} · intros vazias: {ignoradas} · lotes: {len(lotes)}")
for p in range(1, 10):
    ls = [l for l in lotes if l['parte'] == p]
    print(p, len(ls), [l['linhas'] for l in ls])
