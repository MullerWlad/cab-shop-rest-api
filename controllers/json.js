import fs from 'fs'

//reading
export let readJson = (path) => {
    return JSON.parse(fs.readFileSync(path, 'utf-8'))
}

//writting
export let writeJson = (path, obj) => {
    fs.writeFileSync(path, JSON.stringify(obj, null, '   '));
}

//refreshing with callback
export let refreshJson = (path, end) => {
    let obj = readJson(path)
    end(obj)
    writeJson(path, obj)
}