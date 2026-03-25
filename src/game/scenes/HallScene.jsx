import Phaser from "phaser";

// ─────────────────────────────────────────────────────────────────────
// ACHIEVEMENT DATA — edit titles/descriptions/image paths here
// Put certificate/award images in: /public/assets/certs/
// Missing images → emoji fallback shown instead (no crash)
// ─────────────────────────────────────────────────────────────────────
const ACHIEVEMENTS = {
  cert1:  { label:"Certificate", emoji:"📜", color:0xf59e0b,
             title:"DICT Cybersecurity Seminar",
             desc:"Completed the Department of ICT Cybersecurity awareness seminar covering network defense and data protection.",
             img:"/assets/certs/cert1.png" },
  cert2:  { label:"Certificate", emoji:"📜", color:0xf59e0b,
             title:"Web Development Bootcamp",
             desc:"Completed an intensive bootcamp covering React, Node.js, and modern frontend tooling.",
             img:"/assets/certs/cert2.png" },
  cert3:  { label:"Certificate", emoji:"📜", color:0xf59e0b,
             title:"AI & Machine Learning Fundamentals",
             desc:"Earned certification in AI/ML covering supervised learning, neural networks, and model evaluation.",
             img:"/assets/certs/cert3.png" },
  cert4:  { label:"Certificate", emoji:"📜", color:0xf59e0b,
             title:"Python Programming",
             desc:"Certified in Python covering data structures, OOP, and scripting fundamentals.",
             img:"/assets/certs/cert4.png" },
  cert5:  { label:"Certificate", emoji:"📜", color:0xf59e0b,
             title:"Database Administration",
             desc:"Completed database training with MySQL — queries, normalization, and optimization.",
             img:"/assets/certs/cert5.png" },
  cert6:  { label:"Certificate", emoji:"📜", color:0xf59e0b,
             title:"UI/UX Design Principles",
             desc:"Certification in user interface and experience design — wireframing, prototyping, accessibility.",
             img:"/assets/certs/cert6.png" },
  award1: { label:"Award", emoji:"🏆", color:0xa78bfa,
             title:"Best Capstone Project",
             desc:"Awarded Best Capstone for the Infant Cry Recognition System — recognized for innovation and real-world impact.",
             img:"/assets/certs/award1.png" },
  award2: { label:"Award", emoji:"🎖️", color:0xa78bfa,
             title:"Dean's List",
             desc:"Recognized on the Dean's List for academic excellence — top 10% of the Computer Science program.",
             img:"/assets/certs/award2.png" },
  award3: { label:"Award", emoji:"⭐", color:0xa78bfa,
             title:"Most Outstanding Student",
             desc:"Awarded for exemplary academic performance, leadership, and contributions to the university community.",
             img:"/assets/certs/award3.png" },
  award4: { label:"Award", emoji:"🥈", color:0xa78bfa,
             title:"Programming Competition Finalist",
             desc:"Reached the finals of the regional inter-university programming competition.",
             img:"/assets/certs/award4.png" },
};

const GUIDE_LINES = [
  "✨ Oh! A visitor! Welcome to the Hall of Achievement!\nFeel free to wander — every frame tells a story!",
  "✨ Walk up to any frame and press  E  to view it.",
  "🌟 Those certificates? Each one is a late night that became a lesson worth keeping!",
  "🎓 The awards are quite shiny... I may have polished them a dozen times today!",
  "🏆 Walk up to any frame and press  E  to take a closer look — go on!",
  "🚪 When you're ready, the EXIT at the top takes you back outside!\nBut do linger a while... it gets quiet in here! ✨",
];

export default class HallScene extends Phaser.Scene {
  constructor() {
    super("HallScene");
  }

  // ─────────────────────────────────────────────────────────────────
  preload() {
    this.load.spritesheet("player", "/assets/sprites/player1.png", {
      frameWidth: 37, frameHeight: 37,
    });

    // ✅ Rename your hall JSON to hall_map.json
    this.load.tilemapTiledJSON("hallmap", "/assets/tiles/hall_map.json");

    // ✅ Open your .tsj files, find "image" field, copy those PNGs here:
    this.load.image("acc_img",  "/assets/tiles/[Base]BaseChip_pipo.png");
    this.load.image("dobj_img", "/assets/tiles/roguelikeDungeon_32x32.png");
    this.load.image("hall_img", "/assets/tiles/Dungeon_object_transparent.png");

    // Same images as spritesheets for rendering GID object sprites
    this.load.spritesheet("acc_ss",  "/assets/tiles/[Base]BaseChip_pipo.png",
      { frameWidth: 32, frameHeight: 32, margin: 1, spacing: 0  });
    this.load.spritesheet("dobj_ss", "/assets/tiles/roguelikeDungeon_32x32.png",
      { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet("hall_ss", "/assets/tiles/Dungeon_object_transparent.png",
      { frameWidth: 32, frameHeight: 32, margin: 1, spacing: 0 });

    // Cert/award images — missing ones fall back to emoji
    Object.entries(ACHIEVEMENTS).forEach(([id, d]) =>
      this.load.image(`ach_${id}`, d.img)
    );
    this.load.on("complete", () => {
  console.log("Loaded textures:", this.textures.list);
});

    this.load.on("loaderror", (f) =>
      console.warn("⚠️  Missing:", f.src, "(fallback used)")
    );

  }

  // ─────────────────────────────────────────────────────────────────
  create() {
    // ✅ Use this.scale.width/height — same as DungeonScene, matches canvas exactly
    const W = this.scale.width;
    const H = this.scale.height;
    // Match this hex code to your floor tile color (e.g., #1a1a2e)
this.cameras.main.setBackgroundColor('#1a1a2e');

    // ── TILEMAP ──────────────────────────────────────────────────
    const map = this.make.tilemap({ key: "hallmap" });

    const tsAcc  = map.addTilesetImage("acessories",    "acc_img");
    const tsDObj = map.addTilesetImage("Dungeon_object", "dobj_img");
    const tsHall = map.addTilesetImage("hall",           "hall_img");
    const allTs  = [tsAcc, tsDObj, tsHall].filter(Boolean);

    if (allTs.length === 0) {
      // Graceful fallback — never show black screen
      this.add.rectangle(0, 0, map.widthInPixels || 800, map.heightInPixels || 640, 0x1a1a2e).setOrigin(0, 0);
      this.add.text(400, 300,
        "⚠️  Tileset images missing!\n\nPut in /public/assets/tiles/:\n• acessories.png\n• roguelikeDungeon_32x32.png\n• Dungeon_object_transparent.png",
        { fontSize: "14px", color: "#ffdd57", align: "center", wordWrap: { width: 500 } }
      ).setOrigin(0.5);
    } 

    // ── OBJECT LAYER ─────────────────────────────────────────────
    const objLayer = map.getObjectLayer("Object Layer 1");
    if (!objLayer) {   console.error("Object Layer 1 not found"); return; }
    this.spawnedObjects = [];
    this.interactables = [];
    this._spawnX     = 401;
    this._spawnY     = 534;
    this._guideCX    = 399;
    this._guideCY    = 293;
    this._guideRange = 105;
  

    objLayer.objects.forEach((obj) => {
    // 1. Handle Points (Player Spawn)
    if (obj.name === "player" && obj.point) {
        this._spawnX = obj.x;
        this._spawnY = obj.y;
        return; 
    }

    // 2. Handle Logic/Interactive Types (Certs, Awards, Exit)
    // We do this BEFORE the GID check so Rectangles work!
    if (["cert", "awards", "exit", "guide"].includes(obj.type)) {
        
        // Setup Guide coordinates
        if (obj.type === "guide") {
            this._guideCX = obj.x;
            this._guideCY = obj.y;
        }

        // Setup Interaction Area
        const cx = obj.x + (obj.width  || 32) / 2;
        const cy = obj.y + (obj.height || 32) / 2; // Rectangles use top-left, so + instead of -
        
        this.interactables.push({ 
            name: obj.name, 
            type: obj.type, 
            cx, 
            cy,
            range: obj.type === "exit" ? 56 : 60 
        });

        // Add Glow only for Certs/Awards
        if (obj.type === "cert" || obj.type === "awards") {
            const glow = this.add.circle(cx, cy, 20, obj.type === "cert" ? 0xfbbf24 : 0xa78bfa, 0.12).setDepth(2);
            this.tweens.add({
                targets: glow, alpha: 0.03, duration: 1500, yoyo: true, repeat: -1
            });
        }
    }

    // 3. Handle Visuals (GID Sprites)
    // If it's just a rectangle (like an exit), it stops here. If it's a chair/desk, it draws.
    if (!obj.gid) return; 

    const { key, frame, flipX, flipY } = this._gidToTex(obj.gid);
    if (this.textures.exists(key)) {
        const spr = this.add.image(obj.x, obj.y, key, frame);
        spr.setOrigin(0, 1).setDepth(3);
        if (obj.rotation) spr.setAngle(obj.rotation);
        if (flipX) spr.setFlipX(true);
        if (flipY) spr.setFlipY(true);
        this.spawnedObjects.push(spr);
    }
});
    // Guide orb
    // this._buildGuideOrb(this._guideCX, this._guideCY);

    // ── PLAYER ──────────────────────────────────────────────────
    this.player = this.physics.add.sprite(this._spawnX, this._spawnY, "player");
    this.player.setCollideWorldBounds(true).setDepth(10);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.player.body.setSize(16, 10); 
this.player.body.setOffset(10, 24); // Position the box at the feet
    
 objLayer.objects.forEach(obj => {
  if (obj.type !== "collision") return;

  const rect = this.add.rectangle(
    obj.x + (obj.width  || 32) / 2,
    obj.y - (obj.height || 32) / 2,
    obj.width  || 32,
    obj.height || 32,
    0xff0000,
    0// set to 0.3 to debug
  );
  rect.width = obj.width;
  rect.height = obj.height;
  this.physics.add.existing(rect, true);
  this.physics.add.collider(this.player, rect);
});
 // ── Create layers ──
this.mapLayers = [];

["floor", "object", "decor", "Tile Layer 4"].forEach((name, i) => {
    const layer = map.createLayer(name, allTs);
    if (!layer) return;

    layer.setDepth(i);

    // If it's a layer we already drew manually (object/decor), 
    // make the tile layer version invisible so it doesn't double up
    if (name === "object" || name === "decor") {
        layer.setCollisionByExclusion([-1]);
        this.physics.add.collider(this.player, layer);
    }

    if (name === "Tile Layer 4") {
        layer.setCollisionByExclusion([-1]);
        this.physics.add.collider(this.player, layer);
    }

    this.mapLayers.push(layer);
});
this.mapLayers.forEach(layer => {
  // Only add colliders to the layers we marked as solid above
  if (layer.layer.name !== "floor"|| layer.layer.name !== "Tile Layer 4") {
    this.physics.add.collider(this.player, layer);
  }
});

    if (!this.anims.exists("h-idle")) {
      this.anims.create({ key: "h-left",  frames: this.anims.generateFrameNumbers("player", { start: 14, end: 19 }), frameRate: 7, repeat: -1 });
      this.anims.create({ key: "h-down",  frames: this.anims.generateFrameNumbers("player", { start: 27, end: 32 }), frameRate: 7, repeat: -1 });
      this.anims.create({ key: "h-right", frames: this.anims.generateFrameNumbers("player", { start: 40, end: 45 }), frameRate: 7, repeat: -1 });
      this.anims.create({ key: "h-up",    frames: this.anims.generateFrameNumbers("player", { start: 53, end: 58 }), frameRate: 7, repeat: -1 });
      this.anims.create({ key: "h-idle",  frames: [{ key: "player", frame: 26 }], frameRate: 1, repeat: -1 });
    }
    this.player.anims.play("h-idle");

    // ── INPUT ────────────────────────────────────────────────────
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
  W: Phaser.Input.Keyboard.KeyCodes.W,
  A: Phaser.Input.Keyboard.KeyCodes.A,
  S: Phaser.Input.Keyboard.KeyCodes.S,
  D: Phaser.Input.Keyboard.KeyCodes.D,
  E: Phaser.Input.Keyboard.KeyCodes.E
});
    // ── MAIN CAMERA — same settings as DungeonScene ──────────────
    this.cameras.main.setZoom(2.5);
this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

// This line ensures that if the map is smaller than the screen, it stays centered
this.cameras.main.centerOn(map.widthInPixels / 2, map.heightInPixels / 2);

this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

// Force the camera to stay within the map 
this.cameras.main.setRoundPixels(true);

// UI CAMERA
this.uiCam = this.cameras.add(0, 0, W, H);
this.uiCam.setScroll(0, 0);
this.uiCam.setZoom(1);

// Build UI
this._buildUI(W, H);

// Ignore logic
this.uiCam.ignore([
  ...this.mapLayers,
  this.player,
  ...this.spawnedObjects
]);

this.cameras.main.ignore(this._uiNodes);

    // ── RESIZE ──────────────────────────────────────────────────
  this.scale.on("resize", (gs) => {
  const nW = gs.width, nH = gs.height;
  this.cameras.main.setSize(nW, nH);
  
  // Re-center the world view
  this.cameras.main.centerOn(map.widthInPixels / 2, map.heightInPixels / 2);
  
  this.uiCam.setSize(nW, nH);
  this._resizeUI(nW, nH);
})
    // State
    this._guideIdx    = 0;
    this._guideLock   = false;
    this._popupOpen   = false;
    this._confirmOpen = false;

  }

  // ─────────────────────────────────────────────────────────────────
  // GID → texture key + frame
  // acessories  firstgid = 1     → acc_ss  frame = gid - 1
  // Dungeon_obj firstgid = 925   → dobj_ss frame = gid - 925
  // hall        firstgid = 1447  → hall_ss frame = gid - 1447
  // ─────────────────────────────────────────────────────────────────
  _gidToTex(rawGid) {
    const FLIP_H = 0x80000000, FLIP_V = 0x40000000;
    const MASK   = ~(FLIP_H | FLIP_V | 0x20000000) & 0xFFFFFFFF;
    const g      = (rawGid >>> 0) & MASK;
    const flipX  = !!((rawGid >>> 0) & FLIP_H);
    const flipY  = !!((rawGid >>> 0) & FLIP_V);
    let key, frame;
    if      (g >= 1447) { key = "hall_ss";  frame = g - 1447; }
    else if (g >= 925)  { key = "dobj_ss";  frame = g - 925;  }
    else                { key = "acc_ss";   frame = g - 1;    }
    return { key, frame, flipX, flipY };
  }

  // ─────────────────────────────────────────────────────────────────
  // GUIDE ORB
  // ─────────────────────────────────────────────────────────────────
  // _buildGuideOrb(x, y) {
  //   const c    = this.add.container(x, y).setDepth(8);
  //   const o2   = this.add.circle(0, 0, 42, 0x7c3aed, 0.06);
  //   const o1   = this.add.circle(0, 0, 28, 0xa78bfa, 0.14);
  //   const core = this.add.circle(0, 0, 17, 0xc4b5fd, 0.92);
  //   const sh   = this.add.circle(-5, -5, 5, 0xffffff, 0.55);
  //   const lbl  = this.add.text(0, 26, "✦ Guide ✦", {
  //     fontSize: "8px", color: "#c4b5fd", fontStyle: "bold",
  //     stroke: "#000", strokeThickness: 2,
  //   }).setOrigin(0.5);
  //   c.add([o2, o1, core, sh, lbl]);
  //   this.tweens.add({ targets: c,  y: y - 12,  duration: 2000, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
  //   this.tweens.add({ targets: o1, alpha: 0.05, duration: 1500, yoyo: true, repeat: -1 });
  //   this.tweens.add({ targets: sh, angle: 360,  duration: 3600, repeat: -1 });
  // }

  // ─────────────────────────────────────────────────────────────────
  // UI BUILD
  // ─────────────────────────────────────────────────────────────────
  _buildUI(W, H) {
    const P = 14, BH = 110, BY = H - BH - P;

    this.hintTxt = this.add.text(W / 2, H - 28, "", {
      fontSize: "12px", color: "#ffdd57",
      stroke: "#000", strokeThickness: 4, align: "center",
    }).setOrigin(0.5, 1).setDepth(300).setVisible(false);

    this.tweens.add({ targets: this.dlgCursor, alpha: 0, duration: 500, yoyo: true, repeat: -1 });

    this._buildPopup(W, H);
    this._buildConfirm(W, H);


    this._W = W; this._H = H; this._P = P; this._BH = BH; this._BY = BY;
     const PAD = 14;
  const BOX_H = 140;
  const PORT = 52;
  const BOX_Y = H - BOX_H - PAD;

  const sepX = PAD + 10 + PORT + 12;
  const txtX = sepX + 10;

  // ── Dialogue Box ──
  this.dlgBorder = this.add.rectangle(PAD, BOX_Y, W - PAD * 2, BOX_H, 0x555555)
    .setOrigin(0).setDepth(298);

  this.dlgBg = this.add.rectangle(PAD + 2, BOX_Y + 2, W - PAD * 2 - 4, BOX_H - 4, 0x050508)
    .setOrigin(0).setDepth(299);

  // ── Portrait Background ──
  this.dlgPortBg = this.add.rectangle(
    PAD + 10,
    BOX_Y + (BOX_H - PORT) / 2,
    PORT,
    PORT,
    0x000000,
    0.5
  ).setOrigin(0).setDepth(300);

  this.dlgPortBorder = this.add.rectangle(
    PAD + 10,
    BOX_Y + (BOX_H - PORT) / 2,
    PORT,
    PORT
  )
    .setOrigin(0)
    .setStrokeStyle(1, 0x555555)
    .setFillStyle()
    .setDepth(300);

  // ── Portrait Image ──
  this.dlgPortrait = this.add.image(
    PAD + 10 + PORT / 2,
    BOX_Y + BOX_H / 2,
    "ss_map",
    1
  )
    .setOrigin(0.5)
    .setDepth(302)
    .setDisplaySize(PORT - 4, PORT - 4);

  // ── Letter fallback ──
  this.dlgPortLetter = this.add.text(
    PAD + 10 + PORT / 2,
    BOX_Y + BOX_H / 2,
    "?",
    {
      fontSize: "24px",
      color: "#ffdd57",
      fontStyle: "bold",
      stroke: "#000",
      strokeThickness: 3
    }
  ).setOrigin(0.5).setDepth(301);

  // ── Separator ──
  this.dlgSep = this.add.rectangle(sepX, BOX_Y + 8, 1, BOX_H - 16, 0x333333)
    .setOrigin(0).setDepth(300);

  // ── Name ──
  this.dlgName = this.add.text(
    txtX,
    BOX_Y + 10,
    "",
    { fontSize: "13px", color: "#ffdd57", fontStyle: "bold" }
  ).setDepth(301);

  // ── Dialogue Text ──
  this.dlgText = this.add.text(
    txtX,
    BOX_Y + 30,
    "",
    {
      fontSize: "13px",
      color: "#eeeeee",
      lineSpacing: 5,
      wordWrap: { width: W - txtX - PAD - 10 }
    }
  ).setDepth(301);

  // ── Cursor (blinking) ──
  this.dlgCursor = this.add.text(
    W - PAD - 10,
    H - PAD - 10,
    "▼",
    { fontSize: "11px", color: "#888888" }
  ).setOrigin(1, 1).setDepth(301);

  this.tweens.add({
    targets: this.dlgCursor,
    alpha: 0,
    duration: 500,
    yoyo: true,
    repeat: -1
  });

  // ── Close hint ──
  this.dlgHint = this.add.text(
    W - PAD - 10,
    H - PAD - 22,
    "[ E ] Close",
    { fontSize: "10px", color: "#666666" }
  ).setOrigin(1, 1).setDepth(301);

  // ── Group elements ──
  this.dlgElements = [
    this.dlgBorder,
    this.dlgBg,
    this.dlgPortBg,
    this.dlgPortBorder,
    this.dlgPortrait,
    this.dlgPortLetter,
    this.dlgSep,
    this.dlgName,
    this.dlgText,
    this.dlgCursor,
    this.dlgHint
  ];

  this._uiNodes = [
  this.hintTxt,
  ...this.dlgElements,   // ✅ NEW dialogue system
  ...Object.values(this._pop),
  ...Object.values(this._conf),
].filter(el => el?.setDepth);
  // Hide initially
  this.dlgElements.forEach(el => el.setVisible(false));
}

  _buildPopup(W, H) {
    const pw = Math.min(W * 0.88, 640);
    const ph = Math.min(H * 0.86, 520);
    const px = (W - pw) / 2;
    const py = (H - ph) / 2;
    const ih = ph - 130;

    this._pop = {
      ov:  this.add.rectangle(0, 0, W, H, 0x000000, 0.82)
             .setOrigin(0, 0).setDepth(400).setVisible(false).setInteractive(),
      bg:  this.add.rectangle(px, py, pw, ph, 0x0b0b1e, 1)
             .setOrigin(0, 0).setDepth(401).setVisible(false).setStrokeStyle(1, 0x222244),
      ibg: this.add.rectangle(px + 16, py + 16, pw - 32, ih, 0x111130, 1)
             .setOrigin(0, 0).setDepth(402).setVisible(false),
      img: this.add.image(px + pw / 2, py + 16 + ih / 2, "__DEFAULT")
             .setDepth(403).setVisible(false),
      fb:  this.add.text(px + pw / 2, py + 16 + ih / 2, "📜", { fontSize: "80px" })
             .setOrigin(0.5).setDepth(403).setVisible(false),
      ttl: this.add.text(px + pw / 2, py + ph - 106, "", {
             fontSize: "16px", color: "#fbbf24", fontStyle: "bold",
             wordWrap: { width: pw - 32 }, align: "center",
           }).setOrigin(0.5, 0).setDepth(403).setVisible(false),
      dsc: this.add.text(px + pw / 2, py + ph - 76, "", {
             fontSize: "12px", color: "#94a3b8", lineSpacing: 4,
             wordWrap: { width: pw - 32 }, align: "center",
           }).setOrigin(0.5, 0).setDepth(403).setVisible(false),
      cls: this.add.text(px + pw - 10, py + 10, "✕", { fontSize: "18px", color: "#555" })
             .setOrigin(1, 0).setDepth(404).setVisible(false).setInteractive()
             .on("pointerover", function() { this.setColor("#fff"); })
             .on("pointerout",  function() { this.setColor("#555"); })
             .on("pointerdown", () => this._closePopup()),
      hint:this.add.text(px + pw / 2, py + ph - 12, "[ E ] Close", { fontSize: "10px", color: "#333" })
             .setOrigin(0.5, 1).setDepth(403).setVisible(false),
    };
    this._pop.ov.on("pointerdown", () => this._closePopup());
    this._pw = pw; this._ph = ph; this._px = px; this._py = py; this._ih = ih;
  }

  _buildConfirm(W, H) {
  const mw = 380, mh = 180;
  const mx = (W - mw) / 2, my = (H - mh) / 2;

  this._conf = {
    ov: this.add.rectangle(0, 0, W, H, 0x000000, 0.65)
      .setOrigin(0, 0).setDepth(500).setVisible(false).setInteractive(),

    bg: this.add.rectangle(mx, my, mw, mh, 0x0b0b1e, 1)
      .setOrigin(0, 0).setDepth(501).setVisible(false)
      .setStrokeStyle(1, 0x333366),

    msg: this.add.text(mx + mw / 2, my + 28, "Ready to leave the Hall?", {
      fontSize: "16px", color: "#fff", fontStyle: "bold",
    }).setOrigin(0.5, 0).setDepth(502).setVisible(false),

    sub: this.add.text(mx + mw / 2, my + 62,
      "Your journey doesn't end here —\nthe portfolio still awaits! 🌟",
      {
        fontSize: "12px", color: "#64748b",
        align: "center", lineSpacing: 5,
      }
    ).setOrigin(0.5, 0).setDepth(502).setVisible(false),

    yes: this.add.text(mx + mw / 2 - 56, my + mh - 28, "[ Yes, leave ]", {
      fontSize: "14px", color: "#4ade80", fontStyle: "bold",
    }).setOrigin(0.5, 1).setDepth(502).setVisible(false).setInteractive()
      .on("pointerdown", () => this._doExit()),

    no: this.add.text(mx + mw / 2 + 62, my + mh - 28, "[ Stay ]", {
      fontSize: "14px", color: "#f87171", fontStyle: "bold",
    }).setOrigin(0.5, 1).setDepth(502).setVisible(false).setInteractive()
      .on("pointerdown", () => this._closeConfirm()),
  };
} // ✅ REQUIRED
  _resizeUI(W, H) {
    const P = this._P || 14, BH = this._BH || 110, BOX_Y = H - BH - P;
    this.hintTxt.setPosition(W / 2, H - 28);
    this._uiNodes.forEach(el => el.setScrollFactor(0));
  }

  // ─────────────────────────────────────────────────────────────────
  // ✅ CLEAN update() — no duplicate code, mobile + keyboard supported
  // ─────────────────────────────────────────────────────────────────
 update() {
  if (!this.player) return;

  this._checkGuide();

  const mob = window.__mobileInput || {};
  const spd = 140;

  const near = this._findNearby();
  this._updateHint(near);

  const eDown = Phaser.Input.Keyboard.JustDown(this.keys.E) || mob.e;
  if (mob.e) mob.e = false;

  // Handle interaction / closing
  if (eDown) {
    if (this._popupOpen) { this._closePopup(); return; }
    if (this._confirmOpen) { this._closeConfirm(); return; }
    if (this.dlgElements[0]?.visible) { this.closeDialogue(); return; }

    if (near) this._interact(near);
  }

  // Movement input
  const L = this.cursors.left.isDown  || mob.left || this.keys.A.isDown;
  const R = this.cursors.right.isDown || mob.right || this.keys.D.isDown;
  const U = this.cursors.up.isDown    || mob.up || this.keys.W.isDown;
  const D = this.cursors.down.isDown  || mob.down || this.keys.S.isDown;

  let vx = 0, vy = 0;

  if (L) vx = -spd;
  else if (R) vx = spd;

  if (U) vy = -spd;
  else if (D) vy = spd;

 const vec = new Phaser.Math.Vector2(vx, vy).normalize().scale(spd);
this.player.setVelocity(vec.x, vec.y);
  if (vx !== 0 || vy !== 0) {
    if (Math.abs(vx) > Math.abs(vy)) {
      this.player.anims.play(vx > 0 ? "h-right" : "h-left", true);
    } else {
      this.player.anims.play(vy > 0 ? "h-down" : "h-up", true);
    }
  } else {
    this.player.anims.play("h-idle", true);
  }

  if (this._popupOpen || this._confirmOpen) {
    this.hintTxt.setVisible(false);
    return;
  }
}

  // ─────────────────────────────────────────────────────────────────
  _findNearby() {
    const px = this.player.x, py = this.player.y;
    let best = null, bd = 9999;
    for (const obj of this.interactables) {
      const d = Phaser.Math.Distance.Between(px, py, obj.cx, obj.cy);
      if (d < obj.range && d < bd) { bd = d; best = obj; }
    }
    return best;
  }

  _updateHint(near) {
    if (!near) { this.hintTxt.setVisible(false); return; }
    const h = { cert: "[E] 📜 View Certificate", awards: "[E] 🏆 View Award", exit: "[E] 🚪 Leave the Hall"};
    const t = h[near.type];
    if (t) this.hintTxt.setText(t).setVisible(true);
    else   this.hintTxt.setVisible(false);
  }

_interact(near) {
  if (near.type === "cert" || near.type === "awards") this._openPopup(near.name);
  else if (near.type === "exit") this._openConfirm();
}

_checkGuide() {
  const d = Phaser.Math.Distance.Between(
    this.player.x,
    this.player.y,
    this._guideCX,
    this._guideCY
  );

  if (d < this._guideRange) {
    if (!this._guideLock) {
      this._guideLock = true;
      this.showDialogue("Guide", this._getGuideLine());
    }
  } else {
    this._guideLock = false; // reset when leaving
  }
}

  // ─────────────────────────────────────────────────────────────────
  // POPUP
  // ─────────────────────────────────────────────────────────────────
  _openPopup(name) {
    const data = ACHIEVEMENTS[name];
    if (!data) return;
    this._popupOpen = true;
    this._closeMsg();

    const { ov, bg, ibg, img, fb, ttl, dsc, cls, hint } = this._pop;

    const tk = `ach_${name}`;
    const hasImg = this.textures.exists(tk) && this.textures.get(tk).key !== "__DEFAULT";
    if (hasImg) {
      img.setTexture(tk);
      const src = this.textures.get(tk).source[0];
      const scale = Math.min((this._pw - 32) / src.width, this._ih / src.height, 1);
      img.setScale(scale).setPosition(this._px + this._pw / 2, this._py + 16 + this._ih / 2);
      img.setVisible(true);
      fb.setVisible(false);
    } else {
      fb.setText(data.emoji).setVisible(true);
      img.setVisible(false);
    }

    ttl.setText(`${data.emoji}  ${data.title}`).setVisible(true);
    dsc.setText(data.desc).setVisible(true);
    [ov, bg, ibg, cls, hint].forEach(el => el.setVisible(true));

    const all = [ov, bg, ibg, img, fb, ttl, dsc, cls, hint];
    all.forEach(el => el.setAlpha(0));
    this.tweens.add({ targets: all, alpha: 1, duration: 240 });
  }

  _closePopup() {
    this._popupOpen = false;
    const all = Object.values(this._pop).filter(el => el?.setAlpha);
    this.tweens.add({
      targets: all, alpha: 0, duration: 180,
      onComplete: () => all.forEach(el => el.setVisible(false).setAlpha(1)),
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // CONFIRM EXIT
  // ─────────────────────────────────────────────────────────────────
  _openConfirm() {
    this._confirmOpen = true;
    this._closeMsg();
    const all = Object.values(this._conf).filter(el => el?.setVisible);
    all.forEach(el => { el.setVisible(true); el.setAlpha(0); });
    this.tweens.add({ targets: all, alpha: 1, duration: 220 });
  }

  _closeConfirm() {
    this._confirmOpen = false;
    const all = Object.values(this._conf).filter(el => el?.setAlpha);
    this.tweens.add({
      targets: all, alpha: 0, duration: 180,
      onComplete: () => all.forEach(el => el.setVisible(false).setAlpha(1)),
    });
  }

  _doExit() {
    this.cameras.main.fadeOut(800, 0, 0, 0);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      const cb = this.game.registry.get("onExitGame");
      if (cb) cb();
      else this.scene.start("HallScene");
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // MSG / DIALOGUE
  // ─────────────────────────────────────────────────────────────────
  _showMsg(text) {
     if (this.dlgTimer) this.dlgTimer.remove();

  this.dlgName.setText("");
  this.dlgText.setText(text);

  this.dlgElements.forEach(el => el.setVisible(true));

  this.dlgTimer = this.time.delayedCall(
    Math.max(4500, text.length * 55),
    () => this.closeDialogue()
  );
  }

  _closeMsg() {
  if (this.dlgTimer) this.dlgTimer.remove();
  this.dlgElements.forEach(el => el.setVisible(false));
  }
  _getGuideLine() {
  const line = GUIDE_LINES[this._guideIdx % GUIDE_LINES.length];
  this._guideIdx++;
  return line;
}
showDialogue(speaker, msg) {
  if (this.dlgTimer) this.dlgTimer.remove();

  const isNPC = (speaker === "Guide");

  // Set text
  this.dlgName.setText(speaker || "");
  this.dlgText.setText(msg);

  // Show base UI
  this.dlgElements.forEach(el => el.setVisible(true));

  // ── Portrait vs Letter ──
  if (isNPC) {
    this.dlgPortrait
      .setTexture("acc_ss", 808) // NPC face frame
      .setVisible(true);

    this.dlgPortLetter.setVisible(false);
  } else {
    this.dlgPortrait.setVisible(false);

    this.dlgPortLetter
      .setText(speaker ? speaker[0].toUpperCase() : "!")
      .setVisible(true);
  }

  // ── Name visibility ──
  const hasSpeaker = !!(speaker?.length);
  this.dlgSep.setVisible(hasSpeaker);
  this.dlgName.setVisible(hasSpeaker);

  // ── Auto close timer ──
  this.dlgTimer = this.time.delayedCall(
    Math.max(5000, msg.length * 65),
    () => this.closeDialogue()
  );
}
closeDialogue() {
  if (this.dlgTimer) this.dlgTimer.remove();
  this.dlgElements.forEach(el => el.setVisible(false));
};
}
