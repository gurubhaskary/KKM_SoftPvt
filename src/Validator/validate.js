//===================== Checking the input value is Valid or Invalid =====================//
const valid = function (value) {
    if (typeof value == "number" || typeof value == "undefined" || typeof value == null) { return false }
    if (typeof value == "string" && value.trim().length == 0) { return false }
    return true
}

const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0;
};

//===================== Checking the input value with Regex =====================//
const regForName = function (value) { return (/^[A-Z][a-z]{1,}(?: [A-Z][a-z]+){0,}$/gm).test(value) }


const regForPassword= function (value) { return (/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()]).{8,15}$/).test(value) }

//=====================Module Export=====================//
module.exports = { valid, regForName, regForPassword, isValidRequestBody}