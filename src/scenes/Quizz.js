export default class Quizz extends Phaser.Scene {
    constructor() {
        super('Quizz');
    }

    preload() {
        this.load.image('helpIcon', 'assets/img/help_icon.png');
    }

    create() {
        const { width, height } = this.cameras.main;

        // Escala proporcional para responsividade
        const scaleFactor = Math.min(width / 800, height / 600);

        // ----------------------
        // AJUDA - Ícone + Pop-up com animação
        // ----------------------

        const helpIcon = this.add.image(width - 30 * scaleFactor, 30 * scaleFactor, 'helpIcon')
            .setOrigin(1, 0)
            .setScale(0.05 * scaleFactor)
            .setInteractive();

        const originalScale = 0.05 * scaleFactor;

        helpIcon.on('pointerover', () => {
            this.tweens.add({
                targets: helpIcon,
                scale: originalScale * 1.2,
                duration: 150,
                ease: 'Power2',
            });
        });

        helpIcon.on('pointerout', () => {
            this.tweens.add({
                targets: helpIcon,
                scale: originalScale,
                duration: 150,
                ease: 'Power2',
            });
        });

        const popupContainer = this.add.container(width / 2, height / 2).setDepth(10);
        popupContainer.setAlpha(0);

        const popupBg = this.add.rectangle(0, 0, 580 * scaleFactor, 600 * scaleFactor, 0x000000, 0.85)
            .setStrokeStyle(2, 0xffffff)
            .setOrigin(0.5);

        const popupMsg = this.add.text(-270 * scaleFactor, -270 * scaleFactor, '', {
            fontFamily: 'VT323',
            fontSize: `${18 * scaleFactor}px`,
            color: '#ffffff',
            wordWrap: { width: 520 * scaleFactor },
        });
        popupMsg.setText([
            '🔐 ',
            'Este quiz foi desenvolvido para ajudá-lo a compreender e memorizar as principais terminologias usadas na área de cibersegurança.\n\n',
            '🧠 Com perguntas objetivas e explicações, o quiz facilita o aprendizado dos conceitos essenciais para identificar e se proteger contra ameaças digitais.\n\n',
            '📚 A prática constante por meio do quiz reforça o conhecimento e prepara você para reconhecer ataques reais no dia a dia.\n\n',
            '🎯 Use este jogo como uma ferramenta educativa para aprimorar sua segurança online e entender a linguagem técnica do mundo digital.'
        ]);

        const closeBtn = this.add.text(270 * scaleFactor, -300 * scaleFactor, '✖', {
            fontSize: `${22 * scaleFactor}px`,
            fontFamily: 'VT323',
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

        popupContainer.add([popupBg, popupMsg, closeBtn]);

        helpIcon.on('pointerdown', () => {
            this.tweens.add({
                targets: popupContainer,
                alpha: 1,
                duration: 300,
                ease: 'Power2'
            });
        });

        // ----------------------
        // BOTÕES DOS NÍVEIS
        // ----------------------

        const centerX = width / 2;
        const centerY = height / 2;

        this.add.text(centerX, 50 * scaleFactor, '🎮 Quizz Game 📧', {
            fontFamily: 'VT323',
            fontSize: `${42 * scaleFactor}px`,
            fill: '#f8f8ff',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        // Usar a mesma chave 'completedLevels' para carregar o progresso
        const completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [];

        const levels = [
            { key: 'quizz1', label: 'Nível 1' },
            { key: 'quizz2', label: 'Nível 2' },
            { key: 'quizz3', label: 'Nível 3' },
            { key: 'quizz4', label: 'Nível 4' },
            { key: 'quizz5', label: 'Nível 5' },
            { key: 'quizz6', label: 'Nível 6' },
            { key: 'quizz7', label: 'Nível 7' },
            { key: 'quizz8', label: 'Nível 8' },
            { key: 'quizz9', label: 'Nível 9' },
            { key: 'quizz10', label: 'Nível 10' },
        ];

        const lineSpacing = 60 * scaleFactor;
        const buttonSpacing = 160 * scaleFactor;
        const startX = centerX - 2 * buttonSpacing;
        const startY = centerY - 50 * scaleFactor;

        levels.forEach((level, index) => {
            const row = Math.floor(index / 5);
            const col = index % 5;
            const x = startX + col * buttonSpacing;
            const y = startY + row * lineSpacing;

            const isCompleted = completedLevels.includes(level.key);

            const button = this.add.text(x, y, `${isCompleted ? '✅' : '🔍'} ${level.label}`, {
                fontFamily: 'VT323',
                fontSize: `${24 * scaleFactor}px`,
                backgroundColor: isCompleted ? '#d4fcd4' : '#f0f0f0',
                fill: isCompleted ? '#107010' : '#222',
                padding: { x: 18, y: 10 },
                align: 'center',
            }).setOrigin(0.5).setInteractive();

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
        });

        // Botão para resetar progresso
        const resetBtn = this.add.text(centerX, height - 100 * scaleFactor, '🔄 Resetar Progresso', {
            fontFamily: 'VT323',
            fontSize: `${18 * scaleFactor}px`,
            backgroundColor: '#ffcccc',
            fill: '#990000',
            padding: { x: 12 * scaleFactor, y: 8 * scaleFactor },
        })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerover', () => resetBtn.setStyle({ backgroundColor: '#ffaaaa', fill: '#660000' }))
            .on('pointerout', () => resetBtn.setStyle({ backgroundColor: '#ffcccc', fill: '#990000' }))
            .on('pointerdown', () => {
                localStorage.removeItem('completedLevels');
                this.scene.restart();
            });

        // Botão voltar menu
        const backButton = this.add.text(centerX, height - 50 * scaleFactor, '🎮 Voltar ao Menu de Jogos', {
            fontFamily: 'VT323',
            fontSize: `${22 * scaleFactor}px`,
            backgroundColor: '#333333',
            fill: '#ffffff',
            padding: { x: 20 * scaleFactor, y: 10 },
            align: 'center',
        })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerover', () => backButton.setStyle({ backgroundColor: '#5555aa', fill: '#ffffaa' }))
            .on('pointerout', () => backButton.setStyle({ backgroundColor: '#333333', fill: '#ffffff' }))
            .on('pointerdown', () => this.scene.start('SelectScene'));
    }
}
