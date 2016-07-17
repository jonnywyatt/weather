const expect = require('chai').expect;
const forecastApiResponse = require('../data/forecastApiResponse.json');
const dataTransforms = require('../../src/dataTransforms/forecast');
const _ = require('lodash');

let transformed;
describe('Forecast data transforms', () => {
  beforeEach(() => {
    transformed = dataTransforms(_.cloneDeep(forecastApiResponse), 'Europe');
  });

  it('should return an ordered list of days', () => {
    expect(transformed.days).to.be.instanceOf(Array);
  });

  it('should group the 3-hour interval forecasts by day', () => {
    transformed.days.forEach(day => {
      const dayNum = day.intervals[0].dayNum;
      expect(typeof dayNum).to.equal('number');
      day.intervals.forEach(interval => {
        expect(interval.dayNum).to.equal(dayNum);
      });
    });
  });

  it('should return 5 days of forecasts', () => {
    expect(transformed.days.length).to.equal(5);
  });

  it('should include all intervals', () => {
    let count = 0;
    transformed.days.forEach(day => {
      count = count + day.intervals.length;
    });
    expect(count).to.equal(forecastApiResponse.list.length);
  });
  
  it('should add a display time to each forecast slot', () => {
    transformed.days[0].intervals.forEach(interval => {
      expect(/\d\d:00/.test(interval.displayTime)).to.be.true;
    });
  });

  it('should add the weather icon for each slot', () => {
    transformed.days[0].intervals.forEach(interval => {
      expect(interval.icon).to.exist;
    });
  });
});

describe('Timezones / daylight saving', () => {
  it('should adjust the display time for daylight saving, if used in the specified city / country', () => {
    transformed = dataTransforms(_.cloneDeep(forecastApiResponse), 'Europe');
    expect(transformed.days[0].intervals[0].displayTime).to.equal('01:00');
  });

  it('should not adjust the display time for daylight saving, if not used in the specified city / country', () => {
    const copy = _.cloneDeep(forecastApiResponse);
    copy.city.name = 'Lusaka';
    transformed = dataTransforms(copy, 'Africa');
    expect(transformed.days[0].intervals[0].displayTime).to.equal('02:00');
  });
});
