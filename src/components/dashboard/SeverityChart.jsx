import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { parseCVEMetrics } from '../../utils/severity';

export default function SeverityChart({ cveData, loading }) {
  if (loading) {
    return (
      <div className="bg-card rounded-2xl border border-gray-800 p-6 flex flex-col h-full animate-pulse">
        <div className="h-6 bg-gray-800 rounded w-1/3 mb-6"></div>
        <div className="flex-1 bg-gray-800/50 rounded-full w-48 h-48 mx-auto mt-4"></div>
      </div>
    );
  }

  // Calculate severity distribution
  const distribution = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
    UNKNOWN: 0
  };

  (cveData || []).forEach(item => {
    const { severity } = parseCVEMetrics(item.cve);
    if (distribution[severity] !== undefined) {
      distribution[severity]++;
    } else {
      distribution["UNKNOWN"]++;
    }
  });

  const data = [
    { name: 'Critical', value: distribution.CRITICAL, color: '#ef4444' }, // red-500
    { name: 'High', value: distribution.HIGH, color: '#f97316' },     // orange-500
    { name: 'Medium', value: distribution.MEDIUM, color: '#eab308' },  // yellow-500
    { name: 'Low', value: distribution.LOW, color: '#3b82f6' },       // blue-500
  ].filter(item => item.value > 0);

  // If no data is available
  if (data.length === 0) {
    data.push({ name: 'Unknown', value: 1, color: '#374151' });
  }

  return (
    <div className="bg-card rounded-2xl border border-gray-800 p-6 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-white mb-4">Severity Distribution</h3>
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#131a2d', border: '1px solid #1f2937', borderRadius: '8px' }}
              itemStyle={{ color: '#fff', fontSize: '14px' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
