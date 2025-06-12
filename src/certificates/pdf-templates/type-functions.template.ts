import type { Content } from 'pdfmake/build/pdfmake';
import { generateFooter } from './footer.template';

export function generateFunctionsContent(
  employee: any,
  functions: any[],
  history: any[],
): Content[] {
  const fullName = `${employee.nombres} ${employee.apellidos}`.toUpperCase();

  const first = history[0];
  const last = history[history.length - 1];

  const startDate = new Date(first?.fecha_inicio).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const position = last?.cargo?.nombre || '[Cargo no disponible]';

  const endDate = new Date(first?.fecha_inicio);
  endDate.setFullYear(endDate.getFullYear() + 1);
  const contractEndDate = endDate.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const today = new Date().toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const functionsData = functions.length
    ? functions.map((f: any, i: number) => [String(i + 1), f.descripcion])
    : [['-', '[No hay funciones registradas]']];

  return [
    {
      text: `Que ${fullName}, identificado(a) con cédula No. ${employee.cedula}, ha laborado en nuestra Cooperativa desde el ${startDate} hasta la fecha. Actualmente desempeña el cargo de ${position}, bajo un contrato a término fijo por un año que culmina el ${contractEndDate}, cumpliendo con las siguientes funciones:`,
      fontSize: 11,
      margin: [0, 0, 0, 10],
    },
    {
      text: 'FUNCIONES DEL CARGO',
      style: 'negritaMayus',
      alignment: 'center',
      margin: [0, 0, 0, 6],
    },
    {
      table: {
        widths: ['auto', '*'],
        body: [
          [
            { text: 'No.', bold: true, alignment: 'center' },
            { text: 'Descripción de la Función', bold: true },
          ],
          ...functionsData,
        ],
      },
      fontSize: 9,
      layout: 'lightHorizontalLines',
      margin: [0, 0, 0, 20],
    },
    {
      text: `Se expide en Mocoa a los ${today}.`,
      fontSize: 11,
      margin: [0, 0, 0, 20],
    },
    ...generateFooter(),
  ];
}
