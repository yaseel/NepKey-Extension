import { useState } from "react";
import "./App.css";
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "motion/react";
import HomePage from "./pages/HomePage.tsx";
import Settings from "./pages/Settings.tsx";
import AnimatedPage from "./components/AnimatedPage.tsx";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <AnimatedPage>
              <HomePage />
            </AnimatedPage>
          }
        ></Route>
        <Route
          path="/settings"
          element={
            <AnimatedPage>
              <Settings />
            </AnimatedPage>
          }
        ></Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
