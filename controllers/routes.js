import {Branch} from '../models/Branch.js'
import { json, Router } from 'express'
import {mail} from './mailer.js'
import * as mysql from './mysql.js'
import * as pay from './payment.js'
import { apiConfig, refreshApiConfig, refreshSecret } from './api.js'
import * as description from '../models/DataTrans.js'
import * as coder from './jwt.js'

//init Tree of routes
export let tree = new Branch('/', '/admin', '/user', '/public')
let admin = tree.getLeaveBy(0)
let user = tree.getLeaveBy(1)
let pub = tree.getLeaveBy(2)
admin.leaves = ['/get', '/set', '/change', '/delete']
admin.getLeaveBy(0).leaves = ['/users', '/basketItem', '/listItem', '/config']
admin.getLeaveBy(1).leaves = ['/category', '/product', '/component']
admin.getLeaveBy(2).leaves = ['/category', '/product', '/component', '/config', '/payment']
    admin.getLeaveBy(2).getLeaveBy(3).leaves = ['/api', '/database']
admin.getLeaveBy(3).leaves = ['/user', '/category', '/product', '/component', '/review']
user.leaves = ['/get', '/set', '/delete', '/buy']
user.getLeaveBy(0).leaves = ['/basketItem', '/listItem', '/checkme', '/viewme']
user.getLeaveBy(1).leaves = ['/basketItem', '/review', '/basketItemChange']
user.getLeaveBy(2).leaves = ['/myself', '/basketItem', '/listItem']
pub.leaves = ['/auth', '/get']
pub.getLeaveBy(1).leaves = ['/category', '/product', '/component', '/review']

//init public routes
export let pubAuth = new Router()
pubAuth.post(pub.leaves[0].folder, (req, res) => {
    try {
        mysql.getUserOf(`#${req.body.id}`, obj => {
            if (obj.length === 0 && req.body.id != '' && req.body.name != '' && req.body.email != '' != req.body.password != '') {
                mysql.createUser(`#${req.body.id}`, req.body.name, req.body.email, req.body.password, obj => {})
                mail(req.body.email, `Cab Shop ${apiConfig.email}`, "Well done!", `Welcome to Cab Shop ${req.body.name}!`, `<h2>Go to</h2><a href="${apiConfig.clientAdress}">Click here</a>`)
                res.cookie('secretCabShop', apiConfig.secret, {
                    expires: new Date(Date.now() + 8 * 3600000)
                })
                res.status(200)
            }
            else {
                res.sendStatus(406)
            }
        })
    }
    catch(e){
        res.send("Error")
    }
})
export let pubGet = new Router()
let pubGetCat = new Router()
pubGetCat.get(pub.getLeaveBy(1).getLeaveBy(0).folder, (req, res) => {
    try{
        mysql.getAllCategoties(obj => {
            obj = obj.map(elem => {
                elem.template = JSON.parse(elem.template)
                return elem
            })
            res.status(200).json(obj)
        })
    }
    catch(e){
        res.send("Error")
    }
})
let pubGetProd = new Router()
pubGetProd.get(pub.getLeaveBy(1).getLeaveBy(1).folder, (req, res) => {
    try{
        mysql.getAllProducts(obj => {
            obj = obj.map(elem => {
                elem.desc = JSON.parse(elem.desc)
                return elem
            })
            res.status(200).json(obj)
        })
    }
    catch(e){
        res.send("Error")
    }
})
let pubGetComp = new Router()
pubGetComp.get(pub.getLeaveBy(1).getLeaveBy(2).folder, (req, res) => {
    try{
        mysql.getComponentsOf(req.query.code, obj => {
            obj = obj.map(elem => {
                elem.desc = JSON.parse(elem.desc)
                return elem
            })
            res.status(200).json(obj)
        })
    }
    catch(e){
        res.send("Error")
    }
})
let pubGetReview = new Router()
pubGetReview.get(pub.getLeaveBy(1).getLeaveBy(3).folder, (req, res) => {
    try{
        mysql.getReviewsOf(req.query.code, obj => {
            res.status(200).json(obj)
        })
    }
    catch(e){
        res.send("Error")
    }
})
pubGet.use(pub.getLeaveBy(1).folder, pubGetCat)
pubGet.use(pub.getLeaveBy(1).folder, pubGetProd)
pubGet.use(pub.getLeaveBy(1).folder, pubGetComp)
pubGet.use(pub.getLeaveBy(1).folder, pubGetReview)

//init user routes
export let userGet = new Router()
let userGetBasketItem = new Router()
userGetBasketItem.post(user.leaves[0].leaves[0].folder, (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        mysql.getUserOf(`#${data.id}`, obj => {
            if(data.password == obj[0]?.password){
                mysql.getBasketOf(`#${data.id}`, obj1 => {
                    res.status(200).json(obj1)
                })
            }
            else {
                res.sendStatus(406)
            }
        })
    }
    catch(e){
        res.send("Error")
    }
})
let userGetListItem = new Router()
userGetListItem.post(user.leaves[0].leaves[1].folder, (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        mysql.getUserOf(`#${data.id}`, obj => {
            if(data.password == obj[0]?.password){
                mysql.getListOf(`#${data.id}`, obj1 => {
                    obj1 = obj1.map(elem => {
                        elem.info = JSON.parse(elem.info)
                        return elem
                    })
                    res.status(200).json(obj1)
                })
            }
            else {
                res.sendStatus(406)
            }
        })
    }
    catch(e){
        res.send("Error")
    }
})
let userCheckme = new Router()
userCheckme.post(user.leaves[0].leaves[2].folder, (req, res) => {
    try{
        let data = JSON.parse(req.get('Auth'))
        mysql.getUserOf(`#${data.id}`, obj => {
            if(data.password == obj[0]?.password){
                res.cookie('secretCabShop', apiConfig.secret, {
                    expires: new Date(Date.now() + 8 * 3600000)
                })
                res.status(200).json(data)
            }
            else {
                res.sendStatus(406)
            }
        })
    }
    catch(e){
        res.send("Error")
    }
})
let userViewMe = new Router()
userViewMe.post(user.leaves[0].leaves[3].folder, (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        mysql.getUserOf(`#${data.id}`, obj => {
            if(data.password == obj[0]?.password){
                res.status(200).json(obj)
            }
            else {
                res.sendStatus(406)
            }
        })
    }
    catch(e){
        res.send("Error")
    }
})
userGet.use(user.leaves[0].folder, userGetBasketItem)
userGet.use(user.leaves[0].folder, userGetListItem)
userGet.use(user.leaves[0].folder, userCheckme)
userGet.use(user.leaves[0].folder, userViewMe)
export let userSet = new Router()
let userSetBasketItem = new Router()
userSetBasketItem.post(user.leaves[1].leaves[0].folder, (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        mysql.getUserOf(`#${data.id}`, obj => {
            if(data.password == obj[0]?.password){
                mysql.getBasketOf(`#${data.id}`, basket => {
                    let arr = basket.map(elem => {
                        return elem.idItem
                    })
                    let maxId = Math.max.apply(null, arr)
                    mysql.getProductOf(data.code, product => {
                        let count = product[0].count
                        if (data.count <= count) {
                            mysql.createBasketItem(maxId + 1, `#${data.id}`, data.code, data.count, creating => {
                                res.status(200).json(creating)
                            })
                        }
                        else {
                            res.sendStatus(406)
                        }
                    })
                })
            }
            else {
                res.sendStatus(406)
            }
        })
    }
    catch(e){
        res.send("Error")
    }
})
let userReview = new Router()
userReview.post(user.leaves[1].leaves[1].folder, (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        mysql.getUserOf(`#${data.id}`, obj => {
            if (data.password == obj[0]?.password) {
                mysql.createReview(`#${data.id}`, data.review, data.code, obj => {
                    res.status(200).json(obj)
                })
            }
            else {
                res.sendStatus(406)
            }
        })
    }
    catch(e){
        res.send("Error")
    }
})
let userChangeBasket = new Router()
userChangeBasket.post(user.leaves[1].leaves[2].folder, (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        mysql.getUserOf(`#${data.id}`, obj => {
            if(data.password == obj[0]?.password){
                mysql.getProductOf(data.code, product => {
                    let count = product[0].count
                    if (data.count <= count) {
                        mysql.changeBasketItemOf(data.basketId, `#${data.id}`, data.code, data.count, creating => {
                            res.status(200).json(creating)
                        })
                    }
                    else {
                        res.sendStatus(406)
                    }
                })
            }
            else {
                res.sendStatus(406)
            }
        })
    }
    catch(e){
        res.send("Error")
    }
})
userSet.use(user.leaves[1].folder, userSetBasketItem)
userSet.use(user.leaves[1].folder, userReview)
userSet.use(user.leaves[1].folder, userChangeBasket)
export let userDelete = new Router()
let myself = new Router()
myself.post(user.leaves[2].leaves[0].folder, (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        mysql.getUserOf(`#${data.id}`, obj => {
            if(data.password == obj[0]?.password){
                mysql.deleteUser(`#${data.id}`, obj => {
                    res.status(200).json(obj)
                })
            }
            else {
                res.sendStatus(406)
            }
        })
    }
    catch(e){
        res.send("Error")
    }
})
let userDeleteBasketItem = new Router()
userDeleteBasketItem.post(user.leaves[2].leaves[1].folder, (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        mysql.getUserOf(`#${data.id}`, obj => {
            if(data.password == obj[0]?.password){
                mysql.deleteBasketItem(data.basketId, `#${data.id}`, data.code, obj => {
                    res.status(200).json(obj)
                })
            }
            else {
                res.sendStatus(406)
            }
        })
    }
    catch(e){
        res.send("Error")
    }
})
let userDeleteListItem = new Router()
userDeleteListItem.post(user.leaves[2].leaves[2].folder, (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        mysql.getUserOf(`#${data.id}`, obj => {
            if(data.password == obj[0]?.password){
                mysql.changeListItemOf(data.orderId, data.code, `#${data.id}`, obj => {
                    res.status(200).json(obj)
                })
            }
            else {
                res.sendStatus(406)
            }
        })
    }
    catch(e){
        res.send("Error")
    }
})
userDelete.use(user.leaves[2].folder, myself)
userDelete.use(user.leaves[2].folder, userDeleteListItem)
userDelete.use(user.leaves[2].folder, userDeleteBasketItem)
export let userBuy = new Router()
userBuy.post(user.leaves[3].folder, (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        mysql.getUserOf(data.id, user => {
            if (data.password == user[0]?.password) {
                mysql.getBasketOf(data.id, basket => {
                    let basketItem = basket.filter(elem => {
                        return elem.idItem == data.idBasket && elem.Product_code == data.code
                    })
                    mysql.getProductOf(data.code, product => {
                        if(product[0].count >= basketItem[0].count) {
                            mysql.getListOf(data.id, list => {
                                let index = list.map(elem => {
                                    return elem.id
                                })
                                let maxId = Math.max.apply(null, index)
                                pay.buy(basketItem[0].info?.price, basketItem[0].info?.name, payment => {
                                    mysql.createListItem(maxId + 1, data.id, data.code, basketItem[0].count, basketItem[0].info, Date.now(), '1', creatingListItem => {
                                        res.json(payment)
                                    })
                                })
                            })
                        }
                        else {
                            res.sendStatus(406)
                        }
                    })
                })
            }
            else {
                res.sendStatus(406)
            }
        })
    }
    catch(e){
        res.send("Error")
    }
})

//init admin routes
export let adminGet = new Router()
let adminGetusers = new Router()
adminGetusers.post(admin.getLeaveBy(0).getLeaveBy(0).folder, (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        if (data.login == apiConfig.login && data.password == apiConfig.password) {
            mysql.getAllUsers(obj => {
                res.status(200).json(obj)
            })
        }
        else {
            res.sendStatus(406)
        }
    }
    catch(e){
        res.send("Error")
    }
})
let adminGetBasket = new Router()
adminGetBasket.post(admin.getLeaveBy(0).getLeaveBy(1).folder, (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        if (data.login == apiConfig.login && data.password == apiConfig.password) {
            mysql.getBasketOf(`#${data.id}`, obj => {
                res.status(200).json(obj)
            })
        }
        else {
            res.sendStatus(406)
        }
    }
    catch(e){
        res.send("Error")
    }
})
let adminGetList = new Router()
adminGetList.post(admin.getLeaveBy(0).getLeaveBy(2).folder, (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        if (data.login == apiConfig.login && data.password == apiConfig.password) {
            mysql.getListOf(`#${data.id}`, obj => {
                obj = obj.map(elem => {
                    elem.info = JSON.parse(elem.info)
                    return elem
                })
                res.status(200).json(obj)
            })
        }
        else {
            res.sendStatus(406)
        }
    }
    catch(e){
        res.send("Error")
    }
})
let adminGetConfig = new Router()
adminGetConfig.post(admin.getLeaveBy(0).getLeaveBy(3).folder, (req, res) => {
    try{
        let data = JSON.parse(req.get('Admin-auth'))
        if (data.login == apiConfig.login && data.password == apiConfig.password) {
            res.cookie('secretCabShop', apiConfig.secret, {
                expires: new Date(Date.now() + 8 * 3600000)
            })
            res.status(200).json({
                "api": apiConfig,
                "database": mysql.databaseConfig
            })
        }
        else {
            res.sendStatus(406)
        }
    }
    catch(e){
        res.send("Error")
    }
})
adminGet.use(admin.getLeaveBy(0).folder, adminGetusers)
adminGet.use(admin.getLeaveBy(0).folder, adminGetBasket)
adminGet.use(admin.getLeaveBy(0).folder, adminGetList)
adminGet.use(admin.getLeaveBy(0).folder, adminGetConfig)
export let adminSet = new Router()
let adminSetCategory = new Router()
adminSetCategory.post(admin.getLeaveBy(1).getLeaveBy(0).folder, (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        if (data.login == apiConfig.login && data.password == apiConfig.password) {
            mysql.createCategory(data.categoryId, data.categoryName, JSON.stringify(data.template), obj => {
                res.status(200).json(obj)
            })
        }
        else {
            res.sendStatus(406)
        }
    }
    catch(e){
        res.send("Error")
    }
})
let adminSetProduct = new Router()
adminSetProduct.post(admin.getLeaveBy(1).getLeaveBy(1).folder, (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        if (data.login == apiConfig.login && data.password == apiConfig.password) {
            mysql.createProduct(data.code, JSON.stringify(data.description), data.categoryId, data.count, obj => {
                res.status(200).json(obj)
            })
        }
        else {
            res.sendStatus(406)
        }
    }
    catch(e){
        res.send("Error")
    }
})
let adminSetComponent = new Router()
adminSetComponent.post(admin.getLeaveBy(1).getLeaveBy(2).folder, (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        if (data.login == apiConfig.login && data.password == apiConfig.password) {
            mysql.createComponent(data.code, JSON.stringify(data.description), data.productCode, data.article, data.count, obj => {
                res.status(200).json(obj)
            })
        }
        else {
            res.sendStatus(406)
        }
    }
    catch(e){
        res.send("Error")
    }
})
adminGet.use(admin.getLeaveBy(1).folder, adminSetCategory)
adminGet.use(admin.getLeaveBy(1).folder, adminSetProduct)
adminGet.use(admin.getLeaveBy(1).folder, adminSetComponent)
export let adminChange = new Router()
let adminChangeCategory = new Router()
adminChangeCategory.post(admin.getLeaveBy(2).getLeaveBy(0).folder, (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        if (data.login == apiConfig.login && data.password == apiConfig.password) {
            mysql.changeCategoryOf(data.id, data.name, JSON.stringify(data.template), obj => {
                res.status(200).json(obj)
            })
        }
        else {
            res.sendStatus(406)
        }
    }
    catch(e){
        res.send("Error")
    }
})
let adminChangeProduct = new Router()
adminChangeProduct.post(admin.getLeaveBy(2).getLeaveBy(1).folder, (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        if (data.login == apiConfig.login && data.password == apiConfig.password) {
            mysql.changeProductOf(data.code, JSON.stringify(data.description), data.categoryId, data.count, obj => {
                res.status(200).json(obj)
            })
        }
        else {
            res.sendStatus(406)
        }
    }
    catch(e){
        res.send("Error")
    }
})
let adminChangeComponent = new Router()
adminChangeComponent.post(admin.getLeaveBy(2).getLeaveBy(2).folder, (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        if (data.login == apiConfig.login && data.password == apiConfig.password) {
            mysql.changeComponentOf(data.code, JSON.stringify(data.description), data.productCode, data.article, data.count, obj => {
                res.status(200).json(obj)
            })
        }
        else {
            res.sendStatus(406)
        }
    }
    catch(e){
        res.send("Error")
    }
})
let adminConfig = new Router()
let adminApi = new Router()
adminApi.post(admin.getLeaveBy(2).getLeaveBy(3).getLeaveBy(0).folder, (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        if (data.login == apiConfig.login && data.password == apiConfig.password) {
            refreshSecret(data.secret)
            refreshApiConfig(data.port, data.newLogin, data.newPassword, data.email, data.emailPass, data.adress)
            res.sendStatus(200)
        }
        else {
            res.sendStatus(406)
        }
    }
    catch(e){
        res.send("Error")
    }
})
let adminDatabase = new Router()
adminDatabase.post(admin.getLeaveBy(2).getLeaveBy(3).getLeaveBy(0).folder, (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        if (data.login == apiConfig.login && data.password == apiConfig.password) {
            mysql.refreshDatabaseConfig(data.host, data.port, data.databaseUser, data.databasePassword, data.database)
            res.sendStatus(200)
        }
        else {
            res.sendStatus(406)
        }
    }
    catch(e){
        res.send("Error")
    }
})
let adminPayment = new Router()
adminPayment.post(admin.getLeaveBy(2).getLeaveBy(4).folder, (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        if (data.login == apiConfig.login && data.password == apiConfig.password) {
            paymet.refreshPaymentConfig(data.clientId, data.clientSecret, data.currency)
            res.sendStatus(200)
        }
        else {
            res.sendStatus(406)
        }
    }
    catch(e){
        res.send("Error")
    }
})
adminConfig.use(admin.getLeaveBy(2).getLeaveBy(3).folder, adminApi)
adminConfig.use(admin.getLeaveBy(2).getLeaveBy(3).folder, adminDatabase)

adminChange.use(admin.getLeaveBy(2).folder, adminChangeComponent)
adminChange.use(admin.getLeaveBy(2).folder, adminChangeProduct)
adminChange.use(admin.getLeaveBy(2).folder, adminChangeCategory)
adminChange.use(admin.getLeaveBy(2).folder, adminConfig)
adminChange.use(admin.getLeaveBy(2).folder, adminPayment)
export let adminDelete = new Router()
let adminDeleteUser = new Router()
adminDeleteUser.post(admin.getLeaveBy(3).getLeaveBy(0), (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        if (data.login == apiConfig.login && data.password == apiConfig.password) {
            mysql.deleteUser(`#${data.id}`, obj => {
                res.status(200).json(obj)
            })
        }
        else {
            res.sendStatus(406)
        }
    }
    catch(e){
        res.send("Error")
    }
})
let adminDeleteCategory = new Router()
adminDeleteCategory.post(admin.getLeaveBy(3).getLeaveBy(1), (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        if (data.login == apiConfig.login && data.password == apiConfig.password) {
            mysql.deleteCategory(data.id, obj => {
                res.status(200).json(obj)
            })
        }
        else {
            res.sendStatus(406)
        }
    }
    catch(e){
        res.send("Error")
    }
})
let adminDeleteProduct = new Router()
adminDeleteProduct.post(admin.getLeaveBy(3).getLeaveBy(2), (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        if (data.login == apiConfig.login && data.password == apiConfig.password) {
            mysql.deleteProduct(data.code, obj => {
                res.status(200).json(obj)
            })
        }
        else {
            res.sendStatus(406)
        }
    }
    catch(e){
        res.send("Error")
    }
})
let adminDeleteComponent = new Router()
adminDeleteComponent.post(admin.getLeaveBy(3).getLeaveBy(3), (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        if (data.login == apiConfig.login && data.password == apiConfig.password) {
            mysql.deleteComponent(data.code, obj => {
                res.status(200).json(obj)
            })
        }
        else {
            res.sendStatus(406)
        }
    }
    catch(e){
        res.send("Error")
    }
})
let adminDeleteReview = new Router()
adminDeleteReview.post(admin.getLeaveBy(3).getLeaveBy(4), (req, res) => {
    try{
        let data = coder.decoder(req.body.token)
        if (data.login == apiConfig.login && data.password == apiConfig.password) {
            mysql.deleteReview(data.code, data.id, obj => {
                res.status(200).json(obj)
            })
        }
        else {
            res.sendStatus(406)
        }
    }
    catch(e){
        res.send("Error")
    }
})
adminDelete.use(admin.getLeaveBy(3).folder, adminDeleteUser)
adminDelete.use(admin.getLeaveBy(3).folder, adminDeleteCategory)
adminDelete.use(admin.getLeaveBy(3).folder, adminDeleteProduct)
adminDelete.use(admin.getLeaveBy(3).folder, adminDeleteComponent)
adminDelete.use(admin.getLeaveBy(3).folder, adminDeleteReview)