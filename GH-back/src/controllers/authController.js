import jwt from "jsonwebtoken";
import pool from "../config/db.js"; // Tu conexión a MySQL
import dotenv from "dotenv";

dotenv.config();

export async function login(req, res) {
    const { usuario, contrasena } = req.body;

    try {
        // Buscar el usuario en la BD
        const [rows] = await pool.query(
            "SELECT * FROM usuario WHERE usuario = ?",
            [usuario]
        );

        if (rows.length === 0) {
            return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });
        }

        const user = rows[0];

        // Comparar contraseña (por ahora texto plano)
        if (user.contrasena !== contrasena) {
            return res.status(401).json({ ok: false, mensaje: "Contraseña incorrecta" });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: user.idUsuario, usuario: user.usuario },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.json({
            ok: true,
            mensaje: "Login exitoso",
            token,
            datos: {
                idUsuario: user.idUsuario,
                usuario: user.usuario,
                rol: user.rol,
            },
        });
    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ ok: false, mensaje: "Error interno del servidor" });
    }
}
