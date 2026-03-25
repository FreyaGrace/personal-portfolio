import Phaser from "phaser";

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super("IntroScene");
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    // Dark background
    this.add.rectangle(0, 0, W, H, 0x000000).setOrigin(0, 0);

    // Title
    this.add
      .text(W / 2, H / 2 - 80, "Welcome, Adventurer!", {
        fontSize: "32px",
        color: "#ffdd57",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Body text
    this.add
      .text(
        W / 2,
        H / 2 - 20,
        "You have found the hidden world.\nExplore and solve puzzles to return home.",
        {
          fontSize: "18px",
          color: "#ffffff",
          align: "center",
          wordWrap: { width: W * 0.7 },
        }
      )
      .setOrigin(0.5);

    // Blinking "Press ENTER" prompt
    const prompt = this.add
      .text(W / 2, H / 2 + 80, "Press ENTER or SPACE or Click to start", {
        fontSize: "16px",
        color: "#aaaaaa",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: prompt,
      alpha: 0,
      duration: 600,
      yoyo: true,
      repeat: -1,
    });

    const goToDungeon = () => {
      console.log("Transitioning to DungeonScene..."); // ← confirm this fires
      this.scene.start("DungeonScene");
    };

    this.input.keyboard.once("keydown-ENTER", goToDungeon);
    this.input.keyboard.once("keydown-SPACE", goToDungeon);
    this.input.once("pointerdown", goToDungeon);

    this.scale.on("resize", () => {
      this.scene.restart();
    });
  }
}