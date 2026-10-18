"""Converte a revisão financeira da planilha em um catálogo JSON do mundo.

Uso: python3 scripts/fichas/converter_financeiro.py [--write | --check]
Não cria efeitos numéricos nem altera os JSONs de leis existentes.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
WORKBOOK = ROOT / "tabela-leis-revisada.xlsx"
MAP = ROOT / "docs/v1/desenho/conciliacao-financeira-json.json"
LAWS = ROOT / "src/conteudo/mundo/leis"
OUTPUT = ROOT / "src/conteudo/mundo/financas-leis.json"
EFFECTS = ROOT / "src/conteudo/mundo/consequencias"
MAIN = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
PKG_REL = "http://schemas.openxmlformats.org/package/2006/relationships"


def column_number(address: str) -> int:
    letters = re.match(r"[A-Z]+", address)
    if not letters:
        raise ValueError(f"Endereço inválido na planilha: {address}")
    result = 0
    for letter in letters.group():
        result = result * 26 + ord(letter) - ord("A") + 1
    return result - 1


def read_sheets(names: tuple[str, ...]) -> dict[str, list[list[str]]]:
    """Lê apenas valores da planilha com a biblioteca padrão do Python."""
    with zipfile.ZipFile(WORKBOOK) as archive:
        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        relationships = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        paths = {
            relation.attrib["Id"]: relation.attrib["Target"]
            for relation in relationships.findall(f"{{{PKG_REL}}}Relationship")
        }
        sheets = {
            sheet.attrib["name"]: paths[sheet.attrib[f"{{{REL}}}id"]]
            for sheet in workbook.findall(f"{{{MAIN}}}sheets/{{{MAIN}}}sheet")
        }
        strings: list[str] = []
        if "xl/sharedStrings.xml" in archive.namelist():
            shared = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            for item in shared.findall(f"{{{MAIN}}}si"):
                strings.append("".join(text.text or "" for text in item.iter(f"{{{MAIN}}}t")))
        output = {}
        for name in names:
            target = sheets.get(name)
            if not target:
                raise ValueError(f"Aba ausente: {name}")
            path = target.lstrip("/") if target.startswith("/") else f"xl/{target}"
            document = ET.fromstring(archive.read(path))
            rows = []
            for row in document.findall(f".//{{{MAIN}}}sheetData/{{{MAIN}}}row"):
                values: list[str] = []
                for cell in row.findall(f"{{{MAIN}}}c"):
                    index = column_number(cell.attrib["r"])
                    while len(values) <= index:
                        values.append("")
                    value = cell.find(f"{{{MAIN}}}v")
                    kind = cell.attrib.get("t")
                    if kind == "s" and value is not None:
                        values[index] = strings[int(value.text or "0")]
                    elif kind == "inlineStr":
                        values[index] = "".join(
                            part.text or "" for part in cell.iter(f"{{{MAIN}}}t")
                        )
                    elif value is not None:
                        values[index] = value.text or ""
                rows.append(values)
            output[name] = rows
        return output


def cell(row: list[str], index: int) -> str:
    return row[index].strip() if index < len(row) else ""


def table(rows: list[list[str]], expected: str) -> list[list[str]]:
    header = next(
        (index for index, row in enumerate(rows) if cell(row, 0) == expected), None
    )
    if header is None:
        raise ValueError(f"Cabeçalho ausente: {expected}")
    return [row for row in rows[header + 1 :] if cell(row, 0)]


def build() -> dict:
    sheets = read_sheets(("Índices monetários", "Finanças por lei"))
    account_rows = table(sheets["Índices monetários"], "ID")
    law_rows = table(sheets["Finanças por lei"], "ID da lei")
    accounts = [
        {
            "id": cell(row, 0),
            "nome": cell(row, 1),
            "natureza": cell(row, 2),
            "periodicidade": cell(row, 3),
            "pagador": cell(row, 4),
            "recebedor": cell(row, 5),
            "regraConceitual": cell(row, 6),
            "indiceRelacionado": cell(row, 7),
        }
        for row in account_rows
    ]
    account_ids = {account["id"] for account in accounts}
    if len(accounts) != len(account_ids) or not accounts:
        raise ValueError("IDs de contas vazios ou duplicados")
    by_law = {cell(row, 0): row for row in law_rows}
    if len(by_law) != len(law_rows) or not by_law:
        raise ValueError("IDs de leis vazios ou duplicados na planilha")
    audit = json.loads(MAP.read_text(encoding="utf-8"))
    mapped = audit["leis"]
    audit_ids = {entry["id_revisado"] for entry in mapped}
    if len(audit_ids) != len(mapped) or audit_ids != set(by_law):
        raise ValueError("Mapa de conciliação e planilha têm leis diferentes")
    audit_by_json = {
        entry["id_json"]: entry for entry in mapped if entry.get("id_json")
    }
    canonical_to_json: dict[str, list[tuple[str, str]]] = {
        law_id: [] for law_id in by_law
    }
    for entry in mapped:
        active_id = entry.get("id_json")
        if active_id:
            canonical_to_json[entry["id_revisado"]].append((active_id, "direto"))
    for legacy in audit["ativas_legadas"]:
        canonical_to_json[legacy["destino_revisado"]].append(
            (legacy["id_json"], legacy["estado"])
        )
    active_files = {path.stem: path for path in LAWS.glob("*.json")}
    linked = [law_id for links in canonical_to_json.values() for law_id, _ in links]
    if len(linked) != len(set(linked)) or set(linked) != set(active_files):
        raise ValueError("O mapa não cobre exatamente os JSONs de leis ativos")

    result_laws = []
    fiscal_targets = {
        "arrecadacao", "gasto_publico", "cofre", "divida_publica", "juros_da_divida"
    }
    effects = {
        path.stem: json.loads(path.read_text(encoding="utf-8"))
        for path in EFFECTS.glob("*.json")
    }
    for law_id, links in canonical_to_json.items():
        row = by_law[law_id]
        account = cell(row, 4)
        if account not in account_ids:
            raise ValueError(f"Conta inexistente em {law_id}: {account}")
        for active_id, relation in links:
            actual = json.loads(active_files[active_id].read_text(encoding="utf-8"))
            if actual.get("id") != active_id or actual.get("tipo") != "lei":
                raise ValueError(f"JSON de lei inválido: {active_id}")
            options = actual.get("controle", {}).get("opcoes", [])
            audit_entry = audit_by_json.get(active_id)
            if audit_entry and len(options) != audit_entry["opcoes_json"]:
                raise ValueError(f"As opções de {active_id} mudaram após a conciliação")
            fiscal_effects = []
            for effect_id in actual.get("consequencias", []):
                effect = effects.get(effect_id)
                if effect is None:
                    raise ValueError(f"Consequência ausente em {active_id}: {effect_id}")
                if effect.get("alvo") in fiscal_targets:
                    fiscal_effects.append({"id": effect_id, "alvo": effect["alvo"]})
            for index, effect in enumerate(actual.get("efeitos", [])):
                if effect.get("alvo") in fiscal_targets:
                    fiscal_effects.append(
                        {"id": f"{active_id}#efeitos[{index}]", "alvo": effect["alvo"]}
                    )
            expected_target = (
                "arrecadacao" if account.startswith("receita_") or account == "renuncia_tributaria"
                else "gasto_publico" if account.startswith("despesa_") and account not in {
                    "despesa_amortizacao_divida", "despesa_aporte_patrimonial"
                }
                else None
            )
            has_expected_effect = any(
                effect["alvo"] == expected_target for effect in fiscal_effects
            )
            result_laws.append(
                {
                    "lei": active_id,
                    "leiRevisada": law_id,
                    "relacao": relation,
                    "contaPrincipal": account,
                    "natureza": cell(row, 5),
                    "mecanismoProposto": cell(row, 6),
                    "base": cell(row, 7),
                    "pagador": cell(row, 8),
                    "recebedor": cell(row, 9),
                    "canalPibProposto": cell(row, 10),
                    "atrasoProposto": cell(row, 11),
                    "opcoes": {
                        "noJson": len(options),
                        "noEstudo": audit_entry["opcoes_revisadas"] if audit_entry else None,
                        "estado": "pendente de conferência por opção",
                    },
                    "efeitosFiscaisAtivos": fiscal_effects,
                    "alvoFiscalEsperado": expected_target,
                    "lacunaFiscal": expected_target is not None and not has_expected_effect,
                    "estado": "classificação proposta; efeitos ativos listados sem nova calibração",
                }
            )
    covered_topics = {
        entry["leiRevisada"]
        for entry in result_laws
        if entry["alvoFiscalEsperado"] is not None and not entry["lacunaFiscal"]
    }
    for entry in result_laws:
        entry["coberturaFiscalDoTema"] = entry["leiRevisada"] in covered_topics
    missing = sorted(set(by_law) - {entry["leiRevisada"] for entry in result_laws})
    if missing != sorted(entry["id_revisado"] for entry in mapped if not entry["id_json"]):
        raise ValueError("Leis sem JSON não batem com a conciliação")
    return {
        "id": "financas-leis",
        "tipo": "catalogo-financeiro",
        "versaoEsquema": 1,
        "estado": "proposta; não alimenta o motor",
        "origem": ["tabela-leis-revisada.xlsx", "docs/v1/desenho/conciliacao-financeira-json.json"],
        "contas": accounts,
        "leis": sorted(result_laws, key=lambda entry: entry["lei"]),
        "leisAindaSemJson": missing,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--write", action="store_true", help="grava o catálogo JSON")
    group.add_argument("--check", action="store_true", help="confere o catálogo gravado")
    arguments = parser.parse_args()
    try:
        result = build()
        compact = lambda value: json.dumps(value, ensure_ascii=False, separators=(",", ":"))
        lines = [
            "{",
            f'  "id":{compact(result["id"])},',
            f'  "tipo":{compact(result["tipo"])},',
            f'  "versaoEsquema":{result["versaoEsquema"]},',
            f'  "estado":{compact(result["estado"])},',
            f'  "origem":{compact(result["origem"])},',
            '  "contas":[',
        ]
        lines.extend(
            "    " + compact(account) + ("," if index < len(result["contas"]) - 1 else "")
            for index, account in enumerate(result["contas"])
        )
        lines.extend(['  ],', '  "leis":['])
        lines.extend(
            "    " + compact(law) + ("," if index < len(result["leis"]) - 1 else "")
            for index, law in enumerate(result["leis"])
        )
        lines.extend(
            ['  ],', f'  "leisAindaSemJson":{compact(result["leisAindaSemJson"])}', '}']
        )
        text = "\n".join(lines) + "\n"
        if arguments.write:
            temporary = OUTPUT.with_suffix(".json.tmp")
            temporary.write_text(text, encoding="utf-8")
            temporary.replace(OUTPUT)
        elif arguments.check and (not OUTPUT.exists() or OUTPUT.read_text(encoding="utf-8") != text):
            raise ValueError("Catálogo financeiro ausente ou desatualizado; rode --write")
        verb = "gravado" if arguments.write else "conferido"
        print(
            f"Catálogo {verb}: {len(result['leis'])} JSONs ativos, "
            f"{len(result['contas'])} contas, {len(result['leisAindaSemJson'])} leis futuras."
        )
        return 0
    except (ValueError, KeyError, OSError, zipfile.BadZipFile, ET.ParseError) as error:
        print(f"Erro: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
