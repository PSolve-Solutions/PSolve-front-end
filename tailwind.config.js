/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    fontFamily: {
      montserrat: ["Montserrat", "sans-serif"],
    },
    extend: {
      transitionProperty: {
        height: "width",
      },
      colors: {
        activeLink: "#3D91C7",
        sidebarColor: "#686666",
        mainGreen: "#41b253",
        mainRed: "#e44449",
        mainYellow: "#cca827",
        mainblue: "#3D91C7",
        profileTColor: "#e69c24",
        // PSovle Colors
        mainColor1: "#002C3D",
        mainColor2: "#F8444F",
        mainColor3: "#78BDC4",
        mainColor4: "#F7F8F3",
        subColor1: "#285C6A",
        subColor2: "#508D97",
        subColor3: "#F88086",
        subColor4: "#F7BCBC",
      },
      animation: {
        pop: "popBtn 1s  infinite",
      },
      keyframes: {
        popBtn: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
      },
      fontFamily: {
        dm: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
