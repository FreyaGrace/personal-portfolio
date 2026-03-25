import Phaser from "phaser";
import { useEffect, useRef, useState } from "react";
import IntroScene   from "./scenes/IntroScene";
import DungeonScene from "./scenes/Dungeon";
import HallScene    from "./scenes/HallScene";

const isTouchDevice = () =>
  "ontouchstart" in window || navigator.maxTouchPoints > 0;

export default function GameCanvas({ onExitGame }) {
  const containerRef = useRef(null);
  const gameRef      = useRef(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(isTouchDevice());

    // ✅ Mount Phaser INTO the container div — not onto document.body
    // This avoids the "returns null → unmounts → destroy()" bug
    const container = containerRef.current;
    if (!container) return;

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: container, 
  backgroundColor: "#0a0a12",
  pixelArt: true,
  render: {
    antialias: false,
    roundPixels: true
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    // Try a widescreen base to match modern monitors/phones
    width: 1280, 
    height: 720, 
  },
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
  scene: [IntroScene, DungeonScene, HallScene],
});
    if (onExitGame) {
      game.registry.set("onExitGame", onExitGame);
    }

    gameRef.current = game;

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [onExitGame]);

  // ✅ ALWAYS return the container div — never return null
  // Mobile controls are rendered on top as a separate overlay
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#0a0a12" }}>

      {/* Phaser mounts its canvas inside this div */}
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%" }}
      />

      {/* Mobile D-pad — only visible on touch devices */}
      {isTouch && <MobileControls />}

    </div>
  );
}

// ── MOBILE CONTROLS ───────────────────────────────────────────────
function MobileControls() {
  if (!window.__mobileInput) {
    window.__mobileInput = { left: false, right: false, up: false, down: false, e: false };
  }

  const hold    = (key) => () => { window.__mobileInput[key] = true;  };
  const release = (key) => () => { window.__mobileInput[key] = false; };
  const tap     = ()    => {
    window.__mobileInput.e = true;
    setTimeout(() => { window.__mobileInput.e = false; }, 150);
  };

  return (
    <div style={{
      position: "absolute",
      bottom: 0, left: 0, right: 0,
      height: 200,
      zIndex: 10000,
      pointerEvents: "none",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      padding: "0 24px 24px",
    }}>
      {/* D-PAD */}
      <div style={{ pointerEvents: "auto", position: "relative", width: 140, height: 140 }}>
        <DpadBtn label="▲"
          style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)" }}
          onTouchStart={(e) => { e.preventDefault(); hold("up")();    }}
          onTouchEnd={(e)   => { e.preventDefault(); release("up")(); }}
          onTouchCancel={(e)=> { e.preventDefault(); release("up")(); }}
        />
        <DpadBtn label="◀"
          style={{ position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)" }}
          onTouchStart={(e) => { e.preventDefault(); hold("left")();    }}
          onTouchEnd={(e)   => { e.preventDefault(); release("left")(); }}
          onTouchCancel={(e)=> { e.preventDefault(); release("left")(); }}
        />
        <DpadBtn label="▶"
          style={{ position: "absolute", top: "50%", right: 0, transform: "translateY(-50%)" }}
          onTouchStart={(e) => { e.preventDefault(); hold("right")();    }}
          onTouchEnd={(e)   => { e.preventDefault(); release("right")(); }}
          onTouchCancel={(e)=> { e.preventDefault(); release("right")(); }}
        />
        <DpadBtn label="▼"
          style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)" }}
          onTouchStart={(e) => { e.preventDefault(); hold("down")();    }}
          onTouchEnd={(e)   => { e.preventDefault(); release("down")(); }}
          onTouchCancel={(e)=> { e.preventDefault(); release("down")(); }}
        />
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 20, height: 20, borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
        }} />
      </div>

      {/* ACTION BUTTON */}
      <div style={{ pointerEvents: "auto", paddingBottom: 8 }}>
        <button
          onTouchStart={(e) => { e.preventDefault(); tap(); }}
          style={{
            width: 64, height: 64,
            borderRadius: "50%",
            background: "rgba(167,139,250,0.25)",
            border: "2px solid rgba(167,139,250,0.5)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 10, fontWeight: 700,
            gap: 2,
            backdropFilter: "blur(8px)",
            WebkitTapHighlightColor: "transparent",
            touchAction: "none",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 20 }}>⚡</span>
          <span>TALK</span>
        </button>
      </div>
    </div>
  );
}

function DpadBtn({ label, style, ...handlers }) {
  return (
    <button
      {...handlers}
      style={{
        width: 48, height: 48,
        borderRadius: 12,
        background: "rgba(255,255,255,0.1)",
        border: "1.5px solid rgba(255,255,255,0.2)",
        color: "rgba(255,255,255,0.8)",
        fontSize: 16,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
        backdropFilter: "blur(8px)",
        WebkitTapHighlightColor: "transparent",
        touchAction: "none",
        userSelect: "none",
        ...style,
      }}
    >
      {label}
    </button>
  );
}