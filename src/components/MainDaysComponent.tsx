import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useGlobalContext } from "../context/context";
import { getMonth, getProperTimespanInMain } from "../util/util";
import Day from "./Day";

const MainDaysComponent = () => {
  const [properTimespan, setProperTimespan] = useState(
    getMonth(dayjs().month())
  );

  const {
    selectedDaysArray,
    savedEvents,
    dispatchCalEvent,
    // editEvent,
    // addEvent,
    // deleteEvent,
  } = useGlobalContext();

  useEffect(() => {
    if (selectedDaysArray.length > 0)
      setProperTimespan(getProperTimespanInMain(selectedDaysArray));
  }, [selectedDaysArray]);

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

  // interface DragResult {
  //   destination: DraggableLocation;
  //   source: DraggableLocation;
  //   draggableId: DraggableId;
  // }

  // { destination, source, draggableId }
  // // TODO: Make this function work based on index of the task in a day
  // const onDragEnd = (result: any) => {
  //   // если таск дропнули в место куда его нельзя дропнуть
  //   if (!result.destination) return;

  //   // если таск дропнули в тот же день где он и был
  //   if (
  //     result.destination.index === result.source.index &&
  //     result.destination.droppableId === result.source.droppableId
  //   ) {
  //     return;
  //   }

  //   // let draggedEvent = savedEvents.find(
  //   //   (evt) => evt.id === parseInt(result.draggableId)
  //   // );

  //   // если таск дропнули в тот же день, но изменили порядок тасков
  //   if (
  //     result.destination.index !== result.source.index &&
  //     result.destination.droppableId === result.source.droppableId
  //   ) {
  //     let copySavedEventsOnThisDay = savedEvents.filter((evt) => {
  //       return evt.day === parseInt(result.source.droppableId);
  //     });
  //     console.log(copySavedEventsOnThisDay);

  //     // copySavedEventsOnThisDay.forEach((evt) =>
  //     //   // return dispatchCalEvent({ type: "delete", payload: evt });
  //     //   deleteEvent(evt.id)
  //     // );

  //     for (let i = 0; i < copySavedEventsOnThisDay.length; i++) {
  //       deleteEvent(copySavedEventsOnThisDay[i].id);
  //     }

  //     console.log(savedEvents);

  //     let event = copySavedEventsOnThisDay.filter((evt) => {
  //       return evt.id === parseInt(result.draggableId);
  //     });
  //     // console.log(event[0]);

  //     // Remove from prev items array
  //     // let newCopySavedEventsOnThisDay = copySavedEventsOnThisDay.map(
  //     // (evt) => evt.id !== event[0].id
  //     // );
  //     let newCopySavedEventsOnThisDay = [];

  //     for (let i = 0; i < copySavedEventsOnThisDay.length; i++) {
  //       if (copySavedEventsOnThisDay[i].id === event[0].id) continue;
  //       else newCopySavedEventsOnThisDay.push(copySavedEventsOnThisDay[i]);
  //     }
  //     // console.log(newCopySavedEventsOnThisDay);

  //     // Adding to new items array location
  //     newCopySavedEventsOnThisDay.splice(result.destination.index, 0, event[0]);

  //     // console.log(newCopySavedEventsOnThisDay);

  //     // Updating actual values
  //     newCopySavedEventsOnThisDay.forEach((evt) => {
  //       return addEvent(evt);
  //       // return dispatchCalEvent({ type: "push", payload: evt });
  //     });
  //   }
  // };

  const onDragEnd = (result: any) => {
    // если таск дропнули в место куда его нельзя дропнуть
    if (!result.destination) return;

    // если таск дропнули в тот же день где он и был
    if (
      result.destination.index === result.source.index &&
      result.destination.droppableId === result.source.droppableId
    ) {
      return;
    }

    let draggedEvent = savedEvents.find(
      (evt) => evt.id === parseInt(result.draggableId)
    );

    // если таск дропнули в тот же день, но изменили порядок тасков
    if (
      result.destination.index !== result.source.index &&
      result.destination.droppableId === result.source.droppableId
    ) {
      let copySavedEventsOnThisDay = [...savedEvents].filter((evt) => {
        return evt.day === parseInt(result.source.droppableId);
      });

      copySavedEventsOnThisDay.forEach((evt) => {
        return dispatchCalEvent({ type: "delete", payload: evt });
        // return deleteEvent(evt.id);
      });

      let event = copySavedEventsOnThisDay.filter((evt) => {
        return evt.id === parseInt(result.draggableId);
      });

      // Remove from prev items array
      copySavedEventsOnThisDay = copySavedEventsOnThisDay.filter((evt) => {
        return evt.id !== event[0].id;
      });

      // Adding to new items array location
      copySavedEventsOnThisDay.splice(result.destination.index, 0, event[0]);

      // Updating actual values
      copySavedEventsOnThisDay.forEach((evt) => {
        // return addEvent(evt);
        return dispatchCalEvent({ type: "push", payload: evt });
      });
    }

    // если таск дропнули в другой день
    // + тут меняется его индекс внутри дня
    if (result.destination.droppableId !== result.source.droppableId) {
      // удалить актуал таск из сурс дня
      if (draggedEvent === undefined) return;

      dispatchCalEvent({ type: "delete", payload: draggedEvent });
      // deleteEvent(draggedEvent.id);

      // скопировать таски дест дня
      if (result.destination === undefined) return;
      let copyDestDayTasks = [...savedEvents].filter((evt) => {
        return evt.day === parseInt(result.destination.droppableId);
      });

      copyDestDayTasks.forEach((evt) => {
        return dispatchCalEvent({ type: "delete", payload: evt });
        // return deleteEvent(evt.id);
      });

      // изменить дату внутри таска на новую (дест)
      draggedEvent.day = parseInt(result.destination.droppableId);

      // Adding to new items array location
      copyDestDayTasks.splice(result.destination.index, 0, draggedEvent);

      // Updating actual values
      copyDestDayTasks.forEach((evt) => {
        return dispatchCalEvent({ type: "push", payload: evt });
        // return addEvent(evt);
      });
    }
  };

  return (
    <div className='flex flex-1 max-h-[100%]'>
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          className={`mx-1 flex-1 grid gap-1 
            ${
              selectedDaysArray?.length > 0
                ? getDaysGridClasses()
                : "grid-cols-7 grid-rows-4 "
            }
          }
        `}
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
