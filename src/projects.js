export const PROJECTS = [
  {
    id: 'tweetminer',
    name: 'TweetMiner',
    description: 'Turn social content into opportunities',
    icon: '⛏️',
    path: '/tweetminer',
    color: '#10b981',
  },
  // Add future projects here:
  // {
  //   id: 'newproject',
  //   name: 'New Project',
  //   description: 'Description here',
  //   icon: '🚀',
  //   path: '/newproject',
  //   color: '#3b82f6',
  // },
];

export function getProjectById(id) {
  return PROJECTS.find(p => p.id === id);
}

export function getProjectByPath(path) {
  return PROJECTS.find(p => p.path === path || path.startsWith(p.path + '/'));
}
