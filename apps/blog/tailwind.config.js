const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          default: 'rgb(0, 53, 62)',
          shade: {
            0: '#000000',
            10: '#001f25',
            20: '#00363f',
            25: '#00424d',
            30: '#004e5b',
            35: '#005b69',
            40: '#006878',
            50: '#008396',
            60: '#009fb6',
            70: '#29bbd5',
            80: '#53d7f1',
            90: '#a6eeff',
            95: '#d6f6ff',
            98: '#effbff',
            99: '#f8fdff',
            100: '#ffffff',
          },
        },
        secondary: {
          default: 'rgb(225, 225, 127)',
          shade: {
            0: '#000000',
            10: '#1d1d00',
            20: '#323200',
            25: '#3d3e00',
            30: '#494900',
            35: '#555500',
            40: '#616200',
            50: '#7b7b03',
            60: '#959525',
            70: '#b0b03f',
            80: '#cccc57',
            90: '#e8e870',
            95: '#f7f77c',
            98: '#ffff97',
            99: '#fffbff',
            100: '#ffffff',
          },
        },
        tertiary: {
          0: '#000000',
          10: '#30004a',
          20: '#491765',
          25: '#552471',
          30: '#62317d',
          35: '#6e3d8a',
          40: '#7b4997',
          50: '#9662b2',
          60: '#b17cce',
          70: '#cd96ea',
          80: '#e6b4ff',
          90: '#f5d9ff',
          95: '#fcebff',
          98: '#fff7fc',
          99: '#fffbff',
          100: '#ffffff',
        },
        accent: 'rgb(210, 188, 217)',
      },
      height: {
        bottomActionsBar: 'var(--bottom-actions-bar-height)',
        mainPageHeight: 'var(--main-page-height)',
      },
      maxHeight: {
        bottomActionsBar: 'var(--bottom-actions-bar-height)',
        mainPageHeight: 'var(--main-page-height)',
      },
      minHeight: {
        bottomActionsBar: 'var(--bottom-actions-bar-height)',
        mainPageHeight: 'var(--main-page-height)',
      },
    },
  },
  plugins: [],
};
