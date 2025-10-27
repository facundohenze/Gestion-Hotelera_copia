
import { getHotelesMongo } from "../services/hotelMongoService.js";

// Controlador para devolver los hoteles desde MongoDB
export async function fetchHotelesMongo(req, res) {
  try {
    const hoteles = await getHotelesMongo();

    if (!hoteles || hoteles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No hay hoteles en MongoDB",
      });
    }

    res.json({
      success: true,
      data: hoteles,
    });

  } catch (error) {
    console.error("❌ Error en fetchHotelesMongo:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
}
