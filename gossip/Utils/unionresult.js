class GossipJson {
    constructor (code, msg) {
        this.msg = msg
        this.code = code
    }

    toJson() {
        return {"msg": this.msg, "code": this.code}
    }
}


class GossipResult extends GossipJson {
    constructor (code, msg, result) {
        super(code, msg)
        this.result = result
    }

    toJson() {
        return {"msg": this.msg, "code": this.code, "result": this.result}
    }
}