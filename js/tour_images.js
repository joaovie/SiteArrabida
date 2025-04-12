// This file contains the images for the tours.
const tourImages = {
    'rota_castelos': [
        'Tours/Arrabida/rota-dos-castelos/Img_rota_castelos/P1510576.jpg',
        'Tours/Arrabida/rota-dos-castelos/Img_rota_castelos/P1510556.jpg',
        'Tours/Arrabida/rota-dos-castelos/Img_rota_castelos/P1510581.jpg',
        'Tours/Arrabida/rota-dos-castelos/Img_rota_castelos/P1510587.jpg'
    ],
    'maravilhas_arrabida': [
        'Tours/Arrabida/maravilhas-arrabida/Img_maravilhas_arrabida/IMG_1.jpeg',
        'Tours/Arrabida/maravilhas-arrabida/Img_maravilhas_arrabida/P1510646.jpg',
        'Tours/Arrabida/maravilhas-arrabida/Img_maravilhas_arrabida/IMG_2.jpeg',
        'Tours/Arrabida/maravilhas-arrabida/Img_maravilhas_arrabida/IMG_4.jpeg',
    ],
    'terras_do_cabo_espichel': [
        'Tours/Arrabida/terras-do-cabo-espichel/Img_terras_do_cabo_espichel/IMG_2.jpeg',
        'Tours/Arrabida/terras-do-cabo-espichel/Img_terras_do_cabo_espichel/IMG_3.jpeg',
        'Tours/Arrabida/terras-do-cabo-espichel/Img_terras_do_cabo_espichel/P1510701.jpeg',
        'Tours/Arrabida/terras-do-cabo-espichel/Img_terras_do_cabo_espichel/IMG_1249.png',
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
    'Tours/Arrabida/rota-dos-castelos/Img_rota_castelos/IMG_1230 2.jpeg',
    'Tours/Arrabida/maravilhas-arrabida/Img_maravilhas_arrabida/IMG_1.jpeg',
    'Tours/Arrabida/rota-dos-castelos/Img_rota_castelos/P1510576.jpg',
    'Tours/Arrabida/rota-dos-castelos/Img_rota_castelos/P1510581.jpg',
    'Tours/Arrabida/rota-dos-castelos/Img_rota_castelos/P1510587.jpg',
    'Tours/Arrabida/terras-do-cabo-espichel/Img_terras_do_cabo_espichel/IMG_2.jpeg',
    'Tours/Arrabida/maravilhas-arrabida/Img_maravilhas_arrabida/IMG_3.jpeg',
    'Tours/Arrabida/maravilhas-arrabida/Img_maravilhas_arrabida/IMG_4.jpeg',
];

// If you want to make this data available to other JavaScript files:
if (typeof module !== 'undefined' && module.exports) {
    // For Node.js/CommonJS environments
    module.exports = { heroImages };
} else {
    // For browser environments
    window.heroImages = heroImages;
}