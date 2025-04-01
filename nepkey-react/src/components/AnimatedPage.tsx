import React, { ReactNode } from "react";
import { pageTransition, pageVariants } from "../animations/pageVariants.ts";
import { motion } from "motion/react";

interface AnimatedPageProps {
  children: ReactNode;
}

const AnimatedPage = ({ children }: AnimatedPageProps) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="inital"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
