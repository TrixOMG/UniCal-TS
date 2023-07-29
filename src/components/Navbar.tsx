import dayjs from "dayjs";
import React from "react";
import { useGlobalContext } from "../context/context";
import { getMonth, getProperSelectedDays } from "../util/util";
// import { Icon } from "./common/Icon";
import { TfiAngleLeft, TfiAngleRight, TfiMenu } from "react-icons/tfi";

const Navbar = () => {
  const {
    showSidebar,
    // setShowSidebar,
    toggleShowSidebar,
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

    return getProperSelectedDays([newFirstDay], selectedDaysArray.length);
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

    return getProperSelectedDays([newFirstDay], selectedDaysArray.length);
  }

  function handleResetToday() {
    setSelectedDaysArray(
      getProperSelectedDays([dayjs()], selectedDaysArray.length)
    );
    setChosenDay(dayjs());
    setMonthIndex(dayjs().month() + 1 + Math.random());
  }

  function handleMonthIndexChangeOnSelectedDays(isNext: boolean) {
    let pCurrentMonth = getMonth(monthIndex);
    const oneLevelCurrentMonthArray: string[] = [];

    pCurrentMonth.map((week) => {
      return week.map((day) => {
        return oneLevelCurrentMonthArray.push(day.format("DD-MM-YY"));
      });
    });

    let pSelDaysArray = [];

    if (isNext) pSelDaysArray = handleNextTimespanChange();
    else pSelDaysArray = handlePrevTimespanChange();
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
    if (!selectedDaysArray.length) return;

    let copySelectedDaysArray = selectedDaysArray.map((day) => {
      return dayjs(day);
    });

    const monthOfTheFirstDay = copySelectedDaysArray[0].month();
    const yearOfTheFirstDay = copySelectedDaysArray[0].year();
    if (
      copySelectedDaysArray[copySelectedDaysArray.length - 1].month() ===
        monthOfTheFirstDay &&
      copySelectedDaysArray[copySelectedDaysArray.length - 1].year() ===
        yearOfTheFirstDay
    ) {
      return copySelectedDaysArray[0].format("MMMM YYYY");
    } else if (
      copySelectedDaysArray[copySelectedDaysArray.length - 1].month() !==
        monthOfTheFirstDay &&
      copySelectedDaysArray[copySelectedDaysArray.length - 1].year() ===
        yearOfTheFirstDay
    ) {
      return (
        copySelectedDaysArray[0].format("MMMM") +
        " - " +
        copySelectedDaysArray[selectedDaysArray.length - 1].format("MMMM YYYY")
      );
    } else {
      return (
        copySelectedDaysArray[0].format("MMMM YYYY") +
        " - " +
        copySelectedDaysArray[selectedDaysArray.length - 1].format("MMMM YYYY")
      );
    }
  }

  function handleClickShow(e: any) {
    e.preventDefault();
    toggleShowSidebar(showSidebar);
  }

  return (
    <header className='px-4 py-2 flex items-center align-middle border rounded-lg rounded-t-none mx-1 h-[10%]'>
      <button onClick={handleClickShow} className='w-8 h-8 cursor-pointer p-1'>
        <TfiMenu className='font-bold' />
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
        <TfiAngleLeft className='font-black' />
      </button>
      <button
        className='p-1 cursor-pointer w-8 h-8 block'
        onClick={() => {
          setSelectedDaysArray(handleNextTimespanChange());
          handleMonthIndexChangeOnSelectedDays(true);
        }}
      >
        <TfiAngleRight />
      </button>
      <h2 className=' ml-4 text-xl text-gray-500 font-bold'>
        {renderMonthAndYear()}
      </h2>
    </header>
  );
};

export default Navbar;
