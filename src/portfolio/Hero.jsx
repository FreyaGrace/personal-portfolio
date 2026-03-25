import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Hero({ onProfileDoubleClick }) {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      const { width, height } = hero.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const move = (e) => {
      if (e.touches) {
        mouse.current.x = e.touches[0].clientX - hero.offsetLeft;
        mouse.current.y = e.touches[0].clientY - hero.offsetTop;
      } else {
        mouse.current.x = e.clientX - hero.offsetLeft;
        mouse.current.y = e.clientY - hero.offsetTop;
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move);

    const animate = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Draw smooth glow centered on mouse
      const gradient = ctx.createRadialGradient(
        mouse.current.x,
        mouse.current.y,
        0,
        mouse.current.x,
        mouse.current.y,
        Math.max(width, height) / 2
      );
      gradient.addColorStop(0, "rgba(11, 127, 194, 0.25)"); // soft gold
      gradient.addColorStop(0.5, "rgba(124, 58, 237, 0.15)"); // purple
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)"); // fade out

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);
  return (
    <section
      ref={heroRef}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "80px 24px",
        background: "linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Canvas only inside Hero */}
     <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      {/* Background orbs — purely decorative, pointer-events none */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute", width: 600, height: 600, borderRadius: "50%",
          top: "-15%", right: "-10%",
          background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
        }}/>
        <div style={{
          position: "absolute", width: 500, height: 500, borderRadius: "50%",
          bottom: "-10%", left: "-8%",
          background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)",
        }}/>
      </div>

      {/* Game hint badge — top right, desktop only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        style={{
          position: "absolute", top: 24, right: 24,
          background: "rgba(124,58,237,0.15)",
          border: "1px solid rgba(124,58,237,0.3)",
          borderRadius: 999,
          padding: "6px 14px",
          fontSize: 12,
          color: "#c4b5fd",
          fontWeight: 500,
          display: "none", // hidden on mobile — shown via media doesn't work inline
        }}
        className="hidden md:block"
      >
        🎮 Double-click photo to enter the hidden world
      </motion.div>

      {/* ── PROFILE IMAGE ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
        style={{ position: "relative", marginBottom: 32 }}
      >
        {/* Rotating gradient ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute", inset: -4, borderRadius: "50%",
            background: "conic-gradient(from 0deg, #7c3aed, #2563eb, #06b6d4, #ec4899, #7c3aed)",
            zIndex: 0,
          }}
        />
        {/* White ring gap */}
        <div style={{
          position: "absolute", inset: -2, borderRadius: "50%",
          background: "#0f0c29", zIndex: 1,
        }}/>
        {/* Photo */}
        <motion.img
          src="/Profile2.jpg"
          alt="Fatima Grace Apinan"
          onDoubleClick={onProfileDoubleClick}
          title="Double-click to enter the RPG world!"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: 160, height: 160,
            borderRadius: "50%",
            objectFit: "cover",
            cursor: "pointer",
            position: "relative",
            zIndex: 2,
            display: "block",
            boxShadow: "0 0 40px rgba(124,58,237,0.3), 0 0 80px rgba(14,165,233,0.1)",
          }}
        />
        {/* Online dot */}
        <div style={{
          position: "absolute", bottom: 8, right: 8,
          width: 18, height: 18, borderRadius: "50%",
          background: "#22c55e",
          border: "3px solid #0f0c29",
          zIndex: 3,
          boxShadow: "0 0 8px rgba(34,197,94,0.6)",
        }}/>
      </motion.div>

      {/* ── NAME ── */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        style={{
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          fontWeight: 900,
          fontFamily: "Georgia, serif",
          lineHeight: 1.1,
          marginBottom: 16,
          background: "linear-gradient(135deg, #ffffff 0%, #c4b5fd 50%, #7dd3fc 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Fatima Grace Apinan
      </motion.h1>

      {/* ── ROLE ── */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          fontSize: 14,
          color: "#a78bfa",
          fontWeight: 600,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: 16,
        }}
      >
        Full Stack Developer
      </motion.p>

      {/* ── TECH BADGES ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 8,
          marginBottom: 20,
        }}
      >
        {["React", "Flask", "Python", "AI Systems", "GHL", "GIT"].map((tag) => (
          <span key={tag} style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 999,
            padding: "4px 12px",
            fontSize: 12,
            color: "#94a3b8",
          }}>
            {tag}
          </span>
        ))}
      </motion.div>

      {/* ── TAGLINE ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          maxWidth: 440,
          lineHeight: 1.75,
          color: "#94a3b8",
          fontSize: 15,
          marginBottom: 36,
        }}
      >
        Building modern, interactive experiences where code meets creativity.
        Computer Science student passionate about AI and immersive design.
      </motion.p>

      {/* ── CTA BUTTONS ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}
      >
        <a
  href="/resume.pdf"
  download
  style={{
    padding: "12px 28px",
    borderRadius: 14,
    background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    color: "white",
    fontWeight: 600,
    fontSize: 14,
    textDecoration: "none",
    boxShadow: "0 4px 20px rgba(6,182,212,0.35)",
    transition: "transform 0.2s, box-shadow 0.2s",
  }}
  onMouseEnter={e => {
    e.target.style.transform = "translateY(-2px)";
    e.target.style.boxShadow = "0 8px 30px rgba(6,182,212,0.5)";
  }}
  onMouseLeave={e => {
    e.target.style.transform = "translateY(0)";
    e.target.style.boxShadow = "0 4px 20px rgba(6,182,212,0.35)";
  }}
>
  Download Resume 
</a>
        <a href="#projects" style={{
          padding: "12px 28px",
          borderRadius: 14,
          background: "linear-gradient(135deg, #7c3aed, #2563eb)",
          color: "white",
          fontWeight: 600,
          fontSize: 14,
          textDecoration: "none",
          boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
          onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 30px rgba(124,58,237,0.5)"; }}
          onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 20px rgba(124,58,237,0.35)"; }}
        >
          View Projects ↓
        </a>
        <a href="#contact" style={{
          padding: "12px 28px",
          borderRadius: 14,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "white",
          fontWeight: 600,
          fontSize: 14,
          textDecoration: "none",
          transition: "background 0.2s, border-color 0.2s, transform 0.2s",
        }}
          onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.05)"; e.target.style.transform = "translateY(0)"; }}
        >
          Contact Me
        </a>

      </motion.div>

      {/* ── MOBILE HINT ──
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="md:hidden"
        style={{ marginTop: 32, fontSize: 12, color: "#7c3aed", opacity: 0.7 }}
      >
        🎮 Double-tap photo for secret game mode
      </motion.p> */}

      {/* ── SCROLL INDICATOR ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{
          position: "absolute", bottom: 32, left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        }}
        className="hidden md:flex"
      >
        <span style={{ color: "#475569", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ width: 1, height: 36, background: "linear-gradient(to bottom, #7c3aed, transparent)" }}
        />
      </motion.div>

    </section>
  );
}