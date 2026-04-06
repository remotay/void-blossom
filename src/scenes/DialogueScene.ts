import Phaser from 'phaser';
import { PLAY_WIDTH, PLAY_HEIGHT, COLORS } from '../constants';
import { audioManager } from '../systems/AudioGenerator';
import { getDialogue, DialogueLine } from '../data/dialogues';

// Boss theme colors used for speaker name labels
const BOSS_NAME_COLORS: Record<string, number> = {
  boss1: 0x66ccff,  // blue / crystal
  boss2: 0xff4422,  // red / flame
  boss3: 0xaa44ff,  // purple / void
};

// Layout constants
const TEXT_BOX_X = 20;
const TEXT_BOX_Y = 420;
const TEXT_BOX_W = 680;
const TEXT_BOX_H = 110;

const PLAYER_PORTRAIT_X = 40;
const BOSS_PORTRAIT_X = 580;
const PORTRAIT_Y = 380;

const TYPEWRITER_DELAY = 30; // ms per character
const TYPEWRITER_SOUND_INTERVAL = 3; // play sound every N characters

export class DialogueScene extends Phaser.Scene {
  private lines: DialogueLine[] = [];
  private bossId = '';
  private currentIndex = 0;
  private isTyping = false;
  private typewriterTimer?: Phaser.Time.TimerEvent;
  private displayedChars = 0;
  private fullText = '';

  // Game objects
  private overlay!: Phaser.GameObjects.Rectangle;
  private textBoxBg!: Phaser.GameObjects.Graphics;
  private speakerNameText!: Phaser.GameObjects.Text;
  private dialogueText!: Phaser.GameObjects.Text;
  private advanceIndicator!: Phaser.GameObjects.Text;
  private playerPortrait!: Phaser.GameObjects.Image;
  private bossPortrait!: Phaser.GameObjects.Image;

  // Input keys
  private zKey!: Phaser.Input.Keyboard.Key;
  private enterKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'DialogueScene' });
  }

  create(data?: { bossId?: string }): void {
    // Resolve bossId from scene data or registry
    this.bossId = data?.bossId ?? this.registry.get('dialogueBossId') ?? 'boss1';
    const dialogue = getDialogue(this.bossId);

    if (!dialogue || dialogue.prelude.length === 0) {
      this.closeDialogue();
      return;
    }

    this.lines = dialogue.prelude;
    this.currentIndex = 0;
    this.isTyping = false;
    this.displayedChars = 0;
    this.fullText = '';

    // ── Dark overlay ──────────────────────────────────────────────
    this.overlay = this.add.rectangle(
      PLAY_WIDTH / 2, PLAY_HEIGHT / 2,
      PLAY_WIDTH, PLAY_HEIGHT,
      0x000000, 0.45,
    );
    this.overlay.setAlpha(0);

    // ── Text box background ───────────────────────────────────────
    this.textBoxBg = this.add.graphics();
    this.drawTextBox(0);

    // ── Speaker name ──────────────────────────────────────────────
    this.speakerNameText = this.add.text(TEXT_BOX_X + 10, TEXT_BOX_Y - 20, '', {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#00ccff',
      fontStyle: 'bold',
    }).setAlpha(0);

    // ── Dialogue text ─────────────────────────────────────────────
    this.dialogueText = this.add.text(TEXT_BOX_X + 14, TEXT_BOX_Y + 14, '', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ffffff',
      wordWrap: { width: TEXT_BOX_W - 28, useAdvancedWrap: true },
      lineSpacing: 4,
    }).setAlpha(0);

    // ── Advance indicator (pulsing triangle) ──────────────────────
    this.advanceIndicator = this.add.text(
      TEXT_BOX_X + TEXT_BOX_W - 22,
      TEXT_BOX_Y + TEXT_BOX_H - 22,
      '\u25bc', // ▼
      {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#00ccff',
      },
    ).setAlpha(0);

    this.tweens.add({
      targets: this.advanceIndicator,
      y: this.advanceIndicator.y + 4,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // ── Portraits ─────────────────────────────────────────────────
    // Player portrait starts off-screen left, slides in
    this.playerPortrait = this.add.image(
      PLAYER_PORTRAIT_X - 100,
      PORTRAIT_Y,
      'portrait_player',
    ).setAlpha(0.4);

    // Boss portrait starts off-screen right, slides in
    this.bossPortrait = this.add.image(
      BOSS_PORTRAIT_X + 100,
      PORTRAIT_Y,
      `portrait_${this.bossId}`,
    ).setAlpha(0.4).setFlipX(true);

    // ── Input ─────────────────────────────────────────────────────
    this.zKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.events.on('shutdown', () => {
      this.input.keyboard!.removeKey(Phaser.Input.Keyboard.KeyCodes.Z);
      this.input.keyboard!.removeKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
      if (this.typewriterTimer) {
        this.typewriterTimer.destroy();
      }
    });

    // ── Entrance animations ───────────────────────────────────────
    this.animateEntrance();
  }

  // ── Entrance animation sequence ──────────────────────────────────

  private animateEntrance(): void {
    // Fade in overlay
    this.tweens.add({
      targets: this.overlay,
      alpha: 0.45,
      duration: 300,
      ease: 'Power2',
    });

    // Slide in player portrait from the left
    this.tweens.add({
      targets: this.playerPortrait,
      x: PLAYER_PORTRAIT_X,
      duration: 400,
      ease: 'Back.easeOut',
      delay: 100,
    });

    // Slide in boss portrait from the right
    this.tweens.add({
      targets: this.bossPortrait,
      x: BOSS_PORTRAIT_X,
      duration: 400,
      ease: 'Back.easeOut',
      delay: 150,
    });

    // Fade in text box
    this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 300,
      delay: 200,
      onUpdate: (tween) => {
        const v = tween.getValue();
        this.drawTextBox(v);
        this.speakerNameText.setAlpha(v);
        this.dialogueText.setAlpha(v);
      },
      onComplete: () => {
        // Start showing the first line once the intro animation finishes
        this.showLine(0);
      },
    });
  }

  // ── Draw text box background ─────────────────────────────────────

  private drawTextBox(alpha: number): void {
    this.textBoxBg.clear();
    // Dark fill
    this.textBoxBg.fillStyle(0x111122, 0.85 * alpha);
    this.textBoxBg.fillRect(TEXT_BOX_X, TEXT_BOX_Y, TEXT_BOX_W, TEXT_BOX_H);
    // Border
    this.textBoxBg.lineStyle(1, 0x4444AA, alpha);
    this.textBoxBg.strokeRect(TEXT_BOX_X, TEXT_BOX_Y, TEXT_BOX_W, TEXT_BOX_H);
  }

  // ── Show a dialogue line ─────────────────────────────────────────

  private showLine(index: number): void {
    if (index >= this.lines.length) {
      this.closeDialogue();
      return;
    }

    this.currentIndex = index;
    const line = this.lines[index];

    // Update speaker name and color
    const nameColor = line.speaker === 'player'
      ? COLORS.primary
      : (BOSS_NAME_COLORS[this.bossId] ?? 0xffffff);
    this.speakerNameText.setText(line.name);
    this.speakerNameText.setColor(`#${nameColor.toString(16).padStart(6, '0')}`);

    // Highlight active portrait, dim the other
    const isPlayer = line.speaker === 'player';

    this.tweens.add({
      targets: this.playerPortrait,
      alpha: isPlayer ? 1 : 0.4,
      duration: 200,
      ease: 'Power1',
    });

    this.tweens.add({
      targets: this.bossPortrait,
      alpha: isPlayer ? 0.4 : 1,
      duration: 200,
      ease: 'Power1',
    });

    // Slight bounce on the active speaker's portrait
    const activePortrait = isPlayer ? this.playerPortrait : this.bossPortrait;
    this.tweens.add({
      targets: activePortrait,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 120,
      yoyo: true,
      ease: 'Quad.easeOut',
    });

    // Hide advance indicator while typing
    this.advanceIndicator.setAlpha(0);

    // Start typewriter effect
    this.fullText = line.text;
    this.displayedChars = 0;
    this.dialogueText.setText('');
    this.isTyping = true;

    if (this.typewriterTimer) {
      this.typewriterTimer.destroy();
    }

    this.typewriterTimer = this.time.addEvent({
      delay: TYPEWRITER_DELAY,
      callback: () => this.typeNextChar(),
      repeat: this.fullText.length - 1,
    });
  }

  // ── Typewriter character-by-character ─────────────────────────────

  private typeNextChar(): void {
    this.displayedChars++;
    this.dialogueText.setText(this.fullText.substring(0, this.displayedChars));

    // Play a subtle click sound every few characters
    if (this.displayedChars % TYPEWRITER_SOUND_INTERVAL === 0) {
      audioManager.playUIMove();
    }

    // Check if done
    if (this.displayedChars >= this.fullText.length) {
      this.finishTyping();
    }
  }

  // ── Complete typing instantly ─────────────────────────────────────

  private completeTypingInstantly(): void {
    if (this.typewriterTimer) {
      this.typewriterTimer.destroy();
      this.typewriterTimer = undefined;
    }
    this.displayedChars = this.fullText.length;
    this.dialogueText.setText(this.fullText);
    this.finishTyping();
  }

  // ── Called when a line finishes typing ────────────────────────────

  private finishTyping(): void {
    this.isTyping = false;
    // Show advance indicator
    this.tweens.add({
      targets: this.advanceIndicator,
      alpha: 1,
      duration: 200,
    });
  }

  // ── Advance to next line or complete typing ──────────────────────

  private advance(): void {
    if (this.isTyping) {
      this.completeTypingInstantly();
    } else {
      audioManager.playUIConfirm();
      this.showLine(this.currentIndex + 1);
    }
  }

  // ── Close dialogue and return to GameScene ───────────────────────

  private closeDialogue(): void {
    // Fade out everything
    this.tweens.add({
      targets: [
        this.overlay,
        this.playerPortrait,
        this.bossPortrait,
        this.speakerNameText,
        this.dialogueText,
        this.advanceIndicator,
      ],
      alpha: 0,
      duration: 300,
      ease: 'Power2',
    });

    this.tweens.addCounter({
      from: 1,
      to: 0,
      duration: 300,
      onUpdate: (tween) => {
        this.drawTextBox(tween.getValue());
      },
      onComplete: () => {
        // Notify GameScene that dialogue is finished
        const gameScene = this.scene.get('GameScene');
        if (gameScene) {
          gameScene.events.emit('dialogue-complete');
        }
        // Resume GameScene and stop ourselves
        this.scene.resume('GameScene');
        this.scene.stop();
      },
    });
  }

  // ── Update loop (input only) ─────────────────────────────────────

  update(): void {
    if (
      Phaser.Input.Keyboard.JustDown(this.zKey) ||
      Phaser.Input.Keyboard.JustDown(this.enterKey)
    ) {
      this.advance();
    }
  }
}
