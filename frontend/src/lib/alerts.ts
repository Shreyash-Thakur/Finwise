export interface PriceAlert {
  id: string;
  assetId: string;
  assetName: string;
  assetType: 'fund' | 'crypto' | 'stock-in' | 'stock-us';
  condition: 'above' | 'below';
  threshold: number;
  note?: string;
  createdAt: string;
  triggered?: boolean;
}
const ALERTS_KEY = 'finwise_price_alerts';
export function getAlerts(): PriceAlert[] {
  try {
    const stored = localStorage.getItem(ALERTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}
export function addAlert(alert: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered'>): void {
  const alerts = getAlerts();
  const newAlert: PriceAlert = {
    ...alert,
    id: `alert_${Date.now()}`,
    createdAt: new Date().toISOString(),
    triggered: false
  };
  alerts.push(newAlert);
  localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
}
export function removeAlert(id: string): void {
  const alerts = getAlerts();
  const filtered = alerts.filter(a => a.id !== id);
  localStorage.setItem(ALERTS_KEY, JSON.stringify(filtered));
}
export function checkAlerts(assetId: string, currentPrice: number): PriceAlert[] {
  const alerts = getAlerts();
  const triggered: PriceAlert[] = [];
  alerts.forEach(alert => {
    if (alert.assetId === assetId && !alert.triggered) {
      const shouldTrigger = alert.condition === 'above' && currentPrice >= alert.threshold || alert.condition === 'below' && currentPrice <= alert.threshold;
      if (shouldTrigger) {
        alert.triggered = true;
        triggered.push(alert);
      }
    }
  });
  if (triggered.length > 0) {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  }
  return triggered;
}
export function resetAlert(id: string): void {
  const alerts = getAlerts();
  const alert = alerts.find(a => a.id === id);
  if (alert) {
    alert.triggered = false;
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  }
}