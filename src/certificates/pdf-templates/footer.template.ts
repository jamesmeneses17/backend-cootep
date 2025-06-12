import type { Content } from 'pdfmake/build/pdfmake';

export function generateFooter(): Content[] {
  return [
    {
      image: 'signature',
      width: 150,
      alignment: 'center',
      margin: [0, 0, 0, 10],
    },
    {
      text: 'JONATHAN MAURICIO PEJENDINO ROSERO',
      bold: true,
      alignment: 'center',
    },
    {
      text: 'Director de Talento Humano – COOTEP',
      alignment: 'center',
    },
    {
      text: 'Cra. 4 No.7-30 - Barrio José María Hernández, Teléfonos: 4295197, 4295795\nsecretaria@cootep.com.co\n“Crecemos sólidos para servir”',
      fontSize: 8,
      alignment: 'center',
      color: '#666',
      margin: [0, 10, 0, 0],
    },
  ];
}
