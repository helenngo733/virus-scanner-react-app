import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import History from "./pages/History";
import { initDarkMode } from "./contexts/DarkMode";
import "./App.css";

initDarkMode();

export default function App() {
  const [, forceUpdate] = useState(0);
  return (
    <Router basename="/virus-scanner-react-app">
      <div className="app">
        <Header onDarkModeToggle={() => forceUpdate(n => n + 1)} /> {/* force to update dark mode. This works! */}
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
