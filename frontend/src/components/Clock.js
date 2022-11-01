import React, { useEffect, useState } from "react"

export default function Clock(){
    const [clockState, setClockState] = useState()

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
        </div>     
    )
}
