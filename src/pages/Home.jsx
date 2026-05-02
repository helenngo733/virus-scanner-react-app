import React from "react";
import ScanTabs from "../components/main/ScanTabs";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-box">
        <div className="home-title">
          <h2>Check Suspicious Content</h2>
          <p>Scan files, URLs, and hashes with 90+ antivirus engines</p>
        </div>
        <ScanTabs />
      </div>
    </div>
  );
}
