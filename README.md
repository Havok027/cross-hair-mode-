# 🎯 Crosshair Plugin para Decky Loader

[![Releases](https://img.shields.io/github/v/release/Havok027/cross-hair-mode-?label=Baixar%20Release)](https://github.com/Havok027/cross-hair-mode-/releases)

Plugin para **Decky Loader** (Steam Deck, Legion Go e outros portáteis) que desenha uma mira (crosshair) personalizada na tela utilizando a infraestrutura do **MangoHud**.

> 📦 **Download:** Acesse a [Página de Releases](https://github.com/Havok027/cross-hair-mode-/releases) para baixar a versão mais recente.

---

## 📸 Recursos Principais

- **Visualização em Tempo Real:** Prévia instantânea da mira na interface de configuração.
- **Navegação 100% por Controle:** Interface otimizada para o modo Gamepad.
- **Perfis por Jogo:** Salve configurações (modelo, cor, tamanho e posição) exclusivas para cada jogo. O perfil é carregado automaticamente ao iniciar a partida (opção configurável).
- **Ajuste Fino de Posição:** Sliders de offset X e Y (de -200 a +200) com botão de reset rápido. O ajuste fica salvo por modelo.
- **Cores e Tamanhos:** 8 cores pré-definidas, seletor de RGB personalizado e escala de 50% a 300%.
- **Múltiplos Modelos:** Caixa, Ponto, Anel, X, Estrela, Colchetes e Traços.
- **Suporte a Resoluções:** Steam Deck, Legion Go S (1920x1200), Legion Go (2560x1600), 1080p e 4K.

---

## 🚀 Como Usar

1. Abra o menu do **Decky Loader** no seu portátil.
2. Acesse o **Crosshair Plugin**.
3. Selecione a **Resolução** nativa da sua tela.
4. Escolha o **Modelo**, a **Cor** e o **Tamanho** desejados.
5. Ative a opção **Mostrar Crosshair**.
6. *(Opcional)* Caso a mira precise de centralização, utilize os sliders **Horizontal (X)** e **Vertical (Y)**.
7. *(Opcional)* Com um jogo aberto, ative a opção **Salvar perfil deste jogo** para aplicar automaticamente essas configurações sempre que o jogo for executado.

---

## 🛠️ Como Funciona & Limitações

- **Infraestrutura:** O plugin gera dinamicamente uma configuração para o MangoHud, renderizando a mira via texto personalizado (`custom_text`), aplicando a cor (`text_color`), o tamanho da fonte (`font_size`) e o deslocamento (`offset_x`, `offset_y`).
- **Cálculo de Posição:** O ponto central é calculado com base na resolução selecionada, compensando as dimensões do caractere. Os modelos adicionais têm centralização estimada e podem exigir um pequeno ajuste manual.
- ⚠️ **Incompatibilidades Conhecidas:** 
  - Pode conflitar com outras modificações manuais do MangoHud ou com plugins semelhantes (como o *MangoPeel*).
  - **Não é possível** utilizar o overlay de desempenho padrão do SteamOS/MangoHud simultaneamente com o crosshair.

---

## 📜 Histórico de Versões

### 🟢 Versão 1.3.0
- Seleção de **Modelo via lista suspensa** (dropdown).
- **Posição por sliders** (X e Y de -200 a 200) com botão de zerar.
- **Sistema de Perfis por Jogo** com detecção e aplicação automática.
- Interface totalmente reformulada com preview em tempo real.

### 🔵 Versão 1.2.0
- Adicionado suporte à **Legion Go S** (1920x1200), além do Steam Deck, Legion Go, 1080p e 4K.
- Nova interface navegável por controle com cartões de modelo e seletor de cores.
- **Ajuste de Cores:** 8 predefinições + RGB customizado.
- **Ajuste de Tamanho:** Escala de 50% a 300%.
- **Novos Modelos:** Anel, X, Estrela, Colchetes e Traços.
- Persistência de configurações entre sessões e por modelo.

---

## 💡 Créditos e Agradecimentos

Este projeto foi desenvolvido utilizando como base o trabalho original de **[xXJSONDeruloXx](https://github.com/xXJSONDeruloXx)**.

- **Projeto de Origem:** [crosshair-plugin](https://github.com/xXJSONDeruloXx/crosshair-plugin) por [@xXJSONDeruloXx](https://github.com/xXJSONDeruloXx).

Agradecimentos à comunidade do Decky Loader pelo suporte e desenvolvimento de ferramentas para portáteis!
