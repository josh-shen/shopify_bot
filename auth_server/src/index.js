import jwt from '@tsndr/cloudflare-worker-jwt'

const corsHeaders = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': '*'
}

async function createJWT(){  
  const token = await jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 15) // Expires: Now + 15m
  }, SECRET,
  {algorithm: "HS256"})

  return token
}
async function verify(token){
  try {
    const valid = await jwt.verify(token, SECRET, {algorithm: "HS256", throwError: true})
    return valid
  }
  catch(err){
    return err
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
async function handleRequest(request) {
  
  if (request.method === "OPTIONS"){
    return new Response("OK", {headers: corsHeaders})
  }
  else if (request.method === "POST"){
    const body = await request.json()

    if (body.header == "LOGIN"){
      if (body.payload == PASSWORD){
        const token = await createJWT()

        return new Response(token, {headers: {...corsHeaders}})
      }
      else{
        return new Response("error wrong password", {headers: {...corsHeaders}})
      }
    }
    else if (body.header == "VERIFY"){
      const valid = await verify(body.payload)

      return new Response(valid, {headers: {...corsHeaders}})
    }
    else {
      return new Response("invalid header", {hedaers: {...corsHeaders}})
    }
  }
}
