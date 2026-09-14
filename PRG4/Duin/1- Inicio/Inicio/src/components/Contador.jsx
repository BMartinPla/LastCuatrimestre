import { useState } from 'react'

export function Contador({fncTotal}) {

    const [contador, setContador] = useState(0);

    function fncCalculoTotal(valor) {
        setContador(contador + valor);
        fncTotal(valor);
    }
    //function fncSuma() {
    //    setContador(contador + 1);
    //    console.log(contador);
    //};
    //function fncResta() {
    //    setContador(contador - 1);
    //    console.log(contador);
    //};

    return ( 
        <>
            <div className="caja">
                <h2>Contador</h2>
                <hr></hr>
                <button className="btn" onClick={() => fncCalculoTotal(1)}>+</button>
                <button className="btn" onClick={() => fncCalculoTotal(-1)}>-</button>
                <p className={contador > 5 ? "nmr text_negro" : "nmr text_rojo"}>{contador}</p>
            </div>
        </>
    );
}

export default Contador;