const DAY_IN_MS = 60 * 60 * 24 * 1000;

export const getPrice = (data, day) => {
    return data.get(new Date(day).toDateString());
};
  
// pluck Open price for now.
export const convertData = (items) => {

  // make the more complex imported data into a simple map for lookups.
  const convertedMap = new Map();

  items.forEach(element => {
    const key = element.Date;
    convertedMap.set(key, element.Open);
  });
  return convertedMap;
}

export const massageData = (items) => {
  // the data has several prices per day. we just need "High"

  let newData = [];

  items.forEach((element, index) => {
    // get the date as a standard string.
    // for some reson dates in this format 2022-02-18 get saved as teh day before.
    // add one day to these to move
    const dateObj = new Date(element.Date)
    const key = new Date(dateObj.getTime() + DAY_IN_MS).toDateString();

    const price = element.High;
    let number;

    if (!price.replace) {
      // assume it's a number already
      number = price;
    } else {
      number = Number(price.replace(/[^0-9.-]+/g,""));
    }
    const tempObj = {};
    tempObj[key] = number
    newData[index] = tempObj;
  });
  debugger;
  return newData;
}

const getDatasetStartDay = (data) => {
  // Data is a map, and remains ordered, but the dataset MUST BE IN ASC ORDER
  const firstDay = data.keys().next().value;
  return new Date(firstDay);
};

const getDatasetEndDay = (data) => {
  // Data is a map, and remains ordered, but the dataset MUST BE IN ASC ORDER
  return new Date(Array.from(data.keys()).pop());
};

export const getValidMarketDay = (data, from, directionSwtich) => {
  let currentDay = from;
  if (isMarketDayWithinData(data, currentDay)) {
    return currentDay;
  }
  // otherwise search for and return first market day in direction
  do {
    currentDay += (DAY_IN_MS * directionSwtich);
    if (currentDay > getDatasetEndDay(data)) {
       return null;
    }
  } while (!isMarketDayWithinData(data, currentDay));

  return currentDay;
};

const isMarketDayWithinData = (data, day) => {
  return data.has(new Date(day).toDateString());
};

const isWithinStartRangeButNotMarketDay = (data, day) => {
  return !isMarketDayWithinData(data, day) && day < getDatasetEndDay(data);
};

const isWithinEndRangeButNotMarketDay = (data, day) => {
  return !isMarketDayWithinData(data, day) && day > getDatasetStartDay(data)
};

// get the next Monday, or if a holiday, Tuesday
export const adjustDayToWeekBeginning = (data, day) => {
  if (isMarketDayWithinData(data, day) && new Date(day).getDay() == 1) {
    return day;
  }
  let failSafe = 0;
  let adjustedDay;

  const mondayOffset = new Date(day).getDay() == 0 ? DAY_IN_MS : (-(new Date(day).getDay() - 8) * DAY_IN_MS);
  adjustedDay = day + mondayOffset;

  // if that Monday is not in dataset, try the next day, Tuesday
  if (!isMarketDayWithinData(data, day)) {
    return adjustedDay += DAY_IN_MS;
  }
  // if Tues is also not a market day, bust out, something is wrong
  if (!isMarketDayWithinData(data, day)) {
    console.error('Tuesday not a market day!?');
  }
  return adjustedDay;
};

export const checkLogicOfDates = (data, startDate, endDate) => {
  if ((startDate || endDate) < getDatasetStartDay(data) || (startDate || endDate) > getDatasetEndDay(data)) {
    console.error("Selected date outside of data set.");
  }
};

// these two functions may be combined and written more elegantly
export const adjustStartToMarketDay = (data, startDate) => {
  if (startDate < getDatasetStartDay(data)) {
    return getDatasetStartDay(data);
  }
  if (startDate > getDatasetEndDay(data)) {
    console.error("Selected start date is greater than last day of data set.")
    return null;
  }
  if (!isMarketDayWithinData(data, startDate)) {
    // return next closest date after the requested startDate
    return getNextClosestMarketDay(data, startDate, true);
  }
  return startDate;
};

export const adjustEndToMarketDay = (data, endDate) => {
  if (endDate > getDatasetEndDay(data)) {
    return getDatasetEndDay(data);
  }
  if (endDate < getDatasetStartDay(data)) {
    console.error("Selected end date is less than first day of data set.")
    return null;
  }
  if (!isMarketDayWithinData(data, endDate)) {
    // return next closest date after the requested startDate
    return getNextClosestMarketDay(data, endDate, false);
  }
  return endDate;
};

const getNextClosestMarketDay = (data, date, ascFlag, forceWeekStart) => {
  // Find next market day without reaching endDate or last day of data
  // (TODO: add check for startDate < endDate. I'm skipping that for now.)
  let newDate = date;
  let failSafe = 0;
  // failsafe will swallow an error, but you'll figure it out.
  if (ascFlag) {
    while (isWithinStartRangeButNotMarketDay(data, newDate) && failSafe < 20) {
      failSafe++;
      newDate = new Date(newDate).getTime() + DAY_IN_MS;
    }
  } else {
    while (isWithinEndRangeButNotMarketDay(data, newDate) && failSafe < 20) {
      failSafe++;
      newDate = new Date(newDate).getTime() - DAY_IN_MS;
    }
  }
  return newDate;
};

export const getFirstMarketDaysOfWeekOverPeriod = (data, startDate, endDate, tradeFrequency) => {
  // dates have been adjusted, so just make sure that it's a Monday is not a holiday
  let days = [];
  let currentDay = startDate;
  if (isMarketDayWithinData(data, currentDay)) {
    days.push(currentDay);
  } else {
    // Assume it is holiday, and push the next day without augmenting
    days.push(currentDay + DAY_IN_MS);
  }

  do {
    currentDay += (DAY_IN_MS * tradeFrequency);
    if (isMarketDayWithinData(data, currentDay)) {
      days.push(currentDay);
    } else {
      // Assume it is holiday, and push the next day without augmenting
      days.push(currentDay + DAY_IN_MS);
    }

  } while ((currentDay + (DAY_IN_MS * tradeFrequency) < endDate));

  return days;
};

// we validate startDate and endDate upstream
export const getDaysTradeFrequencyApart = (data, startDate, endDate, tradeFrequency) => {
  const period = (DAY_IN_MS * tradeFrequency);
  let days = [];
  let currentDay = startDate;
  days.push(getValidMarketDay(data, currentDay, 1));
  while (currentDay + period < endDate) {
    currentDay += period;
    days.push(getValidMarketDay(data, currentDay, 1));
  }
  return days;
};