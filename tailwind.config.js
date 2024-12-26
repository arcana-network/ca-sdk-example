/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        rose: {
          100: "#FFE4EE",
          200: "#FFD7E9",
          300: "#FF94B6",
          400: "#FF6C9A",
          500: "#FF4E9F",
          600: "#DB437F",
          700: "#B73768",
          800: "#FF4E9F0D",
          900: "#7A2141",
        },
        white: {
          100: "#FFFFFF",
          200: "#FCFCFC",
          300: "#F9FAFA",
          400: "#F3F3F3",
          500: "#ECECEC",
          600: "#E5E5E5",
          700: "#DADADA",
          800: "#CCCCCC",
          900: "#989898",
        },
        black: {
          100: "#E0E0E0",
          200: "#C2C2C2",
          300: "#A3A3A3",
          400: "#858585",
          500: "#666666",
          600: "#4D4D4D",
          700: "#000000DE",
          800: "#13171A",
          900: "#0A0A0A",
        },
        blue: {
          100: "#E3ECFC",
          200: "#B7CDF7",
          300: "#8BAEF1",
          400: "#5F8FEB",
          500: "#457AE0",
          600: "#487DE3",
          700: "#2A4986",
          800: "#1C315A",
          900: "#0F1830",
        },
        orange: {
          100: "#FFEAD9",
          200: "#FEFEFE",
          300: "#E8EDEE",
          400: "#FF9C55",
          500: "#ECF0F2",
          600: "#DB7030",
          700: "#B75426",
          800: "#FF4E9F26",
          900: "#7A2E15",
        },
        maroon: {
          100: "#E8D9DF",
          200: "#D1B3BF",
          300: "#B98D9F",
          400: "#A2677F",
          500: "#8A415F",
          600: "#6D334B",
          700: "#512638",
          800: "#381123",
          900: "#200A14",
        },
        blueGray: {
          100: "#E3E7E9",
          200: "#C8D5D999",
          300: "#A0B0B6",
          400: "#829299",
          500: "#5D7883",
          600: "#74919C",
          700: "#4C626E",
          800: "#1D2A31",
          900: "#39444A",
        },
        background: {
          100: "#DFDFDF",
          200: "#FDFDFD",
          300: "#F5F7F7",
          400: "#E4E9EB",
          500: "#F5F7F8",
          600: "#E4E9EB4D",
          700: "#E4E9EB99",
          800: "#4B5563",
          900: "#374151",
        },
        success: {
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
        },
        danger: {
          100: "#FDD9D9",
          200: "#FBAAAA",
          300: "#F87B7B",
          400: "#F54D4D",
          500: "#F61D1D",
          600: "#D11818",
          700: "#AD1414",
          800: "#890F0F",
          900: "#650B0B",
        },
      },
      height: {
        "3rem": "3rem",
        "3.25rem": "3.25rem",
        "2.75rem": "2.75rem",
        "5.125rem": "5.125rem",
        "18.125rem": "18.125rem",
      },
      minHeight: {
        "calc-100vh-minus-header": "calc(100vh - 5.125rem)",
      },
      maxHeight: {
        "1rem": "1rem",
        "10rem": "25rem",
      },
      width: {
        "11.625rem": "11.625rem",
        "35%": "35%",
      },
      maxWidth: {
        "1rem": "1rem",
        "6ch": "6ch",
      },
      inset: {
        "3px": "3px",
      },
      margin: {
        "1rem": "1rem",
      },
      padding: {
        "1.0625rem": "1.0625rem",
        "2rem": "2rem",
        "2.02731rem": "2.02731rem",
      },
      borderWidth: {
        "1rem": "1rem",
      },
      borderOpacity: {
        "1rem": "1rem",
      },
      borderRadius: {
        none: "0px",
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        full: "9999px",
        "6.25rem": "6.25rem",
        "1.25rem": "1.25rem",
        "0.75rem": "0.75rem",
        "2.93rem": "2.93rem",
      },
      fontFamily: {
        nohemi: ["Nohemi", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      fontSize: {
        "0.625rem": ["0.625rem", "0.75rem"],
        "0.25rem": ["0.25rem", "1rem"],
        "base-lg": ["1.25rem", "1.875rem"],
        "4.5xl": ["4.5rem", "5.4rem"],
        "0.875rem": ["0.875rem", "0.878rem"],
      },
      opacity: {
        0.5: "0.5",
      },
      boxShadow: {
        "0_0_38px_0_00000026": "0 0 38px 0 #00000026",
      },
      spacing: {
        "40px": "40px",
      },
      filters: {
        none: "none",
        "drop-shadow": "drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1))",
        blur: "blur(4px)",
      },
      transform: {
        "scale-110": "scale(1.1)",
        "scale-125": "scale(1.25)",
      },
      animation: {
        colorCycle: "colorCycle 1s infinite",
        progressLoader: "progressLoader 1s ease forwards",
      },
      transitionDelay: {
        250: "250ms",
        500: "500ms",
        750: "750ms",
      },
      keyframes: {
        colorCycle: {
          "0%": { backgroundColor: "white" },
          "25%": { backgroundColor: "#FF4E9F" },
          "50%": { backgroundColor: "white" },
          "75%": { backgroundColor: "white" },
          "100%": { backgroundColor: "white" },
        },
        progressLoader: {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
      },
      svg: {
        fill: {
          primary: "#1D4ED8",
          secondary: "#9333EA",
          accent: "#FBBF24",
        },
      },
      strokeLinecap: {
        round: "round",
        square: "square",
        butt: "butt",
      },
    },
  },
  plugins: [
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "animate-delay": (value) => ({
            animationDelay: value,
          }),
        },
        { values: theme("transitionDelay") }
      );
    },
    function ({ addUtilities }) {
      addUtilities({
        ".stroke-cap-round": { "stroke-linecap": "round" },
        ".stroke-cap-square": { "stroke-linecap": "square" },
        ".stroke-cap-butt": { "stroke-linecap": "butt" },
      });
    },
  ],
};
