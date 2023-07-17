import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../context/context";
import { AllDayTaskBox } from "./AllDayTaskBox";
import Timeline from "./timeline/Timeline";

const Day = ({ pDay, rowIdx }) => {
  const {
    setSelectedEvent,
    changeShowEventModal,
    setChosenDayForTask,
    setReferenceElement,
    showFakeTask,
    setShowFakeTask,
    chosenDayForTask,
    setSelectedDaysArray,
    setChosenDay,
  } = useGlobalContext();

  function getAccentOnToday() {
    if (dayjs(pDay).format("DD-MM-YY") === dayjs().format("DD-MM-YY")) {
      return "bg-blue-600 text-white rounded-lg hover:bg-blue-300";
    } else {
      return "bg-gray-400 rounded-lg hover:bg-gray-200";
    }
  }

  const newTaskReference = useRef(null);

  function handleAddEventClick() {
    setSelectedEvent(null);
    setChosenDayForTask(pDay);
    setReferenceElement(newTaskReference.current);
    changeShowEventModal(true);
    setShowFakeTask(true);
  }

  return (
    <div className='border border-gray-200 flex flex-col rounded-lg'>
      <header
        className='flex flex-col items-center bg-gray-300 rounded-t-lg pb-1 cursor-pointer'
        onClick={() => handleAddEventClick()}
      >
        {rowIdx === 0 && (
          <p className='text-sm mt-1'>
            {dayjs(pDay).format("ddd").toUpperCase()}
          </p>
        )}
        <p
          className={`text-sm w-7 h-7 text-center p-[0.2em] ${getAccentOnToday()}`}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedDaysArray([pDay]);
            setChosenDay(pDay);
          }}
        >
          {dayjs(pDay).date()}
        </p>
      </header>
      <div
        className={`${
          pDay === chosenDayForTask && showFakeTask
            ? "display-block visible"
            : "absolute invisible"
        } mt-1 mx-1 text-white text-sm rounded-lg flex flex-row justify-between border-gray-300 border-2 p-[0.15em] unselectable`}
        ref={newTaskReference}
      >
        /
      </div>
      <AllDayTaskBox pDay={pDay} />
      {/* <Timeline /> */}
    </div>
  );
};

export default Day;
