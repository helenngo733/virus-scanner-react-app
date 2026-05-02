import { useState } from "react";
import { parseFile } from "../../contexts/Requests";
import "./FullReport.css";

export default function FullReport({ data, isFileReport, onClose }) {
  const [filter, setFilter] = useState("all");
  if (!data) return null;
  
  const parsed  = parseFile(data); // this to parsed stats from raw data
  const results = parsed?.results || {}; // this to get results from parsed data; otherwise its empty
  
  // filter results based on selected category (cat)
  const entries  = Object.entries(results).filter(([, v]) => filter === "all" || v.category === filter);

  // this is shows what the full report are (includes which and how many engines are in which category) 
  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} className="report-overlay">
      <div className="report-panel">
        <button onClick={onClose} className="report-close" aria-label="Close report">&times;</button>
        <h3 className="report-title">Full Engine Report</h3>

        <div className="report-filters">
          {["all","malicious","suspicious","harmless","undetected"].map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)} className={`report-filter-button${filter === cat ? " is-active" : ""}`} data-category={cat}>
              {cat}{cat !== "all" && parsed?.stats?.[cat] !== undefined && ` (${parsed.stats[cat]})`}
            </button>
          ))}
        </div>

        {entries.length > 0 ? (
          <table className="report-table">
            <thead>
              <tr className="report-table-row">
                {["Engine","Result","Category"].map(h => <th key={h} className="report-table-heading">{h}</th>)}
              </tr>
            </thead>

            <tbody>
              {entries.map(([engine, { category, result }]) => (
                <tr key={engine} className="report-table-row">
                  <td className="report-table-cell report-table-cell--engine">{engine}</td>
                  <td className="report-table-cell report-table-cell--result">{result || "—"}</td>
                  <td className={`report-table-cell report-table-cell--category report-category-${category}`}>{category}</td>
                </tr>
              ))}
            </tbody>
      
          </table>
        ) : (
          <p className="report-empty">No results for this filter.</p>
        )}
      </div>
    </div>
  );
}
