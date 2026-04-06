# Void Blossom

A polished browser-based 2D horizontal bullet-hell shooter with a modern anime-inspired visual style.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Controls

| Key | Action |
|-----|--------|
| Arrow Keys / WASD | Move |
| Shift | Focus mode (slow, precise movement) |
| Z | Shoot |
| X | Bomb (clears bullets, grants invulnerability) |
| ESC | Pause |
| Enter | Confirm / Continue |

## Build

```bash
npm run build
npm run preview
```

## Architecture

```
src/
  main.ts              - Game entry point and Phaser config
  constants.ts         - Game constants (dimensions, speeds, colors)
  types.ts             - TypeScript interfaces (stages, bosses, bullets)
  scenes/              - All Phaser scenes
    BootScene.ts       - Asset generation and initialization
    PreloadScene.ts    - Loading screen
    TitleScene.ts      - Title screen with animated starfield
    MenuScene.ts       - Main menu
    OptionsScene.ts    - Volume settings
    StageIntroScene.ts - Stage intro with name/goal display
    GameScene.ts       - Core gameplay (collision, waves, pickups, boss)
    HUDScene.ts        - Score, lives, bombs, power, boss health
    PauseScene.ts      - Pause overlay
    GameOverScene.ts   - Game over with continue system
    StageClearScene.ts - Score breakdown between stages
    VictoryScene.ts    - Ending screen
  entities/
    Player.ts          - Player ship with shooting, focus, bombs
    Enemy.ts           - Enemy types with path following and firing
    Boss.ts            - Multi-phase boss with health bar
  systems/
    AssetGenerator.ts  - Procedural sprite generation via Canvas API
    AudioGenerator.ts  - Synthesized SFX via Web Audio API
    BulletManager.ts   - Object-pooled bullet system (2000 bullets)
    EnemyManager.ts    - Enemy spawning and pooling
  data/
    stages.ts          - Stage definitions with wave scripting
    bossPatterns.ts    - Boss phase and pattern definitions
```

## Asset Pipeline

All visual assets are generated procedurally at runtime using Phaser's Graphics API in `AssetGenerator.ts`. No external image files are required. Assets include:

- Player ship and shots
- 6 enemy types (grunt, swooper, turret, spinner, carrier, miniboss)
- 3 boss sprites (Prism Warden, Scarlet Tempest, Void Empress)
- 11 bullet variants including boss-specific styles
- Explosion spritesheets, hit sparks, graze effects
- Pickups (power, point, life, bomb)
- UI elements (HUD frame, icons, buttons, boss warning)
- 3 stage backgrounds with distinct visual themes

## Audio Pipeline

All sound effects are synthesized at runtime using the Web Audio API in `AudioGenerator.ts`. Includes 15+ SFX covering shots, hits, grazes, pickups, bombs, explosions, boss transitions, UI feedback, death, continue, and stage clear. Optional boss music loop using oscillator-based beat pattern.

## Stage Data Format

Each stage is defined in `src/data/stages.ts` with the following structure:

```typescript
{
  id: string;
  name: string;
  teachingGoal: string;
  difficulty: 'easy' | 'easy-medium' | 'medium' | 'medium-hard' | 'hard';
  bgKey: string;
  bgColor: number;
  waves: WaveData[];
  boss: BossData;
}
```

## Stages

### Stage 1: Stellar Drift
- **ID:** stage1
- **Difficulty:** easy
- **Teaching Goal:** Teach basic movement, focus mode, and pattern reading through simple, readable enemy formations
- **Visual Theme:** Deep space with distant stars and nebula wisps
- **Boss:** Prism Warden

### Stage 2: Crimson Corridor
- **ID:** stage2
- **Difficulty:** medium
- **Teaching Goal:** Introduce aimed shots, enemy pressure, and tighter navigation requiring focus mode mastery
- **Visual Theme:** Industrial/mechanical cyber corridors with red tinting
- **Boss:** Scarlet Tempest

### Stage 3: Void Nexus
- **ID:** stage3
- **Difficulty:** hard
- **Teaching Goal:** Final challenge combining all skills - dense patterns, mixed enemy types, requiring mastery of movement, focus, and bombing
- **Visual Theme:** Cosmic void with energy streams and deep purple
- **Boss:** Void Empress

## Bosses

### Boss 1: Prism Warden
- **ID:** boss1
- **Visual Theme:** Crystalline geometric fortress with prismatic energy shields
- **Signature Mechanic:** Reflective bullet walls that bounce projectiles in geometric patterns
- **Difficulty:** easy-medium
- **Phases:** 3 (Crystal Formation, Prismatic Cascade, Shattering Light)

### Boss 2: Scarlet Tempest
- **ID:** boss2
- **Visual Theme:** Aggressive flame-winged war machine with blade appendages
- **Signature Mechanic:** Sweeping flame trails that persist on screen creating shrinking safe zones
- **Difficulty:** medium-hard
- **Phases:** 4 (Ignition, Firestorm, Inferno, Final Blaze)

### Boss 3: Void Empress
- **ID:** boss3
- **Visual Theme:** Cosmic entity with orbital rings and reality-warping presence
- **Signature Mechanic:** Gravity wells that curve bullet trajectories creating dynamic warped patterns
- **Difficulty:** hard
- **Phases:** 4 (Gravity Well, Event Horizon, Singularity, Collapse)

## Gameplay Features

- Smooth player movement with focus/slow mode
- Auto-fire with power-scaled shot patterns (1-4 shots)
- Tiny hitbox (3px radius) with graze detection (24px radius)
- Lives, bombs, score, power, and graze systems
- Object-pooled bullet system supporting 2000+ simultaneous bullets
- 6 enemy archetypes with distinct behaviors
- 7 bullet pattern types (radial, aimed, spread, stream, spiral, ring, random)
- Multi-phase boss fights with health bars and phase transitions
- Pickup system (power, points, lives, bombs)
- Death/respawn with invulnerability frames
- Continue system with score penalty
- Complete screen flow: title -> menu -> stage intro -> gameplay -> stage clear -> victory

## Tech Stack

- **Phaser 3** - Game framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
