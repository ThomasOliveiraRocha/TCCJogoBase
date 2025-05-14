export default class errosnivel7 extends Phaser.Scene {
    constructor() {
        super('errosnivel7');
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.add.text(centerX, 20, 'Nível 7: Identifique os Erros', {
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
            "compareçer": "Erros ortográficos grosseiros são comuns em e-mails fraudulentos, usados para filtrar apenas os alvos mais desatentos.",
            "infelismente": "Grafias erradas como essa são típicas de mensagens falsas automatizadas ou traduzidas por ferramentas de baixa qualidade.",
            "departameto": "Pequenos erros de digitação podem indicar que o e-mail não é oficial, sendo uma tentativa de enganar com aparência de urgência ou informalidade.",
            "reestruturassão": "Palavras inventadas ou malformadas são indícios de que o remetente não tem domínio da linguagem corporativa — típico de golpes genéricos.",
            "acompanhar-mos": "Erros de conjugação podem revelar que o conteúdo foi montado rapidamente ou copiado de outro idioma, um padrão comum em golpes.",
            "comforme": "Trocas sutis como essa ('com' por 'con') são usadas em ataques para simular familiaridade e evitar filtros automáticos de spam.",
            "preocupasão": "Erros propositais ou exagerados de ortografia são usados para atrair alvos mais vulneráveis — uma técnica conhecida em ataques de engenharia social.",
        };

        const erros = Object.keys(errorExplanations);

        const errorCounter = this.add.text(centerX, 50, `Erros encontrados: 0/${totalErrors}`, {
            fontFamily: 'VT323',
            fontSize: '20px',
            fill: '#003366',
        }).setOrigin(0.5);

        const clickCounter = this.add.text(centerX, 80, `Cliques: 0/${maxClicks}`, {
            fontFamily: 'VT323',
            fontSize: '18px',
            fill: '#003366',
        }).setOrigin(0.5);

        let gameOver = false;

        const boxTopY = centerY - 200;
        const emailBoxWidth = 400;
        const emailBoxHeight = 425;

        this.add.rectangle(centerX - 420 + emailBoxWidth / 2, boxTopY + emailBoxHeight / 2, emailBoxWidth, emailBoxHeight, 0xffffff)
            .setStrokeStyle(2, 0x00ff00);

        this.add.rectangle(centerX + 80 + emailBoxWidth / 2, boxTopY + emailBoxHeight / 2, emailBoxWidth, emailBoxHeight, 0xffffff)
            .setStrokeStyle(2, 0xff0000);

        const drawEmailHeader = (x, y, isIncorrect = false) => {
            const style = { fontFamily: 'VT323', fontSize: '12px', fill: '#555' };
            const headerLines = isIncorrect
                ? [
                    'De: Recursos Humanos <rh@empresa.com>',
                    'Assunto: Reunião comforme novas diretrizes',
                    'Data: 18 de Abril, 15:00'
                ]
                : [
                    'De: Recursos Humanos <rh@empresa.com>',
                    'Assunto: Reunião conforme novas diretrizes',
                    'Data: 18 de Abril, 15:00'
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

        drawEmailHeader(centerX - 420, boxTopY + 10, false);
        drawEmailHeader(centerX + 80, boxTopY + 10, true);

        const correctText = `Prezados colaboradores,

Informamos que a reunião será realizada no dia 20 de abril, às 15h, no auditório principal. Todos os membros do departamento devem comparecer pontualmente.

Infelizmente, a reestruturação da equipe exigirá mudanças que serão detalhadas nesse encontro.

Precisamos nos unir para acompanharmos as novas metas e processos definidos.

Agradecemos pela atenção e colaboração.`;

        const incorrectText = `Prezados colaboradores,

Informamos que a reunião será realizada no dia 20 de abril, às 15h, no auditório principal. Todos os membros do departameto devem compareçer pontualmente.

Infelismente, a reestruturassão da equipe exigirá mudanças que serão detalhadas nesse encontro.

Precisamos nos unir para acompanhar-mos as novas metas e processos definidos.

Agradecemos pela preocupasão e colaboração.`;

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
                fontFamily: 'VT323',
                fontSize: '20px',
                fill: success ? '#00cc00' : '#cc0000',
                wordWrap: { width: 600 },
                align: 'center',
            }).setOrigin(0.5);

            let explanationY = 150;
            clickedWords.forEach((erro) => {
                const balloonX = centerX + 500;

                const balloon = this.add.text(balloonX, explanationY, `${erro}:\n${errorExplanations[erro]}`, {
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
                const nivelAtual = 'nivel6';
                const completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [];
                if (!completedLevels.includes(nivelAtual)) {
                    completedLevels.push(nivelAtual);
                    localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
                }
            }

            showRestartButton();

            const nextLevelButton = this.add.text(centerX, centerY + 360, 'Próximo Nível →', {
                fontFamily: 'VT323',
                fontSize: '18px',
                backgroundColor: '#00cc00',
                fill: '#fff',
                padding: { x: 12, y: 6 },
            })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => this.scene.start('errosnivel7'))
                .on('pointerover', () => nextLevelButton.setStyle({ fill: '#000' }))
                .on('pointerout', () => nextLevelButton.setStyle({ fill: '#fff' }));
        };

        const showRestartButton = () => {
            const restartBtn = this.add.text(centerX, centerY + 320, 'Reiniciar Nível', {
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

        this.add.text(centerX - 250, centerY - 280, "E-mail Verdadeiro", {
            fontFamily: 'VT323',
            fontSize: '18px',
            fill: '#00aa00',
        }).setOrigin(0.5);

        this.add.text(centerX + 250, centerY - 280, "E-mail com Erros", {
            fontFamily: 'VT323',
            fontSize: '18px',
            fill: '#aa0000',
        }).setOrigin(0.5);

        const backButton = this.add.text(centerX, centerY + 400, 'Voltar ao Menu de Níveis', {
            fontFamily: 'VT323',
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
