import type { StageData, BossData, WaveData, EnemySpawnData, PathData } from '../types';
import { PLAY_WIDTH, PLAY_HEIGHT } from '../constants';

// ---------------------------------------------------------------------------
// Helper: convert seconds to milliseconds for wave timing
// ---------------------------------------------------------------------------
const sec = (s: number): number => s * 1000;

// ---------------------------------------------------------------------------
// Common path presets
// ---------------------------------------------------------------------------
const linearLeft = (speed = 80): PathData => ({
  type: 'linear',
  speed,
  points: [{ x: -100, y: 0 }], // move left off-screen
});

const sinePath = (speed = 90, amp = 60, freq = 1.2): PathData => ({
  type: 'sine',
  speed,
  amplitude: amp,
  frequency: freq,
});

const hoverAt = (hx: number, hy: number, time = 4000): PathData => ({
  type: 'hover',
  hoverX: hx,
  hoverY: hy,
  hoverTime: time,
  speed: 100,
});

const circlePattern = (speed = 70, amp = 50, freq = 1.0): PathData => ({
  type: 'circle',
  speed,
  amplitude: amp,
  frequency: freq,
});

// ---------------------------------------------------------------------------
// Health scaling helpers (base health values per enemy type)
// ---------------------------------------------------------------------------
const BASE_HP = {
  grunt: 20,
  swooper: 25,
  turret: 45,
  spinner: 50,
  carrier: 90,
  miniboss: 250,
} as const;

const hp = (type: keyof typeof BASE_HP, stageMultiplier: number): number =>
  Math.round(BASE_HP[type] * stageMultiplier);

// ---------------------------------------------------------------------------
// Boss definitions (phases filled in by boss system)
// ---------------------------------------------------------------------------
const boss1: BossData = {
  id: 'boss1',
  name: 'Prism Warden',
  visualTheme: 'Crystalline geometric fortress with prismatic energy shields',
  signatureMechanic:
    'Reflective bullet walls that bounce projectiles in geometric patterns',
  difficulty: 'easy-medium',
  phases: [],
};

const boss2: BossData = {
  id: 'boss2',
  name: 'Scarlet Tempest',
  visualTheme: 'Aggressive flame-winged war machine with blade appendages',
  signatureMechanic:
    'Sweeping flame trails that persist on screen creating shrinking safe zones',
  difficulty: 'medium-hard',
  phases: [],
};

const boss3: BossData = {
  id: 'boss3',
  name: 'Void Empress',
  visualTheme: 'Cosmic entity with orbital rings and reality-warping presence',
  signatureMechanic:
    'Gravity wells that curve bullet trajectories creating dynamic warped patterns',
  difficulty: 'hard',
  phases: [],
};

// ===========================================================================
// STAGE 1 - Stellar Drift
// ===========================================================================
const stage1Waves: WaveData[] = [
  // 0s - 3 grunts vertical line, slow, gentle intro
  {
    time: sec(0),
    enemies: [
      { type: 'grunt', x: 760, y: 160, path: linearLeft(60), firePattern: 'aimed_single', health: hp('grunt', 1), delay: 0 },
      { type: 'grunt', x: 760, y: 270, path: linearLeft(60), firePattern: 'aimed_single', health: hp('grunt', 1), delay: 200 },
      { type: 'grunt', x: 760, y: 380, path: linearLeft(60), firePattern: 'aimed_single', health: hp('grunt', 1), delay: 400 },
    ],
  },
  // 5s - 4 grunts diamond formation
  {
    time: sec(5),
    enemies: [
      { type: 'grunt', x: 760, y: 270, path: linearLeft(70), firePattern: 'aimed_single', health: hp('grunt', 1), delay: 0 },
      { type: 'grunt', x: 780, y: 200, path: linearLeft(70), firePattern: 'aimed_single', health: hp('grunt', 1), delay: 100 },
      { type: 'grunt', x: 780, y: 340, path: linearLeft(70), firePattern: 'aimed_single', health: hp('grunt', 1), delay: 100 },
      { type: 'grunt', x: 800, y: 270, path: linearLeft(70), firePattern: 'aimed_single', health: hp('grunt', 1), delay: 200 },
    ],
  },
  // 12s - 2 swoopers sine wave from top-right
  {
    time: sec(12),
    enemies: [
      { type: 'swooper', x: 750, y: 80, path: sinePath(100, 70, 1.0), firePattern: 'aimed_burst', health: hp('swooper', 1), delay: 0 },
      { type: 'swooper', x: 770, y: 120, path: sinePath(100, 70, 1.0), firePattern: 'aimed_burst', health: hp('swooper', 1), delay: 300 },
    ],
  },
  // 18s - 3 grunts + 2 swoopers mixed
  {
    time: sec(18),
    enemies: [
      { type: 'grunt', x: 760, y: 120, path: linearLeft(70), firePattern: 'aimed_single', health: hp('grunt', 1), delay: 0 },
      { type: 'grunt', x: 760, y: 270, path: linearLeft(70), firePattern: 'aimed_single', health: hp('grunt', 1), delay: 150 },
      { type: 'grunt', x: 760, y: 420, path: linearLeft(70), firePattern: 'aimed_single', health: hp('grunt', 1), delay: 300 },
      { type: 'swooper', x: 780, y: 60, path: sinePath(90, 60, 1.2), firePattern: 'aimed_burst', health: hp('swooper', 1), delay: 500 },
      { type: 'swooper', x: 780, y: 480, path: sinePath(90, -60, 1.2), firePattern: 'aimed_burst', health: hp('swooper', 1), delay: 600 },
    ],
  },
  // 25s - first turret (hover type), teaches dodging spread patterns
  {
    time: sec(25),
    enemies: [
      { type: 'turret', x: 740, y: 270, path: hoverAt(560, 270, 6000), firePattern: 'spread3', health: hp('turret', 1), delay: 0 },
    ],
  },
  // 32s - 5 grunts tight V-formation, faster
  {
    time: sec(32),
    enemies: [
      { type: 'grunt', x: 760, y: 270, path: linearLeft(100), firePattern: 'aimed_single', health: hp('grunt', 1), delay: 0 },
      { type: 'grunt', x: 780, y: 220, path: linearLeft(100), firePattern: 'aimed_single', health: hp('grunt', 1), delay: 80 },
      { type: 'grunt', x: 780, y: 320, path: linearLeft(100), firePattern: 'aimed_single', health: hp('grunt', 1), delay: 80 },
      { type: 'grunt', x: 800, y: 170, path: linearLeft(100), firePattern: 'aimed_single', health: hp('grunt', 1), delay: 160 },
      { type: 'grunt', x: 800, y: 370, path: linearLeft(100), firePattern: 'aimed_single', health: hp('grunt', 1), delay: 160 },
    ],
  },
  // 38s - 2 turrets staggered firing
  {
    time: sec(38),
    enemies: [
      { type: 'turret', x: 750, y: 160, path: hoverAt(580, 160, 5000), firePattern: 'spread3', health: hp('turret', 1), delay: 0 },
      { type: 'turret', x: 750, y: 380, path: hoverAt(580, 380, 5000), firePattern: 'spread3', health: hp('turret', 1), delay: 800 },
    ],
  },
  // 45s - 6 swooper wave, teaches tracking moving enemies
  {
    time: sec(45),
    enemies: [
      { type: 'swooper', x: 750, y: 60, path: sinePath(110, 80, 1.0), firePattern: 'aimed_burst', health: hp('swooper', 1), delay: 0 },
      { type: 'swooper', x: 760, y: 140, path: sinePath(110, 70, 1.1), firePattern: 'aimed_burst', health: hp('swooper', 1), delay: 200 },
      { type: 'swooper', x: 770, y: 220, path: sinePath(110, 60, 1.2), firePattern: 'aimed_burst', health: hp('swooper', 1), delay: 400 },
      { type: 'swooper', x: 750, y: 320, path: sinePath(110, -60, 1.2), firePattern: 'aimed_burst', health: hp('swooper', 1), delay: 600 },
      { type: 'swooper', x: 760, y: 400, path: sinePath(110, -70, 1.1), firePattern: 'aimed_burst', health: hp('swooper', 1), delay: 800 },
      { type: 'swooper', x: 770, y: 480, path: sinePath(110, -80, 1.0), firePattern: 'aimed_burst', health: hp('swooper', 1), delay: 1000 },
    ],
  },
  // 52s - mixed wave: grunts + swooper + turret
  {
    time: sec(52),
    enemies: [
      { type: 'grunt', x: 760, y: 100, path: linearLeft(80), firePattern: 'aimed_single', health: hp('grunt', 1), delay: 0 },
      { type: 'grunt', x: 760, y: 440, path: linearLeft(80), firePattern: 'aimed_single', health: hp('grunt', 1), delay: 100 },
      { type: 'swooper', x: 770, y: 270, path: sinePath(90, 100, 0.8), firePattern: 'aimed_burst', health: hp('swooper', 1), delay: 300 },
      { type: 'turret', x: 750, y: 270, path: hoverAt(600, 270, 5000), firePattern: 'spread3', health: hp('turret', 1), delay: 600 },
    ],
  },
  // 60s - breathing room (empty wave)
  {
    time: sec(60),
    enemies: [],
  },
  // 63s - miniboss encounter
  {
    time: sec(63),
    enemies: [
      { type: 'miniboss', x: 760, y: 270, path: hoverAt(520, 270, 10000), firePattern: 'miniboss_spiral', health: hp('miniboss', 1), delay: 0 },
    ],
  },
  // 75s - post-miniboss cleanup grunts
  {
    time: sec(75),
    enemies: [
      { type: 'grunt', x: 760, y: 150, path: linearLeft(70), firePattern: 'aimed_single', health: hp('grunt', 1), delay: 0 },
      { type: 'grunt', x: 760, y: 270, path: linearLeft(70), firePattern: 'aimed_single', health: hp('grunt', 1), delay: 200 },
      { type: 'grunt', x: 760, y: 390, path: linearLeft(70), firePattern: 'aimed_single', health: hp('grunt', 1), delay: 400 },
    ],
  },
  // 80s - final pre-boss wave, increasing density
  {
    time: sec(80),
    enemies: [
      { type: 'grunt', x: 760, y: 100, path: linearLeft(90), firePattern: 'aimed_single', health: hp('grunt', 1), delay: 0 },
      { type: 'grunt', x: 770, y: 200, path: linearLeft(90), firePattern: 'aimed_single', health: hp('grunt', 1), delay: 100 },
      { type: 'grunt', x: 780, y: 300, path: linearLeft(90), firePattern: 'aimed_single', health: hp('grunt', 1), delay: 200 },
      { type: 'grunt', x: 770, y: 400, path: linearLeft(90), firePattern: 'aimed_single', health: hp('grunt', 1), delay: 300 },
      { type: 'swooper', x: 750, y: 60, path: sinePath(100, 50, 1.3), firePattern: 'aimed_burst', health: hp('swooper', 1), delay: 500 },
      { type: 'swooper', x: 750, y: 480, path: sinePath(100, -50, 1.3), firePattern: 'aimed_burst', health: hp('swooper', 1), delay: 600 },
      { type: 'turret', x: 740, y: 270, path: hoverAt(600, 270, 4000), firePattern: 'spread3', health: hp('turret', 1), delay: 800 },
    ],
  },
  // 88s - boss wave marker
  {
    time: sec(88),
    enemies: [],
    isBoss: true,
  },
];

export const stage1: StageData = {
  id: 'stage1',
  name: 'Stellar Drift',
  teachingGoal:
    'Teach basic movement, focus mode, and pattern reading through simple, readable enemy formations',
  difficulty: 'easy',
  bgKey: 'bg_stage1',
  bgColor: 0x0a0a2a,
  waves: stage1Waves,
  boss: boss1,
};

// ===========================================================================
// STAGE 2 - Crimson Corridor
// ===========================================================================
const S2 = 1.5; // health multiplier

const stage2Waves: WaveData[] = [
  // 0s - 4 grunts immediate pressure, faster
  {
    time: sec(0),
    enemies: [
      { type: 'grunt', x: 760, y: 100, path: linearLeft(100), firePattern: 'aimed_double', health: hp('grunt', S2), delay: 0 },
      { type: 'grunt', x: 770, y: 200, path: linearLeft(100), firePattern: 'aimed_double', health: hp('grunt', S2), delay: 100 },
      { type: 'grunt', x: 760, y: 340, path: linearLeft(100), firePattern: 'aimed_double', health: hp('grunt', S2), delay: 200 },
      { type: 'grunt', x: 770, y: 440, path: linearLeft(100), firePattern: 'aimed_double', health: hp('grunt', S2), delay: 300 },
    ],
  },
  // 5s - 3 swoopers from top AND bottom simultaneously
  {
    time: sec(5),
    enemies: [
      { type: 'swooper', x: 750, y: 50, path: sinePath(110, 80, 1.2), firePattern: 'aimed_burst', health: hp('swooper', S2), delay: 0 },
      { type: 'swooper', x: 770, y: 490, path: sinePath(110, -80, 1.2), firePattern: 'aimed_burst', health: hp('swooper', S2), delay: 150 },
      { type: 'swooper', x: 760, y: 50, path: sinePath(110, 70, 1.0), firePattern: 'aimed_burst', health: hp('swooper', S2), delay: 400 },
    ],
  },
  // 12s - 2 spinners (new enemy type!)
  {
    time: sec(12),
    enemies: [
      { type: 'spinner', x: 760, y: 180, path: hoverAt(520, 180, 6000), firePattern: 'radial_slow', health: hp('spinner', S2), delay: 0 },
      { type: 'spinner', x: 760, y: 360, path: hoverAt(520, 360, 6000), firePattern: 'radial_slow', health: hp('spinner', S2), delay: 500 },
    ],
  },
  // 18s - 5 grunts + 2 swoopers pincer
  {
    time: sec(18),
    enemies: [
      { type: 'grunt', x: 760, y: 100, path: linearLeft(90), firePattern: 'aimed_double', health: hp('grunt', S2), delay: 0 },
      { type: 'grunt', x: 770, y: 190, path: linearLeft(90), firePattern: 'aimed_double', health: hp('grunt', S2), delay: 100 },
      { type: 'grunt', x: 760, y: 270, path: linearLeft(90), firePattern: 'aimed_double', health: hp('grunt', S2), delay: 200 },
      { type: 'grunt', x: 770, y: 350, path: linearLeft(90), firePattern: 'aimed_double', health: hp('grunt', S2), delay: 300 },
      { type: 'grunt', x: 760, y: 440, path: linearLeft(90), firePattern: 'aimed_double', health: hp('grunt', S2), delay: 400 },
      { type: 'swooper', x: 780, y: 40, path: sinePath(120, 100, 0.9), firePattern: 'aimed_burst', health: hp('swooper', S2), delay: 600 },
      { type: 'swooper', x: 780, y: 500, path: sinePath(120, -100, 0.9), firePattern: 'aimed_burst', health: hp('swooper', S2), delay: 700 },
    ],
  },
  // 25s - first carrier
  {
    time: sec(25),
    enemies: [
      { type: 'carrier', x: 780, y: 270, path: hoverAt(560, 270, 8000), firePattern: 'dense_spread', health: hp('carrier', S2), delay: 0 },
    ],
  },
  // 32s - spinner + turret combo, overlapping patterns
  {
    time: sec(32),
    enemies: [
      { type: 'spinner', x: 760, y: 270, path: hoverAt(540, 270, 6000), firePattern: 'radial_slow', health: hp('spinner', S2), delay: 0 },
      { type: 'turret', x: 750, y: 130, path: hoverAt(600, 130, 5000), firePattern: 'spread5', health: hp('turret', S2), delay: 400 },
      { type: 'turret', x: 750, y: 410, path: hoverAt(600, 410, 5000), firePattern: 'spread5', health: hp('turret', S2), delay: 600 },
    ],
  },
  // 38s - fast grunt rush, 8 grunts rapid succession
  {
    time: sec(38),
    enemies: [
      { type: 'grunt', x: 760, y: 80, path: linearLeft(130), firePattern: 'aimed_single', health: hp('grunt', S2), delay: 0 },
      { type: 'grunt', x: 760, y: 150, path: linearLeft(130), firePattern: 'aimed_single', health: hp('grunt', S2), delay: 150 },
      { type: 'grunt', x: 760, y: 220, path: linearLeft(130), firePattern: 'aimed_single', health: hp('grunt', S2), delay: 300 },
      { type: 'grunt', x: 760, y: 290, path: linearLeft(130), firePattern: 'aimed_single', health: hp('grunt', S2), delay: 450 },
      { type: 'grunt', x: 760, y: 360, path: linearLeft(130), firePattern: 'aimed_single', health: hp('grunt', S2), delay: 600 },
      { type: 'grunt', x: 760, y: 430, path: linearLeft(130), firePattern: 'aimed_single', health: hp('grunt', S2), delay: 750 },
      { type: 'grunt', x: 760, y: 200, path: linearLeft(140), firePattern: 'aimed_double', health: hp('grunt', S2), delay: 900 },
      { type: 'grunt', x: 760, y: 340, path: linearLeft(140), firePattern: 'aimed_double', health: hp('grunt', S2), delay: 1050 },
    ],
  },
  // 45s - 2 carriers slowly advancing, turrets providing cover fire
  {
    time: sec(45),
    enemies: [
      { type: 'carrier', x: 780, y: 160, path: hoverAt(540, 160, 8000), firePattern: 'dense_spread', health: hp('carrier', S2), delay: 0 },
      { type: 'carrier', x: 780, y: 380, path: hoverAt(540, 380, 8000), firePattern: 'dense_spread', health: hp('carrier', S2), delay: 600 },
      { type: 'turret', x: 750, y: 270, path: hoverAt(620, 270, 6000), firePattern: 'spread5', health: hp('turret', S2), delay: 1000 },
    ],
  },
  // 52s - swooper swarm (6) with spinner in center
  {
    time: sec(52),
    enemies: [
      { type: 'spinner', x: 770, y: 270, path: hoverAt(500, 270, 7000), firePattern: 'radial_fast', health: hp('spinner', S2), delay: 0 },
      { type: 'swooper', x: 760, y: 60, path: sinePath(120, 70, 1.3), firePattern: 'aimed_burst', health: hp('swooper', S2), delay: 200 },
      { type: 'swooper', x: 760, y: 140, path: sinePath(120, 60, 1.2), firePattern: 'aimed_burst', health: hp('swooper', S2), delay: 350 },
      { type: 'swooper', x: 760, y: 220, path: sinePath(120, 50, 1.1), firePattern: 'aimed_burst', health: hp('swooper', S2), delay: 500 },
      { type: 'swooper', x: 760, y: 320, path: sinePath(120, -50, 1.1), firePattern: 'aimed_burst', health: hp('swooper', S2), delay: 650 },
      { type: 'swooper', x: 760, y: 400, path: sinePath(120, -60, 1.2), firePattern: 'aimed_burst', health: hp('swooper', S2), delay: 800 },
      { type: 'swooper', x: 760, y: 480, path: sinePath(120, -70, 1.3), firePattern: 'aimed_burst', health: hp('swooper', S2), delay: 950 },
    ],
  },
  // 60s - breathing room
  {
    time: sec(60),
    enemies: [],
  },
  // 62s - miniboss (harder than stage 1)
  {
    time: sec(62),
    enemies: [
      { type: 'miniboss', x: 770, y: 270, path: hoverAt(480, 270, 12000), firePattern: 'miniboss_cross', health: hp('miniboss', S2), delay: 0 },
    ],
  },
  // 78s - recovery wave, moderate grunts
  {
    time: sec(78),
    enemies: [
      { type: 'grunt', x: 760, y: 160, path: linearLeft(80), firePattern: 'aimed_single', health: hp('grunt', S2), delay: 0 },
      { type: 'grunt', x: 760, y: 270, path: linearLeft(80), firePattern: 'aimed_single', health: hp('grunt', S2), delay: 200 },
      { type: 'grunt', x: 760, y: 380, path: linearLeft(80), firePattern: 'aimed_single', health: hp('grunt', S2), delay: 400 },
    ],
  },
  // 82s - dense mixed wave: all enemy types
  {
    time: sec(82),
    enemies: [
      { type: 'grunt', x: 760, y: 100, path: linearLeft(100), firePattern: 'aimed_double', health: hp('grunt', S2), delay: 0 },
      { type: 'grunt', x: 760, y: 440, path: linearLeft(100), firePattern: 'aimed_double', health: hp('grunt', S2), delay: 100 },
      { type: 'swooper', x: 770, y: 60, path: sinePath(110, 80, 1.0), firePattern: 'aimed_burst', health: hp('swooper', S2), delay: 300 },
      { type: 'swooper', x: 770, y: 480, path: sinePath(110, -80, 1.0), firePattern: 'aimed_burst', health: hp('swooper', S2), delay: 400 },
      { type: 'turret', x: 750, y: 200, path: hoverAt(580, 200, 5000), firePattern: 'spread5', health: hp('turret', S2), delay: 600 },
      { type: 'spinner', x: 760, y: 340, path: hoverAt(520, 340, 5000), firePattern: 'radial_fast', health: hp('spinner', S2), delay: 800 },
      { type: 'carrier', x: 780, y: 270, path: hoverAt(560, 270, 6000), firePattern: 'dense_spread', health: hp('carrier', S2), delay: 1000 },
    ],
  },
  // 90s - final escalation: spinner + carrier + turrets
  {
    time: sec(90),
    enemies: [
      { type: 'spinner', x: 770, y: 180, path: hoverAt(480, 180, 6000), firePattern: 'radial_fast', health: hp('spinner', S2), delay: 0 },
      { type: 'spinner', x: 770, y: 360, path: hoverAt(480, 360, 6000), firePattern: 'radial_fast', health: hp('spinner', S2), delay: 300 },
      { type: 'carrier', x: 780, y: 270, path: hoverAt(540, 270, 7000), firePattern: 'dense_spread', health: hp('carrier', S2), delay: 500 },
      { type: 'turret', x: 750, y: 80, path: hoverAt(600, 80, 5000), firePattern: 'spread5', health: hp('turret', S2), delay: 700 },
      { type: 'turret', x: 750, y: 460, path: hoverAt(600, 460, 5000), firePattern: 'spread5', health: hp('turret', S2), delay: 900 },
    ],
  },
  // 98s - boss wave marker
  {
    time: sec(98),
    enemies: [],
    isBoss: true,
  },
];

export const stage2: StageData = {
  id: 'stage2',
  name: 'Crimson Corridor',
  teachingGoal:
    'Introduce aimed shots, enemy pressure, and tighter navigation requiring focus mode mastery',
  difficulty: 'medium',
  bgKey: 'bg_stage2',
  bgColor: 0x1a0a0a,
  waves: stage2Waves,
  boss: boss2,
};

// ===========================================================================
// STAGE 3 - Void Nexus
// ===========================================================================
const S3 = 2.0; // health multiplier

const stage3Waves: WaveData[] = [
  // 0s - immediate spinner + 4 grunts, no warm-up
  {
    time: sec(0),
    enemies: [
      { type: 'spinner', x: 770, y: 270, path: hoverAt(500, 270, 6000), firePattern: 'radial_fast', health: hp('spinner', S3), delay: 0 },
      { type: 'grunt', x: 760, y: 80, path: linearLeft(110), firePattern: 'aimed_double', health: hp('grunt', S3), delay: 200 },
      { type: 'grunt', x: 760, y: 190, path: linearLeft(110), firePattern: 'aimed_double', health: hp('grunt', S3), delay: 350 },
      { type: 'grunt', x: 760, y: 350, path: linearLeft(110), firePattern: 'aimed_double', health: hp('grunt', S3), delay: 500 },
      { type: 'grunt', x: 760, y: 460, path: linearLeft(110), firePattern: 'aimed_double', health: hp('grunt', S3), delay: 650 },
    ],
  },
  // 6s - 2 carriers flanking with swooper escorts
  {
    time: sec(6),
    enemies: [
      { type: 'carrier', x: 780, y: 140, path: hoverAt(520, 140, 8000), firePattern: 'dense_spread', health: hp('carrier', S3), delay: 0 },
      { type: 'carrier', x: 780, y: 400, path: hoverAt(520, 400, 8000), firePattern: 'dense_spread', health: hp('carrier', S3), delay: 300 },
      { type: 'swooper', x: 760, y: 60, path: sinePath(120, 50, 1.3), firePattern: 'aimed_burst', health: hp('swooper', S3), delay: 500 },
      { type: 'swooper', x: 760, y: 480, path: sinePath(120, -50, 1.3), firePattern: 'aimed_burst', health: hp('swooper', S3), delay: 600 },
    ],
  },
  // 14s - turret wall (3 turrets) with spinner support
  {
    time: sec(14),
    enemies: [
      { type: 'turret', x: 750, y: 120, path: hoverAt(580, 120, 6000), firePattern: 'spread5', health: hp('turret', S3), delay: 0 },
      { type: 'turret', x: 750, y: 270, path: hoverAt(580, 270, 6000), firePattern: 'spread5', health: hp('turret', S3), delay: 200 },
      { type: 'turret', x: 750, y: 420, path: hoverAt(580, 420, 6000), firePattern: 'spread5', health: hp('turret', S3), delay: 400 },
      { type: 'spinner', x: 770, y: 270, path: hoverAt(480, 270, 6000), firePattern: 'radial_fast', health: hp('spinner', S3), delay: 800 },
    ],
  },
  // 20s - fast swooper blitz from alternating positions
  {
    time: sec(20),
    enemies: [
      { type: 'swooper', x: 760, y: 50, path: sinePath(140, 90, 1.5), firePattern: 'aimed_burst', health: hp('swooper', S3), delay: 0 },
      { type: 'swooper', x: 760, y: 490, path: sinePath(140, -90, 1.5), firePattern: 'aimed_burst', health: hp('swooper', S3), delay: 200 },
      { type: 'swooper', x: 770, y: 50, path: sinePath(140, 80, 1.3), firePattern: 'aimed_burst', health: hp('swooper', S3), delay: 400 },
      { type: 'swooper', x: 770, y: 490, path: sinePath(140, -80, 1.3), firePattern: 'aimed_burst', health: hp('swooper', S3), delay: 600 },
      { type: 'swooper', x: 780, y: 50, path: sinePath(140, 70, 1.1), firePattern: 'aimed_burst', health: hp('swooper', S3), delay: 800 },
      { type: 'swooper', x: 780, y: 490, path: sinePath(140, -70, 1.1), firePattern: 'aimed_burst', health: hp('swooper', S3), delay: 1000 },
    ],
  },
  // 28s - double spinner + carrier, dense bullet hell
  {
    time: sec(28),
    enemies: [
      { type: 'spinner', x: 770, y: 160, path: hoverAt(460, 160, 7000), firePattern: 'radial_dense', health: hp('spinner', S3), delay: 0 },
      { type: 'spinner', x: 770, y: 380, path: hoverAt(460, 380, 7000), firePattern: 'radial_dense', health: hp('spinner', S3), delay: 400 },
      { type: 'carrier', x: 780, y: 270, path: hoverAt(540, 270, 7000), firePattern: 'dense_spread', health: hp('carrier', S3), delay: 800 },
    ],
  },
  // 35s - grunt swarm (10) in wave pattern
  {
    time: sec(35),
    enemies: [
      { type: 'grunt', x: 760, y: 60, path: linearLeft(120), firePattern: 'aimed_double', health: hp('grunt', S3), delay: 0 },
      { type: 'grunt', x: 770, y: 120, path: linearLeft(120), firePattern: 'aimed_double', health: hp('grunt', S3), delay: 120 },
      { type: 'grunt', x: 760, y: 180, path: linearLeft(120), firePattern: 'aimed_double', health: hp('grunt', S3), delay: 240 },
      { type: 'grunt', x: 770, y: 240, path: linearLeft(120), firePattern: 'aimed_double', health: hp('grunt', S3), delay: 360 },
      { type: 'grunt', x: 760, y: 300, path: linearLeft(120), firePattern: 'aimed_double', health: hp('grunt', S3), delay: 480 },
      { type: 'grunt', x: 770, y: 360, path: linearLeft(120), firePattern: 'aimed_double', health: hp('grunt', S3), delay: 600 },
      { type: 'grunt', x: 760, y: 420, path: linearLeft(120), firePattern: 'aimed_double', health: hp('grunt', S3), delay: 720 },
      { type: 'grunt', x: 770, y: 480, path: linearLeft(120), firePattern: 'aimed_double', health: hp('grunt', S3), delay: 840 },
      { type: 'grunt', x: 760, y: 150, path: linearLeft(140), firePattern: 'aimed_double', health: hp('grunt', S3), delay: 960 },
      { type: 'grunt', x: 770, y: 390, path: linearLeft(140), firePattern: 'aimed_double', health: hp('grunt', S3), delay: 1080 },
    ],
  },
  // 42s - 2 spinners + 2 turrets overlapping patterns
  {
    time: sec(42),
    enemies: [
      { type: 'spinner', x: 770, y: 180, path: hoverAt(460, 180, 6000), firePattern: 'radial_fast', health: hp('spinner', S3), delay: 0 },
      { type: 'spinner', x: 770, y: 360, path: hoverAt(460, 360, 6000), firePattern: 'radial_fast', health: hp('spinner', S3), delay: 300 },
      { type: 'turret', x: 750, y: 80, path: hoverAt(580, 80, 5000), firePattern: 'spread5', health: hp('turret', S3), delay: 500 },
      { type: 'turret', x: 750, y: 460, path: hoverAt(580, 460, 5000), firePattern: 'spread5', health: hp('turret', S3), delay: 700 },
    ],
  },
  // 50s - carrier convoy (3 carriers in sequence)
  {
    time: sec(50),
    enemies: [
      { type: 'carrier', x: 780, y: 140, path: hoverAt(520, 140, 7000), firePattern: 'dense_spread', health: hp('carrier', S3), delay: 0 },
      { type: 'carrier', x: 800, y: 270, path: hoverAt(520, 270, 7000), firePattern: 'dense_spread', health: hp('carrier', S3), delay: 800 },
      { type: 'carrier', x: 780, y: 400, path: hoverAt(520, 400, 7000), firePattern: 'dense_spread', health: hp('carrier', S3), delay: 1600 },
    ],
  },
  // 58s - breathing room
  {
    time: sec(58),
    enemies: [],
  },
  // 60s - miniboss (hardest, complex multi-pattern)
  {
    time: sec(60),
    enemies: [
      { type: 'miniboss', x: 780, y: 270, path: hoverAt(440, 270, 14000), firePattern: 'miniboss_void', health: hp('miniboss', S3), delay: 0 },
    ],
  },
  // 78s - brief recovery
  {
    time: sec(78),
    enemies: [
      { type: 'grunt', x: 760, y: 200, path: linearLeft(80), firePattern: 'aimed_single', health: hp('grunt', S3), delay: 0 },
      { type: 'grunt', x: 760, y: 340, path: linearLeft(80), firePattern: 'aimed_single', health: hp('grunt', S3), delay: 300 },
    ],
  },
  // 82s - all enemy types simultaneously
  {
    time: sec(82),
    enemies: [
      { type: 'grunt', x: 760, y: 80, path: linearLeft(110), firePattern: 'aimed_double', health: hp('grunt', S3), delay: 0 },
      { type: 'grunt', x: 760, y: 460, path: linearLeft(110), firePattern: 'aimed_double', health: hp('grunt', S3), delay: 100 },
      { type: 'swooper', x: 770, y: 50, path: sinePath(130, 80, 1.2), firePattern: 'aimed_burst', health: hp('swooper', S3), delay: 200 },
      { type: 'swooper', x: 770, y: 490, path: sinePath(130, -80, 1.2), firePattern: 'aimed_burst', health: hp('swooper', S3), delay: 300 },
      { type: 'turret', x: 750, y: 180, path: hoverAt(580, 180, 5000), firePattern: 'spread5', health: hp('turret', S3), delay: 400 },
      { type: 'turret', x: 750, y: 360, path: hoverAt(580, 360, 5000), firePattern: 'spread5', health: hp('turret', S3), delay: 500 },
      { type: 'spinner', x: 770, y: 270, path: hoverAt(460, 270, 6000), firePattern: 'radial_dense', health: hp('spinner', S3), delay: 600 },
      { type: 'carrier', x: 780, y: 270, path: hoverAt(520, 130, 6000), firePattern: 'dense_spread', health: hp('carrier', S3), delay: 900 },
    ],
  },
  // 90s - escalating density, double everything
  {
    time: sec(90),
    enemies: [
      { type: 'spinner', x: 770, y: 130, path: hoverAt(440, 130, 6000), firePattern: 'radial_dense', health: hp('spinner', S3), delay: 0 },
      { type: 'spinner', x: 770, y: 410, path: hoverAt(440, 410, 6000), firePattern: 'radial_dense', health: hp('spinner', S3), delay: 200 },
      { type: 'carrier', x: 780, y: 200, path: hoverAt(520, 200, 6000), firePattern: 'dense_spread', health: hp('carrier', S3), delay: 400 },
      { type: 'carrier', x: 780, y: 340, path: hoverAt(520, 340, 6000), firePattern: 'dense_spread', health: hp('carrier', S3), delay: 600 },
      { type: 'turret', x: 750, y: 60, path: hoverAt(600, 60, 5000), firePattern: 'spread5', health: hp('turret', S3), delay: 800 },
      { type: 'turret', x: 750, y: 270, path: hoverAt(600, 270, 5000), firePattern: 'spread5', health: hp('turret', S3), delay: 900 },
      { type: 'turret', x: 750, y: 480, path: hoverAt(600, 480, 5000), firePattern: 'spread5', health: hp('turret', S3), delay: 1000 },
      { type: 'swooper', x: 760, y: 50, path: sinePath(150, 90, 1.5), firePattern: 'aimed_burst', health: hp('swooper', S3), delay: 1200 },
      { type: 'swooper', x: 760, y: 490, path: sinePath(150, -90, 1.5), firePattern: 'aimed_burst', health: hp('swooper', S3), delay: 1300 },
    ],
  },
  // 100s - final gauntlet, maximum pressure
  {
    time: sec(100),
    enemies: [
      { type: 'spinner', x: 770, y: 270, path: circlePattern(60, 100, 0.8), firePattern: 'radial_dense', health: hp('spinner', S3), delay: 0 },
      { type: 'carrier', x: 780, y: 130, path: hoverAt(480, 130, 6000), firePattern: 'dense_spread', health: hp('carrier', S3), delay: 200 },
      { type: 'carrier', x: 780, y: 410, path: hoverAt(480, 410, 6000), firePattern: 'dense_spread', health: hp('carrier', S3), delay: 400 },
      { type: 'turret', x: 750, y: 60, path: hoverAt(560, 60, 5000), firePattern: 'spread5', health: hp('turret', S3), delay: 600 },
      { type: 'turret', x: 750, y: 480, path: hoverAt(560, 480, 5000), firePattern: 'spread5', health: hp('turret', S3), delay: 700 },
      { type: 'grunt', x: 760, y: 160, path: linearLeft(140), firePattern: 'aimed_double', health: hp('grunt', S3), delay: 900 },
      { type: 'grunt', x: 760, y: 380, path: linearLeft(140), firePattern: 'aimed_double', health: hp('grunt', S3), delay: 1000 },
      { type: 'swooper', x: 770, y: 50, path: sinePath(150, 100, 1.4), firePattern: 'aimed_burst', health: hp('swooper', S3), delay: 1200 },
      { type: 'swooper', x: 770, y: 490, path: sinePath(150, -100, 1.4), firePattern: 'aimed_burst', health: hp('swooper', S3), delay: 1300 },
    ],
  },
  // 108s - boss wave marker
  {
    time: sec(108),
    enemies: [],
    isBoss: true,
  },
];

export const stage3: StageData = {
  id: 'stage3',
  name: 'Void Nexus',
  teachingGoal:
    'Final challenge combining all skills - dense patterns, mixed enemy types, requiring mastery of movement, focus, and bombing',
  difficulty: 'hard',
  bgKey: 'bg_stage3',
  bgColor: 0x0a0a1a,
  waves: stage3Waves,
  boss: boss3,
};

// ===========================================================================
// Exports
// ===========================================================================

/** All stages in order */
export const stages: StageData[] = [stage1, stage2, stage3];

/** Look up a stage by its id (e.g. 'stage1') */
export function getStage(id: string): StageData | undefined {
  return stages.find((s) => s.id === id);
}
