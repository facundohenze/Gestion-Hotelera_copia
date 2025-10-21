import { useState } from "react"
import { Formulario } from "./components/Formulario"
import { Home } from "./pages/Home"

function Login() {
  const [user, setUser] = useState(null)

  return (
    <div className="login-form">
      {
        user === null
        ? <Formulario setUser={setUser} />
        : <Home />
      }
    </div>
  )
}

export { Login }