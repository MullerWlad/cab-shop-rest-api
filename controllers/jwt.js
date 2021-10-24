import CryptoJS from 'crypto-js'
import { apiConfig } from './api.js'

//works not like a jt technology, beacause database should not contain refresh tokens :(

//encoder
export let encoder = (obj) => {
    return CryptoJS.AES.encrypt(JSON.stringify(obj), apiConfig.secret).toString()
}

//decoder
export let decoder = (string) => {
    let bytes = CryptoJS.AES.decrypt(string, apiConfig.secret)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}