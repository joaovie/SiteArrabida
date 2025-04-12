// Function to include HTML
function includeHTML() {
    var z, i, elmnt, file, xhttp;
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
            console.log("Loading: " + file); // Debug line
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        elmnt.innerHTML = this.responseText;
                        elmnt.removeAttribute("w3-include-html");

                        // Initialize carousels after content is loaded
                        initializeCarousels();

                        // Call the new function to ensure all tour cards work
                        reinitializeTourCards();

                        // Get current language and reapply it to new content
                        const currentLang = document.documentElement.lang || 'pt';
                        changeLanguage(currentLang);

                        // Update select options if they exist
                        document.querySelectorAll('select option[data-' + currentLang + ']').forEach(option => {
                            option.textContent = option.getAttribute('data-' + currentLang);
                        });
                    }
                    if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                    includeHTML(); // Continue with next element
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            return;
        }
    }
}

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


//Function to setup tour card listeners
function setupTourCardListeners() {
    document.querySelectorAll('.tour-card').forEach(card => {
        card.addEventListener('click', function (e) {
            if (e.target.tagName === 'BUTTON' ||
                e.target.closest('button') ||
                e.target.classList.contains('carousel-dot') ||
                e.target.tagName === 'A') {
                return;
            }

            document.querySelectorAll('.tour-card').forEach(c => {
                if (c !== card) {
                    c.classList.remove('active');
                }
            });

            card.classList.toggle('active');
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
}

let currentHeroSlide = 0;
let heroInterval;

function initializeHeroCarousel() {
    const carousel = document.getElementById('hero-carousel');
    const dotsContainer = carousel.parentElement.querySelector('.flex.justify-center');

    // Clear existing content
    carousel.innerHTML = '';
    dotsContainer.innerHTML = '';

    // Add images
    heroImages.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Hero image ${index + 1}`;
        // Changed from opacity classes to hidden class
        img.className = `absolute w-full h-full object-cover ${index === 0 ? '' : 'hidden'}`;
        carousel.appendChild(img);
    });

    // Add dots
    heroImages.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `w-3 h-3 rounded-full bg-white ${index === 0 ? 'bg-opacity-100' : 'bg-opacity-50'} hover:bg-opacity-100 transition-all duration-300`;
        dot.addEventListener('click', () => showHeroSlide(index));
        dotsContainer.appendChild(dot);
    });

    // Start automatic slideshow
    startHeroSlideshow();
}

function showHeroSlide(index) {
    const images = document.querySelectorAll('#hero-carousel img');
    const dots = document.querySelectorAll('#hero-carousel + div button');

    // Changed from opacity to hidden class
    images.forEach(img => img.classList.add('hidden'));

    // Update dots
    dots.forEach(dot => dot.classList.replace('bg-opacity-100', 'bg-opacity-50'));

    // Show selected image
    images[index].classList.remove('hidden');
    dots[index].classList.replace('bg-opacity-50', 'bg-opacity-100');

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


// Function to initialize carousels
function initializeCarousels() {
    // For each tour in tourImages
    Object.keys(tourImages).forEach(tourId => {
        const carouselContainer = document.getElementById(`carousel-${tourId}`);
        if (!carouselContainer) return;

        console.log(`Initializing carousel for ${tourId}`); // Debug line

        // Clear existing content
        carouselContainer.innerHTML = '';

        // Add images
        tourImages[tourId].forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Tour image ${index + 1}`;
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
    includeHTML();
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
    initializeHeroCarousel();
});


// Tour card toggle functionality
document.querySelectorAll('.tour-card').forEach(card => {
    card.addEventListener('click', function (e) {
        // Don't toggle if clicking buttons, arrows, or dots
        if (e.target.tagName === 'BUTTON' ||
            e.target.closest('button') ||
            e.target.classList.contains('carousel-dot')) {
            return;
        }

        // Remove active class from all cards except the clicked one
        document.querySelectorAll('.tour-card').forEach(c => {
            if (c !== card) {
                c.classList.remove('active');
            }
        });

        // Toggle active class on clicked card
        card.classList.toggle('active');
    });
});

function openBookingModal(tourType) {
    const modal = document.getElementById('bookingModal');
    const tourSelect = modal.querySelector('select[name="tourType"]');

    // Set tour type if provided
    if (tourType) {
        tourSelect.value = tourType;
    }

    // Update select options based on current language
    const currentLang = document.documentElement.lang;
    modal.querySelectorAll('select option[data-' + currentLang + ']').forEach(option => {
        option.textContent = option.getAttribute('data-' + currentLang);
    });

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('flex');
    modal.classList.add('hidden');
}

// Form submission handler
document.getElementById('bookingForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    try {
        const response = await fetch(this.action, {
            method: 'POST',
            body: new FormData(this),
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Show success message
            const currentLang = document.documentElement.lang;
            const successMessages = {
                en: 'Thank you for your booking! We will contact you shortly.',
                es: '¡Gracias por su reserva! Nos pondremos en contacto pronto.',
                pt: 'Obrigado pela sua reserva! Entraremos em contacto em breve.',
                fr: 'Merci pour votre réservation ! Nous vous contacterons bientôt.'
            };

            alert(successMessages[currentLang]);
            this.reset();
            closeBookingModal();
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        // Show error message
        const currentLang = document.documentElement.lang;
        const errorMessages = {
            en: 'There was a problem submitting your booking. Please try again.',
            es: 'Hubo un problema al enviar su reserva. Por favor, inténtelo de nuevo.',
            pt: 'Houve um problema ao enviar sua reserva. Por favor, tente novamente.',
            fr: 'Un problème est survenu lors de l\'envoi de votre réservation. Veuillez réessayer.'
        };

        alert(errorMessages[currentLang]);
    }
});

document.getElementById('mobile-menu-button').addEventListener('click', function () {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
});

// Function to toggle main terms and conditions
function toggleMainTerms() {
    const content = document.getElementById('mainTermsContent');
    const arrow = content.parentElement.querySelector('button svg');

    if (content.style.maxHeight && content.style.maxHeight !== '0px') {
        content.style.maxHeight = '0px';
        arrow.classList.remove('rotate-180');
    } else {
        content.style.maxHeight = content.scrollHeight + 2000 + 'px'; // Adding extra space for nested content
        arrow.classList.add('rotate-180');
    }
}

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
const successMessage = document.querySelector('.success-message');
const errorMessage = document.querySelector('.error-message');

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
            successMessage.classList.remove('hidden');
            errorMessage.classList.add('hidden');

            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.add('hidden');
            }, 5000);
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        // Show error message
        errorMessage.classList.remove('hidden');
        successMessage.classList.add('hidden');

        // Hide error message after 5 seconds
        setTimeout(() => {
            errorMessage.classList.add('hidden');
        }, 5000);
    }
});

//function responsible for the dropdown feature of the cards
function reinitializeTourCards() {
    console.log("Reinitializing tour cards");
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