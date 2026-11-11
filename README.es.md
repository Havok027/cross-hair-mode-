<h1 align="center">🎯 Crosshair Plugin</h1>

<p align="center"><b>Una mira personalizable para Decky Loader, diseñada para Steam Deck, Legion Go y otros PC portátiles.</b></p>

<p align="center">
  <a href="https://github.com/Havok027/crosshair-plugin/releases/latest"><img src="https://img.shields.io/github/v/release/Havok027/crosshair-plugin?label=versi%C3%B3n&color=2ea44f&style=for-the-badge" alt="Versión" /></a>
  <a href="https://github.com/Havok027/crosshair-plugin/releases"><img src="https://img.shields.io/github/downloads/Havok027/crosshair-plugin/total?label=descargas&color=1a9fff&style=for-the-badge" alt="Descargas" /></a>
  <a href="https://decky.xyz"><img src="https://img.shields.io/badge/Decky%20Loader-plugin-9b5cff?style=for-the-badge" alt="Decky Loader" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/licencia-BSD--3-ff007b?style=for-the-badge" alt="Licencia" /></a>
</p>

<p align="center">🇧🇷 <a href="README.md">Português</a> · 🇺🇸 <a href="README.en.md">English</a> · 🇪🇸 <a href="README.es.md">Español</a></p>

<p align="center"><img src="https://github.com/user-attachments/assets/2a8a1378-ad2d-41a8-b484-789cc49682d4" alt="Interfaz del Crosshair Plugin" width="100%" /></p>

<p align="center"><a href="https://github.com/Havok027/crosshair-plugin/releases/latest/download/Crosshair.zip">📦 Descargar</a> · <a href="#-cómo-usar">🚀 Cómo usar</a> · <a href="#-atajo-de-botones-del-control">🎮 Atajo</a> · <a href="#-solución-de-problemas">🩺 Problemas</a> · <a href="#-hoja-de-ruta">📍 Hoja de ruta</a></p>

---

## 📑 Índice

[✨ Características](#-características) · [📦 Instalación](#-instalación) · [🚀 Cómo usar](#-cómo-usar) · [🎮 Atajo de botones del control](#-atajo-de-botones-del-control) · [🎨 Modelos y colores](#-modelos-y-colores) · [📺 Resoluciones](#-resoluciones) · [🔧 Funcionamiento](#-funcionamiento) · [🩺 Solución de problemas](#-solución-de-problemas) · [📍 Hoja de ruta](#-hoja-de-ruta) · [📜 Historial](#-historial-de-versiones) · [🤝 Contribuir](#-contribuir) · [💡 Créditos](#-créditos)

## ✨ Características

| Función | Descripción |
|---|---|
| 🎯 **7 modelos de mira** | Caja, Punto, Anillo, X, Estrella, Corchetes y Líneas, seleccionables en una lista |
| 🎨 **Colores y tamaño** | 8 colores predefinidos, RGB personalizado y escala del 50% al 300% |
| 📐 **Escala desde el centro** | La mira crece desde el centro sin desplazarse (calibración opcional) |
| 🕹️ **Atajo de botones** | Graba 2 botones del control para activar o desactivar la mira sin abrir el menú |
| 🕶️ **Perfil por juego** | Modelo, color, tamaño y posición guardados para cada juego y aplicados al iniciarlo |
| ♻️ **MangoHud preservado** | Al desactivar la mira, se restaura la superposición de rendimiento anterior |
| 🧭 **Ajuste preciso** | Controles X e Y (de -200 a +200), guardados por modelo |
| 📺 **Varias pantallas** | Steam Deck, Legion Go S, Legion Go, 1080p y 4K |
| 🔄 **Actualización sencilla** | Releases automáticas y compatibilidad con Direct Updater |

## 📦 Instalación

1. Descarga [`Crosshair.zip`](https://github.com/Havok027/crosshair-plugin/releases/latest/download/Crosshair.zip) desde la [página de Releases](https://github.com/Havok027/crosshair-plugin/releases).
2. En **Decky Loader**, abre **Configuración** y activa el **Modo desarrollador**.
3. En **Desarrollador**, selecciona **Instalar plugin desde ZIP** y elige `Crosshair.zip`.
4. Si el plugin no aparece, reinicia Decky o el dispositivo.

> [!TIP]
> **Actualizaciones:** después de la primera instalación, el plugin será reconocido por **Direct Updater**. Si no encuentra el origen, pulsa **?** junto a Crosshair, elige **Find source** e introduce `Havok027/crosshair-plugin`.

## 🚀 Cómo usar

1. Abre el menú de **Decky Loader** y accede a **Crosshair Plugin**.
2. Elige la **resolución** de la pantalla.
3. Elige el **modelo**, el **color** y el **tamaño**.
4. Activa **Mostrar mira**.
5. Si la mira no está centrada, usa los controles **Horizontal (X)** y **Vertical (Y)**.
6. *(Opcional)* Con un juego abierto, selecciona **Guardar perfil de este juego**.

**Secciones del panel:**

| Sección | Contenido |
|---|---|
| **Crosshair** | Resumen del estado (activo, modelo, tamaño, color) e interruptor *Mostrar mira* |
| **Apariencia** | Modelo, color (carrusel y control deslizante o RGB), accesos rápidos de tamaño y control de tamaño |
| **Pantalla y posición** | Resolución, controles X e Y, restablecer ajuste y *Calibrar escala* (avanzado) |
| **Atajo de botones** | Grabar, eliminar, duración de pulsación y diagnóstico |
| **Perfil del juego** | Guardar, actualizar y eliminar perfiles, y aplicarlos al iniciar el juego |

> [!NOTE]
> En la sección **Color**, el control deslizante cambia el color al instante con izquierda y derecha, y el color elegido permanece en el centro del carrusel. Arriba y abajo cambian de sección.

## 🎮 Atajo de botones del control

Activa o desactiva la mira con una combinación de **2 botones del control**, sin abrir el menú.

**Cómo grabar:**

1. En **Atajo de botones**, pulsa **Grabar combinación**.
2. Pulsa los 2 botones **a la vez** y suéltalos (en un máximo de 12 segundos). Puedes hacerlo con el menú abierto.
3. La mira parpadea dos veces cuando se graba la combinación.
4. Al pulsar ambos botones de nuevo, la mira cambia de estado.

La **duración de pulsación** va de 0 a 1000 ms. El valor predeterminado es 0 (instantáneo). Auméntalo para evitar activaciones accidentales.

**Dónde se detecta cada botón:**

| Botones | Menú abierto | En el juego |
|---|:---:|:---:|
| A, B, X, Y y cruceta | ✅ | ✅ |
| L4, L5, R4, R5 (Steam Deck y Steam Controller) | ✅ | ✅ |
| LB, RB, LT, RT, Menu y View | ✅ | 🧪 en validación |
| L3, R3 y botones adicionales de otros controles | ✅ | ⚠️ depende de Steam |

> [!NOTE]
> **Cómo funciona:** la combinación se graba mediante la interfaz de Steam. Fuera del menú, el plugin lee el control directamente del sistema. Si la misma pulsación llega por ambas vías, solo se cuenta una vez.

> [!TIP]
> **Diagnóstico:** la tarjeta del atajo muestra el **último grupo de botones detectado en el juego**, con sus nombres y números. Pulsa la combinación durante el juego, abre el menú y comprueba si aparece.

## 🎨 Modelos y colores

**Modelos de mira:**

| Modelo | Vista | Descripción |
|---|:---:|---|
| Caja | <code>&#124; + &#124;</code> | Marco alrededor del centro |
| Punto | <code>+</code> | El clásico |
| Anillo | <code>O</code> | Mira circular abierta |
| X | <code>x</code> | Discreta |
| Estrella | <code>*</code> | Marca pequeña |
| Corchetes | <code>[ + ]</code> | Resalta el centro |
| Líneas | <code>- + -</code> | Líneas laterales |

**Colores predefinidos:**

| Color | Código | Color | Código |
|---|---|---|---|
| 🩷 Rosa | `#FF007B` | 🩵 Cian | `#00E5FF` |
| 💚 Verde | `#00FF66` | 💜 Morado | `#9B5CFF` |
| ❤️ Rojo | `#FF2D2D` | 🧡 Naranja | `#FF8A00` |
| 💛 Amarillo | `#FFE600` | 🤍 Blanco | `#FFFFFF` |

También puedes crear cualquier color en **Color personalizado (RGB)**.

## 📺 Resoluciones

| Pantalla | Resolución |
|---|---|
| Steam Deck | 1280 x 800 |
| Legion Go S | 1920 x 1200 |
| Monitor externo 1080p | 1920 x 1080 |
| Legion Go | 2560 x 1600 |
| Monitor externo 4K | 3840 x 2160 |

> [!NOTE]
> Los modelos nuevos (Anillo, X, Estrella, Corchetes y Líneas) tienen un centrado **estimado**. Si alguno queda ligeramente descentrado, ajústalo con los controles X e Y. El ajuste se guarda por modelo.

## 🔧 Funcionamiento

El plugin escribe una configuración de **MangoHud** que dibuja la mira como texto (`custom_text`), con su color (`text_color`), tamaño (`font_size`) y posición (`offset_x` y `offset_y`).

| Paso | Qué ocurre |
|---|---|
| **Activar la mira** | El plugin guarda la configuración MangoHud existente y escribe la mira |
| **Desactivar la mira** | Se restaura exactamente la configuración MangoHud anterior |
| **Steam cambia el archivo** | Si cambias el nivel de rendimiento, el plugin no sobrescribe los cambios de Steam |
| **Reiniciar Decky** | La mira comienza desactivada y se restaura la superposición |
| **Cambiar el tamaño** | La posición se recalcula para que la mira crezca desde el centro |

**Limitaciones:**

| Limitación | Detalle |
|---|---|
| Superposición de rendimiento | No se puede usar junto con la mira; ambos utilizan la misma configuración de MangoHud |
| Otros plugins | Puede haber conflictos con plugins que también modifican MangoHud (como *MangoPeel*) |
| Perfil automático | Depende de que Steam avise al plugin cuando se inicia el juego |
| Atajo durante el juego | Depende de las entradas del control que Steam envíe al control virtual del dispositivo |

## 🩺 Solución de problemas

| Problema | Causa probable | Qué hacer |
|---|---|---|
| La mira está descentrada | Centrado estimado del modelo | Ajusta X e Y. Para ambos ejes, usa *Calibrar escala* |
| La mira se mueve al cambiar el tamaño | Márgenes internos de MangoHud | Sigue los 3 pasos de la tarjeta *Calibrar escala* |
| El atajo no funciona fuera del menú | Steam no envió los botones al juego | Consulta *último botón detectado en el juego* y graba otra combinación (A, B, X, Y o cruceta) |
| El atajo tampoco funciona en el menú | Combinación antigua o duración demasiado alta | Graba de nuevo y deja la *duración de pulsación* en 0 |
| Desapareció la superposición de rendimiento | La mira está activada | Desactiva la mira para restaurar MangoHud |
| El perfil no se aplica al iniciar el juego | Steam no avisó al plugin | Abre el plugin y comprueba *Aplicar perfil al iniciar el juego* |
| Error *Failed to fetch dynamically imported module* | Se instaló el código fuente sin la carpeta `dist` | Instala `Crosshair.zip` desde la página de Releases |
| Direct Updater muestra *Source not found* | Instalación antigua | **?** > **Find source** > `Havok027/crosshair-plugin` |

Los registros del plugin están en `~/homebrew/logs/Crosshair/`.

## 📍 Hoja de ruta

| Estado | Elemento | Detalles |
|:---:|---|---|
| ✅ | Compatibilidad con Legion Go S | Resolución 1920 x 1200 |
| ✅ | Colores, tamaño y nuevos modelos | RGB, escala del 50% al 300% y 7 modelos |
| ✅ | Perfil por juego | Se aplica al iniciar el juego |
| ✅ | Escala desde el centro | Con calibración opcional por modelo |
| ✅ | Atajo de botones | Grabación desde la interfaz y lectura durante el juego |
| ✅ | MangoHud preservado | La superposición anterior vuelve al desactivar la mira |
| ✅ | Releases y Direct Updater | Compilación y publicación automáticas |
| 🔄 | Validar lectura durante el juego | LB, RB, LT, RT, Menu y View |
| 🧭 | L3, R3 y botones traseros | Lectura durante el juego en controles que no son de Valve |
| 🧭 | Calibración automática | Centrar cada modelo sin ajustes manuales |
| 💡 | Opacidad y contorno | Mejor visibilidad en escenas claras |
| 💡 | Resolución automática | Detectar la pantalla sin elegirla en una lista |
| 💡 | Más modelos | Nuevos brazos y diseños de mira |
| 💡 | Traducción al inglés | README e interfaz |
| 💡 | Tienda de Decky | Publicar el plugin en la tienda oficial |

> [!NOTE]
> Leyenda: ✅ completado · 🔄 en curso · 🧭 planificado · 💡 idea. La hoja de ruta recoge intenciones, sin fechas.

## 📜 Historial de versiones

| Versión | Novedades |
|:---:|---|
| **1.7** | Se restaura MangoHud al desactivar la mira · lectura ampliada durante el juego (LB, RB, LT, RT, Menu y View) · atajo disponible con el menú abierto · diagnóstico del último botón detectado |
| **1.6** | Atajo rediseñado (grabación desde la interfaz) · carrusel de colores con izquierda y derecha · vista previa eliminada |
| **1.5** | Primera versión del atajo de botones · interfaz renovada |
| **1.4** | Escala desde el centro · código modular y carpetas · compatibilidad con Direct Updater |
| **1.3** | Selector desplegable de modelos · controles de posición · perfil por juego |
| **1.2** | Compatibilidad con Legion Go S · colores, tamaño y nuevos modelos |

Las notas completas están en la página de [Releases](https://github.com/Havok027/crosshair-plugin/releases).

## 🤝 Contribuir

¿Encontraste un problema o tienes una idea? Abre una [issue](https://github.com/Havok027/crosshair-plugin/issues). Es útil incluir:

- el dispositivo y la resolución de pantalla;
- la versión del plugin;
- una foto del panel o de la tarjeta del atajo si hay problemas con los botones;
- las últimas líneas del registro en `~/homebrew/logs/Crosshair/`.

<details>
<summary><b>📂 Estructura del proyecto</b></summary>

| Archivo | Función |
|---|---|
| `main.py` | Backend Python: ajustes, posición, MangoHud y lectura del control |
| `src/index.tsx` | Punto de entrada del plugin |
| `src/Content.tsx` | Panel principal |
| `src/components.tsx` | Componentes visuales del panel |
| `src/hotkey.ts` | Atajo de botones (interfaz) |
| `src/api.ts` | Tipos y llamadas al backend |
| `src/utils.ts` | Colores, tamaños y funciones auxiliares |
| `src/styles.ts` | CSS del panel |
| `plugin.json` y `package.json` | Identidad, versión y repositorio |
| `.github/workflows/build.yml` | Compila y publica la release |
| `RELEASE_NOTES.md` | Descripción de la release |

Para compilar localmente: `pnpm install` y después `pnpm build`.
</details>

## 💡 Créditos

| Proyecto | Autor | Contribución |
|---|---|---|
| [crosshair-plugin](https://github.com/xXJSONDeruloXx/crosshair-plugin) | [@xXJSONDeruloXx](https://github.com/xXJSONDeruloXx) | Proyecto original y base de este plugin |
| [Steamcord](https://github.com/Necrosiak/Steamcord) | [Necrosiak](https://github.com/Necrosiak) | Lectura de botones del control (BSD-3-Clause) |

Gracias a la comunidad de **Decky Loader** por su apoyo y por las herramientas para dispositivos portátiles.

## 📄 Licencia

Distribuido bajo la licencia **BSD 3-Clause**. Consulta el archivo [LICENSE](LICENSE).
