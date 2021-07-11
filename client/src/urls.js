export default {
  local: 'http://localhost:5000/',
  base: '/',
  active: process.env.NODE_ENV === 'production' ? 'base' : 'local',
};
//"sass-loader": "^8.0.2",
