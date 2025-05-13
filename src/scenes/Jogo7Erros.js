export default class Jogo7Erros extends Phaser.Scene {
    constructor() {
        super('Jogo7Erros');
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // Título principal com estilo melhorado
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

        // Espaço entre as linhas de botões
        const lineSpacing = 60;
        const buttonWidth = 300;
        const firstLineY = centerY - 80;
        const secondLineY = firstLineY + lineSpacing + 40;

        // Função para renderizar os botões de níveis
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
                .setInteractive()
                .setStyle({
                    borderRadius: '12px',
                });

            // Efeito hover
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

        // Calcular as posições para centralizar os botões 3 e 8
        const startX = centerX - 2 * (buttonWidth + 20); // Começo da linha 1, considerando a centralização do 3
        let offsetX = 0;

        // Renderizando os botões na primeira linha (1 a 5)
        levels.slice(0, 5).forEach((level, index) => {
            const xPos = startX + index * (buttonWidth + 20);
            renderLevelButton(level, xPos, firstLineY);
        });

        // Renderizando os botões na segunda linha (6 a 10)
        offsetX = centerX - (buttonWidth * 2 + 20); // Ajustando para a centralização do botão 8
        levels.slice(5).forEach((level, index) => {
            const xPos = offsetX + index * (buttonWidth + 20);
            renderLevelButton(level, xPos, secondLineY);
        });

        // Botão de reset de progresso (opcional)
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
