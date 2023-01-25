import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { AuthContext } from "./authContext"

const ProtectedRoute = () => {
  const {auth} = useContext(AuthContext)

  return (
    auth === "true" ? <Outlet /> : <Navigate to="/" />
  )
}

export default ProtectedRoute