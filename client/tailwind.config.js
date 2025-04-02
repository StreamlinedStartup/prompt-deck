/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        // Add custom theme settings if needed
        colors: {
            primary: '#3b82f6', // Example blue
            secondary: '#6b7280', // Example gray
        }
    },
  },
  plugins: [
    // Add plugins like @tailwindcss/forms if needed
    // require('@tailwindcss/forms'),
  ],
}