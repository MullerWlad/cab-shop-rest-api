// Linear onebinded list
export class OnebindedLinear {
    #data = {
        next: null
    }
    constructor () {
        //use arguments of constructor like an array
        for (var i = 0; i < arguments.length; i++)
            this.appendNew(arguments[i])
    }

    #throwList = () => {
        var list = this.#data;
        var count = 0;
        while (list.next !== null) { list = list.next; count += 1 }
        return [list, count--]
    }
    #getObject = (count_) => {
        var count = count_
        var list = this.#data.next;
        while (count > 0) {
            list = list?.next;
            count -= 1
        }
        return list
    }
    #setNext = (next, count_) => {
        var count = count_ + 1;
        var code = "this.#data";
        while (count > 0){
            code += ".next"
            count -= 1
        }
        eval(code).next = next
    }

    appendNew = (data) => {
        this.#throwList()[0].next = {
            next: null,
            data: data
        }
    }
    prependNew = (data) => {
        var shift = this.#data.next;
        this.#data.next = null;
        this.appendNew(data);
        this.#data.next.next = shift
    }
    setData = (data, count_) => {
        var count = count_ + 1;
        var code = "this.#data";
        while (count > 0){
            code += ".next"
            count -= 1
        }
        eval(code).data = data
    }
    delete = (count_) => {
        var count = count_;
        var code = "this.#data";
        if (count_ < this.length && count_ >= 0) {
            while (count > 0){
                code += ".next"
                count -= 1
            }
            eval(code).next = eval(code).next.next
        }
    }
    insertAfter = (position, data) => {
        var pos = position;
        var code = "this.#data.next";
        var secondPart;
        if (position >= 0 && position < this.length) {
            while (pos > 0) {
                code += ".next"
                pos--;
            }
            secondPart = eval(code).next;
            eval(code).next = null;
            this.appendNew(data)
            this.#setNext(secondPart, position + 1)
        }
    }

    get data() {
        var result = [];
        for(var i = 0; i < this.length; i++)
            result.push(this.getData(i))
        return result
    }
    get primaryData() {
        return this.#data.next
    }
    get length() {
        return this.#throwList()[1]
    }
    getData = (count) => {
        if (count < 0 || count > this.length)
            return undefined
        else
            return this.#getObject(count)?.data;
    }
}