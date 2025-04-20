// This file contains the images for the tours.
const tourImages = {
    'rota_castelos': [
        'Tours/Arrabida/rota-dos-castelos/Img_rota_castelos/P1510576.webp',
        'Tours/Arrabida/rota-dos-castelos/Img_rota_castelos/P1510556.webp',
        'Tours/Arrabida/rota-dos-castelos/Img_rota_castelos/P1510581.webp',
        'Tours/Arrabida/rota-dos-castelos/Img_rota_castelos/P1510587.webp'
    ],
    'maravilhas_arrabida': [
        'Tours/Arrabida/maravilhas-arrabida/Img_maravilhas_arrabida/IMG_1.webp',
        'Tours/Arrabida/maravilhas-arrabida/Img_maravilhas_arrabida/P1510646.webp',
        'Tours/Arrabida/maravilhas-arrabida/Img_maravilhas_arrabida/IMG_2.webp',
        'Tours/Arrabida/maravilhas-arrabida/Img_maravilhas_arrabida/IMG_4.webp',
    ],
    'terras_do_cabo_espichel': [
        'Tours/Arrabida/terras-do-cabo-espichel/Img_terras_do_cabo_espichel/IMG_2.webp',
        'Tours/Arrabida/terras-do-cabo-espichel/Img_terras_do_cabo_espichel/IMG_3.webp',
        'Tours/Arrabida/terras-do-cabo-espichel/Img_terras_do_cabo_espichel/P1510701.webp',
        'Tours/Arrabida/terras-do-cabo-espichel/Img_terras_do_cabo_espichel/IMG_1249.webp',
    ]
};

// If you want to make this data available to other JavaScript files:
if (typeof module !== 'undefined' && module.exports) {
    // For Node.js/CommonJS environments
    module.exports = { tourImages };
} else {
    // For browser environments
    window.tourImages = tourImages;
}


// Hero carousel images
const heroImages = [
    'Tours/Arrabida/rota-dos-castelos/Img_rota_castelos/IMG_1230 2.webp',
    'Tours/Arrabida/maravilhas-arrabida/Img_maravilhas_arrabida/IMG_1.webp',
    'Tours/Arrabida/rota-dos-castelos/Img_rota_castelos/P1510576.webp',
    'Tours/Arrabida/rota-dos-castelos/Img_rota_castelos/P1510581.webp',
    'Tours/Arrabida/rota-dos-castelos/Img_rota_castelos/P1510587.webp',
    'Tours/Arrabida/terras-do-cabo-espichel/Img_terras_do_cabo_espichel/IMG_2.webp',
    'Tours/Arrabida/maravilhas-arrabida/Img_maravilhas_arrabida/IMG_3.webp',
    'Tours/Arrabida/maravilhas-arrabida/Img_maravilhas_arrabida/IMG_4.webp',
];

// If you want to make this data available to other JavaScript files:
if (typeof module !== 'undefined' && module.exports) {
    // For Node.js/CommonJS environments
    module.exports = { heroImages };
} else {
    // For browser environments
    window.heroImages = heroImages;
}