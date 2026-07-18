// Rotating word in the hero headline.
function initRotator() {
    const el = document.querySelector('[data-rotator]');
    if (!el) return;

    let words;
    try {
        words = JSON.parse(el.dataset.rotator);
    } catch {
        return;
    }
    if (!Array.isArray(words) || words.length < 2) return;

    let i = 0;
    setInterval(() => {
        i = (i + 1) % words.length;
        el.textContent = words[i];
    }, 2400);
}

// Fade elements in as they scroll into view.
function initReveal() {
    const items = document.querySelectorAll('.pd-reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('is-revealed'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.14 }
    );

    items.forEach((el) => observer.observe(el));
}

// Cursor-following glow behind the hero.
function initSpotlight() {
    if (!document.querySelector('.pd-hero__spotlight')) return;

    window.addEventListener(
        'mousemove',
        (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            document.documentElement.style.setProperty('--pd-mx', `${x}%`);
            document.documentElement.style.setProperty('--pd-my', `${y}%`);
        },
        { passive: true }
    );
}

function initNav() {
    const toggle = document.querySelector('[data-nav-toggle]');
    const nav = document.querySelector('[data-nav]');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            nav.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// Click a gallery photo to view it enlarged in an overlay.
function initLightbox() {
    const triggers = document.querySelectorAll('[data-lightbox]');
    if (!triggers.length) return;

    const overlay = document.createElement('div');
    overlay.className = 'pd-lightbox';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
        '<button type="button" class="pd-lightbox__close" aria-label="Tutup">&times;</button>' +
        '<figure class="pd-lightbox__figure"><img alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(overlay);

    const image = overlay.querySelector('img');
    const caption = overlay.querySelector('figcaption');

    const open = (src, alt) => {
        image.src = src;
        image.alt = alt;
        caption.textContent = alt;
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('pd-no-scroll');
    };

    const close = () => {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('pd-no-scroll');
        image.src = '';
    };

    triggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            const img = trigger.querySelector('img');
            if (img) open(img.currentSrc || img.src, img.alt);
        });
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.closest('.pd-lightbox__close')) close();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });
}

// Smooth-scroll in-page anchors, offset for the sticky header.
function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href').slice(1);
            const target = id && document.getElementById(id);
            if (!target) return;

            e.preventDefault();
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - 68,
                behavior: 'smooth',
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initRotator();
    initReveal();
    initSpotlight();
    initNav();
    initLightbox();
    initAnchors();
});
