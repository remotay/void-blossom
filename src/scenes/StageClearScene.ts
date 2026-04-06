import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../constants';
import { audioManager } from '../systems/AudioGenerator';
import { stages } from '../data/stages';
import { StageData, PlayerState } from '../types';

export class StageClearScene extends Phaser.Scene {
  private stageScore = 0;
  private grazeCount = 0;
  private stageIndex = 0;
  private stage: StageData | null = null;
  private playerState: PlayerState | null = null;

  constructor() {
    super({ key: 'StageClearScene' });
  }

  init(data: {
    score?: number;
    graze?: number;
    stage?: StageData;
    stageIndex?: number;
    playerState?: PlayerState;
  }): void {
    this.stageScore = data.score ?? 0;
    this.grazeCount = data.graze ?? 0;
    this.stage = data.stage ?? null;
    this.stageIndex = data.stageIndex ?? 0;
    this.playerState = data.playerState ?? null;
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLORS.bg_dark);
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // "STAGE CLEAR" celebration text
    const clearText = this.add.text(GAME_WIDTH / 2, 80, 'STAGE CLEAR', {
      fontFamily: 'monospace',
      fontSize: '40px',
      color: '#33ff66',
      fontStyle: 'bold',
      stroke: '#003300',
      strokeThickness: 3,
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: clearText,
      alpha: 1,
      duration: 600,
      ease: 'Power2',
    });

    // Stage name
    this.add.text(GAME_WIDTH / 2, 130, this.stage?.name ?? 'Unknown', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#00ccff',
    }).setOrigin(0.5);

    // Score breakdown
    const startY = 180;
    const spacing = 35;
    let y = startY;

    // Stage score
    const scoreLabel = this.add.text(GAME_WIDTH / 2 - 120, y, 'Stage Score:', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#8888aa',
    });
    const scoreValue = this.add.text(GAME_WIDTH / 2 + 120, y, this.stageScore.toLocaleString(), {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#ffcc00',
      fontStyle: 'bold',
    }).setOrigin(1, 0);
    y += spacing;

    // Graze count
    this.add.text(GAME_WIDTH / 2 - 120, y, 'Graze Count:', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#8888aa',
    });
    this.add.text(GAME_WIDTH / 2 + 120, y, this.grazeCount.toString(), {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#00ccff',
      fontStyle: 'bold',
    }).setOrigin(1, 0);
    y += spacing;

    // Graze bonus
    const grazeBonus = this.grazeCount * 100;
    this.add.text(GAME_WIDTH / 2 - 120, y, 'Graze Bonus:', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#8888aa',
    });
    this.add.text(GAME_WIDTH / 2 + 120, y, `+${grazeBonus.toLocaleString()}`, {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#33ff66',
      fontStyle: 'bold',
    }).setOrigin(1, 0);
    y += spacing;

    // Clear bonus
    const clearBonus = 50000;
    this.add.text(GAME_WIDTH / 2 - 120, y, 'Clear Bonus:', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#8888aa',
    });
    this.add.text(GAME_WIDTH / 2 + 120, y, `+${clearBonus.toLocaleString()}`, {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#33ff66',
      fontStyle: 'bold',
    }).setOrigin(1, 0);
    y += spacing + 10;

    // Decorative line
    const line = this.add.graphics();
    line.lineStyle(1, COLORS.hud_border, 0.6);
    line.lineBetween(GAME_WIDTH / 2 - 140, y, GAME_WIDTH / 2 + 140, y);
    y += 15;

    // Total
    const total = this.stageScore + grazeBonus + clearBonus;
    this.add.text(GAME_WIDTH / 2 - 120, y, 'TOTAL:', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    this.add.text(GAME_WIDTH / 2 + 120, y, total.toLocaleString(), {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#ffcc00',
      fontStyle: 'bold',
    }).setOrigin(1, 0);

    // Simple celebration particles
    this.createCelebrationParticles();

    // Auto-advance after 3 seconds
    this.time.delayedCall(3000, () => {
      this.advance();
    });
  }

  private advance(): void {
    const nextIndex = this.stageIndex + 1;

    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      if (nextIndex < stages.length) {
        // More stages
        this.registry.set('currentStage', stages[nextIndex]);
        this.registry.set('stageIndex', nextIndex);
        this.scene.start('StageIntroScene');
      } else {
        // Final stage cleared - victory
        this.scene.start('VictoryScene', {
          totalScore: (this.stageScore + this.grazeCount * 100 + 50000),
          totalGraze: this.grazeCount,
          continues: this.playerState?.continues ?? 0,
        });
      }
    });
  }

  private createCelebrationParticles(): void {
    // Create small twinkling particles
    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(100, GAME_WIDTH - 100);
      const y = Phaser.Math.Between(50, GAME_HEIGHT - 50);
      const colors = [COLORS.primary, COLORS.accent, COLORS.safe, COLORS.secondary];
      const color = colors[i % colors.length];
      const size = Phaser.Math.FloatBetween(1, 3);

      const particle = this.add.circle(x, y, size, color, 0);

      this.tweens.add({
        targets: particle,
        alpha: { from: 0, to: 0.8 },
        scaleX: { from: 0.5, to: 1.5 },
        scaleY: { from: 0.5, to: 1.5 },
        duration: Phaser.Math.Between(400, 800),
        delay: Phaser.Math.Between(0, 1500),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }
}
