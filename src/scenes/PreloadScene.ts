import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../constants';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;

    // Dark background
    this.cameras.main.setBackgroundColor(COLORS.bg_dark);

    // Game title
    const title = this.add.text(cx, cy - 40, 'VOID BLOSSOM', {
      fontFamily: 'monospace',
      fontSize: '36px',
      color: '#00ccff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Loading bar background
    const barWidth = 300;
    const barHeight = 8;
    const barX = cx - barWidth / 2;
    const barY = cy + 30;

    this.add.rectangle(cx, barY + barHeight / 2, barWidth, barHeight, 0x222244).setOrigin(0.5);

    // Loading bar fill
    const fill = this.add.rectangle(barX, barY, 0, barHeight, COLORS.primary).setOrigin(0, 0);

    // Loading text
    const loadText = this.add.text(cx, barY + 24, 'Loading...', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#8888aa',
    }).setOrigin(0.5);

    // Animate loading bar then transition
    this.tweens.add({
      targets: fill,
      width: barWidth,
      duration: 800,
      ease: 'Power2',
      onComplete: () => {
        loadText.setText('Ready');
        this.time.delayedCall(300, () => {
          this.cameras.main.fadeOut(300, 0, 0, 0);
          this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('TitleScene');
          });
        });
      },
    });
  }
}
