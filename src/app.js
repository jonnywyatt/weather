const express = require('express');
const path = require('path');
const appConfig = require('./config/default.json');
const fetchForecast = require('./middleware/fetchForecast');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '../public')));
app.use('/', fetchForecast(appConfig), (req, res) => {
  const viewModel = res.locals.model;
  res.render('index', viewModel);
});

console.log('Application started on port 3000');
app.listen(3000);

module.exports = app;
