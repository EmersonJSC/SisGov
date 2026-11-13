// Ícones das 30 esferas. Cada um aparece sozinho na área do mapa e, bem pequeno,
// na bolinha do pé de cada lei: silhueta forte, poucas peças, uma mancha.
import { CHEIO, MANCHA, TINTA } from "./estilo";

export interface Esfera {
  nome: string;
  desenho: string;
}

const grao = (y: number) =>
  `<path ${CHEIO} d="M12 ${y}c-2.6-.3-4.2-2-4.2-4.4 2.6.3 4.2 2 4.2 4.4z"/>` +
  `<path ${CHEIO} d="M12 ${y}c2.6-.3 4.2-2 4.2-4.4-2.6.3-4.2 2-4.2 4.4z"/>`;

/** Altura de cada par de grãos na espiga. */
const GRAOS = [11, 15.5, 20];

export const ESFERAS: Record<string, Esfera> = {
  "agricultura-e-pesca": {
    nome: "Agricultura e pesca",
    desenho: `<path d="M12 7.5V22"/><path ${CHEIO} d="M12 7.5c-1.4-1.2-1.4-3.8 0-5.2 1.4 1.4 1.4 4 0 5.2z"/>${GRAOS.map(grao).join("")}`,
  },
  "assistencia-social": {
    nome: "Assistência social",
    desenho: `<path ${CHEIO} d="M12 12.5S7 9.6 7 6.3a2.6 2.6 0 0 1 5-1 2.6 2.6 0 0 1 5 1c0 3.3-5 6.2-5 6.2z"/><path d="M2.5 15.5h3.2l3.8 1.8h4a1.6 1.6 0 0 1 0 3.2H9.8"/><path d="M5.7 21.5h9l6-4.4a1.6 1.6 0 0 0-1.9-2.6l-3.4 2.3"/>`,
  },
  "ciencia-e-pesquisa": {
    nome: "Ciência e pesquisa",
    desenho: `<path ${MANCHA} d="M7.3 15h9.4l2.4 4.3a1.2 1.2 0 0 1-1 1.7H5.9a1.2 1.2 0 0 1-1-1.7z"/><path d="M9 2.5h6M10.2 2.5v6.8L4.9 19.3a1.2 1.2 0 0 0 1 1.7h12.2a1.2 1.2 0 0 0 1-1.7L13.8 9.3V2.5M7.3 15h9.4"/><circle ${TINTA} cx="11" cy="18" r=".9"/><circle ${TINTA} cx="14" cy="17.2" r=".7"/>`,
  },
  "comercio-exterior-e-capital": {
    nome: "Comércio exterior e capital",
    desenho: `<path ${CHEIO} d="M2 14h20l-2.6 5.5H4.6z"/><path d="M5 14V9.5h5V14M10 14V7h5v7M15 14v-3.5h4V14"/><path d="M2 22c1.7 0 1.7-1 3.3-1s1.7 1 3.4 1 1.7-1 3.3-1 1.7 1 3.4 1 1.6-1 3.3-1 1.7 1 3.3 1"/>`,
  },
  "comunicacao-e-tecnologia": {
    nome: "Comunicação e tecnologia",
    desenho: `<circle ${CHEIO} cx="12" cy="8.5" r="2.2"/><path d="M12 10.7L8 21.5M12 10.7l4 10.8M9.2 18h5.6"/><path d="M7.6 4.3a6 6 0 0 0 0 8.4M16.4 4.3a6 6 0 0 1 0 8.4M4.6 1.8a9.5 9.5 0 0 0 0 13.4M19.4 1.8a9.5 9.5 0 0 1 0 13.4"/>`,
  },
  "cultura-e-esporte": {
    nome: "Cultura e esporte",
    desenho: `<path ${CHEIO} d="M7 3h10v6a5 5 0 0 1-10 0z"/><path d="M7 5H3.8v1.8A3.3 3.3 0 0 0 7.3 10M17 5h3.2v1.8a3.3 3.3 0 0 1-3.5 3.2M12 14v3.5M8 21.5h8M9.5 17.5h5v4h-5z"/>`,
  },
  defesa: {
    nome: "Defesa",
    desenho: `<path ${CHEIO} d="M12 2l1.5 4.5.5 4 7.5 4.3v2.4L14 15l-.5 3.5 2.5 2v1.5L12 21l-4 1v-1.5l2.5-2L10 15l-7.5 2.2v-2.4L10 10.5l.5-4z"/>`,
  },
  "defesa-civil": {
    nome: "Defesa civil",
    desenho: `<path ${CHEIO} fill-rule="evenodd" d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19zm0 5.3a4.2 4.2 0 1 1 0 8.4 4.2 4.2 0 0 1 0-8.4z"/><path d="M6.6 3.9l2 3.4M17.4 3.9l-2 3.4M6.6 20.1l2-3.4M17.4 20.1l-2-3.4" stroke-width="2.6"/>`,
  },
  "direitos-e-liberdades": {
    nome: "Direitos e liberdades",
    desenho: `<rect ${CHEIO} x="4.5" y="11" width="15" height="10.5" rx="1.6"/><path d="M8 11V7.2a4 4 0 0 1 7.7-1.6"/><path d="M12 14.8v3.2"/><circle ${TINTA} cx="12" cy="14.8" r="1.3"/>`,
  },
  educacao: {
    nome: "Educação",
    desenho: `<path ${CHEIO} d="M1.5 9.5L12 4.5l10.5 5L12 14.5z"/><path d="M6 12v4.8c3.3 2.6 8.7 2.6 12 0V12M21 10.2v5.6"/><circle ${TINTA} cx="21" cy="17" r="1.2"/>`,
  },
  "empresas-e-estatais": {
    nome: "Empresas e estatais",
    desenho: `<path ${CHEIO} d="M2.5 21.5V11.5l5 3.3v-3.3l5 3.3V4.5h4v-2h3v19z"/><path d="M1.5 21.5h21M15 18h1.5M5.5 18H7M10 18h1.5"/>`,
  },
  energia: {
    nome: "Energia",
    desenho: `<path ${CHEIO} d="M13.5 2L4.5 13.5h6.5L9.5 22l10-12.5H13z"/>`,
  },
  "estado-e-eleicoes": {
    nome: "Estado e eleições",
    desenho: `<path d="M8.5 11.5V3h7v8.5M10.5 6h3M10.5 8.5h2"/><path ${CHEIO} d="M3.5 11.5h17v10h-17z"/><path d="M7.5 11.5h9M9 16.5h6" stroke-width="2.4"/>`,
  },
  imigracao: {
    nome: "Imigração",
    desenho: `<rect ${CHEIO} x="4.5" y="2" width="15" height="20" rx="1.6"/><circle cx="12" cy="10" r="3.6"/><path d="M8.4 10h7.2M12 6.4c1.6 1.8 1.6 5.4 0 7.2M12 6.4c-1.6 1.8-1.6 5.4 0 7.2M8.5 17.5h7"/>`,
  },
  impostos: {
    nome: "Impostos",
    desenho: `<circle ${CHEIO} cx="7" cy="7" r="3.3"/><circle ${CHEIO} cx="17" cy="17" r="3.3"/><path d="M19.5 4.5l-15 15" stroke-width="2.4"/>`,
  },
  "infraestrutura-e-transporte": {
    nome: "Infraestrutura e transporte",
    desenho: `<path ${CHEIO} d="M9 2.5h6l5.5 19h-17z"/><path d="M12 5v2.2M12 10v2.8M12 15.8v3.7" stroke-width="2.2"/>`,
  },
  "justica-e-prisoes": {
    nome: "Justiça e prisões",
    desenho: `<path d="M12 3v17.5M7.5 21h9M4 6.5h16M12 3a1.2 1.2 0 1 0 0 .1"/><path d="M4 6.5L1.5 13M4 6.5L6.5 13M20 6.5L17.5 13M20 6.5l2.5 6.5"/><path ${CHEIO} d="M1 13h6a3 3 0 0 1-6 0zM17 13h6a3 3 0 0 1-6 0z"/>`,
  },
  "meio-ambiente": {
    nome: "Meio ambiente",
    desenho: `<path ${CHEIO} d="M4.5 19.5C4.5 10.5 10 4.5 20.5 3.5c0 10.5-5.5 16-15 16z"/><path d="M3 21l11-11M9.5 14.5h4.2M9.5 14.5V10.3"/>`,
  },
  "mineracao-e-petroleo": {
    nome: "Mineração e petróleo",
    desenho: `<path ${CHEIO} d="M10.5 21.5l3-5 4.5-1.5 3.5 2.5 1 4z"/><path d="M3 19L15.5 6.5" stroke-width="2.2"/><path d="M8.5 3Q17.5 5 19.5 14" stroke-width="2.2"/><path ${CHEIO} d="M5 2.5c1.4 1.9 2.2 3.1 2.2 4.3a2.2 2.2 0 0 1-4.4 0c0-1.2.8-2.4 2.2-4.3z"/>`,
  },
  "moeda-e-bancos": {
    nome: "Moeda e bancos",
    desenho: `<path ${CHEIO} d="M2.5 9L12 3.5 21.5 9z"/><path d="M5 11.5v6.5M9.7 11.5v6.5M14.3 11.5v6.5M19 11.5v6.5M2.5 21h19M3.5 18.5h17"/>`,
  },
  moradia: {
    nome: "Moradia",
    desenho: `<path ${CHEIO} d="M5 10.3V21h14V10.3L12 4.5z"/><path d="M2.5 12.3L12 4.5l9.5 7.8M10 21v-5.5h4V21M16.5 3.5v3.3"/>`,
  },
  "orcamento-e-divida": {
    nome: "Orçamento e dívida",
    desenho: `<rect x="4.5" y="2" width="15" height="20" rx="1.6"/><rect ${CHEIO} x="7.5" y="5" width="9" height="4.5" rx=".6"/><circle ${TINTA} cx="8.5" cy="13" r="1"/><circle ${TINTA} cx="12" cy="13" r="1"/><circle ${TINTA} cx="15.5" cy="13" r="1"/><circle ${TINTA} cx="8.5" cy="16.5" r="1"/><circle ${TINTA} cx="12" cy="16.5" r="1"/><path d="M15.5 16v3"/>`,
  },
  previdencia: {
    nome: "Previdência",
    desenho: `<path ${CHEIO} d="M2.5 12a9.5 9.5 0 0 1 19 0c-1.6-1.2-3.2-1.2-4.8 0-1.5-1.2-3.2-1.2-4.7 0-1.5-1.2-3.2-1.2-4.7 0-1.6-1.2-3.2-1.2-4.8 0z"/><path d="M12 2.5v-.5M12 12v7a2.2 2.2 0 0 1-4.4 0"/>`,
  },
  "relacoes-exteriores": {
    nome: "Relações exteriores",
    desenho: `<circle ${CHEIO} cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M3.8 7.2h16.4M3.8 16.8h16.4M12 2.5c3.8 3.3 3.8 15.7 0 19M12 2.5c-3.8 3.3-3.8 15.7 0 19"/>`,
  },
  saneamento: {
    nome: "Saneamento",
    desenho: `<path ${CHEIO} d="M2.5 8h10a4.5 4.5 0 0 1 4.5 4.5V14h-3.6v-1.5a1 1 0 0 0-1-1H2.5z"/><path d="M7.5 8V4.5M5 4.5h5"/><path ${CHEIO} d="M15.2 17c1 1.4 1.6 2.3 1.6 3.1a1.6 1.6 0 0 1-3.2 0c0-.8.6-1.7 1.6-3.1z"/>`,
  },
  saude: {
    nome: "Saúde",
    desenho: `<path ${CHEIO} d="M9 2.5h6v6.5h6.5v6H15v6.5H9V15H2.5V9H9z"/>`,
  },
  "seguranca-publica": {
    nome: "Segurança pública",
    desenho: `<path ${CHEIO} d="M12 2l8.5 3.2v6.3c0 5.3-3.7 8.6-8.5 10.5-4.8-1.9-8.5-5.2-8.5-10.5V5.2z"/><path ${TINTA} d="M12 7.3l1.4 2.9 3.2.4-2.3 2.2.6 3.1-2.9-1.5-2.9 1.5.6-3.1-2.3-2.2 3.2-.4z"/>`,
  },
  terra: {
    nome: "Terra",
    desenho: `<path ${CHEIO} d="M2 21.5l3.5-9h13l3.5 9z"/><path d="M8.2 12.5L7 21.5M12 12.5v9M15.8 12.5l1.2 9M3.8 17h16.4"/><path d="M12 9.5V5M12 7c-1.5 0-2.8-1-2.8-2.6 1.6 0 2.8 1 2.8 2.6zM12 6.2c0-1.6 1.2-2.7 2.8-2.7 0 1.6-1.2 2.7-2.8 2.7z"/>`,
  },
  trabalho: {
    nome: "Trabalho",
    desenho: `<path ${CHEIO} d="M3.5 16.5a8.5 8.5 0 0 1 17 0z"/><path d="M1.5 16.5h21v3h-21zM10 8.3V13M14 8.3V13M10 8.3a8.4 8.4 0 0 1 4 0"/>`,
  },
  vicios: {
    nome: "Vícios",
    desenho: `<path ${MANCHA} d="M6.5 6.5h11L12 13z"/><path d="M3.5 3h17L12 13zM12 13v8M7.5 21.5h9M16 3l3-2"/><circle cx="14.2" cy="8" r="1.3"/>`,
  },
};
