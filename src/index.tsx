import { definePlugin } from "@decky/api";
import { staticClasses } from "@decky/ui";
import { FaCrosshairs } from "react-icons/fa";
import { gameStarted } from "./api";
import { Content } from "./Content";

export default definePlugin(() => {
  // Ao abrir um jogo, aplica o perfil salvo dele (se houver)
  let unregister: { unregister?: () => void } | undefined;
  try {
    const steamClient = (window as unknown as { SteamClient?: any }).SteamClient;
    unregister = steamClient?.GameSessions?.RegisterForAppLifetimeNotifications?.(
      (update: { unAppID: number; bRunning: boolean }) => {
        if (update.bRunning) {
          gameStarted(String(update.unAppID)).catch((error) => console.error(error));
        }
      },
    );
  } catch (error) {
    console.error(error);
  }

  return {
    name: "Crosshair Plugin",
    titleView: <div className={staticClasses.Title}>Crosshair</div>,
    content: <Content />,
    icon: <FaCrosshairs />,
    onDismount() {
      try {
        unregister?.unregister?.();
      } catch (error) {
        console.error(error);
      }
    },
  };
});
