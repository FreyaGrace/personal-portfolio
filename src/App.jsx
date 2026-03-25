import { useState, useEffect } from "react";
import Hero               from "./portfolio/Hero";
import Projects           from "./portfolio/Projects";
import Contact            from "./portfolio/Contact";
import GameCanvas         from "./game/GameCanvas";
import CrackedTransition  from "./portfolio/Crackedtransition";

// mode: "portfolio" → "crack" → "game" → back to "portfolio"
export default function App() {
  const [mode, setMode] = useState("portfolio"); // ✅ portfolio loads FIRST

  // ── Toggle body class so CSS knows which mode we're in ─────────
  // "game-mode" class enables fullscreen canvas, disables scroll
  useEffect(() => {
    if (mode === "game" || mode === "crack") {
      document.body.classList.add("game-mode");
    } else {
      document.body.classList.remove("game-mode");
      // Restore scroll position to top when returning from game
      window.scrollTo(0, 0);
    }

    return () => {
      document.body.classList.remove("game-mode");
    };
  }, [mode]);

  // Called from Hero when player double-clicks the profile image
  const startGame = () => {
    setMode("crack");
    setTimeout(() => setMode("game"), 2000);
  };

  // Called from HallScene when player presses ESC
  const exitGame = () => {
    setMode("portfolio");
  };

  return (
    <>
      {/* ── PORTFOLIO (shown first, scrollable) ─────────────────── */}
      {mode === "portfolio" && (
        <>
          <Hero onProfileDoubleClick={startGame} />
          <Projects />
          <Contact />
        </>
      )}

      {/* ── CRACK TRANSITION ────────────────────────────────────── */}
      {mode === "crack" && (
        <CrackedTransition onDone={() => setMode("game")} />
      )}

      {/* ── GAME ────────────────────────────────────────────────── */}
      {mode === "game" && (
        <GameCanvas onExitGame={exitGame} />
      )}
    </>
  );
}