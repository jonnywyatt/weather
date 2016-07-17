const express = require('express');
const path = require('path');
const appConfig = require('./config/default.json');
const fetchForecast = require('./middleware/fetchForecast');
const dataTransforms = require('./dataTransforms/forecast');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '../public')));
app.use('/forecast', fetchForecast(appConfig), (req, res) => {
  const viewModel = {};

  if (res.locals.model.errorData) {
    viewModel.errorData = res.locals.model.errorData;
  } else if (res.locals.model.forecast) {
    viewModel.forecast = dataTransforms(res.locals.model.forecast, req.query.region);
  }
  res.render('index', viewModel);
});

console.log('Application started on port 3000');
app.listen(3000);

module.exports = app;
