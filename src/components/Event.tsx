import React from "react";
import { useGlobalContext } from "../context/context";

const Event = ({ evt, provided }) => {
  const {
    setReferenceElement,
    savedGroups,
    setSelectedEvent,
    changeShowEventModal,
    dispatchCalEvent,
  } = useGlobalContext();

  function handleOnEventClick(pEvent) {
    setSelectedEvent(pEvent);
    changeShowEventModal(true);
  }

  function handleTaskDone(pEvent) {
    setSelectedEvent(null);
    changeShowEventModal(false);

    dispatchCalEvent({
      type: "update",
      payload: {
        title: pEvent.title,
        description: pEvent.description,
        label: pEvent.label,
        day: pEvent.day,
        groupId: pEvent.groupId,
        id: pEvent.id,
        done: !pEvent.done,
      },
    });
  }

  return (
    <div
      onClick={(e) => {
        setReferenceElement(e.currentTarget);
        handleOnEventClick(evt);
      }}
    >
      <div
        className={`${
          evt.done ? "bg-" + evt.label + "-400" : "bg-" + evt.label + "-300"
        } mx-1 text-gray-600 text-sm rounded-lg mb-1 flex flex-row justify-left items-center`}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <input
          type='checkbox'
          checked={evt.done}
          onChange={() => handleTaskDone(evt)}
          className={`form-checkbox h-4 w-4 mx-1 text-${
            savedGroups.find((gr) => gr.id === evt.groupId)
              ? savedGroups.find((gr) => gr.id === evt.groupId).label
              : ""
          }-400 rounded ring-0 focus:ring-offset-0 focus:ring-0 cursor-pointer border-0 bg-${
            savedGroups.find((gr) => gr.id === evt.groupId)
              ? savedGroups.find((gr) => gr.id === evt.groupId).label
              : ""
          }-400`}
        />
        <p
          className={`truncate p-[0.20em] hover:cursor-pointer ${
            evt.done ? "line-through" : ""
          }`}
        >
          {evt.title}
        </p>
      </div>
    </div>
  );
};

export default Event;
