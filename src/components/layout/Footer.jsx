import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer-line">@ 2026 VirusScanner — Frontend project for educational purposes</p>
      <p className="footer-line footer-line--spaced">
        Developed by Helen Ngo | Powered by <a href="https://docs.virustotal.com/reference/overview" target="_blank" rel="noopener noreferrer" className="footer-link">VirusTotal Public API v3</a>
      </p>
    </footer>
  );
}
