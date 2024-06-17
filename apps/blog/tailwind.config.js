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
        primary: 'rgb(0, 53, 62)',
        secondary: 'rgb(225, 225, 127)',
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
