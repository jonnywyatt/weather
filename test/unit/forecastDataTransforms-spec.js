const expect = require('chai').expect;
const forecastApiResponse = require('../data/forecastApiResponse.json');
const dataTransforms = require('../../src/dataTransforms/forecast');
const _ = require('lodash');

describe('Forecast data transforms', () => {
  let transformed;

  beforeEach(() => {
    transformed = dataTransforms(_.cloneDeep(forecastApiResponse));
  });

  it('should group the 3-hour interval forecasts by day', () => {
    expect(transformed.days.length).to.equal(5);
  });

  it('should add a display time to each forecast slot', () => {
    transformed.days[0].slots.forEach(slot => {
      expect(/\d\d:00/.test(slot.displayTime)).to.be.true;
    });
  });

  it('should add the weather icon for each slot', () => {
    transformed.days[0].slots.forEach(slot => {
      expect(slot.icon).to.exist;
    });
  });
});
