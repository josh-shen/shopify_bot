import React from "react"
import Item from "./item"
import "../styles/item.css"

export default function Items({items, setImageSource}) {

    return (
        <div>
            {items.map((item, i) => {
                return <Item key={i} {...item} setImageSource={setImageSource}/>
            })}
        </div>
    )
}