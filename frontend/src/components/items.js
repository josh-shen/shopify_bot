import React from "react"
import Item from "./item"

const Items = ({items}) => {
    return (
        <div className="grid">
            {items.map((item, i) => {
                return <Item class="cell" key={i} {...item}></Item>
            })}
        </div>
    )
}

export default Items
