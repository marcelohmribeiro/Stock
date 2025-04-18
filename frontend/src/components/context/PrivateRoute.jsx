// PrivateRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "./AuthContext"

export default function PrivateRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return null

  if (!user) return <Navigate to="/login" state={{ from: location }} />

  const isAdminRoute = !location.pathname.startsWith("/checkout")

  // Se for user tentando acessar qualquer coisa que não seja /checkout
  if (user.role === "user" && isAdminRoute) {
    return <Navigate to="/checkout" />
  }

  return <Outlet />
}
