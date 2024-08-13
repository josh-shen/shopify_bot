import React from "react"

export default function Item({name, image, available, sold_out, setImageSource}) {

    return (
        <div 
            id="item" 
            onMouseEnter={() => {
                setImageSource(image)
            }}
            onMouseLeave={() => {
                setImageSource("")
            }}
        >
            <b>{name}</b>
            {available.map((data, i) => {
                return (
                    <div key={i-1}>
                        <a key={i} href={data.checkout_link}>{data.size}</a>
                        <span key={i+1}>{" "}${data.price}</span>
                    </div>     
            )})}
            <span id="sold-out"> SOLD OUT --{" "}
            {sold_out.map((size, i) => {
                return (
                    <span key={i}>{size}{" "}</span>
                )
            })}  
            </span>                  
        </div>
    )
}