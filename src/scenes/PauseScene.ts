import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../constants';
import { audioManager } from '../systems/AudioGenerator';

interface PauseMenuItem {
  label: string;
  action: () => void;
}

export class PauseScene extends Phaser.Scene {
  private menuItems: PauseMenuItem[] = [];
  private selectedIndex = 0;
  private texts: Phaser.GameObjects.Text[] = [];
  private selector!: Phaser.GameObjects.Text;

  private upKey!: Phaser.Input.Keyboard.Key;
  private downKey!: Phaser.Input.Keyboard.Key;
  private enterKey!: Phaser.Input.Keyboard.Key;
  private escKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'PauseScene' });
  }

  create(): void {
    this.selectedIndex = 0;

    // Semi-transparent dark overlay
    const overlay = this.add.rectangle(
      GAME_WIDTH / 2, GAME_HEIGHT / 2,
      GAME_WIDTH, GAME_HEIGHT,
      0x000000, 0.7,
    );

    // "PAUSED" title
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80, 'PAUSED', {
      fontFamily: 'monospace',
      fontSize: '36px',
      color: '#00ccff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Menu items
    this.menuItems = [
      {
        label: 'Resume',
        action: () => this.resumeGame(),
      },
      {
        label: 'Restart Stage',
        action: () => {
          this.scene.stop('HUDScene');
          this.scene.stop('GameScene');
          this.scene.start('GameScene');
          this.scene.stop();
        },
      },
      {
        label: 'Options',
        action: () => {
          // Pause stays, open options
          this.scene.start('OptionsScene', { returnScene: 'PauseScene' });
        },
      },
      {
        label: 'Quit to Title',
        action: () => {
          this.scene.stop('HUDScene');
          this.scene.stop('GameScene');
          this.scene.start('TitleScene');
          this.scene.stop();
        },
      },
    ];

    // Render menu
    const startY = GAME_HEIGHT / 2 - 15;
    const spacing = 35;
    this.texts = [];

    for (let i = 0; i < this.menuItems.length; i++) {
      const t = this.add.text(GAME_WIDTH / 2, startY + i * spacing, this.menuItems[i].label, {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#ffffff',
      }).setOrigin(0.5);
      this.texts.push(t);
    }

    // Selector
    this.selector = this.add.text(0, 0, '>', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#00ccff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.updateSelection();

    // Input
    this.upKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.downKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.escKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // Cleanup
    this.events.on('shutdown', () => {
      this.input.keyboard!.removeKey(Phaser.Input.Keyboard.KeyCodes.UP);
      this.input.keyboard!.removeKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
      this.input.keyboard!.removeKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
      this.input.keyboard!.removeKey(Phaser.Input.Keyboard.KeyCodes.ESC);
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

    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      this.resumeGame();
    }
  }

  private resumeGame(): void {
    this.scene.resume('GameScene');
    this.scene.stop();
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
