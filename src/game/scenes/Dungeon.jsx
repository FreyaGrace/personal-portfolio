import Phaser from "phaser";

export default class DungeonScene extends Phaser.Scene {
  constructor() {
    super("DungeonScene");
  }

  preload() {
    // ── IMAGES (only 3 unique PNGs directly in map.json) ──────────
    this.load.image("img_map",  "/assets/tiles/map.png");
    this.load.image("img_hall", "/assets/tiles/Dungeon_object_transparent.png");
    this.load.image("img_acc",  "/assets/tiles/[Base]BaseChip_pipo.png");

    // ── TSJ tilesets — load their images here ─────────────────────
    // Open each .tsj file in VS Code, find "image" field, copy PNG to /assets/tiles/
    // then update the filenames below:
    this.load.image("img_dungobj", "/assets/tiles/roguelikeDungeon_32x32.png");  // Dungeon_object.tsj
    this.load.image("img_obj",     "/assets/tiles/OBJECT.png");          // OBJECT.tsj
    this.load.image("img_fff",     "/assets/tiles/roguelikeDungeon_32x32.png");      // fffffff.tsj ✅ confirmed
    this.load.image("img_acc2",    "/assets/tiles/[Base]BaseChip_pipo.png"); // acessories.tsj

    // ── SPRITESHEETS for GID object rendering ────────────────────
    this.load.spritesheet("ss_map", "/assets/tiles/map.png",
      { frameWidth: 32, frameHeight: 32, margin: 0, spacing: 0 });

    // Dungeon_object.tsj: (Usually 0, check your TSJ for this one, but fffffff.tsj confirmed 1)
    this.load.spritesheet("ss_dungobj", "/assets/tiles/roguelikeDungeon_32x32.png",
      { frameWidth: 32, frameHeight: 32, margin: 0, spacing: 0 });

    // OBJECT.tsj: margin 0
    this.load.spritesheet("ss_obj", "/assets/tiles/OBJECT.png",
      { frameWidth: 32, frameHeight: 32, margin: 0, spacing: 0 });

    // fffffff.tsj: margin 1 (As you confirmed)
    this.load.spritesheet("ss_fff", "/assets/tiles/roguelikeDungeon_32x32.png",
      { frameWidth: 32, frameHeight: 32, margin: 1, spacing: 0 });

    // hall.tsj: margin 1 (From your JSON)
    this.load.spritesheet("ss_hall", "/assets/tiles/Dungeon_object_transparent.png",
      { frameWidth: 32, frameHeight: 32, margin: 1, spacing: 0 });

    // acessories.tsj: margin 1 (From your JSON)
    this.load.spritesheet("ss_acc", "/assets/tiles/[Base]BaseChip_pipo.png",
      { frameWidth: 32, frameHeight: 32, margin: 1, spacing: 0 });

    this.load.tilemapTiledJSON("map", "/assets/tiles/map.json");
    this.load.spritesheet("player", "/assets/sprites/player1.png", {
      frameWidth: 37, frameHeight: 37,
    });
    this.load.on("loaderror", (f) => console.error("❌ MISSING:", f.src));
  }

  // ── GID → spritesheet key + frame ────────────────────────────
  // GID ranges from the ACTUAL map.json (new version):
  //   1    – 132   → ss_map      map.png            (firstgid=1,    name="map")
  //   133  – 654   → ss_dungobj  Dungeon_object.tsj (firstgid=133)
  //   655  – 789   → ss_obj      OBJECT.tsj         (firstgid=655)
  //   790  – 921   → ss_map      map.png            (firstgid=790,  name="map_b")
  //   922  – 2719  → ss_fff      fffffff.tsj        (firstgid=922)
  //   2720 – 3195  → ss_hall     Dungeon_obj_transp (firstgid=2720, name="hall")
  //   3196 – 4119  → ss_acc      BaseChip_pipo.png  (firstgid=3196, name="acessories")
  //   4120 – 4251  → ss_map      map.png            (firstgid=4120, name="map_c")
  //   4252+        → ss_acc      acessories.tsj     (firstgid=4252)
getTextureForGid(rawGid) {
    const FLIP_H   = 0x80000000;
    const FLIP_V   = 0x40000000;
    const GID_MASK = ~(FLIP_H | FLIP_V | 0x20000000) & 0xFFFFFFFF;
    const g      = (rawGid >>> 0) & GID_MASK;
    const flipX  = !!((rawGid >>> 0) & FLIP_H);
    const flipY  = !!((rawGid >>> 0) & FLIP_V);
    
    let key, frame;

    // Based on your provided map.json:
    if (g >= 5386)      { key = "ss_dungobj"; frame = g - 5386; } // Dungeon_object.tsj
    else if (g >= 4462) { key = "ss_acc";     frame = g - 4462; } // acessories.tsj
    else if (g >= 4330) { key = "ss_map";     frame = g - 4330; } // map.tsj
    else if (g >= 3854) { key = "ss_fff";     frame = g - 3854; } // fffffff.tsj
    else if (g >= 2930) { key = "ss_acc";     frame = g - 2930; } // acessories_b
    else if (g >= 2798) { key = "ss_map";     frame = g - 2798; } // map_c
    else if (g >= 1874) { key = "ss_acc";     frame = g - 1874; } // acessories (Main)
    else if (g >= 1398) { key = "ss_hall";    frame = g - 1398; } // hall
    else if (g >= 922)  { key = "ss_fff";     frame = g - 922;  } // fffffff
    else if (g >= 790)  { key = "ss_map";     frame = g - 790;  } // map_b
    else if (g >= 655)  { key = "ss_obj";     frame = g - 655;  } // OBJECT
    else if (g >= 133)  { key = "ss_dungobj"; frame = g - 133;  } // Dungeon_object
    else                { key = "ss_map";     frame = g - 1;    } // map

    return { key, frame, flipX, flipY };
}
  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    // ── RENDER TEST ───────────────────────────────────────────────
    // This bright rectangle proves Phaser is rendering.
    // If you see this but not the map → map.json or tileset issue.
    // If you see NOTHING → canvas/container mounting issue.
    // this.add.rectangle(W/2, H/2, 200, 80, 0xff00ff).setDepth(9999);
    // this.add.text(W/2, H/2, "PHASER OK\nLoading map...", {
    //   fontSize:"16px", color:"#ffffff", align:"center", stroke:"#000", strokeThickness:3
    // }).setOrigin(0.5).setDepth(10000);
    // ─────────────────────────────────────────────────────────────

    const map = this.make.tilemap({ key: "map" });
this.map = map;

    // addTilesetImage(nameInJSON, loadedImageKey)
    // Uses the FIXED map.json where duplicate "map" names → "map_b", "map_c"
    const ts_map     = map.addTilesetImage("map",           "img_map");     // 1
    const ts_dungobj = map.addTilesetImage("Dungeon_object","img_dungobj"); // 133
    const ts_obj     = map.addTilesetImage("OBJECT",        "img_obj");     // 655
    const ts_mapb    = map.addTilesetImage("map_b",         "img_map");     // 790
    const ts_fff     = map.addTilesetImage("fffffff",       "img_fff");     // 922 (from fffffff.tsj)
    const ts_hall    = map.addTilesetImage("hall",          "img_hall");    // 2720
    const ts_acc     = map.addTilesetImage("acessories",    "img_acc");     // 3196
    const ts_mapc    = map.addTilesetImage("map_c",         "img_map");     // 4120
    // acessories.tsj (firstgid=4252) — same image as acessories
    const ts_acc2    = map.addTilesetImage("acessories_b",  "img_acc");     // 4252

    const allTs = [ts_map, ts_dungobj, ts_obj, ts_mapb, ts_fff,
                   ts_hall, ts_acc, ts_mapc, ts_acc2].filter(Boolean);

    const loaded   = [ts_map&&"map", ts_dungobj&&"Dungeon_object", ts_obj&&"OBJECT",
                      ts_mapb&&"map_b", ts_fff&&"fffffff", ts_hall&&"hall",
                      ts_acc&&"acessories", ts_mapc&&"map_c", ts_acc2&&"acessories_b"];
    const missing  = loaded.filter(x => !x).length;
    console.log(`✅ Tilesets: ${allTs.length}/9 loaded${missing ? ` | ❌ missing: ${loaded.map((x,i)=>!x?["map","DO","OBJ","map_b","fff","hall","acc","map_c","acc_b"][i]:"").filter(Boolean).join(", ")}` : ""}`);

    if (!allTs.length) { this.showError("No tilesets loaded — check F12"); return; }

    // ── TILE LAYERS ───────────────────────────────────────────────
    const groundLayer = map.createLayer("Tile Layer 1", allTs);
    if (!groundLayer) { this.showError("'Tile Layer 1' not found"); return; }
    groundLayer.setCollisionByExclusion([0, 25]);
groundLayer.setDepth(0);

    const layer2 = map.createLayer("Tile Layer 2", allTs);
    if (layer2) layer2.setDepth(2);
    layer2.setCollisionByExclusion([-1]);
        

    // ── OBJECT LAYER ─────────────────────────────────────────────
    const objectLayer = map.getObjectLayer("Object Layer 1");
    if (!objectLayer) { this.showError("'Object Layer 1' not found"); return; }

    this.objectSprites = {};
    this.solidGroup    = this.physics.add.staticGroup();
    this.doorSprites   = [];
objectLayer.objects.forEach((obj) => {
  // --- 1. VISUALS (Only for objects with images/GIDs) ---
  if (obj.gid) {
    const { key, frame, flipX, flipY } = this.getTextureForGid(obj.gid);
    if (this.textures.exists(key)) {
      const sprite = this.add.image(obj.x, obj.y, key, frame);
      sprite.setOrigin(0, 1).setDepth(5);
      
      if (obj.width && obj.height) {
        sprite.setScale(obj.width / sprite.width, obj.height / sprite.height);
      }
      
      // Rotate the visual sprite
      if (obj.rotation) sprite.setAngle(obj.rotation);
      
      if (flipX) sprite.setFlipX(true);
      if (flipY) sprite.setFlipY(true);
      if (obj.name) this.objectSprites[obj.name] = sprite;
      if (obj.type === "door") this.doorSprites.push(sprite);
    }
  }

  // --- 2. PHYSICS & TRIGGERS (For both Tiles and Shapes) ---
  const isSolid = obj.properties?.find(p => p.name === "solid")?.value;
  const isTrigger = ["exit", "npc", "box1", "chest", "chest2", "stair"].includes(obj.name) || obj.type === "door";

  if (isSolid || isTrigger) {
    // Calculate rotated center for the physics body
    let cx = obj.x + (obj.width || 32) / 2;
    let cy = obj.y - (obj.height || 32) / 2;

    if (obj.rotation) {
      const angleRad = Phaser.Math.DegToRad(obj.rotation);
      const localCx = (obj.width / 2);
      const localCy = -(obj.height / 2);
      
      cx = obj.x + (localCx * Math.cos(angleRad) - localCy * Math.sin(angleRad));
      cy = obj.y + (localCx * Math.sin(angleRad) + localCy * Math.cos(angleRad));
    }

    const rect = this.add.rectangle(cx, cy, obj.width || 32, obj.height || 32);
    this.physics.add.existing(rect, true);
    rect.setVisible(false);
    
    // Rotate the trigger area to match Tiled
    if (obj.rotation) rect.setAngle(obj.rotation);

    if (isSolid) this.solidGroup.add(rect);
    if (obj.name) this[`${obj.name}Body`] = rect;
  }
});
    // ── DOOR BARRIER ─────────────────────────────────────────────
const doorObj = objectLayer.objects.find(o => o.name === "door");

if (doorObj) {
  const TILE_SIZE = this.map.tileWidth; // 32

  // Center the rectangle on the tile
  const cx = Math.floor(doorObj.x / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
  const cy = Math.floor(doorObj.y / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;

  this.doorBarrierRect = this.add.rectangle(
    cx,
    cy,
    TILE_SIZE,
    TILE_SIZE,
    0x000000,
    0 // debug
  );
  this.doorBarrierRect.setOrigin(0.5, 0.5);

  this.physics.add.existing(this.doorBarrierRect, true);
  this.doorBarrierRect.setDepth(6);
};
    // ── PLAYER ───────────────────────────────────────────────────
    const spawnPoint =
      objectLayer.objects.find((o) => o.name === "spawn" && o.point === true) ||
      objectLayer.objects.find((o) => o.name === "spawn");
    if (!spawnPoint) { this.showError("No spawn found"); return; }

    this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "player");
    this.player.setCollideWorldBounds(true).setDepth(10);
    this.player.body.setSize(14, 12).setOffset(11, 22);
    this.physics.add.collider(this.player, layer2);

    this.physics.add.collider(this.player, groundLayer);
    this.physics.add.collider(this.player, this.solidGroup);
    this.physics.add.collider(this.player, this.doorBarrierRect, () => {
      const now = this.time.now;
      if (!this._doorBump || now - this._doorBump > 2500) {
        this._doorBump = now; this.showLockedDoorMessage();
      }
    });

    this.mapObjects    = objectLayer.objects;
    this.fragments     = { box: false, barrel: false };
    this.doorOpen      = false;
    this.puzzlesSolved = { chest: false, chest2: false };
    this.hasKey        = false;

    // ── ANIMATIONS ───────────────────────────────────────────────
    if (!this.anims.exists("walk-down")) {
      this.anims.create({ key:"walk-left",  frames: this.anims.generateFrameNumbers("player",{start:14,end:19}), frameRate:7, repeat:-1 });
      this.anims.create({ key:"walk-down",  frames: this.anims.generateFrameNumbers("player",{start:27,end:32}), frameRate:7, repeat:-1 });
      this.anims.create({ key:"walk-right", frames: this.anims.generateFrameNumbers("player",{start:40,end:45}), frameRate:7, repeat:-1 });
      this.anims.create({ key:"walk-up",    frames: this.anims.generateFrameNumbers("player",{start:53,end:58}), frameRate:7, repeat:-1 });
      this.anims.create({ key:"idle",       frames: [{key:"player",frame:26}], frameRate:1, repeat:-1 });
    }
    this.player.anims.play("idle");

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
  W: Phaser.Input.Keyboard.KeyCodes.W,
  A: Phaser.Input.Keyboard.KeyCodes.A,
  S: Phaser.Input.Keyboard.KeyCodes.S,
  D: Phaser.Input.Keyboard.KeyCodes.D,
  E: Phaser.Input.Keyboard.KeyCodes.E
});

    // ── CAMERAS ──────────────────────────────────────────────────
 // MAIN CAMERA
 this.cameras.main.setZoom(2.2);
this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

// This line ensures that if the map is smaller than the screen, it stays centered
this.cameras.main.centerOn(map.widthInPixels / 2, map.heightInPixels / 2);
this.cameras.main.setBackgroundColor('#1a1a2e');
this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

// Force the camera to stay within the map 
this.cameras.main.setRoundPixels(true);

// UI CAMERA
this.uiCamera = this.cameras.add(0, 0, W, H);
this.uiCamera.setScroll(0, 0);
this.uiCamera.setZoom(1);

this.buildUI(W, H);

// UI camera should ONLY see UI
// UI camera ignores ONLY world objects
this.uiCamera.ignore([
  groundLayer,
  layer2,
  this.player,
  ...this.doorSprites,
  ...Object.values(this.objectSprites),
  this.doorBarrierRect
]);

// Main camera ignores UI
this.cameras.main.ignore(this.uiElements);

    this.scale.on("resize", (gameSize) => {
  const { width, height } = gameSize;

  this.cameras.main.setSize(width, height);
  this.uiCamera.setSize(width, height);

  // 🔥 Fix weird stretching / splitting
  this.cameras.main.centerOn(this.player.x, this.player.y);

  this.rebuildUI(width, height);
});

    this.time.delayedCall(1200, () => {
      this.showDialogue("Guide",
        "Welcome, adventurer!\n" +
        "The door ahead is sealed. Collect TWO fragments:\n" +
        "  • Push the BOX  (top-left room)\n" +
        "  • Search the BARREL  (near here)"
      );
    });
  }

  buildUI(W, H) {
    const PAD=14, BOX_H=140, PORT=52, BY=H-BOX_H-PAD, sepX=PAD+10+PORT+12, txtX=sepX+10;
    this.hudText=this.add.text(12,12,"Fragment 1 (Box): -   Fragment 2 (Barrel): -   Key: -",{fontSize:"11px",color:"#ffffff",stroke:"#000",strokeThickness:3}).setDepth(300);
    this.hintText=this.add.text(W/2,BY-28,"",{fontSize:"13px",color:"#ffdd57",stroke:"#000",strokeThickness:4,align:"center"}).setOrigin(0.5,0).setDepth(300).setVisible(false);
    this.dlgBorder    =this.add.rectangle(PAD,BY,W-PAD*2,BOX_H,0x555555).setOrigin(0,0).setDepth(298);
    this.dlgBg        =this.add.rectangle(PAD+2,BY+2,W-PAD*2-4,BOX_H-4,0x050508).setOrigin(0,0).setDepth(299);
    this.dlgPortBg = this.add.rectangle(PAD+10, BY+(BOX_H-PORT)/2, PORT, PORT, 0x000000, 0.5) // Lowered opacity
    .setOrigin(0,0)
    .setDepth(300);
    this.dlgPortBorder=this.add.rectangle(PAD+10,BY+(BOX_H-PORT)/2,PORT,PORT).setOrigin(0,0).setStrokeStyle(1,0x555555).setFillStyle().setDepth(300);
    this.dlgPortLetter=this.add.text(PAD+10+PORT/2,BY+BOX_H/2,"?",{fontSize:"24px",color:"#ffdd57",fontStyle:"bold",stroke:"#000",strokeThickness:3}).setOrigin(0.5).setDepth(301);
    this.dlgPortrait = this.add.image(PAD+10+PORT/2, BY+BOX_H/2, "ss_map", 1).setOrigin(0.5).setDepth(302).setDisplaySize(PORT - 4, PORT - 4);
    this.dlgSep       =this.add.rectangle(sepX,BY+8,1,BOX_H-16,0x333333).setOrigin(0,0).setDepth(300);
    this.dlgName      =this.add.text(txtX,BY+10,"",{fontSize:"13px",color:"#ffdd57",fontStyle:"bold"}).setDepth(301);
    this.dlgText      =this.add.text(txtX,BY+30,"",{fontSize:"13px",color:"#eeeeee",lineSpacing:5,wordWrap:{width:W-txtX-PAD-10}}).setDepth(301);
    this.dlgCursor    =this.add.text(W-PAD-10,H-PAD-10,"▼",{fontSize:"11px",color:"#888888"}).setOrigin(1,1).setDepth(301);
    this.tweens.add({targets:this.dlgCursor,alpha:0,duration:500,yoyo:true,repeat:-1});
    this.dlgHint      =this.add.text(W-PAD-10,H-PAD-22,"[ E ] Close",{fontSize:"10px",color:"#666666"}).setOrigin(1,1).setDepth(301);
   this.uiElements = [
    this.hudText, this.hintText, this.dlgBorder, this.dlgBg, 
    this.dlgPortBg, this.dlgPortBorder, this.dlgPortLetter, 
    this.dlgSep, this.dlgName, this.dlgText, this.dlgCursor, 
    this.dlgHint, this.dlgPortrait // <--- Ensure it is here
];

this.dlgElements = [
    this.dlgBorder, this.dlgBg, this.dlgPortBg, this.dlgPortBorder, 
    this.dlgPortLetter, this.dlgSep, this.dlgName, this.dlgText, 
    this.dlgCursor, this.dlgHint, this.dlgPortrait // <--- AND here
];
    this.dlgElements.forEach(el=>el.setVisible(false));
    // --- EXIT CONFIRMATION UI ---
this.confirmBox = this.add.container(W / 2, H / 2).setDepth(1000).setVisible(false);

const overlay = this.add.rectangle(0, 0, W * 2, H * 2, 0x000000, 0.7);
const bg = this.add.rectangle(0, 0, 300, 150, 0x1a1a1a).setStrokeStyle(2, 0xffdd57);
const title = this.add.text(0, -40, "EXIT GAME?", { fontSize: "20px", color: "#ffdd57", fontStyle: "bold" }).setOrigin(0.5);
const sub = this.add.text(0, -10, "Back to Portfolio?", { fontSize: "14px", color: "#ffffff" }).setOrigin(0.5);

// Buttons
const btnYes = this.add.text(-60, 40, "[ YES ]", { fontSize: "18px", color: "#88ff88" }).setOrigin(0.5).setInteractive({ useHandCursor: true });
const btnNo = this.add.text(60, 40, "[ NO ]", { fontSize: "18px", color: "#ff8888" }).setOrigin(0.5).setInteractive({ useHandCursor: true });

this.confirmBox.add([overlay, bg, title, sub, btnYes, btnNo]);
this.uiElements.push(this.confirmBox); // Add to UI list for camera management

// Button Events
btnYes.on('pointerdown', () => this._doExit());
btnNo.on('pointerdown', () => this._closeConfirm());

// Hover effects
[btnYes, btnNo].forEach(btn => {
    btn.on('pointerover', () => btn.setScale(1.1));
    btn.on('pointerout', () => btn.setScale(1));
});
  }

  rebuildUI(W,H){
    const PAD=14,BOX_H=140,PORT=52,BY=H-BOX_H-PAD,sepX=PAD+10+PORT+12,txtX=sepX+10;
    const v=this.dlgBg.visible;
    this.hintText.setPosition(W/2,BY-28);
    this.dlgBorder.setPosition(PAD,BY).setSize(W-PAD*2,BOX_H);
    this.dlgBg.setPosition(PAD+2,BY+2).setSize(W-PAD*2-4,BOX_H-4);
    this.dlgPortBg.setPosition(PAD+10,BY+(BOX_H-PORT)/2);
    this.dlgPortBorder.setPosition(PAD+10,BY+(BOX_H-PORT)/2);
    this.dlgPortLetter.setPosition(PAD+10+PORT/2,BY+BOX_H/2);
    this.dlgSep.setPosition(sepX,BY+8).setSize(1,BOX_H-16);
    this.dlgName.setPosition(txtX,BY+10);
    this.dlgText.setPosition(txtX,BY+30).setWordWrapWidth(W-txtX-PAD-10);
    this.dlgCursor.setPosition(W-PAD-10,H-PAD-10);
    this.dlgHint.setPosition(W-PAD-10,H-PAD-22);
    if(!v)this.dlgElements.forEach(el=>el.setVisible(false));
    this.cameras.main.ignore(this.uiElements);
    this.uiCamera.setScroll(0, 0);
    this.dlgPortLetter.setPosition(PAD+10+PORT/2, BY+BOX_H/2);
this.dlgPortrait.setPosition(PAD+10+PORT/2, BY+BOX_H/2); // <--- Add this
  }


   update() {
    if (!this.player) return;

    const mob = window.__mobileInput || {};
    const ePressed = Phaser.Input.Keyboard.JustDown(this.keys.E) || mob.e;

    // 1. Handle Input if the Confirm Box is open
    if (this._confirmOpen) {
        this.player.setVelocity(0, 0);
        this.player.anims.play("idle", true);
        
        // Optional: Make 'E' close the menu if they don't click Yes/No
        if (ePressed) {
            // this._closeConfirm(); // Uncomment if you want 'E' to cancel
        }
        return; // Stop here so player doesn't move while menu is open
    }

    // 2. Handle Movement
    const speed = 160;
    let vx = 0, vy = 0;

    if (this.cursors.left.isDown || mob.left || this.keys.A.isDown) vx = -speed;
else if (this.cursors.right.isDown || mob.right || this.keys.D.isDown) vx = speed;

if (this.cursors.up.isDown || mob.up || this.keys.W.isDown) vy = -speed;
else if (this.cursors.down.isDown || mob.down || this.keys.S.isDown) vy = speed;

    this.player.setVelocity(vx, vy);

    // 3. Handle Animations
    if (vx < 0) this.player.anims.play("walk-left", true);
    else if (vx > 0) this.player.anims.play("walk-right", true);
    else if (vy < 0) this.player.anims.play("walk-up", true);
    else if (vy > 0) this.player.anims.play("walk-down", true);
    else this.player.anims.play("idle", true);

    // 4. Update Hints & Interactions
    this.updateHint();

    if (ePressed) {
        if (this.dlgBg.visible) {
            this.closeDialogue();
        } else {
            this.handleInteract();
        }
    }
};
  updateHint(){
    const near=this.getNearby();
    if(!near){this.hintText.setVisible(false);return;}
    const hints={
      npc:"[E] Talk to Guide",
      box1:this.fragments.box?"[E] Already pushed":"[E] Push box  ← Fragment 1",
      barrel1:this.fragments.barrel?"[E] Already searched":"[E] Search barrel  ← Fragment 2",
      door:this.doorOpen?"[E] Door is open →":"[E] Sealed — need both fragments",
      chest:this.puzzlesSolved.chest?"[E] Already opened":"[E] Open chest",
      chest2:this.puzzlesSolved.chest2?"[E] Already opened":"[E] Open chest",
      stair:this.hasKey?"[E] Enter Hall of Achievement!":"[E] Need Archive Key",
      exit: "[E] Leave Game"
    };
    const hint=hints[near.name]||hints[near.type];
    if(hint)this.hintText.setText(hint).setVisible(true);
    else this.hintText.setVisible(false);
  }

  getNearby(range=60){
    const px=this.player.x,py=this.player.y;
    let closest=null,minDist=range;
    for(const obj of this.mapObjects){
      if(obj.text)continue;
      const cx=obj.gid?obj.x+(obj.width||32)/2:obj.x;
      const cy=obj.gid?obj.y-(obj.height||32)/2:obj.y;
      const d=Phaser.Math.Distance.Between(px,py,cx,cy);
      if(d<minDist){minDist=d;closest=obj;}
    }
    return closest;
  }

  handleInteract(){
    const near=this.getNearby();
    if(!near)return;
    if (near.name === "exit") {
        this._openConfirm();
        return;
    }
    if(near.name==="npc"){
      if(!this.fragments.box&&!this.fragments.barrel)this.showDialogue("Guide","The door is sealed — need TWO fragments.\nPush the BOX (top-left), then search the BARREL.");
      else if(this.fragments.box&&!this.fragments.barrel)this.showDialogue("Guide","Fragment 1 collected! Now search the BARREL.");
      else if(!this.fragments.box&&this.fragments.barrel)this.showDialogue("Guide","Fragment 2 collected! Go push the BOX.");
      else if(!this.doorOpen)this.showDialogue("Guide","Both fragments — the door should be open!");
      else if(!this.hasKey)this.showDialogue("Guide","Open BOTH chests to get the Archive Key!");
      else this.showDialogue("Guide","You have the Archive Key! Find the STAIRCASE!");
      return;
    }
    if(near.name==="box1"){
      if(!this.fragments.box){
        this.fragments.box=true;this.updateHUD();
        const s=this.objectSprites["box1"];
        if(s)this.tweens.add({targets:s,x:s.x+32,duration:300,ease:"Power2"});
        if(this.box1Body){this.box1Body.destroy();this.box1Body=null;}
        this.showDialogue("","Box pushed!\nFragment 1 collected. Now find the BARREL.");
        this.checkDoorUnlock();
      }else this.showDialogue("","Already in place.");
      return;
    }
    if(near.name==="barrel1"){
      if(!this.fragments.barrel){
        this.fragments.barrel=true;this.updateHUD();
        const s=this.objectSprites["barrel1"];
        if(s)this.tweens.add({targets:s,x:s.x+4,duration:60,yoyo:true,repeat:3});
        this.showDialogue("","Barrel searched!\nFragment 2 collected.");
        this.checkDoorUnlock();
      }else this.showDialogue("","Already searched.");
      return;
    }
    if(near.name==="door"){this.doorOpen?this.showDialogue("","Door is open!"):this.showLockedDoorMessage();return;}
    if(near.name==="chest"){
      if(!this.doorOpen){this.showDialogue("","Door still sealed!");return;}
      if(!this.puzzlesSolved.chest){this.puzzlesSolved.chest=true;const s=this.objectSprites["chest"];if(s)s.setFrame(37);this.updateHUD();this.checkKeyStatus();this.showDialogue("","Chest 1 opened!\nFirst half of the Archive Key...");}
      else this.showDialogue("","Already open.");return;
    }
    if(near.name==="chest2"){
      if(!this.doorOpen){this.showDialogue("","Door still sealed!");return;}
      if(!this.puzzlesSolved.chest2){this.puzzlesSolved.chest2=true;const s=this.objectSprites["chest2"];if(s)s.setFrame(37);this.updateHUD();this.checkKeyStatus();this.showDialogue("","Chest 2 opened!\nSecond half of the Archive Key!");}
      else this.showDialogue("","Already open.");return;
    }
    if(near.name==="stair"){
      if(this.hasKey){
        this.showDialogue("","The Archive Key pulses...\nEntering the Hall of Achievement!");
        this.cameras.main.fadeOut(1200,0,0,0);
        this.cameras.main.once("camerafadeoutcomplete",()=>this.scene.start("HallScene"));
      }else{
        const m=[];
        if(!this.fragments.box)m.push("Push Box");
        if(!this.fragments.barrel)m.push("Search Barrel");
        if(!this.puzzlesSolved.chest)m.push("Chest 1");
        if(!this.puzzlesSolved.chest2)m.push("Chest 2");
        this.showDialogue("","Staircase sealed!\nStill need: "+m.join(" / "));
      }
    }
  }

  checkDoorUnlock(){
    if(this.fragments.box&&this.fragments.barrel&&!this.doorOpen){
      this.doorOpen=true;
      if(this.doorBarrierRect){this.doorBarrierRect.destroy();this.doorBarrierRect=null;}
      this.doorSprites.forEach(s=>this.tweens.add({targets:s,alpha:0,duration:500}));
      this.updateHUD();
      this.showDialogue("","The door rumbles open!\nThe chest room is now accessible.");
    }
  }

  showLockedDoorMessage(){
    const m=[];
    if(!this.fragments.box)m.push("push the BOX");
    if(!this.fragments.barrel)m.push("search the BARREL");
    if(m.length)this.showDialogue("","Door sealed!\nYou need to: "+m.join(" and "));
  }

  checkKeyStatus(){
    if(this.puzzlesSolved.chest&&this.puzzlesSolved.chest2){
      this.hasKey=true;this.updateHUD();
      this.time.delayedCall(400,()=>this.showDialogue("","ARCHIVE KEY ASSEMBLED!\nFind the STAIRCASE at the top!"));
    }
  }

  updateHUD(){
    this.hudText.setText(`Fragment 1 (Box): ${this.fragments.box?"✓":"-"}   Fragment 2 (Barrel): ${this.fragments.barrel?"✓":"-"}   Key: ${this.hasKey?"✓":"-"}`);
    if(this.hasKey)this.hudText.setColor("#ffdd57");
  }

showDialogue(speaker, msg) {
    if (this.dlgTimer) this.dlgTimer.remove();
    
    const isNPC = (speaker === "Guide");

    this.dlgName.setText(speaker || "");
    this.dlgText.setText(msg);

    // ── STEP 1: Show the basic box elements ──
    this.dlgElements.forEach(el => el.setVisible(true));

    // ── STEP 2: Handle the Portrait vs Letter specifically ──
    if (isNPC) {
       this.dlgPortrait.setTexture("ss_map", 60);
    this.dlgPortLetter.setVisible(false);
    } else {
        this.dlgPortrait.setVisible(false);   // Hide the face
        this.dlgPortLetter.setText(speaker ? speaker[0].toUpperCase() : "!")
                          .setVisible(true);
    }

    // ── STEP 3: Cleanup name plate ──
    const hasSpeaker = !!(speaker?.length);
    this.dlgSep.setVisible(hasSpeaker);
    this.dlgName.setVisible(hasSpeaker);

    this.dlgTimer = this.time.delayedCall(Math.max(5000, msg.length * 65), () => this.closeDialogue());
}
  closeDialogue(){
    if(this.dlgTimer)this.dlgTimer.remove();
    this.dlgElements.forEach(el=>el.setVisible(false));
  }

  showError(msg){
    console.error("❌",msg);
    const W = this.scale.width, H = this.scale.height;
    this.add.rectangle(0,0,W,H,0x0a0a12).setOrigin(0,0).setDepth(998);
    this.add.text(W/2, H/2,
      "❌  "+msg+"\n\n" +
      "Open F12 → Console for details.\n\n" +
      "Required in /public/assets/tiles/:\n" +
      "  map.png\n" +
      "  Dungeon_object.png\n" +
      "  OBJECT.png\n" +
      "  roguelikeDungeon_32x32.png\n" +
      "  Dungeon_object_transparent.png\n" +
      "  [Base]BaseChip_pipo.png\n" +
      "  map.json  (the FIXED version without C:\\Users paths)",
      {fontSize:"13px", color:"#ff8888", align:"center",
       wordWrap:{width:W-80}, lineSpacing:6, stroke:"#000", strokeThickness:2}
    ).setOrigin(0.5).setDepth(999);
  }
  _openConfirm() {
    this._confirmOpen = true;
    this.confirmBox.setVisible(true);
    this.confirmBox.setAlpha(0);
    this.tweens.add({ targets: this.confirmBox, alpha: 1, duration: 200 });
}

_closeConfirm() {
    this.tweens.add({
        targets: this.confirmBox,
        alpha: 0,
        duration: 150,
        onComplete: () => {
            this.confirmBox.setVisible(false);
            this._confirmOpen = false;
        }
    });
}

_doExit() {
    this.cameras.main.fadeOut(800, 0, 0, 0);
    this.cameras.main.once("camerafadeoutcomplete", () => {
        // This pulls the function you passed into GameCanvas from React
        const onExitGame = this.game.registry.get("onExitGame");
        if (onExitGame) {
            onExitGame(); 
        } else {
            // Fallback if the registry is empty
            window.location.reload(); 
        }
    });
}
}
