import type { Content } from 'pdfmake/build/pdfmake';
import { generateFooter } from './footer.template';

export function generateFunctionsContent(
  employee: any,
  functions: any[],
  history: any[],
): Content[] {
  const fullName = `${employee.first_name} ${employee.last_name}`.toUpperCase();
  const nationalId = employee.national_id || '[Cédula no disponible]';

  const first = history[0];
  const last = history[history.length - 1];

  const rawStartDate = first?.startDate;
  const startDate = rawStartDate
    ? new Date(rawStartDate).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '[Fecha no disponible]';

  const position = last?.position?.title || '[Cargo no disponible]';

  const endDate = rawStartDate ? new Date(rawStartDate) : null;
  if (endDate) {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  const contractEndDate = endDate
    ? endDate.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '[Fecha no disponible]';

  const today = new Date().toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const functionsData = functions.length
    ? functions.map((f: any, i: number) => [
        { text: String(i + 1), alignment: 'center', margin: [0, 3] },
        { text: f.description, alignment: 'left', margin: [2, 3] },
      ])
    : [['-', '[No hay funciones registradas]']];

  return [
    {
      text: `Que ${fullName}, identificado(a) con cédula No. ${nationalId}, ha laborado en nuestra Cooperativa desde el ${startDate} hasta la fecha. Actualmente desempeña el cargo de ${position}, bajo un contrato a término fijo por un año que culmina el ${contractEndDate}, cumpliendo con las siguientes funciones:`,
      fontSize: 15,
      margin: [0, 0, 0, 20],
    },
    {
      text: 'FUNCIONES DEL CARGO',
      style: 'negritaMayus',
      alignment: 'center',
      margin: [0, 0, 0, 10],
    },
    {
      table: {
        widths: ['auto', '*'],
        body: [
          [
            { text: 'No.', bold: true, alignment: 'center', fillColor: '#f0f0f0' },
            { text: 'Descripción de la Función', bold: true, fillColor: '#f0f0f0' },
          ],
          ...functionsData,
        ],
      },
      fontSize: 15,
      layout: {
        hLineColor: () => '#444',
        vLineColor: () => '#444',
        paddingLeft: () => 6,
        paddingRight: () => 6,
        paddingTop: () => 4,
        paddingBottom: () => 4,
      },
      margin: [0, 0, 0, 25],
    },
    {
      text: `Para constancia se firma en Mocoa el día ${today}.`,
      fontSize: 15,
      margin: [0, 0, 0, 30],
    },
    ...generateFooter(),
  ];
}
