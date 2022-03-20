use worker::*;
use serde::{Serialize, Deserialize};
use serde_json::Value;

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
    available: Vec<&'a Value>,
    sold_out: Vec<&'a Value>
}

pub async fn fetch(uri: &str) -> Value{
    let client = reqwest::Client::new();
    let response = client
    .get(uri)
    .header(reqwest::header::USER_AGENT, "v0.1.0")
    .send().await.unwrap()
    .json::<Value>().await.unwrap();

    return response
}
pub fn find(value: &Value, keyword: &str) -> (Vec<usize>, Vec<Value>){
    let mut indexes = Vec::new();
    let mut names = Vec::new();

    let products = value["products"].as_array().unwrap();
    for i in 0..products.len() {
        for val in products[i].as_object().unwrap(){
            let (k, v) = val;
            if k == "title" && v.to_string().contains(keyword){
                indexes.push(i);
                names.push(v.to_owned());
            }
        }
    }

    return (indexes, names)
}
pub fn stock(value: &Value, index: usize) -> (Vec<&Value>, Vec<&Value>){
    let mut ist = Vec::new();
    let mut ost = Vec::new();

    let variants = value["products"][index]["variants"].as_array().unwrap();

    for i in 0..variants.len(){
        for val in variants[i].as_object().unwrap(){
            let (k, v) = val;
            if k == "available" && v == true{
                ist.push(&variants[i]["title"]);
            }
            if k == "available" && v == false{
                ost.push(&variants[i]["title"]);
            }
        }
    }

    return (ist, ost)
}

#[event(fetch)]
pub async fn main(req: Request, env: Env, _ctx: worker::Context) -> Result<Response> {
    log_request(&req);

    utils::set_panic_hook();

    let router = Router::new();
    router
        .post_async("/stock_check", |_req, _ctx| async move{
            let response = fetch("https://ronindivision.com/collections/frontpage/products.json").await;
            
            let mut item_vec = Vec::new();

            let (indexes, names) = find(&response, "Jacket");
            for i in indexes{
                let (in_stock, out_stock) = stock(&response, i);
                let item = Item{
                    name: &names[i-1],
                    available: in_stock,
                    sold_out: out_stock
                };
                item_vec.push(item);
            }

            Response::from_json(&item_vec)
        })
        .run(req, env).await
}
