import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Event, useGlobalContext } from "../context/context";
import EventComponent from "./EventComponent";

export const AllDayTaskBox = (props: { pDay: Dayjs }) => {
  const { pDay } = props;

  const [dayEvents, setDayEvents] = useState<Event[]>([]);
  const { filteredEvents } = useGlobalContext();

  useEffect(() => {
    if (filteredEvents === undefined) return;
    const events = filteredEvents.filter(
      (evt) => dayjs(evt.day).format("DD-MM-YY") === pDay.format("DD-MM-YY")
    );
    setDayEvents(events);
  }, [filteredEvents, pDay]);

  return (
    <section className='border-gray-200 border-b flex flex-col rounded-b-lg'>
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
                      return <EventComponent evt={evt} provided={provided} />;
                    }}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </section>
  );
};
