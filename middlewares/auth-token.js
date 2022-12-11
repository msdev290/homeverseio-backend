const admin = require('firebase-admin')

const checkAuthorize = (req, res, next) => {

    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        res.writeHead(403, {
            'Content-Type': 'application/json'
        });

        return res.end('Authorization header not present in the request')
    }
    const userToken = req.headers.authorization.split('Bearer ')[1];

    const auth = admin.auth();
    auth.verifyIdToken(userToken).then((decodedToken) => {
        if(decodedToken) {
            return next();
        }
    }).catch((err) => {
        res.writeHead(401, {
            'Content-Type': 'application/json',
        });

        return res.end('You are unauthorized to perform this action');
    });
}

module.exports = checkAuthorize;