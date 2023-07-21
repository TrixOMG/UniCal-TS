import { Options } from "@popperjs/core";

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