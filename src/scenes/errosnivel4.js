export default class errosnivel4 extends Phaser.Scene {
    constructor() {
        super('errosnivel4');
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        let errorsFound = 0;
        let userClicks = 0;
        const maxClicks = 10;
        const totalErrors = 7; 
        const clickedWords = new Set();

        const errorExplanations = {
            "tecnoligia": "Erro comum na grafia de 'tecnologia'. Mensagens com esse tipo de erro podem gerar desconfiança e parecer tentativas de phishing.",
            "acessivel": "A palavra correta é 'acessível', com acento. Erros como este são frequentemente usados para tentar enganar o destinatário.",
            "comunicadus": "Forma incorreta de 'comunicados'. O plural errado pode fazer a mensagem parecer menos confiável, um sinal típico de phishing.",
            "intervençãoes": "O correto é 'intervenções', com acento no 'e'. A grafia incorreta pode ser usada para criar urgência e confundir o destinatário em mensagens fraudulentas.",
            "projetoes": "Erro de pluralização. A forma correta é 'projetos'. Erros assim podem ser indicativos de uma tentativa de phishing.",
            "funcionamemto": "Erro ortográfico — o correto seria 'funcionamento' com 'n'. Erros assim são comuns em tentativas de phishing, usados para simular pressa e urgência.",
            "auxilio": "Acentuação incorreta. A forma correta é 'auxílio' com acento agudo no 'i'. Erros como esse são comuns em fraudes, tentando passar uma sensação de informalidade ou erro."
        };

        const erros = Object.keys(errorExplanations);

        const errorCounter = this.add.text(centerX, 50, `Erros encontrados: 0/${totalErrors}`, {
            fontFamily: 'Arial',
            fontSize: '20px',
            fill: '#000',
        }).setOrigin(0.5);

        const clickCounter = this.add.text(centerX, 80, `Cliques: 0/${maxClicks}`, {
            fontFamily: 'Arial',
            fontSize: '18px',
            fill: '#333',
        }).setOrigin(0.5);

        const boxTopY = centerY - 200;
        const emailBoxWidth = 400;
        const emailBoxHeight = 425;

        this.add.rectangle(centerX - 420 + emailBoxWidth / 2, boxTopY + emailBoxHeight / 2, emailBoxWidth, emailBoxHeight, 0xffffff)
            .setStrokeStyle(2, 0x00ff00);

        this.add.rectangle(centerX + 80 + emailBoxWidth / 2, boxTopY + emailBoxHeight / 2, emailBoxWidth, emailBoxHeight, 0xffffff)
            .setStrokeStyle(2, 0xff0000);
        
        const textPadding2 = 5;
        const drawEmailHeader = (x, y) => {
            const style = { fontFamily: 'Arial', fontSize: '12px', fill: '#555' };
            this.add.text(x + textPadding2, y, `De: João <joao@email.com>`, style);
            this.add.text(x + textPadding2, y + 15, `Assunto: Solicitação de apoio urgente`, style);
            this.add.text(x + textPadding2, y + 30, `Data: 12 de Maio, 11:45`, style);
        };

        drawEmailHeader(centerX - 420, boxTopY + 10);
        drawEmailHeader(centerX + 80, boxTopY + 10);

        const correctText = `Olá,

Estamos enfrentando problemas no desenvolvimento do novo projeto de tecnologia. A área de comunicação precisa melhorar a acessibilidade nos sistemas da empresa.

O comunicado sobre a intervenção nos processos será enviado ainda esta semana. As intervenções incluem alterações no sistema, além de mudanças no funcionamento dos servidores.

Preciso que todos os envolvidos revisem os documentos de projeto e auxílio na implementação das melhorias.

Agradeço a colaboração!`;

        const incorrectText = `Olá,

Estamos enfrentando problemas no desenvolvimento do novo projeto de tecnoligia. A área de comunicação precisa melhorar a acessivel nos sistemas da empresa.

O comunicadus sobre a intervençãoes nos processos será enviado ainda esta semana. As intervenções incluem alterações no sistema, além de mudanças no funcionamemto dos servidores.

Preciso que todos os envolvidos revisem os documentos de projetoes e auxilio na implementação das melhorias.

Agradeço a colaboração!`;

        const renderText = (scene, x, y, text, errors, interactive = false) => {
            const lineHeight = 20;
            const maxWidth = 360;
            let offsetY = y;

            const paragraphs = text.split('\n\n');

            paragraphs.forEach(paragraph => {
                const words = paragraph.split(' ');
                let line = '';
                let lineWords = [];

                words.forEach((word, index) => {
                    const testLine = line + word + ' ';
                    const testText = scene.add.text(0, 0, testLine, { fontFamily: 'Arial', fontSize: '14px' }).setVisible(false);
                    const testWidth = testText.width;
                    testText.destroy();

                    if (testWidth > maxWidth && lineWords.length > 0) {
                        let offsetX = x;
                        lineWords.forEach(w => {
                            const clean = w.trim().replace(/[.,!?;-]+$/, '');
                            const isError = errors.includes(clean);
                            const wordObj = scene.add.text(offsetX, offsetY, w + ' ', {
                                fontFamily: 'Arial',
                                fontSize: '14px',
                                fill: '#000',
                                wordWrap: { width: maxWidth },
                            });

                            if (interactive) {
                                wordObj.setInteractive();
                                wordObj.on('pointerdown', () => {
                                    userClicks++;
                                    clickCounter.setText(`Cliques: ${userClicks}/${maxClicks}`);

                                    if (!wordObj.clicked) {
                                        wordObj.clicked = true;

                                        if (isError && !clickedWords.has(clean)) {
                                            clickedWords.add(clean);

                                            scene.tweens.add({
                                                targets: wordObj,
                                                scale: 1.3,
                                                duration: 150,
                                                yoyo: true,
                                                ease: 'Power2',
                                                onYoyo: () => wordObj.setStyle({ fill: '#ff0000', backgroundColor: '#ffff00' })
                                            });

                                            errorsFound++;
                                            errorCounter.setText(`Erros encontrados: ${errorsFound}/${totalErrors}`);
                                        }
                                    }

                                    if (errorsFound === totalErrors) {
                                        showResults(true);
                                    } else if (userClicks >= maxClicks) {
                                        showResults(false);
                                    }
                                });
                            }

                            offsetX += wordObj.width;
                        });

                        offsetY += lineHeight;
                        line = word + ' ';
                        lineWords = [word];
                    } else {
                        line += word + ' ';
                        lineWords.push(word);
                    }

                    if (index === words.length - 1 && lineWords.length > 0) {
                        let offsetX = x;
                        lineWords.forEach(w => {
                            const clean = w.trim().replace(/[.,!?;-]+$/, '');
                            const isError = errors.includes(clean);
                            const wordObj = scene.add.text(offsetX, offsetY, w + ' ', {
                                fontFamily: 'Arial',
                                fontSize: '14px',
                                fill: '#000',
                                wordWrap: { width: maxWidth },
                            });

                            if (interactive) {
                                wordObj.setInteractive();
                                wordObj.on('pointerdown', () => {
                                    userClicks++;
                                    clickCounter.setText(`Cliques: ${userClicks}/${maxClicks}`);

                                    if (!wordObj.clicked) {
                                        wordObj.clicked = true;

                                        if (isError && !clickedWords.has(clean)) {
                                            clickedWords.add(clean);

                                            scene.tweens.add({
                                                targets: wordObj,
                                                scale: 1.3,
                                                duration: 150,
                                                yoyo: true,
                                                ease: 'Power2',
                                                onYoyo: () => wordObj.setStyle({ fill: '#ff0000', backgroundColor: '#ffff00' })
                                            });

                                            errorsFound++;
                                            errorCounter.setText(`Erros encontrados: ${errorsFound}/${totalErrors}`);
                                        }
                                    }

                                    if (errorsFound === totalErrors) {
                                        showResults(true);
                                    } else if (userClicks >= maxClicks) {
                                        showResults(false);
                                    }
                                });
                            }

                            offsetX += wordObj.width;
                        });

                        offsetY += lineHeight;
                    }
                });

                offsetY += 10;
            });
        };

        const textStartY = boxTopY + 60;
        const textPadding = 5;

        renderText(this, centerX - 420 + textPadding, textStartY, correctText, []);
        renderText(this, centerX + 80 + textPadding, textStartY, incorrectText, erros, true);


        const showResults = (success) => {
            const resultText = success
                ? 'Parabéns! Você encontrou todos os erros!'
                : 'Você não encontrou todos os erros a tempo. Veja os que identificou:';

            this.add.text(centerX, centerY + 250, resultText, {
                fontFamily: 'Arial',
                fontSize: '20px',
                fill: success ? '#00cc00' : '#cc0000',
                wordWrap: { width: 600 },
                align: 'center',
            }).setOrigin(0.5);

            let explanationY = 150;
            clickedWords.forEach((erro) => {
                const balloonX = centerX + 500;

                const balloon = this.add.text(balloonX, explanationY, `${erro}:\n${errorExplanations[erro]}`, {
                    fontFamily: 'Arial',
                    fontSize: '12px',
                    backgroundColor: '#ffffff',
                    fill: '#000000',
                    padding: { x: 8, y: 6 },
                    wordWrap: { width: 200 },
                }).setOrigin(0);

                const found = this.children.getChildren().find(c =>
                    c.text && c.text.includes(erro) && c.clicked
                );

                if (found) {
                    this.add.line(0, 0, found.x + found.width / 2, found.y + 8, balloonX, explanationY + 10, 0x000000)
                        .setOrigin(0)
                        .setLineWidth(1);
                }

                explanationY += balloon.height + 10;
            });

            if (success) {
                const nivelAtual = 'nivel4'; // Alterado para nivel4
                const completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [];
                if (!completedLevels.includes(nivelAtual)) {
                    completedLevels.push(nivelAtual);
                    localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
                }
            }

            showRestartButton();
        };

        const showRestartButton = () => {
            const restartBtn = this.add.text(centerX, centerY + 320, 'Reiniciar Nível', {
                fontFamily: 'Arial',
                fontSize: '18px',
                backgroundColor: '#eeeeee',
                fill: '#000',
                padding: { x: 10, y: 5 },
            })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => this.scene.restart())
                .on('pointerover', () => restartBtn.setStyle({ fill: '#007acc' }))
                .on('pointerout', () => restartBtn.setStyle({ fill: '#000' }));
        };

        this.add.text(centerX - 250, centerY - 280, "E-mail Verdadeiro", {
            fontFamily: 'Arial',
            fontSize: '18px',
            fill: '#00aa00',
        }).setOrigin(0.5);

        this.add.text(centerX + 250, centerY - 280, "E-mail com Erros", {
            fontFamily: 'Arial',
            fontSize: '18px',
            fill: '#aa0000',
        }).setOrigin(0.5);

        const backButton = this.add.text(centerX, centerY + 360, 'Voltar ao Menu de Níveis', {
            fontFamily: 'Arial',
            fontSize: '18px',
            fill: '#ff0000',
            backgroundColor: '#1a1a1a',
            padding: { x: 10, y: 5 },
        })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('Jogo7Erros'))
            .on('pointerover', () => backButton.setStyle({ fill: '#ffff00' }))
            .on('pointerout', () => backButton.setStyle({ fill: '#ff0000' }));
    }
}
