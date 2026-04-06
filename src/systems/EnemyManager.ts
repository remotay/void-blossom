import Phaser from 'phaser';
import { Enemy } from '../entities/Enemy';
import { EnemySpawnData } from '../types';
import { MAX_ENEMIES } from '../constants';

export class EnemyManager {
  private scene: Phaser.Scene;
  private enemies: Enemy[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  spawnEnemy(config: EnemySpawnData): Enemy {
    // Try to reuse an inactive enemy
    let enemy = this.enemies.find((e) => !e.active);

    if (enemy) {
      enemy.reset(config);
    } else if (this.enemies.length < MAX_ENEMIES) {
      enemy = new Enemy(this.scene, config);
      this.enemies.push(enemy);
    } else {
      // Pool is full, reuse the oldest inactive or skip
      // Force-recycle the first enemy in the list
      enemy = this.enemies[0];
      enemy.reset(config);
    }

    return enemy;
  }

  update(time: number, delta: number): void {
    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      if (enemy.active) {
        enemy.update(time, delta);
      }
    }
  }

  getActiveEnemies(): Enemy[] {
    return this.enemies.filter((e) => e.active);
  }

  clear(): void {
    for (const enemy of this.enemies) {
      enemy.setActive(false);
      enemy.setVisible(false);
      enemy.destroy();
    }
    this.enemies = [];
  }

  damageAll(amount: number): void {
    for (const enemy of this.enemies) {
      if (enemy.active) {
        enemy.takeDamage(amount);
      }
    }
  }

  getEnemyAt(x: number, y: number, radius: number): Enemy | null {
    for (const enemy of this.enemies) {
      if (!enemy.active) continue;

      const dx = enemy.x - x;
      const dy = enemy.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= radius) {
        return enemy;
      }
    }
    return null;
  }
}
