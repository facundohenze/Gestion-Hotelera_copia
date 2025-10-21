import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { CardHabitaciones } from "../components/CardHabitaciones.jsx";
import "../estilos/habitaciones.css";

export function Habitaciones() {
    const [habitaciones, setHabitaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabActiva, setTabActiva] = useState("habitaciones");
    const location = useLocation();
    const hotel = location.state;

    useEffect(() => {
        if (hotel?.idHotel) {
            buscarHabitaciones(hotel.idHotel);
        }
    }, [hotel]);

    const buscarHabitaciones = async (idHotel) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:3001/api/habitaciones/hotel/${idHotel}`);
            const data = await response.json();

            if (response.ok && data.success) {
                setHabitaciones(data.data);
            } else {
                setError(data.message || "No se pudieron cargar las habitaciones");
            }
        } catch (err) {
            console.error("Error al buscar habitaciones:", err);
            setError("Error de conexión al buscar habitaciones");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="habitaciones-container">

            <div className="tabs-vertical-container">
                {/* === Tabs laterales === */}
                <div className="tabs-vertical">
                    <Link to="/home">
                        <button className="volver-btn">Volver</button>
                    </Link>
                    <button
                        className={tabActiva === "habitaciones" ? "tab-vertical activa" : "tab-vertical"}
                        onClick={() => setTabActiva("habitaciones")}
                    >
                        HABITACIONES
                    </button>
                    <button
                        className={tabActiva === "reservas" ? "tab-vertical activa" : "tab-vertical"}
                        onClick={() => setTabActiva("reservas")}
                    >
                        RESERVAS
                    </button>
                    <button
                        className={tabActiva === "info" ? "tab-vertical activa" : "tab-vertical"}
                        onClick={() => setTabActiva("info")}
                    >
                        INFORMACION
                    </button>
                </div>

                {/* === Contenido de la pestaña === */}
                <div className="tab-content-vertical">
                    <h1>{hotel?.nombre}</h1>
                    {tabActiva === "habitaciones" && (
                        <>
                            {loading && <p>Cargando habitaciones...</p>}
                            {error && <p style={{ color: "red" }}>{error}</p>}
                            {!loading && !error && (
                                <div className="habitaciones-list">
                                    {habitaciones.map((h) => (
                                        <CardHabitaciones
                                            key={h.idHabitacion}
                                            imagenUrl={h.imagenUrl || ""}
                                            Habitación={h.numero}
                                            Tipo={h.tipo}
                                            Capacidad={h.capacidad}
                                            Estado={h.estado}
                                            Precio={h.precio}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {tabActiva === "reservas" && (
                        <div className="reservas-tab">
                            <p>Aquí podrías mostrar las reservas activas del hotel.</p>
                        </div>
                    )}

                    {tabActiva === "info" && (
                        <div className="info-tab">
                            <p><strong>Dirección:</strong> {hotel?.direccion}</p>
                            <p><strong>Teléfono:</strong> {hotel?.telefono}</p>
                            <p><strong>Email:</strong> {hotel?.email}</p>
                            <p><strong>Categoría:</strong> {hotel?.categoria} ⭐</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
