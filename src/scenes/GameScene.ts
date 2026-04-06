import Phaser from 'phaser';
import {
  PLAY_WIDTH,
  PLAY_HEIGHT,
  GAME_WIDTH,
  GAME_HEIGHT,
  BG_SCROLL_SPEED,
  BOMB_DAMAGE,
  PLAYER_HITBOX_RADIUS,
  PLAYER_GRAZE_RADIUS,
  PLAYER_MAX_POWER,
  POINT_ITEM_BASE,
  POWER_ITEM_VALUE,
  COLORS,
} from '../constants';
import { StageData, WaveData, PickupType } from '../types';
import { Player } from '../entities/Player';
import { Boss } from '../entities/Boss';
import { BulletManager } from '../systems/BulletManager';
import { EnemyManager } from '../systems/EnemyManager';
import { audioManager } from '../systems/AudioGenerator';

// ---------------------------------------------------------------------------
// Pickup helper (lightweight sprite-based pickup)
// ---------------------------------------------------------------------------
interface Pickup {
  sprite: Phaser.GameObjects.Sprite;
  type: PickupType;
  active: boolean;
  vy: number;
}

const PICKUP_COLORS: Record<PickupType, number> = {
  power: COLORS.power_bar,
  point: COLORS.accent,
  life: COLORS.player_hp,
  bomb: COLORS.primary,
};

const PICKUP_TEXTURES: Record<PickupType, string> = {
  power: 'pickup_power',
  point: 'pickup_point',
  life: 'pickup_life',
  bomb: 'pickup_bomb',
};

const AUTO_COLLECT_DIST = 60;
const PICKUP_DRIFT_SPEED = 40;

// ---------------------------------------------------------------------------
// GameScene
// ---------------------------------------------------------------------------

export class GameScene extends Phaser.Scene {
  // Core systems
  private player!: Player;
  private bulletManager!: BulletManager;
  public playerBullets!: Phaser.GameObjects.Group;
  private enemyManager!: EnemyManager;
  private boss: Boss | null = null;

  // Stage data
  private stageData!: StageData;
  private stageElapsed = 0;
  private waveIndex = 0;
  private bossActive = false;
  private bossTriggered = false;
  private stageClear = false;

  // Background
  private bgTiles: Phaser.GameObjects.TileSprite | null = null;

  // Pickups
  private pickups: Pickup[] = [];

  // Pause key
  private escKey!: Phaser.Input.Keyboard.Key;

  // Paused flag (set when PauseScene is overlaid)
  private paused = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  // -----------------------------------------------------------------------
  // Create
  // -----------------------------------------------------------------------

  create(): void {
    // Reset state
    this.stageElapsed = 0;
    this.waveIndex = 0;
    this.bossActive = false;
    this.bossTriggered = false;
    this.stageClear = false;
    this.boss = null;
    this.paused = false;
    this.pickups = [];

    // Get current stage from registry
    this.stageData = this.registry.get('currentStage') as StageData;

    // Scrolling background
    const bgKey = this.stageData?.bgKey ?? 'bg';
    if (this.textures.exists(bgKey)) {
      this.bgTiles = this.add.tileSprite(0, 0, PLAY_WIDTH, PLAY_HEIGHT, bgKey)
        .setOrigin(0, 0)
        .setDepth(-10);
    } else {
      // Fallback solid background
      this.add.rectangle(PLAY_WIDTH / 2, PLAY_HEIGHT / 2, PLAY_WIDTH, PLAY_HEIGHT,
        this.stageData?.bgColor ?? COLORS.bg_dark).setDepth(-10);
      this.bgTiles = null;
    }

    // Clip play area border (visual separator from HUD)
    const border = this.add.graphics();
    border.lineStyle(2, COLORS.hud_border, 0.8);
    border.lineBetween(PLAY_WIDTH, 0, PLAY_WIDTH, GAME_HEIGHT);
    border.setDepth(50);

    // Create player
    this.player = new Player(this, 80, PLAY_HEIGHT / 2);
    this.player.setDepth(20);

    // Create bullet manager (for enemy bullets)
    this.bulletManager = new BulletManager(this);

    // Create player bullet group (Phaser arcade physics group)
    this.playerBullets = this.physics.add.group({
      classType: Phaser.GameObjects.Sprite,
      maxSize: 100,
      runChildUpdate: false,
    });

    // Create enemy manager
    this.enemyManager = new EnemyManager(this);

    // Launch HUD scene in parallel
    if (this.scene.isActive('HUDScene')) {
      this.scene.stop('HUDScene');
    }
    this.scene.launch('HUDScene');

    // ESC for pause
    this.escKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // ---- Event listeners ----
    this.events.on('enemy-fire', this.onEnemyFire, this);
    this.events.on('boss-attack', this.onBossAttack, this);
    this.events.on('enemy-killed', this.onEnemyKilled, this);
    this.events.on('spawn-pickup', this.onSpawnPickup, this);
    this.events.on('player-death', this.onPlayerDeath, this);
    this.events.on('bomb-activated', this.onBombActivated, this);
    this.events.on('graze', this.onGraze, this);
    this.events.on('boss-defeated', this.onBossDefeated, this);
    this.events.on('boss-phase-change', this.onBossPhaseChange, this);
    this.events.on('clear-bullets', this.onClearBullets, this);

    // Resume callback (when PauseScene resumes us)
    this.events.on('resume', () => {
      this.paused = false;
    });

    // Cleanup
    this.events.on('shutdown', this.cleanup, this);

    // Fade in
    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  // -----------------------------------------------------------------------
  // Update
  // -----------------------------------------------------------------------

  update(time: number, delta: number): void {
    if (this.paused || this.stageClear) return;

    // Pause check
    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      this.paused = true;
      this.scene.launch('PauseScene');
      this.scene.pause();
      return;
    }

    // Update player
    this.player.update(time, delta);

    // Update bullet manager (enemy bullets)
    this.bulletManager.update(time, delta);

    // Update enemy manager
    this.enemyManager.update(time, delta);

    // Update boss
    if (this.boss && !this.boss.isDefeated()) {
      this.boss.update(time, delta);
    }

    // Update player bullets (manual movement for those without physics bodies)
    this.updatePlayerBullets(delta);

    // Run collision detection
    this.checkCollisions();

    // Update pickups
    this.updatePickups(delta);

    // Scroll background
    if (this.bgTiles) {
      this.bgTiles.tilePositionX += BG_SCROLL_SPEED * (delta / 1000);
    }

    // Wave spawning
    this.updateWaves(delta);

    // Emit player state to HUD
    this.emitHUDUpdate();
  }

  // -----------------------------------------------------------------------
  // Player bullets
  // -----------------------------------------------------------------------

  private updatePlayerBullets(delta: number): void {
    const dt = delta / 1000;
    const children = this.playerBullets.getChildren() as Phaser.GameObjects.Sprite[];

    for (const bullet of children) {
      if (!bullet.active) continue;

      // Move bullets that have manual velocity (no physics body)
      const body = bullet.body as Phaser.Physics.Arcade.Body | null;
      if (!body) {
        const vx = (bullet as any).vx ?? 0;
        const vy = (bullet as any).vy ?? 0;
        bullet.x += vx * dt;
        bullet.y += vy * dt;
      }

      // Cull off-screen
      if (bullet.x > PLAY_WIDTH + 20 || bullet.x < -20 ||
          bullet.y > PLAY_HEIGHT + 20 || bullet.y < -20) {
        bullet.setActive(false);
        bullet.setVisible(false);
      }
    }
  }

  // -----------------------------------------------------------------------
  // Collision detection
  // -----------------------------------------------------------------------

  private checkCollisions(): void {
    this.checkPlayerBulletsVsEnemies();
    this.checkPlayerBulletsVsBoss();
    this.checkEnemyBulletsVsPlayer();
    this.checkPlayerVsPickups();
  }

  private checkPlayerBulletsVsEnemies(): void {
    const bullets = this.playerBullets.getChildren() as Phaser.GameObjects.Sprite[];
    const enemies = this.enemyManager.getActiveEnemies();

    for (const bullet of bullets) {
      if (!bullet.active) continue;

      for (const enemy of enemies) {
        if (!enemy.active) continue;

        const dx = bullet.x - enemy.x;
        const dy = bullet.y - enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const hitDist = 18; // enemy collision radius

        if (dist < hitDist) {
          // Damage scales with power level
          const dmg = this.getPlayerBulletDamage();
          enemy.takeDamage(dmg);

          // Deactivate bullet
          bullet.setActive(false);
          bullet.setVisible(false);

          // Small hit spark
          this.spawnHitEffect(bullet.x, bullet.y);
          break;
        }
      }
    }
  }

  private checkPlayerBulletsVsBoss(): void {
    if (!this.boss || !this.boss.isActive()) return;

    const bullets = this.playerBullets.getChildren() as Phaser.GameObjects.Sprite[];

    for (const bullet of bullets) {
      if (!bullet.active) continue;

      const dx = bullet.x - this.boss.x;
      const dy = bullet.y - this.boss.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const hitDist = 30; // boss collision radius

      if (dist < hitDist) {
        const dmg = this.getPlayerBulletDamage();
        this.boss.takeDamage(dmg);

        bullet.setActive(false);
        bullet.setVisible(false);
        this.spawnHitEffect(bullet.x, bullet.y);
      }
    }
  }

  private checkEnemyBulletsVsPlayer(): void {
    if (this.player.isDead() || this.player.isInvulnerable()) return;

    const enemyBullets = this.bulletManager.getActiveBullets('enemy');

    for (const b of enemyBullets) {
      // Check graze first (larger radius), pass pool index so each bullet only triggers once
      this.player.checkGraze(b.x, b.y, b.size, b.poolIndex);

      // Check hit (tiny hitbox)
      if (this.player.checkHit(b.x, b.y, b.size)) {
        this.player.die();

        // Check for game over
        if (this.player.getLives() < 0) {
          this.time.delayedCall(1000, () => {
            this.scene.stop('HUDScene');
            this.scene.start('GameOverScene', {
              score: this.player.getScore(),
              stage: this.stageData,
            });
          });
        }
        break;
      }
    }
  }

  /** Player bullet damage scales with power: base 5, up to 10 at max power */
  private getPlayerBulletDamage(): number {
    const power = this.player.getPower();
    return 5 + Math.floor(power / 25);
  }

  private checkPlayerVsPickups(): void {
    if (this.player.isDead()) return;

    for (const pickup of this.pickups) {
      if (!pickup.active) continue;

      const dx = pickup.sprite.x - this.player.hitboxX;
      const dy = pickup.sprite.y - this.player.hitboxY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < AUTO_COLLECT_DIST) {
        this.collectPickup(pickup);
      }
    }
  }

  // -----------------------------------------------------------------------
  // Pickup system
  // -----------------------------------------------------------------------

  private collectPickup(pickup: Pickup): void {
    pickup.active = false;
    pickup.sprite.setVisible(false);

    audioManager.playPickup();

    switch (pickup.type) {
      case 'power':
        this.player.addPower(POWER_ITEM_VALUE);
        break;
      case 'point':
        this.player.addScore(POINT_ITEM_BASE);
        break;
      case 'life':
        this.player.addLife();
        break;
      case 'bomb':
        this.player.addBomb();
        break;
    }
  }

  private updatePickups(delta: number): void {
    const dt = delta / 1000;

    for (const pickup of this.pickups) {
      if (!pickup.active) continue;

      // Drift downward slowly
      pickup.sprite.y += pickup.vy * dt;
      // Slight leftward drift
      pickup.sprite.x -= 15 * dt;

      // Cull off-screen
      if (pickup.sprite.y > PLAY_HEIGHT + 20 || pickup.sprite.x < -20) {
        pickup.active = false;
        pickup.sprite.setVisible(false);
      }
    }
  }

  private spawnPickup(x: number, y: number, type: PickupType): void {
    // Reuse inactive pickup
    let pickup = this.pickups.find(p => !p.active);

    if (pickup) {
      pickup.type = type;
      pickup.active = true;
      pickup.vy = PICKUP_DRIFT_SPEED;

      const texKey = PICKUP_TEXTURES[type];
      if (this.textures.exists(texKey)) {
        pickup.sprite.setTexture(texKey);
      } else {
        pickup.sprite.setTint(PICKUP_COLORS[type]);
      }
      pickup.sprite.setPosition(x, y);
      pickup.sprite.setVisible(true);
    } else {
      // Create new pickup sprite
      const texKey = PICKUP_TEXTURES[type];
      const hasTexture = this.textures.exists(texKey);
      const sprite = this.add.sprite(x, y, hasTexture ? texKey : 'bullet_round');
      sprite.setDepth(15);
      if (!hasTexture) {
        sprite.setTint(PICKUP_COLORS[type]);
      }
      sprite.setScale(0.8);

      pickup = {
        sprite,
        type,
        active: true,
        vy: PICKUP_DRIFT_SPEED,
      };
      this.pickups.push(pickup);
    }

    // Small bounce animation on spawn
    this.tweens.add({
      targets: pickup.sprite,
      y: y - 15,
      duration: 200,
      yoyo: true,
      ease: 'Sine.easeOut',
    });
  }

  // -----------------------------------------------------------------------
  // Wave system
  // -----------------------------------------------------------------------

  private updateWaves(delta: number): void {
    if (!this.stageData || this.bossActive || this.bossTriggered) return;

    this.stageElapsed += delta;
    const waves = this.stageData.waves;

    while (this.waveIndex < waves.length) {
      const wave = waves[this.waveIndex];

      if (this.stageElapsed >= wave.time) {
        this.spawnWave(wave);
        this.waveIndex++;
      } else {
        break;
      }
    }

    // All waves spawned - check if it's boss time
    if (this.waveIndex >= waves.length && !this.bossTriggered) {
      // Check if a boss wave exists
      const bossWave = waves.find(w => w.isBoss);
      if (bossWave && this.stageData.boss) {
        this.triggerBoss();
      } else if (this.enemyManager.getActiveEnemies().length === 0 && !this.boss) {
        // No boss defined and all enemies cleared
        this.onStageClear();
      }
    }
  }

  private spawnWave(wave: WaveData): void {
    if (wave.isBoss) {
      this.triggerBoss();
      return;
    }

    for (const enemyConfig of wave.enemies) {
      if (enemyConfig.delay) {
        this.time.delayedCall(enemyConfig.delay, () => {
          this.enemyManager.spawnEnemy(enemyConfig);
        });
      } else {
        this.enemyManager.spawnEnemy(enemyConfig);
      }
    }
  }

  private triggerBoss(): void {
    if (this.bossTriggered || !this.stageData.boss) return;

    this.bossTriggered = true;
    this.bossActive = true;

    // Clear remaining enemies and bullets for clean dialogue
    this.enemyManager.clear();
    this.bulletManager.clear();

    // Launch dialogue scene before boss fight
    const bossId = this.stageData.boss.id;
    this.registry.set('dialogueBossId', bossId);

    // Listen for dialogue completion
    this.events.once('dialogue-complete', () => {
      this.paused = false;
      // Now create the boss after dialogue
      if (this.stageData.boss) {
        this.boss = new Boss(this, this.stageData.boss);
        this.boss.setDepth(25);
      }
    });

    // Pause gameplay and launch dialogue overlay
    this.paused = true;
    this.scene.launch('DialogueScene', { bossId });
  }

  // -----------------------------------------------------------------------
  // Visual effects
  // -----------------------------------------------------------------------

  private spawnHitEffect(x: number, y: number): void {
    const spark = this.add.circle(x, y, 4, COLORS.accent, 0.8);
    spark.setBlendMode(Phaser.BlendModes.ADD);
    spark.setDepth(30);
    this.tweens.add({
      targets: spark,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 150,
      onComplete: () => spark.destroy(),
    });
  }

  // -----------------------------------------------------------------------
  // Event handlers
  // -----------------------------------------------------------------------

  private onEnemyFire(data: { pattern: string; x: number; y: number; params: Record<string, any> }): void {
    // Map enemy fire pattern names to BulletManager pattern names
    const patternMap: Record<string, string> = {
      aimed_single: 'aimed',
      aimed_burst: 'spread',
      spread3: 'spread',
      spread5: 'spread',
      radial8: 'radial',
      radial16: 'radial',
      dense_spread: 'spread',
      spiral: 'spiral',
    };

    const resolvedPattern = patternMap[data.pattern] ?? data.pattern;

    // Augment params with player position for aimed shots
    const params: Record<string, any> = { ...data.params };
    if (resolvedPattern === 'aimed' || data.pattern === 'aimed_single' || data.pattern === 'aimed_burst') {
      params.targetX = this.player.hitboxX;
      params.targetY = this.player.hitboxY;
    }

    // Set defaults if not present
    if (data.pattern === 'aimed_single') {
      params.count = params.count ?? 1;
      params.speed = params.speed ?? 180;
    } else if (data.pattern === 'spread3') {
      params.count = params.count ?? 3;
      params.spread = params.spread ?? 30;
      params.angle = Math.atan2(this.player.hitboxY - data.y, this.player.hitboxX - data.x);
    } else if (data.pattern === 'spread5') {
      params.count = params.count ?? 5;
      params.spread = params.spread ?? 45;
      params.angle = Math.atan2(this.player.hitboxY - data.y, this.player.hitboxX - data.x);
    } else if (data.pattern === 'radial8') {
      params.count = params.count ?? 8;
    } else if (data.pattern === 'radial16') {
      params.count = params.count ?? 16;
    } else if (data.pattern === 'dense_spread') {
      params.count = params.count ?? 12;
      params.spread = params.spread ?? 360;
    }

    this.bulletManager.spawnPattern(resolvedPattern, data.x, data.y, params);
  }

  private onBossAttack(data: { pattern: string; x: number; y: number; params: Record<string, any> }): void {
    const p = data.params;
    const x = data.x;
    const y = data.y;
    const px = this.player.hitboxX;
    const py = this.player.hitboxY;
    const aimAngle = Math.atan2(py - y, px - x);

    // Map boss pattern types to BulletManager patterns
    switch (data.pattern) {
      case 'radial_burst':
        this.bulletManager.spawnPattern('radial', x, y, {
          count: p.bulletCount ?? 12,
          speed: p.bulletSpeed ?? 140,
          bulletSprite: p.bulletSprite,
          size: p.bulletSize ?? 5,
          offset: p.angleOffset ?? 0,
        });
        break;

      case 'aimed_single':
        this.bulletManager.spawnPattern('aimed', x, y, {
          targetX: px, targetY: py,
          speed: p.bulletSpeed ?? 200,
          bulletSprite: p.bulletSprite,
          size: p.bulletSize ?? 5,
        });
        break;

      case 'aimed_burst':
        this.bulletManager.spawnPattern('spread', x, y, {
          count: p.bulletCount ?? 3,
          spread: p.spreadAngle ?? 20,
          speed: p.bulletSpeed ?? 180,
          angle: aimAngle,
          bulletSprite: p.bulletSprite,
          size: p.bulletSize ?? 5,
        });
        break;

      case 'fan_sweep':
      case 'rotating_fan':
        this.bulletManager.spawnPattern('spread', x, y, {
          count: p.bulletCount ?? 7,
          spread: p.spreadAngle ?? 60,
          speed: p.bulletSpeed ?? 160,
          angle: aimAngle + (p.sweepDirection === 'right' ? 0.3 : -0.3),
          bulletSprite: p.bulletSprite,
          size: p.bulletSize ?? 5,
        });
        break;

      case 'line_wall':
      case 'geometric_wall':
        // Fire a dense spread to simulate a wall
        this.bulletManager.spawnPattern('spread', x, y, {
          count: p.bulletCount ?? 15,
          spread: p.spreadAngle ?? 180,
          speed: p.bulletSpeed ?? 120,
          angle: Math.PI, // leftward
          bulletSprite: p.bulletSprite,
          size: p.bulletSize ?? 5,
        });
        break;

      case 'radial_aimed_combo':
        // Radial burst + aimed
        this.bulletManager.spawnPattern('radial', x, y, {
          count: p.bulletCount ?? 10,
          speed: p.bulletSpeed ?? 130,
          bulletSprite: p.bulletSprite,
          size: p.bulletSize ?? 5,
        });
        this.bulletManager.spawnPattern('aimed', x, y, {
          targetX: px, targetY: py,
          speed: (p.bulletSpeed ?? 130) * 1.3,
          bulletSprite: p.bulletSprite,
          size: p.bulletSize ?? 5,
        });
        break;

      case 'spiral':
        this.bulletManager.spawnPattern('spiral', x, y, {
          count: p.bulletCount ?? 8,
          speed: p.bulletSpeed ?? 120,
          rotationSpeed: p.rotationSpeed ?? 2,
          bulletSprite: p.bulletSprite,
          size: p.bulletSize ?? 5,
        });
        break;

      case 'aimed_predict':
        // Predictive aim - offset slightly toward player movement direction
        this.bulletManager.spawnPattern('spread', x, y, {
          count: p.bulletCount ?? 3,
          spread: p.spreadAngle ?? 15,
          speed: p.bulletSpeed ?? 220,
          angle: aimAngle,
          bulletSprite: p.bulletSprite,
          size: p.bulletSize ?? 5,
        });
        break;

      case 'flame_trail':
        // Slow lingering bullets in a ring pattern
        this.bulletManager.spawnPattern('ring', x, y, {
          count: p.bulletCount ?? 8,
          speed: p.bulletSpeed ?? 40,
          bulletSprite: p.bulletSprite ?? 'bullet_flame_linger',
          size: p.bulletSize ?? 8,
        });
        break;

      case 'radial_safe_lane':
        // Radial with gaps
        this.bulletManager.spawnPattern('radial', x, y, {
          count: p.bulletCount ?? 20,
          speed: p.bulletSpeed ?? 130,
          bulletSprite: p.bulletSprite,
          size: p.bulletSize ?? 5,
          offset: Math.random() * 30,
        });
        break;

      case 'orbital':
        // Curving bullets (use angular velocity)
        this.bulletManager.spawnPattern('radial', x, y, {
          count: p.bulletCount ?? 6,
          speed: p.bulletSpeed ?? 100,
          bulletSprite: p.bulletSprite,
          size: p.bulletSize ?? 5,
        });
        break;

      case 'gravity_point':
      case 'gravity_point_moving':
        // Spawn radial from a secondary position
        this.bulletManager.spawnPattern('radial', x, y, {
          count: p.bulletCount ?? 10,
          speed: p.bulletSpeed ?? 90,
          bulletSprite: p.bulletSprite,
          size: p.bulletSize ?? 5,
        });
        break;

      case 'radial_multi_source':
        // Fire radials from offset positions
        this.bulletManager.spawnPattern('radial', x, y - 30, {
          count: (p.bulletCount ?? 8),
          speed: p.bulletSpeed ?? 110,
          bulletSprite: p.bulletSprite,
          size: p.bulletSize ?? 5,
        });
        this.bulletManager.spawnPattern('radial', x, y + 30, {
          count: (p.bulletCount ?? 8),
          speed: p.bulletSpeed ?? 110,
          bulletSprite: p.bulletSprite,
          size: p.bulletSize ?? 5,
        });
        break;

      case 'speed_layer':
        // Multiple speeds creating layers
        this.bulletManager.spawnPattern('radial', x, y, {
          count: p.bulletCount ?? 8,
          speed: p.bulletSpeed ?? 80,
          bulletSprite: p.bulletSprite,
          size: p.bulletSize ?? 5,
        });
        this.bulletManager.spawnPattern('radial', x, y, {
          count: p.bulletCount ?? 8,
          speed: (p.bulletSpeed ?? 80) * 1.8,
          bulletSprite: p.bulletSprite,
          size: p.bulletSize ?? 4,
          offset: 15,
        });
        break;

      default:
        // Fallback: try direct pattern match
        this.bulletManager.spawnPattern(data.pattern, x, y, {
          count: p.bulletCount ?? 8,
          speed: p.bulletSpeed ?? 120,
          bulletSprite: p.bulletSprite,
          size: p.bulletSize ?? 5,
          targetX: px,
          targetY: py,
          angle: aimAngle,
        });
        break;
    }
  }

  private onEnemyKilled(data: { x: number; y: number; type: string; points: number }): void {
    this.player.addScore(data.points);
  }

  private onSpawnPickup(data: { x: number; y: number; type: PickupType }): void {
    this.spawnPickup(data.x, data.y, data.type);
  }

  private onPlayerDeath(data: { x: number; y: number; powerLost: number }): void {
    // Scatter some power pickups from lost power
    const dropCount = Math.min(8, Math.floor(data.powerLost / 2));
    for (let i = 0; i < dropCount; i++) {
      const ox = (Math.random() - 0.5) * 60;
      const oy = (Math.random() - 0.5) * 60;
      this.spawnPickup(data.x + ox, data.y + oy, 'power');
    }
  }

  private onBombActivated(_data: any): void {
    this.bulletManager.clear();
    this.player.clearGrazeTracking();
    this.enemyManager.damageAll(BOMB_DAMAGE);

    // Also damage boss
    if (this.boss && this.boss.isActive()) {
      this.boss.takeDamage(BOMB_DAMAGE);
    }
  }

  private onGraze(_data: { x: number; y: number }): void {
    // Graze is tracked silently - no per-bullet sound/visual to avoid spam
  }

  private onBossDefeated(_data: { bossId: string }): void {
    this.bossActive = false;
    this.boss = null;
    this.bulletManager.clear();

    // Brief delay then stage clear
    this.time.delayedCall(1500, () => {
      this.onStageClear();
    });
  }

  private onBossPhaseChange(data: { bossId: string; phase: number; phaseName: string }): void {
    // Emit to HUD
    this.events.emit('hud-boss-phase', data);
  }

  private onClearBullets(): void {
    this.bulletManager.clear();
    this.player.clearGrazeTracking();
  }

  // -----------------------------------------------------------------------
  // Stage clear
  // -----------------------------------------------------------------------

  private onStageClear(): void {
    if (this.stageClear) return;
    this.stageClear = true;

    // Collect all pickups on screen
    for (const pickup of this.pickups) {
      if (pickup.active) {
        this.collectPickup(pickup);
      }
    }

    this.time.delayedCall(1500, () => {
      const state = this.player.getState();
      this.scene.stop('HUDScene');
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('StageClearScene', {
          score: state.score,
          graze: state.graze,
          stage: this.stageData,
          stageIndex: this.registry.get('stageIndex') ?? 0,
          playerState: state,
        });
      });
    });
  }

  // -----------------------------------------------------------------------
  // HUD communication
  // -----------------------------------------------------------------------

  private emitHUDUpdate(): void {
    const state = this.player.getState();
    this.events.emit('hud-update', {
      score: state.score,
      lives: state.lives,
      bombs: state.bombs,
      power: state.power,
      graze: state.graze,
      bossActive: this.bossActive,
      bossHealth: this.boss ? this.boss.health : 0,
      bossMaxHealth: this.boss ? this.boss.maxHealth : 0,
      bossName: this.boss ? this.boss.bossName : '',
      stageName: this.stageData?.name ?? '',
    });
  }

  // -----------------------------------------------------------------------
  // Cleanup
  // -----------------------------------------------------------------------

  private cleanup(): void {
    this.events.off('enemy-fire', this.onEnemyFire, this);
    this.events.off('boss-attack', this.onBossAttack, this);
    this.events.off('enemy-killed', this.onEnemyKilled, this);
    this.events.off('spawn-pickup', this.onSpawnPickup, this);
    this.events.off('player-death', this.onPlayerDeath, this);
    this.events.off('bomb-activated', this.onBombActivated, this);
    this.events.off('graze', this.onGraze, this);
    this.events.off('boss-defeated', this.onBossDefeated, this);
    this.events.off('boss-phase-change', this.onBossPhaseChange, this);
    this.events.off('clear-bullets', this.onClearBullets, this);

    this.input.keyboard!.removeKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // Clean up pickups
    for (const pickup of this.pickups) {
      pickup.sprite.destroy();
    }
    this.pickups = [];

    // Clean up systems
    this.bulletManager.clear();
    this.enemyManager.clear();
  }
}
