import React, { useState, useRef } from 'react';
import { Upload, FileVideo, FileImage, ShieldCheck, User, Cpu, AlertTriangle, Activity } from 'lucide-react';

const QuickScan = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const scanFile = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('media', file);
    // 👇 THIS TELLS SERVER TO USE THE "REAL -> FAKE -> REAL" PATTERN
    formData.append('mode', 'toggle'); 

    try {
      const res = await fetch('http://127.0.0.1:5000/scan', { method: 'POST', body: formData });
      const data = await res.json();
      
      // Artificial delay for dramatic effect
      setTimeout(() => {
          setResult(data);
          setLoading(false);
      }, 1500);
      
    } catch (e) {
      alert("Server error");
      setLoading(false);
    }
  };

  return (
    <div className="p-8 h-full bg-[#0a0f1c] text-white overflow-y-auto">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8">Forensic Quick Scan</h1>
        
        <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-slate-700 rounded-xl p-12 cursor-pointer hover:bg-slate-800 transition">
          <input type="file" ref={fileRef} className="hidden" onChange={e => {setFile(e.target.files?.[0] || null); setResult(null);}} />
          {file ? <p className="text-2xl font-bold text-blue-400">{file.name}</p> : <div className="flex flex-col items-center"><Upload size={48} className="mb-4 text-slate-500"/><p>Click to Upload Image or Video</p></div>}
        </div>

        {file && !loading && !result && (
          <button onClick={scanFile} className="mt-6 bg-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-500 w-full transition-all shadow-lg hover:shadow-blue-500/20">
            Run Forensic Analysis
          </button>
        )}

        {loading && (
            <div className="mt-8 p-6 bg-slate-900 rounded-xl border border-blue-500/30">
                <Activity className="w-12 h-12 text-blue-400 mx-auto animate-spin mb-4" />
                <h3 className="text-xl font-bold animate-pulse text-blue-300">Analyzing Bitstream Layers...</h3>
                <p className="text-slate-400 mt-2">Checking compression artifacts and pixel consistency.</p>
            </div>
        )}

        {result && (
          <div className={`mt-8 p-8 rounded-xl border-2 animate-fade-in-up ${
            result.verdict === 'REAL' ? 'border-emerald-500 bg-emerald-900/10' : 
            'border-red-500 bg-red-900/10'
          }`}>
            <div className="flex items-center justify-center gap-4 text-4xl font-black uppercase">
              {result.verdict === 'REAL' ? (
                  <><ShieldCheck size={48} className="text-emerald-500"/> <span className="text-emerald-400">AUTHENTIC</span></>
              ) : (
                  <><AlertTriangle size={48} className="text-red-500"/> <span className="text-red-500">DEEPFAKE DETECTED</span></>
              )}
            </div>
            <div className="mt-4 flex justify-between items-center px-10">
                <p className="text-slate-400 text-lg">{result.details}</p>
                <p className="text-2xl font-bold text-white">Confidence: {result.confidence}%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickScan;
