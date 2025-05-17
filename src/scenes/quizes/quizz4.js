export default class quizz4 extends Phaser.Scene {
    constructor() {
        super('quizz4');
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        const larguraCaixa = 700;
        const alturaCaixa = 400;

        const caixaFundo = this.add.rectangle(centerX, centerY, larguraCaixa, alturaCaixa, 0xf0f0f0)
            .setStrokeStyle(4, 0x003366)
            .setOrigin(0.5);

        const pergunta = 'Qual das alternativas descreve corretamente um ataque de Cross-Site Scripting (XSS)?';

        const alternativas = [
            
            {
                texto: 'Ataque que explora falhas de autenticação para obter acesso não autorizado a um sistema.',
                correta: false
            },
            {
                texto: 'Inserção de scripts maliciosos em páginas web para que sejam executados no navegador de outros usuários.',
                correta: true
            },
            {
                texto: 'Envio de pacotes massivos para derrubar um serviço, interrompendo sua disponibilidade.',
                correta: false
            },
            {
                texto: 'Interceptação de dados criptografados em trânsito para roubo de informações sensíveis.',
                correta: false
            },
            {
                texto: 'Injeção de código SQL malicioso para manipular bancos de dados.',
                correta: false
            },
        ];

        this.add.text(centerX, centerY - alturaCaixa / 2 + 30, 'Quiz 4: Segurança da Informação', {
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
            .on('pointerdown', () => this.scene.start('quizz5'));  // próxima cena

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
            const nivelAtual = 'quizz4';
            const completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [];
            if (!completedLevels.includes(nivelAtual)) {
                completedLevels.push(nivelAtual);
                localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
            }
        };
    }
}
