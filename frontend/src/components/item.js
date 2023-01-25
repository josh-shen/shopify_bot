import React from "react"

const Item = ({name, image, available, sold_out}) => {
    return (
        <div className="cell cell-3">
            <div className="card">
                <header className="card-header">{name}</header>
                <img src={image} alt="product"></img>
                <div className="card-body">
                    <>available: </>
                    {available.map((data, i) => {
                        return (
                            <div key={i-1}>
                                <a key={i} href={data.checkout_link}>{data.size}</a>
                                <span key={i+1}>{" "}${data.price}</span>
                            </div>     
                        )})}
                </div>
                <div className="card-body">
                    {sold_out.map((size, i) => {
                        return (
                            <span key={i}>{size}{" "}</span>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Item
