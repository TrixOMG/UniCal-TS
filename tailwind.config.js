/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    safelist: [
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
    ],
  },

  theme: {
    extend: {
      display: ["group-hover"],
      fontFamily: {},
      gridTemplateColumns: {
        "1/5": "1fr 5fr",
      },
      //   gridTemplateRows: {
      //     "1week": "max(90%)",
      //     "2week": "max(30%) max(30%)",
      //     "3week": "max(33%) max(33%) max(33%)",
      //     "4week": "max(30%) max(30%) max(30%) max(30%)",
      //   },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
