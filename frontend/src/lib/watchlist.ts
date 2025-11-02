export interface WatchlistItem {
  id: string;
  type: 'fund' | 'crypto' | 'stock-in' | 'stock-us' | 'bond';
  symbol: string;
  name: string;
  addedAt: string;
  notes?: string;
}
const WATCHLIST_KEY = 'finwise_watchlist';
export const getWatchlist = (): WatchlistItem[] => {
  try {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};
export const addToWatchlist = (item: Omit<WatchlistItem, 'addedAt'>): void => {
  const watchlist = getWatchlist();
  const exists = watchlist.find(w => w.id === item.id && w.type === item.type);
  if (!exists) {
    watchlist.push({
      ...item,
      addedAt: new Date().toISOString()
    });
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  }
};
export const removeFromWatchlist = (id: string, type: string): void => {
  const watchlist = getWatchlist();
  const filtered = watchlist.filter(w => !(w.id === id && w.type === type));
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(filtered));
};
export const isInWatchlist = (id: string, type: string): boolean => {
  const watchlist = getWatchlist();
  return watchlist.some(w => w.id === id && w.type === type);
};
export const updateWatchlistNotes = (id: string, type: string, notes: string): void => {
  const watchlist = getWatchlist();
  const item = watchlist.find(w => w.id === id && w.type === type);
  if (item) {
    item.notes = notes;
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  }
};