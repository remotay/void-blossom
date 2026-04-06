import Phaser from 'phaser';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  HUD_X,
  HUD_WIDTH,
  PLAY_WIDTH,
  PLAYER_MAX_POWER,
  COLORS,
} from '../constants';

interface HUDData {
  score: number;
  lives: number;
  bombs: number;
  power: number;
  graze: number;
  bossActive: boolean;
  bossHealth: number;
  bossMaxHealth: number;
  bossName: string;
  stageName: string;
  options: number;
  rapidFire: boolean;
  rearShot: boolean;
}

export class HUDScene extends Phaser.Scene {
  // HUD text elements
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private bombsText!: Phaser.GameObjects.Text;
  private powerText!: Phaser.GameObjects.Text;
  private grazeText!: Phaser.GameObjects.Text;
  private stageText!: Phaser.GameObjects.Text;
  private upgradesText!: Phaser.GameObjects.Text;

  // Power bar
  private powerBarBg!: Phaser.GameObjects.Graphics;
  private powerBarFill!: Phaser.GameObjects.Graphics;

  // Boss health bar (shown at top of play area when boss is active)
  private bossBarBg!: Phaser.GameObjects.Graphics;
  private bossBarFill!: Phaser.GameObjects.Graphics;
  private bossNameText!: Phaser.GameObjects.Text;
  private bossBarVisible = false;

  // Cached values to avoid redrawing every frame
  private lastPower = -1;
  private lastBossRatio = -1;

  constructor() {
    super({ key: 'HUDScene' });
  }

  create(): void {
    // HUD background panel
    const bg = this.add.graphics();
    bg.fillStyle(COLORS.hud_bg, 0.95);
    bg.fillRect(HUD_X, 0, HUD_WIDTH, GAME_HEIGHT);

    // Border line on left edge of HUD
    bg.lineStyle(2, COLORS.hud_border, 0.8);
    bg.lineBetween(HUD_X, 0, HUD_X, GAME_HEIGHT);

    const cx = HUD_X + HUD_WIDTH / 2;
    const leftPad = HUD_X + 16;
    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#8888aa',
    };
    const valueStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#ffffff',
    };

    // -- Score --
    let y = 20;
    this.add.text(leftPad, y, 'SCORE', textStyle);
    y += 16;
    this.scoreText = this.add.text(leftPad, y, '0', {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#ffcc00',
      fontStyle: 'bold',
    });

    // -- Lives --
    y += 40;
    this.add.text(leftPad, y, 'LIVES', textStyle);
    y += 16;
    this.livesText = this.add.text(leftPad, y, '', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#44ff88',
    });

    // -- Bombs --
    y += 30;
    this.add.text(leftPad, y, 'BOMBS', textStyle);
    y += 16;
    this.bombsText = this.add.text(leftPad, y, '', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#00ccff',
    });

    // -- Power --
    y += 35;
    this.add.text(leftPad, y, 'POWER', textStyle);
    y += 16;
    this.powerText = this.add.text(leftPad, y, '0 / 128', {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#ffaa00',
    });
    y += 18;

    // Power bar
    const barW = HUD_WIDTH - 32;
    const barH = 10;
    this.powerBarBg = this.add.graphics();
    this.powerBarBg.fillStyle(0x222244, 1);
    this.powerBarBg.fillRect(leftPad, y, barW, barH);
    this.powerBarBg.lineStyle(1, COLORS.hud_border, 0.6);
    this.powerBarBg.strokeRect(leftPad, y, barW, barH);

    this.powerBarFill = this.add.graphics();

    // -- Graze --
    y += 25;
    this.add.text(leftPad, y, 'GRAZE', textStyle);
    y += 16;
    this.grazeText = this.add.text(leftPad, y, '0', valueStyle);

    // -- Stage --
    y += 35;
    this.add.text(leftPad, y, 'STAGE', textStyle);
    y += 16;
    this.stageText = this.add.text(leftPad, y, '', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#00ccff',
      wordWrap: { width: HUD_WIDTH - 32 },
    });

    // -- Upgrades --
    y += 35;
    this.add.text(leftPad, y, 'UPGRADES', textStyle);
    y += 16;
    this.upgradesText = this.add.text(leftPad, y, '---', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#00ffcc',
      wordWrap: { width: HUD_WIDTH - 32 },
      lineSpacing: 2,
    });

    // -- Controls hint at bottom --
    this.add.text(cx, GAME_HEIGHT - 60, 'Z: Shoot\nX: Bomb\nShift: Focus\nESC: Pause', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#444466',
      align: 'center',
      lineSpacing: 3,
    }).setOrigin(0.5);

    // Boss health bar (top of play area, hidden by default)
    this.bossBarBg = this.add.graphics().setVisible(false);
    this.bossBarFill = this.add.graphics().setVisible(false);
    this.bossNameText = this.add.text(PLAY_WIDTH / 2, 8, '', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#ffffff',
    }).setOrigin(0.5, 0).setVisible(false);

    // Listen for updates from GameScene
    const gameScene = this.scene.get('GameScene');
    gameScene.events.on('hud-update', this.onHUDUpdate, this);

    // Cleanup
    this.events.on('shutdown', () => {
      gameScene.events.off('hud-update', this.onHUDUpdate, this);
    });
  }

  private onHUDUpdate(data: HUDData): void {
    // Score
    this.scoreText.setText(data.score.toLocaleString());

    // Lives as hearts
    this.livesText.setText('\u2665 '.repeat(Math.max(0, data.lives)).trim());

    // Bombs as stars
    this.bombsText.setText('\u2605 '.repeat(Math.max(0, data.bombs)).trim());

    // Power
    this.powerText.setText(`${data.power} / ${PLAYER_MAX_POWER}`);
    if (data.power !== this.lastPower) {
      this.lastPower = data.power;
      this.drawPowerBar(data.power);
    }

    // Graze
    this.grazeText.setText(data.graze.toString());

    // Stage name
    this.stageText.setText(data.stageName);

    // Upgrades
    const upgrades: string[] = [];
    if (data.options > 0) upgrades.push(`Option x${data.options}`);
    if (data.rapidFire) upgrades.push('Rapid Fire');
    if (data.rearShot) upgrades.push('Rear Shot');
    this.upgradesText.setText(upgrades.length > 0 ? upgrades.join('\n') : '---');
    this.upgradesText.setColor(upgrades.length > 0 ? '#00ffcc' : '#444466');

    // Boss health bar
    if (data.bossActive && data.bossMaxHealth > 0) {
      const ratio = data.bossHealth / data.bossMaxHealth;
      if (!this.bossBarVisible) {
        this.bossBarBg.setVisible(true);
        this.bossBarFill.setVisible(true);
        this.bossNameText.setVisible(true);
        this.bossBarVisible = true;
      }
      this.bossNameText.setText(data.bossName);

      if (Math.abs(ratio - this.lastBossRatio) > 0.005) {
        this.lastBossRatio = ratio;
        this.drawBossBar(ratio);
      }
    } else if (this.bossBarVisible) {
      this.bossBarBg.setVisible(false);
      this.bossBarFill.setVisible(false);
      this.bossNameText.setVisible(false);
      this.bossBarVisible = false;
      this.lastBossRatio = -1;
    }
  }

  private drawPowerBar(power: number): void {
    const leftPad = HUD_X + 16;
    const barW = HUD_WIDTH - 32;
    const barH = 10;
    // Y position must match create layout
    const y = 20 + 16 + 40 + 16 + 30 + 16 + 35 + 16 + 18; // calculated from layout

    const ratio = power / PLAYER_MAX_POWER;

    this.powerBarFill.clear();
    this.powerBarFill.fillStyle(COLORS.power_bar, 1);
    this.powerBarFill.fillRect(leftPad, y, barW * ratio, barH);
  }

  private drawBossBar(ratio: number): void {
    const barX = 60;
    const barY = 4;
    const barW = PLAY_WIDTH - 120;
    const barH = 12;

    // Color based on ratio
    let color: number;
    if (ratio > 0.5) color = COLORS.safe;
    else if (ratio > 0.25) color = COLORS.accent;
    else color = COLORS.danger;

    this.bossBarBg.clear();
    this.bossBarBg.fillStyle(0x111122, 0.85);
    this.bossBarBg.fillRect(barX, barY, barW, barH);
    this.bossBarBg.lineStyle(1, COLORS.hud_border, 0.8);
    this.bossBarBg.strokeRect(barX, barY, barW, barH);

    this.bossBarFill.clear();
    this.bossBarFill.fillStyle(color, 1);
    this.bossBarFill.fillRect(barX, barY, barW * ratio, barH);
  }
}
