import React, { useEffect } from 'react'
import "./Navbar.css"
import Axios from '../../utils/axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../utils/AuthContext'
const Navbar = () => {
    const { logout, loggedIn } = useAuth()
    const navigate = useNavigate()
    const handleLogout = async () => {
        const res = await logout();
        if (res) {
            navigate("/login");
        }
    }

    useEffect(() => {
        if (!loggedIn) {
            navigate("/login")
        }
    }, [])

    return (
        <div>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container d-block">
                    <div className="row justify-content-between">
                        <div className="col-6 d-flex">
                            <a class="navbar-brand" href="#">Navbar</a>
                            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon"></span>
                            </button>
                            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                                <ul class="navbar-nav">
                                    <li class="nav-item dropdown">
                                        <a class="nav-link dropdown-toggle" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Record
                                        </a>
                                        <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                            <li><a class="dropdown-item" >Weekly</a></li>
                                            <li><a class="dropdown-item" >Monthly</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="profile col-6 d-flex justify-content-end">
                            <ul class="navbar-nav">
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Record
                                    </a>
                                    <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                        <li><a class="dropdown-item" >Settings</a></li>
                                        <li><a class="dropdown-item" >Activity Log</a></li>
                                        <li><a class="dropdown-item" onClick={() => { handleLogout() }}>Logout</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
