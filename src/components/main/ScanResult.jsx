import React from "react";
import "./ScanResult.css";

export default function ScanResult({ parsed, onFullReport, isFileReport }) {
 
  if (!parsed) return null;

  const { stats, verdict, meta } = parsed;
  const verdictColor = verdict === "Malicious" ? "#dc2626" : verdict === "Suspicious" ? "#f97316" : "#22c55e"; 
  const detected = stats.malicious || 0; // number of engines for the malicious stuff 

  const total  = Object.values(stats).reduce((a, b) => a + b, 0); // total engines calculated 

  const verdictClass = verdict === "Malicious" ? "scan-result-banner--malicious" : verdict === "Suspicious" ? "scan-result-banner--suspicious" : "scan-result-banner--harmless";

  // this shows what the scan results are (includes verdict and number of detected engines) + the full report button 
  return (
    <div className="scan-result">
      
      <div className={`scan-result-banner ${verdictClass}`}>
        <div>
          <div className="scan-result-label">SCAN RESULT</div>
          <div className="scan-result-verdict" style={{ color: verdictColor }}>{verdict}</div>
        </div>

        <div className="scan-result-count-block">
          <div className="scan-result-count" style={{ color: verdictColor }}>
            {detected}<span className="scan-result-count-total">/{total}</span>
          </div>
          <div className="scan-result-count-label">Engines Detected</div>
        </div>

      </div>

      {isFileReport && meta && (
        <div className="scan-result-meta">
          {meta.name  && <div className="scan-result-meta-line"><strong>Name:</strong> {meta.name}</div>}
          {meta.type  && <div className="scan-result-meta-line"><strong>Type:</strong> {meta.type}</div>}
        </div>
      )}

      <button onClick={onFullReport} className="full-report-button"> View Full Report </button>

    </div>
  );
}

