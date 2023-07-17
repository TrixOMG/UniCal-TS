import React from "react";

export const Icon = ({ type }) => {
  return (
    <div className='flex justify-center items-center h-full w-full'>
      <span className='material-icons text-gray-400 unselectable'>{type}</span>
    </div>
  );
};
