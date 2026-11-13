import { createContext, useContext } from "react";

export type Language = "pt" | "en" | "es";
export const LanguageContext = createContext<Language>("pt");

// Portuguese is the source language. Both translations are required per entry.
export const messages = {
  "Idioma": ["Language", "Idioma"],
  "Aparência": ["Appearance", "Apariencia"],
  "Tela": ["Display", "Pantalla"],
  "Atalho": ["Shortcut", "Atajo"],
  "Perfis": ["Profiles", "Perfiles"],
  "Config.": ["Settings", "Ajustes"],
  "Configurações": ["Settings", "Configuración"],
  "L1 / R1 · trocar guia": ["L1 / R1 · switch tabs", "L1 / R1 · cambiar pestaña"],
  "Criado por Havok": ["Created by Havok", "Creado por Havok"],
  "Carregando...": ["Loading...", "Cargando..."],
  "Falha ao carregar: ": ["Failed to load: ", "Error al cargar: "],
  "Falhou: ": ["Failed: ", "Error: "],
  "Falha ao aplicar: ": ["Failed to apply: ", "Error al aplicar: "],
  "Combinação gravada": ["Shortcut recorded", "Combinación grabada"],
  "Aperte exatamente 2 botões juntos. Tente de novo.": ["Press exactly 2 buttons together. Try again.", "Pulsa exactamente 2 botones a la vez. Inténtalo de nuevo."],
  "Tempo esgotado. Nenhuma combinação foi gravada.": ["Time expired. No shortcut was recorded.", "Se agotó el tiempo. No se grabó ninguna combinación."],
  "Mostrar crosshair": ["Show crosshair", "Mostrar mira"],
  "Substitui o overlay de desempenho (MangoHud).": ["Replaces the performance overlay (MangoHud).", "Sustituye la superposición de rendimiento (MangoHud)."],
  "Modelo": ["Style", "Modelo"],
  "Cor": ["Color", "Color"],
  "Cor personalizada (RGB)": ["Custom color (RGB)", "Color personalizado (RGB)"],
  "Vermelho": ["Red", "Rojo"],
  "Verde": ["Green", "Verde"],
  "Azul": ["Blue", "Azul"],
  "Rosa": ["Pink", "Rosa"],
  "Amarelo": ["Yellow", "Amarillo"],
  "Ciano": ["Cyan", "Cian"],
  "Roxo": ["Purple", "Morado"],
  "Laranja": ["Orange", "Naranja"],
  "Branco": ["White", "Blanco"],
  "Personalizada": ["Custom", "Personalizado"],
  "Tamanho": ["Size", "Tamaño"],
  "Tela e posição": ["Display and position", "Pantalla y posición"],
  "Resolução da tela": ["Display resolution", "Resolución de pantalla"],
  "Horizontal (X)": ["Horizontal (X)", "Horizontal (X)"],
  "Vertical (Y)": ["Vertical (Y)", "Vertical (Y)"],
  "Ajuste zerado": ["Position reset", "Posición restablecida"],
  "Zerar ajuste de posição": ["Reset position", "Restablecer posición"],
  "Calibrar escala (avançado)": ["Calibrate scaling (advanced)", "Calibrar escala (avanzado)"],
  "A mira cresce a partir do centro. Use só se ela se mover ao mudar o tamanho.": ["The crosshair scales from its center. Use this only if it moves when resized.", "La mira crece desde el centro. Úsalo solo si se mueve al cambiar el tamaño."],
  "Como calibrar": ["How to calibrate", "Cómo calibrar"],
  "calibration_steps": ["1) Set size to 100% and center the crosshair with Horizontal and Vertical. 2) Increase size to 300%. 3) If the crosshair moved, adjust compensation to center it again. Increase compensation if it moves up or left; decrease it if it moves down or right. Calibration applies to the current style.", "1) Ajusta el tamaño al 100% y centra la mira con Horizontal y Vertical. 2) Sube el tamaño al 300%. 3) Si la mira se movió, ajusta la compensación para centrarla. Auméntala si sube o va a la izquierda; redúcela si baja o va a la derecha. La calibración se aplica al modelo actual."],
  "Compensação horizontal": ["Horizontal compensation", "Compensación horizontal"],
  "Compensação vertical": ["Vertical compensation", "Compensación vertical"],
  "Compensação restaurada": ["Compensation restored", "Compensación restaurada"],
  "Restaurar compensação padrão": ["Restore default compensation", "Restaurar compensación predeterminada"],
  "Posição final:": ["Final position:", "Posición final:"],
  "Atalho de botões": ["Controller shortcut", "Atajo del mando"],
  "Ligar/desligar com 2 botões": ["Toggle with 2 buttons", "Activar/desactivar con 2 botones"],
  "Segure os 2 botões gravados para mostrar ou esconder a mira.": ["Press the 2 recorded buttons to show or hide the crosshair.", "Pulsa los 2 botones grabados para mostrar u ocultar la mira."],
  "Cancelar gravação": ["Cancel recording", "Cancelar grabación"],
  "Gravar outra combinação": ["Record another shortcut", "Grabar otra combinación"],
  "Gravar combinação": ["Record shortcut", "Grabar combinación"],
  "Combinação removida": ["Shortcut removed", "Combinación eliminada"],
  "Remover combinação": ["Remove shortcut", "Eliminar combinación"],
  "Tempo segurando": ["Hold duration", "Tiempo de pulsación"],
  "Perfil do jogo": ["Game profile", "Perfil del juego"],
  "Perfil salvo": ["Profile saved", "Perfil guardado"],
  "Sem perfil": ["No profile", "Sin perfil"],
  "profile_hint": ["Open this menu while a game is running to save its style, color, size and position.", "Abre este menú con un juego en ejecución para guardar su modelo, color, tamaño y posición."],
  "Perfil salvo para ": ["Profile saved for ", "Perfil guardado para "],
  "Atualizar perfil deste jogo": ["Update this game's profile", "Actualizar perfil de este juego"],
  "Salvar perfil deste jogo": ["Save this game's profile", "Guardar perfil de este juego"],
  "Perfil removido de ": ["Profile removed for ", "Perfil eliminado de "],
  "Excluir perfil deste jogo": ["Delete this game's profile", "Eliminar perfil de este juego"],
  "Aplicar perfil ao abrir o jogo": ["Apply profile when the game starts", "Aplicar perfil al iniciar el juego"],
  "Excluir perfil:": ["Delete profile:", "Eliminar perfil:"],
  "overlay_hint": ["The crosshair uses MangoHud's text overlay, so the performance overlay cannot be shown at the same time. Turn off the crosshair to restore your previous MangoHud overlay.", "La mira usa el texto de MangoHud, por lo que no se puede mostrar a la vez la superposición de rendimiento. Desactiva la mira para restaurar la superposición anterior."],
  "Ativo": ["On", "Activa"],
  "Desligado": ["Off", "Desactivada"],
  "reading_both": ["Reading through Steam UI and in game ({count} controller(s)).", "Lectura desde la interfaz de Steam y en el juego ({count} mando(s))."],
  "reading_unsupported": ["This shortcut works only while Steam's menu has focus. For in-game use, record A, B, X, Y, D-pad, LB, RB, LT, RT, Menu or View.", "Este atajo solo funciona con el menú de Steam en primer plano. Para usarlo en el juego, graba A, B, X, Y, cruceta, LB, RB, LT, RT, Menu o View."],
  "reading_search": ["Looking for controllers. Steam creates a virtual controller when a game starts.", "Buscando mandos. Steam crea un mando virtual al iniciar un juego."],
  "reading_missing": ["These buttons are not arriving through Steam's virtual controller. Check your Steam Input layout or record a different shortcut.", "Estos botones no llegan desde el mando virtual de Steam. Revisa la configuración de Steam Input o graba otro atajo."],
  "Gravando...": ["Recording...", "Grabando..."],
  "Aperte os 2 botões juntos e depois solte. Pode fazer com este menu aberto.": ["Press the 2 buttons together, then release them. You can keep this menu open.", "Pulsa los 2 botones a la vez y suéltalos. Puedes mantener este menú abierto."],
  "Combinação": ["Shortcut", "Combinación"],
  "empty_shortcut": ["No shortcut recorded. Select Record shortcut.", "No hay ninguna combinación grabada. Selecciona Grabar combinación."],
  "Último botão lido em jogo: ": ["Last buttons read in game: ", "Últimos botones leídos en el juego: "],
  "age_seconds": [", {count} s ago", ", hace {count} s"],
  "Nenhum botão lido em jogo ainda.": ["No buttons read in game yet.", "Aún no se han leído botones en el juego."],
  "permission_denied": ["No permission to read {count} controller(s).", "Sin permiso para leer {count} mando(s)."],
  "Caixa": ["Box", "Caja"],
  "Ponto (+)": ["Dot (+)", "Punto (+)"],
  "Anel (O)": ["Ring (O)", "Anillo (O)"],
  "X": ["X", "X"],
  "Estrela (*)": ["Star (*)", "Estrella (*)"],
  "Colchetes": ["Brackets", "Corchetes"],
  "Traços": ["Dashes", "Guiones"],
  "Monitor externo": ["External monitor", "Monitor externo"],
  "D-Cima": ["D-Up", "Cruceta arriba"],
  "D-Baixo": ["D-Down", "Cruceta abajo"],
  "D-Esquerda": ["D-Left", "Cruceta izquierda"],
  "D-Direita": ["D-Right", "Cruceta derecha"],
  "Guia": ["Guide", "Guía"],
} as const;

export type MessageKey = keyof typeof messages;
export type Translate = (key: MessageKey, values?: Record<string, string | number>) => string;

const portuguese: Partial<Record<MessageKey, string>> = {
  calibration_steps: "1) Deixe o tamanho em 100% e centralize a mira com Horizontal e Vertical. 2) Suba o tamanho para 300%. 3) Se a mira saiu do centro, ajuste a compensação até ela voltar. Se ao crescer ela sobe ou vai para a esquerda, aumente. Se desce ou vai para a direita, diminua. A calibração vale para o modelo atual.",
  profile_hint: "Abra este menu com um jogo rodando para salvar um perfil só para ele (modelo, cor, tamanho e posição).",
  overlay_hint: "O plugin usa o texto do MangoHud como mira, então não dá para ter o overlay de desempenho ao mesmo tempo. Desligue a mira para restaurar o MangoHud anterior.",
  reading_both: "Lendo pela interface do Steam e em jogo ({count} controle(s)).",
  reading_unsupported: "Esta combinação só funciona com o menu do Steam em foco. Para usar em jogo, grave outra com A, B, X, Y, direcional, LB, RB, LT, RT, Menu ou View.",
  reading_search: "Procurando controles para ler em jogo. O Steam cria o controle virtual quando um jogo abre.",
  reading_missing: "Estes botões não chegam pelo controle virtual do Steam. Confira o layout do Steam Input ou grave outra combinação.",
  empty_shortcut: "Nenhuma combinação gravada. Toque em Gravar combinação.",
  age_seconds: ", há {count} s",
  permission_denied: "Sem permissão para ler {count} controle(s).",
};

export function translator(language: Language): Translate {
  return (key, values) => {
    const value = language === "pt" ? portuguese[key] ?? key : messages[key][language === "en" ? 0 : 1];
    return value.replace(/\{(\w+)\}/g, (match, name: string) => String(values?.[name] ?? match));
  };
}

export function useTranslation(): Translate {
  return translator(useContext(LanguageContext));
}

export function modelLabel(id: string, t: Translate): string {
  const keys: Record<string, MessageKey> = {
    box: "Caixa", dot: "Ponto (+)", ring: "Anel (O)", x: "X", star: "Estrela (*)", bracket: "Colchetes", dash: "Traços",
  };
  return keys[id] ? t(keys[id]) : id;
}
