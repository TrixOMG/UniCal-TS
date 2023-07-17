import React from "react";
import { Droppable } from "react-beautiful-dnd";

export const FiveMinuteSegment = () => {
  return (
    <div>
      <Droppable droppableId={pDay.valueOf() + ""}>
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
      </Droppable>
      <div></div>
    </div>
  );
};
