# Shopify bot Worker
Follow this [guide](https://developers.cloudflare.com/workers/get-started/guide) from Cloudflare to setup Workers and `wrangler`
## Usage 
This Worker accepts POST requests to the route /stock_check. Data wil be returned from the Worker will be in JSON format.  
  
With `wrangler`, you can build, test, and deploy your Worker with the following commands: 

```bash
# compiles your project to WebAssembly and will warn of any issues
wrangler build 

# run your Worker in an ideal development workflow (with a local server, file watcher & more)
wrangler dev

# deploy your Worker globally to the Cloudflare network (update your wrangler.toml file for configuration)
wrangler publish
```

Read the latest `worker` crate documentation here: https://docs.rs/worker

## WebAssembly

`workers-rs` (the Rust SDK for Cloudflare Workers used in this template) is meant to be executed as 
compiled WebAssembly, and as such so **must** all the code you write and depend upon. All crates and
modules used in Rust-based Workers projects have to compile to the `wasm32-unknown-unknown` triple. 

Read more about this on the [`workers-rs` project README](https://github.com/cloudflare/workers-rs).

## Issues

If you have any problems with the `worker` crate, please open an issue on the upstream project 
issue tracker on the [`workers-rs` repository](https://github.com/cloudflare/workers-rs).

