export const getSeverityColor = (severity) => {
  const sevColors = {
      'CRITICAL': 'bg-red-500 text-white',
      'HIGH': 'bg-orange-500 text-white',
      'MEDIUM': 'bg-yellow-500 text-white',
      'LOW': 'bg-blue-500 text-white',
      'UNKNOWN': 'bg-gray-500 text-white'
  };
  return sevColors[severity] || sevColors['UNKNOWN'];
};

export const parseCVEMetrics = (cve) => {
  let severity = "UNKNOWN";
  let score = "-";
  
  if (!cve || !cve.metrics) return { severity, score };

  // Check V3.1
  if (cve.metrics.cvssMetricV31 && cve.metrics.cvssMetricV31.length > 0) {
    const data = cve.metrics.cvssMetricV31[0].cvssData;
    severity = data?.baseSeverity || cve.metrics.cvssMetricV31[0].baseSeverity || "UNKNOWN";
    score = data?.baseScore ? data.baseScore.toFixed(1) : "-";
    return { severity, score };
  }

  // Check V3.0
  if (cve.metrics.cvssMetricV30 && cve.metrics.cvssMetricV30.length > 0) {
    const data = cve.metrics.cvssMetricV30[0].cvssData;
    severity = data?.baseSeverity || cve.metrics.cvssMetricV30[0].baseSeverity || "UNKNOWN";
    score = data?.baseScore ? data.baseScore.toFixed(1) : "-";
    return { severity, score };
  }

  // Check V2
  if (cve.metrics.cvssMetricV2 && cve.metrics.cvssMetricV2.length > 0) {
    const metric = cve.metrics.cvssMetricV2[0];
    severity = metric.baseSeverity || "UNKNOWN";
    score = metric.cvssData?.baseScore ? metric.cvssData.baseScore.toFixed(1) : "-";
    return { severity, score };
  }

  return { severity, score };
};
