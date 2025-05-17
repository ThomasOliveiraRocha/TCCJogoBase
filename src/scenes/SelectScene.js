export default class SelectScene extends Phaser.Scene {
    constructor() {
        super('SelectScene');
    }

    preload() {
        this.load.font('VT323', './assets/fonts/VT323.ttf');
    }

    create() {
        const { width, height } = this.cameras.main;
        const centerX = width / 2;
        const centerY = height / 2;

        // Fundo escuro com leve transparência
        this.add.rectangle(centerX, centerY, width, height, 0x000000, 0.6).setDepth(-1);

        // Título
        this.add.text(centerX, centerY - 150, '🎮 Escolha um Minigame', {
            fontFamily: 'VT323',
            fontSize: '42px',
            fill: '#ffffff',
        }).setOrigin(0.5);

        const createButton = (text, y, color, onClick) => {
            const btn = this.add.text(centerX, y, text, {
                fontFamily: 'VT323',
                fontSize: '26px',
                fill: color,
                backgroundColor: '#1e1e1e',
                padding: { x: 14, y: 8 },
                align: 'center',
            })
                .setOrigin(0.5)
                .setInteractive();

            btn.on('pointerover', () => {
                btn.setStyle({
                    fill: '#ffff66',
                    backgroundColor: '#333333',
                    fontStyle: 'bold',
                });
                btn.setScale(1.05);
            });

            btn.on('pointerout', () => {
                btn.setStyle({
                    fill: color,
                    backgroundColor: '#1e1e1e',
                    fontStyle: 'normal',
                });
                btn.setScale(1);
            });

            btn.on('pointerdown', onClick);
            return btn;
        };

        // Botão Phishing
        createButton('🕵️‍♂️ Jogo dos 7 Erros (Phishing)', centerY - 30, '#ffcc00', () => {
            this.scene.start('Jogo7Erros');
        });

        // Botão Quizz
        createButton('🧠 Quiz Cibersegurança', centerY + 40, '#66ccff', () => {
            this.scene.start('Quizz');
        });

        // Botão Voltar
        createButton('Voltar ao Menu', centerY + 130, '#ff4444', () => {
            this.scene.start('MenuScene');
        });
    }
}
