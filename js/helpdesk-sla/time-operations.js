// Starting hour of the business day defined in the server time zone.
var START = 10;

// Finishing hour of the business day defined in the server time zone.
var FINISH = 18;

// Length of the business say in hours.
var BUSINESS_DAY_LENGTH = FINISH - START;

var HOUR_IN_MS = 60 * 60 * 1000;
var DAY_IN_MS = 24 * HOUR_IN_MS;

/*
 * @param {Date} [date] date to check to be inside business hours interval
 * @return {boolean} `true` is the date is within [START, FINISH) interval on
 * business days and `false` otherwise
 */
var isWithinBusinessHours = function(date) {
  var date1 = new Date(date);
  var dayOfWeek = date1.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 1) {
    return false;
  }
  var hour = date1.getHours();
  return (hour >= START && hour < FINISH);
};

/*
 * @param {Number} [date] date in ms from the start of the epoch
 * @param {Number} [hours] number of hours to add to this date
 * @returns {Number} resulting date with respect to business hours, defined above
 */
var addBusinessHours = function(date, hours) {
  var result = date + hours * HOUR_IN_MS;
  if (!isWithinBusinessHours(new Date(result))) {
    // It's evening, let's skip the night.
    result += (24 - BUSINESS_DAY_LENGTH) * HOUR_IN_MS;
  }
  if (!isWithinBusinessHours(new Date(result))) {
    // It's weekend, let's skip it too.
    result += 2 * DAY_IN_MS;
  }
  return result;
};

exports.addBusinessHours = addBusinessHours;