/* insercion de datos iniciales */

import mongoose from "mongoose";
import dotenv from "dotenv";
import Hotel from "../src/models/hotelMongo.js";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });


const hoteles = [
  {
    nombre: "Hotel Welcome",
    direccion: "San Jerónimo 125, Córdoba",
    telefono: "351-4567890",
    email: "info@welcome.com",
    categoria: 3,
    imagenUrl: "https://res.cloudinary.com/duv3az4qy/image/upload/v1760715721/hotel_welcome_nz5lmu.jpg"
  },
  {
    nombre: "De la Cañada",
    direccion: "Marcelo T. de Alvear 580, Córdoba",
    telefono: "351-4789563",
    email: "contacto@delacaniada.com",
    categoria: 4,
    imagenUrl: "https://res.cloudinary.com/duv3az4qy/image/upload/v1760714661/hotel_ca%C3%B1ada_uifyyk.webp"
  },
  {
    nombre: "Panorama",
    direccion: "Av. Colón 550, Córdoba",
    telefono: "351-4321987",
    email: "info@panorama.com",
    categoria: 5,
    imagenUrl: "https://res.cloudinary.com/duv3az4qy/image/upload/v1760715927/hotel_nh_bew4k6.jpg"
  }
];

async function insertHoteles() {
  try {
    console.log("🔍 MONGO_URI:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);

    await Hotel.deleteMany({});
    console.log("🧹 Hoteles anteriores eliminados.");

    await Hotel.insertMany(hoteles);
    console.log("✅ Nuevos hoteles insertados en MongoDB.");

  } catch (error) {
    console.error("❌ Error insertando hoteles:", error);
  } finally {
    mongoose.connection.close();
  }
}

insertHoteles();
