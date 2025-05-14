export default class Jogo7Erros extends Phaser.Scene {
    constructor() {
        super('Jogo7Erros');
    }

    preload() {
        this.load.image('helpIcon', 'assets/img/help_icon.png');
    }

    create() {
        const { width, height } = this.cameras.main;

        // ----------------------
        // AJUDA - Ícone + Pop-up com animação
        // ----------------------

        const helpIcon = this.add.image(width - 30, 30, 'helpIcon')
            .setOrigin(1, 0)
            .setScale(0.05)
            .setInteractive();

        // Armazena o estado original
        const originalScale = 0.05;

        // Efeito de hover: aumenta levemente com animação
        helpIcon.on('pointerover', () => {
            this.tweens.add({
                targets: helpIcon,
                scale: originalScale * 1.2, // aumenta 20%
                duration: 150,
                ease: 'Power2',
            });
        });

        // Volta ao normal quando o mouse sai
        helpIcon.on('pointerout', () => {
            this.tweens.add({
                targets: helpIcon,
                scale: originalScale,
                duration: 150,
                ease: 'Power2',
            });
        });

        // Container com os elementos do pop-up
        const popupContainer = this.add.container(width / 2, height / 2).setDepth(10);
        popupContainer.setAlpha(0); // Começa invisível

        // Fundo
        const popupBg = this.add.rectangle(0, 0, 500, 250, 0x000000, 0.85)
            .setStrokeStyle(2, 0xffffff)
            .setOrigin(0.5);

        // Texto
        const popupMsg = this.add.text(-220, -100,
            '📧 *Phishing* e *Engenharia Social* são técnicas usadas para enganar pessoas e obter informações confidenciais.\n\nNeste jogo dos 7 erros, você precisa encontrar detalhes suspeitos nos e-mails que simulam tentativas reais de golpe.\n\nPreste atenção a erros ortográficos, links falsos, remetentes estranhos e linguagem de urgência.',
            {
                fontFamily: 'Arial',
                fontSize: '18px',
                color: '#ffffff',
                wordWrap: { width: 460 },
            }
        );

        // Botão de fechar (X)
        const closeBtn = this.add.text(230, -110, '✖', {
            fontSize: '22px',
            fontFamily: 'Arial',
            color: '#ffaaaa',
            fontStyle: 'bold',
        })
            .setInteractive()
            .on('pointerover', () => closeBtn.setColor('#ff5555'))
            .on('pointerout', () => closeBtn.setColor('#ffaaaa'))
            .on('pointerdown', () => {
                this.tweens.add({
                    targets: popupContainer,
                    alpha: 0,
                    duration: 300,
                    ease: 'Power2'
                });
            });

        // Agrupa tudo
        popupContainer.add([popupBg, popupMsg, closeBtn]);

        // Mostra o pop-up com animação ao entrar
        this.tweens.add({
            targets: popupContainer,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });

        // Reabrir ao clicar no ícone
        helpIcon.on('pointerdown', () => {
            this.tweens.add({
                targets: popupContainer,
                alpha: 1,
                duration: 300,
                ease: 'Power2'
            });
        });


        // ----------------------
        // SEU CÓDIGO ORIGINAL (botões dos níveis e reset)
        // ----------------------

        const centerX = width / 2;
        const centerY = height / 2;

        this.add.text(centerX, 50, '🎮 Jogo dos 7 Erros 📧', {
            fontFamily: 'Arial',
            fontSize: '42px',
            fill: '#f8f8ff',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        const completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [];

        const levels = [
            { key: 'errosnivel1', label: 'Nível 1' },
            { key: 'errosnivel2', label: 'Nível 2' },
            { key: 'errosnivel3', label: 'Nível 3' },
            { key: 'errosnivel4', label: 'Nível 4' },
            { key: 'errosnivel5', label: 'Nível 5' },
            { key: 'errosnivel6', label: 'Nível 6' },
            { key: 'errosnivel7', label: 'Nível 7' },
            { key: 'errosnivel8', label: 'Nível 8' },
            { key: 'errosnivel9', label: 'Nível 9' },
            { key: 'errosnivel10', label: 'Nível 10' },
        ];

        const lineSpacing = 60;
        const buttonWidth = 300;
        const firstLineY = centerY - 80;
        const secondLineY = firstLineY + lineSpacing + 40;

        const renderLevelButton = (level, x, y) => {
            const levelKey = `nivel${levels.indexOf(level) + 1}`;
            const isCompleted = completedLevels.includes(levelKey);

            const button = this.add.text(x, y, `${isCompleted ? '✅' : '🔍'} ${level.label}`, {
                fontFamily: 'Arial',
                fontSize: '24px',
                backgroundColor: isCompleted ? '#d4fcd4' : '#f0f0f0',
                fill: isCompleted ? '#107010' : '#222',
                padding: { x: 18, y: 10 },
                align: 'center',
            })
                .setOrigin(0.5)
                .setInteractive();

            button.on('pointerover', () => {
                button.setStyle({
                    backgroundColor: '#d0eaff',
                    fill: '#0055aa',
                    fontStyle: 'bold',
                });
                button.setScale(1.05);
            });

            button.on('pointerout', () => {
                button.setStyle({
                    backgroundColor: isCompleted ? '#d4fcd4' : '#f0f0f0',
                    fill: isCompleted ? '#107010' : '#222',
                    fontStyle: 'normal',
                });
                button.setScale(1);
            });

            button.on('pointerdown', () => {
                this.scene.start(level.key);
            });
        };

        const startX = centerX - 2 * (buttonWidth + 20);
        levels.slice(0, 5).forEach((level, index) => {
            renderLevelButton(level, startX + index * (buttonWidth + 20), firstLineY);
        });

        const offsetX = centerX - (buttonWidth * 2 + 20);
        levels.slice(5).forEach((level, index) => {
            renderLevelButton(level, offsetX + index * (buttonWidth + 20), secondLineY);
        });

        const resetBtn = this.add.text(centerX, secondLineY + lineSpacing + 30, '🔄 Resetar Progresso', {
            fontFamily: 'Arial',
            fontSize: '18px',
            backgroundColor: '#ffcccc',
            fill: '#990000',
            padding: { x: 12, y: 8 },
        })
            .setOrigin(0.5)
            .setInteractive();

        resetBtn.on('pointerover', () => {
            resetBtn.setStyle({ backgroundColor: '#ffaaaa', fill: '#660000' });
            resetBtn.setScale(1.05);
        });

        resetBtn.on('pointerout', () => {
            resetBtn.setStyle({ backgroundColor: '#ffcccc', fill: '#990000' });
            resetBtn.setScale(1);
        });

        resetBtn.on('pointerdown', () => {
            localStorage.removeItem('completedLevels');
            this.scene.restart();
        });
    }
}
