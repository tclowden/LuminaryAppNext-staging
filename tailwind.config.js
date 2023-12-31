/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './pages/**/*.{js,ts,jsx,tsx}',
      './common/components/**/*.{js,ts,jsx,tsx}',
      './features/components/**/*.{js,ts,jsx,tsx}',
      './providers/**/*.{js,ts,jsx,tsx}',
      './utilities/colors/*.ts',
      './aerverActions/**/*.{js,ts,jsx,tsx}',
   ],
   darkMode: 'class',
   theme: {
      screens: {
         xs: '320px',
         sm: '480px',
         md: '768px',
         lg: '976px',
         xl: '1440px',
      },
      colors: {
         transparent: 'transparent',
         'lum-primary': '#1480eb',
         'lum-secondary': '#4F6372',
         'lum-success': '#09D770',
         'lum-info': '#05D1FA',
         'lum-warning': '#EB6E14',
         'lum-danger': '#EA3A2A',
         'lum-white': '#FFFFFF',
         'lum-black': '#10181E',
         'lum-blue': {
            100: '#DDECFA',
            200: '#B9D9F9',
            300: '#8ABFF5',
            400: '#4399EF',
            500: '#1480eb',
            600: '#1066BC',
            700: '#0C4D8D',
            800: '#08335E',
         },
         'lum-cyan': {
            200: '#CDF6FE',
            300: '#9BEDFD',
            400: '#50DFFB',
            500: '#05D1FA',
            600: '#04B4D7',
            700: '#0492AF',
            800: '#037187',
         },
         'lum-green': {
            // 100: '#E6FCF2',
            // 100: '#DCFDEE',
            100: '#D2FCE8',
            200: '#BAFCDB',
            300: '#85FABF',
            400: '#3BF799',
            500: '#09D770',
            550: '#08BF63',
            600: '#08B55E',
            700: '#06934C',
            800: '#05763D',
         },
         'lum-yellow': {
            200: '#FEF6CD',
            300: '#FDED9B',
            400: '#FBDF50',
            500: '#FAD105',
            600: '#DCB804',
            700: '#B49704',
            800: '#8C7503',
         },
         'lum-orange': {
            200: '#FAD9C2',
            300: '#F5B68A',
            400: '#F1995B',
            500: '#EB6E14',
            600: '#CA5E12',
            700: '#A44D0E',
            800: '#833D0B',
         },
         'lum-red': {
            200: '#F9C3BE',
            300: '#F4948B',
            400: '#EF695D',
            500: '#EA3A2A',
            600: '#CC2414',
            700: '#A71D11',
            800: '#762C13',
         },
         'lum-pink': {
            200: '#F4BDDE',
            300: '#ED91C8',
            400: '#E665B3',
            500: '#DB2492',
            600: '#BD1F7D',
            700: '#9A1966',
            800: '#76134F',
         },
         'lum-purple': {
            200: '#DEC2FA',
            300: '#C493F6',
            400: '#A65BF1',
            500: '#8014EB',
            600: '#6B11C5',
            700: '#540D9B',
            800: '#400A75',
         },
         'lum-gray': {
            25: '#F9FAFA',
            50: '#F4F5F6',
            100: '#E4E7E9',
            150: '#D4D9DC',
            200: '#C4CBD0',
            250: '#B4BCC2',
            300: '#A1ADB6',
            350: '#909EA8',
            400: '#7E8F9C',
            450: '#6C8190',
            500: '#5D7281',
            550: '#4F6372',
            600: '#425562',
            650: '#344551',
            675: '#2B3A45',
            700: '#25333D',
            750: '#1E2B34',
            775: '#19252D',
            800: '#141D24',
         },
      },
      fontFamily: {
         sans: ['Graphik', 'sans-serif'],
         serif: ['Merriweather', 'serif'],
      },
      extend: {
         keyframes: {
            fadeIn: {
               '0%': { opacity: 0, marginTop: -10 },
               '100%': { opacity: 1, marginTop: 0 },
            },
            shakeToast: {
               '0%': {},
               '70%': { marginLeft: 5, marginRight: 5 },
               '80%': { marginLeft: 0, marginRight: 0 },
               '90%': { marginLeft: 5, marginRight: 5 },
               '100%': { marginLeft: 0, marginRight: 0 },
            },
         },
         animation: {
            fadeIn: 'fadeIn .2s ease-in-out',
            shakeToast: 'fadeIn .2s ease-in-out, shakeToast 1.3s infinite',
         },

         boxShadow: {
            '012': '0px 1px 2px rgba(16, 24, 30, 0.15)',
         },
      },
   },
   plugins: [
      ({ addUtilities }) => {
         addUtilities({
            '.tooltip-lum-black': {
               '@apply bg-lum-black text-lum-white px-[6px] py-[4px] min-h-[20px] max-w-[250px] text-[12px] rounded text-left break-normal leading-[14px]':
                  {},
            },
            '[contentEditable=true]:empty:before': {
               content: 'attr(data-placeholder)',
               opacity: '0.4',
               // '@apply text-lum-gray-300': {},
            },
         });
      },
   ],
   experimental: {
      // https://github.com/tailwindlabs/tailwindcss/discussions/7411#discussioncomment-2157978
      optimizeUniversalDefaults: true,
   },
   // safelist: [
   //    {
   //       pattern:
   //          /(bg|text|border|fill|stroke)-lum-(primary|secondary|success|info|warning|danger|white|black|blue|cyan|green|yellow|orange|red|pink|purple|gray)-(50|100|150|200|250|300|350|400|450|500|550|600|650|700|750|800)/,
   //       variants: [
   //          'dark',
   //          'hover',
   //          'dark:hover',
   //          'active',
   //          'dark:active',
   //          'enabled',
   //          'enabled:dark',
   //          'enabled:hover',
   //          'enabled:dark:hover',
   //          'enabled:active',
   //          'enabled:dark:active',
   //          'group-hover',
   //          'group-active',
   //       ],
   //    },
   // ],
};
