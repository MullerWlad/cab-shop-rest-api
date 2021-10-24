import * as api from './controllers/api.js'
import * as routes from './controllers/routes.js'
import express from 'express'

//initialising app
const app = express()
app.use(express.urlencoded({extended: false}))
app.use(express.json())

let admin = routes.tree.getLeaveBy(0).folder
let user = routes.tree.getLeaveBy(1).folder
let pub = routes.tree.getLeaveBy(2).folder

app.use(pub, routes.pubAuth)
app.use(pub, routes.pubGet)

app.use(user, routes.userGet)
app.use(user, routes.userSet)
app.use(user, routes.userDelete)
app.use(user, routes.userBuy)

app.use(admin, routes.adminGet)
app.use(admin, routes.adminSet)
app.use(admin, routes.adminChange)
app.use(admin, routes.adminDelete)

//import {encoder} from './controllers/jwt.js'
//console.log(encoder())

//listening
app.listen(api.apiConfig.port, () => {
    console.log(`Workong at port: ${api.apiConfig.port}`)
})