import React from "react";
import { motion } from "motion/react";

type Position = {
  left: number;
  width: number;
};

const Menu = () => {
  return (
    <div className="grid h-screen place-content-center">
      <SlideTabs />
    </div>
  );
};

const SlideTabs = () => {
  const [position, setPosition] = React.useState<Position>({
    left: 0,
    width: 0,
  });
  return (
    <ul className="relative mx-auto flex w-fit bg-black p-1">
      <Tab setPosition={setPosition}>[Home]</Tab>
      <Tab setPosition={setPosition}>[About]</Tab>
      <Tab setPosition={setPosition}>[Contact]</Tab>

      <Cursor position={position} />
    </ul>
  );
};

const Tab = ({
  children,
  setPosition,
}: {
  children: React.ReactNode;
  setPosition: React.Dispatch<React.SetStateAction<Position>>;
}) => {
  const ref = React.useRef<HTMLLIElement>(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const data = ref.current.getBoundingClientRect(); // get the position of the element
        /**
         * data -> {
            "x": 394.671875,
            "y": 651.5,
            "width": 78.40625,
            "height": 32,
            "top": 651.5,
            "right": 473.078125,
            "bottom": 683.5,
            "left": 394.671875
          }
         */
        setPosition({
          width: data.width,
          left: ref.current.offsetLeft, // get the position of the element
        });
      }}
      onMouseLeave={() => {
        setPosition((prev) => ({
          ...prev,
          width: 0,
        }));
      }}
      className="relative z-10 block cursor-pointer px-1 py-1 text-xs uppercase text-white mix-blend-difference md:px-5 md:text-base"
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }: { position: Position }) => {
  return (
    <motion.li
      animate={position}
      transition={{
        ease: [0.6, 0.01, -0.05, 0.95],
        duration: 0.4,
      }}
      className="absolute z-0 h-7 bg-white md:h-8"
    />
  );
};

export default Menu;
