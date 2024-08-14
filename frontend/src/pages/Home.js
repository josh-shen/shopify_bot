import React, { useContext, useState } from "react"
import { Link } from "react-router-dom"
import Cookies from "universal-cookie"
import { AuthContext } from "../auth_utils/authContext"
import Items from "../components/items"
import "../styles/home.css"

export default function Home() {
    const [search, setSearch] = useState("")
    const [shop, setShop] = useState("")
    const [productsPage, setProductsPage] = useState("")
    const [items, setItems] = useState([])
    const {auth, setAuth} = useContext(AuthContext)
    const cookies = new Cookies()
    const [imageSource, setImageSource] = useState("")

    const url = "https://bot-server.joshshen.workers.dev/stock_check"
    const auth_url = "https://authorization-server.joshshen.workers.dev/"
    
    function handleChange(e) {
        e.preventDefault()

        const shop = e.target.value
        const productsJSON = shop + "/products.json?limit=250"

        setShop(shop)
        setProductsPage(productsJSON)
    }
    async function handleSubmit(e) {
        e.preventDefault()

        const body = {
            base_url: shop,
            products_json: productsPage,
            keyword: search.toUpperCase()
        }
        getAuth()
        if (auth === "true"){ sendSearch(body) }
    }
    async function sendSearch(data) {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })

        const items = await response.json()
        setItems(items)
    }
    function clearPage(e) {
        e.preventDefault()

        setSearch("")
        setShop("")
        setItems([])
    }
    async function getAuth() {
        const data = {
          header: "VERIFY",
          payload: cookies.get("token") 
        }
        const response = await fetch(auth_url, {      
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        })
        const text = await response.text()
        setAuth(text)
    }

    return (
        <div id="container">
            <div id="left">
                <form id="form" onSubmit={handleSubmit}>
                    <div>
                        <input
                            className="query"
                            required
                            type="text"
                            name="store"
                            placeholder="store"
                            autoComplete="off"
                            value={shop}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input 
                            className="query"
                            required 
                            type="text" 
                            name="name"
                            placeholder="item"
                            autoComplete="off"
                            value={search} 
                            onChange={e => setSearch(e.target.value)} 
                        />
                    </div>
                    <div id="buttons">
                        <Link to="/" className="b">return</Link>
                        {" "}
                        <button className="b" onClick={clearPage}>clear</button>
                        {" "}
                        <input className="b" type="submit" value="search" />
                    </div>
                </form>
                <div>
                    <img id="image" src={imageSource} alt=""/>
                </div>
            </div>
            <div id="right">
                <Items items={items} setImageSource={setImageSource}/>
            </div>
        </div>
    )
}
