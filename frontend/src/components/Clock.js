import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Cookies from "universal-cookie"
import { AuthContext } from "../auth_utils/AuthContext"

export default function Clock(){
    const [clockState, setClockState] = useState()
    const [password, setPassword] = useState("")
    const {auth, setAuth} = useContext(AuthContext)
    const cookies = new Cookies(); 

    const url = "https://authorization-server.joshshen.workers.dev/"

    const handleSubmit = async (e) => {
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
    const getAuth = async () => {
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
    const resetAuth = (e) => {
        e.preventDefault()

        setAuth("false")
        setPassword("")
    }

    function Time(){
        const date = new Date()
    
        let h = date.getHours()
        let m = date.getMinutes()
        let s = date.getSeconds()
                
        h = (h < 10) ? "0" + h : h;
        m = (m < 10) ? "0" + m : m;
        s = (s < 10) ? "0" + s : s;

        let time = h + ":" + m + ":" + s
        setClockState(time)
    }
    useEffect(() => {
        setInterval(Time, 1)
    }, [])

    return (
        <div>
            <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",fontSize: "1.5em"}}>
                {clockState}
            </div>  
            <div>
            {auth === "true" ? 
                <div style={{fontSize:"0.9em"}}>
                    <Link style={{position: "absolute", left: "0%"}}to="/bot">
                        <button className="btn btn-link">enter</button>
                    </Link> 
                    <button className="btn btn-link" style={{position: "absolute", right: "0%"}} onClick={resetAuth}>exit</button>
                </div>
                : 
                <form onSubmit={handleSubmit} style={{position: "absolute", left: "50%", top: "53%", transform: "translate(-50%, -50%)"}}>
                    <input 
                        required 
                        type="text" 
                        name="name"
                        style={{textAlign:"center", border:"none", fontSize:"0.9em"}}
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                    />
                </form>}
            </div>
        </div>  
    )
}