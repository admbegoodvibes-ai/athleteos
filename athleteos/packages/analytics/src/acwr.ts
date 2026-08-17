export function calculateEWMA(data: number[], decay: number): number {
  if (data.length === 0) return 0;
  let ewma = data[0];
  for (let i = 1; i < data.length; i++) {
    ewma = data[i] * decay + ewma * (1 - decay);
  }
  return ewma;
}

export function calculateAcuteLoad(dailyLoads: number[]): number {
  // 7-day rolling average
  const loads = dailyLoads.slice(-7);
  if (loads.length === 0) return 0;
  return loads.reduce((a, b) => a + b, 0) / loads.length;
}

export function calculateChronicLoad(dailyLoads: number[]): number {
  // 28-day rolling average
  const loads = dailyLoads.slice(-28);
  if (loads.length === 0) return 0;
  return loads.reduce((a, b) => a + b, 0) / loads.length;
}

export function calculateACWR(acuteLoad: number, chronicLoad: number): number {
  if (chronicLoad === 0) return 0;
  return Number((acuteLoad / chronicLoad).toFixed(2));
}

export function getACWRZone(acwr: number): 'undertrained' | 'optimal' | 'warning' | 'danger' {
  if (acwr < 0.8) return 'undertrained';
  if (acwr >= 0.8 && acwr <= 1.3) return 'optimal';
  if (acwr > 1.3 && acwr <= 1.5) return 'warning';
  return 'danger';
}
