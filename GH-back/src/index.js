// Punto de entrada principal del servidor Express
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import clienteRoutes from './routes/routes.js';
import hotelCategoriaRoutes from './routes/routes.js';
import todosLosHotel from './routes/routes.js';
import habitacionPorHotel from './routes/routes.js';
import pool, { testConnection } from './config/db.js';
import { connectMongo } from "./config/mongo.js";
import authRoutes from './routes/authRoutes.js';
import jwt from "jsonwebtoken";


dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
// Servir archivos estáticos del frontend (después del build)
app.use(express.static(path.join(__dirname, '../login-front/dist')));


// Conexión a MongoDB
connectMongo();

// Probar conexión a la base de datos al iniciar
testConnection();


// Endpoint de login (consulta desde la BD)
app.post('/login', async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
      return res.status(400).json({ ok: false, mensaje: 'Debe ingresar usuario y contraseña' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM Usuario WHERE usuario = ? AND contrasena = ?',
      [usuario, contrasena]
    );

    if (rows.length === 0) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas' });
    }

    const user = rows[0];

    // 🔹 Generar token JWT (válido por 1 hora, por ejemplo)
    const token = jwt.sign(
      {
        idUsuario: user.idUsuario,
        usuario: user.usuario,
        rol: user.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      ok: true,
      mensaje: 'Login exitoso',
      token,
      datos: {
        idUsuario: user.idUsuario,
        usuario: user.usuario,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error('❌ Error en /login:', error);
    res.status(500).json({ ok: false, mensaje: 'Error en el servidor' });
  }
});


//Endpoint para obtener datos del usuario autenticado
app.get('/login-data', verificarAutenticacion, (req, res) => {
  // req.user viene del jwt.verify() del middleware
  res.json({ ok: true, datos: req.user });
});


// Logout
app.post('/logout', (req, res) => {
  currentUser = null;
  res.json({ ok: true, mensaje: 'Sesión cerrada correctamente' });
});


// Middleware para verificar si el usuario está autenticado
function verificarAutenticacion(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ ok: false, mensaje: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ ok: false, mensaje: 'Token inválido o expirado' });
    }
    req.user = user; // info del usuario decodificada
    next();
  });
}





app.use('/api/auth', authRoutes);
// ============ RUTAS DE CLIENTES (PROTEGIDAS) ============
app.use('/api', verificarAutenticacion, [
  clienteRoutes,
  hotelCategoriaRoutes,
  todosLosHotel,
  habitacionPorHotel
]);



// Ruta de prueba para el servidor
app.get('/api/test', (req, res) => {
  res.json({ message: 'Servidor funcionando correctamente' });
});

// Servir el frontend para todas las rutas no-API (Single Page Application)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../login-front/dist/index.html'));
});
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
