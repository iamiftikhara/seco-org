export const theme = {
  colors: {
    primary: '#4B0082', // Deep Purple
    primaryHover: '#6B238E', // Lighter Purple for hover
    secondary: '#FFD700', // Gold
    secondaryHover: '#FFE44D', // Lighter Gold for hover
    text: {
      primary: '#1F2937',  // Dark gray for main text
      secondary: '#4B5563', // Medium gray for secondary text
      light: '#FFFFFF',    // White text
      accent: '#4B0082'    // Accent text color
    },
    background: {
      primary: '#FFFFFF',  // White
      secondary: '#F3F4F6', // Light gray
      overlay: 'rgba(0, 0, 0, 0.1)' // Overlay color
    },
    status: {
      upcoming: '#45c474',  // Green for upcoming events
      past: '#6B7280',      // Gray for past events
      upcomingBlink: '#FFD700' // Gold color for blinking effect
    }
  },
  fonts: {
    en: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'Roboto, Arial, sans-serif',
    },
    ur: {
      primary: '"BBC Reith Qalam", "Times New Roman", Arial, Verdana, Geneva, Helvetica, sans-serif',
      secondary: '"Noto Nastaliq Urdu", serif',
      // primary: '"Jameel Noori Nastaleeq", serif',
      // secondary: '"Noto Nastaliq Urdu", serif',
      // primary: 'Noto Nastaliq Urdu, serif',
      // secondary: 'Jameel Noori Nastaleeq, serif',
    }
  }
};