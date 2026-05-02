import React from "react";
import { Link, useLocation } from "react-router-dom";
import { toggleDarkMode, isDarkMode } from "../../contexts/DarkMode";
import "./Header.css";

export default function Header({ onDarkModeToggle }) {
  const location = useLocation();
  const dark = isDarkMode();

  // navigation links 
  const navLink = (to, label) => {
    const active = location.pathname === to;
    return (
      <Link to={to} className={`header-nav-link${active ? " is-active" : ""}`}>
        {label}
      </Link>
    );
  };

  // dark mode | home | history
  return (
    <header className="header">
      <Link to="/" className="header-brand">
        <span className="header-brand-text"> Virus<span style={{ color: "#5b8dee" }}>Scanner</span></span>
      </Link>

      <div className="header-actions">
        <button onClick={() => { toggleDarkMode(); onDarkModeToggle(); }} className="header-mode-toggle"> {dark ? "◑" : "◐"}</button>
        {navLink("/", "Home")}
        {navLink("/history", "History")}
      </div>
      
    </header>
  );
}

