//import OnebindedLinear
import { OnebindedLinear } from "./OnebindedLinear.js"

//Exporting Branch
export class Branch {
    #folder = null
    #leaves = new OnebindedLinear()
    constructor (folder, ...leaves) {
        this.#folder = folder
        let array = [...leaves]
        array.forEach(item => {
            this.#leaves.appendNew(new Branch(item))
        });
    }
    
    get folder() {
        return this.#folder
    }
    set folder(folder) {
        this.#folder = folder
    }
    get leaves() {
        return this.#leaves.data
    }
    get folders() {
        return this.#leaves.data.map(item => {
            return item.#folder
        })
    }
    set leaves(leaves) {
        if (Array.isArray(leaves)) {
            let newLeaves = new OnebindedLinear()
            leaves.forEach(item => {
                newLeaves.appendNew(new Branch(item))
            })
            this.#leaves = newLeaves
        }
    }
    get power() {
        return this.#leaves.length
    }

    getLeaveBy = position => {
        return this.#leaves.getData(position)
    }
    insertLeaveAfter = (position, folder) => {
        this.#leaves.insertAfter(position, new Branch(folder))
    }
    deleteLeaveBy = position => {
        this.#leaves.delete(position)
    }
    setLeave = (folder, position) => {
        this.#leaves.setData(new Branch(folder), position)
    }
    appendLeave = folder => {
        this.#leaves.appendNew(new Branch(folder))
    }
    prependLeave = folder => {
        this.#leaves.prependNew(new Branch(folder))
    }
}