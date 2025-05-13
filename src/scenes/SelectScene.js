export default class SelectScene extends Phaser.Scene {
    constructor() {
        super('SelectScene');
    }

    preload() {
        this.load.font('VT323', './assets/fonts/VT323.ttf');
    }

    create() {
        // Centralizar
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // Título
        this.add.text(centerX, centerY - 100, 'Escolha um minigame', {
            fontFamily: 'VT323',
            fontSize: '28px',
            fill: '#ffffff',
        }).setOrigin(0.5);

        // Botão de Jogo dos 7 Erros
        const phishingBtn = this.add.text(centerX, centerY, 'Jogo dos 7 Erros (Phishing)', {
            fontFamily: 'VT323',
            fontSize: '20px',
            fill: '#ffcc00',
        })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('Jogo7Erros');
            })
            .on('pointerover', () => phishingBtn.setStyle({ fill: '#ffff00' }))
            .on('pointerout', () => phishingBtn.setStyle({ fill: '#ffcc00' }));

        // Botão de voltar
        const backButton = this.add.text(centerX, centerY + 100, 'Voltar', {
            fontFamily: 'VT323',
            fontSize: '24px',
            fill: '#ff0000',
        })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('MenuScene');
            })
            .on('pointerover', () => backButton.setStyle({ fill: '#ffff00' }))
            .on('pointerout', () => backButton.setStyle({ fill: '#ff0000' }));
    }
}
