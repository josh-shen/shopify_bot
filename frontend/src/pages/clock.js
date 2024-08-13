import React, { useContext, useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import Cookies from "universal-cookie"
import { AuthContext } from "../auth_utils/authContext"
import "../styles/clock.css"

export default function Clock(){
    const focusRef = useRef(null)
    const [clockState, setClockState] = useState()
    const [password, setPassword] = useState("")
    const {auth, setAuth} = useContext(AuthContext)
    const cookies = new Cookies(); 

    const url = "https://authorization-server.joshshen.workers.dev/"

    async function handleSubmit(e) {
        e.preventDefault()

        const data = {
            header: "LOGIN",
            payload: password
        }
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })

        const token = await response.text()

        cookies.set("token", token, { path: "/" });
        getAuth()
    }
    async function getAuth() {
        const data = {
          header: "VERIFY",
          payload: cookies.get("token") 
        }
        const response = await fetch(url, {      
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        })
        const text = await response.text()
        setAuth(text)
    }
    function resetAuth(e) {
        e.preventDefault()

        setAuth("false")
        setPassword("")
        cookies.set("token", "", { path: "/" })
    }
    function regainFocus() {
        focusRef.current.focus();
    };
    useEffect(() => {
        if (focusRef.current) {
            focusRef.current.focus();
        }
    }, []);

    function Time(){
        const date = new Date()
    
        let h = date.getHours()
        let m = date.getMinutes()
        let s = date.getSeconds()
                
        h = (h < 10) ? "0" + h : h
        m = (m < 10) ? "0" + m : m
        s = (s < 10) ? "0" + s : s

        let time = h + ":" + m + ":" + s
        setClockState(time)
    }
    useEffect(() => {
        setInterval(Time, 1)
    }, [])

    return (
        <div id="clock-container">
            <div id="clock">
                {clockState}
            </div>  
            <div>
                {auth === "true" ? 
                    <div id="grid">
                        <Link to="/bot" className="buttons">enter</Link> 
                        <Link to="/about" className="buttons">about</Link>
                        <button id="layer3" className="buttons" onClick={resetAuth}>exit</button>
                    </div>
                    : 
                    <form onSubmit={handleSubmit}>
                        <input 
                            id="entrance"
                            ref={focusRef}
                            onBlur={regainFocus}
                            autoFocus
                            autoComplete="off"
                            required 
                            type="password"
                            name="name"
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                        />
                    </form>}
            </div>
        </div>  
    )
}
