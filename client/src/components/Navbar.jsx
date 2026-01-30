import { useState } from "react"
import { Link } from "react-router-dom"

import { CgProfile } from "react-icons/cg"
import { BiLogOutCircle } from "react-icons/bi";

import { useAuth } from '../context/auth/AuthContext'

export const Navbar = () => {
    const { user, isAuthenticated, logout, setLoading } = useAuth()
    const [isOpen, setIsOpen] = useState(false)

    const titleUser = () => {
        const username = user && isAuthenticated ? `- ${user.username}` : ''
        return username
    }
    const letterUser = () => {
        const letter = user && isAuthenticated ? user.username[0].toUpperCase() : ''
        return letter
    }

    const closeSession = () => {
        logout()
    }

    const jsxml =
        <nav className="navStyle">
            <h1><Link to="/" title="Go Home">CMS Manager <b className="titleNavbar">{titleUser()}</b></Link></h1>
            <ul className="ulNavbar">
                {
                    isAuthenticated ? (
                        <>
                            <li hidden={user.userRol >= 1 ? false : true}>
                                <Link to="/tasks" className="NavbarButton" title="Open tasks">Tasks</Link>
                            </li>
                            <li hidden={user.userRol >= 1 ? false : true}>
                                <Link to="/tasks/new" className="NavbarButton" title="New task">New task</Link>
                            </li>
                            <li hidden={user.userRol == 0 ? false : true}>
                                <Link to="/" onClick={closeSession} className="NavbarButton" title="Logout">Logout</Link>
                            </li>
                            <li hidden={user.userRol >= 1 ? false : true}>
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="NavbarButtonRound"
                                >{letterUser()}</button>

                                {isOpen && (
                                    <>
                                        {/* Capa invisible para cerrar al hacer clic fuera */}
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setIsOpen(false)}
                                        ></div>

                                        <div className="NavbarButtonWindow-container">
                                            <div>
                                                <Link to={`/profile/${user.id}`} className="NavbarButtonWindow" title="User profile"><CgProfile /><p>Profile</p></Link>
                                                <Link to="/" onClick={closeSession} className="NavbarButtonWindow" title="Logout"><BiLogOutCircle /><p>Logout</p></Link>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </li>
                        </>
                    )
                        :
                        (
                            <>
                                <li>
                                    <Link to="/login" className="NavbarButton" title="Login">Login</Link>
                                </li>
                                <li>
                                    <Link to="/register" className="NavbarButton" title="Register">Register</Link>
                                </li>
                            </>
                        )
                }
            </ul>
        </nav>

    return jsxml
}
