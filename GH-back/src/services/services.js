// Servicios: lógica para interactuar con la base de datos
// Service que llama al procedimiento almacenado

import pool from "../config/db.js";

export async function getCliente(idCliente) {
    try {
        console.log(`🔍 Buscando cliente con ID: ${idCliente}`);

        // Ejecutamos el procedimiento buscarCliente
        const [rows] = await pool.query("CALL buscarCliente(?)", [idCliente]);

        console.log("📊 Resultado del procedimiento:", rows);

        // MySQL devuelve un array de arrays al usar CALL
        // rows[0] contiene el resultado del SELECT
        return rows[0];

    } catch (error) {
        console.error("❌ Error en getCliente:", error);
        throw error;
    }
}

export async function getHotelPorCategoria(categoria) {
    try {
        console.log(`🔍 Buscando hoteles en la categoría: ${categoria}`);

        // Ejecutamos el procedimiento buscarHotelPorCategoria
        const [rows] = await pool.query("CALL buscarHotelCategoria(?)", [categoria]);
        console.log("📊 Resultado del procedimiento:", rows);

        return rows[0]; // Devolvemos el primer conjunto de resultados
        
    } catch (error) {
        console.error("❌ Error en getHotelPorCategoria:", error);
        throw error;
    }
}

//obtener todos los hoteles
export async function getTodosHoteles() {
    try {
        console.log("🔍 Obteniendo todos los hoteles");
        const [rows] = await pool.query("SELECT * FROM hotel");
        console.log("📊 Hoteles encontrados:", rows);
        return rows; // Devolvemos el array de filas del SELECT
    } catch (error) {
        console.error("❌ Error en getTodosHoteles:", error);
        throw error;
    }
}

// obtener habitaciones por idHotel
export async function getHabitacionesPorHotel(idHotel) {
    try {
        console.log(`🔍 Buscando habitaciones para el hotel con ID: ${idHotel}`);
        const [rows] = await pool.query("CALL buscarHabitacionesHotel(?)", [idHotel]);
        console.log("📊 Resultado del procedimiento:", rows);
        return rows[0]; // Devolvemos el primer conjunto de resultados
    } catch (error) {
        console.error("❌ Error en getHabitacionesPorHotel:", error);
        throw error;
    }
}

// 🔹 Obtener reservas por hotel
export async function getReservasPorHotel(idHotel) {
    try {
        const [rows] = await pool.query("CALL buscarReservaHotel(?)", [idHotel]);
        return rows[0];
    } catch (error) {
        console.error("❌ Error en getReservasPorHotel:", error);
        throw error;
    }
}

// 🔹 Crear reserva
export async function createReserva(reserva) {
    const { idCliente, idHabitacion, fechaEntrada, fechaSalida, cantidadHuesped, estado, total } = reserva;
    try {
        const entradaSQL = fechaEntrada ? fechaEntrada.split('T')[0] : null;
        const salidaSQL = fechaSalida ? fechaSalida.split('T')[0] : null;
        const [result] = await pool.query(
            "CALL insertarReserva(?, ?, ?, ?, ?, ?, ?)",
            [idCliente, idHabitacion, entradaSQL, salidaSQL, cantidadHuesped, estado, total]
        );
        return result;
    } catch (error) {
        console.error("❌ Error en createReserva:", error);
        throw error;
    }
}

// 🔹 Actualizar reserva
export async function updateReserva(reserva) {
    const { idReserva, fechaEntrada, fechaSalida, estado, total } = reserva;
    try {
        // ✅ Convertir fechas al formato YYYY-MM-DD
        const entradaSQL = fechaEntrada ? fechaEntrada.split('T')[0] : null;
        const salidaSQL = fechaSalida ? fechaSalida.split('T')[0] : null;
        const [result] = await pool.query(
            "CALL actualizarReserva(?, ?, ?, ?, ?)",
            [idReserva, entradaSQL, salidaSQL, estado, total]
        );
        return result;
    } catch (error) {
        console.error("❌ Error en updateReserva:", error);
        throw error;
    }
}

// 🔹 Eliminar reserva
export async function deleteReserva(idReserva) {
    try {
        const [result] = await pool.query("CALL eliminarReserva(?)", [idReserva]);
        return result;
    } catch (error) {
        console.error("❌ Error en deleteReserva:", error);
        throw error;
    }
}
