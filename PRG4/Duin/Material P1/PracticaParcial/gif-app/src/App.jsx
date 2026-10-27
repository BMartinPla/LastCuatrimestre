import {useState} from "react"

function App() {
  // Estado
  const [buscarNormal, setBuscarNormal] = useState('')
  const [buscar, setBuscar] = useState('')

  // Ciclo de vida
  function handleEnvio (e) {
    e.preventDefault()
  }

  function handleChange (e) {
    if (buscarNormal.length >= 3) {
      alert("puedepuede")
    }
    e.preventDefault()
    setBuscarNormal(e.target.value)
  }

  const manejarEnvio = (e) => {
    e.preventDefault()
  }
  // JSX

  return (
    <div className="App">
      <form onSubmit={handleEnvio}>
      <label>BuscarNormal:</label>
      <input value={buscarNormal} onChange={handleChange} />
      <h2>{buscarNormal}</h2>
      <button type="submit" disabled={buscarNormal.length < 3}>{buscarNormal.length < 3 ? "Escribir +" : "Enviar Normal"}</button>
      </form>

      <form onSubmit={manejarEnvio}>
      <label>Buscar:</label>
      <input type="text" value={buscar}
        onChange={(e) => setBuscar(e.target.value)} />
        <h2>{buscar}</h2>
      <button type="submit" disabled={buscar.length < 3}>
        Enviar
      </button>
    </form>
    </div>
  );
}

export default App
