use worker::*;
use url::Url;
use serde::{Serialize, Deserialize};
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

#[derive(Deserialize)]
struct SearchRequest{
    base_url: String,
    products_json: String,
    keyword: String
}
#[derive(Serialize)] 
struct Item<'a>{
    name: &'a Value,
    image: &'a Value,
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
    .header(reqwest::header::USER_AGENT, "v0.2.4")
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
pub fn get_images(value: &Value, index: usize) -> &Value {
    let image = &value["products"][index]["images"][0]["src"];

    return image
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
        .options("/stock_check", |_req, _ctx| {
            let cors = Cors::default();
            Ok(Response::empty()
            .unwrap()
            .with_cors(&cors).unwrap()
            .with_status(204))
        })
        .post_async("/stock_check", |mut req, _ctx| async move{
            let data: SearchRequest = match req.json().await {
                Ok(res) => res,
                Err(_) => return Response::error("Bad request", 400),
            };

            let response = fetch(&data.products_json).await;
            
            let mut item_vec = Vec::new();
            
            let (indexes_p, names) = find(&response, &data.keyword);
            for (i, index) in indexes_p.iter().enumerate(){
                let src = get_images(&response, *index);
                let (in_stock, out_stock, ids, prices) = stock_check(&response, *index);
                let checkout_data = generate_links(&data.base_url, in_stock, prices, ids);
                
                let item = Item{
                    name: &names[i],
                    image: src,
                    available: checkout_data,
                    sold_out: out_stock
                };
                item_vec.push(item);
            }

            let cors = Cors::default();
            
            Ok(Response::from_json(&item_vec)
            .unwrap()
            .with_cors(&cors).unwrap())
        })
        .run(req, env).await
}
