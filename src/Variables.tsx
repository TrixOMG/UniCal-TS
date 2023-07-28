// import { Options } from "@popperjs/core";

const tailwindClassesGlobal = [
  "grid-cols-1",
  "grid-cols-2",
  "grid-cols-3",
  "grid-cols-4",
  "grid-cols-5",
  "grid-cols-6",
  "grid-cols-7",
  "grid-rows-1",
  "grid-rows-2",
  "grid-rows-3",
  "grid-rows-4",
  "grid-rows-5",
  "grid-rows-6",
  "grid-rows-7",
  "bg-indigo-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-gray-500",
  "bg-red-500",

  "bg-indigo-300",
  "bg-red-300",
  "bg-purple-300",
  "bg-blue-300",
  "bg-green-300",
  "bg-green-400",
  "bg-gray-300",
  "bg-red-400",

  "text-indigo-400",
  "text-purple-400",
  "text-blue-400",
  "text-green-400",
  "text-gray-400",
  "text-red-400",

  "bg-indigo-400",
  "bg-purple-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-gray-400",
  "bg-red-400",
];

const Variables = {
  eng: {
    confirmationWindow: {
      confirm: "Ok",
      cancel: "Cancel",
    },
  },
  rus: {
    confirmationWindow: {
      confirm: "Ок",
      cancel: "Отмена",
    },
  },
};

export const popperConfig = {
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
};

// export type DPDPopperConfig = typeof dropdownPopperConfig

// export const dropdownPopperConfig: Omit<Partial<Options>, "modifiers"> = {
//   placement: "bottom",
//   modifiers: [
//     {
//       name: "offset",
//       options: {
//         offset: [0, 5],
//       },
//     },
//     {
//       name: "preventOverflow",
//       options: {
//         altAxis: true,
//       },
//     },
//     // {
//     //   name: "flip",
//     //   options: {
//     //     padding: 100,
//     //   },
//     // },
//     {
//       name: "flip",
//       options: {
//         fallbackPlacements: [
//           "top",
//           "bottom",
//           "right",
//           "left",
//           // "top-end",
//           // "bottom-end",
//           "left-end",
//           "right-end",
//           // "right-start",
//           // "left-start",
//           // "bottom-start",
//           // "top-start",
//         ],
//         rootBoundary: "viewport",
//       },
//     },
//   ],
// };

export default Variables;
