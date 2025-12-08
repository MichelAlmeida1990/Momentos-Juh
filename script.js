// Função para scroll suave
function scrollToContent() {
    document.querySelector('.main-nav').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    initDisneyDreams();
    initTravelLetters();
    initCoffeeSpots();
    initBooks();
    initSmoothScroll();
    initTypewriter();
    initPetals();
    initHearts();
    initMusicPlayer();
    
    // Aguardar planner carregar para sincronizar
    setTimeout(() => {
        if (typeof syncPlannerBooksToLibrary === 'function') {
            syncPlannerBooksToLibrary();
        }
        if (typeof renderUnifiedLibrary === 'function') {
            renderUnifiedLibrary('all');
        }
    }, 500);
});

// Efeito Typewriter na dedicatória
function initTypewriter() {
    const textElement = document.querySelector('.typewriter');
    if (!textElement) return;
    
    // Pegar o texto original (já está com quebras de linha normais)
    const originalText = textElement.textContent || textElement.innerText || '';
    
    textElement.innerHTML = '';
    textElement.style.opacity = '1';
    
    let currentText = '';
    let charIndex = 0;
    
    function type() {
        if (charIndex < originalText.length) {
            currentText += originalText.charAt(charIndex);
            textElement.textContent = currentText;
            charIndex++;
            setTimeout(type, 30);
        }
    }
    setTimeout(type, 500);
}

// Pétalas caindo
function initPetals() {
    const container = document.querySelector('.petals-container');
    if (!container) return;
    
    for (let i = 0; i < 15; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDelay = Math.random() * 5 + 's';
        petal.style.animationDuration = (Math.random() * 3 + 5) + 's';
        container.appendChild(petal);
    }
}

// Corações flutuantes
function initHearts() {
    const container = document.querySelector('.hearts-floating');
    if (!container) return;
    
    for (let i = 0; i < 8; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 3 + 's';
        heart.style.animationDuration = (Math.random() * 2 + 4) + 's';
        heart.innerHTML = '💕';
        container.appendChild(heart);
    }
}

// Player de música
function initMusicPlayer() {
    const toggleBtn = document.getElementById('music-toggle');
    const player = document.getElementById('spotify-player');
    let isPlaying = false;
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            if (isPlaying) {
                player.style.display = 'none';
                toggleBtn.textContent = '🎵';
                isPlaying = false;
            } else {
                player.style.display = 'block';
                toggleBtn.textContent = '🔇';
                isPlaying = true;
            }
        });
    }
}

// Inicializar Sonhos Disney
function initDisneyDreams() {
    const container = document.getElementById('disney-dreams');
    if (!container) return;
    
    siteData.disneyDreams.forEach(dream => {
        const card = document.createElement('div');
        card.className = `dream-card ${dream.visited ? 'dream-visited' : ''}`;
        const badge = dream.visited ? '<div class="visited-badge">✨ Você já foi!</div>' : '';
        card.innerHTML = `
            ${badge}
            <div class="dream-icon">${dream.icon}</div>
            <h3 class="dream-title">${dream.title}</h3>
            <p class="dream-description">${dream.description}</p>
        `;
        container.appendChild(card);
    });
}

// Inicializar Cartas Seladas
function initTravelLetters() {
    const container = document.getElementById('travel-letters');
    if (!container) return;
    
    siteData.travelLetters.forEach((letter, index) => {
        const envelope = document.createElement('div');
        envelope.className = 'letter-envelope';
        envelope.style.animationDelay = `${index * 0.2}s`;
        envelope.innerHTML = `
            <div class="envelope-front" onclick="openLetter(${index})">
                <div class="envelope-seal">✉️</div>
                <div class="envelope-destination">${letter.destination}</div>
            </div>
            <div class="envelope-back" id="letter-${index}">
                <div class="letter-content">
                    <span class="close-letter" onclick="closeLetter(${index})">&times;</span>
                    <div class="letter-image-wrapper">
                        <img src="${letter.image}" alt="${letter.destination}" class="letter-image">
                    </div>
                    <div class="letter-text">
                        <h3 class="letter-destination">${letter.destination}</h3>
                        <p class="letter-message">${letter.letter.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(envelope);
    });
}

// Abrir carta
function openLetter(index) {
    const envelope = document.querySelector(`#letter-${index}`).parentElement;
    envelope.classList.add('envelope-opened');
}

// Fechar carta
function closeLetter(index) {
    const envelope = document.querySelector(`#letter-${index}`).parentElement;
    envelope.classList.remove('envelope-opened');
}

// Inicializar Cafés
function initCoffeeSpots() {
    const container = document.getElementById('coffee-spots');
    if (!container) return;
    
    // Limpar container primeiro
    container.innerHTML = '';
    
    // Carregar fotos salvas
    let coffeePhotos = [];
    try {
        const saved = localStorage.getItem('julianaCoffeePhotos');
        if (saved) {
            coffeePhotos = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Erro ao carregar fotos:', e);
    }
    
    // Adicionar botão de upload no topo
    const uploadSection = document.createElement('div');
    uploadSection.className = 'coffee-upload-section';
    uploadSection.innerHTML = `
        <div class="coffee-upload-card">
            <div class="upload-icon">📸</div>
            <h3 class="upload-title">Adicionar Momento de Café</h3>
            <p class="upload-description">Compartilhe seus momentos especiais tomando café</p>
            <label for="coffee-photo-upload" class="upload-btn">
                <input type="file" id="coffee-photo-upload" accept="image/*" multiple style="display: none;" onchange="handleCoffeePhotoUpload(event)">
                <span>📷 Escolher Fotos</span>
            </label>
        </div>
    `;
    container.appendChild(uploadSection);
    
    // Renderizar galeria de fotos
    if (coffeePhotos.length > 0) {
        const gallerySection = document.createElement('div');
        gallerySection.className = 'coffee-photos-gallery';
        gallerySection.innerHTML = '<h3 class="gallery-title">✨ Nossos Momentos de Café ✨</h3>';
        
        const galleryGrid = document.createElement('div');
        galleryGrid.className = 'coffee-photos-grid';
        
        coffeePhotos.forEach((photo, index) => {
            const photoCard = document.createElement('div');
            photoCard.className = 'coffee-photo-card';
            // Escapar aspas na URL para evitar problemas
            const safeUrl = photo.url.replace(/'/g, "\\'");
            const place = photo.place ? `<p class="photo-place">📍 ${photo.place}</p>` : '';
            const caption = photo.caption ? `<p class="photo-caption">${photo.caption}</p>` : '';
            const tags = photo.tags && photo.tags.length > 0 ? `<div class="photo-tags">${photo.tags.map(tag => `<span class="photo-tag">${tag}</span>`).join('')}</div>` : '';
            
            photoCard.innerHTML = `
                <div class="photo-wrapper">
                    <img src="${photo.url}" alt="Momento de café" class="coffee-photo-img" onclick="openCoffeePhotoModal(${index})">
                    <button class="photo-delete-btn" onclick="deleteCoffeePhoto(${index}, event)" title="Remover foto">×</button>
                    <button class="photo-edit-btn" onclick="editCoffeePhoto(${index}, event)" title="Editar informações">✏️</button>
                </div>
                ${place}
                ${caption}
                ${tags}
                <p class="photo-date">📅 ${photo.date || 'Sem data'}</p>
            `;
            galleryGrid.appendChild(photoCard);
        });
        
        gallerySection.appendChild(galleryGrid);
        container.appendChild(gallerySection);
    }
    
    // Renderizar cards de cafés
    siteData.coffeeSpots.forEach(spot => {
        const card = document.createElement('div');
        card.className = 'coffee-card';
        card.innerHTML = `
            <div class="coffee-icon">${spot.icon}</div>
            <h3 class="coffee-title">${spot.title}</h3>
            <p class="coffee-description">${spot.description}</p>
            <p class="coffee-memory">"${spot.memory}"</p>
        `;
        container.appendChild(card);
    });
}

// Processar upload de fotos
function handleCoffeePhotoUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    let coffeePhotos = [];
    try {
        const saved = localStorage.getItem('julianaCoffeePhotos');
        if (saved) {
            coffeePhotos = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Erro ao carregar fotos:', e);
    }
    
    let processedCount = 0;
    const totalFiles = Array.from(files).filter(f => f.type.startsWith('image/')).length;
    
    Array.from(files).forEach((file, fileIndex) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const photoData = {
                    url: e.target.result,
                    date: new Date().toLocaleDateString('pt-BR'),
                    caption: '',
                    place: '',
                    tags: [],
                    timestamp: Date.now()
                };
                coffeePhotos.push(photoData);
                processedCount++;
                
                // Se é a última foto, abrir modal de edição
                if (processedCount === totalFiles) {
                    // Salvar no localStorage primeiro
                    try {
                        localStorage.setItem('julianaCoffeePhotos', JSON.stringify(coffeePhotos));
                    } catch (err) {
                        if (err.name === 'QuotaExceededError') {
                            alert('Limite de armazenamento atingido. Por favor, remova algumas fotos antigas.');
                            return;
                        }
                    }
                    
                    // Abrir modal de edição para a última foto adicionada
                    const lastIndex = coffeePhotos.length - 1;
                    setTimeout(() => {
                        editCoffeePhoto(lastIndex);
                    }, 300);
                } else {
                    // Salvar incrementalmente
                    try {
                        localStorage.setItem('julianaCoffeePhotos', JSON.stringify(coffeePhotos));
                    } catch (err) {
                        if (err.name === 'QuotaExceededError') {
                            alert('Limite de armazenamento atingido. Por favor, remova algumas fotos antigas.');
                            return;
                        }
                    }
                }
                
                // Recarregar seção de cafés
                if (processedCount === totalFiles) {
                    initCoffeeSpots();
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

// Deletar foto de café
function deleteCoffeePhoto(index, event) {
    if (event) {
        event.stopPropagation();
    }
    
    if (!confirm('Tem certeza que deseja remover esta foto?')) {
        return;
    }
    
    let coffeePhotos = [];
    try {
        const saved = localStorage.getItem('julianaCoffeePhotos');
        if (saved) {
            coffeePhotos = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Erro ao carregar fotos:', e);
    }
    
    if (index >= 0 && index < coffeePhotos.length) {
        coffeePhotos.splice(index, 1);
        localStorage.setItem('julianaCoffeePhotos', JSON.stringify(coffeePhotos));
        initCoffeeSpots();
    }
}

// Editar informações da foto
function editCoffeePhoto(index, event) {
    if (event) {
        event.stopPropagation();
    }
    
    let coffeePhotos = [];
    try {
        const saved = localStorage.getItem('julianaCoffeePhotos');
        if (saved) {
            coffeePhotos = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Erro ao carregar fotos:', e);
        return;
    }
    
    if (index < 0 || index >= coffeePhotos.length) {
        return;
    }
    
    const photo = coffeePhotos[index];
    
    // Criar modal de edição
    const modal = document.createElement('div');
    modal.className = 'coffee-photo-edit-modal';
    modal.innerHTML = `
        <div class="coffee-photo-edit-content">
            <span class="close-edit-modal" onclick="this.closest('.coffee-photo-edit-modal').remove()">&times;</span>
            <h3 class="edit-modal-title">📝 Editar Informações da Foto</h3>
            <div class="edit-photo-preview">
                <img src="${photo.url}" alt="Preview" class="edit-photo-img">
            </div>
            <form class="edit-photo-form" onsubmit="savePhotoInfo(${index}, event)">
                <div class="form-group">
                    <label>📍 Lugar / Local</label>
                    <input type="text" id="photo-place-${index}" value="${photo.place || ''}" placeholder="Ex: Café da Manhã em Paris">
                </div>
                <div class="form-group">
                    <label>💭 Legenda / Descrição</label>
                    <textarea id="photo-caption-${index}" rows="3" placeholder="Descreva este momento especial...">${photo.caption || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>🏷️ Tags (separadas por vírgula)</label>
                    <input type="text" id="photo-tags-${index}" value="${photo.tags ? photo.tags.join(', ') : ''}" placeholder="Ex: café, manhã, paris, especial">
                    <small>Separe as tags por vírgula</small>
                </div>
                <div class="form-group">
                    <label>📅 Data</label>
                    <input type="date" id="photo-date-${index}" value="${photo.dateInput || ''}">
                </div>
                <div class="edit-form-buttons">
                    <button type="submit" class="save-photo-btn">💾 Salvar</button>
                    <button type="button" class="cancel-photo-btn" onclick="this.closest('.coffee-photo-edit-modal').remove()">Cancelar</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Fechar ao clicar fora
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Salvar informações da foto
function savePhotoInfo(index, event) {
    event.preventDefault();
    
    let coffeePhotos = [];
    try {
        const saved = localStorage.getItem('julianaCoffeePhotos');
        if (saved) {
            coffeePhotos = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Erro ao carregar fotos:', e);
        return;
    }
    
    if (index < 0 || index >= coffeePhotos.length) {
        return;
    }
    
    const place = document.getElementById(`photo-place-${index}`).value.trim();
    const caption = document.getElementById(`photo-caption-${index}`).value.trim();
    const tagsInput = document.getElementById(`photo-tags-${index}`).value.trim();
    const dateInput = document.getElementById(`photo-date-${index}`).value;
    
    // Processar tags
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];
    
    // Processar data
    let date = coffeePhotos[index].date;
    if (dateInput) {
        const dateObj = new Date(dateInput);
        date = dateObj.toLocaleDateString('pt-BR');
    }
    
    // Atualizar foto
    coffeePhotos[index] = {
        ...coffeePhotos[index],
        place: place,
        caption: caption,
        tags: tags,
        date: date,
        dateInput: dateInput
    };
    
    // Salvar
    localStorage.setItem('julianaCoffeePhotos', JSON.stringify(coffeePhotos));
    
    // Fechar modal e recarregar
    document.querySelector('.coffee-photo-edit-modal').remove();
    initCoffeeSpots();
}

// Abrir modal de foto
function openCoffeePhotoModal(photoIndex) {
    let coffeePhotos = [];
    try {
        const saved = localStorage.getItem('julianaCoffeePhotos');
        if (saved) {
            coffeePhotos = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Erro ao carregar fotos:', e);
        return;
    }
    
    if (photoIndex < 0 || photoIndex >= coffeePhotos.length) {
        return;
    }
    
    const photo = coffeePhotos[photoIndex];
    const safeUrl = photo.url.replace(/'/g, "\\'");
    
    const place = photo.place ? `<p class="modal-photo-place">📍 ${photo.place}</p>` : '';
    const caption = photo.caption ? `<p class="modal-photo-caption">${photo.caption}</p>` : '';
    const tags = photo.tags && photo.tags.length > 0 ? `<div class="modal-photo-tags">${photo.tags.map(tag => `<span class="modal-photo-tag">${tag}</span>`).join('')}</div>` : '';
    
    const modal = document.createElement('div');
    modal.className = 'coffee-photo-modal';
    modal.innerHTML = `
        <div class="coffee-photo-modal-content">
            <span class="close-photo-modal" onclick="this.closest('.coffee-photo-modal').remove()">&times;</span>
            <img src="${photo.url}" alt="Momento de café" class="modal-photo-img">
            <div class="modal-photo-info">
                ${place}
                ${caption}
                ${tags}
                <p class="modal-photo-date">📅 ${photo.date || 'Sem data'}</p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Inicializar Livros - Design 3D Criativo
function initBooks() {
    // Renderizar todos os livros na estante unificada
    renderUnifiedLibrary('all');
    initLibraryFiltersUnified();
}

// Renderizar Biblioteca Unificada
function renderUnifiedLibrary(filter = 'all') {
    const unifiedShelf = document.getElementById('unified-library-shelf');
    const colleenSection = document.getElementById('colleen-section');
    const otherSection = document.getElementById('other-section');
    
    if (!unifiedShelf) return;
    
    unifiedShelf.innerHTML = '';
    
    let allBooks = [];
    let bookIndex = 0;
    
    // Adicionar livros da Colleen Hoover
    siteData.colleenHooverBooks.forEach((book, index) => {
        allBooks.push({
            ...book,
            type: 'colleen',
            originalIndex: index,
            displayIndex: bookIndex++
        });
    });
    
    // Adicionar outros livros
    siteData.otherBooks.forEach((book, index) => {
        allBooks.push({
            ...book,
            type: 'other',
            originalIndex: index,
            displayIndex: bookIndex++
        });
    });
    
    // Adicionar livros do planner (verificar se plannerData existe)
    const plannerBooks = (typeof plannerData !== 'undefined' && plannerData.books) ? plannerData.books : [];
    plannerBooks.forEach((book, index) => {
        // Gerar cor baseada na capa ou título
        const coverColors = {
            'lavender': '#E6D5F7',
            'rose': '#F4C2C2',
            'peach': '#FFD9B3',
            'mint': '#A8E6CF',
            'coral': '#FF8C94',
            'sky': '#87CEEB',
            'sunset': '#FF9A8B',
            'ocean': '#667eea'
        };
        
        allBooks.push({
            title: book.title,
            author: book.author,
            synopsis: book.notes || `Livro adicionado por ${book.author}`,
            color: coverColors[book.cover] || coverColors.lavender,
            type: 'planner',
            plannerData: book,
            displayIndex: bookIndex++
        });
    });
    
    // Aplicar filtros
    let filteredBooks = allBooks;
    if (filter === 'colleen') {
        filteredBooks = allBooks.filter(b => b.type === 'colleen');
        if (colleenSection) colleenSection.style.display = 'block';
        if (otherSection) otherSection.style.display = 'none';
    } else if (filter === 'other') {
        filteredBooks = allBooks.filter(b => b.type === 'other');
        if (colleenSection) colleenSection.style.display = 'none';
        if (otherSection) otherSection.style.display = 'block';
    } else if (filter === 'planner') {
        filteredBooks = allBooks.filter(b => b.type === 'planner');
        if (colleenSection) colleenSection.style.display = 'none';
        if (otherSection) otherSection.style.display = 'none';
    } else if (filter === 'read') {
        filteredBooks = allBooks.filter(b => {
            if (b.type === 'planner' && b.plannerData) return b.plannerData.status === 'read';
            return false; // Livros fixos não têm status
        });
        if (colleenSection) colleenSection.style.display = 'none';
        if (otherSection) otherSection.style.display = 'none';
    } else if (filter === 'reading') {
        filteredBooks = allBooks.filter(b => {
            if (b.type === 'planner' && b.plannerData) return b.plannerData.status === 'reading';
            return false;
        });
        if (colleenSection) colleenSection.style.display = 'none';
        if (otherSection) otherSection.style.display = 'none';
    } else if (filter === 'want') {
        filteredBooks = allBooks.filter(b => {
            if (b.type === 'planner' && b.plannerData) return b.plannerData.status === 'want';
            return false;
        });
        if (colleenSection) colleenSection.style.display = 'none';
        if (otherSection) otherSection.style.display = 'none';
    } else if (filter === 'favorite') {
        filteredBooks = allBooks.filter(b => {
            if (b.type === 'planner' && b.plannerData) {
                return b.plannerData.stickers && b.plannerData.stickers.includes('favorite');
            }
            return false;
        });
        if (colleenSection) colleenSection.style.display = 'none';
        if (otherSection) otherSection.style.display = 'none';
    } else {
        // Todos
        if (colleenSection) colleenSection.style.display = 'none';
        if (otherSection) otherSection.style.display = 'none';
    }
    
    // Renderizar livros filtrados
    filteredBooks.forEach((book, index) => {
        const bookItem = document.createElement('div');
        bookItem.className = 'book-3d-item';
        bookItem.style.setProperty('--book-color', book.color);
        bookItem.style.animationDelay = `${index * 0.1}s`;
        
        // Truncar título se muito longo
        const displayTitle = book.title.length > 20 ? book.title.substring(0, 17) + '...' : book.title;
        
        if (book.type === 'planner') {
            // Livro do planner - abrir modal com dados do planner + botão excluir
            const plannerBookIndex = plannerBooks.findIndex(b => b.id === book.plannerData.id);
            bookItem.innerHTML = `
                <div class="book-3d-cover-wrapper">
                    <div class="book-3d-cover" onclick="openPlannerBookModal(${book.displayIndex})">
                        <div class="book-3d-spine">${displayTitle}</div>
                        <div class="book-3d-pages"></div>
                    </div>
                    <button class="book-delete-from-shelf" onclick="deleteBookFromShelf(${plannerBookIndex}, event)" title="Remover da prateleira">
                        <span>×</span>
                    </button>
                </div>
            `;
        } else {
            // Livro fixo - usar função original
            bookItem.innerHTML = `
                <div class="book-3d-cover" onclick="openBookModal(${book.originalIndex}, '${book.type}')">
                    <div class="book-3d-spine">${displayTitle}</div>
                    <div class="book-3d-pages"></div>
                </div>
            `;
        }
        
        unifiedShelf.appendChild(bookItem);
    });
    
    // Manter estantes originais para compatibilidade
    if (filter === 'colleen' || filter === 'other') {
        const colleenContainer = document.getElementById('colleen-books');
        const otherContainer = document.getElementById('other-books');
        
        if (filter === 'colleen' && colleenContainer) {
            colleenContainer.innerHTML = '';
            siteData.colleenHooverBooks.forEach((book, index) => {
                const bookItem = document.createElement('div');
                bookItem.className = 'book-3d-item';
                bookItem.style.setProperty('--book-color', book.color);
                bookItem.style.animationDelay = `${index * 0.1}s`;
                bookItem.innerHTML = `
                    <div class="book-3d-cover" onclick="openBookModal(${index}, 'colleen')">
                        <div class="book-3d-spine">${book.title}</div>
                        <div class="book-3d-pages"></div>
                    </div>
                `;
                colleenContainer.appendChild(bookItem);
            });
        }
        
        if (filter === 'other' && otherContainer) {
            otherContainer.innerHTML = '';
            siteData.otherBooks.forEach((book, index) => {
                const bookItem = document.createElement('div');
                bookItem.className = 'book-3d-item';
                bookItem.style.setProperty('--book-color', book.color);
                bookItem.style.animationDelay = `${index * 0.1}s`;
                bookItem.innerHTML = `
                    <div class="book-3d-cover" onclick="openBookModal(${index}, 'other')">
                        <div class="book-3d-spine">${book.title}</div>
                        <div class="book-3d-pages"></div>
                    </div>
                `;
                otherContainer.appendChild(bookItem);
            });
        }
    }
}

// Deletar livro da prateleira
function deleteBookFromShelf(plannerBookIndex, event) {
    if (event) {
        event.stopPropagation();
    }
    
    if (!confirm('Tem certeza que deseja remover este livro da sua prateleira?')) {
        return;
    }
    
    // Verificar se plannerData existe
    const plannerData = (typeof window.plannerData !== 'undefined' && window.plannerData) 
        ? window.plannerData 
        : (typeof plannerData !== 'undefined' && plannerData) 
            ? plannerData 
            : null;
    
    if (!plannerData || !plannerData.books) {
        alert('Erro: Não foi possível encontrar os dados do planner.');
        return;
    }
    
    if (plannerBookIndex >= 0 && plannerBookIndex < plannerData.books.length) {
        plannerData.books.splice(plannerBookIndex, 1);
        
        // Salvar dados
        if (typeof savePlannerData === 'function') {
            savePlannerData();
        } else {
            localStorage.setItem('julianaPlanner', JSON.stringify(plannerData));
        }
        
        // Atualizar referência global
        if (typeof window !== 'undefined') {
            window.plannerData = plannerData;
        }
        
        // Recarregar biblioteca
        const activeFilter = document.querySelector('.library-filter-btn.active')?.getAttribute('data-filter') || 'all';
        renderUnifiedLibrary(activeFilter);
    }
}

// Abrir modal de livro do planner
function openPlannerBookModal(displayIndex) {
    // Encontrar o livro pelo displayIndex
    let currentIndex = 0;
    let targetBook = null;
    
    siteData.colleenHooverBooks.forEach(() => currentIndex++);
    siteData.otherBooks.forEach(() => currentIndex++);
    
    // Verificar se plannerData existe (tentar window.plannerData primeiro)
    const plannerBooks = (typeof window.plannerData !== 'undefined' && window.plannerData.books) 
        ? window.plannerData.books 
        : (typeof plannerData !== 'undefined' && plannerData.books) 
            ? plannerData.books 
            : [];
    
    plannerBooks.forEach((book, index) => {
        if (currentIndex === displayIndex) {
            targetBook = { ...book, plannerIndex: index };
        }
        currentIndex++;
    });
    
    if (!targetBook) return;
    
    const modal = document.getElementById('book-modal');
    const modalBody = document.getElementById('book-modal-body');
    
    if (modal && modalBody) {
        const coverColors = {
            'lavender': '#E6D5F7',
            'rose': '#F4C2C2',
            'peach': '#FFD9B3',
            'mint': '#A8E6CF',
            'coral': '#FF8C94',
            'sky': '#87CEEB',
            'sunset': '#FF9A8B',
            'ocean': '#667eea'
        };
        
        const coverColor = coverColors[targetBook.cover] || coverColors.lavender;
        const ratingStars = '⭐'.repeat(targetBook.rating || 0);
        let stickersHTML = '';
        if (targetBook.stickers && targetBook.stickers.length > 0) {
            const stickerConfigs = targetBook.stickers.map(sticker => {
                // Tentar usar getStickerConfig se disponível, senão criar config básico
                if (typeof getStickerConfig === 'function') {
                    return getStickerConfig(sticker);
                }
                // Fallback básico
                return { class: 'sticker-reading', label: sticker };
            }).filter(c => c);
            
            stickersHTML = `<div class="book-modal-stickers">${stickerConfigs.map(config => 
                `<span class="sticker-badge-small ${config.class}">${config.label}</span>`
            ).join('')}</div>`;
        }
        
        modalBody.innerHTML = `
            <div class="book-modal-cover" style="background: linear-gradient(135deg, ${coverColor}, ${adjustColor(coverColor, -30)})">
                <h3 class="book-modal-title">${targetBook.title}</h3>
                <p class="book-modal-author">por ${targetBook.author}</p>
            </div>
            <div class="book-modal-content">
                ${stickersHTML}
                ${targetBook.rating > 0 ? `<div class="book-modal-rating">${ratingStars}</div>` : ''}
                <div class="book-modal-dates">
                    ${targetBook.startDate ? `<p>📅 Início: ${new Date(targetBook.startDate).toLocaleDateString('pt-BR')}</p>` : ''}
                    ${targetBook.endDate ? `<p>✅ Fim: ${new Date(targetBook.endDate).toLocaleDateString('pt-BR')}</p>` : ''}
                </div>
                ${targetBook.notes ? `
                    <h4 class="book-modal-synopsis-title">Minhas Anotações</h4>
                    <p class="book-modal-synopsis">${targetBook.notes}</p>
                ` : ''}
            </div>
        `;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Inicializar filtros unificados
function initLibraryFiltersUnified() {
    const filterButtons = document.querySelectorAll('.library-filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover active de todos
            filterButtons.forEach(b => b.classList.remove('active'));
            // Adicionar active no clicado
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            renderUnifiedLibrary(filter);
        });
    });
}

// Abrir modal do livro
function openBookModal(index, type) {
    const books = type === 'colleen' ? siteData.colleenHooverBooks : siteData.otherBooks;
    const book = books[index];
    
    if (!book) return;
    
    const modal = document.getElementById('book-modal');
    const modalBody = document.getElementById('book-modal-body');
    
    if (modal && modalBody) {
        modalBody.innerHTML = `
            <div class="book-modal-cover" style="background: linear-gradient(135deg, ${book.color}, ${adjustColor(book.color, -30)})">
                <h3 class="book-modal-title">${book.title}</h3>
                ${type === 'colleen' ? '<p class="book-modal-author">por Colleen Hoover</p>' : ''}
            </div>
            <div class="book-modal-content">
                <h4 class="book-modal-synopsis-title">Sinopse</h4>
                <p class="book-modal-synopsis">${book.synopsis}</p>
            </div>
        `;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Fechar modal do livro
function closeBookModal() {
    const modal = document.getElementById('book-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Inicializar eventos do modal de livro
document.addEventListener('DOMContentLoaded', function() {
    const bookModal = document.getElementById('book-modal');
    const closeBookBtn = document.querySelector('.close-book-modal');
    
    if (bookModal) {
        bookModal.addEventListener('click', function(e) {
            if (e.target === bookModal) {
                closeBookModal();
            }
        });
    }
    
    if (closeBookBtn) {
        closeBookBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeBookModal();
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeBookModal();
        }
    });
});

// Ajustar cor para gradiente
function adjustColor(color, amount) {
    const num = parseInt(color.replace("#", ""), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return "#" + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

// Smooth scroll para navegação
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Navbar fixa ao scroll
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.main-nav');
    if (nav) {
        if (window.scrollY > 100) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    }
});

// Revelar foto secreta
function revealSecretPhoto() {
    const container = document.querySelector('.secret-photo-container');
    if (container) {
        container.innerHTML = `
            <div class="secret-photo-revealed">
                <img src="img/imgi_36_497427646_18502892359042026_2562234633965230965_n.jpg" alt="Surpresa" class="secret-photo-img">
                <p class="secret-photo-text">Você mais linda que qualquer lugar do mundo 💕</p>
            </div>
        `;
    }
}

// Abrir página secreta
function openSecretPage() {
    const secretPage = document.getElementById('secret-page');
    if (secretPage) {
        secretPage.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Fechar página secreta
document.addEventListener('DOMContentLoaded', function() {
    const closeSecret = document.querySelector('.close-secret');
    const secretPage = document.getElementById('secret-page');
    
    if (closeSecret && secretPage) {
        closeSecret.addEventListener('click', function() {
            secretPage.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        secretPage.addEventListener('click', function(e) {
            if (e.target === secretPage) {
                secretPage.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
});
