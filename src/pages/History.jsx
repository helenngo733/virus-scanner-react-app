import React, { useState, useEffect } from "react";
import { getHistory, deleteFromHistory, parseFile } from "../contexts/Requests";
import FullReport from "../components/main/FullReport";
import ScanResult from "../components/main/ScanResult";
import "./History.css";

export default function History() {
  const [history, setHistory]   = useState([]);
  const [selected, setSelected] = useState(null);
  const [fullReport, setFullReport] = useState(null);

  // load history 
  useEffect(() => { 
    setHistory(getHistory()); 
  }, []);

  // handles deleting an entry from history
  const handleDelete = (id) => {
    deleteFromHistory(id); 
    setHistory(getHistory());
    if (selected?.id === id) setSelected(null);
  };

  // works to determine styling based on verdict
  const verdictClass = (v) => v === "Malicious" ? "malicious" : v === "Suspicious" ? "suspicious" : "harmless";

  // If no history --> show empty state
  if (history.length === 0) 
    return (
      <div className="history-empty">
        <div className="history-empty-state">
          <p className="history-empty-title">No scan history yet</p>
          <p className="history-empty-text">Previous scans will appear here</p>
        </div>
      </div>
  );

  return (
    <div className="history-page">
      <div className="history-header">
        <h2 className="history-title">Scan History</h2>
      </div>

      <div className="history-list">
        {history.map((entry) => ( // This section renders each history entry / delete entry
          <div key={entry.id} onClick={() => setSelected(selected?.id === entry.id ? null : entry)} 
            className={`history-entry${selected?.id === entry.id ? " is-selected" : ""}`}>
            
            <div className="history-entry-row">
              <div className="history-entry-main">
                <div className="history-entry-label-row">
                  <span className="history-entry-label">{entry.label}</span>
                </div>
              </div>
              
              <div className="history-entry-actions">
                <span className={`history-entry-verdict history-entry-verdict--${verdictClass(entry.verdict)}`}>{entry.verdict}</span> 
                <button onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }} className="history-delete-button" title="Delete">🗑</button>
              </div>
            </div>

            {selected?.id === entry.id && entry.raw && ( // only show details if an entry is selected, also the name/type details for hash only
              <div>
                <ScanResult
                  parsed={parseFile(entry.raw)}
                  isFileReport={entry.type === "hash"}
                  onFullReport={() => setFullReport({ raw: entry.raw, isFileReport: entry.type === "hash" })}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {fullReport && <FullReport data={fullReport.raw} isFileReport={fullReport.isFileReport} onClose={() => setFullReport(null)} />}
  
    </div>
  );
}


