export type CsvColumn<T> = {
  header: string;
  field: keyof T;
};

export type CsvParseOptions<T> = {
  columns: CsvColumn<T>[];
};

export function parseCsv<T>(content: string, options: CsvParseOptions<T>): T[] {
  const text = content.replace(/^\uFEFF/, '').trim();
  if (!text) throw new Error('Le fichier CSV est vide');

  const records = parseRecords(text);
  if (records.length < 2) {
    throw new Error('Le CSV doit contenir une ligne d’en-têtes et au moins une ligne de données');
  }

  const headers = records[0].map((header) => header.trim().toLowerCase());
  const expectedHeaders = options.columns.map((column) => column.header.toLowerCase());
  const missingHeaders = expectedHeaders.filter((header) => !headers.includes(header));
  if (missingHeaders.length > 0) {
    throw new Error(`Colonnes CSV manquantes : ${missingHeaders.join(', ')}`);
  }

  return records.slice(1).map((values, recordIndex) => {
    if (values.length !== headers.length) {
      throw new Error(`La ligne ${recordIndex + 2} ne contient pas le bon nombre de colonnes`);
    }

    const row = {} as T;
    options.columns.forEach(({ header, field }) => {
      const value = values[headers.indexOf(header.toLowerCase())]?.trim();
      if (value) row[field] = value as T[keyof T];
    });
    return row;
  });
}

function parseRecords(content: string): string[][] {
  const records: string[][] = [];
  let record: string[] = [];
  let value = '';
  let quoted = false;

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];
    const nextCharacter = content[index + 1];

    if (character === '"') {
      if (quoted && nextCharacter === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      record.push(value);
      value = '';
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && nextCharacter === '\n') index += 1;
      record.push(value);
      if (record.some((cell) => cell.trim())) records.push(record);
      record = [];
      value = '';
    } else {
      value += character;
    }
  }

  if (quoted) throw new Error('Le CSV contient un champ entre guillemets non fermé');
  record.push(value);
  if (record.some((cell) => cell.trim())) records.push(record);
  return records;
}
