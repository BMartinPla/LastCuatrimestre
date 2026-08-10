import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './style.css'
import Card from './components/Card.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
      <>
          <>
              <Card apellido="Silva" DNI="42428432"></Card>
              <Card apellido="Jordan" DNI="3238452"></Card>
              <Card apellido="Mordau" DNI="2431565"></Card>
          </>
          
    </>
  )
}

export default App
