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

// Variable para almacenar los datos del usuario logueado
let currentUser = null;

// Probar conexión a la base de datos al iniciar
testConnection();


// Endpoint de login (consulta desde la BD)
app.post('/login', async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
      return res.status(400).json({ ok: false, mensaje: 'Debe ingresar usuario y contraseña' });
    }

    // Consultar en la base de datos
    const [rows] = await pool.query(
      'SELECT * FROM Usuario WHERE usuario = ? AND contrasena = ?',
      [usuario, contrasena]
    );

    if (rows.length > 0) {
      // Usuario encontrado
      const user = rows[0];
      currentUser = {
        id: user.idUsuario,
        usuario: user.usuario,
        rol: user.rol
      };

      res.json({ ok: true, datos: currentUser });
    } else {
      // Usuario no encontrado o credenciales incorrectas
      res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas' });
    }

  } catch (error) {
    console.error('❌ Error en /login:', error);
    res.status(500).json({ ok: false, mensaje: 'Error en el servidor' });
  }
});


// Endpoint para obtener datos del usuario
app.get('/login-data', (req, res) => {
  if (currentUser) {
    res.json({ ok: true, datos: currentUser });
  } else {
    res.status(401).json({ ok: false, mensaje: 'No hay usuario logueado' });
  }
});


// Logout
app.post('/logout', (req, res) => {
  currentUser = null;
  res.json({ ok: true, mensaje: 'Sesión cerrada correctamente' });
});


// Middleware para verificar si el usuario está autenticado
function verificarAutenticacion(req, res, next) {
  if (currentUser) {
    next();
  } else {
    res.status(401).json({ ok: false, mensaje: 'No autenticado. Debe iniciar sesión.' });
  }
}


// ============ RUTAS DE CLIENTES (PROTEGIDAS) ============
app.use('/api', verificarAutenticacion, clienteRoutes);
app.use('/api', verificarAutenticacion, hotelCategoriaRoutes);
app.use('/api', verificarAutenticacion, todosLosHotel);
app.use('/api', verificarAutenticacion, habitacionPorHotel);

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
