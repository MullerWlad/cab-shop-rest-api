import {readJson, refreshJson} from './json.js'
import mysql from 'mysql'

//get config
export let databaseConfig = readJson('./api-config.json')['data-base-config']

//set config
export let refreshDatabaseConfig = (host_, port_, user_, password_, database_) => {
    refreshJson('./api-config.json', (obj) => {
        obj['data-base-config'].host = host_
        obj['data-base-config'].port = port_
        obj['data-base-config'].user = user_
        obj['data-base-config'].password = password_
        obj['data-base-config'].database = database_
    })
}

//query template
let template = (string, callback) => {
    const connection = mysql.createConnection({
        host: databaseConfig.host,
        port: databaseConfig.port,
        user: databaseConfig.user,
        password: databaseConfig.password,
        database: databaseConfig.database
    })
    connection.connect()
    connection.query(string, (error, results) => {
        let data = null
        if (error) {
            callback(error)
        }
        else {
            data = JSON.parse(JSON.stringify(results))
            callback(data)
        }
    })
    connection.end()
}

//queries for view
export let getAllUsers = (callback) => {
    let result = template(`SELECT * FROM ${databaseConfig.database}.user`, obj => {
        callback(obj)
    })
}
export let getUserOf = (id, callback) => {
    let result = template(`SELECT * FROM ${databaseConfig.database}.user WHERE (idUser = '${id}')`, obj => {
        callback(obj)
    })
}
export let getBasketOf = (id, callback) => {
    let result = template(`SELECT * FROM ${databaseConfig.database}.basketitem WHERE (User_idUser = '${id}')`, obj => {
        callback(obj)
    })
}
export let getListOf = (id, callback) => {
    let result = template(`SELECT * FROM ${databaseConfig.database}.ordersitem WHERE (User_idUser = '${id}')`, obj => {
        callback(obj)
    })
}
export let getAllCategoties = (callback) => {
    let result = template(`SELECT * FROM ${databaseConfig.database}.category`, obj => {
        callback(obj)
    })
}
export let getComponentsOf = (code, callback) => {
    let result = template(`SELECT * FROM ${databaseConfig.database}.component WHERE (Product_code = '${code}')`, obj => {
        callback(obj)
    })
}
export let getAllProducts = (callback) => {
    let result = template(`SELECT * FROM ${databaseConfig.database}.product`, obj => {
        callback(obj)
    })
}
export let getReviewsOf = (code, callback) => {
    let result = template(`SELECT * FROM ${databaseConfig.database}.review WHERE (Product_code = '${code}')`, obj => {
        callback(obj)
    })
}
export let getProductOf = (code, callback) => {
    let result = template(`SELECT * FROM ${databaseConfig.database}.product WHERE (code = '${code}')`, obj => {
        callback(obj)
    })
}

//queries for change
export let changeCategoryOf = (id, name, temp, callback) => {
    let result = template(`UPDATE ${databaseConfig.database}.category SET \`name\` = '${name}', \`template\` = '${temp}' WHERE (\`id\` = '${id}')`, obj => {
        callback(obj)
    })
}
export let changeProductOf = (code, desc, category, count, callback) => {
    let result = template(`UPDATE ${databaseConfig.database}.product SET \`desc\` = '${desc}', \`Category_id\` = '${category}', \`count\` = '${count}' WHERE (\`code\` = '${code}')`, obj => {
        callback(obj)
    })
}
export let changeComponentOf = (code, desc, product, article, count, callback) => {
    let result = template(`UPDATE ${databaseConfig.database}.component SET \`desc\` = '${desc}', \`Product_code\` = '${product}', \`article\` = '${article}', \`count\` = '${count}' WHERE (\`code\` = '${code}')`, obj => {
        callback(obj)
    })
}
export let changeListItemOf = (id, code, idUser, callback) => {
    let result = template(`UPDATE ${databaseConfig.database}.ordersitem SET \`exists\` = '0' WHERE (\`id\` = '${id}' AND \`User_idUSer\` = '${idUser}' AND \`Product_code\` = '${code}')`, obj => {
        callback(obj)
    })
}
export let changeBasketItemOf = (id, code, idUser, count, callback) => {
    let result = template(`UPDATE ${databaseConfig.database}.basketitem SET \`count\` = '${count}' WHERE (\`id\` = '${id}' AND \`User_idUSer\` = '${idUser}' AND \`Product_code\` = '${code}')`, obj => {
        callback(obj)
    })
}

//queries for create
export let createBasketItem = (id, userId, productCode, count, callback) => {
    let result = template(`INSERT INTO ${databaseConfig.database}.basketitem (\`idItem\`, \`User_idUser\`, \`Product_code\`, \`count\`) VALUES ('${id}', '${userId}', '${productCode}', '${count}')`, obj => {
        callback(obj)
    })
}
export let createListItem = (id, userId, productCode, count, info, date, exists, callback) => {
    let result = template(`INSERT INTO ${databaseConfig.database}.ordersitem (\`id\`, \`User_idUser\`, \`Product_code\`, \`count\`, \`info\`, \`date\`, \`exists\`) VALUES ('${id}', '${userId}', '${productCode}', '${count}', '${info}', '${date}', '${exists}')`, obj => {
        callback(obj)
    })
}
export let createReview = (userId, review, productCode, callback) => {
    let result = template(`INSERT INTO ${databaseConfig.database}.review (\`userId\`, \`review\`, \`Product_code\`) VALUES ('${userId}', '${review}', '${productCode}')`, obj => {
        callback(obj)
    })
}
export let createCategory = (id, name, temp, callback) => {
    let result = template(`INSERT INTO ${databaseConfig.database}.category (\`id\`, \`name\`, \`template\`) VALUES ('${id}', '${name}', '${temp}')`, obj => {
        callback(obj)
    })
}
export let createProduct = (code, desc, categoryId, count, callback) => {
    let result = template(`INSERT INTO ${databaseConfig.database}.product (\`code\`, \`desc\`, \`Category_id\`, \`count\`) VALUES ('${code}', '${desc}', '${categoryId}', '${count}')`, obj => {
        callback(obj)
    })
}
export let createComponent = (code, desc, productCode, article, count, callback) => {
    let result = template(`INSERT INTO ${databaseConfig.database}.component (\`code\`, \`desc\`, \`Product_code\`, \`article\`, \`count\`) VALUES ('${code}', '${desc}', '${productCode}', '${article}', '${count}')`, obj => {
        callback(obj)
    })
}
export let createUser = (id, name, email, password, callback) => {
    let result = template(`INSERT INTO ${databaseConfig.database}.user (\`idUser\`, \`name\`, \`email\`, \`password\`) VALUES ('${id}', '${name}', '${email}', '${password}')`, obj => {
        callback(obj)
    })
}

//queries for deleting
export let deleteUser = (id, callback) => {
    template(`DELETE FROM ${databaseConfig.database}.basketitem WHERE User_idUser = '${id}'`, obj => {
        template(`DELETE FROM ${databaseConfig.database}.ordersitem WHERE User_idUser = '${id}'`, obj => {
            callback(obj)
        })
    })
    let result = template(`DELETE FROM ${databaseConfig.database}.user WHERE idUser = '${id}'`, obj => {
        callback(obj)
    })
}
export let deleteCategory = (id, callback) => {
    let result = template(`DELETE FROM ${databaseConfig.database}.category WHERE id = '${id}'`, obj => {
        callback(obj)
    })
}
export let deleteProduct = (code, callback) => {
    template(`DELETE FROM ${databaseConfig.database}.review WHERE Product_code = '${code}'`, obj => {})
    template(`DELETE FROM ${databaseConfig.database}.component WHERE Product_code = '${code}'`, obj => {})
    let result = template(`DELETE FROM ${databaseConfig.database}.product WHERE code = '${code}'`, obj => {
        callback(obj)
    })
}
export let deleteComponent = (code, callback) => {
    let result = template(`DELETE FROM ${databaseConfig.database}.component WHERE code = '${code}'`, obj => {
        callback(obj)
    })
}
export let deleteReview = (code, idUser, callback) => {
    let result = template(`DELETE FROM ${databaseConfig.database}.review WHERE Product_code = '${code}' AND userId = '${idUser}'`, obj => {
        callback(obj)
    })
}
export let deleteBasketItem = (id, idUser, code, callback) => {
    let result = template(`DELETE FROM ${databaseConfig.database}.basketitem WHERE Product_code = '${code}' AND User_idUser = '${idUser}' AND idItem = '${id}'`, obj => {
        callback(obj)
    })
}