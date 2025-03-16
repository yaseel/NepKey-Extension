import { useState } from "react";
import "./App.css";
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { pageVariants, pageTransition } from "./animations/pageVariants.ts";
import HomePage from "./pages/HomePage.tsx";
import Settings from "./pages/Settings.tsx";

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              variants={pageVariants}
              initial="inital"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <HomePage />
            </motion.div>
          }
        ></Route>
        <Route
          path="/settings"
          element={
            <motion.div
              variants={pageVariants}
              initial="inital"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <Settings />
            </motion.div>
          }
        ></Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes/>
    </Router>
  );
}

export default App;
