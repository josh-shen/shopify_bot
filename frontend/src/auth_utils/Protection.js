import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { AuthContext } from "./AuthContext"

const ProtectedRoute = () => {
  const {auth} = useContext(AuthContext)

  return (
    auth === "true" ? <Outlet /> : <Navigate to="/" />
  )
}

export default ProtectedRoute