import React, { useContext, useState } from "react"
import Cookies from "universal-cookie"
import { AuthContext } from "../auth_utils/authContext"
import Items from "../components/items"

export default function Home() {
    const [search, setSearch] = useState("")
    const [shop, setShop] = useState("")
    const [productsPage, setProductsPage] = useState("")
    const [shopState, setShopState] = useState(true)
    const [items, setItems] = useState([])
    const {auth, setAuth} = useContext(AuthContext)
    const cookies = new Cookies()

    const url = "https://bot-server.joshshen.workers.dev/stock_check"
    const auth_url = "https://authorization-server.joshshen.workers.dev/"
    
    const handleChange = (e) => {
        e.preventDefault()

        const index = e.target.selectedIndex
        const optionElement = e.target.childNodes[index]
        const shop = optionElement.getAttribute("data-shop")
        const productsJSON = optionElement.getAttribute("data-productsjson")

        setShop(shop)
        setProductsPage(productsJSON)
        if (index !== 0){
            setShopState(false)
        }
        else {
            setShopState(true)
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault()

        const body = {
            base_url: shop,
            products_json: productsPage,
            keyword: search.toUpperCase()
        }
        getAuth()
        if (auth === "true"){ sendSearch(body) }
    }
    const sendSearch = async (data) => {
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
    const clearPage = (e) => {
        e.preventDefault()

        setItems([])
    }
    const getAuth = async () => {
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
    const resetAuth = (e) => {
        e.preventDefault()

        setAuth("false")
    }

    return (
        <div>
            <div style={{position: "absolute", right: "0%", top: "0%"}}>
                <button className="btn btn-link" onClick={resetAuth}>exit</button>
            </div>
            <div className="container">
                <main className="site-main">
                    <form onSubmit={handleSubmit}>
                        <div className="grid">
                            <div className="cell">
                                <select className="full-width" onChange={handleChange}>
                                    <option>---</option>
                                    <option
                                        data-shop="https://fearofgod.com/"
                                        data-productsjson="https://fearofgod.com/collections/essentials/products.json"
                                    >
                                        essentials
                                    </option>
                                    <option
                                        data-shop="https://inakapower.com/"
                                        data-productsjson="https://inakapower.com/collections/apparel/products.json?limit=250"
                                    >
                                        inaka
                                    </option>
                                    <option
                                        data-shop="https://ronindivision.com/"
                                        data-productsjson="https://ronindivision.com/collections/frontpage/products.json?limit=250"
                                    >
                                        ronin
                                    </option>
                                </select>
                            </div>
                            <div className="cell">
                                <input 
                                    required 
                                    className="form-control full-width"
                                    type="text" 
                                    name="name" 
                                    value={search} 
                                    onChange={e => setSearch(e.target.value)} 
                                />
                            </div>
                        </div>
                        <br/>
                        <div className="cell">
                                <input className="full-width" disabled={shopState} type="submit" value="search" />
                        </div>
                    </form>
                    <Items items={items}/>
                </main>
            </div>
            <div style={{position: "absolute", left: "0%", top: "0%"}}>
                <button className="btn btn-link" onClick={clearPage}>clear</button>
            </div>
        </div>
    )
}
