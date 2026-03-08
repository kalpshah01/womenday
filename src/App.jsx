import { Routes, Route, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Landing from './pages/Landing'
import Name from './pages/Name'
import Photo from './pages/Photo'
import Card from './pages/Card'
import Feedback from './pages/Feedback'
import FloatingHearts from './components/FloatingHearts'

function App() {
  const location = useLocation()

  // Shared state passed via location.state between pages
  return (
    <div className="app-wrapper">
      <FloatingHearts />
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/name" element={<Name />} />
        <Route path="/photo" element={<Photo />} />
        <Route path="/card" element={<Card />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </div>
  )
}

export default App
