import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navigation from "./components/Navigation";
import TodayWeather from "./pages/TodayWeather";
import WeeklyWeather from "./pages/WeeklyWeather";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./styles/global.scss";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<TodayWeather />} />
        <Route path="/weekly" element={<WeeklyWeather />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <div className="app">
          <Navigation />
          <main className="container">
            <AnimatedRoutes />
          </main>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
