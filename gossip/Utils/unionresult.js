const result = function (code, msg, data) {
    if (data) {
        return {"code": code, "msg": msg, "data": data}
    } else {
        return {"code": code, "msg": msg}
    }
}

module.exports = result

