// src/services/hotelMongoService.js
import Hotel from "../models/hotelMongo.js";

// Obtener todos los hoteles desde MongoDB
export async function getHotelesMongo() {
  try {
    const hoteles = await Hotel.find(); // SELECT * FROM hoteles
    return hoteles;
  } catch (error) {
    console.error("❌ Error en getHotelesMongo:", error);
    throw error;
  }
}
