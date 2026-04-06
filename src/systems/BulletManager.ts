import {
  PLAY_WIDTH,
  PLAY_HEIGHT,
  BULLET_OFFSCREEN_MARGIN,
  COLORS,
} from '../constants';
import { BulletConfig } from '../types';

/** Internal pooled bullet representation. */
export interface BulletData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  angle: number;
  accel: number;
  angularVel: number;
  sprite: string;
  size: number;
  damage: number;
  active: boolean;
  age: number;
  color: number;
  type: 'enemy' | 'player';
  gameObject: Phaser.GameObjects.Image | null;
}

const DEG_TO_RAD = Math.PI / 180;

/** High-performance object-pool bullet manager for Void Blossom. */
export class BulletManager {
  private scene: Phaser.Scene;
  private pool: BulletData[];
  private maxBullets: number;
  private activeCount: number = 0;

  constructor(scene: Phaser.Scene, maxBullets: number = 2000) {
    this.scene = scene;
    this.maxBullets = maxBullets;
    this.pool = new Array<BulletData>(maxBullets);

    // Pre-allocate the entire pool so we never allocate during gameplay.
    for (let i = 0; i < maxBullets; i++) {
      const img = scene.add.image(-100, -100, '__DEFAULT');
      img.setVisible(false);
      img.setDepth(10); // Above backgrounds, below UI
      img.setActive(false);

      this.pool[i] = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        speed: 0,
        angle: 0,
        accel: 0,
        angularVel: 0,
        sprite: '',
        size: 4,
        damage: 1,
        active: false,
        age: 0,
        color: 0xffffff,
        type: 'enemy',
        gameObject: img,
      };
    }
  }

  // ---------------------------------------------------------------------------
  // Spawning
  // ---------------------------------------------------------------------------

  /** Activate a single bullet from the pool. Returns the pool index or -1 if the pool is full. */
  spawn(config: BulletConfig & { x: number; y: number; type: 'enemy' | 'player' }): number {
    const idx = this.findInactive();
    if (idx === -1) return -1;

    const b = this.pool[idx];
    b.x = config.x;
    b.y = config.y;
    b.speed = config.speed;
    b.angle = config.angle;
    b.vx = Math.cos(config.angle) * config.speed;
    b.vy = Math.sin(config.angle) * config.speed;
    b.accel = config.accel ?? 0;
    b.angularVel = config.angularVel ?? 0;
    b.sprite = config.sprite;
    b.size = config.size ?? 4;
    b.damage = config.damage ?? 1;
    b.color = config.color ?? 0xffffff;
    b.type = config.type;
    b.age = 0;
    b.active = true;

    const go = b.gameObject!;
    go.setTexture(config.sprite);
    go.setPosition(b.x, b.y);
    go.setTint(b.color);
    go.setVisible(true);
    go.setActive(true);

    this.activeCount++;
    return idx;
  }

  /**
   * Spawn a named pattern of bullets.
   *
   * Supported patterns:
   *  - radial, aimed, spread, stream, spiral, ring, random
   */
  spawnPattern(
    pattern: string,
    x: number,
    y: number,
    params: Record<string, any>,
  ): void {
    switch (pattern) {
      case 'radial':
        this.patternRadial(x, y, params);
        break;
      case 'aimed':
        this.patternAimed(x, y, params);
        break;
      case 'spread':
        this.patternSpread(x, y, params);
        break;
      case 'stream':
        this.patternStream(x, y, params);
        break;
      case 'spiral':
        this.patternSpiral(x, y, params);
        break;
      case 'ring':
        this.patternRing(x, y, params);
        break;
      case 'random':
        this.patternRandom(x, y, params);
        break;
      default:
        console.warn(`BulletManager: unknown pattern "${pattern}"`);
    }
  }

  // ---------------------------------------------------------------------------
  // Update loop
  // ---------------------------------------------------------------------------

  /** Advance every active bullet. Call once per frame. */
  update(_time: number, delta: number): void {
    const dt = delta / 1000; // seconds
    const margin = BULLET_OFFSCREEN_MARGIN;
    const minX = -margin;
    const minY = -margin;
    const maxX = PLAY_WIDTH + margin;
    const maxY = PLAY_HEIGHT + margin;

    for (let i = 0; i < this.maxBullets; i++) {
      const b = this.pool[i];
      if (!b.active) continue;

      b.age += delta;

      // Apply angular velocity (curving bullets).
      if (b.angularVel !== 0) {
        b.angle += b.angularVel * dt;
        b.vx = Math.cos(b.angle) * b.speed;
        b.vy = Math.sin(b.angle) * b.speed;
      }

      // Apply acceleration.
      if (b.accel !== 0) {
        b.speed += b.accel * dt;
        b.vx = Math.cos(b.angle) * b.speed;
        b.vy = Math.sin(b.angle) * b.speed;
      }

      // Move.
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      // Cull off-screen.
      if (b.x < minX || b.x > maxX || b.y < minY || b.y > maxY) {
        this.deactivate(i);
        continue;
      }

      // Sync game object.
      const go = b.gameObject!;
      go.setPosition(b.x, b.y);
    }
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  /** Return all active BulletData entries, optionally filtered by type. */
  getActiveBullets(type?: 'enemy' | 'player'): BulletData[] {
    const result: BulletData[] = [];
    for (let i = 0; i < this.maxBullets; i++) {
      const b = this.pool[i];
      if (b.active && (type === undefined || b.type === type)) {
        result.push(b);
      }
    }
    return result;
  }

  /** Number of bullets currently active in the pool. */
  getActiveCount(): number {
    return this.activeCount;
  }

  // ---------------------------------------------------------------------------
  // Pool management
  // ---------------------------------------------------------------------------

  /** Return a bullet to the pool. */
  deactivate(index: number): void {
    const b = this.pool[index];
    if (!b.active) return;

    b.active = false;
    const go = b.gameObject!;
    go.setVisible(false);
    go.setActive(false);
    go.setPosition(-100, -100);
    this.activeCount--;
  }

  /** Deactivate every bullet (bomb effect, stage transition, etc.). */
  clear(): void {
    for (let i = 0; i < this.maxBullets; i++) {
      if (this.pool[i].active) {
        this.deactivate(i);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Internals
  // ---------------------------------------------------------------------------

  /** Find the first inactive slot. Returns -1 when the pool is full. */
  private findInactive(): number {
    for (let i = 0; i < this.maxBullets; i++) {
      if (!this.pool[i].active) return i;
    }
    return -1;
  }

  /** Helper: spawn a single enemy bullet with minimal boilerplate. */
  private spawnOne(
    x: number,
    y: number,
    angle: number,
    speed: number,
    sprite: string,
    size: number = 4,
    color: number = COLORS.danger,
    damage: number = 1,
    accel: number = 0,
    angularVel: number = 0,
  ): number {
    return this.spawn({
      x,
      y,
      angle,
      speed,
      sprite,
      size,
      color,
      damage,
      accel,
      angularVel,
      type: 'enemy',
    });
  }

  // ---------------------------------------------------------------------------
  // Pattern implementations
  // ---------------------------------------------------------------------------

  /** N bullets evenly distributed in a full circle. */
  private patternRadial(x: number, y: number, p: Record<string, any>): void {
    const count: number = p.count ?? 12;
    const speed: number = p.speed ?? 120;
    const sprite: string = p.bulletSprite ?? 'bullet_small';
    const size: number = p.size ?? 4;
    const offset: number = p.offset ?? 0;
    const step = (Math.PI * 2) / count;

    for (let i = 0; i < count; i++) {
      this.spawnOne(x, y, offset + step * i, speed, sprite, size);
    }
  }

  /** Single bullet aimed at a world-space target position. */
  private patternAimed(x: number, y: number, p: Record<string, any>): void {
    const tx: number = p.targetX ?? 0;
    const ty: number = p.targetY ?? 0;
    const speed: number = p.speed ?? 180;
    const sprite: string = p.bulletSprite ?? 'bullet_small';
    const angle = Math.atan2(ty - y, tx - x);
    this.spawnOne(x, y, angle, speed, sprite);
  }

  /** Fan of bullets centered on a given angle. */
  private patternSpread(x: number, y: number, p: Record<string, any>): void {
    const count: number = p.count ?? 5;
    const spreadDeg: number = p.spread ?? 45;
    const speed: number = p.speed ?? 160;
    const centerAngle: number = p.angle ?? 0;
    const sprite: string = p.bulletSprite ?? 'bullet_small';
    const totalRad = spreadDeg * DEG_TO_RAD;
    const step = count > 1 ? totalRad / (count - 1) : 0;
    const start = centerAngle - totalRad / 2;

    for (let i = 0; i < count; i++) {
      this.spawnOne(x, y, start + step * i, speed, sprite);
    }
  }

  /** Single bullet in a given direction (call each frame for a stream). */
  private patternStream(x: number, y: number, p: Record<string, any>): void {
    const angle: number = p.angle ?? 0;
    const speed: number = p.speed ?? 200;
    const sprite: string = p.bulletSprite ?? 'bullet_small';
    this.spawnOne(x, y, angle, speed, sprite);
  }

  /** Rotating spiral (spawn a burst whose base angle rotates over time). */
  private patternSpiral(x: number, y: number, p: Record<string, any>): void {
    const count: number = p.count ?? 8;
    const speed: number = p.speed ?? 140;
    const rotSpeed: number = p.rotationSpeed ?? 2; // rad/s passed as current offset
    const sprite: string = p.bulletSprite ?? 'bullet_small';
    const step = (Math.PI * 2) / count;

    for (let i = 0; i < count; i++) {
      this.spawnOne(x, y, rotSpeed + step * i, speed, sprite);
    }
  }

  /** Expanding ring (identical to radial but semantically a one-shot ring). */
  private patternRing(x: number, y: number, p: Record<string, any>): void {
    const count: number = p.count ?? 24;
    const speed: number = p.speed ?? 100;
    const sprite: string = p.bulletSprite ?? 'bullet_small';
    const step = (Math.PI * 2) / count;

    for (let i = 0; i < count; i++) {
      this.spawnOne(x, y, step * i, speed, sprite);
    }
  }

  /** Random scatter burst. */
  private patternRandom(x: number, y: number, p: Record<string, any>): void {
    const count: number = p.count ?? 10;
    const sMin: number = p.speedMin ?? 60;
    const sMax: number = p.speedMax ?? 200;
    const sprite: string = p.bulletSprite ?? 'bullet_small';

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = sMin + Math.random() * (sMax - sMin);
      this.spawnOne(x, y, angle, speed, sprite);
    }
  }
}
