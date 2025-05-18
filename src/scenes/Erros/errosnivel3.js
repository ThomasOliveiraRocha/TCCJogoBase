export default class errosnivel3 extends Phaser.Scene {
    constructor() {
        super('errosnivel3');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const centerX = width / 2;
        const centerY = height / 2;

        this.add.text(centerX, 20, 'Nível 3: Identifique os Erros', {
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
            "academico": "Falta de acento em 'acadêmico'. Esse erro pode reduzir a credibilidade da mensagem e é um indicativo comum em tentativas de phishing, tentando parecer menos formal.",
            "Campus": "Forma errada de 'Câmpus', segundo a grafia oficial adotada pela UTFPR. Erros como esse podem ser usados para criar uma sensação de urgência e engano, típicos de mensagens fraudulentas.",
            "contra-tempo": "A forma correta é 'contratempo', sem hífen. O uso incorreto de hifenização pode ser uma estratégia para confundir e manipular o leitor, um padrão comum em tentativas de phishing.",
            "mochilha": "Erro grosseiro de ortografia. A grafia correta é 'mochila'. Erros assim são frequentemente usados para induzir a uma resposta rápida sem atenção ao conteúdo, característica de fraudes.",
            "notbook": "Palavra inexistente. Provavelmente uma tentativa incorreta de 'notebook'. Esse tipo de erro é comumente utilizado em fraudes para disfarçar a mensagem e parecer menos oficial.",
            "registei": "Erro de conjugação verbal. O correto é 'registrei', com 'r'. A utilização de formas incorretas de palavras pode ser uma tentativa de enganar o leitor e gerar pressa, característica de phishing.",
            "gentilesa": "Forma incorreta de 'gentileza'. Erros em palavras de cortesia podem indicar baixa escolaridade ou tentativa de fraude. Mensagens fraudulentas frequentemente utilizam erros assim para diminuir a formalidade e enganar o destinatário."
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
        const emailBoxHeight = height * 0.55;

        this.add.rectangle(centerX - emailBoxWidth - 40, boxTopY, emailBoxWidth, emailBoxHeight, 0xffffff)
            .setOrigin(0, 0)
            .setStrokeStyle(2, 0x00ff00);

        this.add.rectangle(centerX + 40, boxTopY, emailBoxWidth, emailBoxHeight, 0xffffff)
            .setOrigin(0, 0)
            .setStrokeStyle(2, 0xff0000);

        const textPadding = 8;
        const drawEmailHeader = (x, y) => {
            const style = { fontFamily: 'VT323', fontSize: '12px', fill: '#555' };
            this.add.text(x + textPadding, y, `De: Ana <ana@email.com>`, style);
            this.add.text(x + textPadding, y + 15, `Assunto: Ajuda urgente`, style);
            this.add.text(x + textPadding, y + 30, `Data: 10 de Maio, 14:32`, style);
        };

        drawEmailHeader(centerX - emailBoxWidth - 40, boxTopY + 10);
        drawEmailHeader(centerX + 40, boxTopY + 10);

        const correctText = `Olá,

Estou participando de um evento acadêmico na UTFPR – Câmpus Apucarana e tive um contratempo inesperado. Durante o intervalo de uma palestra, acabei perdendo minha mochila, que continha meu notebook, documentos e minha carteira.

Já registrei boletim de ocorrência e entrei em contato com a coordenação, mas não consegui resolver tudo a tempo. Meu ônibus de volta para casa sai ainda hoje à noite, mas estou sem dinheiro para pagar a passagem.

Você poderia, por gentileza, transferir R$ 85 via Pix para que eu consiga retornar? Assim que chegar em casa, eu devolvo o valor.

Agradeço imensamente pela ajuda!

Abraços,  
Lucas`;

        const incorrectText = `Olá,

Estou participando de um evento academico na UTFPR – Campus Apucarana e tive um contra-tempo inesperado. Durante o intervalo de uma palestra, acabei perdendo minha mochilha, que continha meu notbook, documentos e minha carteira.

Já registei boletim de ocorrência e entrei em contato com a coordenação, mas não consegui resolver tudo a tempo. Meu ônibus de volta para casa sai ainda hoje à noite, mas estou sem dinheiro para pagar a passagem.

Você poderia, por gentilesa, transferir R$ 85 via Pix para que eu consiga retornar? Assim que chegar em casa, eu devolvo o valor.

Agradeço imensamente pela ajuda!

Abraços,  
Lucas`;

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

            let explanationY = 20;
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
                const nivelAtual = 'errosnivel3';
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
                .on('pointerdown', () => this.scene.start('errosnivel4'))
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
