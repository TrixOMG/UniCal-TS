import { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Event, useGlobalContext } from "../context/context";
import EventComponent from "./EventComponent";

import { CgArrowAlignH } from "react-icons/cg";
import { useResizable } from "react-resizable-element";

export const AllDayTaskBox = (props: { pDay: Dayjs; dayEvents: Event[] }) => {
  const { pDay, dayEvents } = props;
  const { container, handle } = useResizable({
    direction: "bottom",
    minSize: 10,
    maxSize: 400,
  });

  // const { setBufferHeight } = useGlobalContext();
  const [bufferHeight, setBufferHeight] = useState(0);

  useEffect(() => {
    if (container.current.clientHeight === null) return;
    const resizeObserver = new ResizeObserver(() => {
      setBufferHeight(container.current?.clientHeight);
    });
    resizeObserver.observe(container.current);
    return () => resizeObserver.disconnect(); // clean up
  }, [container, setBufferHeight]);

  // всего 3 режима, а кнопки циклируют между ними, more и less по одному шагу,
  // all сразу показывает всё
  // Show more: с позиции "показывать 1 таск" - показать 50% тасков, показать все таски

  return (
    <>
      <div className='absolute w-full z-1'>
        <section
          className='border-gray-200 border-b flex flex-col rounded-b-lg bg-white'
          ref={container}
        >
          <Droppable droppableId={pDay.valueOf() + ""}>
            {(provided) => {
              return (
                <div
                  className='flex-1 my-1 h-full flex flex-col justify-end overflow-y-auto'
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
                          return (
                            <EventComponent evt={evt} provided={provided} />
                          );
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
        <span ref={handle} className='unselectable'>
          <CgArrowAlignH />
        </span>
      </div>
      <div style={{ height: bufferHeight }} />
    </>
  );
};
