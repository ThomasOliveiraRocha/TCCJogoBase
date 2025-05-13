export default class OptionsScene extends Phaser.Scene {
    constructor() {
      super('OptionsScene');
    }
  
    create() {
      this.add.text(300, 100, 'Opções', {
        fontFamily: 'VT323',
        fontSize: '32px',
        fill: '#ffffff',
      });
  
      // Verifique o estado inicial da música
      const music = this.game.music;
      const isMusicPlaying = music && music.isPlaying;
      const toggleMusicText = this.add.text(300, 200, isMusicPlaying ? 'Desligar Música' : 'Ligar Música', {
        fontFamily: 'VT323',
        fontSize: '24px',
        fill: '#00ff00',
      })
        .setInteractive()
        .on('pointerdown', () => {
          if (music) {
            if (music.isPlaying) {
              music.pause();
              toggleMusicText.setText('Ligar Música');
            } else {
              music.resume();
              toggleMusicText.setText('Desligar Música');
            }
          }
        })
        .on('pointerover', () => {
          toggleMusicText.setStyle({ fill: '#ffff00' });
        })
        .on('pointerout', () => {
          toggleMusicText.setStyle({ fill: '#00ff00' });
        });
  
      // Texto de volume
      const volumeText = this.add.text(300, 250, `Volume: ${(music.volume * 100).toFixed(0)}%`, {
        fontFamily: 'VT323',
        fontSize: '24px',
        fill: '#ffffff',
      });
  
      // Botão para aumentar o volume
      const increaseVolume = this.add.text(300, 300, '+ Aumentar Volume', {
        fontFamily: 'VT323',
        fontSize: '20px',
        fill: '#00ff00',
      })
        .setInteractive()
        .on('pointerdown', () => {
          if (music.volume < 1) {
            music.setVolume(Math.min(music.volume + 0.1, 1));
            volumeText.setText(`Volume: ${(music.volume * 100).toFixed(0)}%`);
          }
        })
        .on('pointerover', () => {
          increaseVolume.setStyle({ fill: '#ffff00' });
        })
        .on('pointerout', () => {
          increaseVolume.setStyle({ fill: '#00ff00' });
        });
  
      // Botão para diminuir o volume
      const decreaseVolume = this.add.text(300, 350, '- Diminuir Volume', {
        fontFamily: 'VT323',
        fontSize: '20px',
        fill: '#ff0000',
      })
        .setInteractive()
        .on('pointerdown', () => {
          if (music.volume > 0) {
            music.setVolume(Math.max(music.volume - 0.1, 0));
            volumeText.setText(`Volume: ${(music.volume * 100).toFixed(0)}%`);
          }
        })
        .on('pointerover', () => {
          decreaseVolume.setStyle({ fill: '#ffff00' });
        })
        .on('pointerout', () => {
          decreaseVolume.setStyle({ fill: '#ff0000' });
        });
  
      // Botão para voltar ao menu principal
      const backButton = this.add.text(300, 400, 'Voltar', {
        fontFamily: 'VT323',
        fontSize: '24px',
        fill: '#ff0000',
      })
        .setInteractive()
        .on('pointerdown', () => {
          this.scene.start('MenuScene');
        })
        .on('pointerover', () => {
          backButton.setStyle({ fill: '#ffff00' });
        })
        .on('pointerout', () => {
          backButton.setStyle({ fill: '#ff0000' });
        });
    }
  }
  