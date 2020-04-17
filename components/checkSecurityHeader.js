const crypto = require('crypto');

module.exports =  (event) =>{
    const client_secret = process.env.WEBHOOK_CLIENT_SECRET

    let calculated_hash = crypto.createHmac("sha256", client_secret).update(Buffer.from(event.body, "utf-8")).digest("base64");

    if (event.headers["X-Shopify-Hmac-Sha256"] != calculated_hash) {
    console.log("calculated_hash: (" + calculated_hash + ") != X-Shopify-Hmac-Sha256: (" + event.headers["X-Shopify-Hmac-Sha256"] + ")");
    throw {message: "encryption does not match"}
    }else {
      console.log("encryption matches");
      return {message: "encryption matches"}
    }
}
