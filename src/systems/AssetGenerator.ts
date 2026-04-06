// AssetGenerator.ts - Procedural sprite generation for Void Blossom
// Generates all game textures at runtime using Phaser's Graphics API
// Touhou-inspired aesthetic: magical, ethereal, anime-influenced

export class AssetGenerator {
  // ── Utility helpers ──────────────────────────────────────────────

  /** Draw a soft glow circle (additive look): dim outer ring fading to bright center */
  private static glowCircle(
    g: Phaser.GameObjects.Graphics,
    cx: number,
    cy: number,
    radius: number,
    color: number,
    layers = 5,
    centerAlpha = 1,
  ) {
    for (let i = layers; i >= 0; i--) {
      const t = i / layers;
      const r = radius * (0.4 + 0.6 * t);
      const a = centerAlpha * (1 - t * 0.85);
      g.fillStyle(color, a);
      g.fillCircle(cx, cy, r);
    }
  }

  /** Draw a soft glow ellipse */
  private static glowEllipse(
    g: Phaser.GameObjects.Graphics,
    cx: number,
    cy: number,
    w: number,
    h: number,
    color: number,
    layers = 5,
    centerAlpha = 1,
  ) {
    for (let i = layers; i >= 0; i--) {
      const t = i / layers;
      const sw = w * (0.4 + 0.6 * t);
      const sh = h * (0.4 + 0.6 * t);
      const a = centerAlpha * (1 - t * 0.85);
      g.fillStyle(color, a);
      g.fillEllipse(cx, cy, sw, sh);
    }
  }

  /** Interpolate two hex colors */
  private static lerpColor(a: number, b: number, t: number): number {
    const ar = (a >> 16) & 0xff, ag = (a >> 8) & 0xff, ab = a & 0xff;
    const br = (b >> 16) & 0xff, bg = (b >> 8) & 0xff, bb = b & 0xff;
    const rr = Math.round(ar + (br - ar) * t);
    const rg = Math.round(ag + (bg - ag) * t);
    const rb = Math.round(ab + (bb - ab) * t);
    return (rr << 16) | (rg << 8) | rb;
  }

  private static makeGfx(scene: Phaser.Scene): Phaser.GameObjects.Graphics {
    return scene.make.graphics({ x: 0, y: 0, add: false } as any);
  }

  private static finish(
    g: Phaser.GameObjects.Graphics,
    key: string,
    w: number,
    h: number,
  ) {
    g.generateTexture(key, w, h);
    g.destroy();
  }

  /** Draw a Touhou-style glowing orb bullet: bright white center -> colored ring -> soft glow edge */
  private static touhouOrb(
    g: Phaser.GameObjects.Graphics,
    cx: number,
    cy: number,
    radius: number,
    color: number,
    highlightOffset = -1,
  ) {
    // Outermost soft glow
    g.fillStyle(color, 0.15);
    g.fillCircle(cx, cy, radius * 1.3);
    // Outer colored ring
    g.fillStyle(color, 0.35);
    g.fillCircle(cx, cy, radius);
    // Mid colored layer
    const midColor = this.lerpColor(color, 0xffffff, 0.3);
    g.fillStyle(midColor, 0.6);
    g.fillCircle(cx, cy, radius * 0.75);
    // Inner bright core
    const lightColor = this.lerpColor(color, 0xffffff, 0.6);
    g.fillStyle(lightColor, 0.85);
    g.fillCircle(cx, cy, radius * 0.5);
    // White hot center
    g.fillStyle(0xffffff, 0.95);
    g.fillCircle(cx, cy, radius * 0.25);
    // Highlight spot (specular)
    if (highlightOffset !== 0) {
      g.fillStyle(0xffffff, 0.7);
      g.fillCircle(cx + highlightOffset, cy + highlightOffset, radius * 0.15);
    }
  }

  /** Draw a small magical circle / spell circle pattern */
  private static spellCircle(
    g: Phaser.GameObjects.Graphics,
    cx: number,
    cy: number,
    radius: number,
    color: number,
    dotCount = 8,
    alpha = 0.7,
  ) {
    g.lineStyle(1, color, alpha * 0.6);
    g.strokeCircle(cx, cy, radius);
    g.fillStyle(color, alpha);
    for (let i = 0; i < dotCount; i++) {
      const a = (Math.PI * 2 / dotCount) * i;
      g.fillCircle(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius, 1);
    }
  }

  // ── Main entry point ─────────────────────────────────────────────

  static generateAll(scene: Phaser.Scene): void {
    this.generatePlayerAssets(scene);
    this.generateEnemyAssets(scene);
    this.generateBossAssets(scene);
    this.generateBulletAssets(scene);
    this.generateEffectAssets(scene);
    this.generatePickupAssets(scene);
    this.generateUIAssets(scene);
    this.generateBackgrounds(scene);
  }

  // ── PLAYER ASSETS ────────────────────────────────────────────────

  private static generatePlayerAssets(scene: Phaser.Scene): void {
    // ─ player ─ anime-style character silhouette facing right, 48x32
    {
      const W = 48, H = 32;
      const g = this.makeGfx(scene);
      const cx = W / 2, cy = H / 2;

      // Magical aura behind character
      this.glowEllipse(g, cx, cy, 30, 18, 0x4488ff, 4, 0.2);

      // Flowing dress/skirt - triangular shape extending back (left)
      g.fillStyle(0x8888cc, 0.6);
      g.fillTriangle(cx - 6, cy + 2, cx - 18, cy + 10, cx - 14, cy - 2);
      g.fillStyle(0x9999dd, 0.5);
      g.fillTriangle(cx - 8, cy + 4, cx - 22, cy + 14, cx - 16, cy);

      // Body (small torso)
      g.fillStyle(0xddeeff, 0.95);
      g.fillEllipse(cx, cy, 8, 12);

      // Head
      g.fillStyle(0xeef4ff, 1);
      g.fillCircle(cx + 4, cy - 6, 5);

      // Hair flowing back (left) - multiple strands
      g.fillStyle(0x6666bb, 0.9);
      g.fillTriangle(cx + 2, cy - 10, cx - 10, cy - 12, cx - 4, cy - 4);
      g.fillTriangle(cx + 1, cy - 8, cx - 14, cy - 8, cx - 6, cy - 2);
      g.fillTriangle(cx, cy - 6, cx - 16, cy - 4, cx - 8, cy + 2);
      // Extra long hair strand
      g.fillStyle(0x5555aa, 0.7);
      g.fillTriangle(cx - 2, cy - 4, cx - 20, cy + 2, cx - 10, cy + 4);

      // Small arm reaching forward
      g.fillStyle(0xddeeff, 0.8);
      g.fillEllipse(cx + 10, cy - 1, 8, 3);

      // Tiny magical wings (ethereal, translucent)
      // Upper wing
      g.fillStyle(0x88ccff, 0.4);
      g.fillTriangle(cx - 2, cy - 4, cx - 10, cy - 14, cx + 2, cy - 8);
      g.fillStyle(0xaaddff, 0.3);
      g.fillTriangle(cx - 4, cy - 6, cx - 14, cy - 16, cx, cy - 10);
      // Lower wing
      g.fillStyle(0x88ccff, 0.4);
      g.fillTriangle(cx - 2, cy + 2, cx - 10, cy + 10, cx + 2, cy + 6);
      g.fillStyle(0xaaddff, 0.3);
      g.fillTriangle(cx - 4, cy + 4, cx - 14, cy + 14, cx, cy + 8);

      // Wing sparkle dots
      g.fillStyle(0xffffff, 0.8);
      g.fillCircle(cx - 8, cy - 12, 1);
      g.fillCircle(cx - 12, cy - 10, 0.8);
      g.fillCircle(cx - 8, cy + 8, 1);

      // Magic glow at hand position (forward)
      this.glowCircle(g, cx + 14, cy - 1, 4, 0x44ddff, 3, 0.5);
      g.fillStyle(0xffffff, 0.9);
      g.fillCircle(cx + 14, cy - 1, 1.5);

      // Eye dot
      g.fillStyle(0x4488ff, 1);
      g.fillCircle(cx + 7, cy - 7, 1);

      this.finish(g, 'player', W, H);
    }

    // ─ player_focus ─ magical spell circle hitbox indicator, 16x16
    {
      const S = 16;
      const g = this.makeGfx(scene);
      const c = S / 2;

      // Outer spell circle glow
      this.glowCircle(g, c, c, 7, 0x00ccff, 5, 0.4);

      // Outer ring
      g.lineStyle(1, 0x88eeff, 0.7);
      g.strokeCircle(c, c, 6);

      // Inner ring
      g.lineStyle(1, 0xaaf0ff, 0.5);
      g.strokeCircle(c, c, 4);

      // Mandala dots on outer ring
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 / 8) * i;
        g.fillStyle(0xffffff, 0.8);
        g.fillCircle(c + Math.cos(a) * 6, c + Math.sin(a) * 6, 0.8);
      }

      // Cross lines inside
      g.lineStyle(1, 0xccffff, 0.3);
      g.lineBetween(c - 3, c, c + 3, c);
      g.lineBetween(c, c - 3, c, c + 3);

      // Bright white center (the actual hitbox point)
      g.fillStyle(0xffffff, 1);
      g.fillCircle(c, c, 2.5);
      g.fillStyle(0x88eeff, 0.8);
      g.fillCircle(c, c, 1.5);

      this.finish(g, 'player_focus', S, S);
    }

    // ─ player_shot ─ magical crescent projectile, 20x6, cyan/white
    {
      const W = 20, H = 6;
      const g = this.makeGfx(scene);
      const cy = H / 2;

      // Outer magical glow trail
      g.fillStyle(0x00aaff, 0.2);
      g.fillEllipse(W / 2 - 2, cy, W + 4, H + 2);

      // Crescent shape - tapered energy projectile
      g.fillStyle(0x44ccff, 0.6);
      g.fillEllipse(W / 2, cy, W, H);

      // Inner bright crescent
      g.fillStyle(0x88eeff, 0.85);
      g.fillEllipse(W / 2 + 2, cy, W - 6, H - 2);

      // Hot white core, forward-biased
      g.fillStyle(0xeeffff, 1);
      g.fillEllipse(W / 2 + 4, cy, W - 12, 2);
      g.fillStyle(0xffffff, 0.9);
      g.fillEllipse(W / 2 + 5, cy, 6, 1.5);

      // Tiny sparkle at tip
      g.fillStyle(0xffffff, 0.7);
      g.fillCircle(W - 2, cy, 1);

      this.finish(g, 'player_shot', W, H);
    }

    // ─ player_shot_power ─ wider magical crescent, 24x10
    {
      const W = 24, H = 10;
      const g = this.makeGfx(scene);
      const cy = H / 2;

      // Outer mystical glow
      g.fillStyle(0x2288ff, 0.15);
      g.fillEllipse(W / 2, cy, W + 6, H + 4);

      // Crescent body with color gradient layers
      g.fillStyle(0x3399ff, 0.5);
      g.fillEllipse(W / 2, cy, W, H);
      g.fillStyle(0x55bbff, 0.7);
      g.fillEllipse(W / 2 + 1, cy, W - 4, H - 2);
      g.fillStyle(0x88ddff, 0.85);
      g.fillEllipse(W / 2 + 2, cy, W - 8, H - 4);

      // Bright core line
      g.fillStyle(0xccf0ff, 1);
      g.fillEllipse(W / 2 + 3, cy, W - 14, 2.5);
      g.fillStyle(0xffffff, 0.95);
      g.fillEllipse(W / 2 + 5, cy, 8, 1.5);

      // Magical sparkle trail dots
      g.fillStyle(0xffffff, 0.5);
      g.fillCircle(4, cy - 2, 0.8);
      g.fillCircle(6, cy + 2, 0.6);
      g.fillCircle(2, cy, 0.7);

      // Tip sparkle
      g.fillStyle(0xffffff, 0.8);
      g.fillCircle(W - 2, cy, 1.2);

      this.finish(g, 'player_shot_power', W, H);
    }
  }

  // ── ENEMY ASSETS ─────────────────────────────────────────────────

  private static generateEnemyAssets(scene: Phaser.Scene): void {
    // ─ enemy_grunt ─ fairy-like enemy, 24x24, red/orange tint
    {
      const S = 24;
      const g = this.makeGfx(scene);
      const c = S / 2;

      // Soft aura
      this.glowCircle(g, c, c, 12, 0xff4422, 4, 0.15);

      // Tiny wings (left and right of body)
      g.fillStyle(0xff8866, 0.5);
      g.fillTriangle(c - 4, c - 2, c - 11, c - 8, c - 6, c + 2);
      g.fillTriangle(c + 4, c - 2, c + 11, c - 8, c + 6, c + 2);
      // Lower wings
      g.fillStyle(0xff7755, 0.4);
      g.fillTriangle(c - 3, c + 1, c - 9, c + 4, c - 5, c + 6);
      g.fillTriangle(c + 3, c + 1, c + 9, c + 4, c + 5, c + 6);

      // Wing sparkle
      g.fillStyle(0xffccaa, 0.7);
      g.fillCircle(c - 9, c - 6, 1);
      g.fillCircle(c + 9, c - 6, 1);

      // Round fairy body
      g.fillStyle(0xff5533, 0.9);
      g.fillCircle(c, c, 5);

      // Head (slightly above center)
      g.fillStyle(0xffddcc, 0.95);
      g.fillCircle(c, c - 3, 3.5);

      // Hair tuft
      g.fillStyle(0xdd3322, 0.9);
      g.fillTriangle(c - 3, c - 5, c, c - 10, c + 1, c - 4);
      g.fillTriangle(c + 1, c - 5, c + 3, c - 9, c + 3, c - 3);

      // Eyes (tiny dots)
      g.fillStyle(0xff0000, 1);
      g.fillCircle(c - 1.5, c - 3.5, 0.8);
      g.fillCircle(c + 1.5, c - 3.5, 0.8);

      // Skirt/dress bottom
      g.fillStyle(0xee4422, 0.8);
      g.fillTriangle(c - 5, c + 1, c + 5, c + 1, c, c + 10);

      this.finish(g, 'enemy_grunt', S, S);
    }

    // ─ enemy_swooper ─ spirit/wisp shape, 28x20
    {
      const W = 28, H = 20;
      const g = this.makeGfx(scene);
      const cx = W / 2, cy = H / 2;

      // Ethereal trailing glow
      g.fillStyle(0xff6622, 0.1);
      g.fillEllipse(cx - 4, cy, W + 6, H + 2);

      // Wisp tail (trailing left)
      g.fillStyle(0xff5500, 0.25);
      g.fillEllipse(cx - 6, cy, 18, 8);
      g.fillStyle(0xff7733, 0.2);
      g.fillEllipse(cx - 10, cy, 12, 5);

      // Main spirit body - ghostly oval
      g.fillStyle(0xff8844, 0.7);
      g.fillEllipse(cx + 2, cy, 14, 12);

      // Inner glow
      g.fillStyle(0xffaa66, 0.8);
      g.fillEllipse(cx + 3, cy, 10, 8);

      // Face area
      g.fillStyle(0xffddbb, 0.9);
      g.fillEllipse(cx + 4, cy - 1, 7, 6);

      // Ghost eyes
      g.fillStyle(0xff2200, 1);
      g.fillCircle(cx + 2, cy - 2, 1.2);
      g.fillCircle(cx + 6, cy - 2, 1.2);

      // Wisp tendrils at bottom
      g.fillStyle(0xff6600, 0.3);
      g.fillTriangle(cx - 2, cy + 4, cx - 8, cy + 10, cx + 2, cy + 6);
      g.fillTriangle(cx + 4, cy + 4, cx + 1, cy + 9, cx + 7, cy + 6);

      // Bright core
      g.fillStyle(0xffffff, 0.5);
      g.fillCircle(cx + 4, cy, 2);

      this.finish(g, 'enemy_swooper', W, H);
    }

    // ─ enemy_turret ─ floating magical talisman/seal, 32x32
    {
      const S = 32;
      const g = this.makeGfx(scene);
      const c = S / 2;

      // Magical aura
      this.glowCircle(g, c, c, 16, 0xcc4422, 4, 0.15);

      // Octagonal talisman body
      g.fillStyle(0x881100, 0.9);
      const r = 13;
      for (let i = 0; i < 8; i++) {
        const a1 = (Math.PI / 4) * i - Math.PI / 8;
        const a2 = (Math.PI / 4) * (i + 1) - Math.PI / 8;
        g.fillTriangle(
          c, c,
          c + Math.cos(a1) * r, c + Math.sin(a1) * r,
          c + Math.cos(a2) * r, c + Math.sin(a2) * r,
        );
      }

      // Inner octagon
      const ri = 9;
      g.fillStyle(0xcc3311, 0.8);
      for (let i = 0; i < 8; i++) {
        const a1 = (Math.PI / 4) * i - Math.PI / 8;
        const a2 = (Math.PI / 4) * (i + 1) - Math.PI / 8;
        g.fillTriangle(
          c, c,
          c + Math.cos(a1) * ri, c + Math.sin(a1) * ri,
          c + Math.cos(a2) * ri, c + Math.sin(a2) * ri,
        );
      }

      // Seal border lines
      g.lineStyle(1, 0xff8855, 0.6);
      for (let i = 0; i < 8; i++) {
        const a1 = (Math.PI / 4) * i - Math.PI / 8;
        const a2 = (Math.PI / 4) * (i + 1) - Math.PI / 8;
        g.lineBetween(
          c + Math.cos(a1) * r, c + Math.sin(a1) * r,
          c + Math.cos(a2) * r, c + Math.sin(a2) * r,
        );
      }

      // Inner magical pattern - cross and circle
      g.lineStyle(1, 0xffaa66, 0.5);
      g.strokeCircle(c, c, 7);
      g.lineBetween(c - 6, c, c + 6, c);
      g.lineBetween(c, c - 6, c, c + 6);

      // Diagonal lines of inner seal
      g.lineStyle(1, 0xff8844, 0.4);
      g.lineBetween(c - 4, c - 4, c + 4, c + 4);
      g.lineBetween(c - 4, c + 4, c + 4, c - 4);

      // Rune dots at corners
      g.fillStyle(0xffcc88, 0.8);
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI / 4) * i;
        g.fillCircle(c + Math.cos(a) * 10, c + Math.sin(a) * 10, 1.2);
      }

      // Center core - glowing eye
      g.fillStyle(0xff6633, 1);
      g.fillCircle(c, c, 3.5);
      g.fillStyle(0xffcc88, 0.9);
      g.fillCircle(c, c, 2);
      g.fillStyle(0xffffff, 0.7);
      g.fillCircle(c, c, 1);

      this.finish(g, 'enemy_turret', S, S);
    }

    // ─ enemy_spinner ─ rotating mandala/flower pattern, 28x28
    {
      const S = 28;
      const g = this.makeGfx(scene);
      const c = S / 2;

      // Outer glow
      this.glowCircle(g, c, c, 14, 0xff5500, 4, 0.12);

      // Flower petals (6)
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i;
        const px = c + Math.cos(a) * 7;
        const py = c + Math.sin(a) * 7;
        g.fillStyle(0xdd4422, 0.7);
        g.fillEllipse(px, py, 8, 5);
      }

      // Inner flower petals (rotated 30 degrees)
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i + Math.PI / 6;
        const px = c + Math.cos(a) * 5;
        const py = c + Math.sin(a) * 5;
        g.fillStyle(0xff6644, 0.6);
        g.fillEllipse(px, py, 6, 3.5);
      }

      // Outer ring connecting petals
      g.lineStyle(1, 0xff8855, 0.5);
      g.strokeCircle(c, c, 11);

      // Inner ring
      g.lineStyle(1, 0xffaa77, 0.6);
      g.strokeCircle(c, c, 6);

      // Petal tip dots
      g.fillStyle(0xffcc88, 0.8);
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i;
        g.fillCircle(c + Math.cos(a) * 11, c + Math.sin(a) * 11, 1.5);
      }

      // Center mandala core
      g.fillStyle(0xff8844, 1);
      g.fillCircle(c, c, 4);
      g.fillStyle(0xffcc88, 0.9);
      g.fillCircle(c, c, 2.5);
      g.fillStyle(0xffffff, 0.7);
      g.fillCircle(c, c, 1);

      this.finish(g, 'enemy_spinner', S, S);
    }

    // ─ enemy_carrier ─ floating shrine gate / yokai shape, 48x36
    {
      const W = 48, H = 36;
      const g = this.makeGfx(scene);
      const cx = W / 2, cy = H / 2;

      // Mystical aura
      this.glowEllipse(g, cx, cy, 40, 28, 0x991100, 4, 0.15);

      // Torii gate top beam
      g.fillStyle(0xaa2211, 0.9);
      g.fillRect(4, cy - 12, W - 8, 5);
      // Secondary beam
      g.fillStyle(0x881100, 0.8);
      g.fillRect(8, cy - 6, W - 16, 3);

      // Torii pillars
      g.fillStyle(0xcc3322, 0.9);
      g.fillRect(10, cy - 10, 4, 22);
      g.fillRect(W - 14, cy - 10, 4, 22);

      // Roof overhang (curved effect with triangles)
      g.fillStyle(0x991111, 0.8);
      g.fillTriangle(0, cy - 10, 6, cy - 14, 12, cy - 10);
      g.fillTriangle(W, cy - 10, W - 6, cy - 14, W - 12, cy - 10);

      // Hanging talisman papers
      g.fillStyle(0xffeecc, 0.6);
      g.fillRect(18, cy - 4, 3, 10);
      g.fillRect(27, cy - 4, 3, 12);
      g.fillRect(W - 21, cy - 4, 3, 10);

      // Central shrine orb
      this.glowCircle(g, cx, cy + 2, 6, 0xff4422, 3, 0.5);
      g.fillStyle(0xff8844, 1);
      g.fillCircle(cx, cy + 2, 3);
      g.fillStyle(0xffffff, 0.6);
      g.fillCircle(cx, cy + 1, 1.5);

      // Mystical floating runes/dots
      g.fillStyle(0xff6633, 0.4);
      g.fillCircle(cx - 10, cy + 10, 2);
      g.fillCircle(cx + 10, cy + 10, 2);
      g.fillCircle(cx, cy + 14, 1.5);

      // Ornate detail lines
      g.lineStyle(1, 0xff5533, 0.3);
      g.lineBetween(14, cy - 6, W - 14, cy - 6);

      this.finish(g, 'enemy_carrier', W, H);
    }

    // ─ enemy_miniboss ─ elaborate yokai character silhouette, 56x48
    {
      const W = 56, H = 48;
      const g = this.makeGfx(scene);
      const cx = W / 2, cy = H / 2;

      // Powerful magical aura
      this.glowCircle(g, cx, cy, 26, 0xff2200, 5, 0.15);
      this.glowCircle(g, cx, cy, 20, 0xff6600, 3, 0.1);

      // Large wings (spread wide)
      // Upper-left wing
      g.fillStyle(0xcc2211, 0.6);
      g.fillTriangle(cx - 4, cy - 6, cx - 24, cy - 22, cx + 4, cy - 14);
      g.fillStyle(0xdd3322, 0.5);
      g.fillTriangle(cx - 2, cy - 8, cx - 20, cy - 24, cx + 6, cy - 16);
      // Upper-right wing
      g.fillStyle(0xcc2211, 0.6);
      g.fillTriangle(cx + 4, cy - 6, cx + 24, cy - 22, cx - 4, cy - 14);
      g.fillStyle(0xdd3322, 0.5);
      g.fillTriangle(cx + 2, cy - 8, cx + 20, cy - 24, cx - 6, cy - 16);
      // Lower wings
      g.fillStyle(0xbb1100, 0.5);
      g.fillTriangle(cx - 4, cy + 2, cx - 20, cy + 14, cx + 2, cy + 8);
      g.fillTriangle(cx + 4, cy + 2, cx + 20, cy + 14, cx - 2, cy + 8);

      // Wing inner glow lines
      g.lineStyle(1, 0xff8855, 0.4);
      g.lineBetween(cx, cy - 8, cx - 18, cy - 20);
      g.lineBetween(cx, cy - 8, cx + 18, cy - 20);

      // Wing sparkle dots
      g.fillStyle(0xffaa66, 0.7);
      g.fillCircle(cx - 16, cy - 18, 1.5);
      g.fillCircle(cx + 16, cy - 18, 1.5);
      g.fillCircle(cx - 14, cy + 10, 1.2);
      g.fillCircle(cx + 14, cy + 10, 1.2);

      // Dress/robe body
      g.fillStyle(0xdd3322, 0.85);
      g.fillTriangle(cx - 10, cy + 2, cx + 10, cy + 2, cx, cy + 22);
      g.fillStyle(0xcc2211, 0.7);
      g.fillTriangle(cx - 8, cy + 4, cx + 8, cy + 4, cx - 2, cy + 20);

      // Torso
      g.fillStyle(0xffddcc, 0.8);
      g.fillEllipse(cx, cy - 2, 10, 12);

      // Head
      g.fillStyle(0xffeedd, 0.95);
      g.fillCircle(cx, cy - 10, 6);

      // Elaborate hair
      g.fillStyle(0x881100, 0.9);
      g.fillTriangle(cx - 5, cy - 14, cx + 1, cy - 20, cx + 5, cy - 12);
      g.fillTriangle(cx - 6, cy - 12, cx - 12, cy - 8, cx - 2, cy - 6);
      g.fillTriangle(cx + 4, cy - 14, cx + 10, cy - 16, cx + 6, cy - 8);
      // Side hair
      g.fillStyle(0x771100, 0.7);
      g.fillTriangle(cx - 6, cy - 10, cx - 14, cy + 2, cx - 4, cy - 2);
      g.fillTriangle(cx + 6, cy - 10, cx + 14, cy + 2, cx + 4, cy - 2);

      // Eyes (glowing)
      g.fillStyle(0xff4400, 1);
      g.fillCircle(cx - 2.5, cy - 11, 1.2);
      g.fillCircle(cx + 2.5, cy - 11, 1.2);
      g.fillStyle(0xffffff, 0.7);
      g.fillCircle(cx - 2.5, cy - 11.5, 0.6);
      g.fillCircle(cx + 2.5, cy - 11.5, 0.6);

      // Spell circle around figure
      this.spellCircle(g, cx, cy, 22, 0xff6644, 12, 0.3);

      this.finish(g, 'enemy_miniboss', W, H);
    }
  }

  // ── BOSS ASSETS ──────────────────────────────────────────────────

  private static generateBossAssets(scene: Phaser.Scene): void {
    // ─ boss_1: Prism Warden ─ crystalline maiden with geometric halo, 80x80
    {
      const S = 80;
      const g = this.makeGfx(scene);
      const c = S / 2;

      // Outer prismatic aura
      this.glowCircle(g, c, c, 42, 0x6644cc, 6, 0.15);
      this.glowCircle(g, c, c, 34, 0x8866ff, 4, 0.1);

      // Geometric halo ring behind head
      g.lineStyle(2, 0xaa88ff, 0.5);
      g.strokeCircle(c, c - 8, 28);
      g.lineStyle(1, 0xcc99ff, 0.3);
      g.strokeCircle(c, c - 8, 32);

      // Halo rune dots
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 / 12) * i;
        g.fillStyle(0xddbbff, 0.7);
        g.fillCircle(c + Math.cos(a) * 28, c - 8 + Math.sin(a) * 28, 1.5);
      }

      // Prismatic crystal wings (left)
      g.fillStyle(0x5533aa, 0.7);
      g.fillTriangle(c - 8, c - 4, c - 34, c - 28, c - 18, c + 6);
      g.fillStyle(0x7755cc, 0.5);
      g.fillTriangle(c - 10, c - 2, c - 36, c - 20, c - 20, c + 10);
      g.fillStyle(0x4422aa, 0.6);
      g.fillTriangle(c - 6, c + 4, c - 30, c + 16, c - 14, c + 12);

      // Prismatic crystal wings (right)
      g.fillStyle(0x5533aa, 0.7);
      g.fillTriangle(c + 8, c - 4, c + 34, c - 28, c + 18, c + 6);
      g.fillStyle(0x7755cc, 0.5);
      g.fillTriangle(c + 10, c - 2, c + 36, c - 20, c + 20, c + 10);
      g.fillStyle(0x4422aa, 0.6);
      g.fillTriangle(c + 6, c + 4, c + 30, c + 16, c + 14, c + 12);

      // Wing crystal edge highlights
      g.lineStyle(1, 0xbb99ff, 0.4);
      g.lineBetween(c - 8, c - 4, c - 34, c - 28);
      g.lineBetween(c + 8, c - 4, c + 34, c - 28);
      g.lineBetween(c - 6, c + 4, c - 30, c + 16);
      g.lineBetween(c + 6, c + 4, c + 30, c + 16);

      // Wing sparkle dots
      g.fillStyle(0xeeddff, 0.8);
      g.fillCircle(c - 28, c - 22, 1.5);
      g.fillCircle(c + 28, c - 22, 1.5);
      g.fillCircle(c - 24, c + 12, 1.2);
      g.fillCircle(c + 24, c + 12, 1.2);

      // Flowing dress/robe
      g.fillStyle(0x5533bb, 0.8);
      g.fillTriangle(c - 12, c + 8, c + 12, c + 8, c, c + 36);
      g.fillStyle(0x6644cc, 0.6);
      g.fillTriangle(c - 10, c + 10, c + 10, c + 10, c - 4, c + 34);
      g.fillStyle(0x7755dd, 0.4);
      g.fillTriangle(c - 14, c + 12, c - 4, c + 12, c - 8, c + 38);
      g.fillTriangle(c + 14, c + 12, c + 4, c + 12, c + 8, c + 38);

      // Body
      g.fillStyle(0xeeddff, 0.85);
      g.fillEllipse(c, c + 2, 14, 16);

      // Head
      g.fillStyle(0xf0eaff, 0.95);
      g.fillCircle(c, c - 10, 8);

      // Crystal crown/tiara
      g.fillStyle(0xaa88ff, 0.9);
      g.fillTriangle(c - 6, c - 16, c - 2, c - 24, c + 2, c - 16);
      g.fillTriangle(c - 2, c - 17, c, c - 22, c + 2, c - 17);
      g.fillTriangle(c + 2, c - 16, c + 6, c - 22, c + 8, c - 14);
      g.fillStyle(0xffffff, 0.7);
      g.fillCircle(c, c - 20, 1.5);

      // Hair (long, flowing, violet)
      g.fillStyle(0x6644bb, 0.8);
      g.fillTriangle(c - 8, c - 12, c - 16, c + 10, c - 4, c - 4);
      g.fillTriangle(c + 8, c - 12, c + 16, c + 10, c + 4, c - 4);
      g.fillStyle(0x5533aa, 0.6);
      g.fillTriangle(c - 10, c - 8, c - 18, c + 16, c - 6, c + 2);
      g.fillTriangle(c + 10, c - 8, c + 18, c + 16, c + 6, c + 2);

      // Eyes (glowing prismatic)
      g.fillStyle(0xcc88ff, 1);
      g.fillCircle(c - 3, c - 11, 1.5);
      g.fillCircle(c + 3, c - 11, 1.5);
      g.fillStyle(0xffffff, 0.8);
      g.fillCircle(c - 3, c - 11.5, 0.8);
      g.fillCircle(c + 3, c - 11.5, 0.8);

      // Floating crystal fragments around figure
      const crystalAngles = [0.5, 1.5, 2.8, 4.0, 5.2];
      for (const a of crystalAngles) {
        const rx = c + Math.cos(a) * 24;
        const ry = c + Math.sin(a) * 20;
        g.fillStyle(0x8866ee, 0.6);
        g.fillTriangle(rx, ry - 4, rx - 2, ry + 2, rx + 2, ry + 2);
        g.fillStyle(0xbbaaff, 0.4);
        g.fillCircle(rx, ry - 2, 1);
      }

      // Central core glow in chest area
      this.glowCircle(g, c, c, 6, 0x9966ff, 3, 0.6);
      g.fillStyle(0xddccff, 1);
      g.fillCircle(c, c, 2.5);
      g.fillStyle(0xffffff, 0.9);
      g.fillCircle(c, c, 1);

      this.finish(g, 'boss1', S, S);
    }

    // ─ boss_2: Scarlet Tempest ─ flame-winged maiden, 80x80
    {
      const S = 80;
      const g = this.makeGfx(scene);
      const c = S / 2;

      // Blazing aura
      this.glowCircle(g, c, c, 42, 0xff2200, 6, 0.15);
      this.glowCircle(g, c, c, 32, 0xff6600, 4, 0.1);

      // Flame wings (left) - layered fire shapes
      g.fillStyle(0xcc2200, 0.6);
      g.fillTriangle(c - 6, c - 6, c - 36, c - 30, c - 16, c + 4);
      g.fillStyle(0xff4400, 0.5);
      g.fillTriangle(c - 8, c - 4, c - 32, c - 24, c - 20, c + 8);
      g.fillStyle(0xff6600, 0.4);
      g.fillTriangle(c - 4, c - 8, c - 28, c - 34, c - 12, c - 2);
      // Flame licks on left wing
      g.fillStyle(0xff8800, 0.35);
      g.fillTriangle(c - 20, c - 16, c - 38, c - 20, c - 26, c - 8);
      g.fillTriangle(c - 14, c + 2, c - 28, c + 10, c - 18, c + 12);

      // Flame wings (right) - mirror
      g.fillStyle(0xcc2200, 0.6);
      g.fillTriangle(c + 6, c - 6, c + 36, c - 30, c + 16, c + 4);
      g.fillStyle(0xff4400, 0.5);
      g.fillTriangle(c + 8, c - 4, c + 32, c - 24, c + 20, c + 8);
      g.fillStyle(0xff6600, 0.4);
      g.fillTriangle(c + 4, c - 8, c + 28, c - 34, c + 12, c - 2);
      g.fillStyle(0xff8800, 0.35);
      g.fillTriangle(c + 20, c - 16, c + 38, c - 20, c + 26, c - 8);
      g.fillTriangle(c + 14, c + 2, c + 28, c + 10, c + 18, c + 12);

      // Wing ember sparkles
      g.fillStyle(0xffcc44, 0.7);
      g.fillCircle(c - 30, c - 26, 1.5);
      g.fillCircle(c + 30, c - 26, 1.5);
      g.fillCircle(c - 26, c + 6, 1.2);
      g.fillCircle(c + 26, c + 6, 1.2);
      g.fillStyle(0xffee88, 0.5);
      g.fillCircle(c - 34, c - 18, 1);
      g.fillCircle(c + 34, c - 18, 1);

      // Flowing dress (scarlet/crimson)
      g.fillStyle(0xcc1100, 0.85);
      g.fillTriangle(c - 14, c + 6, c + 14, c + 6, c, c + 38);
      g.fillStyle(0xdd2211, 0.7);
      g.fillTriangle(c - 12, c + 8, c + 12, c + 8, c - 6, c + 36);
      g.fillStyle(0xee3322, 0.5);
      g.fillTriangle(c - 16, c + 10, c - 6, c + 10, c - 10, c + 38);
      g.fillTriangle(c + 16, c + 10, c + 6, c + 10, c + 10, c + 38);

      // Body
      g.fillStyle(0xffddcc, 0.85);
      g.fillEllipse(c, c, 14, 16);

      // Head
      g.fillStyle(0xffeedd, 0.95);
      g.fillCircle(c, c - 12, 8);

      // Fiery hair flowing
      g.fillStyle(0xdd2200, 0.85);
      g.fillTriangle(c - 8, c - 14, c - 18, c + 6, c - 4, c - 6);
      g.fillTriangle(c + 8, c - 14, c + 18, c + 6, c + 4, c - 6);
      g.fillStyle(0xff4400, 0.7);
      g.fillTriangle(c - 6, c - 16, c - 14, c + 2, c - 2, c - 8);
      g.fillTriangle(c + 6, c - 16, c + 14, c + 2, c + 2, c - 8);
      // Flame hair tips
      g.fillStyle(0xff8800, 0.5);
      g.fillTriangle(c - 10, c - 12, c - 8, c - 24, c - 4, c - 14);
      g.fillTriangle(c + 4, c - 14, c + 8, c - 24, c + 10, c - 12);
      g.fillTriangle(c - 2, c - 16, c, c - 26, c + 2, c - 16);

      // Eyes (blazing)
      g.fillStyle(0xff8800, 1);
      g.fillCircle(c - 3, c - 13, 1.5);
      g.fillCircle(c + 3, c - 13, 1.5);
      g.fillStyle(0xffee44, 0.9);
      g.fillCircle(c - 3, c - 13.5, 0.8);
      g.fillCircle(c + 3, c - 13.5, 0.8);

      // Blazing aura ring
      g.lineStyle(1.5, 0xff4400, 0.3);
      g.strokeCircle(c, c, 30);
      // Ember dots on ring
      for (let i = 0; i < 10; i++) {
        const a = (Math.PI * 2 / 10) * i;
        g.fillStyle(0xff8844, 0.5);
        g.fillCircle(c + Math.cos(a) * 30, c + Math.sin(a) * 30, 1.5);
      }

      // Central flame core in chest
      this.glowCircle(g, c, c - 2, 6, 0xff4400, 3, 0.6);
      g.fillStyle(0xffaa44, 1);
      g.fillCircle(c, c - 2, 2.5);
      g.fillStyle(0xffffff, 0.8);
      g.fillCircle(c, c - 2, 1);

      this.finish(g, 'boss2', S, S);
    }

    // ─ boss_3: Void Empress ─ cosmic empress, 96x96
    {
      const S = 96;
      const g = this.makeGfx(scene);
      const c = S / 2;

      // Reality-warping cosmic aura (multiple layers)
      this.glowCircle(g, c, c, 50, 0x220044, 6, 0.2);
      this.glowCircle(g, c, c, 40, 0x440066, 4, 0.15);
      this.glowCircle(g, c, c, 30, 0x660088, 3, 0.08);

      // Outer orbital ring (tilted via ellipse)
      g.lineStyle(2, 0x8844cc, 0.4);
      g.strokeEllipse(c, c, 88, 50);
      g.lineStyle(1, 0xaa66ee, 0.25);
      g.strokeEllipse(c, c, 84, 46);

      // Second orbital ring (perpendicular)
      g.lineStyle(1.5, 0x6622aa, 0.35);
      g.strokeEllipse(c, c, 50, 85);

      // Orbital rune dots
      for (let i = 0; i < 16; i++) {
        const a = (Math.PI * 2 / 16) * i;
        const rx = c + Math.cos(a) * 44;
        const ry = c + Math.sin(a) * 25;
        g.fillStyle(0xcc88ff, 0.5);
        g.fillCircle(rx, ry, 1.5);
      }
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 / 12) * i;
        const rx = c + Math.cos(a) * 25;
        const ry = c + Math.sin(a) * 42;
        g.fillStyle(0xaa66ee, 0.4);
        g.fillCircle(rx, ry, 1.2);
      }

      // Grand cosmic wings (dark, ethereal)
      // Left wing upper
      g.fillStyle(0x440066, 0.7);
      g.fillTriangle(c - 8, c - 8, c - 40, c - 36, c - 18, c + 4);
      g.fillStyle(0x550077, 0.5);
      g.fillTriangle(c - 10, c - 6, c - 42, c - 28, c - 22, c + 8);
      // Left wing lower
      g.fillStyle(0x330055, 0.6);
      g.fillTriangle(c - 6, c + 4, c - 36, c + 20, c - 16, c + 14);

      // Right wing upper
      g.fillStyle(0x440066, 0.7);
      g.fillTriangle(c + 8, c - 8, c + 40, c - 36, c + 18, c + 4);
      g.fillStyle(0x550077, 0.5);
      g.fillTriangle(c + 10, c - 6, c + 42, c - 28, c + 22, c + 8);
      // Right wing lower
      g.fillStyle(0x330055, 0.6);
      g.fillTriangle(c + 6, c + 4, c + 36, c + 20, c + 16, c + 14);

      // Wing cosmic energy lines
      g.lineStyle(1, 0xcc88ff, 0.35);
      g.lineBetween(c - 10, c - 6, c - 38, c - 32);
      g.lineBetween(c + 10, c - 6, c + 38, c - 32);
      g.lineBetween(c - 8, c + 4, c - 32, c + 18);
      g.lineBetween(c + 8, c + 4, c + 32, c + 18);

      // Wing void sparkles
      g.fillStyle(0xddbbff, 0.6);
      g.fillCircle(c - 34, c - 30, 2);
      g.fillCircle(c + 34, c - 30, 2);
      g.fillCircle(c - 30, c + 14, 1.5);
      g.fillCircle(c + 30, c + 14, 1.5);
      g.fillStyle(0xeeddff, 0.4);
      g.fillCircle(c - 38, c - 20, 1);
      g.fillCircle(c + 38, c - 20, 1);

      // Grand flowing dress/robe
      g.fillStyle(0x330055, 0.85);
      g.fillTriangle(c - 16, c + 8, c + 16, c + 8, c, c + 44);
      g.fillStyle(0x440066, 0.7);
      g.fillTriangle(c - 14, c + 10, c + 14, c + 10, c - 6, c + 42);
      g.fillStyle(0x550077, 0.5);
      g.fillTriangle(c - 18, c + 12, c - 6, c + 12, c - 12, c + 46);
      g.fillTriangle(c + 18, c + 12, c + 6, c + 12, c + 12, c + 46);
      // Dress cosmic pattern dots
      g.fillStyle(0x8844cc, 0.3);
      g.fillCircle(c - 4, c + 24, 1.5);
      g.fillCircle(c + 4, c + 28, 1.2);
      g.fillCircle(c, c + 18, 1);

      // Body
      g.fillStyle(0xeeddff, 0.85);
      g.fillEllipse(c, c, 16, 18);

      // Head
      g.fillStyle(0xf0eaff, 0.95);
      g.fillCircle(c, c - 14, 9);

      // Crown (elaborate, cosmic)
      g.fillStyle(0x8844cc, 0.9);
      g.fillTriangle(c - 8, c - 20, c - 4, c - 30, c, c - 20);
      g.fillTriangle(c - 2, c - 21, c, c - 34, c + 2, c - 21);
      g.fillTriangle(c, c - 20, c + 4, c - 30, c + 8, c - 20);
      // Crown gems
      g.fillStyle(0xcc66ff, 1);
      g.fillCircle(c, c - 28, 2);
      g.fillStyle(0xffffff, 0.8);
      g.fillCircle(c, c - 28, 1);
      g.fillStyle(0xaa44ee, 0.8);
      g.fillCircle(c - 5, c - 24, 1.5);
      g.fillCircle(c + 5, c - 24, 1.5);

      // Long flowing cosmic hair
      g.fillStyle(0x550088, 0.8);
      g.fillTriangle(c - 9, c - 16, c - 20, c + 16, c - 4, c - 6);
      g.fillTriangle(c + 9, c - 16, c + 20, c + 16, c + 4, c - 6);
      g.fillStyle(0x440066, 0.6);
      g.fillTriangle(c - 11, c - 12, c - 24, c + 22, c - 8, c + 4);
      g.fillTriangle(c + 11, c - 12, c + 24, c + 22, c + 8, c + 4);
      // Hair cosmic shimmer
      g.fillStyle(0x8866cc, 0.3);
      g.fillCircle(c - 14, c + 4, 2);
      g.fillCircle(c + 14, c + 4, 2);

      // Eyes (void-gazing, glowing)
      g.fillStyle(0xcc44ff, 1);
      g.fillCircle(c - 3.5, c - 15, 2);
      g.fillCircle(c + 3.5, c - 15, 2);
      g.fillStyle(0xff88ff, 0.9);
      g.fillCircle(c - 3.5, c - 15, 1.2);
      g.fillCircle(c + 3.5, c - 15, 1.2);
      g.fillStyle(0xffffff, 0.8);
      g.fillCircle(c - 3.5, c - 15.5, 0.6);
      g.fillCircle(c + 3.5, c - 15.5, 0.6);

      // Central void core - reality tear in chest
      this.glowCircle(g, c, c - 2, 10, 0x8800cc, 5, 0.5);
      g.fillStyle(0xaa44ee, 1);
      g.fillCircle(c, c - 2, 5);
      g.fillStyle(0xcc66ff, 0.9);
      g.fillCircle(c, c - 2, 3.5);
      g.fillStyle(0xee99ff, 0.8);
      g.fillCircle(c, c - 2, 2);
      g.fillStyle(0xffffff, 0.9);
      g.fillCircle(c, c - 2, 0.8);

      // Void sigil lines from core
      g.lineStyle(1, 0xcc88ff, 0.3);
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 / 8) * i;
        g.lineBetween(
          c + Math.cos(a) * 6, c - 2 + Math.sin(a) * 6,
          c + Math.cos(a) * 14, c - 2 + Math.sin(a) * 14,
        );
      }

      // Floating star particles around empress
      g.fillStyle(0xddaaff, 0.5);
      const starPositions: [number, number][] = [
        [c + 30, c - 10], [c - 30, c - 12], [c + 22, c + 24],
        [c - 22, c + 22], [c + 6, c - 38], [c - 6, c + 36],
      ];
      for (const [sx, sy] of starPositions) {
        g.fillCircle(sx, sy, 1);
      }

      this.finish(g, 'boss3', S, S);
    }
  }

  // ── BULLET ASSETS ────────────────────────────────────────────────

  private static generateBulletAssets(scene: Phaser.Scene): void {
    // ─ bullet_small ─ 8x8, bright red Touhou orb
    {
      const S = 8;
      const g = this.makeGfx(scene);
      const c = S / 2;
      this.touhouOrb(g, c, c, 3.5, 0xff2222, -1);
      this.finish(g, 'bullet_small', S, S);
    }

    // ─ bullet_medium ─ 12x12, magenta/pink Touhou orb
    {
      const S = 12;
      const g = this.makeGfx(scene);
      const c = S / 2;
      this.touhouOrb(g, c, c, 5.5, 0xff22aa, -1);
      this.finish(g, 'bullet_medium', S, S);
    }

    // ─ bullet_large ─ 16x16, purple Touhou orb with glow ring
    {
      const S = 16;
      const g = this.makeGfx(scene);
      const c = S / 2;
      this.touhouOrb(g, c, c, 7, 0x8822ff, -1.5);
      // Extra glow ring
      g.lineStyle(1, 0xbb88ff, 0.25);
      g.strokeCircle(c, c, 7.5);
      // Cross highlight for extra Touhou sparkle
      g.fillStyle(0xddaaff, 0.25);
      g.fillRect(c - 6, c - 0.5, 12, 1);
      g.fillRect(c - 0.5, c - 6, 1, 12);
      this.finish(g, 'bullet_large', S, S);
    }

    // ─ bullet_laser ─ 40x4, needle/rice bullet, tapered, red/orange
    {
      const W = 40, H = 4;
      const g = this.makeGfx(scene);
      const cy = H / 2;
      // Outer soft glow
      g.fillStyle(0xff4400, 0.2);
      g.fillEllipse(W / 2, cy, W, H + 2);
      // Rice body - tapered ellipse
      g.fillStyle(0xff5522, 0.7);
      g.fillEllipse(W / 2, cy, W - 2, H);
      // Inner bright core
      g.fillStyle(0xffaa44, 0.9);
      g.fillEllipse(W / 2, cy, W - 10, H - 1.5);
      // White hot center line
      g.fillStyle(0xffffff, 0.7);
      g.fillEllipse(W / 2 + 2, cy, W - 18, 1);
      // Tapered tip highlights
      g.fillStyle(0xffcc88, 0.5);
      g.fillCircle(2, cy, 1);
      g.fillCircle(W - 2, cy, 1);
      this.finish(g, 'bullet_laser', W, H);
    }

    // ─ bullet_orb ─ 20x20, large slow-moving blue/white orb
    {
      const S = 20;
      const g = this.makeGfx(scene);
      const c = S / 2;
      this.touhouOrb(g, c, c, 9, 0x4488ff, -2);
      // Extra soft outer glow
      g.fillStyle(0x2266cc, 0.1);
      g.fillCircle(c, c, 10);
      // Specular highlight dot
      g.fillStyle(0xffffff, 0.6);
      g.fillCircle(c - 2, c - 2, 1.5);
      this.finish(g, 'bullet_orb', S, S);
    }

    // ─ bullet_aimed ─ 10x10, kunai/diamond shape, yellow/orange
    {
      const S = 10;
      const g = this.makeGfx(scene);
      const c = S / 2;
      // Outer glow
      g.fillStyle(0xff8800, 0.2);
      g.fillCircle(c, c, 5);
      // Diamond/kunai shape - pointed
      g.fillStyle(0xffaa22, 0.8);
      g.fillTriangle(c, 0, c + 4, c, c, S);
      g.fillTriangle(c, 0, c - 4, c, c, S);
      // Inner lighter diamond
      g.fillStyle(0xffcc55, 0.9);
      g.fillTriangle(c, 2, c + 2, c, c, S - 2);
      g.fillTriangle(c, 2, c - 2, c, c, S - 2);
      // Bright core
      g.fillStyle(0xffffff, 0.85);
      g.fillCircle(c, c, 1.5);
      // Top highlight
      g.fillStyle(0xffee88, 0.6);
      g.fillCircle(c, c - 1, 1);
      this.finish(g, 'bullet_aimed', S, S);
    }

    // ─ bullet_ring ─ 14x14, hollow ring bullet, cyan with inner glow
    {
      const S = 14;
      const g = this.makeGfx(scene);
      const c = S / 2;
      // Outer glow
      g.fillStyle(0x00ccff, 0.12);
      g.fillCircle(c, c, 7);
      // Outer ring
      g.lineStyle(2.5, 0x00ddff, 0.8);
      g.strokeCircle(c, c, 5);
      // Inner ring highlight
      g.lineStyle(1, 0x88eeff, 0.5);
      g.strokeCircle(c, c, 3.5);
      // Inner glow
      g.fillStyle(0x44eeff, 0.2);
      g.fillCircle(c, c, 3);
      // Bright highlight spot
      g.fillStyle(0xffffff, 0.5);
      g.fillCircle(c - 1, c - 3, 1.2);
      g.fillStyle(0xffffff, 0.3);
      g.fillCircle(c + 2, c + 2, 0.8);
      this.finish(g, 'bullet_ring', S, S);
    }

    // ─ bullet_crystal ─ 12x12, faceted gem, blue/purple
    {
      const S = 12;
      const g = this.makeGfx(scene);
      const c = S / 2;
      // Soft glow
      g.fillStyle(0x6644ff, 0.2);
      g.fillCircle(c, c, 6);
      // Diamond/gem facets
      g.fillStyle(0x5533cc, 0.8);
      g.fillTriangle(c, 1, c + 5, c, c, S - 1);
      g.fillTriangle(c, 1, c - 5, c, c, S - 1);
      // Lighter inner facet
      g.fillStyle(0x8866ee, 0.7);
      g.fillTriangle(c, 2, c + 3, c, c, c + 3);
      // Highlight facet
      g.fillStyle(0xbbaaff, 0.6);
      g.fillTriangle(c, 3, c - 2, c - 1, c + 1, c - 1);
      // Core sparkle
      g.fillStyle(0xeeddff, 0.9);
      g.fillCircle(c, c - 1, 1.5);
      g.fillStyle(0xffffff, 0.7);
      g.fillCircle(c, c - 1.5, 0.8);
      this.finish(g, 'bullet_crystal', S, S);
    }

    // ─ bullet_flame ─ 12x12, red/orange with flickering appearance
    {
      const S = 12;
      const g = this.makeGfx(scene);
      const c = S / 2;
      // Outer fire glow
      g.fillStyle(0xff2200, 0.2);
      g.fillCircle(c, c, 6);
      // Flame shape - teardrop pointing up
      g.fillStyle(0xff3300, 0.6);
      g.fillCircle(c, c + 1, 4.5);
      g.fillTriangle(c - 3, c - 1, c + 3, c - 1, c, c - 5);
      // Inner fire
      g.fillStyle(0xff6600, 0.8);
      g.fillCircle(c, c + 1, 3);
      g.fillTriangle(c - 2, c, c + 2, c, c, c - 3);
      // Hot core
      g.fillStyle(0xffaa44, 0.9);
      g.fillCircle(c, c + 1, 1.8);
      // White center
      g.fillStyle(0xffee88, 1);
      g.fillCircle(c, c + 0.5, 0.8);
      this.finish(g, 'bullet_flame', S, S);
    }

    // ─ bullet_flame_linger ─ 16x16, larger lingering flame orb
    {
      const S = 16;
      const g = this.makeGfx(scene);
      const c = S / 2;
      // Outer glow
      g.fillStyle(0xff4400, 0.15);
      g.fillCircle(c, c, 8);
      // Flame body
      g.fillStyle(0xff5500, 0.4);
      g.fillCircle(c, c, 6.5);
      g.fillTriangle(c - 4, c - 2, c + 4, c - 2, c, c - 7);
      // Inner flame
      g.fillStyle(0xff7722, 0.6);
      g.fillCircle(c, c, 4.5);
      g.fillTriangle(c - 2.5, c - 1, c + 2.5, c - 1, c, c - 5);
      // Hot core
      g.fillStyle(0xffaa44, 0.8);
      g.fillCircle(c, c, 3);
      // Bright center
      g.fillStyle(0xffdd88, 0.9);
      g.fillCircle(c, c, 1.5);
      // Small ember sparkles
      g.fillStyle(0xffcc66, 0.5);
      g.fillCircle(c - 3, c - 4, 1);
      g.fillCircle(c + 3, c - 3, 0.8);
      g.fillCircle(c + 1, c - 6, 0.6);
      this.finish(g, 'bullet_flame_linger', S, S);
    }

    // ─ bullet_void ─ 12x12, dark purple with pink core, ethereal
    {
      const S = 12;
      const g = this.makeGfx(scene);
      const c = S / 2;
      // Dark void glow
      g.fillStyle(0x440066, 0.25);
      g.fillCircle(c, c, 6);
      // Outer dark shell
      g.fillStyle(0x660088, 0.5);
      g.fillCircle(c, c, 5);
      // Mid purple
      g.fillStyle(0x9922cc, 0.7);
      g.fillCircle(c, c, 3.5);
      // Pink core
      g.fillStyle(0xcc44ff, 0.85);
      g.fillCircle(c, c, 2.2);
      // Hot pink center
      g.fillStyle(0xff88ff, 1);
      g.fillCircle(c, c, 1.2);
      // White sparkle
      g.fillStyle(0xffffff, 0.7);
      g.fillCircle(c - 0.5, c - 0.5, 0.6);
      this.finish(g, 'bullet_void', S, S);
    }
  }

  // ── EFFECT ASSETS ────────────────────────────────────────────────

  private static generateEffectAssets(scene: Phaser.Scene): void {
    // ─ explosion_small ─ magical petal burst, 4 frames in 128x32 strip
    {
      const FW = 32, FH = 32, frames = 4;
      const W = FW * frames;
      const g = this.makeGfx(scene);

      for (let f = 0; f < frames; f++) {
        const ox = f * FW;
        const cx = ox + FW / 2;
        const cy = FH / 2;
        const progress = f / (frames - 1);

        const radius = 4 + progress * 12;
        const alpha = 1 - progress * 0.6;

        // Magical burst glow (pink/magenta instead of fire)
        g.fillStyle(0xff44aa, alpha * 0.25);
        g.fillCircle(cx, cy, radius + 4);

        if (f < 3) {
          // Magical energy burst
          g.fillStyle(0xff66cc, alpha * 0.5);
          g.fillCircle(cx, cy, radius);
          g.fillStyle(0xff88dd, alpha * 0.7);
          g.fillCircle(cx, cy, radius * 0.6);
          g.fillStyle(0xffccee, alpha * 0.9);
          g.fillCircle(cx, cy, radius * 0.3);
        }

        // Petal/sparkle scatter
        if (f >= 1) {
          const petalCount = 5 + f * 2;
          for (let p = 0; p < petalCount; p++) {
            const a = (Math.PI * 2 / petalCount) * p + f * 0.4;
            const dist = radius * (0.5 + progress * 1.0);
            const px = cx + Math.cos(a) * dist;
            const py = cy + Math.sin(a) * dist;
            // Petal-like shapes (small ellipses)
            g.fillStyle(0xff88cc, alpha * 0.6);
            g.fillCircle(px, py, 1.8 - progress * 0.4);
            // Sparkle dot
            g.fillStyle(0xffffff, alpha * 0.5);
            g.fillCircle(px, py, 0.6);
          }
        }

        if (f === 3) {
          // Fading magic ring
          g.lineStyle(1.5, 0xff88cc, 0.2);
          g.strokeCircle(cx, cy, radius + 3);
        }

        // White hot center (magic core)
        if (f < 3) {
          g.fillStyle(0xffffff, alpha * 0.7);
          g.fillCircle(cx, cy, Math.max(1, radius * 0.15));
        }
      }

      this.finish(g, 'explosion_small', W, FH);
    }

    // ─ explosion_large ─ grand magical detonation, 4 frames in 256x64 strip
    {
      const FW = 64, FH = 64, frames = 4;
      const W = FW * frames;
      const g = this.makeGfx(scene);

      for (let f = 0; f < frames; f++) {
        const ox = f * FW;
        const cx = ox + FW / 2;
        const cy = FH / 2;
        const progress = f / (frames - 1);

        const radius = 8 + progress * 24;
        const alpha = 1 - progress * 0.5;

        // Outer magical glow (purple/pink)
        g.fillStyle(0xcc22ff, alpha * 0.15);
        g.fillCircle(cx, cy, radius + 10);

        // Main magical blast
        g.fillStyle(0xff44cc, alpha * 0.4);
        g.fillCircle(cx, cy, radius + 4);

        if (f < 3) {
          g.fillStyle(0xff66dd, alpha * 0.6);
          g.fillCircle(cx, cy, radius);
          g.fillStyle(0xff99ee, alpha * 0.75);
          g.fillCircle(cx, cy, radius * 0.55);
          g.fillStyle(0xffccff, alpha * 0.85);
          g.fillCircle(cx, cy, radius * 0.3);
          g.fillStyle(0xffffff, alpha * 0.7);
          g.fillCircle(cx, cy, radius * 0.12);
        }

        // Magical petal/sparkle debris
        const sparkCount = 8 + f * 3;
        for (let s = 0; s < sparkCount; s++) {
          const a = (Math.PI * 2 / sparkCount) * s + f * 0.3;
          const dist = radius * (0.5 + progress * 1.0);
          const sx = cx + Math.cos(a) * dist;
          const sy = cy + Math.sin(a) * dist;
          // Alternating pink and white sparkles
          const sparkColor = s % 2 === 0 ? 0xff88dd : 0xddaaff;
          g.fillStyle(sparkColor, alpha * 0.5);
          g.fillCircle(sx, sy, 2.2 - progress * 0.5);
          g.fillStyle(0xffffff, alpha * 0.3);
          g.fillCircle(sx, sy, 0.8);
        }

        // Secondary magical bursts
        if (f >= 1 && f < 3) {
          const offsets = [
            { x: -7, y: -6, r: 5 },
            { x: 8, y: 5, r: 4 },
            { x: -4, y: 8, r: 3 },
          ];
          for (const off of offsets) {
            const oa = alpha * 0.4;
            g.fillStyle(0xcc66ff, oa);
            g.fillCircle(cx + off.x * progress * 2, cy + off.y * progress * 2, off.r * (1 - progress * 0.3));
          }
        }

        if (f === 3) {
          // Dissipating spell circle
          g.lineStyle(2, 0xff66cc, 0.2);
          g.strokeCircle(cx, cy, radius + 4);
          g.lineStyle(1, 0xcc88ff, 0.12);
          g.strokeCircle(cx, cy, radius + 8);
        }
      }

      this.finish(g, 'explosion_large', W, FH);
    }

    // ─ hit_spark ─ bright white/gold star burst, 16x16
    {
      const S = 16;
      const g = this.makeGfx(scene);
      const c = S / 2;

      // Glow
      g.fillStyle(0xffdd44, 0.3);
      g.fillCircle(c, c, 6);

      // 4-point star burst rays
      g.fillStyle(0xffee88, 0.7);
      // Horizontal ray
      g.fillTriangle(0, c, c, c - 1.5, c, c + 1.5);
      g.fillTriangle(S, c, c, c - 1.5, c, c + 1.5);
      // Vertical ray
      g.fillTriangle(c, 0, c - 1.5, c, c + 1.5, c);
      g.fillTriangle(c, S, c - 1.5, c, c + 1.5, c);

      // Diagonal smaller rays
      g.lineStyle(1, 0xffee88, 0.5);
      g.lineBetween(c - 4, c - 4, c + 4, c + 4);
      g.lineBetween(c - 4, c + 4, c + 4, c - 4);

      // White core
      g.fillStyle(0xffffff, 1);
      g.fillCircle(c, c, 2.5);
      g.fillStyle(0xffff88, 0.8);
      g.fillCircle(c, c, 1.5);

      this.finish(g, 'hit_spark', S, S);
    }

    // ─ graze_spark ─ tiny cyan sparkle/star, 12x12
    {
      const S = 12;
      const g = this.makeGfx(scene);
      const c = S / 2;

      // Soft cyan glow
      g.fillStyle(0x00ffff, 0.2);
      g.fillCircle(c, c, 5);

      // 4-point star shape
      g.fillStyle(0x44ffff, 0.7);
      g.fillTriangle(c, 0, c - 1, c, c + 1, c);
      g.fillTriangle(c, S, c - 1, c, c + 1, c);
      g.fillTriangle(0, c, c, c - 1, c, c + 1);
      g.fillTriangle(S, c, c, c - 1, c, c + 1);

      // Bright core
      g.fillStyle(0xaaffff, 1);
      g.fillCircle(c, c, 1.8);
      g.fillStyle(0xffffff, 0.9);
      g.fillCircle(c, c, 1);

      this.finish(g, 'graze_spark', S, S);
    }

    // ─ death_particles ─ 4x4, white sparkle
    {
      const S = 4;
      const g = this.makeGfx(scene);
      g.fillStyle(0xffffff, 0.5);
      g.fillCircle(2, 2, 2);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(2, 2, 1);
      // Tiny sparkle rays
      g.fillStyle(0xffffff, 0.4);
      g.fillRect(0, 1.5, 4, 1);
      g.fillRect(1.5, 0, 1, 4);
      this.finish(g, 'death_particles', S, S);
    }
  }

  // ── PICKUP ASSETS ────────────────────────────────────────────────

  private static generatePickupAssets(scene: Phaser.Scene): void {
    // ─ pickup_power ─ red gem/diamond with glow (Touhou power item), 16x16
    {
      const S = 16;
      const g = this.makeGfx(scene);
      const c = S / 2;

      // Red glow aura
      g.fillStyle(0xff2200, 0.25);
      g.fillCircle(c, c, 8);

      // Diamond gem shape
      g.fillStyle(0xcc1100, 1);
      g.fillTriangle(c, 1, S - 2, c, c, S - 1);
      g.fillTriangle(c, 1, 2, c, c, S - 1);

      // Inner lighter facet (right side highlight)
      g.fillStyle(0xff4422, 0.8);
      g.fillTriangle(c, 2, S - 3, c, c, c + 3);

      // Top facet highlight
      g.fillStyle(0xff6644, 0.7);
      g.fillTriangle(c, 2, c - 2, c - 2, c + 3, c - 1);

      // Center sparkle
      g.fillStyle(0xffaa66, 0.9);
      g.fillCircle(c, c, 2);
      g.fillStyle(0xffffff, 0.7);
      g.fillCircle(c - 0.5, c - 0.5, 1);

      // Edge glow line
      g.lineStyle(1, 0xff6633, 0.4);
      g.lineBetween(c, 1, S - 2, c);
      g.lineBetween(c, 1, 2, c);

      this.finish(g, 'pickup_power', S, S);
    }

    // ─ pickup_point ─ blue star with sparkle (Touhou point item), 14x14
    {
      const S = 14;
      const g = this.makeGfx(scene);
      const c = S / 2;

      // Blue glow
      g.fillStyle(0x2266ff, 0.25);
      g.fillCircle(c, c, 7);

      // 5-pointed star
      g.fillStyle(0x4488ff, 1);
      for (let i = 0; i < 5; i++) {
        const a = (Math.PI * 2 / 5) * i - Math.PI / 2;
        const na = (Math.PI * 2 / 5) * (i + 0.5) - Math.PI / 2;
        g.fillTriangle(
          c, c,
          c + Math.cos(a) * 6, c + Math.sin(a) * 6,
          c + Math.cos(na) * 3, c + Math.sin(na) * 3,
        );
        g.fillTriangle(
          c, c,
          c + Math.cos(a) * 6, c + Math.sin(a) * 6,
          c + Math.cos(a - Math.PI * 2 / 10) * 3, c + Math.sin(a - Math.PI * 2 / 10) * 3,
        );
      }

      // Inner star highlight
      g.fillStyle(0x88bbff, 0.8);
      g.fillCircle(c, c, 3);

      // Sparkle center
      g.fillStyle(0xddeeff, 1);
      g.fillCircle(c, c, 1.8);
      g.fillStyle(0xffffff, 0.8);
      g.fillCircle(c - 0.5, c - 0.5, 1);

      // Star tip sparkles
      for (let i = 0; i < 5; i++) {
        const a = (Math.PI * 2 / 5) * i - Math.PI / 2;
        g.fillStyle(0xffffff, 0.4);
        g.fillCircle(c + Math.cos(a) * 5.5, c + Math.sin(a) * 5.5, 0.6);
      }

      this.finish(g, 'pickup_point', S, S);
    }

    // ─ pickup_life ─ pink/green 1UP heart icon, 16x16
    {
      const S = 16;
      const g = this.makeGfx(scene);
      const c = S / 2;

      // Pink/green glow
      g.fillStyle(0xff66aa, 0.25);
      g.fillCircle(c, c, 8);

      // Heart shape (two circles + triangle)
      g.fillStyle(0xff4488, 1);
      g.fillCircle(c - 2.5, c - 2, 3.5);
      g.fillCircle(c + 2.5, c - 2, 3.5);
      g.fillTriangle(c - 6, c - 1, c + 6, c - 1, c, c + 6);

      // Heart highlight
      g.fillStyle(0xff88bb, 0.6);
      g.fillCircle(c - 2, c - 3, 2);

      // Green cross overlay (1UP indicator)
      g.fillStyle(0x44ff88, 0.8);
      g.fillRect(c - 3.5, c - 1, 7, 2);
      g.fillRect(c - 1, c - 3.5, 2, 7);

      // Center sparkle
      g.fillStyle(0xffffff, 0.6);
      g.fillCircle(c, c - 1, 1);

      this.finish(g, 'pickup_life', S, S);
    }

    // ─ pickup_bomb ─ yellow star with glow, 16x16
    {
      const S = 16;
      const g = this.makeGfx(scene);
      const c = S / 2;

      // Golden glow
      g.fillStyle(0xffcc00, 0.25);
      g.fillCircle(c, c, 8);

      // 4-pointed star
      g.fillStyle(0xffdd22, 1);
      g.fillTriangle(c, 0, c - 2.5, c, c + 2.5, c);
      g.fillTriangle(c, S, c - 2.5, c, c + 2.5, c);
      g.fillTriangle(0, c, c, c - 2.5, c, c + 2.5);
      g.fillTriangle(S, c, c, c - 2.5, c, c + 2.5);

      // Inner 4-pointed star (rotated 45)
      g.fillStyle(0xffee66, 0.7);
      const d = 4;
      g.fillTriangle(c - d, c - d, c - 1, c, c, c - 1);
      g.fillTriangle(c + d, c - d, c + 1, c, c, c - 1);
      g.fillTriangle(c - d, c + d, c - 1, c, c, c + 1);
      g.fillTriangle(c + d, c + d, c + 1, c, c, c + 1);

      // Bright center
      g.fillStyle(0xffffff, 0.9);
      g.fillCircle(c, c, 2.5);
      g.fillStyle(0xffff88, 0.7);
      g.fillCircle(c, c, 1.5);

      // Star tip sparkles
      g.fillStyle(0xffffff, 0.5);
      g.fillCircle(c, 1, 0.8);
      g.fillCircle(c, S - 1, 0.8);
      g.fillCircle(1, c, 0.8);
      g.fillCircle(S - 1, c, 0.8);

      this.finish(g, 'pickup_bomb', S, S);
    }

    // ─ pickup_option ─ cyan/teal orb (floating drone helper), 14x14
    {
      const S = 14;
      const g = this.makeGfx(scene);
      const c = S / 2;

      // Cyan glow aura
      g.fillStyle(0x00ffcc, 0.2);
      g.fillCircle(c, c, 7);

      // Outer ring
      g.lineStyle(1.5, 0x00ddaa, 0.9);
      g.strokeCircle(c, c, 5);

      // Inner orb
      g.fillStyle(0x00eebb, 1);
      g.fillCircle(c, c, 4);

      // Bright highlight (upper-left)
      g.fillStyle(0x66ffdd, 0.8);
      g.fillCircle(c - 1.2, c - 1.2, 2.2);

      // Center sparkle
      g.fillStyle(0xffffff, 0.9);
      g.fillCircle(c - 0.8, c - 0.8, 1);

      // Tiny orbiting dots
      for (let i = 0; i < 3; i++) {
        const a = (Math.PI * 2 / 3) * i;
        g.fillStyle(0x88ffee, 0.5);
        g.fillCircle(c + Math.cos(a) * 5.5, c + Math.sin(a) * 5.5, 0.7);
      }

      this.finish(g, 'pickup_option', S, S);
    }

    // ─ pickup_rapid ─ orange lightning bolt (rapid fire), 14x16
    {
      const W = 14, H = 16;
      const g = this.makeGfx(scene);
      const cx = W / 2, cy = H / 2;

      // Orange glow
      g.fillStyle(0xff8800, 0.2);
      g.fillCircle(cx, cy, 8);

      // Lightning bolt shape
      g.fillStyle(0xff9922, 1);
      g.fillTriangle(cx + 3, 1, cx - 2, cy, cx + 1, cy);
      g.fillTriangle(cx - 1, cy, cx - 4, H - 1, cx + 2, cy);

      // Lighter inner bolt
      g.fillStyle(0xffcc44, 0.8);
      g.fillTriangle(cx + 2, 3, cx - 0.5, cy, cx + 1.5, cy);
      g.fillTriangle(cx - 0.5, cy, cx - 2.5, H - 3, cx + 1.5, cy);

      // Bright core line
      g.lineStyle(1.5, 0xffee88, 0.9);
      g.lineBetween(cx + 1, 2, cx - 0.5, cy);
      g.lineBetween(cx + 0.5, cy, cx - 2, H - 2);

      // Sparkle at top
      g.fillStyle(0xffffff, 0.7);
      g.fillCircle(cx + 1.5, 2, 1);

      this.finish(g, 'pickup_rapid', W, H);
    }

    // ─ pickup_rear ─ purple double-arrow pointing backward, 16x14
    {
      const W = 16, H = 14;
      const g = this.makeGfx(scene);
      const cx = W / 2, cy = H / 2;

      // Purple glow
      g.fillStyle(0xaa44ff, 0.2);
      g.fillCircle(cx, cy, 8);

      // Left-pointing arrow (backward shot indicator)
      g.fillStyle(0x9944ee, 1);
      g.fillTriangle(2, cy, cx, cy - 5, cx, cy + 5);

      // Second arrow slightly right
      g.fillStyle(0xbb66ff, 0.9);
      g.fillTriangle(cx - 2, cy, W - 3, cy - 4, W - 3, cy + 4);

      // Bright highlight streaks
      g.lineStyle(1.5, 0xcc88ff, 0.8);
      g.lineBetween(4, cy, cx - 1, cy);
      g.lineBetween(cx + 1, cy, W - 4, cy);

      // Center sparkle
      g.fillStyle(0xeeccff, 0.9);
      g.fillCircle(cx, cy, 1.5);
      g.fillStyle(0xffffff, 0.7);
      g.fillCircle(cx - 0.3, cy - 0.3, 0.8);

      this.finish(g, 'pickup_rear', W, H);
    }
  }

  // ── UI ASSETS ────────────────────────────────────────────────────

  private static generateUIAssets(scene: Phaser.Scene): void {
    // ─ hud_frame ─ dark panel with ornate mystical border, 240x540
    {
      const W = 240, H = 540;
      const g = this.makeGfx(scene);

      // Background - deep indigo
      g.fillStyle(0x0a0814, 0.88);
      g.fillRoundedRect(0, 0, W, H, 4);

      // Outer ornate border (purple tint)
      g.lineStyle(2, 0x554488, 0.7);
      g.strokeRoundedRect(1, 1, W - 2, H - 2, 4);

      // Inner accent line
      g.lineStyle(1, 0x443366, 0.4);
      g.strokeRoundedRect(4, 4, W - 8, H - 8, 2);

      // Corner ornaments (small magical circles)
      const corners = [[8, 8], [W - 8, 8], [8, H - 8], [W - 8, H - 8]];
      for (const [x, y] of corners) {
        g.fillStyle(0x8866cc, 0.3);
        g.fillCircle(x, y, 3);
        g.fillStyle(0xaa88ee, 0.2);
        g.fillCircle(x, y, 1.5);
      }

      // Top decorative line glow
      g.fillStyle(0x6644aa, 0.12);
      g.fillRect(4, 4, W - 8, 2);

      // Subtle side filigree dots
      for (let y = 20; y < H - 20; y += 40) {
        g.fillStyle(0x6644aa, 0.15);
        g.fillCircle(4, y, 1);
        g.fillCircle(W - 4, y, 1);
      }

      this.finish(g, 'hud_frame', W, H);
    }

    // ─ life_icon ─ pink heart, 12x12
    {
      const S = 12;
      const g = this.makeGfx(scene);
      const c = S / 2;

      // Heart shape
      g.fillStyle(0xff3366, 1);
      g.fillCircle(c - 2, c - 1, 3);
      g.fillCircle(c + 2, c - 1, 3);
      g.fillTriangle(c - 5, c, c + 5, c, c, c + 5);

      // Highlight
      g.fillStyle(0xff88aa, 0.6);
      g.fillCircle(c - 2, c - 2.5, 1.5);

      // Sparkle
      g.fillStyle(0xffffff, 0.5);
      g.fillCircle(c - 2, c - 2, 0.8);

      this.finish(g, 'life_icon', S, S);
    }

    // ─ bomb_icon ─ yellow star, 12x12
    {
      const S = 12;
      const g = this.makeGfx(scene);
      const c = S / 2;

      // 4-point star
      g.fillStyle(0xffdd44, 1);
      g.fillTriangle(c, 0, c - 2, c, c + 2, c);
      g.fillTriangle(c, S, c - 2, c, c + 2, c);
      g.fillTriangle(0, c, c, c - 2, c, c + 2);
      g.fillTriangle(S, c, c, c - 2, c, c + 2);

      // Inner glow
      g.fillStyle(0xffee88, 0.8);
      g.fillCircle(c, c, 2);
      g.fillStyle(0xffffff, 0.7);
      g.fillCircle(c, c, 1);

      this.finish(g, 'bomb_icon', S, S);
    }

    // ─ button ─ ornate menu button, 200x40
    {
      const W = 200, H = 40;
      const g = this.makeGfx(scene);

      // Button background - deep purple
      g.fillStyle(0x1a1430, 0.92);
      g.fillRoundedRect(0, 0, W, H, 6);

      // Ornate border (purple/gold)
      g.lineStyle(2, 0x6644aa, 0.8);
      g.strokeRoundedRect(1, 1, W - 2, H - 2, 6);

      // Inner border accent
      g.lineStyle(1, 0x8866cc, 0.3);
      g.strokeRoundedRect(3, 3, W - 6, H - 6, 4);

      // Top highlight gradient
      g.fillStyle(0x8866cc, 0.12);
      g.fillRoundedRect(4, 2, W - 8, H / 3, 3);

      // Bottom decorative line
      g.lineStyle(1, 0x554488, 0.3);
      g.lineBetween(10, H - 6, W - 10, H - 6);

      // Corner dots
      g.fillStyle(0xaa88ee, 0.4);
      g.fillCircle(8, H / 2, 1.5);
      g.fillCircle(W - 8, H / 2, 1.5);

      this.finish(g, 'button', W, H);
    }

    // ─ boss_warning ─ WARNING banner with magical flair, 400x60
    {
      const W = 400, H = 60;
      const g = this.makeGfx(scene);

      // Dark mystical background
      g.fillStyle(0x180022, 0.85);
      g.fillRect(0, 0, W, H);

      // Purple/magenta border bars
      g.fillStyle(0xcc22ff, 0.6);
      g.fillRect(0, 0, W, 3);
      g.fillRect(0, H - 3, W, 3);

      // Magical pattern stripes
      const stripeW = 16;
      for (let x = 0; x < W; x += stripeW * 2) {
        g.fillStyle(0xaa22cc, 0.15);
        g.fillRect(x, 4, stripeW, 3);
        g.fillRect(x + stripeW, H - 7, stripeW, 3);
      }

      // Center spell circle area for text overlay
      g.fillStyle(0x8800cc, 0.1);
      g.fillRect(40, 10, W - 80, H - 20);
      g.lineStyle(1, 0xcc44ff, 0.4);
      g.strokeRect(40, 10, W - 80, H - 20);

      // Magical symbols on sides (spell circles)
      // Left circles
      g.lineStyle(1.5, 0xcc44ff, 0.5);
      g.strokeCircle(20, H / 2, 10);
      g.lineStyle(1, 0xff66ff, 0.3);
      g.strokeCircle(20, H / 2, 6);
      g.fillStyle(0xff44cc, 0.6);
      g.fillCircle(20, H / 2, 2);

      // Right circles
      g.lineStyle(1.5, 0xcc44ff, 0.5);
      g.strokeCircle(W - 20, H / 2, 10);
      g.lineStyle(1, 0xff66ff, 0.3);
      g.strokeCircle(W - 20, H / 2, 6);
      g.fillStyle(0xff44cc, 0.6);
      g.fillCircle(W - 20, H / 2, 2);

      // Rune dots on side circles
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 / 6) * i;
        g.fillStyle(0xddaaff, 0.5);
        g.fillCircle(20 + Math.cos(a) * 10, H / 2 + Math.sin(a) * 10, 1);
        g.fillCircle(W - 20 + Math.cos(a) * 10, H / 2 + Math.sin(a) * 10, 1);
      }

      // Sparkle accents
      g.fillStyle(0xffffff, 0.3);
      g.fillCircle(60, H / 2, 1);
      g.fillCircle(W - 60, H / 2, 1);

      this.finish(g, 'boss_warning', W, H);
    }
  }

  // ── BACKGROUND ASSETS ────────────────────────────────────────────

  private static generateBackgrounds(scene: Phaser.Scene): void {
    // ─ bg_stage1 ─ night sky with cherry blossoms and moonlight, 480x640
    {
      const W = 480, H = 640;
      const g = this.makeGfx(scene);

      // Base fill - deep midnight blue
      g.fillStyle(0x060818, 1);
      g.fillRect(0, 0, W, H);

      // Moonlight gradient (upper area)
      g.fillStyle(0x0a1028, 0.6);
      g.fillEllipse(W * 0.6, H * 0.15, 400, 250);
      g.fillStyle(0x101838, 0.4);
      g.fillEllipse(W * 0.4, H * 0.3, 350, 200);

      // Moon (subtle, upper right)
      g.fillStyle(0x223355, 0.3);
      g.fillCircle(W * 0.75, H * 0.1, 40);
      g.fillStyle(0x334466, 0.2);
      g.fillCircle(W * 0.75, H * 0.1, 30);
      g.fillStyle(0x445577, 0.15);
      g.fillCircle(W * 0.75, H * 0.1, 20);

      // Blue/purple nebula wisps
      const nebulaColors = [0x0c1233, 0x0a1030, 0x0e1440, 0x081230];
      for (let i = 0; i < 6; i++) {
        const nx = Math.sin(i * 1.9) * W * 0.3 + W / 2;
        const ny = Math.cos(i * 2.1) * H * 0.3 + H / 2;
        const nr = 80 + Math.sin(i * 0.7) * 30;
        g.fillStyle(nebulaColors[i % nebulaColors.length], 0.2);
        g.fillEllipse(nx, ny, nr * 2, nr * 1.3);
      }

      // Stars
      let seed = 42;
      const rand = () => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        return seed / 0x7fffffff;
      };

      // Dim stars
      for (let i = 0; i < 100; i++) {
        g.fillStyle(0x8899cc, 0.15 + rand() * 0.2);
        g.fillCircle(rand() * W, rand() * H, 0.4 + rand() * 0.4);
      }
      // Medium stars
      for (let i = 0; i < 30; i++) {
        g.fillStyle(0xaabbdd, 0.35 + rand() * 0.25);
        g.fillCircle(rand() * W, rand() * H, 0.6 + rand() * 0.6);
      }
      // Bright stars
      for (let i = 0; i < 10; i++) {
        const sx = rand() * W, sy = rand() * H;
        g.fillStyle(0x4466aa, 0.12);
        g.fillCircle(sx, sy, 3);
        g.fillStyle(0xccddff, 0.6 + rand() * 0.3);
        g.fillCircle(sx, sy, 1);
      }

      // Cherry blossom petals scattered across the sky
      for (let i = 0; i < 25; i++) {
        const px = rand() * W;
        const py = rand() * H;
        const pr = 2 + rand() * 3;
        // Petal = small ellipse
        g.fillStyle(0xff88aa, 0.15 + rand() * 0.15);
        g.fillEllipse(px, py, pr * 2, pr);
      }
      // Larger petal clusters
      for (let i = 0; i < 8; i++) {
        const px = rand() * W;
        const py = rand() * H;
        g.fillStyle(0xff6699, 0.08);
        g.fillCircle(px, py, 8 + rand() * 6);
        // Individual petals around cluster
        for (let j = 0; j < 3; j++) {
          const a = rand() * Math.PI * 2;
          const d = 4 + rand() * 6;
          g.fillStyle(0xff88bb, 0.12 + rand() * 0.08);
          g.fillEllipse(px + Math.cos(a) * d, py + Math.sin(a) * d, 3, 1.5);
        }
      }

      this.finish(g, 'bg_stage1', W, H);
    }

    // ─ bg_stage2 ─ crimson shrine corridor with torii gates, 480x640
    {
      const W = 480, H = 640;
      const g = this.makeGfx(scene);

      // Base fill - dark crimson
      g.fillStyle(0x0c0408, 1);
      g.fillRect(0, 0, W, H);

      // Red ambient fog
      g.fillStyle(0x1a0808, 0.4);
      g.fillRect(0, 0, W, H);
      g.fillStyle(0x220a0a, 0.3);
      g.fillEllipse(W * 0.3, H * 0.3, 350, 250);
      g.fillStyle(0x1e0808, 0.25);
      g.fillEllipse(W * 0.7, H * 0.6, 300, 280);

      // Mist layers
      g.fillStyle(0x331111, 0.12);
      g.fillEllipse(W * 0.5, H * 0.5, W, 100);
      g.fillStyle(0x2a0e0e, 0.1);
      g.fillEllipse(W * 0.3, H * 0.8, W * 0.8, 80);

      // Torii gate silhouettes (receding into distance)
      const drawTorii = (x: number, topY: number, w: number, h: number, alpha: number) => {
        const color = 0x661111;
        // Pillars
        g.fillStyle(color, alpha);
        g.fillRect(x - w / 2, topY, 4, h);
        g.fillRect(x + w / 2 - 4, topY, 4, h);
        // Top beam
        g.fillRect(x - w / 2 - 4, topY, w + 8, 4);
        // Second beam
        g.fillRect(x - w / 2 + 2, topY + 8, w - 4, 3);
      };

      // Far gates (small, dim)
      drawTorii(W * 0.5, H * 0.1, 40, 60, 0.12);
      drawTorii(W * 0.48, H * 0.2, 60, 80, 0.15);
      drawTorii(W * 0.5, H * 0.32, 80, 100, 0.18);
      // Closer gates (larger, brighter)
      drawTorii(W * 0.5, H * 0.46, 120, 130, 0.22);
      drawTorii(W * 0.5, H * 0.62, 160, 150, 0.25);

      // Stone lantern silhouettes on sides
      g.fillStyle(0x442222, 0.15);
      g.fillRect(40, H * 0.4, 12, 30);
      g.fillRect(40 - 4, H * 0.4 - 8, 20, 8);
      g.fillStyle(0xff4422, 0.04);
      g.fillCircle(46, H * 0.4 - 4, 6);

      g.fillStyle(0x442222, 0.15);
      g.fillRect(W - 52, H * 0.6, 12, 30);
      g.fillRect(W - 56, H * 0.6 - 8, 20, 8);
      g.fillStyle(0xff4422, 0.04);
      g.fillCircle(W - 46, H * 0.6 - 4, 6);

      // Red paper lantern glow spots
      g.fillStyle(0xff2200, 0.05);
      g.fillCircle(W * 0.2, H * 0.25, 20);
      g.fillCircle(W * 0.8, H * 0.35, 18);
      g.fillCircle(W * 0.15, H * 0.65, 15);
      g.fillCircle(W * 0.85, H * 0.75, 16);

      // Scattered dim stars through gaps
      let seed = 77;
      const rand = () => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        return seed / 0x7fffffff;
      };
      for (let i = 0; i < 20; i++) {
        g.fillStyle(0x664444, 0.15 + rand() * 0.1);
        g.fillCircle(rand() * W, rand() * H * 0.4, 0.5);
      }

      // Falling petal hints (red)
      for (let i = 0; i < 10; i++) {
        g.fillStyle(0xff4444, 0.06 + rand() * 0.04);
        g.fillEllipse(rand() * W, rand() * H, 3, 1.5);
      }

      this.finish(g, 'bg_stage2', W, H);
    }

    // ─ bg_stage3 ─ cosmic void with purple nebula and floating magical circles, 480x640
    {
      const W = 480, H = 640;
      const g = this.makeGfx(scene);

      // Base fill - deep void purple-black
      g.fillStyle(0x060410, 1);
      g.fillRect(0, 0, W, H);

      // Swirling nebula clouds
      g.fillStyle(0x140822, 0.3);
      g.fillEllipse(W * 0.5, H * 0.25, 380, 200);
      g.fillStyle(0x120720, 0.25);
      g.fillEllipse(W * 0.3, H * 0.55, 280, 320);
      g.fillStyle(0x0e0418, 0.22);
      g.fillEllipse(W * 0.7, H * 0.75, 320, 200);
      g.fillStyle(0x1a0a33, 0.15);
      g.fillEllipse(W * 0.6, H * 0.4, 200, 300);

      // Additional purple tint regions
      g.fillStyle(0x200a3a, 0.1);
      g.fillEllipse(W * 0.4, H * 0.15, 180, 120);
      g.fillStyle(0x180630, 0.12);
      g.fillEllipse(W * 0.7, H * 0.5, 160, 220);

      // Energy streams (wavy vertical magical currents)
      const streamColors = [0x5500cc, 0x6622bb, 0x4400aa, 0x7733dd];
      for (let s = 0; s < 5; s++) {
        const sx = 50 + s * 90 + Math.sin(s * 1.3) * 25;
        g.lineStyle(1, streamColors[s % streamColors.length], 0.1);
        for (let y = 0; y < H - 4; y += 4) {
          const x1 = sx + Math.sin(y * 0.015 + s) * 18;
          const x2 = sx + Math.sin((y + 4) * 0.015 + s) * 18;
          g.lineBetween(x1, y, x2, y + 4);
        }
      }

      // Floating magical circles (spell circles in the void)
      const drawVoidCircle = (cx: number, cy: number, r: number, alpha: number) => {
        g.lineStyle(1, 0x8844cc, alpha);
        g.strokeCircle(cx, cy, r);
        g.lineStyle(1, 0xaa66ee, alpha * 0.6);
        g.strokeCircle(cx, cy, r * 0.65);
        // Rune dots
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI * 2 / 6) * i;
          g.fillStyle(0xcc88ff, alpha * 0.8);
          g.fillCircle(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 1);
        }
        // Cross inside
        g.lineStyle(1, 0x7733bb, alpha * 0.4);
        g.lineBetween(cx - r * 0.5, cy, cx + r * 0.5, cy);
        g.lineBetween(cx, cy - r * 0.5, cx, cy + r * 0.5);
      };

      drawVoidCircle(W * 0.2, H * 0.2, 25, 0.1);
      drawVoidCircle(W * 0.75, H * 0.35, 18, 0.08);
      drawVoidCircle(W * 0.4, H * 0.7, 22, 0.09);
      drawVoidCircle(W * 0.85, H * 0.8, 15, 0.07);
      drawVoidCircle(W * 0.15, H * 0.55, 12, 0.06);

      // Stars
      let seed = 123;
      const rand = () => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        return seed / 0x7fffffff;
      };

      // Distant dim stars
      for (let i = 0; i < 80; i++) {
        g.fillStyle(0x9988cc, 0.1 + rand() * 0.15);
        g.fillCircle(rand() * W, rand() * H, 0.4 + rand() * 0.4);
      }
      // Medium stars
      for (let i = 0; i < 20; i++) {
        g.fillStyle(0xbb99ee, 0.25 + rand() * 0.25);
        g.fillCircle(rand() * W, rand() * H, 0.7 + rand() * 0.6);
      }
      // Bright cosmic points
      for (let i = 0; i < 8; i++) {
        const sx = rand() * W, sy = rand() * H;
        g.fillStyle(0x7744aa, 0.1);
        g.fillCircle(sx, sy, 4);
        g.fillStyle(0xddbbff, 0.45);
        g.fillCircle(sx, sy, 1);
      }

      this.finish(g, 'bg_stage3', W, H);
    }
  }
}
