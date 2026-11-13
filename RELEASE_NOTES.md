## Crosshair v1.7.5

### Novidades
- Aparência e Tela agora ficam na mesma guia. As guias são Aparência, Perfis e Config., e L1/R1 percorrem as três.
- Cada seção tem uma barra com seta (como no Mako) que recolhe ou expande o conteúdo. A escolha fica salva.
- A tabela de resumo do topo muda em cada guia:
  - **Aparência:** estado do crosshair, modelo, tamanho, cor, resolução e posição final.
  - **Perfis:** detalhes do perfil escolhido (modelo, tamanho, cor, posição, se a mira liga ao aplicar, se a aplicação automática está ativa e se o perfil é igual ou diferente do ajuste atual). Mostra também quando é o perfil do jogo aberto.
  - **Config.:** idioma, combinação do atalho, tempo segurando e leitura em jogo.
- O interruptor *Mostrar crosshair* fica na guia Aparência, junto da tabela.
- A guia **Perfis** traz a lista de perfis salvos e botões com ícone para **Criar perfil**, **Renomear** e **Excluir**.
- **Criar perfil** salva o jogo aberto e vira **Atualizar perfil** quando ele já tem perfil. Sem jogo aberto, o botão fica desativado.
- **Renomear** muda só o nome do perfil, sem alterar o jogo nem as configurações salvas.
- A guia **Config.** reúne o idioma e o atalho de botões.
- As informações de apoio ficam sempre visíveis.
- Documentação nos três idiomas atualizada.

### Direct Updater
- Metadados e links de distribuição alinhados a Havok027/crosshair-plugin, com a versão definida em package.json, evitando divergências com plugin.json.
- Cada versão mantém seu ZIP original. Outro pacote exige aumentar a versão; a automação não substitui arquivos já publicados.
- O pacote passa pelo validador original do Direct Updater antes da publicação.
- Depois da publicação, a automação confere a seleção da release, a identidade e o SHA-256 do download pela API e pela página de arquivos do GitHub.

### Validação
- Testes automatizados de navegação por L1/R1, idioma, atalho dentro de Config., botões de perfil, renomeação no backend, tabelas de cada guia e seções que recolhem.
- O comportamento no aparelho ainda precisa ser validado dentro e fora do QAM: barras de recolher, tabelas e a janela de renomear com o teclado do Steam.

### Mantido
- Restauração do MangoHud anterior ao desligar a mira.
- Sete modelos, cores prontas e RGB, tamanho, escala pelo centro, calibração, posição e perfis por jogo.
- Atalho de botões, com gravação pela interface.
- Steam Deck, Legion Go S, Legion Go, 1080p e 4K.

### Como instalar
1. No Decky, ative o Modo desenvolvedor nas configurações.
2. Em Desenvolvedor, escolha "Instalar plugin de ZIP" e selecione o Crosshair.zip.
3. Reinicie o Decky se o plugin não aparecer.
