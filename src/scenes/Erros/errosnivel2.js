export default class errosnivel2 extends Phaser.Scene {
    constructor() {
        super('errosnivel2');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const centerX = width / 2;
        const centerY = height / 2;

        this.add.text(centerX, 20, 'Nível 2: Identifique os Erros', {
            fontFamily: 'VT323',
            fontSize: '26px',
            fill: '#003366',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 2,
            shadow: { offsetX: 2, offsetY: 2, color: '#999', blur: 2, fill: true },
        }).setOrigin(0.5);

        let errorsFound = 0;
        let userClicks = 0;
        const maxClicks = 10;
        const totalErrors = 7;
        const clickedWords = new Set();

        const errorExplanations = {
            "comeca": "A forma correta é 'começa', com cedilha. A ausência do 'ç' pode indicar que o autor está usando um teclado estrangeiro ou tentando parecer desatento para ganhar confiança da vítima.",
            "rapidamemte": "Erro ortográfico — o correto seria 'rapidamente' com 'n'. Erros assim são comuns em tentativas de phishing, usados para simular pressa e urgência.",
            "relatorio": "A palavra 'relatório' está sem acento. Esse tipo de erro pode fazer o e-mail parecer mais casual ou apressado, mascarando sua real intenção maliciosa.",
            "estarei": "No texto original, a expressão era 'vou estar'. Alterações sutis de estilo como essa podem indicar que o autor do e-mail não é quem diz ser, o que levanta suspeitas.",
            "tenha": "Erro de concordância verbal — o correto seria 'tenham'. Pode indicar amadorismo ou tentativa de parecer informal e inofensivo, estratégia comum em phishing.",
            "Joao": "A falta de acento em 'João' é um erro simples, mas recorrente em e-mails de phishing. Pode sinalizar que o remetente está tentando imitar alguém ou digitando de forma descuidada.",
            "Nós": "A forma correta no contexto é 'Nos', sem acento. O uso incorreto de pronomes pode indicar que o autor está tentando copiar uma estrutura de e-mail sem domínio da língua, levantando suspeitas."
        };

        const erros = Object.keys(errorExplanations);

        const errorCounter = this.add.text(centerX, 60, `Erros encontrados: 0/${totalErrors}`, {
            fontFamily: 'VT323',
            fontSize: '20px',
            fill: '#003366',
        }).setOrigin(0.5);

        const clickCounter = this.add.text(centerX, 90, `Cliques: 0/${maxClicks}`, {
            fontFamily: 'VT323',
            fontSize: '18px',
            fill: '#003366',
        }).setOrigin(0.5);

        const boxTopY = height * 0.2;
        const emailBoxWidth = width * 0.28;
        const emailBoxHeight = height * 0.45;

        this.add.rectangle(centerX - emailBoxWidth - 40, boxTopY, emailBoxWidth, emailBoxHeight, 0xffffff)
            .setOrigin(0, 0)
            .setStrokeStyle(2, 0x00ff00);

        this.add.rectangle(centerX + 40, boxTopY, emailBoxWidth, emailBoxHeight, 0xffffff)
            .setOrigin(0, 0)
            .setStrokeStyle(2, 0xff0000);

        const textPadding = 8;
        const drawEmailHeader = (x, y) => {
            const style = { fontFamily: 'VT323', fontSize: '12px', fill: '#555' };
            this.add.text(x + textPadding, y, `De: João <joao@email.com>`, style);
            this.add.text(x + textPadding, y + 15, `Assunto: Pedido urgente`, style);
            this.add.text(x + textPadding, y + 30, `Data: 12 de Maio, 16:45`, style);
        };

        drawEmailHeader(centerX - emailBoxWidth - 40, boxTopY + 10);
        drawEmailHeader(centerX + 40, boxTopY + 10);

        const correctText = `Eu estou indo para o trabalho agora.

A reunião começa em vinte minutos, então preciso sair rapidamente.

O relatório foi concluído e está pronto para ser enviado.

Se precisar de alguma coisa, me avise que eu vou estar disponível.

Nos vemos depois, e espero que todos tenham um bom dia!

- João`;

        const incorrectText = `Eu estou indo para o trabalho agora.

A reunião comeca em vinte minutos, então preciso sair rapidamemte.

O relatorio foi concluído e está pronto para ser enviado.

Se precisar de alguma coisa, me avise que eu estarei disponível.

Nós vemos depois, e espero que todos tenha um bom dia!

- Joao`;

        const renderText = (scene, x, y, text, errors, interactive = false) => {
            const lineHeight = 18;
            const maxWidth = emailBoxWidth - 20;
            let offsetY = y;

            const paragraphs = text.split('\n\n');

            paragraphs.forEach(paragraph => {
                const words = paragraph.split(' ');
                let line = '';
                let lineWords = [];

                words.forEach((word, index) => {
                    const testLine = line + word + ' ';
                    const testText = scene.add.text(0, 0, testLine, { fontFamily: 'VT323', fontSize: '14px' }).setVisible(false);
                    const testWidth = testText.width;
                    testText.destroy();

                    if (testWidth > maxWidth && lineWords.length > 0) {
                        let offsetX = x;
                        lineWords.forEach(w => {
                            const clean = w.trim().replace(/[.,!?;-]+$/, '');
                            const isError = errors.includes(clean);
                            const wordObj = scene.add.text(offsetX, offsetY, w + ' ', {
                                fontFamily: 'VT323',
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
                                fontFamily: 'VT323',
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

        renderText(this, centerX - emailBoxWidth - 30, boxTopY + 60, correctText, []);
        renderText(this, centerX + 50, boxTopY + 60, incorrectText, erros, true);

        const resultY = boxTopY + emailBoxHeight + 20;
        const showResults = (success) => {
            

            const resultText = success
                ? 'Parabéns! Você encontrou todos os erros!'
                : 'Você não encontrou todos os erros a tempo. Veja os que identificou:';

            this.add.text(centerX, resultY, resultText, {
                fontFamily: 'VT323',
                fontSize: '20px',
                fill: success ? '#00cc00' : '#cc0000',
                wordWrap: { width: 600 },
                align: 'center',
            }).setOrigin(0.5);

            let explanationY = 50;
            clickedWords.forEach((erro) => {
                const balloonX = width - 240;

                const balloon = this.add.text(balloonX, explanationY, `${erro}:
${errorExplanations[erro]}`, {
                    fontFamily: 'VT323',
                    fontSize: '12px',
                    backgroundColor: '#ffffff',
                    fill: '#000000',
                    padding: { x: 8, y: 6 },
                    wordWrap: { width: 200 },
                }).setOrigin(0);

                explanationY += balloon.height + 10;
            });

            if (success) {
                const nivelAtual = 'errosnivel2';
                const completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [];
                if (!completedLevels.includes(nivelAtual)) {
                    completedLevels.push(nivelAtual);
                    localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
                }
            }

            const restartBtn = this.add.text(centerX, resultY + 40, 'Reiniciar Nível', {
                fontFamily: 'VT323',
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

            const nextLevelButton = this.add.text(centerX, resultY + 80, 'Próximo Nível →', {
                fontFamily: 'VT323',
                fontSize: '18px',
                backgroundColor: '#00cc00',
                fill: '#fff',
                padding: { x: 12, y: 6 },
            })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => this.scene.start('errosnivel3'))
                .on('pointerover', () => nextLevelButton.setStyle({ fill: '#000' }))
                .on('pointerout', () => nextLevelButton.setStyle({ fill: '#fff' }));

            


        };
        const backButton = this.add.text(centerX, resultY + 120, 'Voltar ao Menu de Níveis', {
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
                .on('pointerdown', () => this.scene.start('Jogo7Erros'));

        this.add.text(centerX - emailBoxWidth / 2 - 40, boxTopY - 20, "E-mail Verdadeiro", {
            fontFamily: 'VT323',
            fontSize: '18px',
            fill: '#00aa00',
        }).setOrigin(0.5);

        this.add.text(centerX + emailBoxWidth / 2 + 40, boxTopY - 20, "E-mail com Erros", {
            fontFamily: 'VT323',
            fontSize: '18px',
            fill: '#aa0000',
        }).setOrigin(0.5);
    }
}
