import { ERROR_CODES } from './errors.mjs'

function HttpResponse(status, e) {
    this.status = status
    this.body = {
        code: e.code,
        error: e.description
    }
}

export default function(e) {
    switch(e.code) {
        case ERROR_CODES.INVALID_ARGUMENT: return new HttpResponse(400, e)
        case ERROR_CODES.NOT_FOUND: return new HttpResponse(404, e)
        case ERROR_CODES.USER_NOT_FOUND: return new HttpResponse(401, e)
        case ERROR_CODES.NOT_AUTHORIZED: return new HttpResponse(401, e)
        case ERROR_CODES.ALREADY_EXISTS: return new HttpResponse(400, e)
        case ERROR_CODES.INVALID: return new HttpResponse(400, e)
        default: return new HttpResponse(500, "Internal server error. Contact your teacher!")
    }
}