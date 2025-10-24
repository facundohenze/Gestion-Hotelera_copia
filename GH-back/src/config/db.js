import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,        
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hotel', 
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
    queueLimit: 0
});

// Probar conexión
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log(`✅ MySQL conectado a la base de datos: ${process.env.DB_NAME}`);
        connection.release();
    } catch (error) {
        console.error("❌ Error conectando a MySQL:", error.message);
    }
}

export { pool as default, testConnection };
