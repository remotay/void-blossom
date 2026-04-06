import Phaser from 'phaser';
import type { BossData, BossPhase, BossPattern } from '../types';
import { PLAY_WIDTH, PLAY_HEIGHT, COLORS } from '../constants';
import { getBossPhases } from '../data/bossPatterns';
import { audioManager } from '../systems/AudioGenerator';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const HOVER_X = 550;
const HOVER_Y = 270;
const ENTRANCE_DURATION = 2000;
const PHASE_TRANSITION_DURATION = 1500;
const DEFEAT_SEQUENCE_DURATION = 2500;
const DRIFT_AMPLITUDE = 30;
const DRIFT_SPEED = 0.6; // cycles per second
const HEALTH_BAR_WIDTH = 500;
const HEALTH_BAR_HEIGHT = 14;
const HEALTH_BAR_X = 110;
const HEALTH_BAR_Y = 16;
const PHASE_PIP_SIZE = 8;
const FLASH_DURATION = 100;
const DAMAGE_FLASH_TINT = 0xffffff;

// ---------------------------------------------------------------------------
// Boss class
// ---------------------------------------------------------------------------

export class Boss extends Phaser.GameObjects.Container {
  // -- identity --
  readonly bossName: string;
  readonly id: string;
  readonly visualTheme: string;
  readonly signatureMechanic: string;

  // -- phase / health --
  currentPhase = 0;
  phases: BossPhase[];
  health: number;
  maxHealth: number;
  active = false;

  // -- visuals --
  sprite: Phaser.GameObjects.Image;
  private healthBarBg: Phaser.GameObjects.Graphics;
  private healthBarFill: Phaser.GameObjects.Graphics;
  private healthBarBorder: Phaser.GameObjects.Graphics;
  private nameText: Phaser.GameObjects.Text;
  private phaseText: Phaser.GameObjects.Text;
  private phasePips: Phaser.GameObjects.Graphics;

  // -- internal state --
  private invulnerable = true;
  private entering = true;
  private defeated = false;
  private patternIndex = 0;
  private patternTimer = 0;
  private driftTime = 0;
  private baseY = HOVER_Y;
  private currentPatternElapsed = 0;
  private fireElapsed = 0;
  private phaseTransitioning = false;

  constructor(scene: Phaser.Scene, data: BossData) {
    super(scene, PLAY_WIDTH + 80, HOVER_Y);
    scene.add.existing(this);

    // Identity
    this.bossName = data.name;
    this.id = data.id;
    this.visualTheme = data.visualTheme;
    this.signatureMechanic = data.signatureMechanic;

    // Phases - pull the full data from bossPatterns
    this.phases = getBossPhases(data.id);
    this.health = this.phases[0].health;
    this.maxHealth = this.phases[0].health;

    // Sprite (the texture key should match the boss id)
    this.sprite = scene.add.image(0, 0, data.id);
    this.sprite.setOrigin(0.5);
    this.add(this.sprite);

    // Build health-bar UI (added to the *scene* so it stays at a fixed screen
    // position rather than moving with the boss container)
    this.healthBarBg = scene.add.graphics().setDepth(100);
    this.healthBarFill = scene.add.graphics().setDepth(101);
    this.healthBarBorder = scene.add.graphics().setDepth(102);
    this.phasePips = scene.add.graphics().setDepth(102);

    this.nameText = scene.add
      .text(HEALTH_BAR_X, HEALTH_BAR_Y - 2, data.name, {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#ffffff',
      })
      .setOrigin(0, 1)
      .setDepth(103);

    this.phaseText = scene.add
      .text(HEALTH_BAR_X + HEALTH_BAR_WIDTH, HEALTH_BAR_Y - 2, '', {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#aaaacc',
      })
      .setOrigin(1, 1)
      .setDepth(103);

    this.drawHealthBar();

    // Begin entrance
    this.beginEntrance();
  }

  // -----------------------------------------------------------------------
  // Entrance
  // -----------------------------------------------------------------------

  private beginEntrance(): void {
    this.entering = true;
    this.invulnerable = true;
    this.active = false;

    audioManager.play('warning');

    this.scene.tweens.add({
      targets: this,
      x: HOVER_X,
      y: HOVER_Y,
      duration: ENTRANCE_DURATION,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.entering = false;
        this.invulnerable = false;
        this.active = true;
        this.patternIndex = 0;
        this.currentPatternElapsed = 0;
        this.emitCurrentPattern();
      },
    });
  }

  // -----------------------------------------------------------------------
  // Update (called every frame from GameScene)
  // -----------------------------------------------------------------------

  update(time: number, delta: number): void {
    if (this.defeated || this.entering || this.phaseTransitioning) return;

    // Drift movement (sine bob)
    this.driftTime += (delta / 1000) * DRIFT_SPEED * Math.PI * 2;
    this.y = this.baseY + Math.sin(this.driftTime) * DRIFT_AMPLITUDE;

    // Keep within play area
    this.y = Phaser.Math.Clamp(this.y, 50, PLAY_HEIGHT - 50);

    // Advance pattern timer
    if (this.active) {
      this.currentPatternElapsed += delta;
      this.fireElapsed += delta;
      const phase = this.phases[this.currentPhase];
      const pattern = phase.patterns[this.patternIndex];
      const duration = pattern.duration ?? 2000;
      const fireInterval = (pattern.params.fireInterval as number) ?? 500;

      // Fire repeatedly during pattern duration
      if (this.fireElapsed >= fireInterval) {
        this.fireElapsed = 0;
        this.emitCurrentPattern();
      }

      if (this.currentPatternElapsed >= duration) {
        this.currentPatternElapsed = 0;
        this.fireElapsed = 0;
        this.patternIndex = (this.patternIndex + 1) % phase.patterns.length;
        this.emitCurrentPattern();
      }
    }

    this.drawHealthBar();
  }

  // -----------------------------------------------------------------------
  // Pattern emission
  // -----------------------------------------------------------------------

  private emitCurrentPattern(): void {
    if (this.defeated || !this.active) return;
    const phase = this.phases[this.currentPhase];
    const pattern = phase.patterns[this.patternIndex];

    this.scene.events.emit('boss-attack', {
      pattern: pattern.type,
      x: this.x,
      y: this.y,
      params: pattern.params,
    });
  }

  // -----------------------------------------------------------------------
  // Damage
  // -----------------------------------------------------------------------

  takeDamage(amount: number): void {
    if (this.invulnerable || this.defeated || !this.active) return;

    this.health -= amount;
    this.flashSprite();

    if (this.health <= 0) {
      this.health = 0;
      this.onPhaseComplete();
    }
  }

  private flashSprite(): void {
    this.sprite.setTint(DAMAGE_FLASH_TINT);
    this.scene.time.delayedCall(FLASH_DURATION, () => {
      if (!this.sprite.scene) return; // already destroyed
      this.sprite.clearTint();
    });
  }

  // -----------------------------------------------------------------------
  // Phase transitions
  // -----------------------------------------------------------------------

  private onPhaseComplete(): void {
    const isLastPhase = this.currentPhase >= this.phases.length - 1;

    if (isLastPhase) {
      this.onDefeated();
      return;
    }

    // Phase transition
    this.phaseTransitioning = true;
    this.invulnerable = true;
    this.active = false;

    // Clear bullets on screen
    this.scene.events.emit('clear-bullets');

    // Flash effect
    this.scene.cameras.main.flash(300, 255, 255, 255, true);

    audioManager.play('bossPhase');

    this.scene.time.delayedCall(PHASE_TRANSITION_DURATION, () => {
      this.currentPhase++;
      const nextPhase = this.phases[this.currentPhase];
      this.health = nextPhase.health;
      this.maxHealth = nextPhase.health;
      this.patternIndex = 0;
      this.currentPatternElapsed = 0;

      this.phaseTransitioning = false;
      this.invulnerable = false;
      this.active = true;

      this.scene.events.emit('boss-phase-change', {
        bossId: this.id,
        phase: this.currentPhase,
        phaseName: nextPhase.name,
      });

      this.emitCurrentPattern();
    });
  }

  // -----------------------------------------------------------------------
  // Defeat
  // -----------------------------------------------------------------------

  private onDefeated(): void {
    this.defeated = true;
    this.active = false;
    this.invulnerable = true;

    // Clear bullets
    this.scene.events.emit('clear-bullets');

    audioManager.play('explosion');

    // Explosion sequence - multiple flashes & shakes
    const explosionCount = 8;
    for (let i = 0; i < explosionCount; i++) {
      this.scene.time.delayedCall(i * (DEFEAT_SEQUENCE_DURATION / explosionCount), () => {
        if (!this.scene) return;
        this.scene.cameras.main.shake(150, 0.01 + i * 0.003);

        // Small random offset flash on boss
        const ox = Phaser.Math.Between(-30, 30);
        const oy = Phaser.Math.Between(-30, 30);
        const flash = this.scene.add.circle(this.x + ox, this.y + oy, 15 + i * 4, 0xffffff, 0.9);
        flash.setDepth(50);
        this.scene.tweens.add({
          targets: flash,
          alpha: 0,
          scale: 2.5,
          duration: 300,
          onComplete: () => flash.destroy(),
        });
      });
    }

    // Final big flash & emit event
    this.scene.time.delayedCall(DEFEAT_SEQUENCE_DURATION, () => {
      if (!this.scene) return;
      this.scene.cameras.main.flash(500, 255, 255, 255, true);
      this.scene.events.emit('boss-defeated', { bossId: this.id });
      this.cleanup();
    });
  }

  // -----------------------------------------------------------------------
  // Health bar rendering
  // -----------------------------------------------------------------------

  private drawHealthBar(): void {
    const ratio = Math.max(0, this.health / this.maxHealth);

    // Determine colour from ratio
    let barColor: number;
    if (ratio > 0.5) {
      barColor = COLORS.safe; // green
    } else if (ratio > 0.25) {
      barColor = COLORS.accent; // yellow
    } else {
      barColor = COLORS.danger; // red
    }

    // Background
    this.healthBarBg.clear();
    this.healthBarBg.fillStyle(0x111122, 0.85);
    this.healthBarBg.fillRect(
      HEALTH_BAR_X,
      HEALTH_BAR_Y,
      HEALTH_BAR_WIDTH,
      HEALTH_BAR_HEIGHT,
    );

    // Fill
    this.healthBarFill.clear();
    this.healthBarFill.fillStyle(barColor, 1);
    this.healthBarFill.fillRect(
      HEALTH_BAR_X,
      HEALTH_BAR_Y,
      HEALTH_BAR_WIDTH * ratio,
      HEALTH_BAR_HEIGHT,
    );

    // Border
    this.healthBarBorder.clear();
    this.healthBarBorder.lineStyle(1, COLORS.hud_border, 1);
    this.healthBarBorder.strokeRect(
      HEALTH_BAR_X,
      HEALTH_BAR_Y,
      HEALTH_BAR_WIDTH,
      HEALTH_BAR_HEIGHT,
    );

    // Phase pips
    this.phasePips.clear();
    const pipY = HEALTH_BAR_Y + HEALTH_BAR_HEIGHT + 4;
    const totalPips = this.phases.length;
    const pipSpacing = PHASE_PIP_SIZE + 4;
    const pipsStartX = HEALTH_BAR_X;

    for (let i = 0; i < totalPips; i++) {
      const px = pipsStartX + i * pipSpacing;
      if (i < this.currentPhase) {
        // completed phase
        this.phasePips.fillStyle(0x555577, 1);
      } else if (i === this.currentPhase) {
        // active phase
        this.phasePips.fillStyle(barColor, 1);
      } else {
        // future phase
        this.phasePips.fillStyle(0x222244, 1);
      }
      this.phasePips.fillRect(px, pipY, PHASE_PIP_SIZE, PHASE_PIP_SIZE);
    }

    // Phase name text
    const phase = this.phases[this.currentPhase];
    if (phase) {
      this.phaseText.setText(phase.name);
    }
  }

  // -----------------------------------------------------------------------
  // Cleanup
  // -----------------------------------------------------------------------

  private cleanup(): void {
    this.healthBarBg.destroy();
    this.healthBarFill.destroy();
    this.healthBarBorder.destroy();
    this.phasePips.destroy();
    this.nameText.destroy();
    this.phaseText.destroy();
    this.destroy();
  }

  // -----------------------------------------------------------------------
  // Accessors
  // -----------------------------------------------------------------------

  isActive(): boolean {
    return this.active && !this.defeated;
  }

  isDefeated(): boolean {
    return this.defeated;
  }

  isInvulnerable(): boolean {
    return this.invulnerable;
  }

  getCurrentPhaseName(): string {
    return this.phases[this.currentPhase]?.name ?? '';
  }

  getTotalPhases(): number {
    return this.phases.length;
  }
}
