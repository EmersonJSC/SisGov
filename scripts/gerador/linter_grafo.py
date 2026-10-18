"""Linter estático para um pacote de leis v3 e índices.

Uso:
    python scripts/gerador/linter_grafo.py --leis caminho/leis.json \
        --indices caminho/variaveis.json

Aceita arquivo JSON individual ou diretório recursivo de arquivos JSON. O linter
valida a estrutura mínima tipada e verifica arestas para IDs de índices e leis.
Campos desconhecidos são rejeitados. Referências opcionais são reconhecidas
somente nos campos listados abaixo; ajuste os modelos se a ficha canônica local
usar outros nomes.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, ValidationError


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)


class Requisitos(StrictModel):
    exige: list[str] = Field(default_factory=list)
    proibe: list[str] = Field(default_factory=list)


class Efeito(StrictModel):
    indice_destino: str
    mecanismo: str
    atraso: int = Field(ge=0)
    duracao: int | None = Field(default=None, ge=0)


class LeiV3(StrictModel):
    id: str = Field(min_length=1)
    nome: str = Field(min_length=1)
    descricao: str = Field(min_length=1)
    area: str = Field(min_length=1)
    ministerio: str | None = None
    nivel: Literal["constituicao", "lei", "decreto", "orcamento", "alavanca"]
    controle: dict[str, Any]
    dinheiro: dict[str, Any]
    implantacao: dict[str, Any]
    dependeDe: list[str] = Field(default_factory=list)
    excludentes: list[str] = Field(default_factory=list)
    requer: Requisitos = Field(default_factory=Requisitos)
    efeitos: list[Efeito] = Field(min_length=1)
    populacao: dict[str, Any] = Field(default_factory=dict)
    historia: dict[str, Any] = Field(default_factory=dict)
    fontes: list[Any] = Field(min_length=1)


class Indice(StrictModel):
    id: str = Field(min_length=1)
    tipo: Literal["estoque", "fluxo", "taxa", "proporcao", "contador"]
    nome: str = Field(min_length=1)
    unidade: str = Field(min_length=1)
    dominio: dict[str, Any] | None = None
    medida: dict[str, Any]
    area: str | None = None
    avaliacao: str | None = None


class ArquivoVariaveis(StrictModel):
    id: str = Field(min_length=1)
    tipo: Literal["variaveis"]
    versaoEsquema: int = Field(ge=1)
    variaveis: list[Indice] = Field(min_length=1)


def _json_files(path: Path) -> list[Path]:
    if path.is_file():
        return [path]
    if path.is_dir():
        return sorted(path.rglob("*.json"))
    raise FileNotFoundError(f"caminho inexistente: {path}")


def _read_json(path: Path) -> tuple[Any | None, str | None]:
    try:
        with path.open("r", encoding="utf-8") as stream:
            return json.load(stream), None
    except (OSError, json.JSONDecodeError) as exc:
        return None, f"JSON inválido: {exc}"


def _objects(value: Any) -> list[dict[str, Any]]:
    if isinstance(value, list):
        return [item for item in value if isinstance(item, dict)]
    if isinstance(value, dict):
        # Formato agregado comum: {"leis": [...]} ou uma ficha única.
        for key in ("leis", "politicas", "policies"):
            if key in value:
                return _objects(value[key])
        return [value]
    return []


def _collect_models(
    paths: list[Path], model: type[BaseModel], label: str, errors: list[str]
) -> list[dict[str, Any]]:
    result: list[dict[str, Any]] = []
    for path in paths:
        raw, error = _read_json(path)
        if error:
            errors.append(f"{path}: {error}")
            continue
        candidates = _objects(raw)
        if not candidates:
            errors.append(f"{path}: esperado objeto ou lista de {label}")
            continue
        for i, candidate in enumerate(candidates):
            try:
                model.model_validate(candidate)
                result.append(candidate)
            except ValidationError as exc:
                loc = f"[{i}]" if len(candidates) > 1 else ""
                for item in exc.errors(include_url=False):
                    field = ".".join(str(part) for part in item["loc"])
                    errors.append(
                        f"{path}{loc}{'.' + field if field else ''}: {item['msg']}"
                    )
    return result


def lint(leis_path: Path, indices_path: Path) -> dict[str, Any]:
    errors: list[str] = []
    loi_files = _json_files(leis_path)
    index_files = _json_files(indices_path)
    laws = _collect_models(loi_files, LeiV3, "ficha de lei v3", errors)

    indices: list[dict[str, Any]] = []
    for path in index_files:
        raw, error = _read_json(path)
        if error:
            errors.append(f"{path}: {error}")
            continue
        if isinstance(raw, dict) and raw.get("tipo") == "variaveis":
            try:
                parsed = ArquivoVariaveis.model_validate(raw)
                indices.extend(item.model_dump() for item in parsed.variaveis)
            except ValidationError as exc:
                for item in exc.errors(include_url=False):
                    field = ".".join(str(part) for part in item["loc"])
                    errors.append(f"{path}{'.' + field if field else ''}: {item['msg']}")
        else:
            indices.extend(_collect_models([path], Indice, "índice", errors))

    index_ids: set[str] = set()
    for item in indices:
        index_id = item.get("id")
        if index_id in index_ids:
            errors.append(f"índice {index_id!r}: ID duplicado")
        index_ids.add(index_id)

    law_ids: set[str] = set()
    for law in laws:
        law_id = law.get("id")
        if law_id in law_ids:
            errors.append(f"lei {law_id!r}: ID duplicado")
        law_ids.add(law_id)

    for law in laws:
        law_id = law.get("id", "<sem id>")
        for i, effect in enumerate(law.get("efeitos", [])):
            if isinstance(effect, dict):
                target = effect.get("indice_destino")
                if target is not None and target not in index_ids:
                    errors.append(
                        f"lei {law_id}.efeitos[{i}].indice_destino: índice inexistente {target!r}"
                    )
        for field in ("dependeDe", "excludentes"):
            refs = law.get(field, [])
            if isinstance(refs, list):
                for i, target in enumerate(refs):
                    if target not in law_ids:
                        errors.append(
                            f"lei {law_id}.{field}[{i}]: lei inexistente {target!r}"
                        )

    return {
        "ok": not errors,
        "contagens": {"leis": len(laws), "indices": len(indices)},
        "erros": errors,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Validador estático de grafo SisGov")
    parser.add_argument("--leis", required=True, type=Path, help="arquivo ou diretório JSON de leis")
    parser.add_argument("--indices", required=True, type=Path, help="arquivo ou diretório JSON de índices")
    args = parser.parse_args()
    try:
        report = lint(args.leis, args.indices)
    except (OSError, FileNotFoundError) as exc:
        report = {"ok": False, "contagens": {"leis": 0, "indices": 0}, "erros": [str(exc)]}
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
