export default class quizz8 extends Phaser.Scene {
    constructor() {
        super('quizz8');
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        const larguraCaixa = 700;
        const alturaCaixa = 400;

        const caixaFundo = this.add.rectangle(centerX, centerY, larguraCaixa, alturaCaixa, 0xf0f0f0)
            .setStrokeStyle(4, 0x003366)
            .setOrigin(0.5);

        const pergunta = 'O que melhor define um ataque de "DNS Spoofing"?';

        const alternativas = [
            
            { texto: 'Interceptar pacotes de dados e alterá-los durante o tráfego entre cliente e servidor.', correta: false }, // MITM
            { texto: 'Redirecionar uma vítima para um site falso por meio de manipulação de respostas DNS.', correta: true },
            { texto: 'Forçar um servidor DNS a ficar indisponível através de sobrecarga.', correta: false }, // DDoS
            { texto: 'Invadir um banco de dados para alterar entradas de DNS diretamente.', correta: false }, // confunde propositalmente
            { texto: 'Fingir ser um servidor legítimo usando um certificado falso.', correta: false }, // SSL Spoofing, quase certo
        ];

        this.add.text(centerX, centerY - alturaCaixa / 2 + 30, 'Quiz 8: Segurança da Informação', {
            fontFamily: 'VT323',
            fontSize: '26px',
            fill: '#003366',
            stroke: '#ffffff',
            strokeThickness: 2,
        }).setOrigin(0.5);

        this.add.text(centerX, centerY - 120, pergunta, {
            fontFamily: 'VT323',
            fontSize: '20px',
            fill: '#000',
            wordWrap: { width: 600 },
            align: 'center',
        }).setOrigin(0.5);

        const espacamento = 50;
        let respostasBloqueadas = false;
        const botoes = [];

        alternativas.forEach((alt, index) => {
            const altBtn = this.add.text(centerX, centerY - 40 + index * espacamento, alt.texto, {
                fontFamily: 'VT323',
                fontSize: '18px',
                backgroundColor: '#e0e0e0',
                fill: '#000',
                padding: { x: 10, y: 6 },
                wordWrap: { width: 550 },
            })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerover', () => {
                    if (!respostasBloqueadas) altBtn.setStyle({ fill: '#003366' });
                })
                .on('pointerout', () => {
                    if (!respostasBloqueadas) altBtn.setStyle({ fill: '#000' });
                })
                .on('pointerdown', () => {
                    if (respostasBloqueadas) return;
                    respostasBloqueadas = true;

                    if (alt.correta) {
                        altBtn.setStyle({ backgroundColor: '#00cc00', fill: '#fff' });
                        altBtn.setText('✅ ' + alt.texto);
                        this.showResultado(true);
                        this.salvarProgresso();
                    } else {
                        altBtn.setStyle({ backgroundColor: '#cc0000', fill: '#fff' });
                        altBtn.setText('❌ ' + alt.texto);
                        this.showResultado(false);

                        botoes.forEach(btnObj => {
                            if (btnObj.alt.correta) {
                                btnObj.texto.setStyle({ backgroundColor: '#00cc00', fill: '#fff' });
                                btnObj.texto.setText('✅ ' + btnObj.alt.texto);
                            }
                        });
                    }
                });

            botoes.push({ texto: altBtn, alt });
        });

        const voltarMenu = this.add.text(centerX, centerY + alturaCaixa / 2 + 60, '← Voltar ao Menu de Níveis', {
            fontFamily: 'VT323',
            fontSize: '18px',
            fill: '#ff0000',
            backgroundColor: '#eeeeee',
            padding: { x: 10, y: 5 },
        })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('Quizz'));

        const proximoBtn = this.add.text(centerX, voltarMenu.y - 40, 'Próxima Pergunta →', {
            fontFamily: 'VT323',
            fontSize: '18px',
            backgroundColor: '#003366',
            fill: '#fff',
            padding: { x: 10, y: 5 },
        })
            .setOrigin(0.5)
            .setInteractive()
            .setVisible(false)
            .on('pointerover', () => proximoBtn.setStyle({ fill: '#ffff00' }))
            .on('pointerout', () => proximoBtn.setStyle({ fill: '#fff' }))
            .on('pointerdown', () => this.scene.start('quizz9'));  // próxima cena

        const tentarNovamenteBtn = this.add.text(centerX, voltarMenu.y - 40, '🔁 Tentar Novamente', {
            fontFamily: 'VT323',
            fontSize: '18px',
            backgroundColor: '#666666',
            fill: '#ffffff',
            padding: { x: 10, y: 5 },
        })
            .setOrigin(0.5)
            .setInteractive()
            .setVisible(false)
            .on('pointerover', () => tentarNovamenteBtn.setStyle({ fill: '#ffff00' }))
            .on('pointerout', () => tentarNovamenteBtn.setStyle({ fill: '#ffffff' }))
            .on('pointerdown', () => this.scene.restart());

        this.showResultado = (respostaCorreta) => {
            proximoBtn.setVisible(respostaCorreta);
            tentarNovamenteBtn.setVisible(!respostaCorreta);
        };

        this.salvarProgresso = () => {
            const nivelAtual = 'quizz8';
            const completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [];
            if (!completedLevels.includes(nivelAtual)) {
                completedLevels.push(nivelAtual);
                localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
            }
        };
    }
}
