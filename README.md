# 💕 Nossas Pegadas no Mundo

Um site romântico e interativo para celebrar as viagens de vocês juntos! Este projeto foi criado com muito amor para ser um presente especial.

## ✨ Características

- 🗺️ **Mapa Interativo**: Visualize todas as viagens em um mapa mundial usando Leaflet.js
- 📅 **Timeline de Memórias**: Uma linha do tempo vertical com todas as aventuras
- 💭 **Bucket List**: Seção para sonhos futuros de viagens
- 🌙 **Modo Noturno**: Alternância entre tema claro e escuro
- 📱 **Totalmente Responsivo**: Funciona perfeitamente em mobile, tablet e desktop
- 🎨 **Design Romântico**: Paleta de cores suave e animações delicadas

## 🚀 Como Usar

### Opção 1: Abrir Localmente

1. Baixe todos os arquivos do projeto
2. Abra o arquivo `index.html` no seu navegador
3. Pronto! O site está funcionando

### Opção 2: Hospedar no GitHub Pages (Grátis)

1. Crie um repositório no GitHub
2. Faça upload de todos os arquivos
3. Vá em Settings > Pages
4. Selecione a branch `main` e a pasta `root`
5. Seu site estará disponível em `https://seu-usuario.github.io/nome-do-repo`

## 🎨 Personalização

### 1. Editar as Viagens

Abra o arquivo `data.js` e edite o array `travelData.trips`:

```javascript
{
    id: 1,
    location: "Nome da Cidade, País",
    lat: 48.8566,  // Latitude (encontre no Google Maps)
    lng: 2.3522,   // Longitude
    date: "Verão 2023",
    memory: "Sua memória romântica aqui...",
    quote: "Uma citação sobre o lugar",
    photos: [
        "URL_da_foto_1",
        "URL_da_foto_2"
    ],
    prompt: "Pergunta para ela sobre essa viagem"
}
```

**Dica**: Para encontrar coordenadas, vá no Google Maps, clique com botão direito no local e copie as coordenadas.

### 2. Editar a Dedicação

No arquivo `index.html`, encontre a seção `.dedication-text` e personalize a mensagem:

```html
<p class="dedication-text">
    Sua mensagem romântica aqui...
</p>
```

### 3. Adicionar Fotos

Você tem algumas opções:

- **Opção A**: Usar URLs de fotos hospedadas online (Google Photos, Imgur, etc.)
- **Opção B**: Criar uma pasta `images/` no projeto e referenciar: `images/paris.jpg`
- **Opção C**: Usar serviços como [Cloudinary](https://cloudinary.com) ou [ImgBB](https://imgbb.com)

### 4. Personalizar Cores

No arquivo `styles.css`, edite as variáveis CSS no início:

```css
:root {
    --color-pink: #FFB6C1;      /* Cor rosa principal */
    --color-blue: #87CEEB;      /* Cor azul principal */
    --color-bg: #F8F8FF;        /* Cor de fundo */
    /* ... */
}
```

### 5. Editar a Bucket List

No arquivo `data.js`, edite o array `travelData.bucketList`:

```javascript
{
    location: "Nome do Lugar",
    dream: "Descrição do sonho de viagem..."
}
```

## 📝 Estrutura do Projeto

```
Viagens do Meu amor/
│
├── index.html      # Estrutura principal do site
├── styles.css      # Estilos e animações
├── script.js       # Lógica e interatividade
├── data.js         # Dados das viagens (PERSONALIZE AQUI!)
└── README.md       # Este arquivo
```

## 🎯 Próximos Passos (Opcional)

Se quiser adicionar mais funcionalidades:

- **Música de Fundo**: Adicione um player do Spotify embedado
- **Formulário de Adicionar Memórias**: Para ela poder adicionar novas viagens
- **Animações de Confetes**: Quando abrir o site pela primeira vez
- **Galeria Expandida**: Com lightbox para ver fotos em tamanho maior
- **Exportar PDF**: Para criar um livro de memórias

## 💡 Dicas

1. **Teste em Mobile**: Sempre teste como o site aparece no celular
2. **Fotos Otimizadas**: Use imagens com tamanho razoável (máx 1-2MB cada) para carregamento rápido
3. **Backup**: Sempre mantenha backup dos seus dados personalizados
4. **Surpresa**: Compartilhe o link em um momento especial! 💕

## 🛠️ Tecnologias Utilizadas

- HTML5
- CSS3 (com animações e modo noturno)
- JavaScript (Vanilla)
- [Leaflet.js](https://leafletjs.com/) - Biblioteca de mapas interativos
- [Google Fonts](https://fonts.google.com/) - Fonte Dancing Script e Poppins

## 📄 Licença

Este projeto foi criado com amor. Sinta-se livre para usar e modificar como quiser!

---

**Feito com 💕 para alguém muito especial**

Se tiver dúvidas ou quiser adicionar mais funcionalidades, fique à vontade para modificar o código!

