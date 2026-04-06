import Phaser from 'phaser';
import { EnemySpawnData, EnemyType, PathData } from '../types';
import { PLAY_WIDTH, PLAY_HEIGHT, COLORS } from '../constants';
import { audioManager } from '../systems/AudioGenerator';

interface EnemyDefaults {
  health: number;
  points: number;
  speed: number;
  fireRate: number;
  firePattern: string;
}

const ENEMY_DEFAULTS: Record<EnemyType, EnemyDefaults> = {
  grunt: { health: 10, points: 100, speed: 120, fireRate: 2000, firePattern: 'aimed_single' },
  swooper: { health: 8, points: 150, speed: 150, fireRate: 1800, firePattern: 'aimed_single' },
  turret: { health: 20, points: 200, speed: 80, fireRate: 1400, firePattern: 'spread3' },
  spinner: { health: 15, points: 250, speed: 100, fireRate: 1200, firePattern: 'radial8' },
  carrier: { health: 40, points: 500, speed: 50, fireRate: 2500, firePattern: 'dense_spread' },
  miniboss: { health: 200, points: 2000, speed: 60, fireRate: 800, firePattern: 'radial16' },
};

const SPRITE_KEYS: Record<EnemyType, string> = {
  grunt: 'enemy_grunt',
  swooper: 'enemy_swooper',
  turret: 'enemy_turret',
  spinner: 'enemy_spinner',
  carrier: 'enemy_carrier',
  miniboss: 'enemy_miniboss',
};

export class Enemy extends Phaser.GameObjects.Container {
  public health: number;
  public maxHealth: number;
  public type: EnemyType;
  public path: PathData;
  public firePattern: string;
  public points: number;

  private sprite: Phaser.GameObjects.Sprite;
  private fireTimer: number = 0;
  private fireRate: number;
  private moveSpeed: number;
  private elapsed: number = 0;
  private spawnX: number;
  private spawnY: number;
  private isFlashing: boolean = false;
  private flashTimer: number = 0;
  private hoverReached: boolean = false;
  private bezierProgress: number = 0;
  private minibossPatternIndex: number = 0;
  private minibossPatternTimer: number = 0;
  private readonly MINIBOSS_PATTERN_SWITCH = 4000;
  private readonly MINIBOSS_PATTERNS = ['radial16', 'aimed_burst', 'spread5', 'spiral'];

  constructor(scene: Phaser.Scene, config: EnemySpawnData) {
    super(scene, config.x, config.y);

    const defaults = ENEMY_DEFAULTS[config.type];

    this.type = config.type;
    this.maxHealth = config.health ?? defaults.health;
    this.health = this.maxHealth;
    this.points = defaults.points;
    this.firePattern = config.firePattern ?? defaults.firePattern;
    this.fireRate = defaults.fireRate;
    this.moveSpeed = defaults.speed;
    this.spawnX = config.x;
    this.spawnY = config.y;

    this.path = config.path ?? { type: 'linear', speed: defaults.speed };
    if (this.path.speed != null) {
      this.moveSpeed = this.path.speed;
    }

    // Create sprite
    const spriteKey = SPRITE_KEYS[config.type];
    this.sprite = scene.add.sprite(0, 0, spriteKey);
    this.add(this.sprite);

    // Scale miniboss/carrier larger
    if (config.type === 'miniboss') {
      this.sprite.setScale(2);
    } else if (config.type === 'carrier') {
      this.sprite.setScale(1.5);
    }

    scene.add.existing(this);
    this.setActive(true);
    this.setVisible(true);
  }

  update(time: number, delta: number): void {
    if (!this.active) return;

    const dt = delta / 1000;
    this.elapsed += delta;

    // Update path movement
    this.updatePath(dt);

    // Update fire timer
    this.fireTimer += delta;
    this.updateFiring(time);

    // Update flash effect
    if (this.isFlashing) {
      this.flashTimer -= delta;
      if (this.flashTimer <= 0) {
        this.isFlashing = false;
        this.sprite.clearTint();
      }
    }

    // Miniboss pattern cycling
    if (this.type === 'miniboss') {
      this.minibossPatternTimer += delta;
      if (this.minibossPatternTimer >= this.MINIBOSS_PATTERN_SWITCH) {
        this.minibossPatternTimer = 0;
        this.minibossPatternIndex =
          (this.minibossPatternIndex + 1) % this.MINIBOSS_PATTERNS.length;
        this.firePattern = this.MINIBOSS_PATTERNS[this.minibossPatternIndex];
      }
    }

    // Off-screen check (left side)
    if (this.x < -50) {
      this.deactivate();
    }
  }

  private updatePath(dt: number): void {
    switch (this.path.type) {
      case 'linear':
        this.updateLinearPath(dt);
        break;
      case 'sine':
        this.updateSinePath(dt);
        break;
      case 'circle':
        this.updateCirclePath(dt);
        break;
      case 'hover':
        this.updateHoverPath(dt);
        break;
      case 'bezier':
        this.updateBezierPath(dt);
        break;
    }
  }

  private updateLinearPath(dt: number): void {
    this.x -= this.moveSpeed * dt;
  }

  private updateSinePath(dt: number): void {
    this.x -= this.moveSpeed * dt;
    const amplitude = this.path.amplitude ?? 80;
    const frequency = this.path.frequency ?? 2;
    this.y = this.spawnY + Math.sin((this.elapsed / 1000) * frequency * Math.PI) * amplitude;
  }

  private updateCirclePath(dt: number): void {
    const amplitude = this.path.amplitude ?? 60;
    const frequency = this.path.frequency ?? 1.5;
    const angle = (this.elapsed / 1000) * frequency * Math.PI * 2;
    // Slow drift left while orbiting
    this.x = this.spawnX - (this.elapsed / 1000) * (this.moveSpeed * 0.3) + Math.cos(angle) * amplitude;
    this.y = this.spawnY + Math.sin(angle) * amplitude;
  }

  private updateHoverPath(dt: number): void {
    const targetX = this.path.hoverX ?? PLAY_WIDTH * 0.7;
    const targetY = this.path.hoverY ?? this.spawnY;

    if (!this.hoverReached) {
      const dx = targetX - this.x;
      const dy = targetY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 2) {
        this.hoverReached = true;
        this.x = targetX;
        this.y = targetY;
      } else {
        const move = this.moveSpeed * dt;
        this.x += (dx / dist) * move;
        this.y += (dy / dist) * move;
      }
    } else {
      // Slight bobbing while hovering
      this.y = targetY + Math.sin((this.elapsed / 1000) * 1.5) * 8;
    }
  }

  private updateBezierPath(dt: number): void {
    const points = this.path.points;
    if (!points || points.length < 2) {
      // Fallback to linear
      this.x -= this.moveSpeed * dt;
      return;
    }

    this.bezierProgress += (this.moveSpeed / 400) * dt;
    if (this.bezierProgress > 1) this.bezierProgress = 1;

    const t = this.bezierProgress;
    if (points.length === 2) {
      // Linear interpolation
      this.x = points[0].x + (points[1].x - points[0].x) * t;
      this.y = points[0].y + (points[1].y - points[0].y) * t;
    } else if (points.length === 3) {
      // Quadratic bezier
      const mt = 1 - t;
      this.x = mt * mt * points[0].x + 2 * mt * t * points[1].x + t * t * points[2].x;
      this.y = mt * mt * points[0].y + 2 * mt * t * points[1].y + t * t * points[2].y;
    } else {
      // Cubic bezier (use first 4 points)
      const mt = 1 - t;
      this.x =
        mt * mt * mt * points[0].x +
        3 * mt * mt * t * points[1].x +
        3 * mt * t * t * points[2].x +
        t * t * t * points[3].x;
      this.y =
        mt * mt * mt * points[0].y +
        3 * mt * mt * t * points[1].y +
        3 * mt * t * t * points[2].y +
        t * t * t * points[3].y;
    }

    if (this.bezierProgress >= 1) {
      this.deactivate();
    }
  }

  private updateFiring(time: number): void {
    if (this.fireTimer < this.fireRate) return;

    // Swooper fires at sine wave apex
    if (this.type === 'swooper') {
      const frequency = this.path.frequency ?? 2;
      const phase = ((this.elapsed / 1000) * frequency * Math.PI) % (Math.PI * 2);
      // Fire near peaks (top and bottom of sine wave)
      const nearApex = Math.abs(Math.sin(phase)) > 0.95;
      if (!nearApex) return;
    }

    this.fireTimer = 0;
    this.scene.events.emit('enemy-fire', {
      pattern: this.firePattern,
      x: this.x,
      y: this.y,
      params: this.getFireParams(),
    });
  }

  private getFireParams(): Record<string, number | string> {
    switch (this.type) {
      case 'grunt':
        return { count: 1, speed: 180 };
      case 'swooper':
        return { count: 2, speed: 200, spread: 15 };
      case 'turret':
        return { count: 3, speed: 160, spread: 30 };
      case 'spinner':
        return { count: 8, speed: 140 };
      case 'carrier':
        return { count: 12, speed: 120, spread: 360 };
      case 'miniboss':
        return { count: 16, speed: 160, spread: 360 };
      default:
        return { count: 1, speed: 160 };
    }
  }

  takeDamage(amount: number): boolean {
    if (!this.active) return false;

    this.health -= amount;

    // Flash white on hit
    this.isFlashing = true;
    this.flashTimer = 100;
    this.sprite.setTint(0xffffff);

    audioManager.playHit();

    if (this.health <= 0) {
      this.die();
      return true;
    }

    return false;
  }

  private die(): void {
    audioManager.playExplosion();

    // Emit death event with info for scoring and pickups
    this.scene.events.emit('enemy-killed', {
      x: this.x,
      y: this.y,
      type: this.type,
      points: this.points,
    });

    // Determine pickup drops
    this.emitDrops();

    // Play explosion visual
    this.playExplosionEffect();

    this.deactivate();
  }

  private emitDrops(): void {
    // Grunts: small chance of point drop
    if (this.type === 'grunt') {
      if (Math.random() < 0.3) {
        this.scene.events.emit('spawn-pickup', { x: this.x, y: this.y, type: 'point' });
      }
    }
    // Swoopers and spinners: moderate chance
    else if (this.type === 'swooper' || this.type === 'spinner') {
      if (Math.random() < 0.4) {
        this.scene.events.emit('spawn-pickup', { x: this.x, y: this.y, type: 'point' });
      }
      if (Math.random() < 0.15) {
        this.scene.events.emit('spawn-pickup', { x: this.x, y: this.y, type: 'power' });
      }
    }
    // Turrets: decent power drops
    else if (this.type === 'turret') {
      this.scene.events.emit('spawn-pickup', { x: this.x, y: this.y, type: 'point' });
      if (Math.random() < 0.3) {
        this.scene.events.emit('spawn-pickup', { x: this.x, y: this.y, type: 'power' });
      }
    }
    // Carriers: guaranteed power and points
    else if (this.type === 'carrier') {
      for (let i = 0; i < 3; i++) {
        this.scene.events.emit('spawn-pickup', {
          x: this.x + (Math.random() - 0.5) * 30,
          y: this.y + (Math.random() - 0.5) * 30,
          type: 'power',
        });
      }
      for (let i = 0; i < 2; i++) {
        this.scene.events.emit('spawn-pickup', {
          x: this.x + (Math.random() - 0.5) * 30,
          y: this.y + (Math.random() - 0.5) * 30,
          type: 'point',
        });
      }
    }
    // Miniboss: lots of drops
    else if (this.type === 'miniboss') {
      for (let i = 0; i < 6; i++) {
        this.scene.events.emit('spawn-pickup', {
          x: this.x + (Math.random() - 0.5) * 50,
          y: this.y + (Math.random() - 0.5) * 50,
          type: 'power',
        });
      }
      for (let i = 0; i < 4; i++) {
        this.scene.events.emit('spawn-pickup', {
          x: this.x + (Math.random() - 0.5) * 50,
          y: this.y + (Math.random() - 0.5) * 50,
          type: 'point',
        });
      }
    }
  }

  private playExplosionEffect(): void {
    // Create a simple circle explosion effect
    const circle = this.scene.add.circle(this.x, this.y, 8, COLORS.accent, 1);
    this.scene.tweens.add({
      targets: circle,
      scaleX: 4,
      scaleY: 4,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => circle.destroy(),
    });

    // Secondary ring
    const ring = this.scene.add.circle(this.x, this.y, 12, COLORS.danger, 0.6);
    this.scene.tweens.add({
      targets: ring,
      scaleX: 3,
      scaleY: 3,
      alpha: 0,
      duration: 400,
      ease: 'Power2',
      onComplete: () => ring.destroy(),
    });
  }

  private deactivate(): void {
    this.setActive(false);
    this.setVisible(false);
  }

  reset(config: EnemySpawnData): void {
    const defaults = ENEMY_DEFAULTS[config.type];

    this.type = config.type;
    this.maxHealth = config.health ?? defaults.health;
    this.health = this.maxHealth;
    this.points = defaults.points;
    this.firePattern = config.firePattern ?? defaults.firePattern;
    this.fireRate = defaults.fireRate;
    this.moveSpeed = defaults.speed;
    this.x = config.x;
    this.y = config.y;
    this.spawnX = config.x;
    this.spawnY = config.y;
    this.elapsed = 0;
    this.fireTimer = 0;
    this.hoverReached = false;
    this.bezierProgress = 0;
    this.isFlashing = false;
    this.flashTimer = 0;
    this.minibossPatternIndex = 0;
    this.minibossPatternTimer = 0;

    this.path = config.path ?? { type: 'linear', speed: defaults.speed };
    if (this.path.speed != null) {
      this.moveSpeed = this.path.speed;
    }

    // Update sprite
    const spriteKey = SPRITE_KEYS[config.type];
    this.sprite.setTexture(spriteKey);
    this.sprite.clearTint();
    this.sprite.setScale(config.type === 'miniboss' ? 2 : config.type === 'carrier' ? 1.5 : 1);

    this.setActive(true);
    this.setVisible(true);
  }
}
