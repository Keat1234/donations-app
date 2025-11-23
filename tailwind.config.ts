import { frostedThemePlugin } from "@whop/react/tailwind";

export default {
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0a0a0a",
          card: "#111111",
          accent: "#ff4d00",
          "gradient-start": "#ff4d00",
          "gradient-end": "#ff0000",
        },
      },
    },
  },
  plugins: [frostedThemePlugin()],
};
