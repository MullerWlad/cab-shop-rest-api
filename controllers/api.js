import {readJson, writeJson, refreshJson} from './json.js'

//get config
export let apiConfig = readJson('./api-config.json')['api-config']

//set config
export let refreshApiConfig = (port_, login_, password_, email_, epass_, adress_) => {
    refreshJson('./api-config.json', (obj) => {
        obj['api-config'].port = port_
        obj['api-config'].login = login_
        obj['api-config'].password = password_
        obj['api-config'].email = email_
        obj['api-config'].emailPass = epass_
        obj['api-config'].clientAdress = adress_
    })
}
export let refreshSecret = (secret_) => {
    refreshJson('./api-config.json', (obj) => {
        obj['api-config'].secret = secret_
    })
}