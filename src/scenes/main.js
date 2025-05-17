import MenuScene from './MenuScene.js';
import SelectScene from './SelectScene.js';
import Jogo7Erros from './Jogo7Erros.js';
import Quizz from './Quizz.js';
import OptionsScene from './OptionsScene.js';

import errosnivel1 from './Erros/errosnivel1.js';
import errosnivel2 from './Erros/errosnivel2.js';
import errosnivel3 from './Erros/errosnivel3.js';
import errosnivel4 from './Erros/errosnivel4.js';
import errosnivel5 from './Erros/errosnivel5.js';
import errosnivel6 from './Erros/errosnivel6.js';
import errosnivel7 from './Erros/errosnivel7.js';
import errosnivel8 from './Erros/errosnivel8.js';
import errosnivel9 from './Erros/errosnivel9.js';
import errosnivel10 from './Erros/errosnivel10.js';

import quizz1 from './quizes/quizz1.js';
import quizz2 from './quizes/quizz2.js';
import quizz3 from './quizes/quizz3.js';
import quizz4 from './quizes/quizz4.js';
import quizz5 from './quizes/quizz5.js';
import quizz6 from './quizes/quizz6.js';
import quizz7 from './quizes/quizz7.js';
import quizz8 from './quizes/quizz8.js';
import quizz9 from './quizes/quizz9.js';
import quizz10 from './quizes/quizz10.js';

// Obter as dimensões da janela do navegador
const width = window.innerWidth;
const height = window.innerHeight;

const config = {
    type: Phaser.AUTO,
    width: width, // Definir a largura com o tamanho da janela
    height: height, // Definir a altura com o tamanho da janela
    parent: 'game-container',
    backgroundColor: '#1a1a1a',
    scene: [MenuScene, SelectScene, Jogo7Erros, OptionsScene, Quizz, 
        errosnivel1, errosnivel2, errosnivel3, errosnivel4, errosnivel5, errosnivel6, errosnivel7, errosnivel8, errosnivel9, errosnivel10,
        quizz1, quizz2, quizz3, quizz4, quizz5, quizz6, quizz7, quizz8, quizz9, quizz10],
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
