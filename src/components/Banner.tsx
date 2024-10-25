import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

interface BannerProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Banner: React.FC<BannerProps> = ({ darkMode, toggleDarkMode }) => {
  return (
    <header className="banner">
      <div className="logo-container">
        <img
          src="https://conceal.network/images/branding/team-bbg-center-s-256x256.png"
          alt="Conceal Logo"
          className="conceal-logo"
        />
      </div>
      <h1>Mining Calculator</h1>
      <button onClick={toggleDarkMode} className="theme-toggle">
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>
    </header>
  );
};

export default Banner;
