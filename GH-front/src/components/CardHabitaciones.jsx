import { useState } from "react";
import { Link } from "react-router-dom"
import "../estilos/card.css";

export const CardHabitaciones = ({
    idHabitacion,
    imagenUrl,
    Habitación,
    Tipo,
    Capacidad,
    Estado,
    Precio,
}) => {

    // Definimos el color según el estado
    const estadoClase = Estado?.toLowerCase() === "disponible" ? "estado-disponible" : "estado-ocupada";

    return (
        <div className="card">
            {imagenUrl
                ? <img src={imagenUrl} alt={Habitación || 'Habitación'} className="hotel-image" />
                : <img src="/placeholder-room.png" alt="sin imagen" className="hotel-image" /> /* opcional fallback ?*/
            }
            {/* <p>ID: {idHabitacion}</p> */}
            <h3>{Habitación} ID: {idHabitacion}</h3>
            <p>Tipo: {Tipo}</p>
            <p>Capacidad: {Capacidad}</p>
            {/* 🔹 Tarjeta de estado con color */}
            <div className={`estado-tag ${estadoClase}`}>
                {Estado}
            </div>
            <p>Precio: {Precio}</p>
        </div>
    );
};

