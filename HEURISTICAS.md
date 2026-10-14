# Heurísticas de Nielsen aplicadas

Cada fila describe una decisión concreta y verificable y dónde está implementada. Los números de línea corresponden a la versión actual de cada archivo.

| # | Heurística | Implementación | Archivo y selector / línea |
|---|---|---|---|
| 1 | Visibilidad del estado del sistema | Al hacer scroll, el enlace de la sección visible se resalta (color, negrita y subrayado; en móvil, una barra lateral) y recibe `aria-current="true"`. | `js/main.js` L98–121 (`IntersectionObserver`); `css/styles.css` L261 `.nav-link[aria-current="true"]` |
| 1 | | Estados claros de hover, active y foco en enlaces y botones. | `css/styles.css` L148 `:focus-visible`, L251 `.nav-link:hover`, L256 `.nav-link:active`, L575 `.btn:hover`, L580 `.btn:active` |
| 1 | | Al copiar el email aparece «Copiado ✓» en una región `role="status" aria-live="polite"`, que se borra a los 3 s. | `index.html` L307 `#copy-status`; `js/main.js` L123–159 |
| 1 | | El botón de tema muestra la acción disponible («Modo claro» / «Modo oscuro») y su ícono. | `js/main.js` L23–31 `renderTheme()` |
| 2 | Coincidencia con el mundo real | Secciones convencionales de un CV: Perfil, Experiencia, Educación, Proyectos, Habilidades y Contacto. | `index.html` L66, L113, L170, L193, L252, L289 |
| 2 | | Fechas en formato local («nov. 2019 – dic. 2021») con `<time datetime>`. Lenguaje claro en español (`lang="es"`). | `index.html` L2, L155 |
| 2 | | Orden cronológico inverso. Proyectos: del 5 al 1 de la numeración original. Experiencia: se mantiene el orden original hasta completar las fechas (ver `[COMPLETAR]`). | `index.html` L113–247 |
| 3 | Control y libertad del usuario | Botón flotante «Volver arriba», que aparece al bajar 600 px. Sin JS siempre está visible. | `index.html` L345 `.to-top`; `css/styles.css` L638; `js/main.js` L170–187 |
| 3 | | El menú móvil se cierra con **Esc** (devuelve el foco al botón), con un clic fuera o al elegir una sección. | `js/main.js` L57–96 (L79 Escape, L82 clic fuera, L89 enlace) |
| 3 | | Tema reversible: si la elección coincide con la del sistema, se borra la preferencia y se vuelve a seguir al sistema. | `js/main.js` L33–49 |
| 3 | | Los enlaces externos llevan el ícono ↗, el texto oculto «(abre en pestaña nueva)», `target="_blank"` y `rel="noopener noreferrer"`. | `index.html` L82–86, L325–328 |
| 4 | Consistencia y estándares | Un único componente `article.entry` (encabezado, organización, meta y lista) para experiencia, educación y proyectos. | `index.html` L118, L175, L198…; `css/styles.css` L415 `.entry` |
| 4 | | El nombre de la cabecera lleva al inicio (`href="#inicio"`). | `index.html` L30 `.brand` |
| 4 | | Convenciones web: enlaces subrayados, `mailto:` para correo, landmarks `header`/`nav`/`main`/`footer`, un único `h1` y jerarquía h1→h2→h3 sin saltos. | `index.html` L28, L38, L63, L343 |
| 5 | Prevención de errores | Los `mailto:` y el enlace de LinkedIn se copiaron literalmente de los datos originales. Una validación automática confirmó que todas las anclas `#` tienen destino y que ninguna ruta es absoluta. | `index.html` L76, L302, L316 |
| 5 | | El botón de imprimir explica qué hace y en qué formato termina: «Abre el diálogo de impresión. Elige «Guardar como PDF»…». *El botón de descarga de PDF se omitió por decisión del autor.* | `index.html` L54 `#print-btn` |
| 5 | | Los controles que dependen de JS se ocultan si JS no carga, así que no hay botones que no funcionen. | `css/styles.css` L795 `.no-js .js-only` |
| 6 | Reconocer antes que recordar | Navegación fija (`position: sticky`) siempre visible; `scroll-padding-top` evita que la cabecera tape el destino o el foco. | `css/styles.css` L193 `.site-header`, L106 |
| 6 | | Todos los íconos van acompañados de texto visible (Correo, LinkedIn, GitHub, Menú, Imprimir / PDF, Volver arriba). Los SVG llevan `aria-hidden="true"`. | `index.html` L32–56, L74–88, L296–338 |
| 7 | Flexibilidad y eficiencia | Skip link «Saltar al contenido», visible al recibir foco. | `index.html` L26; `css/styles.css` L176 `.skip-link` |
| 7 | | Anclas compartibles por sección: cada `h2` lleva un enlace `#` que pone la URL de la sección en la barra de direcciones. | `index.html` L94 y siguientes `.anchor`; `css/styles.css` L386 |
| 7 | | Acceso rápido a imprimir o guardar como PDF desde la cabecera (o Ctrl+P). Correo y LinkedIn están accesibles junto al nombre. | `index.html` L54, L74–88; `js/main.js` L161–168 |
| 8 | Diseño estético y minimalista | Dos familias tipográficas (Georgia para títulos, fuente del sistema para texto) y paleta de 2 colores (verde azulado y arena) más neutros, todo en variables de `:root`. | `css/styles.css` L11–56 (L13, L15, L27–28) |
| 8 | | Ancho de lectura limitado (70ch), espacio en blanco generoso y solo información del CV: se eliminaron el formulario sin backend y las páginas duplicadas. | `css/styles.css` L52 `--prose-max`, L368 `.section-title` |
| 9 | Reconocer, diagnosticar y recuperarse de errores | `404.html` explica el error en lenguaje claro, muestra la ruta solicitada y ofrece un botón «Ir al inicio del CV». Sus estilos van en línea para que funcione en cualquier profundidad de ruta. | `404.html` L88–102 |
| 9 | | Si el portapapeles falla, el email queda seleccionado y se indica «pulsa Ctrl+C (⌘+C en Mac)». Sin JS, el email es texto plano seleccionable con `mailto:`. | `js/main.js` L138–146 `copyFailed()`; `css/styles.css` L552 `.is-error` |
| 10 | Ayuda y documentación | `title` y `aria-label` descriptivos en todos los controles (p. ej. «Cambiar a modo oscuro», «Enlace directo a la sección Contacto», «Mostrar u ocultar el menú (Esc para cerrar)»). | `index.html` L30, L32, L49, L54, L94, L303 |
| 10 | | Sección Contacto explícita, con instrucciones («La forma más rápida de contactarme es por correo»). | `index.html` L289–339 |
| 10 | | `README.md` explica la estructura, cómo editar el contenido y cómo publicar en GitHub Pages o en otro servidor. | `README.md` |

## Accesibilidad (WCAG 2.2 AA), transversal

- **Contraste:** 131 nodos de texto medidos con los estilos calculados, todos ≥ 4.5:1. El mínimo es 6.66:1 en tema claro y 8.54:1 en tema oscuro.
- **Teclado:** el recorrido con Tab completo cubre 23 elementos a 1440 px, todos con `outline` de 3 px visible y ninguno tapado por la cabecera fija.
- **Movimiento:** `prefers-reduced-motion` desactiva el scroll suave y las transiciones (`css/styles.css` L800).
- **Impresión:** blanco y negro, sin navegación ni botones, la foto en escala de grises y las URL externas visibles (`css/styles.css` L819).
