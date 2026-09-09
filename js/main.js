// HTML includes are now inlined — includeHTML() is no longer needed

// The page always renders with "O Nosso Compromisso" as the default active
// tab, but browsers restore the last scroll position on reload/back-forward
// nav by default, which can land you deep inside whatever tab was open
// last time even though a different tab is now the one actually showing.
// Forcing manual restoration plus a scroll-to-top keeps reloads landing on
// the default tab's content.
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.addEventListener('load', () => window.scrollTo(0, 0));
window.addEventListener('pageshow', (e) => {
    if (e.persisted) window.scrollTo(0, 0);
});

function setupMoreDetailsLinks() {
    // Select all links that have "details_rota_castelos.html" in the href
    document.querySelectorAll('a[href*="details_rota_castelos.html"]').forEach(link => {
        // Remove existing click listeners to avoid duplicates
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);

        newLink.addEventListener('click', function (e) {
            // Prevent the default navigation
            e.preventDefault();

            // Find the currently active language
            const currentLang = document.querySelector('[data-lang-inline].active').getAttribute('data-lang-inline');

            // Get the base URL without any existing parameters
            let baseUrl = this.href.split('?')[0];

            // Navigate to the URL with the language parameter
            window.location.href = `${baseUrl}?lang=${currentLang}`;
        });
    });
    document.querySelectorAll('a[href*="details_maravilhas_arrabida.html"]').forEach(link => {
        // Remove existing click listeners to avoid duplicates
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);

        newLink.addEventListener('click', function (e) {
            // Prevent the default navigation
            e.preventDefault();

            // Find the currently active language
            const currentLang = document.querySelector('[data-lang-inline].active').getAttribute('data-lang-inline');

            // Get the base URL without any existing parameters
            let baseUrl = this.href.split('?')[0];

            // Navigate to the URL with the language parameter
            window.location.href = `${baseUrl}?lang=${currentLang}`;
        });
    });
    document.querySelectorAll('a[href*="details_terras_do_cabo_espichel.html"]').forEach(link => {
        // Remove existing click listeners to avoid duplicates
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);

        newLink.addEventListener('click', function (e) {
            // Prevent the default navigation
            e.preventDefault();

            // Find the currently active language
            const currentLang = document.querySelector('[data-lang-inline].active').getAttribute('data-lang-inline');

            // Get the base URL without any existing parameters
            let baseUrl = this.href.split('?')[0];

            // Navigate to the URL with the language parameter
            window.location.href = `${baseUrl}?lang=${currentLang}`;
        });
    });
}



// Language switching functionality without using localStorage
function changeLanguage(lang) {
    document.querySelectorAll('[data-lang]').forEach(elem => {
        elem.classList.toggle('active', elem.getAttribute('data-lang') === lang);
    });
    document.querySelectorAll('[data-lang-inline]').forEach(elem => {
        elem.classList.toggle('active', elem.getAttribute('data-lang-inline') === lang);
    });

    // Update select options in both the main form and modal
    document.querySelectorAll('select option[data-' + lang + ']').forEach(option => {
        option.textContent = option.getAttribute('data-' + lang);
    });

    // Update mobile language selector value
    const mobileLangSelect = document.querySelector('#mobile-menu select');
    if (mobileLangSelect) {
        mobileLangSelect.value = lang;
    }

    document.documentElement.lang = lang;

    // Tab labels change width per language — reposition the sliding indicator
    updateTourTabIndicator();
}

// ─── Tabs (generic — supports multiple independent tab groups) ─
// Each `.tour-tabs` bar carries a `data-group`; its panels live
// anywhere under an element with a matching `data-panels`.
function updateTourTabIndicator(groupEl) {
    if (!groupEl) {
        document.querySelectorAll('.tour-tabs').forEach(el => updateTourTabIndicator(el));
        return;
    }

    const activeBtn = groupEl.querySelector('.tour-tab.active');
    const indicator = groupEl.querySelector('.tour-tab-indicator');
    if (!activeBtn || !indicator) return;

    indicator.style.width = `${activeBtn.offsetWidth}px`;
    indicator.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
}

function switchTourTab(button, tab) {
    const groupEl = button.closest('.tour-tabs');
    if (!groupEl || groupEl.dataset.active === tab) return;
    groupEl.dataset.active = tab;

    groupEl.querySelectorAll('.tour-tab').forEach(btn => {
        const isActive = btn.dataset.tab === tab;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', String(isActive));
    });
    updateTourTabIndicator(groupEl);

    const panelsContainer = document.querySelector(`[data-panels="${groupEl.dataset.group}"]`);
    if (!panelsContainer) return;

    // Scoped to direct children only — a tab group's panel can itself contain
    // a nested tab group (e.g. Discovery/Signature inside "Our Experiences"),
    // and an unscoped querySelector would match those inner panels instead.
    const nextPanel = panelsContainer.querySelector(`:scope > [data-panel="${tab}"]`);
    const currentPanel = panelsContainer.querySelector(':scope > .tab-panel:not(.tab-hidden)');

    if (currentPanel && currentPanel !== nextPanel) {
        currentPanel.classList.add('tab-fade');
        setTimeout(() => currentPanel.classList.add('tab-hidden'), 220);
    }

    if (nextPanel) {
        nextPanel.classList.add('tab-fade');
        nextPanel.classList.remove('tab-hidden');
        // Force reflow so the transition triggers instead of jump-cutting
        void nextPanel.offsetWidth;
        requestAnimationFrame(() => nextPanel.classList.remove('tab-fade'));
    }
}

window.addEventListener('resize', () => updateTourTabIndicator());

// Activates whichever tabs (outermost first) hide `target`, so anchor links
// into tab content (e.g. nav "#about" reaching into the Compromisso tab)
// land on visible content instead of a display:none element.
function revealAnchorTarget(target) {
    const hiddenPanels = [];
    let el = target.parentElement;
    while (el) {
        if (el.classList.contains('tab-panel') && el.classList.contains('tab-hidden')) {
            hiddenPanels.unshift(el);
        }
        el = el.parentElement;
    }

    hiddenPanels.forEach(panel => {
        const group = panel.closest('[data-panels]');
        if (!group) return;
        const tabsBar = document.querySelector(`.tour-tabs[data-group="${group.dataset.panels}"]`);
        const tabBtn = tabsBar && tabsBar.querySelector(`.tour-tab[data-tab="${panel.dataset.panel}"]`);
        if (tabBtn) switchTourTab(tabBtn, panel.dataset.panel);
    });

    return hiddenPanels.length > 0;
}

document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;

    if (revealAnchorTarget(target)) {
        e.preventDefault();
        // Wait for the tab-switch fade (220ms) before scrolling.
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 260);
    }
});

// Crossfades between the hero background videos instead of hard-cutting,
// looping the sequence. The next clip is preloaded on the hidden video
// element while the visible one plays, so there's no stall when it swaps in.
const heroVideoPlaylist = ['Videos/site/hero.mp4', 'Videos/site/van.mp4', 'Videos/site/van2.mp4'];
const heroCrossfadeMs = 1000;

function initializeHeroVideoSequence() {
    const videos = [
        document.getElementById('hero-video-a'),
        document.getElementById('hero-video-b'),
    ];
    if (!videos[0] || !videos[1]) return;

    let activeIndex = 0;
    let nextPlaylistIndex = 1 % heroVideoPlaylist.length;
    let transitioning = false;

    videos[0].src = heroVideoPlaylist[0];
    videos[0].play();
    videos[1].src = heroVideoPlaylist[nextPlaylistIndex];

    function crossfade() {
        if (transitioning) return;
        transitioning = true;

        const outgoing = videos[activeIndex];
        const incoming = videos[activeIndex === 0 ? 1 : 0];

        incoming.currentTime = 0;
        const playPromise = incoming.play();
        if (playPromise && playPromise.catch) playPromise.catch(() => {});

        incoming.classList.remove('opacity-0');
        incoming.classList.add('opacity-100');
        outgoing.classList.remove('opacity-100');
        outgoing.classList.add('opacity-0');

        activeIndex = activeIndex === 0 ? 1 : 0;

        setTimeout(function () {
            outgoing.pause();
            nextPlaylistIndex = (nextPlaylistIndex + 1) % heroVideoPlaylist.length;
            outgoing.src = heroVideoPlaylist[nextPlaylistIndex];
            transitioning = false;
        }, heroCrossfadeMs);
    }

    videos.forEach(function (video) {
        video.addEventListener('timeupdate', function () {
            if (videos[activeIndex] !== video || transitioning) return;
            if (video.duration && video.duration - video.currentTime < 1) {
                crossfade();
            }
        });
    });
}

let currentHeroSlide = 0;
let heroInterval;

function initializeHeroCarousel() {
    const carousel = document.getElementById('hero-carousel');
    if (!carousel) return;

    // Clear existing content
    carousel.innerHTML = '';

    // Add images — first is eager (preloaded), rest are lazy
    heroImages.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Hero image ${index + 1}`;
        img.loading = index === 0 ? 'eager' : 'lazy';
        img.className = `absolute w-full h-full object-cover ${index === 0 ? '' : 'hidden'}`;
        carousel.appendChild(img);
    });

    // Start automatic slideshow
    startHeroSlideshow();
}

function showHeroSlide(index) {
    const images = document.querySelectorAll('#hero-carousel img');
    images.forEach(img => img.classList.add('hidden'));
    images[index].classList.remove('hidden');
    currentHeroSlide = index;
}

function moveHeroSlide(direction) {
    // Reset the interval when manually changing slides
    clearInterval(heroInterval);

    const newIndex = (currentHeroSlide + direction + heroImages.length) % heroImages.length;
    showHeroSlide(newIndex);

    // Restart the slideshow
    startHeroSlideshow();
}

function startHeroSlideshow() {
    // Clear any existing interval
    clearInterval(heroInterval);

    // Set new interval
    heroInterval = setInterval(() => {
        moveHeroSlide(1);
    }, 5000); // Change slide every 5 seconds
}


// ─── Tour cards row (click-and-drag horizontal scroll) ──────
function initializeDraggableRows() {
    document.querySelectorAll('.tour-cards-row').forEach(row => {
        let isDown = false;
        let moved = false;
        let startX = 0;
        let startScrollLeft = 0;

        row.addEventListener('dragstart', e => e.preventDefault());

        row.addEventListener('mousedown', e => {
            // Let clicks on buttons/links (carousel arrows, dots, "More Details") behave normally
            if (e.target.closest('button, a')) return;
            isDown = true;
            moved = false;
            row.classList.add('dragging');
            startX = e.pageX;
            startScrollLeft = row.scrollLeft;
        });

        window.addEventListener('mousemove', e => {
            if (!isDown) return;
            const delta = e.pageX - startX;
            if (Math.abs(delta) > 4) moved = true;
            row.scrollLeft = startScrollLeft - delta;
        });

        window.addEventListener('mouseup', () => {
            isDown = false;
            row.classList.remove('dragging');
        });

        // Prevent the drag release from being interpreted as a card click
        row.addEventListener(
            'click',
            e => {
                if (moved) {
                    e.stopPropagation();
                    e.preventDefault();
                    moved = false;
                }
            },
            true
        );

        // Let a vertical mouse wheel scroll the row horizontally
        row.addEventListener(
            'wheel',
            e => {
                if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
                row.scrollLeft += e.deltaY;
                e.preventDefault();
            },
            { passive: false }
        );
    });
}

// Auto-rotating photo carousels inside the "Personalize" theme cards —
// each .theme-carousel just crossfades through whatever <img>s it contains.
function initializeThemeCarousels() {
    document.querySelectorAll('.theme-carousel').forEach(carousel => {
        const images = carousel.querySelectorAll('img');
        const dots = carousel.querySelectorAll('.theme-carousel-dot');
        if (images.length <= 1) return;

        let current = 0;
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                images[current].classList.remove('active');
                dots[current].classList.remove('active');
                current = index;
                images[current].classList.add('active');
                dots[current].classList.add('active');
            });
        });

        setInterval(() => {
            images[current].classList.remove('active');
            dots[current]?.classList.remove('active');
            current = (current + 1) % images.length;
            images[current].classList.add('active');
            dots[current]?.classList.add('active');
        }, 4000);
    });
}

// Function to initialize carousels
function initializeCarousels() {
    // For each tour in tourImages
    Object.keys(tourImages).forEach(tourId => {
        const carouselContainer = document.getElementById(`carousel-${tourId}`);
        if (!carouselContainer) return;

        // Clear existing content
        carouselContainer.innerHTML = '';

        // Add images — first visible immediately, rest lazy
        tourImages[tourId].forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Tour image ${index + 1}`;
            img.loading = index === 0 ? 'eager' : 'lazy';
            img.className = `carousel-image w-full h-full object-cover ${index === 0 ? '' : 'hidden'}`;
            carouselContainer.appendChild(img);
        });

        // Generate dots
        const dotsContainer = carouselContainer.parentElement.querySelector('.flex.justify-center');
        if (!dotsContainer) return;

        dotsContainer.innerHTML = '';
        tourImages[tourId].forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `carousel-dot w-2 h-2 rounded-full bg-white ${index === 0 ? 'bg-opacity-100' : 'bg-opacity-50'} hover:bg-opacity-100`;
            dot.addEventListener('click', (event) => {
                event.stopPropagation();
                showSlide(carouselContainer, index);
            });
            dotsContainer.appendChild(dot);
        });
    });
}

// Function to show a specific slide
function showSlide(container, index) {
    const images = container.querySelectorAll('.carousel-image');
    const dots = container.parentElement.querySelectorAll('.carousel-dot');

    // Hide all images and reset dots
    images.forEach(img => img.classList.add('hidden'));
    dots.forEach(dot => {
        dot.classList.remove('bg-opacity-100');
        dot.classList.add('bg-opacity-50');
    });

    // Show selected image and dot
    images[index].classList.remove('hidden');
    dots[index].classList.remove('bg-opacity-50');
    dots[index].classList.add('bg-opacity-100');
}

// Function to move slides
function moveSlide(button, direction) {
    event.stopPropagation();

    const container = button.closest('.relative').querySelector('.carousel-container');
    const images = container.querySelectorAll('.carousel-image');
    const currentIndex = Array.from(images).findIndex(img => !img.classList.contains('hidden'));
    const newIndex = (currentIndex + direction + images.length) % images.length;

    showSlide(container, newIndex);
}

document.querySelectorAll('.more-details-link').forEach(link => {
    link.addEventListener('click', function (e) {
        // Get current active language
        const currentLang = document.querySelector('[data-lang-inline].active').getAttribute('data-lang-inline');

        // Update href with current language
        this.href = `Tours/Arrabida/rota-dos-castelos/details_rota_castelos.html?lang=${currentLang}`;
    });
});

document.querySelectorAll('.more-details-link').forEach(link => {
    link.addEventListener('click', function (e) {
        // Get current active language
        const currentLang = document.querySelector('[data-lang-inline].active').getAttribute('data-lang-inline');

        // Update href with current language
        this.href = `Tours/Arrabida/maravilhas-arrabida/details_maravilhas_arrabida.html?lang=${currentLang}`;
    });
});

document.querySelectorAll('.more-details-link').forEach(link => {
    link.addEventListener('click', function (e) {
        // Get current active language
        const currentLang = document.querySelector('[data-lang-inline].active').getAttribute('data-lang-inline');

        // Update href with current language
        this.href = `Tours/Arrabida/terras-do-cabo-espichel/details_terras_do_cabo_espichel.html?lang=${currentLang}`;
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Add event listener to all 'More Details' links
    document.querySelectorAll('a[href="Tours/Arrabida/rota-dos-castelos/details_rota_castelos.html"]').forEach(link => {
        link.addEventListener('click', function (e) {
            // Find the currently active language
            const currentLang = document.querySelector('[data-lang-inline].active').getAttribute('data-lang-inline');

            // Update the href with the current language
            this.href = `Tours/Arrabida/rota-dos-castelos/details_rota_castelos.html?lang=${currentLang}`;
        });
    });

    document.querySelectorAll('a[href="Tours/Arrabida/maravilhas-arrabida/details_maravilhas_arrabida.html"]').forEach(link => {
        link.addEventListener('click', function (e) {
            // Find the currently active language
            const currentLang = document.querySelector('[data-lang-inline].active').getAttribute('data-lang-inline');

            // Update the href with the current language
            this.href = `Tours/Arrabida/maravilhas-arrabida/details_maravilhas_arrabida.html?lang=${currentLang}`;
        });
    });
    
    document.querySelectorAll('a[href="Tours/Arrabida/terras-do-cabo-espichel/details_terras_do_cabo_espichel.html"]').forEach(link => {
        link.addEventListener('click', function (e) {
            // Find the currently active language
            const currentLang = document.querySelector('[data-lang-inline].active').getAttribute('data-lang-inline');

            // Update the href with the current language
            this.href = `Tours/Arrabida/terras-do-cabo-espichel/details_terras_do_cabo_espichel.html?lang=${currentLang}`;
        });
    });

    setupMoreDetailsLinks();


    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent event bubbling
        mobileMenu.classList.toggle('hidden');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function () {
            mobileMenu.classList.add('hidden');
        });
    });

    // Initialize all carousels
    changeLanguage('pt');
    document.querySelectorAll('select option[data-pt]').forEach(option => {
        option.textContent = option.getAttribute('data-pt');
    });
    initializeCarousels();
    initializeThemeCarousels();
    initializeHeroCarousel();
    initializeHeroVideoSequence();
    initializeDraggableRows();

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => updateTourTabIndicator());
    }
});




// Function to toggle individual sections
function toggleTermsSection(button) {
    const content = button.nextElementSibling;
    const arrow = button.querySelector('svg');
    const mainContent = document.getElementById('mainTermsContent');

    if (content.style.maxHeight && content.style.maxHeight !== '0px') {
        content.style.maxHeight = '0px';
        arrow.classList.remove('rotate-180');
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        arrow.classList.add('rotate-180');
        // Update main container height
        mainContent.style.maxHeight = mainContent.scrollHeight + content.scrollHeight + 'px';
    }
}

//email
const form = document.getElementById('contactForm');
const submitMessage = document.getElementById('submitMessage');
const successMessage = document.querySelector('.success-message');
const errorMessage = document.querySelector('.error-message');

// Pages other than index.html (e.g. the Terms page) don't have this form.
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Show success message
                form.reset();
                submitMessage.classList.remove('hidden');
                successMessage.classList.remove('hidden');
                errorMessage.classList.add('hidden');

                // Hide success message after 5 seconds
                setTimeout(() => {
                    submitMessage.classList.add('hidden');
                    successMessage.classList.add('hidden');
                }, 5000);
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            // Show error message
            submitMessage.classList.remove('hidden');
            errorMessage.classList.remove('hidden');
            successMessage.classList.add('hidden');

            // Hide error message after 5 seconds
            setTimeout(() => {
                submitMessage.classList.add('hidden');
                errorMessage.classList.add('hidden');
            }, 5000);
        }
    });
}

//function responsible for the dropdown feature of the cards
function reinitializeTourCards() {
    // Setup tour card listeners
    document.querySelectorAll('.tour-card').forEach(card => {
        // Remove any existing event listeners to avoid duplicates
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);

        // Add new event listener
        newCard.addEventListener('click', function (e) {
            // Don't toggle if clicking buttons, arrows, or dots
            if (e.target.tagName === 'BUTTON' ||
                e.target.closest('button') ||
                e.target.classList.contains('carousel-dot') ||
                e.target.tagName === 'A') {
                return;
            }

            //// Remove active class from all cards except the clicked one
            //document.querySelectorAll('.tour-card').forEach(c => {
            //    if (c !== newCard) {
            //        c.classList.remove('active');
            //    }
            //});
//
            //// Toggle active class on clicked card
            //newCard.classList.toggle('active');
        });
    });

    // Re-attach event listeners to "More Details" links
    setupMoreDetailsLinks();
}