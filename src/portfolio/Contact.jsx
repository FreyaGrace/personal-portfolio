import { motion } from "framer-motion";
import { useState } from "react";
import emailjs from "emailjs-com";
const links = [
  {
    label: "Send Email",
    bg: "linear-gradient(135deg, #7c3aed, #4f46e5)",
    shadow: "rgba(124,58,237,0.4)",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com//FreyaGrace",
    bg: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)",
    shadow: "transparent",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
      </svg>
    ),
  },
  {
    label: "Schedule a Call",
    href: "https://calendly.com/yourlink",
    bg: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
    shadow: "rgba(14,165,233,0.35)",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
];
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.05)",
  color: "white"
};

const btnStyle = {
  flex: 1,
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer"
};

export default function Contact() {
  const isFormValid = () =>
  formData.email && formData.subject && formData.message && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const [showForm, setShowForm] = useState(false);
  
const [formData, setFormData] = useState({
  email: "",
  subject: "",
  message: ""
});
const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};
const handleSend = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    alert("Please enter a valid email address!");
    return; // stop sending
  }

  emailjs.send(
    import.meta.env.VITE_EMAIL_SERVICE,
    import.meta.env.VITE_EMAIL_TEMPLATE,
    {
      user_email: formData.email,
      subject: formData.subject,
      message: formData.message,
    },
    import.meta.env.VITE_EMAIL_KEY
  )
  .then(() => {
    alert("Message sent successfully!");
    setShowForm(false);
    setFormData({ email: "", subject: "", message: "" });
  })
  .catch(() => {
    alert("Failed to send message.");
  });
};
  return (
    <section id="contact" style={{
      background: "linear-gradient(180deg, #1a1040 0%, #0f0c29 100%)",
      padding: "100px 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 700, height: 400,
        background: "radial-gradient(ellipse, rgba(124,58,237,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }}/>

      <motion.div
        style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Availability */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 28 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: "#22c55e",
            boxShadow: "0 0 8px rgba(34,197,94,0.7)",
            animation: "pulse-dot 2s infinite",
          }}/>
          <style>{`@keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
          <span style={{ fontSize: 13, color: "#4ade80", fontWeight: 500 }}>
            Available for opportunities
          </span>
        </div>

        {/* Label */}
        <p style={{ fontSize: 12, color: "#a78bfa", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>
          — Get in Touch —
        </p>

        {/* Heading */}
        <h2 style={{
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 900,
          fontFamily: "Georgia, serif",
          lineHeight: 1.2,
          marginBottom: 16,
        }}>
          <span style={{ color: "white" }}>Let's Build </span>
          <span style={{
            background: "linear-gradient(135deg, #a78bfa, #38bdf8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Something Great
          </span>
        </h2>

        {/* Divider */}
        <div style={{
          width: 56, height: 2, margin: "0 auto 24px",
          background: "linear-gradient(to right, #7c3aed, #0ea5e9)",
          borderRadius: 2,
        }}/>

        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8, marginBottom: 48 }}>
          Whether it's a collaboration, internship opportunity, or just a conversation about tech —
          I'm always open to connecting with great people.
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginBottom: 56 }}>
          {links.map((link, i) => (
            <motion.a
    key={i}
    onClick={() => {
      if (link.label === "Send Email") {
        setShowForm(true);
      } else {
        window.open(link.href, "_blank");
      }
    }}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.2 }}
              whileHover={{ y: -3, scale: 1.02 }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "13px 24px", borderRadius: 14,
                background: link.bg,
                border: link.border || "none",
                color: "white",
                fontWeight: 600, fontSize: 14,
                textDecoration: "none",
                boxShadow: link.shadow !== "transparent" ? `0 4px 20px ${link.shadow}` : "none",
              }}
            >
              {link.icon}
              {link.label}
     
            </motion.a>
          ))}
        </div>
 {showForm && (
  <div style={{
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999
  }}>
    <div style={{
      background: "#0f172a",
      padding: 24,
      borderRadius: 16,
      width: "90%",
      maxWidth: 400
    }}>
      <h3 style={{ color: "white", marginBottom: 16 }}>
        Send Message
      </h3>

      <input
        name="email"
  type="email"           // ✅ ensures basic HTML validation
  placeholder="Your Email"
  style={inputStyle}
  onChange={handleChange}
      />

      <input
        name="subject"
        placeholder="Subject"
        style={inputStyle}
        onChange={handleChange}
      />

      <textarea
        name="message"
        placeholder="Message"
        rows={4}
        style={inputStyle}
        onChange={handleChange}
      />

      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button
          style={btnStyle}
          onClick={() => setShowForm(false)}
        >
          Cancel
        </button>

       <button
  style={{ ...btnStyle, background: "#7c3aed", opacity: isFormValid() ? 1 : 0.6 }}
  onClick={handleSend}
  disabled={!isFormValid()}
>
  Send
</button>
      </div>
    </div>
  </div>
)}

        {/* Footer */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          paddingTop: 32,
        }}>
          <p style={{ fontSize: 12, color: "#334155", marginBottom: 8 }}>
            Fatima Grace Apinan · Computer Science · Philippines
          </p>
          <p style={{ fontSize: 12, color: "#1e293b" }}>
            🎮 Psst — double-click the profile photo for a surprise
          </p>
        </div>
      </motion.div>
    </section>
  );
}