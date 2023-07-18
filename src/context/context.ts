import dayjs, { Dayjs } from "dayjs";

import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

import { useOutsideAlerter } from "../hooks/useOutsideAlerter";
import { getProperSelectedDays } from "../util/util";

export const labelsClasses = [
  "indigo",
  "gray",
  "green",
  "blue",
  "red",
  "purple",
];

function groupsReducer(state:Group, { type, payload}) {
  switch (type) {
    case "push":
      return [...state, payload];
    case "update":
      return state.map((group) => (group.id === payload.id ? payload : group));
    case "delete":
      // change
      return state.filter((group) => group.id !== payload.id);
    default:
      throw new Error("groupsReducerError");
  }
}

function initGroups() {
  const storageGroups = localStorage.getItem("savedGroups");
  let parsedGroups = null;

  if (storageGroups !== null) parsedGroups = JSON.parse(storageGroups);
  else
    parsedGroups = [
      {
        title: "Your Default Group",
        id: Date.now(),
        description: "Your Default Group's Description",
        checked: true,
        label: labelsClasses[0],
      },
    ];
  return parsedGroups;
}

function savedEventsReducer(state, { type, payload }) {
  switch (type) {
    case "push":
      return [...state, payload];
    case "update":
      return state.map((evt) => (evt.id === payload.id ? payload : evt));
    case "delete":
      return state.filter((evt) => evt.id !== payload.id);
    case "pushFromStart":
      return [payload, ...state];
    default:
      throw new Error("eventsReducerError");
  }
}

function initEvents() {
  const storageEvents = localStorage.getItem("savedEvents");
  let parsedEvents = [];

  if (storageEvents !== null) parsedEvents = JSON.parse(storageEvents);
  else parsedEvents = [];
  return parsedEvents;
}



// INTERFACES START
interface GlobalContextProps {
  tooltipTitle: string
  setTooltipTitle: Dispatch<SetStateAction<string>>
  tooltipRefElement: HTMLElement | null
  setTooltipRefElement: Dispatch<SetStateAction<HTMLElement | null>>
  showTooltip: boolean
  setShowTooltip: Dispatch<SetStateAction<boolean>>
  monthIndex: number
  setMonthIndex: Dispatch<SetStateAction<number>>
  showSidebar: boolean
  setShowSidebar: Dispatch<SetStateAction<boolean>>
  selectedEvent: Event | null
  setSelectedEvent: Dispatch<SetStateAction<Event | null>>
  selectedGroup: Group | null
  setSelectedGroup: Dispatch<SetStateAction<Group | null>>
  showEventModal: boolean
  setShowEventModal: Dispatch<SetStateAction<boolean>>
  changeShowEventModal: () => void
  showGroupModal: boolean
  changeShowGroupModal: Dispatch<SetStateAction<boolean>>
  chosenDayForTask: Dayjs
  setChosenDayForTask: Dispatch<SetStateAction<Dayjs>>
  showConfirmationWin: boolean
  setShowConfirmationWin: Dispatch<SetStateAction<boolean>>
  confirmationWindowTitle: string
  setConfirmationWindowTitle: Dispatch<SetStateAction<string>>
  showCancelButton: boolean
  setShowCancelButton: Dispatch<SetStateAction<boolean>>
  //TODO: define object
  objectForAction: any
  setObjectForAction: Dispatch<SetStateAction<any>>
  savedGroups: Group[]
  setSavedGroups: Dispatch<SetStateAction<Group[]>>
  referenceElement: HTMLElement | null
  setReferenceElement: Dispatch<SetStateAction<HTMLElement | null>>
  groupReferenceElement: HTMLElement | null
  setGroupReferenceElement: Dispatch<SetStateAction<HTMLElement | null>>
  showFakeTask: boolean
  setShowFakeTask: Dispatch<SetStateAction<boolean>>
  savedEvents: Event[]
  filteredEvents: Event[]
  selectedDaysArray: Dayjs[]
  setSelectedDaysArray: Dispatch<SetStateAction<Dayjs[]>>
  chosenDay: Dayjs
  setChosenDay: Dispatch<SetStateAction<Dayjs>>
  selectedGroupLabel: string
  setSelectedGroupLabel: Dispatch<SetStateAction<string>>
  modalRef: MutableRefObject<HTMLElement | null>
  groupModalRef: MutableRefObject<HTMLElement | null>
}

interface Group {

}

interface Event {

}
// INTERFACES END


//const GlobalContext = React.createContext();
export const GlobalContext = createContext<GlobalContextProps | undefined>(undefined,);

export const GlobalContextProvider = (props: { children: React.ReactNode }) => {
  // tooltip
  const [tooltipTitle, setTooltipTitle] = useState("");
  const [tooltipRefElement, setTooltipRefElement] = useState<HTMLElement | null>(null);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  // tooltip

  const [monthIndex, setMonthIndex] = useState<number>(dayjs().month() + 1);

  const [showSidebar, setShowSidebar] = useState<boolean>(true);

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
  const [chosenDayForTask, setChosenDayForTask] = useState(dayjs());

  // confirmation window start
  const [showConfirmationWin, setShowConfirmationWin] = useState<boolean>(false);
  const [confirmationWindowTitle, setConfirmationWindowTitle] = useState<string>("");
  const [showCancelButton, setShowCancelButton] = useState<boolean>(true);
  const [objectForAction, setObjectForAction] = useState({});


  // groups
  const [savedGroups, dispatchGroups] = useReducer(
    groupsReducer,
    [],
    initGroups
  );

  // POPPER
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [groupReferenceElement, setGroupReferenceElement] = useState<HTMLElement | null>(null);
  // const [popperElement, setPopperElement] = useState(null);

  // Fake Task
  const [showFakeTask, setShowFakeTask] = useState(true);

  const [savedEvents, dispatchCalEvent] = useReducer(
    savedEventsReducer,
    [],
    initEvents
  );

  const filteredEvents = useMemo(() => {
    return savedEvents.filter((evt) =>
      savedGroups
        .filter((group) => group.checked)
        .map((group) => group.id)
        .includes(evt.groupId)
    );
  }, [savedEvents, savedGroups]);

  useEffect(() => {
    localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
  }, [savedEvents]);

  useEffect(() => {
    localStorage.setItem("savedGroups", JSON.stringify(savedGroups));
  }, [savedGroups]);

  const [selectedDaysArray, setSelectedDaysArray] = useState(
    getProperSelectedDays([dayjs()])
  );
  const [chosenDay, setChosenDay] = useState(dayjs());

  // Everything for modal START

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
    setShowSidebar,
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
    savedGroups,
    dispatchGroups,
    filteredEvents,
    referenceElement,
    setReferenceElement,
    showFakeTask,
    setShowFakeTask,
  };

  return (
    <GlobalContext.Provider value={value}>{props.children}</GlobalContext.Provider>
  )
}


export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

//export { GlobalContext, GlobalContextProvider };

