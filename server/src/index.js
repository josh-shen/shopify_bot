const corsHeaders = {
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Origin': '*'
}
async function fetch_site(url) {
    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"
            }
        });

        if (!response.ok) {
            return false
        }

        return await response.json()  
    } catch (error) {
        console.error(error.message)
    }
}
function find(value, keyword) {
    let indexes = []
    let names = []

    const products = value["products"]

    for (let i = 0; i < products.length; i++) {
        let item = products[i]
        if (item.title.toUpperCase().includes(keyword)) {
            indexes.push(i)
            names.push(item.title)
        }
    }

    return [indexes, names]
}
function get_images(value, index) {
    const image = value["products"][index]["images"][0]["src"]

    return image
}
function stock_check(value, index) {
    let in_stock = []
    let out_stock = []
    let ids = []
    let prices = []

    let variants = value["products"][index]["variants"]

    for (let i = 0; i < variants.length; i++) {
        let variant = variants[i]
        
        if (variant.available === true) {
            in_stock.push(variant.title)
            ids.push(variant.id)
            prices.push(variant.price)
        }
        if (variant.available === false) {
            out_stock.push(variant.title)
        }
    }

    return [in_stock, out_stock, ids, prices]
}
function generate_links (base_url, variants, prices, ids) {
    let checkout = []

    for (let i = 0; i < ids.length; i++) {
        let path = "cart/" + ids[i] + ":1"
        let link = base_url + path

        let checkout_data = {
            "size": variants[i],
            "price": prices[i],
            "checkout_link": link
        }
        checkout.push(checkout_data)
    }

    return checkout
}

export default {
	async fetch(request, env, ctx) {
		if (request.method === "OPTIONS") {
            return new Response("OK", {headers: corsHeaders})
        }
        else if (request.method === "POST") {
            const body = await request.json()

            const base_url = body.base_url
            const products_json = body.products_json
            const keyword = body.keyword
            
            const data = await fetch_site(products_json)
            if (!data){
                return new Response("Could not find/access site")
            }

            const [indexes, names] = find(data, keyword)
            let items = []

            for (let i = 0; i < indexes.length; i++) {
                let src = get_images(data, indexes[i])
                let [in_stock, out_stock, ids, prices] = stock_check(data, indexes[i])

                let checkout = generate_links(base_url, in_stock, prices, ids)

                let item = {
                    "name": names[i],
                    "image": src,
                    "available": checkout,
                    "sold_out": out_stock
                }
                items.push(item)
            }

            return Response.json(items)
        }
	}
};
