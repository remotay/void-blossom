import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from './constants';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { TitleScene } from './scenes/TitleScene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { HUDScene } from './scenes/HUDScene';
import { PauseScene } from './scenes/PauseScene';
import { GameOverScene } from './scenes/GameOverScene';
import { StageIntroScene } from './scenes/StageIntroScene';
import { StageClearScene } from './scenes/StageClearScene';
import { VictoryScene } from './scenes/VictoryScene';
import { OptionsScene } from './scenes/OptionsScene';
import { DialogueScene } from './scenes/DialogueScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  backgroundColor: COLORS.bg_dark,
  pixelArt: false,
  roundPixels: true,
  render: {
    preserveDrawingBuffer: true,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scene: [
    BootScene,
    PreloadScene,
    TitleScene,
    MenuScene,
    OptionsScene,
    StageIntroScene,
    GameScene,
    HUDScene,
    PauseScene,
    DialogueScene,
    StageClearScene,
    GameOverScene,
    VictoryScene,
  ],
  audio: {
    disableWebAudio: false,
  },
};

new Phaser.Game(config);
