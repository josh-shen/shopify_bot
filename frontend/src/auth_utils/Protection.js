import {Outlet, Navigate} from "react-router-dom"

const ProtectedRoute = () => {
    let auth = {token: true} //temporary - will implement jwt auth later

    return (
        auth.token ? <Outlet/> : <Navigate to="/"/>
    )
}

export default ProtectedRoute
