export default class errosnivel10 extends Phaser.Scene {
    constructor() {
        super('errosnivel10');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const centerX = width / 2;
        

        this.add.text(centerX, 20, 'Nível 10: Identifique os Erros', {
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
            "convida-los": "Esse tipo de erro de acentuação é comum em mensagens de phishing, pois golpistas tentam replicar textos formais sem dominar a gramática corretamente.",
            "apresentacão": "A troca de caracteres ou ausência de acentos pode indicar uma tentativa de driblar filtros anti-spam ou criar urgência sem passar por revisores oficiais.",
            "Capybada": "Alterações sutis em nomes de marcas confiáveis são típicas de ataques de engenharia social que tentam enganar o destinatário com uma aparência quase legítima.",
            "America": "A falta de acento em nomes próprios pode indicar que o autor do e-mail não é nativo do idioma, o que é comum em ataques internacionais de phishing.",
            "14.30": "O uso incorreto de pontuação em horários pode ser sinal de que o remetente não está habituado com os padrões locais — outro indício comum de fraude.",
            "abril": "A utilização incorreta de letras maiúsculas em nomes de meses pode denunciar descuido ou falta de profissionalismo — características comuns em e-mails falsos.",
            "traz": "Essa expressão escrita de forma errada ('por traz' em vez de 'por trás') pode ser usada para parecer natural, mas indica que o autor não domina bem a língua — típico em golpes disfarçados de mensagens corporativas.",
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

        let gameOver = false; // novo controle para bloquear cliques

        const boxTopY = height * 0.2;
        const emailBoxWidth = width * 0.28;
        const emailBoxHeight = height * 0.45;

        this.add.rectangle(centerX - emailBoxWidth - 40, boxTopY, emailBoxWidth, emailBoxHeight, 0xffffff)
            .setOrigin(0, 0)
            .setStrokeStyle(2, 0x00ff00);

        this.add.rectangle(centerX + 40, boxTopY, emailBoxWidth, emailBoxHeight, 0xffffff)
            .setOrigin(0, 0)
            .setStrokeStyle(2, 0xff0000);

        const drawEmailHeader = (x, y, isIncorrect = false) => {
            const style = { fontFamily: 'VT323', fontSize: '12px', fill: '#555' };
            const headerLines = isIncorrect
                ? [
                    'De: Equipe Capybada <contato@capybara.coin>',
                    'Assunto: Apresentação Capybara Coin no FLISoL',
                    'Data: 27 de abril, 14.30'
                ]
                : [
                    'De: Equipe Capybara <contato@capybara.coin>',
                    'Assunto: Apresentação Capybara Coin no FLISoL',
                    'Data: 27 de Abril, 14:30'
                ];

            headerLines.forEach((line, lineIndex) => {
                let offsetX = x + 5;
                const parts = line.split(/([\s<>:,]+)/);

                parts.forEach((part) => {
                    const clean = part.replace(/[<>:,]/g, '').trim();
                    const isError = isIncorrect && erros.includes(clean);
                    const wordObj = this.add.text(offsetX, y + lineIndex * 15, part, style);

                    if (isIncorrect && clean && /\S/.test(clean)) {
                        wordObj.setInteractive();
                        wordObj.on('pointerdown', () => {
                            if (gameOver) return;
                            userClicks++;
                            clickCounter.setText(`Cliques: ${userClicks}/${maxClicks}`);

                            if (!wordObj.clicked) {
                                wordObj.clicked = true;

                                if (isError && !clickedWords.has(clean)) {
                                    clickedWords.add(clean);

                                    this.tweens.add({
                                        targets: wordObj,
                                        scale: 1.3,
                                        duration: 150,
                                        yoyo: true,
                                        ease: 'Power2',
                                        onYoyo: () => wordObj.setStyle({ fill: '#ff0000', backgroundColor: '#ffff00' }),
                                    });

                                    errorsFound++;
                                    errorCounter.setText(`Erros encontrados: ${errorsFound}/${totalErrors}`);
                                }
                            }

                            if (errorsFound === totalErrors || userClicks >= maxClicks) {
                                gameOver = true;
                                showResults(errorsFound === totalErrors);
                            }
                        });
                    }

                    offsetX += wordObj.width;
                });
            });
        };

        drawEmailHeader(centerX - emailBoxWidth - 40, boxTopY + 10,false);
        drawEmailHeader(centerX + 40, boxTopY + 10,true);

        const correctText = `Prezados,

Gostaríamos de convidá-los para a apresentação oficial da Capybara Coin durante o FLISoL o maior evento de software livre da América Latina. 

A exposição ocorrerá no auditório principal às 14:30 do dia 27 de Abril. Discutiremos os principais avanços da tecnologia por trás da moeda, além de apresentar casos de uso reais em comunidades descentralizadas.

Contamos com a presença de todos para fortalecer nossa rede e ampliar o conhecimento sobre soluções baseadas em blockchain.

Atenciosamente,
Equipe Capybara Coin.
`;

        const incorrectText = `Prezados,

Gostaríamos de convida-los para a apresentacão oficial da Capybara Coin durante o FLISoL o maior evento de software livre da America Latina. 

A exposição ocorrerá no auditório principal às 14:30 do dia 27 de Abril. Discutiremos os principais avanços da tecnologia por traz da moeda, além de apresentar casos de uso reais em comunidades descentralizadas.

Contamos com a presença de todos para fortalecer nossa rede e ampliar o conhecimento sobre soluçôes baseadas em blockchain.

Atenciosamente,
Equipe Capybara Coin.
`;

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
                    const testText = scene.add.text(0, 0, testLine, { fontFamily: 'VT323', fontSize: '14px'}).setVisible(false);
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
                                    if (gameOver) return;
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


        const resultY = boxTopY + emailBoxHeight + 20;

        renderText(this, centerX - emailBoxWidth - 30, boxTopY + 60, correctText, []);
        renderText(this, centerX + 50, boxTopY + 60, incorrectText, erros, true);

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
                const nivelAtual = 'errosnivel10';
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
