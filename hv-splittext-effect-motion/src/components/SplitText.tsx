import React from "react";
import { motion } from "motion/react";

interface SplitTextProps {
  children: React.ReactNode;
  href: string;
}

const SplitText = ({ children, href }: SplitTextProps) => {
  const variants = {
    initial: {
      y: 0,
    },
    hovered: {
      y: "-100%",
    },
    transition: {
      ease: [0.6, 0.01, -0.05, 0.95],
      duration: 0.2,
    },
  };

  const variantsSplitText = {
    initial: {
      y: "100%",
    },
    hovered: {
      y: 0,
    },
    transition: {
      ease: [0.6, 0.01, -0.05, 0.95],
      duration: 0.2,
    },
  };

  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      href={href}
      className="relative block overflow-hidden whitespace-nowrap text-4xl font-black uppercase sm:text-7xl md:text-8xl lg:text-9xl"
    >
      <div className="flex gap-2 items-center">
        [
        <div className="relative">
          <motion.div variants={variants} transition={variants.transition}>
            {children}
          </motion.div>
          <motion.div
            className="absolute inset-0"
            variants={variantsSplitText}
            transition={variantsSplitText.transition}
          >
            {children}
          </motion.div>
        </div>
        ]
      </div>
    </motion.a>
  );
};

export default SplitText;
