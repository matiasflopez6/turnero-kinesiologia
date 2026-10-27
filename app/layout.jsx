import { Hanken_Grotesk, Saira } from 'next/font/google';
import './globals.css';

const saira = Saira({ subsets: ['latin'], weight: ['500', '600'], variable: '--font-display' });
const hanken = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-sans' });

export const metadata = {
  title: process.env.CLINIC_NAME || 'Kinesiología',
  description: 'Agenda, pacientes, evolución y cobros del consultorio',
};

// Aplica el tema guardado antes de pintar, para que no parpadee. Día es el tema por defecto.
const themeScript = `try{if(localStorage.getItem('tema')==='noche')document.documentElement.dataset.theme='noche'}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${saira.variable} ${hanken.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="mfl">{children}</body>
    </html>
  );
}
