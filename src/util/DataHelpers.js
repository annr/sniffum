const DAY_IN_MS = 60 * 60 * 24 * 1000;

export const getPrice = (data, day) => {
    return data.get(new Date(day).toDateString());
};
  
// pluck Open price for now.
export const getOpenPriceMap = (items) => {
  // make the more complex imported data into a simple map for lookups.
  const convertedMap = new Map();
  items.forEach(element => {
    const key = element.Date;
    convertedMap.set(key, element.Open);
  });
  return convertedMap;
}

export const getHighPriceMap = (items) => {
  // make the more complex imported data into a simple map for lookups.
  const convertedMap = new Map();

  items.forEach(element => {
    const key = element.Date;
    convertedMap.set(key, element.High);
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
  return newData;
}

// Returns tradeDays
export const getTradeDays = (dataMap, startDate, endDate, tradeFrequency, tradeAtStartOfWeekFlag) => {
  // Reality check to start
  checkValidityOfDates(dataMap, startDate, endDate);

  // tradeFrequency from adjustedStart may not fall on selected endDate
  let adjustedStart = getValidMarketDay(dataMap, startDate, 1);
  let closestValidRangeEnd = getValidMarketDay(dataMap, endDate, -1);

  // Date variables are generally passed around as timestamps not Date objects
  if (tradeAtStartOfWeekFlag) { // override with start of market week
    // if tradeFrequency is not a multiple of 7, we'll have trouble sticking to start of the week
    if (tradeFrequency % 7 !== 0) {
      throw new Error(`tradeFrequency must be a multiple of 7 in order to use tradeAtStartOfWeekFlag.`);
    }
    adjustedStart = adjustDayToWeekBeginning(dataMap, startDate);
  }

  // If tradeAtStartOfWeekFlag=true then most trade days will be Mondays, some Tuesdays.

  return getDaysTradeFrequencyApart(dataMap, adjustedStart, closestValidRangeEnd, tradeFrequency);
};

export const getFirstDataDay = (data) => {
  // Data is a map, and remains ordered, but the dataset MUST BE IN ASC ORDER
  return new Date(data.keys().next().value);
};

export const getLastDataDay = (data) => {
  // Data is a map, and remains ordered, but the dataset MUST BE IN ASC ORDER
  return new Date(Array.from(data.keys()).pop());
};

export const getValidMarketDay = (data, from, directionSwtich) => {
  // We assume startDate will use directionSwtich "1" and endDate will use "-1"
  // This is error-prone and brittle
  let currentDay = from;
  if (isMarketDayWithinData(data, currentDay)) {
    return currentDay;
  }
  // Otherwise search for and return first market day using directionSwitch
  let iterations = 0;
  do {
    // currentDay goes either forwards or backwards.
    //   If going forwards: must be less than last day in data
    //   If going backwards: must be greater than first day in data
    currentDay += (DAY_IN_MS * directionSwtich);

    // Neither of these situations should ever happen:
    if ((directionSwtich > 0) && currentDay > getLastDataDay(data)) {
       console.error(`Ascending (start) date reached end of dataset range`);
    }
    if ((directionSwtich < 0) && currentDay < getFirstDataDay(data)) {
      console.error(`Decending (end) date reached beginning of dataset range`);
    }

    iterations++;
  } while (!isMarketDayWithinData(data, currentDay));

  if(iterations > 1000) {
    console.error(`Requested date far outside of dataset: ${iterations} iterations`)
  }
  return currentDay;
};

const isMarketDayWithinData = (data, day) => {
  return data.has(new Date(day).toDateString());
};

const isWithinStartRangeButNotMarketDay = (data, day) => {
  return !isMarketDayWithinData(data, day) && day < getLastDataDay(data);
};

const isWithinEndRangeButNotMarketDay = (data, day) => {
  return !isMarketDayWithinData(data, day) && day > getFirstDataDay(data)
};

// get the next Monday, or if a holiday, Tuesday
export const adjustDayToWeekBeginning = (data, day) => {

  let adjustedDay = day;

  // passed dates have been adjusted to be in dataset. If it is a Monday, return
  if (new Date(day).getDay() == 1) {
    return day;
  }

  // Otherwise, adjust it to a Monday
  // 0: Sunday
  // 1: Monday
  // 2: Tuesday ..etc.
  const mondayOffset = new Date(adjustedDay).getDay() == 0 ? DAY_IN_MS : (-(new Date(adjustedDay).getDay() - 8) * DAY_IN_MS);
  adjustedDay = day + mondayOffset;

  // if THAT Monday is not in dataset, try the next day, Tuesday
  if (!isMarketDayWithinData(data, adjustedDay)) {
    adjustedDay += DAY_IN_MS;
  }
  // if Tues is also not a market day, bust out, something is wrong
  if (!isMarketDayWithinData(data, adjustedDay)) {
    console.error('Tuesday ALSO not a market day!?');
  }
  return adjustedDay;
};

export const checkValidityOfDates = (data, startDate, endDate) => {
  if ((startDate || endDate) < getFirstDataDay(data) || (startDate || endDate) > getLastDataDay(data)) {
    console.error("Selected date outside of data set.");
  }
};

// these two functions may be combined and written more elegantly
export const adjustStartToMarketDay = (data, startDate) => {
  if (startDate < getFirstDataDay(data)) {
    return getFirstDataDay(data);
  }
  if (startDate > getLastDataDay(data)) {
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
  if (endDate > getLastDataDay(data)) {
    return getLastDataDay(data);
  }
  if (endDate < getFirstDataDay(data)) {
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
  while (currentDay + period <= endDate) {
    currentDay += period;
    days.push(getValidMarketDay(data, currentDay, 1));
  }
  return days;
};