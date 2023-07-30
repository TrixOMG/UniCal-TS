import dayjs, { Dayjs } from "dayjs";

import React, {
  Dispatch,
  MutableRefObject,
  Reducer,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

import { useLocalStorage } from "usehooks-ts";

// import { BuiltQueryMethods } from "@testing-library/react";
import { useOutsideAlerter } from "../hooks/useOutsideAlerter";

export const labelsClasses = [
  "indigo",
  "gray",
  "green",
  "blue",
  "red",
  "purple",
];

// const tailwindClasses = "grid-cols-1 grid-cols-2 grid-rows-1 grid-rows-2";

// INTERFACES START
export interface GlobalContextProps {
  // LOCAL STORAGE START

  savedEvents: Event[];
  savedGroups: Group[];
  addGroup: (newGroup: Group) => void;
  editGroup: (editedEvent: Group) => void;
  deleteGroup: (groupId: number) => void;

  // LOCAL STORAGE END
  tooltipTitle: string;
  setTooltipTitle: Dispatch<SetStateAction<string>>;
  tooltipRefElement: HTMLElement | null;
  setTooltipRefElement: Dispatch<SetStateAction<HTMLElement | null>>;
  showTooltip: boolean;
  setShowTooltip: Dispatch<SetStateAction<boolean>>;
  monthIndex: number;
  setMonthIndex: Dispatch<SetStateAction<number>>;
  showSidebar: boolean;
  toggleShowSidebar: (pShowSidebar: boolean) => void;
  selectedEvent: Event | null;
  setSelectedEvent: Dispatch<SetStateAction<Event | null>>;
  selectedGroup: Group | null;
  setSelectedGroup: Dispatch<SetStateAction<Group | null>>;
  showEventModal: boolean;
  setShowEventModal: Dispatch<SetStateAction<boolean>>;
  changeShowEventModal: (show: boolean) => void;
  showGroupModal: boolean;
  changeShowGroupModal: Dispatch<SetStateAction<boolean>>;
  chosenDayForTask: Dayjs;
  setChosenDayForTask: Dispatch<SetStateAction<Dayjs>>;
  showConfirmationWin: boolean;
  setShowConfirmationWin: Dispatch<SetStateAction<boolean>>;
  confirmationWindowTitle: string;
  setConfirmationWindowTitle: Dispatch<SetStateAction<string>>;
  showCancelButton: boolean;
  setShowCancelButton: Dispatch<SetStateAction<boolean>>;
  //TODO: define object
  objectForAction: any;
  setObjectForAction: Dispatch<SetStateAction<any>>;
  referenceElement: HTMLElement | null;
  setReferenceElement: Dispatch<SetStateAction<HTMLElement | null>>;
  groupReferenceElement: HTMLElement | null;
  setGroupReferenceElement: Dispatch<SetStateAction<HTMLElement | null>>;
  showFakeTask: boolean;
  setShowFakeTask: Dispatch<SetStateAction<boolean>>;
  filteredEvents: Event[];
  selectedDaysArray: Dayjs[];
  setSelectedDaysArray: Dispatch<SetStateAction<Dayjs[]>>;
  chosenDay: Dayjs;
  setChosenDay: Dispatch<SetStateAction<Dayjs>>;
  selectedGroupLabel: string;
  setSelectedGroupLabel: Dispatch<SetStateAction<string>>;
  modalRef: MutableRefObject<HTMLDivElement | null>;
  groupModalRef: MutableRefObject<HTMLDivElement | null>;
  dispatchCalEvent: Dispatch<EventAction>;
  // dispatchGroups: Dispatch<GroupAction>;
}

export interface Group {
  checked: boolean;
  title: string;
  description: string;
  label: string;
  id: number; //?
}

export interface Event {
  title: string;
  description: string;
  label: string;
  day: number;
  id: number;
  groupId: number;
  done: boolean;
}

// type GroupAction =
//   | { type: "push"; payload: Group }
//   | { type: "update"; payload: Group }
//   | { type: "delete"; payload: Group };

type EventAction =
  | { type: "push"; payload: Event }
  | { type: "update"; payload: Event }
  | { type: "delete"; payload: Event }
  | { type: "pushFromStart"; payload: Event };

// INTERFACES END

// const groupsReducer: Reducer<Group[], GroupAction> = (state, action) => {
//   switch (action.type) {
//     case "push":
//       return [...state, action.payload];
//     case "update":
//       return state.map((group) =>
//         group.id === action.payload.id ? action.payload : group
//       );
//     case "delete":
//       // change
//       return state.filter((group) => group.id !== action.payload.id);
//     default:
//       throw new Error("groupsReducerError");
//   }
// };

// function initGroups() {
//   const storageGroups = localStorage.getItem("savedGroups");
//   let parsedGroups = null;

//   if (storageGroups !== null) parsedGroups = JSON.parse(storageGroups);
//   else
//     parsedGroups = [
//       {
//         title: "Your Default Group",
//         id: Date.now(),
//         description: "Your Default Group's Description",
//         checked: true,
//         label: labelsClasses[0],
//       },
//     ];

//   return parsedGroups;
// }

const savedEventsReducer: Reducer<Event[], EventAction> = (state, action) => {
  switch (action.type) {
    case "push":
      return [...state, action.payload];
    case "update":
      return state.map((evt) =>
        evt.id === action.payload.id ? action.payload : evt
      );
    case "delete":
      return state.filter((evt) => evt.id !== action.payload.id);
    case "pushFromStart":
      return [action.payload, ...state];
    default:
      throw new Error("eventsReducerError");
  }
};

function initEvents() {
  const storageEvents = localStorage.getItem("savedEvents");
  let parsedEvents = [];

  if (storageEvents !== null) parsedEvents = JSON.parse(storageEvents);
  else parsedEvents = []; // default event for testing

  return parsedEvents;
}

// const defaultGroup = {
//   title: "Your Default Group",
//   id: Date.now(),
//   description: "Your Default Group's Description",
//   checked: true,
//   label: labelsClasses[0],
// }

//const GlobalContext = React.createContext();
export const GlobalContext = createContext<GlobalContextProps>(
  {} as GlobalContextProps
);

export const GlobalContextProvider = (props: { children: React.ReactNode }) => {
  // tooltip
  const [tooltipTitle, setTooltipTitle] = useState("");
  const [
    tooltipRefElement,
    setTooltipRefElement,
  ] = useState<HTMLElement | null>(null);

  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  // tooltip

  const [monthIndex, setMonthIndex] = useState<number>(dayjs().month() + 1);

  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  function toggleShowSidebar(pShowSidebar: boolean) {
    setShowSidebar(!pShowSidebar);
  }

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const {
    show: showEventModal,
    setShow: setShowEventModal,
    ref: modalRef,
  } = useOutsideAlerter(false);

  const {
    show: showGroupModal,
    setShow: changeShowGroupModal,
    ref: groupModalRef,
  } = useOutsideAlerter(false);

  //
  const [chosenDayForTask, setChosenDayForTask] = useState<Dayjs>(dayjs());

  // confirmation window start
  const [showConfirmationWin, setShowConfirmationWin] = useState<boolean>(
    false
  );
  const [confirmationWindowTitle, setConfirmationWindowTitle] = useState<
    string
  >("");

  const [showCancelButton, setShowCancelButton] = useState<boolean>(true);
  const [objectForAction, setObjectForAction] = useState({});

  // groups
  // const [savedGroups, dispatchGroups] = useReducer(
  //   groupsReducer,
  //   [],
  //   initGroups
  // );
  // [],

  // POPPER
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );
  const [
    groupReferenceElement,
    setGroupReferenceElement,
  ] = useState<HTMLElement | null>(null);
  // const [popperElement, setPopperElement] = useState(null);

  // Fake Task
  const [showFakeTask, setShowFakeTask] = useState(true);

  const [savedEvents, dispatchCalEvent] = useReducer(
    savedEventsReducer,
    [],
    initEvents
  );

  useEffect(() => {
    localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
  }, [savedEvents]);

  // useEffect(() => {
  //   localStorage.setItem("savedGroups", JSON.stringify(savedGroups));
  // }, [savedGroups]);

  //
  //  ? useLocalStorage Area START

  // GROUPS START

  // initialization of the groups
  let defaultGroup: Group = {
    title: "Your Default Group",
    id: Date.now(),
    description: "Your Default Group's Description",
    checked: true,
    label: labelsClasses[0],
  };

  const [savedGroups, setSavedGroups] = useLocalStorage<Group[]>(
    "savedGroups",
    [defaultGroup]
  );

  // adding new group from behind of the array
  const addGroup = (newGroup: Group) => {
    setSavedGroups([...savedGroups, newGroup]);
  };

  const deleteGroup = (groupId: number) => {
    setSavedGroups((prevGroups) =>
      prevGroups.filter((gr) => gr.id !== groupId)
    );
  };

  const editGroup = (editedGroup: Group) => {
    setSavedGroups((prevGroups) => {
      return prevGroups.map((gr) => {
        if (gr.id === editedGroup.id) return editedGroup;
        else return gr;
      });
    });
  };

  // GROUPS END

  // const [selectedDaysArray, setSelectedDaysArray] = useLocalStorage(
  //   "selectedDaysArray",
  //   getProperSelectedDays([dayjs()])
  // );

  const [selectedDaysArray, setSelectedDaysArray] = useState(
    localStorage.getItem("selectedDaysArray")
      ? JSON.parse(localStorage.getItem("selectedDaysArray")!).map(
          (day: string) => {
            return dayjs(day);
          }
        )
      : [dayjs()]
  );

  useEffect(() => {
    localStorage.setItem(
      "selectedDaysArray",
      JSON.stringify(selectedDaysArray)
    );
  }, [selectedDaysArray, setSelectedDaysArray]);

  //  ? useLocalStorage Area END

  //

  const filteredEvents = useMemo(() => {
    return savedEvents.filter((evt: Event) =>
      savedGroups
        .filter((group: Group) => group.checked)
        .map((group: Group) => group.id)
        .includes(evt.groupId)
    );
  }, [savedEvents, savedGroups]);

  const [chosenDay, setChosenDay] = useState(dayjs());

  function changeShowEventModal() {
    setShowEventModal((visible) => !visible);
  }

  const [selectedGroupLabel, setSelectedGroupLabel] = useState(
    labelsClasses[0]
  );

  const value: GlobalContextProps = {
    //tooltip
    tooltipTitle,
    setTooltipTitle,
    tooltipRefElement,
    setTooltipRefElement,
    showTooltip,
    setShowTooltip,
    //tooltip

    // confirmation window
    showConfirmationWin,
    setShowConfirmationWin,
    confirmationWindowTitle,
    setConfirmationWindowTitle,
    showCancelButton,
    setShowCancelButton,
    objectForAction,
    setObjectForAction,
    //confirmAction,
    //passedAction,
    //setPassedAction,
    // confirmation window

    //group modal
    showGroupModal,
    changeShowGroupModal,
    groupModalRef,
    groupReferenceElement,
    setGroupReferenceElement,
    selectedGroupLabel,
    setSelectedGroupLabel,
    //group modal

    monthIndex,
    setMonthIndex,

    selectedEvent,
    setSelectedEvent,
    selectedGroup,
    setSelectedGroup,

    showSidebar,
    // setShowSidebar,
    toggleShowSidebar,
    showEventModal,
    setShowEventModal,
    modalRef, //for hiding event modal on click outside
    changeShowEventModal,
    selectedDaysArray,
    setSelectedDaysArray,
    chosenDayForTask,
    setChosenDayForTask,
    chosenDay,
    setChosenDay,
    dispatchCalEvent,

    savedEvents,
    // addEvent,
    // pushEvent,
    // editEvent,
    // deleteEvent,
    savedGroups,
    addGroup,
    editGroup,
    deleteGroup,

    // dispatchGroups,
    filteredEvents,
    referenceElement,
    setReferenceElement,
    showFakeTask,
    setShowFakeTask,
  };

  return (
    <GlobalContext.Provider value={value}>
      {props.children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

//export { GlobalContext, GlobalContextProvider };
