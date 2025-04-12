import './App.css'
import ImageTrailDemo from './Components/imageTrail.jsx'
import Navbar from './Components/navbar.jsx'
import {ThemeProvider, useTheme} from './context/themeProvider.jsx'
import { useEffect } from 'react'
import React from 'react'

function App() {
  // const { theme } = useTheme();
  // useEffect(() => {
  //   document.documentElement.classList.remove('light', 'dark');
  //   document.documentElement.classList.add(theme);
  // }, [theme]);

  return (
    <ThemeProvider>
    <div className="dark:bg-foreground dark:text-muted bg-background text-foreground h-screen w-screen overflow-hidden">
      <Navbar/>
    <div className='ovrerflow-hidden'>
      <ImageTrailDemo/>
    </div>
    </div>
    </ThemeProvider>
  )
}

export default App
