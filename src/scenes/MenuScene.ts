import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../constants';
import { audioManager } from '../systems/AudioGenerator';
import { stages } from '../data/stages';

interface MenuItem {
  label: string;
  action: () => void;
}

export class MenuScene extends Phaser.Scene {
  private menuItems: MenuItem[] = [];
  private selectedIndex = 0;
  private texts: Phaser.GameObjects.Text[] = [];
  private selector!: Phaser.GameObjects.Text;
  private upKey!: Phaser.Input.Keyboard.Key;
  private downKey!: Phaser.Input.Keyboard.Key;
  private enterKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLORS.bg_dark);
    this.cameras.main.fadeIn(300, 0, 0, 0);
    this.selectedIndex = 0;

    // Title
    this.add.text(GAME_WIDTH / 2, 80, 'VOID BLOSSOM', {
      fontFamily: 'monospace',
      fontSize: '36px',
      color: '#00ccff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Decorative line
    const line = this.add.graphics();
    line.lineStyle(1, COLORS.hud_border, 0.6);
    line.lineBetween(GAME_WIDTH / 2 - 150, 110, GAME_WIDTH / 2 + 150, 110);

    // Build menu items
    this.menuItems = [
      {
        label: 'Start Game',
        action: () => {
          this.registry.set('currentStage', stages[0]);
          this.registry.set('stageIndex', 0);
          this.cameras.main.fadeOut(300, 0, 0, 0);
          this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('StageIntroScene');
          });
        },
      },
      {
        label: 'Options',
        action: () => {
          this.cameras.main.fadeOut(300, 0, 0, 0);
          this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('OptionsScene', { returnScene: 'MenuScene' });
          });
        },
      },
      {
        label: 'Credits',
        action: () => {
          // Simple credits display - could be expanded to its own scene
          audioManager.playUIConfirm();
        },
      },
    ];

    // Render menu items
    const startY = 180;
    const spacing = 45;
    this.texts = [];
    for (let i = 0; i < this.menuItems.length; i++) {
      const t = this.add.text(GAME_WIDTH / 2, startY + i * spacing, this.menuItems[i].label, {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#ffffff',
      }).setOrigin(0.5);
      this.texts.push(t);
    }

    // Selection indicator
    this.selector = this.add.text(0, 0, '>', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#00ccff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.updateSelection();

    // Input
    this.upKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.downKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // Controls hint
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 40, 'Arrow Keys: Navigate | Enter: Select', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#555577',
    }).setOrigin(0.5);

    // Cleanup
    this.events.on('shutdown', () => {
      this.input.keyboard!.removeKey(Phaser.Input.Keyboard.KeyCodes.UP);
      this.input.keyboard!.removeKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
      this.input.keyboard!.removeKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    });
  }

  update(): void {
    if (Phaser.Input.Keyboard.JustDown(this.upKey)) {
      this.selectedIndex = (this.selectedIndex - 1 + this.menuItems.length) % this.menuItems.length;
      this.updateSelection();
      audioManager.playUIMove();
    }

    if (Phaser.Input.Keyboard.JustDown(this.downKey)) {
      this.selectedIndex = (this.selectedIndex + 1) % this.menuItems.length;
      this.updateSelection();
      audioManager.playUIMove();
    }

    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      audioManager.playUIConfirm();
      this.menuItems[this.selectedIndex].action();
    }
  }

  private updateSelection(): void {
    for (let i = 0; i < this.texts.length; i++) {
      if (i === this.selectedIndex) {
        this.texts[i].setColor('#00ccff');
        this.texts[i].setFontStyle('bold');
      } else {
        this.texts[i].setColor('#ffffff');
        this.texts[i].setFontStyle('');
      }
    }

    const selected = this.texts[this.selectedIndex];
    this.selector.setPosition(selected.x - selected.width / 2 - 20, selected.y);
  }
}
