import { createContext, useContext, useState, useEffect } from "react"
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        // Decodificar o token JWT
        const decoded = jwtDecode(token)
        // Verificando se o token ainda está valido
        const tokenExp = decoded?.exp * 1000
        const currentTime = Date.now()
        if (currentTime > tokenExp) {
          console.log("Token expirado")
          localStorage.removeItem("token")
          setUser(null)
        } else {
          setUser(decoded)
        }
      } catch (error) {
        console.error("Token inválido", error)
        localStorage.removeItem("token")
      }
    }
    setLoading(false)
  }, [])

  const login = (token) => {
    const decoded = jwtDecode(token)
    setUser(decoded)
    localStorage.setItem("token", token)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
