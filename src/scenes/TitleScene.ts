import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../constants';
import { audioManager } from '../systems/AudioGenerator';

export class TitleScene extends Phaser.Scene {
  private stars: { x: number; y: number; speed: number; obj: Phaser.GameObjects.Arc }[] = [];
  private enterKey!: Phaser.Input.Keyboard.Key;
  private optionsKey!: Phaser.Input.Keyboard.Key;
  private audioInitialized = false;

  constructor() {
    super({ key: 'TitleScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLORS.bg_dark);
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // Scrolling star background
    this.stars = [];
    for (let i = 0; i < 80; i++) {
      const x = Phaser.Math.Between(0, GAME_WIDTH);
      const y = Phaser.Math.Between(0, GAME_HEIGHT);
      const size = Phaser.Math.FloatBetween(0.5, 2);
      const speed = 20 + size * 30;
      const alpha = 0.3 + size * 0.3;
      const star = this.add.circle(x, y, size, 0xffffff, alpha);
      this.stars.push({ x, y, speed, obj: star });
    }

    // Title text
    const title = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60, 'VOID BLOSSOM', {
      fontFamily: 'monospace',
      fontSize: '52px',
      color: '#00ccff',
      fontStyle: 'bold',
      stroke: '#003366',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 10, 'A Bullet Hell Odyssey', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#ff44aa',
    }).setOrigin(0.5);

    // "Press ENTER to Start" with pulsing animation
    const prompt = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60, 'Press ENTER to Start', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: prompt,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Options prompt
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 95, 'Press O for Options', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#8888aa',
    }).setOrigin(0.5);

    // Input
    this.enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.optionsKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.O);

    // Cleanup on shutdown
    this.events.on('shutdown', () => {
      this.input.keyboard!.removeKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
      this.input.keyboard!.removeKey(Phaser.Input.Keyboard.KeyCodes.O);
      this.stars = [];
    });
  }

  update(_time: number, delta: number): void {
    // Scroll stars leftward
    const dt = delta / 1000;
    for (const star of this.stars) {
      star.obj.x -= star.speed * dt;
      if (star.obj.x < -5) {
        star.obj.x = GAME_WIDTH + 5;
        star.obj.y = Phaser.Math.Between(0, GAME_HEIGHT);
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.initAudioOnce();
      audioManager.playUIConfirm();
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('MenuScene');
      });
    }

    if (Phaser.Input.Keyboard.JustDown(this.optionsKey)) {
      this.initAudioOnce();
      audioManager.playUIConfirm();
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('OptionsScene', { returnScene: 'TitleScene' });
      });
    }
  }

  private initAudioOnce(): void {
    if (!this.audioInitialized) {
      audioManager.init();
      this.audioInitialized = true;
    }
  }
}
