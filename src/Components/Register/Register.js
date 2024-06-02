import React, { useState } from 'react'
import "./Register.css"
import { Link, useNavigate } from 'react-router-dom'
import { Axios } from 'axios'
import { useAuth } from '../../utils/AuthContext'

const Register = () => {
    const navigate = useNavigate()
    const { register } = useAuth()
    const [data, setData] = useState({
        "uname": "",
        "fname": "",
        "lname": "",
        "email": "",
        "profession": "",
        "Savings": "",
        "income": "",
        "pass1": "",
        "pass2": "",

    })

    const handleSignup = async () => {
        try {
            const res = await register(data)
            if (res) {
                navigate("/login")
            }
        } catch (e) {
            console.log(e.message)
        }
    }

    return (
        <div className="register-container">
            <div className='container '>
                <h1 className='text-center pt-3'>Register yourself</h1>
                <div className="register-content">
                    <form>
                        <div className="row">
                            <div className="col-6">
                                <div className="py-2">
                                    <label htmlFor='username'>Username</label >
                                    <input type="text" id='username' className='w-100 form-control login-fields' placeholder='Username' onChange={(e) => { setData({ ...data, uname: e.target.value }) }} />
                                </div>
                                <div className="py-2">
                                    <label htmlFor="first-name">First name</label>
                                    <input type="text" id='first-name' className='w-100 form-control login-fields' placeholder='first-name' onChange={(e) => { setData({ ...data, fname: e.target.value }) }} />
                                </div>
                                <div className="py-2">
                                    <label htmlFor="second-name">Last name</label>
                                    <input type="text" id='second-name' className='w-100 form-control form-control login-fields' placeholder='second-name' onChange={(e) => { setData({ ...data, lname: e.target.value }) }} />
                                </div>
                                <div className="py-2">
                                    <label htmlFor='email'>Email</label >
                                    <input type="email" id='email' className='w-100 form-control login-fields' placeholder='email' onChange={(e) => { setData({ ...data, email: e.target.value }) }} />
                                </div>
                                <div className="py-2">
                                    <label htmlFor='profession'>Profession</label >
                                    <select class="form-select" aria-label="Default select example" id='profession' onChange={(e) => { setData({ ...data, profession: e.target.value }) }}>
                                        <option selected value="Employee">Employee</option>
                                        <option value="Business">Business</option>
                                        <option value="student">student</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="py-2">
                                    <label htmlFor="Income">Income</label>
                                    <input type="text" id='Income' className='w-100 form-control login-fields' placeholder='Income' onChange={(e) => { setData({ ...data, income: e.target.value }) }} />
                                </div>
                                <div className="py-2">
                                    <label htmlFor="Savings">Savings</label>
                                    <input type="text" id='Savings' className='w-100 form-control login-fields' placeholder='Savings' onChange={(e) => { setData({ ...data, Savings: e.target.value }) }} />
                                </div>
                                <div className="py-2">
                                    <label htmlFor="password">Password</label>
                                    <input type="password" id='password' className='w-100 form-control login-fields' placeholder='Password' onChange={(e) => { setData({ ...data, pass1: e.target.value }) }} />
                                </div>
                                <div className="py-2">
                                    <label htmlFor="confirm-password">Confirm Password</label>
                                    <input type="password" id='confirm-password' className='w-100 form-control login-fields' placeholder='confirm-password' onChange={(e) => { setData({ ...data, pass2: e.target.value }) }} />
                                </div>
                            </div>
                            <div className="py-2">
                                <div className=' btn btn-success text-center' onClick={() => { handleSignup() }}>Register</div>
                                <p>Already have an account?
                                    <Link to='/login'>
                                        Login
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register
