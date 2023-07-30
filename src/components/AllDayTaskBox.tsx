import { Dayjs } from "dayjs";
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Event } from "../context/context";
import EventComponent from "./EventComponent";

export const AllDayTaskBox = (props: { pDay: Dayjs; dayEvents: Event[] }) => {
  const { pDay, dayEvents } = props;

  const buttonClasses = "text-sm bg-gray-400 mb-1 mx-1 w-20";

  // Show more: с позиции "показывать 1 таск" - показать 50% тасков, показать все таски
  // всего 3 режима, а кнопки циклируют между ними, more и less по одному шагу,
  // all сразу показывает всё

  return (
    <section className='border-gray-200 border-b flex flex-col rounded-b-lg bg-white'>
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
              <section className='w-full px-1 flex justify-center'>
                <button className='text-sm bg-gray-400 mb-1 mx-1'>
                  0 more tasks
                </button>
              </section>
              <section className='flex px-1 w-full justify-around'>
                <button className={`${buttonClasses}`}>Show more</button>
                <button className={`${buttonClasses}`}>Show all</button>
                <button className={`${buttonClasses}`}>Show less</button>
              </section>
            </div>
          );
        }}
      </Droppable>
    </section>
  );
};
