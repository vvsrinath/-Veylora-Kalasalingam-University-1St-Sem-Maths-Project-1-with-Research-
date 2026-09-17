export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor(totalSeconds % 3600 / 60);
  const s = Math.floor(totalSeconds % 60);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function formatDistance(valueKm: number, decimals = 1): string {
  return `${valueKm.toFixed(decimals)} km`;
}

export function formatSpeed(valueKmh: number): string {
  return `${Math.round(valueKmh)} km/h`;
}

export function formatCurrency(value: number): string {
  return `₹${value.toFixed(2)}`;
}

export function formatMileage(value: number): string {
  return `${value.toFixed(1)} km/L`;
}

export function formatConsumption(value: number): string {
  return `${value.toFixed(1)} L/100km`;
}

export function formatLitres(value: number): string {
  return `${value.toFixed(1)} L`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));

}

export function formatRelativeDay(iso: string): string {
  const now = new Date();
  const d = new Date(iso);
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(iso);
}