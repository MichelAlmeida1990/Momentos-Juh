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

// Inicializar Livros - Design 3D Criativo
function initBooks() {
    // Livros da Colleen Hoover
    const colleenContainer = document.getElementById('colleen-books');
    if (colleenContainer) {
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
    
    // Outros livros
    const otherContainer = document.getElementById('other-books');
    if (otherContainer) {
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
