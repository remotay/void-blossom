import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../constants';
import { audioManager } from '../systems/AudioGenerator';
import { StageData } from '../types';

export class GameOverScene extends Phaser.Scene {
  private score = 0;
  private stage: StageData | null = null;
  private countdown = 9;
  private countdownText!: Phaser.GameObjects.Text;
  private countdownTimer!: Phaser.Time.TimerEvent;
  private continueChosen = false;
  private expired = false;

  private enterKey!: Phaser.Input.Keyboard.Key;
  private escKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data: { score?: number; stage?: StageData }): void {
    this.score = data.score ?? 0;
    this.stage = data.stage ?? null;
    this.countdown = 9;
    this.continueChosen = false;
    this.expired = false;
  }

  create(): void {
    this.cameras.main.setBackgroundColor(0x050510);
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // "GAME OVER" text with dramatic appearance
    const goText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80, 'GAME OVER', {
      fontFamily: 'monospace',
      fontSize: '48px',
      color: '#ff3333',
      fontStyle: 'bold',
      stroke: '#330000',
      strokeThickness: 4,
    }).setOrigin(0.5).setAlpha(0).setScale(1.5);

    this.tweens.add({
      targets: goText,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 800,
      ease: 'Bounce.easeOut',
    });

    // Score display
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, `Final Score: ${this.score.toLocaleString()}`, {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#ffcc00',
    }).setOrigin(0.5);

    // Continue prompt
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30, 'Continue?', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 55, '(Score will be halved)', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#8888aa',
    }).setOrigin(0.5);

    // Countdown number
    this.countdownText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 90, '9', {
      fontFamily: 'monospace',
      fontSize: '36px',
      color: '#00ccff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Controls hint
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 135, 'Press ENTER to Continue | ESC to Decline', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#555577',
    }).setOrigin(0.5);

    // Countdown timer
    this.countdownTimer = this.time.addEvent({
      delay: 1000,
      repeat: 8,
      callback: () => {
        this.countdown--;
        this.countdownText.setText(this.countdown.toString());

        // Pulse animation
        this.tweens.add({
          targets: this.countdownText,
          scaleX: 1.3,
          scaleY: 1.3,
          duration: 100,
          yoyo: true,
        });

        if (this.countdown <= 0) {
          this.onDecline();
        }
      },
    });

    // Input
    this.enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.escKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // Cleanup
    this.events.on('shutdown', () => {
      this.input.keyboard!.removeKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
      this.input.keyboard!.removeKey(Phaser.Input.Keyboard.KeyCodes.ESC);
      if (this.countdownTimer) {
        this.countdownTimer.destroy();
      }
    });
  }

  update(): void {
    if (this.continueChosen || this.expired) return;

    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.onContinue();
    }

    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      this.onDecline();
    }
  }

  private onContinue(): void {
    if (this.continueChosen || this.expired) return;
    this.continueChosen = true;

    audioManager.playUIConfirm();
    this.countdownTimer.destroy();

    // Halve score
    this.score = Math.floor(this.score / 2);

    // Restart stage with continue
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('StageIntroScene');
    });
  }

  private onDecline(): void {
    if (this.expired) return;
    this.expired = true;

    this.countdownTimer.destroy();
    this.countdownText.setText('');

    // Show final results
    const returnText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 90, 'Press ENTER to Return to Title', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#8888aa',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: returnText,
      alpha: 0.4,
      duration: 600,
      yoyo: true,
      repeat: -1,
    });

    // Wait for enter to return to title
    const waitForEnter = () => {
      if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
        audioManager.playUIConfirm();
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('TitleScene');
        });
      }
    };

    this.events.on('update', waitForEnter);
    this.events.on('shutdown', () => {
      this.events.off('update', waitForEnter);
    });
  }
}
