import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../constants';
import { audioManager } from '../systems/AudioGenerator';

interface OptionEntry {
  label: string;
  getValue: () => number;
  setValue: (v: number) => void;
}

export class OptionsScene extends Phaser.Scene {
  private options: OptionEntry[] = [];
  private selectedIndex = 0;
  private texts: Phaser.GameObjects.Text[] = [];
  private valueBars: Phaser.GameObjects.Graphics[] = [];
  private valueTexts: Phaser.GameObjects.Text[] = [];
  private selector!: Phaser.GameObjects.Text;
  private returnScene = 'TitleScene';

  private upKey!: Phaser.Input.Keyboard.Key;
  private downKey!: Phaser.Input.Keyboard.Key;
  private leftKey!: Phaser.Input.Keyboard.Key;
  private rightKey!: Phaser.Input.Keyboard.Key;
  private enterKey!: Phaser.Input.Keyboard.Key;
  private escKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'OptionsScene' });
  }

  init(data: { returnScene?: string }): void {
    this.returnScene = data.returnScene ?? 'TitleScene';
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLORS.bg_dark);
    this.selectedIndex = 0;

    // Solid background rectangle so options is readable when launched as overlay
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.bg_dark, 1);

    // Title
    this.add.text(GAME_WIDTH / 2, 60, 'OPTIONS', {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#00ccff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Options definitions
    this.options = [
      {
        label: 'Master Volume',
        getValue: () => Math.round(audioManager.masterVolume * 100),
        setValue: (v: number) => { audioManager.masterVolume = v / 100; },
      },
      {
        label: 'SFX Volume',
        getValue: () => Math.round(audioManager.sfxVolume * 100),
        setValue: (v: number) => { audioManager.sfxVolume = v / 100; },
      },
      {
        label: 'Music Volume',
        getValue: () => Math.round(audioManager.musicVolume * 100),
        setValue: (v: number) => { audioManager.musicVolume = v / 100; },
      },
    ];

    // Render options
    const startY = 140;
    const spacing = 60;
    this.texts = [];
    this.valueBars = [];
    this.valueTexts = [];

    for (let i = 0; i < this.options.length; i++) {
      const y = startY + i * spacing;

      // Label
      const label = this.add.text(GAME_WIDTH / 2 - 180, y, this.options[i].label, {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ffffff',
      }).setOrigin(0, 0.5);
      this.texts.push(label);

      // Bar background + fill
      const bar = this.add.graphics();
      this.valueBars.push(bar);

      // Value text
      const vt = this.add.text(GAME_WIDTH / 2 + 190, y, '', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#ffcc00',
      }).setOrigin(0.5);
      this.valueTexts.push(vt);
    }

    // Back option
    const backY = startY + this.options.length * spacing + 20;
    const backText = this.add.text(GAME_WIDTH / 2, backY, '[ Back ]', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#ffffff',
    }).setOrigin(0.5);
    this.texts.push(backText);

    // Selector
    this.selector = this.add.text(0, 0, '>', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#00ccff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.drawValues();
    this.updateSelection();

    // Input
    this.upKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.downKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.leftKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.rightKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.escKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // Hint
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 40, 'Up/Down: Navigate | Left/Right: Adjust | ESC: Back', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#555577',
    }).setOrigin(0.5);

    // Cleanup
    this.events.on('shutdown', () => {
      this.input.keyboard!.removeKey(Phaser.Input.Keyboard.KeyCodes.UP);
      this.input.keyboard!.removeKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
      this.input.keyboard!.removeKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
      this.input.keyboard!.removeKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
      this.input.keyboard!.removeKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
      this.input.keyboard!.removeKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    });
  }

  update(): void {
    if (Phaser.Input.Keyboard.JustDown(this.upKey)) {
      this.selectedIndex = (this.selectedIndex - 1 + this.texts.length) % this.texts.length;
      this.updateSelection();
      audioManager.playUIMove();
    }

    if (Phaser.Input.Keyboard.JustDown(this.downKey)) {
      this.selectedIndex = (this.selectedIndex + 1) % this.texts.length;
      this.updateSelection();
      audioManager.playUIMove();
    }

    // Adjust value for slider options
    if (this.selectedIndex < this.options.length) {
      const option = this.options[this.selectedIndex];
      const step = 5;

      if (Phaser.Input.Keyboard.JustDown(this.leftKey)) {
        const current = option.getValue();
        option.setValue(Math.max(0, current - step));
        this.drawValues();
        audioManager.playUIMove();
      }

      if (Phaser.Input.Keyboard.JustDown(this.rightKey)) {
        const current = option.getValue();
        option.setValue(Math.min(100, current + step));
        this.drawValues();
        audioManager.playUIMove();
      }
    }

    // Back via Enter on back button or ESC
    if (Phaser.Input.Keyboard.JustDown(this.escKey) ||
        (Phaser.Input.Keyboard.JustDown(this.enterKey) && this.selectedIndex === this.options.length)) {
      audioManager.playUIConfirm();
      this.goBack();
    }
  }

  private goBack(): void {
    // If we were launched as overlay from PauseScene, just stop ourselves and resume it
    if (this.returnScene === 'PauseScene' && this.scene.isActive('PauseScene') || this.scene.isPaused('PauseScene')) {
      this.scene.resume('PauseScene');
      this.scene.stop();
      return;
    }

    // Otherwise, standard scene transition (from main menu)
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(this.returnScene);
    });
  }

  private drawValues(): void {
    const startY = 140;
    const spacing = 60;
    const barX = GAME_WIDTH / 2 + 20;
    const barW = 140;
    const barH = 10;

    for (let i = 0; i < this.options.length; i++) {
      const y = startY + i * spacing;
      const val = this.options[i].getValue();
      const ratio = val / 100;

      const bar = this.valueBars[i];
      bar.clear();

      // Background
      bar.fillStyle(0x222244, 1);
      bar.fillRect(barX, y - barH / 2, barW, barH);

      // Fill
      bar.fillStyle(COLORS.primary, 1);
      bar.fillRect(barX, y - barH / 2, barW * ratio, barH);

      // Border
      bar.lineStyle(1, COLORS.hud_border, 0.8);
      bar.strokeRect(barX, y - barH / 2, barW, barH);

      this.valueTexts[i].setText(`${val}`);
    }
  }

  private updateSelection(): void {
    for (let i = 0; i < this.texts.length; i++) {
      if (i === this.selectedIndex) {
        this.texts[i].setColor('#00ccff');
      } else {
        this.texts[i].setColor('#ffffff');
      }
    }

    const selected = this.texts[this.selectedIndex];
    if (this.selectedIndex < this.options.length) {
      this.selector.setPosition(selected.x - 20, selected.y);
    } else {
      this.selector.setPosition(selected.x - selected.width / 2 - 20, selected.y);
    }
  }
}
