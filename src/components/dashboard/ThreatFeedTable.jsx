import { ExternalLink, ShieldAlert } from 'lucide-react';
import { parseCVEMetrics } from '../../utils/severity';
import { Link } from 'react-router-dom';

export default function ThreatFeedTable({ cveData, loading, error }) {
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-red-500/20 text-red-400 border border-red-500/30">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">MEDIUM</span>;
      case 'LOW':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30">LOW</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-gray-500/20 text-gray-400 border border-gray-500/30">UNKNOWN</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card rounded-2xl border border-gray-800 flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold text-white">Latest Threats Feed</h3>
        </div>
        {!loading && !error && (
          <span className="text-xs text-gray-400 font-mono">Real-time NVD Sync</span>
        )}
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-panel border-b border-gray-800 text-xs uppercase tracking-wider text-gray-400 font-semibold">
              <th className="p-4">CVE ID</th>
              <th className="p-4">Severity</th>
              <th className="p-4">Score</th>
              <th className="p-4 hidden md:table-cell">Published Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 min-w-[200px]">Description</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-800/60">
            {loading ? (
               Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="p-4"><div className="h-4 bg-gray-800 rounded w-24"></div></td>
                  <td className="p-4"><div className="h-6 bg-gray-800 rounded w-16"></div></td>
                  <td className="p-4"><div className="h-4 bg-gray-800 rounded w-8"></div></td>
                  <td className="p-4 hidden md:table-cell"><div className="h-4 bg-gray-800 rounded w-32"></div></td>
                  <td className="p-4"><div className="h-4 bg-gray-800 rounded w-20"></div></td>
                  <td className="p-4"><div className="h-4 bg-gray-800 rounded w-full"></div></td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-red-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShieldAlert className="w-8 h-8" />
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-2 text-xs bg-red-500/20 px-3 py-1.5 rounded-md hover:bg-red-500/30 transition-colors">Retry Fetch</button>
                  </div>
                </td>
              </tr>
            ) : cveData?.length > 0 ? (
              cveData.map((item) => {
                const cve = item.cve;
                const { severity, score } = parseCVEMetrics(cve);
                
                // Get english description
                const descObj = cve?.descriptions?.find(d => d.lang === 'en');
                const description = descObj?.value || "No description available.";

                return (
                  <tr key={cve.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 font-mono text-accent whitespace-nowrap flex items-center gap-2">
                      <Link to={`/cve/${cve.id}`} className="hover:underline flex items-center gap-1">
                        {cve.id}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </td>
                    <td className="p-4">
                      {getSeverityBadge(severity)}
                    </td>
                    <td className="p-4 font-mono text-gray-300">
                      {score}
                    </td>
                    <td className="p-4 text-gray-400 hidden md:table-cell whitespace-nowrap">
                      {formatDate(cve.published)}
                    </td>
                    <td className="p-4">
                      <span className="text-gray-300 capitalize">{cve.vulnStatus?.toLowerCase()}</span>
                    </td>
                    <td className="p-4 text-gray-400 max-w-md truncate" title={description}>
                      {description}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">
                  No threats found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
