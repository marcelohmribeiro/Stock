import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext"

export default function PublicRoute({ children }) {
  const { user } = useAuth()

  if (user) {
    // Redireciona com base na role
    return <Navigate to={user.role === "admin" ? "/" : "/checkout"} />
  }

  return children
}
