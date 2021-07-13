export default {
  local: 'http://localhost:5050/',
  base: '/',
  active: process.env.NODE_ENV === 'production' ? 'base' : 'local',
};
