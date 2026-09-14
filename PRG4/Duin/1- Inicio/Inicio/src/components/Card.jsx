export function Card({ apellido, DNI }) {
    return (
        <>
            <div className="card">
                <p>Cliente: {apellido}</p>
                <small>DNI: {DNI}</small>
            </div>
        </>
    )

}

export default Card;