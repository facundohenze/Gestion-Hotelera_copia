import { useEffect, useState } from "react";
import { Formulario } from "./components/Formulario";
import { Home } from "./pages/Home";

function Login() {
  const [user, setUser] = useState(null);

  // 🔹 Al montar el componente, verificar si hay un token en localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Consultar al backend los datos del usuario
    fetch("/login-data", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Token inválido o expirado");
        return res.json();
      })
      .then((data) => {
        if (data.ok) {
          setUser(data.datos); // datos del usuario decodificados desde el token
        }
      })
      .catch((err) => {
        console.error("Error verificando token:", err);
        localStorage.removeItem("token"); // eliminar token si ya no sirve
      });
  }, []);

  return (
    <div className="login-form">
      {user === null ? <Formulario setUser={setUser} /> : <Home />}
    </div>
  );
}

export { Login };
