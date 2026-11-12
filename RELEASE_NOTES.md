## Crosshair v1.7.2

### Novidades
- Interface em português, inglês e espanhol, com idioma salvo e independente dos perfis de jogo.
- Documentação nos três idiomas, com links para alternar entre os READMEs.
- Interface inspirada no Mako, organizada em Aparência, Tela, Atalho e Perfis, com navegação por L1/R1 ou toque.
- A última guia fica salva; durante a gravação, L1/R1 podem compor o atalho e não mudam de guia.

### Correções
- Preservados os eventos de apertar e soltar que chegam juntos, evitando perder toques rápidos de A/B/X/Y, inclusive Select + X.
- Suporte aos formatos de evento do Steam com campos alternativos e estados booleanos, numéricos ou textuais, sem interpretar "0" como botão apertado.
- Mantida a prevenção de acionamento duplicado entre a interface e o backend.
- Alterações pendentes são enviadas ao fechar o painel.

### Direct Updater
- Metadados e links de distribuição alinhados a `Havok027/crosshair-plugin`, com a versão definida em `package.json`, evitando divergências com `plugin.json`.
- Cada versão mantém seu ZIP original. Outro pacote exige aumentar a versão; a automação não substitui arquivos já publicados.
- O pacote passa pelo validador original do Direct Updater antes da publicação.
- Depois da publicação, a automação confere a seleção da release, a identidade e o SHA-256 do download pela API e pela página de arquivos do GitHub.

### Validação
- Testes automatizados de gravação, A/B/X/Y, Select + RT, estados dos botões, tempo segurando, idiomas, persistência e navegação L1/R1.
- O comportamento no aparelho ainda precisa ser validado dentro e fora do QAM com o layout de Steam Input usado no jogo.

### Mantido
- Restauração do MangoHud anterior ao desligar a mira.
- Sete modelos, cores prontas e RGB, tamanho, escala pelo centro, calibração, posição e perfis por jogo.
- Steam Deck, Legion Go S, Legion Go, 1080p e 4K.

### Como instalar
1. No Decky, ative o Modo desenvolvedor nas configurações.
2. Em Desenvolvedor, escolha "Instalar plugin de ZIP" e selecione o Crosshair.zip.
3. Reinicie o Decky se o plugin não aparecer.
