const request = require('request');

const errorHandler = (err, res, next) => {
  console.log(err);
  res.locals.model.errorData = true;
  next();
};

module.exports = (appConfig) => {
  return (req, res, next) => {
    res.locals.model = {};
    if (req.query.country && req.query.city) {
      const authRequest = request.defaults({json: true, timeout: 5000, gzip: true});
      let endpoint = appConfig.endpoint.host + appConfig.endpoint.path + appConfig.endpoint.query;
      endpoint = endpoint.replace('{city}', req.query.city);
      endpoint = endpoint.replace('{country}', req.query.country);
      authRequest.get(endpoint, (err, response) => {
        if (err) {
          return errorHandler('Error returned from API - ' + endpoint, res, next);
        } else if (response.statusCode >= 400) {
          return errorHandler('Error code returned from API - ' + endpoint + ', code: ' + response.statusCode, res, next);
        } else {
          res.locals.model.forecast = response.body;
          next();
        }
      });
    } else {
      return errorHandler('Query parameters country & city not supplied', res, next);
    }
  };
};
