import Phaser from 'phaser';
import {
  PLAYER_SPEED,
  PLAYER_FOCUS_SPEED,
  PLAYER_HITBOX_RADIUS,
  PLAYER_GRAZE_RADIUS,
  PLAYER_SHOT_COOLDOWN,
  PLAYER_INVULN_TIME,
  PLAYER_START_LIVES,
  PLAYER_START_BOMBS,
  PLAYER_MAX_POWER,
  BOMB_DURATION,
  BOMB_DAMAGE,
  GRAZE_SCORE,
  PLAY_WIDTH,
  PLAY_HEIGHT,
  COLORS,
} from '../constants';
import { PlayerState } from '../types';
import { audioManager } from '../systems/AudioGenerator';

export class Player extends Phaser.GameObjects.Container {
  // Visual components
  private shipSprite!: Phaser.GameObjects.Sprite;
  private focusIndicator!: Phaser.GameObjects.Sprite;
  private thrusterGlow!: Phaser.GameObjects.Sprite;

  // Input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;
  private keyZ!: Phaser.Input.Keyboard.Key;
  private keyX!: Phaser.Input.Keyboard.Key;
  private keyShift!: Phaser.Input.Keyboard.Key;

  // Shooting state
  private lastShotTime = 0;
  private autoFire = false;

  // Player state
  private power = 0;
  private lives = PLAYER_START_LIVES;
  private bombs = PLAYER_START_BOMBS;
  private playerScore = 0;
  private grazeCount = 0;
  private continues = 0;

  // Invulnerability
  private invulnerable = false;
  private invulnTimer = 0;
  private blinkTimer = 0;

  // Bomb state
  private bombing = false;
  private bombTimer = 0;
  private bombCooldown = false;

  // Focus mode
  private focused = false;

  // Hitbox position (exposed for collision checks)
  public hitboxX = 0;
  public hitboxY = 0;

  // Track which bullets have already been grazed (by pool index) to avoid per-frame spam
  private grazedBullets = new Set<number>();

  // Death flag to prevent multiple death triggers per frame
  private dead = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.setupVisuals();
    this.setupInput();

    this.hitboxX = x;
    this.hitboxY = y;

    scene.add.existing(this);
  }

  // ── Visual Setup ──────────────────────────────────────────────────

  private setupVisuals(): void {
    // Thruster / engine glow behind the ship
    this.thrusterGlow = this.scene.add.sprite(-16, 0, 'player_thruster');
    this.thrusterGlow.setAlpha(0.8);
    this.thrusterGlow.setBlendMode(Phaser.BlendModes.ADD);
    this.thrusterGlow.setScale(0.8);
    // If thruster animation exists, play it; otherwise pulse via update
    if (this.thrusterGlow.anims && this.scene.anims.exists('thruster_anim')) {
      this.thrusterGlow.play('thruster_anim');
    }
    this.add(this.thrusterGlow);

    // Main ship sprite
    this.shipSprite = this.scene.add.sprite(0, 0, 'player');
    this.add(this.shipSprite);

    // Focus mode hitbox indicator (tiny bright dot)
    this.focusIndicator = this.scene.add.sprite(0, 0, 'player_focus');
    this.focusIndicator.setAlpha(0.9);
    this.focusIndicator.setBlendMode(Phaser.BlendModes.ADD);
    this.focusIndicator.setVisible(false);
    this.add(this.focusIndicator);

    this.setSize(32, 32);
  }

  // ── Input Setup ───────────────────────────────────────────────────

  private setupInput(): void {
    const keyboard = this.scene.input.keyboard!;

    this.cursors = keyboard.createCursorKeys();

    this.wasd = {
      up: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    this.keyZ = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.keyX = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.keyShift = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
  }

  // ── Update Loop ───────────────────────────────────────────────────

  update(time: number, delta: number): void {
    if (this.dead) return;

    this.handleMovement(delta);
    this.handleShooting(time);
    this.handleBomb(time, delta);
    this.updateInvulnerability(delta);
    this.updateVisuals(time, delta);

    // Update hitbox center for external collision checks
    this.hitboxX = this.x;
    this.hitboxY = this.y;
  }

  // ── Movement ──────────────────────────────────────────────────────

  private handleMovement(delta: number): void {
    this.focused = this.keyShift.isDown;
    const speed = this.focused ? PLAYER_FOCUS_SPEED : PLAYER_SPEED;
    const dt = delta / 1000;

    let dx = 0;
    let dy = 0;

    // Combine cursor keys and WASD
    if (this.cursors.left.isDown || this.wasd.left.isDown) dx -= 1;
    if (this.cursors.right.isDown || this.wasd.right.isDown) dx += 1;
    if (this.cursors.up.isDown || this.wasd.up.isDown) dy -= 1;
    if (this.cursors.down.isDown || this.wasd.down.isDown) dy += 1;

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      const inv = 1 / Math.SQRT2;
      dx *= inv;
      dy *= inv;
    }

    // Apply movement directly for responsive feel
    this.x += dx * speed * dt;
    this.y += dy * speed * dt;

    // Clamp within play area bounds (with small margin for the sprite)
    const margin = 8;
    this.x = Phaser.Math.Clamp(this.x, margin, PLAY_WIDTH - margin);
    this.y = Phaser.Math.Clamp(this.y, margin, PLAY_HEIGHT - margin);
  }

  // ── Shooting ──────────────────────────────────────────────────────

  private handleShooting(time: number): void {
    const firing = this.autoFire || this.keyZ.isDown;
    if (!firing) return;
    if (time - this.lastShotTime < PLAYER_SHOT_COOLDOWN) return;

    this.lastShotTime = time;
    this.fireShots();
    audioManager.playShot();
  }

  private fireShots(): void {
    const bulletGroup = (this.scene as any).playerBullets as Phaser.GameObjects.Group | undefined;
    if (!bulletGroup) return;

    if (this.power < 32) {
      // Single forward shot
      this.spawnBullet(bulletGroup, this.x + 16, this.y, 0, 600, 'player_shot');
    } else if (this.power < 80) {
      // Double shot with slight spread
      this.spawnBullet(bulletGroup, this.x + 16, this.y - 6, -3, 600, 'player_shot');
      this.spawnBullet(bulletGroup, this.x + 16, this.y + 6, 3, 600, 'player_shot');
    } else if (this.power < PLAYER_MAX_POWER) {
      // Triple shot with wider spread
      const tex = 'player_shot_power';
      this.spawnBullet(bulletGroup, this.x + 16, this.y, 0, 650, tex);
      this.spawnBullet(bulletGroup, this.x + 14, this.y - 8, -6, 620, tex);
      this.spawnBullet(bulletGroup, this.x + 14, this.y + 8, 6, 620, tex);
    } else {
      // Quad shot at max power
      const tex = 'player_shot_power';
      this.spawnBullet(bulletGroup, this.x + 16, this.y - 4, -2, 660, tex);
      this.spawnBullet(bulletGroup, this.x + 16, this.y + 4, 2, 660, tex);
      this.spawnBullet(bulletGroup, this.x + 12, this.y - 12, -8, 620, tex);
      this.spawnBullet(bulletGroup, this.x + 12, this.y + 12, 8, 620, tex);
    }
  }

  private spawnBullet(
    group: Phaser.GameObjects.Group,
    x: number,
    y: number,
    angleOffset: number,
    speed: number,
    texture: string,
  ): void {
    const bullet = group.get(x, y, texture) as Phaser.GameObjects.Sprite | null;
    if (!bullet) return;

    bullet.setActive(true);
    bullet.setVisible(true);
    bullet.setPosition(x, y);

    // Convert angle offset (degrees) to radians for velocity
    const rad = Phaser.Math.DegToRad(angleOffset);
    const body = bullet.body as Phaser.Physics.Arcade.Body | null;
    if (body) {
      body.setVelocity(Math.cos(rad) * speed, Math.sin(rad) * speed);
    } else {
      // Store velocity data for manual movement if no physics body
      (bullet as any).vx = Math.cos(rad) * speed;
      (bullet as any).vy = Math.sin(rad) * speed;
    }

    // Auto-destroy when off-screen
    bullet.setData('isPlayerBullet', true);
  }

  // ── Bombs ─────────────────────────────────────────────────────────

  private handleBomb(time: number, delta: number): void {
    // Active bomb countdown
    if (this.bombing) {
      this.bombTimer -= delta;
      if (this.bombTimer <= 0) {
        this.bombing = false;
        this.bombCooldown = false;
      }
      return;
    }

    if (this.bombCooldown) return;

    if (this.keyX.isDown && this.bombs > 0) {
      this.activateBomb();
    }
  }

  private activateBomb(): void {
    this.bombs--;
    this.bombing = true;
    this.bombTimer = BOMB_DURATION;
    this.invulnerable = true;
    this.invulnTimer = BOMB_DURATION;
    this.bombCooldown = true;

    audioManager.playBomb();

    // Emit event for scene to handle bullet clearing and enemy damage
    this.scene.events.emit('bomb-activated', {
      x: this.x,
      y: this.y,
      damage: BOMB_DAMAGE,
      duration: BOMB_DURATION,
    });

    // Screen-clearing flash effect
    const flash = this.scene.add.rectangle(
      PLAY_WIDTH / 2,
      PLAY_HEIGHT / 2,
      PLAY_WIDTH,
      PLAY_HEIGHT,
      COLORS.primary,
      0.6,
    );
    flash.setBlendMode(Phaser.BlendModes.ADD);
    flash.setDepth(100);
    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => flash.destroy(),
    });
  }

  // ── Invulnerability ───────────────────────────────────────────────

  private updateInvulnerability(delta: number): void {
    if (!this.invulnerable) return;

    this.invulnTimer -= delta;
    if (this.invulnTimer <= 0) {
      this.invulnerable = false;
      this.shipSprite.setAlpha(1);
      return;
    }

    // Blink the sprite during invulnerability
    this.blinkTimer += delta;
    if (this.blinkTimer >= 60) {
      this.blinkTimer = 0;
      this.shipSprite.setAlpha(this.shipSprite.alpha > 0.5 ? 0.2 : 1);
    }
  }

  // ── Visuals Update ────────────────────────────────────────────────

  private updateVisuals(time: number, _delta: number): void {
    // Focus indicator visibility
    this.focusIndicator.setVisible(this.focused);

    // Thruster glow pulsing effect
    const pulse = 0.6 + 0.3 * Math.sin(time * 0.01);
    this.thrusterGlow.setAlpha(pulse);
    this.thrusterGlow.setScale(0.7 + 0.2 * Math.sin(time * 0.008));

    // Slight ship tilt based on vertical movement
    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      this.shipSprite.setRotation(-0.1);
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      this.shipSprite.setRotation(0.1);
    } else {
      this.shipSprite.setRotation(0);
    }
  }

  // ── Death / Respawn ───────────────────────────────────────────────

  die(): void {
    if (this.dead || this.invulnerable) return;

    this.dead = true;
    this.lives--;

    audioManager.playDeath();

    // Death visual effect: expanding ring
    const ring = this.scene.add.circle(this.x, this.y, 4, COLORS.danger, 0.9);
    ring.setBlendMode(Phaser.BlendModes.ADD);
    ring.setDepth(90);
    this.scene.tweens.add({
      targets: ring,
      scaleX: 8,
      scaleY: 8,
      alpha: 0,
      duration: 500,
      ease: 'Power2',
      onComplete: () => ring.destroy(),
    });

    // Scatter some power pickups
    this.scene.events.emit('player-death', {
      x: this.x,
      y: this.y,
      powerLost: Math.floor(this.power * 0.4),
    });

    // Lose some power on death
    this.power = Math.max(0, Math.floor(this.power * 0.6));

    // Hide briefly then respawn
    this.setVisible(false);
    this.scene.time.delayedCall(500, () => this.respawn());
  }

  private respawn(): void {
    this.dead = false;
    this.setVisible(true);

    // Respawn at left-center of play area
    this.x = 60;
    this.y = PLAY_HEIGHT / 2;

    // Start invulnerability period
    this.invulnerable = true;
    this.invulnTimer = PLAYER_INVULN_TIME;
    this.blinkTimer = 0;

    this.hitboxX = this.x;
    this.hitboxY = this.y;
  }

  // ── Graze Detection ───────────────────────────────────────────────

  checkGraze(bulletX: number, bulletY: number, bulletRadius: number, bulletIndex: number = -1): boolean {
    if (this.invulnerable || this.dead) return false;

    // Each bullet only grazes once
    if (bulletIndex >= 0 && this.grazedBullets.has(bulletIndex)) return false;

    const dx = bulletX - this.hitboxX;
    const dy = bulletY - this.hitboxY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const outerDist = PLAYER_GRAZE_RADIUS + bulletRadius;
    const innerDist = PLAYER_HITBOX_RADIUS + bulletRadius;

    if (dist < outerDist && dist >= innerDist) {
      this.grazeCount++;
      this.playerScore += GRAZE_SCORE;

      if (bulletIndex >= 0) this.grazedBullets.add(bulletIndex);

      this.scene.events.emit('graze', { x: bulletX, y: bulletY });
      return true;
    }

    return false;
  }

  /** Clear graze tracking (call when bullets are cleared, e.g. bombs/stage transitions) */
  clearGrazeTracking(): void {
    this.grazedBullets.clear();
  }

  // Check if a bullet actually hits the player hitbox
  checkHit(bulletX: number, bulletY: number, bulletRadius: number): boolean {
    if (this.invulnerable || this.dead) return false;

    const dx = bulletX - this.hitboxX;
    const dy = bulletY - this.hitboxY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    return dist < PLAYER_HITBOX_RADIUS + bulletRadius;
  }

  // ── State Accessors ───────────────────────────────────────────────

  getState(): PlayerState {
    return {
      lives: this.lives,
      bombs: this.bombs,
      score: this.playerScore,
      power: this.power,
      graze: this.grazeCount,
      continues: this.continues,
    };
  }

  addPower(amount: number): void {
    this.power = Math.min(PLAYER_MAX_POWER, this.power + amount);
  }

  addScore(amount: number): void {
    this.playerScore += amount;
  }

  addLife(): void {
    this.lives++;
  }

  addBomb(): void {
    this.bombs++;
  }

  addContinue(): void {
    this.continues++;
  }

  getPower(): number {
    return this.power;
  }

  getLives(): number {
    return this.lives;
  }

  getBombs(): number {
    return this.bombs;
  }

  getScore(): number {
    return this.playerScore;
  }

  isFocused(): boolean {
    return this.focused;
  }

  isInvulnerable(): boolean {
    return this.invulnerable;
  }

  isBombing(): boolean {
    return this.bombing;
  }

  isDead(): boolean {
    return this.dead;
  }

  setAutoFire(enabled: boolean): void {
    this.autoFire = enabled;
  }

  getHitboxRadius(): number {
    return PLAYER_HITBOX_RADIUS;
  }

  getGrazeRadius(): number {
    return PLAYER_GRAZE_RADIUS;
  }
}
