// assets/Utils/parserReceita.ts
// Extrai nome, dosagem, intervalo, duração e horário de um texto vindo do OCR.
// Tudo é "melhor esforço": o que não for encontrado volta null/'' e o usuário corrige no modal.

export type DadosRemedio = {
  nome: string;
  dosagem: string;              // ex: "500 mg"
  quantidadePorDose: number | null; // ex: 1 (comprimido)
  intervaloHoras: number | null;    // ex: 8
  duracaoDias: number | null;       // ex: 7
  horarioInicial: string | null;    // ex: "08:00"
  textoBruto: string;
  camposEncontrados: string[];      // pra você destacar no modal o que veio da câmera
};

/** remove acentos e baixa pra minúsculo, só pra facilitar as regex */
function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

const NUMEROS_EXTENSO: Record<string, number> = {
  um: 1, uma: 1, dois: 2, duas: 2, tres: 3, quatro: 4, cinco: 5, seis: 6,
  sete: 7, oito: 8, nove: 9, dez: 10, onze: 11, doze: 12, quinze: 15,
  vinte: 20, trinta: 30,
};

function paraNumero(valor: string | undefined): number | null {
  if (!valor) return null;
  const limpo = valor.trim();
  if (/^\d+$/.test(limpo)) return parseInt(limpo, 10);
  const extenso = NUMEROS_EXTENSO[normalizar(limpo)];
  return extenso ?? null;
}

// ---------------------------------------------------------------- dosagem

const REGEX_DOSAGEM = /(\d+(?:[.,]\d+)?)\s*(mg\/ml|mcg|mg|ml|g|ui|%)\b/i;

function extrairDosagem(texto: string): string {
  const achou = texto.match(REGEX_DOSAGEM);
  if (!achou) return '';
  const numero = achou[1].replace(',', '.');
  const unidade = achou[2].toLowerCase();
  return `${numero} ${unidade}`;
}

// --------------------------------------------------------------- intervalo

function extrairIntervaloHoras(texto: string): number | null {
  const t = normalizar(texto);

  // "de 8 em 8 horas" / "de oito em oito horas"
  let achou = t.match(/de\s+(\d+|[a-z]+)\s+em\s+(?:\d+|[a-z]+)\s*(?:h\b|horas?)/);
  if (achou) return paraNumero(achou[1]);

  // "a cada 8 horas" / "cada 8h"
  achou = t.match(/(?:a\s*)?cada\s+(\d+|[a-z]+)\s*(?:h\b|horas?)/);
  if (achou) return paraNumero(achou[1]);

  // "8/8h" ou "8 / 8 h"
  achou = t.match(/(\d{1,2})\s*\/\s*\d{1,2}\s*h/);
  if (achou) return paraNumero(achou[1]);

  // "3x ao dia" / "3 vezes ao dia" / "duas vezes por dia"
  achou = t.match(/(\d+|[a-z]+)\s*(?:x|vezes?)\s*(?:ao|por|_)?\s*dia/);
  if (achou) {
    const vezes = paraNumero(achou[1]);
    if (vezes && vezes > 0 && vezes <= 24) return Math.round(24 / vezes);
  }

  // "1 vez ao dia" já cai no caso acima; "uma vez por semana" -> 168h
  achou = t.match(/(\d+|[a-z]+)\s*(?:x|vezes?)\s*(?:por|na)\s*semana/);
  if (achou) {
    const vezes = paraNumero(achou[1]);
    if (vezes && vezes > 0) return Math.round((24 * 7) / vezes);
  }

  return null;
}

// ---------------------------------------------------------------- duração

function extrairDuracaoDias(texto: string): number | null {
  const t = normalizar(texto);

  const achou = t.match(
    /(?:durante|por|tratamento\s+de|uso\s+por)?\s*(\d+|[a-z]+)\s*(dias?|semanas?|mes(?:es)?)\b/
  );
  if (!achou) return null;

  const quantidade = paraNumero(achou[1]);
  if (!quantidade) return null;

  const unidade = achou[2];
  if (unidade.startsWith('dia')) return quantidade;
  if (unidade.startsWith('semana')) return quantidade * 7;
  return quantidade * 30; // mês
}

// ---------------------------------------------------------------- horário

function extrairHorario(texto: string): string | null {
  const achou = texto.match(/\b([01]?\d|2[0-3])\s*[:h]\s*([0-5]\d)\b/);
  if (!achou) return null;
  const hora = achou[1].padStart(2, '0');
  return `${hora}:${achou[2]}`;
}

// --------------------------------------------------- quantidade por dose

function extrairQuantidadePorDose(texto: string): number | null {
  const t = normalizar(texto);
  const achou = t.match(
    /tomar\s+(\d+|[a-z]+)\s*(?:comprimidos?|capsulas?|drageas?|gotas?|ml|colher)/
  );
  return achou ? paraNumero(achou[1]) : null;
}

// ------------------------------------------------------------------- nome

// linhas que quase nunca são o nome do remédio
const RUIDO = [
  'uso oral', 'uso interno', 'uso externo', 'via oral', 'posologia',
  'comprimido', 'comprimidos', 'capsula', 'capsulas', 'generico',
  'medicamento', 'receita', 'paciente', 'prescricao', 'farmacia',
  'crm', 'dr.', 'dra.', 'venda sob', 'ms ', 'lote', 'validade',
  'industria brasileira', 'tomar', 'aplicar',
];

function ehRuido(linha: string): boolean {
  const l = normalizar(linha);
  if (l.replace(/[^a-z]/g, '').length < 3) return true;
  return RUIDO.some((palavra) => l.startsWith(palavra) || l === palavra.trim());
}

function limparNome(linha: string): string {
  return linha
    .replace(REGEX_DOSAGEM, '')                       // tira "500mg"
    .replace(/\b(comprimidos?|capsulas?|caixa com \d+.*)\b/gi, '')
    .replace(/[^\p{L}\p{N}\s\-+]/gu, ' ')             // tira pontuação estranha do OCR
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, 3)                                      // nome de remédio raramente passa de 3 palavras
    .join(' ');
}

function extrairNome(linhas: string[]): string {
  // 1ª tentativa: a linha que tem a dosagem normalmente é a do nome ("Amoxicilina 500mg")
  const comDosagem = linhas.find((l) => REGEX_DOSAGEM.test(l) && !ehRuido(l));
  if (comDosagem) {
    const nome = limparNome(comDosagem);
    if (nome.length >= 3) return nome;
  }

  // 2ª tentativa: primeira linha que não é ruído
  const primeira = linhas.find((l) => !ehRuido(l));
  return primeira ? limparNome(primeira) : '';
}

// ------------------------------------------------------------------ main

export function parseReceita(textoOcr: string): DadosRemedio {
  const textoBruto = (textoOcr ?? '').trim();

  const linhas = textoBruto
    .split(/[\r\n]+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const nome = extrairNome(linhas);
  const dosagem = extrairDosagem(textoBruto);
  const intervaloHoras = extrairIntervaloHoras(textoBruto);
  const duracaoDias = extrairDuracaoDias(textoBruto);
  const horarioInicial = extrairHorario(textoBruto);
  const quantidadePorDose = extrairQuantidadePorDose(textoBruto);

  const camposEncontrados: string[] = [];
  if (nome) camposEncontrados.push('nome');
  if (dosagem) camposEncontrados.push('dosagem');
  if (intervaloHoras) camposEncontrados.push('intervalo');
  if (duracaoDias) camposEncontrados.push('duracao');
  if (horarioInicial) camposEncontrados.push('horario');
  if (quantidadePorDose) camposEncontrados.push('quantidade');

  return {
    nome,
    dosagem,
    quantidadePorDose,
    intervaloHoras,
    duracaoDias,
    horarioInicial,
    textoBruto,
    camposEncontrados,
  };
}