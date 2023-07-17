import React from "react";
import Variables from "../Variables";
import { useGlobalContext } from "../context/context";

const ConfirmationWindow = () => {
  const {
    confirmationWindowTitle,
    // confirmationWindowT,
    setConfirmationWindowTitle,
    showCancelButton,
    setShowCancelButton,
    setShowConfirmationWin,
    objectForAction,
    dispatchGroups,
    dispatchCalEvent,
    savedEvents,
  } = useGlobalContext();

  function setWindowDefaults() {
    setConfirmationWindowTitle("");
    setShowCancelButton(false);
    setShowConfirmationWin(false);
  }

  function handleClose() {
    setWindowDefaults();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (objectForAction.name === "group") {
      for (let i = 0; i < savedEvents.length; i++) {
        if (savedEvents[i].groupId === objectForAction.payload.id) {
          console.log(savedEvents[i]);
          dispatchCalEvent({ type: "delete", payload: savedEvents[i] });
        }
      }

      dispatchGroups({
        type: objectForAction.type,
        payload: objectForAction.payload,
      });
    }
    setWindowDefaults();
  }

  function handleCancel() {
    //setConfirm(false);
    setWindowDefaults();
  }

  return (
    <div className='z-10'>
      <div className='w-[100%] h-[100%] bg-black opacity-50 absolute left-0 top-0 z-20' />
      <div className='flex justify-center items-center absolute z-30 w-[100%] h-[100%] bg-none'>
        <form className='w-[15em] h-[10em] bg-white rounded-lg'>
          <header className='bg-gray-100 px-4 py-2 flex justify-end items-center rounded-lg'>
            <button type='button'>
              <span
                className='material-icons text-gray-400 unselectable'
                onClick={() => handleClose()}
              >
                close
              </span>
            </button>
          </header>
          <h1>{confirmationWindowTitle}</h1>
          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded text-white unselectable'
            onClick={(e) => handleSubmit(e)}
          >
            {Variables.eng.confirmationWindow.confirm}
          </button>
          {showCancelButton && (
            <button
              type='button'
              className='bg-white text-gray-500 hover:bg-gray-200 px-6 py-2 rounded unselectable'
              onClick={() => handleCancel()}
            >
              {Variables.eng.confirmationWindow.cancel}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ConfirmationWindow;
