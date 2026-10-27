MFL Systems lleva inteligencia artificial a negocios reales: sitios, chatbots, turnos, resúmenes y CRM que se notan en el día a día del cliente. La marca se presenta como un **socio que se hace cargo del resultado**, no como un vendedor de tecnología. Todo lo visual y lo escrito sale de esa idea: claridad, números concretos y cero humo.

## Principios

1. **Resultado antes que herramienta.** Mostrá qué cambia (horas, clientes, turnos, pesos), nunca cómo está hecho por dentro.
2. **Antes y después.** Cada pieza que hable de valor muestra el punto de partida y el punto actual. Usá el componente `Metric`.
3. **Mostrar, no contar.** Preferí una captura, una demo o un ejemplo con datos reales del rubro antes que una promesa abstracta.
4. **Preciso y angular.** La forma de la marca es el corte diagonal de la M, la F y la L. Nada de curvas blandas, degradés ni brillos.
5. **Una sola cosa memorable: la cifra.** Lo audaz de la marca es el número de resultado en Saira grande (`metric`). Todo lo que lo rodea es silencioso: sin rótulos en mayúsculas, sin íconos decorativos, sin efectos. Antes de publicar una pieza, sacale un adorno.

## Voz y tono

- Español rioplatense, con **voseo** ("agendá", "mirá tu reporte"). Hablale al dueño o dueña del negocio de igual a igual.
- Frases cortas. Un dato por frase. Verbos de acción.
- **Sin jerga técnica** hacia el cliente: nada de "API", "webhook", "tokens", "nodos", "LLM". Decí "tu WhatsApp responde solo", "el sistema te avisa", "el resumen te llega a las 8".
- Prometé solo lo que se puede medir y controlar: tiempo de respuesta, horas ahorradas, seguimientos hechos. Nunca "duplicá tus ventas".
- Honestidad como diferencial: "si no te sirve, te lo decimos".
- Sin emojis en sitio, reportes ni propuestas. En el chatbot, como mucho uno por conversación y solo si el negocio del cliente ya los usa.
- Mayúsculas solo en la tagline del logo (`tagline`). Títulos, botones y labels en oración ("Tu semana, resumida"), nunca Title Case ni mayúsculas.
- Sin metadatos encadenados con "·" ni rótulos del tipo "PALABRA — fragmento": escribí la frase completa ("Jueves 30/10, por la tarde").
- Los botones dicen exactamente qué pasa ("Confirmar turno") y el mensaje de después usa la misma palabra ("Turno confirmado"). Sin flechas "→" agregadas al texto.
- Los errores no piden perdón ni son vagos: dicen qué pasó y cómo seguir. Una pantalla vacía invita a hacer algo ("Todavía no hay turnos. Compartí tu link de reservas").

| En vez de | Escribí |
| --- | --- |
| Implementamos agentes de IA con n8n | Tu WhatsApp responde consultas aunque estés cerrado |
| Automatización de procesos end-to-end | Dejás de copiar datos a mano entre planillas |
| Solución innovadora y disruptiva | 12 horas menos por semana en tareas repetidas |
| ¡Potenciá tu negocio con IA! 🚀 | Mirá cuántos turnos se confirmaron solos este mes |

## Logo

- Usá siempre los SVG de `assets/Logos/`. Sobre fondos oscuros, `mfl-logo.svg` (blanco + `logo-blue`); sobre fondos claros, `mfl-logo-claro.svg` (`ink` + `pulse`). Nunca sobre fotos.
- Área libre alrededor: la altura de la "S" de *Systems* en los cuatro lados. Los archivos ya la incluyen: no los recortes.
- Tamaño mínimo: 120px de ancho en pantalla, 30mm impreso. Por debajo, usá `mfl-monograma.svg`. Para perfiles, favicon e ícono de app, `mfl-avatar.svg`.
- La tagline "Soluciones de IA para un mundo real" acompaña al logo en portadas y en el hero del sitio. En interfaces internas (apps, CRM), firmas y pies, usá `mfl-logo-sin-tagline.svg`.
- No lo recolorees, no le agregues sombra ni brillo, no lo estires, no cambies el azul por otro color.

## Color

- **Noche es el tema principal** de la marca (sitio, demos, portadas). **Día** es para herramientas de trabajo largo: CRM, turneros, paneles y reportes impresos.
- Fondos: `bg` para la página (en Noche es `night`, el negro puro del logo, nunca un casi-negro), `surface` para tarjetas, `surface-raised` para inputs y elementos elevados.
- Texto: `ink` principal, `ink-muted` secundario. Links en `pulse-ink`. Las cifras de resultado van en `ink`: el tamaño las destaca, no el color.
- El azul es escaso y con intención: **una sola acción primaria por pantalla** en `pulse` con texto `on-pulse`. Para fondos tenues, `pulse-soft`.
- Estados: `gain` (mejoró / listo), `alert` (pendiente / en riesgo), `error` (falla). Siempre con una palabra o signo además del color, sobre su versión `-soft`.
- `night`, `logo-white` y `logo-blue` son los tres colores de identidad: usalos en bloques grandes de portada, banners y redes.
- Proporción orientativa en piezas de marca: 70% `night`, 20% `logo-white`, 10% `logo-blue`.

## Tipografía

Dos familias, bien distintas entre sí:

- **Saira** (`display`) para cifras de resultado (`metric`) y titulares: tiene la geometría cuadrada de "Systems" en el logo. Usala como forma, no solo como texto: una cifra en `metric` puede ocupar media tarjeta o media página de reporte.
- **Hanken Grotesk** (`sans`) para todo el texto de lectura e interfaz. Horarios, fechas y columnas de números con cifras tabulares (`font-variant-numeric: tabular-nums`, clase `.mfl-num`), no con una monoespaciada.
- Escala clásica: 12, 14, 16, 18, 24, 48 y 72px. No inventes tamaños intermedios, tampoco en componentes ni en piezas sueltas.
- Líneas de texto de menos de 75 caracteres (máximo 640px de ancho).
- Ambas son de Google Fonts: `https://fonts.googleapis.com/css2?family=Saira:wght@500;600&family=Hanken+Grotesk:wght@400;600&display=swap`.
- `tagline` (mayúsculas con tracking 0.24em) existe solo para la frase del logo. No la uses como rótulo sobre títulos.

## Forma, espacio y bordes

- **El corte diagonal** (`cut`, 12px; `cut-s`, 8px) es la firma: un chaflán en la esquina superior derecha del botón primario y del turno seleccionado, y en las tarjetas destacadas una "esquirla" `pulse` con el mismo ángulo que el trazo azul de la F. Siempre arriba a la derecha, nunca en más de una esquina.
- Radios mínimos: `radius-s` en controles, `radius-m` en tarjetas, `radius-0` en bandas y bloques de identidad.
- Separación con bordes `line`, no con sombras. Sin sombras en tema Noche; en Día, como mucho un borde.
- Espaciado en la escala `space-*`: `space-6` dentro de tarjetas, `space-12` entre secciones de app, `space-24` entre secciones del sitio.
- Foco visible siempre: anillo sólido de 2px en `focus` con 2px de separación.

## Iconografía e imágenes

- Íconos de trazo recto, 1.5px, esquinas en ángulo (por ejemplo Lucide o Phosphor *regular*), en `ink` o `ink-muted`; `pulse-ink` solo para el ícono activo.
- Sin ilustraciones de robots, cerebros brillantes, manos humanas tocando circuitos ni degradés azul-violeta.
- Fotografía: negocios reales del cliente (consultorio, local, mostrador), luz natural, sin filtros. Mejor una captura de pantalla real del sistema funcionando que una foto de stock.
- Como gráfico de marca usá formas planas: rectángulos y triángulos en `night`, `logo-blue` y `logo-white`, con el mismo ángulo del corte del logo.

## Movimiento

- El movimiento responde a lo que hace la persona: abrir, confirmar, elegir un turno. 150ms `ease-out` para hover y foco; 240ms para paneles. Nada de rebotes.
- Sin animaciones de entrada en cada sección. Si una página necesita un momento, que sea uno solo: la cifra principal contando hasta su valor al cargar.
- El indicador de "escribiendo…" del chatbot es el único movimiento en loop permitido.
- Todo respeta `prefers-reduced-motion`.
