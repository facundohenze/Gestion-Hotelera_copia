import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { CardHabitaciones } from "../components/CardHabitaciones.jsx";
import "../estilos/habitaciones.css";

export function Habitaciones() {
    const [habitaciones, setHabitaciones] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabActiva, setTabActiva] = useState("habitaciones");
    const location = useLocation();
    const hotel = location.state;
    const [mostrarForm, setMostrarForm] = useState(false);


    const [formData, setFormData] = useState({
        idCliente: "",
        idHabitacion: "",
        fechaEntrada: "",
        fechaSalida: "",
        cantidadHuesped: "",
        estado: "",
        total: "",
    });


    useEffect(() => {
        if (hotel?.idHotel) {
            buscarHabitaciones(hotel.idHotel);
            buscarReservas(hotel.idHotel);
        }
    }, [hotel]);

    const buscarHabitaciones = async (idHotel) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token"); // 👈 recuperamos el token

        try {
            const response = await fetch(`http://localhost:3001/api/habitaciones/hotel/${idHotel}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // 👈 lo enviamos al backend
                },
            });
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


    const buscarReservas = async (idHotel) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token"); // 👈 recuperamos el token

        try {
            const response = await fetch(`http://localhost:3001/api/reservas/hotel/${idHotel}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // 👈 lo enviamos al backend
                },
            });
            const data = await response.json();

            if (response.ok && data.success) {
                setReservas(data.data);
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


    const editarReserva = async (reserva) => {
        const token = localStorage.getItem("token");

        // Pedimos al usuario los nuevos datos (solo ejemplo simple)
        const nuevaFechaEntrada = prompt("Nueva fecha de entrada (YYYY-MM-DD):", reserva.fechaEntrada);
        const nuevaFechaSalida = prompt("Nueva fecha de salida (YYYY-MM-DD):", reserva.fechaSalida);
        const nuevoEstado = prompt("Nuevo estado (pendiente / confirmada / cancelada):", reserva.estado);
        const nuevoTotal = prompt("Nuevo total:", reserva.total);

        // Si el usuario canceló algún campo, no hace nada
        if (!nuevaFechaEntrada || !nuevaFechaSalida || !nuevoEstado || !nuevoTotal) return;

        try {
            const response = await fetch("http://localhost:3001/api/reservas", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    idReserva: reserva.idReserva,
                    fechaEntrada: nuevaFechaEntrada,
                    fechaSalida: nuevaFechaSalida,
                    estado: nuevoEstado,
                    total: parseFloat(nuevoTotal),
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert("✅ Reserva actualizada correctamente");
                // Refrescamos la lista
                buscarReservas(hotel.idHotel);
            } else {
                alert("⚠️ Error: " + (data.message || "No se pudo actualizar"));
            }
        } catch (err) {
            console.error("Error al actualizar reserva:", err);
            alert("❌ Error de conexión al actualizar reserva");
        }
    };

    const crearReserva = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem("token");

        // Validar campos obligatorios
        if (
            !formData.idCliente ||
            !formData.idHabitacion ||
            !formData.fechaEntrada ||
            !formData.fechaSalida ||
            !formData.cantidadHuesped ||
            !formData.total
        ) {
            alert("⚠️ Todos los campos son obligatorios.");
            return;
        }

        // Convertir numéricos antes de enviar
        const reservaBody = {
            idCliente: Number(formData.idCliente),
            idHabitacion: Number(formData.idHabitacion),
            fechaEntrada: formData.fechaEntrada,
            fechaSalida: formData.fechaSalida,
            cantidadHuesped: Number(formData.cantidadHuesped),
            estado: formData.estado,
            total: Number(formData.total),
        };

        try {
            const response = await fetch("http://localhost:3001/api/reservas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(reservaBody),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Error al crear la reserva");

            alert("✅ Reserva creada con éxito");
            buscarReservas(hotel.idHotel);
        } catch (error) {
            console.error("Error al crear reserva:", error);
            alert("⚠️ Error al crear reserva: " + error.message);
        }
    };




    // 🔹 Eliminar reserva
    const eliminarReserva = async (idReserva) => {
        if (!window.confirm("¿Seguro que desea eliminar esta reserva?")) return;

        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:3001/api/reservas/${idReserva}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert("🗑️ Reserva eliminada correctamente");
                buscarReservas(hotel.idHotel);
            } else {
                alert(`⚠️ Error: ${data.message || "No se pudo eliminar la reserva"}`);
            }
        } catch (err) {
            console.error("Error al eliminar reserva:", err);
            alert("❌ Error al eliminar la reserva");
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
                                            idHabitacion={h.idHabitacion || h.idHabitacion || 0}
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
                            <h2>Gestión de Reservas</h2>



                            <table className="tabla-reservas">
                                <thead>
                                    <tr>
                                        <th>Cliente</th>
                                        <th>Habitación</th>
                                        <th>Entrada</th>
                                        <th>Salida</th>
                                        <th>Estado</th>
                                        <th>Total</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservas.map(r => (
                                        <tr key={r.idReserva}>
                                            <td>{r.nombre} {r.apellido}</td>
                                            <td>{r.numero}</td>
                                            <td>{r.fechaEntrada}</td>
                                            <td>{r.fechaSalida}</td>
                                            <td>{r.estado}</td>
                                            <td>${r.total}</td>
                                            <td>
                                                <button onClick={() => editarReserva(r)}>✏️</button>
                                                <button onClick={() => eliminarReserva(r.idReserva)}>🗑️</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button
                                className="btn-agregar"
                                onClick={() => setMostrarForm(!mostrarForm)}
                            >
                                {mostrarForm ? "Cancelar" : "➕ Agregar Reserva"}
                            </button>

                            {mostrarForm && (
                                <form onSubmit={crearReserva} className="form-reserva">
                                    <h3>Nueva Reserva</h3>
                                    <input
                                        type="number"
                                        name="idCliente"
                                        placeholder="ID Cliente"
                                        required
                                        value={formData.idCliente}
                                        onChange={(e) => setFormData({ ...formData, idCliente: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        name="idHabitacion"
                                        placeholder="ID Habitación"
                                        required
                                        value={formData.idHabitacion}
                                        onChange={(e) => setFormData({ ...formData, idHabitacion: e.target.value })}
                                    />
                                    <label for="fechaEntrada" style={{ margin: 0, padding: 0, fontSize: "14px" }}>Fecha de Entrada:</label>
                                    <input
                                        type="date"
                                        name="fechaEntrada"
                                        required
                                        value={formData.fechaEntrada}
                                        onChange={(e) => setFormData({ ...formData, fechaEntrada: e.target.value })}
                                    />
                                    <label for="fechaSalida" style={{ margin: 0, padding: 0, fontSize: "14px" }}>Fecha de Salida:</label>
                                    <input
                                        type="date"
                                        name="fechaSalida"
                                        required
                                        value={formData.fechaSalida}
                                        onChange={(e) => setFormData({ ...formData, fechaSalida: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        name="cantidadHuesped"
                                        placeholder="Cantidad Huéspedes"
                                        required
                                        value={formData.cantidadHuesped}
                                        onChange={(e) => setFormData({ ...formData, cantidadHuesped: e.target.value })}
                                    />
                                    <label for="fechaEntrada" style={{ margin: 0, padding: 0, fontSize: "14px" }}>Estado Reserva:</label>
                                    <select
                                        name="estado"
                                        value={formData.estado}
                                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                    >
                                        <option value="" disabled>Selecciona una opción</option>
                                        <option value="confirmada">confirmada</option>
                                        <option value="cancelada">cancelada</option>
                                        <option value="pendiente">pendiente</option>
                                    </select>
                                    <input
                                        type="number"
                                        name="total"
                                        step="0.01"
                                        placeholder="Total"
                                        required
                                        value={formData.total}
                                        onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                                    />
                                    <button type="submit" className="btn-guardar">Guardar Reserva</button>
                                </form>
                            )}


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
