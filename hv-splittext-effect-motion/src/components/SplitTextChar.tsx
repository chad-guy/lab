import { motion } from "motion/react";

interface SplitTextCharProps {
  label: string;
  href: string;
}

const SplitTextChar = ({ label, href }: SplitTextCharProps) => {
  const STAGGER = 0.025;
  const DURATION = 0.4;

  const variants = {
    initial: {
      y: 0,
      rotateX: 0,
      z: 0,
      perspective: "2000px",
      transformOrigin: "center bottom",
    },
    hovered: {
      y: "-100%",
      rotateX: -90,
      z: 150,
      perspective: "2000px",
      transformOrigin: "center bottom",
    },
    transition: {
      ease: [0.6, 0.01, -0.05, 0.95],
      duration: DURATION,
    },
  };

  const variantsSplitText = {
    initial: {
      y: "100%",
      rotateX: 90,
      z: 150,
      perspective: "2000px",
      transformOrigin: "center top",
    },
    hovered: {
      y: 0,
      rotateX: 0,
      z: 0,
      perspective: "2000px",
      transformOrigin: "center top",
    },
    transition: {
      ease: [0.6, 0.01, -0.05, 0.95],
      duration: DURATION,
    },
  };

  return (
    <motion.a
      initial="initial"
      animate="initial"
      whileHover="hovered"
      href={href}
      className="relative block overflow-hidden whitespace-nowrap text-4xl font-black uppercase sm:text-7xl md:text-8xl lg:text-9xl"
    >
      <div className="flex gap-2 items-center">
        <div className="relative">
          {/* ORIGINAL TEXT */}
          <div>
            {label?.split("").map((char, index) => (
              <motion.span
                key={index}
                variants={variants}
                className="inline-block"
                transition={{
                  ...variants.transition,
                  delay: index * STAGGER,
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>
          {/* SPLIT TEXT */}
          <div className="absolute inset-0">
            {label?.split("").map((char, index) => (
              <motion.span
                key={index}
                variants={variantsSplitText}
                className="inline-block"
                transition={{
                  ...variantsSplitText.transition,
                  delay: index * STAGGER,
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </motion.a>
  );
};

export default SplitTextChar;
