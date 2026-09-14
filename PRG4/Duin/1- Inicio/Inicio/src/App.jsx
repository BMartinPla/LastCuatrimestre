import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './style.css'
import Card from './components/Card.jsx'
import Contador from './components/Contador.jsx'
import IngresoTexto from './components/IngresoTexto.jsx'
import fncOnChange from './components/IngresoTexto.jsx'
import Personas from './components/Personas.jsx'
import './data/Personas.json'

function App() {
    const [count, setCount] = useState(0)
    const [total, setTotal] = useState(0)

    function fncTotalGeneral(avance) {
        setTotal(total + avance);
    }

  return (
      <>
          <div className="contenedor">

              <IngresoTexto></IngresoTexto>
              <hr></hr>
              <Card apellido="Silva" DNI="42428432"></Card>
              <Card apellido="Jordan" DNI="3238452"></Card>
              <Card apellido="Mordau" DNI="2431565"></Card>
              <h1>Total: {total}</h1>
              <Contador fncTotal={fncTotalGeneral}></Contador>
              <Contador fncTotal={fncTotalGeneral}></Contador>
              <Contador fncTotal={fncTotalGeneral}></Contador>
              <hr></hr>
              <Personas></Personas>

          </div>
    </>
  )
}


export default App
