import React, { useRef, useState } from "react";
import { scanHash, parseFile, saveToHistory, hashFile, getUrlReport } from "../../contexts/Requests";
import Loading from "./Loading";
import ScanResult from "./ScanResult";
import FullReport from "./FullReport";
import "./ScanTabs.css";

const TABS = ["FILE", "URL", "HASH"];

export default function ScanTabs() {
  const [activeTab, setActiveTab] = useState("FILE");
  const [url, setUrl]             = useState("");
  const [hash, setHash]           = useState("");
  const [loading, setLoading]     = useState(null);
  const [error, setError]         = useState(null);
  const [result, setResult]       = useState(null);
  const [fullReport, setFullReport] = useState(null);
  const [fileName, setFileName]   = useState(null);
  const fileRef = useRef(null); // reference (ref) to trigger file input click

  // reset states before new scan
  const reset = () => { setError(null); setResult(null); setLoading(null); };

  ///  File Scan ///
  // Note: Don't upload sensitive files, try downloading a harmless file (e.g from eicar.com) for testing
  const handleFile = async () => {
    try {
      const file = fileRef.current?.files?.[0]; // to get the selected file from file input

      if (!file) {
        return setError("Please select a file");
      }

      if (file.size > 32 * 1024 * 1024) {
        return setError("File size exceeds 32MB.");
      }

      // compute the file hash and scan file (assuming it exists on VirusTotal)
      reset(); 
      setLoading("Scanning File...");
      const sha256 = await hashFile(file);

      try {
        const fileReport = await scanHash(sha256);
        const parsed = parseFile(fileReport);
        setLoading(null);

        if (!parsed) { // means that the file doesn't exist in VirusTotal's database 
          setError("File is invalid. Try again");
          return;
        }

        setResult({ parsed, raw: fileReport, type: "file" });
        saveToHistory({ label: file.name, type: "file", verdict: parsed.verdict, raw: fileReport, isFileReport: true });
        return;

      } catch (err) {
        setLoading(null);
        return setError(err?.message || String(err));
      }

    } catch (err) {
      setLoading(null);
      setError(err?.message || String(err));
    }
  };

  ///  URL Scan ///
  const handleUrl = async () => {
    const t = url.trim();
    if (!t) {
      return setError("Please enter a URL");
    }

    try { 
      new URL(t); 
    } catch { 
      return setError("Enter a valid URL (e.g., https://example.com)"); 
    }

    try {
      reset(); 
      setLoading("Scanning URL...");
      try {
        const urlReport = await getUrlReport(t);
        const parsed = parseFile(urlReport);
        setLoading(null);
        
        if (!parsed) { // means that the file doesn't exist in VirusTotal's database 
          setError("URL is invalid. Try again");
          return;
        }
        
        setResult({ parsed, raw: urlReport, type: "url" });
        saveToHistory({ label: t, type: "url", verdict: parsed.verdict, raw: urlReport, isFileReport: true });
        return;

      } catch (err) {
        setLoading(null);
        return setError(err?.message || String(err));
      }

    } catch (err) {
      setLoading(null);
      setError(err?.message || String(err));
    }
  };

  /// Hash Scan ///
  const handleHash = async () => {
    const t = hash.trim();

    if (!t) {
      return setError("Please enter a hash");
    }

    if (!/^[a-fA-F0-9]{32}$|^[a-fA-F0-9]{40}$|^[a-fA-F0-9]{64}$/.test(t)) { // MD5, SHA-1, SHA-256 hashes
      return setError("Enter a valid hash (e.g. 44d88612fea8a8f36de82e1278abb02f)");
    }

    try {
      reset(); 
      setLoading("Scanning hash...");

      const fileReport = await scanHash(t);
      const parsed = parseFile(fileReport);

      setLoading(null);
      setResult({ parsed, raw: fileReport, type: "hash" });
      
      if (parsed) {
        saveToHistory({ label: t, type: "hash", verdict: parsed.verdict, raw: fileReport, isFileReport: true });
      }

    } catch (err) {
      setLoading(null);
      setError(err?.message || String(err));
    }
  };

  // this is the display of the scan tabs, inputs, and results
  return (
    <div>
      <div className="scan-tabs">
        {TABS.map((tab) => ( // tab buttons to switch between file/url/hash scan 
          <button key={tab} onClick={() => { setActiveTab(tab); reset(); }} 
            className={`scan-tab${activeTab === tab ? " is-active" : ""}`}>
              {tab}
          </button>
        ))}
      </div>

      {activeTab === "FILE" && ( // file scan section with file input and scan button
        <div className="scan-section scan-section--centered">
          <div onClick={() => fileRef.current?.click()} className="scan-dropzone">
            <p className="scan-dropzone-title">{fileName || "Click here to upload file"}</p>
            <p className="scan-dropzone-subtitle">Max 32MB</p>
          </div>
          <input type="file" ref={fileRef} className="scan-file-input" onChange={(e) => setFileName(e.target.files?.[0]?.name || null)} />
          <button onClick={handleFile} className="scan-button">Scan File</button>
        </div>
      )}

      {activeTab === "URL" && ( // url scan section with url input and scan button
        <div className="scan-section">
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter URL..." className="scan-input" />
          <button onClick={handleUrl} className="scan-button">Scan URL</button>
        </div>
      )}

      {activeTab === "HASH" && ( // hash scan section with hash input and scan button
        <div className="scan-section">
          <input type="text" value={hash} onChange={(e) => setHash(e.target.value)} placeholder="Enter hash..." className="scan-input" />
          <button onClick={handleHash} className="scan-button">Scan Hash</button>
        </div>
      )}
 
      {loading && <Loading message={loading} />}
      
      {error && <div className="scan-error">{error}</div>}
      
      {result?.parsed && <ScanResult 
        parsed={result.parsed} 
        onFullReport={() => setFullReport({ raw: result.raw, isFileReport: result.type === "hash" })} 
        isFileReport={result.type === "hash"} 
      />}
      
      {fullReport && <FullReport 
        data={fullReport.raw} 
        isFileReport={fullReport.isFileReport} 
        onClose={() => setFullReport(null)} 
      />}
    
    </div>
  );
}

