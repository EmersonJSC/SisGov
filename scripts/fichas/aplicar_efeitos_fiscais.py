"""Aplica relações fiscais aprovadas em lote, sem inferir números de textos.

Uso: python3 scripts/fichas/aplicar_efeitos_fiscais.py [--write]
Sem --write, apenas confere a especificação e mostra as leis pendentes.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
WORLD = ROOT / "src/conteudo/mundo"
SPECS = ROOT / "docs/v1/desenho/efeitos-fiscais-aplicados.json"


def read(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def save(path: Path, value: dict) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main(write: bool) -> None:
    specifications = read(SPECS)["leis"]
    manifest_path = WORLD / "mundo.json"
    manifest = read(manifest_path)
    paths = manifest["consequencias"]
    pending = []
    for spec in specifications:
        law_id = spec["id"]
        law_path = WORLD / "leis" / f"{law_id}.json"
        law = read(law_path)
        options = law["controle"]["opcoes"]
        observed = [[option["id"], option["valor"]] for option in options]
        expected = [[point["opcao"], point["nivel"]] for point in spec["pontos"]]
        if observed != expected:
            raise ValueError(f"Opções mudaram em {law_id}: {observed}")
        effect_id = f"{law_id}--gasto-publico"
        effect_path = WORLD / "consequencias" / f"{effect_id}.json"
        effect = {
            "id": effect_id,
            "tipo": "consequencia",
            "versaoEsquema": 1,
            "origem": law["controle"]["variavel"],
            "alvo": "gasto_publico",
            "mecanismo": "pontos",
            "parametros": {"pontos": [[p["nivel"], p["custoPib"]] for p in spec["pontos"]]},
            "leitura": "nivel",
            "unidade": "percentual_pib",
            "atrasoPassos": 0,
            "duracao": {"modo": "continuo"},
        }
        reference = f"mundo/consequencias/{effect_id}.json"
        present = effect_id in law.get("consequencias", [])
        if present != (reference in paths) or present != effect_path.exists():
            raise ValueError(f"Registro incompleto em {law_id}")
        if present:
            if read(effect_path) != effect:
                raise ValueError(f"Efeito existente difere da especificação: {law_id}")
            continue
        pending.append(law_id)
        if write:
            law.setdefault("consequencias", []).append(effect_id)
            paths.append(reference)
            save(effect_path, effect)
            save(law_path, law)
    if write and pending:
        save(manifest_path, manifest)
    print(f"{len(specifications)} leis conferidas; {len(pending)} pendentes: {', '.join(pending)}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--write", action="store_true")
    main(parser.parse_args().write)
