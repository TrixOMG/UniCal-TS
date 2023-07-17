import React, { useState } from "react";
import { usePopper } from "react-popper";
import { dropdownPopperConfig } from "../../Variables";
import { useOutsideAlerter } from "../../hooks/useOutsideAlerter";

export const Dropdown = ({ dropdownArray, actionFunction, actionResult }) => {
  const [dropdownPopperRefElement, setDropdownPopperRefElement] =
    useState(null);
  const [dropdownPopperElement, setDropdownPopperElement] = useState(null);

  const {
    show: showDropdown,
    setShow: setShowDropdown,
    ref: dropdownRef,
  } = useOutsideAlerter(false);

  const { styles: dpdStyles } = usePopper(
    dropdownPopperRefElement,
    dropdownPopperElement,
    dropdownPopperConfig
  );

  return (
    <div className='w-full'>
      <header
        className='w-full cursor-pointer border border-gray-300 rounded-lg p-1'
        ref={setDropdownPopperRefElement}
        onClick={() => {
          setShowDropdown(true);
        }}
      >
        <button
          className='flex flex-row bg-white gap-2 justify-start align-middle'
          onClick={(e) => {
            e.preventDefault();
            setShowDropdown(false);
          }}
        >
          <span
            className={`bg-${actionResult.label}-500 w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer `}
          ></span>
          {actionResult.title}
        </button>
      </header>
      {showDropdown && (
        <div ref={dropdownRef}>
          <div
            className='absolute flex flex-col justify-items-start w-[80%] border border-gray-300 rounded-lg overflow-hidden bg-white'
            ref={setDropdownPopperElement}
            style={dpdStyles.popper}
          >
            {dropdownArray.map((member, idx) => (
              <button
                className='flex flex-row bg-white gap-2 p-1 justify-start align-middle'
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  actionFunction(member);
                  setShowDropdown(false);
                }}
              >
                <span
                  className={`bg-${member.label}-500 w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer`}
                ></span>
                {member.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
