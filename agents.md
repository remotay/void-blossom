# Project goal

Build a polished browser-based 2D horizontal bullet-hell shooter with a modern anime-inspired visual style, crisp effects, satisfying sound design, and responsive gameplay.

The game should feel like a modern commercial-quality 2D danmaku shooter:
- highly readable bullet patterns
- slick visual effects
- responsive player movement
- strong game feel
- polished UI and transitions
- escalating stage design
- memorable bosses with multiple phases

Use Touhou only as inspiration for readability, pacing, density, and boss-driven bullet-hell structure. Extremely high production value / quality is key.

## Tech requirements

- Build for the browser
- Use Phaser 3 + TypeScript + Vite
- No backend
- All gameplay must run locally in the browser
- Keep code modular and readable
- Optimize for smooth play and responsive controls

## Product standard

This must feel like a real polished indie game prototype, not a tech demo.
Prioritize quality over scope.
A smaller, better game is preferred over a larger, sloppy one.

## Scope

Build a complete polished game with:
- title screen
- main menu
- options menu
- pause menu
- stage intro flow
- 3 full stages
- stage clear flow
- game over / continue flow
- ending / victory screen

Each stage must have:
- distinct visual identity
- distinct enemy wave structure
- a miniboss or major mid-stage encounter
- a final boss with multiple phases
- increasing difficulty from the previous stage

## Asset pipeline is mandatory

All major assets must be created by Codex and integrated automatically.

Do not rely on hand-made external assets.
Do not expect the user to create or source art manually.

Codex must build an asset-generation workflow inside the repo.

Preferred asset workflow:
1. Build a repeatable asset generation pipeline
2. Generate all gameplay art through scripts or model-driven asset creation
3. Save final game-ready assets into the repo
4. Wire those assets into the game automatically

Required visual assets:
- player character / ship sprite set
- player shot sprites
- enemy sprites for multiple enemy classes
- miniboss sprite
- 3 boss sprite sets
- enemy bullets and bullet variants
- explosion effects
- hit sparks
- graze effect
- pickups
- UI frames, bars, icons, buttons
- title screen background
- stage backgrounds / scrolling layers
- boss portraits or boss cut-in style art if practical

Art direction requirements:
- modern anime-inspired 2D look
- crisp silhouettes
- cohesive palette and rendering style
- visually impressive but readable
- bullets must always stand out against backgrounds
- effects should feel sleek, not noisy
- avoid generic placeholder geometry unless it is temporary during build
- final result should not look like programmer art

## Audio requirements

Create satisfying audio feedback.
If full music is not practical, prioritize excellent sound effects.

Required sound categories:
- player shot
- enemy shot
- hit
- graze
- pickup
- bomb
- explosion
- boss phase transition
- warning
- UI confirm / cancel
- player death
- continue
- stage clear

Audio style:
- clean
- punchy
- arcade-like
- modern and satisfying
- avoid harsh clipping or annoying repetition

## Gameplay requirements

Core player systems:
- smooth movement
- focus mode for precision movement
- responsive shooting
- visible or clearly readable hitbox
- lives
- bombs / panic mechanic
- graze mechanic
- score
- power progression
- pickups
- death / respawn flow
- continue system

Combat systems:
- multiple enemy archetypes
- multiple bullet pattern archetypes
- aimed shots
- spreads
- streams
- radial bursts
- phase-based boss patterns
- stage scripting with intentional pacing

## Game feel requirements

Game feel matters as much as raw functionality.

Movement must feel:
- precise
- responsive
- smooth
- low-friction

Feedback must feel:
- punchy
- immediate
- readable
- rewarding

Required feedback:
- clear damage and death feedback
- satisfying shot impacts
- visible pickup collection feedback
- polished boss arrival and phase transition moments
- strong screen shake only when appropriate
- tasteful particle and shader usage
- no excessive visual clutter

## Stage design rules

Stage metadata is mandatory.

Every stage definition must include:
- id
- name
- teachingGoal
- difficulty

difficulty must be one of:
- easy
- easy-medium
- medium
- medium-hard
- hard

teachingGoal must explain why the stage exists and what it teaches or reinforces.

Stage structure:
- Stage 1 teaches movement, focus, and basic pattern reading
- Stage 2 increases enemy pressure, aimed fire, and spatial density
- Stage 3 combines previous ideas into a polished final challenge

No filler stages.
No random wave sequencing.
Each stage must have a coherent identity and pacing arc.

## Boss design rules

Every boss must have:
- a distinct visual identity
- multiple phases
- increasing tension across the fight
- readable but threatening bullet patterns
- at least one memorable signature pattern
- clear transitions and audiovisual feedback

Boss metadata is mandatory.

Every boss must include:
- id
- name
- visualTheme
- signatureMechanic
- difficulty

## UX rules

- menus must look intentional and polished
- UI must be clean and legible
- bullets must remain readable at all times
- player state must be obvious
- stage starts, boss warnings, and clears must feel polished
- options should allow audio volume adjustment
- the game should be enjoyable on a normal desktop browser window
- avoid cluttered HUD design

## Engineering rules

- separate gameplay logic from rendering where practical
- separate asset generation from game runtime code
- keep stage data and boss data in clear editable files
- comment key systems
- no core TODOs
- run the game and fix errors before stopping
- revise weak content instead of leaving it in place

## Acceptance criteria

The project is only complete if:
- npm install works
- npm run dev works
- the game is fully playable in the browser
- all 3 stages are implemented
- every stage has metadata
- every boss has metadata
- final gameplay assets are present and integrated
- the controls feel responsive
- the presentation feels polished
- the difficulty escalates cleanly
- the result does not feel like placeholder content