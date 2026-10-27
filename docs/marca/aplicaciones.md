# Aplicaciones

Cómo se usa la marca en cada servicio. Cuando el producto se entrega con la marca del cliente, MFL Systems aparece solo como firma discreta ("Hecho por MFL Systems") en el pie, en `body-s` y `ink-muted`.

## Sitio web

- Tema Noche, sobre `night`. El hero no abre con un titular genérico: abre con **una cifra real de un cliente** en `metric` a tamaño de página, y debajo, en una línea, qué significa ("horas por semana que una clínica dejó de pasar respondiendo WhatsApp"). Al lado o debajo, una captura del sistema funcionando. Un solo botón primario.
- El logo con su tagline va arriba a la izquierda; la tagline no se repite como rótulo en otras secciones.
- Cada servicio se presenta como un resultado: título = lo que cambia, debajo un `Metric` con un caso de antes/después.
- "Cómo trabajamos" sí es una secuencia: pasos numerados del 1 al 4 en Saira, sin ceros adelante.
- Texto alineado a la izquierda, ancho de lectura máximo 640px. Secciones separadas por `space-24`.

## Chatbots (WhatsApp, web)

- Usá el componente `ChatBubble`. El bot responde en `surface`, el usuario en `pulse-soft`.
- El bot se presenta con el nombre del negocio, no con "soy una IA". Si preguntan, responde que es un asistente automático y ofrece pasar con una persona.
- Mensajes de hasta 3 líneas. Una pregunta por mensaje. Opciones como botones rápidos (`Button` variante `secondary`, tamaño chico).
- Siempre cerrá con el próximo paso concreto: "¿Te reservo el jueves a las 14:30?".

## Apps de turnos

- Tema Día por defecto (se usa todo el día en mostrador); Noche disponible.
- Horarios con `TimeSlot`: libre, seleccionado (con corte `cut-s`), ocupado.
- Estados de turno con `Badge`: Confirmado (`gain`), Sin confirmar (`alert`), Cancelado (`error`).
- Horas y fechas con cifras tabulares (`.mfl-num`) para que se alineen en columnas.
- Agenda vacía: "Todavía no hay turnos para hoy. Compartí tu link de reservas", con el botón para copiarlo.

## Resúmenes y reportes en PDF

- Portada: banda `night` arriba con logo y título en `display-l`, `logo-white`. El resto en tema Día, A4, márgenes de 20mm.
- Primera página: tres `Metric` como máximo con lo más importante; después, el detalle.
- Puntos clave en lista; fechas y plazos marcados con `Badge` `alert`.
- Pie con la fecha de generación y el número de página.

## CRM y paneles

- Tema Día por defecto. Navegación lateral sobre `surface`, contenido sobre `bg`.
- Arriba de todo, una fila de `Metric` con el estado del período contra el anterior.
- Tablas: encabezados en `label` + `ink-muted`, filas de 48px, divisores `line`, hover `surface-raised`, números alineados a la derecha.
- Las acciones destructivas nunca en `pulse`: usá `Button` `ghost` con confirmación.

## Propuestas y presentaciones

- Portada en `night` con el logo; interiores en Día.
- Un mensaje por slide o página. El número protagonista en `metric`.
- Diagnóstico primero, solución después, inversión al final.
