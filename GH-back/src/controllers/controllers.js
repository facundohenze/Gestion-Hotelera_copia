// Controladores: lógica para manejar requests y responses

import { getCliente, getHotelPorCategoria, getTodosHoteles, getHabitacionesPorHotel, getReservasPorHotel } from "../services/services.js";
import { createReserva, updateReserva, deleteReserva } from "../services/services.js";

// obtener un cliente por su id
export async function fetchCliente(req, res) {
    try {
        const idCliente = parseInt(req.params.idCliente, 10); // Obtener idCliente de los parámetros
        if (isNaN(idCliente) || idCliente <= 0) {
            return res.status(400).json({
                success: false,
                message: "ID de cliente inválido"
            });
        }
        const cliente = await getCliente(idCliente);
        if (!cliente || cliente.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Cliente no encontrado"
            });
        }
        res.json({
            success: true,
            data: cliente[0]
        });
    } catch (error) {
        console.error("❌ Error en fetchCliente:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

// obtener hotel por categoria
export async function fetchHotelPorCategoria(req, res) {
    try {
        // Acepta categoría desde params, query o body
        const raw = req.params.categoria ?? req.query.categoria ?? req.body.categoria;
        if (raw === undefined || raw === null || String(raw).trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Categoría requerida"
            });
        }

        const categoria = String(raw).trim();

        // Validar como entero entre 1 y 5
        if (!/^[1-5]$/.test(categoria)) {
            return res.status(400).json({
                success: false,
                message: "Categoría inválida"
            });
        }

        // Llamar al service
        const hoteles = await getHotelPorCategoria(categoria);

        // Devolver lista completa (service ya devuelve array)
        return res.json({
            success: true,
            data: Array.isArray(hoteles) ? hoteles : []
        });

    } catch (error) {
        console.error("❌ Error en fetchHotelPorCategoria:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

// obtener todos los hoteles
export async function fetchTodosHoteles(req, res) {
    try {
        const hoteles = await getTodosHoteles(); // Llamar al service
        return res.json({
            success: true,
            data: Array.isArray(hoteles) ? hoteles : []
        });

    }
    catch (error) {
        console.error("❌ Error en fetchTodosHoteles:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}


// obtener todas las habitaciones de un hotel (por idHotel)
export async function fetchHabitacionesPorHotel(req, res) {
    try {
        const idHotel = parseInt(req.params.idHotel, 10); // Obtener idHotel de los parámetros
        if (isNaN(idHotel) || idHotel <= 0) { // Validar idHotel
            return res.status(400).json({
                success: false,
                message: "ID de hotel inválido"
            });
        }
        const habitaciones = await getHabitacionesPorHotel(idHotel); // Llamar al service
        return res.json({
            success: true,
            data: Array.isArray(habitaciones) ? habitaciones : []
        });
    } catch (error) {
        console.error("❌ Error en fetchHabitacionesPorHotel:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }

}

// obtener todas las reservas de un hotel (por idHotel)
// ✅ Listar reservas por hotel
export async function fetchReservasPorHotel(req, res) {
    try {
        const idHotel = parseInt(req.params.idHotel, 10);
        const reservas = await getReservasPorHotel(idHotel);
        res.json({ success: true, data: reservas });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al obtener reservas" });
    }
}

// obtener todos las reservas
export async function fetchTodosReservas(req, res) {
    try {
        const reservas = await getTodosReservas(); // Llamar al service
        return res.json({
            success: true,
            data: Array.isArray(reservas) ? reservas : []
        });

    }
    catch (error) {
        console.error("❌ Error en fetchTodosReservas:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

// ✅ Crear reserva
export async function crearReserva(req, res) {
    try {
        await createReserva(req.body);
        res.json({ success: true, message: "Reserva creada correctamente" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al crear reserva" });
    }
}

// ✅ Actualizar reserva
export async function actualizarReserva(req, res) {
    try {
        await updateReserva(req.body);
        res.json({ success: true, message: "Reserva actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al actualizar reserva" });
    }
}

// ✅ Eliminar reserva
export async function eliminarReserva(req, res) {
    try {
        const id = parseInt(req.params.idReserva, 10);
        await deleteReserva(id);
        res.json({ success: true, message: "Reserva eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al eliminar reserva" });
    }
}
