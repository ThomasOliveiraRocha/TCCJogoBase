export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        // Carregar a imagem do plano de fundo
        this.load.image('background', 'assets/img/menu_background.png');

        // Carregar a fonte
        this.load.font('VT323', './assets/fonts/VT323.ttf');

        // Carregar música
        this.load.audio('backgroundMusic', 'assets/audio/som.mp3');
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // Adicionar o plano de fundo e definir profundidade
        const background = this.add.image(centerX, centerY, 'background');
        background.setDepth(-1); // Certificar que está atrás de tudo
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height); // Redimensionar para preencher a tela

        // Iniciar música de fundo
        if (!this.game.music) {
            this.game.music = this.sound.add('backgroundMusic', { loop: true, volume: 0.3 });
            this.game.music.play();
        }

        // Título do jogo
        const title = this.add.text(centerX, centerY - 100, 'Bem-vindo ao Jogo!', {
            fontFamily: 'VT323',
            fontSize: '48px',
            fill: '#ffffff',
        }).setOrigin(0.5);


        // Botão "Jogar"
        const playButton = this.add.text(centerX, centerY, 'Jogar', {
            fontFamily: 'VT323',
            fontSize: '32px',
            fill: '#00ff00',
        })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('SelectScene'))
            .on('pointerover', () => playButton.setStyle({ fill: '#ffff00' }))
            .on('pointerout', () => playButton.setStyle({ fill: '#00ff00' }));


        // Botão "Opções"
        const optionsButton = this.add.text(centerX, centerY + 100, 'Opções', {
            fontFamily: 'VT323',
            fontSize: '32px',
            fill: '#00ff00',
        })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('OptionsScene'))
            .on('pointerover', () => optionsButton.setStyle({ fill: '#ffff00' }))
            .on('pointerout', () => optionsButton.setStyle({ fill: '#00ff00' }));

       
    }
}
