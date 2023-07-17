import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useGlobalContext } from "../context/context";
import { getMonth, getProperTimespanInMain } from "../util/util";
import Day from "./Day";

const MainDaysComponent = ({ timeSpan }) => {
  const [properTimespan, setProperTimespan] = useState(
    getMonth(dayjs().month())
  );

  const { selectedDaysArray, savedEvents, dispatchCalEvent } =
    useGlobalContext();

  useEffect(() => {
    if (timeSpan.length > 0)
      setProperTimespan(getProperTimespanInMain(timeSpan));
  }, [timeSpan]);

  function getDaysGridClasses() {
    let rowsClass = "grid-rows-";
    let colsClass = "grid-cols-";

    if (selectedDaysArray.length <= 7) {
      rowsClass += 1;
      colsClass += selectedDaysArray.length;
    } else if (selectedDaysArray.length > 7) {
      rowsClass += selectedDaysArray.length / 7;
      colsClass += 7;
    }

    return rowsClass + " " + colsClass + " ";
  }

  function handleDragEnd({ destination, source, draggableId }) {
    // если таск дропнули в место куда его нельзя дропнуть
    if (!destination) return;

    // если таск дропнули в тот же день где он и был
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }

    let draggedEvent = savedEvents.find(
      (evt) => evt.id === parseInt(draggableId)
    );

    // если таск дропнули в тот же день, но изменили порядок тасков
    if (
      destination.index !== source.index &&
      destination.droppableId === source.droppableId
    ) {
      let copySavedEventsOnThisDay = [...savedEvents].filter((evt) => {
        return evt.day === parseInt(source.droppableId);
      });

      copySavedEventsOnThisDay.forEach((evt) => {
        return dispatchCalEvent({ type: "delete", payload: evt });
      });

      let event = copySavedEventsOnThisDay.filter((evt) => {
        return evt.id === parseInt(draggableId);
      });

      // Remove from prev items array
      copySavedEventsOnThisDay = copySavedEventsOnThisDay.filter((evt) => {
        return evt.id !== event[0].id;
      });

      // Adding to new items array location
      copySavedEventsOnThisDay.splice(destination.index, 0, event[0]);

      // Updating actual values
      copySavedEventsOnThisDay.forEach((evt) => {
        return dispatchCalEvent({ type: "push", payload: evt });
      });
    }

    // если таск дропнули в другой день
    // + тут меняется его индекс внутри дня
    if (destination.droppableId !== source.droppableId) {
      // удалить актуал таск из сурс дня
      dispatchCalEvent({ type: "delete", payload: draggedEvent });

      // скопировать таски дест дня
      let copyDestDayTasks = [...savedEvents].filter((evt) => {
        return evt.day === parseInt(destination.droppableId);
      });

      copyDestDayTasks.forEach((evt) => {
        return dispatchCalEvent({ type: "delete", payload: evt });
      });

      // изменить дату внутри таска на новую (дест)
      draggedEvent.day = parseInt(destination.droppableId);

      // Adding to new items array location
      copyDestDayTasks.splice(destination.index, 0, draggedEvent);

      // Updating actual values
      copyDestDayTasks.forEach((evt) => {
        return dispatchCalEvent({ type: "push", payload: evt });
      });
    }
  }

  return (
    <div className='flex flex-1 max-h-[100%]'>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div
          className={`mx-1 flex-1 grid gap-1 ${
            selectedDaysArray.length > 0
              ? getDaysGridClasses() + " "
              : "grid-cols-7 grid-rows-4 "
          }`}
        >
          {properTimespan.map((row, i) => (
            <React.Fragment key={i}>
              {row.map((day, idx) => (
                <Day pDay={day} key={idx} rowIdx={i} />
              ))}
            </React.Fragment>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default MainDaysComponent;
