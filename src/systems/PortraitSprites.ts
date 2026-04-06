// PortraitSprites.ts - Large pixel art character portraits for dialogue sequences
// Each portrait is a 40x48 pixel grid rendered at 2x scale (80x96 final)
// Used in pre-boss dialogue boxes for Touhou-style conversation scenes
// 0 = transparent pixel

// ── Shared palette ──────────────────────────────────────────────────
const _ = 0;

// ── Player palette ──────────────────────────────────────────────────
const SK  = 0xFFDDBB;  // skin base
const SK2 = 0xFFEECC;  // skin highlight
const SK3 = 0xEECCAA;  // skin shadow
const SK4 = 0xDDBB99;  // skin deep shadow
const EY  = 0x223366;  // eye dark blue
const EY2 = 0x334488;  // eye mid blue
const EH  = 0xFFFFFF;  // eye highlight
const BH  = 0x4444CC;  // blue hair
const BH2 = 0x3333AA;  // blue hair dark
const BH3 = 0x5555DD;  // blue hair highlight
const BH4 = 0x222288;  // blue hair deepest
const WH  = 0xEEEEFF;  // white fabric
const WH2 = 0xDDDDEE;  // white fabric shadow
const WH3 = 0xCCCCDD;  // white fabric deep shadow
const RB  = 0x4455CC;  // ribbon blue
const RB2 = 0x3344AA;  // ribbon dark
const LP  = 0xFFAAAA;  // lip pink
const BW  = 0x111122;  // brow/lash dark
const PU  = 0x221133;  // pupil

// ── Boss1 (Prism Warden) palette ────────────────────────────────────
const IH  = 0xCCDDFF;  // ice hair light
const IH2 = 0x99BBEE;  // ice hair mid
const IH3 = 0x7799CC;  // ice hair dark
const IH4 = 0x6688BB;  // ice hair deepest
const IE  = 0x4488CC;  // ice eye
const IE2 = 0xAADDFF;  // ice eye highlight
const IS  = 0xFFEEDD;  // ice skin
const IS2 = 0xFFDDCC;  // ice skin shadow
const IS3 = 0xEECCBB;  // ice skin deep shadow
const IC  = 0x88CCFF;  // crystal blue
const IC2 = 0xAADDFF;  // crystal highlight
const IC3 = 0x6699CC;  // crystal dark
const IF  = 0xDDEEFF;  // ice fabric
const IF2 = 0xBBCCEE;  // ice fabric shadow
const IL  = 0xDDAA99;  // ice lip

// ── Boss2 (Scarlet Tempest) palette ─────────────────────────────────
const FR  = 0xFF4422;  // flame red
const FR2 = 0xDD3311;  // flame red dark
const FO  = 0xFF6633;  // flame orange
const FY  = 0xFF8844;  // flame yellow-orange
const FY2 = 0xFFAA66;  // flame light
const FE  = 0xFF2222;  // fire eye
const FE2 = 0xFFAA44;  // fire eye highlight
const FS  = 0xFFDDAA;  // fire skin
const FS2 = 0xEECC99;  // fire skin shadow
const FS3 = 0xDDBB88;  // fire skin deep shadow
const DA  = 0x442222;  // dark armor
const DA2 = 0x331111;  // dark armor deep
const DA3 = 0x553333;  // dark armor highlight
const RG  = 0xCC2222;  // red gem
const RG2 = 0xFF4444;  // red gem highlight
const FG  = 0xFFDD44;  // fire glow particle
const FN  = 0xEEBB88;  // fang

// ── Boss3 (Void Empress) palette ────────────────────────────────────
const VP  = 0x6622AA;  // void purple
const VP2 = 0x8844CC;  // void purple mid
const VP3 = 0x4411AA;  // void purple deep
const VP4 = 0x330088;  // void purple darkest
const VE  = 0x9944FF;  // void eye
const VE2 = 0xBB66FF;  // void eye light
const VS  = 0xFFEEEE;  // void skin
const VS2 = 0xEEDDDD;  // void skin shadow
const VS3 = 0xDDCCCC;  // void skin deep shadow
const GC  = 0xFFDD44;  // gold crown
const GC2 = 0xFFEE88;  // gold crown highlight
const GC3 = 0xDDBB33;  // gold crown shadow
const DD  = 0x220044;  // dark dress
const DD2 = 0x440088;  // dark dress mid
const DD3 = 0x330066;  // dark dress light
const SW  = 0xFFFFFF;  // star white
const SW2 = 0xCCBBFF;  // star lavender
const VL  = 0xDDAACC;  // void lip

export class PortraitSprites {

  // ── PLAYER PORTRAIT (40x48 pixel grid, 80x96 final) ───────────────
  // Anime girl with blue hair, large expressive eyes, white top w/ blue ribbon
  private static playerPortrait: number[][] = [
    // Row 0-3: top padding + hair crown
    [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  BH4,BH2,BH2,BH, BH, BH, BH, BH, BH3,BH2,BH4,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  BH4,BH2,BH, BH, BH3,BH3,BH3,BH3,BH3,BH3,BH3,BH, BH, BH2,BH4,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _],
    // Row 4-7: upper hair
    [_,  _,  _,  _,  _,  _,  _,  _,  _,  BH4,BH2,BH, BH, BH3,BH3,BH3,BH, BH, BH, BH, BH, BH, BH3,BH3,BH, BH, BH2,BH4,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  _,  _,  _,  BH4,BH2,BH, BH3,BH3,BH3,BH, BH, BH2,BH2,BH2,BH2,BH2,BH, BH, BH3,BH3,BH3,BH, BH2,BH4,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  _,  _,  BH4,BH2,BH, BH3,BH3,BH, BH, BH2,BH2,BH4,BH4,BH4,BH4,BH4,BH2,BH2,BH, BH, BH3,BH3,BH, BH2,BH4,_,  _,  _,  _,  _,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  _,  BH4,BH2,BH, BH3,BH3,BH, BH2,BH4,BH4,_,  _,  _,  _,  _,  _,  _,  BH4,BH4,BH2,BH, BH3,BH3,BH, BH2,BH4,_,  _,  _,  _,  _,  _,  _,  _,  _],
    // Row 8-11: forehead + hair bangs over face
    [_,  _,  _,  _,  _,  BH4,BH2,BH, BH3,BH, BH2,BH4,_,  _,  _,  _,  SK3,SK, SK, SK, SK, SK, SK3,_,  _,  _,  BH4,BH2,BH, BH3,BH, BH2,BH4,_,  _,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  BH4,BH2,BH, BH, BH2,BH4,_,  _,  SK3,SK, SK, SK, SK2,SK2,SK2,SK2,SK, SK, SK, SK3,_,  _,  BH4,BH2,BH, BH, BH2,BH4,_,  _,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  BH4,BH2,BH, BH3,BH2,BH4,_,  _,  SK3,SK, SK, SK2,SK2,SK2,SK2,SK2,SK2,SK2,SK2,SK, SK, SK3,_,  _,  BH4,BH2,BH3,BH, BH2,BH4,_,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  BH4,BH2,BH, BH, BH4,_,  _,  SK3,SK, SK, SK2,SK2,SK2,SK2,SK2,SK2,SK2,SK2,SK2,SK2,SK, SK, SK3,_,  _,  BH4,BH, BH, BH2,BH4,_,  _,  _,  _,  _,  _],
    // Row 12-15: eyes region - the focal point!
    [_,  _,  _,  _,  BH4,BH2,BH, BH4,_,  _,  SK3,SK, SK, SK2,SK2,SK2,SK2,SK2,SK2,SK2,SK2,SK2,SK2,SK2,SK2,SK, SK, SK3,_,  _,  BH4,BH, BH2,BH4,_,  _,  _,  _,  _,  _],
    [_,  _,  _,  BH4,BH2,BH, BH4,_,  _,  SK3,SK, SK, BW, BW, BW, BW, BW, SK2,SK2,SK2,SK2,BW, BW, BW, BW, BW, SK, SK, SK3,_,  _,  BH4,BH, BH2,BH4,_,  _,  _,  _,  _],
    [_,  _,  _,  BH4,BH2,BH, BH4,_,  _,  SK3,SK, BW, EH, EH, EY2,EY, EY, BW, SK2,SK2,BW, EH, EH, EY2,EY, EY, BW, SK, SK3,_,  _,  BH4,BH, BH2,BH4,_,  _,  _,  _,  _],
    [_,  _,  _,  BH4,BH2,BH, BH4,_,  _,  SK, SK, BW, EH, EY2,EY, PU, EY, BW, SK, SK, BW, EH, EY2,EY, PU, EY, BW, SK, SK, _,  _,  BH4,BH, BH2,BH4,_,  _,  _,  _,  _],
    // Row 16-19: lower eyes, nose, cheeks
    [_,  _,  _,  BH4,BH2,BH, BH4,_,  _,  SK, SK, BW, EY2,EY, PU, PU, EY, BW, SK, SK, BW, EY2,EY, PU, PU, EY, BW, SK, SK, _,  _,  BH4,BH, BH2,BH4,_,  _,  _,  _,  _],
    [_,  _,  _,  BH4,BH2,BH, BH4,_,  _,  SK, SK, SK3,BW, EY, EY, EY, BW, SK3,SK, SK, SK3,BW, EY, EY, EY, BW, SK3,SK, SK, _,  _,  BH4,BH, BH2,BH4,_,  _,  _,  _,  _],
    [_,  _,  _,  BH4,BH2,BH, BH4,_,  _,  SK, SK, SK, SK3,SK3,SK3,SK3,SK3,SK, SK, SK, SK, SK3,SK3,SK3,SK3,SK3,SK, SK, SK, _,  _,  BH4,BH, BH2,BH4,_,  _,  _,  _,  _],
    [_,  _,  _,  BH4,BH2,BH, BH4,_,  _,  SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, _,  _,  BH4,BH, BH2,BH4,_,  _,  _,  _,  _],
    // Row 20-23: nose, mouth area
    [_,  _,  _,  BH4,BH2,BH, BH4,_,  _,  SK3,SK, SK, SK, SK, SK, SK, SK, SK, SK, SK3,SK, SK, SK, SK, SK, SK, SK, SK, SK3,_,  _,  BH4,BH, BH2,BH4,_,  _,  _,  _,  _],
    [_,  _,  _,  BH4,BH2,BH, BH4,_,  _,  SK3,SK, SK, SK, SK, SK, SK, SK, SK, SK3,SK4,SK, SK, SK, SK, SK, SK, SK, SK, SK3,_,  _,  BH4,BH, BH2,BH4,_,  _,  _,  _,  _],
    [_,  _,  _,  BH4,BH2,BH, BH4,_,  _,  SK3,SK, SK, LP, LP, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, LP, LP, SK, SK3,_,  _,  BH4,BH, BH2,BH4,_,  _,  _,  _,  _],
    [_,  _,  _,  BH4,BH2,BH, BH4,_,  _,  SK3,SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK3,_,  _,  BH4,BH, BH2,BH4,_,  _,  _,  _,  _],
    // Row 24-27: chin, jaw
    [_,  _,  _,  BH4,BH2,BH, BH4,_,  _,  _,  SK3,SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK3,_,  _,  _,  BH4,BH, BH2,BH4,_,  _,  _,  _,  _],
    [_,  _,  _,  BH4,BH2,BH, BH4,_,  _,  _,  _,  SK3,SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK3,_,  _,  _,  _,  BH4,BH, BH2,BH4,_,  _,  _,  _,  _],
    [_,  _,  _,  BH4,BH2,BH, BH, BH4,_,  _,  _,  _,  SK3,SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK3,_,  _,  _,  _,  BH4,BH, BH, BH2,BH4,_,  _,  _,  _,  _],
    [_,  _,  _,  BH4,BH2,BH, BH, BH2,BH4,_,  _,  _,  _,  SK3,SK3,SK, SK, SK, SK, SK, SK, SK, SK, SK3,SK3,_,  _,  _,  _,  BH4,BH2,BH, BH, BH2,BH4,_,  _,  _,  _,  _],
    // Row 28-31: neck, collar
    [_,  _,  _,  BH4,BH2,BH, BH, BH, BH2,BH4,_,  _,  _,  _,  SK3,SK3,SK, SK, SK, SK, SK, SK, SK3,SK3,_,  _,  _,  _,  BH4,BH2,BH, BH, BH, BH2,BH4,_,  _,  _,  _,  _],
    [_,  _,  _,  BH4,BH2,BH, BH, BH3,BH, BH2,BH4,_,  _,  _,  _,  SK3,SK, SK, SK, SK, SK, SK, SK3,_,  _,  _,  _,  BH4,BH2,BH, BH3,BH, BH, BH2,BH4,_,  _,  _,  _,  _],
    [_,  _,  BH4,BH2,BH, BH3,BH, BH, BH, BH, BH2,BH4,_,  _,  _,  _,  SK3,SK, SK, SK, SK, SK3,_,  _,  _,  _,  BH4,BH2,BH, BH, BH, BH3,BH, BH, BH2,BH4,_,  _,  _,  _],
    [_,  _,  BH4,BH2,BH, BH, BH3,BH, BH, BH, BH, BH2,BH4,_,  _,  _,  _,  SK3,SK, SK, SK3,_,  _,  _,  _,  BH4,BH2,BH, BH, BH, BH3,BH, BH, BH, BH2,BH4,_,  _,  _,  _],
    // Row 32-35: shoulders + ribbon + top
    [_,  BH4,BH2,BH, BH, BH, BH, BH3,BH, BH2,BH4,_,  WH3,WH2,WH, WH, WH, WH, WH, WH, WH, WH, WH, WH2,WH3,_,  BH4,BH2,BH, BH3,BH, BH, BH, BH, BH2,BH4,_,  _,  _,  _],
    [_,  BH4,BH2,BH, BH, BH3,BH, BH, BH2,BH4,_,  WH3,WH2,WH, WH, WH, WH, RB, RB, RB, RB, WH, WH, WH, WH, WH2,WH3,_,  BH4,BH2,BH, BH, BH3,BH, BH, BH2,BH4,_,  _,  _],
    [_,  BH4,BH2,BH, BH3,BH, BH, BH2,BH4,_,  WH3,WH2,WH, WH, WH, WH, RB, RB2,RB, RB, RB2,RB, WH, WH, WH, WH, WH2,WH3,_,  BH4,BH2,BH, BH, BH3,BH, BH, BH2,BH4,_,  _],
    [BH4,BH2,BH, BH, BH, BH, BH2,BH4,_,  WH3,WH2,WH, WH, WH, WH, RB, RB2,RB, _,  _,  RB, RB2,RB, WH, WH, WH, WH, WH2,WH3,_,  BH4,BH2,BH, BH, BH, BH, BH2,BH4,_,  _],
    // Row 36-39: upper chest area
    [BH4,BH2,BH, BH3,BH, BH2,BH4,_,  _,  WH3,WH2,WH, WH, WH, WH, WH, RB, _,  _,  _,  _,  RB, WH, WH, WH, WH, WH, WH, WH2,WH3,_,  _,  BH4,BH2,BH, BH3,BH, BH2,BH4,_],
    [BH4,BH2,BH, BH, BH2,BH4,_,  _,  WH3,WH2,WH, WH, WH, WH2,WH, WH, WH, WH, WH, WH, WH, WH, WH, WH, WH2,WH, WH, WH, WH, WH2,WH3,_,  _,  BH4,BH2,BH, BH, BH2,BH4,_],
    [BH4,BH2,BH, BH2,BH4,_,  _,  WH3,WH2,WH, WH, WH, WH2,WH3,WH2,WH, WH, WH, WH, WH, WH, WH, WH, WH, WH2,WH3,WH2,WH, WH, WH, WH2,WH3,_,  _,  BH4,BH2,BH, BH2,BH4,_],
    [BH4,BH2,BH4,BH4,_,  _,  WH3,WH2,WH, WH, WH, WH2,WH3,_,  WH3,WH2,WH, WH, WH, WH, WH, WH, WH, WH2,WH3,_,  WH3,WH2,WH, WH, WH, WH, WH2,WH3,_,  BH4,BH4,BH2,BH4,_],
    // Row 40-43: lower chest
    [BH4,BH4,_,  _,  _,  WH3,WH2,WH, WH, WH, WH2,WH3,_,  _,  _,  WH3,WH2,WH, WH, WH, WH, WH, WH, WH2,WH3,_,  _,  WH3,WH2,WH, WH, WH, WH, WH2,WH3,_,  _,  BH4,BH4,_],
    [_,  _,  _,  _,  WH3,WH2,WH, WH, WH, WH2,WH3,_,  _,  _,  _,  _,  WH3,WH2,WH, WH, WH, WH, WH2,WH3,_,  _,  _,  _,  WH3,WH2,WH, WH, WH, WH, WH2,WH3,_,  _,  _,  _],
    [_,  _,  _,  WH3,WH2,WH, WH, WH, WH2,WH3,_,  _,  _,  _,  _,  _,  _,  WH3,WH2,WH, WH, WH2,WH3,_,  _,  _,  _,  _,  _,  WH3,WH2,WH, WH, WH, WH2,WH3,_,  _,  _,  _],
    [_,  _,  _,  WH3,WH2,WH, WH, WH2,WH3,_,  _,  _,  _,  _,  _,  _,  _,  _,  WH3,WH2,WH, WH3,_,  _,  _,  _,  _,  _,  _,  _,  WH3,WH2,WH, WH, WH2,WH3,_,  _,  _,  _],
    // Row 44-47: bottom area
    [_,  _,  _,  WH3,WH2,WH, WH, WH3,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  WH3,WH3,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  WH3,WH, WH, WH2,WH3,_,  _,  _,  _],
    [_,  _,  _,  _,  WH3,WH2,WH3,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  WH3,WH2,WH3,_,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  WH3,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  WH3,_,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _],
  ];

  // ── BOSS 1 PORTRAIT: Prism Warden (40x48 pixel grid) ──────────────
  // Elegant ice maiden with long blue-white hair, crystal eyes, high collar
  private static boss1Portrait: number[][] = [
    // Row 0-3: top padding + crown of hair
    [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  IH4,IH3,IH2,IH, IH, IH, IH, IH2,IH3,IH4,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  IH4,IH3,IH2,IH, IH, IH, IH, IH, IH, IH, IH, IH2,IH3,IH4,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  IH4,IH3,IH2,IH, IH, IH, IH, IH2,IH2,IH2,IH2,IH, IH, IH, IH, IH2,IH3,IH4,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _],
    // Row 4-7: upper hair flowing straight
    [_,  _,  _,  _,  _,  _,  _,  _,  _,  IH4,IH3,IH2,IH, IH, IH, IH2,IH2,IH3,IH3,IH3,IH3,IH2,IH2,IH, IH, IH, IH2,IH3,IH4,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  _,  _,  _,  IH4,IH3,IH2,IH, IH, IH, IH2,IH3,IH3,IH4,IH4,IH4,IH4,IH3,IH3,IH2,IH, IH, IH, IH2,IH3,IH4,_,  _,  _,  _,  _,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  _,  _,  IH4,IH3,IH2,IH, IH, IH, IH2,IH3,IH4,_,  _,  _,  _,  _,  IH4,IH3,IH2,IH, IH, IH, IH, IH2,IH3,IH4,_,  _,  _,  _,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  _,  IH4,IH3,IH2,IH, IH, IH, IH2,IH3,IH4,_,  _,  _,  _,  _,  _,  _,  IH4,IH3,IH2,IH, IH, IH, IH, IH2,IH3,IH4,_,  _,  _,  _,  _,  _,  _,  _],
    // Row 8-11: forehead, hair frames face
    [_,  _,  _,  _,  _,  IH4,IH3,IH2,IH, IH, IH, IH3,IH4,_,  _,  _,  IS3,IS, IS, IS, IS, IS, IS3,_,  _,  _,  IH4,IH3,IH, IH, IH, IH2,IH3,IH4,_,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  IH4,IH3,IH2,IH, IH, IH3,IH4,_,  _,  IS3,IS, IS, IS, IS2,IS2,IS2,IS, IS, IS, IS3,_,  _,  IH4,IH3,IH, IH, IH2,IH3,IH4,_,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  IH4,IH3,IH2,IH, IH, IH3,IH4,_,  _,  IS3,IS, IS, IS2,IS2,IS2,IS2,IS2,IS2,IS2,IS, IS, IS3,_,  _,  IH4,IH3,IH, IH, IH2,IH3,IH4,_,  _,  _,  _,  _],
    [_,  _,  _,  _,  IH4,IH3,IH2,IH, IH, IH4,_,  _,  IS3,IS, IS, IS2,IS2,IS2,IS2,IS2,IS2,IS2,IS2,IS2,IS, IS, IS3,_,  _,  IH4,IH, IH, IH2,IH3,IH4,_,  _,  _,  _,  _],
    // Row 12-15: eyes - cool crystal blue
    [_,  _,  _,  _,  IH4,IH3,IH2,IH, IH4,_,  _,  IS3,IS, IS, IS2,IS2,IS2,IS2,IS2,IS2,IS2,IS2,IS2,IS2,IS2,IS, IS, IS3,_,  _,  IH4,IH, IH, IH2,IH3,IH4,_,  _,  _,  _],
    [_,  _,  _,  IH4,IH3,IH2,IH, IH4,_,  _,  IS3,IS, BW, BW, BW, BW, BW, IS2,IS2,IS2,IS2,BW, BW, BW, BW, BW, IS, IS, IS3,_,  _,  IH4,IH, IH2,IH3,IH4,_,  _,  _,  _],
    [_,  _,  _,  IH4,IH3,IH2,IH, IH4,_,  _,  IS, IS, EH, IE2,IE, IE, IC3,BW, IS, IS, BW, EH, IE2,IE, IE, IC3,BW, IS, IS, _,  _,  IH4,IH, IH2,IH3,IH4,_,  _,  _,  _],
    [_,  _,  _,  IH4,IH3,IH2,IH, IH4,_,  _,  IS, IS, IE2,IE, IE, PU, IC3,BW, IS, IS, BW, IE2,IE, IE, PU, IC3,BW, IS, IS, _,  _,  IH4,IH, IH2,IH3,IH4,_,  _,  _,  _],
    // Row 16-19: lower eyes, delicate nose
    [_,  _,  _,  IH4,IH3,IH2,IH, IH4,_,  _,  IS, IS, IE, IE, PU, PU, IC3,BW, IS, IS, BW, IE, IE, PU, PU, IC3,BW, IS, IS, _,  _,  IH4,IH, IH2,IH3,IH4,_,  _,  _,  _],
    [_,  _,  _,  IH4,IH3,IH2,IH, IH4,_,  _,  IS, IS, IS3,BW, IE, IE, BW, IS3,IS, IS, IS3,BW, IE, IE, BW, IS3,IS, IS, IS, _,  _,  IH4,IH, IH2,IH3,IH4,_,  _,  _,  _],
    [_,  _,  _,  IH4,IH3,IH2,IH, IH4,_,  _,  IS, IS, IS, IS3,IS3,IS3,IS, IS, IS, IS, IS, IS3,IS3,IS3,IS3,IS, IS, IS, IS, _,  _,  IH4,IH, IH2,IH3,IH4,_,  _,  _,  _],
    [_,  _,  _,  IH4,IH3,IH2,IH, IH4,_,  _,  IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, _,  IC2,IH4,IH, IH2,IH3,IH4,_,  _,  _,  _],
    // Row 20-23: nose, slight haughty expression, crystal earring
    [_,  _,  _,  IH4,IH3,IH2,IH, IH4,_,  _,  IS3,IS, IS, IS, IS, IS, IS, IS, IS, IS3,IS, IS, IS, IS, IS, IS, IS, IS, IS3,_,  IC, IH4,IH, IH2,IH3,IH4,_,  _,  _,  _],
    [_,  _,  _,  IH4,IH3,IH2,IH, IH4,_,  _,  IS3,IS, IS, IS, IS, IS, IS, IS, IS3,IS3,IS, IS, IS, IS, IS, IS, IS, IS, IS3,_,  IC2,IH4,IH, IH2,IH3,IH4,_,  _,  _,  _],
    [_,  _,  _,  IH4,IH3,IH2,IH, IH4,_,  _,  IS3,IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IL, IL, IS, IS, IS, IS, IS3,_,  _,  IH4,IH, IH2,IH3,IH4,_,  _,  _,  _],
    [_,  _,  _,  IH4,IH3,IH2,IH, IH4,_,  _,  IS3,IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS3,_,  _,  IH4,IH, IH2,IH3,IH4,_,  _,  _,  _],
    // Row 24-27: chin, jaw
    [_,  _,  _,  IH4,IH3,IH2,IH, IH4,_,  _,  _,  IS3,IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS3,_,  _,  _,  IH4,IH, IH2,IH3,IH4,_,  _,  _,  _],
    [_,  _,  _,  IH4,IH3,IH2,IH, IH4,_,  _,  _,  _,  IS3,IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS3,_,  _,  _,  _,  IH4,IH, IH2,IH3,IH4,_,  _,  _,  _],
    [_,  _,  _,  IH4,IH3,IH2,IH, IH, IH4,_,  _,  _,  _,  IS3,IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS, IS3,_,  _,  _,  _,  IH4,IH, IH, IH2,IH3,IH4,_,  _,  _,  _],
    [_,  _,  _,  IH4,IH3,IH2,IH, IH, IH3,IH4,_,  _,  _,  _,  IS3,IS3,IS, IS, IS, IS, IS, IS, IS3,IS3,_,  _,  _,  _,  _,  IH4,IH3,IH, IH, IH2,IH3,IH4,_,  _,  _,  _],
    // Row 28-31: neck, high collar with crystals
    [_,  _,  _,  IH4,IH3,IH2,IH, IH, IH, IH3,IH4,_,  _,  _,  _,  IS3,IS, IS, IS, IS, IS, IS, IS3,_,  _,  _,  _,  _,  IH4,IH3,IH, IH, IH, IH2,IH3,IH4,_,  _,  _,  _],
    [_,  _,  _,  IH4,IH3,IH2,IH, IH, IH, IH, IH3,IH4,_,  _,  _,  _,  IS3,IS, IS, IS, IS, IS3,_,  _,  _,  _,  _,  IH4,IH3,IH, IH, IH, IH, IH2,IH3,IH4,_,  _,  _,  _],
    [_,  _,  IH4,IH3,IH2,IH, IH, IH, IH, IH, IH, IH3,IH4,_,  _,  IC2,IC, IS3,IS, IS, IS3,IC, IC2,_,  _,  _,  IH4,IH3,IH, IH, IH, IH, IH, IH, IH2,IH3,IH4,_,  _,  _],
    [_,  _,  IH4,IH3,IH2,IH, IH, IH, IH, IH, IH, IH, IH3,IH4,IC2,IC, IC, IC3,IF2,IF2,IC3,IC, IC, IC2,_,  IH4,IH3,IH, IH, IH, IH, IH, IH, IH, IH2,IH3,IH4,_,  _,  _],
    // Row 32-35: crystal collar + shoulders
    [_,  IH4,IH3,IH2,IH, IH, IH, IH, IH, IH, IH, IH3,IH4,IC, IC, IC3,IF2,IF, IF, IF, IF2,IC3,IC, IC, _,  IH4,IH3,IH, IH, IH, IH, IH, IH, IH, IH, IH2,IH3,IH4,_,  _],
    [_,  IH4,IH3,IH2,IH, IH, IH, IH, IH, IH, IH3,IH4,IC, IC, IC3,IF2,IF, IF, IF, IF, IF, IF2,IC3,IC, IC, _,  IH4,IH3,IH, IH, IH, IH, IH, IH, IH, IH, IH2,IH3,IH4,_],
    [_,  IH4,IH3,IH2,IH, IH, IH, IH, IH, IH3,IH4,IC, IC, IC3,IF2,IF, IF, IF2,IF2,IF2,IF, IF, IF2,IC3,IC, IC, _,  IH4,IH3,IH, IH, IH, IH, IH, IH, IH, IH, IH2,IH3,IH4],
    [IH4,IH3,IH2,IH, IH, IH, IH, IH, IH3,IH4,IC, IC, IC3,IF2,IF, IF, IF2,IC3,IC3,IC3,IF2,IF, IF, IF2,IC3,IC, IC, _,  IH4,IH3,IH, IH, IH, IH, IH, IH, IH, IH, IH2,IH3],
    // Row 36-39: chest area
    [IH4,IH3,IH2,IH, IH, IH, IH, IH3,IH4,IC, IC, IC3,IF2,IF, IF, IF2,IC3,_,  _,  _,  IC3,IF2,IF, IF, IF2,IC3,IC, IC, _,  IH4,IH3,IH, IH, IH, IH, IH, IH, IH, IH2,IH3],
    [IH4,IH3,IH2,IH, IH, IH, IH3,IH4,IC, IC, IC3,IF2,IF, IF, IF2,IC3,_,  _,  _,  _,  _,  IC3,IF2,IF, IF, IF2,IC3,IC, IC, _,  IH4,IH3,IH, IH, IH, IH, IH, IH, IH2,IH3],
    [IH4,IH3,IH2,IH, IH, IH3,IH4,IC, IC, IC3,IF2,IF, IF, IF2,IC3,_,  _,  _,  _,  _,  _,  _,  IC3,IF2,IF, IF, IF2,IC3,IC, IC, _,  IH4,IH3,IH, IH, IH, IH, IH, IH2,IH3],
    [IH4,IH3,IH2,IH, IH3,IH4,IC, IC, IC3,IF2,IF, IF, IF2,IC3,_,  _,  _,  _,  _,  _,  _,  _,  _,  IC3,IF2,IF, IF, IF2,IC3,IC, IC, _,  IH4,IH3,IH, IH, IH, IH, IH2,IH3],
    // Row 40-43: lower chest
    [IH4,IH3,IH2,IH3,IH4,IC, IC, IC3,IF2,IF, IF, IF2,IC3,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  IC3,IF2,IF, IF, IF2,IC3,IC, IC, _,  IH4,IH3,IH, IH, IH, IH2,IH3],
    [IH4,IH3,IH4,IH4,IC, IC, IC3,IF2,IF, IF, IF2,IC3,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  IC3,IF2,IF, IF, IF2,IC3,IC, IC, _,  IH4,IH3,IH, IH, IH2,IH3],
    [IH4,IH4,_,  IC, IC, IC3,IF2,IF, IF, IF2,IC3,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  IC3,IF2,IF, IF, IF2,IC3,IC, IC, _,  IH4,IH, IH, IH2,IH3],
    [_,  _,  _,  IC, IC3,IF2,IF, IF, IF2,IC3,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  IC3,IF2,IF, IF, IF2,IC3,IC, _,  _,  IH, IH, IH2,IH3],
    // Row 44-47: bottom
    [_,  _,  _,  IC3,IF2,IF, IF, IF2,IC3,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  IC3,IF2,IF, IF, IF2,IC3,_,  _,  _,  IH, IH2,IH3],
    [_,  _,  _,  _,  IC3,IF2,IF2,IC3,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  IC3,IF2,IF2,IC3,_,  _,  _,  _,  _,  IH2,IH3],
    [_,  _,  _,  _,  _,  IC3,IC3,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  IC3,IC3,_,  _,  _,  _,  _,  _,  _,  IH3],
    [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _],
  ];

  // ── BOSS 2 PORTRAIT: Scarlet Tempest (40x48 pixel grid) ───────────
  // Fierce warrior maiden with wild red/orange spiky hair, fang grin
  private static boss2Portrait: number[][] = [
    // Row 0-3: top - fiery hair spikes
    [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  FY, FO, _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  FR, _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  _,  _,  _,  FG, _,  FR2,FR, FO, FY, FO, _,  _,  _,  _,  _,  _,  FR2,FR, FO, FR, FR2,FO, FG, _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  _,  _,  _,  _,  FR2,FR, FO, FY, FY2,FO, FR, _,  _,  _,  _,  FR2,FR, FO, FY, FO, FR, FO, FY, FG, _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  FG, _,  FR2,FR, FR, FO, FY, FY2,FY, FO, FR, FR2,_,  _,  FR2,FR, FO, FY, FY, FY, FO, FR, FO, FY, FG, _,  _,  _,  _,  _,  _,  _,  _,  _,  _],
    // Row 4-7: spiky hair mass
    [_,  _,  _,  _,  FR2,FR, FR, FR, FO, FY, FY, FY2,FY, FY, FO, FO, FR, FR2,FR2,FR, FO, FY, FY, FO, FO, FR, FR, FO, FY, FO, FG, _,  _,  _,  _,  _,  _,  _,  _,  _],
    [_,  _,  _,  FR2,FR, FO, FO, FY, FY, FY2,FY, FY, FO, FO, FR, FR2,FR2,FR2,FR, FR, FO, FO, FO, FR, FR2,FR, FO, FO, FY, FO, FR, FG, _,  _,  _,  _,  _,  _,  _,  _],
    [_,  _,  FR2,FR, FO, FY, FY, FY2,FY, FO, FO, FR, FR, FR2,FR2,_,  _,  _,  _,  _,  FR2,FR2,FR, FR, FO, FO, FY, FY, FO, FR, FR2,FO, FG, _,  _,  _,  _,  _,  _,  _],
    [_,  FR2,FR, FO, FY, FY, FY2,FY, FO, FR, FR2,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  FR2,FR, FO, FY, FY, FO, FR, FR, FR2,FO, FG, _,  _,  _,  _,  _,  _],
    // Row 8-11: forehead, hair frames face
    [_,  FR2,FR, FO, FY, FY, FO, FR, FR2,_,  _,  _,  _,  FS3,FS, FS, FS, FS, FS, FS, FS, FS3,_,  _,  _,  FR2,FR, FO, FY, FO, FR, FR, FR2,FO, FG, _,  _,  _,  _,  _],
    [_,  FR2,FR, FO, FY, FO, FR, FR2,_,  _,  _,  FS3,FS, FS, FS, FS, FS, FS2,FS2,FS, FS, FS, FS, FS3,_,  _,  FR2,FR, FO, FO, FR, FR, FR2,FO, FR, FG, _,  _,  _,  _],
    [_,  FR2,FR, FO, FO, FR, FR2,_,  _,  _,  FS3,FS, FS, FS, FS2,FS2,FS2,FS2,FS2,FS2,FS2,FS, FS, FS, FS3,_,  _,  FR2,FR, FO, FR, FR, FR2,FR, FO, FR, FG, _,  _,  _],
    [_,  FR2,FR, FO, FR, FR2,_,  _,  _,  FS3,FS, FS, FS, FS2,FS2,FS2,FS2,FS2,FS2,FS2,FS2,FS2,FS, FS, FS, FS3,_,  _,  FR2,FR, FR, FR, FR2,FR, FO, FR, FG, _,  _,  _],
    // Row 12-15: eyes - sharp and fierce red
    [_,  FR2,FR, FR, FR2,_,  _,  _,  FS3,FS, FS, FS, FS2,FS2,FS2,FS2,FS2,FS2,FS2,FS2,FS2,FS2,FS2,FS, FS, FS, FS3,_,  _,  FR2,FR, FR, FR2,FR, FO, FR, FR2,FG, _,  _],
    [_,  FR2,FR, FR2,_,  _,  _,  FS3,FS, FS, BW, BW, BW, BW, BW, FS2,FS2,FS2,FS2,FS2,FS2,BW, BW, BW, BW, BW, FS, FS, FS3,_,  FR2,FR, FR2,FR, FO, FR, FR2,_,  _,  _],
    [_,  FR2,FR, FR2,_,  _,  _,  FS, FS, BW, EH, FE2,FE, FE, FE, BW, FS2,FS2,FS2,FS2,BW, EH, FE2,FE, FE, FE, BW, FS, FS, _,  FR2,FR, FR2,FR, FO, FR, FR2,_,  _,  _],
    [_,  FR2,FR, FR2,_,  _,  _,  FS, FS, BW, FE2,FE, FE, PU, FE, BW, FS, FS, FS, FS, BW, FE2,FE, FE, PU, FE, BW, FS, FS, _,  FR2,FR, FR2,FR, FO, FR, FR2,_,  _,  _],
    // Row 16-19: lower eyes, aggressive brow
    [_,  FR2,FR, FR2,_,  _,  _,  FS, FS, BW, FE, FE, PU, PU, FE, BW, FS, FS, FS, FS, BW, FE, FE, PU, PU, FE, BW, FS, FS, _,  FR2,FR, FR2,FR, FO, FR, FR2,_,  _,  _],
    [_,  FR2,FR, FR2,_,  _,  _,  FS, FS, FS3,BW, FE, FE, FE, BW, FS3,FS, FS, FS, FS, FS3,BW, FE, FE, FE, BW, FS3,FS, FS, _,  FR2,FR, FR2,FR, FO, FR, FR2,_,  _,  _],
    [_,  FR2,FR, FR2,_,  _,  _,  FS, FS, FS, FS3,FS3,FS3,FS3,FS, FS, FS, FS, FS, FS, FS, FS3,FS3,FS3,FS3,FS, FS, FS, FS, _,  FR2,FR, FR2,FR, FO, FR, FR2,_,  _,  _],
    [_,  FR2,FR, FR2,_,  _,  _,  FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, _,  FR2,FR, FR2,FR, FR, FR2,_,  _,  _,  _],
    // Row 20-23: nose, confident grin with fang
    [_,  FR2,FR, FR2,_,  _,  _,  FS3,FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS3,FS, FS, FS, FS, FS, FS, FS, FS, FS3,_,  FR2,FR, FR2,FR, FR, FR2,_,  _,  _,  _],
    [_,  FR2,FR, FR2,_,  _,  _,  FS3,FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS3,FS3,FS, FS, FS, FS, FS, FS, FS, FS, FS3,_,  FR2,FR, FR2,FR, FR, FR2,_,  _,  _,  _],
    [_,  FR2,FR, FR2,_,  _,  _,  FS3,FS, FS, FS, FS3,FS3,FS, FS, FS, FS, FS, FS, FS, FS, FS3,FS3,LP, LP, LP, FS, FS, FS3,_,  FR2,FR, FR2,FR, FR, FR2,_,  _,  _,  _],
    [_,  FR2,FR, FR2,_,  _,  _,  FS3,FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, LP, LP, LP, FN, FS, FS, FS3,_,  FR2,FR, FR2,FR, FR, FR2,_,  _,  _,  _],
    // Row 24-27: chin, jaw
    [_,  FR2,FR, FR2,_,  _,  _,  _,  FS3,FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS3,_,  _,  FR2,FR, FR2,FR, FR, FR2,_,  _,  _,  _],
    [_,  FR2,FR, FR2,_,  _,  _,  _,  _,  FS3,FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS3,_,  _,  _,  FR2,FR, FR2,FR, FR, FR2,_,  _,  _,  _],
    [_,  FR2,FR, FR, FR2,_,  _,  _,  _,  _,  FS3,FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS3,_,  _,  _,  _,  FR2,FR, FR, FR2,FR, FR2,_,  _,  _,  _],
    [_,  FR2,FR, FR, FR, FR2,_,  _,  _,  _,  _,  FS3,FS3,FS, FS, FS, FS, FS, FS, FS, FS, FS, FS, FS3,FS3,_,  _,  _,  _,  FR2,FR, FR, FR, FR2,FR, FR2,_,  _,  _,  _],
    // Row 28-31: neck, dark armor collar with red gem
    [_,  FR2,FR, FR, FO, FR, FR2,_,  _,  _,  _,  _,  FS3,FS3,FS, FS, FS, FS, FS, FS, FS, FS, FS3,FS3,_,  _,  _,  _,  FR2,FR, FO, FR, FR, FR, FR2,FR, FR2,_,  _,  _],
    [_,  FR2,FR, FO, FO, FR, FR, FR2,_,  _,  _,  _,  _,  FS3,FS, FS, FS, FS, FS, FS, FS, FS3,_,  _,  _,  _,  _,  FR2,FR, FR, FO, FO, FR, FR, FR2,FR, FR2,_,  _,  _],
    [_,  FR2,FR, FO, FO, FR, FR, FR, FR2,_,  _,  DA2,DA, DA, DA3,DA, DA, FS3,FS, FS3,DA, DA, DA3,DA, DA, DA2,_,  _,  FR2,FR, FR, FO, FO, FR, FR2,FR, FR2,_,  _,  _],
    [_,  FR2,FR, FO, FR, FR, FR, FR, FR, FR2,DA2,DA, DA3,DA, DA, DA, RG, RG2,RG2,RG, DA, DA, DA, DA3,DA, DA, DA2,FR2,FR, FR, FR, FR, FO, FR, FR2,FR, FR2,_,  _,  _],
    // Row 32-35: dark armor shoulders
    [FR2,FR, FO, FR, FR, FR, FR, FR2,_,  DA2,DA, DA, DA, DA3,DA, RG, RG2,RG, _,  RG, RG2,RG, DA3,DA, DA, DA, DA, DA2,_,  FR2,FR, FR, FR, FO, FR, FR, FR2,_,  _,  _],
    [FR2,FR, FO, FR, FR, FR, FR2,_,  DA2,DA, DA, DA, DA3,DA, DA, DA, RG, _,  _,  _,  RG, DA, DA, DA3,DA, DA, DA, DA, DA2,_,  FR2,FR, FR, FR, FO, FR, FR2,_,  _,  _],
    [FR2,FR, FO, FR, FR, FR2,_,  DA2,DA, DA, DA3,DA, DA, DA, DA, DA, DA, DA, DA, DA, DA, DA, DA, DA, DA, DA3,DA, DA, DA, DA2,_,  FR2,FR, FR, FO, FR, FR2,_,  _,  _],
    [FR2,FR, FO, FR, FR2,_,  DA2,DA, DA, DA3,DA, DA, DA, DA, DA, DA, DA, DA3,DA3,DA3,DA, DA, DA, DA, DA, DA, DA, DA3,DA, DA, DA2,_,  FR2,FR, FO, FR, FR2,_,  _,  _],
    // Row 36-39: armor chest
    [FR2,FR, FR, FR2,_,  DA2,DA, DA, DA3,DA, DA, DA, DA, DA, DA, DA3,DA2,_,  _,  _,  DA2,DA3,DA, DA, DA, DA, DA, DA, DA3,DA, DA, DA2,_,  FR2,FR, FR, FR2,_,  _,  _],
    [FR2,FR, FR2,_,  DA2,DA, DA, DA3,DA, DA, DA, DA, DA, DA3,DA2,_,  _,  _,  _,  _,  _,  _,  DA2,DA3,DA, DA, DA, DA, DA, DA3,DA, DA, DA2,_,  FR2,FR, FR2,_,  _,  _],
    [FR2,FR2,_,  DA2,DA, DA, DA3,DA, DA, DA, DA, DA3,DA2,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  DA2,DA3,DA, DA, DA, DA, DA3,DA, DA, DA2,_,  FR2,FR2,_,  _,  _],
    [FR2,_,  DA2,DA, DA, DA3,DA, DA, DA, DA3,DA2,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  DA2,DA3,DA, DA, DA, DA, DA3,DA, DA2,_,  FR2,_,  _,  _],
    // Row 40-43: lower armor
    [_,  DA2,DA, DA, DA3,DA, DA, DA3,DA2,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  DA2,DA3,DA, DA, DA, DA3,DA, DA2,_,  _,  _,  _],
    [_,  DA2,DA, DA3,DA, DA, DA3,DA2,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  DA2,DA3,DA, DA, DA, DA3,DA, DA2,_,  _,  _],
    [_,  _,  DA2,DA, DA, DA3,DA2,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  DA2,DA3,DA, DA, DA, DA3,DA2,_,  _,  _],
    [_,  _,  _,  DA2,DA3,DA2,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  DA2,DA3,DA, DA, DA3,DA2,_,  _,  _],
    // Row 44-47: bottom fiery particles
    [_,  _,  _,  _,  DA2,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  DA2,DA, DA3,DA2,_,  _,  _,  _],
    [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  DA2,DA2,_,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _],
  ];

  // ── BOSS 3 PORTRAIT: Void Empress (40x48 pixel grid) ──────────────
  // Regal cosmic empress with purple hair, gold crown, star motifs
  private static boss3Portrait: number[][] = [
    // Row 0-3: crown and top of hair
    [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  GC3,GC, GC2,SW, GC2,GC, GC3,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  GC3,GC, GC2,GC, GC, GC2,SW, GC2,GC, GC, GC2,GC, GC3,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  GC3,GC, GC, GC2,SW, GC2,GC, GC, GC, GC, GC, GC2,SW, GC2,GC, GC, GC3,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  _,  _,  _,  _,  VP4,VP3,VP, GC3,GC, GC, GC, GC, GC3,VP3,VP3,VP3,GC3,GC, GC, GC, GC, GC3,VP, VP3,VP4,_,  _,  _,  _,  _,  _,  _,  _,  _,  _],
    // Row 4-7: hair crown flowing
    [_,  _,  _,  _,  _,  _,  _,  _,  VP4,VP3,VP, VP2,VP, VP3,GC3,GC, GC3,VP3,VP, VP, VP, VP3,GC3,GC, GC3,VP3,VP, VP2,VP, VP3,VP4,_,  _,  _,  _,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  _,  _,  VP4,VP3,VP, VP2,VP2,VP, VP, VP3,VP4,VP4,VP, VP2,VP2,VP2,VP, VP4,VP4,VP3,VP, VP, VP2,VP2,VP, VP3,VP4,_,  _,  _,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  _,  VP4,VP3,VP, VP2,VP2,VP, VP, VP3,VP4,_,  _,  VP4,VP3,VP3,VP3,VP4,_,  _,  VP4,VP3,VP, VP, VP2,VP2,VP, VP3,VP4,_,  _,  _,  _,  _,  _,  _],
    [_,  _,  _,  _,  _,  VP4,VP3,VP, VP2,VP2,VP, VP, VP3,VP4,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  VP4,VP3,VP, VP, VP2,VP2,VP, VP3,VP4,_,  _,  _,  _,  _,  _],
    // Row 8-11: forehead, hair frames face
    [_,  _,  _,  _,  VP4,VP3,VP, VP2,VP2,VP, VP, VP3,VP4,_,  _,  _,  VS3,VS, VS, VS, VS, VS, VS3,_,  _,  _,  VP4,VP3,VP, VP, VP2,VP2,VP, VP3,VP4,_,  _,  _,  _,  _],
    [_,  _,  _,  _,  VP4,VP3,VP, VP2,VP, VP, VP3,VP4,_,  _,  VS3,VS, VS, VS, VS2,VS2,VS2,VS, VS, VS, VS3,_,  _,  VP4,VP3,VP, VP, VP2,VP, VP3,VP4,_,  _,  _,  _,  _],
    [_,  _,  _,  VP4,VP3,VP, VP2,VP, VP, VP3,VP4,_,  _,  VS3,VS, VS, VS2,VS2,VS2,VS2,VS2,VS2,VS2,VS, VS, VS3,_,  _,  VP4,VP3,VP, VP, VP2,VP, VP3,VP4,_,  _,  _,  _],
    [_,  _,  _,  VP4,VP3,VP, VP2,VP, VP3,VP4,_,  _,  VS3,VS, VS, VS2,VS2,VS2,VS2,VS2,VS2,VS2,VS2,VS2,VS, VS, VS3,_,  _,  VP4,VP3,VP, VP2,VP, VP3,VP4,_,  _,  _,  _],
    // Row 12-15: cosmic eyes with starlight highlights
    [_,  _,  _,  VP4,VP3,VP, VP2,VP, VP4,_,  _,  VS3,VS, VS, VS2,VS2,VS2,VS2,VS2,VS2,VS2,VS2,VS2,VS2,VS2,VS, VS, VS3,_,  _,  VP4,VP, VP2,VP, VP3,VP4,_,  _,  _,  _],
    [_,  _,  VP4,VP3,VP, VP2,VP, VP4,_,  _,  VS3,VS, BW, BW, BW, BW, BW, VS2,VS2,VS2,VS2,BW, BW, BW, BW, BW, VS, VS, VS3,_,  _,  VP4,VP, VP2,VP, VP3,VP4,_,  _,  _],
    [_,  _,  VP4,VP3,VP, VP2,VP, VP4,_,  _,  VS, VS, SW, VE2,VE, VE, VP3,BW, VS, VS, BW, SW, VE2,VE, VE, VP3,BW, VS, VS, _,  _,  VP4,VP, VP2,VP, VP3,VP4,_,  _,  _],
    [_,  _,  VP4,VP3,VP, VP2,VP, VP4,_,  _,  VS, VS, VE2,VE, VE, PU, VP3,BW, VS, VS, BW, VE2,VE, VE, PU, VP3,BW, VS, VS, _,  _,  VP4,VP, VP2,VP, VP3,VP4,_,  _,  _],
    // Row 16-19: lower eyes, serene expression
    [_,  _,  VP4,VP3,VP, VP2,VP, VP4,_,  _,  VS, VS, VE, VE, PU, PU, VP3,BW, VS, VS, BW, VE, VE, PU, PU, VP3,BW, VS, VS, _,  _,  VP4,VP, VP2,VP, VP3,VP4,_,  _,  _],
    [_,  _,  VP4,VP3,VP, VP2,VP, VP4,_,  _,  VS, VS, VS3,BW, VE, VE, BW, VS3,VS, VS, VS3,BW, VE, VE, BW, VS3,VS, VS, VS, _,  _,  VP4,VP, VP2,VP, VP3,VP4,_,  _,  _],
    [_,  _,  VP4,VP3,VP, VP2,VP, VP4,_,  _,  VS, VS, VS, VS3,VS3,VS3,VS, VS, VS, VS, VS, VS3,VS3,VS3,VS3,VS, VS, VS, VS, _,  _,  VP4,VP, VP2,VP, VP3,VP4,_,  _,  _],
    [_,  _,  VP4,VP3,VP, VP2,VP, VP4,_,  _,  VS, VS, VS, VS, VS, VS, VS, VS, VS, VS, VS, VS, VS, VS, VS, VS, VS, VS, VS, _,  _,  VP4,VP, VP2,VP, VP3,VP4,_,  _,  _],
    // Row 20-23: nose, serene slight smile
    [_,  _,  VP4,VP3,VP, VP2,VP, VP4,_,  _,  VS3,VS, VS, VS, VS, VS, VS, VS, VS, VS3,VS, VS, VS, VS, VS, VS, VS, VS, VS3,_,  _,  VP4,VP, VP2,VP, VP3,VP4,_,  _,  _],
    [_,  _,  VP4,VP3,VP, VP2,VP, VP4,_,  _,  VS3,VS, VS, VS, VS, VS, VS, VS, VS3,VS3,VS, VS, VS, VS, VS, VS, VS, VS, VS3,_,  _,  VP4,VP, VP2,VP, VP3,VP4,_,  _,  _],
    [_,  _,  VP4,VP3,VP, VP2,VP, VP4,_,  _,  VS3,VS, VS, VS, VS, VS, VS, VS, VS, VS, VS, VS, VL, VL, VL, VS, VS, VS, VS3,_,  _,  VP4,VP, VP2,VP, VP3,VP4,_,  _,  _],
    [_,  _,  VP4,VP3,VP, VP2,VP, VP4,_,  _,  VS3,VS, VS, VS, VS, VS, VS, VS, VS, VS, VS, VL, VS, VS, VL, VS, VS, VS, VS3,_,  _,  VP4,VP, VP2,VP, VP3,VP4,_,  _,  _],
    // Row 24-27: chin, jaw
    [_,  _,  VP4,VP3,VP, VP2,VP, VP4,_,  _,  _,  VS3,VS, VS, VS, VS, VS, VS, VS, VS, VS, VS, VS, VS, VS, VS, VS, VS3,_,  _,  _,  VP4,VP, VP2,VP, VP3,VP4,_,  _,  _],
    [_,  _,  VP4,VP3,VP, VP2,VP, VP4,_,  _,  _,  _,  VS3,VS, VS, VS, VS, VS, VS, VS, VS, VS, VS, VS, VS, VS, VS3,_,  _,  _,  _,  VP4,VP, VP2,VP, VP3,VP4,_,  _,  _],
    [_,  _,  VP4,VP3,VP, VP2,VP, VP, VP4,_,  _,  _,  _,  VS3,VS, VS, VS, VS, VS, VS, VS, VS, VS, VS, VS, VS3,_,  _,  _,  _,  VP4,VP, VP, VP2,VP, VP3,VP4,_,  _,  _],
    [_,  _,  VP4,VP3,VP, VP2,VP, VP, VP3,VP4,_,  _,  _,  _,  VS3,VS3,VS, VS, VS, VS, VS, VS, VS3,VS3,_,  _,  _,  _,  _,  VP4,VP3,VP, VP, VP2,VP, VP3,VP4,_,  _,  _],
    // Row 28-31: neck, elaborate cosmic collar
    [_,  _,  VP4,VP3,VP, VP2,VP, VP, VP, VP3,VP4,_,  _,  _,  _,  VS3,VS, VS, VS, VS, VS, VS, VS3,_,  _,  _,  _,  _,  VP4,VP3,VP, VP, VP, VP2,VP, VP3,VP4,_,  _,  _],
    [_,  _,  VP4,VP3,VP, VP2,VP, VP, VP, VP, VP3,VP4,_,  _,  _,  _,  VS3,VS, VS, VS, VS, VS3,_,  _,  _,  _,  _,  VP4,VP3,VP, VP, VP, VP, VP2,VP, VP3,VP4,_,  _,  _],
    [_,  VP4,VP3,VP, VP2,VP, VP, VP, VP, VP, VP, VP3,VP4,_,  GC3,GC, DD2,DD, VS3,VS3,DD, DD2,GC, GC3,_,  _,  VP4,VP3,VP, VP, VP, VP, VP, VP, VP2,VP, VP3,VP4,_,  _],
    [_,  VP4,VP3,VP, VP2,VP, VP, VP, VP, VP, VP, VP, VP3,GC3,GC, GC2,DD, DD2,DD3,DD3,DD2,DD, GC2,GC, GC3,VP3,VP, VP, VP, VP, VP, VP, VP, VP, VP2,VP, VP3,VP4,_,  _],
    // Row 32-35: cosmic collar with stars, shoulders
    [VP4,VP3,VP, VP2,VP, VP, VP, VP, VP, VP, VP, VP3,GC, GC2,DD, DD2,DD3,SW, DD3,DD3,SW, DD3,DD2,DD, GC2,GC, VP3,VP, VP, VP, VP, VP, VP, VP, VP, VP2,VP, VP3,VP4,_],
    [VP4,VP3,VP, VP2,VP, VP, VP, VP, VP, VP, VP3,GC, GC2,DD, DD2,DD3,DD, DD3,DD2,DD2,DD3,DD, DD3,DD2,DD, GC2,GC, VP3,VP, VP, VP, VP, VP, VP, VP, VP, VP2,VP, VP3,VP4],
    [VP4,VP3,VP, VP2,VP, VP, VP, VP, VP, VP3,GC, DD, DD2,DD3,DD, DD, DD3,DD2,SW, SW, DD2,DD3,DD, DD, DD3,DD2,DD, GC, VP3,VP, VP, VP, VP, VP, VP, VP, VP, VP2,VP, VP3],
    [VP4,VP3,VP, VP2,VP, VP, VP, VP, VP3,DD, DD2,DD3,DD, DD, DD3,DD2,DD, DD3,DD2,DD2,DD3,DD, DD2,DD3,DD, DD, DD3,DD2,DD, VP3,VP, VP, VP, VP, VP, VP, VP, VP2,VP, VP3],
    // Row 36-39: cosmic dress top with star dots
    [VP4,VP3,VP, VP2,VP, VP, VP, VP3,DD, DD2,DD3,DD, DD, DD3,DD2,DD, DD3,_,  _,  _,  DD3,DD, DD2,DD3,DD, DD, DD3,DD2,DD, DD, VP3,VP, VP, VP, VP, VP, VP, VP2,VP, VP3],
    [VP4,VP3,VP, VP2,VP, VP, VP3,DD, DD2,DD3,DD, SW, DD3,DD2,DD, DD3,_,  _,  _,  _,  _,  DD3,DD, DD2,DD3,SW, DD, DD3,DD2,DD, DD, VP3,VP, VP, VP, VP, VP, VP2,VP, VP3],
    [VP4,VP3,VP, VP2,VP, VP3,DD, DD2,DD3,DD, DD, DD3,DD2,DD, DD3,_,  _,  _,  _,  _,  _,  _,  DD3,DD, DD2,DD3,DD, DD, DD3,DD2,DD, DD, VP3,VP, VP, VP, VP, VP2,VP, VP3],
    [VP4,VP3,VP, VP2,VP3,DD, DD2,DD3,DD, DD, DD3,DD2,DD, DD3,_,  _,  _,  _,  _,  _,  _,  _,  _,  DD3,DD, DD2,DD3,DD, DD, DD3,DD2,DD, DD, VP3,VP, VP, VP, VP2,VP, VP3],
    // Row 40-43: lower dress with star pattern
    [VP4,VP3,VP, VP3,DD, DD2,DD3,DD, SW, DD3,DD2,DD, DD3,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  DD3,DD, DD2,DD3,SW, DD, DD3,DD2,DD, DD, VP3,VP, VP, VP2,VP, VP3],
    [VP4,VP3,VP3,DD, DD2,DD3,DD, DD, DD3,DD2,DD, DD3,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  DD3,DD, DD2,DD3,DD, DD, DD3,DD2,DD, DD, VP3,VP, VP2,VP, VP3],
    [VP4,VP3,DD, DD2,DD3,DD, DD, DD3,DD2,DD, DD3,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  DD3,DD, DD2,DD3,DD, DD, DD3,DD2,DD, DD, VP3,VP2,VP, VP3],
    [VP4,DD, DD2,DD3,DD, SW, DD3,DD2,DD, DD3,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  DD3,DD, DD2,DD3,SW, DD, DD3,DD2,DD, DD, VP3,VP, VP3],
    // Row 44-47: bottom cosmic dress
    [DD, DD2,DD3,DD, DD, DD3,DD2,DD, DD3,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  DD3,DD, DD2,DD3,DD, DD, DD3,DD2,DD, DD, VP3,VP3],
    [DD2,DD3,DD, DD, DD3,DD2,DD, DD3,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  DD3,DD, DD2,DD3,DD, DD, DD3,DD2,DD, DD, VP3],
    [DD3,DD, DD, DD3,DD2,DD, DD3,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  DD3,DD, DD2,DD3,DD, DD, DD3,DD, DD, DD],
    [DD, DD, DD3,DD2,DD, DD3,_,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  DD3,DD, DD2,DD3,DD, DD, DD3,DD, DD],
  ];

  // ── Render a single portrait to a Phaser canvas texture ───────────
  private static renderPortrait(
    scene: Phaser.Scene,
    key: string,
    data: number[][],
    w: number,
    h: number
  ): void {
    const scale = 2;
    const texW = w * scale;
    const texH = h * scale;
    const texture = scene.textures.createCanvas(key, texW, texH);
    if (!texture) return;
    const ctx = texture.getContext();
    for (let y = 0; y < h; y++) {
      const row = data[y];
      if (!row) continue;
      for (let x = 0; x < w; x++) {
        const color = row[x];
        if (color !== 0) {
          ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }
    texture.refresh();
  }

  /**
   * Render all portrait textures. Call once during scene preload/create.
   */
  static renderAll(scene: Phaser.Scene): void {
    PortraitSprites.renderPortrait(scene, 'portrait_player', PortraitSprites.playerPortrait, 40, 48);
    PortraitSprites.renderPortrait(scene, 'portrait_boss1', PortraitSprites.boss1Portrait, 40, 48);
    PortraitSprites.renderPortrait(scene, 'portrait_boss2', PortraitSprites.boss2Portrait, 40, 48);
    PortraitSprites.renderPortrait(scene, 'portrait_boss3', PortraitSprites.boss3Portrait, 40, 48);
  }
}
