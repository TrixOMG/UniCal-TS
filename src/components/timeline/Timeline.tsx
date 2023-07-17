import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const Timeline = () => {
  //TODO: create FiveMinuteSegment array variable
  const FiveMinuteSegment = {};

  function handleDragEnd({ destination, source, draggableId }) {
    // // если таск дропнули в место куда его нельзя дропнуть
    // if (!destination) return;
    // // если таск дропнули в тот же день где он и был
    // if (
    //   destination.index === source.index &&
    //   destination.droppableId === source.droppableId
    // ) {
    //   return;
    // }
    // let draggedEvent = savedEvents.find(
    //   (evt) => evt.id === parseInt(draggableId)
    // );
    // // если таск дропнули в тот же день, но изменили порядок тасков
    // if (
    //   destination.index !== source.index &&
    //   destination.droppableId === source.droppableId
    // ) {
    //   let copySavedEventsOnThisDay = [...savedEvents].filter((evt) => {
    //     return evt.day === parseInt(source.droppableId);
    //   });
    //   copySavedEventsOnThisDay.forEach((evt) => {
    //     return dispatchCalEvent({ type: "delete", payload: evt });
    //   });
    //   let event = copySavedEventsOnThisDay.filter((evt) => {
    //     return evt.id === parseInt(draggableId);
    //   });
    //   // Remove from prev items array
    //   copySavedEventsOnThisDay = copySavedEventsOnThisDay.filter((evt) => {
    //     return evt.id !== event[0].id;
    //   });
    //   // Adding to new items array location
    //   copySavedEventsOnThisDay.splice(destination.index, 0, event[0]);
    //   // Updating actual values
    //   copySavedEventsOnThisDay.forEach((evt) => {
    //     return dispatchCalEvent({ type: "push", payload: evt });
    //   });
    // }
    // // если таск дропнули в другой день
    // // + тут меняется его индекс внутри дня
    // if (destination.droppableId !== source.droppableId) {
    //   // удалить актуал таск из сурс дня
    //   dispatchCalEvent({ type: "delete", payload: draggedEvent });
    //   // скопировать таски дест дня
    //   let copyDestDayTasks = [...savedEvents].filter((evt) => {
    //     return evt.day === parseInt(destination.droppableId);
    //   });
    //   copyDestDayTasks.forEach((evt) => {
    //     return dispatchCalEvent({ type: "delete", payload: evt });
    //   });
    //   // изменить дату внутри таска на новую (дест)
    //   draggedEvent.day = parseInt(destination.droppableId);
    //   // Adding to new items array location
    //   copyDestDayTasks.splice(destination.index, 0, draggedEvent);
    //   // Updating actual values
    //   copyDestDayTasks.forEach((evt) => {
    //     return dispatchCalEvent({ type: "push", payload: evt });
    //   });
    // }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {/* <Droppable droppableId={pDay.valueOf() + ""}>
        {(provided) => {
          return (
            <div
              className='flex-1 my-1 overflow-y-hidden'
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {dayEvents.map((evt, idx) => {
                return (
                  <Draggable
                    key={evt.id + ""}
                    index={idx}
                    draggableId={evt.id + ""}
                  >
                    {(provided) => {
                      return <Event evt={evt} provided={provided} />;
                    }}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable> */}
    </DragDropContext>
  );
};

export default Timeline;
