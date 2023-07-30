import { Dayjs } from "dayjs";
import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { CgChevronDown, CgChevronUp, CgPushChevronDown } from "react-icons/cg";
import { Event } from "../context/context";
import EventComponent from "./EventComponent";

export const AllDayTaskBox = (props: { pDay: Dayjs; dayEvents: Event[] }) => {
  const { pDay, dayEvents } = props;

  const buttonClasses = "text-lg bg-gray-400 mb-1 w-full flex justify-center";

  const [boxHeight, setBoxHeight] = useState<string | undefined>(undefined);

  const handleShowMore = () => {
    console.log("showMore");
    setBoxHeight("20em");
  };

  const handleShowLess = () => {};

  const handleShowAll = () => {};
  // всего 3 режима, а кнопки циклируют между ними, more и less по одному шагу,
  // all сразу показывает всё
  // Show more: с позиции "показывать 1 таск" - показать 50% тасков, показать все таски

  return (
    <section className='border-gray-200 border-b flex flex-col rounded-b-lg bg-white'>
      <Droppable droppableId={pDay.valueOf() + ""}>
        {(provided) => {
          return (
            <div
              className='flex-1 my-1 overflow-y-auto h-full flex flex-col justify-end'
              style={{ height: boxHeight }}
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
                  {/* How many tasks are hidden */}0 more tasks
                </button>
              </section>
              <section className='flex px-1 w-full justify-around gap-1'>
                <button className={`${buttonClasses}`} onClick={handleShowMore}>
                  {/* Show more */}
                  <CgChevronDown />
                </button>
                <button className={`${buttonClasses}`} onClick={handleShowAll}>
                  {/* Show all */}
                  <CgPushChevronDown />
                </button>
                <button className={`${buttonClasses}`} onClick={handleShowLess}>
                  {/* Show less */}
                  <CgChevronUp />
                </button>
              </section>
            </div>
          );
        }}
      </Droppable>
    </section>
  );
};
