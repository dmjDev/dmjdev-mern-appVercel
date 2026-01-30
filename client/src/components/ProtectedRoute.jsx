import { Navigate, Outlet } from "react-router-dom"

import { useAuth } from "../context/auth/AuthContext"

const ProtectedRoute = ({ rol }) => {
    const { user, loading, isAuthenticated } = useAuth()
    // console.log(rol, user, loading, isAuthenticated)

    if (loading) {
        const jsxmlLoad =
        <div className="containerLoad">
            <div className="subContainerLoad">
                <h1 className="loadText">Loading...</h1>
                </div>
            </div>
        return jsxmlLoad
    }

    if (isAuthenticated && user.userRol >= rol) {
        return <Outlet />
    } else {
        return <Navigate to='/' replace />
    }
}

export default ProtectedRoute
