import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../estilos/formulario.css'

export function Formulario({ setUser }) {
    const [usuario, setUsuario] = useState('')
    const [contrasena, setContrasena] = useState('')
    const [error, setError] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3001/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ usuario, contrasena }),
            });

            const data = await response.json();

            // 🔹 Verificación de éxito
            if (!response.ok || !data.ok) {
                throw new Error(data.mensaje || "Credenciales incorrectas");
            }

            // 🔹 Guardar token y datos de usuario
            localStorage.setItem("token", data.token);

            // Guarda también los datos decodificados que envía el backend
            setUser({
                idUsuario: data.datos.idUsuario,
                usuario: data.datos.usuario,
                rol: data.datos.rol,
            });

            // 🔹 Redirigir al Home
            navigate("/home");
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setError(true);
        }
    };

    return (
        <section>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label>Usuario:</label>
                <input type="text" id='usuario'
                    value={usuario} onChange={(e) => setUsuario(e.target.value)}
                />
                <label>Contraseña:</label>
                <input type="password" id='contrasena'
                    value={contrasena} onChange={(e) => setContrasena(e.target.value)}
                />
                <button>Login</button>
                {error && <p style={{ color: 'red' }}>Credenciales incorrectas</p>}
            </form>
        </section>
    )
}