# 🎯 Crosshair Plugin para Decky Loader

[![Baixar Release](https://img.shields.io/badge/Baixar-Release-2ea44f)](https://github.com/Havok027/cross-hair-mode-/releases)

Plugin para **Decky Loader** (Steam Deck, Legion Go e outros portáteis) que desenha uma mira (crosshair) personalizada na tela utilizando a infraestrutura do **MangoHud**.

> 📦 **Download:** acesse a [Página de Releases](https://github.com/Havok027/cross-hair-mode-/releases) ou baixe direto a versão mais recente: [Crosshair.zip](https://github.com/Havok027/cross-hair-mode-/releases/latest/download/Crosshair.zip).

---

## 📸 Recursos Principais

- **Visualização em Tempo Real:** prévia instantânea da mira na interface de configuração.
- **Interface para Gamepad:** projetada para ser usada com o controle, no modo Gaming.
- **Perfis por Jogo:** salve configurações (modelo, cor, tamanho e posição) exclusivas para cada jogo. O perfil é carregado automaticamente ao iniciar a partida (opção configurável).
- **Ajuste Fino de Posição:** sliders de offset X e Y (de -200 a +200) com botão de reset rápido. O ajuste fica salvo por modelo.
- **Cores e Tamanhos:** 8 cores pré-definidas, seletor de RGB personalizado e escala de 50% a 300%.
- **Múltiplos Modelos:** Caixa, Ponto, Anel, X, Estrela, Colchetes e Traços.
- **Suporte a Resoluções:** Steam Deck, Legion Go S (1920x1200), Legion Go (2560x1600), 1080p e 4K.

---

## 📥 Instalação

1. Baixe o `Crosshair.zip` na [Página de Releases](https://github.com/Havok027/cross-hair-mode-/releases).
2. No **Decky Loader**, abra as **Configurações** e ative o **Modo desenvolvedor**.
3. Em **Desenvolvedor**, escolha **Instalar plugin de ZIP** e selecione o `Crosshair.zip`.
4. Se o plugin não aparecer, reinicie o Decky ou o aparelho.

---

## 🚀 Como Usar

1. Abra o menu do **Decky Loader** no seu portátil.
2. Acesse o **Crosshair Plugin**.
3. Selecione a **Resolução** nativa da sua tela.
4. Escolha o **Modelo**, a **Cor** e o **Tamanho** desejados.
5. Ative a opção **Mostrar crosshair**.
6. *(Opcional)* Caso a mira precise de centralização, utilize os sliders **Horizontal (X)** e **Vertical (Y)**.
7. *(Opcional)* Com um jogo aberto, toque em **Salvar perfil deste jogo**. Dali em diante, essas configurações são aplicadas sempre que o jogo for executado.

---

## 🛠️ Como Funciona & Limitações

- **Infraestrutura:** o plugin gera dinamicamente uma configuração para o MangoHud, renderizando a mira via texto personalizado (`custom_text`), aplicando a cor (`text_color`), o tamanho da fonte (`font_size`) e o deslocamento (`offset_x`, `offset_y`).
- **Cálculo de Posição:** o ponto central é calculado com base na resolução selecionada, compensando as dimensões do caractere. Os modelos adicionais têm centralização estimada e podem exigir um pequeno ajuste manual.
- **Perfil Automático:** a aplicação ao abrir o jogo depende de o Steam avisar o plugin que o jogo iniciou. Se em algum jogo o perfil não for aplicado sozinho, abra o plugin e verifique as configurações.
- ⚠️ **Incompatibilidades Conhecidas:**
  - Pode conflitar com outras modificações manuais do MangoHud ou com plugins semelhantes (como o *MangoPeel*).
  - **Não é possível** utilizar o overlay de desempenho padrão do SteamOS/MangoHud simultaneamente com o crosshair. Para voltar o overlay, mude o nível de desempenho no menu rápido e ligue o crosshair de novo no plugin.
- **Reinício do Decky:** o crosshair sempre começa desligado quando o Decky reinicia. Basta ativar **Mostrar crosshair** de novo.

---

## 🧩 Adicionar um Modelo ou uma Tela

Tudo fica no começo do arquivo `main.py`:

- `MODELS`: três linhas de texto (o símbolo na linha do meio) e `half_w`, a metade da largura do símbolo em px.
- `RESOLUTIONS`: nome, largura e altura.

A interface lê as duas listas do backend, então não é preciso mexer no TypeScript.

---

## 📦 Release e Compilação

A cada atualização no branch `main`, o **GitHub Actions** compila o plugin e publica o `Crosshair.zip` na página de Releases (versão `latest`).

- A mensagem da release vem do arquivo `RELEASE_NOTES.md`. Para mudar o texto, edite esse arquivo antes de enviar a atualização.
- O título da release usa a versão do `package.json`.
- Para compilar manualmente: `pnpm install` e depois `pnpm build`.

---

## 📜 Histórico de Versões

### 🟠 Versão 1.4.0
- A mira cresce a partir do centro, sem mudar de posição ao alterar o tamanho (com calibração opcional por modelo).
- Interface renovada, com prévia com guias de centro e atalhos de tamanho.
- Código organizado em módulos e pastas, com arrumação automática do repositório.
- 
### 🟣 Versão 1.3.1
- Removidos os botões de direção (Cima, Esquerda, Direita e Baixo); a posição agora é ajustada apenas pelos sliders.
- A mensagem da release passa a vir do arquivo `RELEASE_NOTES.md`.

### 🟢 Versão 1.3.0
- Seleção de **Modelo via lista suspensa** (dropdown).
- **Posição por sliders** (X e Y de -200 a 200) com botão de zerar.
- **Sistema de Perfis por Jogo** com detecção e aplicação automática.
- Interface reformulada com preview em tempo real.

### 🔵 Versão 1.2.0
- Adicionado suporte à **Legion Go S** (1920x1200), além do Steam Deck, Legion Go, 1080p e 4K.
- Nova interface navegável por controle e seletor de cores.
- **Ajuste de Cores:** 8 predefinições + RGB customizado.
- **Ajuste de Tamanho:** escala de 50% a 300%.
- **Novos Modelos:** Anel, X, Estrela, Colchetes e Traços.
- Persistência de configurações entre sessões e por modelo.

---

## 💡 Créditos e Agradecimentos

Este projeto foi desenvolvido utilizando como base o trabalho original de **[xXJSONDeruloXx](https://github.com/xXJSONDeruloXx)**.

- **Projeto de Origem:** [crosshair-plugin](https://github.com/xXJSONDeruloXx/crosshair-plugin) por [@xXJSONDeruloXx](https://github.com/xXJSONDeruloXx).

Agradecimentos à comunidade do Decky Loader pelo suporte e desenvolvimento de ferramentas para portáteis!
