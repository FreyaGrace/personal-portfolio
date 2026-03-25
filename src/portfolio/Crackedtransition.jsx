import { motion } from "framer-motion";

export default function CrackTransition({ onDone }) {
  return (
    <motion.div
    style={{ width: "100vw", height: "100vh" }} // ← force viewport units directly
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Crack Image */}
      <motion.img
        src="/crack.png"
        alt="crack"
        className="absolute w-full h-full object-cover"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* Flash Effect */}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.5 }}
      />

      {/* Text — calls onDone after it finishes animating in
      <motion.p
        className="text-white text-xl z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        onAnimationComplete={onDone} // ← triggers after animation finishes
      >
        Entering hidden world...
      </motion.p> */}
    </motion.div>
  );
}