export const logAnalytics = (message) => {
  console.log(`[Analytics] ${message}`);
};

export const ANALYTICS_MESSAGES = {
  VIEWED: 'User viewed gym members',
  VIEWED_ONE: 'User viewed a gym member',
  CREATED: 'User created a gym member',
  UPDATED: 'User updated a gym member',
  DELETED: 'User deleted a gym member',
  SEARCHED: 'User searched gym members',
};