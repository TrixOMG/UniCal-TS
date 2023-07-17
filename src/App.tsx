import React from "react";

import ConfirmationWindow from "./components/ConfirmationWindow";
import EventModal from "./components/EventModal";
import GroupModal from "./components/GroupModal";
import MainDaysComponent from "./components/MainDaysComponent";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { useGlobalContext } from "./context/context";
import dayjs from "dayjs";
import "./index.css";
import "./util/util";

function App() {
  const { showSidebar, selectedDaysArray, showConfirmationWin } =
    useGlobalContext();

  return (
    <>
      {showConfirmationWin && <ConfirmationWindow />}
      <EventModal />
      <GroupModal />
      <div className='App h-screen flex flex-col'>
        <Navbar />
        <div className='flex flex-1 p-1 max-h-[90%]'>
          {showSidebar && <Sidebar />}
          <MainDaysComponent timeSpan={selectedDaysArray} />
        </div>
      </div>
    </>
  );
}

export default App;