const expect = require('chai').expect;
const app = require('../src/app');
const appConfig = require('../src/config/default.json');
const request = require('supertest');
const fetchForecast = require('../src/middleware/fetchForecast');
const nock = require('nock');
const forecastApiResponse = require('./data/forecastApiResponse.json');
const cheerio = require('cheerio');

let dom;

const requestApp = (path, done) => {
  return request(app)
    .get(path)
    .expect(response => {
      dom = cheerio.load(response.text, {xmlMode: true});
    })
    .end(done);
};

describe('Forecast app', () => {
  beforeEach(() => {
    nock(appConfig.endpoint.host)
      .get(appConfig.endpoint.path)
      .query(true)
      .reply(200, () => forecastApiResponse);
  });

  it('should print an error if a country / city are not supplied', done => {
    requestApp('/', done)
      .expect(() => {
        expect(dom('.t-error').text()).to.equal('An error occurred')
      });
  });

  describe('Valid city / country supplied', () => {
    it('should print the city name in the title', done => {
      requestApp(appConfig.endpoint.path + '?city=London&country=uk', done)
        .expect(() => {
          expect(dom('.t-city').text()).to.equal('London')
        });
    });
  });
});
