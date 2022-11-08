import {Navigate, Outlet} from "react-router-dom"
import Cookies from "universal-cookie"

const ProtectedRoute = () => {
  const cookies = new Cookies()

  return (
    cookies.get("auth") === "true" ? <Outlet /> : <Navigate to="/" />
  )
}

export default ProtectedRoute
