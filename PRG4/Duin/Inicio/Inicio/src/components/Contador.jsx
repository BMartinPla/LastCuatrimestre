import { useState } from 'react'

export function Contador() {

    const [contador, setContador] = useState(0);
    function fncSuma() {
        setContador(contador + 1);
        console.log(contador);
    };
    function fncResta() {
        setContador(contador - 1);
        console.log(contador);
    };

    return ( 
        <>
            <div className="caja">
                <h2>Contador</h2>
                <hr></hr>
                <button className="btn" onClick={fncSuma}>+</button>
                <button className="btn" onClick={fncResta}>-</button>
                <p className={contador > 5 ? "nmr text_negro" : "nmr text_rojo"}>{contador}</p>
            </div>
        </>
    );
}

export default Contador;