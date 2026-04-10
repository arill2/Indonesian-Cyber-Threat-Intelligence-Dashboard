import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Shield, ArrowLeft, ExternalLink, Zap, Activity, Info } from 'lucide-react';
import { useGroqAnalysis } from '../hooks/useGroqAnalysis';
import { parseCVEMetrics } from '../utils/severity';

export default function CVEDetail() {
  const { id } = useParams();
  const [cveData, setCveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { analyze, loading: aiLoading, error: aiError, analysis } = useGroqAnalysis();

  useEffect(() => {
    const fetchCVEDetail = async () => {
      try {
        setLoading(true);
        const localKey = localStorage.getItem('NVD_API_KEY');
        const headers = {};
        if (localKey && localKey !== 'null') headers['apiKey'] = localKey;

        const response = await axios.get(
          `https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${id}`,
          { headers }
        );

        const vulnerabilities = response.data.vulnerabilities || [];
        if (vulnerabilities.length > 0) {
          const cve = vulnerabilities[0].cve;
          setCveData(cve);
          
          // Trigger Groq AI explanation
          const descObj = cve.descriptions?.find(d => d.lang === 'en');
          const desc = descObj?.value || "Tidak ada deskripsi Inggris.";
          const prompt = `Sebagai pakar keamanan siber, tolong jelaskan kerentanan ${id} berikut dalam bahasa Indonesia yang mudah dimengerti, apa dampaknya untuk sistem di Indonesia (potensinya), dan langkah mitigasinya. Deskripsi referensi: ${desc}`;
          
          analyze(prompt);
        } else {
          setError("CVE not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load CVE details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCVEDetail();
  }, [id]);

  if (loading) {
    return <div className="p-10 flex flex-col items-center justify-center text-gray-500 animate-pulse"><Activity className="w-10 h-10 mb-4 animate-spin"/> Loading {id}...</div>;
  }

  if (error || !cveData) {
    return <div className="p-10 text-red-500 text-center">{error || "Not found"}</div>;
  }

  const descObj = cveData.descriptions?.find(d => d.lang === 'en');
  const description = descObj?.value || "No description available.";
  const { severity, score } = parseCVEMetrics(cveData);
  
  const sevColors = {
      'CRITICAL': 'bg-red-500',
      'HIGH': 'bg-orange-500',
      'MEDIUM': 'bg-yellow-500',
      'LOW': 'bg-blue-500',
      'UNKNOWN': 'bg-gray-500'
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <Link to="/database" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Database
      </Link>

      <div className="bg-card border border-gray-800 rounded-2xl p-8 relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-2 h-full ${sevColors[severity] || 'bg-gray-500'}`}></div>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold font-mono text-white mb-2">{cveData.id}</h1>
            <div className="flex gap-3 mb-6">
              <span className={`px-3 py-1 rounded-md text-sm font-bold text-white ${sevColors[severity] || 'bg-gray-500'}`}>
                {severity}
              </span>
              {score !== "-" && (
                <span className="px-3 py-1 bg-background border border-gray-700 rounded-md text-sm text-gray-300 font-mono">
                  CVSS: {score}
                </span>
              )}
            </div>
            <p className="text-gray-300 leading-relaxed max-w-3xl">{description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* References */}
        <div className="bg-card border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-accent" /> References & Patches
          </h3>
          <ul className="space-y-3">
            {cveData.references?.slice(0, 5).map((ref, i) => (
              <li key={i} className="flex flex-col">
                <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center gap-1 text-sm truncate">
                  {ref.tags?.includes("Patch") ? "🩹 " : "🔗 "}{ref.url}
                </a>
                <span className="text-xs text-gray-500">{ref.source}</span>
              </li>
            ))}
            {cveData.references?.length > 5 && (
               <li className="text-sm text-gray-500 italic">+ {cveData.references.length - 5} more references</li>
            )}
          </ul>
        </div>

        {/* AI Insight */}
        <div className="bg-gradient-to-br from-card to-[#131a2d] border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full"></div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 relative z-10">
            <Zap className="w-5 h-5 text-amber-500" /> AI Executive Brief
          </h3>
          <div className="text-sm text-gray-300 leading-relaxed font-sans relative z-10">
            {aiLoading ? (
              <div className="animate-pulse space-y-2">
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
              <p className="text-gray-500 italic">No AI insights generated.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
