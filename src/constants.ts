// Game dimensions - horizontal shooter with 16:9 aspect
export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;

// Play area (left portion of screen, right side is HUD)
export const PLAY_WIDTH = 720;
export const PLAY_HEIGHT = 540;
export const HUD_X = 720;
export const HUD_WIDTH = 240;

// Player
export const PLAYER_SPEED = 280;
export const PLAYER_FOCUS_SPEED = 120;
export const PLAYER_HITBOX_RADIUS = 3;
export const PLAYER_GRAZE_RADIUS = 24;
export const PLAYER_SHOT_COOLDOWN = 80; // ms
export const PLAYER_INVULN_TIME = 2000; // ms after death
export const PLAYER_START_LIVES = 3;
export const PLAYER_START_BOMBS = 3;
export const PLAYER_MAX_POWER = 128;
export const BOMB_DURATION = 3000;
export const BOMB_DAMAGE = 5;

// Scoring
export const GRAZE_SCORE = 500;
export const POINT_ITEM_BASE = 1000;
export const POWER_ITEM_VALUE = 1;

// Bullets
export const MAX_BULLETS = 2000;
export const BULLET_OFFSCREEN_MARGIN = 40;

// Enemies
export const MAX_ENEMIES = 60;

// Visual
export const BG_SCROLL_SPEED = 60;

// Colors
export const COLORS = {
  primary: 0x00ccff,
  secondary: 0xff44aa,
  accent: 0xffcc00,
  danger: 0xff3333,
  safe: 0x33ff66,
  bg_dark: 0x0a0a1a,
  bg_mid: 0x141432,
  hud_bg: 0x0d0d28,
  hud_border: 0x2233aa,
  text: 0xffffff,
  text_dim: 0x8888aa,
  boss_hp: 0xff4466,
  player_hp: 0x44ff88,
  power_bar: 0xffaa00,
};
