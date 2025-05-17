export default class OptionsScene extends Phaser.Scene {
  constructor() {
    super('OptionsScene');
  }

  create() {
    const { width, height } = this.scale;

    const music = this.game.music;
    const isMusicPlaying = music && music.isPlaying;

    // Título
    const title = this.add.text(0, -160, 'Opções', {
      fontFamily: 'VT323',
      fontSize: '48px',
      fill: '#ffffff',
    }).setOrigin(0.5);

    // Texto de ativar/desativar música
    const toggleMusicText = this.add.text(0, -80, isMusicPlaying ? '🔊 Desligar Música' : '🔇 Ligar Música', {
      fontFamily: 'VT323',
      fontSize: '28px',
      fill: '#ffffff',
      backgroundColor: '#333',
      padding: { x: 20, y: 10 },
      align: 'center',
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setShadow(2, 2, '#000', 2, true, true)
      .on('pointerdown', () => {
        if (music) {
          if (music.isPlaying) {
            music.pause();
            toggleMusicText.setText('🔇 Ligar Música');
          } else {
            music.resume();
            toggleMusicText.setText('🔊 Desligar Música');
          }
        }
      })
      .on('pointerover', () => {
        toggleMusicText.setStyle({ backgroundColor: '#5555aa', fill: '#ffffaa' });
        toggleMusicText.setScale(1.05);
      })
      .on('pointerout', () => {
        toggleMusicText.setStyle({ backgroundColor: '#333', fill: '#ffffff' });
        toggleMusicText.setScale(1);
      });


    // Texto de volume
    const volumeText = this.add.text(0, -20, `Volume: ${(music.volume * 100).toFixed(0)}%`, {
      fontFamily: 'VT323',
      fontSize: '26px',
      fill: '#ffffff',
    }).setOrigin(0.5);

    // Controles de volume (visual e funcional)
    const buttonStyle = {
      fontFamily: 'VT323',
      fontSize: '32px',
      fill: '#ffffff',
      backgroundColor: '#222',
      padding: { x: 15, y: 5 }
    };

    const decreaseVolume = this.add.text(-60, 30, '←', buttonStyle)
      .setOrigin(0.5)
      .setInteractive()
      .setShadow(2, 2, '#000', 2, true, true)
      .on('pointerdown', () => {
        let vol = parseFloat((music.volume - 0.1).toFixed(1));
        if (vol >= 0) {
          music.setVolume(vol);
          volumeText.setText(`Volume: ${(vol * 100).toFixed(0)}%`);
        }
      })
      .on('pointerover', () => {
        decreaseVolume.setStyle({ backgroundColor: '#884444', fill: '#ffffaa' });
        decreaseVolume.setScale(1.05);
      })
      .on('pointerout', () => {
        decreaseVolume.setStyle({ backgroundColor: '#222', fill: '#ffffff' });
        decreaseVolume.setScale(1);
      });

    const increaseVolume = this.add.text(60, 30, '→', buttonStyle)
      .setOrigin(0.5)
      .setInteractive()
      .setShadow(2, 2, '#000', 2, true, true)
      .on('pointerdown', () => {
        let vol = parseFloat((music.volume + 0.1).toFixed(1));
        if (vol <= 1) {
          music.setVolume(vol);
          volumeText.setText(`Volume: ${(vol * 100).toFixed(0)}%`);
        }
      })
      .on('pointerover', () => {
        increaseVolume.setStyle({ backgroundColor: '#448844', fill: '#ffffaa' });
        increaseVolume.setScale(1.05);
      })
      .on('pointerout', () => {
        increaseVolume.setStyle({ backgroundColor: '#222', fill: '#ffffff' });
        increaseVolume.setScale(1);
      });


    // Botão Voltar
    const backButton = this.add.text(0, 120, 'Voltar ao Menu', {
      fontFamily: 'VT323',
      fontSize: '26px',
      fill: '#ffffff',
      backgroundColor: '#660000',
      padding: { x: 20, y: 10 },
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setShadow(2, 2, '#000', 2, true, true)
      .on('pointerover', () => {
        backButton.setStyle({ backgroundColor: '#aa0000', fill: '#ffffaa' });
        backButton.setScale(1.07);
      })
      .on('pointerout', () => {
        backButton.setStyle({ backgroundColor: '#660000', fill: '#ffffff' });
        backButton.setScale(1);
      })
      .on('pointerdown', () => this.scene.start('MenuScene'));


    // Container com todos os elementos
    const container = this.add.container(width / 2, height / 2, [
      title,
      toggleMusicText,
      volumeText,
      decreaseVolume,
      increaseVolume,
      backButton
    ]);

    // Caixa de fundo com tamanho ajustado ao container
    const background = this.add.rectangle(width / 2, height / 2, 550, 400, 0x000000, 0.6);
    background.setStrokeStyle(2, 0xffffff);
    background.setDepth(-1); // Fica atrás do container

    // Fade-in
    container.alpha = 0;
    this.tweens.add({
      targets: container,
      alpha: 1,
      duration: 500,
      ease: 'Power2',
    });


    // Caixa de descrição sobre o jogo / TCC
    const infoText = this.add.text(0, 0,
      'Este projeto faz parte do TCC de Engenharia da Computação\n' +
      'do aluno Thomas Oliveira, abordando formas de ataque como\n' +
      'phishing, engenharia social e outros tipos de ameaças digitais.',
      {
        fontFamily: 'VT323',
        fontSize: '20px',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 500 }
      }
    ).setOrigin(0.5);

    // Posição abaixo do container anterior
    const infoY = height / 2 + 250; // ajusta conforme a altura da primeira caixa

    infoText.setPosition(width / 2, infoY);

    // Caixa de fundo para o texto
    const infoBackground = this.add.rectangle(width / 2, infoY, 550, 130, 0x000000, 0.5);
    infoBackground.setStrokeStyle(2, 0xffffff);

    // Garantir que o fundo fique atrás do texto
    infoBackground.setDepth(-1);

  }
}
