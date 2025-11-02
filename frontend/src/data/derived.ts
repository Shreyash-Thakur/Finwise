import { user, plan, goals, holdings } from './seed';
export const emergencyTargetAmount = Math.round(plan.splitMonthly.needs * user.emergencyMonthsTarget);
export const emergencySavedAmount = Math.round(emergencyTargetAmount * (user.emergencyMonthsCurrent / user.emergencyMonthsTarget));
export const goalProgress = (g: {
  target: number;
  saved: number;
}) => g.saved / g.target;
export const totalInvested = holdings.reduce((sum, h) => sum + h.invested, 0);
export const totalSIP = holdings.reduce((sum, h) => sum + h.sip, 0);
export const monthsToGoal = (target: number, saved: number, sip: number) => {
  if (sip <= 0) return Infinity;
  return Math.ceil((target - saved) / sip);
};
export const allocationArray = Object.entries(plan.allocationPct).filter(([_, value]) => value > 0).map(([name, value]) => ({
  name: name.charAt(0).toUpperCase() + name.slice(1),
  value
}));