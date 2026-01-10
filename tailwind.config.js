/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./**/*.htm"], 
    theme: {
    extend: {
        screens: {
        '2xsm': '320px',
        'xsm': '460px',
        //sm 640px Huge Smartphones 
        //md 768px Pads
        //lg 1024px Small Desctops
        //xl 1280px Large Desctops
        //2xl	1536px	Very large Desctops
        '3xl': '1792px',
        '4xl': '2048px',
      },
    },
    },
    plugins: [],
}

