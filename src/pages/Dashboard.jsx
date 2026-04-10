import { useState, useEffect } from 'react';
import axios from 'axios';
import StatCards from '../components/dashboard/StatCards';
import ThreatFeedTable from '../components/dashboard/ThreatFeedTable';
import SeverityChart from '../components/dashboard/SeverityChart';

export default function Dashboard() {
  const [cveData, setCveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNVDData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use environment variable if available, else standard public fetch
        const headers = {};
        if (import.meta.env.VITE_NVD_API_KEY) {
          headers['apiKey'] = import.meta.env.VITE_NVD_API_KEY;
        }

        // Calculate last 14 days to fetch latest CVEs
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 14);
        
        const formatNVDDate = (date) => {
          const pad = (n) => n.toString().padStart(2, '0');
          return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T00:00:00.000`;
        };

        const response = await axios.get(
          `https://services.nvd.nist.gov/rest/json/cves/2.0?pubStartDate=${formatNVDDate(start)}&pubEndDate=${formatNVDDate(end)}&resultsPerPage=100`,
          { headers }
        );

        let vulns = response.data.vulnerabilities || [];
        // Sort descending by publish date to ensure newest on top
        vulns.sort((a, b) => new Date(b.cve.published) - new Date(a.cve.published));
        
        // Take only the top 50 for the Dashboard view
        setCveData(vulns.slice(0, 50));
      } catch (err) {
        console.error("Failed to fetch NVD data", err);
        setError("Failed to sync with NVD Database. Rate limit might be reached.");
      } finally {
        setLoading(false);
      }
    };

    fetchNVDData();
    
    // Auto refresh every 5 minutes
    const interval = setInterval(fetchNVDData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <StatCards cveData={cveData} loading={loading} />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ThreatFeedTable cveData={cveData} loading={loading} error={error} />
        </div>
        <div className="xl:col-span-1 min-h-[400px]">
          <SeverityChart cveData={cveData} loading={loading} />
        </div>
      </div>
    </div>
  );
}
