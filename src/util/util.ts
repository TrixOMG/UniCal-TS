import { useGlobalContext } from "../context/context";

// global variables
const dayjs = require("dayjs");

// const currentYear = dayjs().year();
// const currentMonth = dayjs().month(); //отсчёт от 0
// const currentDay = dayjs().date();

// experiments with comments
//console.log(dayjs().date()); - выдаёт номер дня в месяце (09.01.23 => 9)
// console.log(dayjs().daysInMonth()); - выдаёт количество дней в текущем месяце
// console.log(
// 	currentYear + "-" + currentMonth + "-" + currentDay
// );

// пытаюсь сделать функцию, выдающую 5 дней, при этом "сегодня" находится посередине
// сделать так, чтобы юзер сам мог выбрать день (pSelectedDay)
// export function getFiveDays(pSelectedDay) {
// let resultFiveDays = [];
// for (let i = -2; i < 3; i++) {
// let date = new Date();
// resultFiveDays.push(date.setDate(pSelectedDay.getDate() + i));
// }
// return resultFiveDays;
// }

export function getMonth(month = dayjs().month()) {
  month = Math.floor(month) - 1;
  const year = dayjs().year();

  const firstDayOfTheMonth =
    dayjs(new Date(year, month, 1)).day() === 0
      ? 7
      : dayjs(new Date(year, month, 1)).day();

  let currentMonthCount = 1 - firstDayOfTheMonth;

  const daysMatrix = new Array(6).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      currentMonthCount++;
      return dayjs(new Date(year, month, currentMonthCount));
    });
  });

  return daysMatrix;
}

export function getProperSelectedDays(pSelDaysArray, pDaysArrayLength) {
  let daysMatrix = [];
  let index = -1;

  // действия в случае когда юзер просто хочет поменять начало временного промежутка (первый день)
  if (pDaysArrayLength) {
    if (pDaysArrayLength > 7) {
      if (pSelDaysArray.day() === 0) {
        pSelDaysArray = dayjs(
          new Date(
            pSelDaysArray.year(),
            pSelDaysArray.month(),
            pSelDaysArray.date() - 6
          )
        );
      } else {
        pSelDaysArray = dayjs(
          new Date(
            pSelDaysArray.year(),
            pSelDaysArray.month(),
            pSelDaysArray.date() - (pSelDaysArray.day() - 1)
          )
        );
      }
    }
    daysMatrix = Array(pDaysArrayLength)
      .fill([])
      .map(() => {
        index++;
        return dayjs(
          new Date(
            pSelDaysArray.year(),
            pSelDaysArray.month(),
            pSelDaysArray.date() + index
          )
        );
      });
    // console.log(daysMatrix);
    return daysMatrix;
  }
  // запомнить здесь первый день и возвращать массив в том порядке, в каком выбрал пользователь
  // то есть он может быть и в обратном порядке(не в хронологическом), т.к. сейчас нам это не важно
  // при этом выбранный пользователем день будет всегда первым в массиве

  let firstDayOfTheArray = pSelDaysArray[0];

  let setOfDays = new Set(pSelDaysArray);
  let daysArray = [...setOfDays];

  // let sortedDays = [...setOfDays].sort((a, b) => {
  // return dayjs(a).isAfter(dayjs(b)) ? 1 : -1;
  // });

  let lastDay = daysArray[daysArray.length - 1];

  // промежуток между первым и последним днём, нужнен для определения скольки дней возвращать
  let timespanLength = firstDayOfTheArray.isBefore(lastDay)
    ? lastDay.diff(firstDayOfTheArray, "day") + 1
    : firstDayOfTheArray.diff(lastDay, "day") + 1;

  if (timespanLength <= 7) {
  } else if (timespanLength > 7 && timespanLength <= 14) {
    timespanLength = 14;
  } else if (timespanLength > 14 && timespanLength <= 21) {
    timespanLength = 21;
  } else if (timespanLength > 21 && timespanLength <= 28) {
    timespanLength = 28;
  } else if (timespanLength > 28) {
    timespanLength = 28;
  }

  // переопределение первого дня выделенных дней на пн или вс
  if (timespanLength > 7 && firstDayOfTheArray.isBefore(lastDay)) {
    if (firstDayOfTheArray.day() === 0) {
      firstDayOfTheArray = dayjs(
        new Date(
          firstDayOfTheArray.year(),
          firstDayOfTheArray.month(),
          firstDayOfTheArray.date() - 6
        )
      );
    } else {
      firstDayOfTheArray = dayjs(
        new Date(
          firstDayOfTheArray.year(),
          firstDayOfTheArray.month(),
          firstDayOfTheArray.date() - (firstDayOfTheArray.day() - 1)
        )
      );
    }
  } else if (timespanLength > 7 && firstDayOfTheArray.isAfter(lastDay)) {
    // 1 2 3 4 5 6 0
    if (firstDayOfTheArray.day() !== 0) {
      firstDayOfTheArray = dayjs(
        new Date(
          firstDayOfTheArray.year(),
          firstDayOfTheArray.month(),
          firstDayOfTheArray.date() - firstDayOfTheArray.day() + 7
        )
      );
    }
  }

  daysMatrix = Array(timespanLength)
    .fill([])
    .map(() => {
      index++;
      if (firstDayOfTheArray.isBefore(lastDay)) {
        return dayjs(
          new Date(
            firstDayOfTheArray.year(),
            firstDayOfTheArray.month(),
            firstDayOfTheArray.date() + index
          )
        );
      } else {
        return dayjs(
          new Date(
            firstDayOfTheArray.year(),
            firstDayOfTheArray.month(),
            firstDayOfTheArray.date() - index
          )
        );
      }
    });
  // daysMatrix = Array(timespanLength)
  // 	.fill([])
  // 	.map(() => {
  // 		index++;
  // 		if (firstDayOfTheArray.isBefore(lastDay)) {
  // 			// переопределение первого дня промежутка на понедельник (т.к. прямой порядок)
  // 			if (firstDayOfTheArray.day() === 0) {
  // 				firstDayOfTheArray = dayjs(
  // 					new Date(
  // 						firstDayOfTheArray.year(),
  // 						firstDayOfTheArray.month(),
  // 						firstDayOfTheArray.date() - 6
  // 					)
  // 				);
  // 			} else {
  // 				firstDayOfTheArray = dayjs(
  // 					new Date(
  // 						firstDayOfTheArray.year(),
  // 						firstDayOfTheArray.month(),
  // 						firstDayOfTheArray.date() - (firstDayOfTheArray.day() - 1)
  // 					)
  // 				);
  // 			}

  // 			return dayjs(
  // 				new Date(
  // 					firstDayOfTheArray.year(),
  // 					firstDayOfTheArray.month(),
  // 					firstDayOfTheArray.date() + index
  // 				)
  // 			);
  // 		} else {
  // 			// переопределение первого дня промежутка на воскресенье (т.к. обратный порядок)
  // 			// dayjs().day()
  // 			firstDayOfTheArray = dayjs(
  // 				new Date(
  // 					firstDayOfTheArray.year(),
  // 					firstDayOfTheArray.month(),
  // 					firstDayOfTheArray.date() + 6
  // 				)
  // 			);

  // 			// if (firstDayOfTheArray.day() === 0) {
  // 			// 	firstDayOfTheArray = dayjs(
  // 			// 		new Date(
  // 			// 			firstDayOfTheArray.year(),
  // 			// 			firstDayOfTheArray.month(),
  // 			// 			firstDayOfTheArray.date() - 6
  // 			// 		)
  // 			// 	);
  // 			// } else {
  // 			// 	firstDayOfTheArray = dayjs(
  // 			// 		new Date(
  // 			// 			firstDayOfTheArray.year(),
  // 			// 			firstDayOfTheArray.month(),
  // 			// 			firstDayOfTheArray.date() - (firstDayOfTheArray.day() - 1)
  // 			// 		)
  // 			// 	);
  // 			// }
  // 			return dayjs(
  // 				new Date(
  // 					firstDayOfTheArray.year(),
  // 					firstDayOfTheArray.month(),
  // 					firstDayOfTheArray.date() - index
  // 				)
  // 			);
  // 		}
  // 	});
  // }

  return daysMatrix;
}

export function getProperTimespanInMain(pTimespan) {
  pTimespan = [...pTimespan].sort((a, b) => {
    return dayjs(a).isAfter(dayjs(b)) ? 1 : -1;
  });

  let rows = 0;
  let cols = 7;

  if (pTimespan.length <= 7) {
    rows = 1;
    cols = pTimespan.length;
  } else if (pTimespan.length > 7) {
    rows = pTimespan.length / 7;
  }

  let index = -1;
  const daysMatrix = new Array(rows).fill([]).map(() => {
    return new Array(cols).fill(null).map(() => {
      index++;
      return pTimespan[index];
    });
  });

  // console.log(daysMatrix);

  return daysMatrix;
}



//
//
//

// export function oldGetFiveDays(pSelectedDay) {
// 	// let resultFiveDays = [];

// 	let today = dayjs().date();
// 	// первый и последний день в очереди (сегодня находится посередине)
// 	let firstDay = 0;
// 	let secondDay = 0;
// 	let forthDay = 0;
// 	let lastDay = 0;

// 	let nextMonth = currentMonth + 1;
// 	let prevMonth = currentMonth - 1;
// 	let nextYear = currentYear + 1;
// 	let prevYear = currentYear - 1;

// 	console.log("currentMonth", currentMonth);

// 	if (currentMonth - 1 === -1) {
// 		prevMonth = 12;
// 	}
// 	if (currentMonth + 1 === 12) {
// 		nextMonth = 1;
// 	}

// 	let nextMonthFullDate = new Date(
// 		currentYear,
// 		nextMonth,
// 		currentDay
// 	);
// 	console.log("nextM", dayjs(nextMonthFullDate).format());
// 	let prevMonthFullDate = new Date(
// 		currentYear,
// 		prevMonth,
// 		currentDay
// 	);
// 	console.log("prevM", dayjs(prevMonthFullDate).format());
// 	// получить дальнее число месяца, вычтенное из сегодняшнего дня (9-2=7)
// 	// проблема: нельзя вычесть из малых чисел - продумать как всё будет залезать на другие месяцы
// 	if (today - 2 <= 0) {
// 		//  узнать сколько дней нужно взять из предыдущего месяца
// 		let subtractedDays = today - 2;
// 		if (subtractedDays === 0) {
// 			firstDay = dayjs().daysInMonth(prevMonthFullDate);
// 			console.log(firstDay);
// 		} else if (subtractedDays === -1) {
// 		} else if (subtractedDays === -2) {
// 		}
// 		firstDay = 0.0;
// 		secondDay = 0.0;
// 	} else {
// 		firstDay = today - 2;
// 		secondDay = today - 1;
// 	}
// 	// >= или > ???
// 	if (today + 2 > dayjs().daysInMonth()) {
// 	} else {
// 		forthDay = today + 1;
// 		lastDay = today + 2;
// 	}

// 	// resultFiveDays = [firstDay, firstDay+1, today]
// 	// return
// }
