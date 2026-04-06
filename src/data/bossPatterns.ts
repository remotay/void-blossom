import type { BossPhase } from '../types';

// ===========================================================================
// Boss Pattern Definitions
// ===========================================================================
// Each pattern's `type` field names a pattern executor that the GameScene
// interprets when it receives a 'boss-attack' event. The `params` object is
// passed straight through so the scene can spawn bullets accordingly.
// `duration` is milliseconds the pattern runs before cycling to the next one.
// ===========================================================================

// ---------------------------------------------------------------------------
// Boss 1 - Prism Warden (easy-medium)
// ---------------------------------------------------------------------------

const prismWardenPhases: BossPhase[] = [
  // Phase 1 - Crystal Formation
  {
    name: 'Crystal Formation',
    health: 300,
    patterns: [
      {
        type: 'radial_burst',
        params: {
          bulletCount: 12,
          bulletSpeed: 140,
          bulletSprite: 'bullet_crystal',
          bulletColor: 0x66ccff,
          bulletSize: 6,
        },
        duration: 2000,
      },
      {
        type: 'aimed_single',
        params: {
          bulletSpeed: 200,
          bulletSprite: 'bullet_crystal',
          bulletColor: 0xaaddff,
          bulletSize: 5,
        },
        duration: 800,
      },
      {
        type: 'radial_burst',
        params: {
          bulletCount: 12,
          bulletSpeed: 150,
          bulletSprite: 'bullet_crystal',
          bulletColor: 0x66ccff,
          bulletSize: 6,
          angleOffset: 15,
        },
        duration: 2000,
      },
      {
        type: 'aimed_single',
        params: {
          bulletSpeed: 210,
          bulletSprite: 'bullet_crystal',
          bulletColor: 0xaaddff,
          bulletSize: 5,
        },
        duration: 800,
      },
    ],
  },

  // Phase 2 - Prismatic Cascade
  {
    name: 'Prismatic Cascade',
    health: 350,
    patterns: [
      {
        type: 'fan_sweep',
        params: {
          bulletCount: 7,
          spreadAngle: 60,
          bulletSpeed: 160,
          sweepDirection: 'left',
          bulletSprite: 'bullet_crystal',
          bulletColor: 0xff66cc,
          bulletSize: 6,
        },
        duration: 1800,
      },
      {
        type: 'fan_sweep',
        params: {
          bulletCount: 7,
          spreadAngle: 60,
          bulletSpeed: 160,
          sweepDirection: 'right',
          bulletSprite: 'bullet_crystal',
          bulletColor: 0x66ffcc,
          bulletSize: 6,
        },
        duration: 1800,
      },
      {
        type: 'radial_burst',
        params: {
          bulletCount: 16,
          bulletSpeed: 150,
          bulletSprite: 'bullet_crystal',
          bulletColor: 0x66ccff,
          bulletSize: 6,
        },
        duration: 1600,
      },
      {
        type: 'line_wall',
        params: {
          bulletCount: 10,
          bulletSpeed: 120,
          direction: 'horizontal',
          bulletSprite: 'bullet_crystal',
          bulletColor: 0xccccff,
          bulletSize: 5,
          gapSize: 2,
        },
        duration: 2000,
      },
    ],
  },

  // Phase 3 - Shattering Light
  {
    name: 'Shattering Light',
    health: 400,
    patterns: [
      {
        type: 'geometric_wall',
        params: {
          shape: 'diamond',
          bulletCount: 20,
          bulletSpeed: 110,
          bulletSprite: 'bullet_crystal',
          bulletColor: 0xffffff,
          bulletSize: 5,
        },
        duration: 2400,
      },
      {
        type: 'radial_burst',
        params: {
          bulletCount: 20,
          bulletSpeed: 170,
          bulletSprite: 'bullet_crystal',
          bulletColor: 0x66ccff,
          bulletSize: 5,
        },
        duration: 1400,
      },
      {
        type: 'aimed_burst',
        params: {
          burstCount: 3,
          burstDelay: 120,
          bulletSpeed: 220,
          bulletSprite: 'bullet_crystal',
          bulletColor: 0xffaadd,
          bulletSize: 5,
        },
        duration: 1200,
      },
      {
        type: 'geometric_wall',
        params: {
          shape: 'triangle',
          bulletCount: 18,
          bulletSpeed: 120,
          bulletSprite: 'bullet_crystal',
          bulletColor: 0xffffff,
          bulletSize: 5,
        },
        duration: 2400,
      },
      {
        type: 'radial_aimed_combo',
        params: {
          radialCount: 16,
          radialSpeed: 140,
          aimedSpeed: 230,
          bulletSprite: 'bullet_crystal',
          bulletColor: 0x88eeff,
          bulletSize: 5,
        },
        duration: 1800,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Boss 2 - Scarlet Tempest (medium-hard)
// ---------------------------------------------------------------------------

const scarletTempestPhases: BossPhase[] = [
  // Phase 1 - Ignition
  {
    name: 'Ignition',
    health: 400,
    patterns: [
      {
        type: 'aimed_burst',
        params: {
          burstCount: 3,
          burstDelay: 100,
          bulletSpeed: 260,
          bulletSprite: 'bullet_flame',
          bulletColor: 0xff6633,
          bulletSize: 6,
        },
        duration: 1200,
      },
      {
        type: 'rotating_fan',
        params: {
          bulletCount: 9,
          spreadAngle: 90,
          bulletSpeed: 180,
          rotationSpeed: 40,
          bulletSprite: 'bullet_flame',
          bulletColor: 0xff4422,
          bulletSize: 6,
        },
        duration: 2500,
      },
      {
        type: 'aimed_burst',
        params: {
          burstCount: 3,
          burstDelay: 90,
          bulletSpeed: 270,
          bulletSprite: 'bullet_flame',
          bulletColor: 0xff6633,
          bulletSize: 6,
        },
        duration: 1000,
      },
      {
        type: 'rotating_fan',
        params: {
          bulletCount: 9,
          spreadAngle: 90,
          bulletSpeed: 190,
          rotationSpeed: -40,
          bulletSprite: 'bullet_flame',
          bulletColor: 0xff4422,
          bulletSize: 6,
        },
        duration: 2500,
      },
    ],
  },

  // Phase 2 - Firestorm
  {
    name: 'Firestorm',
    health: 450,
    patterns: [
      {
        type: 'spiral',
        params: {
          arms: 2,
          bulletSpeed: 150,
          rotationSpeed: 60,
          fireRate: 80,
          bulletSprite: 'bullet_flame',
          bulletColor: 0xff5500,
          bulletSize: 5,
        },
        duration: 3000,
      },
      {
        type: 'aimed_predict',
        params: {
          burstCount: 3,
          burstDelay: 100,
          bulletSpeed: 240,
          prediction: true,
          bulletSprite: 'bullet_flame',
          bulletColor: 0xffaa00,
          bulletSize: 6,
        },
        duration: 1500,
      },
      {
        type: 'flame_trail',
        params: {
          bulletSpeed: 60,
          bulletCount: 8,
          lingerTime: 4000,
          bulletSprite: 'bullet_flame_linger',
          bulletColor: 0xff3300,
          bulletSize: 8,
        },
        duration: 2500,
      },
      {
        type: 'spiral',
        params: {
          arms: 2,
          bulletSpeed: 160,
          rotationSpeed: -55,
          fireRate: 75,
          bulletSprite: 'bullet_flame',
          bulletColor: 0xff5500,
          bulletSize: 5,
        },
        duration: 2500,
      },
    ],
  },

  // Phase 3 - Inferno
  {
    name: 'Inferno',
    health: 500,
    patterns: [
      {
        type: 'spiral',
        params: {
          arms: 3,
          bulletSpeed: 160,
          rotationSpeed: 50,
          fireRate: 70,
          bulletSprite: 'bullet_flame',
          bulletColor: 0xff4400,
          bulletSize: 5,
        },
        duration: 2500,
      },
      {
        type: 'aimed_burst',
        params: {
          burstCount: 4,
          burstDelay: 80,
          bulletSpeed: 280,
          bulletSprite: 'bullet_flame',
          bulletColor: 0xffcc00,
          bulletSize: 5,
        },
        duration: 1200,
      },
      {
        type: 'radial_safe_lane',
        params: {
          bulletCount: 28,
          bulletSpeed: 140,
          safeCount: 3,
          bulletSprite: 'bullet_flame',
          bulletColor: 0xff2200,
          bulletSize: 5,
        },
        duration: 2000,
      },
      {
        type: 'flame_trail',
        params: {
          bulletSpeed: 70,
          bulletCount: 12,
          lingerTime: 3500,
          bulletSprite: 'bullet_flame_linger',
          bulletColor: 0xff3300,
          bulletSize: 8,
        },
        duration: 2200,
      },
      {
        type: 'radial_burst',
        params: {
          bulletCount: 24,
          bulletSpeed: 170,
          bulletSprite: 'bullet_flame',
          bulletColor: 0xff5500,
          bulletSize: 5,
          angleOffset: 7,
        },
        duration: 1600,
      },
    ],
  },

  // Phase 4 - Final Blaze
  {
    name: 'Final Blaze',
    health: 250,
    patterns: [
      {
        type: 'aimed_burst',
        params: {
          burstCount: 5,
          burstDelay: 60,
          bulletSpeed: 300,
          bulletSprite: 'bullet_flame',
          bulletColor: 0xffdd00,
          bulletSize: 5,
        },
        duration: 900,
      },
      {
        type: 'radial_burst',
        params: {
          bulletCount: 20,
          bulletSpeed: 200,
          bulletSprite: 'bullet_flame',
          bulletColor: 0xff4400,
          bulletSize: 5,
        },
        duration: 800,
      },
      {
        type: 'aimed_burst',
        params: {
          burstCount: 4,
          burstDelay: 70,
          bulletSpeed: 310,
          bulletSprite: 'bullet_flame',
          bulletColor: 0xffdd00,
          bulletSize: 5,
        },
        duration: 800,
      },
      {
        type: 'radial_burst',
        params: {
          bulletCount: 24,
          bulletSpeed: 210,
          bulletSprite: 'bullet_flame',
          bulletColor: 0xff3300,
          bulletSize: 5,
          angleOffset: 7.5,
        },
        duration: 800,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Boss 3 - Void Empress (hard)
// ---------------------------------------------------------------------------

const voidEmpressPhases: BossPhase[] = [
  // Phase 1 - Gravity Well
  {
    name: 'Gravity Well',
    health: 500,
    patterns: [
      {
        type: 'orbital',
        params: {
          bulletCount: 16,
          bulletSpeed: 130,
          curveStrength: 40,
          bulletSprite: 'bullet_void',
          bulletColor: 0xaa44ff,
          bulletSize: 6,
        },
        duration: 2200,
      },
      {
        type: 'gravity_point',
        params: {
          gravityX: 350,
          gravityY: 200,
          gravityStrength: 80,
          gravityDuration: 3000,
          bulletSprite: 'bullet_void',
          bulletColor: 0x8800ff,
          bulletSize: 10,
          isGravitySource: true,
        },
        duration: 800,
      },
      {
        type: 'radial_burst',
        params: {
          bulletCount: 18,
          bulletSpeed: 140,
          bulletSprite: 'bullet_void',
          bulletColor: 0xcc66ff,
          bulletSize: 5,
        },
        duration: 1800,
      },
      {
        type: 'radial_multi_source',
        params: {
          sources: 2,
          bulletCount: 10,
          bulletSpeed: 130,
          sourceOffsetY: 100,
          bulletSprite: 'bullet_void',
          bulletColor: 0xbb55ff,
          bulletSize: 5,
        },
        duration: 2400,
      },
      {
        type: 'orbital',
        params: {
          bulletCount: 14,
          bulletSpeed: 140,
          curveStrength: -35,
          bulletSprite: 'bullet_void',
          bulletColor: 0xaa44ff,
          bulletSize: 6,
        },
        duration: 2000,
      },
    ],
  },

  // Phase 2 - Event Horizon
  {
    name: 'Event Horizon',
    health: 550,
    patterns: [
      {
        type: 'spiral',
        params: {
          arms: 3,
          bulletSpeed: 140,
          rotationSpeed: 45,
          fireRate: 70,
          curveStrength: 20,
          bulletSprite: 'bullet_void',
          bulletColor: 0x9933ff,
          bulletSize: 5,
        },
        duration: 3000,
      },
      {
        type: 'radial_multi_source',
        params: {
          sources: 3,
          bulletCount: 12,
          bulletSpeed: 150,
          sourceOffsetY: 80,
          bulletSprite: 'bullet_void',
          bulletColor: 0xcc66ff,
          bulletSize: 5,
        },
        duration: 2200,
      },
      {
        type: 'speed_layer',
        params: {
          bulletCountFast: 8,
          bulletCountSlow: 16,
          fastSpeed: 220,
          slowSpeed: 90,
          bulletSprite: 'bullet_void',
          bulletColorFast: 0xff66ff,
          bulletColorSlow: 0x7722cc,
          bulletSize: 5,
        },
        duration: 2000,
      },
      {
        type: 'gravity_point',
        params: {
          gravityX: 300,
          gravityY: 300,
          gravityStrength: 90,
          gravityDuration: 3500,
          bulletSprite: 'bullet_void',
          bulletColor: 0x8800ff,
          bulletSize: 10,
          isGravitySource: true,
        },
        duration: 800,
      },
      {
        type: 'spiral',
        params: {
          arms: 2,
          bulletSpeed: 150,
          rotationSpeed: -50,
          fireRate: 65,
          curveStrength: 25,
          bulletSprite: 'bullet_void',
          bulletColor: 0xaa44ff,
          bulletSize: 5,
        },
        duration: 2500,
      },
    ],
  },

  // Phase 3 - Singularity
  {
    name: 'Singularity',
    health: 600,
    patterns: [
      {
        type: 'orbital',
        params: {
          bulletCount: 20,
          bulletSpeed: 150,
          curveStrength: 50,
          bulletSprite: 'bullet_void',
          bulletColor: 0xcc44ff,
          bulletSize: 5,
        },
        duration: 2000,
      },
      {
        type: 'gravity_point_moving',
        params: {
          gravityStrength: 100,
          gravityDuration: 4000,
          moveSpeed: 40,
          movePattern: 'sine',
          bulletSprite: 'bullet_void',
          bulletColor: 0x8800ff,
          bulletSize: 10,
          isGravitySource: true,
        },
        duration: 1000,
      },
      {
        type: 'spiral',
        params: {
          arms: 4,
          bulletSpeed: 145,
          rotationSpeed: 40,
          fireRate: 65,
          curveStrength: 30,
          bulletSprite: 'bullet_void',
          bulletColor: 0xaa44ff,
          bulletSize: 5,
        },
        duration: 2800,
      },
      {
        type: 'speed_layer',
        params: {
          bulletCountFast: 12,
          bulletCountSlow: 20,
          fastSpeed: 240,
          slowSpeed: 80,
          bulletSprite: 'bullet_void',
          bulletColorFast: 0xff44ff,
          bulletColorSlow: 0x6622aa,
          bulletSize: 5,
        },
        duration: 2000,
      },
      {
        type: 'radial_multi_source',
        params: {
          sources: 3,
          bulletCount: 14,
          bulletSpeed: 160,
          sourceOffsetY: 70,
          bulletSprite: 'bullet_void',
          bulletColor: 0xbb55ff,
          bulletSize: 5,
        },
        duration: 2200,
      },
      {
        type: 'gravity_point_moving',
        params: {
          gravityStrength: 110,
          gravityDuration: 3500,
          moveSpeed: 50,
          movePattern: 'circle',
          bulletSprite: 'bullet_void',
          bulletColor: 0x8800ff,
          bulletSize: 10,
          isGravitySource: true,
        },
        duration: 1000,
      },
    ],
  },

  // Phase 4 - Collapse
  {
    name: 'Collapse',
    health: 300,
    patterns: [
      {
        type: 'radial_burst',
        params: {
          bulletCount: 28,
          bulletSpeed: 200,
          bulletSprite: 'bullet_void',
          bulletColor: 0xff44ff,
          bulletSize: 5,
        },
        duration: 1000,
      },
      {
        type: 'aimed_burst',
        params: {
          burstCount: 5,
          burstDelay: 60,
          bulletSpeed: 300,
          bulletSprite: 'bullet_void',
          bulletColor: 0xffaaff,
          bulletSize: 5,
          showTell: true,
        },
        duration: 900,
      },
      {
        type: 'radial_burst',
        params: {
          bulletCount: 32,
          bulletSpeed: 190,
          bulletSprite: 'bullet_void',
          bulletColor: 0xcc22ff,
          bulletSize: 5,
          angleOffset: 5.6,
        },
        duration: 1000,
      },
      {
        type: 'spiral',
        params: {
          arms: 4,
          bulletSpeed: 170,
          rotationSpeed: 70,
          fireRate: 55,
          bulletSprite: 'bullet_void',
          bulletColor: 0xaa00ff,
          bulletSize: 5,
        },
        duration: 2000,
      },
      {
        type: 'aimed_burst',
        params: {
          burstCount: 4,
          burstDelay: 50,
          bulletSpeed: 320,
          bulletSprite: 'bullet_void',
          bulletColor: 0xffaaff,
          bulletSize: 5,
          showTell: true,
        },
        duration: 800,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Registry & lookup
// ---------------------------------------------------------------------------

const bossPhaseMap: Record<string, BossPhase[]> = {
  boss1: prismWardenPhases,
  boss2: scarletTempestPhases,
  boss3: voidEmpressPhases,
};

/**
 * Return the full phase array for a boss by its id.
 * Throws if the id is unknown so callers get an immediate failure instead of
 * silent undefined behaviour.
 */
export function getBossPhases(bossId: string): BossPhase[] {
  const phases = bossPhaseMap[bossId];
  if (!phases) {
    throw new Error(`Unknown boss id: "${bossId}"`);
  }
  return phases;
}

export { prismWardenPhases, scarletTempestPhases, voidEmpressPhases };
