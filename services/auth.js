const jwt = require("jsonwebtoken");
const _ = require("underscore");


const JWTSECRET = "HELLO_WORLD";


function createJWToken(details) {
    if (!details)
      return null; // nothing passed

    if (!details.maxAge || typeof details.maxAge !== 'number') {
        details.maxAge = 3600;
    }
    console.log('details', details);

    details.sessionData = _.reduce(details.sessionData || {}, (memo, val, key) => {
        if (typeof val !== 'function' && key !== 'password') {
            memo[key] = val;
        }
        return memo;
    }, {});

    console.log('details.sessionData', details.sessionData);
    const token = jwt.sign({
        data: details.sessionData
    }, JWTSECRET, {
        expiresIn: details.maxAge,
        algorithm: 'HS256'
    });

    return token;
}

function verifyJWTToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWTSECRET, (err, decodedToken) => {
            if (err || !decodedToken) {
                return reject(err);
            }

            resolve(decodedToken);
        });
    });
}

module.exports = {
    verifyJWTToken: verifyJWTToken,
    createJWToken: createJWToken
};