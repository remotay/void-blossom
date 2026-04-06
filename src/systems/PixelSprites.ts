// PixelSprites.ts - Pixel art sprite data for Void Blossom
// Replaces geometric shapes with hand-crafted pixel art character sprites
// Each sprite is a 2D array of hex color values (0 = transparent)
// Rendered at 2x scale onto canvas textures

// Color palette constants for readability
const _ = 0;           // transparent
const SK = 0xFFDDBB;   // skin
const SK2 = 0xEECCAA;  // skin shadow
const EY = 0x333366;   // dark eyes
const EH = 0xFFFFFF;   // eye highlight
const BH = 0x4444CC;   // blue hair
const BH2 = 0x3333AA;  // blue hair dark
const BH3 = 0x5555DD;  // blue hair highlight
const WH = 0xEEEEFF;   // white fabric
const WH2 = 0xDDDDEE;  // white fabric shadow
const BL = 0x6666CC;   // blue fabric
const BL2 = 0x5555AA;  // blue fabric dark
const WG = 0x88CCFF;   // wing / translucent blue
const WG2 = 0xAADDFF;  // wing highlight
const CY = 0x00FFFF;   // cyan magic glow
const CY2 = 0x44EEFF;  // cyan glow softer

// Enemy colors
const RD = 0xCC3333;   // red dress
const RD2 = 0xAA2222;  // red dark
const RW = 0xFF8888;   // red wing
const RW2 = 0xFFAAAA;  // red wing highlight
const GW = 0xCCDDFF;   // ghost white
const GW2 = 0x99BBEE;  // ghost blue
const GW3 = 0x7799CC;  // ghost dark
const RE = 0xFF4444;   // red eyes
const YY = 0xEEEEDD;   // yin-yang white
const YD = 0xCCCCBB;   // yin-yang shadow
const PK = 0xFF88AA;   // pink petal
const PK2 = 0xFF6699;  // pink petal dark
const GR = 0x88CC88;   // green
const GR2 = 0x66AA66;  // green dark
const PP = 0x664488;   // purple body
const PP2 = 0x553377;  // purple dark
const HN = 0xCCBB88;   // horn
const HN2 = 0xBBAA77;  // horn dark

// Miniboss colors
const MP = 0x8844AA;   // miniboss purple
const MP2 = 0x773399;  // miniboss purple dark
const GD = 0xFFCC44;   // gold
const GD2 = 0xDDAA33;  // gold dark

// Boss1 colors
const IB = 0x88CCFF;   // ice blue
const IB2 = 0x66AADD;  // ice blue dark
const CP = 0x9966CC;   // crystal purple
const CP2 = 0x7744AA;  // crystal purple dark
const DA = 0x4444AA;   // dark blue hair

// Boss2 colors
const FR = 0xFF4422;   // flame red
const FO = 0xFF8844;   // flame orange
const FY = 0xFFCC44;   // flame yellow
const DK = 0x442222;   // dark armor
const DK2 = 0x331111;  // dark armor shadow
const FH = 0xFF6633;   // fiery hair

// Boss3 colors
const VP = 0x6622AA;   // void purple
const VP2 = 0x551199;  // void purple dark
const CM = 0xCC44FF;   // cosmic magenta
const CM2 = 0xAA22DD;  // cosmic magenta dark
const SW = 0xFFFFFF;   // star white
const DD = 0x220044;   // dark dress
const DD2 = 0x330055;  // dark dress mid
const GC = 0xFFDD44;   // gold crown
const GC2 = 0xEECC33;  // gold crown shadow

export class PixelSprites {

  // ── PLAYER (24x16 pixel grid, 48x32 final) ──────────────────────
  private static playerData: number[][] = [
    //0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23
    [_, _, _, _, _, _, _, _, _, _, _, _,  _,  _,  _,  _, _, _, _, _, _, _, _, _],  // 0
    [_, _, _, BH2,BH2,BH, _, _, _, _, _, _,  _,  _,  _,  _, _, _, _, _, _, _, _, _],  // 1
    [_, _, BH2,BH,BH,BH,BH3,_, _, _, _, _,  _,  _,  _,  _, _, _, _, _, _, _, _, _],  // 2
    [_, BH2,BH,SK,SK,SK,BH,BH3,_, _, _, _,  _,  _,  _,  _, _, _, _, _, _, _, _, _],  // 3
    [_, BH2,BH,SK,EY,SK,EY,SK, _, _, _, _,  _,  _,  _,  _, _, _, _, _, _, CY2,_, _],  // 4
    [_, _, BH,SK,SK,SK,SK,SK,SK2,_, _, _,  _,  _,  _,  _, _, _, _, _, CY, CY2,_, _],  // 5
    [_, BH2,BH,BH,SK2,SK,SK2,_, _, _, _, _,  _,  _,  _,  _, _, _, _, CY, CY, _, _, _],  // 6
    [_, BH2,BH2,BH,WH,WH,WH,WH2,SK2,_, _, _,  _,  _,  _,  _, _, _, SK2,SK,_, _, _, _],  // 7
    [_, _, BH2,BH,WH,BL,BL,WH,WH2,_, _, _,  WG2, _,  _,  _, _, SK2,SK,_, _, _, _, _],  // 8
    [_, _, BH2,BH,BH,BL,BL,BL,WH,_, _, WG, WG2, WG,  _,  _, _, _, _, _, _, _, _, _],  // 9
    [_, _, _, BH2,BH,BL,BL2,BL,_, _, WG, WG2,WG, WG2, WG, _, _, _, _, _, _, _, _, _],  // 10
    [_, _, _, BH2,BH,BL2,BL,BL2,_, _, _, WG, WG2,WG,  _,  _, _, _, _, _, _, _, _, _],  // 11
    [_, _, _, _, BH2,BL2,BL2,_, _, _, _, _,  WG, _,  _,  _, _, _, _, _, _, _, _, _],  // 12
    [_, _, _, _, BH2,SK2,SK2,_, _, _, _, _,  _,  _,  _,  _, _, _, _, _, _, _, _, _],  // 13
    [_, _, _, BH2,BH2,SK2,_, SK2,_, _, _, _,  _,  _,  _,  _, _, _, _, _, _, _, _, _],  // 14
    [_, _, _, BH2,_, _, _, _, _, _, _, _,  _,  _,  _,  _, _, _, _, _, _, _, _, _],  // 15
  ];

  // ── ENEMY GRUNT (12x12 pixel grid, 24x24 final) ─────────────────
  private static gruntData: number[][] = [
    [_, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, RW2,RW, RW, RW2,_, _, _, _],
    [_, _, _, _, RD, SK, SK, RD, _, _, _, _],
    [_, _, _, RD, SK, EY, EY, SK, RD, _, _, _],
    [_, _, _, _, SK, SK, SK, SK, _, _, _, _],
    [_, _, RW, RD, RD, RD, RD, RD, RD, RW, _, _],
    [_, RW2,RW, _, RD, WH, WH, RD, _, RW, RW2,_],
    [_, _, _, _, RD, RD, RD, RD, _, _, _, _],
    [_, _, _, _, RD2,RD, RD, RD2,_, _, _, _],
    [_, _, _, RD2,RD2,_, _, RD2,RD2,_, _, _],
    [_, _, _, _, SK2,_, _, SK2,_, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _],
  ];

  // ── ENEMY SWOOPER (14x10 pixel grid, 28x20 final) ───────────────
  private static swooperData: number[][] = [
    [_, _, _, _, _, _, GW, GW, _, _, _, _, _, _],
    [_, _, _, _, _, GW, GW, GW, GW, _, _, _, _, _],
    [_, _, _, _, GW, GW2,GW, GW, GW2,GW, _, _, _, _],
    [_, _, _, GW, GW, RE, GW, GW, RE, GW, GW, _, _, _],
    [_, _, GW3,GW, GW, GW, GW, GW, GW, GW, GW, GW3,_, _],
    [_, GW3,GW2,GW, GW, GW2,GW2,GW2,GW, GW, GW2,GW3,_, _],
    [_, _, GW3,GW2,GW, GW, GW, GW, GW, GW2,GW3,_, _, _],
    [_, _, _, GW3,GW2,GW, GW, GW, GW2,GW3,_, _, _, _],
    [_, _, _, _, GW3,GW2,GW2,GW2,GW3,_, _, _, _, _],
    [_, _, _, _, _, GW3,GW3,GW3,_, _, _, _, _, _],
  ];

  // ── ENEMY TURRET (16x16 pixel grid, 32x32 final) ────────────────
  private static turretData: number[][] = [
    [_, _, _, _, _, _, YD, YY, YY, YD, _, _, _, _, _, _],
    [_, _, _, _, YD, YY, YY, YY, YY, YY, YY, YD, _, _, _, _],
    [_, _, _, YD, YY, YY, YY, YY, YY, YY, YY, YY, YD, _, _, _],
    [_, _, YD, YY, YY, YY, RD, RD, YY, YY, YY, YY, YY, YD, _, _],
    [_, _, YY, YY, YY, RD, RD, RD, RD, YY, YY, YY, YY, YY, _, _],
    [_, YD, YY, YY, RD, RD, EY, EY, RD, RD, YY, YY, YY, YY, YD, _],
    [YD, YY, YY, RD, RD, EY, EH, EH, EY, RD, RD, YY, YY, YY, YY, YD],
    [YY, YY, YY, RD, EY, EH, EY, EY, EH, EY, RD, YY, YY, YY, YY, YY],
    [YY, YY, YY, YY, RD, EY, EY, EY, EY, RD, YY, YY, RD, YY, YY, YY],
    [YD, YY, YY, YY, YY, RD, RD, RD, RD, YY, YY, RD, RD, YY, YY, YD],
    [_, YD, YY, YY, YY, YY, RD, RD, YY, YY, RD, RD, YY, YY, YD, _],
    [_, _, YY, YY, YY, YY, YY, YY, YY, RD, RD, YY, YY, YY, _, _],
    [_, _, YD, YY, YY, YY, YY, YY, RD, RD, YY, YY, YY, YD, _, _],
    [_, _, _, YD, YY, YY, YY, YY, YY, YY, YY, YY, YD, _, _, _],
    [_, _, _, _, YD, YY, YY, YY, YY, YY, YY, YD, _, _, _, _],
    [_, _, _, _, _, _, YD, YY, YY, YD, _, _, _, _, _, _],
  ];

  // ── ENEMY SPINNER (14x14 pixel grid, 28x28 final) ───────────────
  private static spinnerData: number[][] = [
    [_, _, _, _, _, _, PK, PK, _, _, _, _, _, _],
    [_, _, _, _, _, PK, PK2,PK, PK, _, _, _, _, _],
    [_, _, _, _, PK, PK2,PK, PK, PK2,PK, _, _, _, _],
    [_, _, _, PK, _, _, GR, GR, _, _, PK, _, _, _],
    [_, _, PK, _, _, GR, GR2,GR2,GR, _, _, PK, _, _],
    [_, PK, PK2,_, GR, GR2,SK, SK, GR2,GR, _, PK2,PK, _],
    [PK, PK2,PK, GR, GR2,SK, EY, EY, SK, GR2,GR, PK, PK2,PK],
    [PK, PK, PK2,GR, GR2,SK, SK, SK, SK, GR2,GR, PK2,PK, PK],
    [_, PK, PK2,_, GR, GR2,GR, GR, GR2,GR, _, PK2,PK, _],
    [_, _, PK, _, _, GR, GR2,GR2,GR, _, _, PK, _, _],
    [_, _, _, PK, _, _, GR, GR, _, _, PK, _, _, _],
    [_, _, _, _, PK, PK2,PK, PK, PK2,PK, _, _, _, _],
    [_, _, _, _, _, PK, PK2,PK, PK, _, _, _, _, _],
    [_, _, _, _, _, _, PK, PK, _, _, _, _, _, _],
  ];

  // ── ENEMY CARRIER (24x18 pixel grid, 48x36 final) ───────────────
  private static carrierData: number[][] = [
    [_, _, _, _, _, _, _, _, _, HN, _, _, _, _, HN, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, HN, HN2,_, _, _, _, HN2,HN, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, HN, PP, PP, _, _, _, _, PP, PP, HN, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, PP2,PP, PP, PP, PP, _, _, PP, PP, PP, PP, PP2,_, _, _, _, _, _],
    [_, _, _, _, _, PP2,PP, PP, SK, SK, PP, PP, PP, PP, SK, SK, PP, PP, PP2,_, _, _, _, _],
    [_, _, _, _, PP2,PP, PP, SK, RE, SK, SK, PP, PP, SK, SK, RE, SK, PP, PP, PP2,_, _, _, _],
    [_, _, _, _, PP, PP, PP, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, PP, PP, PP, _, _, _, _],
    [_, _, _, PP2,PP, PP, PP, PP, SK2,SK, SK, SK, SK, SK, SK, SK2,PP, PP, PP, PP, PP2,_, _, _],
    [_, _, _, PP, PP, PP, PP, PP, PP, PP, PP, PP, PP, PP, PP, PP, PP, PP, PP, PP, PP, _, _, _],
    [_, _, PP2,PP, PP, PP, PP, PP, PP, PP2,PP, PP, PP, PP, PP2,PP, PP, PP, PP, PP, PP, PP2,_, _],
    [_, _, PP, PP, PP, PP2,PP, PP, PP2,PP, PP, PP, PP, PP, PP, PP2,PP, PP, PP2,PP, PP, PP, _, _],
    [_, _, _, PP, PP, PP2,PP, PP, PP, PP, PP2,PP, PP, PP2,PP, PP, PP, PP, PP2,PP, PP, _, _, _],
    [_, _, _, _, PP, PP2,PP, PP, PP, PP2,PP, PP, PP, PP, PP2,PP, PP, PP, PP2,PP, _, _, _, _],
    [_, _, _, _, _, PP2,PP, PP, PP2,_, _, _, _, _, _, PP2,PP, PP, PP2,_, _, _, _, _],
    [_, _, _, _, _, _, PP2,PP, _, _, _, _, _, _, _, _, PP, PP2,_, _, _, _, _, _],
    [_, _, _, _, _, _, _, PP2,_, _, _, _, _, _, _, _, PP2,_, _, _, _, _, _, _],
    [_, _, _, _, _, _, PP2,SK2,_, _, _, _, _, _, _, _, SK2,PP2,_, _, _, _, _, _],
    [_, _, _, _, _, _, SK2,_, _, _, _, _, _, _, _, _, _, SK2,_, _, _, _, _, _],
  ];

  // ── ENEMY MINIBOSS (28x24 pixel grid, 56x48 final) ──────────────
  private static minibossData: number[][] = [
    [_, _, _, _, _, _, _, _, _, _, GD, GD, GD, _, _, GD, GD, GD, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, GD, GD2,GD, GD, GD, GD, GD, GD2,GD, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, GD, GD, MP, MP, MP, MP, MP, MP, MP, GD, GD, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, MP2,MP, MP, MP, MP, MP, MP, MP, MP, MP, MP, MP, MP2,_, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, MP2,MP, MP, SK, SK, SK, SK, SK, SK, SK, SK, SK, MP, MP, MP2,_, _, _, _, _, _, _],
    [_, _, _, _, _, _, MP, MP, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, MP, MP, _, _, _, _, _, _, _],
    [_, _, _, _, _, MP2,MP, SK, SK, EY, EH, SK, SK, SK, SK, EH, EY, SK, SK, MP, MP2,_, _, _, _, _, _, _],
    [_, _, _, _, _, MP, MP, SK, SK, EY, EY, SK, SK, SK, SK, EY, EY, SK, SK, MP, MP, _, _, _, _, _, _, _],
    [_, _, _, _, _, MP, MP, SK, SK, SK, SK, SK, SK2,SK2,SK, SK, SK, SK, SK, MP, MP, _, _, _, _, _, _, _],
    [_, _, _, _, _, MP, MP, MP, SK, SK, SK, SK2,SK, SK, SK2,SK, SK, SK, MP, MP, MP, _, _, _, _, _, _, _],
    [_, _, _, _, MP2,MP, MP, MP, MP, SK2,SK, SK, SK, SK, SK, SK, SK2,MP, MP, MP, MP, MP2,_, _, _, _, _, _],
    [_, _, _, WG2,WG, MP, MP, MP, MP, WH, WH, WH, WH, WH, WH, WH, WH, MP, MP, MP, MP, WG, WG2,_, _, _, _, _],
    [_, _, WG2,WG, WG, MP, MP, WH, WH, WH, BL, BL, BL, BL, BL, BL, WH, WH, WH, MP, MP, WG, WG, WG2,_, _, _, _],
    [_, WG2,WG, WG, _, MP, WH, WH, BL, BL, GD, BL, BL, BL, BL, GD, BL, BL, WH, WH, MP, _, WG, WG, WG2,_, _, _],
    [_, WG, WG, _, _, MP, WH, BL, BL, BL, BL, BL, BL, BL, BL, BL, BL, BL, BL, WH, MP, _, _, WG, WG, _, _, _],
    [_, _, _, _, _, MP2,MP, BL, BL, BL, BL2,BL, BL, BL, BL, BL2,BL, BL, BL, MP, MP2,_, _, _, _, _, _, _],
    [_, _, _, _, _, _, MP, MP, BL, BL, BL2,BL, BL, BL, BL, BL2,BL, BL, MP, MP, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, MP, MP, BL, BL2,BL, BL, BL, BL, BL, BL, BL2,BL, MP, MP, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, MP2,MP, MP, BL2,BL, BL2,BL, BL, BL2,BL, BL2,MP, MP, MP2,_, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, MP2,MP, BL2,BL2,BL, BL, BL, BL, BL2,BL2,MP, MP2,_, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, MP, MP, BL2,BL2,_, _, BL2,BL2,MP, MP, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, MP2,MP, SK2,_, _, _, _, SK2,MP, MP2,_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, SK2,SK2,_, _, _, _, SK2,SK2,_, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, SK2,_, _, _, _, _, _, SK2,_, _, _, _, _, _, _, _, _, _, _],
  ];

  // ── BOSS 1: Prism Warden (40x40 pixel grid, 80x80 final) ────────
  private static boss1Data: number[][] = PixelSprites.buildBoss1();

  private static buildBoss1(): number[][] {
    const W = 40, H = 40;
    const d: number[][] = Array.from({ length: H }, () => Array(W).fill(0));
    const set = (x: number, y: number, c: number) => {
      if (x >= 0 && x < W && y >= 0 && y < H) d[y][x] = c;
    };
    const hline = (x1: number, x2: number, y: number, c: number) => {
      for (let x = x1; x <= x2; x++) set(x, y, c);
    };
    const vline = (x: number, y1: number, y2: number, c: number) => {
      for (let y = y1; y <= y2; y++) set(x, y, c);
    };

    // Crown / halo
    hline(16, 23, 0, GD);
    hline(15, 24, 1, GD);
    set(14, 0, GD2); set(25, 0, GD2);
    set(13, 1, IB); set(26, 1, IB);
    hline(17, 22, 1, GD2);
    set(19, 0, SW); set(20, 0, SW); // star points on crown

    // Hair top flowing to left
    hline(10, 15, 2, DA); hline(16, 23, 2, BH);
    hline(9, 14, 3, DA); hline(15, 24, 3, BH); set(25, 3, BH2);
    hline(8, 13, 4, DA); hline(14, 25, 4, BH); set(26, 4, BH2);

    // Face
    hline(14, 25, 5, BH);
    hline(15, 24, 5, SK);
    hline(14, 25, 6, SK); set(13, 6, BH); set(26, 6, BH);
    hline(14, 25, 7, SK); set(13, 7, DA); set(26, 7, BH);
    // Eyes
    set(17, 7, EY); set(18, 7, EY); set(17, 6, EH);
    set(22, 7, EY); set(23, 7, EY); set(22, 6, EH);
    // Mouth
    set(19, 8, SK2); set(20, 8, SK2);
    hline(14, 25, 8, SK); set(13, 8, DA); set(26, 8, BH);
    hline(15, 24, 9, SK2); set(13, 9, DA); set(14, 9, BH); set(25, 9, BH); set(26, 9, BH2);

    // Hair flowing down on both sides
    for (let y = 5; y <= 25; y++) {
      set(8, y, DA); set(9, y, DA);
      if (y <= 20) { set(7, y, BH2); }
      if (y <= 15) { set(6, y, BH2); }
    }
    for (let y = 5; y <= 20; y++) {
      set(27, y, BH); set(28, y, BH2);
      if (y <= 15) { set(29, y, BH2); }
    }

    // Neck and shoulders
    hline(17, 22, 10, SK2);
    hline(15, 24, 11, WH);
    set(14, 11, IB); set(25, 11, IB);

    // Crystal wings (left)
    for (let i = 0; i < 8; i++) {
      set(10 - i, 11 + i, IB); set(11 - i, 11 + i, IB2);
      if (i > 0) { set(10 - i + 1, 11 + i, WG); }
    }
    for (let i = 0; i < 6; i++) {
      set(12 - i, 13 + i, IB); set(13 - i, 13 + i, WG);
    }
    // Crystal wings (right)
    for (let i = 0; i < 8; i++) {
      set(29 + i, 11 + i, IB); set(28 + i, 11 + i, IB2);
      if (i > 0) { set(29 + i - 1, 11 + i, WG); }
    }
    for (let i = 0; i < 6; i++) {
      set(27 + i, 13 + i, IB); set(26 + i, 13 + i, WG);
    }

    // Dress body (white with blue accents)
    for (let y = 12; y <= 28; y++) {
      const spread = Math.floor((y - 12) * 0.6) + 4;
      const left = 20 - spread;
      const right = 19 + spread;
      for (let x = left; x <= right; x++) {
        if (x >= 0 && x < W) {
          if (x === left || x === right) set(x, y, BL2);
          else if (x === left + 1 || x === right - 1) set(x, y, BL);
          else set(x, y, WH);
        }
      }
      // Centerline detail
      set(19, y, IB); set(20, y, IB);
    }
    // Belt / sash
    hline(15, 24, 15, CP); hline(15, 24, 16, CP2);
    set(19, 15, GD); set(20, 15, GD);

    // Arms
    for (let y = 12; y <= 18; y++) {
      set(13, y, SK2); set(26, y, SK2);
    }
    // Hands with magic
    set(12, 18, SK); set(27, 18, SK);
    set(11, 19, CY); set(28, 19, CY);
    set(11, 18, CY2); set(28, 18, CY2);

    // Lower dress flare
    for (let y = 29; y <= 35; y++) {
      const spread = Math.floor((y - 12) * 0.7) + 4;
      const left = 20 - spread;
      const right = 19 + spread;
      for (let x = left; x <= right; x++) {
        if (x >= 0 && x < W) {
          if ((x + y) % 3 === 0) set(x, y, WH2);
          else if (x === left || x === right) set(x, y, BL);
          else set(x, y, WH);
        }
      }
    }

    // Feet
    set(17, 36, SK2); set(18, 36, SK2); set(21, 36, SK2); set(22, 36, SK2);

    // Floating crystal shards
    set(4, 8, IB); set(5, 7, IB); set(5, 8, CP); set(5, 9, IB);
    set(34, 8, IB); set(35, 7, IB); set(35, 8, CP); set(35, 9, IB);
    set(3, 20, CP); set(4, 19, IB); set(4, 20, IB2); set(4, 21, CP);
    set(36, 20, CP); set(35, 19, IB); set(35, 20, IB2); set(35, 21, CP);

    return d;
  }

  // ── BOSS 2: Scarlet Tempest (40x40 pixel grid, 80x80 final) ─────
  private static boss2Data: number[][] = PixelSprites.buildBoss2();

  private static buildBoss2(): number[][] {
    const W = 40, H = 40;
    const d: number[][] = Array.from({ length: H }, () => Array(W).fill(0));
    const set = (x: number, y: number, c: number) => {
      if (x >= 0 && x < W && y >= 0 && y < H) d[y][x] = c;
    };
    const hline = (x1: number, x2: number, y: number, c: number) => {
      for (let x = x1; x <= x2; x++) set(x, y, c);
    };

    // Wild fiery hair streaming back
    for (let y = 0; y <= 4; y++) {
      const w = 3 + y * 2;
      hline(20 - w, 20 + w, y, FH);
      // flame tips
      if (y < 3) { set(20 - w - 1, y, FO); set(20 + w + 1, y, FO); }
    }
    hline(8, 32, 3, FH);
    hline(7, 33, 4, FR);
    // Hair extends far right and up for "wild" effect
    set(34, 3, FO); set(35, 2, FO); set(36, 1, FY);
    set(34, 4, FH); set(35, 3, FO); set(36, 2, FY);
    set(5, 3, FO); set(4, 2, FO); set(3, 1, FY);

    // Face
    hline(15, 24, 5, SK); set(14, 5, FH); set(25, 5, FH);
    hline(14, 25, 6, SK); set(13, 6, FH); set(26, 6, FH);
    hline(14, 25, 7, SK);
    // Fierce eyes
    set(17, 7, RE); set(18, 7, EY); set(17, 6, EH);
    set(22, 7, EY); set(23, 7, RE); set(23, 6, EH);
    hline(14, 25, 8, SK);
    set(19, 9, SK2); set(20, 9, SK2); // mouth
    hline(15, 24, 9, SK2);

    // Hair continues flowing down sides
    for (let y = 5; y <= 22; y++) {
      set(7, y, FR); set(8, y, FH);
      set(31, y, FH); set(32, y, FR);
      if (y <= 15) { set(6, y, FO); set(33, y, FO); }
      if (y <= 10) { set(5, y, FY); set(34, y, FY); }
    }

    // Neck
    hline(17, 22, 10, SK2);

    // Dark armor torso
    hline(14, 25, 11, DK);
    for (let y = 12; y <= 20; y++) {
      const spread = Math.min(7, 4 + Math.floor((y - 12) * 0.4));
      hline(20 - spread, 19 + spread, y, DK);
      // Red accent lines
      set(20 - spread + 1, y, FR); set(19 + spread - 1, y, FR);
    }
    // Armor highlights
    set(19, 13, FR); set(20, 13, FR);
    set(19, 14, FO); set(20, 14, FO);
    hline(17, 22, 12, DK2);
    set(19, 12, FR); set(20, 12, FR);

    // Flame wings (left)
    for (let i = 0; i < 10; i++) {
      set(12 - i, 11 + i, FR);
      set(11 - i, 11 + i, FO);
      if (i > 1) set(10 - i, 11 + i, FY);
      if (i > 0) set(12 - i + 1, 11 + i, FH);
    }
    // Flame wings (right)
    for (let i = 0; i < 10; i++) {
      set(27 + i, 11 + i, FR);
      set(28 + i, 11 + i, FO);
      if (i > 1) set(29 + i, 11 + i, FY);
      if (i > 0) set(27 + i - 1, 11 + i, FH);
    }

    // Skirt with flame edge
    for (let y = 21; y <= 33; y++) {
      const spread = 7 + Math.floor((y - 21) * 0.6);
      hline(20 - spread, 19 + spread, y, DK);
      set(20 - spread, y, FR); set(19 + spread, y, FR);
      if ((y + 1) % 2 === 0) {
        set(20 - spread - 1, y, FO);
        set(19 + spread + 1, y, FO);
      }
    }
    // Flame edge at bottom
    for (let x = 8; x <= 31; x++) {
      if (x % 2 === 0) { set(x, 34, FR); set(x, 35, FO); }
      else { set(x, 34, FO); set(x, 35, FY); }
    }

    // Arms
    for (let y = 12; y <= 19; y++) {
      set(13, y, SK2); set(26, y, SK2);
    }
    set(12, 19, SK); set(27, 19, SK);

    // Feet
    set(17, 34, SK2); set(18, 34, SK2); set(22, 34, SK2); set(23, 34, SK2);

    // Fire particles
    set(5, 15, FY); set(6, 16, FO); set(34, 14, FY); set(35, 15, FO);
    set(3, 25, FO); set(4, 26, FY); set(36, 25, FO); set(37, 24, FY);
    set(8, 30, FY); set(32, 28, FY);

    return d;
  }

  // ── BOSS 3: Void Empress (48x48 pixel grid, 96x96 final) ────────
  private static boss3Data: number[][] = PixelSprites.buildBoss3();

  private static buildBoss3(): number[][] {
    const W = 48, H = 48;
    const d: number[][] = Array.from({ length: H }, () => Array(W).fill(0));
    const set = (x: number, y: number, c: number) => {
      if (x >= 0 && x < W && y >= 0 && y < H) d[y][x] = c;
    };
    const hline = (x1: number, x2: number, y: number, c: number) => {
      for (let x = x1; x <= x2; x++) set(x, y, c);
    };

    // Cosmic crown with stars
    set(23, 0, GC); set(24, 0, GC);
    hline(20, 27, 1, GC);
    hline(19, 28, 2, GC2);
    set(21, 1, SW); set(26, 1, SW); // star points
    set(23, 0, SW); set(24, 0, SW);
    // Crown side points
    set(18, 1, GC); set(29, 1, GC);
    set(17, 0, GC2); set(30, 0, GC2);

    // Hair top
    hline(13, 17, 3, VP); hline(18, 29, 3, VP2); hline(30, 34, 3, VP);
    hline(11, 16, 4, VP); hline(17, 30, 4, VP2); hline(31, 36, 4, VP);
    hline(10, 15, 5, VP); hline(16, 31, 5, VP2); hline(32, 37, 5, VP);

    // Face area
    hline(16, 31, 6, SK); set(15, 6, VP); set(32, 6, VP);
    hline(15, 32, 7, SK); set(14, 7, VP); set(33, 7, VP);
    hline(15, 32, 8, SK); set(14, 8, VP); set(33, 8, VP);
    // Eyes - larger for boss
    set(20, 8, EY); set(21, 8, EY); set(20, 7, EH); set(21, 7, CM);
    set(27, 8, EY); set(28, 8, EY); set(27, 7, CM); set(28, 7, EH);
    hline(15, 32, 9, SK); set(14, 9, VP); set(33, 9, VP);
    // Small mouth
    set(23, 10, SK2); set(24, 10, SK2);
    hline(16, 31, 10, SK2); set(15, 10, VP); set(32, 10, VP);
    hline(17, 30, 11, SK2);

    // Hair flowing down both sides (long, flowing)
    for (let y = 6; y <= 38; y++) {
      const fade = Math.min(1.0, (y - 6) / 20);
      set(10, y, VP2); set(11, y, VP);
      if (y <= 30) { set(9, y, VP2); }
      if (y <= 25) { set(8, y, VP); }
      if (y <= 20) { set(7, y, VP2); }
      set(37, y, VP); set(36, y, VP2);
      if (y <= 30) { set(38, y, VP); }
      if (y <= 25) { set(39, y, VP2); }
      if (y <= 20) { set(40, y, VP); }
      // Cosmic sparkles in hair
      if (y % 5 === 0 && y > 10) {
        set(9, y, CM); set(38, y, CM);
      }
    }

    // Neck and shoulders
    hline(20, 27, 12, SK2);
    hline(16, 31, 13, DD2);

    // Cosmic wings (dark with star points) - LEFT
    for (let i = 0; i < 14; i++) {
      set(13 - i, 12 + i, VP); set(12 - i, 12 + i, VP2);
      if (i > 1) set(14 - i, 12 + i, DD2);
      // Star twinkles on wings
      if (i % 3 === 0 && i > 0) set(12 - i, 12 + i, SW);
    }
    for (let i = 0; i < 10; i++) {
      set(14 - i, 14 + i, VP2); set(15 - i, 14 + i, DD2);
      if (i % 4 === 0) set(14 - i, 14 + i, CM);
    }
    // RIGHT wing
    for (let i = 0; i < 14; i++) {
      set(34 + i, 12 + i, VP); set(35 + i, 12 + i, VP2);
      if (i > 1) set(33 + i, 12 + i, DD2);
      if (i % 3 === 0 && i > 0) set(35 + i, 12 + i, SW);
    }
    for (let i = 0; i < 10; i++) {
      set(33 + i, 14 + i, VP2); set(32 + i, 14 + i, DD2);
      if (i % 4 === 0) set(33 + i, 14 + i, CM);
    }

    // Elaborate dress - dark with galaxy pattern
    for (let y = 14; y <= 40; y++) {
      const spread = Math.floor((y - 14) * 0.7) + 6;
      const left = 24 - spread;
      const right = 23 + spread;
      for (let x = left; x <= right; x++) {
        if (x >= 0 && x < W) {
          if (x === left || x === right) {
            set(x, y, CM);
          } else if (x === left + 1 || x === right - 1) {
            set(x, y, VP);
          } else {
            // Galaxy pattern inside dress
            if ((x * 7 + y * 13) % 17 === 0) set(x, y, CM);
            else if ((x * 3 + y * 5) % 11 === 0) set(x, y, SW);
            else if ((x + y) % 7 === 0) set(x, y, DD2);
            else set(x, y, DD);
          }
        }
      }
    }

    // Sash / belt with gold
    hline(17, 30, 18, GC);
    hline(17, 30, 19, GC2);
    set(23, 18, SW); set(24, 18, SW);

    // Arms
    for (let y = 14; y <= 22; y++) {
      set(15, y, SK2); set(32, y, SK2);
    }
    set(14, 22, SK); set(33, 22, SK);
    // Magic aura near hands
    set(13, 23, CM); set(14, 23, CM2); set(34, 23, CM2); set(33, 23, CM);
    set(13, 22, CM2); set(34, 22, CM2);

    // Orbital ring (elliptical orbit around the figure)
    const orbitCx = 24, orbitCy = 22;
    for (let angle = 0; angle < 360; angle += 8) {
      const rad = (angle * Math.PI) / 180;
      const ox = Math.round(orbitCx + Math.cos(rad) * 20);
      const oy = Math.round(orbitCy + Math.sin(rad) * 4);
      if (ox >= 0 && ox < W && oy >= 0 && oy < H) {
        // Only draw orbital dots where they don't overlap the main body much
        if (ox < 12 || ox > 35) {
          set(ox, oy, CM);
          if (angle % 24 === 0) set(ox, oy, SW); // bright spots on orbit
        }
      }
    }

    // Dress bottom flare with cosmic edge
    for (let y = 41; y <= 44; y++) {
      const spread = Math.floor((y - 14) * 0.7) + 6;
      const left = 24 - spread;
      const right = 23 + spread;
      for (let x = left; x <= right; x++) {
        if (x >= 0 && x < W) {
          if (x % 2 === 0) set(x, y, VP);
          else set(x, y, DD2);
        }
      }
      // Edge cosmic glow
      if (left >= 0) set(left, y, CM);
      if (right < W) set(right, y, CM);
    }

    // Feet
    set(21, 45, SK2); set(22, 45, SK2); set(25, 45, SK2); set(26, 45, SK2);

    // Floating star particles around her
    set(5, 5, SW); set(42, 8, SW); set(3, 30, SW);
    set(44, 25, SW); set(7, 40, SW); set(40, 42, SW);
    set(2, 18, CM); set(45, 15, CM);

    return d;
  }

  // ── Sprite registry ──────────────────────────────────────────────
  private static spriteMap: {
    key: string;
    data: number[][];
    pixelW: number;
    pixelH: number;
    scale: number;
  }[] = [];

  private static initRegistry(): void {
    PixelSprites.spriteMap = [
      { key: 'player',        data: PixelSprites.playerData,    pixelW: 24, pixelH: 16, scale: 2 },
      { key: 'enemy_grunt',   data: PixelSprites.gruntData,     pixelW: 12, pixelH: 12, scale: 2 },
      { key: 'enemy_swooper', data: PixelSprites.swooperData,   pixelW: 14, pixelH: 10, scale: 2 },
      { key: 'enemy_turret',  data: PixelSprites.turretData,    pixelW: 16, pixelH: 16, scale: 2 },
      { key: 'enemy_spinner', data: PixelSprites.spinnerData,   pixelW: 14, pixelH: 14, scale: 2 },
      { key: 'enemy_carrier', data: PixelSprites.carrierData,   pixelW: 24, pixelH: 18, scale: 2 },
      { key: 'enemy_miniboss',data: PixelSprites.minibossData,  pixelW: 28, pixelH: 24, scale: 2 },
      { key: 'boss1',         data: PixelSprites.boss1Data,     pixelW: 40, pixelH: 40, scale: 2 },
      { key: 'boss2',         data: PixelSprites.boss2Data,     pixelW: 40, pixelH: 40, scale: 2 },
      { key: 'boss3',         data: PixelSprites.boss3Data,     pixelW: 48, pixelH: 48, scale: 2 },
    ];
  }

  // ── Render a single sprite to a Phaser canvas texture ────────────
  private static renderSprite(
    scene: Phaser.Scene,
    key: string,
    data: number[][],
    pixelW: number,
    pixelH: number,
    scale: number,
  ): void {
    const texW = pixelW * scale;
    const texH = pixelH * scale;
    const texture = scene.textures.createCanvas(key, texW, texH);
    if (!texture) return;
    const ctx = texture.getContext();

    for (let y = 0; y < pixelH; y++) {
      const row = data[y];
      if (!row) continue;
      for (let x = 0; x < pixelW; x++) {
        const color = row[x];
        if (color !== 0) {
          ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }

    texture.refresh();
  }

  // ── Public API ───────────────────────────────────────────────────

  /**
   * Render all pixel art sprites as new Phaser canvas textures.
   * Call this when no prior textures exist (fresh generation).
   */
  static renderAll(scene: Phaser.Scene): void {
    PixelSprites.initRegistry();
    for (const entry of PixelSprites.spriteMap) {
      PixelSprites.renderSprite(
        scene,
        entry.key,
        entry.data,
        entry.pixelW,
        entry.pixelH,
        entry.scale,
      );
    }
  }

  /**
   * Override character textures that were already created by AssetGenerator.
   * Removes existing textures and replaces them with pixel art versions.
   * Safe to call after AssetGenerator.generateAll() — only touches character keys.
   */
  static overrideCharacterTextures(scene: Phaser.Scene): void {
    PixelSprites.initRegistry();
    for (const entry of PixelSprites.spriteMap) {
      // Remove the old geometric texture if it exists
      if (scene.textures.exists(entry.key)) {
        scene.textures.remove(entry.key);
      }
      // Create the pixel art replacement
      PixelSprites.renderSprite(
        scene,
        entry.key,
        entry.data,
        entry.pixelW,
        entry.pixelH,
        entry.scale,
      );
    }
  }
}
