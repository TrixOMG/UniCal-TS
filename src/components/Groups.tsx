import React, { useEffect, useState } from "react";
import { usePopper } from "react-popper";
import { popperConfig } from "../Variables";
import { labelsClasses, useGlobalContext } from "../context/context";
import "../index.css";
import { Icon } from "./common/Icon";

const GroupModal = () => {
  const {
    showGroupModal,
    changeShowGroupModal,
    groupModalRef,
    groupReferenceElement,
    // setGroupReferenceElement,
    dispatchGroups,
    savedGroups,
    savedEvents,
    selectedGroup,
    setSelectedGroup,
    //confirm,
    setShowConfirmationWin,
    setConfirmationWindowTitle,
    //confirmAction,
    //setPassedAction,
    setObjectForAction,
  } = useGlobalContext();

  const [title, setTitle] = useState(selectedGroup ? selectedGroup.title : "");
  const [description, setDescription] = useState(
    selectedGroup ? selectedGroup.description : ""
  );
  const [selectedLabel, setSelectedLabel] = useState(
    selectedGroup
      ? labelsClasses.find((lbl) => lbl === selectedGroup.label)
      : labelsClasses[0]
  );

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (selectedGroup) {
      setTitle(selectedGroup.title);
      setDescription(selectedGroup.description);
      setSelectedLabel(selectedGroup.label);
    } else {
      setTitle("");
      setDescription("");
      setSelectedLabel(labelsClasses[0]);
    }
  }, [selectedGroup, savedGroups]);

  useEffect(() => {
    if (!showGroupModal) setEditMode(false);
  }, [showGroupModal]);

  // POPPER
  const [popperElement, setPopperElement] = useState(null);

  const { styles } = usePopper(
    groupReferenceElement,
    popperElement,
    popperConfig
  );

  // POPPER

  function setModalDefaults() {
    changeShowGroupModal(false);
    setSelectedGroup(null);
    //appearance
    setTitle("");
    setDescription("");
    setSelectedLabel(labelsClasses[0]);
    setEditMode(false);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (title.trim() === "") return;

    const newGroup = {
      checked: true,
      title: title,
      description: description,
      label: selectedLabel,
      id: selectedGroup ? selectedGroup.id : Date.now(),
    };

    if (selectedGroup) {
      dispatchGroups({ type: "update", payload: newGroup });
    } else {
      dispatchGroups({ type: "push", payload: newGroup });
    }

    setModalDefaults();
  }

  function getClassShow() {
    return showGroupModal ? "visible" : "invisible";
  }

  function handleDelete(e, pGroup) {
    e.preventDefault();

    if (savedGroups.length < 1) {
      //TODO: make a hint 'At least one group is required'
      return;
    } else {
      if (savedEvents.find((evt) => evt.groupId === pGroup.id)) {
        //TODO: передать окну подтверждения функцию, её тип и пэйлоад.
        //(если не выйдет с функцией, вместо неё послать тип удаляемого объекта
        //дальше уже в окне подтверждения разбитаться что с этим всем делать)
        setObjectForAction({
          name: "group",
          payload: pGroup,
          type: "delete",
        });
        setConfirmationWindowTitle(
          "Are you sure you want to delete this group? All tasks in this group will be deleted too."
        );
        setShowConfirmationWin(true);
      }
    }

    if (savedGroups.length > 1) {
    } else {
    }
  }

  function handleClose() {
    setModalDefaults();
  }

  function handleCheckedUnchecked(e) {
    e.preventDefault();

    let copyGroup = selectedGroup;
    copyGroup.checked = !selectedGroup.checked;

    dispatchGroups({ type: "update", payload: copyGroup });

    setModalDefaults();
  }

  return (
    <div ref={groupModalRef}>
      <div
        className={`${getClassShow()} rounded-xl drop-shadow-lg overflow-hidden bg-white w-[25em]`}
        ref={setPopperElement}
        style={styles.popper}
      >
        {selectedGroup && !editMode ? (
          <div className='bg-white rounded-xl'>
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
            <section className='p-3'>
              <div className='grid grid-cols-1/5 items-end gap-y-5 align-middle mr-5'>
                <div className='flex items-center justify-center h-full w-full'>
                  <div
                    className={`bg-${selectedLabel}-500 w-6 h-6 rounded-lg flex items-center justify-center unselectable `}
                  />
                </div>
                <p className='pl-1 pt-1 text-gray-600 text-lg font-semibold w-full pb-2'>
                  {selectedGroup.title}
                </p>
                {description && <Icon type={"segment"} />}
                {description && (
                  <pre className='pl-1 whitespace-pre-wrap'>{description}</pre>
                )}
              </div>
            </section>
            <footer className='flex justify-end border-t p-3 mt-3'>
              <button
                type='submit'
                className={`${
                  selectedGroup.checked
                    ? "bg-white hover:bg-gray-200 text-gray-600"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                } px-6 py-2 rounded  unselectable`}
                onClick={handleCheckedUnchecked}
              >
                {selectedGroup.checked ? "Don't Show" : "Show"}
              </button>
            </footer>
          </div>
        ) : (
          <form className='bg-white rounded-xl overflow-hidden'>
            <header className='bg-gray-100 px-4 py-2 flex justify-end items-center'>
              <div>
                {selectedGroup && (
                  <button
                    onClick={(e) => {
                      handleDelete(e);
                    }}
                  >
                    <Icon type={"delete"} />
                  </button>
                )}
                <button
                  type='button'
                  onClick={() => {
                    handleClose();
                  }}
                >
                  <Icon type={"close"} />
                </button>
              </div>
            </header>
            <div className='p-3'>
              <div className='grid grid-cols-1/5 items-end gap-y-5 align-middle'>
                <div></div>
                <input
                  type='text'
                  name='title'
                  placeholder='Add Group Title'
                  required
                  className='pt-3 border-0 text-gray-600 text-lg font-semibold w-full pb-2 border-b-2 border-gray-200 focus:outline-none focus:border-b-blue-500'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Icon type={"segment"} />
                <textarea
                  type='text'
                  name='description'
                  placeholder='Add a Description'
                  className='border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:border-blue-500 resize-none'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength='100'
                  rows={2}
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
            </div>
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

export default GroupModal;
