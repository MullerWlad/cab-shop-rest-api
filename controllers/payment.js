import * as paypal from '@paypal/checkout-server-sdk'
import {readJson, writeJson, refreshJson} from './json.js'
import { apiConfig } from './api.js'

//get config
export let paymentConfig = readJson('./api-config.json')['payment-config']

//set config
export let refreshPaymentConfig = (clientId_, clientSecret_, currency_) => {
    refreshJson('./api-config.json', (obj) => {
        obj['payment-config'].clientId = clientId_
        obj['payment-config'].clientSecret = clientSecret_
        obj['payment-config'].currency = currency_
    })
}

//set configure
let environment = new paypal.core.SandboxEnvironment(paymentConfig.clientId, paymentConfig.clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

//buy transaction
export let buy = (price, name, callback) => {
    let request = new paypal.orders.OrdersCreateRequest()
    request.requestBody({
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": `${paymentConfig.currency}`,
                    "value": `${price}`
                },
                "items": [
                    {
                        "name": `${name}`,
                        "unit_amount": {
                            "currency_code": `${paymentConfig.currency}`,
                            "value": `${price}`
                        },
                        "quantity": 1
                    }
                ]
            }
        ]
    })
    let createOrder  = async function() {
        let response = await client.execute(request);
        callback(response)
    }
    createOrder()
}