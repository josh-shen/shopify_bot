import React from "react"
import { Link } from "react-router-dom"
import "../styles/about.css"

export default function About() {

    return (
        <div id="text-container">
            <div>
                This is a web scrapper bot built to work with online Shopify sites. 
                The goal of this bot is to reduce the time to select an item, add it to cart, and checkout, by combining these steps into one search and one click.
                Here's how to use this bot:
                <br></br>
                <br></br>
                The bot takes two inputs - the first input should be a URL that specifies the Shopify site to search. The second input is the keyword to search for. 
                This keyword can be something general, like "shirt" or "hoodie", or as specific as the exact item name. Items in stock will have a link available. 
                Clicking this link will add that item to a new cart and will direct you to the Shopify site's checkout page.
            </div>
            <div id="return">
                <Link to="/" d="return" className="buttons">return</Link>
            </div>
        </div>
    )
}