import * as api from './api.js'
import nodemailer from 'nodemailer'

export async function mail(responser, sender, sub, message, code) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: `${api.apiConfig.email}`,
            pass: `${api.apiConfig.emailPass}`
        }
    })
    try {
        let info = await transporter.sendMail({
            from: `${sender} <${api.apiConfig.email}>`,
            to: `${responser}`,
            subject: `${sub}`,
            text: `${message}`,
            html: `${code}`
        })
    }
    catch(e){}
}