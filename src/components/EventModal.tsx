import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { usePopper } from "react-popper";
import { popperConfig } from "../Variables";
import { labelsClasses, useGlobalContext } from "../context/context";
import "../index.css";
import { Dropdown } from "./common/Dropdown";
import { Icon } from "./common/Icon";

const EventModal = () => {
  const {
    showEventModal,
    changeShowEventModal,
    modalRef,
    chosenDayForTask,
    dispatchCalEvent,
    referenceElement,
    setShowFakeTask,
    savedGroups,
    selectedEvent,
    setSelectedEvent,
  } = useGlobalContext();

  const [title, setTitle] = useState(selectedEvent ? selectedEvent.title : "");
  const [description, setDescription] = useState(
    selectedEvent ? selectedEvent.description : ""
  );
  const [selectedLabel, setSelectedLabel] = useState(
    selectedEvent
      ? labelsClasses.find((lbl) => lbl === selectedEvent.label)
      : labelsClasses[0]
  );
  const [chosenGroupForTask, setChosenGroupForTask] = useState(
    selectedEvent
      ? savedGroups.find((group) => group.id === selectedEvent.groupId)
      : savedGroups[0]
  );

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      setDescription(selectedEvent.description);
      setSelectedLabel(selectedEvent.label);
      setChosenGroupForTask(
        savedGroups.find((group) => group.id === selectedEvent.groupId)
      );
    } else {
      setTitle("");
      setDescription("");
      setSelectedLabel(labelsClasses[0]);
      setChosenGroupForTask(savedGroups[0]);
    }
  }, [selectedEvent, savedGroups]);

  useEffect(() => {
    if (showEventModal === false) {
      setShowFakeTask(false);
      setEditMode(false);
    }
  }, [setShowFakeTask, showEventModal]);

  // POPPER
  const [popperElement, setPopperElement] = useState(null);

  const { styles } = usePopper(referenceElement, popperElement, popperConfig);

  // POPPER

  function getClassShow() {
    return showEventModal ? "visible" : "invisible";
  }

  function setModalDefaults() {
    changeShowEventModal(false);
    setSelectedEvent(null);
    setSelectedLabel(labelsClasses[0]);
    setChosenGroupForTask(savedGroups[0]);
    setShowFakeTask(false);
    setEditMode(false);
    //appearance
    setTitle("");
    setDescription("");
    setChosenGroupForTask(savedGroups[0]);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (title.trim() === "") return;

    const newTask = {
      title: title,
      description: description,
      label: selectedLabel,
      day: selectedEvent ? selectedEvent.day : chosenDayForTask.valueOf(),
      id: selectedEvent ? selectedEvent.id : Date.now(),
      groupId: chosenGroupForTask.id,
      done: selectedEvent ? selectedEvent.done : false,
    };

    if (selectedEvent) {
      dispatchCalEvent({ type: "update", payload: newTask });
    } else {
      dispatchCalEvent({ type: "pushFromStart", payload: newTask });
    }

    setModalDefaults();
  }

  function handleDelete(e) {
    e.preventDefault();

    dispatchCalEvent({
      type: "delete",
      payload: selectedEvent,
    });

    setModalDefaults();
  }

  function handleClose() {
    setModalDefaults();
  }

  function handleDoneUndone(e) {
    e.preventDefault();
    let copySelEvent = selectedEvent;
    copySelEvent.done = !selectedEvent.done;

    dispatchCalEvent({
      type: "update",
      payload: copySelEvent,
    });

    setModalDefaults();
  }

  return (
    <div ref={modalRef}>
      <div
        className={`${getClassShow()} rounded-xl drop-shadow-lg overflow-hidden bg-white`}
        ref={setPopperElement}
        style={styles.popper}
      >
        {selectedEvent && !editMode ? (
          <div>
            <header className='bg-gray-100 px-4 py-2 flex justify-end items-center'>
              <div>
                <button onClick={() => setEditMode(true)}>
                  <Icon type={"edit"} />
                </button>
                <button
                  onClick={(e) => {
                    handleDelete(e);
                  }}
                >
                  <Icon type={"delete"} />
                </button>
                <button type='button' onClick={() => handleClose()}>
                  <Icon type={"close"} />
                </button>
              </div>
            </header>
            <section className='p-3 w-[25em]'>
              <div className='grid grid-cols-1/5 items-end gap-y-5 align-middle mr-5'>
                <div className='flex items-center justify-center h-full w-full'>
                  <div
                    className={`bg-${selectedLabel}-500 w-6 h-6 rounded-lg flex items-center justify-center unselectable `}
                  />
                </div>
                <p className='pl-1 pt-1 text-gray-600 text-lg font-semibold w-full pb-2'>
                  {selectedEvent.title}
                </p>
                <Icon type={"schedule"} />
                <p className='pl-1 unselectable'>
                  {selectedEvent
                    ? dayjs(selectedEvent.day).format("dddd, MMMM DD")
                    : chosenDayForTask.format("dddd, MMMM DD")}
                </p>
                {description && <Icon type={"segment"} />}
                {description && (
                  <pre className='pl-1 max-w-[24em]'>{description}</pre>
                )}
                <Icon type={"list_alt"} />
                <p className='pl-1 unselectable pb-1'>
                  {
                    savedGroups.find(
                      (group) => group.id === selectedEvent.groupId
                    ).title
                  }
                </p>
              </div>
            </section>
            <footer className='flex justify-end border-t p-3 mt-3'>
              <button
                type='submit'
                className={`${
                  selectedEvent.done
                    ? "bg-white hover:bg-gray-200 text-gray-600"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                } px-6 py-2 rounded  unselectable`}
                onClick={handleDoneUndone}
              >
                {selectedEvent.done ? "Task not completed" : "Task completed"}
              </button>
            </footer>
          </div>
        ) : (
          <form className='bg-white'>
            <header className='bg-gray-100 px-4 py-2 flex justify-end items-center'>
              <div>
                {selectedEvent && (
                  <button
                    onClick={(e) => {
                      handleDelete(e);
                    }}
                  >
                    <Icon type={"delete"} />
                  </button>
                )}
                <button type='button' onClick={() => handleClose()}>
                  <Icon type={"close"} />
                </button>
              </div>
            </header>
            <section className='p-3 w-[25em]'>
              <div className='grid grid-cols-1/5 items-end gap-y-5 align-middle mr-5'>
                <div></div>
                <input
                  type='text'
                  name='title'
                  placeholder='Add Title'
                  required
                  className='pt-3 border-0 text-gray-600 text-lg font-semibold w-full pb-2 border-b-2 border-gray-200 focus:outline-none focus:border-b-blue-500'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Icon type={"schedule"} />
                <p className='pl-1 unselectable'>
                  {selectedEvent
                    ? dayjs(selectedEvent.day).format("dddd, MMMM DD")
                    : chosenDayForTask.format("dddd, MMMM DD")}
                </p>
                <Icon type={"segment"} />
                <textarea
                  type='text'
                  name='description'
                  placeholder='Add a Description'
                  className='border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:border-blue-500 resize-none'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength='250'
                  rows={2}
                />
                <Icon type={"list_alt"} />
                <Dropdown
                  dropdownArray={savedGroups}
                  actionFunction={setChosenGroupForTask}
                  actionResult={chosenGroupForTask}
                />
                <Icon type={"bookmark_border"} />
                <div className='flex gap-x-2'>
                  {labelsClasses.map((lblClass, i) => (
                    <span
                      key={i}
                      onClick={() => setSelectedLabel(lblClass)}
                      className={`bg-${lblClass}-500 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer `}
                    >
                      {selectedLabel === lblClass && (
                        <span className='material-icons text-white text-sm'>
                          check
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </section>
            <footer className='flex justify-end border-t p-3 mt-3'>
              <button
                type='submit'
                onClick={handleSubmit}
                className='bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded text-white unselectable'
              >
                Save
              </button>
            </footer>
          </form>
        )}
      </div>
    </div>
  );
};

export default EventModal;
