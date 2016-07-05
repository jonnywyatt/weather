const _ = require('lodash');
const moment = require('moment');

module.exports = (rawData) => {
  let dataCopy = _.cloneDeep(rawData);
  let transformed = {
    days: []
  };
  transformed.city = dataCopy.city;
  let currentDate = -1;
  let displayDate;
  let currentDayForecasts = [];
  const numberOfSlots = dataCopy.list.length;
  dataCopy.list.forEach((item, idx) => {
    const m = moment.unix(item.dt).add(1, 'hour');
    const date = m.date();
    item.displayTime = m.format('kk') + ':00';
    item.icon = {
      file: _.get(item, 'weather[0].icon', ''),
      text: _.get(item, 'weather[0].description', '')
    };

    if ((date !== currentDate || numberOfSlots - idx === 1) && currentDate !== -1) {
      transformed.days.push({
        displayDate,
        slots: currentDayForecasts
      });
      currentDayForecasts = [];
    }
    currentDayForecasts.push(item);
    displayDate = m.format('ddd D MMM');
    currentDate = date;
  });
  return transformed;
};
