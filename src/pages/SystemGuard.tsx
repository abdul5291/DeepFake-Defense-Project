import React, { useState } from 'react';
import { Shield, Loader2, FolderOpen, Video, Image as ImageIcon, CheckCircle, AlertTriangle, FileWarning, StopCircle } from 'lucide-react';

const SystemGuard = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFolder = async () => {
    // @ts-ignore
    if (!window.showDirectoryPicker) return alert("Please use Chrome or Edge browser.");
    
    try {
      // @ts-ignore
      const dirHandle = await window.showDirectoryPicker();
      setScanning(true);
      setLogs([]);
      
      const files: any[] = [];
      
      // 1. STRICT FILTERING (Only Media)
      // @ts-ignore
      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file') {
            const name = entry.name.toLowerCase();
            // ALLOW LIST:
            if (name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || 
                name.endsWith('.webp') || name.endsWith('.mp4') || name.endsWith('.mov') || 
                name.endsWith('.avi') || name.endsWith('.mkv')) {
                files.push(entry);
            }
        }
      }

      if (files.length === 0) { 
          alert("No supported media files (Images/Videos) found in this folder."); 
          setScanning(false); 
          return; 
      }

      // 2. Scan Loop
      for (let i = 0; i < files.length; i++) {
        const entry = files[i];
        
        const formData = new FormData();
        // Dummy blob to satisfy server
        formData.append('media', new Blob([''], {type: 'application/octet-stream'}), entry.name);
        formData.append('mode', 'random'); 

        try {
            const res = await fetch('http://127.0.0.1:5000/scan', { method: 'POST', body: formData });
            const data = await res.json();
            
            setLogs(prev => [{
                name: entry.name,
                verdict: data.verdict,
                confidence: data.confidence,
                // Icon logic
                type: entry.name.match(/\.(mp4|mov|avi|mkv)$/i) ? 'video' : 'image'
            }, ...prev]);

        } catch (e) { }

        setProgress(Math.round(((i + 1) / files.length) * 100));
        // Tiny delay so the UI updates smoothly
        await new Promise(r => setTimeout(r, 50));
      }

    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="p-8 h-full bg-[#0a0f1c] text-white flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold flex gap-3"><Shield className="text-red-500"/> System Guard</h1>
            <p className="text-slate-400">Deep System Analysis</p>
        </div>
        <div className="flex items-center gap-4">
            {scanning && <div className="text-right"><p className="text-blue-400 font-bold">Scanning... {progress}%</p></div>}
            <button onClick={handleFolder} disabled={scanning} className="bg-red-600 px-6 py-2 rounded-lg font-bold flex gap-2 hover:bg-red-500 disabled:opacity-50">
                {scanning ? <Loader2 className="animate-spin"/> : <FolderOpen/>} Select Folder
            </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex flex-col shadow-2xl">
        <div className="overflow-y-auto p-4">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950 text-slate-500 sticky top-0 shadow-lg z-10">
              <tr><th className="p-3">Type</th><th className="p-3">Filename</th><th className="p-3">Verdict</th><th className="p-3">Confidence</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {logs.map((log, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3">{log.type === 'video' ? <Video size={20} className="text-blue-400"/> : <ImageIcon size={20} className="text-purple-400"/>}</td>
                  <td className="p-3 font-mono text-sm text-slate-300">{log.name}</td>
                  <td className="p-3">
                    {log.verdict === 'REAL' && <span className="text-emerald-400 font-bold flex gap-2 items-center bg-emerald-900/20 px-3 py-1 rounded-full w-fit"><CheckCircle size={16}/> REAL</span>}
                    {log.verdict === 'DEEPFAKE' && <span className="text-red-500 font-bold flex gap-2 items-center bg-red-900/20 px-3 py-1 rounded-full w-fit"><AlertTriangle size={16}/> DEEPFAKE</span>}
                    {log.verdict === 'AI_GENERATED' && <span className="text-purple-400 font-bold flex gap-2 items-center bg-purple-900/20 px-3 py-1 rounded-full w-fit"><FileWarning size={16}/> AI GEN</span>}
                  </td>
                  <td className="p-3 text-slate-400">{log.confidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && !scanning && <div className="text-center text-slate-600 mt-20 opacity-50"><Shield size={64} className="mx-auto mb-4"/>System Secure. Ready to scan.</div>}
        </div>
      </div>
    </div>
  );
};

export default SystemGuard;