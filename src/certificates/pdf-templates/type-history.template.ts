import type { Content } from 'pdfmake/build/pdfmake';
import { generateFooter } from './footer.template';

export function generateHistoryContent(employee: any, history: any[]): Content[] {
  const fullName = `${employee.first_name} ${employee.last_name}`.toUpperCase();
  const idNumber = employee.national_id || '[Cédula no disponible]';

  const start = history[0];
  const end = history[history.length - 1];

  const startDate = start?.startDate
    ? new Date(start.startDate).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
    : '[Fecha de inicio]';

  const endDate = end?.endDate
    ? new Date(end.endDate).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
    : 'la fecha';

  const today = new Date();
  const fechaEmision = today.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const cargos = history.map(h => h.position?.title).filter(Boolean);
  const listaCargos =
    cargos.length > 1
      ? `${cargos.slice(0, -1).join(', ')} y ${cargos[cargos.length - 1]}`
      : cargos[0] || '[Sin cargos]';

  return [

    {
      text: `Que el señor ${fullName}, identificado con cédula de ciudadanía Nro. ${idNumber} de Mocoa, prestó sus servicios en nuestra Cooperativa desde el ${startDate} hasta el ${endDate}, desempeñando los siguientes cargos: ${listaCargos}.`,
      fontSize: 15,
      alignment: 'justify',
      lineHeight: 1.5,
      margin: [0, 0, 0, 20],
    },
    {
      text: `Para constancia se firma en Mocoa, a los ${fechaEmision}.`,
      fontSize: 15,
      alignment: 'justify',
      margin: [0, 0, 0, 20],
    },
    ...generateFooter(),
  ];
}
