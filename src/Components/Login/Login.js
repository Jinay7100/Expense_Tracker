import React, { useEffect, useState } from 'react'
import "./Login.css"
import loginImg from "../../assets/login/login.jpg"
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Axios from '../../utils/axios'
import { useAuth } from '../../utils/AuthContext'

const Login = () => {
    const { login, loggedIn } = useAuth();
    const navigate = useNavigate()

    const [user, setUser] = useState({
        "loginuname": "",
        "loginpassword1": ""
    })

    const handleLogin = async () => {
        try {
            const res = await login(user)
            if (res) {
                navigate('/')
            }
        } catch (e) {
            console.log(e.message)
        }
    }

    useEffect(() => {
        if (loggedIn)
            navigate('/')
    }, [])

    return (
        <div className='container-fluid vh-100'>
            <div className="row ">
                <div className="col-6">
                    <img src={loginImg} alt="" className='login-img' />
                </div>
                <div className="col-6 login-bg d-flex justify-content-center align-items-center ">
                    <div className="login-content ">
                        {/* <form> */}
                        <div className="py-2 ">
                            <label htmlFor='username'>Username</label >
                            <input type="text" id='username' className='w-100 login-fields' placeholder='Username' onChange={(e) => { setUser({ ...user, "loginuname": e.target.value }) }} />
                        </div>
                        <div className="py-2">
                            <label htmlFor="password">Password</label>
                            <input type="password" id='password' placeholder='Password' className='w-100 login-fields' onChange={(e) => { setUser({ ...user, "loginpassword1": e.target.value }) }} />
                        </div>
                        <div className="row justify-content-center align-items-center">
                            <div className="col-4">
                                <button className='w-100 btn btn-success text-center' onClick={() => { handleLogin() }}>Login</button>
                            </div>
                        </div>
                        {/* </form> */}
                        <p>Don't have an account?
                            <Link to='/register'>
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
