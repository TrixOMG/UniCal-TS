import React from "react";
import Calendar from "./Calendar";
import Groups from "./Groups";

const Sidebar = () => {
  return (
    <aside className='border rounded-lg p-5 w-64 h-[100%] max-h-[100%] grid grid-cols-1 grid-rows-2 overflow-y-auto'>
      <Calendar />
      <Groups />
    </aside>
  );
};

export default Sidebar;
