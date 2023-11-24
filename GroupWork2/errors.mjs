export const ERROR_CODES = {
    INVALID_ARGUMENT: 1,
    NOT_FOUND: 2,
    USER_NOT_FOUND: 3,
    NOT_AUTHORIZED: 4,
    ALREADY_EXISTS: 5,
    INVALID: 6
}

export default {
    INVALID_ARGUMENT: (argName) => {
        return new Error(ERROR_CODES.INVALID_ARGUMENT, `Invalid argument ${argName}`)
    },
    NOT_FOUND: (what) => { 
        return new Error(ERROR_CODES.NOT_FOUND,`${what} not found`)
    },
    USER_NOT_FOUND: () => { 
        return new Error(ERROR_CODES.USER_NOT_FOUND,`User not found`)
    },
    NOT_AUTHORIZED: (who, what) => { 
        return new Error(ERROR_CODES.NOT_AUTHORIZED,`${who} has no access to ${what}`)
    },
    ALREADY_EXISTS: (what) => { 
        return new Error(ERROR_CODES.NOT_AUTHORIZED,`${what} already exists`)
    },
    INVALID: () => {
        return new Error(ERROR_CODES.INVALID, `Invalid response from the API`)
    }
}

function Error(code, description) {
    this.code = code
    this.description = description
}