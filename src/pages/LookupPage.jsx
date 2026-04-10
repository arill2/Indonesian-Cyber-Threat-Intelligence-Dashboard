import { useState } from 'react';
import { Search, Shield, Zap, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import { useVirustotal } from '../hooks/useVirustotal';
import { useGroqAnalysis } from '../hooks/useGroqAnalysis';

export default function LookupPage() {
  const [query, setQuery] = useState('');
  const { scan, loading: vtLoading, error: vtError, result: vtResult } = useVirustotal();
  const { analyze, loading: aiLoading, error: aiError, analysis } = useGroqAnalysis();

  const handleScan = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const res = await scan(query);
    
    // If successfully matched and analyzed VT, ask Groq for context
    if (res && res.data) {
      let stats = res.data.attributes?.last_analysis_stats;
      let scoreStr = `(Malicious: ${stats?.malicious || 0}, Suspicious: ${stats?.suspicious || 0}, Undetected: ${stats?.undetected || 0})`;
      
      let prompt = `Sebagai analis siber, interpretasikan singkat hasil pemindaian VirusTotal untuk target "${query}" bertipe ${res.type}. Statistik deteksi mesin: ${scoreStr}. Apakah ini berbahaya dan apa rekomendasinya?`;
      
      analyze(prompt);
    }
  };

  // Helper to get total malicious scans vs total
  const getRiskScore = (data) => {
    const stats = data?.attributes?.last_analysis_stats;
    if (!stats) return { score: 0, total: 0, malicious: 0, level: 'CLEAN' };
    
    const malicious = stats.malicious || 0;
    const suspicious = stats.suspicious || 0;
    const total = Object.values(stats).reduce((a, b) => a + b, 0);
    const score = total > 0 ? Math.round(((malicious + suspicious) / total) * 100) : 0;
    
    let level = 'CLEAN';
    if (malicious >= 3) level = 'MALICIOUS';
    else if (malicious > 0 || suspicious > 1) level = 'SUSPICIOUS';

    return { score, total, malicious, suspicious, level };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center py-10 px-4 bg-card rounded-2xl border border-gray-800 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-3xl"></div>
        <div className="relative z-10 flex flex-col items-center">
          <Shield className="w-12 h-12 text-accent mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Universal Threat Scanner</h1>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Scan and analyze any IP Address, Domain, URL, or File Hash across multiple anti-virus engines with AI contextual analysis.
          </p>
          
          <form onSubmit={handleScan} className="w-full max-w-2xl relative group">
            <input 
              type="text" 
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter IP, Domain, or Hash..." 
              className="w-full bg-background border-2 border-gray-700/80 rounded-xl pl-12 pr-32 py-4 text-base text-white focus:outline-none focus:border-accent transition-all shadow-lg"
            />
            <Search className="absolute left-4 top-4 w-6 h-6 text-gray-400 group-focus-within:text-accent transition-colors" />
            <button 
              type="submit" 
              disabled={vtLoading || !query.trim()}
              className="absolute right-2 top-2 bottom-2 bg-accent hover:bg-blue-500 text-white font-medium rounded-lg px-6 flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {vtLoading ? <Activity className="w-5 h-5 animate-spin" /> : "Scan"}
            </button>
          </form>
        </div>
      </div>

      {vtError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <p>{vtError}</p>
        </div>
      )}

      {/* Results Workspace */}
      {(vtLoading || vtResult) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual Data */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-gray-800 rounded-2xl p-6 min-h-[300px]">
              {vtLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 animate-pulse space-y-4">
                  <Activity className="w-10 h-10 animate-spin" />
                  <p>Querying 70+ Anti-Virus Engines...</p>
                </div>
              ) : vtResult ? (
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-mono text-white font-bold">{query}</h3>
                      <p className="text-sm text-gray-400 uppercase tracking-widest mt-1">{vtResult.type} Entity Analysis</p>
                    </div>
                    {/* Badge */}
                    {(() => {
                      const { level, malicious } = getRiskScore(vtResult.data);
                      if (level === 'MALICIOUS') return <span className="bg-red-500/20 text-red-500 border border-red-500/50 px-4 py-2 rounded-lg font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> MALICIOUS ({malicious})</span>;
                      if (level === 'SUSPICIOUS') return <span className="bg-orange-500/20 text-orange-400 border border-orange-500/50 px-4 py-2 rounded-lg font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> SUSPICIOUS</span>;
                      return <span className="bg-green-500/20 text-green-400 border border-green-500/50 px-4 py-2 rounded-lg font-bold flex items-center gap-2"><ShieldCheck className="w-5 h-5"/> CLEAN</span>;
                    })()}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-800">
                    <div className="p-4 bg-background rounded-xl border border-gray-800">
                      <p className="text-gray-500 text-xs mb-1">Reputation Score</p>
                      <p className="text-xl font-mono text-white">{vtResult.data?.attributes?.reputation || 0}</p>
                    </div>
                    {vtResult.type === 'ip' && (
                      <>
                        <div className="p-4 bg-background rounded-xl border border-gray-800">
                          <p className="text-gray-500 text-xs mb-1">Country</p>
                          <p className="text-lg font-medium text-white">{vtResult.data?.attributes?.country || 'Unknown'}</p>
                        </div>
                        <div className="p-4 bg-background rounded-xl border border-gray-800 col-span-2">
                          <p className="text-gray-500 text-xs mb-1">Network/ISP</p>
                          <p className="text-sm text-white truncate" title={vtResult.data?.attributes?.as_owner}>{vtResult.data?.attributes?.as_owner || 'N/A'}</p>
                        </div>
                      </>
                    )}
                    {vtResult.type === 'domain' && (
                      <div className="p-4 bg-background rounded-xl border border-gray-800 col-span-3">
                        <p className="text-gray-500 text-xs mb-1">Category</p>
                        <p className="text-sm text-white truncate">
                           {Object.values(vtResult.data?.attributes?.categories || {}).slice(0,3).join(', ') || 'Uncategorized'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* AI Analysis Panel */}
          <div className="lg:col-span-1">
            <div className="bg-card/50 border border-amber-500/20 rounded-2xl p-6 h-full flex flex-col relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full"></div>
               <div className="flex items-center gap-2 mb-4 relative z-10">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-semibold text-white">AI Analyst Summary</h3>
               </div>
               
               <div className="flex-1 text-sm text-gray-300 overflow-y-auto pr-2 relative z-10 leading-relaxed font-sans">
                 {vtLoading ? (
                   <p className="text-gray-500 italic">Waiting for scan data...</p>
                 ) : aiLoading ? (
                   <div className="flex flex-col gap-2 animate-pulse">
                     <div className="h-4 bg-gray-800 rounded w-full"></div>
                     <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                     <div className="h-4 bg-gray-800 rounded w-4/6"></div>
                   </div>
                 ) : aiError ? (
                   <p className="text-red-400">{aiError}</p>
                 ) : analysis ? (
                   <div className="prose prose-invert prose-sm">
                      {analysis.split('\n').map((line, i) => <p key={i} className="mb-2">{line}</p>)}
                   </div>
                 ) : (
                   <p className="text-gray-500 italic">AI summary will appear here after the scan concludes.</p>
                 )}
               </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
