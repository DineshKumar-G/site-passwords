const Router = require('express').Router();
const website = require('./services/websites');
const dashboard = require('./services/dashboard');

// CRUD Routes
Router.post('/api/addWebsite', website.addWebsite);
Router.get('/api/listWebsites', website.getAll);
Router.post('/api/update/:id', website.update);
Router.post('/api/delete/:id', website.delete);
Router.post('/api/accountUpdate/:webId/:op', website.updateAccount);

// Dashboard Routes
Router.get('/api/', dashboard.getMetrics);



module.exports = Router;
