const API_KEY = ""; // VirusTotal API Key here
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
const VT_BASE = "https://www.virustotal.com/api/v3";

// to construct the proxied URL for API requests
// had some CORS issues during development, so this is a workaround 
function proxied(endpoint) {
  return `${CORS_PROXY}${VT_BASE}${endpoint}`;
}

// convert a URL into VirusTotal's URL identifier (base64url without padding)
function urlToId(url) {
  const b64 = btoa(unescape(encodeURIComponent(url)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// this is to fetch requests to the VirusTotal API 
export async function makeVTRequest(endpoint, options = {}) {
  const response = await fetch(proxied(endpoint), {
    ...options,
    headers: { "x-apikey": API_KEY, "Origin": "https://www.virustotal.com", ...options.headers },
  });

  // this is to catch the CORS 403 error
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("403 Error. Visit https://cors-anywhere.herokuapp.com/corsdemo to request temporary access and try again.");
    }
    const err = await response.json().catch(() => ({ error: { message: response.statusText } }));
    throw new Error(err.error?.message || `Request failed (${response.status})`);
  }

  return response.json();
}

// get a URL report by the URL itself 
export async function getUrlReport(url) {
  const id = urlToId(url);
  return makeVTRequest(`/urls/${id}`);
}

// this is needed to compute the file hash
export async function hashFile(file) {

  if (!file) {
    throw new Error("No file provided");
  }

  const arrayBuffer = await file.arrayBuffer(); // read the file as an ArrayBuffer
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer); // compute the SHA-256 hash
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert the hash to a byte array
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // convert bytes to hex string
  return hashHex;
}

// Hash Requests 
export async function scanHash(hash) {
  return makeVTRequest(`/files/${hash}`);
}

// this is to parse the existing file from VirusTotal so that it can be usuable, hopefully this works?
export function parseFile(data) {

  const attrs = data?.data?.attributes; // attributes 
  if (!attrs) return null;

  const stats = attrs.last_analysis_stats; // stats 
  if (!stats) return null;

  const total = Object.values(stats).reduce((s, v) => s + v, 0); // total engines 
  if (!total) return null;

  const num = (v) => ((v / total) * 100).toFixed(1); // number of engines for each verdict (ig also the percentage?) 

  return {
    stats, total,
    verdict: stats.malicious > 0 ? "Malicious" : stats.suspicious > 0 ? "Suspicious" : "Safe",
    percents: { malicious: num(stats.malicious||0), suspicious: num(stats.suspicious||0), harmless: num(stats.harmless||0), undetected: num(stats.undetected||0) },
    results: attrs.last_analysis_results || null,
    meta: { name: attrs.meaningful_name || attrs.names?.[0] || "", sha256: attrs.sha256||"", md5: attrs.md5||"", sha1: attrs.sha1||"", size: attrs.size||null, type: attrs.type_description||"" },
  };
}

const HISTORY_KEY = "vt_scan_history";

// this is to save a scan entry to history in localStorage
export function saveToHistory(entry) {
  const h = getHistory();
  h.unshift({ ...entry, id: Date.now() });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, 50)));
}

// this is to get the scan history from localStorage
export function getHistory() {
  try { 
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); 
  } catch { 
    return []; 
  }
}

// this is to delete a specific entry from scan history 
export function deleteFromHistory(id) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(getHistory().filter(h => h.id !== id)));
}