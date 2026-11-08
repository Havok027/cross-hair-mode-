# Crosshair Plugin

Plugin do Decky Loader que desenha um crosshair na tela usando a configuração do MangoHud.

## Novidades da 1.2.0

- Suporte à **Legion Go S (1920x1200)**. Também há a Legion Go (2560x1600), o Steam Deck, 1080p e 4K.
- Interface nova, com preview, cartões de modelo e seletor de cores, toda navegável pelo controle.
- **Cor ajustável**: 8 cores prontas ou RGB personalizado.
- **Tamanho ajustável** de 50% a 300%.
- **Novos modelos**: Anel, X, Estrela, Colchetes e Traços, além de Caixa e Ponto.
- Configurações salvas entre sessões; o ajuste fino de posição é salvo por modelo.

## Uso

1. Abra o plugin no Decky Loader.
2. Escolha a **resolução** da sua tela.
3. Escolha o **modelo**, a **cor** e o **tamanho**.
4. Ligue **Mostrar crosshair**.
5. Se a mira não estiver no centro, ajuste com as setas (passo de 1 ou 5 px). O ajuste vale para o modelo atual.

## Como funciona

- O plugin escreve uma configuração do MangoHud com a mira como texto (`custom_text`), a cor (`text_color`), o tamanho (`font_size`) e a posição (`offset_x`, `offset_y`).
- A posição é calculada a partir do centro da tela da resolução escolhida, com uma correção pelo tamanho do símbolo.
- Os modelos Caixa e Ponto usam os valores originais do plugin. Os novos modelos têm centralização estimada e podem precisar de um ajuste fino.
- Isso pode conflitar com outros ajustes do MangoHud ou com plugins como o MangoPeel. Não dá para usar o overlay de desempenho ao mesmo tempo.

## Adicionar um modelo ou uma tela

Tudo fica no começo do `main.py`:

- `MODELS`: três linhas de texto (o símbolo na linha do meio) e `half_w`, a metade da largura do símbolo em px.
- `RESOLUTIONS`: nome, largura e altura.

A interface lê as duas listas do backend, então não é preciso mexer no TypeScript.

## Compilar

O Decky só carrega o plugin compilado (pasta `dist/`), então este passo é obrigatório.

**No PC:**

```
pnpm install
pnpm build
```

Depois copie `dist/`, `main.py`, `plugin.json` e `package.json` para uma pasta `Crosshair` em `~/homebrew/plugins/` e reinicie o Decky.

**Sem instalar nada:** suba o projeto para o GitHub. A aba Actions compila sozinha (arquivo `.github/workflows/build.yml`) e gera o artefato `Crosshair`, já com a pasta pronta.
