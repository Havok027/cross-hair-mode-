## Crosshair v1.8.0

### Novidades
- Interface em português, inglês e espanhol. Selecione o idioma no dropdown do topo; a preferência fica salva e independe dos perfis de jogo.
- Documentação em três idiomas, com links para alternar entre as versões do README.
- Interface inspirada no Mako, organizada em guias: Aparência, Tela, Atalho e Perfis.
- Navegação entre guias com L1/R1 ou toque, com a última guia salva. Durante a gravação do atalho, L1/R1 podem fazer parte da combinação e não mudam a guia.

### Correções
- Corrigida a perda de toques rápidos de A/B/X/Y quando os eventos de apertar e soltar chegam juntos, tanto pela interface do Steam quanto pela leitura em jogo. Isso inclui combinações como Select + X.
- Mantida a prevenção de acionamento duplicado quando a mesma combinação chega pela interface e pelo backend.
- Alterações pendentes são enviadas ao fechar o painel, evitando perder a última escolha de idioma ou ajuste.

### Validação
- Testes automatizados com eventos simulados de Select + A/B/X/Y, Select + RT, gravação, tempo segurando, acionamento único, idiomas e navegação L1/R1.
- O comportamento no aparelho ainda precisa ser validado dentro e fora do QAM, inclusive com o layout de Steam Input usado no jogo.

### Mantido
- O MangoHud de antes volta quando a mira é desligada.
- Leitura em jogo de A, B, X, Y, direcional, LB, RB, LT, RT, Menu e View.
- A mira cresce a partir do centro, com calibração opcional por modelo.
- Modelo em lista suspensa, cores com carrossel, tamanho, sliders de posição e perfil por jogo.
- Suporte à Legion Go S (1920x1200), Legion Go, Steam Deck, 1080p e 4K.

### Créditos
- Leitura dos botões do controle baseada no Steamcord, de Necrosiak (BSD-3-Clause).

### Como instalar
1. No Decky, ative o Modo desenvolvedor nas configurações.
2. Em Desenvolvedor, escolha "Instalar plugin de ZIP" e selecione o Crosshair.zip.
3. Reinicie o Decky, se o plugin não aparecer.
