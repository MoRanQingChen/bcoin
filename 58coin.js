const crypto = require('crypto');
const superagent = require('superagent');

let config = {
    url:"https://openapi.58ex.com/",
    API:'66f8cc98-55f3-4ee9-b4ca-7259fe9577d2',
    Secret:'77758CFEC9E88968634B9ECCA51E0084'
}
let setParm = (more={})=>{
    let header = [
        `AccessKeyId=${config.API}`,
        "SignatureMethod=HmacSHA256",
        "SignatureVersion=2",
        `Timestamp=${Date.now()}`
    ]
    let need = {...header}
    for(let key in more){
        need.push(`${key}=${more[key]}`)
    }
    const hash = crypto.createHmac('sha256', config.Secret)
        .update(need.sort().join('&'))
        .digest('hex');
    header.push(`Signature=${hash}`)
    
}

/**
AccessKeyId=089cf604-7b87-4b13-b806-eaadb67c8b70
&SignatureMethod=HmacSHA256
&SignatureVersion=2
&Timestamp=1551084749915
&contractId=2001
&side=1
&size=1
&type=2

[linux]$ echo -n 
"AccessKeyId=089cf604-7b87-4b13-b806-eaadb67c8b70&SignatureMethod=HmacSHA256&SignatureVersion=2&Timestamp=1551084749915&contractId=2001&side=1&size=1&type=2" 
| openssl dgst -sha256 -hmac "CE5DB7F718510CF47D73AF75D3CDF3B6"


[linux]$ curl -H "X-58COIN-APIKEY:089cf604-7b87-4b13-b806-eaadb67c8b70" -H "Timestamp:1551084749915" -H "Signature:617cfbed0db129bc27feca8adedb829e5294f0c81ac3408067479fc4ecfd276b" -X POST 'https://api.58coin.com/v1/regular/order/place?contractId=2001&type=2&side=1&size=1'

 */
