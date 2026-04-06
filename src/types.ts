// Stage metadata
export interface StageData {
  id: string;
  name: string;
  teachingGoal: string;
  difficulty: 'easy' | 'easy-medium' | 'medium' | 'medium-hard' | 'hard';
  bgKey: string;
  bgColor: number;
  waves: WaveData[];
  boss: BossData;
}

// Wave scripting
export interface WaveData {
  time: number; // ms from stage start
  enemies: EnemySpawnData[];
  isBoss?: boolean;
}

export interface EnemySpawnData {
  type: EnemyType;
  x: number;
  y: number;
  path?: PathData;
  firePattern?: string;
  health?: number;
  delay?: number;
}

export type EnemyType = 'grunt' | 'swooper' | 'turret' | 'spinner' | 'carrier' | 'miniboss';

export interface PathData {
  type: 'linear' | 'sine' | 'circle' | 'bezier' | 'hover';
  speed?: number;
  amplitude?: number;
  frequency?: number;
  points?: { x: number; y: number }[];
  hoverX?: number;
  hoverY?: number;
  hoverTime?: number;
}

// Boss metadata
export interface BossData {
  id: string;
  name: string;
  visualTheme: string;
  signatureMechanic: string;
  difficulty: 'easy' | 'easy-medium' | 'medium' | 'medium-hard' | 'hard';
  phases: BossPhase[];
}

export interface BossPhase {
  name: string;
  health: number;
  patterns: BossPattern[];
  timeout?: number;
}

export interface BossPattern {
  type: string;
  params: Record<string, number | string | boolean>;
  duration?: number;
  repeat?: number;
}

// Bullet definition
export interface BulletConfig {
  sprite: string;
  speed: number;
  angle: number;
  accel?: number;
  angularVel?: number;
  damage?: number;
  size?: number;
  color?: number;
}

// Player state
export interface PlayerState {
  lives: number;
  bombs: number;
  score: number;
  power: number;
  graze: number;
  continues: number;
}

// Pickup types
export type PickupType = 'power' | 'point' | 'life' | 'bomb';
