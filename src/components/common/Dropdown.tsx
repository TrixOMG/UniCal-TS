import React, { useState } from "react";
import { usePopper } from "react-popper";
// import { DPDPopperConfig, dropdownPopperConfig } from "../../Variables";
import { Group } from "../../context/context";
import { useOutsideAlerter } from "../../hooks/useOutsideAlerter";

export const Dropdown = (props: {
  dropdownArray: Group[];
  actionFunction: (gr: Group) => void;
  actionResult: Group | undefined;
}) => {
  const { dropdownArray, actionFunction, actionResult } = props;

  const [
    dropdownPopperRefElement,
    setDropdownPopperRefElement,
  ] = useState<HTMLElement | null>(null);
  const [
    dropdownPopperElement,
    setDropdownPopperElement,
  ] = useState<HTMLElement | null>(null);

  const {
    show: showDropdown,
    setShow: setShowDropdown,
    ref: dropdownRef,
  } = useOutsideAlerter(false);

  const { styles: dpdStyles } = usePopper(
    dropdownPopperRefElement,
    dropdownPopperElement,
    // dropdownPopperConfig
    {
      placement: "bottom",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 5],
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
            fallbackPlacements: [
              "top",
              "bottom",
              "right",
              "left",
              "left-end",
              "right-end",
            ],
            rootBoundary: "viewport",
          },
        },
      ],
    }
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
            className={`bg-${actionResult?.label}-500 w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer `}
          ></span>
          {actionResult?.title}
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
