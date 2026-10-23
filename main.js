document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const navigation = document.getElementById("primary-navigation");

    if (menuToggle && navigation) {
        const closeMenu = () => {
            navigation.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Abrir menu");
            menuToggle.innerHTML = '<i class="ph ph-list" aria-hidden="true"></i>';
        };

        menuToggle.addEventListener("click", () => {
            const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
            navigation.classList.toggle("is-open", !isOpen);
            menuToggle.setAttribute("aria-expanded", String(!isOpen));
            menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
            menuToggle.innerHTML = isOpen
                ? '<i class="ph ph-list" aria-hidden="true"></i>'
                : '<i class="ph ph-x" aria-hidden="true"></i>';
        });

        navigation.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
                closeMenu();
                menuToggle.focus();
            }
        });

        window.matchMedia("(min-width: 48rem)").addEventListener("change", closeMenu);
    }

    const revealElements = document.querySelectorAll("[data-reveal]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reduceMotion && "IntersectionObserver" in window) {
        document.body.classList.add("motion-ready");
        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                currentObserver.unobserve(entry.target);
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -4% 0px"
        });

        revealElements.forEach((element) => {
            const delay = Number(element.dataset.revealDelay);
            if (Number.isFinite(delay) && delay > 0) {
                element.style.transitionDelay = `${delay}ms`;
            }
            observer.observe(element);
        });
    }

    const lightbox = document.getElementById("image-lightbox");
    const lightboxImage = lightbox?.querySelector(".lightbox-image");
    const lightboxClose = lightbox?.querySelector(".lightbox-close");
    let lastTrigger = null;

    if (lightbox && lightboxImage && lightboxClose) {
        const closeLightbox = () => {
            lightbox.hidden = true;
            document.body.classList.remove("lightbox-open");
            lightboxImage.src = "";
            if (lastTrigger instanceof HTMLElement) lastTrigger.focus();
        };

        document.querySelectorAll("[data-certificate-image]").forEach((trigger) => {
            trigger.addEventListener("click", () => {
                const imageSource = trigger.getAttribute("data-certificate-image");
                const image = trigger.querySelector("img");
                if (!imageSource || !image) return;

                lastTrigger = trigger;
                lightboxImage.src = imageSource;
                lightboxImage.alt = image.alt;
                lightbox.hidden = false;
                document.body.classList.add("lightbox-open");
                lightboxClose.focus();
            });
        });

        lightboxClose.addEventListener("click", closeLightbox);
        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) closeLightbox();
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
        });
    }
});
