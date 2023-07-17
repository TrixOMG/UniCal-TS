import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/context";
import { getMonth, getProperSelectedDays } from "../util/util";

const Calendar = () => {
  // глобальный индекс месяца
  const { monthIndex, setMonthIndex } = useGlobalContext();
  const { selectedDaysArray, setSelectedDaysArray } = useGlobalContext();

  // месяц для отображения
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  // единичный выбранный день для сброса длины массива выделенных дней
  const { chosenDay, setChosenDay } = useGlobalContext();
  // трекинг зажатой клавиши мыши для определения дней
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  function handleMonthIndexChangeOnSelectedDays() {
    let pCurrentMonth = getMonth(monthIndex);
    const oneLevelCurrentMonthArray = [];

    pCurrentMonth.map((week) => {
      return week.map((day) => {
        return oneLevelCurrentMonthArray.push(day.format("DD-MM-YY"));
      });
    });

    let pSelDaysArray = [];
    pSelDaysArray = selectedDaysArray;
    let middleDayIndex = 0;

    if (pSelDaysArray.length % 2 === 0)
      middleDayIndex = pSelDaysArray.length / 2 - 1;
    else middleDayIndex = Math.floor(pSelDaysArray.length / 2);

    if (
      !oneLevelCurrentMonthArray.includes(
        pSelDaysArray[middleDayIndex].format("DD-MM-YY")
      ) ||
      !oneLevelCurrentMonthArray.includes(pSelDaysArray[0].format("DD-MM-YY"))
    ) {
      setMonthIndex(monthIndex + 1);
    }
  }

  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }

  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }

  function getTodayClass(day) {
    const sFormat = "DD-MM-YY";
    const today = dayjs().format(sFormat);
    const currDay = day.format(sFormat);

    if (today === currDay) {
      return "bg-blue-500 rounded-lg text-white p-1";
    } else {
      return "";
    }
  }

  function getChosenDayClass(day) {
    const sFormat = "DD-MM-YY";

    if (day.format(sFormat) === dayjs().format(sFormat)) return "";

    if (day.format(sFormat) === chosenDay.format(sFormat)) {
      if (day.format(sFormat) === selectedDaysArray[0].format(sFormat)) {
        if (selectedDaysArray.length === 1) return " bg-blue-400 rounded-lg";
        else return " bg-blue-400 rounded-l-lg ";
      } else if (
        day.format(sFormat) ===
        selectedDaysArray[selectedDaysArray.length - 1].format(sFormat)
      ) {
        return " bg-blue-400 rounded-r-lg ";
      } else {
        return " bg-blue-400 rounded-lg ";
      }
    } else {
      return "";
    }
  }

  function getSelectedDaysClass(pDay) {
    const sFormat = "DD-MM-YY";
    const pSelDaysArray =
      selectedDaysArray &&
      selectedDaysArray.map((a) => {
        return a.format(sFormat);
      });

    if (
      pSelDaysArray.length === 1 &&
      pSelDaysArray.includes(pDay.format(sFormat))
    )
      return "bg-blue-300 rounded-lg";
    else if (pSelDaysArray.includes(pDay.format(sFormat))) {
      // style for the first day in the selected days
      if (
        pSelDaysArray &&
        pDay.format(sFormat) === pSelDaysArray[0] &&
        selectedDaysArray[0].isBefore(
          selectedDaysArray[selectedDaysArray.length - 1]
        )
      )
        return "bg-blue-200 rounded-l-lg";
      else if (pSelDaysArray && pDay.format(sFormat) === pSelDaysArray[0]) {
        return "bg-blue-200 rounded-r-lg";
      }
      // style for the last day in the selected days
      else if (
        pSelDaysArray &&
        pDay.format(sFormat) === pSelDaysArray[pSelDaysArray.length - 1] &&
        selectedDaysArray[0].isBefore(
          selectedDaysArray[selectedDaysArray.length - 1]
        )
      )
        return "bg-blue-200 rounded-r-lg";
      else if (
        pSelDaysArray &&
        pDay.format(sFormat) === pSelDaysArray[pSelDaysArray.length - 1]
      ) {
        return "bg-blue-200 rounded-l-lg";
      }
      // style for every other day in the selected days
      else return "bg-blue-200 rounded-none";
    }
  }

  function handleChangeSelectedDays(pDay) {
    if (isMouseDown) {
      const convertedSelDArr =
        selectedDaysArray &&
        selectedDaysArray.map((day) => {
          return day.format("DD-MM-YY");
        });

      let res = [];

      if (convertedSelDArr.includes(pDay.format("DD-MM-YY"))) {
        res = selectedDaysArray.slice(0, selectedDaysArray.indexOf(pDay));
        res = selectedDaysArray.concat(pDay);
      } else {
        res = selectedDaysArray.concat(pDay);
      }

      setSelectedDaysArray(getProperSelectedDays(res));
    }
  }

  // TODO: работает нормально, но нужен рефакторинг
  function handleChangeFirstDay(pDay, DaysArrayLength) {
    if (DaysArrayLength <= 1) {
      setSelectedDaysArray([].concat(pDay));
      setChosenDay(pDay);
    } else if (DaysArrayLength > 7) {
      if (pDay.format("DD-MM-YY") === chosenDay.format("DD-MM-YY")) {
        setSelectedDaysArray([].concat(chosenDay));
      } else {
        setChosenDay(pDay);
        setSelectedDaysArray(getProperSelectedDays(pDay, DaysArrayLength));
      }
    } else if (DaysArrayLength <= 7) {
      if (pDay.format("DD-MM-YY") === chosenDay.format("DD-MM-YY")) {
        setSelectedDaysArray([].concat(pDay));
        setChosenDay(pDay);
      } else {
        setChosenDay(pDay);
        setSelectedDaysArray(getProperSelectedDays(pDay, DaysArrayLength));
      }
    }
  }

  function handleChronologicalSelectedDays() {
    const chronologicalSelectedDays = selectedDaysArray.sort((a, b) => {
      return a.isAfter(b) ? 1 : -1;
    });

    setSelectedDaysArray(chronologicalSelectedDays);
  }

  return (
    <div className='mt-9'>
      <header className='flex justify-between'>
        <p className='text-gray-500 font-bold'>
          {dayjs(new Date(dayjs().year(), monthIndex - 1)).format("MMMM YYYY")}
        </p>
        <div>
          <button onClick={handlePrevMonth}>
            <span className='material-icons cursor-pointer text-gray-600 mx-2'>
              chevron_left
            </span>
          </button>
          <button onClick={handleNextMonth}>
            <span className='material-icons cursor-pointer text-gray-600 mx-2'>
              chevron_right
            </span>
          </button>
        </div>
      </header>
      <div
        className='grid grid-cols-7 grid-rows-6 px-1 w-full gap-y-[0.25rem]'
        onMouseLeave={() => setIsMouseDown(false)}
      >
        {currentMonth[0].map((day, i) => (
          <span key={i} className='text-sm py-0.5 text-center'>
            {day.format("dd").charAt(0)}
          </span>
        ))}
        {currentMonth.map((row, i) => (
          <React.Fragment key={i}>
            {row.map((day, idx) => (
              <button
                key={idx}
                className={`w-full ${getSelectedDaysClass(day)}  `}
                onMouseDown={() => {
                  setIsMouseDown(true);
                  handleChangeFirstDay(day, selectedDaysArray.length);
                }}
                onMouseEnter={() => handleChangeSelectedDays(day)}
                onMouseUp={() => {
                  setIsMouseDown(false);
                  handleChronologicalSelectedDays();
                  handleMonthIndexChangeOnSelectedDays();
                }}
              >
                <div
                  className={`text-sm ${getTodayClass(day)} ${getChosenDayClass(
                    day
                  )} hover:bg-blue-300 hover:rounded-lg p-1`}
                >
                  {day.format("D")}
                </div>
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
