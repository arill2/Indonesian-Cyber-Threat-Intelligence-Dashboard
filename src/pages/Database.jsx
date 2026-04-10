import { useState, useEffect } from 'react';
import axios from 'axios';
import { Database as DbIcon, Search, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { parseCVEMetrics } from '../utils/severity';

export default function Database() {
  const [cveData, setCveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Instead of fetching all on mount, we fetch when user searches to simulate an archival database search
  const performSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const localKey = localStorage.getItem('NVD_API_KEY');
      const headers = {};
      if (localKey && localKey !== 'null') {
        headers['apiKey'] = localKey;
      }
      
      // NVD API supports keywordSearch
      const response = await axios.get(
        `https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${encodeURIComponent(searchQuery)}&resultsPerPage=50`,
        { headers }
      );
      
      setCveData(response.data.vulnerabilities || []);
    } catch (err) {
      console.error(err);
      // Fallback or show error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <DbIcon className="w-6 h-6 text-accent" /> Intelligence Database
          </h2>
          <p className="text-gray-400 text-sm mt-1">Search the complete historical archive of NVD vulnerabilities.</p>
        </div>
      </div>

      <div className="bg-card border border-gray-800 rounded-2xl p-6 shadow-lg flex-none">
        <form onSubmit={performSearch} className="flex gap-4">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search CVE ID, Vendor, Product, or Keyword (e.g. 'Apache Log4j')..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent shadow-inner text-lg"
            />
            <Search className="absolute left-4 top-3.5 w-6 h-6 text-gray-400" />
          </div>
          <button 
            type="submit" 
            disabled={loading || !searchQuery.trim()}
            className="bg-accent hover:bg-blue-500 text-white font-medium rounded-lg px-8 transition-colors disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search Archive'}
          </button>
        </form>
      </div>

      <div className="bg-card border border-gray-800 rounded-2xl flex-1 overflow-hidden flex flex-col">
        {!hasSearched && !loading ? (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-500">
            <DbIcon className="w-16 h-16 mb-4 opacity-20" />
            <p>Enter a query above to search the National Vulnerability Database.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-panel z-10 border-b border-gray-800">
                <tr className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  <th className="p-4">CVE ID</th>
                  <th className="p-4">Severity</th>
                  <th className="p-4">Published</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-800/60">
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-4"><div className="h-4 bg-gray-800 rounded w-24"></div></td>
                      <td className="p-4"><div className="h-6 bg-gray-800 rounded w-16"></div></td>
                      <td className="p-4"><div className="h-4 bg-gray-800 rounded w-24"></div></td>
                      <td className="p-4"><div className="h-4 bg-gray-800 rounded w-full"></div></td>
                      <td className="p-4"><div className="h-8 bg-gray-800 rounded w-20"></div></td>
                    </tr>
                  ))
                ) : cveData.length > 0 ? (
                  cveData.map((item) => {
                    const cve = item.cve;
                    const { severity } = parseCVEMetrics(cve);
                    const descObj = cve?.descriptions?.find(d => d.lang === 'en');
                    const description = descObj?.value || "No description available.";
                    
                    const sevColors = {
                        'CRITICAL': 'text-red-400',
                        'HIGH': 'text-orange-400',
                        'MEDIUM': 'text-yellow-400',
                        'LOW': 'text-blue-400',
                        'UNKNOWN': 'text-gray-400'
                    };

                    return (
                      <tr key={cve.id} className="hover:bg-white/[0.02]">
                        <td className="p-4 font-mono text-accent">
                          <Link to={`/cve/${cve.id}`} className="hover:underline">{cve.id}</Link>
                        </td>
                        <td className={`p-4 font-bold ${sevColors[severity] || 'text-gray-400'}`}>{severity}</td>
                        <td className="p-4 text-gray-400">{new Date(cve.published).toLocaleDateString()}</td>
                        <td className="p-4 text-gray-300 max-w-2xl truncate" title={description}>{description}</td>
                        <td className="p-4">
                          <Link to={`/cve/${cve.id}`} className="px-3 py-1.5 bg-background border border-gray-700 rounded-md hover:border-accent text-xs transition-colors">
                            View details
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-400 flex flex-col items-center">
                       <AlertCircle className="w-8 h-8 mb-2" />
                       No results found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
