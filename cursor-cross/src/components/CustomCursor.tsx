import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect } from "react";

const CustomCursor = () => {
  // Configuración del cursor
  const SPRING_CONFIG = { damping: 40, stiffness: 400 };
  const INITIAL_POSITION = -100;

  // Estados del cursor
  const cursorX = useMotionValue(INITIAL_POSITION);
  const cursorY = useMotionValue(INITIAL_POSITION);
  const cursorXSpring = useSpring(cursorX, SPRING_CONFIG);
  const cursorYSpring = useSpring(cursorY, SPRING_CONFIG);

  // Componentes de la cruz
  const CrossLine = ({ isVertical = false }) => (
    <motion.div
      className={`fixed pointer-events-none bg-[#797979] ${
        isVertical ? "w-[1px] h-screen top-0" : "h-[1px] w-screen left-0"
      }`}
      style={{
        [isVertical ? "left" : "top"]: isVertical
          ? cursorXSpring
          : cursorYSpring,
        transform: isVertical ? "translateX(-50%)" : "translateY(-50%)",
      }}
    />
  );

  // Seguimiento del cursor
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <>
      <CrossLine isVertical={true} />
      <CrossLine isVertical={false} />
      <motion.div
        className="fixed pointer-events-none bg-[#0000FF] h-14 w-14 rounded-full z-50"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          transform: "translate(-50%, -50%)",
        }}
      />
    </>
  );
};

export default CustomCursor;
