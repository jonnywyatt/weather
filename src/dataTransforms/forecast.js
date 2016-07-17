const _ = require('lodash');
const moment = require('moment-timezone');

module.exports = (rawData, tzRegion) => {
  let dataCopy = _.cloneDeep(rawData);
  let transformed = {
    city: dataCopy.city,
    days: []
  };
  let currentDayIntervals = [];
  let lastIntervalDayNum = -1;
  let displayDate;
  dataCopy.list.forEach((interval, idx) => {
    const m = moment.unix(interval.dt).tz(tzRegion + '/' + dataCopy.city.name);
    interval.displayTime = m.format('kk') + ':00';
    interval.icon = {
      file: _.get(interval, 'weather[0].icon', ''),
      text: _.get(interval, 'weather[0].description', '')
    };
    interval.dayNum = m.date();
    const isLastInterval = dataCopy.list.length === idx + 1;
    if ((interval.dayNum !== lastIntervalDayNum && lastIntervalDayNum !== -1) || isLastInterval) {
      if (isLastInterval) {
        currentDayIntervals.push(interval);
      }
      transformed.days.push({
        displayDate,
        intervals: currentDayIntervals
      });
      currentDayIntervals = [];
    }
    currentDayIntervals.push(interval);
    displayDate = m.format('ddd D MMM');

    lastIntervalDayNum = interval.dayNum;
  });
  return transformed;
};
