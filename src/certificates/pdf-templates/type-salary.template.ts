import type { Content } from 'pdfmake/build/pdfmake';
import { generateFooter } from './footer.template';

export function generateSalaryContent(
  employee: any,
  history: any[],
): Content[] {
  const fullName = `${employee.first_name} ${employee.last_name}`.toUpperCase();

  const first = history[0];
  const last = history[history.length - 1];

  const startDate = new Date(first?.startDate).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const salary = last?.salary
    ? `$ ${Number(last.salary).toLocaleString('es-CO')}`
    : '[Salario no disponible]';

  const position = last?.position?.title || '[Cargo no disponible]';

  const endDate = new Date(first?.startDate);
  endDate.setFullYear(endDate.getFullYear() + 1);
  const contractEndDate = !isNaN(endDate.getTime())
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

  return [
    {
      text: [
        `Que ${fullName}, identificado(a) con cédula No. `,
        { text: employee.national_id || '[Cédula no disponible]', bold: true },
        `, ha laborado con nuestra Cooperativa desde el ${startDate}, desempeñando actualmente el cargo de `,
        { text: position, bold: true },
        `, con un salario básico mensual de `,
        { text: salary, bold: true },
        `, sin incluir descuentos de ley. El contrato es a término fijo y finaliza el ${contractEndDate}.`,
      ],
      fontSize: 14,
      alignment: 'justify',
      lineHeight: 1.5,
      margin: [0, 0, 0, 20],
    },
    {
      text: `Se expide la presente constancia en Mocoa, a los ${today}.`,
      fontSize: 14,
      alignment: 'justify',
      margin: [0, 0, 0, 60],
    },
    ...generateFooter(),
  ];
}
