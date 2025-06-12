import type { Content } from 'pdfmake/build/pdfmake';
import { generateFooter } from './footer.template';

export function generateHistoryContent(
  employee: any,
  history: any[],
): Content[] {
  const fullName = `${employee.nombres} ${employee.apellidos}`.toUpperCase();

  const start = history[0];
  const end = history[history.length - 1];

  const startDate = start
    ? new Date(start.fecha_inicio).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '[Start date]';

  const endDate = end?.fecha_fin
    ? new Date(end.fecha_fin).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'present';

  const today = new Date().toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const positionsList = history.map((h: any) => {
    const position = h.cargo?.nombre || '[Undefined position]';
    const start = new Date(h.fecha_inicio).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const end = h.fecha_fin
      ? new Date(h.fecha_fin).toLocaleDateString('es-CO', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : 'present';
    return `${position} from ${start} to ${end}`;
  });

  return [
    {
      text: `That Mr./Ms. ${fullName}, holder of ID No. ${employee.cedula}, worked at our Cooperative from ${startDate} to ${endDate}, performing the following positions:`,
      fontSize: 11,
      margin: [0, 0, 0, 10],
    },
    {
      ul: positionsList.length ? positionsList : ['[No history available]'],
      fontSize: 10,
      margin: [0, 0, 0, 20],
    },
    {
      text: `Issued in Mocoa on ${today}.`,
      fontSize: 11,
      margin: [0, 0, 0, 20],
    },
    ...generateFooter(),
  ];
}
