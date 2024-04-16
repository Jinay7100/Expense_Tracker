import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Axios from './axios';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const initialState = {
        user: null,
        loggedIn: false
    }
    const storedState = JSON.parse(localStorage.getItem('appState')) || initialState;
    const [user, setUser] = useState(storedState.user);
    const [loggedIn, setLoggedIn] = useState(storedState.loggedIn);

    useEffect(() => {
        // Update local storage whenever state changes
        localStorage.setItem('appState', JSON.stringify({
            user,
            loggedIn
        }));
    }, [user, loggedIn]);

    useEffect(() => {
        const token = Cookies.get('my_session')
        if (token) {
            setUser(JSON.parse(token))
        }
    }, [])

    const login = async (userData) => {
        try {
            setUser(userData.loginuname)
            const res = await Axios.post("handlelogin/", userData)
            setLoggedIn(true)
            Cookies.set('user', JSON.stringify(userData), { expires: 1 })
            return true
        } catch (e) {
            console.log(e.message)
        }
    }

    const register = async (userData) => {
        try {
            // setUser(userData.uname)
            const res = await Axios.post("handleSignup/", userData)
            // setLoggedIn(true)
            // Cookies.set('user', JSON.stringify(userData), { expires: 1 })
            return true
        } catch (e) {
            console.log(e.message)
        }
    }

    const logout = async () => {
        try {
            const res = await Axios.get("handleLogout/")
            setLoggedIn(false)
            Cookies.remove('user');
            return true
        } catch (e) {
            console.log(e.message)
        }
    }

    console.log(loggedIn)

    const value = {
        user,
        login,
        logout,
        loggedIn,
        register
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}