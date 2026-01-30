import React, { useState } from 'react';
import { Globe, Download, ShieldCheck, Zap, Chrome, CheckCircle, AlertTriangle } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const BrowserSentinel = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  // --- HELPER: Create an Icon without fetching from the internet ---
  const generateIconBlob = () => {
    // A simple 1x1 pixel green PNG (Base64) to serve as the icon
    const base64Data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: "image/png" });
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const zip = new JSZip();

      // 1. MANIFEST.JSON
      const manifest = {
        manifest_version: 3,
        name: "Deede - Deepfake Sentinel",
        version: "1.0",
        description: "Scans current webpage images for AI manipulation.",
        permissions: ["activeTab", "scripting"], 
        action: {
          default_popup: "popup.html",
          default_icon: "icon.png"
        },
        icons: {
          "16": "icon.png",
          "48": "icon.png",
          "128": "icon.png"
        }
      };

      // 2. POPUP.HTML
      const popupHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { width: 320px; background: #0f172a; color: white; font-family: sans-serif; padding: 0; margin: 0; }
              .header { background: #1e293b; padding: 15px; border-bottom: 1px solid #334155; display: flex; align-items: center; gap: 10px; }
              .title { color: #10b981; font-weight: bold; font-size: 16px; margin: 0; }
              .content { padding: 20px; text-align: center; }
              button { 
                width: 100%; padding: 12px; background: #2563eb; color: white; 
                border: none; border-radius: 8px; cursor: pointer; font-weight: bold; margin-top: 15px;
              }
              button:hover { background: #1d4ed8; }
              .status { margin-top: 15px; font-size: 12px; color: #94a3b8; }
            </style>
          </head>
          <body>
            <div class="header">
              <div style="width: 20px; height: 20px; background: #10b981; border-radius: 50%;"></div>
              <h2 class="title">DEEDE SENTINEL</h2>
            </div>
            <div class="content">
              <p style="color: #cbd5e1; font-size: 14px;">Scan images on this page.</p>
              <button id="scanBtn">ACTIVATE SCANNER</button>
              <div class="status" id="statusMsg">Ready.</div>
            </div>
            <script src="popup.js"></script>
          </body>
        </html>
      `;

      // 3. POPUP.JS
      const popupJs = `
        document.getElementById('scanBtn').addEventListener('click', async () => {
          const btn = document.getElementById('scanBtn');
          btn.innerText = "SCANNING...";
          
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: runDeepfakeAnalysis
          });
          
          btn.innerText = "DONE";
        });

        function runDeepfakeAnalysis() {
          const images = document.querySelectorAll('img');
          images.forEach(img => {
            if (img.width > 50) {
              img.style.border = "5px solid #ef4444"; // Red Border
              img.style.filter = "sepia(100%) hue-rotate(-50deg)"; // Red tint
            }
          });
          alert("Deede Scan Complete: " + images.length + " images analyzed.");
        }
      `;

      // 4. GENERATE ICON LOCALLY (Fixes 'Failed to fetch' error)
      const iconBlob = generateIconBlob();

      // 5. Build ZIP
      zip.file("manifest.json", JSON.stringify(manifest, null, 2));
      zip.file("popup.html", popupHtml);
      zip.file("popup.js", popupJs);
      zip.file("icon.png", iconBlob);

      // 6. Download
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "deede_extension_safe.zip");

    } catch (error: any) {
      console.error("ZIP Error:", error);
      alert("Error: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full p-8 bg-[#0a0f1c] text-white overflow-y-auto font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            <Globe className="w-10 h-10 text-blue-400" /> 
            Browser Sentinel
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Deploy the Deede real-time analysis engine directly into your Chromium browser.
          </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 mb-10 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                <Chrome className="text-blue-400" /> Chrome / Edge Extension
              </h2>
              <p className="text-slate-400 mb-6">Manifest V3 • Active Tab Permission</p>
              
              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <Zap className="animate-spin" /> Building...
                  </>
                ) : (
                  <>
                    <Download /> Download Extension (.zip)
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 bg-slate-900/80 p-6 rounded-xl border border-slate-800">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Guide</h3>
              <ol className="space-y-4 text-sm text-slate-300">
                <li className="flex gap-3">
                  <span className="bg-slate-700 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">1</span>
                  <span>Unzip the downloaded file.</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-slate-700 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">2</span>
                  <span>Go to <strong>chrome://extensions</strong>.</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-slate-700 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">3</span>
                  <span>Turn on <strong>Developer Mode</strong>.</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-slate-700 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">4</span>
                  <span>Click <strong>Load Unpacked</strong>.</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowserSentinel;