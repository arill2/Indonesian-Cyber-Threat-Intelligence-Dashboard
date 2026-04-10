import { AlertTriangle, ShieldCheck, Activity, Target } from "lucide-react";
import { parseCVEMetrics } from "../../utils/severity";

export default function StatCards({ cveData, loading }) {
  // Compute some basic stats from CVE data
  let criticalCount = 0;
  let highCount = 0;
  
  if (cveData && cveData.length > 0) {
    cveData.forEach(item => {
      const { severity } = parseCVEMetrics(item.cve);
      
      if (severity === "CRITICAL") criticalCount++;
      if (severity === "HIGH") highCount++;
    });
  }

  const cards = [
    {
      title: "Latest CVEs",
      value: loading ? "..." : (cveData?.length || 0),
      subtitle: "Fetched from NVD",
      icon: <Activity className="w-6 h-6 text-blue-400" />,
      color: "border-blue-500/20 bg-blue-500/5"
    },
    {
      title: "Critical Threats",
      value: loading ? "..." : criticalCount,
      subtitle: "High priority alerts",
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      color: "border-red-500/20 bg-red-500/5"
    },
    {
      title: "High Severity",
      value: loading ? "..." : highCount,
      subtitle: "Needs immediate review",
      icon: <Target className="w-6 h-6 text-orange-400" />,
      color: "border-orange-500/20 bg-orange-500/5"
    },
    {
      title: "System Status",
      value: "Secure",
      subtitle: "All services running",
      icon: <ShieldCheck className="w-6 h-6 text-green-400" />,
      color: "border-green-500/20 bg-green-500/5"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => (
        <div key={idx} className={`p-5 rounded-2xl border bg-card/40 backdrop-blur-sm ${card.color} transition-all duration-300 hover:bg-card/80`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">{card.title}</p>
              <h3 className="text-3xl font-bold text-white font-mono">{card.value}</h3>
            </div>
            <div className="p-2 bg-background rounded-lg border border-gray-800">
              {card.icon}
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs text-gray-500">{card.subtitle}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
