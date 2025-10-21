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
