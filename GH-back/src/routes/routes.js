// Rutas: define los endpoints y mapea a los controladores

import { Router } from "express";
import { fetchCliente } from "../controllers/controllers.js";
import { fetchHotelPorCategoria } from "../controllers/controllers.js";
import { fetchTodosHoteles } from "../controllers/controllers.js";
import { fetchHabitacionesPorHotel } from "../controllers/controllers.js";


const router = Router();

// Ruta para obtener cliente por ID
router.get("/cliente/:idCliente", fetchCliente);

// Ruta de prueba para clientes
router.get("/clientes/test", (req, res) => {
    res.json({ message: "Ruta de clientes funcionando" });
});

// Ruta para obtener hotel por categoría
router.get("/categoria/:categoria", fetchHotelPorCategoria);
router.get("/hoteles", fetchHotelPorCategoria);

//ruta para obtener todos los hoteles
router.get("/todos-hoteles", fetchTodosHoteles);

// ruta para obtener habitaciones por idHotel
router.get("/habitaciones/hotel/:idHotel", fetchHabitacionesPorHotel);


export default router;

