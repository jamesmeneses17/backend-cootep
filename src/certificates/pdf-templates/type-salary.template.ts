import type { Content } from 'pdfmake/build/pdfmake';
import { generateFooter } from './footer.template';

export function generateSalaryContent(employee: any, history: any[]): Content[] {
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

  const salary = last?.salary
    ? `$ ${Number(last.salary).toLocaleString('es-CO')}`
    : '[Salario no disponible]';

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

  return [
    {
      text: `Que ${fullName}, identificado(a) con cédula No. ${nationalId}, ha laborado con nuestra Cooperativa desde el ${startDate}, desempeñando actualmente el cargo de ${position}, con un salario básico mensual de ${salary}, sin incluir descuentos de ley. El contrato es a término fijo y finaliza el ${contractEndDate}.`,
      fontSize: 15,
      margin: [0, 0, 0, 30],
    },
    {
      text: `Se expide la presente constancia en Mocoa, a los ${today}.`,
      fontSize: 15,
      margin: [0, 0, 0, 30],
    },
    ...generateFooter(),
  ];
}
