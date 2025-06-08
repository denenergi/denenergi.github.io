import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <header className="nav">
      <div className="container nav__container">
        <motion.div
          className="nav__links"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/"
            className={`nav__link ${location.pathname === '/' ? 'nav__link--active' : ''}`}
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Today
            </motion.span>
          </Link>
          <Link
            to="/weekly"
            className={`nav__link ${location.pathname === '/weekly' ? 'nav__link--active' : ''}`}
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Weekly Forecast
            </motion.span>
          </Link>
        </motion.div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Navigation; 