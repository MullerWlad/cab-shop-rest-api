//for export template to database in category
export let template = (array, json) => {
    let map = new Map()
    array.forEach(element => {
        map[element] = ""
    })
    if (json) {
        return JSON.stringify(Object.fromEntries(map))
    }
    else {
        return Object.fromEntries(map)
    }
}

//for exporting data to client in json
export let toResponse = (map) => {
    return Object.fromEntries(map)
}