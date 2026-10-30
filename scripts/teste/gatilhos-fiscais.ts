/** Joga turnos e mostra o resultado fiscal guardado e os gatilhos que ligam (M7.2). */
import { criarPartida, encerrarTurno, verBussola } from "../../src/app/partida";

const r = criarPartida({ ocorrencias: false });
if (!r.ok) throw new Error(r.erros.join("\n"));
let p = r.value;
for (let i = 0; i < 5; i++) {
  const e = encerrarTurno(p);
  if (!e.ok) throw new Error(JSON.stringify(e));
  p = e.value.partida ?? e.value;
  const c = p.game.compass!.caminho.at(-1)!;
  console.log(
    "turno",
    c.turno,
    "resultado",
    c.resultado?.toFixed(2),
    "gatilhos:",
    verBussola(p)!
      .gatilhos.map((g) => g.nome)
      .join(", ") || "-",
  );
}
