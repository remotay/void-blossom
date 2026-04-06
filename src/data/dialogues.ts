// dialogues.ts - Touhou-style pre-boss dialogue scripts
// Each boss encounter has a short witty exchange between Rei and the boss.

export interface DialogueLine {
  speaker: 'player' | 'boss';
  name: string;
  text: string;
  portrait: string; // texture key for the portrait
}

export interface BossDialogue {
  bossId: string;
  prelude: DialogueLine[];
}

// ---------------------------------------------------------------------------
// Boss 1 - Prism Warden
// Elegant, condescending, speaks in light/crystal metaphors.
// Rei is straightforward and unimpressed. Stage 1 energy.
// ---------------------------------------------------------------------------

const boss1Dialogue: BossDialogue = {
  bossId: 'boss1',
  prelude: [
    {
      speaker: 'boss',
      name: 'Prism Warden',
      text: 'Another moth drawn to the light. How terribly predictable.',
      portrait: 'portrait_boss1',
    },
    {
      speaker: 'player',
      name: 'Rei',
      text: "I'm investigating the distortions in this area. You wouldn't happen to know anything about that, would you?",
      portrait: 'portrait_player',
    },
    {
      speaker: 'boss',
      name: 'Prism Warden',
      text: 'Know about it? Dear child, I am the refraction. Every shard of light here bends to my will.',
      portrait: 'portrait_boss1',
    },
    {
      speaker: 'player',
      name: 'Rei',
      text: "Great. A crystal enthusiast with a superiority complex. Just what I needed today.",
      portrait: 'portrait_player',
    },
    {
      speaker: 'boss',
      name: 'Prism Warden',
      text: 'Such insolence. Let me show you what happens when light decides to cut.',
      portrait: 'portrait_boss1',
    },
    {
      speaker: 'player',
      name: 'Rei',
      text: "I've shattered prettier things than you before breakfast. Let's go.",
      portrait: 'portrait_player',
    },
  ],
};

// ---------------------------------------------------------------------------
// Boss 2 - Scarlet Tempest
// Fiery, aggressive, competitive. Rei is bolder and more sarcastic.
// Mid-game confrontational energy.
// ---------------------------------------------------------------------------

const boss2Dialogue: BossDialogue = {
  bossId: 'boss2',
  prelude: [
    {
      speaker: 'boss',
      name: 'Scarlet Tempest',
      text: "Ha! You actually made it past that glass doll? Maybe you're worth burning after all!",
      portrait: 'portrait_boss2',
    },
    {
      speaker: 'player',
      name: 'Rei',
      text: "You sound excited. Don't tell me you've been waiting for me.",
      portrait: 'portrait_player',
    },
    {
      speaker: 'boss',
      name: 'Scarlet Tempest',
      text: "Waiting? I've been BORED. Nothing around here fights back. You'd better not disappoint me!",
      portrait: 'portrait_boss2',
    },
    {
      speaker: 'player',
      name: 'Rei',
      text: "Sorry, I don't take requests. I'm just here to put out whatever fire you started.",
      portrait: 'portrait_player',
    },
    {
      speaker: 'boss',
      name: 'Scarlet Tempest',
      text: "Put out MY fire? Girl, I AM the fire. The sky burns because I told it to!",
      portrait: 'portrait_boss2',
    },
    {
      speaker: 'player',
      name: 'Rei',
      text: "Funny. The last youkai who said something like that is now a cautionary tale at the shrine.",
      portrait: 'portrait_player',
    },
    {
      speaker: 'boss',
      name: 'Scarlet Tempest',
      text: "Then let's make this a story worth telling! Come on, shrine maiden -- BURN WITH ME!",
      portrait: 'portrait_boss2',
    },
  ],
};

// ---------------------------------------------------------------------------
// Boss 3 - Void Empress
// Regal, mysterious, cosmic. Rei is determined, acknowledges the real threat.
// Final boss gravitas.
// ---------------------------------------------------------------------------

const boss3Dialogue: BossDialogue = {
  bossId: 'boss3',
  prelude: [
    {
      speaker: 'boss',
      name: 'Void Empress',
      text: 'So the little star that refused to dim has reached my domain at last.',
      portrait: 'portrait_boss3',
    },
    {
      speaker: 'player',
      name: 'Rei',
      text: "You're the one behind all of this -- the distortions, the barrier collapse, everything.",
      portrait: 'portrait_player',
    },
    {
      speaker: 'boss',
      name: 'Void Empress',
      text: '"Behind" it? How quaint. I am not behind the void. I am where all things arrive when light gives up.',
      portrait: 'portrait_boss3',
    },
    {
      speaker: 'player',
      name: 'Rei',
      text: "I've heard that kind of talk before. Cosmic grandeur, inevitable darkness, the whole routine.",
      portrait: 'portrait_player',
    },
    {
      speaker: 'boss',
      name: 'Void Empress',
      text: 'Yet here you tremble. Your barrier charms flicker. Even your gods avert their gaze from this place.',
      portrait: 'portrait_boss3',
    },
    {
      speaker: 'player',
      name: 'Rei',
      text: "...You're right that this feels different. The air itself is wrong here. But that just means I can't afford to lose.",
      portrait: 'portrait_player',
    },
    {
      speaker: 'boss',
      name: 'Void Empress',
      text: 'Determination in the face of oblivion. How exquisitely mortal. Very well -- show me what a fleeting life clings to.',
      portrait: 'portrait_boss3',
    },
    {
      speaker: 'player',
      name: 'Rei',
      text: "I'll show you exactly what it clings to. Everything. Now stand aside or get sealed.",
      portrait: 'portrait_player',
    },
  ],
};

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export const bossDialogues: BossDialogue[] = [
  boss1Dialogue,
  boss2Dialogue,
  boss3Dialogue,
];

export function getDialogue(bossId: string): BossDialogue | undefined {
  return bossDialogues.find((d) => d.bossId === bossId);
}
