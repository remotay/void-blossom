import Phaser from 'phaser';
import { AssetGenerator } from '../systems/AssetGenerator';
import { PixelSprites } from '../systems/PixelSprites';
import { PortraitSprites } from '../systems/PortraitSprites';
import { audioManager } from '../systems/AudioGenerator';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create(): void {
    // Generate all procedural textures (bullets, effects, UI, backgrounds)
    AssetGenerator.generateAll(this);

    // Override character sprites with detailed pixel art versions
    PixelSprites.overrideCharacterTextures(this);

    // Generate dialogue portrait textures
    PortraitSprites.renderAll(this);

    // Add spritesheet frames to explosion textures (they are horizontal strips)
    this.addFrames('explosion_small', 32, 32, 4);
    this.addFrames('explosion_large', 64, 64, 4);

    // Create animations
    if (this.textures.exists('explosion_small')) {
      this.anims.create({
        key: 'explosion_small_anim',
        frames: this.anims.generateFrameNumbers('explosion_small', {
          start: 0,
          end: 3,
        }),
        frameRate: 12,
        repeat: 0,
      });
    }

    if (this.textures.exists('explosion_large')) {
      this.anims.create({
        key: 'explosion_large_anim',
        frames: this.anims.generateFrameNumbers('explosion_large', {
          start: 0,
          end: 3,
        }),
        frameRate: 10,
        repeat: 0,
      });
    }

    // Initialize audio manager
    audioManager.init();

    // Proceed to preload scene
    this.scene.start('PreloadScene');
  }

  private addFrames(key: string, frameWidth: number, frameHeight: number, count: number): void {
    if (!this.textures.exists(key)) return;
    const texture = this.textures.get(key);
    for (let i = 0; i < count; i++) {
      texture.add(i, 0, i * frameWidth, 0, frameWidth, frameHeight);
    }
  }
}
