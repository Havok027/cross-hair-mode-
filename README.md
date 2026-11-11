<h1 align="center">🎯 Crosshair Plugin</h1>

<p align="center">
  <b>Uma mira personalizável para o Decky Loader, feita para Steam Deck, Legion Go e outros portáteis.</b>
</p>

<p align="center">
  <a href="https://github.com/Havok027/crosshair-plugin/releases/latest"><img src="https://img.shields.io/github/v/release/Havok027/crosshair-plugin?label=vers%C3%A3o&color=2ea44f&style=for-the-badge" alt="Versão" /></a>
  <a href="https://github.com/Havok027/crosshair-plugin/releases"><img src="https://img.shields.io/github/downloads/Havok027/crosshair-plugin/total?label=downloads&color=1a9fff&style=for-the-badge" alt="Downloads" /></a>
  <a href="https://decky.xyz"><img src="https://img.shields.io/badge/Decky%20Loader-plugin-9b5cff?style=for-the-badge" alt="Decky Loader" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/licen%C3%A7a-BSD--3-ff007b?style=for-the-badge" alt="Licença" /></a>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/2a8a1378-ad2d-41a8-b484-789cc49682d4" alt="Interface do Crosshair Plugin" width="100%" />
</p>

<p align="center">
  <a href="https://github.com/Havok027/crosshair-plugin/releases/latest/download/Crosshair.zip">📦 Baixar</a> ·
  <a href="#-como-usar">🚀 Como usar</a> ·
  <a href="#-atalho-de-botões">🎮 Atalho</a> ·
  <a href="#-solução-de-problemas">🩺 Problemas</a> ·
  <a href="#-roadmap">📍 Roadmap</a>
</p>

---

## 📑 Índice

[✨ Destaques](#-destaques) · [📦 Instalação](#-instalação) · [🚀 Como usar](#-como-usar) · [🎮 Atalho de botões](#-atalho-de-botões) · [🎨 Modelos e cores](#-modelos-e-cores) · [📺 Resoluções](#-resoluções) · [🔧 Como funciona](#-como-funciona) · [🩺 Solução de problemas](#-solução-de-problemas) · [📍 Roadmap](#-roadmap) · [📜 Histórico](#-histórico-de-versões) · [🤝 Contribuindo](#-contribuindo) · [💡 Créditos](#-créditos)

---

## ✨ Destaques

| Recurso | O que faz |
|---|---|
| 🎯 **7 modelos de mira** | Caixa, Ponto, Anel, X, Estrela, Colchetes e Traços, escolhidos em uma lista |
| 🎨 **Cores e tamanho** | 8 cores prontas, RGB personalizado e escala de 50% a 300% |
| 📐 **Escala pelo centro** | A mira cresce a partir do centro, sem sair do lugar (com calibração opcional) |
| 🕹️ **Atalho de botões** | Grave 2 botões do controle e ligue ou desligue a mira sem abrir o menu |
| 🕶️ **Perfil por jogo** | Modelo, cor, tamanho e posição salvos para cada jogo, aplicados ao abrir |
| ♻️ **MangoHud preservado** | Ao desligar a mira, o overlay de desempenho de antes volta |
| 🧭 **Ajuste fino** | Sliders de posição X e Y (de -200 a +200), salvos por modelo |
| 📺 **Várias telas** | Steam Deck, Legion Go S, Legion Go, 1080p e 4K |
| 🔄 **Atualização fácil** | Releases automáticas e compatível com o Direct Updater |

---

## 📦 Instalação

1. Baixe o [`Crosshair.zip`](https://github.com/Havok027/crosshair-plugin/releases/latest/download/Crosshair.zip) na [página de Releases](https://github.com/Havok027/crosshair-plugin/releases).
2. No **Decky Loader**, abra as **Configurações** e ative o **Modo desenvolvedor**.
3. Em **Desenvolvedor**, escolha **Instalar plugin de ZIP** e selecione o `Crosshair.zip`.
4. Se o plugin não aparecer, reinicie o Decky ou o aparelho.

> [!TIP]
> **Atualizações:** depois da primeira instalação, o plugin é reconhecido pelo **Direct Updater**. Se ele não achar a origem, toque no **?** ao lado do Crosshair, escolha **Find source** e digite `Havok027/crosshair-plugin`.

---

## 🚀 Como usar

1. Abra o menu do **Decky Loader** e acesse o **Crosshair Plugin**.
2. Escolha a **resolução** da sua tela.
3. Escolha o **modelo**, a **cor** e o **tamanho**.
4. Ative **Mostrar crosshair**.
5. Se a mira não estiver no centro, use os sliders **Horizontal (X)** e **Vertical (Y)**.
6. *(Opcional)* Com um jogo aberto, toque em **Salvar perfil deste jogo**.

**O painel, seção por seção:**

| Seção | O que tem |
|---|---|
| **Crosshair** | Resumo do estado (ativo, modelo, tamanho, cor) e o interruptor *Mostrar crosshair* |
| **Aparência** | Modelo, cor (carrossel e slider ou RGB), atalhos de tamanho e slider de tamanho |
| **Tela e posição** | Resolução, sliders X e Y, zerar ajuste e *Calibrar escala* (avançado) |
| **Atalho de botões** | Gravar, remover, tempo segurando e diagnóstico |
| **Perfil do jogo** | Salvar, atualizar e excluir perfis, e aplicar ao abrir o jogo |

> [!NOTE]
> Na seção **Cor**, o slider troca a cor na hora com esquerda e direita, e a cor escolhida fica no centro do carrossel. Cima e baixo mudam de seção.

---

## 🎮 Atalho de botões

Ligue e desligue a mira com uma combinação de **2 botões do controle**, sem abrir o menu.

**Como gravar:**

1. Em **Atalho de botões**, toque em **Gravar combinação**.
2. Aperte os 2 botões **juntos** e solte (em até 12 segundos). Pode fazer com o menu aberto.
3. A mira pisca duas vezes quando a combinação é gravada.
4. Pronto: apertar os 2 botões liga ou desliga a mira.

O **tempo segurando** vai de 0 a 1000 ms. O padrão é 0 (instantâneo). Aumente para evitar disparos acidentais.

**Onde cada botão é lido:**

| Botões | Menu aberto | Em jogo |
|---|:---:|:---:|
| A, B, X, Y e direcional | ✅ | ✅ |
| L4, L5, R4, R5 (Steam Deck e Steam Controller) | ✅ | ✅ |
| LB, RB, LT, RT, Menu e View | ✅ | 🧪 em validação |
| L3, R3 e botões extras de outros controles | ✅ | ⚠️ depende do Steam |

> [!NOTE]
> **Como funciona:** a combinação é gravada pela interface do Steam. Fora do menu, o plugin lê o controle direto do sistema. Se a mesma apertada chegar pelos dois caminhos, ela conta uma vez só.

> [!TIP]
> **Diagnóstico:** o cartão do atalho mostra o **último grupo de botões lido em jogo**, com os nomes e os números. Aperte a combinação em jogo, abra o menu e confira se ela apareceu.

---

## 🎨 Modelos e cores

**Modelos de mira:**

| Modelo | Visual | Observação |
|---|:---:|---|
| Caixa | <code>&#124; + &#124;</code> | Moldura em volta do centro |
| Ponto | <code>+</code> | O clássico |
| Anel | <code>O</code> | Mira aberta |
| X | <code>x</code> | Discreta |
| Estrela | <code>*</code> | Marca pequena |
| Colchetes | <code>[ + ]</code> | Destaca o centro |
| Traços | <code>- + -</code> | Linhas dos lados |

**Cores prontas:**

| Cor | Código | Cor | Código |
|---|---|---|---|
| 🩷 Rosa | `#FF007B` | 🩵 Ciano | `#00E5FF` |
| 💚 Verde | `#00FF66` | 💜 Roxo | `#9B5CFF` |
| ❤️ Vermelho | `#FF2D2D` | 🧡 Laranja | `#FF8A00` |
| 💛 Amarelo | `#FFE600` | 🤍 Branco | `#FFFFFF` |

Além delas, dá para montar qualquer cor em **Cor personalizada (RGB)**.

---

## 📺 Resoluções

| Tela | Resolução |
|---|---|
| Steam Deck | 1280 x 800 |
| Legion Go S | 1920 x 1200 |
| Monitor externo 1080p | 1920 x 1080 |
| Legion Go | 2560 x 1600 |
| Monitor externo 4K | 3840 x 2160 |

> [!NOTE]
> Os modelos novos (Anel, X, Estrela, Colchetes e Traços) têm a centralização **estimada**. Se algum ficar um pouco fora do centro, ajuste com os sliders X e Y. O ajuste é salvo por modelo.

---

## 🔧 Como funciona

O plugin escreve uma configuração do **MangoHud** que desenha a mira como texto (`custom_text`), com a cor (`text_color`), o tamanho (`font_size`) e a posição (`offset_x` e `offset_y`).

| Etapa | O que acontece |
|---|---|
| **Ligar a mira** | O plugin guarda o MangoHud que existia e escreve a mira |
| **Desligar a mira** | O MangoHud de antes é devolvido, idêntico |
| **O Steam troca o arquivo** | Se você mudar o nível de desempenho, o plugin não sobrescreve |
| **Reiniciar o Decky** | A mira começa desligada e o overlay volta |
| **Mudar o tamanho** | A posição é recalculada para a mira crescer a partir do centro |

**Limitações:**

| Limitação | Detalhe |
|---|---|
| Overlay de desempenho | Não dá para usar junto com a mira, os dois usam o mesmo MangoHud |
| Outros plugins | Pode conflitar com plugins que também mexem no MangoHud (como o *MangoPeel*) |
| Perfil automático | Depende de o Steam avisar o plugin que o jogo abriu |
| Atalho em jogo | Depende do que o Steam entrega ao controle virtual do aparelho |

---

## 🩺 Solução de problemas

| Problema | Causa provável | O que fazer |
|---|---|---|
| A mira está fora do centro | Centralização estimada do modelo | Ajuste X e Y. Para os dois, use *Calibrar escala* |
| A mira se move ao mudar o tamanho | Margens internas do MangoHud | Em *Calibrar escala*, siga os 3 passos do cartão |
| O atalho não funciona fora do menu | O Steam não entregou os botões ao jogo | Veja o *último botão lido em jogo* no cartão e grave outra combinação (A, B, X, Y ou direcional) |
| O atalho não funciona nem com o menu | Combinação antiga ou tempo muito alto | Grave de novo e deixe o *tempo segurando* em 0 |
| O overlay de desempenho sumiu | A mira está ligada | Desligue a mira: o MangoHud volta |
| O perfil não aplica ao abrir o jogo | O Steam não avisou o plugin | Abra o plugin e confira *Aplicar perfil ao abrir o jogo* |
| Erro *Failed to fetch dynamically imported module* | Instalou o código-fonte, sem a pasta `dist` | Instale o `Crosshair.zip` da página de Releases |
| O Direct Updater diz *Origem não encontrada* | Instalação antiga | **?** > **Find source** > `Havok027/crosshair-plugin` |

Os logs do plugin ficam em `~/homebrew/logs/Crosshair/`.

---

## 📍 Roadmap

| Situação | Item | Detalhes |
|:---:|---|---|
| ✅ | Suporte à Legion Go S | Resolução 1920 x 1200 |
| ✅ | Cores, tamanho e novos modelos | RGB, escala de 50% a 300% e 7 modelos |
| ✅ | Perfil por jogo | Aplicado ao abrir o jogo |
| ✅ | Escala a partir do centro | Com calibração opcional por modelo |
| ✅ | Atalho de botões | Gravação pela interface e leitura em jogo |
| ✅ | MangoHud preservado | O overlay de antes volta ao desligar a mira |
| ✅ | Releases e Direct Updater | Compilação e publicação automáticas |
| 🔄 | Validar a leitura em jogo | LB, RB, LT, RT, Menu e View |
| 🧭 | L3, R3 e botões traseiros | Leitura em jogo dos controles que não são da Valve |
| 🧭 | Calibração automática | Centralizar cada modelo sem ajuste manual |
| 💡 | Opacidade e contorno | Mais legibilidade em cenas claras |
| 💡 | Resolução automática | Detectar a tela sem escolher na lista |
| 💡 | Mais modelos | Mira com braços e formatos novos |
| 💡 | Tradução em inglês | README e interface |
| 💡 | Loja do Decky | Publicar o plugin na loja oficial |

> [!NOTE]
> Legenda: ✅ concluído · 🔄 em andamento · 🧭 planejado · 💡 ideia. O roadmap é uma lista de intenções, sem datas.

---

## 📜 Histórico de versões

| Versão | Destaques |
|:---:|---|
| **1.7** | MangoHud de antes volta ao desligar a mira · leitura em jogo ampliada (LB, RB, LT, RT, Menu e View) · atalho funciona com o menu aberto · diagnóstico do último botão lido |
| **1.6** | Atalho refeito (gravação pela interface) · carrossel de cores com esquerda e direita · prévia removida |
| **1.5** | Primeira versão do atalho de botões · visual renovado |
| **1.4** | Escala a partir do centro · código em módulos e pastas · compatível com o Direct Updater |
| **1.3** | Modelo em lista suspensa · posição por sliders · perfil por jogo |
| **1.2** | Suporte à Legion Go S · cores, tamanho e novos modelos |

As notas completas de cada versão estão na página de [Releases](https://github.com/Havok027/crosshair-plugin/releases).

---

## 🤝 Contribuindo

Encontrou um problema ou tem uma ideia? Abra uma [issue](https://github.com/Havok027/crosshair-plugin/issues). Ajuda muito incluir:

- o aparelho e a resolução da tela;
- a versão do plugin;
- uma foto do painel, ou do cartão do atalho no caso de problemas com os botões;
- as últimas linhas do log em `~/homebrew/logs/Crosshair/`.

<details>
<summary><b>📂 Estrutura do projeto</b></summary>

<br>

| Arquivo | Função |
|---|---|
| `main.py` | Backend em Python: configurações, posição, MangoHud e leitura do controle |
| `src/index.tsx` | Ponto de entrada do plugin |
| `src/Content.tsx` | O painel |
| `src/components.tsx` | Peças visuais do painel |
| `src/hotkey.ts` | Atalho de botões (lado da interface) |
| `src/api.ts` | Tipos e chamadas ao backend |
| `src/utils.ts` | Cores, tamanhos e funções auxiliares |
| `src/styles.ts` | CSS do painel |
| `plugin.json` e `package.json` | Identidade, versão e repositório |
| `.github/workflows/build.yml` | Compila e publica a release |
| `RELEASE_NOTES.md` | Texto da release |

Para compilar localmente: `pnpm install` e depois `pnpm build`.

</details>

---

## 💡 Créditos

| Projeto | Autor | Contribuição |
|---|---|---|
| [crosshair-plugin](https://github.com/xXJSONDeruloXx/crosshair-plugin) | [@xXJSONDeruloXx](https://github.com/xXJSONDeruloXx) | Projeto de origem, base deste plugin |
| [Steamcord](https://github.com/Necrosiak/Steamcord) | [Necrosiak](https://github.com/Necrosiak) | Leitura dos botões do controle (BSD-3-Clause) |

Agradecimentos à comunidade do **Decky Loader** pelo suporte e pelas ferramentas para portáteis.

---

## 📄 Licença

Distribuído sob a licença **BSD 3-Clause**. Veja o arquivo [LICENSE](LICENSE).
