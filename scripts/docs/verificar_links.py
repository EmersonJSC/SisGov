"""Confere os links dos documentos vigentes (V1-01).

Um documento é vigente quando uma das primeiras linhas diz "Status: VIGENTE".
Todo link relativo de um documento vigente precisa apontar para um arquivo que
existe. Uso: python3 scripts/docs/verificar_links.py
"""

import re
import sys
from pathlib import Path

LINK = re.compile(r"\]\(([^)\s#]+)(?:#[^)]*)?\)")
IGNORAR = {"node_modules", ".git", "dist", "Exemplos"}


def vigente(caminho: Path) -> bool:
    cabeca = caminho.read_text(encoding="utf-8").splitlines()[:8]
    return any("Status: VIGENTE" in linha for linha in cabeca)


def main() -> int:
    raiz = Path(__file__).resolve().parents[2]
    erros = []
    total = 0
    for doc in sorted(raiz.rglob("*.md")):
        if IGNORAR & set(doc.relative_to(raiz).parts) or not vigente(doc):
            continue
        total += 1
        for alvo in LINK.findall(doc.read_text(encoding="utf-8")):
            if "://" in alvo or alvo.startswith("mailto:"):
                continue
            if not (doc.parent / alvo).exists():
                erros.append(f"{doc.relative_to(raiz)}: {alvo}")
    for erro in erros:
        print("link quebrado:", erro)
    print(f"{total} documentos vigentes, {len(erros)} links quebrados")
    return 1 if erros else 0


if __name__ == "__main__":
    sys.exit(main())
