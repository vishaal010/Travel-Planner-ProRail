module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      keyframes: {
        moveTrain: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        moveTrain: 'moveTrain 10s linear infinite',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        'roboto-light': ['Roboto Light', 'Roboto', 'sans-serif'],
      },
      colors: {
        blue: {
          950: '#2C2A3B',
        },
        red: {
          950: '#AA1717',
          850: '#B20A2F',
        },
        gray: {
          750: '#F8F8F8',
          850: '#EDEDED',
          950: '#535266',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('daisyui')],
  // daisyUI config (optional - here are the default values)
  daisyui: {
    themes: [
      {
        myTheme: {
          // this name is what you'll use in class="myTheme"
          primary: '#B20A2F', // primary color
          'primary-focus': '#8462f4', // primary color - focused
          'primary-content': '#F8F8F8', // foreground color for primary background

          // other colors...
          info: '#2094f3', // info color
          success: '#009485', // success color
          warning: '#ff9900', // warning color
          error: '#ff5724', // error color

          // Your custom color
          'custom-color': '#5b21b6', // Custom color you want to use
        },
      },
      'light', // This will include the default light theme
    ],
  },
}
