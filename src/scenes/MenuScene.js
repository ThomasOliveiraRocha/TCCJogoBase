export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        this.load.image('background', 'assets/img/menu_background.png');
        this.load.font('VT323', './assets/fonts/VT323.ttf');
        this.load.audio('backgroundMusic', 'assets/audio/som.mp3');
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // Plano de fundo
        const background = this.add.image(centerX, centerY, 'background');
        background.setDepth(-2);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Música
        if (!this.game.music) {
            this.game.music = this.sound.add('backgroundMusic', { loop: true, volume: 0.2 });
            this.game.music.play();
        }

        // Título
        const title = this.add.text(centerX, centerY - 100, 'Bem-vindo ao Jogo!', {
            fontFamily: 'VT323',
            fontSize: '48px',
            fill: '#ffffff',
        }).setOrigin(0.5);

        // Função para criar botões com efeito de brilho animado
        function createAnimatedButton(scene, x, y, label, callback) {
            const button = scene.add.text(x, y, label, {
                fontFamily: 'VT323',
                fontSize: '32px',
                fill: '#ffffff',
                backgroundColor: '#333333',
                padding: { x: 40, y: 15 },
                align: 'center'
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setShadow(2, 2, '#000', 2, true, true);

            let hoverTween = null;

            button.on('pointerover', () => {
                button.setStyle({ backgroundColor: '#888888', fill: '#ffffcc' });
                hoverTween = scene.tweens.add({
                    targets: button,
                    alpha: { from: 1, to: 0.7 },
                    yoyo: true,
                    repeat: -1,
                    duration: 500,
                    ease: 'Sine.easeInOut'
                });
            });

            button.on('pointerout', () => {
                button.setStyle({ backgroundColor: '#333333', fill: '#ffffff' });
                if (hoverTween) {
                    hoverTween.stop();
                    button.setAlpha(1);
                }
            });

            button.on('pointerdown', callback);

            return button;
        }

        // Botões com efeito
        const playButton = createAnimatedButton(this, centerX, centerY, 'Jogar', () => this.scene.start('SelectScene'));
        const optionsButton = createAnimatedButton(this, centerX, centerY + 100, 'Opções', () => this.scene.start('OptionsScene'));

        // Container com todos os elementos
        const container = this.add.container(0, 0, [title, playButton, optionsButton]);

        // Caixa de fundo igual da OptionsScene
        const backgroundBox = this.add.rectangle(centerX, centerY, 550, 300, 0x000000, 1);
        backgroundBox.setStrokeStyle(2, 0xffffff);
        backgroundBox.setDepth(-1); // Fica atrás do container

        // Sombra no título para melhorar contraste
        title.setShadow(2, 2, '#000', 2, true, true);
    }
}
