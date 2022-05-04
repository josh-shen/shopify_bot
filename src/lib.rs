use worker::*;
use url::Url;
use serde::{Serialize};
use serde_json::Value;
use itertools::izip;

mod utils;

fn log_request(req: &Request) {
    console_log!(
        "{} - [{}], located at: {:?}, within: {}",
        Date::now().to_string(),
        req.path(),
        req.cf().coordinates().unwrap_or_default(),
        req.cf().region().unwrap_or("unknown region".into())
    );
}

#[derive(Serialize)] 
struct Item<'a>{
    name: &'a Value,
    available: Vec<Links<'a>>,
    sold_out: Vec<&'a Value>
}

#[derive(Serialize)] 
pub struct Links<'a>{
    size: &'a Value,
    price: &'a Value,
    checkout_link: String
}

pub async fn fetch(uri: &str) -> Value {
    let client = reqwest::Client::new();
    let response = client
    .get(uri)
    .header(reqwest::header::USER_AGENT, "v0.2.0")
    .send().await.unwrap()
    .json::<Value>().await.unwrap();

    return response
}
pub fn find(value: &Value, keyword: &str) -> (Vec<usize>, Vec<Value>) {
    let mut indexes = Vec::new();
    let mut names = Vec::new();

    let products = value["products"].as_array().unwrap();
    for i in 0..products.len() {
        for val in products[i].as_object().unwrap(){
            let (k, v) = val;
            if k == "title" && v.to_string().to_uppercase().contains(keyword){
                indexes.push(i);
                names.push(v.to_owned());
            }
        }
    }

    return (indexes, names)
}
pub fn stock_check(value: &Value, index: usize) -> (Vec<&Value>, Vec<&Value>, Vec<&Value>, Vec<&Value>) {
    let mut ist = Vec::new();
    let mut ost = Vec::new();
    let mut ids = Vec::new();
    let mut prices = Vec::new();

    let variants = value["products"][index]["variants"].as_array().unwrap();

    for i in 0..variants.len(){
        for val in variants[i].as_object().unwrap(){
            let (k, v) = val;
            if k == "available" && v == true{
                ist.push(&variants[i]["title"]);
                ids.push(&variants[i]["id"]);
                prices.push(&variants[i]["price"]);
            }
            if k == "available" && v == false{
                ost.push(&variants[i]["title"]);
            }
        }
    }

    return (ist, ost, ids, prices)
}
pub fn generate_links<'a>(base_url: &str, variants: Vec<&'a Value>, prices: Vec<&'a Value>, ids: Vec<&Value>) -> Vec<Links<'a>>{
    let mut checkout_vec = Vec::new();

    for (variant, price, id) in izip!(&variants, &prices, &ids) {
        let path = ["cart/", &id.to_string(), ":1"].concat();
        let base = Url::parse(&base_url);
        let link = base.unwrap().join(&path).unwrap().to_string();

        let checkout_data = Links{
            size: variant,
            price: price,
            checkout_link: link
        };

        checkout_vec.push(checkout_data);
    }

    return checkout_vec
}

#[event(fetch)]
pub async fn main(req: Request, env: Env, _ctx: worker::Context) -> Result<Response> {
    log_request(&req);

    utils::set_panic_hook();

    let router = Router::new();
    router
        .post_async("/stock_check", |_req, _ctx| async move{
            let base_url = "https://ronindivision.com/";
            let products_json = "https://ronindivision.com/collections/frontpage/products.json";
            let search_word = "BUCKET"; //search words all uppercase to allow case insensitive search

            let response = fetch(products_json).await;
            
            let mut item_vec = Vec::new();
            
            let (indexes_p, names) = find(&response, search_word);
            for (i, index) in indexes_p.iter().enumerate(){
                let (in_stock, out_stock, ids, prices) = stock_check(&response, *index);

                if !in_stock.is_empty(){
                    let checkouts = generate_links(base_url, in_stock, prices, ids);
                    
                    let item = Item{
                        name: &names[i],
                        available: checkouts,
                        sold_out: out_stock
                    };
                    item_vec.push(item);
                }
            }

            Response::from_json(&item_vec)
        })
        .run(req, env).await
}
