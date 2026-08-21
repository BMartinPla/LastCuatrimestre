import { useState } from 'react'

export function IngresoTexto() {

    const [texto, setTexto] = useState("");

    function fncOnChange(e) {
        setTexto(e.target.value);
    }

    return (
        <>
            <div>
                <h1 className={texto.length > 10 ? "text_negro" : "text_rojo"}>{texto}</h1>
                <input className={texto.length > 10 ? "text_negro" : "text_rojo"} type={Text} id="texto" name="texto" value={texto} onChange={fncOnChange}></input>
            </div>
            <h1>Texto</h1>
        </>
    )

}


export default IngresoTexto;