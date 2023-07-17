import dayjs from "dayjs";
import React from "react";
import { useGlobalContext } from "../context/context";
import { getMonth, getProperSelectedDays } from "../util/util";
import { Icon } from "./common/Icon";

const Navbar = () => {
  const {
    showSidebar,
    setShowSidebar,
    selectedDaysArray,
    setSelectedDaysArray,
    monthIndex,
    setMonthIndex,
    setChosenDay,
  } = useGlobalContext();

  function handleNextTimespanChange() {
    let lastDayOfTheArray = selectedDaysArray[selectedDaysArray.length - 1];
    let newFirstDay = dayjs(
      new Date(
        lastDayOfTheArray.year(),
        lastDayOfTheArray.month(),
        lastDayOfTheArray.date() + 1
      )
    );

    // change single chosen day on first day of the array
    setChosenDay(newFirstDay);

    return getProperSelectedDays(newFirstDay, selectedDaysArray.length);
  }

  function handlePrevTimespanChange() {
    let firstDayOfTheArray = selectedDaysArray[0];
    let newFirstDay = dayjs(
      new Date(
        firstDayOfTheArray.year(),
        firstDayOfTheArray.month(),
        firstDayOfTheArray.date() - selectedDaysArray.length
      )
    );
    // change single chosen day on first day of the array
    setChosenDay(newFirstDay);

    return getProperSelectedDays(newFirstDay, selectedDaysArray.length);
  }

  function handleResetToday() {
    setSelectedDaysArray(
      getProperSelectedDays(dayjs(), selectedDaysArray.length)
    );
    setChosenDay(dayjs());
    setMonthIndex(dayjs().month() + 1 + Math.random());
  }

  function handleMonthIndexChangeOnSelectedDays(isNext) {
    let pCurrentMonth = getMonth(monthIndex);
    const oneLevelCurrentMonthArray = [];

    pCurrentMonth.map((week) => {
      return week.map((day) => {
        return oneLevelCurrentMonthArray.push(day.format("DD-MM-YY"));
      });
    });

    let pSelDaysArray = [];

    if (isNext) pSelDaysArray = handleNextTimespanChange(selectedDaysArray);
    else pSelDaysArray = handlePrevTimespanChange(selectedDaysArray);
    // middle day of the selectedDays array
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
      if (isNext) setMonthIndex(monthIndex + 1);
      else setMonthIndex(monthIndex - 1);
    }
  }

  function renderMonthAndYear() {
    const monthOfTheFirstDay = selectedDaysArray[0].month();
    const yearOfTheFirstDay = selectedDaysArray[0].year();
    if (
      selectedDaysArray[selectedDaysArray.length - 1].month() ===
        monthOfTheFirstDay &&
      selectedDaysArray[selectedDaysArray.length - 1].year() ===
        yearOfTheFirstDay
    ) {
      return selectedDaysArray[0].format("MMMM YYYY");
    } else if (
      selectedDaysArray[selectedDaysArray.length - 1].month() !==
        monthOfTheFirstDay &&
      selectedDaysArray[selectedDaysArray.length - 1].year() ===
        yearOfTheFirstDay
    ) {
      return (
        selectedDaysArray[0].format("MMMM") +
        " - " +
        selectedDaysArray[selectedDaysArray.length - 1].format("MMMM YYYY")
      );
    } else {
      return (
        selectedDaysArray[0].format("MMMM YYYY") +
        " - " +
        selectedDaysArray[selectedDaysArray.length - 1].format("MMMM YYYY")
      );
    }
  }

  return (
    <header className='px-4 py-2 flex items-center align-middle border rounded-lg rounded-t-none mx-1 h-[10%]'>
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className='w-8 h-8 cursor-pointer p-1'
      >
        <Icon type={"menu"} />
      </button>
      <div className='UniCal_Logo mr-1 w-12 h-12'></div>
      <h1 className='mr-10 text-xl text-gray-500 font-bold'>UniCal</h1>
      <button
        className='border rounded py-2 px-4 mr-5'
        onClick={handleResetToday}
      >
        Today
      </button>
      <button
        className='p-1 cursor-pointer w-8 h-8 block'
        onClick={() => {
          setSelectedDaysArray(handlePrevTimespanChange());
          handleMonthIndexChangeOnSelectedDays(false);
        }}
      >
        <Icon type={"chevron_left"} />
      </button>
      <button
        className='p-1 cursor-pointer w-8 h-8 block'
        onClick={() => {
          setSelectedDaysArray(handleNextTimespanChange());
          handleMonthIndexChangeOnSelectedDays(true);
        }}
      >
        <Icon type={"chevron_right"} />
      </button>
      <h2 className=' ml-4 text-xl text-gray-500 font-bold'>
        {renderMonthAndYear()}
      </h2>
    </header>
  );
};

export default Navbar;
