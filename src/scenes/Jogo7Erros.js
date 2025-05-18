export default class Jogo7Erros extends Phaser.Scene {
    constructor() {
        super('Jogo7Erros');
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

        const popupContainer = this.add.container(width / 2, height / 2 + 80 * scaleFactor).setDepth(10);
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
            'Phishing e Engenharia Social são técnicas utilizadas por cibercriminosos para enganar usuários e obter dados sigilosos como senhas, números de cartão ou acesso a sistemas internos. Esses ataques costumam chegar por e-mail, se passando por mensagens legítimas de empresas ou colegas de trabalho.\n\n',
            '🧠 Neste jogo, cada fase simula um e-mail que ',
            { text: 'parece real', fontStyle: 'bold' },
            ', mas contém 7 erros escondidos que indicam uma tentativa de golpe. Seu desafio é identificar todos eles.\n\n',
            '🕵️‍♀️ Preste atenção a:\n• Erros ortográficos ou gramaticais sutis.\n• E-mails com domínios suspeitos ou incompletos.\n• Linguagem de urgência que tenta forçar uma ação rápida.\n• Informações contraditórias ou fora de contexto.\n• Remetentes que imitam nomes confiáveis.\n\n',
            '🎯 O objetivo é treinar seu olhar para reconhecer armadilhas comuns em golpes digitais. A cada nível, os erros ficam mais difíceis. Seja preciso e desconfie de tudo que parecer estranho!'
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
        // BOTÕES DOS NÍVEIS COM ESCALA E POSICIONAMENTO MELHORADOS
        // ----------------------

        const centerX = width / 2;
        const centerY = height / 2;

        this.add.text(centerX, 50 * scaleFactor, '🎮 Jogo dos 7 Erros 📧', {
            fontFamily: 'VT323',
            fontSize: `${42 * scaleFactor}px`,
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

        const lineSpacing = 60 * scaleFactor;
        const buttonSpacing = 160 * scaleFactor;
        const startX = centerX - 2 * buttonSpacing;
        const firstLineY = centerY - 50 * scaleFactor;
        const secondLineY = firstLineY + lineSpacing;

        const renderLevelButton = (level, x, y) => {
            const isCompleted = completedLevels.includes(level.key);

            const button = this.add.text(x, y, `${isCompleted ? '✅' : '🔍'} ${level.label}`, {
                fontFamily: 'VT323',
                fontSize: `${24 * scaleFactor}px`,
                backgroundColor: isCompleted ? '#d4fcd4' : '#f0f0f0',
                fill: isCompleted ? '#107010' : '#222',
                padding: { x: 18 * scaleFactor, y: 10 * scaleFactor },
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

        // Renderiza 5 níveis na primeira linha
        levels.slice(0, 5).forEach((level, index) => {
            renderLevelButton(level, startX + index * buttonSpacing, firstLineY);
        });

        // Renderiza os 5 níveis restantes na segunda linha
        levels.slice(5).forEach((level, index) => {
            renderLevelButton(level, startX + index * buttonSpacing, secondLineY);
        });

        // ----------------------
        // BOTÃO RESETAR PROGRESSO
        // ----------------------

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

        // ----------------------
        // BOTÃO VOLTAR AO MENU
        // ----------------------

        const backButton = this.add.text(centerX, height - 50 * scaleFactor, 'Voltar ao Menu de Jogos', {
            fontFamily: 'VT323',
            fontSize: `${22 * scaleFactor}px`,
            backgroundColor: '#333333',
            fill: '#ffffff',
            padding: { x: 20 * scaleFactor, y: 10 * scaleFactor },
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
