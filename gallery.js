// Array com todas as fotos da Juliana
const galleryPhotos = [
    'img/imgi_1_464977300_1074198863843257_6059726011581254789_n.jpg',
    'img/imgi_3_497515860_18502833742042026_1440285849875779313_n.jpg',
    'img/imgi_7_573737232_18190484689331544_4641095747183204839_n.jpg',
    'img/imgi_11_501550844_18505324474042026_556641578490412574_n.jpg',
    'img/imgi_12_500526272_18505323265042026_8091151984085872581_n.jpg',
    'img/imgi_13_502171267_18505322668042026_2806811282571755188_n.jpg',
    'img/imgi_14_500514083_18504798991042026_329275683500636744_n.jpg',
    'img/imgi_15_501699690_18504798625042026_2981423335283055158_n.jpg',
    'img/imgi_16_500784331_18504797671042026_7202288295513094113_n.jpg',
    'img/imgi_17_500769467_18504736870042026_1497743995295509992_n.jpg',
    'img/imgi_18_501070525_18504732442042026_6530059680728434051_n.jpg',
    'img/imgi_19_500092780_18504696697042026_4329839119274432191_n.jpg',
    'img/imgi_20_500129315_18504298009042026_2480490463074346266_n.jpg',
    'img/imgi_21_499939866_18504297724042026_7793189487945515198_n.jpg',
    'img/imgi_22_500056322_18504297313042026_45529357182907627_n.jpg',
    'img/imgi_31_503164701_1136691851836179_3456453190905884790_n.jpg',
    'img/imgi_32_460353911_505394012275207_6465074399200138766_n.jpg',
    'img/imgi_34_580991754_18082369298097708_5211100068733986743_n.jpg',
    'img/imgi_35_497515860_18502833742042026_1440285849875779313_n.jpg',
    'img/imgi_36_497427646_18502892359042026_2562234633965230965_n.jpg',
    'img/imgi_36_500477712_18504296353042026_3358099759724014019_n.jpg',
    'img/imgi_39_573737232_18190484689331544_4641095747183204839_n.jpg'
];

// Função para verificar se a imagem existe antes de adicionar
function imageExists(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src;
    });
}

// Memórias fofas sobre ela
const photoMemories = [
    "Você mais linda que a Torre Eiffel",
    "Meu mundo inteiro",
    "Perfeição em pessoa",
    "Minha razão de sorrir",
    "Você é tudo",
    "Minha estrela mais brilhante",
    "A pessoa mais especial do mundo",
    "Minha felicidade",
    "Você ilumina meus dias",
    "Minha paixão",
    "A mulher dos meus sonhos",
    "Minha inspiração",
    "Você é perfeita",
    "Minha alegria",
    "A razão do meu sorriso",
    "Minha vida",
    "Você é incrível",
    "Minha paz",
    "A melhor parte do meu dia",
    "Minha eternidade",
    "Você é única",
    "Minha felicidade completa"
];

// Inicializar carrossel com Torre Eiffel
function initGallery() {
    const carousel = document.getElementById('photo-carousel');
    if (!carousel) return;
    
    const totalPhotos = galleryPhotos.length;
    const delayStep = 30 / totalPhotos; // 30 segundos dividido pelo número de fotos
    
    galleryPhotos.forEach((photo, index) => {
        const photoItem = document.createElement('div');
        photoItem.className = 'carousel-photo';
        const delay = -(index * delayStep);
        photoItem.style.animationDelay = `${delay}s`;
        
        const memory = photoMemories[index] || "Minha memória favorita";
        
        photoItem.innerHTML = `
            <div class="carousel-photo-wrapper camera-effect" onclick="openPhotoModal('${photo}')">
                <div class="camera-frame">
                    <div class="camera-flash"></div>
                    <img src="${photo}" alt="Lembrança ${index + 1}" class="carousel-image" loading="lazy">
                    <div class="photo-memory">${memory}</div>
                </div>
                <div class="carousel-overlay">
                    <span class="carousel-heart">💕</span>
                </div>
            </div>
        `;
        
        carousel.appendChild(photoItem);
    });
}

// Abrir modal com foto em tamanho grande
function openPhotoModal(photoSrc) {
    event.stopPropagation();
    const modal = document.getElementById('photo-modal');
    const modalImg = document.getElementById('modal-photo-img');
    
    if (modal && modalImg) {
        modalImg.src = photoSrc;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Fechar modal de foto
function closePhotoModal() {
    const modal = document.getElementById('photo-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Fechar modal ao clicar fora da imagem
document.addEventListener('DOMContentLoaded', function() {
    initGallery();
    
    const photoModal = document.getElementById('photo-modal');
    const closeBtn = document.querySelector('.close-photo-modal');
    
    if (photoModal) {
        // Suporte para click e touch
        photoModal.addEventListener('click', function(e) {
            if (e.target === photoModal) {
                closePhotoModal();
            }
        });
        
        // Suporte para touch em mobile
        photoModal.addEventListener('touchend', function(e) {
            if (e.target === photoModal) {
                e.preventDefault();
                closePhotoModal();
            }
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closePhotoModal();
        });
    }
    
    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePhotoModal();
        }
    });
});

