import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, Search, Server, Bug, Radio, Link } from 'lucide-react';
import ThreatFeedTable from '../components/dashboard/ThreatFeedTable';
import { parseCVEMetrics } from '../utils/severity';

export default function ThreatFeed() {
  const [activeTab, setActiveTab] = useState('cve');
  const [cveData, setCveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  useEffect(() => {
    if (activeTab !== 'cve') return;
    
    // Fetch NVD CVEs for ThreatFeed (with larger limit or specific keyword if search matches, but for now we'll do client-side filter for simplicity since NVD API keyword search can be complex)
    const fetchNVDData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const localKey = localStorage.getItem('NVD_API_KEY');
        const headers = {};
        if (localKey && localKey !== 'null') {
          headers['apiKey'] = localKey;
        }

        // Calculate last 14 days
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 14);
        
        const formatNVDDate = (date) => {
          const pad = (n) => n.toString().padStart(2, '0');
          return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T00:00:00.000`;
        };

        const response = await axios.get(
          `https://services.nvd.nist.gov/rest/json/cves/2.0?pubStartDate=${formatNVDDate(start)}&pubEndDate=${formatNVDDate(end)}&resultsPerPage=50`,
          { headers }
        );

        let vulns = response.data.vulnerabilities || [];
        // Sort descending by publish date to ensure newest on top
        vulns.sort((a, b) => new Date(b.cve.published) - new Date(a.cve.published));

        setCveData(vulns);
      } catch (err) {
        console.error("Failed to fetch NVD data", err);
        setError("Failed to sync with NVD Database.");
      } finally {
        setLoading(false);
      }
    };

    fetchNVDData();
  }, [activeTab]);

  // Client-side filtering
  const filteredCves = cveData.filter(item => {
    const cve = item.cve;
    
    // Search keyword against ID or English description
    const descObj = cve?.descriptions?.find(d => d.lang === 'en');
    const description = descObj?.value || "";
    const matchesSearch = cve.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Severity filter
    const { severity } = parseCVEMetrics(cve);
    
    const matchesSeverity = filterSeverity === 'ALL' || severity === filterSeverity;

    return matchesSearch && matchesSeverity;
  });

  // Mock Data for Malware & Phishing tabs
  const mockMalware = [
    { hash: "e3b0c44298fc1c149afbf4c8996fb924", family: "Lazarus", type: "Ransomware", date: "2026-04-10" },
    { hash: "d41d8cd98f00b204e9800998ecf8427e", family: "DanaBot", type: "Trojan", date: "2026-04-09" }
  ];

  const mockPhishing = [
    { url: "http://bca-klik-verif-id.com", target: "Bank BCA", status: "Active", date: "2026-04-10" },
    { url: "https://pajak-go-id-tagihan.net", target: "DJP", status: "Active", date: "2026-04-08" }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Radio className="w-6 h-6 text-accent" /> Live Threat Feed
          </h2>
          <p className="text-gray-400 text-sm mt-1">Real-time alerts streams for vulnerabilities, malware, and phishing.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-gray-800">
        <button onClick={() => setActiveTab('cve')} className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'cve' ? 'border-accent text-accent' : 'border-transparent text-gray-400 hover:text-white'}`}>
           <div className="flex items-center gap-2"><Bug className="w-4 h-4"/> CVE Vulnerabilities</div>
        </button>
        <button onClick={() => setActiveTab('malware')} className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'malware' ? 'border-accent text-accent' : 'border-transparent text-gray-400 hover:text-white'}`}>
           <div className="flex items-center gap-2"><Server className="w-4 h-4"/> Malware Hashes</div>
        </button>
        <button onClick={() => setActiveTab('phishing')} className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'phishing' ? 'border-accent text-accent' : 'border-transparent text-gray-400 hover:text-white'}`}>
           <div className="flex items-center gap-2"><Link className="w-4 h-4"/> Phishing URLs</div>
        </button>
      </div>

      <div className="bg-card border border-gray-800 rounded-2xl overflow-hidden min-h-[500px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-800 bg-panel flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search feed..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-accent"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
          
          {activeTab === 'cve' && (
            <select 
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-background border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-accent"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Only</option>
              <option value="MEDIUM">Medium Only</option>
            </select>
          )}
        </div>

        {/* Content */}
        <div className="p-0">
          {activeTab === 'cve' && (
            // Reusing Table. We pass filteredCves. Note ThreatFeedTable expects the direct feed data.
            // Wait, ThreatFeedTable has its own wrapper that sets height to full. We can use it directly.
            <div className="h-[600px]">
               <ThreatFeedTable cveData={filteredCves} loading={loading} error={error} />
            </div>
          )}

          {activeTab === 'malware' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-panel border-b border-gray-800 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  <th className="p-4">MD5 Hash</th>
                  <th className="p-4">Family</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Detection Date</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-800/60">
                {mockMalware.map((m, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="p-4 font-mono text-accent">{m.hash}</td>
                    <td className="p-4 font-bold text-red-400">{m.family}</td>
                    <td className="p-4 text-orange-400">{m.type}</td>
                    <td className="p-4 text-gray-400">{m.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'phishing' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-panel border-b border-gray-800 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  <th className="p-4">Malicious URL</th>
                  <th className="p-4">Targeted Entity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date Logged</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-800/60">
                {mockPhishing.map((p, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="p-4 font-mono text-red-400">{p.url}</td>
                    <td className="p-4 text-gray-300 font-medium">{p.target}</td>
                    <td className="p-4"><span className="bg-red-500/20 text-red-500 px-2 py-1 rounded text-xs border border-red-500/30 font-bold">{p.status}</span></td>
                    <td className="p-4 text-gray-400">{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
