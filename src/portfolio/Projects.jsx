import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  {
    id: "university",
    label: "University",
    icon: "🎓",
    color: "#a78bfa", // Purple
    projects: [
      {
        title: "Infant Cry Recognition System",
        description: "AI-based system using a trained ML model to classify infant cries in real-time — helping parents identify hunger, pain, or discomfort.",
        tech: ["Python", "Flask", "Machine Learning", "Audio Processing"],
        icon: "🤖",
        github: "https://github.com/FreyaGrace/Wawa-Baby-Cry-Analysis",
        images: ["https://drive.google.com/file/d/1n4O6gWfy7gVNFn-nuAXawIPZ4lVH20iG/view?usp=sharing",
          "https://drive.google.com/file/d/1lRoUcWBtK-faYBsVylWzU38TncUvgOVZ/view?usp=sharing",
          "https://drive.google.com/file/d/1E0go1Pwlq5X57JJzhpjjBB1CF4eFmxDY/view?usp=sharing",
          "https://drive.google.com/file/d/1cmmaZwExM6Jf_6_DBmVva80ja-TrFU3N/view?usp=sharing",
          "https://drive.google.com/file/d/1_NFsX4WqLmk-4hn02T7jVeGJsC9CQ_Cx/view?usp=sharing"
        ],
        status: "Completed",
      },
      {
        title: "Quote Puzzle: Flutter Web App",
        description: "A Flutter Web project built as part of academic coursework, featuring a simple puzzle game that reveals Bible quotes fetched from an API. This project demonstrates foundational skills in Flutter development, UI design, and basic REST API integration.",
        tech: ["Flutter", "Dart", "REST API", "Web Development"],
        icon: "🧩",
        github: "https://github.com/FreyaGrace/FreyaGrace.github.io.git",
        demo: "https://freyagrace.github.io",
        status: "Completed",
      },
      // {
      //   title: "Library Management System",
      //   description: "Full-featured library system with book cataloging, borrower tracking, fine calculation, and search functionality.",
      //   tech: ["Java", "MySQL", "JavaFX"],
      //   icon: "📚",
      //   github: "https://github.com/yourrepo",
      //   demoImage: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1000",
      //   status: "Completed",
      // },
    ],
  },
 {
  id: "internship",
  label: "Internship",
  icon: "💼",
  color: "#38bdf8", 
  projects: [
    {
      title: "Funnel Developer Intern",
      description: "Architected high-conversion landing pages and automated lead-capture workflows. Focused on optimizing user journeys through custom Javascript integrations and GHL automation sequences to streamline engineering team operations.",
      tech: ["Javascript", "GHL", "HTML5", "CSS3"],
      icon: "🚀",
      github: "#",
      status: "Coming Soon", // Changed from Coming Soon to show you are active
      featured: true,// Changed to false so the card actually shows up!
    },
  ],
},
  {
    id: "personal",
    label: "Personal",
    icon: "✨",
    color: "#f472b6", // Pink
    projects: [
      {
        title: "Hidden RPG Portfolio",
        description: "This very portfolio — with a secret dungeon RPG game hidden inside. Double-click the profile photo to discover it.",
        tech: ["React", "Phaser 3", "Tiled", "Vite", "Framer Motion"],
        icon: "🎮",
        github: "https://github.com/yourrepo",
        demo: "https://your-live-demo.com", // Example link
        status: "Live",
        featured: true,
      },
       {
        title: "Real Estate Website Revamp",
        description: "A responsive real estate website redesign built as a technical assessment project. Features a modern UI with interactive components such as property sliders, dynamic image galleries, filtering UI, and a contact system. Focused on clean layout structure, user experience, and real-world business presentation.",
        tech: ["HTML", "CSS", "JavaScript", "Responsive Design"],
        icon: "🏡",
        github: "https://github.com/FreyaGrace/Marci_revamp.git",
        demo: "https://marci-revamp-gfu4.vercel.app/", // Example link
        status: "Live",
        featured: true,
      },
    ],
  },
];

const statusStyle = {
  "Completed":   { bg: "rgba(34, 197, 94, 0.15)",  color: "#4ade80", border: "#4ade80" },
  "Live":        { bg: "rgba(56, 189, 248, 0.15)",  color: "#38bdf8", border: "#38bdf8" },
  "Coming Soon": { bg: "rgba(148, 163, 184, 0.1)",   color: "#94a3b8", border: "#94a3b8" },
  "Live Demo":   { bg: "rgba(167, 139, 250, 0.15)", color: "#a78bfa", border: "#a78bfa" },
};
function Card({ project, color }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [loading, setLoading] = useState(true); // Spinner state

  // ── HELPER: Converts Drive "View" links to Direct Image links ──
const getDirectLink = (url) => {
  if (!url || !url.includes("drive.google.com")) return url;
  const fileId = url.split("/d/")[1]?.split("/")[0] || url.split("id=")[1]?.split("&")[0];
  
  // This specific 'render' link bypasses the standard view restrictions
  return `https://lh3.googleusercontent.com/d/${fileId}`; 
};
  // Prepare the gallery array
  const gallery = (project.images || (project.demoImage ? [project.demoImage] : []))
                  .map(link => getDirectLink(link));

  const s = statusStyle[project.status] || statusStyle["Coming Soon"];

  const handleDemoClick = (e) => {
   e.stopPropagation();
    // If there is a live demo link, open it. 
    // If not, and we have images, show the gallery.
    if (project.demo) {
      window.open(project.demo, "_blank");
    } else if (gallery.length > 0) {
      setImgIndex(0);
      setShowGallery(true);
    }
  };

  return (
    <motion.div
      layout
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 24,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative"
      }}
    >
      {/* Status & Icon Row */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontSize: 24 }}>{project.icon}</div>
     <span style={{ 
  fontSize: 10, 
  padding: "5px 12px", 
  borderRadius: "20px", 
  background: s.bg, 
  color: s.color, 
  fontWeight: 800, 
  border: `1px solid ${s.border}40`, // 40 is transparency for the border
  textTransform: "uppercase",
  letterSpacing: "0.05em"
}}>
  {project.status}
</span>
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 8 }}>{project.title}</h3>
      <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, flex: 1, marginBottom: 20 }}>{project.description}</p>

      {/* Action Buttons */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
        {!project.placeholder && (
          <motion.button 
            onClick={handleDemoClick}
            whileHover={{ scale: 1.05, boxShadow: `0 0 15px ${color}` }}
            style={{ 
              background: color, color: "white", border: "none", 
              padding: "10px 18px", borderRadius: 12, fontWeight: 700, 
              fontSize: 12, cursor: "pointer"
            }}
          >
            {project.demo ? "Launch Live Site" : "View Screenshots"}
          </motion.button>
        )}
        
        {!project.placeholder && (
          <a href={project.github} target="_blank" rel="noreferrer" 
             style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b", textDecoration: "none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Source
          </a>
        )}
      </div>

      {/* ── GALLERY MODAL WITH SPINNER ── */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, background: "rgba(5, 5, 15, 0.95)",
              zIndex: 999999, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", padding: "20px"
            }}
            onClick={() => setShowGallery(false)}
          >
            <button style={{ position: 'absolute', top: 30, right: 30, color: 'white', background: 'none', border: 'none', fontSize: 32, cursor: 'pointer' }}>✕</button>

            <div style={{ display: "flex", alignItems: "center", width: "100%", maxWidth: "1100px", position: 'relative' }}>
              
              {/* Spinner */}
              {loading && (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  style={{
                    position: 'absolute', left: '50%', top: '50%',
                    width: 40, height: 40, border: '4px solid rgba(255,255,255,0.1)',
                    borderTopColor: color, borderRadius: '50%', marginLeft: -20, marginTop: -20
                  }}
                />
              )}

              {gallery.length > 1 && (
                <button onClick={(e) => { e.stopPropagation(); setImgIndex((imgIndex - 1 + gallery.length) % gallery.length); setLoading(true); }} style={navBtnStyle}>◀</button>
              )}
              
              <motion.img
                key={imgIndex} 
                src={gallery[imgIndex]}
                onLoad={() => setLoading(false)} // Hide spinner when image loads
                initial={{ opacity: 0 }} 
                animate={{ opacity: loading ? 0 : 1 }}
                style={{ width: "100%", maxHeight: "75vh", objectFit: "contain", borderRadius: 12 }}
                onClick={(e) => e.stopPropagation()}
              />

              {gallery.length > 1 && (
                <button onClick={(e) => { e.stopPropagation(); setImgIndex((imgIndex + 1) % gallery.length); setLoading(true); }} style={navBtnStyle}>▶</button>
              )}
            </div>
            
            <div style={{ color: 'white', marginTop: 20, opacity: 0.5 }}>{imgIndex + 1} / {gallery.length}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const navBtnStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'white',
  width: 50,
  height: 50,
  cursor: 'pointer',
  borderRadius: '50%',
  fontSize: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 20px',
  transition: 'all 0.2s'
};
export default function Projects() {
  const [active, setActive] = useState("university");
  const current = categories.find((c) => c.id === active);

  return (
    <section id="projects" style={{
      background: "linear-gradient(180deg, #0f0c29 0%, #1a1040 100%)",
      padding: "100px 24px",
    }}>
      {/* Header */}
      <motion.div
        style={{ textAlign: "center", marginBottom: 56 }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p style={{ fontSize: 12, color: "#a78bfa", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>
          — Portfolio —
        </p>
        <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "white", fontFamily: "Georgia, serif", marginBottom: 12 }}>
          Projects & Work
        </h2>
        <p style={{ fontSize: 14, color: "#64748b", maxWidth: 380, margin: "0 auto" }}>
          From university coursework to personal experiments — here's what I've built.
        </p>
      </motion.div>

      {/* Tab bar */}
      <motion.div
        style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <div style={{
          display: "flex", gap: 6, padding: 6,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16,
          flexWrap: "wrap",
          justifyContent: "center",
        }}>
          {categories.map((cat) => {
            const isActive = active === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 18px", borderRadius: 12,
                  fontSize: 14, fontWeight: 500,
                  cursor: "pointer", transition: "all 0.25s",
                  border: isActive ? `1px solid ${cat.color}30` : "1px solid transparent",
                  background: isActive ? `${cat.color}12` : "transparent",
                  color: isActive ? cat.color : "#64748b",
                  boxShadow: isActive ? `0 0 16px ${cat.color}20` : "none",
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span style={{
                  fontSize: 11, padding: "2px 7px", borderRadius: 999,
                  background: isActive ? `${cat.color}20` : "rgba(255,255,255,0.06)",
                  color: isActive ? cat.color : "#475569",
                }}>{cat.projects.length}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

 {/* Cards Grid */}
      <div style={{ maxWidth: 1100, margin: "0 auto", paddingBottom: "40px" }}> 
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 24, // Increased gap slightly
            }}
          >
            {current.projects.map((project) => (
              <Card key={project.title} project={project} color={current.color} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* VIEW MORE SECTION - Fixed positioning */}
      <div style={{ 
        width: "100%", 
        display: "flex", 
        justifyContent: "center", 
        marginTop: "60px", // Pushes it away from the cards
        paddingBottom: "20px" 
      }}>
        <motion.a 
          href="https://github.com/FreyaGrace" 
          target="_blank" 
          rel="noreferrer"
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 28px",
            borderRadius: "14px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "white",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 600,
            transition: "all 0.3s ease",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}
        >
          <span>View more on GitHub</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </motion.a>
      </div>

    </section>
  );
}
