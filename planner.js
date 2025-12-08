// Planner de Leitura Interativo
var plannerData = {
    books: [],
    goals: {
        yearly: 0,
        monthly: 0
    },
    notes: [],
    stickers: []
};

// Tornar plannerData acessível globalmente
window.plannerData = plannerData;

// Carregar dados salvos
function loadPlannerData() {
    const saved = localStorage.getItem('julianaPlanner');
    if (saved) {
        plannerData = JSON.parse(saved);
        window.plannerData = plannerData; // Atualizar referência global
    }
}

// Salvar dados
function savePlannerData() {
    localStorage.setItem('julianaPlanner', JSON.stringify(plannerData));
    window.plannerData = plannerData; // Atualizar referência global
}

// Inicializar Planner
function initPlanner() {
    loadPlannerData();
    initTabs();
    initBooksList();
    initGoals();
    initNotes();
    initStickers();
    initDragAndDrop();
    // Biblioteca unificada será atualizada automaticamente
}

// Sistema de Abas
function initTabs() {
    const tabs = document.querySelectorAll('.planner-tab');
    const contents = document.querySelectorAll('.planner-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Remover active de todas as abas e conteúdos
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            // Adicionar active na aba e conteúdo selecionados
            tab.classList.add('active');
            document.getElementById(`planner-${targetTab}`).classList.add('active');
        });
    });
}

// Status de Livros
function initBooksList() {
    const statusTabs = document.querySelectorAll('.status-tab');
    statusTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            statusTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderBooks(tab.getAttribute('data-status'));
        });
    });
    
    renderBooks('reading');
}

// Renderizar Lista de Livros
function renderBooks(status) {
    const container = document.getElementById('books-list');
    const books = plannerData.books.filter(book => book.status === status);
    
    if (books.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>📚 Nenhum livro aqui ainda...</p>
                <p>Adicione seu primeiro livro clicando no botão acima!</p>
            </div>
        `;
        return;
    }
    
        container.innerHTML = books.map((book, index) => {
        const ratingStars = '⭐'.repeat(book.rating || 0);
        const startDate = book.startDate ? new Date(book.startDate).toLocaleDateString('pt-BR') : '-';
        const endDate = book.endDate ? new Date(book.endDate).toLocaleDateString('pt-BR') : '-';
        const bookIndex = plannerData.books.indexOf(book);
        const coverClass = book.cover || 'lavender';
        
        // Renderizar stickers
        const stickersHTML = book.stickers && book.stickers.length > 0 
            ? `<div class="book-stickers-display">${book.stickers.map(sticker => {
                const stickerConfig = getStickerConfig(sticker);
                return stickerConfig ? `<span class="sticker-badge-small ${stickerConfig.class}">${stickerConfig.label}</span>` : '';
            }).join('')}</div>` 
            : '';
        
        return `
            <div class="book-card">
                <div class="book-card-cover cover-${coverClass}">
                    <div class="book-cover-content">
                        <h4 class="book-cover-title">${book.title}</h4>
                        <p class="book-cover-author">${book.author}</p>
                    </div>
                </div>
                <div class="book-card-body">
                    <div class="book-card-header">
                        <h4 class="book-card-title">${book.title}</h4>
                        <button class="book-delete-btn" onclick="deleteBook(${bookIndex})" title="Remover">×</button>
                    </div>
                    <p class="book-card-author">por ${book.author}</p>
                    ${stickersHTML}
                    ${book.rating > 0 ? `<div class="book-rating">${ratingStars}</div>` : ''}
                    <div class="book-dates">
                        <span>📅 Início: ${startDate}</span>
                        ${book.endDate ? `<span>✅ Fim: ${endDate}</span>` : ''}
                    </div>
                    ${book.notes ? `<div class="book-notes-preview">${book.notes}</div>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Adicionar Livro
function openAddBookModal() {
    document.getElementById('add-book-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeAddBookModal() {
    document.getElementById('add-book-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('add-book-form').reset();
    document.getElementById('book-rating').value = '0';
    document.getElementById('book-cover').value = 'lavender';
    document.querySelectorAll('.star').forEach(star => star.classList.remove('active'));
    document.querySelectorAll('.cover-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelector('.cover-option[data-cover="lavender"]').classList.add('selected');
    document.querySelectorAll('.book-sticker-check').forEach(cb => cb.checked = false);
}

// Configuração de stickers
function getStickerConfig(stickerId) {
    const configs = {
        // Status
        'reading': { class: 'sticker-reading', label: 'Lendo', icon: '📖', type: 'status' },
        'completed': { class: 'sticker-completed', label: 'Concluído', icon: '✅', type: 'status' },
        'favorite': { class: 'sticker-favorite', label: 'Favorito', icon: '⭐', type: 'status' },
        'want': { class: 'sticker-want', label: 'Quero Ler', icon: '📌', type: 'status' },
        'reread': { class: 'sticker-reread', label: 'Relendo', icon: '🔄', type: 'status' },
        'paused': { class: 'sticker-paused', label: 'Pausado', icon: '⏸️', type: 'status' },
        // Emoções
        'loved': { class: 'sticker-loved', label: 'Amei', icon: '💕', type: 'emotion' },
        'cried': { class: 'sticker-cried', label: 'Chorei', icon: '😢', type: 'emotion' },
        'amazed': { class: 'sticker-amazed', label: 'Incrível', icon: '🤯', type: 'emotion' },
        'sad': { class: 'sticker-sad', label: 'Triste', icon: '😔', type: 'emotion' },
        'happy': { class: 'sticker-happy', label: 'Feliz', icon: '🥰', type: 'emotion' },
        'shocked': { class: 'sticker-shocked', label: 'Chocante', icon: '😱', type: 'emotion' },
        // Gêneros
        'romance': { class: 'sticker-romance', label: 'Romance', icon: '💕', type: 'genre' },
        'suspense': { class: 'sticker-suspense', label: 'Suspense', icon: '🔍', type: 'genre' },
        'classic': { class: 'sticker-classic', label: 'Clássico', icon: '📚', type: 'genre' },
        'drama': { class: 'sticker-drama', label: 'Drama', icon: '🎭', type: 'genre' },
        'fantasy': { class: 'sticker-fantasy', label: 'Fantasia', icon: '💫', type: 'genre' },
        'thriller': { class: 'sticker-thriller', label: 'Thriller', icon: '⚡', type: 'genre' },
        // Decoração
        'star': { class: 'sticker-star', label: '⭐', icon: '⭐', type: 'decoration' },
        'heart': { class: 'sticker-heart', label: '💕', icon: '💕', type: 'decoration' },
        'sparkle': { class: 'sticker-sparkle', label: '✨', icon: '✨', type: 'decoration' },
        'bookmark': { class: 'sticker-bookmark', label: '🔖', icon: '🔖', type: 'decoration' },
        'coffee': { class: 'sticker-coffee', label: '☕', icon: '☕', type: 'decoration' },
        'flower': { class: 'sticker-flower', label: '🌸', icon: '🌸', type: 'decoration' }
    };
    return configs[stickerId] || null;
}

// Sistema de Estrelas
document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            document.getElementById('book-rating').value = rating;
            
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });
    
    // Formulário de adicionar livro
    const addBookForm = document.getElementById('add-book-form');
    if (addBookForm) {
        addBookForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coletar stickers selecionados
            const selectedStickers = Array.from(document.querySelectorAll('.book-sticker-check:checked'))
                .map(cb => cb.value);
            
            const book = {
                id: Date.now(),
                title: document.getElementById('book-title').value,
                author: document.getElementById('book-author').value,
                cover: document.getElementById('book-cover').value || 'lavender',
                status: document.getElementById('book-status').value,
                stickers: selectedStickers,
                startDate: document.getElementById('book-start-date').value || null,
                endDate: document.getElementById('book-end-date').value || null,
                rating: parseInt(document.getElementById('book-rating').value) || 0,
                notes: document.getElementById('book-notes').value || ''
            };
            
            plannerData.books.push(book);
            savePlannerData();
            renderBooks(book.status);
            closeAddBookModal();
            
            // Atualizar metas
            updateGoals();
            
            // Sincronizar com a biblioteca unificada
            if (typeof renderUnifiedLibrary === 'function') {
                renderUnifiedLibrary('all');
            }
        });
    }
    
    // Formulário de adicionar anotação
    const addNoteForm = document.getElementById('add-note-form');
    if (addNoteForm) {
        addNoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const titleInput = document.getElementById('note-title');
            const contentInput = document.getElementById('note-content');
            
            if (!titleInput || !contentInput) {
                console.error('Campos não encontrados:', { titleInput, contentInput });
                alert('Erro: Campos não encontrados. Por favor, recarregue a página.');
                return;
            }
            
            const title = titleInput.value.trim();
            const content = contentInput.value.trim();
            
            if (!title || !content) {
                alert('Por favor, preencha todos os campos!');
                return;
            }
            
            const note = {
                id: Date.now(),
                title: title,
                content: content,
                date: new Date().toLocaleDateString('pt-BR'),
                stickers: []
            };
            
            plannerData.notes.push(note);
            savePlannerData();
            renderNotes();
            closeAddNoteModal();
        });
    }
    
    // Fechar modais ao clicar fora
    document.querySelectorAll('.planner-modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Seleção de capas
    document.querySelectorAll('.cover-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.cover-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            document.getElementById('book-cover').value = this.getAttribute('data-cover');
        });
    });
    
    // Inicializar primeira capa como selecionada
    const firstCover = document.querySelector('.cover-option[data-cover="lavender"]');
    if (firstCover) {
        firstCover.classList.add('selected');
    }
});

// Deletar Livro
function deleteBook(index) {
    if (confirm('Tem certeza que deseja remover este livro?')) {
        plannerData.books.splice(index, 1);
        savePlannerData();
        const activeStatus = document.querySelector('.status-tab.active').getAttribute('data-status');
        renderBooks(activeStatus);
        updateGoals();
        // Sincronizar com a biblioteca unificada
        if (typeof renderUnifiedLibrary === 'function') {
            renderUnifiedLibrary('all');
        }
    }
}

// Metas de Leitura
function initGoals() {
    if (plannerData.goals.yearly) {
        document.getElementById('yearly-goal').value = plannerData.goals.yearly;
    }
    if (plannerData.goals.monthly) {
        document.getElementById('monthly-goal').value = plannerData.goals.monthly;
    }
    
    // Salvar metas ao alterar
    document.getElementById('yearly-goal').addEventListener('change', function() {
        plannerData.goals.yearly = parseInt(this.value) || 0;
        savePlannerData();
        updateGoals();
    });
    
    document.getElementById('monthly-goal').addEventListener('change', function() {
        plannerData.goals.monthly = parseInt(this.value) || 0;
        savePlannerData();
        updateGoals();
    });
    
    updateGoals();
}

function updateGoals() {
    const readBooks = plannerData.books.filter(book => book.status === 'read');
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyRead = readBooks.filter(book => {
        if (!book.endDate) return false;
        const endDate = new Date(book.endDate);
        return endDate.getMonth() === currentMonth && endDate.getFullYear() === currentYear;
    }).length;
    
    // Meta Anual
    const yearlyGoal = plannerData.goals.yearly || 0;
    const yearlyRead = readBooks.length;
    const yearlyPercent = yearlyGoal > 0 ? Math.min((yearlyRead / yearlyGoal) * 100, 100) : 0;
    
    document.getElementById('yearly-count').textContent = `${yearlyRead} / ${yearlyGoal}`;
    document.getElementById('yearly-progress').style.width = `${yearlyPercent}%`;
    
    // Meta Mensal
    const monthlyGoal = plannerData.goals.monthly || 0;
    const monthlyPercent = monthlyGoal > 0 ? Math.min((monthlyRead / monthlyGoal) * 100, 100) : 0;
    
    document.getElementById('monthly-count').textContent = `${monthlyRead} / ${monthlyGoal}`;
    document.getElementById('monthly-progress').style.width = `${monthlyPercent}%`;
}

// Anotações
function initNotes() {
    renderNotes();
}

function renderNotes() {
    const container = document.getElementById('notes-list');
    const notes = plannerData.notes;
    
    if (notes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>📝 Nenhuma anotação ainda...</p>
                <p>Comece a escrever suas anotações sobre os livros!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = notes.map((note, index) => {
        // Renderizar stickers da anotação
        const stickersHTML = note.stickers && note.stickers.length > 0 
            ? note.stickers.map((sticker, stickerIndex) => {
                const stickerConfig = getStickerConfig(sticker.id || sticker);
                if (!stickerConfig) return '';
                const stickerId = sticker.id || sticker;
                return `
                    <div class="note-sticker-item" 
                         style="left: ${sticker.x || 0}px; top: ${sticker.y || 0}px;" 
                         data-sticker-id="${stickerId}"
                         data-note-index="${index}"
                         data-sticker-index="${stickerIndex}">
                        <div class="sticker-premium-new ${stickerConfig.class}-new">
                            <div class="sticker-icon-new">${stickerConfig.icon}</div>
                            ${stickerConfig.type !== 'decoration' ? `<div class="sticker-text-new">${stickerConfig.label}</div>` : ''}
                            <div class="sticker-shine-new"></div>
                        </div>
                        <button class="note-sticker-remove" onclick="removeStickerFromNote(${index}, '${stickerId}')">×</button>
                    </div>
                `;
            }).join('')
            : '';
        
        return `
        <div class="note-card" data-note-index="${index}">
            <div class="note-card-header">
                <h4 class="note-card-title">${note.title}</h4>
                <button class="note-delete-btn" onclick="deleteNote(${index})" title="Remover">×</button>
            </div>
            <p class="note-card-date">📅 ${note.date}</p>
            <p class="note-card-content">${note.content}</p>
            <div class="note-stickers-area" data-note-id="${note.id}">
                ${stickersHTML}
            </div>
        </div>
    `;
    }).join('');
    
    // Inicializar drag and drop para as anotações
    initNoteStickerDrop();
    
    // Inicializar drag para stickers dentro das anotações
    initNoteStickerDrag();
}

function openAddNoteModal() {
    const modal = document.getElementById('add-note-modal');
    if (!modal) {
        console.error('Modal não encontrado!');
        alert('Erro: Modal não encontrado. Por favor, recarregue a página.');
        return;
    }
    
    // Garantir que o modal está visível
    modal.style.display = 'flex';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    document.body.style.overflow = 'hidden';
    
    // Limpar campos
    const titleInput = document.getElementById('note-title');
    const contentInput = document.getElementById('note-content');
    if (titleInput) titleInput.value = '';
    if (contentInput) contentInput.value = '';
    
    // Focar no primeiro campo após um pequeno delay
    setTimeout(() => {
        if (titleInput) {
            titleInput.focus();
            titleInput.click(); // Garantir que está clicável
        }
    }, 150);
}

function closeAddNoteModal() {
    document.getElementById('add-note-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('add-note-form').reset();
}

function deleteNote(index) {
    if (confirm('Tem certeza que deseja remover esta anotação?')) {
        plannerData.notes.splice(index, 1);
        savePlannerData();
        renderNotes();
    }
}

// Sistema de Stickers
function initStickers() {
    const canvas = document.getElementById('sticker-canvas');
    if (!canvas) return;
    
    // Carregar stickers salvos
    if (plannerData.stickers && plannerData.stickers.length > 0) {
        plannerData.stickers.forEach(sticker => {
            addStickerToCanvas(sticker.id || sticker.text, sticker.x, sticker.y);
        });
    }
}

function initDragAndDrop() {
    const stickerItems = document.querySelectorAll('.sticker-item:not([data-drag-initialized])');
    const canvas = document.getElementById('sticker-canvas');
    
    stickerItems.forEach(item => {
        const stickerId = item.getAttribute('data-sticker');
        item.setAttribute('data-drag-initialized', 'true');
        
        // Suporte para drag HTML5 (desktop)
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', stickerId);
            e.dataTransfer.effectAllowed = 'copy';
        });
        
        // Suporte para touch (iPad/mobile) - melhorado
        let touchStartX, touchStartY;
        let isDragging = false;
        let touchStartTime;
        
        item.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchStartTime = Date.now();
            isDragging = false;
            
            // Adicionar classe visual de arrastando
            this.style.opacity = '0.7';
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'none';
        }, { passive: false });
        
        item.addEventListener('touchmove', function(e) {
            if (!touchStartX || !touchStartY) return;
            e.preventDefault();
            
            const touch = e.touches[0];
            const deltaX = Math.abs(touch.clientX - touchStartX);
            const deltaY = Math.abs(touch.clientY - touchStartY);
            
            // Se moveu mais de 10px, considera como drag
            if (deltaX > 10 || deltaY > 10) {
                isDragging = true;
                this.style.opacity = '0.5';
                this.style.transform = 'scale(1.15)';
                
                // Mover visualmente o sticker
                const offsetX = touch.clientX - touchStartX;
                const offsetY = touch.clientY - touchStartY;
                this.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(1.15)`;
            }
        }, { passive: false });
        
        item.addEventListener('touchend', function(e) {
            if (!touchStartX || !touchStartY) {
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
                this.style.transition = '';
                return;
            }
            
            const touch = e.changedTouches[0];
            
            // Reset visual
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
            this.style.transition = '';
            
            if (!isDragging) {
                touchStartX = null;
                touchStartY = null;
                return;
            }
            
            // Encontrar elemento onde foi solto
            const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
            
            // Verificar se soltou em uma área de drop
            const noteArea = targetElement?.closest('.note-stickers-area');
            const canvasArea = targetElement?.closest('.sticker-canvas');
            
            if (noteArea) {
                const noteId = parseInt(noteArea.getAttribute('data-note-id'));
                const rect = noteArea.getBoundingClientRect();
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                addStickerToNote(noteId, stickerId, x, y);
            } else if (canvasArea) {
                const rect = canvasArea.getBoundingClientRect();
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                addStickerToCanvas(stickerId, x, y);
            }
            
            touchStartX = null;
            touchStartY = null;
            isDragging = false;
        }, { passive: false });
        
        item.addEventListener('touchcancel', function(e) {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
            this.style.transition = '';
            touchStartX = null;
            touchStartY = null;
            isDragging = false;
        }, { passive: false });
    });
    
    if (canvas) {
        canvas.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });
        
        canvas.addEventListener('drop', function(e) {
            e.preventDefault();
            const stickerId = e.dataTransfer.getData('text/plain');
            if (stickerId === 'move') return;
            
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            addStickerToCanvas(stickerId, x, y);
        });
    }
}

// Inicializar drop de stickers nas anotações
function initNoteStickerDrop() {
    const noteAreas = document.querySelectorAll('.note-stickers-area');
    
    noteAreas.forEach(area => {
        // Suporte para drag HTML5 (desktop)
        area.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            this.style.backgroundColor = 'rgba(230, 213, 247, 0.3)';
        });
        
        area.addEventListener('dragleave', function(e) {
            this.style.backgroundColor = 'transparent';
        });
        
        area.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.backgroundColor = 'transparent';
            
            const stickerId = e.dataTransfer.getData('text/plain');
            if (!stickerId || stickerId === 'move') return;
            
            const noteId = parseInt(this.getAttribute('data-note-id'));
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            addStickerToNote(noteId, stickerId, x, y);
        });
    });
}

// Adicionar sticker a uma anotação
function addStickerToNote(noteId, stickerId, x, y) {
    const note = plannerData.notes.find(n => n.id === noteId);
    if (!note) return;
    
    if (!note.stickers) {
        note.stickers = [];
    }
    
    // Verificar se já existe o sticker (evitar duplicatas muito próximas)
    const existingSticker = note.stickers.find(s => {
        const sId = s.id || s;
        const sX = s.x || 0;
        const sY = s.y || 0;
        return sId === stickerId && Math.abs(sX - x) < 30 && Math.abs(sY - y) < 30;
    });
    
    if (existingSticker) return;
    
    note.stickers.push({
        id: stickerId,
        x: x,
        y: y
    });
    
    savePlannerData();
    renderNotes();
}

// Remover sticker de uma anotação
function removeStickerFromNote(noteIndex, stickerId) {
    const note = plannerData.notes[noteIndex];
    if (!note || !note.stickers) return;
    
    note.stickers = note.stickers.filter(s => {
        const sId = s.id || s;
        return sId !== stickerId;
    });
    
    savePlannerData();
    renderNotes();
}

// Inicializar drag para stickers dentro das anotações
function initNoteStickerDrag() {
    const noteStickers = document.querySelectorAll('.note-sticker-item');
    
    noteStickers.forEach(sticker => {
        let isDragging = false;
        let offsetX, offsetY;
        let startX, startY;
        
        // Mouse events (desktop)
        sticker.addEventListener('mousedown', function(e) {
            if (e.target.classList.contains('note-sticker-remove')) return;
            e.preventDefault();
            isDragging = true;
            const rect = this.getBoundingClientRect();
            const area = this.closest('.note-stickers-area');
            const areaRect = area.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            startX = parseInt(this.style.left) || 0;
            startY = parseInt(this.style.top) || 0;
            this.style.transition = 'none';
            this.style.zIndex = '100';
        });
        
        // Touch events (iPad/mobile)
        sticker.addEventListener('touchstart', function(e) {
            if (e.target.classList.contains('note-sticker-remove')) return;
            e.preventDefault();
            isDragging = true;
            const touch = e.touches[0];
            const rect = this.getBoundingClientRect();
            const area = this.closest('.note-stickers-area');
            const areaRect = area.getBoundingClientRect();
            offsetX = touch.clientX - rect.left;
            offsetY = touch.clientY - rect.top;
            startX = parseInt(this.style.left) || 0;
            startY = parseInt(this.style.top) || 0;
            this.style.transition = 'none';
            this.style.zIndex = '100';
        }, { passive: false });
        
        const handleMove = function(e) {
            if (!isDragging) return;
            
            const area = sticker.closest('.note-stickers-area');
            if (!area) return;
            
            const areaRect = area.getBoundingClientRect();
            let clientX, clientY;
            
            if (e.touches) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            
            const newX = clientX - areaRect.left - offsetX;
            const newY = clientY - areaRect.top - offsetY;
            
            // Limitar dentro da área
            const stickerRect = sticker.getBoundingClientRect();
            const maxX = area.offsetWidth - stickerRect.width;
            const maxY = area.offsetHeight - stickerRect.height;
            
            const finalX = Math.max(0, Math.min(newX, maxX));
            const finalY = Math.max(0, Math.min(newY, maxY));
            
            sticker.style.left = `${finalX}px`;
            sticker.style.top = `${finalY}px`;
        };
        
        const handleEnd = function() {
            if (!isDragging) return;
            isDragging = false;
            sticker.style.transition = 'transform 0.2s ease';
            sticker.style.zIndex = '10';
            
            // Salvar nova posição
            const noteIndex = parseInt(sticker.getAttribute('data-note-index'));
            const stickerId = sticker.getAttribute('data-sticker-id');
            const note = plannerData.notes[noteIndex];
            
            if (note && note.stickers) {
                const stickerData = note.stickers.find(s => (s.id || s) === stickerId);
                if (stickerData) {
                    stickerData.x = parseInt(sticker.style.left) || 0;
                    stickerData.y = parseInt(sticker.style.top) || 0;
                    savePlannerData();
                }
            }
        };
        
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        document.addEventListener('touchmove', handleMove, { passive: false });
        document.addEventListener('touchend', handleEnd);
        document.addEventListener('touchcancel', handleEnd);
    });
}

function addStickerToCanvas(stickerId, x, y) {
    const canvas = document.getElementById('sticker-canvas');
    if (!canvas) return;
    
    const stickerConfig = getStickerConfig(stickerId);
    if (!stickerConfig) {
        // Se não encontrar config, usar como emoji simples
        const sticker = document.createElement('div');
        sticker.className = 'canvas-sticker';
        sticker.textContent = stickerId;
        sticker.style.left = `${x}px`;
        sticker.style.top = `${y}px`;
        sticker.draggable = true;
        setupStickerDrag(sticker);
        canvas.appendChild(sticker);
        saveStickers();
        return;
    }
    
    const sticker = document.createElement('div');
    sticker.className = stickerConfig.type === 'decoration' ? 'canvas-sticker decorative' : 'canvas-sticker';
    sticker.setAttribute('data-sticker-id', stickerId);
    
    // Criar sticker premium NOVO (design renovado)
    const premiumSticker = document.createElement('div');
    premiumSticker.className = stickerConfig.type === 'decoration' 
        ? `sticker-premium-new decorative ${stickerConfig.class}-new`
        : `sticker-premium-new ${stickerConfig.class}-new`;
    
    // Adicionar ícone
    const icon = document.createElement('div');
    icon.className = stickerConfig.type === 'decoration' ? 'sticker-icon-large-new' : 'sticker-icon-new';
    icon.textContent = stickerConfig.icon || stickerConfig.label.split(' ')[0];
    premiumSticker.appendChild(icon);
    
    // Adicionar texto (se não for decorativo)
    if (stickerConfig.type !== 'decoration') {
        const text = document.createElement('div');
        text.className = 'sticker-text-new';
        text.textContent = stickerConfig.label.replace(/[^\w\s]/g, '').trim();
        premiumSticker.appendChild(text);
    }
    
    sticker.appendChild(premiumSticker);
    sticker.style.left = `${x}px`;
    sticker.style.top = `${y}px`;
    sticker.draggable = true;
    
    setupStickerDrag(sticker);
    
    // Botão para remover
    const removeBtn = document.createElement('button');
    removeBtn.className = 'sticker-remove-btn';
    removeBtn.textContent = '×';
    removeBtn.onclick = function() {
        sticker.remove();
        saveStickers();
    };
    sticker.appendChild(removeBtn);
    
    canvas.appendChild(sticker);
    saveStickers();
}

function setupStickerDrag(sticker) {
    let isDragging = false;
    let offsetX, offsetY;
    let currentX, currentY;
    
    // Prevenir drag padrão do HTML5
    sticker.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Suporte para mouse (desktop)
    sticker.addEventListener('mousedown', function(e) {
        if (e.target.classList.contains('sticker-remove-btn')) return;
        e.preventDefault();
        isDragging = true;
        const canvas = document.getElementById('sticker-canvas');
        const rect = sticker.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        sticker.style.transition = 'none';
        sticker.style.cursor = 'grabbing';
        sticker.style.zIndex = '100';
    });
    
    // Suporte para touch (tablet/mobile)
    sticker.addEventListener('touchstart', function(e) {
        if (e.target.classList.contains('sticker-remove-btn')) return;
        e.preventDefault();
        isDragging = true;
        const touch = e.touches[0];
        const canvas = document.getElementById('sticker-canvas');
        const rect = sticker.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;
        sticker.style.transition = 'none';
        sticker.style.zIndex = '100';
    });
    
    const handleMove = function(e) {
        if (!isDragging) return;
        
        const canvas = document.getElementById('sticker-canvas');
        if (!canvas) return;
        
        const canvasRect = canvas.getBoundingClientRect();
        let clientX, clientY;
        
        // Detectar se é touch ou mouse
        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        // Calcular nova posição
        currentX = clientX - canvasRect.left - offsetX;
        currentY = clientY - canvasRect.top - offsetY;
        
        // Limitar dentro do canvas
        const stickerRect = sticker.getBoundingClientRect();
        const maxX = canvas.offsetWidth - stickerRect.width;
        const maxY = canvas.offsetHeight - stickerRect.height;
        
        currentX = Math.max(0, Math.min(currentX, maxX));
        currentY = Math.max(0, Math.min(currentY, maxY));
        
        sticker.style.left = `${currentX}px`;
        sticker.style.top = `${currentY}px`;
    };
    
    const handleEnd = function() {
        if (isDragging) {
            isDragging = false;
            sticker.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
            sticker.style.cursor = 'grab';
            sticker.style.zIndex = '1';
            saveStickers();
        }
    };
    
    // Event listeners para mouse
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    
    // Event listeners para touch
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    document.addEventListener('touchcancel', handleEnd);
}

function saveStickers() {
    const canvas = document.getElementById('sticker-canvas');
    if (!canvas) return;
    
    const stickers = Array.from(canvas.querySelectorAll('.canvas-sticker')).map(sticker => {
        const stickerId = sticker.getAttribute('data-sticker-id') || sticker.textContent.replace('×', '').trim();
        return {
            id: stickerId,
            x: parseInt(sticker.style.left) || 0,
            y: parseInt(sticker.style.top) || 0
        };
    });
    
    plannerData.stickers = stickers;
    savePlannerData();
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    initPlanner();
    
    // Re-inicializar drag and drop quando novos elementos são adicionados
    const observer = new MutationObserver(function() {
        // Re-inicializar apenas se houver novos sticker-items
        const allStickerItems = document.querySelectorAll('.sticker-item');
        if (allStickerItems.length > 0) {
            // Verificar se já foram inicializados
            const firstItem = allStickerItems[0];
            if (!firstItem.hasAttribute('data-drag-initialized')) {
                initDragAndDrop();
                allStickerItems.forEach(item => {
                    item.setAttribute('data-drag-initialized', 'true');
                });
            }
        }
    });
    
    // Observar mudanças no DOM da seção de planner
    const plannerSection = document.getElementById('planner-section');
    if (plannerSection) {
        observer.observe(plannerSection, {
            childList: true,
            subtree: true
        });
    }
});

