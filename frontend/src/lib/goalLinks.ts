export interface GoalLink {
  id: string;
  goalId: string;
  goalName: string;
  assetId: string;
  assetName: string;
  assetType: 'fund' | 'crypto' | 'stock-in' | 'stock-us';
  amount: number;
  createdAt: string;
}
const GOAL_LINKS_KEY = 'finwise_goal_links';
export function getGoalLinks(): GoalLink[] {
  try {
    const stored = localStorage.getItem(GOAL_LINKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}
export function addGoalLink(link: Omit<GoalLink, 'id' | 'createdAt'>): void {
  const links = getGoalLinks();
  const newLink: GoalLink = {
    ...link,
    id: `link_${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  links.push(newLink);
  localStorage.setItem(GOAL_LINKS_KEY, JSON.stringify(links));
}
export function removeGoalLink(id: string): void {
  const links = getGoalLinks();
  const filtered = links.filter(l => l.id !== id);
  localStorage.setItem(GOAL_LINKS_KEY, JSON.stringify(filtered));
}
export function getLinksForGoal(goalId: string): GoalLink[] {
  const links = getGoalLinks();
  return links.filter(l => l.goalId === goalId);
}
export function getLinksForAsset(assetId: string): GoalLink[] {
  const links = getGoalLinks();
  return links.filter(l => l.assetId === assetId);
}