import MenuScene from './MenuScene.js';
import SelectScene from './SelectScene.js';
import Jogo7Erros from './Jogo7Erros.js';
import OptionsScene from './OptionsScene.js';
import errosnivel1 from './errosnivel1.js';
import errosnivel2 from './errosnivel2.js';
import errosnivel3 from './errosnivel3.js';
import errosnivel4 from './errosnivel4.js';
import errosnivel5 from './errosnivel5.js';
// import errosnivel6 from './errosnivel6.js';
// import errosnivel7 from './errosnivel7.js';
// import errosnivel8 from './errosnivel8.js';
// import errosnivel9 from './errosnivel9.js';
// import errosnivel10 from './errosnivel10.js';

// Obter as dimensões da janela do navegador
const width = window.innerWidth;
const height = window.innerHeight;

const config = {
    type: Phaser.AUTO,
    width: width, // Definir a largura com o tamanho da janela
    height: height, // Definir a altura com o tamanho da janela
    parent: 'game-container',
    backgroundColor: '#1a1a1a',
    scene: [MenuScene, SelectScene, Jogo7Erros, OptionsScene, 
        errosnivel1, errosnivel2, errosnivel3, errosnivel4, errosnivel5],
    scale: {
        mode: Phaser.Scale.RESIZE, // Permitirá que o jogo redimensione com a janela
        autoCenter: Phaser.Scale.CENTER_BOTH, // Centraliza o jogo na tela
    },
    // Preload a fonte aqui
    preload: function () {
        this.load.font('VT323', './assets/fonts/VT323.ttf'); // Carrega a fonte
    },
};

const game = new Phaser.Game(config);
