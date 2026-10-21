// Background 3D Interativo usando Three.js
function init3DBackground() {
    const canvas = document.getElementById('canvas-3d');
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Grupo de Objetos 3D
    const cubesGroup = new THREE.Group();
    scene.add(cubesGroup);

    // Material com borda vermelha e brilho estilo Obsidian Red
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    
    for (let i = 0; i < 45; i++) {
        const material = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0xff2a4b : 0x1d2030,
            wireframe: true,
            transparent: true,
            opacity: Math.random() * 0.4 + 0.1
        });

        const cube = new THREE.Mesh(geometry, material);
        cube.position.x = (Math.random() - 0.5) * 16;
        cube.position.y = (Math.random() - 0.5) * 16;
        cube.position.z = (Math.random() - 0.5) * 16;

        cube.rotation.x = Math.random() * Math.PI;
        cube.rotation.y = Math.random() * Math.PI;

        const scale = Math.random() * 0.6 + 0.2;
        cube.scale.set(scale, scale, scale);

        cubesGroup.add(cube);
    }

    camera.position.z = 8;

    // Rotação suave baseada no ponteiro do mouse
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    // Loop de Animação
    function animate() {
        requestAnimationFrame(animate);

        cubesGroup.rotation.x += 0.0015;
        cubesGroup.rotation.y += 0.002;

        cubesGroup.rotation.x += (mouseY * 0.2 - cubesGroup.rotation.x) * 0.05;
        cubesGroup.rotation.y += (mouseX * 0.2 - cubesGroup.rotation.y) * 0.05;

        renderer.render(scene, camera);
    }

    animate();

    // Redimensionamento de Janela
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function initScrollReveals() {
    const elements = document.querySelectorAll('[data-reveal]');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
        elements.forEach((element) => element.classList.add('is-visible'));
        return;
    }

    document.body.classList.add('motion-ready');

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('is-visible');
            currentObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -6% 0px'
    });

    elements.forEach((element) => {
        const delay = Number(element.dataset.revealDelay);
        if (Number.isFinite(delay) && delay > 0) {
            element.style.setProperty('--reveal-delay', `${delay}ms`);
        }
        observer.observe(element);
    });
}

// Funções do Modal Lightbox para Certificados
function openModal(imgSrc) {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    if (modal && modalImg) {
        modalImg.src = imgSrc;
        modal.classList.remove('hidden');
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Inicialização ao carregar o DOM
document.addEventListener("DOMContentLoaded", () => {
    init3DBackground();
    initScrollReveals();

    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNavigation = document.getElementById('mobile-navigation');
    const menuIcon = menuToggle?.querySelector('i');

    if (menuToggle && mobileNavigation && menuIcon) {
        const closeMobileMenu = () => {
            mobileNavigation.classList.add('hidden');
            mobileNavigation.classList.remove('flex');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Abrir menu');
            menuIcon.classList.replace('ph-x', 'ph-list');
        };

        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

            if (isExpanded) {
                closeMobileMenu();
                return;
            }

            mobileNavigation.classList.remove('hidden');
            mobileNavigation.classList.add('flex');
            menuToggle.setAttribute('aria-expanded', 'true');
            menuToggle.setAttribute('aria-label', 'Fechar menu');
            menuIcon.classList.replace('ph-list', 'ph-x');
        });

        mobileNavigation.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', closeMobileMenu);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
                closeMobileMenu();
                menuToggle.focus();
            }
        });
    }
});