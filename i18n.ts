export type Language = "pt-BR" | "en" | "es";
export const LANGUAGES: { data: Language; label: string }[] = [
  { data: "pt-BR", label: "Português (Brasil)" },
  { data: "en", label: "English" },
  { data: "es", label: "Español" },
];
const STRINGS: Record<Language, Record<string, string>> = {
  "pt-BR": {},
  en: {
    "Crosshair": "Crosshair", "Appearance": "Appearance", "Display & position": "Display & position",
    "Button shortcut": "Button shortcut", "Game profile": "Game profile",
    "Show crosshair": "Show crosshair", "Model": "Shape", "Screen resolution": "Screen resolution",
    "Horizontal (X)": "Horizontal (X)", "Vertical (Y)": "Vertical (Y)", "Size": "Size",
    "Record combination": "Record combination", "Record another combination": "Record another combination",
    "Cancel recording": "Cancel recording", "Remove combination": "Remove combination",
    "Hold duration": "Hold duration", "Language": "Language", "Settings": "Settings",
    "Created by Havok": "Created by Havok",
  },
  es: {
    "Crosshair": "Mira", "Appearance": "Apariencia", "Display & position": "Pantalla y posición",
    "Button shortcut": "Atajo de botones", "Game profile": "Perfil del juego",
    "Show crosshair": "Mostrar mira", "Model": "Modelo", "Screen resolution": "Resolución de pantalla",
    "Horizontal (X)": "Horizontal (X)", "Vertical (Y)": "Vertical (Y)", "Size": "Tamaño",
    "Record combination": "Grabar combinación", "Record another combination": "Grabar otra combinación",
    "Cancel recording": "Cancelar grabación", "Remove combination": "Eliminar combinación",
    "Hold duration": "Tiempo de pulsación", "Language": "Idioma", "Settings": "Ajustes",
    "Created by Havok": "Creado por Havok",
  },
};
export function translate(language: Language, text: string): string {
  return STRINGS[language]?.[text] ?? text;
}
