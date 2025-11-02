export const fmtINR = (n: number): string => {
  return '₹' + n.toLocaleString('en-IN');
};
export const pct = (p: number): string => {
  return `${p.toFixed(1)}%`;
};
export const monthsBetween = (from: string, to: string): number => {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const months = (toDate.getFullYear() - fromDate.getFullYear()) * 12 + (toDate.getMonth() - fromDate.getMonth());
  return Math.max(0, months);
};
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
export const shortDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    year: 'numeric'
  });
};