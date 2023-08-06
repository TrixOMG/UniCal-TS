import dayjs from "dayjs";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { CgClose, CgLayoutList, CgPen, CgTrashEmpty } from "react-icons/cg";
import {
  TfiAlarmClock,
  TfiBookmark,
  TfiCheck,
  TfiClose,
  TfiLayoutListThumb,
  TfiList,
  TfiPencil,
  TfiTrash,
} from "react-icons/tfi";
import { usePopper } from "react-popper";
import { Group, labelsClasses, useGlobalContext } from "../context/context";
import "../index.css";
import { Dropdown } from "./common/Dropdown";

const EventModal = () => {
  const {
    showEventModal,
    changeShowEventModal,
    modalRef,
    chosenDayForTask,
    dispatchCalEvent,
    // editEvent,
    // pushEvent,
    // deleteEvent,
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

  const [chosenGroupForTask, setChosenGroupForTask] = useState<
    // Group | undefined
    Group
  >(
    // selectedEvent
    // ? savedGroups.find((group) => group.id === selectedEvent.groupId)
    // :
    savedGroups[0]
  );

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      setDescription(selectedEvent.description);
      setSelectedLabel(selectedEvent.label);
      setChosenGroupForTask(
        savedGroups.find((gr) => gr.id === selectedEvent.groupId)!
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
      setSelectedEvent(null);
      setSelectedLabel(labelsClasses[0]);
      setChosenGroupForTask(savedGroups[0]);
    }
  }, [setShowFakeTask, showEventModal, setSelectedEvent, savedGroups]);

  // POPPER
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );

  const { styles } = usePopper(referenceElement, popperElement, {
    placement: "right-start",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 10],
        },
      },
      {
        name: "preventOverflow",
        options: {
          altAxis: true,
        },
      },
      {
        name: "flip",
        options: {
          padding: 50,
        },
      },
      {
        name: "flip",
        options: {
          fallbackPlacements: [
            // "top",
            "right",
            "left",
            // "top-end",
            "bottom-end",
            "left-end",
            "right-end",
            "bottom",
            "right-start",
            "left-start",
            "bottom-start",
            "top-start",
          ],
          rootBoundary: "viewport",
        },
      },
    ],
  });

  // POPPER

  function getClassShow() {
    return showEventModal ? "visible" : "invisible";
  }

  function setModalDefaults() {
    changeShowEventModal(false);
    setSelectedEvent(null);
    setSelectedLabel(labelsClasses[0]);
    // setChosenGroupForTask(savedGroups[0]);
    setShowFakeTask(false);
    setEditMode(false);
    //appearance
    setTitle("");
    setDescription("");
    setChosenGroupForTask(savedGroups[0]);
  }

  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();

    if (title.trim() === "") return;
    if (chosenGroupForTask === undefined) return;

    const newTask = {
      title: title,
      description: description,
      label: selectedLabel ? selectedLabel : "",
      day: selectedEvent ? selectedEvent.day : chosenDayForTask.valueOf(),
      id: selectedEvent ? selectedEvent.id : Date.now(),
      groupId: chosenGroupForTask.id,
      done: selectedEvent ? selectedEvent.done : false,
    };

    if (selectedEvent) {
      dispatchCalEvent({ type: "update", payload: newTask });
      // editEvent(newTask);
    } else {
      dispatchCalEvent({ type: "pushFromStart", payload: newTask });
      // pushEvent(newTask);
    }

    setModalDefaults();
  }

  function handleDelete(e: SyntheticEvent) {
    e.preventDefault();

    if (selectedEvent === null) return;

    // deleteEvent(selectedEvent.id);
    dispatchCalEvent({
      type: "delete",
      payload: selectedEvent,
    });

    setModalDefaults();
  }

  function handleClose() {
    setModalDefaults();
  }

  function handleDoneUndone(e: SyntheticEvent) {
    e.preventDefault();

    if (selectedEvent === null) return;

    let copySelEvent = selectedEvent;
    copySelEvent.done = !selectedEvent.done;

    dispatchCalEvent({
      type: "update",
      payload: copySelEvent,
    });
    // editEvent(copySelEvent);

    setModalDefaults();
  }

  return (
    <div ref={modalRef} className='z-99'>
      <div
        className={`${getClassShow()} rounded-xl drop-shadow-lg overflow-hidden bg-white`}
        ref={setPopperElement}
        style={styles.popper}
      >
        {selectedEvent && !editMode ? (
          <div>
            <header className='bg-gray-100 px-4 py-2 flex justify-end items-center'>
              <div>
                <button onClick={() => setEditMode(true)} className=''>
                  <div className='flex justify-center items-center '>
                    <CgPen className='text-gray-400 unselectable text-lg w-6 h-6  ml-1 ' />
                  </div>
                </button>
                <button
                  onClick={(e) => {
                    handleDelete(e);
                  }}
                >
                  <div className='flex justify-center items-center h-full w-full'>
                    <CgTrashEmpty className='text-gray-400 unselectable text-lg w-6 h-6 ml-1' />
                  </div>
                </button>
                <button type='button' onClick={() => handleClose()}>
                  <div className='flex justify-center items-center h-full w-full'>
                    <CgClose className='text-gray-400 unselectable text-lg w-6 h-6 ml-1   ' />
                  </div>
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
                <div>
                  <div className='flex justify-center items-center h-full w-full text-xl'>
                    <CgLayoutList className='text-gray-400 unselectable text-xl' />
                  </div>
                </div>
                <p className='pl-1 unselectable'>
                  {selectedEvent
                    ? dayjs(selectedEvent.day).format("dddd, MMMM DD")
                    : dayjs(chosenDayForTask).format("dddd, MMMM DD")}
                </p>
                {description && <TfiLayoutListThumb />}
                {description && (
                  <pre className='pl-1 max-w-[24em]'>{description}</pre>
                )}
                {/* <Icon type={"list_alt"} /> */}
                <TfiList />
                <p className='pl-1 unselectable pb-1'>
                  {
                    savedGroups.find(
                      (group) => group.id === selectedEvent.groupId
                    )?.title
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
                    <TfiTrash />
                  </button>
                )}
                <button type='button' onClick={() => handleClose()}>
                  <TfiClose />
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
                <TfiAlarmClock />
                <p className='pl-1 unselectable'>
                  {selectedEvent
                    ? dayjs(selectedEvent.day).format("dddd, MMMM DD")
                    : dayjs(chosenDayForTask).format("dddd, MMMM DD")}
                </p>
                <TfiLayoutListThumb />
                <textarea
                  // type='text'
                  name='description'
                  placeholder='Add a Description'
                  className='border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:border-blue-500 resize-none'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={250}
                  rows={2}
                />
                {/* <Icon type={"list_alt"} /> */}
                <TfiLayoutListThumb />
                <Dropdown
                  dropdownArray={savedGroups}
                  actionFunction={setChosenGroupForTask}
                  actionResult={chosenGroupForTask}
                />
                {/* <Icon type={"bookmark_border"} /> */}
                <TfiBookmark />
                <div className='flex gap-x-2'>
                  {labelsClasses.map((lblClass, i) => (
                    <span
                      key={i}
                      onClick={() => setSelectedLabel(lblClass)}
                      className={`bg-${lblClass}-500 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer `}
                    >
                      {selectedLabel === lblClass && (
                        <TfiCheck className='text-white text-sm' />
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
