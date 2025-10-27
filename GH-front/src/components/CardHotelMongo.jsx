import { useState } from "react";
import { Link } from "react-router-dom"
import "../estilos/card.css";

export const CardHotelMongo = ({ 
    idHotel,
    imagenUrl,
    nombre,
    categoria,
    direccion,
}) => {

    return (
        <div className="card">
            {imagenUrl && <img src={imagenUrl} alt={nombre} className="hotel-image" />}
            <h3>{nombre}</h3>
            <p>Categoría: {categoria}</p>
            <p>Dirección: {direccion}</p>
        </div>



    );



};