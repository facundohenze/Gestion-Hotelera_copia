/* definicion de la estructura */
import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  direccion: { type: String, required: true },
  telefono: { type: String },
  email: { type: String },
  categoria: { type: Number, min: 1, max: 5 },
  imagenUrl: { type: String } // opcional, para mostrar fotos
});

// El primer parámetro ("Hotel") será el nombre del modelo,
// y Mongoose lo asocia a la colección "hotels" (en plural).
export default mongoose.model("Hotel", hotelSchema);
