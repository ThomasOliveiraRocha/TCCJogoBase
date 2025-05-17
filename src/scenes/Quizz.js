export default class Quizz extends Phaser.Scene {
    constructor() {
        super('Quizz');
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

        // Container ajustado (desce metade do aumento de altura)
        const popupContainer = this.add.container(width / 2, height / 2).setDepth(10);
        popupContainer.setAlpha(0); // invisível por padrão

        // Fundo mais alto
        const popupBg = this.add.rectangle(0, 0, 580, 600, 0x000000, 1)
            .setStrokeStyle(2, 0xffffff)
            .setOrigin(0.5);
        // Texto centralizado corretamente
        const popupMsg = this.add.text(-270, -270, '', {
            fontFamily: 'VT323',
            fontSize: '18px',
            color: '#ffffff',
            wordWrap: { width: 520 },
        });
        popupMsg.setText([
            '🔐 ',
            'Este quiz foi desenvolvido para ajudá-lo a compreender e memorizar as principais terminologias usadas na área de cibersegurança.\n\n',
            '🧠 Com perguntas objetivas e explicações, o quiz facilita o aprendizado dos conceitos essenciais para identificar e se proteger contra ameaças digitais.\n\n',
            '📚 A prática constante por meio do quiz reforça o conhecimento e prepara você para reconhecer ataques reais no dia a dia.\n\n',
            '🎯 Use este jogo como uma ferramenta educativa para aprimorar sua segurança online e entender a linguagem técnica do mundo digital.'
        ]);


        // Botão de fechar ajustado para novo tamanho
        const closeBtn = this.add.text(270, -300, '✖', {
            fontSize: '22px',
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

        // Agrupar tudo
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
        // BOTÕES DOS NÍVEIS E RESET
        // ----------------------

        const centerX = width / 2;
        const centerY = height / 2;

        this.add.text(centerX, 50, '🎮 Quizz Game 📧', {
            fontFamily: 'VT323',
            fontSize: '42px',
            fill: '#f8f8ff',
            fontStyle: 'bold',
        }).setOrigin(0.5);

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

        const lineSpacing = 60;
        const buttonWidth = 300;
        const firstLineY = centerY - 80;
        const secondLineY = firstLineY + lineSpacing + 40;

        const renderLevelButton = (level, x, y) => {
            const levelKey = level.key; // usar a chave direta, ex: 'quizz1'
            const isCompleted = completedLevels.includes(levelKey);

            const button = this.add.text(x, y, `${isCompleted ? '✅' : '🔍'} ${level.label}`, {
                fontFamily: 'VT323',
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
            fontFamily: 'VT323',
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

        const backButton = this.add.text(centerX, centerY + 400, '🎮 Voltar ao Menu de Jogos', {
            fontFamily: 'VT323',
            fontSize: '22px',
            backgroundColor: '#333333',
            fill: '#ffffff',
            padding: { x: 20, y: 10 },
            align: 'center',
        })
            .setOrigin(0.5)
            .setInteractive()
            .setShadow(2, 2, '#000', 2, true, true)
            .on('pointerover', () => {
                backButton.setStyle({
                    backgroundColor: '#5555aa',
                    fill: '#ffffaa',
                    fontStyle: 'bold'
                });
                backButton.setScale(1.07);
            })
            .on('pointerout', () => {
                backButton.setStyle({
                    backgroundColor: '#333333',
                    fill: '#ffffff',
                    fontStyle: 'normal'
                });
                backButton.setScale(1);
            })
            .on('pointerdown', () => this.scene.start('SelectScene'));
    }
}
