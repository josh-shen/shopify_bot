import React, { useEffect, useState } from "react"
import Cookies from "universal-cookie"

export default function Clock(){
    const [clockState, setClockState] = useState()
    const [password, setPassword] = useState("")

    const url = "http://192.168.1.251:8787"
    
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

        const cookies = new Cookies(); 
        cookies.set('token', token, { path: '/' });
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
            {clockState}  
            <form onSubmit={handleSubmit}>
                <input 
                    required 
                    className="form-control full-width"
                    type="text" 
                    name="name" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                />
            </form>
        </div>     
    )
}
