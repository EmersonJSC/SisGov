"""Gera src/ui/mapa/icones.ts a partir de scripts/icones/mapa.json.

Os desenhos vêm do Material Design Icons (Pictogrammers Free License, em
public/licenses/material-design-icons.txt). Uso:

    python3 scripts/icones/gerar.py <pasta com os .svg do MDI>

A pasta pode ser a do pacote @mdi/svg (svg/) ou a do mkdocs-material
(material/templates/.icons/material). Só os ícones citados no mapa entram.
"""
import json
import re
import sys
from pathlib import Path

raiz = Path(__file__).resolve().parents[2]
pasta = Path(sys.argv[1])
mapa = json.loads((raiz / "scripts/icones/mapa.json").read_text())
nomes = sorted({n for grupo in mapa.values() for n in grupo.values()})
caminhos = {}
for nome in nomes:
    svg = (pasta / f"{nome}.svg").read_text()
    caminhos[nome] = " ".join(re.findall(r'<path[^>]*\sd="([^"]+)"', svg))

def obj(d):
    linhas = [f"  {json.dumps(k, ensure_ascii=False)}: {json.dumps(v)}," for k, v in d.items()]
    return "{\n" + "\n".join(linhas) + "\n}"

saida = f"""// Gerado por scripts/icones/gerar.py a partir de scripts/icones/mapa.json.
// Desenhos: Material Design Icons (Pictogrammers Free License).
// Não edite à mão: mude o mapa e rode o gerador.

/** Caminho SVG (viewBox 0 0 24 24) de cada desenho usado. */
export const DESENHOS: Readonly<Record<string, string>> = {obj(caminhos)};

/** Desenho de cada lei, pelo id da lei. */
export const ICONE_LEI: Readonly<Record<string, string>> = {obj(mapa["leis"])};

/** Desenho de cada bolha (indicador, situação), pelo id da bolha. */
export const ICONE_BOLHA: Readonly<Record<string, string>> = {obj(mapa["bolhas"])};

/** Desenhos da interface e dos ministérios. */
export const ICONE_INTERFACE: Readonly<Record<string, string>> = {obj(mapa["interface"])};
"""
destino = raiz / "src/ui/mapa/icones.ts"
destino.parent.mkdir(parents=True, exist_ok=True)
destino.write_text(saida)
print(f"{len(caminhos)} desenhos -> {destino.relative_to(raiz)}")
