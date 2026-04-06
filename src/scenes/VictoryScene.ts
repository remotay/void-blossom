import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../constants';
import { audioManager } from '../systems/AudioGenerator';

export class VictoryScene extends Phaser.Scene {
  private totalScore = 0;
  private totalGraze = 0;
  private continuesUsed = 0;
  private enterKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'VictoryScene' });
  }

  init(data: { totalScore?: number; totalGraze?: number; continues?: number }): void {
    this.totalScore = data.totalScore ?? 0;
    this.totalGraze = data.totalGraze ?? 0;
    this.continuesUsed = data.continues ?? 0;
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLORS.bg_dark);
    this.cameras.main.fadeIn(800, 0, 0, 0);

    // Celebratory particles
    this.createParticles();

    // "CONGRATULATIONS"
    const congrats = this.add.text(GAME_WIDTH / 2, 70, 'CONGRATULATIONS', {
      fontFamily: 'monospace',
      fontSize: '38px',
      color: '#ffcc00',
      fontStyle: 'bold',
      stroke: '#333300',
      strokeThickness: 3,
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: congrats,
      alpha: 1,
      duration: 1000,
      ease: 'Power2',
    });

    // Victory message
    this.add.text(GAME_WIDTH / 2, 120, 'You have conquered the Void!', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#ff44aa',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // Statistics
    const startY = 180;
    const spacing = 35;
    let y = startY;

    // Decorative line
    const lineTop = this.add.graphics();
    lineTop.lineStyle(1, COLORS.hud_border, 0.6);
    lineTop.lineBetween(GAME_WIDTH / 2 - 150, y - 10, GAME_WIDTH / 2 + 150, y - 10);

    // Total Score
    this.add.text(GAME_WIDTH / 2 - 120, y, 'Total Score:', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#8888aa',
    });
    this.add.text(GAME_WIDTH / 2 + 120, y, this.totalScore.toLocaleString(), {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#ffcc00',
      fontStyle: 'bold',
    }).setOrigin(1, 0);
    y += spacing;

    // Total Graze
    this.add.text(GAME_WIDTH / 2 - 120, y, 'Total Graze:', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#8888aa',
    });
    this.add.text(GAME_WIDTH / 2 + 120, y, this.totalGraze.toString(), {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#00ccff',
      fontStyle: 'bold',
    }).setOrigin(1, 0);
    y += spacing;

    // Continues Used
    this.add.text(GAME_WIDTH / 2 - 120, y, 'Continues Used:', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#8888aa',
    });
    this.add.text(GAME_WIDTH / 2 + 120, y, this.continuesUsed.toString(), {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: this.continuesUsed === 0 ? '#33ff66' : '#ff4466',
      fontStyle: 'bold',
    }).setOrigin(1, 0);
    y += spacing;

    // No-continue bonus
    if (this.continuesUsed === 0) {
      y += 5;
      this.add.text(GAME_WIDTH / 2, y, 'PERFECT RUN - No Continues!', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#33ff66',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      y += spacing;
    }

    // Decorative line
    const lineBot = this.add.graphics();
    lineBot.lineStyle(1, COLORS.hud_border, 0.6);
    lineBot.lineBetween(GAME_WIDTH / 2 - 150, y, GAME_WIDTH / 2 + 150, y);

    // Return to title prompt
    y += 40;
    const returnText = this.add.text(GAME_WIDTH / 2, y, 'Press ENTER to Return to Title', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: returnText,
      alpha: 0.3,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Input
    this.enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // Cleanup
    this.events.on('shutdown', () => {
      this.input.keyboard!.removeKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    });
  }

  update(): void {
    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      audioManager.playUIConfirm();
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('TitleScene');
      });
    }
  }

  private createParticles(): void {
    // Floating celebration particles
    const colors = [COLORS.primary, COLORS.accent, COLORS.safe, COLORS.secondary, 0xffffff];

    for (let i = 0; i < 40; i++) {
      const x = Phaser.Math.Between(0, GAME_WIDTH);
      const y = Phaser.Math.Between(0, GAME_HEIGHT);
      const color = colors[i % colors.length];
      const size = Phaser.Math.FloatBetween(1, 3);

      const particle = this.add.circle(x, y, size, color, 0);

      this.tweens.add({
        targets: particle,
        alpha: { from: 0, to: Phaser.Math.FloatBetween(0.3, 0.9) },
        y: y - Phaser.Math.Between(20, 60),
        duration: Phaser.Math.Between(1000, 3000),
        delay: Phaser.Math.Between(0, 2000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }
}
