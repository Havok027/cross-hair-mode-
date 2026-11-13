## Crosshair v1.7.4

### Novidades
- O resumo do topo agora é uma tabela, no estilo do Mako: estado (ativo ou desligado), modelo, tamanho, cor, atalho e perfil. O interruptor *Mostrar crosshair* fica logo abaixo.
- Menus reorganizados em Aparência, Tela, Perfis e Config.
- A guia **Config.** reúne o idioma e o atalho de botões, que saíram de onde estavam.
- Nova guia **Perfis**, com a seção "Perfis de jogo": lista de perfis salvos e botões com ícone para **Criar perfil**, **Renomear** e **Excluir**.
- **Criar perfil** salva o jogo aberto e vira **Atualizar perfil** quando ele já tem perfil. Sem jogo aberto, o botão fica desativado e aparece o aviso para abrir um jogo.
- **Renomear** muda só o nome do perfil, sem alterar o jogo nem as configurações salvas.
- **R1** mostra ou oculta as informações de apoio (descrições, dicas e diagnóstico), como no Mako, com o aviso flutuante no canto. A escolha fica salva.
- **L1** passa para a próxima guia. Durante a gravação do atalho, L1 e R1 ficam livres para compor a combinação.
- Documentação nos três idiomas atualizada.

### Direct Updater
- Metadados e links de distribuição alinhados a Havok027/crosshair-plugin, com a versão definida em package.json, evitando divergências com plugin.json.
- Cada versão mantém seu ZIP original. Outro pacote exige aumentar a versão; a automação não substitui arquivos já publicados.
- O pacote passa pelo validador original do Direct Updater antes da publicação.
- Depois da publicação, a automação confere a seleção da release, a identidade e o SHA-256 do download pela API e pela página de arquivos do GitHub.

### Validação
- Testes automatizados de navegação (L1 e R1), idioma, atalho dentro de Config., botões de perfil e renomeação no backend.
- O comportamento no aparelho ainda precisa ser validado dentro e fora do QAM: tabela de estado, janela de renomear com o teclado do Steam, R1 e o aviso flutuante.

### Mantido
- Restauração do MangoHud anterior ao desligar a mira.
- Sete modelos, cores prontas e RGB, tamanho, escala pelo centro, calibração, posição e perfis por jogo.
- Atalho de botões, com gravação pela interface.
- Steam Deck, Legion Go S, Legion Go, 1080p e 4K.

### Como instalar
1. No Decky, ative o Modo desenvolvedor nas configurações.
2. Em Desenvolvedor, escolha "Instalar plugin de ZIP" e selecione o Crosshair.zip.
3. Reinicie o Decky se o plugin não aparecer.
