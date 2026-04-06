import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../constants';
import { StageData } from '../types';

export class StageIntroScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StageIntroScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLORS.bg_dark);

    const stage: StageData | undefined = this.registry.get('currentStage');
    const stageIndex: number = this.registry.get('stageIndex') ?? 0;

    const stageName = stage?.name ?? 'Unknown Stage';
    const teachingGoal = stage?.teachingGoal ?? '';
    const stageNum = stageIndex + 1;

    // Stage number - slides in from left
    const numText = this.add.text(-200, GAME_HEIGHT / 2 - 40, `Stage ${stageNum}`, {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#8888aa',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Stage name - slides in from right
    const nameText = this.add.text(GAME_WIDTH + 200, GAME_HEIGHT / 2, stageName, {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#00ccff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Teaching goal flavor text - fades in
    const goalText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50, teachingGoal, {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ff44aa',
      fontStyle: 'italic',
    }).setOrigin(0.5).setAlpha(0);

    // Decorative lines
    const lineTop = this.add.graphics();
    lineTop.lineStyle(1, COLORS.hud_border, 0);
    lineTop.lineBetween(GAME_WIDTH / 2 - 200, GAME_HEIGHT / 2 - 65, GAME_WIDTH / 2 + 200, GAME_HEIGHT / 2 - 65);

    const lineBot = this.add.graphics();
    lineBot.lineStyle(1, COLORS.hud_border, 0);
    lineBot.lineBetween(GAME_WIDTH / 2 - 200, GAME_HEIGHT / 2 + 25, GAME_WIDTH / 2 + 200, GAME_HEIGHT / 2 + 25);

    // Animate slide-in
    this.tweens.add({
      targets: numText,
      x: GAME_WIDTH / 2,
      duration: 600,
      ease: 'Power2',
    });

    this.tweens.add({
      targets: nameText,
      x: GAME_WIDTH / 2,
      duration: 600,
      ease: 'Power2',
      delay: 200,
    });

    this.tweens.add({
      targets: goalText,
      alpha: 1,
      duration: 500,
      delay: 600,
    });

    // Fade in decorative lines
    this.tweens.addCounter({
      from: 0,
      to: 0.6,
      duration: 400,
      delay: 100,
      onUpdate: (tween) => {
        const v = tween.getValue();
        lineTop.clear();
        lineTop.lineStyle(1, COLORS.hud_border, v);
        lineTop.lineBetween(GAME_WIDTH / 2 - 200, GAME_HEIGHT / 2 - 65, GAME_WIDTH / 2 + 200, GAME_HEIGHT / 2 - 65);
        lineBot.clear();
        lineBot.lineStyle(1, COLORS.hud_border, v);
        lineBot.lineBetween(GAME_WIDTH / 2 - 200, GAME_HEIGHT / 2 + 25, GAME_WIDTH / 2 + 200, GAME_HEIGHT / 2 + 25);
      },
    });

    // Hold for 2.5 seconds, then transition
    this.time.delayedCall(2500, () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('GameScene');
      });
    });
  }
}
