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
wrangler deploy
```