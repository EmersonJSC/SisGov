// Foto 3x4 presa por um clipe de latão, ligeiramente torta, como na mesa.
import type { PessoaDaLista } from "../../partida";
import { retratoDaPessoa } from "./aparencia";

export function Foto({
  pessoa,
  inclinacao = 0,
}: {
  pessoa: PessoaDaLista | null;
  inclinacao?: number;
}) {
  return (
    <span
      className={`ini-foto ${pessoa ? "" : "ini-foto-vazia"}`}
      style={{ transform: `rotate(${inclinacao}deg)` }}
    >
      <span className="ini-clipe" />
      {pessoa ? (
        <img src={retratoDaPessoa(pessoa)} alt="" />
      ) : (
        <span className="ini-foto-interrogacao">?</span>
      )}
    </span>
  );
}
