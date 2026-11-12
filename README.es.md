<h1 align="center">🎯 Crosshair Plugin</h1>

<p align="center"><b>Idioma:</b> <a href="README.md">Português</a> · <a href="README.en.md">English</a> · Español</p>

<p align="center"><b>Una mira personalizable para Decky Loader, diseñada para Steam Deck, Legion Go y otras consolas portátiles.</b></p>

<p align="center">
  <a href="https://github.com/Pedrocarletti/crosshair-plugin/releases/latest"><img src="https://img.shields.io/github/v/release/Pedrocarletti/crosshair-plugin?label=versi%C3%B3n&color=2ea44f&style=for-the-badge" alt="Versión" /></a>
  <a href="https://github.com/Pedrocarletti/crosshair-plugin/releases"><img src="https://img.shields.io/github/downloads/Pedrocarletti/crosshair-plugin/total?label=descargas&color=1a9fff&style=for-the-badge" alt="Descargas" /></a>
  <a href="https://decky.xyz"><img src="https://img.shields.io/badge/Decky%20Loader-plugin-9b5cff?style=for-the-badge" alt="Decky Loader" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/licencia-BSD--3-ff007b?style=for-the-badge" alt="Licencia" /></a>
</p>

<p align="center"><img src="https://github.com/user-attachments/assets/2a8a1378-ad2d-41a8-b484-789cc49682d4" alt="Interfaz de Crosshair Plugin (versión anterior)" width="100%" /></p>

[📦 Descargar](https://github.com/Pedrocarletti/crosshair-plugin/releases/latest/download/Crosshair.zip) · [Primeros pasos](#primeros-pasos) · [Atajo del mando](#atajo-del-mando) · [Solución de problemas](#solución-de-problemas) · [Hoja de ruta](#hoja-de-ruta)

## Índice

[Funciones](#funciones) · [Instalación](#instalación) · [Primeros pasos](#primeros-pasos) · [Atajo del mando](#atajo-del-mando) · [Modelos y colores](#modelos-y-colores) · [Resoluciones](#resoluciones) · [Cómo funciona](#cómo-funciona) · [Solución de problemas](#solución-de-problemas) · [Hoja de ruta](#hoja-de-ruta) · [Historial de versiones](#historial-de-versiones) · [Contribuir](#contribuir) · [Créditos](#créditos)

## Funciones

| Función | Qué hace |
|---|---|
| **7 modelos de mira** | Caja, Punto, Anillo, X, Estrella, Corchetes y Guiones, en una lista desplegable |
| **Colores y tamaño** | 8 colores predefinidos, RGB personalizado y escala del 50% al 300% |
| **Escala desde el centro** | La mira crece desde su centro, con calibración opcional |
| **Atajo del mando** | Graba 2 botones para activar o desactivar la mira sin abrir el menú |
| **Perfiles por juego** | Guarda modelo, color, tamaño y posición para aplicarlos al iniciar cada juego |
| **MangoHud conservado** | Al desactivar la mira se restaura la superposición de rendimiento anterior |
| **Ajuste de posición** | Controles horizontal y vertical de -200 a +200, guardados por modelo |
| **Varias pantallas** | Steam Deck, Legion Go S, Legion Go, 1080p y 4K |
| **Idiomas** | Portugués, inglés y español mediante un selector con preferencia guardada |
| **Interfaz con pestañas** | Paneles inspirados en Mako; navegación con L1/R1 o por toque |
| **Actualizaciones** | Versiones automáticas y compatibilidad con Direct Updater |

## Instalación

1. Descarga [`Crosshair.zip`](https://github.com/Pedrocarletti/crosshair-plugin/releases/latest/download/Crosshair.zip) desde [Releases](https://github.com/Pedrocarletti/crosshair-plugin/releases).
2. Abre **Configuración de Decky Loader** y activa el **Modo desarrollador**.
3. En **Desarrollador**, elige **Instalar plugin desde ZIP** y selecciona `Crosshair.zip`.
4. Si el plugin no aparece, reinicia Decky o el dispositivo.

> [!TIP]
> Después de la primera instalación, **Direct Updater** puede reconocer el plugin. Si no encuentra el origen, selecciona **?** junto a Crosshair, elige **Find source** e introduce `Pedrocarletti/crosshair-plugin`.

> **¿Vienes del repositorio anterior?** En Direct Updater, elige **Find source**, introduce `Pedrocarletti/crosshair-plugin` y confirma **Use this source** una vez para recibir las próximas versiones de este repositorio.

## Primeros pasos

1. Abre **Crosshair Plugin** en Decky Loader.
2. En **Idioma**, selecciona **Português**, **English** o **Español**. La preferencia se guarda.
3. En **Pantalla**, elige la resolución de tu pantalla.
4. En **Apariencia**, elige el modelo, el color y el tamaño.
5. Activa **Mostrar mira**.
6. Si hace falta, céntrala con **Horizontal (X)** y **Vertical (Y)** en **Pantalla**.
7. Con un juego en ejecución, puedes usar **Guardar perfil de este juego** en **Perfiles**.

Usa **L1/R1** para recorrer **Apariencia**, **Pantalla**, **Atajo** y **Perfiles**. También puedes seleccionar las pestañas por toque. El plugin recuerda la última pestaña. Durante la grabación, L1/R1 pueden formar parte de la combinación y no cambian de pestaña.

| Área | Controles |
|---|---|
| **Crosshair** | Idioma, resumen del estado e interruptor Mostrar mira |
| **Apariencia** | Modelo, carrusel y control de color, RGB, tamaños predefinidos y control de tamaño |
| **Pantalla** | Resolución, controles X/Y, restablecer posición y calibración avanzada |
| **Atajo** | Grabar, eliminar, tiempo de pulsación y diagnóstico de entrada |
| **Perfiles** | Guardar, actualizar, eliminar y aplicar perfiles automáticamente |

> [!NOTE]
> El control de color cambia el color al instante con izquierda/derecha. El color seleccionado permanece en el centro del carrusel. Usa arriba/abajo para cambiar de control.

## Atajo del mando

Activa o desactiva la mira con **2 botones del mando**, sin abrir el menú.

1. En **Atajo**, selecciona **Grabar combinación**.
2. Pulsa los 2 botones **a la vez** y suéltalos antes de 12 segundos. Puedes mantener el menú abierto.
3. La mira parpadea dos veces al guardar. Se aceptan combinaciones como **Select + X**.
4. Pulsa la combinación para mostrar u ocultar la mira.

La lectura conserva los eventos de pulsación y liberación que llegan juntos, incluidas las pulsaciones rápidas de A/B/X/Y. El **Tiempo de pulsación** va de 0 a 1000 ms; el valor predeterminado es 0 para una activación inmediata. Auméntalo para evitar activaciones accidentales.

| Botones | Menú abierto | En el juego |
|---|:---:|:---:|
| A, B, X, Y y cruceta | ✅ | ✅ |
| L4, L5, R4, R5 en Steam Deck y Steam Controller | ✅ | ✅ |
| LB, RB, LT, RT, Menu y View | ✅ | 🧪 En validación |
| L3, R3 y botones adicionales de otros mandos | ✅ | ⚠️ Depende de Steam |

> [!NOTE]
> La grabación usa la interfaz de Steam. Durante el juego, el plugin también lee el mando directamente desde el sistema. Si ambas vías detectan la misma pulsación, solo se cuenta una vez. La disponibilidad en el juego depende de los botones expuestos por Steam Input y el dispositivo.

> [!TIP]
> La tarjeta del atajo muestra los **últimos botones leídos en el juego**, con sus nombres e identificadores. Pulsa la combinación en el juego y vuelve a abrir el menú para comprobarla.

## Modelos y colores

| Modelo | Aspecto | Descripción |
|---|:---:|---|
| Caja | <code>&#124; + &#124;</code> | Marco alrededor del centro |
| Punto | `+` | El modelo clásico |
| Anillo | `O` | Mira abierta |
| X | `x` | Discreta |
| Estrella | `*` | Marca pequeña |
| Corchetes | `[ + ]` | Destaca el centro |
| Guiones | `- + -` | Líneas a los lados |

| Color | Código | Color | Código |
|---|---|---|---|
| Rosa | `#FF007B` | Cian | `#00E5FF` |
| Verde | `#00FF66` | Morado | `#9B5CFF` |
| Rojo | `#FF2D2D` | Naranja | `#FF8A00` |
| Amarillo | `#FFE600` | Blanco | `#FFFFFF` |

Usa **Color personalizado (RGB)** para crear cualquier otro color.

## Resoluciones

| Pantalla | Resolución |
|---|---|
| Steam Deck | 1280 × 800 |
| Legion Go S | 1920 × 1200 |
| Monitor externo, 1080p | 1920 × 1080 |
| Legion Go | 2560 × 1600 |
| Monitor externo, 4K | 3840 × 2160 |

> [!NOTE]
> El centrado de Anillo, X, Estrella, Corchetes y Guiones es estimado. Ajusta X/Y si hace falta; la posición se guarda por modelo.

## Cómo funciona

El plugin escribe una configuración de **MangoHud** que dibuja texto (`custom_text`) con el color (`text_color`), el tamaño (`font_size`) y la posición (`offset_x`, `offset_y`) elegidos.

| Acción | Resultado |
|---|---|
| Activar la mira | Guarda la configuración de MangoHud existente y escribe la mira |
| Desactivar la mira | Restaura exactamente la configuración anterior |
| Steam sustituye el archivo | Conserva la nueva configuración de rendimiento de Steam |
| Reiniciar Decky | Inicia con la mira desactivada y restaura la superposición |
| Cambiar tamaño | Recalcula la posición para crecer desde el centro |

| Limitación | Detalle |
|---|---|
| Superposición de rendimiento | No puede mostrarse junto con la mira; ambas usan MangoHud |
| Otros plugins | Puede entrar en conflicto con plugins que modifican MangoHud, como MangoPeel |
| Perfiles automáticos | Dependen de que Steam avise al plugin cuando se inicia un juego |
| Atajos en el juego | Dependen de los botones expuestos por Steam y el dispositivo |

## Solución de problemas

| Problema | Causa probable | Qué hacer |
|---|---|---|
| La mira está descentrada | Posición estimada del modelo | Ajusta X/Y; usa Calibrar escala si también se mueve al cambiar el tamaño |
| La mira se mueve al cambiar el tamaño | Márgenes internos de MangoHud | Sigue los 3 pasos de Calibrar escala |
| El atajo falla fuera del menú | Los botones no llegan al juego | Consulta los últimos botones leídos, revisa Steam Input o graba otra combinación |
| El atajo falla incluso en el menú | Grabación antigua o tiempo de pulsación alto | Graba de nuevo y ajusta Tiempo de pulsación a 0 |
| Desapareció la superposición de rendimiento | La mira está activada | Desactiva la mira para restaurar MangoHud |
| El perfil no se aplica al iniciar | Steam no avisó al plugin | Abre el plugin y comprueba Aplicar perfil al iniciar el juego |
| Failed to fetch dynamically imported module | Se instaló el código fuente sin `dist` | Instala `Crosshair.zip` desde Releases |
| Direct Updater no encuentra el origen | Instalación antigua | **?** → **Find source** → `Pedrocarletti/crosshair-plugin` |

Registros: `~/homebrew/logs/Crosshair/`.

## Hoja de ruta

| Estado | Elemento |
|:---:|---|
| ✅ | Legion Go S, colores, tamaño y 7 modelos |
| ✅ | Perfiles por juego y escala desde el centro |
| ✅ | Grabación del mando, lectura en el juego y restauración de MangoHud |
| ✅ | Versiones automáticas y Direct Updater |
| ✅ | Documentación e interfaz en portugués, inglés y español |
| ✅ | Pestañas inspiradas en Mako y navegación con L1/R1 |
| 🔄 | Validar LB, RB, LT, RT, Menu y View en el juego |
| 🧭 | L3/R3 y botones traseros de mandos que no sean de Valve |
| 🧭 | Calibración automática del centrado |
| 💡 | Opacidad y contorno |
| 💡 | Detección automática de resolución |
| 💡 | Más modelos de mira |
| 💡 | Publicación en la tienda oficial de Decky |

✅ Completado · 🔄 En curso · 🧭 Planificado · 💡 Idea. Esta hoja de ruta expresa intenciones sin fechas.

## Historial de versiones

| Versión | Novedades |
|:---:|---|
| **1.8** | Portugués, inglés y español; pestañas con L1/R1; corrección de pulsaciones rápidas de A/B/X/Y |
| **1.7** | Restauración de MangoHud; más botones en el juego; atajos con QAM abierto; diagnóstico |
| **1.6** | Grabación renovada desde Steam; carrusel de colores con izquierda/derecha; vista previa eliminada |
| **1.5** | Primera implementación del atajo e interfaz renovada |
| **1.4** | Escala desde el centro, código modular y compatibilidad con Direct Updater |
| **1.3** | Lista de modelos, controles de posición y perfiles por juego |
| **1.2** | Legion Go S, colores, tamaño y nuevos modelos |

Las notas completas están en [Releases](https://github.com/Pedrocarletti/crosshair-plugin/releases).

## Contribuir

Envía errores o ideas en [Issues](https://github.com/Pedrocarletti/crosshair-plugin/issues). Incluye el dispositivo, la resolución, la versión del plugin, una captura del panel (o del diagnóstico del atajo para problemas con botones) y las últimas líneas de `~/homebrew/logs/Crosshair/`.

| Archivo | Función |
|---|---|
| `main.py` | Configuración, posición, MangoHud y lectura del mando |
| `src/index.tsx` | Punto de entrada del plugin |
| `src/Content.tsx` | Panel principal |
| `src/components.tsx` | Componentes compartidos del panel |
| `src/hotkey.ts` | Atajos desde la interfaz |
| `src/i18n.tsx` | Traducciones PT/EN/ES |
| `src/SettingsTabs.tsx` | Pestañas y navegación L1/R1 |
| `src/api.ts` | Llamadas al backend y tipos compartidos |
| `src/utils.ts` | Colores, tamaños y utilidades |
| `src/styles.ts` | CSS del panel |
| `tests/` | Regresiones de la interfaz y de la lectura del mando |
| `plugin.json`, `package.json` | Identidad y versión del plugin |
| `.github/workflows/build.yml` | Compilación y publicación automáticas |
| `RELEASE_NOTES.md` | Descripción de la versión |

Para compilar: `pnpm install` y después `pnpm build`. Ejecuta `pnpm typecheck`, `pnpm test` y `pnpm test:backend` (Python 3.7+). Las pruebas simulan eventos; comprueba también Select + A/B/X/Y, Select + RT, QAM abierto/cerrado y L1/R1 en el dispositivo.

## Créditos

| Proyecto | Autor | Contribución |
|---|---|---|
| [crosshair-plugin](https://github.com/xXJSONDeruloXx/crosshair-plugin) | [@xXJSONDeruloXx](https://github.com/xXJSONDeruloXx) | Proyecto original |
| [Steamcord](https://github.com/Necrosiak/Steamcord) | [Necrosiak](https://github.com/Necrosiak) | Referencia de lectura del mando (BSD-3-Clause) |
| [MAKO](https://github.com/eugeniosegala/MAKO) | [Eugenio Segala](https://github.com/eugeniosegala) | Referencia visual de los paneles y las pestañas |

Gracias a la comunidad de **Decky Loader** por su apoyo y sus herramientas para dispositivos portátiles.

## Licencia

Distribuido bajo la licencia **BSD 3-Clause**. Consulta [LICENSE](LICENSE).
